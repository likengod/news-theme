import React from "react";
import { Link } from "@tanstack/react-router";
import { AlertTriangle, Rocket } from "lucide-react";

interface AdminUpdatePromptProps {
  firstName: string;
  currentVersion?: string;
  latestVersion?: string;
  onDismiss: () => void;
}

export function AdminUpdatePrompt({
  firstName,
  currentVersion,
  latestVersion,
  onDismiss,
}: AdminUpdatePromptProps) {
  return (
    <div className="flex min-h-[75vh] flex-col items-center justify-center py-12 px-4 text-center">
      <div className="max-w-xl w-full">
        <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-red-100/80 text-red-600">
          <Rocket className="h-10 w-10 animate-bounce" />
        </div>

        <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-red-600 mb-3">
          <AlertTriangle className="h-4 w-4" />
          <span>Update Required</span>
        </div>

        <h1 className="text-3xl font-extrabold text-slate-900 sm:text-4xl tracking-tight">
          Dear <span className="text-red-600">{firstName}</span>,
        </h1>

        <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
          Without update you can't use the website. A new version is available, please
          update website.
        </p>

        <div className="mt-6 flex items-center justify-center gap-3 text-sm font-semibold text-slate-500">
          <span className="font-mono text-slate-700 bg-slate-200/70 px-3 py-1 rounded-full text-xs">
            Current: {currentVersion || "v1.0.55"}
          </span>
          <span>➔</span>
          <span className="font-mono text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full text-xs font-bold">
            Available: {latestVersion || "Latest"}
          </span>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
          <Link
            to="/admin/updates"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-xl bg-red-600 px-7 py-3.5 text-sm font-bold text-white shadow-md hover:bg-red-700 transition active:scale-[0.98]"
          >
            <Rocket className="h-4 w-4" />
            Update Website Now
          </Link>

          <button
            onClick={onDismiss}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition active:scale-[0.98] shadow-sm"
          >
            Continue to Admin Panel
          </button>
        </div>
      </div>
    </div>
  );
}
