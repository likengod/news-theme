import React from "react";
import { User, Eye, EyeOff } from "lucide-react";

interface AdminConfig {
  displayName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface SetupAdminStepProps {
  adminConfig: AdminConfig;
  handleAdminChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  showAdminPwd: boolean;
  setShowAdminPwd: (val: boolean) => void;
  showConfirmPwd: boolean;
  setShowConfirmPwd: (val: boolean) => void;
  onBack: () => void;
  onNext: () => void;
}

export function SetupAdminStep({
  adminConfig,
  handleAdminChange,
  showAdminPwd,
  setShowAdminPwd,
  showConfirmPwd,
  setShowConfirmPwd,
  onBack,
  onNext,
}: SetupAdminStepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-white flex items-center gap-2">
          <User className="h-5 w-5 text-amber-500" /> Create Super Administrator
        </h3>
        <p className="mt-1 text-xs text-slate-400">
          This account will have full access to manage content, news articles, journalists, and
          system settings.
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-300">Display Name</label>
          <input
            name="displayName"
            value={adminConfig.displayName}
            onChange={handleAdminChange}
            className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-300">Admin Email</label>
          <input
            type="email"
            name="email"
            value={adminConfig.email}
            onChange={handleAdminChange}
            className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Password</label>
            <div className="relative">
              <input
                type={showAdminPwd ? "text" : "password"}
                name="password"
                value={adminConfig.password}
                onChange={handleAdminChange}
                placeholder="At least 8 characters"
                className="w-full bg-slate-900 border border-slate-700 rounded-md pl-3 pr-10 py-2 text-sm text-slate-100 focus:outline-none focus:border-amber-500"
              />
              <button
                type="button"
                onClick={() => setShowAdminPwd(!showAdminPwd)}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-200"
              >
                {showAdminPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Confirm Password</label>
            <div className="relative">
              <input
                type={showConfirmPwd ? "text" : "password"}
                name="confirmPassword"
                value={adminConfig.confirmPassword}
                onChange={handleAdminChange}
                className="w-full bg-slate-900 border border-slate-700 rounded-md pl-3 pr-10 py-2 text-sm text-slate-100 focus:outline-none focus:border-amber-500"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPwd(!showConfirmPwd)}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-200"
              >
                {showConfirmPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-slate-700 flex justify-between">
        <button
          onClick={onBack}
          className="px-4 py-2 border border-slate-600 rounded-md text-sm font-semibold text-slate-300 hover:bg-slate-700"
        >
          Back
        </button>
        <button
          onClick={onNext}
          className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-900 rounded-md font-bold text-sm transition"
        >
          Review &amp; Confirm
        </button>
      </div>
    </div>
  );
}
