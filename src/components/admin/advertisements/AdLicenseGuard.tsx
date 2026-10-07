import React from "react";
import { Lock } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import type { Tab, AdSlotDef } from "./types";

interface AdLicenseGuardProps {
  tab: Tab;
  activeSlot?: AdSlotDef;
  isEnterprise: boolean;
  isEnterprisePlus: boolean;
}

export function AdLicenseGuard({
  tab,
  activeSlot,
  isEnterprise,
  isEnterprisePlus,
}: AdLicenseGuardProps) {
  const navigate = useNavigate();

  if ((tab === "hero_showcase" || tab === "reel_ads") && !isEnterprisePlus) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
          <Lock className="h-8 w-8 text-slate-400" />
        </div>
        <h3 className="mt-4 text-base font-semibold text-slate-800">Premium Feature Locked</h3>
        <p className="mt-1 max-w-sm text-sm text-slate-500">
          The {activeSlot?.label} advertisement slot is exclusively
          available on Enterprise Plus licenses. Please upgrade your license to unlock this slot.
        </p>
        <button
          onClick={() => navigate({ to: "/admin/settings", search: { tab: "activate" } })}
          className="mt-6 inline-flex items-center gap-2 rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
        >
          Activate Website
        </button>
      </div>
    );
  }

  if (tab === "post_ads" && !isEnterprise && !isEnterprisePlus) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-50">
          <Lock className="h-8 w-8 text-amber-600" />
        </div>
        <h3 className="mt-4 text-base font-semibold text-slate-800">Enterprise Feature Locked</h3>
        <p className="mt-1 max-w-sm text-sm text-slate-500">
          The Post Ads advertisement slot is exclusively available for Enterprise and Enterprise Plus licenses. Please upgrade your license to unlock this slot.
        </p>
        <button
          onClick={() => navigate({ to: "/admin/settings", search: { tab: "activate" } })}
          className="mt-6 inline-flex items-center gap-2 rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
        >
          Activate Website
        </button>
      </div>
    );
  }

  return null;
}
