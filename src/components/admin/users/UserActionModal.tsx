import { useState } from "react";
import { X, Save, Lock, Eye, EyeOff } from "lucide-react";
import type { AdminUserRow } from "@/lib/admin-users.functions";

type Props = {
  kind: "points" | "password" | "details";
  row: AdminUserRow;
  onClose: () => void;
  onSavePoints: (userId: string, points: number) => void;
  onSavePassword: (userId: string, pass: string) => void;
  onSaveDetails: (userId: string, name: string, avatar: string) => void;
};

export function UserActionModal({
  kind,
  row,
  onClose,
  onSavePoints,
  onSavePassword,
  onSaveDetails,
}: Props) {
  const [points, setPoints] = useState(row.points);
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [displayName, setDisplayName] = useState(row.displayName || "");
  const [avatarUrl, setAvatarUrl] = useState(row.avatarUrl || "");

  const submit = () => {
    if (kind === "points") {
      onSavePoints(row.id, Number(points) || 0);
    } else if (kind === "password") {
      if (!password || password.length < 6) return alert("Password must be at least 6 characters");
      onSavePassword(row.id, password);
    } else if (kind === "details") {
      onSaveDetails(row.id, displayName, avatarUrl);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-5 shadow-2xl">
        <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-3">
          <h2 className="text-base font-bold text-slate-900">
            {kind === "points" && `Manage Points — ${row.email}`}
            {kind === "password" && `Reset Password — ${row.email}`}
            {kind === "details" && `Edit Profile Details — ${row.email}`}
          </h2>
          <button onClick={onClose} className="rounded p-1 text-slate-400 hover:bg-slate-100">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-4">
          {kind === "points" && (
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-600">Reward Points</label>
              <input
                type="number"
                value={points}
                onChange={(e) => setPoints(Number(e.target.value))}
                className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm focus:border-slate-900 focus:outline-none"
              />
            </div>
          )}

          {kind === "password" && (
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-600">New Password</label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter new strong password..."
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
          )}

          {kind === "details" && (
            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-600">Display Name</label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Full Name"
                  className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm focus:border-slate-900 focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-600">Avatar Image URL</label>
                <input
                  type="url"
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  placeholder="https://..."
                  className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm focus:border-slate-900 focus:outline-none"
                />
              </div>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-2">
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
              <Save className="h-4 w-4" /> Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
