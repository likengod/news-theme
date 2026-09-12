import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Link, useNavigate } from "@tanstack/react-router";
import { sections } from "@/lib/news-data";
import { getTopTags } from "@/lib/taxonomy.functions";
import { ChevronDown, Home, Search, X } from "lucide-react";

const slugify = (s: string) => s.toLowerCase().replace(/\s+/g, "-");

import { useSiteSettings, useCategories } from "@/components/site/AdSettingsContext";

const otherCategories = ["Entertainment", "Health", "Education", "Jobs", "Travel", "Lifestyle"];

export function Masthead() {
  const s = useSiteSettings();
  const dbCats = useCategories();

  let navItems = sections;
  let dropdownItems = otherCategories;

  if (dbCats.length > 0) {
    const explicitHeaderCats = dbCats.filter((c: any) => c.showInHeader).map((c: any) => c.name);
    const dropdownCats = dbCats.filter((c: any) => !c.showInHeader).map((c: any) => c.name);

    if (explicitHeaderCats.length > 0) {
      navItems = explicitHeaderCats;
      if (dropdownCats.length > 0) {
        navItems = [...navItems, "Others"];
        dropdownItems = dropdownCats;
      } else {
        dropdownItems = [];
      }
    } else {
      const allCatNames = dbCats.map((c: any) => c.name);
      if (allCatNames.length <= 9) {
        navItems = allCatNames;
        dropdownItems = [];
      } else {
        navItems = [...allCatNames.slice(0, 8), "Others"];
        dropdownItems = allCatNames.slice(8);
      }
    }
  }

  const hasLogo = !!(s.logoLight || s.logoDark);
  const mode = s.logoDisplayMode || (hasLogo ? "logo_only" : "text_only");

  const showLogo = hasLogo && (mode === "logo_only" || mode === "both");
  const showText = !hasLogo || mode === "text_only" || mode === "both";

  return (
    <>
      <header className="border-b border-border">
        <div className="mx-auto max-w-7xl px-4 py-5 text-center md:py-6">
          <Link to="/" className="block">
            {showLogo && s.logoLight && (
              <img
                src={s.logoLight}
                alt={s.logoText || "Logo"}
                className={`mx-auto h-16 object-contain ${s.logoDark ? "dark:hidden" : ""} ${showText ? "mb-2" : ""}`}
              />
            )}
            {showLogo && s.logoDark && (
              <img
                src={s.logoDark}
                alt={s.logoText || "Logo"}
                className={`mx-auto h-16 object-contain ${s.logoLight ? "hidden dark:block" : ""} ${showText ? "mb-2" : ""}`}
              />
            )}
            {showText && (
              <h1
                className="leading-none text-3xl sm:text-5xl md:text-6xl lg:text-7xl uppercase"
                style={{
                  fontFamily: '"Inter", system-ui, sans-serif',
                  fontWeight: 800,
                  letterSpacing: "0.05em",
                }}
              >
                <span
                  style={s.logoColorPrimary ? { color: s.logoColorPrimary } : undefined}
                  className={
                    !s.logoColorPrimary || s.logoColorPrimary === "#000000"
                      ? "text-foreground dark:text-white"
                      : ""
                  }
                >
                  {s.logoTextPrimary !== undefined && s.logoTextPrimary !== ""
                    ? s.logoTextPrimary
                    : s.logoText
                      ? s.logoText.split(" ")[0]
                      : "NEWS"}
                </span>{" "}
                <span style={{ color: s.logoColorSecondary || "#dc2626" }}>
                  {s.logoTextSecondary !== undefined && s.logoTextSecondary !== ""
                    ? s.logoTextSecondary
                    : s.logoText && s.logoText.split(" ").length > 1
                      ? s.logoText.split(" ").slice(1).join(" ")
                      : "THEME"}
                </span>
              </h1>
            )}
          </Link>
          <p className="mt-2.5 sm:mt-3 block text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.18em] sm:tracking-[0.25em] md:tracking-[0.35em] text-muted-foreground">
            {s.tagline ? (
              <span className="break-words">{s.tagline}</span>
            ) : (
              <span className="inline-flex flex-wrap items-center justify-center gap-x-1.5 sm:gap-x-2">
                <span className="text-[#1d4ed8] dark:text-blue-400">Breaking News</span>
                <span className="text-muted-foreground">•</span>
                <span className="text-[#b91c1c] dark:text-red-400">Finance</span>
                <span className="text-muted-foreground">•</span>
                <span className="text-[#15803d] dark:text-emerald-400">Business</span>
                <span className="text-muted-foreground">•</span>
                <span className="text-[#c2410c] dark:text-orange-400">Market</span>
              </span>
            )}
          </p>
        </div>
      </header>

      <nav className="hidden border-t border-border md:block md:sticky md:top-11 md:z-30 md:bg-background/90 md:backdrop-blur-md md:border-b h-11">
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
