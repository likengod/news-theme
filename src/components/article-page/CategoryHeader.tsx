import React from "react";
import { Link } from "@tanstack/react-router";

const FESTIVE_GRADIENT_MAP: Record<string, string> = {
  "indian-flag": "linear-gradient(to right, #FF9933, #000080, #138808)",
  diwali: "linear-gradient(to right, #FF8008, #FFC837, #FF007F, #7F00FF)",
  sunset: "linear-gradient(to right, #F5576C, #F093FB)",
  neon: "linear-gradient(to right, #FF007F, #7F00FF, #00F0FF)",
  ocean: "linear-gradient(to right, #00c6ff, #0072ff)",
  forest: "linear-gradient(to right, #11998e, #38ef7d)",
};

const FONT_FAMILY_MAP: Record<string, string> = {
  inter: '"Inter", system-ui, sans-serif',
  serif: 'Georgia, Cambria, "Times New Roman", Times, serif',
  cinzel: '"Cinzel", serif, Georgia',
  playfair: '"Playfair Display", Georgia, serif',
  roboto: '"Roboto", Arial, sans-serif',
  mono: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
};

const SLUG_ROTATION_KEYFRAMES = `
@keyframes rot-slide-up   { from { opacity:0; transform: translateY(60px);  } to { opacity:1; transform: translateY(0); } }
@keyframes rot-slide-down { from { opacity:0; transform: translateY(-60px); } to { opacity:1; transform: translateY(0); } }
@keyframes rot-slide-left { from { opacity:0; transform: translateX(80px);  } to { opacity:1; transform: translateX(0); } }
@keyframes rot-slide-right{ from { opacity:0; transform: translateX(-80px); } to { opacity:1; transform: translateX(0); } }
@keyframes rot-fade       { from { opacity:0;                                } to { opacity:1;                         } }
@keyframes rot-zoom       { from { opacity:0; transform: scale(0.6);         } to { opacity:1; transform: scale(1);   } }
@keyframes rot-flip       { from { opacity:0; transform: rotateX(90deg);     } to { opacity:1; transform: rotateX(0); } }
`;

const TEXT_ROTATION_CSS: Record<string, React.CSSProperties> = {
  "slide-up": { animation: "rot-slide-up    0.35s cubic-bezier(0.22,1,0.36,1) both" },
  "slide-down": { animation: "rot-slide-down  0.35s cubic-bezier(0.22,1,0.36,1) both" },
  "slide-left": { animation: "rot-slide-left  0.35s cubic-bezier(0.22,1,0.36,1) both" },
  "slide-right": { animation: "rot-slide-right 0.35s cubic-bezier(0.22,1,0.36,1) both" },
  fade: { animation: "rot-fade        0.35s ease both" },
  zoom: { animation: "rot-zoom        0.35s cubic-bezier(0.34,1.56,0.64,1) both" },
  flip: { animation: "rot-flip        0.5s  cubic-bezier(0.22,1,0.36,1) both" },
};

interface CategoryHeaderProps {
  category: any;
  settings: any;
  showCustomText: boolean;
}

export function CategoryHeader({ category, settings, showCustomText }: CategoryHeaderProps) {
  const activeCategoryGradient =
    settings.festiveCategoryTitleGradient &&
    (FESTIVE_GRADIENT_MAP[settings.festiveCategoryTitleGradient] ||
      (settings.festiveCategoryTitleGradient.includes("gradient(")
        ? settings.festiveCategoryTitleGradient
        : null));

  const categoryTitleStyle = activeCategoryGradient
    ? {
        backgroundImage: activeCategoryGradient,
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
        display: "inline-block",
      }
    : settings.festiveCategoryTitleColor
      ? { color: settings.festiveCategoryTitleColor }
      : undefined;

  const activeAlertGradient =
    settings.topBarTextGradient &&
    (FESTIVE_GRADIENT_MAP[settings.topBarTextGradient] ||
      (settings.topBarTextGradient.includes("gradient(")
        ? settings.topBarTextGradient
        : null));

  const alertTextStyle = activeAlertGradient
    ? {
        backgroundImage: activeAlertGradient,
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
        display: "inline-block",
      }
    : settings.topBarTextColor
      ? { color: settings.topBarTextColor }
      : undefined;

  const hasCustomAlert = Boolean(
    settings.festiveThemeEnabled !== false &&
      (settings.topBarWeatherCustomText || settings.festiveAlertImage),
  );

  const isShowingCustomAlert = Boolean(hasCustomAlert && showCustomText);

  const rotationAnimStyle =
    TEXT_ROTATION_CSS[settings.customAlertAnimationStyle || "slide-up"] ||
    TEXT_ROTATION_CSS["slide-up"];

  const customAlertFontFamilyCss = settings.customAlertFontFamily
    ? FONT_FAMILY_MAP[settings.customAlertFontFamily] || FONT_FAMILY_MAP["inter"]
    : undefined;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: SLUG_ROTATION_KEYFRAMES }} />
      <header className="border-b border-border pb-3 overflow-hidden">
      {/* Breadcrumb */}
      <nav className="mb-1 flex items-center gap-1 text-[11px] uppercase tracking-widest text-muted-foreground">
        <Link to="/" className="hover:text-foreground transition-colors">
          Home
        </Link>
        <span className="mx-1">/</span>
        <span className="text-foreground font-semibold">{category.name}</span>
      </nav>
      <h1
        key={`${showCustomText ? "custom" : "default"}-${settings.customAlertAnimationStyle}`}
        className="font-serif text-5xl font-bold md:text-6xl flex items-center flex-wrap gap-3"
        style={rotationAnimStyle}
      >
        {isShowingCustomAlert ? (
          settings.festiveAlertImage ? (
            <img
              src={settings.festiveAlertImage}
              alt="Alert Badge"
              className="h-12 md:h-16 w-auto max-w-[240px] object-contain shrink-0 align-middle"
            />
          ) : (
            <span
              className={alertTextStyle ? "" : "text-foreground"}
              style={{
                ...alertTextStyle,
                ...(customAlertFontFamilyCss ? { fontFamily: customAlertFontFamilyCss } : {}),
              }}
            >
              {settings.topBarWeatherCustomText}
            </span>
          )
        ) : (
          <span
            className={categoryTitleStyle ? "" : "text-foreground"}
            style={categoryTitleStyle}
          >
            {category.name}
          </span>
        )}
      </h1>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
        {category.description}
      </p>
    </header>
    </>
  );
}
