import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import {
  loadAds,
  loadAdRotation,
  loadAdSlotMode,
  loadAdSlotScript,
  loadPopupConfig,
  type AdSlideItem,
  type AdSlotMode,
  type PopupConfig,
  defaultPopupConfig,
} from "@/lib/site-content";
import { currentRoleSeesPopups } from "@/lib/roles";
import { useIsMobile } from "@/hooks/use-mobile";
import { ScriptAdRenderer } from "./ScriptAdRenderer";
import { useAdSettings } from "./AdSettingsContext";

export function PopupAd() {
  const isMobile = useIsMobile();
  const ctx = useAdSettings();
  const [open, setOpen] = useState(false);
  const [canClose, setCanClose] = useState(false);
  const [ads, setAds] = useState<AdSlideItem[]>([]);
  const [idx, setIdx] = useState(0);

  const initialMode = ctx?.adConfig
    ? ctx.adConfig.modes["popup"] || "image"
    : loadAdSlotMode("popup");
  const initialScript = ctx?.adConfig
    ? ctx.adConfig.scripts["popup"] || ""
    : loadAdSlotScript("popup");
  const initialRotation = ctx?.adConfig
    ? ctx.adConfig.rotations["popup"] || 6
    : loadAdRotation("popup");
  const initialPopupConfig: PopupConfig =
    ctx?.adConfig?.popupConfig || loadPopupConfig() || defaultPopupConfig;

  const [slotMode, setSlotMode] = useState<AdSlotMode>(initialMode);
  const [slotScript, setSlotScript] = useState(initialScript);
  const [dbRotation, setDbRotation] = useState(initialRotation);
  const [popupConfig, setPopupConfig] = useState<PopupConfig>(initialPopupConfig);

  useEffect(() => {
    if (ctx?.adConfig) {
      setSlotMode(ctx.adConfig.modes["popup"] || "image");
      setSlotScript(ctx.adConfig.scripts["popup"] || "");
      setDbRotation(ctx.adConfig.rotations["popup"] || 6);
      if (ctx.adConfig.popupConfig) {
        setPopupConfig(ctx.adConfig.popupConfig);
      }
    }
  }, [ctx?.adConfig]);

  // Listen for admin ad updates in current tab
  useEffect(() => {
    const handleUpdate = () => {
      setPopupConfig(loadPopupConfig());
      setDbRotation(loadAdRotation("popup"));
      setSlotMode(loadAdSlotMode("popup"));
      setSlotScript(loadAdSlotScript("popup"));
    };
    window.addEventListener("nt:ads-updated", handleUpdate);
    return () => window.removeEventListener("nt:ads-updated", handleUpdate);
  }, []);

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

  const openTimerRef = useRef<number | null>(null);
  const recheckTimerRef = useRef<number | null>(null);

  // Trigger popup according to popupConfig frequency and delays
  useEffect(() => {
    if (!currentRoleSeesPopups()) return;
    if (
      isSearchOpen ||
      (typeof document !== "undefined" && document.body.classList.contains("search-modal-open"))
    )
      return;

    const mode = slotMode;
    const script = slotScript;

    if (mode === "script" && (!script || script.trim().length === 0)) return;

    const all = (ctx?.adConfig ? ctx.adConfig.slots["popup"] || [] : loadAds("popup")).filter(
      (a) => !!a.image,
    );
    if (mode === "image" && all.length === 0) return;

    const want: "portrait" | "landscape" = isMobile ? "portrait" : "landscape";
    const matching = all.filter((a) => a.orientation === want);
    const untagged = all.filter((a) => !a.orientation);
    const rawList = matching.length > 0 ? matching : untagged.length > 0 ? untagged : all;

    // Sort: Featured ads show first!
    const list = [...rawList].sort((a, b) => {
      const fa = a.isFeatured ? 1 : 0;
      const fb = b.isFeatured ? 1 : 0;
      return fb - fa; // featured ads at top
    });

    const freqMin = popupConfig.frequencyMinutes ?? 10;
    const initialDelayMs = Math.max(0, popupConfig.initialDelaySeconds ?? 7) * 1000;

    // Check frequency rule
    const showPopupNow = () => {
      if (document.body.classList.contains("search-modal-open")) return;
      setAds(list);

      // Rotate to next ad on interval appearance if configured
      if (popupConfig.rotateOnInterval !== false && list.length > 1) {
        try {
          const rawLastIdx = sessionStorage.getItem("nt:popup-ad-last-idx");
          if (rawLastIdx === null) {
            // First time: show ad 0 (featured ad)
            sessionStorage.setItem("nt:popup-ad-last-idx", "0");
            setIdx(0);
          } else {
            const nextIdx = (parseInt(rawLastIdx, 10) + 1) % list.length;
            sessionStorage.setItem("nt:popup-ad-last-idx", String(nextIdx));
            setIdx(nextIdx);
          }
        } catch {
          setIdx(0);
        }
      } else {
        setIdx(0);
      }

      setOpen(true);
      try {
        localStorage.setItem("nt:popup-last-shown-ts", Date.now().toString());
        sessionStorage.setItem("nt:popup-session-shown", "1");
      } catch {}
    };

    const clearAllTimers = () => {
      if (openTimerRef.current) window.clearTimeout(openTimerRef.current);
      if (recheckTimerRef.current) window.clearTimeout(recheckTimerRef.current);
    };

    // Case 1: Once per session
    if (freqMin === -1) {
      if (sessionStorage.getItem("nt:popup-session-shown")) {
        return; // already shown this session
      }
      openTimerRef.current = window.setTimeout(showPopupNow, initialDelayMs);
      return clearAllTimers;
    }

    // Case 2: Every page load (0 minutes)
    if (freqMin === 0) {
      openTimerRef.current = window.setTimeout(showPopupNow, initialDelayMs);
      return clearAllTimers;
    }

    // Case 3: Recurring interval (e.g. 5, 10, 15, 30, 60 minutes)
    const intervalMs = freqMin * 60 * 1000;
    const lastShownTs = parseInt(localStorage.getItem("nt:popup-last-shown-ts") || "0", 10);
    const now = Date.now();
    const elapsed = now - lastShownTs;

    if (isNaN(lastShownTs) || lastShownTs === 0 || elapsed >= intervalMs) {
      // Interval has passed, show after initial delay
      openTimerRef.current = window.setTimeout(showPopupNow, initialDelayMs);
    } else {
      // Schedule to show when remaining time elapses
      const remainingMs = intervalMs - elapsed;
      recheckTimerRef.current = window.setTimeout(showPopupNow, remainingMs);
    }

    return clearAllTimers;
  }, [isMobile, ctx?.adConfig, isSearchOpen, popupConfig, slotMode, slotScript]);

  const closeDelaySeconds = Math.max(1, popupConfig.closeDelaySeconds ?? 6);
  const closeDelayMs = closeDelaySeconds * 1000;

  // Enable close button after closeDelayMs once popup opens
  useEffect(() => {
    if (!open) {
      setCanClose(false);
      return;
    }
    const t = window.setTimeout(() => setCanClose(true), closeDelayMs);
    return () => window.clearTimeout(t);
  }, [open, closeDelayMs]);

  // Rotate through images while popup is open at admin-configured interval
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
      <div
        className={`relative ${frameClass} overflow-hidden rounded-lg bg-black shadow-2xl flex items-center justify-center`}
      >
        {slotMode === "script" ? (
          <div className="w-full h-full p-2 bg-slate-950 flex items-center justify-center overflow-auto">
            <ScriptAdRenderer code={slotScript} />
          </div>
        ) : (
          ad && (
            <a
              href={ad.href || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="block h-full w-full"
            >
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
          {slotMode === "image" && ad?.label ? ad.label : "Sponsored"}
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
          {canClose ? <X className="h-4 w-4" /> : <CountdownDot seconds={closeDelaySeconds} />}
        </button>
      </div>
    </div>
  );
}

function CountdownDot({ seconds }: { seconds: number }) {
  const [s, setS] = useState(seconds);
  useEffect(() => {
    setS(seconds);
    const i = window.setInterval(() => setS((v) => Math.max(0, v - 1)), 1000);
    return () => window.clearInterval(i);
  }, [seconds]);
  return <span className="text-[11px] font-bold tabular-nums">{s}</span>;
}

export default PopupAd;
