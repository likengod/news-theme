import React from "react";
import { Newspaper, Copy, ExternalLink, ShieldCheck as Shield } from "lucide-react";
import { toast } from "sonner";

interface JournalistsHeaderProps {
  isEnterprise: boolean;
}

export function JournalistsHeader({ isEnterprise }: JournalistsHeaderProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight">
          <Newspaper className="h-6 w-6 text-slate-700" /> Journalist
        </h1>
        <p className="text-sm text-slate-500">
          Only users with the <strong>Journalist</strong> role appear here. Each has a unique
          8-character Journalist ID (3 letters + 4 digits + 1 letter, e.g.{" "}
          <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[11px]">ABC1234Z</code>
          ).
        </p>
      </div>

      {/* Right side public form link action */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => {
            const url = `${window.location.origin}/apply-journalist`;
            navigator.clipboard.writeText(url);
            toast.success("Public application form link copied to clipboard!");
          }}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-50 hover:border-slate-400 transition cursor-pointer"
          title="Copy public journalist application link to share anywhere"
        >
          <Copy className="h-3.5 w-3.5 text-slate-500" />
          <span>Copy Public Form Link</span>
        </button>

        <a
          href="/apply-journalist"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3.5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-slate-800 transition cursor-pointer"
          title="Open public journalist application form in a new tab"
        >
          <span>Open Form</span>
          <ExternalLink className="h-3.5 w-3.5" />
        </a>

        {isEnterprise && (
          <a
            href="/verified-journalist"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-50 hover:border-slate-400 transition cursor-pointer"
            title="Open public journalist verification registry in a new tab"
          >
            <Shield className="h-3.5 w-3.5 text-slate-500" />
            <span>Verify Registry</span>
          </a>
        )}
      </div>
    </div>
  );
}
