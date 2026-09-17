import { useState } from "react";
import { Search, Globe, Plus, X, Check } from "lucide-react";
import { type FontEntry, GOOGLE_FONTS_CATALOG } from "@/lib/font-config";

interface GoogleFontsCatalogModalProps {
  fonts: FontEntry[];
  onAdd: (entry: { name: string; family: string; weights: string[]; category: string }) => void;
  onClose: () => void;
}

export function GoogleFontsCatalogModal({
  fonts,
  onAdd,
  onClose,
}: GoogleFontsCatalogModalProps) {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  const categories = ["All", ...new Set(GOOGLE_FONTS_CATALOG.map((f) => f.category))];
  const filtered = GOOGLE_FONTS_CATALOG.filter((f) => {
    const matchesSearch = f.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === "All" || f.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const alreadyAdded = new Set(fonts.map((f) => f.family.toLowerCase()));

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="mx-4 w-full max-w-xl rounded-xl border border-slate-200 bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Google Fonts Catalog</h3>
            <p className="text-xs text-slate-500">
              Select from popular Google Fonts to add to your library
            </p>
          </div>
          <button onClick={onClose} className="rounded-md p-1 hover:bg-slate-100 transition">
            <X className="h-5 w-5 text-slate-500" />
          </button>
        </div>

        <div className="px-6 py-3 space-y-3 border-b border-slate-100">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search fonts..."
              className="w-full rounded-md border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400"
              autoFocus
            />
          </div>
          <div className="flex flex-wrap gap-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                  categoryFilter === cat
                    ? "bg-slate-900 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="max-h-[340px] overflow-y-auto px-6 py-3">
          {filtered.length === 0 ? (
            <p className="py-8 text-center text-sm text-slate-400">No fonts match your search</p>
          ) : (
            <div className="space-y-2">
              {filtered.map((f) => {
                const exists = alreadyAdded.has(f.family.toLowerCase());
                return (
                  <div
                    key={f.family}
                    className={`flex items-center justify-between rounded-lg border px-4 py-3 transition ${
                      exists
                        ? "border-slate-100 bg-slate-50 opacity-60"
                        : "border-slate-200 hover:border-slate-300 bg-white"
                    }`}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-900">{f.name}</p>
                      <p className="text-[10px] text-slate-400">
                        {f.category} · Weights: {f.weights.join(", ")}
                      </p>
                    </div>
                    {exists ? (
                      <span className="flex items-center gap-1 text-[10px] font-medium text-emerald-600">
                        <Check className="h-3 w-3" /> Added
                      </span>
                    ) : (
                      <button
                        onClick={() => onAdd(f)}
                        className="inline-flex items-center gap-1 rounded-md bg-slate-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-slate-800 transition"
                      >
                        <Plus className="h-3 w-3" /> Add
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="border-t border-slate-200 px-6 py-3 text-right">
          <button
            onClick={onClose}
            className="rounded-md border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
