import { useEffect, useState } from "react";
import {
  createFileRoute,
  Link,
  Outlet,
  redirect,
  useNavigate,
  useRouterState,
} from "@tanstack/react-router";
import {
  LayoutDashboard,
  Newspaper,
  MessageSquare,
  Users,
  FolderTree,
  LogOut,
  Menu,
  X,
  Bell,
  Search,
  Settings,
  FileText,
  Home as HomeIcon,
  Megaphone,
  FolderOpen,
  ShieldCheck,
  PenLine,
  Gift,
  Tag,
  Inbox,
  Rocket,
  Lock,
  AlertTriangle,
} from "lucide-react";
import { authClient as supabase } from "@/lib/auth-client";
import { getUserServer, getCurrentUserRole } from "@/lib/auth.functions";
import { useSiteSettings } from "@/components/site/AdSettingsContext";
import { getGitStatus } from "@/lib/deploy.functions";

export const Route = createFileRoute("/admin")({
  ssr: false,
  beforeLoad: async () => {
    const { data } = await supabase.auth.getSession();
    if (!data.session?.user) throw redirect({ to: "/auth" });
    
    // Validate session token in MySQL database and check role permissions
    try {
      const res = await getUserServer({ data: data.session.access_token });
      if (!res.user) {
        // Token is invalid/expired in MySQL database; sign out and redirect to login
        await supabase.auth.signOut();
        throw redirect({ to: "/auth" });
      }

      // Query database to ensure user has a role authorized to access the admin panel
      const roleRes = await getCurrentUserRole({ data: data.session.access_token });
      const allowedRoles = ["admin", "editor"];
      if (!roleRes.role || !allowedRoles.includes(roleRes.role)) {
        // Logged-in user is not authorized; redirect to home page
        throw redirect({ to: "/" });
      }
    } catch (e: any) {
      // If redirect already thrown, propagate it
      if (e?.headers || e?.to) throw e;
      await supabase.auth.signOut();
      throw redirect({ to: "/auth" });
    }
    
    return { user: data.session.user };
  },
  component: AdminLayout,
});

const nav = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/inbox", label: "Inbox", icon: Inbox },
  { to: "/admin/articles", label: "Articles", icon: Newspaper },
  { to: "/admin/categories", label: "Categories", icon: FolderTree },
  { to: "/admin/tags", label: "Tags", icon: Tag },
  { to: "/admin/comments", label: "Comments", icon: MessageSquare },
  { to: "/admin/users", label: "Users", icon: Users },
  { to: "/admin/roles", label: "Roles", icon: ShieldCheck },
  { to: "/admin/journalists", label: "Journalist", icon: PenLine },
  { to: "/admin/rewards", label: "Reward", icon: Gift },
  { to: "/admin/pages", label: "Pages", icon: FileText },
  { to: "/admin/homepage", label: "Homepage Edit", icon: HomeIcon },
  { to: "/admin/reels", label: "Reels & Shorts", icon: Newspaper },
  { to: "/admin/advertisements", label: "Advertisement", icon: Megaphone },
  { to: "/admin/settings", label: "Site Settings", icon: Settings },
  { to: "/admin/files", label: "File Manager", icon: FolderOpen },
  { to: "/admin/updates", label: "Website Update", icon: Rocket },
];


