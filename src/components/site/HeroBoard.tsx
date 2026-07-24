import React, { useEffect, useState } from "react";
import { top, grid, lead, viewsFor, formatViews, getArticleImage } from "@/lib/news-data";
import { LiveVideo } from "./LiveVideo";
import { Views } from "./Views";
import Advertisement from "./Advertisement";
import { ArchiveFinder } from "./ArchiveFinder";
import { useHomepageConfig } from "@/hooks/use-homepage-config";
import { articlesByCategory } from "@/lib/homepage-config";
import { SocialIcons } from "./SocialIcons";



import { HeadlineArticle, MinRead } from "./HeadlineArticle";
import { MarketChart } from "./MarketChart";
import { leftItems, bottomItems, popularItems, opinionItems, cultureItems } from "@/lib/mock-news-data";
import { AnimatedContainer } from "@/components/ui/AnimatedContainer";
import { Link } from "@tanstack/react-router";

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

  // Helper to extract unique articles
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

  // 1. Featured Lead
  const featuredCategory = cfg.heroFeatured.category || "Auto (Latest)";
  const leadArticles = getUnique(articles, 1, (a) => {
    if (!featuredCategory || featuredCategory === "Auto (Latest)") return true;
    return a.category?.toLowerCase() === featuredCategory.toLowerCase();
  });
  const leadDb = leadArticles[0];
  const activeLead = leadDb ? {
    kicker: leadDb.category,
    title: leadDb.title,
    dek: leadDb.excerpt || leadDb.content?.replace(/<[^>]*>/g, '').slice(0, 150) + "...",
    author: `By ${leadDb.author || "Newsroom"}`,
    time: formatUtcDate(leadDb.date),
    img: getArticleImage(leadDb.featuredImage, 0),
    views: leadDb.views || 0,
    slug: leadDb.slug
  } : {
    ...lead,
    slug: "sample"
  };

  // 2. Top Stories (activeTop)
  const topStoriesCategory = cfg.heroTopStories.category || "Auto (Latest)";
  const topArticles = getUnique(articles, 3, (a) => {
    if (!topStoriesCategory || topStoriesCategory === "Auto (Latest)") return true;
    return a.category?.toLowerCase() === topStoriesCategory.toLowerCase();
  });
  const activeTop = Array.from({ length: 3 }).map((_, i) => {
    const a = topArticles[i];
    const t = top[i];
    if (a) {
      return {
        kicker: a.category,
        title: a.title,
        time: formatUtcDate(a.date),
        img: getArticleImage(a.featuredImage, i + 1),
        views: a.views || 0,
        slug: a.slug
      };
    }
    return { ...t, slug: "sample" };
  });

  const gridArticles = getUnique(articles, 3);
  const activeGrid = Array.from({ length: 3 }).map((_, i) => {
    const a = gridArticles[i];
    const g = grid[i];
    if (a) {
      return {
        kicker: a.category,
        title: a.title,
        excerpt: a.excerpt || a.content?.replace(/<[^>]*>/g, '').slice(0, 100) + "...",
        img: getArticleImage(a.featuredImage, i + 4),
        author: a.author || "Newsroom",
        views: a.views || 0,
        slug: a.slug
      };
    }
    return { ...g, slug: "sample" };
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
        {/* MAIN AREA: left headlines + center hero + bottom 4 cards */}
        <div className="lg:col-span-9">
          <div className="grid gap-8 lg:grid-cols-12">
            {/* LEFT — stacked headline list */}
            <div className="divide-y divide-border lg:col-span-4">
              {activeLeftItems.map((it, i) => (
                <div key={`${it.title}-${i}`} className={i === 0 ? "pb-3" : "py-3"}>
                  <HeadlineArticle item={it} dense />
                </div>
              ))}
            </div>

            {/* CENTER — hero image + chart */}
            <div className="space-y-8 lg:col-span-8 lg:border-l lg:border-border lg:pl-8">
              <LiveVideo />

              {(() => {
                const featured = hasDbArticles ? activeLead : (articlesByCategory(cfg.heroFeatured.category)[0] ?? lead);
                const kicker = hasDbArticles ? activeLead.kicker : (featured.kicker ?? "Featured");
                const slug = hasDbArticles ? activeLead.slug : (featured.slug || "sample");
                return (
                  <article>
                    <h3
                      className="mb-3 font-bold uppercase tracking-[0.25em]"
                      style={{ color: cfg.heroFeatured.color, fontSize: `${cfg.heroFeatured.fontSize}px` }}
                    >
                      {cfg.heroFeatured.title}
                    </h3>
                    <Link to="/news/$slug" params={{ slug: slug || "sample" }} className="group block">
                      <div className="overflow-hidden">
                        <img
                          src={featured.img}
                          alt={featured.title}
                          loading="eager"
                          // @ts-ignore
                          fetchPriority="high"
                          width={800}
                          height={500}
                          className="aspect-[16/10] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                      <h2 className="headline mt-4 text-2xl text-foreground group-hover:underline md:text-3xl">
                        {featured.title}
                      </h2>
                      <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                        {(featured as { dek?: string; excerpt?: string }).dek ?? (featured as { excerpt?: string }).excerpt ?? ""}
                      </p>
                      <MinRead seed={featured.title} kicker={kicker} />
                    </Link>
                  </article>
                );
              })()}


            </div>
          </div>

          {/* BOTTOM ROW — Politics-style section: 2 image cards + stacked text column */}
          <div className="mt-10 border-t border-border pt-6">
            <h3
              className="mb-6 font-bold uppercase tracking-[0.25em]"
              style={{ color: cfg.heroTopStories.color, fontSize: `${cfg.heroTopStories.fontSize}px` }}
            >
              {cfg.heroTopStories.title}
            </h3>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {/* Card 1 — image on top */}
              <Link to="/news/$slug" params={{ slug: activeBottomItems[0].slug || "sample" }} className="group block">
                {activeBottomItems[0].img && (
                  <div className="overflow-hidden">
                    <img
                      src={activeBottomItems[0].img}
                      alt={activeBottomItems[0].title}
                      loading="lazy"
                      decoding="async"
                      className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                )}
                <h3 className="headline mt-4 text-xl text-foreground group-hover:underline [-webkit-line-clamp:3] [max-height:none]">
                  {activeBottomItems[0].title}
                </h3>
                <p className="mt-2 text-sm leading-snug text-muted-foreground [-webkit-line-clamp:6] [display:-webkit-box] [-webkit-box-orient:vertical] overflow-hidden [&::first-letter]:font-serif [&::first-letter]:float-left [&::first-letter]:mr-2 [&::first-letter]:text-5xl [&::first-letter]:font-bold [&::first-letter]:leading-[0.9] [&::first-letter]:text-foreground">
                  {activeBottomItems[0].excerpt}
                </p>
                <MinRead seed={activeBottomItems[0].title} kicker={activeBottomItems[0].kicker} />
              </Link>

              {/* Card 2 — image on top */}
              <Link to="/news/$slug" params={{ slug: activeBottomItems[1].slug || "sample" }} className="group block">
                {activeBottomItems[1].img && (
                  <div className="overflow-hidden">
                    <img
                      src={activeBottomItems[1].img}
                      alt={activeBottomItems[1].title}
                      loading="lazy"
                      decoding="async"
                      className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                )}
                <h3 className="headline mt-4 text-xl text-foreground group-hover:underline line-clamp-2 [-webkit-line-clamp:2] [max-height:none]">
                  {activeBottomItems[1].title}
                </h3>
                <p className="mt-2 text-sm leading-snug text-muted-foreground [-webkit-line-clamp:6] [display:-webkit-box] [-webkit-box-orient:vertical] overflow-hidden [&::first-letter]:font-serif [&::first-letter]:float-left [&::first-letter]:mr-2 [&::first-letter]:text-5xl [&::first-letter]:font-bold [&::first-letter]:leading-[0.9] [&::first-letter]:text-foreground">
                  {activeBottomItems[1].excerpt}
                </p>
                <MinRead seed={activeBottomItems[1].title} kicker={activeBottomItems[1].kicker} />
              </Link>

              {/* Column 3 — stacked text-only stories */}
              <div className="divide-y divide-border">
                {activeBottomItems.slice(2, 5).map((item, idx) => (
                  <div key={`${item.title}-${idx}`} className={idx === 0 ? "pb-5" : idx === 1 ? "py-5" : "pt-5"}>
                    <HeadlineArticle item={item} dense />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* MUSIC / CULTURE row — 4 columns with image + views overlay */}
          <div className="mt-10 border-t border-border pt-6">
            <h3
              className="mb-6 font-bold uppercase tracking-[0.25em]"
              style={{ color: cfg.heroCultureMusic.color, fontSize: `${cfg.heroCultureMusic.fontSize}px` }}
            >
              {cfg.heroCultureMusic.title}
            </h3>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {activeCultureItems.map((c, i) => (
                <Link key={`${c.title}-${i}`} to="/news/$slug" params={{ slug: c.slug || "sample" }} className="group block">
                  <div className="relative overflow-hidden">
                    <img
                      src={c.img}
                      alt={c.title}
                      loading="lazy"
                      decoding="async"
                      className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {c.play && (
                      <span className="absolute inset-0 grid place-items-center">
                        <span className="grid h-12 w-12 place-items-center rounded-full border-2 border-white/90 bg-black/30 text-white">▶</span>
                      </span>
                    )}
                    <span className="absolute bottom-2 left-2 bg-black px-2 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-white">
                      {formatViews(c.views || viewsFor(c.title))} views
                    </span>
                  </div>
                  <h4 className="headline mt-3 text-lg leading-tight text-foreground group-hover:underline">
                    {c.title}
                  </h4>
                  <p className="mt-2 line-clamp-3 text-sm leading-snug text-muted-foreground">
                    {c.excerpt}
                  </p>
                  <p className="mt-3 flex items-center gap-2 text-[11px] uppercase tracking-wider text-muted-foreground">
                    <span>{c.date}</span>
                    <span>·</span>
                    <span className="kicker text-[10px]">{c.kicker}</span>
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT — opinion / signup / most commented / popular */}
        <aside className="space-y-6 lg:col-span-3 lg:border-l lg:border-border lg:pl-6">
          <h3
            className="rule-top font-bold uppercase tracking-[0.25em]"
            style={{ color: cfg.heroOpinion.color, fontSize: `${cfg.heroOpinion.fontSize}px` }}
          >
            {cfg.heroOpinion.title}
          </h3>
          <ul className="space-y-5">
            {activeOpinionItems.map((o, i) => (
              <li key={`${o.title}-${i}`}>
                <Link to="/news/$slug" params={{ slug: o.slug || "sample" }} className="group flex gap-3">
                  <img src={o.img} alt="" loading="lazy" decoding="async" className="h-14 w-14 shrink-0 object-cover" />
                  <div>
                    <p className="font-serif text-sm font-bold leading-snug text-foreground group-hover:underline line-clamp-2">
                      {o.title}
                    </p>
                    <p className="mt-1 text-[11px] text-muted-foreground">
                      by {o.by} · <Views count={o.views || viewsFor(o.title)} />
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>

          {/* Advertisement — auto-rotates between images/videos */}
          <div style={{ width: 384, maxWidth: "100%" }}>
            <Advertisement
              slot="home1"
              label="Sponsored"
              aspectRatio="3 / 4"
            />
          </div>

          {/* Popular */}
          <div>
            <h3
              className="rule-top font-bold uppercase tracking-[0.25em]"
              style={{ color: cfg.heroPopular.color, fontSize: `${cfg.heroPopular.fontSize}px` }}
            >
              {cfg.heroPopular.title}
            </h3>
            <ul className="mt-4 space-y-4">
              {activePopularItems.map((p, i) => (
                <li key={`${p.title}-${i}`}>
                  <Link to="/news/$slug" params={{ slug: p.slug || "sample" }} className="group flex gap-3">
                    <img src={p.img} alt="" loading="lazy" decoding="async" className="h-14 w-14 shrink-0 object-cover" />
                    <div>
                      <p className="font-serif text-sm font-bold leading-snug text-foreground group-hover:underline line-clamp-2">
                        {p.title}
                      </p>
                      <p className="mt-1 text-[11px] text-muted-foreground">
                        by {p.by} · <Views count={p.views || viewsFor(p.title)} />
                      </p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Archive finder */}
          <ArchiveFinder />

          {/* Tags */}
          <div className="hidden md:block">
            <div className="bg-foreground py-2 text-center text-xs font-bold uppercase tracking-[0.3em] text-background">
              Tags
            </div>
            <div className="mt-4 flex flex-wrap items-baseline gap-x-3 gap-y-2">
              {(tags.length > 0 
                ? tags.slice(0, 25).map((t: any, i: number) => {
                    const presetSizes = [
                      "text-sm",
                      "text-lg font-bold",
                      "text-sm",
                      "text-sm",
                      "text-sm",
                      "text-2xl font-bold",
                      "text-lg",
                      "text-2xl font-bold",
                      "text-lg",
                      "text-xl font-bold",
                      "text-sm",
                      "text-lg font-bold",
                      "text-sm",
                      "text-base",
                      "text-lg",
                      "text-sm",
                      "text-base font-bold",
                      "text-sm",
                      "text-lg",
                      "text-base",
                      "text-sm",
                      "text-xl font-bold",
                    ];
                    const size = presetSizes[i % presetSizes.length];
                    return {
                      t: t.name,
                      size
                    };
                  })
                : [
                    { t: "Author", size: "text-sm" },
                    { t: "Blog", size: "text-lg font-bold" },
                    { t: "History", size: "text-sm" },
                    { t: "Lifestyle", size: "text-sm" },
                    { t: "Music", size: "text-sm" },
                    { t: "Politics", size: "text-2xl font-bold" },
                    { t: "Travel", size: "text-lg" },
                    { t: "WordPress", size: "text-2xl font-bold" },
                    { t: "World", size: "text-lg" },
                    { t: "Markets", size: "text-xl font-bold" },
                    { t: "Crypto", size: "text-sm" },
                    { t: "Tech", size: "text-lg font-bold" },
                    { t: "Business", size: "text-sm" },
                    { t: "Startups", size: "text-base" },
                    { t: "Opinion", size: "text-lg" },
                    { t: "Sports", size: "text-sm" },
                    { t: "Health", size: "text-base font-bold" },
                    { t: "Science", size: "text-sm" },
                    { t: "Climate", size: "text-lg" },
                    { t: "Culture", size: "text-base" },
                    { t: "Film", size: "text-sm" },
                    { t: "Food", size: "text-xl font-bold" },
                  ]
              ).map((tag) => (
                <a 
                  key={tag.t} 
                  href={`/search?q=${encodeURIComponent(tag.t)}`} 
                  className={`${tag.size} font-serif text-foreground hover:underline capitalize`}
                >
                  {tag.t}
                </a>
              ))}
            </div>
          </div>

          {/* Follow */}
          <div>
            <div className="bg-foreground py-2 text-center text-xs font-bold uppercase tracking-[0.3em] text-background">
              Follow
            </div>
            <div className="mt-4 flex flex-nowrap items-center justify-center">
              <SocialIcons
                only={["facebook", "twitter", "youtube", "whatsapp", "telegram"]}
                size="md"
              />
            </div>

          </div>
        </aside>
      </div>
    </AnimatedContainer>
  );
});
