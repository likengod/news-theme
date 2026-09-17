import React from "react";
import { Filter } from "lucide-react";
import { TYPE_META } from "./types";

interface InboxFilterBarProps {
  filterType: string;
  setFilterType: (type: string) => void;
  filterStatus: string;
  setFilterStatus: (status: string) => void;
  isEnterprisePlus: boolean;
}

export function InboxFilterBar({
  filterType,
  setFilterType,
  filterStatus,
  setFilterStatus,
  isEnterprisePlus,
}: InboxFilterBarProps) {
  return (
    <div className="flex flex-wrap items-center gap-3 rounded-xl border border-slate-200 bg-white p-3">
      <Filter className="h-4 w-4 text-slate-400" />
      <span className="text-xs font-semibold uppercase tracking-widest text-slate-400">
        Filters
      </span>

      <div className="flex flex-wrap gap-1">
        {["all", "contact", "work_with_us", "withdraw", "delete_account", "event"]
          .filter((t) => isEnterprisePlus || t !== "withdraw")
          .map((t) => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition ${
                filterType === t ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              {t === "all" ? "All Types" : TYPE_META[t]?.label}
            </button>
          ))}
      </div>

      <div className="ml-auto flex gap-1">
        {["all", "Pending", "Approved", "Rejected"].map((s) => (
          <button
            key={s}
            onClick={() => setFilterStatus(s)}
            className={`rounded-md px-3 py-1.5 text-xs font-medium transition ${
              filterStatus === s ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            {s === "all" ? "All Status" : s}
          </button>
        ))}
      </div>
    </div>
  );
}
