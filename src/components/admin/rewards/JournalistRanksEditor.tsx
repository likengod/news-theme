import { Award, Save } from "lucide-react";
import { type JournalistRank } from "@/lib/journalist-ranks";

type Props = {
  ranks: JournalistRank[];
  onChangeField: (id: string, field: "minNews" | "pointsPerNews", val: number) => void;
  onSave: () => void;
};

export function JournalistRanksEditor({ ranks, onChangeField, onSave }: Props) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <Award className="h-5 w-5 text-amber-600" />
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800">
              Journalist Rank Tier Points Scale
            </h2>
            <p className="text-xs text-slate-500">
              Configure points per article published at each journalist rank
            </p>
          </div>
        </div>
        <button
          onClick={onSave}
          className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800"
        >
          <Save className="h-4 w-4" /> Save Rank Scale
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {ranks.map((r) => (
          <div key={r.id} className="rounded-lg border border-slate-200 bg-slate-50/50 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-slate-900">{r.name} Rank</span>
              <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800 uppercase">
                Tier
              </span>
            </div>

            <div>
              <label className="mb-1 block text-xs text-slate-500">Articles Required</label>
              <input
                type="number"
                value={r.minNews}
                onChange={(e) => onChangeField(r.id, "minNews", Number(e.target.value))}
                className="h-9 w-full rounded-md border border-slate-200 bg-white px-3 text-sm focus:border-slate-900 focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs text-slate-500">Points / Published Article</label>
              <input
                type="number"
                value={r.pointsPerNews}
                onChange={(e) => onChangeField(r.id, "pointsPerNews", Number(e.target.value))}
                className="h-9 w-full rounded-md border border-slate-200 bg-white px-3 text-sm font-bold text-amber-700 focus:border-slate-900 focus:outline-none"
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
