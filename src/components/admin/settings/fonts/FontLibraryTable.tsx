import React, { useState, useRef, useEffect } from "react";
import {
  Search,
  Globe,
  Plus,
  Upload,
  HardDrive,
  Star,
  Trash2,
  ChevronDown,
  Check,
} from "lucide-react";
import type { FontEntry } from "@/lib/font-config";

interface FontLibraryTableProps {
  fonts: FontEntry[];
  search: string;
  onSearchChange: (v: string) => void;
  previewText: string;
  onOpenCatalog: () => void;
  onOpenCustomModal: () => void;
  onUploadFont: (file: File) => void;
  onSetDefault: (id: string) => void;
  onDeleteFont: (id: string) => void;
}

export function FontLibraryTable({
  fonts,
  search,
  onSearchChange,
  previewText,
  onOpenCatalog,
  onOpenCustomModal,
  onUploadFont,
  onSetDefault,
  onDeleteFont,
}: FontLibraryTableProps) {
  const filteredFonts = fonts.filter(
    (f) =>
      f.name.toLowerCase().includes(search.toLowerCase()) ||
      f.family.toLowerCase().includes(search.toLowerCase()),
  );

  const defaultFontEntry = fonts.find((f) => f.isDefault);

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search fonts..."
            className="w-full rounded-md border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400"
          />
        </div>
        <button
          onClick={onOpenCatalog}
          className="inline-flex items-center gap-2 rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-800 transition"
        >
          <Globe className="h-4 w-4" /> Add Google Font
        </button>
        <button
          onClick={onOpenCustomModal}
          className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition"
        >
          <Plus className="h-4 w-4" /> Custom Font Name
        </button>
        <UploadButton onUpload={onUploadFont} />
      </div>

      {/* Font count */}
      <p className="text-xs text-slate-500 mb-3">
        {fonts.length} font{fonts.length !== 1 ? "s" : ""} registered
        {defaultFontEntry && (
          <>
            {" "}
            · Default: <strong className="text-slate-900">{defaultFontEntry.name}</strong>
          </>
        )}
      </p>

      {/* Font list */}
      <div className="overflow-hidden rounded-md border border-slate-200">
        <table className="min-w-full divide-y divide-slate-200 text-left text-xs">
          <thead className="bg-slate-50 font-semibold text-slate-700">
            <tr>
              <th className="px-4 py-2.5">Font Name</th>
              <th className="px-4 py-2.5">Preview</th>
              <th className="px-4 py-2.5 text-center">Source</th>
              <th className="px-4 py-2.5 text-center">Weights</th>
              <th className="px-4 py-2.5 text-center">Default</th>
              <th className="px-4 py-2.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {filteredFonts.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-slate-400">
                  {search ? "No fonts match your search" : "No fonts registered"}
                </td>
              </tr>
            ) : (
              filteredFonts.map((font) => (
                <FontRow
                  key={font.id}
                  font={font}
                  previewText={previewText}
                  onSetDefault={onSetDefault}
                  onDelete={onDeleteFont}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function FontRow({
  font,
  previewText,
  onSetDefault,
  onDelete,
}: {
  font: FontEntry;
  previewText: string;
  onSetDefault: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <tr className="hover:bg-slate-50/50 transition">
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-900">{font.name}</span>
          {font.isSystem && (
            <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[9px] font-bold text-slate-500 uppercase">
              System
            </span>
          )}
        </div>
        <p className="text-[10px] text-slate-400 font-mono mt-0.5">"{font.family}"</p>
      </td>
      <td className="px-4 py-3 max-w-[200px]">
        <p
          className="text-sm text-slate-800 truncate"
          style={{ fontFamily: `"${font.family}", sans-serif` }}
        >
          {previewText.slice(0, 30)}
        </p>
      </td>
      <td className="px-4 py-3 text-center">
        {font.source === "google" ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-medium text-blue-700">
            <Globe className="h-3 w-3" /> Google
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-medium text-amber-700">
            <HardDrive className="h-3 w-3" /> Upload
          </span>
        )}
      </td>
      <td className="px-4 py-3 text-center">
        <span className="text-[11px] text-slate-500">{font.weights.join(", ")}</span>
      </td>
      <td className="px-4 py-3 text-center">
        <button
          onClick={() => onSetDefault(font.id)}
          className={`rounded-full p-1.5 transition ${
            font.isDefault
              ? "bg-amber-100 text-amber-600"
              : "text-slate-300 hover:text-amber-500 hover:bg-amber-50"
          }`}
          title={font.isDefault ? "Default font" : "Set as default"}
        >
          <Star className={`h-4 w-4 ${font.isDefault ? "fill-current" : ""}`} />
        </button>
      </td>
      <td className="px-4 py-3 text-right">
        {font.isSystem ? (
          <span className="text-[10px] text-slate-400 italic">Protected</span>
        ) : (
          <button
            onClick={() => onDelete(font.id)}
            className="rounded p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600 transition"
            title="Delete font"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        )}
      </td>
    </tr>
  );
}

export function FontSelect({
  fonts,
  value,
  onChange,
}: {
  fonts: FontEntry[];
  value: string;
  onChange: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selected = fonts.find((f) => f.id === value);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 hover:border-slate-300 transition"
      >
        <span
          className="truncate"
          style={selected ? { fontFamily: `"${selected.family}", sans-serif` } : undefined}
        >
          {selected?.name ?? "Select a font..."}
        </span>
        <ChevronDown
          className={`h-4 w-4 text-slate-400 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div className="absolute z-50 mt-1 w-full max-h-48 overflow-y-auto rounded-md border border-slate-200 bg-white shadow-lg">
          {fonts.map((f) => (
            <button
              key={f.id}
              onClick={() => {
                onChange(f.id);
                setOpen(false);
              }}
              className={`flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-slate-50 transition ${
                f.id === value ? "bg-slate-100 text-slate-900" : "text-slate-600"
              }`}
            >
              <span
                className="flex-1 truncate text-left"
                style={{ fontFamily: `"${f.family}", sans-serif` }}
              >
                {f.name}
              </span>
              {f.id === value && <Check className="h-4 w-4 text-slate-900" />}
              {f.isDefault && <Star className="h-3 w-3 text-amber-500 fill-current" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function UploadButton({ onUpload }: { onUpload: (file: File) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept=".woff2,.woff,.ttf,.otf"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onUpload(file);
          if (inputRef.current) inputRef.current.value = "";
        }}
      />
      <button
        onClick={() => inputRef.current?.click()}
        className="inline-flex items-center gap-2 rounded-md border border-dashed border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-600 hover:border-slate-400 hover:bg-slate-50 transition"
      >
        <Upload className="h-4 w-4" /> Upload Font File
      </button>
    </>
  );
}
