import { ShieldCheck, ShieldOff, Lock, BarChart2, Award, Wallet } from "lucide-react";
import { roleBadgeClass } from "@/lib/roles";
import type { JournalistLookup, JournalistPrivateStats } from "@/lib/journalist.functions";

interface JournalistStatsProps {
  result: Extract<JournalistLookup, { found: true }>;
  privateStats: JournalistPrivateStats | null;
  isEnterprisePlus: boolean;
}

export function JournalistStats({ result, privateStats, isEnterprisePlus }: JournalistStatsProps) {
  return (
    <>
      {result.active ? (
        <div className="mx-auto max-w-2xl mb-6 rounded-2xl border border-emerald-200 bg-emerald-50/90 p-4 shadow-xs text-left">
          <div className="flex items-center gap-3.5">
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-emerald-600 text-white shadow-xs">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-bold text-emerald-950">
                  Officially Verified Journalist
                </span>
                <span className="inline-flex items-center rounded-full bg-emerald-600 px-2.5 py-0.5 text-[10px] font-semibold text-white">
                  Accredited
                </span>
                {privateStats?.authorized && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-700/10 border border-emerald-700/20 px-2 py-0.5 text-[10px] font-bold text-emerald-900">
                    <Lock className="h-3 w-3 text-emerald-700" /> Authorized View
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Authorized Journalist & Admin Performance & Wallet Metrics */}
          {privateStats?.authorized && (
            <div className="mt-3 pt-2.5 border-t border-emerald-200/90">
              <div className="flex flex-wrap items-center justify-between gap-1 mb-2">
                <div className="flex items-center gap-1.5">
                  <BarChart2 className="h-3.5 w-3.5 text-emerald-800" />
                  <span className="text-[11px] font-bold text-emerald-950">
                    {isEnterprisePlus ? "Reporter Metrics & Wallet Status" : "Reporter Performance Metrics"}
                  </span>
                </div>
                <span className="text-[9px] font-medium text-emerald-800/80">
                  (Visible only to this journalist &amp; editorial admin)
                </span>
              </div>

              <div className={`grid grid-cols-2 ${isEnterprisePlus ? "sm:grid-cols-5" : "sm:grid-cols-4"} gap-1.5 text-center`}>
                {/* Published Last Month */}
                <div className="rounded-lg border border-emerald-200/70 bg-white/95 px-2 py-1.5 shadow-2xs">
                  <span className="block text-[9px] font-semibold text-slate-500">
                    Last Month
                  </span>
                  <span className="mt-0.5 block text-sm font-bold text-emerald-700">
                    {privateStats.publishedLastMonth}
                  </span>
                  <span className="text-[7.5px] text-slate-500 font-medium">News Published</span>
                </div>

                {/* Published Last Year */}
                <div className="rounded-lg border border-emerald-200/70 bg-white/95 px-2 py-1.5 shadow-2xs">
                  <span className="block text-[9px] font-semibold text-slate-500">
                    Last Year
                  </span>
                  <span className="mt-0.5 block text-sm font-bold text-slate-900">
                    {privateStats.publishedLastYear}
                  </span>
                  <span className="text-[7.5px] text-slate-500 font-medium">News Published</span>
                </div>

                {/* Total News Published */}
                <div className="rounded-lg border border-emerald-200/70 bg-white/95 px-2 py-1.5 shadow-2xs">
                  <span className="block text-[9px] font-semibold text-slate-500">
                    Total Published
                  </span>
                  <span className="mt-0.5 block text-sm font-bold text-slate-900">
                    {privateStats.publishedTotal}
                  </span>
                  <span className="text-[7.5px] text-slate-500 font-medium">Total News</span>
                </div>

                {/* Rank */}
                <div className="rounded-lg border border-emerald-200/70 bg-white/95 px-2 py-1.5 shadow-2xs">
                  <span className="block text-[9px] font-semibold text-slate-500">
                    Rank
                  </span>
                  <div className="mt-0.5 flex items-center justify-center">
                    <span className={`inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[9.5px] font-semibold border ${roleBadgeClass(privateStats.rankColor)}`}>
                      <Award className="h-2.5 w-2.5" />
                      {privateStats.rankName}
                    </span>
                  </div>
                  <span className="text-[7.5px] text-slate-500 block mt-0.5 font-medium">
                    +{privateStats.rankPointsPerNews} pts/news
                  </span>
                </div>

                {/* Wallet (Only when website license is Enterprise Plus) */}
                {isEnterprisePlus && (
                  <div className="col-span-2 sm:col-span-1 rounded-lg border border-amber-200/80 bg-white/95 px-2 py-1.5 shadow-2xs">
                    <span className="block text-[9px] font-semibold text-amber-900">
                      Wallet
                    </span>
                    <div className="mt-0.5 flex items-center justify-center gap-1 text-sm font-bold text-amber-700">
                      <Wallet className="h-3 w-3 text-amber-600" />
                      <span>{privateStats.walletPoints}</span>
                    </div>
                    <span className="text-[7.5px] text-amber-800/80 font-medium">Reward Points</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="mx-auto max-w-2xl mb-6 rounded-2xl border border-red-200 bg-red-50/90 p-4 shadow-xs text-left">
          <div className="flex items-center gap-3.5">
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-red-600 text-white shadow-xs">
              <ShieldOff className="h-6 w-6" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-bold text-red-950">
                  Journalist Account Suspended
                </span>
                {privateStats?.authorized && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-red-700/10 border border-red-700/20 px-2 py-0.5 text-[10px] font-bold text-red-900">
                    <Lock className="h-3 w-3 text-red-700" /> Authorized View
                  </span>
                )}
              </div>
              <p className="mt-0.5 text-xs text-red-800 leading-relaxed">
                The credentials for <strong className="font-bold text-red-950">{result.displayName}</strong> are currently inactive or suspended. This reporter is not authorized to publish or report on behalf of News Theme.
              </p>
            </div>
          </div>

          {/* Authorized Performance & Wallet Overview even if suspended */}
          {privateStats?.authorized && (
            <div className="mt-3 pt-2.5 border-t border-red-200/90">
              <div className="flex flex-wrap items-center justify-between gap-1 mb-2">
                <div className="flex items-center gap-1.5">
                  <BarChart2 className="h-3.5 w-3.5 text-red-800" />
                  <span className="text-[11px] font-bold text-red-950">
                    {isEnterprisePlus ? "Reporter Metrics & Wallet Status" : "Reporter Performance Metrics"}
                  </span>
                </div>
                <span className="text-[9px] font-medium text-red-800/80">
                  (Visible only to this journalist &amp; editorial admin)
                </span>
              </div>
              <div className={`grid grid-cols-2 ${isEnterprisePlus ? "sm:grid-cols-5" : "sm:grid-cols-4"} gap-1.5 text-center`}>
                <div className="rounded-lg border border-red-200 bg-white/95 px-2 py-1.5">
                  <span className="block text-[9px] font-semibold text-slate-500">Last Month</span>
                  <span className="mt-0.5 block text-sm font-bold text-red-700">{privateStats.publishedLastMonth}</span>
                  <span className="text-[7.5px] text-slate-500 font-medium">News Published</span>
                </div>
                <div className="rounded-lg border border-red-200 bg-white/95 px-2 py-1.5">
                  <span className="block text-[9px] font-semibold text-slate-500">Last Year</span>
                  <span className="mt-0.5 block text-sm font-bold text-slate-900">{privateStats.publishedLastYear}</span>
                  <span className="text-[7.5px] text-slate-500 font-medium">News Published</span>
                </div>
                <div className="rounded-lg border border-red-200 bg-white/95 px-2 py-1.5">
                  <span className="block text-[9px] font-semibold text-slate-500">Total Published</span>
                  <span className="mt-0.5 block text-sm font-bold text-slate-900">{privateStats.publishedTotal}</span>
                  <span className="text-[7.5px] text-slate-500 font-medium">Total News</span>
                </div>
                <div className="rounded-lg border border-red-200 bg-white/95 px-2 py-1.5">
                  <span className="block text-[9px] font-semibold text-slate-500">Rank</span>
                  <div className="mt-0.5 flex items-center justify-center">
                    <span className={`inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[9.5px] font-semibold border ${roleBadgeClass(privateStats.rankColor)}`}>
                      <Award className="h-2.5 w-2.5" />
                      {privateStats.rankName}
                    </span>
                  </div>
                  <span className="text-[7.5px] text-slate-500 block mt-0.5 font-medium">+{privateStats.rankPointsPerNews} pts/news</span>
                </div>
                {isEnterprisePlus && (
                  <div className="col-span-2 sm:col-span-1 rounded-lg border border-red-200 bg-white/95 px-2 py-1.5">
                    <span className="block text-[9px] font-semibold text-slate-700">Wallet</span>
                    <div className="mt-0.5 flex items-center justify-center gap-1 text-sm font-bold text-amber-700">
                      <Wallet className="h-3 w-3 text-amber-600" />
                      <span>{privateStats.walletPoints}</span>
                    </div>
                    <span className="text-[7.5px] text-amber-800/80 font-medium">Reward Points</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
