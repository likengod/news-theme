import React from "react";
import { Eye, MessageSquare, TrendingUp, Users } from "lucide-react";
import type { DashboardData } from "./types";

interface NewsroomPerformanceCardProps {
  data: DashboardData;
}

export function NewsroomPerformanceCard({ data }: NewsroomPerformanceCardProps) {
  const avgViews = data.totalArticles > 0 ? Math.round(data.totalViews / data.totalArticles) : 0;

  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs">
      <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
        <h3 className="text-base font-bold text-slate-900 dark:text-white">
          Newsroom Engagement &amp; Reach
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Real-time metrics aggregated directly from published stories and user interactions.
        </p>
      </div>

      <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* Total Views */}
        <div className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total Views</span>
            <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
              <Eye className="h-4 w-4" />
            </div>
          </div>
          <p className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            {data.totalViews.toLocaleString()}
          </p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Across all published stories</p>
        </div>

        {/* Avg Views per Article */}
        <div className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Avg. Views / Story</span>
            <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <p className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            {avgViews.toLocaleString()}
          </p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Average story readership</p>
        </div>

        {/* Reader Comments */}
        <div className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Reader Comments</span>
            <div className="p-1.5 rounded-lg bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400">
              <MessageSquare className="h-4 w-4" />
            </div>
          </div>
          <p className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            {data.totalComments.toLocaleString()}
          </p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Verified comments posted</p>
        </div>

        {/* Registered Users */}
        <div className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Registered Community</span>
            <div className="p-1.5 rounded-lg bg-purple-50 text-purple-600 dark:bg-purple-950/60 dark:text-purple-400">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <p className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            {data.totalUsers.toLocaleString()}
          </p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Active platform members</p>
        </div>
      </div>
    </div>
  );
}
