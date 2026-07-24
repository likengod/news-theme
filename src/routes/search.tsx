import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Views } from "@/components/site/Views";
import { sections } from "@/lib/news-data";
import { Search as SearchIcon } from "lucide-react";
import { searchPublicArticles } from "@/lib/articles.functions";

import heroImg from "@/assets/hero-markets.jpg";

type SearchParams = { q?: string; category?: string; page?: number };

export const Route = createFileRoute("/search")({
  validateSearch: (raw: Record<string, unknown>): SearchParams => ({
    q: typeof raw.q === "string" ? raw.q : "",
    category: typeof raw.category === "string" ? raw.category : "All",
    page: Number(raw.page) > 0 ? Number(raw.page) : 1,
  }),
  loaderDeps: ({ search: { q, category, page } }) => ({ q, category, page }),
  loader: async ({ deps }) => {
    return await searchPublicArticles({
      data: {
        q: deps.q || "",
        category: deps.category || "All",
        page: deps.page || 1,
        limit: 15,
      },
    });
  },
  head: () => ({
    meta: [
      { title: "Search – News Theme" },
      { name: "description", content: "Search the News Theme news archive." },
    ],
  }),
  component: SearchPage,
});

function fmtDate(d: Date): string {
  if (isNaN(d.getTime())) return "";
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const day = d.getUTCDate();
  const month = months[d.getUTCMonth()];
  const year = d.getUTCFullYear();
  return `${month} ${day}, ${year}`;
}

function SearchPage() {
  const search = Route.useSearch();
  const loaderData = Route.useLoaderData();
  const initialQ = search.q ?? "";
  const initialCat = search.category ?? "All";
  const current = search.page ?? 1;

  const [input, setInput] = useState(initialQ);
  const [category, setCategory] = useState(initialCat);

  const { items, total, totalPages } = loaderData;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      <main className="mx-auto max-w-7xl px-4 py-10">
        <header className="border-b border-border pb-6">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-muted-foreground">Search Feed</p>
          <h1 className="mt-2 font-serif text-4xl font-bold text-foreground md:text-5xl">
            {initialQ || initialCat !== "All" ? (
              <>
                Results
                {initialQ && <> for &ldquo;{initialQ}&rdquo;</>}
                {initialCat !== "All" && <> in &ldquo;{initialCat}&rdquo;</>}
              </>
            ) : (
              "Search the news archive"
            )}
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">
            {initialQ || initialCat !== "All"
              ? `${total.toLocaleString()} stories found — latest first.`
              : "Type a keyword or filter by category to search across all published stories."}
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              window.location.assign(`/search?q=${encodeURIComponent(input.trim())}&category=${encodeURIComponent(category)}&page=1`);
            }}
            className="mt-5 flex flex-col md:flex-row max-w-3xl items-stretch md:items-center border border-border bg-background"
          >
            <div className="flex flex-1 items-center min-w-[200px]">
              <SearchIcon className="ml-3 h-4 w-4 text-muted-foreground" />
              <input
                autoFocus
                value={input}
                onChange={(e) => setInput(e.target.value)}
                type="search"
                placeholder="Search news headline or content…"
                className="w-full bg-transparent px-3 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
              />
            </div>
            
            <div className="flex border-t md:border-t-0 md:border-l border-border items-center bg-background pr-4">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="bg-transparent px-4 py-3 text-sm text-foreground focus:outline-none cursor-pointer"
              >
                <option value="All">All Categories</option>
                {sections.filter(s => s !== "Others").map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className="bg-foreground px-6 py-3 text-xs font-bold uppercase tracking-widest text-background hover:opacity-80 transition-opacity"
            >
              Search
            </button>
          </form>
        </header>

        <section className="pt-8">
          <div className="divide-y divide-border">
            {items.length === 0 && (
              <p className="py-10 text-center text-sm text-muted-foreground">
                No stories matched your search. Try changing keywords or category.
              </p>
            )}
            {items.map((p, i) => (
              <article
                key={`${p.title}-${i}`}
                className="grid grid-cols-[140px_1fr] gap-5 py-6 first:pt-0 md:grid-cols-[200px_1fr]"
              >
                <Link to={`/news/${p.slug}`} className="block overflow-hidden">
                  <img src={p.featuredImage || heroImg} alt={p.title} className="aspect-[4/3] w-full object-cover rounded-sm hover:scale-105 transition-transform duration-300" />
                </Link>
                <div>
                  <h3 className="headline font-serif text-lg font-bold leading-snug text-primary line-clamp-2">
                    <Link to={`/news/${p.slug}`} className="hover:underline">{p.title}</Link>
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground line-clamp-2">{p.excerpt}</p>
                  <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] uppercase tracking-widest">
                    <span className="text-muted-foreground normal-case tracking-normal">{fmtDate(new Date(p.date))}</span>
                    <span className="font-semibold text-foreground">· {p.category}</span>
                    <span className="ml-auto">
                      <Views count={p.views} />
                    </span>
                  </div>
                </div>
              </article>
            ))}

            {totalPages > 1 && (
              <nav className="flex flex-wrap items-center justify-center gap-2 py-8">
                {current > 1 && (
                  <Link
                    to="/search"
                    search={{ ...search, page: current - 1 }}
                    className="border border-border px-3 py-2 text-xs font-semibold uppercase tracking-widest hover:bg-foreground hover:text-background"
                  >
                    ← Prev
                  </Link>
                )}
                  <div className="flex items-center px-4 text-sm font-medium text-muted-foreground">
                    Page {current} of {totalPages}
                  </div>
                {current < totalPages && (
                  <Link
                    to="/search"
                    search={{ ...search, page: current + 1 }}
                    className="border border-border px-3 py-2 text-xs font-semibold uppercase tracking-widest hover:bg-foreground hover:text-background"
                  >
                    Next →
                  </Link>
                )}
              </nav>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
