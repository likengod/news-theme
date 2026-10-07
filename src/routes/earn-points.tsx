import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { Coins, AlertCircle, BookOpen, Share2 } from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { useSiteSettings } from "@/components/site/AdSettingsContext";
import { isEnterprisePlusLicense } from "@/lib/site-content";
import { authClient as supabase } from "@/lib/auth-client";
import {
  getUniqueSharesCount,
  getUniqueReadsCount,
  getUniqueCommentsCount,
} from "@/lib/user-actions-tracker";
import { loadRewards, type OneTimeReward, type RecurringReward } from "@/lib/rewards";
import {
  loadAllPendingClaims,
  getClaimsForUser,
  upsertClaim,
  type PendingClaim,
} from "@/lib/pending-claims";
import { ProofModal, type SocialTaskDef } from "@/components/earn-points/ProofModal";
import { TaskCard, DailyTaskCard } from "@/components/earn-points/TaskCard";
import {
  SOCIAL_TASK_META,
  OTHER_TASK_ICONS,
  DAILY_TASK_ICONS,
} from "@/components/earn-points/taskConstants";
import { EnterpriseLockedView } from "@/components/earn-points/EnterpriseLockedView";
import { WalletSummaryCard } from "@/components/earn-points/WalletSummaryCard";

/* ────────────── Route ────────────── */

