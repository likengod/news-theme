import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "@tanstack/react-router";
import { Search, X } from "lucide-react";
import { getTopTags } from "@/lib/taxonomy.functions";

interface SearchModalProps {
  open: boolean;
  onClose: () => void;
}

export function SearchModal({ open, onClose }: SearchModalProps) {
  const [mounted, setMounted] = useState(false);
  const [q, setQ] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([
    "Infrastructure", "Trade", "Governance", "Healthcare", "Economy",
    "Finance", "Space", "Tech", "Sports", "Culture"
  ]);
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
    getTopTags().then((tags) => {
      if (tags && tags.length > 0) {
        setSuggestions(tags.slice(0, 10));
      }
    }).catch((err) => {
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

  const go = (term: string) => {
    if (!term.trim()) return;
    navigate({ to: "/search", search: { q: term.trim(), page: 1 } });
    onClose();
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    go(q);
  };

  if (!open || !mounted) return null;

  return createPortal(
    <div 
      className="fixed inset-0 z-[999999] h-screen w-screen flex flex-col items-center justify-center bg-white text-black px-4 transition-all duration-200 animate-in fade-in"
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

      {/* Centered Search Input Box & Suggestions Container */}
      <div className="w-full max-w-[560px] text-left -mt-8 sm:-mt-12">
        <form onSubmit={submit} className="relative w-full">
          <input
            ref={inputRef}
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Type & hit enter"
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

        {/* Suggestions Line */}
        <div className="mt-4">
          <p className="text-[10px] font-serif italic text-[#888888] mb-1.5">
            Suggestions
          </p>
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
      </div>
    </div>,
    document.body
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
        className={className || "shrink-0 rounded-full p-2 text-foreground transition-colors hover:bg-muted"}
      >
        <Search className="h-5 w-5" />
      </button>
      <SearchModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
