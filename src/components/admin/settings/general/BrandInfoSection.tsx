import React from "react";
import type { SiteSettings } from "@/lib/site-content";

interface BrandInfoSectionProps {
  settings: SiteSettings;
  update: (k: keyof SiteSettings, v: any) => void;
}

export function BrandInfoSection({ settings, update }: BrandInfoSectionProps) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="mb-4 text-sm font-bold uppercase tracking-wider text-slate-700 border-b border-slate-100 pb-2">
        Brand Information
      </h2>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="siteName" className="mb-1 block text-xs font-semibold text-slate-600">Site Name</label>
          <input
            id="siteName"
            name="siteName"
            type="text"
            value={settings.siteName || ""}
            onChange={(e) => update("siteName", e.target.value)}
            placeholder="News Timeline"
            className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm focus:border-slate-900 focus:outline-none"
          />
        </div>

        <div>
          <label htmlFor="logoText" className="mb-1 block text-xs font-semibold text-slate-600">Logo Text</label>
          <input
            id="logoText"
            name="logoText"
            type="text"
            value={settings.logoText || ""}
            onChange={(e) => update("logoText", e.target.value)}
            placeholder="News Timeline"
            className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm focus:border-slate-900 focus:outline-none"
          />
        </div>

        <div>
          <label htmlFor="logoDisplayMode" className="mb-1 block text-xs font-semibold text-slate-600">
            Brand Display Mode
          </label>
          <select
            id="logoDisplayMode"
            name="logoDisplayMode"
            value={settings.logoDisplayMode || "both"}
            onChange={(e) => update("logoDisplayMode", e.target.value)}
            className="h-10 w-full rounded-lg border border-slate-200 px-3 bg-white text-sm focus:border-slate-900 focus:outline-none"
          >
            <option value="logo_only">Logo Only</option>
            <option value="text_only">Text Only</option>
            <option value="both">Both (Logo + Text)</option>
          </select>
        </div>

        <div>
          <label htmlFor="tagline" className="mb-1 block text-xs font-semibold text-slate-600">Tagline</label>
          <input
            id="tagline"
            name="tagline"
            type="text"
            value={settings.tagline || ""}
            onChange={(e) => update("tagline", e.target.value)}
            placeholder="Breaking News · Finance · Markets"
            className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm focus:border-slate-900 focus:outline-none"
          />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="metaDescription" className="mb-1 block text-xs font-semibold text-slate-600">
            SEO Meta Description
          </label>
          <textarea
            id="metaDescription"
            name="metaDescription"
            value={settings.metaDescription || ""}
            onChange={(e) => update("metaDescription", e.target.value)}
            placeholder="Independent newsroom..."
            rows={3}
            className="w-full rounded-lg border border-slate-200 p-2.5 text-sm focus:border-slate-900 focus:outline-none"
          />
        </div>
      </div>

      {/* Two-Tone Logo Text & Colors */}
      <div className="mt-6 border-t border-slate-100 pt-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Logo Text & Two-Tone Colors
          </h3>
          <span className="text-[11px] text-slate-400">
            Customize each word and its color independently
          </span>
        </div>

        {/* Live Header Preview */}
        <div className="mb-4 rounded-xl border border-slate-200 bg-slate-50/90 p-5 text-center shadow-inner">
          <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 block mb-2">
            Live Header Preview
          </span>
          <div
            className="text-3xl sm:text-4xl md:text-5xl font-extrabold uppercase tracking-wide inline-block"
            style={{
              fontFamily: '"Inter", system-ui, sans-serif',
              letterSpacing: "0.05em",
            }}
          >
            <span style={{ color: settings.logoColorPrimary || "#000000" }}>
              {settings.logoTextPrimary !== undefined && settings.logoTextPrimary !== ""
                ? settings.logoTextPrimary
                : "NEWS"}
            </span>{" "}
            <span style={{ color: settings.logoColorSecondary || "#dc2626" }}>
              {settings.logoTextSecondary !== undefined && settings.logoTextSecondary !== ""
                ? settings.logoTextSecondary
                : "THEME"}
            </span>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {/* Part 1 */}
          <div className="rounded-lg border border-slate-200 bg-white p-3.5 space-y-2.5">
            <div className="flex items-center justify-between">
              <label htmlFor="logoTextPrimary" className="text-xs font-bold text-slate-700">
                Part 1 Text (e.g. News)
              </label>
              <span className="text-[10px] text-slate-400">First Word</span>
            </div>
            <input
              id="logoTextPrimary"
              name="logoTextPrimary"
              type="text"
              value={settings.logoTextPrimary ?? "News"}
              onChange={(e) => {
                const text = e.target.value;
                const nextSec = settings.logoTextSecondary ?? "Theme";
                update("logoTextPrimary", text);
                update("logoText", `${text} ${nextSec}`.trim());
              }}
              placeholder="News"
              className="h-9 w-full rounded-md border border-slate-200 px-3 text-sm focus:border-slate-900 focus:outline-none"
            />
            <div>
              <label htmlFor="logoColorPrimary" className="text-[11px] font-semibold text-slate-500 block mb-1">
                Part 1 Text Color
              </label>
              <div className="flex items-center gap-2">
                <input
                  id="logoColorPrimary"
                  name="logoColorPrimary"
                  aria-label="Part 1 color picker"
                  type="color"
                  value={
                    settings.logoColorPrimary && settings.logoColorPrimary.startsWith("#")
                      ? settings.logoColorPrimary
                      : "#000000"
                  }
                  onChange={(e) => update("logoColorPrimary", e.target.value)}
                  className="h-8 w-10 cursor-pointer rounded border border-slate-200 p-0.5"
                />
                <input
                  id="logoColorPrimaryHex"
                  name="logoColorPrimaryHex"
                  aria-label="Part 1 color hex value"
                  type="text"
                  value={settings.logoColorPrimary || "#000000"}
                  onChange={(e) => update("logoColorPrimary", e.target.value)}
                  placeholder="#000000"
                  className="h-8 flex-1 rounded-md border border-slate-200 px-2.5 text-xs font-mono focus:border-slate-900 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => update("logoColorPrimary", "#000000")}
                  className="px-2 py-1 text-[10px] rounded bg-slate-100 hover:bg-slate-200 text-slate-700"
                  title="Set Black"
                >
                  Black
                </button>
              </div>
            </div>
          </div>

          {/* Part 2 */}
          <div className="rounded-lg border border-slate-200 bg-white p-3.5 space-y-2.5">
            <div className="flex items-center justify-between">
              <label htmlFor="logoTextSecondary" className="text-xs font-bold text-slate-700">
                Part 2 Text (e.g. Theme)
              </label>
              <span className="text-[10px] text-slate-400">Second Word</span>
            </div>
            <input
              id="logoTextSecondary"
              name="logoTextSecondary"
              type="text"
              value={settings.logoTextSecondary ?? "Theme"}
              onChange={(e) => {
                const text = e.target.value;
                const nextPri = settings.logoTextPrimary ?? "News";
                update("logoTextSecondary", text);
                update("logoText", `${nextPri} ${text}`.trim());
              }}
              placeholder="Theme"
              className="h-9 w-full rounded-md border border-slate-200 px-3 text-sm focus:border-slate-900 focus:outline-none"
            />
            <div>
              <label htmlFor="logoColorSecondary" className="text-[11px] font-semibold text-slate-500 block mb-1">
                Part 2 Text Color
              </label>
              <div className="flex items-center gap-2">
                <input
                  id="logoColorSecondary"
                  name="logoColorSecondary"
                  aria-label="Part 2 color picker"
                  type="color"
                  value={
                    settings.logoColorSecondary && settings.logoColorSecondary.startsWith("#")
                      ? settings.logoColorSecondary
                      : "#dc2626"
                  }
                  onChange={(e) => update("logoColorSecondary", e.target.value)}
                  className="h-8 w-10 cursor-pointer rounded border border-slate-200 p-0.5"
                />
                <input
                  id="logoColorSecondaryHex"
                  name="logoColorSecondaryHex"
                  aria-label="Part 2 color hex value"
                  type="text"
                  value={settings.logoColorSecondary || "#dc2626"}
                  onChange={(e) => update("logoColorSecondary", e.target.value)}
                  placeholder="#dc2626"
                  className="h-8 flex-1 rounded-md border border-slate-200 px-2.5 text-xs font-mono focus:border-slate-900 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => update("logoColorSecondary", "#dc2626")}
                  className="px-2 py-1 text-[10px] rounded bg-red-50 hover:bg-red-100 text-red-600 font-semibold"
                  title="Set Red"
                >
                  Red
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
