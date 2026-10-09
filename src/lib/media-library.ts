// Lightweight media library backed by IndexedDB and Memory Cache.

export type MediaUsage =
  | "article"
  | "page"
  | "site-logo"
  | "site-og"
  | "site-favicon"
  | "advertisement"
  | "other";

export interface MediaItem {
  id: string;
  name: string;
  type: string; // mime
  size: number; // bytes
  dataUrl: string; // base64 data URL or public URL
  url?: string;
  usage: MediaUsage;
  altText?: string;
  description?: string;
  createdAt: number;
}

import {
  getMediaListServer,
  uploadMediaServer,
  updateMediaServer,
  replaceMediaFileServer,
  batchUpdateAltTextServer,
  deleteMediaServer,
  deleteMultipleMediaServer,
} from "./media.functions";
import {
  protectCanvasAndExport,
  embedLayer1Signature,
  type ProtectedImagePayload,
} from "./image-protection";

/**
 * Automatically cleans and formats a raw file name into a human-friendly Alt Text for SEO
 * e.g., "rahul_gandhi-speech (1).webp" -> "Rahul Gandhi Speech"
 */
export function deriveAltText(filename: string): string {
  if (!filename) return "";
  // Remove file extension
  let name = filename.replace(/\.[a-zA-Z0-9]+$/, "");
  // Replace numbers in parenthesis e.g. (1), [2], (6)
  name = name.replace(/[\(\[\{]\d+[\)\]\}]/g, " ");
  // Replace underscores, dashes, dots, pluses with spaces
  name = name.replace(/[_\-\.\+]/g, " ");
  // Remove duplicate spaces
  name = name.replace(/\s+/g, " ").trim();
  if (!name) return filename;
  // Capitalize words nicely
  return name
    .split(" ")
    .map((w) => {
      if (w.length <= 3 && w.toUpperCase() === w) return w;
      return w.charAt(0).toUpperCase() + w.slice(1).toLowerCase();
    })
    .join(" ");
}

const BROADCAST_KEY = "nt_media_library_sync";
let syncChannel: BroadcastChannel | null = null;
if (typeof window !== "undefined" && typeof BroadcastChannel !== "undefined") {
  try {
    syncChannel = new BroadcastChannel(BROADCAST_KEY);
    syncChannel.onmessage = (e) => {
      if (e?.data?.type === "MEDIA_CHANGE") {
        mediaLibrary.refresh(true);
      }
    };
  } catch {}
}

const LOCAL_STORAGE_KEY = "nt_media_library_v1";

function loadLocalStorageMedia(): MediaItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {}
  return [];
}

function saveLocalStorageMedia(items: MediaItem[]) {
  if (typeof window === "undefined") return;
  try {
    const slice = items.slice(0, 100).map((it) => ({
      ...it,
      dataUrl: it.dataUrl?.startsWith("data:") && it.url ? it.url : it.dataUrl,
    }));
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(slice));
  } catch (e) {
    console.warn("[MediaLibrary] localStorage quota warning:", e);
  }
}

let memoryCache: MediaItem[] = loadLocalStorageMedia();

function notifyChange(skipBroadcast = false) {
  if (typeof window !== "undefined") {
    saveLocalStorageMedia(memoryCache);
    window.dispatchEvent(new Event("media-library-change"));
    if (!skipBroadcast && syncChannel) {
      try {
        syncChannel.postMessage({ type: "MEDIA_CHANGE", ts: Date.now() });
      } catch {}
    }
  }
}

// Load from Server on init
if (typeof window !== "undefined") {
  setTimeout(() => {
    mediaLibrary.refresh(true).catch(() => {});
  }, 0);
}

