import { lazy, Suspense, useMemo, useState, useEffect } from "react";
import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { ReadingProgress } from "@/components/article/ReadingProgress";
import { ArticleHeader } from "@/components/article/ArticleHeader";
import { ArticleHero } from "@/components/article/ArticleHero";
import { ArticleBody } from "@/components/article/ArticleBody";
import { ArticleFooter } from "@/components/article/ArticleFooter";
import { ArticleSidebar } from "@/components/article/ArticleSidebar";
import { ArticleLeftNav } from "@/components/article/ArticleLeftNav";
import { ShareRail } from "@/components/article/ShareRail";
import { ArticleQrCard } from "@/components/article/ArticleQrCard";
import { ContentProtectionGuard } from "@/components/article/ContentProtectionGuard";
import { articleQueryOptions, type ArticlePageData } from "@/lib/article-data";
import { getRequestOrigin } from "@/lib/origin.functions";
import { useSiteSettings } from "@/components/site/AdSettingsContext";
import { getSiteSettingsServer, isEnterpriseLicense } from "@/lib/site-content/site-settings";
import { Lock, LogIn, AlertCircle, Sparkles } from "lucide-react";
import { getCurrentUserRole } from "@/lib/auth.functions";
import { getHomepageArticles } from "@/lib/articles.functions";
import { authClient as supabase } from "@/lib/auth-client";
import { trackRead } from "@/lib/user-actions-tracker";
import { PopupAd } from "@/components/site/PopupAd";

function ArticleError({ error, reset }: { error: Error; reset: () => void }) {
  const router = useRouter();
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold text-foreground">This article didn't load</h1>
        <p className="mt-2 text-sm text-muted-foreground">{error.message}</p>
        <div className="mt-6 flex justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
          >
            Try again
          </button>
          <Link to="/" className="rounded-md border border-input px-4 py-2 text-sm font-medium">
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ArticleNotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold text-foreground">Article not found</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          The article you requested could not be located.
        </p>
        <Link
          to="/"
          className="mt-6 inline-block rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
        >
          Back to home
        </Link>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/news/$slug")({
  loader: async ({ params, context }) => {
    try {
      const [data, origin, settings, trendingArticles] = await Promise.all([
        context.queryClient.ensureQueryData(articleQueryOptions(params.slug)).catch(() => null),
        getRequestOrigin().catch(() => ""),
        getSiteSettingsServer().catch(() => null),
        getHomepageArticles({ data: 8 }).catch(() => []),
      ]);
      const siteName = settings?.siteName || "Today Tripura";
      return {
        data,
        origin,
        siteName,
        trendingArticles: Array.isArray(trendingArticles) ? trendingArticles : [],
      };
    } catch (err) {
      console.warn("[Article loader] Error:", err);
      return { data: null, origin: "", siteName: "Today Tripura", trendingArticles: [] };
    }
  },
  head: ({ loaderData }) => {
    const siteName = loaderData?.siteName || "Today Tripura";
    if (!loaderData || !loaderData.data) {
      return {
        meta: [{ title: `Article Not Found – ${siteName}` }, { name: "robots", content: "noindex" }],
      };
    }

    const { data, origin } = loaderData;
    const absImg = (data.hero || "").startsWith("http") ? data.hero : `${origin}${data.hero || ""}`;
    const url = `${origin}/news/${data.slug}`;

    return {
      meta: [
        { title: `${data.title} – ${siteName}` },
        { name: "description", content: data.excerpt },
        { name: "robots", content: "index,follow" },
        { name: "author", content: data.author },
        { property: "og:title", content: data.title },
        { property: "og:description", content: data.excerpt },
        { property: "og:type", content: "article" },
        { property: "og:url", content: url },
        { property: "og:image", content: absImg },
        { property: "og:image:width", content: "1200" },
        { property: "og:image:height", content: "630" },
        { property: "og:site_name", content: siteName },
        { property: "article:published_time", content: data.publishedISO },
        { property: "article:modified_time", content: data.modifiedISO },
        { property: "article:author", content: data.author },
        { property: "article:section", content: data.category },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: data.title },
        { name: "twitter:description", content: data.excerpt },
        { name: "twitter:image", content: absImg },
      ],
      links: [
        { rel: "canonical", href: url },
        ...(data.hero && typeof data.hero === "string" && data.hero.trim()
          ? [{ rel: "preload", as: "image", href: absImg, fetchPriority: "high" }]
          : []),
      ],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "NewsArticle",
            headline: data.title,
            image: [absImg],
            datePublished: data.publishedISO,
            dateModified: data.modifiedISO,
            author: [{ "@type": "Person", name: data.author }],
            publisher: {
              "@type": "Organization",
              name: siteName,
              logo: { "@type": "ImageObject", url: `${origin}/favicon.ico` },
            },
            mainEntityOfPage: { "@type": "WebPage", "@id": url },
            description: data.excerpt,
          }),
        },
      ],
    };
  },
  errorComponent: ArticleError,
  notFoundComponent: ArticleNotFound,
  component: ArticlePage,
});

