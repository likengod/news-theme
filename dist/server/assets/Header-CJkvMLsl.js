import { r as createServerFn } from "./esm-B50dUWcE.js";
import { t as createSsrRpc } from "./createSsrRpc-DmY6DBZ4.js";
import { n as defaultSettings, o as loadSettings } from "./site-settings-u9lqTwkv.js";
import { u as getHomepageArticles } from "./articles.functions-DleKxj8P.js";
import { a as useSiteSettings, r as useCategories } from "./AdSettingsContext-wwqoD86f.js";
import { a as sections, o as slugify, s as tickers } from "./news-data-BCdeOjjW.js";
import { o as getTopTags } from "./taxonomy.functions-B_JCt_5x.js";
import { t as useHomepageConfig } from "./use-homepage-config-BurtHINi.js";
import { t as useTranslation } from "./i18n-BIRFVgA2.js";
import { r as useTheme } from "./theme-3HUYOunA.js";
import { n as getAccessibleLogoColor } from "./color-utils-4ZE3UgVW.js";
import { t as cn } from "./utils-C_uf36nf.js";
import * as React$1 from "react";
import { Suspense, lazy, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { ArrowRight, ChevronDown, FileText, Folder, Globe, Hash, Home, Menu, Moon, Newspaper, Search, Sun, X } from "lucide-react";
import { cva } from "class-variance-authority";
import { useQuery } from "@tanstack/react-query";
import * as SheetPrimitive from "@radix-ui/react-dialog";
import { createPortal } from "react-dom";
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
//#region src/lib/search.functions.ts
/**
* Filter and resolve permitted pages respecting current site settings and license level.
*/
/**
* Unified Public Search: Queries Articles, Categories, and Pages simultaneously.
* Completely respects license and feature access rules.
*/
var searchUnifiedPublic = createServerFn({ method: "GET" }).validator((data) => data).handler(createSsrRpc("d488038ced2e73b8f6cd9e5f3ea1b54a60b9ea67015257a80b813215d13ee50a"));
/**
* Lightweight quick search suggestions for the Search Modal autocomplete.
* Returns up to 3 articles, 3 categories, and 3 pages with license enforcement.
*/
var getQuickSearchPreview = createServerFn({ method: "GET" }).validator((data) => data).handler(createSsrRpc("99fd2ba85784973fe0dd16ad799222be69351f8453511656d1545a65df4b8e79"));
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
	const [preview, setPreview] = useState(null);
	const [isSearching, setIsSearching] = useState(false);
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
	useEffect(() => {
		const trimmed = q.trim();
		if (!trimmed || trimmed.length < 2) {
			setPreview(null);
			setIsSearching(false);
			return;
		}
		setIsSearching(true);
		const timer = setTimeout(() => {
			getQuickSearchPreview({ data: { q: trimmed } }).then((res) => {
				if (res) setPreview(res);
			}).catch(() => {
				setPreview(null);
			}).finally(() => {
				setIsSearching(false);
			});
		}, 200);
		return () => clearTimeout(timer);
	}, [q]);
	const go = (term) => {
		if (!term.trim()) return;
		navigate({
			to: "/search",
			search: {
				q: term.trim(),
				page: 1,
				tab: "all"
			}
		});
		onClose();
	};
	const submit = (e) => {
		e.preventDefault();
		go(q);
	};
	if (!open || !mounted) return null;
	const hasPreviewResults = preview && (preview.categories.length > 0 || preview.pages.length > 0 || preview.articles.length > 0);
	return createPortal(/* @__PURE__ */ jsxs("div", {
		className: "fixed inset-0 z-[999999] h-screen w-screen flex flex-col items-center justify-center bg-white text-black px-4 transition-all duration-200 animate-in fade-in overflow-y-auto",
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
			className: "w-full max-w-[580px] text-left my-auto py-10",
			children: [
				/* @__PURE__ */ jsxs("form", {
					onSubmit: submit,
					className: "relative w-full",
					children: [/* @__PURE__ */ jsx("input", {
						ref: inputRef,
						id: "site-search-modal-query",
						name: "q",
						type: "search",
						"aria-label": "Search articles",
						value: q,
						onChange: (e) => setQ(e.target.value),
						placeholder: "Type & hit enter to search…",
						className: "w-full bg-[#ececec] text-[#222222] placeholder:text-[#666666] text-[16px] sm:text-[17px] font-sans px-5 py-3.5 pr-12 border-0 rounded-none focus:outline-none focus:ring-0 shadow-none appearance-none"
					}), /* @__PURE__ */ jsx("button", {
						type: "submit",
						"aria-label": "Search",
						className: "absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-[#333333] hover:text-black transition-colors",
						children: /* @__PURE__ */ jsx(Search, { className: "h-4 w-4 stroke-[2]" })
					})]
				}),
				hasPreviewResults && /* @__PURE__ */ jsxs("div", {
					className: "mt-3 bg-[#f8f8f8] border border-[#e5e5e5] p-3 text-sm divide-y divide-[#eeeeee] animate-in fade-in-50 duration-150",
					children: [
						preview.categories.length > 0 && /* @__PURE__ */ jsxs("div", {
							className: "pb-2.5",
							children: [/* @__PURE__ */ jsxs("p", {
								className: "text-[10px] font-bold uppercase tracking-wider text-[#777777] mb-1.5 flex items-center gap-1",
								children: [/* @__PURE__ */ jsx(Folder, { className: "h-3 w-3" }), /* @__PURE__ */ jsx("span", { children: "Categories" })]
							}), /* @__PURE__ */ jsx("div", {
								className: "flex flex-wrap gap-1.5",
								children: preview.categories.map((c) => /* @__PURE__ */ jsxs("button", {
									type: "button",
									onClick: () => {
										navigate({
											to: "/$slug",
											params: { slug: c.slug }
										});
										onClose();
									},
									className: "inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold bg-white border border-[#dddddd] text-[#222222] hover:bg-black hover:text-white transition-colors",
									children: [
										/* @__PURE__ */ jsx(Hash, { className: "h-3 w-3 opacity-60" }),
										/* @__PURE__ */ jsx("span", { children: c.name }),
										c.count > 0 && /* @__PURE__ */ jsxs("span", {
											className: "text-[10px] opacity-70",
											children: [
												"(",
												c.count,
												")"
											]
										})
									]
								}, c.slug))
							})]
						}),
						preview.pages.length > 0 && /* @__PURE__ */ jsxs("div", {
							className: "py-2.5",
							children: [/* @__PURE__ */ jsxs("p", {
								className: "text-[10px] font-bold uppercase tracking-wider text-[#777777] mb-1.5 flex items-center gap-1",
								children: [/* @__PURE__ */ jsx(FileText, { className: "h-3 w-3" }), /* @__PURE__ */ jsx("span", { children: "Pages & Desks" })]
							}), /* @__PURE__ */ jsx("div", {
								className: "space-y-1",
								children: preview.pages.map((p) => /* @__PURE__ */ jsxs("button", {
									type: "button",
									onClick: () => {
										navigate({ to: p.url });
										onClose();
									},
									className: "w-full flex items-center justify-between px-2 py-1.5 text-xs text-left text-[#222222] hover:bg-white transition-colors",
									children: [/* @__PURE__ */ jsx("span", {
										className: "font-semibold truncate",
										children: p.title
									}), /* @__PURE__ */ jsx("span", {
										className: "text-[10px] uppercase font-bold text-[#666666] bg-[#eeeeee] px-1.5 py-0.5 ml-2 shrink-0",
										children: p.badge
									})]
								}, p.url))
							})]
						}),
						preview.articles.length > 0 && /* @__PURE__ */ jsxs("div", {
							className: "pt-2.5",
							children: [/* @__PURE__ */ jsxs("p", {
								className: "text-[10px] font-bold uppercase tracking-wider text-[#777777] mb-1.5 flex items-center gap-1",
								children: [/* @__PURE__ */ jsx(Newspaper, { className: "h-3 w-3" }), /* @__PURE__ */ jsx("span", { children: "Stories" })]
							}), /* @__PURE__ */ jsx("div", {
								className: "space-y-1",
								children: preview.articles.map((a) => /* @__PURE__ */ jsxs("button", {
									type: "button",
									onClick: () => {
										navigate({
											to: "/news/$slug",
											params: { slug: a.slug }
										});
										onClose();
									},
									className: "w-full flex items-center justify-between px-2 py-1.5 text-xs text-left text-[#222222] hover:bg-white transition-colors group",
									children: [/* @__PURE__ */ jsx("span", {
										className: "font-serif font-medium line-clamp-1 group-hover:underline",
										children: a.title
									}), /* @__PURE__ */ jsx("span", {
										className: "text-[10px] text-[#888888] ml-2 shrink-0",
										children: a.category
									})]
								}, a.id))
							})]
						}),
						/* @__PURE__ */ jsx("div", {
							className: "pt-2 text-right",
							children: /* @__PURE__ */ jsxs("button", {
								type: "button",
								onClick: () => go(q),
								className: "text-[11px] font-bold uppercase tracking-wider text-black hover:underline inline-flex items-center gap-1",
								children: [/* @__PURE__ */ jsx("span", { children: "View all search results" }), /* @__PURE__ */ jsx(ArrowRight, { className: "h-3 w-3" })]
							})
						})
					]
				}),
				!hasPreviewResults && /* @__PURE__ */ jsxs("div", {
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
				})
			]
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
	}), open && /* @__PURE__ */ jsx(SearchModal, {
		open,
		onClose: () => setOpen(false)
	})] });
}
//#endregion
//#region src/components/site/LanguageSwitcher.tsx
function LanguageSwitcher() {
	const { i18n } = useTranslation();
	const [open, setOpen] = useState(false);
	const containerRef = useRef(null);
	const loadGoogleTranslate = () => {
		if (typeof window === "undefined" || document.getElementById("google-translate-script")) return;
		window.googleTranslateElementInit = () => {
			if (window.google && window.google.translate) try {
				new window.google.translate.TranslateElement({
					pageLanguage: "en",
					includedLanguages: "hi,bn,en",
					layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
					autoDisplay: false
				}, "google_translate_element");
			} catch {}
		};
		const script = document.createElement("script");
		script.id = "google-translate-script";
		script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
		script.async = true;
		document.body.appendChild(script);
	};
	useEffect(() => {
		if (typeof document !== "undefined" && document.cookie.includes("googtrans=")) loadGoogleTranslate();
	}, []);
	useEffect(() => {
		if (!open) return;
		const handleClickOutside = (e) => {
			if (containerRef.current && !containerRef.current.contains(e.target)) setOpen(false);
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, [open]);
	const changeLanguage = (lng) => {
		i18n.changeLanguage(lng);
		setOpen(false);
		if (lng === "en") {
			document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
			document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=" + location.hostname;
			window.location.reload();
			return;
		}
		loadGoogleTranslate();
		const applyLng = () => {
			const select = document.querySelector(".goog-te-combo");
			if (select) {
				select.value = lng;
				select.dispatchEvent(new Event("change"));
			} else setTimeout(applyLng, 300);
		};
		applyLng();
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
		/* @__PURE__ */ jsxs("div", {
			className: "relative inline-block",
			ref: containerRef,
			children: [/* @__PURE__ */ jsx("button", {
				type: "button",
				onClick: () => {
					if (!open) loadGoogleTranslate();
					setOpen((v) => !v);
				},
				"aria-expanded": open,
				"aria-haspopup": "true",
				className: "grid h-7 w-7 place-items-center border border-border text-foreground hover:bg-muted transition-colors focus:outline-none",
				title: "Select Language",
				children: /* @__PURE__ */ jsx(Globe, { className: "h-4 w-4" })
			}), open && /* @__PURE__ */ jsx("div", {
				className: "absolute right-0 top-full mt-1 w-32 rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-lg z-50",
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
				].map((lng) => /* @__PURE__ */ jsx("button", {
					type: "button",
					onClick: () => changeLanguage(lng.code),
					className: `w-full text-left px-2 py-1.5 text-xs rounded-sm hover:bg-muted transition-colors cursor-pointer ${i18n.language === lng.code ? "bg-muted font-bold text-foreground" : "text-muted-foreground"}`,
					children: lng.label
				}, lng.code))
			})]
		})
	] });
}
//#endregion
//#region src/components/site/TopBar.tsx
var UserMenu = lazy(() => import("./UserMenu-2qMu_XjI.js").then((m) => ({ default: m.UserMenu })));
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
	diwali: "linear-gradient(to right, #FF8008, #FFC837, #FF007F, #7F00FF)",
	sunset: "linear-gradient(to right, #F5576C, #F093FB)",
	neon: "linear-gradient(to right, #FF007F, #7F00FF, #00F0FF)",
	ocean: "linear-gradient(to right, #00c6ff, #0072ff)",
	forest: "linear-gradient(to right, #11998e, #38ef7d)"
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
	const { theme } = useTheme();
	const isDark = theme === "dark" || theme === "system" && typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches;
	const [open, setOpen] = useState(false);
	const [settings, setSettings] = useState(defaultSettings);
	const [mounted, setMounted] = useState(false);
	const [showCustom, setShowCustom] = useState(false);
	const [localAqi, setLocalAqi] = useState("AGT 58 AQI");
	const navigate = useNavigate();
	const dbCats = useCategories();
	const allItems = dbCats.length > 0 ? [...dbCats].sort((a, b) => (a?.sortOrder || 0) - (b?.sortOrder || 0)).map((c) => ({
		name: String(c?.name || ""),
		slug: String(c?.slug || slugify(c?.name || "")),
		redirectUrl: c?.redirectUrl || null
	})) : sections.filter((s) => s !== "Others").concat(otherCategories$1).map((s) => ({
		name: String(s),
		slug: slugify(s),
		redirectUrl: null
	}));
	useEffect(() => {
		setSettings(loadSettings());
		setMounted(true);
		try {
			const cached = sessionStorage.getItem("nt:cached-aqi");
			if (cached) setLocalAqi(cached);
		} catch {}
		const handleUpdate = () => {
			setSettings(loadSettings());
		};
		window.addEventListener("nt:settings-updated", handleUpdate);
		return () => {
			window.removeEventListener("nt:settings-updated", handleUpdate);
		};
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
	const hasCustomRight = mounted && settings.festiveThemeEnabled !== false && (!!settings.topBarWeatherCustomText || !!settings.festiveAlertImage);
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
		className: "relative z-20 h-11 border-b border-border bg-background transition-colors duration-300",
		style: {
			backgroundColor: mounted && settings.topBarBgColor || void 0,
			borderColor: mounted && settings.topBarBgColor ? "transparent" : void 0
		},
		children: /* @__PURE__ */ jsxs("div", {
			className: `mx-auto flex h-full max-w-7xl items-center justify-between gap-2 px-4 text-[11px] font-medium uppercase tracking-widest ${mounted && settings.topBarTextColor ? "" : "text-foreground"}`,
			style: { color: mounted && settings.topBarTextColor || void 0 },
			children: [
				/* @__PURE__ */ jsx("div", {
					className: "flex-1 min-w-0",
					children: /* @__PURE__ */ jsxs("span", {
						className: "truncate",
						children: [/* @__PURE__ */ jsx("span", {
							className: "hidden sm:inline",
							children: mounted ? today : ""
						}), /* @__PURE__ */ jsx("span", {
							className: "sm:hidden",
							children: mounted ? todayShort : ""
						})]
					})
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "relative hidden h-4 flex-1 min-w-0 overflow-hidden md:block",
					children: [/* @__PURE__ */ jsxs("div", {
						className: `absolute inset-y-0 left-0 flex items-center gap-4 transition-[transform,opacity] duration-500 will-change-transform ${showCustom && hasCustomRight ? "-translate-y-full opacity-0" : "translate-y-0 opacity-100"}`,
						children: [
							/* @__PURE__ */ jsx("span", { children: localAqi }),
							/* @__PURE__ */ jsx("span", { children: "MUM 82 AQI" }),
							/* @__PURE__ */ jsx("span", { children: "KOL 145 AQI" })
						]
					}), hasCustomRight && /* @__PURE__ */ jsx("span", {
						className: `absolute inset-y-0 left-0 flex items-center font-bold transition-[transform,opacity] duration-500 will-change-transform ${showCustom ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"}`,
						style: {
							fontFamily: FONT_FAMILY_MAP[settings.customAlertFontFamily || "inter"] || FONT_FAMILY_MAP["inter"],
							fontSize: settings.customAlertFontSize ? `${settings.customAlertFontSize}px` : void 0
						},
						children: settings.festiveAlertImage ? /* @__PURE__ */ jsx("img", {
							src: settings.festiveAlertImage,
							alt: "Alert",
							className: "h-4.5 w-auto max-w-[80px] object-contain shrink-0 align-middle"
						}) : /* @__PURE__ */ jsx("span", {
							style: gradientStyle,
							children: settings.topBarWeatherCustomText
						})
					})]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "flex shrink-0 items-center gap-2 sm:gap-3",
					children: [
						/* @__PURE__ */ jsx(LanguageSwitcher, {}),
						/* @__PURE__ */ jsx(Link, {
							to: "/subscription",
							className: "hidden text-foreground hover:underline sm:inline",
							children: t("nav.subscribe")
						}),
						/* @__PURE__ */ jsx("span", {
							"aria-hidden": "true",
							className: "hidden text-muted-foreground/40 sm:inline select-none",
							children: "|"
						}),
						/* @__PURE__ */ jsx(Suspense, {
							fallback: /* @__PURE__ */ jsx("div", { className: "h-7 w-7" }),
							children: /* @__PURE__ */ jsx(UserMenu, {})
						}),
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
													fontFamily: "var(--font-headlines, \"Inter\", system-ui, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, sans-serif)",
													fontWeight: 800,
													letterSpacing: "0.05em"
												},
												children: [
													/* @__PURE__ */ jsx("span", {
														style: settings.logoColorPrimary ? { color: settings.logoColorPrimary } : void 0,
														className: !settings.logoColorPrimary || settings.logoColorPrimary === "#000000" ? "text-foreground dark:text-white" : "",
														children: settings.logoTextPrimary !== void 0 && settings.logoTextPrimary !== "" ? settings.logoTextPrimary : (settings.logoText || "").trim().split(/\s+/).filter(Boolean)[0] || (settings.siteName || "").trim().split(/\s+/).filter(Boolean)[0] || "Today"
													}),
													" ",
													/* @__PURE__ */ jsx("span", {
														style: { color: getAccessibleLogoColor(settings.logoColorSecondary || "#dc2626", isDark, 4.5) },
														children: settings.logoTextSecondary !== void 0 && settings.logoTextSecondary !== "" ? settings.logoTextSecondary : (settings.logoText || "").trim().split(/\s+/).filter(Boolean).length > 1 ? (settings.logoText || "").trim().split(/\s+/).filter(Boolean).slice(1).join(" ") : (settings.siteName || "").trim().split(/\s+/).filter(Boolean).length > 1 ? (settings.siteName || "").trim().split(/\s+/).filter(Boolean).slice(1).join(" ") : ""
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
												id: "mobile-drawer-search",
												name: "q",
												type: "search",
												"aria-label": t("nav.search") || "Search",
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
											}) }), allItems.map((item) => /* @__PURE__ */ jsx("li", { children: item.redirectUrl ? /* @__PURE__ */ jsx("a", {
												href: item.redirectUrl,
												target: item.redirectUrl.startsWith("http") ? "_blank" : void 0,
												rel: item.redirectUrl.startsWith("http") ? "noopener noreferrer" : void 0,
												onClick: () => setOpen(false),
												className: "block px-5 py-4 text-sm font-semibold uppercase tracking-wider text-foreground hover:bg-muted/40 hover:underline",
												children: item.name
											}) : /* @__PURE__ */ jsx(Link, {
												to: "/$slug",
												params: { slug: item.slug },
												onClick: () => setOpen(false),
												className: "block px-5 py-4 text-sm font-semibold uppercase tracking-wider text-foreground hover:bg-muted/40 hover:underline",
												children: item.name
											}) }, item.slug))]
										}) }),
										/* @__PURE__ */ jsxs("div", {
											className: "mt-4 flex flex-col gap-3 border-t border-border px-5 py-4 text-xs uppercase tracking-widest text-muted-foreground",
											children: [
												/* @__PURE__ */ jsxs("div", {
													className: "flex items-center justify-between",
													children: [/* @__PURE__ */ jsx("span", { children: t("nav.nightMode") }), /* @__PURE__ */ jsx(ThemeToggle, {})]
												}),
												/* @__PURE__ */ jsx(Suspense, {
													fallback: null,
													children: /* @__PURE__ */ jsx(UserMenu, { variant: "mobile" })
												}),
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
	const { theme } = useTheme();
	const isDark = theme === "dark";
	const safePrimaryColor = s.logoColorPrimary ? getAccessibleLogoColor(s.logoColorPrimary, isDark, 4.5) : void 0;
	const safeSecondaryColor = getAccessibleLogoColor(s.logoColorSecondary || "#dc2626", isDark, 4.5);
	let navItems = sections.map((sec) => ({
		name: sec,
		slug: slugify(sec)
	}));
	let dropdownItems = otherCategories.map((c) => ({
		name: c,
		slug: slugify(c)
	}));
	if (dbCats.length > 0) {
		const explicitHeaderCats = dbCats.filter((c) => c && c.showInHeader).sort((a, b) => (a?.sortOrder || 0) - (b?.sortOrder || 0)).map((c) => ({
			name: String(c?.name || ""),
			slug: String(c?.slug || slugify(c?.name || "")),
			redirectUrl: c?.redirectUrl || null
		}));
		const dropdownCats = dbCats.filter((c) => c && !c.showInHeader).sort((a, b) => (a?.sortOrder || 0) - (b?.sortOrder || 0)).map((c) => ({
			name: String(c?.name || ""),
			slug: String(c?.slug || slugify(c?.name || "")),
			redirectUrl: c?.redirectUrl || null
		}));
		if (explicitHeaderCats.length > 0) {
			navItems = explicitHeaderCats;
			if (dropdownCats.length > 0) {
				navItems = [...navItems, {
					name: "Others",
					slug: "others"
				}];
				dropdownItems = dropdownCats;
			} else dropdownItems = [];
		} else {
			const allMapped = [...dbCats].sort((a, b) => (a?.sortOrder || 0) - (b?.sortOrder || 0)).map((c) => ({
				name: String(c?.name || ""),
				slug: String(c?.slug || slugify(c?.name || "")),
				redirectUrl: c?.redirectUrl || null
			}));
			if (allMapped.length <= 11) {
				navItems = allMapped;
				dropdownItems = [];
			} else {
				navItems = [...allMapped.slice(0, 10), {
					name: "Others",
					slug: "others"
				}];
				dropdownItems = allMapped.slice(10);
			}
		}
	}
	const [logoFailed, setLogoFailed] = useState(false);
	const hasLogo = !logoFailed && !!(s.logoLight || s.logoDark);
	const mode = s.logoDisplayMode || (hasLogo ? "both" : "text_only");
	const isFitScreen = !!s.logoFitScreen || mode === "logo_fit";
	const showLogo = hasLogo && (mode === "logo_only" || mode === "both" || mode === "both_stacked" || mode === "logo_fit");
	const showText = !hasLogo || logoFailed || mode === "text_only" || mode === "both" || mode === "both_stacked";
	const isSideBySide = mode === "both" && showLogo && showText;
	const siteWords = (s.siteName || "").trim().split(/\s+/).filter(Boolean);
	const logoWords = (s.logoText || "").trim().split(/\s+/).filter(Boolean);
	const primaryWord = s.logoTextPrimary !== void 0 && s.logoTextPrimary !== "" ? s.logoTextPrimary : logoWords[0] || siteWords[0] || "Today";
	const secondaryWord = s.logoTextSecondary !== void 0 && s.logoTextSecondary !== "" ? s.logoTextSecondary : logoWords.length > 1 ? logoWords.slice(1).join(" ") : siteWords.length > 1 ? siteWords.slice(1).join(" ") : "";
	const taglineContent = s.tagline ? /* @__PURE__ */ jsx("span", {
		className: "break-words text-center inline-block",
		children: s.tagline
	}) : /* @__PURE__ */ jsxs("span", {
		className: "inline-flex flex-wrap items-center justify-center gap-x-1.5 sm:gap-x-2",
		children: [
			/* @__PURE__ */ jsx("span", {
				className: "text-[#1d4ed8] dark:text-blue-400",
				children: "Breaking News"
			}),
			/* @__PURE__ */ jsx("span", {
				className: "text-muted-foreground",
				children: "•"
			}),
			/* @__PURE__ */ jsx("span", {
				className: "text-[#b91c1c] dark:text-red-400",
				children: "Finance"
			}),
			/* @__PURE__ */ jsx("span", {
				className: "text-muted-foreground",
				children: "•"
			}),
			/* @__PURE__ */ jsx("span", {
				className: "text-[#15803d] dark:text-emerald-400",
				children: "Business"
			}),
			/* @__PURE__ */ jsx("span", {
				className: "text-muted-foreground",
				children: "•"
			}),
			/* @__PURE__ */ jsx("span", {
				className: "text-[#c2410c] dark:text-orange-400",
				children: "Market"
			})
		]
	});
	return /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx("header", {
		className: "border-b border-border",
		children: /* @__PURE__ */ jsxs("div", {
			className: "mx-auto max-w-7xl px-4 py-5 text-center md:py-6 overflow-hidden",
			children: [
				isSideBySide && /* @__PURE__ */ jsx(Link, {
					to: "/",
					"aria-label": s.siteName || "Home",
					className: "inline-block max-w-full",
					children: /* @__PURE__ */ jsxs("div", {
						className: "inline-flex items-center justify-center gap-3 sm:gap-4 md:gap-5 text-left max-w-full",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "shrink-0 flex items-center justify-center",
							children: [s.logoLight && /* @__PURE__ */ jsx("img", {
								src: s.logoLight,
								alt: s.logoText || s.siteName || "Logo",
								width: 160,
								height: 80,
								decoding: "async",
								onError: () => setLogoFailed(true),
								className: `h-11 sm:h-16 md:h-20 lg:h-22 w-auto max-w-[80px] sm:max-w-[120px] md:max-w-[160px] object-contain ${s.logoDark ? "dark:hidden" : ""}`
							}), s.logoDark && /* @__PURE__ */ jsx("img", {
								src: s.logoDark,
								alt: s.logoText || s.siteName || "Logo",
								width: 160,
								height: 80,
								decoding: "async",
								onError: () => setLogoFailed(true),
								className: `h-11 sm:h-16 md:h-20 lg:h-22 w-auto max-w-[80px] sm:max-w-[120px] md:max-w-[160px] object-contain ${s.logoLight ? "hidden dark:block" : ""}`
							})]
						}), /* @__PURE__ */ jsxs("div", {
							className: "flex flex-col justify-center items-center text-center min-w-0 w-full",
							children: [/* @__PURE__ */ jsxs("h1", {
								className: "leading-none text-2xl sm:text-4xl md:text-5xl lg:text-6xl uppercase font-extrabold text-center",
								style: {
									fontFamily: "var(--font-headlines, \"Inter\", system-ui, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, sans-serif)",
									fontWeight: 800,
									letterSpacing: "0.05em"
								},
								children: [
									/* @__PURE__ */ jsx("span", {
										style: safePrimaryColor ? { color: safePrimaryColor } : void 0,
										className: !s.logoColorPrimary || s.logoColorPrimary === "#000000" ? "text-foreground dark:text-white" : "",
										children: primaryWord
									}),
									" ",
									/* @__PURE__ */ jsx("span", {
										style: { color: safeSecondaryColor },
										children: secondaryWord
									})
								]
							}), /* @__PURE__ */ jsx("div", {
								className: "mt-1.5 sm:mt-2 text-[9px] sm:text-[11px] md:text-xs font-semibold uppercase text-center w-full text-foreground/80 dark:text-foreground/85",
								children: taglineContent
							})]
						})]
					})
				}),
				!logoFailed && (mode === "logo_fit" || mode === "logo_only" && isFitScreen) && !isSideBySide && /* @__PURE__ */ jsx(Link, {
					to: "/",
					"aria-label": s.siteName || "Home",
					className: "block w-full",
					children: /* @__PURE__ */ jsxs("div", {
						className: "w-full flex items-center justify-center",
						children: [s.logoLight && /* @__PURE__ */ jsx("img", {
							src: s.logoLight,
							alt: s.logoText || s.siteName || "Logo",
							width: 800,
							height: 160,
							decoding: "async",
							onError: () => setLogoFailed(true),
							className: `w-full max-w-5xl h-auto max-h-36 sm:max-h-48 md:max-h-60 object-contain mx-auto ${s.logoDark ? "dark:hidden" : ""}`
						}), s.logoDark && /* @__PURE__ */ jsx("img", {
							src: s.logoDark,
							alt: s.logoText || s.siteName || "Logo",
							width: 800,
							height: 160,
							decoding: "async",
							onError: () => setLogoFailed(true),
							className: `w-full max-w-5xl h-auto max-h-36 sm:max-h-48 md:max-h-60 object-contain mx-auto ${s.logoLight ? "hidden dark:block" : ""}`
						})]
					})
				}),
				!isSideBySide && (logoFailed || mode !== "logo_fit" && !(mode === "logo_only" && isFitScreen)) && /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs(Link, {
					to: "/",
					"aria-label": s.siteName || "Home",
					className: "block",
					children: [
						showLogo && s.logoLight && /* @__PURE__ */ jsx("img", {
							src: s.logoLight,
							alt: s.logoText || s.siteName || "Logo",
							width: 200,
							height: 64,
							decoding: "async",
							onError: () => setLogoFailed(true),
							className: `mx-auto h-16 object-contain ${s.logoDark ? "dark:hidden" : ""} ${showText ? "mb-2" : ""}`
						}),
						showLogo && s.logoDark && /* @__PURE__ */ jsx("img", {
							src: s.logoDark,
							alt: s.logoText || s.siteName || "Logo",
							width: 200,
							height: 64,
							decoding: "async",
							onError: () => setLogoFailed(true),
							className: `mx-auto h-16 object-contain ${s.logoLight ? "hidden dark:block" : ""} ${showText ? "mb-2" : ""}`
						}),
						showText ? /* @__PURE__ */ jsxs("h1", {
							className: "leading-none text-3xl sm:text-5xl md:text-6xl lg:text-7xl uppercase",
							style: {
								fontFamily: "var(--font-headlines, \"Inter\", system-ui, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, sans-serif)",
								fontWeight: 800,
								letterSpacing: "0.05em"
							},
							children: [
								/* @__PURE__ */ jsx("span", {
									style: safePrimaryColor ? { color: safePrimaryColor } : void 0,
									className: !s.logoColorPrimary || s.logoColorPrimary === "#000000" ? "text-foreground dark:text-white" : "",
									children: primaryWord
								}),
								" ",
								/* @__PURE__ */ jsx("span", {
									style: { color: safeSecondaryColor },
									children: secondaryWord
								})
							]
						}) : /* @__PURE__ */ jsx("h1", {
							className: "sr-only",
							children: s.logoText || s.siteName || "Today Tripura"
						})
					]
				}), showText && /* @__PURE__ */ jsx("p", {
					className: "mt-2.5 sm:mt-3 block text-center mx-auto text-[10px] sm:text-[11px] font-semibold uppercase text-foreground/80 dark:text-foreground/85",
					children: taglineContent
				})] })
			]
		})
	}), /* @__PURE__ */ jsx("nav", {
		className: "sticky top-0 z-40 w-full border-t border-b border-border bg-background/95 backdrop-blur-md shadow-xs h-11 transition-all",
		children: /* @__PURE__ */ jsx("div", {
			className: "mx-auto flex h-full max-w-7xl items-center justify-center px-2 sm:px-4",
			children: /* @__PURE__ */ jsxs("div", {
				className: "flex items-center justify-center gap-2 sm:gap-4 md:gap-5 lg:gap-6 text-xs sm:text-sm font-semibold uppercase tracking-wider overflow-x-auto no-scrollbar scroll-smooth py-1 max-w-full",
				children: [/* @__PURE__ */ jsx(Link, {
					to: "/",
					"aria-label": "Home",
					className: "flex items-center shrink-0 whitespace-nowrap px-1.5 sm:px-2 py-1 text-foreground hover:text-red-600 dark:hover:text-red-400 transition-colors",
					children: /* @__PURE__ */ jsx(Home, { className: "h-4 w-4" })
				}), navItems.map((item) => item.name === "Others" ? /* @__PURE__ */ jsxs("div", {
					className: "group relative shrink-0",
					children: [/* @__PURE__ */ jsxs("button", {
						className: "flex items-center gap-1 whitespace-nowrap px-1.5 sm:px-2 py-1 uppercase text-foreground hover:text-red-600 dark:hover:text-red-400 transition-colors",
						children: [item.name, /* @__PURE__ */ jsx(ChevronDown, { className: "h-3.5 w-3.5" })]
					}), /* @__PURE__ */ jsx("div", {
						className: "invisible absolute left-1/2 z-50 mt-0 w-48 -translate-x-1/2 border border-border bg-background py-2 opacity-0 shadow-lg transition-all group-hover:visible group-hover:opacity-100",
						children: dropdownItems.map((c) => c.redirectUrl ? /* @__PURE__ */ jsx("a", {
							href: c.redirectUrl,
							target: c.redirectUrl.startsWith("http") ? "_blank" : void 0,
							rel: c.redirectUrl.startsWith("http") ? "noopener noreferrer" : void 0,
							className: "block px-4 py-2 text-left text-xs font-semibold uppercase tracking-wider text-foreground hover:bg-muted hover:text-red-600 transition-colors",
							children: c.name
						}, c.slug) : /* @__PURE__ */ jsx(Link, {
							to: "/$slug",
							params: { slug: c.slug },
							className: "block px-4 py-2 text-left text-xs font-semibold uppercase tracking-wider text-foreground hover:bg-muted hover:text-red-600 transition-colors",
							children: c.name
						}, c.slug))
					})]
				}, item.name) : item.redirectUrl ? /* @__PURE__ */ jsx("a", {
					href: item.redirectUrl,
					target: item.redirectUrl.startsWith("http") ? "_blank" : void 0,
					rel: item.redirectUrl.startsWith("http") ? "noopener noreferrer" : void 0,
					className: "shrink-0 whitespace-nowrap px-1.5 sm:px-2 py-1 text-foreground hover:text-red-600 dark:hover:text-red-400 transition-colors",
					children: item.name
				}, item.slug) : /* @__PURE__ */ jsx(Link, {
					to: "/$slug",
					params: { slug: item.slug },
					className: "shrink-0 whitespace-nowrap px-1.5 sm:px-2 py-1 text-foreground hover:text-red-600 dark:hover:text-red-400 transition-colors",
					activeProps: { className: "shrink-0 whitespace-nowrap px-1.5 sm:px-2 py-1 text-red-600 dark:text-red-500 font-bold" },
					children: item.name
				}, item.slug))]
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
					className: t.up ? "text-[#15803d] dark:text-emerald-400" : "text-[#b91c1c] dark:text-red-400",
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
		className: "overflow-hidden border-y border-border bg-card/60 py-2",
		children: /* @__PURE__ */ jsxs("div", {
			className: "flex ticker-scroll w-max",
			children: [row, row]
		})
	});
}
//#endregion
//#region src/components/site/BreakingBar.tsx
function BreakingBar({ articles: propArticles }) {
	const hasPropArticles = Array.isArray(propArticles) && propArticles.length > 0;
	const { data: fetchedArticles = [] } = useQuery({
		queryKey: ["homepageArticlesBreaking"],
		queryFn: () => getHomepageArticles({ data: 10 }),
		enabled: !hasPropArticles,
		staleTime: 6e4
	});
	const articles = hasPropArticles ? propArticles : fetchedArticles;
	const headlines = articles.length > 0 ? articles.slice(0, 10).map((a) => `${a.category ? `${a.category}: ` : ""}${a.title}`) : ["Welcome to News Theme — Stay tuned for breaking news updates."];
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
function Header({ showTopBar = true, showTicker, showBreakingBar, breakingArticles }) {
	const cfg = useHomepageConfig();
	const isTickerVisible = (useSiteSettings().licenseType || "").toLowerCase().includes("enterprise") && (showTicker !== void 0 ? showTicker : cfg.showTicker ?? false);
	const isBreakingVisible = showBreakingBar !== void 0 ? showBreakingBar : cfg.showBreakingBar ?? true;
	return /* @__PURE__ */ jsxs(Fragment, { children: [
		showTopBar && /* @__PURE__ */ jsx(TopBar, {}),
		/* @__PURE__ */ jsx(Masthead, {}),
		isTickerVisible && /* @__PURE__ */ jsx(Ticker, {}),
		isBreakingVisible && /* @__PURE__ */ jsx(BreakingBar, { articles: breakingArticles })
	] });
}
//#endregion
export { searchUnifiedPublic as n, Header as t };

//# sourceMappingURL=Header-CJkvMLsl.js.map