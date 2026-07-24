import { tickers } from "@/lib/news-data";

export function Ticker() {
  const row = (
    <div className="flex shrink-0 items-center gap-8 px-6">
      {tickers.map((t) => (
        <div key={t.sym} className="flex items-center gap-2 font-mono text-xs">
          <span className="font-semibold tracking-wide text-foreground">{t.sym}</span>
          <span className="text-muted-foreground">{t.val}</span>
          <span className={t.up ? "text-[#16a34a]" : "text-[#dc2626]"}>
            {t.up ? "▲" : "▼"} {t.chg}
          </span>
        </div>
      ))}
    </div>
  );
  return (
    <div className="overflow-hidden border-y border-border bg-card/60 py-2 md:sticky md:top-[88px] md:z-20 md:bg-background/90 md:backdrop-blur-md">
      <div className="flex ticker-scroll w-max">
        {row}
        {row}
      </div>
    </div>
  );
}
