import React, { useState } from "react";
import { Eye, ChevronDown, ChevronUp, Sparkles, ExternalLink } from "lucide-react";
import type { ArticleItem } from "./types";

interface TopArticlesTableProps {
  articles: ArticleItem[];
  featuredArticles: ArticleItem[];
}

export function TopArticlesTable({ articles, featuredArticles }: TopArticlesTableProps) {
  const [filterMode, setFilterMode] = useState<"all" | "featured">("all");
  const [displayCount, setDisplayCount] = useState(5);

  const activeList = filterMode === "featured" ? featuredArticles : articles;
  const visibleArticles = activeList.slice(0, displayCount);
  const hasMore = displayCount < activeList.length;

  const totalViewsInSet = activeList.reduce((acc, a) => acc + (a.views || 0), 0) || 1;

  const handleLoadMore = () => {
    setDisplayCount((prev) => Math.min(prev + 5, activeList.length));
  };

  const handleCollapse = () => {
    setDisplayCount(5);
  };

  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs">
      {/* Header & Filter Toggle */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Page Views by Page Title
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            This report is based on 100% of tracked newsroom reader sessions.
          </p>
        </div>

        {/* Filter Toggle: All vs Featured */}
        <div className="flex items-center gap-1 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 p-0.5">
          <button
            onClick={() => {
              setFilterMode("all");
              setDisplayCount(5);
            }}
            className={`rounded-md px-2.5 py-1 text-xs font-semibold transition cursor-pointer ${
              filterMode === "all"
                ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs"
                : "text-slate-500 hover:text-slate-800 dark:text-slate-400"
            }`}
          >
            All Posts
          </button>
          <button
            onClick={() => {
              setFilterMode("featured");
              setDisplayCount(5);
            }}
            className={`inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-semibold transition cursor-pointer ${
              filterMode === "featured"
                ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-2xs"
                : "text-slate-500 hover:text-slate-800 dark:text-slate-400"
            }`}
          >
            <Sparkles className="h-3 w-3" />
            <span>Featured ({featuredArticles.length})</span>
          </button>
        </div>
      </div>

      {/* List of articles (matching reference screenshot layout) */}
      <div className="mt-3 divide-y divide-slate-100 dark:divide-slate-800/80">
        {visibleArticles.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-400">
            No articles found for this filter.
          </div>
        ) : (
          visibleArticles.map((art, idx) => {
            const views = art.views || 0;
            const pct = Math.max(1, Math.min(100, Math.round((views / totalViewsInSet) * 100)));
            const path = art.slug ? `/news/${art.slug}` : `/news/${art.id || idx}`;

            return (
              <div key={art.id || idx} className="py-3 group transition">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="truncate text-sm font-semibold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition">
                        {art.title}
                      </p>
                      {art.featured && (
                        <span className="shrink-0 rounded-md bg-amber-50 dark:bg-amber-950/60 px-1.5 py-0.5 text-[10px] font-bold text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                          Featured
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      <span className="font-mono text-slate-400 truncate max-w-[200px] sm:max-w-xs">{path}</span>
                      <span>·</span>
                      <span className="font-medium text-slate-600 dark:text-slate-300">{art.category || "General"}</span>
                      {art.date && (
                        <>
                          <span>·</span>
                          <span>{new Date(art.date).toLocaleDateString()}</span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
                      {views.toLocaleString()}
                    </span>
                    <p className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">
                      {pct}%
                    </p>
                  </div>
                </div>

                {/* Progress bar indicating volume */}
                <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                  <div
                    className="h-full bg-indigo-500 rounded-full transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Load More / Collapse Controls (as requested by user) */}
      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
        <span className="text-slate-500 dark:text-slate-400">
          Showing <strong>{visibleArticles.length}</strong> of <strong>{activeList.length}</strong> articles
        </span>

        <div className="flex items-center gap-2">
          {hasMore && (
            <button
              onClick={handleLoadMore}
              className="inline-flex items-center gap-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 px-3 py-1.5 font-semibold text-slate-800 dark:text-slate-200 transition cursor-pointer"
            >
              <span>Load More</span>
              <ChevronDown className="h-3.5 w-3.5" />
            </button>
          )}

          {displayCount > 5 && (
            <button
              onClick={handleCollapse}
              className="inline-flex items-center gap-1 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 px-2 py-1.5 font-medium transition cursor-pointer"
            >
              <span>Show Less</span>
              <ChevronUp className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
