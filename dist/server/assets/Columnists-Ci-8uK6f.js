import { c as formatViews, d as lead, g as viewsFor, h as top, u as grid } from "./db.server-Chz3iTW3.js";
import { m as loadAds, u as injectReelAds } from "./site-content-B0GnrEDb.js";
import { n as useAdSettings } from "./AdSettingsContext-DMz3sC6c.js";
import { t as Views } from "./Views-MJGDQohZ.js";
import { t as useHomepageConfig } from "./use-homepage-config-Drcw92ln.js";
import { t as useIsMobile } from "./use-mobile-ZPBRhHdE.js";
import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { Check, ChevronLeft, ChevronRight, Copy, ExternalLink, Eye, Play, Share2, Sparkles, X } from "lucide-react";
import { FaFacebookF, FaTwitter, FaWhatsapp } from "react-icons/fa6";
//#region src/components/site/Columnists.tsx
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
function ReelViewerModal({ initialIndex, items, onClose }) {
	const [currentIndex, setCurrentIndex] = useState(initialIndex);
	const [copied, setCopied] = useState(false);
	const [showShareMenu, setShowShareMenu] = useState(false);
	const touchStartRef = useRef(null);
	const currentItem = items[currentIndex];
	useEffect(() => {
		const handleKeyDown = (e) => {
			if (e.key === "Escape") onClose();
			if (e.key === "ArrowRight" || e.key === "ArrowDown") {
				setCurrentIndex((i) => (i + 1) % items.length);
				setShowShareMenu(false);
			}
			if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
				setCurrentIndex((i) => (i - 1 + items.length) % items.length);
				setShowShareMenu(false);
			}
		};
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [items.length, onClose]);
	const handleTouchStart = (e) => {
		const t = e.touches[0];
		touchStartRef.current = {
			x: t.clientX,
			y: t.clientY
		};
	};
	const handleTouchEnd = (e) => {
		if (!touchStartRef.current) return;
		const t = e.changedTouches[0];
		const dx = t.clientX - touchStartRef.current.x;
		const dy = t.clientY - touchStartRef.current.y;
		touchStartRef.current = null;
		if (Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > 60) {
			onClose();
			return;
		}
		if (Math.abs(dx) > 40) {
			setShowShareMenu(false);
			if (dx < 0) setCurrentIndex((i) => (i + 1) % items.length);
			else setCurrentIndex((i) => (i - 1 + items.length) % items.length);
		}
	};
	const handleCopyLink = (e) => {
		e.stopPropagation();
		const shareUrl = window.location.href;
		navigator.clipboard.writeText(shareUrl);
		setCopied(true);
		setTimeout(() => setCopied(false), 2e3);
	};
	const handleNativeShare = async (e) => {
		e.stopPropagation();
		const shareUrl = window.location.href;
		if (typeof navigator !== "undefined" && navigator.share) try {
			await navigator.share({
				title: currentItem.title,
				text: `Watch "${currentItem.title}" on News Theme`,
				url: shareUrl
			});
			return;
		} catch {}
		setShowShareMenu((v) => !v);
	};
	const currentUrl = typeof window !== "undefined" ? window.location.href : "";
	const shareText = encodeURIComponent(`Watch "${currentItem.title}": ${currentUrl}`);
	return /* @__PURE__ */ jsxs("div", {
		className: "fixed inset-0 z-[100] flex flex-col justify-between bg-black/95 backdrop-blur-md p-4 animate-in fade-in duration-200",
		onTouchStart: handleTouchStart,
		onTouchEnd: handleTouchEnd,
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "z-30 flex items-center justify-between text-white max-w-lg mx-auto w-full pt-2",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ jsxs("span", {
						className: "rounded-full bg-red-600 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider",
						children: [
							"Reel ",
							currentIndex + 1,
							" / ",
							items.length
						]
					}), /* @__PURE__ */ jsx("span", {
						className: "text-xs text-white/70 hidden sm:inline",
						children: "Swipe left/right for next • Swipe up to close"
					})]
				}), /* @__PURE__ */ jsx("button", {
					type: "button",
					onClick: onClose,
					"aria-label": "Close Reel",
					className: "flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur transition hover:bg-white/40",
					children: /* @__PURE__ */ jsx(X, { className: "h-5 w-5" })
				})]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "relative my-auto flex h-[76vh] w-full max-w-md mx-auto items-center justify-center",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "relative aspect-[9/16] h-full w-full max-w-sm overflow-hidden rounded-2xl border border-white/10 bg-black shadow-2xl",
					children: [
						/* @__PURE__ */ jsx("iframe", {
							src: currentItem.embedSrc,
							title: currentItem.title,
							className: "h-full w-full object-cover",
							allow: "autoplay; encrypted-media; picture-in-picture",
							allowFullScreen: true,
							frameBorder: 0
						}, currentItem.title),
						/* @__PURE__ */ jsx("button", {
							type: "button",
							onClick: (e) => {
								e.stopPropagation();
								setShowShareMenu(false);
								setCurrentIndex((i) => (i - 1 + items.length) % items.length);
							},
							className: "absolute left-2 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur border border-white/20 transition hover:bg-black/80",
							"aria-label": "Previous Reel",
							children: /* @__PURE__ */ jsx(ChevronLeft, { className: "h-6 w-6" })
						}),
						/* @__PURE__ */ jsx("button", {
							type: "button",
							onClick: (e) => {
								e.stopPropagation();
								setShowShareMenu(false);
								setCurrentIndex((i) => (i + 1) % items.length);
							},
							className: "absolute right-2 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur border border-white/20 transition hover:bg-black/80",
							"aria-label": "Next Reel",
							children: /* @__PURE__ */ jsx(ChevronRight, { className: "h-6 w-6" })
						})
					]
				}), /* @__PURE__ */ jsxs("div", {
					className: "absolute right-1 bottom-6 flex flex-col items-center gap-4 z-30",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "flex flex-col items-center gap-1 text-white",
							title: "Views",
							children: [/* @__PURE__ */ jsx("div", {
								className: "flex h-11 w-11 items-center justify-center rounded-full bg-black/70 text-white backdrop-blur border border-white/20 shadow-xl",
								children: /* @__PURE__ */ jsx(Eye, { className: "h-5 w-5 text-white/90" })
							}), /* @__PURE__ */ jsx("span", {
								className: "text-[10px] font-bold tracking-wide text-white/90",
								children: formatViews(viewsFor(currentItem.title))
							})]
						}),
						/* @__PURE__ */ jsxs("button", {
							type: "button",
							onClick: handleNativeShare,
							className: "flex flex-col items-center gap-1 text-white hover:scale-110 transition-transform",
							title: "Share Reel",
							children: [/* @__PURE__ */ jsx("div", {
								className: "flex h-11 w-11 items-center justify-center rounded-full bg-black/70 text-white backdrop-blur border border-white/20 shadow-xl hover:bg-white/20",
								children: /* @__PURE__ */ jsx(Share2, { className: "h-5 w-5" })
							}), /* @__PURE__ */ jsx("span", {
								className: "text-[10px] font-bold tracking-wide text-white/90",
								children: "Share"
							})]
						}),
						/* @__PURE__ */ jsxs("button", {
							type: "button",
							onClick: handleCopyLink,
							className: "flex flex-col items-center gap-1 text-white hover:scale-110 transition-transform",
							title: "Copy Reel Link",
							children: [/* @__PURE__ */ jsx("div", {
								className: "flex h-11 w-11 items-center justify-center rounded-full bg-black/70 text-white backdrop-blur border border-white/20 shadow-xl hover:bg-white/20",
								children: copied ? /* @__PURE__ */ jsx(Check, { className: "h-5 w-5 text-green-400" }) : /* @__PURE__ */ jsx(Copy, { className: "h-5 w-5" })
							}), /* @__PURE__ */ jsx("span", {
								className: "text-[10px] font-bold tracking-wide text-white/90",
								children: copied ? "Copied" : "Copy"
							})]
						})
					]
				})]
			}),
			showShareMenu && /* @__PURE__ */ jsxs("div", {
				className: "absolute inset-x-4 bottom-16 z-50 max-w-sm mx-auto rounded-2xl bg-zinc-900/95 p-4 text-white border border-white/20 shadow-2xl backdrop-blur-lg animate-in slide-in-from-bottom duration-200",
				onClick: (e) => e.stopPropagation(),
				children: [/* @__PURE__ */ jsxs("div", {
					className: "flex items-center justify-between pb-3 border-b border-white/10",
					children: [/* @__PURE__ */ jsx("h4", {
						className: "text-sm font-bold",
						children: "Share to"
					}), /* @__PURE__ */ jsx("button", {
						type: "button",
						onClick: () => setShowShareMenu(false),
						className: "text-white/60 hover:text-white",
						children: /* @__PURE__ */ jsx(X, { className: "h-4 w-4" })
					})]
				}), /* @__PURE__ */ jsxs("div", {
					className: "grid grid-cols-4 gap-3 py-4 text-center",
					children: [
						/* @__PURE__ */ jsxs("a", {
							href: `https://api.whatsapp.com/send?text=${shareText}`,
							target: "_blank",
							rel: "noreferrer",
							className: "flex flex-col items-center gap-2 hover:opacity-80 transition hover:scale-110",
							children: [/* @__PURE__ */ jsx("div", {
								className: "flex items-center justify-center text-[#25D366]",
								children: /* @__PURE__ */ jsx(FaWhatsapp, { className: "h-8 w-8" })
							}), /* @__PURE__ */ jsx("span", {
								className: "text-[11px] text-white/80 font-medium",
								children: "WhatsApp"
							})]
						}),
						/* @__PURE__ */ jsxs("a", {
							href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`,
							target: "_blank",
							rel: "noreferrer",
							className: "flex flex-col items-center gap-2 hover:opacity-80 transition hover:scale-110",
							children: [/* @__PURE__ */ jsx("div", {
								className: "flex items-center justify-center text-[#1877F2]",
								children: /* @__PURE__ */ jsx(FaFacebookF, { className: "h-8 w-8" })
							}), /* @__PURE__ */ jsx("span", {
								className: "text-[11px] text-white/80 font-medium",
								children: "Facebook"
							})]
						}),
						/* @__PURE__ */ jsxs("a", {
							href: `https://twitter.com/intent/tweet?text=${shareText}`,
							target: "_blank",
							rel: "noreferrer",
							className: "flex flex-col items-center gap-2 hover:opacity-80 transition hover:scale-110",
							children: [/* @__PURE__ */ jsx("div", {
								className: "flex items-center justify-center text-white",
								children: /* @__PURE__ */ jsx(FaTwitter, { className: "h-8 w-8" })
							}), /* @__PURE__ */ jsx("span", {
								className: "text-[11px] text-white/80 font-medium",
								children: "Twitter"
							})]
						}),
						/* @__PURE__ */ jsxs("button", {
							type: "button",
							onClick: handleCopyLink,
							className: "flex flex-col items-center gap-2 hover:opacity-80 transition hover:scale-110",
							children: [/* @__PURE__ */ jsx("div", {
								className: "flex items-center justify-center text-white/80",
								children: copied ? /* @__PURE__ */ jsx(Check, { className: "h-8 w-8 text-green-400" }) : /* @__PURE__ */ jsx(Copy, { className: "h-8 w-8" })
							}), /* @__PURE__ */ jsx("span", {
								className: "text-[11px] text-white/80 font-medium",
								children: copied ? "Copied" : "Copy"
							})]
						})
					]
				})]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "z-30 max-w-sm mx-auto w-full pb-3 text-center",
				children: [/* @__PURE__ */ jsx("p", {
					className: "text-sm font-bold text-white leading-tight line-clamp-1",
					children: currentItem.title
				}), /* @__PURE__ */ jsxs("p", {
					className: "text-[11px] text-white/75 mt-1 flex items-center justify-center gap-1.5 font-medium",
					children: [
						/* @__PURE__ */ jsx(Eye, { className: "h-3.5 w-3.5 text-white/90" }),
						/* @__PURE__ */ jsxs("span", { children: [formatViews(viewsFor(currentItem.title)), " views"] }),
						/* @__PURE__ */ jsx("span", { children: "•" }),
						/* @__PURE__ */ jsx("span", { children: "Swipe left/right for next" })
					]
				})]
			})
		]
	});
}
function Columnists() {
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
				children: [/* @__PURE__ */ jsx("h3", {
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
					if (item.isAd && item.ad) {
						const ad = item.ad;
						const adImg = ad.imagePortrait || ad.imageLandscape || ad.image;
						const adHref = ad.href || "#";
						const isGenericLabel = !ad.label || /^(sponsored|sponsor|ad|ads|advertisement|sponsored ad)$/i.test(ad.label.trim());
						return /* @__PURE__ */ jsxs("div", {
							className: "group block shrink-0 snap-start w-[23%] sm:w-[45%] md:w-[31%] lg:w-[calc(20%-0.8rem)]",
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
										decoding: "async",
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
								className: "mt-1.5 flex items-center gap-1 text-[10px] md:text-[11px] font-semibold text-amber-600 dark:text-amber-500 truncate",
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
						className: "group block shrink-0 snap-start cursor-pointer w-[23%] sm:w-[45%] md:w-[31%] lg:w-[calc(20%-0.8rem)]",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "relative aspect-[9/16] overflow-hidden rounded-xl bg-black border border-border/40 shadow-sm transition duration-500 hover:scale-[1.02]",
							children: [
								/* @__PURE__ */ jsx("img", {
									src: v.img,
									alt: v.title,
									loading: "lazy",
									decoding: "async",
									width: 270,
									height: 480,
									className: "h-full w-full object-cover transition duration-500 group-hover:scale-105"
								}),
								/* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" }),
								v.kicker && /* @__PURE__ */ jsx("span", {
									className: "absolute left-2.5 top-2.5 bg-[#1d4ed8] px-2 py-0.5 text-[10px] font-bold text-white rounded",
									children: v.kicker
								}),
								/* @__PURE__ */ jsx("h4", {
									className: "absolute bottom-11 left-2.5 right-2.5 text-xs font-bold leading-tight text-white drop-shadow line-clamp-2",
									children: v.title
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "absolute bottom-2.5 left-2.5 flex items-center gap-1.5",
									children: [/* @__PURE__ */ jsx("span", {
										className: "flex h-7 w-7 items-center justify-center rounded-full bg-white/95 text-black shadow transition-transform group-hover:scale-110",
										children: /* @__PURE__ */ jsx(Play, { className: "h-3 w-3 fill-current ml-0.5" })
									}), /* @__PURE__ */ jsx("span", {
										className: "text-xs font-semibold text-white drop-shadow",
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
			activeReelIndex !== null && /* @__PURE__ */ jsx(ReelViewerModal, {
				initialIndex: activeReelIndex,
				items: watchItems,
				onClose: () => setActiveReelIndex(null)
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
