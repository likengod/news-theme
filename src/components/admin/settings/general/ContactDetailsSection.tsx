import React from "react";
import { Mail } from "lucide-react";
import type { SiteSettings } from "@/lib/site-content";

interface ContactDetailsSectionProps {
  settings: SiteSettings;
  update: (k: keyof SiteSettings, v: any) => void;
}

export function ContactDetailsSection({ settings, update }: ContactDetailsSectionProps) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="mb-4 text-sm font-bold uppercase tracking-wider text-slate-700 border-b border-slate-100 pb-2">
        Contact Details
      </h2>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="contactEmail" className="mb-1 block text-xs font-semibold text-slate-600">Contact Email</label>
          <input
            id="contactEmail"
            name="contactEmail"
            type="email"
            value={settings.contactEmail || ""}
            onChange={(e) => update("contactEmail", e.target.value)}
            placeholder="hello@newstimeline.com"
            className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm focus:border-slate-900 focus:outline-none"
          />
        </div>

        <div>
          <label htmlFor="contactPhone" className="mb-1 block text-xs font-semibold text-slate-600">Contact Phone</label>
          <input
            id="contactPhone"
            name="contactPhone"
            type="text"
            value={settings.contactPhone || ""}
            onChange={(e) => update("contactPhone", e.target.value)}
            placeholder="+91 99999 99999"
            className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm focus:border-slate-900 focus:outline-none"
          />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="officeAddress" className="mb-1 block text-xs font-semibold text-slate-600">Office Address</label>
          <textarea
            id="officeAddress"
            name="officeAddress"
            value={settings.address || ""}
            onChange={(e) => update("address", e.target.value)}
            placeholder="Agartala, Tripura..."
            rows={3}
            className="w-full rounded-lg border border-slate-200 p-2.5 text-sm focus:border-slate-900 focus:outline-none"
          />
        </div>

        <div className="sm:col-span-2 pt-4 border-t border-slate-200/80">
          <div className="mb-3 flex items-center gap-2">
            <Mail className="h-4 w-4 text-slate-600" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Desk & Department Emails (Contact Page)
            </h3>
          </div>
          <p className="mb-4 text-xs text-slate-500">
            These email addresses appear under the <strong>DESKS</strong> section on the public <code>/contact</code> page.
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label htmlFor="emailNewsTips" className="mb-1 block text-xs font-semibold text-slate-600">
                News Tips Email
              </label>
              <input
                id="emailNewsTips"
                name="emailNewsTips"
                type="email"
                value={settings.emailNewsTips || ""}
                onChange={(e) => update("emailNewsTips", e.target.value)}
                placeholder="tips@northeasttimeline.com"
                className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm focus:border-slate-900 focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="emailAdvertising" className="mb-1 block text-xs font-semibold text-slate-600">
                Advertising Email
              </label>
              <input
                id="emailAdvertising"
                name="emailAdvertising"
                type="email"
                value={settings.emailAdvertising || ""}
                onChange={(e) => update("emailAdvertising", e.target.value)}
                placeholder="ads@northeasttimeline.com"
                className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm focus:border-slate-900 focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="emailCareers" className="mb-1 block text-xs font-semibold text-slate-600">
                Careers Email
              </label>
              <input
                id="emailCareers"
                name="emailCareers"
                type="email"
                value={settings.emailCareers || ""}
                onChange={(e) => update("emailCareers", e.target.value)}
                placeholder="careers@northeasttimeline.com"
                className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm focus:border-slate-900 focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="emailCorrections" className="mb-1 block text-xs font-semibold text-slate-600">
                Corrections Email
              </label>
              <input
                id="emailCorrections"
                name="emailCorrections"
                type="email"
                value={settings.emailCorrections || ""}
                onChange={(e) => update("emailCorrections", e.target.value)}
                placeholder="corrections@northeasttimeline.com"
                className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm focus:border-slate-900 focus:outline-none"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
