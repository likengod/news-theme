import { Plus, Pencil, Trash2 } from "lucide-react";

type Column = { key: string; label: string; align?: "right" };

type Props = {
  title: string;
  columns: Column[];
  data: Record<string, any>[];
  onAdd: () => void;
  onEdit: (item: any) => void;
  onDelete: (id: string) => void;
  addLabel?: string;
  renderCell?: (item: any, colKey: string) => React.ReactNode;
};

export function RewardTable({ title, columns, data, onAdd, onEdit, onDelete, addLabel = "Add", renderCell }: Props) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white">
      <div className="flex items-center justify-between border-b border-slate-200 px-5 py-3">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500">{title}</h3>
        <button
          onClick={onAdd}
          className="inline-flex items-center gap-1.5 rounded-md bg-slate-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-slate-800"
        >
          <Plus className="h-3.5 w-3.5" /> {addLabel}
        </button>
      </div>
      <table className="w-full text-sm">
        <thead className="bg-slate-50 text-left text-xs uppercase tracking-wider text-slate-500">
          <tr>
            {columns.map((c) => (
              <th key={c.key} className={`px-5 py-3 ${c.align === "right" ? "text-right" : ""}`}>{c.label}</th>
            ))}
            <th className="px-5 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {data.map((item) => (
            <tr key={item.id} className="hover:bg-slate-50/60">
              {columns.map((c) => (
                <td key={c.key} className={`px-5 py-3 ${c.align === "right" ? "text-right" : ""} ${c.key === "title" ? "font-medium" : "text-slate-600"}`}>
                  {renderCell ? renderCell(item, c.key) : (item[c.key] || "—")}
                </td>
              ))}
              <td className="px-5 py-3 text-right">
                <div className="inline-flex gap-2">
                  <button onClick={() => onEdit(item)} className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 px-3 py-1.5 text-xs hover:bg-slate-50">
                    <Pencil className="h-3 w-3" /> Edit
                  </button>
                  <button onClick={() => onDelete(item.id)} className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 px-3 py-1.5 text-xs text-red-600 hover:bg-red-50">
                    <Trash2 className="h-3 w-3" /> Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
          {data.length === 0 && (
            <tr><td colSpan={columns.length + 1} className="px-5 py-6 text-center text-slate-400">No items yet.</td></tr>
          )}
        </tbody>
      </table>
    </section>
  );
}
