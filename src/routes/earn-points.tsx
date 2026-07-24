import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { UserPlus, MessageCircle, Share2, BookOpen, Wallet, Coins, AlertCircle } from "lucide-react";
import { FaFacebookF, FaInstagram, FaYoutube, FaWhatsapp } from "react-icons/fa6";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { authClient as supabase } from "@/lib/auth-client";
import { getUniqueSharesCount, getUniqueReadsCount, getUniqueCommentsCount } from "@/lib/user-actions-tracker";
import { loadRewards, type OneTimeReward, type RecurringReward } from "@/lib/rewards";
import { loadSocialLinks } from "@/lib/social-links";
import { loadAllPendingClaims, getClaimsForUser, upsertClaim, type PendingClaim } from "@/lib/pending-claims";
import { ProofModal, type SocialTaskDef } from "@/components/earn-points/ProofModal";
import { TaskCard, DailyTaskCard } from "@/components/earn-points/TaskCard";

/* ────────────── Route ────────────── */

export const Route = createFileRoute("/earn-points")({
  head: () => ({
    meta: [
      { title: "Earn Points – News Theme Wallet Rewards" },
      { name: "description", content: "Complete tasks and earn wallet points on News Theme. Follow us on social media, share news, and grow your rewards." },
      { property: "og:title", content: "Earn Points – News Theme" },
      { property: "og:description", content: "Complete tasks and earn wallet points on News Theme." },
      { property: "og:type", content: "website" },
    ],
  }),
  component: EarnPointsPage,
});

/* ────────────── Social task definitions (for UI rendering) ────────────── */

const SOCIAL_TASK_META: Record<string, Omit<SocialTaskDef, "id" | "title" | "points">> = {
  fb: {
    platform: "Facebook", icon: FaFacebookF, iconColor: "#1877F2", actionLabel: "Follow",
    hrefKey: "facebook", handleLabel: "Your Facebook profile URL or username", handlePlaceholder: "https://facebook.com/yourname or @yourname",
  },
  yt: {
    platform: "YouTube", icon: FaYoutube, iconColor: "#FF0000", actionLabel: "Subscribe",
    hrefKey: "youtube", handleLabel: "Your YouTube channel URL or username", handlePlaceholder: "https://youtube.com/@yourhandle",
  },
  ig: {
    platform: "Instagram", icon: FaInstagram, iconColor: "#E4405F", actionLabel: "Follow",
    hrefKey: "instagram", handleLabel: "Your Instagram username", handlePlaceholder: "@yourinstagram",
  },
  wa: {
    platform: "WhatsApp", icon: FaWhatsapp, iconColor: "#25D366", actionLabel: "Join",
    hrefKey: "whatsapp", handleLabel: "Your WhatsApp number (for verification)", handlePlaceholder: "+91 98765 43210",
  },
};

const OTHER_TASK_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  signup: UserPlus,
  first_comments: MessageCircle,
  first_shares: Share2,
  first_reads: BookOpen,
};

const DAILY_TASK_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  r_share: Share2, p_share: Share2, share_daily: Share2,
  r_comment: MessageCircle, p_comment: MessageCircle, comment_daily: MessageCircle,
};

/* ────────────── State helpers ────────────── */

const STORAGE = "nt:earn-points:v1";
type State = { completed: Record<string, boolean>; balance: number };

function loadState(userId: string): State {
  if (typeof window === "undefined") return { completed: {}, balance: 0 };
  try { const raw = localStorage.getItem(`${STORAGE}:${userId}`); if (raw) return JSON.parse(raw) as State; } catch {}
  return { completed: {}, balance: 0 };
}
function saveState(userId: string, state: State) {
  localStorage.setItem(`${STORAGE}:${userId}`, JSON.stringify(state));
  localStorage.setItem(`nt:points:${userId}`, String(state.balance));
}

/* ────────────── Main Component ────────────── */

