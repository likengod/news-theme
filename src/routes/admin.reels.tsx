import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Save,
  RotateCcw,
  Plus,
  Trash2,
  Youtube,
  Facebook,
  KeyRound,
  Link as LinkIcon,
  Layers,
} from "lucide-react";
import { toast } from "sonner";
import {
  defaultReelsConfig,
  loadReelsConfig,
  saveReelsConfig,
  toEmbedSrc,
  fetchYouTubeShorts,
  fetchFacebookReels,
  type ReelsConfig,
  type ReelsMode,
  type ReelsProvider,
} from "@/lib/reels-config";

export const Route = createFileRoute("/admin/reels")({
  ssr: false,
  component: ReelsEditor,
});

function ReelsEditor() {
  const [cfg, setCfg] = useState<ReelsConfig>(defaultReelsConfig);
  const [dirty, setDirty] = useState(false);
  const [newUrl, setNewUrl] = useState("");
  const [testing, setTesting] = useState(false);

  useEffect(() => setCfg(loadReelsConfig()), []);

  const update = <K extends keyof ReelsConfig>(key: K, value: ReelsConfig[K]) => {
    setCfg((p) => ({ ...p, [key]: value }));
    setDirty(true);
  };

  const addUrl = () => {
    const trimmed = newUrl.trim();
    if (!trimmed) return;
    if (!toEmbedSrc(cfg.provider, trimmed)) {
      toast.error(
        cfg.provider === "youtube"
          ? "Not a valid YouTube URL (paste a Shorts or watch link)"
          : "Not a valid Facebook video/reel URL",
      );
      return;
    }
    if (cfg.urls.includes(trimmed)) return toast.error("Already added");
    update("urls", [...cfg.urls, trimmed]);
    setNewUrl("");
  };

  const removeUrl = (u: string) => update("urls", cfg.urls.filter((x) => x !== u));

  const onSave = () => {
    saveReelsConfig(cfg);
    setDirty(false);
    toast.success("Reels updated");
  };

  const onReset = () => {
    setCfg(defaultReelsConfig);
    saveReelsConfig(defaultReelsConfig);
    setDirty(false);
    toast.success("Reset to defaults");
  };

  const testApi = async () => {
    setTesting(true);
    try {
      const items =
        cfg.provider === "youtube"
          ? await fetchYouTubeShorts(cfg.youtube)
          : await fetchFacebookReels(cfg.facebook);
      toast.success(`API OK — fetched ${items.length} item${items.length === 1 ? "" : "s"}`);
    } catch (e) {
      toast.error(`API failed: ${(e as Error).message}`);
    } finally {
      setTesting(false);
    }
  };

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

  const showManual = cfg.mode === "manual" || cfg.mode === "both";
  const showAuto = cfg.mode === "auto" || cfg.mode === "both";

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Reels & Shorts</h1>
          <p className="text-sm text-slate-500">
            Pick a source (YouTube or Facebook), then choose how to fill the section:
            paste URLs manually, auto-fetch the latest via API, or both.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onReset}
            className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            <RotateCcw className="h-4 w-4" /> Reset
          </button>
          <button
            onClick={onSave}
            disabled={!dirty}
            className="inline-flex items-center gap-2 rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-50"
          >
            <Save className="h-4 w-4" /> {dirty ? "Save changes" : "Saved"}
          </button>
        </div>
      </div>

      {/* Enable + title */}
      <div className="rounded-lg border border-slate-200 bg-white p-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-slate-900">Show section on homepage</p>
            <p className="text-[11px] text-slate-500">Toggle off to hide the reels row site-wide.</p>
          </div>
          <label className="inline-flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              checked={cfg.enabled}
              onChange={(e) => update("enabled", e.target.checked)}
              className="h-4 w-4 accent-slate-900"
            />
            <span className="text-sm">{cfg.enabled ? "Enabled" : "Disabled"}</span>
          </label>
        </div>

        <label className="mt-4 block">
          <span className="mb-1 block text-[11px] font-medium text-slate-500">Section heading</span>
          <input
            type="text"
            value={cfg.title}
            onChange={(e) => update("title", e.target.value)}
            className="h-9 w-full rounded-md border border-slate-200 px-3 text-sm focus:border-slate-900 focus:outline-none"
          />
        </label>
      </div>

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
          {modeBtn("auto", KeyRound, "Auto from API", "Latest reels pulled from your channel/page.")}
          {modeBtn("both", Layers, "Both", "Pinned manual reels first, then latest from API.")}
        </div>
      </div>

      {/* Auto / API config */}
      {showAuto && (
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-900">
              {cfg.provider === "youtube" ? "YouTube Data API" : "Facebook Graph API"}
            </p>
            <button
              onClick={testApi}
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
                  Create at console.cloud.google.com → APIs & Services → Credentials.
                  Enable "YouTube Data API v3" and restrict the key to your site's domain.
                </span>
              </label>
              <label>
                <span className="mb-1 block text-[11px] font-medium text-slate-500">Channel ID</span>
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
                  Generate a long-lived Page access token in Meta Business Suite / Graph API Explorer.
                  Needs the <code>pages_read_engagement</code> permission.
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
      )}

      {/* Manual URLs */}
      {showManual && (
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <p className="mb-3 text-sm font-semibold text-slate-900">
            {cfg.provider === "youtube" ? "Manual YouTube Shorts URLs" : "Manual Facebook Reel URLs"}
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
      )}
    </div>
  );
}
