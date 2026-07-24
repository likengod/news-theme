import React from "react";
import { Link } from "@tanstack/react-router";
import { Views } from "../Views";
import Advertisement from "../Advertisement";
import { ArchiveFinder } from "../ArchiveFinder";
import { SocialIcons } from "../SocialIcons";
import { viewsFor } from "@/lib/news-data";

export function HeroSidebarRight({ cfg, activeOpinionItems, activePopularItems, tags }: any) {
  return (
    <aside className="space-y-6 lg:col-span-3 lg:border-l lg:border-border lg:pl-6">
      <h3
        className="rule-top font-bold uppercase tracking-[0.25em]"
        style={{ color: cfg.heroOpinion.color, fontSize: `${cfg.heroOpinion.fontSize}px` }}
      >
        {cfg.heroOpinion.title}
      </h3>
      <ul className="space-y-5">
        {activeOpinionItems.map((o: any, i: number) => (
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

      <div style={{ width: 384, maxWidth: "100%" }}>
        <Advertisement slot="home1" label="Sponsored" aspectRatio="3 / 4" />
      </div>

      <div>
        <h3
          className="rule-top font-bold uppercase tracking-[0.25em]"
          style={{ color: cfg.heroPopular.color, fontSize: `${cfg.heroPopular.fontSize}px` }}
        >
          {cfg.heroPopular.title}
        </h3>
        <ul className="mt-4 space-y-4">
          {activePopularItems.map((p: any, i: number) => (
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

      <ArchiveFinder />

      <div className="hidden md:block">
        <div className="bg-foreground py-2 text-center text-xs font-bold uppercase tracking-[0.3em] text-background">
          Tags
        </div>
        <div className="mt-4 flex flex-wrap items-baseline gap-x-3 gap-y-2">
          {(tags.length > 0 
            ? tags.slice(0, 25).map((t: any, i: number) => {
                const presetSizes = ["text-sm", "text-lg font-bold", "text-sm", "text-sm", "text-sm", "text-2xl font-bold", "text-lg", "text-2xl font-bold", "text-lg", "text-xl font-bold", "text-sm", "text-lg font-bold", "text-sm", "text-base", "text-lg", "text-sm", "text-base font-bold", "text-sm", "text-lg", "text-base", "text-sm", "text-xl font-bold"];
                return { t: t.name, size: presetSizes[i % presetSizes.length] };
              })
            : [
                { t: "Author", size: "text-sm" }, { t: "Blog", size: "text-lg font-bold" }, { t: "History", size: "text-sm" }, { t: "Lifestyle", size: "text-sm" }, { t: "Music", size: "text-sm" }, { t: "Politics", size: "text-2xl font-bold" }, { t: "Travel", size: "text-lg" }, { t: "WordPress", size: "text-2xl font-bold" }, { t: "World", size: "text-lg" }, { t: "Markets", size: "text-xl font-bold" }, { t: "Crypto", size: "text-sm" }, { t: "Tech", size: "text-lg font-bold" }, { t: "Business", size: "text-sm" }, { t: "Startups", size: "text-base" }, { t: "Opinion", size: "text-lg" }, { t: "Sports", size: "text-sm" }, { t: "Health", size: "text-base font-bold" }, { t: "Science", size: "text-sm" }, { t: "Climate", size: "text-lg" }, { t: "Culture", size: "text-base" }, { t: "Film", size: "text-sm" }, { t: "Food", size: "text-xl font-bold" },
              ]
          ).map((tag: any) => (
            <a key={tag.t} href={`/search?q=${encodeURIComponent(tag.t)}`} className={`${tag.size} font-serif text-foreground hover:underline capitalize`}>
              {tag.t}
            </a>
          ))}
        </div>
      </div>

      <div>
        <div className="bg-foreground py-2 text-center text-xs font-bold uppercase tracking-[0.3em] text-background">
          Follow
        </div>
        <div className="mt-4 flex flex-nowrap items-center justify-center">
          <SocialIcons only={["facebook", "twitter", "youtube", "whatsapp", "telegram"]} size="md" />
        </div>
      </div>
    </aside>
  );
}