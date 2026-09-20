import { z } from "zod";
import { createServerFn } from "@tanstack/react-start";
import { requireAdmin } from "../auth-middleware";
import { query } from "../db.server";
import { getCached, setCached, clearCache } from "./server-cache";

import adHome2_1 from "@/assets/news-oil.webp";
import adHome2_2 from "@/assets/news-fed.webp";
import adHome2_3 from "@/assets/news-tech.webp";
import adHome2_4 from "@/assets/news-crypto.webp";
import adHome2_5 from "@/assets/news-wallstreet.webp";
import adHome2_6 from "@/assets/hero-markets.webp";

export type AdOrientation = "portrait" | "landscape";
export type AdType = "image" | "script";

export type AdSlideItem = {
  id: string;
  type?: AdType; // "image" (default) or "script"
  scriptCode?: string; // HTML / JS snippet for Google AdSense / 3rd party script
  image: string;
  imagePortrait?: string;
  imageLandscape?: string;
  href: string;
  label?: string;
  expiresAt?: string | null; // ISO date; auto-trash when past
  deletedAt?: string | null; // ISO timestamp; purge after 30 days
  slot?: AdSlot; // used in trash to know where to restore
  orientation?: AdOrientation; // preferred display orientation
  isFeatured?: boolean; // Featured/Priority: shows first before other ads
};

export type PopupConfig = {
  frequencyMinutes: number; // Interval between popup appearances: 0 (every page view), 5, 10, 15, 30, 60, -1 (once per session)
  initialDelaySeconds: number; // Delay in seconds after page load before showing popup (e.g. 7)
  closeDelaySeconds: number; // Countdown seconds before close button (X) unlocks (e.g. 6)
  rotateOnInterval?: boolean; // Whether the popup advances to the next ad on each interval appearance (default: true)
};

export const defaultPopupConfig: PopupConfig = {
  frequencyMinutes: 10,
  initialDelaySeconds: 7,
  closeDelaySeconds: 6,
  rotateOnInterval: true,
};

export const defaultAdSlides: AdSlideItem[] = [
  {
    id: "ad-1",
    image: "https://placehold.co/600x800/e2e8f0/475569?text=Portrait+Ad\\n600x800",
    href: "#",
    label: "Sponsored",
  },
  {
    id: "ad-2",
    image: "https://placehold.co/600x800/f8fafc/94a3b8?text=Portrait+Ad\\n600x800",
    href: "#",
    label: "Sponsored",
  },
  {
    id: "ad-3",
    image: "https://placehold.co/600x800/f1f5f9/64748b?text=Portrait+Ad\\n600x800",
    href: "#",
    label: "Sponsored",
  },
];

export const defaultAdSlidesHome2: AdSlideItem[] = [
  {
    id: "ad2-1",
    image: "https://placehold.co/406x196/e2e8f0/475569?text=Landscape+Ad\\n406x196",
    href: "#",
    label: "Sponsored",
  },
  {
    id: "ad2-2",
    image: "https://placehold.co/406x196/f8fafc/94a3b8?text=Landscape+Ad\\n406x196",
    href: "#",
    label: "Sponsored",
  },
  {
    id: "ad2-3",
    image: "https://placehold.co/406x196/f1f5f9/64748b?text=Landscape+Ad\\n406x196",
    href: "#",
    label: "Sponsored",
  },
  {
    id: "ad2-4",
    image: "https://placehold.co/406x196/e2e8f0/475569?text=Landscape+Ad\\n406x196",
    href: "#",
    label: "Sponsored",
  },
  {
    id: "ad2-5",
    image: "https://placehold.co/406x196/f8fafc/94a3b8?text=Landscape+Ad\\n406x196",
    href: "#",
    label: "Sponsored",
  },
  {
    id: "ad2-6",
    image: "https://placehold.co/406x196/f1f5f9/64748b?text=Landscape+Ad\\n406x196",
    href: "#",
    label: "Sponsored",
  },
];

export const defaultAdSlidesAd3: AdSlideItem[] = [
  {
    id: "ad3-1",
    image: "https://placehold.co/600x800/e2e8f0/475569?text=Portrait+Ad\\n600x800",
    href: "#",
    label: "Sponsored",
  },
  {
    id: "ad3-2",
    image: "https://placehold.co/600x800/f8fafc/94a3b8?text=Portrait+Ad\\n600x800",
    href: "#",
    label: "Sponsored",
  },
  {
    id: "ad3-3",
    image: "https://placehold.co/600x800/f1f5f9/64748b?text=Portrait+Ad\\n600x800",
    href: "#",
    label: "Sponsored",
  },
];

