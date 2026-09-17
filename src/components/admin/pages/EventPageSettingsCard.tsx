import React from "react";
import type { SiteSettings } from "@/lib/site-content";
import { Card, Field } from "@/components/admin/settings/SettingsHelpers";
import { eventFields } from "./pageFields";

interface EventPageSettingsCardProps {
  settings: SiteSettings;
  updateSetting: <K extends keyof SiteSettings>(k: K, v: SiteSettings[K]) => void;
}

export function EventPageSettingsCard({
  settings,
  updateSetting,
}: EventPageSettingsCardProps) {
  return (
    <Card
      title="Event Page Setup (শারদ সম্মান)"
      subtitle="Configure the event details, custom registration form, button names, and Durga Puja theme options."
    >
      {eventFields.map((f) => (
        <Field key={f.key} f={f} s={settings} update={updateSetting} />
      ))}

      <div className="pt-4 border-t border-slate-100 space-y-4">
        {/* Event Footer Quick Link Show / Hide ON / OFF */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl border border-slate-200 bg-slate-50/80">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-slate-800">
                Event Footer Quick Link (ফুটার কুইক লিঙ্ক)
              </span>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                  settings.eventFooterLinkEnabled !== false
                    ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                    : "bg-red-100 text-red-800 border border-red-200"
                }`}
              >
                {settings.eventFooterLinkEnabled !== false ? "ON" : "OFF"}
              </span>
            </div>
            <span className="text-xs text-slate-500 block mt-0.5">
              Show or hide the Event page link in the website footer quick links.
            </span>
          </div>
          <div className="inline-flex rounded-lg border border-slate-200 bg-white p-0.5 shadow-xs shrink-0">
            <button
              type="button"
              onClick={() => updateSetting("eventFooterLinkEnabled", true)}
              className={`px-4 py-1.5 text-xs font-bold rounded-md transition ${
                settings.eventFooterLinkEnabled !== false
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              ON
            </button>
            <button
              type="button"
              onClick={() => updateSetting("eventFooterLinkEnabled", false)}
              className={`px-4 py-1.5 text-xs font-bold rounded-md transition ${
                settings.eventFooterLinkEnabled === false
                  ? "bg-red-600 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              OFF
            </button>
          </div>
        </div>

        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={settings.eventButtonEnabled !== false}
            onChange={(e) => updateSetting("eventButtonEnabled", e.target.checked)}
            className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900"
          />
          <div>
            <span className="text-xs font-bold text-slate-700 block">Show Join / Register Button</span>
            <span className="text-[11px] text-slate-500 block">
              When checked, the Join/Register button is visible on the event page
            </span>
          </div>
        </label>

        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={settings.eventFormEnabled !== false}
            onChange={(e) => updateSetting("eventFormEnabled", e.target.checked)}
            className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900"
          />
          <div>
            <span className="text-xs font-bold text-slate-700 block">Enable Registration Form</span>
            <span className="text-[11px] text-slate-500 block">
              When unchecked, the form is closed and users will see that registration is closed
            </span>
          </div>
        </label>
      </div>
    </Card>
  );
}
