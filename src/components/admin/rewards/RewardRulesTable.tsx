import { Plus, Pencil, Trash2 } from "lucide-react";
import type { RewardGroup, RecurringReward, OneTimeReward } from "@/lib/rewards";

type Props = {
  currentGroup: RewardGroup;
  onAddRecurring: () => void;
  onEditRecurring: (item: RecurringReward) => void;
  onDeleteRecurring: (id: string) => void;
  onAddOneTime: () => void;
  onEditOneTime: (item: OneTimeReward) => void;
  onDeleteOneTime: (id: string) => void;
};

export function RewardRulesTable({
  currentGroup,
  onAddRecurring,
  onEditRecurring,
  onDeleteRecurring,
  onAddOneTime,
  onEditOneTime,
  onDeleteOneTime,
}: Props) {
  return (
    <div className="space-y-6">
      {/* Recurring Tasks */}
      <section className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/60 px-5 py-3">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600">Recurring Reward Tasks</h3>
            <p className="text-[11px] text-slate-500">Daily or per-action rewards for users</p>
          </div>
          <button
            onClick={onAddRecurring}
            className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-800"
          >
            <Plus className="h-3.5 w-3.5" /> Add Task
          </button>
        </div>
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-100 bg-slate-50/40 text-xs font-bold uppercase text-slate-500">
            <tr>
              <th className="px-5 py-3">Task Title</th>
              <th className="px-5 py-3">Reward Amount</th>
              <th className="px-5 py-3">Daily Cap</th>
              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {currentGroup.recurring.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                <td className="px-5 py-3 font-semibold text-slate-900">{item.title}</td>
                <td className="px-5 py-3 text-emerald-700 font-medium">{item.reward}</td>
                <td className="px-5 py-3 text-slate-600">{item.cap}</td>
                <td className="px-5 py-3 text-right">
                  <div className="inline-flex gap-1.5">
                    <button
                      onClick={() => onEditRecurring(item)}
                      className="inline-flex items-center gap-1 rounded-md border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50"
                    >
                      <Pencil className="h-3 w-3" /> Edit
                    </button>
                    <button
                      onClick={() => onDeleteRecurring(item.id)}
                      className="inline-flex items-center gap-1 rounded-md border border-red-200 bg-red-50 px-2.5 py-1 text-xs font-medium text-red-600 hover:bg-red-100"
                    >
                      <Trash2 className="h-3 w-3" /> Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {currentGroup.recurring.length === 0 && (
              <tr>
                <td colSpan={4} className="px-5 py-6 text-center text-xs text-slate-400">
                  No recurring reward tasks defined yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>

      {/* One Time Tasks */}
      <section className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/60 px-5 py-3">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600">One-Time Bonus Tasks</h3>
            <p className="text-[11px] text-slate-500">Signup and social follow bonus points</p>
          </div>
          <button
            onClick={onAddOneTime}
            className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-800"
          >
            <Plus className="h-3.5 w-3.5" /> Add Task
          </button>
        </div>
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-100 bg-slate-50/40 text-xs font-bold uppercase text-slate-500">
            <tr>
              <th className="px-5 py-3">Task Title</th>
              <th className="px-5 py-3">Points Awarded</th>
              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {currentGroup.oneTime.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                <td className="px-5 py-3 font-semibold text-slate-900">{item.title}</td>
                <td className="px-5 py-3 text-amber-700 font-bold">+{item.points} pts</td>
                <td className="px-5 py-3 text-right">
                  <div className="inline-flex gap-1.5">
                    <button
                      onClick={() => onEditOneTime(item)}
                      className="inline-flex items-center gap-1 rounded-md border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50"
                    >
                      <Pencil className="h-3 w-3" /> Edit
                    </button>
                    <button
                      onClick={() => onDeleteOneTime(item.id)}
                      className="inline-flex items-center gap-1 rounded-md border border-red-200 bg-red-50 px-2.5 py-1 text-xs font-medium text-red-600 hover:bg-red-100"
                    >
                      <Trash2 className="h-3 w-3" /> Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {currentGroup.oneTime.length === 0 && (
              <tr>
                <td colSpan={3} className="px-5 py-6 text-center text-xs text-slate-400">
                  No one-time tasks defined yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
}
