import { useEffect, useMemo, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Plus,
  Trash2,
  Save,
  Image as ImageIcon,
  RotateCcw,
  Trash,
  Upload,
  FolderOpen,
  X,
  ExternalLink,
  Info,
  Clock,
  Sparkles,
  Eye,
  EyeOff,
  Code,
  Layers,
  FileCode,
} from "lucide-react";
import {
  loadAds,
  saveAds,
  trashAds,
  loadTrash,
  restoreFromTrash,
  purgeFromTrash,
  processExpiredAds,
  loadAdRotation,
  saveAdRotation,
  loadAdSlotMode,
  saveAdSlotMode,
  loadAdSlotScript,
  saveAdSlotScript,
  type AdSlideItem,
  type AdSlot,
  type AdType,
  type AdSlotMode,
} from "@/lib/site-content";
import { LibraryPicker } from "@/components/admin/MediaField";
import { trackUpload } from "@/lib/media-library";
import { ScriptAdRenderer } from "@/components/site/ScriptAdRenderer";
import { DualImageCell } from "@/components/admin/advertisements/DualImageCell";

const formatExpiresAt = (expiresVal: any): string => {
  if (!expiresVal) return "";
  try {
    const d = expiresVal instanceof Date ? expiresVal : new Date(expiresVal);
    if (!isNaN(d.getTime())) {
      const pad = (n: number) => String(n).padStart(2, "0");
      return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
    }
    if (typeof expiresVal === "string") {
      return expiresVal.slice(0, 10);
    }
  } catch (e) {
    console.error("formatExpiresAt error:", e);
  }
  return "";
};

export const Route = createFileRoute("/admin/advertisements")({
  component: AdvertisementsPage,
});

function uid() {
  return `ad-${Math.random().toString(36).slice(2, 9)}`;
}

type SlotMeta = {
  key: AdSlot;
  label: string;
  orientation: "Portrait" | "Landscape" | "Portrait + Landscape";
  ratio: string;
  size: string;
  shownOn: string;
};

const SLOTS: SlotMeta[] = [
  {
    key: "home1",
    label: "Home 1",
    orientation: "Portrait",
    ratio: "3:4",
    size: "600 × 800 px",
    shownOn: "Home page — sidebar next to hero board",
  },
  {
    key: "home2",
    label: "Home 2",
    orientation: "Landscape",
    ratio: "~2:1",
    size: "406 × 196 px",
    shownOn: "Home page — Markets Magazine sidebar slideshow",
  },
  {
    key: "ad3",
    label: "Ad 3",
    orientation: "Portrait",
    ratio: "3:4",
    size: "600 × 800 px",
    shownOn: "Article & Category pages — sidebar ('Your Ad Here')",
  },
  {
    key: "popup",
    label: "Popup",
    orientation: "Portrait + Landscape",
    ratio: "3:4 (mobile) · 16:9 (desktop)",
    size: "600 × 800 px (mobile) · 1200 × 675 px (desktop)",
    shownOn: "Article pages — popup modal 7 seconds after open",
  },
  {
    key: "leaderboard",
    label: "Leaderboard",
    orientation: "Landscape",
    ratio: "~8:1",
    size: "728 × 90 px, 970 × 250 px, etc.",
    shownOn: "Header or top of pages",
  },
];

type Tab = AdSlot | "trash";

function daysLeft(deletedAt?: string | null) {
  if (!deletedAt) return 0;
  const ms = 30 * 24 * 60 * 60 * 1000 - (Date.now() - new Date(deletedAt).getTime());
  return Math.max(0, Math.ceil(ms / (24 * 60 * 60 * 1000)));
}



const SAMPLE_GOOGLE_ADSENSE = `<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1234567890123456" crossorigin="anonymous"></script>
<!-- Responsive Ad -->
<ins class="adsbygoogle"
     style="display:block"
     data-ad-client="ca-pub-1234567890123456"
     data-ad-slot="1234567890"
     data-ad-format="auto"
     data-full-width-responsive="true"></ins>
<script>
     (adsbygoogle = window.adsbygoogle || []).push({});
</script>`;

