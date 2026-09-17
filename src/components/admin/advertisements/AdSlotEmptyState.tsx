import React from "react";
import { Image as ImageIcon, Plus } from "lucide-react";

interface AdSlotEmptyStateProps {
  label?: string;
  shownOn?: string;
  onAddAd: () => void;
}

export function AdSlotEmptyState({ label, shownOn, onAddAd }: AdSlotEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center shadow-xs">
      <div className="grid h-12 w-12 place-items-center rounded-full bg-slate-100 text-slate-600 mb-3">
        <ImageIcon className="h-6 w-6" />
      </div>
      <h3 className="text-base font-semibold text-slate-900">
        No ads added to {label} yet
      </h3>
      <p className="mt-1 max-w-sm text-xs text-slate-500">
        Add rotating custom banner images or video advertisements for {shownOn || "this slot"}.
      </p>
      <button
        type="button"
        onClick={onAddAd}
        className="mt-4 inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
      >
        <Plus className="h-4 w-4" /> Add your first ad to {label}
      </button>
    </div>
  );
}
