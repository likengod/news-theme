import React, { useState, useEffect } from "react";
import { Sparkles, Check, Trash2, Copy, CheckCheck, Palette, Plus, Minus, Code2 } from "lucide-react";
import { toast } from "sonner";

export interface CustomGradientItem {
  id: string;
  name: string;
  css: string;
}

interface CustomGradientBuilderProps {
  currentGradient: string;
  onApply: (css: string) => void;
  savedGradients: CustomGradientItem[];
  onSaveCustom: (name: string, css: string) => void;
  onDeleteCustom: (id: string) => void;
}

const POPULAR_GRADIENTS = [
  { name: "Sunset Glow", css: "linear-gradient(to right, #f12711, #f5af19)" },
  { name: "Royal Gold", css: "linear-gradient(to right, #f6d365, #fda085)" },
  { name: "Crimson Festival", css: "linear-gradient(to right, #ff0844, #ffb199)" },
  { name: "Ocean Breeze", css: "linear-gradient(to right, #00c6ff, #0072ff)" },
  { name: "Neon Cyber", css: "linear-gradient(to right, #ff007f, #00f0ff)" },
  { name: "Emerald Mint", css: "linear-gradient(to right, #0575e6, #00f260)" },
  { name: "Purple Dream", css: "linear-gradient(to right, #8a2387, #e94057)" },
  { name: "Rose Quartz", css: "linear-gradient(to right, #f857a6, #ff5858)" },
];

