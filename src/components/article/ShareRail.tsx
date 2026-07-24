import { FaFacebookF, FaTwitter, FaLinkedinIn, FaWhatsapp } from "react-icons/fa6";
import { FaTelegramPlane } from "react-icons/fa";
import { Bookmark, Link2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { authClient as supabase } from "@/lib/auth-client";
import { trackShare } from "@/lib/user-actions-tracker";

type Props = {
  url: string;
  title: string;
  orientation?: "horizontal" | "vertical";
};

export function ShareRail({ url, title, orientation = "horizontal" }: Props) {
  const enc = encodeURIComponent(url);
  const encT = encodeURIComponent(title);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session?.user) {
        setUserId(data.session.user.id);
      }
    });
  }, []);

  const handleShareClick = useCallback(() => {
    if (userId) {
      trackShare(userId, url);
    }
  }, [userId, url]);

  const copy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied");
      handleShareClick();
    } catch {
      toast.error("Could not copy link");
    }
  }, [url, handleShareClick]);

  const items: { label: string; href: string; Icon: any; color: string }[] = [
    { label: "Facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${enc}`, Icon: FaFacebookF, color: "#1877F2" },
    { label: "Twitter", href: `https://twitter.com/intent/tweet?url=${enc}&text=${encT}`, Icon: FaTwitter, color: "#1DA1F2" },
    { label: "LinkedIn", href: `https://www.linkedin.com/sharing/share-offsite/?url=${enc}`, Icon: FaLinkedinIn, color: "#0A66C2" },
    { label: "WhatsApp", href: `https://api.whatsapp.com/send?text=${encT}%20${enc}`, Icon: FaWhatsapp, color: "#25D366" },
    { label: "Telegram", href: `https://t.me/share/url?url=${enc}&text=${encT}`, Icon: FaTelegramPlane, color: "#26A5E4" },
  ];

  return (
    <div className="flex items-center gap-1">
      <span className="mr-1 hidden text-[11px] font-bold uppercase tracking-wider text-muted-foreground sm:inline">
        Share:
      </span>
      {items.map(({ label, href, Icon, color }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleShareClick}
          aria-label={`Share on ${label}`}
          className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-muted/40 transition-all hover:scale-110 hover:bg-muted"
          style={{ color }}
        >
          <Icon className="h-3.5 w-3.5" />
        </a>
      ))}
      <button
        onClick={copy}
        aria-label="Copy link"
        className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-muted/40 text-muted-foreground transition-all hover:scale-110 hover:bg-muted hover:text-foreground"
      >
        <Link2 className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
