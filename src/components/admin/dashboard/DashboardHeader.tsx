import React from "react";
import { Download, Calendar, Clock, ChevronDown } from "lucide-react";

export type DatePreset = "all" | "24h" | "7d" | "30d" | "6m" | "1y" | "custom";

interface DashboardHeaderProps {
  preset: DatePreset;
  onPresetChange: (preset: DatePreset) => void;
  startDate: string;
  endDate: string;
  onStartDateChange: (val: string) => void;
  onEndDateChange: (val: string) => void;
  onResetDates?: () => void;
  onExport: () => void;
}

export function DashboardHeader({
  preset,
  onPresetChange,
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  onResetDates,
  onExport,
}: DashboardHeaderProps) {
  const isDateFiltered = preset !== "all";

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

      {/* Date Range & Controls */}
      <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
        {/* Preset Filter Dropdown */}
        <div className="flex flex-col rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-1.5 shadow-2xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Time Range
          </span>
          <div className="relative flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400 shrink-0 pointer-events-none" />
            <select
              value={preset}
              onChange={(e) => onPresetChange(e.target.value as DatePreset)}
              className="bg-transparent text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none cursor-pointer appearance-none pr-5 py-0.5"
            >
              <option value="all" className="bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-100">All Time (Default)</option>
              <option value="24h" className="bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-100">Last 24 Hours</option>
              <option value="7d" className="bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-100">Last 7 Days</option>
              <option value="30d" className="bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-100">Last 30 Days</option>
              <option value="6m" className="bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-100">Last 6 Months</option>
              <option value="1y" className="bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-100">Last 12 Months (1 Year)</option>
              <option value="custom" className="bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-100">Custom Date Range</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-0 h-3 w-3 text-slate-400" />
          </div>
        </div>

        {/* Custom Start & End Date Pickers (Shown if Custom or specific dates are active) */}
        {preset === "custom" && (
          <div className="flex flex-wrap items-center gap-2 animate-in fade-in duration-150">
            {/* Start Date */}
            <div className="flex flex-col rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-1.5 shadow-2xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Start Date
              </span>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800 dark:text-slate-200">
                <Calendar className="h-3 w-3 text-slate-500 shrink-0" />
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => onStartDateChange(e.target.value)}
                  className="bg-transparent text-xs font-semibold focus:outline-none cursor-pointer"
                />
              </div>
            </div>

            {/* End Date */}
            <div className="flex flex-col rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-1.5 shadow-2xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                End Date
              </span>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800 dark:text-slate-200">
                <Calendar className="h-3 w-3 text-slate-500 shrink-0" />
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => onEndDateChange(e.target.value)}
                  className="bg-transparent text-xs font-semibold focus:outline-none cursor-pointer"
                />
              </div>
            </div>
          </div>
        )}

        {/* Optional Reset Filter button if changed */}
        {isDateFiltered && onResetDates && (
          <button
            type="button"
            onClick={onResetDates}
            className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition cursor-pointer shadow-2xs"
            title="Reset to All Time"
          >
            Reset
          </button>
        )}

        {/* Export Button */}
        <button
          type="button"
          onClick={onExport}
          className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 px-4 py-2.5 text-xs font-bold text-white shadow-sm transition active:scale-95 cursor-pointer"
        >
          <Download className="h-3.5 w-3.5" />
          <span>Export CSV</span>
        </button>
      </div>
    </div>
  );
}
