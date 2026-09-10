import { C as hero_markets_default, S as news_fed_default, b as news_oil_default, l as getArticleImage, v as news_wallstreet_default, x as news_tech_default, y as news_crypto_default } from "./db.server-Chz3iTW3.js";
import { _ as loadSettings, d as loadAdRotation, f as loadAdSlotMode, m as loadAds, p as loadAdSlotScript } from "./site-content-D8xZkwj9.js";
import { n as useAdSettings } from "./AdSettingsContext-DUnzcRrC.js";
import { t as ScriptAdRenderer } from "./ScriptAdRenderer-CHXwBV65.js";
import { t as useHomepageConfig } from "./use-homepage-config-DvxLeppq.js";
import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
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
		return a.category?.toLowerCase() === magazineCategory.toLowerCase();
	});
	if (dbMagazineArticles.length < 4) {
		const filler = articles.filter((a) => !localUsed.has(a.id) && !dbMagazineArticles.some((d) => d.id === a.id));
		dbMagazineArticles = [...dbMagazineArticles, ...filler];
	}
	if (dbMagazineArticles.length < 4) {
		const remaining = articles.filter((a) => !dbMagazineArticles.some((d) => d.id === a.id));
		dbMagazineArticles = [...dbMagazineArticles, ...remaining];
	}
	dbMagazineArticles.slice(0, 4).forEach((a) => localUsed.add(a.id));
	const leadArt = dbMagazineArticles[0];
	const p1 = dbMagazineArticles[1];
	const p2 = dbMagazineArticles[2];
	const p3 = dbMagazineArticles[3];
	const activeGradient = settings.festiveCategoryTitleGradient || settings.topBarTextGradient;
	const FESTIVE_GRADIENT_MAP = {
		"indian-flag": "linear-gradient(to right, #FF9933, #000080, #138808)",
		"diwali": "linear-gradient(to right, #FF8008, #FFC837, #FF007F, #7F00FF)",
		"sunset": "linear-gradient(to right, #F5576C, #F093FB)",
		"neon": "linear-gradient(to right, #FF007F, #7F00FF, #00F0FF)",
		"ocean": "linear-gradient(to right, #00c6ff, #0072ff)",
		"forest": "linear-gradient(to right, #11998e, #38ef7d)"
	};
	return /* @__PURE__ */ jsxs("section", {
		className: "border border-border bg-background px-6 py-8 font-sans md:px-9",
		children: [
			/* @__PURE__ */ jsx("div", {
				className: "mb-5 inline-block",
				children: /* @__PURE__ */ jsx("span", {
					className: "px-2.5 py-1 font-sans text-xs font-black uppercase tracking-widest inline-block rounded-xs shadow-xs transition-all duration-300",
					style: activeGradient && FESTIVE_GRADIENT_MAP[activeGradient] ? {
						backgroundColor: settings.festiveCategoryBadgeBgColor || "#000000",
						backgroundImage: FESTIVE_GRADIENT_MAP[activeGradient],
						WebkitBackgroundClip: "text",
						WebkitTextFillColor: "transparent",
						backgroundClip: "text"
					} : {
						backgroundColor: settings.festiveCategoryBadgeBgColor || "#000000",
						color: settings.festiveCategoryBadgeTextColor || "#ffffff"
					},
					children: settings.festiveThemeEnabled !== false && showCustomText && settings.topBarWeatherCustomText ? settings.topBarWeatherCustomText : cfg.marketsMagazine.title
				}, showCustomText ? "custom" : "default")
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "grid items-start gap-5 lg:grid-cols-[354px_minmax(340px,1fr)_406px]",
				children: [
					/* @__PURE__ */ jsx(Link, {
						to: "/news/$slug",
						params: { slug: leadArt?.slug || "gen-z-traders-go-for-broke-in-pursuit-of-a-new-american-dream" },
						className: "group block",
						children: /* @__PURE__ */ jsxs("figure", { children: [/* @__PURE__ */ jsx("img", {
							src: leadArt ? getArticleImage(leadArt.featuredImage, 0) : hero_markets_default,
							alt: "Lead Article",
							loading: "eager",
							fetchPriority: "high",
							className: "h-[235px] w-full object-cover"
						}), /* @__PURE__ */ jsx("figcaption", {
							className: "mt-1 text-right font-sans text-[10px] leading-tight text-muted-foreground",
							children: "Artwork: Najeebah Al-Ghadban for Northeast Markets"
						})] })
					}),
					/* @__PURE__ */ jsxs(Link, {
						to: "/news/$slug",
						params: { slug: leadArt?.slug || "gen-z-traders-go-for-broke-in-pursuit-of-a-new-american-dream" },
						className: "group block pt-0.5",
						children: [
							/* @__PURE__ */ jsx("p", {
								className: "headline max-w-[500px] text-[26px] font-bold leading-[1.32] tracking-normal text-foreground group-hover:underline md:text-[28px] line-clamp-2",
								children: leadArt ? leadArt.title : "Gen-Z Traders Go for Broke in Pursuit of a New American Dream"
							}),
							/* @__PURE__ */ jsx("p", {
								className: "mt-2.5 max-w-[440px] text-[15px] leading-relaxed text-muted-foreground line-clamp-6",
								children: leadArt ? leadArt.excerpt || leadArt.content?.replace(/<[^>]*>/g, "").slice(0, 300) + "..." : "Lottery-like meme stocks and options can seem like a shortcut to beat high home prices, stubborn inflation and the looming threat of AI to entry-level jobs. A new generation of retail traders is piling into zero-day options, leveraged ETFs and viral tickers, betting that a single windfall can leapfrog them past a housing market that feels permanently out of reach and a labor market reshaped overnight."
							}),
							/* @__PURE__ */ jsxs("p", {
								className: "mt-1.5 font-sans text-[14px] leading-tight text-foreground",
								children: ["By ", leadArt ? leadArt.author || "Newsroom Staff" : "Justina Lee and Lu Wang"]
							})
						]
					}),
					/* @__PURE__ */ jsx("aside", {
						className: "relative h-[196px] overflow-hidden rounded-[10px] border border-border lg:mt-0 bg-muted/30",
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
			/* @__PURE__ */ jsxs("div", {
				className: "mt-3 grid gap-8 border-t border-border pt-3 lg:grid-cols-[minmax(585px,1.62fr)_minmax(240px,0.7fr)_minmax(300px,0.86fr)]",
				children: [
					/* @__PURE__ */ jsx(Link, {
						to: "/news/$slug",
						params: { slug: p1?.slug || "a-600-billion-experiment-kicks-off-at-the-biggest-us-pension-fund" },
						className: "group block",
						children: /* @__PURE__ */ jsxs("div", {
							className: "grid gap-4 md:grid-cols-[194px_1fr]",
							children: [/* @__PURE__ */ jsx("img", {
								src: p1 ? getArticleImage(p1.featuredImage, 1) : news_wallstreet_default,
								alt: "Pension Fund",
								loading: "lazy",
								decoding: "async",
								className: "h-[130px] w-full object-cover md:w-[194px]"
							}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("p", {
								className: "headline text-[22px] font-bold leading-[1.32] tracking-normal text-foreground group-hover:underline md:text-[24px] line-clamp-2",
								children: p1 ? p1.title : "Market Insights and Analysis"
							}), /* @__PURE__ */ jsx("p", {
								className: "mt-2 max-w-[430px] text-[14px] leading-relaxed text-muted-foreground line-clamp-4",
								children: p1 ? p1.excerpt || p1.content?.replace(/<[^>]*>/g, "").slice(0, 150) + "..." : "Latest developments and analytical perspectives on regional and global market trends."
							})] })]
						})
					}),
					/* @__PURE__ */ jsxs(Link, {
						to: "/news/$slug",
						params: { slug: p2?.slug || "market-update-report" },
						className: "group block",
						children: [
							/* @__PURE__ */ jsx("p", {
								className: "font-sans text-[13px] font-semibold uppercase tracking-wider text-muted-foreground",
								children: p2 ? p2.category : "Analysis"
							}),
							/* @__PURE__ */ jsx("p", {
								className: "headline mt-1 text-[17px] font-bold leading-[1.32] tracking-normal text-foreground group-hover:underline line-clamp-3",
								children: p2 ? p2.title : "Economic Trends and Growth Outlook"
							}),
							/* @__PURE__ */ jsx("p", {
								className: "mt-2 text-[14px] leading-relaxed text-muted-foreground line-clamp-3",
								children: p2 ? p2.excerpt || p2.content?.replace(/<[^>]*>/g, "").slice(0, 150) + "..." : "Key factors driving market momentum and policy adjustments across sectors."
							})
						]
					}),
					/* @__PURE__ */ jsxs(Link, {
						to: "/news/$slug",
						params: { slug: p3?.slug || "global-markets-review" },
						className: "group block",
						children: [/* @__PURE__ */ jsx("p", {
							className: "headline text-[17px] font-bold leading-[1.32] tracking-normal text-foreground group-hover:underline line-clamp-2",
							children: p3 ? p3.title : "Global Financial Markets Review"
						}), /* @__PURE__ */ jsx("p", {
							className: "mt-2 text-[14px] leading-relaxed text-muted-foreground line-clamp-5",
							children: p3 ? p3.excerpt || p3.content?.replace(/<[^>]*>/g, "").slice(0, 150) + "..." : "Examining market infrastructure, cross-border flows, and financial technology innovation."
						})]
					})
				]
			})
		]
	});
}
//#endregion
export { MarketsMagazine };
