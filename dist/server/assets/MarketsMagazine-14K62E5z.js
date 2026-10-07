import { o as loadSettings } from "./site-settings-Bu9zqKkM.js";
import { d as loadAdRotation, f as loadAdSlotMode, m as loadAds, p as loadAdSlotScript } from "./ads-storage-CpUQh9Oj.js";
import { n as useAdSettings } from "./AdSettingsContext-BcoVxOcB.js";
import { d as news_wallstreet_default, f as news_crypto_default, g as hero_markets_default, h as news_fed_default, m as news_tech_default, n as getArticleImage, p as news_oil_default } from "./news-data-CiXcY3JG.js";
import { n as ScriptAdRenderer } from "./ArchiveFinder-Cs9hqeiA.js";
import { t as useHomepageConfig } from "./use-homepage-config-CMz2W43n.js";
import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
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
function useAdaptiveSnippetLines(initialTitle, options = {
	singleLine: 4,
	twoLines: 3,
	threeLines: 2
}) {
	const titleRef = useRef(null);
	const [descLines, setDescLines] = useState(() => {
		if (!initialTitle) return options.singleLine;
		return initialTitle.length > 52 ? options.twoLines : options.singleLine;
	});
	useEffect(() => {
		const el = titleRef.current;
		if (!el) return;
		const updateLines = () => {
			const h = el.clientHeight;
			const computed = window.getComputedStyle(el);
			const ratio = h / (parseFloat(computed.lineHeight) || 24);
			if (ratio <= 1.35) setDescLines(options.singleLine);
			else if (ratio <= 2.35) setDescLines(options.twoLines);
			else setDescLines(options.threeLines ?? options.twoLines);
		};
		updateLines();
		if (typeof ResizeObserver !== "undefined") {
			const ro = new ResizeObserver(updateLines);
			ro.observe(el);
			return () => ro.disconnect();
		} else {
			window.addEventListener("resize", updateLines);
			return () => window.removeEventListener("resize", updateLines);
		}
	}, [
		initialTitle,
		options.singleLine,
		options.twoLines,
		options.threeLines
	]);
	return {
		titleRef,
		descLines
	};
}
function MagazineLeadHeadline({ leadArt }) {
	const { titleRef, descLines } = useAdaptiveSnippetLines(leadArt.title, {
		singleLine: 6,
		twoLines: 5,
		threeLines: 4
	});
	const snippet = getArticleSnippet(leadArt);
	const match = snippet.trim().match(/^(\S+)\s*([\s\S]*)$/);
	const firstWord = match ? match[1] : snippet;
	const restText = match ? match[2] : "";
	return /* @__PURE__ */ jsxs(Link, {
		to: "/news/$slug",
		params: { slug: leadArt.slug },
		className: "group flex flex-col justify-center pt-0.5 min-w-0 w-full",
		children: [
			/* @__PURE__ */ jsx("h2", {
				ref: titleRef,
				className: "headline text-[24px] sm:text-[28px] lg:text-[32px] xl:text-[36px] font-extrabold leading-[1.25] tracking-tight text-foreground group-hover:text-red-600 transition-colors line-clamp-3",
				children: leadArt.title
			}),
			/* @__PURE__ */ jsx("p", {
				className: "mt-3 text-[14px] sm:text-[15px] lg:text-[16px] leading-relaxed text-muted-foreground select-text",
				style: {
					display: "-webkit-box",
					WebkitBoxOrient: "vertical",
					WebkitLineClamp: descLines,
					overflow: "hidden"
				},
				children: firstWord ? /* @__PURE__ */ jsxs(Fragment, { children: [
					/* @__PURE__ */ jsx("span", {
						className: "float-left text-[24px] sm:text-[28px] lg:text-[30px] font-black leading-[1.05] mr-2.5 mt-0.5 text-foreground select-text",
						children: firstWord
					}),
					" ",
					restText
				] }) : snippet
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
	const { titleRef, descLines } = useAdaptiveSnippetLines(p1.title, {
		singleLine: 4,
		twoLines: 3
	});
	return /* @__PURE__ */ jsx(Link, {
		to: "/news/$slug",
		params: { slug: p1.slug },
		className: "group block w-full max-w-full min-w-0",
		children: /* @__PURE__ */ jsxs("div", {
			className: "grid gap-4 md:grid-cols-[194px_1fr] items-start",
			children: [/* @__PURE__ */ jsx("img", {
				src: getArticleImage(p1.featuredImage, 1),
				alt: p1.title,
				loading: "lazy",
				decoding: "async",
				width: 194,
				height: 130,
				className: "h-[130px] md:h-[135px] w-full object-cover md:w-[194px] rounded-xs shrink-0"
			}), /* @__PURE__ */ jsxs("div", {
				className: "min-w-0",
				children: [/* @__PURE__ */ jsx("p", {
					ref: titleRef,
					className: "headline text-[20px] font-bold leading-[1.3] tracking-normal text-foreground group-hover:underline md:text-[22px] line-clamp-2",
					children: p1.title
				}), /* @__PURE__ */ jsx("p", {
					className: "mt-2 text-[14px] leading-relaxed text-muted-foreground",
					style: {
						display: "-webkit-box",
						WebkitBoxOrient: "vertical",
						WebkitLineClamp: descLines,
						overflow: "hidden"
					},
					children: getArticleSnippet(p1)
				})]
			})]
		})
	});
}
function MagazineSmallCard({ article }) {
	const { titleRef, descLines } = useAdaptiveSnippetLines(article.title, {
		singleLine: 4,
		twoLines: 3
	});
	return /* @__PURE__ */ jsxs(Link, {
		to: "/news/$slug",
		params: { slug: article.slug },
		className: "group block min-w-0",
		children: [/* @__PURE__ */ jsx("p", {
			ref: titleRef,
			className: "headline text-[17px] font-bold leading-[1.32] tracking-normal text-foreground group-hover:underline line-clamp-2",
			children: article.title
		}), /* @__PURE__ */ jsx("p", {
			className: "mt-2 text-[14px] leading-relaxed text-muted-foreground",
			style: {
				display: "-webkit-box",
				WebkitBoxOrient: "vertical",
				WebkitLineClamp: descLines,
				overflow: "hidden"
			},
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
	const [settings, setSettings] = useState(() => loadSettings());
	const [showCustomText, setShowCustomText] = useState(false);
	const hasAd = slotMode === "script" ? Boolean(slotScript) : slides.length > 0;
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
					children: hasCustomAlert && showCustomText && settings.festiveAlertImage ? /* @__PURE__ */ jsx("img", {
						src: settings.festiveAlertImage,
						alt: "Alert",
						className: "h-4 w-auto max-w-[80px] object-contain shrink-0 align-middle"
					}) : /* @__PURE__ */ jsx("span", { children: badgeTitle })
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
						}) : slides.map((s, i) => /* @__PURE__ */ jsx("a", {
							href: s.href || "#",
							"aria-hidden": i !== slideIdx,
							className: "absolute inset-0 block transition-opacity duration-300",
							style: {
								opacity: i === slideIdx ? 1 : 0,
								pointerEvents: i === slideIdx ? "auto" : "none"
							},
							children: /* @__PURE__ */ jsx("img", {
								src: s.image,
								alt: "",
								loading: "lazy",
								decoding: "async",
								className: "h-full w-full object-cover"
							})
						}, s.id))
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
export { MarketsMagazine };

//# sourceMappingURL=MarketsMagazine-14K62E5z.js.map