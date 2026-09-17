import React from "react";

interface ChannelItem {
  name: string;
  count: number;
  pct: number;
  color: string;
  barClass: string;
}

export function TrafficChannelsCard() {
  const channels: ChannelItem[] = [
    { name: "Organic Search", count: 1320, pct: 25, color: "#7c3aed", barClass: "bg-purple-600" },
    { name: "Email", count: 987, pct: 20, color: "#3b82f6", barClass: "bg-blue-500" },
    { name: "Referral", count: 2010, pct: 30, color: "#0d9488", barClass: "bg-teal-600" },
    { name: "Social", count: 654, pct: 15, color: "#10b981", barClass: "bg-emerald-500" },
    { name: "Direct", count: 420, pct: 10, color: "#94a3b8", barClass: "bg-slate-400" },
  ];

  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs">
      <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
        <h3 className="text-base font-bold text-slate-900 dark:text-white">
          Sessions by Channel
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Acquisition traffic channels driving reader discovery.
        </p>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* SVG Donut Chart (matching reference screenshot) */}
        <div className="md:col-span-5 flex justify-center">
          <div className="relative h-44 w-44">
            <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
              {/* Segment 1: Referral 30% (teal) */}
              <circle
                cx="50"
                cy="50"
                r="36"
                fill="transparent"
                stroke="#0d9488"
                strokeWidth="18"
                strokeDasharray="67.8 158.3"
                strokeDashoffset="0"
              />
              {/* Segment 2: Organic Search 25% (purple) */}
              <circle
                cx="50"
                cy="50"
                r="36"
                fill="transparent"
                stroke="#7c3aed"
                strokeWidth="18"
                strokeDasharray="56.5 169.6"
                strokeDashoffset="-67.8"
              />
              {/* Segment 3: Email 20% (blue) */}
              <circle
                cx="50"
                cy="50"
                r="36"
                fill="transparent"
                stroke="#3b82f6"
                strokeWidth="18"
                strokeDasharray="45.2 180.9"
                strokeDashoffset="-124.3"
              />
              {/* Segment 4: Social 15% (emerald) */}
              <circle
                cx="50"
                cy="50"
                r="36"
                fill="transparent"
                stroke="#10b981"
                strokeWidth="18"
                strokeDasharray="33.9 192.2"
                strokeDashoffset="-169.5"
              />
              {/* Segment 5: Direct 10% (slate) */}
              <circle
                cx="50"
                cy="50"
                r="36"
                fill="transparent"
                stroke="#94a3b8"
                strokeWidth="18"
                strokeDasharray="22.6 203.5"
                strokeDashoffset="-203.4"
              />
            </svg>

            {/* Donut Center Hole */}
            <div className="absolute inset-0 m-auto h-20 w-20 rounded-full bg-white dark:bg-slate-900 flex flex-col items-center justify-center shadow-xs">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total</span>
              <span className="text-sm font-extrabold text-slate-900 dark:text-white">5,391</span>
            </div>
          </div>
        </div>

        {/* Channel Progress Bars (matching reference screenshot) */}
        <div className="md:col-span-7 space-y-3.5">
          {channels.map((ch) => (
            <div key={ch.name}>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  {ch.name}
                </span>
                <span className="text-slate-500 dark:text-slate-400 font-medium">
                  <strong className="text-slate-900 dark:text-white font-bold mr-1">
                    {ch.count.toLocaleString()}
                  </strong>
                  ({ch.pct}%)
                </span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${ch.barClass}`}
                  style={{ width: `${ch.pct * 3.3}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
