import { C as Link } from "./vendor-tanstack-router-CezffrX_.js";
import { jsx, jsxs } from "react/jsx-runtime";
// src/routes/news.$slug.tsx?tsr-shared=1
function ArticleNotFound() {
	return /* @__PURE__ */ jsx("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ jsxs("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ jsx("h1", {
					className: "text-xl font-semibold text-foreground",
					children: "Article not found"
				}),
				/* @__PURE__ */ jsx("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "The article you requested could not be located."
				}),
				/* @__PURE__ */ jsx(Link, {
					to: "/",
					className: "mt-6 inline-block rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground",
					children: "Back to home"
				})
			]
		})
	});
}
export { ArticleNotFound as t };

//# sourceMappingURL=news._slug-C2J7vmCS.js.map