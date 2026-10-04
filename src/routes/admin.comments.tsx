import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Trash2,
  CheckSquare,
  Check,
  X,
  ShieldAlert,
} from "lucide-react";
import { toast } from "sonner";
import {
  getAdminComments,
  updateCommentStatus,
  deleteComment,
  deleteCommentsBulk,
  updateCommentsBulkStatus,
  getAllCommentsFn,
  importCommentsFn,
  type CommentRow,
} from "@/lib/comments.functions";
import { CommentTable } from "@/components/admin/comments/CommentTable";
import { CommentFilterBar } from "@/components/admin/comments/CommentFilterBar";
import { AiGenerateModal } from "@/components/admin/comments/AiGenerateModal";
import { DeleteAllModal } from "@/components/admin/comments/DeleteAllModal";
import { CsvImportExport } from "@/components/admin/CsvImportExport";
import { useSiteSettings } from "@/components/site/AdSettingsContext";
import { isEnterprisePlusLicense } from "@/lib/site-content";

export const Route = createFileRoute("/admin/comments")({
  component: CommentsPage,
});

type C = CommentRow;

const tabs: Array<C["status"] | "All"> = ["All", "Pending", "Approved", "Spam"];

function CommentsPage() {
  const siteSettings = useSiteSettings();
  const isEnterprisePlus = isEnterprisePlusLicense(siteSettings);

  const getCommentsFn = useServerFn(getAdminComments);
  const updateStatusFn = useServerFn(updateCommentStatus);
  const deleteCommentFn = useServerFn(deleteComment);
  const deleteBulkFn = useServerFn(deleteCommentsBulk);
  const updateStatusBulkFn = useServerFn(updateCommentsBulkStatus);
  const getAllFn = useServerFn(getAllCommentsFn);
  const importFn = useServerFn(importCommentsFn);

  const [tab, setTab] = useState<C["status"] | "All">("All");
  const [rows, setRows] = useState<C[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const [showAiModal, setShowAiModal] = useState(false);
  const [replyTargetComment, setReplyTargetComment] = useState<CommentRow | null>(null);
  const [showDeleteAllModal, setShowDeleteAllModal] = useState(false);

  const loadComments = async () => {
    try {
      setLoading(true);
      const res = await getCommentsFn({ data: { status: tab, q, page, limit: 20 } });
      setRows(res.rows);
      setTotalPages(res.totalPages);
      setTotal(res.total);
    } catch (err: any) {
      toast.error(err.message || "Failed to load comments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadComments();
  }, [tab, q, page]);

  const handleImport = async (data: CommentRow[]) => {
    try {
      const res = await importFn({ data });
      toast.success(`Successfully imported ${res.inserted} comment${res.inserted !== 1 ? "s" : ""}!`);
      loadComments();
    } catch (err: any) {
      toast.error(err.message || "Import failed");
    }
  };

  const setStatus = async (id: number, status: C["status"]) => {
    try {
      await updateStatusFn({ data: { id, status } });
      toast.success(`Comment marked as ${status}`);
      loadComments();
    } catch (err: any) {
      toast.error(err.message || "Failed to update comment");
    }
  };

  const remove = async (id: number) => {
    if (!confirm("Delete this comment permanently?")) return;
    try {
      await deleteCommentFn({ data: id });
      toast.success("Comment deleted");
      loadComments();
    } catch (err: any) {
      toast.error(err.message || "Failed to delete comment");
    }
  };

  const allSelected =
    rows.length > 0 && rows.every((r) => selectedIds.has(r.id));

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(rows.map((r) => r.id)));
    }
  };

  const toggleSelectOne = (id: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) return;
    if (
      !confirm(
        `Are you sure you want to permanently delete ${selectedIds.size} selected comment(s)?`,
      )
    )
      return;
    try {
      const ids = Array.from(selectedIds);
      const res = await deleteBulkFn({ data: ids });
      toast.success(`Successfully deleted ${res.count} comment(s)`);
      setSelectedIds(new Set());
      loadComments();
    } catch (err: any) {
      toast.error(err.message || "Failed to delete selected comments");
    }
  };

  const handleBulkStatus = async (status: "Approved" | "Spam") => {
    if (selectedIds.size === 0) return;
    try {
      const ids = Array.from(selectedIds);
      const res = await updateStatusBulkFn({ data: { ids, status } });
      toast.success(`Marked ${res.count} comment(s) as ${status}`);
      setSelectedIds(new Set());
      loadComments();
    } catch (err: any) {
      toast.error(err.message || "Failed to update comments status");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Moderation</h1>
          <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600">
            {total.toLocaleString()} Total Comments
          </span>
        </div>
        <div className="flex items-center gap-1.5 sm:gap-2">
          <CsvImportExport
            data={rows}
            getData={getAllFn}
            filename="comments"
            onImport={handleImport}
            iconOnly
          />
          {isEnterprisePlus && (
            <button
              onClick={() => {
                setReplyTargetComment(null);
                setShowAiModal(true);
              }}
              title="AI Generate Comments"
              aria-label="AI Generate Comments"
              className="h-9 w-9 inline-flex items-center justify-center rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition shadow-xs shrink-0"
            >
              <Sparkles className="h-4 w-4" />
            </button>
          )}
          <button
            onClick={() => setShowDeleteAllModal(true)}
            title="Delete All Comments"
            aria-label="Delete All Comments"
            className="h-9 w-9 inline-flex items-center justify-center rounded-lg bg-red-600 text-white hover:bg-red-700 transition shadow-xs shrink-0"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Tabs & Search */}
      <CommentFilterBar
        tabs={tabs}
        currentTab={tab}
        onTabChange={(t) => {
          setTab(t);
          setPage(1);
          setSelectedIds(new Set());
        }}
        searchQuery={q}
        onSearchChange={(query) => {
          setQ(query);
          setPage(1);
          setSelectedIds(new Set());
        }}
      />

      {/* Bulk Actions Bar */}
      {selectedIds.size > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-800 bg-slate-900 px-4 py-3 text-white shadow-lg animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <CheckSquare className="h-4 w-4 text-emerald-400" />
            <span>
              {selectedIds.size} comment{selectedIds.size !== 1 ? "s" : ""} selected
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => handleBulkStatus("Approved")}
              className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/15 px-3 py-1.5 text-xs font-semibold text-emerald-300 hover:bg-emerald-500/25 transition-colors cursor-pointer"
            >
              <Check className="h-3.5 w-3.5 text-emerald-400" /> Approve Selected
            </button>
            <button
              onClick={() => handleBulkStatus("Spam")}
              className="inline-flex items-center gap-1.5 rounded-lg border border-amber-500/30 bg-amber-500/15 px-3 py-1.5 text-xs font-semibold text-amber-300 hover:bg-amber-500/25 transition-colors cursor-pointer"
            >
              <ShieldAlert className="h-3.5 w-3.5 text-amber-400" /> Mark as Spam
            </button>
            <button
              onClick={handleBulkDelete}
              className="inline-flex items-center gap-1.5 rounded-lg border border-red-500/30 bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-700 transition-colors shadow-sm cursor-pointer"
            >
              <Trash2 className="h-3.5 w-3.5" /> Delete Selected
            </button>
            <button
              onClick={() => setSelectedIds(new Set())}
              className="ml-1 grid h-7 w-7 place-items-center rounded-lg border border-slate-700 bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white cursor-pointer"
              title="Clear selection"
              aria-label="Clear selection"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Comment Table */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-900 border-t-transparent"></div>
        </div>
      ) : (
        <CommentTable
          comments={rows}
          selectedIds={selectedIds}
          allSelected={allSelected}
          onToggleSelectAll={toggleSelectAll}
          onToggleSelectOne={toggleSelectOne}
          onSetStatus={setStatus}
          onDelete={remove}
          onAiReply={
            isEnterprisePlus
              ? (c) => {
                  setReplyTargetComment(c);
                  setShowAiModal(true);
                }
              : undefined
          }
        />
      )}

      {/* Server Pagination */}
      <div className="flex items-center justify-between border-t border-slate-200 pt-4">
        <p className="text-xs text-slate-500">
          Showing <strong>{rows.length}</strong> of <strong>{total.toLocaleString()}</strong> comment{total !== 1 ? "s" : ""}
          {totalPages > 1 && <> &mdash; Page <strong>{page}</strong> of <strong>{totalPages}</strong></>}
        </p>
        {totalPages > 1 && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setPage((p) => Math.max(1, p - 1));
                setSelectedIds(new Set());
              }}
              disabled={page <= 1}
              className="inline-flex items-center gap-1 rounded-md border border-slate-200 px-3 py-1.5 text-xs font-medium hover:bg-slate-50 disabled:opacity-40"
            >
              <ChevronLeft className="h-3.5 w-3.5" /> Previous
            </button>
            <button
              onClick={() => {
                setPage((p) => Math.min(totalPages, p + 1));
                setSelectedIds(new Set());
              }}
              disabled={page >= totalPages}
              className="inline-flex items-center gap-1 rounded-md border border-slate-200 px-3 py-1.5 text-xs font-medium hover:bg-slate-50 disabled:opacity-40"
            >
              Next <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* AI Generate Modal */}
      {isEnterprisePlus && (
        <AiGenerateModal
          isOpen={showAiModal}
          onClose={() => {
            setShowAiModal(false);
            setReplyTargetComment(null);
          }}
          replyTarget={replyTargetComment}
          onSuccess={loadComments}
        />
      )}

      {/* Delete All Confirmation Modal */}
      <DeleteAllModal
        isOpen={showDeleteAllModal}
        tab={tab}
        onClose={() => setShowDeleteAllModal(false)}
        onSuccess={loadComments}
      />
    </div>
  );
}
