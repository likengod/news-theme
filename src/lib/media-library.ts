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
 * Injects a hidden watermark directly into the binary file data (Metadata Injection).
 * This works with WebP and keeps file sizes tiny.
 */
function injectMetadata(dataUrl: string, text: string): string {
  // Extract base64 part
  const base64 = dataUrl.split(",")[1];
  const mime = dataUrl.split(",")[0];

  // Convert base64 to binary string
  const binaryString = atob(base64);

  // Create a payload that we will append to the end of the file.
  const payload = "\n---WATERMARK_START---\n" + text + "\n---WATERMARK_END---\n";

  // Safely encode UTF-8 characters (like Bengali) so btoa doesn't crash
  const utf8Payload = unescape(encodeURIComponent(payload));

  // Append our invisible metadata payload to the end of the image binary
  const newBinaryString = binaryString + utf8Payload;

  // Convert back to base64
  return mime + "," + btoa(newBinaryString);
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
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(rawDataUrl);
          return;
        }

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(img, 0, 0, width, height);

        let finalDataUrl = rawDataUrl;

        // Compress as WebP to save space
        try {
          const webp = canvas.toDataURL("image/webp", quality);
          if (webp.startsWith("data:image/webp") && webp.length < rawDataUrl.length) {
            finalDataUrl = webp;
          }
        } catch {}

        // Fallback to JPEG if WebP fails or is larger
        if (finalDataUrl === rawDataUrl) {
          try {
            const jpeg = canvas.toDataURL("image/jpeg", quality);
            if (jpeg.length < rawDataUrl.length) {
              finalDataUrl = jpeg;
            }
          } catch {}
        }

        // Inject the invisible metadata watermark at the end of the binary file
        if (watermarkData) {
          try {
            finalDataUrl = injectMetadata(finalDataUrl, watermarkData);
          } catch (err) {
            console.error("Watermark injection failed", err);
          }
        }

        resolve(finalDataUrl);
      };
      img.onerror = () => resolve(rawDataUrl);
      img.src = rawDataUrl;
    };
    reader.onerror = () => resolve("");
    reader.readAsDataURL(file);
  });
}

export async function trackUpload(
  file: File,
  usage: MediaUsage = "other",
  customName?: string,
  customDescription?: string,
  watermarkData?: string,
): Promise<MediaItem> {
  const dataUrl = await fileToDataUrl(file, watermarkData);
  return await mediaLibrary.add({
    name: customName || file.name,
    type: watermarkData ? "image/png" : file.type || "application/octet-stream",
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
