import { PostFeaturedImageAd } from "./PostFeaturedImageAd";
import { getArticleImage } from "@/lib/news-data";

type Props = {
  src: string;
  alt: string;
  caption?: string;
  credit?: string;
};

export function ArticleHero({ src, alt, caption, credit }: Props) {
  return (
    <figure className="mb-8">
      <div className="relative overflow-hidden group rounded-xl border border-border/60 bg-black/5 dark:bg-black/40 flex items-center justify-center">
        <img
          src={getArticleImage(src, 0)}
          alt={alt}
          width={1200}
          height={675}
          loading="eager"
          fetchPriority="high"
          decoding="async"
          onError={(e) => {
            const target = e.currentTarget;
            if (!target.dataset.fallbackApplied) {
              target.dataset.fallbackApplied = "true";
              target.src = getArticleImage(undefined, 0);
            }
          }}
          className="w-full h-auto max-h-[550px] object-contain object-center transition-transform duration-300 group-hover:scale-[1.01]"
        />
        <PostFeaturedImageAd />
      </div>
      {(caption || credit) && (
        <figcaption className="mt-3 border-b border-border pb-3 text-xs leading-relaxed text-muted-foreground">
          {caption && <span className="italic">{caption}</span>}
          {caption && credit && <span className="mx-2 text-border">|</span>}
          {credit && <span className="font-medium uppercase tracking-wider">{credit}</span>}
        </figcaption>
      )}
    </figure>
  );
}
