import { useEffect, useRef, useState } from "react";
import { ScriptAdRenderer } from "./ScriptAdRenderer";
import { useAdSettings } from "./AdSettingsContext";
import { currentRoleSeesPopups } from "@/lib/roles";
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

  const initialMode = slot && ctx?.adConfig ? (ctx.adConfig.modes[slot] || "image") : (slot ? loadAdSlotMode(slot) : "image");
  const initialScript = slot && ctx?.adConfig ? (ctx.adConfig.scripts[slot] || "") : (slot ? loadAdSlotScript(slot) : "");
  const initialSlides = slot && ctx?.adConfig ? (ctx.adConfig.slots[slot] || []) : (slot ? loadAds(slot) : []);
  const initialInterval = slot && ctx?.adConfig ? ((ctx.adConfig.rotations[slot] || 5) * 1000) : (slot ? loadAdRotation(slot) * 1000 : 4000);

  const [slotMode, setSlotMode] = useState<AdSlotMode>(initialMode);
  const [slotScript, setSlotScript] = useState(initialScript);
  const [dbSlides, setDbSlides] = useState<AdSlideItem[]>(initialSlides);
  const [dbInterval, setDbInterval] = useState(initialInterval);

  useEffect(() => {
    if (slot && ctx?.adConfig) {
      setSlotMode(ctx.adConfig.modes[slot] || "image");
      setSlotScript(ctx.adConfig.scripts[slot] || "");
      setDbSlides(ctx.adConfig.slots[slot] || []);
      setDbInterval((ctx.adConfig.rotations[slot] || 5) * 1000);
    }
  }, [slot, ctx?.adConfig]);

  useEffect(() => {
    if (!slot) return;
    const sync = () => {
      setSlotMode(loadAdSlotMode(slot));
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
      : dbSlides.map((s) => ({ image: s.image, href: s.href }))
    : slides && slides.length > 0
      ? slides
      : image || video
        ? [{ image, video, poster, href }]
        : [];

  const finalInterval = slot ? dbInterval : intervalMs;

  const [canSeeAds, setCanSeeAds] = useState(true);
  useEffect(() => {
    setCanSeeAds(currentRoleSeesPopups());
  }, []);



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
    const io = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.1 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const hasScriptAd = slotMode === "script" || items.some((s) => s.type === "script" || !!s.scriptCode);

  useEffect(() => {
    if (items.length <= 1 || !visible || hasScriptAd) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % items.length);
    }, finalInterval);
    return () => clearInterval(id);
  }, [items.length, finalInterval, visible, hasScriptAd]);

  const currentItem = items[index];
  const isScriptAd = slotMode === "script" || currentItem?.type === "script" || !!currentItem?.scriptCode;

  if (!canSeeAds) return null;

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
            {items.length === 0 ? (
              <div className="absolute inset-0 grid place-items-center text-xs uppercase tracking-widest text-muted-foreground">
                Your Ad Here
              </div>
            ) : (
              items.map((s, i) => (
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
                    <img
                      src={s.image}
                      alt="Advertisement"
                      loading="lazy"
                      className="h-full w-full object-contain"
                    />
                  ) : null}
                </div>
              ))
            )}

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
                <h4 className="headline text-base leading-snug text-foreground group-hover:underline">
                  {title}
                </h4>
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
