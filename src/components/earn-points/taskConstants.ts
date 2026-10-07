import React from "react";
import { UserPlus, MessageCircle, Share2, BookOpen } from "lucide-react";
import { FaFacebookF, FaInstagram, FaYoutube, FaWhatsapp } from "react-icons/fa6";
import { type SocialTaskDef } from "./ProofModal";

export const SOCIAL_TASK_META: Record<string, Omit<SocialTaskDef, "id" | "title" | "points">> = {
  fb: {
    platform: "Facebook",
    icon: FaFacebookF,
    iconColor: "#1877F2",
    actionLabel: "Follow",
    hrefKey: "facebook",
    handleLabel: "Your Facebook profile URL or username",
    handlePlaceholder: "https://facebook.com/yourname or @yourname",
  },
  yt: {
    platform: "YouTube",
    icon: FaYoutube,
    iconColor: "#FF0000",
    actionLabel: "Subscribe",
    hrefKey: "youtube",
    handleLabel: "Your YouTube channel URL or username",
    handlePlaceholder: "https://youtube.com/@yourhandle",
  },
  ig: {
    platform: "Instagram",
    icon: FaInstagram,
    iconColor: "#E4405F",
    actionLabel: "Follow",
    hrefKey: "instagram",
    handleLabel: "Your Instagram username",
    handlePlaceholder: "@yourinstagram",
  },
  wa: {
    platform: "WhatsApp",
    icon: FaWhatsapp,
    iconColor: "#25D366",
    actionLabel: "Join",
    hrefKey: "whatsapp",
    handleLabel: "Your WhatsApp number (for verification)",
    handlePlaceholder: "+91 98765 43210",
  },
};

export const OTHER_TASK_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  signup: UserPlus,
  first_comments: MessageCircle,
  first_shares: Share2,
  first_reads: BookOpen,
};

export const DAILY_TASK_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  r_share: Share2,
  p_share: Share2,
  share_daily: Share2,
  r_comment: MessageCircle,
  p_comment: MessageCircle,
  comment_daily: MessageCircle,
};
