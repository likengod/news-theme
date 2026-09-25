import { t as Route } from "./dmca-BrHNLpgs.js";
import { t as PolicyLayout } from "./PolicyLayout-DsLQ2RIK.js";
import { Link } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { ShieldCheck } from "lucide-react";
//#region src/routes/dmca.tsx?tsr-split=component
function DmcaPage() {
	const page = Route.useLoaderData();
	return /* @__PURE__ */ jsx(PolicyLayout, {
		title: page?.title || "DMCA Notice & Takedown",
		intro: page?.intro || "",
		headerAction: /* @__PURE__ */ jsxs(Link, {
			to: "/verify-image",
			className: "inline-flex items-center gap-2 rounded-xl border border-primary/30 bg-primary/10 px-3.5 py-2 text-xs sm:text-sm font-semibold text-primary hover:bg-primary hover:text-primary-foreground transition-all shadow-2xs group",
			children: [/* @__PURE__ */ jsx(ShieldCheck, { className: "h-4 w-4 text-primary group-hover:text-primary-foreground transition-colors" }), /* @__PURE__ */ jsx("span", { children: "Forensic Image" })]
		}),
		sections: page?.sections && page.sections.length > 0 ? page.sections.map((s) => ({
			heading: s.heading,
			body: /* @__PURE__ */ jsx("div", { dangerouslySetInnerHTML: { __html: s.body } })
		})) : [{
			heading: page?.title || "",
			body: /* @__PURE__ */ jsx("div", { dangerouslySetInnerHTML: { __html: page?.body || "" } })
		}]
	});
}
//#endregion
export { DmcaPage as component };
