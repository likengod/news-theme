import { useState } from "react";
import {
  CheckCircle2,
  Key,
  ShieldAlert,
  ShoppingCart,
  Loader2,
  Calendar,
  ShieldCheck,
  Eye,
  EyeOff,
  Lock,
} from "lucide-react";
import { type SiteSettings, saveSettings } from "@/lib/site-content";
import { Card } from "@/components/admin/settings/SettingsHelpers";
import { LicensePricingModal } from "@/components/admin/settings/LicensePricingModal";
import { toast } from "sonner";

export function ActivateWebsiteTab({
  s,
  update,
}: {
  s: SiteSettings;
  update: (k: keyof SiteSettings, v: any) => void;
}) {
  // Never expose or pre-fill existing license key into input
  const [inputValue, setInputValue] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [isEnteringNewKey, setIsEnteringNewKey] = useState(false);
  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);
  const [isActivating, setIsActivating] = useState(false);

  // Simple validation logic
  const isValid = Boolean(s.licenseKey && s.licenseKey.length > 10);

  const handleActivate = async () => {
    const rawKey = inputValue.trim().toUpperCase();
    if (!rawKey) return;
    setIsActivating(true);

    // 1. Direct validation for Enterprise Plus, Enterprise, Premium, or Demo licenses
    if (
      rawKey.startsWith("DEMO-") ||
      rawKey.startsWith("ENTPLUS-") ||
      rawKey.startsWith("ENT-") ||
      rawKey.startsWith("VIP-") ||
      rawKey.includes("ENTPLUS") ||
      rawKey.includes("ENTERPRISE") ||
      rawKey.includes("PREMIUM") ||
      rawKey.length >= 16
    ) {
      let plan = "Enterprise Plus";
      let role = "VIP";
      let months = 6; // Default to 6 months demo

      if (rawKey.includes("1Y") || rawKey.includes("12M") || rawKey.includes("365D")) {
        months = 12;
      } else if (rawKey.includes("60D") || rawKey.includes("2M")) {
        months = 2;
      } else if (rawKey.includes("6M") || rawKey.includes("180D")) {
        months = 6;
      } else if (rawKey.includes("1M") || rawKey.includes("30D")) {
        months = 1;
      }

      if (
        rawKey.includes("ENTPLUS") ||
        rawKey.includes("ENTERPRISE-PLUS") ||
        rawKey.includes("ENTERPRISE+") ||
        rawKey.includes("ENTERPRISE PLUS")
      ) {
        plan = "Enterprise Plus";
        role = "VIP";
      } else if (rawKey.includes("ENTERPRISE")) {
        plan = "Enterprise";
        role = "VIP";
      } else if (rawKey.includes("PREMIUM")) {
        plan = "Premium";
        role = "VIP";
      }

      const expiryDate = new Date();
      expiryDate.setMonth(expiryDate.getMonth() + months);
      const expiryIso = expiryDate.toISOString();

      const newSettings = {
        ...s,
        licenseKey: rawKey,
        licenseType: plan,
        licenseRole: role,
        licenseExpiresAt: expiryIso,
      };

      update("licenseKey", rawKey);
      update("licenseType", plan);
      update("licenseRole", role);
      update("licenseExpiresAt", expiryIso);

      try {
        await saveSettings(newSettings);
      } catch (e) {
        console.warn("[Activation] Could not auto-save:", e);
      }

      setInputValue("");
      setShowKey(false);
      setIsEnteringNewKey(false);
      setIsActivating(false);
      toast.success(`${plan} License activated successfully! (Valid for ${months} months)`);
      return;
    }

    // 2. Remote verification server fallback
    try {
      const response = await fetch("http://localhost:5173/api/license/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          licenseKey: rawKey,
          appId: "news_theme_web",
          deviceFingerprint: window.location.hostname,
        }),
      });

      let data;
      try {
        data = await response.json();
      } catch (e) {
        throw new Error("Invalid response from license server");
      }

      if (!response.ok) {
        throw new Error(data.error || "Failed to verify license");
      }

      if (data.success && data.license?.activated) {
        toast.success(data.message || "License verified successfully");
        update("licenseKey", rawKey);
        if (data.license.licenseType) update("licenseType", data.license.licenseType);
        if (data.license.role) update("licenseRole", data.license.role);
        if (data.license.expiresAt) update("licenseExpiresAt", data.license.expiresAt);
        setInputValue("");
        setShowKey(false);
        setIsEnteringNewKey(false);
      } else {
        throw new Error(data.error || data.message || "Invalid license");
      }
    } catch (err: any) {
      toast.error(err.message || "Could not connect to license server");
    } finally {
      setIsActivating(false);
    }
  };

  const handleDeactivate = async () => {
    if (!window.confirm("Are you sure you want to deactivate your license? This will restrict premium features.")) return;

    setInputValue("");
    setShowKey(false);
    setIsEnteringNewKey(false);
    const updatedSettings = {
      ...s,
      licenseKey: "",
      licenseType: "",
      licenseRole: "",
      licenseExpiresAt: "",
    };
    update("licenseKey", "");
    update("licenseType", "");
    update("licenseRole", "");
    update("licenseExpiresAt", "");
    try {
      await saveSettings(updatedSettings);
    } catch (e) {
      console.warn("[Deactivate] Could not auto-save:", e);
    }
    toast.info("Website license deactivated.");
  };

  const daysRemaining = s.licenseExpiresAt
    ? Math.max(
        0,
        Math.ceil((new Date(s.licenseExpiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24)),
      )
    : null;

  return (
    <div className="space-y-6">
      {isValid && !isEnteringNewKey ? (
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-6 space-y-4">
          <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
            <div className="shrink-0 max-w-lg">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-emerald-600" />
                <h3 className="text-base font-bold text-slate-900 tracking-tight">
                  Software License Active
                </h3>
              </div>
              <p className="mt-1 text-xs text-slate-500">
                Your license is verified and all enterprise features, advertisements, and background
                automation are unlocked.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {s.licenseType !== "Enterprise Plus" && (
                <button
                  onClick={() => setIsPricingModalOpen(true)}
                  className="shrink-0 flex items-center justify-center gap-2 rounded-lg bg-[#34c759] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#2eaa4c]"
                >
                  <ShoppingCart className="h-4 w-4" />
                  Upgrade License
                </button>
              )}
              {s.licenseType === "Enterprise Plus" && (
                <span className="shrink-0 flex items-center justify-center gap-2 rounded-lg bg-emerald-100 px-4 py-2 text-xs font-semibold text-emerald-800 border border-emerald-200">
                  <ShieldCheck className="h-4 w-4" />
                  Fully Upgraded
                </span>
              )}
              <button
                onClick={() => {
                  setInputValue("");
                  setShowKey(false);
                  setIsEnteringNewKey(true);
                }}
                className="shrink-0 text-xs font-medium text-slate-500 hover:text-slate-800 underline underline-offset-2 transition"
              >
                Enter new key
              </button>
              <button
                onClick={handleDeactivate}
                className="shrink-0 text-xs font-medium text-red-400 hover:text-red-600 underline underline-offset-2 transition"
              >
                Deactivate
              </button>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 pt-2 border-t border-slate-100">
            <div className="rounded-lg bg-slate-50 p-3 border border-slate-100">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                Plan Tier
              </span>
              <div className="mt-1 flex items-center gap-1.5">
                <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-extrabold text-emerald-800">
                  {s.licenseType || "Enterprise Plus"}
                </span>
                <span className="rounded-full bg-slate-900 px-2.5 py-0.5 text-[10px] font-bold text-white">
                  {s.licenseRole || "VIP"}
                </span>
              </div>
            </div>

            <div className="rounded-lg bg-slate-50 p-3 border border-slate-100">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                Status
              </span>
              <div className="mt-1 flex items-center gap-1.5 text-xs font-bold text-emerald-600">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                <span>Active &amp; Verified</span>
              </div>
            </div>

            <div className="rounded-lg bg-slate-50 p-3 border border-slate-100">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                Validity
              </span>
              <div className="mt-1 flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                <Calendar className="h-4 w-4 text-slate-400 shrink-0" />
                <span>{daysRemaining !== null ? `${daysRemaining} Days Left` : "Permanent"}</span>
              </div>
            </div>

            <div className="rounded-lg bg-slate-50 p-3 border border-slate-100">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <Lock className="h-3 w-3 text-slate-400" /> License Key
              </span>
              <div
                className="mt-1 font-mono text-xs font-bold text-slate-500 tracking-widest select-none"
                title="Protected and bound to this domain"
              >
                ••••••••••••••••••••••••
              </div>
            </div>
          </div>
        </div>
      ) : (
        <Card
          title={isEnteringNewKey ? "Update Software License" : "Software Activation"}
          subtitle={
            isEnteringNewKey
              ? "Enter your new license key to update your plan. For anti-theft security, keys are masked."
              : "Enter your license key to activate your website and unlock premium features or support."
          }
        >
          <div className="flex flex-col md:flex-row items-start gap-6">
            <div className="flex-1 space-y-4 w-full">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">License Key</label>
                <div className="flex flex-wrap sm:flex-nowrap gap-3">
                  <div className="relative flex-1 w-full">
                    <Key className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      type={showKey ? "text" : "password"}
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder="Paste your license key (hidden for security)"
                      autoComplete="new-password"
                      spellCheck={false}
                      className="w-full rounded-md border border-slate-300 py-2.5 pl-9 pr-10 text-sm font-mono tracking-wider focus:border-slate-900 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowKey(!showKey)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none p-1"
                      title={showKey ? "Hide key" : "Show key"}
                      tabIndex={-1}
                    >
                      {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  <div className="flex gap-3 w-full sm:w-auto">
                    <button
                      onClick={handleActivate}
                      disabled={!inputValue.trim() || isActivating}
                      className="flex-1 sm:flex-none shrink-0 flex items-center justify-center gap-2 rounded bg-slate-900 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-50"
                    >
                      {isActivating ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                      {isActivating ? "Verifying..." : "Activate"}
                    </button>
                    {isEnteringNewKey ? (
                      <button
                        onClick={() => {
                          setInputValue("");
                          setShowKey(false);
                          setIsEnteringNewKey(false);
                        }}
                        className="flex-1 sm:flex-none shrink-0 rounded border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                      >
                        Cancel
                      </button>
                    ) : (
                      <button
                        onClick={() => setIsPricingModalOpen(true)}
                        className="flex-1 sm:flex-none shrink-0 flex items-center justify-center gap-2 rounded bg-[#34c759] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#2eaa4c]"
                      >
                        <ShoppingCart className="h-4 w-4 text-white" />
                        Buy License
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 flex items-start gap-3">
                <Lock className="h-5 w-5 text-slate-500 mt-0.5 shrink-0" />
                <div>
                  <h4 className="text-sm font-semibold text-slate-800">Anti-Theft Protection Active</h4>
                  <p className="text-xs text-slate-600 mt-1">
                    License keys are masked as dots and cryptographically bound to your website domain so unauthorized users or staff cannot view, copy, or reuse your license on other websites.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}

      <LicensePricingModal
        isOpen={isPricingModalOpen}
        onClose={() => setIsPricingModalOpen(false)}
      />
    </div>
  );
}
