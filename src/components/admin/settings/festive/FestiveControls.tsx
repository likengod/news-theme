import React, { useState } from "react";
import { Clock, Layers, Sparkles } from "lucide-react";
import type { SiteSettings } from "@/lib/site-content";
import type { FontConfiguration } from "@/lib/font-config";
import { MediaField } from "@/components/admin/MediaField";
import { FESTIVE_GRADIENT_MAP, PRESET_COLORS, resolveFestiveGradient } from "./constants";

interface FestiveControlsProps {
  settings: SiteSettings;
  update: <K extends keyof SiteSettings>(key: K, val: SiteSettings[K]) => void;
  fontConfig: FontConfiguration;
}

const GRADIENT_PRESETS = [
  { id: "indian-flag", name: "Tricolor (Indian Flag)" },
  { id: "diwali", name: "Festival Gold (Diwali)" },
  { id: "sunset", name: "Sunset (Pink & Orange)" },
  { id: "neon", name: "Neon (Magenta & Cyan)" },
  { id: "ocean", name: "Ocean (Sky & Blue)" },
  { id: "forest", name: "Forest (Emerald & Mint)" },
];

interface ColorOrGradientPickerProps {
  title: string;
  subtitle: string;
  color: string;
  gradient: string;
  defaultColor?: string;
  onChangeColor: (hex: string) => void;
  onChangeGradient: (gradCssOrId: string) => void;
}

