import { lazy, Suspense, useCallback, useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Pencil, Trash2, Plus, Search, Eye, ChevronLeft, ChevronRight, FileText, CheckCircle2, Clock, Files, Loader2, Image as ImageIcon } from "lucide-react";
import { sections, slugify } from "@/lib/news-data";
import { toast } from "sonner";
import { type Row } from "@/components/admin/ArticleEditor";
import { blankRow } from "@/lib/articles-store";
import { getAdminArticles, saveAdminArticle, deleteAdminArticle, deleteAdminArticlesBulk, getAllAdminArticles, importAdminArticles } from "@/lib/articles.functions";
import { useDebounce } from "@/hooks/useDebounce";
import { ConfirmModal } from "@/components/admin/ConfirmModal";
import { CsvImportExport } from "@/components/admin/CsvImportExport";

type Status = Row["status"];
const STATUS_TABS: { key: "All" | Status; label: string; icon: typeof FileText }[] = [
  { key: "All", label: "All", icon: Files },
  { key: "Published", label: "Published", icon: CheckCircle2 },
  { key: "Draft", label: "Drafts", icon: FileText },
  { key: "Review", label: "In Review", icon: Clock },
];

const ArticleEditor = lazy(() => import("@/components/admin/ArticleEditor"));

export const Route = createFileRoute("/admin/articles")({
  component: ArticlesPage,
});

const PAGE_SIZE = 20;

