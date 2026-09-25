import { useMemo, useState, useEffect } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Gift, Award, Lock } from "lucide-react";
import { toast } from "sonner";
import { useSiteSettings } from "@/components/site/AdSettingsContext";
import { isEnterprisePlusLicense } from "@/lib/site-content";
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
  const navigate = useNavigate();
  const s = useSiteSettings();
  const isEnterprisePlus = isEnterprisePlusLicense(s);

  useEffect(() => {
    if (!isEnterprisePlus) {
      toast.error("Rewards & Points feature is exclusively available on Enterprise Plus licenses.");
      navigate({ to: "/admin", replace: true });
    }
  }, [isEnterprisePlus, navigate]);

  const [groups, setGroups] = useState<RewardGroup[]>(() => loadRewards());
  const [active, setActive] = useState<string>("all");
  const [ranksList, setRanksList] = useState<JournalistRank[]>(() => loadRanks());
  const [claims, setClaims] = useState<PendingClaim[]>(() => loadAllPendingClaims());

  useEffect(() => {
    if (!isEnterprisePlus) return;
    // Sync from MySQL server on mount
    getRewardsServer()
      .then((r) => setGroups(r))
      .catch(() => {});
    getJournalistRanksServer()
      .then((r) => setRanksList(r))
      .catch(() => {});
    getPendingClaimsServer()
      .then((c) => setClaims(c))
      .catch(() => {});
  }, [isEnterprisePlus]);

  if (!isEnterprisePlus) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 mb-4">
          <Lock className="h-8 w-8 text-slate-400" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">Enterprise Plus Feature Locked</h2>
        <p className="text-slate-500 max-w-md mb-6">
          The Rewards & Points Engine is exclusively available on Enterprise Plus licenses. Please upgrade your license to unlock this feature.
        </p>
        <Link
          to="/admin/settings"
          search={{ tab: "activate" }}
          className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-5 py-2.5 text-xs font-semibold text-white hover:bg-slate-800 transition"
        >
          Activate Website
        </Link>
      </div>
    );
  }

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
    toast.success("Saved successfully");
  };

  const handleApproveClaim = (claim: PendingClaim) => {
    updateClaimStatus(claim.userId, claim.id, "approved");
    toast.success(`Claim approved! Awarded +${claim.points} pts`);
    setClaims((prev) => prev.map((c) => (c.id === claim.id ? { ...c, status: "approved" } : c)));
  };

  const handleRejectClaim = (claim: PendingClaim) => {
    updateClaimStatus(claim.userId, claim.id, "rejected");
    toast.success("Claim rejected");
    setClaims((prev) => prev.map((c) => (c.id === claim.id ? { ...c, status: "rejected" } : c)));
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
            Define earning rules per user role, journalist rank scales, and review social proof
            claims.
          </p>
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
        <Modal
          title={recIsNew ? "Add Recurring Task" : "Edit Recurring Task"}
          onClose={() => setRecEdit(null)}
        >
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
        <Modal
          title={oneIsNew ? "Add One-Time Task" : "Edit One-Time Task"}
          onClose={() => setOneEdit(null)}
        >
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
            <label className="mb-1 block text-xs font-semibold text-slate-600">
              Points Awarded
            </label>
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
