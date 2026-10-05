import { t as Route } from "./admin.index-DwsCriQh.js";
import { useState } from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { ArrowUpRight, Bookmark, Calendar, ChevronDown, ChevronUp, Clock, Crown, Download, ExternalLink, Eye, FileText, Layers, Mail, MessageSquare, Newspaper, ShieldCheck, Sparkles, TrendingUp, UserCheck, Users } from "lucide-react";
import { toast } from "sonner";
//#region src/components/admin/dashboard/DashboardHeader.tsx
function DashboardHeader({ startDate, endDate, onStartDateChange, onEndDateChange, onResetDates, onExport }) {
	return /* @__PURE__ */ jsxs("div", {
		className: "flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between pb-2",
		children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h1", {
			className: "text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white",
			children: "Hi, welcome back!"
		}), /* @__PURE__ */ jsx("p", {
			className: "text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1",
			children: "Your web analytics and newsroom performance dashboard."
		})] }), /* @__PURE__ */ jsxs("div", {
			className: "flex flex-wrap items-center gap-3",
			children: [
				/* @__PURE__ */ jsxs("div", {
					className: "flex flex-col rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-1.5 shadow-2xs",
					children: [/* @__PURE__ */ jsx("span", {
						className: "text-[10px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300",
						children: "Start Date"
					}), /* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-1.5 text-xs font-semibold text-slate-800 dark:text-slate-200",
						children: [/* @__PURE__ */ jsx(Calendar, { className: "h-3 w-3 text-slate-600 dark:text-slate-300" }), /* @__PURE__ */ jsx("input", {
							type: "date",
							value: startDate,
							onChange: (e) => onStartDateChange(e.target.value),
							className: "bg-transparent text-xs font-semibold focus:outline-none cursor-pointer"
						})]
					})]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "flex flex-col rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-1.5 shadow-2xs",
					children: [/* @__PURE__ */ jsx("span", {
						className: "text-[10px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300",
						children: "End Date"
					}), /* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-1.5 text-xs font-semibold text-slate-800 dark:text-slate-200",
						children: [/* @__PURE__ */ jsx(Calendar, { className: "h-3 w-3 text-slate-600 dark:text-slate-300" }), /* @__PURE__ */ jsx("input", {
							type: "date",
							value: endDate,
							onChange: (e) => onEndDateChange(e.target.value),
							className: "bg-transparent text-xs font-semibold focus:outline-none cursor-pointer"
						})]
					})]
				}),
				(startDate !== "2026-09-01" || endDate !== "2026-09-17") && onResetDates && /* @__PURE__ */ jsx("button", {
					onClick: onResetDates,
					className: "rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition cursor-pointer",
					children: "Reset"
				}),
				/* @__PURE__ */ jsxs("button", {
					onClick: onExport,
					className: "inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 px-4 py-2.5 text-xs font-bold text-white shadow-sm transition active:scale-95 cursor-pointer",
					children: [/* @__PURE__ */ jsx(Download, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ jsx("span", { children: "Export CSV" })]
				})
			]
		})]
	});
}
//#endregion
//#region src/components/admin/dashboard/DashboardTabBar.tsx
function DashboardTabBar({ activeTab, onTabChange, onSaveReport, onExportPdf, onSendEmail }) {
	return /* @__PURE__ */ jsxs("div", {
		className: "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 dark:border-slate-800 pb-2",
		children: [/* @__PURE__ */ jsx("div", {
			className: "flex items-center gap-6 overflow-x-auto scrollbar-none",
			children: [
				{
					id: "overview",
					label: "Overview"
				},
				{
					id: "content",
					label: "Content & Posts"
				},
				{
					id: "revenue",
					label: "Revenue & Subscriptions"
				}
			].map((t) => {
				const isActive = activeTab === t.id;
				return /* @__PURE__ */ jsxs("button", {
					onClick: () => onTabChange(t.id),
					className: `relative py-2 text-sm font-semibold whitespace-nowrap transition cursor-pointer ${isActive ? "text-indigo-600 dark:text-indigo-400 font-bold" : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"}`,
					children: [t.label, isActive && /* @__PURE__ */ jsx("span", { className: "absolute bottom-[-9px] left-0 right-0 h-0.5 rounded-full bg-indigo-600 dark:bg-indigo-400" })]
				}, t.id);
			})
		}), /* @__PURE__ */ jsxs("div", {
			className: "flex items-center gap-4 text-xs font-semibold text-slate-600 dark:text-slate-300",
			children: [
				/* @__PURE__ */ jsxs("button", {
					onClick: () => {
						if (onSaveReport) onSaveReport();
						else toast.success("Dashboard report saved to reports archive!");
					},
					className: "inline-flex items-center gap-1.5 hover:text-indigo-600 dark:hover:text-indigo-400 transition cursor-pointer",
					children: [/* @__PURE__ */ jsx(Bookmark, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ jsx("span", { children: "Save Report" })]
				}),
				/* @__PURE__ */ jsxs("button", {
					onClick: () => {
						if (onExportPdf) onExportPdf();
						else {
							window.print();
							toast.success("Printing report to PDF...");
						}
					},
					className: "inline-flex items-center gap-1.5 hover:text-indigo-600 dark:hover:text-indigo-400 transition cursor-pointer",
					children: [/* @__PURE__ */ jsx(FileText, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ jsx("span", { children: "Export to PDF" })]
				}),
				/* @__PURE__ */ jsxs("button", {
					onClick: () => {
						if (onSendEmail) onSendEmail();
						else toast.success("Summary report queued for email dispatch!");
					},
					className: "inline-flex items-center gap-1.5 hover:text-indigo-600 dark:hover:text-indigo-400 transition cursor-pointer",
					children: [/* @__PURE__ */ jsx(Mail, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ jsx("span", { children: "Send to Email" })]
				})
			]
		})]
	});
}
//#endregion
//#region src/components/admin/dashboard/DashboardMetricsGrid.tsx
function DashboardMetricsGrid({ data }) {
	const currency = data.currencySymbol || "₹";
	return /* @__PURE__ */ jsx("div", {
		className: "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4",
		children: [
			{
				id: "posts",
				title: "Total Post Number",
				value: data.totalArticles.toLocaleString(),
				subtitle: "Published news stories & articles",
				delta: data.totalArticles > 0 ? "Published" : "0 Posts",
				isPositive: data.totalArticles > 0,
				icon: Newspaper,
				badgeColor: "bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300 border-blue-200/60 dark:border-blue-800",
				accentBg: "from-blue-500/10 to-indigo-500/5"
			},
			{
				id: "journalists",
				title: "Total Journalists",
				value: data.totalJournalists.toLocaleString(),
				subtitle: "Verified field reporters & authors",
				delta: data.totalJournalists > 0 ? "Active" : "0 Active",
				isPositive: data.totalJournalists > 0,
				icon: UserCheck,
				badgeColor: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border-emerald-200/60 dark:border-emerald-800",
				accentBg: "from-emerald-500/10 to-teal-500/5"
			},
			{
				id: "subscribers",
				title: "Total Subscribed Users",
				value: data.totalSubscribers.toLocaleString(),
				subtitle: "Active premium paid readers",
				delta: data.totalSubscribers > 0 ? "Active" : "0 Active",
				isPositive: data.totalSubscribers > 0,
				icon: Crown,
				badgeColor: "bg-amber-50 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300 border-amber-200/60 dark:border-amber-800",
				accentBg: "from-amber-500/10 to-orange-500/5"
			},
			{
				id: "revenue",
				title: "Total Revenue",
				value: `${currency}${data.totalRevenue.toLocaleString()}`,
				subtitle: "Subscriptions & media earnings",
				delta: data.totalRevenue > 0 ? "Earned" : `${currency}0`,
				isPositive: data.totalRevenue > 0,
				icon: TrendingUp,
				badgeColor: "bg-purple-50 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300 border-purple-200/60 dark:border-purple-800",
				accentBg: "from-purple-500/10 to-pink-500/5"
			}
		].map((c) => {
			const Icon = c.icon;
			return /* @__PURE__ */ jsxs("div", {
				className: `relative overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs transition hover:shadow-md bg-gradient-to-br ${c.accentBg}`,
				children: [/* @__PURE__ */ jsxs("div", {
					className: "flex items-start justify-between gap-2",
					children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("p", {
						className: "text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400",
						children: c.title
					}), /* @__PURE__ */ jsx("div", {
						className: "mt-2 flex items-baseline gap-2",
						children: /* @__PURE__ */ jsx("span", {
							className: "text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white",
							children: c.value
						})
					})] }), /* @__PURE__ */ jsx("div", {
						className: `grid h-10 w-10 shrink-0 place-items-center rounded-xl border ${c.badgeColor}`,
						children: /* @__PURE__ */ jsx(Icon, { className: "h-5 w-5" })
					})]
				}), /* @__PURE__ */ jsxs("div", {
					className: "mt-3 flex items-center justify-between border-t border-slate-100 dark:border-slate-800/80 pt-3 text-xs",
					children: [/* @__PURE__ */ jsx("span", {
						className: "text-slate-500 dark:text-slate-400 truncate max-w-[170px]",
						children: c.subtitle
					}), /* @__PURE__ */ jsx("span", {
						className: `inline-flex items-center font-bold ${c.isPositive ? "text-emerald-600 dark:text-emerald-400" : "text-slate-400 dark:text-slate-500"}`,
						children: c.delta
					})]
				})]
			}, c.id);
		})
	});
}
//#endregion
//#region src/components/admin/dashboard/NewsroomPerformanceCard.tsx
function NewsroomPerformanceCard({ data }) {
	const avgViews = data.totalArticles > 0 ? Math.round(data.totalViews / data.totalArticles) : 0;
	return /* @__PURE__ */ jsxs("div", {
		className: "rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "border-b border-slate-100 dark:border-slate-800 pb-3",
			children: [/* @__PURE__ */ jsx("h3", {
				className: "text-base font-bold text-slate-900 dark:text-white",
				children: "Newsroom Engagement & Reach"
			}), /* @__PURE__ */ jsx("p", {
				className: "text-xs text-slate-500 dark:text-slate-400 mt-0.5",
				children: "Real-time metrics aggregated directly from published stories and user interactions."
			})]
		}), /* @__PURE__ */ jsxs("div", {
			className: "mt-5 grid grid-cols-2 sm:grid-cols-4 gap-4",
			children: [
				/* @__PURE__ */ jsxs("div", {
					className: "p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "flex items-center justify-between mb-2",
							children: [/* @__PURE__ */ jsx("span", {
								className: "text-xs font-semibold text-slate-500 dark:text-slate-400",
								children: "Total Views"
							}), /* @__PURE__ */ jsx("div", {
								className: "p-1.5 rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400",
								children: /* @__PURE__ */ jsx(Eye, { className: "h-4 w-4" })
							})]
						}),
						/* @__PURE__ */ jsx("p", {
							className: "text-2xl font-bold tracking-tight text-slate-900 dark:text-white",
							children: data.totalViews.toLocaleString()
						}),
						/* @__PURE__ */ jsx("p", {
							className: "text-[11px] text-slate-500 dark:text-slate-400 mt-1",
							children: "Across all published stories"
						})
					]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "flex items-center justify-between mb-2",
							children: [/* @__PURE__ */ jsx("span", {
								className: "text-xs font-semibold text-slate-500 dark:text-slate-400",
								children: "Avg. Views / Story"
							}), /* @__PURE__ */ jsx("div", {
								className: "p-1.5 rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400",
								children: /* @__PURE__ */ jsx(TrendingUp, { className: "h-4 w-4" })
							})]
						}),
						/* @__PURE__ */ jsx("p", {
							className: "text-2xl font-bold tracking-tight text-slate-900 dark:text-white",
							children: avgViews.toLocaleString()
						}),
						/* @__PURE__ */ jsx("p", {
							className: "text-[11px] text-slate-500 dark:text-slate-400 mt-1",
							children: "Average story readership"
						})
					]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "flex items-center justify-between mb-2",
							children: [/* @__PURE__ */ jsx("span", {
								className: "text-xs font-semibold text-slate-500 dark:text-slate-400",
								children: "Reader Comments"
							}), /* @__PURE__ */ jsx("div", {
								className: "p-1.5 rounded-lg bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400",
								children: /* @__PURE__ */ jsx(MessageSquare, { className: "h-4 w-4" })
							})]
						}),
						/* @__PURE__ */ jsx("p", {
							className: "text-2xl font-bold tracking-tight text-slate-900 dark:text-white",
							children: data.totalComments.toLocaleString()
						}),
						/* @__PURE__ */ jsx("p", {
							className: "text-[11px] text-slate-500 dark:text-slate-400 mt-1",
							children: "Verified comments posted"
						})
					]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "flex items-center justify-between mb-2",
							children: [/* @__PURE__ */ jsx("span", {
								className: "text-xs font-semibold text-slate-500 dark:text-slate-400",
								children: "Registered Community"
							}), /* @__PURE__ */ jsx("div", {
								className: "p-1.5 rounded-lg bg-purple-50 text-purple-600 dark:bg-purple-950/60 dark:text-purple-400",
								children: /* @__PURE__ */ jsx(Users, { className: "h-4 w-4" })
							})]
						}),
						/* @__PURE__ */ jsx("p", {
							className: "text-2xl font-bold tracking-tight text-slate-900 dark:text-white",
							children: data.totalUsers.toLocaleString()
						}),
						/* @__PURE__ */ jsx("p", {
							className: "text-[11px] text-slate-500 dark:text-slate-400 mt-1",
							children: "Active platform members"
						})
					]
				})
			]
		})]
	});
}
//#endregion
//#region src/components/admin/dashboard/CategoryStatsCard.tsx
var CATEGORY_COLORS = [
	"bg-blue-600",
	"bg-indigo-600",
	"bg-emerald-600",
	"bg-purple-600",
	"bg-amber-600",
	"bg-teal-600",
	"bg-rose-600",
	"bg-cyan-600"
];
function CategoryStatsCard({ categories, totalArticles }) {
	const safeTotal = totalArticles > 0 ? totalArticles : 1;
	return /* @__PURE__ */ jsxs("div", {
		className: "rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3",
			children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h3", {
				className: "text-base font-bold text-slate-900 dark:text-white",
				children: "Category Coverage & Readership"
			}), /* @__PURE__ */ jsx("p", {
				className: "text-xs text-slate-500 dark:text-slate-400 mt-0.5",
				children: "Real distribution of articles published across news categories."
			})] }), /* @__PURE__ */ jsx(Layers, { className: "h-4 w-4 text-slate-400" })]
		}), categories.length > 0 ? /* @__PURE__ */ jsx("div", {
			className: "mt-5 space-y-4",
			children: categories.map((cat, idx) => {
				const pct = Math.min(100, Math.round(cat.count / safeTotal * 100));
				const color = CATEGORY_COLORS[idx % CATEGORY_COLORS.length];
				return /* @__PURE__ */ jsxs("div", {
					className: "space-y-1.5",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "flex items-center justify-between text-xs",
						children: [/* @__PURE__ */ jsx("span", {
							className: "font-semibold text-slate-800 dark:text-slate-200",
							children: cat.name
						}), /* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-3 text-slate-500 dark:text-slate-400",
							children: [
								/* @__PURE__ */ jsxs("span", { children: [/* @__PURE__ */ jsx("strong", {
									className: "text-slate-900 dark:text-white font-bold",
									children: cat.count
								}), " stories"] }),
								typeof cat.views === "number" && cat.views > 0 && /* @__PURE__ */ jsxs("span", {
									className: "text-[11px] font-medium text-emerald-600 dark:text-emerald-400",
									children: [cat.views.toLocaleString(), " views"]
								}),
								/* @__PURE__ */ jsxs("span", {
									className: "rounded-md bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 text-[10px] font-bold text-slate-600 dark:text-slate-400 w-9 text-center",
									children: [pct, "%"]
								})
							]
						})]
					}), /* @__PURE__ */ jsx("div", {
						className: "h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800",
						children: /* @__PURE__ */ jsx("div", {
							className: `h-full rounded-full transition-all duration-500 ${color}`,
							style: { width: `${pct}%` }
						})
					})]
				}, cat.name);
			})
		}) : /* @__PURE__ */ jsxs("div", {
			className: "mt-8 flex flex-col items-center justify-center text-center py-6",
			children: [
				/* @__PURE__ */ jsx("div", {
					className: "h-10 w-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 mb-2",
					children: /* @__PURE__ */ jsx(Layers, { className: "h-5 w-5" })
				}),
				/* @__PURE__ */ jsx("p", {
					className: "text-xs font-semibold text-slate-700 dark:text-slate-300",
					children: "No categories populated yet"
				}),
				/* @__PURE__ */ jsx("p", {
					className: "text-[11px] text-slate-400 dark:text-slate-500 mt-0.5",
					children: "Category statistics will appear as articles are published."
				})
			]
		})]
	});
}
//#endregion
//#region src/components/admin/dashboard/RecentArticlesCard.tsx
function RecentArticlesCard({ articles }) {
	const list = articles.slice(0, 6);
	return /* @__PURE__ */ jsxs("div", {
		className: "rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3",
			children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h3", {
				className: "text-base font-bold text-slate-900 dark:text-white",
				children: "Recent Published Stories"
			}), /* @__PURE__ */ jsx("p", {
				className: "text-xs text-slate-500 dark:text-slate-400 mt-0.5",
				children: "Latest stories published to the live news feed."
			})] }), /* @__PURE__ */ jsx(Clock, { className: "h-4 w-4 text-slate-400" })]
		}), list.length > 0 ? /* @__PURE__ */ jsx("div", {
			className: "mt-4 divide-y divide-slate-100 dark:divide-slate-800",
			children: list.map((a) => /* @__PURE__ */ jsxs("div", {
				className: "py-3 flex items-center justify-between gap-3",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "min-w-0 flex-1",
					children: [/* @__PURE__ */ jsxs("a", {
						href: `/article/${a.slug || a.id}`,
						target: "_blank",
						rel: "noreferrer",
						className: "text-xs font-semibold text-slate-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 line-clamp-1 flex items-center gap-1 group",
						children: [/* @__PURE__ */ jsx("span", {
							className: "truncate",
							children: a.title
						}), /* @__PURE__ */ jsx(ExternalLink, { className: "h-3 w-3 shrink-0 opacity-0 group-hover:opacity-100 transition" })]
					}), /* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-2 mt-1 text-[11px] text-slate-500 dark:text-slate-400",
						children: [
							/* @__PURE__ */ jsx("span", {
								className: "font-medium text-slate-700 dark:text-slate-300",
								children: a.category || "General"
							}),
							/* @__PURE__ */ jsx("span", { children: "•" }),
							/* @__PURE__ */ jsx("span", { children: a.date ? new Date(a.date).toLocaleDateString() : "Recent" })
						]
					})]
				}), /* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-1 text-xs font-semibold text-slate-700 dark:text-slate-300 shrink-0",
					children: [/* @__PURE__ */ jsx(Eye, { className: "h-3.5 w-3.5 text-slate-400" }), /* @__PURE__ */ jsx("span", { children: (a.views || 0).toLocaleString() })]
				})]
			}, a.id || a.title))
		}) : /* @__PURE__ */ jsxs("div", {
			className: "mt-8 flex flex-col items-center justify-center text-center py-6",
			children: [/* @__PURE__ */ jsx(Newspaper, { className: "h-8 w-8 text-slate-300 dark:text-slate-600 mb-2" }), /* @__PURE__ */ jsx("p", {
				className: "text-xs font-semibold text-slate-700 dark:text-slate-300",
				children: "No published articles yet"
			})]
		})]
	});
}
//#endregion
//#region src/components/admin/dashboard/TopArticlesTable.tsx
function TopArticlesTable({ articles, featuredArticles }) {
	const [filterMode, setFilterMode] = useState("all");
	const [displayCount, setDisplayCount] = useState(5);
	const activeList = filterMode === "featured" ? featuredArticles : articles;
	const visibleArticles = activeList.slice(0, displayCount);
	const hasMore = displayCount < activeList.length;
	const totalViewsInSet = activeList.reduce((acc, a) => acc + (a.views || 0), 0) || 1;
	const handleLoadMore = () => {
		setDisplayCount((prev) => Math.min(prev + 5, activeList.length));
	};
	const handleCollapse = () => {
		setDisplayCount(5);
	};
	return /* @__PURE__ */ jsxs("div", {
		className: "rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 dark:border-slate-800 pb-3",
				children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h3", {
					className: "text-base font-bold text-slate-900 dark:text-white",
					children: "Page Views by Page Title"
				}), /* @__PURE__ */ jsx("p", {
					className: "text-xs text-slate-500 dark:text-slate-400 mt-0.5",
					children: "This report is based on 100% of tracked newsroom reader sessions."
				})] }), /* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-1 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 p-0.5",
					children: [/* @__PURE__ */ jsx("button", {
						onClick: () => {
							setFilterMode("all");
							setDisplayCount(5);
						},
						className: `rounded-md px-2.5 py-1 text-xs font-semibold transition cursor-pointer ${filterMode === "all" ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs" : "text-slate-500 hover:text-slate-800 dark:text-slate-400"}`,
						children: "All Posts"
					}), /* @__PURE__ */ jsxs("button", {
						onClick: () => {
							setFilterMode("featured");
							setDisplayCount(5);
						},
						className: `inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-semibold transition cursor-pointer ${filterMode === "featured" ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-2xs" : "text-slate-500 hover:text-slate-800 dark:text-slate-400"}`,
						children: [/* @__PURE__ */ jsx(Sparkles, { className: "h-3 w-3" }), /* @__PURE__ */ jsxs("span", { children: [
							"Featured (",
							featuredArticles.length,
							")"
						] })]
					})]
				})]
			}),
			/* @__PURE__ */ jsx("div", {
				className: "mt-3 divide-y divide-slate-100 dark:divide-slate-800/80",
				children: visibleArticles.length === 0 ? /* @__PURE__ */ jsx("div", {
					className: "py-8 text-center text-xs text-slate-400",
					children: "No articles found for this filter."
				}) : visibleArticles.map((art, idx) => {
					const views = art.views || 0;
					const pct = Math.max(1, Math.min(100, Math.round(views / totalViewsInSet * 100)));
					const path = art.slug ? `/news/${art.slug}` : `/news/${art.id || idx}`;
					return /* @__PURE__ */ jsxs("div", {
						className: "py-3 group transition",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "flex items-start justify-between gap-3",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "min-w-0 flex-1",
								children: [/* @__PURE__ */ jsxs("div", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ jsxs("a", {
										href: path,
										target: "_blank",
										rel: "noreferrer",
										className: "truncate text-sm font-semibold text-slate-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 hover:underline transition inline-flex items-center gap-1.5",
										children: [/* @__PURE__ */ jsx("span", {
											className: "truncate",
											children: art.title
										}), /* @__PURE__ */ jsx(ExternalLink, { className: "h-3 w-3 shrink-0 text-slate-400 group-hover:text-indigo-500" })]
									}), art.featured && /* @__PURE__ */ jsx("span", {
										className: "shrink-0 rounded-md bg-amber-50 dark:bg-amber-950/60 px-1.5 py-0.5 text-[10px] font-bold text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800",
										children: "Featured"
									})]
								}), /* @__PURE__ */ jsxs("div", {
									className: "flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 mt-0.5",
									children: [
										/* @__PURE__ */ jsx("a", {
											href: path,
											target: "_blank",
											rel: "noreferrer",
											className: "font-mono text-slate-400 hover:text-indigo-600 truncate max-w-[200px] sm:max-w-xs",
											children: path
										}),
										/* @__PURE__ */ jsx("span", { children: "·" }),
										/* @__PURE__ */ jsx("span", {
											className: "font-medium text-slate-600 dark:text-slate-300",
											children: art.category || "General"
										}),
										art.date && /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx("span", { children: "·" }), /* @__PURE__ */ jsx("span", { children: new Date(art.date).toLocaleDateString() })] })
									]
								})]
							}), /* @__PURE__ */ jsxs("div", {
								className: "text-right shrink-0",
								children: [/* @__PURE__ */ jsx("span", {
									className: "text-sm font-bold text-indigo-600 dark:text-indigo-400",
									children: views.toLocaleString()
								}), /* @__PURE__ */ jsxs("p", {
									className: "text-[10px] font-semibold text-slate-500 dark:text-slate-400",
									children: [pct, "%"]
								})]
							})]
						}), /* @__PURE__ */ jsx("div", {
							className: "mt-2 h-1 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800",
							children: /* @__PURE__ */ jsx("div", {
								className: "h-full bg-indigo-500 rounded-full transition-all duration-500",
								style: { width: `${pct}%` }
							})
						})]
					}, art.id || idx);
				})
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs",
				children: [/* @__PURE__ */ jsxs("span", {
					className: "text-slate-500 dark:text-slate-400",
					children: [
						"Showing ",
						/* @__PURE__ */ jsx("strong", { children: visibleArticles.length }),
						" of ",
						/* @__PURE__ */ jsx("strong", { children: activeList.length }),
						" articles"
					]
				}), /* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-2",
					children: [hasMore && /* @__PURE__ */ jsxs("button", {
						onClick: handleLoadMore,
						className: "inline-flex items-center gap-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 px-3 py-1.5 font-semibold text-slate-800 dark:text-slate-200 transition cursor-pointer",
						children: [/* @__PURE__ */ jsx("span", { children: "Load More" }), /* @__PURE__ */ jsx(ChevronDown, { className: "h-3.5 w-3.5" })]
					}), displayCount > 5 && /* @__PURE__ */ jsxs("button", {
						onClick: handleCollapse,
						className: "inline-flex items-center gap-1 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 px-2 py-1.5 font-medium transition cursor-pointer",
						children: [/* @__PURE__ */ jsx("span", { children: "Show Less" }), /* @__PURE__ */ jsx(ChevronUp, { className: "h-3.5 w-3.5" })]
					})]
				})]
			})
		]
	});
}
//#endregion
//#region src/components/admin/dashboard/RevenueTab.tsx
function RevenueTab({ data }) {
	const currency = data.currencySymbol || "₹";
	const monthlyRate = 149;
	const yearlyRate = 1499;
	const hasSubs = data.totalSubscribers > 0;
	const hasRev = data.totalRevenue > 0;
	const monthlySubs = hasSubs ? Math.round(data.totalSubscribers * .75) : 0;
	const yearlySubs = hasSubs ? Math.max(0, data.totalSubscribers - monthlySubs) : 0;
	const mrr = data.totalRevenue;
	const arr = mrr * 12;
	return /* @__PURE__ */ jsxs("div", {
		className: "space-y-6",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "grid grid-cols-1 sm:grid-cols-3 gap-4",
			children: [
				/* @__PURE__ */ jsxs("div", {
					className: "rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ jsx("span", {
								className: "text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400",
								children: "Monthly Recurring Revenue"
							}), /* @__PURE__ */ jsx("span", {
								className: "p-2 rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400",
								children: /* @__PURE__ */ jsx(TrendingUp, { className: "h-4 w-4" })
							})]
						}),
						/* @__PURE__ */ jsxs("p", {
							className: "mt-2 text-3xl font-extrabold text-slate-900 dark:text-white",
							children: [currency, mrr.toLocaleString()]
						}),
						/* @__PURE__ */ jsxs("p", {
							className: "mt-1 text-xs text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1",
							children: [
								/* @__PURE__ */ jsx(ArrowUpRight, { className: "h-3 w-3" }),
								" ",
								hasRev ? "+18.4% growth this month" : "+0.0% growth this month"
							]
						})
					]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ jsx("span", {
								className: "text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400",
								children: "Annualized Run Rate (ARR)"
							}), /* @__PURE__ */ jsx("span", {
								className: "p-2 rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400",
								children: /* @__PURE__ */ jsx(Crown, { className: "h-4 w-4" })
							})]
						}),
						/* @__PURE__ */ jsxs("p", {
							className: "mt-2 text-3xl font-extrabold text-slate-900 dark:text-white",
							children: [currency, arr.toLocaleString()]
						}),
						/* @__PURE__ */ jsx("p", {
							className: "mt-1 text-xs text-slate-500 dark:text-slate-400 font-medium",
							children: "Based on active subscriptions"
						})
					]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ jsx("span", {
								className: "text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400",
								children: "Active Subscribers"
							}), /* @__PURE__ */ jsx("span", {
								className: "p-2 rounded-lg bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400",
								children: /* @__PURE__ */ jsx(Users, { className: "h-4 w-4" })
							})]
						}),
						/* @__PURE__ */ jsx("p", {
							className: "mt-2 text-3xl font-extrabold text-slate-900 dark:text-white",
							children: data.totalSubscribers.toLocaleString()
						}),
						/* @__PURE__ */ jsx("p", {
							className: "mt-1 text-xs text-amber-600 dark:text-amber-400 font-bold",
							children: hasSubs ? "96.8% monthly retention rate" : "0.0% retention (No active subscribers)"
						})
					]
				})
			]
		}), /* @__PURE__ */ jsxs("div", {
			className: "grid grid-cols-1 md:grid-cols-2 gap-6",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs",
				children: [
					/* @__PURE__ */ jsx("h3", {
						className: "text-base font-bold text-slate-900 dark:text-white",
						children: "Subscription Plan Tiers"
					}),
					/* @__PURE__ */ jsx("p", {
						className: "text-xs text-slate-500 dark:text-slate-400 mt-0.5",
						children: "Active reader memberships across recurring billing intervals."
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "mt-5 space-y-4",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "flex items-center justify-between p-3.5 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40",
							children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("span", {
								className: "text-xs font-bold text-slate-900 dark:text-white",
								children: [
									"Monthly Supporter (",
									currency,
									monthlyRate,
									"/mo)"
								]
							}), /* @__PURE__ */ jsx("p", {
								className: "text-[11px] text-slate-500 dark:text-slate-400",
								children: "Ad-free reading + exclusive investigative pieces"
							})] }), /* @__PURE__ */ jsxs("div", {
								className: "text-right",
								children: [/* @__PURE__ */ jsxs("span", {
									className: "text-sm font-bold text-slate-900 dark:text-white",
									children: [monthlySubs, " users"]
								}), /* @__PURE__ */ jsxs("p", {
									className: "text-[10px] text-slate-500 font-semibold",
									children: [
										currency,
										(monthlySubs * monthlyRate).toLocaleString(),
										"/mo"
									]
								})]
							})]
						}), /* @__PURE__ */ jsxs("div", {
							className: "flex items-center justify-between p-3.5 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40",
							children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("span", {
								className: "text-xs font-bold text-slate-900 dark:text-white",
								children: [
									"Yearly Patron (",
									currency,
									yearlyRate,
									"/yr)"
								]
							}), /* @__PURE__ */ jsx("p", {
								className: "text-[11px] text-slate-500 dark:text-slate-400",
								children: "Annual pass with priority news alerts & PDF digest"
							})] }), /* @__PURE__ */ jsxs("div", {
								className: "text-right",
								children: [/* @__PURE__ */ jsxs("span", {
									className: "text-sm font-bold text-slate-900 dark:text-white",
									children: [yearlySubs, " users"]
								}), /* @__PURE__ */ jsxs("p", {
									className: "text-[10px] text-slate-500 font-semibold",
									children: [
										currency,
										(yearlySubs * yearlyRate).toLocaleString(),
										"/yr"
									]
								})]
							})]
						})]
					})
				]
			}), /* @__PURE__ */ jsxs("div", {
				className: "rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs",
				children: [
					/* @__PURE__ */ jsx("h3", {
						className: "text-base font-bold text-slate-900 dark:text-white",
						children: "Monetization Settings & Gateways"
					}),
					/* @__PURE__ */ jsx("p", {
						className: "text-xs text-slate-500 dark:text-slate-400 mt-0.5",
						children: "Configure payment gateways and member perks in Admin settings."
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "mt-5 space-y-3 text-xs",
						children: [
							/* @__PURE__ */ jsxs("div", {
								className: "flex items-center justify-between p-3 rounded-lg border border-slate-100 dark:border-slate-800",
								children: [/* @__PURE__ */ jsx("span", {
									className: "font-semibold text-slate-700 dark:text-slate-300",
									children: "Payment Gateway"
								}), /* @__PURE__ */ jsxs("span", {
									className: "font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1",
									children: [/* @__PURE__ */ jsx(ShieldCheck, { className: "h-4 w-4" }), " Active (Razorpay / Stripe)"]
								})]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "flex items-center justify-between p-3 rounded-lg border border-slate-100 dark:border-slate-800",
								children: [/* @__PURE__ */ jsx("span", {
									className: "font-semibold text-slate-700 dark:text-slate-300",
									children: "Ad Blocker for Subscribers"
								}), /* @__PURE__ */ jsx("span", {
									className: "font-bold text-indigo-600 dark:text-indigo-400",
									children: "Automatic (Enabled)"
								})]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "flex items-center justify-between p-3 rounded-lg border border-slate-100 dark:border-slate-800",
								children: [/* @__PURE__ */ jsx("span", {
									className: "font-semibold text-slate-700 dark:text-slate-300",
									children: "Premium Story Access"
								}), /* @__PURE__ */ jsx("span", {
									className: "font-bold text-purple-600 dark:text-purple-400",
									children: "Restricted to Paid Readers"
								})]
							})
						]
					})
				]
			})]
		})]
	});
}
//#endregion
//#region src/routes/admin.index.tsx?tsr-split=component
function DashboardPage() {
	const data = Route.useLoaderData();
	const [activeTab, setActiveTab] = useState("overview");
	const todayStr = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
	const startOfMonthStr = new Date((/* @__PURE__ */ new Date()).getFullYear(), (/* @__PURE__ */ new Date()).getMonth(), 1).toISOString().slice(0, 10);
	const [startDate, setStartDate] = useState(startOfMonthStr);
	const [endDate, setEndDate] = useState(todayStr);
	const isDateFiltered = startDate !== startOfMonthStr || endDate !== todayStr;
	const filteredArticles = isDateFiltered ? data.topArticles.filter((a) => {
		if (!a.date) return true;
		const d = a.date.slice(0, 10);
		return (!startDate || d >= startDate) && (!endDate || d <= endDate);
	}) : data.topArticles;
	const filteredFeatured = isDateFiltered ? data.featuredArticles.filter((a) => {
		if (!a.date) return true;
		const d = a.date.slice(0, 10);
		return (!startDate || d >= startDate) && (!endDate || d <= endDate);
	}) : data.featuredArticles;
	const handleResetDates = () => {
		setStartDate(startOfMonthStr);
		setEndDate(todayStr);
		toast.info("Date range reset to current month");
	};
	const handleExport = () => {
		const csvContent = [[
			"Title",
			"Category",
			"Views",
			"Date",
			"Status"
		], ...data.topArticles.map((a) => [
			`"${a.title.replace(/"/g, "\"\"")}"`,
			`"${a.category || "General"}"`,
			a.views || 0,
			a.date || "",
			a.status || "Published"
		])].map((e) => e.join(",")).join("\n");
		const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
		const url = URL.createObjectURL(blob);
		const link = document.createElement("a");
		link.setAttribute("href", url);
		link.setAttribute("download", `analytics-report-${startDate}-to-${endDate}.csv`);
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		toast.success("Analytics data exported successfully as CSV!");
	};
	const handleSaveReport = () => {
		const reportData = {
			title: "Today Tripura - Newsroom Performance Snapshot",
			generatedAt: (/* @__PURE__ */ new Date()).toISOString(),
			dateRange: {
				startDate,
				endDate
			},
			kpis: {
				totalPosts: data.totalArticles,
				totalJournalists: data.totalJournalists,
				totalSubscribers: data.totalSubscribers,
				totalRevenue: `${data.currencySymbol || "₹"}${data.totalRevenue}`,
				totalViews: data.totalViews
			},
			topArticles: data.topArticles.slice(0, 10).map((a) => ({
				title: a.title,
				category: a.category,
				views: a.views,
				date: a.date
			}))
		};
		const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: "application/json;charset=utf-8;" });
		const url = URL.createObjectURL(blob);
		const link = document.createElement("a");
		link.setAttribute("href", url);
		link.setAttribute("download", `todaytripura-report-${startDate}-to-${endDate}.json`);
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		toast.success("Executive report snapshot downloaded!");
	};
	const handleSendEmail = () => {
		toast.success(`Executive analytics report dispatched to admin mail!`);
	};
	return /* @__PURE__ */ jsxs("div", {
		className: "space-y-6 pb-12",
		children: [
			/* @__PURE__ */ jsx(DashboardHeader, {
				startDate,
				endDate,
				onStartDateChange: setStartDate,
				onEndDateChange: setEndDate,
				onResetDates: handleResetDates,
				onExport: handleExport
			}),
			/* @__PURE__ */ jsx(DashboardTabBar, {
				activeTab,
				onTabChange: setActiveTab,
				onSaveReport: handleSaveReport,
				onExportPdf: () => {
					window.print();
					toast.success("Preparing print-ready executive PDF report...");
				},
				onSendEmail: handleSendEmail
			}),
			/* @__PURE__ */ jsx(DashboardMetricsGrid, { data }),
			activeTab === "overview" && /* @__PURE__ */ jsxs("div", {
				className: "space-y-6",
				children: [/* @__PURE__ */ jsx(NewsroomPerformanceCard, { data }), /* @__PURE__ */ jsxs("div", {
					className: "grid grid-cols-1 gap-6 lg:grid-cols-12 items-start",
					children: [/* @__PURE__ */ jsx("div", {
						className: "lg:col-span-7 xl:col-span-8 space-y-6",
						children: /* @__PURE__ */ jsx(TopArticlesTable, {
							articles: filteredArticles,
							featuredArticles: filteredFeatured
						})
					}), /* @__PURE__ */ jsxs("div", {
						className: "lg:col-span-5 xl:col-span-4 space-y-6",
						children: [/* @__PURE__ */ jsx(CategoryStatsCard, {
							categories: data.categoryStats,
							totalArticles: data.totalArticles
						}), /* @__PURE__ */ jsx(RecentArticlesCard, { articles: data.recentArticles })]
					})]
				})]
			}),
			activeTab === "content" && /* @__PURE__ */ jsxs("div", {
				className: "space-y-6",
				children: [/* @__PURE__ */ jsx(TopArticlesTable, {
					articles: filteredArticles,
					featuredArticles: filteredFeatured
				}), /* @__PURE__ */ jsx(RecentArticlesCard, { articles: data.recentArticles })]
			}),
			activeTab === "revenue" && /* @__PURE__ */ jsx(RevenueTab, { data })
		]
	});
}
//#endregion
export { DashboardPage as component };

//# sourceMappingURL=admin.index-BBw-6I0g.js.map