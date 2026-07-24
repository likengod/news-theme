import { useEffect, useState } from "react";
import { Lock, Copy, Check, X, ShieldAlert } from "lucide-react";
import { useSiteSettings } from "@/components/site/AdSettingsContext";
import { toast } from "sonner";

export function ContentProtectionGuard() {
  const settings = useSiteSettings();
  const [isBlurred, setIsBlurred] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    if (!settings.protectionEnabled) return;

    // Trigger Centered Security Modal
    const triggerSecurityNotice = () => {
      setShowModal(true);
    };

    // 1. Prevent Copy & Cut
    const handleCopy = (e: ClipboardEvent) => {
      e.preventDefault();
      triggerSecurityNotice();
    };

    // 2. Prevent Right Click on Article Content
    const handleContextMenu = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName !== "INPUT" && target.tagName !== "TEXTAREA") {
        e.preventDefault();
        triggerSecurityNotice();
      }
    };

    // 3. Prevent Keyboard Shortcuts: Ctrl+C, Ctrl+P, Ctrl+U, Ctrl+S, PrintScreen
    const handleKeyDown = (e: KeyboardEvent) => {
      const isCmdOrCtrl = e.ctrlKey || e.metaKey;

      if (
        (isCmdOrCtrl && (e.key === "c" || e.key === "C")) || // Copy
        (isCmdOrCtrl && (e.key === "p" || e.key === "P")) || // Print
        (isCmdOrCtrl && (e.key === "s" || e.key === "S")) || // Save
        (isCmdOrCtrl && (e.key === "u" || e.key === "U")) || // View Source
        e.key === "PrintScreen"                              // PrintScreen Key
      ) {
        e.preventDefault();
        triggerSecurityNotice();
      }
    };

    // 4. Intercept 3-finger screenshot gestures on mobile
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length >= 3) {
        setIsBlurred(true);
        triggerSecurityNotice();
        setTimeout(() => setIsBlurred(false), 2000);
      }
    };

    // 5. Mobile Screenshot / Tab Switch Blur Guard
    const handleBlur = () => {
      setIsBlurred(true);
    };

    const handleFocus = () => {
      setIsBlurred(false);
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        setIsBlurred(true);
      } else {
        setIsBlurred(false);
      }
    };

    document.addEventListener("copy", handleCopy);
    document.addEventListener("cut", handleCopy);
    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("blur", handleBlur);
    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("copy", handleCopy);
      document.removeEventListener("cut", handleCopy);
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("blur", handleBlur);
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [settings.protectionEnabled]);

  const handleCopyShareLink = () => {
    try {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      toast.success("Article link copied! Thank you for sharing the original URL.");
      setTimeout(() => setCopiedLink(false), 2500);
    } catch {
      toast.error("Could not copy link automatically.");
    }
  };

  if (!settings.protectionEnabled) {
    return null;
  }

  const modalTitle = settings.protectionModalTitle || `Content Protection - ${settings.siteName || "News Theme"}`;
  const modalMessage = settings.protectionModalMessage || 
    "Our journalists work hard to bring you authentic news. When you share our website links directly, the ad revenue helps us pay our team and keep our servers online.\n\nWe humbly request you not to copy paste or take screenshots of our content. Your small effort to share the original link makes a big difference to our survival. Thank you for standing with us!";

  return (
    <>
      {/* Centered Protection Warning Modal Overlay */}
      {showModal && (
        <div 
          className="fixed inset-0 z-[100] grid place-items-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={(e) => e.target === e.currentTarget && setShowModal(false)}
        >
          <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900 sm:p-7">
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400">
                  <Lock className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white sm:text-lg">
                    {modalTitle}
                  </h3>
                  <p className="text-xs font-semibold text-amber-600 dark:text-amber-400">
                    Content Protected • Direct Sharing Encouraged
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowModal(false)}
                className="grid h-8 w-8 place-items-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                aria-label="Close modal"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Modal Message Body */}
            <div className="mt-5 space-y-3 rounded-xl border border-slate-100 bg-slate-50/80 p-4 text-xs leading-relaxed text-slate-700 dark:border-slate-800/80 dark:bg-slate-950/40 dark:text-slate-300 sm:text-sm">
              {modalMessage.split("\n\n").map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>

            {/* Modal Action Buttons */}
            <div className="mt-6 flex flex-col-reverse gap-2.5 sm:flex-row sm:items-center sm:justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 sm:w-auto sm:text-sm"
              >
                I Understand / Close
              </button>
              
              <button
                onClick={handleCopyShareLink}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white sm:w-auto sm:text-sm"
              >
                {copiedLink ? <Check className="h-4 w-4 text-emerald-400 dark:text-emerald-600" /> : <Copy className="h-4 w-4" />}
                {copiedLink ? "Link Copied!" : "Copy Link to Share"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Global Protection CSS */}
      <style>{`
        /* Cross-Browser Text Selection & Drag Locking */
        .article-body-content, article p, article h1, article h2, article h3, article img {
          -webkit-user-select: none !important;
          -moz-user-select: none !important;
          -ms-user-select: none !important;
          user-select: none !important;
          -webkit-touch-callout: none !important;
          -webkit-user-drag: none !important;
          -webkit-tap-highlight-color: transparent !important;
        }

        /* Disable image long-press download menu */
        article img {
          pointer-events: none !important;
        }
        
        /* Blur article content during screenshot or app switcher preview */
        ${isBlurred ? `
          article {
            filter: blur(18px) !important;
            opacity: 0.2 !important;
            transition: filter 0.05s ease-in-out, opacity 0.05s ease-in-out;
          }
        ` : ""}

        /* Hide article body when user attempts to print or export to PDF */
        @media print {
          body {
            display: none !important;
          }
        }
      `}</style>
    </>
  );
}
