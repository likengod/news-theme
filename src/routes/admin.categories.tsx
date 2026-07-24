import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Plus, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { getCategories, saveCategory, deleteCategory, importCategories, type CategoryRow } from "@/lib/taxonomy.functions";
import { slugify } from "@/lib/news-data";
import { CategoryTable } from "@/components/admin/categories/CategoryTable";
import { CsvImportExport } from "@/components/admin/CsvImportExport";

export const Route = createFileRoute("/admin/categories")({
  component: CategoriesPage,
});

type Cat = CategoryRow;

function CategoriesPage() {
  const fetchCatsFn = useServerFn(getCategories);
  const saveCatFn = useServerFn(saveCategory);
  const deleteCatFn = useServerFn(deleteCategory);
  const importCatsFn = useServerFn(importCategories);

  const [cats, setCats] = useState<Cat[]>([]);
  const [allCats, setAllCats] = useState<Cat[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [editing, setEditing] = useState<Cat | null>(null);
  const [page, setPage] = useState(1);
  const [q, setQ] = useState("");
  const PAGE_SIZE = 15;

  const loadCategories = async () => {
    try {
      setLoading(true);
      const res = await fetchCatsFn({ data: { q } });
      setCats(res);
      if (!q) setAllCats(res);
    } catch (err: any) {
      toast.error(err.message || "Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, [q]);

  const handleImport = async (data: any[]) => {
    try {
      setLoading(true);
      await importCatsFn({ data });
      toast.success("Categories imported successfully");
      await loadCategories();
    } catch (err: any) {
      toast.error(err.message || "Failed to import categories");
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.max(1, Math.ceil(cats.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const paged = cats.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const handleSave = async (draft: Cat) => {
    if (!draft.name.trim()) return toast.error("Category name is required");
    try {
      await saveCatFn({ data: draft });
      toast.success(editing ? "Category updated" : "Category created");
      setEditing(null);
      setName("");
      loadCategories();
    } catch (err: any) {
      toast.error(err.message || "Failed to save category");
    }
  };

  const handleDelete = async (c: Cat) => {
    if (!confirm(`Delete category "${c.name}"?`)) return;
    try {
      await deleteCatFn({ data: c.id });
      toast.success("Category deleted");
      loadCategories();
    } catch (err: any) {
      toast.error(err.message || "Failed to delete category");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">News Categories</h1>
          <p className="text-sm text-slate-500">
            Manage article categories, SEO metadata, and category feeds.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <CsvImportExport
            data={allCats}
            filename="categories"
            onImport={handleImport}
          />
          <button
            onClick={() => setEditing({ id: Date.now(), name: "", slug: "", description: "", metaTitle: "", metaDescription: "" })}
            className="inline-flex items-center gap-2 rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
          >
            <Plus className="h-4 w-4" /> Add Category
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setPage(1);
            }}
            placeholder="Search categories by name..."
            className="h-9 w-full rounded-md border border-slate-200 pl-9 pr-3 text-sm focus:border-slate-900 focus:outline-none"
          />
        </div>
      </div>

      {/* Category Table */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-900 border-t-transparent"></div>
        </div>
      ) : (
        <CategoryTable
          categories={paged}
          onEdit={(cat) => setEditing({ ...cat })}
          onDelete={handleDelete}
        />
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-slate-200 pt-4">
          <p className="text-xs text-slate-500">
            Page <strong>{safePage}</strong> of <strong>{totalPages}</strong> ({cats.length} total categories)
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={safePage <= 1}
              className="inline-flex items-center gap-1 rounded-md border border-slate-200 px-3 py-1.5 text-xs font-medium hover:bg-slate-50 disabled:opacity-40"
            >
              <ChevronLeft className="h-3.5 w-3.5" /> Previous
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={safePage >= totalPages}
              className="inline-flex items-center gap-1 rounded-md border border-slate-200 px-3 py-1.5 text-xs font-medium hover:bg-slate-50 disabled:opacity-40"
            >
              Next <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-5 shadow-2xl space-y-4">
            <h2 className="text-base font-bold text-slate-900">
              {editing.id > 1000000 ? "Add Category" : `Edit Category — ${editing.name}`}
            </h2>
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-600">Category Name *</label>
              <input
                type="text"
                value={editing.name}
                onChange={(e) => setEditing({ ...editing, name: e.target.value, slug: slugify(e.target.value) })}
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
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-600">Description</label>
              <textarea
                value={editing.description}
                onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                rows={3}
                className="w-full rounded-md border border-slate-200 p-2.5 text-sm focus:border-slate-900 focus:outline-none"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button onClick={() => setEditing(null)} className="rounded-md border border-slate-200 px-4 py-2 text-xs font-semibold hover:bg-slate-50">
                Cancel
              </button>
              <button onClick={() => handleSave(editing)} className="rounded-md bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800">
                Save Category
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
