import React from "react";
import type { SiteSettings } from "@/lib/site-content";
import { getContrastRatio, ensureAccessibleColor } from "@/lib/color-utils";

interface BrandInfoSectionProps {
  settings: SiteSettings;
  update: (k: keyof SiteSettings, v: any) => void;
}

export function BrandInfoSection({ settings, update }: BrandInfoSectionProps) {
  const priColor = settings.logoColorPrimary || "#000000";
  const priContrastLight = getContrastRatio(priColor, "#ffffff");
  const priIsAccessible = priContrastLight >= 4.5;
  const priOptimized = ensureAccessibleColor(priColor, "#ffffff", 4.5);

  const secColor = settings.logoColorSecondary || "#dc2626";
  const secContrastLight = getContrastRatio(secColor, "#ffffff");
  const secIsAccessible = secContrastLight >= 4.5;
  const secOptimized = ensureAccessibleColor(secColor, "#ffffff", 4.5);
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
            onChange={(e) => {
              const val = e.target.value;
              update("siteName", val);
              const curLogo = settings.logoText || "";
              if (!curLogo || curLogo === settings.siteName || curLogo.toLowerCase().includes("news theme") || curLogo.toLowerCase().includes("news timeline")) {
                update("logoText", val);
                const parts = val.trim().split(/\s+/);
                update("logoTextPrimary", parts[0] || "");
                update("logoTextSecondary", parts.slice(1).join(" "));
              }
            }}
            placeholder="Today Tripura"
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
            onChange={(e) => {
              const val = e.target.value;
              update("logoText", val);
              const parts = val.trim().split(/\s+/);
              update("logoTextPrimary", parts[0] || "");
              update("logoTextSecondary", parts.slice(1).join(" "));
              const curName = settings.siteName || "";
              if (!curName || curName.toLowerCase().includes("news theme") || curName.toLowerCase().includes("news timeline")) {
                update("siteName", val);
              }
            }}
            placeholder="Today Tripura"
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
            <option value="both">Both: Logo + Text (Side-by-Side — Reference Style)</option>
            <option value="both_stacked">Both: Logo + Text (Stacked Vertical)</option>
            <option value="logo_fit">Logo: Fit Screen (Full Width Banner)</option>
            <option value="logo_only">Logo Only (Standard)</option>
            <option value="text_only">Text Only</option>
          </select>
          <div className="mt-2.5 flex items-center gap-2">
            <input
              id="logoFitScreen"
              type="checkbox"
              checked={!!settings.logoFitScreen}
              onChange={(e) => update("logoFitScreen", e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900"
            />
            <label htmlFor="logoFitScreen" className="text-xs font-medium text-slate-700 cursor-pointer">
              Logo must fit the screen (Responsive full-width scaling)
            </label>
          </div>
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

        {/* Prominent Header Display Mode Selector (Only Logo / Logo + Site Name / Only Site Name) */}
        <div className="mb-4 rounded-xl border border-slate-200 bg-white p-3.5 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2.5">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                Header Display Mode
              </span>
              <span className="text-[11px] text-slate-500">
                Choose what to display in your header: only logo, logo + site name, or only site name
              </span>
            </div>
            <div className="flex items-center gap-2">
              <input
                id="logoFitScreenQuick"
                type="checkbox"
                checked={!!settings.logoFitScreen}
                onChange={(e) => update("logoFitScreen", e.target.checked)}
                className="h-3.5 w-3.5 rounded border-slate-300 text-slate-900 focus:ring-slate-900"
              />
              <label htmlFor="logoFitScreenQuick" className="text-xs font-medium text-slate-700 cursor-pointer">
                Fit logo to screen width
              </label>
            </div>
          </div>

          {/* Quick Option Buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <button
              type="button"
              onClick={() => update("logoDisplayMode", "both")}
              className={`flex flex-col items-center justify-center p-2.5 rounded-lg border text-center transition-all ${
                (!settings.logoDisplayMode || settings.logoDisplayMode === "both")
                  ? "border-blue-600 bg-blue-50/80 text-blue-900 font-bold shadow-xs ring-1 ring-blue-600"
                  : "border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700"
              }`}
            >
              <span className="text-xs">Logo + Site Name</span>
              <span className="text-[10px] text-slate-400 font-normal">Side-by-Side</span>
            </button>

            <button
              type="button"
              onClick={() => update("logoDisplayMode", "logo_only")}
              className={`flex flex-col items-center justify-center p-2.5 rounded-lg border text-center transition-all ${
                settings.logoDisplayMode === "logo_only"
                  ? "border-blue-600 bg-blue-50/80 text-blue-900 font-bold shadow-xs ring-1 ring-blue-600"
                  : "border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700"
              }`}
            >
              <span className="text-xs">Only Logo</span>
              <span className="text-[10px] text-slate-400 font-normal">Image Only</span>
            </button>

            <button
              type="button"
              onClick={() => update("logoDisplayMode", "text_only")}
              className={`flex flex-col items-center justify-center p-2.5 rounded-lg border text-center transition-all ${
                settings.logoDisplayMode === "text_only"
                  ? "border-blue-600 bg-blue-50/80 text-blue-900 font-bold shadow-xs ring-1 ring-blue-600"
                  : "border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700"
              }`}
            >
              <span className="text-xs">Only Site Name</span>
              <span className="text-[10px] text-slate-400 font-normal">Text Only</span>
            </button>

            <button
              type="button"
              onClick={() => update("logoDisplayMode", "logo_fit")}
              className={`flex flex-col items-center justify-center p-2.5 rounded-lg border text-center transition-all ${
                settings.logoDisplayMode === "logo_fit"
                  ? "border-blue-600 bg-blue-50/80 text-blue-900 font-bold shadow-xs ring-1 ring-blue-600"
                  : "border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700"
              }`}
            >
              <span className="text-xs">Fit Screen Banner</span>
              <span className="text-[10px] text-slate-400 font-normal">Full Width Logo</span>
            </button>
          </div>
        </div>

        {/* Live Header Preview */}
        <div className="mb-4 rounded-xl border border-slate-200 bg-slate-50/90 p-5 text-center shadow-inner overflow-hidden">
          <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 block mb-3">
            Live Header Preview
          </span>

          {/* Side by Side Mode (Matches Reference Image) */}
          {(!settings.logoDisplayMode || settings.logoDisplayMode === "both") && (
            <div className="inline-flex items-center justify-center gap-3 sm:gap-4 md:gap-5 text-left max-w-full">
              {/* Logo / Icon on the left */}
              <div className="shrink-0 flex items-center justify-center">
                {settings.logoLight ? (
                  <img
                    src={settings.logoLight}
                    alt="Logo preview"
                    className="h-12 sm:h-14 md:h-16 w-auto max-w-[80px] sm:max-w-[110px] object-contain rounded-xs"
                  />
                ) : (
                  <div
                    className="h-11 w-11 sm:h-13 sm:w-13 rounded-md flex items-center justify-center shadow-xs border-2"
                    style={{
                      backgroundColor: settings.logoColorSecondary || "#dc2626",
                      borderColor: "#cbd5e1",
                    }}
                  >
                    <span className="text-white font-black text-lg">
                      {(settings.logoTextPrimary || "N").charAt(0)}
                    </span>
                  </div>
                )}
              </div>

              {/* Text + Tagline on the right */}
              <div className="flex flex-col justify-center min-w-0">
                <div
                  className="text-2xl sm:text-3xl md:text-4xl font-extrabold uppercase tracking-wide leading-none"
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
                <div className="mt-1 text-[9px] sm:text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                  {settings.tagline || "BREAKING NEWS · FINANCE · BUSINESS · MARKETS"}
                </div>
              </div>
            </div>
          )}

          {/* Stacked Vertical Mode */}
          {settings.logoDisplayMode === "both_stacked" && (
            <div className="flex flex-col items-center justify-center text-center">
              {settings.logoLight ? (
                <img
                  src={settings.logoLight}
                  alt="Logo preview"
                  className="h-12 object-contain mb-2"
                />
              ) : (
                <div
                  className="h-11 w-11 rounded-md mb-2 flex items-center justify-center shadow-xs border-2"
                  style={{
                    backgroundColor: settings.logoColorSecondary || "#dc2626",
                    borderColor: "#cbd5e1",
                  }}
                >
                  <span className="text-white font-black text-lg">
                    {(settings.logoTextPrimary || "N").charAt(0)}
                  </span>
                </div>
              )}
              <div
                className="text-2xl sm:text-3xl font-extrabold uppercase tracking-wide leading-tight"
                style={{
                  fontFamily: '"Inter", system-ui, sans-serif',
                  letterSpacing: "0.05em",
                }}
              >
                <span style={{ color: settings.logoColorPrimary || "#000000" }}>
                  {settings.logoTextPrimary || "NEWS"}
                </span>{" "}
                <span style={{ color: settings.logoColorSecondary || "#dc2626" }}>
                  {settings.logoTextSecondary || "THEME"}
                </span>
              </div>
              <div className="mt-1 text-[9px] sm:text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                {settings.tagline || "BREAKING NEWS · FINANCE · BUSINESS · MARKETS"}
              </div>
            </div>
          )}

          {/* Fit Screen or Logo Only Mode */}
          {(settings.logoDisplayMode === "logo_fit" || settings.logoDisplayMode === "logo_only") && (
            <div className="flex items-center justify-center">
              {settings.logoLight ? (
                <img
                  src={settings.logoLight}
                  alt="Logo preview"
                  className={
                    settings.logoDisplayMode === "logo_fit" || settings.logoFitScreen
                      ? "w-full max-w-md h-auto max-h-24 object-contain mx-auto"
                      : "h-14 object-contain mx-auto"
                  }
                />
              ) : (
                <div className="text-xs text-slate-400 italic py-2">
                  Upload a logo image in Logo Uploaders to preview {settings.logoDisplayMode === "logo_fit" ? "Fit Screen" : "Logo Only"}
                </div>
              )}
            </div>
          )}

          {/* Text Only Mode */}
          {settings.logoDisplayMode === "text_only" && (
            <div className="flex flex-col items-center justify-center text-center">
              <div
                className="text-3xl sm:text-4xl font-extrabold uppercase tracking-wide"
                style={{
                  fontFamily: '"Inter", system-ui, sans-serif',
                  letterSpacing: "0.05em",
                }}
              >
                <span style={{ color: settings.logoColorPrimary || "#000000" }}>
                  {settings.logoTextPrimary || "NEWS"}
                </span>{" "}
                <span style={{ color: settings.logoColorSecondary || "#dc2626" }}>
                  {settings.logoTextSecondary || "THEME"}
                </span>
              </div>
              <div className="mt-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                {settings.tagline || "BREAKING NEWS · FINANCE · BUSINESS · MARKETS"}
              </div>
            </div>
          )}
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
              value={settings.logoTextPrimary !== undefined ? settings.logoTextPrimary : (settings.logoText ? settings.logoText.split(" ")[0] : "Today")}
              onChange={(e) => {
                const text = e.target.value;
                const nextSec = settings.logoTextSecondary !== undefined ? settings.logoTextSecondary : (settings.logoText && settings.logoText.split(" ").length > 1 ? settings.logoText.split(" ").slice(1).join(" ") : "");
                update("logoTextPrimary", text);
                update("logoText", `${text} ${nextSec}`.trim());
              }}
              placeholder="Today"
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
              <div className="mt-1.5 flex items-center justify-between text-[11px]">
                {priIsAccessible ? (
                  <span className="inline-flex items-center text-emerald-600 font-medium">
                    ✓ WCAG AA ({priContrastLight.toFixed(1)}:1 contrast)
                  </span>
                ) : (
                  <div className="flex items-center gap-1.5">
                    <span className="inline-flex items-center text-amber-600 font-medium">
                      ⚠ Low contrast ({priContrastLight.toFixed(1)}:1)
                    </span>
                    <button
                      type="button"
                      onClick={() => update("logoColorPrimary", priOptimized)}
                      className="text-[10px] font-semibold text-blue-600 underline hover:text-blue-800"
                      title="Adjust shade to pass WCAG AA contrast standard (4.5:1)"
                    >
                      Auto-fix ({priOptimized})
                    </button>
                  </div>
                )}
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
              value={settings.logoTextSecondary !== undefined ? settings.logoTextSecondary : (settings.logoText && settings.logoText.split(" ").length > 1 ? settings.logoText.split(" ").slice(1).join(" ") : "Tripura")}
              onChange={(e) => {
                const text = e.target.value;
                const nextPri = settings.logoTextPrimary !== undefined ? settings.logoTextPrimary : (settings.logoText ? settings.logoText.split(" ")[0] : "Today");
                update("logoTextSecondary", text);
                update("logoText", `${nextPri} ${text}`.trim());
              }}
              placeholder="Tripura"
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
              <div className="mt-1.5 flex items-center justify-between text-[11px]">
                {secIsAccessible ? (
                  <span className="inline-flex items-center text-emerald-600 font-medium">
                    ✓ WCAG AA ({secContrastLight.toFixed(1)}:1 contrast)
                  </span>
                ) : (
                  <div className="flex items-center gap-1.5">
                    <span className="inline-flex items-center text-amber-600 font-medium">
                      ⚠ Low contrast ({secContrastLight.toFixed(1)}:1)
                    </span>
                    <button
                      type="button"
                      onClick={() => update("logoColorSecondary", secOptimized)}
                      className="text-[10px] font-semibold text-blue-600 underline hover:text-blue-800"
                      title="Adjust shade to pass WCAG AA contrast standard (4.5:1)"
                    >
                      Auto-fix ({secOptimized})
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
