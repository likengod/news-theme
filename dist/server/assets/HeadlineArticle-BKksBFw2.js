import { t as Views } from "./Views-6i2uFZuH.js";
import { Link } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
//#region src/components/site/HeadlineArticle.tsx
function MinRead({ seed, kicker, author, views }) {
	const displayAuthor = author ? author.startsWith("By ") ? author.replace(/^By\s+/i, "") : author : "Admin User";
	const displayViews = typeof views === "number" ? views : views ? Number(views) : 0;
	return /* @__PURE__ */ jsxs("span", {
		className: "mt-3 inline-flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-muted-foreground",
		children: [
			/* @__PURE__ */ jsxs("span", {
				className: "font-medium text-foreground",
				children: ["By ", displayAuthor]
			}),
			/* @__PURE__ */ jsx(Views, { count: displayViews }),
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
					alt: "",
					"aria-hidden": "true",
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
				kicker: item.kicker,
				author: item.author,
				views: item.views
			})
		]
	});
}
//#endregion
export { MinRead as n, HeadlineArticle as t };

//# sourceMappingURL=HeadlineArticle-BKksBFw2.js.map