import { t as Route } from "./admin.index-BPVtY_ti.js";
import { jsx, jsxs } from "react/jsx-runtime";
import { Eye, MessageSquare, Newspaper, TrendingDown, TrendingUp, Users } from "lucide-react";
//#region src/routes/admin.index.tsx?tsr-split=component
function Dashboard() {
	const { totalArticles, totalViews, totalUsers, totalComments, recentArticles, categoryStats } = Route.useLoaderData();
	const stats = [
		{
			label: "Total Articles",
			value: totalArticles.toLocaleString(),
			delta: "+1.2%",
			up: true,
			icon: Newspaper,
			tint: "bg-blue-50 text-blue-600"
		},
		{
			label: "Total Views",
			value: totalViews.toLocaleString(),
			delta: "+8.4%",
			up: true,
			icon: Eye,
			tint: "bg-emerald-50 text-emerald-600"
		},
		{
			label: "Comments",
			value: totalComments.toLocaleString(),
			delta: "0%",
			up: true,
			icon: MessageSquare,
			tint: "bg-amber-50 text-amber-600"
		},
		{
			label: "Users",
			value: totalUsers.toLocaleString(),
			delta: "+0.5%",
			up: true,
			icon: Users,
			tint: "bg-violet-50 text-violet-600"
		}
	];
	const totalCatArticles = categoryStats.reduce((s, c) => s + c.count, 0) || 1;
	return /* @__PURE__ */ jsxs("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h1", {
				className: "text-2xl font-bold tracking-tight",
				children: "Dashboard"
			}), /* @__PURE__ */ jsx("p", {
				className: "text-sm text-slate-500",
				children: "Welcome back. Here's what's happening on News Theme today."
			})] }),
			/* @__PURE__ */ jsx("div", {
				className: "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4",
				children: stats.map((s) => {
					const Icon = s.icon;
					const TrendIcon = s.up ? TrendingUp : TrendingDown;
					return /* @__PURE__ */ jsxs("div", {
						className: "rounded-lg border border-slate-200 bg-white p-5",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "flex items-start justify-between",
							children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("p", {
								className: "text-xs font-medium uppercase tracking-wider text-slate-500",
								children: s.label
							}), /* @__PURE__ */ jsx("p", {
								className: "mt-2 text-2xl font-bold",
								children: s.value
							})] }), /* @__PURE__ */ jsx("div", {
								className: `grid h-10 w-10 place-items-center rounded-md ${s.tint}`,
								children: /* @__PURE__ */ jsx(Icon, { className: "h-5 w-5" })
							})]
						}), /* @__PURE__ */ jsxs("div", {
							className: `mt-3 inline-flex items-center gap-1 text-xs font-medium ${s.up ? "text-emerald-600" : "text-red-600"}`,
							children: [
								/* @__PURE__ */ jsx(TrendIcon, { className: "h-3.5 w-3.5" }),
								s.delta,
								" ",
								/* @__PURE__ */ jsx("span", {
									className: "text-slate-500",
									children: "vs last month"
								})
							]
						})]
					}, s.label);
				})
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "grid grid-cols-1 gap-6 lg:grid-cols-3",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "rounded-lg border border-slate-200 bg-white lg:col-span-2",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "flex items-center justify-between border-b border-slate-200 px-5 py-4",
						children: [/* @__PURE__ */ jsx("h2", {
							className: "font-semibold",
							children: "Recent Articles"
						}), /* @__PURE__ */ jsx("a", {
							href: "/admin/articles",
							className: "text-xs font-medium text-slate-600 hover:text-slate-900",
							children: "View all →"
						})]
					}), /* @__PURE__ */ jsx("ul", {
						className: "divide-y divide-slate-100",
						children: recentArticles.length === 0 ? /* @__PURE__ */ jsx("li", {
							className: "px-5 py-8 text-center text-sm text-slate-500",
							children: "No articles written yet."
						}) : recentArticles.map((a, i) => /* @__PURE__ */ jsxs("li", {
							className: "flex items-center gap-4 px-5 py-3",
							children: [
								a.featuredImage ? /* @__PURE__ */ jsx("img", {
									src: a.featuredImage,
									alt: "",
									className: "h-12 w-16 rounded object-cover"
								}) : /* @__PURE__ */ jsx("div", {
									className: "h-12 w-16 rounded bg-slate-100 flex items-center justify-center text-slate-400 flex-shrink-0",
									children: /* @__PURE__ */ jsx(Newspaper, { className: "h-5 w-5" })
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "min-w-0 flex-1",
									children: [/* @__PURE__ */ jsx("p", {
										className: "text-[10px] font-semibold uppercase tracking-widest text-slate-500",
										children: a.category || "General"
									}), /* @__PURE__ */ jsx("p", {
										className: "truncate text-sm font-medium",
										children: a.title
									})]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "hidden text-right text-xs text-slate-500 sm:block",
									children: [/* @__PURE__ */ jsxs("div", {
										className: "flex items-center justify-end gap-1",
										children: [/* @__PURE__ */ jsx(Eye, { className: "h-3 w-3" }), a.views?.toLocaleString() ?? "0"]
									}), /* @__PURE__ */ jsx("div", { children: new Date(a.date).toLocaleDateString() })]
								})
							]
						}, i))
					})]
				}), /* @__PURE__ */ jsx("div", {
					className: "space-y-6",
					children: /* @__PURE__ */ jsxs("div", {
						className: "rounded-lg border border-slate-200 bg-white",
						children: [/* @__PURE__ */ jsx("div", {
							className: "border-b border-slate-200 px-5 py-4",
							children: /* @__PURE__ */ jsx("h2", {
								className: "font-semibold",
								children: "Top Categories"
							})
						}), /* @__PURE__ */ jsx("ul", {
							className: "divide-y divide-slate-100",
							children: categoryStats.length === 0 ? /* @__PURE__ */ jsx("li", {
								className: "px-5 py-8 text-center text-sm text-slate-500",
								children: "No category data available."
							}) : categoryStats.map((c, i) => {
								const pct = Math.round(c.count / totalCatArticles * 100);
								return /* @__PURE__ */ jsxs("li", {
									className: "px-5 py-3",
									children: [/* @__PURE__ */ jsxs("div", {
										className: "flex items-center justify-between text-sm",
										children: [/* @__PURE__ */ jsx("span", {
											className: "font-medium",
											children: c.name
										}), /* @__PURE__ */ jsxs("span", {
											className: "text-slate-500",
											children: [
												pct,
												"% (",
												c.count,
												")"
											]
										})]
									}), /* @__PURE__ */ jsx("div", {
										className: "mt-2 h-1.5 w-full overflow-hidden rounded bg-slate-100",
										children: /* @__PURE__ */ jsx("div", {
											className: "h-full bg-slate-900",
											style: { width: `${pct}%` }
										})
									})]
								}, i);
							})
						})]
					})
				})]
			})
		]
	});
}
//#endregion
export { Dashboard as component };