export function CustomGradientBuilder({
  currentGradient,
  onApply,
  savedGradients,
  onSaveCustom,
  onDeleteCustom,
}: CustomGradientBuilderProps) {
  const [gradientType, setGradientType] = useState<"linear" | "radial">("linear");
  const [direction, setDirection] = useState<string>("to right");

  const [fromColor, setFromColor] = useState("#FF0844");
  const [toColor, setToColor] = useState("#FFB199");
  const [useMiddleColor, setUseMiddleColor] = useState(false);
  const [middleColor, setMiddleColor] = useState("#7F00FF");

  const [gradientName, setGradientName] = useState("");
  const [showCssPaste, setShowCssCssPaste] = useState(false);
  const [rawCss, setRawCss] = useState("");
  const [copied, setCopied] = useState(false);

  // Compute clean CSS gradient
  const activeGradientCss = React.useMemo(() => {
    if (showCssPaste && rawCss.trim()) {
      return rawCss.trim();
    }
    if (gradientType === "radial") {
      if (useMiddleColor) {
        return `radial-gradient(circle at center, ${fromColor}, ${middleColor}, ${toColor})`;
      }
      return `radial-gradient(circle at center, ${fromColor}, ${toColor})`;
    }

    if (useMiddleColor) {
      return `linear-gradient(${direction}, ${fromColor}, ${middleColor}, ${toColor})`;
    }
    return `linear-gradient(${direction}, ${fromColor}, ${toColor})`;
  }, [gradientType, direction, fromColor, useMiddleColor, middleColor, toColor, showCssPaste, rawCss]);

  const handleApply = () => {
    onApply(activeGradientCss);
    toast.success("Gradient applied to website!");
  };

  const handleSave = () => {
    const name = gradientName.trim() || `Custom Gradient #${savedGradients.length + 1}`;
    onSaveCustom(name, activeGradientCss);
    onApply(activeGradientCss);
    setGradientName("");
    toast.success(`Saved "${name}" to presets!`);
  };

  const handleCopyCss = async () => {
    try {
      await navigator.clipboard.writeText(activeGradientCss);
      setCopied(true);
      toast.success("CSS code copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy");
    }
  };

  const handleLoadPreset = (preset: { name: string; css: string }) => {
    setGradientName(preset.name);
    setShowCssCssPaste(false);
    onApply(preset.css);
    toast.success(`Loaded "${preset.name}"`);
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50/90 p-4 space-y-4 shadow-sm">
      {/* Studio Header */}
      <div className="flex items-center justify-between border-b border-slate-200/80 pb-2.5">
        <div className="flex items-center gap-2">
          <Palette className="h-4 w-4 text-purple-600" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
            Gradient Studio
          </h4>
        </div>
        <button
          type="button"
          onClick={() => setShowCssCssPaste((prev) => !prev)}
          className="inline-flex items-center gap-1 text-[11px] text-blue-600 hover:text-blue-800 font-medium"
        >
          <Code2 className="h-3 w-3" />
          {showCssPaste ? "Use Visual Controls" : "Paste Custom CSS"}
        </button>
      </div>

      {/* 1. Live Interactive Preview */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-[11px]">
          <span className="font-semibold uppercase tracking-wider text-slate-600">
            Live Preview
          </span>
          <button
            type="button"
            onClick={handleCopyCss}
            className="text-slate-500 hover:text-slate-800 inline-flex items-center gap-1"
          >
            {copied ? (
              <>
                <CheckCheck className="h-3 w-3 text-emerald-600" /> Copied
              </>
            ) : (
              <>
                <Copy className="h-3 w-3" /> Copy CSS
              </>
            )}
          </button>
        </div>

        {/* Text Preview Banner */}
        <div className="rounded-lg border border-slate-200 bg-white p-3 text-center shadow-xs">
          <span
            className="text-base sm:text-xl font-serif font-black tracking-tight"
            style={{
              backgroundImage: activeGradientCss,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              display: "inline-block",
            }}
          >
            TODAY TRIPURA: FESTIVE LIVE NEWS
          </span>
          {/* Swatch strip */}
          <div
            className="h-2 w-full rounded-full mt-2 border border-black/5 shadow-inner"
            style={{ background: activeGradientCss }}
          />
        </div>
      </div>

      {showCssPaste ? (
        /* Direct CSS Paste Input Mode */
        <div className="space-y-1.5 rounded-lg border border-slate-200 bg-white p-3">
          <label className="text-xs font-semibold text-slate-700 block">
            Paste CSS Gradient Code
          </label>
          <input
            type="text"
            value={rawCss}
            onChange={(e) => setRawCss(e.target.value)}
            placeholder="e.g. linear-gradient(90deg, #ff0844, #ffb199)"
            className="h-9 w-full rounded border border-slate-200 px-3 font-mono text-xs focus:border-slate-900 focus:outline-none"
          />
          <p className="text-[10px] text-slate-400">
            Paste any gradient from CSSGradient.io or web gradients.
          </p>
        </div>
      ) : (
        /* Visual Gradient Controls */
        <div className="space-y-3.5">
          {/* 2. Color Selection (From Color & To Color) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-700">
                Gradient Colors
              </label>
              <button
                type="button"
                onClick={() => setUseMiddleColor((prev) => !prev)}
                className="text-[11px] text-slate-600 hover:text-slate-900 inline-flex items-center gap-1 font-medium"
              >
                {useMiddleColor ? (
                  <>
                    <Minus className="h-3 w-3 text-slate-500" /> Remove 3rd Color
                  </>
                ) : (
                  <>
                    <Plus className="h-3 w-3 text-slate-500" /> Add 3rd Color
                  </>
                )}
              </button>
            </div>

            <div
              className={`grid gap-2 ${
                useMiddleColor ? "grid-cols-1 sm:grid-cols-3" : "grid-cols-1 sm:grid-cols-2"
              }`}
            >
              {/* From Color */}
              <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white p-2 shadow-2xs">
                <label
                  className="relative h-9 w-9 shrink-0 rounded-full border-2 border-white shadow ring-1 ring-slate-200 cursor-pointer overflow-hidden hover:scale-105 transition"
                  style={{ backgroundColor: fromColor }}
                  title="Click to pick Start Color"
                >
                  <input
                    type="color"
                    value={fromColor}
                    onChange={(e) => setFromColor(e.target.value)}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                </label>
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Start Color
                  </span>
                  <input
                    type="text"
                    value={fromColor}
                    onChange={(e) => setFromColor(e.target.value)}
                    className="w-full text-xs font-mono font-medium text-slate-800 uppercase focus:outline-none"
                  />
                </div>
              </div>

              {/* Optional Middle Color */}
              {useMiddleColor && (
                <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white p-2 shadow-2xs animate-in fade-in duration-150">
                  <label
                    className="relative h-9 w-9 shrink-0 rounded-full border-2 border-white shadow ring-1 ring-slate-200 cursor-pointer overflow-hidden hover:scale-105 transition"
                    style={{ backgroundColor: middleColor }}
                    title="Click to pick Middle Color"
                  >
                    <input
                      type="color"
                      value={middleColor}
                      onChange={(e) => setMiddleColor(e.target.value)}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    />
                  </label>
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Middle Color
                    </span>
                    <input
                      type="text"
                      value={middleColor}
                      onChange={(e) => setMiddleColor(e.target.value)}
                      className="w-full text-xs font-mono font-medium text-slate-800 uppercase focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {/* To Color */}
              <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white p-2 shadow-2xs">
                <label
                  className="relative h-9 w-9 shrink-0 rounded-full border-2 border-white shadow ring-1 ring-slate-200 cursor-pointer overflow-hidden hover:scale-105 transition"
                  style={{ backgroundColor: toColor }}
                  title="Click to pick End Color"
                >
                  <input
                    type="color"
                    value={toColor}
                    onChange={(e) => setToColor(e.target.value)}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                </label>
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    End Color
                  </span>
                  <input
                    type="text"
                    value={toColor}
                    onChange={(e) => setToColor(e.target.value)}
                    className="w-full text-xs font-mono font-medium text-slate-800 uppercase focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 3. Flow Direction */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 block">
              Flow Direction
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
              {[
                { label: "Left → Right", dir: "to right", type: "linear" },
                { label: "Top ↓ Bottom", dir: "to bottom", type: "linear" },
                { label: "Diagonal ↘", dir: "135deg", type: "linear" },
                { label: "Radial (Center)", dir: "radial", type: "radial" },
              ].map((item) => {
                const isSelected =
                  item.type === "radial"
                    ? gradientType === "radial"
                    : gradientType === "linear" && direction === item.dir;
                return (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => {
                      if (item.type === "radial") {
                        setGradientType("radial");
                      } else {
                        setGradientType("linear");
                        setDirection(item.dir);
                      }
                    }}
                    className={`rounded-md border py-1.5 px-2 text-xs font-medium transition text-center ${
                      isSelected
                        ? "border-slate-900 bg-slate-900 text-white shadow-xs"
                        : "border-slate-200 bg-white text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 4. One-Click Popular Gradients Gallery */}
      <div className="space-y-1.5">
        <label className="text-[11px] font-semibold text-slate-600 uppercase tracking-wider block">
          One-Click Gradients
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
          {POPULAR_GRADIENTS.map((p) => (
            <button
              key={p.name}
              type="button"
              onClick={() => handleLoadPreset(p)}
              className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white p-1.5 text-left hover:border-slate-300 hover:bg-slate-50 transition shadow-2xs group"
            >
              <span
                className="h-4 w-4 rounded-full border border-black/10 shrink-0 group-hover:scale-110 transition-transform"
                style={{ background: p.css }}
              />
              <span className="text-[11px] font-medium text-slate-700 truncate">
                {p.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* 5. Save & Apply Actions */}
      <div className="border-t border-slate-200/80 pt-3 space-y-2.5">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <input
            type="text"
            value={gradientName}
            onChange={(e) => setGradientName(e.target.value)}
            placeholder="Name preset (e.g. Festival Special)..."
            className="h-9 flex-1 min-w-0 rounded-lg border border-slate-200 bg-white px-3 text-xs focus:border-slate-900 focus:outline-none"
          />
          <button
            type="button"
            onClick={handleSave}
            className="h-9 px-3 rounded-lg border border-slate-300 bg-white hover:bg-slate-100 text-xs font-semibold text-slate-700 transition whitespace-nowrap shadow-xs"
          >
            Save Preset
          </button>
          <button
            type="button"
            onClick={handleApply}
            className="h-9 px-4 rounded-lg bg-slate-900 hover:bg-slate-800 text-xs font-semibold text-white transition whitespace-nowrap shadow-xs inline-flex items-center justify-center gap-1.5"
          >
            <Check className="h-3.5 w-3.5" />
            Apply Gradient
          </button>
        </div>

        {/* Saved Custom Presets List */}
        {savedGradients.length > 0 && (
          <div className="pt-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Your Saved Presets ({savedGradients.length})
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              {savedGradients.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-1.5 shadow-2xs"
                >
                  <button
                    type="button"
                    onClick={() => {
                      onApply(item.css);
                      toast.success(`Applied "${item.name}"`);
                    }}
                    className="flex items-center gap-2 text-left flex-1 min-w-0"
                  >
                    <span
                      className="h-4 w-5 rounded border border-black/10 shrink-0"
                      style={{ background: item.css }}
                    />
                    <span className="text-xs font-medium text-slate-800 truncate">
                      {item.name}
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onDeleteCustom(item.id)}
                    className="rounded p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 transition ml-1"
                    title="Delete preset"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
