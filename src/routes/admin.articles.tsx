import { lazy, Suspense, useCallback, useEffect, useState } from "react";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Plus } from "lucide-react";
import { slugify } from "@/lib/news-data";
import { toast } from "sonner";
import { type Row } from "@/components/admin/ArticleEditor";
import { blankRow } from "@/lib/articles-store";
import { authClient as supabase } from "@/lib/auth-client";
import {
  getAdminArticles,
  getAdminArticleById,
  saveAdminArticle,
  trashAdminArticle,
  restoreAdminArticle,
  deletePermanentlyAdminArticle,
  trashAdminArticlesBulk,
  restoreAdminArticlesBulk,
  deletePermanentlyAdminArticlesBulk,
  emptyTrashAdminArticles,
  getAllAdminArticles,
  importAdminArticles,
  getAdminAuthorProfiles,
} from "@/lib/articles.functions";
import { useDebounce } from "@/hooks/useDebounce";
import { ConfirmModal } from "@/components/admin/ConfirmModal";
import { CsvImportExport } from "@/components/admin/CsvImportExport";
import { ArticlesStatusTabs } from "@/components/admin/articles/ArticlesStatusTabs";
import { ArticlesFilterBar } from "@/components/admin/articles/ArticlesFilterBar";
import { ArticlesTable } from "@/components/admin/articles/ArticlesTable";
import type { ArticleStatus } from "@/components/admin/articles/types";

import { useCategories } from "@/components/site/AdSettingsContext";

const ArticleEditor = lazy(() => import("@/components/admin/ArticleEditor"));

export const Route = createFileRoute("/admin/articles")({
  head: () => ({
    meta: [
      { title: "Manage Articles - Admin Dashboard" },
      { name: "description", content: "Create, edit, filter, and manage published and drafted articles." },
    ],
  }),
  component: ArticlesPage,
});

const PAGE_SIZE = 20;

