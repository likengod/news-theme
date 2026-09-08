import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Save, RotateCcw, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import {
  defaultHomepageConfig,
  loadHomepageConfig,
  saveHomepageConfig,
  getHomepageConfigServer,
  type HomepageConfig,
  type SectionStyle,
} from "@/lib/homepage-config";
import { SectionCard } from "@/components/admin/homepage/SectionCard";
import { HeroSectionEditor } from "@/components/admin/homepage/HeroSectionEditor";
import { NewsGridEditor } from "@/components/admin/homepage/NewsGridEditor";
import { LiveVideoEditor } from "@/components/admin/homepage/LiveVideoEditor";

export const Route = createFileRoute("/admin/homepage")({
  ssr: false,
  component: HomepageEditorPage,
});

function Group({
  title,
  description,
  defaultOpen = true,
  children,
}: {
  title: string;
  description?: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <section className="rounded-xl border border-slate-200 bg-slate-50/40">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
      >
        <div>
          <h2 className="text-sm font-semibold text-slate-900">{title}</h2>
          {description && (
            <p className="text-[11px] text-slate-500">{description}</p>
          )}
        </div>
        <ChevronDown
          className={`h-4 w-4 text-slate-500 transition ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && <div className="space-y-3 px-4 pb-4">{children}</div>}
    </section>
  );
}

function HomepageEditorPage() {
  const [cfg, setCfg] = useState<HomepageConfig>(defaultHomepageConfig);
  const [dirty, setDirty] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load local cache immediately, then fetch MySQL server config
    setCfg(loadHomepageConfig());
    getHomepageConfigServer()
      .then((serverCfg) => {
        setCfg(serverCfg);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const update = <K extends keyof HomepageConfig>(
    key: K,
    value: HomepageConfig[K],
  ) => {
    setCfg((p) => ({ ...p, [key]: value }));
    setDirty(true);
  };

  const updateCol = (i: number, value: SectionStyle) => {
    setCfg((p) => {
      const next = [...p.newsGridColumns];
      next[i] = value;
      return { ...p, newsGridColumns: next };
    });
    setDirty(true);
  };

  const onSave = () => {
    saveHomepageConfig(cfg);
    setDirty(false);
    toast.success("Homepage updated and saved to MySQL database!");
  };

  const onReset = () => {
    setCfg(defaultHomepageConfig);
    saveHomepageConfig(defaultHomepageConfig);
    setDirty(false);
    toast.success("Reset to defaults");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Homepage Edit</h1>
          <p className="text-sm text-slate-500">
            Rename each section, pick category news feeds, and customize heading styles.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onReset}
            className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            <RotateCcw className="h-4 w-4" />
            Reset
          </button>
          <button
            onClick={onSave}
            disabled={!dirty}
            className="inline-flex items-center gap-2 rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            {dirty ? "Save changes" : "Saved"}
          </button>
        </div>
      </div>

      {/* Top Header Bars & Market Ticker */}
      <Group
        title="Top Header Bars & Market Ticker"
        description="Show or hide the financial market ticker bar and breaking news bar."
        defaultOpen={true}
      >
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-4 shadow-xs">
            <div>
              <h3 className="text-sm font-semibold text-slate-800">
                Stock Market Ticker Bar
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Displays live indices (NIFTY 50, SENSEX, GOLD, SILVER, CRUDE OIL) under the header.
              </p>
            </div>
            <label className="relative inline-flex cursor-pointer items-center ml-3 shrink-0">
              <input
                type="checkbox"
                checked={cfg.showTicker ?? true}
                onChange={(e) => update("showTicker", e.target.checked)}
                className="peer sr-only"
              />
              <div className="peer h-6 w-11 rounded-full bg-slate-200 after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-focus:outline-none" />
            </label>
          </div>

          <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-4 shadow-xs">
            <div>
              <h3 className="text-sm font-semibold text-slate-800">
                Breaking News Bar
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Displays latest breaking headlines scrolling ticker.
              </p>
            </div>
            <label className="relative inline-flex cursor-pointer items-center ml-3 shrink-0">
              <input
                type="checkbox"
                checked={cfg.showBreakingBar ?? true}
                onChange={(e) => update("showBreakingBar", e.target.checked)}
                className="peer sr-only"
              />
              <div className="peer h-6 w-11 rounded-full bg-slate-200 after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-focus:outline-none" />
            </label>
          </div>
        </div>
      </Group>

      {/* Hero section */}
      <Group
        title="Hero area"
        description="The main top section featuring lead stories, top news, and culture."
      >
        <HeroSectionEditor config={cfg} onUpdate={update} />
      </Group>

      {/* Sidebar */}
      <Group title="Sidebar sections" defaultOpen={false}>
        <div className="space-y-3">
          <SectionCard
            label="Opinion"
            value={cfg.heroOpinion}
            showCategory
            onChange={(v) => update("heroOpinion", v)}
          />
          <SectionCard
            label="Popular"
            value={cfg.heroPopular}
            showCategory
            onChange={(v) => update("heroPopular", v)}
          />
        </div>
      </Group>

      {/* Live video */}
      <Group
        title="Live video stream"
        description="Embed live YouTube or Facebook stream on homepage hero."
        defaultOpen={false}
      >
        <LiveVideoEditor
          value={cfg.liveVideo}
          onChange={(v) => update("liveVideo", v)}
        />
      </Group>

      {/* News grid */}
      <Group
        title="News grid (5 columns)"
        description="Each column feeds news from your chosen category."
      >
        <NewsGridEditor columns={cfg.newsGridColumns} onUpdateColumn={updateCol} />
      </Group>

      {/* Other sections */}
      <Group title="Other sections" defaultOpen={false}>
        <div className="space-y-3">
          <SectionCard
            label="Watch"
            value={cfg.watch}
            showCategory
            onChange={(v) => update("watch", v)}
          />
          <SectionCard
            label="Markets Magazine"
            value={cfg.marketsMagazine}
            showCategory
            onChange={(v) => update("marketsMagazine", v)}
          />
        </div>
      </Group>

      {/* Sticky save bar */}
      <div className="sticky bottom-4 flex justify-end">
        <button
          onClick={onSave}
          disabled={!dirty}
          className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-lg hover:bg-slate-800 disabled:opacity-50"
        >
          <Save className="h-4 w-4" />
          {dirty ? "Save changes to MySQL" : "All saved"}
        </button>
      </div>
    </div>
  );
}
