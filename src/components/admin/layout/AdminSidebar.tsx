import React from "react";
import { Link } from "@tanstack/react-router";
import { Home as HomeIcon, X, LogOut } from "lucide-react";
import { ADMIN_NAV_ITEMS } from "./navItems";
import { getAccessibleLogoColor } from "@/lib/color-utils";

interface AdminSidebarProps {
  open: boolean;
  onClose: () => void;
  pathname: string;
  isEnterprisePlus?: boolean;
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
  const safeSecondaryColor = getAccessibleLogoColor(s?.logoColorSecondary || "#dc2626", false, 4.5);
  const isEnterprise = (s?.licenseType || "").toLowerCase().includes("enterprise");
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
                  <span style={{ color: safeSecondaryColor }}>
                    {s.logoTextSecondary || "Timeline"}
                  </span>
                </div>
                <div className="text-[10px] text-slate-400">Control Panel</div>
              </div>
            </Link>
            <button
              onClick={onClose}
              className="rounded-md p-1 text-slate-400 hover:bg-slate-100 lg:hidden"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <nav className="p-3">
          <p className="px-3 pb-2 pt-3 text-[10px] font-semibold uppercase tracking-widest text-slate-600">
            Main
          </p>
          <ul className="space-y-1">
            {ADMIN_NAV_ITEMS.map((item) => {
              // Reward feature is visible for Enterprise licenses
              if (item.to === "/admin/rewards" && !isEnterprise) {
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
