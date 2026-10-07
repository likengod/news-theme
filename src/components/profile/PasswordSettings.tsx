import { useState } from "react";
import { Eye, EyeOff, Check, X, Save, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useServerFn } from "@tanstack/react-start";
import { changeMyPassword } from "@/lib/auth.functions";

export function PasswordSettings() {
  const doChangePassword = useServerFn(changeMyPassword);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [saving, setSaving] = useState(false);

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    setSaving(true);
    try {
      await doChangePassword({ data: { password } });
      toast.success("Password changed! Other sessions have been signed out.");
      setPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      toast.error(err?.message ?? "Failed to change password");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <div className="border-b border-slate-100 bg-slate-50 px-6 py-4">
        <h2 className="text-base font-bold text-slate-900">Change Password</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Your other active sessions will be signed out automatically
        </p>
      </div>
      <form onSubmit={handleChangePassword} className="p-6 space-y-5 max-w-md">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">New Password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimum 8 characters"
              className="w-full rounded-lg border border-slate-200 py-2.5 pl-4 pr-10 text-sm focus:border-slate-900 focus:outline-none"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            Confirm New Password
          </label>
          <input
            type="password"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Repeat new password"
            className="w-full rounded-lg border border-slate-200 py-2.5 px-4 text-sm focus:border-slate-900 focus:outline-none"
          />
        </div>
        {confirmPassword && password !== confirmPassword && (
          <p className="flex items-center gap-1.5 text-xs text-red-600">
            <X className="h-3.5 w-3.5" /> Passwords do not match
          </p>
        )}
        {confirmPassword && password === confirmPassword && password.length >= 8 && (
          <p className="flex items-center gap-1.5 text-xs text-emerald-600">
            <Check className="h-3.5 w-3.5" /> Passwords match
          </p>
        )}
        <button
          type="submit"
          disabled={saving || password.length < 8 || password !== confirmPassword}
          className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-50 transition-colors"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save Password
        </button>
      </form>
    </div>
  );
}
