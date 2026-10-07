import React from "react";
import { Server, ShieldAlert, Loader2 } from "lucide-react";

interface DbConfig {
  host: string;
  port: string;
  user: string;
  database: string;
}

interface AdminConfig {
  displayName: string;
  email: string;
}

interface SetupReviewStepProps {
  dbConfig: DbConfig;
  adminConfig: AdminConfig;
  installing: boolean;
  onBack: () => void;
  onRunSetup: () => void;
}

export function SetupReviewStep({
  dbConfig,
  adminConfig,
  installing,
  onBack,
  onRunSetup,
}: SetupReviewStepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-white flex items-center gap-2">
          <Server className="h-5 w-5 text-amber-500" /> Review &amp; Initialize
        </h3>
        <p className="mt-1 text-xs text-slate-400">
          Everything is configured. Clicking install will create the tables, seed initial
          categories, and set up your administrator credentials.
        </p>
      </div>

      <div className="bg-slate-900 border border-slate-700/80 rounded-lg p-4 space-y-3">
        <div className="text-xs space-y-1.5 text-slate-300">
          <div className="flex justify-between border-b border-slate-800 pb-1.5">
            <span className="text-slate-400">Database:</span>
            <span className="font-mono text-amber-400">{dbConfig.database}</span>
          </div>
          <div className="flex justify-between border-b border-slate-800 pb-1.5">
            <span className="text-slate-400">MySQL Host:</span>
            <span className="font-mono">
              {dbConfig.host}:{dbConfig.port}
            </span>
          </div>
          <div className="flex justify-between border-b border-slate-800 pb-1.5">
            <span className="text-slate-400">Database User:</span>
            <span className="font-mono">{dbConfig.user}</span>
          </div>
          <div className="flex justify-between border-b border-slate-800 pb-1.5">
            <span className="text-slate-400">Super Admin Name:</span>
            <span>{adminConfig.displayName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Super Admin Email:</span>
            <span className="font-mono text-amber-400">{adminConfig.email}</span>
          </div>
        </div>
      </div>

      <div className="bg-amber-500/10 border border-amber-500/20 rounded-md p-3 flex items-start gap-2.5">
        <ShieldAlert className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
        <p className="text-xs text-amber-300 leading-relaxed">
          The installation process will write a <code>db-config.json</code> file to the application
          root. Make sure this file is not committed publicly.
        </p>
      </div>

      <div className="pt-4 border-t border-slate-700 flex justify-between">
        <button
          onClick={onBack}
          disabled={installing}
          className="px-4 py-2 border border-slate-600 rounded-md text-sm font-semibold text-slate-300 hover:bg-slate-700 disabled:opacity-50"
        >
          Back
        </button>
        <button
          onClick={onRunSetup}
          disabled={installing}
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-900 rounded-md font-bold text-sm transition disabled:opacity-50"
        >
          {installing && <Loader2 className="h-4 w-4 animate-spin" />}
          {installing ? "Installing System..." : "Complete Installation"}
        </button>
      </div>
    </div>
  );
}
