import { useEffect, useRef, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Upload, ShieldCheck, FileArchive, FolderArchive } from "lucide-react";
import { toast } from "sonner";
import { mediaLibrary, trackUpload, formatBytes, type MediaItem } from "@/lib/media-library";
import { MediaGrid } from "@/components/admin/files/MediaGrid";
import { CsvImportExport } from "@/components/admin/CsvImportExport";
import { extractAndImportZip, exportMediaZip } from "@/lib/media-zip";

export const Route = createFileRoute("/admin/files")({
  component: FileManagerPage,
});

function FileManagerPage() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);
  const zipFileRef = useRef<HTMLInputElement>(null);

  const refresh = () => setItems(mediaLibrary.list());

  useEffect(() => {
    refresh();
    const h = () => refresh();
    window.addEventListener("media-library-change", h);
    return () => window.removeEventListener("media-library-change", h);
  }, []);

  const totalSize = items.reduce((s, m) => s + m.size, 0);

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
    if (zipFileRef.current) zipFileRef.current.value = "";
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

  const handleDelete = (id: string) => {
    if (!confirm("Delete this file permanently?")) return;
    mediaLibrary.remove(id);
    toast.success("File deleted");
    refresh();
  };

  const handleDeleteMultiple = async (ids: string[]) => {
    if (!ids.length) return;
    if (!confirm(`Delete ${ids.length} selected file${ids.length > 1 ? "s" : ""} permanently?`)) return;
    try {
      await mediaLibrary.removeMultiple(ids);
      toast.success(`Deleted ${ids.length} file${ids.length > 1 ? "s" : ""}`);
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
            Upload, manage, and reuse images, videos, and news assets across your site (Max 1 MB per file).
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2.5">
          <CsvImportExport
            data={items}
            filename="media-library"
            onImport={(data) => {
              if (!data || data.length === 0) return;
              let imported = 0;
              for (const item of data) {
                if (!item.id || !item.name) continue;
                // Avoid duplicates by ID
                if (!mediaLibrary.get(item.id)) {
                  mediaLibrary.add(item);
                  imported++;
                }
              }
              if (imported > 0) {
                toast.success(`Imported ${imported} new media items`);
                refresh();
              } else {
                toast.info("No new items to import");
              }
            }}
          />
          <Link
            to="/verify-image"
            target="_blank"
            title="Scan any image for Layer 1 EXIF signature and Layer 2 pixel steganography DNA"
            className="inline-flex items-center gap-1.5 rounded-lg border border-indigo-200 bg-indigo-50/80 px-2.5 sm:px-3 py-1.5 text-xs font-semibold text-indigo-700 hover:bg-indigo-100 transition whitespace-nowrap shadow-2xs"
          >
            <ShieldCheck className="h-3.5 w-3.5 text-indigo-600" />
            Verify Scanner
          </Link>
          {/* ZIP Backup & Restore */}
          <button
            onClick={handleExportZip}
            title="Download complete ZIP backup of all actual images and manifest"
            className="inline-flex items-center gap-1.5 rounded-lg border border-amber-200 bg-amber-50/80 px-2.5 sm:px-3 py-1.5 text-xs font-semibold text-amber-800 hover:bg-amber-100 transition whitespace-nowrap shadow-2xs cursor-pointer"
          >
            <FileArchive className="h-3.5 w-3.5 text-amber-600" />
            Export ZIP Backup
          </button>
          <button
            onClick={() => zipFileRef.current?.click()}
            title="Upload a ZIP file to extract and import all media files automatically"
            className="inline-flex items-center gap-1.5 rounded-lg border border-indigo-200 bg-indigo-50/80 px-2.5 sm:px-3 py-1.5 text-xs font-semibold text-indigo-700 hover:bg-indigo-100 transition whitespace-nowrap shadow-2xs cursor-pointer"
          >
            <FolderArchive className="h-3.5 w-3.5 text-indigo-600" />
            Import ZIP
          </button>
          <input
            ref={zipFileRef}
            type="file"
            accept=".zip,application/zip,application/x-zip-compressed"
            onChange={(e) => onUpload(e.target.files)}
            className="hidden"
          />

          <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 sm:px-3 py-1.5 rounded-lg border border-slate-200 whitespace-nowrap">
            {items.length} files ({formatBytes(totalSize)})
          </span>
          <button
            onClick={() => fileRef.current?.click()}
            title="Upload Files or ZIP Archive (Max 1 MB per file)"
            className="inline-flex items-center gap-1.5 sm:gap-2 rounded-lg bg-slate-900 px-2.5 sm:px-3.5 py-1.5 text-xs sm:text-sm font-semibold text-white hover:bg-slate-800 transition whitespace-nowrap shadow-xs cursor-pointer"
          >
            <Upload className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> Upload Files / ZIP (&lt; 1 MB)
          </button>
          <input
            ref={fileRef}
            type="file"
            multiple
            accept="image/*,video/*,.pdf,.zip,application/zip,application/x-zip-compressed"
            onChange={(e) => onUpload(e.target.files)}
            className="hidden"
          />
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
        onDelete={handleDelete}
        onDeleteMultiple={handleDeleteMultiple}
        onEdit={handleEdit}
        onReplace={handleReplace}
        onAutoFillAltTexts={handleAutoFillAltTexts}
      />
    </div>
  );
}
