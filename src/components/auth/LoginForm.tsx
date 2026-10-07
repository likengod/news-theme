import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import { toast } from "sonner";
import { Eye, EyeOff, Lock, User } from "lucide-react";
import { authClient as supabase } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { SocialDivider, SocialRow } from "./SocialButtons";

export const signInSchema = z.object({
  identifier: z.string().trim().min(3, "Enter email, username or phone").max(255),
  password: z.string().min(6, "Password must be at least 6 characters").max(72),
});

export function LoginForm({ onSwitchToSignup }: { onSwitchToSignup: () => void }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const parsed = signInSchema.safeParse({
      identifier: fd.get("identifier"),
      password: fd.get("password"),
    });
    if (!parsed.success) return toast.error(parsed.error.issues[0].message);

    setLoading(true);
    const id = parsed.data.identifier;
    const creds = { email: id, password: parsed.data.password };
    const { error } = await supabase.auth.signInWithPassword(creds);
    setLoading(false);
    if (error) return toast.error(error.message);
    // Block inactive journalists / users
    try {
      const { data: userData } = await supabase.auth.getUser();
      const uid = userData.user?.id;
      if (uid) {
        const { data: prof } = await ((supabase as any).from("profiles"))
          .select("active")
          .eq("id", uid)
          .maybeSingle();
        if (prof && (prof as any).active === false) {
          await supabase.auth.signOut();
          return toast.error("Your account is inactive. Please contact the office.");
        }
      }
    } catch {
      /* ignore */
    }
    toast.success("Welcome back");
    navigate({ to: "/" });
  };

  return (
    <div className="mt-4 pt-4">
      <div className="mb-6 text-center">
        <h1 className="font-serif text-3xl font-bold tracking-tight">Welcome Back</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Sign in to your account to continue
        </p>
      </div>

      <form onSubmit={handleSignIn} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="identifier" className="text-sm font-semibold">
            Email, Username, or Phone
          </Label>
          <div className="relative">
            <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="identifier"
              name="identifier"
              type="text"
              placeholder="Email, username, or phone number"
              className="pl-10"
              required
            />
          </div>
          <p className="text-xs text-muted-foreground">
            You can sign in with your email, username, or phone number
          </p>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="signin-password" className="text-sm font-semibold">
            Password
          </Label>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="signin-password"
              name="password"
              type={showPwd ? "text" : "password"}
              placeholder="Enter your password"
              autoComplete="current-password"
              className="px-10"
              required
            />
            <button
              type="button"
              onClick={() => setShowPwd((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label="Toggle password"
            >
              {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-sm font-medium">
            <Checkbox id="remember" />
            Remember me
          </label>
          <Link
            to="/forgot-password"
            className="text-sm font-medium underline-offset-2 hover:underline"
          >
            Forgot password?
          </Link>
        </div>

        <Button
          type="submit"
          className="h-11 w-full bg-slate-800 text-white hover:bg-slate-900"
          disabled={loading}
        >
          {loading ? "Signing in…" : "Sign In"}
        </Button>
      </form>

      <SocialDivider />
      <SocialRow />

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Don't have an account?{" "}
        <button
          onClick={onSwitchToSignup}
          className="font-semibold text-foreground hover:underline"
        >
          Sign Up
        </button>
      </p>
    </div>
  );
}
