import { useEffect, useState, useRef } from "react";
import artImg from "@/assets/hero-markets.webp";
import pensionImg from "@/assets/news-wallstreet.webp";
import coverImg from "@/assets/news-oil.webp";
import slide1 from "@/assets/news-fed.webp";
import slide2 from "@/assets/news-tech.webp";
import slide3 from "@/assets/news-crypto.webp";
import {
  loadAds,
  loadAdRotation,
  loadAdSlotMode,
  loadAdSlotScript,
  loadSettings,
  type AdSlideItem,
  type AdSlotMode,
} from "@/lib/site-content";
import { useHomepageConfig } from "@/hooks/use-homepage-config";
import { ScriptAdRenderer } from "./ScriptAdRenderer";

import { getArticleImage } from "@/lib/news-data";
import { Link } from "@tanstack/react-router";

const FALLBACK_SLIDES = [coverImg, slide1, slide2, slide3, pensionImg, artImg].map(
  (src) => ({ id: src, image: src, href: "#" }) as AdSlideItem,
);

import { useAdSettings, useSiteSettings } from "./AdSettingsContext";

function getArticleSnippet(art?: { content?: string; excerpt?: string } | null): string {
  if (!art) return "";
  let raw = "";
  if (art.content && art.content.replace(/<[^>]+>/g, "").trim().length > 30) {
    raw = art.content;
  } else if (art.excerpt) {
    raw = art.excerpt;
  } else {
    raw = art.content || "";
  }

  let text = raw
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&#8203;/gi, "")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s+/g, " ")
    .trim();

  // Deduplicate consecutive identical sentences (prevents repetitive copy-paste text)
  if (text) {
    const parts = text.split(/(?<=[।?!.])/).map((s) => s.trim()).filter(Boolean);
    if (parts.length > 1) {
      const deduped: string[] = [];
      for (const part of parts) {
        if (deduped.length === 0 || deduped[deduped.length - 1] !== part) {
          deduped.push(part);
        }
      }
      text = deduped.join(" ");
    }
  }

  return text;
}

function MagazineLeadHeadline({ leadArt }: { leadArt: any }) {
  const snippet = getArticleSnippet(leadArt);

  return (
    <Link
      to="/news/$slug"
      params={{
        slug: leadArt.slug,
      }}
      className="group flex flex-col justify-center pt-0.5 min-w-0 w-full"
    >
      <h2 className="headline text-[24px] sm:text-[28px] lg:text-[32px] xl:text-[36px] font-extrabold leading-[1.25] tracking-tight text-foreground group-hover:text-red-600 transition-colors line-clamp-3">
        {leadArt.title}
      </h2>
      <p className="mt-3 text-[14px] sm:text-[15px] lg:text-[16px] leading-relaxed text-muted-foreground line-clamp-4 select-text">
        {snippet}
      </p>
      <div className="mt-3 flex items-center gap-2 font-sans text-[13px] sm:text-[14px] font-semibold text-foreground">
        <span className="text-red-600 uppercase text-xs font-bold tracking-wider">
          {leadArt.category || "খবর"}
        </span>
        <span className="text-slate-300">•</span>
        <span>By {leadArt.author || "Newsroom Staff"}</span>
      </div>
    </Link>
  );
}

function MagazineCard1({ p1 }: { p1: any }) {
  return (
    <Link
      to="/news/$slug"
      params={{
        slug: p1.slug,
      }}
      className="group block w-full max-w-full min-w-0"
    >
      <div className="grid gap-4 md:grid-cols-[194px_1fr] items-start">
        <img
          src={getArticleImage(p1.featuredImage, 1)}
          alt=""
          aria-hidden="true"
          loading="lazy"
          decoding="async"
          width={194}
          height={130}
          className="h-[130px] md:h-[135px] w-full object-cover md:w-[194px] rounded-xs shrink-0"
        />
        <div className="min-w-0">
          <p className="headline text-[20px] font-bold leading-[1.3] tracking-normal text-foreground group-hover:underline md:text-[22px] line-clamp-2">
            {p1.title}
          </p>
          <p className="mt-2 text-[14px] leading-relaxed text-muted-foreground line-clamp-3 overflow-hidden">
            {getArticleSnippet(p1)}
          </p>
        </div>
      </div>
    </Link>
  );
}

function MagazineSmallCard({ article }: { article: any }) {
  return (
    <Link
      to="/news/$slug"
      params={{ slug: article.slug }}
      className="group block min-w-0"
    >
      <p className="headline text-[17px] font-bold leading-[1.32] tracking-normal text-foreground group-hover:underline line-clamp-2">
        {article.title}
      </p>
      <p className="mt-2 text-[14px] leading-relaxed text-muted-foreground line-clamp-3 overflow-hidden">
        {getArticleSnippet(article)}
      </p>
    </Link>
  );
}

