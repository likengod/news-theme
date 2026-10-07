import React from "react";
import { Link } from "@tanstack/react-router";

interface PaginationProps {
  page: number;
  totalPages: number;
  categorySlug: string;
}

export function Pagination({ page, totalPages, categorySlug }: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="mt-12 flex flex-wrap items-center justify-center gap-2 border-t border-border pt-8">
      <Link
        to="/$slug"
        params={{ slug: categorySlug }}
        search={{ page: Math.max(1, page - 1) }}
        className={`rounded border border-border px-3 py-1.5 text-xs font-semibold uppercase tracking-wider ${
          page <= 1 ? "pointer-events-none opacity-40" : "hover:bg-muted text-foreground"
        }`}
      >
        Prev
      </Link>
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
        <Link
          key={p}
          to="/$slug"
          params={{ slug: categorySlug }}
          search={{ page: p }}
          className={`rounded px-3.5 py-1.5 text-xs font-bold transition-colors ${
            page === p
              ? "bg-foreground text-background font-black shadow-sm"
              : "border border-border text-foreground hover:bg-muted"
          }`}
        >
          {p}
        </Link>
      ))}
      <Link
        to="/$slug"
        params={{ slug: categorySlug }}
        search={{ page: Math.min(totalPages, page + 1) }}
        className={`rounded border border-border px-3 py-1.5 text-xs font-semibold uppercase tracking-wider ${
          page >= totalPages
            ? "pointer-events-none opacity-40"
            : "hover:bg-muted text-foreground"
        }`}
      >
        Next
      </Link>
    </div>
  );
}
