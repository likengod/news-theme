import React from "react";
import { Download, Calendar, Filter } from "lucide-react";
import { toast } from "sonner";
import type { CategoryStat } from "./types";

interface DashboardHeaderProps {
  startDate: string;
  endDate: string;
  selectedCategory: string;
  categoryStats: CategoryStat[];
  onStartDateChange: (val: string) => void;
  onEndDateChange: (val: string) => void;
  onCategoryChange: (val: string) => void;
  onExport: () => void;
}

export function DashboardHeader({
  startDate,
  endDate,
  selectedCategory,
  categoryStats,
  onStartDateChange,
  onEndDateChange,
  onCategoryChange,
  onExport,
}: DashboardHeaderProps) {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between pb-2">
      {/* Title & Greeting */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          Hi, welcome back!
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Your web analytics and newsroom performance dashboard.
        </p>
      </div>

      {/* Date Range & Controls (matching reference design) */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Start Date */}
        <div className="flex flex-col rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-1.5 shadow-2xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
            Start Date
          </span>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800 dark:text-slate-200">
            <Calendar className="h-3 w-3 text-slate-600 dark:text-slate-300" />
            <input
              type="date"
              value={startDate}
              onChange={(e) => onStartDateChange(e.target.value)}
              className="bg-transparent text-xs font-semibold focus:outline-none cursor-pointer"
            />
          </div>
        </div>

        {/* End Date */}
        <div className="flex flex-col rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-1.5 shadow-2xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
            End Date
          </span>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800 dark:text-slate-200">
            <Calendar className="h-3 w-3 text-slate-600 dark:text-slate-300" />
            <input
              type="date"
              value={endDate}
              onChange={(e) => onEndDateChange(e.target.value)}
              className="bg-transparent text-xs font-semibold focus:outline-none cursor-pointer"
            />
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex flex-col rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-1.5 shadow-2xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
            Category
          </span>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800 dark:text-slate-200">
            <Filter className="h-3 w-3 text-slate-600 dark:text-slate-300" />
            <select
              value={selectedCategory}
              onChange={(e) => onCategoryChange(e.target.value)}
              className="bg-transparent text-xs font-semibold focus:outline-none cursor-pointer"
            >
              <option value="All">All Categories</option>
              {categoryStats.map((c) => (
                <option key={c.name} value={c.name}>
                  {c.name} ({c.count})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Export Button */}
        <button
          onClick={onExport}
          className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 px-4 py-2.5 text-xs font-bold text-white shadow-sm transition active:scale-95 cursor-pointer"
        >
          <Download className="h-3.5 w-3.5" />
          <span>Export</span>
        </button>
      </div>
    </div>
  );
}