function ColorOrGradientPicker({
  title,
  subtitle,
  color,
  gradient,
  defaultColor = "#000000",
  onChangeColor,
  onChangeGradient,
}: ColorOrGradientPickerProps) {
  const isGradientMode = Boolean(gradient);
  const activeColor = color || defaultColor;

  const [customColor1, setCustomColor1] = useState("#FF0844");
  const [customColor2, setCustomColor2] = useState("#FFB199");
  const [customDirection, setCustomDirection] = useState("to right");

  const currentGradientSelection = React.useMemo(() => {
    if (!gradient) return "indian-flag";
    if (FESTIVE_GRADIENT_MAP[gradient]) return gradient;
    return "custom";
  }, [gradient]);

  const activeGradientCss = resolveFestiveGradient(gradient || "indian-flag");

  const handleApplyGradient = (gradIdOrCss: string) => {
    if (gradIdOrCss === "custom") {
      const css =
        customDirection === "radial"
          ? `radial-gradient(circle at center, ${customColor1}, ${customColor2})`
          : `linear-gradient(${customDirection}, ${customColor1}, ${customColor2})`;
      onChangeGradient(css);
    } else {
      onChangeGradient(gradIdOrCss);
    }
  };

  const handleUpdateCustomGradient = (c1: string, c2: string, dir: string) => {
    const css =
      dir === "radial"
        ? `radial-gradient(circle at center, ${c1}, ${c2})`
        : `linear-gradient(${dir}, ${c1}, ${c2})`;
    onChangeGradient(css);
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-3.5 shadow-2xs">
      {/* Header & Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-800 block">
            {title}
          </span>
          <span className="text-[11px] text-slate-400">{subtitle}</span>
        </div>

        {/* Tab Switcher */}
        <div className="inline-flex rounded-lg border border-slate-200 bg-slate-100 p-0.5 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => onChangeColor(activeColor)}
            className={`rounded-md px-3 py-1 text-xs font-semibold transition ${
              !isGradientMode
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Solid Color
          </button>
          <button
            type="button"
            onClick={() => handleApplyGradient(currentGradientSelection || "indian-flag")}
            className={`rounded-md px-3 py-1 text-xs font-semibold transition ${
              isGradientMode
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Gradient
          </button>
        </div>
      </div>

      {/* Solid Color Mode */}
      {!isGradientMode ? (
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-700 block">
            Choose Color
          </label>
          <div className="flex items-center gap-2.5">
            <label
              className="relative h-10 w-10 shrink-0 rounded-lg border-2 border-white shadow ring-1 ring-slate-300 cursor-pointer overflow-hidden hover:scale-105 transition"
              style={{ backgroundColor: activeColor }}
              title="Click to pick custom color"
            >
              <input
                type="color"
                value={
                  activeColor.startsWith("#") && activeColor.length === 7
                    ? activeColor
                    : "#000000"
                }
                onChange={(e) => onChangeColor(e.target.value)}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
            </label>

            <select
              value={
                PRESET_COLORS.some((c) => c.hex.toLowerCase() === activeColor.toLowerCase())
                  ? activeColor.toUpperCase()
                  : "custom"
              }
              onChange={(e) => {
                if (e.target.value !== "custom") {
                  onChangeColor(e.target.value);
                }
              }}
              className="h-10 flex-1 min-w-0 rounded-lg border border-slate-200 px-3 text-sm font-medium bg-white focus:border-slate-900 focus:outline-none"
            >
              {PRESET_COLORS.map((c) => (
                <option key={c.hex} value={c.hex.toUpperCase()}>
                  {c.name}
                </option>
              ))}
              <option value="custom">Custom Color (use swatch on left)</option>
            </select>
          </div>
        </div>
      ) : (
        /* Gradient Mode */
        <div className="space-y-3">
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              Choose Gradient
            </label>
            <div className="flex items-center gap-2.5">
              <div
                className="h-10 w-10 shrink-0 rounded-lg border border-slate-300 shadow-inner overflow-hidden"
                style={{ background: activeGradientCss || "#f1f5f9" }}
                title="Current Gradient"
              />

              <select
                value={currentGradientSelection}
                onChange={(e) => handleApplyGradient(e.target.value)}
                className="h-10 flex-1 min-w-0 rounded-lg border border-slate-200 px-3 text-sm font-medium bg-white focus:border-slate-900 focus:outline-none"
              >
                <optgroup label="Presets">
                  {GRADIENT_PRESETS.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.name}
                    </option>
                  ))}
                </optgroup>
                <option value="custom">🎨 Custom 2-Color Gradient...</option>
              </select>
            </div>
          </div>

          {currentGradientSelection === "custom" && (
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 space-y-2.5 animate-in fade-in duration-150">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600 block">
                Custom Colors & Direction
              </span>

              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center gap-2 rounded-md border border-slate-200 bg-white p-1.5 shadow-2xs">
                  <label
                    className="relative h-8 w-8 shrink-0 rounded-full border-2 border-white shadow ring-1 ring-slate-200 cursor-pointer overflow-hidden"
                    style={{ backgroundColor: customColor1 }}
                    title="Click to pick Color 1"
                  >
                    <input
                      type="color"
                      value={customColor1}
                      onChange={(e) => {
                        setCustomColor1(e.target.value);
                        handleUpdateCustomGradient(e.target.value, customColor2, customDirection);
                      }}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    />
                  </label>
                  <span className="text-xs font-medium text-slate-700">Color 1</span>
                </div>

                <div className="flex items-center gap-2 rounded-md border border-slate-200 bg-white p-1.5 shadow-2xs">
                  <label
                    className="relative h-8 w-8 shrink-0 rounded-full border-2 border-white shadow ring-1 ring-slate-200 cursor-pointer overflow-hidden"
                    style={{ backgroundColor: customColor2 }}
                    title="Click to pick Color 2"
                  >
                    <input
                      type="color"
                      value={customColor2}
                      onChange={(e) => {
                        setCustomColor2(e.target.value);
                        handleUpdateCustomGradient(customColor1, e.target.value, customDirection);
                      }}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    />
                  </label>
                  <span className="text-xs font-medium text-slate-700">Color 2</span>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Direction
                </label>
                <select
                  value={customDirection}
                  onChange={(e) => {
                    setCustomDirection(e.target.value);
                    handleUpdateCustomGradient(customColor1, customColor2, e.target.value);
                  }}
                  className="h-8 w-full rounded border border-slate-200 px-2 text-xs font-medium bg-white focus:border-slate-900 focus:outline-none"
                >
                  <option value="to right">Left → Right</option>
                  <option value="to bottom">Top ↓ Bottom</option>
                  <option value="135deg">Diagonal ↘</option>
                  <option value="radial">Radial (Center)</option>
                </select>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function FestiveControls({ settings, update, fontConfig }: FestiveControlsProps) {
  return (
    <div className="lg:col-span-7 space-y-6">
      {/* ── SECTION 1: CUSTOM ALERT / ROTATING HEADLINE ── */}
      <div className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50/60 p-4 sm:p-5">
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2.5">
          <Sparkles className="h-4 w-4 text-amber-500" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
            Custom Alert / Title Message
          </h3>
        </div>

        {/* Custom Message Input */}
        <div>
          <label className="mb-1 block text-xs font-semibold text-slate-700">
            Alert Headline Text (Optional if image is added)
          </label>
          <input
            type="text"
            value={settings.topBarWeatherCustomText || ""}
            onChange={(e) => {
              update("topBarWeatherCustomText", e.target.value);
              update("festiveScanMeCustomText", e.target.value);
            }}
            placeholder="e.g. Breaking News Alert"
            className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm focus:border-slate-900 focus:outline-none bg-white"
          />
          <p className="mt-1 text-[11px] text-slate-400">
            Shown when rotating. If an image is uploaded below, the image is displayed directly.
          </p>
        </div>

        {/* Alert Icon / Badge Image */}
        <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs">
          <div className="flex flex-wrap items-center justify-between gap-1.5 mb-1.5">
            <span className="text-xs font-bold text-slate-800">
              Alert Badge / Icon Image (Optional)
            </span>
            <span className="inline-flex items-center rounded-md bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-800 border border-amber-200">
              Recommended: 32×32px – 48×48px (Icon) or max 120×32px (Badge)
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mb-2.5">
            Attach a logo, festival badge, or emblem (e.g. News Logo, Indian Flag, Festival Badge).
            <span className="font-semibold text-slate-700">
              {" "}When an image is added, the alert displays the image directly across category titles, top bar, and banners without needing text.
            </span>
          </p>
          <MediaField
            value={settings.festiveAlertImage || ""}
            onChange={(url) => update("festiveAlertImage", url)}
            usage="other"
            inline={true}
            emptyLabel="No alert icon"
            recommendedSize="32×32 px to 48×48 px (Square) or max 120×32 px (Badge)"
            hint="Format: PNG with transparent background, SVG, or WebP (max 1 MB)"
          />
        </div>

        {/* Rotate Delay */}
        <div>
          <label className="mb-1 block text-xs font-semibold text-slate-700">
            Rotate Delay (Seconds)
          </label>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-slate-400" />
            <input
              type="number"
              min={2}
              max={60}
              value={settings.topBarSwapDelay || 5}
              onChange={(e) => update("topBarSwapDelay", Number(e.target.value))}
              className="h-9 w-24 rounded-lg border border-slate-200 px-3 text-sm focus:border-slate-900 focus:outline-none bg-white"
            />
            <span className="text-xs text-slate-500">sec</span>
          </div>
        </div>

        {/* Alert Text Color & Gradient (Independent from Category Title!) */}
        <ColorOrGradientPicker
          title="Alert Message Text Style"
          subtitle="Controls color or gradient when alert text is displayed"
          color={settings.topBarTextColor || "#000000"}
          gradient={settings.topBarTextGradient || ""}
          onChangeColor={(hex) => {
            update("topBarTextColor", hex);
            update("topBarTextGradient", "");
          }}
          onChangeGradient={(grad) => update("topBarTextGradient", grad)}
        />

        {/* Rotation Animation Style */}
        <div>
          <label className="mb-1 block text-xs font-semibold text-slate-700">
            Rotation Animation Style
          </label>
          <select
            value={settings.customAlertAnimationStyle || "slide-up"}
            onChange={(e) => update("customAlertAnimationStyle", e.target.value as any)}
            className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm focus:border-slate-900 focus:outline-none bg-white font-medium"
          >
            <option value="slide-up">Slide Up (Bottom to Top)</option>
            <option value="slide-down">Slide Down (Top to Bottom)</option>
            <option value="slide-left">Slide Left (Right to Left)</option>
            <option value="slide-right">Slide Right (Left to Right)</option>
            <option value="fade">Gentle Fade In</option>
            <option value="zoom">Pop & Zoom In</option>
            <option value="flip">3D Flip (Perspective)</option>
          </select>
        </div>

        {/* Custom Alert Font Family Selector */}
        <div>
          <label className="mb-1 block text-xs font-semibold text-slate-700">
            Headline Font Family
          </label>
          <select
            value={settings.customAlertFontFamily || "inter"}
            onChange={(e) => update("customAlertFontFamily", e.target.value)}
            className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm focus:border-slate-900 focus:outline-none bg-white font-medium"
          >
            {fontConfig.fonts.map((f) => (
              <option key={f.id} value={f.id}>
                {f.name}{" "}
                {f.source === "google"
                  ? "(Google Fonts)"
                  : f.source === "upload"
                    ? "(Uploaded)"
                    : ""}
              </option>
            ))}
          </select>
        </div>

        {/* Responsive Text Size Control */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-semibold text-slate-700">
              Alert Text Size (Top Bar)
            </label>
            <span className="text-xs font-mono font-bold text-slate-900">
              {settings.customAlertFontSize || 14}px
            </span>
          </div>
          <input
            type="range"
            min={11}
            max={36}
            step={1}
            value={settings.customAlertFontSize || 14}
            onChange={(e) => update("customAlertFontSize", Number(e.target.value))}
            className="w-full accent-slate-900 h-2 bg-slate-200 rounded-lg cursor-pointer"
          />
        </div>
      </div>

      {/* ── SECTION 2: CATEGORY TITLE APPEARANCE (DEFAULT PAGES) ── */}
      <div className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50/60 p-4 sm:p-5">
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2.5">
          <Layers className="h-4 w-4 text-blue-500" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
            Category Title Appearance (Default)
          </h3>
        </div>

        <p className="text-xs text-slate-500">
          Controls how regular category headings (e.g. Country, Politics, Business, Sports) look on category pages when the alert is not rotating.
        </p>

        {/* Category Title Color & Gradient (Independent from Custom Alert!) */}
        <ColorOrGradientPicker
          title="Category Heading Color & Gradient"
          subtitle="Independent style for category header titles"
          color={settings.festiveCategoryTitleColor || "#000000"}
          gradient={settings.festiveCategoryTitleGradient || ""}
          onChangeColor={(hex) => {
            update("festiveCategoryTitleColor", hex);
            update("festiveCategoryTitleGradient", "");
          }}
          onChangeGradient={(grad) => update("festiveCategoryTitleGradient", grad)}
        />
      </div>
    </div>
  );
}
