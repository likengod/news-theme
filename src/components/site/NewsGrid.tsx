import React, { useMemo } from "react";
import techImg from "@/assets/news-tech.jpg";
import tradeImg from "@/assets/news-trade.jpg";
import fedImg from "@/assets/news-fed.jpg";
import wsImg from "@/assets/news-wallstreet.jpg";
import cryptoImg from "@/assets/news-crypto.jpg";
import { useHomepageConfig } from "@/hooks/use-homepage-config";
import { articlesByCategory } from "@/lib/homepage-config";
import { getArticleImage } from "@/lib/news-data";
import { Link } from "@tanstack/react-router";

type Column = {
  img: string;
  hasVideo?: boolean;
  lead: string;
  slug?: string;
  items: { title: string; slug?: string }[];
};

const baseColumns: Column[] = [
  {
    img: techImg,
    lead: "It's Never Been More Expensive to Visit New York City",
    items: [
      { title: "Climate protest crackdown shows how wrong the GOP is about free speech" },
      { title: "Guard Dogs Protect Sheep From Prowling Puma In First Of Its Kind Footage" },
      { title: "Senserit eos ea tation quidam posidonium eam" },
      { title: "UN warns of widening humanitarian crisis across Sahel region" },
      { title: "Tokyo housing market hits record highs as foreign buyers pile in" },
    ],
  },
  {
    img: tradeImg,
    hasVideo: true,
    lead: "Right-Wing House Republicans Derail Pentagon G.O.P.",
    items: [
      { title: "Sententiae epicuri concludaturque ius no Id mucius" },
      { title: "Art for the Millions at Metropolitan Museum review" },
      { title: "Senate moves to block sweeping new tariff package" },
      { title: "Governors push back on federal voting rule overhaul" },
      { title: "Bipartisan group floats compromise on border funding" },
    ],
  },
  {
    img: fedImg,
    lead: "Artist / Teacher in Classical Voice job with us",
    items: [
      { title: "Solum graeco vel at Has ad alienum" },
      { title: "A state campsite reservation bill heads for the governors desk" },
      { title: "Global economic growth forecasts slashed, as world struggles with high inflation" },
      { title: "Why the four-day workweek debate is finally getting serious" },
      { title: "The quiet return of the American downtown" },
    ],
  },
  {
    img: wsImg,
    lead: "Solum graeco vel at Has ad alienum",
    items: [
      { title: "How Sarah Coped Her Chronic Disease" },
      { title: "Future of Contemporary Art" },
      { title: "Extra $2.50 for half a prawn?" },
      { title: "Indie bookstores are quietly out-selling the chains again" },
      { title: "Streaming's next battleground: live theater on demand" },
    ],
  },
  {
    img: cryptoImg,
    lead: "Future of Contemporary Art",
    items: [
      { title: "How VR Has Changed The World?" },
      { title: "Why postpartum depression went untreated for thousands of years" },
      { title: "Art for the Millions at Metropolitan Museum review" },
      { title: "A new generation of muralists is repainting the Bronx" },
      { title: "Inside the auction rooms betting on emerging African artists" },
    ],
  },
];

export const NewsGrid = React.memo(function NewsGrid({ articles = [], usedIds }: { articles?: any[]; usedIds?: Set<number> }) {
  const cfg = useHomepageConfig();
  const hasDbArticles = articles.length > 0;

  const articlesByCategoryName = useMemo(() => {
    const m = new Map<string, any[]>();
    for (const a of articles) {
      const cat = (a.category || "Others").toLowerCase().trim();
      const existing = m.get(cat) || [];
      existing.push(a);
      m.set(cat, existing);
    }
    return m;
  }, [articles]);

  const columns = useMemo(() => {
    const localUsed = new Set<number>(usedIds);

    return baseColumns.map((c, i) => {
      const colCfg = cfg.newsGridColumns[i];
      const cat = colCfg?.category;
      
      if (hasDbArticles && cat) {
        const normalizedCat = (cat === "Auto (Latest)" ? "northeast" : cat).toLowerCase().trim();
        const allCatArticles = articlesByCategoryName.get(normalizedCat) || [];

        // 1. Unused category articles
        let matches = allCatArticles.filter(a => !localUsed.has(a.id));

        // 2. If fewer than 7, include previously used category articles
        if (matches.length < 7) {
          const usedCatArticles = allCatArticles.filter(a => localUsed.has(a.id));
          for (const u of usedCatArticles) {
            if (!matches.some(m => m.id === u.id)) {
              matches.push(u);
            }
            if (matches.length >= 7) break;
          }
        }

        // 3. If still fewer than 7, fallback to any general homepage articles
        if (matches.length < 7) {
          const fallbacks = articles.filter(a => !matches.some(m => m.id === a.id));
          for (const f of fallbacks) {
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
            items: rest.map((a) => ({ title: a.title, slug: a.slug })),
          };
        }
      }
      return {
        ...c,
        slug: "sample",
        items: c.items.map((it) => ({ ...it, slug: "sample" })),
      };
    });
  }, [articles, cfg.newsGridColumns, hasDbArticles, articlesByCategoryName, usedIds]);

  return (
    <section className="border-t border-border py-10">
      <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-3 lg:grid-cols-5">
        {columns.map((col, i) => {
          const colCfg = cfg.newsGridColumns[i];
          return (
            <div key={i} className="flex flex-col">
              <h3
                className="mb-3 font-extrabold uppercase tracking-widest"
                style={{ color: colCfg.color, fontSize: `${colCfg.fontSize}px` }}
              >
                {colCfg.title}
              </h3>
              <Link to="/news/$slug" params={{ slug: col.slug || "sample" }} className="group block">
                <div className="relative overflow-hidden">
                  <img
                    src={col.img}
                    alt={col.lead}
                    loading="lazy"
                    decoding="async"
                    className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {col.hasVideo && (
                    <span className="absolute inset-0 flex items-center justify-center">
                      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-white">
                        <svg viewBox="0 0 24 24" fill="currentColor" className="ml-0.5 h-4 w-4">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </span>
                    </span>
                  )}
                </div>
                <p className="mt-3 line-clamp-2 overflow-hidden font-serif text-[17px] font-bold leading-snug text-primary group-hover:underline">
                  {col.lead}
                </p>
              </Link>
              <ul className="mt-3 space-y-3 border-t border-border pt-3">
                {col.items.map((item, idx) => (
                  <li key={`${item.slug || 'item'}-${idx}`}>
                    <Link
                      to="/news/$slug" params={{ slug: item.slug || "sample" }}
                      className="block line-clamp-2 overflow-hidden font-serif text-[15px] font-semibold leading-snug text-primary hover:underline"
                    >
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </section>
  );
});
