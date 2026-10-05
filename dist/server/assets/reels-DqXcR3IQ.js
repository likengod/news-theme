import { l as injectReelAds, p as loadAds } from "./ads-storage-CafsPZk9.js";
import { n as useAdSettings } from "./AdSettingsContext-CWtOvsGs.js";
import { d as news_wallstreet_default, f as news_crypto_default, g as hero_markets_default, h as news_fed_default, l as viewsFor, m as news_tech_default, p as news_oil_default, t as formatViews, u as news_trade_default } from "./news-data-BKO0wE94.js";
import { t as Footer } from "./Footer-De8NV5np.js";
import { t as useIsMobile } from "./use-mobile-Dt1uRu8S.js";
import { ReelViewerModal } from "./ReelViewerModal-CSMybiMN.js";
import { d as toEmbedSrc, s as loadReelsConfig } from "./reels-config-B-wUolvV.js";
import { t as Header } from "./Header-CgAjoU3Y.js";
import { t as Route } from "./reels-BbPlkux2.js";
import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { ChevronLeft, ChevronRight, ExternalLink, Eye, Film, Play, Sparkles } from "lucide-react";
//#region src/lib/reels-data.ts
var stockImages = [
	news_tech_default,
	news_wallstreet_default,
	news_trade_default,
	news_fed_default,
	hero_markets_default,
	news_oil_default,
	news_crypto_default
];
function getAllReels() {
	try {
		const cfg = loadReelsConfig();
		const customItems = [];
		if (cfg && cfg.enabled && Array.isArray(cfg.urls)) cfg.urls.forEach((url, i) => {
			const embed = toEmbedSrc(cfg.provider, url);
			if (embed) {
				const ytId = cfg.provider === "youtube" ? url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|shorts\/))([a-zA-Z0-9_-]{11})/)?.[1] : null;
				const thumb = ytId ? `https://i.ytimg.com/vi/${ytId}/hqdefault.jpg` : stockImages[i % stockImages.length];
				customItems.push({
					title: "Featured Shorts #" + (i + 1),
					duration: "1:00",
					img: thumb,
					kicker: "Shorts",
					embedSrc: embed,
					views: 5e4 + i * 1234
				});
			}
		});
		return customItems;
	} catch {
		return [];
	}
}
//#endregion
//#region src/routes/reels.tsx?tsr-split=component
function ReelsPage() {
	const currentPage = Route.useSearch().page ?? 1;
	const ITEMS_PER_PAGE = 20;
	const allReels = useMemo(() => getAllReels(), []);
	const totalItems = allReels.length;
	const totalPages = Math.max(1, Math.ceil(totalItems / ITEMS_PER_PAGE));
	const validPage = Math.min(Math.max(1, currentPage), totalPages);
	const startIndex = (validPage - 1) * ITEMS_PER_PAGE;
	const currentReels = allReels.slice(startIndex, startIndex + ITEMS_PER_PAGE);
	const adCtx = useAdSettings();
	const reelAds = useMemo(() => {
		return adCtx?.adConfig?.slots?.["reel_ads"] || loadAds("reel_ads");
	}, [adCtx?.adConfig?.slots]);
	const isMobile = useIsMobile();
	const displayReels = useMemo(() => {
		return injectReelAds(currentReels, reelAds, isMobile ? {
			firstAfter: 1,
			interval: 2
		} : 3);
	}, [
		currentReels,
		reelAds,
		isMobile
	]);
	const [activeModalIndex, setActiveModalIndex] = useState(null);
	return /* @__PURE__ */ jsxs("div", {
		className: "min-h-screen bg-background text-foreground flex flex-col",
		children: [
			/* @__PURE__ */ jsx(Header, {}),
			/* @__PURE__ */ jsxs("main", {
				className: "mx-auto max-w-7xl px-3 sm:px-4 py-4 md:py-8 flex-1 w-full",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "mb-3 md:mb-6 flex items-center justify-between border-b border-border pb-2.5 md:pb-4",
						children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ jsx("span", {
								className: "flex h-7 w-7 md:h-8 md:w-8 items-center justify-center rounded-lg bg-red-600 text-white shadow",
								children: /* @__PURE__ */ jsx(Film, { className: "h-3.5 w-3.5 md:h-4 md:w-4" })
							}), /* @__PURE__ */ jsx("h1", {
								className: "text-lg md:text-2xl font-black uppercase tracking-wider text-foreground",
								children: "Reels & Shorts"
							})]
						}), /* @__PURE__ */ jsx("p", {
							className: "hidden sm:block text-xs text-muted-foreground mt-1",
							children: "Explore short-form video stories, breaking coverage & highlights"
						})] }), /* @__PURE__ */ jsx("div", {
							className: "hidden sm:flex items-center gap-2 text-xs font-semibold text-muted-foreground",
							children: /* @__PURE__ */ jsxs("span", {
								className: "rounded-full bg-muted px-3 py-1 border border-border",
								children: [
									"Page ",
									validPage,
									" of ",
									totalPages,
									" (",
									totalItems,
									" Reels)"
								]
							})
						})]
					}),
					totalItems === 0 ? /* @__PURE__ */ jsxs("div", {
						className: "flex flex-col items-center justify-center py-24 text-center",
						children: [
							/* @__PURE__ */ jsx(Film, { className: "h-12 w-12 text-muted-foreground/30 mb-3" }),
							/* @__PURE__ */ jsx("h3", {
								className: "text-base font-semibold text-foreground",
								children: "No Reels Published Yet"
							}),
							/* @__PURE__ */ jsx("p", {
								className: "text-xs text-muted-foreground max-w-sm mt-1",
								children: "Add YouTube Shorts or Facebook Reels in the Admin Panel to display videos here."
							})
						]
					}) : /* @__PURE__ */ jsx("div", {
						className: "grid grid-cols-4 md:grid-cols-5 gap-2 sm:gap-3 md:gap-4",
						children: displayReels.map((entry, index) => {
							if (entry.isAd) {
								const ad = entry.ad;
								const adImg = ad.imagePortrait || ad.imageLandscape || ad.image;
								const adHref = ad.href || "#";
								const isGenericLabel = !ad.label || /^(sponsored|sponsor|ad|ads|advertisement|sponsored ad)$/i.test(ad.label.trim());
								return /* @__PURE__ */ jsxs("div", {
									className: "group flex flex-col",
									children: [/* @__PURE__ */ jsxs("a", {
										href: adHref,
										target: "_blank",
										rel: "noopener noreferrer",
										className: "block relative aspect-[9/16] w-full overflow-hidden rounded-lg sm:rounded-xl bg-black border border-amber-500/40 shadow-sm transition duration-300 group-hover:scale-[1.02] group-hover:border-amber-400 group-hover:shadow-md",
										children: [
											/* @__PURE__ */ jsx("img", {
												src: adImg,
												alt: ad.label || "Sponsored Ad",
												loading: "lazy",
												className: "h-full w-full object-cover transition duration-500 group-hover:scale-105"
											}),
											/* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" }),
											/* @__PURE__ */ jsx("div", {
												className: "absolute bottom-1.5 left-1.5 sm:bottom-2 sm:left-2 flex items-center gap-1",
												children: /* @__PURE__ */ jsxs("span", {
													className: "inline-flex items-center gap-0.5 text-[7px] sm:text-[8px] md:text-[9.5px] font-semibold text-white/90 bg-black/50 backdrop-blur-md px-1.5 py-0.5 sm:px-2 sm:py-0.5 rounded-full border border-white/20 group-hover:bg-amber-500 group-hover:text-black group-hover:border-amber-400 transition-colors leading-none",
													children: [/* @__PURE__ */ jsx("span", { children: "Visit" }), /* @__PURE__ */ jsx(ExternalLink, { className: "h-1.5 w-1.5 sm:h-2 sm:w-2 shrink-0" })]
												})
											})
										]
									}), /* @__PURE__ */ jsxs("div", {
										className: "mt-1 flex items-center gap-1 text-[10px] sm:text-[11px] font-semibold text-amber-600 dark:text-amber-500 truncate",
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
							const reel = entry.item;
							const globalIndex = startIndex + entry.originalIndex;
							const count = reel.views || viewsFor(reel.title);
							return /* @__PURE__ */ jsxs("div", {
								onClick: () => setActiveModalIndex(globalIndex),
								className: "group cursor-pointer flex flex-col",
								children: [/* @__PURE__ */ jsxs("div", {
									className: "relative aspect-[9/16] w-full overflow-hidden rounded-lg sm:rounded-xl bg-black border border-border/40 shadow-sm transition duration-300 group-hover:scale-[1.02] group-hover:shadow-md",
									children: [
										/* @__PURE__ */ jsx("img", {
											src: reel.img,
											alt: reel.title,
											loading: "lazy",
											className: "h-full w-full object-cover transition duration-500 group-hover:scale-105"
										}),
										/* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" }),
										reel.kicker && /* @__PURE__ */ jsx("span", {
											className: "absolute left-1.5 top-1.5 sm:left-2 sm:top-2 bg-blue-600 px-1.5 py-0.5 text-[8px] sm:text-[10px] font-bold text-white rounded shadow-sm",
											children: reel.kicker
										}),
										/* @__PURE__ */ jsx("div", {
											className: "hidden md:block",
											children: /* @__PURE__ */ jsx("h3", {
												className: "absolute bottom-8 md:bottom-9 left-1.5 right-1.5 md:left-2 md:right-2 text-[9px] md:text-xs font-bold leading-tight text-white drop-shadow line-clamp-2",
												children: reel.title
											})
										}),
										/* @__PURE__ */ jsxs("div", {
											className: "absolute bottom-1.5 left-1.5 sm:bottom-2 sm:left-2 flex items-center gap-1 sm:gap-1.5",
											children: [/* @__PURE__ */ jsx("span", {
												className: "flex h-5 w-5 sm:h-6 sm:w-6 items-center justify-center rounded-full bg-white text-black shadow transition-transform group-hover:scale-110",
												children: /* @__PURE__ */ jsx(Play, { className: "h-2.5 w-2.5 sm:h-3 sm:w-3 fill-current ml-0.5" })
											}), /* @__PURE__ */ jsx("span", {
												className: "text-[8px] sm:text-[10px] font-semibold text-white drop-shadow",
												children: reel.duration
											})]
										})
									]
								}), /* @__PURE__ */ jsxs("div", {
									className: "mt-1 flex items-center gap-1 text-[9px] sm:text-[11px] text-muted-foreground",
									children: [/* @__PURE__ */ jsx(Eye, { className: "h-2.5 w-2.5 sm:h-3 sm:w-3 text-muted-foreground/70" }), /* @__PURE__ */ jsx("span", { children: formatViews(count) })]
								})]
							}, reel.title + index);
						})
					}),
					totalPages > 1 && /* @__PURE__ */ jsxs("div", {
						className: "mt-10 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-border pt-6",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "text-xs text-muted-foreground order-2 sm:order-1",
							children: [
								"Showing ",
								/* @__PURE__ */ jsx("strong", {
									className: "text-foreground",
									children: startIndex + 1
								}),
								"-",
								/* @__PURE__ */ jsx("strong", {
									className: "text-foreground",
									children: Math.min(startIndex + ITEMS_PER_PAGE, totalItems)
								}),
								" ",
								"of ",
								/* @__PURE__ */ jsx("strong", {
									className: "text-foreground",
									children: totalItems
								}),
								" reels"
							]
						}), /* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-1.5 order-1 sm:order-2",
							children: [
								validPage > 1 ? /* @__PURE__ */ jsxs(Link, {
									to: "/reels",
									search: { page: validPage - 1 },
									className: "flex h-9 items-center gap-1 rounded-lg border border-border px-3 text-xs font-semibold text-foreground transition hover:bg-foreground hover:text-background",
									children: [/* @__PURE__ */ jsx(ChevronLeft, { className: "h-4 w-4" }), /* @__PURE__ */ jsx("span", { children: "Prev" })]
								}) : /* @__PURE__ */ jsxs("span", {
									className: "flex h-9 items-center gap-1 rounded-lg border border-border/40 px-3 text-xs font-semibold text-muted-foreground/40 cursor-not-allowed",
									children: [/* @__PURE__ */ jsx(ChevronLeft, { className: "h-4 w-4" }), /* @__PURE__ */ jsx("span", { children: "Prev" })]
								}),
								Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
									return /* @__PURE__ */ jsx(Link, {
										to: "/reels",
										search: { page: pageNum },
										className: `flex h-9 w-9 items-center justify-center rounded-lg text-xs font-bold transition ${pageNum === validPage ? "bg-foreground text-background shadow" : "border border-border text-foreground hover:bg-muted"}`,
										children: pageNum
									}, pageNum);
								}),
								validPage < totalPages ? /* @__PURE__ */ jsxs(Link, {
									to: "/reels",
									search: { page: validPage + 1 },
									className: "flex h-9 items-center gap-1 rounded-lg border border-border px-3 text-xs font-semibold text-foreground transition hover:bg-foreground hover:text-background",
									children: [/* @__PURE__ */ jsx("span", { children: "Next" }), /* @__PURE__ */ jsx(ChevronRight, { className: "h-4 w-4" })]
								}) : /* @__PURE__ */ jsxs("span", {
									className: "flex h-9 items-center gap-1 rounded-lg border border-border/40 px-3 text-xs font-semibold text-muted-foreground/40 cursor-not-allowed",
									children: [/* @__PURE__ */ jsx("span", { children: "Next" }), /* @__PURE__ */ jsx(ChevronRight, { className: "h-4 w-4" })]
								})
							]
						})]
					}),
					activeModalIndex !== null && /* @__PURE__ */ jsx(ReelViewerModal, {
						initialIndex: activeModalIndex,
						items: allReels,
						onClose: () => setActiveModalIndex(null)
					})
				]
			}),
			/* @__PURE__ */ jsx(Footer, {})
		]
	});
}
//#endregion
export { ReelsPage as component };

//# sourceMappingURL=reels-DqXcR3IQ.js.map