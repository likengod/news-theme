import { ShieldAlert, Lock, Info, Save } from "lucide-react";
import { type SiteSettings } from "@/lib/site-content";

type Props = {
  s: SiteSettings;
  update: <K extends keyof SiteSettings>(k: K, v: SiteSettings[K]) => void;
};

export function ProtectionSettingsForm({ s, update }: Props) {
  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-slate-200 bg-white shadow-xs">
        <div className="flex items-center gap-2.5 border-b border-slate-100 bg-slate-50 px-5 py-3.5">
          <Lock className="h-4 w-4 text-slate-700" />
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700">
            Content Protection & Anti-Theft Safeguards
          </h2>
          <span className="ml-2 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold uppercase text-emerald-800">
            Active Security
          </span>
        </div>

        <div className="space-y-5 p-5 sm:p-6">
          {/* Main Toggle */}
          <div className="flex items-start justify-between gap-4 rounded-xl border border-slate-200/90 bg-slate-50/50 p-4">
            <div className="space-y-1">
              <label className="text-sm font-bold text-slate-800">
                Enable Anti-Theft & Content Protection
              </label>
              <p className="text-xs text-slate-500">
                When enabled, copying text, printing, right-clicking, and mobile screenshots will trigger a security notice modal requesting users to share the original link instead.
              </p>
            </div>
            <button
              type="button"
              onClick={() => update("protectionEnabled", !s.protectionEnabled)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ${
                s.protectionEnabled ? "bg-slate-900" : "bg-slate-300"
              }`}
              aria-pressed={s.protectionEnabled}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-xs transition duration-200 ${
                  s.protectionEnabled ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {/* Modal Title Input */}
          <div>
            <label className="mb-1.5 block text-xs font-bold text-slate-700">
              Protection Notice Modal Title
            </label>
            <input
              type="text"
              value={s.protectionModalTitle}
              onChange={(e) => update("protectionModalTitle", e.target.value)}
              placeholder="Content Protection - News Theme"
              className="w-full rounded-lg border border-slate-200 px-3.5 py-2 text-sm focus:border-slate-900 focus:outline-none"
            />
            <p className="mt-1 text-[11px] text-slate-400">
              Title heading shown inside the full-screen protection notice modal.
            </p>
          </div>

          {/* Modal Message Textarea */}
          <div>
            <label className="mb-1.5 block text-xs font-bold text-slate-700">
              Protection Notice Message (Appeals & Guidance)
            </label>
            <textarea
              value={s.protectionModalMessage}
              onChange={(e) => update("protectionModalMessage", e.target.value)}
              rows={6}
              placeholder="Our journalists work hard to bring you authentic news..."
              className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 font-sans text-xs leading-relaxed text-slate-800 focus:border-slate-900 focus:outline-none"
            />
            <p className="mt-1 text-[11px] text-slate-400">
              Explain why direct link sharing supports your newsroom survival. Use double line breaks for paragraph breaks.
            </p>
          </div>

          {/* Live Preview Box */}
          <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-4">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-800">
              <Info className="h-4 w-4" /> Live Protection Notice Preview
            </div>
            <div className="mt-3 rounded-lg border border-amber-200/60 bg-white p-4 text-xs text-slate-700 shadow-2xs">
              <div className="flex items-center gap-2 text-sm font-bold text-slate-900 mb-2">
                <Lock className="h-4 w-4 text-amber-600" />
                {s.protectionModalTitle || "Content Protection - News Theme"}
              </div>
              <p className="whitespace-pre-line text-slate-600 text-[11px] leading-relaxed">
                {s.protectionModalMessage || "Our journalists work hard to bring you authentic news..."}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
