import { useState, useMemo, useRef } from "react";
import {
  Copy,
  Trash2,
  Image as ImageIcon,
  Video,
  FileText,
  Edit2,
  LayoutGrid,
  List,
  AlertTriangle,
  RefreshCw,
  Sparkles,
  Upload,
} from "lucide-react";
import { toast } from "sonner";
import { EditMediaModal } from "./EditMediaModal";
import { formatBytes, MAX_MEDIA_FILE_SIZE } from "@/lib/media-library";

export type MediaItemDef = {
  id: string;
  url: string;
  name: string;
  altText?: string;
  description?: string;
  size?: string;
  rawSize?: number;
  uploadedAt?: string;
  type?: "image" | "video" | "document";
};

function SafeImage({ src, alt, className, ...props }: any) {
  const [error, setError] = useState(false);
  if (error || !src || src.trim() === "") {
    return (
      <div className="flex flex-col items-center justify-center text-slate-400 h-full w-full bg-slate-100 p-2 text-center">
        <ImageIcon className="h-5 w-5 mb-1 opacity-50 text-slate-400" />
        <span className="text-[9px] font-semibold opacity-60">Not Found</span>
      </div>
    );
  }
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setError(true)}
      {...props}
    />
  );
}

type Props = {
  items: MediaItemDef[];
  onDelete?: (id: string) => void;
  onEdit?: (id: string, name: string, altText?: string, description?: string) => void;
  onReplace?: (id: string, file: File, name: string, altText?: string, description?: string) => Promise<void> | void;
  onAutoFillAltTexts?: () => Promise<number>;
};