export const mediaLibrary = {
  list(): MediaItem[] {
    return [...memoryCache].sort((a, b) => b.createdAt - a.createdAt);
  },
  async refresh(fromBroadcast = false): Promise<MediaItem[]> {
    try {
      const serverItems = await getMediaListServer();
      if (serverItems && Array.isArray(serverItems)) {
        const serverIdMap = new Set(serverItems.map((s: any) => s.id));
        const unsynced = memoryCache.filter((m) => !serverIdMap.has(m.id));
        const combined = [...serverItems, ...unsynced];
        memoryCache = combined.map((m: any) => ({
          ...m,
          url: m.url || m.dataUrl,
          dataUrl: m.dataUrl || m.url,
        }));
        notifyChange(fromBroadcast);
      }
    } catch (err) {
      console.warn("Failed to load media library from server:", err);
    }
    return this.list();
  },
  async add(item: Omit<MediaItem, "id" | "createdAt">): Promise<MediaItem> {
    const id = `m_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const effectiveAltText = item.altText || deriveAltText(item.name);

    let publicUrl = item.dataUrl;
    try {
      // Call server to persist and get public URL
      const res = await uploadMediaServer({
        data: {
          id,
          name: item.name,
          type: item.type,
          size: item.size,
          dataUrl: item.dataUrl,
          usage: item.usage,
          altText: effectiveAltText,
          description: item.description,
        },
      });
      if (res?.url) {
        publicUrl = res.url;
      }
    } catch (err) {
      console.warn("uploadMediaServer warning (saved to local cache):", err);
    }

    const full: MediaItem = {
      ...item,
      id,
      altText: effectiveAltText,
      dataUrl: publicUrl,
      url: publicUrl,
      createdAt: Date.now(),
    };

    memoryCache = [full, ...memoryCache.filter((m) => m.id !== id)];
    notifyChange();
    return full;
  },
  get(id: string): MediaItem | undefined {
    return memoryCache.find((m) => m.id === id);
  },
  async update(
    id: string,
    patch: Partial<Pick<MediaItem, "name" | "usage" | "altText" | "description">>,
  ) {
    memoryCache = memoryCache.map((m) => (m.id === id ? { ...m, ...patch } : m));
    notifyChange();
    await updateMediaServer({ data: { id, ...patch } });
  },
  async replace(
    id: string,
    file: File,
    customName?: string,
    customAltText?: string,
  ): Promise<MediaItem> {
    const dataUrl = await fileToDataUrl(file);
    const size = Math.round(dataUrl.length * 0.75);
    const type = file.type.startsWith("image/") ? "image/webp" : file.type || "application/octet-stream";
    const existing = this.get(id);
    const effectiveName = customName || (existing ? existing.name : file.name);
    const effectiveAltText = customAltText || (existing?.altText ? existing.altText : deriveAltText(effectiveName));

    const res = await replaceMediaFileServer({
      data: {
        id,
        dataUrl,
        size,
        type,
        name: effectiveName,
        altText: effectiveAltText,
      },
    });

    const updated: MediaItem = {
      ...(existing || { id, usage: "other", createdAt: Date.now() }),
      name: effectiveName,
      altText: effectiveAltText,
      dataUrl: res.url,
      size,
      type,
    };

    memoryCache = memoryCache.map((m) => (m.id === id ? updated : m));
    notifyChange();
    return updated;
  },
  async autoFillMissingAltTexts(): Promise<number> {
    const missing = memoryCache.filter((m) => !m.altText || m.altText.trim() === "");
    if (!missing.length) return 0;
    const updates = missing.map((m) => ({
      id: m.id,
      altText: deriveAltText(m.name),
    }));
    memoryCache = memoryCache.map((m) => {
      const u = updates.find((x) => x.id === m.id);
      return u ? { ...m, altText: u.altText } : m;
    });
    notifyChange();
    await batchUpdateAltTextServer({ data: { items: updates } });
    return updates.length;
  },
  async remove(id: string) {
    memoryCache = memoryCache.filter((m) => m.id !== id);
    notifyChange();
    await deleteMediaServer({ data: { id } });
  },
  async removeMultiple(ids: string[]) {
    if (!ids || ids.length === 0) return;
    const set = new Set(ids);
    memoryCache = memoryCache.filter((m) => !set.has(m.id));
    notifyChange();
    await deleteMultipleMediaServer({ data: { ids } });
  },
  clear() {
    memoryCache = [];
    notifyChange();
  },
};

/**
 * Retrieves current site settings for image protection branding
 */
function getProtectionConfig() {
  let domain = typeof window !== "undefined" ? window.location.hostname : "todaytripura.com";
  let siteName = "Today Tripura";
  let socials: ProtectedImagePayload["socials"] = {};

  if (typeof window !== "undefined") {
    try {
      const raw = localStorage.getItem("nt:site-settings");
      if (raw) {
        const s = JSON.parse(raw);
        if (s.siteName) siteName = s.siteName;
        if (s.facebook) socials.facebook = s.facebook;
        if (s.twitter) socials.twitter = s.twitter;
        if (s.instagram) socials.instagram = s.instagram;
        if (s.youtube) socials.youtube = s.youtube;
        if (s.telegram) socials.telegram = s.telegram;
      }
    } catch {}
  }

  return { domain, siteName, socials };
}

export function fileToDataUrl(
  file: File,
  watermarkData?: string,
  maxDimension = 1920,
  quality = 0.82,
): Promise<string> {
  if (
    typeof window === "undefined" ||
    typeof document === "undefined" ||
    !file.type.startsWith("image/") ||
    file.type === "image/svg+xml"
  ) {
    return new Promise((resolve, reject) => {
      const r = new FileReader();
      r.onload = () => resolve(String(r.result));
      r.onerror = () => reject(r.error);
      r.readAsDataURL(file);
    });
  }

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const rawDataUrl = String(e.target?.result || "");
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        if (!ctx) {
          resolve(rawDataUrl);
          return;
        }

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(img, 0, 0, width, height);

        // Apply Dual-Layer Image Protection:
        // Layer 2: Forensic Pixel Watermarking (weaves invisible DNA into pixels)
        // Layer 1: Cryptographic EXIF Signature (embeds certified metadata)
        const { domain, siteName, socials } = getProtectionConfig();
        const ownershipText =
          watermarkData ||
          `This image belongs to ${domain}. All rights reserved. Registered with ${siteName}.`;

        const protectedDataUrl = protectCanvasAndExport(
          canvas,
          {
            domain,
            siteName,
            ownershipText,
            socials,
            strength: 3,
          },
          "image/webp",
          quality,
        );

        resolve(protectedDataUrl);
      };
      img.onerror = () => resolve(rawDataUrl);
      img.src = rawDataUrl;
    };
    reader.onerror = () => resolve("");
    reader.readAsDataURL(file);
  });
}

export const MAX_MEDIA_FILE_SIZE = 1 * 1024 * 1024; // 1 MB

export async function trackUpload(
  file: File,
  usage: MediaUsage = "other",
  customName?: string,
  customDescription?: string,
  watermarkData?: string,
  customAltText?: string,
): Promise<MediaItem> {
  if (file.size > MAX_MEDIA_FILE_SIZE) {
    throw new Error(
      `File "${file.name}" (${formatBytes(file.size)}) exceeds the 1 MB limit. Please upload a file less than 1 MB.`,
    );
  }
  const dataUrl = await fileToDataUrl(file, watermarkData);
  const effectiveName = customName || file.name;
  const effectiveAltText = customAltText || deriveAltText(effectiveName);

  return await mediaLibrary.add({
    name: effectiveName,
    type: file.type.startsWith("image/") ? "image/webp" : file.type || "application/octet-stream",
    size: Math.round(dataUrl.length * 0.75),
    dataUrl,
    usage,
    altText: effectiveAltText,
    description: customDescription,
  });
}

export function formatBytes(n: number) {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / (1024 * 1024)).toFixed(2)} MB`;
}
