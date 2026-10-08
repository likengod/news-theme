import { useState } from "react";
import {
  createFileRoute,
  Outlet,
  redirect,
  useNavigate,
  useLocation,
  Link,
} from "@tanstack/react-router";
import { Rocket } from "lucide-react";
import { authClient as supabase } from "@/lib/auth-client";
import { getUserServer, getCurrentUserRole } from "@/lib/auth.functions";
import { useSiteSettings } from "@/components/site/AdSettingsContext";
import { isEnterprisePlusLicense } from "@/lib/site-content";
import { AdminSidebar } from "@/components/admin/layout/AdminSidebar";
import { AdminTopBar } from "@/components/admin/layout/AdminTopBar";
import { getAdminUserDisplayInfo } from "@/components/admin/layout/adminUserUtils";
import { useAdminTheme } from "@/components/admin/hooks/useAdminTheme";
import { useAdminUpdateChecker } from "@/components/admin/hooks/useAdminUpdateChecker";

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

  useAdminTheme();
  const { updateStatus, dismissed, setDismissed } = useAdminUpdateChecker(pathname);
  const { email, initials, firstName } = getAdminUserDisplayInfo(user);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/auth" });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900" style={{ fontFamily: "Inter, system-ui, sans-serif" }}>
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
          {updateStatus.hasUpdate && !dismissed && pathname !== "/admin/updates" && (
            <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 rounded-xl border border-indigo-200 bg-indigo-50/80 p-3.5 sm:p-4 text-indigo-950 shadow-xs">
              <div className="flex items-center gap-2.5 sm:gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-600 text-white">
                  <Rocket className="h-4 w-4" />
                </div>
                <div className="text-xs sm:text-sm">
                  <span className="font-semibold text-indigo-900">System Update Available: </span>
                  Version <span className="font-mono font-bold text-indigo-700">{updateStatus.latestVersion}</span> is available (current: <span className="font-mono">{updateStatus.currentVersion}</span>).
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end">
                <Link
                  to="/admin/updates"
                  className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-700 transition"
                >
                  View Details
                </Link>
                <button
                  type="button"
                  onClick={() => setDismissed()}
                  className="rounded-lg border border-indigo-200 bg-white px-2.5 py-1.5 text-xs font-medium text-indigo-800 hover:bg-indigo-100 transition"
                  title="Dismiss this notice"
                >
                  Dismiss
                </button>
              </div>
            </div>
          )}

          <Outlet />
        </main>
      </div>
    </div>
  );
}
