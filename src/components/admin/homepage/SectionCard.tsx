import { useState, useEffect } from "react";
import { Settings2, ChevronDown } from "lucide-react";
import { ALL_CATEGORY_OPTIONS, type SectionStyle } from "@/lib/homepage-config";

type Props = {
  label: string;
  hint?: string;
  value: SectionStyle;
  showCategory?: boolean;
  onChange: (v: SectionStyle) => void;
};

export function SectionCard({ label, hint, value, showCategory, onChange }: Props) {
  const [showStyle, setShowStyle] = useState(false);
  const [localTitle, setLocalTitle] = useState(value.title);
  const [localColor, setLocalColor] = useState(value.color);
  const [localFontSize, setLocalFontSize] = useState(value.fontSize);

  useEffect(() => {
    setLocalTitle(value.title);
    setLocalColor(value.color);
    setLocalFontSize(value.fontSize);
  }, [value.title, value.color, value.fontSize]);

  const handleTitleChange = (val: string) => {
    setLocalTitle(val);
    onChange({ ...value, title: val });
  };

  const handleColorChange = (val: string) => {
    setLocalColor(val);
    onChange({ ...value, color: val });
  };

  const handleFontSizeChange = (val: number) => {
    setLocalFontSize(val);
    onChange({ ...value, fontSize: val });
  };

  return (
    <div className="rounded-lg border border-slate-200 bg-white shadow-sm transition-all hover:border-slate-300">
      {/* Header row */}
      <div className="flex items-center justify-between gap-3 border-b border-slate-100 bg-slate-50/60 px-4 py-2.5">
        <div>
          <p className="text-sm font-semibold text-slate-900">{label}</p>
          {hint && <p className="text-[11px] text-slate-500">{hint}</p>}
        </div>
        <div
          className="hidden max-w-[180px] truncate font-bold uppercase tracking-[0.15em] sm:block"
          style={{ color: localColor, fontSize: `${Math.min(localFontSize, 14)}px` }}
          title={localTitle}
        >
          {localTitle || "—"}
        </div>
      </div>

      <div className="space-y-3 p-4">
        {/* Primary controls */}
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1 block text-[11px] font-medium text-slate-500">
              Heading text
            </span>
            <input
              type="text"
              value={localTitle}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder={label}
              className="h-9 w-full rounded-md border border-slate-200 px-3 text-sm focus:border-slate-900 focus:outline-none"
            />
          </label>

          {showCategory && (
            <label className="block">
              <span className="mb-1 block text-[11px] font-medium text-slate-500">
                Show news from category
              </span>
              <select
                value={value.category ?? "Auto (Latest)"}
                onChange={(e) => onChange({ ...value, category: e.target.value })}
                className="h-9 w-full rounded-md border border-slate-200 bg-white px-2 text-sm focus:border-slate-900 focus:outline-none"
              >
                {ALL_CATEGORY_OPTIONS.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </label>
          )}
        </div>

        {/* Style toggle */}
        <button
          type="button"
          onClick={() => setShowStyle((s) => !s)}
          className="inline-flex h-8 items-center gap-1.5 rounded-md border border-slate-200 bg-white px-3 text-xs font-medium text-slate-600 hover:bg-slate-50"
        >
          <Settings2 className="h-3.5 w-3.5" />
          {showStyle ? "Hide" : "Change"} heading style
          <ChevronDown
            className={`h-3.5 w-3.5 transition ${showStyle ? "rotate-180" : ""}`}
          />
        </button>

        {showStyle && (
          <div className="flex flex-wrap items-end gap-3 border-t border-slate-100 pt-3">
            <label className="w-32">
              <span className="mb-1 block text-[11px] font-medium text-slate-500">
                Text size (px)
              </span>
              <input
                type="number"
                min={8}
                max={64}
                value={localFontSize}
                onChange={(e) => handleFontSizeChange(Number(e.target.value) || 12)}
                className="h-9 w-full rounded-md border border-slate-200 px-2 text-sm focus:border-slate-900 focus:outline-none"
              />
            </label>

            <label className="flex items-end gap-2">
              <div>
                <span className="mb-1 block text-[11px] font-medium text-slate-500">
                  Color
                </span>
                <input
                  type="color"
                  value={localColor}
                  onChange={(e) => handleColorChange(e.target.value)}
                  className="h-9 w-14 cursor-pointer rounded-md border border-slate-200 p-0.5"
                />
              </div>
              <input
                type="text"
                value={localColor}
                onChange={(e) => handleColorChange(e.target.value)}
                className="h-9 w-28 rounded-md border border-slate-200 px-2 text-sm focus:border-slate-900 focus:outline-none font-mono"
              />
            </label>

            <button
              type="button"
              onClick={() => {
                handleFontSizeChange(12);
                handleColorChange("#1A1110");
              }}
              className="h-9 rounded-md border border-slate-200 bg-white px-3 text-xs font-medium text-slate-600 hover:bg-slate-50"
            >
              Reset style
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