function ArticlesPage() {
  const router = useRouter();
  const fetchArticlesFn = useServerFn(getAdminArticles);
  const fetchArticleByIdFn = useServerFn(getAdminArticleById);
  const saveArticleFn = useServerFn(saveAdminArticle);
  const trashArticleFn = useServerFn(trashAdminArticle);
  const restoreArticleFn = useServerFn(restoreAdminArticle);
  const deletePermanentlyArticleFn = useServerFn(deletePermanentlyAdminArticle);
  const trashArticlesBulkFn = useServerFn(trashAdminArticlesBulk);
  const restoreArticlesBulkFn = useServerFn(restoreAdminArticlesBulk);
  const deletePermanentlyArticlesBulkFn = useServerFn(deletePermanentlyAdminArticlesBulk);
  const emptyTrashFn = useServerFn(emptyTrashAdminArticles);
  const getAllArticlesFn = useServerFn(getAllAdminArticles);
  const importArticlesFn = useServerFn(importAdminArticles);

  const [rows, setRows] = useState<Row[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [trashCount, setTrashCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // Filters (server-side)
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("All");
  const [status, setStatus] = useState<"All" | ArticleStatus>("All");
  const [page, setPage] = useState(1);

  // Debounce search input — only fires server request after 300ms of no typing
  const debouncedQ = useDebounce(q, 300);

  // Selection state
  const [selected, setSelected] = useState<Set<number>>(new Set());

  // Editor state
  const [editing, setEditing] = useState<Row | null>(null);
  const [creating, setCreating] = useState(false);

  // Confirm modal state (replaces browser confirm())
  const [confirmAction, setConfirmAction] = useState<{
    title: string;
    message: string;
    confirmLabel: string;
    onConfirm: () => void;
  } | null>(null);

  // Author profiles state
  const [currentUserAuthor, setCurrentUserAuthor] = useState("Admin User");
  const [authorOptions, setAuthorOptions] = useState<{ id: string; name: string; username?: string; email?: string; phone?: string; role: string }[]>([]);
  const fetchAuthorProfilesFn = useServerFn(getAdminAuthorProfiles);

  const dbCats = useCategories();
  const defaultCategory =
    dbCats?.find((c) => c?.name?.toLowerCase() === "uncategorized")?.name || "Uncategorized";

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      const u = data.user as any;
      if (u) {
        const name =
          u.displayName ||
          u.user_metadata?.display_name ||
          u.user_metadata?.full_name ||
          u.username ||
          u.email?.split("@")[0] ||
          "Admin User";
        setCurrentUserAuthor(name);
      }
    });

    fetchAuthorProfilesFn()
      .then((res) => {
        if (Array.isArray(res)) setAuthorOptions(res);
      })
      .catch(() => {});
  }, []);

  // Fetch from server (paginated)
  const fetchArticles = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetchArticlesFn({
        data: { q: debouncedQ, category: cat, status, page, limit: PAGE_SIZE },
      });
      setRows((res.rows ?? []) as Row[]);
      setTotal(res.total ?? 0);
      setTotalPages(res.totalPages ?? 1);
      setTrashCount(res.trashCount ?? 0);
    } catch (err: any) {
      toast.error(err.message || "Failed to load articles");
    } finally {
      setLoading(false);
    }
  }, [debouncedQ, cat, status, page]);

  const handleImport = async (data: any[]) => {
    try {
      setLoading(true);
      await importArticlesFn({ data });
      router.invalidate();
      await fetchArticles();
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

  // Selection helpers
  const pageIds = rows.map((r) => r.id);
  const allOnPageSelected = pageIds.length > 0 && pageIds.every((id) => selected.has(id));

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

  // Delete / Trash (single)
  const requestDelete = (id: number, title: string) => {
    if (status === "Trash") {
      setConfirmAction({
        title: "Delete Permanently?",
        message: `"${title}" will be permanently removed from the database. This cannot be undone.`,
        confirmLabel: "Delete Permanently",
        onConfirm: async () => {
          setConfirmAction(null);
          try {
            await deletePermanentlyArticleFn({ data: id });
            router.invalidate();
            setSelected((prev) => {
              const n = new Set(prev);
              n.delete(id);
              return n;
            });
            toast.success("Article permanently deleted");
            fetchArticles();
          } catch (err: any) {
            toast.error(err.message || "Failed to delete article");
          }
        },
      });
    } else {
      setConfirmAction({
        title: "Move to Trash?",
        message: `"${title}" will be moved to the Trash. You can restore it anytime or delete it permanently.`,
        confirmLabel: "Move to Trash",
        onConfirm: async () => {
          setConfirmAction(null);
          try {
            await trashArticleFn({ data: id });
            router.invalidate();
            setSelected((prev) => {
              const n = new Set(prev);
              n.delete(id);
              return n;
            });
            toast.success("Article moved to Trash");
            fetchArticles();
          } catch (err: any) {
            toast.error(err.message || "Failed to move article to Trash");
          }
        },
      });
    }
  };

  // Restore (single)
  const requestRestore = async (id: number, title: string) => {
    try {
      await restoreArticleFn({ data: id });
      router.invalidate();
      setSelected((prev) => {
        const n = new Set(prev);
        n.delete(id);
        return n;
      });
      toast.success(`"${title}" restored to Draft`);
      fetchArticles();
    } catch (err: any) {
      toast.error(err.message || "Failed to restore article");
    }
  };

  // Delete / Trash (bulk)
  const requestBulkDelete = () => {
    if (selected.size === 0) return;
    if (status === "Trash") {
      setConfirmAction({
        title: `Delete ${selected.size} article(s) permanently?`,
        message: "All selected articles will be permanently deleted from the database. This cannot be undone.",
        confirmLabel: `Delete Permanently (${selected.size})`,
        onConfirm: async () => {
          setConfirmAction(null);
          try {
            await deletePermanentlyArticlesBulkFn({ data: Array.from(selected) });
            router.invalidate();
            toast.success(`${selected.size} article(s) permanently deleted`);
            setSelected(new Set());
            fetchArticles();
          } catch (err: any) {
            toast.error(err.message || "Failed to delete articles");
          }
        },
      });
    } else {
      setConfirmAction({
        title: `Move ${selected.size} article(s) to Trash?`,
        message: "Selected articles will be moved to the Trash. You can restore them anytime.",
        confirmLabel: `Move to Trash (${selected.size})`,
        onConfirm: async () => {
          setConfirmAction(null);
          try {
            await trashArticlesBulkFn({ data: Array.from(selected) });
            router.invalidate();
            toast.success(`${selected.size} article(s) moved to Trash`);
            setSelected(new Set());
            fetchArticles();
          } catch (err: any) {
            toast.error(err.message || "Failed to move articles to Trash");
          }
        },
      });
    }
  };

  // Restore (bulk)
  const requestBulkRestore = async () => {
    if (selected.size === 0) return;
    try {
      await restoreArticlesBulkFn({ data: Array.from(selected) });
      router.invalidate();
      toast.success(`${selected.size} article(s) restored to Draft`);
      setSelected(new Set());
      fetchArticles();
    } catch (err: any) {
      toast.error(err.message || "Failed to restore articles");
    }
  };

  // Empty trash
  const requestEmptyTrash = () => {
    setConfirmAction({
      title: "Empty Trash?",
      message: "All articles currently in the Trash will be permanently deleted. This cannot be undone.",
      confirmLabel: "Empty Trash",
      onConfirm: async () => {
        setConfirmAction(null);
        try {
          await emptyTrashFn();
          router.invalidate();
          toast.success("Trash emptied");
          setSelected(new Set());
          fetchArticles();
        } catch (err: any) {
          toast.error(err.message || "Failed to empty trash");
        }
      },
    });
  };

  // Save
  const save = async (r: Row) => {
    try {
      const final = {
        ...r,
        slug: r.slug || slugify(r.title),
        ogImage: r.ogImage || r.featuredImage,
      };
      await saveArticleFn({ data: final });
      router.invalidate();
      toast.success("Saved successfully");
      setEditing(null);
      setCreating(false);
      fetchArticles();
    } catch (err: any) {
      toast.error(err.message || "Failed to save article");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Articles</h1>
          <p className="text-xs sm:text-sm text-slate-500">Manage news posts, drafts, and reviews.</p>
        </div>
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          <CsvImportExport data={rows} getData={getAllArticlesFn} filename="articles" onImport={handleImport} />
          <button
            onClick={() => setCreating(true)}
            className="inline-flex items-center gap-1.5 sm:gap-2 rounded-md bg-slate-900 px-2.5 sm:px-3.5 py-1.5 text-xs sm:text-sm font-medium text-white hover:bg-slate-800 transition whitespace-nowrap shadow-xs"
          >
            <Plus className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> New Article
          </button>
        </div>
      </div>

      {/* Status tabs */}
      <ArticlesStatusTabs status={status} setStatus={setStatus} total={total} trashCount={trashCount} />

      {/* Search + category filter bar */}
      <ArticlesFilterBar
        query={q}
        setQuery={setQ}
        debouncedQuery={debouncedQ}
        category={cat}
        setCategory={setCat}
        selectedCount={selected.size}
        currentStatus={status}
        trashCount={trashCount}
        onRequestBulkDelete={requestBulkDelete}
        onRequestBulkRestore={requestBulkRestore}
        onRequestEmptyTrash={requestEmptyTrash}
      />

      {/* Table */}
      <ArticlesTable
        rows={rows}
        loading={loading}
        selected={selected}
        allOnPageSelected={allOnPageSelected}
        onTogglePage={togglePage}
        onToggleOne={toggleOne}
        onEdit={async (row) => {
          setEditing(row);
          if (row.id) {
            try {
              const full = await fetchArticleByIdFn({ data: row.id });
              if (full) {
                setEditing(full as Row);
              }
            } catch (err) {
              console.warn("Could not fetch full article by ID:", err);
            }
          }
        }}
        onRequestDelete={requestDelete}
        onRestore={requestRestore}
        page={page}
        totalPages={totalPages}
        total={total}
        pageSize={PAGE_SIZE}
        onPageChange={(p) => setPage(p)}
      />

      {/* ArticleEditor modal (lazy loaded) */}
      {(editing || creating) && (
        <Suspense
          fallback={
            <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/60 text-sm text-white">
              Loading editor...
            </div>
          }
        >
          <ArticleEditor
            key={editing ? `edit-${editing.id}` : "create-article"}
            initial={editing ?? blankRow(currentUserAuthor, defaultCategory)}
            currentUserAuthor={currentUserAuthor}
            authorOptions={authorOptions}
            onClose={() => {
              setEditing(null);
              setCreating(false);
            }}
            onSave={save}
          />
        </Suspense>
      )}

      {/* Confirm Modal */}
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
