import React from "react";
import type { ReelsConfig } from "@/lib/reels-config";

interface ReelsApiConfigProps {
  cfg: ReelsConfig;
  update: <K extends keyof ReelsConfig>(key: K, value: ReelsConfig[K]) => void;
  testing: boolean;
  onTestApi: () => void;
}

export function ReelsApiConfig({ cfg, update, testing, onTestApi }: ReelsApiConfigProps) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm font-semibold text-slate-900">
          {cfg.provider === "youtube" ? "YouTube Data API" : "Facebook Graph API"}
        </p>
        <button
          onClick={onTestApi}
          disabled={testing}
          className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
        >
          {testing ? "Testing…" : "Test connection"}
        </button>
      </div>

      {cfg.provider === "youtube" ? (
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="sm:col-span-2">
            <span className="mb-1 block text-[11px] font-medium text-slate-500">
              YouTube API Key
            </span>
            <input
              type="password"
              value={cfg.youtube.apiKey}
              onChange={(e) => update("youtube", { ...cfg.youtube, apiKey: e.target.value })}
              placeholder="AIza…"
              className="h-9 w-full rounded-md border border-slate-200 px-3 text-sm focus:border-slate-900 focus:outline-none"
            />
            <span className="mt-1 block text-[11px] text-slate-500">
              Create at console.cloud.google.com → APIs & Services → Credentials. Enable
              "YouTube Data API v3" and restrict the key to your site's domain.
            </span>
          </label>
          <label>
            <span className="mb-1 block text-[11px] font-medium text-slate-500">
              Channel ID
            </span>
            <input
              type="text"
              value={cfg.youtube.channelId}
              onChange={(e) => update("youtube", { ...cfg.youtube, channelId: e.target.value })}
              placeholder="UCxxxxxxxxxxxxxxxxxxxx"
              className="h-9 w-full rounded-md border border-slate-200 px-3 text-sm focus:border-slate-900 focus:outline-none"
            />
          </label>
          <label>
            <span className="mb-1 block text-[11px] font-medium text-slate-500">
              How many to show (1–25)
            </span>
            <input
              type="number"
              min={1}
              max={25}
              value={cfg.youtube.maxResults}
              onChange={(e) =>
                update("youtube", {
                  ...cfg.youtube,
                  maxResults: Math.max(1, Math.min(25, Number(e.target.value) || 8)),
                })
              }
              className="h-9 w-full rounded-md border border-slate-200 px-3 text-sm focus:border-slate-900 focus:outline-none"
            />
          </label>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="sm:col-span-2">
            <span className="mb-1 block text-[11px] font-medium text-slate-500">
              Facebook Page Access Token
            </span>
            <input
              type="password"
              value={cfg.facebook.accessToken}
              onChange={(e) =>
                update("facebook", { ...cfg.facebook, accessToken: e.target.value })
              }
              placeholder="EAAG…"
              className="h-9 w-full rounded-md border border-slate-200 px-3 text-sm focus:border-slate-900 focus:outline-none"
            />
            <span className="mt-1 block text-[11px] text-slate-500">
              Generate a long-lived Page access token in Meta Business Suite / Graph API
              Explorer. Needs the <code>pages_read_engagement</code> permission.
            </span>
          </label>
          <label>
            <span className="mb-1 block text-[11px] font-medium text-slate-500">Page ID</span>
            <input
              type="text"
              value={cfg.facebook.pageId}
              onChange={(e) => update("facebook", { ...cfg.facebook, pageId: e.target.value })}
              placeholder="123456789012345"
              className="h-9 w-full rounded-md border border-slate-200 px-3 text-sm focus:border-slate-900 focus:outline-none"
            />
          </label>
          <label>
            <span className="mb-1 block text-[11px] font-medium text-slate-500">
              How many to show (1–25)
            </span>
            <input
              type="number"
              min={1}
              max={25}
              value={cfg.facebook.maxResults}
              onChange={(e) =>
                update("facebook", {
                  ...cfg.facebook,
                  maxResults: Math.max(1, Math.min(25, Number(e.target.value) || 8)),
                })
              }
              className="h-9 w-full rounded-md border border-slate-200 px-3 text-sm focus:border-slate-900 focus:outline-none"
            />
          </label>
        </div>
      )}
    </div>
  );
}
