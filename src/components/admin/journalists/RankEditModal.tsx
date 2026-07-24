import { X, Save } from "lucide-react";
import { type JournalistRank } from "@/lib/journalist-ranks";
import { ROLE_COLORS, roleBadgeClass } from "@/lib/roles";

export function RankEditModal({
  editing,
  isNew,
  setEditing,
  onSave,
}: {
  editing: JournalistRank;
  isNew: boolean;
  setEditing: (r: JournalistRank | null) => void;
  onSave: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-5 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">{isNew ? "New rank" : `Edit "${editing.name}"`}</h2>
          <button onClick={() => setEditing(null)} className="grid h-7 w-7 place-items-center rounded-md hover:bg-slate-100" aria-label="Close"><X className="h-4 w-4" /></button>
        </div>
        <div className="space-y-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-700">Rank name</label>
            <input value={editing.name} disabled={!isNew && editing.builtin} onChange={(e) => setEditing({ ...editing, name: e.target.value })} className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none disabled:bg-slate-50" placeholder="Platinum" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-700">Published news required</label>
              <input type="number" value={editing.minNews} onChange={(e) => setEditing({ ...editing, minNews: Number(e.target.value) || 0 })} className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-700">Points per news</label>
              <input type="number" value={editing.pointsPerNews} onChange={(e) => setEditing({ ...editing, pointsPerNews: Number(e.target.value) || 0 })} className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none" />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-700">Badge colour</label>
            <div className="flex flex-wrap gap-2">
              {ROLE_COLORS.map((c) => (
                <button key={c} type="button" onClick={() => setEditing({ ...editing, color: c })} className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${roleBadgeClass(c)} ${editing.color === c ? "ring-2 ring-slate-900 ring-offset-1" : ""}`}>{c}</button>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <button onClick={() => setEditing(null)} className="rounded-md border border-slate-200 px-4 py-2 text-sm font-medium hover:bg-slate-50">Cancel</button>
          <button onClick={onSave} className="inline-flex items-center gap-1.5 rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"><Save className="h-4 w-4" /> Save</button>
        </div>
      </div>
    </div>
  );
}
