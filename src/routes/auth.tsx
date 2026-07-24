import { useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import { toast } from "sonner";
import { Eye, EyeOff, Lock, User, Mail, Phone, AtSign } from "lucide-react";
import { authClient as supabase } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in or create an account — News Theme" },
      { name: "description", content: "Sign in to your News Theme account or create a new one." },
    ],
  }),
  component: AuthPage,
});

const signInSchema = z.object({
  identifier: z.string().trim().min(3, "Enter email, username or phone").max(255),
  password: z.string().min(6, "Password must be at least 6 characters").max(72),
});

const signUpSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required").max(40),
  lastName: z.string().trim().min(1, "Last name is required").max(40),
  username: z.string().trim().min(3, "Username must be at least 3 characters").max(30).regex(/^[a-zA-Z0-9_.]+$/, "Letters, numbers, _ and . only"),
  email: z.string().trim().email("Enter a valid email").max(255),
  phone: z.string().trim().min(7, "Enter a valid phone").max(20),
  password: z.string().min(6, "Password must be at least 6 characters").max(72),
  confirmPassword: z.string().min(6).max(72),
  agree: z.literal(true, { errorMap: () => ({ message: "You must agree to the terms" }) }),
}).refine((d) => d.password === d.confirmPassword, { message: "Passwords do not match", path: ["confirmPassword"] });


function GoogleIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#1877F2" d="M24 12a12 12 0 1 0-13.9 11.9v-8.4H7.1V12h3V9.4c0-3 1.8-4.6 4.5-4.6 1.3 0 2.7.2 2.7.2v3h-1.5c-1.5 0-2 .9-2 1.9V12h3.3l-.5 3.5h-2.8v8.4A12 12 0 0 0 24 12z"/>
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#0A66C2" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
    </svg>
  );
}



function AuthPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const [showPwd2, setShowPwd2] = useState(false);
  const [tab, setTab] = useState<"signin" | "signup">("signin");
  const [showConfirm, setShowConfirm] = useState(false);
  const [agree, setAgree] = useState(false);


  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/" });
    });
  }, [navigate]);

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
        const { data: prof } = await (supabase.from("profiles") as any)
          .select("active").eq("id", uid).maybeSingle();
        if (prof && (prof as any).active === false) {
          await supabase.auth.signOut();
          return toast.error("Your account is inactive. Please contact the office.");
        }
      }
    } catch { /* ignore */ }
    toast.success("Welcome back");
    navigate({ to: "/" });
  };

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const parsed = signUpSchema.safeParse({
      firstName: fd.get("firstName"),
      lastName: fd.get("lastName"),
      username: fd.get("username"),
      email: fd.get("email"),
      phone: fd.get("phone"),
      password: fd.get("password"),
      confirmPassword: fd.get("confirmPassword"),
      agree: agree,
    });
    if (!parsed.success) return toast.error(parsed.error.issues[0].message);
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email: parsed.data.email,
      password: parsed.data.password,
      phone: parsed.data.phone,
      options: {
        emailRedirectTo: `${window.location.origin}/`,
        data: {
          display_name: `${parsed.data.firstName} ${parsed.data.lastName}`,
          first_name: parsed.data.firstName,
          last_name: parsed.data.lastName,
          username: parsed.data.username,
        },
      },
    });
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success("Account created");
    navigate({ to: "/" });
  };


  const handleGoogle = async () => {
    toast.info("Google OAuth login can be configured in Admin -> Site Settings -> Login Providers");
  };

  const handleUnsupported = (name: string) => {
    toast.info(`${name} sign-in is coming soon`);
  };

  return (
    <div className="min-h-screen bg-background px-4 py-12">
      <div className="mx-auto w-full max-w-md">
        <Tabs value={tab} onValueChange={(v) => setTab(v as "signin" | "signup")} className="w-full">
          <TabsList className="grid h-11 w-full grid-cols-2 rounded-md bg-muted p-1">
            <TabsTrigger value="signin" className="rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm">
              Sign In
            </TabsTrigger>
            <TabsTrigger value="signup" className="rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm">
              Sign Up
            </TabsTrigger>
          </TabsList>


          <TabsContent value="signin">
            <div className="mt-4 rounded-lg bg-white p-8">
              <div className="mb-6 text-center">
                <h1 className="font-serif text-3xl font-bold tracking-tight">Welcome Back</h1>
                <p className="mt-1 text-sm text-muted-foreground">Sign in to your account to continue</p>
              </div>





              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="identifier" className="text-sm font-semibold">Email, Username, or Phone</Label>
                  <div className="relative">
                    <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input id="identifier" name="identifier" type="text" placeholder="Email, username, or phone number" className="pl-10" required />
                  </div>
                  <p className="text-xs text-muted-foreground">You can sign in with your email, username, or phone number</p>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="signin-password" className="text-sm font-semibold">Password</Label>
                  <div className="relative">
                    <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input id="signin-password" name="password" type={showPwd ? "text" : "password"} placeholder="Enter your password" autoComplete="current-password" className="px-10" required />
                    <button type="button" onClick={() => setShowPwd((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground" aria-label="Toggle password">
                      {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 text-sm font-medium">
                    <Checkbox id="remember" />
                    Remember me
                  </label>
                  <Link to="/forgot-password" className="text-sm font-medium underline-offset-2 hover:underline">
                    Forgot password?
                  </Link>
                </div>

                <Button type="submit" className="h-11 w-full bg-slate-800 text-white hover:bg-slate-900" disabled={loading}>
                  {loading ? "Signing in…" : "Sign In"}
                </Button>
              </form>

              <SocialDivider />
              <SocialRow onGoogle={handleGoogle} onFacebook={() => handleUnsupported("Facebook")} onLinkedIn={() => handleUnsupported("LinkedIn")} />

              <p className="mt-6 text-center text-sm text-muted-foreground">
                Don't have an account?{" "}
                <button onClick={() => setTab("signup")} className="font-semibold text-foreground hover:underline">
                  Sign Up
                </button>
              </p>
            </div>
          </TabsContent>

          <TabsContent value="signup">
            <div className="mt-4 rounded-lg bg-white p-8">
              <div className="mb-6 text-center">
                <h1 className="font-serif text-3xl font-bold tracking-tight">Create Account</h1>
                <p className="mt-1 text-sm text-muted-foreground">Join News Theme today</p>
              </div>

              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="firstName" className="text-sm font-semibold">First Name</Label>
                    <div className="relative">
                      <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input id="firstName" name="firstName" type="text" placeholder="First name" autoComplete="given-name" className="pl-10" required />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="lastName" className="text-sm font-semibold">Last Name</Label>
                    <div className="relative">
                      <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input id="lastName" name="lastName" type="text" placeholder="Last name" autoComplete="family-name" className="pl-10" required />
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="username" className="text-sm font-semibold">Username</Label>
                  <div className="relative">
                    <AtSign className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input id="username" name="username" type="text" placeholder="Choose a unique username" autoComplete="username" className="pl-10" required />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="signup-email" className="text-sm font-semibold">Email Address</Label>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input id="signup-email" name="email" type="email" placeholder="Enter your email" autoComplete="email" className="pl-10" required />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="phone" className="text-sm font-semibold">Phone Number</Label>
                  <div className="relative">
                    <Phone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input id="phone" name="phone" type="tel" placeholder="+1 (555) 123-4567" autoComplete="tel" className="pl-10" required />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="signup-password" className="text-sm font-semibold">Password</Label>
                  <div className="relative">
                    <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input id="signup-password" name="password" type={showPwd2 ? "text" : "password"} placeholder="Create password" autoComplete="new-password" minLength={6} className="px-10" required />
                    <button type="button" onClick={() => setShowPwd2((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground" aria-label="Toggle password">
                      {showPwd2 ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="confirmPassword" className="text-sm font-semibold">Confirm Password</Label>
                  <div className="relative">
                    <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input id="confirmPassword" name="confirmPassword" type={showConfirm ? "text" : "password"} placeholder="Confirm password" autoComplete="new-password" minLength={6} className="px-10" required />
                    <button type="button" onClick={() => setShowConfirm((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground" aria-label="Toggle password">
                      {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <label className="flex items-start gap-2 text-sm font-medium">
                  <Checkbox id="agree" checked={agree} onCheckedChange={(v) => setAgree(v === true)} className="mt-0.5" />
                  <span>
                    I agree to the{" "}
                    <Link to="/terms-and-conditions" className="font-semibold text-foreground underline-offset-2 hover:underline">Terms &amp; Conditions</Link>
                    {" "}and{" "}
                    <Link to="/privacy-policy" className="font-semibold text-foreground underline-offset-2 hover:underline">Privacy Policy</Link>
                  </span>
                </label>

                <Button type="submit" className="h-11 w-full bg-slate-800 text-white hover:bg-slate-900 disabled:bg-slate-400 disabled:opacity-100" disabled={loading || !agree}>
                  {loading ? "Creating account…" : "Create Account"}
                </Button>
              </form>


              <SocialDivider />
              <SocialRow onGoogle={handleGoogle} onFacebook={() => handleUnsupported("Facebook")} onLinkedIn={() => handleUnsupported("LinkedIn")} />

              <p className="mt-6 text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <button onClick={() => setTab("signin")} className="font-semibold text-foreground hover:underline">
                  Sign In
                </button>
              </p>
            </div>
          </TabsContent>
        </Tabs>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          <Link to="/" className="hover:underline">← Back to home</Link>
        </p>
      </div>
    </div>
  );
}

function SocialDivider() {
  return (
    <div className="my-6 flex items-center gap-3">
      <div className="h-px flex-1 bg-border" />
      <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Or continue with</span>
      <div className="h-px flex-1 bg-border" />
    </div>
  );
}

function SocialRow({ onGoogle, onFacebook, onLinkedIn }: { onGoogle: () => void; onFacebook: () => void; onLinkedIn: () => void }) {
  const base = "flex h-12 w-12 items-center justify-center rounded-full transition hover:bg-muted";
  return (
    <div className="flex justify-center gap-6">
      <button type="button" onClick={onGoogle} aria-label="Continue with Google" className={base}><GoogleIcon /></button>
      <button type="button" onClick={onFacebook} aria-label="Continue with Facebook" className={base}><FacebookIcon /></button>
      <button type="button" onClick={onLinkedIn} aria-label="Continue with LinkedIn" className={base}><LinkedInIcon /></button>
    </div>
  );
}
