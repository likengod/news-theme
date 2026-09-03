import { useState } from "react";
import { CheckCircle2, Key, ShieldAlert, ShoppingCart, Loader2 } from "lucide-react";
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
  const isValid = s.licenseKey && s.licenseKey.length > 10;

  const handleActivate = async () => {
    if (!inputValue.trim()) return;
    setIsActivating(true);
    
    try {
      const response = await fetch("http://localhost:5173/api/license/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          licenseKey: inputValue.trim(),
          appId: "news_theme_web",
          deviceFingerprint: window.location.hostname
        })
      });

      // Handle raw response safely
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
        update("licenseKey", inputValue.trim());
        if (data.license.licenseType) update("licenseType", data.license.licenseType);
        if (data.license.role) update("licenseRole", data.license.role);
      } else {
        throw new Error(data.error || data.message || "Invalid license");
      }
    } catch (err: any) {
      toast.error(err.message || "Could not connect to license server");
      
      // Fallback for demo purposes if the API doesn't exist yet
      if (inputValue.trim().startsWith("DEMO-")) {
        toast.success("Demo mode activated locally.");
        update("licenseKey", inputValue.trim());
        update("licenseType", "Demo");
        update("licenseRole", "VIP");
      }
    } finally {
      setIsActivating(false);
    }
  };

  const handleDeactivate = () => {
    setInputValue("");
    update("licenseKey", "");
    update("licenseType", "");
    update("licenseRole", "");
  };

  return (
    <div className="space-y-6">
      {isValid ? (
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm px-6 py-6 flex flex-col xl:flex-row xl:items-center justify-between gap-6">
          <div className="shrink-0 max-w-lg">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Software Activation</h3>
            <p className="mt-1.5 text-sm text-slate-500">
              Enter your license key to activate your website and unlock premium features or support.
            </p>
          </div>
          <div className="flex-1 w-full flex justify-end">
            <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-5 py-3.5 flex flex-wrap w-full xl:w-auto items-center justify-between gap-4 shadow-sm">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
                <div className="text-sm text-emerald-800 flex flex-wrap items-center gap-2">
                  <strong className="font-bold">Website Activated</strong> 
                  <span className="text-emerald-600 hidden sm:inline"> &mdash; Your license key is valid.</span>
                  
                  {(s.licenseType || s.licenseRole) && (
                    <div className="flex items-center gap-1.5 ml-2">
                      {s.licenseType && (
                        <span className="rounded-full bg-emerald-200/50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                          {s.licenseType}
                        </span>
                      )}
                      {s.licenseRole && (
                        <span className="rounded-full bg-emerald-700 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-50">
                          {s.licenseRole}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
              <button
                onClick={handleDeactivate}
                className="shrink-0 rounded-md border border-red-200 bg-white px-4 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-50"
              >
                Deactivate
              </button>
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
