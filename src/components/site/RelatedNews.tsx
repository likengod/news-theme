import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { getPublicRelatedArticles } from "@/lib/articles.functions";
import { formatViews } from "@/lib/news-data";

interface RelatedNewsProps {
  currentSlug?: string;
  category?: string;
}

export function RelatedNews({ currentSlug, category }: RelatedNewsProps) {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    if (!currentSlug) return;
    setLoading(true);
    getPublicRelatedArticles({ data: { category, currentSlug, limit: 4 } })
      .then((data) => {
        if (active) {
          setItems(data || []);
        }
      })
      .catch((err) => {
        console.error("Failed to load related articles:", err);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [currentSlug, category]);

  if (items.length === 0) {
    return null;
  }

  return (
    <section className="mt-12 border-t border-border pt-6">
      <h3 className="mb-5 headline font-serif text-2xl font-bold text-primary">Related News</h3>
      <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
        {items.map((it) => {
          const views = it.views || 0;
          const displayImage = it.featuredImage || it.ogImage || "/placeholder.svg";
          const kicker = it.category || "News";

          return (
            <Link
              key={it.id || it.slug}
              to="/news/$slug"
              params={{ slug: it.slug }}
              className="group block"
            >
              <div className="overflow-hidden rounded-md bg-muted aspect-[16/9]">
                <img
                  src={displayImage}
                  alt={it.title}
                  loading="lazy"
                  decoding="async"
                  className="aspect-[16/9] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="mt-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                {kicker} · {formatViews(views)} views
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
