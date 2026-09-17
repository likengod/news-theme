import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { deleteAllCommentsFn, type CommentRow } from "@/lib/comments.functions";

interface DeleteAllModalProps {
  isOpen: boolean;
  tab: CommentRow["status"] | "All";
  onClose: () => void;
  onSuccess: () => void;
}

export function DeleteAllModal({ isOpen, tab, onClose, onSuccess }: DeleteAllModalProps) {
  const deleteAllFn = useServerFn(deleteAllCommentsFn);
  const [deletingAll, setDeletingAll] = useState(false);

  if (!isOpen) return null;

  const handleDeleteAll = async () => {
    try {
      setDeletingAll(true);
      await deleteAllFn({ data: { status: tab } });
      toast.success(`All ${tab === "All" ? "" : tab + " "}comments permanently deleted!`);
      onClose();
      onSuccess();
    } catch (err: any) {
      toast.error(err.message || "Failed to delete comments");
    } finally {
      setDeletingAll(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-xl bg-white shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Trash2 className="h-5 w-5 text-red-600" /> Delete All Comments
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="p-6">
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 mb-5">
            <p className="text-sm font-semibold text-red-800 mb-1">⚠️ This action is permanent!</p>
            <p className="text-sm text-red-700">
              {tab === "All"
                ? "All comments will be permanently deleted from the database and cannot be recovered."
                : `All "${tab}" comments will be permanently deleted and cannot be recovered.`}
            </p>
          </div>
          <p className="text-sm text-slate-600 mb-6">
            Currently viewing: <strong>{tab}</strong> tab.
            {tab !== "All" && " Only comments in this tab will be deleted."}
          </p>
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              disabled={deletingAll}
              className="rounded-md px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteAll}
              disabled={deletingAll}
              className="inline-flex items-center gap-2 rounded-md bg-red-600 px-5 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
            >
              <Trash2 className="h-4 w-4" />
              {deletingAll ? "Deleting..." : `Yes, Delete All ${tab === "All" ? "" : tab}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
