import React from "react";
import type { SiteSettings } from "@/lib/site-content";
import { LogoUploader } from "@/components/admin/settings/SettingsHelpers";

interface LogoUploadersSectionProps {
  settings: SiteSettings;
  update: (k: keyof SiteSettings, v: any) => void;
}

export function LogoUploadersSection({ settings, update }: LogoUploadersSectionProps) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="mb-4 text-sm font-bold uppercase tracking-wider text-slate-700 border-b border-slate-100 pb-2">
        Logo Images & Favicon
      </h2>
      <div className="grid gap-3 grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
        <LogoUploader
          compact
          label="Site logo (Day)"
          value={settings.logoLight}
          usage="site-logo"
          recommendedSize="320×80 px"
          onChange={(v) => update("logoLight", v)}
        />
        <LogoUploader
          compact
          label="Site logo (Night)"
          value={settings.logoDark}
          usage="site-logo"
          dark
          recommendedSize="320×80 px"
          onChange={(v) => update("logoDark", v)}
        />
        <LogoUploader
          compact
          label="Footer logo (Day)"
          value={settings.footerLogoLight}
          usage="site-logo"
          recommendedSize="320×80 px"
          onChange={(v) => update("footerLogoLight", v)}
        />
        <LogoUploader
          compact
          label="Footer logo (Night)"
          value={settings.footerLogoDark}
          usage="site-logo"
          dark
          recommendedSize="320×80 px"
          onChange={(v) => update("footerLogoDark", v)}
        />
        <LogoUploader
          compact
          label="Favicon"
          value={settings.favicon}
          usage="site-favicon"
          recommendedSize="64×64 px"
          onChange={(v) => update("favicon", v)}
        />
      </div>
    </section>
  );
}
