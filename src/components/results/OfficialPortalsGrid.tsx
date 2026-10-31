import React from "react";
import { Building2, ExternalLink, ShieldCheck } from "lucide-react";

export function OfficialPortalsGrid() {
  const portals = [
    {
      title: "Tripura Results NIC",
      bengali: "ত্রিপুরা সরকারের অফিশিয়াল রেজাল্ট সার্ভার",
      url: "https://tripuraresults.nic.in",
      domain: "tripuraresults.nic.in",
      highlight: true,
    },
    {
      title: "TBSE Results Server",
      bengali: "টিবিএসই ফলাফল ও মার্কশিট গেটওয়ে",
      url: "https://tbresults.tripura.gov.in",
      domain: "tbresults.tripura.gov.in",
      highlight: true,
    },
    {
      title: "TBSE Official Board",
      bengali: "ত্রিপুরা মধ্যশিক্ষা পর্ষদ মূল পোর্টাল",
      url: "https://tbse.tripura.gov.in",
      domain: "tbse.tripura.gov.in",
      highlight: false,
    },
    {
      title: "Tripura University",
      bengali: "ত্রিপুরা কেন্দ্রীয় বিশ্ববিদ্যালয় পরীক্ষা পোর্টাল",
      url: "https://tripurauniv.ac.in",
      domain: "tripurauniv.ac.in",
      highlight: false,
    },
    {
      title: "MBB University",
      bengali: "মহারাজা বীর বিক্রম বিশ্ববিদ্যালয়",
      url: "https://mbbuniversity.ac.in",
      domain: "mbbuniversity.ac.in",
      highlight: false,
    },
    {
      title: "DigiLocker Govt Portal",
      bengali: "ডিজিটাল ভেরিফায়েড মার্কশিট ও সার্টিফিকেট",
      url: "https://digilocker.gov.in",
      domain: "digilocker.gov.in",
      highlight: false,
    },
  ];

  return (
    <div className="mt-12 border-t border-border pt-8 print:hidden">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-foreground flex items-center gap-2">
          <Building2 className="h-4 w-4 text-red-600" />
          <span>ত্রিপুরা সরকার ও শিক্ষা বোর্ডের অফিশিয়াল লিংকসমূহ (Official Portals)</span>
        </h3>
        <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
          <ShieldCheck className="h-3.5 w-3.5" />
          সরকারি সার্ভার ভেরিফায়েড
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
        {portals.map((p) => (
          <a
            key={p.url}
            href={p.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center justify-between rounded-xl border p-3.5 transition group ${
              p.highlight
                ? "border-red-200 dark:border-red-900/60 bg-red-50/40 dark:bg-red-950/20 hover:border-red-500 hover:bg-red-50/80 dark:hover:bg-red-950/40"
                : "border-border bg-card hover:border-red-500 hover:bg-muted/50"
            }`}
          >
            <div className="min-w-0 pr-2">
              <span className="font-extrabold block text-foreground group-hover:text-red-600 truncate">
                {p.title}
              </span>
              <span className="text-[11px] text-muted-foreground block truncate">
                {p.bengali}
              </span>
              <span className="text-[10px] font-mono text-red-600/90 dark:text-red-400 block mt-0.5">
                {p.domain}
              </span>
            </div>
            <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-red-600 shrink-0" />
          </a>
        ))}
      </div>
    </div>
  );
}
