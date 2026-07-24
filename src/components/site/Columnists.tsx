import { useState, useRef, useEffect } from "react";
import { Play, ChevronLeft, ChevronRight, X, Share2, Copy, Check, Send, Eye } from "lucide-react";
import { grid, top, lead, viewsFor, formatViews } from "@/lib/news-data";
import { Views } from "./Views";
import { useHomepageConfig } from "@/hooks/use-homepage-config";

type WatchItem = {
  title: string;
  duration: string;
  img: string;
  kicker: string | null;
  embedSrc: string;
};

const watchItems: WatchItem[] = [
  {
    title: "Where to Invest 10 Lakh Rupees Amid a Fragile Recovery",
    duration: "1:08",
    img: grid[0].img,
    kicker: null,
    embedSrc: "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0&modestbranding=1&playsinline=1",
  },
  {
    title: "Iran's Leaders Are in No Hurry to Get a Peace Deal",
    duration: "1:16",
    img: top[0].img,
    kicker: null,
    embedSrc: "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0&modestbranding=1&playsinline=1",
  },
  {
    title: "A Heartless Supreme Court Decision",
    duration: "2:12",
    img: grid[1].img,
    kicker: "Opinion",
    embedSrc: "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0&modestbranding=1&playsinline=1",
  },
  {
    title: "Apple's Sweeping Price Hikes Hit iPads and Macs",
    duration: "1:21",
    img: grid[2].img,
    kicker: null,
    embedSrc: "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0&modestbranding=1&playsinline=1",
  },
  {
    title: "How the 1994 World Cup Changed the Business of Football Forever",
    duration: "1:39",
    img: lead.img,
    kicker: null,
    embedSrc: "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0&modestbranding=1&playsinline=1",
  },
  {
    title: "Tesla's New Factory Sparks Environmental Concerns",
    duration: "2:45",
    img: top[1].img,
    kicker: "Tech",
    embedSrc: "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0&modestbranding=1&playsinline=1",
  },
  {
    title: "The Rise of AI in Modern Healthcare",
    duration: "1:55",
    img: grid[0].img,
    kicker: "Health",
    embedSrc: "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0&modestbranding=1&playsinline=1",
  },
  {
    title: "Global Supply Chain Disruptions Continue to Plague Retailers",
    duration: "3:10",
    img: grid[1].img,
    kicker: "Business",
    embedSrc: "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0&modestbranding=1&playsinline=1",
  },
];

