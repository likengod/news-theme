import React from "react";
import { TYPE_META } from "./types";

interface InboxSummaryCardsProps {
  filterType: string;
  setFilterType: (type: string) => void;
  countFor: (type: string, status?: string) => number;
  isEnterprisePlus: boolean;
}

export function InboxSummaryCards({
  filterType,
  setFilterType,
  countFor,
  isEnterprisePlus,
}: InboxSummaryCardsProps) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
      {Object.entries(TYPE_META)
        .filter(([type]) => isEnterprisePlus || type !== "withdraw")
        .map(([type, meta]) => {
          const Icon = meta.icon;
          const pending = countFor(type, "Pending");
          const total = countFor(type);
          return (
            <button
              key={type}
              onClick={() => setFilterType(filterType === type ? "all" : type)}
              className={`rounded-xl border p-4 text-left transition ${
                filterType === type
                  ? "border-slate-900 bg-slate-900 text-white"
                  : "border-slate-200 bg-white hover:border-slate-300"
              }`}
            >
              <div
                className={`mb-2 inline-flex h-9 w-9 items-center justify-center rounded-lg ${
                  filterType === type ? "bg-white/10" : meta.bg
                }`}
              >
                <Icon className={`h-5 w-5 ${filterType === type ? "text-white" : meta.color}`} />
              </div>
              <p
                className={`text-xs font-semibold ${
                  filterType === type ? "text-white/70" : "text-slate-500"
                }`}
              >
                {meta.label}
              </p>
              <div className="mt-1 flex items-end gap-2">
                <span className="text-2xl font-bold">{total}</span>
                {pending > 0 && (
                  <span
                    className={`mb-0.5 rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                      filterType === type
                        ? "bg-amber-400 text-slate-900"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {pending} new
                  </span>
                )}
              </div>
            </button>
          );
        })}
    </div>
  );
}
