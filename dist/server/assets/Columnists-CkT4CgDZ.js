import { m as loadAds, u as injectReelAds } from "./ads-storage-DcV6Qjnu.js";
import { n as useAdSettings } from "./AdSettingsContext-DBLzehDo.js";
import { l as viewsFor } from "./news-data-CiXcY3JG.js";
import { t as Views } from "./Views-BCTnPRdw.js";
import { t as useHomepageConfig } from "./use-homepage-config-CaZ4yEkl.js";
import { n as extractYouTubeId, o as loadReels } from "./reels-config-C5VTVRxm.js";
import { t as useReelsConfig } from "./use-reels-config-AYyokM3G.js";
import { t as useIsMobile } from "./use-mobile-Dt1uRu8S.js";
import { Suspense, lazy, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { ChevronLeft, ChevronRight, ExternalLink, Play, Sparkles } from "lucide-react";
//#region src/components/site/Columnists.tsx
var ReelViewerModal = lazy(() => import("./ReelViewerModal-BMYJr-tE.js"));
function Columnists({ hideTitle } = {}) {
	const cfg = useHomepageConfig();
	const reelsCfg = useReelsConfig();
	const adCtx = useAdSettings();
	const [activeReelIndex, setActiveReelIndex] = useState(null);
	const scrollRef = useRef(null);
	const [items, setItems] = useState([]);
	useEffect(() => {
		if (!reelsCfg?.enabled) {
			setItems([]);
			return;
		}
		let cancelled = false;
		loadReels(reelsCfg).then((reelsList) => {
			if (cancelled) return;
			setItems((reelsList || []).map((r, i) => {
				const ytId = extractYouTubeId(r.url);
				const thumb = r.thumbnail || (ytId ? `https://i.ytimg.com/vi/${ytId}/hqdefault.jpg` : "");
				return {
					title: r.title || `Shorts #${i + 1}`,
					duration: "1:00",
					img: thumb,
					kicker: r.source === "manual" ? "Shorts" : "Reels",
					embedSrc: r.embedSrc
				};
			}));
		});
		return () => {
			cancelled = true;
		};
	}, [reelsCfg]);
	const isMobile = useIsMobile();
	const reelAds = useMemo(() => {
		return adCtx?.adConfig?.slots?.["reel_ads"] || loadAds("reel_ads");
	}, [adCtx?.adConfig?.slots]);
	const displayItems = useMemo(() => {
		return injectReelAds(items, reelAds, isMobile ? {
			firstAfter: 1,
			interval: 2
		} : 3);
	}, [
		items,
		reelAds,
		isMobile
	]);
	if (!reelsCfg?.enabled || items.length === 0) return null;
	const scroll = (direction) => {
		if (scrollRef.current) {
			const scrollAmount = scrollRef.current.clientWidth * .75;
			scrollRef.current.scrollBy({
				left: direction === "left" ? -scrollAmount : scrollAmount,
				behavior: "smooth"
			});
		}
	};
	return /* @__PURE__ */ jsxs("section", {
		className: "border-t border-border pt-3 pb-1 md:py-10",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "flex items-center justify-between mb-2 md:mb-0",
				children: [/* @__PURE__ */ jsx("h2", {
					className: "font-bold text-sm md:text-base",
					style: {
						color: cfg.watch.color,
						fontSize: `${cfg.watch.fontSize}px`
					},
					children: cfg.watch.title
				}), /* @__PURE__ */ jsx(Link, {
					to: "/reels",
					className: "rounded-full border border-border px-3 md:px-4 py-1 md:py-1.5 text-[11px] md:text-xs font-semibold text-foreground transition hover:bg-foreground hover:text-background",
					children: "Explore More"
				})]
			}),
			/* @__PURE__ */ jsx("div", {
				ref: scrollRef,
				className: "mt-0 md:mt-6 flex overflow-x-auto gap-2 pb-3 snap-x snap-mandatory scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden md:gap-4 md:pb-3",
				children: displayItems.map((item, index) => {
					if (item.isAd) {
						const ad = item.ad;
						const adImg = ad.imagePortrait || ad.imageLandscape || ad.image;
						const adHref = ad.href || "#";
						const isGenericLabel = !ad.label || /^(sponsored|sponsor|ad|ads|advertisement|sponsored ad)$/i.test(ad.label.trim());
						return /* @__PURE__ */ jsxs("div", {
							className: "group block shrink-0 snap-start w-[27%] sm:w-[45%] md:w-[31%] lg:w-[calc(20%-0.8rem)]",
							children: [/* @__PURE__ */ jsxs("a", {
								href: adHref,
								target: "_blank",
								rel: "noopener noreferrer",
								className: "block relative aspect-[9/16] overflow-hidden rounded-xl bg-black border border-amber-500/40 shadow-sm transition duration-500 hover:scale-[1.02] hover:border-amber-400 group/ad",
								children: [
									/* @__PURE__ */ jsx("img", {
										src: adImg,
										alt: ad.label || "Sponsored Ad",
										loading: "lazy",
										fetchPriority: "low",
										decoding: "async",
										sizes: "(max-width: 768px) 27vw, 150px",
										width: 270,
										height: 480,
										className: "h-full w-full object-cover transition duration-500 group-hover/ad:scale-105"
									}),
									/* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" }),
									/* @__PURE__ */ jsx("div", {
										className: "absolute bottom-1.5 left-1.5 right-1.5 md:bottom-2.5 md:left-2.5 md:right-2.5 flex items-center justify-between",
										children: /* @__PURE__ */ jsxs("span", {
											className: "inline-flex items-center gap-0.5 text-[7px] sm:text-[8px] md:text-[9.5px] font-semibold text-white/90 bg-black/50 backdrop-blur-md px-1.5 py-0.5 md:px-2 md:py-0.5 rounded-full border border-white/20 group-hover/ad:bg-amber-500 group-hover/ad:text-black group-hover/ad:border-amber-400 transition-colors leading-none",
											children: [/* @__PURE__ */ jsx("span", { children: "Visit" }), /* @__PURE__ */ jsx(ExternalLink, { className: "h-1.5 w-1.5 md:h-2 md:w-2 shrink-0" })]
										})
									})
								]
							}), /* @__PURE__ */ jsxs("div", {
								className: "mt-1.5 flex items-center gap-1 text-[10px] md:text-[11px] font-semibold text-amber-800 dark:text-amber-400 truncate",
								children: [
									/* @__PURE__ */ jsx(Sparkles, { className: "h-2.5 w-2.5 shrink-0" }),
									/* @__PURE__ */ jsx("span", { children: "Sponsored" }),
									!isGenericLabel && /* @__PURE__ */ jsxs("span", {
										className: "text-muted-foreground font-normal ml-0.5 truncate",
										children: ["· ", ad.label]
									})
								]
							})]
						}, `reel-ad-${index}`);
					}
					const v = item.item;
					const reelIdx = item.originalIndex;
					return /* @__PURE__ */ jsxs("div", {
						onClick: () => setActiveReelIndex(reelIdx),
						className: "group block shrink-0 snap-start cursor-pointer w-[27%] sm:w-[45%] md:w-[31%] lg:w-[calc(20%-0.8rem)]",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "relative aspect-[9/16] overflow-hidden rounded-xl bg-black border border-border/40 shadow-sm transition duration-500 hover:scale-[1.02]",
							children: [
								/* @__PURE__ */ jsx("img", {
									src: v.img,
									alt: v.title,
									loading: "lazy",
									fetchPriority: "low",
									decoding: "async",
									sizes: "(max-width: 768px) 27vw, 150px",
									width: 270,
									height: 480,
									className: "h-full w-full object-cover transition duration-500 group-hover:scale-105"
								}),
								/* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" }),
								v.kicker && /* @__PURE__ */ jsx("span", {
									className: "absolute left-2.5 top-2.5 bg-[#1d4ed8] px-2 py-0.5 text-[10px] font-bold text-white rounded",
									children: v.kicker
								}),
								!hideTitle && /* @__PURE__ */ jsx("div", {
									className: "hidden md:block",
									children: /* @__PURE__ */ jsx("h3", {
										className: "absolute bottom-11 left-2.5 right-2.5 text-xs font-bold leading-tight text-white drop-shadow line-clamp-2",
										children: v.title
									})
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "absolute bottom-1.5 left-1.5 md:bottom-2.5 md:left-2.5 flex items-center gap-1 md:gap-1.5",
									children: [/* @__PURE__ */ jsx("span", {
										className: "flex h-5 w-5 md:h-7 md:w-7 items-center justify-center rounded-full bg-white/95 text-black shadow transition-transform group-hover:scale-110",
										children: /* @__PURE__ */ jsx(Play, { className: "h-2.5 w-2.5 md:h-3 md:w-3 fill-current ml-0.5" })
									}), /* @__PURE__ */ jsx("span", {
										className: "text-[9px] md:text-xs font-semibold text-white drop-shadow",
										children: v.duration
									})]
								})
							]
						}), /* @__PURE__ */ jsx(Views, {
							count: viewsFor(v.title),
							className: "mt-1.5 text-[11px] text-muted-foreground"
						})]
					}, v.title + index);
				})
			}),
			activeReelIndex !== null && /* @__PURE__ */ jsx(Suspense, {
				fallback: null,
				children: /* @__PURE__ */ jsx(ReelViewerModal, {
					initialIndex: activeReelIndex,
					items,
					onClose: () => setActiveReelIndex(null)
				})
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "hidden md:flex mt-5 items-center justify-between",
				children: [
					/* @__PURE__ */ jsx("div", { className: "flex-1" }),
					/* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ jsx("span", { className: "h-1.5 w-1.5 rounded-full bg-foreground" }), /* @__PURE__ */ jsx("span", { className: "h-1.5 w-1.5 rounded-full bg-muted-foreground/40" })]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "flex flex-1 justify-end gap-2",
						children: [/* @__PURE__ */ jsx("button", {
							type: "button",
							onClick: () => scroll("left"),
							"aria-label": "Previous",
							className: "flex h-8 w-8 items-center justify-center rounded-full border border-border text-foreground transition hover:bg-foreground hover:text-background",
							children: /* @__PURE__ */ jsx(ChevronLeft, { className: "h-4 w-4" })
						}), /* @__PURE__ */ jsx("button", {
							type: "button",
							onClick: () => scroll("right"),
							"aria-label": "Next",
							className: "flex h-8 w-8 items-center justify-center rounded-full border border-border text-foreground transition hover:bg-foreground hover:text-background",
							children: /* @__PURE__ */ jsx(ChevronRight, { className: "h-4 w-4" })
						})]
					})
				]
			})
		]
	});
}
//#endregion
export { Columnists };

//# sourceMappingURL=Columnists-CkT4CgDZ.js.map