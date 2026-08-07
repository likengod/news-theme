import React from "react";
import { top, grid, lead, viewsFor, formatViews, getArticleImage } from "@/lib/news-data";
import { useHomepageConfig } from "@/hooks/use-homepage-config";
import { articlesByCategory } from "@/lib/homepage-config";
import { leftItems, bottomItems, popularItems, opinionItems, cultureItems } from "@/lib/mock-news-data";
import { AnimatedContainer } from "@/components/ui/AnimatedContainer";

import { HeroSidebarLeft } from "./hero/HeroSidebarLeft";
import { HeroMain } from "./hero/HeroMain";
import { HeroBottomGrid } from "./hero/HeroBottomGrid";
import { HeroCultureRow } from "./hero/HeroCultureRow";
import { HeroSidebarRight } from "./hero/HeroSidebarRight";

function formatUtcDate(dateStr: string | Date): string {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "";
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${months[d.getUTCMonth()]} ${d.getUTCDate()}, ${d.getUTCFullYear()}`;
}

export const HeroBoard = React.memo(function HeroBoard({ articles = [], tags = [], usedIds }: { articles?: any[]; tags?: any[]; usedIds?: Set<number> }) {
  const cfg = useHomepageConfig();

  const hasDbArticles = articles.length > 0;
  const localUsed = new Set<number>(usedIds);

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
  const featuredCategory = cfg.heroFeatured.category || "Auto (Latest)";
  const leadArticles = getUnique(articles, 3, (a) => {
    if (!featuredCategory || featuredCategory === "Auto (Latest)") return true;
    return a.category?.toLowerCase() === featuredCategory.toLowerCase();
  });
  const activeLeads = Array.from({ length: 3 }).map((_, i) => {
    const a = leadArticles[i];
    if (a) {
      return {
        kicker: a.category,
        title: a.title,
        dek: a.excerpt || a.content?.replace(/<[^>]*>/g, '').slice(0, 150) + "...",
        author: `By ${a.author || "Newsroom"}`,
        time: formatUtcDate(a.date),
        img: getArticleImage(a.featuredImage, i),
        views: a.views || 0,
        slug: a.slug
      };
    }
    return { ...lead, slug: "sample", img: getArticleImage("", i) };
  });

  const leftArticles = getUnique(articles, 5);
  const activeLeftItems = Array.from({ length: 5 }).map((_, i) => {
    const a = leftArticles[i];
    const l = leftItems[i];
    if (a) {
      return {
        kicker: a.category,
        title: a.title,
        excerpt: a.excerpt || a.content?.replace(/<[^>]*>/g, '').slice(0, 100) + "...",
        img: i === 2 ? getArticleImage(a.featuredImage, i + 7) : undefined,
        slug: a.slug
      };
    }
    return { ...l, slug: "sample" };
  });

  const bottomArticles = getUnique(articles, 6);
  const activeBottomItems = Array.from({ length: 6 }).map((_, i) => {
    const a = bottomArticles[i];
    const b = bottomItems[i];
    if (a) {
      return {
        kicker: a.category,
        title: a.title,
        excerpt: a.excerpt || a.content?.replace(/<[^>]*>/g, '').slice(0, 150) + "...",
        img: i < 2 ? getArticleImage(a.featuredImage, i + 12) : undefined,
        slug: a.slug
      };
    }
    return { ...b, slug: "sample", img: i < 2 ? grid[i % grid.length].img : undefined };
  });

  // 3. Popular
  const popularCategory = cfg.heroPopular.category || "Auto (Latest)";
  const popularArticles = getUnique(articles, 4, (a) => {
    if (!popularCategory || popularCategory === "Auto (Latest)") return true;
    return a.category?.toLowerCase() === popularCategory.toLowerCase();
  });
  const activePopularItems = Array.from({ length: 4 }).map((_, i) => {
    const a = popularArticles[i];
    const p = popularItems[i];
    if (a) {
      return {
        title: a.title,
        by: a.author || "Newsroom",
        img: getArticleImage(a.featuredImage, i + 18),
        views: a.views || 0,
        slug: a.slug
      };
    }
    return { ...p, slug: "sample" };
  });

  // 4. Opinion
  const opinionCategory = cfg.heroOpinion.category || "Opinion";
  const opinionArticles = getUnique(articles, 6, (a) => {
    if (!opinionCategory || opinionCategory === "Auto (Latest)") return true;
    return a.category?.toLowerCase() === opinionCategory.toLowerCase();
  });
  const activeOpinionItems = Array.from({ length: 6 }).map((_, i) => {
    const a = opinionArticles[i];
    const o = opinionItems[i];
    if (a) {
      return {
        title: a.title,
        by: a.author || "Newsroom",
        img: getArticleImage(a.featuredImage, i + 22),
        slug: a.slug
      };
    }
    return o;
  });

  // 5. Culture & Music row
  const cultureCategory = cfg.heroCultureMusic.category || "Auto (Latest)";
  const cultureArticles = getUnique(articles, 4, (a) => {
    if (!cultureCategory || cultureCategory === "Auto (Latest)") return true;
    return a.category?.toLowerCase() === cultureCategory.toLowerCase();
  });
  const activeCultureItems = Array.from({ length: 4 }).map((_, i) => {
    const a = cultureArticles[i];
    const c = cultureItems[i];
    if (a) {
      return {
        title: a.title,
        excerpt: a.excerpt || a.content?.replace(/<[^>]*>/g, '').slice(0, 100) + "...",
        date: formatUtcDate(a.date),
        kicker: a.category,
        img: getArticleImage(a.featuredImage, i + 28),
        play: i === 0,
        slug: a.slug
      };
    }
    return c;
  });

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

