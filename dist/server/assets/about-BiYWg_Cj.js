import { t as Route } from "./about-D3ZaMZtJ.js";
import { t as PolicyLayout } from "./PolicyLayout-Dk18hHgr.js";
import { jsx } from "react/jsx-runtime";
//#region src/routes/about.tsx?tsr-split=component
function AboutPage() {
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
export { AboutPage as component };

//# sourceMappingURL=about-BiYWg_Cj.js.map