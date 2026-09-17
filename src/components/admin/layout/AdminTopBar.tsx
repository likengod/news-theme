import React from "react";
import { Link } from "@tanstack/react-router";
import { Menu, Search, Rocket } from "lucide-react";

interface AdminTopBarProps {
  onOpenSidebar: () => void;
  hasUpdate: boolean;
  latestVersion?: string;
  pathname: string;
  initials: string;
  email: string;
}

export function AdminTopBar({
  onOpenSidebar,
  hasUpdate,
  latestVersion,
  pathname,
  initials,
  email,
}: AdminTopBarProps) {
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-6">
      <div className="flex items-center gap-3">
        <button className="lg:hidden" onClick={onOpenSidebar} aria-label="Open menu">
          <Menu className="h-5 w-5" />
        </button>
        <div className="relative hidden sm:block">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            id="adminTopSearch"
            name="adminSearch"
            aria-label="Search admin dashboard"
            placeholder="Search..."
            className="w-72 rounded-md border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm placeholder:text-slate-400 focus:border-slate-900 focus:bg-white focus:outline-none"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        {hasUpdate && !pathname?.startsWith("/admin/updates") && (
          <Link
            to="/admin/updates"
            className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-red-600 px-3 py-1 text-xs font-semibold text-white hover:bg-red-700 transition"
          >
            <Rocket className="h-3.5 w-3.5 animate-pulse" />
            <span>Update Available ({latestVersion || "New"})</span>
          </Link>
        )}

        <div className="flex items-center gap-2">
          <div className="grid h-8 w-8 place-items-center rounded-full bg-slate-900 text-xs font-bold text-white">
            {initials}
          </div>
          <div className="hidden text-left leading-tight sm:block">
            <div className="text-xs font-semibold">{email.split("@")[0]}</div>
            <div className="text-[10px] text-slate-500">Administrator</div>
          </div>
        </div>
      </div>
    </header>
  );
}
