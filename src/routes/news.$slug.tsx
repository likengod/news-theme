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
import { ShareRail } from "@/components/article/ShareRail";
import { ArticleQrCard } from "@/components/article/ArticleQrCard";
import { ContentProtectionGuard } from "@/components/article/ContentProtectionGuard";
import { articleQueryOptions, type ArticlePageData } from "@/lib/article-data";
import { getRequestOrigin } from "@/lib/origin.functions";
import { Lock, LogIn, AlertCircle, Sparkles } from "lucide-react";
import { getCurrentUserRole } from "@/lib/auth.functions";
import { authClient as supabase } from "@/lib/auth-client";
import { trackRead } from "@/lib/user-actions-tracker";

const PopupAd = lazy(() =>
  import("@/components/site/PopupAd").then((m) => ({ default: m.PopupAd })),
);

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
          <Link
            to="/"
            className="rounded-md border border-input px-4 py-2 text-sm font-medium"
          >
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
    const [data, origin] = await Promise.all([
      context.queryClient.ensureQueryData(articleQueryOptions(params.slug)),
      getRequestOrigin(),
    ]);
    return { data, origin };
  },
  head: ({ loaderData }) => {
    if (!loaderData || !loaderData.data) {
      return {
        meta: [
          { title: "Article Not Found – News Theme" },
          { name: "robots", content: "noindex" },
        ],
      };
    }

    const { data, origin } = loaderData;
    const absImg = (data.hero || "").startsWith("http") ? data.hero : `${origin}${data.hero || ""}`;
    const url = `${origin}/news/${data.slug}`;

    return {
      meta: [
        { title: `${data.title} – News Theme` },
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
        { property: "og:site_name", content: "News Theme" },
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
        { rel: "preload", as: "image", href: data.hero, fetchPriority: "high" },
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
              name: "News Theme",
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
  const { origin } = Route.useLoaderData();
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
    async function checkAccess() {
      if (data.access_level !== "Premium") {
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
    return userRole === "admin" || userRole === "editor" || userRole === "author";
  }, [data, checkingAuth, userRole]);

  if (!data) {
    return <ArticleNotFound />;
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <ContentProtectionGuard />
      <ReadingProgress />
      <Header />
 
      <main className="mx-auto max-w-6xl px-4 pt-2 pb-8">
        <ArticleHeader
          title={data.title}
          author={data.author}
          date={data.date}
          views={data.views}
          category={data.category}
        />
 
        <div className="grid grid-cols-1 gap-10 pt-8 lg:grid-cols-[minmax(0,1fr)_300px]">
          <article className="relative">
            <ArticleHero
              src={data.hero}
              alt={data.title}
              caption="Rescuers and officials at the scene shortly after the incident."
              credit="News Theme"
            />

            <div className="mx-auto max-w-[720px] pt-4">
              {checkingAuth ? (
                <div className="flex flex-col items-center justify-center py-12 text-slate-400 space-y-4">
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-400 border-t-transparent" />
                  <p className="text-sm">Verifying access credentials...</p>
                </div>
              ) : isAuthorized ? (
                <>
                  <ArticleBody
                    paragraphs={data.paragraphs}
                    midImage={{
                      src: data.midImage,
                      caption: "Aid workers coordinating relief operations on the ground.",
                      credit: "News Theme",
                    }}
                  />
                  {/* Social share bar at the end of the article, with Share on Left and QR Code Card on Right */}
                  <div className="mt-6 flex flex-wrap items-center justify-between gap-3 pb-1">
                    <ShareRail url={shareUrl} title={data.title} />
                    <ArticleQrCard url={shareUrl} />
                  </div>
                </>
              ) : (
                <div className="my-8 rounded-xl border border-amber-200 bg-amber-50/50 p-6 text-center shadow-sm dark:border-amber-900/30 dark:bg-amber-950/20">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400">
                    <Lock className="h-6 w-6" />
                  </div>
                  <h3 className="mt-4 text-base font-bold text-slate-900 dark:text-white">Premium Content Lock</h3>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                    This report is restricted to Premium readers. Only Administrators, Editors, and Authors are authorized to access this content.
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
                        <span>Logged in as role: <strong className="uppercase">{userRole}</strong> (Unauthorized)</span>
                      </div>
                    </div>
                  )}
                </div>
              )}
 
              {isAuthorized && <ArticleFooter slug={slug} author={data.author} articleTitle={data.title} />}
            </div>
          </article>
 
          <ArticleSidebar />
        </div>
      </main>
 
      <Footer />
      <Suspense fallback={null}>
        <PopupAd />
      </Suspense>
    </div>
  );
}
