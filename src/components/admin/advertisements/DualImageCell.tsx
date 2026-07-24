import React, { useEffect, useRef, useState } from "react";
import { Plus, X, Upload, FolderOpen } from "lucide-react";
import { toast } from "sonner";
import { type AdSlideItem, type AdSlot } from "@/lib/site-content";
import { LibraryPicker } from "@/components/admin/MediaField";
import { trackUpload } from "@/lib/media-library";

export function SingleSlotImagePicker({
  label,
  badgeColor,
  value,
  aspectClass,
  emptyText,
  recSize,
  onChange,
}: {
  label: string;
  badgeColor: string;
  value?: string;
  aspectClass: string;
  emptyText: string;
  recSize: string;
  onChange: (url: string) => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const onDoc = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [menuOpen]);

  const handleDeviceUpload = async (f?: File | null) => {
    if (!f) return;
    try {
      const item = await trackUpload(f, "advertisement");
      onChange(item.dataUrl);
      toast.success(`${label} image uploaded`);
    } catch {
      toast.error("Upload failed");
    }
    if (fileRef.current) fileRef.current.value = "";
  };

  return (
    <div ref={containerRef} className="relative flex flex-col items-center">
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => handleDeviceUpload(e.target.files?.[0])}
      />
      <div
        onClick={() => setMenuOpen((o) => !o)}
        title={`Click to add/change ${label} image (${recSize})`}
        className={`group relative flex cursor-pointer items-center justify-center overflow-hidden rounded-lg border border-dashed transition-all duration-200 ${aspectClass} ${
          value
            ? "border-slate-300 bg-white shadow-xs hover:border-slate-500 hover:shadow-md"
            : "border-slate-300 bg-slate-50 hover:border-slate-400 hover:bg-slate-100/80"
        }`}
      >
        {value ? (
          <>
            <img src={value} alt={label} className="h-full w-full object-cover" />
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity duration-200 group-hover:opacity-100 backdrop-blur-[1px]">
              <span className="rounded bg-white/90 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-slate-900 shadow-xs">
                Change
              </span>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onChange("");
              }}
              title="Remove image"
              className="absolute top-1 right-1 grid h-5 w-5 place-items-center rounded-full bg-red-600 text-white shadow-sm opacity-0 transition-opacity duration-200 hover:bg-red-700 group-hover:opacity-100"
            >
              <X className="h-3 w-3" />
            </button>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center p-1 text-slate-400 group-hover:text-slate-600">
            <Plus className="h-4 w-4" />
            <span className="mt-0.5 text-[9px] font-semibold">{emptyText}</span>
          </div>
        )}
      </div>

      <div className="mt-1 flex items-center gap-1">
        <span className={`rounded px-1.5 py-0.2 text-[8px] font-bold uppercase tracking-wider text-white ${badgeColor}`}>
          {label}
        </span>
        <span className="text-[9px] text-slate-400 whitespace-nowrap">{recSize}</span>
      </div>

      {menuOpen && (
        <div className="absolute left-1/2 top-full z-50 mt-1.5 w-52 -translate-x-1/2 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-xl animate-in fade-in-50 zoom-in-95">
          <div className="border-b border-slate-100 bg-slate-50/80 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-600">
            {label} ({recSize})
          </div>
          <button
            type="button"
            onClick={() => {
              setMenuOpen(false);
              fileRef.current?.click();
            }}
            className="flex w-full items-center gap-2.5 px-3 py-2 text-left text-xs text-slate-700 transition hover:bg-slate-50"
          >
            <Upload className="h-4 w-4 shrink-0 text-slate-500" />
            <div>
              <div className="font-medium text-slate-900">Upload image</div>
              <div className="text-[10px] text-slate-400">From your device</div>
            </div>
          </button>
          <button
            type="button"
            onClick={() => {
              setMenuOpen(false);
              setPickerOpen(true);
            }}
            className="flex w-full items-center gap-2.5 border-t border-slate-100 px-3 py-2 text-left text-xs text-slate-700 transition hover:bg-slate-50"
          >
            <FolderOpen className="h-4 w-4 shrink-0 text-slate-500" />
            <div>
              <div className="font-medium text-slate-900">Media Library</div>
              <div className="text-[10px] text-slate-400">Select existing image</div>
            </div>
          </button>
        </div>
      )}

      {pickerOpen && (
        <LibraryPicker
          accept="image/*"
          onClose={() => setPickerOpen(false)}
          onPick={(item) => {
            onChange(item.dataUrl);
            setPickerOpen(false);
            toast.success(`${label} image selected`);
          }}
        />
      )}
    </div>
  );
}

export function DualImageCell({
  ad,
  slot,
  onUpdate,
}: {
  ad: AdSlideItem;
  slot: AdSlot;
  onUpdate: (id: string, patch: Partial<AdSlideItem>) => void;
}) {
  const slotDefaultOrient = slot === "home2" ? "landscape" : "portrait";
  const effectiveOrient = ad.orientation || slotDefaultOrient;

  const portraitVal =
    ad.imagePortrait ||
    (ad.image && (effectiveOrient === "portrait" || !ad.imageLandscape) ? ad.image : "");

  const landscapeVal =
    ad.imageLandscape ||
    (ad.image && (effectiveOrient === "landscape" || !ad.imagePortrait) ? ad.image : "");

  const landscapeSize = slot === "home2" ? "406 × 196 px" : slot === "leaderboard" ? "728 × 90 px, etc." : "1200 × 675 px";
  
  if (slot === "leaderboard") {
    return (
      <div className="flex items-center gap-3 py-1">
        <SingleSlotImagePicker
          label="Mobile View"
          badgeColor="bg-blue-600"
          value={portraitVal}
          aspectClass="w-20 h-10"
          emptyText="+ Mobile"
          recSize="320 × 50 px, etc."
          onChange={(url) => {
            onUpdate(ad.id, {
              imagePortrait: url,
              image: url || ad.imageLandscape || ad.image,
            });
          }}
        />
        <SingleSlotImagePicker
          label="Desktop View"
          badgeColor="bg-emerald-600"
          value={landscapeVal}
          aspectClass="w-24 h-10"
          emptyText="+ Desktop"
          recSize="728 × 90 px, etc."
          onChange={(url) => {
            onUpdate(ad.id, {
              imageLandscape: url,
              image: url || ad.imagePortrait || ad.image,
            });
          }}
        />
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 py-1">
      <SingleSlotImagePicker
        label="Portrait"
        badgeColor="bg-indigo-600"
        value={portraitVal}
        aspectClass="w-14 h-18"
        emptyText="+ Portrait"
        recSize="600 × 800 px"
        onChange={(url) => {
          onUpdate(ad.id, {
            imagePortrait: url,
            image: url || ad.imageLandscape || ad.image,
            orientation: "portrait",
          });
        }}
      />
      <SingleSlotImagePicker
        label="Landscape"
        badgeColor="bg-emerald-600"
        value={landscapeVal}
        aspectClass="w-22 h-14"
        emptyText="+ Landscape"
        recSize={landscapeSize}
        onChange={(url) => {
          onUpdate(ad.id, {
            imageLandscape: url,
            image: url || ad.imagePortrait || ad.image,
            orientation: "landscape",
          });
        }}
      />
    </div>
  );
}
