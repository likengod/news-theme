import React from "react";
import { Link } from "@tanstack/react-router";
import { Share2, User } from "lucide-react";
import { Views } from "@/components/site/Views";

interface FeaturedArticlesProps {
  featured: any[];
}

export function FeaturedArticles({ featured }: FeaturedArticlesProps) {
  if (featured.length === 0) return null;

  return (
    <section className="grid grid-cols-1 gap-8 py-8 md:grid-cols-3">
      {featured.map((f) => (
        <article key={f.title} className="flex flex-col">
          <Link to="/news/$slug" params={{ slug: f.slug || "sample" }} className="group block overflow-hidden">
            {f.img ? (
              <img
                src={f.img}
                alt={f.title}
                loading="eager"
                // @ts-ignore
                fetchPriority="high"
                width={400}
                height={225}
                className="aspect-[16/9] w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="aspect-[16/9] w-full bg-slate-100 flex items-center justify-center text-slate-400">
                No Image
              </div>
            )}
          </Link>
          <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] font-semibold uppercase tracking-widest">
            {f.kickers.map((k: string) => (
              <span key={k} className="text-foreground">
                {k}
              </span>
            ))}
            <span className="text-muted-foreground normal-case tracking-normal">
              · {f.date}
            </span>
          </div>
          <h2 className="headline mt-2 font-serif text-xl font-bold leading-snug text-primary line-clamp-3">
            <Link to="/news/$slug" params={{ slug: f.slug || "sample" }} className="hover:underline">
              {f.title}
            </Link>
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground line-clamp-5">
            {f.excerpt}
          </p>
          {/* Author + Views + Share */}
          <div className="mt-3 flex items-center justify-between gap-2 text-[11px] text-muted-foreground">
            <div className="flex items-center gap-2.5">
              <span className="inline-flex items-center gap-1">
                <User className="h-3 w-3 shrink-0" />
                <span className="font-medium text-foreground">{f.author}</span>
              </span>
              <span>·</span>
              <Views count={f.views} />
            </div>
            <button
              type="button"
              aria-label="Share article"
              onClick={(e) => {
                e.preventDefault();
                if (navigator.share) {
                  navigator.share({ title: f.title, url: `/news/${f.slug}` });
                } else {
                  navigator.clipboard.writeText(window.location.origin + `/news/${f.slug}`);
                  alert("Link copied!");
                }
              }}
              className="flex items-center gap-1 rounded-md border border-slate-200 px-2 py-1 text-[11px] text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition-colors"
            >
              <Share2 className="h-3 w-3" />
              Share
            </button>
          </div>
        </article>
      ))}
    </section>
  );
}
