import {
  LayoutDashboard,
  Newspaper,
  MessageSquare,
  Users,
  FolderTree,
  FileText,
  Home as HomeIcon,
  Megaphone,
  FolderOpen,
  ShieldCheck,
  PenLine,
  Gift,
  Tag,
  Inbox,
  Rocket,
  Settings,
} from "lucide-react";

export interface NavItem {
  to: string;
  label: string;
  icon: typeof LayoutDashboard;
  exact?: boolean;
}

export const ADMIN_NAV_ITEMS: NavItem[] = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/inbox", label: "Inbox", icon: Inbox },
  { to: "/admin/articles", label: "Articles", icon: Newspaper },
  { to: "/admin/categories", label: "Categories", icon: FolderTree },
  { to: "/admin/tags", label: "Tags", icon: Tag },
  { to: "/admin/comments", label: "Comments", icon: MessageSquare },
  { to: "/admin/users", label: "Users", icon: Users },
  { to: "/admin/roles", label: "Roles", icon: ShieldCheck },
  { to: "/admin/journalists", label: "Journalist", icon: PenLine },
  { to: "/admin/rewards", label: "Reward", icon: Gift },
  { to: "/admin/pages", label: "Pages", icon: FileText },
  { to: "/admin/homepage", label: "Homepage Edit", icon: HomeIcon },
  { to: "/admin/reels", label: "Reels & Shorts", icon: Newspaper },
  { to: "/admin/advertisements", label: "Advertisement", icon: Megaphone },
  { to: "/admin/settings", label: "Site Settings", icon: Settings },
  { to: "/admin/files", label: "File Manager", icon: FolderOpen },
  { to: "/admin/updates", label: "Website Update", icon: Rocket },
];
