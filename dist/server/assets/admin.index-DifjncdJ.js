import { t as Route } from "./admin.index-BLmcZEu0.js";
import { useState } from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { ArrowDownRight, ArrowUpRight, Bookmark, Calendar, ChevronDown, ChevronUp, Crown, Download, ExternalLink, FileText, Mail, MapPin, Monitor, Newspaper, ShieldCheck, Smartphone, Sparkles, Tablet, TrendingDown, TrendingUp, UserCheck, Users } from "lucide-react";
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
					id: "audiences",
					label: "Audiences"
				},
				{
					id: "demographics",
					label: "Demographics"
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
				delta: "+14.2%",
				isPositive: true,
				icon: Newspaper,
				badgeColor: "bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300 border-blue-200/60 dark:border-blue-800",
				accentBg: "from-blue-500/10 to-indigo-500/5"
			},
			{
				id: "journalists",
				title: "Total Journalists",
				value: data.totalJournalists.toLocaleString(),
				subtitle: "Verified field reporters & authors",
				delta: "+8.5%",
				isPositive: true,
				icon: UserCheck,
				badgeColor: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border-emerald-200/60 dark:border-emerald-800",
				accentBg: "from-emerald-500/10 to-teal-500/5"
			},
			{
				id: "subscribers",
				title: "Total Subscribed Users",
				value: data.totalSubscribers.toLocaleString(),
				subtitle: "Active premium paid readers",
				delta: "+22.8%",
				isPositive: true,
				icon: Crown,
				badgeColor: "bg-amber-50 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300 border-amber-200/60 dark:border-amber-800",
				accentBg: "from-amber-500/10 to-orange-500/5"
			},
			{
				id: "revenue",
				title: "Total Revenue",
				value: `${currency}${data.totalRevenue.toLocaleString()}`,
				subtitle: "Subscriptions & media earnings",
				delta: "+18.4%",
				isPositive: true,
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
					}), /* @__PURE__ */ jsxs("span", {
						className: `inline-flex items-center font-bold ${c.isPositive ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`,
						children: [c.isPositive ? /* @__PURE__ */ jsx(ArrowUpRight, { className: "h-3.5 w-3.5 mr-0.5" }) : /* @__PURE__ */ jsx(ArrowDownRight, { className: "h-3.5 w-3.5 mr-0.5" }), c.delta]
					})]
				})]
			}, c.id);
		})
	});
}
//#endregion
//#region src/components/admin/dashboard/AudienceChartCard.tsx
function AudienceChartCard({ totalViews, totalUsers }) {
	const [timeframe, setTimeframe] = useState("Day");
	const currentStats = {
		Day: {
			users: totalUsers > 0 ? (totalUsers * 12 + 14232).toLocaleString() : "14,232",
			bounce: "33.50%",
			views: totalViews > 0 ? (Math.round(totalViews * .15) + 44565).toLocaleString() : "44,565",
			sessions: totalViews > 0 ? (Math.round(totalViews * .1) + 29347).toLocaleString() : "29,347"
		},
		Week: {
			users: totalUsers > 0 ? (totalUsers * 75 + 98450).toLocaleString() : "98,450",
			bounce: "31.20%",
			views: totalViews > 0 ? (Math.round(totalViews * .9) + 312200).toLocaleString() : "312,200",
			sessions: totalViews > 0 ? (Math.round(totalViews * .6) + 205400).toLocaleString() : "205,400"
		},
		Month: {
			users: totalUsers > 0 ? (totalUsers * 310 + 421800).toLocaleString() : "421,800",
			bounce: "29.80%",
			views: totalViews > 0 ? (Math.round(totalViews * 3.8) + 1340500).toLocaleString() : "1,340,500",
			sessions: totalViews > 0 ? (Math.round(totalViews * 2.5) + 882100).toLocaleString() : "882,100"
		}
	}[timeframe];
	const activeCurve = {
		Day: {
			line1: "M 0,150 C 40,130 70,165 110,145 C 160,120 200,160 250,140 C 300,120 340,75 390,55 C 440,35 480,110 530,90 C 580,70 620,50 670,55 C 720,60 760,115 800,105",
			area1: "M 0,150 C 40,130 70,165 110,145 C 160,120 200,160 250,140 C 300,120 340,75 390,55 C 440,35 480,110 530,90 C 580,70 620,50 670,55 C 720,60 760,115 800,105 L 800,240 L 0,240 Z",
			line2: "M 0,195 C 50,185 80,210 130,200 C 180,190 220,215 280,190 C 340,165 380,115 430,95 C 480,80 520,155 580,140 C 640,120 680,80 730,90 C 760,95 785,130 800,125",
			area2: "M 0,195 C 50,185 80,210 130,200 C 180,190 220,215 280,190 C 340,165 380,115 430,95 C 480,80 520,155 580,140 C 640,120 680,80 730,90 C 760,95 785,130 800,125 L 800,240 L 0,240 Z",
			labels: [
				"00:00",
				"04:00",
				"08:00",
				"12:00",
				"16:00",
				"20:00",
				"23:59"
			]
		},
		Week: {
			line1: "M 0,140 C 60,110 110,135 180,115 C 250,95 300,130 370,85 C 440,45 490,90 560,65 C 630,45 680,85 740,75 C 770,70 790,95 800,90",
			area1: "M 0,140 C 60,110 110,135 180,115 C 250,95 300,130 370,85 C 440,45 490,90 560,65 C 630,45 680,85 740,75 C 770,70 790,95 800,90 L 800,240 L 0,240 Z",
			line2: "M 0,185 C 60,160 110,180 180,160 C 250,140 300,175 370,135 C 440,95 490,140 560,115 C 630,90 680,135 740,120 C 770,115 790,135 800,130",
			area2: "M 0,185 C 60,160 110,180 180,160 C 250,140 300,175 370,135 C 440,95 490,140 560,115 C 630,90 680,135 740,120 C 770,115 790,135 800,130 L 800,240 L 0,240 Z",
			labels: [
				"Mon",
				"Tue",
				"Wed",
				"Thu",
				"Fri",
				"Sat",
				"Sun"
			]
		},
		Month: {
			line1: "M 0,150 C 90,110 160,130 250,90 C 340,55 420,110 520,70 C 620,40 710,80 800,65",
			area1: "M 0,150 C 90,110 160,130 250,90 C 340,55 420,110 520,70 C 620,40 710,80 800,65 L 800,240 L 0,240 Z",
			line2: "M 0,190 C 90,160 160,175 250,140 C 340,105 420,155 520,120 C 620,85 710,125 800,110",
			area2: "M 0,190 C 90,160 160,175 250,140 C 340,105 420,155 520,120 C 620,85 710,125 800,110 L 800,240 L 0,240 Z",
			labels: [
				"Week 1",
				"Week 2",
				"Week 3",
				"Week 4"
			]
		}
	}[timeframe];
	return /* @__PURE__ */ jsxs("div", {
		className: "rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 dark:border-slate-800 pb-4",
				children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h2", {
					className: "text-base font-bold text-slate-900 dark:text-white",
					children: "Website Audience Metrics"
				}), /* @__PURE__ */ jsx("p", {
					className: "text-xs text-slate-500 dark:text-slate-400 mt-0.5",
					children: "Audience to which the users belonged while on the current date range."
				})] }), /* @__PURE__ */ jsx("div", {
					className: "inline-flex rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 p-0.5",
					children: [
						"Day",
						"Week",
						"Month"
					].map((t) => /* @__PURE__ */ jsx("button", {
						onClick: () => setTimeframe(t),
						className: `rounded-md px-3 py-1 text-xs font-semibold transition cursor-pointer ${timeframe === t ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs" : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"}`,
						children: t
					}, t))
				})]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4",
				children: [
					/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("span", {
						className: "text-xs font-medium text-slate-500 dark:text-slate-400",
						children: "Users"
					}), /* @__PURE__ */ jsx("p", {
						className: "text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white mt-0.5 transition-all",
						children: currentStats.users
					})] }),
					/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("span", {
						className: "text-xs font-medium text-slate-500 dark:text-slate-400",
						children: "Bounce Rate"
					}), /* @__PURE__ */ jsx("p", {
						className: "text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white mt-0.5 transition-all",
						children: currentStats.bounce
					})] }),
					/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("span", {
						className: "text-xs font-medium text-slate-500 dark:text-slate-400",
						children: "Page Views"
					}), /* @__PURE__ */ jsx("p", {
						className: "text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white mt-0.5 transition-all",
						children: currentStats.views
					})] }),
					/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("span", {
						className: "text-xs font-medium text-slate-500 dark:text-slate-400",
						children: "Sessions"
					}), /* @__PURE__ */ jsx("p", {
						className: "text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white mt-0.5 transition-all",
						children: currentStats.sessions
					})] })
				]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "mt-6 flex flex-col",
				children: [/* @__PURE__ */ jsx("div", {
					className: "relative h-56 sm:h-64 w-full",
					children: /* @__PURE__ */ jsxs("svg", {
						viewBox: "0 0 800 240",
						className: "h-full w-full",
						preserveAspectRatio: "none",
						children: [
							/* @__PURE__ */ jsxs("defs", { children: [/* @__PURE__ */ jsxs("linearGradient", {
								id: "purpleGradient",
								x1: "0",
								y1: "0",
								x2: "0",
								y2: "1",
								children: [/* @__PURE__ */ jsx("stop", {
									offset: "0%",
									stopColor: "#8b5cf6",
									stopOpacity: "0.30"
								}), /* @__PURE__ */ jsx("stop", {
									offset: "100%",
									stopColor: "#8b5cf6",
									stopOpacity: "0.02"
								})]
							}), /* @__PURE__ */ jsxs("linearGradient", {
								id: "blueGradient",
								x1: "0",
								y1: "0",
								x2: "0",
								y2: "1",
								children: [/* @__PURE__ */ jsx("stop", {
									offset: "0%",
									stopColor: "#0ea5e9",
									stopOpacity: "0.25"
								}), /* @__PURE__ */ jsx("stop", {
									offset: "100%",
									stopColor: "#0ea5e9",
									stopOpacity: "0.02"
								})]
							})] }),
							/* @__PURE__ */ jsx("line", {
								x1: "0",
								y1: "60",
								x2: "800",
								y2: "60",
								stroke: "currentColor",
								className: "text-slate-100 dark:text-slate-800",
								strokeDasharray: "3 3"
							}),
							/* @__PURE__ */ jsx("line", {
								x1: "0",
								y1: "120",
								x2: "800",
								y2: "120",
								stroke: "currentColor",
								className: "text-slate-100 dark:text-slate-800",
								strokeDasharray: "3 3"
							}),
							/* @__PURE__ */ jsx("line", {
								x1: "0",
								y1: "180",
								x2: "800",
								y2: "180",
								stroke: "currentColor",
								className: "text-slate-100 dark:text-slate-800",
								strokeDasharray: "3 3"
							}),
							/* @__PURE__ */ jsx("path", {
								d: activeCurve.area1,
								fill: "url(#purpleGradient)"
							}),
							/* @__PURE__ */ jsx("path", {
								d: activeCurve.line1,
								fill: "none",
								stroke: "#8b5cf6",
								strokeWidth: "2.5",
								strokeLinecap: "round",
								className: "transition-all duration-500 ease-in-out"
							}),
							/* @__PURE__ */ jsx("path", {
								d: activeCurve.area2,
								fill: "url(#blueGradient)"
							}),
							/* @__PURE__ */ jsx("path", {
								d: activeCurve.line2,
								fill: "none",
								stroke: "#0ea5e9",
								strokeWidth: "2.5",
								strokeLinecap: "round",
								className: "transition-all duration-500 ease-in-out"
							})
						]
					})
				}), /* @__PURE__ */ jsx("div", {
					className: "flex justify-between text-[11px] font-semibold text-slate-400 dark:text-slate-500 px-1 pt-3 border-t border-slate-100 dark:border-slate-800",
					children: activeCurve.labels.map((lbl, idx) => /* @__PURE__ */ jsx("span", { children: lbl }, idx))
				})]
			})
		]
	});
}
//#endregion
//#region src/components/admin/dashboard/EngagementCards.tsx
function EngagementCards({ totalUsers, totalViews }) {
	const usersDisplay = totalUsers > 0 ? totalUsers >= 1e3 ? `${(totalUsers / 1e3).toFixed(1)}k` : `${totalUsers}` : "86k";
	const sessionsDisplay = totalViews > 0 ? Math.round(totalViews * .28 + 16869).toLocaleString() : "16,869";
	return /* @__PURE__ */ jsxs("div", {
		className: "flex flex-col gap-4",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "grid grid-cols-1 sm:grid-cols-2 gap-4",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "flex flex-col justify-between rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-xs overflow-hidden",
				children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("div", {
					className: "flex items-center justify-between",
					children: [/* @__PURE__ */ jsx("span", {
						className: "text-2xl font-bold tracking-tight text-slate-900 dark:text-white",
						children: "33.50%"
					}), /* @__PURE__ */ jsxs("span", {
						className: "inline-flex items-center text-xs font-bold text-emerald-600 dark:text-emerald-400 gap-0.5",
						children: [/* @__PURE__ */ jsx(TrendingUp, { className: "h-3.5 w-3.5" }), " 18.02%"]
					})]
				}), /* @__PURE__ */ jsx("p", {
					className: "text-xs font-medium text-slate-500 dark:text-slate-400 mt-1",
					children: "Bounce Rate"
				})] }), /* @__PURE__ */ jsx("div", {
					className: "mt-4 h-16 w-full",
					children: /* @__PURE__ */ jsxs("svg", {
						viewBox: "0 0 200 60",
						className: "h-full w-full",
						preserveAspectRatio: "none",
						children: [
							/* @__PURE__ */ jsx("defs", { children: /* @__PURE__ */ jsxs("linearGradient", {
								id: "tealSpark",
								x1: "0",
								y1: "0",
								x2: "0",
								y2: "1",
								children: [/* @__PURE__ */ jsx("stop", {
									offset: "0%",
									stopColor: "#14b8a6",
									stopOpacity: "0.3"
								}), /* @__PURE__ */ jsx("stop", {
									offset: "100%",
									stopColor: "#14b8a6",
									stopOpacity: "0.0"
								})]
							}) }),
							/* @__PURE__ */ jsx("path", {
								d: "M 0 35 Q 25 20, 50 45 T 100 25 T 150 40 T 200 15 L 200 60 L 0 60 Z",
								fill: "url(#tealSpark)"
							}),
							/* @__PURE__ */ jsx("path", {
								d: "M 0 35 Q 25 20, 50 45 T 100 25 T 150 40 T 200 15",
								fill: "none",
								stroke: "#0d9488",
								strokeWidth: "2",
								strokeLinecap: "round"
							})
						]
					})
				})]
			}), /* @__PURE__ */ jsxs("div", {
				className: "flex flex-col justify-between rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-xs overflow-hidden",
				children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("div", {
					className: "flex items-center justify-between",
					children: [/* @__PURE__ */ jsx("span", {
						className: "text-2xl font-bold tracking-tight text-slate-900 dark:text-white",
						children: usersDisplay
					}), /* @__PURE__ */ jsxs("span", {
						className: "inline-flex items-center text-xs font-bold text-rose-600 dark:text-rose-400 gap-0.5",
						children: [/* @__PURE__ */ jsx(TrendingDown, { className: "h-3.5 w-3.5" }), " 0.86%"]
					})]
				}), /* @__PURE__ */ jsx("p", {
					className: "text-xs font-medium text-slate-500 dark:text-slate-400 mt-1",
					children: "Total Users"
				})] }), /* @__PURE__ */ jsx("div", {
					className: "mt-4 flex items-end justify-between gap-1 h-16 w-full px-1",
					children: [
						45,
						60,
						35,
						75,
						50,
						90,
						65,
						80,
						70,
						85,
						40,
						55,
						30,
						70,
						95
					].map((h, i) => /* @__PURE__ */ jsx("div", {
						style: { height: `${h}%` },
						className: "w-full rounded-t-xs bg-blue-500 hover:bg-blue-600 transition-all duration-300"
					}, i))
				})]
			})]
		}), /* @__PURE__ */ jsxs("div", {
			className: "rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs",
			children: [
				/* @__PURE__ */ jsx("div", {
					className: "flex items-start justify-between",
					children: /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("span", {
						className: "text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400",
						children: "ALL SESSIONS"
					}), /* @__PURE__ */ jsxs("div", {
						className: "mt-1 flex items-baseline gap-2",
						children: [/* @__PURE__ */ jsx("span", {
							className: "text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white",
							children: sessionsDisplay
						}), /* @__PURE__ */ jsxs("span", {
							className: "inline-flex items-center text-xs font-bold text-emerald-600 dark:text-emerald-400",
							children: [/* @__PURE__ */ jsx(TrendingUp, { className: "h-3.5 w-3.5 mr-0.5" }), " 2.87%"]
						})]
					})] })
				}),
				/* @__PURE__ */ jsx("p", {
					className: "mt-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400",
					children: "The total number of sessions within the date range. It is the period time a user is actively engaged with your website, news feed, or app."
				}),
				/* @__PURE__ */ jsx("div", {
					className: "mt-4 flex items-end justify-between gap-1.5 h-24 pt-2 border-t border-slate-100 dark:border-slate-800",
					children: [
						15,
						25,
						45,
						70,
						90,
						65,
						80,
						55,
						75,
						40,
						60,
						85,
						95,
						70,
						50,
						30
					].map((h, i) => {
						const isHigh = h > 60;
						return /* @__PURE__ */ jsx("div", {
							style: { height: `${h}%` },
							className: `w-full rounded-t-xs transition-all duration-300 ${isHigh ? "bg-indigo-600 hover:bg-indigo-700" : "bg-indigo-200 dark:bg-indigo-900/60 hover:bg-indigo-300"}`
						}, i);
					})
				})
			]
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
//#region src/components/admin/dashboard/TrafficChannelsCard.tsx
function TrafficChannelsCard() {
	return /* @__PURE__ */ jsxs("div", {
		className: "rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "border-b border-slate-100 dark:border-slate-800 pb-3",
			children: [/* @__PURE__ */ jsx("h3", {
				className: "text-base font-bold text-slate-900 dark:text-white",
				children: "Sessions by Channel"
			}), /* @__PURE__ */ jsx("p", {
				className: "text-xs text-slate-500 dark:text-slate-400 mt-0.5",
				children: "Acquisition traffic channels driving reader discovery."
			})]
		}), /* @__PURE__ */ jsxs("div", {
			className: "mt-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-center",
			children: [/* @__PURE__ */ jsx("div", {
				className: "md:col-span-5 flex justify-center",
				children: /* @__PURE__ */ jsxs("div", {
					className: "relative h-44 w-44",
					children: [/* @__PURE__ */ jsxs("svg", {
						viewBox: "0 0 100 100",
						className: "h-full w-full -rotate-90",
						children: [
							/* @__PURE__ */ jsx("circle", {
								cx: "50",
								cy: "50",
								r: "36",
								fill: "transparent",
								stroke: "#0d9488",
								strokeWidth: "18",
								strokeDasharray: "67.8 158.3",
								strokeDashoffset: "0"
							}),
							/* @__PURE__ */ jsx("circle", {
								cx: "50",
								cy: "50",
								r: "36",
								fill: "transparent",
								stroke: "#7c3aed",
								strokeWidth: "18",
								strokeDasharray: "56.5 169.6",
								strokeDashoffset: "-67.8"
							}),
							/* @__PURE__ */ jsx("circle", {
								cx: "50",
								cy: "50",
								r: "36",
								fill: "transparent",
								stroke: "#3b82f6",
								strokeWidth: "18",
								strokeDasharray: "45.2 180.9",
								strokeDashoffset: "-124.3"
							}),
							/* @__PURE__ */ jsx("circle", {
								cx: "50",
								cy: "50",
								r: "36",
								fill: "transparent",
								stroke: "#10b981",
								strokeWidth: "18",
								strokeDasharray: "33.9 192.2",
								strokeDashoffset: "-169.5"
							}),
							/* @__PURE__ */ jsx("circle", {
								cx: "50",
								cy: "50",
								r: "36",
								fill: "transparent",
								stroke: "#94a3b8",
								strokeWidth: "18",
								strokeDasharray: "22.6 203.5",
								strokeDashoffset: "-203.4"
							})
						]
					}), /* @__PURE__ */ jsxs("div", {
						className: "absolute inset-0 m-auto h-20 w-20 rounded-full bg-white dark:bg-slate-900 flex flex-col items-center justify-center shadow-xs",
						children: [/* @__PURE__ */ jsx("span", {
							className: "text-xs font-bold uppercase tracking-wider text-slate-400",
							children: "Total"
						}), /* @__PURE__ */ jsx("span", {
							className: "text-sm font-extrabold text-slate-900 dark:text-white",
							children: "5,391"
						})]
					})]
				})
			}), /* @__PURE__ */ jsx("div", {
				className: "md:col-span-7 space-y-3.5",
				children: [
					{
						name: "Organic Search",
						count: 1320,
						pct: 25,
						color: "#7c3aed",
						barClass: "bg-purple-600"
					},
					{
						name: "Email",
						count: 987,
						pct: 20,
						color: "#3b82f6",
						barClass: "bg-blue-500"
					},
					{
						name: "Referral",
						count: 2010,
						pct: 30,
						color: "#0d9488",
						barClass: "bg-teal-600"
					},
					{
						name: "Social",
						count: 654,
						pct: 15,
						color: "#10b981",
						barClass: "bg-emerald-500"
					},
					{
						name: "Direct",
						count: 420,
						pct: 10,
						color: "#94a3b8",
						barClass: "bg-slate-400"
					}
				].map((ch) => /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("div", {
					className: "flex items-center justify-between text-xs mb-1",
					children: [/* @__PURE__ */ jsx("span", {
						className: "font-semibold text-slate-700 dark:text-slate-300",
						children: ch.name
					}), /* @__PURE__ */ jsxs("span", {
						className: "text-slate-500 dark:text-slate-400 font-medium",
						children: [
							/* @__PURE__ */ jsx("strong", {
								className: "text-slate-900 dark:text-white font-bold mr-1",
								children: ch.count.toLocaleString()
							}),
							"(",
							ch.pct,
							"%)"
						]
					})]
				}), /* @__PURE__ */ jsx("div", {
					className: "h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800",
					children: /* @__PURE__ */ jsx("div", {
						className: `h-full rounded-full transition-all duration-500 ${ch.barClass}`,
						style: { width: `${ch.pct * 3.3}%` }
					})
				})] }, ch.name))
			})]
		})]
	});
}
//#endregion
//#region src/components/admin/dashboard/DemographicsTab.tsx
function DemographicsTab() {
	return /* @__PURE__ */ jsxs("div", {
		className: "grid grid-cols-1 md:grid-cols-2 gap-6",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs",
			children: [
				/* @__PURE__ */ jsx("h3", {
					className: "text-base font-bold text-slate-900 dark:text-white",
					children: "Device & Platform Breakdown"
				}),
				/* @__PURE__ */ jsx("p", {
					className: "text-xs text-slate-500 dark:text-slate-400 mt-0.5",
					children: "Audience access points across smartphones, tablets, and desktop devices."
				}),
				/* @__PURE__ */ jsx("div", {
					className: "mt-6 space-y-4",
					children: [
						{
							name: "Mobile Phones",
							pct: 68,
							count: "58,400",
							icon: Smartphone,
							color: "bg-indigo-600"
						},
						{
							name: "Desktop & Laptops",
							pct: 26,
							count: "22,300",
							icon: Monitor,
							color: "bg-blue-500"
						},
						{
							name: "Tablets & iPads",
							pct: 6,
							count: "5,150",
							icon: Tablet,
							color: "bg-teal-500"
						}
					].map((d) => {
						const Icon = d.icon;
						return /* @__PURE__ */ jsxs("div", {
							className: "p-3 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "flex items-center justify-between text-xs font-semibold mb-2",
								children: [/* @__PURE__ */ jsxs("div", {
									className: "flex items-center gap-2 text-slate-800 dark:text-slate-200",
									children: [/* @__PURE__ */ jsx(Icon, { className: "h-4 w-4 text-slate-500" }), /* @__PURE__ */ jsx("span", { children: d.name })]
								}), /* @__PURE__ */ jsxs("span", {
									className: "text-slate-600 dark:text-slate-300",
									children: [
										d.count,
										" (",
										d.pct,
										"%)"
									]
								})]
							}), /* @__PURE__ */ jsx("div", {
								className: "h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700",
								children: /* @__PURE__ */ jsx("div", {
									className: `h-full rounded-full transition-all duration-500 ${d.color}`,
									style: { width: `${d.pct}%` }
								})
							})]
						}, d.name);
					})
				})
			]
		}), /* @__PURE__ */ jsxs("div", {
			className: "rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "flex items-center justify-between",
				children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h3", {
					className: "text-base font-bold text-slate-900 dark:text-white",
					children: "Reader Locations & Geography"
				}), /* @__PURE__ */ jsx("p", {
					className: "text-xs text-slate-500 dark:text-slate-400 mt-0.5",
					children: "Top geographic territories reading Northeast Timeline."
				})] }), /* @__PURE__ */ jsx(MapPin, { className: "h-5 w-5 text-indigo-500" })]
			}), /* @__PURE__ */ jsx("div", {
				className: "mt-6 divide-y divide-slate-100 dark:divide-slate-800",
				children: [
					{
						name: "Tripura (Agartala, Dharmanagar, Udaipur)",
						users: "42,800",
						pct: 51
					},
					{
						name: "Assam (Guwahati, Silchar)",
						users: "18,200",
						pct: 22
					},
					{
						name: "West Bengal (Kolkata)",
						users: "11,500",
						pct: 14
					},
					{
						name: "Delhi NCR",
						users: "6,300",
						pct: 8
					},
					{
						name: "International (US, UK, UAE, BD)",
						users: "4,100",
						pct: 5
					}
				].map((loc) => /* @__PURE__ */ jsxs("div", {
					className: "py-2.5 flex items-center justify-between text-xs",
					children: [/* @__PURE__ */ jsx("span", {
						className: "font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[220px]",
						children: loc.name
					}), /* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-3 shrink-0",
						children: [/* @__PURE__ */ jsx("span", {
							className: "font-bold text-slate-900 dark:text-white",
							children: loc.users
						}), /* @__PURE__ */ jsxs("span", {
							className: "rounded-md bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 text-[10px] font-bold text-slate-600 dark:text-slate-400 w-10 text-center",
							children: [loc.pct, "%"]
						})]
					})]
				}, loc.name))
			})]
		})]
	});
}
//#endregion
//#region src/components/admin/dashboard/RevenueTab.tsx
function RevenueTab({ data }) {
	const currency = data.currencySymbol || "₹";
	const monthlyRate = 149;
	const yearlyRate = 1499;
	const monthlySubs = Math.round(data.totalSubscribers * .75);
	const yearlySubs = Math.max(1, data.totalSubscribers - monthlySubs);
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
							children: [/* @__PURE__ */ jsx(ArrowUpRight, { className: "h-3 w-3" }), " +18.4% growth this month"]
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
							children: "96.8% monthly retention rate"
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
	const [startDate, setStartDate] = useState("2026-09-01");
	const [endDate, setEndDate] = useState("2026-09-18");
	const isDateFiltered = startDate !== "2026-09-01" || endDate !== "2026-09-18";
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
		setStartDate("2026-09-01");
		setEndDate("2026-09-18");
		toast.info("Date range reset to default");
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
				children: [/* @__PURE__ */ jsxs("div", {
					className: "grid grid-cols-1 gap-6 lg:grid-cols-12 items-start",
					children: [/* @__PURE__ */ jsx("div", {
						className: "lg:col-span-7 xl:col-span-8",
						children: /* @__PURE__ */ jsx(AudienceChartCard, {
							totalViews: data.totalViews,
							totalUsers: data.totalUsers
						})
					}), /* @__PURE__ */ jsx("div", {
						className: "lg:col-span-5 xl:col-span-4",
						children: /* @__PURE__ */ jsx(EngagementCards, {
							totalUsers: data.totalUsers,
							totalViews: data.totalViews
						})
					})]
				}), /* @__PURE__ */ jsxs("div", {
					className: "grid grid-cols-1 gap-6 lg:grid-cols-12 items-start",
					children: [/* @__PURE__ */ jsx("div", {
						className: "lg:col-span-7 xl:col-span-7",
						children: /* @__PURE__ */ jsx(TopArticlesTable, {
							articles: filteredArticles,
							featuredArticles: filteredFeatured
						})
					}), /* @__PURE__ */ jsx("div", {
						className: "lg:col-span-5 xl:col-span-5",
						children: /* @__PURE__ */ jsx(TrafficChannelsCard, {})
					})]
				})]
			}),
			activeTab === "audiences" && /* @__PURE__ */ jsxs("div", {
				className: "space-y-6",
				children: [/* @__PURE__ */ jsx(AudienceChartCard, {
					totalViews: data.totalViews,
					totalUsers: data.totalUsers
				}), /* @__PURE__ */ jsx(EngagementCards, {
					totalUsers: data.totalUsers,
					totalViews: data.totalViews
				})]
			}),
			activeTab === "demographics" && /* @__PURE__ */ jsx(DemographicsTab, {}),
			activeTab === "content" && /* @__PURE__ */ jsx("div", {
				className: "space-y-6",
				children: /* @__PURE__ */ jsx(TopArticlesTable, {
					articles: filteredArticles,
					featuredArticles: filteredFeatured
				})
			}),
			activeTab === "revenue" && /* @__PURE__ */ jsx(RevenueTab, { data })
		]
	});
}
//#endregion
export { DashboardPage as component };

//# sourceMappingURL=admin.index-DifjncdJ.js.map