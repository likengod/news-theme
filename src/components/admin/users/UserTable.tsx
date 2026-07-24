import { ShieldCheck, ShieldOff, Trash2, Copy, RefreshCw, KeyRound, Wallet, UserPen, X, CheckSquare } from "lucide-react";
import { toast } from "sonner";
import { roleBadgeClass, type Role } from "@/lib/roles";
import type { AdminUserRow } from "@/lib/admin-users.functions";

type Props = {
  users: AdminUserRow[];
  currentUserId: string | null;
  roles: Role[];
  selectedIds: string[];
  onToggleSelect: (userId: string) => void;
  onToggleSelectAll: () => void;
  onBulkDelete: () => void;
  onBulkStatusChange: (suspend: boolean) => void;
  onClearSelection: () => void;
  onSetRole: (userId: string, role: AdminUserRow["role"]) => void;
  onToggleBan: (row: AdminUserRow) => void;
  onDelete: (row: AdminUserRow) => void;
  onRegenId: (row: AdminUserRow) => void;
  onOpenModal: (kind: "points" | "password" | "details", row: AdminUserRow) => void;
};

export function UserTable({
  users,
  currentUserId,
  roles,
  selectedIds,
  onToggleSelect,
  onToggleSelectAll,
  onBulkDelete,
  onBulkStatusChange,
  onClearSelection,
  onSetRole,
  onToggleBan,
  onDelete,
  onRegenId,
  onOpenModal,
}: Props) {
  const copyPublicId = (pid: string) => {
    navigator.clipboard.writeText(pid);
    toast.success(`Copied ID ${pid} to clipboard`);
  };

  const selectableUsers = users.filter((u) => u.id !== currentUserId);
  const allSelected =
    selectableUsers.length > 0 && selectableUsers.every((u) => selectedIds.includes(u.id));

  return (
    <div className="space-y-3">
      {/* ── Bulk Actions Bar ── */}
      {selectedIds.length > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-800 bg-slate-900 px-4 py-3 text-white shadow-lg animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <CheckSquare className="h-4 w-4 text-emerald-400" />
            <span>{selectedIds.length} user(s) selected</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onBulkStatusChange(false)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/15 px-3 py-1.5 text-xs font-semibold text-emerald-300 hover:bg-emerald-500/25 transition-colors"
            >
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" /> Activate Selected
            </button>
            <button
              onClick={() => onBulkStatusChange(true)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-amber-500/30 bg-amber-500/15 px-3 py-1.5 text-xs font-semibold text-amber-300 hover:bg-amber-500/25 transition-colors"
            >
              <ShieldOff className="h-3.5 w-3.5 text-amber-400" /> Suspend Selected
            </button>
            <button
              onClick={onBulkDelete}
              className="inline-flex items-center gap-1.5 rounded-lg border border-red-500/30 bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-700 transition-colors shadow-sm"
            >
              <Trash2 className="h-3.5 w-3.5" /> Delete Selected
            </button>
            <button
              onClick={onClearSelection}
              className="ml-2 grid h-7 w-7 place-items-center rounded-lg border border-slate-700 bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white"
              title="Clear selection"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs font-bold uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-4 py-3 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={onToggleSelectAll}
                    className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900 cursor-pointer"
                    title="Select / Deselect all users on this page"
                  />
                </th>
                <th className="px-4 py-3">User</th>
                <th className="px-4 py-3">Public ID</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3 text-right">Points</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((r) => {
                const isSelf = currentUserId === r.id;
                const isSelected = selectedIds.includes(r.id);
                return (
                  <tr
                    key={r.id}
                    className={`transition-colors ${
                      isSelected ? "bg-amber-50/60" : "hover:bg-slate-50/70"
                    }`}
                  >
                    {/* Checkbox */}
                    <td className="px-4 py-3 text-center">
                      <input
                        type="checkbox"
                        disabled={isSelf}
                        checked={isSelected}
                        onChange={() => onToggleSelect(r.id)}
                        className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900 cursor-pointer disabled:opacity-30"
                      />
                    </td>

                    {/* User info */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-slate-900 text-xs font-bold text-white uppercase">
                          {r.avatarUrl ? (
                            <img src={r.avatarUrl} alt="" className="h-full w-full rounded-full object-cover" />
                          ) : (
                            (r.displayName || r.email).slice(0, 2)
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate font-semibold text-slate-900">
                            {r.displayName || "Un-named"} {isSelf && <span className="ml-1 rounded bg-slate-100 px-1.5 py-0.5 text-[10px] text-slate-600 font-normal">(You)</span>}
                          </p>
                          <p className="truncate text-xs text-slate-500">{r.email}</p>
                        </div>
                      </div>
                    </td>

                    {/* Public ID */}
                    <td className="px-4 py-3 font-mono text-xs text-slate-600">
                      <div className="flex items-center gap-1.5">
                        <span>{r.publicUserId}</span>
                        <button
                          onClick={() => copyPublicId(r.publicUserId)}
                          title="Copy Public ID"
                          className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                        >
                          <Copy className="h-3 w-3" />
                        </button>
                        <button
                          onClick={() => onRegenId(r)}
                          title="Regenerate Public ID"
                          className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                        >
                          <RefreshCw className="h-3 w-3" />
                        </button>
                      </div>
                    </td>

                    {/* Role dropdown */}
                    <td className="px-4 py-3">
                      <select
                        value={r.role}
                        disabled={isSelf}
                        onChange={(e) => onSetRole(r.id, e.target.value as AdminUserRow["role"])}
                        className={`rounded-full border px-2.5 py-1 text-xs font-semibold focus:outline-none ${roleBadgeClass(
                          roles.find((x) => x.id === r.role)?.color ?? "slate"
                        )}`}
                      >
                        {roles.map((rl) => (
                          <option key={rl.id} value={rl.id}>
                            {rl.name}
                          </option>
                        ))}
                      </select>
                    </td>

                    {/* Points */}
                    <td className="px-4 py-3 text-right font-semibold text-amber-700">
                      {r.points.toLocaleString()} pts
                    </td>

                    {/* Status dropdown */}
                    <td className="px-4 py-3">
                      <select
                        value={r.status === "Active" ? "Active" : "Suspended"}
                        disabled={isSelf}
                        onChange={(e) => {
                          const nextStatus = e.target.value;
                          if ((nextStatus === "Active" && r.status !== "Active") || (nextStatus === "Suspended" && r.status === "Active")) {
                            onToggleBan(r);
                          }
                        }}
                        className={`rounded-full border px-2.5 py-1 text-xs font-bold transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-slate-900/10 disabled:cursor-not-allowed disabled:opacity-50 ${
                          r.status === "Active"
                            ? "border-emerald-300 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                            : "border-red-300 bg-red-50 text-red-700 hover:bg-red-100"
                        }`}
                      >
                        <option value="Active" className="bg-white text-emerald-700 font-semibold">● Active</option>
                        <option value="Suspended" className="bg-white text-red-700 font-semibold">● Suspended</option>
                      </select>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          onClick={() => onOpenModal("details", r)}
                          title="Edit Details"
                          className="rounded-md border border-slate-200 p-1.5 text-slate-600 hover:bg-slate-100"
                        >
                          <UserPen className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => onOpenModal("points", r)}
                          title="Manage Points"
                          className="rounded-md border border-slate-200 p-1.5 text-slate-600 hover:bg-slate-100"
                        >
                          <Wallet className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => onOpenModal("password", r)}
                          title="Reset Password"
                          className="rounded-md border border-slate-200 p-1.5 text-slate-600 hover:bg-slate-100"
                        >
                          <KeyRound className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => onDelete(r)}
                          disabled={isSelf}
                          title="Delete User"
                          className="rounded-md border border-slate-200 p-1.5 text-red-600 hover:bg-red-50 disabled:opacity-40"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {users.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-sm text-slate-400">
                    No users found matching your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
