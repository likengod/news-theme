import React from "react";
import { Link } from "@tanstack/react-router";
import { formatViews, viewsFor } from "@/lib/news-data";

export function HeroCultureRow({ cfg, activeCultureItems }: any) {
  return (
    <div className="mt-10 border-t border-border pt-6">
      <h3
        className="mb-6 font-bold uppercase tracking-[0.25em]"
        style={{ color: cfg.heroCultureMusic.color, fontSize: `${cfg.heroCultureMusic.fontSize}px` }}
      >
        {cfg.heroCultureMusic.title}
      </h3>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {activeCultureItems.map((c: any, i: number) => (
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
  );
}