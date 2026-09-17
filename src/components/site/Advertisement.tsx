import { useEffect, useRef, useState } from "react";
import { ScriptAdRenderer } from "./ScriptAdRenderer";
import { useAdSettings, useSiteSettings } from "./AdSettingsContext";
import {
  loadAds,
  loadAdRotation,
  loadAdSlotMode,
  loadAdSlotScript,
  type AdSlot,
  type AdSlotMode,
  type AdSlideItem,
} from "@/lib/site-content";

export type AdSlide = {
  type?: "image" | "script";
  scriptCode?: string;
  image?: string;
  video?: string;
  poster?: string;
  href?: string;
};

type AdProps = {
  slot?: AdSlot;
  href?: string;
  label?: string;
  image?: string;
  video?: string;
  poster?: string;
  title?: string;
  caption?: string;
  slides?: AdSlide[];
  /** Interval between slides in ms. Default 4000. */
  intervalMs?: number;
  /** CSS aspect-ratio value. Default "3 / 4". */
  aspectRatio?: string;
};

export default function Advertisement({
  slot,
  href = "#",
  label = "Sponsored",
  image,
  video,
  poster,
  title,
  caption,
  slides,
  intervalMs = 4000,
  aspectRatio = "3 / 4",
}: AdProps) {
  const ctx = useAdSettings();

  const s = useSiteSettings();
  const planType = (s?.licenseType || "").toLowerCase();
  const isEnterprise = planType.includes("enterprise");

  let initialMode =
    slot && ctx?.adConfig
      ? ctx.adConfig.modes[slot] || "image"
      : slot
        ? loadAdSlotMode(slot)
        : "image";

  if (slot === "leaderboard" && !isEnterprise) {
    initialMode = "script";
  }

  const initialScript =
    slot && ctx?.adConfig ? ctx.adConfig.scripts[slot] || "" : slot ? loadAdSlotScript(slot) : "";
  const configSlides = slot && ctx?.adConfig?.slots ? ctx.adConfig.slots[slot] : undefined;
  const initialSlides =
    configSlides && configSlides.length > 0
      ? configSlides
      : slot
        ? loadAds(slot)
        : [];
  const initialInterval =
    slot && ctx?.adConfig
      ? (ctx.adConfig.rotations[slot] || 5) * 1000
      : slot
        ? loadAdRotation(slot) * 1000
        : 4000;

  const [slotMode, setSlotMode] = useState<AdSlotMode>(initialMode);
  const [slotScript, setSlotScript] = useState(initialScript);
  const [dbSlides, setDbSlides] = useState<AdSlideItem[]>(initialSlides);
  const [dbInterval, setDbInterval] = useState(initialInterval);

  useEffect(() => {
    if (slot && ctx?.adConfig) {
      let mode = ctx.adConfig.modes[slot] || "image";
      setSlotMode(mode);
      setSlotScript(ctx.adConfig.scripts[slot] || "");
      const s = ctx.adConfig.slots[slot];
      if (s && s.length > 0) {
        setDbSlides(s);
      } else {
        setDbSlides(loadAds(slot));
      }
      setDbInterval((ctx.adConfig.rotations[slot] || 5) * 1000);
    }
  }, [slot, ctx?.adConfig]);

  useEffect(() => {
    if (!slot) return;
    const sync = () => {
      let mode = loadAdSlotMode(slot);
      setSlotMode(mode);
      setSlotScript(loadAdSlotScript(slot));
      setDbSlides(loadAds(slot));
      setDbInterval(loadAdRotation(slot) * 1000);
    };
    window.addEventListener("nt:ads-updated", sync);
    return () => window.removeEventListener("nt:ads-updated", sync);
  }, [slot]);

  const items: AdSlide[] = slot
    ? slotMode === "script"
      ? [{ type: "script", scriptCode: slotScript }]
      : dbSlides
          .map((s) => {
            let img = s.image;
            if (slot === "home1" || slot === "ad3" || slot === "popup" || slot === "reel_ads") {
              // Prioritize portrait, but gracefully fall back to primary image or landscape
              img = s.imagePortrait || s.image || s.imageLandscape || "";
            } else if (slot === "home2" || slot === "leaderboard") {
              // Prioritize landscape, but gracefully fall back to primary image or portrait
              img = s.imageLandscape || s.image || s.imagePortrait || "";
            } else {
              img = s.image || s.imagePortrait || s.imageLandscape || "";
            }
            return {
              type: s.type || (s.scriptCode ? "script" : "image"),
              scriptCode: s.scriptCode,
              image: img,
              href: s.href,
            };
          })
          .filter((s) => (s.type === "script" ? !!s.scriptCode : !!s.image))
    : slides && slides.length > 0
      ? slides
      : image || video
        ? [{ image, video, poster, href }]
        : [];

  const finalInterval = slot ? dbInterval : intervalMs;

  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(false);
  const rootRef = useRef<HTMLElement | null>(null);

  // Pause slideshow when ad is offscreen to save CPU/bandwidth.
  useEffect(() => {
    const el = rootRef.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }
    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), {
      threshold: 0.1,
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const hasScriptAd =
    slotMode === "script" || items.some((s) => s.type === "script" || !!s.scriptCode);

  useEffect(() => {
    if (items.length <= 1 || !visible || hasScriptAd) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % items.length);
    }, finalInterval);
    return () => clearInterval(id);
  }, [items.length, finalInterval, visible, hasScriptAd]);

  const currentItem = items[index];
  const isScriptAd =
    slotMode === "script" || currentItem?.type === "script" || !!currentItem?.scriptCode;

  if (items.length === 0 && !isScriptAd) return null;

  return (
    <aside ref={rootRef} aria-label="Advertisement" className="w-full">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-muted-foreground">
          Advertisement
        </span>
        <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-muted-foreground">
          {label}
        </span>
      </div>

      {isScriptAd ? (
        <div className="border border-border bg-muted/30 p-2 overflow-hidden flex items-center justify-center min-h-[160px]">
          <ScriptAdRenderer code={currentItem.scriptCode || ""} />
        </div>
      ) : (
        <a
          href={currentItem?.href ?? href}
          target="_blank"
          rel="noopener sponsored"
          className="group block border border-border bg-muted/30"
        >
          <div className="relative w-full overflow-hidden" style={{ aspectRatio }}>
            {items.map((s, i) => (
              <div
                key={i}
                className="absolute inset-0 transition-opacity duration-700 ease-in-out"
                style={{ opacity: i === index ? 1 : 0 }}
                aria-hidden={i !== index}
              >
                {s.type === "script" || s.scriptCode ? (
                  <ScriptAdRenderer code={s.scriptCode || ""} />
                ) : s.video ? (
                  <video
                    src={s.video}
                    poster={s.poster}
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="h-full w-full object-contain"
                  />
                ) : s.image ? (
                  i === index ? (
                    <img
                      src={s.image}
                      alt="Advertisement"
                      loading="lazy"
                      decoding="async"
                      className={`h-full w-full ${slot === "home1" || slot === "ad3" ? "object-cover" : "object-contain"}`}
                    />
                  ) : null
                ) : null}
              </div>
            ))}
            {items.length > 1 && (
              <div className="absolute bottom-2 left-1/2 z-10 flex -translate-x-1/2 gap-1.5">
                {items.map((_, i) => (
                  <span
                    key={i}
                    className={`h-1.5 w-1.5 rounded-full ${
                      i === index ? "bg-white" : "bg-white/50"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
          {(title || caption) && (
            <div className="p-3">
              {title && (
                <p className="headline text-base font-semibold leading-snug text-foreground group-hover:underline">
                  {title}
                </p>
              )}
              {caption && (
                <p className="mt-1 text-xs leading-snug text-muted-foreground">{caption}</p>
              )}
            </div>
          )}
        </a>
      )}
    </aside>
  );
}
