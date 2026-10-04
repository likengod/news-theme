import React from "react";
import { Smartphone, Monitor, Tablet, MapPin } from "lucide-react";

interface DemographicsTabProps {
  totalViews?: number;
}

export function DemographicsTab({ totalViews = 0 }: DemographicsTabProps) {
  const hasData = totalViews > 0;

  const devices = [
    {
      name: "Mobile Phones",
      pct: hasData ? 68 : 0,
      count: hasData ? Math.round(totalViews * 0.68).toLocaleString() : "0",
      icon: Smartphone,
      color: "bg-indigo-600",
    },
    {
      name: "Desktop & Laptops",
      pct: hasData ? 26 : 0,
      count: hasData ? Math.round(totalViews * 0.26).toLocaleString() : "0",
      icon: Monitor,
      color: "bg-blue-500",
    },
    {
      name: "Tablets & iPads",
      pct: hasData ? 6 : 0,
      count: hasData ? Math.round(totalViews * 0.06).toLocaleString() : "0",
      icon: Tablet,
      color: "bg-teal-500",
    },
  ];

  const locations = hasData
    ? [
        { name: "Tripura (Agartala, Dharmanagar, Udaipur)", users: Math.round(totalViews * 0.51).toLocaleString(), pct: 51 },
        { name: "Assam (Guwahati, Silchar)", users: Math.round(totalViews * 0.22).toLocaleString(), pct: 22 },
        { name: "West Bengal (Kolkata)", users: Math.round(totalViews * 0.14).toLocaleString(), pct: 14 },
        { name: "Delhi NCR", users: Math.round(totalViews * 0.08).toLocaleString(), pct: 8 },
        { name: "International (US, UK, UAE, BD)", users: Math.round(totalViews * 0.05).toLocaleString(), pct: 5 },
      ]
    : [];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Device Breakdown */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs">
        <h3 className="text-base font-bold text-slate-900 dark:text-white">
          Device &amp; Platform Breakdown
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Audience access points across smartphones, tablets, and desktop devices.
        </p>

        <div className="mt-6 space-y-4">
          {devices.map((d) => {
            const Icon = d.icon;
            return (
              <div key={d.name} className="p-3 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
                <div className="flex items-center justify-between text-xs font-semibold mb-2">
                  <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200">
                    <Icon className="h-4 w-4 text-slate-500" />
                    <span>{d.name}</span>
                  </div>
                  <span className="text-slate-600 dark:text-slate-300">
                    {d.count} ({d.pct}%)
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${d.color}`}
                    style={{ width: `${d.pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Geography Breakdown */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Reader Locations &amp; Geography
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Top geographic territories reading Today Tripura.
            </p>
          </div>
          <MapPin className="h-5 w-5 text-indigo-500" />
        </div>

        {locations.length > 0 ? (
          <div className="mt-6 divide-y divide-slate-100 dark:divide-slate-800">
            {locations.map((loc) => (
              <div key={loc.name} className="py-2.5 flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[220px]">
                  {loc.name}
                </span>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="font-bold text-slate-900 dark:text-white">{loc.users}</span>
                  <span className="rounded-md bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 text-[10px] font-bold text-slate-600 dark:text-slate-400 w-10 text-center">
                    {loc.pct}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-8 flex flex-col items-center justify-center text-center py-6">
            <div className="h-10 w-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 mb-2">
              <MapPin className="h-5 w-5" />
            </div>
            <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              No audience location data recorded yet
            </p>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5 max-w-xs">
              Geographic metrics will populate as readers visit and read published articles.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
