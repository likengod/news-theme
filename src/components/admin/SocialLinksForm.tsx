import { useState, useEffect } from "react";
import { Save, Link as LinkIcon } from "lucide-react";
import { FaFacebookF, FaInstagram, FaYoutube, FaWhatsapp } from "react-icons/fa6";
import { toast } from "sonner";
import { loadSocialLinks, saveSocialLinks, SOCIAL_PLATFORMS, type SocialLinks } from "@/lib/social-links";

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  facebook: FaFacebookF,
  youtube: FaYoutube,
  instagram: FaInstagram,
  whatsapp: FaWhatsapp,
};

export function SocialLinksForm() {
  const [links, setLinks] = useState<SocialLinks>(loadSocialLinks());
  const [saved, setSaved] = useState(false);

  useEffect(() => { setLinks(loadSocialLinks()); }, []);

  const handleSave = () => {
    saveSocialLinks(links);
    setSaved(true);
    toast.success("Social links saved! Earn-points page will use these URLs.");
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center gap-2 border-b border-slate-100 bg-slate-50 px-5 py-3">
        <LinkIcon className="h-4 w-4 text-slate-500" />
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-600">Social Media Links</h2>
        <span className="ml-2 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-700">Used on Earn Points page</span>
      </div>
      <div className="grid gap-4 p-5 sm:grid-cols-2">
        {SOCIAL_PLATFORMS.map((p) => {
          const Icon = ICONS[p.key];
          return (
            <div key={p.key}>
              <label className="mb-1.5 flex items-center gap-2 text-xs font-semibold text-slate-600">
                {Icon && <Icon className="h-3.5 w-3.5" style={{ color: p.color }} />}
                {p.label}
              </label>
              <input
                type="url"
                value={links[p.key]}
                onChange={(e) => setLinks({ ...links, [p.key]: e.target.value })}
                placeholder={p.placeholder}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-slate-700 focus:outline-none"
              />
              <p className="mt-1 text-[11px] text-slate-400">{p.helperText}</p>
            </div>
          );
        })}
      </div>
      <div className="border-t border-slate-100 bg-slate-50 px-5 py-3">
        <div className="flex items-center justify-between">
          <p className="text-xs text-slate-500">After saving, the earn-points page will use your real links.</p>
          <button
            onClick={handleSave}
            className={`inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold text-white transition-colors ${
              saved ? "bg-emerald-600" : "bg-slate-900 hover:bg-slate-800"
            }`}
          >
            <Save className="h-4 w-4" />
            {saved ? "Saved!" : "Save Social Links"}
          </button>
        </div>
      </div>
    </section>
  );
}
