import { c as formatViews, d as lead, g as viewsFor, h as top, l as getArticleImage, u as grid } from "./db.server-CLva-TlE.js";
import { d as loadAds, l as loadAdSlotMode, u as loadAdSlotScript } from "./site-content-CTdFps3N.js";
import { n as useAdSettings } from "./AdSettingsContext-D8Sahcar.js";
import { t as ScriptAdRenderer } from "./ScriptAdRenderer-CHXwBV65.js";
import { t as Advertisement } from "./Advertisement-CD0X2JWU.js";
import { t as Views } from "./Views-DEuQ6JxS.js";
import { n as articlesByCategory } from "./homepage-config-DQdjQN7H.js";
import { t as useHomepageConfig } from "./use-homepage-config-PRZOtUB3.js";
import { t as SocialIcons } from "./SocialIcons-6v85WFMj.js";
import { t as Header } from "./Header-wdu8y5RN.js";
import { t as cn } from "./utils-C_uf36nf.js";
import { t as Route } from "./routes-DRzsGLEG.js";
import { t as ArchiveFinder } from "./ArchiveFinder-CRW_hGql.js";
import { t as Button } from "./button-CtdWWMYi.js";
import * as React$1 from "react";
import React, { Suspense, lazy, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { ArrowLeft, ArrowRight, Radio, Volume2, VolumeX } from "lucide-react";
import { motion } from "framer-motion";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
//#region src/lib/mock-news-data.ts
var leftItems = [
	{
		kicker: "Health",
		title: "Why postpartum depression went untreated for thousands of years",
		excerpt: "Ei mei scripta intellegat. Verear voluptaria eam at, consul putent eu vel. Pro saepe maluisset ne, audire maiorum forensibus eos."
	},
	{
		kicker: "Food",
		title: "Extra $2.50 for half a prawn? Diner unhappy about $8.50 laksa",
		excerpt: "Justo fabulas singulis at pri, saepe luptatum mei an. Duo idque solet scribentur eu, natum iudico labore te eos, no."
	},
	{
		kicker: "Tech",
		title: "Did You Know You Can Unsend and Edit Text Messages on Your iPhone",
		excerpt: "Usu tantas omittantur ut, per te modo appetere senserit. Ei ius aperiam tincidunt, ea sit natum iisque repudiandae.",
		img: top[2].img
	},
	{
		kicker: "Politics",
		title: "EU governments present bill to reserve 3rd of parliament seats",
		excerpt: "Duo dolorum mandamus mnesarchum te. Sit ridens persius ex. Vel noluisse perpetua consequat ex, has nostro antiopam eu."
	},
	{
		kicker: "Climate",
		title: "Record heatwave pushes power grids to the brink across southern Europe",
		excerpt: "Operators in Spain, Italy and Greece warned of rolling blackouts as demand from cooling systems hit all-time highs this week."
	}
];
var bottomItems = [
	{
		kicker: "Markets",
		title: "Wall Street closes higher as Federal Reserve signals patience on rate cuts and traders bet on a softer landing for the US economy heading into year-end",
		excerpt: "The S&P 500 and Nasdaq notched fresh records after Chair Powell told lawmakers the central bank can afford to wait before easing policy further. Treasury yields slipped across the curve as traders dialed back bets on an imminent cut, while the dollar weakened against a basket of major peers. Bank stocks led the advance, with regional lenders rallying on hopes that a steeper yield curve will revive net interest margins into the new year as deposit costs finally begin to ease."
	},
	{
		kicker: "Business",
		title: "Boeing wins record $14 billion order as Gulf carrier expands long-haul fleet across Asia and Europe",
		excerpt: "The deal — covering 40 widebody jets with options for 20 more — marks the planemaker's largest single order of the year and lifts its backlog past 5,500 aircraft. Executives said the agreement underscores resurgent long-haul demand out of the Gulf as carriers race to add capacity on routes to Asia, Africa and the Americas. Deliveries are expected to begin in late 2027 and stretch into the following decade, giving Boeing's South Carolina widebody line a multi-year runway just as it stabilizes production after a turbulent stretch on the 787 and 777X programs."
	},
	{
		kicker: "Tech",
		title: "Nvidia briefly tops $4 trillion as AI chip demand shows no sign of cooling",
		excerpt: "Shares climbed 2.6% in early trading, pushing the chipmaker past Apple and Microsoft to become the most valuable listed company in the world."
	},
	{
		kicker: "Crypto",
		title: "Bitcoin breaks $112,000 as spot ETFs log record weekly inflows",
		excerpt: "More than $3.2 billion flowed into US-listed spot bitcoin funds last week, with BlackRock's IBIT alone accounting for nearly half of the total."
	},
	{
		kicker: "Markets",
		title: "Oil slips below $78 as OPEC+ signals gradual supply return",
		excerpt: "Brent crude eased after the producer group confirmed it will unwind voluntary cuts in monthly tranches through the second half of the year."
	},
	{
		kicker: "Business",
		title: "Tesla unveils next-gen robotaxi platform with sub-$25K price tag",
		excerpt: "Elon Musk said production will begin in Texas next year, with the company targeting one million autonomous units annually by 2028."
	}
];
var popularItems = [
	{
		title: "Europe must forge a new role in the global economy",
		by: "Claire",
		img: lead.img
	},
	{
		title: "Why postpartum depression went untreated for thousands of years",
		by: "Claire",
		img: top[1].img
	},
	{
		title: "Global economic growth forecasts slashed",
		by: "Claire",
		img: grid[2].img
	},
	{
		title: "Extra $2.50 for half a prawn? Diner unhappy about $8.50 laksa",
		by: "Lucas",
		img: grid[1].img
	}
];
var opinionItems = [
	{
		title: "A state campsite reservation bill heads for the governor's desk",
		by: "Claire",
		img: grid[0].img,
		slug: "sample"
	},
	{
		title: "Did You Know You Can Unsend and Edit Text Messages on Your iPhone",
		by: "Lucas",
		img: top[2].img,
		slug: "sample"
	},
	{
		title: "Who is Andrew Yang, the Internet's Favorite Candidate? | 2020 Presidential Candidate",
		by: "Neil",
		img: top[0].img,
		slug: "sample"
	},
	{
		title: "Artist / Teacher in Classical Voice job with us",
		by: "Claire",
		img: grid[1].img,
		slug: "sample"
	},
	{
		title: "Fed minutes hint at slower pace of rate cuts through summer",
		by: "Maya",
		img: grid[2].img,
		slug: "sample"
	},
	{
		title: "Inside the boardroom battle reshaping Europe's largest carmaker",
		by: "Daniel",
		img: top[1].img,
		slug: "sample"
	}
];
var cultureItems = [
	{
		title: "Bob Dylan: Icon of 20th Century Music",
		excerpt: "Duo dolorum mandamus mnesarchum te. Sit ridens persius ex. Vel noluisse perpetua consequat ex, has nostro antiopam eu. Nec esse meis eu.",
		date: "Jul 21, 2019",
		kicker: "Music",
		img: top[0].img,
		play: true,
		slug: "sample"
	},
	{
		title: "Bob Dylan: The Best Collection of 1963",
		excerpt: "Labore nonumes te vel, vis id errem tantas tempor. Solet quidam salutatus at quo. Tantas comprehensam te sea, usu sanctus similique ei.",
		date: "Jan 20, 2018",
		kicker: "Music",
		img: top[1].img,
		slug: "sample"
	},
	{
		title: "Top 20 Female CEOs In Tech Corporates",
		excerpt: "Duo dolorum mandamus mnesarchum te. Sit ridens persius ex. Vel noluisse perpetua consequat ex, has nostro antiopam eu.",
		date: "Apr 23, 2017",
		kicker: "Business",
		img: grid[0].img,
		slug: "sample"
	},
	{
		title: "Everything about Bitcoin explained in this article",
		excerpt: "Quo natum nemore putant in, his te case habemus. Nulla detraxit explicari in vim. Id eam magna omnesque.",
		date: "Nov 11, 2015",
		kicker: "Crypto",
		img: grid[2].img,
		slug: "sample"
	}
];
//#endregion
//#region src/components/ui/AnimatedContainer.tsx
function AnimatedContainer({ children, className, delay = 0, duration = .5 }) {
	return /* @__PURE__ */ jsx(motion.div, {
		initial: {
			opacity: 0,
			y: 20
		},
		whileInView: {
			opacity: 1,
			y: 0
		},
		viewport: {
			once: true,
			margin: "-50px"
		},
		transition: {
			duration,
			delay,
			ease: "easeOut"
		},
		className: cn(className),
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
function HeadlineArticle({ item, dense = false }) {
	return /* @__PURE__ */ jsxs(Link, {
		to: "/news/$slug",
		params: { slug: item.slug || "sample" },
		className: "group block",
		children: [
			item.img && /* @__PURE__ */ jsx("div", {
				className: "mb-3 overflow-hidden",
				children: /* @__PURE__ */ jsx("img", {
					src: item.img,
					alt: item.title,
					loading: "lazy",
					className: "aspect-[16/10] w-full object-cover transition-transform duration-500 group-hover:scale-105"
				})
			}),
			/* @__PURE__ */ jsx("h3", {
				className: `headline text-foreground group-hover:underline ${dense ? "text-lg" : "text-xl"}`,
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
				dense: true
			})
		}, `${it.title}-${i}`))
	});
}
//#endregion
//#region src/components/site/LiveVideo.tsx
function LiveVideo() {
	const { liveVideo } = useHomepageConfig();
	const [muted, setMuted] = useState(true);
	const iframeRef = useRef(null);
	const src = useMemo(() => {
		if (liveVideo.provider === "youtube") return `https://www.youtube-nocookie.com/embed/live_stream?channel=${liveVideo.youtubeChannelId}&autoplay=1&mute=${muted ? 1 : 0}&controls=0&modestbranding=1&rel=0&showinfo=0&iv_load_policy=3&disablekb=1&fs=0&playsinline=1&enablejsapi=1`;
		return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(liveVideo.facebookPageUrl)}&show_text=false&autoplay=1&mute=${muted ? 1 : 0}`;
	}, [liveVideo, muted]);
	const toggleMute = () => {
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
		children: /* @__PURE__ */ jsxs("div", {
			className: "relative aspect-[4/3] w-full overflow-hidden bg-black",
			children: [
				/* @__PURE__ */ jsx("iframe", {
					ref: iframeRef,
					src,
					title: liveVideo.title,
					className: "absolute inset-0 h-full w-full",
					allow: "autoplay; encrypted-media; picture-in-picture",
					allowFullScreen: true,
					referrerPolicy: "strict-origin-when-cross-origin",
					frameBorder: 0
				}),
				/* @__PURE__ */ jsxs("span", {
					className: "pointer-events-none absolute left-3 top-3 inline-flex items-center gap-1.5 bg-[#dc2626] px-2 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-white",
					children: [/* @__PURE__ */ jsx(Radio, { className: "h-3 w-3 animate-pulse" }), "Live"]
				}),
				/* @__PURE__ */ jsx("button", {
					type: "button",
					onClick: toggleMute,
					"aria-label": muted ? "Unmute" : "Mute",
					className: "absolute bottom-3 right-3 inline-flex h-9 w-9 items-center justify-center bg-black/70 text-white backdrop-blur transition hover:bg-black",
					children: muted ? /* @__PURE__ */ jsx(VolumeX, { className: "h-4 w-4" }) : /* @__PURE__ */ jsx(Volume2, { className: "h-4 w-4" })
				})
			]
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
	const [featuredAds, setFeaturedAds] = React.useState(ctx?.adConfig?.slots?.featured_slide || []);
	const [featuredAdMode, setFeaturedAdMode] = React.useState(ctx?.adConfig?.modes?.featured_slide || "image");
	const [featuredAdScript, setFeaturedAdScript] = React.useState(ctx?.adConfig?.scripts?.featured_slide || "");
	React.useEffect(() => {
		const sync = () => {
			setFeaturedAds(loadAds("featured_slide"));
			setFeaturedAdMode(loadAdSlotMode("featured_slide"));
			setFeaturedAdScript(loadAdSlotScript("featured_slide"));
		};
		sync();
		window.addEventListener("nt:ads-updated", sync);
		return () => window.removeEventListener("nt:ads-updated", sync);
	}, []);
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
						width: 800,
						height: 500,
						className: "aspect-[16/10] w-full object-cover transition-transform duration-500 group-hover:scale-105"
					})
				}),
				/* @__PURE__ */ jsx("h2", {
					className: "headline mt-4 hidden text-2xl text-foreground group-hover:underline md:block md:text-3xl",
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
						kicker: featured.kicker || "Featured"
					})
				})
			]
		}) }, `news-${index}`));
		if (showMultiple) {
			if (featuredAdMode === "script" && featuredAdScript) carouselItems.push(/* @__PURE__ */ jsx(CarouselItem, { children: /* @__PURE__ */ jsx("div", {
				className: "flex aspect-[16/10] w-full items-center justify-center bg-slate-50 overflow-hidden",
				children: /* @__PURE__ */ jsx(ScriptAdRenderer, { script: featuredAdScript })
			}) }, `ad-${index}`));
			else if (featuredAdMode === "image" && featuredAds.length > 0) {
				const ad = featuredAds[index % featuredAds.length];
				carouselItems.push(/* @__PURE__ */ jsx(CarouselItem, { children: /* @__PURE__ */ jsx("a", {
					href: ad.href,
					target: "_blank",
					rel: "noopener noreferrer",
					className: "block w-full",
					children: /* @__PURE__ */ jsx("img", {
						src: ad.image,
						alt: ad.label || "Advertisement",
						className: "aspect-[16/10] w-full object-cover"
					})
				}) }, `ad-${index}`));
			}
		}
	});
	return /* @__PURE__ */ jsxs("div", {
		className: "flex flex-col gap-8 lg:col-span-8 lg:border-l lg:border-border lg:pl-8",
		children: [/* @__PURE__ */ jsx("article", { children: /* @__PURE__ */ jsx("div", {
			className: "relative group/carousel",
			children: /* @__PURE__ */ jsxs(Carousel, {
				setApi,
				plugins,
				className: "w-full",
				opts: { loop: true },
				children: [
					/* @__PURE__ */ jsx(CarouselContent, { children: carouselItems }),
					leads.length > 1 && /* @__PURE__ */ jsxs("div", {
						className: "pointer-events-none absolute inset-x-0 top-0 flex aspect-[16/10] items-center justify-between opacity-0 transition-opacity duration-300 group-hover/carousel:opacity-100",
						children: [/* @__PURE__ */ jsx(CarouselPrevious, { className: "pointer-events-auto static h-8 w-6 translate-x-0 translate-y-0 rounded-r-md rounded-l-none border-none bg-black/50 text-white hover:bg-black/70" }), /* @__PURE__ */ jsx(CarouselNext, { className: "pointer-events-auto static h-8 w-6 translate-x-0 translate-y-0 rounded-l-md rounded-r-none border-none bg-black/50 text-white hover:bg-black/70" })]
					}),
					count > 1 && /* @__PURE__ */ jsx("div", {
						className: "mt-4 flex justify-center sm:pointer-events-none sm:absolute sm:inset-x-0 sm:top-0 sm:mt-0 sm:aspect-[16/10] sm:items-end sm:pb-3",
						children: /* @__PURE__ */ jsx("div", {
							className: "flex gap-1.5 rounded-full sm:pointer-events-auto sm:bg-white/30 sm:px-2 sm:py-1 sm:backdrop-blur-sm",
							children: Array.from({ length: count }).map((_, i) => /* @__PURE__ */ jsx("button", {
								className: `h-2.5 w-2.5 sm:h-2 sm:w-2 rounded-full transition-all ${i === current ? "bg-slate-900" : "bg-slate-300 sm:bg-slate-600/60"}`,
								onClick: (e) => {
									e.preventDefault();
									api?.scrollTo(i);
								},
								"aria-label": `Go to slide ${i + 1}`
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
	return /* @__PURE__ */ jsxs("div", {
		className: "mt-10 border-t border-border pt-6",
		children: [/* @__PURE__ */ jsx("h3", {
			className: "mb-6 font-bold uppercase tracking-[0.25em]",
			style: {
				color: cfg.heroTopStories.color,
				fontSize: `${cfg.heroTopStories.fontSize}px`
			},
			children: cfg.heroTopStories.title
		}), /* @__PURE__ */ jsxs("div", {
			className: "grid gap-8 md:grid-cols-2 lg:grid-cols-3",
			children: [
				/* @__PURE__ */ jsxs(Link, {
					to: "/news/$slug",
					params: { slug: activeBottomItems[0].slug || "sample" },
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
							className: "mt-2 text-sm leading-snug text-muted-foreground [-webkit-line-clamp:6] [display:-webkit-box] [-webkit-box-orient:vertical] overflow-hidden [&::first-letter]:font-serif [&::first-letter]:float-left [&::first-letter]:mr-2 [&::first-letter]:text-5xl [&::first-letter]:font-bold [&::first-letter]:leading-[0.9] [&::first-letter]:text-foreground",
							children: activeBottomItems[0].excerpt
						}),
						/* @__PURE__ */ jsx(MinRead, {
							seed: activeBottomItems[0].title,
							kicker: activeBottomItems[0].kicker
						})
					]
				}),
				/* @__PURE__ */ jsxs(Link, {
					to: "/news/$slug",
					params: { slug: activeBottomItems[1].slug || "sample" },
					className: "group block",
					children: [
						activeBottomItems[1].img && /* @__PURE__ */ jsx("div", {
							className: "overflow-hidden",
							children: /* @__PURE__ */ jsx("img", {
								src: activeBottomItems[1].img,
								alt: activeBottomItems[1].title,
								loading: "lazy",
								decoding: "async",
								className: "aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-105"
							})
						}),
						/* @__PURE__ */ jsx("h3", {
							className: "headline mt-4 text-xl text-foreground group-hover:underline line-clamp-2 [-webkit-line-clamp:2] [max-height:none]",
							children: activeBottomItems[1].title
						}),
						/* @__PURE__ */ jsx("p", {
							className: "mt-2 text-sm leading-snug text-muted-foreground [-webkit-line-clamp:6] [display:-webkit-box] [-webkit-box-orient:vertical] overflow-hidden [&::first-letter]:font-serif [&::first-letter]:float-left [&::first-letter]:mr-2 [&::first-letter]:text-5xl [&::first-letter]:font-bold [&::first-letter]:leading-[0.9] [&::first-letter]:text-foreground",
							children: activeBottomItems[1].excerpt
						}),
						/* @__PURE__ */ jsx(MinRead, {
							seed: activeBottomItems[1].title,
							kicker: activeBottomItems[1].kicker
						})
					]
				}),
				/* @__PURE__ */ jsx("div", {
					className: "divide-y divide-border",
					children: activeBottomItems.slice(2, 5).map((item, idx) => /* @__PURE__ */ jsx("div", {
						className: idx === 0 ? "pb-5" : idx === 1 ? "py-5" : "pt-5",
						children: /* @__PURE__ */ jsx(HeadlineArticle, {
							item,
							dense: true
						})
					}, `${item.title}-${idx}`))
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
		children: [/* @__PURE__ */ jsx("h3", {
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
				params: { slug: c.slug || "sample" },
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
					/* @__PURE__ */ jsx("h4", {
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
			}, `${c.title}-${i}`))
		})]
	});
}
//#endregion
//#region src/components/site/hero/HeroSidebarRight.tsx
function HeroSidebarRight({ cfg, activeOpinionItems, activePopularItems, tags }) {
	return /* @__PURE__ */ jsxs("aside", {
		className: "space-y-6 lg:col-span-3 lg:border-l lg:border-border lg:pl-6",
		children: [
			/* @__PURE__ */ jsx("h3", {
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
					params: { slug: o.slug || "sample" },
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
				}) }, `${o.title}-${i}`))
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
			/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h3", {
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
					params: { slug: p.slug || "sample" },
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
				}) }, `${p.title}-${i}`))
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
	const localUsed = usedIds || /* @__PURE__ */ new Set();
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
	const featuredCategory = cfg.heroFeatured.category || "Auto (Latest)";
	const slideCount = cfg?.heroFeatured?.slideCount ?? 3;
	const leadArticles = getUnique(articles, slideCount, (a) => {
		if (!featuredCategory || featuredCategory === "Auto (Latest)") return true;
		return a.category?.toLowerCase() === featuredCategory.toLowerCase();
	});
	const activeLeads = Array.from({ length: slideCount }).map((_, i) => {
		const a = leadArticles[i];
		if (a) return {
			kicker: a.category,
			title: a.title,
			dek: a.excerpt || a.content?.replace(/<[^>]*>/g, "").slice(0, 150) + "...",
			author: `By ${a.author || "Newsroom"}`,
			time: formatUtcDate(a.date),
			img: getArticleImage(a.featuredImage, i),
			views: a.views || 0,
			slug: a.slug
		};
		return {
			...lead,
			slug: "sample",
			img: getArticleImage("", i)
		};
	});
	const leftArticles = getUnique(articles, 5);
	const activeLeftItems = Array.from({ length: 5 }).map((_, i) => {
		const a = leftArticles[i];
		const l = leftItems[i];
		if (a) return {
			kicker: a.category,
			title: a.title,
			excerpt: a.excerpt || a.content?.replace(/<[^>]*>/g, "").slice(0, 100) + "...",
			img: i === 2 ? getArticleImage(a.featuredImage, i + 7) : void 0,
			slug: a.slug
		};
		return {
			...l,
			slug: "sample"
		};
	});
	const bottomArticles = getUnique(articles, 6);
	const activeBottomItems = Array.from({ length: 6 }).map((_, i) => {
		const a = bottomArticles[i];
		const b = bottomItems[i];
		if (a) return {
			kicker: a.category,
			title: a.title,
			excerpt: a.excerpt || a.content?.replace(/<[^>]*>/g, "").slice(0, 150) + "...",
			img: i < 2 ? getArticleImage(a.featuredImage, i + 12) : void 0,
			slug: a.slug
		};
		return {
			...b,
			slug: "sample",
			img: i < 2 ? grid[i % grid.length].img : void 0
		};
	});
	const popularCategory = cfg.heroPopular.category || "Auto (Latest)";
	const popularArticles = getUnique(articles, 4, (a) => {
		if (!popularCategory || popularCategory === "Auto (Latest)") return true;
		return a.category?.toLowerCase() === popularCategory.toLowerCase();
	});
	const activePopularItems = Array.from({ length: 4 }).map((_, i) => {
		const a = popularArticles[i];
		const p = popularItems[i];
		if (a) return {
			title: a.title,
			by: a.author || "Newsroom",
			img: getArticleImage(a.featuredImage, i + 18),
			views: a.views || 0,
			slug: a.slug
		};
		return {
			...p,
			slug: "sample"
		};
	});
	const opinionCategory = cfg.heroOpinion.category || "Opinion";
	const opinionArticles = getUnique(articles, 6, (a) => {
		if (!opinionCategory || opinionCategory === "Auto (Latest)") return true;
		return a.category?.toLowerCase() === opinionCategory.toLowerCase();
	});
	const activeOpinionItems = Array.from({ length: 6 }).map((_, i) => {
		const a = opinionArticles[i];
		const o = opinionItems[i];
		if (a) return {
			title: a.title,
			by: a.author || "Newsroom",
			img: getArticleImage(a.featuredImage, i + 22),
			slug: a.slug
		};
		return o;
	});
	const cultureCategory = cfg.heroCultureMusic.category || "Auto (Latest)";
	const cultureArticles = getUnique(articles, 4, (a) => {
		if (!cultureCategory || cultureCategory === "Auto (Latest)") return true;
		return a.category?.toLowerCase() === cultureCategory.toLowerCase();
	});
	const activeCultureItems = Array.from({ length: 4 }).map((_, i) => {
		const a = cultureArticles[i];
		const c = cultureItems[i];
		if (a) return {
			title: a.title,
			excerpt: a.excerpt || a.content?.replace(/<[^>]*>/g, "").slice(0, 100) + "...",
			date: formatUtcDate(a.date),
			kicker: a.category,
			img: getArticleImage(a.featuredImage, i + 28),
			play: i === 0,
			slug: a.slug
		};
		return c;
	});
	return /* @__PURE__ */ jsx(AnimatedContainer, {
		className: "border-b border-border py-4 md:py-8",
		children: /* @__PURE__ */ jsxs("div", {
			className: "grid gap-8 lg:grid-cols-12",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "lg:col-span-9",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "grid gap-8 lg:grid-cols-12",
						children: [/* @__PURE__ */ jsx("div", {
							className: "hidden lg:col-span-4 lg:block",
							children: /* @__PURE__ */ jsx(HeroSidebarLeft, { activeLeftItems })
						}), /* @__PURE__ */ jsx(HeroMain, {
							hasDbArticles,
							activeLeads,
							cfg,
							articlesByCategory
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
var Columnists = lazy(() => import("./Columnists-C1CzQ-tm.js").then((m) => ({ default: m.Columnists })));
var NewsGrid = lazy(() => import("./NewsGrid-BOrmJuu0.js").then((m) => ({ default: m.NewsGrid })));
var ReelsSection = lazy(() => import("./ReelsSection-kXJDiMmc.js").then((m) => ({ default: m.ReelsSection })));
var MarketsMagazine = lazy(() => import("./MarketsMagazine-CfP6wp_o.js").then((m) => ({ default: m.MarketsMagazine })));
var Footer = lazy(() => import("./Footer-Bm6dwnfc.js").then((n) => n.n).then((m) => ({ default: m.Footer })));
function Home() {
	const { articles: dbArticles, tags: dbTags } = Route.useLoaderData();
	const usedIds = /* @__PURE__ */ new Set();
	return /* @__PURE__ */ jsxs("div", {
		className: "min-h-screen bg-background text-foreground",
		children: [
			/* @__PURE__ */ jsx(Header, {}),
			/* @__PURE__ */ jsxs("main", {
				className: "mx-auto max-w-7xl px-4 py-4 md:py-10",
				children: [
					/* @__PURE__ */ jsx("div", {
						className: "block md:hidden border-b border-border mb-2 pb-2",
						children: /* @__PURE__ */ jsx(Columnists, {})
					}),
					/* @__PURE__ */ jsx(HeroBoard, {
						articles: dbArticles,
						tags: dbTags,
						usedIds
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
						children: /* @__PURE__ */ jsx(ReelsSection, { articles: dbArticles })
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
			/* @__PURE__ */ jsx(LazySection, {
				minHeight: 400,
				children: /* @__PURE__ */ jsx(Footer, {})
			})
		]
	});
}
//#endregion
export { Home as component };
