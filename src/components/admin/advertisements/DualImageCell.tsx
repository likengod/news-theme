import React, { useEffect, useRef, useState } from "react";
import { Plus, X, Upload, FolderOpen } from "lucide-react";
import { toast } from "sonner";
import { type AdSlideItem, type AdSlot } from "@/lib/site-content";
import { LibraryPicker } from "@/components/admin/MediaField";
import { trackUpload } from "@/lib/media-library";

async function convertFileToWebp(file: File): Promise<File> {
  if (file.type === "image/webp" || file.name.toLowerCase().endsWith(".webp")) {
    return file;
  }
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.naturalWidth || img.width;
        canvas.height = img.naturalHeight || img.height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(file);
          return;
        }
        ctx.drawImage(img, 0, 0);
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              resolve(file);
              return;
            }
            const webpName = file.name.replace(/\.[^.]+$/, "") + ".webp";
            resolve(new File([blob], webpName, { type: "image/webp" }));
          },
          "image/webp",
          0.82
        );
      };
      img.onerror = () => resolve(file);
      img.src = e.target?.result as string;
    };
    reader.onerror = () => resolve(file);
    reader.readAsDataURL(file);
  });
}

async function convertDataUrlToWebp(dataUrl: string): Promise<string> {
  if (!dataUrl || dataUrl.startsWith("data:image/webp") || dataUrl.toLowerCase().endsWith(".webp")) {
    return dataUrl;
  }
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth || img.width;
      canvas.height = img.naturalHeight || img.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        resolve(dataUrl);
        return;
      }
      ctx.drawImage(img, 0, 0);
      resolve(canvas.toDataURL("image/webp", 0.82));
    };
    img.onerror = () => resolve(dataUrl);
    img.src = dataUrl;
  });
}

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
      const webpFile = await convertFileToWebp(f);
      const isConverted = webpFile !== f;
      const item = await trackUpload(webpFile, "advertisement");
      onChange(item.dataUrl);
      if (isConverted) {
        toast.success(`${label} image converted to WebP and uploaded`);
      } else {
        toast.success(`${label} WebP image uploaded`);
      }
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
        accept=".webp,image/webp"
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
        <span className="rounded bg-emerald-50 border border-emerald-200 px-1 py-0.2 text-[7.5px] font-extrabold uppercase tracking-wider text-emerald-700">
          WebP
        </span>
        <span className="text-[9px] text-slate-400 whitespace-nowrap">{recSize}</span>
      </div>

      {menuOpen && (
        <div className="absolute left-1/2 top-full z-50 mt-1.5 w-56 -translate-x-1/2 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-xl animate-in fade-in-50 zoom-in-95">
          <div className="border-b border-slate-100 bg-slate-50/80 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-600 flex items-center justify-between">
            <span>{label} ({recSize})</span>
            <span className="text-[8px] font-extrabold text-emerald-600 bg-emerald-100/70 px-1 rounded">WEBP ONLY</span>
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
              <div className="font-medium text-slate-900">Upload WebP image</div>
              <div className="text-[10px] text-slate-400">Select .webp from device (auto-converts)</div>
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
              <div className="text-[10px] text-slate-400">Select image (auto-converts to .webp)</div>
            </div>
          </button>
        </div>
      )}

      {pickerOpen && (
        <LibraryPicker
          accept="image/webp,.webp"
          onClose={() => setPickerOpen(false)}
          onPick={async (item) => {
            try {
              const webpData = await convertDataUrlToWebp(item.dataUrl);
              const isConverted = webpData !== item.dataUrl;
              onChange(webpData);
              setPickerOpen(false);
              if (isConverted) {
                toast.success(`${label} image converted to WebP and selected`);
              } else {
                toast.success(`${label} WebP image selected`);
              }
            } catch {
              onChange(item.dataUrl);
              setPickerOpen(false);
              toast.success(`${label} image selected`);
            }
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
  
  if (slot === "home1" || slot === "ad3") {
    const portraitValOnly = ad.imagePortrait || (ad.orientation === "portrait" ? ad.image : (!ad.imageLandscape ? ad.image : ""));
    return (
      <div className="flex items-center gap-3 py-1">
        <SingleSlotImagePicker
          label="Portrait"
          badgeColor="bg-indigo-600"
          value={portraitValOnly || ""}
          aspectClass="w-16 h-20"
          emptyText="+ Portrait"
          recSize="600 × 800 px"
          onChange={(url) => {
            onUpdate(ad.id, {
              imagePortrait: url,
              image: url,
              imageLandscape: undefined,
              orientation: "portrait",
            });
          }}
        />
      </div>
    );
  }

  if (slot === "home2") {
    const landscapeValOnly = ad.imageLandscape || (ad.orientation === "landscape" ? ad.image : (!ad.imagePortrait ? ad.image : ""));
    return (
      <div className="flex items-center gap-3 py-1">
        <SingleSlotImagePicker
          label="Landscape"
          badgeColor="bg-emerald-600"
          value={landscapeValOnly || ""}
          aspectClass="w-28 h-14"
          emptyText="+ Landscape"
          recSize="406 × 196 px"
          onChange={(url) => {
            onUpdate(ad.id, {
              imageLandscape: url,
              image: url,
              imagePortrait: undefined,
              orientation: "landscape",
            });
          }}
        />
      </div>
    );
  }

  if (slot === "reel_ads") {
    return (
      <div className="flex items-center gap-3 py-1">
        <SingleSlotImagePicker
          label="Vertical Reel Ad"
          badgeColor="bg-purple-600"
          value={portraitVal || ad.image || ""}
          aspectClass="w-16 aspect-[9/16]"
          emptyText="+ Reel Ad"
          recSize="1080 × 1920 px"
          onChange={(url) => {
            onUpdate(ad.id, {
              imagePortrait: url,
              image: url,
              orientation: "portrait",
            });
          }}
        />
      </div>
    );
  }

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

  if (slot === "featured_slide") {
    return (
      <div className="flex items-center gap-3 py-1">
        <SingleSlotImagePicker
          label="Featured Slider Ad"
          badgeColor="bg-emerald-600"
          value={landscapeVal}
          aspectClass="w-24 aspect-[16/10]"
          emptyText="+ Image"
          recSize="800 × 500 px"
          onChange={(url) => {
            onUpdate(ad.id, {
              imageLandscape: url,
              image: url,
              orientation: "landscape",
            });
          }}
        />
      </div>
    );
  }

  // Popup & other slots: Portrait + Landscape
  return (
    <div className="flex items-center gap-3 py-1">
      <SingleSlotImagePicker
        label="Portrait"
        badgeColor="bg-indigo-600"
        value={portraitVal}
        aspectClass="w-14 h-18"
        emptyText="+ Portrait"
        recSize="600 × 800 px (Mobile)"
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
        recSize="1200 × 675 px (Desktop)"
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
