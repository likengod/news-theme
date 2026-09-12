import React from "react";
import { top, grid, lead, viewsFor, formatViews, getArticleImage } from "@/lib/news-data";
import { useHomepageConfig } from "@/hooks/use-homepage-config";
import { articlesByCategory } from "@/lib/homepage-config";
import {
  leftItems,
  bottomItems,
  popularItems,
  opinionItems,
  cultureItems,
} from "@/lib/mock-news-data";
import { AnimatedContainer } from "@/components/ui/AnimatedContainer";

import { HeroSidebarLeft } from "./hero/HeroSidebarLeft";
import { HeroMain } from "./hero/HeroMain";
import { HeroBottomGrid } from "./hero/HeroBottomGrid";
import { HeroCultureRow } from "./hero/HeroCultureRow";
import { HeroSidebarRight } from "./hero/HeroSidebarRight";

function formatUtcDate(dateStr: string | Date): string {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "";
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  return `${months[d.getUTCMonth()]} ${d.getUTCDate()}, ${d.getUTCFullYear()}`;
}

export const HeroBoard = React.memo(function HeroBoard({
  articles = [],
  tags = [],
  usedIds,
}: {
  articles?: any[];
  tags?: any[];
  usedIds?: Set<number>;
}) {
  const cfg = useHomepageConfig();

  const hasDbArticles = articles.length > 0;
  const {
    activeLeads,
    activeLeftItems,
    activeBottomItems,
    activePopularItems,
    activeOpinionItems,
    activeCultureItems,
  } = React.useMemo(() => {
    const localUsed = new Set<number>();

    function getUnique(pool: any[], count: number, filterFn?: (a: any) => boolean) {
      const selected: any[] = [];
      for (const a of pool) {
        if (localUsed.has(a.id)) continue;
        if (filterFn && !filterFn(a)) continue;
        selected.push(a);
        localUsed.add(a.id);
        if (selected.length === count) break;
      }
      return selected;
    }

    // 1. Featured Leads (Slider)
    const featuredCategory = cfg?.heroFeatured?.category || "Auto (Latest)";
    const slideCount = cfg?.heroFeatured?.slideCount ?? 3;
    const leadArticles = getUnique(articles, slideCount, (a) => {
      if (!featuredCategory || featuredCategory === "Auto (Latest)") return true;
      return a.category?.toLowerCase() === featuredCategory.toLowerCase();
    });
    const leads = leadArticles.map((a, i) => ({
      kicker: a.category,
      title: a.title,
      dek: a.excerpt || a.content?.replace(/<[^>]*>/g, "").slice(0, 150) + "...",
      author: `By ${a.author || "Newsroom"}`,
      time: formatUtcDate(a.date),
      img: getArticleImage(a.featuredImage, i),
      views: a.views || 0,
      slug: a.slug,
    }));

    const leftArticles = getUnique(articles, 5);
    const left = leftArticles.map((a, i) => ({
      kicker: a.category,
      title: a.title,
      excerpt: a.excerpt || a.content?.replace(/<[^>]*>/g, "").slice(0, 100) + "...",
      img: i === 2 ? getArticleImage(a.featuredImage, i + 7) : undefined,
      slug: a.slug,
    }));

    const bottomArticles = getUnique(articles, 6);
    const bottom = bottomArticles.map((a, i) => ({
      kicker: a.category,
      title: a.title,
      excerpt: a.excerpt || a.content?.replace(/<[^>]*>/g, "").slice(0, 150) + "...",
      img: i < 2 ? getArticleImage(a.featuredImage, i + 12) : undefined,
      slug: a.slug,
    }));

    // 3. Popular
    const popularCategory = cfg?.heroPopular?.category || "Auto (Latest)";
    const popularArticles = getUnique(articles, 4, (a) => {
      if (!popularCategory || popularCategory === "Auto (Latest)") return true;
      return a.category?.toLowerCase() === popularCategory.toLowerCase();
    });
    const popular = popularArticles.map((a, i) => ({
      title: a.title,
      by: a.author || "Newsroom",
      img: getArticleImage(a.featuredImage, i + 18),
      views: a.views || 0,
      slug: a.slug,
    }));

    // 4. Opinion
    const opinionCategory = cfg?.heroOpinion?.category || "Opinion";
    const opinionArticles = getUnique(articles, 6, (a) => {
      if (!opinionCategory || opinionCategory === "Auto (Latest)") return true;
      return a.category?.toLowerCase() === opinionCategory.toLowerCase();
    });
    const opinion = opinionArticles.map((a, i) => ({
      title: a.title,
      by: a.author || "Newsroom",
      img: getArticleImage(a.featuredImage, i + 22),
      slug: a.slug,
      views: a.views || 0,
    }));

    // 5. Culture & Music row
    const cultureCategory = cfg?.heroCultureMusic?.category || "Auto (Latest)";
    const cultureArticles = getUnique(articles, 4, (a) => {
      if (!cultureCategory || cultureCategory === "Auto (Latest)") return true;
      return a.category?.toLowerCase() === cultureCategory.toLowerCase();
    });
    const culture = cultureArticles.map((a, i) => ({
      title: a.title,
      kicker: a.category,
      excerpt: a.excerpt || a.content?.replace(/<[^>]*>/g, "").slice(0, 80) + "...",
      date: formatUtcDate(a.date),
      img: getArticleImage(a.featuredImage, i + 28),
      slug: a.slug,
    }));

    return {
      activeLeads: leads,
      activeLeftItems: left,
      activeBottomItems: bottom,
      activePopularItems: popular,
      activeOpinionItems: opinion,
      activeCultureItems: culture,
    };
  }, [articles, cfg]);

  return (
    <AnimatedContainer className="border-b border-border py-4 md:py-8">
      <div className="grid gap-8 lg:grid-cols-12">
        <div className="lg:col-span-9">
          <div className="grid gap-8 lg:grid-cols-12">
            <div className="hidden lg:col-span-4 lg:block">
              <HeroSidebarLeft activeLeftItems={activeLeftItems} />
            </div>
            <HeroMain
              hasDbArticles={hasDbArticles}
              activeLeads={activeLeads}
              cfg={cfg}
              articlesByCategory={articlesByCategory}
            />
          </div>
          <HeroBottomGrid cfg={cfg} activeBottomItems={activeBottomItems} />
          <HeroCultureRow cfg={cfg} activeCultureItems={activeCultureItems} />
        </div>
        <HeroSidebarRight
          cfg={cfg}
          activeOpinionItems={activeOpinionItems}
          activePopularItems={activePopularItems}
          tags={tags}
        />
      </div>
    </AnimatedContainer>
  );
});
