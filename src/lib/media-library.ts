// Lightweight media library backed by localStorage.
// Tracks every image/video the admin uploads across Articles, Pages,
// Site Settings (logo / OG / favicon) and Advertisements.

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
  dataUrl: string; // base64 data URL (works offline, no storage backend needed)
  usage: MediaUsage;
  altText?: string;
  description?: string;
  createdAt: number;
}

const KEY = "nt_media_library_v1";

function read(): MediaItem[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}

function write(items: MediaItem[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(items));
    window.dispatchEvent(new Event("media-library-change"));
  } catch (e) {
    console.warn("Media library quota exceeded, pruning older items...", e);
    try {
      // Keep only 4 newest items to free up space
      const pruned = items.slice(0, 4);
      localStorage.setItem(KEY, JSON.stringify(pruned));
      window.dispatchEvent(new Event("media-library-change"));
    } catch {
      try {
        localStorage.removeItem(KEY);
      } catch {}
    }
  }
}

export const mediaLibrary = {
  list(): MediaItem[] {
    return read().sort((a, b) => b.createdAt - a.createdAt);
  },
  add(item: Omit<MediaItem, "id" | "createdAt">): MediaItem {
    const full: MediaItem = {
      ...item,
      id: `m_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      createdAt: Date.now(),
    };
    write([full, ...read()]);
    return full;
  },
  update(id: string, patch: Partial<Pick<MediaItem, "name" | "usage" | "altText" | "description">>) {
    write(read().map((m) => (m.id === id ? { ...m, ...patch } : m)));
  },
  remove(id: string) {
    write(read().filter((m) => m.id !== id));
  },
  clear() {
    write([]);
  },
};

/**
 * Reads a File and produces an optimized data URL.
 * Automatically compresses large raster images using HTML5 canvas to keep
 * file sizes under ~200 KB and prevent browser QuotaExceededError.
 */
export function fileToDataUrl(
  file: File,
  maxDimension = 1920,
  quality = 0.82
): Promise<string> {
  // If not in browser or not a raster image (e.g. SVG, PDF, video), read as-is
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

  // If already small (< 75 KB), return directly without re-compression
  if (file.size < 75 * 1024) {
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

        // Try WebP first, fallback to JPEG
        try {
          const webp = canvas.toDataURL("image/webp", quality);
          if (webp.startsWith("data:image/webp") && webp.length < rawDataUrl.length) {
            resolve(webp);
            return;
          }
        } catch {}

        try {
          const jpeg = canvas.toDataURL("image/jpeg", quality);
          if (jpeg.length < rawDataUrl.length) {
            resolve(jpeg);
            return;
          }
        } catch {}

        resolve(rawDataUrl);
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
): Promise<MediaItem> {
  const dataUrl = await fileToDataUrl(file);
  return mediaLibrary.add({
    name: file.name,
    type: file.type || "application/octet-stream",
    size: Math.round(dataUrl.length * 0.75), // approximate decoded size
    dataUrl,
    usage,
  });
}

export function formatBytes(n: number) {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / (1024 * 1024)).toFixed(2)} MB`;
}
