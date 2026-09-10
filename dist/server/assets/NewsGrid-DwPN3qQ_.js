import { S as news_fed_default, _ as news_trade_default, l as getArticleImage, v as news_wallstreet_default, x as news_tech_default, y as news_crypto_default } from "./db.server-CLva-TlE.js";
import { t as useHomepageConfig } from "./use-homepage-config-Bx4jVpGi.js";
import React, { useMemo } from "react";
import { Link } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
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
			const cat = (a.category || "Others").toLowerCase().trim();
			const existing = m.get(cat) || [];
			existing.push(a);
			m.set(cat, existing);
		}
		return m;
	}, [articles]);
	return /* @__PURE__ */ jsx("section", {
		className: "border-t border-border py-10",
		children: /* @__PURE__ */ jsx("div", {
			className: "grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-3 lg:grid-cols-5",
			children: useMemo(() => {
				const localUsed = new Set(usedIds || []);
				return baseColumns.map((c, i) => {
					const cat = cfg.newsGridColumns[i]?.category;
					if (hasDbArticles && cat) {
						const normalizedCat = (cat === "Auto (Latest)" ? "northeast" : cat).toLowerCase().trim();
						const allCatArticles = articlesByCategoryName.get(normalizedCat) || [];
						let matches = allCatArticles.filter((a) => !localUsed.has(a.id));
						if (matches.length < 7) {
							const usedCatArticles = allCatArticles.filter((a) => localUsed.has(a.id));
							for (const u of usedCatArticles) {
								if (!matches.some((m) => m.id === u.id)) matches.push(u);
								if (matches.length >= 7) break;
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
			]).map((col, i) => {
				const colCfg = cfg.newsGridColumns[i];
				return /* @__PURE__ */ jsxs("div", {
					className: "flex flex-col",
					children: [
						/* @__PURE__ */ jsx("h3", {
							className: "mb-3 font-extrabold uppercase tracking-widest",
							style: {
								color: colCfg.color,
								fontSize: `${colCfg.fontSize}px`
							},
							children: colCfg.title
						}),
						/* @__PURE__ */ jsxs(Link, {
							to: "/news/$slug",
							params: { slug: col.slug || "sample" },
							className: "group block",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "relative overflow-hidden",
								children: [/* @__PURE__ */ jsx("img", {
									src: col.img,
									alt: col.lead,
									loading: "lazy",
									decoding: "async",
									className: "aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-105"
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
							}), /* @__PURE__ */ jsx("p", {
								className: "mt-3 line-clamp-2 overflow-hidden font-serif text-[17px] font-bold leading-snug text-primary group-hover:underline",
								children: col.lead
							})]
						}),
						/* @__PURE__ */ jsx("ul", {
							className: "mt-3 space-y-3 border-t border-border pt-3",
							children: col.items.map((item, idx) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(Link, {
								to: "/news/$slug",
								params: { slug: item.slug || "sample" },
								className: "block line-clamp-2 overflow-hidden font-serif text-[15px] font-semibold leading-snug text-primary hover:underline",
								children: item.title
							}) }, `${item.slug || "item"}-${idx}`))
						})
					]
				}, i);
			})
		})
	});
});
//#endregion
export { NewsGrid };
