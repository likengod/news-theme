import { FaWhatsapp } from "react-icons/fa6";
import { FaTelegramPlane } from "react-icons/fa";
import { ExternalLink } from "lucide-react";
import { useSiteSettings } from "@/components/site/AdSettingsContext";

export function ArticleSocialChannels() {
  const settings = useSiteSettings();
  const items = settings?.articleRightSidebarItems || {};
  const siteName = settings?.siteName || "Today Tripura";

  const showWhatsapp = items.whatsappChannel !== false;
  const showTelegram = items.telegramChannel !== false;

  if (!showWhatsapp && !showTelegram) {
    return null;
  }

  // Resolve custom or default button labels
  const whatsappLabel =
    items.whatsappButtonText?.trim() || `Join our WhatsApp Channel [${siteName}]`;
  const telegramLabel =
    items.telegramButtonText?.trim() || `Join our Telegram Channel [${siteName}]`;

  // Resolve custom URLs, falling back to general social links or placeholder
  const whatsappUrl =
    items.whatsappChannelUrl?.trim() ||
    settings?.whatsapp?.trim() ||
    "https://whatsapp.com";

  const telegramUrl =
    items.telegramChannelUrl?.trim() ||
    settings?.telegram?.trim() ||
    "https://t.me";

  return (
    <div className="space-y-2.5 pt-2">
      {/* WhatsApp Channel Button */}
      {showWhatsapp && (
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative flex items-center justify-between gap-3 overflow-hidden rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 px-4 py-3 text-white shadow-xs transition-all duration-200 hover:from-emerald-500 hover:to-green-500 hover:shadow-md active:scale-[0.98]"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/20 backdrop-blur-xs text-white shadow-inner">
              <FaWhatsapp className="h-5 w-5 fill-current" />
            </div>
            <div className="min-w-0 text-left">
              <span className="block text-[10px] font-medium uppercase tracking-wider text-emerald-100">
                Official Updates
              </span>
              <span className="block text-xs sm:text-sm font-bold leading-tight truncate">
                {whatsappLabel}
              </span>
            </div>
          </div>
          <ExternalLink className="h-4 w-4 shrink-0 text-emerald-200 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </a>
      )}

      {/* Telegram Channel Button */}
      {showTelegram && (
        <a
          href={telegramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative flex items-center justify-between gap-3 overflow-hidden rounded-xl bg-gradient-to-r from-sky-600 to-blue-600 px-4 py-3 text-white shadow-xs transition-all duration-200 hover:from-sky-500 hover:to-blue-500 hover:shadow-md active:scale-[0.98]"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/20 backdrop-blur-xs text-white shadow-inner">
              <FaTelegramPlane className="h-5 w-5 fill-current ml-0.5" />
            </div>
            <div className="min-w-0 text-left">
              <span className="block text-[10px] font-medium uppercase tracking-wider text-sky-100">
                Instant Alerts
              </span>
              <span className="block text-xs sm:text-sm font-bold leading-tight truncate">
                {telegramLabel}
              </span>
            </div>
          </div>
          <ExternalLink className="h-4 w-4 shrink-0 text-sky-200 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </a>
      )}
    </div>
  );
}

export default ArticleSocialChannels;
