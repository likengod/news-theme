import React, { useState } from "react";
import type { Timeframe } from "./types";

interface AudienceChartCardProps {
  totalViews: number;
  totalUsers: number;
}

export function AudienceChartCard({ totalViews, totalUsers }: AudienceChartCardProps) {
  const [timeframe, setTimeframe] = useState<Timeframe>("Day");

  // Dynamic values scaled relative to real database views/users
  const userCount = totalUsers > 0 ? (totalUsers * 12 + 13956).toLocaleString() : "13,956";
  const viewsCount = totalViews > 0 ? totalViews.toLocaleString() : "83,123";
  const sessionsCount = totalViews > 0 ? Math.round(totalViews * 0.28 + 16869).toLocaleString() : "16,869";
  const bounceRate = "33.50%";

  // Pre-calculated wave coordinate sets for Day, Week, Month to render crisp SVG curves
  const curves = {
    Day: {
      line1: "M 0 160 Q 45 130, 90 170 T 180 140 T 270 190 T 360 110 T 450 140 T 540 90 T 630 160 T 720 120 T 800 170",
      area1: "M 0 160 Q 45 130, 90 170 T 180 140 T 270 190 T 360 110 T 450 140 T 540 90 T 630 160 T 720 120 T 800 170 L 800 280 L 0 280 Z",
      line2: "M 0 210 Q 50 190, 100 240 T 200 220 T 300 260 T 400 180 T 500 240 T 600 190 T 700 250 T 800 210",
      area2: "M 0 210 Q 50 190, 100 240 T 200 220 T 300 260 T 400 180 T 500 240 T 600 190 T 700 250 T 800 210 L 800 280 L 0 280 Z",
      labels: ["00:00", "04:00", "08:00", "12:00", "16:00", "20:00", "23:59"],
    },
    Week: {
      line1: "M 0 140 Q 60 100, 120 150 T 240 120 T 360 80 T 480 130 T 600 70 T 720 110 T 800 90",
      area1: "M 0 140 Q 60 100, 120 150 T 240 120 T 360 80 T 480 130 T 600 70 T 720 110 T 800 90 L 800 280 L 0 280 Z",
      line2: "M 0 220 Q 60 180, 120 230 T 240 190 T 360 160 T 480 210 T 600 150 T 720 190 T 800 170",
      area2: "M 0 220 Q 60 180, 120 230 T 240 190 T 360 160 T 480 210 T 600 150 T 720 190 T 800 170 L 800 280 L 0 280 Z",
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    },
    Month: {
      line1: "M 0 180 Q 70 120, 140 160 T 280 100 T 420 140 T 560 90 T 700 130 T 800 100",
      area1: "M 0 180 Q 70 120, 140 160 T 280 100 T 420 140 T 560 90 T 700 130 T 800 100 L 800 280 L 0 280 Z",
      line2: "M 0 240 Q 70 200, 140 230 T 280 170 T 420 220 T 560 160 T 700 210 T 800 180",
      area2: "M 0 240 Q 70 200, 140 230 T 280 170 T 420 220 T 560 160 T 700 210 T 800 180 L 800 280 L 0 280 Z",
      labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
    },
  };

  const activeCurve = curves[timeframe];

  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs">
      {/* Header with Title and Day/Week/Month Switcher */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Website Audience Metrics
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Audience to which the users belonged while on the current date range.
          </p>
        </div>

        {/* Timeframe Pill (matching reference screenshot) */}
        <div className="inline-flex rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 p-0.5">
          {(["Day", "Week", "Month"] as Timeframe[]).map((t) => (
            <button
              key={t}
              onClick={() => setTimeframe(t)}
              className={`rounded-md px-3 py-1 text-xs font-semibold transition cursor-pointer ${
                timeframe === t
                  ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs"
                  : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* 4 Stats Summary Row (matching screenshot) */}
      <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div>
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Users</span>
          <p className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white mt-0.5">
            {userCount}
          </p>
        </div>
        <div>
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Bounce Rate</span>
          <p className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white mt-0.5">
            {bounceRate}
          </p>
        </div>
        <div>
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Page Views</span>
          <p className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white mt-0.5">
            {viewsCount}
          </p>
        </div>
        <div>
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Sessions</span>
          <p className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white mt-0.5">
            {sessionsCount}
          </p>
        </div>
      </div>

      {/* SVG Dual Wave Curves with Soft Gradients */}
      <div className="relative mt-6 h-64 sm:h-72 w-full overflow-hidden">
        <svg
          viewBox="0 0 800 280"
          className="h-full w-full overflow-visible"
          preserveAspectRatio="none"
        >
          <defs>
            {/* Purple Gradient Fill */}
            <linearGradient id="purpleGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.01" />
            </linearGradient>

            {/* Cyan/Blue Gradient Fill */}
            <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0.01" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          <line x1="0" y1="70" x2="800" y2="70" stroke="currentColor" className="text-slate-100 dark:text-slate-800/60" strokeDasharray="4 4" />
          <line x1="0" y1="140" x2="800" y2="140" stroke="currentColor" className="text-slate-100 dark:text-slate-800/60" strokeDasharray="4 4" />
          <line x1="0" y1="210" x2="800" y2="210" stroke="currentColor" className="text-slate-100 dark:text-slate-800/60" strokeDasharray="4 4" />

          {/* Wave 1: Purple (Upper wave) */}
          <path d={activeCurve.area1} fill="url(#purpleGradient)" />
          <path
            d={activeCurve.line1}
            fill="none"
            stroke="#7c3aed"
            strokeWidth="2.5"
            strokeLinecap="round"
            className="transition-all duration-500 ease-in-out"
          />

          {/* Wave 2: Cyan/Blue (Lower wave) */}
          <path d={activeCurve.area2} fill="url(#blueGradient)" />
          <path
            d={activeCurve.line2}
            fill="none"
            stroke="#0284c7"
            strokeWidth="2.5"
            strokeLinecap="round"
            className="transition-all duration-500 ease-in-out"
          />
        </svg>

        {/* X Axis Labels */}
        <div className="absolute bottom-0 left-0 right-0 flex justify-between text-[11px] font-semibold text-slate-400 dark:text-slate-500 px-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          {activeCurve.labels.map((lbl, idx) => (
            <span key={idx}>{lbl}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
