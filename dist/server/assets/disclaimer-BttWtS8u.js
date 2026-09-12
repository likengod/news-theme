import { t as Route } from "./disclaimer-C1BkBUvI.js";
import { t as PolicyLayout } from "./PolicyLayout-DOGXsg88.js";
import { jsx } from "react/jsx-runtime";
//#region src/routes/disclaimer.tsx?tsr-split=component
function DisclaimerPage() {
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
export { DisclaimerPage as component };

//# sourceMappingURL=disclaimer-BttWtS8u.js.map