function ArticlesPage() {
  const fetchArticlesFn = useServerFn(getAdminArticles);
  const saveArticleFn = useServerFn(saveAdminArticle);
  const deleteArticleFn = useServerFn(deleteAdminArticle);
  const deleteArticlesBulkFn = useServerFn(deleteAdminArticlesBulk);
  const getAllArticlesFn = useServerFn(getAllAdminArticles);
  const importArticlesFn = useServerFn(importAdminArticles);

  const [rows, setRows] = useState<Row[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  // Filters (server-side)
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("All");
  const [status, setStatus] = useState<"All" | Status>("All");
  const [page, setPage] = useState(1);

  // Debounce search input — only fires server request after 300ms of no typing
  const debouncedQ = useDebounce(q, 300);

  // Selection state
  const [selected, setSelected] = useState<Set<number>>(new Set());

  // Editor state
  const [editing, setEditing] = useState<Row | null>(null);
  const [creating, setCreating] = useState(false);

  // CSV state
  const [csvData, setCsvData] = useState<any[]>([]);

  // Confirm modal state (replaces browser confirm())
  const [confirmAction, setConfirmAction] = useState<{
    title: string;
    message: string;
    confirmLabel: string;
    onConfirm: () => void;
  } | null>(null);

  // ─── Fetch from server (paginated) ─────────────────────────────────────────
  const fetchArticles = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetchArticlesFn({
        data: { q: debouncedQ, category: cat, status, page, limit: PAGE_SIZE },
      });
      setRows((res.rows ?? []) as Row[]);
      setTotal(res.total ?? 0);
      setTotalPages(res.totalPages ?? 1);
    } catch (err: any) {
      toast.error(err.message || "Failed to load articles");
    } finally {
      setLoading(false);
    }
  }, [debouncedQ, cat, status, page]);

  // Load all for export
  useEffect(() => {
    getAllArticlesFn().then(res => setCsvData(res)).catch(console.error);
  }, [rows]);

  const handleImport = async (data: any[]) => {
    try {
      setLoading(true);
      await importArticlesFn({ data });
      await fetchArticles();
      const all = await getAllArticlesFn();
      setCsvData(all);
    } catch (err: any) {
      toast.error(err.message || "Import failed");
    } finally {
      setLoading(false);
    }
  };

  // Re-fetch whenever filters/page/debounced-search change
  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  // Reset to page 1 when filters change (but NOT when page itself changes)
  useEffect(() => {
    setPage(1);
  }, [debouncedQ, cat, status]);

  // ─── Selection helpers ─────────────────────────────────────────────────────
  const pageIds = rows.map((r) => r.id);
  const allOnPageSelected = pageIds.length > 0 && pageIds.every((id) => selected.has(id));
  const someSelected = selected.size > 0;

  const togglePage = () => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (allOnPageSelected) pageIds.forEach((id) => next.delete(id));
      else pageIds.forEach((id) => next.add(id));
      return next;
    });
  };
  const toggleOne = (id: number) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  // ─── Delete (single) ──────────────────────────────────────────────────────
  const requestDelete = (id: number, title: string) => {
    setConfirmAction({
      title: "Delete Article?",
      message: `"${title}" will be permanently deleted. This cannot be undone.`,
      confirmLabel: "Delete",
      onConfirm: async () => {
        setConfirmAction(null);
        try {
          await deleteArticleFn({ data: id });
          setSelected((prev) => { const n = new Set(prev); n.delete(id); return n; });
          toast.success("Article deleted");
          fetchArticles(); // re-fetch to get accurate counts
        } catch (err: any) {
          toast.error(err.message || "Failed to delete article");
        }
      },
    });
  };

  // ─── Delete (bulk) ─────────────────────────────────────────────────────────
  const requestBulkDelete = () => {
    if (selected.size === 0) return;
    setConfirmAction({
      title: `Delete ${selected.size} article(s)?`,
      message: "All selected articles will be permanently deleted. This cannot be undone.",
      confirmLabel: `Delete ${selected.size}`,
      onConfirm: async () => {
        setConfirmAction(null);
        try {
          await deleteArticlesBulkFn({ data: Array.from(selected) });
          toast.success(`${selected.size} article(s) deleted`);
          setSelected(new Set());
          fetchArticles();
        } catch (err: any) {
          toast.error(err.message || "Failed to delete articles");
        }
      },
    });
  };

  // ─── Save ──────────────────────────────────────────────────────────────────
  const save = async (r: Row) => {
    try {
      const final = { ...r, slug: r.slug || slugify(r.title), ogImage: r.ogImage || r.featuredImage };
      await saveArticleFn({ data: final });
      toast.success("Article saved");
      setEditing(null);
      setCreating(false);
      fetchArticles(); // re-fetch to reflect changes
    } catch (err: any) {
      toast.error(err.message || "Failed to save article");
    }
  };

  // ─── Derived ───────────────────────────────────────────────────────────────
  const showStart = total > 0 ? (page - 1) * PAGE_SIZE + 1 : 0;
  const showEnd = Math.min(page * PAGE_SIZE, total);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Articles</h1>
          <p className="text-sm text-slate-500">Manage news posts, drafts, and reviews.</p>
        </div>
        <div className="flex items-center gap-2">
          <CsvImportExport
            data={csvData}
            filename="articles"
            onImport={handleImport}
          />
          <button onClick={() => setCreating(true)} className="inline-flex items-center gap-2 rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800">
            <Plus className="h-4 w-4" /> New Article
          </button>
        </div>
      </div>

      {/* Status tabs */}
      <div className="flex flex-wrap items-center gap-2 rounded-lg border border-slate-200 bg-white p-2">
        {STATUS_TABS.map((t) => {
          const active = status === t.key;
          const Icon = t.icon;
          return (
            <button
              key={t.key}
              onClick={() => setStatus(t.key)}
              className={`inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${active ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-100"}`}
            >
              <Icon className="h-3.5 w-3.5" />
              {t.label}
            </button>
          );
        })}
        {/* Total count badge */}
        <span className="ml-auto rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
          {total} total
        </span>
      </div>

      {/* Search + category filter bar */}
      <div className="flex flex-wrap items-center gap-3 rounded-lg border border-slate-200 bg-white p-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search articles..."
            className="w-full rounded-md border border-slate-200 py-2 pl-9 pr-3 text-sm focus:border-slate-900 focus:outline-none"
          />
          {q && debouncedQ !== q && (
            <Loader2 className="absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 animate-spin text-slate-400" />
          )}
        </div>
        <select
          value={cat}
          onChange={(e) => setCat(e.target.value)}
          className="rounded-md border border-slate-200 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none"
        >
          <option>All</option>
          {sections.map((s) => <option key={s}>{s}</option>)}
        </select>
        {someSelected && (
          <button onClick={requestBulkDelete} className="inline-flex items-center gap-2 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-100">
            <Trash2 className="h-3.5 w-3.5" /> Delete ({selected.size})
          </button>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
        <table className="w-full min-w-[700px] text-sm">
          <thead className="bg-slate-50 text-left text-xs uppercase tracking-wider text-slate-500">
            <tr>
              <th className="w-10 px-5 py-3">
                <input type="checkbox" checked={allOnPageSelected} onChange={togglePage} className="h-4 w-4 cursor-pointer rounded border-slate-300" aria-label="Select all on page" />
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
                    <span>Loading articles…</span>
                  </div>
                </td>
              </tr>
            )}
            {!loading && rows.map((r) => (
              <tr key={r.id} className={`hover:bg-slate-50/60 ${selected.has(r.id) ? "bg-slate-50" : ""}`}>
                <td className="px-5 py-3">
                  <input type="checkbox" checked={selected.has(r.id)} onChange={() => toggleOne(r.id)} className="h-4 w-4 cursor-pointer rounded border-slate-300" aria-label={`Select ${r.title}`} />
                </td>
                <td className="max-w-[360px] px-5 py-3">
                  <div className="flex items-center gap-3">
                    {/* Thumbnail — lazy loaded with fixed dimensions to prevent layout shift */}
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
                        <p className="truncate font-medium" title={r.title}>{r.title}</p>
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
                <td className="px-5 py-3 text-slate-600"><span className="inline-flex items-center gap-1"><Eye className="h-3 w-3" />{(r.views ?? 0).toLocaleString()}</span></td>
                <td className="px-5 py-3 text-right">
                  <div className="inline-flex gap-2">
                    <button onClick={() => setEditing(r)} className="grid h-8 w-8 place-items-center rounded-md border border-slate-200 hover:bg-slate-100" aria-label="Edit"><Pencil className="h-3.5 w-3.5" /></button>
                    <button onClick={() => requestDelete(r.id, r.title)} className="grid h-8 w-8 place-items-center rounded-md border border-slate-200 text-red-600 hover:bg-red-50" aria-label="Delete"><Trash2 className="h-3.5 w-3.5" /></button>
                  </div>
                </td>
              </tr>
            ))}
            {!loading && rows.length === 0 && (
              <tr><td colSpan={6} className="px-5 py-8 text-center text-slate-500">No articles found.</td></tr>
            )}
          </tbody>
        </table>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-5 py-3 text-xs text-slate-600">
            <span>Showing {showStart}–{showEnd} of {total}</span>
            <div className="flex items-center gap-1">
              <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="grid h-7 w-7 place-items-center rounded border border-slate-200 bg-white disabled:opacity-40"><ChevronLeft className="h-3.5 w-3.5" /></button>
              <span className="px-2">{page} / {totalPages}</span>
              <button disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)} className="grid h-7 w-7 place-items-center rounded border border-slate-200 bg-white disabled:opacity-40"><ChevronRight className="h-3.5 w-3.5" /></button>
            </div>
          </div>
        )}
      </div>

      {/* ArticleEditor modal (lazy loaded) */}
      {(editing || creating) && (
        <Suspense fallback={<div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/60 text-sm text-white">Loading editor…</div>}>
          <ArticleEditor
            initial={editing ?? blankRow()}
            onClose={() => { setEditing(null); setCreating(false); }}
            onSave={save}
          />
        </Suspense>
      )}

      {/* Confirm Modal (replaces browser confirm()) */}
      {confirmAction && (
        <ConfirmModal
          title={confirmAction.title}
          message={confirmAction.message}
          confirmLabel={confirmAction.confirmLabel}
          danger
          onConfirm={confirmAction.onConfirm}
          onCancel={() => setConfirmAction(null)}
        />
      )}
    </div>
  );
}
