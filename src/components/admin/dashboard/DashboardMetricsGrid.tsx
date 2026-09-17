import React from "react";
import { Newspaper, UserCheck, Crown, TrendingUp, IndianRupee, ArrowUpRight, ArrowDownRight } from "lucide-react";
import type { DashboardData } from "./types";

interface DashboardMetricsGridProps {
  data: DashboardData;
}

export function DashboardMetricsGrid({ data }: DashboardMetricsGridProps) {
  const currency = data.currencySymbol || "₹";

  const cards = [
    {
      id: "posts",
      title: "Total Post Number",
      value: data.totalArticles.toLocaleString(),
      subtitle: "Published news stories & articles",
      delta: "+14.2%",
      isPositive: true,
      icon: Newspaper,
      badgeColor: "bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300 border-blue-200/60 dark:border-blue-800",
      accentBg: "from-blue-500/10 to-indigo-500/5",
    },
    {
      id: "journalists",
      title: "Total Journalists",
      value: data.totalJournalists.toLocaleString(),
      subtitle: "Verified field reporters & authors",
      delta: "+8.5%",
      isPositive: true,
      icon: UserCheck,
      badgeColor: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border-emerald-200/60 dark:border-emerald-800",
      accentBg: "from-emerald-500/10 to-teal-500/5",
    },
    {
      id: "subscribers",
      title: "Total Subscribed Users",
      value: data.totalSubscribers.toLocaleString(),
      subtitle: "Active premium paid readers",
      delta: "+22.8%",
      isPositive: true,
      icon: Crown,
      badgeColor: "bg-amber-50 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300 border-amber-200/60 dark:border-amber-800",
      accentBg: "from-amber-500/10 to-orange-500/5",
    },
    {
      id: "revenue",
      title: "Total Revenue",
      value: `${currency}${data.totalRevenue.toLocaleString()}`,
      subtitle: "Subscriptions & media earnings",
      delta: "+18.4%",
      isPositive: true,
      icon: TrendingUp,
      badgeColor: "bg-purple-50 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300 border-purple-200/60 dark:border-purple-800",
      accentBg: "from-purple-500/10 to-pink-500/5",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((c) => {
        const Icon = c.icon;
        return (
          <div
            key={c.id}
            className={`relative overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs transition hover:shadow-md bg-gradient-to-br ${c.accentBg}`}
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  {c.title}
                </p>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                    {c.value}
                  </span>
                </div>
              </div>
              <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl border ${c.badgeColor}`}>
                <Icon className="h-5 w-5" />
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between border-t border-slate-100 dark:border-slate-800/80 pt-3 text-xs">
              <span className="text-slate-500 dark:text-slate-400 truncate max-w-[170px]">
                {c.subtitle}
              </span>
              <span
                className={`inline-flex items-center font-bold ${
                  c.isPositive ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
                }`}
              >
                {c.isPositive ? <ArrowUpRight className="h-3.5 w-3.5 mr-0.5" /> : <ArrowDownRight className="h-3.5 w-3.5 mr-0.5" />}
                {c.delta}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
