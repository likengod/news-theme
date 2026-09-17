import React from "react";
import { Smartphone, Monitor, Tablet, Globe, MapPin } from "lucide-react";

export function DemographicsTab() {
  const devices = [
    { name: "Mobile Phones", pct: 68, count: "58,400", icon: Smartphone, color: "bg-indigo-600" },
    { name: "Desktop & Laptops", pct: 26, count: "22,300", icon: Monitor, color: "bg-blue-500" },
    { name: "Tablets & iPads", pct: 6, count: "5,150", icon: Tablet, color: "bg-teal-500" },
  ];

  const locations = [
    { name: "Tripura (Agartala, Dharmanagar, Udaipur)", users: "42,800", pct: 51 },
    { name: "Assam (Guwahati, Silchar)", users: "18,200", pct: 22 },
    { name: "West Bengal (Kolkata)", users: "11,500", pct: 14 },
    { name: "Delhi NCR", users: "6,300", pct: 8 },
    { name: "International (US, UK, UAE, BD)", users: "4,100", pct: 5 },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Device Breakdown */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs">
        <h3 className="text-base font-bold text-slate-900 dark:text-white">
          Device & Platform Breakdown
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
              Reader Locations & Geography
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Top geographic territories reading Northeast Timeline.
            </p>
          </div>
          <MapPin className="h-5 w-5 text-indigo-500" />
        </div>

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
      </div>
    </div>
  );
}
