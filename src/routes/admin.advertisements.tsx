import { useMemo, useRef, useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Save } from "lucide-react";
import { useSiteSettings } from "@/components/site/AdSettingsContext";
import { isEnterpriseLicense, isEnterprisePlusLicense } from "@/lib/site-content";
import { saveAdSlotMode } from "@/lib/site-content";
import { PopupTimingCard } from "@/components/admin/advertisements/PopupTimingCard";
import { ScriptAdEditor } from "@/components/admin/advertisements/ScriptAdEditor";
import { AdTrashDrawer } from "@/components/admin/advertisements/AdTrashDrawer";
import { ReelAdsGuidanceCard } from "@/components/admin/advertisements/ReelAdsGuidanceCard";
import { PostAdsGuidanceCard } from "@/components/admin/advertisements/PostAdsGuidanceCard";
import { AdItemCard } from "@/components/admin/advertisements/AdItemCard";
import { AdSlotsNavBar } from "@/components/admin/advertisements/AdSlotsNavBar";
import { AdSlotToolbar } from "@/components/admin/advertisements/AdSlotToolbar";
import { AdSlotEmptyState } from "@/components/admin/advertisements/AdSlotEmptyState";
import { AdLicenseGuard } from "@/components/admin/advertisements/AdLicenseGuard";
import { useAdminAdsManager } from "@/components/admin/advertisements/useAdminAdsManager";
import { SLOTS, SAMPLE_GOOGLE_ADSENSE } from "@/components/admin/advertisements/types";

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

function AdvertisementsPage() {
  const s = useSiteSettings();
  const isEnterprise = isEnterpriseLicense(s);
  const isEnterprisePlus = isEnterprisePlusLicense(s);

  const {
    tab,
    setTab,
    ads,
    trash,
    rotation,
    setRotation,
    popupConfig,
    setPopupConfig,
    slotMode,
    setSlotMode,
    slotScript,
    setSlotScript,
    newlyAddedId,
    isTrash,
    slot,
    activeSlot,
    slotCounts,
    update,
    moveAd,
    toggleFeatured,
    remove,
    handleAddAd,
    onSave,
    onRestore,
    onPurge,
  } = useAdminAdsManager(isEnterprise);

  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const tableRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setPage(1);
  }, [tab]);

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

  const handleAddWithScroll = () => {
    handleAddAd(() => {
      if (tableRef.current) {
        tableRef.current.scrollTop = tableRef.current.scrollHeight;
      }
    });
  };

  const isLocked =
    ((tab === "hero_showcase" || tab === "reel_ads") && !isEnterprisePlus) ||
    (tab === "post_ads" && !isEnterprise && !isEnterprisePlus);

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

      {/* WebP Format Notice Banner */}
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
      {isLocked ? (
        <AdLicenseGuard
          tab={tab}
          activeSlot={activeSlot}
          isEnterprise={isEnterprise}
          isEnterprisePlus={isEnterprisePlus}
        />
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
          {tab === "popup" && (
            <PopupTimingCard
              popupConfig={popupConfig}
              setPopupConfig={setPopupConfig}
              rotation={rotation}
              setRotation={setRotation}
            />
          )}

          {tab === "reel_ads" && <ReelAdsGuidanceCard />}
          {tab === "post_ads" && <PostAdsGuidanceCard />}

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
            onAddAd={handleAddWithScroll}
            onClearSearch={() => setSearchQuery("")}
          />

          {ads.length === 0 ? (
            <AdSlotEmptyState
              label={activeSlot?.label}
              shownOn={activeSlot?.shownOn}
              onAddAd={handleAddWithScroll}
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
