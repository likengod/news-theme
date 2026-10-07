import { MessageSquare } from "lucide-react";

interface AiRepliesConfigProps {
  aiCount: number;
  aiIncludeReplies: boolean;
  setAiIncludeReplies: (v: boolean) => void;
  effectiveReplyCount: number;
  maxReplies: number;
  setAiReplyCount: (v: number) => void;
}

export function AiRepliesConfig({
  aiCount,
  aiIncludeReplies,
  setAiIncludeReplies,
  effectiveReplyCount,
  maxReplies,
  setAiReplyCount,
}: AiRepliesConfigProps) {
  return (
    <div className="rounded-xl border border-indigo-200 bg-indigo-50/70 p-3.5 space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <label
            onClick={() => setAiIncludeReplies(!aiIncludeReplies)}
            className="text-xs font-bold text-indigo-950 flex items-center gap-1.5 cursor-pointer"
          >
            <MessageSquare className="h-4 w-4 text-indigo-600 shrink-0" />
            Include Conversational Replies (Threaded Comments)
          </label>
          <p className="text-[11px] text-indigo-800 mt-0.5 leading-relaxed">
            AI will generate realistic replies between readers debating or following up on earlier comments.
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

      {aiIncludeReplies && (
        <div className="pt-2.5 border-t border-indigo-200/80 space-y-2.5 animate-in fade-in duration-150">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-indigo-950 flex items-center gap-1.5">
              How Many Comments Should Be Replies?
            </label>
            <span className="text-[11px] font-bold text-indigo-700 bg-indigo-100/90 px-2 py-0.5 rounded-md">
              {effectiveReplyCount} {effectiveReplyCount === 1 ? "Reply" : "Replies"} of {aiCount} Total
            </span>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min={1}
              max={maxReplies}
              value={effectiveReplyCount}
              onChange={(e) => setAiReplyCount(parseInt(e.target.value) || 1)}
              className="w-full h-2 bg-indigo-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
            <div className="flex items-center gap-1 shrink-0">
              <input
                type="number"
                min={1}
                max={maxReplies}
                value={effectiveReplyCount}
                onChange={(e) => {
                  const val = parseInt(e.target.value) || 1;
                  setAiReplyCount(Math.min(Math.max(1, val), maxReplies));
                }}
                className="w-14 rounded-md border border-indigo-300 bg-white px-2 py-1 text-xs font-bold text-indigo-950 text-center focus:border-indigo-500 focus:outline-none shadow-xs"
              />
              <span className="text-[11px] font-semibold text-indigo-900">replies</span>
            </div>
          </div>
          <div className="flex items-center justify-between text-[11px] text-indigo-900 bg-white/90 rounded-lg px-3 py-2 border border-indigo-200 font-medium shadow-xs">
            <span>💬 Main Comments: <strong className="text-indigo-950 font-bold">{aiCount - effectiveReplyCount}</strong></span>
            <span>↳ Nested Replies: <strong className="text-indigo-950 font-bold">{effectiveReplyCount}</strong></span>
            <span>Total: <strong className="text-indigo-950 font-bold">{aiCount}</strong></span>
          </div>
        </div>
      )}
    </div>
  );
}
