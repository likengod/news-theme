import { a as defaultAdSlidesPopup, d as loadAdRotation, f as loadAdSlotMode, i as defaultAdSlidesLeaderboard, m as loadAds, n as defaultAdSlidesAd3, o as defaultAdSlidesPostAds, p as loadAdSlotScript, r as defaultAdSlidesHome2, t as defaultAdSlides } from "./ads-storage-UHhp7w7a.js";
import { a as useSiteSettings, n as useAdSettings } from "./AdSettingsContext-Dyk4YbrE.js";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
//#region src/components/site/ScriptAdRenderer.tsx
function ScriptAdRenderer({ code, className }) {
	const containerRef = useRef(null);
	useEffect(() => {
		if (!containerRef.current || !code) return;
		containerRef.current.innerHTML = "";
		try {
			const range = document.createRange();
			range.selectNode(containerRef.current);
			const fragment = range.createContextualFragment(code);
			containerRef.current.appendChild(fragment);
		} catch (e) {
			console.error("ScriptAdRenderer error:", e);
		}
	}, [code]);
	return /* @__PURE__ */ jsx("div", {
		ref: containerRef,
		className: className || "w-full h-full flex items-center justify-center overflow-hidden"
	});
}
//#endregion
//#region src/components/site/Advertisement.tsx
var SLOT_DEFAULTS = {
	home1: defaultAdSlides,
	home2: defaultAdSlidesHome2,
	ad3: defaultAdSlidesAd3,
	popup: defaultAdSlidesPopup,
	leaderboard: defaultAdSlidesLeaderboard,
	hero_showcase: [],
	reel_ads: [],
	post_ads: defaultAdSlidesPostAds
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
	const [wRatio, hRatio] = (aspectRatio || "3 / 4").split("/").map((v) => parseFloat(v.trim()) || 1);
	const imgWidth = Math.round((wRatio || 3) / (hRatio || 4) * 600) || 600;
	const imgHeight = 600;
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
			"aria-label": currentItem?.title || label || "Advertisement",
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
						width: imgWidth,
						height: imgHeight,
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
//#region src/components/site/ArchiveFinder.tsx
function ArchiveFinder() {
	const navigate = useNavigate();
	return /* @__PURE__ */ jsxs("form", {
		onSubmit: (e) => {
			e.preventDefault();
			const fd = new FormData(e.currentTarget);
			const d = fd.get("day") || "";
			const m = fd.get("month") || "";
			const y = fd.get("year") || "";
			navigate({
				to: "/archive",
				search: {
					...d ? { day: d } : {},
					...m ? { month: m } : {},
					...y ? { year: y } : {},
					page: 1
				}
			});
		},
		className: "space-y-2 border border-border bg-card p-4",
		children: [
			/* @__PURE__ */ jsx("p", {
				className: "text-xs font-bold uppercase tracking-[0.2em] text-foreground",
				children: "Archive"
			}),
			/* @__PURE__ */ jsx("p", {
				className: "text-[11px] text-muted-foreground",
				children: "Find stories by date"
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "grid grid-cols-3 gap-2",
				children: [
					/* @__PURE__ */ jsxs("select", {
						id: "day",
						name: "day",
						"aria-label": "Day",
						defaultValue: "",
						suppressHydrationWarning: true,
						className: "w-full border border-border bg-background px-2 py-2 text-sm outline-none focus:border-foreground",
						children: [/* @__PURE__ */ jsx("option", {
							value: "",
							children: "Day"
						}), Array.from({ length: 31 }, (_, i) => i + 1).map((d) => /* @__PURE__ */ jsx("option", {
							value: String(d).padStart(2, "0"),
							children: d
						}, d))]
					}),
					/* @__PURE__ */ jsxs("select", {
						id: "month",
						name: "month",
						"aria-label": "Month",
						defaultValue: "",
						suppressHydrationWarning: true,
						className: "w-full border border-border bg-background px-2 py-2 text-sm outline-none focus:border-foreground",
						children: [/* @__PURE__ */ jsx("option", {
							value: "",
							children: "Month"
						}), [
							"Jan",
							"Feb",
							"Mar",
							"Apr",
							"May",
							"Jun",
							"Jul",
							"Aug",
							"Sep",
							"Oct",
							"Nov",
							"Dec"
						].map((m, i) => /* @__PURE__ */ jsx("option", {
							value: String(i + 1).padStart(2, "0"),
							children: m
						}, m))]
					}),
					/* @__PURE__ */ jsxs("select", {
						id: "year",
						name: "year",
						"aria-label": "Year",
						defaultValue: "",
						suppressHydrationWarning: true,
						className: "w-full border border-border bg-background px-2 py-2 text-sm outline-none focus:border-foreground",
						children: [/* @__PURE__ */ jsx("option", {
							value: "",
							children: "Year"
						}), Array.from({ length: 16 }, (_, i) => 2026 - i).map((y) => /* @__PURE__ */ jsx("option", {
							value: String(y),
							children: y
						}, y))]
					})
				]
			}),
			/* @__PURE__ */ jsx("button", {
				type: "submit",
				className: "w-full bg-foreground px-3 py-2 text-sm font-bold uppercase tracking-widest text-background hover:opacity-80",
				children: "Find Archive"
			})
		]
	});
}
//#endregion
export { Advertisement as n, ScriptAdRenderer as r, ArchiveFinder as t };

//# sourceMappingURL=ArchiveFinder-Bsnseeb2.js.map