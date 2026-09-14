import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Search, ChevronLeft, ChevronRight, Sparkles, X, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  getAdminComments,
  updateCommentStatus,
  deleteComment,
  deleteAllCommentsFn,
  generateDummyCommentsFn,
  type CommentRow,
} from "@/lib/comments.functions";
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
  const deleteAllFn = useServerFn(deleteAllCommentsFn);
  const [showDeleteAllModal, setShowDeleteAllModal] = useState(false);
  const [deletingAll, setDeletingAll] = useState(false);

  const [rows, setRows] = useState<C[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<(typeof tabs)[number]>("All");
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const [showAiModal, setShowAiModal] = useState(false);
  const [aiPublicUserId, setAiPublicUserId] = useState("");
  const [aiArticleSlug, setAiArticleSlug] = useState("");
  const [aiCount, setAiCount] = useState(5);
  const [aiPositivity, setAiPositivity] = useState(80);
  const [aiLanguage, setAiLanguage] = useState("Bengali");
  const [aiGenerating, setAiGenerating] = useState(false);
  const generateAiComments = useServerFn(generateDummyCommentsFn);

  const handleGenerateAi = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiPublicUserId || !aiArticleSlug || aiCount < 1) return;
    try {
      setAiGenerating(true);
      const res = await generateAiComments({
        data: {
          publicUserIds: aiPublicUserId,
          articleSlug: aiArticleSlug,
          count: aiCount,
          positivity: aiPositivity,
          language: aiLanguage,
        },
      });
      toast.success(`Successfully generated \${res.count} comments!`);
      setShowAiModal(false);
      setAiPublicUserId("");
      setAiArticleSlug("");
      setAiCount(5);
      setAiPositivity(80);
      setAiLanguage("Bengali");
      loadComments();
    } catch (err: any) {
      toast.error(err.message || "Failed to generate comments");
    } finally {
      setAiGenerating(false);
    }
  };

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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Comment Moderation</h1>
          <p className="text-sm text-slate-500">
            Review, approve, or mark reader comments as spam across articles.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAiModal(true)}
            className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            <Sparkles className="h-4 w-4" /> AI Generate
          </button>
          <button
            onClick={() => setShowDeleteAllModal(true)}
            className="inline-flex items-center gap-2 rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
          >
            <Trash2 className="h-4 w-4" /> Delete All
          </button>
        </div>
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
                tab === t
                  ? "bg-slate-900 text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
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
        <CommentTable comments={rows} onSetStatus={setStatus} onDelete={remove} />
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

      {/* AI Generate Modal */}
      {showAiModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-xl bg-white shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-blue-600" /> Generate AI Comments
              </h2>
              <button
                onClick={() => setShowAiModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleGenerateAi} className="p-6 space-y-5">
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                  User Public IDs (comma separated)
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 1000000000, 1000000001"
                  value={aiPublicUserId}
                  onChange={(e) => setAiPublicUserId(e.target.value)}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <p className="mt-1 text-xs text-slate-500">
                  Multiple Public IDs can be added separated by commas.
                </p>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                  Article Slug / Link
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. my-awesome-article"
                  value={aiArticleSlug}
                  onChange={(e) => setAiArticleSlug(e.target.value)}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                    Number of Comments
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    max="50"
                    value={aiCount}
                    onChange={(e) => setAiCount(parseInt(e.target.value) || 1)}
                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                    Positivity (%)
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    max="100"
                    value={aiPositivity}
                    onChange={(e) => setAiPositivity(parseInt(e.target.value) || 0)}
                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                  Language
                </label>
                <select
                  value={aiLanguage}
                  onChange={(e) => setAiLanguage(e.target.value)}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
                >
                  <option value="Bengali">Bengali</option>
                  <option value="English">English</option>
                  <option value="Hinglish">Hinglish</option>
                  <option value="Mixed (Bengali & English)">Mixed (Bengali & English)</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAiModal(false)}
                  className="rounded-md px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={aiGenerating}
                  className="inline-flex items-center justify-center gap-2 rounded-md bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                >
                  {aiGenerating ? (
                    <>Generating...</>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" /> Generate
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete All Confirmation Modal */}
      {showDeleteAllModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-xl bg-white shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Trash2 className="h-5 w-5 text-red-600" /> Delete All Comments
              </h2>
              <button
                onClick={() => setShowDeleteAllModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6">
              <div className="rounded-lg border border-red-200 bg-red-50 p-4 mb-5">
                <p className="text-sm font-semibold text-red-800 mb-1">⚠️ This action is permanent!</p>
                <p className="text-sm text-red-700">
                  {tab === "All"
                    ? "All comments will be permanently deleted from the database and cannot be recovered."
                    : `All "${tab}" comments will be permanently deleted and cannot be recovered.`}
                </p>
              </div>
              <p className="text-sm text-slate-600 mb-6">
                Currently viewing: <strong>{tab}</strong> tab.
                {tab !== "All" && " Only comments in this tab will be deleted."}
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowDeleteAllModal(false)}
                  disabled={deletingAll}
                  className="rounded-md px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={async () => {
                    try {
                      setDeletingAll(true);
                      await deleteAllFn({ data: { status: tab } });
                      toast.success(`All ${tab === "All" ? "" : tab + " "}comments permanently deleted!`);
                      setShowDeleteAllModal(false);
                      loadComments();
                    } catch (err: any) {
                      toast.error(err.message || "Failed to delete comments");
                    } finally {
                      setDeletingAll(false);
                    }
                  }}
                  disabled={deletingAll}
                  className="inline-flex items-center gap-2 rounded-md bg-red-600 px-5 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
                >
                  <Trash2 className="h-4 w-4" />
                  {deletingAll ? "Deleting..." : `Yes, Delete All ${tab === "All" ? "" : tab}`}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
