import { a as getUserServer, i as getCurrentUserRole, t as authClient } from "./auth-client-B1kQEcef.js";
import { useEffect, useState } from "react";
import { createFileRoute, lazyRouteComponent, redirect } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { FileText, FolderOpen, FolderTree, Gift, Home, Inbox, LayoutDashboard, Megaphone, MessageSquare, Newspaper, PenLine, Rocket, Settings, ShieldCheck, Tag, Users } from "lucide-react";
//#region src/components/admin/layout/navItems.ts
var ADMIN_NAV_ITEMS = [
	{
		to: "/admin",
		label: "Dashboard",
		icon: LayoutDashboard,
		exact: true
	},
	{
		to: "/admin/inbox",
		label: "Inbox",
		icon: Inbox
	},
	{
		to: "/admin/articles",
		label: "Articles",
		icon: Newspaper
	},
	{
		to: "/admin/categories",
		label: "Categories",
		icon: FolderTree
	},
	{
		to: "/admin/tags",
		label: "Tags",
		icon: Tag
	},
	{
		to: "/admin/comments",
		label: "Comments",
		icon: MessageSquare
	},
	{
		to: "/admin/users",
		label: "Users",
		icon: Users
	},
	{
		to: "/admin/roles",
		label: "Roles",
		icon: ShieldCheck
	},
	{
		to: "/admin/journalists",
		label: "Journalist",
		icon: PenLine
	},
	{
		to: "/admin/rewards",
		label: "Reward",
		icon: Gift
	},
	{
		to: "/admin/pages",
		label: "Pages",
		icon: FileText
	},
	{
		to: "/admin/homepage",
		label: "Homepage Edit",
		icon: Home
	},
	{
		to: "/admin/reels",
		label: "Reels & Shorts",
		icon: Newspaper
	},
	{
		to: "/admin/advertisements",
		label: "Advertisement",
		icon: Megaphone
	},
	{
		to: "/admin/settings",
		label: "Site Settings",
		icon: Settings
	},
	{
		to: "/admin/files",
		label: "File Manager",
		icon: FolderOpen
	},
	{
		to: "/admin/updates",
		label: "Website Update",
		icon: Rocket
	}
];
/**
* Panels accessible by the 'editor' role.
* Editors can only access and view:
* /admin/articles, /admin/inbox, /admin/comments, /admin/advertisements,
* /admin/files, /admin/journalists, /admin/categories, /admin/tags
*/
var EDITOR_ALLOWED_ROUTES = [
	"/admin/articles",
	"/admin/inbox",
	"/admin/comments",
	"/admin/advertisements",
	"/admin/files",
	"/admin/journalists",
	"/admin/categories",
	"/admin/tags"
];
function isEditorAllowedRoute(pathname) {
	const clean = pathname.split("?")[0].replace(/\/+$/, "") || "/";
	return EDITOR_ALLOWED_ROUTES.some((route) => {
		const cleanRoute = route.replace(/\/+$/, "");
		return clean === cleanRoute || clean.startsWith(cleanRoute + "/");
	});
}
//#endregion
//#region src/routes/admin.tsx
var $$splitComponentImporter = () => import("./admin-yHPNOfB9.js");
var $$splitErrorComponentImporter = () => import("./admin-F33_sldM.js");
var verifiedAdminTokens = /* @__PURE__ */ new Map();
var Route = createFileRoute("/admin")({
	ssr: false,
	pendingComponent: AdminPendingFallback,
	errorComponent: lazyRouteComponent($$splitErrorComponentImporter, "errorComponent"),
	beforeLoad: async ({ location }) => {
		const { data } = await authClient.auth.getSession();
		if (!data.session?.user || !data.session?.access_token) throw redirect({ to: "/auth" });
		const token = data.session.access_token;
		const now = Date.now();
		let userRole = null;
		const cached = verifiedAdminTokens.get(token);
		if (cached && cached.expiry > now) userRole = cached.role;
		else try {
			const [res, roleRes] = await Promise.all([getUserServer({ data: token }), getCurrentUserRole({ data: token })]);
			if (!res.user) {
				verifiedAdminTokens.delete(token);
				await authClient.auth.signOut();
				throw redirect({ to: "/auth" });
			}
			if (!roleRes.role || !["admin", "editor"].includes(roleRes.role)) {
				verifiedAdminTokens.delete(token);
				throw redirect({ to: "/" });
			}
			userRole = roleRes.role;
			verifiedAdminTokens.set(token, {
				expiry: now + 120 * 1e3,
				role: userRole
			});
		} catch (e) {
			verifiedAdminTokens.delete(token);
			if (e?.headers || e?.to) throw e;
			await authClient.auth.signOut();
			throw redirect({ to: "/auth" });
		}
		if (userRole === "editor") {
			const currentPath = location.pathname;
			if (!isEditorAllowedRoute(currentPath)) throw redirect({ to: "/admin/articles" });
		}
		return {
			user: data.session.user,
			role: userRole
		};
	},
	head: () => ({ meta: [
		{ title: "Admin Dashboard - News Timeline" },
		{
			name: "description",
			content: "Administrative control center and dashboard."
		},
		{
			name: "robots",
			content: "noindex, nofollow"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
function AdminPendingFallback() {
	const [takingLong, setTakingLong] = useState(false);
	useEffect(() => {
		const timer = setTimeout(() => {
			setTakingLong(true);
		}, 4e3);
		return () => clearTimeout(timer);
	}, []);
	return /* @__PURE__ */ jsx("div", {
		className: "min-h-screen flex flex-col items-center justify-center bg-slate-50 text-slate-800 p-4",
		children: /* @__PURE__ */ jsxs("div", {
			className: "flex flex-col items-center gap-3 text-center max-w-sm",
			children: [
				/* @__PURE__ */ jsx("div", { className: "h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-red-600" }),
				/* @__PURE__ */ jsx("p", {
					className: "text-sm font-semibold text-slate-700",
					children: "Connecting to Admin Dashboard..."
				}),
				takingLong && /* @__PURE__ */ jsxs("div", {
					className: "mt-3 flex flex-col items-center gap-2 animate-in fade-in duration-300",
					children: [/* @__PURE__ */ jsx("p", {
						className: "text-xs text-slate-500",
						children: "Update was applied. Click below to load the new version."
					}), /* @__PURE__ */ jsx("button", {
						type: "button",
						onClick: () => {
							if (typeof window !== "undefined") {
								if ("caches" in window) caches.keys().then((keys) => {
									keys.forEach((k) => caches.delete(k));
								}).catch(() => {});
								window.location.reload();
							}
						},
						className: "px-4 py-2 rounded-xl bg-red-600 text-white text-xs font-bold shadow-xs hover:bg-red-700 transition cursor-pointer",
						children: "Refresh Dashboard"
					})]
				})
			]
		})
	});
}
//#endregion
export { ADMIN_NAV_ITEMS as n, isEditorAllowedRoute as r, Route as t };

//# sourceMappingURL=admin-0u-tsBLZ.js.map