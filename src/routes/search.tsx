import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Views } from "@/components/site/Views";
import {
  Search as SearchIcon,
  Folder,
  FileText,
  Newspaper,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Hash,
} from "lucide-react";
import { searchUnifiedPublic, type UnifiedSearchData } from "@/lib/search.functions";
import heroImg from "@/assets/hero-markets.webp";

type SearchParams = {
  q?: string;
  category?: string;
  page?: number;
  tab?: "all" | "articles" | "categories" | "pages";
};

export const Route = createFileRoute("/search")({
  validateSearch: (raw: Record<string, unknown>): SearchParams => ({
    q: typeof raw.q === "string" ? raw.q : "",
    category: typeof raw.category === "string" ? raw.category : "All",
    page: Number(raw.page) > 0 ? Number(raw.page) : 1,
    tab:
      raw.tab === "articles" || raw.tab === "categories" || raw.tab === "pages"
        ? (raw.tab as "articles" | "categories" | "pages")
        : "all",
  }),
  loaderDeps: ({ search: { q, category, page, tab } }) => ({ q, category, page, tab }),
  loader: async ({ deps }): Promise<UnifiedSearchData> => {
    try {
      return await searchUnifiedPublic({
        data: {
          q: deps.q || "",
          category: deps.category || "All",
          page: deps.page || 1,
          limit: 15,
          tab: deps.tab || "all",
        },
      });
    } catch (err) {
      console.warn("[Search loader] Error:", err);
      return {
        query: deps.q || "",
        selectedCategory: deps.category || "All",
        activeTab: deps.tab || "all",
        articles: { items: [], total: 0, totalPages: 1 },
        categories: [],
        pages: [],
        allCategories: [],
        counts: { articles: 0, categories: 0, pages: 0, total: 0 },
      };
    }
  },
  head: ({ loaderData }) => {
    const q = loaderData?.query;
    return {
      meta: [
        {
          title: q ? `Results for "${q}" – News Archive & Search` : "Search Site – News Theme",
        },
        {
          name: "description",
          content:
            "Search across published news stories, editorial categories, information desks, and policy pages.",
        },
      ],
    };
  },
  component: SearchPage,
});

