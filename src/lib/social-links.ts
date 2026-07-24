const SOCIAL_LINKS_KEY = "nt:admin:social-links:v1";

export type SocialLinks = {
  facebook: string;
  youtube: string;
  instagram: string;
  whatsapp: string;
};

export const DEFAULT_SOCIAL_LINKS: SocialLinks = {
  facebook: "",
  youtube: "",
  instagram: "",
  whatsapp: "",
};

export function loadSocialLinks(): SocialLinks {
  if (typeof window === "undefined") return DEFAULT_SOCIAL_LINKS;
  try {
    const raw = localStorage.getItem(SOCIAL_LINKS_KEY);
    if (raw) return { ...DEFAULT_SOCIAL_LINKS, ...JSON.parse(raw) };
  } catch {}
  return DEFAULT_SOCIAL_LINKS;
}

export function saveSocialLinks(links: SocialLinks) {
  localStorage.setItem(SOCIAL_LINKS_KEY, JSON.stringify(links));
}

export type SocialPlatform = {
  key: keyof SocialLinks;
  label: string;
  placeholder: string;
  color: string;
  helperText: string;
};

export const SOCIAL_PLATFORMS: SocialPlatform[] = [
  { key: "facebook", label: "Facebook Page URL", placeholder: "https://facebook.com/yournewspage", color: "#1877F2", helperText: "Users must visit this URL before claiming Follow points" },
  { key: "youtube", label: "YouTube Channel URL", placeholder: "https://youtube.com/@yourchannel", color: "#FF0000", helperText: "Users must visit & subscribe before claiming points" },
  { key: "instagram", label: "Instagram Profile URL", placeholder: "https://instagram.com/yourprofile", color: "#E4405F", helperText: "Users must visit this URL before claiming Follow points" },
  { key: "whatsapp", label: "WhatsApp Channel URL", placeholder: "https://whatsapp.com/channel/yourchannelid", color: "#25D366", helperText: "Users must visit & join before claiming points" },
];
