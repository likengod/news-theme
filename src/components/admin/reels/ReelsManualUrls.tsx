import React from "react";
import { Plus, Trash2 } from "lucide-react";
import { toEmbedSrc, type ReelsConfig } from "@/lib/reels-config";

interface ReelsManualUrlsProps {
  cfg: ReelsConfig;
  newUrl: string;
  setNewUrl: (url: string) => void;
  addUrl: () => void;
  removeUrl: (url: string) => void;
}

export function ReelsManualUrls({
  cfg,
  newUrl,
  setNewUrl,
  addUrl,
  removeUrl,
}: ReelsManualUrlsProps) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <p className="mb-3 text-sm font-semibold text-slate-900">
        {cfg.provider === "youtube"
          ? "Manual YouTube Shorts URLs"
          : "Manual Facebook Reel URLs"}
      </p>

      <div className="flex gap-2">
        <input
          type="url"
          value={newUrl}
          onChange={(e) => setNewUrl(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addUrl())}
          placeholder={
            cfg.provider === "youtube"
              ? "https://www.youtube.com/shorts/VIDEO_ID"
              : "https://www.facebook.com/reel/REEL_ID"
          }
          className="h-9 flex-1 rounded-md border border-slate-200 px-3 text-sm focus:border-slate-900 focus:outline-none"
        />
        <button
          onClick={addUrl}
          className="inline-flex items-center gap-1.5 rounded-md bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800"
        >
          <Plus className="h-4 w-4" /> Add
        </button>
      </div>

      {cfg.urls.length === 0 ? (
        <p className="mt-4 text-sm text-slate-400">No URLs yet. Add one above.</p>
      ) : (
        <ul className="mt-4 space-y-2">
          {cfg.urls.map((u) => {
            const invalid = !toEmbedSrc(cfg.provider, u);
            return (
              <li
                key={u}
                className="flex items-center justify-between gap-3 rounded-md border border-slate-100 bg-slate-50 px-3 py-2"
              >
                <span
                  className={`truncate text-xs ${invalid ? "text-red-600" : "text-slate-700"}`}
                  title={u}
                >
                  {invalid && "⚠ Invalid for current source · "}
                  {u}
                </span>
                <button
                  onClick={() => removeUrl(u)}
                  className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2 py-1 text-xs text-slate-600 hover:bg-red-50 hover:text-red-600"
                >
                  <Trash2 className="h-3 w-3" /> Remove
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
