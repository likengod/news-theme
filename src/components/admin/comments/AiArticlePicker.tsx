import { Link as LinkIcon, Loader2, CheckCircle2, ExternalLink, AlertCircle } from "lucide-react";

interface AiArticlePickerProps {
  aiArticleInput: string;
  setAiArticleInput: (v: string) => void;
  aiArticleSlug: string;
  fetchingArticle: boolean;
  onFetchArticle: (input: string) => void;
  resolvedArticle: {
    id: number;
    title: string;
    slug: string;
    category?: string;
    featuredImage?: string;
  } | null;
  fetchError: string;
}

export function AiArticlePicker({
  aiArticleInput,
  setAiArticleInput,
  aiArticleSlug,
  fetchingArticle,
  onFetchArticle,
  resolvedArticle,
  fetchError,
}: AiArticlePickerProps) {
  return (
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
          onClick={() => onFetchArticle(aiArticleInput)}
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
    </div>
  );
}
