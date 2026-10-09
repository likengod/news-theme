import { a as isEnterprisePlusLicense } from "./site-settings-D_CS8z9z.js";
import { f as loadAdSlotMode, m as loadAds, p as loadAdSlotScript } from "./ads-storage-BtMpTvdX.js";
import { a as useSiteSettings, n as useAdSettings } from "./AdSettingsContext-BMog_ABz.js";
import { n as getArticleImage, t as formatViews } from "./news-data-DU6ZB54L.js";
import { t as Views } from "./Views-D9MbWe85.js";
import { s as articlesByCategory } from "./homepage-config-CvRBpbe4.js";
import { t as useHomepageConfig } from "./use-homepage-config-BJSOzr5Y.js";
import { n as Advertisement, r as ScriptAdRenderer, t as ArchiveFinder } from "./ArchiveFinder-BAaDLV5g.js";
import { n as SocialIcons, t as Footer } from "./Footer-62k6RSn-.js";
import { t as cn } from "./utils-C_uf36nf.js";
import { t as Header } from "./Header-D0KyqIg0.js";
import { t as Route } from "./routes-Dz-EQWBt.js";
import { t as Button } from "./button-CtdWWMYi.js";
import * as React$1 from "react";
import React, { Suspense, lazy, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { ArrowLeft, ArrowRight, Play, Radio, Volume2, VolumeX } from "lucide-react";
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
									onError: (e) => {
										const el = e.currentTarget;
										el.onerror = null;
										el.src = getArticleImage(void 0, 0);
									},
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
									onError: (e) => {
										const el = e.currentTarget;
										el.onerror = null;
										el.src = getArticleImage(void 0, 1);
									},
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
//#region src/routes/index.tsx?tsr-split=component
var Columnists = lazy(() => import("./Columnists-CfmKsaDL.js").then((m) => ({ default: m?.default || m?.Columnists || (() => null) })));
var NewsGrid = lazy(() => import("./NewsGrid-CTskr_jO.js").then((m) => ({ default: m?.default || m?.NewsGrid || (() => null) })));
var ReelsSection = lazy(() => import("./ReelsSection-KuF8Y9K4.js").then((m) => ({ default: m?.default || m?.ReelsSection || (() => null) })));
var MarketsMagazine = lazy(() => import("./MarketsMagazine-DifOJYlx.js").then((m) => ({ default: m?.default || m?.MarketsMagazine || (() => null) })));
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

//# sourceMappingURL=routes-DiaxQex7.js.map