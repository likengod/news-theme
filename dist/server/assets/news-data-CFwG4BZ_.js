//#region src/assets/hero-markets.webp
var hero_markets_default = "/assets/hero-markets-WavlqySf.webp";
//#endregion
//#region src/assets/news-fed.webp
var news_fed_default = "/assets/news-fed-CllnTuZV.webp";
//#endregion
//#region src/assets/news-tech.webp
var news_tech_default = "/assets/news-tech-CjkNO1DQ.webp";
//#endregion
//#region src/assets/news-oil.webp
var news_oil_default = "/assets/news-oil-DaKXrycZ.webp";
//#endregion
//#region src/assets/news-crypto.webp
var news_crypto_default = "/assets/news-crypto-B2BHtksv.webp";
//#endregion
//#region src/assets/news-wallstreet.webp
var news_wallstreet_default = "/assets/news-wallstreet-DJMQpmDN.webp";
//#endregion
//#region src/assets/news-trade.webp
var news_trade_default = "/assets/news-trade-D9A0e6jf.webp";
//#endregion
//#region src/lib/news-data.ts
var tickers = [
	{
		sym: "NIFTY 50",
		val: "24,320.15",
		chg: "+0.52%",
		up: true
	},
	{
		sym: "SENSEX",
		val: "80,120.45",
		chg: "+0.48%",
		up: true
	},
	{
		sym: "NIFTY BANK",
		val: "52,450.80",
		chg: "+0.65%",
		up: true
	},
	{
		sym: "USD/INR",
		val: "83.54",
		chg: "-0.05%",
		up: false
	},
	{
		sym: "EUR/INR",
		val: "91.02",
		chg: "+0.12%",
		up: true
	},
	{
		sym: "GOLD (MCX)",
		val: "₹72,450",
		chg: "+0.78%",
		up: true
	},
	{
		sym: "SILVER (MCX)",
		val: "₹88,210",
		chg: "+1.05%",
		up: true
	},
	{
		sym: "CRUDE OIL (MCX)",
		val: "₹6,520",
		chg: "-1.12%",
		up: false
	},
	{
		sym: "BSE MIDCAP",
		val: "47,150.30",
		chg: "+0.35%",
		up: true
	},
	{
		sym: "BSE SMALLCAP",
		val: "53,890.90",
		chg: "+0.28%",
		up: true
	}
];
var sections = [
	"Northeast",
	"Breaking",
	"Global",
	"Politics",
	"Business",
	"Crime",
	"Tech",
	"Sports",
	"Opinion",
	"Others"
];
var lead = {
	kicker: "Breaking · Federal Reserve",
	title: "Fed Signals Pause on Cuts as Inflation Reignites in Core Services",
	dek: "Chair Powell delivered the central bank's most hawkish message of the year, warning that the path to 2% has become 'bumpier than anticipated' and that further easing is no longer a foregone conclusion for the first half.",
	author: "By Marcus Hale",
	time: "12 min ago",
	img: hero_markets_default,
	views: 184320
};
var top = [
	{
		kicker: "Wall Street",
		title: "Goldman, JPMorgan Beat as Trading Desks Rake in Record Quarter",
		time: "34 min ago",
		img: news_wallstreet_default,
		views: 42118
	},
	{
		kicker: "Energy",
		title: "Brent Slides Below $74 as OPEC+ Eyes Earlier Supply Return",
		time: "1 hr ago",
		img: news_oil_default,
		views: 28940
	},
	{
		kicker: "Crypto",
		title: "Bitcoin Tags Fresh High as Spot ETF Inflows Cross $50B Mark",
		time: "2 hr ago",
		img: news_crypto_default,
		views: 91207
	}
];
var grid = [
	{
		kicker: "Technology",
		title: "Nvidia's Blackwell Surge Pushes Hyperscaler Capex to $320B",
		excerpt: "Demand for AI accelerators is reshaping the data-center supply chain heading into 2026.",
		img: news_tech_default,
		author: "Priya Anand",
		views: 61204
	},
	{
		kicker: "Trade",
		title: "Pacific Container Rates Whipsaw on Tariff Truce Speculation",
		excerpt: "Shippers are racing to front-load Q1 orders before policy clarity arrives from Washington.",
		img: news_trade_default,
		author: "Diego Ruiz",
		views: 17880
	},
	{
		kicker: "Policy",
		title: "ECB Holds, but Lagarde Opens Door to a Spring Move",
		excerpt: "Frankfurt's dovish pivot lifted European banks while euro weakness extended a third week.",
		img: news_fed_default,
		author: "Sofia Albrecht",
		views: 23541
	}
];
function formatViews(n) {
	if (n >= 1e6) return (n / 1e6).toFixed(1).replace(/\.0$/, "") + "M";
	if (n >= 1e3) return (n / 1e3).toFixed(1).replace(/\.0$/, "") + "K";
	return String(n);
}
function viewsFor(seed) {
	let h = 0;
	for (let i = 0; i < seed.length; i++) h = h * 31 + seed.charCodeAt(i) | 0;
	return 1200 + Math.abs(h) % 48e4;
}
function slugify(input) {
	return input.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "").slice(0, 80) || "sample";
}
var LOCAL_IMAGES = [
	hero_markets_default,
	news_fed_default,
	news_tech_default,
	news_oil_default,
	news_crypto_default,
	news_wallstreet_default,
	news_trade_default
];
function getArticleImage(img, index) {
	if (!img || img === "/placeholder.svg" || img.includes("placeholder")) return LOCAL_IMAGES[(index ?? 0) % LOCAL_IMAGES.length];
	return img;
}
//#endregion
export { sections as a, top as c, news_wallstreet_default as d, news_crypto_default as f, hero_markets_default as g, news_fed_default as h, lead as i, viewsFor as l, news_tech_default as m, getArticleImage as n, slugify as o, news_oil_default as p, grid as r, tickers as s, formatViews as t, news_trade_default as u };

//# sourceMappingURL=news-data-CFwG4BZ_.js.map