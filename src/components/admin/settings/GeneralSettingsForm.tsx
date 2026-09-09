import { useState, useEffect, useRef } from "react";
import { Save, Download, Upload } from "lucide-react";
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
  
  const update = (k: keyof SiteSettings, v: any) => setSettings((s) => ({ ...s, [k]: v }));
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
            <>
              <div className="mt-6 border-t border-slate-100 pt-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Logo Text & Two-Tone Colors
                  </h3>
                  <span className="text-[11px] text-slate-400">Customize each word and its color independently</span>
                </div>

                {/* Live Preview */}
                <div className="mb-4 rounded-xl border border-slate-200 bg-slate-50/90 p-5 text-center shadow-inner">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 block mb-2">Live Header Preview</span>
                  <div
                    className="text-3xl sm:text-4xl md:text-5xl font-extrabold uppercase tracking-wide inline-block"
                    style={{ fontFamily: '"Inter", system-ui, sans-serif', letterSpacing: "0.05em" }}
                  >
                    <span style={{ color: settings.logoColorPrimary || "#000000" }}>
                      {settings.logoTextPrimary !== undefined && settings.logoTextPrimary !== "" ? settings.logoTextPrimary : "NEWS"}
                    </span>
                    {" "}
                    <span style={{ color: settings.logoColorSecondary || "#dc2626" }}>
                      {settings.logoTextSecondary !== undefined && settings.logoTextSecondary !== "" ? settings.logoTextSecondary : "THEME"}
                    </span>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  {/* Part 1 */}
                  <div className="rounded-lg border border-slate-200 bg-white p-3.5 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-slate-700">Part 1 Text (e.g. News)</label>
                      <span className="text-[10px] text-slate-400">First Word</span>
                    </div>
                    <input
                      type="text"
                      value={settings.logoTextPrimary ?? "News"}
                      onChange={(e) => {
                        const text = e.target.value;
                        const nextSec = settings.logoTextSecondary ?? "Theme";
                        update("logoTextPrimary", text);
                        update("logoText", `${text} ${nextSec}`.trim());
                      }}
                      placeholder="News"
                      className="h-9 w-full rounded-md border border-slate-200 px-3 text-sm focus:border-slate-900 focus:outline-none"
                    />
                    <div>
                      <label className="text-[11px] font-semibold text-slate-500 block mb-1">Part 1 Text Color</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={settings.logoColorPrimary && settings.logoColorPrimary.startsWith("#") ? settings.logoColorPrimary : "#000000"}
                          onChange={(e) => update("logoColorPrimary", e.target.value)}
                          className="h-8 w-10 cursor-pointer rounded border border-slate-200 p-0.5"
                        />
                        <input
                          type="text"
                          value={settings.logoColorPrimary || "#000000"}
                          onChange={(e) => update("logoColorPrimary", e.target.value)}
                          placeholder="#000000"
                          className="h-8 flex-1 rounded-md border border-slate-200 px-2.5 text-xs font-mono focus:border-slate-900 focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => update("logoColorPrimary", "#000000")}
                          className="px-2 py-1 text-[10px] rounded bg-slate-100 hover:bg-slate-200 text-slate-700"
                          title="Set Black"
                        >
                          Black
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Part 2 */}
                  <div className="rounded-lg border border-slate-200 bg-white p-3.5 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-slate-700">Part 2 Text (e.g. Theme)</label>
                      <span className="text-[10px] text-slate-400">Second Word</span>
                    </div>
                    <input
                      type="text"
                      value={settings.logoTextSecondary ?? "Theme"}
                      onChange={(e) => {
                        const text = e.target.value;
                        const nextPri = settings.logoTextPrimary ?? "News";
                        update("logoTextSecondary", text);
                        update("logoText", `${nextPri} ${text}`.trim());
                      }}
                      placeholder="Theme"
                      className="h-9 w-full rounded-md border border-slate-200 px-3 text-sm focus:border-slate-900 focus:outline-none"
                    />
                    <div>
                      <label className="text-[11px] font-semibold text-slate-500 block mb-1">Part 2 Text Color</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={settings.logoColorSecondary && settings.logoColorSecondary.startsWith("#") ? settings.logoColorSecondary : "#dc2626"}
                          onChange={(e) => update("logoColorSecondary", e.target.value)}
                          className="h-8 w-10 cursor-pointer rounded border border-slate-200 p-0.5"
                        />
                        <input
                          type="text"
                          value={settings.logoColorSecondary || "#dc2626"}
                          onChange={(e) => update("logoColorSecondary", e.target.value)}
                          placeholder="#dc2626"
                          className="h-8 flex-1 rounded-md border border-slate-200 px-2.5 text-xs font-mono focus:border-slate-900 focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => update("logoColorSecondary", "#dc2626")}
                          className="px-2 py-1 text-[10px] rounded bg-red-50 hover:bg-red-100 text-red-600 font-semibold"
                          title="Set Red"
                        >
                          Red
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

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
            </>
          )}
        </section>
      ))}

            

      {/* Save Button */}      <div className="sticky bottom-4 flex justify-end">
        <button
          onClick={handleSave}
          className={`inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-semibold text-white shadow-lg transition-colors ${saved ? "bg-emerald-600" : "bg-slate-900 hover:bg-slate-800"}`}
        >
          <Save className="h-4 w-4" />
          {saved ? "Saved to MySQL!" : "Save General Settings"}
        </button>
      </div>
    </div>
  );
}

