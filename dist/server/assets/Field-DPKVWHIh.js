import { jsx, jsxs } from "react/jsx-runtime";
//#region src/components/admin/journalists/Field.tsx
function Field({ label, value, onChange, type = "text", placeholder }) {
	return /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
		className: "mb-1 block text-xs font-medium text-slate-700",
		children: label
	}), /* @__PURE__ */ jsx("input", {
		type,
		value,
		placeholder,
		onChange: (e) => onChange(e.target.value),
		className: "w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:border-slate-900 focus:outline-none"
	})] });
}
//#endregion
export { Field as t };

//# sourceMappingURL=Field-DPKVWHIh.js.map