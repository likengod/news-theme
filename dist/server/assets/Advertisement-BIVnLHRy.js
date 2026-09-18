import { t as __exportAll } from "./rolldown-runtime-D7D4PA-g.js";
import { a as defaultAdSlidesPopup, d as loadAdSlotMode, f as loadAdSlotScript, i as defaultAdSlidesLeaderboard, n as defaultAdSlidesAd3, p as loadAds, r as defaultAdSlidesHome2, t as defaultAdSlides, u as loadAdRotation } from "./ads-storage-Be0cvbCl.js";
import { a as useSiteSettings, n as useAdSettings } from "./AdSettingsContext-v0YhHRkC.js";
import { t as ScriptAdRenderer } from "./ScriptAdRenderer-CHXwBV65.js";
import { useEffect, useRef, useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
//#region src/components/site/Advertisement.tsx
var Advertisement_exports = /* @__PURE__ */ __exportAll({ default: () => Advertisement });
var SLOT_DEFAULTS = {
	home1: defaultAdSlides,
	home2: defaultAdSlidesHome2,
	ad3: defaultAdSlidesAd3,
	popup: defaultAdSlidesPopup,
	leaderboard: defaultAdSlidesLeaderboard,
	hero_showcase: defaultAdSlidesHome2,
	reel_ads: []
};
function Advertisement({ slot, href = "#", label = "Sponsored", image, video, poster, title, caption, slides, intervalMs = 4e3, aspectRatio = "3 / 4" }) {
	const ctx = useAdSettings();
	const isEnterprise = (useSiteSettings()?.licenseType || "").toLowerCase().includes("enterprise");
	let initialMode = slot && ctx?.adConfig ? ctx.adConfig.modes[slot] || "image" : slot ? loadAdSlotMode(slot) : "image";
	if (slot === "leaderboard" && !isEnterprise) initialMode = "script";
	const initialScript = slot && ctx?.adConfig ? ctx.adConfig.scripts[slot] || "" : slot ? loadAdSlotScript(slot) : "";
	const configSlides = slot && ctx?.adConfig?.slots ? ctx.adConfig.slots[slot] : void 0;
	const slotFallback = slot ? SLOT_DEFAULTS[slot] || [] : [];
	const localSlides = slot ? loadAds(slot) : [];
	const initialSlides = configSlides && configSlides.length > 0 ? configSlides : localSlides.length > 0 ? localSlides : slotFallback;
	const initialInterval = slot && ctx?.adConfig ? (ctx.adConfig.rotations[slot] || 5) * 1e3 : slot ? loadAdRotation(slot) * 1e3 : 4e3;
	const [slotMode, setSlotMode] = useState(initialMode);
	const [slotScript, setSlotScript] = useState(initialScript);
	const [dbSlides, setDbSlides] = useState(initialSlides);
	const [dbInterval, setDbInterval] = useState(initialInterval);
	useEffect(() => {
		if (slot && ctx?.adConfig) {
			setSlotMode(ctx.adConfig.modes[slot] || "image");
			setSlotScript(ctx.adConfig.scripts[slot] || "");
			const s = ctx.adConfig.slots[slot];
			if (s && s.length > 0) setDbSlides(s);
			else {
				const local = loadAds(slot);
				setDbSlides(local.length > 0 ? local : SLOT_DEFAULTS[slot] || []);
			}
			setDbInterval((ctx.adConfig.rotations[slot] || 5) * 1e3);
		}
	}, [slot, ctx?.adConfig]);
	useEffect(() => {
		if (!slot) return;
		const sync = () => {
			setSlotMode(loadAdSlotMode(slot));
			setSlotScript(loadAdSlotScript(slot));
			const local = loadAds(slot);
			setDbSlides(local.length > 0 ? local : SLOT_DEFAULTS[slot] || []);
			setDbInterval(loadAdRotation(slot) * 1e3);
		};
		window.addEventListener("nt:ads-updated", sync);
		return () => window.removeEventListener("nt:ads-updated", sync);
	}, [slot]);
	const effectiveSlides = dbSlides.length > 0 ? dbSlides : slot ? SLOT_DEFAULTS[slot] || [] : [];
	const items = slot ? slotMode === "script" ? [{
		type: "script",
		scriptCode: slotScript
	}] : effectiveSlides.map((s) => {
		let img = s.image;
		if (slot === "home1" || slot === "ad3" || slot === "popup" || slot === "reel_ads") img = s.imagePortrait || s.image || s.imageLandscape || "";
		else if (slot === "home2" || slot === "leaderboard") img = s.imageLandscape || s.image || s.imagePortrait || "";
		else img = s.image || s.imagePortrait || s.imageLandscape || "";
		return {
			type: s.type || (s.scriptCode ? "script" : "image"),
			scriptCode: s.scriptCode,
			image: img,
			href: s.href
		};
	}).filter((s) => s.type === "script" ? !!s.scriptCode : !!s.image) : slides && slides.length > 0 ? slides : image || video ? [{
		image,
		video,
		poster,
		href
	}] : [];
	const finalInterval = slot ? dbInterval : intervalMs;
	const [index, setIndex] = useState(0);
	const [visible, setVisible] = useState(false);
	const rootRef = useRef(null);
	useEffect(() => {
		const el = rootRef.current;
		if (!el || typeof IntersectionObserver === "undefined") {
			setVisible(true);
			return;
		}
		const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: .1 });
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
	}, [
		items.length,
		finalInterval,
		visible,
		hasScriptAd
	]);
	const currentItem = items[index];
	const isScriptAd = slotMode === "script" || currentItem?.type === "script" || !!currentItem?.scriptCode;
	if (items.length === 0 && !isScriptAd) return null;
	return /* @__PURE__ */ jsxs("aside", {
		ref: rootRef,
		"aria-label": "Advertisement",
		className: "w-full",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "mb-2 flex items-center justify-between",
			children: [/* @__PURE__ */ jsx("span", {
				className: "text-[10px] font-bold uppercase tracking-[0.25em] text-muted-foreground",
				children: "Advertisement"
			}), /* @__PURE__ */ jsx("span", {
				className: "text-[10px] font-bold uppercase tracking-[0.25em] text-muted-foreground",
				children: label
			})]
		}), isScriptAd ? /* @__PURE__ */ jsx("div", {
			className: "border border-border bg-muted/30 p-2 overflow-hidden flex items-center justify-center min-h-[160px]",
			children: /* @__PURE__ */ jsx(ScriptAdRenderer, { code: currentItem.scriptCode || "" })
		}) : /* @__PURE__ */ jsxs("a", {
			href: currentItem?.href ?? href,
			target: "_blank",
			rel: "noopener sponsored",
			className: "group block border border-border bg-muted/30",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "relative w-full overflow-hidden",
				style: { aspectRatio },
				children: [items.map((s, i) => /* @__PURE__ */ jsx("div", {
					className: "absolute inset-0 transition-opacity duration-700 ease-in-out",
					style: { opacity: i === index ? 1 : 0 },
					"aria-hidden": i !== index,
					children: s.type === "script" || s.scriptCode ? /* @__PURE__ */ jsx(ScriptAdRenderer, { code: s.scriptCode || "" }) : s.video ? /* @__PURE__ */ jsx("video", {
						src: s.video,
						poster: s.poster,
						autoPlay: true,
						muted: true,
						loop: true,
						playsInline: true,
						className: "h-full w-full object-contain"
					}) : s.image ? i === index ? /* @__PURE__ */ jsx("img", {
						src: s.image,
						alt: "Advertisement",
						loading: "lazy",
						decoding: "async",
						className: `h-full w-full ${slot === "home1" || slot === "ad3" ? "object-cover" : "object-contain"}`
					}) : null : null
				}, i)), items.length > 1 && /* @__PURE__ */ jsx("div", {
					className: "absolute bottom-2 left-1/2 z-10 flex -translate-x-1/2 gap-1.5",
					children: items.map((_, i) => /* @__PURE__ */ jsx("span", { className: `h-1.5 w-1.5 rounded-full ${i === index ? "bg-white" : "bg-white/50"}` }, i))
				})]
			}), (title || caption) && /* @__PURE__ */ jsxs("div", {
				className: "p-3",
				children: [title && /* @__PURE__ */ jsx("p", {
					className: "headline text-base font-semibold leading-snug text-foreground group-hover:underline",
					children: title
				}), caption && /* @__PURE__ */ jsx("p", {
					className: "mt-1 text-xs leading-snug text-muted-foreground",
					children: caption
				})]
			})]
		})]
	});
}
//#endregion
export { Advertisement_exports as n, Advertisement as t };

//# sourceMappingURL=Advertisement-BIVnLHRy.js.map