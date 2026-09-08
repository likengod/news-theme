import { i as createServerFn } from "./esm-Dova13aH.js";
import { k as createSsrRpc } from "./site-content-CVkCGhTi.js";
import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { CheckCircle2, ChevronDown, ChevronUp, Clock, Download, Layers, Loader2, RefreshCw, Rocket, Terminal, XCircle, Zap } from "lucide-react";
import { toast } from "sonner";
//#region src/lib/deploy.functions.ts
var getGitStatus = createServerFn({ method: "GET" }).handler(createSsrRpc("8a1c5ef143a372c0240b9c8c466dad42d616ff503a5362ba972f6f98c5b19b6e"));
var gitPull = createServerFn({ method: "POST" }).handler(createSsrRpc("ce1125864efa76115c34ea2a60564fcb9d798efd40778bdc464f77843b17ea5a"));
createServerFn({ method: "POST" }).handler(createSsrRpc("a747fffbbe483f1e7dd71777de6f5a0b47369156a453a555650c7cf2bb6719ef"));
var getDeployHistory = createServerFn({ method: "GET" }).handler(createSsrRpc("c45cee029994ab43bbe6ad2c83b81e99d5008c5b979f02b4994e34820d8fb69d"));
var getDeployLog = createServerFn({ method: "GET" }).validator((id) => id).handler(createSsrRpc("a5ad24c30f372a03151c7dc3f1f8332cdb02d7e67e7bc64a72c494b6ce88400e"));
createServerFn({ method: "POST" }).handler(createSsrRpc("069cbb24882dfa4dfd6a2737fc931ba8108762e6eece4c0c926b3aba2a060164"));
//#endregion
//#region src/routes/admin.updates.tsx?tsr-split=component
var STATUS_STYLE = {
	Success: {
		bg: "bg-emerald-100",
		text: "text-emerald-700",
		icon: CheckCircle2
	},
	Pulled: {
		bg: "bg-blue-100",
		text: "text-blue-700",
		icon: Download
	},
	"Up-to-date": {
		bg: "bg-slate-100",
		text: "text-slate-600",
		icon: CheckCircle2
	},
	Building: {
		bg: "bg-amber-100",
		text: "text-amber-700",
		icon: Loader2
	},
	Failed: {
		bg: "bg-red-100",
		text: "text-red-700",
		icon: XCircle
	},
	Pending: {
		bg: "bg-slate-100",
		text: "text-slate-500",
		icon: Clock
	}
};
function UpdatesPage() {
	useNavigate();
	const [gitStatus, setGitStatus] = useState(null);
	const [deployments, setDeployments] = useState([]);
	const [loading, setLoading] = useState(true);
	const [pulling, setPulling] = useState(false);
	const [building, setBuilding] = useState(false);
	const [expandedLog, setExpandedLog] = useState(null);
	const [logContent, setLogContent] = useState("");
	const [buildOutput, setBuildOutput] = useState("");
	const refresh = async () => {
		setLoading(true);
		try {
			const [statusRes, historyRes] = await Promise.all([getGitStatus(), getDeployHistory()]);
			setGitStatus(statusRes);
			setDeployments(historyRes.deployments ?? []);
		} catch (err) {
			toast.error("Failed to load status: " + err.message);
		} finally {
			setLoading(false);
		}
	};
	useEffect(() => {
		refresh();
	}, []);
	const handlePullAndUpdate = async () => {
		setPulling(true);
		try {
			if ((await gitPull()).updated) {
				toast.success(`Updated to latest release! Reloading in 3 seconds...`);
				setTimeout(() => {
					window.location.reload();
				}, 3e3);
			} else toast.info("System core is already up to date");
			await refresh();
		} catch (err) {
			toast.error("Update failed: " + err.message);
		} finally {
			setPulling(false);
		}
	};
	const viewLog = async (id) => {
		if (expandedLog === id) {
			setExpandedLog(null);
			return;
		}
		try {
			setLogContent((await getDeployLog({ data: id }))?.build_log || "No log available");
			setExpandedLog(id);
		} catch {
			setLogContent("Failed to load log");
			setExpandedLog(id);
		}
	};
	const currentVersion = gitStatus?.version || "v1.0.13";
	const latestVersion = gitStatus?.latestVersion || currentVersion;
	const hasNewVersion = Boolean(gitStatus?.hasNewVersion || latestVersion !== currentVersion);
	const updatesAvailable = (gitStatus?.behind ?? 0) > 0 || hasNewVersion;
	gitStatus?.behind && gitStatus.behind > 0 && gitStatus.behind;
	return /* @__PURE__ */ jsxs("div", {
		className: "space-y-8 pb-12",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "flex items-center justify-between border-b border-slate-200/80 pb-4",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-2.5 text-xs font-semibold uppercase tracking-widest text-slate-500",
					children: [/* @__PURE__ */ jsx(Layers, { className: "h-4 w-4 text-slate-600" }), /* @__PURE__ */ jsx("span", { children: "System Core Update" })]
				}), /* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-3",
					children: [updatesAvailable ? /* @__PURE__ */ jsxs("button", {
						onClick: handlePullAndUpdate,
						disabled: pulling || building,
						className: "flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-red-700 active:bg-red-800 disabled:opacity-60 cursor-pointer",
						children: [pulling || building ? /* @__PURE__ */ jsx(Loader2, { className: "h-4 w-4 animate-spin text-white" }) : /* @__PURE__ */ jsx(Zap, { className: "h-4 w-4 fill-white text-white" }), /* @__PURE__ */ jsx("span", { children: pulling || building ? "Updating System..." : `Update Now ${latestVersion}` })]
					}) : /* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-2 rounded-xl bg-slate-100 px-4 py-2 text-xs font-bold text-slate-500 border border-slate-200",
						children: [/* @__PURE__ */ jsx(CheckCircle2, { className: "h-4 w-4 text-emerald-500" }), /* @__PURE__ */ jsxs("span", { children: [
							"Updated (",
							currentVersion,
							")"
						] })]
					}), /* @__PURE__ */ jsx("button", {
						onClick: refresh,
						disabled: loading,
						className: "flex items-center gap-1.5 rounded-full border border-slate-200 bg-white p-2 text-xs font-medium text-slate-600 shadow-sm transition hover:bg-slate-50 disabled:opacity-50 cursor-pointer",
						children: /* @__PURE__ */ jsx(RefreshCw, { className: `h-4 w-4 ${loading ? "animate-spin" : ""}` })
					})]
				})]
			}),
			buildOutput && /* @__PURE__ */ jsxs("div", {
				className: "rounded-2xl border border-slate-800 bg-slate-950 p-6 shadow-xl",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "mb-4 flex items-center justify-between border-b border-slate-800 pb-3",
					children: [/* @__PURE__ */ jsxs("span", {
						className: "flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400",
						children: [/* @__PURE__ */ jsx(Terminal, { className: "h-4 w-4 text-emerald-400" }), " Live Build Output"]
					}), /* @__PURE__ */ jsx("span", {
						className: "text-[10px] font-mono text-slate-500",
						children: "npm run build"
					})]
				}), /* @__PURE__ */ jsx("pre", {
					className: "max-h-80 overflow-auto whitespace-pre-wrap font-mono text-xs leading-relaxed text-emerald-400",
					children: buildOutput
				})]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "rounded-2xl border border-slate-200/80 bg-white shadow-sm overflow-hidden",
				children: [/* @__PURE__ */ jsx("div", {
					className: "border-b border-slate-100 px-6 py-4",
					children: /* @__PURE__ */ jsxs("h3", {
						className: "flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-600",
						children: [/* @__PURE__ */ jsx(Clock, { className: "h-4 w-4 text-slate-500" }), "Deployment & Patch History"]
					})
				}), deployments.length === 0 ? /* @__PURE__ */ jsxs("div", {
					className: "flex flex-col items-center justify-center py-12 text-slate-400",
					children: [
						/* @__PURE__ */ jsx(Rocket, { className: "mb-2 h-8 w-8 opacity-30" }),
						/* @__PURE__ */ jsx("p", {
							className: "text-sm font-semibold",
							children: "No deployments recorded"
						}),
						/* @__PURE__ */ jsx("p", {
							className: "text-xs",
							children: "Click \"Update Now\" or \"Build Production Bundle\" to create a record."
						})
					]
				}) : /* @__PURE__ */ jsx("ul", {
					className: "divide-y divide-slate-100",
					children: deployments.slice(0, 1).map((d) => {
						const style = STATUS_STYLE[d.status] ?? STATUS_STYLE.Pending;
						const Icon = style.icon;
						const isExpanded = expandedLog === d.id;
						return /* @__PURE__ */ jsxs("li", { children: [/* @__PURE__ */ jsxs("div", {
							className: "flex cursor-pointer items-center gap-4 px-6 py-4 transition hover:bg-slate-50/80",
							onClick: () => viewLog(d.id),
							children: [
								/* @__PURE__ */ jsx("span", {
									className: `flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${style.bg}`,
									children: /* @__PURE__ */ jsx(Icon, { className: `h-4 w-4 ${style.text} ${d.status === "Building" ? "animate-spin" : ""}` })
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "min-w-0 flex-1",
									children: [/* @__PURE__ */ jsxs("div", {
										className: "flex flex-wrap items-center gap-2",
										children: [
											/* @__PURE__ */ jsx("span", {
												className: "font-mono text-xs font-bold text-slate-800",
												children: d.commit_hash
											}),
											/* @__PURE__ */ jsx("span", {
												className: `rounded-full px-2.5 py-0.5 text-[10px] font-extrabold uppercase ${style.bg} ${style.text}`,
												children: d.status
											}),
											/* @__PURE__ */ jsx("span", {
												className: "rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600",
												children: d.branch
											})
										]
									}), /* @__PURE__ */ jsx("p", {
										className: "mt-1 truncate text-xs text-slate-500",
										children: d.commit_message || "System update / manual build"
									})]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "hidden shrink-0 text-right text-xs text-slate-400 sm:block",
									children: [/* @__PURE__ */ jsx("p", {
										className: "font-medium text-slate-600",
										children: new Date(d.started_at).toLocaleString("en-IN", {
											dateStyle: "medium",
											timeStyle: "short"
										})
									}), /* @__PURE__ */ jsxs("p", {
										className: "text-[10px] text-slate-400",
										children: ["by ", d.triggered_by]
									})]
								}),
								isExpanded ? /* @__PURE__ */ jsx(ChevronUp, { className: "h-4 w-4 text-slate-400" }) : /* @__PURE__ */ jsx(ChevronDown, { className: "h-4 w-4 text-slate-400" })
							]
						}), isExpanded && /* @__PURE__ */ jsx("div", {
							className: "border-t border-slate-800 bg-slate-950 px-6 py-4",
							children: /* @__PURE__ */ jsx("pre", {
								className: "max-h-64 overflow-auto whitespace-pre-wrap font-mono text-xs text-emerald-400 leading-relaxed",
								children: logContent
							})
						})] }, d.id);
					})
				})]
			})
		]
	});
}
//#endregion
export { UpdatesPage as component };
