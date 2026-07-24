import { lazy } from "react";
import { createFileRoute } from "@tanstack/react-router";
import heroMarkets from "@/assets/hero-markets.jpg";
import { Header } from "@/components/site/Header";
import { HeroBoard } from "@/components/site/HeroBoard";
import { LazySection } from "@/components/site/LazySection";
import { useQuery } from "@tanstack/react-query";
import { getHomepageArticles } from "@/lib/articles.functions";
import { getTags } from "@/lib/taxonomy.functions";
import { Newspaper } from "lucide-react";

// Below-the-fold sections: code-split so they aren't in the initial JS bundle.
const Columnists = lazy(() =>
  import("@/components/site/Columnists").then((m) => ({ default: m.Columnists })),
);
const NewsGrid = lazy(() =>
  import("@/components/site/NewsGrid").then((m) => ({ default: m.NewsGrid })),
);
const ReelsSection = lazy(() =>
  import("@/components/site/ReelsSection").then((m) => ({ default: m.ReelsSection })),
);
const MarketsMagazine = lazy(() =>
  import("@/components/site/MarketsMagazine").then((m) => ({ default: m.MarketsMagazine })),
);
const Footer = lazy(() =>
  import("@/components/site/Footer").then((m) => ({ default: m.Footer })),
);

const SITE_URL = "https://gorillatechsolution.com";
const HOME_IMG = `${SITE_URL}${heroMarkets}`;
const HOME_TITLE = "News Theme – Breaking News | Finance | Business | Market";
const HOME_DESC = "Breaking news, market intelligence, and sharp business analysis from News Theme.";

export const Route = createFileRoute("/")({
  loader: async () => {
    const [articles, tags] = await Promise.all([
      getHomepageArticles({ data: 50 }),
      getTags()
    ]);
    return { articles, tags };
  },
  head: () => ({
    meta: [
      { title: HOME_TITLE },
      { name: "description", content: HOME_DESC },
      { property: "og:title", content: HOME_TITLE },
      { property: "og:description", content: HOME_DESC },
      { property: "og:type", content: "website" },
      { property: "og:url", content: SITE_URL },
      { property: "og:image", content: HOME_IMG },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:site_name", content: "News Theme" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: HOME_TITLE },
      { name: "twitter:description", content: HOME_DESC },
      { name: "twitter:image", content: HOME_IMG },
    ],
    links: [{ rel: "canonical", href: SITE_URL }],
  }),
  component: Home,
});

function Home() {
  const { articles: dbArticles, tags: dbTags } = Route.useLoaderData();
  const usedIds = new Set<number>();

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Above-the-fold: render immediately for fastest first paint */}
      <Header />

      <main className="mx-auto max-w-7xl px-4 py-4 md:py-10">
        {/* On Mobile Devices (< md): Render Watch section directly below Header */}
        <div className="block md:hidden border-b border-border mb-2 pb-2">
          <Columnists />
        </div>

        <HeroBoard articles={dbArticles} tags={dbTags} usedIds={usedIds} />

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
          <ReelsSection articles={dbArticles} />
        </LazySection>

        <LazySection minHeight={700}>
          <MarketsMagazine articles={dbArticles} usedIds={usedIds} />
        </LazySection>
      </main>

      <LazySection minHeight={400}>
        <Footer />
      </LazySection>
    </div>
  );
}
