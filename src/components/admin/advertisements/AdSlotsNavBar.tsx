import React from "react";
import { Trash2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import type { AdSlot, AdSlotMode } from "@/lib/site-content";
import type { SlotMeta, Tab } from "./types";

interface AdSlotsNavBarProps {
  tab: Tab;
  setTab: (tab: Tab) => void;
  slots: SlotMeta[];
  slotCounts: Record<string, number>;
  trashCount: number;
  isTrash: boolean;
  slot: AdSlot;
  slotMode: AdSlotMode;
  onSlotModeChange: (mode: AdSlotMode) => void;
  isEnterprise: boolean;
  isEnterprisePlus: boolean;
}

export function AdSlotsNavBar({
  tab,
  setTab,
  slots,
  slotCounts,
  trashCount,
  isTrash,
  slotMode,
  onSlotModeChange,
  isEnterprise,
  isEnterprisePlus,
}: AdSlotsNavBarProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5 border-b border-slate-200 pb-1.5 sm:pb-px">
      <div className="flex flex-wrap items-center gap-1 sm:gap-1.5">
        {slots.map((s) => {
          if ((s.key === "hero_showcase" || s.key === "reel_ads") && !isEnterprisePlus) {
            return null;
          }
          const isActive = tab === s.key;
          const count = slotCounts[s.key] || 0;
          return (
            <button
              key={s.key}
              onClick={() => setTab(s.key)}
              className={`group flex items-center gap-1.5 sm:gap-2 rounded-lg sm:rounded-b-none sm:rounded-t-lg border-b-0 sm:border-b-2 px-2.5 sm:px-4 py-1.5 sm:py-2.5 text-xs sm:text-sm font-semibold transition-all ${
                isActive
                  ? "border-slate-900 bg-slate-900 text-white shadow-xs"
                  : "border-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <div className="flex items-center gap-1">
                <span>{s.label}</span>
              </div>
              <span
                className={`rounded-full px-1.5 sm:px-2 py-0.2 sm:py-0.5 text-[9.5px] sm:text-[10.5px] font-bold ${
                  isActive
                    ? "bg-slate-700 text-slate-200"
                    : "bg-slate-200 text-slate-600 group-hover:bg-slate-300"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}

        <button
          onClick={() => setTab("trash")}
          className={`group flex items-center gap-1.5 sm:gap-2 rounded-lg sm:rounded-b-none sm:rounded-t-lg border-b-0 sm:border-b-2 px-2.5 sm:px-4 py-1.5 sm:py-2.5 text-xs sm:text-sm font-semibold transition-all ${
            tab === "trash"
              ? "border-slate-900 bg-slate-900 text-white shadow-xs"
              : "border-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900"
          }`}
        >
          <div className="flex items-center gap-1">
            <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            <span>Trash</span>
          </div>
          <span
            className={`rounded-full px-1.5 sm:px-2 py-0.2 sm:py-0.5 text-[9.5px] sm:text-[10.5px] font-bold ${
              tab === "trash"
                ? "bg-slate-700 text-slate-200"
                : "bg-slate-200 text-slate-600 group-hover:bg-slate-300"
            }`}
          >
            {trashCount}
          </span>
        </button>
      </div>

      {!isTrash && (
        <div className="flex items-center justify-between sm:justify-end gap-3 pt-1 sm:pt-0">
          <div className="flex items-center space-x-2">
            <Label
              htmlFor="mode-switch"
              className="text-xs font-semibold text-slate-600 cursor-pointer select-none"
            >
              Google Ads
            </Label>
            <Switch
              id="mode-switch"
              checked={slotMode === "image"}
              onCheckedChange={(c) => {
                onSlotModeChange(c ? "image" : "script");
              }}
              disabled={(tab === "popup" || tab === "leaderboard") && !isEnterprise}
            />
            <Label
              htmlFor="mode-switch"
              className={`text-xs font-semibold select-none ${
                (tab === "popup" || tab === "leaderboard") && !isEnterprise
                  ? "text-slate-400 cursor-not-allowed"
                  : "text-slate-900 cursor-pointer"
              }`}
            >
              Custom Ads
              {(tab === "popup" || tab === "leaderboard") && !isEnterprise && (
                <span className="ml-1.5 inline-flex items-center rounded-full bg-amber-100 px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wider text-amber-800">
                  Enterprise
                </span>
              )}
            </Label>
          </div>
        </div>
      )}
    </div>
  );
}
