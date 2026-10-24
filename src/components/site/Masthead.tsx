import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Link, useNavigate } from "@tanstack/react-router";
import { sections, slugify } from "@/lib/news-data";
import { getTopTags } from "@/lib/taxonomy.functions";
import { ChevronDown, ChevronLeft, ChevronRight, Home, Search, X } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useSiteSettings, useCategories } from "@/components/site/AdSettingsContext";
import { useTheme } from "@/lib/theme";
import { getAccessibleLogoColor } from "@/lib/color-utils";
import { SearchBox } from "./SearchModal";

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

  let navItems: { name: string; slug: string; redirectUrl?: string | null }[] = sections.map((sec) => ({
    name: sec,
    slug: slugify(sec),
  }));
  let dropdownItems: { name: string; slug: string; redirectUrl?: string | null }[] = otherCategories.map((c) => ({
    name: c,
    slug: slugify(c),
  }));

  if (dbCats.length > 0) {
    const explicitHeaderCats = dbCats
      .filter((c: any) => c && c.showInHeader)
      .sort((a: any, b: any) => (a?.sortOrder || 0) - (b?.sortOrder || 0))
      .map((c: any) => ({
        name: String(c?.name || ""),
        slug: String(c?.slug || slugify(c?.name || "")),
        redirectUrl: c?.redirectUrl || null,
      }));
    const dropdownCats = dbCats
      .filter((c: any) => c && !c.showInHeader)
      .sort((a: any, b: any) => (a?.sortOrder || 0) - (b?.sortOrder || 0))
      .map((c: any) => ({
        name: String(c?.name || ""),
        slug: String(c?.slug || slugify(c?.name || "")),
        redirectUrl: c?.redirectUrl || null,
      }));

    if (explicitHeaderCats.length > 0) {
      navItems = explicitHeaderCats;
      if (dropdownCats.length > 0) {
        navItems = [...navItems, { name: "Others", slug: "others" }];
        dropdownItems = dropdownCats;
      } else {
        dropdownItems = [];
      }
    } else {
      const allMapped = [...dbCats]
        .sort((a: any, b: any) => (a?.sortOrder || 0) - (b?.sortOrder || 0))
        .map((c: any) => ({
          name: String(c?.name || ""),
          slug: String(c?.slug || slugify(c?.name || "")),
          redirectUrl: c?.redirectUrl || null,
        }));
      if (allMapped.length <= 11) {
        navItems = allMapped;
        dropdownItems = [];
      } else {
        navItems = [...allMapped.slice(0, 10), { name: "Others", slug: "others" }];
        dropdownItems = allMapped.slice(10);
      }
    }
  }

  const [logoFailed, setLogoFailed] = useState(false);

  const navScrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = () => {
    const el = navScrollRef.current;
    if (!el) return;
    const hasOverflow = el.scrollWidth > el.clientWidth + 2;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(hasOverflow && el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  };

  useEffect(() => {
    checkScroll();
    const el = navScrollRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      if (el.scrollWidth > el.clientWidth) {
        if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
          const atStart = el.scrollLeft <= 0;
          const atEnd = el.scrollLeft >= el.scrollWidth - el.clientWidth - 1;
          if ((e.deltaY > 0 && !atEnd) || (e.deltaY < 0 && !atStart)) {
            e.preventDefault();
            el.scrollLeft += e.deltaY;
            checkScroll();
          }
        }
      }
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    const observer = new ResizeObserver(() => checkScroll());
    observer.observe(el);
    window.addEventListener("resize", checkScroll);

    return () => {
      el.removeEventListener("wheel", onWheel);
      observer.disconnect();
      window.removeEventListener("resize", checkScroll);
    };
  }, [navItems]);

  const scrollNav = (direction: "left" | "right") => {
    if (!navScrollRef.current) return;
    const scrollAmount = 220;
    navScrollRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  const hasLogo = !logoFailed && !!(s.logoLight || s.logoDark);
  const mode = s.logoDisplayMode || (hasLogo ? "both" : "text_only");
  const isFitScreen = !!s.logoFitScreen || mode === "logo_fit";

  const showLogo =
    hasLogo &&
    (mode === "logo_only" || mode === "both" || mode === "both_stacked" || mode === "logo_fit");
  // Always show text if no logo exists, if logo failed, or if display mode includes text
  const showText =
    !hasLogo || logoFailed || mode === "text_only" || mode === "both" || mode === "both_stacked";
  const isSideBySide = mode === "both" && showLogo && showText;
  const isStacked = mode === "both_stacked" && showLogo && showText;

  const siteWords = (s.siteName || "").trim().split(/\s+/).filter(Boolean);
  const logoWords = (s.logoText || "").trim().split(/\s+/).filter(Boolean);

  const primaryWord =
    s.logoTextPrimary !== undefined && s.logoTextPrimary !== ""
      ? s.logoTextPrimary
      : logoWords[0] || siteWords[0] || "Today";

  const secondaryWord =
    s.logoTextSecondary !== undefined && s.logoTextSecondary !== ""
      ? s.logoTextSecondary
      : logoWords.length > 1
        ? logoWords.slice(1).join(" ")
        : siteWords.length > 1
          ? siteWords.slice(1).join(" ")
          : "";

  const brandAccessibleName = (secondaryWord ? `${primaryWord} ${secondaryWord}` : primaryWord).trim() || s.siteName || "Home";

  const taglineContent = s.tagline ? (
    <span className="break-words text-center inline-block">{s.tagline}</span>
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
  );

  return (
    <>
      <header className="border-b border-border">
        <div className="mx-auto max-w-7xl px-4 py-5 text-center md:py-6 overflow-hidden">
          {/* 1. Side-by-Side Brand Lockup (Matches Reference Image) */}
          {isSideBySide && (
            <Link to="/" aria-label={brandAccessibleName} className="inline-block max-w-full">
              <div className="inline-flex items-center justify-center gap-3 sm:gap-4 md:gap-5 text-left max-w-full">
                {/* Logo Mark on the Left */}
                <div className="shrink-0 flex items-center justify-center">
                  {s.logoLight && (
                    <img
                      src={s.logoLight}
                      alt={s.logoText || s.siteName || "Logo"}
                      width={160}
                      height={80}
                      decoding="async"
                      onError={() => setLogoFailed(true)}
                      className={`h-11 sm:h-16 md:h-20 lg:h-22 w-auto max-w-[80px] sm:max-w-[120px] md:max-w-[160px] object-contain ${
                        s.logoDark ? "dark:hidden" : ""
                      }`}
                    />
                  )}
                  {s.logoDark && (
                    <img
                      src={s.logoDark}
                      alt={s.logoText || s.siteName || "Logo"}
                      width={160}
                      height={80}
                      decoding="async"
                      onError={() => setLogoFailed(true)}
                      className={`h-11 sm:h-16 md:h-20 lg:h-22 w-auto max-w-[80px] sm:max-w-[120px] md:max-w-[160px] object-contain ${
                        s.logoLight ? "hidden dark:block" : ""
                      }`}
                    />
                  )}
                </div>

                {/* Brand Title (Two-tone) & Tagline on the Right */}
                <div className="flex flex-col justify-center items-center text-center min-w-0 w-full">
                  <h1
                    className="leading-none text-2xl sm:text-4xl md:text-5xl lg:text-6xl uppercase font-extrabold text-center"
                    style={{
                      fontFamily: 'var(--font-headlines, "Inter", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif)',
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
                  <div
                    className={`mt-1.5 sm:mt-2 font-semibold uppercase text-center w-full text-foreground/80 dark:text-foreground/85 ${
                      !s.taglineFontSize ? "text-[9px] sm:text-[11px] md:text-xs" : ""
                    }`}
                    style={
                      s.taglineFontSize
                        ? {
                            fontSize: `clamp(${Math.max(8, s.taglineFontSize - 4)}px, 2.5vw, ${s.taglineFontSize}px)`,
                            lineHeight: 1.3,
                          }
                        : undefined
                    }
                  >
                    {taglineContent}
                  </div>
                </div>
              </div>
            </Link>
          )}

          {/* 2. Fit Screen / Full Banner Logo */}
          {(!logoFailed && (mode === "logo_fit" || (mode === "logo_only" && isFitScreen)) && !isSideBySide) && (
            <Link to="/" aria-label={brandAccessibleName} className="block w-full">
              <div className="w-full flex items-center justify-center">
                {s.logoLight && (
                  <img
                    src={s.logoLight}
                    alt={s.logoText || s.siteName || "Logo"}
                    width={800}
                    height={160}
                    decoding="async"
                    onError={() => setLogoFailed(true)}
                    className={`w-full max-w-5xl h-auto max-h-36 sm:max-h-48 md:max-h-60 object-contain mx-auto ${
                      s.logoDark ? "dark:hidden" : ""
                    }`}
                  />
                )}
                {s.logoDark && (
                  <img
                    src={s.logoDark}
                    alt={s.logoText || s.siteName || "Logo"}
                    width={800}
                    height={160}
                    decoding="async"
                    onError={() => setLogoFailed(true)}
                    className={`w-full max-w-5xl h-auto max-h-36 sm:max-h-48 md:max-h-60 object-contain mx-auto ${
                      s.logoLight ? "hidden dark:block" : ""
                    }`}
                  />
                )}
              </div>
            </Link>
          )}

          {/* 3. Stacked Logo + Text or Logo Only (Standard) or Text Only (or Fallback if logo failed) */}
          {!isSideBySide && (logoFailed || (mode !== "logo_fit" && !(mode === "logo_only" && isFitScreen))) && (
            <div>
              <Link to="/" aria-label={brandAccessibleName} className="block">
                {showLogo && s.logoLight && (
                  <img
                    src={s.logoLight}
                    alt={s.logoText || s.siteName || "Logo"}
                    width={200}
                    height={64}
                    decoding="async"
                    onError={() => setLogoFailed(true)}
                    className={`mx-auto h-16 object-contain ${
                      s.logoDark ? "dark:hidden" : ""
                    } ${showText ? "mb-2" : ""}`}
                  />
                )}
                {showLogo && s.logoDark && (
                  <img
                    src={s.logoDark}
                    alt={s.logoText || s.siteName || "Logo"}
                    width={200}
                    height={64}
                    decoding="async"
                    onError={() => setLogoFailed(true)}
                    className={`mx-auto h-16 object-contain ${
                      s.logoLight ? "hidden dark:block" : ""
                    } ${showText ? "mb-2" : ""}`}
                  />
                )}
                {showText ? (
                  <h1
                    className="leading-none text-3xl sm:text-5xl md:text-6xl lg:text-7xl uppercase"
                    style={{
                      fontFamily: 'var(--font-headlines, "Inter", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif)',
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
                  <h1 className="sr-only">{s.logoText || s.siteName || "Today Tripura"}</h1>
                )}
              </Link>
              {showText && (
                <p
                  className={`mt-2.5 sm:mt-3 block text-center mx-auto font-semibold uppercase text-foreground/80 dark:text-foreground/85 ${
                    !s.taglineFontSize ? "text-[10px] sm:text-[11px]" : ""
                  }`}
                  style={
                    s.taglineFontSize
                      ? {
                          fontSize: `clamp(${Math.max(8, s.taglineFontSize - 4)}px, 2.5vw, ${s.taglineFontSize}px)`,
                          lineHeight: 1.3,
                        }
                      : undefined
                  }
                >
                  {taglineContent}
                </p>
              )}
            </div>
          )}
        </div>
      </header>

      <nav className="sticky top-0 z-40 w-full border-t border-b border-border bg-background/95 backdrop-blur-md shadow-xs h-11 transition-all">
        <div className="relative mx-auto flex h-full max-w-7xl items-center px-1 sm:px-2">
          {/* Left scroll chevron */}
          {canScrollLeft && (
            <div className="absolute left-0 top-0 bottom-0 z-10 flex items-center pr-3 pl-1 bg-gradient-to-r from-background via-background/90 to-transparent">
              <button
                type="button"
                onClick={() => scrollNav("left")}
                className="flex items-center justify-center h-7 w-7 rounded-full text-foreground/70 hover:text-foreground hover:bg-muted/80 transition-colors shadow-xs cursor-pointer"
                aria-label="Scroll menu left"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* Scrollable menu items track */}
          <div
            ref={navScrollRef}
            onScroll={checkScroll}
            className="w-full h-full flex items-center overflow-x-auto overflow-y-hidden no-scrollbar [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden scroll-smooth py-1"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            <div className="flex items-center min-w-full w-max justify-center gap-1.5 sm:gap-3 md:gap-4 lg:gap-5 text-xs sm:text-sm font-semibold uppercase tracking-wider px-2 sm:px-4">
              {/* Home Icon */}
              <Link
                to="/"
                aria-label="Home"
                className="flex items-center shrink-0 whitespace-nowrap px-1.5 sm:px-2 py-1 text-foreground hover:text-red-600 dark:hover:text-red-400 transition-colors"
                activeProps={{
                  className: "flex items-center shrink-0 whitespace-nowrap px-1.5 sm:px-2 py-1 text-red-600 dark:text-red-500 font-bold",
                }}
              >
                <Home className="h-4 w-4" />
              </Link>

              {/* Category Items */}
              {navItems.map((item) =>
                item.name === "Others" ? (
                  <DropdownMenu key={item.name}>
                    <DropdownMenuTrigger asChild>
                      <button className="flex items-center gap-1 shrink-0 whitespace-nowrap px-1.5 sm:px-2 py-1 uppercase text-foreground hover:text-red-600 dark:hover:text-red-400 transition-colors cursor-pointer outline-hidden">
                        {item.name}
                        <ChevronDown className="h-3.5 w-3.5" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="center" className="w-48 max-h-72 overflow-y-auto">
                      {dropdownItems.map((c) =>
                        c.redirectUrl ? (
                          <DropdownMenuItem key={c.slug} asChild>
                            <a
                              href={c.redirectUrl}
                              target={c.redirectUrl.startsWith("http") ? "_blank" : undefined}
                              rel={c.redirectUrl.startsWith("http") ? "noopener noreferrer" : undefined}
                              className="w-full cursor-pointer px-3 py-2 text-xs font-semibold uppercase tracking-wider text-foreground hover:text-red-600"
                            >
                              {c.name}
                            </a>
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem key={c.slug} asChild>
                            <Link
                              to="/$slug"
                              params={{ slug: c.slug }}
                              className="w-full cursor-pointer px-3 py-2 text-xs font-semibold uppercase tracking-wider text-foreground hover:text-red-600"
                            >
                              {c.name}
                            </Link>
                          </DropdownMenuItem>
                        ),
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : item.redirectUrl ? (
                  <a
                    key={item.slug}
                    href={item.redirectUrl}
                    target={item.redirectUrl.startsWith("http") ? "_blank" : undefined}
                    rel={item.redirectUrl.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="shrink-0 whitespace-nowrap px-1.5 sm:px-2 py-1 text-foreground hover:text-red-600 dark:hover:text-red-400 transition-colors"
                  >
                    {item.name}
                  </a>
                ) : (
                  <Link
                    key={item.slug}
                    to="/$slug"
                    params={{ slug: item.slug }}
                    className="shrink-0 whitespace-nowrap px-1.5 sm:px-2 py-1 text-foreground hover:text-red-600 dark:hover:text-red-400 transition-colors"
                    activeProps={{
                      className: "shrink-0 whitespace-nowrap px-1.5 sm:px-2 py-1 text-red-600 dark:text-red-500 font-bold",
                    }}
                  >
                    {item.name}
                  </Link>
                ),
              )}
            </div>
          </div>

          {/* Right scroll chevron */}
          {canScrollRight && (
            <div className="absolute right-0 top-0 bottom-0 z-10 flex items-center pl-3 pr-1 bg-gradient-to-l from-background via-background/90 to-transparent">
              <button
                type="button"
                onClick={() => scrollNav("right")}
                className="flex items-center justify-center h-7 w-7 rounded-full text-foreground/70 hover:text-foreground hover:bg-muted/80 transition-colors shadow-xs cursor-pointer"
                aria-label="Scroll menu right"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </nav>
    </>
  );
}

export { SearchBox } from "./SearchModal";
