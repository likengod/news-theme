import React from "react";
import { Link } from "@tanstack/react-router";
import Advertisement from "@/components/site/Advertisement";
import { ArchiveFinder } from "@/components/site/ArchiveFinder";

interface CategorySidebarProps {
  latest: any[];
}

export function CategorySidebar({ latest }: CategorySidebarProps) {
  return (
    <aside className="space-y-8">
      {latest.length > 0 && (
        <div>
          <h4 className="mb-4 border-b-2 border-foreground pb-2 text-xs font-bold uppercase tracking-widest text-foreground">
            Latest Posts
          </h4>
          <ul className="space-y-4">
            {latest.map((l) => (
              <li key={l.title} className="grid grid-cols-[1fr_72px] gap-3">
                <div>
                  <Link
                    to="/news/$slug"
                    params={{ slug: l.slug || "sample" }}
                    className="headline block font-serif text-sm font-bold leading-snug text-primary hover:underline line-clamp-2"
                  >
                    {l.title}
                  </Link>
                  <p className="mt-1 text-[11px] uppercase tracking-widest text-muted-foreground normal-case tracking-normal">
                    {l.date}
                  </p>
                </div>
                <Link to="/news/$slug" params={{ slug: l.slug || "sample" }} className="block overflow-hidden">
                  {l.img ? (
                    <img
                      src={l.img}
                      alt={l.title}
                      loading="lazy"
                      decoding="async"
                      width={72}
                      height={72}
                      className="aspect-square w-full object-cover"
                    />
                  ) : (
                    <div className="aspect-square w-full bg-slate-100 flex items-center justify-center text-slate-400">
                      No Image
                    </div>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      <Advertisement slot="ad3" aspectRatio="3/4" />

      <ArchiveFinder />
    </aside>
  );
}
