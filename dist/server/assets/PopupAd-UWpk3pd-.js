import { d as loadAdRotation, f as loadAdSlotMode, g as loadPopupConfig, m as loadAds, n as defaultPopupConfig, p as loadAdSlotScript } from "./site-content-D3QzTkKt.js";
import { n as useAdSettings } from "./AdSettingsContext-Dq1Y9X_4.js";
import { n as currentRoleSeesPopups } from "./roles-C6Q37OMM.js";
import { t as ScriptAdRenderer } from "./ScriptAdRenderer-CHXwBV65.js";
import { t as useIsMobile } from "./use-mobile-ZPBRhHdE.js";
import { useEffect, useRef, useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
import { X } from "lucide-react";
//#region src/components/site/PopupAd.tsx
function PopupAd() {
	const isMobile = useIsMobile();
	const ctx = useAdSettings();
	const [open, setOpen] = useState(false);
	const [canClose, setCanClose] = useState(false);
	const [ads, setAds] = useState([]);
	const [idx, setIdx] = useState(0);
	const initialMode = ctx?.adConfig ? ctx.adConfig.modes["popup"] || "image" : loadAdSlotMode("popup");
	const initialScript = ctx?.adConfig ? ctx.adConfig.scripts["popup"] || "" : loadAdSlotScript("popup");
	const initialRotation = ctx?.adConfig ? ctx.adConfig.rotations["popup"] || 6 : loadAdRotation("popup");
	const initialPopupConfig = ctx?.adConfig?.popupConfig || loadPopupConfig() || defaultPopupConfig;
	const [slotMode, setSlotMode] = useState(initialMode);
	const [slotScript, setSlotScript] = useState(initialScript);
	const [dbRotation, setDbRotation] = useState(initialRotation);
	const [popupConfig, setPopupConfig] = useState(initialPopupConfig);
	useEffect(() => {
		if (ctx?.adConfig) {
			setSlotMode(ctx.adConfig.modes["popup"] || "image");
			setSlotScript(ctx.adConfig.scripts["popup"] || "");
			setDbRotation(ctx.adConfig.rotations["popup"] || 6);
			if (ctx.adConfig.popupConfig) setPopupConfig(ctx.adConfig.popupConfig);
		}
	}, [ctx?.adConfig]);
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
		const handleSearchState = (e) => {
			const isOpen = Boolean(e.detail?.open);
			setIsSearchOpen(isOpen);
			if (isOpen) setOpen(false);
		};
		window.addEventListener("nt:search-modal-state", handleSearchState);
		return () => window.removeEventListener("nt:search-modal-state", handleSearchState);
	}, []);
	const openTimerRef = useRef(null);
	const recheckTimerRef = useRef(null);
	useEffect(() => {
		if (!currentRoleSeesPopups()) return;
		if (isSearchOpen || typeof document !== "undefined" && document.body.classList.contains("search-modal-open")) return;
		const mode = slotMode;
		const script = slotScript;
		if (mode === "script" && (!script || script.trim().length === 0)) return;
		const all = (ctx?.adConfig ? ctx.adConfig.slots["popup"] || [] : loadAds("popup")).filter((a) => !!a.image);
		if (mode === "image" && all.length === 0) return;
		const want = isMobile ? "portrait" : "landscape";
		const matching = all.filter((a) => a.orientation === want);
		const untagged = all.filter((a) => !a.orientation);
		const list = [...matching.length > 0 ? matching : untagged.length > 0 ? untagged : all].sort((a, b) => {
			const fa = a.isFeatured ? 1 : 0;
			return (b.isFeatured ? 1 : 0) - fa;
		});
		const freqMin = popupConfig.frequencyMinutes ?? 10;
		const initialDelayMs = Math.max(0, popupConfig.initialDelaySeconds ?? 7) * 1e3;
		const showPopupNow = () => {
			if (document.body.classList.contains("search-modal-open")) return;
			setAds(list);
			if (popupConfig.rotateOnInterval !== false && list.length > 1) try {
				const rawLastIdx = sessionStorage.getItem("nt:popup-ad-last-idx");
				if (rawLastIdx === null) {
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
			else setIdx(0);
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
		if (freqMin === -1) {
			if (sessionStorage.getItem("nt:popup-session-shown")) return;
			openTimerRef.current = window.setTimeout(showPopupNow, initialDelayMs);
			return clearAllTimers;
		}
		if (freqMin === 0) {
			openTimerRef.current = window.setTimeout(showPopupNow, initialDelayMs);
			return clearAllTimers;
		}
		const intervalMs = freqMin * 60 * 1e3;
		const lastShownTs = parseInt(localStorage.getItem("nt:popup-last-shown-ts") || "0", 10);
		const elapsed = Date.now() - lastShownTs;
		if (isNaN(lastShownTs) || lastShownTs === 0 || elapsed >= intervalMs) openTimerRef.current = window.setTimeout(showPopupNow, initialDelayMs);
		else {
			const remainingMs = intervalMs - elapsed;
			recheckTimerRef.current = window.setTimeout(showPopupNow, remainingMs);
		}
		return clearAllTimers;
	}, [
		isMobile,
		ctx?.adConfig,
		isSearchOpen,
		popupConfig,
		slotMode,
		slotScript
	]);
	const closeDelaySeconds = Math.max(1, popupConfig.closeDelaySeconds ?? 6);
	const closeDelayMs = closeDelaySeconds * 1e3;
	useEffect(() => {
		if (!open) {
			setCanClose(false);
			return;
		}
		const t = window.setTimeout(() => setCanClose(true), closeDelayMs);
		return () => window.clearTimeout(t);
	}, [open, closeDelayMs]);
	useEffect(() => {
		if (!open || ads.length < 2 || slotMode === "script") return;
		const i = window.setInterval(() => setIdx((v) => (v + 1) % ads.length), Math.max(1, dbRotation) * 1e3);
		return () => window.clearInterval(i);
	}, [
		open,
		ads.length,
		slotMode,
		dbRotation
	]);
	if (!open) return null;
	if (slotMode === "image" && ads.length === 0) return null;
	const ad = ads[idx] ?? ads[0];
	return /* @__PURE__ */ jsx("div", {
		role: "dialog",
		"aria-modal": "true",
		"aria-label": "Advertisement",
		className: "fixed inset-0 z-[100] grid place-items-center bg-black/70 p-4 animate-in fade-in duration-300",
		children: /* @__PURE__ */ jsxs("div", {
			className: `relative ${isMobile ? "w-[88vw] max-w-sm aspect-[3/4]" : "w-[min(900px,80vw)] aspect-[16/9]"} overflow-hidden rounded-lg bg-black shadow-2xl flex items-center justify-center`,
			children: [
				slotMode === "script" ? /* @__PURE__ */ jsx("div", {
					className: "w-full h-full p-2 bg-slate-950 flex items-center justify-center overflow-auto",
					children: /* @__PURE__ */ jsx(ScriptAdRenderer, { code: slotScript })
				}) : ad && /* @__PURE__ */ jsx("a", {
					href: ad.href || "#",
					target: "_blank",
					rel: "noopener noreferrer",
					className: "block h-full w-full",
					children: /* @__PURE__ */ jsx("img", {
						src: ad.image,
						alt: ad.label ?? "Advertisement",
						className: "h-full w-full object-cover animate-in fade-in duration-500"
					}, ad.id)
				}),
				/* @__PURE__ */ jsx("span", {
					className: "absolute left-2 top-2 rounded bg-black/60 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-white",
					children: slotMode === "image" && ad?.label ? ad.label : "Sponsored"
				}),
				slotMode === "image" && ads.length > 1 && /* @__PURE__ */ jsx("div", {
					className: "absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1.5",
					children: ads.map((_, i) => /* @__PURE__ */ jsx("span", { className: `h-1.5 w-1.5 rounded-full transition ${i === idx ? "bg-white" : "bg-white/40"}` }, i))
				}),
				/* @__PURE__ */ jsx("button", {
					type: "button",
					onClick: () => canClose && setOpen(false),
					disabled: !canClose,
					"aria-label": canClose ? "Close advertisement" : "Close available shortly",
					className: `absolute right-2 top-2 grid h-9 w-9 place-items-center rounded-full text-white shadow-lg transition ${canClose ? "bg-black/80 hover:bg-black cursor-pointer" : "bg-black/40 cursor-not-allowed"}`,
					children: canClose ? /* @__PURE__ */ jsx(X, { className: "h-4 w-4" }) : /* @__PURE__ */ jsx(CountdownDot, { seconds: closeDelaySeconds })
				})
			]
		})
	});
}
function CountdownDot({ seconds }) {
	const [s, setS] = useState(seconds);
	useEffect(() => {
		setS(seconds);
		const i = window.setInterval(() => setS((v) => Math.max(0, v - 1)), 1e3);
		return () => window.clearInterval(i);
	}, [seconds]);
	return /* @__PURE__ */ jsx("span", {
		className: "text-[11px] font-bold tabular-nums",
		children: s
	});
}
//#endregion
export { PopupAd, PopupAd as default };

//# sourceMappingURL=PopupAd-UWpk3pd-.js.map