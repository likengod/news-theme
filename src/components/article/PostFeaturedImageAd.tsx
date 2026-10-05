import React, { useEffect, useState } from "react";
import { X, ArrowRight } from "lucide-react";
import { useAdSettings } from "@/components/site/AdSettingsContext";
import { ScriptAdRenderer } from "@/components/site/ScriptAdRenderer";
import {
  loadAds,
  loadAdSlotMode,
  loadAdSlotScript,
  loadAdRotation,
  defaultAdSlidesPostAds,
  type AdSlideItem,
  type AdSlotMode,
} from "@/lib/site-content";

export function PostFeaturedImageAd() {
  const ctx = useAdSettings();
  const [dismissed, setDismissed] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Load slot mode & script
  const slotMode: AdSlotMode =
    ctx?.adConfig?.modes?.post_ads ??
    (typeof window !== "undefined" ? loadAdSlotMode("post_ads") : "image");

  const slotScript =
    ctx?.adConfig?.scripts?.post_ads ??
    (typeof window !== "undefined" ? loadAdSlotScript("post_ads") : "");

  // Load custom ad slides
  const configSlides = ctx?.adConfig?.slots?.post_ads;
  const initialSlides =
    configSlides && configSlides.length > 0
      ? configSlides
      : typeof window !== "undefined"
        ? loadAds("post_ads")
        : defaultAdSlidesPostAds;

  const [slides, setSlides] = useState<AdSlideItem[]>(initialSlides || defaultAdSlidesPostAds);

  // Live reload on ads update event
  useEffect(() => {
    const handleUpdate = () => {
      const fresh = loadAds("post_ads");
      if (fresh && fresh.length > 0) {
        setSlides(fresh);
      }
    };
    window.addEventListener("nt:ads-updated", handleUpdate);
    return () => window.removeEventListener("nt:ads-updated", handleUpdate);
  }, []);

  // Filter valid image ads
  const validAds = slides.filter(
    (ad) => !!(ad.image || ad.imagePortrait || ad.imageLandscape),
  );

  // Sort featured ads first
  const sortedAds = [...validAds].sort(
    (a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0),
  );

  const rotationSec =
    ctx?.adConfig?.rotations?.post_ads ??
    (typeof window !== "undefined" ? loadAdRotation("post_ads") : 5);

  useEffect(() => {
    if (sortedAds.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % sortedAds.length);
    }, Math.max(2, rotationSec) * 1000);
    return () => clearInterval(interval);
  }, [sortedAds.length, rotationSec]);

  if (dismissed) return null;

  // 1. Script / 3rd Party Ad Mode (e.g. Google AdSense)
  if (slotMode === "script") {
    if (!slotScript || !slotScript.trim()) return null;
    return (
      <div className="absolute bottom-2 left-2 right-2 sm:bottom-3 sm:left-4 sm:right-4 z-20 transition-all duration-300">
        <div className="relative rounded-xl border border-slate-200/90 bg-white/95 backdrop-blur-md p-2 shadow-xl">
          {/* Dismiss button */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setDismissed(true);
            }}
            title="Close ad"
            aria-label="Close ad"
            className="absolute -top-2.5 -right-2.5 z-30 flex h-6 w-6 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-600 shadow-md transition hover:bg-slate-100 hover:text-slate-900"
          >
            <X className="h-3.5 w-3.5" />
          </button>
          <div className="w-full flex items-center justify-center overflow-hidden min-h-[50px] sm:min-h-[90px]">
            <ScriptAdRenderer code={slotScript} />
          </div>
        </div>
      </div>
    );
  }

  // 2. Custom Ad Mode
  if (sortedAds.length === 0) return null;

  const currentAd = sortedAds[currentIndex % sortedAds.length];
  const headline = currentAd.headline || currentAd.label || "Exclusive Partner Offer";
  const sponsor = currentAd.sponsor || (currentAd.headline ? currentAd.label : "Sponsored");
  const mobileImage = currentAd.imagePortrait || currentAd.image;
  const desktopImage = currentAd.imageLandscape || currentAd.image;

  return (
    <div className="absolute bottom-2 left-2 right-2 sm:bottom-3 sm:left-4 sm:right-4 z-20 transition-all duration-300">
      <div className="group/ad relative overflow-hidden rounded-xl border border-slate-200/90 bg-white/95 backdrop-blur-md shadow-xl transition-all hover:bg-white hover:shadow-2xl">
        {/* Dismiss button (X) pinned at top-right */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setDismissed(true);
          }}
          title="Close ad"
          aria-label="Close ad"
          className="absolute top-1.5 right-1.5 z-30 flex h-5 w-5 sm:h-6 sm:w-6 items-center justify-center rounded-md border border-slate-200 bg-white/90 text-slate-500 shadow-2xs transition hover:bg-slate-100 hover:text-slate-900"
        >
          <X className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
        </button>

        <a
          href={currentAd.href || "#"}
          target={currentAd.href && currentAd.href !== "#" ? "_blank" : undefined}
          rel="noopener noreferrer"
          className="flex items-center gap-3 sm:gap-4 p-2 sm:p-2.5 pr-8 sm:pr-10 text-left transition"
        >
          {/* Ad Image / Graphic: Mobile image on small screens, Desktop image on larger screens */}
          <div className="shrink-0 overflow-hidden rounded-lg bg-slate-100 border border-slate-100 flex items-center justify-center">
            {/* Mobile View Image */}
            {mobileImage && (
              <img
                src={mobileImage}
                alt={sponsor || headline}
                className="block sm:hidden h-12 w-20 max-w-[80px] object-cover"
                loading="eager"
              />
            )}
            {/* Desktop View Image */}
            {desktopImage && (
              <img
                src={desktopImage}
                alt={sponsor || headline}
                className="hidden sm:block h-14 w-28 max-w-[112px] md:h-16 md:w-32 md:max-w-[128px] object-cover"
                loading="eager"
              />
            )}
          </div>

          {/* Headline & Sponsor Branding */}
          <div className="flex-1 min-w-0 flex flex-col justify-center">
            <h4 className="text-xs sm:text-sm md:text-[15px] font-bold text-slate-900 leading-tight sm:leading-snug line-clamp-2 group-hover/ad:text-indigo-600 transition-colors">
              {headline}
            </h4>
            <div className="mt-0.5 sm:mt-1 flex items-center gap-1.5">
              <span className="text-[10px] sm:text-xs font-semibold text-slate-600 truncate">
                {sponsor}
              </span>
              <span className="rounded bg-slate-100 px-1 py-0.2 text-[8.5px] sm:text-[9.5px] font-bold uppercase tracking-wider text-slate-500 border border-slate-200">
                Ad
              </span>
            </div>
          </div>

          {/* Circular Black Right Arrow CTA button (matches reference image) */}
          <div className="shrink-0 flex items-center justify-center">
            <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-black text-white shadow-xs group-hover/ad:bg-slate-800 group-hover/ad:scale-105 transition-all">
              <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-white" />
            </div>
          </div>
        </a>
      </div>
    </div>
  );
}
