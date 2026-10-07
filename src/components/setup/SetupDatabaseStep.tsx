import React from "react";
import { Database, Loader2, Eye, EyeOff } from "lucide-react";

interface DbConfig {
  host: string;
  port: string;
  user: string;
  password: string;
  database: string;
}

interface SetupDatabaseStepProps {
  dbConfig: DbConfig;
  handleDbChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  showDbPwd: boolean;
  setShowDbPwd: (val: boolean) => void;
  testing: boolean;
  handleTestConnection: () => void;
}

export function SetupDatabaseStep({
  dbConfig,
  handleDbChange,
  showDbPwd,
  setShowDbPwd,
  testing,
  handleTestConnection,
}: SetupDatabaseStepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-white flex items-center gap-2">
          <Database className="h-5 w-5 text-amber-500" /> Connect Database
        </h3>
        <p className="mt-1 text-xs text-slate-400">
          Input connection credentials for your MySQL instance. If the database does not exist, we
          will try to create it.
        </p>
      </div>

      <div className="grid grid-cols-6 gap-4">
        <div className="col-span-4 space-y-1">
          <label className="text-xs font-semibold text-slate-300">MySQL Host</label>
          <input
            name="host"
            value={dbConfig.host}
            onChange={handleDbChange}
            className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-amber-500"
          />
        </div>
        <div className="col-span-2 space-y-1">
          <label className="text-xs font-semibold text-slate-300">Port</label>
          <input
            name="port"
            value={dbConfig.port}
            onChange={handleDbChange}
            className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="col-span-6 sm:col-span-3 space-y-1">
          <label className="text-xs font-semibold text-slate-300">Database User</label>
          <input
            name="user"
            value={dbConfig.user}
            onChange={handleDbChange}
            className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-amber-500"
          />
        </div>
        <div className="col-span-6 sm:col-span-3 space-y-1">
          <label className="text-xs font-semibold text-slate-300">Database Password</label>
          <div className="relative">
            <input
              type={showDbPwd ? "text" : "password"}
              name="password"
              value={dbConfig.password}
              onChange={handleDbChange}
              className="w-full bg-slate-900 border border-slate-700 rounded-md pl-3 pr-10 py-2 text-sm text-slate-100 focus:outline-none focus:border-amber-500"
            />
            <button
              type="button"
              onClick={() => setShowDbPwd(!showDbPwd)}
              className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-200"
            >
              {showDbPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <div className="col-span-6 space-y-1">
          <label className="text-xs font-semibold text-slate-300">Database Name</label>
          <input
            name="database"
            value={dbConfig.database}
            onChange={handleDbChange}
            className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-amber-500"
          />
        </div>
      </div>

      <div className="pt-4 border-t border-slate-700 flex justify-end">
        <button
          onClick={handleTestConnection}
          disabled={testing}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-900 rounded-md font-bold text-sm transition disabled:opacity-50"
        >
          {testing && <Loader2 className="h-4 w-4 animate-spin" />}
          Test &amp; Continue
        </button>
      </div>
    </div>
  );
}
