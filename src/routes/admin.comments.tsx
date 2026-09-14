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
  getAllCommentsFn,
  importCommentsFn,
  generateDummyCommentsFn,
  getRecentArticlesForCommentsFn,
  type CommentRow,
} from "@/lib/comments.functions";
import { CommentTable } from "@/components/admin/comments/CommentTable";
import { CsvImportExport } from "@/components/admin/CsvImportExport";

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
  const getAllFn = useServerFn(getAllCommentsFn);
  const importFn = useServerFn(importCommentsFn);
  const [showDeleteAllModal, setShowDeleteAllModal] = useState(false);
  const [deletingAll, setDeletingAll] = useState(false);

  const handleImport = async (data: CommentRow[]) => {
    try {
      const res = await importFn({ data });
      toast.success(`Successfully imported ${res.inserted} comment${res.inserted !== 1 ? "s" : ""}!`);
      loadComments();
    } catch (err: any) {
      toast.error(err.message || "Import failed");
    }
  };

  const [tab, setTab] = useState<C["status"] | "All">("All");
  const [rows, setRows] = useState<C[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const [showAiModal, setShowAiModal] = useState(false);
  const [aiPublicUserId, setAiPublicUserId] = useState("");
  const [aiArticleSlug, setAiArticleSlug] = useState("");
  const [aiCount, setAiCount] = useState(5);
  const [aiPositivity, setAiPositivity] = useState(80);
  const [aiLanguage, setAiLanguage] = useState("random_mix");
  const [aiCustomPrompt, setAiCustomPrompt] = useState("");
  const [aiGenerating, setAiGenerating] = useState(false);
  const [recentArticles, setRecentArticles] = useState<{ id: number; title: string; slug: string }[]>([]);

  const generateAiComments = useServerFn(generateDummyCommentsFn);
  const getRecentArticlesFn = useServerFn(getRecentArticlesForCommentsFn);

  useEffect(() => {
    if (showAiModal && recentArticles.length === 0) {
      getRecentArticlesFn()
        .then((res) => {
          if (res && res.length > 0) {
            setRecentArticles(res);
            if (!aiArticleSlug) {
              setAiArticleSlug(res[0].slug);
            }
          }
        })
        .catch(() => {});
    }
  }, [showAiModal]);

  const handleGenerateAi = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiArticleSlug || aiCount < 1) {
      toast.error("Please select or enter an article slug/link");
      return;
    }
    try {
      setAiGenerating(true);
      const res = await generateAiComments({
        data: {
          publicUserIds: aiPublicUserId,
          articleSlug: aiArticleSlug,
          count: aiCount,
          positivity: aiPositivity,
          language: aiLanguage,
          customPrompt: aiCustomPrompt,
        },
      });
      toast.success(`Successfully generated ${res.count} realistic comments!`);
      setShowAiModal(false);
      setAiPublicUserId("");
      setAiCustomPrompt("");
      setAiCount(5);
      setAiPositivity(80);
      setAiLanguage("random_mix");
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
            Review, approve, or mark reader comments as spam across articles.{" "}
            <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-700">
              {total.toLocaleString()} total comment{total !== 1 ? "s" : ""}
            </span>
          </p>
        </div>
        <div className="flex items-center gap-3">
          <CsvImportExport
            data={rows}
            getData={getAllFn}
            filename="comments"
            onImport={handleImport}
          />
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
      <div className="flex items-center justify-between border-t border-slate-200 pt-4">
        <p className="text-xs text-slate-500">
          Showing <strong>{rows.length}</strong> of <strong>{total.toLocaleString()}</strong> comment{total !== 1 ? "s" : ""}
          {totalPages > 1 && <> &mdash; Page <strong>{page}</strong> of <strong>{totalPages}</strong></>}
        </p>
        {totalPages > 1 && (
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
        )}
      </div>

      {/* AI Generate Modal */}
      {showAiModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-xl rounded-2xl bg-white shadow-2xl overflow-hidden my-6">
            <div className="flex items-center justify-between border-b border-slate-100 bg-gradient-to-r from-blue-50/80 to-indigo-50/80 px-6 py-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-blue-600" /> Generate AI Comments
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Simulate realistic Tripura reader reactions with Bengali, Banglish & Indian English
                </p>
              </div>
              <button
                onClick={() => setShowAiModal(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-white hover:text-slate-600 transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleGenerateAi} className="p-6 space-y-4 max-h-[82vh] overflow-y-auto">
              {/* Target Article */}
              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Target Article <span className="text-red-500">*</span>
                </label>
                {recentArticles.length > 0 && (
                  <select
                    value={aiArticleSlug}
                    onChange={(e) => setAiArticleSlug(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white mb-2"
                  >
                    <option value="">-- Choose from recent articles --</option>
                    {recentArticles.map((art) => (
                      <option key={art.id} value={art.slug}>
                        {art.title.length > 65 ? art.title.slice(0, 65) + "…" : art.title}
                      </option>
                    ))}
                  </select>
                )}
                <input
                  type="text"
                  required
                  placeholder="Or enter/paste article slug or link (e.g. agartala-smart-city)"
                  value={aiArticleSlug}
                  onChange={(e) => setAiArticleSlug(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
                />
              </div>

              {/* Number of Comments */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Number of Comments
                  </label>
                  <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                    {aiCount} Comments
                  </span>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  {[3, 5, 10, 15, 20].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setAiCount(num)}
                      className={`flex-1 rounded-lg py-1.5 text-xs font-semibold border transition active:scale-95 ${
                        aiCount === num
                          ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                          : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
                <input
                  type="number"
                  required
                  min="1"
                  max="50"
                  value={aiCount}
                  onChange={(e) => setAiCount(Math.max(1, Math.min(50, parseInt(e.target.value) || 1)))}
                  className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Custom number (1 - 50)"
                />
              </div>

              {/* Language & Dialect Mode */}
              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Language & Dialect Mode
                </label>
                <select
                  value={aiLanguage}
                  onChange={(e) => setAiLanguage(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white font-medium text-slate-800"
                >
                  <option value="random_mix">
                    ✨ Natural Random Mix (Tripura Bengali + Banglish + Indian English) [Recommended]
                  </option>
                  <option value="Bengali">
                    বাংলা - Tripura Spoken Bengali (বাংলা হরফে স্থানীয় কথ্য টান)
                  </option>
                  <option value="Banglish">
                    Banglish - Bengali in Roman English letters (e.g. 'Khub bhalo udyog')
                  </option>
                  <option value="English">
                    Indian English - Local news reader tone (e.g. 'Good step by authorities')
                  </option>
                  <option value="CodeMixed">
                    Code-Mixed - Bangla + English blend ('Ei decision-ta accurate')
                  </option>
                </select>
                <p className="mt-1 text-[11px] text-slate-500">
                  {aiLanguage === "random_mix"
                    ? "Randomly distributes comments: one in Bengali script, one in Banglish, one in Indian English, and one code-mixed for total realism."
                    : "Generates all comments in this specific linguistic style."}
                </p>
              </div>

              {/* Admin Custom Prompt / Focus Keywords */}
              <div className="rounded-xl border border-blue-200 bg-blue-50/60 p-3.5 space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-blue-950 flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5 text-blue-600" />
                    Custom AI Focus / Keywords (Optional)
                  </label>
                  <span className="text-[10px] font-semibold text-blue-700 bg-blue-100/80 px-2 py-0.5 rounded-full">
                    Topic Guidance
                  </span>
                </div>
                <textarea
                  rows={2}
                  value={aiCustomPrompt}
                  onChange={(e) => setAiCustomPrompt(e.target.value)}
                  placeholder="e.g. Focus on road conditions and mention AMC; or Praise the Chief Minister's decision; or Question when electricity issue will be resolved"
                  className="w-full rounded-lg border border-blue-200 bg-white p-2.5 text-xs text-slate-800 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <p className="text-[11px] text-blue-800">
                  Enter any specific words, issues, or viewpoints you want the simulated readers to talk about.
                </p>
              </div>

              {/* Sentiment Ratio */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Sentiment Ratio
                  </label>
                  <span className="text-xs font-semibold text-slate-600">
                    <span className="text-emerald-600 font-bold">{aiPositivity}% Supportive</span> /{" "}
                    <span className="text-amber-600 font-bold">{100 - aiPositivity}% Critical / Questioning</span>
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={aiPositivity}
                  onChange={(e) => setAiPositivity(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
                  <span>0% (All Critical)</span>
                  <span>50% (Balanced)</span>
                  <span>100% (All Supportive)</span>
                </div>
              </div>

              {/* User Public IDs */}
              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-700">
                  User Public IDs (Optional)
                </label>
                <input
                  type="text"
                  placeholder="Leave blank for auto-random real users, or enter: 1000000001, 1000000002"
                  value={aiPublicUserId}
                  onChange={(e) => setAiPublicUserId(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <p className="mt-1 text-[11px] text-slate-500">
                  Leave blank to automatically assign comments to random real registered users from your database.
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAiModal(false)}
                  className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={aiGenerating || !aiArticleSlug}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2 text-xs font-semibold text-white hover:bg-blue-700 shadow-md shadow-blue-500/20 disabled:opacity-50 transition active:scale-95"
                >
                  {aiGenerating ? (
                    <>
                      <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Generating {aiCount} Comments...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" /> Generate {aiCount} Comments
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
