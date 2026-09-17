import { Search } from "lucide-react";
import type { CommentRow } from "@/lib/comments.functions";

interface CommentFilterBarProps {
  tabs: Array<CommentRow["status"] | "All">;
  currentTab: CommentRow["status"] | "All";
  onTabChange: (tab: CommentRow["status"] | "All") => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function CommentFilterBar({
  tabs,
  currentTab,
  onTabChange,
  searchQuery,
  onSearchChange,
}: CommentFilterBarProps) {
  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 sm:gap-3 rounded-xl border border-slate-200 bg-white p-2.5 sm:p-3 shadow-sm">
      <div className="flex flex-wrap items-center gap-1 sm:gap-1.5">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => onTabChange(t)}
            className={`rounded-lg px-2.5 sm:px-3.5 py-1 sm:py-1.5 text-xs font-semibold transition whitespace-nowrap ${
              currentTab === t
                ? "bg-slate-900 text-white shadow-sm"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="relative w-full sm:w-64">
        <Search className="absolute left-2.5 sm:left-3 top-2 sm:top-2.5 h-3.5 w-3.5 sm:h-4 sm:w-4 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search comment content..."
          className="h-8 sm:h-9 w-full rounded-md border border-slate-200 pl-8 sm:pl-9 pr-3 text-xs sm:text-sm focus:border-slate-900 focus:outline-none"
        />
      </div>
    </div>
  );
}
