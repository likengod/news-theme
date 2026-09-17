import React from "react";
import { type FontConfiguration, FONT_SECTIONS, getFontById } from "@/lib/font-config";

interface FontLivePreviewProps {
  config: FontConfiguration;
  previewText: string;
  onPreviewTextChange: (v: string) => void;
}

export function FontLivePreview({
  config,
  previewText,
  onPreviewTextChange,
}: FontLivePreviewProps) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 px-6 py-4">
        <h2 className="text-base font-bold text-slate-900">Live Font Preview</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          See how your font selections look across different sections.
        </p>
      </div>
      <div className="px-6 py-5">
        <div className="mb-4">
          <label className="block text-xs font-medium text-slate-600 mb-1">Preview Text</label>
          <input
            type="text"
            value={previewText}
            onChange={(e) => onPreviewTextChange(e.target.value)}
            className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400"
          />
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          {FONT_SECTIONS.map((section) => {
            const fontId = config.sectionMapping[section.key];
            const font = getFontById(fontId, config.fonts);
            const family = font ? `"${font.family}", sans-serif` : "sans-serif";
            const isHeadline = section.key === "headlines";
            return (
              <div key={section.key} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <span className="inline-block rounded bg-slate-900 px-2 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider mb-2">
                  {section.label}
                </span>
                <p className="text-xs text-slate-400 mb-1 font-mono">
                  {font?.name ?? "—"} · {font?.source === "upload" ? "Uploaded" : "Google Fonts"}
                </p>
                <p
                  className="text-slate-900"
                  style={{
                    fontFamily: family,
                    fontSize: isHeadline ? "1.5rem" : "1rem",
                    fontWeight: isHeadline ? 800 : 400,
                    lineHeight: 1.4,
                  }}
                >
                  {previewText}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
