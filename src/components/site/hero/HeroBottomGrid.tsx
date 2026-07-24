import React from "react";
import { Link } from "@tanstack/react-router";
import { HeadlineArticle, MinRead } from "../HeadlineArticle";

export function HeroBottomGrid({ cfg, activeBottomItems }: any) {
  return (
    <div className="mt-10 border-t border-border pt-6">
      <h3
        className="mb-6 font-bold uppercase tracking-[0.25em]"
        style={{ color: cfg.heroTopStories.color, fontSize: `${cfg.heroTopStories.fontSize}px` }}
      >
        {cfg.heroTopStories.title}
      </h3>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
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

        <div className="divide-y divide-border">
          {activeBottomItems.slice(2, 5).map((item: any, idx: number) => (
            <div key={`${item.title}-${idx}`} className={idx === 0 ? "pb-5" : idx === 1 ? "py-5" : "pt-5"}>
              <HeadlineArticle item={item} dense />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}