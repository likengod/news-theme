import React from "react";
import { Check, Clock, RotateCcw } from "lucide-react";
import type { SiteSettings } from "@/lib/site-content";
import type { FontConfiguration } from "@/lib/font-config";
import { FESTIVE_GRADIENT_MAP, PRESET_COLORS } from "./constants";

interface FestiveControlsProps {
  settings: SiteSettings;
  update: <K extends keyof SiteSettings>(key: K, val: SiteSettings[K]) => void;
  fontConfig: FontConfiguration;
}

export function FestiveControls({ settings, update, fontConfig }: FestiveControlsProps) {
  return (
    <div className="lg:col-span-7 space-y-5">
      {/* 1. Custom Message Input */}
      <div>
        <label className="mb-1 block text-xs font-semibold text-slate-700">
          Custom Alert / Title Message
        </label>
        <input
          type="text"
          value={settings.topBarWeatherCustomText || ""}
          onChange={(e) => {
            update("topBarWeatherCustomText", e.target.value);
            update("festiveScanMeCustomText", e.target.value);
          }}
          placeholder="e.g. Breaking News Alert"
          className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm focus:border-slate-900 focus:outline-none"
        />
        <p className="mt-1 text-[11px] text-slate-400">
          This text rotates every few seconds with section titles & alert bars.
        </p>
      </div>

      {/* 2. Rotate Delay */}
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
            className="h-9 w-24 rounded-lg border border-slate-200 px-3 text-sm focus:border-slate-900 focus:outline-none"
          />
          <span className="text-xs text-slate-500">sec</span>
        </div>
      </div>

      {/* 3. Text Color Preset Grid */}
      <div>
        <label className="mb-1.5 block text-xs font-semibold text-slate-700">
          Text Color (Default: Black)
        </label>
        <div className="flex flex-wrap items-center gap-2">
          {PRESET_COLORS.map((c) => {
            const isSelected =
              (settings.festiveCategoryTitleColor || settings.topBarTextColor || "#000000") ===
              c.hex;
            return (
              <button
                key={c.hex}
                type="button"
                onClick={() => {
                  update("topBarTextColor", c.hex);
                  update("festiveCategoryTitleColor", c.hex);
                  update("topBarTextGradient", "");
                  update("festiveCategoryTitleGradient", "");
                }}
                className={`flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-medium transition-all ${
                  isSelected
                    ? "border-slate-900 bg-slate-900 text-white shadow-xs"
                    : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                }`}
              >
                <span
                  className="h-3 w-3 rounded-full border border-black/10 shrink-0"
                  style={{ backgroundColor: c.hex }}
                />
                {c.name}
                {isSelected && <Check className="h-3 w-3 ml-0.5" />}
              </button>
            );
          })}
          {/* Custom Hex Picker */}
          <div className="flex items-center gap-1.5 ml-1">
            <input
              type="color"
              value={settings.festiveCategoryTitleColor || settings.topBarTextColor || "#000000"}
              onChange={(e) => {
                update("topBarTextColor", e.target.value);
                update("festiveCategoryTitleColor", e.target.value);
                update("topBarTextGradient", "");
                update("festiveCategoryTitleGradient", "");
              }}
              className="h-7 w-7 rounded border border-slate-200 cursor-pointer p-0.5"
            />
            <span className="text-xs font-mono text-slate-500">
              {settings.festiveCategoryTitleColor || settings.topBarTextColor || "#000000"}
            </span>
          </div>
        </div>
      </div>

      {/* 4. Text Gradient Preset Grid */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-xs font-semibold text-slate-700">
            Or Apply Festive Gradient
          </label>
          {(settings.topBarTextGradient || settings.festiveCategoryTitleGradient) && (
            <button
              type="button"
              onClick={() => {
                update("topBarTextGradient", "");
                update("festiveCategoryTitleGradient", "");
              }}
              className="text-[11px] text-red-600 hover:underline flex items-center gap-1"
            >
              <RotateCcw className="h-3 w-3" /> Clear Gradient
            </button>
          )}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {Object.entries(FESTIVE_GRADIENT_MAP).map(([key, grad]) => {
            const isSelected =
              (settings.topBarTextGradient || settings.festiveCategoryTitleGradient) === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => {
                  update("topBarTextGradient", key);
                  update("festiveCategoryTitleGradient", key);
                }}
                className={`relative flex items-center justify-between rounded-lg border p-2.5 text-left transition-all ${
                  isSelected
                    ? "border-slate-900 ring-2 ring-slate-900/10 shadow-xs"
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <div className="flex items-center gap-2">
                  <div
                    className="h-4 w-6 rounded border border-black/10 shrink-0"
                    style={{ background: grad }}
                  />
                  <span className="text-xs font-medium capitalize text-slate-800">
                    {key.replace("-", " ")}
                  </span>
                </div>
                {isSelected && <Check className="h-3.5 w-3.5 text-slate-900" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* 5. Custom Alert Text Animation Style */}
      <div>
        <label className="mb-1 block text-xs font-semibold text-slate-700">
          Rotation Animation Style (Smooth Motion)
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
        <p className="mt-1 text-[11px] text-slate-400">
          Controls the entry effect when the headline text alternates.
        </p>
      </div>

      {/* 6. Custom Alert Font Family Selector */}
      <div>
        <label className="mb-1 block text-xs font-semibold text-slate-700">
          Headline Font Family (Google Fonts & Uploaded)
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

      {/* 7. Responsive Text Size Control */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="text-xs font-semibold text-slate-700">
            Responsive Text Size (Custom Alert ONLY)
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
  );
}
