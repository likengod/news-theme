import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Save, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import {
  defaultReelsConfig,
  loadReelsConfig,
  saveReelsConfig,
  getReelsConfigServer,
  saveReelsConfigServer,
  toEmbedSrc,
  fetchYouTubeShorts,
  fetchFacebookReels,
  type ReelsConfig,
} from "@/lib/reels-config";
import { ReelsProviderSelector } from "@/components/admin/reels/ReelsProviderSelector";
import { ReelsApiConfig } from "@/components/admin/reels/ReelsApiConfig";
import { ReelsManualUrls } from "@/components/admin/reels/ReelsManualUrls";

export const Route = createFileRoute("/admin/reels")({
  ssr: false,
  component: ReelsEditor,
});

function ReelsEditor() {
  const [cfg, setCfg] = useState<ReelsConfig>(defaultReelsConfig);
  const [dirty, setDirty] = useState(false);
  const [newUrl, setNewUrl] = useState("");
  const [testing, setTesting] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getReelsConfigServer()
      .then((serverCfg) => {
        if (serverCfg) {
          setCfg(serverCfg);
          if (typeof window !== "undefined") {
            localStorage.setItem("nt:reels-config:v2", JSON.stringify(serverCfg));
          }
        } else {
          setCfg(loadReelsConfig());
        }
      })
      .catch(() => setCfg(loadReelsConfig()));
  }, []);

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
    const updatedUrls = [...cfg.urls, trimmed];
    update("urls", updatedUrls);
    setNewUrl("");
  };

  const removeUrl = (u: string) =>
    update(
      "urls",
      cfg.urls.filter((x) => x !== u),
    );

  const onSave = async () => {
    setSaving(true);
    saveReelsConfig(cfg);
    try {
      await saveReelsConfigServer({ data: cfg });
    } catch (e: any) {
      console.warn("[reels] server save notice:", e);
    } finally {
      setSaving(false);
    }
    setDirty(false);
    toast.success("Reels updated and saved successfully");
  };

  const onReset = async () => {
    setCfg(defaultReelsConfig);
    saveReelsConfig(defaultReelsConfig);
    try {
      await saveReelsConfigServer({ data: defaultReelsConfig });
    } catch {}
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

  const showManual = cfg.mode === "manual" || cfg.mode === "both";
  const showAuto = cfg.mode === "auto" || cfg.mode === "both";

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Reels & Shorts</h1>
          <p className="text-sm text-slate-500">
            Pick a source (YouTube or Facebook), then choose how to fill the section: paste URLs
            manually, auto-fetch the latest via API, or both.
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
            disabled={!dirty || saving}
            className="inline-flex items-center gap-2 rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-50"
          >
            <Save className="h-4 w-4" /> {saving ? "Saving..." : dirty ? "Save" : "Saved"}
          </button>
        </div>
      </div>

      {/* Enable + title */}
      <div className="rounded-lg border border-slate-200 bg-white p-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-slate-900">Show section on homepage</p>
            <p className="text-[11px] text-slate-500">
              Toggle off to hide the reels row site-wide.
            </p>
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

      {/* Provider & Mode */}
      <ReelsProviderSelector cfg={cfg} update={update} />

      {/* Auto / API config */}
      {showAuto && (
        <ReelsApiConfig
          cfg={cfg}
          update={update}
          testing={testing}
          onTestApi={testApi}
        />
      )}

      {/* Manual URLs */}
      {showManual && (
        <ReelsManualUrls
          cfg={cfg}
          newUrl={newUrl}
          setNewUrl={setNewUrl}
          addUrl={addUrl}
          removeUrl={removeUrl}
        />
      )}
    </div>
  );
}
