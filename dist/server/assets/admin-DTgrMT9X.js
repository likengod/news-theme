import { a as useSiteSettings } from "./AdSettingsContext-C4yKFIXW.js";
import { t as authClient } from "./auth-client-DTMpFaPl.js";
import { t as Route } from "./admin-BhjFoHLV.js";
import { r as getGitStatus } from "./deploy.functions-BTFy8yFs.js";
import { useEffect, useState } from "react";
import { Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { AlertTriangle, FileText, FolderOpen, FolderTree, Gift, Home, Inbox, LayoutDashboard, Lock, LogOut, Megaphone, Menu, MessageSquare, Newspaper, PenLine, Rocket, Search, Settings, ShieldCheck, Tag, Users, X } from "lucide-react";
//#region src/routes/admin.tsx?tsr-split=component
var nav = [
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
function AdminLayout() {
	const { user } = Route.useRouteContext();
	const navigate = useNavigate();
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	const [open, setOpen] = useState(false);
	const s = useSiteSettings();
	const isPremium = [
		"Enterprise",
		"Enterprise+",
		"Premium"
	].includes(s.licenseType || "") || s.licenseRole === "VIP";
	useEffect(() => {
		const root = document.documentElement;
		root.classList.remove("dark");
		root.style.colorScheme = "light";
		return () => {
			if ((localStorage.getItem("fs-theme") || "light") === "dark") {
				root.classList.add("dark");
				root.style.colorScheme = "dark";
			} else {
				root.classList.remove("dark");
				root.style.colorScheme = "light";
			}
		};
	}, []);
	const handleLogout = async () => {
		await authClient.auth.signOut();
		navigate({ to: "/auth" });
	};
	const email = user?.email ?? "admin@northeast.com";
	const initials = email.slice(0, 2).toUpperCase();
	const firstName = (() => {
		const rawName = user?.user_metadata?.full_name || user?.user_metadata?.name || user?.name || user?.display_name;
		if (rawName && typeof rawName === "string" && rawName.trim()) return rawName.trim().split(" ")[0];
		if (email && email.includes("@")) {
			const first = email.split("@")[0].replace(/[._0-9-]/g, " ").trim().split(" ")[0];
			if (first) return first.charAt(0).toUpperCase() + first.slice(1);
		}
		return "Admin";
	})();
	const [updateStatus, setUpdateStatus] = useState({
		hasUpdate: false,
		checked: false
	});
	const [dismissed, setDismissed] = useState(() => {
		if (typeof window !== "undefined") return sessionStorage.getItem("admin_update_dismissed") === "1";
		return false;
	});
	useEffect(() => {
		let mounted = true;
		getGitStatus().then((res) => {
			if (!mounted) return;
			const cur = res?.version || "v1.0.20";
			const latest = res?.latestVersion || cur;
			const isSimulated = typeof window !== "undefined" && (new URLSearchParams(window.location.search).get("test_update") === "1" || localStorage.getItem("force_update_lock") === "1");
			setUpdateStatus({
				hasUpdate: isSimulated || Boolean(res?.hasNewVersion || res?.behind && res.behind > 0),
				currentVersion: cur,
				latestVersion: isSimulated ? res?.latestVersion && res.latestVersion !== cur ? res.latestVersion : "v2.0.0" : latest,
				checked: true
			});
		}).catch((e) => {
			console.error("Version check notice:", e);
		});
		return () => {
			mounted = false;
		};
	}, [pathname]);
	return /* @__PURE__ */ jsxs("div", {
		className: "min-h-screen bg-slate-50 text-slate-900",
		children: [
			/* @__PURE__ */ jsxs("aside", {
				className: `fixed inset-y-0 left-0 z-40 w-64 transform border-r border-slate-200 bg-white overflow-y-auto transition-transform lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`,
				children: [/* @__PURE__ */ jsxs("div", {
					className: "border-b border-slate-200 px-5 py-3",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "flex items-center justify-between",
						children: [/* @__PURE__ */ jsxs(Link, {
							to: "/admin",
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ jsx("div", {
								className: "grid h-8 w-8 place-items-center rounded-md bg-slate-900 text-sm font-bold text-white",
								children: (s.logoTextPrimary || s.siteName || "N").charAt(0).toUpperCase()
							}), /* @__PURE__ */ jsxs("div", {
								className: "leading-tight",
								children: [/* @__PURE__ */ jsxs("div", {
									className: "text-sm font-bold",
									children: [
										/* @__PURE__ */ jsx("span", {
											style: { color: s.logoColorPrimary || "#000000" },
											children: s.logoTextPrimary || "News"
										}),
										" ",
										/* @__PURE__ */ jsx("span", {
											style: { color: s.logoColorSecondary || "#dc2626" },
											children: s.logoTextSecondary || "Theme"
										})
									]
								}), /* @__PURE__ */ jsx("div", {
									className: "text-[10px] uppercase tracking-widest text-slate-500",
									children: "Admin Panel"
								})]
							})]
						}), /* @__PURE__ */ jsx("button", {
							className: "lg:hidden",
							onClick: () => setOpen(false),
							"aria-label": "Close menu",
							children: /* @__PURE__ */ jsx(X, { className: "h-5 w-5" })
						})]
					}), /* @__PURE__ */ jsxs(Link, {
						to: "/",
						className: "mt-2 inline-flex items-center gap-1.5 text-[11px] font-medium text-slate-500 hover:text-slate-900",
						children: [/* @__PURE__ */ jsx(Home, { className: "h-3.5 w-3.5" }), "Back to screen"]
					})]
				}), /* @__PURE__ */ jsxs("nav", {
					className: "p-3",
					children: [
						/* @__PURE__ */ jsx("p", {
							className: "px-3 pb-2 pt-3 text-[10px] font-semibold uppercase tracking-widest text-slate-400",
							children: "Main"
						}),
						/* @__PURE__ */ jsx("ul", {
							className: "space-y-1",
							children: nav.map((item) => {
								const Icon = item.icon;
								const isLocked = item.to === "/admin/rewards" && !isPremium;
								return /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsxs(Link, {
									to: isLocked ? "/admin/settings" : item.to,
									search: isLocked ? { tab: "activate" } : void 0,
									onClick: () => setOpen(false),
									className: `flex items-center justify-between rounded-md px-3 py-2 text-sm font-medium transition ${(item.exact ? pathname === item.to : pathname.startsWith(item.to)) ? "bg-slate-900 text-white" : item.to === "/admin/updates" && updateStatus.hasUpdate ? "bg-red-50 text-red-700 hover:bg-red-100 font-semibold border border-red-200" : isLocked ? "text-slate-400 hover:bg-slate-50" : "text-slate-700 hover:bg-slate-100"}`,
									children: [
										/* @__PURE__ */ jsxs("div", {
											className: "flex items-center gap-3",
											children: [/* @__PURE__ */ jsx(Icon, { className: `h-4 w-4 ${item.to === "/admin/updates" && updateStatus.hasUpdate ? "text-red-600 animate-pulse" : ""}` }), item.label]
										}),
										item.to === "/admin/updates" && updateStatus.hasUpdate && /* @__PURE__ */ jsx("span", {
											className: "flex items-center gap-1 rounded-full bg-red-600 px-2 py-0.5 text-[10px] font-extrabold uppercase text-white shadow-sm animate-pulse",
											children: "Update"
										}),
										isLocked && /* @__PURE__ */ jsx(Lock, { className: "h-3.5 w-3.5 text-slate-300" })
									]
								}) }, item.to);
							})
						}),
						/* @__PURE__ */ jsx("p", {
							className: "px-3 pb-2 pt-6 text-[10px] font-semibold uppercase tracking-widest text-slate-400",
							children: "Shortcuts"
						}),
						/* @__PURE__ */ jsx("ul", {
							className: "space-y-1",
							children: /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsxs("button", {
								onClick: handleLogout,
								className: "flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100",
								children: [/* @__PURE__ */ jsx(LogOut, { className: "h-4 w-4" }), "Sign out"]
							}) })
						})
					]
				})]
			}),
			open && /* @__PURE__ */ jsx("div", {
				className: "fixed inset-0 z-30 bg-black/30 lg:hidden",
				onClick: () => setOpen(false)
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "lg:pl-64",
				children: [/* @__PURE__ */ jsxs("header", {
					className: "sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-6",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-3",
						children: [/* @__PURE__ */ jsx("button", {
							className: "lg:hidden",
							onClick: () => setOpen(true),
							"aria-label": "Open menu",
							children: /* @__PURE__ */ jsx(Menu, { className: "h-5 w-5" })
						}), /* @__PURE__ */ jsxs("div", {
							className: "relative hidden sm:block",
							children: [/* @__PURE__ */ jsx(Search, { className: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" }), /* @__PURE__ */ jsx("input", {
								placeholder: "Search...",
								className: "w-72 rounded-md border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm placeholder:text-slate-400 focus:border-slate-900 focus:bg-white focus:outline-none"
							})]
						})]
					}), /* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-3",
						children: [updateStatus.hasUpdate && /* @__PURE__ */ jsxs(Link, {
							to: "/admin/updates",
							className: "hidden sm:inline-flex items-center gap-1.5 rounded-full bg-red-50 border border-red-200 px-3 py-1 text-xs font-semibold text-red-600 hover:bg-red-100 transition",
							children: [/* @__PURE__ */ jsx(Rocket, { className: "h-3.5 w-3.5 text-red-600 animate-pulse" }), /* @__PURE__ */ jsxs("span", { children: [
								"Update Available (",
								updateStatus.latestVersion || "New",
								")"
							] })]
						}), /* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ jsx("div", {
								className: "grid h-8 w-8 place-items-center rounded-full bg-slate-900 text-xs font-bold text-white",
								children: initials
							}), /* @__PURE__ */ jsxs("div", {
								className: "hidden text-left leading-tight sm:block",
								children: [/* @__PURE__ */ jsx("div", {
									className: "text-xs font-semibold",
									children: email.split("@")[0]
								}), /* @__PURE__ */ jsx("div", {
									className: "text-[10px] text-slate-500",
									children: "Administrator"
								})]
							})]
						})]
					})]
				}), /* @__PURE__ */ jsx("main", {
					className: "p-4 sm:p-6 lg:p-8",
					children: updateStatus.hasUpdate && !dismissed && pathname !== "/admin/updates" ? /* @__PURE__ */ jsx("div", {
						className: "flex min-h-[75vh] flex-col items-center justify-center py-12 px-4 text-center",
						children: /* @__PURE__ */ jsxs("div", {
							className: "max-w-xl w-full",
							children: [
								/* @__PURE__ */ jsx("div", {
									className: "mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-red-100/80 text-red-600",
									children: /* @__PURE__ */ jsx(Rocket, { className: "h-10 w-10 animate-bounce" })
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-red-600 mb-3",
									children: [/* @__PURE__ */ jsx(AlertTriangle, { className: "h-4 w-4" }), /* @__PURE__ */ jsx("span", { children: "Update Required" })]
								}),
								/* @__PURE__ */ jsxs("h1", {
									className: "text-3xl font-extrabold text-slate-900 sm:text-4xl tracking-tight",
									children: [
										"Dear ",
										/* @__PURE__ */ jsx("span", {
											className: "text-red-600",
											children: firstName
										}),
										","
									]
								}),
								/* @__PURE__ */ jsx("p", {
									className: "mt-4 text-base sm:text-lg text-slate-600 leading-relaxed",
									children: "Without update you can't use the website. A new version is available, please update website."
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "mt-6 flex items-center justify-center gap-3 text-sm font-semibold text-slate-500",
									children: [
										/* @__PURE__ */ jsxs("span", {
											className: "font-mono text-slate-700 bg-slate-200/70 px-3 py-1 rounded-full text-xs",
											children: ["Current: ", updateStatus.currentVersion || "v1.0.20"]
										}),
										/* @__PURE__ */ jsx("span", { children: "➔" }),
										/* @__PURE__ */ jsxs("span", {
											className: "font-mono text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full text-xs font-bold",
											children: ["Available: ", updateStatus.latestVersion || "Latest"]
										})
									]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5",
									children: [/* @__PURE__ */ jsxs(Link, {
										to: "/admin/updates",
										className: "w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-xl bg-red-600 px-7 py-3.5 text-sm font-bold text-white shadow-md hover:bg-red-700 transition active:scale-[0.98]",
										children: [/* @__PURE__ */ jsx(Rocket, { className: "h-4 w-4" }), "Update Website Now"]
									}), /* @__PURE__ */ jsx("button", {
										onClick: () => {
											setDismissed(true);
											if (typeof window !== "undefined") sessionStorage.setItem("admin_update_dismissed", "1");
										},
										className: "w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition active:scale-[0.98] shadow-sm",
										children: "Continue to Admin Panel"
									})]
								})
							]
						})
					}) : /* @__PURE__ */ jsxs(Fragment, { children: [updateStatus.hasUpdate && /* @__PURE__ */ jsxs("div", {
						className: "mb-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50/90 px-4 py-3 text-sm text-red-800",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-2.5 font-medium",
							children: [/* @__PURE__ */ jsx(AlertTriangle, { className: "h-4 w-4 shrink-0 text-red-600" }), /* @__PURE__ */ jsxs("span", { children: [
								/* @__PURE__ */ jsx("strong", { children: "Update Available:" }),
								" Version ",
								updateStatus.latestVersion,
								" is available to install (current: ",
								updateStatus.currentVersion,
								")."
							] })]
						}), /* @__PURE__ */ jsxs(Link, {
							to: "/admin/updates",
							className: "inline-flex items-center gap-1.5 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-red-700 transition shadow-sm",
							children: [/* @__PURE__ */ jsx(Rocket, { className: "h-3.5 w-3.5" }), "Update Website Now"]
						})]
					}), /* @__PURE__ */ jsx(Outlet, {})] })
				})]
			})
		]
	});
}
//#endregion
export { AdminLayout as component };
