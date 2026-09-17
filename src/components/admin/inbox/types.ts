import React from "react";
import { Mail, Briefcase, Wallet, UserX, Sparkles, Newspaper } from "lucide-react";

export type InboxRequest = {
  id: number;
  type:
    | "contact"
    | "work_with_us"
    | "withdraw"
    | "delete_account"
    | "event"
    | "journalist_application";
  user_id?: string;
  user_email?: string;
  user_name?: string;
  title: string;
  details?: string;
  status: "Pending" | "Approved" | "Rejected";
  created_at: string;
};

export type SummaryRow = {
  type: string;
  status: string;
  count: number;
};

export const TYPE_META: Record<
  string,
  { label: string; icon: React.ComponentType<{ className?: string }>; color: string; bg: string }
> = {
  contact: { label: "Contact Message", icon: Mail, color: "text-blue-600", bg: "bg-blue-50" },
  work_with_us: {
    label: "Work Application",
    icon: Briefcase,
    color: "text-purple-600",
    bg: "bg-purple-50",
  },
  withdraw: {
    label: "Withdrawal Request",
    icon: Wallet,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
  delete_account: {
    label: "Account Deletion",
    icon: UserX,
    color: "text-red-600",
    bg: "bg-red-50",
  },
  event: {
    label: "Event Registration",
    icon: Sparkles,
    color: "text-amber-600",
    bg: "bg-amber-50",
  },
  journalist_application: {
    label: "Journalist Application",
    icon: Newspaper,
    color: "text-indigo-600",
    bg: "bg-indigo-50",
  },
};

export const STATUS_STYLES: Record<string, string> = {
  Pending: "bg-amber-100 text-amber-700",
  Approved: "bg-emerald-100 text-emerald-700",
  Rejected: "bg-red-100 text-red-700",
};
