import { A as saveSettings, _ as loadSettings } from "./site-content-BKtfkHB_.js";
import { o as Toggle, t as Card } from "./SettingsHelpers-BJIYOCLZ.js";
import { t as Route } from "./admin.settings-DJEF2wty.js";
import { Suspense, lazy, useEffect, useState } from "react";
import { useNavigate, useRouter } from "@tanstack/react-router";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { BarChart3, DatabaseBackup, Link2, Lock, Save, ShieldCheck, Sparkles, Type, Zap } from "lucide-react";
import { toast } from "sonner";
//#region src/routes/admin.settings.tsx?tsr-split=component
var GeneralSettingsForm = lazy(() => import("./GeneralSettingsForm-CgqKmVHH.js").then((m) => ({ default: m.GeneralSettingsForm })));
var ProtectionSettingsForm = lazy(() => import("./ProtectionSettingsForm-DNZx5Kut.js").then((m) => ({ default: m.ProtectionSettingsForm })));
var FestiveSettingsForm = lazy(() => import("./FestiveSettingsForm-Da4cs1gY.js").then((m) => ({ default: m.FestiveSettingsForm })));
var FontSettingsTab = lazy(() => import("./FontSettingsTab-B0WfDcxz.js").then((m) => ({ default: m.FontSettingsTab })));
var RedirectsAndLinksTab = lazy(() => import("./RedirectsAndLinksTab-CM274nh3.js"));
var IntegrationsTab = lazy(() => import("./IntegrationsTab-BDvOJ6u6.js").then((m) => ({ default: m.IntegrationsTab })));
var ActivateWebsiteTab = lazy(() => import("./ActivateWebsiteTab-BIrZmnSY.js").then((m) => ({ default: m.ActivateWebsiteTab })));
var BackupRestoreTab = lazy(() => import("./BackupRestoreTab-CtOpPOYe.js").then((m) => ({ default: m.BackupRestoreTab })));
function SettingsPage() {
	const { user } = Route.useRouteContext();
	const search = Route.useSearch();
	const navigate = useNavigate();
	const router = useRouter();
	const [s, setS] = useState(() => loadSettings());
	const [tab, setTab] = useState(search.tab || "general");
	const isPremium = [
		"Enterprise",
		"Enterprise+",
		"Premium"
	].includes(s.licenseType || "") || s.licenseRole === "VIP";
	useEffect(() => {
		if (search.tab && search.tab !== tab) setTab(search.tab);
	}, [search.tab]);
	const update = (k, v) => setS((p) => ({
		...p,
		[k]: v
	}));
	const onSave = async () => {
		try {
			await saveSettings(s);
			toast.success("Site settings saved");
			router.invalidate();
		} catch (err) {
			console.error(err);
			toast.error(err.message || "Failed to save settings.");
		}
	};
	return /* @__PURE__ */ jsxs("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4",
				children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h1", {
					className: "text-2xl font-bold tracking-tight text-slate-900",
					children: "Site Settings"
				}), /* @__PURE__ */ jsx("p", {
					className: "text-sm text-slate-500",
					children: "Brand, contact, analytics, verification and login providers."
				})] }), /* @__PURE__ */ jsxs("button", {
					onClick: onSave,
					className: "inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 transition active:scale-95 shrink-0 self-start sm:self-auto",
					children: [/* @__PURE__ */ jsx(Save, { className: "h-4 w-4" }), " Save changes"]
				})]
			}),
			/* @__PURE__ */ jsx("div", {
				className: "flex flex-wrap gap-1.5 rounded-xl border border-slate-200 bg-white p-1.5 shadow-xs",
				children: [
					{
						id: "general",
						label: "General",
						icon: Save
					},
					{
						id: "festive",
						label: "Festive",
						icon: Sparkles
					},
					{
						id: "fonts",
						label: "Fonts",
						icon: Type
					},
					{
						id: "integrations",
						label: "Integrations",
						icon: BarChart3
					},
					{
						id: "protection",
						label: "Protection & Anti-Theft",
						icon: Lock
					},
					{
						id: "speed",
						label: "Speed Up",
						icon: Zap
					},
					{
						id: "links",
						label: "Redirects & Links",
						icon: Link2
					},
					{
						id: "backup",
						label: "System Backup & Restore",
						icon: DatabaseBackup
					},
					{
						id: "activate",
						label: "Activate Website",
						icon: ShieldCheck
					}
				].map((t) => {
					const Icon = t.icon;
					return /* @__PURE__ */ jsxs("button", {
						onClick: () => navigate({
							to: ".",
							search: { tab: t.id }
						}),
						className: `whitespace-nowrap inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition-all ${tab === t.id ? "bg-slate-900 text-white shadow-sm" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"}`,
						children: [
							/* @__PURE__ */ jsx(Icon, { className: "h-3.5 w-3.5 shrink-0" }),
							" ",
							t.label
						]
					}, t.id);
				})
			}),
			/* @__PURE__ */ jsxs(Suspense, {
				fallback: /* @__PURE__ */ jsx("div", {
					className: "p-8 text-center text-slate-500 animate-pulse",
					children: "Loading settings..."
				}),
				children: [
					tab === "general" && /* @__PURE__ */ jsx(GeneralSettingsForm, {}),
					tab === "festive" && /* @__PURE__ */ jsx(FestiveSettingsForm, {}),
					tab === "fonts" && /* @__PURE__ */ jsx(FontSettingsTab, {}),
					tab === "integrations" && /* @__PURE__ */ jsx(IntegrationsTab, {
						s,
						update,
						user
					}),
					tab === "protection" && /* @__PURE__ */ jsx(ProtectionSettingsForm, {
						s,
						update
					}),
					tab === "links" && /* @__PURE__ */ jsx(RedirectsAndLinksTab, {}),
					tab === "activate" && /* @__PURE__ */ jsx(ActivateWebsiteTab, {
						s,
						update
					}),
					tab === "backup" && /* @__PURE__ */ jsx(BackupRestoreTab, {}),
					tab === "speed" && /* @__PURE__ */ jsxs("div", {
						className: "grid gap-6 lg:grid-cols-2",
						children: [/* @__PURE__ */ jsxs(Card, {
							title: "Website Speed Up Options",
							subtitle: "Enable advanced optimization options to boost your website loading time and improve Google PageSpeed scores.",
							children: [
								/* @__PURE__ */ jsx(Toggle, {
									label: "Clean Unused CSS (PurgeCSS)",
									checked: s.cleanUnusedCss,
									onChange: (v) => update("cleanUnusedCss", v),
									hint: "Extract and remove unused CSS selectors from the loaded stylesheets. Helps reduce stylesheet weight by up to 70%."
								}),
								/* @__PURE__ */ jsx(Toggle, {
									label: "Minify JavaScript Files",
									checked: s.minifyJs,
									onChange: (v) => update("minifyJs", v),
									hint: "Compress, mangle, and bundle scripts automatically before outputting. Reduces JS bundle sizes by up to 60%."
								}),
								/* @__PURE__ */ jsx(Toggle, {
									label: "Server-Side Cache (HTML / MySQL Caching)",
									checked: s.serverCacheEnabled,
									onChange: (v) => update("serverCacheEnabled", v),
									hint: "Cache static page outputs and MySQL query results in server memory. Bypasses database queries for consecutive visits."
								}),
								/* @__PURE__ */ jsx(Toggle, {
									label: "Pre-render Pages (Static Site Generation)",
									checked: s.preRenderEnabled,
									onChange: (v) => update("preRenderEnabled", v),
									hint: "Pre-generate static HTML files for top articles and category pages. Delivers instant load times under high traffic spikes."
								})
							]
						}), /* @__PURE__ */ jsx(Card, {
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
										children: "Scheduled Background Optimization is exclusively available on Enterprise and Enterprise+ licenses. Please activate your license to automate daily server maintenance."
									}),
									/* @__PURE__ */ jsx("button", {
										onClick: () => navigate({
											to: ".",
											search: { tab: "activate" }
										}),
										className: "mt-6 inline-flex items-center gap-2 rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800",
										children: "Activate Website"
									})
								]
							}) : /* @__PURE__ */ jsxs(Fragment, { children: [
								/* @__PURE__ */ jsx(Toggle, {
									label: "Enable Daily Scheduled Optimization",
									checked: s.optimizationScheduleEnabled,
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
						})]
					})
				]
			})
		]
	});
}
//#endregion
export { SettingsPage as component };
