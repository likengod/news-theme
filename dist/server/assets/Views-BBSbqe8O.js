import { c as formatViews } from "./db.server-KusBKFrP.js";
import { jsx, jsxs } from "react/jsx-runtime";
import { Eye } from "lucide-react";
//#region src/components/site/Views.tsx
function Views({ count, className = "" }) {
	return /* @__PURE__ */ jsxs("span", {
		className: `inline-flex items-center gap-1 text-[11px] text-muted-foreground ${className}`,
		children: [/* @__PURE__ */ jsx(Eye, { className: "h-3 w-3 shrink-0" }), /* @__PURE__ */ jsxs("span", { children: [formatViews(count), " views"] })]
	});
}
//#endregion
export { Views as t };
