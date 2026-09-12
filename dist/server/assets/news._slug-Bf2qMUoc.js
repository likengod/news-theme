import { _ as loadSettings } from "./site-content-D3QzTkKt.js";
import { a as useSiteSettings } from "./AdSettingsContext-Dq1Y9X_4.js";
import { t as Views } from "./Views-MJGDQohZ.js";
import { i as getCurrentUserRole, t as authClient } from "./auth-client-BpY5OKKw.js";
import { a as trackRead, o as trackShare } from "./user-actions-tracker-DJQ5cFC2.js";
import { t as Footer } from "./Footer-BHfGcJnA.js";
import { t as Header } from "./Header-XENSGxR3.js";
import { n as articleQueryOptions, t as Route } from "./news._slug-C_DuNCf7.js";
import { t as ArchiveFinder } from "./ArchiveFinder-CRW_hGql.js";
import { t as ArticleNotFound } from "./news._slug-m4S1x25M.js";
import { Suspense, lazy, memo, useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { AlertCircle, Check, Copy, Link2, Lock, LogIn, Sparkles, X } from "lucide-react";
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
	"diwali": "linear-gradient(to right, #FF8008, #FFC837, #FF007F, #7F00FF)",
	"sunset": "linear-gradient(to right, #F5576C, #F093FB)",
	"neon": "linear-gradient(to right, #FF007F, #7F00FF, #00F0FF)",
	"ocean": "linear-gradient(to right, #00c6ff, #0072ff)",
	"forest": "linear-gradient(to right, #11998e, #38ef7d)"
};
function ArticleHeader({ title, author, date, views, category = "News", deck }) {
	const [settings, setSettings] = useState(() => loadSettings());
	const [showCustomText, setShowCustomText] = useState(false);
	useEffect(() => {
		const handleUpdate = () => setSettings(loadSettings());
		window.addEventListener("nt:settings-updated", handleUpdate);
		return () => window.removeEventListener("nt:settings-updated", handleUpdate);
	}, []);
	useEffect(() => {
		if (settings.festiveThemeEnabled === false || !settings.topBarWeatherCustomText) {
			setShowCustomText(false);
			return;
		}
		const delay = (Number(settings.topBarSwapDelay) || 5) * 1e3;
		const interval = setInterval(() => {
			setShowCustomText((prev) => !prev);
		}, delay);
		return () => clearInterval(interval);
	}, [
		settings.festiveThemeEnabled,
		settings.topBarWeatherCustomText,
		settings.topBarSwapDelay
	]);
	const activeGradient = settings.festiveCategoryTitleGradient || settings.topBarTextGradient;
	const badgeStyle = activeGradient && FESTIVE_GRADIENT_MAP$1[activeGradient] ? {
		backgroundImage: FESTIVE_GRADIENT_MAP$1[activeGradient],
		WebkitBackgroundClip: "text",
		WebkitTextFillColor: "transparent",
		backgroundClip: "text",
		display: "inline-block"
	} : { color: settings.festiveCategoryTitleColor || settings.topBarTextColor || "#000000" };
	const badgeText = settings.festiveThemeEnabled !== false && showCustomText && settings.topBarWeatherCustomText ? settings.topBarWeatherCustomText : category;
	return /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsxs("nav", {
		className: "mb-1 text-xs uppercase tracking-widest text-muted-foreground",
		children: [
			/* @__PURE__ */ jsx(Link, {
				to: "/",
				className: "hover:text-foreground",
				children: "Home"
			}),
			/* @__PURE__ */ jsx("span", {
				className: "mx-2",
				children: "/"
			}),
			/* @__PURE__ */ jsx(Link, {
				to: "/$slug",
				params: { slug: category.toLowerCase() },
				className: "hover:text-foreground",
				children: category
			})
		]
	}), /* @__PURE__ */ jsxs("header", {
		className: "border-b border-border pb-3",
		children: [
			/* @__PURE__ */ jsx("span", {
				className: "inline-block text-xs font-extrabold uppercase tracking-widest animate-in fade-in duration-300",
				style: badgeStyle,
				children: badgeText
			}, showCustomText ? "custom" : "default"),
			/* @__PURE__ */ jsx("h1", {
				className: "headline mt-3 font-serif text-3xl font-bold leading-tight text-primary md:text-5xl",
				children: title
			}),
			deck && /* @__PURE__ */ jsx("p", {
				className: "mt-3 text-lg leading-relaxed text-muted-foreground md:text-xl",
				children: deck
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "mt-4 flex flex-wrap items-center justify-between gap-y-3 gap-x-2 text-[10px] sm:text-xs uppercase tracking-widest text-muted-foreground",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "flex flex-wrap items-center gap-x-2 sm:gap-x-4 gap-y-1 flex-1",
					children: [
						/* @__PURE__ */ jsxs("span", {
							className: "font-semibold text-foreground",
							children: ["By ", author]
						}),
						/* @__PURE__ */ jsx("span", {
							"aria-hidden": true,
							children: "•"
						}),
						/* @__PURE__ */ jsxs("time", { children: [date.split(/ at /i)[0], date.split(/ at /i)[1] && /* @__PURE__ */ jsxs("span", {
							className: "hidden sm:inline",
							children: [" AT ", date.split(/ at /i)[1]]
						})] }),
						/* @__PURE__ */ jsx("span", {
							"aria-hidden": true,
							children: "•"
						}),
						/* @__PURE__ */ jsx(Views, { count: views })
					]
				}), settings.googleNews && settings.googleNews !== "#" && /* @__PURE__ */ jsxs("a", {
					href: settings.googleNews || "https://news.google.com/",
					target: "_blank",
					rel: "noopener noreferrer",
					title: "Follow on Google News",
					className: "flex shrink-0 items-center gap-2 transition hover:opacity-80 normal-case tracking-normal rounded hover:bg-muted p-1 sm:p-0",
					children: [/* @__PURE__ */ jsx("img", {
						src: "https://upload.wikimedia.org/wikipedia/commons/d/da/Google_News_icon.svg",
						alt: "Google News",
						className: "h-6 w-6 sm:h-7 sm:w-7"
					}), /* @__PURE__ */ jsxs("div", {
						className: "flex flex-col items-start justify-center text-left font-sans",
						children: [/* @__PURE__ */ jsx("span", {
							className: "text-[9px] font-medium tracking-wide text-[#3c4043] uppercase leading-none mb-[1px]",
							children: "Follow on"
						}), /* @__PURE__ */ jsxs("span", {
							className: "text-[15px] font-medium leading-none tracking-tight flex items-center",
							children: [
								/* @__PURE__ */ jsx("span", {
									className: "text-[#4285F4]",
									children: "G"
								}),
								/* @__PURE__ */ jsx("span", {
									className: "text-[#EA4335]",
									children: "o"
								}),
								/* @__PURE__ */ jsx("span", {
									className: "text-[#FBBC05]",
									children: "o"
								}),
								/* @__PURE__ */ jsx("span", {
									className: "text-[#4285F4]",
									children: "g"
								}),
								/* @__PURE__ */ jsx("span", {
									className: "text-[#34A853]",
									children: "l"
								}),
								/* @__PURE__ */ jsx("span", {
									className: "text-[#EA4335]",
									children: "e"
								}),
								/* @__PURE__ */ jsx("span", {
									className: "text-[#3c4043] ml-1",
									children: "News"
								})
							]
						})]
					})]
				})]
			})
		]
	})] });
}
//#endregion
//#region src/components/article/ArticleHero.tsx
function ArticleHero({ src, alt, caption, credit }) {
	return /* @__PURE__ */ jsxs("figure", {
		className: "mb-8",
		children: [/* @__PURE__ */ jsx("img", {
			src,
			alt,
			width: 1200,
			height: 675,
			loading: "eager",
			fetchPriority: "high",
			decoding: "async",
			className: "aspect-[16/9] w-full object-cover"
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
var ArticleBody = memo(function ArticleBody({ paragraphs, midImage }) {
	if (paragraphs.length === 1 && (paragraphs[0].startsWith("<") || paragraphs[0].includes("<p>"))) return /* @__PURE__ */ jsx("div", {
		className: "prose-article space-y-4 md:space-y-5 text-[15px] md:text-lg leading-relaxed md:leading-[1.85] text-foreground/90",
		dangerouslySetInnerHTML: { __html: DOMPurify.sanitize(paragraphs[0]) }
	});
	const first = paragraphs[0];
	const beforeMid = paragraphs.slice(1, 4);
	const afterMid = paragraphs.slice(4);
	return /* @__PURE__ */ jsxs("div", {
		className: "prose-article space-y-4 md:space-y-5 text-[15px] md:text-lg leading-relaxed md:leading-[1.85] text-foreground/90",
		children: [
			first && /* @__PURE__ */ jsx("p", { children: first }),
			beforeMid.map((p, i) => /* @__PURE__ */ jsx("p", { children: p }, `b-${i}`)),
			midImage && /* @__PURE__ */ jsxs("figure", {
				className: "my-8",
				children: [/* @__PURE__ */ jsx("img", {
					src: midImage.src,
					alt: "",
					loading: "lazy",
					decoding: "async",
					className: "aspect-[16/9] w-full object-cover"
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
			afterMid.map((p, i) => /* @__PURE__ */ jsx("p", { children: p }, `a-${i}`))
		]
	});
});
//#endregion
//#region src/components/article/ArticleFooter.tsx
var RelatedNews = lazy(() => import("./RelatedNews-D6mfpm1F.js").then((m) => ({ default: m.RelatedNews })));
var CommentsSection = lazy(() => import("./CommentsSection-7FWpO_LT.js").then((m) => ({ default: m.CommentsSection })));
var DEFAULT_TAGS = [
	"Breaking",
	"Northeast",
	"Report",
	"Update"
];
function ArticleFooter({ slug, author, tags = DEFAULT_TAGS, articleTitle = "Untitled Article" }) {
	author.split(" ").map((n) => n[0]).join("");
	return /* @__PURE__ */ jsxs("footer", {
		className: "mt-2",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "flex flex-wrap items-center gap-2 border-t border-border pt-3",
				children: [/* @__PURE__ */ jsx("span", {
					className: "mr-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground",
					children: "Tags:"
				}), tags.map((t) => /* @__PURE__ */ jsx(Link, {
					to: "/$slug",
					params: { slug: t.toLowerCase() },
					className: "rounded-full border border-border px-3 py-1 text-xs uppercase tracking-widest text-muted-foreground transition hover:bg-muted hover:text-foreground",
					children: t
				}, t))]
			}),
			/* @__PURE__ */ jsx(Suspense, {
				fallback: /* @__PURE__ */ jsx("div", { className: "mt-8 h-24 animate-pulse rounded bg-muted" }),
				children: /* @__PURE__ */ jsx(RelatedNews, { currentSlug: slug })
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
//#region src/components/article/ArticleSidebar.tsx
var Advertisement = lazy(() => import("./Advertisement-Cekb6Qix.js").then((n) => n.n));
var TRENDING = [
	"Fed Signals Pause on Cuts as Inflation Reignites in Core Services",
	"Bitcoin Tags Fresh High as Spot ETF Inflows Cross $50B Mark",
	"Nvidia's Blackwell Surge Pushes Hyperscaler Capex to $320B",
	"Goldman, JPMorgan Beat as Trading Desks Rake in Record Quarter",
	"Tesla Unveils Next-Gen Robotaxi With Full City Autonomy Demo",
	"ECB Holds but Lagarde Opens Door to a Spring Move"
];
function ArticleSidebar() {
	return /* @__PURE__ */ jsxs("aside", {
		className: "space-y-8",
		children: [
			/* @__PURE__ */ jsx(Suspense, {
				fallback: /* @__PURE__ */ jsx("div", { className: "aspect-[3/4] w-full animate-pulse bg-muted" }),
				children: /* @__PURE__ */ jsx(Advertisement, {
					slot: "ad3",
					aspectRatio: "3/4"
				})
			}),
			/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h4", {
				className: "mb-4 border-b-2 border-foreground pb-2 text-xs font-bold uppercase tracking-widest text-foreground",
				children: "Trending Stories"
			}), /* @__PURE__ */ jsx("ol", {
				className: "space-y-4",
				children: TRENDING.map((t, i) => /* @__PURE__ */ jsxs("li", {
					className: "flex gap-3",
					children: [/* @__PURE__ */ jsx("span", {
						className: "font-serif text-2xl font-bold text-muted-foreground",
						children: i + 1
					}), /* @__PURE__ */ jsx(Link, {
						to: "/news/$slug",
						params: { slug: t.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") },
						className: "headline line-clamp-3 font-serif text-sm font-bold leading-snug text-primary hover:underline",
						children: t
					})]
				}, t))
			})] }),
			/* @__PURE__ */ jsx(ArchiveFinder, {})
		]
	});
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
	"diwali": "linear-gradient(to right, #FF8008, #FFC837, #FF007F, #7F00FF)",
	"sunset": "linear-gradient(to right, #F5576C, #F093FB)",
	"neon": "linear-gradient(to right, #FF007F, #7F00FF, #00F0FF)",
	"ocean": "linear-gradient(to right, #00c6ff, #0072ff)",
	"forest": "linear-gradient(to right, #11998e, #38ef7d)"
};
function ArticleQrCard({ url }) {
	const [settings, setSettings] = useState(() => loadSettings());
	const [showCustomText, setShowCustomText] = useState(false);
	useEffect(() => {
		const handleUpdate = () => setSettings(loadSettings());
		window.addEventListener("nt:settings-updated", handleUpdate);
		return () => window.removeEventListener("nt:settings-updated", handleUpdate);
	}, []);
	useEffect(() => {
		if (settings.festiveThemeEnabled === false || !settings.topBarWeatherCustomText) {
			setShowCustomText(false);
			return;
		}
		const delay = (Number(settings.topBarSwapDelay) || 5) * 1e3;
		const interval = setInterval(() => {
			setShowCustomText((prev) => !prev);
		}, delay);
		return () => clearInterval(interval);
	}, [
		settings.festiveThemeEnabled,
		settings.topBarWeatherCustomText,
		settings.topBarSwapDelay
	]);
	const qrCodeUrl = useMemo(() => {
		return `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(url)}`;
	}, [url]);
	const activeGradient = settings.festiveScanMeTextGradient || settings.topBarTextGradient || settings.festiveCategoryTitleGradient;
	const activeColor = settings.festiveScanMeTextColor || settings.festiveCategoryTitleColor || settings.topBarTextColor || "#000000";
	const scanMeStyle = activeGradient && FESTIVE_GRADIENT_MAP[activeGradient] ? {
		backgroundImage: FESTIVE_GRADIENT_MAP[activeGradient],
		WebkitBackgroundClip: "text",
		WebkitTextFillColor: "transparent",
		backgroundClip: "text",
		display: "inline-block"
	} : { color: activeColor };
	const subtextStyle = settings.festiveScanMeSubtextColor ? { color: settings.festiveScanMeSubtextColor } : void 0;
	return /* @__PURE__ */ jsxs("div", {
		className: "inline-flex items-center gap-2.5",
		children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h4", {
			className: "text-xs font-extrabold uppercase leading-tight tracking-tight sm:text-sm animate-in fade-in duration-300",
			style: scanMeStyle,
			children: settings.festiveThemeEnabled !== false && showCustomText && settings.topBarWeatherCustomText ? settings.topBarWeatherCustomText : settings.festiveScanMeCustomText || "SCAN ME"
		}, showCustomText ? "custom" : "default"), !(showCustomText && settings.topBarWeatherCustomText) && /* @__PURE__ */ jsx("p", {
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
var PopupAd = lazy(() => import("./PopupAd-UWpk3pd-.js").then((m) => ({ default: m.PopupAd })));
function ArticlePage() {
	const { slug } = Route.useParams();
	const { data } = useSuspenseQuery(articleQueryOptions(slug));
	const { origin } = Route.useLoaderData();
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
		async function checkAccess() {
			if (data.access_level !== "Premium") {
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
	return /* @__PURE__ */ jsxs("div", {
		className: "min-h-screen bg-background text-foreground",
		children: [
			/* @__PURE__ */ jsx(ContentProtectionGuard, {}),
			/* @__PURE__ */ jsx(ReadingProgress, {}),
			/* @__PURE__ */ jsx(Header, {}),
			/* @__PURE__ */ jsxs("main", {
				className: "mx-auto max-w-6xl px-4 pt-2 pb-8",
				children: [/* @__PURE__ */ jsx(ArticleHeader, {
					title: data.title,
					author: data.author,
					date: data.date,
					views: data.views,
					category: data.category
				}), /* @__PURE__ */ jsxs("div", {
					className: "grid grid-cols-1 gap-10 pt-8 lg:grid-cols-[minmax(0,1fr)_300px]",
					children: [/* @__PURE__ */ jsxs("article", {
						className: "relative",
						children: [/* @__PURE__ */ jsx(ArticleHero, {
							src: data.hero,
							alt: data.title,
							caption: "Rescuers and officials at the scene shortly after the incident.",
							credit: "News Theme"
						}), /* @__PURE__ */ jsxs("div", {
							className: "mx-auto max-w-[720px] pt-4",
							children: [checkingAuth ? /* @__PURE__ */ jsxs("div", {
								className: "flex flex-col items-center justify-center py-12 text-slate-400 space-y-4",
								children: [/* @__PURE__ */ jsx("div", { className: "h-6 w-6 animate-spin rounded-full border-2 border-slate-400 border-t-transparent" }), /* @__PURE__ */ jsx("p", {
									className: "text-sm",
									children: "Verifying access credentials..."
								})]
							}) : isAuthorized ? /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(ArticleBody, {
								paragraphs: data.paragraphs,
								midImage: {
									src: data.midImage,
									caption: "Aid workers coordinating relief operations on the ground.",
									credit: "News Theme"
								}
							}), /* @__PURE__ */ jsxs("div", {
								className: "mt-6 flex flex-wrap items-center justify-between gap-3 pb-1",
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
												" (Unauthorized)"
											] })]
										})]
									})
								]
							}), isAuthorized && /* @__PURE__ */ jsx(ArticleFooter, {
								slug,
								author: data.author,
								articleTitle: data.title
							})]
						})]
					}), /* @__PURE__ */ jsx(ArticleSidebar, {})]
				})]
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

//# sourceMappingURL=news._slug-Bf2qMUoc.js.map