export const defaultAdSlidesPopup: AdSlideItem[] = [
  {
    id: "pop-1",
    image: "https://placehold.co/600x800/e2e8f0/475569?text=Popup+Ad\\n600x800",
    href: "#",
    label: "Sponsored",
    orientation: "portrait",
  },
  {
    id: "pop-2",
    image: "https://placehold.co/1200x675/f8fafc/94a3b8?text=Popup+Ad\\n1200x675",
    href: "#",
    label: "Sponsored",
    orientation: "landscape",
  },
];

export const defaultAdSlidesLeaderboard: AdSlideItem[] = [
  {
    id: "lead-1",
    imageLandscape: "https://placehold.co/1200x150/e2e8f0/475569?text=Leaderboard\\n1200x150",
    imagePortrait: "https://placehold.co/600x100/e2e8f0/475569?text=Leaderboard\\n600x100",
    image: "https://placehold.co/1200x150/e2e8f0/475569?text=Leaderboard\\n1200x150",
    href: "#",
    label: "Sponsored",
    orientation: "landscape",
  },
];

export type AdSlot =
  | "home1"
  | "home2"
  | "ad3"
  | "popup"
  | "leaderboard"
  | "hero_showcase"
  | "reel_ads";
export type AdSlotMode = "image" | "script";

export type AdConfiguration = {
  slots: Record<AdSlot, AdSlideItem[]>;
  modes: Record<AdSlot, AdSlotMode>;
  scripts: Record<AdSlot, string>;
  rotations: Record<AdSlot, number>;
  popupConfig?: PopupConfig;
};

const SLOT_MODE_KEY = "nt:ad-slot-mode";
const SLOT_SCRIPT_KEY = "nt:ad-slot-script";

const DEFAULT_SLOT_MODE: Record<AdSlot, AdSlotMode> = {
  home1: "image",
  home2: "image",
  ad3: "image",
  popup: "image",
  leaderboard: "image",
  hero_showcase: "image",
  reel_ads: "image",
};

export function loadAdSlotMode(slot: AdSlot): AdSlotMode {
  if (typeof window === "undefined") return DEFAULT_SLOT_MODE[slot];
  try {
    const raw = localStorage.getItem(SLOT_MODE_KEY);
    const map = raw ? (JSON.parse(raw) as Record<string, AdSlotMode>) : {};
    return map[slot] || DEFAULT_SLOT_MODE[slot];
  } catch {
    return DEFAULT_SLOT_MODE[slot];
  }
}

export function saveAdSlotMode(slot: AdSlot, mode: AdSlotMode) {
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem(SLOT_MODE_KEY);
    const map = raw ? (JSON.parse(raw) as Record<string, AdSlotMode>) : {};
    map[slot] = mode;
    localStorage.setItem(SLOT_MODE_KEY, JSON.stringify(map));
    window.dispatchEvent(new Event("nt:ads-updated"));
    syncAdConfigurationToServer();
  } catch {
    /* noop */
  }
}

export function loadAdSlotScript(slot: AdSlot): string {
  if (typeof window === "undefined") return "";
  try {
    const raw = localStorage.getItem(SLOT_SCRIPT_KEY);
    const map = raw ? (JSON.parse(raw) as Record<string, string>) : {};
    return map[slot] || "";
  } catch {
    return "";
  }
}

export function saveAdSlotScript(slot: AdSlot, script: string) {
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem(SLOT_SCRIPT_KEY);
    const map = raw ? (JSON.parse(raw) as Record<string, string>) : {};
    map[slot] = script;
    localStorage.setItem(SLOT_SCRIPT_KEY, JSON.stringify(map));
    window.dispatchEvent(new Event("nt:ads-updated"));
    syncAdConfigurationToServer();
  } catch {
    /* noop */
  }
}

