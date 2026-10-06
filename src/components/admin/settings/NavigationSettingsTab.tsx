import { useState } from "react";
import { Compass, Sparkles, ChevronDown, Layers } from "lucide-react";
import type { SiteSettings } from "@/lib/site-content";
import { LeftNavConfigSection } from "./navigation/LeftNavConfigSection";
import { RightSidebarConfigSection } from "./navigation/RightSidebarConfigSection";
import { NavigationWireframePreview } from "./navigation/NavigationWireframePreview";

interface NavigationSettingsTabProps {
  s: SiteSettings;
  update: <K extends keyof SiteSettings>(k: K, v: SiteSettings[K]) => void;
}

type NavigationTarget = "left" | "right";

export function NavigationSettingsTab({ s, update }: NavigationSettingsTabProps) {
  const [selectedTarget, setSelectedTarget] = useState<NavigationTarget>("left");

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
        {/* Header Banner */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3 mb-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white shadow-xs">
              <Compass className="h-5 w-5 text-indigo-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900">
                  Article Navigation &amp; Post View Layout
                </h2>
                <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[9.5px] font-extrabold uppercase tracking-wider text-amber-800">
                  Enterprise
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Configure desktop article rails: select left or right navigation to customize rail visibility and individual components.
              </p>
            </div>
          </div>

          <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 border border-slate-200">
            <Sparkles className="h-3 w-3 text-amber-600" />
            Enterprise Feature
          </span>
        </div>

        {/* Dropdown Selector */}
        <div className="mb-6 rounded-xl border border-indigo-100 bg-gradient-to-r from-indigo-50/70 to-slate-50 p-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <label
                htmlFor="navigation-target-select"
                className="text-xs font-extrabold uppercase tracking-wider text-indigo-950 flex items-center gap-1.5"
              >
                <Layers className="h-4 w-4 text-indigo-600" />
                Select Navigation Rail to Configure
              </label>
              <p className="text-xs text-slate-600 mt-0.5">
                Choose which side of the article layout you want to edit (Left Navigation Bar or Right Sidebar).
              </p>
            </div>

            <div className="relative min-w-[280px]">
              <select
                id="navigation-target-select"
                value={selectedTarget}
                onChange={(e) => setSelectedTarget(e.target.value as NavigationTarget)}
                className="w-full appearance-none rounded-xl border-2 border-indigo-200 bg-white px-4 py-2.5 pr-10 text-xs sm:text-sm font-bold text-slate-900 shadow-xs transition hover:border-indigo-400 focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-100 cursor-pointer"
              >
                <option value="left">Left-Side Navigation Bar (Quick Nav)</option>
                <option value="right">Right-Side Sidebar (Trending, Archive &amp; Community)</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            </div>
          </div>
        </div>

        {/* Modular Child Sections */}
        {selectedTarget === "left" ? (
          <LeftNavConfigSection s={s} update={update} />
        ) : (
          <RightSidebarConfigSection s={s} update={update} />
        )}

        {/* Wireframe Preview */}
        <NavigationWireframePreview s={s} />
      </section>
    </div>
  );
}

export default NavigationSettingsTab;
