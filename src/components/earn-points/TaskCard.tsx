import { Check, Clock } from "lucide-react";
import type { PendingClaim } from "@/lib/pending-claims";

type TaskCardProps = {
  title: string;
  pointsLabel: string;
  icon: React.ReactNode;
  done: boolean;
  pending?: PendingClaim | null;
  progressText?: string;
  claimable?: boolean;
  onClaim: () => void;
  actionLabel?: string;
};

export function TaskCard({ title, pointsLabel, icon, done, pending, progressText, claimable = true, onClaim, actionLabel = "Claim" }: TaskCardProps) {
  const isPending = pending?.status === "pending";
  const isRejected = pending?.status === "rejected";
  const isApproved = pending?.status === "approved";

  const cardCls = done || isApproved
    ? "border-emerald-200 bg-emerald-50/60 dark:bg-emerald-950/20"
    : isPending
    ? "border-amber-200 bg-amber-50/40"
    : isRejected
    ? "border-red-200 bg-red-50/40"
    : "border-border bg-card hover:shadow-sm";

  return (
    <div className={`flex items-center justify-between gap-3 rounded-xl border p-4 transition-all ${cardCls}`}>
      <div className="flex items-center gap-3 min-w-0">
        <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-full ${
          done || isApproved ? "bg-emerald-600 text-white" : isPending ? "bg-amber-100 text-amber-700" : "bg-muted"
        }`}>
          {done || isApproved ? <Check className="h-5 w-5" /> : isPending ? <Clock className="h-5 w-5" /> : icon}
        </span>
        <div className="min-w-0">
          <p className="text-sm font-semibold truncate">{title}</p>
          <p className="text-xs text-emerald-700 dark:text-emerald-400">{pointsLabel}</p>
          {isPending && <p className="text-[11px] text-amber-600 font-medium mt-0.5">⏳ Under review — submitted as <em>{pending.handle}</em></p>}
          {isRejected && <p className="text-[11px] text-red-600 font-medium mt-0.5">❌ Rejected — please resubmit with correct handle</p>}
          {progressText && !done && <p className="text-[11px] text-slate-500">{progressText}</p>}
        </div>
      </div>

      {done || isApproved ? (
        <span className="shrink-0 rounded-full bg-emerald-100 px-3 py-1 text-[11px] font-bold uppercase text-emerald-700">Claimed</span>
      ) : isPending ? (
        <span className="shrink-0 rounded-full bg-amber-100 px-3 py-1 text-[11px] font-bold uppercase text-amber-700 flex items-center gap-1">
          <Clock className="h-3 w-3" /> Pending
        </span>
      ) : (
        <button
          type="button"
          onClick={onClaim}
          disabled={!claimable}
          className={`shrink-0 rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${
            claimable
              ? "bg-emerald-600 text-white hover:bg-emerald-700"
              : "bg-slate-100 text-slate-400 cursor-not-allowed"
          }`}
        >
          {isRejected ? "Resubmit" : actionLabel}
        </button>
      )}
    </div>
  );
}

type DailyCardProps = {
  title: string;
  reward: string;
  cap: string;
  icon: React.ReactNode;
};

export function DailyTaskCard({ title, reward, cap, icon }: DailyCardProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="mb-2 flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-full bg-amber-100 text-amber-700">
          {icon}
        </span>
        <p className="text-sm font-semibold">{title}</p>
      </div>
      <p className="text-xs text-muted-foreground">Reward</p>
      <p className="text-sm font-bold text-emerald-700">{reward}</p>
      <p className="mt-1 text-[11px] uppercase tracking-wider text-muted-foreground">Cap: {cap}</p>
    </div>
  );
}
