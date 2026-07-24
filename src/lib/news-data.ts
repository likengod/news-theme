import heroImg from "@/assets/hero-markets.jpg";
import fedImg from "@/assets/news-fed.jpg";
import techImg from "@/assets/news-tech.jpg";
import oilImg from "@/assets/news-oil.jpg";
import cryptoImg from "@/assets/news-crypto.jpg";
import wsImg from "@/assets/news-wallstreet.jpg";
import tradeImg from "@/assets/news-trade.jpg";

export const tickers = [
  { sym: "NIFTY 50", val: "24,320.15", chg: "+0.52%", up: true },
  { sym: "SENSEX", val: "80,120.45", chg: "+0.48%", up: true },
  { sym: "NIFTY BANK", val: "52,450.80", chg: "+0.65%", up: true },
  { sym: "USD/INR", val: "83.54", chg: "-0.05%", up: false },
  { sym: "EUR/INR", val: "91.02", chg: "+0.12%", up: true },
  { sym: "GOLD (MCX)", val: "₹72,450", chg: "+0.78%", up: true },
  { sym: "SILVER (MCX)", val: "₹88,210", chg: "+1.05%", up: true },
  { sym: "CRUDE OIL (MCX)", val: "₹6,520", chg: "-1.12%", up: false },
  { sym: "BSE MIDCAP", val: "47,150.30", chg: "+0.35%", up: true },
  { sym: "BSE SMALLCAP", val: "53,890.90", chg: "+0.28%", up: true },
];

export const sections = ["Northeast", "Country", "Global", "Politics", "Business", "Crime", "Tech", "Sports", "Opinion", "Others"];

export const lead = {
  kicker: "Breaking · Federal Reserve",
  title: "Fed Signals Pause on Cuts as Inflation Reignites in Core Services",
  dek: "Chair Powell delivered the central bank's most hawkish message of the year, warning that the path to 2% has become 'bumpier than anticipated' and that further easing is no longer a foregone conclusion for the first half.",
  author: "By Marcus Hale",
  time: "12 min ago",
  img: heroImg,
  views: 184320,
};

export const top = [
  { kicker: "Wall Street", title: "Goldman, JPMorgan Beat as Trading Desks Rake in Record Quarter", time: "34 min ago", img: wsImg, views: 42118 },
  { kicker: "Energy", title: "Brent Slides Below $74 as OPEC+ Eyes Earlier Supply Return", time: "1 hr ago", img: oilImg, views: 28940 },
  { kicker: "Crypto", title: "Bitcoin Tags Fresh High as Spot ETF Inflows Cross $50B Mark", time: "2 hr ago", img: cryptoImg, views: 91207 },
];

export const grid = [
  { kicker: "Technology", title: "Nvidia's Blackwell Surge Pushes Hyperscaler Capex to $320B", excerpt: "Demand for AI accelerators is reshaping the data-center supply chain heading into 2026.", img: techImg, author: "Priya Anand", views: 61204 },
  { kicker: "Trade", title: "Pacific Container Rates Whipsaw on Tariff Truce Speculation", excerpt: "Shippers are racing to front-load Q1 orders before policy clarity arrives from Washington.", img: tradeImg, author: "Diego Ruiz", views: 17880 },
  { kicker: "Policy", title: "ECB Holds, but Lagarde Opens Door to a Spring Move", excerpt: "Frankfurt's dovish pivot lifted European banks while euro weakness extended a third week.", img: fedImg, author: "Sofia Albrecht", views: 23541 },
];

export const opinion = [
  { author: "Ellis Quan", role: "Markets Editor", title: "The 'Soft Landing' Trade Is Now the Most Crowded Bet on the Street." },
  { author: "Rina Okafor", role: "Chief Economist", title: "Why a Hotter Yen Would Actually Be Bullish for Global Risk." },
  { author: "Jonas Vega", role: "Tech Columnist", title: "The OpenAI Compute Bubble Has One Very Real Bottleneck: Power." },
];

export const mostRead: { title: string; views: number }[] = [
  { title: "Buffett's Cash Pile Hits $325B — Here's What He's Waiting For", views: 312045 },
  { title: "China's Stimulus Bazooka, Decoded in Six Charts", views: 248930 },
  { title: "The Quiet Comeback of the 60/40 Portfolio", views: 198440 },
  { title: "Inside Citadel's Best Year Since 2022", views: 156712 },
  { title: "Tesla's Robotaxi Day, Two Months Later: A Reality Check", views: 142308 },
];

export function formatViews(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1).replace(/\.0$/, "") + "K";
  return String(n);
}

// Deterministic pseudo view count from a string seed (e.g. title)
export function viewsFor(seed: string): number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) | 0;
  const n = Math.abs(h) % 480_000;
  return 1_200 + n;
}


/** Canonical article shape used across components. */
export interface Article {
  slug?: string;
  kicker?: string;
  title: string;
  excerpt?: string;
  author?: string;
  time?: string;
  img?: string;
  views: number;
}

export function slugify(input: string): string {
  return (
    input
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
      .slice(0, 80) || "sample"
  );
}

const LOCAL_IMAGES = [heroImg, fedImg, techImg, oilImg, cryptoImg, wsImg, tradeImg];

export function getArticleImage(img?: string, index?: number): string {
  if (!img || img === "/placeholder.svg" || img.includes("placeholder")) {
    const idx = (index ?? 0) % LOCAL_IMAGES.length;
    return LOCAL_IMAGES[idx];
  }
  return img;
}

