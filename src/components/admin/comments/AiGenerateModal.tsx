import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Sparkles, X, Clock, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import {
  generateDummyCommentsFn,
  lookupArticleByUrlOrSlugFn,
  extractSlugFromUrl,
  type CommentRow,
} from "@/lib/comments.functions";
import { useSiteSettings } from "@/components/site/AdSettingsContext";
import { AiArticlePicker } from "./AiArticlePicker";
import { AiRepliesConfig } from "./AiRepliesConfig";
import { AiPromptSettings } from "./AiPromptSettings";

interface AiGenerateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  replyTarget?: CommentRow | null;
}

export function AiGenerateModal({ isOpen, onClose, onSuccess, replyTarget }: AiGenerateModalProps) {
  const siteSettings = useSiteSettings();
  const planType = (siteSettings?.licenseType || "").toLowerCase();
  const isEnterprisePlus =
    planType.includes("enterprise plus") ||
    planType.includes("enterprise+");

  const [aiPublicUserId, setAiPublicUserId] = useState("");
  const [aiArticleInput, setAiArticleInput] = useState("");
  const [aiArticleSlug, setAiArticleSlug] = useState("");
  const [resolvedArticle, setResolvedArticle] = useState<{
    id: number;
    title: string;
    slug: string;
    category?: string;
    featuredImage?: string;
  } | null>(null);
  const [fetchingArticle, setFetchingArticle] = useState(false);
  const [fetchError, setFetchError] = useState("");
  const [aiCount, setAiCount] = useState(5);
  const [aiPositivity, setAiPositivity] = useState(80);
  const [aiLanguage, setAiLanguage] = useState("random_mix");
  const [aiCustomPrompt, setAiCustomPrompt] = useState("");
  const [aiAllowSlang, setAiAllowSlang] = useState(true);
  const [aiTimeSpread, setAiTimeSpread] = useState("past_3_days");
  const [aiIncludeReplies, setAiIncludeReplies] = useState(true);
  const [aiReplyCount, setAiReplyCount] = useState(1);
  const [targetReplyComment, setTargetReplyComment] = useState<CommentRow | null>(replyTarget || null);
  const [aiGenerating, setAiGenerating] = useState(false);

  const maxReplies = Math.max(1, aiCount - 1);
  const effectiveReplyCount = Math.min(Math.max(1, aiReplyCount), maxReplies);

  const generateAiComments = useServerFn(generateDummyCommentsFn);
  const lookupArticleFn = useServerFn(lookupArticleByUrlOrSlugFn);

  // Sync replyTarget when modal opens
  useEffect(() => {
    if (isOpen && replyTarget) {
      setTargetReplyComment(replyTarget);
      setAiArticleInput(replyTarget.articleSlug);
      handleFetchArticle(replyTarget.articleSlug);
      setAiCount(2); // default 2 replies when targeting a comment
    } else if (isOpen && !replyTarget) {
      setTargetReplyComment(null);
    }
  }, [isOpen, replyTarget]);

  // Auto fetch article by URL or slug
  const handleFetchArticle = async (rawInput: string) => {
    const trimmed = (rawInput || "").trim();
    if (!trimmed) {
      setResolvedArticle(null);
      setAiArticleSlug("");
      setFetchError("");
      return;
    }
    try {
      setFetchingArticle(true);
      setFetchError("");
      const res = await lookupArticleFn({ data: trimmed });
      if (res?.found && res.article) {
        setResolvedArticle(res.article);
        setAiArticleSlug(res.article.slug);
        setFetchError("");
      } else {
        setResolvedArticle(null);
        const extracted = extractSlugFromUrl(trimmed);
        setAiArticleSlug(extracted);
        setFetchError("Article not found with this URL or slug. Please verify the link.");
      }
    } catch (err: any) {
      setResolvedArticle(null);
      setFetchError(err.message || "Failed to fetch article details");
    } finally {
      setFetchingArticle(false);
    }
  };

  // Debounced auto-fetch when user types or pastes an article URL or slug
  useEffect(() => {
    if (!isOpen) return;
    if (!aiArticleInput.trim()) {
      setResolvedArticle(null);
      setAiArticleSlug("");
      setFetchError("");
      return;
    }
    const timer = setTimeout(() => {
      handleFetchArticle(aiArticleInput);
    }, 450);
    return () => clearTimeout(timer);
  }, [aiArticleInput, isOpen]);

  const resetForm = () => {
    setAiPublicUserId("");
    setAiCustomPrompt("");
    setAiArticleInput("");
    setAiArticleSlug("");
    setResolvedArticle(null);
    setFetchError("");
    setAiCount(5);
    setAiPositivity(80);
    setAiLanguage("random_mix");
    setAiTimeSpread("past_3_days");
    setAiIncludeReplies(true);
    setAiReplyCount(1);
    setTargetReplyComment(null);
  };

  const handleGenerateAi = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isEnterprisePlus) {
      toast.error("Generate AI Comments is exclusively available on Enterprise Plus licenses.");
      return;
    }
    const targetSlug = aiArticleSlug || extractSlugFromUrl(aiArticleInput);
    if (!targetSlug || aiCount < 1) {
      toast.error("Please enter or paste an article URL / slug");
      return;
    }
    try {
      setAiGenerating(true);
      const res = await generateAiComments({
        data: {
          publicUserIds: aiPublicUserId,
          articleSlug: targetSlug,
          count: aiCount,
          positivity: aiPositivity,
          language: aiLanguage,
          customPrompt: aiCustomPrompt,
          allowSlang: aiAllowSlang,
          timeSpread: aiTimeSpread,
          includeReplies: !targetReplyComment && aiIncludeReplies,
          replyCount: !targetReplyComment && aiIncludeReplies ? effectiveReplyCount : 0,
          replyToCommentId: targetReplyComment?.id ?? null,
        },
      });
      toast.success(
        `Successfully generated ${res.count} realistic ${targetReplyComment ? "replies" : "comments"}!`,
      );
      resetForm();
      onClose();
      onSuccess();
    } catch (err: any) {
      toast.error(err.message || "Failed to generate comments");
    } finally {
      setAiGenerating(false);
    }
  };

  if (!isOpen || !isEnterprisePlus) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="w-full max-w-xl rounded-2xl bg-white shadow-2xl overflow-hidden my-6">
        <div className="flex items-center justify-between border-b border-slate-100 bg-gradient-to-r from-blue-50/80 to-indigo-50/80 px-6 py-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-blue-600" />
              {targetReplyComment
                ? `Generate AI Reply to Comment #${targetReplyComment.id}`
                : "Generate AI Comments"}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Simulate realistic Tripura reader reactions with Bengali, Banglish &amp; Indian English
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-white hover:text-slate-600 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleGenerateAi} className="p-6 space-y-4 max-h-[82vh] overflow-y-auto">
          {/* Direct Reply Target Banner (if replying to a specific comment) */}
          {targetReplyComment && (
            <div className="rounded-xl border border-sky-200 bg-sky-50/80 p-3 flex items-start justify-between gap-3 animate-in fade-in duration-150">
              <div className="flex items-start gap-2.5">
                <MessageSquare className="h-4 w-4 text-sky-600 mt-0.5 shrink-0" />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-sky-800 bg-sky-100 px-2 py-0.5 rounded-full">
                      Replying to #{targetReplyComment.id}
                    </span>
                    <span className="text-xs font-bold text-slate-800">
                      {targetReplyComment.user || "Anonymous"}
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 mt-1 line-clamp-2 italic bg-white/80 p-1.5 rounded border border-sky-100">
                    "{targetReplyComment.body}"
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setTargetReplyComment(null)}
                className="text-xs text-slate-400 hover:text-slate-600 p-1 rounded transition shrink-0"
                title="Cancel reply mode and generate top-level comments"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* Target Article URL / Slug & Auto Fetch */}
          <AiArticlePicker
            aiArticleInput={aiArticleInput}
            setAiArticleInput={setAiArticleInput}
            aiArticleSlug={aiArticleSlug}
            fetchingArticle={fetchingArticle}
            onFetchArticle={handleFetchArticle}
            resolvedArticle={resolvedArticle}
            fetchError={fetchError}
          />

          {/* Number of Comments */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="ai-comment-count" className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Number of {targetReplyComment ? "Replies" : "Comments"}
              </label>
              <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                {aiCount} {targetReplyComment ? "Replies" : "Comments"}
              </span>
            </div>
            <input
              id="ai-comment-count"
              type="number"
              required
              min="1"
              max="50"
              value={aiCount}
              onChange={(e) => setAiCount(Math.max(1, Math.min(50, parseInt(e.target.value) || 1)))}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Enter count (1 - 50)"
            />
          </div>

          {/* Comment Timing / Age Spread */}
          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-blue-600" />
                Comment Timing / Age Spread
              </span>
              <span className="text-[10px] text-blue-600 font-semibold bg-blue-50 px-2 py-0.5 rounded-full">
                Realistic Timestamps
              </span>
            </label>
            <select
              value={aiTimeSpread}
              onChange={(e) => setAiTimeSpread(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white font-medium text-slate-800"
            >
              <option value="past_30_mins">⚡ Last 30 Minutes</option>
              <option value="past_1_hour">⚡ Last 1 Hour</option>
              <option value="past_2_hours">🕐 Last 2 Hours</option>
              <option value="past_6_hours">🕒 Last 6 Hours</option>
              <option value="past_12_hours">🕕 Last 12 Hours</option>
              <option value="past_24_hours">⏱️ Last 24 Hours</option>
              <option value="past_3_days">📅 Last 3 Days [Recommended]</option>
              <option value="past_7_days">🗓️ Last 7 Days</option>
              <option value="past_30_days">📆 Last 30 Days</option>
              <option value="just_now">⚡ Just Now</option>
            </select>
            <p className="mt-1 text-[11px] text-slate-500">
              Staggers timestamps naturally across the past so comments show as "1 day ago", "8 hours ago", or "20 mins ago" instead of all at the exact same minute.
            </p>
          </div>

          {/* Conversational Replies Toggle */}
          {!targetReplyComment && aiCount >= 2 && (
            <AiRepliesConfig
              aiCount={aiCount}
              aiIncludeReplies={aiIncludeReplies}
              setAiIncludeReplies={setAiIncludeReplies}
              effectiveReplyCount={effectiveReplyCount}
              maxReplies={maxReplies}
              setAiReplyCount={setAiReplyCount}
            />
          )}

          {/* Language, Prompt, Sentiment & Slang Settings */}
          <AiPromptSettings
            aiLanguage={aiLanguage}
            setAiLanguage={setAiLanguage}
            aiCustomPrompt={aiCustomPrompt}
            setAiCustomPrompt={setAiCustomPrompt}
            aiPositivity={aiPositivity}
            setAiPositivity={setAiPositivity}
            aiAllowSlang={aiAllowSlang}
            setAiAllowSlang={setAiAllowSlang}
          />

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
              onClick={onClose}
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
                  Generating {aiCount} {targetReplyComment ? "Replies" : "Comments"}...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" /> Generate {aiCount} {targetReplyComment ? "Replies" : "Comments"}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
