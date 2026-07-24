import { useEffect, useState } from "react";
import { X } from "lucide-react";
import {
  loadAds,
  loadAdRotation,
  loadAdSlotMode,
  loadAdSlotScript,
  type AdSlideItem,
  type AdSlotMode,
} from "@/lib/site-content";
import { currentRoleSeesPopups } from "@/lib/roles";
import { useIsMobile } from "@/hooks/use-mobile";
import { ScriptAdRenderer } from "./ScriptAdRenderer";

const OPEN_DELAY_MS = 7000; // show 7s after mount
const CLOSE_DELAY_MS = 6000; // close button enables 6s after popup appears

import { useAdSettings } from "./AdSettingsContext";

export function PopupAd() {
  const isMobile = useIsMobile();
  const ctx = useAdSettings();
  const [open, setOpen] = useState(false);
  const [canClose, setCanClose] = useState(false);
  const [ads, setAds] = useState<AdSlideItem[]>([]);
  const [idx, setIdx] = useState(0);

  const initialMode = ctx?.adConfig ? (ctx.adConfig.modes["popup"] || "image") : loadAdSlotMode("popup");
  const initialScript = ctx?.adConfig ? (ctx.adConfig.scripts["popup"] || "") : loadAdSlotScript("popup");
  const initialRotation = ctx?.adConfig ? (ctx.adConfig.rotations["popup"] || 6) : loadAdRotation("popup");

  const [slotMode, setSlotMode] = useState<AdSlotMode>(initialMode);
  const [slotScript, setSlotScript] = useState(initialScript);
  const [dbRotation, setDbRotation] = useState(initialRotation);

  useEffect(() => {
    if (ctx?.adConfig) {
      setSlotMode(ctx.adConfig.modes["popup"] || "image");
      setSlotScript(ctx.adConfig.scripts["popup"] || "");
      setDbRotation(ctx.adConfig.rotations["popup"] || 6);
    }
  }, [ctx?.adConfig]);

  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    const handleSearchState = (e: any) => {
      const isOpen = Boolean(e.detail?.open);
      setIsSearchOpen(isOpen);
      if (isOpen) {
        setOpen(false); // Instantly close popup ad when search opens
      }
    };
    window.addEventListener("nt:search-modal-state", handleSearchState);
    return () => window.removeEventListener("nt:search-modal-state", handleSearchState);
  }, []);

  useEffect(() => {
    if (!currentRoleSeesPopups()) return;
    if (isSearchOpen || typeof document !== "undefined" && document.body.classList.contains("search-modal-open")) return;
    const mode = ctx?.adConfig ? (ctx.adConfig.modes["popup"] || "image") : loadAdSlotMode("popup");
    const script = ctx?.adConfig ? (ctx.adConfig.scripts["popup"] || "") : loadAdSlotScript("popup");

    if (mode === "script" && (!script || script.trim().length === 0)) return;

    const all = (ctx?.adConfig ? (ctx.adConfig.slots["popup"] || []) : loadAds("popup")).filter((a) => !!a.image);
    if (mode === "image" && all.length === 0) return;

    const want: "portrait" | "landscape" = isMobile ? "portrait" : "landscape";
    const matching = all.filter((a) => a.orientation === want);
    const untagged = all.filter((a) => !a.orientation);
    const list = matching.length > 0 ? matching : untagged.length > 0 ? untagged : all;

    const openTimer = window.setTimeout(() => {
      if (!document.body.classList.contains("search-modal-open")) {
        setAds(list);
        setOpen(true);
      }
    }, OPEN_DELAY_MS);

    return () => window.clearTimeout(openTimer);
  }, [isMobile, ctx?.adConfig, isSearchOpen]);

  // Enable close button after CLOSE_DELAY_MS once visible
  useEffect(() => {
    if (!open) return;
    const t = window.setTimeout(() => setCanClose(true), CLOSE_DELAY_MS);
    return () => window.clearTimeout(t);
  }, [open]);

  // Rotate through images at admin-configured interval
  useEffect(() => {
    if (!open || ads.length < 2 || slotMode === "script") return;
    const i = window.setInterval(
      () => setIdx((v) => (v + 1) % ads.length),
      Math.max(1, dbRotation) * 1000,
    );
    return () => window.clearInterval(i);
  }, [open, ads.length, slotMode, dbRotation]);

  if (!open) return null;
  if (slotMode === "image" && ads.length === 0) return null;
  const ad = ads[idx] ?? ads[0];

  const frameClass = isMobile
    ? "w-[88vw] max-w-sm aspect-[3/4]"
    : "w-[min(900px,80vw)] aspect-[16/9]";

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Advertisement"
      className="fixed inset-0 z-[100] grid place-items-center bg-black/70 p-4 animate-in fade-in duration-300"
    >
      <div className={`relative ${frameClass} overflow-hidden rounded-lg bg-black shadow-2xl flex items-center justify-center`}>
        {slotMode === "script" ? (
          <div className="w-full h-full p-2 bg-slate-950 flex items-center justify-center overflow-auto">
            <ScriptAdRenderer code={slotScript} />
          </div>
        ) : (
          ad && (
            <a href={ad.href || "#"} target="_blank" rel="noopener noreferrer" className="block h-full w-full">
              <img
                key={ad.id}
                src={ad.image}
                alt={ad.label ?? "Advertisement"}
                className="h-full w-full object-cover animate-in fade-in duration-500"
              />
            </a>
          )
        )}

        <span className="absolute left-2 top-2 rounded bg-black/60 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-white">
          {(slotMode === "image" && ad?.label) ? ad.label : "Sponsored"}
        </span>

        {slotMode === "image" && ads.length > 1 && (
          <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1.5">
            {ads.map((_, i) => (
              <span
                key={i}
                className={`h-1.5 w-1.5 rounded-full transition ${
                  i === idx ? "bg-white" : "bg-white/40"
                }`}
              />
            ))}
          </div>
        )}

        <button
          type="button"
          onClick={() => canClose && setOpen(false)}
          disabled={!canClose}
          aria-label={canClose ? "Close advertisement" : "Close available shortly"}
          className={`absolute right-2 top-2 grid h-9 w-9 place-items-center rounded-full text-white shadow-lg transition ${
            canClose
              ? "bg-black/80 hover:bg-black cursor-pointer"
              : "bg-black/40 cursor-not-allowed"
          }`}
        >
          {canClose ? <X className="h-4 w-4" /> : <CountdownDot />}
        </button>
      </div>
    </div>
  );
}

function CountdownDot() {
  const [s, setS] = useState(CLOSE_DELAY_MS / 1000);
  useEffect(() => {
    const i = window.setInterval(() => setS((v) => Math.max(0, v - 1)), 1000);
    return () => window.clearInterval(i);
  }, []);
  return <span className="text-[11px] font-bold tabular-nums">{s}</span>;
}

export default PopupAd;
