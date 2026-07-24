import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Pencil, Trash2, Plus, ChevronLeft, ChevronRight, X, Search, Tag as TagIcon, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { getTags, saveTag, deleteTag, importTags, type TagRow } from "@/lib/taxonomy.functions";
import { slugify } from "@/lib/news-data";
import { CsvImportExport } from "@/components/admin/CsvImportExport";

export const Route = createFileRoute("/admin/tags")({
  component: TagsPage,
});

const blank = (name = ""): TagRow => ({
  id: Date.now(),
  name,
  slug: slugify(name),
  count: 0,
});

function TagsPage() {
  const fetchTagsFn = useServerFn(getTags);
  const saveTagFn = useServerFn(saveTag);
  const deleteTagFn = useServerFn(deleteTag);
  const importTagsFn = useServerFn(importTags);

  const [tags, setTags] = useState<TagRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [editing, setEditing] = useState<TagRow | null>(null);
  const [page, setPage] = useState(1);
  const [q, setQ] = useState("");
  const PAGE_SIZE = 15;

  const loadTags = async () => {
    try {
      setLoading(true);
      const res = await fetchTagsFn();
      setTags(res);
    } catch (err: any) {
      toast.error(err.message || "Failed to load tags");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTags();
  }, []);

  const handleImport = async (data: any[]) => {
    try {
      setLoading(true);
      await importTagsFn({ data });
      toast.success("Tags imported successfully");
      await loadTags();
    } catch (err: any) {
      toast.error(err.message || "Failed to import tags");
    } finally {
      setLoading(false);
    }
  };

  const filtered = useMemo(
    () => tags.filter((t) => t.name.toLowerCase().includes(q.toLowerCase())),
    [tags, q],
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const paged = useMemo(
    () => filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE),
    [filtered, safePage],
  );

  const add = async () => {
    if (!name.trim()) return toast.error("Name required");
    try {
      const t = blank(name.trim());
      const saved = await saveTagFn({ data: t });
      setTags((p) => [...p, saved]);
      setName("");
      toast.success("Tag added");
    } catch (err: any) {
      toast.error(err.message || "Failed to add tag");
    }
  };

  const save = async (t: TagRow) => {
    try {
      const saved = await saveTagFn({ data: t });
      setTags((p) => p.map((x) => (x.id === saved.id ? saved : x)));
      setEditing(null);
      toast.success("Tag updated");
    } catch (err: any) {
      toast.error(err.message || "Failed to update tag");
    }
  };

  const remove = async (id: number) => {
    if (!confirm("Are you sure you want to delete this tag?")) return;
    try {
      await deleteTagFn({ data: id });
      setTags((p) => p.filter((t) => t.id !== id));
      toast.success("Tag deleted");
    } catch (err: any) {
      toast.error(err.message || "Failed to delete tag");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Tags {!loading && <span className="ml-1 text-base font-normal text-slate-500">({tags.length})</span>}
          </h1>
          <p className="text-sm text-slate-500">Manage keywords and tags for articles taxonomy.</p>
        </div>
        <CsvImportExport
          data={tags}
          filename="tags"
          onImport={handleImport}
        />
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-lg border border-slate-200 bg-white p-3 md:p-5">
        <div className="flex items-center gap-2 flex-1 sm:max-w-md">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Tag name (e.g. inflation)"
            className="flex-1 rounded-md border border-slate-200 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none"
          />
          <button onClick={add} className="inline-flex shrink-0 items-center gap-2 rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800">
            <Plus className="h-4 w-4" /> Add
          </button>
        </div>

        <div className="relative w-full sm:max-w-xs shrink-0">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={q}
            onChange={(e) => { setQ(e.target.value); setPage(1); }}
            placeholder="Search tags..."
            className="w-full rounded-md border border-slate-200 py-2 pl-9 pr-3 text-sm focus:border-slate-900 focus:outline-none"
          />
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
        <table className="w-full min-w-[700px] text-sm">
          <thead className="bg-slate-50 text-left text-xs uppercase tracking-wider text-slate-500">
            <tr>
              <th className="px-5 py-3">Name</th>
              <th className="px-5 py-3">Slug</th>
              <th className="px-5 py-3">Articles</th>
              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading && (
              <tr>
                <td colSpan={4} className="px-5 py-12 text-center text-slate-500">
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Loading tags from MySQL...</span>
                  </div>
                </td>
              </tr>
            )}
            {!loading && paged.map((t) => (
              <tr key={t.id} className="hover:bg-slate-50/60">
                <td className="px-5 py-3 font-medium">
                  <span className="inline-flex items-center gap-1">
                    <TagIcon className="h-3 w-3 text-slate-400" />
                    {t.name}
                  </span>
                </td>
                <td className="px-5 py-3 text-slate-500">#{t.slug}</td>
                <td className="px-5 py-3 text-slate-600">{t.count}</td>
                <td className="px-5 py-3 text-right">
                  <div className="inline-flex gap-2">
                    <button onClick={() => setEditing(t)} className="grid h-8 w-8 place-items-center rounded-md border border-slate-200 hover:bg-slate-100" aria-label="Edit">
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button onClick={() => remove(t.id)} className="grid h-8 w-8 place-items-center rounded-md border border-slate-200 text-red-600 hover:bg-red-50" aria-label="Delete">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {!loading && filtered.length === 0 && (
              <tr><td colSpan={4} className="px-5 py-8 text-center text-slate-500">No tags found.</td></tr>
            )}
          </tbody>
        </table>
        {filtered.length > 0 && (
          <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-5 py-3 text-xs text-slate-600">
            <span>Showing {(safePage - 1) * PAGE_SIZE + 1}–{Math.min(safePage * PAGE_SIZE, filtered.length)} of {filtered.length}</span>
            {totalPages > 1 && (
              <div className="flex items-center gap-1">
                <button disabled={safePage === 1} onClick={() => setPage((p) => p - 1)} className="grid h-7 w-7 place-items-center rounded border border-slate-200 bg-white disabled:opacity-40"><ChevronLeft className="h-3.5 w-3.5" /></button>
                <span className="px-2">{safePage} / {totalPages}</span>
                <button disabled={safePage === totalPages} onClick={() => setPage((p) => p + 1)} className="grid h-7 w-7 place-items-center rounded border border-slate-200 bg-white disabled:opacity-40"><ChevronRight className="h-3.5 w-3.5" /></button>
              </div>
            )}
          </div>
        )}
      </div>

      {editing && <EditDrawer tag={editing} onClose={() => setEditing(null)} onSave={save} />}
    </div>
  );
}

function EditDrawer({ tag, onClose, onSave }: { tag: TagRow; onClose: () => void; onSave: (t: TagRow) => void }) {
  const [form, setForm] = useState<TagRow>(tag);
  const update = <K extends keyof TagRow>(k: K, v: TagRow[K]) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/50" onClick={onClose}>
      <div className="flex h-full w-full max-w-md flex-col bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div>
            <h2 className="text-lg font-bold">Edit tag</h2>
            <p className="text-xs text-slate-500">Update tag keywords</p>
          </div>
          <button onClick={onClose} className="grid h-8 w-8 place-items-center rounded-md hover:bg-slate-100" aria-label="Close"><X className="h-4 w-4" /></button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
          <Field label="Name">
            <input value={form.name} onChange={(e) => update("name", e.target.value)} className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none" />
          </Field>
          <Field label="Slug" hint="URL tag segment">
            <input value={form.slug} onChange={(e) => update("slug", slugify(e.target.value))} className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none" />
          </Field>
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-slate-200 bg-slate-50 px-6 py-3">
          <button onClick={onClose} className="rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-medium hover:bg-slate-100">Cancel</button>
          <button onClick={() => onSave(form)} className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800">Save changes</button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between">
        <label className="text-xs font-semibold text-slate-700">{label}</label>
        {hint && <span className="text-[10px] text-slate-400">{hint}</span>}
      </div>
      {children}
    </div>
  );
}
