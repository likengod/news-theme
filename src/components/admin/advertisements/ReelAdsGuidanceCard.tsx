import React from "react";
import { Film } from "lucide-react";

export function ReelAdsGuidanceCard() {
  return (
    <div className="rounded-xl border border-purple-200 bg-gradient-to-r from-purple-50/90 via-slate-50 to-indigo-50/70 p-5 shadow-xs space-y-2.5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-purple-600 text-white shadow-xs">
            <Film className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Reel Ads — Responsive Auto-Injection
            </h3>
            <p className="text-xs text-slate-500">
              Recommended Size:{" "}
              <strong className="font-bold text-purple-700">
                1080 × 1920 px (9:16 Vertical Ratio)
              </strong>
            </p>
          </div>
        </div>
        <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-bold text-purple-800 border border-purple-200">
          Mobile: After 1 Reel • Desktop: Every 3 Reels
        </span>
      </div>
      <p className="text-[11.5px] text-slate-600 leading-relaxed border-t border-purple-100/80 pt-2.5">
        Ads uploaded in this slot are automatically inserted after{" "}
        <strong>1 reel on mobile devices</strong>, and after{" "}
        <strong>every 3 reels on desktop</strong> in both the{" "}
        <strong>Homepage Watch Carousel</strong> and the <strong>/reels Grid</strong>. On
        small screens, sponsor branding is cleanly optimized with single compact badges to
        prevent text overflow. When users click on the ad card, they are directed to the
        Click-Through URL.
      </p>
    </div>
  );
}
