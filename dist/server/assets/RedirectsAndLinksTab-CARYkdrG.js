import { D as scanBrokenLinksServer, a as getRedirectRulesServer, n as fixBrokenLinkServer, w as saveRedirectRulesServer } from "./site-content-C2lyfs6Q.js";
import { t as Card } from "./SettingsHelpers-OyiB6UV8.js";
import { useEffect, useState } from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { CheckCircle, Plus, RefreshCw, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";
//#region src/components/admin/settings/RedirectsAndLinksTab.tsx
function RedirectsAndLinksTab() {
	const [rules, setRules] = useState([]);
	const [newSource, setNewSource] = useState("");
	const [newDestination, setNewDestination] = useState("");
	const [scanning, setScanning] = useState(false);
	const [brokenLinks, setBrokenLinks] = useState([]);
	const [hasScanned, setHasScanned] = useState(false);
	const [fixingId, setFixingId] = useState(null);
	useEffect(() => {
		getRedirectRulesServer().then((data) => setRules(data)).catch(() => {});
	}, []);
	const handleAddRedirect = async () => {
		if (!newSource || !newDestination) return toast.error("Both source and destination URLs are required");
		let src = newSource.trim();
		if (!src.startsWith("/") && !src.startsWith("http")) src = "/" + src;
		let dest = newDestination.trim();
		if (!dest.startsWith("/") && !dest.startsWith("http")) dest = "/" + dest;
		const updated = [{
			id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
			source: src,
			destination: dest,
			hits: 0,
			createdAt: (/* @__PURE__ */ new Date()).toISOString()
		}, ...rules];
		setRules(updated);
		try {
			await saveRedirectRulesServer({ data: updated });
			toast.success("Redirect rule added successfully!");
			setNewSource("");
			setNewDestination("");
		} catch {
			toast.error("Failed to save redirect rules to database");
		}
	};
	const handleDeleteRedirect = async (id) => {
		const updated = rules.filter((r) => r.id !== id);
		setRules(updated);
		try {
			await saveRedirectRulesServer({ data: updated });
			toast.success("Redirect rule deleted");
		} catch {
			toast.error("Failed to update database");
		}
	};
	const handleScanLinks = async () => {
		setScanning(true);
		setHasScanned(false);
		try {
			const result = await scanBrokenLinksServer();
			setBrokenLinks(result);
			setHasScanned(true);
			toast.success(`Scan completed. Found ${result.length} broken links.`);
		} catch (err) {
			toast.error(err.message || "Failed to scan database for broken links");
		} finally {
			setScanning(false);
		}
	};
	const handleAutoFix = async (item) => {
		if (!item.suggestedFix) return toast.error("No correction suggested for this link");
		setFixingId(item.id);
		try {
			await fixBrokenLinkServer({ data: {
				articleId: item.articleId,
				brokenUrl: item.brokenUrl,
				correctedUrl: item.suggestedFix
			} });
			toast.success("Link auto-corrected in database!");
			setBrokenLinks((prev) => prev.filter((b) => b.id !== item.id));
		} catch (err) {
			toast.error(err.message || "Failed to correct link");
		} finally {
			setFixingId(null);
		}
	};
	return /* @__PURE__ */ jsx("div", {
		className: "space-y-6",
		children: /* @__PURE__ */ jsxs("div", {
			className: "grid gap-6 lg:grid-cols-2",
			children: [/* @__PURE__ */ jsxs(Card, {
				title: "Custom URL Redirect Manager",
				subtitle: "Configure 301 (Permanent) redirects from old or broken URLs to active pages. Useful for SEO migrations.",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "rounded-md border border-slate-100 bg-slate-50 p-4 space-y-3",
					children: [
						/* @__PURE__ */ jsx("h3", {
							className: "text-xs font-semibold uppercase tracking-wider text-slate-500",
							children: "Add Redirect Rule"
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "grid gap-3 sm:grid-cols-2",
							children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
								className: "mb-1 block text-xs font-medium text-slate-700",
								children: "Source Path (e.g. /old-slug)"
							}), /* @__PURE__ */ jsx("input", {
								type: "text",
								value: newSource,
								onChange: (e) => setNewSource(e.target.value),
								placeholder: "/old-page-name",
								className: "w-full rounded-md border border-slate-200 px-3 py-1.5 text-xs focus:border-slate-900 focus:outline-none"
							})] }), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
								className: "mb-1 block text-xs font-medium text-slate-700",
								children: "Destination (e.g. /about)"
							}), /* @__PURE__ */ jsx("input", {
								type: "text",
								value: newDestination,
								onChange: (e) => setNewDestination(e.target.value),
								placeholder: "/news/new-slug",
								className: "w-full rounded-md border border-slate-200 px-3 py-1.5 text-xs focus:border-slate-950 focus:outline-none"
							})] })]
						}),
						/* @__PURE__ */ jsxs("button", {
							onClick: handleAddRedirect,
							className: "inline-flex items-center gap-1.5 rounded-md bg-slate-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-slate-800",
							children: [/* @__PURE__ */ jsx(Plus, { className: "h-3.5 w-3.5" }), " Add redirect"]
						})
					]
				}), /* @__PURE__ */ jsx("div", {
					className: "mt-4 overflow-hidden rounded-md border border-slate-200 bg-white",
					children: /* @__PURE__ */ jsxs("table", {
						className: "min-w-full divide-y divide-slate-200 text-left text-xs",
						children: [/* @__PURE__ */ jsx("thead", {
							className: "bg-slate-50 font-semibold text-slate-700",
							children: /* @__PURE__ */ jsxs("tr", { children: [
								/* @__PURE__ */ jsx("th", {
									className: "px-4 py-2",
									children: "Source Path"
								}),
								/* @__PURE__ */ jsx("th", {
									className: "px-4 py-2",
									children: "Redirects To"
								}),
								/* @__PURE__ */ jsx("th", {
									className: "px-4 py-2 text-center",
									children: "Hits"
								}),
								/* @__PURE__ */ jsx("th", {
									className: "px-4 py-2 text-right",
									children: "Action"
								})
							] })
						}), /* @__PURE__ */ jsx("tbody", {
							className: "divide-y divide-slate-200 text-slate-600",
							children: rules.length === 0 ? /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", {
								colSpan: 4,
								className: "px-4 py-6 text-center text-slate-400",
								children: "No redirects defined. Add one above."
							}) }) : rules.map((r) => /* @__PURE__ */ jsxs("tr", {
								className: "hover:bg-slate-50/50",
								children: [
									/* @__PURE__ */ jsx("td", {
										className: "px-4 py-2 font-mono text-[11px] max-w-[150px] truncate",
										title: r.source,
										children: r.source
									}),
									/* @__PURE__ */ jsx("td", {
										className: "px-4 py-2 font-mono text-[11px] max-w-[150px] truncate",
										title: r.destination,
										children: r.destination
									}),
									/* @__PURE__ */ jsx("td", {
										className: "px-4 py-2 text-center font-semibold text-slate-950 tabular-nums",
										children: r.hits || 0
									}),
									/* @__PURE__ */ jsx("td", {
										className: "px-4 py-2 text-right",
										children: /* @__PURE__ */ jsx("button", {
											onClick: () => handleDeleteRedirect(r.id),
											className: "text-red-600 hover:text-red-800 p-1",
											title: "Delete redirect",
											children: /* @__PURE__ */ jsx(Trash2, { className: "h-3.5 w-3.5" })
										})
									})
								]
							}, r.id))
						})]
					})
				})]
			}), /* @__PURE__ */ jsxs(Card, {
				title: "Broken Link Scanner & Auto-Fixer",
				subtitle: "Scan your published articles for broken internal links and auto-correct them to active pages.",
				children: [/* @__PURE__ */ jsx("div", {
					className: "flex flex-wrap gap-2",
					children: /* @__PURE__ */ jsx("button", {
						onClick: handleScanLinks,
						disabled: scanning,
						className: "inline-flex items-center gap-2 rounded-md bg-slate-950 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800 disabled:opacity-50",
						children: scanning ? /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(RefreshCw, { className: "h-3.5 w-3.5 animate-spin" }), " Scanning Database..."] }) : /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(Search, { className: "h-3.5 w-3.5" }), " Scan Website Links"] })
					})
				}), /* @__PURE__ */ jsx("div", {
					className: "mt-4 overflow-hidden rounded-md border border-slate-200 bg-white",
					children: /* @__PURE__ */ jsxs("table", {
						className: "min-w-full divide-y divide-slate-200 text-left text-xs",
						children: [/* @__PURE__ */ jsx("thead", {
							className: "bg-slate-50 font-semibold text-slate-700",
							children: /* @__PURE__ */ jsxs("tr", { children: [
								/* @__PURE__ */ jsx("th", {
									className: "px-4 py-2",
									children: "Article / Location"
								}),
								/* @__PURE__ */ jsx("th", {
									className: "px-4 py-2",
									children: "Broken Link URL"
								}),
								/* @__PURE__ */ jsx("th", {
									className: "px-4 py-2",
									children: "Suggested Fix"
								}),
								/* @__PURE__ */ jsx("th", {
									className: "px-4 py-2 text-right",
									children: "Action"
								})
							] })
						}), /* @__PURE__ */ jsx("tbody", {
							className: "divide-y divide-slate-200 text-slate-600",
							children: !hasScanned && !scanning ? /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", {
								colSpan: 4,
								className: "px-4 py-6 text-center text-slate-400",
								children: "Click the scan button above to detect broken links in articles."
							}) }) : scanning ? /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsxs("td", {
								colSpan: 4,
								className: "px-4 py-8 text-center text-slate-500",
								children: [/* @__PURE__ */ jsx(RefreshCw, { className: "mx-auto h-5 w-5 animate-spin text-slate-400 mb-2" }), "Parsing content database..."]
							}) }) : brokenLinks.length === 0 ? /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsxs("td", {
								colSpan: 4,
								className: "px-4 py-6 text-center text-emerald-600 font-semibold flex items-center justify-center gap-1.5",
								children: [/* @__PURE__ */ jsx(CheckCircle, { className: "h-4 w-4" }), " Perfect SEO Health! No broken links found."]
							}) }) : brokenLinks.map((b) => /* @__PURE__ */ jsxs("tr", {
								className: "hover:bg-slate-50/50",
								children: [
									/* @__PURE__ */ jsxs("td", {
										className: "px-4 py-3",
										children: [/* @__PURE__ */ jsx("p", {
											className: "font-semibold text-slate-900 max-w-[160px] truncate",
											title: b.articleTitle,
											children: b.articleTitle
										}), /* @__PURE__ */ jsxs("p", {
											className: "text-[10px] text-slate-400 font-mono",
											children: ["ID: ", b.articleId]
										})]
									}),
									/* @__PURE__ */ jsx("td", {
										className: "px-4 py-3 font-mono text-[11px] text-red-600 max-w-[150px] truncate",
										title: b.brokenUrl,
										children: b.brokenUrl
									}),
									/* @__PURE__ */ jsx("td", {
										className: "px-4 py-3",
										children: b.suggestedFix ? /* @__PURE__ */ jsx("span", {
											className: "font-mono text-[11px] text-slate-900 bg-slate-100 px-1.5 py-0.5 rounded",
											title: b.suggestedFix,
											children: b.suggestedFix
										}) : /* @__PURE__ */ jsx("span", {
											className: "text-[11px] text-slate-400 italic",
											children: "None found"
										})
									}),
									/* @__PURE__ */ jsx("td", {
										className: "px-4 py-3 text-right",
										children: b.suggestedFix ? /* @__PURE__ */ jsx("button", {
											onClick: () => handleAutoFix(b),
											disabled: fixingId === b.id,
											className: "rounded bg-slate-950 px-2.5 py-1 text-[10px] font-bold text-white hover:bg-slate-800 disabled:opacity-50",
											children: fixingId === b.id ? "Fixing..." : "Auto-Fix"
										}) : /* @__PURE__ */ jsx("span", {
											className: "text-[10px] text-slate-400 italic",
											children: "No suggestion"
										})
									})
								]
							}, b.id))
						})]
					})
				})]
			})]
		})
	});
}
//#endregion
export { RedirectsAndLinksTab, RedirectsAndLinksTab as default };
