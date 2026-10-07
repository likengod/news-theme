import { l as viewsFor } from "./news-data-CiXcY3JG.js";
import { t as Views } from "./Views-BCTnPRdw.js";
import { Link } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
//#region src/components/site/HeadlineArticle.tsx
var AUTHORS = [
	"Claire Bennett",
	"Lucas Hayes",
	"Maya Chen",
	"Daniel Cole",
	"Priya Raman",
	"Noah Whitfield"
];
function authorFor(seed) {
	if (!seed) return AUTHORS[0];
	let h = 0;
	for (let i = 0; i < seed.length; i++) h = h * 31 + seed.charCodeAt(i) >>> 0;
	return AUTHORS[h % AUTHORS.length];
}
function MinRead({ seed, kicker }) {
	return /* @__PURE__ */ jsxs("span", {
		className: "mt-3 inline-flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-muted-foreground",
		children: [
			/* @__PURE__ */ jsxs("span", {
				className: "font-medium text-foreground",
				children: ["By ", authorFor(seed)]
			}),
			seed && /* @__PURE__ */ jsx(Views, { count: viewsFor(seed) }),
			kicker && /* @__PURE__ */ jsx("span", {
				className: "kicker whitespace-nowrap text-[10px]",
				children: kicker
			})
		]
	});
}
function HeadlineArticle({ item, dense = false, priority = false }) {
	if (!item) return null;
	return /* @__PURE__ */ jsxs(Link, {
		to: "/news/$slug",
		params: { slug: item.slug || "sample" },
		className: "group block",
		suppressHydrationWarning: true,
		children: [
			item.img && /* @__PURE__ */ jsx("div", {
				className: "mb-3 overflow-hidden",
				children: /* @__PURE__ */ jsx("img", {
					src: item.img,
					alt: item.title,
					loading: "lazy",
					fetchPriority: "auto",
					decoding: "async",
					width: 400,
					height: 250,
					className: "aspect-[16/10] w-full object-cover transition-transform duration-500 group-hover:scale-105"
				})
			}),
			/* @__PURE__ */ jsx("h3", {
				className: `headline text-foreground group-hover:underline ${dense ? "text-lg" : "text-xl"}`,
				suppressHydrationWarning: true,
				children: item.title
			}),
			item.excerpt && /* @__PURE__ */ jsx("p", {
				className: "mt-2 line-clamp-2 text-sm leading-snug text-muted-foreground",
				children: item.excerpt
			}),
			/* @__PURE__ */ jsx(MinRead, {
				seed: item.title,
				kicker: item.kicker
			})
		]
	});
}
//#endregion
export { MinRead as n, HeadlineArticle as t };

//# sourceMappingURL=HeadlineArticle-BQPVBsSu.js.map