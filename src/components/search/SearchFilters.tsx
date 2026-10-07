import { Link } from "@tanstack/react-router";
import { Search as SearchIcon, Newspaper, Folder, FileText } from "lucide-react";
import React from "react";

interface SearchFiltersProps {
  input: string;
  setInput: (val: string) => void;
  category: string;
  setCategory: (val: string) => void;
  allCategories: Array<{ slug: string; name: string }>;
  handleSearchSubmit: (e: React.FormEvent) => void;
  search: any;
  initialTab: string;
  totalResults: number;
  counts: { articles: number; categories: number; pages: number; total: number };
  isQueryActive: boolean;
}

export function SearchFilters({
  input,
  setInput,
  category,
  setCategory,
  allCategories,
  handleSearchSubmit,
  search,
  initialTab,
  totalResults,
  counts,
  isQueryActive,
}: SearchFiltersProps) {
  return (
    <>
      <form
        onSubmit={handleSearchSubmit}
        className="mt-6 flex flex-col md:flex-row max-w-4xl items-stretch border border-border bg-card shadow-xs rounded-none transition-all focus-within:ring-2 focus-within:ring-foreground/20"
      >
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

        <button
          type="submit"
          className="bg-foreground px-8 py-3.5 text-xs font-bold uppercase tracking-widest text-background hover:opacity-85 transition-opacity shrink-0"
        >
          Search
        </button>
      </form>

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
    </>
  );
}