export function MediaGrid({ items, onDelete, onEdit, onReplace, onAutoFillAltTexts }: Props) {
  const [filter, setFilter] = useState<"all" | "image" | "video" | "document" | "duplicates" | "no-alt">("all");
  const [q, setQ] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [editingItem, setEditingItem] = useState<MediaItemDef | null>(null);
  const [fillingAlt, setFillingAlt] = useState(false);
  const quickReplaceInputRef = useRef<HTMLInputElement>(null);
  const [quickReplaceTargetId, setQuickReplaceTargetId] = useState<string | null>(null);

  // Compute duplicate groups across the library
  const duplicateInfo = useMemo(() => {
    const nameMap = new Map<string, string[]>();
    const sizeMap = new Map<string, string[]>();

    for (const it of items) {
      // Normalize name: remove extensions and trailing index numbers
      const normName = it.name
        .toLowerCase()
        .replace(/\.[a-zA-Z0-9]+$/, "")
        .replace(/[\(\[\{]\d+[\)\]\}]/g, "")
        .replace(/\s+/g, " ")
        .trim();

      if (normName) {
        const list = nameMap.get(normName) || [];
        list.push(it.id);
        nameMap.set(normName, list);
      }

      if (it.size && it.size !== "-") {
        const list = sizeMap.get(it.size) || [];
        list.push(it.id);
        sizeMap.set(it.size, list);
      }
    }

    const itemDupMap = new Map<string, { count: number; reason: string; groupKey: string }>();

    for (const [normName, ids] of nameMap.entries()) {
      if (ids.length > 1) {
        for (const id of ids) {
          itemDupMap.set(id, {
            count: ids.length,
            reason: `Shares name "${normName}"`,
            groupKey: normName,
          });
        }
      }
    }

    for (const [sizeStr, ids] of sizeMap.entries()) {
      if (ids.length > 1) {
        for (const id of ids) {
          if (!itemDupMap.has(id)) {
            itemDupMap.set(id, {
              count: ids.length,
              reason: `Identical file size (${sizeStr})`,
              groupKey: sizeStr,
            });
          }
        }
      }
    }

    return itemDupMap;
  }, [items]);

  const duplicateCount = Array.from(duplicateInfo.keys()).length;
  const missingAltCount = items.filter((it) => !it.altText || it.altText.trim() === "").length;

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success("URL copied to clipboard!");
  };

  const handleQuickReplaceTrigger = (id: string) => {
    setQuickReplaceTargetId(id);
    quickReplaceInputRef.current?.click();
  };

  const handleQuickReplaceFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const targetId = quickReplaceTargetId;
    if (!file || !targetId || !onReplace) return;

    if (file.size > MAX_MEDIA_FILE_SIZE) {
      toast.error(`"${file.name}" (${formatBytes(file.size)}) exceeds the 1 MB limit.`);
      return;
    }

    const targetItem = items.find((x) => x.id === targetId);
    try {
      await onReplace(targetId, file, targetItem?.name || file.name, targetItem?.altText);
      toast.success("Image replaced successfully!");
    } catch (err: any) {
      toast.error(err?.message || "Failed to replace image");
    } finally {
      setQuickReplaceTargetId(null);
      if (quickReplaceInputRef.current) quickReplaceInputRef.current.value = "";
    }
  };

  const handleAutoFillAllAlt = async () => {
    if (!onAutoFillAltTexts) return;
    setFillingAlt(true);
    try {
      const count = await onAutoFillAltTexts();
      if (count > 0) {
        toast.success(`Generated Alt Text for ${count} media file${count > 1 ? "s" : ""}!`);
      } else {
        toast.info("All media files already have Alt Text!");
      }
    } catch (err: any) {
      toast.error(err?.message || "Failed to auto-fill alt texts");
    } finally {
      setFillingAlt(false);
    }
  };

  const filtered = items.filter((it) => {
    const matchesQ = `${it.name}${it.url || ""}${it.altText || ""}`.toLowerCase().includes(q.toLowerCase());
    if (!matchesQ) return false;

    if (filter === "duplicates") {
      return duplicateInfo.has(it.id);
    }
    if (filter === "no-alt") {
      return !it.altText || it.altText.trim() === "";
    }
    if (filter === "all") return true;
    return (it.type || "image") === filter;
  });

  return (
    <div className="space-y-4">
      {/* Hidden file input for quick replace button */}
      <input
        ref={quickReplaceInputRef}
        type="file"
        accept="image/*,video/*,.pdf"
        onChange={handleQuickReplaceFile}
        className="hidden"
      />

      {/* Filter Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-3.5 shadow-xs">
        <div className="flex flex-wrap items-center gap-2.5 flex-1 min-w-[280px]">
          <input
            type="text"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search media files by name or alt text..."
            className="h-9 w-full sm:w-64 rounded-xl border border-slate-200 px-3 text-xs focus:border-slate-900 focus:outline-none"
          />

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-1">
            {(
              [
                { key: "all", label: "All" },
                { key: "image", label: "Images" },
                { key: "video", label: "Videos" },
                { key: "document", label: "Documents" },
              ] as const
            ).map((t) => (
              <button
                key={t.key}
                onClick={() => setFilter(t.key)}
                className={`rounded-lg px-2.5 py-1 text-xs font-semibold capitalize transition ${
                  filter === t.key
                    ? "bg-slate-900 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {t.label}
              </button>
            ))}

            {/* Duplicate Filter Tab */}
            <button
              onClick={() => setFilter(filter === "duplicates" ? "all" : "duplicates")}
              className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                filter === "duplicates"
                  ? "bg-amber-600 text-white"
                  : duplicateCount > 0
                    ? "bg-amber-100 text-amber-800 hover:bg-amber-200"
                    : "bg-slate-100 text-slate-400 opacity-60"
              }`}
              title="Filter duplicate images"
            >
              <AlertTriangle className="h-3.5 w-3.5" />
              Duplicates {duplicateCount > 0 && `(${duplicateCount})`}
            </button>

            {/* Missing Alt Text Filter Tab */}
            {missingAltCount > 0 && (
              <button
                onClick={() => setFilter(filter === "no-alt" ? "all" : "no-alt")}
                className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                  filter === "no-alt"
                    ? "bg-rose-600 text-white"
                    : "bg-rose-50 text-rose-700 hover:bg-rose-100"
                }`}
                title="Filter files with no Alt Text"
              >
                No Alt ({missingAltCount})
              </button>
            )}
          </div>
        </div>

        {/* Right Action Tools */}
        <div className="flex items-center gap-2">
          {onAutoFillAltTexts && missingAltCount > 0 && (
            <button
              onClick={handleAutoFillAllAlt}
              disabled={fillingAlt}
              className="inline-flex items-center gap-1.5 rounded-xl border border-indigo-200 bg-indigo-50/80 px-3 py-1.5 text-xs font-bold text-indigo-700 hover:bg-indigo-100 transition shadow-2xs cursor-pointer disabled:opacity-50"
              title="Automatically generate Alt Text for all items without alt text"
            >
              <Sparkles className={`h-3.5 w-3.5 text-indigo-600 ${fillingAlt ? "animate-spin" : ""}`} />
              Auto-fill Alt Texts ({missingAltCount})
            </button>
          )}

          <div className="flex items-center gap-1 border-l border-slate-200 pl-2">
            <button
              onClick={() => setViewMode("grid")}
              className={`rounded-lg p-1.5 transition ${
                viewMode === "grid"
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
              title="Grid View"
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`rounded-lg p-1.5 transition ${
                viewMode === "list"
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
              title="List View"
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      {viewMode === "grid" ? (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filtered.map((m) => {
            const isDup = duplicateInfo.has(m.id);
            const dupData = duplicateInfo.get(m.id);

            return (
              <div
                key={m.id || m.url}
                className={`group relative overflow-hidden rounded-2xl border bg-white shadow-2xs transition hover:shadow-md ${
                  isDup ? "border-amber-300 ring-1 ring-amber-300/50" : "border-slate-200"
                }`}
              >
                {/* Duplicate Badge */}
                {isDup && (
                  <div
                    onClick={() => setQ(dupData?.groupKey || m.name)}
                    className="absolute top-2 left-2 z-10 flex items-center gap-1 rounded-md bg-amber-500/90 text-white px-2 py-0.5 text-[10px] font-bold shadow-xs cursor-pointer hover:bg-amber-600 transition backdrop-blur-xs"
                    title={`Click to filter duplicate group: ${dupData?.reason}`}
                  >
                    <AlertTriangle className="h-3 w-3" />
                    Duplicate ({dupData?.count})
                  </div>
                )}

                <div className="aspect-video w-full bg-slate-100 overflow-hidden relative grid place-items-center">
                  {(m.url && m.url.match(/\.(mp4|webm)$/i)) || m.type === "video" ? (
                    <div className="flex flex-col items-center justify-center text-slate-500">
                      <Video className="h-8 w-8 mb-1" />
                      <span className="text-[10px] font-semibold">Video File</span>
                    </div>
                  ) : (m.url && m.url.match(/\.(pdf|doc|docx)$/i)) || m.type === "document" ? (
                    <div className="flex flex-col items-center justify-center text-slate-500">
                      <FileText className="h-8 w-8 mb-1" />
                      <span className="text-[10px] font-semibold">Document</span>
                    </div>
                  ) : (
                    <SafeImage
                      src={m.url || ""}
                      alt={m.altText || m.name}
                      loading="lazy"
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                    />
                  )}
                </div>

                <div className="p-3">
                  <p
                    className="truncate text-xs font-semibold text-slate-900"
                    title={m.name || m.url}
                  >
                    {m.name || m.url.split("/").pop()}
                  </p>
                  <p className="mt-0.5 text-[11px] text-slate-500 truncate" title={m.altText}>
                    {m.altText ? (
                      <span className="text-slate-600">{m.altText}</span>
                    ) : (
                      <span className="italic text-rose-500 font-medium">No alt text</span>
                    )}
                  </p>

                  <div className="mt-2.5 flex items-center justify-between border-t border-slate-100 pt-2">
                    <button
                      onClick={() => copyUrl(m.url)}
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-600 hover:text-slate-900"
                    >
                      <Copy className="h-3 w-3" /> Copy
                    </button>
                    <div className="flex items-center gap-1.5">
                      {onReplace && (
                        <button
                          onClick={() => handleQuickReplaceTrigger(m.id)}
                          className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
                          title="Replace Image File (< 1 MB)"
                        >
                          <RefreshCw className="h-3.5 w-3.5 text-indigo-600" />
                        </button>
                      )}
                      {onEdit && (
                        <button
                          onClick={() => setEditingItem(m)}
                          className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
                          title="Edit Details & Alt Text"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                      {onDelete && (
                        <button
                          onClick={() => onDelete(m.id)}
                          className="rounded-md p-1 text-red-400 hover:bg-red-50 hover:text-red-600 transition"
                          title="Delete Media"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-200 bg-white shadow-2xs overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50/80 text-slate-500 text-[11px] uppercase font-bold tracking-wider border-b border-slate-200/80">
              <tr>
                <th className="px-4 py-3">Preview</th>
                <th className="px-4 py-3">File Name & Alt Text</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Size</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((m) => {
                const isDup = duplicateInfo.has(m.id);
                const dupData = duplicateInfo.get(m.id);

                return (
                  <tr
                    key={m.id || m.url}
                    className={`transition hover:bg-slate-50/60 ${
                      isDup ? "bg-amber-50/20" : ""
                    }`}
                  >
                    <td className="px-4 py-3 w-20">
                      <div className="h-12 w-16 bg-slate-100 rounded-lg overflow-hidden grid place-items-center border border-slate-200/70">
                        {(m.url && m.url.match(/\.(mp4|webm)$/i)) || m.type === "video" ? (
                          <Video className="h-5 w-5 text-slate-400" />
                        ) : (m.url && m.url.match(/\.(pdf|doc|docx)$/i)) || m.type === "document" ? (
                          <FileText className="h-5 w-5 text-slate-400" />
                        ) : (
                          <SafeImage
                            src={m.url || ""}
                            alt={m.altText || m.name}
                            className="h-full w-full object-cover"
                          />
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p
                        className="font-bold text-slate-900 max-w-xs truncate text-xs sm:text-sm"
                        title={m.name || m.url}
                      >
                        {m.name || m.url.split("/").pop()}
                      </p>
                      <p className="text-xs text-slate-500 truncate max-w-xs mt-0.5" title={m.altText}>
                        {m.altText ? (
                          <span className="text-slate-600 font-medium">Alt: {m.altText}</span>
                        ) : (
                          <span className="italic text-rose-500 font-medium">No alt text</span>
                        )}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      {isDup ? (
                        <button
                          type="button"
                          onClick={() => setQ(dupData?.groupKey || m.name)}
                          className="inline-flex items-center gap-1 rounded-md bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800 hover:bg-amber-200 transition cursor-pointer"
                          title={`${dupData?.reason} — Click to filter matching copies`}
                        >
                          <AlertTriangle className="h-3 w-3 text-amber-600" />
                          Duplicate ({dupData?.count})
                        </button>
                      ) : (
                        <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                          Unique
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-slate-500 text-xs capitalize">{m.type || "image"}</td>
                    <td className="px-4 py-3 text-slate-500 text-xs font-mono">{m.size || "-"}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => copyUrl(m.url)}
                          className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
                          title="Copy URL"
                        >
                          <Copy className="h-4 w-4" />
                        </button>
                        {onReplace && (
                          <button
                            onClick={() => handleQuickReplaceTrigger(m.id)}
                            className="rounded-lg p-1.5 text-indigo-600 hover:bg-indigo-50 hover:text-indigo-800 transition"
                            title="Replace Image File (< 1 MB)"
                          >
                            <RefreshCw className="h-4 w-4" />
                          </button>
                        )}
                        {onEdit && (
                          <button
                            onClick={() => setEditingItem(m)}
                            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
                            title="Edit Details & Alt Text"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                        )}
                        {onDelete && (
                          <button
                            onClick={() => onDelete(m.id)}
                            className="rounded-lg p-1.5 text-red-400 hover:bg-red-50 hover:text-red-600 transition"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {filtered.length === 0 && (
        <div className="col-span-full py-12 text-center text-xs text-slate-400">
          No media files found matching your search.
        </div>
      )}

      {editingItem && onEdit && (
        <EditMediaModal
          item={editingItem}
          isDuplicate={duplicateInfo.has(editingItem.id)}
          duplicateCount={duplicateInfo.get(editingItem.id)?.count}
          onClose={() => setEditingItem(null)}
          onSave={onEdit}
          onReplace={onReplace}
        />
      )}
    </div>
  );
}
