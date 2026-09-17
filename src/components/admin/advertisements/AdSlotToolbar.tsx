import React from "react";
import { Sparkles, Clock, Lock, X, Plus } from "lucide-react";
import type { Tab } from "./types";

interface AdSlotToolbarProps {
  adsCount: number;
  slotLabel?: string;
  tab: Tab;
  isEnterprise: boolean;
  rotation: number;
  setRotation: (val: number) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  onAddAd: () => void;
  onClearSearch: () => void;
}

export function AdSlotToolbar({
  adsCount,
  slotLabel,
  tab,
  isEnterprise,
  rotation,
  setRotation,
  searchQuery,
  setSearchQuery,
  onAddAd,
  onClearSearch,
}: AdSlotToolbarProps) {
  if (adsCount === 0) return null;

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3 rounded-xl bg-slate-900 p-3 sm:px-4 sm:py-3 text-white shadow-xs">
      <div className="flex items-center justify-between gap-2 w-full sm:w-auto">
        <div className="flex items-center gap-1.5 sm:gap-2 text-xs font-medium min-w-0">
          <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-amber-400 shrink-0" />
          <span className="truncate">
            <strong>{adsCount}</strong> active ad slide{adsCount === 1 ? "" : "s"} in{" "}
            <strong>{slotLabel}</strong>
          </span>
        </div>

        {/* Mobile "+ Add" button */}
        <button
          type="button"
          onClick={onAddAd}
          disabled={!isEnterprise && adsCount >= 1}
          title={!isEnterprise && adsCount >= 1 ? "Enterprise license required for multiple ads" : ""}
          className={`sm:hidden inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-2.5 py-1 text-xs font-bold text-white shadow-xs transition shrink-0 ${
            !isEnterprise && adsCount >= 1
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-emerald-500 active:scale-98"
          }`}
        >
          <Plus className="h-3.5 w-3.5" /> Add
        </button>
      </div>

      <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 w-full sm:w-auto">
        {tab !== "popup" && (
          <div
            className="flex items-center gap-1.5 rounded-lg bg-slate-800 px-2.5 py-1 text-xs text-slate-200 shrink-0"
            title={!isEnterprise ? "Requires Enterprise license" : ""}
          >
            <Clock className="h-3.5 w-3.5 text-amber-400 shrink-0" />
            <label htmlFor={`rotation-speed-${tab}`} className="text-[11px] sm:text-xs whitespace-nowrap">Rotate every:</label>
            <input
              id={`rotation-speed-${tab}`}
              type="number"
              min={1}
              max={120}
              disabled={!isEnterprise}
              value={rotation}
              onChange={(e) => setRotation(Math.max(1, parseInt(e.target.value) || 5))}
              className="w-10 sm:w-12 rounded bg-slate-900 border border-slate-700 px-1 py-0.5 text-center text-xs font-bold text-white focus:outline-none focus:border-amber-400 disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <span className="text-[11px] sm:text-xs">sec</span>
            {!isEnterprise && <Lock className="h-3 w-3 ml-0.5 text-slate-400 shrink-0" />}
          </div>
        )}

        <div className="relative flex-1 sm:w-48 min-w-[120px]">
          <input
            type="text"
            placeholder="Search ads by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1 text-xs text-slate-800 focus:border-slate-500 focus:outline-none transition shadow-2xs"
          />
          {searchQuery && (
            <button
              onClick={onClearSearch}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </div>

        {/* Desktop "+ Add ad" button */}
        <button
          type="button"
          onClick={onAddAd}
          disabled={!isEnterprise && adsCount >= 1}
          title={!isEnterprise && adsCount >= 1 ? "Enterprise license required for multiple ads" : ""}
          className={`hidden sm:inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-xs transition shrink-0 ${
            !isEnterprise && adsCount >= 1
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-emerald-500 active:scale-98"
          }`}
        >
          <Plus className="h-3.5 w-3.5" /> Add ad
        </button>
      </div>
    </div>
  );
}
