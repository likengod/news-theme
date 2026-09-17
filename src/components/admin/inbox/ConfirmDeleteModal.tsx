import React from "react";
import { AlertTriangle } from "lucide-react";

interface ConfirmDeleteModalProps {
  confirmDelete: {
    id: number;
    userId?: string;
    isDeletion: boolean;
  };
  actionLoading: number | null;
  confirmAction: () => void;
  onCancel: () => void;
}

export function ConfirmDeleteModal({
  confirmDelete,
  actionLoading,
  confirmAction,
  onCancel,
}: ConfirmDeleteModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        {confirmDelete.isDeletion ? (
          <>
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <h2 className="text-lg font-bold text-slate-800">Permanently Delete User?</h2>
            <p className="mt-2 text-sm text-slate-600">
              This will <strong>permanently delete</strong> the user account and all associated
              data including profiles, articles, sessions, and roles.{" "}
              <strong>This action cannot be undone.</strong>
            </p>
            <div className="mt-6 flex gap-3">
              <button
                onClick={confirmAction}
                disabled={!!actionLoading}
                className="flex-1 rounded-md bg-red-600 py-2.5 text-sm font-bold text-white hover:bg-red-700 disabled:opacity-60"
              >
                Yes, Delete Permanently
              </button>
              <button
                onClick={onCancel}
                className="flex-1 rounded-md border border-slate-200 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
            </div>
          </>
        ) : (
          <>
            <h2 className="text-lg font-bold text-slate-800">Remove Request?</h2>
            <p className="mt-2 text-sm text-slate-600">
              This will permanently remove this inbox entry. The action cannot be undone.
            </p>
            <div className="mt-6 flex gap-3">
              <button
                onClick={confirmAction}
                disabled={!!actionLoading}
                className="flex-1 rounded-md bg-slate-900 py-2.5 text-sm font-bold text-white hover:bg-slate-800 disabled:opacity-60"
              >
                Remove
              </button>
              <button
                onClick={onCancel}
                className="flex-1 rounded-md border border-slate-200 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
