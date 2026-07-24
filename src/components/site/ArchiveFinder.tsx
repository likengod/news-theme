import { useNavigate } from "@tanstack/react-router";

export function ArchiveFinder() {
  const navigate = useNavigate();
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        const d = (fd.get("day") as string) || "";
        const m = (fd.get("month") as string) || "";
        const y = (fd.get("year") as string) || "";
        navigate({
          to: "/archive",
          search: {
            ...(d ? { day: d } : {}),
            ...(m ? { month: m } : {}),
            ...(y ? { year: y } : {}),
            page: 1,
          },
        });
      }}
      className="space-y-2 border border-border bg-card p-4"
    >
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-foreground">Archive</p>
      <p className="text-[11px] text-muted-foreground">Find stories by date</p>
      <div className="grid grid-cols-3 gap-2">
        <select name="day" aria-label="Day" defaultValue="" className="w-full border border-border bg-background px-2 py-2 text-sm outline-none focus:border-foreground">
          <option value="">Day</option>
          {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
            <option key={d} value={String(d).padStart(2, "0")}>{d}</option>
          ))}
        </select>
        <select name="month" aria-label="Month" defaultValue="" className="w-full border border-border bg-background px-2 py-2 text-sm outline-none focus:border-foreground">
          <option value="">Month</option>
          {["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"].map((m, i) => (
            <option key={m} value={String(i + 1).padStart(2, "0")}>{m}</option>
          ))}
        </select>
        <select name="year" aria-label="Year" defaultValue="" className="w-full border border-border bg-background px-2 py-2 text-sm outline-none focus:border-foreground">
          <option value="">Year</option>
          {Array.from({ length: 16 }, (_, i) => 2026 - i).map((y) => (
            <option key={y} value={String(y)}>{y}</option>
          ))}
        </select>
      </div>
      <button
        type="submit"
        className="w-full bg-foreground px-3 py-2 text-sm font-bold uppercase tracking-widest text-background hover:opacity-80"
      >
        Find Archive
      </button>
    </form>
  );
}

export default ArchiveFinder;
