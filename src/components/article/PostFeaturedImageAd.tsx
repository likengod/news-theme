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
      <div className="absolute bottom-2 inset-x-2 sm:bottom-3 sm:inset-x-4 z-20 flex items-center justify-center pointer-events-auto">
        <div className="relative inline-flex max-w-full items-center justify-center overflow-hidden">
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
            className="absolute top-1 right-1 z-30 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 hover:bg-black/80 text-white backdrop-blur-xs transition"
          >
            <X className="h-3 w-3" />
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
  const altText = currentAd.label || currentAd.headline || "Advertisement";
  const mobileImage = currentAd.imagePortrait || currentAd.image;
  const desktopImage = currentAd.imageLandscape || currentAd.image;

  if (!mobileImage && !desktopImage) return null;

  return (
    <div className="absolute bottom-2 inset-x-2 sm:bottom-3 sm:inset-x-4 z-20 flex items-center justify-center pointer-events-auto">
      <div className="relative inline-flex max-w-full items-center justify-center overflow-hidden">
        {/* Dismiss button (X) */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setDismissed(true);
          }}
          title="Close ad"
          aria-label="Close ad"
          className="absolute top-1 right-1 z-30 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 hover:bg-black/80 text-white backdrop-blur-xs transition"
        >
          <X className="h-3 w-3" />
        </button>

        <a
          href={currentAd.href || "#"}
          target={currentAd.href && currentAd.href !== "#" ? "_blank" : undefined}
          rel="noopener sponsored"
          className="block max-w-full transition hover:opacity-95"
        >
          {/* Mobile View Banner */}
          {mobileImage && (
            <img
              src={mobileImage}
              alt={altText}
              className="block sm:hidden w-auto max-w-full h-auto max-h-[60px] object-contain mx-auto"
              loading="eager"
            />
          )}
          {/* Desktop View Banner */}
          {desktopImage && (
            <img
              src={desktopImage}
              alt={altText}
              className="hidden sm:block w-auto max-w-full h-auto max-h-[90px] object-contain mx-auto"
              loading="eager"
            />
          )}
        </a>
      </div>
    </div>
  );
}
