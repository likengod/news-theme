import React from "react";
import { Sparkles, Loader2 } from "lucide-react";
import { slugify } from "@/lib/news-data";
import type { CategoryRow } from "@/lib/taxonomy.functions";

interface CategoryEditModalProps {
  editing: CategoryRow;
  setEditing: React.Dispatch<React.SetStateAction<CategoryRow | null>>;
  onSave: (draft: CategoryRow) => void;
  onAiGenerate: () => void;
  isGeneratingAi: boolean;
}

export function CategoryEditModal({
  editing,
  setEditing,
  onSave,
  onAiGenerate,
  isGeneratingAi,
}: CategoryEditModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-5 shadow-2xl space-y-4">
        <h2 className="text-base font-bold text-slate-900">
          {editing.id > 1000000 ? "Add Category" : `Edit Category — ${editing.name}`}
        </h2>
        <div>
          <label className="mb-1 block text-xs font-semibold text-slate-600">
            Category Name *
          </label>
          <input
            type="text"
            value={editing.name}
            onChange={(e) =>
              setEditing({ ...editing, name: e.target.value, slug: slugify(e.target.value) })
            }
            className="h-9 w-full rounded-md border border-slate-200 px-3 text-sm focus:border-slate-900 focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold text-slate-600">Slug</label>
          <input
            type="text"
            value={editing.slug}
            onChange={(e) => setEditing({ ...editing, slug: e.target.value })}
            className="h-9 w-full rounded-md border border-slate-200 px-3 text-sm focus:border-slate-900 focus:outline-none"
          />
        </div>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="showInHeader"
            checked={editing.showInHeader || false}
            onChange={(e) => setEditing({ ...editing, showInHeader: e.target.checked })}
            className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900"
          />
          <label htmlFor="showInHeader" className="text-sm font-medium text-slate-700">
            Show in top header navigation
          </label>
        </div>
        {editing.showInHeader && (
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-600">Header Position (Order)</label>
            <input
              type="number"
              value={editing.sortOrder || 0}
              onChange={(e) => setEditing({ ...editing, sortOrder: parseInt(e.target.value) || 0 })}
              className="h-9 w-full rounded-md border border-slate-200 px-3 text-sm focus:border-slate-900 focus:outline-none"
              placeholder="e.g. 1, 2, 3"
            />
            <p className="mt-1 text-[10px] text-slate-500">Lower numbers appear first (e.g., 1 appears before 2).</p>
          </div>
        )}
        <div>
          <label className="mb-1 block text-xs font-semibold text-slate-600">
            Custom Redirect URL (Optional)
          </label>
          <input
            type="text"
            value={editing.redirectUrl || ""}
            onChange={(e) => setEditing({ ...editing, redirectUrl: e.target.value })}
            className="h-9 w-full rounded-md border border-slate-200 px-3 text-sm focus:border-slate-900 focus:outline-none"
            placeholder="e.g. /event, /about, or https://example.com"
          />
          <p className="mt-1 text-[10px] text-slate-500">
            When visitors click or open this category, they will be redirected to this custom URL. Leave blank for standard category articles.
          </p>
        </div>
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-600">Description</label>
            <button
              type="button"
              onClick={onAiGenerate}
              disabled={isGeneratingAi || !editing.name?.trim()}
              className="inline-flex items-center gap-1.5 rounded-md bg-gradient-to-r from-indigo-50 to-purple-50 hover:from-indigo-100 hover:to-purple-100 border border-indigo-200/80 px-2.5 py-1 text-xs font-semibold text-indigo-700 shadow-2xs transition active:scale-95 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
              title={
                !editing.name?.trim()
                  ? "Enter Category Name first"
                  : "Generate an SEO-friendly news description with AI"
              }
            >
              {isGeneratingAi ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin text-indigo-600" />
                  <span>Generating with AI...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
                  <span>Generate with AI</span>
                </>
              )}
            </button>
          </div>
          <textarea
            value={editing.description}
            onChange={(e) => setEditing({ ...editing, description: e.target.value })}
            rows={3}
            placeholder="National news, political developments, and policy updates across the country."
            className="w-full rounded-md border border-slate-200 p-2.5 text-sm focus:border-slate-900 focus:outline-none"
          />
          <p className="mt-1 text-[11px] text-slate-500">
            SEO-friendly summary used across category headers, archive feeds, and Google search snippets.
          </p>
        </div>
        <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
          <button
            onClick={() => setEditing(null)}
            className="rounded-md border border-slate-200 px-4 py-2 text-xs font-semibold hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(editing)}
            className="rounded-md bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
