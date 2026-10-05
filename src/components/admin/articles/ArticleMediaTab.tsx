import { useState } from "react";
import { ImageInput, Field } from "@/components/admin/articles/ArticleSubComponents";
import { useSiteSettings } from "@/components/site/AdSettingsContext";
import {
  Camera,
  Sparkles,
  Globe,
  Share2,
  Building2,
  Info,
  Check,
} from "lucide-react";
import type { Row } from "./types";

interface ArticleMediaTabProps {
  row: Row;
  onChange: <K extends keyof Row>(field: K, value: Row[K]) => void;
}

export default function ArticleMediaTab({ row, onChange }: ArticleMediaTabProps) {
  const settings = useSiteSettings();
  const defaultSiteName = settings?.siteName || "Today Tripura";
  const activeCredit = row.imageCredit?.trim() || defaultSiteName;

  const PRESET_CAPTIONS = [
    { label: "প্রতীকী ছবি", value: "প্রতীকী ছবি" },
    { label: "Representative Image", value: "Representative Image" },
    { label: "ফাইল ছবি", value: "ফাইল ছবি" },
    { label: "ছবি: সংগৃহীত", value: "ছবি: সংগৃহীত" },
    { label: "ছবি: সোশ্যাল মিডিয়া", value: "ছবি: সোশ্যাল মিডিয়া" },
    { label: "নিজস্ব চিত্র", value: "নিজস্ব চিত্র" },
  ];

  const PRESET_CREDITS = [
    { label: defaultSiteName, value: defaultSiteName, icon: Building2, desc: "Website / Newsroom" },
    { label: "Newsroom Desk", value: "Newsroom Desk", icon: Camera, desc: "Staff Photographer" },
    { label: "Social Media", value: "Social Media", icon: Share2, desc: "Collected from Social Media" },
    { label: "AI Generated", value: "AI Generated", icon: Sparkles, desc: "Generated with AI" },
    { label: "Collected from Web", value: "Collected from Web", icon: Globe, desc: "Online Source" },
  ];

  return (
    <div className="space-y-5">
      {/* Featured Image Section */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-5">
        <Field label="Featured Image">
          <ImageInput
            value={row.featuredImage}
            onChange={(v) => onChange("featuredImage", v)}
            hint="Used as the hero image at the top of the post and default Open Graph image."
          />
        </Field>

        {/* Caption & Image Credit Sub-box */}
        <div className="rounded-lg border border-slate-200 bg-slate-50/70 p-4 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-200/80 pb-2.5">
            <Camera className="h-4 w-4 text-slate-600" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
              Featured Image Caption &amp; Source Credit
            </span>
            <span className="ml-auto text-[11px] text-slate-400">
              Shown beneath the photo on the article page
            </span>
          </div>

          {/* Image Caption Input & Presets */}
          <div className="space-y-1.5">
            <label
              htmlFor="article-image-caption"
              className="block text-xs font-semibold text-slate-700"
            >
              Photo Caption / Description
            </label>

            {/* Quick Caption Preset Chips */}
            <div className="flex flex-wrap items-center gap-1.5 pb-1">
              <span className="text-[10px] uppercase font-bold text-slate-500 mr-0.5">
                Quick Defaults:
              </span>
              {PRESET_CAPTIONS.map((preset) => {
                const isSelected = (row.imageCaption || "").trim() === preset.value;
                return (
                  <button
                    key={preset.value}
                    type="button"
                    onClick={() => onChange("imageCaption", preset.value)}
                    className={`inline-flex items-center gap-1 rounded-md px-2.5 py-0.5 text-[11px] font-medium transition cursor-pointer border ${
                      isSelected
                        ? "border-slate-900 bg-slate-900 text-white shadow-xs"
                        : "border-slate-200 bg-white text-slate-700 hover:bg-slate-100 hover:border-slate-300"
                    }`}
                  >
                    <span>{preset.label}</span>
                    {isSelected && <Check className="h-2.5 w-2.5 stroke-[3]" />}
                  </button>
                );
              })}
              {row.imageCaption && (
                <button
                  type="button"
                  onClick={() => onChange("imageCaption", "")}
                  className="text-[11px] text-slate-400 hover:text-red-500 transition-colors ml-1 underline cursor-pointer"
                >
                  Clear
                </button>
              )}
            </div>

            <input
              id="article-image-caption"
              name="imageCaption"
              type="text"
              value={row.imageCaption || ""}
              onChange={(e) => onChange("imageCaption", e.target.value)}
              placeholder="e.g. প্রতীকী ছবি / Representative Image, or enter custom caption..."
              className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:outline-none"
            />
            <p className="text-[11px] text-slate-400">
              Select a quick preset above or type your own description.
            </p>
          </div>

          {/* Image Source / Credit Field */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label
                htmlFor="article-image-credit"
                className="block text-xs font-semibold text-slate-700"
              >
                Photo Source / Credit Name
              </label>
              <span className="text-[11px] text-slate-400">
                Default: <strong className="text-slate-600 font-medium">{defaultSiteName}</strong>
              </span>
            </div>

            {/* Quick Preset Buttons */}
            <div className="flex flex-wrap items-center gap-1.5">
              {PRESET_CREDITS.map((preset) => {
                const isSelected =
                  (row.imageCredit || "").toLowerCase() === preset.value.toLowerCase() ||
                  (!row.imageCredit && preset.value === defaultSiteName);
                const Icon = preset.icon;
                return (
                  <button
                    key={preset.value}
                    type="button"
                    onClick={() => onChange("imageCredit", preset.value)}
                    className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[11px] font-medium transition cursor-pointer border ${
                      isSelected
                        ? "border-slate-900 bg-slate-900 text-white shadow-xs"
                        : "border-slate-200 bg-white text-slate-700 hover:bg-slate-100 hover:border-slate-300"
                    }`}
                    title={preset.desc}
                  >
                    <Icon className="h-3 w-3 shrink-0" />
                    <span>{preset.label}</span>
                    {isSelected && <Check className="h-2.5 w-2.5 stroke-[3]" />}
                  </button>
                );
              })}
            </div>

            {/* Custom Input for Source */}
            <div className="pt-1">
              <input
                id="article-image-credit"
                name="imageCredit"
                type="text"
                value={row.imageCredit || ""}
                onChange={(e) => onChange("imageCredit", e.target.value)}
                placeholder={`Custom source name (leave blank for default: ${defaultSiteName})...`}
                className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:outline-none"
              />
            </div>
          </div>

          {/* Live Preview Box */}
          <div className="rounded-md border border-amber-200/70 bg-amber-50/60 p-3 text-xs space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 flex items-center gap-1">
              <Info className="h-3 w-3 text-amber-600" /> Post View Preview
            </span>
            <div className="text-slate-600 italic">
              {row.imageCaption?.trim() ? (
                <span>{row.imageCaption.trim()}</span>
              ) : (
                <span className="text-slate-400 not-italic">(No caption entered)</span>
              )}
              <span className="mx-2 not-italic text-slate-300">|</span>
              <span className="not-italic font-bold uppercase tracking-wider text-slate-800">
                {activeCredit}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Open Graph Image Section */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <Field
          label={`Open Graph Image ${row.ogImage ? "" : "(defaults to Featured Image)"}`}
        >
          <ImageInput
            value={row.ogImage}
            onChange={(v) => onChange("ogImage", v)}
            hint="Override only if you want a different image when shared on social media. Recommended 1200×630."
          />
        </Field>
      </div>
    </div>
  );
}
