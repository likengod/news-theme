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
} from "lucide-react";
import { authClient as supabase } from "@/lib/auth-client";
import { getUserServer, getCurrentUserRole } from "@/lib/auth.functions";

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
                N
              </div>
              <div className="leading-tight">
                <div className="text-sm font-bold">Northeast</div>
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
              const active = item.exact
                ? pathname === item.to
                : pathname.startsWith(item.to);
              return (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    onClick={() => setOpen(false)}
                    className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition ${
                      active
                        ? "bg-slate-900 text-white"
                        : "text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
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
          <Outlet />
        </main>
      </div>
    </div>
  );
}
