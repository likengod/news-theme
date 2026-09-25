import { t as cn } from "./utils-C_uf36nf.js";
import * as React$1 from "react";
import { jsx } from "react/jsx-runtime";
//#region src/components/ui/input.tsx
var Input = React$1.forwardRef(({ className, type, id, name, placeholder, ...props }, ref) => {
	const autoId = React$1.useId();
	return /* @__PURE__ */ jsx("input", {
		type,
		id: id || (name ? `input-${name}` : autoId),
		name: name || id || (placeholder ? placeholder.toLowerCase().replace(/[^a-z0-9_-]+/g, "-") : autoId),
		"aria-label": props["aria-label"] || (!props["aria-labelledby"] && placeholder ? placeholder : void 0),
		placeholder,
		className: cn("flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm", className),
		ref,
		...props
	});
});
Input.displayName = "Input";
//#endregion
export { Input as t };