const ADS_KEYS: Record<AdSlot, string> = {
  home1: "nt:ads:v2:home1",
  home2: "nt:ads:v2:home2",
  ad3: "nt:ads:v2:ad3",
  popup: "nt:ads:v2:popup",
  leaderboard: "nt:ads:v2:leaderboard",
  hero_showcase: "nt:ads:v2:hero_showcase",
  reel_ads: "nt:ads:v2:reel_ads",
};

const TRASH_KEY = "nt:site-ads-trash";
const TRASH_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

const ROTATION_KEY = "nt:site-ads-rotation"; // { [slot]: seconds }
const DEFAULT_ROTATION: Record<AdSlot, number> = {
  home1: 5,
  home2: 5,
  ad3: 5,
  popup: 6,
  leaderboard: 5,
  hero_showcase: 5,
  reel_ads: 5,
};

export function loadAdRotation(slot: AdSlot): number {
  if (typeof window === "undefined") return DEFAULT_ROTATION[slot];
  try {
    const raw = localStorage.getItem(ROTATION_KEY);
    const map = raw ? (JSON.parse(raw) as Record<string, number>) : {};
    const v = Number(map[slot]);
    return Number.isFinite(v) && v > 0 ? v : DEFAULT_ROTATION[slot];
  } catch {
    return DEFAULT_ROTATION[slot];
  }
}

export function saveAdRotation(slot: AdSlot, seconds: number) {
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem(ROTATION_KEY);
    const map = raw ? (JSON.parse(raw) as Record<string, number>) : {};
    map[slot] = Math.max(1, Math.round(seconds));
    localStorage.setItem(ROTATION_KEY, JSON.stringify(map));
    window.dispatchEvent(new Event("nt:ads-updated"));
    syncAdConfigurationToServer();
  } catch {
    /* noop */
  }
}

export function injectReelAds<T>(
  items: T[],
  ads: AdSlideItem[],
  intervalOrOptions: number | { interval?: number; firstAfter?: number } = 3,
): ({ isAd: false; item: T; originalIndex: number } | { isAd: true; ad: AdSlideItem })[] {
  const validAds = ads.filter((a) => !!(a.image || a.imagePortrait || a.imageLandscape));
  if (validAds.length === 0) {
    return items.map((item, originalIndex) => ({ isAd: false, item, originalIndex }));
  }

  const sortedAds = [...validAds].sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
  const result: (
    | { isAd: false; item: T; originalIndex: number }
    | { isAd: true; ad: AdSlideItem }
  )[] = [];

  const opts =
    typeof intervalOrOptions === "number"
      ? { interval: intervalOrOptions, firstAfter: intervalOrOptions }
      : {
          interval: intervalOrOptions?.interval ?? 3,
          firstAfter: intervalOrOptions?.firstAfter ?? intervalOrOptions?.interval ?? 3,
        };

  let adIdx = 0;
  let itemsSinceLastAd = 0;
  for (let i = 0; i < items.length; i++) {
    result.push({ isAd: false, item: items[i], originalIndex: i });
    itemsSinceLastAd++;
    const threshold = adIdx === 0 ? opts.firstAfter : opts.interval;
    if (itemsSinceLastAd >= threshold) {
      result.push({ isAd: true, ad: sortedAds[adIdx % sortedAds.length] });
      adIdx++;
      itemsSinceLastAd = 0;
    }
  }

  return result;
}

const POPUP_CONFIG_KEY = "nt:popup-ad-config";

export function loadPopupConfig(): PopupConfig {
  if (typeof window === "undefined") return defaultPopupConfig;
  try {
    const raw = localStorage.getItem(POPUP_CONFIG_KEY);
    if (!raw) return defaultPopupConfig;
    const p = JSON.parse(raw);
    return {
      frequencyMinutes:
        typeof p.frequencyMinutes === "number"
          ? p.frequencyMinutes
          : defaultPopupConfig.frequencyMinutes,
      initialDelaySeconds:
        typeof p.initialDelaySeconds === "number"
          ? p.initialDelaySeconds
          : defaultPopupConfig.initialDelaySeconds,
      closeDelaySeconds:
        typeof p.closeDelaySeconds === "number"
          ? p.closeDelaySeconds
          : defaultPopupConfig.closeDelaySeconds,
      rotateOnInterval: p.rotateOnInterval !== false,
    };
  } catch {
    return defaultPopupConfig;
  }
}

