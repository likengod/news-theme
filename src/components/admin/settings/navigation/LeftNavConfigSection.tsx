import React from "react";
import {
  PanelLeft,
  CheckCircle2,
  EyeOff,
  Tv,
  Clapperboard,
  GraduationCap,
  Video,
  Image as ImageIcon,
  ShieldCheck,
  MessageSquareQuote,
  Newspaper,
  Calculator,
  CalendarDays,
} from "lucide-react";
import type { SiteSettings } from "@/lib/site-content";

interface LeftNavConfigSectionProps {
  s: SiteSettings;
  update: <K extends keyof SiteSettings>(k: K, v: SiteSettings[K]) => void;
}

interface ItemDef {
  key: string;
  name: string;
  bengaliName?: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

const LEFT_NAV_ITEMS: ItemDef[] = [
  {
    key: "live",
    name: "Live Updates",
    bengaliName: "লাইভ",
    description: "Real-time live news stream badge with pulsing indicator",
    icon: Tv,
  },
  {
    key: "reels",
    name: "Shorts / Reels",
    bengaliName: "শর্টস / Reels",
    description: "Vertical video shorts link (/reels)",
    icon: Clapperboard,
  },
  {
    key: "results",
    name: "Examination & Election Results",
    bengaliName: "Result",
    description: "Educational and poll result announcements (/results)",
    icon: GraduationCap,
  },
  {
    key: "videos",
    name: "Videos",
    bengaliName: "ভিডিও",
    description: "Curated news video stories (/reels)",
    icon: Video,
  },
  {
    key: "photos",
    name: "Photo Gallery",
    bengaliName: "ফটো গ্যালারি",
    description: "Visual stories & photo features category stream",
    icon: ImageIcon,
  },
  {
    key: "factCheck",
    name: "Fact Check Rail",
    bengaliName: "ফ্যাক্ট চেক",
    description: "Verified fact-checking reports (/fact-check)",
    icon: ShieldCheck,
  },
  {
    key: "opinion",
    name: "Opinion & Editorials",
    bengaliName: "ওপিনিয়ন",
    description: "Expert op-ed and analysis opinion articles",
    icon: MessageSquareQuote,
  },
  {
    key: "archive",
    name: "News Archive Link",
    bengaliName: "আর্কাইভ",
    description: "Browse historical editions and dates (/archive)",
    icon: Newspaper,
  },
  {
    key: "emiCalculator",
    name: "EMI Calculator Modal",
    bengaliName: "EMI ক্যালকুলেটর",
    description: "Quick pop-up financial loan & mortgage calculator",
    icon: Calculator,
  },
  {
    key: "ageCalculator",
    name: "Age Calculator Modal",
    bengaliName: "বয়সের ক্যালকুলেটর",
    description: "Quick pop-up birthdate and milestone calculator",
    icon: CalendarDays,
  },
];

export function LeftNavConfigSection({ s, update }: LeftNavConfigSectionProps) {
  const isLeftNavEnabled = Boolean(s.showArticleLeftNav);
  const leftItems = s.articleLeftNavItems || {};

  const toggleLeftItem = (key: string) => {
    const current = (leftItems as Record<string, boolean | undefined>)[key];
    const nextVal = current === false ? true : false;
    update("articleLeftNavItems", {
      ...leftItems,
      [key]: nextVal,
    });
  };

  return (
    <div className="space-y-4 animate-fadeIn">
      {/* Master Switch */}
      <div className="rounded-xl border border-indigo-200 bg-indigo-50/40 p-4 transition-all">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1 max-w-xl">
            <div className="flex items-center gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600 text-white shrink-0">
                <PanelLeft className="h-4 w-4" />
              </div>
              <label
                htmlFor="toggle-left-nav"
                className="text-sm font-bold text-slate-900 cursor-pointer"
              >
                Show Left-Side Navigation Bar on Article Pages
              </label>
              {isLeftNavEnabled ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                  <CheckCircle2 className="h-3 w-3" /> Enabled
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 rounded-full bg-slate-200 px-2 py-0.5 text-[10px] font-bold text-slate-700">
                  <EyeOff className="h-3 w-3" /> Hidden (Default)
                </span>
              )}
            </div>
            <p className="text-xs text-slate-600 leading-relaxed pl-9.5">
              When enabled, the vertical rail appears on desktop displays (1280px+). When disabled, the rail is hidden entirely and the article canvas expands.
            </p>
          </div>

          <div className="shrink-0 flex items-center pl-9.5 sm:pl-0">
            <button
              id="toggle-left-nav"
              type="button"
              role="switch"
              aria-checked={isLeftNavEnabled}
              onClick={() => update("showArticleLeftNav", !isLeftNavEnabled)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 ${
                isLeftNavEnabled ? "bg-emerald-600" : "bg-slate-300"
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-xs transition duration-200 ${
                  isLeftNavEnabled ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Granular Menu Items */}
      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-indigo-600" />
              Left Navigation Items (Show / Hide)
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Choose which specific quick-nav links, categories, and pop-up calculator modals are active.
            </p>
          </div>
          {!isLeftNavEnabled && (
            <span className="rounded-md bg-amber-50 px-2 py-1 text-[10px] font-semibold text-amber-700 border border-amber-200">
              Rail is currently disabled above
            </span>
          )}
        </div>

        <div className="grid gap-2.5 sm:grid-cols-2">
          {LEFT_NAV_ITEMS.map((item) => {
            const ItemIcon = item.icon;
            const isVisible = (leftItems as Record<string, boolean | undefined>)[item.key] !== false;
            return (
              <div
                key={item.key}
                className={`flex items-center justify-between p-3 rounded-lg border transition-all ${
                  isVisible
                    ? "border-slate-200 bg-slate-50/70 hover:bg-slate-50"
                    : "border-slate-100 bg-white opacity-60 hover:opacity-100"
                }`}
              >
                <div className="flex items-start gap-2.5 min-w-0 pr-2">
                  <div
                    className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md ${
                      isVisible ? "bg-indigo-100 text-indigo-700" : "bg-slate-100 text-slate-400"
                    }`}
                  >
                    <ItemIcon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-xs font-bold text-slate-900 truncate">
                        {item.name}
                      </span>
                      {item.bengaliName && (
                        <span className="text-[10px] rounded bg-slate-200/80 px-1 py-0.2 font-medium text-slate-700">
                          {item.bengaliName}
                        </span>
                      )}
                    </div>
                    <p className="text-[10.5px] text-slate-500 line-clamp-1">
                      {item.description}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  role="switch"
                  aria-checked={isVisible}
                  onClick={() => toggleLeftItem(item.key)}
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none ${
                    isVisible ? "bg-emerald-600" : "bg-slate-300"
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-xs transition duration-200 ${
                      isVisible ? "translate-x-4" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
