import { Layout, PanelLeft, PanelRight } from "lucide-react";
import type { SiteSettings } from "@/lib/site-content";

interface NavigationWireframePreviewProps {
  s: SiteSettings;
}

export function NavigationWireframePreview({ s }: NavigationWireframePreviewProps) {
  const isLeftNavEnabled = Boolean(s.showArticleLeftNav);
  const isRightSidebarEnabled = s.showArticleRightSidebar !== false;

  const leftItems = s.articleLeftNavItems || {};
  const rightItems = s.articleRightSidebarItems || {};

  const activeLeftCount = Object.values(leftItems).filter((v) => v !== false).length;
  const activeRightCount = [
    rightItems.ad3 !== false,
    rightItems.trendingNews !== false,
    rightItems.archiveFinder !== false,
    rightItems.whatsappChannel !== false,
    rightItems.telegramChannel !== false,
  ].filter(Boolean).length;

  return (
    <div className="mt-6 border-t border-slate-100 pt-5">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
          <Layout className="h-3.5 w-3.5 text-slate-600" />
          Live Desktop Layout Wireframe Preview
        </span>
        <span className="text-[10px] text-slate-400">
          Matches your current configuration in real-time
        </span>
      </div>

      <div className="rounded-xl border border-slate-200 bg-slate-100/80 p-4">
        <div className="flex items-stretch gap-2.5 h-28 text-center text-xs font-semibold">
          {/* Left Bar Wireframe */}
          <div
            className={`flex flex-col items-center justify-center rounded-lg border transition-all duration-300 ${
              isLeftNavEnabled
                ? "w-28 border-indigo-400 bg-indigo-50 text-indigo-900 shadow-xs"
                : "w-14 border-dashed border-slate-300 bg-white/40 text-slate-400 opacity-40 line-through"
            }`}
          >
            <PanelLeft className="h-4 w-4 mb-1" />
            <span className="text-[10px] leading-tight font-bold">
              {isLeftNavEnabled ? "Left Nav" : "Hidden"}
            </span>
            {isLeftNavEnabled && (
              <span className="text-[8.5px] text-indigo-600 mt-0.5">
                {activeLeftCount || 10} items
              </span>
            )}
          </div>

          {/* Center Article Wireframe */}
          <div className="flex-1 rounded-lg border border-slate-300 bg-white shadow-xs flex flex-col items-center justify-center p-3 text-slate-800">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">
              Article Reading Canvas
            </span>
            <span className="text-xs font-extrabold text-slate-900">
              Headline &amp; Body Content
            </span>
            <span className="text-[10px] text-slate-500 mt-0.5">
              {isLeftNavEnabled && isRightSidebarEnabled
                ? "3-Column Standard Layout"
                : !isLeftNavEnabled && !isRightSidebarEnabled
                  ? "Centered Full-Focus Canvas (Max-4xl)"
                  : "2-Column Expanded Layout"}
            </span>
          </div>

          {/* Right Sidebar Wireframe */}
          <div
            className={`flex flex-col items-center justify-center rounded-lg border transition-all duration-300 ${
              isRightSidebarEnabled
                ? "w-40 border-emerald-400 bg-emerald-50 text-emerald-900 shadow-xs"
                : "w-14 border-dashed border-slate-300 bg-white/40 text-slate-400 opacity-40 line-through"
            }`}
          >
            <PanelRight className="h-4 w-4 mb-1" />
            <span className="text-[10px] leading-tight font-bold">
              {isRightSidebarEnabled ? "Right Rail" : "Hidden"}
            </span>
            {isRightSidebarEnabled && (
              <span className="text-[8.5px] text-emerald-600 mt-0.5">
                {activeRightCount} modules active
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
