import { m as Route } from "./router-CRe7fayD.js";
import { t as PolicyLayout } from "./PolicyLayout-B2U83X1d.js";
import { jsx } from "react/jsx-runtime";
// src/routes/editorial-policy.tsx?tsr-split=component
function EditorialPage() {
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
export { EditorialPage as component };

//# sourceMappingURL=editorial-policy-DE5oLkfl.js.map