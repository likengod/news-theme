import React from "react";
import { Link } from "@tanstack/react-router";
import { Share2, User } from "lucide-react";
import { Views } from "@/components/site/Views";
import Advertisement from "@/components/site/Advertisement";

interface ArticleListProps {
  list: any[];
}

export function ArticleList({ list }: ArticleListProps) {
  if (list.length === 0) return null;

  return (
    <div className="divide-y divide-border">
      {list.map((p, i) => (
        <React.Fragment key={p.title}>
          <article className="grid grid-cols-[140px_1fr] gap-5 py-6 first:pt-0 md:grid-cols-[200px_1fr]">
            <Link to="/news/$slug" params={{ slug: p.slug || "sample" }} className="block overflow-hidden">
              {p.img ? (
                <img
                  src={p.img}
                  alt={p.title}
                  loading="lazy"
                  decoding="async"
                  width={200}
                  height={112}
                  className="aspect-[16/9] w-full object-cover"
                />
              ) : (
                <div className="aspect-[16/9] w-full bg-slate-100 flex items-center justify-center text-slate-400">
                  No Image
                </div>
              )}
            </Link>
            <div>
              <h3 className="headline font-serif text-lg font-bold leading-snug text-primary line-clamp-2">
                <Link to="/news/$slug" params={{ slug: p.slug || "sample" }} className="hover:underline">
                  {p.title}
                </Link>
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground line-clamp-2">
                {p.excerpt}
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] uppercase tracking-widest">
                <span className="text-muted-foreground normal-case tracking-normal">
                  {p.date}
                </span>
                {p.tags.map((t: string) => (
                  <span key={t} className="font-semibold text-foreground">
                    · {t}
                  </span>
                ))}
              </div>
              {/* Author + Views + Share */}
              <div className="mt-2 flex items-center justify-between gap-2 text-[11px] text-muted-foreground">
                <div className="flex items-center gap-2.5">
                  <span className="inline-flex items-center gap-1">
                    <User className="h-3 w-3 shrink-0" />
                    <span className="font-medium text-foreground">{p.author}</span>
                  </span>
                  <span>·</span>
                  <Views count={p.views} />
                </div>
                <button
                  type="button"
                  aria-label="Share article"
                  onClick={(e) => {
                    e.preventDefault();
                    if (navigator.share) {
                      navigator.share({ title: p.title, url: `/news/${p.slug}` });
                    } else {
                      navigator.clipboard.writeText(
                        window.location.origin + `/news/${p.slug}`,
                      );
                      alert("Link copied!");
                    }
                  }}
                  className="flex items-center gap-1 rounded-md border border-slate-200 px-2 py-1 text-[11px] text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition-colors"
                >
                  <Share2 className="h-3 w-3" />
                  Share
                </button>
              </div>
            </div>
          </article>
          {(i + 1) % 3 === 0 && (
            <div className="py-6">
              <Advertisement slot="leaderboard" aspectRatio="728 / 90" />
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}
