import React from "react";
import { Youtube, Facebook, Link as LinkIcon, KeyRound, Layers } from "lucide-react";
import type { ReelsConfig, ReelsMode, ReelsProvider } from "@/lib/reels-config";

interface ReelsProviderSelectorProps {
  cfg: ReelsConfig;
  update: <K extends keyof ReelsConfig>(key: K, value: ReelsConfig[K]) => void;
}

export function ReelsProviderSelector({ cfg, update }: ReelsProviderSelectorProps) {
  const providerBtn = (p: ReelsProvider, Icon: typeof Youtube, label: string, color: string) => (
    <button
      type="button"
      onClick={() => update("provider", p)}
      className={`flex flex-1 items-center justify-center gap-2 rounded-md border px-4 py-3 text-sm font-semibold transition ${
        cfg.provider === p
          ? "border-slate-900 bg-slate-900 text-white"
          : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
      }`}
    >
      <Icon className="h-4 w-4" style={{ color: cfg.provider === p ? "#fff" : color }} />
      {label}
    </button>
  );

  const modeBtn = (m: ReelsMode, Icon: typeof LinkIcon, label: string, hint: string) => (
    <button
      type="button"
      onClick={() => update("mode", m)}
      className={`flex flex-1 flex-col items-start gap-1 rounded-md border px-4 py-3 text-left transition ${
        cfg.mode === m
          ? "border-slate-900 bg-slate-50 ring-1 ring-slate-900"
          : "border-slate-200 bg-white hover:bg-slate-50"
      }`}
    >
      <span className="inline-flex items-center gap-2 text-sm font-semibold text-slate-900">
        <Icon className="h-4 w-4" /> {label}
      </span>
      <span className="text-[11px] text-slate-500">{hint}</span>
    </button>
  );

  return (
    <>
      {/* Provider */}
      <div className="rounded-lg border border-slate-200 bg-white p-4">
        <p className="mb-3 text-sm font-semibold text-slate-900">1. Choose a source</p>
        <div className="flex gap-3">
          {providerBtn("youtube", Youtube, "YouTube Shorts", "#FF0000")}
          {providerBtn("facebook", Facebook, "Facebook Reels", "#1877F2")}
        </div>
      </div>

      {/* Mode */}
      <div className="rounded-lg border border-slate-200 bg-white p-4">
        <p className="mb-3 text-sm font-semibold text-slate-900">2. How should reels load?</p>
        <div className="flex flex-col gap-3 sm:flex-row">
          {modeBtn("manual", LinkIcon, "Manual URLs", "Paste each reel link — no API needed.")}
          {modeBtn(
            "auto",
            KeyRound,
            "Auto from API",
            "Latest reels pulled from your channel/page.",
          )}
          {modeBtn("both", Layers, "Both", "Pinned manual reels first, then latest from API.")}
        </div>
      </div>
    </>
  );
}
