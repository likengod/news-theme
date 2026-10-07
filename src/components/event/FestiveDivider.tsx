/**
 * Symmetrical Festive Flourish Divider
 */
export function FestiveDivider({ title = "॥ শুভ শারদীয়া ॥" }: { title?: string }) {
  return (
    <div className="flex items-center justify-center gap-3 py-8" aria-hidden="true">
      <div className="h-[1px] flex-1 max-w-[140px] bg-gradient-to-r from-transparent via-amber-400 to-amber-600 dark:via-amber-500 dark:to-amber-400" />
      <div className="flex items-center gap-2 text-amber-700 dark:text-amber-300 font-serif font-bold text-xs sm:text-sm tracking-wider">
        <span className="text-red-600 dark:text-red-400">✦</span>
        <span>{title}</span>
        <span className="text-red-600 dark:text-red-400">✦</span>
      </div>
      <div className="h-[1px] flex-1 max-w-[140px] bg-gradient-to-l from-transparent via-amber-400 to-amber-600 dark:via-amber-500 dark:to-amber-400" />
    </div>
  );
}
