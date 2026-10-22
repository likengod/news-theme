import { _ as Route } from "./router-B1TWvjaH.js";
import { t as PolicyLayout } from "./PolicyLayout-DlfFpQ36.js";
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

//# sourceMappingURL=data-deletion-policy-C_OoBprZ.js.map