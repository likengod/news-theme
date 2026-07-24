## Goal
Optimize `/article/$slug` for speed, SEO, maintainability, and reading experience — without changing business logic.

## 1. Modularize `src/routes/article.$slug.tsx`
Split the monolithic route file into focused components under `src/components/article/`:
- `ArticleHeader.tsx` — category, title, deck, byline, date, share row
- `ArticleHero.tsx` — featured image + caption (LCP element)
- `ArticleBody.tsx` — sanitized HTML content + typography
- `ArticleSidebar.tsx` — related, popular, ads
- `ArticleFooter.tsx` — tags, author card, next/prev

The route file keeps only: `createFileRoute`, loader, `head()`, and composition.

## 2. Performance
- Lazy-load below-the-fold pieces via `React.lazy` + `Suspense`: `CommentsSection`, `RelatedNews`, `Advertisement`, `PopupAd`.
- Add `loading="eager"` + `fetchpriority="high"` to hero image; `loading="lazy"` + `decoding="async"` on all other images.
- Preload the hero image via route `head().links` (`rel="preload"`, `as="image"`).
- Memoize expensive derived data (sanitized HTML, related list).
- Ensure loader uses `ensureQueryData` so `head()` gets `loaderData` server-side (no client refetch flash).

## 3. SEO & metadata
- Per-article `head()`: title, description, canonical, `og:title/description/image/url/type=article`, `twitter:card=summary_large_image`, `article:published_time`, `article:author`.
- JSON-LD `NewsArticle` schema built from loader data (headline, image, datePublished, author, publisher).
- Absolute URLs for `og:image` / canonical using project origin.
- `robots: index,follow` explicit; `noindex` fallback when article missing.

## 4. UI/UX polish (frontend-only)
- Cleaner reading column: max-width ~720px, larger body type, better line-height.
- Sticky share bar on desktop (left rail); inline share on mobile.
- Progress bar at top showing scroll depth.
- Improved image caption + credit styling.
- Better spacing between header, hero, body, and related sections.
- Keep existing color tokens / theme — no palette changes.

## Out of scope
- No changes to data model, submission flow, comments logic, or auth.
- No changes to homepage, footer, or other routes.

## Technical notes
- New folder: `src/components/article/`
- Route file shrinks from one large component to a thin composition (~80 lines).
- All new components are non-exported where possible to preserve TanStack code-splitting.
- Verify with a build + a Playwright screenshot of `/article/sample` after changes.
