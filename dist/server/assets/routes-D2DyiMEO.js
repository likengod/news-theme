import { d as loadAdSlotMode, f as loadAdSlotScript, l as injectReelAds, p as loadAds, r as defaultAdSlidesHome2 } from "./ads-storage-DzvZ8vdI.js";
import { n as useAdSettings } from "./AdSettingsContext-BkhFbsEU.js";
import { c as top, i as lead, l as viewsFor, n as getArticleImage, r as grid, t as formatViews } from "./news-data-CFwG4BZ_.js";
import { t as ScriptAdRenderer } from "./ScriptAdRenderer-CHXwBV65.js";
import { t as Advertisement } from "./Advertisement-BP-PRf4U.js";
import { i as SocialIcons } from "./theme-Dgo_akud.js";
import { n as articlesByCategory } from "./homepage-config-KmTwCGjP.js";
import { t as useHomepageConfig } from "./use-homepage-config-vtHvc_JW.js";
import { t as useIsMobile } from "./use-mobile-Dt1uRu8S.js";
import { t as cn } from "./utils-C_uf36nf.js";
import { t as Header } from "./Header-B3gpV5PI.js";
import { t as Route } from "./routes-DZiNvqWT.js";
import { t as ArchiveFinder } from "./ArchiveFinder-CRW_hGql.js";
import { t as Views } from "./Views-BFqx-XE-.js";
import { t as Button } from "./button-CtdWWMYi.js";
import * as React$1 from "react";
import React, { Suspense, lazy, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight, ExternalLink, Play, Radio, Sparkles, Volume2, VolumeX } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
//#region src/components/ui/AnimatedContainer.tsx
function AnimatedContainer({ children, className }) {
	return /* @__PURE__ */ jsx("div", {
		className: cn("transition-opacity duration-300", className),
		children
	});
}
//#endregion
//#region src/components/site/HeadlineArticle.tsx
var AUTHORS = [
	"Claire Bennett",
	"Lucas Hayes",
	"Maya Chen",
	"Daniel Cole",
	"Priya Raman",
	"Noah Whitfield"
];
function authorFor(seed) {
	if (!seed) return AUTHORS[0];
	let h = 0;
	for (let i = 0; i < seed.length; i++) h = h * 31 + seed.charCodeAt(i) >>> 0;
	return AUTHORS[h % AUTHORS.length];
}
function MinRead({ seed, kicker }) {
	return /* @__PURE__ */ jsxs("span", {
		className: "mt-3 inline-flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-muted-foreground",
		children: [
			/* @__PURE__ */ jsxs("span", {
				className: "font-medium text-foreground",
				children: ["By ", authorFor(seed)]
			}),
			seed && /* @__PURE__ */ jsx(Views, { count: viewsFor(seed) }),
			kicker && /* @__PURE__ */ jsx("span", {
				className: "kicker whitespace-nowrap text-[10px]",
				children: kicker
			})
		]
	});
}
function HeadlineArticle({ item, dense = false, priority = false }) {
	if (!item) return null;
	return /* @__PURE__ */ jsxs(Link, {
		to: "/news/$slug",
		params: { slug: item.slug || "sample" },
		className: "group block",
		suppressHydrationWarning: true,
		children: [
			item.img && /* @__PURE__ */ jsx("div", {
				className: "mb-3 overflow-hidden",
				children: /* @__PURE__ */ jsx("img", {
					src: item.img,
					alt: item.title,
					loading: priority ? "eager" : "lazy",
					fetchPriority: priority ? "high" : "auto",
					decoding: priority ? "sync" : "async",
					width: 400,
					height: 250,
					className: "aspect-[16/10] w-full object-cover transition-transform duration-500 group-hover:scale-105"
				})
			}),
			/* @__PURE__ */ jsx("h3", {
				className: `headline text-foreground group-hover:underline ${dense ? "text-lg" : "text-xl"}`,
				suppressHydrationWarning: true,
				children: item.title
			}),
			item.excerpt && /* @__PURE__ */ jsx("p", {
				className: "mt-2 line-clamp-2 text-sm leading-snug text-muted-foreground",
				children: item.excerpt
			}),
			/* @__PURE__ */ jsx(MinRead, {
				seed: item.title,
				kicker: item.kicker
			})
		]
	});
}
//#endregion
//#region src/components/site/hero/HeroSidebarLeft.tsx
function HeroSidebarLeft({ activeLeftItems }) {
	return /* @__PURE__ */ jsx("div", {
		className: "divide-y divide-border lg:col-span-4",
		children: activeLeftItems.map((it, i) => /* @__PURE__ */ jsx("div", {
			className: i === 0 ? "pb-3" : "py-3",
			children: /* @__PURE__ */ jsx(HeadlineArticle, {
				item: it,
				dense: true,
				priority: i === 0
			})
		}, `${it.title}-${i}`))
	});
}
//#endregion
//#region src/components/site/LiveVideo.tsx
function LiveVideo() {
	const { liveVideo } = useHomepageConfig();
	const [isPlaying, setIsPlaying] = useState(false);
	const [muted, setMuted] = useState(true);
	const iframeRef = useRef(null);
	if (liveVideo?.enabled === false) return null;
	const src = useMemo(() => {
		if (liveVideo.provider === "youtube") {
			const raw = (liveVideo.youtubeChannelId || "").trim();
			let videoId = "";
			let channelId = raw;
			if (raw.includes("watch?v=")) videoId = raw.split("watch?v=")[1]?.split("&")[0] || "";
			else if (raw.includes("youtu.be/")) videoId = raw.split("youtu.be/")[1]?.split("?")[0] || "";
			else if (raw.includes("youtube.com/live/")) videoId = raw.split("youtube.com/live/")[1]?.split("?")[0] || "";
			else if (raw.includes("channel/")) channelId = raw.split("channel/")[1]?.split("/")[0]?.split("?")[0] || raw;
			else if (raw.length === 11 && !raw.startsWith("UC")) videoId = raw;
			if (videoId) return `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&mute=${muted ? 1 : 0}&controls=1&modestbranding=1&rel=0&playsinline=1&enablejsapi=1`;
			return `https://www.youtube-nocookie.com/embed/live_stream?channel=${channelId}&autoplay=1&mute=${muted ? 1 : 0}&controls=1&modestbranding=1&rel=0&playsinline=1&enablejsapi=1`;
		}
		return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(liveVideo.facebookPageUrl)}&show_text=false&autoplay=1&mute=${muted ? 1 : 0}`;
	}, [liveVideo, muted]);
	const toggleMute = (e) => {
		e.stopPropagation();
		if (liveVideo.provider === "youtube" && iframeRef.current?.contentWindow) {
			const cmd = muted ? "unMute" : "mute";
			iframeRef.current.contentWindow.postMessage(JSON.stringify({
				event: "command",
				func: cmd,
				args: []
			}), "*");
		}
		setMuted((m) => !m);
	};
	return /* @__PURE__ */ jsx("article", {
		className: "text-center",
		children: /* @__PURE__ */ jsx("div", {
			className: "relative aspect-[4/3] w-full overflow-hidden bg-black rounded-lg border border-border/40 shadow-sm group",
			children: isPlaying ? /* @__PURE__ */ jsxs(Fragment, { children: [
				/* @__PURE__ */ jsx("iframe", {
					ref: iframeRef,
					src,
					title: liveVideo.title || "Live Stream",
					className: "absolute inset-0 h-full w-full",
					allow: "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share",
					allowFullScreen: true,
					referrerPolicy: "strict-origin-when-cross-origin",
					frameBorder: 0
				}),
				/* @__PURE__ */ jsxs("span", {
					className: "pointer-events-none absolute left-3 top-3 inline-flex items-center gap-1.5 bg-[#dc2626] px-2 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-white z-10 shadow-md",
					children: [/* @__PURE__ */ jsx(Radio, { className: "h-3 w-3 animate-pulse" }), "Live"]
				}),
				/* @__PURE__ */ jsx("button", {
					type: "button",
					onClick: toggleMute,
					"aria-label": muted ? "Unmute sound" : "Mute sound",
					className: "absolute bottom-3 right-3 z-10 inline-flex items-center gap-1.5 rounded-full bg-black/80 px-2.5 py-1 text-xs text-white backdrop-blur transition hover:bg-black cursor-pointer shadow-lg border border-white/10 hover:scale-105",
					children: muted ? /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(VolumeX, { className: "h-3.5 w-3.5 text-red-400 animate-pulse" }), /* @__PURE__ */ jsx("span", {
						className: "text-[11px] font-medium tracking-wide",
						children: "Tap for sound"
					})] }) : /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(Volume2, { className: "h-3.5 w-3.5 text-emerald-400" }), /* @__PURE__ */ jsx("span", {
						className: "text-[11px] font-medium tracking-wide",
						children: "Sound On"
					})] })
				})
			] }) : /* @__PURE__ */ jsxs("button", {
				type: "button",
				onClick: () => setIsPlaying(true),
				"aria-label": `Play ${liveVideo.title || "Live Stream"}`,
				className: "group/btn relative flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-zinc-900 via-black to-zinc-950 text-white cursor-pointer transition hover:brightness-105 focus:outline-none",
				children: [
					liveVideo.thumbnailUrl ? /* @__PURE__ */ jsx("img", {
						src: liveVideo.thumbnailUrl,
						alt: liveVideo.title || "Live",
						className: "absolute inset-0 h-full w-full object-cover opacity-60 group-hover/btn:opacity-75 transition-opacity",
						loading: "lazy",
						decoding: "async"
					}) : /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-red-950/30 via-zinc-950/90 to-black" }),
					/* @__PURE__ */ jsxs("span", {
						className: "pointer-events-none absolute left-3 top-3 z-10 inline-flex items-center gap-1.5 rounded-sm bg-[#dc2626] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-white shadow-md",
						children: [/* @__PURE__ */ jsx(Radio, { className: "h-3.5 w-3.5 animate-pulse text-white" }), "Live Stream"]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "relative z-10 flex flex-col items-center gap-2.5",
						children: [/* @__PURE__ */ jsx("div", {
							className: "flex h-14 w-14 items-center justify-center rounded-full bg-red-600 text-white shadow-xl shadow-red-600/50 transition-all duration-300 group-hover/btn:scale-110 group-hover/btn:bg-red-500",
							children: /* @__PURE__ */ jsx(Play, { className: "h-7 w-7 fill-white ml-1" })
						}), /* @__PURE__ */ jsx("span", {
							className: "rounded bg-black/60 px-3 py-1 text-[11px] font-medium tracking-wide uppercase text-white/90 backdrop-blur-sm shadow",
							children: "Click to Watch Live"
						})]
					}),
					liveVideo.title && /* @__PURE__ */ jsx("div", {
						className: "absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black/95 via-black/60 to-transparent p-3 pt-6 text-left",
						children: /* @__PURE__ */ jsx("p", {
							className: "text-xs font-bold leading-snug text-white line-clamp-1 drop-shadow",
							children: liveVideo.title
						})
					})
				]
			})
		})
	});
}
//#endregion
//#region src/components/ui/carousel.tsx
var CarouselContext = React$1.createContext(null);
function useCarousel() {
	const context = React$1.useContext(CarouselContext);
	if (!context) throw new Error("useCarousel must be used within a <Carousel />");
	return context;
}
var Carousel = React$1.forwardRef(({ orientation = "horizontal", opts, setApi, plugins, className, children, ...props }, ref) => {
	const [carouselRef, api] = useEmblaCarousel({
		...opts,
		axis: orientation === "horizontal" ? "x" : "y"
	}, plugins);
	const [canScrollPrev, setCanScrollPrev] = React$1.useState(false);
	const [canScrollNext, setCanScrollNext] = React$1.useState(false);
	const onSelect = React$1.useCallback((api) => {
		if (!api) return;
		setCanScrollPrev(api.canScrollPrev());
		setCanScrollNext(api.canScrollNext());
	}, []);
	const scrollPrev = React$1.useCallback(() => {
		api?.scrollPrev();
	}, [api]);
	const scrollNext = React$1.useCallback(() => {
		api?.scrollNext();
	}, [api]);
	const handleKeyDown = React$1.useCallback((event) => {
		if (event.key === "ArrowLeft") {
			event.preventDefault();
			scrollPrev();
		} else if (event.key === "ArrowRight") {
			event.preventDefault();
			scrollNext();
		}
	}, [scrollPrev, scrollNext]);
	React$1.useEffect(() => {
		if (!api || !setApi) return;
		setApi(api);
	}, [api, setApi]);
	React$1.useEffect(() => {
		if (!api) return;
		onSelect(api);
		api.on("reInit", onSelect);
		api.on("select", onSelect);
		return () => {
			api?.off("select", onSelect);
		};
	}, [api, onSelect]);
	return /* @__PURE__ */ jsx(CarouselContext.Provider, {
		value: {
			carouselRef,
			api,
			opts,
			orientation: orientation || (opts?.axis === "y" ? "vertical" : "horizontal"),
			scrollPrev,
			scrollNext,
			canScrollPrev,
			canScrollNext
		},
		children: /* @__PURE__ */ jsx("div", {
			ref,
			onKeyDownCapture: handleKeyDown,
			className: cn("relative", className),
			role: "region",
			"aria-roledescription": "carousel",
			...props,
			children
		})
	});
});
Carousel.displayName = "Carousel";
var CarouselContent = React$1.forwardRef(({ className, ...props }, ref) => {
	const { carouselRef, orientation } = useCarousel();
	return /* @__PURE__ */ jsx("div", {
		ref: carouselRef,
		className: "overflow-hidden",
		children: /* @__PURE__ */ jsx("div", {
			ref,
			className: cn("flex", orientation === "horizontal" ? "-ml-4" : "-mt-4 flex-col", className),
			...props
		})
	});
});
CarouselContent.displayName = "CarouselContent";
var CarouselItem = React$1.forwardRef(({ className, ...props }, ref) => {
	const { orientation } = useCarousel();
	return /* @__PURE__ */ jsx("div", {
		ref,
		role: "group",
		"aria-roledescription": "slide",
		className: cn("min-w-0 shrink-0 grow-0 basis-full", orientation === "horizontal" ? "pl-4" : "pt-4", className),
		...props
	});
});
CarouselItem.displayName = "CarouselItem";
var CarouselPrevious = React$1.forwardRef(({ className, variant = "outline", size = "icon", ...props }, ref) => {
	const { orientation, scrollPrev, canScrollPrev } = useCarousel();
	return /* @__PURE__ */ jsxs(Button, {
		ref,
		variant,
		size,
		className: cn("absolute  h-8 w-8 rounded-full", orientation === "horizontal" ? "-left-12 top-1/2 -translate-y-1/2" : "-top-12 left-1/2 -translate-x-1/2 rotate-90", className),
		disabled: !canScrollPrev,
		onClick: scrollPrev,
		...props,
		children: [/* @__PURE__ */ jsx(ArrowLeft, { className: "h-4 w-4" }), /* @__PURE__ */ jsx("span", {
			className: "sr-only",
			children: "Previous slide"
		})]
	});
});
CarouselPrevious.displayName = "CarouselPrevious";
var CarouselNext = React$1.forwardRef(({ className, variant = "outline", size = "icon", ...props }, ref) => {
	const { orientation, scrollNext, canScrollNext } = useCarousel();
	return /* @__PURE__ */ jsxs(Button, {
		ref,
		variant,
		size,
		className: cn("absolute h-8 w-8 rounded-full", orientation === "horizontal" ? "-right-12 top-1/2 -translate-y-1/2" : "-bottom-12 left-1/2 -translate-x-1/2 rotate-90", className),
		disabled: !canScrollNext,
		onClick: scrollNext,
		...props,
		children: [/* @__PURE__ */ jsx(ArrowRight, { className: "h-4 w-4" }), /* @__PURE__ */ jsx("span", {
			className: "sr-only",
			children: "Next slide"
		})]
	});
});
CarouselNext.displayName = "CarouselNext";
//#endregion
//#region src/components/site/hero/HeroMain.tsx
function HeroMain({ activeLeads, cfg }) {
	const ctx = useAdSettings();
	const configSlides = ctx?.adConfig?.slots?.hero_showcase;
	const initialAds = configSlides && configSlides.length > 0 ? configSlides : defaultAdSlidesHome2;
	const [featuredAds, setFeaturedAds] = React.useState(initialAds);
	const [featuredAdMode, setFeaturedAdMode] = React.useState(ctx?.adConfig?.modes?.hero_showcase || "image");
	const [featuredAdScript, setFeaturedAdScript] = React.useState(ctx?.adConfig?.scripts?.hero_showcase || "");
	React.useEffect(() => {
		if (ctx?.adConfig) {
			const s = ctx.adConfig.slots?.hero_showcase;
			if (s && s.length > 0) setFeaturedAds(s);
			else {
				const local = loadAds("hero_showcase");
				setFeaturedAds(local && local.length > 0 ? local : defaultAdSlidesHome2);
			}
			setFeaturedAdMode(ctx.adConfig.modes?.hero_showcase || "image");
			setFeaturedAdScript(ctx.adConfig.scripts?.hero_showcase || "");
		}
	}, [ctx?.adConfig]);
	React.useEffect(() => {
		const sync = () => {
			const local = loadAds("hero_showcase");
			if (local && local.length > 0) setFeaturedAds(local);
			else if (ctx?.adConfig?.slots?.hero_showcase && ctx.adConfig.slots.hero_showcase.length > 0) setFeaturedAds(ctx.adConfig.slots.hero_showcase);
			else setFeaturedAds(defaultAdSlidesHome2);
			setFeaturedAdMode(loadAdSlotMode("hero_showcase"));
			setFeaturedAdScript(loadAdSlotScript("hero_showcase"));
		};
		window.addEventListener("nt:ads-updated", sync);
		return () => window.removeEventListener("nt:ads-updated", sync);
	}, [ctx?.adConfig]);
	const [api, setApi] = React.useState();
	const [current, setCurrent] = React.useState(0);
	const [count, setCount] = React.useState(0);
	const showMultiple = cfg?.heroFeatured?.showMultiple !== false;
	const autoSlide = cfg?.heroFeatured?.autoSlide !== false;
	const slideInterval = (cfg?.heroFeatured?.slideInterval ?? 5) * 1e3;
	React.useEffect(() => {
		if (!api) return;
		setCount(api.scrollSnapList().length);
		setCurrent(api.selectedScrollSnap());
		api.on("select", () => {
			setCurrent(api.selectedScrollSnap());
		});
	}, [api]);
	const plugins = React.useMemo(() => {
		return [Autoplay({
			delay: slideInterval,
			stopOnInteraction: false,
			stopOnMouseEnter: true,
			active: autoSlide && showMultiple,
			playOnInit: autoSlide && showMultiple
		})];
	}, [
		slideInterval,
		autoSlide,
		showMultiple
	]);
	const allLeads = activeLeads || [];
	const leads = showMultiple ? allLeads : allLeads.slice(0, 1);
	const carouselItems = [];
	leads.forEach((featured, index) => {
		if (!featured) return;
		carouselItems.push(/* @__PURE__ */ jsx(CarouselItem, { children: /* @__PURE__ */ jsxs(Link, {
			to: "/news/$slug",
			params: { slug: featured.slug || "sample" },
			className: "group block",
			children: [
				/* @__PURE__ */ jsx("div", {
					className: "overflow-hidden relative",
					children: /* @__PURE__ */ jsx("img", {
						src: featured.img,
						alt: featured.title,
						loading: index === 0 ? "eager" : "lazy",
						fetchPriority: index === 0 ? "high" : "auto",
						decoding: index === 0 ? "sync" : "async",
						sizes: "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 800px",
						width: 800,
						height: 500,
						className: "aspect-[16/10] w-full object-cover transition-transform duration-500 group-hover:scale-105"
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
								featured.views > 999 ? (featured.views / 1e3).toFixed(1) + "K" : featured.views,
								" ",
								"views"
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
						kicker: featured.kicker || "Featured"
					})
				})
			]
		}) }, `news-${index}`));
		if (showMultiple) {
			if (featuredAdMode === "script" && featuredAdScript) carouselItems.push(/* @__PURE__ */ jsx(CarouselItem, { children: /* @__PURE__ */ jsxs("div", {
				className: "relative flex aspect-[16/10] w-full items-center justify-center bg-slate-50 overflow-hidden",
				children: [/* @__PURE__ */ jsx("div", {
					className: "absolute top-3 left-3 z-20 pointer-events-none",
					children: /* @__PURE__ */ jsx("span", {
						className: "inline-flex items-center rounded-md bg-black/80 px-2.5 py-1 text-[10px] md:text-xs font-bold uppercase tracking-wider text-white shadow-lg backdrop-blur-xs border border-white/20",
						children: "SPONSORED"
					})
				}), /* @__PURE__ */ jsx(ScriptAdRenderer, { code: featuredAdScript })]
			}) }, `slide-script-${index}`));
			else if (featuredAdMode === "image" && featuredAds.length > 0) {
				const ad = featuredAds[index % featuredAds.length];
				const adImg = ad.imageLandscape || ad.image;
				carouselItems.push(/* @__PURE__ */ jsx(CarouselItem, { children: /* @__PURE__ */ jsx("a", {
					href: ad.href,
					target: "_blank",
					rel: "noopener noreferrer",
					className: "group/showcase block w-full",
					children: /* @__PURE__ */ jsxs("div", {
						className: "relative overflow-hidden bg-amber-500 min-h-[200px]",
						children: [/* @__PURE__ */ jsx("img", {
							src: adImg,
							alt: ad.label || "Featured Content",
							loading: "lazy",
							decoding: "async",
							width: 800,
							height: 500,
							className: "aspect-[16/10] w-full object-cover transition-transform duration-500 group-hover/showcase:scale-105"
						}), /* @__PURE__ */ jsx("div", {
							className: "absolute top-3 left-3 z-20 pointer-events-none",
							children: /* @__PURE__ */ jsx("span", {
								className: "inline-flex items-center rounded-md bg-black/80 px-2.5 py-1 text-[10px] md:text-xs font-bold uppercase tracking-wider text-white shadow-lg backdrop-blur-xs border border-white/20",
								children: ad.label ? ad.label.toUpperCase() : "PROMOTED"
							})
						})]
					})
				}) }, `showcase-${index}`));
			}
		}
	});
	return /* @__PURE__ */ jsxs("div", {
		className: "flex flex-col gap-8 lg:col-span-8 lg:border-l lg:border-border lg:pl-8",
		children: [/* @__PURE__ */ jsx("article", { children: /* @__PURE__ */ jsx("div", {
			className: "relative group/carousel",
			suppressHydrationWarning: true,
			children: /* @__PURE__ */ jsxs(Carousel, {
				setApi,
				plugins,
				className: "w-full",
				opts: { loop: true },
				children: [
					/* @__PURE__ */ jsx(CarouselContent, {
						suppressHydrationWarning: true,
						children: carouselItems
					}),
					count > 1 && /* @__PURE__ */ jsxs("div", {
						className: "pointer-events-none absolute inset-x-0 top-0 flex aspect-[16/10] items-center justify-between opacity-0 transition-opacity duration-300 group-hover/carousel:opacity-100",
						children: [/* @__PURE__ */ jsx(CarouselPrevious, { className: "pointer-events-auto static h-8 w-6 translate-x-0 translate-y-0 rounded-r-md rounded-l-none border-none bg-black/50 text-white hover:bg-black/70" }), /* @__PURE__ */ jsx(CarouselNext, { className: "pointer-events-auto static h-8 w-6 translate-x-0 translate-y-0 rounded-l-md rounded-r-none border-none bg-black/50 text-white hover:bg-black/70" })]
					}),
					count > 1 && /* @__PURE__ */ jsx("div", {
						className: "mt-4 flex justify-center sm:pointer-events-none sm:absolute sm:inset-x-0 sm:top-0 sm:mt-0 sm:aspect-[16/10] sm:items-end sm:pb-3",
						children: /* @__PURE__ */ jsx("div", {
							className: "flex items-center gap-0.5 rounded-full sm:pointer-events-auto sm:bg-white/30 sm:px-1.5 sm:py-0.5 sm:backdrop-blur-sm",
							children: Array.from({ length: count }).map((_, i) => /* @__PURE__ */ jsx("button", {
								type: "button",
								className: "flex h-8 w-8 sm:h-7 sm:w-7 items-center justify-center rounded-full transition-transform hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary",
								onClick: (e) => {
									e.preventDefault();
									api?.scrollTo(i);
								},
								"aria-label": `Go to slide ${i + 1}`,
								children: /* @__PURE__ */ jsx("span", { className: `block h-2.5 w-2.5 sm:h-2 sm:w-2 rounded-full transition-all ${i === current ? "bg-slate-900" : "bg-slate-300 sm:bg-slate-600/60"}` })
							}, i))
						})
					})
				]
			})
		}) }), /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(LiveVideo, {}) })]
	});
}
//#endregion
//#region src/components/site/hero/HeroBottomGrid.tsx
function HeroBottomGrid({ cfg, activeBottomItems }) {
	if (!activeBottomItems || !Array.isArray(activeBottomItems) || activeBottomItems.length === 0) return null;
	return /* @__PURE__ */ jsxs("div", {
		className: "mt-10 border-t border-border pt-6",
		children: [/* @__PURE__ */ jsx("h2", {
			className: "mb-6 font-bold uppercase tracking-[0.25em]",
			style: {
				color: cfg.heroTopStories.color,
				fontSize: `${cfg.heroTopStories.fontSize}px`
			},
			children: cfg.heroTopStories.title
		}), /* @__PURE__ */ jsxs("div", {
			className: "grid gap-8 md:grid-cols-2 lg:grid-cols-3",
			children: [
				activeBottomItems[0] && /* @__PURE__ */ jsxs(Link, {
					to: "/news/$slug",
					params: { slug: activeBottomItems[0]?.slug || "sample" },
					className: "group block",
					children: [
						activeBottomItems[0].img && /* @__PURE__ */ jsx("div", {
							className: "overflow-hidden",
							children: /* @__PURE__ */ jsx("img", {
								src: activeBottomItems[0].img,
								alt: activeBottomItems[0].title,
								loading: "lazy",
								decoding: "async",
								className: "aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-105"
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
							kicker: activeBottomItems[0].kicker
						})
					]
				}),
				activeBottomItems[1] && /* @__PURE__ */ jsxs(Link, {
					to: "/news/$slug",
					params: { slug: activeBottomItems[1]?.slug || "sample" },
					className: "group block border-t border-border pt-6 md:border-t-0 md:pt-0",
					children: [
						activeBottomItems[1].img && /* @__PURE__ */ jsx("div", {
							className: "hidden md:block overflow-hidden",
							children: /* @__PURE__ */ jsx("img", {
								src: activeBottomItems[1].img,
								alt: activeBottomItems[1].title,
								loading: "lazy",
								decoding: "async",
								className: "aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-105"
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
							kicker: activeBottomItems[1].kicker
						})
					]
				}),
				activeBottomItems.length > 2 && /* @__PURE__ */ jsx("div", {
					className: "divide-y divide-border border-t border-border pt-6 md:border-t-0 md:pt-0",
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
		className: "mt-10 border-t border-border pt-6",
		children: [/* @__PURE__ */ jsx("h2", {
			className: "mb-6 font-bold uppercase tracking-[0.25em]",
			style: {
				color: cfg.heroCultureMusic.color,
				fontSize: `${cfg.heroCultureMusic.fontSize}px`
			},
			children: cfg.heroCultureMusic.title
		}), /* @__PURE__ */ jsx("div", {
			className: "grid gap-6 sm:grid-cols-2 lg:grid-cols-4",
			children: activeCultureItems.map((c, i) => /* @__PURE__ */ jsxs(Link, {
				to: "/news/$slug",
				params: { slug: c?.slug || "sample" },
				className: "group block",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "relative overflow-hidden",
						children: [
							/* @__PURE__ */ jsx("img", {
								src: c.img,
								alt: c.title,
								loading: "lazy",
								decoding: "async",
								className: "aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-105"
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
								children: [formatViews(c.views || viewsFor(c.title)), " views"]
							})
						]
					}),
					/* @__PURE__ */ jsx("h3", {
						className: "headline mt-3 text-lg leading-tight text-foreground group-hover:underline",
						children: c.title
					}),
					/* @__PURE__ */ jsx("p", {
						className: "mt-2 line-clamp-3 text-sm leading-snug text-muted-foreground",
						children: c.excerpt
					}),
					/* @__PURE__ */ jsxs("p", {
						className: "mt-3 flex items-center gap-2 text-[11px] uppercase tracking-wider text-muted-foreground",
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
//#region src/components/site/hero/HeroSidebarRight.tsx
function HeroSidebarRight({ cfg, activeOpinionItems, activePopularItems, tags }) {
	return /* @__PURE__ */ jsxs("aside", {
		className: "space-y-6 lg:col-span-3 lg:border-l lg:border-border lg:pl-6",
		children: [
			/* @__PURE__ */ jsx("h2", {
				className: "rule-top font-bold uppercase tracking-[0.25em]",
				style: {
					color: cfg.heroOpinion.color,
					fontSize: `${cfg.heroOpinion.fontSize}px`
				},
				children: cfg.heroOpinion.title
			}),
			/* @__PURE__ */ jsx("ul", {
				className: "space-y-5",
				children: activeOpinionItems.map((o, i) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsxs(Link, {
					to: "/news/$slug",
					params: { slug: o?.slug || "sample" },
					className: "group flex gap-3",
					children: [/* @__PURE__ */ jsx("img", {
						src: o.img,
						alt: "",
						loading: "lazy",
						decoding: "async",
						className: "h-14 w-14 shrink-0 object-cover"
					}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("p", {
						className: "font-serif text-sm font-bold leading-snug text-foreground group-hover:underline line-clamp-2",
						children: o.title
					}), /* @__PURE__ */ jsxs("p", {
						className: "mt-1 text-[11px] text-muted-foreground",
						children: [
							"by ",
							o.by,
							" · ",
							/* @__PURE__ */ jsx(Views, { count: o.views || viewsFor(o.title) })
						]
					})] })]
				}) }, `${o?.title || "opinion"}-${i}`))
			}),
			/* @__PURE__ */ jsx("div", {
				style: {
					width: 384,
					maxWidth: "100%"
				},
				children: /* @__PURE__ */ jsx(Advertisement, {
					slot: "home1",
					label: "Sponsored",
					aspectRatio: "3 / 4"
				})
			}),
			/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h2", {
				className: "rule-top font-bold uppercase tracking-[0.25em]",
				style: {
					color: cfg.heroPopular.color,
					fontSize: `${cfg.heroPopular.fontSize}px`
				},
				children: cfg.heroPopular.title
			}), /* @__PURE__ */ jsx("ul", {
				className: "mt-4 space-y-4",
				children: activePopularItems.map((p, i) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsxs(Link, {
					to: "/news/$slug",
					params: { slug: p?.slug || "sample" },
					className: "group flex gap-3",
					children: [/* @__PURE__ */ jsx("img", {
						src: p.img,
						alt: "",
						loading: "lazy",
						decoding: "async",
						className: "h-14 w-14 shrink-0 object-cover"
					}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("p", {
						className: "font-serif text-sm font-bold leading-snug text-foreground group-hover:underline line-clamp-2",
						children: p.title
					}), /* @__PURE__ */ jsxs("p", {
						className: "mt-1 text-[11px] text-muted-foreground",
						children: [
							"by ",
							p.by,
							" · ",
							/* @__PURE__ */ jsx(Views, { count: p.views || viewsFor(p.title) })
						]
					})] })]
				}) }, `${p?.title || "popular"}-${i}`))
			})] }),
			/* @__PURE__ */ jsx(ArchiveFinder, {}),
			/* @__PURE__ */ jsxs("div", {
				className: "hidden md:block",
				children: [/* @__PURE__ */ jsx("div", {
					className: "bg-foreground py-2 text-center text-xs font-bold uppercase tracking-[0.3em] text-background",
					children: "Tags"
				}), /* @__PURE__ */ jsx("div", {
					className: "mt-4 flex flex-wrap items-baseline gap-x-3 gap-y-2",
					children: (tags.length > 0 ? tags.slice(0, 25).map((t, i) => {
						const presetSizes = [
							"text-sm",
							"text-lg font-bold",
							"text-sm",
							"text-sm",
							"text-sm",
							"text-2xl font-bold",
							"text-lg",
							"text-2xl font-bold",
							"text-lg",
							"text-xl font-bold",
							"text-sm",
							"text-lg font-bold",
							"text-sm",
							"text-base",
							"text-lg",
							"text-sm",
							"text-base font-bold",
							"text-sm",
							"text-lg",
							"text-base",
							"text-sm",
							"text-xl font-bold"
						];
						return {
							t: t.name,
							size: presetSizes[i % presetSizes.length]
						};
					}) : [
						{
							t: "Author",
							size: "text-sm"
						},
						{
							t: "Blog",
							size: "text-lg font-bold"
						},
						{
							t: "History",
							size: "text-sm"
						},
						{
							t: "Lifestyle",
							size: "text-sm"
						},
						{
							t: "Music",
							size: "text-sm"
						},
						{
							t: "Politics",
							size: "text-2xl font-bold"
						},
						{
							t: "Travel",
							size: "text-lg"
						},
						{
							t: "WordPress",
							size: "text-2xl font-bold"
						},
						{
							t: "World",
							size: "text-lg"
						},
						{
							t: "Markets",
							size: "text-xl font-bold"
						},
						{
							t: "Crypto",
							size: "text-sm"
						},
						{
							t: "Tech",
							size: "text-lg font-bold"
						},
						{
							t: "Business",
							size: "text-sm"
						},
						{
							t: "Startups",
							size: "text-base"
						},
						{
							t: "Opinion",
							size: "text-lg"
						},
						{
							t: "Sports",
							size: "text-sm"
						},
						{
							t: "Health",
							size: "text-base font-bold"
						},
						{
							t: "Science",
							size: "text-sm"
						},
						{
							t: "Climate",
							size: "text-lg"
						},
						{
							t: "Culture",
							size: "text-base"
						},
						{
							t: "Film",
							size: "text-sm"
						},
						{
							t: "Food",
							size: "text-xl font-bold"
						}
					]).map((tag) => /* @__PURE__ */ jsx("a", {
						href: `/search?q=${encodeURIComponent(tag.t)}`,
						className: `${tag.size} font-serif text-foreground hover:underline capitalize`,
						children: tag.t
					}, tag.t))
				})]
			}),
			/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
				className: "bg-foreground py-2 text-center text-xs font-bold uppercase tracking-[0.3em] text-background",
				children: "Follow"
			}), /* @__PURE__ */ jsx("div", {
				className: "mt-4 flex flex-nowrap items-center justify-center",
				children: /* @__PURE__ */ jsx(SocialIcons, {
					only: [
						"facebook",
						"twitter",
						"youtube",
						"whatsapp",
						"telegram"
					],
					size: "md"
				})
			})] })
		]
	});
}
//#endregion
//#region src/components/site/HeroBoard.tsx
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
		const featuredCategory = cfg?.heroFeatured?.category || "Auto (Latest)";
		const leads = getUnique(articles, cfg?.heroFeatured?.slideCount ?? 3, (a) => {
			if (!featuredCategory || featuredCategory === "Auto (Latest)") return true;
			return a.category?.toLowerCase() === featuredCategory.toLowerCase();
		}).map((a, i) => ({
			kicker: a.category,
			title: a.title,
			dek: a.excerpt || a.content?.replace(/<[^>]*>/g, "").slice(0, 150) + "...",
			author: `By ${a.author || "Newsroom"}`,
			time: formatUtcDate(a.date),
			img: getArticleImage(a.featuredImage, i),
			views: a.views || 0,
			slug: a.slug
		}));
		const left = getUnique(articles, 5).map((a, i) => ({
			kicker: a.category,
			title: a.title,
			excerpt: a.excerpt || a.content?.replace(/<[^>]*>/g, "").slice(0, 100) + "...",
			img: i === 2 ? getArticleImage(a.featuredImage, i + 7) : void 0,
			slug: a.slug
		}));
		const bottom = getUnique(articles, 6).map((a, i) => ({
			kicker: a.category,
			title: a.title,
			excerpt: a.excerpt || a.content?.replace(/<[^>]*>/g, "").slice(0, 150) + "...",
			img: i < 2 ? getArticleImage(a.featuredImage, i + 12) : void 0,
			slug: a.slug
		}));
		const popularCategory = cfg?.heroPopular?.category || "Auto (Latest)";
		const popular = getUnique(articles, 4, (a) => {
			if (!popularCategory || popularCategory === "Auto (Latest)") return true;
			return a.category?.toLowerCase() === popularCategory.toLowerCase();
		}).map((a, i) => ({
			title: a.title,
			by: a.author || "Newsroom",
			img: getArticleImage(a.featuredImage, i + 18),
			views: a.views || 0,
			slug: a.slug
		}));
		const opinionCategory = cfg?.heroOpinion?.category || "Opinion";
		const opinion = getUnique(articles, 6, (a) => {
			if (!opinionCategory || opinionCategory === "Auto (Latest)") return true;
			return a.category?.toLowerCase() === opinionCategory.toLowerCase();
		}).map((a, i) => ({
			title: a.title,
			by: a.author || "Newsroom",
			img: getArticleImage(a.featuredImage, i + 22),
			slug: a.slug,
			views: a.views || 0
		}));
		const cultureCategory = cfg?.heroCultureMusic?.category || "Auto (Latest)";
		return {
			activeLeads: leads,
			activeLeftItems: left,
			activeBottomItems: bottom,
			activePopularItems: popular,
			activeOpinionItems: opinion,
			activeCultureItems: getUnique(articles, 4, (a) => {
				if (!cultureCategory || cultureCategory === "Auto (Latest)") return true;
				return a.category?.toLowerCase() === cultureCategory.toLowerCase();
			}).map((a, i) => ({
				title: a.title,
				kicker: a.category,
				excerpt: a.excerpt || a.content?.replace(/<[^>]*>/g, "").slice(0, 80) + "...",
				date: formatUtcDate(a.date),
				img: getArticleImage(a.featuredImage, i + 28),
				slug: a.slug
			}))
		};
	}, [articles, cfg]);
	return /* @__PURE__ */ jsx(AnimatedContainer, {
		className: "border-b border-border py-4 md:py-8",
		children: /* @__PURE__ */ jsxs("div", {
			className: "grid gap-8 lg:grid-cols-12",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "lg:col-span-9",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "grid gap-8 lg:grid-cols-12",
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
			}), /* @__PURE__ */ jsx(HeroSidebarRight, {
				cfg,
				activeOpinionItems,
				activePopularItems,
				tags
			})]
		})
	});
});
//#endregion
//#region src/components/site/Columnists.tsx
var ReelViewerModal = lazy(() => import("./ReelViewerModal-p6czEATt.js"));
var watchItems = [
	{
		title: "Where to Invest 10 Lakh Rupees Amid a Fragile Recovery",
		duration: "1:08",
		img: grid[0].img,
		kicker: null,
		embedSrc: "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0&modestbranding=1&playsinline=1"
	},
	{
		title: "Iran's Leaders Are in No Hurry to Get a Peace Deal",
		duration: "1:16",
		img: top[0].img,
		kicker: null,
		embedSrc: "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0&modestbranding=1&playsinline=1"
	},
	{
		title: "A Heartless Supreme Court Decision",
		duration: "2:12",
		img: grid[1].img,
		kicker: "Opinion",
		embedSrc: "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0&modestbranding=1&playsinline=1"
	},
	{
		title: "Apple's Sweeping Price Hikes Hit iPads and Macs",
		duration: "1:21",
		img: grid[2].img,
		kicker: null,
		embedSrc: "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0&modestbranding=1&playsinline=1"
	},
	{
		title: "How the 1994 World Cup Changed the Business of Football Forever",
		duration: "1:39",
		img: lead.img,
		kicker: null,
		embedSrc: "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0&modestbranding=1&playsinline=1"
	},
	{
		title: "Tesla's New Factory Sparks Environmental Concerns",
		duration: "2:45",
		img: top[1].img,
		kicker: "Tech",
		embedSrc: "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0&modestbranding=1&playsinline=1"
	},
	{
		title: "The Rise of AI in Modern Healthcare",
		duration: "1:55",
		img: grid[0].img,
		kicker: "Health",
		embedSrc: "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0&modestbranding=1&playsinline=1"
	},
	{
		title: "Global Supply Chain Disruptions Continue to Plague Retailers",
		duration: "3:10",
		img: grid[1].img,
		kicker: "Business",
		embedSrc: "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0&modestbranding=1&playsinline=1"
	}
];
function Columnists({ hideTitle } = {}) {
	const cfg = useHomepageConfig();
	const adCtx = useAdSettings();
	const [activeReelIndex, setActiveReelIndex] = useState(null);
	const scrollRef = useRef(null);
	const isMobile = useIsMobile();
	const reelAds = useMemo(() => {
		return adCtx?.adConfig?.slots?.["reel_ads"] || loadAds("reel_ads");
	}, [adCtx?.adConfig?.slots]);
	const displayItems = useMemo(() => {
		return injectReelAds(watchItems, reelAds, isMobile ? {
			firstAfter: 1,
			interval: 2
		} : 3);
	}, [reelAds, isMobile]);
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
					items: watchItems,
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
var NewsGrid = lazy(() => import("./NewsGrid-DyRgoEk6.js").then((m) => ({ default: m.NewsGrid })));
var ReelsSection = lazy(() => import("./ReelsSection-CjaaQ8De.js").then((m) => ({ default: m.ReelsSection })));
var MarketsMagazine = lazy(() => import("./MarketsMagazine-DGFURFfr.js").then((m) => ({ default: m.MarketsMagazine })));
var Footer = lazy(() => import("./Footer-CGCJ6p7l.js").then((n) => n.n).then((m) => ({ default: m.Footer })));
function Home() {
	const { articles: dbArticles, tags: dbTags } = Route.useLoaderData();
	const usedIds = /* @__PURE__ */ new Set();
	return /* @__PURE__ */ jsxs("div", {
		className: "min-h-screen bg-background text-foreground",
		children: [
			/* @__PURE__ */ jsx(Header, { breakingArticles: dbArticles }),
			/* @__PURE__ */ jsxs("main", {
				className: "mx-auto max-w-7xl px-4 py-4 md:py-10",
				children: [
					/* @__PURE__ */ jsx("div", {
						className: "block md:hidden border-b border-border mb-2 pb-2",
						children: /* @__PURE__ */ jsx(Columnists, { hideTitle: true })
					}),
					/* @__PURE__ */ jsx(HeroBoard, {
						articles: dbArticles,
						tags: dbTags
					}),
					/* @__PURE__ */ jsx("div", {
						className: "hidden md:block",
						children: /* @__PURE__ */ jsx(LazySection, {
							minHeight: 420,
							children: /* @__PURE__ */ jsx(Columnists, {})
						})
					}),
					/* @__PURE__ */ jsx(LazySection, {
						minHeight: 600,
						children: /* @__PURE__ */ jsx(NewsGrid, {
							articles: dbArticles,
							usedIds
						})
					}),
					/* @__PURE__ */ jsx(LazySection, {
						minHeight: 480,
						children: /* @__PURE__ */ jsx(ReelsSection, {})
					}),
					/* @__PURE__ */ jsx(LazySection, {
						minHeight: 700,
						children: /* @__PURE__ */ jsx(MarketsMagazine, {
							articles: dbArticles,
							usedIds
						})
					})
				]
			}),
			/* @__PURE__ */ jsx(Footer, {})
		]
	});
}
//#endregion
export { Home as component };
