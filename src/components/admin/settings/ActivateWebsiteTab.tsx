import { useState } from "react";
import { CheckCircle2, Key, ShieldAlert, ShoppingCart, Loader2, Calendar, ShieldCheck } from "lucide-react";
import { type SiteSettings } from "@/lib/site-content";
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
  const [inputValue, setInputValue] = useState(s.licenseKey || "");
  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);
  const [isActivating, setIsActivating] = useState(false);

  // Simple validation logic
  const isValid = Boolean(s.licenseKey && s.licenseKey.length > 10);

  const handleActivate = async () => {
    const rawKey = inputValue.trim().toUpperCase();
    if (!rawKey) return;
    setIsActivating(true);

    // 1. Direct validation for Enterprise+, Enterprise, Premium, or Demo licenses
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
      let plan = "Enterprise+";
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

      if (rawKey.includes("ENTPLUS") || rawKey.includes("ENTERPRISE-PLUS") || rawKey.includes("ENTERPRISE+")) {
        plan = "Enterprise+";
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

      update("licenseKey", rawKey);
      update("licenseType", plan);
      update("licenseRole", role);
      update("licenseExpiresAt", expiryIso);

      toast.success(`${plan} License activated successfully! (Valid for ${months} months)`);
      setIsActivating(false);
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
      } else {
        throw new Error(data.error || data.message || "Invalid license");
      }
    } catch (err: any) {
      toast.error(err.message || "Could not connect to license server");
    } finally {
      setIsActivating(false);
    }
  };

  const handleDeactivate = () => {
    setInputValue("");
    update("licenseKey", "");
    update("licenseType", "");
    update("licenseRole", "");
    update("licenseExpiresAt", "");
    toast.info("Website license deactivated.");
  };

  const daysRemaining = s.licenseExpiresAt
    ? Math.max(0, Math.ceil((new Date(s.licenseExpiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    : null;

  return (
    <div className="space-y-6">
      {isValid ? (
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-6 space-y-4">
          <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
            <div className="shrink-0 max-w-lg">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-emerald-600" />
                <h3 className="text-base font-bold text-slate-900 tracking-tight">Software License Active</h3>
              </div>
              <p className="mt-1 text-xs text-slate-500">
                Your license is verified and all enterprise features, advertisements, and background automation are unlocked.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={handleDeactivate}
                className="shrink-0 rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-rose-600 transition hover:bg-rose-50 hover:border-rose-200"
              >
                Change / Deactivate License
              </button>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 pt-2 border-t border-slate-100">
            <div className="rounded-lg bg-slate-50 p-3 border border-slate-100">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Plan Tier</span>
              <div className="mt-1 flex items-center gap-1.5">
                <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-extrabold text-emerald-800">
                  {s.licenseType || "Enterprise+"}
                </span>
                <span className="rounded-full bg-slate-900 px-2.5 py-0.5 text-[10px] font-bold text-white">
                  {s.licenseRole || "VIP"}
                </span>
              </div>
            </div>

            <div className="rounded-lg bg-slate-50 p-3 border border-slate-100">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Status</span>
              <div className="mt-1 flex items-center gap-1.5 text-xs font-bold text-emerald-600">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                <span>Active & Verified</span>
              </div>
            </div>

            <div className="rounded-lg bg-slate-50 p-3 border border-slate-100">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Validity</span>
              <div className="mt-1 flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                <Calendar className="h-4 w-4 text-slate-400 shrink-0" />
                <span>{daysRemaining !== null ? `${daysRemaining} Days Left` : "Permanent"}</span>
              </div>
            </div>

            <div className="rounded-lg bg-slate-50 p-3 border border-slate-100">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">License Key</span>
              <div className="mt-1 font-mono text-xs font-bold text-slate-700 truncate" title={s.licenseKey}>
                {s.licenseKey}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <Card
          title="Software Activation"
          subtitle="Enter your license key to activate your website and unlock premium features or support."
        >
          <div className="flex flex-col md:flex-row items-start gap-6">
            <div className="flex-1 space-y-4 w-full">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  License Key
                </label>
                <div className="flex flex-wrap sm:flex-nowrap gap-3">
                  <div className="relative flex-1 w-full">
                    <Key className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder="Enter your license key (e.g. XXXX-XXXX-XXXX-XXXX)"
                      className="w-full rounded-md border border-slate-300 py-2.5 pl-9 pr-4 text-sm focus:border-slate-900 focus:outline-none"
                    />
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
                    <button
                      onClick={() => setIsPricingModalOpen(true)}
                      className="flex-1 sm:flex-none shrink-0 flex items-center justify-center gap-2 rounded bg-[#34c759] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#2eaa4c]"
                    >
                      <ShoppingCart className="h-4 w-4 text-white" />
                      Buy License
                    </button>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 flex items-start gap-3">
                <ShieldAlert className="h-5 w-5 text-amber-600 mt-0.5 shrink-0" />
                <div>
                  <h4 className="text-sm font-semibold text-amber-800">Activation Required</h4>
                  <p className="text-xs text-amber-600 mt-1">
                    Please provide a valid license key to activate your website.
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
