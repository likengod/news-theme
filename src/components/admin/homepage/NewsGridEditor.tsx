import { SectionCard } from "./SectionCard";
import type { HomepageConfig, SectionStyle } from "@/lib/homepage-config";

type Props = {
  columns: SectionStyle[];
  onUpdateColumn: (index: number, val: SectionStyle) => void;
};

export function NewsGridEditor({ columns, onUpdateColumn }: Props) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {columns.map((col, idx) => (
        <SectionCard
          key={idx}
          label={`Column ${idx + 1}`}
          hint={`News column ${idx + 1} on homepage`}
          value={col}
          showCategory
          onChange={(v: SectionStyle) => onUpdateColumn(idx, v)}
        />
      ))}
    </div>
  );
}
