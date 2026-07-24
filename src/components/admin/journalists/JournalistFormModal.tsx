import { X, Save, Loader2 } from "lucide-react";
import { MediaField } from "@/components/admin/MediaField";
import { Field } from "./Field";

export type EditForm = {
  userId?: string;
  email: string;
  password: string;
  displayName: string;
  phone: string;
  bloodGroup: string;
  dob: string;
  validTill: string;
  address: string;
  state: string;
  country: string;
  pinCode: string;
  avatarUrl: string;
  articlesPublished: number;
  points: number;
  active: boolean;
};

export function emptyForm(): EditForm {
  return {
    email: "", password: "", displayName: "", phone: "", bloodGroup: "",
    dob: "", validTill: "", address: "", state: "", country: "", pinCode: "", avatarUrl: "",
    articlesPublished: 0, points: 0, active: true,
  };
}

export function JournalistFormModal({
  form,
  setForm,
  saving,
  submitForm,
}: {
  form: EditForm;
  setForm: (f: EditForm | null) => void;
  saving: boolean;
  submitForm: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-black/40 p-4">
      <div className="w-full max-w-2xl rounded-lg bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">{form.userId ? "Edit journalist" : "New journalist"}</h2>
          <button onClick={() => setForm(null)} className="grid h-7 w-7 place-items-center rounded-md hover:bg-slate-100" aria-label="Close"><X className="h-4 w-4" /></button>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Full name*" value={form.displayName} onChange={(v) => setForm({ ...form, displayName: v })} />
          <Field label="Email*" type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} />
          <Field label={form.userId ? "New password (leave blank to keep)" : "Password*"} type="password" value={form.password} onChange={(v) => setForm({ ...form, password: v })} />
          <Field label="Phone" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} />
          <Field label="Blood group" value={form.bloodGroup} onChange={(v) => setForm({ ...form, bloodGroup: v })} placeholder="O+" />
          <Field label="Date of Birth (DOB)" value={form.dob} onChange={(v) => setForm({ ...form, dob: v })} placeholder="15 Aug 1995" />
          <Field label="Press Card Valid Till" value={form.validTill} onChange={(v) => setForm({ ...form, validTill: v })} placeholder="18 Jul 2029" />
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-700">Avatar</label>
            <MediaField
              value={form.avatarUrl}
              onChange={(v) => setForm({ ...form, avatarUrl: v })}
              usage="other"
              hint="Upload a new photo or pick one from the file manager."
              recommendedSize="400×400 px (square)"
              compact
            />
          </div>
          <div className="sm:col-span-2">
            <Field label="Address" value={form.address} onChange={(v) => setForm({ ...form, address: v })} />
          </div>
          <Field label="State" value={form.state} onChange={(v) => setForm({ ...form, state: v })} />
          <Field label="Country" value={form.country} onChange={(v) => setForm({ ...form, country: v })} />
          <Field label="Pin / ZIP code" value={form.pinCode} onChange={(v) => setForm({ ...form, pinCode: v })} />
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-700">Articles published</label>
            <input type="number" min={0} value={form.articlesPublished}
              onChange={(e) => setForm({ ...form, articlesPublished: Math.max(0, Number(e.target.value) || 0) })}
              className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-700">Wallet points</label>
            <input type="number" min={0} value={form.points}
              onChange={(e) => setForm({ ...form, points: Math.max(0, Number(e.target.value) || 0) })}
              className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none" />
          </div>
          <label className="inline-flex items-center gap-2 rounded-md border border-slate-200 px-3 py-2 text-sm sm:col-span-2">
            <input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} />
            <span className="font-medium">Active</span>
            <span className="text-xs text-slate-500">Inactive journalists cannot sign in.</span>
          </label>
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <button onClick={() => setForm(null)} disabled={saving} className="rounded-md border border-slate-200 px-4 py-2 text-sm font-medium hover:bg-slate-50">Cancel</button>
          <button onClick={submitForm} disabled={saving} className="inline-flex items-center gap-1.5 rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-60">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Save
          </button>
        </div>
      </div>
    </div>
  );
}
