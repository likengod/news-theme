import { lazy, Suspense } from "react";
import { Link } from "@tanstack/react-router";
import { ArchiveFinder } from "@/components/site/ArchiveFinder";
import { loadAds, loadAdRotation } from "@/lib/site-content";

const Advertisement = lazy(() => import("@/components/site/Advertisement"));

const TRENDING = [
  "Fed Signals Pause on Cuts as Inflation Reignites in Core Services",
  "Bitcoin Tags Fresh High as Spot ETF Inflows Cross $50B Mark",
  "Nvidia's Blackwell Surge Pushes Hyperscaler Capex to $320B",
  "Goldman, JPMorgan Beat as Trading Desks Rake in Record Quarter",
  "Tesla Unveils Next-Gen Robotaxi With Full City Autonomy Demo",
  "ECB Holds but Lagarde Opens Door to a Spring Move",
];

export function ArticleSidebar() {
  return (
    <aside className="space-y-8">
      <Suspense fallback={<div className="aspect-[3/4] w-full animate-pulse bg-muted" />}>
        <Advertisement
          slot="ad3"
          aspectRatio="3/4"
        />
      </Suspense>

      <div>
        <h4 className="mb-4 border-b-2 border-foreground pb-2 text-xs font-bold uppercase tracking-widest text-foreground">
          Trending Stories
        </h4>
        <ol className="space-y-4">
          {TRENDING.map((t, i) => (
            <li key={t} className="flex gap-3">
              <span className="font-serif text-2xl font-bold text-muted-foreground">
                {i + 1}
              </span>
              <Link
                to="/news/$slug"
                params={{
                  slug: t.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
                }}
                className="headline line-clamp-3 font-serif text-sm font-bold leading-snug text-primary hover:underline"
              >
                {t}
              </Link>
            </li>
          ))}
        </ol>
      </div>

      <ArchiveFinder />
    </aside>
  );
}
