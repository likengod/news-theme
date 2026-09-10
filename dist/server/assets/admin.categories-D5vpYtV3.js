import { p as slugify } from "./db.server-CLva-TlE.js";
import { t as useServerFn } from "./useServerFn-BqzygRuj.js";
import { l as saveCategory, r as getCategories, s as importCategories, t as deleteCategory } from "./taxonomy.functions-DgH-3KC5.js";
import { t as CsvImportExport } from "./CsvImportExport-DBalmz2g.js";
import { useEffect, useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
import { ChevronLeft, ChevronRight, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";
//#region src/components/admin/categories/CategoryTable.tsx
function CategoryTable({ categories, onEdit, onDelete }) {
	return /* @__PURE__ */ jsx("div", {
		className: "overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm",
		children: /* @__PURE__ */ jsxs("table", {
			className: "w-full text-left text-sm",
			children: [/* @__PURE__ */ jsx("thead", {
				className: "border-b border-slate-200 bg-slate-50 text-xs font-bold uppercase tracking-wider text-slate-500",
				children: /* @__PURE__ */ jsxs("tr", { children: [
					/* @__PURE__ */ jsx("th", {
						className: "px-5 py-3",
						children: "Category"
					}),
					/* @__PURE__ */ jsx("th", {
						className: "px-5 py-3",
						children: "Slug"
					}),
					/* @__PURE__ */ jsx("th", {
						className: "px-5 py-3",
						children: "Description"
					}),
					/* @__PURE__ */ jsx("th", {
						className: "px-5 py-3 text-right",
						children: "Articles"
					}),
					/* @__PURE__ */ jsx("th", {
						className: "px-5 py-3 text-right",
						children: "Actions"
					})
				] })
			}), /* @__PURE__ */ jsxs("tbody", {
				className: "divide-y divide-slate-100",
				children: [categories.map((c) => /* @__PURE__ */ jsxs("tr", {
					className: "hover:bg-slate-50/70 transition-colors",
					children: [
						/* @__PURE__ */ jsx("td", {
							className: "px-5 py-3 font-semibold text-slate-900",
							children: /* @__PURE__ */ jsxs("div", {
								className: "flex items-center gap-2",
								children: [c.name, c.showInHeader && /* @__PURE__ */ jsx("span", {
									className: "rounded bg-emerald-100 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-emerald-800",
									children: "Header"
								})]
							})
						}),
						/* @__PURE__ */ jsx("td", {
							className: "px-5 py-3 font-mono text-xs text-slate-500",
							children: c.slug
						}),
						/* @__PURE__ */ jsx("td", {
							className: "px-5 py-3 text-xs text-slate-600 max-w-xs truncate",
							children: c.description || "—"
						}),
						/* @__PURE__ */ jsx("td", {
							className: "px-5 py-3 text-right font-bold text-slate-700",
							children: c.count || 0
						}),
						/* @__PURE__ */ jsx("td", {
							className: "px-5 py-3 text-right",
							children: /* @__PURE__ */ jsxs("div", {
								className: "inline-flex gap-1.5",
								children: [/* @__PURE__ */ jsxs("button", {
									onClick: () => onEdit(c),
									className: "inline-flex items-center gap-1 rounded-md border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50",
									children: [/* @__PURE__ */ jsx(Pencil, { className: "h-3 w-3" }), " Edit"]
								}), /* @__PURE__ */ jsxs("button", {
									onClick: () => onDelete(c),
									className: "inline-flex items-center gap-1 rounded-md border border-red-200 bg-red-50 px-2.5 py-1 text-xs font-medium text-red-600 hover:bg-red-100",
									children: [/* @__PURE__ */ jsx(Trash2, { className: "h-3 w-3" }), " Delete"]
								})]
							})
						})
					]
				}, c.id)), categories.length === 0 && /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", {
					colSpan: 5,
					className: "px-5 py-8 text-center text-xs text-slate-400",
					children: "No categories found."
				}) })]
			})]
		})
	});
}
//#endregion
//#region src/routes/admin.categories.tsx?tsr-split=component
function CategoriesPage() {
	const fetchCatsFn = useServerFn(getCategories);
	const saveCatFn = useServerFn(saveCategory);
	const deleteCatFn = useServerFn(deleteCategory);
	const importCatsFn = useServerFn(importCategories);
	const [cats, setCats] = useState([]);
	const [allCats, setAllCats] = useState([]);
	const [loading, setLoading] = useState(true);
	const [name, setName] = useState("");
	const [editing, setEditing] = useState(null);
	const [page, setPage] = useState(1);
	const [q, setQ] = useState("");
	const PAGE_SIZE = 15;
	const loadCategories = async () => {
		try {
			setLoading(true);
			const res = await fetchCatsFn({ data: { q } });
			setCats(res);
			if (!q) setAllCats(res);
		} catch (err) {
			toast.error(err.message || "Failed to load categories");
		} finally {
			setLoading(false);
		}
	};
	useEffect(() => {
		loadCategories();
	}, [q]);
	const handleImport = async (data) => {
		try {
			setLoading(true);
			await importCatsFn({ data });
			toast.success("Categories imported successfully");
			await loadCategories();
		} catch (err) {
			toast.error(err.message || "Failed to import categories");
		} finally {
			setLoading(false);
		}
	};
	const totalPages = Math.max(1, Math.ceil(cats.length / PAGE_SIZE));
	const safePage = Math.min(page, totalPages);
	const paged = cats.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);
	const handleSave = async (draft) => {
		if (!draft.name.trim()) return toast.error("Category name is required");
		try {
			await saveCatFn({ data: draft });
			toast.success(editing ? "Category updated" : "Category created");
			setEditing(null);
			setName("");
			loadCategories();
		} catch (err) {
			toast.error(err.message || "Failed to save category");
		}
	};
	const handleDelete = async (c) => {
		if (!confirm(`Delete category "${c.name}"?`)) return;
		try {
			await deleteCatFn({ data: c.id });
			toast.success("Category deleted");
			loadCategories();
		} catch (err) {
			toast.error(err.message || "Failed to delete category");
		}
	};
	return /* @__PURE__ */ jsxs("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "flex flex-wrap items-center justify-between gap-3",
				children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("h1", {
					className: "flex items-center gap-2 text-2xl font-bold tracking-tight",
					children: ["News Categories", /* @__PURE__ */ jsxs("span", {
						className: "rounded-md bg-slate-100 px-2.5 py-0.5 text-sm font-semibold text-slate-600",
						children: [allCats.length, " Total"]
					})]
				}), /* @__PURE__ */ jsx("p", {
					className: "text-sm text-slate-500",
					children: "Manage article categories, SEO metadata, and category feeds."
				})] }), /* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ jsx(CsvImportExport, {
						data: allCats,
						filename: "categories",
						onImport: handleImport
					}), /* @__PURE__ */ jsxs("button", {
						onClick: () => setEditing({
							id: Date.now(),
							name: "",
							slug: "",
							description: "",
							metaTitle: "",
							metaDescription: "",
							showInHeader: false
						}),
						className: "inline-flex items-center gap-2 rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800",
						children: [/* @__PURE__ */ jsx(Plus, { className: "h-4 w-4" }), " Add Category"]
					})]
				})]
			}),
			/* @__PURE__ */ jsx("div", {
				className: "flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-sm",
				children: /* @__PURE__ */ jsxs("div", {
					className: "relative flex-1",
					children: [/* @__PURE__ */ jsx(Search, { className: "absolute left-3 top-2.5 h-4 w-4 text-slate-400" }), /* @__PURE__ */ jsx("input", {
						type: "text",
						value: q,
						onChange: (e) => {
							setQ(e.target.value);
							setPage(1);
						},
						placeholder: "Search categories by name...",
						className: "h-9 w-full rounded-md border border-slate-200 pl-9 pr-3 text-sm focus:border-slate-900 focus:outline-none"
					})]
				})
			}),
			loading ? /* @__PURE__ */ jsx("div", {
				className: "flex justify-center py-12",
				children: /* @__PURE__ */ jsx("div", { className: "h-8 w-8 animate-spin rounded-full border-4 border-slate-900 border-t-transparent" })
			}) : /* @__PURE__ */ jsx(CategoryTable, {
				categories: paged,
				onEdit: (cat) => setEditing({ ...cat }),
				onDelete: handleDelete
			}),
			totalPages > 1 && /* @__PURE__ */ jsxs("div", {
				className: "flex items-center justify-between border-t border-slate-200 pt-4",
				children: [/* @__PURE__ */ jsxs("p", {
					className: "text-xs text-slate-500",
					children: [
						"Page ",
						/* @__PURE__ */ jsx("strong", { children: safePage }),
						" of ",
						/* @__PURE__ */ jsx("strong", { children: totalPages }),
						" (",
						cats.length,
						" total categories)"
					]
				}), /* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ jsxs("button", {
						onClick: () => setPage((p) => Math.max(1, p - 1)),
						disabled: safePage <= 1,
						className: "inline-flex items-center gap-1 rounded-md border border-slate-200 px-3 py-1.5 text-xs font-medium hover:bg-slate-50 disabled:opacity-40",
						children: [/* @__PURE__ */ jsx(ChevronLeft, { className: "h-3.5 w-3.5" }), " Previous"]
					}), /* @__PURE__ */ jsxs("button", {
						onClick: () => setPage((p) => Math.min(totalPages, p + 1)),
						disabled: safePage >= totalPages,
						className: "inline-flex items-center gap-1 rounded-md border border-slate-200 px-3 py-1.5 text-xs font-medium hover:bg-slate-50 disabled:opacity-40",
						children: ["Next ", /* @__PURE__ */ jsx(ChevronRight, { className: "h-3.5 w-3.5" })]
					})]
				})]
			}),
			editing && /* @__PURE__ */ jsx("div", {
				className: "fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4",
				children: /* @__PURE__ */ jsxs("div", {
					className: "w-full max-w-md rounded-xl bg-white p-5 shadow-2xl space-y-4",
					children: [
						/* @__PURE__ */ jsx("h2", {
							className: "text-base font-bold text-slate-900",
							children: editing.id > 1e6 ? "Add Category" : `Edit Category — ${editing.name}`
						}),
						/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
							className: "mb-1 block text-xs font-semibold text-slate-600",
							children: "Category Name *"
						}), /* @__PURE__ */ jsx("input", {
							type: "text",
							value: editing.name,
							onChange: (e) => setEditing({
								...editing,
								name: e.target.value,
								slug: slugify(e.target.value)
							}),
							className: "h-9 w-full rounded-md border border-slate-200 px-3 text-sm focus:border-slate-900 focus:outline-none"
						})] }),
						/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
							className: "mb-1 block text-xs font-semibold text-slate-600",
							children: "Slug"
						}), /* @__PURE__ */ jsx("input", {
							type: "text",
							value: editing.slug,
							onChange: (e) => setEditing({
								...editing,
								slug: e.target.value
							}),
							className: "h-9 w-full rounded-md border border-slate-200 px-3 text-sm focus:border-slate-900 focus:outline-none"
						})] }),
						/* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ jsx("input", {
								type: "checkbox",
								id: "showInHeader",
								checked: editing.showInHeader || false,
								onChange: (e) => setEditing({
									...editing,
									showInHeader: e.target.checked
								}),
								className: "h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900"
							}), /* @__PURE__ */ jsx("label", {
								htmlFor: "showInHeader",
								className: "text-sm font-medium text-slate-700",
								children: "Show in top header navigation"
							})]
						}),
						/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
							className: "mb-1 block text-xs font-semibold text-slate-600",
							children: "Description"
						}), /* @__PURE__ */ jsx("textarea", {
							value: editing.description,
							onChange: (e) => setEditing({
								...editing,
								description: e.target.value
							}),
							rows: 3,
							className: "w-full rounded-md border border-slate-200 p-2.5 text-sm focus:border-slate-900 focus:outline-none"
						})] }),
						/* @__PURE__ */ jsxs("div", {
							className: "flex justify-end gap-2 pt-2 border-t border-slate-100",
							children: [/* @__PURE__ */ jsx("button", {
								onClick: () => setEditing(null),
								className: "rounded-md border border-slate-200 px-4 py-2 text-xs font-semibold hover:bg-slate-50",
								children: "Cancel"
							}), /* @__PURE__ */ jsx("button", {
								onClick: () => handleSave(editing),
								className: "rounded-md bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800",
								children: "Save Category"
							})]
						})
					]
				})
			})
		]
	});
}
//#endregion
export { CategoriesPage as component };
