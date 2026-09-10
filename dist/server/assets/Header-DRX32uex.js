import { f as sections, m as tickers } from "./db.server-CLva-TlE.js";
import { _ as loadSettings, r as defaultSettings } from "./site-content-YCrIV7Zo.js";
import { o as getTopTags } from "./taxonomy.functions-B1n0JUyr.js";
import { a as useSiteSettings, r as useCategories } from "./AdSettingsContext--FeqMSrr.js";
import { t as useHomepageConfig } from "./use-homepage-config-CbPkPbm4.js";
import { i as getCurrentUserRole, t as authClient } from "./auth-client-RJN0C8cq.js";
import { t as cn } from "./utils-C_uf36nf.js";
import { o as getHomepageArticles } from "./articles.functions-Dz1a_MUr.js";
import * as React$1 from "react";
import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { Check, ChevronDown, ChevronRight, Circle, Globe, Home, LayoutDashboard, LogOut, Menu, Moon, Search, Star, Sun, User, Wallet, X } from "lucide-react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import * as SheetPrimitive from "@radix-ui/react-dialog";
import { cva } from "class-variance-authority";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { createPortal } from "react-dom";
//#region src/lib/theme.tsx
var ThemeContext = createContext(null);
var STORAGE_KEY = "fs-theme";
function ThemeProvider({ children }) {
	const [theme, setThemeState] = useState("light");
	useEffect(() => {
		const initial = (typeof window !== "undefined" && localStorage.getItem(STORAGE_KEY)) ?? "light";
		applyTheme(initial);
		setThemeState(initial);
	}, []);
	const setTheme = useCallback((t) => {
		applyTheme(t);
		localStorage.setItem(STORAGE_KEY, t);
		setThemeState(t);
	}, []);
	const toggle = useCallback(() => {
		setTheme(theme === "dark" ? "light" : "dark");
	}, [theme, setTheme]);
	return /* @__PURE__ */ jsx(ThemeContext.Provider, {
		value: {
			theme,
			toggle,
			setTheme
		},
		children
	});
}
function applyTheme(t) {
	if (typeof document === "undefined") return;
	const root = document.documentElement;
	root.classList.toggle("dark", t === "dark");
	root.style.colorScheme = t;
}
function useTheme() {
	const ctx = useContext(ThemeContext);
	if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
	return ctx;
}
/** Inline script to set theme before hydration to avoid FOUC. */
var themeInitScript = `(function(){try{var t=localStorage.getItem('${STORAGE_KEY}')||'light';var r=document.documentElement;if(t==='dark')r.classList.add('dark');r.style.colorScheme=t;}catch(e){}})();`;
//#endregion
//#region src/components/ui/sheet.tsx
var Sheet = SheetPrimitive.Root;
var SheetTrigger = SheetPrimitive.Trigger;
var SheetPortal = SheetPrimitive.Portal;
var SheetOverlay = React$1.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(SheetPrimitive.Overlay, {
	className: cn("fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0", className),
	...props,
	ref
}));
SheetOverlay.displayName = SheetPrimitive.Overlay.displayName;
var sheetVariants = cva("fixed z-50 gap-4 bg-background p-6 shadow-lg transition ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-500 data-[state=open]:animate-in data-[state=closed]:animate-out", {
	variants: { side: {
		top: "inset-x-0 top-0 border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",
		bottom: "inset-x-0 bottom-0 border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
		left: "inset-y-0 left-0 h-full w-3/4 border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm",
		right: "inset-y-0 right-0 h-full w-3/4 border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm"
	} },
	defaultVariants: { side: "right" }
});
var SheetContent = React$1.forwardRef(({ side = "right", className, children, ...props }, ref) => /* @__PURE__ */ jsxs(SheetPortal, { children: [/* @__PURE__ */ jsx(SheetOverlay, {}), /* @__PURE__ */ jsxs(SheetPrimitive.Content, {
	ref,
	className: cn(sheetVariants({ side }), className),
	...props,
	children: [/* @__PURE__ */ jsxs(SheetPrimitive.Close, {
		className: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background cursor-pointer transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary",
		children: [/* @__PURE__ */ jsx(X, { className: "h-4 w-4" }), /* @__PURE__ */ jsx("span", {
			className: "sr-only",
			children: "Close"
		})]
	}), children]
})] }));
SheetContent.displayName = SheetPrimitive.Content.displayName;
var SheetHeader = ({ className, ...props }) => /* @__PURE__ */ jsx("div", {
	className: cn("flex flex-col space-y-2 text-center sm:text-left", className),
	...props
});
SheetHeader.displayName = "SheetHeader";
var SheetFooter = ({ className, ...props }) => /* @__PURE__ */ jsx("div", {
	className: cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className),
	...props
});
SheetFooter.displayName = "SheetFooter";
var SheetTitle = React$1.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(SheetPrimitive.Title, {
	ref,
	className: cn("text-lg font-semibold text-foreground", className),
	...props
}));
SheetTitle.displayName = SheetPrimitive.Title.displayName;
var SheetDescription = React$1.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(SheetPrimitive.Description, {
	ref,
	className: cn("text-sm text-muted-foreground", className),
	...props
}));
SheetDescription.displayName = SheetPrimitive.Description.displayName;
//#endregion
//#region src/components/site/ThemeToggle.tsx
function ThemeToggle({ className = "" }) {
	const { theme, toggle } = useTheme();
	const isDark = theme === "dark";
	return /* @__PURE__ */ jsx("button", {
		type: "button",
		onClick: toggle,
		"aria-label": isDark ? "Switch to day mode" : "Switch to night mode",
		title: isDark ? "Day mode" : "Night mode",
		className: `inline-flex h-7 w-7 items-center justify-center border border-border text-foreground transition-colors hover:bg-foreground hover:text-background ${className}`,
		children: isDark ? /* @__PURE__ */ jsx(Sun, { className: "h-3.5 w-3.5" }) : /* @__PURE__ */ jsx(Moon, { className: "h-3.5 w-3.5" })
	});
}
//#endregion
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
					if (mounted) setRole(roleRes.role);
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
					if (mounted) setRole(roleRes.role);
				} catch {
					if (mounted) setRole(null);
				}
			} else setRole(null);
		});
		return () => {
			mounted = false;
			sub.subscription.unsubscribe();
		};
	}, []);
	const handleSignOut = async () => {
		await authClient.auth.signOut();
		toast.success("Signed out");
		navigate({ to: "/" });
	};
	if (!user) {
		if (variant === "mobile") return /* @__PURE__ */ jsx("div", {
			className: "flex flex-col gap-2",
			children: /* @__PURE__ */ jsx(Link, {
				to: "/auth",
				className: "hover:text-foreground",
				children: "Sign in"
			})
		});
		return /* @__PURE__ */ jsxs(DropdownMenu, { children: [/* @__PURE__ */ jsx(DropdownMenuTrigger, {
			asChild: true,
			children: /* @__PURE__ */ jsx("button", {
				type: "button",
				className: "flex items-center gap-1.5 font-semibold text-foreground underline-offset-2 hover:underline focus:outline-none",
				children: /* @__PURE__ */ jsx("span", { children: "Sign in" })
			})
		}), /* @__PURE__ */ jsxs(DropdownMenuContent, {
			align: "end",
			className: "w-48",
			children: [
				/* @__PURE__ */ jsx(DropdownMenuItem, {
					asChild: true,
					children: /* @__PURE__ */ jsxs(Link, {
						to: "/auth",
						className: "cursor-pointer font-semibold",
						children: [/* @__PURE__ */ jsx(User, { className: "mr-2 h-4 w-4" }), "Sign in / Register"]
					})
				}),
				/* @__PURE__ */ jsx(DropdownMenuSeparator, {}),
				/* @__PURE__ */ jsxs(DropdownMenuItem, {
					onClick: toggleTheme,
					className: "cursor-pointer",
					children: [isDark ? /* @__PURE__ */ jsx(Sun, { className: "mr-2 h-4 w-4 text-amber-500" }) : /* @__PURE__ */ jsx(Moon, { className: "mr-2 h-4 w-4 text-slate-700" }), /* @__PURE__ */ jsx("span", { children: isDark ? "Day Mode" : "Night Mode" })]
				})
			]
		})] });
	}
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
					}), isEarningUser && /* @__PURE__ */ jsxs("span", {
						className: "text-muted-foreground",
						children: ["Wallet: ₹", points]
					})]
				})]
			}),
			isEarningUser && /* @__PURE__ */ jsxs(Fragment, { children: [
				/* @__PURE__ */ jsx(Link, {
					to: "/earn-points",
					className: "hover:text-foreground",
					children: "Wallet"
				}),
				/* @__PURE__ */ jsx(Link, {
					to: "/earn-points",
					className: "hover:text-foreground",
					children: "Earn Points"
				}),
				/* @__PURE__ */ jsx(Link, {
					to: "/profile",
					className: "hover:text-foreground",
					children: "My profile"
				})
			] }),
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
			isEarningUser && /* @__PURE__ */ jsxs(Fragment, { children: [
				/* @__PURE__ */ jsxs(DropdownMenuItem, {
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
				}),
				/* @__PURE__ */ jsxs(DropdownMenuItem, {
					onSelect: () => navigate({ to: "/earn-points" }),
					className: "cursor-pointer",
					children: [/* @__PURE__ */ jsx(Star, { className: "mr-2 h-4 w-4 text-amber-500" }), /* @__PURE__ */ jsx("span", {
						className: "flex-1",
						children: "Earn Points"
					})]
				}),
				/* @__PURE__ */ jsxs(DropdownMenuItem, {
					onSelect: () => navigate({ to: "/profile" }),
					className: "cursor-pointer",
					children: [/* @__PURE__ */ jsx(User, { className: "mr-2 h-4 w-4" }), "My profile"]
				})
			] }),
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
//#region src/components/site/SearchModal.tsx
function SearchModal({ open, onClose }) {
	const [mounted, setMounted] = useState(false);
	const [q, setQ] = useState("");
	const [suggestions, setSuggestions] = useState([
		"Infrastructure",
		"Trade",
		"Governance",
		"Healthcare",
		"Economy",
		"Finance",
		"Space",
		"Tech",
		"Sports",
		"Culture"
	]);
	const inputRef = useRef(null);
	const navigate = useNavigate();
	useEffect(() => {
		setMounted(true);
	}, []);
	useEffect(() => {
		if (!open) return;
		document.body.classList.add("search-modal-open");
		window.dispatchEvent(new CustomEvent("nt:search-modal-state", { detail: { open: true } }));
		getTopTags().then((tags) => {
			if (tags && tags.length > 0) setSuggestions(tags.slice(0, 10));
		}).catch((err) => {
			console.error("[SearchModal] Failed to load top tags:", err);
		});
		const focusTimer = setTimeout(() => inputRef.current?.focus(), 50);
		const onKey = (e) => {
			if (e.key === "Escape") onClose();
		};
		document.addEventListener("keydown", onKey);
		document.body.style.overflow = "hidden";
		return () => {
			clearTimeout(focusTimer);
			document.body.classList.remove("search-modal-open");
			window.dispatchEvent(new CustomEvent("nt:search-modal-state", { detail: { open: false } }));
			document.removeEventListener("keydown", onKey);
			document.body.style.overflow = "";
		};
	}, [open, onClose]);
	const go = (term) => {
		if (!term.trim()) return;
		navigate({
			to: "/search",
			search: {
				q: term.trim(),
				page: 1
			}
		});
		onClose();
	};
	const submit = (e) => {
		e.preventDefault();
		go(q);
	};
	if (!open || !mounted) return null;
	return createPortal(/* @__PURE__ */ jsxs("div", {
		className: "fixed inset-0 z-[999999] h-screen w-screen flex flex-col items-center justify-center bg-white text-black px-4 transition-all duration-200 animate-in fade-in",
		role: "dialog",
		"aria-modal": "true",
		"aria-label": "Search site",
		children: [/* @__PURE__ */ jsx("button", {
			type: "button",
			onClick: onClose,
			"aria-label": "Close search",
			className: "absolute top-8 right-8 sm:top-10 sm:right-12 text-[#000000] p-2 hover:opacity-60 transition-opacity z-[1000000]",
			children: /* @__PURE__ */ jsx(X, { className: "h-6 w-6 stroke-[2]" })
		}), /* @__PURE__ */ jsxs("div", {
			className: "w-full max-w-[560px] text-left -mt-8 sm:-mt-12",
			children: [/* @__PURE__ */ jsxs("form", {
				onSubmit: submit,
				className: "relative w-full",
				children: [/* @__PURE__ */ jsx("input", {
					ref: inputRef,
					type: "search",
					value: q,
					onChange: (e) => setQ(e.target.value),
					placeholder: "Type & hit enter",
					className: "w-full bg-[#ececec] text-[#222222] placeholder:text-[#666666] text-[16px] sm:text-[17px] font-sans px-5 py-3.5 pr-12 border-0 rounded-none focus:outline-none focus:ring-0 shadow-none appearance-none"
				}), /* @__PURE__ */ jsx("button", {
					type: "submit",
					"aria-label": "Search",
					className: "absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-[#333333] hover:text-black transition-colors",
					children: /* @__PURE__ */ jsx(Search, { className: "h-4 w-4 stroke-[2]" })
				})]
			}), /* @__PURE__ */ jsxs("div", {
				className: "mt-4",
				children: [/* @__PURE__ */ jsx("p", {
					className: "text-[10px] font-serif italic text-[#888888] mb-1.5",
					children: "Suggestions"
				}), /* @__PURE__ */ jsx("div", {
					className: "flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[13px] font-semibold text-[#111111]",
					children: suggestions.map((s, i) => /* @__PURE__ */ jsxs("span", {
						className: "flex items-center gap-2.5",
						children: [/* @__PURE__ */ jsx("button", {
							type: "button",
							onClick: () => go(s),
							className: "transition-colors hover:underline hover:text-black",
							children: s
						}), i < suggestions.length - 1 && /* @__PURE__ */ jsx("span", {
							className: "text-[#999999] font-normal text-[11px]",
							children: "·"
						})]
					}, s))
				})]
			})]
		})]
	}), document.body);
}
/** Modular SearchBox Button Component */
function SearchBox({ className }) {
	const [open, setOpen] = useState(false);
	return /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx("button", {
		type: "button",
		onClick: () => setOpen(true),
		"aria-label": "Open search",
		className: className || "shrink-0 rounded-full p-2 text-foreground transition-colors hover:bg-muted",
		children: /* @__PURE__ */ jsx(Search, { className: "h-5 w-5" })
	}), /* @__PURE__ */ jsx(SearchModal, {
		open,
		onClose: () => setOpen(false)
	})] });
}
//#endregion
//#region src/components/site/LanguageSwitcher.tsx
function LanguageSwitcher() {
	const { i18n } = useTranslation();
	useEffect(() => {
		if (document.getElementById("google-translate-script")) return;
		window.googleTranslateElementInit = () => {
			if (window.google && window.google.translate) new window.google.translate.TranslateElement({
				pageLanguage: "en",
				includedLanguages: "hi,bn,en",
				layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
				autoDisplay: false
			}, "google_translate_element");
		};
		const script = document.createElement("script");
		script.id = "google-translate-script";
		script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
		script.async = true;
		document.body.appendChild(script);
	}, []);
	const changeLanguage = (lng) => {
		i18n.changeLanguage(lng);
		if (lng === "en") {
			document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
			document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=" + location.hostname;
			window.location.reload();
			return;
		}
		const select = document.querySelector(".goog-te-combo");
		if (select) {
			select.value = lng;
			select.dispatchEvent(new Event("change"));
		}
	};
	return /* @__PURE__ */ jsxs(Fragment, { children: [
		/* @__PURE__ */ jsx("style", { children: `
          body { top: 0 !important; }
          .goog-te-banner-frame { display: none !important; }
        ` }),
		/* @__PURE__ */ jsx("div", {
			id: "google_translate_element",
			style: { display: "none" }
		}),
		/* @__PURE__ */ jsxs(DropdownMenu, { children: [/* @__PURE__ */ jsx(DropdownMenuTrigger, {
			asChild: true,
			children: /* @__PURE__ */ jsx("button", {
				className: "grid h-7 w-7 place-items-center border border-border text-foreground hover:bg-muted transition-colors focus:outline-none",
				title: "Select Language",
				children: /* @__PURE__ */ jsx(Globe, { className: "h-4 w-4" })
			})
		}), /* @__PURE__ */ jsx(DropdownMenuContent, {
			align: "end",
			className: "w-32 bg-background z-50",
			children: [
				{
					code: "en",
					label: "English"
				},
				{
					code: "hi",
					label: "हिंदी"
				},
				{
					code: "bn",
					label: "বাংলা"
				}
			].map((lng) => /* @__PURE__ */ jsx(DropdownMenuItem, {
				onClick: () => changeLanguage(lng.code),
				className: `cursor-pointer ${i18n.language === lng.code ? "bg-muted font-bold" : ""}`,
				children: lng.label
			}, lng.code))
		})] })
	] });
}
//#endregion
//#region src/components/site/TopBar.tsx
var slugify$1 = (s) => s.toLowerCase().replace(/\s+/g, "-");
var FONT_FAMILY_MAP = {
	inter: "\"Inter\", system-ui, sans-serif",
	serif: "Georgia, Cambria, \"Times New Roman\", Times, serif",
	cinzel: "\"Cinzel\", serif, Georgia",
	playfair: "\"Playfair Display\", Georgia, serif",
	roboto: "\"Roboto\", Arial, sans-serif",
	mono: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace"
};
var GRADIENT_MAP = {
	"indian-flag": "linear-gradient(to right, #FF9933, #000080, #138808)",
	"diwali": "linear-gradient(to right, #FF8008, #FFC837, #FF007F, #7F00FF)",
	"sunset": "linear-gradient(to right, #F5576C, #F093FB)",
	"neon": "linear-gradient(to right, #FF007F, #7F00FF, #00F0FF)",
	"ocean": "linear-gradient(to right, #00c6ff, #0072ff)",
	"forest": "linear-gradient(to right, #11998e, #38ef7d)"
};
var otherCategories$1 = [
	"Entertainment",
	"Health",
	"Education",
	"Jobs",
	"Travel",
	"Lifestyle"
];
function TopBar() {
	const { t } = useTranslation();
	const [open, setOpen] = useState(false);
	const [settings, setSettings] = useState(defaultSettings);
	const [mounted, setMounted] = useState(false);
	const [showCustom, setShowCustom] = useState(false);
	const [localAqi, setLocalAqi] = useState("DEL 165 AQI");
	const navigate = useNavigate();
	const dbCats = useCategories();
	const allItems = dbCats.length > 0 ? dbCats.map((c) => c.name) : sections.filter((s) => s !== "Others").concat(otherCategories$1);
	useEffect(() => {
		setSettings(loadSettings());
		setMounted(true);
		fetch("https://get.geojs.io/v1/ip/geo.json").then((res) => res.json()).then((data) => {
			if (data && data.city) {
				const cityCode = data.city.substring(0, 3).toUpperCase();
				const aqi = Math.floor(Math.random() * 100) + 40;
				setLocalAqi(cityCode + " " + aqi + " AQI");
			}
		}).catch(() => {});
		const handleUpdate = () => {
			setSettings(loadSettings());
		};
		window.addEventListener("nt:settings-updated", handleUpdate);
		return () => window.removeEventListener("nt:settings-updated", handleUpdate);
	}, []);
	const today = (/* @__PURE__ */ new Date()).toLocaleDateString("en-US", {
		weekday: "long",
		year: "numeric",
		month: "long",
		day: "numeric"
	});
	const todayShort = (/* @__PURE__ */ new Date()).toLocaleDateString("en-US", {
		month: "short",
		day: "numeric"
	});
	const hasCustomRight = mounted && settings.festiveThemeEnabled !== false && !!settings.topBarWeatherCustomText;
	const delay = Number(settings.topBarSwapDelay) || 5;
	useEffect(() => {
		if (!hasCustomRight) {
			setShowCustom(false);
			return;
		}
		const interval = setInterval(() => {
			setShowCustom((prev) => !prev);
		}, delay * 1e3);
		return () => clearInterval(interval);
	}, [hasCustomRight, delay]);
	const gradientStyle = mounted && settings.topBarTextGradient && GRADIENT_MAP[settings.topBarTextGradient] ? {
		backgroundImage: GRADIENT_MAP[settings.topBarTextGradient],
		WebkitBackgroundClip: "text",
		WebkitTextFillColor: "transparent",
		backgroundClip: "text",
		display: "inline-block"
	} : void 0;
	return /* @__PURE__ */ jsx("div", {
		className: "sticky top-0 z-45 h-11 border-b border-border bg-background/90 backdrop-blur-md transition-colors duration-300",
		style: {
			backgroundColor: mounted && settings.topBarBgColor || void 0,
			borderColor: mounted && settings.topBarBgColor ? "transparent" : void 0
		},
		children: /* @__PURE__ */ jsxs("div", {
			className: `mx-auto flex h-full max-w-7xl items-center justify-between gap-2 px-4 text-[11px] uppercase tracking-widest ${mounted && settings.topBarTextColor ? "" : "text-muted-foreground"}`,
			style: { color: mounted && settings.topBarTextColor || void 0 },
			children: [
				/* @__PURE__ */ jsx("div", {
					className: "flex-1 min-w-0",
					children: /* @__PURE__ */ jsxs("span", {
						className: "truncate",
						children: [/* @__PURE__ */ jsx("span", {
							className: "hidden sm:inline",
							children: today
						}), /* @__PURE__ */ jsx("span", {
							className: "sm:hidden",
							children: todayShort
						})]
					})
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "relative hidden h-4 flex-1 min-w-0 overflow-hidden md:block",
					children: [/* @__PURE__ */ jsxs("div", {
						className: `absolute inset-y-0 left-0 flex items-center gap-4 transition-all duration-500 ${showCustom && hasCustomRight ? "-translate-y-full opacity-0" : "translate-y-0 opacity-100"}`,
						children: [
							/* @__PURE__ */ jsx("span", { children: localAqi }),
							/* @__PURE__ */ jsx("span", { children: "MUM 82 AQI" }),
							/* @__PURE__ */ jsx("span", { children: "KOL 145 AQI" })
						]
					}), hasCustomRight && /* @__PURE__ */ jsx("span", {
						className: `absolute inset-y-0 left-0 flex items-center font-bold transition-all duration-500 ${showCustom ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"}`,
						style: {
							...gradientStyle,
							fontFamily: FONT_FAMILY_MAP[settings.customAlertFontFamily || "inter"] || FONT_FAMILY_MAP["inter"],
							fontSize: settings.customAlertFontSize ? `${settings.customAlertFontSize}px` : void 0
						},
						children: settings.topBarWeatherCustomText
					})]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "flex shrink-0 items-center gap-2 sm:gap-3",
					children: [
						/* @__PURE__ */ jsx(LanguageSwitcher, {}),
						/* @__PURE__ */ jsx(Link, {
							to: "/subscription",
							className: "hidden hover:text-foreground sm:inline",
							children: t("nav.subscribe")
						}),
						/* @__PURE__ */ jsx("span", {
							className: "hidden text-border sm:inline",
							children: "|"
						}),
						/* @__PURE__ */ jsx(UserMenu, {}),
						/* @__PURE__ */ jsx(SearchBox, { className: "grid h-7 w-7 place-items-center text-foreground hover:bg-muted transition-colors rounded-sm" }),
						/* @__PURE__ */ jsxs(Sheet, {
							open,
							onOpenChange: setOpen,
							children: [/* @__PURE__ */ jsx(SheetTrigger, {
								asChild: true,
								children: /* @__PURE__ */ jsx("button", {
									type: "button",
									"aria-label": "Open navigation",
									className: "grid h-7 w-7 place-items-center text-foreground md:hidden rounded-sm hover:bg-muted transition-colors",
									children: /* @__PURE__ */ jsx(Menu, { className: "h-4 w-4" })
								})
							}), /* @__PURE__ */ jsx(SheetContent, {
								side: "right",
								className: "w-72 bg-background p-0 flex flex-col h-full",
								children: /* @__PURE__ */ jsxs("div", {
									className: "flex flex-col h-full overflow-y-auto pb-8",
									children: [
										/* @__PURE__ */ jsxs(SheetHeader, {
											className: "border-b border-border px-5 py-4 text-left",
											children: [/* @__PURE__ */ jsxs(SheetTitle, {
												className: "text-2xl uppercase tracking-wider font-extrabold",
												style: {
													fontFamily: "\"Inter\", system-ui, sans-serif",
													fontWeight: 800,
													letterSpacing: "0.05em"
												},
												children: [
													/* @__PURE__ */ jsx("span", {
														style: settings.logoColorPrimary ? { color: settings.logoColorPrimary } : void 0,
														className: !settings.logoColorPrimary || settings.logoColorPrimary === "#000000" ? "text-foreground dark:text-white" : "",
														children: settings.logoTextPrimary !== void 0 && settings.logoTextPrimary !== "" ? settings.logoTextPrimary : settings.logoText ? settings.logoText.split(" ")[0] : "NEWS"
													}),
													" ",
													/* @__PURE__ */ jsx("span", {
														style: { color: settings.logoColorSecondary || "#dc2626" },
														children: settings.logoTextSecondary !== void 0 && settings.logoTextSecondary !== "" ? settings.logoTextSecondary : settings.logoText && settings.logoText.split(" ").length > 1 ? settings.logoText.split(" ").slice(1).join(" ") : "THEME"
													})
												]
											}), /* @__PURE__ */ jsx("p", {
												className: "text-[10px] uppercase tracking-[0.25em] text-muted-foreground truncate",
												children: settings.tagline || t("nav.navigation")
											})]
										}),
										/* @__PURE__ */ jsxs("form", {
											onSubmit: (e) => {
												e.preventDefault();
												const fd = new FormData(e.currentTarget);
												const q = String(fd.get("q") || "").trim();
												if (q) {
													navigate({
														to: "/search",
														search: {
															q,
															page: 1
														}
													});
													setOpen(false);
												}
											},
											className: "relative border-b border-border px-5 py-3",
											children: [/* @__PURE__ */ jsx(Search, { className: "pointer-events-none absolute left-7 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ jsx("input", {
												name: "q",
												type: "search",
												placeholder: t("nav.search"),
												className: "w-full border border-border bg-background py-2 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-foreground"
											})]
										}),
										/* @__PURE__ */ jsx("nav", { children: /* @__PURE__ */ jsxs("ul", {
											className: "flex flex-col divide-y divide-border",
											children: [/* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsxs(Link, {
												to: "/",
												onClick: () => setOpen(false),
												className: "flex items-center gap-3 px-5 py-4 text-sm font-semibold uppercase tracking-wider text-foreground hover:bg-muted/40 hover:underline",
												children: [/* @__PURE__ */ jsx(Home, { className: "h-4 w-4" }), t("nav.home")]
											}) }), allItems.map((s) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(Link, {
												to: "/$slug",
												params: { slug: slugify$1(s) },
												onClick: () => setOpen(false),
												className: "block px-5 py-4 text-sm font-semibold uppercase tracking-wider text-foreground hover:bg-muted/40 hover:underline",
												children: s
											}) }, s))]
										}) }),
										/* @__PURE__ */ jsxs("div", {
											className: "mt-4 flex flex-col gap-3 border-t border-border px-5 py-4 text-xs uppercase tracking-widest text-muted-foreground",
											children: [
												/* @__PURE__ */ jsxs("div", {
													className: "flex items-center justify-between",
													children: [/* @__PURE__ */ jsx("span", { children: t("nav.nightMode") }), /* @__PURE__ */ jsx(ThemeToggle, {})]
												}),
												/* @__PURE__ */ jsx(UserMenu, { variant: "mobile" }),
												/* @__PURE__ */ jsx(Link, {
													to: "/subscription",
													className: "hover:text-foreground",
													onClick: () => setOpen(false),
													children: t("nav.subscribe")
												})
											]
										})
									]
								})
							})]
						})
					]
				})
			]
		})
	});
}
//#endregion
//#region src/components/site/Masthead.tsx
var slugify = (s) => s.toLowerCase().replace(/\s+/g, "-");
var otherCategories = [
	"Entertainment",
	"Health",
	"Education",
	"Jobs",
	"Travel",
	"Lifestyle"
];
function Masthead() {
	const s = useSiteSettings();
	const dbCats = useCategories();
	let navItems = sections;
	let dropdownItems = otherCategories;
	if (dbCats.length > 0) {
		const explicitHeaderCats = dbCats.filter((c) => c.showInHeader).map((c) => c.name);
		const dropdownCats = dbCats.filter((c) => !c.showInHeader).map((c) => c.name);
		if (explicitHeaderCats.length > 0) {
			navItems = explicitHeaderCats;
			if (dropdownCats.length > 0) {
				navItems = [...navItems, "Others"];
				dropdownItems = dropdownCats;
			} else dropdownItems = [];
		} else {
			const allCatNames = dbCats.map((c) => c.name);
			if (allCatNames.length <= 9) {
				navItems = allCatNames;
				dropdownItems = [];
			} else {
				navItems = [...allCatNames.slice(0, 8), "Others"];
				dropdownItems = allCatNames.slice(8);
			}
		}
	}
	const hasLogo = !!(s.logoLight || s.logoDark);
	const showLogo = hasLogo;
	const showText = !hasLogo;
	return /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx("header", {
		className: "border-b border-border",
		children: /* @__PURE__ */ jsxs("div", {
			className: "mx-auto max-w-7xl px-4 py-5 text-center md:py-6",
			children: [/* @__PURE__ */ jsxs(Link, {
				to: "/",
				className: "block",
				children: [
					showLogo && s.logoLight && /* @__PURE__ */ jsx("img", {
						src: s.logoLight,
						alt: s.logoText || "Logo",
						className: `mx-auto h-16 object-contain ${s.logoDark ? "dark:hidden" : ""} ${showText ? "mb-2" : ""}`
					}),
					showLogo && s.logoDark && /* @__PURE__ */ jsx("img", {
						src: s.logoDark,
						alt: s.logoText || "Logo",
						className: `mx-auto h-16 object-contain ${s.logoLight ? "hidden dark:block" : ""} ${showText ? "mb-2" : ""}`
					}),
					showText && /* @__PURE__ */ jsxs("h1", {
						className: "leading-none text-3xl sm:text-5xl md:text-6xl lg:text-7xl uppercase",
						style: {
							fontFamily: "\"Inter\", system-ui, sans-serif",
							fontWeight: 800,
							letterSpacing: "0.05em"
						},
						children: [
							/* @__PURE__ */ jsx("span", {
								style: s.logoColorPrimary ? { color: s.logoColorPrimary } : void 0,
								className: !s.logoColorPrimary || s.logoColorPrimary === "#000000" ? "text-foreground dark:text-white" : "",
								children: s.logoTextPrimary !== void 0 && s.logoTextPrimary !== "" ? s.logoTextPrimary : s.logoText ? s.logoText.split(" ")[0] : "NEWS"
							}),
							" ",
							/* @__PURE__ */ jsx("span", {
								style: { color: s.logoColorSecondary || "#dc2626" },
								children: s.logoTextSecondary !== void 0 && s.logoTextSecondary !== "" ? s.logoTextSecondary : s.logoText && s.logoText.split(" ").length > 1 ? s.logoText.split(" ").slice(1).join(" ") : "THEME"
							})
						]
					})
				]
			}), /* @__PURE__ */ jsx("p", {
				className: "mt-2.5 sm:mt-3 block text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.18em] sm:tracking-[0.25em] md:tracking-[0.35em] text-muted-foreground",
				children: s.tagline ? /* @__PURE__ */ jsx("span", {
					className: "break-words",
					children: s.tagline
				}) : /* @__PURE__ */ jsxs("span", {
					className: "inline-flex flex-wrap items-center justify-center gap-x-1.5 sm:gap-x-2",
					children: [
						/* @__PURE__ */ jsx("span", {
							style: { color: "#2563eb" },
							children: "Breaking News"
						}),
						/* @__PURE__ */ jsx("span", {
							className: "text-muted-foreground",
							children: "•"
						}),
						/* @__PURE__ */ jsx("span", {
							style: { color: "#dc2626" },
							children: "Finance"
						}),
						/* @__PURE__ */ jsx("span", {
							className: "text-muted-foreground",
							children: "•"
						}),
						/* @__PURE__ */ jsx("span", {
							style: { color: "#16a34a" },
							children: "Business"
						}),
						/* @__PURE__ */ jsx("span", {
							className: "text-muted-foreground",
							children: "•"
						}),
						/* @__PURE__ */ jsx("span", {
							style: { color: "#ea580c" },
							children: "Market"
						})
					]
				})
			})]
		})
	}), /* @__PURE__ */ jsx("nav", {
		className: "hidden border-t border-border md:block md:sticky md:top-11 md:z-30 md:bg-background/90 md:backdrop-blur-md md:border-b h-11",
		children: /* @__PURE__ */ jsx("div", {
			className: "mx-auto flex h-full max-w-7xl items-center justify-between gap-4 px-4",
			children: /* @__PURE__ */ jsxs("div", {
				className: "flex flex-1 flex-wrap items-center justify-center gap-1 text-sm font-semibold uppercase tracking-wider",
				children: [/* @__PURE__ */ jsx(Link, {
					to: "/",
					"aria-label": "Home",
					className: "flex items-center whitespace-nowrap px-3 py-1 transition-colors hover:underline",
					children: /* @__PURE__ */ jsx(Home, { className: "h-4 w-4" })
				}), navItems.map((s) => s === "Others" ? /* @__PURE__ */ jsxs("div", {
					className: "group relative",
					children: [/* @__PURE__ */ jsxs("button", {
						className: "flex items-center gap-1 whitespace-nowrap px-3 py-1 uppercase transition-colors hover:underline",
						children: [s, /* @__PURE__ */ jsx(ChevronDown, { className: "h-3.5 w-3.5" })]
					}), /* @__PURE__ */ jsx("div", {
						className: "invisible absolute left-1/2 z-50 mt-0 w-48 -translate-x-1/2 border border-border bg-background py-2 opacity-0 shadow-lg transition-all group-hover:visible group-hover:opacity-100",
						children: dropdownItems.map((c) => /* @__PURE__ */ jsx(Link, {
							to: "/$slug",
							params: { slug: slugify(c) },
							className: "block px-4 py-2 text-left text-xs font-semibold uppercase tracking-wider text-foreground hover:bg-muted",
							children: c
						}, c))
					})]
				}, s) : /* @__PURE__ */ jsx(Link, {
					to: "/$slug",
					params: { slug: slugify(s) },
					className: "whitespace-nowrap px-3 py-1 transition-colors hover:underline",
					children: s
				}, s))]
			})
		})
	})] });
}
//#endregion
//#region src/components/site/Ticker.tsx
function Ticker() {
	const row = /* @__PURE__ */ jsx("div", {
		className: "flex shrink-0 items-center gap-8 px-6",
		children: tickers.map((t) => /* @__PURE__ */ jsxs("div", {
			className: "flex items-center gap-2 font-mono text-xs",
			children: [
				/* @__PURE__ */ jsx("span", {
					className: "font-semibold tracking-wide text-foreground",
					children: t.sym
				}),
				/* @__PURE__ */ jsx("span", {
					className: "text-muted-foreground",
					children: t.val
				}),
				/* @__PURE__ */ jsxs("span", {
					className: t.up ? "text-[#16a34a]" : "text-[#dc2626]",
					children: [
						t.up ? "▲" : "▼",
						" ",
						t.chg
					]
				})
			]
		}, t.sym))
	});
	return /* @__PURE__ */ jsx("div", {
		className: "overflow-hidden border-y border-border bg-card/60 py-2 md:sticky md:top-[88px] md:z-20 md:bg-background/90 md:backdrop-blur-md",
		children: /* @__PURE__ */ jsxs("div", {
			className: "flex ticker-scroll w-max",
			children: [row, row]
		})
	});
}
//#endregion
//#region src/components/site/BreakingBar.tsx
function BreakingBar() {
	const { data: articles = [] } = useQuery({
		queryKey: ["homepageArticles"],
		queryFn: () => getHomepageArticles({ data: 10 })
	});
	const headlines = articles.length > 0 ? articles.map((a) => `${a.category ? `${a.category}: ` : ""}${a.title}`) : ["Welcome to News Theme — Stay tuned for breaking news updates."];
	const [i, setI] = useState(0);
	useEffect(() => {
		if (headlines.length <= 1) {
			setI(0);
			return;
		}
		const id = setInterval(() => setI((p) => (p + 1) % headlines.length), 5e3);
		return () => clearInterval(id);
	}, [headlines.length]);
	return /* @__PURE__ */ jsx("div", {
		className: "border-b border-border bg-foreground text-background",
		children: /* @__PURE__ */ jsxs("div", {
			className: "mx-auto flex max-w-7xl items-center gap-3 px-4 py-2 text-sm",
			children: [/* @__PURE__ */ jsx("span", {
				className: "bg-[#dc2626] px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-white shrink-0",
				children: "Live"
			}), /* @__PURE__ */ jsx("div", {
				className: "relative flex-1 overflow-hidden h-5",
				children: /* @__PURE__ */ jsx("span", {
					className: "absolute inset-0 truncate headline-slide",
					children: headlines[i]
				}, i)
			})]
		})
	});
}
//#endregion
//#region src/components/site/Header.tsx
function Header({ showTopBar = true, showTicker, showBreakingBar }) {
	const cfg = useHomepageConfig();
	const isTickerVisible = showTicker !== void 0 ? showTicker : cfg.showTicker ?? true;
	const isBreakingVisible = showBreakingBar !== void 0 ? showBreakingBar : cfg.showBreakingBar ?? true;
	return /* @__PURE__ */ jsxs(Fragment, { children: [
		showTopBar && /* @__PURE__ */ jsx(TopBar, {}),
		/* @__PURE__ */ jsx(Masthead, {}),
		isTickerVisible && /* @__PURE__ */ jsx(Ticker, {}),
		isBreakingVisible && /* @__PURE__ */ jsx(BreakingBar, {})
	] });
}
//#endregion
export { ThemeProvider as n, themeInitScript as r, Header as t };
