import { i as isEnterpriseLicense } from "./site-settings-DBpSxJYE.js";
import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { Archive, Calculator, CalendarDays, CheckCircle2, ChevronDown, Clapperboard, Compass, ExternalLink, EyeOff, GraduationCap, Image, Layers, Layout, Lock, Megaphone, MessageSquareQuote, Newspaper, PanelLeft, PanelRight, ShieldCheck, Sparkles, TrendingUp, Tv, Video } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa6";
import { FaTelegramPlane } from "react-icons/fa";
//#region src/components/admin/settings/navigation/LeftNavConfigSection.tsx
var LEFT_NAV_ITEMS = [
	{
		key: "live",
		name: "Live Updates",
		bengaliName: "লাইভ",
		description: "Real-time live news stream badge with pulsing indicator",
		icon: Tv
	},
	{
		key: "reels",
		name: "Shorts / Reels",
		bengaliName: "শর্টস / Reels",
		description: "Vertical video shorts link (/reels)",
		icon: Clapperboard
	},
	{
		key: "results",
		name: "Examination & Election Results",
		bengaliName: "Result",
		description: "Educational and poll result announcements (/results)",
		icon: GraduationCap
	},
	{
		key: "videos",
		name: "Videos",
		bengaliName: "ভিডিও",
		description: "Curated news video stories (/reels)",
		icon: Video
	},
	{
		key: "photos",
		name: "Photo Gallery",
		bengaliName: "ফটো গ্যালারি",
		description: "Visual stories & photo features category stream",
		icon: Image
	},
	{
		key: "factCheck",
		name: "Fact Check Rail",
		bengaliName: "ফ্যাক্ট চেক",
		description: "Verified fact-checking reports (/fact-check)",
		icon: ShieldCheck
	},
	{
		key: "opinion",
		name: "Opinion & Editorials",
		bengaliName: "ওপিনিয়ন",
		description: "Expert op-ed and analysis opinion articles",
		icon: MessageSquareQuote
	},
	{
		key: "archive",
		name: "News Archive Link",
		bengaliName: "আর্কাইভ",
		description: "Browse historical editions and dates (/archive)",
		icon: Newspaper
	},
	{
		key: "emiCalculator",
		name: "EMI Calculator Modal",
		bengaliName: "EMI ক্যালকুলেটর",
		description: "Quick pop-up financial loan & mortgage calculator",
		icon: Calculator
	},
	{
		key: "ageCalculator",
		name: "Age Calculator Modal",
		bengaliName: "বয়সের ক্যালকুলেটর",
		description: "Quick pop-up birthdate and milestone calculator",
		icon: CalendarDays
	}
];
function LeftNavConfigSection({ s, update }) {
	const isEnterprise = isEnterpriseLicense(s);
	const isLeftNavEnabled = Boolean(s.showArticleLeftNav && isEnterprise);
	const leftItems = s.articleLeftNavItems || {};
	const toggleLeftItem = (key) => {
		if (!isEnterprise) return;
		const nextVal = leftItems[key] === false ? true : false;
		update("articleLeftNavItems", {
			...leftItems,
			[key]: nextVal
		});
	};
	return /* @__PURE__ */ jsxs("div", {
		className: "space-y-4 animate-fadeIn",
		children: [
			!isEnterprise && /* @__PURE__ */ jsx("div", {
				className: "rounded-xl border border-amber-300 bg-gradient-to-r from-amber-50 to-orange-50 p-4 shadow-xs",
				children: /* @__PURE__ */ jsxs("div", {
					className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "flex items-start gap-3",
						children: [/* @__PURE__ */ jsx("div", {
							className: "flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500 text-white shrink-0 shadow-xs",
							children: /* @__PURE__ */ jsx(Lock, { className: "h-5 w-5" })
						}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ jsx("h4", {
								className: "text-sm font-bold text-amber-950",
								children: "Enterprise Exclusive Feature"
							}), /* @__PURE__ */ jsx("span", {
								className: "rounded-full bg-amber-200/80 px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wide text-amber-900",
								children: "Enterprise / Enterprise+"
							})]
						}), /* @__PURE__ */ jsxs("p", {
							className: "text-xs text-amber-900/80 mt-1",
							children: [
								"The Left-Side Navigation Bar is exclusively available for ",
								/* @__PURE__ */ jsx("strong", { children: "Enterprise" }),
								" and ",
								/* @__PURE__ */ jsx("strong", { children: "Enterprise Plus" }),
								" licenses. Standard and Premium users can configure the Right-Side Sidebar. To unlock the Left-Side Navigation Bar on article post views, upgrade your license."
							]
						})] })]
					}), /* @__PURE__ */ jsxs(Link, {
						to: "/admin/settings",
						search: { tab: "activate" },
						className: "inline-flex items-center gap-1.5 rounded-lg bg-amber-600 px-3.5 py-2 text-xs font-bold text-white hover:bg-amber-700 transition shrink-0 shadow-xs",
						children: [/* @__PURE__ */ jsx(Sparkles, { className: "h-3.5 w-3.5" }), "Upgrade License"]
					})]
				})
			}),
			/* @__PURE__ */ jsx("div", {
				className: `rounded-xl border p-4 transition-all ${!isEnterprise ? "border-slate-200 bg-slate-50/70 opacity-75" : "border-indigo-200 bg-indigo-50/40"}`,
				children: /* @__PURE__ */ jsxs("div", {
					className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "space-y-1 max-w-xl",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "flex flex-wrap items-center gap-2",
							children: [
								/* @__PURE__ */ jsx("div", {
									className: "flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600 text-white shrink-0",
									children: /* @__PURE__ */ jsx(PanelLeft, { className: "h-4 w-4" })
								}),
								/* @__PURE__ */ jsx("label", {
									htmlFor: "toggle-left-nav",
									className: `text-sm font-bold ${!isEnterprise ? "text-slate-600 cursor-not-allowed" : "text-slate-900 cursor-pointer"}`,
									children: "Show Left-Side Navigation Bar on Article Pages"
								}),
								!isEnterprise ? /* @__PURE__ */ jsxs("span", {
									className: "inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800",
									children: [/* @__PURE__ */ jsx(Lock, { className: "h-3 w-3" }), " Enterprise Locked"]
								}) : isLeftNavEnabled ? /* @__PURE__ */ jsxs("span", {
									className: "inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800",
									children: [/* @__PURE__ */ jsx(CheckCircle2, { className: "h-3 w-3" }), " Enabled (Enterprise)"]
								}) : /* @__PURE__ */ jsxs("span", {
									className: "inline-flex items-center gap-1 rounded-full bg-slate-200 px-2 py-0.5 text-[10px] font-bold text-slate-700",
									children: [/* @__PURE__ */ jsx(EyeOff, { className: "h-3 w-3" }), " Hidden (Default)"]
								})
							]
						}), /* @__PURE__ */ jsx("p", {
							className: "text-xs text-slate-600 leading-relaxed pl-9.5",
							children: !isEnterprise ? "This rail requires an Enterprise or Enterprise Plus license. When unlocked, it displays quick navigation links on desktop screens (1280px+)." : "When enabled, the vertical rail appears on desktop displays (1280px+). When disabled, the rail is hidden entirely and the article canvas expands."
						})]
					}), /* @__PURE__ */ jsx("div", {
						className: "shrink-0 flex items-center pl-9.5 sm:pl-0",
						children: /* @__PURE__ */ jsx("button", {
							id: "toggle-left-nav",
							type: "button",
							role: "switch",
							disabled: !isEnterprise,
							"aria-checked": isLeftNavEnabled,
							onClick: () => {
								if (!isEnterprise) return;
								update("showArticleLeftNav", !isLeftNavEnabled);
							},
							className: `relative inline-flex h-6 w-11 shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 ${!isEnterprise ? "bg-slate-300 cursor-not-allowed opacity-50" : isLeftNavEnabled ? "bg-emerald-600 cursor-pointer" : "bg-slate-300 cursor-pointer"}`,
							children: /* @__PURE__ */ jsx("span", { className: `pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-xs transition duration-200 ${isLeftNavEnabled ? "translate-x-5" : "translate-x-0"}` })
						})
					})]
				})
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "rounded-xl border border-slate-200 bg-white p-4",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "flex items-center justify-between pb-3 mb-3 border-b border-slate-100",
					children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("h3", {
						className: "text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2",
						children: [/* @__PURE__ */ jsx("span", { className: "h-2 w-2 rounded-full bg-indigo-600" }), "Left Navigation Items (Show / Hide)"]
					}), /* @__PURE__ */ jsx("p", {
						className: "text-[11px] text-slate-500 mt-0.5",
						children: "Choose which specific quick-nav links, categories, and pop-up calculator modals are active."
					})] }), !isLeftNavEnabled && /* @__PURE__ */ jsx("span", {
						className: "rounded-md bg-amber-50 px-2 py-1 text-[10px] font-semibold text-amber-700 border border-amber-200",
						children: "Rail is currently disabled above"
					})]
				}), /* @__PURE__ */ jsx("div", {
					className: "grid gap-2.5 sm:grid-cols-2",
					children: LEFT_NAV_ITEMS.map((item) => {
						const ItemIcon = item.icon;
						const isVisible = leftItems[item.key] !== false;
						return /* @__PURE__ */ jsxs("div", {
							className: `flex items-center justify-between p-3 rounded-lg border transition-all ${isVisible ? "border-slate-200 bg-slate-50/70 hover:bg-slate-50" : "border-slate-100 bg-white opacity-60 hover:opacity-100"}`,
							children: [/* @__PURE__ */ jsxs("div", {
								className: "flex items-start gap-2.5 min-w-0 pr-2",
								children: [/* @__PURE__ */ jsx("div", {
									className: `mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md ${isVisible ? "bg-indigo-100 text-indigo-700" : "bg-slate-100 text-slate-400"}`,
									children: /* @__PURE__ */ jsx(ItemIcon, { className: "h-4 w-4" })
								}), /* @__PURE__ */ jsxs("div", {
									className: "min-w-0",
									children: [/* @__PURE__ */ jsxs("div", {
										className: "flex items-center gap-1.5 flex-wrap",
										children: [/* @__PURE__ */ jsx("span", {
											className: "text-xs font-bold text-slate-900 truncate",
											children: item.name
										}), item.bengaliName && /* @__PURE__ */ jsx("span", {
											className: "text-[10px] rounded bg-slate-200/80 px-1 py-0.2 font-medium text-slate-700",
											children: item.bengaliName
										})]
									}), /* @__PURE__ */ jsx("p", {
										className: "text-[10.5px] text-slate-500 line-clamp-1",
										children: item.description
									})]
								})]
							}), /* @__PURE__ */ jsx("button", {
								type: "button",
								role: "switch",
								disabled: !isEnterprise,
								"aria-checked": isVisible,
								onClick: () => toggleLeftItem(item.key),
								className: `relative inline-flex h-5 w-9 shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none ${!isEnterprise ? "bg-slate-300 cursor-not-allowed opacity-50" : isVisible ? "bg-emerald-600 cursor-pointer" : "bg-slate-300 cursor-pointer"}`,
								children: /* @__PURE__ */ jsx("span", { className: `pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-xs transition duration-200 ${isVisible ? "translate-x-4" : "translate-x-0"}` })
							})]
						}, item.key);
					})
				})]
			})
		]
	});
}
//#endregion
//#region src/components/admin/settings/navigation/RightSidebarConfigSection.tsx
function RightSidebarConfigSection({ s, update }) {
	const isRightSidebarEnabled = s.showArticleRightSidebar !== false;
	const rightItems = s.articleRightSidebarItems || {};
	const siteName = s.siteName || "Today Tripura";
	const isAd3Visible = rightItems.ad3 !== false;
	const isTrendingVisible = rightItems.trendingNews !== false;
	const isArchiveVisible = rightItems.archiveFinder !== false;
	const isWhatsappVisible = rightItems.whatsappChannel !== false;
	const isTelegramVisible = rightItems.telegramChannel !== false;
	const toggleRightItem = (key) => {
		const nextVal = rightItems[key] === false ? true : false;
		update("articleRightSidebarItems", {
			...rightItems,
			[key]: nextVal
		});
	};
	const updateRightField = (field, val) => {
		update("articleRightSidebarItems", {
			...rightItems,
			[field]: val
		});
	};
	return /* @__PURE__ */ jsxs("div", {
		className: "space-y-4 animate-fadeIn",
		children: [
			/* @__PURE__ */ jsx("div", {
				className: "rounded-xl border border-emerald-200 bg-emerald-50/40 p-4 transition-all",
				children: /* @__PURE__ */ jsxs("div", {
					className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "space-y-1 max-w-xl",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-2.5",
							children: [
								/* @__PURE__ */ jsx("div", {
									className: "flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-600 text-white shrink-0",
									children: /* @__PURE__ */ jsx(PanelRight, { className: "h-4 w-4" })
								}),
								/* @__PURE__ */ jsx("label", {
									htmlFor: "toggle-right-sidebar",
									className: "text-sm font-bold text-slate-900 cursor-pointer",
									children: "Show Right-Side Sidebar on Article Pages"
								}),
								isRightSidebarEnabled ? /* @__PURE__ */ jsxs("span", {
									className: "inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800",
									children: [/* @__PURE__ */ jsx(CheckCircle2, { className: "h-3 w-3" }), " Enabled (Default)"]
								}) : /* @__PURE__ */ jsxs("span", {
									className: "inline-flex items-center gap-1 rounded-full bg-slate-200 px-2 py-0.5 text-[10px] font-bold text-slate-700",
									children: [/* @__PURE__ */ jsx(EyeOff, { className: "h-3 w-3" }), " Hidden"]
								}),
								/* @__PURE__ */ jsx("span", {
									className: "inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600 border border-slate-200",
									children: "All Plans"
								})
							]
						}), /* @__PURE__ */ jsx("p", {
							className: "text-xs text-slate-600 leading-relaxed pl-9.5",
							children: "Controls the right-side rail containing Trending Stories, Ads, Calendar Archive, and Community Channels. When disabled, the right sidebar is hidden completely."
						})]
					}), /* @__PURE__ */ jsx("div", {
						className: "shrink-0 flex items-center pl-9.5 sm:pl-0",
						children: /* @__PURE__ */ jsx("button", {
							id: "toggle-right-sidebar",
							type: "button",
							role: "switch",
							"aria-checked": isRightSidebarEnabled,
							onClick: () => update("showArticleRightSidebar", !isRightSidebarEnabled),
							className: `relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 ${isRightSidebarEnabled ? "bg-emerald-600" : "bg-slate-300"}`,
							children: /* @__PURE__ */ jsx("span", { className: `pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-xs transition duration-200 ${isRightSidebarEnabled ? "translate-x-5" : "translate-x-0"}` })
						})
					})]
				})
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "rounded-xl border border-slate-200 bg-white p-4",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "flex items-center justify-between pb-3 mb-3 border-b border-slate-100",
					children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("h3", {
						className: "text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2",
						children: [/* @__PURE__ */ jsx("span", { className: "h-2 w-2 rounded-full bg-emerald-600" }), "Standard Sidebar Components (Show / Hide)"]
					}), /* @__PURE__ */ jsx("p", {
						className: "text-[11px] text-slate-500 mt-0.5",
						children: "Select which native editorial blocks and ad placements appear in the right rail."
					})] }), !isRightSidebarEnabled && /* @__PURE__ */ jsx("span", {
						className: "rounded-md bg-amber-50 px-2 py-1 text-[10px] font-semibold text-amber-700 border border-amber-200",
						children: "Sidebar is currently disabled above"
					})]
				}), /* @__PURE__ */ jsxs("div", {
					className: "grid gap-2.5 sm:grid-cols-1",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: `flex items-center justify-between p-3.5 rounded-lg border transition-all ${isAd3Visible ? "border-slate-200 bg-slate-50/70 hover:bg-slate-50" : "border-slate-100 bg-white opacity-60 hover:opacity-100"}`,
							children: [/* @__PURE__ */ jsxs("div", {
								className: "flex items-start gap-3 min-w-0 pr-2",
								children: [/* @__PURE__ */ jsx("div", {
									className: `mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md ${isAd3Visible ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-400"}`,
									children: /* @__PURE__ */ jsx(Megaphone, { className: "h-4 w-4" })
								}), /* @__PURE__ */ jsxs("div", {
									className: "min-w-0",
									children: [/* @__PURE__ */ jsx("span", {
										className: "text-xs font-bold text-slate-900",
										children: "Top Sidebar Ad (Ad 3)"
									}), /* @__PURE__ */ jsx("p", {
										className: "text-[11px] text-slate-500 mt-0.5",
										children: "Desktop right-rail square advertisement placement (300x250)."
									})]
								})]
							}), /* @__PURE__ */ jsx("button", {
								type: "button",
								role: "switch",
								"aria-checked": isAd3Visible,
								onClick: () => toggleRightItem("ad3"),
								className: `relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none ${isAd3Visible ? "bg-emerald-600" : "bg-slate-300"}`,
								children: /* @__PURE__ */ jsx("span", { className: `pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-xs transition duration-200 ${isAd3Visible ? "translate-x-4" : "translate-x-0"}` })
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: `flex items-center justify-between p-3.5 rounded-lg border transition-all ${isTrendingVisible ? "border-slate-200 bg-slate-50/70 hover:bg-slate-50" : "border-slate-100 bg-white opacity-60 hover:opacity-100"}`,
							children: [/* @__PURE__ */ jsxs("div", {
								className: "flex items-start gap-3 min-w-0 pr-2",
								children: [/* @__PURE__ */ jsx("div", {
									className: `mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md ${isTrendingVisible ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-400"}`,
									children: /* @__PURE__ */ jsx(TrendingUp, { className: "h-4 w-4" })
								}), /* @__PURE__ */ jsxs("div", {
									className: "min-w-0",
									children: [/* @__PURE__ */ jsxs("div", {
										className: "flex items-center gap-1.5 flex-wrap",
										children: [/* @__PURE__ */ jsx("span", {
											className: "text-xs font-bold text-slate-900",
											children: "Top Headlines & Trending Articles"
										}), /* @__PURE__ */ jsx("span", {
											className: "text-[10px] rounded bg-slate-200/80 px-1.5 py-0.5 font-medium text-slate-700",
											children: "সেরা শিরোনাম"
										})]
									}), /* @__PURE__ */ jsx("p", {
										className: "text-[11px] text-slate-500 mt-0.5",
										children: "Top ranked trending stories with thumbnails and numbered rankings."
									})]
								})]
							}), /* @__PURE__ */ jsx("button", {
								type: "button",
								role: "switch",
								"aria-checked": isTrendingVisible,
								onClick: () => toggleRightItem("trendingNews"),
								className: `relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none ${isTrendingVisible ? "bg-emerald-600" : "bg-slate-300"}`,
								children: /* @__PURE__ */ jsx("span", { className: `pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-xs transition duration-200 ${isTrendingVisible ? "translate-x-4" : "translate-x-0"}` })
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: `flex items-center justify-between p-3.5 rounded-lg border transition-all ${isArchiveVisible ? "border-slate-200 bg-slate-50/70 hover:bg-slate-50" : "border-slate-100 bg-white opacity-60 hover:opacity-100"}`,
							children: [/* @__PURE__ */ jsxs("div", {
								className: "flex items-start gap-3 min-w-0 pr-2",
								children: [/* @__PURE__ */ jsx("div", {
									className: `mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md ${isArchiveVisible ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-400"}`,
									children: /* @__PURE__ */ jsx(Archive, { className: "h-4 w-4" })
								}), /* @__PURE__ */ jsxs("div", {
									className: "min-w-0",
									children: [/* @__PURE__ */ jsxs("div", {
										className: "flex items-center gap-1.5 flex-wrap",
										children: [/* @__PURE__ */ jsx("span", {
											className: "text-xs font-bold text-slate-900",
											children: "Calendar Archive Finder"
										}), /* @__PURE__ */ jsx("span", {
											className: "text-[10px] rounded bg-slate-200/80 px-1.5 py-0.5 font-medium text-slate-700",
											children: "আর্কাইভ অনুসন্ধান"
										})]
									}), /* @__PURE__ */ jsx("p", {
										className: "text-[11px] text-slate-500 mt-0.5",
										children: "Interactive date picker allowing readers to jump to past newspapers and editions."
									})]
								})]
							}), /* @__PURE__ */ jsx("button", {
								type: "button",
								role: "switch",
								"aria-checked": isArchiveVisible,
								onClick: () => toggleRightItem("archiveFinder"),
								className: `relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none ${isArchiveVisible ? "bg-emerald-600" : "bg-slate-300"}`,
								children: /* @__PURE__ */ jsx("span", { className: `pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-xs transition duration-200 ${isArchiveVisible ? "translate-x-4" : "translate-x-0"}` })
							})]
						})
					]
				})]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "rounded-xl border border-slate-200 bg-white p-4",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "pb-3 mb-3 border-b border-slate-100",
					children: [/* @__PURE__ */ jsxs("h3", {
						className: "text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2",
						children: [/* @__PURE__ */ jsx("span", { className: "h-2 w-2 rounded-full bg-blue-600" }), "Social Community Channel Buttons (Below Archive)"]
					}), /* @__PURE__ */ jsx("p", {
						className: "text-[11px] text-slate-500 mt-0.5",
						children: "Render prominent \"Join Our Channel\" conversion buttons directly beneath the archive finder on desktop articles."
					})]
				}), /* @__PURE__ */ jsxs("div", {
					className: "space-y-4",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "rounded-xl border border-slate-200 bg-slate-50/60 p-4 transition-all",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-slate-200/70",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "flex items-center gap-3",
								children: [/* @__PURE__ */ jsx("div", {
									className: "flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 text-white shadow-xs",
									children: /* @__PURE__ */ jsx(FaWhatsapp, { className: "h-4.5 w-4.5" })
								}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("span", {
									className: "text-xs font-bold text-slate-900 block",
									children: "WhatsApp Channel Button"
								}), /* @__PURE__ */ jsx("span", {
									className: "text-[11px] text-slate-500",
									children: "Show or hide the WhatsApp channel join banner"
								})] })]
							}), /* @__PURE__ */ jsxs("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ jsx("span", {
									className: "text-[11px] font-semibold text-slate-600",
									children: isWhatsappVisible ? "Active" : "Hidden"
								}), /* @__PURE__ */ jsx("button", {
									type: "button",
									role: "switch",
									"aria-checked": isWhatsappVisible,
									onClick: () => toggleRightItem("whatsappChannel"),
									className: `relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none ${isWhatsappVisible ? "bg-emerald-600" : "bg-slate-300"}`,
									children: /* @__PURE__ */ jsx("span", { className: `pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-xs transition duration-200 ${isWhatsappVisible ? "translate-x-4" : "translate-x-0"}` })
								})]
							})]
						}), /* @__PURE__ */ jsxs("div", {
							className: "mt-3 grid gap-3 sm:grid-cols-2",
							children: [/* @__PURE__ */ jsxs("div", { children: [
								/* @__PURE__ */ jsx("label", {
									className: "block text-[11px] font-bold text-slate-700 mb-1",
									children: "Button Text Label"
								}),
								/* @__PURE__ */ jsx("input", {
									type: "text",
									value: rightItems.whatsappButtonText ?? "",
									onChange: (e) => updateRightField("whatsappButtonText", e.target.value),
									placeholder: `Join our WhatsApp Channel [${siteName}]`,
									className: "w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-900 shadow-xs focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
								}),
								/* @__PURE__ */ jsxs("span", {
									className: "text-[10px] text-slate-400 mt-0.5 block",
									children: [
										"Leave empty to use default: \"Join our WhatsApp Channel [",
										siteName,
										"]\""
									]
								})
							] }), /* @__PURE__ */ jsxs("div", { children: [
								/* @__PURE__ */ jsxs("label", {
									className: "block text-[11px] font-bold text-slate-700 mb-1 flex items-center justify-between",
									children: [/* @__PURE__ */ jsx("span", { children: "Channel Invite Link / URL" }), /* @__PURE__ */ jsx(ExternalLink, { className: "h-3 w-3 text-slate-400" })]
								}),
								/* @__PURE__ */ jsx("input", {
									type: "url",
									value: rightItems.whatsappChannelUrl ?? "",
									onChange: (e) => updateRightField("whatsappChannelUrl", e.target.value),
									placeholder: s.whatsapp || "https://whatsapp.com/channel/...",
									className: "w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-900 shadow-xs focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
								}),
								/* @__PURE__ */ jsx("span", {
									className: "text-[10px] text-slate-400 mt-0.5 block",
									children: "Defaults to general WhatsApp setting if left blank."
								})
							] })]
						})]
					}), /* @__PURE__ */ jsxs("div", {
						className: "rounded-xl border border-slate-200 bg-slate-50/60 p-4 transition-all",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-slate-200/70",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "flex items-center gap-3",
								children: [/* @__PURE__ */ jsx("div", {
									className: "flex h-8 w-8 items-center justify-center rounded-lg bg-sky-600 text-white shadow-xs",
									children: /* @__PURE__ */ jsx(FaTelegramPlane, { className: "h-4.5 w-4.5 ml-0.5" })
								}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("span", {
									className: "text-xs font-bold text-slate-900 block",
									children: "Telegram Channel Button"
								}), /* @__PURE__ */ jsx("span", {
									className: "text-[11px] text-slate-500",
									children: "Show or hide the Telegram channel join banner"
								})] })]
							}), /* @__PURE__ */ jsxs("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ jsx("span", {
									className: "text-[11px] font-semibold text-slate-600",
									children: isTelegramVisible ? "Active" : "Hidden"
								}), /* @__PURE__ */ jsx("button", {
									type: "button",
									role: "switch",
									"aria-checked": isTelegramVisible,
									onClick: () => toggleRightItem("telegramChannel"),
									className: `relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none ${isTelegramVisible ? "bg-emerald-600" : "bg-slate-300"}`,
									children: /* @__PURE__ */ jsx("span", { className: `pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-xs transition duration-200 ${isTelegramVisible ? "translate-x-4" : "translate-x-0"}` })
								})]
							})]
						}), /* @__PURE__ */ jsxs("div", {
							className: "mt-3 grid gap-3 sm:grid-cols-2",
							children: [/* @__PURE__ */ jsxs("div", { children: [
								/* @__PURE__ */ jsx("label", {
									className: "block text-[11px] font-bold text-slate-700 mb-1",
									children: "Button Text Label"
								}),
								/* @__PURE__ */ jsx("input", {
									type: "text",
									value: rightItems.telegramButtonText ?? "",
									onChange: (e) => updateRightField("telegramButtonText", e.target.value),
									placeholder: `Join our Telegram Channel [${siteName}]`,
									className: "w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-900 shadow-xs focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
								}),
								/* @__PURE__ */ jsxs("span", {
									className: "text-[10px] text-slate-400 mt-0.5 block",
									children: [
										"Leave empty to use default: \"Join our Telegram Channel [",
										siteName,
										"]\""
									]
								})
							] }), /* @__PURE__ */ jsxs("div", { children: [
								/* @__PURE__ */ jsxs("label", {
									className: "block text-[11px] font-bold text-slate-700 mb-1 flex items-center justify-between",
									children: [/* @__PURE__ */ jsx("span", { children: "Channel Invite Link / URL" }), /* @__PURE__ */ jsx(ExternalLink, { className: "h-3 w-3 text-slate-400" })]
								}),
								/* @__PURE__ */ jsx("input", {
									type: "url",
									value: rightItems.telegramChannelUrl ?? "",
									onChange: (e) => updateRightField("telegramChannelUrl", e.target.value),
									placeholder: s.telegram || "https://t.me/...",
									className: "w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-900 shadow-xs focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
								}),
								/* @__PURE__ */ jsx("span", {
									className: "text-[10px] text-slate-400 mt-0.5 block",
									children: "Defaults to general Telegram setting if left blank."
								})
							] })]
						})]
					})]
				})]
			})
		]
	});
}
//#endregion
//#region src/components/admin/settings/navigation/NavigationWireframePreview.tsx
function NavigationWireframePreview({ s }) {
	const isEnterprise = isEnterpriseLicense(s);
	const isLeftNavEnabled = Boolean(s.showArticleLeftNav && isEnterprise);
	const isRightSidebarEnabled = s.showArticleRightSidebar !== false;
	const leftItems = s.articleLeftNavItems || {};
	const rightItems = s.articleRightSidebarItems || {};
	const activeLeftCount = Object.values(leftItems).filter((v) => v !== false).length;
	const activeRightCount = [
		rightItems.ad3 !== false,
		rightItems.trendingNews !== false,
		rightItems.archiveFinder !== false,
		rightItems.whatsappChannel !== false,
		rightItems.telegramChannel !== false
	].filter(Boolean).length;
	return /* @__PURE__ */ jsxs("div", {
		className: "mt-6 border-t border-slate-100 pt-5",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "flex items-center justify-between mb-2",
			children: [/* @__PURE__ */ jsxs("span", {
				className: "text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5",
				children: [/* @__PURE__ */ jsx(Layout, { className: "h-3.5 w-3.5 text-slate-600" }), "Live Desktop Layout Wireframe Preview"]
			}), /* @__PURE__ */ jsx("span", {
				className: "text-[10px] text-slate-400",
				children: "Matches your current configuration in real-time"
			})]
		}), /* @__PURE__ */ jsx("div", {
			className: "rounded-xl border border-slate-200 bg-slate-100/80 p-4",
			children: /* @__PURE__ */ jsxs("div", {
				className: "flex items-stretch gap-2.5 h-28 text-center text-xs font-semibold",
				children: [
					!isEnterprise ? /* @__PURE__ */ jsxs("div", {
						className: "w-20 flex flex-col items-center justify-center rounded-lg border border-dashed border-amber-200 bg-amber-50/50 text-amber-800/80",
						children: [
							/* @__PURE__ */ jsx(Lock, { className: "h-4 w-4 mb-1 text-amber-600" }),
							/* @__PURE__ */ jsx("span", {
								className: "text-[9.5px] leading-tight font-bold",
								children: "Left Nav"
							}),
							/* @__PURE__ */ jsx("span", {
								className: "text-[8px] text-amber-700 font-semibold mt-0.5",
								children: "Enterprise"
							})
						]
					}) : /* @__PURE__ */ jsxs("div", {
						className: `flex flex-col items-center justify-center rounded-lg border transition-all duration-300 ${isLeftNavEnabled ? "w-28 border-indigo-400 bg-indigo-50 text-indigo-900 shadow-xs" : "w-14 border-dashed border-slate-300 bg-white/40 text-slate-400 opacity-40 line-through"}`,
						children: [
							/* @__PURE__ */ jsx(PanelLeft, { className: "h-4 w-4 mb-1" }),
							/* @__PURE__ */ jsx("span", {
								className: "text-[10px] leading-tight font-bold",
								children: isLeftNavEnabled ? "Left Nav" : "Hidden"
							}),
							isLeftNavEnabled && /* @__PURE__ */ jsxs("span", {
								className: "text-[8.5px] text-indigo-600 mt-0.5",
								children: [activeLeftCount || 10, " items"]
							})
						]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "flex-1 rounded-lg border border-slate-300 bg-white shadow-xs flex flex-col items-center justify-center p-3 text-slate-800",
						children: [
							/* @__PURE__ */ jsx("span", {
								className: "text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1",
								children: "Article Reading Canvas"
							}),
							/* @__PURE__ */ jsx("span", {
								className: "text-xs font-extrabold text-slate-900",
								children: "Headline & Body Content"
							}),
							/* @__PURE__ */ jsx("span", {
								className: "text-[10px] text-slate-500 mt-0.5",
								children: isLeftNavEnabled && isRightSidebarEnabled ? "3-Column Standard Layout" : !isLeftNavEnabled && !isRightSidebarEnabled ? "Centered Full-Focus Canvas (Max-4xl)" : "2-Column Expanded Layout"
							})
						]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: `flex flex-col items-center justify-center rounded-lg border transition-all duration-300 ${isRightSidebarEnabled ? "w-40 border-emerald-400 bg-emerald-50 text-emerald-900 shadow-xs" : "w-14 border-dashed border-slate-300 bg-white/40 text-slate-400 opacity-40 line-through"}`,
						children: [
							/* @__PURE__ */ jsx(PanelRight, { className: "h-4 w-4 mb-1" }),
							/* @__PURE__ */ jsx("span", {
								className: "text-[10px] leading-tight font-bold",
								children: isRightSidebarEnabled ? "Right Rail" : "Hidden"
							}),
							isRightSidebarEnabled && /* @__PURE__ */ jsxs("span", {
								className: "text-[8.5px] text-emerald-600 mt-0.5",
								children: [activeRightCount, " modules active"]
							})
						]
					})
				]
			})
		})]
	});
}
//#endregion
//#region src/components/admin/settings/NavigationSettingsTab.tsx
function NavigationSettingsTab({ s, update }) {
	const isEnterprise = isEnterpriseLicense(s);
	const [selectedTarget, setSelectedTarget] = useState(isEnterprise ? "left" : "right");
	return /* @__PURE__ */ jsx("div", {
		className: "space-y-6",
		children: /* @__PURE__ */ jsxs("section", {
			className: "rounded-xl border border-slate-200 bg-white p-5 shadow-xs",
			children: [
				/* @__PURE__ */ jsxs("div", {
					className: "flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3 mb-5",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-3",
						children: [/* @__PURE__ */ jsx("div", {
							className: "flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white shadow-xs",
							children: /* @__PURE__ */ jsx(Compass, { className: "h-5 w-5 text-indigo-400" })
						}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ jsx("h2", {
								className: "text-base font-bold text-slate-900",
								children: "Article Navigation & Post View Layout"
							}), /* @__PURE__ */ jsx("span", {
								className: "rounded-full bg-slate-100 px-2.5 py-0.5 text-[9.5px] font-extrabold uppercase tracking-wider text-slate-700 border border-slate-200",
								children: "Layout Rails"
							})]
						}), /* @__PURE__ */ jsx("p", {
							className: "text-xs text-slate-500",
							children: "Configure desktop article rails: Standard Right-Side Sidebar (All Plans) & Left-Side Navigation Bar (Enterprise Exclusive)."
						})] })]
					}), isEnterprise ? /* @__PURE__ */ jsxs("span", {
						className: "inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 border border-emerald-200",
						children: [/* @__PURE__ */ jsx(Sparkles, { className: "h-3 w-3 text-emerald-600" }), "Enterprise Rails Unlocked"]
					}) : /* @__PURE__ */ jsxs("span", {
						className: "inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 border border-slate-200",
						children: [/* @__PURE__ */ jsx(Layout, { className: "h-3 w-3 text-slate-500" }), "Standard Plan (Right Sidebar Active)"]
					})]
				}),
				/* @__PURE__ */ jsx("div", {
					className: "mb-6 rounded-xl border border-indigo-100 bg-gradient-to-r from-indigo-50/70 to-slate-50 p-4",
					children: /* @__PURE__ */ jsxs("div", {
						className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3",
						children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("label", {
							htmlFor: "navigation-target-select",
							className: "text-xs font-extrabold uppercase tracking-wider text-indigo-950 flex items-center gap-1.5",
							children: [/* @__PURE__ */ jsx(Layers, { className: "h-4 w-4 text-indigo-600" }), "Select Navigation Rail to Configure"]
						}), /* @__PURE__ */ jsx("p", {
							className: "text-xs text-slate-600 mt-0.5",
							children: "Choose which side of the article layout you want to edit."
						})] }), /* @__PURE__ */ jsxs("div", {
							className: "relative min-w-[300px]",
							children: [/* @__PURE__ */ jsxs("select", {
								id: "navigation-target-select",
								value: selectedTarget,
								onChange: (e) => setSelectedTarget(e.target.value),
								className: "w-full appearance-none rounded-xl border-2 border-indigo-200 bg-white px-4 py-2.5 pr-10 text-xs sm:text-sm font-bold text-slate-900 shadow-xs transition hover:border-indigo-400 focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-100 cursor-pointer",
								children: [/* @__PURE__ */ jsx("option", {
									value: "right",
									children: "Right-Side Sidebar (Trending, Archive, Community) — Standard (All Plans)"
								}), /* @__PURE__ */ jsxs("option", {
									value: "left",
									children: ["Left-Side Navigation Bar (Quick Nav) — Enterprise Exclusive ", isEnterprise ? "✓" : "🔒"]
								})]
							}), /* @__PURE__ */ jsx(ChevronDown, { className: "pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" })]
						})]
					})
				}),
				selectedTarget === "left" ? /* @__PURE__ */ jsx(LeftNavConfigSection, {
					s,
					update
				}) : /* @__PURE__ */ jsx(RightSidebarConfigSection, {
					s,
					update
				}),
				/* @__PURE__ */ jsx(NavigationWireframePreview, { s })
			]
		})
	});
}
//#endregion
export { NavigationSettingsTab, NavigationSettingsTab as default };

//# sourceMappingURL=NavigationSettingsTab-D-dVEkpe.js.map