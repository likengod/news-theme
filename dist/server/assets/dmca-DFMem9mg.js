import { t as Route } from "./dmca-CdXn7-Jg.js";
import { t as PolicyLayout } from "./PolicyLayout-D4PbLg7H.js";
import { jsx } from "react/jsx-runtime";
//#region src/routes/dmca.tsx?tsr-split=component
function DmcaPage() {
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
export { DmcaPage as component };

//# sourceMappingURL=dmca-DFMem9mg.js.map