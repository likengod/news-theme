import { Building2, Loader2, Save } from "lucide-react";
import type { AuthorizedSettings } from "@/lib/authorized-settings";
import { MediaField } from "@/components/admin/MediaField";
import { Field } from "./Field";

export default function AuthorizedPanel({
  value, onChange, onSave, onReset, saving,
}: {
  value: AuthorizedSettings;
  onChange: (v: AuthorizedSettings) => void;
  onSave: () => void;
  onReset: () => void;
  saving: boolean;
}) {
  const set = <K extends keyof AuthorizedSettings>(k: K, v: AuthorizedSettings[K]) =>
    onChange({ ...value, [k]: v });

  return (
    <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-xs">
      <div className="flex items-center justify-between border-b border-slate-200 px-5 py-3">
        <div>
          <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-slate-500">
            <Building2 className="h-4 w-4" /> Authorized signature & back card config
          </h2>
          <p className="mt-0.5 text-xs text-slate-500">
            Edit office contact, disclaimer notes, and upload transparent PNG/WEBP authorized signature for press cards.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onReset}
            className="rounded-md border border-slate-200 px-3 py-1.5 text-xs font-medium hover:bg-slate-50"
          >
            Reset defaults
          </button>
          <button
            onClick={onSave}
            disabled={saving}
            className="inline-flex items-center gap-1.5 rounded-md bg-slate-900 px-4 py-1.5 text-xs font-medium text-white hover:bg-slate-800 disabled:opacity-60"
          >
            {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
            Save settings
          </button>
        </div>
      </div>

      <div className="grid gap-6 p-5 lg:grid-cols-2">
        {/* Left Column: Authorized Signature Upload */}
        <div className="space-y-4 rounded-lg border border-slate-200 p-4 bg-slate-50/50">
          <div className="border-b border-slate-200 pb-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Authorized Signature Config
            </h3>
            <p className="mt-0.5 text-[11px] text-slate-500">
              Upload signature image or customize cursive text shown on the back of journalist press cards.
            </p>
          </div>

          <Field
            label="Signature Cursive Name / Text"
            value={value.signatureName}
            onChange={(v) => set("signatureName", v)}
            placeholder="Editor-in-Chief"
          />

          <Field
            label="Signature Bottom Label"
            value={value.signatureLabel}
            onChange={(v) => set("signatureLabel", v)}
            placeholder="AUTHORIZED SIGNATURE"
          />

          <div>
            <label className="mb-1 block text-xs font-medium text-slate-700">
              Upload Official Signature Image (PNG or WEBP)
            </label>
            <MediaField
              value={value.signatureImageUrl}
              onChange={(v) => set("signatureImageUrl", v)}
              usage="other"
              hint="Upload a transparent PNG or WEBP file of the signature for best quality."
              recommendedSize="Recommended size: 240×80 px (transparent PNG or WEBP)"
              compact
            />
          </div>

          {value.signatureImageUrl ? (
            <div className="rounded-md border border-dashed border-slate-300 bg-white p-3 text-center">
              <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">Signature Image Preview</p>
              <img src={value.signatureImageUrl} alt="Signature Preview" className="mx-auto h-12 max-w-[200px] object-contain" />
              <div className="mt-2 mx-auto w-32 border-b border-slate-400" />
              <p className="mt-1 text-[10px] font-black uppercase italic tracking-widest text-slate-800">
                {value.signatureLabel || "AUTHORIZED SIGNATURE"}
              </p>
            </div>
          ) : (
            <div className="rounded-md border border-dashed border-slate-200 bg-white p-3 text-center">
              <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">Default Cursive Text Preview</p>
              <p className="text-slate-700" style={{ fontFamily: "'Dancing Script', 'Brush Script MT', cursive", fontSize: 22 }}>
                {value.signatureName || "Editor-in-Chief"}
              </p>
              <div className="mt-1 mx-auto w-32 border-b border-slate-400" />
              <p className="mt-1 text-[10px] font-black uppercase italic tracking-widest text-slate-800">
                {value.signatureLabel || "AUTHORIZED SIGNATURE"}
              </p>
            </div>
          )}
        </div>

        {/* Right Column: Office Contact & Back Card Notes */}
        <div className="space-y-4 rounded-lg border border-slate-200 p-4 bg-slate-50/50">
          <div className="border-b border-slate-200 pb-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Office Details & Back Card Text
            </h3>
            <p className="mt-0.5 text-[11px] text-slate-500">
              Custom contact details, note, and legal disclaimer printed on the back card.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field
              label="Office Phone"
              value={value.officePhone}
              onChange={(v) => set("officePhone", v)}
              placeholder="9089050144"
            />
            <Field
              label="Office Email"
              type="email"
              value={value.officeEmail}
              onChange={(v) => set("officeEmail", v)}
              placeholder="contact@northeasttimeline.com"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field
              label="Office Website"
              value={value.officeWebsite}
              onChange={(v) => set("officeWebsite", v)}
              placeholder="northeasttimeline.com"
            />
            <Field
              label="Office PIN / ZIP Code"
              value={value.officePin}
              onChange={(v) => set("officePin", v)}
              placeholder="799277"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field
              label="Office State"
              value={value.officeState}
              onChange={(v) => set("officeState", v)}
              placeholder="Tripura"
            />
            <Field
              label="Office Country"
              value={value.officeCountry}
              onChange={(v) => set("officeCountry", v)}
              placeholder="India"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-slate-700">Office Address</label>
            <textarea
              value={value.officeAddress}
              onChange={(e) => set("officeAddress", e.target.value)}
              rows={2}
              placeholder="College Road, Kailasahar"
              className="w-full resize-none rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:border-slate-900 focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-slate-700">Back Card Note</label>
            <textarea
              value={value.cardNote}
              onChange={(e) => set("cardNote", e.target.value)}
              rows={2}
              placeholder="This card certifies that the bearer is an authorized journalist..."
              className="w-full resize-none rounded-md border border-slate-200 px-3 py-2 text-xs focus:border-slate-900 focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-slate-700">Back Card Legal Disclaimer</label>
            <textarea
              value={value.cardDisclaimer}
              onChange={(e) => set("cardDisclaimer", e.target.value)}
              rows={2}
              placeholder="Tampering or misuse of this card is a punishable offense."
              className="w-full resize-none rounded-md border border-slate-200 px-3 py-2 text-xs focus:border-slate-900 focus:outline-none"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
