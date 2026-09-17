import React from "react";
import { Plus, Pencil, Trash2, Award } from "lucide-react";
import { roleBadgeClass } from "@/lib/roles";
import type { JournalistRank } from "@/lib/journalist-ranks";

interface RanksTabProps {
  ranks: JournalistRank[];
  setEditing: (r: JournalistRank | null) => void;
  setIsNew: (v: boolean) => void;
  onDelete: (r: JournalistRank) => void;
  emptyRank: () => JournalistRank;
}

export function RanksTab({
  ranks,
  setEditing,
  setIsNew,
  onDelete,
  emptyRank,
}: RanksTabProps) {
  return (
    <section className="overflow-hidden rounded-lg border border-slate-200 bg-white">
      <div className="flex items-center justify-between border-b border-slate-200 px-5 py-3">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
            Rank tiers & points
          </h2>
          <p className="mt-0.5 text-xs text-slate-500">
            A journalist upgrades when their published count reaches the threshold. Points are
            earned per published article at their current rank.
          </p>
        </div>
        <button
          onClick={() => {
            setEditing(emptyRank());
            setIsNew(true);
          }}
          className="inline-flex items-center gap-1.5 rounded-md bg-slate-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-slate-800"
        >
          <Plus className="h-3.5 w-3.5" /> New rank
        </button>
      </div>
      <table className="w-full text-sm">
        <thead className="bg-slate-50 text-left text-xs uppercase tracking-wider text-slate-500">
          <tr>
            <th className="px-5 py-3">Rank</th>
            <th className="px-5 py-3">Published news required</th>
            <th className="px-5 py-3">Points per news</th>
            <th className="px-5 py-3">Type</th>
            <th className="px-5 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {ranks.map((r) => (
            <tr key={r.id} className="hover:bg-slate-50/60">
              <td className="px-5 py-3">
                <span
                  className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium ${roleBadgeClass(r.color)}`}
                >
                  <Award className="h-3 w-3" /> {r.name}
                </span>
              </td>
              <td className="px-5 py-3 text-slate-700">{r.minNews.toLocaleString()}+</td>
              <td className="px-5 py-3 text-slate-700">{r.pointsPerNews} pts</td>
              <td className="px-5 py-3 text-[10px] uppercase tracking-wider text-slate-400">
                {r.builtin ? "Built-in" : "Custom"}
              </td>
              <td className="px-5 py-3 text-right">
                <div className="inline-flex gap-2">
                  <button
                    onClick={() => {
                      setEditing({ ...r });
                      setIsNew(false);
                    }}
                    className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 px-3 py-1.5 text-xs hover:bg-slate-50"
                  >
                    <Pencil className="h-3 w-3" /> Edit
                  </button>
                  <button
                    onClick={() => onDelete(r)}
                    disabled={r.builtin}
                    className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 px-3 py-1.5 text-xs text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-white"
                  >
                    <Trash2 className="h-3 w-3" /> Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
