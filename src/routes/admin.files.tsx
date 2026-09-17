import { useEffect, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Upload } from "lucide-react";
import { toast } from "sonner";
import { mediaLibrary, trackUpload, formatBytes, type MediaItem } from "@/lib/media-library";
import { MediaGrid } from "@/components/admin/files/MediaGrid";
import { CsvImportExport } from "@/components/admin/CsvImportExport";

export const Route = createFileRoute("/admin/files")({
  component: FileManagerPage,
});

function FileManagerPage() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);

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
      if (f.size > MAX_FILE_SIZE) {
        toast.error(`"${f.name}" (${formatBytes(f.size)}) exceeds 1 MB. File size must be less than 1 MB.`);
        continue;
      }
      try {
        const defaultName = f.name.split(".").slice(0, -1).join(".") || f.name;
        let customName = window.prompt(
          `Enter a custom name for ${f.name} (or leave blank to keep original):`,
          defaultName,
        );
        if (customName === null) continue; // Cancelled

        customName = customName.trim() || f.name;

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

  const handleDelete = (id: string) => {
    if (!confirm("Delete this file permanently?")) return;
    mediaLibrary.remove(id);
    toast.success("File deleted");
    refresh();
  };

  const handleEdit = (id: string, name: string, altText?: string, description?: string) => {
    mediaLibrary.update(id, { name, altText, description });
    toast.success("File details updated");
    refresh();
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
          <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 sm:px-3 py-1.5 rounded-lg border border-slate-200 whitespace-nowrap">
            {items.length} files ({formatBytes(totalSize)})
          </span>
          <button
            onClick={() => fileRef.current?.click()}
            title="Upload Files (Max 1 MB per file)"
            className="inline-flex items-center gap-1.5 sm:gap-2 rounded-lg bg-slate-900 px-2.5 sm:px-3.5 py-1.5 text-xs sm:text-sm font-semibold text-white hover:bg-slate-800 transition whitespace-nowrap shadow-xs"
          >
            <Upload className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> Upload Files (&lt; 1 MB)
          </button>
          <input
            ref={fileRef}
            type="file"
            multiple
            accept="image/*,video/*,.pdf"
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
          type: m.type.startsWith("video/")
            ? "video"
            : m.type.startsWith("image/")
              ? "image"
              : "document",
        }))}
        onDelete={handleDelete}
        onEdit={handleEdit}
      />
    </div>
  );
}
