import { t as formatViews } from "./news-data-DU6ZB54L.js";
import { jsx, jsxs } from "react/jsx-runtime";
import { Eye } from "lucide-react";
//#region src/components/site/Views.tsx
function Views({ count, className = "" }) {
	const c = typeof count === "number" ? count : Number(count) || 0;
	return /* @__PURE__ */ jsxs("span", {
		className: `inline-flex items-center gap-1 text-[11px] text-muted-foreground ${className}`,
		children: [/* @__PURE__ */ jsx(Eye, { className: "h-3 w-3 shrink-0" }), /* @__PURE__ */ jsxs("span", { children: [formatViews(c), " views"] })]
	});
}
//#endregion
export { Views as t };

//# sourceMappingURL=Views-D9MbWe85.js.map