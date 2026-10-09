import { Eye } from "lucide-react";
import { formatViews } from "@/lib/news-data";

export function Views({ count, className = "" }: { count?: number | any; className?: string }) {
  const c = typeof count === "number" ? count : Number(count) || 0;
  return (
    <span
      className={`inline-flex items-center gap-1 text-[11px] text-muted-foreground ${className}`}
    >
      <Eye className="h-3 w-3 shrink-0" />
      <span>{formatViews(c)} views</span>
    </span>
  );
}
