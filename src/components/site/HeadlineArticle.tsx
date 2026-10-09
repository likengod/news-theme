import { Views } from "./Views";
import type { Item } from "@/lib/mock-news-data";
import { Link } from "@tanstack/react-router";
import { getArticleImage } from "@/lib/news-data";

export function MinRead({
  seed,
  kicker,
  author,
  views,
}: {
  seed?: string;
  kicker?: string;
  author?: string;
  views?: number;
}) {
  const displayAuthor = author
    ? (author.startsWith("By ") ? author.replace(/^By\s+/i, "") : author)
    : "Admin User";
  const displayViews = typeof views === "number" ? views : (views ? Number(views) : 0);

  return (
    <span className="mt-3 inline-flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-muted-foreground">
      <span className="font-medium text-foreground">By {displayAuthor}</span>
      <Views count={displayViews} />
      {kicker && <span className="kicker whitespace-nowrap text-[10px]">{kicker}</span>}
    </span>
  );
}

export function HeadlineArticle({
  item,
  dense = false,
  priority = false,
}: {
  item: any;
  dense?: boolean;
  priority?: boolean;
}) {
  if (!item) return null;
  return (
    <Link
      to="/news/$slug"
      params={{ slug: item.slug || "sample" }}
      className="group block"
      suppressHydrationWarning
    >
      {item.img && (
        <div className="mb-3 overflow-hidden">
          <img
            src={item.img}
            alt=""
            aria-hidden="true"
            loading="lazy"
            fetchPriority="auto"
            decoding="async"
            width={400}
            height={250}
            onError={(e) => {
              const el = e.currentTarget;
              el.onerror = null;
              el.src = getArticleImage(undefined, 1);
            }}
            className="aspect-[16/10] w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      )}
      <h3
        className={`headline text-foreground group-hover:underline ${dense ? "text-lg" : "text-xl"}`}
        suppressHydrationWarning
      >
        {item.title}
      </h3>
      {item.excerpt && (
        <p className="mt-2 line-clamp-2 text-sm leading-snug text-muted-foreground">
          {item.excerpt}
        </p>
      )}
      <MinRead seed={item.title} kicker={item.kicker} author={item.author} views={item.views} />
    </Link>
  );
}
