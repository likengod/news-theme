import { t as Route } from "./data-deletion-policy-B-foM1-u.js";
import { t as PolicyLayout } from "./PolicyLayout-D3OGMFgO.js";
import { jsx } from "react/jsx-runtime";
//#region src/routes/data-deletion-policy.tsx?tsr-split=component
function DataDeletionPolicyPage() {
	const page = Route.useLoaderData();
	return /* @__PURE__ */ jsx(PolicyLayout, {
		title: page?.title || "",
		intro: page?.intro || "",
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
export { DataDeletionPolicyPage as component };

//# sourceMappingURL=data-deletion-policy-DUvmLcFT.js.map