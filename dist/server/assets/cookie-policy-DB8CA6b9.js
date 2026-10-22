import { v as Route } from "./router-D-01NR57.js";
import { t as PolicyLayout } from "./PolicyLayout-DNXiLaQu.js";
import { jsx } from "react/jsx-runtime";
// src/routes/cookie-policy.tsx?tsr-split=component
function CookiePage() {
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
export { CookiePage as component };

//# sourceMappingURL=cookie-policy-DB8CA6b9.js.map