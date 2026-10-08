import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "@tanstack/react-router";
import { Search, X, Folder, FileText, Newspaper, ArrowRight, Hash } from "lucide-react";
import { getTopTags } from "@/lib/taxonomy.functions";
import { getQuickSearchPreview } from "@/lib/search.functions";

interface SearchModalProps {
  open: boolean;
  onClose: () => void;
}

type QuickPreview = {
  articles: { id: number; title: string; slug: string; category: string; date: string }[];
  categories: { name: string; slug: string; count: number }[];
  pages: { title: string; url: string; badge: string }[];
};

export function SearchModal({ open, onClose }: SearchModalProps) {
  const [mounted, setMounted] = useState(false);
  const [q, setQ] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([
    "Infrastructure",
    "Trade",
    "Governance",
    "Healthcare",
    "Economy",
    "Finance",
    "Space",
    "Tech",
    "Sports",
    "Culture",
  ]);
  const [preview, setPreview] = useState<QuickPreview | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;

    document.body.classList.add("search-modal-open");
    window.dispatchEvent(new CustomEvent("nt:search-modal-state", { detail: { open: true } }));

    // Fetch dynamic top 10 latest tags
    getTopTags()
      .then((tags) => {
        if (tags && tags.length > 0) {
          setSuggestions(tags.slice(0, 10));
        }
      })
      .catch((err) => {
        console.error("[SearchModal] Failed to load top tags:", err);
      });

    const focusTimer = setTimeout(() => inputRef.current?.focus(), 50);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";

    return () => {
      clearTimeout(focusTimer);
      document.body.classList.remove("search-modal-open");
      window.dispatchEvent(new CustomEvent("nt:search-modal-state", { detail: { open: false } }));
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  // Live preview debounce when typing
  useEffect(() => {
    const trimmed = q.trim();
    if (!trimmed || trimmed.length < 2) {
      setPreview(null);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const timer = setTimeout(() => {
      getQuickSearchPreview({ data: { q: trimmed } })
        .then((res) => {
          if (res) {
            setPreview(res);
          }
        })
        .catch(() => {
          setPreview(null);
        })
        .finally(() => {
          setIsSearching(false);
        });
    }, 200);

    return () => clearTimeout(timer);
  }, [q]);

  const go = (term: string) => {
    if (!term.trim()) return;
    navigate({ to: "/search", search: { q: term.trim(), page: 1, tab: "all" } });
    onClose();
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    go(q);
  };

  if (!open || !mounted) return null;

  const hasPreviewResults =
    preview &&
    (preview.categories.length > 0 || preview.pages.length > 0 || preview.articles.length > 0);

  return createPortal(
    <div
      className="fixed inset-0 z-[999999] h-screen w-screen flex flex-col items-center justify-center bg-white text-black px-4 transition-all duration-200 animate-in fade-in overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-label="Search site"
    >
      {/* Top-Right Close Button */}
      <button
        type="button"
        onClick={onClose}
        aria-label="Close search"
        className="absolute top-8 right-8 sm:top-10 sm:right-12 text-[#000000] p-2 hover:opacity-60 transition-opacity z-[1000000]"
      >
        <X className="h-6 w-6 stroke-[2]" />
      </button>

      {/* Centered Search Input Box & Live Results Container */}
      <div className="w-full max-w-[580px] text-left my-auto py-10">
        <form onSubmit={submit} className="relative w-full">
          <input
            ref={inputRef}
            id="site-search-modal-query"
            name="q"
            type="search"
            aria-label="Search articles"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Type & hit enter to search…"
            className="w-full bg-[#ececec] text-[#222222] placeholder:text-[#666666] text-[16px] sm:text-[17px] font-sans px-5 py-3.5 pr-12 border-0 rounded-none focus:outline-none focus:ring-0 shadow-none appearance-none"
          />
          <button
            type="submit"
            aria-label="Search"
            className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-[#333333] hover:text-black transition-colors"
          >
            <Search className="h-4 w-4 stroke-[2]" />
          </button>
        </form>

        {/* Live Search Quick Results Preview */}
        {hasPreviewResults && (
          <div className="mt-3 bg-[#f8f8f8] border border-[#e5e5e5] p-3 text-sm divide-y divide-[#eeeeee] animate-in fade-in-50 duration-150">
            {/* Matching Categories */}
            {preview.categories.length > 0 && (
              <div className="pb-2.5">
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#777777] mb-1.5 flex items-center gap-1">
                  <Folder className="h-3 w-3" />
                  <span>Categories</span>
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {preview.categories.map((c) => (
                    <button
                      key={c.slug}
                      type="button"
                      onClick={() => {
                        navigate({ to: "/$slug", params: { slug: c.slug } });
                        onClose();
                      }}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold bg-white border border-[#dddddd] text-[#222222] hover:bg-black hover:text-white transition-colors"
                    >
                      <Hash className="h-3 w-3 opacity-60" />
                      <span>{c.name}</span>
                      {c.count > 0 && (
                        <span className="text-[10px] opacity-70">({c.count})</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Matching Pages & Desks (License Filtered) */}
            {preview.pages.length > 0 && (
              <div className="py-2.5">
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#777777] mb-1.5 flex items-center gap-1">
                  <FileText className="h-3 w-3" />
                  <span>Pages & Desks</span>
                </p>
                <div className="space-y-1">
                  {preview.pages.map((p) => (
                    <button
                      key={p.url}
                      type="button"
                      onClick={() => {
                        navigate({ to: p.url as any });
                        onClose();
                      }}
                      className="w-full flex items-center justify-between px-2 py-1.5 text-xs text-left text-[#222222] hover:bg-white transition-colors"
                    >
                      <span className="font-semibold truncate">{p.title}</span>
                      <span className="text-[10px] uppercase font-bold text-[#666666] bg-[#eeeeee] px-1.5 py-0.5 ml-2 shrink-0">
                        {p.badge}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Matching Articles */}
            {preview.articles.length > 0 && (
              <div className="pt-2.5">
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#777777] mb-1.5 flex items-center gap-1">
                  <Newspaper className="h-3 w-3" />
                  <span>Stories</span>
                </p>
                <div className="space-y-1">
                  {preview.articles.map((a) => (
                    <button
                      key={a.id}
                      type="button"
                      onClick={() => {
                        navigate({ to: "/news/$slug", params: { slug: a.slug } });
                        onClose();
                      }}
                      className="w-full flex items-center justify-between px-2 py-1.5 text-xs text-left text-[#222222] hover:bg-white transition-colors group"
                    >
                      <span className="font-serif font-medium line-clamp-1 group-hover:underline">
                        {a.title}
                      </span>
                      <span className="text-[10px] text-[#888888] ml-2 shrink-0">
                        {a.category}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* View all in /search button */}
            <div className="pt-2 text-right">
              <button
                type="button"
                onClick={() => go(q)}
                className="text-[11px] font-bold uppercase tracking-wider text-black hover:underline inline-flex items-center gap-1"
              >
                <span>View all search results</span>
                <ArrowRight className="h-3 w-3" />
              </button>
            </div>
          </div>
        )}

        {/* Suggestions Line when not typing */}
        {!hasPreviewResults && (
          <div className="mt-4">
            <p className="text-[10px] font-serif italic text-[#888888] mb-1.5">Suggestions</p>
            <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[13px] font-semibold text-[#111111]">
              {suggestions.map((s, i) => (
                <span key={s} className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => go(s)}
                    className="transition-colors hover:underline hover:text-black"
                  >
                    {s}
                  </button>
                  {i < suggestions.length - 1 && (
                    <span className="text-[#999999] font-normal text-[11px]">·</span>
                  )}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
}

/** Modular SearchBox Button Component */
export function SearchBox({ className }: { className?: string }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open search"
        className={
          className || "shrink-0 rounded-full p-2 text-foreground transition-colors hover:bg-muted"
        }
      >
        <Search className="h-5 w-5" />
      </button>
      {open && <SearchModal open={open} onClose={() => setOpen(false)} />}
    </>
  );
}