export function savePopupConfig(cfg: Partial<PopupConfig>) {
  if (typeof window === "undefined") return;
  try {
    const cur = loadPopupConfig();
    const updated = { ...cur, ...cfg };
    localStorage.setItem(POPUP_CONFIG_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event("nt:ads-updated"));
    syncAdConfigurationToServer();
  } catch {
    /* noop */
  }
}

const DEFAULTS: Record<AdSlot, AdSlideItem[]> = {
  home1: defaultAdSlides,
  home2: defaultAdSlidesHome2,
  ad3: defaultAdSlidesAd3,
  popup: defaultAdSlidesPopup,
  leaderboard: defaultAdSlidesLeaderboard,
  hero_showcase: defaultAdSlidesHome2,
  reel_ads: [],
};

const inMemoryAdsCache: Partial<Record<AdSlot, AdSlideItem[]>> = {};

/**
 * Robust localStorage.setItem wrapper that intercepts QuotaExceededError,
 * frees up stale/heavy cached items, and ensures site code never crashes.
 */
export function safeSetItem(key: string, value: string): boolean {
  if (typeof window === "undefined") return false;
  try {
    localStorage.setItem(key, value);
    return true;
  } catch (e: any) {
    console.warn(`[Storage] Quota exceeded for "${key}". Recovering space...`, e);

    // 1. Prune media library history if heavy (> 150KB)
    try {
      const rawMedia = localStorage.getItem("nt_media_library_v1");
      if (rawMedia && rawMedia.length > 150000) {
        try {
          const m = JSON.parse(rawMedia);
          if (Array.isArray(m)) {
            localStorage.setItem("nt_media_library_v1", JSON.stringify(m.slice(0, 2)));
          }
        } catch {
          localStorage.removeItem("nt_media_library_v1");
        }
      }
    } catch {}

    // 2. Clear trash cache if present
    try {
      localStorage.removeItem("nt:site-ads-trash");
    } catch {}

    // 3. Retry write
    try {
      localStorage.setItem(key, value);
      return true;
    } catch {}

    // 4. If still overflowing, prune other slot caches
    try {
      const adSlots: AdSlot[] = ["leaderboard", "popup", "ad3", "home2", "home1", "hero_showcase"];
      for (const slot of adSlots) {
        const slotKey = ADS_KEYS[slot];
        if (slotKey && slotKey !== key && localStorage.getItem(slotKey)) {
          localStorage.removeItem(slotKey);
          try {
            localStorage.setItem(key, value);
            return true;
          } catch {}
        }
      }
    } catch {}

    // 5. Final fallback: avoid crashing
    try {
      localStorage.setItem(key, value);
      return true;
    } catch {
      console.warn(
        `[Storage] Browser quota full for "${key}". Data saved to memory and syncing to server database.`,
      );
      return false;
    }
  }
}

function sanitizeSlotAds(slot: AdSlot, list: AdSlideItem[]): AdSlideItem[] {
  if (!Array.isArray(list)) return list;
  if (slot === "home1" || slot === "ad3" || slot === "reel_ads") {
    return list.map((ad) => {
      if (ad.imagePortrait) {
        return {
          ...ad,
          image: ad.imagePortrait,
          orientation: "portrait" as const,
          imageLandscape: undefined,
        };
      }
      return ad;
    });
  }
  if (slot === "home2") {
    return list.map((ad) => {
      if (ad.imageLandscape) {
        return {
          ...ad,
          image: ad.imageLandscape,
          orientation: "landscape" as const,
          imagePortrait: undefined,
        };
      }
      return ad;
    });
  }
  return list;
}

function readRaw(slot: AdSlot): AdSlideItem[] {
  if (inMemoryAdsCache[slot]) return inMemoryAdsCache[slot]!;
  if (typeof window === "undefined") return sanitizeSlotAds(slot, DEFAULTS[slot]);
  try {
    const raw = localStorage.getItem(ADS_KEYS[slot]);
    const parsed = sanitizeSlotAds(slot, raw ? (JSON.parse(raw) as AdSlideItem[]) : DEFAULTS[slot]);
    inMemoryAdsCache[slot] = parsed;
    return parsed;
  } catch {
    return sanitizeSlotAds(slot, DEFAULTS[slot]);
  }
}

function writeRaw(slot: AdSlot, ads: AdSlideItem[]) {
  const sanitized = sanitizeSlotAds(slot, ads);
  inMemoryAdsCache[slot] = sanitized;
  safeSetItem(ADS_KEYS[slot], JSON.stringify(sanitized));
}

