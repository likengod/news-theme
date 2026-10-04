import React from "react";
import { Clock, Eye, Newspaper, ExternalLink } from "lucide-react";
import type { ArticleItem } from "./types";

interface RecentArticlesCardProps {
  articles: ArticleItem[];
}

export function RecentArticlesCard({ articles }: RecentArticlesCardProps) {
  const list = articles.slice(0, 6);

  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Recent Published Stories
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Latest stories published to the live news feed.
          </p>
        </div>
        <Clock className="h-4 w-4 text-slate-400" />
      </div>

      {list.length > 0 ? (
        <div className="mt-4 divide-y divide-slate-100 dark:divide-slate-800">
          {list.map((a) => (
            <div key={a.id || a.title} className="py-3 flex items-center justify-between gap-3">
              <div className="min-w-0 flex-1">
                <a
                  href={`/article/${a.slug || a.id}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-semibold text-slate-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 line-clamp-1 flex items-center gap-1 group"
                >
                  <span className="truncate">{a.title}</span>
                  <ExternalLink className="h-3 w-3 shrink-0 opacity-0 group-hover:opacity-100 transition" />
                </a>
                <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                  <span className="font-medium text-slate-700 dark:text-slate-300">{a.category || "General"}</span>
                  <span>•</span>
                  <span>{a.date ? new Date(a.date).toLocaleDateString() : "Recent"}</span>
                </div>
              </div>
              <div className="flex items-center gap-1 text-xs font-semibold text-slate-700 dark:text-slate-300 shrink-0">
                <Eye className="h-3.5 w-3.5 text-slate-400" />
                <span>{(a.views || 0).toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-8 flex flex-col items-center justify-center text-center py-6">
          <Newspaper className="h-8 w-8 text-slate-300 dark:text-slate-600 mb-2" />
          <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            No published articles yet
          </p>
        </div>
      )}
    </div>
  );
}
