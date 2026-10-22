import React from "react";
import { Sparkles, CheckCircle2 } from "lucide-react";

interface ArticleKeyTakeawaysProps {
  excerpt?: string;
  category?: string;
}

export function ArticleKeyTakeaways({ excerpt, category }: ArticleKeyTakeawaysProps) {
  if (!excerpt || !excerpt.trim()) return null;

  // Split excerpt into meaningful key points (by period, semicolon, or line breaks)
  const rawSentences = excerpt
    .split(/(?<=[.!?।])\s+|\n+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 10);

  const points = rawSentences.length > 0 ? rawSentences : [excerpt.trim()];

  return (
    <section
      aria-label="Key Takeaways and Executive Summary"
      itemProp="abstract"
      className="article-takeaways my-5 rounded-xl border border-indigo-200/80 bg-gradient-to-br from-indigo-50/70 via-white to-slate-50 p-4 sm:p-5 shadow-xs dark:border-indigo-900/40 dark:from-indigo-950/20 dark:via-slate-900 dark:to-slate-950"
    >
      <div className="flex items-center justify-between gap-2 border-b border-indigo-100 dark:border-indigo-950/60 pb-2.5 mb-3">
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-md bg-indigo-600 text-white shadow-2xs">
            <Sparkles className="h-3.5 w-3.5" />
          </span>
          <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-indigo-950 dark:text-indigo-200">
            Key Highlights
          </h2>
        </div>
        <span className="inline-flex items-center gap-1 rounded-full bg-indigo-100/80 dark:bg-indigo-900/50 px-2 py-0.5 text-[10px] font-semibold text-indigo-700 dark:text-indigo-300">
          At a Glance
        </span>
      </div>

      <ul className="space-y-2 text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed">
        {points.map((pt, i) => (
          <li key={i} className="flex items-start gap-2.5">
            <CheckCircle2 className="h-4 w-4 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
            <span>{pt}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
