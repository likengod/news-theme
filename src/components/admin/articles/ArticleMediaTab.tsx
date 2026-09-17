import { ImageInput, Field } from "@/components/admin/articles/ArticleSubComponents";
import type { Row } from "./types";

interface ArticleMediaTabProps {
  row: Row;
  onChange: <K extends keyof Row>(field: K, value: Row[K]) => void;
}

export default function ArticleMediaTab({ row, onChange }: ArticleMediaTabProps) {
  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <Field label="Featured Image">
          <ImageInput
            value={row.featuredImage}
            onChange={(v) => onChange("featuredImage", v)}
            hint="Used as the hero image and default Open Graph image."
          />
        </Field>
      </div>
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <Field
          label={`Open Graph Image ${row.ogImage ? "" : "(defaults to Featured Image)"}`}
        >
          <ImageInput
            value={row.ogImage}
            onChange={(v) => onChange("ogImage", v)}
            hint="Override only if you want a different image when shared on social media. Recommended 1200×630."
          />
        </Field>
      </div>
    </div>
  );
}
