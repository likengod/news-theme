import React from "react";
import { Trash, Trash2, Info, Code, RotateCcw, FolderOpen, Clock } from "lucide-react";
import type { AdSlideItem, AdSlot } from "@/lib/site-content";

interface AdTrashDrawerProps {
  trash: AdSlideItem[];
  slots: Array<{ key: AdSlot; label: string }>;
  onRestore: (id: string) => void;
  onPurge: (id: string) => void;
}

export function AdTrashDrawer({ trash, slots, onRestore, onPurge }: AdTrashDrawerProps) {
  if (trash.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center">
        <Trash className="mb-3 h-8 w-8 text-slate-400" />
        <h3 className="text-base font-semibold text-slate-800">Trash is empty</h3>
        <p className="mt-1 text-xs text-slate-500">
          Deleted ad slides will appear here and can be restored within 30 days.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between rounded-lg bg-amber-50 px-4 py-2 text-xs text-amber-800 border border-amber-200">
        <div className="flex items-center gap-2 font-medium">
          <Info className="h-4 w-4 shrink-0 text-amber-600" />
          Items in trash are automatically purged 30 days after deletion.
        </div>
      </div>
      {trash.map((ad) => (
        <div
          key={ad.id}
          className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between shadow-xs hover:border-slate-300 transition"
        >
          <div className="flex items-center gap-3">
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center">
              {ad.type === "script" ? (
                <Code className="h-6 w-6 text-purple-600" />
              ) : ad.image ? (
                <img src={ad.image} alt="" className="h-full w-full object-cover" />
              ) : (
                <div className="grid h-full w-full place-items-center text-[10px] uppercase tracking-wider text-slate-400 font-bold">
                  No img
                </div>
              )}
            </div>
            <div className="text-xs">
              <div className="font-semibold text-slate-900 truncate w-48 sm:w-64 md:w-96">
                {ad.type === "script"
                  ? "3rd Party Script Ad"
                  : ad.image
                    ? ad.image.split("/").pop()
                    : "(no image set)"}
              </div>
              <div className="mt-1 flex flex-wrap items-center gap-2 text-slate-500">
                <span className="inline-flex items-center gap-1 rounded bg-slate-100 px-1.5 py-0.5">
                  <FolderOpen className="h-3 w-3" />
                  {slots.find((s) => s.key === ad.slot)?.label || ad.slot}
                </span>
                <span>&bull;</span>
                <span className="inline-flex items-center gap-1 text-red-500">
                  <Clock className="h-3 w-3" />
                  Deleted
                </span>
              </div>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <button
              onClick={() => onRestore(ad.id)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-emerald-600 transition"
            >
              <RotateCcw className="h-3.5 w-3.5" /> Restore
            </button>
            <button
              onClick={() => onPurge(ad.id)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-red-300 bg-red-50 px-3.5 py-2 text-xs font-semibold text-red-700 hover:bg-red-100 transition"
            >
              <Trash2 className="h-3.5 w-3.5" /> Delete forever
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
