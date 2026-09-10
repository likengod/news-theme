import { o as roleBadgeClass, t as ROLE_COLORS } from "./roles-D0zoxZ_H.js";
import { jsx, jsxs } from "react/jsx-runtime";
import { Save, X } from "lucide-react";
//#region src/components/admin/journalists/RankEditModal.tsx
function RankEditModal({ editing, isNew, setEditing, onSave }) {
	return /* @__PURE__ */ jsx("div", {
		className: "fixed inset-0 z-50 grid place-items-center bg-black/40 p-4",
		children: /* @__PURE__ */ jsxs("div", {
			className: "w-full max-w-md rounded-lg bg-white p-5 shadow-xl",
			children: [
				/* @__PURE__ */ jsxs("div", {
					className: "mb-4 flex items-center justify-between",
					children: [/* @__PURE__ */ jsx("h2", {
						className: "text-lg font-semibold",
						children: isNew ? "New rank" : `Edit "${editing.name}"`
					}), /* @__PURE__ */ jsx("button", {
						onClick: () => setEditing(null),
						className: "grid h-7 w-7 place-items-center rounded-md hover:bg-slate-100",
						"aria-label": "Close",
						children: /* @__PURE__ */ jsx(X, { className: "h-4 w-4" })
					})]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "space-y-3",
					children: [
						/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
							className: "mb-1 block text-xs font-medium text-slate-700",
							children: "Rank name"
						}), /* @__PURE__ */ jsx("input", {
							value: editing.name,
							disabled: !isNew && editing.builtin,
							onChange: (e) => setEditing({
								...editing,
								name: e.target.value
							}),
							className: "w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none disabled:bg-slate-50",
							placeholder: "Platinum"
						})] }),
						/* @__PURE__ */ jsxs("div", {
							className: "grid grid-cols-2 gap-3",
							children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
								className: "mb-1 block text-xs font-medium text-slate-700",
								children: "Published news required"
							}), /* @__PURE__ */ jsx("input", {
								type: "number",
								value: editing.minNews,
								onChange: (e) => setEditing({
									...editing,
									minNews: Number(e.target.value) || 0
								}),
								className: "w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none"
							})] }), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
								className: "mb-1 block text-xs font-medium text-slate-700",
								children: "Points per news"
							}), /* @__PURE__ */ jsx("input", {
								type: "number",
								value: editing.pointsPerNews,
								onChange: (e) => setEditing({
									...editing,
									pointsPerNews: Number(e.target.value) || 0
								}),
								className: "w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none"
							})] })]
						}),
						/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
							className: "mb-1 block text-xs font-medium text-slate-700",
							children: "Badge colour"
						}), /* @__PURE__ */ jsx("div", {
							className: "flex flex-wrap gap-2",
							children: ROLE_COLORS.map((c) => /* @__PURE__ */ jsx("button", {
								type: "button",
								onClick: () => setEditing({
									...editing,
									color: c
								}),
								className: `rounded-full border px-2.5 py-0.5 text-xs font-medium ${roleBadgeClass(c)} ${editing.color === c ? "ring-2 ring-slate-900 ring-offset-1" : ""}`,
								children: c
							}, c))
						})] })
					]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "mt-5 flex justify-end gap-2",
					children: [/* @__PURE__ */ jsx("button", {
						onClick: () => setEditing(null),
						className: "rounded-md border border-slate-200 px-4 py-2 text-sm font-medium hover:bg-slate-50",
						children: "Cancel"
					}), /* @__PURE__ */ jsxs("button", {
						onClick: onSave,
						className: "inline-flex items-center gap-1.5 rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800",
						children: [/* @__PURE__ */ jsx(Save, { className: "h-4 w-4" }), " Save"]
					})]
				})
			]
		})
	});
}
//#endregion
export { RankEditModal };
