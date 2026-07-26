import { useEffect, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { LogOut, Settings, Wallet, User as UserIcon, LayoutDashboard, Star, Moon, Sun } from "lucide-react";
import { toast } from "sonner";
import { authClient as supabase } from "@/lib/auth-client";
import { getCurrentUserRole } from "@/lib/auth.functions";
import { useTheme } from "@/lib/theme";

type User = { id: string; email?: string; user_metadata?: Record<string, unknown> };
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function displayNameOf(u: User): string {
  const meta = (u.user_metadata ?? {}) as Record<string, unknown>;
  return (
    (meta.username as string) ||
    (meta.display_name as string) ||
    [meta.first_name, meta.last_name].filter(Boolean).join(" ").trim() ||
    (u.email ? u.email.split("@")[0] : "Account")
  );
}

function initialsOf(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("") || "U";
}

function getPoints(userId: string): number {
  if (typeof window === "undefined") return 0;
  const key = `nt:points:${userId}`;
  const existing = localStorage.getItem(key);
  if (existing !== null) return Number(existing) || 0;
  const seed = 25 + Math.floor(Math.random() * 75);
  localStorage.setItem(key, String(seed));
  return seed;
}

export function UserMenu({ variant = "topbar" }: { variant?: "topbar" | "mobile" }) {
  const [user, setUser] = useState<User | null>(null);
  const [points, setPoints] = useState<number>(0);
  const [role, setRole] = useState<string | null>(null);
  const { theme, toggle: toggleTheme } = useTheme();
  const isDark = theme === "dark";
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    supabase.auth.getSession().then(async ({ data }) => {
      if (!mounted) return;
      setUser(data.session?.user ?? null);
      if (data.session?.user) {
        setPoints(getPoints(data.session.user.id));
        try {
          const roleRes = await getCurrentUserRole({ data: data.session.access_token });
          if (mounted) setRole(roleRes.role);
        } catch {
          if (mounted) setRole(null);
        }
      } else {
        setRole(null);
      }
    });
    const { data: sub } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event !== "SIGNED_IN" && event !== "SIGNED_OUT" && event !== "USER_UPDATED" && event !== "INITIAL_SESSION") return;
      setUser(session?.user ?? null);
      if (session?.user) {
        setPoints(getPoints(session.user.id));
        try {
          const roleRes = await getCurrentUserRole({ data: session.access_token });
          if (mounted) setRole(roleRes.role);
        } catch {
          if (mounted) setRole(null);
        }
      } else {
        setRole(null);
      }
    });
    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast.success("Signed out");
    navigate({ to: "/" });
  };

  if (!user) {
    if (variant === "mobile") {
      return (
        <div className="flex flex-col gap-2">
          <Link to="/auth" className="hover:text-foreground">Sign in</Link>
        </div>
      );
    }
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className="flex items-center gap-1.5 font-semibold text-foreground underline-offset-2 hover:underline focus:outline-none"
          >
            <span>Sign in</span>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem asChild>
            <Link to="/auth" className="cursor-pointer font-semibold">
              <UserIcon className="mr-2 h-4 w-4" />
              Sign in / Register
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={toggleTheme} className="cursor-pointer">
            {isDark ? <Sun className="mr-2 h-4 w-4 text-amber-500" /> : <Moon className="mr-2 h-4 w-4 text-slate-700" />}
            <span>{isDark ? "Day Mode" : "Night Mode"}</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  const name = displayNameOf(user);
  const initials = initialsOf(name);

  const isStaff = role && ["admin", "editor", "author", "developer"].includes(role);
  const isEarningUser = !isStaff;

  if (variant === "mobile") {
    return (
      <div className="flex flex-col gap-2 normal-case tracking-normal">
        <div className="flex items-center gap-2 text-foreground">
          <span className="grid h-8 w-8 place-items-center rounded-full bg-foreground text-[11px] font-bold text-background">
            {initials}
          </span>
          <div className="flex flex-col text-xs">
            <span className="font-semibold">{name}</span>
            {isEarningUser && <span className="text-muted-foreground">Wallet: ₹{points}</span>}
          </div>
        </div>
        {isEarningUser && (
          <>
            <Link to="/earn-points" className="hover:text-foreground">Wallet</Link>
            <Link to="/earn-points" className="hover:text-foreground">Earn Points</Link>
            <Link to="/profile" className="hover:text-foreground">My profile</Link>
          </>
        )}
        {isStaff && (
          <>
            <Link to="/admin" className="hover:text-foreground">Admin panel</Link>
            <Link to="/admin/settings" className="hover:text-foreground">Settings</Link>
          </>
        )}
        <button type="button" onClick={handleSignOut} className="text-left hover:text-foreground">Sign out</button>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label="Open account menu"
          className="flex items-center gap-2 rounded-full border border-border bg-background px-1 py-1 pr-2 text-foreground transition-colors hover:bg-muted"
        >
          <span className="grid h-6 w-6 place-items-center rounded-full bg-foreground text-[10px] font-bold text-background">
            {initials}
          </span>
          <span className="hidden max-w-[8rem] truncate text-[11px] font-semibold normal-case tracking-normal sm:inline">
            {name}
          </span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="flex flex-col">
          <span className="text-sm font-semibold text-foreground">{name}</span>
          {user.email && <span className="text-xs font-normal text-muted-foreground">{user.email}</span>}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {/* Earning Users Only: Wallet & Earn Points & Profile */}
        {isEarningUser && (
          <>
            <DropdownMenuItem asChild>
              <Link to="/earn-points" className="cursor-pointer">
                <Wallet className="mr-2 h-4 w-4 text-emerald-600" />
                <span className="flex-1">Wallet</span>
                <span className="ml-2 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700">₹{points}</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/earn-points" className="cursor-pointer">
                <Star className="mr-2 h-4 w-4 text-amber-500" />
                <span className="flex-1">Earn Points</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/profile" className="cursor-pointer">
                <UserIcon className="mr-2 h-4 w-4" />
                My profile
              </Link>
            </DropdownMenuItem>
          </>
        )}

        {/* Admins & Staff Only: Admin Panel */}
        {isStaff && (
          <DropdownMenuItem asChild>
            <Link to="/admin" className="cursor-pointer font-semibold">
              <LayoutDashboard className="mr-2 h-4 w-4 text-slate-700" />
              Admin Panel
            </Link>
          </DropdownMenuItem>
        )}

        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={toggleTheme} className="cursor-pointer">
          {isDark ? <Sun className="mr-2 h-4 w-4 text-amber-500" /> : <Moon className="mr-2 h-4 w-4 text-slate-700" />}
          <span>{isDark ? "Day Mode" : "Night Mode"}</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-red-600 focus:text-red-700">
          <LogOut className="mr-2 h-4 w-4" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