export function loadTrash(): AdSlideItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(TRASH_KEY);
    const items: AdSlideItem[] = raw ? JSON.parse(raw) : [];
    const now = Date.now();
    // Auto purge anything older than 30 days
    const fresh = items.filter(
      (i) => i.deletedAt && now - new Date(i.deletedAt).getTime() < TRASH_TTL_MS,
    );
    if (fresh.length !== items.length) {
      safeSetItem(TRASH_KEY, JSON.stringify(fresh));
    }
    return fresh;
  } catch {
    return [];
  }
}

export function saveTrash(items: AdSlideItem[]) {
  safeSetItem(TRASH_KEY, JSON.stringify(items));
  if (typeof window !== "undefined") {
    try {
      window.dispatchEvent(new Event("nt:ads-updated"));
    } catch {}
  }
}

/** Automatically cleans up oversized or legacy base64 entries from localStorage to maintain healthy quota */
export function cleanCloggedStorage() {
  if (typeof window === "undefined") return;
  try {
    let totalChars = 0;
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k) totalChars += (localStorage.getItem(k) || "").length;
    }

    // If usage is above ~1 MB (approx 1,000,000 chars), perform deep cleaning
    if (totalChars > 1000000) {
      console.warn(
        `[Storage] High localStorage usage (${Math.round(totalChars / 1024)} KB). Deep cleaning bulky storage...`,
      );

      // 1. Purge trash cache
      localStorage.removeItem(TRASH_KEY);

      // 2. Clear or aggressively filter media library
      const rawMedia = localStorage.getItem("nt_media_library_v1");
      if (rawMedia) {
        try {
          const media = JSON.parse(rawMedia);
          if (Array.isArray(media)) {
            // Drop any item over 60 KB to prevent quota exhaustion
            const light = media
              .filter((m: any) => !m?.dataUrl || m.dataUrl.length < 60000)
              .slice(0, 3);
            if (light.length > 0) {
              localStorage.setItem("nt_media_library_v1", JSON.stringify(light));
            } else {
              localStorage.removeItem("nt_media_library_v1");
            }
          }
        } catch {
          localStorage.removeItem("nt_media_library_v1");
        }
      }

      // 3. Inspect ad slot keys for oversized (> 200 KB) raw base64 data
      const adSlots: AdSlot[] = [
        "reel_ads",
        "home1",
        "home2",
        "ad3",
        "popup",
        "leaderboard",
        "hero_showcase",
      ];
      for (const slot of adSlots) {
        const slotKey = ADS_KEYS[slot];
        const raw = localStorage.getItem(slotKey);
        if (raw && raw.length > 200000) {
          // Cache in memory first so active session never loses it
          try {
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed)) inMemoryAdsCache[slot] = parsed;
          } catch {}
          console.warn(
            `[Storage] Evicting oversized local cache for slot "${slot}" (${Math.round(raw.length / 1024)} KB). (Data remains safe in server database).`,
          );
          localStorage.removeItem(slotKey);
        }
      }

      // Check remaining
      let finalChars = 0;
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k) finalChars += (localStorage.getItem(k) || "").length;
      }
      console.info(
        `[Storage] Deep clean finished. Storage freed to: ${Math.round(finalChars / 1024)} KB.`,
      );
    }
  } catch {}
}

/** Move all expired (past expiresAt) ads from every slot into trash. */
export function processExpiredAds() {
  if (typeof window === "undefined") return;
  cleanCloggedStorage();
  const now = Date.now();
  const trash = loadTrash();
  (Object.keys(ADS_KEYS) as AdSlot[]).forEach((slot) => {
    const list = readRaw(slot);
    const keep: AdSlideItem[] = [];
    list.forEach((ad) => {
      if (ad.expiresAt && new Date(ad.expiresAt).getTime() <= now) {
        trash.push({ ...ad, slot, deletedAt: new Date().toISOString() });
      } else {
        keep.push(ad);
      }
    });
    if (keep.length !== list.length) writeRaw(slot, keep);
  });
  saveTrash(trash);
}

export function loadAds(slot: AdSlot = "home1"): AdSlideItem[] {
  return readRaw(slot);
}

