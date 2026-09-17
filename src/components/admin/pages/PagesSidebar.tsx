import React from "react";
import { FileText, Crown, Sparkles } from "lucide-react";
import type { PageContent } from "@/lib/site-content";

interface PagesSidebarProps {
  pages: PageContent[];
  activeSlug: string;
  onSelectSlug: (slug: string) => void;
}

export function PagesSidebar({ pages, activeSlug, onSelectSlug }: PagesSidebarProps) {
  const isSubscription = activeSlug === "subscription";
  const isWorkWithUs = activeSlug === "work-with-us";
  const isEvent = activeSlug === "event";

  return (
    <aside className="rounded-xl border border-slate-200 bg-white p-2 shadow-sm">
      <ul className="space-y-1">
        {pages.map((p) => {
          const isActive = p.slug === activeSlug;
          return (
            <li key={p.slug}>
              <button
                onClick={() => onSelectSlug(p.slug)}
                className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-medium transition ${
                  isActive
                    ? "bg-slate-900 text-white shadow-sm"
                    : "text-slate-700 hover:bg-slate-100"
                }`}
              >
                <FileText className="h-4 w-4 shrink-0" />
                <span className="truncate">{p.title}</span>
              </button>
            </li>
          );
        })}

        <li className="my-2 border-t border-slate-100"></li>

        <li>
          <button
            onClick={() => onSelectSlug("subscription")}
            className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-medium transition ${
              isSubscription
                ? "bg-slate-900 text-white shadow-sm"
                : "text-slate-700 hover:bg-slate-100"
            }`}
          >
            <Crown className="h-4 w-4 shrink-0" />
            <span className="truncate">Subscription Settings</span>
          </button>
        </li>
        <li className="mt-1">
          <button
            onClick={() => onSelectSlug("work-with-us")}
            className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-medium transition ${
              isWorkWithUs
                ? "bg-slate-900 text-white shadow-sm"
                : "text-slate-700 hover:bg-slate-100"
            }`}
          >
            <Crown className="h-4 w-4 shrink-0" />
            <span className="truncate">Work With Us Settings</span>
          </button>
        </li>
        <li className="mt-1">
          <button
            onClick={() => onSelectSlug("event")}
            className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-medium transition ${
              isEvent
                ? "bg-slate-900 text-white shadow-sm"
                : "text-slate-700 hover:bg-slate-100"
            }`}
          >
            <Sparkles className="h-4 w-4 shrink-0" />
            <span className="truncate">Event Page Settings</span>
          </button>
        </li>
      </ul>
    </aside>
  );
}
