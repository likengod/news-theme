import { a as isEnterprisePlusLicense } from "./site-settings-BYRELmg5.js";
import { a as useSiteSettings } from "./AdSettingsContext-WOYuMi3Z.js";
import { t as cn } from "./utils-C_uf36nf.js";
import { l as setCurrentRoleId } from "./roles-DDuqnQ3Q.js";
import { i as getCurrentUserRole, t as authClient } from "./auth-client-DaSaErW4.js";
import { r as useTheme } from "./theme-3HUYOunA.js";
import * as React$1 from "react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { Check, ChevronRight, Circle, LayoutDashboard, LogOut, Moon, Star, Sun, User, Wallet } from "lucide-react";
import { toast } from "sonner";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
//#region src/components/ui/dropdown-menu.tsx
var DropdownMenu = DropdownMenuPrimitive.Root;
var DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;
var DropdownMenuSubTrigger = React$1.forwardRef(({ className, inset, children, ...props }, ref) => /* @__PURE__ */ jsxs(DropdownMenuPrimitive.SubTrigger, {
	ref,
	className: cn("flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent data-[state=open]:bg-accent [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0", inset && "pl-8", className),
	...props,
	children: [children, /* @__PURE__ */ jsx(ChevronRight, { className: "ml-auto" })]
}));
DropdownMenuSubTrigger.displayName = DropdownMenuPrimitive.SubTrigger.displayName;
var DropdownMenuSubContent = React$1.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(DropdownMenuPrimitive.SubContent, {
	ref,
	className: cn("z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-dropdown-menu-content-transform-origin)", className),
	...props
}));
DropdownMenuSubContent.displayName = DropdownMenuPrimitive.SubContent.displayName;
var DropdownMenuContent = React$1.forwardRef(({ className, sideOffset = 4, ...props }, ref) => /* @__PURE__ */ jsx(DropdownMenuPrimitive.Portal, { children: /* @__PURE__ */ jsx(DropdownMenuPrimitive.Content, {
	ref,
	sideOffset,
	className: cn("z-50 max-h-[var(--radix-dropdown-menu-content-available-height)] min-w-[8rem] overflow-y-auto overflow-x-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md", "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-dropdown-menu-content-transform-origin)", className),
	...props
}) }));
DropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName;
var DropdownMenuItem = React$1.forwardRef(({ className, inset, ...props }, ref) => /* @__PURE__ */ jsx(DropdownMenuPrimitive.Item, {
	ref,
	className: cn("relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&>svg]:size-4 [&>svg]:shrink-0", inset && "pl-8", className),
	...props
}));
DropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName;
var DropdownMenuCheckboxItem = React$1.forwardRef(({ className, children, checked, ...props }, ref) => /* @__PURE__ */ jsxs(DropdownMenuPrimitive.CheckboxItem, {
	ref,
	className: cn("relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50", className),
	checked,
	...props,
	children: [/* @__PURE__ */ jsx("span", {
		className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center",
		children: /* @__PURE__ */ jsx(DropdownMenuPrimitive.ItemIndicator, { children: /* @__PURE__ */ jsx(Check, { className: "h-4 w-4" }) })
	}), children]
}));
DropdownMenuCheckboxItem.displayName = DropdownMenuPrimitive.CheckboxItem.displayName;
var DropdownMenuRadioItem = React$1.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxs(DropdownMenuPrimitive.RadioItem, {
	ref,
	className: cn("relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50", className),
	...props,
	children: [/* @__PURE__ */ jsx("span", {
		className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center",
		children: /* @__PURE__ */ jsx(DropdownMenuPrimitive.ItemIndicator, { children: /* @__PURE__ */ jsx(Circle, { className: "h-2 w-2 fill-current" }) })
	}), children]
}));
DropdownMenuRadioItem.displayName = DropdownMenuPrimitive.RadioItem.displayName;
var DropdownMenuLabel = React$1.forwardRef(({ className, inset, ...props }, ref) => /* @__PURE__ */ jsx(DropdownMenuPrimitive.Label, {
	ref,
	className: cn("px-2 py-1.5 text-sm font-semibold", inset && "pl-8", className),
	...props
}));
DropdownMenuLabel.displayName = DropdownMenuPrimitive.Label.displayName;
var DropdownMenuSeparator = React$1.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(DropdownMenuPrimitive.Separator, {
	ref,
	className: cn("-mx-1 my-1 h-px bg-muted", className),
	...props
}));
DropdownMenuSeparator.displayName = DropdownMenuPrimitive.Separator.displayName;
var DropdownMenuShortcut = ({ className, ...props }) => {
	return /* @__PURE__ */ jsx("span", {
		className: cn("ml-auto text-xs tracking-widest opacity-60", className),
		...props
	});
};
DropdownMenuShortcut.displayName = "DropdownMenuShortcut";
//#endregion
//#region src/components/site/UserMenu.tsx
function displayNameOf(u) {
	const meta = u.user_metadata ?? {};
	return meta.username || meta.display_name || [meta.first_name, meta.last_name].filter(Boolean).join(" ").trim() || (u.email ? u.email.split("@")[0] : "Account");
}
function initialsOf(name) {
	return name.split(/\s+/).filter(Boolean).slice(0, 2).map((p) => p[0]?.toUpperCase()).join("") || "U";
}
function getPoints(userId) {
	if (typeof window === "undefined") return 0;
	const key = `nt:points:${userId}`;
	const existing = localStorage.getItem(key);
	if (existing !== null) return Number(existing) || 0;
	const seed = 25 + Math.floor(Math.random() * 75);
	localStorage.setItem(key, String(seed));
	return seed;
}
function UserMenu({ variant = "topbar" }) {
	const isEnterprisePlus = isEnterprisePlusLicense(useSiteSettings());
	const [user, setUser] = useState(null);
	const [points, setPoints] = useState(0);
	const [role, setRole] = useState(null);
	const { theme, toggle: toggleTheme } = useTheme();
	const isDark = theme === "dark";
	const navigate = useNavigate();
	useEffect(() => {
		let mounted = true;
		authClient.auth.getSession().then(async ({ data }) => {
			if (!mounted) return;
			setUser(data.session?.user ?? null);
			if (data.session?.user) {
				setPoints(getPoints(data.session.user.id));
				try {
					const roleRes = await getCurrentUserRole({ data: data.session.access_token });
					if (mounted) {
						setRole(roleRes.role);
						if (roleRes.role) setCurrentRoleId(roleRes.role);
					}
				} catch {
					if (mounted) setRole(null);
				}
			} else setRole(null);
		});
		const { data: sub } = authClient.auth.onAuthStateChange(async (event, session) => {
			if (event !== "SIGNED_IN" && event !== "SIGNED_OUT" && event !== "USER_UPDATED" && event !== "INITIAL_SESSION") return;
			setUser(session?.user ?? null);
			if (session?.user) {
				setPoints(getPoints(session.user.id));
				try {
					const roleRes = await getCurrentUserRole({ data: session.access_token });
					if (mounted) {
						setRole(roleRes.role);
						if (roleRes.role) setCurrentRoleId(roleRes.role);
					}
				} catch {
					if (mounted) setRole(null);
				}
			} else {
				setRole(null);
				setCurrentRoleId("reader");
			}
		});
		return () => {
			mounted = false;
			sub.subscription.unsubscribe();
		};
	}, []);
	const handleSignOut = async () => {
		await authClient.auth.signOut();
		setCurrentRoleId("reader");
		toast.success("Signed out");
		navigate({ to: "/" });
	};
	if (!user) return /* @__PURE__ */ jsx(Link, {
		to: "/auth",
		className: "flex items-center gap-1.5 font-semibold text-foreground underline-offset-2 hover:underline focus:outline-none",
		children: /* @__PURE__ */ jsx("span", { children: "Sign in" })
	});
	const name = displayNameOf(user);
	const initials = initialsOf(name);
	const isStaff = role && [
		"admin",
		"editor",
		"author",
		"developer"
	].includes(role);
	const isEarningUser = !isStaff;
	if (variant === "mobile") return /* @__PURE__ */ jsxs("div", {
		className: "flex flex-col gap-2 normal-case tracking-normal",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "flex items-center gap-2 text-foreground",
				children: [/* @__PURE__ */ jsx("span", {
					className: "grid h-8 w-8 place-items-center rounded-full bg-foreground text-[11px] font-bold text-background",
					children: initials
				}), /* @__PURE__ */ jsxs("div", {
					className: "flex flex-col text-xs",
					children: [/* @__PURE__ */ jsx("span", {
						className: "font-semibold",
						children: name
					}), isEarningUser && isEnterprisePlus && /* @__PURE__ */ jsxs("span", {
						className: "text-muted-foreground",
						children: ["Wallet: ₹", points]
					})]
				})]
			}),
			isEarningUser && /* @__PURE__ */ jsxs(Fragment, { children: [isEnterprisePlus && /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(Link, {
				to: "/earn-points",
				className: "hover:text-foreground",
				children: "Wallet"
			}), /* @__PURE__ */ jsx(Link, {
				to: "/earn-points",
				className: "hover:text-foreground",
				children: "Earn Points"
			})] }), /* @__PURE__ */ jsx(Link, {
				to: "/profile",
				className: "hover:text-foreground",
				children: "My profile"
			})] }),
			isStaff && /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(Link, {
				to: "/admin",
				className: "hover:text-foreground",
				children: "Admin panel"
			}), /* @__PURE__ */ jsx(Link, {
				to: "/admin/settings",
				className: "hover:text-foreground",
				children: "Settings"
			})] }),
			/* @__PURE__ */ jsx("button", {
				type: "button",
				onClick: handleSignOut,
				className: "text-left hover:text-foreground",
				children: "Sign out"
			})
		]
	});
	return /* @__PURE__ */ jsxs(DropdownMenu, { children: [/* @__PURE__ */ jsx(DropdownMenuTrigger, {
		asChild: true,
		children: /* @__PURE__ */ jsxs("button", {
			type: "button",
			"aria-label": "Open account menu",
			className: "flex items-center gap-2 rounded-full border border-border bg-background px-1 py-1 pr-2 text-foreground transition-colors hover:bg-muted",
			children: [/* @__PURE__ */ jsx("span", {
				className: "grid h-6 w-6 place-items-center rounded-full bg-foreground text-[10px] font-bold text-background",
				children: initials
			}), /* @__PURE__ */ jsx("span", {
				className: "hidden max-w-[8rem] truncate text-[11px] font-semibold normal-case tracking-normal sm:inline",
				children: name
			})]
		})
	}), /* @__PURE__ */ jsxs(DropdownMenuContent, {
		align: "end",
		className: "w-56",
		children: [
			/* @__PURE__ */ jsxs(DropdownMenuLabel, {
				className: "flex flex-col",
				children: [/* @__PURE__ */ jsx("span", {
					className: "text-sm font-semibold text-foreground",
					children: name
				}), user.email && /* @__PURE__ */ jsx("span", {
					className: "text-xs font-normal text-muted-foreground",
					children: user.email
				})]
			}),
			/* @__PURE__ */ jsx(DropdownMenuSeparator, {}),
			isEarningUser && /* @__PURE__ */ jsxs(Fragment, { children: [isEnterprisePlus && /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsxs(DropdownMenuItem, {
				onSelect: () => navigate({ to: "/earn-points" }),
				className: "cursor-pointer",
				children: [
					/* @__PURE__ */ jsx(Wallet, { className: "mr-2 h-4 w-4 text-emerald-600" }),
					/* @__PURE__ */ jsx("span", {
						className: "flex-1",
						children: "Wallet"
					}),
					/* @__PURE__ */ jsxs("span", {
						className: "ml-2 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700",
						children: ["₹", points]
					})
				]
			}), /* @__PURE__ */ jsxs(DropdownMenuItem, {
				onSelect: () => navigate({ to: "/earn-points" }),
				className: "cursor-pointer",
				children: [/* @__PURE__ */ jsx(Star, { className: "mr-2 h-4 w-4 text-amber-500" }), /* @__PURE__ */ jsx("span", {
					className: "flex-1",
					children: "Earn Points"
				})]
			})] }), /* @__PURE__ */ jsxs(DropdownMenuItem, {
				onSelect: () => navigate({ to: "/profile" }),
				className: "cursor-pointer",
				children: [/* @__PURE__ */ jsx(User, { className: "mr-2 h-4 w-4" }), "My profile"]
			})] }),
			isStaff && /* @__PURE__ */ jsxs(DropdownMenuItem, {
				onSelect: () => navigate({ to: "/admin" }),
				className: "cursor-pointer font-semibold",
				children: [/* @__PURE__ */ jsx(LayoutDashboard, { className: "mr-2 h-4 w-4 text-slate-700" }), "Admin Panel"]
			}),
			/* @__PURE__ */ jsx(DropdownMenuSeparator, {}),
			/* @__PURE__ */ jsxs(DropdownMenuItem, {
				onClick: toggleTheme,
				className: "cursor-pointer",
				children: [isDark ? /* @__PURE__ */ jsx(Sun, { className: "mr-2 h-4 w-4 text-amber-500" }) : /* @__PURE__ */ jsx(Moon, { className: "mr-2 h-4 w-4 text-slate-700" }), /* @__PURE__ */ jsx("span", { children: isDark ? "Day Mode" : "Night Mode" })]
			}),
			/* @__PURE__ */ jsx(DropdownMenuSeparator, {}),
			/* @__PURE__ */ jsxs(DropdownMenuItem, {
				onClick: handleSignOut,
				className: "cursor-pointer text-red-600 focus:text-red-700",
				children: [/* @__PURE__ */ jsx(LogOut, { className: "mr-2 h-4 w-4" }), "Sign out"]
			})
		]
	})] });
}
//#endregion
export { UserMenu };

//# sourceMappingURL=UserMenu-Di54E37O.js.map