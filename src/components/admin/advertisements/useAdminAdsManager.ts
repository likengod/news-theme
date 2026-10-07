import { useEffect, useMemo, useState } from "react";
import { useRouter } from "@tanstack/react-router";
import { toast } from "sonner";
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
import { SLOTS, type Tab } from "./types";

function uid() {
  return `prm-${Math.random().toString(36).slice(2, 9)}`;
}

export function useAdminAdsManager(isEnterprise: boolean) {
  const router = useRouter();

  const [tab, setTab] = useState<Tab>("home1");
  const [ads, setAds] = useState<AdSlideItem[]>([]);
  const [trash, setTrash] = useState<AdSlideItem[]>([]);
  const [rotation, setRotation] = useState<number>(5);
  const [popupConfig, setPopupConfig] = useState<PopupConfig>(defaultPopupConfig);
  const [slotMode, setSlotMode] = useState<AdSlotMode>("image");
  const [slotScript, setSlotScript] = useState<string>("");
  const [newlyAddedId, setNewlyAddedId] = useState<string | null>(null);

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
    }
  }, [tab, isEnterprise]);

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

  const handleAddAd = (onAddedCallback?: () => void) => {
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
    if (onAddedCallback) {
      setTimeout(onAddedCallback, 100);
    }
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

  return {
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
  };
}
