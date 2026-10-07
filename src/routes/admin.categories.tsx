import { useEffect, useState } from "react";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Plus, Search, ChevronLeft, ChevronRight, GripVertical } from "lucide-react";
import { toast } from "sonner";
import {
  getCategories,
  saveCategory,
  deleteCategory,
  importCategories,
  type CategoryRow,
} from "@/lib/taxonomy.functions";
import { generateCategoryDescriptionServer } from "@/lib/ai.functions";
import { useSiteSettings } from "@/components/site/AdSettingsContext";
import { slugify } from "@/lib/news-data";
import { CategoryTable } from "@/components/admin/categories/CategoryTable";
import { ReorderModal } from "@/components/admin/categories/ReorderModal";
import { CategoryEditModal } from "@/components/admin/categories/CategoryEditModal";
import { CsvImportExport } from "@/components/admin/CsvImportExport";

export const Route = createFileRoute("/admin/categories")({
  component: CategoriesPage,
});

type Cat = CategoryRow;

function CategoriesPage() {
  const router = useRouter();
  const fetchCatsFn = useServerFn(getCategories);
  const saveCatFn = useServerFn(saveCategory);
  const deleteCatFn = useServerFn(deleteCategory);
  const importCatsFn = useServerFn(importCategories);
  const generateCatDescFn = useServerFn(generateCategoryDescriptionServer);
  const siteSettings = useSiteSettings();

  const [cats, setCats] = useState<Cat[]>([]);
  const [allCats, setAllCats] = useState<Cat[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Cat | null>(null);
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [page, setPage] = useState(1);
  const [q, setQ] = useState("");
  const [reordering, setReordering] = useState(false);
  const PAGE_SIZE = 15;

  const handleAiGenerateDescription = async () => {
    if (!editing?.name?.trim()) {
      toast.error("Please enter a Category Name first");
      return;
    }
    setIsGeneratingAi(true);
    try {
      const res = await generateCatDescFn({
        data: {
          categoryName: editing.name.trim(),
          categorySlug: editing.slug || slugify(editing.name),
          siteName: siteSettings?.siteName,
        },
      });

      if (res?.description) {
        setEditing((prev) =>
          prev
            ? {
                ...prev,
                description: res.description,
                metaDescription: prev.metaDescription || res.description,
              }
            : null,
        );
        toast.success(
          res.provider
            ? `AI generated description using ${res.provider}!`
            : "SEO description generated successfully!",
        );
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to generate description with AI");
    } finally {
      setIsGeneratingAi(false);
    }
  };

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
      router.invalidate();
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
      loadCategories();
      router.invalidate();
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
      router.invalidate();
    } catch (err: any) {
      toast.error(err.message || "Failed to delete category");
    }
  };

  const handleSaveReorder = async (orderedCats: Cat[]) => {
    try {
      await Promise.all(orderedCats.map((c) => saveCatFn({ data: c })));
      toast.success("Category order saved successfully");
      setReordering(false);
      loadCategories();
      router.invalidate();
    } catch (err: any) {
      toast.error(err.message || "Failed to save category order");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="flex items-center gap-2 text-xl sm:text-2xl font-bold tracking-tight">
            News Categories
            <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600">
              {allCats.length} Total
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Manage article categories, SEO metadata, and category feeds.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          <CsvImportExport data={paged} getData={async () => allCats} filename="categories" onImport={handleImport} />
          {allCats.length > 0 && (
            <button
              onClick={() => setReordering(true)}
              className="inline-flex items-center gap-1.5 sm:gap-2 rounded-md bg-white border border-slate-200 px-2.5 sm:px-3.5 py-1.5 text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-50 shadow-xs whitespace-nowrap transition"
            >
              <GripVertical className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-slate-400" /> Reorder Header
            </button>
          )}
          <button
            onClick={() =>
              setEditing({
                id: Date.now(),
                name: "",
                slug: "",
                description: "",
                metaTitle: "",
                metaDescription: "",
                showInHeader: false,
                sortOrder: 0,
                redirectUrl: "",
              })
            }
            className="inline-flex items-center gap-1.5 sm:gap-2 rounded-md bg-slate-900 px-2.5 sm:px-3.5 py-1.5 text-xs sm:text-sm font-semibold text-white hover:bg-slate-800 transition whitespace-nowrap shadow-xs"
          >
            <Plus className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> Add Category
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
            Page <strong>{safePage}</strong> of <strong>{totalPages}</strong> ({cats.length} total
            categories)
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
        <CategoryEditModal
          editing={editing}
          setEditing={setEditing}
          onSave={handleSave}
          onAiGenerate={handleAiGenerateDescription}
          isGeneratingAi={isGeneratingAi}
        />
      )}

      {/* Reorder Modal */}
      {reordering && (
        <ReorderModal
          categories={allCats}
          onClose={() => setReordering(false)}
          onSave={handleSaveReorder}
        />
      )}
    </div>
  );
}
