import { t as clearAllCachesServer } from "./server-cache-BIJbC5eu.js";
import { o as Toggle, t as Card } from "./SettingsHelpers-BiLtbvpg.js";
import "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { Lock, RefreshCw } from "lucide-react";
import { toast } from "sonner";
//#region src/components/admin/settings/SpeedOptimizationTab.tsx
function SpeedOptimizationTab({ s, update, isPremium, onNavigateActivate }) {
	return /* @__PURE__ */ jsxs("div", {
		className: "grid gap-6 lg:grid-cols-2",
		children: [
			/* @__PURE__ */ jsxs(Card, {
				title: "Website Speed Up Options",
				subtitle: "Enable advanced optimization options to boost your website loading time and improve Google PageSpeed scores.",
				children: [
					/* @__PURE__ */ jsx(Toggle, {
						label: "Clean Unused CSS (PurgeCSS)",
						checked: !!s.cleanUnusedCss,
						onChange: (v) => update("cleanUnusedCss", v),
						hint: "Extract and remove unused CSS selectors from the loaded stylesheets. Helps reduce stylesheet weight by up to 70%."
					}),
					/* @__PURE__ */ jsx(Toggle, {
						label: "Minify JavaScript Files",
						checked: !!s.minifyJs,
						onChange: (v) => update("minifyJs", v),
						hint: "Compress, mangle, and bundle scripts automatically before outputting. Reduces JS bundle sizes by up to 60%."
					}),
					/* @__PURE__ */ jsx(Toggle, {
						label: "Server-Side Cache (HTML / MySQL Caching)",
						checked: !!s.serverCacheEnabled,
						onChange: (v) => update("serverCacheEnabled", v),
						hint: "Cache static page outputs and MySQL query results in server memory. Bypasses database queries for consecutive visits."
					}),
					/* @__PURE__ */ jsx(Toggle, {
						label: "Pre-render Pages (Static Site Generation)",
						checked: !!s.preRenderEnabled,
						onChange: (v) => update("preRenderEnabled", v),
						hint: "Pre-generate static HTML files for top articles and category pages. Delivers instant load times under high traffic spikes."
					})
				]
			}),
			/* @__PURE__ */ jsx(Card, {
				title: "Daily Optimization Schedule",
				subtitle: "Automate background speed optimizations. The website will run compilation, CSS purging, and cache pre-heating daily.",
				children: !isPremium ? /* @__PURE__ */ jsxs("div", {
					className: "flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center",
					children: [
						/* @__PURE__ */ jsx("div", {
							className: "mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-100",
							children: /* @__PURE__ */ jsx(Lock, { className: "h-8 w-8 text-slate-400" })
						}),
						/* @__PURE__ */ jsx("h3", {
							className: "mt-4 text-base font-semibold text-slate-800",
							children: "Premium Feature Locked"
						}),
						/* @__PURE__ */ jsx("p", {
							className: "mt-1 max-w-sm text-sm text-slate-500",
							children: "Scheduled Background Optimization is exclusively available on Enterprise and Enterprise Plus licenses. Please activate your license to automate daily server maintenance."
						}),
						/* @__PURE__ */ jsx("button", {
							onClick: onNavigateActivate,
							className: "mt-6 inline-flex items-center gap-2 rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800",
							children: "Activate Website"
						})
					]
				}) : /* @__PURE__ */ jsxs(Fragment, { children: [
					/* @__PURE__ */ jsx(Toggle, {
						label: "Enable Daily Scheduled Optimization",
						checked: !!s.optimizationScheduleEnabled,
						onChange: (v) => update("optimizationScheduleEnabled", v),
						hint: "Execute optimization routines automatically at the configured time every day."
					}),
					/* @__PURE__ */ jsxs("div", { children: [
						/* @__PURE__ */ jsx("label", {
							className: "mb-1 block text-xs font-medium text-slate-700",
							children: "Daily Execution Time (24h format)"
						}),
						/* @__PURE__ */ jsx("input", {
							type: "time",
							value: s.optimizationScheduleTime || "02:00",
							onChange: (e) => update("optimizationScheduleTime", e.target.value),
							disabled: !s.optimizationScheduleEnabled,
							className: "w-full max-w-[200px] rounded-md border border-slate-200 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none disabled:bg-slate-50 disabled:text-slate-400"
						}),
						/* @__PURE__ */ jsx("p", {
							className: "mt-1 text-[11px] text-slate-500",
							children: "Choose a time of low website traffic (e.g., 2:00 AM) to prevent transient performance impacts."
						})
					] }),
					/* @__PURE__ */ jsxs("div", {
						className: "rounded-md border border-slate-100 bg-slate-50/50 p-3",
						children: [/* @__PURE__ */ jsx("h3", {
							className: "text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1",
							children: "Scheduled Operations"
						}), /* @__PURE__ */ jsxs("ul", {
							className: "list-disc pl-4 text-xs text-slate-500 space-y-1",
							children: [
								/* @__PURE__ */ jsx("li", { children: "Purge unused CSS templates" }),
								/* @__PURE__ */ jsx("li", { children: "Clear expired cache entries and index database entries" }),
								/* @__PURE__ */ jsx("li", { children: "Pre-generate HTML templates for the top 50 articles" }),
								/* @__PURE__ */ jsx("li", { children: "Verify file system health and clear temporary media chunks" })
							]
						})]
					})
				] })
			}),
			/* @__PURE__ */ jsx(Card, {
				title: "Manual Cleanup & Optimization",
				subtitle: "Instantly clear temporary files, purge unused CSS, and reset server caches to improve speed.",
				children: /* @__PURE__ */ jsxs("div", {
					className: "rounded-xl border border-amber-200 bg-amber-50 p-4",
					children: [
						/* @__PURE__ */ jsx("h4", {
							className: "text-sm font-semibold text-amber-900 mb-1",
							children: "Clean Website Cache"
						}),
						/* @__PURE__ */ jsx("p", {
							className: "text-xs text-amber-700 mb-4",
							children: "Click this button if your recent changes aren't appearing or if the website feels sluggish. It will remove temporary files, unused cache data, and unused CSS to speed up the website."
						}),
						/* @__PURE__ */ jsxs("button", {
							onClick: async () => {
								try {
									const res = await clearAllCachesServer();
									for (let i = localStorage.length - 1; i >= 0; i--) {
										const key = localStorage.key(i);
										if (key && (key.startsWith("nt:") || key.startsWith("nt_"))) {
											if (key !== "nt_media_library_v1") localStorage.removeItem(key);
										}
									}
									toast.success(res.message || "Website cache successfully cleared!");
									setTimeout(() => window.location.reload(), 1500);
								} catch (e) {
									toast.error("Failed to clear website cache.");
								}
							},
							className: "inline-flex items-center gap-2 rounded-md bg-amber-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-amber-700 transition",
							children: [/* @__PURE__ */ jsx(RefreshCw, { className: "h-4 w-4" }), " Clean & Speed Up Website"]
						})
					]
				})
			})
		]
	});
}
//#endregion
export { SpeedOptimizationTab, SpeedOptimizationTab as default };

//# sourceMappingURL=SpeedOptimizationTab-DFemaZ1d.js.map