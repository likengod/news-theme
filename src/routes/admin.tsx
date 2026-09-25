import { useEffect, useState } from "react";
import {
  createFileRoute,
  Outlet,
  redirect,
  useNavigate,
  useLocation,
} from "@tanstack/react-router";
import { authClient as supabase } from "@/lib/auth-client";
import { getUserServer, getCurrentUserRole } from "@/lib/auth.functions";
import { useSiteSettings } from "@/components/site/AdSettingsContext";
import { isEnterprisePlusLicense } from "@/lib/site-content";
import { getGitStatus } from "@/lib/deploy.functions";
import { AdminSidebar } from "@/components/admin/layout/AdminSidebar";
import { AdminTopBar } from "@/components/admin/layout/AdminTopBar";
import { AdminUpdatePrompt } from "@/components/admin/layout/AdminUpdatePrompt";

// In-memory cache of verified admin tokens (never trusted from forgeable sessionStorage)
const verifiedAdminTokens = new Map<string, number>();

export const Route = createFileRoute("/admin")({
  ssr: false,
  beforeLoad: async () => {
    const { data } = await supabase.auth.getSession();
    if (!data.session?.user || !data.session?.access_token) throw redirect({ to: "/auth" });

    const token = data.session.access_token;
    const now = Date.now();
    const cachedExpiry = verifiedAdminTokens.get(token);
    if (cachedExpiry && cachedExpiry > now) {
      return { user: data.session.user };
    }

    // Validate session token and check role permissions — run both DB queries in parallel
    try {
      const [res, roleRes] = await Promise.all([
        getUserServer({ data: token }),
        getCurrentUserRole({ data: token }),
      ]);

      if (!res.user) {
        verifiedAdminTokens.delete(token);
        await supabase.auth.signOut();
        throw redirect({ to: "/auth" });
      }

      const allowedRoles = ["admin", "editor"];
      if (!roleRes.role || !allowedRoles.includes(roleRes.role)) {
        verifiedAdminTokens.delete(token);
        throw redirect({ to: "/" });
      }

      // Cache verified permission in memory for 2 minutes for snappy admin navigation
      verifiedAdminTokens.set(token, now + 2 * 60 * 1000);
    } catch (e: any) {
      verifiedAdminTokens.delete(token);
      if (e?.headers || e?.to) throw e;
      await supabase.auth.signOut();
      throw redirect({ to: "/auth" });
    }

    return { user: data.session.user };
  },
  head: () => ({
    meta: [
      { title: "Admin Dashboard - News Timeline" },
      { name: "description", content: "Administrative control center and dashboard." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminLayout,
});

function AdminLayout() {
  const { user } = Route.useRouteContext();
  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location.pathname;
  const [open, setOpen] = useState(false);

  const s = useSiteSettings();
  const isEnterprisePlus = isEnterprisePlusLicense(s);

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
    const rawName =
      (user as any)?.user_metadata?.full_name ||
      (user as any)?.user_metadata?.name ||
      (user as any)?.name ||
      (user as any)?.display_name;
    if (rawName && typeof rawName === "string" && rawName.trim()) {
      return rawName.trim().split(" ")[0];
    }
    if (email && email.includes("@")) {
      const local = email
        .split("@")[0]
        .replace(/[._0-9-]/g, " ")
        .trim();
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

    // Check if we already checked for updates recently in this session (within 10 minutes)
    if (typeof window !== "undefined") {
      const lastCheck = sessionStorage.getItem("admin_update_check_time");
      const cachedStatus = sessionStorage.getItem("admin_update_status");
      if (lastCheck && cachedStatus && Date.now() - parseInt(lastCheck) < 10 * 60 * 1000) {
        try {
          const parsed = JSON.parse(cachedStatus);
          setUpdateStatus(parsed);
          return;
        } catch {}
      }
    }

    getGitStatus()
      .then((res) => {
        if (!mounted) return;
        const cur = res?.version || "v1.0.55";
        const latest = res?.latestVersion || cur;
        const isSimulated =
          typeof window !== "undefined" &&
          (new URLSearchParams(window.location.search).get("test_update") === "1" ||
            localStorage.getItem("force_update_lock") === "1");
        const hasUpdate =
          isSimulated || Boolean(res?.hasNewVersion || (res?.behind && res.behind > 0));
        const statusObj = {
          hasUpdate,
          currentVersion: cur,
          latestVersion: isSimulated
            ? res?.latestVersion && res.latestVersion !== cur
              ? res.latestVersion
              : "v2.0.0"
            : latest,
          checked: true,
        };
        setUpdateStatus(statusObj);
        if (typeof window !== "undefined") {
          sessionStorage.setItem("admin_update_status", JSON.stringify(statusObj));
          sessionStorage.setItem("admin_update_check_time", Date.now().toString());
        }
      })
      .catch((e) => {
        console.error("Version check notice:", e);
      });
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Sidebar */}
      <AdminSidebar
        open={open}
        onClose={() => setOpen(false)}
        pathname={pathname}
        isEnterprisePlus={isEnterprisePlus}
        hasUpdate={updateStatus.hasUpdate}
        siteSettings={s}
        onLogout={handleLogout}
      />

      {/* Main Container */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <AdminTopBar
          onOpenSidebar={() => setOpen(true)}
          hasUpdate={updateStatus.hasUpdate}
          latestVersion={updateStatus.latestVersion}
          pathname={pathname}
          initials={initials}
          email={email}
        />

        <main className="p-4 sm:p-6 lg:p-8">
          {updateStatus.hasUpdate && !dismissed && pathname !== "/admin/updates" ? (
            <AdminUpdatePrompt
              firstName={firstName}
              currentVersion={updateStatus.currentVersion}
              latestVersion={updateStatus.latestVersion}
              onDismiss={() => {
                setDismissed(true);
                if (typeof window !== "undefined") {
                  sessionStorage.setItem("admin_update_dismissed", "1");
                }
              }}
            />
          ) : (
            <Outlet />
          )}
        </main>
      </div>
    </div>
  );
}
