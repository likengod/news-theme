import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import { toast } from "sonner";
import { Eye, EyeOff, Lock, User, Mail, AtSign } from "lucide-react";
import { authClient as supabase } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Turnstile } from "@marsidev/react-turnstile";
import { SocialDivider, SocialRow } from "./SocialButtons";

export const signUpSchema = z
  .object({
    firstName: z.string().trim().min(1, "First name is required").max(40),
    lastName: z.string().trim().min(1, "Last name is required").max(40),
    username: z
      .string()
      .trim()
      .min(3, "Username must be at least 3 characters")
      .max(30)
      .regex(/^[a-zA-Z0-9_.]+$/, "Letters, numbers, _ and . only"),
    email: z.string().trim().email("Enter a valid email").max(255),
    phone: z.string().trim().min(7, "Enter a valid phone").max(20),
    password: z.string().min(6, "Password must be at least 6 characters").max(72),
    confirmPassword: z.string().min(6).max(72),
    agree: z.literal(true, { errorMap: () => ({ message: "You must agree to the terms" }) }),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export function RegisterForm({ onSwitchToSignin }: { onSwitchToSignin: () => void }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPwd2, setShowPwd2] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agree, setAgree] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState("");

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!turnstileToken) return toast.error("Please complete the captcha verification.");
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
    const { error } = await (supabase.auth.signUp as any)({
      email: parsed.data.email,
      password: parsed.data.password,
      phone: parsed.data.phone,
      turnstileToken,
      options: {
        emailRedirectTo: `${window.location.origin}/`,
        data: {
          display_name: `${parsed.data.firstName} ${parsed.data.lastName}`,
          first_name: parsed.data.firstName,
          last_name: parsed.data.lastName,
          username: parsed.data.username,
        },
      } as any,
    });
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success("Account created");
    navigate({ to: "/" });
  };

  return (
    <div className="mt-4 pt-4">
      <div className="mb-6 text-center">
        <h1 className="font-serif text-3xl font-bold tracking-tight">Create Account</h1>
        <p className="mt-1 text-sm text-muted-foreground">Join News Theme today</p>
      </div>

      <form onSubmit={handleSignUp} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="firstName" className="text-sm font-semibold">
              First Name
            </Label>
            <div className="relative">
              <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="firstName"
                name="firstName"
                type="text"
                placeholder="First name"
                autoComplete="given-name"
                className="pl-10"
                required
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="lastName" className="text-sm font-semibold">
              Last Name
            </Label>
            <div className="relative">
              <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="lastName"
                name="lastName"
                type="text"
                placeholder="Last name"
                autoComplete="family-name"
                className="pl-10"
                required
              />
            </div>
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="username" className="text-sm font-semibold">
            Username
          </Label>
          <div className="relative">
            <AtSign className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="username"
              name="username"
              type="text"
              placeholder="Choose a unique username"
              autoComplete="username"
              className="pl-10"
              required
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="signup-email" className="text-sm font-semibold">
            Email Address
          </Label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="signup-email"
              name="email"
              type="email"
              placeholder="Enter your email"
              autoComplete="email"
              className="pl-10"
              required
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="phone" className="text-sm font-semibold">
            Phone Number
          </Label>
          <div className="flex overflow-hidden rounded-md border border-input bg-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
            <div className="relative flex items-center border-r border-input bg-muted/50 px-3">
              <select className="appearance-none bg-transparent pr-4 text-sm outline-none font-medium text-muted-foreground">
                <option>Mobile</option>
                <option>Home</option>
                <option>Work</option>
              </select>
              <svg
                className="absolute right-2 h-3 w-3 text-muted-foreground pointer-events-none"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
            <div className="flex items-center border-r border-input bg-muted/20 px-3">
              <span className="text-sm font-medium text-muted-foreground">+91</span>
            </div>
            <input
              id="phone"
              name="phone"
              type="tel"
              placeholder="Phone number"
              autoComplete="tel"
              className="flex-1 bg-transparent px-3 py-2 text-sm outline-none"
              required
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="signup-password" className="text-sm font-semibold">
            Password
          </Label>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="signup-password"
              name="password"
              type={showPwd2 ? "text" : "password"}
              placeholder="Create password"
              autoComplete="new-password"
              minLength={6}
              className="px-10"
              required
            />
            <button
              type="button"
              onClick={() => setShowPwd2((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label="Toggle password"
            >
              {showPwd2 ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="confirmPassword" className="text-sm font-semibold">
            Re-enter Password
          </Label>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirm ? "text" : "password"}
              placeholder="Confirm password"
              autoComplete="new-password"
              minLength={6}
              className="px-10"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirm((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label="Toggle password"
            >
              {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <label className="flex items-start gap-3 text-sm">
          <Checkbox
            id="agree"
            checked={agree}
            onCheckedChange={(v) => setAgree(v === true)}
            className="mt-1 h-5 w-5 rounded shadow-sm border-slate-300 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
          />
          <span className="leading-snug text-slate-700">
            I confirm that I have read, consent and agree to Gorilla Tech's{" "}
            <Link
              to="/terms-and-conditions"
              className="font-semibold text-blue-600 hover:underline"
            >
              User Agreement
            </Link>{" "}
            and{" "}
            <Link
              to="/privacy-policy"
              className="font-semibold text-blue-600 hover:underline"
            >
              Privacy Policy
            </Link>
            , and I am of legal age. I understand that I can change my communication
            preferences any time in my Account.
          </span>
        </label>

        <div className="flex justify-center my-4 overflow-hidden">
          <Turnstile siteKey="1x00000000000000000000AA" onSuccess={setTurnstileToken} />
        </div>

        <Button
          type="submit"
          className="h-12 w-full rounded-md bg-blue-600 text-base font-medium text-white hover:bg-blue-700 disabled:bg-blue-400 disabled:opacity-100"
          disabled={loading || !agree}
        >
          {loading ? "Please wait…" : "Continue"}
        </Button>
      </form>

      <SocialDivider />
      <SocialRow />

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <button
          onClick={onSwitchToSignin}
          className="font-semibold text-foreground hover:underline"
        >
          Sign In
        </button>
      </p>
    </div>
  );
}