function ReelViewerModal({
  initialIndex,
  items,
  onClose,
}: {
  initialIndex: number;
  items: WatchItem[];
  onClose: () => void;
}) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [copied, setCopied] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  const currentItem = items[currentIndex];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        setCurrentIndex((i) => (i + 1) % items.length);
        setShowShareMenu(false);
      }
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        setCurrentIndex((i) => (i - 1 + items.length) % items.length);
        setShowShareMenu(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [items.length, onClose]);

  const handleTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0];
    touchStartRef.current = { x: t.clientX, y: t.clientY };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - touchStartRef.current.x;
    const dy = t.clientY - touchStartRef.current.y;
    touchStartRef.current = null;

    // Vertical swipe up or down -> close reel modal
    if (Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > 60) {
      onClose();
      return;
    }

    // Horizontal swipe left -> next reel, swipe right -> prev reel
    if (Math.abs(dx) > 40) {
      setShowShareMenu(false);
      if (dx < 0) {
        setCurrentIndex((i) => (i + 1) % items.length);
      } else {
        setCurrentIndex((i) => (i - 1 + items.length) % items.length);
      }
    }
  };

  const handleCopyLink = (e: React.MouseEvent) => {
    e.stopPropagation();
    const shareUrl = window.location.href;
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleNativeShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const shareUrl = window.location.href;
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: currentItem.title,
          text: `Watch "${currentItem.title}" on News Theme`,
          url: shareUrl,
        });
        return;
      } catch {
        // Fallback to share menu if user cancelled or native share failed
      }
    }
    setShowShareMenu((v) => !v);
  };

  const currentUrl = typeof window !== "undefined" ? window.location.href : "";
  const shareText = encodeURIComponent(`Watch "${currentItem.title}": ${currentUrl}`);

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col justify-between bg-black/95 backdrop-blur-md p-4 animate-in fade-in duration-200"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Modal Header */}
      <div className="z-30 flex items-center justify-between text-white max-w-lg mx-auto w-full pt-2">
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-red-600 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
            Reel {currentIndex + 1} / {items.length}
          </span>
          <span className="text-xs text-white/70 hidden sm:inline">
            Swipe left/right for next • Swipe up to close
          </span>
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="Close Reel"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur transition hover:bg-white/40"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Main Fullscreen Video Container with Right Action Rail */}
      <div className="relative my-auto flex h-[76vh] w-full max-w-md mx-auto items-center justify-center">
        <div className="relative aspect-[9/16] h-full w-full max-w-sm overflow-hidden rounded-2xl border border-white/10 bg-black shadow-2xl">
          <iframe
            key={currentItem.title}
            src={currentItem.embedSrc}
            title={currentItem.title}
            className="h-full w-full object-cover"
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
            frameBorder={0}
          />

          {/* Next / Prev overlay buttons */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setShowShareMenu(false);
              setCurrentIndex((i) => (i - 1 + items.length) % items.length);
            }}
            className="absolute left-2 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur border border-white/20 transition hover:bg-black/80"
            aria-label="Previous Reel"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setShowShareMenu(false);
              setCurrentIndex((i) => (i + 1) % items.length);
            }}
            className="absolute right-2 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur border border-white/20 transition hover:bg-black/80"
            aria-label="Next Reel"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>

        {/* Right Side Action Bar (Views, Share, Copy Link) */}
        <div className="absolute right-1 bottom-6 flex flex-col items-center gap-4 z-30">
          {/* Views Indicator */}
          <div className="flex flex-col items-center gap-1 text-white" title="Views">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-black/70 text-white backdrop-blur border border-white/20 shadow-xl">
              <Eye className="h-5 w-5 text-white/90" />
            </div>
            <span className="text-[10px] font-bold tracking-wide text-white/90">
              {formatViews(viewsFor(currentItem.title))}
            </span>
          </div>

          {/* Share Button */}
          <button
            type="button"
            onClick={handleNativeShare}
            className="flex flex-col items-center gap-1 text-white hover:scale-110 transition-transform"
            title="Share Reel"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-black/70 text-white backdrop-blur border border-white/20 shadow-xl hover:bg-white/20">
              <Share2 className="h-5 w-5" />
            </div>
            <span className="text-[10px] font-bold tracking-wide text-white/90">Share</span>
          </button>

          {/* Copy Link Button */}
          <button
            type="button"
            onClick={handleCopyLink}
            className="flex flex-col items-center gap-1 text-white hover:scale-110 transition-transform"
            title="Copy Reel Link"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-black/70 text-white backdrop-blur border border-white/20 shadow-xl hover:bg-white/20">
              {copied ? <Check className="h-5 w-5 text-green-400" /> : <Copy className="h-5 w-5" />}
            </div>
            <span className="text-[10px] font-bold tracking-wide text-white/90">
              {copied ? "Copied" : "Copy"}
            </span>
          </button>
        </div>
      </div>

      {/* Share Options Popup Sheet */}
      {showShareMenu && (
        <div
          className="absolute inset-x-4 bottom-16 z-50 max-w-sm mx-auto rounded-2xl bg-zinc-900/95 p-4 text-white border border-white/20 shadow-2xl backdrop-blur-lg animate-in slide-in-from-bottom duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <h4 className="text-sm font-bold">Share to</h4>
            <button
              type="button"
              onClick={() => setShowShareMenu(false)}
              className="text-white/60 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="grid grid-cols-4 gap-3 py-4 text-center">
            {/* WhatsApp */}
            <a
              href={`https://api.whatsapp.com/send?text=${shareText}`}
              target="_blank"
              rel="noreferrer"
              className="flex flex-col items-center gap-1 hover:opacity-80 transition"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366] text-white shadow-md">
                <Send className="h-5 w-5" />
              </div>
              <span className="text-[11px] text-white/80 font-medium">WhatsApp</span>
            </a>

            {/* Facebook */}
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`}
              target="_blank"
              rel="noreferrer"
              className="flex flex-col items-center gap-1 hover:opacity-80 transition"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#1877F2] text-white shadow-md">
                <span className="font-bold text-lg">f</span>
              </div>
              <span className="text-[11px] text-white/80 font-medium">Facebook</span>
            </a>

            {/* Twitter / X */}
            <a
              href={`https://twitter.com/intent/tweet?text=${shareText}`}
              target="_blank"
              rel="noreferrer"
              className="flex flex-col items-center gap-1 hover:opacity-80 transition"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-black border border-white/20 text-white shadow-md">
                <span className="font-bold text-sm">X</span>
              </div>
              <span className="text-[11px] text-white/80 font-medium">Twitter</span>
            </a>

            {/* Copy Link */}
            <button
              type="button"
              onClick={handleCopyLink}
              className="flex flex-col items-center gap-1 hover:opacity-80 transition"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-800 border border-white/20 text-white shadow-md">
                {copied ? <Check className="h-5 w-5 text-green-400" /> : <Copy className="h-5 w-5" />}
              </div>
              <span className="text-[11px] text-white/80 font-medium">{copied ? "Copied" : "Copy"}</span>
            </button>
          </div>
        </div>
      )}

      {/* Modal Bottom Caption */}
      <div className="z-30 max-w-sm mx-auto w-full pb-3 text-center">
        <p className="text-sm font-bold text-white leading-tight line-clamp-1">
          {currentItem.title}
        </p>
        <p className="text-[11px] text-white/75 mt-1 flex items-center justify-center gap-1.5 font-medium">
          <Eye className="h-3.5 w-3.5 text-white/90" />
          <span>{formatViews(viewsFor(currentItem.title))} views</span>
          <span>•</span>
          <span>Swipe left/right for next</span>
        </p>
      </div>
    </div>
  );
}