function EarnPointsPage() {
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
    // Read rewards from admin config
    const groups = loadRewards();
    const allGroup = groups.find((g) => g.roleId === "all");
    const readerGroup = groups.find((g) => g.roleId === "reader");

    // Social tasks = one-time tasks from "all" group that match social IDs
    const socialIds = new Set(["fb", "yt", "ig", "wa"]);
    const social = (allGroup?.oneTime ?? []).filter((t) => socialIds.has(t.id));
    const other = (allGroup?.oneTime ?? []).filter((t) => !socialIds.has(t.id));

    setSocialTasks(social);
    setOtherTasks(other);
    setDailyTasks(readerGroup?.recurring ?? []);
  }, []);

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
          const signupTask = otherTasks.find((t) => t.id === "signup") ?? socialTasks.find((t) => t.id === "signup");
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
      id: task.id, userId, userName: userEmail, platform: task.platform,
      handle, submittedAt: new Date().toISOString(), status: "pending", points: task.points,
    });
    setPendingClaims(getClaimsForUser(userId));
    setProofModal(null);
    toast.success(`Submitted! Our team will verify your ${task.platform} follow within 24–48 hours.`);
  };

  const claimOther = (task: OneTimeReward) => {
    if (!userId) { toast.error("Please sign in to claim points"); return; }
    if (state.completed[task.id]) { toast.info("Already claimed"); return; }
    if (task.id === "first_shares" && shareCount < 5) { toast.error(`Share 5 unique articles first. You have ${shareCount} so far.`); return; }
    if (task.id === "first_comments" && commentCount < 5) { toast.error(`Comment on 5 unique articles first. You have ${commentCount} so far.`); return; }
    if (task.id === "first_reads" && readCount < 5) { toast.error(`Read 5 unique articles first. You have ${readCount} so far.`); return; }
    const next: State = { completed: { ...state.completed, [task.id]: true }, balance: state.balance + task.points };
    saveState(userId, next);
    setState(next);
    toast.success(`+${task.points} points added!`);
  };

  const totalAvailable = [...socialTasks, ...otherTasks].reduce((s, t) => s + t.points, 0);

  /* ── Progress helpers ── */
  const getProgress = (id: string) => {
    if (id === "first_shares") return { text: `${shareCount}/5 articles shared`, ok: shareCount >= 5 };
    if (id === "first_comments") return { text: `${commentCount}/5 articles commented`, ok: commentCount >= 5 };
    if (id === "first_reads") return { text: `${readCount}/5 articles read`, ok: readCount >= 5 };
    return { text: "", ok: true };
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header showTicker={false} showBreakingBar={false} />

      <main className="mx-auto max-w-5xl px-4 py-10">
        <header className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Wallet Rewards</p>
          <h1 className="mt-2 font-serif text-4xl font-bold leading-tight">Earn Points</h1>
          <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
            Complete tasks to grow your News Theme wallet. Social media points are credited after admin verification.
          </p>
        </header>

        {/* Wallet card */}
        <section className="mb-10 rounded-2xl border border-border bg-gradient-to-br from-emerald-50 to-white p-6 shadow-sm dark:from-emerald-950/40 dark:to-background">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <span className="grid h-12 w-12 place-items-center rounded-full bg-emerald-600 text-white">
                <Wallet className="h-6 w-6" />
              </span>
              <div>
                <p className="text-xs uppercase tracking-widest text-muted-foreground">Wallet balance</p>
                <p className="text-3xl font-bold text-emerald-700 dark:text-emerald-400">₹{state.balance}</p>
                {userEmail && <p className="text-xs text-muted-foreground">{userEmail}</p>}
              </div>
            </div>
            <div className="flex flex-col items-end gap-2 text-right text-xs text-muted-foreground">
              <div>
                <p>Total one-time rewards available</p>
                <p className="text-lg font-semibold text-foreground">₹{totalAvailable}</p>
              </div>
              <Link to="/withdraw-points" className="rounded-md bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700">
                Withdraw Points →
              </Link>
            </div>
          </div>
          {!userId && (
            <div className="mt-4 rounded-lg border border-dashed border-emerald-300 bg-white/60 p-3 text-sm">
              <Link to="/auth" className="font-semibold text-emerald-700 underline-offset-2 hover:underline">Sign in</Link> to start earning.
            </div>
          )}
        </section>

        {/* Social Tasks */}
        {socialTasks.length > 0 && (
          <section className="mb-10">
            <h2 className="mb-1 flex items-center gap-2 text-xl font-bold">
              <Coins className="h-5 w-5 text-amber-500" /> Social Media Tasks
            </h2>
            <p className="mb-4 text-xs text-slate-500">Points credited after admin verifies your follow. Our team checks within 24–48 hours.</p>
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
                      if (!userId) { toast.error("Sign in to earn points"); return; }
                      const fullTask: SocialTaskDef = { ...meta, id: task.id, title: task.title, points: task.points };
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
                <strong>Why pending verification?</strong> Social platforms do not allow websites to verify follows automatically. Our admins manually check your submitted handle within 24–48 hours.
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
            <li>Click <strong>Follow & Claim</strong> → our page opens + a proof form appears</li>
            <li>Enter your handle/username and confirm you followed</li>
            <li>Our admin team checks your handle within <strong>24–48 hours</strong></li>
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
