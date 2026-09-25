import { useState, useRef, useMemo, lazy, Suspense } from "react";
import {
  Play,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Sparkles,
} from "lucide-react";
import { grid, top, lead, viewsFor } from "@/lib/news-data";
import { Views } from "./Views";
import { useHomepageConfig } from "@/hooks/use-homepage-config";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAdSettings } from "./AdSettingsContext";
import { loadAds, injectReelAds } from "@/lib/site-content";
import { Link } from "@tanstack/react-router";
import type { WatchItem } from "./ReelViewerModal";

const ReelViewerModal = lazy(() => import("./ReelViewerModal"));

const watchItems: WatchItem[] = [
  {
    title: "Where to Invest 10 Lakh Rupees Amid a Fragile Recovery",
    duration: "1:08",
    img: grid[0].img,
    kicker: null,
    embedSrc:
      "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0&modestbranding=1&playsinline=1",
  },
  {
    title: "Iran's Leaders Are in No Hurry to Get a Peace Deal",
    duration: "1:16",
    img: top[0].img,
    kicker: null,
    embedSrc:
      "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0&modestbranding=1&playsinline=1",
  },
  {
    title: "A Heartless Supreme Court Decision",
    duration: "2:12",
    img: grid[1].img,
    kicker: "Opinion",
    embedSrc:
      "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0&modestbranding=1&playsinline=1",
  },
  {
    title: "Apple's Sweeping Price Hikes Hit iPads and Macs",
    duration: "1:21",
    img: grid[2].img,
    kicker: null,
    embedSrc:
      "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0&modestbranding=1&playsinline=1",
  },
  {
    title: "How the 1994 World Cup Changed the Business of Football Forever",
    duration: "1:39",
    img: lead.img,
    kicker: null,
    embedSrc:
      "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0&modestbranding=1&playsinline=1",
  },
  {
    title: "Tesla's New Factory Sparks Environmental Concerns",
    duration: "2:45",
    img: top[1].img,
    kicker: "Tech",
    embedSrc:
      "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0&modestbranding=1&playsinline=1",
  },
  {
    title: "The Rise of AI in Modern Healthcare",
    duration: "1:55",
    img: grid[0].img,
    kicker: "Health",
    embedSrc:
      "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0&modestbranding=1&playsinline=1",
  },
  {
    title: "Global Supply Chain Disruptions Continue to Plague Retailers",
    duration: "3:10",
    img: grid[1].img,
    kicker: "Business",
    embedSrc:
      "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0&modestbranding=1&playsinline=1",
  },
];


