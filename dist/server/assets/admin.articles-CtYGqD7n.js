import { f as sections, p as slugify } from "./db.server-Chz3iTW3.js";
import { t as useServerFn } from "./useServerFn-BqzygRuj.js";
import { a as getAllAdminArticles, l as importAdminArticles, n as deleteAdminArticlesBulk, r as getAdminArticles, t as deleteAdminArticle, u as saveAdminArticle } from "./articles.functions-B2Y46yAl.js";
import { t as blankRow } from "./articles-store-Dl5HoC3x.js";
import { t as CsvImportExport } from "./CsvImportExport-DBalmz2g.js";
import { Suspense, lazy, useCallback, useEffect, useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
import { AlertTriangle, CheckCircle2, ChevronLeft, ChevronRight, Clock, Eye, FileText, Files, Image, Loader2, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";
//#region src/hooks/useDebounce.ts
/**
* Delays updating the returned value until `delay` ms have elapsed
* since the last change. Use this to debounce search inputs so we
* don't fire a server request on every keystroke.
*/
function useDebounce(value, delay = 300) {
	const [debounced, setDebounced] = useState(value);
	useEffect(() => {
		const timer = setTimeout(() => setDebounced(value), delay);
		return () => clearTimeout(timer);
	}, [value, delay]);
	return debounced;
}
//#endregion
//#region src/components/admin/ConfirmModal.tsx
/**
* Replaces browser-native confirm() dialogs with a clean, accessible modal.
* Use this for any destructive action (delete, bulk delete, etc.)
*/
function ConfirmModal({ title, message, confirmLabel = "Confirm", cancelLabel = "Cancel", danger = true, onConfirm, onCancel }) {
	return /* @__PURE__ */ jsx("div", {
		className: "fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm",
		onClick: (e) => {
			if (e.target === e.currentTarget) onCancel();
		},
		children: /* @__PURE__ */ jsxs("div", {
			className: "w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl ring-1 ring-slate-200",
			children: [
				/* @__PURE__ */ jsx("div", {
					className: `mb-4 flex h-11 w-11 items-center justify-center rounded-full ${danger ? "bg-red-100" : "bg-slate-100"}`,
					children: danger ? /* @__PURE__ */ jsx(AlertTriangle, { className: "h-5 w-5 text-red-600" }) : /* @__PURE__ */ jsx(Trash2, { className: "h-5 w-5 text-slate-600" })
				}),
				/* @__PURE__ */ jsx("h2", {
					className: "text-base font-bold text-slate-800",
					children: title
				}),
				/* @__PURE__ */ jsx("p", {
					className: "mt-1.5 text-sm text-slate-500",
					children: message
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "mt-5 flex gap-3",
					children: [/* @__PURE__ */ jsx("button", {
						onClick: onConfirm,
						className: `flex-1 rounded-lg py-2.5 text-sm font-semibold text-white transition ${danger ? "bg-red-600 hover:bg-red-700" : "bg-slate-900 hover:bg-slate-800"}`,
						children: confirmLabel
					}), /* @__PURE__ */ jsx("button", {
						onClick: onCancel,
						className: "flex-1 rounded-lg border border-slate-200 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50",
						children: cancelLabel
					})]
				})
			]
		})
	});
}
//#endregion
//#region src/routes/admin.articles.tsx?tsr-split=component
var STATUS_TABS = [
	{
		key: "All",
		label: "All",
		icon: Files
	},
	{
		key: "Published",
		label: "Published",
		icon: CheckCircle2
	},
	{
		key: "Draft",
		label: "Drafts",
		icon: FileText
	},
	{
		key: "Review",
		label: "In Review",
		icon: Clock
	}
];
var ArticleEditor = lazy(() => import("./ArticleEditor-DIsBd7M_.js"));
var PAGE_SIZE = 20;
function ArticlesPage() {
	const fetchArticlesFn = useServerFn(getAdminArticles);
	const saveArticleFn = useServerFn(saveAdminArticle);
	const deleteArticleFn = useServerFn(deleteAdminArticle);
	const deleteArticlesBulkFn = useServerFn(deleteAdminArticlesBulk);
	const getAllArticlesFn = useServerFn(getAllAdminArticles);
	const importArticlesFn = useServerFn(importAdminArticles);
	const [rows, setRows] = useState([]);
	const [total, setTotal] = useState(0);
	const [totalPages, setTotalPages] = useState(1);
	const [loading, setLoading] = useState(true);
	const [q, setQ] = useState("");
	const [cat, setCat] = useState("All");
	const [status, setStatus] = useState("All");
	const [page, setPage] = useState(1);
	const debouncedQ = useDebounce(q, 300);
	const [selected, setSelected] = useState(/* @__PURE__ */ new Set());
	const [editing, setEditing] = useState(null);
	const [creating, setCreating] = useState(false);
	const [confirmAction, setConfirmAction] = useState(null);
	const fetchArticles = useCallback(async () => {
		try {
			setLoading(true);
			const res = await fetchArticlesFn({ data: {
				q: debouncedQ,
				category: cat,
				status,
				page,
				limit: PAGE_SIZE
			} });
			setRows(res.rows ?? []);
			setTotal(res.total ?? 0);
			setTotalPages(res.totalPages ?? 1);
		} catch (err) {
			toast.error(err.message || "Failed to load articles");
		} finally {
			setLoading(false);
		}
	}, [
		debouncedQ,
		cat,
		status,
		page
	]);
	const handleImport = async (data) => {
		try {
			setLoading(true);
			await importArticlesFn({ data });
			await fetchArticles();
		} catch (err) {
			toast.error(err.message || "Import failed");
		} finally {
			setLoading(false);
		}
	};
	useEffect(() => {
		fetchArticles();
	}, [fetchArticles]);
	useEffect(() => {
		setPage(1);
	}, [
		debouncedQ,
		cat,
		status
	]);
	const pageIds = rows.map((r) => r.id);
	const allOnPageSelected = pageIds.length > 0 && pageIds.every((id) => selected.has(id));
	const someSelected = selected.size > 0;
	const togglePage = () => {
		setSelected((prev) => {
			const next = new Set(prev);
			if (allOnPageSelected) pageIds.forEach((id) => next.delete(id));
			else pageIds.forEach((id) => next.add(id));
			return next;
		});
	};
	const toggleOne = (id) => {
		setSelected((prev) => {
			const next = new Set(prev);
			next.has(id) ? next.delete(id) : next.add(id);
			return next;
		});
	};
	const requestDelete = (id, title) => {
		setConfirmAction({
			title: "Delete Article?",
			message: `"${title}" will be permanently deleted. This cannot be undone.`,
			confirmLabel: "Delete",
			onConfirm: async () => {
				setConfirmAction(null);
				try {
					await deleteArticleFn({ data: id });
					setSelected((prev) => {
						const n = new Set(prev);
						n.delete(id);
						return n;
					});
					toast.success("Article deleted");
					fetchArticles();
				} catch (err) {
					toast.error(err.message || "Failed to delete article");
				}
			}
		});
	};
	const requestBulkDelete = () => {
		if (selected.size === 0) return;
		setConfirmAction({
			title: `Delete ${selected.size} article(s)?`,
			message: "All selected articles will be permanently deleted. This cannot be undone.",
			confirmLabel: `Delete ${selected.size}`,
			onConfirm: async () => {
				setConfirmAction(null);
				try {
					await deleteArticlesBulkFn({ data: Array.from(selected) });
					toast.success(`${selected.size} article(s) deleted`);
					setSelected(/* @__PURE__ */ new Set());
					fetchArticles();
				} catch (err) {
					toast.error(err.message || "Failed to delete articles");
				}
			}
		});
	};
	const save = async (r) => {
		try {
			await saveArticleFn({ data: {
				...r,
				slug: r.slug || slugify(r.title),
				ogImage: r.ogImage || r.featuredImage
			} });
			toast.success("Article saved");
			setEditing(null);
			setCreating(false);
			fetchArticles();
		} catch (err) {
			toast.error(err.message || "Failed to save article");
		}
	};
	const showStart = total > 0 ? (page - 1) * PAGE_SIZE + 1 : 0;
	const showEnd = Math.min(page * PAGE_SIZE, total);
	return /* @__PURE__ */ jsxs("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "flex flex-wrap items-end justify-between gap-3",
				children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h1", {
					className: "text-2xl font-bold tracking-tight",
					children: "Articles"
				}), /* @__PURE__ */ jsx("p", {
					className: "text-sm text-slate-500",
					children: "Manage news posts, drafts, and reviews."
				})] }), /* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ jsx(CsvImportExport, {
						getData: getAllArticlesFn,
						filename: "articles",
						onImport: handleImport
					}), /* @__PURE__ */ jsxs("button", {
						onClick: () => setCreating(true),
						className: "inline-flex items-center gap-2 rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800",
						children: [/* @__PURE__ */ jsx(Plus, { className: "h-4 w-4" }), " New Article"]
					})]
				})]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "flex flex-wrap items-center gap-2 rounded-lg border border-slate-200 bg-white p-2",
				children: [STATUS_TABS.map((t) => {
					const active = status === t.key;
					const Icon = t.icon;
					return /* @__PURE__ */ jsxs("button", {
						onClick: () => setStatus(t.key),
						className: `inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${active ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-100"}`,
						children: [/* @__PURE__ */ jsx(Icon, { className: "h-3.5 w-3.5" }), t.label]
					}, t.key);
				}), /* @__PURE__ */ jsxs("span", {
					className: "ml-auto rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600",
					children: [total, " total"]
				})]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "flex flex-wrap items-center gap-3 rounded-lg border border-slate-200 bg-white p-3",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "relative flex-1 min-w-[200px]",
						children: [
							/* @__PURE__ */ jsx(Search, { className: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" }),
							/* @__PURE__ */ jsx("input", {
								value: q,
								onChange: (e) => setQ(e.target.value),
								placeholder: "Search articles...",
								className: "w-full rounded-md border border-slate-200 py-2 pl-9 pr-3 text-sm focus:border-slate-900 focus:outline-none"
							}),
							q && debouncedQ !== q && /* @__PURE__ */ jsx(Loader2, { className: "absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 animate-spin text-slate-400" })
						]
					}),
					/* @__PURE__ */ jsxs("select", {
						value: cat,
						onChange: (e) => setCat(e.target.value),
						className: "rounded-md border border-slate-200 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none",
						children: [/* @__PURE__ */ jsx("option", { children: "All" }), sections.map((s) => /* @__PURE__ */ jsx("option", { children: s }, s))]
					}),
					someSelected && /* @__PURE__ */ jsxs("button", {
						onClick: requestBulkDelete,
						className: "inline-flex items-center gap-2 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-100",
						children: [
							/* @__PURE__ */ jsx(Trash2, { className: "h-3.5 w-3.5" }),
							" Delete (",
							selected.size,
							")"
						]
					})
				]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "overflow-x-auto rounded-lg border border-slate-200 bg-white",
				children: [/* @__PURE__ */ jsxs("table", {
					className: "w-full min-w-[700px] text-sm",
					children: [/* @__PURE__ */ jsx("thead", {
						className: "bg-slate-50 text-left text-xs uppercase tracking-wider text-slate-500",
						children: /* @__PURE__ */ jsxs("tr", { children: [
							/* @__PURE__ */ jsx("th", {
								className: "w-10 px-5 py-3",
								children: /* @__PURE__ */ jsx("input", {
									type: "checkbox",
									checked: allOnPageSelected,
									onChange: togglePage,
									className: "h-4 w-4 cursor-pointer rounded border-slate-300",
									"aria-label": "Select all on page"
								})
							}),
							/* @__PURE__ */ jsx("th", {
								className: "px-5 py-3",
								children: "Title"
							}),
							/* @__PURE__ */ jsx("th", {
								className: "px-5 py-3",
								children: "Category"
							}),
							/* @__PURE__ */ jsx("th", {
								className: "px-5 py-3",
								children: "Author"
							}),
							/* @__PURE__ */ jsx("th", {
								className: "px-5 py-3",
								children: "Views"
							}),
							/* @__PURE__ */ jsx("th", {
								className: "px-5 py-3 text-right",
								children: "Actions"
							})
						] })
					}), /* @__PURE__ */ jsxs("tbody", {
						className: "divide-y divide-slate-100",
						children: [
							loading && /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", {
								colSpan: 6,
								className: "px-5 py-12 text-center text-slate-500",
								children: /* @__PURE__ */ jsxs("div", {
									className: "flex items-center justify-center gap-2",
									children: [/* @__PURE__ */ jsx(Loader2, { className: "h-5 w-5 animate-spin" }), /* @__PURE__ */ jsx("span", { children: "Loading articlesâ€¦" })]
								})
							}) }),
							!loading && rows.map((r) => /* @__PURE__ */ jsxs("tr", {
								className: `hover:bg-slate-50/60 ${selected.has(r.id) ? "bg-slate-50" : ""}`,
								children: [
									/* @__PURE__ */ jsx("td", {
										className: "px-5 py-3",
										children: /* @__PURE__ */ jsx("input", {
											type: "checkbox",
											checked: selected.has(r.id),
											onChange: () => toggleOne(r.id),
											className: "h-4 w-4 cursor-pointer rounded border-slate-300",
											"aria-label": `Select ${r.title}`
										})
									}),
									/* @__PURE__ */ jsx("td", {
										className: "max-w-[360px] px-5 py-3",
										children: /* @__PURE__ */ jsxs("div", {
											className: "flex items-center gap-3",
											children: [/* @__PURE__ */ jsx("div", {
												className: "h-10 w-16 shrink-0 overflow-hidden rounded bg-slate-100 border border-slate-200",
												children: r.featuredImage ? /* @__PURE__ */ jsx("img", {
													src: r.featuredImage,
													alt: "",
													width: 64,
													height: 40,
													loading: "lazy",
													decoding: "async",
													className: "h-full w-full object-cover"
												}) : /* @__PURE__ */ jsx("div", {
													className: "flex h-full w-full items-center justify-center text-slate-400",
													children: /* @__PURE__ */ jsx(Image, { className: "h-4 w-4" })
												})
											}), /* @__PURE__ */ jsx("div", {
												className: "min-w-0 flex-1",
												children: /* @__PURE__ */ jsxs("div", {
													className: "flex items-center gap-2",
													children: [/* @__PURE__ */ jsx("p", {
														className: "truncate font-medium",
														title: r.title,
														children: r.title
													}), r.status === "Published" && new Date(r.date) > /* @__PURE__ */ new Date() && /* @__PURE__ */ jsx("span", {
														className: "rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-700 border border-blue-200 whitespace-nowrap",
														children: "Scheduled"
													})]
												})
											})]
										})
									}),
									/* @__PURE__ */ jsx("td", {
										className: "px-5 py-3 text-slate-600",
										children: r.category
									}),
									/* @__PURE__ */ jsx("td", {
										className: "px-5 py-3 text-slate-600",
										children: r.author
									}),
									/* @__PURE__ */ jsx("td", {
										className: "px-5 py-3 text-slate-600",
										children: /* @__PURE__ */ jsxs("span", {
											className: "inline-flex items-center gap-1",
											children: [/* @__PURE__ */ jsx(Eye, { className: "h-3 w-3" }), (r.views ?? 0).toLocaleString()]
										})
									}),
									/* @__PURE__ */ jsx("td", {
										className: "px-5 py-3 text-right",
										children: /* @__PURE__ */ jsxs("div", {
											className: "inline-flex gap-2",
											children: [/* @__PURE__ */ jsx("button", {
												onClick: () => setEditing(r),
												className: "grid h-8 w-8 place-items-center rounded-md border border-slate-200 hover:bg-slate-100",
												"aria-label": "Edit",
												children: /* @__PURE__ */ jsx(Pencil, { className: "h-3.5 w-3.5" })
											}), /* @__PURE__ */ jsx("button", {
												onClick: () => requestDelete(r.id, r.title),
												className: "grid h-8 w-8 place-items-center rounded-md border border-slate-200 text-red-600 hover:bg-red-50",
												"aria-label": "Delete",
												children: /* @__PURE__ */ jsx(Trash2, { className: "h-3.5 w-3.5" })
											})]
										})
									})
								]
							}, r.id)),
							!loading && rows.length === 0 && /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", {
								colSpan: 6,
								className: "px-5 py-8 text-center text-slate-500",
								children: "No articles found."
							}) })
						]
					})]
				}), totalPages > 1 && /* @__PURE__ */ jsxs("div", {
					className: "flex items-center justify-between border-t border-slate-200 bg-slate-50 px-5 py-3 text-xs text-slate-600",
					children: [/* @__PURE__ */ jsxs("span", { children: [
						"Showing ",
						showStart,
						"â€“",
						showEnd,
						" of ",
						total
					] }), /* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-1",
						children: [
							/* @__PURE__ */ jsx("button", {
								disabled: page <= 1,
								onClick: () => setPage((p) => p - 1),
								className: "grid h-7 w-7 place-items-center rounded border border-slate-200 bg-white disabled:opacity-40",
								children: /* @__PURE__ */ jsx(ChevronLeft, { className: "h-3.5 w-3.5" })
							}),
							/* @__PURE__ */ jsxs("span", {
								className: "px-2",
								children: [
									page,
									" / ",
									totalPages
								]
							}),
							/* @__PURE__ */ jsx("button", {
								disabled: page >= totalPages,
								onClick: () => setPage((p) => p + 1),
								className: "grid h-7 w-7 place-items-center rounded border border-slate-200 bg-white disabled:opacity-40",
								children: /* @__PURE__ */ jsx(ChevronRight, { className: "h-3.5 w-3.5" })
							})
						]
					})]
				})]
			}),
			(editing || creating) && /* @__PURE__ */ jsx(Suspense, {
				fallback: /* @__PURE__ */ jsx("div", {
					className: "fixed inset-0 z-50 grid place-items-center bg-slate-950/60 text-sm text-white",
					children: "Loading editorâ€¦"
				}),
				children: /* @__PURE__ */ jsx(ArticleEditor, {
					initial: editing ?? blankRow(),
					onClose: () => {
						setEditing(null);
						setCreating(false);
					},
					onSave: save
				})
			}),
			confirmAction && /* @__PURE__ */ jsx(ConfirmModal, {
				title: confirmAction.title,
				message: confirmAction.message,
				confirmLabel: confirmAction.confirmLabel,
				danger: true,
				onConfirm: confirmAction.onConfirm,
				onCancel: () => setConfirmAction(null)
			})
		]
	});
}
//#endregion
export { ArticlesPage as component };

//# sourceMappingURL=admin.articles-CtYGqD7n.js.map