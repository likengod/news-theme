import { useState, useRef, useEffect } from 'react';
import { Play, ChevronLeft, ChevronRight, X, Share2, Copy, Check, Send, Eye } from 'lucide-react';
import { FaWhatsapp, FaFacebookF, FaTwitter } from 'react-icons/fa6';
import { viewsFor, formatViews } from '@/lib/news-data';
import type { WatchItem } from '@/lib/reels-data';

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

  const currentItem = items[currentIndex] || items[0];
  if (!currentItem) return null;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        setCurrentIndex((i) => (i + 1) % items.length);
        setShowShareMenu(false);
      }
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        setCurrentIndex((i) => (i - 1 + items.length) % items.length);
        setShowShareMenu(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
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

    if (Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > 60) {
      onClose();
      return;
    }

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
    const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleNativeShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: currentItem.title,
          text: 'Watch ' + currentItem.title + ' on Vanguard News',
          url: shareUrl,
        });
        return;
      } catch {
      }
    }
    setShowShareMenu((v) => !v);
  };

  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareText = encodeURIComponent('Watch ' + currentItem.title + ': ' + currentUrl);
  const viewCount = currentItem.views || viewsFor(currentItem.title);

  return (
    <div
      className='fixed inset-0 z-[100] flex flex-col justify-between bg-black/95 backdrop-blur-md p-4 animate-in fade-in duration-200'
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className='z-30 flex items-center justify-between text-white max-w-lg mx-auto w-full pt-2'>
        <div className='flex items-center gap-2'>
          <span className='rounded-full bg-red-600 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider'>
            Reel {currentIndex + 1} / {items.length}
          </span>
          <span className='text-xs text-white/70 hidden sm:inline'>
            Swipe left/right for next • Swipe up to close
          </span>
        </div>
        <button
          type='button'
          onClick={onClose}
          aria-label='Close Reel'
          className='flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur transition hover:bg-white/40'
        >
          <X className='h-5 w-5' />
        </button>
      </div>

      <div className='relative my-auto flex h-[76vh] w-full max-w-md mx-auto items-center justify-center'>
        <div className='relative aspect-[9/16] h-full w-full max-w-sm overflow-hidden rounded-2xl border border-white/10 bg-black shadow-2xl'>
          <iframe
            key={currentItem.title + currentIndex}
            src={currentItem.embedSrc}
            title={currentItem.title}
            className='h-full w-full object-cover'
            allow='autoplay; encrypted-media; picture-in-picture'
            allowFullScreen
            frameBorder={0}
          />
          <button
            type='button'
            onClick={(e) => {
              e.stopPropagation();
              setShowShareMenu(false);
              setCurrentIndex((i) => (i - 1 + items.length) % items.length);
            }}
            className='absolute left-2 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur border border-white/20 transition hover:bg-black/80'
            aria-label='Previous Reel'
          >
            <ChevronLeft className='h-6 w-6' />
          </button>
          <button
            type='button'
            onClick={(e) => {
              e.stopPropagation();
              setShowShareMenu(false);
              setCurrentIndex((i) => (i + 1) % items.length);
            }}
            className='absolute right-2 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur border border-white/20 transition hover:bg-black/80'
            aria-label='Next Reel'
          >
            <ChevronRight className='h-6 w-6' />
          </button>
        </div>

        <div className='absolute right-1 bottom-6 flex flex-col items-center gap-4 z-30'>
          <div className='flex flex-col items-center gap-1 text-white' title='Views'>
            <div className='flex h-11 w-11 items-center justify-center rounded-full bg-black/70 text-white backdrop-blur border border-white/20 shadow-xl'>
              <Eye className='h-5 w-5 text-white/90' />
            </div>
            <span className='text-[10px] font-bold tracking-wide text-white/90'>
              {formatViews(viewCount)}
            </span>
          </div>
          <button
            type='button'
            onClick={handleNativeShare}
            className='flex flex-col items-center gap-1 text-white hover:scale-110 transition-transform'
            title='Share Reel'
          >
            <div className='flex h-11 w-11 items-center justify-center rounded-full bg-black/70 text-white backdrop-blur border border-white/20 shadow-xl'>
              <Share2 className='h-5 w-5 text-white/90' />
            </div>
            <span className='text-[10px] font-medium tracking-wide text-white/90'>Share</span>
          </button>
          {showShareMenu && (
            <div className='absolute bottom-0 right-14 flex flex-col gap-2 rounded-xl border border-white/10 bg-black/90 p-2 shadow-2xl backdrop-blur animate-in fade-in zoom-in-95 duration-150'>
              <a
                href={'https://api.whatsapp.com/send?text=' + shareText}
                target='_blank'
                rel='noopener noreferrer'
                className='flex h-9 w-9 items-center justify-center rounded-full bg-[#25D366] text-white hover:scale-110 transition-transform'
                title='Share on WhatsApp'
              >
                <FaWhatsapp className='h-5 w-5' />
              </a>
              <a
                href={'https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(currentUrl)}
                target='_blank'
                rel='noopener noreferrer'
                className='flex h-9 w-9 items-center justify-center rounded-full bg-[#1877F2] text-white hover:scale-110 transition-transform'
                title='Share on Facebook'
              >
                <FaFacebookF className='h-4 w-4' />
              </a>
              <a
                href={'https://twitter.com/intent/tweet?text=' + shareText}
                target='_blank'
                rel='noopener noreferrer'
                className='flex h-9 w-9 items-center justify-center rounded-full bg-black text-white hover:scale-110 transition-transform border border-white/20'
                title='Share on X'
              >
                <FaTwitter className='h-4 w-4' />
              </a>
              <button
                type='button'
                onClick={handleCopyLink}
                className='flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-white hover:scale-110 transition-transform'
                title='Copy Link'
              >
                {copied ? <Check className='h-4 w-4 text-green-400' /> : <Copy className='h-4 w-4' />}
              </button>
            </div>
          )}
        </div>
      </div>

      <div className='z-30 text-white max-w-md mx-auto w-full pb-2'>
        <div className='flex items-center gap-2 mb-1.5'>
          {currentItem.kicker && (
            <span className='rounded bg-blue-600 px-2 py-0.5 text-[10px] font-bold uppercase'>
              {currentItem.kicker}
            </span>
          )}
          <span className='text-xs text-white/70'>Duration: {currentItem.duration}</span>
        </div>
        <h3 className='font-bold text-sm sm:text-base leading-snug drop-shadow line-clamp-2'>
          {currentItem.title}
        </h3>
      </div>
    </div>
  );
}
