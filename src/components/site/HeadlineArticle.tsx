import { viewsFor } from "@/lib/news-data";
import { Views } from "./Views";
import type { Item } from "@/lib/mock-news-data";
import { Link } from "@tanstack/react-router";

const AUTHORS = ["Claire Bennett", "Lucas Hayes", "Maya Chen", "Daniel Cole", "Priya Raman", "Noah Whitfield"];
function authorFor(seed?: string) {
  if (!seed) return AUTHORS[0];
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return AUTHORS[h % AUTHORS.length];
}

export function MinRead({ seed, kicker }: { seed?: string; kicker?: string }) {
  return (
    <span className="mt-3 inline-flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-muted-foreground">
      <span className="font-medium text-foreground">By {authorFor(seed)}</span>
      {seed && <Views count={viewsFor(seed)} />}
      {kicker && <span className="kicker whitespace-nowrap text-[10px]">{kicker}</span>}
    </span>
  );
}

export function HeadlineArticle({ item, dense = false }: { item: Item & { slug?: string }; dense?: boolean }) {
  return (
    <Link to="/news/$slug" params={{ slug: item.slug || "sample" }} className="group block">
      {item.img && (
        <div className="mb-3 overflow-hidden">
          <img
            src={item.img}
            alt={item.title}
            loading="lazy"
            className="aspect-[16/10] w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      )}
      <h3 className={`headline text-foreground group-hover:underline ${dense ? "text-lg" : "text-xl"}`}>
        {item.title}
      </h3>
      {item.excerpt && (
        <p className="mt-2 line-clamp-2 text-sm leading-snug text-muted-foreground">{item.excerpt}</p>
      )}
      <MinRead seed={item.title} kicker={item.kicker} />
    </Link>
  );
}
