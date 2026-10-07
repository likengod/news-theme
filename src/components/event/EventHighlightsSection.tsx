import { Trophy, Award, Users, ShieldCheck } from "lucide-react";

interface EventHighlightsSectionProps {
  eventPrizesTitle: string;
  prizeList: string[];
  eventCriteriaTitle: string;
  criteriaList: string[];
  eventGuidelinesTitle: string;
  eventGuidelinesText: string;
  eventGuidelinesBadge?: string;
}

export function EventHighlightsSection({
  eventPrizesTitle,
  prizeList,
  eventCriteriaTitle,
  criteriaList,
  eventGuidelinesTitle,
  eventGuidelinesText,
  eventGuidelinesBadge,
}: EventHighlightsSectionProps) {
  return (
    <section className="py-4">
      <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-amber-300/40 dark:divide-amber-800/40">
        {/* Column 1: Prizes */}
        <div className="pt-6 md:pt-0 md:px-6 first:pl-0">
          <div className="flex items-center gap-2.5 text-red-800 dark:text-red-400 mb-3 font-serif font-bold text-base">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100 text-red-700 dark:bg-red-950/70 dark:text-red-300 border border-red-300/60 dark:border-red-800/60">
              <Trophy className="h-4 w-4" />
            </div>
            <span>{eventPrizesTitle}</span>
          </div>
          <ul className="space-y-2.5 text-xs sm:text-sm text-stone-700 dark:text-stone-300">
            {prizeList.map((prize, idx) => (
              <li key={idx} className="flex items-start gap-2 leading-relaxed">
                <span className="text-amber-500 font-bold text-sm leading-none mt-0.5">✦</span>
                <span>{prize}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 2: Criteria */}
        <div className="pt-6 md:pt-0 md:px-6">
          <div className="flex items-center gap-2.5 text-amber-800 dark:text-amber-300 mb-3 font-serif font-bold text-base">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100 text-amber-700 dark:bg-amber-950/70 dark:text-amber-300 border border-amber-300/60 dark:border-amber-800/60">
              <Award className="h-4 w-4" />
            </div>
            <span>{eventCriteriaTitle}</span>
          </div>
          <ul className="space-y-2.5 text-xs sm:text-sm text-stone-700 dark:text-stone-300">
            {criteriaList.map((criterion, idx) => (
              <li key={idx} className="flex items-start gap-2 leading-relaxed">
                <span className="text-amber-500 font-bold text-sm leading-none mt-0.5">✦</span>
                <span>{criterion}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 3: Guidelines */}
        <div className="pt-6 md:pt-0 md:px-6 last:pr-0 sm:col-span-2 md:col-span-1">
          <div className="flex items-center gap-2.5 text-amber-900 dark:text-amber-200 mb-3 font-serif font-bold text-base">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100 text-amber-700 dark:bg-amber-950/70 dark:text-amber-300 border border-amber-300/60 dark:border-amber-800/60">
              <Users className="h-4 w-4" />
            </div>
            <span>{eventGuidelinesTitle}</span>
          </div>
          <p className="text-xs sm:text-sm text-stone-700 dark:text-stone-300 leading-relaxed">
            {eventGuidelinesText}
          </p>
          {eventGuidelinesBadge && (
            <div className="mt-4 inline-flex items-center gap-2 rounded-lg bg-emerald-50 border border-emerald-300/80 px-3.5 py-1.5 text-xs font-bold text-emerald-800 dark:bg-emerald-950/40 dark:border-emerald-800/60 dark:text-emerald-300">
              <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>{eventGuidelinesBadge}</span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
