import React, { useState, useEffect } from "react";
import { Save, Sparkles, Power } from "lucide-react";
import { toast } from "sonner";
import { loadSettings, saveSettings, type SiteSettings } from "@/lib/site-content";
import { useFontConfig } from "@/components/site/AdSettingsContext";
import {
  FESTIVE_GRADIENT_MAP,
  ROTATION_KEYFRAMES,
  ROTATION_ANIMATION_STYLE,
} from "./festive/constants";
import { FestiveControls } from "./festive/FestiveControls";
import { FestivePreviewCard } from "./festive/FestivePreviewCard";

export function FestiveSettingsForm() {
  const [settings, setSettings] = useState<SiteSettings>(() => loadSettings());
  const [saved, setSaved] = useState(false);
  const [showCustomText, setShowCustomText] = useState(false);
  const [animNonce, setAnimNonce] = useState(0);
  const fontConfig = useFontConfig();

  const isFestiveEnabled = settings.festiveThemeEnabled !== false;

  useEffect(() => {
    setSettings(loadSettings());
  }, []);

  // Automatic Text Rotation Animation in Preview
  useEffect(() => {
    if (!isFestiveEnabled) {
      setShowCustomText(false);
      return;
    }
    const delay = (Number(settings.topBarSwapDelay) || 5) * 1000;
    const interval = setInterval(() => {
      setShowCustomText((prev) => !prev);
    }, delay);
    return () => clearInterval(interval);
  }, [settings.topBarSwapDelay, isFestiveEnabled]);

  // Re-trigger font/size changes
  useEffect(() => {
    setAnimNonce((n) => n + 1);
  }, [settings.customAlertFontFamily, settings.customAlertFontSize]);

  // When rotation STYLE changes, swap text so the new animation is visible
  useEffect(() => {
    setAnimNonce((n) => n + 1);
    if (isFestiveEnabled) {
      setShowCustomText((prev) => !prev);
    }
  }, [settings.customAlertAnimationStyle, isFestiveEnabled]);

  const update = <K extends keyof SiteSettings>(key: K, val: SiteSettings[K]) => {
    setSettings((prev) => ({ ...prev, [key]: val }));
  };

  const handleSave = () => {
    saveSettings(settings);
    setSaved(true);
    toast.success("Saved successfully");
    setTimeout(() => setSaved(false), 2000);
  };

  const triggerTestSwap = () => {
    setAnimNonce((n) => n + 1);
    setShowCustomText((prev) => !prev);
  };

  const customAlertText = settings.topBarWeatherCustomText?.trim() || "Breaking News Alert";
  const activeGradient = settings.topBarTextGradient || settings.festiveCategoryTitleGradient;
  const activeColor = settings.festiveCategoryTitleColor || settings.topBarTextColor || "#000000";

  const selectedFont = fontConfig.fonts.find((f) => f.id === settings.customAlertFontFamily);
  const customAlertFontFamilyCss = selectedFont
    ? `"${selectedFont.family}", sans-serif`
    : '"Inter", system-ui, sans-serif';
  const rotationAnimStyle =
    ROTATION_ANIMATION_STYLE[settings.customAlertAnimationStyle || "slide-up"] ||
    ROTATION_ANIMATION_STYLE["slide-up"];

  const textStyle: React.CSSProperties =
    activeGradient && FESTIVE_GRADIENT_MAP[activeGradient]
      ? {
          backgroundImage: FESTIVE_GRADIENT_MAP[activeGradient],
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          display: "inline-block",
        }
      : { color: activeColor };

  const badgeStyle: React.CSSProperties =
    activeGradient && FESTIVE_GRADIENT_MAP[activeGradient]
      ? {
          backgroundColor: settings.festiveCategoryBadgeBgColor || "#000000",
          backgroundImage: FESTIVE_GRADIENT_MAP[activeGradient],
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }
      : {
          backgroundColor: settings.festiveCategoryBadgeBgColor || "#000000",
          color: settings.festiveCategoryBadgeTextColor || "#FFFFFF",
        };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <style dangerouslySetInnerHTML={{ __html: ROTATION_KEYFRAMES }} />

      <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm">
        {/* Header with Save Button */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-100 pb-4 mb-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600 border border-amber-200 shrink-0">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-800">
                Festive Theme & Custom Alert Rotation
              </h2>
              <p className="text-xs text-slate-500">
                Set custom alert message, rotation delay, text color, and gradient.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleSave}
            className={`inline-flex items-center justify-center gap-1.5 rounded-lg px-4 py-2 text-xs font-semibold text-white shadow-sm transition-all active:scale-95 shrink-0 self-start sm:self-auto ${
              saved ? "bg-emerald-600" : "bg-slate-900 hover:bg-slate-800"
            }`}
          >
            <Save className="h-3.5 w-3.5" />
            {saved ? "Saved!" : "Save"}
          </button>
        </div>

        {/* Master ON / OFF Toggle Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 rounded-xl border border-slate-200 bg-slate-50/80 mb-6 transition-colors">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <Power
                className={`h-4 w-4 ${isFestiveEnabled ? "text-emerald-600" : "text-slate-400"}`}
              />
              <span className="text-sm font-bold text-slate-800">
                Festive Theme & Custom Alert Rotation
              </span>
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  isFestiveEnabled
                    ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                    : "bg-slate-200 text-slate-600 border border-slate-300"
                }`}
              >
                {isFestiveEnabled ? "ON (Active)" : "OFF (Disabled)"}
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Turn ON to rotate custom alert messages across Top Bar, category headers, section
              badges, and QR cards. Turn OFF to display standard category titles only.
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs font-semibold text-slate-600">
              {isFestiveEnabled ? "Enabled" : "Disabled"}
            </span>
            <button
              type="button"
              role="switch"
              aria-checked={isFestiveEnabled}
              onClick={() => update("festiveThemeEnabled", !isFestiveEnabled)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 ${
                isFestiveEnabled ? "bg-emerald-600" : "bg-slate-300"
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                  isFestiveEnabled ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-12">
          <FestiveControls settings={settings} update={update} fontConfig={fontConfig} />
          <FestivePreviewCard
            settings={settings}
            isFestiveEnabled={isFestiveEnabled}
            showCustomText={showCustomText}
            animNonce={animNonce}
            customAlertText={customAlertText}
            textStyle={textStyle}
            badgeStyle={badgeStyle}
            customAlertFontFamilyCss={customAlertFontFamilyCss}
            rotationAnimStyle={rotationAnimStyle}
            triggerTestSwap={triggerTestSwap}
          />
        </div>
      </section>

      {/* Sticky Save Button */}
      <div className="sticky bottom-4 flex justify-end z-30 pointer-events-auto">
        <button
          onClick={handleSave}
          className={`inline-flex items-center gap-2 rounded-full px-7 py-3 text-sm font-bold text-white shadow-xl transition-all active:scale-95 ${
            saved
              ? "bg-emerald-600 ring-4 ring-emerald-200"
              : "bg-slate-900 hover:bg-slate-800 ring-4 ring-slate-300/40"
          }`}
        >
          <Save className="h-4 w-4" />
          {saved ? "Saved!" : "Save"}
        </button>
      </div>
    </div>
  );
}
