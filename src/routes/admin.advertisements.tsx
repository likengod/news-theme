import { useEffect, useMemo, useRef, useState } from "react";
import { createFileRoute, useNavigate, useRouter } from "@tanstack/react-router";
import { toast } from "sonner";
import { Save, Lock } from "lucide-react";
import { useSiteSettings } from "@/components/site/AdSettingsContext";
import {
  loadAds,
  saveAds,
  trashAds,
  loadTrash,
  restoreFromTrash,
  purgeFromTrash,
  deleteAdStaticFilesServer,
  processExpiredAds,
  loadAdRotation,
  saveAdRotation,
  loadAdSlotMode,
  saveAdSlotMode,
  loadAdSlotScript,
  saveAdSlotScript,
  loadPopupConfig,
  savePopupConfig,
  type PopupConfig,
  defaultPopupConfig,
  type AdSlideItem,
  type AdSlot,
  type AdSlotMode,
} from "@/lib/site-content";
import { PopupTimingCard } from "@/components/admin/advertisements/PopupTimingCard";
import { ScriptAdEditor } from "@/components/admin/advertisements/ScriptAdEditor";
import { AdTrashDrawer } from "@/components/admin/advertisements/AdTrashDrawer";
import { ReelAdsGuidanceCard } from "@/components/admin/advertisements/ReelAdsGuidanceCard";
import { AdItemCard } from "@/components/admin/advertisements/AdItemCard";
import { AdSlotsNavBar } from "@/components/admin/advertisements/AdSlotsNavBar";
import { AdSlotToolbar } from "@/components/admin/advertisements/AdSlotToolbar";
import { AdSlotEmptyState } from "@/components/admin/advertisements/AdSlotEmptyState";
import { SLOTS, SAMPLE_GOOGLE_ADSENSE, type Tab } from "@/components/admin/advertisements/types";

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
  return `prm-${Math.random().toString(36).slice(2, 9)}`;
}

