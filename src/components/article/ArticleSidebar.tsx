import { lazy, Suspense } from "react";
import { Link } from "@tanstack/react-router";
import { ArchiveFinder } from "@/components/site/ArchiveFinder";
import { slugify } from "@/lib/news-data";

const Advertisement = lazy(() => import("@/components/site/Advertisement"));

const FALLBACK_TRENDING = [
  "Fed Signals Pause on Cuts as Inflation Reignites in Core Services",
  "Bitcoin Tags Fresh High as Spot ETF Inflows Cross $50B Mark",
  "Nvidia's Blackwell Surge Pushes Hyperscaler Capex to $320B",
  "Goldman, JPMorgan Beat as Trading Desks Rake in Record Quarter",
  "Tesla Unveils Next-Gen Robotaxi With Full City Autonomy Demo",
  "ECB Holds but Lagarde Opens Door to a Spring Move",
];

type TrendingItem = {
  id?: number | string;
  slug: string;
  title: string;
  category?: string;
  featuredImage?: string;
  hero?: string;
};

type Props = {
  trending?: TrendingItem[];
  currentSlug?: string;
};

export function ArticleSidebar({ trending = [], currentSlug }: Props) {
  const activeItems = (trending || [])
    .filter((item) => item && item.slug && item.slug !== currentSlug)
    .slice(0, 6);

  return (
    <aside className="space-y-6 w-full min-w-0">
      {/* Top Banner Advertisement (ABP Ananda top right ad) */}
      <Suspense fallback={<div className="aspect-[300/250] w-full animate-pulse bg-muted rounded" />}>
        <Advertisement slot="ad3" aspectRatio="1/1" />
      </Suspense>

      {/* সেরা শিরোনাম / Top Headlines Section - ABP Ananda style */}
      <div className="w-full">
        <div className="mb-4 border-b-2 border-red-600 pb-1.5 flex items-center justify-between">
          <h3 className="text-base sm:text-lg font-bold text-slate-950 dark:text-white tracking-tight flex items-center gap-2">
            <span className="h-4 w-1 bg-red-600 rounded-sm inline-block" />
            সেরা শিরোনাম
          </h3>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Trending
          </span>
        </div>

        {activeItems.length > 0 ? (
          <div className="space-y-3.5">
            {activeItems.map((item) => {
              const img = item.featuredImage || item.hero;
              const firstCat = (item.category || "খবর").split(",")[0].trim();

              return (
                <article
                  key={item.slug}
                  className="group flex flex-col gap-1 border-b border-slate-100 dark:border-slate-800/80 pb-3 last:border-b-0"
                >
                  {firstCat && (
                    <span className="text-[11px] font-bold text-red-600 dark:text-red-500 uppercase tracking-wide">
                      {firstCat}
                    </span>
                  )}
                  <div className="flex items-start gap-3">
                    {img && (
                      <Link
                        to="/news/$slug"
                        params={{ slug: item.slug }}
                        className="shrink-0 overflow-hidden rounded bg-muted block"
                      >
                        <img
                          src={img}
                          alt={item.title}
                          className="h-16 w-24 object-cover transition-transform duration-300 group-hover:scale-105"
                          loading="lazy"
                        />
                      </Link>
                    )}
                    <Link
                      to="/news/$slug"
                      params={{ slug: item.slug }}
                      className="text-xs sm:text-sm font-semibold leading-snug text-slate-900 dark:text-slate-100 line-clamp-3 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors"
                    >
                      {item.title}
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <ol className="space-y-3">
            {FALLBACK_TRENDING.map((t, i) => (
              <li key={t} className="flex gap-3 border-b border-slate-100 dark:border-slate-800/60 pb-2.5 last:border-b-0">
                <span className="font-sans text-xl font-bold text-red-600 dark:text-red-500 shrink-0 w-6">
                  {i + 1}
                </span>
                <Link
                  to="/news/$slug"
                  params={{
                    slug: slugify(t),
                  }}
                  className="line-clamp-2 text-xs sm:text-sm font-semibold leading-snug text-slate-900 dark:text-slate-100 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                >
                  {t}
                </Link>
              </li>
            ))}
          </ol>
        )}
      </div>

      <ArchiveFinder />
    </aside>
  );
}
