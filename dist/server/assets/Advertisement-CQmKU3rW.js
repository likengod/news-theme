import { t as __exportAll } from "./rolldown-runtime-D7D4PA-g.js";
import { d as loadAdSlotScript, f as loadAds, l as loadAdRotation, u as loadAdSlotMode } from "./site-content-s03HcFGh.js";
import { n as useAdSettings } from "./AdSettingsContext-_GukefZs.js";
import { n as currentRoleSeesPopups } from "./roles-Chj1SNeK.js";
import { t as ScriptAdRenderer } from "./ScriptAdRenderer-CHXwBV65.js";
import { useEffect, useRef, useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
//#region src/components/site/Advertisement.tsx
var Advertisement_exports = /* @__PURE__ */ __exportAll({ default: () => Advertisement });
function Advertisement({ slot, href = "#", label = "Sponsored", image, video, poster, title, caption, slides, intervalMs = 4e3, aspectRatio = "3 / 4" }) {
	const ctx = useAdSettings();
	const initialMode = slot && ctx?.adConfig ? ctx.adConfig.modes[slot] || "image" : slot ? loadAdSlotMode(slot) : "image";
	const initialScript = slot && ctx?.adConfig ? ctx.adConfig.scripts[slot] || "" : slot ? loadAdSlotScript(slot) : "";
	const initialSlides = slot && ctx?.adConfig ? ctx.adConfig.slots[slot] || [] : slot ? loadAds(slot) : [];
	const initialInterval = slot && ctx?.adConfig ? (ctx.adConfig.rotations[slot] || 5) * 1e3 : slot ? loadAdRotation(slot) * 1e3 : 4e3;
	const [slotMode, setSlotMode] = useState(initialMode);
	const [slotScript, setSlotScript] = useState(initialScript);
	const [dbSlides, setDbSlides] = useState(initialSlides);
	const [dbInterval, setDbInterval] = useState(initialInterval);
	useEffect(() => {
		if (slot && ctx?.adConfig) {
			setSlotMode(ctx.adConfig.modes[slot] || "image");
			setSlotScript(ctx.adConfig.scripts[slot] || "");
			setDbSlides(ctx.adConfig.slots[slot] || []);
			setDbInterval((ctx.adConfig.rotations[slot] || 5) * 1e3);
		}
	}, [slot, ctx?.adConfig]);
	useEffect(() => {
		if (!slot) return;
		const sync = () => {
			setSlotMode(loadAdSlotMode(slot));
			setSlotScript(loadAdSlotScript(slot));
			setDbSlides(loadAds(slot));
			setDbInterval(loadAdRotation(slot) * 1e3);
		};
		window.addEventListener("nt:ads-updated", sync);
		return () => window.removeEventListener("nt:ads-updated", sync);
	}, [slot]);
	const items = slot ? slotMode === "script" ? [{
		type: "script",
		scriptCode: slotScript
	}] : dbSlides.map((s) => ({
		image: s.image,
		href: s.href
	})) : slides && slides.length > 0 ? slides : image || video ? [{
		image,
		video,
		poster,
		href
	}] : [];
	const finalInterval = slot ? dbInterval : intervalMs;
	const [canSeeAds, setCanSeeAds] = useState(true);
	useEffect(() => {
		setCanSeeAds(currentRoleSeesPopups());
	}, []);
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
	if (!canSeeAds) return null;
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
				children: [items.length === 0 ? /* @__PURE__ */ jsx("div", {
					className: "absolute inset-0 grid place-items-center text-xs uppercase tracking-widest text-muted-foreground",
					children: "Your Ad Here"
				}) : items.map((s, i) => /* @__PURE__ */ jsx("div", {
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
					}) : s.image ? /* @__PURE__ */ jsx("img", {
						src: s.image,
						alt: "Advertisement",
						loading: "lazy",
						className: "h-full w-full object-contain"
					}) : null
				}, i)), items.length > 1 && /* @__PURE__ */ jsx("div", {
					className: "absolute bottom-2 left-1/2 z-10 flex -translate-x-1/2 gap-1.5",
					children: items.map((_, i) => /* @__PURE__ */ jsx("span", { className: `h-1.5 w-1.5 rounded-full ${i === index ? "bg-white" : "bg-white/50"}` }, i))
				})]
			}), (title || caption) && /* @__PURE__ */ jsxs("div", {
				className: "p-3",
				children: [title && /* @__PURE__ */ jsx("h4", {
					className: "headline text-base leading-snug text-foreground group-hover:underline",
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
