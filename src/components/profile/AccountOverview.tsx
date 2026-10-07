import { Link } from "@tanstack/react-router";
import { User, Crown, Award } from "lucide-react";
import { ROLE_COLOR, ROLE_LABEL, RANK_COLOR } from "./constants";

interface AccountOverviewProps {
  isPremium: boolean;
  points: number;
  roles: string[];
  isJournalist: boolean;
  currentRank: any;
  articlesPublished: number;
  nextRankObj: any;
  progressPct: number;
  ranks: any;
  profile: any;
}

export function AccountOverview({
  isPremium,
  points,
  roles,
  isJournalist,
  currentRank,
  articlesPublished,
  nextRankObj,
  progressPct,
  ranks,
  profile,
}: AccountOverviewProps) {
  return (
    <div>
      <div className="border-b border-slate-100 bg-slate-50 px-6 py-4">
        <h2 className="text-base font-bold text-slate-900">Account Overview</h2>
        <p className="text-xs text-slate-500 mt-0.5">Your membership summary and status</p>
      </div>
      <div className="p-6 space-y-6">
        {/* Account type */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-slate-100 p-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Account Type
            </span>
            <div className="mt-2 flex items-center gap-2">
              {isPremium ? (
                <Crown className="h-5 w-5 text-amber-500" />
              ) : (
                <User className="h-5 w-5 text-slate-400" />
              )}
              <span className="text-lg font-bold text-slate-900">
                {isPremium ? "Premium" : "Free"}
              </span>
            </div>
            {!isPremium && (
              <Link
                to="/subscription"
                className="mt-3 inline-flex items-center gap-1 text-xs text-amber-600 hover:underline font-medium"
              >
                <Crown className="h-3 w-3" /> Upgrade now
              </Link>
            )}
          </div>
          <div className="rounded-lg border border-slate-100 p-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Wallet Balance
            </span>
            <div className="mt-2 flex items-center gap-2">
              <span className="text-2xl font-bold text-emerald-600">₹{points}</span>
            </div>
            <Link
              to="/withdraw-points"
              className="mt-3 inline-flex items-center gap-1 text-xs text-emerald-600 hover:underline font-medium"
            >
              Withdraw points →
            </Link>
          </div>
        </div>

        {/* Roles */}
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Roles
          </span>
          <div className="mt-2 flex flex-wrap gap-2">
            {roles.map((r) => (
              <span
                key={r}
                className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${ROLE_COLOR[r] ?? ROLE_COLOR.reader}`}
              >
                {ROLE_LABEL[r] ?? r}
              </span>
            ))}
          </div>
        </div>

        {/* Journalist rank (only if journalist) */}
        {isJournalist && (
          <div className="rounded-lg border border-blue-100 bg-blue-50 p-4">
            <div className="flex items-center gap-2 mb-3">
              <Award className="h-5 w-5 text-blue-600" />
              <span className="text-sm font-bold text-blue-900">Journalist Rank</span>
            </div>
            {currentRank ? (
              <>
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-bold ring-1 ${RANK_COLOR[currentRank.id] ?? RANK_COLOR.bronze}`}
                  >
                    {currentRank.name}
                  </span>
                  <span className="text-xs text-slate-500">
                    {articlesPublished} articles published
                  </span>
                </div>
                {nextRankObj && (
                  <>
                    <div className="h-2 w-full rounded-full bg-blue-100 overflow-hidden">
                      <div
                        className="h-2 rounded-full bg-blue-500 transition-all"
                        style={{ width: `${progressPct}%` }}
                      />
                    </div>
                    <p className="mt-1.5 text-xs text-blue-700">
                      {nextRankObj.minNews - articlesPublished} more articles to reach{" "}
                      <strong>{nextRankObj.name}</strong>
                    </p>
                  </>
                )}
                <p className="mt-2 text-xs text-slate-500">
                  Earning <strong>{currentRank.pointsPerNews} pts</strong> per published article at
                  this rank
                </p>
              </>
            ) : (
              <p className="text-sm text-slate-600">
                Publish <strong>{ranks[0]?.minNews ?? 100}</strong> articles to earn your first rank
                badge.
                <br />
                <span className="text-xs text-slate-400">{articlesPublished} published so far</span>
              </p>
            )}
          </div>
        )}

        {/* Journalist ID */}
        {isJournalist && profile?.journalist_id && (
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Journalist ID
            </span>
            <code className="mt-1 block font-mono text-slate-800 text-sm font-semibold tracking-widest">
              {profile.journalist_id}
            </code>
          </div>
        )}

        {/* Member since */}
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Member Since
          </span>
          <p className="mt-1 text-sm font-medium text-slate-700">
            {profile?.created_at
              ? new Date(profile.created_at).toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })
              : "—"}
          </p>
        </div>
      </div>
    </div>
  );
}