export function Columnists() {
  const cfg = useHomepageConfig();
  const [activeReelIndex, setActiveReelIndex] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.clientWidth * 0.75;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="border-t border-border pt-3 pb-1 md:py-10">
      {/* Header bar hidden on mobile (< md), visible on desktop (>= md) */}
      <div className="hidden md:flex items-center justify-between">
        <h3
          className="font-bold"
          style={{ color: cfg.watch.color, fontSize: `${cfg.watch.fontSize}px` }}
        >
          {cfg.watch.title}
        </h3>
        <a
          href="/news/sample"
          className="rounded-full border border-border px-4 py-1.5 text-xs font-semibold text-foreground transition hover:bg-foreground hover:text-background"
        >
          Explore More
        </a>
      </div>

      <div 
        ref={scrollRef}
        className="mt-0 md:mt-6 flex overflow-x-auto gap-2 pb-3 snap-x snap-mandatory scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden md:gap-4 md:pb-3"
      >
        {watchItems.map((v, index) => (
          <div
            key={v.title}
            onClick={() => setActiveReelIndex(index)}
            className="group block shrink-0 snap-start cursor-pointer w-[23%] sm:w-[45%] md:w-[31%] lg:w-[calc(20%-0.8rem)]"
          >
            <div className="relative aspect-[9/16] overflow-hidden rounded-xl bg-black border border-border/40 shadow-sm transition duration-500 hover:scale-[1.02]">
              <img
                src={v.img}
                alt={v.title}
                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

              {v.kicker && (
                <span className="absolute left-2.5 top-2.5 bg-[#1d4ed8] px-2 py-0.5 text-[10px] font-bold text-white rounded">
                  {v.kicker}
                </span>
              )}

              <h4 className="absolute bottom-11 left-2.5 right-2.5 text-xs font-bold leading-tight text-white drop-shadow line-clamp-2">
                {v.title}
              </h4>

              <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1.5">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/95 text-black shadow transition-transform group-hover:scale-110">
                  <Play className="h-3 w-3 fill-current ml-0.5" />
                </span>
                <span className="text-xs font-semibold text-white drop-shadow">{v.duration}</span>
              </div>
            </div>
            <Views count={viewsFor(v.title)} className="mt-1.5 text-[11px] text-muted-foreground" />
          </div>
        ))}
      </div>

      {/* Render Fullscreen Reel Viewer Modal */}
      {activeReelIndex !== null && (
        <ReelViewerModal
          initialIndex={activeReelIndex}
          items={watchItems}
          onClose={() => setActiveReelIndex(null)}
        />
      )}

      <div className="hidden md:flex mt-5 items-center justify-between">
        <div className="flex-1" />
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-foreground" />
          <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/40" />
        </div>
        <div className="flex flex-1 justify-end gap-2">
          <button
            type="button"
            onClick={() => scroll("left")}
            aria-label="Previous"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-foreground transition hover:bg-foreground hover:text-background"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => scroll("right")}
            aria-label="Next"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-foreground transition hover:bg-foreground hover:text-background"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
