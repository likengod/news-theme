import React from "react";
import { Type } from "lucide-react";
import {
  type FontConfiguration,
  type FontSectionKey,
  FONT_SECTIONS,
  getFontById,
} from "@/lib/font-config";
import { FontSelect } from "./FontLibraryTable";

interface FontSectionMappingProps {
  config: FontConfiguration;
  previewText: string;
  onSectionChange: (section: FontSectionKey, fontId: string) => void;
}

export function FontSectionMapping({
  config,
  previewText,
  onSectionChange,
}: FontSectionMappingProps) {
  return (
    <div className="space-y-6">
      {/* ─── Section Font Mapping ─── */}
      <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-6 py-4">
          <h2 className="text-base font-bold text-slate-900">Section Font Mapping</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Assign different fonts to different sections of your website.
          </p>
        </div>
        <div className="px-6 py-5">
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {FONT_SECTIONS.map((section) => {
              const currentFontId = config.sectionMapping[section.key];
              const currentFont = getFontById(currentFontId, config.fonts);
              return (
                <div
                  key={section.key}
                  className="rounded-lg border border-slate-200 bg-white p-4 hover:border-slate-300 transition"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Type className="h-4 w-4 text-slate-500" />
                    <span className="text-sm font-semibold text-slate-900">{section.label}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mb-3">{section.description}</p>
                  <FontSelect
                    fonts={config.fonts}
                    value={currentFontId}
                    onChange={(id) => onSectionChange(section.key, id)}
                  />
                  {currentFont && (
                    <p
                      className="mt-2 text-sm text-slate-600 truncate"
                      style={{ fontFamily: `"${currentFont.family}", sans-serif` }}
                    >
                      {previewText.slice(0, 40)}...
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ─── Frontend/Backend Usage Reference ─── */}
      <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-6 py-4">
          <h2 className="text-base font-bold text-slate-900">Font Usage Map</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Where each font section applies across frontend and backend.
          </p>
        </div>
        <div className="px-6 py-5">
          <div className="overflow-hidden rounded-md border border-slate-200">
            <table className="min-w-full divide-y divide-slate-200 text-left text-xs">
              <thead className="bg-slate-50 font-semibold text-slate-700">
                <tr>
                  <th className="px-4 py-2.5">Section</th>
                  <th className="px-4 py-2.5">Current Font</th>
                  <th className="px-4 py-2.5">Frontend Usage</th>
                  <th className="px-4 py-2.5">CSS Variable</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-600">
                {FONT_SECTIONS.map((section) => {
                  const fontId = config.sectionMapping[section.key];
                  const font = getFontById(fontId, config.fonts);
                  return (
                    <tr key={section.key} className="hover:bg-slate-50/50">
                      <td className="px-4 py-2.5 font-semibold text-slate-900">{section.label}</td>
                      <td className="px-4 py-2.5">
                        <span
                          style={{
                            fontFamily: font ? `"${font.family}", sans-serif` : "sans-serif",
                          }}
                        >
                          {font?.name ?? "—"}
                        </span>
                      </td>
                      <td className="px-4 py-2.5">{section.description}</td>
                      <td className="px-4 py-2.5 font-mono text-[11px] text-slate-500">
                        {section.cssVar}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
