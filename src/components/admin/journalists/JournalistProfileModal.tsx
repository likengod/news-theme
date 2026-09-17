import { useState } from "react";
import { X, ShieldOff, ShieldCheck, FileCheck, CheckCircle, Eye, ExternalLink } from "lucide-react";
import { useSiteSettings } from "@/components/site/AdSettingsContext";

export function JournalistProfileModal({
  viewTarget,
  setViewTarget,
  handleToggleBan,
}: {
  viewTarget: any;
  setViewTarget: (t: any | null) => void;
  handleToggleBan: (j: any) => void;
}) {
  const siteSettings = useSiteSettings();
  const planType = (siteSettings?.licenseType || "").toLowerCase();
  const isEnterprisePlus =
    planType.includes("enterprise+") ||
    planType.includes("enterprise plus");

  const [viewingDoc, setViewingDoc] = useState(false);
  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-slate-950/40 p-4"
      onClick={() => setViewTarget(null)}
    >
      <div
        className="w-full max-w-lg rounded-xl bg-white shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-6 py-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">Journalist Profile</h3>
            <p className="text-xs text-slate-500">Read-only membership details</p>
          </div>
          <button
            onClick={() => setViewTarget(null)}
            className="text-slate-400 hover:text-slate-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
            {viewTarget.avatarUrl ? (
              <img
                src={viewTarget.avatarUrl}
                alt=""
                className="h-16 w-16 rounded-full object-cover ring-2 ring-slate-100 bg-slate-100"
              />
            ) : (
              <div className="grid h-16 w-16 place-items-center rounded-full bg-slate-900 text-xl font-bold text-white">
                {(viewTarget.displayName ?? "J").slice(0, 2).toUpperCase()}
              </div>
            )}
            <div>
              <h4 className="text-lg font-bold text-slate-900">
                {viewTarget.displayName ?? "Unnamed Journalist"}
              </h4>
              <p className="text-sm text-slate-500">{viewTarget.email}</p>
              <span
                className={`mt-2 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${viewTarget.active ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200" : "bg-red-50 text-red-700 ring-1 ring-red-200"}`}
              >
                {viewTarget.active ? "Active Partner" : "Suspended"}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Journalist ID
              </span>
              <code className="mt-1 block font-mono text-slate-800 text-sm font-semibold">
                {viewTarget.journalistId || "Not assigned"}
              </code>
            </div>
            <div>
              <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Public User ID
              </span>
              <code className="mt-1 block font-mono text-slate-800 text-sm">
                {viewTarget.publicUserId}
              </code>
            </div>
            <div>
              <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Phone
              </span>
              <span className="mt-1 block text-slate-700 font-medium">
                {viewTarget.phone || "—"}
              </span>
            </div>
            <div>
              <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Blood Group
              </span>
              <span className="mt-1 block text-slate-700 font-medium">
                {viewTarget.bloodGroup || "—"}
              </span>
            </div>
            <div>
              <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Father's Name
              </span>
              <span className="mt-1 block text-slate-700 font-medium">
                {viewTarget.fatherName || "—"}
              </span>
            </div>
            <div>
              <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Mother's Name
              </span>
              <span className="mt-1 block text-slate-700 font-medium">
                {viewTarget.motherName || "—"}
              </span>
            </div>
            <div>
              <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Gender
              </span>
              <span className="mt-1 block text-slate-700 font-medium">
                {viewTarget.gender || "—"}
              </span>
            </div>
            <div>
              <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Marital Status
              </span>
              <span className="mt-1 block text-slate-700 font-medium">
                {viewTarget.maritalStatus || "—"}
              </span>
            </div>
            {viewTarget.husbandName && (
              <div className="col-span-2">
                <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Husband's Name
                </span>
                <span className="mt-1 block text-slate-700 font-medium">
                  {viewTarget.husbandName}
                </span>
              </div>
            )}
            <div>
              <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Date of Birth (DOB)
              </span>
              <span className="mt-1 block text-slate-700 font-medium">{viewTarget.dob || "—"}</span>
            </div>
            <div>
              <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Press Card Valid Till
              </span>
              <span className="mt-1 block text-slate-700 font-medium">
                {viewTarget.validTill || "—"}
              </span>
            </div>
            <div>
              <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Articles Published
              </span>
              <span className="mt-1 block text-slate-700 font-medium">
                {viewTarget.articlesPublished} articles
              </span>
            </div>
            {isEnterprisePlus && (
              <div>
                <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Wallet Balance
                </span>
                <span className="mt-1 block text-slate-700 font-medium font-semibold text-amber-700">
                  {viewTarget.points} pts
                </span>
              </div>
            )}
          </div>

          {/* Identity Verification Document */}
          <div className="border-t border-slate-100 pt-4 space-y-3">
            <span className="block text-xs font-semibold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <FileCheck className="h-4 w-4 text-blue-600" />
              <span>Verification Document (ID Proof)</span>
            </span>

            <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <div>
                  <span className="block text-[11px] font-semibold text-slate-400 uppercase">Document Type</span>
                  <span className="text-sm font-bold text-slate-800">
                    {viewTarget.documentType || "Not Specified"}
                  </span>
                </div>
                {viewTarget.documentUrl ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200">
                    <CheckCircle className="h-3 w-3" /> Document Available
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-500">
                    No Document Uploaded
                  </span>
                )}
              </div>

              {viewTarget.documentUrl ? (
                <div className="flex flex-col sm:flex-row items-start gap-4">
                  <div
                    onClick={() => setViewingDoc(true)}
                    className="group relative cursor-pointer overflow-hidden rounded-lg border border-slate-300 bg-white shadow-xs hover:ring-2 hover:ring-blue-500 transition shrink-0"
                  >
                    <img
                      src={viewTarget.documentUrl}
                      alt="Verification Document"
                      className="h-28 w-40 object-contain p-1 group-hover:scale-105 transition duration-200"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition text-white text-[11px] font-semibold gap-1">
                      <Eye className="h-3.5 w-3.5" />
                      <span>Click to view</span>
                    </div>
                  </div>

                  <div className="flex-1 space-y-2 text-xs text-slate-600">
                    <p className="text-slate-500">
                      Official document uploaded by applicant for journalist accreditation and identity verification.
                    </p>
                    <div className="flex flex-wrap gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setViewingDoc(true)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 font-semibold text-slate-700 hover:bg-slate-50 shadow-2xs cursor-pointer"
                      >
                        <Eye className="h-3.5 w-3.5 text-slate-500" />
                        <span>View Document</span>
                      </button>
                      <a
                        href={viewTarget.documentUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 font-semibold text-blue-600 hover:bg-blue-50 hover:text-blue-700 shadow-2xs"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                        <span>Open Full Image ↗</span>
                      </a>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic">
                  No official ID document was submitted for this journalist record.
                </p>
              )}
            </div>
          </div>

          <div className="border-t border-slate-100 pt-4 space-y-3 text-sm">
            <div>
              <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Address
              </span>
              <span className="mt-1 block text-slate-700 leading-relaxed">
                {viewTarget.address || "—"}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  State
                </span>
                <span className="mt-1 block text-slate-700">{viewTarget.state || "—"}</span>
              </div>
              <div>
                <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Country
                </span>
                <span className="mt-1 block text-slate-700">{viewTarget.country || "—"}</span>
              </div>
              <div>
                <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Pin / ZIP
                </span>
                <span className="mt-1 block text-slate-700 font-mono">
                  {viewTarget.pinCode || "—"}
                </span>
              </div>
            </div>
          </div>

          {/* Bank Details section */}
          <div className="border-t border-slate-100 pt-4 space-y-3 text-sm">
            <span className="block text-xs font-semibold text-slate-900 uppercase tracking-wider">
              Bank Account Details
            </span>
            <div className="grid grid-cols-2 gap-4 rounded-lg bg-slate-50 p-3.5">
              <div>
                <span className="block text-[11px] font-semibold text-slate-400 uppercase">
                  Bank Name
                </span>
                <span className="mt-0.5 block text-slate-700 font-medium">
                  {viewTarget.bankName || "—"}
                </span>
              </div>
              <div>
                <span className="block text-[11px] font-semibold text-slate-400 uppercase">
                  Account Name
                </span>
                <span className="mt-0.5 block text-slate-700 font-medium">
                  {viewTarget.bankAccountName || "—"}
                </span>
              </div>
              <div>
                <span className="block text-[11px] font-semibold text-slate-400 uppercase">
                  Account Number
                </span>
                <span className="mt-0.5 block text-slate-700 font-mono text-slate-800">
                  {viewTarget.bankAccountNo || "—"}
                </span>
              </div>
              <div>
                <span className="block text-[11px] font-semibold text-slate-400 uppercase">
                  IFSC / Routing Code
                </span>
                <span className="mt-0.5 block text-slate-700 font-mono text-slate-800">
                  {viewTarget.bankIfsc || "—"}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50 px-6 py-4">
          <button
            onClick={() => handleToggleBan(viewTarget)}
            className={`inline-flex items-center gap-1.5 rounded-lg border px-3.5 py-1.5 text-xs font-semibold transition-colors ${
              viewTarget.active
                ? "border-amber-200 bg-amber-50 text-amber-800 hover:bg-amber-100"
                : "border-emerald-200 bg-emerald-50 text-emerald-800 hover:bg-emerald-100"
            }`}
          >
            {viewTarget.active ? (
              <>
                <ShieldOff className="h-4 w-4 text-amber-600" /> Suspend Account
              </>
            ) : (
              <>
                <ShieldCheck className="h-4 w-4 text-emerald-600" /> Activate Account
              </>
            )}
          </button>
          <button
            onClick={() => setViewTarget(null)}
            className="rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 shadow-sm cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>

      {/* High-res Document View Lightbox */}
      {viewingDoc && viewTarget.documentUrl && (
        <div
          className="fixed inset-0 z-60 grid place-items-center bg-black/80 p-4"
          onClick={() => setViewingDoc(false)}
        >
          <div
            className="relative max-h-[90vh] max-w-3xl rounded-2xl bg-white p-4 shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <FileCheck className="h-5 w-5 text-blue-600" />
                <span className="font-bold text-slate-900 text-sm">
                  {viewTarget.documentType || "ID Document"} — {viewTarget.displayName}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={viewTarget.documentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  <span>Open Full Size</span>
                </a>
                <button
                  type="button"
                  onClick={() => setViewingDoc(false)}
                  className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 cursor-pointer"
                  title="Close viewer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-center max-h-[75vh] overflow-auto bg-slate-900/5 rounded-xl p-2">
              <img
                src={viewTarget.documentUrl}
                alt="Document Full View"
                className="max-h-[70vh] w-auto object-contain rounded-lg shadow-sm"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
