import { Pencil, Trash2, Tag as TagIcon } from "lucide-react";
import type { TagRow } from "@/lib/taxonomy.functions";

type Props = {
  tags: TagRow[];
  onEdit: (tag: TagRow) => void;
  onDelete: (tag: TagRow) => void;
};

export function TagTable({ tags, onEdit, onDelete }: Props) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-slate-200 bg-slate-50 text-xs font-bold uppercase tracking-wider text-slate-500">
          <tr>
            <th className="px-5 py-3">Tag Name</th>
            <th className="px-5 py-3">Slug</th>
            <th className="px-5 py-3 text-right">Usage Count</th>
            <th className="px-5 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {tags.map((t) => (
            <tr key={t.id} className="hover:bg-slate-50/70 transition-colors">
              <td className="px-5 py-3">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-xs font-semibold text-slate-700">
                  <TagIcon className="h-3 w-3 text-slate-400" /> #{t.name}
                </span>
              </td>
              <td className="px-5 py-3 font-mono text-xs text-slate-500">{t.slug}</td>
              <td className="px-5 py-3 text-right font-bold text-slate-700">{t.count || 0}</td>
              <td className="px-5 py-3 text-right">
                <div className="inline-flex gap-1.5">
                  <button
                    onClick={() => onEdit(t)}
                    className="inline-flex items-center gap-1 rounded-md border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50"
                  >
                    <Pencil className="h-3 w-3" /> Edit
                  </button>
                  <button
                    onClick={() => onDelete(t)}
                    className="inline-flex items-center gap-1 rounded-md border border-red-200 bg-red-50 px-2.5 py-1 text-xs font-medium text-red-600 hover:bg-red-100"
                  >
                    <Trash2 className="h-3 w-3" /> Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}

          {tags.length === 0 && (
            <tr>
              <td colSpan={4} className="px-5 py-8 text-center text-xs text-slate-400">
                No tags found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
