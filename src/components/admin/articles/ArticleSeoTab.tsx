import { Field } from "@/components/admin/articles/ArticleSubComponents";
import type { Row } from "./types";

interface ArticleSeoTabProps {
  row: Row;
  onChange: <K extends keyof Row>(field: K, value: Row[K]) => void;
  fullUrl: string;
}

export default function ArticleSeoTab({
  row,
  onChange,
  fullUrl,
}: ArticleSeoTabProps) {
  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
        <Field label="Meta Title">
          <input
            id="article-meta-title"
            name="metaTitle"
            aria-label="Meta Title"
            value={row.metaTitle}
            onChange={(e) => onChange("metaTitle", e.target.value)}
            placeholder={row.title || "Defaults to article title"}
            className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none"
          />
          <span className="mt-1 block text-xs text-slate-400">
            {row.metaTitle.length} / 60 chars recommended
          </span>
        </Field>

        <Field label="Meta Description">
          <textarea
            id="article-meta-description"
            name="metaDescription"
            aria-label="Meta Description"
            value={row.metaDescription}
            onChange={(e) => onChange("metaDescription", e.target.value)}
            rows={3}
            placeholder="Search engine description (~155 chars)..."
            className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none"
          />
          <span className="mt-1 block text-xs text-slate-400">
            {row.metaDescription.length} / 160 chars recommended
          </span>
        </Field>

        <Field label="Tags (comma separated)">
          <input
            id="article-tags"
            name="tags"
            aria-label="Tags (comma separated)"
            value={row.tags}
            onChange={(e) => onChange("tags", e.target.value)}
            placeholder="markets, fed, inflation"
            className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none"
          />
        </Field>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          Search preview
        </p>
        <p className="mt-2 truncate text-base text-blue-700">
          {row.metaTitle || row.title || "Article title"}
        </p>
        <p className="truncate text-xs text-emerald-700">{fullUrl}</p>
        <p className="mt-1 line-clamp-2 text-sm text-slate-600">
          {row.metaDescription || row.excerpt || "Article description preview..."}
        </p>
      </div>
    </div>
  );
}