function ArticlePage() {
  const { slug } = Route.useParams();
  const { data } = useSuspenseQuery(articleQueryOptions(slug));
  const { origin, trendingArticles } = Route.useLoaderData();
  const settings = useSiteSettings();
  const siteName = settings?.siteName || "Today Tripura";
  const shareUrl = useMemo(() => `${origin}/news/${slug}`, [origin, slug]);

  const [userRole, setUserRole] = useState<string | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: sessionData }) => {
      if (sessionData.session?.user) {
        trackRead(sessionData.session.user.id, slug);
      }
    });
  }, [slug]);

  useEffect(() => {
    if (!data) return;
    const article = data;
    async function checkAccess() {
      if (article.access_level !== "Premium") {
        setCheckingAuth(false);
        return;
      }
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        const token = sessionData.session?.access_token;
        if (token) {
          const res = await getCurrentUserRole({ data: token });
          setUserRole(res.role);
        }
      } catch (err) {
        console.error("Failed to fetch user access permissions:", err);
      } finally {
        setCheckingAuth(false);
      }
    }
    checkAccess();
  }, [data?.access_level]);

  const isAuthorized = useMemo(() => {
    if (!data || data.access_level !== "Premium") return true;
    if (checkingAuth) return false;
    return (
      userRole === "admin" ||
      userRole === "editor" ||
      userRole === "author" ||
      userRole === "journalist" ||
      userRole === "premium" ||
      userRole === "subscriber"
    );
  }, [data, checkingAuth, userRole]);

  if (!data) {
    return <ArticleNotFound />;
  }

  const heroCaption = data.imageCaption?.trim() || "";
  const heroCredit = data.imageCredit?.trim() || siteName;

  const isEnterprise = isEnterpriseLicense(settings);
  const isLeftNavVisible = Boolean(settings?.showArticleLeftNav && isEnterprise);
  const isRightSidebarVisible = settings?.showArticleRightSidebar !== false;

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-clip w-full max-w-full">
      <ContentProtectionGuard />
      <ReadingProgress />
      <Header />

      <main
        className={`mx-auto px-3 sm:px-4 pt-3 pb-12 w-full max-w-full min-w-0 ${
          isLeftNavVisible || isRightSidebarVisible ? "max-w-7xl" : "max-w-4xl"
        }`}
      >
        <style>{`
          .article-post-container {
            display: flex;
            flex-direction: column;
            gap: 1.5rem;
            width: 100%;
            min-width: 0;
            align-items: flex-start;
          }
          @media (min-width: 1024px) {
            .article-post-container {
              flex-direction: row !important;
              gap: 2rem !important;
            }
            .article-post-main {
              flex: 1 1 0% !important;
              min-width: 0 !important;
              max-width: 100% !important;
              width: auto !important;
            }
            .article-post-sidebar {
              flex: 0 0 320px !important;
              width: 320px !important;
              max-width: 320px !important;
              min-width: 320px !important;
            }
          }
          @media (min-width: 1280px) {
            .article-post-sidebar {
              flex: 0 0 340px !important;
              width: 340px !important;
              max-width: 340px !important;
              min-width: 340px !important;
            }
            .article-post-leftnav {
              flex: 0 0 140px !important;
              width: 140px !important;
              max-width: 140px !important;
              min-width: 140px !important;
            }
          }
        `}</style>
        <div className="article-post-container flex flex-col lg:flex-row gap-6 lg:gap-8 w-full max-w-full min-w-0 items-start">
          {isLeftNavVisible && (
            <div className="article-post-leftnav shrink-0">
              <ArticleLeftNav />
            </div>
          )}
          <article className="article-post-main relative w-full min-w-0 flex-1">
            <ArticleHeader
              title={data.title}
              author={data.author}
              date={data.date}
              views={data.views}
              category={data.category}
              deck={data.excerpt}
              shareUrl={shareUrl}
            />

            <ArticleHero
              src={data.hero}
              alt={data.title}
              caption={heroCaption}
              credit={heroCredit}
            />

            <div className="w-full pt-1">
              {checkingAuth ? (
                <div className="flex flex-col items-center justify-center py-12 text-slate-400 space-y-4">
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-400 border-t-transparent" />
                  <p className="text-sm">Verifying access credentials...</p>
                </div>
              ) : isAuthorized ? (
                <>
                  <ArticleBody
                    paragraphs={data.paragraphs}
                    midImage={
                      data.midImage
                        ? {
                            src: data.midImage,
                            caption: heroCaption,
                            credit: heroCredit,
                          }
                        : undefined
                    }
                  />
                  {/* Social share bar at the end of the article, with Share on Left and QR Code Card on Right */}
                  <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-slate-200 dark:border-slate-800 pt-4 pb-1">
                    <ShareRail url={shareUrl} title={data.title} />
                    <ArticleQrCard url={shareUrl} />
                  </div>
                </>
              ) : (
                <div className="my-8 rounded-xl border border-amber-200 bg-amber-50/50 p-6 text-center shadow-sm dark:border-amber-900/30 dark:bg-amber-950/20">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400">
                    <Lock className="h-6 w-6" />
                  </div>
                  <h3 className="mt-4 text-base font-bold text-slate-900 dark:text-white">
                    Premium Content Lock
                  </h3>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                    This report is restricted to Premium readers. Only Administrators, Editors, and
                    Authors are authorized to access this content.
                  </p>

                  {!userRole ? (
                    <div className="mt-6">
                      <Link
                        to="/auth"
                        className="inline-flex items-center gap-2 rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 transition"
                      >
                        <LogIn className="h-4 w-4" /> Sign in to verify access
                      </Link>
                    </div>
                  ) : (
                    <div className="mt-6 space-y-4">
                      <div>
                        <Link
                          to="/subscription"
                          className="inline-flex items-center gap-2 rounded-md bg-amber-600 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-700 transition shadow-sm"
                        >
                          <Sparkles className="h-4 w-4 animate-pulse" /> Upgrade to Premium
                        </Link>
                      </div>
                      <div className="flex items-center justify-center gap-2 text-xs text-amber-700 dark:text-amber-400">
                        <AlertCircle className="h-4 w-4" />
                        <span>
                          Logged in as role: <strong className="uppercase">{userRole}</strong>{" "}
                          (Unauthorized)
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {isAuthorized && (
                <ArticleFooter
                  slug={slug}
                  author={data.author}
                  articleTitle={data.title}
                  tags={data.tags}
                  category={data.category}
                />
              )}
            </div>
          </article>

          {isRightSidebarVisible && (
            <div className="article-post-sidebar w-full lg:w-[320px] xl:w-[340px] shrink-0">
              <ArticleSidebar trending={trendingArticles} currentSlug={slug} />
            </div>
          )}
        </div>
      </main>

      <Footer />
      <PopupAd />
    </div>
  );
}