function fmtDate(d: Date): string {
  if (isNaN(d.getTime())) return "";
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
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
  const initialTab = search.tab ?? "all";
  const current = search.page ?? 1;

  const [input, setInput] = useState(initialQ);
  const [category, setCategory] = useState(initialCat);

  const { articles, categories, pages, allCategories, counts } = loaderData;
  const { items, total: totalArticles, totalPages } = articles;

  const totalResults = counts.total;
  const hasResults = totalResults > 0;
  const isQueryActive = Boolean(initialQ.trim() || initialCat !== "All");

  const buildSearchUrl = (newParams: Partial<SearchParams>) => {
    const qParam = newParams.q !== undefined ? newParams.q : initialQ;
    const catParam = newParams.category !== undefined ? newParams.category : initialCat;
    const pageParam = newParams.page !== undefined ? newParams.page : 1;
    const tabParam = newParams.tab !== undefined ? newParams.tab : initialTab;

    const sp = new URLSearchParams();
    if (qParam) sp.set("q", qParam.trim());
    if (catParam && catParam !== "All") sp.set("category", catParam);
    if (pageParam > 1) sp.set("page", String(pageParam));
    if (tabParam && tabParam !== "all") sp.set("tab", tabParam);

    return `/search?${sp.toString()}`;
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    window.location.assign(
      buildSearchUrl({
        q: input.trim(),
        category,
        page: 1,
        tab: "all",
      }),
    );
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between">
      <Header />

      <main className="mx-auto max-w-7xl px-4 py-8 md:py-12 flex-1 w-full">
        {/* Header Search Box */}
        <header className="border-b border-border pb-8">
          <div className="flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-[0.25em] text-muted-foreground">
            <span>Newsroom Finder</span>
            <span>·</span>
            <span>Unified Search</span>
          </div>

          <h1 className="mt-2 font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-foreground">
            {isQueryActive ? (
              <>
                Search Results
                {initialQ && <span className="font-sans font-normal text-muted-foreground"> for </span>}
                {initialQ && <span>&ldquo;{initialQ}&rdquo;</span>}
                {initialCat !== "All" && (
                  <span className="text-xl sm:text-2xl md:text-3xl text-muted-foreground block sm:inline sm:ml-2">
                    in {initialCat}
                  </span>
                )}
              </>
            ) : (
              "Search Stories, Categories & Pages"
            )}
          </h1>

          <p className="mt-2.5 text-sm text-muted-foreground max-w-3xl leading-relaxed">
            {isQueryActive
              ? `Found ${totalResults.toLocaleString()} result${totalResults === 1 ? "" : "s"} across news archive, categories, and site pages.`
              : "Search all published stories, regional sections, editorial policies, and live desks with verified access."}
          </p>

          {/* Unified Search Input Form */}
          <form
            onSubmit={handleSearchSubmit}
            className="mt-6 flex flex-col md:flex-row max-w-4xl items-stretch border border-border bg-card shadow-xs rounded-none transition-all focus-within:ring-2 focus-within:ring-foreground/20"
          >
            {/* Input field */}
            <div className="flex flex-1 items-center min-w-[220px] px-3">
              <SearchIcon className="h-4 w-4 shrink-0 text-muted-foreground" />
              <input
                autoFocus
                value={input}
                onChange={(e) => setInput(e.target.value)}
                type="search"
                placeholder="Search articles, categories, or pages (e.g. Sports, Fact Check, About Us)…"
                className="w-full bg-transparent px-3 py-3.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
              />
              {input && (
                <button
                  type="button"
                  onClick={() => setInput("")}
                  className="text-xs text-muted-foreground hover:text-foreground px-2 py-1"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Dynamic Category Dropdown from database */}
            <div className="flex border-t md:border-t-0 md:border-l border-border items-center bg-card pr-3">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="bg-transparent px-4 py-3.5 text-sm text-foreground focus:outline-none cursor-pointer"
                aria-label="Filter by category"
              >
                <option value="All">All Categories</option>
                {allCategories.map((c) => (
                  <option key={c.slug} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Search Submit button */}
            <button
              type="submit"
              className="bg-foreground px-8 py-3.5 text-xs font-bold uppercase tracking-widest text-background hover:opacity-85 transition-opacity shrink-0"
            >
              Search
            </button>
          </form>

          {/* Tab Filter Navigation */}
          {isQueryActive && (
            <div className="mt-8 flex flex-wrap items-center gap-2 border-b border-border/60 pb-3">
              <Link
                to="/search"
                search={{ ...search, tab: "all", page: 1 }}
                className={`inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider rounded-full transition-colors ${
                  initialTab === "all"
                    ? "bg-foreground text-background shadow-xs"
                    : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <span>All Results</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                    initialTab === "all" ? "bg-background/20 text-background" : "bg-border text-foreground"
                  }`}
                >
                  {totalResults}
                </span>
              </Link>

              <Link
                to="/search"
                search={{ ...search, tab: "articles", page: 1 }}
                className={`inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider rounded-full transition-colors ${
                  initialTab === "articles"
                    ? "bg-foreground text-background shadow-xs"
                    : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <Newspaper className="h-3.5 w-3.5" />
                <span>Stories</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                    initialTab === "articles"
                      ? "bg-background/20 text-background"
                      : "bg-border text-foreground"
                  }`}
                >
                  {counts.articles}
                </span>
              </Link>

              <Link
                to="/search"
                search={{ ...search, tab: "categories", page: 1 }}
                className={`inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider rounded-full transition-colors ${
                  initialTab === "categories"
                    ? "bg-foreground text-background shadow-xs"
                    : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <Folder className="h-3.5 w-3.5" />
                <span>Categories</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                    initialTab === "categories"
                      ? "bg-background/20 text-background"
                      : "bg-border text-foreground"
                  }`}
                >
                  {counts.categories}
                </span>
              </Link>

              <Link
                to="/search"
                search={{ ...search, tab: "pages", page: 1 }}
                className={`inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider rounded-full transition-colors ${
                  initialTab === "pages"
                    ? "bg-foreground text-background shadow-xs"
                    : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <FileText className="h-3.5 w-3.5" />
                <span>Pages & Desks</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                    initialTab === "pages"
                      ? "bg-background/20 text-background"
                      : "bg-border text-foreground"
                  }`}
                >
                  {counts.pages}
                </span>
              </Link>
            </div>
          )}
        </header>

        {/* Search Results Display Area */}
        <section className="pt-8">
          {/* ZERO RESULTS EMPTY STATE */}
          {isQueryActive && !hasResults && (
            <div className="py-16 text-center max-w-lg mx-auto">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-muted text-muted-foreground mb-4">
                <SearchIcon className="h-6 w-6" />
              </div>
              <h2 className="font-serif text-2xl font-bold text-foreground">No matches found</h2>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                We couldn&rsquo;t find any stories, categories, or active pages matching &ldquo;{initialQ}&rdquo;.
                Try checking the spelling, using more general terms, or browse popular sections below.
              </p>

              <div className="mt-6 pt-6 border-t border-border">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">
                  Browse Popular Categories
                </p>
                <div className="flex flex-wrap items-center justify-center gap-2">
                  {allCategories.slice(0, 8).map((c) => (
                    <Link
                      key={c.slug}
                      to="/$slug"
                      params={{ slug: c.slug }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-border bg-card hover:bg-foreground hover:text-background transition-colors"
                    >
                      <Hash className="h-3 w-3 opacity-60" />
                      <span>{c.name}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 1. MATCHED CATEGORIES SECTION */}
          {(initialTab === "all" || initialTab === "categories") && categories.length > 0 && (
            <div className="mb-12">
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-border/50">
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-md bg-primary/10 text-primary">
                    <Folder className="h-3.5 w-3.5" />
                  </span>
                  <h2 className="font-serif text-xl font-bold text-foreground">
                    Matching Categories ({categories.length})
                  </h2>
                </div>
                {initialTab === "all" && categories.length > 3 && (
                  <Link
                    to="/search"
                    search={{ ...search, tab: "categories", page: 1 }}
                    className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1"
                  >
                    View all {categories.length} categories <ChevronRight className="h-3 w-3" />
                  </Link>
                )}
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {categories.map((cat) => (
                  <div
                    key={cat.id}
                    className="group relative flex flex-col justify-between rounded-xl border border-border bg-card p-4 transition-all duration-200 hover:border-foreground/40 hover:shadow-sm"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary">
                          <Hash className="h-3 w-3" />
                          <span>Category Desk</span>
                        </span>
                        <span className="text-[11px] font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                          {cat.count} {cat.count === 1 ? "article" : "articles"}
                        </span>
                      </div>

                      <h3 className="mt-2 font-serif text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                        <Link to="/$slug" params={{ slug: cat.slug }}>
                          {cat.name}
                        </Link>
                      </h3>

                      {cat.description && (
                        <p className="mt-1.5 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                          {cat.description}
                        </p>
                      )}
                    </div>

                    <div className="mt-4 pt-3 border-t border-border/40 flex items-center justify-between">
                      <Link
                        to="/$slug"
                        params={{ slug: cat.slug }}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-foreground group-hover:text-primary transition-colors"
                      >
                        <span>Open Category Feed</span>
                        <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
                      </Link>

                      <Link
                        to="/search"
                        search={{ q: "", category: cat.name, page: 1, tab: "articles" }}
                        className="text-[11px] text-muted-foreground hover:text-foreground hover:underline"
                      >
                        Search stories here
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 2. MATCHED PAGES & FEATURES SECTION */}
          {(initialTab === "all" || initialTab === "pages") && pages.length > 0 && (
            <div className="mb-12">
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-border/50">
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400">
                    <FileText className="h-3.5 w-3.5" />
                  </span>
                  <h2 className="font-serif text-xl font-bold text-foreground">
                    Pages & Desks ({pages.length})
                  </h2>
                </div>
                {initialTab === "all" && pages.length > 3 && (
                  <Link
                    to="/search"
                    search={{ ...search, tab: "pages", page: 1 }}
                    className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1"
                  >
                    View all {pages.length} pages <ChevronRight className="h-3 w-3" />
                  </Link>
                )}
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {pages.map((p) => {
                  const badgeColor =
                    p.sectionBadge === "Feature"
                      ? "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-200/50"
                      : p.sectionBadge === "Policy"
                        ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200/50"
                        : p.sectionBadge === "Service"
                          ? "bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-200/50"
                          : "bg-muted text-muted-foreground border-border";

                  return (
                    <div
                      key={p.slug}
                      className="group relative flex flex-col justify-between rounded-xl border border-border bg-card p-4 transition-all duration-200 hover:border-foreground/40 hover:shadow-sm"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-md border ${badgeColor}`}
                          >
                            {p.sectionBadge === "Feature" && <Sparkles className="h-2.5 w-2.5" />}
                            {p.sectionBadge === "Policy" && <ShieldCheck className="h-2.5 w-2.5" />}
                            <span>{p.sectionBadge}</span>
                          </span>
                          <span className="text-[10px] text-muted-foreground font-mono">
                            {p.url}
                          </span>
                        </div>

                        <h3 className="mt-2.5 font-serif text-base font-bold text-foreground group-hover:text-primary transition-colors">
                          <Link to={p.url as any}>{p.title}</Link>
                        </h3>

                        {p.intro && (
                          <p className="mt-1.5 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                            {p.intro}
                          </p>
                        )}
                      </div>

                      <div className="mt-4 pt-3 border-t border-border/40 flex items-center justify-between">
                        <Link
                          to={p.url as any}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-foreground group-hover:text-primary transition-colors"
                        >
                          <span>Visit Page</span>
                          <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 3. MATCHED STORIES / ARTICLES SECTION */}
          {(initialTab === "all" || initialTab === "articles") && (
            <div>
              {(initialTab === "all" || initialTab === "articles") && (
                <div className="flex items-center justify-between mb-4 pb-2 border-b border-border/50">
                  <div className="flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                      <Newspaper className="h-3.5 w-3.5" />
                    </span>
                    <h2 className="font-serif text-xl font-bold text-foreground">
                      News Stories ({totalArticles.toLocaleString()})
                    </h2>
                  </div>
                </div>
              )}

              {items.length === 0 ? (
                initialTab === "articles" ? (
                  <p className="py-10 text-center text-sm text-muted-foreground">
                    No articles matched your search. Try changing keywords or category filter.
                  </p>
                ) : null
              ) : (
                <div className="divide-y divide-border">
                  {items.map((p, i) => (
                    <article
                      key={`${p.slug}-${p.id || i}`}
                      className="grid grid-cols-[130px_1fr] sm:grid-cols-[170px_1fr] md:grid-cols-[220px_1fr] gap-4 sm:gap-6 py-6 first:pt-0"
                    >
                      <Link
                        to="/news/$slug"
                        params={{ slug: p.slug || "sample" }}
                        className="block overflow-hidden rounded-sm group aspect-[16/9] bg-muted shrink-0"
                      >
                        <img
                          src={p.featuredImage || heroImg}
                          alt={p.title}
                          loading="lazy"
                          decoding="async"
                          width={220}
                          height={124}
                          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </Link>

                      <div className="flex flex-col justify-between">
                        <div>
                          <div className="flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-widest text-muted-foreground mb-1.5">
                            <span className="font-bold text-primary normal-case tracking-normal">
                              {p.category}
                            </span>
                            <span>·</span>
                            <span className="normal-case tracking-normal">
                              {fmtDate(new Date(p.date))}
                            </span>
                          </div>

                          <h3 className="headline font-serif text-base sm:text-lg md:text-xl font-bold leading-snug text-foreground hover:text-primary transition-colors line-clamp-2">
                            <Link to="/news/$slug" params={{ slug: p.slug || "sample" }}>
                              {p.title}
                            </Link>
                          </h3>

                          {p.excerpt && (
                            <p className="mt-2 text-xs sm:text-sm leading-relaxed text-muted-foreground line-clamp-2">
                              {p.excerpt}
                            </p>
                          )}
                        </div>

                        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-muted-foreground">
                          {p.author && <span>By {p.author}</span>}
                          <span className="ml-auto">
                            <Views count={p.views} />
                          </span>
                        </div>
                      </div>
                    </article>
                  ))}

                  {/* Pagination for Articles */}
                  {totalPages > 1 && (
                    <nav className="flex flex-wrap items-center justify-center gap-2 py-8">
                      {current > 1 && (
                        <Link
                          to="/search"
                          search={{ ...search, page: current - 1 }}
                          className="border border-border px-3.5 py-2 text-xs font-semibold uppercase tracking-widest hover:bg-foreground hover:text-background transition-colors"
                        >
                          ← Prev
                        </Link>
                      )}
                      <div className="flex items-center px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Page {current} of {totalPages}
                      </div>
                      {current < totalPages && (
                        <Link
                          to="/search"
                          search={{ ...search, page: current + 1 }}
                          className="border border-border px-3.5 py-2 text-xs font-semibold uppercase tracking-widest hover:bg-foreground hover:text-background transition-colors"
                        >
                          Next →
                        </Link>
                      )}
                    </nav>
                  )}
                </div>
              )}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
