import { useMemo, useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Gift, Award } from "lucide-react";
import { toast } from "sonner";
import {
  loadRewards,
  saveRewards,
  getRewardsServer,
  newRecurring,
  newOneTime,
  NON_EARNING_ROLES,
  type RewardGroup,
  type RecurringReward,
  type OneTimeReward,
} from "@/lib/rewards";
import { loadRoles } from "@/lib/roles";
import {
  loadRanks,
  saveRanks,
  getJournalistRanksServer,
  type JournalistRank,
} from "@/lib/journalist-ranks";
import {
  loadAllPendingClaims,
  getPendingClaimsServer,
  updateClaimStatus,
  type PendingClaim,
} from "@/lib/pending-claims";
import { RewardRulesTable } from "@/components/admin/rewards/RewardRulesTable";
import { JournalistRanksEditor } from "@/components/admin/rewards/JournalistRanksEditor";
import { SocialLinksEditor } from "@/components/admin/rewards/SocialLinksEditor";
import { PendingClaimsTable } from "@/components/admin/rewards/PendingClaimsTable";
import { Modal, SaveBar } from "@/components/admin/rewards/RewardEditorModal";

export const Route = createFileRoute("/admin/rewards")({
  component: RewardsPage,
});

function RewardsPage() {
  const [groups, setGroups] = useState<RewardGroup[]>(() => loadRewards());
  const [active, setActive] = useState<string>("all");
  const [ranksList, setRanksList] = useState<JournalistRank[]>(() => loadRanks());
  const [claims, setClaims] = useState<PendingClaim[]>(() => loadAllPendingClaims());

  useEffect(() => {
    // Sync from MySQL server on mount
    getRewardsServer().then((r) => setGroups(r)).catch(() => {});
    getJournalistRanksServer().then((r) => setRanksList(r)).catch(() => {});
    getPendingClaimsServer().then((c) => setClaims(c)).catch(() => {});
  }, []);

  const persist = (next: RewardGroup[]) => {
    setGroups(next);
    saveRewards(next);
  };

  const handleUpdateRankField = (id: string, field: "minNews" | "pointsPerNews", val: number) => {
    const next = ranksList.map((r) => (r.id === id ? { ...r, [field]: val } : r));
    setRanksList(next);
  };

  const handleSaveRanks = () => {
    saveRanks(ranksList);
    toast.success("Journalist ranks points scale saved to MySQL!");
  };

  const handleApproveClaim = (claim: PendingClaim) => {
    updateClaimStatus(claim.userId, claim.id, "approved");
    toast.success(`Claim approved! Awarded +${claim.points} pts to user in MySQL`);
    setClaims((prev) =>
      prev.map((c) => (c.id === claim.id ? { ...c, status: "approved" } : c))
    );
  };

  const handleRejectClaim = (claim: PendingClaim) => {
    updateClaimStatus(claim.userId, claim.id, "rejected");
    toast.success("Claim rejected");
    setClaims((prev) =>
      prev.map((c) => (c.id === claim.id ? { ...c, status: "rejected" } : c))
    );
  };

  const current = groups.find((g) => g.roleId === active) ?? groups[0];

  const updateCurrent = (patch: Partial<RewardGroup>) => {
    persist(groups.map((g) => (g.roleId === current.roleId ? { ...g, ...patch } : g)));
  };

  // Modals state
  const [recEdit, setRecEdit] = useState<RecurringReward | null>(null);
  const [recIsNew, setRecIsNew] = useState(false);
  const [oneEdit, setOneEdit] = useState<OneTimeReward | null>(null);
  const [oneIsNew, setOneIsNew] = useState(false);

  const saveRecurring = () => {
    if (!recEdit || !recEdit.title.trim()) return toast.error("Title is required");
    const list = current.recurring;
    const next = recIsNew
      ? [...list, recEdit]
      : list.map((r) => (r.id === recEdit.id ? recEdit : r));
    updateCurrent({ recurring: next });
    toast.success(recIsNew ? "Task added" : "Task updated");
    setRecEdit(null);
  };

  const deleteRecurring = (id: string) => {
    updateCurrent({ recurring: current.recurring.filter((r) => r.id !== id) });
    toast.success("Task removed");
  };

  const saveOneTime = () => {
    if (!oneEdit || !oneEdit.title.trim()) return toast.error("Title is required");
    const list = current.oneTime;
    const next = oneIsNew
      ? [...list, oneEdit]
      : list.map((r) => (r.id === oneEdit.id ? oneEdit : r));
    updateCurrent({ oneTime: next });
    toast.success(oneIsNew ? "Task added" : "Task updated");
    setOneEdit(null);
  };

  const deleteOneTime = (id: string) => {
    updateCurrent({ oneTime: current.oneTime.filter((r) => r.id !== id) });
    toast.success("Task removed");
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Rewards & Points Rules</h1>
          <p className="text-sm text-slate-500">
            Define earning rules per user role, journalist rank scales, and review social proof claims.
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-lg bg-amber-50 border border-amber-200 px-3 py-1.5 text-xs font-bold text-amber-800">
          <Gift className="h-4 w-4 text-amber-600" /> MySQL Points Engine Active
        </div>
      </div>

      {/* Journalist Ranks Tier Editor */}
      <JournalistRanksEditor
        ranks={ranksList}
        onChangeField={handleUpdateRankField}
        onSave={handleSaveRanks}
      />

      {/* Social Links Editor */}
      <SocialLinksEditor />

      {/* Role Tabs for Reward Rules */}
      <section className="space-y-4">
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-2">
          {groups.map((g) => (
            <button
              key={g.roleId}
              onClick={() => setActive(g.roleId)}
              className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition ${
                active === g.roleId
                  ? "bg-slate-900 text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {g.label}
            </button>
          ))}
        </div>

        {/* Selected Role Rules */}
        <RewardRulesTable
          currentGroup={current}
          onAddRecurring={() => {
            setRecEdit(newRecurring());
            setRecIsNew(true);
          }}
          onEditRecurring={(item) => {
            setRecEdit({ ...item });
            setRecIsNew(false);
          }}
          onDeleteRecurring={deleteRecurring}
          onAddOneTime={() => {
            setOneEdit(newOneTime());
            setOneIsNew(true);
          }}
          onEditOneTime={(item) => {
            setOneEdit({ ...item });
            setOneIsNew(false);
          }}
          onDeleteOneTime={deleteOneTime}
        />
      </section>

      {/* Pending User Claims Table */}
      <PendingClaimsTable
        claims={claims}
        onApprove={handleApproveClaim}
        onReject={handleRejectClaim}
      />

      {/* Recurring Task Modal */}
      {recEdit && (
        <Modal title={recIsNew ? "Add Recurring Task" : "Edit Recurring Task"} onClose={() => setRecEdit(null)}>
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-600">Task Title</label>
            <input
              type="text"
              value={recEdit.title}
              onChange={(e) => setRecEdit({ ...recEdit, title: e.target.value })}
              placeholder="e.g. Share news article"
              className="h-9 w-full rounded-md border border-slate-200 px-3 text-sm focus:border-slate-900 focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-600">Reward Text</label>
            <input
              type="text"
              value={recEdit.reward}
              onChange={(e) => setRecEdit({ ...recEdit, reward: e.target.value })}
              placeholder="e.g. ₹0.20 per share"
              className="h-9 w-full rounded-md border border-slate-200 px-3 text-sm focus:border-slate-900 focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-600">Daily Cap</label>
            <input
              type="text"
              value={recEdit.cap}
              onChange={(e) => setRecEdit({ ...recEdit, cap: e.target.value })}
              placeholder="e.g. up to ₹1 / day"
              className="h-9 w-full rounded-md border border-slate-200 px-3 text-sm focus:border-slate-900 focus:outline-none"
            />
          </div>
          <SaveBar onSave={saveRecurring} onCancel={() => setRecEdit(null)} />
        </Modal>
      )}

      {/* One-Time Task Modal */}
      {oneEdit && (
        <Modal title={oneIsNew ? "Add One-Time Task" : "Edit One-Time Task"} onClose={() => setOneEdit(null)}>
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-600">Task Title</label>
            <input
              type="text"
              value={oneEdit.title}
              onChange={(e) => setOneEdit({ ...oneEdit, title: e.target.value })}
              placeholder="e.g. Subscribe to YouTube Channel"
              className="h-9 w-full rounded-md border border-slate-200 px-3 text-sm focus:border-slate-900 focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-600">Points Awarded</label>
            <input
              type="number"
              value={oneEdit.points}
              onChange={(e) => setOneEdit({ ...oneEdit, points: Number(e.target.value) || 0 })}
              className="h-9 w-full rounded-md border border-slate-200 px-3 text-sm font-bold text-amber-700 focus:border-slate-900 focus:outline-none"
            />
          </div>
          <SaveBar onSave={saveOneTime} onCancel={() => setOneEdit(null)} />
        </Modal>
      )}
    </div>
  );
}
