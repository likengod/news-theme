import { lazy } from "react";
import { createFileRoute } from "@tanstack/react-router";
import heroMarkets from "@/assets/hero-markets.webp";
import { Header } from "@/components/site/Header";
import { HeroBoard } from "@/components/site/HeroBoard";
import { Columnists } from "@/components/site/Columnists";
import { LazySection } from "@/components/site/LazySection";
import { getHomepageArticles } from "@/lib/articles.functions";
import { getTags } from "@/lib/taxonomy.functions";
import { getSiteSettingsServer } from "@/lib/site-content";
import { getArticleImage } from "@/lib/news-data";

// Below-the-fold sections: code-split so they aren't in the initial JS bundle.
const NewsGrid = lazy(() =>
  import("@/components/site/NewsGrid").then((m) => ({ default: m.NewsGrid })),
);
const ReelsSection = lazy(() =>
  import("@/components/site/ReelsSection").then((m) => ({ default: m.ReelsSection })),
);
const MarketsMagazine = lazy(() =>
  import("@/components/site/MarketsMagazine").then((m) => ({ default: m.MarketsMagazine })),
);
const Footer = lazy(() => import("@/components/site/Footer").then((m) => ({ default: m.Footer })));

const HOME_IMG = heroMarkets;
const HOME_TITLE = "News Theme – Breaking News | Finance | Business | Market";
const HOME_DESC =
  "Breaking news, market intelligence, and sharp business analysis from News Theme.";


export const Route = createFileRoute("/")({
  loader: async () => {
    try {
      const [articles, tags, settings] = await Promise.all([
        getHomepageArticles({ data: 25 }).catch((err) => {
          console.warn(
            "[Homepage Loader] getHomepageArticles fallback to empty:",
            err?.message || err,
          );
          return [];
        }),
        getTags().catch((err) => {
          console.warn("[Homepage Loader] getTags fallback to empty:", err?.message || err);
          return [];
        }),
        getSiteSettingsServer().catch(() => null),
      ]);
      return {
        articles: Array.isArray(articles) ? articles : [],
        tags: Array.isArray(tags) ? tags : [],
        settings,
      };
    } catch (err) {
      console.error("[Homepage Loader] Top-level error, rendering fallback:", err);
      return { articles: [], tags: [], settings: null };
    }
  },
  head: ({ loaderData }: any) => {
    const s = loaderData?.settings;
    const firstArticle = loaderData?.articles?.[0];
    const heroImage = firstArticle ? getArticleImage(firstArticle.featuredImage, 0) : HOME_IMG;
    const canonicalBase =
      s?.seoCanonicalBaseUrl?.trim()?.replace(/\/$/, "") ||
      (typeof process !== "undefined" && process.env?.APP_ORIGIN
        ? process.env.APP_ORIGIN.replace(/\/$/, "")
        : "") ||
      (typeof window !== "undefined" && window.location?.origin
        ? window.location.origin
        : "https://todaytripura.com");

    const canonicalUrl = `${canonicalBase}/`;

    const links: Array<Record<string, any>> = [{ rel: "canonical", href: canonicalUrl }];

    const siteTitle = s?.siteName || "News Theme";
    const title = s?.siteName
      ? `${s.siteName} – ${s.tagline || "Breaking News"}`
      : HOME_TITLE;
    const desc = s?.metaDescription || HOME_DESC;

    return {
      meta: [
        { title: title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        { property: "og:type", content: "website" },
        { property: "og:url", content: canonicalUrl },
        { property: "og:image", content: heroImage || HOME_IMG },
        { property: "og:image:width", content: "1200" },
        { property: "og:image:height", content: "630" },
        { property: "og:site_name", content: siteTitle },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: desc },
        { name: "twitter:image", content: heroImage || HOME_IMG },
      ],
      links,
    };
  },
  component: Home,
});

function Home() {
  const { articles: dbArticles, tags: dbTags } = Route.useLoaderData();
  const usedIds = new Set<number>();

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Above-the-fold: render immediately for fastest first paint */}
      <Header breakingArticles={dbArticles} />

      <main className="mx-auto max-w-7xl px-4 py-4 md:py-10">
        {/* On Mobile Devices (< md): Render Watch section directly below Header */}
        <div className="block md:hidden border-b border-border mb-2 pb-2">
          <Columnists hideTitle />
        </div>

        <HeroBoard articles={dbArticles} tags={dbTags} />

        {/* On Desktop Devices (>= md): Render Watch section after HeroBoard */}
        <div className="hidden md:block">
          <LazySection minHeight={420}>
            <Columnists />
          </LazySection>
        </div>

        <LazySection minHeight={600}>
          <NewsGrid articles={dbArticles} usedIds={usedIds} />
        </LazySection>

        <LazySection minHeight={480}>
          <ReelsSection />
        </LazySection>

        <LazySection minHeight={700}>
          <MarketsMagazine articles={dbArticles} usedIds={usedIds} />
        </LazySection>
      </main>

      <Footer />
    </div>
  );
}
