import { useEffect, useRef, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Upload,
  ShieldCheck,
  FileArchive,
  Trash2,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { mediaLibrary, trackUpload, formatBytes, type MediaItem } from "@/lib/media-library";
import { MediaGrid } from "@/components/admin/files/MediaGrid";
import { extractAndImportZip, exportMediaZip } from "@/lib/media-zip";

export const Route = createFileRoute("/admin/files")({
  component: FileManagerPage,
});

function FileManagerPage() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const fileRef = useRef<HTMLInputElement>(null);

  const refresh = () => setItems(mediaLibrary.list());

  useEffect(() => {
    refresh();
    const h = () => refresh();
    window.addEventListener("media-library-change", h);
    return () => window.removeEventListener("media-library-change", h);
  }, []);

  const totalSize = items.reduce((s, m) => s + m.size, 0);
  const selectedBytes = items.reduce((acc, it) => {
    if (selectedIds.has(it.id)) return acc + (it.size || 0);
    return acc;
  }, 0);

  const onUpload = async (files: FileList | null) => {
    if (!files?.length) return;
    let count = 0;

    // Auto-fetch domain name
    const domain = window.location.hostname;
    const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1 MB

    for (const f of Array.from(files)) {
      // Check if uploaded file is a ZIP archive
      if (f.name.toLowerCase().endsWith(".zip") || f.type.includes("zip")) {
        const toastId = toast.loading(`Reading & extracting archive "${f.name}"...`);
        try {
          const res = await extractAndImportZip(f, (cur, tot, msg) => {
            toast.loading(msg, { id: toastId });
          });
          if (res.imported > 0) {
            toast.success(
              `Successfully extracted and imported ${res.imported} file${res.imported > 1 ? "s" : ""} from "${f.name}"!`,
              { id: toastId },
            );
            count += res.imported;
          } else {
            toast.info(`No valid media files found in "${f.name}".`, { id: toastId });
          }
          if (res.errors.length > 0) {
            toast.error(
              `${res.errors.length} file(s) failed or exceeded 1 MB limit.`,
            );
          }
        } catch (zErr: any) {
          toast.error(zErr?.message || `Failed to extract "${f.name}"`, { id: toastId });
        }
        continue;
      }

      // Regular single or multiple media files
      if (f.size > MAX_FILE_SIZE) {
        toast.error(`"${f.name}" (${formatBytes(f.size)}) exceeds 1 MB. File size must be less than 1 MB.`);
        continue;
      }
      try {
        const defaultName = f.name.split(".").slice(0, -1).join(".") || f.name;
        let customName = defaultName;
        // Only prompt for single manual upload to avoid repeated popups on multi-select
        if (files.length === 1) {
          const prompted = window.prompt(
            `Enter a custom name for ${f.name} (or leave blank to keep original):`,
            defaultName,
          );
          if (prompted === null) continue; // Cancelled
          customName = prompted.trim() || f.name;
        }

        const timestamp = new Date().toLocaleString();
        const customDescription = `Uploaded at: ${timestamp} | Source: ${domain}`;

        let siteName = "News Theme";
        try {
          const settings = JSON.parse(localStorage.getItem("nt:site-settings") || "{}");
          if (settings.siteName) siteName = settings.siteName;
        } catch (e) {}

        // Generate the Invisible Watermark string
        const watermarkData = `Site Name: ${siteName} | Copyright: ${domain} | Timestamp: ${timestamp} | Note: Do not copy without permission.`;

        await trackUpload(f, "other", customName, customDescription, watermarkData);
        count++;
      } catch (err: any) {
        toast.error(err?.message || `Failed: ${f.name}`);
      }
    }
    if (fileRef.current) fileRef.current.value = "";
    if (count) toast.success(`Uploaded ${count} file${count > 1 ? "s" : ""}`);
    refresh();
  };

  const handleExportZip = async () => {
    if (!items.length) {
      toast.info("No files in media library to export.");
      return;
    }
    await exportMediaZip(
      items.map((m) => ({
        id: m.id,
        name: m.name,
        url: m.dataUrl || (m as any).url,
        altText: m.altText,
        description: m.description,
        size: formatBytes(m.size),
        rawSize: m.size,
        type: m.type.startsWith("video/")
          ? "video"
          : m.type.startsWith("image/")
            ? "image"
            : "document",
        createdAt: m.createdAt,
      })),
      `media-library-backup-${new Date().toISOString().slice(0, 10)}.zip`,
    );
  };

  const handleExportSelectedZip = async () => {
    if (selectedIds.size === 0) return;
    const selectedItems = items.filter((it) => selectedIds.has(it.id));
    await exportMediaZip(
      selectedItems.map((m) => ({
        id: m.id,
        name: m.name,
        url: m.dataUrl || (m as any).url,
        altText: m.altText,
        description: m.description,
        size: formatBytes(m.size),
        rawSize: m.size,
        type: m.type.startsWith("video/")
          ? "video"
          : m.type.startsWith("image/")
            ? "image"
            : "document",
        createdAt: m.createdAt,
      })),
      `selected-media-${new Date().toISOString().slice(0, 10)}.zip`,
    );
  };

  const handleDelete = (id: string) => {
    if (!confirm("Delete this file permanently?")) return;
    mediaLibrary.remove(id);
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
    toast.success("File deleted");
    refresh();
  };

  const handleDeleteMultiple = async (ids: string[]) => {
    if (!ids.length) return;
    if (!confirm(`Delete ${ids.length} selected file${ids.length > 1 ? "s" : ""} permanently?`)) return;
    try {
      await mediaLibrary.removeMultiple(ids);
      toast.success(`Deleted ${ids.length} file${ids.length > 1 ? "s" : ""}`);
      setSelectedIds(new Set());
      refresh();
    } catch (err: any) {
      toast.error(err?.message || "Failed to delete files");
    }
  };

  const handleEdit = (id: string, name: string, altText?: string, description?: string) => {
    mediaLibrary.update(id, { name, altText, description });
    toast.success("File details updated");
    refresh();
  };

  const handleReplace = async (
    id: string,
    file: File,
    name: string,
    altText?: string,
    description?: string,
  ) => {
    try {
      await mediaLibrary.replace(id, file, name, altText);
      if (description) {
        await mediaLibrary.update(id, { description });
      }
      toast.success("File replaced successfully");
      refresh();
    } catch (err: any) {
      toast.error(err?.message || "Failed to replace file");
    }
  };

  const handleAutoFillAltTexts = async (): Promise<number> => {
    const updatedCount = await mediaLibrary.autoFillMissingAltTexts();
    refresh();
    return updatedCount;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Media & File Library</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Upload images below 1 MB. Images must support WebP.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-2.5">
          {/* Primary Upload CTA on Mobile (full width) or Desktop */}
          <button
            onClick={() => fileRef.current?.click()}
            title="Upload Files or ZIP Archive (Max 1 MB per file)"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 sm:py-2 text-xs sm:text-sm font-semibold text-white hover:bg-slate-800 transition whitespace-nowrap shadow-xs cursor-pointer w-full sm:w-auto sm:order-last"
          >
            <Upload className="h-4 w-4 shrink-0" />
            <span>Upload Media (&lt; 1 MB)</span>
          </button>

          {/* Secondary actions row / Header Actions */}
          <div className="flex flex-wrap items-center justify-between sm:justify-start gap-1.5 sm:gap-2 w-full sm:w-auto">
            <div className="flex flex-wrap items-center gap-1.5">
              {/* When files are selected: Show options on the LEFT side of Scanner */}
              {selectedIds.size > 0 ? (
                <>
                  <span className="inline-flex items-center gap-1 rounded-md border border-rose-200 bg-rose-50 px-2 py-1 text-xs font-bold text-rose-950 shadow-2xs">
                    <span className="flex h-3.5 w-3.5 items-center justify-center rounded bg-rose-600 text-white text-[9px] font-bold">
                      ✓
                    </span>
                    <span>
                      {selectedIds.size} file{selectedIds.size > 1 ? "s" : ""}
                    </span>
                  </span>

                  <button
                    type="button"
                    onClick={handleExportSelectedZip}
                    className="inline-flex items-center gap-1 rounded-md border border-amber-300 bg-white px-2 py-1 text-xs font-semibold text-amber-900 hover:bg-amber-50 transition shadow-2xs cursor-pointer"
                    title={`Download ${selectedIds.size} selected files in a ZIP archive`}
                  >
                    <FileArchive className="h-3 w-3 text-amber-600 shrink-0" />
                    <span>Export ZIP ({selectedIds.size})</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedIds(new Set())}
                    className="inline-flex items-center gap-1 rounded-md border border-slate-300 bg-white px-2 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition shadow-2xs cursor-pointer"
                    title="Clear selection"
                  >
                    <X className="h-3 w-3 text-slate-500 shrink-0" />
                    <span>Clear</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDeleteMultiple(Array.from(selectedIds))}
                    className="inline-flex items-center justify-center rounded-md bg-rose-600 p-1.5 text-white hover:bg-rose-700 transition shadow-xs cursor-pointer"
                    title={`Delete Selected (${selectedIds.size})`}
                    aria-label={`Delete ${selectedIds.size} selected files`}
                  >
                    <Trash2 className="h-3.5 w-3.5 shrink-0" />
                  </button>
                </>
              ) : (
                /* When no files selected: show global Export ZIP */
                <button
                  type="button"
                  onClick={handleExportZip}
                  title="Download all media files in a ZIP archive"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 sm:px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition whitespace-nowrap shadow-2xs cursor-pointer"
                >
                  <FileArchive className="h-3.5 w-3.5 text-amber-600 shrink-0" />
                  <span>Export ZIP</span>
                </button>
              )}

              {/* Verify Scanner - directly to the right */}
              <Link
                to="/verify-image"
                target="_blank"
                title="Scan any image for Layer 1 EXIF signature and Layer 2 pixel steganography DNA"
                className="inline-flex items-center gap-1.5 rounded-lg border border-indigo-200 bg-indigo-50/80 px-2.5 sm:px-3 py-1.5 text-xs font-semibold text-indigo-700 hover:bg-indigo-100 transition whitespace-nowrap shadow-2xs"
              >
                <ShieldCheck className="h-3.5 w-3.5 text-indigo-600 shrink-0" />
                <span>Scanner</span>
              </Link>
            </div>

            {/* Hidden Input for Media & ZIP Upload */}
            <input
              ref={fileRef}
              type="file"
              multiple
              accept="image/*,video/*,.pdf,.doc,.docx,.zip,application/zip,application/x-zip-compressed"
              onChange={(e) => onUpload(e.target.files)}
              className="hidden"
            />

            <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 sm:px-3 py-1.5 rounded-lg border border-slate-200 whitespace-nowrap shrink-0">
              {items.length} files <span className="hidden xs:inline">({formatBytes(totalSize)})</span>
            </span>
          </div>
        </div>
      </div>

      {/* Media Grid */}
      <MediaGrid
        items={items.map((m) => ({
          id: m.id,
          url: m.dataUrl || (m as any).url,
          name: m.name,
          altText: m.altText,
          description: m.description,
          size: formatBytes(m.size),
          rawSize: m.size,
          createdAt: m.createdAt,
          uploadedAt: m.createdAt ? new Date(m.createdAt).toLocaleDateString() : undefined,
          type: m.type.startsWith("video/")
            ? "video"
            : m.type.startsWith("image/")
              ? "image"
              : "document",
        }))}
        selectedIds={selectedIds}
        onSelectChange={setSelectedIds}
        showBatchBanner={false}
        onDelete={handleDelete}
        onDeleteMultiple={handleDeleteMultiple}
        onEdit={handleEdit}
        onReplace={handleReplace}
        onAutoFillAltTexts={handleAutoFillAltTexts}
      />
    </div>
  );
}
