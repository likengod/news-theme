import { useState } from "react";
import { X, Plus, Eye, EyeOff } from "lucide-react";
import { type Role } from "@/lib/roles";
import type { AdminUserRow } from "@/lib/admin-users.functions";

type Props = {
  roles: Role[];
  onClose: () => void;
  onCreate: (email: string, pass: string, name: string, role: AdminUserRow["role"]) => void;
};

export function CreateUserModal({ roles, onClose, onCreate }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [role, setRole] = useState<AdminUserRow["role"]>("reader");
  const [showPass, setShowPass] = useState(false);

  const submit = () => {
    if (!email || !email.includes("@")) return alert("Please enter a valid email address");
    if (!password || password.length < 6) return alert("Password must be at least 6 characters");
    onCreate(email.trim(), password, displayName.trim(), role);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-5 shadow-2xl">
        <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-3">
          <h2 className="text-base font-bold text-slate-900">Create New User</h2>
          <button onClick={onClose} className="rounded p-1 text-slate-400 hover:bg-slate-100">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-3">
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-600">Email Address *</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@example.com"
              className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm focus:border-slate-900 focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-600">Password *</label>
            <div className="relative">
              <input
                type={showPass ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Initial password..."
                className="h-10 w-full rounded-lg border border-slate-200 pl-3 pr-10 text-sm focus:border-slate-900 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
              >
                {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-600">Display Name</label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="e.g. John Doe"
              className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm focus:border-slate-900 focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-600">User Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as AdminUserRow["role"])}
              className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm focus:border-slate-900 focus:outline-none"
            >
              {roles.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-3">
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
              <Plus className="h-4 w-4" /> Create Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
