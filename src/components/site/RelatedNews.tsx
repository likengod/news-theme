import { useMemo } from "react";
import { Link } from "@tanstack/react-router";
import { slugify, viewsFor, formatViews } from "@/lib/news-data";
import heroImg from "@/assets/hero-markets.jpg";
import fedImg from "@/assets/news-fed.jpg";
import techImg from "@/assets/news-tech.jpg";
import oilImg from "@/assets/news-oil.jpg";
import cryptoImg from "@/assets/news-crypto.jpg";
import wsImg from "@/assets/news-wallstreet.jpg";
import tradeImg from "@/assets/news-trade.jpg";

const POOL = [
  { title: "Fed Signals Pause on Cuts as Inflation Reignites in Core Services", img: fedImg, kicker: "Business" },
  { title: "Bitcoin Tags Fresh High as Spot ETF Inflows Cross $50B Mark", img: cryptoImg, kicker: "Crypto" },
  { title: "Nvidia's Blackwell Surge Pushes Hyperscaler Capex to $320B", img: techImg, kicker: "Tech" },
  { title: "Goldman, JPMorgan Beat as Trading Desks Rake in Record Quarter", img: wsImg, kicker: "Markets" },
  { title: "Brent Slides Below $74 as OPEC+ Eyes Earlier Supply Return", img: oilImg, kicker: "Energy" },
  { title: "Pacific Container Rates Whipsaw on Tariff Truce Speculation", img: tradeImg, kicker: "Global" },
  { title: "ECB Holds but Lagarde Opens Door to a Spring Move", img: heroImg, kicker: "Policy" },
];

export function RelatedNews({ currentSlug }: { currentSlug?: string }) {
  const items = useMemo(
    () => POOL.filter((p) => slugify(p.title) !== currentSlug).slice(0, 4),
    [currentSlug],
  );

  return (
    <section className="mt-12 border-t border-border pt-6">
      <h3 className="mb-5 headline font-serif text-2xl font-bold text-primary">Related News</h3>
      <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
        {items.map((it) => {
          const slug = slugify(it.title);
          const views = viewsFor(slug);
          return (
            <Link
              key={slug}
              to="/news/$slug"
              params={{ slug }}
              className="group block"
            >
              <div className="overflow-hidden">
                <img
                  src={it.img}
                  alt={it.title}
                  loading="lazy"
                  decoding="async"
                  className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="mt-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                {it.kicker} · {formatViews(views)} views
              </div>
              <h4 className="mt-1 line-clamp-2 headline font-serif text-[15px] font-bold leading-snug text-primary group-hover:underline">
                {it.title}
              </h4>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

export default RelatedNews;
