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
  const cards = Object.entries(TYPE_META).filter(
    ([type]) => isEnterprisePlus || type !== "withdraw"
  );

  return (
    <div className="max-sm:flex sm:grid overflow-x-auto sm:overflow-visible gap-2.5 sm:gap-4 sm:grid-cols-3 lg:grid-cols-5 w-full pb-1 sm:pb-0 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden max-sm:snap-x">
      {cards.map(([type, meta]) => {
        const Icon = meta.icon;
        const pending = countFor(type, "Pending");
        const total = countFor(type);

        return (
          <button
            key={type}
            onClick={() => setFilterType(filterType === type ? "all" : type)}
            className={`max-sm:w-[136px] max-sm:shrink-0 max-sm:snap-start w-full rounded-2xl border p-3.5 sm:p-4 text-left transition shadow-xs cursor-pointer flex flex-col justify-between min-h-[112px] sm:min-h-[118px] ${
              filterType === type
                ? "border-slate-900 bg-slate-900 text-white ring-1 ring-slate-900"
                : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50"
            }`}
          >
            <div>
              <div
                className={`mb-2 inline-flex h-9 w-9 items-center justify-center rounded-xl shrink-0 ${
                  filterType === type ? "bg-white/10" : meta.bg
                }`}
              >
                <Icon className={`h-5 w-5 ${filterType === type ? "text-white" : meta.color}`} />
              </div>
              <p
                className={`text-xs font-semibold line-clamp-1 ${
                  filterType === type ? "text-white/80" : "text-slate-500"
                }`}
                title={meta.label}
              >
                {meta.label}
              </p>
            </div>
            <div className="mt-2 flex items-end gap-1.5">
              <span className="text-xl sm:text-2xl font-bold">{total}</span>
              {pending > 0 && (
                <span
                  className={`mb-0.5 rounded-full px-1.5 py-0.2 text-[10px] font-bold ${
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
