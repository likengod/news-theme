import { X, ShieldOff, ShieldCheck } from "lucide-react";

export function JournalistProfileModal({
  viewTarget,
  setViewTarget,
  handleToggleBan,
}: {
  viewTarget: any;
  setViewTarget: (t: any | null) => void;
  handleToggleBan: (j: any) => void;
}) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/40 p-4" onClick={() => setViewTarget(null)}>
      <div className="w-full max-w-lg rounded-xl bg-white shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-6 py-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">Journalist Profile</h3>
            <p className="text-xs text-slate-500">Read-only membership details</p>
          </div>
          <button onClick={() => setViewTarget(null)} className="text-slate-400 hover:text-slate-600">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
            {viewTarget.avatarUrl ? (
              <img src={viewTarget.avatarUrl} alt="" className="h-16 w-16 rounded-full object-cover ring-2 ring-slate-100 bg-slate-100" />
            ) : (
              <div className="grid h-16 w-16 place-items-center rounded-full bg-slate-900 text-xl font-bold text-white">
                {(viewTarget.displayName ?? "J").slice(0, 2).toUpperCase()}
              </div>
            )}
            <div>
              <h4 className="text-lg font-bold text-slate-900">{viewTarget.displayName ?? "Unnamed Journalist"}</h4>
              <p className="text-sm text-slate-500">{viewTarget.email}</p>
              <span className={`mt-2 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${viewTarget.active ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200" : "bg-red-50 text-red-700 ring-1 ring-red-200"}`}>
                {viewTarget.active ? "Active Partner" : "Suspended"}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">Journalist ID</span>
              <code className="mt-1 block font-mono text-slate-800 text-sm font-semibold">{viewTarget.journalistId || "Not assigned"}</code>
            </div>
            <div>
              <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">Public User ID</span>
              <code className="mt-1 block font-mono text-slate-800 text-sm">{viewTarget.publicUserId}</code>
            </div>
            <div>
              <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">Phone</span>
              <span className="mt-1 block text-slate-700 font-medium">{viewTarget.phone || "—"}</span>
            </div>
            <div>
              <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">Blood Group</span>
              <span className="mt-1 block text-slate-700 font-medium">{viewTarget.bloodGroup || "—"}</span>
            </div>
            <div>
              <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">Date of Birth (DOB)</span>
              <span className="mt-1 block text-slate-700 font-medium">{viewTarget.dob || "—"}</span>
            </div>
            <div>
              <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">Press Card Valid Till</span>
              <span className="mt-1 block text-slate-700 font-medium">{viewTarget.validTill || "—"}</span>
            </div>
            <div>
              <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">Articles Published</span>
              <span className="mt-1 block text-slate-700 font-medium">{viewTarget.articlesPublished} articles</span>
            </div>
            <div>
              <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">Wallet Balance</span>
              <span className="mt-1 block text-slate-700 font-medium font-semibold text-amber-700">{viewTarget.points} pts</span>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-4 space-y-3 text-sm">
            <div>
              <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">Address</span>
              <span className="mt-1 block text-slate-700 leading-relaxed">{viewTarget.address || "—"}</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">State</span>
                <span className="mt-1 block text-slate-700">{viewTarget.state || "—"}</span>
              </div>
              <div>
                <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">Country</span>
                <span className="mt-1 block text-slate-700">{viewTarget.country || "—"}</span>
              </div>
              <div>
                <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">Pin / ZIP</span>
                <span className="mt-1 block text-slate-700 font-mono">{viewTarget.pinCode || "—"}</span>
              </div>
            </div>
          </div>

          {/* Bank Details section */}
          <div className="border-t border-slate-100 pt-4 space-y-3 text-sm">
            <span className="block text-xs font-semibold text-slate-900 uppercase tracking-wider">Bank Account Details</span>
            <div className="grid grid-cols-2 gap-4 rounded-lg bg-slate-50 p-3.5">
              <div>
                <span className="block text-[11px] font-semibold text-slate-400 uppercase">Bank Name</span>
                <span className="mt-0.5 block text-slate-700 font-medium">{viewTarget.bankName || "—"}</span>
              </div>
              <div>
                <span className="block text-[11px] font-semibold text-slate-400 uppercase">Account Name</span>
                <span className="mt-0.5 block text-slate-700 font-medium">{viewTarget.bankAccountName || "—"}</span>
              </div>
              <div>
                <span className="block text-[11px] font-semibold text-slate-400 uppercase">Account Number</span>
                <span className="mt-0.5 block text-slate-700 font-mono text-slate-800">{viewTarget.bankAccountNo || "—"}</span>
              </div>
              <div>
                <span className="block text-[11px] font-semibold text-slate-400 uppercase">IFSC / Routing Code</span>
                <span className="mt-0.5 block text-slate-700 font-mono text-slate-800">{viewTarget.bankIfsc || "—"}</span>
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
          <button onClick={() => setViewTarget(null)} className="rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 shadow-sm">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
