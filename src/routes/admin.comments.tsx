import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { getAdminComments, updateCommentStatus, deleteComment, type CommentRow } from "@/lib/comments.functions";
import { CommentTable } from "@/components/admin/comments/CommentTable";

export const Route = createFileRoute("/admin/comments")({
  component: CommentsPage,
});

type C = CommentRow;

const tabs: Array<C["status"] | "All"> = ["All", "Pending", "Approved", "Spam"];

function CommentsPage() {
  const getCommentsFn = useServerFn(getAdminComments);
  const updateStatusFn = useServerFn(updateCommentStatus);
  const deleteCommentFn = useServerFn(deleteComment);

  const [rows, setRows] = useState<C[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<(typeof tabs)[number]>("All");
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Comment Moderation</h1>
        <p className="text-sm text-slate-500">
          Review, approve, or mark reader comments as spam across articles.
        </p>
      </div>

      {/* Tabs & Search */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
        <div className="flex items-center gap-1.5">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => {
                setTab(t);
                setPage(1);
              }}
              className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition ${
                tab === t ? "bg-slate-900 text-white shadow-sm" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setPage(1);
            }}
            placeholder="Search comment content..."
            className="h-9 w-64 rounded-md border border-slate-200 pl-9 pr-3 text-sm focus:border-slate-900 focus:outline-none"
          />
        </div>
      </div>

      {/* Comment Table */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-900 border-t-transparent"></div>
        </div>
      ) : (
        <CommentTable
          comments={rows}
          onSetStatus={setStatus}
          onDelete={remove}
        />
      )}

      {/* Server Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-slate-200 pt-4">
          <p className="text-xs text-slate-500">
            Page <strong>{page}</strong> of <strong>{totalPages}</strong> ({total} total comments)
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="inline-flex items-center gap-1 rounded-md border border-slate-200 px-3 py-1.5 text-xs font-medium hover:bg-slate-50 disabled:opacity-40"
            >
              <ChevronLeft className="h-3.5 w-3.5" /> Previous
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="inline-flex items-center gap-1 rounded-md border border-slate-200 px-3 py-1.5 text-xs font-medium hover:bg-slate-50 disabled:opacity-40"
            >
              Next <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
