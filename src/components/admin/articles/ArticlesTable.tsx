import React from "react";
import {
  Pencil,
  Trash2,
  Eye,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Image as ImageIcon,
} from "lucide-react";
import type { Row } from "./types";

interface ArticlesTableProps {
  rows: Row[];
  loading: boolean;
  selected: Set<number>;
  allOnPageSelected: boolean;
  onTogglePage: () => void;
  onToggleOne: (id: number) => void;
  onEdit: (row: Row) => void;
  onRequestDelete: (id: number, title: string) => void;
  page: number;
  totalPages: number;
  total: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

export function ArticlesTable({
  rows,
  loading,
  selected,
  allOnPageSelected,
  onTogglePage,
  onToggleOne,
  onEdit,
  onRequestDelete,
  page,
  totalPages,
  total,
  pageSize,
  onPageChange,
}: ArticlesTableProps) {
  const showStart = total > 0 ? (page - 1) * pageSize + 1 : 0;
  const showEnd = Math.min(page * pageSize, total);

  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
      <table className="w-full min-w-[700px] text-sm">
        <thead className="bg-slate-50 text-left text-xs uppercase tracking-wider text-slate-500">
          <tr>
            <th className="w-10 px-5 py-3">
              <input
                type="checkbox"
                checked={allOnPageSelected}
                onChange={onTogglePage}
                className="h-4 w-4 cursor-pointer rounded border-slate-300"
                aria-label="Select all on page"
              />
            </th>
            <th className="px-5 py-3">Title</th>
            <th className="px-5 py-3">Category</th>
            <th className="px-5 py-3">Author</th>
            <th className="px-5 py-3">Views</th>
            <th className="px-5 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {loading && (
            <tr>
              <td colSpan={6} className="px-5 py-12 text-center text-slate-500">
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Loading articles...</span>
                </div>
              </td>
            </tr>
          )}
          {!loading &&
            rows.map((r) => (
              <tr
                key={r.id}
                className={`hover:bg-slate-50/60 ${selected.has(r.id) ? "bg-slate-50" : ""}`}
              >
                <td className="px-5 py-3">
                  <input
                    type="checkbox"
                    checked={selected.has(r.id)}
                    onChange={() => onToggleOne(r.id)}
                    className="h-4 w-4 cursor-pointer rounded border-slate-300"
                    aria-label={`Select ${r.title}`}
                  />
                </td>
                <td className="max-w-[360px] px-5 py-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-16 shrink-0 overflow-hidden rounded bg-slate-100 border border-slate-200">
                      {r.featuredImage ? (
                        <img
                          src={r.featuredImage}
                          alt=""
                          width={64}
                          height={40}
                          loading="lazy"
                          decoding="async"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-slate-400">
                          <ImageIcon className="h-4 w-4" />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="truncate font-medium" title={r.title}>
                          {r.title}
                        </p>
                        {r.status === "Published" && new Date(r.date) > new Date() && (
                          <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-700 border border-blue-200 whitespace-nowrap">
                            Scheduled
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3 text-slate-600">{r.category}</td>
                <td className="px-5 py-3 text-slate-600">{r.author}</td>
                <td className="px-5 py-3 text-slate-600">
                  <span className="inline-flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    {(r.views ?? 0).toLocaleString()}
                  </span>
                </td>
                <td className="px-5 py-3 text-right">
                  <div className="inline-flex gap-2">
                    <button
                      onClick={() => onEdit(r)}
                      className="grid h-8 w-8 place-items-center rounded-md border border-slate-200 hover:bg-slate-100"
                      aria-label="Edit"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => onRequestDelete(r.id, r.title)}
                      className="grid h-8 w-8 place-items-center rounded-md border border-slate-200 text-red-600 hover:bg-red-50"
                      aria-label="Delete"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          {!loading && rows.length === 0 && (
            <tr>
              <td colSpan={6} className="px-5 py-8 text-center text-slate-500">
                No articles found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-5 py-3 text-xs text-slate-600">
          <span>
            Showing {showStart}-{showEnd} of {total}
          </span>
          <div className="flex items-center gap-1">
            <button
              disabled={page <= 1}
              onClick={() => onPageChange(page - 1)}
              className="grid h-7 w-7 place-items-center rounded border border-slate-200 bg-white disabled:opacity-40"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </button>
            <span className="px-2">
              {page} / {totalPages}
            </span>
            <button
              disabled={page >= totalPages}
              onClick={() => onPageChange(page + 1)}
              className="grid h-7 w-7 place-items-center rounded border border-slate-200 bg-white disabled:opacity-40"
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
