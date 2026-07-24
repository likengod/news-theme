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
    for (const f of Array.from(files)) {
      try {
        await trackUpload(f, "other");
        count++;
      } catch {
        toast.error(`Failed: ${f.name}`);
      }
    }
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
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Media & File Library</h1>
          <p className="text-sm text-slate-500">
            Upload, manage, and reuse images, videos, and news assets across your site.
          </p>
        </div>
        <div className="flex items-center gap-3">
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
          <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
            {items.length} files ({formatBytes(totalSize)})
          </span>
          <button
            onClick={() => fileRef.current?.click()}
            className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
          >
            <Upload className="h-4 w-4" /> Upload Files
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
          type: m.type.startsWith("video/") ? "video" : m.type.startsWith("image/") ? "image" : "document",
        }))}
        onDelete={handleDelete}
        onEdit={handleEdit}
      />
    </div>
  );
}
