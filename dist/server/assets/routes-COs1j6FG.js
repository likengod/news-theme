import { a as isEnterprisePlusLicense } from "./site-settings-BOVgVzPb.js";
import { f as loadAdSlotMode, m as loadAds, p as loadAdSlotScript } from "./ads-storage-B9YKHH-7.js";
import { a as useSiteSettings, n as useAdSettings } from "./AdSettingsContext-nDoDCD7P.js";
import { n as getArticleImage, t as formatViews } from "./news-data-BCdeOjjW.js";
import { s as articlesByCategory } from "./homepage-config-BXd7t1_s.js";
import { t as useHomepageConfig } from "./use-homepage-config-Je7sUrw6.js";
import { t as cn } from "./utils-C_uf36nf.js";
import { n as MinRead, t as HeadlineArticle } from "./HeadlineArticle-BKksBFw2.js";
import { t as Header } from "./Header-CLYHN8zk.js";
import { t as Route } from "./routes-Dko9xhan.js";
import React, { Suspense, lazy, useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
//#region src/components/ui/AnimatedContainer.tsx
function AnimatedContainer({ children, className }) {
	return /* @__PURE__ */ jsx("div", {
		className: cn("transition-opacity duration-300", className),
		children
	});
}
//#endregion
//#region src/components/site/hero/HeroSidebarLeft.tsx
function HeroSidebarLeft({ activeLeftItems }) {
	return /* @__PURE__ */ jsx("div", {
		className: "divide-y divide-border lg:col-span-4",
		children: activeLeftItems.map((it, i) => {
			let visibilityClass = "";
			if (i >= 5) visibilityClass = "hidden 2xl:block";
			return /* @__PURE__ */ jsx("div", {
				className: `${i === 0 ? "pb-3" : "py-3"} ${visibilityClass}`,
				children: /* @__PURE__ */ jsx(HeadlineArticle, {
					item: it,
					dense: true,
					priority: i === 0
				})
			}, `${it.title}-${i}`);
		})
	});
}
//#endregion
//#region src/components/site/hero/HeroMain.tsx
var LiveVideo = React.lazy(() => import("./LiveVideo-6AhlnX7a.js").then((m) => ({ default: m.LiveVideo })));
var HeroFeaturedSlider = React.lazy(() => import("./HeroFeaturedSlider-CN3UKa9i.js").then((m) => ({ default: m.default })));
var isRealAd = (ad) => {
	const img = ad?.imageLandscape || ad?.image || ad?.imagePortrait || "";
	return !!img && !img.includes("placehold.co");
};
function HeroMain({ activeLeads, cfg }) {
	const ctx = useAdSettings();
	const isEnterprisePlus = isEnterprisePlusLicense(useSiteSettings() || ctx?.settings);
	const configSlides = ctx?.adConfig?.slots?.hero_showcase;
	const initialAds = isEnterprisePlus && configSlides && configSlides.length > 0 ? configSlides.filter(isRealAd) : [];
	const [featuredAds, setFeaturedAds] = React.useState(initialAds);
	const [featuredAdMode, setFeaturedAdMode] = React.useState(ctx?.adConfig?.modes?.hero_showcase || "image");
	const [featuredAdScript, setFeaturedAdScript] = React.useState(ctx?.adConfig?.scripts?.hero_showcase || "");
	React.useEffect(() => {
		if (!isEnterprisePlus) {
			setFeaturedAds([]);
			return;
		}
		if (ctx?.adConfig) {
			const s = ctx.adConfig.slots?.hero_showcase;
			if (s && s.length > 0) setFeaturedAds(s.filter(isRealAd));
			else {
				const local = loadAds("hero_showcase");
				setFeaturedAds(local && local.length > 0 ? local.filter(isRealAd) : []);
			}
			setFeaturedAdMode(ctx.adConfig.modes?.hero_showcase || "image");
			setFeaturedAdScript(ctx.adConfig.scripts?.hero_showcase || "");
		}
	}, [ctx?.adConfig, isEnterprisePlus]);
	React.useEffect(() => {
		if (!isEnterprisePlus) return;
		const sync = () => {
			const local = loadAds("hero_showcase");
			if (local && local.length > 0) setFeaturedAds(local.filter(isRealAd));
			else if (ctx?.adConfig?.slots?.hero_showcase && ctx.adConfig.slots.hero_showcase.length > 0) setFeaturedAds(ctx.adConfig.slots.hero_showcase.filter(isRealAd));
			else setFeaturedAds([]);
			setFeaturedAdMode(loadAdSlotMode("hero_showcase"));
			setFeaturedAdScript(loadAdSlotScript("hero_showcase"));
		};
		window.addEventListener("nt:ads-updated", sync);
		return () => window.removeEventListener("nt:ads-updated", sync);
	}, [ctx?.adConfig, isEnterprisePlus]);
	const showMultiple = cfg?.heroFeatured?.showMultiple !== false;
	const autoSlide = cfg?.heroFeatured?.autoSlide !== false;
	const slideInterval = (cfg?.heroFeatured?.slideInterval ?? 5) * 1e3;
	const allLeads = activeLeads || [];
	const leads = showMultiple ? allLeads : allLeads.slice(0, 1);
	const featured = leads[0];
	const hasMultipleItems = showMultiple && (leads.length > 1 || featuredAds.length > 0);
	const renderSingleLead = () => {
		if (!featured) return null;
		return /* @__PURE__ */ jsxs(Link, {
			to: "/news/$slug",
			params: { slug: featured.slug || "sample" },
			className: "group block",
			children: [
				/* @__PURE__ */ jsx("div", {
					className: "overflow-hidden relative rounded-xl border border-border/40 bg-black/5 dark:bg-black/30 flex items-center justify-center",
					children: /* @__PURE__ */ jsx("img", {
						src: featured.img,
						alt: "",
						"aria-hidden": "true",
						loading: "eager",
						fetchPriority: "high",
						decoding: "sync",
						sizes: "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 800px",
						width: 800,
						height: 500,
						className: "w-full h-auto max-h-[480px] object-contain object-center transition-transform duration-500 group-hover:scale-[1.02]"
					})
				}),
				/* @__PURE__ */ jsx("h2", {
					className: "headline mt-3 text-xl font-bold text-foreground group-hover:underline md:mt-4 md:text-3xl",
					children: featured.title
				}),
				/* @__PURE__ */ jsx("p", {
					className: "mt-2 line-clamp-2 text-sm text-muted-foreground",
					children: featured.dek ?? featured.excerpt ?? ""
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "mt-3 flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-wider text-muted-foreground md:hidden",
					children: [
						/* @__PURE__ */ jsx("span", { children: featured.author }),
						/* @__PURE__ */ jsx("span", { children: "•" }),
						/* @__PURE__ */ jsxs("span", {
							className: "inline-flex items-center gap-1",
							children: [
								/* @__PURE__ */ jsxs("svg", {
									xmlns: "http://www.w3.org/2000/svg",
									width: "24",
									height: "24",
									viewBox: "0 0 24 24",
									fill: "none",
									stroke: "currentColor",
									strokeWidth: "2",
									strokeLinecap: "round",
									strokeLinejoin: "round",
									className: "h-3 w-3",
									children: [/* @__PURE__ */ jsx("path", { d: "M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" }), /* @__PURE__ */ jsx("circle", {
										cx: "12",
										cy: "12",
										r: "3"
									})]
								}),
								formatViews(Number(featured.views) || 0),
								" views"
							]
						}),
						/* @__PURE__ */ jsx("span", { children: "•" }),
						/* @__PURE__ */ jsx("span", {
							className: "font-bold text-foreground",
							children: featured.kicker || "Featured"
						})
					]
				}),
				/* @__PURE__ */ jsx("div", {
					className: "hidden md:block",
					children: /* @__PURE__ */ jsx(MinRead, {
						seed: featured.title,
						kicker: featured.kicker || "Featured",
						author: featured.author,
						views: featured.views
					})
				})
			]
		});
	};
	return /* @__PURE__ */ jsxs("div", {
		className: "flex flex-col gap-8 lg:col-span-8 lg:border-l lg:border-border lg:pl-8 w-full max-w-full min-w-0 overflow-hidden",
		children: [/* @__PURE__ */ jsx("article", {
			className: "w-full max-w-full min-w-0 overflow-hidden",
			children: hasMultipleItems ? /* @__PURE__ */ jsx(React.Suspense, {
				fallback: renderSingleLead(),
				children: /* @__PURE__ */ jsx(HeroFeaturedSlider, {
					leads,
					featuredAds,
					featuredAdMode,
					featuredAdScript,
					showMultiple,
					autoSlide,
					slideInterval,
					isEnterprisePlus
				})
			}) : renderSingleLead()
		}), /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(React.Suspense, {
			fallback: null,
			children: /* @__PURE__ */ jsx(LiveVideo, {})
		}) })]
	});
}
//#endregion
//#region src/components/site/hero/HeroBottomGrid.tsx
function HeroBottomGrid({ cfg, activeBottomItems }) {
	if (!activeBottomItems || !Array.isArray(activeBottomItems) || activeBottomItems.length === 0) return null;
	return /* @__PURE__ */ jsxs("div", {
		className: "mt-10 border-t border-border pt-6 w-full max-w-full min-w-0 overflow-hidden",
		children: [/* @__PURE__ */ jsx("h2", {
			className: "mb-6 font-bold uppercase tracking-[0.25em]",
			style: {
				color: cfg.heroTopStories.color,
				fontSize: `${cfg.heroTopStories.fontSize}px`
			},
			children: cfg.heroTopStories.title
		}), /* @__PURE__ */ jsxs("div", {
			className: "grid gap-8 md:grid-cols-2 lg:grid-cols-3 w-full max-w-full min-w-0",
			children: [
				/* @__PURE__ */ jsxs("div", {
					className: "flex flex-col h-full w-full min-w-0",
					children: [activeBottomItems[0] && /* @__PURE__ */ jsxs(Link, {
						to: "/news/$slug",
						params: { slug: activeBottomItems[0]?.slug || "sample" },
						className: "group block",
						children: [
							activeBottomItems[0].img && /* @__PURE__ */ jsx("div", {
								className: "overflow-hidden bg-muted",
								children: /* @__PURE__ */ jsx("img", {
									src: activeBottomItems[0].img,
									alt: "",
									"aria-hidden": "true",
									loading: "lazy",
									decoding: "async",
									width: 400,
									height: 225,
									className: "aspect-[16/9] w-full object-cover transition-transform duration-500 group-hover:scale-105"
								})
							}),
							/* @__PURE__ */ jsx("h3", {
								className: "headline mt-4 text-xl text-foreground group-hover:underline [-webkit-line-clamp:3] [max-height:none]",
								children: activeBottomItems[0].title
							}),
							/* @__PURE__ */ jsx("p", {
								className: "mt-2 text-sm leading-relaxed text-muted-foreground [-webkit-line-clamp:6] [display:-webkit-box] [-webkit-box-orient:vertical] overflow-hidden",
								children: activeBottomItems[0].excerpt
							}),
							/* @__PURE__ */ jsx(MinRead, {
								seed: activeBottomItems[0].title,
								kicker: activeBottomItems[0].kicker,
								author: activeBottomItems[0].author,
								views: activeBottomItems[0].views
							})
						]
					}), activeBottomItems[5] && /* @__PURE__ */ jsx("div", {
						className: "hidden lg:block 2xl:hidden mt-auto border-t border-border pt-6 pb-2",
						children: /* @__PURE__ */ jsx(HeadlineArticle, {
							item: activeBottomItems[5],
							dense: true
						})
					})]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "flex flex-col h-full w-full min-w-0",
					children: [activeBottomItems[1] && /* @__PURE__ */ jsxs(Link, {
						to: "/news/$slug",
						params: { slug: activeBottomItems[1]?.slug || "sample" },
						className: "group block border-t border-border pt-6 md:border-t-0 md:pt-0",
						children: [
							activeBottomItems[1].img && /* @__PURE__ */ jsx("div", {
								className: "hidden md:block overflow-hidden bg-muted",
								children: /* @__PURE__ */ jsx("img", {
									src: activeBottomItems[1].img,
									alt: "",
									"aria-hidden": "true",
									loading: "lazy",
									decoding: "async",
									width: 400,
									height: 225,
									className: "aspect-[16/9] w-full object-cover transition-transform duration-500 group-hover:scale-105"
								})
							}),
							/* @__PURE__ */ jsx("h3", {
								className: "headline mt-0 md:mt-4 text-xl text-foreground group-hover:underline line-clamp-2 [-webkit-line-clamp:2] [max-height:none]",
								children: activeBottomItems[1].title
							}),
							/* @__PURE__ */ jsx("p", {
								className: "mt-2 text-sm leading-relaxed text-muted-foreground [-webkit-line-clamp:6] [display:-webkit-box] [-webkit-box-orient:vertical] overflow-hidden",
								children: activeBottomItems[1].excerpt
							}),
							/* @__PURE__ */ jsx(MinRead, {
								seed: activeBottomItems[1].title,
								kicker: activeBottomItems[1].kicker,
								author: activeBottomItems[1].author,
								views: activeBottomItems[1].views
							})
						]
					}), activeBottomItems[6] && /* @__PURE__ */ jsx("div", {
						className: "hidden lg:block 2xl:hidden mt-auto border-t border-border pt-6 pb-2",
						children: /* @__PURE__ */ jsx(HeadlineArticle, {
							item: activeBottomItems[6],
							dense: true
						})
					})]
				}),
				activeBottomItems.length > 2 && /* @__PURE__ */ jsx("div", {
					className: "divide-y divide-border border-t border-border pt-6 md:border-t-0 md:pt-0 md:col-span-2 lg:col-span-1",
					children: activeBottomItems.slice(2, 5).map((item, idx) => {
						if (!item) return null;
						return /* @__PURE__ */ jsx("div", {
							className: idx === 0 ? "pb-5" : idx === 1 ? "py-5" : "pt-5",
							children: /* @__PURE__ */ jsx(HeadlineArticle, {
								item,
								dense: true
							})
						}, `${item.title || "item"}-${idx}`);
					})
				})
			]
		})]
	});
}
//#endregion
//#region src/components/site/hero/HeroCultureRow.tsx
function HeroCultureRow({ cfg, activeCultureItems }) {
	return /* @__PURE__ */ jsxs("div", {
		className: "mt-10 border-t border-border pt-6 w-full max-w-full min-w-0 overflow-hidden",
		children: [/* @__PURE__ */ jsx("h2", {
			className: "mb-6 font-bold uppercase tracking-[0.25em]",
			style: {
				color: cfg.heroCultureMusic.color,
				fontSize: `${cfg.heroCultureMusic.fontSize}px`
			},
			children: cfg.heroCultureMusic.title
		}), /* @__PURE__ */ jsx("div", {
			className: "grid gap-6 sm:grid-cols-2 lg:grid-cols-4 w-full max-w-full min-w-0",
			children: activeCultureItems.map((c, i) => /* @__PURE__ */ jsxs(Link, {
				to: "/news/$slug",
				params: { slug: c?.slug || "sample" },
				className: "group flex flex-col h-full w-full max-w-full min-w-0",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "relative overflow-hidden rounded-lg",
						children: [
							/* @__PURE__ */ jsx("img", {
								src: c.img,
								alt: "",
								"aria-hidden": "true",
								loading: "lazy",
								decoding: "async",
								width: 400,
								height: 225,
								className: "aspect-[16/9] w-full object-cover transition-transform duration-500 group-hover:scale-105"
							}),
							c.play && /* @__PURE__ */ jsx("span", {
								className: "absolute inset-0 grid place-items-center",
								children: /* @__PURE__ */ jsx("span", {
									className: "grid h-12 w-12 place-items-center rounded-full border-2 border-white/90 bg-black/30 text-white",
									children: "▶"
								})
							}),
							/* @__PURE__ */ jsxs("span", {
								className: "absolute bottom-2 left-2 bg-black px-2 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-white",
								children: [formatViews(Number(c.views) || 0), " views"]
							})
						]
					}),
					/* @__PURE__ */ jsx("h3", {
						className: "headline mt-3 line-clamp-2 text-lg leading-tight text-foreground group-hover:underline break-words",
						children: c.title
					}),
					/* @__PURE__ */ jsx("p", {
						className: "mt-2 line-clamp-2 text-sm leading-snug text-muted-foreground break-words",
						children: c.excerpt
					}),
					/* @__PURE__ */ jsxs("p", {
						className: "mt-auto pt-3 flex items-center gap-2 text-[11px] uppercase tracking-wider text-muted-foreground",
						children: [
							/* @__PURE__ */ jsx("span", { children: c.date }),
							/* @__PURE__ */ jsx("span", { children: "·" }),
							/* @__PURE__ */ jsx("span", {
								className: "kicker text-[10px]",
								children: c.kicker
							})
						]
					})
				]
			}, `${c?.title || "culture"}-${i}`))
		})]
	});
}
//#endregion
//#region src/components/site/HeroBoard.tsx
var HeroSidebarRight = React.lazy(() => import("./HeroSidebarRight-Xk7QueLO.js").then((m) => ({ default: m.HeroSidebarRight })));
function formatUtcDate(dateStr) {
	const d = new Date(dateStr);
	if (isNaN(d.getTime())) return "";
	return `${[
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
	][d.getUTCMonth()]} ${d.getUTCDate()}, ${d.getUTCFullYear()}`;
}
var HeroBoard = React.memo(function HeroBoard({ articles = [], tags = [], usedIds }) {
	const cfg = useHomepageConfig();
	const hasDbArticles = articles.length > 0;
	const { activeLeads, activeLeftItems, activeBottomItems, activePopularItems, activeOpinionItems, activeCultureItems } = React.useMemo(() => {
		const localUsed = /* @__PURE__ */ new Set();
		function getUnique(pool, count, filterFn) {
			const selected = [];
			for (const a of pool) {
				if (localUsed.has(a.id)) continue;
				if (filterFn && !filterFn(a)) continue;
				selected.push(a);
				localUsed.add(a.id);
				if (selected.length === count) break;
			}
			return selected;
		}
		function matchesCat(catStr, target) {
			if (!target || target === "Auto (Latest)") return true;
			if (!catStr) return false;
			return catStr.split(",").map((c) => c.trim().toLowerCase()).includes(target.toLowerCase());
		}
		const featuredCategory = cfg?.heroFeatured?.category || "Auto (Latest)";
		const leads = getUnique(articles, cfg?.heroFeatured?.slideCount ?? 3, (a) => matchesCat(a.category, featuredCategory)).map((a, i) => ({
			kicker: a.category,
			title: a.title,
			dek: a.excerpt || a.content?.replace(/<[^>]*>/g, "").slice(0, 150) + "...",
			author: `By ${a.author || "Newsroom"}`,
			time: formatUtcDate(a.date),
			img: getArticleImage(a.featuredImage, i),
			views: a.views || 0,
			slug: a.slug
		}));
		const left = getUnique(articles, 7).map((a, i) => ({
			kicker: a.category,
			title: a.title,
			excerpt: a.excerpt || a.content?.replace(/<[^>]*>/g, "").slice(0, 100) + "...",
			img: i === 2 ? getArticleImage(a.featuredImage, i + 7) : void 0,
			slug: a.slug,
			author: a.author || "Admin User",
			views: Number(a.views) || 0
		}));
		const bottom = getUnique(articles, 7).map((a, i) => ({
			kicker: a.category,
			title: a.title,
			excerpt: a.excerpt || a.content?.replace(/<[^>]*>/g, "").slice(0, 150) + "...",
			img: i < 2 ? getArticleImage(a.featuredImage, i + 12) : void 0,
			slug: a.slug,
			author: a.author || "Admin User",
			views: Number(a.views) || 0
		}));
		const popularCategory = cfg?.heroPopular?.category || "Auto (Latest)";
		const popular = getUnique(articles, 4, (a) => matchesCat(a.category, popularCategory)).map((a, i) => ({
			title: a.title,
			by: a.author || "Admin User",
			img: getArticleImage(a.featuredImage, i + 18),
			views: Number(a.views) || 0,
			slug: a.slug
		}));
		const opinionCategory = cfg?.heroOpinion?.category || "Opinion";
		const opinion = getUnique(articles, 6, (a) => matchesCat(a.category, opinionCategory)).map((a, i) => ({
			title: a.title,
			by: a.author || "Admin User",
			img: getArticleImage(a.featuredImage, i + 22),
			slug: a.slug,
			views: Number(a.views) || 0
		}));
		const cultureCategory = cfg?.heroCultureMusic?.category || "Auto (Latest)";
		return {
			activeLeads: leads,
			activeLeftItems: left,
			activeBottomItems: bottom,
			activePopularItems: popular,
			activeOpinionItems: opinion,
			activeCultureItems: getUnique(articles, 4, (a) => matchesCat(a.category, cultureCategory)).map((a, i) => ({
				title: a.title,
				kicker: a.category,
				excerpt: a.excerpt || a.content?.replace(/<[^>]*>/g, "").slice(0, 80) + "...",
				date: formatUtcDate(a.date),
				img: getArticleImage(a.featuredImage, i + 28),
				slug: a.slug,
				author: a.author || "Admin User",
				views: Number(a.views) || 0
			}))
		};
	}, [articles, cfg]);
	if (articles.length === 0) return /* @__PURE__ */ jsxs("div", {
		className: "py-16 text-center text-muted-foreground border-b border-border",
		children: [/* @__PURE__ */ jsx("p", {
			className: "text-lg font-medium",
			children: "No published articles yet."
		}), /* @__PURE__ */ jsx("p", {
			className: "text-sm mt-1",
			children: "Articles published in the Admin Panel will appear here."
		})]
	});
	return /* @__PURE__ */ jsx(AnimatedContainer, {
		className: "border-b border-border py-4 md:py-8 w-full max-w-full min-w-0 overflow-hidden",
		children: /* @__PURE__ */ jsxs("div", {
			className: "grid gap-8 lg:grid-cols-12 w-full max-w-full min-w-0",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "lg:col-span-9 w-full max-w-full min-w-0",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "grid gap-8 lg:grid-cols-12 w-full max-w-full min-w-0",
						children: [/* @__PURE__ */ jsx(HeroMain, {
							hasDbArticles,
							activeLeads,
							cfg,
							articlesByCategory
						}), /* @__PURE__ */ jsx("div", {
							className: "hidden lg:col-span-4 lg:block lg:order-first",
							children: /* @__PURE__ */ jsx(HeroSidebarLeft, { activeLeftItems })
						})]
					}),
					/* @__PURE__ */ jsx(HeroBottomGrid, {
						cfg,
						activeBottomItems
					}),
					/* @__PURE__ */ jsx(HeroCultureRow, {
						cfg,
						activeCultureItems
					})
				]
			}), /* @__PURE__ */ jsx(React.Suspense, {
				fallback: null,
				children: /* @__PURE__ */ jsx(HeroSidebarRight, {
					cfg,
					activeOpinionItems,
					activePopularItems,
					tags
				})
			})]
		})
	});
});
//#endregion
//#region src/components/site/LazySection.tsx
/**
* Renders children only when the placeholder scrolls near the viewport.
* Reserves vertical space via minHeight to prevent layout shift (CLS).
*/
function LazySection({ children, minHeight = 400, rootMargin = "300px", fallback }) {
	const ref = useRef(null);
	const [visible, setVisible] = useState(false);
	useEffect(() => {
		if (visible) return;
		const el = ref.current;
		if (!el) return;
		if (typeof IntersectionObserver === "undefined") {
			setVisible(true);
			return;
		}
		const io = new IntersectionObserver((entries) => {
			if (entries.some((e) => e.isIntersecting)) {
				setVisible(true);
				io.disconnect();
			}
		}, { rootMargin });
		io.observe(el);
		return () => io.disconnect();
	}, [visible, rootMargin]);
	return /* @__PURE__ */ jsx("div", {
		ref,
		style: !visible ? { minHeight } : void 0,
		children: visible ? /* @__PURE__ */ jsx(Suspense, {
			fallback: fallback ?? /* @__PURE__ */ jsx(SectionSkeleton, { height: minHeight }),
			children
		}) : fallback ?? /* @__PURE__ */ jsx(SectionSkeleton, { height: minHeight })
	});
}
function SectionSkeleton({ height }) {
	return /* @__PURE__ */ jsx("div", {
		"aria-hidden": "true",
		className: "animate-pulse bg-muted/30",
		style: { minHeight: height }
	});
}
//#endregion
//#region src/routes/index.tsx?tsr-split=component
var Columnists = lazy(() => import("./Columnists-BNaiu3aP.js").then((m) => ({ default: m.Columnists })));
var NewsGrid = lazy(() => import("./NewsGrid-VZHtTlFu.js").then((m) => ({ default: m.NewsGrid })));
var ReelsSection = lazy(() => import("./ReelsSection-BHnQ2BkD.js").then((m) => ({ default: m.ReelsSection })));
var MarketsMagazine = lazy(() => import("./MarketsMagazine-Dig07ZEF.js").then((m) => ({ default: m.MarketsMagazine })));
var Footer = lazy(() => import("./Footer-C0Rib9kx.js").then((n) => n.n).then((m) => ({ default: m.Footer })));
function Home() {
	const { articles: dbArticles, tags: dbTags } = Route.useLoaderData();
	const usedIds = /* @__PURE__ */ new Set();
	return /* @__PURE__ */ jsxs("div", {
		className: "min-h-screen bg-background text-foreground overflow-x-clip w-full max-w-full",
		children: [
			/* @__PURE__ */ jsx(Header, { breakingArticles: dbArticles }),
			/* @__PURE__ */ jsxs("main", {
				className: "mx-auto max-w-7xl px-4 py-4 md:py-10 w-full max-w-full min-w-0 overflow-x-clip",
				children: [
					/* @__PURE__ */ jsx("div", {
						className: "block md:hidden border-b border-border mb-2 pb-2 overflow-hidden",
						children: /* @__PURE__ */ jsx(Suspense, {
							fallback: null,
							children: /* @__PURE__ */ jsx(Columnists, { hideTitle: true })
						})
					}),
					/* @__PURE__ */ jsx(HeroBoard, {
						articles: dbArticles,
						tags: dbTags
					}),
					/* @__PURE__ */ jsx("div", {
						className: "hidden md:block",
						children: /* @__PURE__ */ jsx(LazySection, {
							minHeight: 200,
							rootMargin: "400px",
							children: /* @__PURE__ */ jsx(Columnists, {})
						})
					}),
					/* @__PURE__ */ jsx(LazySection, {
						minHeight: 600,
						rootMargin: "400px",
						children: /* @__PURE__ */ jsx(NewsGrid, {
							articles: dbArticles,
							usedIds
						})
					}),
					/* @__PURE__ */ jsx(LazySection, {
						minHeight: 400,
						rootMargin: "300px",
						children: /* @__PURE__ */ jsx(ReelsSection, {})
					}),
					/* @__PURE__ */ jsx(LazySection, {
						minHeight: 500,
						rootMargin: "300px",
						children: /* @__PURE__ */ jsx(MarketsMagazine, {
							articles: dbArticles,
							usedIds
						})
					})
				]
			}),
			/* @__PURE__ */ jsx(LazySection, {
				minHeight: 300,
				rootMargin: "200px",
				children: /* @__PURE__ */ jsx(Footer, {})
			})
		]
	});
}
//#endregion
export { Home as component };

//# sourceMappingURL=routes-COs1j6FG.js.map