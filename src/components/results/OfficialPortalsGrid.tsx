import React from "react";
import { Building2, ExternalLink } from "lucide-react";

export function OfficialPortalsGrid() {
  return (
    <div className="mt-12 border-t border-slate-200 dark:border-slate-800 pt-8 print:hidden">
      <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
        <Building2 className="h-4 w-4 text-red-600" />
        <span>ত্রিপুরা শিক্ষা ও ফলাফল অফিশিয়াল পোর্টালসমূহ (Official Portals)</span>
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
        <a
          href="https://tbse.tripura.gov.in"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between rounded-lg border border-slate-200 dark:border-slate-800 p-3 hover:border-red-500 hover:bg-muted/50 transition group"
        >
          <div>
            <span className="font-bold block text-slate-900 dark:text-white group-hover:text-red-600">TBSE Portal</span>
            <span className="text-[11px] text-slate-400">tbse.tripura.gov.in</span>
          </div>
          <ExternalLink className="h-3.5 w-3.5 text-slate-400 group-hover:text-red-600" />
        </a>

        <a
          href="https://tripurauniv.ac.in"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between rounded-lg border border-slate-200 dark:border-slate-800 p-3 hover:border-red-500 hover:bg-muted/50 transition group"
        >
          <div>
            <span className="font-bold block text-slate-900 dark:text-white group-hover:text-red-600">Tripura University</span>
            <span className="text-[11px] text-slate-400">tripurauniv.ac.in</span>
          </div>
          <ExternalLink className="h-3.5 w-3.5 text-slate-400 group-hover:text-red-600" />
        </a>

        <a
          href="https://mbbuniversity.ac.in"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between rounded-lg border border-slate-200 dark:border-slate-800 p-3 hover:border-red-500 hover:bg-muted/50 transition group"
        >
          <div>
            <span className="font-bold block text-slate-900 dark:text-white group-hover:text-red-600">MBB University</span>
            <span className="text-[11px] text-slate-400">mbbuniversity.ac.in</span>
          </div>
          <ExternalLink className="h-3.5 w-3.5 text-slate-400 group-hover:text-red-600" />
        </a>

        <a
          href="https://digilocker.gov.in"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between rounded-lg border border-slate-200 dark:border-slate-800 p-3 hover:border-red-500 hover:bg-muted/50 transition group"
        >
          <div>
            <span className="font-bold block text-slate-900 dark:text-white group-hover:text-red-600">DigiLocker</span>
            <span className="text-[11px] text-slate-400">Verified Certificates</span>
          </div>
          <ExternalLink className="h-3.5 w-3.5 text-slate-400 group-hover:text-red-600" />
        </a>
      </div>
    </div>
  );
}
