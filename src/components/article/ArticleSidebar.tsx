import { lazy, Suspense } from "react";
import { Link } from "@tanstack/react-router";
import { ArchiveFinder } from "@/components/site/ArchiveFinder";
import { ArticleSocialChannels } from "./ArticleSocialChannels";
import { slugify } from "@/lib/news-data";
import { useSiteSettings } from "@/components/site/AdSettingsContext";
import Advertisement from "@/components/site/Advertisement";

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
  excerpt?: string;
  content?: string;
};

function getArticleSnippet(item?: { content?: string; excerpt?: string } | null): string {
  if (!item) return "";
  let raw = "";
  if (item.content && item.content.replace(/<[^>]+>/g, "").trim().length > 20) {
    raw = item.content;
  } else if (item.excerpt) {
    raw = item.excerpt;
  } else {
    raw = item.content || "";
  }

  return raw
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&#8203;/gi, "")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s+/g, " ")
    .trim();
}

type Props = {
  trending?: TrendingItem[];
  currentSlug?: string;
};

export function ArticleSidebar({ trending = [], currentSlug }: Props) {
  const settings = useSiteSettings();
  const items = settings?.articleRightSidebarItems || {};

  const showAd3 = items.ad3 !== false;
  const showTrending = items.trendingNews !== false;
  const showArchive = items.archiveFinder !== false;
  const showSocial = items.whatsappChannel !== false || items.telegramChannel !== false;

  const activeItems = (trending || [])
    .filter((item) => item && item.slug && item.slug !== currentSlug)
    .slice(0, 6);

  const displayItems =
    activeItems.length > 0
      ? activeItems
      : FALLBACK_TRENDING.slice(0, 5).map((title) => ({
          slug: slugify(title),
          title,
          category: "ট্রেন্ডিং",
          hero: undefined,
          featuredImage: undefined,
        }));

  if (!showAd3 && !showTrending && !showArchive && !showSocial) {
    return null;
  }

  return (
    <aside className="space-y-6 w-full min-w-0">
      {/* Top Banner Advertisement (ABP Ananda top right ad) */}
      {showAd3 && (
        <Advertisement slot="ad3" aspectRatio="1/1" />
      )}

      {/* সেরা শিরোনাম / Top Headlines Section - ABP Ananda style */}
      {showTrending && displayItems.length > 0 && (
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

          <div className="space-y-3.5">
            {displayItems.map((item) => {
              const rawImg = item.featuredImage || item.hero;
              const img = typeof rawImg === 'string' && rawImg.trim() !== '' ? rawImg.trim() : null;
              const firstCat = (item.category || "খবর").split(",")[0].trim();
              const snippet = getArticleSnippet(item);

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
                    <div className="min-w-0 flex-1">
                      <Link
                        to="/news/$slug"
                        params={{ slug: item.slug }}
                        className="block"
                      >
                        <p className="text-xs sm:text-sm font-semibold leading-snug text-slate-900 dark:text-slate-100 line-clamp-2 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                          {item.title}
                        </p>
                        {snippet && (
                          <p className="mt-1 text-[12px] leading-relaxed text-muted-foreground line-clamp-2">
                            {snippet}
                          </p>
                        )}
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      )}

      {showArchive && <ArchiveFinder />}

      {/* WhatsApp & Telegram Community Channel Buttons */}
      <ArticleSocialChannels />
    </aside>
  );
}
