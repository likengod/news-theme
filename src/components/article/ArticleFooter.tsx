import { Link } from "@tanstack/react-router";
import { RelatedNews } from "@/components/site/RelatedNews";
import CommentsSection from "@/components/site/CommentsSection";

type Props = {
  slug: string;
  author: string;
  tags?: string[];
  articleTitle?: string;
  category?: string;
};

export function ArticleFooter({
  slug,
  author,
  tags,
  articleTitle = "Untitled Article",
  category,
}: Props) {
  const hasTags = Array.isArray(tags) && tags.length > 0;

  return (
    <footer className="mt-2">
      {hasTags && (
        <div className="flex flex-wrap items-center gap-2 border-t border-border pt-3">
          <span className="mr-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Tags:
          </span>
          {tags.map((t) => (
            <Link
              key={t}
              to="/search"
              search={{ q: t }}
              className="rounded-full border border-border px-3 py-1 text-xs uppercase tracking-widest text-muted-foreground transition hover:bg-muted hover:text-foreground hover:border-foreground/30"
            >
              {t}
            </Link>
          ))}
        </div>
      )}

      <RelatedNews currentSlug={slug} category={category} />
      <CommentsSection articleSlug={slug} articleTitle={articleTitle} />
    </footer>
  );
}

export default ArticleFooter;
