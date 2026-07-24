import { useState } from "react";
import { X, Save } from "lucide-react";
import { ROLE_COLORS, type Role } from "@/lib/roles";

type Props = {
  role: Role;
  isNew: boolean;
  onClose: () => void;
  onSave: (role: Role) => void;
};

export function RoleEditorModal({ role, isNew, onClose, onSave }: Props) {
  const [draft, setDraft] = useState<Role>(role);

  const submit = () => {
    if (!draft.name.trim()) return alert("Role name is required");
    onSave(draft);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-5 shadow-2xl">
        <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-3">
          <h2 className="text-base font-bold text-slate-900">
            {isNew ? "Create New Role" : `Edit Role — ${role.name}`}
          </h2>
          <button onClick={onClose} className="rounded p-1 text-slate-400 hover:bg-slate-100">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-600">Role Name *</label>
            <input
              type="text"
              value={draft.name}
              onChange={(e) => setDraft({ ...draft, name: e.target.value })}
              placeholder="e.g. Senior Editor"
              className="h-9 w-full rounded-lg border border-slate-200 px-3 text-sm focus:border-slate-900 focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-600">Description</label>
            <textarea
              value={draft.description}
              onChange={(e) => setDraft({ ...draft, description: e.target.value })}
              rows={2}
              placeholder="What this role allows users to do..."
              className="w-full rounded-lg border border-slate-200 p-2.5 text-sm focus:border-slate-900 focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-600">Badge Color</label>
            <div className="flex flex-wrap gap-2 pt-1">
              {ROLE_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setDraft({ ...draft, color: c })}
                  className={`h-7 rounded-md px-3 text-xs font-semibold capitalize transition ${
                    draft.color === c ? "ring-2 ring-slate-900 font-bold" : "opacity-70 hover:opacity-100"
                  }`}
                  style={{
                    backgroundColor: c === "violet" ? "#f5f3ff" : c === "blue" ? "#eff6ff" : c === "emerald" ? "#ecfdf5" : c === "amber" ? "#fffbeb" : c === "rose" ? "#fff1f2" : c === "sky" ? "#f0f9ff" : "#f8fafc",
                    color: c === "violet" ? "#6d28d9" : c === "blue" ? "#1d4ed8" : c === "emerald" ? "#047857" : c === "amber" ? "#b45309" : c === "rose" ? "#be123c" : c === "sky" ? "#0369a1" : "#334155",
                  }}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={draft.seesPopupAds ?? true}
                onChange={(e) => setDraft({ ...draft, seesPopupAds: e.target.checked })}
                className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900"
              />
              <span className="text-xs font-semibold text-slate-700">
                Users with this role see popup advertisements
              </span>
            </label>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              onClick={onClose}
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              onClick={submit}
              className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
            >
              <Save className="h-4 w-4" /> Save Role
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
