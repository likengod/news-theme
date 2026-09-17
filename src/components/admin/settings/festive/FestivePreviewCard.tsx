import React from "react";
import { RefreshCw } from "lucide-react";
import type { SiteSettings } from "@/lib/site-content";

interface FestivePreviewCardProps {
  settings: SiteSettings;
  isFestiveEnabled: boolean;
  showCustomText: boolean;
  animNonce: number;
  customAlertText: string;
  textStyle: React.CSSProperties;
  badgeStyle: React.CSSProperties;
  customAlertFontFamilyCss: string;
  rotationAnimStyle: React.CSSProperties;
  triggerTestSwap: () => void;
}

export function FestivePreviewCard({
  settings,
  isFestiveEnabled,
  showCustomText,
  animNonce,
  customAlertText,
  textStyle,
  badgeStyle,
  customAlertFontFamilyCss,
  rotationAnimStyle,
  triggerTestSwap,
}: FestivePreviewCardProps) {
  return (
    <div className="lg:col-span-5 flex flex-col justify-between rounded-xl border border-slate-200 bg-slate-50/70 p-5">
      <div>
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 whitespace-nowrap">
              Live Animated Preview
            </span>
            <button
              type="button"
              onClick={triggerTestSwap}
              className="whitespace-nowrap inline-flex items-center justify-center px-2.5 py-1 text-[11px] font-bold text-slate-700 bg-white hover:bg-slate-100 rounded-md border border-slate-300 shadow-xs transition-colors shrink-0"
            >
              Test Swap
            </button>
          </div>
          {isFestiveEnabled ? (
            <span className="whitespace-nowrap inline-flex items-center gap-1.5 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 shrink-0">
              <RefreshCw className="h-3 w-3 animate-spin" />
              Swapping every {settings.topBarSwapDelay || 5}s
            </span>
          ) : (
            <span className="whitespace-nowrap inline-flex items-center gap-1 text-[10px] font-semibold text-slate-500 bg-slate-200/70 px-2 py-0.5 rounded-full border border-slate-300 shrink-0">
              Rotation OFF
            </span>
          )}
        </div>

        <div className="mt-4 space-y-4">
          {/* 1. Top Bar Preview Box */}
          <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-xs overflow-hidden">
            <span className="text-[10px] text-slate-400 font-medium block mb-1">
              Top Bar Custom Alert Message:
            </span>
            <div className="relative h-8 overflow-hidden flex items-center">
              <span
                key={`topbar-${showCustomText ? "custom" : "default"}-${animNonce}`}
                className="absolute inset-x-0 font-bold truncate"
                style={{
                  ...(showCustomText ? textStyle : {}),
                  ...(showCustomText
                    ? {
                        fontFamily: customAlertFontFamilyCss,
                        fontSize: `${settings.customAlertFontSize || 14}px`,
                      }
                    : {}),
                  ...rotationAnimStyle,
                }}
              >
                {showCustomText ? customAlertText : "DEL 165 AQI | MUM 82 AQI | KOL 145 AQI"}
              </span>
            </div>
          </div>

          {/* 2. Category Title Preview Box */}
          <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-xs overflow-hidden">
            <span className="text-[10px] text-slate-400 font-medium block mb-1">
              Category Title Swap (Preserved Size):
            </span>
            <div className="relative h-10 overflow-hidden flex items-center">
              <h1
                key={`cat-${showCustomText ? "custom" : "default"}-${animNonce}`}
                className="absolute inset-x-0 font-serif text-3xl font-bold truncate"
                style={{
                  ...textStyle,
                  ...(showCustomText ? { fontFamily: customAlertFontFamilyCss } : {}),
                  ...rotationAnimStyle,
                }}
              >
                {showCustomText ? customAlertText : "Country"}
              </h1>
            </div>
          </div>

          {/* 3. Section Badge Box */}
          <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-xs flex items-center justify-between">
            <span className="text-[10px] text-slate-400 font-medium">Section Badge:</span>
            <span
              key={`badge-${showCustomText ? "custom" : "default"}-${animNonce}`}
              className="px-2.5 py-1 text-xs font-black uppercase tracking-widest font-sans rounded-xs shadow-xs"
              style={{ ...badgeStyle, ...rotationAnimStyle }}
            >
              {showCustomText ? customAlertText : "MARKETS"}
            </span>
          </div>

          {/* 4. Article QR SCAN ME Badge */}
          <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-xs flex items-center justify-between">
            <span className="text-[10px] text-slate-400 font-medium">SCAN ME Badge:</span>
            <div className="inline-flex items-center gap-2">
              <div>
                <h4
                  key={`scan-${showCustomText ? "custom" : "default"}-${animNonce}`}
                  className="text-xs font-extrabold uppercase leading-tight tracking-tight"
                  style={{ ...textStyle, ...rotationAnimStyle }}
                >
                  {showCustomText ? customAlertText : "SCAN ME"}
                </h4>
                {!showCustomText && (
                  <p className="text-[9px] font-medium text-slate-400 animate-in fade-in duration-300">
                    to read article
                  </p>
                )}
              </div>
              <div className="h-7 w-7 rounded border border-slate-200 bg-slate-100 flex items-center justify-center text-[8px] font-bold text-slate-400">
                QR
              </div>
            </div>
          </div>
        </div>
      </div>

      <p className="mt-4 text-[11px] text-slate-500 italic">
        ✨ Every {settings.topBarSwapDelay || 5} seconds, text automatically rotates between
        default headers and your custom message! Default text color is black (#000000).
      </p>
    </div>
  );
}
