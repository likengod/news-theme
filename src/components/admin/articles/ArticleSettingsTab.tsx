import { Field, JournalistPicker } from "@/components/admin/articles/ArticleSubComponents";
import { formatDateTimeLocal, type Row } from "./types";

interface ArticleSettingsTabProps {
  row: Row;
  onChange: <K extends keyof Row>(field: K, value: Row[K]) => void;
  isEnterprise?: boolean;
}

export default function ArticleSettingsTab({
  row,
  onChange,
  isEnterprise,
}: ArticleSettingsTabProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Field label="News Type">
          <select
            id="article-news-type"
            name="newsType"
            aria-label="News Type"
            value={row.newsType}
            onChange={(e) => onChange("newsType", e.target.value as Row["newsType"])}
            className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
          >
            <option>Standard</option>
            <option>Breaking</option>
            <option>Featured</option>
            <option>Exclusive</option>
            <option>Opinion</option>
            <option>Video</option>
          </select>
        </Field>

        <Field label="Author *">
          <input
            id="article-author"
            name="author"
            aria-label="Author"
            autoComplete="off"
            value={row.author}
            onChange={(e) => onChange("author", e.target.value)}
            className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
          />
        </Field>

        <Field label="Status">
          <select
            id="article-status"
            name="status"
            aria-label="Status"
            value={row.status}
            onChange={(e) => onChange("status", e.target.value as Row["status"])}
            className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
          >
            <option>Published</option>
            <option>Draft</option>
            <option>Review</option>
          </select>
        </Field>

        <Field label="Access Level">
          <select
            id="article-access-level"
            name="access_level"
            aria-label="Access Level"
            value={row.access_level}
            onChange={(e) => onChange("access_level", e.target.value as Row["access_level"])}
            className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
          >
            <option value="Free">Free (All users)</option>
            <option value="Premium">Premium (Admin / Editor / Author only)</option>
          </select>
        </Field>

        <Field label="Publish Date">
          <input
            id="article-publish-date"
            name="date"
            aria-label="Publish Date"
            type="datetime-local"
            value={formatDateTimeLocal(row.date)}
            onChange={(e) => onChange("date", e.target.value)}
            className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
          />
        </Field>

        {isEnterprise && (
          <Field label="Post Views">
            <input
              id="article-views"
              name="views"
              aria-label="Post Views"
              type="number"
              min={0}
              value={row.views}
              onChange={(e) => onChange("views", Number(e.target.value) || 0)}
              className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
            />
          </Field>
        )}

        <Field label="Featured on homepage">
          <label className="flex h-9 items-center gap-2 rounded-md border border-slate-200 px-3 text-sm">
            <input
              id="article-featured"
              name="featured"
              aria-label="Pin to hero / featured slot"
              type="checkbox"
              checked={row.featured}
              onChange={(e) => onChange("featured", e.target.checked)}
            />
            Pin to hero / featured slot
          </label>
        </Field>
      </div>

      <div className="mt-4 border-t border-slate-100 pt-4">
        <JournalistPicker
          journalistId={row.journalistId}
          journalistName={row.journalistName}
          onSelect={(j) => {
            onChange("journalistId", j?.publicUserId ?? "");
            onChange("journalistName", j?.displayName ?? "");
            if (j?.displayName) onChange("author", j.displayName);
          }}
        />
      </div>
    </div>
  );
}
