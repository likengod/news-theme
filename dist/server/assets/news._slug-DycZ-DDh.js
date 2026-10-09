import { o as loadSettings } from "./site-settings-WLS1uD14.js";
import { d as loadAdRotation, f as loadAdSlotMode, m as loadAds, o as defaultAdSlidesPostAds, p as loadAdSlotScript } from "./ads-storage-BoxdJSPN.js";
import { a as useSiteSettings, n as useAdSettings } from "./AdSettingsContext-C_hBlZvh.js";
import { o as slugify } from "./news-data-CiXcY3JG.js";
import { t as ScriptAdRenderer } from "./ScriptAdRenderer-CHXwBV65.js";
import { t as Views } from "./Views-BCTnPRdw.js";
import { i as getCurrentUserRole, t as authClient } from "./auth-client-D7E7oLEb.js";
import { a as trackRead, o as trackShare } from "./user-actions-tracker-DJQ5cFC2.js";
import { t as useTranslation } from "./i18n-BIRFVgA2.js";
import { t as Footer } from "./Footer-rGROpblV.js";
import { t as ArchiveFinder } from "./ArchiveFinder-DT67wdNi.js";
import { t as Header } from "./Header-ORqjRwDM.js";
import { n as articleQueryOptions, t as Route } from "./news._slug-D-BvcqUV.js";
import { t as ArticleNotFound } from "./news._slug-m4S1x25M.js";
import { Suspense, lazy, memo, useCallback, useEffect, useId, useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { AlertCircle, Calculator, CalendarDays, Check, Clapperboard, Clock, Copy, ExternalLink, Gift, GraduationCap, Image, Link2, Lock, LogIn, MessageSquareQuote, Newspaper, Share2, ShieldCheck, Sparkles, Tv, Video, X } from "lucide-react";
import { toast } from "sonner";
import { FaFacebookF, FaLinkedinIn, FaTwitter, FaWhatsapp } from "react-icons/fa6";
import { FaTelegramPlane } from "react-icons/fa";
import { useSuspenseQuery } from "@tanstack/react-query";
import DOMPurify from "isomorphic-dompurify";
//#region src/components/article/ReadingProgress.tsx
function ReadingProgress() {
	const [progress, setProgress] = useState(0);
	useEffect(() => {
		const onScroll = () => {
			const h = document.documentElement;
			const scrolled = h.scrollTop;
			const max = h.scrollHeight - h.clientHeight;
			setProgress(max > 0 ? Math.min(100, scrolled / max * 100) : 0);
		};
		onScroll();
		window.addEventListener("scroll", onScroll, { passive: true });
		return () => window.removeEventListener("scroll", onScroll);
	}, []);
	return /* @__PURE__ */ jsx("div", {
		"aria-hidden": true,
		className: "fixed left-0 top-0 z-50 h-0.5 w-full bg-transparent",
		children: /* @__PURE__ */ jsx("div", {
			className: "h-full bg-primary transition-[width] duration-75 ease-out",
			style: { width: `${progress}%` }
		})
	});
}
//#endregion
//#region src/components/article/ArticleHeader.tsx
var FESTIVE_GRADIENT_MAP$1 = {
	"indian-flag": "linear-gradient(to right, #FF9933, #000080, #138808)",
	diwali: "linear-gradient(to right, #FF8008, #FFC837, #FF007F, #7F00FF)",
	sunset: "linear-gradient(to right, #F5576C, #F093FB)",
	neon: "linear-gradient(to right, #FF007F, #7F00FF, #00F0FF)",
	ocean: "linear-gradient(to right, #00c6ff, #0072ff)",
	forest: "linear-gradient(to right, #11998e, #38ef7d)"
};
function ArticleHeader({ title, author, date, views, category = "News", deck, shareUrl }) {
	const [settings, setSettings] = useState(() => loadSettings());
	const [showCustomText, setShowCustomText] = useState(false);
	const [copied, setCopied] = useState(false);
	useEffect(() => {
		const handleUpdate = () => setSettings(loadSettings());
		window.addEventListener("nt:settings-updated", handleUpdate);
		return () => window.removeEventListener("nt:settings-updated", handleUpdate);
	}, []);
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
	const handleShare = async () => {
		const url = shareUrl || (typeof window !== "undefined" ? window.location.href : "");
		if (typeof navigator !== "undefined" && navigator.share) try {
			await navigator.share({
				title,
				text: deck || title,
				url
			});
			return;
		} catch (err) {
			if (err?.name !== "AbortError") console.warn("Share failed, falling back to copy:", err);
			else return;
		}
		if (typeof navigator !== "undefined" && navigator.clipboard) try {
			await navigator.clipboard.writeText(url);
			setCopied(true);
			toast.success("Link copied to clipboard!");
			setTimeout(() => setCopied(false), 2e3);
		} catch {
			toast.error("Failed to copy link");
		}
	};
	const activeGradient = settings.festiveCategoryTitleGradient || settings.topBarTextGradient;
	const resolvedGrad = activeGradient && (FESTIVE_GRADIENT_MAP$1[activeGradient] || (activeGradient.includes("gradient(") ? activeGradient : null));
	const badgeStyle = resolvedGrad ? {
		backgroundImage: resolvedGrad,
		WebkitBackgroundClip: "text",
		WebkitTextFillColor: "transparent",
		backgroundClip: "text",
		display: "inline-block"
	} : { color: settings.festiveCategoryTitleColor || settings.topBarTextColor || "#dc2626" };
	const categoriesList = (category || "News").split(",").map((c) => c.trim()).filter(Boolean);
	if (categoriesList.length === 0) categoriesList.push("News");
	return /* @__PURE__ */ jsxs("header", {
		className: "mb-4 w-full",
		children: [
			/* @__PURE__ */ jsxs("nav", {
				className: "mb-2.5 flex flex-wrap items-center text-xs tracking-wide text-muted-foreground",
				children: [
					/* @__PURE__ */ jsx(Link, {
						to: "/",
						className: "hover:text-foreground transition-colors font-medium",
						children: "Home"
					}),
					categoriesList.map((cat) => /* @__PURE__ */ jsxs("span", {
						className: "inline-flex items-center",
						children: [/* @__PURE__ */ jsx("span", {
							className: "mx-2 text-muted-foreground/40 font-light",
							children: "/"
						}), /* @__PURE__ */ jsx(Link, {
							to: "/$slug",
							params: { slug: slugify(cat) },
							className: "hover:text-red-600 dark:hover:text-red-400 transition-colors font-semibold",
							style: badgeStyle,
							children: cat
						})]
					}, cat)),
					hasCustomAlert && showCustomText && /* @__PURE__ */ jsx("span", {
						className: "ml-3 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider animate-in fade-in duration-300",
						children: settings.festiveAlertImage ? /* @__PURE__ */ jsx("img", {
							src: settings.festiveAlertImage,
							alt: "Alert",
							className: "h-4 w-auto max-w-[70px] object-contain shrink-0 align-middle"
						}) : /* @__PURE__ */ jsx("span", {
							style: badgeStyle,
							children: settings.topBarWeatherCustomText
						})
					})
				]
			}),
			/* @__PURE__ */ jsx("h1", {
				className: "text-2xl sm:text-3xl md:text-[34px] lg:text-[38px] font-bold text-slate-950 dark:text-white leading-[1.3] tracking-tight mb-3",
				children: title
			}),
			deck && /* @__PURE__ */ jsx("p", {
				className: "text-base sm:text-lg text-slate-700 dark:text-slate-300 leading-relaxed font-normal mb-3",
				children: deck
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "border-y border-slate-200 dark:border-slate-800/80 py-2.5 my-3 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600 dark:text-slate-400",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "flex flex-wrap items-center gap-x-2 gap-y-1",
					children: [
						/* @__PURE__ */ jsxs("span", { children: [
							"Written By :",
							" ",
							/* @__PURE__ */ jsx("span", {
								className: "font-semibold text-red-600 dark:text-red-500",
								children: author || "Newsroom"
							})
						] }),
						/* @__PURE__ */ jsx("span", {
							className: "text-slate-300 dark:text-slate-700 font-light",
							children: "|"
						}),
						/* @__PURE__ */ jsxs("span", { children: ["Updated at : ", /* @__PURE__ */ jsx("time", {
							className: "text-slate-700 dark:text-slate-300 font-medium",
							children: date
						})] }),
						views > 0 && /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx("span", {
							className: "text-slate-300 dark:text-slate-700 font-light",
							children: "|"
						}), /* @__PURE__ */ jsx(Views, { count: views })] })
					]
				}), /* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ jsx("button", {
						type: "button",
						onClick: handleShare,
						"aria-label": "Share article",
						title: "Share article",
						className: "flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors",
						children: copied ? /* @__PURE__ */ jsx(Check, { className: "h-4 w-4 text-green-600" }) : /* @__PURE__ */ jsx(Share2, { className: "h-4 w-4" })
					}), settings.googleNews && settings.googleNews !== "#" && /* @__PURE__ */ jsxs("a", {
						href: settings.googleNews || "https://news.google.com/",
						target: "_blank",
						rel: "noopener noreferrer",
						title: "Follow on Google News",
						className: "flex shrink-0 items-center gap-1.5 transition hover:opacity-85 rounded-full border border-slate-200 dark:border-slate-800 px-2.5 py-1 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/50",
						children: [/* @__PURE__ */ jsx("img", {
							src: "https://upload.wikimedia.org/wikipedia/commons/d/da/Google_News_icon.svg",
							alt: "Google News",
							className: "h-4 w-4"
						}), /* @__PURE__ */ jsx("span", {
							className: "text-[11px] font-medium leading-none",
							children: "Google News"
						})]
					})]
				})]
			})
		]
	});
}
//#endregion
//#region src/components/article/PostFeaturedImageAd.tsx
function PostFeaturedImageAd() {
	const ctx = useAdSettings();
	const [dismissed, setDismissed] = useState(false);
	const [currentIndex, setCurrentIndex] = useState(0);
	const slotMode = ctx?.adConfig?.modes?.post_ads ?? (typeof window !== "undefined" ? loadAdSlotMode("post_ads") : "image");
	const slotScript = ctx?.adConfig?.scripts?.post_ads ?? (typeof window !== "undefined" ? loadAdSlotScript("post_ads") : "");
	const configSlides = ctx?.adConfig?.slots?.post_ads;
	const [slides, setSlides] = useState((configSlides && configSlides.length > 0 ? configSlides : typeof window !== "undefined" ? loadAds("post_ads") : defaultAdSlidesPostAds) || defaultAdSlidesPostAds);
	useEffect(() => {
		const handleUpdate = () => {
			const fresh = loadAds("post_ads");
			if (fresh && fresh.length > 0) setSlides(fresh);
		};
		window.addEventListener("nt:ads-updated", handleUpdate);
		return () => window.removeEventListener("nt:ads-updated", handleUpdate);
	}, []);
	const sortedAds = [...slides.filter((ad) => !!(ad.image || ad.imagePortrait || ad.imageLandscape))].sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
	const rotationSec = ctx?.adConfig?.rotations?.post_ads ?? (typeof window !== "undefined" ? loadAdRotation("post_ads") : 5);
	useEffect(() => {
		if (sortedAds.length <= 1) return;
		const interval = setInterval(() => {
			setCurrentIndex((prev) => (prev + 1) % sortedAds.length);
		}, Math.max(2, rotationSec) * 1e3);
		return () => clearInterval(interval);
	}, [sortedAds.length, rotationSec]);
	if (dismissed) return null;
	if (slotMode === "script") {
		if (!slotScript || !slotScript.trim()) return null;
		return /* @__PURE__ */ jsx("div", {
			className: "absolute bottom-2 inset-x-2 sm:bottom-3 sm:inset-x-4 z-20 flex items-center justify-center pointer-events-auto",
			children: /* @__PURE__ */ jsxs("div", {
				className: "relative inline-flex max-w-full items-center justify-center overflow-hidden",
				children: [/* @__PURE__ */ jsx("button", {
					type: "button",
					onClick: (e) => {
						e.preventDefault();
						e.stopPropagation();
						setDismissed(true);
					},
					title: "Close ad",
					"aria-label": "Close ad",
					className: "absolute top-1 right-1 z-30 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 hover:bg-black/80 text-white backdrop-blur-xs transition",
					children: /* @__PURE__ */ jsx(X, { className: "h-3 w-3" })
				}), /* @__PURE__ */ jsx("div", {
					className: "w-full flex items-center justify-center overflow-hidden min-h-[50px] sm:min-h-[90px]",
					children: /* @__PURE__ */ jsx(ScriptAdRenderer, { code: slotScript })
				})]
			})
		});
	}
	if (sortedAds.length === 0) return null;
	const currentAd = sortedAds[currentIndex % sortedAds.length];
	const altText = currentAd.label || currentAd.headline || "Advertisement";
	const mobileImage = currentAd.imagePortrait || currentAd.image;
	const desktopImage = currentAd.imageLandscape || currentAd.image;
	if (!mobileImage && !desktopImage) return null;
	return /* @__PURE__ */ jsx("div", {
		className: "absolute bottom-2 inset-x-2 sm:bottom-3 sm:inset-x-4 z-20 flex items-center justify-center pointer-events-auto",
		children: /* @__PURE__ */ jsxs("div", {
			className: "relative inline-flex max-w-full items-center justify-center overflow-hidden",
			children: [/* @__PURE__ */ jsx("button", {
				type: "button",
				onClick: (e) => {
					e.preventDefault();
					e.stopPropagation();
					setDismissed(true);
				},
				title: "Close ad",
				"aria-label": "Close ad",
				className: "absolute top-1 right-1 z-30 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 hover:bg-black/80 text-white backdrop-blur-xs transition",
				children: /* @__PURE__ */ jsx(X, { className: "h-3 w-3" })
			}), /* @__PURE__ */ jsxs("a", {
				href: currentAd.href || "#",
				target: currentAd.href && currentAd.href !== "#" ? "_blank" : void 0,
				rel: "noopener sponsored",
				className: "block max-w-full transition hover:opacity-95",
				children: [mobileImage && /* @__PURE__ */ jsx("img", {
					src: mobileImage,
					alt: altText,
					className: "block sm:hidden w-auto max-w-full h-auto max-h-[60px] object-contain mx-auto",
					loading: "eager"
				}), desktopImage && /* @__PURE__ */ jsx("img", {
					src: desktopImage,
					alt: altText,
					className: "hidden sm:block w-auto max-w-full h-auto max-h-[90px] object-contain mx-auto",
					loading: "eager"
				})]
			})]
		})
	});
}
//#endregion
//#region src/components/article/ArticleHero.tsx
function ArticleHero({ src, alt, caption, credit }) {
	return /* @__PURE__ */ jsxs("figure", {
		className: "mb-8",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "relative overflow-hidden group rounded-xl border border-border/60 bg-black/5 dark:bg-black/40 flex items-center justify-center",
			children: [/* @__PURE__ */ jsx("img", {
				src,
				alt,
				width: 1200,
				height: 675,
				loading: "eager",
				fetchPriority: "high",
				decoding: "async",
				className: "w-full h-auto max-h-[550px] object-contain object-center transition-transform duration-300 group-hover:scale-[1.01]"
			}), /* @__PURE__ */ jsx(PostFeaturedImageAd, {})]
		}), (caption || credit) && /* @__PURE__ */ jsxs("figcaption", {
			className: "mt-3 border-b border-border pb-3 text-xs leading-relaxed text-muted-foreground",
			children: [
				caption && /* @__PURE__ */ jsx("span", {
					className: "italic",
					children: caption
				}),
				caption && credit && /* @__PURE__ */ jsx("span", {
					className: "mx-2 text-border",
					children: "|"
				}),
				credit && /* @__PURE__ */ jsx("span", {
					className: "font-medium uppercase tracking-wider",
					children: credit
				})
			]
		})]
	});
}
//#endregion
//#region src/components/article/ArticleBody.tsx
if (typeof DOMPurify?.addHook === "function") DOMPurify.addHook("afterSanitizeAttributes", (node) => {
	if (node.tagName === "IFRAME") {
		node.setAttribute("sandbox", "allow-scripts allow-same-origin allow-presentation allow-popups");
		node.setAttribute("loading", "lazy");
		node.setAttribute("referrerpolicy", "strict-origin-when-cross-origin");
	}
	if (node.tagName === "A") {
		const href = node.getAttribute("href") || "";
		if (href.startsWith("http://") || href.startsWith("https://")) {
			node.setAttribute("rel", "noopener noreferrer");
			node.setAttribute("target", "_blank");
		}
	}
});
var purifyConfig = {
	ADD_TAGS: ["iframe"],
	ADD_ATTR: [
		"style",
		"class",
		"target",
		"rel",
		"loading",
		"allowfullscreen",
		"sandbox",
		"referrerpolicy",
		"frameborder"
	]
};
var ArticleBody = memo(function ArticleBody({ paragraphs, midImage }) {
	const hasHtml = paragraphs.some((p) => p.includes("<"));
	if (hasHtml || paragraphs.length === 1) {
		let fullContent = paragraphs.join("\n");
		if (!hasHtml) fullContent = fullContent.replace(/\n/g, "<br/>");
		return /* @__PURE__ */ jsx("div", {
			className: "prose-article space-y-4 md:space-y-5 text-base md:text-lg leading-relaxed md:leading-[1.85] text-foreground/90 whitespace-pre-wrap",
			dangerouslySetInnerHTML: { __html: DOMPurify.sanitize(fullContent, purifyConfig) }
		});
	}
	const first = paragraphs[0];
	const beforeMid = paragraphs.slice(1, 4);
	const afterMid = paragraphs.slice(4);
	return /* @__PURE__ */ jsxs("div", {
		className: "prose-article space-y-4 md:space-y-5 text-base md:text-lg leading-relaxed md:leading-[1.85] text-foreground/90",
		children: [
			first && /* @__PURE__ */ jsx("p", { dangerouslySetInnerHTML: { __html: DOMPurify.sanitize(first, purifyConfig) } }),
			beforeMid.map((p, i) => /* @__PURE__ */ jsx("p", { dangerouslySetInnerHTML: { __html: DOMPurify.sanitize(p, purifyConfig) } }, `b-${i}`)),
			midImage && /* @__PURE__ */ jsxs("figure", {
				className: "my-8",
				children: [/* @__PURE__ */ jsx("img", {
					src: midImage.src,
					alt: "",
					loading: "lazy",
					decoding: "async",
					className: "aspect-[16/9] w-full object-cover rounded-lg"
				}), (midImage.caption || midImage.credit) && /* @__PURE__ */ jsxs("figcaption", {
					className: "mt-3 border-b border-border pb-3 text-xs leading-relaxed text-muted-foreground",
					children: [
						midImage.caption && /* @__PURE__ */ jsx("span", {
							className: "italic",
							children: midImage.caption
						}),
						midImage.caption && midImage.credit && /* @__PURE__ */ jsx("span", {
							className: "mx-2 text-border",
							children: "|"
						}),
						midImage.credit && /* @__PURE__ */ jsx("span", {
							className: "font-medium uppercase tracking-wider",
							children: midImage.credit
						})
					]
				})]
			}),
			afterMid.map((p, i) => /* @__PURE__ */ jsx("p", { dangerouslySetInnerHTML: { __html: DOMPurify.sanitize(p, purifyConfig) } }, `a-${i}`))
		]
	});
});
//#endregion
//#region src/components/article/ArticleFooter.tsx
var RelatedNews = lazy(() => import("./RelatedNews-De0r6Qa1.js").then((m) => ({ default: m.RelatedNews })));
var CommentsSection = lazy(() => import("./CommentsSection-wF_dAHwa.js").then((m) => ({ default: m.CommentsSection })));
function ArticleFooter({ slug, author, tags, articleTitle = "Untitled Article", category }) {
	return /* @__PURE__ */ jsxs("footer", {
		className: "mt-2",
		children: [
			Array.isArray(tags) && tags.length > 0 && /* @__PURE__ */ jsxs("div", {
				className: "flex flex-wrap items-center gap-2 border-t border-border pt-3",
				children: [/* @__PURE__ */ jsx("span", {
					className: "mr-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground",
					children: "Tags:"
				}), tags.map((t) => /* @__PURE__ */ jsx(Link, {
					to: "/search",
					search: { q: t },
					className: "rounded-full border border-border px-3 py-1 text-xs uppercase tracking-widest text-muted-foreground transition hover:bg-muted hover:text-foreground hover:border-foreground/30",
					children: t
				}, t))]
			}),
			/* @__PURE__ */ jsx(Suspense, {
				fallback: /* @__PURE__ */ jsx("div", { className: "mt-8 h-24 animate-pulse rounded bg-muted" }),
				children: /* @__PURE__ */ jsx(RelatedNews, {
					currentSlug: slug,
					category
				})
			}),
			/* @__PURE__ */ jsx(Suspense, {
				fallback: /* @__PURE__ */ jsx("div", { className: "mt-8 h-32 animate-pulse rounded bg-muted" }),
				children: /* @__PURE__ */ jsx(CommentsSection, {
					articleSlug: slug,
					articleTitle
				})
			})
		]
	});
}
//#endregion
//#region src/components/article/ArticleSocialChannels.tsx
function ArticleSocialChannels() {
	const settings = useSiteSettings();
	const items = settings?.articleRightSidebarItems || {};
	const siteName = settings?.siteName || "Today Tripura";
	const showWhatsapp = items.whatsappChannel !== false;
	const showTelegram = items.telegramChannel !== false;
	if (!showWhatsapp && !showTelegram) return null;
	const whatsappLabel = items.whatsappButtonText?.trim() || `Join our WhatsApp Channel [${siteName}]`;
	const telegramLabel = items.telegramButtonText?.trim() || `Join our Telegram Channel [${siteName}]`;
	const whatsappUrl = items.whatsappChannelUrl?.trim() || settings?.whatsapp?.trim() || "https://whatsapp.com";
	const telegramUrl = items.telegramChannelUrl?.trim() || settings?.telegram?.trim() || "https://t.me";
	return /* @__PURE__ */ jsxs("div", {
		className: "space-y-2.5 pt-2",
		children: [showWhatsapp && /* @__PURE__ */ jsxs("a", {
			href: whatsappUrl,
			target: "_blank",
			rel: "noopener noreferrer",
			className: "group relative flex items-center justify-between gap-3 overflow-hidden rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 px-4 py-3 text-white shadow-xs transition-all duration-200 hover:from-emerald-500 hover:to-green-500 hover:shadow-md active:scale-[0.98]",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "flex items-center gap-3 min-w-0",
				children: [/* @__PURE__ */ jsx("div", {
					className: "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/20 backdrop-blur-xs text-white shadow-inner",
					children: /* @__PURE__ */ jsx(FaWhatsapp, { className: "h-5 w-5 fill-current" })
				}), /* @__PURE__ */ jsxs("div", {
					className: "min-w-0 text-left",
					children: [/* @__PURE__ */ jsx("span", {
						className: "block text-[10px] font-medium uppercase tracking-wider text-emerald-100",
						children: "Official Updates"
					}), /* @__PURE__ */ jsx("span", {
						className: "block text-xs sm:text-sm font-bold leading-tight truncate",
						children: whatsappLabel
					})]
				})]
			}), /* @__PURE__ */ jsx(ExternalLink, { className: "h-4 w-4 shrink-0 text-emerald-200 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" })]
		}), showTelegram && /* @__PURE__ */ jsxs("a", {
			href: telegramUrl,
			target: "_blank",
			rel: "noopener noreferrer",
			className: "group relative flex items-center justify-between gap-3 overflow-hidden rounded-xl bg-gradient-to-r from-sky-600 to-blue-600 px-4 py-3 text-white shadow-xs transition-all duration-200 hover:from-sky-500 hover:to-blue-500 hover:shadow-md active:scale-[0.98]",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "flex items-center gap-3 min-w-0",
				children: [/* @__PURE__ */ jsx("div", {
					className: "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/20 backdrop-blur-xs text-white shadow-inner",
					children: /* @__PURE__ */ jsx(FaTelegramPlane, { className: "h-5 w-5 fill-current ml-0.5" })
				}), /* @__PURE__ */ jsxs("div", {
					className: "min-w-0 text-left",
					children: [/* @__PURE__ */ jsx("span", {
						className: "block text-[10px] font-medium uppercase tracking-wider text-sky-100",
						children: "Instant Alerts"
					}), /* @__PURE__ */ jsx("span", {
						className: "block text-xs sm:text-sm font-bold leading-tight truncate",
						children: telegramLabel
					})]
				})]
			}), /* @__PURE__ */ jsx(ExternalLink, { className: "h-4 w-4 shrink-0 text-sky-200 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" })]
		})]
	});
}
//#endregion
//#region src/components/article/ArticleSidebar.tsx
var Advertisement = lazy(() => import("./Advertisement-8McKglwg.js").then((n) => n.n));
function getArticleSnippet(item) {
	if (!item) return "";
	let raw = "";
	if (item.content && item.content.replace(/<[^>]+>/g, "").trim().length > 20) raw = item.content;
	else if (item.excerpt) raw = item.excerpt;
	else raw = item.content || "";
	return raw.replace(/<!--[\s\S]*?-->/g, " ").replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "").replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "").replace(/<[^>]+>/g, " ").replace(/&nbsp;/gi, " ").replace(/&#8203;/gi, "").replace(/&amp;/gi, "&").replace(/&quot;/gi, "\"").replace(/&#39;/gi, "'").replace(/\s+/g, " ").trim();
}
function ArticleSidebar({ trending = [], currentSlug }) {
	const items = useSiteSettings()?.articleRightSidebarItems || {};
	const showAd3 = items.ad3 !== false;
	const showTrending = items.trendingNews !== false;
	const showArchive = items.archiveFinder !== false;
	const activeItems = (trending || []).filter((item) => item && item.slug && item.slug !== currentSlug).slice(0, 6);
	if (!showAd3 && !showTrending && !showArchive) return null;
	return /* @__PURE__ */ jsxs("aside", {
		className: "space-y-6 w-full min-w-0",
		children: [
			showAd3 && /* @__PURE__ */ jsx(Suspense, {
				fallback: /* @__PURE__ */ jsx("div", { className: "aspect-[300/250] w-full animate-pulse bg-muted rounded" }),
				children: /* @__PURE__ */ jsx(Advertisement, {
					slot: "ad3",
					aspectRatio: "1/1"
				})
			}),
			showTrending && activeItems.length > 0 && /* @__PURE__ */ jsxs("div", {
				className: "w-full",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "mb-4 border-b-2 border-red-600 pb-1.5 flex items-center justify-between",
					children: [/* @__PURE__ */ jsxs("h3", {
						className: "text-base sm:text-lg font-bold text-slate-950 dark:text-white tracking-tight flex items-center gap-2",
						children: [/* @__PURE__ */ jsx("span", { className: "h-4 w-1 bg-red-600 rounded-sm inline-block" }), "সেরা শিরোনাম"]
					}), /* @__PURE__ */ jsx("span", {
						className: "text-[11px] font-semibold uppercase tracking-wider text-muted-foreground",
						children: "Trending"
					})]
				}), /* @__PURE__ */ jsx("div", {
					className: "space-y-3.5",
					children: activeItems.map((item) => {
						const rawImg = item.featuredImage || item.hero;
						const img = typeof rawImg === "string" && rawImg.trim() !== "" ? rawImg.trim() : null;
						const firstCat = (item.category || "খবর").split(",")[0].trim();
						const snippet = getArticleSnippet(item);
						return /* @__PURE__ */ jsxs("article", {
							className: "group flex flex-col gap-1 border-b border-slate-100 dark:border-slate-800/80 pb-3 last:border-b-0",
							children: [firstCat && /* @__PURE__ */ jsx("span", {
								className: "text-[11px] font-bold text-red-600 dark:text-red-500 uppercase tracking-wide",
								children: firstCat
							}), /* @__PURE__ */ jsxs("div", {
								className: "flex items-start gap-3",
								children: [img && /* @__PURE__ */ jsx(Link, {
									to: "/news/$slug",
									params: { slug: item.slug },
									className: "shrink-0 overflow-hidden rounded bg-muted block",
									children: /* @__PURE__ */ jsx("img", {
										src: img,
										alt: item.title,
										className: "h-16 w-24 object-cover transition-transform duration-300 group-hover:scale-105",
										loading: "lazy"
									})
								}), /* @__PURE__ */ jsx("div", {
									className: "min-w-0 flex-1",
									children: /* @__PURE__ */ jsxs(Link, {
										to: "/news/$slug",
										params: { slug: item.slug },
										className: "block",
										children: [/* @__PURE__ */ jsx("p", {
											className: "text-xs sm:text-sm font-semibold leading-snug text-slate-900 dark:text-slate-100 line-clamp-2 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors",
											children: item.title
										}), snippet && /* @__PURE__ */ jsx("p", {
											className: "mt-1 text-[12px] leading-relaxed text-muted-foreground line-clamp-2",
											children: snippet
										})]
									})
								})]
							})]
						}, item.slug);
					})
				})]
			}),
			showArchive && /* @__PURE__ */ jsx(ArchiveFinder, {}),
			/* @__PURE__ */ jsx(ArticleSocialChannels, {})
		]
	});
}
//#endregion
//#region src/components/article/EmiCalculatorModal.tsx
function EmiCalculatorModal({ isOpen, onClose }) {
	const loanId = useId();
	const rateId = useId();
	const tenureId = useId();
	const [loanAmount, setLoanAmount] = useState(25e5);
	const [interestRate, setInterestRate] = useState(8.5);
	const [tenureYears, setTenureYears] = useState(20);
	if (!isOpen) return null;
	const monthlyRate = interestRate / 12 / 100;
	const totalMonths = tenureYears * 12;
	const factor = Math.pow(1 + monthlyRate, totalMonths);
	const monthlyEmi = monthlyRate > 0 && factor > 1 ? Math.round(loanAmount * monthlyRate * factor / (factor - 1)) : 0;
	const totalPayment = monthlyEmi * totalMonths;
	const totalInterest = Math.max(0, totalPayment - loanAmount);
	const formatInr = (n) => new Intl.NumberFormat("en-IN", {
		style: "currency",
		currency: "INR",
		maximumFractionDigits: 0
	}).format(n);
	return /* @__PURE__ */ jsx("div", {
		role: "dialog",
		"aria-modal": "true",
		"aria-label": "Home Loan EMI Calculator",
		className: "fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200",
		children: /* @__PURE__ */ jsxs("div", {
			className: "relative w-full max-w-lg rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 text-slate-900 dark:text-white",
			children: [
				/* @__PURE__ */ jsxs("div", {
					className: "flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ jsx("div", {
							className: "flex h-9 w-9 items-center justify-center rounded-lg bg-red-100 text-red-600 dark:bg-red-950/40 dark:text-red-400",
							children: /* @__PURE__ */ jsx(Calculator, { className: "h-5 w-5" })
						}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h3", {
							className: "text-base font-bold",
							children: "EMI ক্যালকুলেটর"
						}), /* @__PURE__ */ jsx("p", {
							className: "text-xs text-slate-500 dark:text-slate-400",
							children: "Loan EMI Calculator"
						})] })]
					}), /* @__PURE__ */ jsx("button", {
						onClick: onClose,
						"aria-label": "Close",
						className: "rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-600 dark:hover:text-slate-200 transition",
						children: /* @__PURE__ */ jsx(X, { className: "h-5 w-5" })
					})]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "mt-5 space-y-4",
					children: [
						/* @__PURE__ */ jsxs("div", { children: [
							/* @__PURE__ */ jsxs("div", {
								className: "flex justify-between text-xs font-semibold mb-1",
								children: [/* @__PURE__ */ jsx("label", {
									htmlFor: loanId,
									children: "ঋণের পরিমাণ (Loan Amount):"
								}), /* @__PURE__ */ jsx("span", {
									className: "text-red-600 font-bold",
									children: formatInr(loanAmount)
								})]
							}),
							/* @__PURE__ */ jsx("input", {
								id: loanId,
								type: "range",
								min: 1e5,
								max: 1e7,
								step: 5e4,
								value: loanAmount,
								onChange: (e) => setLoanAmount(Number(e.target.value)),
								className: "w-full accent-red-600"
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "flex justify-between text-[11px] text-slate-400 mt-0.5",
								children: [/* @__PURE__ */ jsx("span", { children: "₹1 Lakh" }), /* @__PURE__ */ jsx("span", { children: "₹1 Crore" })]
							})
						] }),
						/* @__PURE__ */ jsxs("div", { children: [
							/* @__PURE__ */ jsxs("div", {
								className: "flex justify-between text-xs font-semibold mb-1",
								children: [/* @__PURE__ */ jsx("label", {
									htmlFor: rateId,
									children: "বার্ষিক সুদের হার (Interest Rate):"
								}), /* @__PURE__ */ jsxs("span", {
									className: "text-red-600 font-bold",
									children: [interestRate, "% p.a."]
								})]
							}),
							/* @__PURE__ */ jsx("input", {
								id: rateId,
								type: "range",
								min: 6,
								max: 15,
								step: .1,
								value: interestRate,
								onChange: (e) => setInterestRate(Number(e.target.value)),
								className: "w-full accent-red-600"
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "flex justify-between text-[11px] text-slate-400 mt-0.5",
								children: [/* @__PURE__ */ jsx("span", { children: "6%" }), /* @__PURE__ */ jsx("span", { children: "15%" })]
							})
						] }),
						/* @__PURE__ */ jsxs("div", { children: [
							/* @__PURE__ */ jsxs("div", {
								className: "flex justify-between text-xs font-semibold mb-1",
								children: [/* @__PURE__ */ jsx("label", {
									htmlFor: tenureId,
									children: "ঋণের মেয়াদ (Loan Tenure):"
								}), /* @__PURE__ */ jsxs("span", {
									className: "text-red-600 font-bold",
									children: [
										tenureYears,
										" Years (",
										totalMonths,
										" Months)"
									]
								})]
							}),
							/* @__PURE__ */ jsx("input", {
								id: tenureId,
								type: "range",
								min: 1,
								max: 30,
								step: 1,
								value: tenureYears,
								onChange: (e) => setTenureYears(Number(e.target.value)),
								className: "w-full accent-red-600"
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "flex justify-between text-[11px] text-slate-400 mt-0.5",
								children: [/* @__PURE__ */ jsx("span", { children: "1 Year" }), /* @__PURE__ */ jsx("span", { children: "30 Years" })]
							})
						] })
					]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "mt-6 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 p-4",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "text-center pb-3 border-b border-slate-200 dark:border-slate-700",
						children: [/* @__PURE__ */ jsx("span", {
							className: "text-xs uppercase font-bold text-slate-500 tracking-wider",
							children: "মাসিক কিস্তি (Monthly EMI)"
						}), /* @__PURE__ */ jsx("div", {
							className: "text-2xl font-black text-red-600 mt-0.5",
							children: formatInr(monthlyEmi)
						})]
					}), /* @__PURE__ */ jsxs("div", {
						className: "grid grid-cols-2 gap-4 pt-3 text-xs",
						children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("span", {
							className: "text-slate-500 dark:text-slate-400 block",
							children: "মোট সুদ (Total Interest)"
						}), /* @__PURE__ */ jsx("span", {
							className: "font-bold text-slate-800 dark:text-slate-200 text-sm",
							children: formatInr(totalInterest)
						})] }), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("span", {
							className: "text-slate-500 dark:text-slate-400 block",
							children: "মোট পরিশোধ (Total Payment)"
						}), /* @__PURE__ */ jsx("span", {
							className: "font-bold text-slate-800 dark:text-slate-200 text-sm",
							children: formatInr(totalPayment)
						})] })]
					})]
				}),
				/* @__PURE__ */ jsx("div", {
					className: "mt-5 flex justify-end",
					children: /* @__PURE__ */ jsx("button", {
						onClick: onClose,
						className: "rounded-lg bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 px-4 py-2 text-xs font-semibold hover:opacity-90 transition",
						children: "বন্ধ করুন (Close)"
					})
				})
			]
		})
	});
}
//#endregion
//#region src/components/article/AgeCalculatorModal.tsx
function AgeCalculatorModal({ isOpen, onClose }) {
	const [dob, setDob] = useState("2000-01-01");
	if (!isOpen) return null;
	const calculateAge = () => {
		if (!dob) return null;
		const birth = new Date(dob);
		const now = /* @__PURE__ */ new Date();
		if (isNaN(birth.getTime()) || birth > now) return null;
		let years = now.getFullYear() - birth.getFullYear();
		let months = now.getMonth() - birth.getMonth();
		let days = now.getDate() - birth.getDate();
		if (days < 0) {
			months -= 1;
			const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
			days += prevMonth.getDate();
		}
		if (months < 0) {
			years -= 1;
			months += 12;
		}
		let nextBday = new Date(now.getFullYear(), birth.getMonth(), birth.getDate());
		if (nextBday < now) nextBday = new Date(now.getFullYear() + 1, birth.getMonth(), birth.getDate());
		const diffTime = nextBday.getTime() - now.getTime();
		const daysUntilNext = Math.ceil(diffTime / (1e3 * 60 * 60 * 24));
		const totalDays = Math.floor((now.getTime() - birth.getTime()) / (1e3 * 60 * 60 * 24));
		return {
			years,
			months,
			days,
			daysUntilNext,
			totalDays
		};
	};
	const ageData = calculateAge();
	return /* @__PURE__ */ jsx("div", {
		role: "dialog",
		"aria-modal": "true",
		"aria-label": "Age Calculator",
		className: "fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200",
		children: /* @__PURE__ */ jsxs("div", {
			className: "relative w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 text-slate-900 dark:text-white",
			children: [
				/* @__PURE__ */ jsxs("div", {
					className: "flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ jsx("div", {
							className: "flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400",
							children: /* @__PURE__ */ jsx(CalendarDays, { className: "h-5 w-5" })
						}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h3", {
							className: "text-base font-bold",
							children: "বয়স ক্যালকুলেটর"
						}), /* @__PURE__ */ jsx("p", {
							className: "text-xs text-slate-500 dark:text-slate-400",
							children: "Exact Age & Birthday Calculator"
						})] })]
					}), /* @__PURE__ */ jsx("button", {
						onClick: onClose,
						"aria-label": "Close",
						className: "rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-600 dark:hover:text-slate-200 transition",
						children: /* @__PURE__ */ jsx(X, { className: "h-5 w-5" })
					})]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "mt-5 space-y-2",
					children: [/* @__PURE__ */ jsx("label", {
						htmlFor: "user-dob-input",
						className: "block text-xs font-semibold text-slate-700 dark:text-slate-300",
						children: "জন্ম তারিখ নির্বাচন করুন (Select Date of Birth):"
					}), /* @__PURE__ */ jsx("input", {
						id: "user-dob-input",
						type: "date",
						value: dob,
						onChange: (e) => setDob(e.target.value),
						className: "w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-white focus:border-red-500 focus:outline-none"
					})]
				}),
				ageData ? /* @__PURE__ */ jsxs("div", {
					className: "mt-5 space-y-3",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/40 p-4 text-center",
						children: [/* @__PURE__ */ jsx("span", {
							className: "text-xs uppercase font-bold text-blue-700 dark:text-blue-400 tracking-wider",
							children: "আপনার বর্তমান বয়স (Your Current Age)"
						}), /* @__PURE__ */ jsxs("div", {
							className: "mt-2 flex items-baseline justify-center gap-2",
							children: [
								/* @__PURE__ */ jsx("span", {
									className: "text-3xl font-black text-slate-900 dark:text-white",
									children: ageData.years
								}),
								/* @__PURE__ */ jsx("span", {
									className: "text-xs text-slate-500 font-semibold mr-1",
									children: "বছর (Yrs)"
								}),
								/* @__PURE__ */ jsx("span", {
									className: "text-2xl font-bold text-slate-900 dark:text-white",
									children: ageData.months
								}),
								/* @__PURE__ */ jsx("span", {
									className: "text-xs text-slate-500 font-semibold mr-1",
									children: "মাস (Mos)"
								}),
								/* @__PURE__ */ jsx("span", {
									className: "text-2xl font-bold text-slate-900 dark:text-white",
									children: ageData.days
								}),
								/* @__PURE__ */ jsx("span", {
									className: "text-xs text-slate-500 font-semibold",
									children: "দিন (Days)"
								})
							]
						})]
					}), /* @__PURE__ */ jsxs("div", {
						className: "grid grid-cols-2 gap-3 text-xs",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-2 rounded-lg border border-slate-200 dark:border-slate-800 p-2.5",
							children: [/* @__PURE__ */ jsx(Gift, { className: "h-4 w-4 text-red-500 shrink-0" }), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("span", {
								className: "text-slate-400 block text-[10px]",
								children: "পরবর্তী জন্মদিন"
							}), /* @__PURE__ */ jsxs("span", {
								className: "font-bold text-slate-800 dark:text-slate-200",
								children: [ageData.daysUntilNext, " দিন পর"]
							})] })]
						}), /* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-2 rounded-lg border border-slate-200 dark:border-slate-800 p-2.5",
							children: [/* @__PURE__ */ jsx(Clock, { className: "h-4 w-4 text-indigo-500 shrink-0" }), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("span", {
								className: "text-slate-400 block text-[10px]",
								children: "মোট দিন অতিক্রান্ত"
							}), /* @__PURE__ */ jsxs("span", {
								className: "font-bold text-slate-800 dark:text-slate-200",
								children: [ageData.totalDays.toLocaleString(), " দিন"]
							})] })]
						})]
					})]
				}) : /* @__PURE__ */ jsx("p", {
					className: "mt-4 text-xs text-amber-600 text-center",
					children: "দয়া করে একটি সঠিক তারিখ নির্বাচন করুন।"
				}),
				/* @__PURE__ */ jsx("div", {
					className: "mt-5 flex justify-end",
					children: /* @__PURE__ */ jsx("button", {
						onClick: onClose,
						className: "rounded-lg bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 px-4 py-2 text-xs font-semibold hover:opacity-90 transition",
						children: "বন্ধ করুন (Close)"
					})
				})
			]
		})
	});
}
//#endregion
//#region src/components/article/ArticleLeftNav.tsx
function ArticleLeftNav() {
	const [showEmiModal, setShowEmiModal] = useState(false);
	const [showAgeModal, setShowAgeModal] = useState(false);
	const { t, i18n } = useTranslation();
	const items = useSiteSettings()?.articleLeftNavItems || {};
	const showLive = items.live !== false;
	const showReels = items.reels !== false;
	const showResults = items.results !== false;
	const showVideos = items.videos !== false;
	const showPhotos = items.photos !== false;
	const showFactCheck = items.factCheck !== false;
	const showOpinion = items.opinion !== false;
	const showArchive = items.archive !== false;
	const showEmi = items.emiCalculator !== false;
	const showAge = items.ageCalculator !== false;
	const hasAnyMainLinks = showLive || showReels || showResults || showVideos || showPhotos || showFactCheck || showOpinion || showArchive;
	const hasAnyUtilities = showEmi || showAge;
	if (!hasAnyMainLinks && !hasAnyUtilities) return null;
	return /* @__PURE__ */ jsxs(Fragment, { children: [
		/* @__PURE__ */ jsxs("aside", {
			"aria-label": "Side Navigation",
			className: "hidden xl:flex flex-col w-[140px] shrink-0 sticky top-14 self-start space-y-4 py-2 select-none border-r border-slate-200/80 dark:border-slate-800 pr-2",
			children: [hasAnyMainLinks && /* @__PURE__ */ jsxs("nav", {
				className: "flex flex-col space-y-0.5 text-[12px] font-medium text-slate-700 dark:text-slate-300",
				children: [
					showLive && /* @__PURE__ */ jsxs(Link, {
						to: "/",
						search: { category: "live" },
						className: "group flex items-center gap-2.5 rounded-lg px-2 py-1.5 transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30 dark:hover:text-red-400",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "relative flex h-5 w-5 shrink-0 items-center justify-center",
							children: [/* @__PURE__ */ jsx(Tv, { className: "h-4 w-4 text-slate-600 group-hover:text-red-600 dark:text-slate-400" }), /* @__PURE__ */ jsxs("span", {
								className: "absolute -top-0.5 -right-0.5 flex h-2 w-2",
								children: [/* @__PURE__ */ jsx("span", { className: "absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" }), /* @__PURE__ */ jsx("span", { className: "relative inline-flex h-2 w-2 rounded-full bg-red-600" })]
							})]
						}), /* @__PURE__ */ jsx("span", {
							className: "truncate",
							children: t("sideNav.live", "Live")
						})]
					}),
					showReels && /* @__PURE__ */ jsxs(Link, {
						to: "/reels",
						className: "group flex items-center gap-2.5 rounded-lg px-2 py-1.5 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-white",
						children: [/* @__PURE__ */ jsx(Clapperboard, { className: "h-4 w-4 shrink-0 text-slate-600 group-hover:text-red-600 dark:text-slate-400" }), /* @__PURE__ */ jsx("span", {
							className: "truncate font-semibold text-slate-900 dark:text-white",
							children: t("sideNav.reels", "Shorts / Reels")
						})]
					}),
					showResults && /* @__PURE__ */ jsxs(Link, {
						to: "/results",
						className: "group flex items-center gap-2.5 rounded-lg px-2 py-1.5 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-white",
						children: [/* @__PURE__ */ jsx(GraduationCap, { className: "h-4 w-4 shrink-0 text-slate-600 group-hover:text-red-600 dark:text-slate-400" }), /* @__PURE__ */ jsx("span", {
							className: "truncate",
							children: t("sideNav.results", "Results")
						})]
					}),
					showVideos && /* @__PURE__ */ jsxs(Link, {
						to: "/reels",
						className: "group flex items-center gap-2.5 rounded-lg px-2 py-1.5 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-white",
						children: [/* @__PURE__ */ jsx(Video, { className: "h-4 w-4 shrink-0 text-slate-600 group-hover:text-red-600 dark:text-slate-400" }), /* @__PURE__ */ jsx("span", {
							className: "truncate",
							children: t("sideNav.videos", "Videos")
						})]
					}),
					showPhotos && /* @__PURE__ */ jsxs(Link, {
						to: "/",
						search: { category: "photos" },
						className: "group flex items-center gap-2.5 rounded-lg px-2 py-1.5 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-white",
						children: [/* @__PURE__ */ jsx(Image, { className: "h-4 w-4 shrink-0 text-slate-600 group-hover:text-red-600 dark:text-slate-400" }), /* @__PURE__ */ jsx("span", {
							className: "truncate",
							children: t("sideNav.photos", "Photo Gallery")
						})]
					}),
					showFactCheck && /* @__PURE__ */ jsxs(Link, {
						to: "/fact-check",
						className: "group flex items-center gap-2.5 rounded-lg px-2 py-1.5 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-white",
						children: [/* @__PURE__ */ jsx(ShieldCheck, { className: "h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" }), /* @__PURE__ */ jsx("span", {
							className: "truncate",
							children: t("sideNav.factCheck", "Fact Check")
						})]
					}),
					showOpinion && /* @__PURE__ */ jsxs(Link, {
						to: "/",
						search: { category: "opinion" },
						className: "group flex items-center gap-2.5 rounded-lg px-2 py-1.5 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-white",
						children: [/* @__PURE__ */ jsx(MessageSquareQuote, { className: "h-4 w-4 shrink-0 text-slate-600 group-hover:text-red-600 dark:text-slate-400" }), /* @__PURE__ */ jsx("span", {
							className: "truncate",
							children: t("sideNav.opinion", "Opinion")
						})]
					}),
					showArchive && /* @__PURE__ */ jsxs(Link, {
						to: "/archive",
						className: "group flex items-center gap-2.5 rounded-lg px-2 py-1.5 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-white",
						children: [/* @__PURE__ */ jsx(Newspaper, { className: "h-4 w-4 shrink-0 text-slate-600 group-hover:text-red-600 dark:text-slate-400" }), /* @__PURE__ */ jsx("span", {
							className: "truncate",
							children: t("sideNav.archive", "Archive")
						})]
					})
				]
			}), hasAnyUtilities && /* @__PURE__ */ jsxs("div", {
				className: "border-t border-slate-200 dark:border-slate-800 pt-3",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "px-2 pb-1.5 text-[11px] font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1",
					children: [/* @__PURE__ */ jsx("span", { className: "h-1.5 w-1.5 rounded-full bg-red-600" }), /* @__PURE__ */ jsx("span", { children: t("sideNav.urgent", "Utilities") })]
				}), /* @__PURE__ */ jsxs("div", {
					className: "flex flex-col space-y-0.5 text-[11px] font-medium text-slate-600 dark:text-slate-400",
					children: [showEmi && /* @__PURE__ */ jsxs("button", {
						type: "button",
						onClick: () => setShowEmiModal(true),
						className: "group flex items-center gap-2.5 rounded-lg px-2 py-1.5 text-left transition-colors hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-white cursor-pointer",
						children: [/* @__PURE__ */ jsx(Calculator, { className: "h-3.5 w-3.5 shrink-0 text-slate-500 group-hover:text-red-600" }), /* @__PURE__ */ jsx("span", {
							className: "truncate",
							children: t("sideNav.emiCalculator", "EMI Calculator")
						})]
					}), showAge && /* @__PURE__ */ jsxs("button", {
						type: "button",
						onClick: () => setShowAgeModal(true),
						className: "group flex items-start gap-2 rounded-lg px-2 py-1.5 text-left transition-colors hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-white cursor-pointer",
						children: [/* @__PURE__ */ jsx(CalendarDays, { className: "h-3.5 w-3.5 mt-0.5 shrink-0 text-slate-500 group-hover:text-blue-600" }), /* @__PURE__ */ jsx("span", {
							className: "leading-tight",
							children: t("sideNav.ageCalculator", "Age Calculator")
						})]
					})]
				})]
			})]
		}),
		/* @__PURE__ */ jsx(EmiCalculatorModal, {
			isOpen: showEmiModal,
			onClose: () => setShowEmiModal(false)
		}),
		/* @__PURE__ */ jsx(AgeCalculatorModal, {
			isOpen: showAgeModal,
			onClose: () => setShowAgeModal(false)
		})
	] });
}
//#endregion
//#region src/components/article/ShareRail.tsx
function ShareRail({ url, title, orientation = "horizontal" }) {
	const enc = encodeURIComponent(url);
	const encT = encodeURIComponent(title);
	const [userId, setUserId] = useState(null);
	useEffect(() => {
		authClient.auth.getSession().then(({ data }) => {
			if (data.session?.user) setUserId(data.session.user.id);
		});
	}, []);
	const handleShareClick = useCallback(() => {
		if (userId) trackShare(userId, url);
	}, [userId, url]);
	const copy = useCallback(async () => {
		try {
			await navigator.clipboard.writeText(url);
			toast.success("Link copied");
			handleShareClick();
		} catch {
			toast.error("Could not copy link");
		}
	}, [url, handleShareClick]);
	const items = [
		{
			label: "Facebook",
			href: `https://www.facebook.com/sharer/sharer.php?u=${enc}`,
			Icon: FaFacebookF,
			color: "#1877F2"
		},
		{
			label: "Twitter",
			href: `https://twitter.com/intent/tweet?url=${enc}&text=${encT}`,
			Icon: FaTwitter,
			color: "#1DA1F2"
		},
		{
			label: "LinkedIn",
			href: `https://www.linkedin.com/sharing/share-offsite/?url=${enc}`,
			Icon: FaLinkedinIn,
			color: "#0A66C2"
		},
		{
			label: "WhatsApp",
			href: `https://api.whatsapp.com/send?text=${encT}%20${enc}`,
			Icon: FaWhatsapp,
			color: "#25D366"
		},
		{
			label: "Telegram",
			href: `https://t.me/share/url?url=${enc}&text=${encT}`,
			Icon: FaTelegramPlane,
			color: "#26A5E4"
		}
	];
	return /* @__PURE__ */ jsxs("div", {
		className: "flex items-center gap-1",
		children: [
			/* @__PURE__ */ jsx("span", {
				className: "mr-1 hidden text-[11px] font-bold uppercase tracking-wider text-muted-foreground sm:inline",
				children: "Share:"
			}),
			items.map(({ label, href, Icon, color }) => /* @__PURE__ */ jsx("a", {
				href,
				target: "_blank",
				rel: "noopener noreferrer",
				onClick: handleShareClick,
				"aria-label": `Share on ${label}`,
				className: "inline-flex h-7 w-7 items-center justify-center transition-transform hover:scale-110",
				style: { color },
				children: /* @__PURE__ */ jsx(Icon, { className: "h-4 w-4" })
			}, label)),
			/* @__PURE__ */ jsx("button", {
				onClick: copy,
				"aria-label": "Copy link",
				className: "inline-flex h-7 w-7 items-center justify-center text-muted-foreground transition-transform hover:scale-110 hover:text-foreground",
				children: /* @__PURE__ */ jsx(Link2, { className: "h-4 w-4" })
			})
		]
	});
}
//#endregion
//#region src/components/article/ArticleQrCard.tsx
var FESTIVE_GRADIENT_MAP = {
	"indian-flag": "linear-gradient(to right, #FF9933, #000080, #138808)",
	diwali: "linear-gradient(to right, #FF8008, #FFC837, #FF007F, #7F00FF)",
	sunset: "linear-gradient(to right, #F5576C, #F093FB)",
	neon: "linear-gradient(to right, #FF007F, #7F00FF, #00F0FF)",
	ocean: "linear-gradient(to right, #00c6ff, #0072ff)",
	forest: "linear-gradient(to right, #11998e, #38ef7d)"
};
function ArticleQrCard({ url }) {
	const [settings, setSettings] = useState(() => loadSettings());
	const [showCustomText, setShowCustomText] = useState(false);
	useEffect(() => {
		const handleUpdate = () => setSettings(loadSettings());
		window.addEventListener("nt:settings-updated", handleUpdate);
		return () => window.removeEventListener("nt:settings-updated", handleUpdate);
	}, []);
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
	const qrCodeUrl = useMemo(() => {
		return `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(url)}`;
	}, [url]);
	const activeGradient = settings.festiveScanMeTextGradient || settings.topBarTextGradient || settings.festiveCategoryTitleGradient;
	const activeColor = settings.festiveScanMeTextColor || settings.festiveCategoryTitleColor || settings.topBarTextColor || "#000000";
	const resolvedGrad = activeGradient && (FESTIVE_GRADIENT_MAP[activeGradient] || (activeGradient.includes("gradient(") ? activeGradient : null));
	const scanMeStyle = resolvedGrad ? {
		backgroundImage: resolvedGrad,
		WebkitBackgroundClip: "text",
		WebkitTextFillColor: "transparent",
		backgroundClip: "text",
		display: "inline-block"
	} : { color: activeColor };
	const subtextStyle = settings.festiveScanMeSubtextColor ? { color: settings.festiveScanMeSubtextColor } : void 0;
	const textToDisplay = hasCustomAlert && showCustomText && settings.topBarWeatherCustomText ? settings.topBarWeatherCustomText : settings.festiveScanMeCustomText || "SCAN ME";
	return /* @__PURE__ */ jsxs("div", {
		className: "inline-flex items-center gap-2.5",
		children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h4", {
			className: "text-xs font-extrabold uppercase leading-tight tracking-tight sm:text-sm animate-in fade-in duration-300 inline-flex items-center gap-1.5",
			children: hasCustomAlert && showCustomText && settings.festiveAlertImage ? /* @__PURE__ */ jsx("img", {
				src: settings.festiveAlertImage,
				alt: "Alert",
				className: "h-4 w-auto max-w-[80px] object-contain shrink-0 align-middle"
			}) : /* @__PURE__ */ jsx("span", {
				style: scanMeStyle,
				children: textToDisplay
			})
		}, showCustomText ? "custom" : "default"), !(hasCustomAlert && showCustomText) && /* @__PURE__ */ jsx("p", {
			className: "text-[10px] font-medium text-slate-500 dark:text-slate-400 animate-in fade-in duration-300",
			style: subtextStyle,
			children: settings.festiveScanMeSubtext || "to read article"
		})] }), /* @__PURE__ */ jsx("div", {
			className: "h-9 w-9 overflow-hidden rounded border border-slate-200 bg-white p-0.5 dark:border-slate-800",
			children: /* @__PURE__ */ jsx("img", {
				src: qrCodeUrl,
				alt: "Scan QR code to read article on mobile",
				className: "h-full w-full object-contain",
				loading: "lazy"
			})
		})]
	});
}
//#endregion
//#region src/components/article/ContentProtectionGuard.tsx
function ContentProtectionGuard() {
	const settings = useSiteSettings();
	const [isBlurred, setIsBlurred] = useState(false);
	const [showModal, setShowModal] = useState(false);
	const [copiedLink, setCopiedLink] = useState(false);
	useEffect(() => {
		if (!settings.protectionEnabled) return;
		const triggerSecurityNotice = () => {
			setShowModal(true);
		};
		const handleCopy = (e) => {
			e.preventDefault();
			triggerSecurityNotice();
		};
		const handleContextMenu = (e) => {
			const target = e.target;
			if (target.tagName !== "INPUT" && target.tagName !== "TEXTAREA") {
				e.preventDefault();
				triggerSecurityNotice();
			}
		};
		const handleKeyDown = (e) => {
			const isCmdOrCtrl = e.ctrlKey || e.metaKey;
			if (isCmdOrCtrl && (e.key === "c" || e.key === "C") || isCmdOrCtrl && (e.key === "p" || e.key === "P") || isCmdOrCtrl && (e.key === "s" || e.key === "S") || isCmdOrCtrl && (e.key === "u" || e.key === "U") || e.key === "PrintScreen") {
				e.preventDefault();
				triggerSecurityNotice();
			}
		};
		const handleTouchStart = (e) => {
			if (e.touches.length >= 3) {
				setIsBlurred(true);
				triggerSecurityNotice();
				setTimeout(() => setIsBlurred(false), 2e3);
			}
		};
		const handleBlur = () => {
			setIsBlurred(true);
		};
		const handleFocus = () => {
			setIsBlurred(false);
		};
		const handleVisibilityChange = () => {
			if (document.hidden) {
				setIsBlurred(true);
				triggerSecurityNotice();
			} else setIsBlurred(false);
		};
		document.addEventListener("copy", handleCopy);
		document.addEventListener("cut", handleCopy);
		document.addEventListener("contextmenu", handleContextMenu);
		document.addEventListener("keydown", handleKeyDown);
		document.addEventListener("touchstart", handleTouchStart, { passive: true });
		window.addEventListener("blur", handleBlur);
		window.addEventListener("focus", handleFocus);
		document.addEventListener("visibilitychange", handleVisibilityChange);
		return () => {
			document.removeEventListener("copy", handleCopy);
			document.removeEventListener("cut", handleCopy);
			document.removeEventListener("contextmenu", handleContextMenu);
			document.removeEventListener("keydown", handleKeyDown);
			document.removeEventListener("touchstart", handleTouchStart);
			window.removeEventListener("blur", handleBlur);
			window.removeEventListener("focus", handleFocus);
			document.removeEventListener("visibilitychange", handleVisibilityChange);
		};
	}, [settings.protectionEnabled]);
	const handleCopyShareLink = () => {
		try {
			navigator.clipboard.writeText(window.location.href);
			setCopiedLink(true);
			toast.success("Article link copied! Thank you for sharing the original URL.");
			setTimeout(() => setCopiedLink(false), 2500);
		} catch {
			toast.error("Could not copy link automatically.");
		}
	};
	if (!settings.protectionEnabled) return null;
	const modalTitle = settings.protectionModalTitle || `Content Protection - ${settings.siteName || "News Theme"}`;
	const modalMessage = settings.protectionModalMessage || "Our journalists work hard to bring you authentic news. When you share our website links directly, the ad revenue helps us pay our team and keep our servers online.\n\nWe humbly request you not to copy paste or take screenshots of our content. Your small effort to share the original link makes a big difference to our survival. Thank you for standing with us!";
	return /* @__PURE__ */ jsxs(Fragment, { children: [showModal && /* @__PURE__ */ jsx("div", {
		className: "fixed inset-0 z-[100] grid place-items-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in duration-200",
		onClick: (e) => e.target === e.currentTarget && setShowModal(false),
		children: /* @__PURE__ */ jsxs("div", {
			className: "w-full max-w-lg overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900 sm:p-7",
			children: [
				/* @__PURE__ */ jsxs("div", {
					className: "flex items-start justify-between gap-4",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-3",
						children: [/* @__PURE__ */ jsx("div", {
							className: "grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400",
							children: /* @__PURE__ */ jsx(Lock, { className: "h-6 w-6" })
						}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h3", {
							className: "text-base font-bold text-slate-900 dark:text-white sm:text-lg",
							children: modalTitle
						}), /* @__PURE__ */ jsx("p", {
							className: "text-xs font-semibold text-amber-600 dark:text-amber-400",
							children: "Content Protected • Direct Sharing Encouraged"
						})] })]
					}), /* @__PURE__ */ jsx("button", {
						onClick: () => setShowModal(false),
						className: "grid h-8 w-8 place-items-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200",
						"aria-label": "Close modal",
						children: /* @__PURE__ */ jsx(X, { className: "h-4 w-4" })
					})]
				}),
				/* @__PURE__ */ jsx("div", {
					className: "mt-5 space-y-3 rounded-xl border border-slate-100 bg-slate-50/80 p-4 text-xs leading-relaxed text-slate-700 dark:border-slate-800/80 dark:bg-slate-950/40 dark:text-slate-300 sm:text-sm",
					children: modalMessage.split("\n\n").map((paragraph, index) => /* @__PURE__ */ jsx("p", { children: paragraph }, index))
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "mt-6 flex flex-col-reverse gap-2.5 sm:flex-row sm:items-center sm:justify-end",
					children: [/* @__PURE__ */ jsx("button", {
						onClick: () => setShowModal(false),
						className: "w-full rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 sm:w-auto sm:text-sm",
						children: "I Understand / Close"
					}), /* @__PURE__ */ jsxs("button", {
						onClick: handleCopyShareLink,
						className: "inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white sm:w-auto sm:text-sm",
						children: [copiedLink ? /* @__PURE__ */ jsx(Check, { className: "h-4 w-4 text-emerald-400 dark:text-emerald-600" }) : /* @__PURE__ */ jsx(Copy, { className: "h-4 w-4" }), copiedLink ? "Link Copied!" : "Copy Link to Share"]
					})]
				})
			]
		})
	}), /* @__PURE__ */ jsx("style", { children: `
        /* Cross-Browser Text Selection & Drag Locking */
        .article-body-content, article p, article h1, article h2, article h3, article img {
          -webkit-user-select: none !important;
          -moz-user-select: none !important;
          -ms-user-select: none !important;
          user-select: none !important;
          -webkit-touch-callout: none !important;
          -webkit-user-drag: none !important;
          -webkit-tap-highlight-color: transparent !important;
        }

        /* Disable image long-press download menu */
        article img {
          pointer-events: none !important;
        }
        
        /* Blur article content during screenshot or app switcher preview */
        ${isBlurred ? `
          article {
            filter: blur(18px) !important;
            opacity: 0.2 !important;
            transition: filter 0.05s ease-in-out, opacity 0.05s ease-in-out;
          }
        ` : ""}

        /* Hide article body when user attempts to print or export to PDF */
        @media print {
          body {
            display: none !important;
          }
        }
      ` })] });
}
//#endregion
//#region src/routes/news.$slug.tsx?tsr-split=component
var PopupAd = lazy(() => import("./PopupAd-44C5wVrc.js").then((m) => ({ default: m.PopupAd })));
function ArticlePage() {
	const { slug } = Route.useParams();
	const { data } = useSuspenseQuery(articleQueryOptions(slug));
	const { origin, trendingArticles } = Route.useLoaderData();
	const settings = useSiteSettings();
	const siteName = settings?.siteName || "Today Tripura";
	const shareUrl = useMemo(() => `${origin}/news/${slug}`, [origin, slug]);
	const [userRole, setUserRole] = useState(null);
	const [checkingAuth, setCheckingAuth] = useState(true);
	useEffect(() => {
		authClient.auth.getSession().then(({ data: sessionData }) => {
			if (sessionData.session?.user) trackRead(sessionData.session.user.id, slug);
		});
	}, [slug]);
	useEffect(() => {
		if (!data) return;
		const article = data;
		async function checkAccess() {
			if (article.access_level !== "Premium") {
				setCheckingAuth(false);
				return;
			}
			try {
				const { data: sessionData } = await authClient.auth.getSession();
				const token = sessionData.session?.access_token;
				if (token) setUserRole((await getCurrentUserRole({ data: token })).role);
			} catch (err) {
				console.error("Failed to fetch user access permissions:", err);
			} finally {
				setCheckingAuth(false);
			}
		}
		checkAccess();
	}, [data?.access_level]);
	const isAuthorized = useMemo(() => {
		if (!data || data.access_level !== "Premium") return true;
		if (checkingAuth) return false;
		return userRole === "admin" || userRole === "editor" || userRole === "author";
	}, [
		data,
		checkingAuth,
		userRole
	]);
	if (!data) return /* @__PURE__ */ jsx(ArticleNotFound, {});
	const heroCaption = data.imageCaption?.trim() || "";
	const heroCredit = data.imageCredit?.trim() || siteName;
	const isLeftNavVisible = Boolean(settings?.showArticleLeftNav);
	const isRightSidebarVisible = settings?.showArticleRightSidebar !== false;
	const gridLayoutClass = useMemo(() => {
		if (isLeftNavVisible && isRightSidebarVisible) return "grid-cols-1 lg:grid-cols-[minmax(0,1fr)_320px] xl:grid-cols-[140px_minmax(0,1fr)_320px]";
		if (isLeftNavVisible && !isRightSidebarVisible) return "grid-cols-1 xl:grid-cols-[140px_minmax(0,1fr)]";
		if (!isLeftNavVisible && isRightSidebarVisible) return "grid-cols-1 lg:grid-cols-[minmax(0,1fr)_320px]";
		return "grid-cols-1 max-w-4xl mx-auto";
	}, [isLeftNavVisible, isRightSidebarVisible]);
	return /* @__PURE__ */ jsxs("div", {
		className: "min-h-screen bg-background text-foreground overflow-x-clip w-full max-w-full",
		children: [
			/* @__PURE__ */ jsx(ContentProtectionGuard, {}),
			/* @__PURE__ */ jsx(ReadingProgress, {}),
			/* @__PURE__ */ jsx(Header, {}),
			/* @__PURE__ */ jsx("main", {
				className: "mx-auto max-w-7xl px-3 sm:px-4 pt-3 pb-12 w-full max-w-full min-w-0",
				children: /* @__PURE__ */ jsxs("div", {
					className: `grid gap-6 ${gridLayoutClass} w-full max-w-full min-w-0 items-start`,
					children: [
						isLeftNavVisible && /* @__PURE__ */ jsx(ArticleLeftNav, {}),
						/* @__PURE__ */ jsxs("article", {
							className: "relative w-full max-w-full min-w-0",
							children: [
								/* @__PURE__ */ jsx(ArticleHeader, {
									title: data.title,
									author: data.author,
									date: data.date,
									views: data.views,
									category: data.category,
									deck: data.excerpt,
									shareUrl
								}),
								/* @__PURE__ */ jsx(ArticleHero, {
									src: data.hero,
									alt: data.title,
									caption: heroCaption,
									credit: heroCredit
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "w-full pt-1",
									children: [checkingAuth ? /* @__PURE__ */ jsxs("div", {
										className: "flex flex-col items-center justify-center py-12 text-slate-400 space-y-4",
										children: [/* @__PURE__ */ jsx("div", { className: "h-6 w-6 animate-spin rounded-full border-2 border-slate-400 border-t-transparent" }), /* @__PURE__ */ jsx("p", {
											className: "text-sm",
											children: "Verifying access credentials..."
										})]
									}) : isAuthorized ? /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(ArticleBody, {
										paragraphs: data.paragraphs,
										midImage: data.midImage ? {
											src: data.midImage,
											caption: heroCaption,
											credit: heroCredit
										} : void 0
									}), /* @__PURE__ */ jsxs("div", {
										className: "mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-slate-200 dark:border-slate-800 pt-4 pb-1",
										children: [/* @__PURE__ */ jsx(ShareRail, {
											url: shareUrl,
											title: data.title
										}), /* @__PURE__ */ jsx(ArticleQrCard, { url: shareUrl })]
									})] }) : /* @__PURE__ */ jsxs("div", {
										className: "my-8 rounded-xl border border-amber-200 bg-amber-50/50 p-6 text-center shadow-sm dark:border-amber-900/30 dark:bg-amber-950/20",
										children: [
											/* @__PURE__ */ jsx("div", {
												className: "mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400",
												children: /* @__PURE__ */ jsx(Lock, { className: "h-6 w-6" })
											}),
											/* @__PURE__ */ jsx("h3", {
												className: "mt-4 text-base font-bold text-slate-900 dark:text-white",
												children: "Premium Content Lock"
											}),
											/* @__PURE__ */ jsx("p", {
												className: "mt-2 text-sm text-slate-600 dark:text-slate-400",
												children: "This report is restricted to Premium readers. Only Administrators, Editors, and Authors are authorized to access this content."
											}),
											!userRole ? /* @__PURE__ */ jsx("div", {
												className: "mt-6",
												children: /* @__PURE__ */ jsxs(Link, {
													to: "/auth",
													className: "inline-flex items-center gap-2 rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 transition",
													children: [/* @__PURE__ */ jsx(LogIn, { className: "h-4 w-4" }), " Sign in to verify access"]
												})
											}) : /* @__PURE__ */ jsxs("div", {
												className: "mt-6 space-y-4",
												children: [/* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsxs(Link, {
													to: "/subscription",
													className: "inline-flex items-center gap-2 rounded-md bg-amber-600 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-700 transition shadow-sm",
													children: [/* @__PURE__ */ jsx(Sparkles, { className: "h-4 w-4 animate-pulse" }), " Upgrade to Premium"]
												}) }), /* @__PURE__ */ jsxs("div", {
													className: "flex items-center justify-center gap-2 text-xs text-amber-700 dark:text-amber-400",
													children: [/* @__PURE__ */ jsx(AlertCircle, { className: "h-4 w-4" }), /* @__PURE__ */ jsxs("span", { children: [
														"Logged in as role: ",
														/* @__PURE__ */ jsx("strong", {
															className: "uppercase",
															children: userRole
														}),
														" ",
														"(Unauthorized)"
													] })]
												})]
											})
										]
									}), isAuthorized && /* @__PURE__ */ jsx(ArticleFooter, {
										slug,
										author: data.author,
										articleTitle: data.title,
										tags: data.tags,
										category: data.category
									})]
								})
							]
						}),
						isRightSidebarVisible && /* @__PURE__ */ jsx(ArticleSidebar, {
							trending: trendingArticles,
							currentSlug: slug
						})
					]
				})
			}),
			/* @__PURE__ */ jsx(Footer, {}),
			/* @__PURE__ */ jsx(Suspense, {
				fallback: null,
				children: /* @__PURE__ */ jsx(PopupAd, {})
			})
		]
	});
}
//#endregion
export { ArticlePage as component };

//# sourceMappingURL=news._slug-DycZ-DDh.js.map