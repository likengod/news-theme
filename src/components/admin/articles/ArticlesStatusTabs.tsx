import React from "react";
import { Files, CheckCircle2, FileText, Clock, Trash2 } from "lucide-react";
import type { ArticleStatus } from "./types";

export const STATUS_TABS: { key: "All" | ArticleStatus; label: string; icon: typeof FileText }[] = [
  { key: "All", label: "All", icon: Files },
  { key: "Published", label: "Published", icon: CheckCircle2 },
  { key: "Draft", label: "Drafts", icon: FileText },
  { key: "Review", label: "In Review", icon: Clock },
  { key: "Trash", label: "Trash", icon: Trash2 },
];

interface ArticlesStatusTabsProps {
  status: "All" | ArticleStatus;
  setStatus: (s: "All" | ArticleStatus) => void;
  total: number;
  trashCount?: number;
}

export function ArticlesStatusTabs({ status, setStatus, total, trashCount = 0 }: ArticlesStatusTabsProps) {
  return (
    <div className="flex flex-wrap items-center gap-2 rounded-lg border border-slate-200 bg-white p-2">
      {STATUS_TABS.map((t) => {
        const active = status === t.key;
        const Icon = t.icon;
        const isTrash = t.key === "Trash";
        return (
          <button
            key={t.key}
            onClick={() => setStatus(t.key)}
            className={`inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-colors cursor-pointer ${
              active
                ? isTrash
                  ? "bg-rose-700 text-white"
                  : "bg-slate-900 text-white"
                : isTrash
                  ? "text-rose-600 hover:bg-rose-50"
                  : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <Icon className="h-3.5 w-3.5" />
            <span>{t.label}</span>
            {isTrash && trashCount > 0 && (
              <span
                className={`ml-1 rounded-full px-1.5 py-0.2 text-[11px] font-semibold ${
                  active ? "bg-white text-rose-700" : "bg-rose-100 text-rose-700"
                }`}
              >
                {trashCount}
              </span>
            )}
          </button>
        );
      })}
      <span className="ml-auto rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
        {total} {status === "Trash" ? "in trash" : "total"}
      </span>
    </div>
  );
}
