import { Link } from "@tanstack/react-router";
import { Search as SearchIcon, Hash, Folder, ChevronRight, ArrowRight, Sparkles, ShieldCheck, FileText, Newspaper } from "lucide-react";
import React from "react";
import { Views } from "@/components/site/Views";
import heroImg from "@/assets/hero-markets.webp";
import { SearchPagination } from "./SearchPagination";

// Utility function to format dates
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

interface SearchResultsListProps {
  isQueryActive: boolean;
  hasResults: boolean;
  initialQ: string;
  allCategories: Array<{ slug: string; name: string }>;
  initialTab: string;
  categories: any[];
  pages: any[];
  items: any[];
  totalArticles: number;
  search: any;
  current: number;
  totalPages: number;
}

export function SearchResultsList({
  isQueryActive,
  hasResults,
  initialQ,
  allCategories,
  initialTab,
  categories,
  pages,
  items,
  totalArticles,
  search,
  current,
  totalPages,
}: SearchResultsListProps) {
  return (
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

              <SearchPagination current={current} totalPages={totalPages} search={search} />
            </div>
          )}
        </div>
      )}
    </section>
  );
}
