import { m as Route } from "./router-uzMyd5Cq.js";
import { t as PolicyLayout } from "./PolicyLayout-hoq0ncbY.js";
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

//# sourceMappingURL=editorial-policy-C-oIpOt3.js.map