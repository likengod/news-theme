import { m as loadSettings } from "./site-content-D1yh80Dh.js";
import { t as Advertisement } from "./Advertisement-BENDILJn.js";
import { t as Views } from "./Views-DJ1173PA.js";
import { t as Footer } from "./Footer-D8Pzg3bN.js";
import { t as Header } from "./Header-BuIkinSK.js";
import { t as Route } from "./_slug-BVQtnKVf.js";
import { t as ArchiveFinder } from "./ArchiveFinder-CRW_hGql.js";
import React, { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { Share2, User } from "lucide-react";
//#region src/routes/$slug.tsx?tsr-split=component
var FESTIVE_GRADIENT_MAP = {
	"indian-flag": "linear-gradient(to right, #FF9933, #000080, #138808)",
	"diwali": "linear-gradient(to right, #FF8008, #FFC837, #FF007F, #7F00FF)",
	"sunset": "linear-gradient(to right, #F5576C, #F093FB)",
	"neon": "linear-gradient(to right, #FF007F, #7F00FF, #00F0FF)",
	"ocean": "linear-gradient(to right, #00c6ff, #0072ff)",
	"forest": "linear-gradient(to right, #11998e, #38ef7d)"
};
var FONT_FAMILY_MAP = {
	inter: "\"Inter\", system-ui, sans-serif",
	serif: "Georgia, Cambria, \"Times New Roman\", Times, serif",
	cinzel: "\"Cinzel\", serif, Georgia",
	playfair: "\"Playfair Display\", Georgia, serif",
	roboto: "\"Roboto\", Arial, sans-serif",
	mono: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace"
};
var SLUG_ROTATION_KEYFRAMES = `
@keyframes rot-slide-up   { from { opacity:0; transform: translateY(60px);  } to { opacity:1; transform: translateY(0); } }
@keyframes rot-slide-down { from { opacity:0; transform: translateY(-60px); } to { opacity:1; transform: translateY(0); } }
@keyframes rot-slide-left { from { opacity:0; transform: translateX(80px);  } to { opacity:1; transform: translateX(0); } }
@keyframes rot-slide-right{ from { opacity:0; transform: translateX(-80px); } to { opacity:1; transform: translateX(0); } }
@keyframes rot-fade       { from { opacity:0;                                } to { opacity:1;                         } }
@keyframes rot-zoom       { from { opacity:0; transform: scale(0.6);         } to { opacity:1; transform: scale(1);   } }
@keyframes rot-flip       { from { opacity:0; transform: rotateX(90deg);     } to { opacity:1; transform: rotateX(0); } }
`;
var TEXT_ROTATION_CSS = {
	"slide-up": { animation: "rot-slide-up    0.35s cubic-bezier(0.22,1,0.36,1) both" },
	"slide-down": { animation: "rot-slide-down  0.35s cubic-bezier(0.22,1,0.36,1) both" },
	"slide-left": { animation: "rot-slide-left  0.35s cubic-bezier(0.22,1,0.36,1) both" },
	"slide-right": { animation: "rot-slide-right 0.35s cubic-bezier(0.22,1,0.36,1) both" },
	"fade": { animation: "rot-fade        0.35s ease both" },
	"zoom": { animation: "rot-zoom        0.35s cubic-bezier(0.34,1.56,0.64,1) both" },
	"flip": { animation: "rot-flip        0.5s  cubic-bezier(0.22,1,0.36,1) both" }
};
function CategoryPage() {
	const loaderData = Route.useLoaderData();
	const page = Route.useSearch().page || 1;
	const [settings, setSettings] = useState(() => loadSettings());
	const [showCustomText, setShowCustomText] = useState(false);
	useEffect(() => {
		const handleUpdate = () => {
			setSettings(loadSettings());
		};
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
	if (!loaderData) return /* @__PURE__ */ jsx("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ jsxs("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ jsx("h1", {
					className: "text-xl font-semibold text-foreground",
					children: "Category not found"
				}),
				/* @__PURE__ */ jsx("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "The category you requested could not be located."
				}),
				/* @__PURE__ */ jsx(Link, {
					to: "/",
					className: "mt-6 inline-block rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground",
					children: "Back to home"
				})
			]
		})
	});
	const { category, featured, list, latest, totalPages = 1 } = loaderData;
	const categoryTitleStyle = settings.festiveCategoryTitleGradient && FESTIVE_GRADIENT_MAP[settings.festiveCategoryTitleGradient] ? {
		backgroundImage: FESTIVE_GRADIENT_MAP[settings.festiveCategoryTitleGradient],
		WebkitBackgroundClip: "text",
		WebkitTextFillColor: "transparent",
		backgroundClip: "text",
		display: "inline-block"
	} : settings.festiveCategoryTitleColor ? { color: settings.festiveCategoryTitleColor } : void 0;
	const isShowingCustomAlert = Boolean(settings.festiveThemeEnabled !== false && showCustomText && settings.topBarWeatherCustomText);
	const rotationAnimStyle = TEXT_ROTATION_CSS[settings.customAlertAnimationStyle || "slide-up"] || TEXT_ROTATION_CSS["slide-up"];
	const currentTitleStyle = {
		...categoryTitleStyle,
		...isShowingCustomAlert && settings.customAlertFontFamily ? { fontFamily: FONT_FAMILY_MAP[settings.customAlertFontFamily] || FONT_FAMILY_MAP["inter"] } : {}
	};
	return /* @__PURE__ */ jsxs("div", {
		className: "min-h-screen bg-background text-foreground",
		children: [
			/* @__PURE__ */ jsx("style", { dangerouslySetInnerHTML: { __html: SLUG_ROTATION_KEYFRAMES } }),
			/* @__PURE__ */ jsx(Header, {}),
			/* @__PURE__ */ jsxs("main", {
				className: "mx-auto max-w-7xl px-4 pt-2 pb-10",
				children: [
					/* @__PURE__ */ jsxs("header", {
						className: "border-b border-border pb-3 overflow-hidden",
						children: [
							/* @__PURE__ */ jsxs("nav", {
								className: "mb-1 flex items-center gap-1 text-[11px] uppercase tracking-widest text-muted-foreground",
								children: [
									/* @__PURE__ */ jsx(Link, {
										to: "/",
										className: "hover:text-foreground transition-colors",
										children: "Home"
									}),
									/* @__PURE__ */ jsx("span", {
										className: "mx-1",
										children: "/"
									}),
									/* @__PURE__ */ jsx("span", {
										className: "text-foreground font-semibold",
										children: category.name
									})
								]
							}),
							/* @__PURE__ */ jsx("h1", {
								className: `font-serif text-5xl font-bold md:text-6xl ${categoryTitleStyle ? "" : "text-foreground"}`,
								style: {
									...currentTitleStyle,
									...rotationAnimStyle
								},
								children: isShowingCustomAlert ? settings.topBarWeatherCustomText : category.name
							}, `${showCustomText ? "custom" : "default"}-${settings.customAlertAnimationStyle}`),
							/* @__PURE__ */ jsx("p", {
								className: "mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground",
								children: category.description
							})
						]
					}),
					featured.length > 0 && /* @__PURE__ */ jsx("section", {
						className: "grid grid-cols-1 gap-8 py-8 md:grid-cols-3",
						children: featured.map((f) => /* @__PURE__ */ jsxs("article", {
							className: "flex flex-col",
							children: [
								/* @__PURE__ */ jsx(Link, {
									to: `/news/${f.slug}`,
									className: "group block overflow-hidden",
									children: f.img ? /* @__PURE__ */ jsx("img", {
										src: f.img,
										alt: f.title,
										loading: "eager",
										fetchPriority: "high",
										width: 400,
										height: 300,
										className: "aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-105"
									}) : /* @__PURE__ */ jsx("div", {
										className: "aspect-[4/3] w-full bg-slate-100 flex items-center justify-center text-slate-400",
										children: "No Image"
									})
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "mt-3 flex flex-wrap items-center gap-2 text-[11px] font-semibold uppercase tracking-widest",
									children: [f.kickers.map((k) => /* @__PURE__ */ jsx("span", {
										className: "text-foreground",
										children: k
									}, k)), /* @__PURE__ */ jsxs("span", {
										className: "text-muted-foreground normal-case tracking-normal",
										children: ["· ", f.date]
									})]
								}),
								/* @__PURE__ */ jsx("h2", {
									className: "headline mt-2 font-serif text-xl font-bold leading-snug text-primary line-clamp-3",
									children: /* @__PURE__ */ jsx(Link, {
										to: `/news/${f.slug}`,
										className: "hover:underline",
										children: f.title
									})
								}),
								/* @__PURE__ */ jsx("p", {
									className: "mt-2 text-sm leading-relaxed text-muted-foreground line-clamp-5",
									children: f.excerpt
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "mt-3 flex items-center justify-between gap-2 text-[11px] text-muted-foreground",
									children: [/* @__PURE__ */ jsxs("div", {
										className: "flex items-center gap-2.5",
										children: [
											/* @__PURE__ */ jsxs("span", {
												className: "inline-flex items-center gap-1",
												children: [/* @__PURE__ */ jsx(User, { className: "h-3 w-3 shrink-0" }), /* @__PURE__ */ jsx("span", {
													className: "font-medium text-foreground",
													children: f.author
												})]
											}),
											/* @__PURE__ */ jsx("span", { children: "·" }),
											/* @__PURE__ */ jsx(Views, { count: f.views })
										]
									}), /* @__PURE__ */ jsxs("button", {
										type: "button",
										"aria-label": "Share article",
										onClick: (e) => {
											e.preventDefault();
											if (navigator.share) navigator.share({
												title: f.title,
												url: `/news/${f.slug}`
											});
											else {
												navigator.clipboard.writeText(window.location.origin + `/news/${f.slug}`);
												alert("Link copied!");
											}
										},
										className: "flex items-center gap-1 rounded-md border border-slate-200 px-2 py-1 text-[11px] text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition-colors",
										children: [/* @__PURE__ */ jsx(Share2, { className: "h-3 w-3" }), "Share"]
									})]
								})
							]
						}, f.title))
					}),
					featured.length === 0 && list.length === 0 && /* @__PURE__ */ jsx("p", {
						className: "py-10 text-center text-sm text-muted-foreground",
						children: "No articles in this category yet."
					}),
					list.length > 0 && /* @__PURE__ */ jsxs("section", {
						className: "grid grid-cols-1 gap-10 border-t border-border pt-8 lg:grid-cols-[1fr_300px]",
						children: [/* @__PURE__ */ jsx("div", {
							className: "divide-y divide-border",
							children: list.map((p, i) => /* @__PURE__ */ jsxs(React.Fragment, { children: [/* @__PURE__ */ jsxs("article", {
								className: "grid grid-cols-[140px_1fr] gap-5 py-6 first:pt-0 md:grid-cols-[200px_1fr]",
								children: [/* @__PURE__ */ jsx(Link, {
									to: `/news/${p.slug}`,
									className: "block overflow-hidden",
									children: p.img ? /* @__PURE__ */ jsx("img", {
										src: p.img,
										alt: p.title,
										className: "aspect-[4/3] w-full object-cover"
									}) : /* @__PURE__ */ jsx("div", {
										className: "aspect-[4/3] w-full bg-slate-100 flex items-center justify-center text-slate-400",
										children: "No Image"
									})
								}), /* @__PURE__ */ jsxs("div", { children: [
									/* @__PURE__ */ jsx("h3", {
										className: "headline font-serif text-lg font-bold leading-snug text-primary line-clamp-2",
										children: /* @__PURE__ */ jsx(Link, {
											to: `/news/${p.slug}`,
											className: "hover:underline",
											children: p.title
										})
									}),
									/* @__PURE__ */ jsx("p", {
										className: "mt-2 text-sm leading-relaxed text-muted-foreground line-clamp-2",
										children: p.excerpt
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] uppercase tracking-widest",
										children: [/* @__PURE__ */ jsx("span", {
											className: "text-muted-foreground normal-case tracking-normal",
											children: p.date
										}), p.tags.map((t) => /* @__PURE__ */ jsxs("span", {
											className: "font-semibold text-foreground",
											children: ["· ", t]
										}, t))]
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "mt-2 flex items-center justify-between gap-2 text-[11px] text-muted-foreground",
										children: [/* @__PURE__ */ jsxs("div", {
											className: "flex items-center gap-2.5",
											children: [
												/* @__PURE__ */ jsxs("span", {
													className: "inline-flex items-center gap-1",
													children: [/* @__PURE__ */ jsx(User, { className: "h-3 w-3 shrink-0" }), /* @__PURE__ */ jsx("span", {
														className: "font-medium text-foreground",
														children: p.author
													})]
												}),
												/* @__PURE__ */ jsx("span", { children: "·" }),
												/* @__PURE__ */ jsx(Views, { count: p.views })
											]
										}), /* @__PURE__ */ jsxs("button", {
											type: "button",
											"aria-label": "Share article",
											onClick: (e) => {
												e.preventDefault();
												if (navigator.share) navigator.share({
													title: p.title,
													url: `/news/${p.slug}`
												});
												else {
													navigator.clipboard.writeText(window.location.origin + `/news/${p.slug}`);
													alert("Link copied!");
												}
											},
											className: "flex items-center gap-1 rounded-md border border-slate-200 px-2 py-1 text-[11px] text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition-colors",
											children: [/* @__PURE__ */ jsx(Share2, { className: "h-3 w-3" }), "Share"]
										})]
									})
								] })]
							}), (i + 1) % 3 === 0 && /* @__PURE__ */ jsx("div", {
								className: "py-6",
								children: /* @__PURE__ */ jsx(Advertisement, {
									slot: "leaderboard",
									aspectRatio: "728 / 90"
								})
							})] }, p.title))
						}), /* @__PURE__ */ jsxs("aside", {
							className: "space-y-8",
							children: [
								latest.length > 0 && /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h4", {
									className: "mb-4 border-b-2 border-foreground pb-2 text-xs font-bold uppercase tracking-widest text-foreground",
									children: "Latest Posts"
								}), /* @__PURE__ */ jsx("ul", {
									className: "space-y-4",
									children: latest.map((l) => /* @__PURE__ */ jsxs("li", {
										className: "grid grid-cols-[1fr_72px] gap-3",
										children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx(Link, {
											to: `/news/${l.slug}`,
											className: "headline block font-serif text-sm font-bold leading-snug text-primary hover:underline line-clamp-2",
											children: l.title
										}), /* @__PURE__ */ jsx("p", {
											className: "mt-1 text-[11px] uppercase tracking-widest text-muted-foreground normal-case tracking-normal",
											children: l.date
										})] }), /* @__PURE__ */ jsx(Link, {
											to: `/news/${l.slug}`,
											className: "block overflow-hidden",
											children: l.img ? /* @__PURE__ */ jsx("img", {
												src: l.img,
												alt: l.title,
												className: "aspect-square w-full object-cover"
											}) : /* @__PURE__ */ jsx("div", {
												className: "aspect-square w-full bg-slate-100 flex items-center justify-center text-slate-400",
												children: "No Image"
											})
										})]
									}, l.title))
								})] }),
								/* @__PURE__ */ jsx(Advertisement, {
									slot: "ad3",
									aspectRatio: "3/4"
								}),
								/* @__PURE__ */ jsx(ArchiveFinder, {})
							]
						})]
					}),
					totalPages > 1 && /* @__PURE__ */ jsxs("div", {
						className: "mt-12 flex flex-wrap items-center justify-center gap-2 border-t border-border pt-8",
						children: [
							/* @__PURE__ */ jsx(Link, {
								to: "/$slug",
								params: { slug: category.slug },
								search: { page: Math.max(1, page - 1) },
								className: `rounded border border-border px-3 py-1.5 text-xs font-semibold uppercase tracking-wider ${page <= 1 ? "pointer-events-none opacity-40" : "hover:bg-muted text-foreground"}`,
								children: "Prev"
							}),
							Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => /* @__PURE__ */ jsx(Link, {
								to: "/$slug",
								params: { slug: category.slug },
								search: { page: p },
								className: `rounded px-3.5 py-1.5 text-xs font-bold transition-colors ${page === p ? "bg-foreground text-background font-black shadow-sm" : "border border-border text-foreground hover:bg-muted"}`,
								children: p
							}, p)),
							/* @__PURE__ */ jsx(Link, {
								to: "/$slug",
								params: { slug: category.slug },
								search: { page: Math.min(totalPages, page + 1) },
								className: `rounded border border-border px-3 py-1.5 text-xs font-semibold uppercase tracking-wider ${page >= totalPages ? "pointer-events-none opacity-40" : "hover:bg-muted text-foreground"}`,
								children: "Next"
							})
						]
					})
				]
			}),
			/* @__PURE__ */ jsx(Footer, {})
		]
	});
}
//#endregion
export { CategoryPage as component };
