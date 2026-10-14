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
  const types = [
    { id: "all", label: "All Types" },
    { id: "contact", label: "Contact Message" },
    { id: "work_with_us", label: "Work Application" },
    { id: "journalist_application", label: "Journalist Application" },
    { id: "delete_account", label: "Account Deletion" },
    { id: "event", label: "Event Registration" },
    ...(isEnterprisePlus ? [{ id: "withdraw", label: "Withdrawal Request" }] : []),
  ];

  const statuses = [
    { id: "all", label: "All Status" },
    { id: "Pending", label: "Pending" },
    { id: "Approved", label: "Approved" },
    { id: "Rejected", label: "Rejected" },
  ];

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-3 sm:p-4 shadow-xs space-y-2.5">
      {/* Type Filters: swipeable horizontal chips on mobile */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex items-center gap-1 shrink-0 text-slate-400 mr-1">
          <Filter className="h-3.5 w-3.5" />
          <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400">
            Types:
          </span>
        </div>
        {types.map((t) => (
          <button
            key={t.id}
            onClick={() => setFilterType(t.id)}
            className={`rounded-lg px-2.5 sm:px-3 py-1 sm:py-1.5 text-xs font-semibold transition shrink-0 whitespace-nowrap cursor-pointer ${
              filterType === t.id
                ? "bg-slate-900 text-white shadow-xs"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Status Filters: clean aligned row */}
      <div className="flex items-center gap-1.5 overflow-x-auto pt-2 border-t border-slate-100 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400 shrink-0 mr-1">
          Status:
        </span>
        {statuses.map((s) => (
          <button
            key={s.id}
            onClick={() => setFilterStatus(s.id)}
            className={`rounded-lg px-2.5 sm:px-3 py-1 text-xs font-semibold transition shrink-0 whitespace-nowrap cursor-pointer ${
              filterStatus === s.id
                ? "bg-slate-900 text-white shadow-xs"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>
    </div>
  );
}
