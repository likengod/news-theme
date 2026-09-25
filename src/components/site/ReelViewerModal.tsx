import { useState, useRef, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  X,
  Share2,
  Copy,
  Check,
  Eye,
} from "lucide-react";
import { FaWhatsapp, FaFacebookF, FaTwitter } from "react-icons/fa6";
import { viewsFor, formatViews } from "@/lib/news-data";

export type WatchItem = {
  title: string;
  duration: string;
  img: string;
  kicker: string | null;
  embedSrc: string;
};

export function ReelViewerModal({
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
            <p className="text-sm font-bold">Share to</p>
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
              className="flex flex-col items-center gap-2 hover:opacity-80 transition hover:scale-110"
            >
              <div className="flex items-center justify-center text-[#25D366]">
                <FaWhatsapp className="h-8 w-8" />
              </div>
              <span className="text-[11px] text-white/80 font-medium">WhatsApp</span>
            </a>

            {/* Facebook */}
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`}
              target="_blank"
              rel="noreferrer"
              className="flex flex-col items-center gap-2 hover:opacity-80 transition hover:scale-110"
            >
              <div className="flex items-center justify-center text-[#1877F2]">
                <FaFacebookF className="h-8 w-8" />
              </div>
              <span className="text-[11px] text-white/80 font-medium">Facebook</span>
            </a>

            {/* Twitter / X */}
            <a
              href={`https://twitter.com/intent/tweet?text=${shareText}`}
              target="_blank"
              rel="noreferrer"
              className="flex flex-col items-center gap-2 hover:opacity-80 transition hover:scale-110"
            >
              <div className="flex items-center justify-center text-white">
                <FaTwitter className="h-8 w-8" />
              </div>
              <span className="text-[11px] text-white/80 font-medium">Twitter</span>
            </a>

            {/* Copy Link */}
            <button
              type="button"
              onClick={handleCopyLink}
              className="flex flex-col items-center gap-2 hover:opacity-80 transition hover:scale-110"
            >
              <div className="flex items-center justify-center text-white/80">
                {copied ? (
                  <Check className="h-8 w-8 text-green-400" />
                ) : (
                  <Copy className="h-8 w-8" />
                )}
              </div>
              <span className="text-[11px] text-white/80 font-medium">
                {copied ? "Copied" : "Copy"}
              </span>
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
export default ReelViewerModal;
