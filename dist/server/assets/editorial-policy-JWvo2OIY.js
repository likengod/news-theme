import { t as Route } from "./editorial-policy-CSI0ZDFY.js";
import { t as PolicyLayout } from "./PolicyLayout-e7i9FVwF.js";
import { jsx } from "react/jsx-runtime";
//#region src/routes/editorial-policy.tsx?tsr-split=component
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
//#endregion
export { EditorialPage as component };

//# sourceMappingURL=editorial-policy-JWvo2OIY.js.map