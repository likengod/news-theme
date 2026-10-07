import { Link } from "@tanstack/react-router";
import React from "react";

interface SearchPaginationProps {
  current: number;
  totalPages: number;
  search: any;
}

export function SearchPagination({ current, totalPages, search }: SearchPaginationProps) {
  if (totalPages <= 1) return null;

  return (
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
  );
}
