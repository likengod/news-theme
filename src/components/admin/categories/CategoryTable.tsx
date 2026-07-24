import { Pencil, Trash2 } from "lucide-react";
import type { CategoryRow } from "@/lib/taxonomy.functions";

type Props = {
  categories: CategoryRow[];
  onEdit: (cat: CategoryRow) => void;
  onDelete: (cat: CategoryRow) => void;
};

export function CategoryTable({ categories, onEdit, onDelete }: Props) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-slate-200 bg-slate-50 text-xs font-bold uppercase tracking-wider text-slate-500">
          <tr>
            <th className="px-5 py-3">Category</th>
            <th className="px-5 py-3">Slug</th>
            <th className="px-5 py-3">Description</th>
            <th className="px-5 py-3 text-right">Articles</th>
            <th className="px-5 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {categories.map((c) => (
            <tr key={c.id} className="hover:bg-slate-50/70 transition-colors">
              <td className="px-5 py-3 font-semibold text-slate-900">{c.name}</td>
              <td className="px-5 py-3 font-mono text-xs text-slate-500">{c.slug}</td>
              <td className="px-5 py-3 text-xs text-slate-600 max-w-xs truncate">{c.description || "—"}</td>
              <td className="px-5 py-3 text-right font-bold text-slate-700">{c.count || 0}</td>
              <td className="px-5 py-3 text-right">
                <div className="inline-flex gap-1.5">
                  <button
                    onClick={() => onEdit(c)}
                    className="inline-flex items-center gap-1 rounded-md border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50"
                  >
                    <Pencil className="h-3 w-3" /> Edit
                  </button>
                  <button
                    onClick={() => onDelete(c)}
                    className="inline-flex items-center gap-1 rounded-md border border-red-200 bg-red-50 px-2.5 py-1 text-xs font-medium text-red-600 hover:bg-red-100"
                  >
                    <Trash2 className="h-3 w-3" /> Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}

          {categories.length === 0 && (
            <tr>
              <td colSpan={5} className="px-5 py-8 text-center text-xs text-slate-400">
                No categories found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
