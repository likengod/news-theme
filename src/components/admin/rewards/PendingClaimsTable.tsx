import { ShieldCheck, Ban } from "lucide-react";
import type { PendingClaim } from "@/lib/pending-claims";

type Props = {
  claims: PendingClaim[];
  onApprove: (claim: PendingClaim) => void;
  onReject: (claim: PendingClaim) => void;
};

export function PendingClaimsTable({ claims, onApprove, onReject }: Props) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      <div className="border-b border-slate-100 bg-slate-50/60 px-5 py-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600">
          User Social Proof Claims Review
        </h3>
        <p className="text-[11px] text-slate-500">
          Approve or reject social follow/subscribe submissions to credit MySQL user points
        </p>
      </div>

      <table className="w-full text-left text-sm">
        <thead className="border-b border-slate-100 bg-slate-50/40 text-xs font-bold uppercase text-slate-500">
          <tr>
            <th className="px-5 py-3">User Name</th>
            <th className="px-5 py-3">Platform</th>
            <th className="px-5 py-3">Submitted Handle</th>
            <th className="px-5 py-3">Points</th>
            <th className="px-5 py-3">Status</th>
            <th className="px-5 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {claims.map((c) => (
            <tr key={c.id} className="hover:bg-slate-50/60 transition-colors">
              <td className="px-5 py-3 font-semibold text-slate-900">{c.userName || "User"}</td>
              <td className="px-5 py-3 capitalize font-medium text-slate-700">{c.platform}</td>
              <td className="px-5 py-3 font-mono text-xs text-slate-600">{c.handle}</td>
              <td className="px-5 py-3 font-bold text-amber-700">+{c.points} pts</td>
              <td className="px-5 py-3">
                <span
                  className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                    c.status === "approved"
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : c.status === "rejected"
                      ? "bg-red-50 text-red-700 border border-red-200"
                      : "bg-amber-50 text-amber-800 border border-amber-200"
                  }`}
                >
                  {c.status}
                </span>
              </td>
              <td className="px-5 py-3 text-right">
                <div className="inline-flex gap-1.5">
                  <button
                    onClick={() => onApprove(c)}
                    disabled={c.status === "approved"}
                    className="inline-flex items-center gap-1 rounded-md border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 hover:bg-emerald-100 disabled:opacity-40"
                  >
                    <ShieldCheck className="h-3.5 w-3.5" /> Approve
                  </button>
                  <button
                    onClick={() => onReject(c)}
                    disabled={c.status === "rejected"}
                    className="inline-flex items-center gap-1 rounded-md border border-red-200 bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-600 hover:bg-red-100 disabled:opacity-40"
                  >
                    <Ban className="h-3.5 w-3.5" /> Reject
                  </button>
                </div>
              </td>
            </tr>
          ))}

          {claims.length === 0 && (
            <tr>
              <td colSpan={6} className="px-5 py-8 text-center text-xs text-slate-400">
                No social proof claims submitted yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </section>
  );
}
