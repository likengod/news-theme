import { FaFacebookF, FaInstagram, FaTwitter, FaPinterestP, FaTiktok, FaWhatsapp, FaYoutube, FaLinkedinIn } from "react-icons/fa6";
import { FaTelegramPlane } from "react-icons/fa";
import { useSiteSettings } from "@/components/site/AdSettingsContext";

export type SocialKey =
  | "facebook"
  | "instagram"
  | "twitter"
  | "pinterest"
  | "tiktok"
  | "whatsapp"
  | "youtube"
  | "linkedin"
  | "telegram";

type Item = {
  key: SocialKey;
  label: string;
  href: string;
  Icon: any;
};

const DEFAULT_LINKS: Record<SocialKey, string> = {
  facebook: "#",
  instagram: "#",
  twitter: "#",
  pinterest: "#",
  tiktok: "#",
  whatsapp: "#",
  youtube: "#",
  linkedin: "#",
  telegram: "#",
};

function buildItems(links: Partial<Record<SocialKey, string>>, only?: SocialKey[]): Item[] {
  const all: Item[] = [
    { key: "facebook", label: "Facebook", href: links.facebook || DEFAULT_LINKS.facebook, Icon: FaFacebookF },
    { key: "instagram", label: "Instagram", href: links.instagram || DEFAULT_LINKS.instagram, Icon: FaInstagram },
    { key: "twitter", label: "Twitter", href: links.twitter || DEFAULT_LINKS.twitter, Icon: FaTwitter },
    { key: "pinterest", label: "Pinterest", href: links.pinterest || DEFAULT_LINKS.pinterest, Icon: FaPinterestP },
    { key: "tiktok", label: "TikTok", href: links.tiktok || DEFAULT_LINKS.tiktok, Icon: FaTiktok },
    { key: "whatsapp", label: "WhatsApp", href: links.whatsapp || DEFAULT_LINKS.whatsapp, Icon: FaWhatsapp },
    { key: "youtube", label: "YouTube", href: links.youtube || DEFAULT_LINKS.youtube, Icon: FaYoutube },
    { key: "linkedin", label: "LinkedIn", href: links.linkedin || DEFAULT_LINKS.linkedin, Icon: FaLinkedinIn },
    { key: "telegram", label: "Telegram", href: links.telegram || DEFAULT_LINKS.telegram, Icon: FaTelegramPlane },
  ];
  return only ? all.filter((i) => only.includes(i.key)) : all;
}

type Props = {
  links?: Partial<Record<SocialKey, string>>;
  only?: SocialKey[];
  orientation?: "horizontal" | "vertical";
  size?: "sm" | "md" | "lg";
  className?: string;
};

const SIZE_MAP = {
  sm: { icon: "h-4 w-4", box: "h-7 w-7" },
  md: { icon: "h-5 w-5", box: "h-8 w-8" },
  lg: { icon: "h-6 w-6", box: "h-10 w-10" },
};

const BRAND_COLORS: Record<SocialKey, string> = {
  facebook: "#1877F2",
  instagram: "#E4405F",
  twitter: "#1DA1F2",
  pinterest: "#E60023",
  tiktok: "#000000",
  whatsapp: "#25D366",
  youtube: "#FF0000",
  linkedin: "#0A66C2",
  telegram: "#26A5E4",
};

export function SocialIcons({ links = {}, only, orientation = "horizontal", size = "md", className = "" }: Props) {
  const s = useSiteSettings();
  
  // Merge prop links with global site settings, falling back to DEFAULT_LINKS if both are empty or "#"
  const mergedLinks: Partial<Record<SocialKey, string>> = {
    facebook: links.facebook && links.facebook !== "#" ? links.facebook : (s.facebook !== "#" ? s.facebook : undefined),
    instagram: links.instagram && links.instagram !== "#" ? links.instagram : (s.instagram !== "#" ? s.instagram : undefined),
    twitter: links.twitter && links.twitter !== "#" ? links.twitter : (s.twitter !== "#" ? s.twitter : undefined),
    pinterest: links.pinterest && links.pinterest !== "#" ? links.pinterest : (s.pinterest !== "#" ? s.pinterest : undefined),
    tiktok: links.tiktok && links.tiktok !== "#" ? links.tiktok : (s.tiktok !== "#" ? s.tiktok : undefined),
    whatsapp: links.whatsapp && links.whatsapp !== "#" ? links.whatsapp : (s.whatsapp !== "#" ? s.whatsapp : undefined),
    youtube: links.youtube && links.youtube !== "#" ? links.youtube : (s.youtube !== "#" ? s.youtube : undefined),
    linkedin: links.linkedin && links.linkedin !== "#" ? links.linkedin : (s.linkedin !== "#" ? s.linkedin : undefined),
    telegram: links.telegram && links.telegram !== "#" ? links.telegram : (s.telegram !== "#" ? s.telegram : undefined),
  };

  const items = buildItems(mergedLinks, only).filter(item => item.href !== "#" && item.href !== "");
  
  const sClass = SIZE_MAP[size];
  
  if (items.length === 0) return null;

  return (
    <div
      className={`${orientation === "vertical" ? "flex flex-col gap-3" : "flex flex-wrap items-center gap-1.5"} ${className}`}
    >
      {items.map(({ key, label, href, Icon }) => (
        <a
          key={key}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          className={`inline-flex ${sClass.box} items-center justify-center transition-transform hover:scale-110`}
          style={{ color: BRAND_COLORS[key] }}
        >
          <Icon className={sClass.icon} />
        </a>
      ))}
    </div>
  );
}
