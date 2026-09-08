import { c as formatViews } from "./db.server-CLva-TlE.js";
import { jsx, jsxs } from "react/jsx-runtime";
import { Eye } from "lucide-react";
//#region src/components/site/Views.tsx
function Views({ count, className = "" }) {
	return /* @__PURE__ */ jsxs("span", {
		className: `inline-flex items-center gap-1 ${className}`,
		children: [/* @__PURE__ */ jsx(Eye, { className: "h-3 w-3" }), /* @__PURE__ */ jsxs("span", { children: [formatViews(count), " views"] })]
	});
}
//#endregion
export { Views as t };
