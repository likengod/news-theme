import { lazy, Suspense } from "react";
import { Link } from "@tanstack/react-router";

const RelatedNews = lazy(() =>
  import("@/components/site/RelatedNews").then((m) => ({ default: m.RelatedNews })),
);
const CommentsSection = lazy(() =>
  import("@/components/site/CommentsSection").then((m) => ({ default: m.CommentsSection })),
);

type Props = {
  slug: string;
  author: string;
  tags?: string[];
  articleTitle?: string;
};

const DEFAULT_TAGS = ["Breaking", "Northeast", "Report", "Update"];

export function ArticleFooter({ slug, author, tags = DEFAULT_TAGS, articleTitle = "Untitled Article" }: Props) {
  const initials = author
    .split(" ")
    .map((n) => n[0])
    .join("");

  return (
    <footer className="mt-2">
      <div className="flex flex-wrap items-center gap-2 border-t border-border pt-3">
        <span className="mr-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Tags:
        </span>
        {tags.map((t) => (
          <Link
            key={t}
            to="/$slug"
            params={{ slug: t.toLowerCase() }}
            className="rounded-full border border-border px-3 py-1 text-xs uppercase tracking-widest text-muted-foreground transition hover:bg-muted hover:text-foreground"
          >
            {t}
          </Link>
        ))}
      </div>

      <Suspense fallback={<div className="mt-8 h-24 animate-pulse rounded bg-muted" />}>
        <RelatedNews currentSlug={slug} />
      </Suspense>

      <Suspense fallback={<div className="mt-8 h-32 animate-pulse rounded bg-muted" />}>
        <CommentsSection articleSlug={slug} articleTitle={articleTitle} />
      </Suspense>
    </footer>
  );
}
