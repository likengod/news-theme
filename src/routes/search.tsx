import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { searchUnifiedPublic, type UnifiedSearchData } from "@/lib/search.functions";
import { SearchFilters } from "@/components/search/SearchFilters";
import { SearchResultsList } from "@/components/search/SearchResultsList";

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

          <SearchFilters
            input={input}
            setInput={setInput}
            category={category}
            setCategory={setCategory}
            allCategories={allCategories}
            handleSearchSubmit={handleSearchSubmit}
            search={search}
            initialTab={initialTab}
            totalResults={totalResults}
            counts={counts}
            isQueryActive={isQueryActive}
          />
        </header>

        <SearchResultsList
          isQueryActive={isQueryActive}
          hasResults={hasResults}
          initialQ={initialQ}
          allCategories={allCategories}
          initialTab={initialTab}
          categories={categories}
          pages={pages}
          items={items}
          totalArticles={totalArticles}
          search={search}
          current={current}
          totalPages={totalPages}
        />
      </main>

      <Footer />
    </div>
  );
}