export function saveAds(a: AdSlideItem[], slot: AdSlot = "home1") {
  try {
    writeRaw(slot, a);
  } catch (err) {
    console.warn("[saveAds] writeRaw error handled:", err);
  }
  if (typeof window !== "undefined") {
    try {
      window.dispatchEvent(new Event("nt:ads-updated"));
    } catch {}
  }
  syncAdConfigurationToServer();
}

/** Soft-delete: remove from active slot, push to trash with deletedAt. */
export function trashAds(ids: string[], slot: AdSlot) {
  const list = readRaw(slot);
  const moving = list.filter((a) => ids.includes(a.id));
  const remaining = list.filter((a) => !ids.includes(a.id));
  writeRaw(slot, remaining);
  const trash = loadTrash();
  const now = new Date().toISOString();
  moving.forEach((m) => trash.push({ ...m, slot, deletedAt: now }));
  saveTrash(trash);
  syncAdConfigurationToServer();
}

/** Restore a trashed ad back into its slot. */
export function restoreFromTrash(id: string) {
  const trash = loadTrash();
  const item = trash.find((t) => t.id === id);
  if (!item) return;
  const slot: AdSlot = (item.slot as AdSlot) || "home1";
  const list = readRaw(slot);
  const { deletedAt, slot: _s, ...clean } = item;
  void deletedAt;
  void _s;
  writeRaw(slot, [...list, clean]);
  saveTrash(trash.filter((t) => t.id !== id));
  syncAdConfigurationToServer();
}

/** Permanently delete from trash. */
export function purgeFromTrash(id: string) {
  saveTrash(loadTrash().filter((t) => t.id !== id));
}

export const deleteAdStaticFilesServer = createServerFn({ method: "POST" })
  .middleware([requireAdmin])
  .validator((urls: string[]) => z.array(z.string()).parse(urls))
  .handler(async ({ data: urls }) => {
    const fs = await import("node:fs");
    const path = await import("node:path");
    const cwd = process.cwd();
    let deletedCount = 0;

    for (const url of urls) {
      if (!url || typeof url !== "string" || !(url.startsWith("/uploads/ads/") || url.startsWith("/uploads/promos/"))) continue;

      const filename = url.replace("/uploads/ads/", "").replace("/uploads/promos/", "");
      if (filename.includes("/") || filename.includes("..")) continue;

      const targetDirs = [
        path.join(cwd, "public", "uploads", "promos"),
        path.join(cwd, "dist", "client", "uploads", "promos"),
        path.join(cwd, "uploads", "promos"),
        path.join(cwd, "public", "uploads", "ads"),
        path.join(cwd, "dist", "client", "uploads", "ads"),
        path.join(cwd, "uploads", "ads"),
      ];

      for (const dir of targetDirs) {
        const filePath = path.join(dir, filename);
        try {
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            deletedCount++;
          }
        } catch (e) {
          console.error("[AdStorage] Failed to delete static ad file:", filePath, e);
        }
      }
    }
    return { success: true, deletedCount };
  });

