import React from "react";
import { Link } from "@tanstack/react-router";
import { MinRead } from "../HeadlineArticle";
import { formatViews, getArticleImage } from "@/lib/news-data";
import { useAdSettings, useSiteSettings } from "@/components/site/AdSettingsContext";
import {
  loadAds,
  loadAdSlotMode,
  loadAdSlotScript,
  isEnterprisePlusLicense,
  type AdSlideItem,
} from "@/lib/site-content";

const LiveVideo = React.lazy(() =>
  import("../LiveVideo").then((m) => ({ default: m.LiveVideo })),
);

const HeroFeaturedSlider = React.lazy(() =>
  import("./HeroFeaturedSlider").then((m) => ({ default: m.default })),
);

const isRealAd = (ad: AdSlideItem) => {
  const img = ad?.imageLandscape || ad?.image || ad?.imagePortrait || "";
  return !!img && !img.includes("placehold.co");
};

export function HeroMain({ activeLeads, cfg }: any) {
  const ctx = useAdSettings();
  const siteSettings = useSiteSettings();
  const isEnterprisePlus = isEnterprisePlusLicense(siteSettings || ctx?.settings);

  const configSlides = ctx?.adConfig?.slots?.hero_showcase;
  const initialAds =
    isEnterprisePlus && configSlides && configSlides.length > 0
      ? configSlides.filter(isRealAd)
      : [];

  const [featuredAds, setFeaturedAds] = React.useState<AdSlideItem[]>(initialAds);
  const [featuredAdMode, setFeaturedAdMode] = React.useState(
    ctx?.adConfig?.modes?.hero_showcase || "image",
  );
  const [featuredAdScript, setFeaturedAdScript] = React.useState(
    ctx?.adConfig?.scripts?.hero_showcase || "",
  );

  React.useEffect(() => {
    if (!isEnterprisePlus) {
      setFeaturedAds([]);
      return;
    }
    if (ctx?.adConfig) {
      const s = ctx.adConfig.slots?.hero_showcase;
      if (s && s.length > 0) {
        setFeaturedAds(s.filter(isRealAd));
      } else {
        const local = loadAds("hero_showcase");
        setFeaturedAds(local && local.length > 0 ? local.filter(isRealAd) : []);
      }
      setFeaturedAdMode(ctx.adConfig.modes?.hero_showcase || "image");
      setFeaturedAdScript(ctx.adConfig.scripts?.hero_showcase || "");
    }
  }, [ctx?.adConfig, isEnterprisePlus]);

  React.useEffect(() => {
    if (!isEnterprisePlus) return;
    const sync = () => {
      const local = loadAds("hero_showcase");
      if (local && local.length > 0) {
        setFeaturedAds(local.filter(isRealAd));
      } else if (ctx?.adConfig?.slots?.hero_showcase && ctx.adConfig.slots.hero_showcase.length > 0) {
        setFeaturedAds(ctx.adConfig.slots.hero_showcase.filter(isRealAd));
      } else {
        setFeaturedAds([]);
      }
      setFeaturedAdMode(loadAdSlotMode("hero_showcase"));
      setFeaturedAdScript(loadAdSlotScript("hero_showcase"));
    };
    window.addEventListener("nt:ads-updated", sync);
    return () => window.removeEventListener("nt:ads-updated", sync);
  }, [ctx?.adConfig, isEnterprisePlus]);

  const showMultiple = cfg?.heroFeatured?.showMultiple !== false;
  const autoSlide = cfg?.heroFeatured?.autoSlide !== false;
  const slideInterval = (cfg?.heroFeatured?.slideInterval ?? 5) * 1000;

  const allLeads = activeLeads || [];
  const leads = showMultiple ? allLeads : allLeads.slice(0, 1);
  const featured = leads[0];

  const hasMultipleItems = showMultiple && (leads.length > 1 || featuredAds.length > 0);

  const renderSingleLead = () => {
    if (!featured) return null;
    return (
      <Link to="/news/$slug" params={{ slug: featured.slug || "sample" }} className="group block">
        <div className="overflow-hidden relative rounded-xl border border-border/40 bg-black/5 dark:bg-black/30 flex items-center justify-center">
          <img
            src={featured.img}
            alt=""
            aria-hidden="true"
            loading="eager"
            fetchPriority="high"
            decoding="sync"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 800px"
            width={800}
            height={500}
            onError={(e) => {
              const el = e.currentTarget;
              el.onerror = null;
              el.src = getArticleImage(undefined, 0);
            }}
            className="w-full h-auto max-h-[480px] object-contain object-center transition-transform duration-500 group-hover:scale-[1.02]"
          />
        </div>
        <h2 className="headline mt-3 text-xl font-bold text-foreground group-hover:underline md:mt-4 md:text-3xl">
          {featured.title}
        </h2>
        <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
          {featured.dek ?? featured.excerpt ?? ""}
        </p>

        <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-wider text-muted-foreground md:hidden">
          <span>{featured.author}</span>
          <span>&bull;</span>
          <span className="inline-flex items-center gap-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-3 w-3"
            >
              <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
            {formatViews(Number(featured.views) || 0)} views
          </span>
          <span>&bull;</span>
          <span className="font-bold text-foreground">{featured.kicker || "Featured"}</span>
        </div>

        <div className="hidden md:block">
          <MinRead
            seed={featured.title}
            kicker={featured.kicker || "Featured"}
            author={featured.author}
            views={featured.views}
          />
        </div>
      </Link>
    );
  };

  return (
    <div className="flex flex-col gap-8 lg:col-span-8 lg:border-l lg:border-border lg:pl-8 w-full max-w-full min-w-0 overflow-hidden">
      <article className="w-full max-w-full min-w-0 overflow-hidden">
        {hasMultipleItems ? (
          <React.Suspense fallback={renderSingleLead()}>
            <HeroFeaturedSlider
              leads={leads}
              featuredAds={featuredAds}
              featuredAdMode={featuredAdMode}
              featuredAdScript={featuredAdScript}
              showMultiple={showMultiple}
              autoSlide={autoSlide}
              slideInterval={slideInterval}
              isEnterprisePlus={isEnterprisePlus}
            />
          </React.Suspense>
        ) : (
          renderSingleLead()
        )}
      </article>
      <div>
        <React.Suspense fallback={null}>
          <LiveVideo />
        </React.Suspense>
      </div>
    </div>
  );
}
