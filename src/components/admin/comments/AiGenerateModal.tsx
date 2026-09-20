import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import {
  Sparkles,
  X,
  Flame,
  Link as LinkIcon,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Loader2,
  Clock,
  MessageSquare,
} from "lucide-react";
import { toast } from "sonner";
import {
  generateDummyCommentsFn,
  getRecentArticlesForCommentsFn,
  lookupArticleByUrlOrSlugFn,
  extractSlugFromUrl,
  type CommentRow,
} from "@/lib/comments.functions";
import { useSiteSettings } from "@/components/site/AdSettingsContext";

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
  const [targetReplyComment, setTargetReplyComment] = useState<CommentRow | null>(replyTarget || null);
  const [aiGenerating, setAiGenerating] = useState(false);
  const [recentArticles, setRecentArticles] = useState<{ id: number; title: string; slug: string }[]>([]);

  const generateAiComments = useServerFn(generateDummyCommentsFn);
  const getRecentArticlesFn = useServerFn(getRecentArticlesForCommentsFn);
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

  useEffect(() => {
    if (isOpen && recentArticles.length === 0) {
      getRecentArticlesFn()
        .then((res) => {
          if (res && res.length > 0) {
            setRecentArticles(res);
          }
        })
        .catch(() => {});
    }
  }, [isOpen]);

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
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <LinkIcon className="h-3.5 w-3.5 text-blue-600" />
                Target Article URL or Slug <span className="text-red-500">*</span>
              </label>
              {aiArticleSlug && (
                <span className="text-[11px] text-slate-500 font-mono">
                  Slug: {aiArticleSlug}
                </span>
              )}
            </div>

            <div className="relative flex items-center">
              <input
                type="text"
                required
                placeholder="Paste article URL or slug (e.g. https://.../news/... or slug)"
                value={aiArticleInput}
                onChange={(e) => setAiArticleInput(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-xs focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 pr-24 font-medium text-slate-800"
              />
              <button
                type="button"
                onClick={() => handleFetchArticle(aiArticleInput)}
                disabled={fetchingArticle || !aiArticleInput.trim()}
                className="absolute right-1.5 top-1.5 rounded-md bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 disabled:opacity-40 transition flex items-center gap-1 shadow-xs"
              >
                {fetchingArticle ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  "Auto Fetch"
                )}
              </button>
            </div>

            {/* Fetching status indicator */}
            {fetchingArticle && (
              <div className="flex items-center gap-2 text-xs text-blue-600 py-1 font-medium">
                <Loader2 className="h-3.5 w-3.5 animate-spin" /> Fetching article details from database...
              </div>
            )}

            {/* Verified Article Preview Card */}
            {resolvedArticle && (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-3 shadow-xs animate-in fade-in duration-200">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                          ✓ Article Verified
                        </span>
                        {resolvedArticle.category && (
                          <span className="text-[10px] font-semibold text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200">
                            {resolvedArticle.category}
                          </span>
                        )}
                      </div>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 mt-1 leading-snug">
                        {resolvedArticle.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                        ID: #{resolvedArticle.id} &bull; /{resolvedArticle.slug}
                      </p>
                    </div>
                  </div>
                  <a
                    href={`/news/${resolvedArticle.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 shrink-0 bg-white px-2.5 py-1 rounded-md border border-slate-200 shadow-xs"
                  >
                    View <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
            )}

            {/* Error message */}
            {fetchError && !fetchingArticle && aiArticleInput && (
              <div className="flex items-center gap-2 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-2.5">
                <AlertCircle className="h-4 w-4 shrink-0 text-amber-600" />
                <span>{fetchError}</span>
              </div>
            )}

            {/* Optional recent articles selector */}
            {recentArticles.length > 0 && !targetReplyComment && (
              <div className="pt-1">
                <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
                  <span>Or pick from recent articles:</span>
                </div>
                <select
                  value={aiArticleSlug}
                  onChange={(e) => {
                    const selSlug = e.target.value;
                    if (selSlug) {
                      setAiArticleInput(selSlug);
                      handleFetchArticle(selSlug);
                    } else {
                      setAiArticleInput("");
                      setAiArticleSlug("");
                      setResolvedArticle(null);
                      setFetchError("");
                    }
                  }}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-700 focus:border-blue-500 focus:outline-none"
                >
                  <option value="">-- Choose from recent articles (optional) --</option>
                  {recentArticles.map((art) => (
                    <option key={art.id} value={art.slug}>
                      {art.title.length > 65 ? art.title.slice(0, 65) + "…" : art.title}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

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
              <option value="past_1_hour">
                ⚡ Past 1 Hour (e.g. 5 mins ago, 20 mins ago, 35 mins ago, 52 mins ago)
              </option>
              <option value="past_2_hours">
                🕐 Past 2 Hours (e.g. 8 mins ago, 35 mins ago, 1.2 hours ago, 1.8 hours ago)
              </option>
              <option value="past_6_hours">
                🕒 Past 6 Hours (e.g. 25 mins ago, 1.5 hours ago, 3 hours ago, 5 hours ago)
              </option>
              <option value="past_12_hours">
                🕕 Past 12 Hours (e.g. 40 mins ago, 2 hours ago, 6 hours ago, 10 hours ago)
              </option>
              <option value="past_24_hours">
                ⏱️ Past 24 Hours (e.g. 20 mins ago, 3 hours ago, 11 hours ago)
              </option>
              <option value="past_3_days">
                📅 Past 3 Days (e.g. 2 hours ago, 1 day ago, 2 days ago) [Recommended]
              </option>
              <option value="past_7_days">
                🗓️ Past 7 Days (e.g. 6 hours ago, 2 days ago, 5 days ago)
              </option>
              <option value="past_30_days">
                📆 Past 30 Days (older historical reader discussions)
              </option>
              <option value="just_now">
                ⚡ Just Now (all comments posted at current timestamp)
              </option>
            </select>
            <p className="mt-1 text-[11px] text-slate-500">
              Staggers timestamps naturally across the past so comments show as "1 day ago", "8 hours ago", or "20 mins ago" instead of all at the exact same minute.
            </p>
          </div>

          {/* Conversational Replies Toggle (When generating multiple comments) */}
          {!targetReplyComment && aiCount >= 2 && (
            <div className="rounded-xl border border-indigo-200 bg-indigo-50/70 p-3.5 flex items-start justify-between gap-3">
              <div>
                <label
                  onClick={() => setAiIncludeReplies(!aiIncludeReplies)}
                  className="text-xs font-bold text-indigo-950 flex items-center gap-1.5 cursor-pointer"
                >
                  <MessageSquare className="h-4 w-4 text-indigo-600 shrink-0" />
                  Include Conversational Replies (Threaded Comments)
                </label>
                <p className="text-[11px] text-indigo-800 mt-0.5 leading-relaxed">
                  AI will naturally generate realistic nested replies where readers debate, agree, or follow up with each other under the article with staggered reply times.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setAiIncludeReplies(!aiIncludeReplies)}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition mt-0.5 ${
                  aiIncludeReplies ? "bg-indigo-600" : "bg-slate-300"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow transition ${
                    aiIncludeReplies ? "translate-x-4" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          )}

          {/* Language & Dialect Mode */}
          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-700">
              Language &amp; Dialect Mode
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
                : "Generates comments in this specific linguistic style."}
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

          {/* Authentic Tripura Street Slang & Dialect Toggle */}
          <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-3.5 flex items-start justify-between gap-3">
            <div>
              <label
                onClick={() => setAiAllowSlang(!aiAllowSlang)}
                className="text-xs font-bold text-amber-950 flex items-center gap-1.5 cursor-pointer"
              >
                <Flame className="h-4 w-4 text-amber-600 shrink-0" />
                Tripura Street Slang &amp; Sharp Dialect (আঞ্চলিক স্ল্যাং ও ক্ষোভপূর্ণ ভাষা)
              </label>
              <p className="text-[11px] text-amber-800 mt-0.5 leading-relaxed">
                Allows authentic local expressions in critical comments:{" "}
                <span className="font-medium">
                  "বালের রাস্তা", "ফাইজলামি বন্ধ করুক", "কিতা অইতাছে", "আবাইল্লা", "ধুর ছাই", "খচ্চর", "তেঁড়ামি"
                </span>{" "}
                so critical reader reactions sound 100% natural, raw, and realistic.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setAiAllowSlang(!aiAllowSlang)}
              className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition mt-0.5 ${
                aiAllowSlang ? "bg-amber-600" : "bg-slate-300"
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow transition ${
                  aiAllowSlang ? "translate-x-4" : "translate-x-0"
                }`}
              />
            </button>
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
