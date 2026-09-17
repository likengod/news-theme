import React from "react";
import { Search, Loader2, Trash2 } from "lucide-react";
import { sections } from "@/lib/news-data";

interface ArticlesFilterBarProps {
  query: string;
  setQuery: (q: string) => void;
  debouncedQuery: string;
  category: string;
  setCategory: (cat: string) => void;
  selectedCount: number;
  onRequestBulkDelete: () => void;
}

export function ArticlesFilterBar({
  query,
  setQuery,
  debouncedQuery,
  category,
  setCategory,
  selectedCount,
  onRequestBulkDelete,
}: ArticlesFilterBarProps) {
  return (
    <div className="flex flex-wrap items-center gap-3 rounded-lg border border-slate-200 bg-white p-3">
      <div className="relative flex-1 min-w-[200px]">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search articles"
          placeholder="Search articles..."
          className="w-full rounded-md border border-slate-200 py-2 pl-9 pr-3 text-sm focus:border-slate-900 focus:outline-none"
        />
        {query && debouncedQuery !== query && (
          <Loader2 className="absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 animate-spin text-slate-400" />
        )}
      </div>

      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        aria-label="Filter articles by category"
        className="rounded-md border border-slate-200 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none"
      >
        <option>All</option>
        {sections.map((s) => (
          <option key={s}>{s}</option>
        ))}
      </select>

      {selectedCount > 0 && (
        <button
          onClick={onRequestBulkDelete}
          className="inline-flex items-center gap-2 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-100"
        >
          <Trash2 className="h-3.5 w-3.5" /> Delete ({selectedCount})
        </button>
      )}
    </div>
  );
}
