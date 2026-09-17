import { MapPin } from "lucide-react";
import { sections, slugify } from "@/lib/news-data";
import RichEditor from "@/components/admin/articles/RichEditor";
import { Field } from "@/components/admin/articles/ArticleSubComponents";
import type { Row } from "./types";

interface ArticleContentTabProps {
  row: Row;
  onChange: <K extends keyof Row>(field: K, value: Row[K]) => void;
  autoSlug: boolean;
}

export default function ArticleContentTab({
  row,
  onChange,
  autoSlug,
}: ArticleContentTabProps) {
  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <Field label="Title *">
          <input
            value={row.title}
            onChange={(e) => {
              onChange("title", e.target.value);
              if (autoSlug) onChange("slug", slugify(e.target.value));
            }}
            placeholder="Enter article headline..."
            className="w-full rounded-md border border-slate-200 px-3 py-2.5 text-base font-medium focus:border-slate-900 focus:outline-none"
          />
        </Field>

        <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
          <Field label="Category">
            <select
              value={row.category}
              onChange={(e) => onChange("category", e.target.value)}
              className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none"
            >
              {sections.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </Field>
          <Field label="Title slug (URL last segment)">
            <input
              value={row.slug}
              onChange={(e) => onChange("slug", slugify(e.target.value))}
              placeholder="auto from title"
              className="w-full rounded-md border border-slate-200 px-3 py-2 font-mono text-sm focus:border-slate-900 focus:outline-none"
            />
          </Field>
        </div>

        <div className="mt-4">
          <div className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-600">
            <MapPin className="h-3.5 w-3.5" /> Location
            <span className="font-normal normal-case text-slate-400">
              — builds the URL's location segment
            </span>
          </div>
          <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
            <input
              value={row.city}
              onChange={(e) => onChange("city", e.target.value)}
              placeholder="City"
              className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none"
            />
            <input
              value={row.state}
              onChange={(e) => onChange("state", e.target.value)}
              placeholder="State"
              className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none"
            />
            <input
              value={row.country}
              onChange={(e) => onChange("country", e.target.value)}
              placeholder="Country"
              className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none"
            />
          </div>
        </div>

        <div className="mt-4">
          <Field label="Excerpt / Summary">
            <textarea
              value={row.excerpt}
              onChange={(e) => onChange("excerpt", e.target.value)}
              rows={2}
              placeholder="Short summary shown in news grid (1-2 lines)..."
              className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none"
            />
            <span className="mt-1 block text-xs text-slate-400">
              {row.excerpt.length} / 200
            </span>
          </Field>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-600">
            Article Body
          </span>
          <span className="text-[11px] text-slate-400">
            Use the toolbar to format, embed and upload
          </span>
        </div>
        <RichEditor value={row.content} onChange={(v) => onChange("content", v)} />
      </div>
    </div>
  );
}
