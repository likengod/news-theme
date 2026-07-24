import React from "react";
import { Link } from "@tanstack/react-router";
import { LiveVideo } from "../LiveVideo";
import { MinRead } from "../HeadlineArticle";

export function HeroMain({ hasDbArticles, activeLead, lead, cfg, articlesByCategory }: any) {
  const featured = hasDbArticles ? activeLead : (articlesByCategory(cfg.heroFeatured.category)[0] ?? lead);
  const kicker = hasDbArticles ? activeLead.kicker : (featured.kicker ?? "Featured");
  const slug = hasDbArticles ? activeLead.slug : (featured.slug || "sample");

  return (
    <div className="space-y-8 lg:col-span-8 lg:border-l lg:border-border lg:pl-8">
      <LiveVideo />
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
            {featured.dek ?? featured.excerpt ?? ""}
          </p>
          <MinRead seed={featured.title} kicker={kicker} />
        </Link>
      </article>
    </div>
  );
}