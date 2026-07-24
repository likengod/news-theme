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
    console.warn("Media library quota exceeded", e);
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

export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result));
    r.onerror = () => reject(r.error);
    r.readAsDataURL(file);
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
    size: file.size,
    dataUrl,
    usage,
  });
}

export function formatBytes(n: number) {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / (1024 * 1024)).toFixed(2)} MB`;
}
