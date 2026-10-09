import { t as Route } from "./data-deletion-policy-Bm7FKAPs.js";
import { t as PolicyLayout } from "./PolicyLayout-B8ch4KFF.js";
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

//# sourceMappingURL=data-deletion-policy-_MN_sfpi.js.map