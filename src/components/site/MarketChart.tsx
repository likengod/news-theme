export function MarketChart() {
  const pts = [60, 58, 55, 50, 46, 44, 40, 35, 30, 28, 25, 22, 20, 18, 22, 28, 32, 35, 40, 45, 52, 56, 58, 55, 50, 48];
  const w = 600;
  const h = 140;
  const max = Math.max(...pts);
  const min = Math.min(...pts);
  const stepX = w / (pts.length - 1);
  const norm = (v: number) => h - ((v - min) / (max - min)) * h;
  const d = pts.map((v, i) => `${i === 0 ? "M" : "L"} ${i * stepX} ${norm(v)}`).join(" ");
  const area = `${d} L ${w} ${h} L 0 ${h} Z`;

  return (
    <div className="border border-border bg-card p-4 text-left">
      <div className="flex items-baseline justify-between">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">S&amp;P 500 (^GSPC)</p>
          <p className="mt-1 font-mono text-2xl font-bold text-foreground">
            5,693.31{" "}
            <span className="text-base font-semibold text-[#dc2626]">-18.89 (-0.33%)</span>
          </p>
        </div>
        <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
          At close: 5:01:50 PM EDT
        </span>
      </div>
      <svg viewBox={`0 0 ${w} ${h}`} className="mt-3 w-full" preserveAspectRatio="none">
        <path d={area} fill="#dc2626" fillOpacity="0.12" />
        <path d={d} fill="none" stroke="#dc2626" strokeWidth="1.5" />
      </svg>
      <div className="mt-2 flex items-center justify-between font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
        <span>10:00 AM</span>
        <span>12:00 PM</span>
        <span>2:00 PM</span>
        <span>4:00 PM</span>
      </div>
    </div>
  );
}
