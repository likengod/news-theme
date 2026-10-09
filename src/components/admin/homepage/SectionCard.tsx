import { useState, useEffect, useMemo } from "react";
import { Settings2, ChevronDown } from "lucide-react";
import type { SectionStyle } from "@/lib/homepage-config";
import { useCategories } from "@/components/site/AdSettingsContext";

type Props = {
  label: string;
  hint?: string;
  value: SectionStyle;
  showCategory?: boolean;
  showToggle?: boolean;
  showImageFit?: boolean;
  categoryOptions?: string[];
  onChange: (v: SectionStyle) => void;
  children?: React.ReactNode;
};

export function SectionCard({
  label,
  hint,
  value,
  showCategory,
  showToggle,
  showImageFit,
  categoryOptions,
  onChange,
  children,
}: Props) {
  const dbCats = useCategories();
  const [showStyle, setShowStyle] = useState(false);
  const [localTitle, setLocalTitle] = useState(value.title);
  const [localColor, setLocalColor] = useState(value.color);
  const [localFontSize, setLocalFontSize] = useState(value.fontSize);
  const isEnabled = value.enabled !== false;

  const options = useMemo(() => {
    let list: string[] = [];
    if (categoryOptions && categoryOptions.length > 0) {
      list = [...categoryOptions];
    } else if (Array.isArray(dbCats) && dbCats.length > 0) {
      list = dbCats
        .map((c: any) => (typeof c === "string" ? c : c.name || c.slug))
        .filter(Boolean);
    }

    const unique = new Set<string>();
    unique.add("Auto (Latest)");

    for (const name of list) {
      if (name && name !== "Auto (Latest)") {
        unique.add(name);
      }
    }

    if (value.category && value.category !== "Auto (Latest)") {
      unique.add(value.category);
    }

    return Array.from(unique);
  }, [categoryOptions, dbCats, value.category]);

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

  const handleToggle = () => {
    onChange({ ...value, enabled: !isEnabled });
  };

  return (
    <div className={`rounded-lg border border-slate-200 bg-white shadow-sm transition-all hover:border-slate-300 ${!isEnabled ? "opacity-60 bg-slate-50/50" : ""}`}>
      {/* Header row */}
      <div className="flex items-center justify-between gap-3 border-b border-slate-100 bg-slate-50/60 px-4 py-2.5">
        <div className="flex items-center gap-2.5">
          {showToggle && (
            <button
              type="button"
              role="switch"
              aria-checked={isEnabled}
              onClick={handleToggle}
              title={isEnabled ? "Disable section" : "Enable section"}
              className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none ${
                isEnabled ? "bg-slate-900" : "bg-slate-300"
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-xs transition duration-200 ${
                  isEnabled ? "translate-x-4" : "translate-x-0"
                }`}
              />
            </button>
          )}
          <div>
            <p className="text-sm font-semibold text-slate-900 flex items-center gap-1.5">
              {label}
              {showToggle && (
                <span className={`text-[10px] px-1.5 py-0.2 rounded font-medium ${isEnabled ? "bg-emerald-100 text-emerald-800" : "bg-slate-200 text-slate-600"}`}>
                  {isEnabled ? "Visible" : "Hidden"}
                </span>
              )}
            </p>
            {hint && <p className="text-[11px] text-slate-500">{hint}</p>}
          </div>
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
            <span className="mb-1 block text-[11px] font-medium text-slate-500">Heading text</span>
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
                {options.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </label>
          )}

          {showImageFit && (
            <label className="block">
              <span className="mb-1 block text-[11px] font-medium text-slate-500">
                Featured image display style
              </span>
              <select
                value={value.imageFit ?? "contain"}
                onChange={(e) => onChange({ ...value, imageFit: e.target.value as any })}
                className="h-9 w-full rounded-md border border-slate-200 bg-white px-2 text-sm font-semibold focus:border-slate-900 focus:outline-none"
              >
                <option value="contain">Fit Full Image (Uncropped / Show 100% of photo &amp; text)</option>
                <option value="natural">Natural Aspect Ratio (Original photo shape)</option>
                <option value="cover">Crop to Fill Card (Zoom &amp; Fill)</option>
              </select>
            </label>
          )}
        </div>

        {children && <div className="pt-2 border-t border-slate-100">{children}</div>}

        {/* Style toggle */}
        <button
          type="button"
          onClick={() => setShowStyle((s) => !s)}
          className="inline-flex h-8 items-center gap-1.5 rounded-md border border-slate-200 bg-white px-3 text-xs font-medium text-slate-600 hover:bg-slate-50"
        >
          <Settings2 className="h-3.5 w-3.5" />
          {showStyle ? "Hide" : "Change"} heading style
          <ChevronDown className={`h-3.5 w-3.5 transition ${showStyle ? "rotate-180" : ""}`} />
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
                <span className="mb-1 block text-[11px] font-medium text-slate-500">Color</span>
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
