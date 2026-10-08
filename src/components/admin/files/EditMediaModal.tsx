import { useState, useRef } from "react";
import { X, Sparkles, Upload, AlertTriangle, RefreshCw, Check } from "lucide-react";
import { type MediaItemDef } from "./MediaGrid";
import { deriveAltText, formatBytes, MAX_MEDIA_FILE_SIZE } from "@/lib/media-library";
import { toast } from "sonner";

type Props = {
  item: MediaItemDef;
  isDuplicate?: boolean;
  duplicateCount?: number;
  onClose: () => void;
  onSave: (id: string, name: string, altText?: string, description?: string) => void;
  onReplace?: (id: string, file: File, name: string, altText?: string, description?: string) => Promise<void> | void;
};

export function EditMediaModal({ item, isDuplicate, duplicateCount, onClose, onSave, onReplace }: Props) {
  const [name, setName] = useState(item.name || "");
  const [altText, setAltText] = useState(item.altText || (item.name ? deriveAltText(item.name) : ""));
  const [description, setDescription] = useState(item.description || "");
  const [replacementFile, setReplacementFile] = useState<File | null>(null);
  const [replacementPreview, setReplacementPreview] = useState<string | null>(null);
  const [replacing, setReplacing] = useState(false);
  const replaceInputRef = useRef<HTMLInputElement>(null);

  // Track if user manually customized altText or if it was auto-synced
  const [altManuallyEdited, setAltManuallyEdited] = useState(Boolean(item.altText && item.altText !== deriveAltText(item.name || "")));

  const handleNameChange = (val: string) => {
    setName(val);
    if (!altManuallyEdited || !altText.trim()) {
      setAltText(deriveAltText(val));
    }
  };

  const handleAutoFetchAlt = () => {
    const derived = deriveAltText(name || item.name || "");
    setAltText(derived);
    setAltManuallyEdited(false);
    toast.success(`Alt text generated: "${derived}"`);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_MEDIA_FILE_SIZE) {
      toast.error(`"${file.name}" (${formatBytes(file.size)}) exceeds the 1 MB limit.`);
      return;
    }

    setReplacementFile(file);
    const reader = new FileReader();
    reader.onload = () => {
      setReplacementPreview(String(reader.result));
    };
    reader.readAsDataURL(file);

    // If file name was default or empty, offer to update
    if (!name || name === item.name) {
      const cleanNewName = file.name.split(".").slice(0, -1).join(".") || file.name;
      setName(cleanNewName);
      if (!altManuallyEdited) {
        setAltText(deriveAltText(cleanNewName));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const finalAlt = altText.trim() || deriveAltText(name.trim());

    if (replacementFile && onReplace) {
      setReplacing(true);
      try {
        await onReplace(item.id, replacementFile, name.trim(), finalAlt, description.trim());
        toast.success("File replaced and details saved!");
        onClose();
      } catch (err: any) {
        toast.error(err?.message || "Failed to replace file");
      } finally {
        setReplacing(false);
      }
      return;
    }

    onSave(item.id, name.trim(), finalAlt, description.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 bg-slate-50/70">
          <div>
            <h2 className="text-base font-bold text-slate-900">Edit Media Details</h2>
            <p className="text-xs text-slate-500">Manage file metadata, alt text, or replace image</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 text-slate-400 hover:bg-slate-200 hover:text-slate-700 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Duplicate Warning Banner */}
        {isDuplicate && (
          <div className="mx-5 mt-4 flex items-start gap-2.5 rounded-xl border border-amber-200 bg-amber-50/80 p-3 text-xs text-amber-900">
            <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Duplicate Detected:</span> This file appears to have{" "}
              {duplicateCount ? `${duplicateCount} copies` : "duplicates"} in your library (sharing the same name or size). You can replace or rename it to differentiate.
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* File Name with auto alt-text sync */}
          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-700">
              File Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="e.g. upi-payment-guide"
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
            />
          </div>

          {/* Alt Text with auto-fetch button */}
          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Alt Text (SEO & Accessibility)
              </label>
              <button
                type="button"
                onClick={handleAutoFetchAlt}
                className="inline-flex items-center gap-1 rounded-md bg-indigo-50 px-2 py-0.5 text-[11px] font-semibold text-indigo-700 hover:bg-indigo-100 transition cursor-pointer"
                title="Automatically generate Alt Text from file name"
              >
                <Sparkles className="h-3 w-3 text-indigo-600" />
                Auto-fetch from Name
              </button>
            </div>
            <input
              type="text"
              value={altText}
              onChange={(e) => {
                setAltText(e.target.value);
                setAltManuallyEdited(true);
              }}
              placeholder="Brief description for screen readers and SEO"
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
            />
            <p className="mt-1 text-[11px] text-slate-500">
              Used by Google for Image Search ranking and screen readers for accessibility.
            </p>
          </div>

          {/* Replace Image Option */}
          <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-3.5 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Replace File (&lt; 1 MB)
              </span>
              {replacementFile && (
                <button
                  type="button"
                  onClick={() => {
                    setReplacementFile(null);
                    setReplacementPreview(null);
                  }}
                  className="text-[11px] font-semibold text-red-600 hover:underline"
                >
                  Clear replacement
                </button>
              )}
            </div>

            <div className="flex items-center gap-3">
              {/* Preview Box */}
              <div className="h-14 w-20 shrink-0 rounded-lg border border-slate-200 bg-white overflow-hidden grid place-items-center">
                {replacementPreview ? (
                  <img src={replacementPreview} alt="Preview" className="h-full w-full object-cover" />
                ) : item.url ? (
                  <img src={item.url} alt={item.name} className="h-full w-full object-cover" />
                ) : (
                  <span className="text-[10px] text-slate-400">Current</span>
                )}
              </div>

              <div className="flex-1">
                <input
                  ref={replaceInputRef}
                  type="file"
                  accept="image/*,video/*,.pdf"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => replaceInputRef.current?.click()}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition shadow-2xs"
                >
                  <RefreshCw className="h-3.5 w-3.5 text-slate-500" />
                  {replacementFile ? "Choose Different File" : "Upload Replacement Image"}
                </button>
                <p className="mt-1 text-[11px] text-slate-500">
                  {replacementFile
                    ? `Selected: ${replacementFile.name} (${formatBytes(replacementFile.size)})`
                    : "Replaces the underlying image without breaking existing articles using this media ID."}
                </p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-700">
              Description / Caption
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              placeholder="Extended details, source attribution, or photographer credit"
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-end gap-2.5 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={replacing}
              className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={replacing}
              className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-5 py-2 text-xs font-bold text-white shadow-xs hover:bg-slate-800 transition active:scale-95 disabled:opacity-50"
            >
              {replacing ? (
                <>
                  <RefreshCw className="h-3.5 w-3.5 animate-spin" /> Replacing...
                </>
              ) : replacementFile ? (
                <>
                  <Upload className="h-3.5 w-3.5" /> Save & Replace File
                </>
              ) : (
                <>
                  <Check className="h-3.5 w-3.5" /> Save Details
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
