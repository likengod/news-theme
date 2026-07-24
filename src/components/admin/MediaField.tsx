import { useEffect, useRef, useState } from "react";
import { Upload, Image as ImageIcon, X, Trash2, FolderOpen, Search, Plus, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import {
  mediaLibrary,
  trackUpload,
  formatBytes,
  type MediaItem,
  type MediaUsage,
} from "@/lib/media-library";

type Props = {
  label?: string;
  value: string;
  onChange: (v: string) => void;
  usage?: MediaUsage;
  hint?: string;
  accept?: string;
  previewClassName?: string;
  dark?: boolean;
  compact?: boolean;
  /** Recommended dimensions, e.g. "1200×630 px". Rendered below the field. */
  recommendedSize?: string;
  /** Hide the recommended size / hint text. Useful when the guidance is shown elsewhere (e.g. slot header). */
  hideRecommended?: boolean;
  /** Keep preview and image actions in one row for compact table/card layouts. */
  inline?: boolean;
  /** Text shown inside the empty preview box. */
  emptyLabel?: string;
  /** Automatically open the Change/Add image dropdown menu. */
  autoOpenMenu?: boolean;
  /** Hide the Remove button next to Change Image. */
  hideRemoveBtn?: boolean;
  /** Hide all control buttons (render preview box only). */
  hideControls?: boolean;
};

/**
 * Reusable field: preview + Upload + Select from library + Remove.
 * Every upload is tracked in the shared media library, so the same
 * image is later selectable across Articles, Ads, Site settings,
 * Journalist avatars, etc.
 */
export function MediaField({
  label,
  value,
  onChange,
  usage = "other",
  hint,
  accept = "image/*",
  previewClassName,
  dark,
  compact,
  recommendedSize,
  hideRecommended,
  inline,
  emptyLabel,
  autoOpenMenu,
  hideRemoveBtn,
  hideControls,
}: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (autoOpenMenu) {
      setMenuOpen(true);
    }
  }, [autoOpenMenu]);

  useEffect(() => {
    if (!menuOpen) return;
    const onDoc = (e: MouseEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [menuOpen]);

  const handleFile = async (f?: File | null) => {
    if (!f) return;
    try {
      const item = await trackUpload(f, usage);
      onChange(item.dataUrl);
      toast.success("Uploaded to file manager");
    } catch {
      toast.error("Upload failed");
    }
    if (fileRef.current) fileRef.current.value = "";
  };

  const preview = (
    <div
      className={
        previewClassName ??
        `flex ${compact ? "h-20" : "h-28"} items-center justify-center overflow-hidden rounded-md border border-dashed ${
          dark ? "border-slate-700 bg-slate-900" : "border-slate-200 bg-slate-50"
        }`
      }
    >
      {value ? (
        <img src={value} alt={label ?? "preview"} className="max-h-full max-w-full object-contain p-2" />
      ) : (
        <div className="text-center text-slate-400">
          <ImageIcon className="mx-auto h-5 w-5" />
          <span className="mt-1 block text-[11px] leading-tight">{emptyLabel ?? "No image"}</span>
        </div>
      )}
    </div>
  );

  const controls = (
    <>
      <input
        ref={fileRef}
        type="file"
        accept={accept}
        hidden
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
      <div className="flex flex-wrap items-center gap-2">
        <div ref={menuRef} className="relative flex-1">
          <button
            type="button"
            onClick={() => setMenuOpen((o) => !o)}
            className="inline-flex w-full items-center justify-center gap-1.5 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
          >
            <Plus className="h-3.5 w-3.5" />
            {value ? "Change image" : "Add image"}
            <ChevronDown className="h-3.5 w-3.5 opacity-60" />
          </button>
          {menuOpen && (
            <div className="absolute left-0 right-0 z-20 mt-1 overflow-hidden rounded-md border border-slate-200 bg-white shadow-lg">
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  fileRef.current?.click();
                }}
                className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs text-slate-700 hover:bg-slate-50"
              >
                <Upload className="h-3.5 w-3.5" />
                <div>
                  <div className="font-medium">Upload image</div>
                  <div className="text-[10px] text-slate-500">From your device — saved to file manager</div>
                </div>
              </button>
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  setPickerOpen(true);
                }}
                className="flex w-full items-center gap-2 border-t border-slate-100 px-3 py-2 text-left text-xs text-slate-700 hover:bg-slate-50"
              >
                <FolderOpen className="h-3.5 w-3.5" />
                <div>
                  <div className="font-medium">Select image</div>
                  <div className="text-[10px] text-slate-500">Pick from file manager library</div>
                </div>
              </button>
            </div>
          )}
        </div>
        {value && !label && !hideRemoveBtn && (
          <button
            type="button"
            onClick={() => onChange("")}
            className="inline-flex items-center gap-1.5 rounded-md border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-100"
          >
            <Trash2 className="h-3.5 w-3.5" /> Remove
          </button>
        )}
      </div>
      {(hint || recommendedSize) && !hideRecommended && (
        <p className="text-[11px] text-slate-500">
          {recommendedSize && (
            <span className="font-medium text-slate-600">Recommended: {recommendedSize}.</span>
          )}
          {recommendedSize && hint ? " " : ""}
          {hint}
        </p>
      )}
    </>
  );

  return (
    <div className="space-y-2">
      {label && (
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-700">{label}</span>
          {value && (
            <button
              type="button"
              onClick={() => onChange("")}
              className="inline-flex items-center gap-1 text-[11px] text-red-600 hover:underline"
            >
              <X className="h-3 w-3" /> Remove
            </button>
          )}
        </div>
      )}
      {hideControls ? (
        preview
      ) : inline ? (
        <div className="flex items-center gap-2">
          {preview}
          <div className="min-w-32 flex-1 space-y-1.5">{controls}</div>
        </div>
      ) : (
        <>
          {preview}
          {controls}
        </>
      )}
      {pickerOpen && (
        <LibraryPicker
          accept={accept}
          onClose={() => setPickerOpen(false)}
          onPick={(item) => {
            onChange(item.dataUrl);
            setPickerOpen(false);
            toast.success("Image selected from library");
          }}
        />
      )}
    </div>
  );
}

