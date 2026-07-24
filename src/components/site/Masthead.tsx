import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Link, useNavigate } from "@tanstack/react-router";
import { sections } from "@/lib/news-data";
import { getTopTags } from "@/lib/taxonomy.functions";
import { ChevronDown, Home, Search, X } from "lucide-react";

const slugify = (s: string) => s.toLowerCase().replace(/\s+/g, "-");


import { useSiteSettings } from "@/components/site/AdSettingsContext";

const otherCategories = ["Entertainment", "Health", "Education", "Jobs", "Travel", "Lifestyle"];

export function Masthead() {
  const s = useSiteSettings();
  const hasLogo = !!(s.logoLight || s.logoDark);
  const showLogo = hasLogo;
  const showText = !hasLogo;
  
  return (
    <>
      <header className="border-b border-border">
        <div className="mx-auto max-w-7xl px-4 py-5 text-center md:py-6">
          <div className="kicker mb-2 hidden md:block">Est. 2026 · Vol. I · No. 184</div>
          <Link to="/" className="block">
            {showLogo && s.logoLight && (
              <img src={s.logoLight} alt={s.logoText || "Logo"} className={`mx-auto h-16 object-contain ${s.logoDark ? "dark:hidden" : ""} ${showText ? "mb-2" : ""}`} />
            )}
            {showLogo && s.logoDark && (
              <img src={s.logoDark} alt={s.logoText || "Logo"} className={`mx-auto h-16 object-contain ${s.logoLight ? "hidden dark:block" : ""} ${showText ? "mb-2" : ""}`} />
            )}
            {showText && (
              <h1
                className="leading-none text-foreground text-3xl sm:text-5xl md:text-6xl lg:text-7xl uppercase"
                style={{ fontFamily: '"Inter", system-ui, sans-serif', fontWeight: 800, letterSpacing: "0.05em" }}
              >
                {s.logoText || "News Theme"}
              </h1>
            )}
          </Link>
          <p className="mt-3 hidden text-[11px] font-semibold uppercase tracking-[0.35em] md:block text-muted-foreground">
            {s.tagline ? (
              <span>{s.tagline}</span>
            ) : (
              <>
                <span style={{ color: "#2563eb" }}>Breaking News</span>
                <span className="mx-2 text-muted-foreground">·</span>
                <span style={{ color: "#dc2626" }}>Finance</span>
                <span className="mx-2 text-muted-foreground">·</span>
                <span style={{ color: "#16a34a" }}>Business</span>
                <span className="mx-2 text-muted-foreground">·</span>
                <span style={{ color: "#ea580c" }}>Market</span>
              </>
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
            {sections.map((s) =>
              s === "Others" ? (
                <div key={s} className="group relative">
                  <button className="flex items-center gap-1 whitespace-nowrap px-3 py-1 uppercase transition-colors hover:underline">
                    {s}
                    <ChevronDown className="h-3.5 w-3.5" />
                  </button>
                  <div className="invisible absolute left-1/2 z-50 mt-0 w-48 -translate-x-1/2 border border-border bg-background py-2 opacity-0 shadow-lg transition-all group-hover:visible group-hover:opacity-100">
                    {otherCategories.map((c) => (
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
              )
            )}
          </div>
        </div>
      </nav>
    </>
  );
}

export { SearchBox } from "./SearchModal";


