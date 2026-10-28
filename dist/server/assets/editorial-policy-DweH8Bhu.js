import { m as Route } from "./router-CEZfh-O3.js";
import { t as PolicyLayout } from "./PolicyLayout-Db5wBUM8.js";
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

//# sourceMappingURL=editorial-policy-DweH8Bhu.js.map