export function Columnists({ hideTitle }: { hideTitle?: boolean } = {}) {
  const cfg = useHomepageConfig();
  const adCtx = useAdSettings();
  const [activeReelIndex, setActiveReelIndex] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const isMobile = useIsMobile();
  const reelAds = useMemo(() => {
    return adCtx?.adConfig?.slots?.["reel_ads"] || loadAds("reel_ads");
  }, [adCtx?.adConfig?.slots]);

  const displayItems = useMemo(() => {
    return injectReelAds(watchItems, reelAds, isMobile ? { firstAfter: 1, interval: 2 } : 3);
  }, [reelAds, isMobile]);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.clientWidth * 0.75;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="border-t border-border pt-3 pb-1 md:py-10">
      {/* Header bar visible on mobile and desktop */}
      <div className="flex items-center justify-between mb-2 md:mb-0">
        <h2
          className="font-bold text-sm md:text-base"
          style={{ color: cfg.watch.color, fontSize: `${cfg.watch.fontSize}px` }}
        >
          {cfg.watch.title}
        </h2>
        <Link
          to="/reels"
          className="rounded-full border border-border px-3 md:px-4 py-1 md:py-1.5 text-[11px] md:text-xs font-semibold text-foreground transition hover:bg-foreground hover:text-background"
        >
          Explore More
        </Link>
      </div>

      <div
        ref={scrollRef}
        className="mt-0 md:mt-6 flex overflow-x-auto gap-2 pb-3 snap-x snap-mandatory scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden md:gap-4 md:pb-3"
      >
        {displayItems.map((item, index) => {
          if (item.isAd) {
            const ad = item.ad;
            const adImg = ad.imagePortrait || ad.imageLandscape || ad.image;
            const adHref = ad.href || "#";
            const isGenericLabel =
              !ad.label ||
              /^(sponsored|sponsor|ad|ads|advertisement|sponsored ad)$/i.test(ad.label.trim());
            return (
              <div
                key={`reel-ad-${index}`}
                className="group block shrink-0 snap-start w-[27%] sm:w-[45%] md:w-[31%] lg:w-[calc(20%-0.8rem)]"
              >
                <a
                  href={adHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block relative aspect-[9/16] overflow-hidden rounded-xl bg-black border border-amber-500/40 shadow-sm transition duration-500 hover:scale-[1.02] hover:border-amber-400 group/ad"
                >
                  <img
                    src={adImg}
                    alt={ad.label || "Sponsored Ad"}
                    loading="lazy"
                    fetchPriority="low"
                    decoding="async"
                    sizes="(max-width: 768px) 27vw, 150px"
                    width={270}
                    height={480}
                    className="h-full w-full object-cover transition duration-500 group-hover/ad:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  {/* Visit button: reduced size */}
                  <div className="absolute bottom-1.5 left-1.5 right-1.5 md:bottom-2.5 md:left-2.5 md:right-2.5 flex items-center justify-between">
                    <span className="inline-flex items-center gap-0.5 text-[7px] sm:text-[8px] md:text-[9.5px] font-semibold text-white/90 bg-black/50 backdrop-blur-md px-1.5 py-0.5 md:px-2 md:py-0.5 rounded-full border border-white/20 group-hover/ad:bg-amber-500 group-hover/ad:text-black group-hover/ad:border-amber-400 transition-colors leading-none">
                      <span>Visit</span>
                      <ExternalLink className="h-1.5 w-1.5 md:h-2 md:w-2 shrink-0" />
                    </span>
                  </div>
                </a>

                {/* Sponsored text BELOW the ad */}
                <div className="mt-1.5 flex items-center gap-1 text-[10px] md:text-[11px] font-semibold text-amber-800 dark:text-amber-400 truncate">
                  <Sparkles className="h-2.5 w-2.5 shrink-0" />
                  <span>Sponsored</span>
                  {!isGenericLabel && (
                    <span className="text-muted-foreground font-normal ml-0.5 truncate">
                      · {ad.label}
                    </span>
                  )}
                </div>
              </div>
            );
          }

          const v = item.item;
          const reelIdx = item.originalIndex;
          return (
            <div
              key={v.title + index}
              onClick={() => setActiveReelIndex(reelIdx)}
              className="group block shrink-0 snap-start cursor-pointer w-[27%] sm:w-[45%] md:w-[31%] lg:w-[calc(20%-0.8rem)]"
            >
              <div className="relative aspect-[9/16] overflow-hidden rounded-xl bg-black border border-border/40 shadow-sm transition duration-500 hover:scale-[1.02]">
                <img
                  src={v.img}
                  alt={v.title}
                  loading="lazy"
                  fetchPriority="low"
                  decoding="async"
                  sizes="(max-width: 768px) 27vw, 150px"
                  width={270}
                  height={480}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {v.kicker && (
                  <span className="absolute left-2.5 top-2.5 bg-[#1d4ed8] px-2 py-0.5 text-[10px] font-bold text-white rounded">
                    {v.kicker}
                  </span>
                )}

                {/* Title: Completely hidden when hideTitle is set or on mobile devices (< md) */}
                {!hideTitle && (
                  <div className="hidden md:block">
                    <h3 className="absolute bottom-11 left-2.5 right-2.5 text-xs font-bold leading-tight text-white drop-shadow line-clamp-2">
                      {v.title}
                    </h3>
                  </div>
                )}

                <div className="absolute bottom-1.5 left-1.5 md:bottom-2.5 md:left-2.5 flex items-center gap-1 md:gap-1.5">
                  <span className="flex h-5 w-5 md:h-7 md:w-7 items-center justify-center rounded-full bg-white/95 text-black shadow transition-transform group-hover:scale-110">
                    <Play className="h-2.5 w-2.5 md:h-3 md:w-3 fill-current ml-0.5" />
                  </span>
                  <span className="text-[9px] md:text-xs font-semibold text-white drop-shadow">{v.duration}</span>
                </div>
              </div>
              <Views
                count={viewsFor(v.title)}
                className="mt-1.5 text-[11px] text-muted-foreground"
              />
            </div>
          );
        })}
      </div>

      {/* Render Fullscreen Reel Viewer Modal */}
      {activeReelIndex !== null && (
        <Suspense fallback={null}>
          <ReelViewerModal
            initialIndex={activeReelIndex}
            items={watchItems}
            onClose={() => setActiveReelIndex(null)}
          />
        </Suspense>
      )}

      <div className="hidden md:flex mt-5 items-center justify-between">
        <div className="flex-1" />
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-foreground" />
          <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/40" />
        </div>
        <div className="flex flex-1 justify-end gap-2">
          <button
            type="button"
            onClick={() => scroll("left")}
            aria-label="Previous"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-foreground transition hover:bg-foreground hover:text-background"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => scroll("right")}
            aria-label="Next"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-foreground transition hover:bg-foreground hover:text-background"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
