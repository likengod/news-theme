import React from "react";
import { Link } from "@tanstack/react-router";
import { Home as HomeIcon, X, LogOut } from "lucide-react";
import { ADMIN_NAV_ITEMS } from "./navItems";

interface AdminSidebarProps {
  open: boolean;
  onClose: () => void;
  pathname: string;
  isEnterprisePlus: boolean;
  hasUpdate: boolean;
  siteSettings: any;
  onLogout: () => void;
}

export function AdminSidebar({
  open,
  onClose,
  pathname,
  isEnterprisePlus,
  hasUpdate,
  siteSettings: s,
  onLogout,
}: AdminSidebarProps) {
  return (
    <>
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 transform border-r border-slate-200 bg-white overflow-y-auto transition-transform lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="border-b border-slate-200 px-5 py-3">
          <div className="flex items-center justify-between">
            <Link to="/admin" className="flex items-center gap-2">
              <div className="grid h-8 w-8 place-items-center rounded-md bg-slate-900 text-sm font-bold text-white">
                {(s.logoTextPrimary || s.siteName || "N").charAt(0).toUpperCase()}
              </div>
              <div className="leading-tight">
                <div className="text-sm font-bold">
                  <span style={{ color: s.logoColorPrimary || "#000000" }}>
                    {s.logoTextPrimary || "News"}
                  </span>{" "}
                  <span style={{ color: s.logoColorSecondary || "#dc2626" }}>
                    {s.logoTextSecondary || "Theme"}
                  </span>
                </div>
                <div className="text-[10px] uppercase tracking-widest text-slate-600">
                  Admin Panel
                </div>
              </div>
            </Link>
            <button className="lg:hidden" onClick={onClose} aria-label="Close menu">
              <X className="h-5 w-5" />
            </button>
          </div>
          <Link
            to="/"
            className="mt-2 inline-flex items-center gap-1.5 text-[11px] font-medium text-slate-500 hover:text-slate-900"
          >
            <HomeIcon className="h-3.5 w-3.5" />
            Back to screen
          </Link>
        </div>

        <nav className="p-3">
          <p className="px-3 pb-2 pt-3 text-[10px] font-semibold uppercase tracking-widest text-slate-600">
            Main
          </p>
          <ul className="space-y-1">
            {ADMIN_NAV_ITEMS.map((item) => {
              // Reward feature is exclusively visible for Enterprise Plus licenses
              if (item.to === "/admin/rewards" && !isEnterprisePlus) {
                return null;
              }

              const Icon = item.icon;
              const active = item.exact ? pathname === item.to : pathname.startsWith(item.to);

              return (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    onClick={onClose}
                    className={`flex items-center justify-between rounded-md px-3 py-2 text-sm font-medium transition ${
                      active
                        ? "bg-slate-900 text-white"
                        : item.to === "/admin/updates" && hasUpdate
                          ? "bg-red-50 text-red-700 hover:bg-red-100 font-semibold border border-red-200"
                          : "text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon
                        className={`h-4 w-4 ${item.to === "/admin/updates" && hasUpdate ? "text-red-600 animate-pulse" : ""}`}
                      />
                      {item.label}
                    </div>
                    {item.to === "/admin/updates" && hasUpdate && (
                      <span className="flex items-center gap-1 rounded-full bg-red-600 px-2 py-0.5 text-[10px] font-extrabold uppercase text-white shadow-sm animate-pulse">
                        Update
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>

          <p className="px-3 pb-2 pt-6 text-[10px] font-semibold uppercase tracking-widest text-slate-600">
            Shortcuts
          </p>
          <ul className="space-y-1">
            <li>
              <button
                onClick={onLogout}
                className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
              >
                <LogOut className="h-4 w-4" />
                Sign out
              </button>
            </li>
          </ul>
        </nav>
      </aside>

      {open && (
        <div className="fixed inset-0 z-30 bg-black/30 lg:hidden" onClick={onClose} />
      )}
    </>
  );
}
