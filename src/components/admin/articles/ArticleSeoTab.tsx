import { useState, useMemo, type KeyboardEvent } from "react";
import { X, Tag, Plus } from "lucide-react";
import { Field } from "@/components/admin/articles/ArticleSubComponents";
import type { Row } from "./types";

interface ArticleSeoTabProps {
  row: Row;
  onChange: <K extends keyof Row>(field: K, value: Row[K]) => void;
  fullUrl: string;
}

const COMMON_TAGS = [
  "Tripura",
  "Agartala",
  "Northeast",
  "Breaking News",
  "Politics",
  "Development",
  "Technology",
  "Business",
  "Education",
  "Sports",
];

export default function ArticleSeoTab({
  row,
  onChange,
  fullUrl,
}: ArticleSeoTabProps) {
  const [inputVal, setInputVal] = useState("");

  const tags = useMemo(() => {
    return (row.tags || "")
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
  }, [row.tags]);

  const addTag = (rawTag: string) => {
    const cleaned = rawTag.trim().replace(/^,+|,+$/g, "");
    if (!cleaned) return;

    // Handle multiple tags if comma-separated string pasted
    const incoming = cleaned
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const next = [...tags];
    for (const t of incoming) {
      if (!next.some((existing) => existing.toLowerCase() === t.toLowerCase())) {
        next.push(t);
      }
    }
    onChange("tags", next.join(", "));
    setInputVal("");
  };

  const removeTag = (tagToRemove: string) => {
    const next = tags.filter((t) => t.toLowerCase() !== tagToRemove.toLowerCase());
    onChange("tags", next.join(", "));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      if (inputVal.trim()) {
        addTag(inputVal);
      }
    } else if (e.key === "Backspace" && !inputVal && tags.length > 0) {
      removeTag(tags[tags.length - 1]);
    }
  };

  const handleInputChange = (val: string) => {
    if (val.includes(",")) {
      addTag(val);
    } else {
      setInputVal(val);
    }
  };

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

        <Field label="Tags">
          <div className="space-y-2.5">
            {/* Interactive Tags Box */}
            <div className="flex flex-wrap items-center gap-1.5 min-h-[46px] w-full rounded-lg border border-slate-200 bg-white p-2 focus-within:border-slate-900 focus-within:ring-1 focus-within:ring-slate-900 transition-colors">
              <Tag className="h-4 w-4 text-slate-400 ml-1 shrink-0" />
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 rounded-md bg-indigo-50 border border-indigo-200/80 px-2.5 py-1 text-xs font-semibold text-indigo-700 shadow-xs animate-in fade-in"
                >
                  <span>{tag}</span>
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="grid h-3.5 w-3.5 place-items-center rounded hover:bg-indigo-200/60 text-indigo-500 hover:text-indigo-800 transition-colors"
                    title={`Remove ${tag}`}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
              <input
                id="article-tags"
                name="tags"
                aria-label="Add tags"
                value={inputVal}
                onChange={(e) => handleInputChange(e.target.value)}
                onKeyDown={handleKeyDown}
                onBlur={() => {
                  if (inputVal.trim()) addTag(inputVal);
                }}
                placeholder={
                  tags.length === 0
                    ? "Type tag name and press Enter (or comma)..."
                    : "Add another tag..."
                }
                className="flex-1 min-w-[160px] bg-transparent text-sm focus:outline-none px-1.5 py-0.5"
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500">
              <p>
                Press <kbd className="rounded bg-slate-100 border border-slate-200 px-1 py-0.5 font-mono text-[10px] text-slate-700">Enter</kbd> or type a <kbd className="rounded bg-slate-100 border border-slate-200 px-1 py-0.5 font-mono text-[10px] text-slate-700">,</kbd> to create a tag.
              </p>
              {tags.length > 0 && (
                <button
                  type="button"
                  onClick={() => onChange("tags", "")}
                  className="text-xs text-rose-600 hover:underline"
                >
                  Clear all ({tags.length})
                </button>
              )}
            </div>

            {/* Quick Tag Suggestions */}
            <div className="pt-1">
              <span className="text-[11px] font-medium text-slate-400 mr-2">Suggestions:</span>
              <div className="inline-flex flex-wrap gap-1 mt-1">
                {COMMON_TAGS.filter(
                  (ct) => !tags.some((t) => t.toLowerCase() === ct.toLowerCase())
                )
                  .slice(0, 7)
                  .map((suggested) => (
                    <button
                      key={suggested}
                      type="button"
                      onClick={() => addTag(suggested)}
                      className="inline-flex items-center gap-0.5 rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] text-slate-600 hover:border-slate-300 hover:bg-slate-100 transition-colors"
                    >
                      <Plus className="h-2.5 w-2.5 text-slate-400" />
                      {suggested}
                    </button>
                  ))}
              </div>
            </div>
          </div>
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
