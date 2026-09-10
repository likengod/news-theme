import { C as hero_markets_default, S as news_fed_default, _ as news_trade_default, b as news_oil_default, c as formatViews, g as viewsFor, p as slugify, v as news_wallstreet_default, x as news_tech_default, y as news_crypto_default } from "./db.server-KusBKFrP.js";
import { useMemo } from "react";
import { Link } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
//#region src/components/site/RelatedNews.tsx
var POOL = [
	{
		title: "Fed Signals Pause on Cuts as Inflation Reignites in Core Services",
		img: news_fed_default,
		kicker: "Business"
	},
	{
		title: "Bitcoin Tags Fresh High as Spot ETF Inflows Cross $50B Mark",
		img: news_crypto_default,
		kicker: "Crypto"
	},
	{
		title: "Nvidia's Blackwell Surge Pushes Hyperscaler Capex to $320B",
		img: news_tech_default,
		kicker: "Tech"
	},
	{
		title: "Goldman, JPMorgan Beat as Trading Desks Rake in Record Quarter",
		img: news_wallstreet_default,
		kicker: "Markets"
	},
	{
		title: "Brent Slides Below $74 as OPEC+ Eyes Earlier Supply Return",
		img: news_oil_default,
		kicker: "Energy"
	},
	{
		title: "Pacific Container Rates Whipsaw on Tariff Truce Speculation",
		img: news_trade_default,
		kicker: "Global"
	},
	{
		title: "ECB Holds but Lagarde Opens Door to a Spring Move",
		img: hero_markets_default,
		kicker: "Policy"
	}
];
function RelatedNews({ currentSlug }) {
	const items = useMemo(() => POOL.filter((p) => slugify(p.title) !== currentSlug).slice(0, 4), [currentSlug]);
	return /* @__PURE__ */ jsxs("section", {
		className: "mt-12 border-t border-border pt-6",
		children: [/* @__PURE__ */ jsx("h3", {
			className: "mb-5 headline font-serif text-2xl font-bold text-primary",
			children: "Related News"
		}), /* @__PURE__ */ jsx("div", {
			className: "grid grid-cols-2 gap-6 md:grid-cols-4",
			children: items.map((it) => {
				const slug = slugify(it.title);
				const views = viewsFor(slug);
				return /* @__PURE__ */ jsxs(Link, {
					to: "/news/$slug",
					params: { slug },
					className: "group block",
					children: [
						/* @__PURE__ */ jsx("div", {
							className: "overflow-hidden",
							children: /* @__PURE__ */ jsx("img", {
								src: it.img,
								alt: it.title,
								loading: "lazy",
								decoding: "async",
								className: "aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-105"
							})
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "mt-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground",
							children: [
								it.kicker,
								" · ",
								formatViews(views),
								" views"
							]
						}),
						/* @__PURE__ */ jsx("h4", {
							className: "mt-1 line-clamp-2 headline font-serif text-[15px] font-bold leading-snug text-primary group-hover:underline",
							children: it.title
						})
					]
				}, slug);
			})
		})]
	});
}
//#endregion
export { RelatedNews, RelatedNews as default };
