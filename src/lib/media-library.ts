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
  dataUrl: string; // base64 data URL
  usage: MediaUsage;
  altText?: string;
  description?: string;
  createdAt: number;
}

import {
  getMediaListServer,
  uploadMediaServer,
  updateMediaServer,
  deleteMediaServer,
} from "./media.functions";
import {
  protectCanvasAndExport,
  embedLayer1Signature,
  type ProtectedImagePayload,
} from "./image-protection";


let memoryCache: MediaItem[] = [];

// Load from Server on init
if (typeof window !== "undefined") {
  getMediaListServer()
    .then((data) => {
      if (data) {
        memoryCache = data;
        window.dispatchEvent(new Event("media-library-change"));
      }
    })
    .catch((err) => console.error("Failed to load media library from server:", err));
}

function notifyChange() {
  window.dispatchEvent(new Event("media-library-change"));
}

export const mediaLibrary = {
  list(): MediaItem[] {
    return memoryCache.sort((a, b) => b.createdAt - a.createdAt);
  },
  async add(item: Omit<MediaItem, "id" | "createdAt">): Promise<MediaItem> {
    const id = `m_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

    // Call server to persist and get public URL
    const res = await uploadMediaServer({
      data: {
        id,
        name: item.name,
        type: item.type,
        size: item.size,
        dataUrl: item.dataUrl,
        usage: item.usage,
        description: item.description,
      },
    });

    const full: MediaItem = {
      ...item,
      id,
      dataUrl: res.url, // replace base64 with public URL
      createdAt: Date.now(),
    };

    memoryCache = [full, ...memoryCache];
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
  async remove(id: string) {
    memoryCache = memoryCache.filter((m) => m.id !== id);
    notifyChange();
    await deleteMediaServer({ data: { id } });
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
): Promise<MediaItem> {
  if (file.size > MAX_MEDIA_FILE_SIZE) {
    throw new Error(
      `File "${file.name}" (${formatBytes(file.size)}) exceeds the 1 MB limit. Please upload a file less than 1 MB.`,
    );
  }
  const dataUrl = await fileToDataUrl(file, watermarkData);
  return await mediaLibrary.add({
    name: customName || file.name,
    type: file.type.startsWith("image/") ? "image/webp" : file.type || "application/octet-stream",
    size: Math.round(dataUrl.length * 0.75),
    dataUrl,
    usage,
    description: customDescription,
  });
}

export function formatBytes(n: number) {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / (1024 * 1024)).toFixed(2)} MB`;
}
