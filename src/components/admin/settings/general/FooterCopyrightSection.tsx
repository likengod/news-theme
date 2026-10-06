import React from "react";
import type { SiteSettings } from "@/lib/site-content";

interface FooterCopyrightSectionProps {
  settings: SiteSettings;
  update: (k: keyof SiteSettings, v: any) => void;
}

export function FooterCopyrightSection({ settings, update }: FooterCopyrightSectionProps) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="mb-4 text-sm font-bold uppercase tracking-wider text-slate-700 border-b border-slate-100 pb-2">
        Footer & Copyright
      </h2>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor="footerNote" className="mb-1 block text-xs font-semibold text-slate-600">
            Footer Intro Text
          </label>
          <textarea
            id="footerNote"
            name="footerNote"
            value={settings.footerNote || ""}
            onChange={(e) => update("footerNote", e.target.value)}
            rows={3}
            className="w-full rounded-lg border border-slate-200 p-2.5 text-sm focus:border-slate-900 focus:outline-none"
          />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="copyright" className="mb-1 block text-xs font-semibold text-slate-600">
            Copyright Statement
          </label>
          <input
            id="copyright"
            name="copyright"
            type="text"
            value={settings.copyright || ""}
            onChange={(e) => update("copyright", e.target.value)}
            className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm focus:border-slate-900 focus:outline-none"
          />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="footerWidth" className="mb-1 block text-xs font-semibold text-slate-600">
            Footer Container Width (Big Screens)
          </label>
          <select
            id="footerWidth"
            name="footerWidth"
            value={settings.footerWidth || "wide"}
            onChange={(e) => update("footerWidth", e.target.value)}
            className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm bg-white focus:border-slate-900 focus:outline-none"
          >
            <option value="wide">Wide / Edge-to-Edge Responsive (Recommended - 1536px, fits big screens)</option>
            <option value="full">Full Width (100% fluid edge-to-edge)</option>
            <option value="contained">Contained / Boxed (1280px standard)</option>
          </select>
          <p className="mt-1 text-xs text-slate-500">
            Controls how wide the footer stretches on desktop and large widescreen monitors.
          </p>
        </div>
      </div>
    </section>
  );
}
