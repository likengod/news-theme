import { a as e, i as t, n, o as r, r as i, t as a } from "./hero-markets-DsSniPpX.js";
var o = `/assets/news-trade-DSkY3eE1.jpg`,
  s = [
    { sym: `NIFTY 50`, val: `24,320.15`, chg: `+0.52%`, up: !0 },
    { sym: `SENSEX`, val: `80,120.45`, chg: `+0.48%`, up: !0 },
    { sym: `NIFTY BANK`, val: `52,450.80`, chg: `+0.65%`, up: !0 },
    { sym: `USD/INR`, val: `83.54`, chg: `-0.05%`, up: !1 },
    { sym: `EUR/INR`, val: `91.02`, chg: `+0.12%`, up: !0 },
    { sym: `GOLD (MCX)`, val: `₹72,450`, chg: `+0.78%`, up: !0 },
    { sym: `SILVER (MCX)`, val: `₹88,210`, chg: `+1.05%`, up: !0 },
    { sym: `CRUDE OIL (MCX)`, val: `₹6,520`, chg: `-1.12%`, up: !1 },
    { sym: `BSE MIDCAP`, val: `47,150.30`, chg: `+0.35%`, up: !0 },
    { sym: `BSE SMALLCAP`, val: `53,890.90`, chg: `+0.28%`, up: !0 },
  ],
  c = [
    `Northeast`,
    `Breaking`,
    `Global`,
    `Politics`,
    `Business`,
    `Crime`,
    `Tech`,
    `Sports`,
    `Opinion`,
    `Others`,
  ],
  l = {
    kicker: `Breaking · Federal Reserve`,
    title: `Fed Signals Pause on Cuts as Inflation Reignites in Core Services`,
    dek: `Chair Powell delivered the central bank's most hawkish message of the year, warning that the path to 2% has become 'bumpier than anticipated' and that further easing is no longer a foregone conclusion for the first half.`,
    author: `By Marcus Hale`,
    time: `12 min ago`,
    img: a,
    views: 184320,
  },
  u = [
    {
      kicker: `Wall Street`,
      title: `Goldman, JPMorgan Beat as Trading Desks Rake in Record Quarter`,
      time: `34 min ago`,
      img: n,
      views: 42118,
    },
    {
      kicker: `Energy`,
      title: `Brent Slides Below $74 as OPEC+ Eyes Earlier Supply Return`,
      time: `1 hr ago`,
      img: r,
      views: 28940,
    },
    {
      kicker: `Crypto`,
      title: `Bitcoin Tags Fresh High as Spot ETF Inflows Cross $50B Mark`,
      time: `2 hr ago`,
      img: i,
      views: 91207,
    },
  ],
  d = [
    {
      kicker: `Technology`,
      title: `Nvidia's Blackwell Surge Pushes Hyperscaler Capex to $320B`,
      excerpt: `Demand for AI accelerators is reshaping the data-center supply chain heading into 2026.`,
      img: t,
      author: `Priya Anand`,
      views: 61204,
    },
    {
      kicker: `Trade`,
      title: `Pacific Container Rates Whipsaw on Tariff Truce Speculation`,
      excerpt: `Shippers are racing to front-load Q1 orders before policy clarity arrives from Washington.`,
      img: o,
      author: `Diego Ruiz`,
      views: 17880,
    },
    {
      kicker: `Policy`,
      title: `ECB Holds, but Lagarde Opens Door to a Spring Move`,
      excerpt: `Frankfurt's dovish pivot lifted European banks while euro weakness extended a third week.`,
      img: e,
      author: `Sofia Albrecht`,
      views: 23541,
    },
  ];
function f(e) {
  return e >= 1e6
    ? (e / 1e6).toFixed(1).replace(/\.0$/, ``) + `M`
    : e >= 1e3
      ? (e / 1e3).toFixed(1).replace(/\.0$/, ``) + `K`
      : String(e);
}
function p(e) {
  let t = 0;
  for (let n = 0; n < e.length; n++) t = (t * 31 + e.charCodeAt(n)) | 0;
  return 1200 + (Math.abs(t) % 48e4);
}
function m(e) {
  return (
    e
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, `-`)
      .replace(/(^-|-$)/g, ``)
      .slice(0, 80) || `sample`
  );
}
var h = [a, e, t, r, i, n, o];
function g(e, t) {
  return !e || e === `/placeholder.svg` || e.includes(`placeholder`) ? h[(t ?? 0) % h.length] : e;
}
export { c as a, u as c, l as i, p as l, g as n, m as o, d as r, s, f as t, o as u };
