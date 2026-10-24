import { _ as Route } from "./router-BCQV2yfk.js";
import { t as PolicyLayout } from "./PolicyLayout-DCzgyQTp.js";
import { jsx } from "react/jsx-runtime";
// src/routes/data-deletion-policy.tsx?tsr-split=component
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
export { DataDeletionPolicyPage as component };

//# sourceMappingURL=data-deletion-policy-DsI34O1o.js.map