function AdvertisementsPage() {
  const navigate = useNavigate();
  const router = useRouter();
  const s = useSiteSettings();
  const planType = (s.licenseType || "").toLowerCase();
  
  const isEnterprise = planType.includes("enterprise");
  const isEnterprisePlus = planType.includes("enterprise+") || planType.includes("enterprise plus");

  const [tab, setTab] = useState<Tab>("home1");
  const [ads, setAds] = useState<AdSlideItem[]>([]);
  const [trash, setTrash] = useState<AdSlideItem[]>([]);
  const [rotation, setRotation] = useState<number>(5);
  const [popupConfig, setPopupConfig] = useState<PopupConfig>(defaultPopupConfig);
  const [slotMode, setSlotMode] = useState<AdSlotMode>("image");
  const [slotScript, setSlotScript] = useState<string>("");
  const [newlyAddedId, setNewlyAddedId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const tableRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    processExpiredAds();
    setAds(loadAds("home1"));
    setTrash(loadTrash());
    setSlotMode(loadAdSlotMode("home1"));
    setSlotScript(loadAdSlotScript("home1"));
    setPopupConfig(loadPopupConfig());
  }, []);

  useEffect(() => {
    if (tab === "trash") {
      setTrash(loadTrash());
    } else {
      setAds(loadAds(tab));
      setRotation(loadAdRotation(tab));
      let mode = loadAdSlotMode(tab);
      if ((tab === "popup" || tab === "leaderboard") && !isEnterprise) {
        mode = "script";
      }
      setSlotMode(mode);
      setSlotScript(loadAdSlotScript(tab));
      if (tab === "popup") {
        setPopupConfig(loadPopupConfig());
      }
      setPage(1);
    }
  }, [tab, isEnterprise]);

  const filteredAds = useMemo(() => {
    if (!searchQuery.trim()) return ads;
    const q = searchQuery.toLowerCase();
    return ads.filter(
      (ad) =>
        (ad.label && ad.label.toLowerCase().includes(q)) ||
        (ad.href && ad.href.toLowerCase().includes(q)),
    );
  }, [ads, searchQuery]);

  const ITEMS_PER_PAGE = 10;
  const paginatedAds = filteredAds.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);
  const totalPages = Math.max(1, Math.ceil(filteredAds.length / ITEMS_PER_PAGE));

  const isTrash = tab === "trash";
  const slot = (isTrash ? "home1" : tab) as AdSlot;
  const activeSlot = SLOTS.find((s) => s.key === slot);

  const slotCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    SLOTS.forEach((s) => {
      counts[s.key] = loadAds(s.key).length;
    });
    return counts;
  }, [ads, tab]);

  const update = (id: string, patch: Partial<AdSlideItem>) =>
    setAds((prev) => prev.map((a) => (a.id === id ? { ...a, ...patch } : a)));

  const moveAd = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= ads.length) return;
    const next = [...ads];
    const temp = next[index];
    next[index] = next[targetIndex];
    next[targetIndex] = temp;
    setAds(next);
  };

  const toggleFeatured = (id: string) => {
    setAds((prev) => prev.map((a) => (a.id === id ? { ...a, isFeatured: !a.isFeatured } : a)));
  };

  const remove = (id: string) => {
    trashAds([id], slot);
    router.invalidate();
    setAds(loadAds(slot));
    setTrash(loadTrash());
    toast.success("Moved to Trash (recoverable for 30 days)");
  };

  const handleAddAd = () => {
    if (!isEnterprise && ads.length >= 1) {
      toast.error("You must have an Enterprise license to add multiple ads in a single slot.");
      return;
    }
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
    try {
      saveAdSlotMode(slot, slotMode);
      if (slotMode === "script") {
        saveAdSlotScript(slot, slotScript);
        toast.success(`Saved 3rd Party Script Ad integration for ${activeSlot?.label ?? slot}`);
      } else {
        if (tab === "popup") {
          savePopupConfig(popupConfig);
        }
        const cleaned = ads.filter(
          (a) => (a.image || a.imagePortrait || a.imageLandscape || "").trim().length > 0,
        );
        saveAds(cleaned, slot);
        saveAdRotation(slot, rotation);
        setAds(cleaned);
        const slotLabel = activeSlot?.label ?? slot;
        toast.success(
          `Saved ${cleaned.length} custom banner slide${cleaned.length === 1 ? "" : "s"} to ${slotLabel} (rotates every ${rotation}s)`,
        );
      }
      router.invalidate();
    } catch (err: any) {
      console.error("[onSave] Failed to save advertisements:", err);
      toast.error("Failed to save advertisements: " + (err?.message || "Storage error"));
    }
  };

  const onRestore = (id: string) => {
    restoreFromTrash(id);
    router.invalidate();
    setTrash(loadTrash());
    toast.success("Restored ad slide");
  };

  const onPurge = async (id: string) => {
    const item = trash.find((t) => t.id === id);
    if (item) {
      const urlsToDelete = [item.image, item.imagePortrait, item.imageLandscape].filter(
        (url): url is string => !!url && typeof url === "string" && (url.startsWith("/uploads/ads/") || url.startsWith("/uploads/promos/")),
      );
      if (urlsToDelete.length > 0) {
        try {
          await deleteAdStaticFilesServer({ data: urlsToDelete });
        } catch (err) {
          console.error("Failed to delete static files:", err);
        }
      }
    }
    purgeFromTrash(id);
    router.invalidate();
    setTrash(loadTrash());
    toast.success("Permanently deleted");
  };

  return (
    <div className="space-y-3.5 sm:space-y-5 pb-12">
      {/* Top Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">Advertisements</h1>
          <p className="mt-1 text-sm text-slate-500 hidden sm:block">
            Manage rotating ad slides for your site. Support custom images, videos, and 3rd party
            script ads (Google AdSense, Bing Ads).
          </p>
        </div>
      </div>

      {/* WebP Format Notice Banner (Desktop / Tablet only) */}
      <div className="hidden sm:flex items-start sm:items-center gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50/80 p-3 sm:px-4 sm:py-2.5 text-xs text-emerald-950 shadow-2xs">
        <span className="rounded-md bg-emerald-600 px-2 py-0.5 text-[9.5px] sm:text-[10px] font-extrabold uppercase tracking-wider text-white shadow-xs shrink-0 whitespace-nowrap mt-0.5 sm:mt-0">
          WebP Only
        </span>
        <span className="text-[11px] sm:text-xs font-medium text-emerald-900 leading-relaxed">
          All banner and reel advertisements support <strong>WebP (.webp)</strong> images for
          maximum Google PageSpeed performance. Uploaded images are automatically verified and converted to WebP.
        </span>
      </div>

      {/* Navigation Tabs */}
      <AdSlotsNavBar
        tab={tab}
        setTab={setTab}
        slots={SLOTS}
        slotCounts={slotCounts}
        trashCount={trash.length}
        isTrash={isTrash}
        slot={slot}
        slotMode={slotMode}
        onSlotModeChange={(mode) => {
          setSlotMode(mode);
          saveAdSlotMode(slot, mode);
        }}
        isEnterprise={isEnterprise}
        isEnterprisePlus={isEnterprisePlus}
      />

      {/* Main Tab Content */}
      {(tab === "hero_showcase" || tab === "reel_ads") && !isEnterprisePlus ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
            <Lock className="h-8 w-8 text-slate-400" />
          </div>
          <h3 className="mt-4 text-base font-semibold text-slate-800">Premium Feature Locked</h3>
          <p className="mt-1 max-w-sm text-sm text-slate-500">
            The {SLOTS.find((s) => s.key === tab)?.label} advertisement slot is exclusively
            available on Enterprise Plus licenses. Please upgrade your license to unlock this slot.
          </p>
          <button
            onClick={() => navigate({ to: "/admin/settings", search: { tab: "activate" } })}
            className="mt-6 inline-flex items-center gap-2 rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
          >
            Activate Website
          </button>
        </div>
      ) : isTrash ? (
        <AdTrashDrawer
          trash={trash}
          slots={SLOTS}
          onRestore={onRestore}
          onPurge={onPurge}
        />
      ) : slotMode === "script" ? (
        <ScriptAdEditor
          slotScript={slotScript}
          setSlotScript={setSlotScript}
          onSave={onSave}
          sampleAdSense={SAMPLE_GOOGLE_ADSENSE}
        />
      ) : (
        <div className="space-y-4">
          {/* Popup Timing & Frequency Settings */}
          {tab === "popup" && (
            <PopupTimingCard
              popupConfig={popupConfig}
              setPopupConfig={setPopupConfig}
              rotation={rotation}
              setRotation={setRotation}
            />
          )}

          {/* Reel Ads guidance banner */}
          {tab === "reel_ads" && <ReelAdsGuidanceCard />}

          {/* Ad Count Bar & Controls */}
          <AdSlotToolbar
            adsCount={ads.length}
            slotLabel={activeSlot?.label}
            tab={tab}
            isEnterprise={isEnterprise}
            rotation={rotation}
            setRotation={setRotation}
            searchQuery={searchQuery}
            setSearchQuery={(q) => {
              setSearchQuery(q);
              setPage(1);
            }}
            onAddAd={handleAddAd}
            onClearSearch={() => setSearchQuery("")}
          />

          {ads.length === 0 ? (
            <AdSlotEmptyState
              label={activeSlot?.label}
              shownOn={activeSlot?.shownOn}
              onAddAd={handleAddAd}
            />
          ) : (
            <div ref={tableRef} className="space-y-4">
              {paginatedAds.map((ad, indexOnPage) => (
                <AdItemCard
                  key={ad.id}
                  ad={ad}
                  indexOnPage={indexOnPage}
                  page={page}
                  itemsPerPage={ITEMS_PER_PAGE}
                  totalAdsCount={ads.length}
                  slot={slot}
                  isEnterprise={isEnterprise}
                  isJustAdded={ad.id === newlyAddedId}
                  onUpdate={update}
                  onMove={moveAd}
                  onToggleFeatured={toggleFeatured}
                  onRemove={remove}
                  formatExpiresAt={formatExpiresAt}
                />
              ))}
            </div>
          )}

          {!isTrash && totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-slate-200 pt-4">
              <p className="text-xs text-slate-500 font-medium">
                Showing {(page - 1) * ITEMS_PER_PAGE + 1} -{" "}
                {Math.min(page * ITEMS_PER_PAGE, filteredAds.length)} of {filteredAds.length} ads
              </p>
              <div className="flex gap-2">
                <button
                  disabled={page === 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="rounded border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  Previous
                </button>
                <div className="flex items-center justify-center min-w-8 text-xs font-bold text-slate-900">
                  {page} / {totalPages}
                </div>
                <button
                  disabled={page === totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  className="rounded border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  Next
                </button>
              </div>
            </div>
          )}

          <div className="flex items-center justify-end rounded-xl border border-slate-200 bg-slate-50 p-4">
            <button
              type="button"
              onClick={() => onSave()}
              className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-slate-800 transition active:scale-98"
            >
              <Save className="h-4 w-4 text-emerald-400" /> Save
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
