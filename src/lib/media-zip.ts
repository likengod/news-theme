import JSZip from "jszip";
import { toast } from "sonner";
import { trackUpload, deriveAltText, formatBytes, MAX_MEDIA_FILE_SIZE, type MediaItem } from "./media-library";

export interface MediaManifestItem {
  id?: string;
  name: string;
  filename?: string;
  altText?: string;
  description?: string;
  type?: string;
  size?: number | string;
  createdAt?: number;
}

/**
 * Extracts and imports all media files from a .zip archive.
 * Supports archives with a manifest.json / metadata.json, or plain folders of images/videos/documents.
 */
export async function extractAndImportZip(
  zipFile: File,
  onProgress?: (current: number, total: number, message: string) => void,
): Promise<{ imported: number; skipped: number; errors: string[] }> {
  const zip = await JSZip.loadAsync(zipFile);
  const errors: string[] = [];
  let imported = 0;
  let skipped = 0;

  // 1. Look for manifest / metadata
  const manifestMap = new Map<string, MediaManifestItem>();
  const manifestCandidate =
    zip.file("manifest.json") ||
    zip.file("metadata.json") ||
    zip.file("media_library.json") ||
    zip.file("files/manifest.json");

  if (manifestCandidate) {
    try {
      const manifestText = await manifestCandidate.async("text");
      const parsed = JSON.parse(manifestText);
      const items: MediaManifestItem[] = Array.isArray(parsed) ? parsed : parsed.items || [];
      for (const it of items) {
        if (it.filename) {
          const base = it.filename.split("/").pop() || it.filename;
          manifestMap.set(base.toLowerCase(), it);
        }
        if (it.name) {
          manifestMap.set(it.name.toLowerCase(), it);
        }
      }
    } catch (e) {
      console.warn("[MediaZip] Failed to parse manifest JSON:", e);
    }
  }

  // 2. Filter valid media entries (exclude directories, hidden files, metadata)
  const validEntries = Object.values(zip.files).filter((entry) => {
    if (entry.dir) return false;
    const name = entry.name;
    if (name.startsWith("__MACOSX") || name.startsWith("._")) return false;
    if (name.endsWith(".DS_Store") || name.endsWith("Thumbs.db")) return false;
    if (name.endsWith(".json")) return false;
    return /\.(jpg|jpeg|png|webp|gif|svg|avif|mp4|webm|pdf|doc|docx)$/i.test(name);
  });

  const total = validEntries.length;
  if (total === 0) {
    throw new Error("No supported media files (images, videos, documents) found in this ZIP archive.");
  }

  const domain = typeof window !== "undefined" ? window.location.hostname : "todaytripura.com";

  for (let i = 0; i < total; i++) {
    const entry = validEntries[i];
    const rawFilename = entry.name.split("/").pop() || entry.name;
    const cleanBasename = rawFilename.replace(/\.[a-zA-Z0-9]+$/, "");
    const ext = rawFilename.split(".").pop()?.toLowerCase() || "";

    onProgress?.(i + 1, total, `Extracting ${rawFilename} (${i + 1}/${total})...`);

    // Determine MIME
    let mime = "application/octet-stream";
    if (["jpg", "jpeg"].includes(ext)) mime = "image/jpeg";
    else if (ext === "png") mime = "image/png";
    else if (ext === "webp") mime = "image/webp";
    else if (ext === "gif") mime = "image/gif";
    else if (ext === "svg") mime = "image/svg+xml";
    else if (ext === "avif") mime = "image/avif";
    else if (["mp4", "webm"].includes(ext)) mime = `video/${ext}`;
    else if (ext === "pdf") mime = "application/pdf";

    try {
      const blob = await entry.async("blob");
      if (blob.size > MAX_MEDIA_FILE_SIZE) {
        skipped++;
        errors.push(`"${rawFilename}" (${formatBytes(blob.size)}) exceeds the 1 MB limit.`);
        continue;
      }

      const file = new File([blob], rawFilename, { type: mime });
      const meta = manifestMap.get(rawFilename.toLowerCase()) || manifestMap.get(cleanBasename.toLowerCase());

      const effectiveName = meta?.name || cleanBasename || rawFilename;
      const effectiveAltText = meta?.altText || deriveAltText(effectiveName);
      const effectiveDescription =
        meta?.description || `Imported from ZIP backup: ${zipFile.name} | Host: ${domain}`;

      await trackUpload(
        file,
        "other",
        effectiveName,
        effectiveDescription,
        undefined,
        effectiveAltText,
      );
      imported++;
    } catch (entryErr: any) {
      skipped++;
      errors.push(`Failed to import "${rawFilename}": ${entryErr?.message || "Unknown error"}`);
    }
  }

  return { imported, skipped, errors };
}

/**
 * Packages selected or all media files into a downloadable ZIP archive with manifest.json
 */
export async function exportMediaZip(
  items: {
    id: string;
    name: string;
    url: string;
    altText?: string;
    description?: string;
    size?: string;
    rawSize?: number;
    type?: string;
    createdAt?: number;
  }[],
  zipFilename = `media-backup-${new Date().toISOString().slice(0, 10)}.zip`,
): Promise<void> {
  if (!items || items.length === 0) {
    toast.error("No media files to export.");
    return;
  }

  const toastId = toast.loading(`Preparing ZIP backup of ${items.length} files...`);

  try {
    const zip = new JSZip();
    const manifest: MediaManifestItem[] = [];
    const filesFolder = zip.folder("files") || zip;

    let successCount = 0;

    for (let i = 0; i < items.length; i++) {
      const it = items[i];
      try {
        let blob: Blob | null = null;

        if (it.url && it.url.startsWith("data:")) {
          const res = await fetch(it.url);
          blob = await res.blob();
        } else if (it.url) {
          const res = await fetch(it.url);
          if (res.ok) {
            blob = await res.blob();
          }
        }

        if (blob) {
          // Determine clean file extension
          let ext = "webp";
          if (it.url) {
            const m = it.url.match(/\.([a-zA-Z0-9]+)(?:\?.*)?$/);
            if (m) ext = m[1].toLowerCase();
          }
          if (ext.length > 5) ext = "webp";

          const safeFilename = `${it.name.replace(/[^a-zA-Z0-9_\-\s]/g, "_").trim() || "media"}.${ext}`;
          filesFolder.file(safeFilename, blob);

          manifest.push({
            id: it.id,
            name: it.name,
            filename: `files/${safeFilename}`,
            altText: it.altText || "",
            description: it.description || "",
            type: it.type || "image",
            size: it.size || "",
            createdAt: it.createdAt || Date.now(),
          });
          successCount++;
        }
      } catch (fileErr) {
        console.warn(`[MediaZip] Failed to include file ${it.name}:`, fileErr);
      }
    }

    if (successCount === 0) {
      toast.error("Could not download any media files to package into ZIP.", { id: toastId });
      return;
    }

    // Add manifest.json for full restore capability
    zip.file("manifest.json", JSON.stringify(manifest, null, 2));

    // Generate ZIP
    const zipBlob = await zip.generateAsync({ type: "blob" });
    const downloadUrl = URL.createObjectURL(zipBlob);

    const a = document.createElement("a");
    a.href = downloadUrl;
    a.download = zipFilename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(downloadUrl);

    toast.success(`Successfully exported ${successCount} files to ${zipFilename}!`, { id: toastId });
  } catch (err: any) {
    toast.error(err?.message || "Failed to generate ZIP archive.", { id: toastId });
  }
}
