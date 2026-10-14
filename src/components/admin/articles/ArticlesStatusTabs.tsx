import React from "react";
import { Files, CheckCircle2, CalendarClock, FileText, Clock, Trash2 } from "lucide-react";
import type { ArticleStatus } from "./types";

export const STATUS_TABS: { key: "All" | ArticleStatus; label: string; icon: typeof FileText }[] = [
  { key: "All", label: "All", icon: Files },
  { key: "Published", label: "Published", icon: CheckCircle2 },
  { key: "Scheduled", label: "Scheduled", icon: CalendarClock },
  { key: "Draft", label: "Drafts", icon: FileText },
  { key: "Review", label: "In Review", icon: Clock },
  { key: "Trash", label: "Trash", icon: Trash2 },
];

interface ArticlesStatusTabsProps {
  status: "All" | ArticleStatus;
  setStatus: (s: "All" | ArticleStatus) => void;
  total: number;
  allCount?: number;
  publishedCount?: number;
  scheduledCount?: number;
  draftCount?: number;
  reviewCount?: number;
  trashCount?: number;
}

export function ArticlesStatusTabs({
  status,
  setStatus,
  total,
  allCount = 0,
  publishedCount = 0,
  scheduledCount = 0,
  draftCount = 0,
  reviewCount = 0,
  trashCount = 0,
}: ArticlesStatusTabsProps) {
  const getBadgeCount = (key: string) => {
    switch (key) {
      case "All":
        return allCount;
      case "Published":
        return publishedCount;
      case "Scheduled":
        return scheduledCount;
      case "Draft":
        return draftCount;
      case "Review":
        return reviewCount;
      case "Trash":
        return trashCount;
      default:
        return 0;
    }
  };

  return (
    <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto rounded-xl border border-slate-200 bg-white p-1.5 sm:p-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
      {STATUS_TABS.map((t) => {
        const active = status === t.key;
        const Icon = t.icon;
        const isTrash = t.key === "Trash";
        const isScheduled = t.key === "Scheduled";
        const count = getBadgeCount(t.key);
        return (
          <button
            key={t.key}
            onClick={() => setStatus(t.key)}
            className={`inline-flex items-center gap-1.5 sm:gap-2 rounded-lg px-2.5 sm:px-3 py-1.5 text-xs sm:text-sm font-semibold transition-colors cursor-pointer shrink-0 whitespace-nowrap ${
              active
                ? isTrash
                  ? "bg-rose-700 text-white shadow-xs"
                  : isScheduled
                    ? "bg-blue-600 text-white shadow-xs"
                    : "bg-slate-900 text-white shadow-xs"
                : isTrash
                  ? "text-rose-600 hover:bg-rose-50"
                  : isScheduled
                    ? "text-blue-600 hover:bg-blue-50"
                    : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <Icon className="h-3.5 w-3.5 shrink-0" />
            <span>{t.label}</span>
            <span
              className={`rounded-full px-1.5 py-0.2 text-[10px] sm:text-[11px] font-bold ${
                active
                  ? "bg-white/20 text-white"
                  : isTrash
                    ? "bg-rose-100 text-rose-700"
                    : isScheduled
                      ? "bg-blue-100 text-blue-700"
                      : "bg-slate-100 text-slate-700"
              }`}
            >
              {count}
            </span>
          </button>
        );
      })}
      <span className="ml-auto shrink-0 rounded-full bg-slate-100 px-2.5 py-1 text-[11px] sm:text-xs font-semibold text-slate-600 whitespace-nowrap">
        {total} {status === "Trash" ? "in trash" : status === "Scheduled" ? "scheduled" : status === "Draft" ? "drafts" : status === "Review" ? "in review" : status === "Published" ? "published" : "total"}
      </span>
    </div>
  );
}
