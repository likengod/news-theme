import React from "react";
import {
  PanelRight,
  CheckCircle2,
  EyeOff,
  Megaphone,
  TrendingUp,
  Archive,
  ExternalLink,
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa6";
import { FaTelegramPlane } from "react-icons/fa";
import type { SiteSettings } from "@/lib/site-content";

interface RightSidebarConfigSectionProps {
  s: SiteSettings;
  update: <K extends keyof SiteSettings>(k: K, v: SiteSettings[K]) => void;
}

export function RightSidebarConfigSection({ s, update }: RightSidebarConfigSectionProps) {
  const isRightSidebarEnabled = s.showArticleRightSidebar !== false;
  const rightItems = s.articleRightSidebarItems || {};
  const siteName = s.siteName || "Today Tripura";

  const isAd3Visible = rightItems.ad3 !== false;
  const isTrendingVisible = rightItems.trendingNews !== false;
  const isArchiveVisible = rightItems.archiveFinder !== false;
  const isWhatsappVisible = rightItems.whatsappChannel !== false;
  const isTelegramVisible = rightItems.telegramChannel !== false;

  const toggleRightItem = (key: string) => {
    const current = (rightItems as Record<string, any>)[key];
    const nextVal = current === false ? true : false;
    update("articleRightSidebarItems", {
      ...rightItems,
      [key]: nextVal,
    });
  };

  const updateRightField = (field: string, val: string) => {
    update("articleRightSidebarItems", {
      ...rightItems,
      [field]: val,
    });
  };

  return (
    <div className="space-y-4 animate-fadeIn">
      {/* Master Switch */}
      <div className="rounded-xl border border-emerald-200 bg-emerald-50/40 p-4 transition-all">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1 max-w-xl">
            <div className="flex items-center gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-600 text-white shrink-0">
                <PanelRight className="h-4 w-4" />
              </div>
              <label
                htmlFor="toggle-right-sidebar"
                className="text-sm font-bold text-slate-900 cursor-pointer"
              >
                Show Right-Side Sidebar on Article Pages
              </label>
              {isRightSidebarEnabled ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                  <CheckCircle2 className="h-3 w-3" /> Enabled (Default)
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 rounded-full bg-slate-200 px-2 py-0.5 text-[10px] font-bold text-slate-700">
                  <EyeOff className="h-3 w-3" /> Hidden
                </span>
              )}
              <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600 border border-slate-200">
                All Plans
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed pl-9.5">
              Controls the right-side rail containing Trending Stories, Ads, Calendar Archive, and Community Channels. When disabled, the right sidebar is hidden completely.
            </p>
          </div>

          <div className="shrink-0 flex items-center pl-9.5 sm:pl-0">
            <button
              id="toggle-right-sidebar"
              type="button"
              role="switch"
              aria-checked={isRightSidebarEnabled}
              onClick={() => update("showArticleRightSidebar", !isRightSidebarEnabled)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 ${
                isRightSidebarEnabled ? "bg-emerald-600" : "bg-slate-300"
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-xs transition duration-200 ${
                  isRightSidebarEnabled ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Standard Sidebar Components */}
      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-600" />
              Standard Sidebar Components (Show / Hide)
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Select which native editorial blocks and ad placements appear in the right rail.
            </p>
          </div>
          {!isRightSidebarEnabled && (
            <span className="rounded-md bg-amber-50 px-2 py-1 text-[10px] font-semibold text-amber-700 border border-amber-200">
              Sidebar is currently disabled above
            </span>
          )}
        </div>

        <div className="grid gap-2.5 sm:grid-cols-1">
          {/* Ad 3 Slot */}
          <div
            className={`flex items-center justify-between p-3.5 rounded-lg border transition-all ${
              isAd3Visible
                ? "border-slate-200 bg-slate-50/70 hover:bg-slate-50"
                : "border-slate-100 bg-white opacity-60 hover:opacity-100"
            }`}
          >
            <div className="flex items-start gap-3 min-w-0 pr-2">
              <div
                className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md ${
                  isAd3Visible ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-400"
                }`}
              >
                <Megaphone className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <span className="text-xs font-bold text-slate-900">
                  Top Sidebar Ad (Ad 3)
                </span>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Desktop right-rail square advertisement placement (300x250).
                </p>
              </div>
            </div>

            <button
              type="button"
              role="switch"
              aria-checked={isAd3Visible}
              onClick={() => toggleRightItem("ad3")}
              className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none ${
                isAd3Visible ? "bg-emerald-600" : "bg-slate-300"
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-xs transition duration-200 ${
                  isAd3Visible ? "translate-x-4" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {/* Trending Headlines */}
          <div
            className={`flex items-center justify-between p-3.5 rounded-lg border transition-all ${
              isTrendingVisible
                ? "border-slate-200 bg-slate-50/70 hover:bg-slate-50"
                : "border-slate-100 bg-white opacity-60 hover:opacity-100"
            }`}
          >
            <div className="flex items-start gap-3 min-w-0 pr-2">
              <div
                className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md ${
                  isTrendingVisible ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-400"
                }`}
              >
                <TrendingUp className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-xs font-bold text-slate-900">
                    Top Headlines &amp; Trending Articles
                  </span>
                  <span className="text-[10px] rounded bg-slate-200/80 px-1.5 py-0.5 font-medium text-slate-700">
                    সেরা শিরোনাম
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Top ranked trending stories with thumbnails and numbered rankings.
                </p>
              </div>
            </div>

            <button
              type="button"
              role="switch"
              aria-checked={isTrendingVisible}
              onClick={() => toggleRightItem("trendingNews")}
              className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none ${
                isTrendingVisible ? "bg-emerald-600" : "bg-slate-300"
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-xs transition duration-200 ${
                  isTrendingVisible ? "translate-x-4" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {/* Calendar Archive Finder */}
          <div
            className={`flex items-center justify-between p-3.5 rounded-lg border transition-all ${
              isArchiveVisible
                ? "border-slate-200 bg-slate-50/70 hover:bg-slate-50"
                : "border-slate-100 bg-white opacity-60 hover:opacity-100"
            }`}
          >
            <div className="flex items-start gap-3 min-w-0 pr-2">
              <div
                className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md ${
                  isArchiveVisible ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-400"
                }`}
              >
                <Archive className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-xs font-bold text-slate-900">
                    Calendar Archive Finder
                  </span>
                  <span className="text-[10px] rounded bg-slate-200/80 px-1.5 py-0.5 font-medium text-slate-700">
                    আর্কাইভ অনুসন্ধান
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Interactive date picker allowing readers to jump to past newspapers and editions.
                </p>
              </div>
            </div>

            <button
              type="button"
              role="switch"
              aria-checked={isArchiveVisible}
              onClick={() => toggleRightItem("archiveFinder")}
              className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none ${
                isArchiveVisible ? "bg-emerald-600" : "bg-slate-300"
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-xs transition duration-200 ${
                  isArchiveVisible ? "translate-x-4" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Community Channels: WhatsApp & Telegram */}
      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <div className="pb-3 mb-3 border-b border-slate-100">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-blue-600" />
            Social Community Channel Buttons (Below Archive)
          </h3>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Render prominent "Join Our Channel" conversion buttons directly beneath the archive finder on desktop articles.
          </p>
        </div>

        <div className="space-y-4">
          {/* WhatsApp Channel Card */}
          <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4 transition-all">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-slate-200/70">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 text-white shadow-xs">
                  <FaWhatsapp className="h-4.5 w-4.5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-900 block">
                    WhatsApp Channel Button
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Show or hide the WhatsApp channel join banner
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] font-semibold text-slate-600">
                  {isWhatsappVisible ? "Active" : "Hidden"}
                </span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={isWhatsappVisible}
                  onClick={() => toggleRightItem("whatsappChannel")}
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none ${
                    isWhatsappVisible ? "bg-emerald-600" : "bg-slate-300"
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-xs transition duration-200 ${
                      isWhatsappVisible ? "translate-x-4" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* WhatsApp Custom Inputs */}
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Button Text Label
                </label>
                <input
                  type="text"
                  value={rightItems.whatsappButtonText ?? ""}
                  onChange={(e) => updateRightField("whatsappButtonText", e.target.value)}
                  placeholder={`Join our WhatsApp Channel [${siteName}]`}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-900 shadow-xs focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
                <span className="text-[10px] text-slate-400 mt-0.5 block">
                  Leave empty to use default: "Join our WhatsApp Channel [{siteName}]"
                </span>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1 flex items-center justify-between">
                  <span>Channel Invite Link / URL</span>
                  <ExternalLink className="h-3 w-3 text-slate-400" />
                </label>
                <input
                  type="url"
                  value={rightItems.whatsappChannelUrl ?? ""}
                  onChange={(e) => updateRightField("whatsappChannelUrl", e.target.value)}
                  placeholder={s.whatsapp || "https://whatsapp.com/channel/..."}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-900 shadow-xs focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
                <span className="text-[10px] text-slate-400 mt-0.5 block">
                  Defaults to general WhatsApp setting if left blank.
                </span>
              </div>
            </div>
          </div>

          {/* Telegram Channel Card */}
          <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4 transition-all">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-slate-200/70">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-600 text-white shadow-xs">
                  <FaTelegramPlane className="h-4.5 w-4.5 ml-0.5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-900 block">
                    Telegram Channel Button
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Show or hide the Telegram channel join banner
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] font-semibold text-slate-600">
                  {isTelegramVisible ? "Active" : "Hidden"}
                </span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={isTelegramVisible}
                  onClick={() => toggleRightItem("telegramChannel")}
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none ${
                    isTelegramVisible ? "bg-emerald-600" : "bg-slate-300"
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-xs transition duration-200 ${
                      isTelegramVisible ? "translate-x-4" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Telegram Custom Inputs */}
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Button Text Label
                </label>
                <input
                  type="text"
                  value={rightItems.telegramButtonText ?? ""}
                  onChange={(e) => updateRightField("telegramButtonText", e.target.value)}
                  placeholder={`Join our Telegram Channel [${siteName}]`}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-900 shadow-xs focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                />
                <span className="text-[10px] text-slate-400 mt-0.5 block">
                  Leave empty to use default: "Join our Telegram Channel [{siteName}]"
                </span>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1 flex items-center justify-between">
                  <span>Channel Invite Link / URL</span>
                  <ExternalLink className="h-3 w-3 text-slate-400" />
                </label>
                <input
                  type="url"
                  value={rightItems.telegramChannelUrl ?? ""}
                  onChange={(e) => updateRightField("telegramChannelUrl", e.target.value)}
                  placeholder={s.telegram || "https://t.me/..."}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-900 shadow-xs focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                />
                <span className="text-[10px] text-slate-400 mt-0.5 block">
                  Defaults to general Telegram setting if left blank.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
