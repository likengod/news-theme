import React from "react";
import { Newspaper, Sparkles, Smartphone, Monitor } from "lucide-react";

export function PostAdsGuidanceCard() {
  return (
    <div className="rounded-xl border border-indigo-200 bg-gradient-to-r from-indigo-50/90 via-slate-50 to-blue-50/70 p-5 shadow-xs space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-indigo-600 text-white shadow-xs">
            <Newspaper className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Post Ads — Pinned Bottom of Article Featured Image
            </h3>
            <p className="text-xs text-slate-500">
              Shows on every article post view directly overlaid at the bottom edge of the hero image.
            </p>
          </div>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-100 px-3 py-1 text-xs font-bold text-indigo-800 border border-indigo-200">
          <Sparkles className="h-3 w-3 text-indigo-600" />
          Mobile + Desktop Dual View
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
        <div className="flex items-start gap-2.5 rounded-lg border border-blue-200/80 bg-white/80 p-2.5 shadow-2xs">
          <Smartphone className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
          <div>
            <div className="text-[11px] font-bold text-slate-900">Mobile Ad Size</div>
            <div className="text-xs font-semibold text-blue-700">320 × 50 px <span className="text-slate-400 font-normal">or</span> 300 × 75 px</div>
            <div className="text-[10.5px] text-slate-500 mt-0.5">Rendered on smartphones and small screens</div>
          </div>
        </div>

        <div className="flex items-start gap-2.5 rounded-lg border border-emerald-200/80 bg-white/80 p-2.5 shadow-2xs">
          <Monitor className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <div className="text-[11px] font-bold text-slate-900">Desktop Ad Size</div>
            <div className="text-xs font-semibold text-emerald-700">728 × 90 px <span className="text-slate-400 font-normal">or</span> 970 × 90 px</div>
            <div className="text-[10.5px] text-slate-500 mt-0.5">Rendered on laptops, tablets, and wide monitors</div>
          </div>
        </div>
      </div>

      <p className="text-[11.5px] text-slate-600 leading-relaxed border-t border-indigo-100/80 pt-2.5">
        <strong>How it displays:</strong> Displays along the bottom edge of the post hero image as a clean banner advertisement (Desktop: 728×90 / 970×90, Mobile: 320×50 / 300×75) with direct sponsor link and top-right close/dismiss <strong>(✕)</strong> button. Also supports <strong>Google AdSense / Third-Party Scripts</strong> via the top-right toggle.
      </p>
    </div>
  );
}