export function LibraryPicker({
  onClose,
  onPick,
  accept,
}: {
  onClose: () => void;
  onPick: (m: MediaItem) => void;
  accept: string;
}) {
  const [items, setItems] = useState<MediaItem[]>(() => mediaLibrary.list());
  const [q, setQ] = useState("");

  useEffect(() => {
    const refresh = () => setItems(mediaLibrary.list());
    window.addEventListener("media-library-change", refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener("media-library-change", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  const wantsImage = accept.includes("image");
  const filtered = items.filter((m) => {
    if (wantsImage && !m.type.startsWith("image/")) return false;
    if (q && !m.name.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  });

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="max-h-[85vh] w-full max-w-3xl overflow-hidden rounded-lg bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
          <div>
            <h3 className="text-sm font-semibold">Select image from file manager</h3>
            <p className="text-[11px] text-slate-500">
              {filtered.length} of {items.length} file{items.length === 1 ? "" : "s"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="grid h-7 w-7 place-items-center rounded-md hover:bg-slate-100"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="border-b border-slate-200 px-4 py-2">
          <div className="relative">
            <Search className="pointer-events-none absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
            <input
              autoFocus
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by name…"
              className="w-full rounded-md border border-slate-200 py-1.5 pl-7 pr-3 text-sm focus:border-slate-900 focus:outline-none"
            />
          </div>
        </div>
        <div className="max-h-[60vh] overflow-y-auto p-4">
          {filtered.length === 0 ? (
            <div className="grid place-items-center py-12 text-center text-sm text-slate-500">
              <ImageIcon className="mb-2 h-8 w-8 text-slate-300" />
              No images yet. Use the Upload button — it saves here automatically.
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
              {filtered.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => onPick(m)}
                  className="group overflow-hidden rounded-md border border-slate-200 bg-slate-50 text-left hover:border-slate-900 hover:shadow-sm"
                >
                  <div className="grid h-24 place-items-center bg-white">
                    <img src={m.dataUrl} alt={m.name} className="max-h-full max-w-full object-contain" />
                  </div>
                  <div className="border-t border-slate-200 px-2 py-1">
                    <div className="truncate text-[11px] font-medium text-slate-700">{m.name}</div>
                    <div className="text-[10px] text-slate-400">
                      {formatBytes(m.size)} · {m.usage}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}