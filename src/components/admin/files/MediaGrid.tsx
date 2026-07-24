import { useState } from "react";
import { Copy, Trash2, ExternalLink, Image as ImageIcon, Video, FileText, Edit2, LayoutGrid, List } from "lucide-react";
import { toast } from "sonner";
import { EditMediaModal } from "./EditMediaModal";

export type MediaItemDef = {
  id: string;
  url: string;
  name: string;
  altText?: string;
  description?: string;
  size?: string;
  uploadedAt?: string;
  type?: "image" | "video" | "document";
};

type Props = {
  items: MediaItemDef[];
  onDelete?: (id: string) => void;
  onEdit?: (id: string, name: string, altText?: string, description?: string) => void;
};

export function MediaGrid({ items, onDelete, onEdit }: Props) {
  const [filter, setFilter] = useState<"all" | "image" | "video" | "document">("all");
  const [q, setQ] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [editingItem, setEditingItem] = useState<MediaItemDef | null>(null);

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success("URL copied to clipboard!");
  };

  const filtered = items.filter((it) => {
    const matchesQ = `${it.name}${it.url || ""}`.toLowerCase().includes(q.toLowerCase());
    const matchesFilter = filter === "all" || (it.type || "image") === filter;
    return matchesQ && matchesFilter;
  });

  return (
    <div className="space-y-4">
      {/* Filter Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
        <input
          type="text"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search media files by name..."
          className="h-9 w-64 rounded-md border border-slate-200 px-3 text-sm focus:border-slate-900 focus:outline-none"
        />
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 border-r border-slate-200 pr-4">
            {(["all", "image", "video", "document"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setFilter(t)}
                className={`rounded-md px-3 py-1.5 text-xs font-semibold capitalize transition ${
                  filter === t ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {t}s
              </button>
            ))}
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setViewMode("grid")}
              className={`rounded-md p-1.5 transition ${
                viewMode === "grid" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
              title="Grid View"
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`rounded-md p-1.5 transition ${
                viewMode === "list" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
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
          {filtered.map((m) => (
            <div key={m.id || m.url} className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md">
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
                  <img
                    src={m.url || ""}
                    alt={m.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                  />
                )}
              </div>

              <div className="p-3">
                <p className="truncate text-xs font-semibold text-slate-900" title={m.name || m.url}>
                  {m.name || m.url.split("/").pop()}
                </p>
                <div className="mt-2 flex items-center justify-between">
                  <button
                    onClick={() => copyUrl(m.url)}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-600 hover:text-slate-900"
                  >
                    <Copy className="h-3 w-3" /> Copy URL
                  </button>
                  <div className="flex items-center gap-2">
                    {onEdit && (
                      <button
                        onClick={() => setEditingItem(m)}
                        className="text-slate-400 hover:text-slate-600"
                        title="Edit Details"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={() => onDelete(m.id)}
                        className="text-red-500 hover:text-red-700"
                        title="Delete Media"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold">
              <tr>
                <th className="px-4 py-3">Preview</th>
                <th className="px-4 py-3">File Name</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Size</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((m) => (
                <tr key={m.id || m.url} className="hover:bg-slate-50/50">
                  <td className="px-4 py-3 w-20">
                    <div className="h-12 w-16 bg-slate-100 rounded-md overflow-hidden grid place-items-center">
                      {(m.url && m.url.match(/\.(mp4|webm)$/i)) || m.type === "video" ? (
                        <Video className="h-5 w-5 text-slate-400" />
                      ) : (m.url && m.url.match(/\.(pdf|doc|docx)$/i)) || m.type === "document" ? (
                        <FileText className="h-5 w-5 text-slate-400" />
                      ) : (
                        <img src={m.url || ""} alt={m.name} className="h-full w-full object-cover" />
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-semibold text-slate-900 max-w-xs truncate" title={m.name || m.url}>
                      {m.name || m.url.split("/").pop()}
                    </p>
                    <p className="text-xs text-slate-500 truncate max-w-xs" title={m.altText}>
                      {m.altText || <span className="italic opacity-70">No alt text</span>}
                    </p>
                  </td>
                  <td className="px-4 py-3 text-slate-500 capitalize">{m.type || "image"}</td>
                  <td className="px-4 py-3 text-slate-500">{m.size || "-"}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <button
                        onClick={() => copyUrl(m.url)}
                        className="text-slate-400 hover:text-slate-600"
                        title="Copy URL"
                      >
                        <Copy className="h-4 w-4" />
                      </button>
                      {onEdit && (
                        <button
                          onClick={() => setEditingItem(m)}
                          className="text-slate-400 hover:text-slate-600"
                          title="Edit Details"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                      )}
                      {onDelete && (
                        <button
                          onClick={() => onDelete(m.id)}
                          className="text-red-400 hover:text-red-600"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
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
          onClose={() => setEditingItem(null)}
          onSave={onEdit}
        />
      )}
    </div>
  );
}
