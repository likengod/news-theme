import { AlertTriangle, Trash2 } from "lucide-react";

interface ConfirmModalProps {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

/**
 * Replaces browser-native confirm() dialogs with a clean, accessible modal.
 * Use this for any destructive action (delete, bulk delete, etc.)
 */
export function ConfirmModal({
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  danger = true,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onCancel(); }}
    >
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl ring-1 ring-slate-200">
        <div className={`mb-4 flex h-11 w-11 items-center justify-center rounded-full ${danger ? "bg-red-100" : "bg-slate-100"}`}>
          {danger
            ? <AlertTriangle className="h-5 w-5 text-red-600" />
            : <Trash2 className="h-5 w-5 text-slate-600" />
          }
        </div>

        <h2 className="text-base font-bold text-slate-800">{title}</h2>
        <p className="mt-1.5 text-sm text-slate-500">{message}</p>

        <div className="mt-5 flex gap-3">
          <button
            onClick={onConfirm}
            className={`flex-1 rounded-lg py-2.5 text-sm font-semibold text-white transition ${
              danger
                ? "bg-red-600 hover:bg-red-700"
                : "bg-slate-900 hover:bg-slate-800"
            }`}
          >
            {confirmLabel}
          </button>
          <button
            onClick={onCancel}
            className="flex-1 rounded-lg border border-slate-200 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            {cancelLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
