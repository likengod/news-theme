import { a as isEnterprisePlusLicense } from "./site-settings-cWSnE2Ns.js";
import { d as loadAdRotation, f as loadAdSlotMode, m as loadAds, p as loadAdSlotScript, u as injectReelAds } from "./ads-storage-COvLdmbz.js";
import { a as useSiteSettings, n as useAdSettings } from "./AdSettingsContext-DL3ndTev.js";
import { d as news_crypto_default, f as news_oil_default, h as hero_markets_default, l as news_trade_default, m as news_fed_default, n as getArticleImage, p as news_tech_default, t as formatViews, u as news_wallstreet_default } from "./news-data-DU6ZB54L.js";
import { n as SocialIcons, t as Footer } from "./Footer-Cw9_ZolM.js";
import { s as articlesByCategory } from "./homepage-config-BRgZp7EU.js";
import { t as cn } from "./utils-C_uf36nf.js";
import { n as useHomepageConfig, t as Header } from "./Header-CB_2ExaN.js";
import { t as Route } from "./routes-U4Wyq_rr.js";
import { t as Views } from "./Views-D9MbWe85.js";
import { n as Advertisement, r as ScriptAdRenderer, t as ArchiveFinder } from "./ArchiveFinder-DevP5IGO.js";
import { a as getReelsConfigServer, c as onReelsConfigChange, n as extractYouTubeId, o as loadReels, s as loadReelsConfig } from "./reels-config-BmWDY1od.js";
import { t as Button } from "./button-CtdWWMYi.js";
import { t as useIsMobile } from "./use-mobile-Dt1uRu8S.js";
import * as React$1 from "react";
import React, { Suspense, lazy, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight, ExternalLink, Facebook, Loader2, Play, Radio, Sparkles, Volume2, VolumeX, Youtube } from "lucide-react";
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
function MinRead({ seed, kicker, author, views }) {
	const displayAuthor = author ? author.startsWith("By ") ? author.replace(/^By\s+/i, "") : author : "Admin User";
	const displayViews = typeof views === "number" ? views : views ? Number(views) : 0;
	return /* @__PURE__ */ jsxs("span", {
		className: "mt-3 inline-flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-muted-foreground",
		children: [
			/* @__PURE__ */ jsxs("span", {
				className: "font-medium text-foreground",
				children: ["By ", displayAuthor]
			}),
			/* @__PURE__ */ jsx(Views, { count: displayViews }),
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
					alt: "",
					"aria-hidden": "true",
					loading: "lazy",
					fetchPriority: "auto",
					decoding: "async",
					width: 400,
					height: 250,
					onError: (e) => {
						const el = e.currentTarget;
						el.onerror = null;
						el.src = getArticleImage(void 0, 1);
					},
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
				kicker: item.kicker,
				author: item.author,
				views: item.views
			})
		]
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
//#region src/components/site/LiveVideo.tsx
function LiveVideo() {
	const { liveVideo } = useHomepageConfig();
	const [isPlaying, setIsPlaying] = useState(false);
	const [muted, setMuted] = useState(true);
	const iframeRef = useRef(null);
	const src = useMemo(() => {
		if (liveVideo.provider === "youtube") {
			const vid = (liveVideo.youtubeVideoId || "").trim();
			const raw = (liveVideo.youtubeChannelId || "").trim();
			if (vid && vid.length === 11) return `https://www.youtube-nocookie.com/embed/${vid}?autoplay=1&mute=${muted ? 1 : 0}&controls=1&modestbranding=1&rel=0&playsinline=1&enablejsapi=1`;
			let videoId = "";
			let channelId = raw;
			if (raw.includes("watch?v=")) videoId = raw.split("watch?v=")[1]?.split("&")[0] || "";
			else if (raw.includes("youtu.be/")) videoId = raw.split("youtu.be/")[1]?.split("?")[0] || "";
			else if (raw.includes("youtube.com/live/")) {
				const after = raw.split("youtube.com/live/")[1]?.split("?")[0]?.split("/")[0] || "";
				if (after && !after.startsWith("@")) videoId = after;
			} else if (raw.includes("channel/")) channelId = raw.split("channel/")[1]?.split("/")[0]?.split("?")[0] || channelId;
			else if (raw.length === 11 && !raw.startsWith("UC")) videoId = raw;
			if (raw.toLowerCase().includes("newsvanguardtripura24x7")) {
				channelId = "UC2EhA8EnLxOCbgn3nW2-OjA";
				if (!videoId) videoId = "99tqX34EEVI";
			}
			if (videoId) return `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&mute=${muted ? 1 : 0}&controls=1&modestbranding=1&rel=0&playsinline=1&enablejsapi=1`;
			if (channelId && channelId.startsWith("UC")) return `https://www.youtube-nocookie.com/embed/live_stream?channel=${channelId}&autoplay=1&mute=${muted ? 1 : 0}&controls=1&modestbranding=1&rel=0&playsinline=1&enablejsapi=1`;
			return "";
		}
		const href = encodeURIComponent(liveVideo.facebookPageUrl || "");
		return href ? `https://www.facebook.com/plugins/video.php?href=${href}&show_text=false&autoplay=1&mute=${muted ? 1 : 0}` : "";
	}, [liveVideo, muted]);
	if (liveVideo?.enabled === false || !src) return null;
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
			className: "relative aspect-[16/9] w-full overflow-hidden bg-black rounded-lg border border-border/40 shadow-sm group",
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
//#region src/components/site/hero/HeroFeaturedSlider.tsx
function HeroFeaturedSlider({ leads, featuredAds, featuredAdMode, featuredAdScript, showMultiple, autoSlide, slideInterval, isEnterprisePlus }) {
	const [api, setApi] = React.useState();
	const [current, setCurrent] = React.useState(0);
	const [count, setCount] = React.useState(0);
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
	const carouselItems = [];
	leads.forEach((featured, index) => {
		if (!featured) return;
		carouselItems.push(/* @__PURE__ */ jsx(CarouselItem, { children: /* @__PURE__ */ jsxs(Link, {
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
						loading: index === 0 ? "eager" : "lazy",
						fetchPriority: index === 0 ? "high" : "auto",
						decoding: index === 0 ? "sync" : "async",
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
		}) }, `news-${index}`));
		if (showMultiple && isEnterprisePlus) {
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
				if (adImg && !adImg.includes("placehold.co")) carouselItems.push(/* @__PURE__ */ jsx(CarouselItem, { children: /* @__PURE__ */ jsx("a", {
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
	return /* @__PURE__ */ jsx("div", {
		className: "relative group/carousel w-full max-w-full min-w-0 overflow-hidden",
		suppressHydrationWarning: true,
		children: /* @__PURE__ */ jsxs(Carousel, {
			setApi,
			plugins,
			className: "w-full max-w-full",
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
	});
}
//#endregion
//#region src/components/site/hero/HeroMain.tsx
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
						onError: (e) => {
							const el = e.currentTarget;
							el.onerror = null;
							el.src = getArticleImage(void 0, 0);
						},
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
			children: hasMultipleItems ? /* @__PURE__ */ jsx(HeroFeaturedSlider, {
				leads,
				featuredAds,
				featuredAdMode,
				featuredAdScript,
				showMultiple,
				autoSlide,
				slideInterval,
				isEnterprisePlus
			}) : renderSingleLead()
		}), /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(LiveVideo, {}) })]
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
				/* @__PURE__ */ jsx("div", {
					className: "flex flex-col h-full w-full min-w-0",
					children: activeBottomItems[0] && /* @__PURE__ */ jsxs(Link, {
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
									onError: (e) => {
										const el = e.currentTarget;
										el.onerror = null;
										el.src = getArticleImage(void 0, 0);
									},
									className: "aspect-[16/9] w-full object-cover transition-transform duration-500 group-hover:scale-105"
								})
							}),
							/* @__PURE__ */ jsx("h3", {
								className: "headline mt-4 text-xl text-foreground group-hover:underline line-clamp-3",
								children: activeBottomItems[0].title
							}),
							/* @__PURE__ */ jsx("p", {
								className: "mt-2 text-sm leading-relaxed text-muted-foreground line-clamp-4 overflow-hidden",
								children: activeBottomItems[0].excerpt
							}),
							/* @__PURE__ */ jsx(MinRead, {
								seed: activeBottomItems[0].title,
								kicker: activeBottomItems[0].kicker,
								author: activeBottomItems[0].author,
								views: activeBottomItems[0].views
							})
						]
					})
				}),
				/* @__PURE__ */ jsx("div", {
					className: "flex flex-col h-full w-full min-w-0",
					children: activeBottomItems[1] && /* @__PURE__ */ jsxs(Link, {
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
									onError: (e) => {
										const el = e.currentTarget;
										el.onerror = null;
										el.src = getArticleImage(void 0, 1);
									},
									className: "aspect-[16/9] w-full object-cover transition-transform duration-500 group-hover:scale-105"
								})
							}),
							/* @__PURE__ */ jsx("h3", {
								className: "headline mt-0 md:mt-4 text-xl text-foreground group-hover:underline line-clamp-3",
								children: activeBottomItems[1].title
							}),
							/* @__PURE__ */ jsx("p", {
								className: "mt-2 text-sm leading-relaxed text-muted-foreground line-clamp-4 overflow-hidden",
								children: activeBottomItems[1].excerpt
							}),
							/* @__PURE__ */ jsx(MinRead, {
								seed: activeBottomItems[1].title,
								kicker: activeBottomItems[1].kicker,
								author: activeBottomItems[1].author,
								views: activeBottomItems[1].views
							})
						]
					})
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
//#region src/components/site/hero/HeroSidebarRight.tsx
function HeroSidebarRight({ cfg, activeOpinionItems, activePopularItems, tags }) {
	return /* @__PURE__ */ jsxs("aside", {
		className: "space-y-6 lg:col-span-3 lg:border-l lg:border-border lg:pl-6 w-full max-w-full min-w-0",
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
						width: 56,
						height: 56,
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
							/* @__PURE__ */ jsx(Views, { count: Number(o.views) || 0 })
						]
					})] })]
				}) }, `${o?.title || "opinion"}-${i}`))
			}),
			/* @__PURE__ */ jsx("div", {
				className: "w-full max-w-[384px] mx-auto min-w-0",
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
						width: 56,
						height: 56,
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
							/* @__PURE__ */ jsx(Views, { count: Number(p.views) || 0 })
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
		const bottom = getUnique(articles, 5).map((a, i) => ({
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
//#region src/hooks/use-reels-config.ts
function useReelsConfig() {
	const [cfg, setCfg] = useState(() => loadReelsConfig());
	useEffect(() => {
		const unsub = onReelsConfigChange(() => setCfg(loadReelsConfig()));
		getReelsConfigServer().then((serverCfg) => {
			if (serverCfg) {
				setCfg(serverCfg);
				if (typeof window !== "undefined") try {
					localStorage.setItem("nt:reels-config:v2", JSON.stringify(serverCfg));
				} catch {}
			}
		}).catch(() => {});
		return unsub;
	}, []);
	return cfg;
}
//#endregion
//#region src/components/site/Columnists.tsx
var ReelViewerModal = lazy(() => import("./ReelViewerModal-BCcwqIGe.js"));
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
							count: Number(v.views) || 0,
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
//#region src/components/site/NewsGrid.tsx
var baseColumns = [
	{
		img: news_tech_default,
		lead: "It's Never Been More Expensive to Visit New York City",
		items: [
			{ title: "Climate protest crackdown shows how wrong the GOP is about free speech" },
			{ title: "Guard Dogs Protect Sheep From Prowling Puma In First Of Its Kind Footage" },
			{ title: "Senserit eos ea tation quidam posidonium eam" },
			{ title: "UN warns of widening humanitarian crisis across Sahel region" },
			{ title: "Tokyo housing market hits record highs as foreign buyers pile in" }
		]
	},
	{
		img: news_trade_default,
		hasVideo: true,
		lead: "Right-Wing House Republicans Derail Pentagon G.O.P.",
		items: [
			{ title: "Sententiae epicuri concludaturque ius no Id mucius" },
			{ title: "Art for the Millions at Metropolitan Museum review" },
			{ title: "Senate moves to block sweeping new tariff package" },
			{ title: "Governors push back on federal voting rule overhaul" },
			{ title: "Bipartisan group floats compromise on border funding" }
		]
	},
	{
		img: news_fed_default,
		lead: "Artist / Teacher in Classical Voice job with us",
		items: [
			{ title: "Solum graeco vel at Has ad alienum" },
			{ title: "A state campsite reservation bill heads for the governors desk" },
			{ title: "Global economic growth forecasts slashed, as world struggles with high inflation" },
			{ title: "Why the four-day workweek debate is finally getting serious" },
			{ title: "The quiet return of the American downtown" }
		]
	},
	{
		img: news_wallstreet_default,
		lead: "Solum graeco vel at Has ad alienum",
		items: [
			{ title: "How Sarah Coped Her Chronic Disease" },
			{ title: "Future of Contemporary Art" },
			{ title: "Extra $2.50 for half a prawn?" },
			{ title: "Indie bookstores are quietly out-selling the chains again" },
			{ title: "Streaming's next battleground: live theater on demand" }
		]
	},
	{
		img: news_crypto_default,
		lead: "Future of Contemporary Art",
		items: [
			{ title: "How VR Has Changed The World?" },
			{ title: "Why postpartum depression went untreated for thousands of years" },
			{ title: "Art for the Millions at Metropolitan Museum review" },
			{ title: "A new generation of muralists is repainting the Bronx" },
			{ title: "Inside the auction rooms betting on emerging African artists" }
		]
	}
];
var NewsGrid = React.memo(function NewsGrid({ articles = [], usedIds }) {
	const cfg = useHomepageConfig();
	const hasDbArticles = articles.length > 0;
	const articlesByCategoryName = useMemo(() => {
		const m = /* @__PURE__ */ new Map();
		for (const a of articles) {
			const cats = (a.category || "Others").split(",").map((c) => c.trim().toLowerCase()).filter(Boolean);
			for (const cat of cats) {
				const existing = m.get(cat) || [];
				existing.push(a);
				m.set(cat, existing);
			}
		}
		return m;
	}, [articles]);
	const columns = useMemo(() => {
		const localUsed = new Set(usedIds || []);
		return baseColumns.map((c, i) => {
			const cat = cfg.newsGridColumns[i]?.category;
			if (hasDbArticles && cat) {
				let matches = [];
				if (cat === "Auto (Latest)") matches = articles.filter((a) => !localUsed.has(a.id));
				else {
					const normalizedCat = cat.toLowerCase().trim();
					const allCatArticles = articlesByCategoryName.get(normalizedCat) || [];
					matches = allCatArticles.filter((a) => !localUsed.has(a.id));
					if (matches.length < 7) {
						const usedCatArticles = allCatArticles.filter((a) => localUsed.has(a.id));
						for (const u of usedCatArticles) {
							if (!matches.some((m) => m.id === u.id)) matches.push(u);
							if (matches.length >= 7) break;
						}
					}
				}
				if (matches.length < 7) {
					const fallbacks = articles.filter((a) => !matches.some((m) => m.id === a.id) && !localUsed.has(a.id));
					for (const f of fallbacks) {
						matches.push(f);
						if (matches.length >= 7) break;
					}
				}
				if (matches.length < 7) {
					const fallbacks = articles.filter((a) => !matches.some((m) => m.id === a.id));
					const offset = fallbacks.length > 0 ? i * 3 % fallbacks.length : 0;
					const staggered = [...fallbacks.slice(offset), ...fallbacks.slice(0, offset)];
					for (const f of staggered) {
						matches.push(f);
						if (matches.length >= 7) break;
					}
				}
				if (matches.length > 0) {
					const head = matches[0];
					const rest = matches.slice(1, 7);
					matches.slice(0, 7).forEach((a) => localUsed.add(a.id));
					return {
						...c,
						img: getArticleImage(head.featuredImage || head.img, i),
						lead: head.title,
						slug: head.slug,
						items: rest.map((a) => ({
							title: a.title,
							slug: a.slug
						}))
					};
				}
			}
			return {
				...c,
				slug: "sample",
				items: c.items.map((it) => ({
					...it,
					slug: "sample"
				}))
			};
		});
	}, [
		articles,
		cfg.newsGridColumns,
		hasDbArticles,
		articlesByCategoryName,
		usedIds
	]);
	if (!hasDbArticles) return null;
	return /* @__PURE__ */ jsx("section", {
		className: "border-t border-border py-10 w-full max-w-full min-w-0 overflow-hidden",
		children: /* @__PURE__ */ jsx("div", {
			className: "grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-3 lg:grid-cols-5 w-full max-w-full min-w-0",
			children: columns.map((col, i) => {
				const colCfg = cfg.newsGridColumns[i];
				return /* @__PURE__ */ jsxs("div", {
					className: "flex flex-col w-full max-w-full min-w-0",
					children: [
						/* @__PURE__ */ jsx("h2", {
							className: "mb-3 font-extrabold uppercase tracking-widest",
							style: {
								color: colCfg.color,
								fontSize: `${colCfg.fontSize}px`
							},
							children: colCfg.title
						}),
						/* @__PURE__ */ jsxs(Link, {
							to: "/news/$slug",
							params: { slug: col?.slug || "sample" },
							className: "group block w-full max-w-full min-w-0",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "relative overflow-hidden bg-muted",
								children: [/* @__PURE__ */ jsx("img", {
									src: col.img,
									alt: "",
									"aria-hidden": "true",
									loading: "lazy",
									decoding: "async",
									width: 400,
									height: 225,
									className: "aspect-[16/9] w-full object-cover transition-transform duration-500 group-hover:scale-105"
								}), col.hasVideo && /* @__PURE__ */ jsx("span", {
									className: "absolute inset-0 flex items-center justify-center",
									children: /* @__PURE__ */ jsx("span", {
										className: "flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-white",
										children: /* @__PURE__ */ jsx("svg", {
											viewBox: "0 0 24 24",
											fill: "currentColor",
											className: "ml-0.5 h-4 w-4",
											children: /* @__PURE__ */ jsx("path", { d: "M8 5v14l11-7z" })
										})
									})
								})]
							}), /* @__PURE__ */ jsx("h3", {
								className: "mt-3 line-clamp-2 overflow-hidden font-serif text-[17px] font-bold leading-snug text-primary group-hover:underline",
								children: col.lead
							})]
						}),
						/* @__PURE__ */ jsx("ul", {
							className: "mt-3 space-y-3 border-t border-border pt-3",
							children: col.items.map((item, idx) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(Link, {
								to: "/news/$slug",
								params: { slug: item?.slug || "sample" },
								className: "block line-clamp-2 overflow-hidden font-serif text-[15px] font-semibold leading-snug text-primary hover:underline",
								children: item.title
							}) }, `${item?.slug || "item"}-${idx}`))
						})
					]
				}, i);
			})
		})
	});
});
//#endregion
//#region src/components/site/ReelsSection.tsx
function ReelsSection() {
	const cfg = useReelsConfig();
	const [items, setItems] = useState([]);
	const [loading, setLoading] = useState(false);
	const [playingUrl, setPlayingUrl] = useState(null);
	useEffect(() => {
		if (!cfg.enabled) {
			setItems([]);
			return;
		}
		let cancelled = false;
		setLoading(true);
		loadReels(cfg).then((r) => !cancelled && setItems(r)).finally(() => !cancelled && setLoading(false));
		return () => {
			cancelled = true;
		};
	}, [useMemo(() => JSON.stringify(cfg), [cfg])]);
	if (!cfg.enabled) return null;
	if (!loading && items.length === 0) return null;
	const Icon = cfg.provider === "youtube" ? Youtube : Facebook;
	const brandColor = cfg.provider === "youtube" ? "#FF0000" : "#1877F2";
	return /* @__PURE__ */ jsxs("section", {
		className: "mt-10 border-t border-border pt-6",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "mb-4 flex items-center justify-between",
			children: [/* @__PURE__ */ jsxs("h2", {
				className: "flex items-center gap-2 text-lg font-bold uppercase tracking-wider",
				children: [/* @__PURE__ */ jsx(Icon, {
					className: "h-5 w-5",
					style: { color: brandColor }
				}), cfg.title]
			}), /* @__PURE__ */ jsxs("span", {
				className: "text-[11px] uppercase tracking-widest text-muted-foreground",
				children: [cfg.provider === "youtube" ? "YouTube Shorts" : "Facebook Reels", cfg.mode !== "manual" && " · Auto"]
			})]
		}), loading && items.length === 0 ? /* @__PURE__ */ jsxs("div", {
			className: "flex items-center justify-center py-12 text-muted-foreground",
			children: [/* @__PURE__ */ jsx(Loader2, { className: "mr-2 h-4 w-4 animate-spin" }), " Loading latest reels…"]
		}) : /* @__PURE__ */ jsx("div", {
			className: "flex overflow-x-auto gap-2 pb-3 snap-x snap-mandatory [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden md:grid md:grid-cols-4 lg:grid-cols-5 md:gap-4 md:pb-0",
			children: items.map((it) => {
				const isPlaying = playingUrl === it.url;
				const thumb = it.thumbnail || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80";
				return /* @__PURE__ */ jsxs("div", {
					onClick: () => setPlayingUrl(it.url),
					style: {
						width: "27%",
						minWidth: "27%"
					},
					className: "group relative aspect-[9/16] shrink-0 snap-start overflow-hidden rounded-2xl bg-black border border-border/40 shadow-sm transition-all duration-300 hover:scale-[1.02] cursor-pointer md:!w-auto md:!min-w-0 md:shrink",
					children: [/* @__PURE__ */ jsx("div", {
						className: "absolute top-3 left-3 z-20 flex h-9 w-9 items-center justify-center rounded-full border-[3px] border-[#1877F2] bg-black/80 shadow-md overflow-hidden",
						children: /* @__PURE__ */ jsx(Icon, {
							className: "h-4 w-4 text-white",
							style: { color: brandColor }
						})
					}), isPlaying ? /* @__PURE__ */ jsx("iframe", {
						src: it.embedSrc,
						title: it.title ?? "Reel",
						className: "absolute inset-0 h-full w-full z-10",
						loading: "lazy",
						allow: "autoplay; encrypted-media; picture-in-picture",
						allowFullScreen: true,
						referrerPolicy: "strict-origin-when-cross-origin",
						frameBorder: 0
					}) : /* @__PURE__ */ jsxs(Fragment, { children: [
						/* @__PURE__ */ jsx("img", {
							src: thumb,
							alt: it.title ?? "Reel",
							width: 180,
							height: 320,
							className: "absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110",
							loading: "lazy",
							fetchPriority: "low",
							decoding: "async"
						}),
						/* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" }),
						/* @__PURE__ */ jsx("div", {
							className: "absolute inset-0 flex items-center justify-center opacity-80 transition-opacity group-hover:opacity-100",
							children: /* @__PURE__ */ jsx("div", {
								className: "flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur border border-white/20 shadow-lg group-hover:scale-110 transition-transform",
								children: /* @__PURE__ */ jsx(Play, { className: "h-5 w-5 fill-white ml-0.5" })
							})
						}),
						/* @__PURE__ */ jsx("div", {
							className: "hidden md:block absolute bottom-3 left-2.5 right-2.5 z-10",
							children: /* @__PURE__ */ jsx("p", {
								className: "text-xs font-bold leading-snug text-white line-clamp-2 drop-shadow-md",
								children: it.title || "Watch Reel"
							})
						})
					] })]
				}, it.url);
			})
		})]
	});
}
//#endregion
//#region src/components/site/MarketsMagazine.tsx
var FALLBACK_SLIDES = [
	news_oil_default,
	news_fed_default,
	news_tech_default,
	news_crypto_default,
	news_wallstreet_default,
	hero_markets_default
].map((src) => ({
	id: src,
	image: src,
	href: "#"
}));
function getArticleSnippet(art) {
	if (!art) return "";
	let raw = "";
	if (art.content && art.content.replace(/<[^>]+>/g, "").trim().length > 30) raw = art.content;
	else if (art.excerpt) raw = art.excerpt;
	else raw = art.content || "";
	let text = raw.replace(/<!--[\s\S]*?-->/g, " ").replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "").replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "").replace(/<[^>]+>/g, " ").replace(/&nbsp;/gi, " ").replace(/&#8203;/gi, "").replace(/&amp;/gi, "&").replace(/&quot;/gi, "\"").replace(/&#39;/gi, "'").replace(/\s+/g, " ").trim();
	if (text) {
		const parts = text.split(/(?<=[।?!.])/).map((s) => s.trim()).filter(Boolean);
		if (parts.length > 1) {
			const deduped = [];
			for (const part of parts) if (deduped.length === 0 || deduped[deduped.length - 1] !== part) deduped.push(part);
			text = deduped.join(" ");
		}
	}
	return text;
}
function MagazineLeadHeadline({ leadArt }) {
	const snippet = getArticleSnippet(leadArt);
	return /* @__PURE__ */ jsxs(Link, {
		to: "/news/$slug",
		params: { slug: leadArt.slug },
		className: "group flex flex-col justify-center pt-0.5 min-w-0 w-full",
		children: [
			/* @__PURE__ */ jsx("h2", {
				className: "headline text-[24px] sm:text-[28px] lg:text-[32px] xl:text-[36px] font-extrabold leading-[1.25] tracking-tight text-foreground group-hover:text-red-600 transition-colors line-clamp-3",
				children: leadArt.title
			}),
			/* @__PURE__ */ jsx("p", {
				className: "mt-3 text-[14px] sm:text-[15px] lg:text-[16px] leading-relaxed text-muted-foreground line-clamp-4 select-text",
				children: snippet
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "mt-3 flex items-center gap-2 font-sans text-[13px] sm:text-[14px] font-semibold text-foreground",
				children: [
					/* @__PURE__ */ jsx("span", {
						className: "text-red-600 uppercase text-xs font-bold tracking-wider",
						children: leadArt.category || "খবর"
					}),
					/* @__PURE__ */ jsx("span", {
						className: "text-slate-300",
						children: "•"
					}),
					/* @__PURE__ */ jsxs("span", { children: ["By ", leadArt.author || "Newsroom Staff"] })
				]
			})
		]
	});
}
function MagazineCard1({ p1 }) {
	return /* @__PURE__ */ jsx(Link, {
		to: "/news/$slug",
		params: { slug: p1.slug },
		className: "group block w-full max-w-full min-w-0",
		children: /* @__PURE__ */ jsxs("div", {
			className: "grid gap-4 md:grid-cols-[194px_1fr] items-start",
			children: [/* @__PURE__ */ jsx("img", {
				src: getArticleImage(p1.featuredImage, 1),
				alt: "",
				"aria-hidden": "true",
				loading: "lazy",
				decoding: "async",
				width: 194,
				height: 130,
				className: "h-[130px] md:h-[135px] w-full object-cover md:w-[194px] rounded-xs shrink-0"
			}), /* @__PURE__ */ jsxs("div", {
				className: "min-w-0",
				children: [/* @__PURE__ */ jsx("p", {
					className: "headline text-[20px] font-bold leading-[1.3] tracking-normal text-foreground group-hover:underline md:text-[22px] line-clamp-2",
					children: p1.title
				}), /* @__PURE__ */ jsx("p", {
					className: "mt-2 text-[14px] leading-relaxed text-muted-foreground line-clamp-3 overflow-hidden",
					children: getArticleSnippet(p1)
				})]
			})]
		})
	});
}
function MagazineSmallCard({ article }) {
	return /* @__PURE__ */ jsxs(Link, {
		to: "/news/$slug",
		params: { slug: article.slug },
		className: "group block min-w-0",
		children: [/* @__PURE__ */ jsx("p", {
			className: "headline text-[17px] font-bold leading-[1.32] tracking-normal text-foreground group-hover:underline line-clamp-2",
			children: article.title
		}), /* @__PURE__ */ jsx("p", {
			className: "mt-2 text-[14px] leading-relaxed text-muted-foreground line-clamp-3 overflow-hidden",
			children: getArticleSnippet(article)
		})]
	});
}
function MarketsMagazine({ articles = [], usedIds }) {
	const cfg = useHomepageConfig();
	const ctx = useAdSettings();
	const initialSlides = ctx?.adConfig ? ctx.adConfig.slots["home2"] || [] : loadAds("home2");
	const initialMode = ctx?.adConfig ? ctx.adConfig.modes["home2"] || "image" : loadAdSlotMode("home2");
	const initialScript = ctx?.adConfig ? ctx.adConfig.scripts["home2"] || "" : loadAdSlotScript("home2");
	const [slides, setSlides] = useState(() => {
		return initialSlides.length > 0 ? initialSlides : FALLBACK_SLIDES;
	});
	const [slotMode, setSlotMode] = useState(initialMode);
	const [slotScript, setSlotScript] = useState(initialScript);
	const settings = useSiteSettings();
	const [showCustomText, setShowCustomText] = useState(false);
	const hasAd = slotMode === "script" ? Boolean(slotScript) : slides.length > 0;
	const hasCustomAlert = settings.festiveThemeEnabled !== false && (!!settings.topBarWeatherCustomText || !!settings.festiveAlertImage);
	useEffect(() => {
		if (!hasCustomAlert) {
			setShowCustomText(false);
			return;
		}
		const delay = (Number(settings.topBarSwapDelay) || 5) * 1e3;
		const interval = setInterval(() => {
			setShowCustomText((prev) => !prev);
		}, delay);
		return () => clearInterval(interval);
	}, [hasCustomAlert, settings.topBarSwapDelay]);
	useEffect(() => {
		if (ctx?.adConfig) {
			const ads = ctx.adConfig.slots["home2"] || [];
			setSlides(ads.length > 0 ? ads : FALLBACK_SLIDES);
			setSlotMode(ctx.adConfig.modes["home2"] || "image");
			setSlotScript(ctx.adConfig.scripts["home2"] || "");
		}
	}, [ctx?.adConfig]);
	useEffect(() => {
		const sync = () => {
			const ads = loadAds("home2");
			setSlides(ads.length > 0 ? ads : FALLBACK_SLIDES);
			setSlotMode(loadAdSlotMode("home2"));
			setSlotScript(loadAdSlotScript("home2"));
		};
		window.addEventListener("nt:ads-updated", sync);
		return () => window.removeEventListener("nt:ads-updated", sync);
	}, []);
	const [slideIdx, setSlideIdx] = useState(0);
	useEffect(() => {
		setSlideIdx(0);
		if (slotMode === "script" || slides.length <= 1) return;
		const sec = ctx?.adConfig?.rotations["home2"] ?? loadAdRotation("home2");
		const id = setInterval(() => setSlideIdx((i) => (i + 1) % slides.length), Math.max(1, sec) * 1e3);
		return () => clearInterval(id);
	}, [
		slides,
		slotMode,
		ctx?.adConfig?.rotations
	]);
	const localUsed = new Set(usedIds || []);
	const configuredCategory = cfg.marketsMagazine.category;
	const magazineCategory = !configuredCategory || configuredCategory === "Markets" ? "Auto (Latest)" : configuredCategory;
	let dbMagazineArticles = articles.filter((a) => {
		if (localUsed.has(a.id)) return false;
		if (!magazineCategory || magazineCategory === "Auto (Latest)") return true;
		return (a.category || "").split(",").map((c) => c.trim().toLowerCase()).includes(magazineCategory.toLowerCase());
	});
	dbMagazineArticles.slice(0, 4).forEach((a) => localUsed.add(a.id));
	const leadArt = dbMagazineArticles[0];
	const p1 = dbMagazineArticles[1];
	const p2 = dbMagazineArticles[2];
	const p3 = dbMagazineArticles[3];
	const activeGradient = settings.festiveCategoryTitleGradient || settings.topBarTextGradient;
	const resolvedGrad = activeGradient && ({
		"indian-flag": "linear-gradient(to right, #FF9933, #000080, #138808)",
		diwali: "linear-gradient(to right, #FF8008, #FFC837, #FF007F, #7F00FF)",
		sunset: "linear-gradient(to right, #F5576C, #F093FB)",
		neon: "linear-gradient(to right, #FF007F, #7F00FF, #00F0FF)",
		ocean: "linear-gradient(to right, #00c6ff, #0072ff)",
		forest: "linear-gradient(to right, #11998e, #38ef7d)"
	}[activeGradient] || (activeGradient.includes("gradient(") ? activeGradient : null));
	const badgeStyle = resolvedGrad ? {
		backgroundImage: resolvedGrad,
		WebkitBackgroundClip: "text",
		WebkitTextFillColor: "transparent",
		backgroundClip: "text"
	} : { color: settings.festiveCategoryBadgeTextColor || "inherit" };
	const badgeTitle = settings.festiveThemeEnabled !== false && showCustomText && settings.topBarWeatherCustomText ? settings.topBarWeatherCustomText : cfg.marketsMagazine.title;
	if (cfg.marketsMagazine.enabled === false || !leadArt) return null;
	return /* @__PURE__ */ jsxs("section", {
		className: "border border-border bg-background px-4 py-6 font-sans sm:px-6 md:px-9 w-full max-w-full min-w-0 overflow-hidden",
		children: [
			/* @__PURE__ */ jsx("div", {
				className: "mb-4 inline-block",
				children: /* @__PURE__ */ jsx("span", {
					className: "font-sans text-xs sm:text-sm font-black uppercase tracking-widest inline-flex items-center gap-1.5 transition-all duration-300",
					style: badgeStyle,
					suppressHydrationWarning: true,
					children: hasCustomAlert && showCustomText && settings.festiveAlertImage ? /* @__PURE__ */ jsx("img", {
						src: settings.festiveAlertImage,
						alt: "Alert",
						className: "h-4 w-auto max-w-[80px] object-contain shrink-0 align-middle"
					}) : /* @__PURE__ */ jsx("span", {
						suppressHydrationWarning: true,
						children: badgeTitle
					})
				}, showCustomText ? "custom" : "default")
			}),
			/* @__PURE__ */ jsxs("div", {
				className: `grid items-start gap-6 w-full max-w-full min-w-0 ${hasAd ? "md:grid-cols-[minmax(280px,380px)_minmax(0,1fr)] lg:grid-cols-[minmax(300px,400px)_minmax(0,1fr)_340px] xl:grid-cols-[minmax(340px,460px)_minmax(0,1fr)_360px]" : "md:grid-cols-[minmax(320px,460px)_minmax(0,1fr)] lg:grid-cols-[minmax(360px,520px)_minmax(0,1fr)]"}`,
				children: [
					/* @__PURE__ */ jsx(Link, {
						to: "/news/$slug",
						params: { slug: leadArt.slug },
						className: "group block w-full min-w-0 overflow-hidden rounded-xl border border-slate-200/80 bg-slate-900/5 dark:bg-slate-900/60 transition-all hover:border-slate-300 shadow-xs",
						children: /* @__PURE__ */ jsxs("figure", {
							className: "w-full flex flex-col items-center",
							children: [/* @__PURE__ */ jsx("div", {
								className: "relative w-full flex items-center justify-center overflow-hidden rounded-xl bg-black/5 dark:bg-black/30",
								children: cfg.marketsMagazine.imageFit === "cover" ? /* @__PURE__ */ jsx("div", {
									className: "relative aspect-[16/10] sm:aspect-[16/9] w-full overflow-hidden",
									children: /* @__PURE__ */ jsx("img", {
										src: getArticleImage(leadArt.featuredImage, 0),
										alt: leadArt.title,
										loading: "lazy",
										decoding: "async",
										className: "h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
									})
								}) : /* @__PURE__ */ jsx("div", {
									className: "relative w-full flex items-center justify-center p-0.5",
									children: /* @__PURE__ */ jsx("img", {
										src: getArticleImage(leadArt.featuredImage, 0),
										alt: leadArt.title,
										loading: "lazy",
										decoding: "async",
										className: "w-full h-auto max-h-[360px] sm:max-h-[420px] object-contain rounded-lg transition-transform duration-300 group-hover:scale-[1.02]"
									})
								})
							}), leadArt.imageCredit && /* @__PURE__ */ jsx("figcaption", {
								className: "w-full px-2 py-1 text-right font-sans text-[11px] leading-tight text-muted-foreground",
								children: leadArt.imageCredit
							})]
						})
					}),
					/* @__PURE__ */ jsx(MagazineLeadHeadline, { leadArt }),
					hasAd && /* @__PURE__ */ jsx("aside", {
						className: "relative h-[200px] lg:h-[220px] w-full overflow-hidden rounded-xl border border-border bg-muted/30 shrink-0",
						children: slotMode === "script" ? /* @__PURE__ */ jsx("div", {
							className: "absolute inset-0 flex items-center justify-center p-2",
							children: /* @__PURE__ */ jsx(ScriptAdRenderer, { code: slotScript })
						}) : slides.map((s, i) => {
							const isActive = i === slideIdx;
							return /* @__PURE__ */ jsx("a", {
								href: isActive ? s.href || "#" : void 0,
								"aria-hidden": !isActive ? "true" : void 0,
								tabIndex: isActive ? 0 : -1,
								"aria-label": s.title || "Advertisement",
								className: "absolute inset-0 block transition-opacity duration-300",
								style: {
									opacity: isActive ? 1 : 0,
									pointerEvents: isActive ? "auto" : "none",
									visibility: isActive ? "visible" : "hidden"
								},
								children: /* @__PURE__ */ jsx("img", {
									src: s.image,
									alt: "",
									"aria-hidden": "true",
									loading: "lazy",
									decoding: "async",
									className: "h-full w-full object-cover"
								})
							}, s.id);
						})
					})
				]
			}),
			(p1 || p2 || p3) && /* @__PURE__ */ jsxs("div", {
				className: "mt-3 grid gap-8 border-t border-border pt-4 lg:grid-cols-[minmax(0,1.62fr)_minmax(0,0.7fr)_minmax(0,0.86fr)] w-full max-w-full min-w-0",
				children: [
					p1 && /* @__PURE__ */ jsx(MagazineCard1, { p1 }),
					p2 && /* @__PURE__ */ jsx(MagazineSmallCard, { article: p2 }),
					p3 && /* @__PURE__ */ jsx(MagazineSmallCard, { article: p3 })
				]
			})
		]
	});
}
//#endregion
//#region src/routes/index.tsx?tsr-split=component
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
						children: /* @__PURE__ */ jsx(Columnists, { hideTitle: true })
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

//# sourceMappingURL=routes-Dtohb0L8.js.map