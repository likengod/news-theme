import { useState } from "react";
import { Link as LinkIcon, Save } from "lucide-react";
import { FaFacebookF, FaYoutube, FaInstagram, FaWhatsapp } from "react-icons/fa6";
import { toast } from "sonner";
import { loadSocialLinks, saveSocialLinks, type SocialLinks } from "@/lib/social-links";

const PLATFORMS = [
  { key: "facebook" as const, label: "Facebook Page URL", icon: FaFacebookF, color: "#1877F2", placeholder: "https://facebook.com/..." },
  { key: "youtube" as const, label: "YouTube Channel URL", icon: FaYoutube, color: "#FF0000", placeholder: "https://youtube.com/@..." },
  { key: "instagram" as const, label: "Instagram Profile URL", icon: FaInstagram, color: "#E4405F", placeholder: "https://instagram.com/..." },
  { key: "whatsapp" as const, label: "WhatsApp Channel URL", icon: FaWhatsapp, color: "#25D366", placeholder: "https://whatsapp.com/channel/..." },
];

export function SocialLinksEditor() {
  const [links, setLinks] = useState<SocialLinks>(() => loadSocialLinks());
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    saveSocialLinks(links);
    setSaved(true);
    toast.success("Social links saved! Earn-points page will use these URLs.");
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <LinkIcon className="h-5 w-5 text-blue-600" />
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800">
            Social Media Channel Links
          </h2>
        </div>
        <button
          onClick={handleSave}
          className={`inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-semibold text-white transition-colors ${
            saved ? "bg-emerald-600" : "bg-slate-900 hover:bg-slate-800"
          }`}
        >
          <Save className="h-4 w-4" />
          {saved ? "Saved!" : "Save Social Links"}
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {PLATFORMS.map((p) => {
          const Icon = p.icon;
          return (
            <div key={p.key}>
              <label className="mb-1 flex items-center gap-2 text-xs font-semibold text-slate-600">
                <Icon className="h-3.5 w-3.5" style={{ color: p.color }} />
                {p.label}
              </label>
              <input
                type="url"
                value={links[p.key]}
                onChange={(e) => setLinks({ ...links, [p.key]: e.target.value })}
                placeholder={p.placeholder}
                className="h-9 w-full rounded-md border border-slate-200 px-3 text-sm focus:border-slate-900 focus:outline-none"
              />
            </div>
          );
        })}
      </div>
    </section>
  );
}