export function MarketsMagazine({
  articles = [],
  usedIds,
}: {
  articles?: any[];
  usedIds?: Set<number>;
}) {
  const cfg = useHomepageConfig();
  const ctx = useAdSettings();

  const initialSlides = ctx?.adConfig ? ctx.adConfig.slots["home2"] || [] : loadAds("home2");
  const initialMode = ctx?.adConfig
    ? ctx.adConfig.modes["home2"] || "image"
    : loadAdSlotMode("home2");
  const initialScript = ctx?.adConfig
    ? ctx.adConfig.scripts["home2"] || ""
    : loadAdSlotScript("home2");

  const [slides, setSlides] = useState<AdSlideItem[]>(() => {
    return initialSlides.length > 0 ? initialSlides : FALLBACK_SLIDES;
  });
  const [slotMode, setSlotMode] = useState<AdSlotMode>(initialMode);
  const [slotScript, setSlotScript] = useState(initialScript);
  const settings = useSiteSettings();
  const [showCustomText, setShowCustomText] = useState(false);

  const hasAd = slotMode === "script" ? Boolean(slotScript) : slides.length > 0;

  const hasCustomAlert =
    settings.festiveThemeEnabled !== false &&
    (!!settings.topBarWeatherCustomText || !!settings.festiveAlertImage);

  useEffect(() => {
    if (!hasCustomAlert) {
      setShowCustomText(false);
      return;
    }
    const delay = (Number(settings.topBarSwapDelay) || 5) * 1000;
    const interval = setInterval(() => {
      setShowCustomText((prev) => !prev);
    }, delay);
    return () => clearInterval(interval);
  }, [hasCustomAlert, settings.topBarSwapDelay]);

  useEffect(() => {
    if (ctx?.adConfig) {
      const ads = ctx.adConfig.slots["home2"] || [];
      setSlides(ads.length > 0 ? ads : FALLBACK_SLIDES);
      setSlotMode(ctx.adConfig.modes["home2"] || "image");
      setSlotScript(ctx.adConfig.scripts["home2"] || "");
    }
  }, [ctx?.adConfig]);

  useEffect(() => {
    const sync = () => {
      const ads = loadAds("home2");
      setSlides(ads.length > 0 ? ads : FALLBACK_SLIDES);
      setSlotMode(loadAdSlotMode("home2"));
      setSlotScript(loadAdSlotScript("home2"));
    };
    window.addEventListener("nt:ads-updated", sync);
    return () => window.removeEventListener("nt:ads-updated", sync);
  }, []);

  const [slideIdx, setSlideIdx] = useState(0);
  useEffect(() => {
    setSlideIdx(0);
    if (slotMode === "script" || slides.length <= 1) return;
    const sec = ctx?.adConfig?.rotations["home2"] ?? loadAdRotation("home2");
    const id = setInterval(
      () => setSlideIdx((i) => (i + 1) % slides.length),
      Math.max(1, sec) * 1000,
    );
    return () => clearInterval(id);
  }, [slides, slotMode, ctx?.adConfig?.rotations]);

  // Filter articles based on selected category (defaulting to "Markets" if not configured)
  const localUsed = new Set<number>(usedIds || []);
  const configuredCategory = cfg.marketsMagazine.category;
  const magazineCategory =
    !configuredCategory || configuredCategory === "Markets" ? "Auto (Latest)" : configuredCategory;

  let dbMagazineArticles = articles.filter((a) => {
    if (localUsed.has(a.id)) return false;
    if (!magazineCategory || magazineCategory === "Auto (Latest)") return true;
    const cats = (a.category || "").split(",").map((c: string) => c.trim().toLowerCase());
    return cats.includes(magazineCategory.toLowerCase());
  });

  // Record selected articles as used
  dbMagazineArticles.slice(0, 4).forEach((a) => localUsed.add(a.id));

  // Only use real articles from the database
  const leadArt = dbMagazineArticles[0];
  const p1 = dbMagazineArticles[1];
  const p2 = dbMagazineArticles[2];
  const p3 = dbMagazineArticles[3];

  const activeGradient = settings.festiveCategoryTitleGradient || settings.topBarTextGradient;
  const FESTIVE_GRADIENT_MAP: Record<string, string> = {
    "indian-flag": "linear-gradient(to right, #FF9933, #000080, #138808)",
    diwali: "linear-gradient(to right, #FF8008, #FFC837, #FF007F, #7F00FF)",
    sunset: "linear-gradient(to right, #F5576C, #F093FB)",
    neon: "linear-gradient(to right, #FF007F, #7F00FF, #00F0FF)",
    ocean: "linear-gradient(to right, #00c6ff, #0072ff)",
    forest: "linear-gradient(to right, #11998e, #38ef7d)",
  };

  const resolvedGrad =
    activeGradient &&
    (FESTIVE_GRADIENT_MAP[activeGradient] ||
      (activeGradient.includes("gradient(") ? activeGradient : null));

  const badgeStyle =
    resolvedGrad
      ? {
          backgroundImage: resolvedGrad,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }
      : {
          color: settings.festiveCategoryBadgeTextColor || "inherit",
        };

  const badgeTitle =
    settings.festiveThemeEnabled !== false && showCustomText && settings.topBarWeatherCustomText
      ? settings.topBarWeatherCustomText
      : cfg.marketsMagazine.title;

  // If section is disabled in homepage config or there are no real articles for it, do not render
  if (cfg.marketsMagazine.enabled === false || !leadArt) {
    return null;
  }

  return (
    <section className="border border-border bg-background px-4 py-6 font-sans sm:px-6 md:px-9 w-full max-w-full min-w-0 overflow-hidden">
      <div className="mb-4 inline-block">
        <span
          key={showCustomText ? "custom" : "default"}
          className="font-sans text-xs sm:text-sm font-black uppercase tracking-widest inline-flex items-center gap-1.5 transition-all duration-300"
          style={badgeStyle}
          suppressHydrationWarning
        >
          {hasCustomAlert && showCustomText && settings.festiveAlertImage ? (
            <img
              src={settings.festiveAlertImage}
              alt="Alert"
              className="h-4 w-auto max-w-[80px] object-contain shrink-0 align-middle"
            />
          ) : (
            <span suppressHydrationWarning>{badgeTitle}</span>
          )}
        </span>
      </div>

      {/* Main Feature Layout */}
      <div className={`grid items-start gap-6 w-full max-w-full min-w-0 ${hasAd ? "md:grid-cols-[minmax(280px,380px)_minmax(0,1fr)] lg:grid-cols-[minmax(300px,400px)_minmax(0,1fr)_340px] xl:grid-cols-[minmax(340px,460px)_minmax(0,1fr)_360px]" : "md:grid-cols-[minmax(320px,460px)_minmax(0,1fr)] lg:grid-cols-[minmax(360px,520px)_minmax(0,1fr)]"}`}>
        {/* Featured Image Column */}
        <Link
          to="/news/$slug"
          params={{
            slug: leadArt.slug,
          }}
          className="group block w-full min-w-0 overflow-hidden rounded-xl border border-slate-200/80 bg-slate-900/5 dark:bg-slate-900/60 transition-all hover:border-slate-300 shadow-xs"
        >
          <figure className="w-full flex flex-col items-center">
            <div className="relative w-full flex items-center justify-center overflow-hidden rounded-xl bg-black/5 dark:bg-black/30">
              {cfg.marketsMagazine.imageFit === "cover" ? (
                <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full overflow-hidden">
                  <img
                    src={getArticleImage(leadArt.featuredImage, 0)}
                    alt={leadArt.title}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
              ) : (
                <div className="relative w-full flex items-center justify-center p-0.5">
                  <img
                    src={getArticleImage(leadArt.featuredImage, 0)}
                    alt={leadArt.title}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-auto max-h-[360px] sm:max-h-[420px] object-contain rounded-lg transition-transform duration-300 group-hover:scale-[1.02]"
                  />
                </div>
              )}
            </div>
            {leadArt.imageCredit && (
              <figcaption className="w-full px-2 py-1 text-right font-sans text-[11px] leading-tight text-muted-foreground">
                {leadArt.imageCredit}
              </figcaption>
            )}
          </figure>
        </Link>

        {/* Headline & Story Deck Column */}
        <MagazineLeadHeadline leadArt={leadArt} />

        {/* Right Ad Slot (Only if ads are present) */}
        {hasAd && (
          <aside className="relative h-[200px] lg:h-[220px] w-full overflow-hidden rounded-xl border border-border bg-muted/30 shrink-0">
            {slotMode === "script" ? (
              <div className="absolute inset-0 flex items-center justify-center p-2">
                <ScriptAdRenderer code={slotScript} />
              </div>
            ) : (
              slides.map((s, i) => {
                const isActive = i === slideIdx;
                return (
                  <a
                    key={s.id}
                    href={isActive ? (s.href || "#") : undefined}
                    aria-hidden={!isActive ? "true" : undefined}
                    tabIndex={isActive ? 0 : -1}
                    aria-label={(s as any).title || "Advertisement"}
                    className="absolute inset-0 block transition-opacity duration-300"
                    style={{
                      opacity: isActive ? 1 : 0,
                      pointerEvents: isActive ? "auto" : "none",
                      visibility: isActive ? "visible" : "hidden",
                    }}
                  >
                    <img
                      src={s.image}
                      alt=""
                      aria-hidden="true"
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover"
                    />
                  </a>
                );
              })
            )}
          </aside>
        )}
      </div>

      {(p1 || p2 || p3) && (
        <div className="mt-3 grid gap-8 border-t border-border pt-4 lg:grid-cols-[minmax(0,1.62fr)_minmax(0,0.7fr)_minmax(0,0.86fr)] w-full max-w-full min-w-0">
          {p1 && <MagazineCard1 p1={p1} />}
          {p2 && <MagazineSmallCard article={p2} />}
          {p3 && <MagazineSmallCard article={p3} />}
        </div>
      )}
    </section>
  );
}

export default MarketsMagazine;
