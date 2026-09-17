import React from "react";
import { Timer } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import type { PopupConfig } from "@/lib/site-content";

interface PopupTimingCardProps {
  popupConfig: PopupConfig;
  setPopupConfig: React.Dispatch<React.SetStateAction<PopupConfig>>;
  rotation: number;
  setRotation: (val: number) => void;
}

export function PopupTimingCard({
  popupConfig,
  setPopupConfig,
  rotation,
  setRotation,
}: PopupTimingCardProps) {
  return (
    <div className="rounded-xl border border-indigo-100 bg-gradient-to-r from-indigo-50/80 via-slate-50 to-purple-50/60 p-5 shadow-xs space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-indigo-100/80 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="grid h-9 w-9 place-items-center rounded-lg bg-indigo-600 text-white shadow-xs">
            <Timer className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Popup Display Timing & Frequency
            </h3>
            <p className="text-xs text-slate-500">
              Configure how often the popup appears, appearance delays, and slide rotation.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
        {/* Frequency Interval */}
        <div className="space-y-1.5 bg-white p-3 rounded-lg border border-slate-200 shadow-2xs">
          <label className="block text-xs font-bold text-slate-700">
            Appearance Frequency
          </label>
          <select
            value={popupConfig.frequencyMinutes}
            onChange={(e) =>
              setPopupConfig((prev) => ({
                ...prev,
                frequencyMinutes: parseInt(e.target.value, 10),
              }))
            }
            className="w-full rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-800 focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600"
          >
            <option value={0}>Every Page Load (0 min)</option>
            <option value={5}>Every 5 Minutes</option>
            <option value={10}>Every 10 Minutes (Default)</option>
            <option value={15}>Every 15 Minutes</option>
            <option value={30}>Every 30 Minutes</option>
            <option value={60}>Every 1 Hour (60 min)</option>
            <option value={-1}>Once Per Session Only</option>
          </select>
          <p className="text-[10.5px] text-slate-500">
            How often visitors see the popup ad
          </p>
        </div>

        {/* Initial Delay */}
        <div className="space-y-1.5 bg-white p-3 rounded-lg border border-slate-200 shadow-2xs">
          <label className="block text-xs font-bold text-slate-700">
            Initial Display Delay
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min={0}
              max={120}
              value={popupConfig.initialDelaySeconds}
              onChange={(e) =>
                setPopupConfig((prev) => ({
                  ...prev,
                  initialDelaySeconds: Math.max(0, parseInt(e.target.value) || 0),
                }))
              }
              className="w-20 rounded-md border border-slate-200 px-2.5 py-1.5 text-xs font-bold text-slate-800 focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600"
            />
            <span className="text-xs text-slate-500 font-medium">seconds</span>
          </div>
          <p className="text-[10.5px] text-slate-500">
            Wait after page open before popup appears
          </p>
        </div>

        {/* Close Button Unlock Delay */}
        <div className="space-y-1.5 bg-white p-3 rounded-lg border border-slate-200 shadow-2xs">
          <label className="block text-xs font-bold text-slate-700">
            Close Button Countdown
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min={1}
              max={60}
              value={popupConfig.closeDelaySeconds}
              onChange={(e) =>
                setPopupConfig((prev) => ({
                  ...prev,
                  closeDelaySeconds: Math.max(1, parseInt(e.target.value) || 1),
                }))
              }
              className="w-20 rounded-md border border-slate-200 px-2.5 py-1.5 text-xs font-bold text-slate-800 focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600"
            />
            <span className="text-xs text-slate-500 font-medium">seconds</span>
          </div>
          <p className="text-[10.5px] text-slate-500">
            Wait before (X) close button unlocks
          </p>
        </div>

        {/* In-Popup Slide Rotation */}
        <div className="space-y-1.5 bg-white p-3 rounded-lg border border-slate-200 shadow-2xs">
          <label className="block text-xs font-bold text-slate-700">
            Slide Rotation Speed
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min={1}
              max={60}
              value={rotation}
              onChange={(e) => setRotation(Math.max(1, parseInt(e.target.value) || 6))}
              className="w-20 rounded-md border border-slate-200 px-2.5 py-1.5 text-xs font-bold text-slate-800 focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600"
            />
            <span className="text-xs text-slate-500 font-medium">seconds</span>
          </div>
          <p className="text-[10.5px] text-slate-500">
            Seconds per slide while popup is open
          </p>
        </div>
      </div>

      {/* Advance ad on each appearance toggle */}
      <div className="flex items-center justify-between bg-white px-4 py-2.5 rounded-lg border border-slate-200 shadow-2xs">
        <div>
          <div className="text-xs font-bold text-slate-800">
            Change popup image on each interval appearance
          </div>
          <div className="text-[11px] text-slate-500">
            When popup reappears after the interval, it automatically switches to the next
            ad in rotation.
          </div>
        </div>
        <Switch
          checked={popupConfig.rotateOnInterval !== false}
          onCheckedChange={(c) =>
            setPopupConfig((prev) => ({ ...prev, rotateOnInterval: c }))
          }
        />
      </div>
    </div>
  );
}
