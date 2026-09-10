import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import type { AdConfiguration, AdSlideItem, AdSlot } from "./site-content";

const MIME_TO_EXT: Record<string, string> = {
  "image/webp": ".webp",
  "image/jpeg": ".jpg",
  "image/jpg": ".jpg",
  "image/png": ".png",
  "image/gif": ".gif",
  "image/svg+xml": ".svg",
  "image/avif": ".avif",
};

/**
 * Ensures a directory exists, creating nested directories if necessary.
 */
function ensureDir(dirPath: string) {
  try {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  } catch (err) {
    console.error(`[AdStorage] Failed to create directory ${dirPath}:`, err);
  }
}

/**
 * Decodes a base64 data URL and writes it to disk as a static image file.
 * Returns the public web URL path (e.g. "/uploads/ads/home1_ad-1_abc123.webp").
 * If the input is already a URL or not base64, returns it unchanged.
 */
export function persistBase64Image(dataUrl: string, prefix = "ad"): string {
  if (!dataUrl || typeof dataUrl !== "string" || !dataUrl.startsWith("data:image/")) {
    return dataUrl;
  }

  const match = dataUrl.match(/^data:([^;]+);base64,(.+)$/);
  if (!match) return dataUrl;

  const mimeType = match[1].toLowerCase();
  const base64Data = match[2];
  const ext = MIME_TO_EXT[mimeType] || ".webp";

  // Create deterministic hash so identical image isn't duplicated
  const hash = crypto.createHash("md5").update(base64Data).digest("hex").slice(0, 12);
  const safePrefix = prefix.replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 30);
  const filename = `${safePrefix}_${hash}${ext}`;

  const buffer = Buffer.from(base64Data, "base64");

  // Save to both public/uploads/ads and dist/client/uploads/ads (if dist exists)
  const cwd = process.cwd();
  const targetDirs = [
    path.join(cwd, "public", "uploads", "ads"),
    path.join(cwd, "dist", "client", "uploads", "ads"),
    path.join(cwd, "uploads", "ads"),
  ];

  for (const dir of targetDirs) {
    try {
      ensureDir(dir);
      const filePath = path.join(dir, filename);
      if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, buffer);
      }
    } catch (err) {
      console.error(`[AdStorage] Error writing ${filename} to ${dir}:`, err);
    }
  }

  return `/uploads/ads/${filename}`;
}

/**
 * Iterates through ad items in a slot, converting any base64 images into static file URLs.
 */
export function persistSlotAds(ads: AdSlideItem[], slotName: string): { ads: AdSlideItem[]; changed: boolean } {
  if (!Array.isArray(ads) || ads.length === 0) {
    return { ads: ads || [], changed: false };
  }

  let changed = false;
  const processed = ads.map((ad, idx) => {
    let adChanged = false;
    const cleanAd = { ...ad };
    const id = cleanAd.id || `ad-${idx}`;

    if (cleanAd.image && cleanAd.image.startsWith("data:image/")) {
      cleanAd.image = persistBase64Image(cleanAd.image, `${slotName}_${id}_main`);
      adChanged = true;
    }
    if (cleanAd.imagePortrait && cleanAd.imagePortrait.startsWith("data:image/")) {
      cleanAd.imagePortrait = persistBase64Image(cleanAd.imagePortrait, `${slotName}_${id}_portrait`);
      adChanged = true;
    }
    if (cleanAd.imageLandscape && cleanAd.imageLandscape.startsWith("data:image/")) {
      cleanAd.imageLandscape = persistBase64Image(cleanAd.imageLandscape, `${slotName}_${id}_landscape`);
      adChanged = true;
    }

    if (adChanged) changed = true;
    return cleanAd;
  });

  return { ads: processed, changed };
}

/**
 * Scans the entire AdConfiguration object across all slots and persists any base64 images.
 */
export function persistAllAdConfiguration(config: AdConfiguration): { config: AdConfiguration; changed: boolean } {
  if (!config || !config.slots) return { config, changed: false };

  let overallChanged = false;
  const newSlots: Record<AdSlot, AdSlideItem[]> = { ...config.slots };

  for (const slotKey of Object.keys(newSlots) as AdSlot[]) {
    const { ads, changed } = persistSlotAds(newSlots[slotKey], slotKey);
    if (changed) {
      newSlots[slotKey] = ads;
      overallChanged = true;
    }
  }

  return {
    config: {
      ...config,
      slots: newSlots,
    },
    changed: overallChanged,
  };
}
