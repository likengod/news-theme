import { useState, useEffect } from "react";
import { Save } from "lucide-react";
import { toast } from "sonner";
import { loadSettings, saveSettings, cleanCopyright, type SiteSettings } from "@/lib/site-content";
import { useSiteSettings } from "@/components/site/AdSettingsContext";
import { BrandInfoSection } from "./general/BrandInfoSection";
import { LogoUploadersSection } from "./general/LogoUploadersSection";
import { ContactDetailsSection } from "./general/ContactDetailsSection";
import { FooterCopyrightSection } from "./general/FooterCopyrightSection";

export function GeneralSettingsForm() {
  const contextSettings = useSiteSettings();
  const [settings, setSettings] = useState<SiteSettings>(() => {
    const s = loadSettings();
    const merged = { ...contextSettings, ...s };
    if (merged.copyright) {
      merged.copyright = cleanCopyright(merged.copyright);
    }
    return merged;
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (contextSettings && Object.keys(contextSettings).length > 0) {
      setSettings((prev) => ({
        ...prev,
        ...contextSettings,
        copyright: cleanCopyright(contextSettings.copyright || prev.copyright),
      }));
    }
  }, [contextSettings]);

  const update = (k: keyof SiteSettings, v: any) =>
    setSettings((s) => ({
      ...s,
      [k]: k === "copyright" && typeof v === "string" ? cleanCopyright(v) : v,
    }));

  const handleSave = async () => {
    try {
      const cleaned = {
        ...settings,
        copyright: cleanCopyright(settings.copyright),
      };
      await saveSettings(cleaned);
      setSettings(cleaned);
      setSaved(true);
      toast.success("Saved successfully");
      setTimeout(() => setSaved(false), 2000);
    } catch (err: any) {
      console.error(err);
      toast.error(
        err.message || "Failed to save settings. Payload might be too large if logos are big.",
      );
    }
  };

  return (
    <div className="space-y-6">
      <BrandInfoSection settings={settings} update={update} />
      <LogoUploadersSection settings={settings} update={update} />
      <ContactDetailsSection settings={settings} update={update} />
      <FooterCopyrightSection settings={settings} update={update} />

      {/* Save Button */}
      <div className="sticky bottom-4 flex justify-end">
        <button
          onClick={handleSave}
          className={`inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-semibold text-white shadow-lg transition-colors ${
            saved ? "bg-emerald-600" : "bg-slate-900 hover:bg-slate-800"
          }`}
        >
          <Save className="h-4 w-4" />
          {saved ? "Saved!" : "Save"}
        </button>
      </div>
    </div>
  );
}

export default GeneralSettingsForm;
