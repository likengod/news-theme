import { useState, useEffect } from "react";
import { Save } from "lucide-react";
import { toast } from "sonner";
import { loadSettings, saveSettings, cleanCopyright, type SiteSettings } from "@/lib/site-content";
import { useSiteSettings } from "@/components/site/AdSettingsContext";
import { BrandInfoSection } from "./general/BrandInfoSection";
import { LogoUploadersSection } from "./general/LogoUploadersSection";
import { ContactDetailsSection } from "./general/ContactDetailsSection";
import { FooterCopyrightSection } from "./general/FooterCopyrightSection";

interface GeneralSettingsFormProps {
  s?: SiteSettings;
  update?: <K extends keyof SiteSettings>(k: K, v: SiteSettings[K]) => void;
  onSave?: () => Promise<void>;
}

export function GeneralSettingsForm({
  s: propSettings,
  update: propUpdate,
  onSave: propOnSave,
}: GeneralSettingsFormProps = {}) {
  const contextSettings = useSiteSettings();
  const [internalSettings, setInternalSettings] = useState<SiteSettings>(() => {
    const loaded = loadSettings();
    const merged = { ...contextSettings, ...loaded };
    if (merged.copyright) {
      merged.copyright = cleanCopyright(merged.copyright);
    }
    return merged;
  });
  const [saved, setSaved] = useState(false);

  const activeSettings = propSettings ?? internalSettings;

  const handleUpdate = (k: keyof SiteSettings, v: any) => {
    const val = k === "copyright" && typeof v === "string" ? cleanCopyright(v) : v;
    if (propUpdate) {
      propUpdate(k, val);
    } else {
      setInternalSettings((prev) => ({ ...prev, [k]: val }));
    }
  };

  const handleSave = async () => {
    try {
      if (propOnSave) {
        await propOnSave();
      } else {
        const cleaned = {
          ...activeSettings,
          copyright: cleanCopyright(activeSettings.copyright),
        };
        await saveSettings(cleaned);
      }
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
      <BrandInfoSection settings={activeSettings} update={handleUpdate} />
      <LogoUploadersSection settings={activeSettings} update={handleUpdate} />
      <ContactDetailsSection settings={activeSettings} update={handleUpdate} />
      <FooterCopyrightSection settings={activeSettings} update={handleUpdate} />

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