function AdvertisementsPage() {
  const [tab, setTab] = useState<Tab>("home1");
  const [ads, setAds] = useState<AdSlideItem[]>([]);
  const [trash, setTrash] = useState<AdSlideItem[]>([]);
  const [rotation, setRotation] = useState<number>(5);
  const [slotMode, setSlotMode] = useState<AdSlotMode>("image");
  const [slotScript, setSlotScript] = useState<string>("");
  const [previewSlotScript, setPreviewSlotScript] = useState<boolean>(false);
  const [showDemoGuide, setShowDemoGuide] = useState<boolean>(false);
  const [previewScriptId, setPreviewScriptId] = useState<string | null>(null);
  const [newlyAddedId, setNewlyAddedId] = useState<string | null>(null);
  const tableRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    processExpiredAds();
    setAds(loadAds("home1"));
    setTrash(loadTrash());
    setSlotMode(loadAdSlotMode("home1"));
    setSlotScript(loadAdSlotScript("home1"));
  }, []);

  useEffect(() => {
    if (tab === "trash") {
      setTrash(loadTrash());
    } else {
      setAds(loadAds(tab));
      setRotation(loadAdRotation(tab));
      setSlotMode(loadAdSlotMode(tab));
      setSlotScript(loadAdSlotScript(tab));
      setPreviewSlotScript(false);
    }
  }, [tab]);

  const isTrash = tab === "trash";
  const slot = (isTrash ? "home1" : tab) as AdSlot;
  const activeSlot = SLOTS.find((s) => s.key === slot);
  const hasScriptAdActive = slotMode === "script";

  const slotCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    SLOTS.forEach((s) => {
      counts[s.key] = loadAds(s.key).length;
    });
    return counts;
  }, [ads, tab]);

  const trashCount = useMemo(() => loadTrash().length, [tab, trash]);

  const update = (id: string, patch: Partial<AdSlideItem>) =>
    setAds((prev) => prev.map((a) => (a.id === id ? { ...a, ...patch } : a)));

  const remove = (id: string) => {
    trashAds([id], slot);
    setAds(loadAds(slot));
    setTrash(loadTrash());
    toast.success("Moved to Trash (recoverable for 30 days)");
  };

  const handleAddAd = () => {
    const newId = uid();
    setAds((prev) => [
      ...prev,
      {
        id: newId,
        type: "image",
        scriptCode: "",
        image: "",
        href: "#",
        label: "Sponsored",
        expiresAt: null,
      },
    ]);
    setNewlyAddedId(newId);
    toast.success(`New ad slide added to ${activeSlot?.label ?? slot}!`);
    setTimeout(() => {
      if (tableRef.current) {
        tableRef.current.scrollTop = tableRef.current.scrollHeight;
      }
    }, 100);
  };

  const onSave = () => {
    saveAdSlotMode(slot, slotMode);
    if (slotMode === "script") {
      saveAdSlotScript(slot, slotScript);
      toast.success(`Saved 3rd Party Script Ad integration for ${activeSlot?.label ?? slot}`);
    } else {
      const cleaned = ads.filter((a) =>
        (a.image || a.imagePortrait || a.imageLandscape || "").trim().length > 0
      );
      saveAds(cleaned, slot);
      saveAdRotation(slot, rotation);
      setAds(cleaned);
      const slotLabel = activeSlot?.label ?? slot;
      toast.success(
        `Saved ${cleaned.length} custom banner slide${cleaned.length === 1 ? "" : "s"} to ${slotLabel} (rotates every ${rotation}s)`
      );
    }
  };

  const onRestore = (id: string) => {
    restoreFromTrash(id);
    setTrash(loadTrash());
    toast.success("Restored ad slide");
  };

  const onPurge = (id: string) => {
    purgeFromTrash(id);
    setTrash(loadTrash());
    toast.success("Permanently deleted");
  };

  return (
    <div className="space-y-5 pb-12">
      {/* Top Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Advertisements</h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage rotating ad slides for your site. Support custom images, videos, and 3rd party script ads (Google AdSense, Bing Ads).
          </p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-px">
        <div className="flex flex-wrap items-center gap-1.5">
          {SLOTS.map((s) => {
            const isActive = tab === s.key;
            const count = slotCounts[s.key] || 0;
            return (
              <button
                key={s.key}
                onClick={() => setTab(s.key)}
                className={`group flex items-center gap-2 rounded-t-lg border-b-2 px-4 py-2.5 text-sm font-semibold transition-all ${
                  isActive
                    ? "border-slate-900 bg-slate-900 text-white shadow-xs"
                    : "border-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <span>{s.label}</span>
                <span
                  className={`rounded-full px-2 py-0.5 text-[10.5px] font-bold ${
                    isActive
                      ? "bg-slate-700 text-slate-200"
                      : "bg-slate-200 text-slate-600 group-hover:bg-slate-300"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
        {!isTrash && (
          <div className="flex items-center gap-6">
            <div className="flex items-center space-x-2 border-r border-slate-200 pr-6">
              <Label htmlFor="mode-switch" className="text-xs font-semibold text-slate-600 cursor-pointer">
                Google Ads
              </Label>
              <Switch
                id="mode-switch"
                checked={slotMode === "image"}
                onCheckedChange={(c) => {
                  const mode = c ? "image" : "script";
                  setSlotMode(mode);
                  saveAdSlotMode(slot, mode);
                }}
              />
              <Label htmlFor="mode-switch" className="text-xs font-semibold text-slate-900 cursor-pointer">
                Custom Ads
              </Label>
            </div>

            <button
              type="button"
              onClick={() => setIsTrash(true)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 shadow-sm transition hover:bg-slate-50 hover:text-red-600"
            >
              <Trash2 className="h-4 w-4" /> Trash ({trash.length})
            </button>
          </div>
        )}
      </div>

      {/* Main Tab Content */}
      {isTrash ? (
        trash.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center">
            <Trash className="mb-3 h-8 w-8 text-slate-400" />
            <h3 className="text-base font-semibold text-slate-800">Trash is empty</h3>
            <p className="mt-1 text-xs text-slate-500">Deleted ad slides will appear here and can be restored within 30 days.</p>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between rounded-lg bg-amber-50 px-4 py-2 text-xs text-amber-800 border border-amber-200">
              <div className="flex items-center gap-2 font-medium">
                <Info className="h-4 w-4 shrink-0 text-amber-600" />
                Items in trash are automatically purged 30 days after deletion.
              </div>
            </div>
            {trash.map((ad) => (
              <div
                key={ad.id}
                className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between shadow-xs hover:border-slate-300 transition"
              >
                <div className="flex items-center gap-3">
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center">
                    {ad.type === "script" ? (
                      <Code className="h-6 w-6 text-purple-600" />
                    ) : ad.image ? (
                      <img src={ad.image} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <div className="grid h-full w-full place-items-center text-[10px] uppercase tracking-wider text-slate-400 font-bold">
                        No img
                      </div>
                    )}
                  </div>
                  <div className="text-xs">
                    <div className="font-semibold text-slate-900 max-w-md truncate">
                      {ad.type === "script" ? "3rd Party Script Ad" : ad.image || "(no image set)"}
                    </div>
                    <div className="mt-1 flex flex-wrap items-center gap-2 text-slate-500">
                      <span className="inline-flex items-center gap-1 rounded bg-slate-100 px-1.5 py-0.5">
                        <FolderOpen className="h-3 w-3" />
                        {SLOTS.find(s => s.key === ad.slot)?.label || ad.slot}
                      </span>
                      <span>�</span>
                      <span className="inline-flex items-center gap-1 text-red-500">
                        <Clock className="h-3 w-3" />
                        Deleted
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <button
                    onClick={() => onRestore(ad.id)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-emerald-600 transition"
                  >
                    <RotateCcw className="h-3.5 w-3.5" /> Restore
                  </button>
                  <button
                    onClick={() => onPurge(ad.id)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-red-300 bg-red-50 px-3.5 py-2 text-xs font-semibold text-red-700 hover:bg-red-100 transition"
                  >
                    <Trash2 className="h-3.5 w-3.5" /> Delete forever
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      ) : slotMode === "script" ? (
        <div className="space-y-6">
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <label className="flex items-center gap-2 text-xs font-bold text-slate-800">
                <Code className="h-4.5 w-4.5 text-purple-600" />
                <span>Paste 3rd-Party Script HTML/JS Code (Google AdSense, Bing Ads, Custom Script)</span>
              </label>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() =>
                    setSlotScript((s) => (s ? s + "\n\n" : "") + SAMPLE_GOOGLE_ADSENSE)
                  }
                  className="inline-flex items-center gap-1 rounded-md bg-purple-50 px-2 py-1 text-[10px] font-bold text-purple-700 hover:bg-purple-100 transition"
                >
                  <Plus className="h-3 w-3" /> Sample AdSense
                </button>
              </div>
            </div>
            
            <textarea
              value={slotScript}
              onChange={(e) => setSlotScript(e.target.value)}
              placeholder="<!-- Paste HTML, <script> tags, or iframe codes here -->\n<ins class=\&quot;adsbygoogle\&quot; ...></ins>\n<script>(adsbygoogle = window.adsbygoogle || []).push({});</script>"
              className="min-h-[250px] w-full rounded-xl border border-slate-200 bg-slate-50 p-4 font-mono text-[11px] leading-relaxed text-slate-700 placeholder:text-slate-400 focus:border-purple-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-purple-500 transition shadow-inner"
              spellCheck="false"
            />
            
            <div className="rounded-lg bg-blue-50 p-3 text-xs text-blue-800 border border-blue-100 flex items-start gap-2">
              <Info className="h-4 w-4 shrink-0 mt-0.5 text-blue-600" />
              <p>
                <strong>Important:</strong> 3rd party scripts are executed exactly as provided. Ensure you only paste code from trusted ad networks like Google AdSense. In script mode, custom banner slides for this slot are ignored.
              </p>
            </div>
          </div>
          <div className="flex items-center justify-end rounded-xl border border-slate-200 bg-slate-50 p-4">
            <button
              type="button"
              onClick={() => onSave()}
              className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-slate-800 transition active:scale-98"
            >
              <Save className="h-4 w-4 text-emerald-400" /> Save Script Integration
            </button>
          </div>
        </div>
      ) : ads.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center shadow-xs">
          <div className="grid h-12 w-12 place-items-center rounded-full bg-slate-100 text-slate-600 mb-3">
            <ImageIcon className="h-6 w-6" />
          </div>
          <h3 className="text-base font-semibold text-slate-900">No ads added to {activeSlot?.label} yet</h3>
          <p className="mt-1 max-w-sm text-xs text-slate-500">
            Add rotating custom banner images or video advertisements for {activeSlot?.shownOn || "this slot"}.
          </p>
          <button
            type="button"
            onClick={handleAddAd}
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
          >
            <Plus className="h-4 w-4" /> Add your first ad to {activeSlot?.label}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between rounded-xl bg-slate-900 px-4 py-3 text-white shadow-xs">
            <div className="flex items-center gap-2 text-xs font-medium">
              <Sparkles className="h-4 w-4 text-amber-400" />
              <span>
                <strong>{ads.length}</strong> active ad slide{ads.length === 1 ? "" : "s"} in <strong>{activeSlot?.label}</strong>
              </span>
            </div>
            <button
              type="button"
              onClick={handleAddAd}
              className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-xs transition hover:bg-emerald-500 active:scale-98"
            >
              <Plus className="h-3.5 w-3.5" /> Add ad
            </button>
          </div>

          <div ref={tableRef} className="space-y-4">
            {ads.map((ad, i) => {
              const isJustAdded = ad.id === newlyAddedId;

              return (
                <div
                  key={ad.id}
                  className={`rounded-xl border border-slate-200 bg-white p-4 shadow-xs transition-colors ${
                    isJustAdded ? "bg-emerald-50/40 border-emerald-300 ring-1 ring-emerald-300" : "hover:border-slate-300"
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-3">
                      <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-slate-900 text-xs font-bold text-white shadow-2xs">
                        #{i + 1}
                      </span>
                      <span className="text-xs font-bold text-slate-800">
                        Banner Ad Slide
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <label className="text-xs font-semibold text-slate-500 whitespace-nowrap">
                          Expires:
                        </label>
                        <input
                          type="date"
                          value={formatExpiresAt(ad.expiresAt)}
                          onChange={(e) =>
                            update(ad.id, {
                              expiresAt: e.target.value ? new Date(e.target.value).toISOString() : null,
                            })
                          }
                          className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs text-slate-800 focus:border-slate-900 focus:outline-none transition"
                        />
                      </div>

                      <button
                        type="button"
                        onClick={() => remove(ad.id)}
                        title="Delete ad slide"
                        aria-label="Delete ad slide"
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-red-200 bg-red-50 text-red-600 transition hover:bg-red-600 hover:text-white shadow-2xs"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div className="mt-3">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                      <div>
                        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                          Upload Banner Images
                        </div>
                        <DualImageCell ad={ad} slot={slot} onUpdate={update} />
                      </div>

                      <div className="flex-1 max-w-md">
                        <div className="flex items-center justify-between mb-1">
                          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500">
                            Click-Through URL
                          </label>
                          {ad.href && ad.href !== "#" && (
                            <a
                              href={ad.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-[10px] font-semibold text-indigo-600 hover:underline"
                            >
                              Test link <ExternalLink className="h-2.5 w-2.5" />
                            </a>
                          )}
                        </div>
                        <input
                          value={ad.href}
                          onChange={(e) => update(ad.id, { href: e.target.value })}
                          placeholder="https://advertiser.com"
                          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 transition"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-end rounded-xl border border-slate-200 bg-slate-50 p-4">
            <button
              type="button"
              onClick={() => onSave()}
              className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-slate-800 transition active:scale-98"
            >
              <Save className="h-4 w-4 text-emerald-400" /> Save changes
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