export const getAdConfigurationServer = createServerFn({ method: "GET" }).handler(
  async (): Promise<AdConfiguration> => {
    const cacheKey = "ad_configuration_data";
    const cached = getCached<AdConfiguration>(cacheKey);
    if (cached) return cached;
    try {
      const rows = await query(
        "SELECT value FROM site_settings WHERE setting_key = 'ad_configuration_data'",
      );
      if (rows.length > 0 && rows[0].value) {
        let parsed = JSON.parse(rows[0].value) as AdConfiguration;
        if (parsed?.slots) {
          parsed.slots.reel_ads = parsed.slots.reel_ads || [];
          parsed.slots.hero_showcase = parsed.slots.hero_showcase || [];
        }
        if (parsed?.modes) {
          parsed.modes.reel_ads = parsed.modes.reel_ads || "image";
        }
        if (parsed?.rotations) {
          parsed.rotations.reel_ads = parsed.rotations.reel_ads || 5;
        }
        if (parsed?.scripts) {
          parsed.scripts.reel_ads = parsed.scripts.reel_ads || "";
        }

        try {
          const { persistAllAdConfiguration } = await import("../ad-storage.server");
          const { config: cleanConfig, changed } = persistAllAdConfiguration(parsed);
          if (changed) {
            parsed = cleanConfig;
            const updatedJson = JSON.stringify(cleanConfig);
            query(
              `UPDATE site_settings SET value = ? WHERE setting_key = 'ad_configuration_data'`,
              [updatedJson],
            ).catch((err) => console.error("[AdStorage] Background MySQL update error:", err));
          }
        } catch (storageErr) {
          console.error("[AdStorage] Auto-migration error:", storageErr);
        }

        setCached(cacheKey, parsed);
        return parsed;
      }
    } catch {}

    const config: AdConfiguration = {
      slots: {
        home1: defaultAdSlides,
        home2: defaultAdSlidesHome2,
        ad3: defaultAdSlidesAd3,
        popup: defaultAdSlidesPopup,
        leaderboard: defaultAdSlidesLeaderboard,
        hero_showcase: defaultAdSlidesHome2,
        reel_ads: [],
      },
      modes: {
        home1: "image",
        home2: "image",
        ad3: "image",
        popup: "image",
        leaderboard: "image",
        hero_showcase: "image",
        reel_ads: "image",
      },
      scripts: {
        home1: "",
        home2: "",
        ad3: "",
        popup: "",
        leaderboard: "",
        hero_showcase: "",
        reel_ads: "",
      },
      rotations: {
        home1: 5,
        home2: 5,
        ad3: 5,
        popup: 6,
        leaderboard: 5,
        hero_showcase: 5,
        reel_ads: 5,
      },
      popupConfig: defaultPopupConfig,
    };
    return config;
  },
);

export const saveAdConfigurationServer = createServerFn({ method: "POST" })
  .middleware([requireAdmin])
  .validator(
    (config) =>
      z
        .object({
          slots: z.record(z.any()),
          modes: z.record(z.any()),
          scripts: z.record(z.any()),
          rotations: z.record(z.any()),
          popupConfig: z.record(z.any()).optional(),
        })
        .parse(config) as AdConfiguration,
  )
  .handler(async ({ data }) => {
    let cleanData = data;
    try {
      const { persistAllAdConfiguration } = await import("../ad-storage.server");
      const { config: cleanConfig } = persistAllAdConfiguration(data);
      cleanData = cleanConfig;
    } catch (storageErr) {
      console.error("[AdStorage] Save persistence error:", storageErr);
    }

    const json = JSON.stringify(cleanData);
    await query(
      `INSERT INTO site_settings (setting_key, value) VALUES ('ad_configuration_data', ?)
       ON DUPLICATE KEY UPDATE value = ?`,
      [json, json],
    );
    clearCache("ad_configuration_data");
    return { success: true };
  });

export function syncAdConfigurationToServer() {
  const config: AdConfiguration = {
    slots: {
      home1: loadAds("home1"),
      home2: loadAds("home2"),
      ad3: loadAds("ad3"),
      popup: loadAds("popup"),
      leaderboard: loadAds("leaderboard"),
      hero_showcase: loadAds("hero_showcase"),
      reel_ads: loadAds("reel_ads"),
    },
    modes: {
      home1: loadAdSlotMode("home1"),
      home2: loadAdSlotMode("home2"),
      ad3: loadAdSlotMode("ad3"),
      popup: loadAdSlotMode("popup"),
      leaderboard: loadAdSlotMode("leaderboard"),
      hero_showcase: loadAdSlotMode("hero_showcase"),
      reel_ads: loadAdSlotMode("reel_ads"),
    },
    scripts: {
      home1: loadAdSlotScript("home1"),
      home2: loadAdSlotScript("home2"),
      ad3: loadAdSlotScript("ad3"),
      popup: loadAdSlotScript("popup"),
      leaderboard: loadAdSlotScript("leaderboard"),
      hero_showcase: loadAdSlotScript("hero_showcase"),
      reel_ads: loadAdSlotScript("reel_ads"),
    },
    rotations: {
      home1: loadAdRotation("home1"),
      home2: loadAdRotation("home2"),
      ad3: loadAdRotation("ad3"),
      popup: loadAdRotation("popup"),
      leaderboard: loadAdRotation("leaderboard"),
      hero_showcase: loadAdRotation("hero_showcase"),
      reel_ads: loadAdRotation("reel_ads"),
    },
    popupConfig: loadPopupConfig(),
  };
  saveAdConfigurationServer({ data: config }).catch(() => {});
}
