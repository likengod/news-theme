import React, { useState, useEffect, useRef, useMemo } from "react";
import { Star, X, Plus, Check, ChevronDown, Search, Tag, Edit3 } from "lucide-react";
import { useCategories } from "@/components/site/AdSettingsContext";
import { getCategories } from "@/lib/taxonomy.functions";

interface MultiCategorySelectorProps {
  value: string;
  onChange: (val: string) => void;
}

const POPULAR_SUGGESTIONS = [
  "Tripura",
  "State",
  "National",
  "Politics",
  "Sports",
  "Entertainment",
  "Crime",
  "Business",
];

export default function MultiCategorySelector({
  value,
  onChange,
}: MultiCategorySelectorProps) {
  const contextCats = useCategories();
  const [fetchedCats, setFetchedCats] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [showDirectEdit, setShowDirectEdit] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Fetch DB categories on mount as well to ensure latest categories
  useEffect(() => {
    let isMounted = true;
    getCategories()
      .then((cats) => {
        if (isMounted && Array.isArray(cats)) {
          setFetchedCats(cats);
        }
      })
      .catch((err) => {
        console.warn("[MultiCategorySelector] Failed to fetch taxonomy categories:", err);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  // Parse selected categories array
  const selectedCategories = useMemo(() => {
    if (!value) return [];
    return value
      .split(",")
      .map((c) => c.trim())
      .filter(Boolean);
  }, [value]);

  // Combine all available categories (DB categories only — no hardcoded defaults)
  const allAvailableCategories = useMemo(() => {
    const set = new Set<string>();
    // Context categories (from root loader)
    (contextCats || []).forEach((c) => {
      if (c?.name) set.add(c.name);
    });
    // Fetched DB categories
    (fetchedCats || []).forEach((c) => {
      if (c?.name) set.add(c.name);
    });
    // Also include any currently selected categories (even custom ones)
    selectedCategories.forEach((s) => set.add(s));
    return Array.from(set);
  }, [contextCats, fetchedCats, selectedCategories]);

  // Filtered by search
  const filteredCategories = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return allAvailableCategories;
    return allAvailableCategories.filter((c) => c.toLowerCase().includes(q));
  }, [allAvailableCategories, query]);

  // Close dropdown on outside click
  useEffect(() => {
    if (!isOpen) return;
    const handleOutsideClick = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [isOpen]);

  // Auto focus search when popover opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 50);
    } else {
      setQuery("");
    }
  }, [isOpen]);

  const addCategory = (cat: string) => {
    const trimmed = cat.trim();
    if (!trimmed) return;
    if (selectedCategories.includes(trimmed)) return;
    const next = [...selectedCategories, trimmed];
    onChange(next.join(", "));
  };

  const removeCategory = (cat: string) => {
    const next = selectedCategories.filter((c) => c !== cat);
    onChange(next.join(", "));
  };

  const makePrimary = (cat: string) => {
    const next = [cat, ...selectedCategories.filter((c) => c !== cat)];
    onChange(next.join(", "));
  };

  const toggleCategory = (cat: string) => {
    if (selectedCategories.includes(cat)) {
      removeCategory(cat);
    } else {
      addCategory(cat);
    }
  };

  const handleCreateCustom = () => {
    const trimmed = query.trim();
    if (!trimmed) return;
    addCategory(trimmed);
    setQuery("");
  };

  const exactMatchExists = allAvailableCategories.some(
    (c) => c.toLowerCase() === query.trim().toLowerCase(),
  );

  return (
    <div className="space-y-2">
      {/* Header Info */}
      <div className="flex items-center justify-between text-xs">
        <span className="font-semibold uppercase tracking-wider text-slate-700">
          Categories{" "}
          {selectedCategories.length > 0 && (
            <span className="ml-1 text-slate-500 font-normal">
              ({selectedCategories.length} selected)
            </span>
          )}
        </span>
        <button
          type="button"
          onClick={() => setShowDirectEdit((prev) => !prev)}
          className="inline-flex items-center gap-1 text-[11px] text-blue-600 hover:text-blue-800 transition"
        >
          <Edit3 className="h-3 w-3" />
          {showDirectEdit ? "Hide direct edit" : "Edit as text"}
        </button>
      </div>

      {/* Selected Categories Display & Dropdown trigger */}
      <div
        ref={popoverRef}
        className="relative"
      >
        <div
          onClick={() => setIsOpen((prev) => !prev)}
          className="min-h-[42px] w-full rounded-md border border-slate-200 bg-white p-1.5 flex flex-wrap items-center gap-1.5 cursor-pointer hover:border-slate-300 focus-within:border-slate-900 transition"
        >
          {selectedCategories.length === 0 ? (
            <span className="px-2 py-1 text-xs text-slate-400 italic">
              No categories selected — click to add categories
            </span>
          ) : (
            selectedCategories.map((cat, idx) => {
              const isPrimary = idx === 0;
              return isPrimary ? (
                <span
                  key={cat}
                  className="inline-flex items-center gap-1.5 rounded-md bg-amber-50 border border-amber-300/80 px-2.5 py-1 text-xs font-semibold text-amber-900 shadow-xs"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500 shrink-0" />
                  <span>{cat}</span>
                  <span className="rounded bg-amber-200/60 px-1 py-0.2 text-[9px] font-bold text-amber-800 uppercase tracking-wider">
                    Primary
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeCategory(cat);
                    }}
                    className="ml-0.5 rounded p-0.5 text-amber-700 hover:bg-amber-200 hover:text-amber-950 transition"
                    title="Remove category"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ) : (
                <span
                  key={cat}
                  className="inline-flex items-center gap-1.5 rounded-md bg-slate-100 border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-200/70 transition"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Tag className="h-3 w-3 text-slate-400 shrink-0" />
                  <span>{cat}</span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      makePrimary(cat);
                    }}
                    className="text-slate-400 hover:text-amber-600 transition"
                    title="Make this Primary Category (used for main links & URL)"
                  >
                    <Star className="h-3 w-3" />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeCategory(cat);
                    }}
                    className="rounded p-0.5 text-slate-400 hover:bg-slate-200 hover:text-red-600 transition"
                    title="Remove category"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              );
            })
          )}

          <button
            type="button"
            className="ml-auto inline-flex items-center gap-1 rounded bg-slate-100 hover:bg-slate-200 px-2 py-1 text-xs font-medium text-slate-700 transition"
          >
            <Plus className="h-3 w-3" />
            <span>Add</span>
            <ChevronDown className="h-3 w-3 text-slate-400" />
          </button>
        </div>

        {/* Dropdown Popover */}
        {isOpen && (
          <div className="absolute left-0 right-0 top-full z-50 mt-1.5 rounded-lg border border-slate-200 bg-white p-2.5 shadow-xl animate-in fade-in zoom-in-95 duration-150">
            {/* Search Input */}
            <div className="relative mb-2">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
              <input
                ref={searchInputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    if (!exactMatchExists && query.trim()) {
                      handleCreateCustom();
                    } else if (filteredCategories.length > 0) {
                      toggleCategory(filteredCategories[0]);
                    }
                  }
                }}
                placeholder="Search or enter custom category..."
                className="w-full rounded-md border border-slate-200 py-1.5 pl-8 pr-3 text-xs focus:border-slate-900 focus:outline-none"
              />
            </div>

            {/* Custom Category Add Button if not exists */}
            {query.trim() && !exactMatchExists && (
              <button
                type="button"
                onClick={handleCreateCustom}
                className="mb-2 w-full flex items-center justify-between rounded-md bg-blue-50 border border-blue-200 px-2.5 py-1.5 text-xs font-medium text-blue-700 hover:bg-blue-100 transition"
              >
                <span>Add "{query.trim()}" as category</span>
                <Plus className="h-3.5 w-3.5" />
              </button>
            )}

            {/* Category Checkbox List */}
            <div className="max-h-52 overflow-y-auto space-y-0.5 pr-1">
              {filteredCategories.length === 0 && !query.trim() ? (
                <div className="py-3 text-center text-xs text-slate-400">
                  No categories found
                </div>
              ) : (
                filteredCategories.map((cat) => {
                  const isSelected = selectedCategories.includes(cat);
                  const isPrimary = selectedCategories[0] === cat;

                  return (
                    <div
                      key={cat}
                      onClick={() => toggleCategory(cat)}
                      className={`flex items-center justify-between rounded-md px-2.5 py-1.5 text-xs cursor-pointer transition select-none ${
                        isSelected
                          ? "bg-slate-100/90 text-slate-900 font-medium"
                          : "text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className={`grid h-4 w-4 place-items-center rounded border ${
                            isSelected
                              ? "bg-slate-900 border-slate-900 text-white"
                              : "border-slate-300 bg-white"
                          }`}
                        >
                          {isSelected && <Check className="h-3 w-3 stroke-[3]" />}
                        </div>
                        <span>{cat}</span>
                      </div>

                      {isSelected && (
                        <div className="flex items-center gap-1">
                          {isPrimary ? (
                            <span className="inline-flex items-center gap-1 rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold text-amber-800">
                              <Star className="h-2.5 w-2.5 fill-amber-600 text-amber-600" />
                              Primary
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                makePrimary(cat);
                              }}
                              className="text-[10px] text-slate-500 hover:text-amber-700 hover:underline px-1"
                              title="Make this category Primary"
                            >
                              Set Primary
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            {/* Popover Footer */}
            <div className="mt-2.5 flex items-center justify-between border-t border-slate-100 pt-2 text-[11px] text-slate-400">
              <span>First category is Primary (★)</span>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="font-medium text-slate-700 hover:text-slate-900"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Quick Suggestions Chips */}
      <div className="flex flex-wrap items-center gap-1 text-xs">
        <span className="text-[11px] text-slate-400 mr-0.5">Quick add:</span>
        {POPULAR_SUGGESTIONS.map((cat) => {
          const isSelected = selectedCategories.includes(cat);
          if (isSelected) return null;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => addCategory(cat)}
              className="inline-flex items-center gap-0.5 rounded border border-dashed border-slate-200 bg-slate-50/70 px-1.5 py-0.5 text-[11px] text-slate-600 hover:bg-slate-100 hover:border-slate-300 transition"
            >
              <Plus className="h-2.5 w-2.5 text-slate-400" />
              <span>{cat}</span>
            </button>
          );
        })}
      </div>

      {/* Direct text input for comma-separated categories (if toggled) */}
      {showDirectEdit && (
        <div className="mt-2 rounded-md border border-slate-200 bg-slate-50/50 p-2.5 text-xs space-y-1">
          <label className="block text-[11px] font-medium text-slate-600">
            Comma-separated category list:
          </label>
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="e.g. Business, State, National, Tripura"
            className="w-full rounded border border-slate-200 bg-white px-2 py-1.5 text-xs focus:border-slate-900 focus:outline-none"
          />
          <p className="text-[10px] text-slate-400">
            Separate categories with commas. The first category will be the primary one.
          </p>
        </div>
      )}
    </div>
  );
}
