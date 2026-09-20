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
          <div className="flex items-start justify-between gap-4 rounded-xl border border-slate-200/90 bg-slate-50/50 p-4">
            <div className="space-y-1">
              <label className="text-sm font-bold text-slate-800 flex items-center gap-2">
                Force HTTPS / SSL Strict Mode
                <ShieldAlert className="h-4 w-4 text-emerald-600" />
              </label>
              <p className="text-xs text-slate-500">
                When enabled, the server will automatically redirect all standard HTTP traffic to
                secure HTTPS. (Requires a valid SSL certificate like Let's Encrypt on your server).
              </p>
            </div>
            <button
              type="button"
              onClick={() => update("forceHttps", !s.forceHttps)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ${
                s.forceHttps ? "bg-emerald-600" : "bg-slate-300"
              }`}
              aria-pressed={s.forceHttps}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-xs transition duration-200 ${
                  s.forceHttps ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {/* Main Toggle */}
          <div className="flex items-start justify-between gap-4 rounded-xl border border-slate-200/90 bg-slate-50/50 p-4">
            <div className="space-y-1">
              <label className="text-sm font-bold text-slate-800">
                Enable Anti-Theft & Content Protection
              </label>
              <p className="text-xs text-slate-500">
                When enabled, copying text, printing, right-clicking, and mobile screenshots will
                trigger a security notice modal requesting users to share the original link instead.
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
              Explain why direct link sharing supports your newsroom survival. Use double line
              breaks for paragraph breaks.
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
                {s.protectionModalMessage ||
                  "Our journalists work hard to bring you authentic news..."}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Dual-Layer Image Protection Engine */}
      <section className="rounded-xl border border-slate-200 bg-white shadow-xs overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-5 py-3.5">
          <div className="flex items-center gap-2.5">
            <ShieldAlert className="h-4 w-4 text-indigo-600" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700">
              Dual-Layer Image Protection & Forensic Watermarking
            </h2>
          </div>
          <span className="rounded-full bg-indigo-100 px-2.5 py-0.5 text-[10px] font-bold uppercase text-indigo-800">
            Active Protection
          </span>
        </div>

        <div className="p-5 sm:p-6 space-y-6">
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Every image uploaded to your media library and article editor is automatically fortified with a
            two-tier anti-theft defense system. Even if pirates screenshot your content or strip file metadata,
            ownership can be mathematically proven.
          </p>

          <div className="grid gap-4 md:grid-cols-2">
            {/* Layer 1 Card */}
            <div className="rounded-xl border border-blue-200/80 bg-blue-50/40 p-4 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 rounded-md bg-blue-100 px-2 py-0.5 text-[11px] font-bold text-blue-800">
                  Layer 1
                </span>
                <span className="text-[11px] font-semibold text-blue-600">The Surface Protection</span>
              </div>
              <h3 className="text-sm font-bold text-slate-900">Cryptographic EXIF Signature</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Embeds hidden, encrypted text data directly into the image file&apos;s metadata (EXIF/XMP tags)
                behind the scenes.
              </p>
              <ul className="text-[11px] text-slate-500 space-y-1 list-disc list-inside">
                <li><strong className="text-slate-700">Ownership Details:</strong> Encrypts domain ownership and copyright.</li>
                <li><strong className="text-slate-700">Social Media Linking:</strong> Embeds official social usernames from admin.</li>
                <li><strong className="text-slate-700">Digital Certificate:</strong> Instantly verified by the <code className="text-blue-700">/verify-image</code> scanner.</li>
              </ul>
            </div>

            {/* Layer 2 Card */}
            <div className="rounded-xl border border-purple-200/80 bg-purple-50/40 p-4 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 rounded-md bg-purple-100 px-2 py-0.5 text-[11px] font-bold text-purple-800">
                  Layer 2
                </span>
                <span className="text-[11px] font-semibold text-purple-600">The Deep Protection</span>
              </div>
              <h3 className="text-sm font-bold text-slate-900">Forensic Pixel Watermarking (Steganography)</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Invisibly weaves watermark DNA directly into the actual color pixels of the image using
                differential spatial-frequency steganography.
              </p>
              <ul className="text-[11px] text-slate-500 space-y-1 list-disc list-inside">
                <li><strong className="text-slate-700">Screenshot Proof:</strong> Survives phone/PC screen captures and clips.</li>
                <li><strong className="text-slate-700">Tamper Resistant:</strong> Resists cropping, resizing, and JPEG compression.</li>
                <li><strong className="text-slate-700">Automatic Fallback:</strong> Proves authentic derivative even if metadata is stripped.</li>
              </ul>
            </div>
          </div>

          {/* Scanner Tool Action Box */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div>
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                Forensic Verification Scanner Tool
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Inspect any suspicious image or screenshot to extract Layer 1 signatures and Layer 2 pixel DNA.
              </p>
            </div>
            <a
              href="/verify-image"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-700 transition shadow-xs shrink-0"
            >
              <ShieldAlert className="h-4 w-4" />
              Open /verify-image Scanner
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
