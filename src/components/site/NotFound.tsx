import { Link } from "@tanstack/react-router";
import { Home, Search, ArrowLeft, Newspaper } from "lucide-react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { sections, slugify } from "@/lib/news-data";

export function NotFound() {
  const popular = sections.filter((s) => s !== "Others").slice(0, 6);
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header showTicker={false} showBreakingBar={false} />
      <main className="flex-1 px-4 py-16">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-red-600">
            Error 404
          </p>
          <h1
            className="mt-4 font-bold leading-none text-foreground"
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: "clamp(5rem, 18vw, 10rem)",
            }}
          >
            404
          </h1>
          <h2
            className="mt-2 text-2xl font-bold text-foreground sm:text-3xl"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            This story is missing from our archive
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm text-muted-foreground sm:text-base">
            The page you're looking for may have been moved, removed, or never existed.
            Try heading back to the homepage or explore a category below.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-md bg-foreground px-5 py-2.5 text-sm font-semibold text-background transition-opacity hover:opacity-90"
            >
              <Home className="h-4 w-4" /> Go to Homepage
            </Link>
            <Link
              to="/search"
              className="inline-flex items-center gap-2 rounded-md border border-border bg-background px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
            >
              <Search className="h-4 w-4" /> Search News
            </Link>
            <Link
              to="/archive"
              className="inline-flex items-center gap-2 rounded-md border border-border bg-background px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
            >
              <ArrowLeft className="h-4 w-4" /> Browse Archive
            </Link>
          </div>

          <div className="mt-12 border-t border-border pt-8">
            <p className="mb-4 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
              <Newspaper className="h-4 w-4" /> Popular Categories
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {popular.map((name) => (
                <Link
                  key={name}
                  to="/$slug"
                  params={{ slug: slugify(name) }}
                  className="rounded-full border border-border px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-foreground transition-colors hover:bg-foreground hover:text-background"
                >
                  {name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
