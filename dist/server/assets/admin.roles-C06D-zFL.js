import { a as loadRoles, c as saveRolesServer, i as getRolesServer, o as roleBadgeClass, s as saveRoles, t as ROLE_COLORS, u as slugify } from "./roles-CkczXDsx.js";
import { useEffect, useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
import { Pencil, Plus, Save, ShieldCheck, Trash2, X } from "lucide-react";
import { toast } from "sonner";
//#region src/components/admin/roles/RoleTable.tsx
function RoleTable({ roles, onEdit, onDelete }) {
	return /* @__PURE__ */ jsx("div", {
		className: "overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm",
		children: /* @__PURE__ */ jsxs("table", {
			className: "w-full text-left text-sm",
			children: [/* @__PURE__ */ jsx("thead", {
				className: "border-b border-slate-200 bg-slate-50 text-xs font-bold uppercase tracking-wider text-slate-500",
				children: /* @__PURE__ */ jsxs("tr", { children: [
					/* @__PURE__ */ jsx("th", {
						className: "px-5 py-3",
						children: "Role"
					}),
					/* @__PURE__ */ jsx("th", {
						className: "px-5 py-3",
						children: "Description"
					}),
					/* @__PURE__ */ jsx("th", {
						className: "px-5 py-3",
						children: "Popup Ads"
					}),
					/* @__PURE__ */ jsx("th", {
						className: "px-5 py-3",
						children: "Type"
					}),
					/* @__PURE__ */ jsx("th", {
						className: "px-5 py-3 text-right",
						children: "Actions"
					})
				] })
			}), /* @__PURE__ */ jsx("tbody", {
				className: "divide-y divide-slate-100",
				children: roles.map((r) => /* @__PURE__ */ jsxs("tr", {
					className: "hover:bg-slate-50/70 transition-colors",
					children: [
						/* @__PURE__ */ jsx("td", {
							className: "px-5 py-3",
							children: /* @__PURE__ */ jsxs("span", {
								className: `inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-bold ${roleBadgeClass(r.color)}`,
								children: [
									/* @__PURE__ */ jsx(ShieldCheck, { className: "h-3.5 w-3.5" }),
									" ",
									r.name
								]
							})
						}),
						/* @__PURE__ */ jsx("td", {
							className: "px-5 py-3 text-xs text-slate-600 max-w-xs",
							children: r.description
						}),
						/* @__PURE__ */ jsx("td", {
							className: "px-5 py-3 text-xs",
							children: r.seesPopupAds ? /* @__PURE__ */ jsx("span", {
								className: "rounded-md bg-amber-50 px-2 py-0.5 font-medium text-amber-700 border border-amber-200",
								children: "Sees Ads"
							}) : /* @__PURE__ */ jsx("span", {
								className: "rounded-md bg-emerald-50 px-2 py-0.5 font-medium text-emerald-700 border border-emerald-200",
								children: "Ad Free"
							})
						}),
						/* @__PURE__ */ jsx("td", {
							className: "px-5 py-3 text-xs text-slate-500",
							children: r.builtin ? /* @__PURE__ */ jsx("span", {
								className: "rounded bg-slate-100 px-2 py-0.5 text-slate-600 font-semibold",
								children: "Built-in"
							}) : /* @__PURE__ */ jsx("span", {
								className: "rounded bg-blue-50 px-2 py-0.5 text-blue-700 font-semibold",
								children: "Custom"
							})
						}),
						/* @__PURE__ */ jsx("td", {
							className: "px-5 py-3 text-right",
							children: /* @__PURE__ */ jsxs("div", {
								className: "inline-flex gap-1",
								children: [/* @__PURE__ */ jsxs("button", {
									onClick: () => onEdit(r),
									className: "inline-flex items-center gap-1 rounded-md border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50",
									children: [/* @__PURE__ */ jsx(Pencil, { className: "h-3 w-3" }), " Edit"]
								}), !r.builtin && /* @__PURE__ */ jsxs("button", {
									onClick: () => onDelete(r),
									className: "inline-flex items-center gap-1 rounded-md border border-red-200 bg-red-50 px-2.5 py-1 text-xs font-medium text-red-600 hover:bg-red-100",
									children: [/* @__PURE__ */ jsx(Trash2, { className: "h-3 w-3" }), " Delete"]
								})]
							})
						})
					]
				}, r.id))
			})]
		})
	});
}
//#endregion
//#region src/components/admin/roles/RoleEditorModal.tsx
function RoleEditorModal({ role, isNew, onClose, onSave }) {
	const [draft, setDraft] = useState(role);
	const submit = () => {
		if (!draft.name.trim()) return alert("Role name is required");
		onSave(draft);
	};
	return /* @__PURE__ */ jsx("div", {
		className: "fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4",
		children: /* @__PURE__ */ jsxs("div", {
			className: "w-full max-w-md rounded-xl bg-white p-5 shadow-2xl",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "mb-4 flex items-center justify-between border-b border-slate-100 pb-3",
				children: [/* @__PURE__ */ jsx("h2", {
					className: "text-base font-bold text-slate-900",
					children: isNew ? "Create New Role" : `Edit Role — ${role.name}`
				}), /* @__PURE__ */ jsx("button", {
					onClick: onClose,
					className: "rounded p-1 text-slate-400 hover:bg-slate-100",
					children: /* @__PURE__ */ jsx(X, { className: "h-4 w-4" })
				})]
			}), /* @__PURE__ */ jsxs("div", {
				className: "space-y-4",
				children: [
					/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
						className: "mb-1 block text-xs font-semibold text-slate-600",
						children: "Role Name *"
					}), /* @__PURE__ */ jsx("input", {
						type: "text",
						value: draft.name,
						onChange: (e) => setDraft({
							...draft,
							name: e.target.value
						}),
						placeholder: "e.g. Senior Editor",
						className: "h-9 w-full rounded-lg border border-slate-200 px-3 text-sm focus:border-slate-900 focus:outline-none"
					})] }),
					/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
						className: "mb-1 block text-xs font-semibold text-slate-600",
						children: "Description"
					}), /* @__PURE__ */ jsx("textarea", {
						value: draft.description,
						onChange: (e) => setDraft({
							...draft,
							description: e.target.value
						}),
						rows: 2,
						placeholder: "What this role allows users to do...",
						className: "w-full rounded-lg border border-slate-200 p-2.5 text-sm focus:border-slate-900 focus:outline-none"
					})] }),
					/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
						className: "mb-1 block text-xs font-semibold text-slate-600",
						children: "Badge Color"
					}), /* @__PURE__ */ jsx("div", {
						className: "flex flex-wrap gap-2 pt-1",
						children: ROLE_COLORS.map((c) => /* @__PURE__ */ jsx("button", {
							type: "button",
							onClick: () => setDraft({
								...draft,
								color: c
							}),
							className: `h-7 rounded-md px-3 text-xs font-semibold capitalize transition ${draft.color === c ? "ring-2 ring-slate-900 font-bold" : "opacity-70 hover:opacity-100"}`,
							style: {
								backgroundColor: c === "violet" ? "#f5f3ff" : c === "blue" ? "#eff6ff" : c === "emerald" ? "#ecfdf5" : c === "amber" ? "#fffbeb" : c === "rose" ? "#fff1f2" : c === "sky" ? "#f0f9ff" : "#f8fafc",
								color: c === "violet" ? "#6d28d9" : c === "blue" ? "#1d4ed8" : c === "emerald" ? "#047857" : c === "amber" ? "#b45309" : c === "rose" ? "#be123c" : c === "sky" ? "#0369a1" : "#334155"
							},
							children: c
						}, c))
					})] }),
					/* @__PURE__ */ jsx("div", {
						className: "pt-2",
						children: /* @__PURE__ */ jsxs("label", {
							className: "flex items-center gap-2 cursor-pointer",
							children: [/* @__PURE__ */ jsx("input", {
								type: "checkbox",
								checked: draft.seesPopupAds ?? true,
								onChange: (e) => setDraft({
									...draft,
									seesPopupAds: e.target.checked
								}),
								className: "h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900"
							}), /* @__PURE__ */ jsx("span", {
								className: "text-xs font-semibold text-slate-700",
								children: "Users with this role see popup advertisements"
							})]
						})
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "flex justify-end gap-2 pt-2 border-t border-slate-100",
						children: [/* @__PURE__ */ jsx("button", {
							onClick: onClose,
							className: "rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50",
							children: "Cancel"
						}), /* @__PURE__ */ jsxs("button", {
							onClick: submit,
							className: "inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800",
							children: [/* @__PURE__ */ jsx(Save, { className: "h-4 w-4" }), " Save Role"]
						})]
					})
				]
			})]
		})
	});
}
//#endregion
//#region src/routes/admin.roles.tsx?tsr-split=component
function emptyRole() {
	return {
		id: "",
		name: "",
		description: "",
		color: "slate",
		seesPopupAds: true
	};
}
function RolesPage() {
	const [roles, setRoles] = useState(() => loadRoles());
	const [editing, setEditing] = useState(null);
	const [isNew, setIsNew] = useState(false);
	const [loading, setLoading] = useState(true);
	useEffect(() => {
		getRolesServer().then((serverRoles) => {
			setRoles(serverRoles);
			setLoading(false);
		}).catch(() => setLoading(false));
	}, []);
	const persist = (next) => {
		setRoles(next);
		saveRoles(next);
		saveRolesServer({ data: next }).catch(() => {});
	};
	const openNew = () => {
		setEditing(emptyRole());
		setIsNew(true);
	};
	const openEdit = (r) => {
		setEditing({ ...r });
		setIsNew(false);
	};
	const onSave = (draft) => {
		const name = draft.name.trim();
		if (!name) return toast.error("Role name is required");
		const id = isNew ? slugify(name) : draft.id;
		if (!id) return toast.error("Invalid role name");
		if (isNew && roles.some((r) => r.id === id)) return toast.error("A role with this name already exists");
		persist(isNew ? [...roles, {
			...draft,
			id
		}] : roles.map((r) => r.id === id ? {
			...draft,
			id
		} : r));
		toast.success(isNew ? "Role created and saved to MySQL" : "Role updated in MySQL");
		setEditing(null);
	};
	const onDelete = (r) => {
		if (r.builtin) return toast.error("Built-in roles cannot be deleted");
		if (!confirm(`Are you sure you want to delete role "${r.name}"?`)) return;
		persist(roles.filter((x) => x.id !== r.id));
		toast.success("Role deleted");
	};
	return /* @__PURE__ */ jsxs("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "flex flex-wrap items-end justify-between gap-3",
				children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h1", {
					className: "text-2xl font-bold tracking-tight",
					children: "User Roles"
				}), /* @__PURE__ */ jsx("p", {
					className: "text-sm text-slate-500",
					children: "Create, edit and delete roles available in the Users screen. Syncs to MySQL."
				})] }), /* @__PURE__ */ jsxs("button", {
					onClick: openNew,
					className: "inline-flex items-center gap-2 rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800",
					children: [/* @__PURE__ */ jsx(Plus, { className: "h-4 w-4" }), " New role"]
				})]
			}),
			/* @__PURE__ */ jsx(RoleTable, {
				roles,
				onEdit: openEdit,
				onDelete
			}),
			editing && /* @__PURE__ */ jsx(RoleEditorModal, {
				role: editing,
				isNew,
				onClose: () => setEditing(null),
				onSave
			})
		]
	});
}
//#endregion
export { RolesPage as component };
