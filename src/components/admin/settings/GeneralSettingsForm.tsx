import { useState, useEffect } from "react";
import { Save } from "lucide-react";
import { toast } from "sonner";
import { loadSettings, saveSettings, type SiteSettings } from "@/lib/site-content";
import { LogoUploader } from "@/components/admin/settings/SettingsHelpers";

type FieldDef = {
  key: keyof SiteSettings;
  label: string;
  hint?: string;
  textarea?: boolean;
  select?: boolean;
  options?: { value: string; label: string }[];
  placeholder?: string;
};

const GROUPS: { title: string; fields: FieldDef[] }[] = [
  {
    title: "Brand Information",
    fields: [
      { key: "siteName", label: "Site Name", placeholder: "News Timeline" },
      { key: "logoText", label: "Logo Text", placeholder: "News Timeline" },
      {
        key: "logoDisplayMode",
        label: "Brand Display Mode",
        select: true,
        options: [
          { value: "logo_only", label: "Logo Only" },
          { value: "text_only", label: "Text Only" },
          { value: "both", label: "Both (Logo + Text)" },
        ],
      },
      { key: "tagline", label: "Tagline", placeholder: "Breaking News · Finance · Markets" },
      { key: "metaDescription", label: "SEO Meta Description", textarea: true, placeholder: "Independent newsroom..." },
    ],
  },
  {
    title: "Contact Details",
    fields: [
      { key: "contactEmail", label: "Contact Email", placeholder: "hello@newstimeline.com" },
      { key: "contactPhone", label: "Contact Phone", placeholder: "+91 99999 99999" },
      { key: "address", label: "Office Address", textarea: true, placeholder: "Agartala, Tripura..." },
    ],
  },

  {
    title: "Footer & Copyright",
    fields: [
      { key: "footerNote", label: "Footer Intro Text", textarea: true },
      { key: "copyright", label: "Copyright Statement" },
    ],
  },
];

export function GeneralSettingsForm() {
  const [settings, setSettings] = useState<SiteSettings>(() => loadSettings());
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setSettings(loadSettings());
  }, []);

  const update = <K extends keyof SiteSettings>(key: K, val: SiteSettings[K]) => {
    setSettings((prev) => ({ ...prev, [key]: val }));
  };

  const handleSave = async () => {
    try {
      await saveSettings(settings);
      setSaved(true);
      toast.success("General site settings saved to MySQL!");
      setTimeout(() => setSaved(false), 2000);
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to save settings. Payload might be too large if logos are big.");
    }
  };

  return (
    <div className="space-y-6">
      {GROUPS.map((grp) => (
        <section key={grp.title} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-sm font-bold uppercase tracking-wider text-slate-700 border-b border-slate-100 pb-2">
            {grp.title}
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {grp.fields.map((f) => {
              const val = (settings[f.key] as string) || "";
              return (
                <div key={f.key} className={f.textarea ? "sm:col-span-2" : ""}>
                  <label className="mb-1 block text-xs font-semibold text-slate-600">
                    {f.label}
                  </label>
                  {f.textarea ? (
                    <textarea
                      value={val}
                      onChange={(e) => update(f.key, e.target.value as any)}
                      placeholder={f.placeholder}
                      rows={3}
                      className="w-full rounded-lg border border-slate-200 p-2.5 text-sm focus:border-slate-900 focus:outline-none"
                    />
                  ) : f.select ? (
                    <select
                      value={val}
                      onChange={(e) => update(f.key, e.target.value as any)}
                      className="h-10 w-full rounded-lg border border-slate-200 px-3 bg-white text-sm focus:border-slate-900 focus:outline-none"
                    >
                      {f.options?.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      value={val}
                      onChange={(e) => update(f.key, e.target.value as any)}
                      placeholder={f.placeholder}
                      className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm focus:border-slate-900 focus:outline-none"
                    />
                  )}
                  {f.hint && <p className="mt-1 text-[11px] text-slate-400">{f.hint}</p>}
                </div>
              );
            })}
          </div>

          {grp.title === "Brand Information" && (
            <div className="mt-6 border-t border-slate-100 pt-6">
              <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                Logo Images & Favicon
              </h3>
              <div className="grid gap-3 grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
                <LogoUploader compact label="Site logo (Day)" value={settings.logoLight} usage="site-logo" recommendedSize="320×80 px" onChange={(v) => update("logoLight", v)} />
                <LogoUploader compact label="Site logo (Night)" value={settings.logoDark} usage="site-logo" dark recommendedSize="320×80 px" onChange={(v) => update("logoDark", v)} />
                <LogoUploader compact label="Footer logo (Day)" value={settings.footerLogoLight} usage="site-logo" recommendedSize="320×80 px" onChange={(v) => update("footerLogoLight", v)} />
                <LogoUploader compact label="Footer logo (Night)" value={settings.footerLogoDark} usage="site-logo" dark recommendedSize="320×80 px" onChange={(v) => update("footerLogoDark", v)} />
                <LogoUploader compact label="Favicon" value={settings.favicon} usage="site-favicon" recommendedSize="64×64 px" onChange={(v) => update("favicon", v)} />
              </div>
            </div>
          )}
        </section>
      ))}

      {/* Save Button */}
      <div className="sticky bottom-4 flex justify-end">
        <button
          onClick={handleSave}
          className={`inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-semibold text-white shadow-lg transition-colors ${
            saved ? "bg-emerald-600" : "bg-slate-900 hover:bg-slate-800"
          }`}
        >
          <Save className="h-4 w-4" />
          {saved ? "Saved to MySQL!" : "Save General Settings"}
        </button>
      </div>
    </div>
  );
}
