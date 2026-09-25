import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Link, useNavigate } from "@tanstack/react-router";
import { sections } from "@/lib/news-data";
import { getTopTags } from "@/lib/taxonomy.functions";
import { ChevronDown, Home, Search, X } from "lucide-react";

const slugify = (s: string) => s.toLowerCase().replace(/\s+/g, "-");

import { useSiteSettings, useCategories } from "@/components/site/AdSettingsContext";
import { useTheme } from "@/lib/theme";
import { getAccessibleLogoColor } from "@/lib/color-utils";

const otherCategories = ["Entertainment", "Health", "Education", "Jobs", "Travel", "Lifestyle"];

export function Masthead() {
  const s = useSiteSettings();
  const dbCats = useCategories();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const safePrimaryColor = s.logoColorPrimary
    ? getAccessibleLogoColor(s.logoColorPrimary, isDark, 4.5)
    : undefined;
  const safeSecondaryColor = getAccessibleLogoColor(s.logoColorSecondary || "#dc2626", isDark, 4.5);

  let navItems = sections;
  let dropdownItems = otherCategories;

  if (dbCats.length > 0) {
    const explicitHeaderCats = dbCats
      .filter((c: any) => c.showInHeader)
      .sort((a: any, b: any) => (a.sortOrder || 0) - (b.sortOrder || 0))
      .map((c: any) => c.name);
    const dropdownCats = dbCats
      .filter((c: any) => !c.showInHeader)
      .sort((a: any, b: any) => (a.sortOrder || 0) - (b.sortOrder || 0))
      .map((c: any) => c.name);

    if (explicitHeaderCats.length > 0) {
      navItems = explicitHeaderCats;
      if (dropdownCats.length > 0) {
        navItems = [...navItems, "Others"];
        dropdownItems = dropdownCats;
      } else {
        dropdownItems = [];
      }
    } else {
      const allCatNames = [...dbCats]
        .sort((a: any, b: any) => (a.sortOrder || 0) - (b.sortOrder || 0))
        .map((c: any) => c.name);
      if (allCatNames.length <= 11) {
        navItems = allCatNames;
        dropdownItems = [];
      } else {
        navItems = [...allCatNames.slice(0, 10), "Others"];
        dropdownItems = allCatNames.slice(10);
      }
    }
  }

  const hasLogo = !!(s.logoLight || s.logoDark);
  const mode = s.logoDisplayMode || (hasLogo ? "both" : "text_only");
  const isFitScreen = !!s.logoFitScreen || mode === "logo_fit";

  const showLogo =
    hasLogo &&
    (mode === "logo_only" || mode === "both" || mode === "both_stacked" || mode === "logo_fit");
  const showText =
    !hasLogo || mode === "text_only" || mode === "both" || mode === "both_stacked";
  const isSideBySide = mode === "both" && showLogo && showText;
  const isStacked = mode === "both_stacked" && showLogo && showText;

  const primaryWord =
    s.logoTextPrimary !== undefined && s.logoTextPrimary !== ""
      ? s.logoTextPrimary
      : s.logoText
        ? s.logoText.split(" ")[0]
        : "Today";

  const secondaryWord =
    s.logoTextSecondary !== undefined && s.logoTextSecondary !== ""
      ? s.logoTextSecondary
      : s.logoText && s.logoText.split(" ").length > 1
        ? s.logoText.split(" ").slice(1).join(" ")
        : "Tripura";

  const taglineContent = s.tagline ? (
    <span className="break-words">{s.tagline}</span>
  ) : (
    <span className="inline-flex flex-wrap items-center gap-x-1.5 sm:gap-x-2">
      <span className="text-[#1d4ed8] dark:text-blue-400">Breaking News</span>
      <span className="text-muted-foreground">•</span>
      <span className="text-[#b91c1c] dark:text-red-400">Finance</span>
      <span className="text-muted-foreground">•</span>
      <span className="text-[#15803d] dark:text-emerald-400">Business</span>
      <span className="text-muted-foreground">•</span>
      <span className="text-[#c2410c] dark:text-orange-400">Market</span>
    </span>
  );

  return (
    <>
      <header className="border-b border-border">
        <div className="mx-auto max-w-7xl px-4 py-5 text-center md:py-6 overflow-hidden">
          {/* 1. Side-by-Side Brand Lockup (Matches Reference Image) */}
          {isSideBySide && (
            <Link to="/" aria-label={s.siteName || "Home"} className="inline-block max-w-full">
              <div className="inline-flex items-center justify-center gap-3 sm:gap-4 md:gap-5 text-left max-w-full">
                {/* Logo Mark on the Left */}
                <div className="shrink-0 flex items-center justify-center">
                  {s.logoLight && (
                    <img
                      src={s.logoLight}
                      alt={s.logoText || "Logo"}
                      className={`h-11 sm:h-16 md:h-20 lg:h-22 w-auto max-w-[80px] sm:max-w-[120px] md:max-w-[160px] object-contain ${
                        s.logoDark ? "dark:hidden" : ""
                      }`}
                    />
                  )}
                  {s.logoDark && (
                    <img
                      src={s.logoDark}
                      alt={s.logoText || "Logo"}
                      className={`h-11 sm:h-16 md:h-20 lg:h-22 w-auto max-w-[80px] sm:max-w-[120px] md:max-w-[160px] object-contain ${
                        s.logoLight ? "hidden dark:block" : ""
                      }`}
                    />
                  )}
                </div>

                {/* Brand Title (Two-tone) & Tagline on the Right */}
                <div className="flex flex-col justify-center min-w-0">
                  <h1
                    className="leading-none text-2xl sm:text-4xl md:text-5xl lg:text-6xl uppercase font-extrabold"
                    style={{
                      fontFamily: '"Inter", system-ui, sans-serif',
                      fontWeight: 800,
                      letterSpacing: "0.05em",
                    }}
                  >
                    <span
                      style={safePrimaryColor ? { color: safePrimaryColor } : undefined}
                      className={
                        !s.logoColorPrimary || s.logoColorPrimary === "#000000"
                          ? "text-foreground dark:text-white"
                          : ""
                      }
                    >
                      {primaryWord}
                    </span>{" "}
                    <span style={{ color: safeSecondaryColor }}>
                      {secondaryWord}
                    </span>
                  </h1>
                  <div className="mt-1.5 sm:mt-2 text-[9px] sm:text-[11px] md:text-xs font-semibold uppercase tracking-[0.16em] sm:tracking-[0.24em] md:tracking-[0.32em] text-foreground/80 dark:text-foreground/85">
                    {taglineContent}
                  </div>
                </div>
              </div>
            </Link>
          )}

          {/* 2. Fit Screen / Full Banner Logo */}
          {((mode === "logo_fit" || (mode === "logo_only" && isFitScreen)) && !isSideBySide) && (
            <Link to="/" aria-label={s.siteName || "Home"} className="block w-full">
              <div className="w-full flex items-center justify-center">
                {s.logoLight && (
                  <img
                    src={s.logoLight}
                    alt={s.logoText || "Logo"}
                    className={`w-full max-w-5xl h-auto max-h-36 sm:max-h-48 md:max-h-60 object-contain mx-auto ${
                      s.logoDark ? "dark:hidden" : ""
                    }`}
                  />
                )}
                {s.logoDark && (
                  <img
                    src={s.logoDark}
                    alt={s.logoText || "Logo"}
                    className={`w-full max-w-5xl h-auto max-h-36 sm:max-h-48 md:max-h-60 object-contain mx-auto ${
                      s.logoLight ? "hidden dark:block" : ""
                    }`}
                  />
                )}
              </div>
            </Link>
          )}

          {/* 3. Stacked Logo + Text or Logo Only (Standard) or Text Only */}
          {!isSideBySide && mode !== "logo_fit" && !(mode === "logo_only" && isFitScreen) && (
            <div>
              <Link to="/" aria-label={s.siteName || "Home"} className="block">
                {showLogo && s.logoLight && (
                  <img
                    src={s.logoLight}
                    alt={s.logoText || "Logo"}
                    className={`mx-auto h-16 object-contain ${
                      s.logoDark ? "dark:hidden" : ""
                    } ${showText ? "mb-2" : ""}`}
                  />
                )}
                {showLogo && s.logoDark && (
                  <img
                    src={s.logoDark}
                    alt={s.logoText || "Logo"}
                    className={`mx-auto h-16 object-contain ${
                      s.logoLight ? "hidden dark:block" : ""
                    } ${showText ? "mb-2" : ""}`}
                  />
                )}
                {showText ? (
                  <h1
                    className="leading-none text-3xl sm:text-5xl md:text-6xl lg:text-7xl uppercase"
                    style={{
                      fontFamily: '"Inter", system-ui, sans-serif',
                      fontWeight: 800,
                      letterSpacing: "0.05em",
                    }}
                  >
                    <span
                      style={safePrimaryColor ? { color: safePrimaryColor } : undefined}
                      className={
                        !s.logoColorPrimary || s.logoColorPrimary === "#000000"
                          ? "text-foreground dark:text-white"
                          : ""
                      }
                    >
                      {primaryWord}
                    </span>{" "}
                    <span style={{ color: safeSecondaryColor }}>
                      {secondaryWord}
                    </span>
                  </h1>
                ) : (
                  <h1 className="sr-only">{s.logoText || "Today Tripura"}</h1>
                )}
              </Link>
              {showText && (
                <p className="mt-2.5 sm:mt-3 block text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.18em] sm:tracking-[0.25em] md:tracking-[0.35em] text-foreground/80 dark:text-foreground/85">
                  {taglineContent}
                </p>
              )}
            </div>
          )}
        </div>
      </header>

      <nav className="hidden border-t border-border md:block md:sticky md:top-11 md:z-30 md:bg-background md:border-b h-11">
        <div className="mx-auto flex h-full max-w-7xl items-center justify-between gap-4 px-4">
          <div className="flex flex-1 flex-wrap items-center justify-center gap-1 text-sm font-semibold uppercase tracking-wider">
            <Link
              to="/"
              aria-label="Home"
              className="flex items-center whitespace-nowrap px-3 py-1 transition-colors hover:underline"
            >
              <Home className="h-4 w-4" />
            </Link>
            {navItems.map((s: string) =>
              s === "Others" ? (
                <div key={s} className="group relative">
                  <button className="flex items-center gap-1 whitespace-nowrap px-3 py-1 uppercase transition-colors hover:underline">
                    {s}
                    <ChevronDown className="h-3.5 w-3.5" />
                  </button>
                  <div className="invisible absolute left-1/2 z-50 mt-0 w-48 -translate-x-1/2 border border-border bg-background py-2 opacity-0 shadow-lg transition-all group-hover:visible group-hover:opacity-100">
                    {dropdownItems.map((c) => (
                      <Link
                        key={c}
                        to="/$slug"
                        params={{ slug: slugify(c) }}
                        className="block px-4 py-2 text-left text-xs font-semibold uppercase tracking-wider text-foreground hover:bg-muted"
                      >
                        {c}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <Link
                  key={s}
                  to="/$slug"
                  params={{ slug: slugify(s) }}
                  className="whitespace-nowrap px-3 py-1 transition-colors hover:underline"
                >
                  {s}
                </Link>
              ),
            )}
          </div>
        </div>
      </nav>
    </>
  );
}

export { SearchBox } from "./SearchModal";
