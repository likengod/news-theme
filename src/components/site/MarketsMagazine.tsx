import { useEffect, useState } from "react";
import artImg from "@/assets/hero-markets.jpg";
import pensionImg from "@/assets/news-wallstreet.jpg";
import coverImg from "@/assets/news-oil.jpg";
import slide1 from "@/assets/news-fed.jpg";
import slide2 from "@/assets/news-tech.jpg";
import slide3 from "@/assets/news-crypto.jpg";
import { loadAds, loadAdRotation, loadAdSlotMode, loadAdSlotScript, loadSettings, type AdSlideItem, type AdSlotMode } from "@/lib/site-content";
import { useHomepageConfig } from "@/hooks/use-homepage-config";
import { ScriptAdRenderer } from "./ScriptAdRenderer";

import { getArticleImage } from "@/lib/news-data";
import { Link } from "@tanstack/react-router";

const FALLBACK_SLIDES = [coverImg, slide1, slide2, slide3, pensionImg, artImg].map(
  (src) => ({ id: src, image: src, href: "#" } as AdSlideItem),
);

import { useAdSettings } from "./AdSettingsContext";

export function MarketsMagazine({ articles = [], usedIds }: { articles?: any[]; usedIds?: Set<number> }) {
  const cfg = useHomepageConfig();
  const ctx = useAdSettings();

  const initialSlides = ctx?.adConfig ? (ctx.adConfig.slots["home2"] || []) : loadAds("home2");
  const initialMode = ctx?.adConfig ? (ctx.adConfig.modes["home2"] || "image") : loadAdSlotMode("home2");
  const initialScript = ctx?.adConfig ? (ctx.adConfig.scripts["home2"] || "") : loadAdSlotScript("home2");

  const [slides, setSlides] = useState<AdSlideItem[]>(() => {
    return initialSlides.length > 0 ? initialSlides : FALLBACK_SLIDES;
  });
  const [slotMode, setSlotMode] = useState<AdSlotMode>(initialMode);
  const [slotScript, setSlotScript] = useState(initialScript);
  const [settings, setSettings] = useState(() => loadSettings());
  const [showCustomText, setShowCustomText] = useState(false);

  useEffect(() => {
    const handleUpdate = () => setSettings(loadSettings());
    window.addEventListener("nt:settings-updated", handleUpdate);
    return () => window.removeEventListener("nt:settings-updated", handleUpdate);
  }, []);

  useEffect(() => {
    if (!settings.topBarWeatherCustomText) return;
    const delay = (Number(settings.topBarSwapDelay) || 5) * 1000;
    const interval = setInterval(() => {
      setShowCustomText((prev) => !prev);
    }, delay);
    return () => clearInterval(interval);
  }, [settings.topBarWeatherCustomText, settings.topBarSwapDelay]);

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
  const localUsed = new Set<number>(usedIds);
  const magazineCategory = cfg.marketsMagazine.category || "Markets";
  const dbMagazineArticles = articles.filter((a) => {
    if (localUsed.has(a.id)) return false;
    if (!magazineCategory || magazineCategory === "Auto (Latest)") return true;
    return a.category?.toLowerCase() === magazineCategory.toLowerCase();
  });

  // Record selected articles as used
  dbMagazineArticles.slice(0, 4).forEach((a) => localUsed.add(a.id));

  const leadArt = dbMagazineArticles[0];
  const p1 = dbMagazineArticles[1];
  const p2 = dbMagazineArticles[2];
  const p3 = dbMagazineArticles[3];

  const activeGradient = settings.festiveCategoryTitleGradient || settings.topBarTextGradient;
  const FESTIVE_GRADIENT_MAP: Record<string, string> = {
    "indian-flag": "linear-gradient(to right, #FF9933, #000080, #138808)",
    "diwali": "linear-gradient(to right, #FF8008, #FFC837, #FF007F, #7F00FF)",
    "sunset": "linear-gradient(to right, #F5576C, #F093FB)",
    "neon": "linear-gradient(to right, #FF007F, #7F00FF, #00F0FF)",
    "ocean": "linear-gradient(to right, #00c6ff, #0072ff)",
    "forest": "linear-gradient(to right, #11998e, #38ef7d)",
  };

  const badgeStyle = activeGradient && FESTIVE_GRADIENT_MAP[activeGradient]
    ? {
        backgroundColor: settings.festiveCategoryBadgeBgColor || "#000000",
        backgroundImage: FESTIVE_GRADIENT_MAP[activeGradient],
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
      }
    : {
        backgroundColor: settings.festiveCategoryBadgeBgColor || "#000000",
        color: settings.festiveCategoryBadgeTextColor || "#ffffff",
      };

  const badgeTitle = showCustomText && settings.topBarWeatherCustomText
    ? settings.topBarWeatherCustomText
    : cfg.marketsMagazine.title;

  return (
    <section className="border border-border bg-background px-6 py-8 font-sans md:px-9">

      <div className="mb-5 inline-block">
        <span
          key={showCustomText ? "custom" : "default"}
          className="px-2.5 py-1 font-sans text-xs font-black uppercase tracking-widest inline-block rounded-xs shadow-xs transition-all duration-300"
          style={badgeStyle}
        >
          {badgeTitle}
        </span>
      </div>

      <div className="grid items-start gap-5 lg:grid-cols-[354px_minmax(340px,1fr)_406px]">
        <Link to="/news/$slug" params={{ slug: leadArt?.slug || "gen-z-traders-go-for-broke-in-pursuit-of-a-new-american-dream" }} className="group block">
          <figure>
            <img
              src={leadArt ? getArticleImage(leadArt.featuredImage, 0) : artImg}
              alt="Lead Article"
              loading="eager"
              // @ts-ignore
              fetchPriority="high"
              className="h-[235px] w-full object-cover"
            />
            <figcaption className="mt-1 text-right font-sans text-[10px] leading-tight text-muted-foreground">
              Artwork: Najeebah Al-Ghadban for Northeast Markets
            </figcaption>
          </figure>
        </Link>

        <Link to="/news/$slug" params={{ slug: leadArt?.slug || "gen-z-traders-go-for-broke-in-pursuit-of-a-new-american-dream" }} className="group block pt-0.5">
          <p className="max-w-[500px] font-sans text-[28px] font-extrabold leading-[1.14] tracking-normal text-foreground group-hover:underline md:text-[29px] line-clamp-2">
            {leadArt ? leadArt.title : "Gen-Z Traders Go for Broke in Pursuit of a New American Dream"}
          </p>
          <p className="mt-3 max-w-[440px] font-sans text-[16px] leading-[1.15] text-foreground line-clamp-6 [&::first-letter]:float-left [&::first-letter]:mr-2 [&::first-letter]:font-serif [&::first-letter]:text-[44px] [&::first-letter]:font-bold [&::first-letter]:leading-[0.85] [&::first-letter]:mt-1">
            {leadArt ? (leadArt.excerpt || leadArt.content?.replace(/<[^>]*>/g, '').slice(0, 300) + "...") : "Lottery-like meme stocks and options can seem like a shortcut to beat high home prices, stubborn inflation and the looming threat of AI to entry-level jobs. A new generation of retail traders is piling into zero-day options, leveraged ETFs and viral tickers, betting that a single windfall can leapfrog them past a housing market that feels permanently out of reach and a labor market reshaped overnight."}
          </p>
          <p className="mt-1 font-sans text-[15px] leading-tight text-foreground">
            By {leadArt ? (leadArt.author || "Newsroom Staff") : "Justina Lee and Lu Wang"}
          </p>
        </Link>

        <aside className="relative h-[196px] overflow-hidden rounded-[10px] border border-border lg:mt-0 bg-muted/30">
          {slotMode === "script" ? (
            <div className="absolute inset-0 flex items-center justify-center p-2">
              <ScriptAdRenderer code={slotScript} />
            </div>
          ) : (
            slides.map((s, i) => (
              <a
                key={s.id}
                href={s.href || "#"}
                aria-hidden={i !== slideIdx}
                className="absolute inset-0 block transition-opacity duration-300"
                style={{ opacity: i === slideIdx ? 1 : 0, pointerEvents: i === slideIdx ? "auto" : "none" }}
              >
                <img src={s.image} alt="" loading="lazy" decoding="async" className="h-full w-full object-cover" />
              </a>
            ))
          )}
        </aside>

      </div>

      <div className="mt-3 grid gap-8 border-t border-border pt-3 lg:grid-cols-[minmax(585px,1.62fr)_minmax(240px,0.7fr)_minmax(300px,0.86fr)]">
        <Link to="/news/$slug" params={{ slug: p1?.slug || "a-600-billion-experiment-kicks-off-at-the-biggest-us-pension-fund" }} className="group block">
          <div className="grid gap-4 md:grid-cols-[194px_1fr]">
            <img
              src={p1 ? getArticleImage(p1.featuredImage, 1) : pensionImg}
              alt="Pension Fund"
              loading="lazy"
              decoding="async"
              className="h-[130px] w-full object-cover md:w-[194px]"
            />
            <div>
              <p className="font-sans text-[28px] font-extrabold leading-[1.16] tracking-normal text-foreground group-hover:underline line-clamp-2">
                {p1 ? p1.title : "A $600 Billion Experiment Kicks Off at the Biggest US Pension Fund"}
              </p>
              <p className="mt-2 max-w-[430px] font-sans text-[16px] leading-[1.12] text-foreground line-clamp-4">
                {p1 ? (p1.excerpt || p1.content?.replace(/<[^>]*>/g, '').slice(0, 150) + "...") : "CalPERS investment chief Stephen Gilmore wants to break down walls between asset classes with a “total portfolio” approach, blending stocks, bonds, private equity and real assets into a single risk budget designed to lift returns for nearly two million members."}
              </p>
            </div>
          </div>
        </Link>

        <Link to="/news/$slug" params={{ slug: p2?.slug || "h-1b-crackdown-on-indian-workers-erodes-a-texas-real-estate-boom" }} className="group block">
          <p className="font-sans text-[16px] leading-none text-foreground">{p2 ? p2.category : "The Big Take"}</p>
          <p className="mt-1 font-sans text-[17px] font-medium leading-[1.18] tracking-normal text-foreground group-hover:underline line-clamp-3">
            {p2 ? p2.title : "H-1B Crackdown on Indian Workers Erodes a Texas Real Estate Boom"}
          </p>
          <p className="mt-2 font-sans text-[16px] leading-[1.15] text-foreground line-clamp-3">
            {p2 ? (p2.excerpt || p2.content?.replace(/<[^>]*>/g, '').slice(0, 150) + "...") : "Skilled professionals who helped transform a booming Texas region into a tech and housing magnet now face deportation as visa renewals stall, leaving builders, lenders and landlords bracing for a sudden cooldown in some of the state's hottest suburban markets."}
          </p>
        </Link>

        <Link to="/news/$slug" params={{ slug: p3?.slug || "europe-fights-to-loosen-america-s-iron-grip-on-global-payment-systems" }} className="group block">
          <p className="font-sans text-[17px] font-extrabold leading-[1.18] tracking-normal text-foreground group-hover:underline line-clamp-2">
            {p3 ? p3.title : "Europe Fights to Loosen America’s Iron Grip on Global Payment Systems"}
          </p>
          <p className="mt-2 font-sans text-[16px] leading-[1.15] text-foreground line-clamp-5">
            {p3 ? (p3.excerpt || p3.content?.replace(/<[^>]*>/g, '').slice(0, 150) + "...") : "Concerns over economic sovereignty and the weaponization of cross-border finance are fueling a continent-wide search for homegrown alternatives to Visa and Mastercard, with central banks, fintechs and regulators racing to build a rival network."}
          </p>
        </Link>
      </div>
    </section>
  );
}
