import { d as loadAdSlotScript, f as loadAds, l as loadAdRotation, u as loadAdSlotMode } from "./site-content-lo-rUml2.js";
import { n as useAdSettings } from "./AdSettingsContext-BVHtqjX_.js";
import { n as currentRoleSeesPopups } from "./roles-CZtxgNXh.js";
import { t as ScriptAdRenderer } from "./ScriptAdRenderer-CHXwBV65.js";
import * as React$1 from "react";
import { useEffect, useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
import { X } from "lucide-react";
//#region src/hooks/use-mobile.tsx
var MOBILE_BREAKPOINT = 768;
function useIsMobile() {
	const [isMobile, setIsMobile] = React$1.useState(void 0);
	React$1.useEffect(() => {
		const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
		const onChange = () => {
			setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
		};
		mql.addEventListener("change", onChange);
		setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
		return () => mql.removeEventListener("change", onChange);
	}, []);
	return !!isMobile;
}
//#endregion
//#region src/components/site/PopupAd.tsx
var OPEN_DELAY_MS = 7e3;
var CLOSE_DELAY_MS = 6e3;
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
	const [slotMode, setSlotMode] = useState(initialMode);
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
		const handleSearchState = (e) => {
			const isOpen = Boolean(e.detail?.open);
			setIsSearchOpen(isOpen);
			if (isOpen) setOpen(false);
		};
		window.addEventListener("nt:search-modal-state", handleSearchState);
		return () => window.removeEventListener("nt:search-modal-state", handleSearchState);
	}, []);
	useEffect(() => {
		if (!currentRoleSeesPopups()) return;
		if (isSearchOpen || typeof document !== "undefined" && document.body.classList.contains("search-modal-open")) return;
		const mode = ctx?.adConfig ? ctx.adConfig.modes["popup"] || "image" : loadAdSlotMode("popup");
		const script = ctx?.adConfig ? ctx.adConfig.scripts["popup"] || "" : loadAdSlotScript("popup");
		if (mode === "script" && (!script || script.trim().length === 0)) return;
		const all = (ctx?.adConfig ? ctx.adConfig.slots["popup"] || [] : loadAds("popup")).filter((a) => !!a.image);
		if (mode === "image" && all.length === 0) return;
		const want = isMobile ? "portrait" : "landscape";
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
	}, [
		isMobile,
		ctx?.adConfig,
		isSearchOpen
	]);
	useEffect(() => {
		if (!open) return;
		const t = window.setTimeout(() => setCanClose(true), CLOSE_DELAY_MS);
		return () => window.clearTimeout(t);
	}, [open]);
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
					children: canClose ? /* @__PURE__ */ jsx(X, { className: "h-4 w-4" }) : /* @__PURE__ */ jsx(CountdownDot, {})
				})
			]
		})
	});
}
function CountdownDot() {
	const [s, setS] = useState(CLOSE_DELAY_MS / 1e3);
	useEffect(() => {
		const i = window.setInterval(() => setS((v) => Math.max(0, v - 1)), 1e3);
		return () => window.clearInterval(i);
	}, []);
	return /* @__PURE__ */ jsx("span", {
		className: "text-[11px] font-bold tabular-nums",
		children: s
	});
}
//#endregion
export { PopupAd, PopupAd as default };
