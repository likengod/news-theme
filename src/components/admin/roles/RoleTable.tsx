import { ShieldCheck, Pencil, Trash2 } from "lucide-react";
import { roleBadgeClass, type Role } from "@/lib/roles";

type Props = {
  roles: Role[];
  onEdit: (role: Role) => void;
  onDelete: (role: Role) => void;
};

export function RoleTable({ roles, onEdit, onDelete }: Props) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-slate-200 bg-slate-50 text-xs font-bold uppercase tracking-wider text-slate-500">
          <tr>
            <th className="px-5 py-3">Role</th>
            <th className="px-5 py-3">Description</th>
            <th className="px-5 py-3">Popup Ads</th>
            <th className="px-5 py-3">Type</th>
            <th className="px-5 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {roles.map((r) => (
            <tr key={r.id} className="hover:bg-slate-50/70 transition-colors">
              <td className="px-5 py-3">
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-bold ${roleBadgeClass(
                    r.color
                  )}`}
                >
                  <ShieldCheck className="h-3.5 w-3.5" /> {r.name}
                </span>
              </td>
              <td className="px-5 py-3 text-xs text-slate-600 max-w-xs">{r.description}</td>
              <td className="px-5 py-3 text-xs">
                {r.seesPopupAds ? (
                  <span className="rounded-md bg-amber-50 px-2 py-0.5 font-medium text-amber-700 border border-amber-200">
                    Sees Ads
                  </span>
                ) : (
                  <span className="rounded-md bg-emerald-50 px-2 py-0.5 font-medium text-emerald-700 border border-emerald-200">
                    Ad Free
                  </span>
                )}
              </td>
              <td className="px-5 py-3 text-xs text-slate-500">
                {r.builtin ? (
                  <span className="rounded bg-slate-100 px-2 py-0.5 text-slate-600 font-semibold">Built-in</span>
                ) : (
                  <span className="rounded bg-blue-50 px-2 py-0.5 text-blue-700 font-semibold">Custom</span>
                )}
              </td>
              <td className="px-5 py-3 text-right">
                <div className="inline-flex gap-1">
                  <button
                    onClick={() => onEdit(r)}
                    className="inline-flex items-center gap-1 rounded-md border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50"
                  >
                    <Pencil className="h-3 w-3" /> Edit
                  </button>
                  {!r.builtin && (
                    <button
                      onClick={() => onDelete(r)}
                      className="inline-flex items-center gap-1 rounded-md border border-red-200 bg-red-50 px-2.5 py-1 text-xs font-medium text-red-600 hover:bg-red-100"
                    >
                      <Trash2 className="h-3 w-3" /> Delete
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
