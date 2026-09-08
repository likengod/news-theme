import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Play, Eye, Film, ChevronLeft, ChevronRight } from "lucide-react";
import { viewsFor, formatViews } from "@/lib/news-data";
import { getAllReels } from "@/lib/reels-data";
import { ReelViewerModal } from "@/components/site/ReelViewerModal";

type ReelsSearchParams = {
  page?: number;
};

export const Route = createFileRoute("/reels")({
  validateSearch: (raw: Record<string, unknown>): ReelsSearchParams => ({
    page: Number(raw.page) > 0 ? Number(raw.page) : 1,
  }),
  head: () => ({
    meta: [
      { title: "Reels & Shorts — Vanguard News" },
      { name: "description", content: "Explore trending news reels, shorts, and video stories." },
    ],
  }),
  component: ReelsPage,
});

function ReelsPage() {
  const search = Route.useSearch();
  const currentPage = search.page ?? 1;
  const ITEMS_PER_PAGE = 20;

  const allReels = useMemo(() => getAllReels(), []);
  const totalItems = allReels.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / ITEMS_PER_PAGE));
  const validPage = Math.min(Math.max(1, currentPage), totalPages);

  const startIndex = (validPage - 1) * ITEMS_PER_PAGE;
  const currentReels = allReels.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const [activeModalIndex, setActiveModalIndex] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Header />

      <main className="mx-auto max-w-7xl px-3 sm:px-4 py-4 md:py-8 flex-1 w-full">
        {/* Page Title Header */}
        <div className="mb-3 md:mb-6 flex items-center justify-between border-b border-border pb-2.5 md:pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 md:h-8 md:w-8 items-center justify-center rounded-lg bg-red-600 text-white shadow">
                <Film className="h-3.5 w-3.5 md:h-4 md:w-4" />
              </span>
              <h1 className="text-lg md:text-2xl font-black uppercase tracking-wider text-foreground">
                Reels & Shorts
              </h1>
            </div>
            <p className="hidden sm:block text-xs text-muted-foreground mt-1">
              Explore short-form video stories, breaking coverage & highlights
            </p>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-muted-foreground">
            <span className="rounded-full bg-muted px-3 py-1 border border-border">
              Page {validPage} of {totalPages} ({totalItems} Reels)
            </span>
          </div>
        </div>

        {/* Reels Grid: exactly 4 columns on mobile, 5 columns on desktop */}
        <div className="grid grid-cols-4 md:grid-cols-5 gap-2 sm:gap-3 md:gap-4">
          {currentReels.map((reel, index) => {
            const globalIndex = startIndex + index;
            const count = reel.views || viewsFor(reel.title);

            return (
              <div
                key={reel.title + index}
                onClick={() => setActiveModalIndex(globalIndex)}
                className="group cursor-pointer flex flex-col"
              >
                <div className="relative aspect-[9/16] w-full overflow-hidden rounded-lg sm:rounded-xl bg-black border border-border/40 shadow-sm transition duration-300 group-hover:scale-[1.02] group-hover:shadow-md">
                  <img
                    src={reel.img}
                    alt={reel.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

                  {/* Kicker badge */}
                  {reel.kicker && (
                    <span className="absolute left-1.5 top-1.5 sm:left-2 sm:top-2 bg-blue-600 px-1.5 py-0.5 text-[8px] sm:text-[10px] font-bold text-white rounded shadow-sm">
                      {reel.kicker}
                    </span>
                  )}

                  {/* Title overlay at bottom */}
                  <h3 className="absolute bottom-8 sm:bottom-9 left-1.5 right-1.5 sm:left-2 sm:right-2 text-[9px] sm:text-xs font-bold leading-tight text-white drop-shadow line-clamp-2">
                    {reel.title}
                  </h3>

                  {/* Play icon & duration */}
                  <div className="absolute bottom-1.5 left-1.5 sm:bottom-2 sm:left-2 flex items-center gap-1 sm:gap-1.5">
                    <span className="flex h-5 w-5 sm:h-6 sm:w-6 items-center justify-center rounded-full bg-white text-black shadow transition-transform group-hover:scale-110">
                      <Play className="h-2.5 w-2.5 sm:h-3 sm:w-3 fill-current ml-0.5" />
                    </span>
                    <span className="text-[8px] sm:text-[10px] font-semibold text-white drop-shadow">
                      {reel.duration}
                    </span>
                  </div>
                </div>

                {/* Views count under card */}
                <div className="mt-1 flex items-center gap-1 text-[9px] sm:text-[11px] text-muted-foreground">
                  <Eye className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-muted-foreground/70" />
                  <span>{formatViews(count)}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="mt-10 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-border pt-6">
            <div className="text-xs text-muted-foreground order-2 sm:order-1">
              Showing <strong className="text-foreground">{startIndex + 1}</strong>–
              <strong className="text-foreground">{Math.min(startIndex + ITEMS_PER_PAGE, totalItems)}</strong> of{" "}
              <strong className="text-foreground">{totalItems}</strong> reels
            </div>

            <div className="flex items-center gap-1.5 order-1 sm:order-2">
              {/* Previous Button */}
              {validPage > 1 ? (
                <Link
                  to="/reels"
                  search={{ page: validPage - 1 }}
                  className="flex h-9 items-center gap-1 rounded-lg border border-border px-3 text-xs font-semibold text-foreground transition hover:bg-foreground hover:text-background"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span>Prev</span>
                </Link>
              ) : (
                <span className="flex h-9 items-center gap-1 rounded-lg border border-border/40 px-3 text-xs font-semibold text-muted-foreground/40 cursor-not-allowed">
                  <ChevronLeft className="h-4 w-4" />
                  <span>Prev</span>
                </span>
              )}

              {/* Page Number Buttons */}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
                const isActive = pageNum === validPage;
                return (
                  <Link
                    key={pageNum}
                    to="/reels"
                    search={{ page: pageNum }}
                    className={`flex h-9 w-9 items-center justify-center rounded-lg text-xs font-bold transition ${
                      isActive
                        ? "bg-foreground text-background shadow"
                        : "border border-border text-foreground hover:bg-muted"
                    }`}
                  >
                    {pageNum}
                  </Link>
                );
              })}

              {/* Next Button */}
              {validPage < totalPages ? (
                <Link
                  to="/reels"
                  search={{ page: validPage + 1 }}
                  className="flex h-9 items-center gap-1 rounded-lg border border-border px-3 text-xs font-semibold text-foreground transition hover:bg-foreground hover:text-background"
                >
                  <span>Next</span>
                  <ChevronRight className="h-4 w-4" />
                </Link>
              ) : (
                <span className="flex h-9 items-center gap-1 rounded-lg border border-border/40 px-3 text-xs font-semibold text-muted-foreground/40 cursor-not-allowed">
                  <span>Next</span>
                  <ChevronRight className="h-4 w-4" />
                </span>
              )}
            </div>
          </div>
        )}

        {/* Fullscreen Video Modal */}
        {activeModalIndex !== null && (
          <ReelViewerModal
            initialIndex={activeModalIndex}
            items={allReels}
            onClose={() => setActiveModalIndex(null)}
          />
        )}
      </main>

      <Footer />
    </div>
  );
}
