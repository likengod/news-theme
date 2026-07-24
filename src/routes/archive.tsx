import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Views } from "@/components/site/Views";
import { ArchiveFinder } from "@/components/site/ArchiveFinder";
import { getPublicArchiveArticles } from "@/lib/articles.functions";
import Advertisement from "@/components/site/Advertisement";
import React from "react";

import heroImg from "@/assets/hero-markets.jpg";

type SearchParams = { day?: string; month?: string; year?: string; page?: number };

export const Route = createFileRoute("/archive")({
  validateSearch: (raw: Record<string, unknown>): SearchParams => ({
    day: typeof raw.day === "string" ? raw.day : undefined,
    month: typeof raw.month === "string" ? raw.month : undefined,
    year: typeof raw.year === "string" ? raw.year : undefined,
    page: Number(raw.page) > 0 ? Number(raw.page) : 1,
  }),
  loaderDeps: ({ search: { day, month, year, page } }) => ({ day, month, year, page }),
  loader: async ({ deps }) => {
    return await getPublicArchiveArticles({
      data: {
        year: deps.year,
        month: deps.month,
        day: deps.day,
        page: deps.page || 1,
        limit: 15,
      },
    });
  },
  head: () => ({
    meta: [
      { title: "Archive – News Theme" },
      { name: "description", content: "Browse past stories by day, month or year." },
    ],
  }),
  component: ArchivePage,
});

function fmtDate(d: Date): string {
  if (isNaN(d.getTime())) return "";
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const day = d.getUTCDate();
  const month = months[d.getUTCMonth()];
  const year = d.getUTCFullYear();
  return `${month} ${day}, ${year}`;
}

function ArchivePage() {
  const search = Route.useSearch();
  const loaderData = Route.useLoaderData();
  const page = search.page ?? 1;
  
  const { items, total, totalPages } = loaderData;

  const months = ["", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const label = [
    search.day ? Number(search.day) : null,
    search.month ? months[Number(search.month)] : null,
    search.year ?? null,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      <main className="mx-auto max-w-7xl px-4 py-10">
        <header className="border-b border-border pb-6">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-muted-foreground">Archive</p>
          <h1 className="mt-2 font-serif text-5xl font-bold text-foreground md:text-6xl">
            {label || "All Stories"}
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">
            {total.toLocaleString()} stories found{label ? ` for ${label}` : ""}.
          </p>
        </header>

        <section className="grid grid-cols-1 gap-10 pt-8 lg:grid-cols-[1fr_300px]">
          <div className="divide-y divide-border">
            {items.length === 0 && (
              <p className="py-10 text-center text-sm text-muted-foreground">
                No stories found for this date. Try a different day, month or year.
              </p>
            )}
            {items.map((p, i) => (
              <React.Fragment key={`${p.title}-${i}`}>
                <article className="py-6 first:pt-0">
                <div>
                  <h3 className="headline font-serif text-lg font-bold leading-snug text-primary line-clamp-2">
                    <Link to={`/news/${p.slug}`} className="hover:underline">{p.title}</Link>
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground line-clamp-2">{p.excerpt}</p>
                  <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] uppercase tracking-widest">
                    <span className="text-muted-foreground normal-case tracking-normal">{fmtDate(new Date(p.date))}</span>
                    <span className="font-semibold text-foreground">· {p.category}</span>
                    <span className="ml-auto"><Views count={p.views} /></span>
                  </div>
                </div>
              </article>
                {(i + 1) % 3 === 0 && (
                  <div className="py-6">
                    <Advertisement slot="leaderboard" aspectRatio="728 / 90" />
                  </div>
                )}
              </React.Fragment>
            ))}

            {totalPages > 1 && (
              <nav className="flex flex-wrap items-center justify-center gap-2 py-8">
                {page > 1 && (
                  <Link
                    to="/archive"
                    search={{ ...search, page: page - 1 }}
                    className="border border-border px-3 py-2 text-xs font-semibold uppercase tracking-widest hover:bg-foreground hover:text-background"
                  >
                    ← Prev
                  </Link>
                )}
                <div className="flex items-center px-4 text-sm font-medium text-muted-foreground">
                  Page {page} of {totalPages}
                </div>
                {page < totalPages && (
                  <Link
                    to="/archive"
                    search={{ ...search, page: page + 1 }}
                    className="border border-border px-3 py-2 text-xs font-semibold uppercase tracking-widest hover:bg-foreground hover:text-background"
                  >
                    Next →
                  </Link>
                )}
              </nav>
            )}
          </div>

          <aside className="space-y-6">
            <ArchiveFinder />
          </aside>
        </section>
      </main>

      <Footer />
    </div>
  );
}
