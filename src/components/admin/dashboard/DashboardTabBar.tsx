import React from "react";
import { FileText, Printer, Mail, Bookmark } from "lucide-react";
import { toast } from "sonner";
import type { DashboardTab } from "./types";

interface DashboardTabBarProps {
  activeTab: DashboardTab;
  onTabChange: (tab: DashboardTab) => void;
  onSaveReport?: () => void;
  onExportPdf?: () => void;
  onSendEmail?: () => void;
}

export function DashboardTabBar({
  activeTab,
  onTabChange,
  onSaveReport,
  onExportPdf,
  onSendEmail,
}: DashboardTabBarProps) {
  const tabs: Array<{ id: DashboardTab; label: string }> = [
    { id: "overview", label: "Overview" },
    { id: "audiences", label: "Audiences" },
    { id: "demographics", label: "Demographics" },
    { id: "content", label: "Content & Posts" },
    { id: "revenue", label: "Revenue & Subscriptions" },
  ];

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
      {/* Tab Navigation */}
      <div className="flex items-center gap-6 overflow-x-auto scrollbar-none">
        {tabs.map((t) => {
          const isActive = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => onTabChange(t.id)}
              className={`relative py-2 text-sm font-semibold whitespace-nowrap transition cursor-pointer ${
                isActive
                  ? "text-indigo-600 dark:text-indigo-400 font-bold"
                  : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
              }`}
            >
              {t.label}
              {isActive && (
                <span className="absolute bottom-[-9px] left-0 right-0 h-0.5 rounded-full bg-indigo-600 dark:bg-indigo-400" />
              )}
            </button>
          );
        })}
      </div>

      {/* Action Links (matching screenshot) */}
      <div className="flex items-center gap-4 text-xs font-semibold text-slate-600 dark:text-slate-300">
        <button
          onClick={() => {
            if (onSaveReport) onSaveReport();
            else toast.success("Dashboard report saved to reports archive!");
          }}
          className="inline-flex items-center gap-1.5 hover:text-indigo-600 dark:hover:text-indigo-400 transition cursor-pointer"
        >
          <Bookmark className="h-3.5 w-3.5" />
          <span>Save Report</span>
        </button>

        <button
          onClick={() => {
            if (onExportPdf) onExportPdf();
            else {
              window.print();
              toast.success("Printing report to PDF...");
            }
          }}
          className="inline-flex items-center gap-1.5 hover:text-indigo-600 dark:hover:text-indigo-400 transition cursor-pointer"
        >
          <FileText className="h-3.5 w-3.5" />
          <span>Export to PDF</span>
        </button>

        <button
          onClick={() => {
            if (onSendEmail) onSendEmail();
            else toast.success("Summary report queued for email dispatch!");
          }}
          className="inline-flex items-center gap-1.5 hover:text-indigo-600 dark:hover:text-indigo-400 transition cursor-pointer"
        >
          <Mail className="h-3.5 w-3.5" />
          <span>Send to Email</span>
        </button>
      </div>
    </div>
  );
}
