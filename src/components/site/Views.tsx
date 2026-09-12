import { Eye } from "lucide-react";
import { formatViews } from "@/lib/news-data";

export function Views({ count, className = "" }: { count: number; className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1 text-[11px] text-muted-foreground ${className}`}
    >
      <Eye className="h-3 w-3 shrink-0" />
      <span>{formatViews(count)} views</span>
    </span>
  );
}
