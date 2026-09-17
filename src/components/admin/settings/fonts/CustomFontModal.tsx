import { useState } from "react";
import { Plus, X, AlertTriangle } from "lucide-react";

interface CustomFontModalProps {
  onAdd: (name: string, weights: string) => void;
  onClose: () => void;
}

export function CustomFontModal({ onAdd, onClose }: CustomFontModalProps) {
  const [name, setName] = useState("");
  const [weights, setWeights] = useState("400, 500, 600, 700");

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="mx-4 w-full max-w-md rounded-xl border border-slate-200 bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Add Custom Google Font</h3>
            <p className="text-xs text-slate-500">Type the exact name from fonts.google.com</p>
          </div>
          <button onClick={onClose} className="rounded-md p-1 hover:bg-slate-100 transition">
            <X className="h-5 w-5 text-slate-500" />
          </button>
        </div>

        <div className="px-6 py-4 space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Font Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Roboto Slab"
              className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400"
              autoFocus
            />
            <p className="mt-1 text-[10px] text-slate-400">
              Must match exactly as shown on fonts.google.com
            </p>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Weights (comma-separated)
            </label>
            <input
              type="text"
              value={weights}
              onChange={(e) => setWeights(e.target.value)}
              placeholder="400, 500, 600, 700"
              className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400"
            />
          </div>
          <div className="flex items-start gap-2 rounded-md bg-amber-50 border border-amber-200 p-3">
            <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
            <p className="text-xs text-amber-800">
              If the font name is incorrect, it won't load. Verify the exact name at{" "}
              <a
                href="https://fonts.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="underline font-medium"
              >
                fonts.google.com
              </a>
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-2 border-t border-slate-200 px-6 py-3">
          <button
            onClick={onClose}
            className="rounded-md border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 transition"
          >
            Cancel
          </button>
          <button
            onClick={() => onAdd(name, weights)}
            disabled={!name.trim()}
            className="inline-flex items-center gap-2 rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50 transition"
          >
            <Plus className="h-4 w-4" /> Add Font
          </button>
        </div>
      </div>
    </div>
  );
}
