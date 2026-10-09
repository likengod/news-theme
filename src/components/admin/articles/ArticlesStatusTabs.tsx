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
    <div className="flex flex-wrap items-center gap-2 rounded-lg border border-slate-200 bg-white p-2">
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
            className={`inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-colors cursor-pointer ${
              active
                ? isTrash
                  ? "bg-rose-700 text-white"
                  : isScheduled
                    ? "bg-blue-600 text-white"
                    : "bg-slate-900 text-white"
                : isTrash
                  ? "text-rose-600 hover:bg-rose-50"
                  : isScheduled
                    ? "text-blue-600 hover:bg-blue-50"
                    : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <Icon className="h-3.5 w-3.5" />
            <span>{t.label}</span>
            <span
              className={`ml-1 rounded-full px-1.5 py-0.2 text-[11px] font-semibold ${
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
      <span className="ml-auto rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
        {total} {status === "Trash" ? "in trash" : status === "Scheduled" ? "scheduled" : status === "Draft" ? "drafts" : status === "Review" ? "in review" : status === "Published" ? "published" : "total"}
      </span>
    </div>
  );
}
