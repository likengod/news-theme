import React from "react";
import {
  Star,
  ArrowUp,
  ArrowDown,
  Trash2,
  Lock,
  ExternalLink,
} from "lucide-react";
import type { AdSlideItem, AdSlot } from "@/lib/site-content";
import { DualImageCell } from "./DualImageCell";

interface AdItemCardProps {
  ad: AdSlideItem;
  indexOnPage: number;
  page: number;
  itemsPerPage: number;
  totalAdsCount: number;
  slot: AdSlot;
  isEnterprise: boolean;
  isJustAdded: boolean;
  onUpdate: (id: string, patch: Partial<AdSlideItem>) => void;
  onMove: (index: number, direction: "up" | "down") => void;
  onToggleFeatured: (id: string) => void;
  onRemove: (id: string) => void;
  formatExpiresAt: (val: any) => string;
}

export function AdItemCard({
  ad,
  indexOnPage,
  page,
  itemsPerPage,
  totalAdsCount,
  slot,
  isEnterprise,
  isJustAdded,
  onUpdate,
  onMove,
  onToggleFeatured,
  onRemove,
  formatExpiresAt,
}: AdItemCardProps) {
  const i = (page - 1) * itemsPerPage + indexOnPage;
  const isFeatured = !!ad.isFeatured;

  return (
    <div
      className={`rounded-xl border bg-white p-3 shadow-xs transition-colors ${
        isFeatured
          ? "border-amber-300 ring-1 ring-amber-300 bg-amber-50/15"
          : isJustAdded
            ? "bg-emerald-50/40 border-emerald-300 ring-1 ring-emerald-300"
            : "border-slate-200 hover:border-slate-300"
      }`}
    >
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2.5">
          <span
            className={`inline-flex h-7 w-7 items-center justify-center rounded-md text-xs font-bold text-white shadow-2xs ${
              isFeatured ? "bg-amber-500" : "bg-slate-900"
            }`}
          >
            #{i + 1}
          </span>
          {isFeatured && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 border border-amber-300 px-2 py-0.5 text-[10px] font-bold text-amber-900">
              <Star className="h-3 w-3 fill-amber-500 text-amber-600" /> FEATURED
            </span>
          )}
          <input
            type="text"
            value={ad.label || ""}
            onChange={(e) => onUpdate(ad.id, { label: e.target.value })}
            placeholder="Ad Name (e.g. Summer Promo)"
            className="flex-1 sm:w-48 min-w-[110px] max-w-[200px] rounded bg-transparent px-2 py-1 text-xs font-bold text-slate-800 placeholder:text-slate-400 placeholder:font-normal focus:bg-slate-50 focus:outline-none focus:ring-1 focus:ring-slate-300 transition"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2.5">
          {/* Featured / Priority toggle */}
          <button
            type="button"
            disabled={!isEnterprise}
            onClick={() => onToggleFeatured(ad.id)}
            title={
              !isEnterprise
                ? "Requires Enterprise license"
                : isFeatured
                  ? "Currently Featured: shows first before other ads. Click to unfeature."
                  : "Click to feature this ad: featured ads always show first before regular ads."
            }
            className={`inline-flex items-center gap-1 sm:gap-1.5 rounded-lg px-2 sm:px-2.5 py-1 text-[11px] sm:text-xs font-bold transition shadow-2xs ${
              isFeatured
                ? "bg-amber-500 text-white hover:bg-amber-600"
                : "border border-slate-200 bg-white text-slate-600 hover:border-amber-400 hover:text-amber-700 hover:bg-amber-50/50"
            } ${!isEnterprise && "opacity-50 cursor-not-allowed"}`}
          >
            <Star
              className={`h-3 w-3 sm:h-3.5 sm:w-3.5 ${isFeatured ? "fill-white" : "text-amber-500"}`}
            />
            <span>{isFeatured ? "Featured (First)" : "Mark Featured"}</span>
            {!isEnterprise && <Lock className="h-2.5 w-2.5 sm:h-3 sm:w-3 ml-0.5 text-slate-400" />}
          </button>

          {/* Reorder Up / Down */}
          <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-white shadow-2xs">
            <button
              type="button"
              disabled={i === 0}
              onClick={() => onMove(i, "up")}
              title="Move Up (Show earlier in slideshow)"
              className="p-1 sm:p-1.5 text-slate-600 hover:bg-slate-100 hover:text-slate-900 disabled:opacity-30 disabled:hover:bg-transparent transition"
            >
              <ArrowUp className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
            </button>
            <div className="w-[1px] h-3.5 sm:h-4 bg-slate-200" />
            <button
              type="button"
              disabled={i === totalAdsCount - 1}
              onClick={() => onMove(i, "down")}
              title="Move Down (Show later in slideshow)"
              className="p-1 sm:p-1.5 text-slate-600 hover:bg-slate-100 hover:text-slate-900 disabled:opacity-30 disabled:hover:bg-transparent transition"
            >
              <ArrowDown className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
            </button>
          </div>

          {/* Expiration date */}
          <div
            className="flex items-center gap-1 sm:gap-1.5"
            title={!isEnterprise ? "Requires Enterprise license" : ""}
          >
            <label
              htmlFor={`expires-${ad.id}`}
              className="text-[11px] sm:text-xs font-semibold text-slate-500 whitespace-nowrap"
            >
              Expires:
            </label>
            <input
              id={`expires-${ad.id}`}
              type="date"
              disabled={!isEnterprise}
              value={formatExpiresAt(ad.expiresAt)}
              onChange={(e) =>
                onUpdate(ad.id, {
                  expiresAt: e.target.value
                    ? new Date(e.target.value).toISOString()
                    : null,
                })
              }
              className={`rounded-lg border border-slate-200 bg-white px-1.5 sm:px-2 py-0.5 sm:py-1 text-[11px] sm:text-xs text-slate-800 focus:border-slate-900 focus:outline-none transition w-[120px] sm:w-auto ${!isEnterprise ? "opacity-50 cursor-not-allowed bg-slate-50" : ""}`}
            />
            {!isEnterprise && <Lock className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-slate-300" />}
          </div>

          {/* Delete button */}
          <button
            type="button"
            onClick={() => onRemove(ad.id)}
            title="Delete ad slide"
            aria-label="Delete ad slide"
            className="inline-flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-lg border border-red-200 bg-red-50 text-red-600 transition hover:bg-red-600 hover:text-white shadow-2xs"
          >
            <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </button>
        </div>
      </div>

      <div className="mt-3">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
              {slot === "home1" || slot === "ad3"
                ? "Upload Banner Image (Portrait 3:4)"
                : slot === "home2"
                  ? "Upload Banner Image (Landscape ~2:1)"
                  : slot === "reel_ads"
                    ? "Upload Reel Ad (Vertical 9:16 — 1080 × 1920 px)"
                    : "Upload Banner Images"}
            </div>
            <DualImageCell ad={ad} slot={slot} onUpdate={onUpdate} />
          </div>

          <div className="flex-1 max-w-md">
            <div className="flex items-center justify-between mb-1">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Click-Through URL
              </label>
              {ad.href && ad.href !== "#" && (
                <a
                  href={ad.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[10px] font-semibold text-indigo-600 hover:underline"
                >
                  Test link <ExternalLink className="h-2.5 w-2.5" />
                </a>
              )}
            </div>
            <input
              value={ad.href}
              onChange={(e) => onUpdate(ad.id, { href: e.target.value })}
              placeholder="https://advertiser.com"
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 transition"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
