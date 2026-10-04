import React from "react";
import { Layers } from "lucide-react";
import type { CategoryStat } from "./types";

interface CategoryStatsCardProps {
  categories: CategoryStat[];
  totalArticles: number;
}

const CATEGORY_COLORS = [
  "bg-blue-600",
  "bg-indigo-600",
  "bg-emerald-600",
  "bg-purple-600",
  "bg-amber-600",
  "bg-teal-600",
  "bg-rose-600",
  "bg-cyan-600",
];

export function CategoryStatsCard({ categories, totalArticles }: CategoryStatsCardProps) {
  const safeTotal = totalArticles > 0 ? totalArticles : 1;

  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Category Coverage &amp; Readership
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Real distribution of articles published across news categories.
          </p>
        </div>
        <Layers className="h-4 w-4 text-slate-400" />
      </div>

      {categories.length > 0 ? (
        <div className="mt-5 space-y-4">
          {categories.map((cat, idx) => {
            const pct = Math.min(100, Math.round((cat.count / safeTotal) * 100));
            const color = CATEGORY_COLORS[idx % CATEGORY_COLORS.length];
            return (
              <div key={cat.name} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {cat.name}
                  </span>
                  <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400">
                    <span>
                      <strong className="text-slate-900 dark:text-white font-bold">{cat.count}</strong> stories
                    </span>
                    {typeof cat.views === "number" && cat.views > 0 && (
                      <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                        {cat.views.toLocaleString()} views
                      </span>
                    )}
                    <span className="rounded-md bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 text-[10px] font-bold text-slate-600 dark:text-slate-400 w-9 text-center">
                      {pct}%
                    </span>
                  </div>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${color}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="mt-8 flex flex-col items-center justify-center text-center py-6">
          <div className="h-10 w-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 mb-2">
            <Layers className="h-5 w-5" />
          </div>
          <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            No categories populated yet
          </p>
          <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
            Category statistics will appear as articles are published.
          </p>
        </div>
      )}
    </div>
  );
}