export const Route = createFileRoute("/earn-points")({
  head: () => ({
    meta: [
      { title: "Earn Points – News Theme Wallet Rewards" },
      {
        name: "description",
        content:
          "Complete tasks and earn wallet points on News Theme. Follow us on social media, share news, and grow your rewards.",
      },
      { property: "og:title", content: "Earn Points – News Theme" },
      {
        property: "og:description",
        content: "Complete tasks and earn wallet points on News Theme.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: EarnPointsPage,
});

/* ────────────── State helpers ────────────── */

const STORAGE = "nt:earn-points:v1";
type State = { completed: Record<string, boolean>; balance: number };

function loadState(userId: string): State {
  if (typeof window === "undefined") return { completed: {}, balance: 0 };
  try {
    const raw = localStorage.getItem(`${STORAGE}:${userId}`);
    if (raw) return JSON.parse(raw) as State;
  } catch {}
  return { completed: {}, balance: 0 };
}

function saveState(userId: string, state: State) {
  localStorage.setItem(`${STORAGE}:${userId}`, JSON.stringify(state));
  localStorage.setItem(`nt:points:${userId}`, String(state.balance));
}

/* ────────────── Main Component ────────────── */

function EarnPointsPage() {
  const settings = useSiteSettings();
  const isEnterprisePlus = isEnterprisePlusLicense(settings);

  const [userId, setUserId] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [state, setState] = useState<State>({ completed: {}, balance: 0 });
  const [pendingClaims, setPendingClaims] = useState<PendingClaim[]>([]);
  const [shareCount, setShareCount] = useState(0);
  const [commentCount, setCommentCount] = useState(0);
  const [readCount, setReadCount] = useState(0);
  const [proofModal, setProofModal] = useState<SocialTaskDef | null>(null);

  /* ── Load admin-configured rewards ── */
  const [socialTasks, setSocialTasks] = useState<OneTimeReward[]>([]);
  const [otherTasks, setOtherTasks] = useState<OneTimeReward[]>([]);
  const [dailyTasks, setDailyTasks] = useState<RecurringReward[]>([]);

  useEffect(() => {
    if (!isEnterprisePlus) return;

    const groups = loadRewards();
    const allGroup = groups.find((g) => g.roleId === "all");
    const readerGroup = groups.find((g) => g.roleId === "reader");

    const socialIds = new Set(["fb", "yt", "ig", "wa"]);
    const social = (allGroup?.oneTime ?? []).filter((t) => socialIds.has(t.id));
    const other = (allGroup?.oneTime ?? []).filter((t) => !socialIds.has(t.id));

    setSocialTasks(social);
    setOtherTasks(other);
    setDailyTasks(readerGroup?.recurring ?? []);
  }, [isEnterprisePlus]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      const u = data.session?.user;
      if (u) {
        setUserId(u.id);
        setUserEmail(u.email ?? null);
        const loaded = loadState(u.id);
        const existing = Number(localStorage.getItem(`nt:points:${u.id}`) ?? "0");
        if (!loaded.balance && existing) loaded.balance = existing;

        // Auto-grant signup bonus
        if (!loaded.completed.signup) {
          const signupTask =
            otherTasks.find((t) => t.id === "signup") ?? socialTasks.find((t) => t.id === "signup");
          loaded.completed.signup = true;
          loaded.balance += signupTask?.points ?? 25;
        }

        saveState(u.id, loaded);
        setState({ ...loaded });
        setPendingClaims(getClaimsForUser(u.id));
        setShareCount(getUniqueSharesCount(u.id));
        setCommentCount(getUniqueCommentsCount(u.id));
        setReadCount(getUniqueReadsCount(u.id));

        // Auto-approve claims that admin approved
        const allClaims = loadAllPendingClaims();
        const userClaims = allClaims.filter((c) => c.userId === u.id);
        let changed = false;
        const updatedState = { ...loaded };
        userClaims.forEach((c) => {
          if (c.status === "approved" && !updatedState.completed[c.id]) {
            updatedState.completed[c.id] = true;
            updatedState.balance += c.points;
            changed = true;
          }
        });
        if (changed) {
          saveState(u.id, updatedState);
          setState(updatedState);
        }
      }
    });
  }, [socialTasks, otherTasks]);

  const getPending = (taskId: string) => pendingClaims.find((c) => c.id === taskId);

  const submitSocialProof = (task: SocialTaskDef, handle: string) => {
    if (!userId || !userEmail) return;
    upsertClaim({
      id: task.id,
      userId,
      userName: userEmail,
      platform: task.platform,
      handle,
      submittedAt: new Date().toISOString(),
      status: "pending",
      points: task.points,
    });
    setPendingClaims(getClaimsForUser(userId));
    setProofModal(null);
    toast.success(
      `Submitted! Our team will verify your ${task.platform} follow within 24–48 hours.`,
    );
  };

  const claimOther = (task: OneTimeReward) => {
    if (!userId) {
      toast.error("Please sign in to claim points");
      return;
    }
    if (state.completed[task.id]) {
      toast.info("Already claimed");
      return;
    }
    if (task.id === "first_shares" && shareCount < 5) {
      toast.error(`Share 5 unique articles first. You have ${shareCount} so far.`);
      return;
    }
    if (task.id === "first_comments" && commentCount < 5) {
      toast.error(`Comment on 5 unique articles first. You have ${commentCount} so far.`);
      return;
    }
    if (task.id === "first_reads" && readCount < 5) {
      toast.error(`Read 5 unique articles first. You have ${readCount} so far.`);
      return;
    }
    const next: State = {
      completed: { ...state.completed, [task.id]: true },
      balance: state.balance + task.points,
    };
    saveState(userId, next);
    setState(next);
    toast.success(`+${task.points} points added!`);
  };

  const totalAvailable = [...socialTasks, ...otherTasks].reduce((s, t) => s + t.points, 0);

  /* ✨ Progress helpers ✨ */
  const getProgress = (id: string) => {
    if (id === "first_shares")
      return { text: `${shareCount}/5 articles shared`, ok: shareCount >= 5 };
    if (id === "first_comments")
      return { text: `${commentCount}/5 articles commented`, ok: commentCount >= 5 };
    if (id === "first_reads") return { text: `${readCount}/5 articles read`, ok: readCount >= 5 };
    return { text: "", ok: true };
  };

  if (!isEnterprisePlus) {
    return <EnterpriseLockedView />;
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between">
      <Header showTicker={false} showBreakingBar={false} />

      <main className="mx-auto max-w-5xl px-4 py-10 flex-1 w-full">
        <header className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Wallet Rewards
          </p>
          <h1 className="mt-2 font-serif text-4xl font-bold leading-tight">Earn Points</h1>
          <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
            Complete tasks to grow your News Theme wallet. Social media points are credited after
            admin verification.
          </p>
        </header>

        {/* Wallet summary card */}
        <WalletSummaryCard
          balance={state.balance}
          userEmail={userEmail}
          totalAvailable={totalAvailable}
          userId={userId}
        />

        {/* Social Tasks */}
        {socialTasks.length > 0 && (
          <section className="mb-10">
            <h2 className="mb-1 flex items-center gap-2 text-xl font-bold">
              <Coins className="h-5 w-5 text-amber-500" /> Social Media Tasks
            </h2>
            <p className="mb-4 text-xs text-slate-500">
              Points credited after admin verifies your follow. Our team checks within 24–48 hours.
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              {socialTasks.map((task) => {
                const meta = SOCIAL_TASK_META[task.id];
                if (!meta) return null;
                const pending = getPending(task.id);
                const Icon = meta.icon;
                return (
                  <TaskCard
                    key={task.id}
                    title={task.title}
                    pointsLabel={`+${task.points} points`}
                    icon={<Icon className="h-5 w-5" style={{ color: meta.iconColor }} />}
                    done={!!state.completed[task.id]}
                    pending={pending}
                    onClaim={() => {
                      if (!userId) {
                        toast.error("Sign in to earn points");
                        return;
                      }
                      const fullTask: SocialTaskDef = {
                        ...meta,
                        id: task.id,
                        title: task.title,
                        points: task.points,
                      };
                      setProofModal(fullTask);
                    }}
                    actionLabel={`${meta.actionLabel} & Claim`}
                  />
                );
              })}
            </div>

            <div className="mt-4 flex items-start gap-3 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-xs text-blue-800">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <div>
                <strong>Why pending verification?</strong> Social platforms do not allow websites to
                verify follows automatically. Our admins manually check your submitted handle within
                24–48 hours.
              </div>
            </div>
          </section>
        )}

        {/* One-time Tasks */}
        {otherTasks.length > 0 && (
          <section className="mb-12">
            <h2 className="mb-4 flex items-center gap-2 text-xl font-bold">
              <Coins className="h-5 w-5 text-amber-500" /> One-time Tasks
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {otherTasks.map((task) => {
                const Icon = OTHER_TASK_ICONS[task.id] ?? BookOpen;
                const progress = getProgress(task.id);
                return (
                  <TaskCard
                    key={task.id}
                    title={task.title}
                    pointsLabel={`+${task.points} points`}
                    icon={<Icon className="h-5 w-5" />}
                    done={!!state.completed[task.id]}
                    progressText={progress.text}
                    claimable={progress.ok}
                    onClaim={() => claimOther(task)}
                  />
                );
              })}
            </div>
          </section>
        )}

        {/* Daily Tasks */}
        {dailyTasks.length > 0 && (
          <section className="mb-12">
            <h2 className="mb-4 flex items-center gap-2 text-xl font-bold">
              <Coins className="h-5 w-5 text-amber-500" /> Every Day Rewards
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {dailyTasks.map((t) => {
                const Icon = DAILY_TASK_ICONS[t.id] ?? Share2;
                return (
                  <DailyTaskCard
                    key={t.id}
                    title={t.title}
                    reward={t.reward}
                    cap={t.cap}
                    icon={<Icon className="h-5 w-5" />}
                  />
                );
              })}
            </div>
          </section>
        )}

        {/* FAQ */}
        <section className="rounded-xl border border-border bg-muted/30 p-5 text-xs text-muted-foreground">
          <p className="mb-1 font-semibold text-foreground">How social verification works</p>
          <ul className="list-disc space-y-1 pl-5">
            <li>
              Click <strong>Follow & Claim</strong> → our page opens + a proof form appears
            </li>
            <li>Enter your handle/username and confirm you followed</li>
            <li>
              Our admin team checks your handle within <strong>24–48 hours</strong>
            </li>
            <li>Points are credited after approval — you'll see them in your wallet</li>
            <li>Fake submissions permanently ban you from the rewards program</li>
          </ul>
        </section>
      </main>

      <Footer />

      {/* Proof modal */}
      {proofModal && (
        <ProofModal
          task={proofModal}
          onSubmit={(handle) => submitSocialProof(proofModal, handle)}
          onClose={() => setProofModal(null)}
        />
      )}
    </div>
  );
}
