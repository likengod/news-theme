import { t as formatViews } from "./news-data-DU6ZB54L.js";
import { t as ScriptAdRenderer } from "./ScriptAdRenderer-CHXwBV65.js";
import { t as cn } from "./utils-C_uf36nf.js";
import { n as MinRead } from "./HeadlineArticle-DsJQ96Zs.js";
import { t as Button } from "./button-DpkoYptL.js";
import * as React$1 from "react";
import React from "react";
import { Link } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { ArrowLeft, ArrowRight } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
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
export { HeroFeaturedSlider as default };

//# sourceMappingURL=HeroFeaturedSlider-DG9JevR0.js.map