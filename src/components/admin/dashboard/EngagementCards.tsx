import React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

interface EngagementCardsProps {
  totalUsers: number;
  totalViews: number;
}

export function EngagementCards({ totalUsers, totalViews }: EngagementCardsProps) {
  // Format total users for top card (e.g. 86k or scaled)
  const usersDisplay = totalUsers > 0 ? (totalUsers >= 1000 ? `${(totalUsers / 1000).toFixed(1)}k` : `${totalUsers}`) : "86k";
  const sessionsDisplay = totalViews > 0 ? Math.round(totalViews * 0.28 + 16869).toLocaleString() : "16,869";

  return (
    <div className="flex flex-col gap-4">
      {/* Top 2 Mini Cards (Side by side on tablet/desktop) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Card 1: Bounce Rate */}
        <div className="flex flex-col justify-between rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-xs overflow-hidden">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                33.50%
              </span>
              <span className="inline-flex items-center text-xs font-bold text-emerald-600 dark:text-emerald-400 gap-0.5">
                <TrendingUp className="h-3.5 w-3.5" /> 18.02%
              </span>
            </div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">
              Bounce Rate
            </p>
          </div>

          {/* Mini Sparkline Chart (Teal) */}
          <div className="mt-4 h-16 w-full">
            <svg viewBox="0 0 200 60" className="h-full w-full" preserveAspectRatio="none">
              <defs>
                <linearGradient id="tealSpark" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#14b8a6" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#14b8a6" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <path
                d="M 0 35 Q 25 20, 50 45 T 100 25 T 150 40 T 200 15 L 200 60 L 0 60 Z"
                fill="url(#tealSpark)"
              />
              <path
                d="M 0 35 Q 25 20, 50 45 T 100 25 T 150 40 T 200 15"
                fill="none"
                stroke="#0d9488"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>

        {/* Card 2: Total Users */}
        <div className="flex flex-col justify-between rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-xs overflow-hidden">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                {usersDisplay}
              </span>
              <span className="inline-flex items-center text-xs font-bold text-rose-600 dark:text-rose-400 gap-0.5">
                <TrendingDown className="h-3.5 w-3.5" /> 0.86%
              </span>
            </div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">
              Total Users
            </p>
          </div>

          {/* Mini Vertical Bar Chart (Blue bars) */}
          <div className="mt-4 flex items-end justify-between gap-1 h-16 w-full px-1">
            {[45, 60, 35, 75, 50, 90, 65, 80, 70, 85, 40, 55, 30, 70, 95].map((h, i) => (
              <div
                key={i}
                style={{ height: `${h}%` }}
                className="w-full rounded-t-xs bg-blue-500 hover:bg-blue-600 transition-all duration-300"
              />
            ))}
          </div>
        </div>
      </div>

      {/* Middle Card: All Sessions with Histogram Chart */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs">
        <div className="flex items-start justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              ALL SESSIONS
            </span>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                {sessionsDisplay}
              </span>
              <span className="inline-flex items-center text-xs font-bold text-emerald-600 dark:text-emerald-400">
                <TrendingUp className="h-3.5 w-3.5 mr-0.5" /> 2.87%
              </span>
            </div>
          </div>
        </div>

        <p className="mt-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
          The total number of sessions within the date range. It is the period time a user is actively engaged with your website, news feed, or app.
        </p>

        {/* Histogram Distribution Bars (matching reference screenshot) */}
        <div className="mt-4 flex items-end justify-between gap-1.5 h-24 pt-2 border-t border-slate-100 dark:border-slate-800">
          {[15, 25, 45, 70, 90, 65, 80, 55, 75, 40, 60, 85, 95, 70, 50, 30].map((h, i) => {
            const isHigh = h > 60;
            return (
              <div
                key={i}
                style={{ height: `${h}%` }}
                className={`w-full rounded-t-xs transition-all duration-300 ${
                  isHigh ? "bg-indigo-600 hover:bg-indigo-700" : "bg-indigo-200 dark:bg-indigo-900/60 hover:bg-indigo-300"
                }`}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
