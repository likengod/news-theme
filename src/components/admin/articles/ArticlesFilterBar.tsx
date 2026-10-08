import React from "react";
import { Search, Loader2, Trash2, RotateCcw } from "lucide-react";
import { sections } from "@/lib/news-data";

import { useCategories } from "@/components/site/AdSettingsContext";

interface ArticlesFilterBarProps {
  query: string;
  setQuery: (q: string) => void;
  debouncedQuery: string;
  category: string;
  setCategory: (cat: string) => void;
  selectedCount: number;
  currentStatus?: string;
  trashCount?: number;
  onRequestBulkDelete: () => void;
  onRequestBulkRestore?: () => void;
  onRequestEmptyTrash?: () => void;
}

export function ArticlesFilterBar({
  query,
  setQuery,
  debouncedQuery,
  category,
  setCategory,
  selectedCount,
  currentStatus,
  trashCount,
  onRequestBulkDelete,
  onRequestBulkRestore,
  onRequestEmptyTrash,
}: ArticlesFilterBarProps) {
  const dbCats = useCategories();
  const allCategoryOptions = React.useMemo(() => {
    if (dbCats && dbCats.length > 0) {
      const names = dbCats.map((c) => c?.name?.trim()).filter(Boolean) as string[];
      return Array.from(new Set(names));
    }
    return sections;
  }, [dbCats]);

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
        {allCategoryOptions.map((s) => (
          <option key={s}>{s}</option>
        ))}
      </select>

      {currentStatus === "Trash" ? (
        <div className="flex flex-wrap items-center gap-2">
          {selectedCount > 0 && (
            <>
              <button
                type="button"
                onClick={onRequestBulkRestore}
                className="inline-flex items-center gap-1.5 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-700 hover:bg-emerald-100 transition-colors shadow-xs"
              >
                <RotateCcw className="h-3.5 w-3.5" /> Restore ({selectedCount})
              </button>
              <button
                type="button"
                onClick={onRequestBulkDelete}
                className="inline-flex items-center gap-1.5 rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-100 transition-colors shadow-xs"
              >
                <Trash2 className="h-3.5 w-3.5" /> Delete Permanently ({selectedCount})
              </button>
            </>
          )}
          {(trashCount ?? 0) > 0 && onRequestEmptyTrash && (
            <button
              type="button"
              onClick={onRequestEmptyTrash}
              className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200 transition-colors shadow-xs"
            >
              <Trash2 className="h-3.5 w-3.5" /> Empty Trash
            </button>
          )}
        </div>
      ) : (
        selectedCount > 0 && (
          <button
            type="button"
            onClick={onRequestBulkDelete}
            className="inline-flex items-center gap-2 rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700 hover:bg-rose-100 transition-colors shadow-xs"
          >
            <Trash2 className="h-3.5 w-3.5" /> Move to Trash ({selectedCount})
          </button>
        )
      )}
    </div>
  );
}
