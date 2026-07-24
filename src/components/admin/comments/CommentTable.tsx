import { Check, Trash2, X } from "lucide-react";
import type { CommentRow } from "@/lib/comments.functions";

type Props = {
  comments: CommentRow[];
  onSetStatus: (id: number, status: "Approved" | "Pending" | "Spam") => void;
  onDelete: (id: number) => void;
};

const badge: Record<CommentRow["status"], string> = {
  Approved: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Pending: "bg-amber-50 text-amber-700 border-amber-200",
  Spam: "bg-red-50 text-red-700 border-red-200",
};

export function CommentTable({ comments, onSetStatus, onDelete }: Props) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-slate-200 bg-slate-50 text-xs font-bold uppercase tracking-wider text-slate-500">
          <tr>
            <th className="px-5 py-3">User</th>
            <th className="px-5 py-3">Comment Body</th>
            <th className="px-5 py-3">Article</th>
            <th className="px-5 py-3">Status</th>
            <th className="px-5 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {comments.map((c) => (
            <tr key={c.id} className="hover:bg-slate-50/70 transition-colors">
              <td className="px-5 py-3">
                <p className="font-semibold text-slate-900">{c.user || "Anonymous"}</p>
                <p className="text-xs text-slate-500">{c.email}</p>
              </td>
              <td className="px-5 py-3 text-xs text-slate-700 max-w-sm">{c.body}</td>
              <td className="px-5 py-3 text-xs text-slate-600 font-medium max-w-xs truncate">
                <a href={`/news/${c.articleSlug}`} target="_blank" rel="noopener noreferrer" className="hover:underline text-blue-600">
                  {c.articleTitle || c.articleSlug}
                </a>
              </td>
              <td className="px-5 py-3">
                <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-semibold ${badge[c.status]}`}>
                  {c.status}
                </span>
              </td>
              <td className="px-5 py-3 text-right">
                <div className="inline-flex gap-1">
                  {c.status !== "Approved" && (
                    <button
                      onClick={() => onSetStatus(c.id, "Approved")}
                      title="Approve Comment"
                      className="rounded-md border border-emerald-200 bg-emerald-50 p-1.5 text-emerald-700 hover:bg-emerald-100"
                    >
                      <Check className="h-3.5 w-3.5" />
                    </button>
                  )}
                  {c.status !== "Spam" && (
                    <button
                      onClick={() => onSetStatus(c.id, "Spam")}
                      title="Mark as Spam"
                      className="rounded-md border border-amber-200 bg-amber-50 p-1.5 text-amber-800 hover:bg-amber-100"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}
                  <button
                    onClick={() => onDelete(c.id)}
                    title="Delete Comment"
                    className="rounded-md border border-red-200 bg-red-50 p-1.5 text-red-600 hover:bg-red-100"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </td>
            </tr>
          ))}

          {comments.length === 0 && (
            <tr>
              <td colSpan={5} className="px-5 py-8 text-center text-xs text-slate-400">
                No comments found in this tab.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
