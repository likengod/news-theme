import { f as getPublicRelatedArticles } from "./articles.functions-mASEQ4tr.js";
import { t as formatViews } from "./news-data-CiXcY3JG.js";
import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
//#region src/components/site/RelatedNews.tsx
function RelatedNews({ currentSlug, category }) {
	const [items, setItems] = useState([]);
	const [loading, setLoading] = useState(true);
	useEffect(() => {
		let active = true;
		if (!currentSlug) return;
		setLoading(true);
		getPublicRelatedArticles({ data: {
			category,
			currentSlug,
			limit: 4
		} }).then((data) => {
			if (active) setItems(data || []);
		}).catch((err) => {
			console.error("Failed to load related articles:", err);
		}).finally(() => {
			if (active) setLoading(false);
		});
		return () => {
			active = false;
		};
	}, [currentSlug, category]);
	if (items.length === 0) return null;
	return /* @__PURE__ */ jsxs("section", {
		className: "mt-12 border-t border-border pt-6",
		children: [/* @__PURE__ */ jsx("h3", {
			className: "mb-5 headline font-serif text-2xl font-bold text-primary",
			children: "Related News"
		}), /* @__PURE__ */ jsx("div", {
			className: "grid grid-cols-2 gap-6 md:grid-cols-4",
			children: items.map((it) => {
				const views = it.views || 0;
				const displayImage = it.featuredImage || it.ogImage || "/placeholder.svg";
				const kicker = it.category || "News";
				return /* @__PURE__ */ jsxs(Link, {
					to: "/news/$slug",
					params: { slug: it.slug },
					className: "group block",
					children: [
						/* @__PURE__ */ jsx("div", {
							className: "overflow-hidden rounded-md bg-muted aspect-[16/9]",
							children: /* @__PURE__ */ jsx("img", {
								src: displayImage,
								alt: it.title,
								loading: "lazy",
								decoding: "async",
								className: "aspect-[16/9] w-full object-cover transition-transform duration-500 group-hover:scale-105"
							})
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "mt-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground",
							children: [
								kicker,
								" · ",
								formatViews(views),
								" views"
							]
						}),
						/* @__PURE__ */ jsx("h4", {
							className: "mt-1 line-clamp-2 headline font-serif text-[15px] font-bold leading-snug text-primary group-hover:underline",
							children: it.title
						})
					]
				}, it.id || it.slug);
			})
		})]
	});
}
//#endregion
export { RelatedNews, RelatedNews as default };

//# sourceMappingURL=RelatedNews-8uvtG9pC.js.map