function AdminLayout() {
  const { user } = Route.useRouteContext();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);
  
  const s = useSiteSettings();
  const isPremium = ["Enterprise", "Enterprise+", "Premium"].includes(s.licenseType || "") || s.licenseRole === "VIP";

  // Force light theme inside admin only
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("dark");
    root.style.colorScheme = "light";
    return () => {
      // Re-apply correct theme from localStorage when leaving admin panel
      const storedTheme = localStorage.getItem("fs-theme") || "light";
      if (storedTheme === "dark") {
        root.classList.add("dark");
        root.style.colorScheme = "dark";
      } else {
        root.classList.remove("dark");
        root.style.colorScheme = "light";
      }
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/auth" });
  };

  const email = user?.email ?? "admin@northeast.com";
  const initials = email.slice(0, 2).toUpperCase();

  const firstName = (() => {
    const rawName = (user as any)?.user_metadata?.full_name || (user as any)?.user_metadata?.name || (user as any)?.name || (user as any)?.display_name;
    if (rawName && typeof rawName === "string" && rawName.trim()) {
      return rawName.trim().split(" ")[0];
    }
    if (email && email.includes("@")) {
      const local = email.split("@")[0].replace(/[._0-9-]/g, " ").trim();
      const first = local.split(" ")[0];
      if (first) {
        return first.charAt(0).toUpperCase() + first.slice(1);
      }
    }
    return "Admin";
  })();

  const [updateStatus, setUpdateStatus] = useState<{
    hasUpdate: boolean;
    currentVersion?: string;
    latestVersion?: string;
    checked: boolean;
  }>({ hasUpdate: false, checked: false });

  const [dismissed, setDismissed] = useState(() => {
    if (typeof window !== "undefined") {
      return sessionStorage.getItem("admin_update_dismissed") === "1";
    }
    return false;
  });

  useEffect(() => {
    let mounted = true;
    getGitStatus()
      .then((res) => {
        if (!mounted) return;
        const cur = res?.version || "v1.0.31";
        const latest = res?.latestVersion || cur;
        const isSimulated = typeof window !== "undefined" && (
          new URLSearchParams(window.location.search).get("test_update") === "1" ||
          localStorage.getItem("force_update_lock") === "1"
        );
        const hasUpdate = isSimulated || Boolean(res?.hasNewVersion || (res?.behind && res.behind > 0));
        setUpdateStatus({
          hasUpdate,
          currentVersion: cur,
          latestVersion: isSimulated ? (res?.latestVersion && res.latestVersion !== cur ? res.latestVersion : "v2.0.0") : latest,
          checked: true,
        });
      })
      .catch((e) => {
        console.error("Version check notice:", e);
      });
    return () => {
      mounted = false;
    };
  }, [pathname]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Sidebar */}
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
                  <span style={{ color: s.logoColorPrimary || "#000000" }}>{s.logoTextPrimary || "News"}</span>{" "}
                  <span style={{ color: s.logoColorSecondary || "#dc2626" }}>{s.logoTextSecondary || "Theme"}</span>
                </div>
                <div className="text-[10px] uppercase tracking-widest text-slate-500">
                  Admin Panel
                </div>
              </div>
            </Link>
            <button
              className="lg:hidden"
              onClick={() => setOpen(false)}
              aria-label="Close menu"
            >
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
          <p className="px-3 pb-2 pt-3 text-[10px] font-semibold uppercase tracking-widest text-slate-400">
            Main
          </p>
          <ul className="space-y-1">
            {nav.map((item) => {
              const Icon = item.icon;
              const isLocked = item.to === "/admin/rewards" && !isPremium;
              const toDest = isLocked ? "/admin/settings" : item.to;
              const searchProps = isLocked ? { tab: "activate" } : undefined;
              
              const active = item.exact
                ? pathname === item.to
                : pathname.startsWith(item.to);
              
              return (
                <li key={item.to}>
                  <Link
                    to={toDest}
                    search={searchProps}
                    onClick={() => setOpen(false)}
                    className={`flex items-center justify-between rounded-md px-3 py-2 text-sm font-medium transition ${
                      active
                        ? "bg-slate-900 text-white"
                        : item.to === "/admin/updates" && updateStatus.hasUpdate
                        ? "bg-red-50 text-red-700 hover:bg-red-100 font-semibold border border-red-200"
                        : isLocked 
                        ? "text-slate-400 hover:bg-slate-50"
                        : "text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`h-4 w-4 ${item.to === "/admin/updates" && updateStatus.hasUpdate ? "text-red-600 animate-pulse" : ""}`} />
                      {item.label}
                    </div>
                    {item.to === "/admin/updates" && updateStatus.hasUpdate && (
                      <span className="flex items-center gap-1 rounded-full bg-red-600 px-2 py-0.5 text-[10px] font-extrabold uppercase text-white shadow-sm animate-pulse">
                        Update
                      </span>
                    )}
                    {isLocked && <Lock className="h-3.5 w-3.5 text-slate-300" />}
                  </Link>
                </li>
              );
            })}
          </ul>

          <p className="px-3 pb-2 pt-6 text-[10px] font-semibold uppercase tracking-widest text-slate-400">
            Shortcuts
          </p>
          <ul className="space-y-1">
            <li>
              <button
                onClick={handleLogout}
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
        <div
          className="fixed inset-0 z-30 bg-black/30 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Main */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <button
              className="lg:hidden"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="relative hidden sm:block">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                placeholder="Search..."
                className="w-72 rounded-md border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm placeholder:text-slate-400 focus:border-slate-900 focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            {updateStatus.hasUpdate && (
              <Link
                to="/admin/updates"
                className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-red-50 border border-red-200 px-3 py-1 text-xs font-semibold text-red-600 hover:bg-red-100 transition"
              >
                <Rocket className="h-3.5 w-3.5 text-red-600 animate-pulse" />
                <span>Update Available ({updateStatus.latestVersion || "New"})</span>
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

        <main className="p-4 sm:p-6 lg:p-8">
          {updateStatus.hasUpdate && !dismissed && pathname !== "/admin/updates" ? (
            <div className="flex min-h-[75vh] flex-col items-center justify-center py-12 px-4 text-center">
              <div className="max-w-xl w-full">
                <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-red-100/80 text-red-600">
                  <Rocket className="h-10 w-10 animate-bounce" />
                </div>

                <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-red-600 mb-3">
                  <AlertTriangle className="h-4 w-4" />
                  <span>Update Required</span>
                </div>

                <h1 className="text-3xl font-extrabold text-slate-900 sm:text-4xl tracking-tight">
                  Dear <span className="text-red-600">{firstName}</span>,
                </h1>

                <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
                  Without update you can't use the website. A new version is available, please update website.
                </p>

                <div className="mt-6 flex items-center justify-center gap-3 text-sm font-semibold text-slate-500">
                  <span className="font-mono text-slate-700 bg-slate-200/70 px-3 py-1 rounded-full text-xs">
                    Current: {updateStatus.currentVersion || "v1.0.31"}
                  </span>
                  <span>➔</span>
                  <span className="font-mono text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full text-xs font-bold">
                    Available: {updateStatus.latestVersion || "Latest"}
                  </span>
                </div>

                <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
                  <Link
                    to="/admin/updates"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-xl bg-red-600 px-7 py-3.5 text-sm font-bold text-white shadow-md hover:bg-red-700 transition active:scale-[0.98]"
                  >
                    <Rocket className="h-4 w-4" />
                    Update Website Now
                  </Link>

                  <button
                    onClick={() => {
                      setDismissed(true);
                      if (typeof window !== "undefined") {
                        sessionStorage.setItem("admin_update_dismissed", "1");
                      }
                    }}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition active:scale-[0.98] shadow-sm"
                  >
                    Continue to Admin Panel
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <>
              {updateStatus.hasUpdate && (
                <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50/90 px-4 py-3 text-sm text-red-800">
                  <div className="flex items-center gap-2.5 font-medium">
                    <AlertTriangle className="h-4 w-4 shrink-0 text-red-600" />
                    <span>
                      <strong>Update Available:</strong> Version {updateStatus.latestVersion} is available to install (current: {updateStatus.currentVersion}).
                    </span>
                  </div>
                  <Link
                    to="/admin/updates"
                    className="inline-flex items-center gap-1.5 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-red-700 transition shadow-sm"
                  >
                    <Rocket className="h-3.5 w-3.5" />
                    Update Website Now
                  </Link>
                </div>
              )}
              <Outlet />
            </>
          )}
        </main>
      </div>
    </div>
  );
}
