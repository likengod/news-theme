import { X, Save, Loader2 } from "lucide-react";
import { MediaField } from "@/components/admin/MediaField";
import { Field } from "./Field";
import { useSiteSettings } from "@/components/site/AdSettingsContext";

export type EditForm = {
  userId?: string;
  email: string;
  password: string;
  displayName: string;
  phone: string;
  bloodGroup: string;
  dob: string;
  validTill: string;
  fatherName: string;
  motherName: string;
  gender: string;
  maritalStatus: string;
  husbandName: string;
  documentType: string;
  documentUrl: string;
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
    email: "",
    password: "",
    displayName: "",
    phone: "",
    bloodGroup: "",
    dob: "",
    validTill: "",
    fatherName: "",
    motherName: "",
    gender: "",
    maritalStatus: "",
    husbandName: "",
    documentType: "",
    documentUrl: "",
    address: "",
    state: "",
    country: "",
    pinCode: "",
    avatarUrl: "",
    articlesPublished: 0,
    points: 0,
    active: true,
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
  const siteSettings = useSiteSettings();
  const planType = (siteSettings?.licenseType || "").toLowerCase();
  const isEnterprisePlus =
    planType.includes("enterprise+") ||
    planType.includes("enterprise plus");

  return (
    <div className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-black/40 p-4">
      <div className="w-full max-w-2xl rounded-lg bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">
            {form.userId ? "Edit journalist" : "New journalist"}
          </h2>
          <button
            onClick={() => setForm(null)}
            className="grid h-7 w-7 place-items-center rounded-md hover:bg-slate-100"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field
            label="Full name*"
            value={form.displayName}
            onChange={(v) => setForm({ ...form, displayName: v })}
          />
          <Field
            label="Email*"
            type="email"
            value={form.email}
            onChange={(v) => setForm({ ...form, email: v })}
          />
          <Field
            label={form.userId ? "New password (leave blank to keep)" : "Password*"}
            type="password"
            value={form.password}
            onChange={(v) => setForm({ ...form, password: v })}
          />
          <Field
            label="Phone"
            value={form.phone}
            onChange={(v) => setForm({ ...form, phone: v })}
          />
          <Field
            label="Father's name"
            value={form.fatherName}
            onChange={(v) => setForm({ ...form, fatherName: v })}
            placeholder="Father's full name"
          />
          <Field
            label="Mother's name"
            value={form.motherName}
            onChange={(v) => setForm({ ...form, motherName: v })}
            placeholder="Mother's full name"
          />
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-700">Gender</label>
            <select
              value={form.gender}
              onChange={(e) => {
                const g = e.target.value;
                setForm({
                  ...form,
                  gender: g,
                  husbandName: g === "Female" && form.maritalStatus === "Married" ? form.husbandName : "",
                });
              }}
              className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:border-slate-900 focus:outline-none"
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-700">Marital status</label>
            <select
              value={form.maritalStatus}
              onChange={(e) => {
                const s = e.target.value;
                setForm({
                  ...form,
                  maritalStatus: s,
                  husbandName: form.gender === "Female" && s === "Married" ? form.husbandName : "",
                });
              }}
              className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:border-slate-900 focus:outline-none"
            >
              <option value="">Select Marital Status</option>
              <option value="Single">Single / Unmarried</option>
              <option value="Married">Married</option>
              <option value="Other">Other</option>
            </select>
          </div>
          {form.gender === "Female" && form.maritalStatus === "Married" && (
            <div className="sm:col-span-2">
              <Field
                label="Husband's name*"
                value={form.husbandName}
                onChange={(v) => setForm({ ...form, husbandName: v })}
                placeholder="Husband's full name"
              />
            </div>
          )}
          <Field
            label="Blood group"
            value={form.bloodGroup}
            onChange={(v) => setForm({ ...form, bloodGroup: v })}
            placeholder="O+"
          />
          <Field
            label="Date of Birth (DOB)"
            value={form.dob}
            onChange={(v) => setForm({ ...form, dob: v })}
            placeholder="15 Aug 1995"
          />
          <Field
            label="Press Card Valid Till"
            value={form.validTill}
            onChange={(v) => setForm({ ...form, validTill: v })}
            placeholder="18 Jul 2029"
          />
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
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-700">Document Type</label>
            <select
              value={form.documentType}
              onChange={(e) => setForm({ ...form, documentType: e.target.value })}
              className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:border-slate-900 focus:outline-none"
            >
              <option value="">Select Document Type</option>
              <option value="Voter ID">Voter ID</option>
              <option value="Aadhaar Card">Aadhaar Card</option>
              <option value="Passport">Passport</option>
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1 block text-xs font-medium text-slate-700">Verification Document (ID Proof)</label>
            <MediaField
              value={form.documentUrl}
              onChange={(v) => setForm({ ...form, documentUrl: v })}
              usage="other"
              hint="Upload document image (< 1 MB) or pick from media."
              recommendedSize="Voter ID / Aadhaar / Passport (< 1 MB)"
              compact
            />
          </div>
          <div className="sm:col-span-2">
            <Field
              label="Address"
              value={form.address}
              onChange={(v) => setForm({ ...form, address: v })}
            />
          </div>
          <Field
            label="State"
            value={form.state}
            onChange={(v) => setForm({ ...form, state: v })}
          />
          <Field
            label="Country"
            value={form.country}
            onChange={(v) => setForm({ ...form, country: v })}
          />
          <Field
            label="Pin / ZIP code"
            value={form.pinCode}
            onChange={(v) => setForm({ ...form, pinCode: v })}
          />
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-700">
              Articles published
            </label>
            <input
              type="number"
              min={0}
              value={form.articlesPublished}
              onChange={(e) =>
                setForm({ ...form, articlesPublished: Math.max(0, Number(e.target.value) || 0) })
              }
              className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none"
            />
          </div>
          {isEnterprisePlus && (
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-700">Wallet points</label>
              <input
                type="number"
                min={0}
                value={form.points}
                onChange={(e) =>
                  setForm({ ...form, points: Math.max(0, Number(e.target.value) || 0) })
                }
                className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none"
              />
            </div>
          )}
          <label className="inline-flex items-center gap-2 rounded-md border border-slate-200 px-3 py-2 text-sm sm:col-span-2">
            <input
              type="checkbox"
              checked={form.active}
              onChange={(e) => setForm({ ...form, active: e.target.checked })}
            />
            <span className="font-medium">Active</span>
            <span className="text-xs text-slate-500">Inactive journalists cannot sign in.</span>
          </label>
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <button
            onClick={() => setForm(null)}
            disabled={saving}
            className="rounded-md border border-slate-200 px-4 py-2 text-sm font-medium hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            onClick={submitForm}
            disabled={saving}
            className="inline-flex items-center gap-1.5 rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-60"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}{" "}
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
