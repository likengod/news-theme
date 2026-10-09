import { l as viewsFor } from "./news-data-CiXcY3JG.js";
import { t as Advertisement } from "./Advertisement-CpEWtAzO.js";
import { t as Views } from "./Views-BCTnPRdw.js";
import { t as SocialIcons } from "./SocialIcons-Deca7K1i.js";
import { t as ArchiveFinder } from "./ArchiveFinder-DT67wdNi.js";
import "react";
import { Link } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
//#region src/components/site/hero/HeroSidebarRight.tsx
function HeroSidebarRight({ cfg, activeOpinionItems, activePopularItems, tags }) {
	return /* @__PURE__ */ jsxs("aside", {
		className: "space-y-6 lg:col-span-3 lg:border-l lg:border-border lg:pl-6 w-full max-w-full min-w-0",
		children: [
			/* @__PURE__ */ jsx("h2", {
				className: "rule-top font-bold uppercase tracking-[0.25em]",
				style: {
					color: cfg.heroOpinion.color,
					fontSize: `${cfg.heroOpinion.fontSize}px`
				},
				children: cfg.heroOpinion.title
			}),
			/* @__PURE__ */ jsx("ul", {
				className: "space-y-5",
				children: activeOpinionItems.map((o, i) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsxs(Link, {
					to: "/news/$slug",
					params: { slug: o?.slug || "sample" },
					className: "group flex gap-3",
					children: [/* @__PURE__ */ jsx("img", {
						src: o.img,
						alt: "",
						loading: "lazy",
						decoding: "async",
						width: 56,
						height: 56,
						className: "h-14 w-14 shrink-0 object-cover"
					}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("p", {
						className: "font-serif text-sm font-bold leading-snug text-foreground group-hover:underline line-clamp-2",
						children: o.title
					}), /* @__PURE__ */ jsxs("p", {
						className: "mt-1 text-[11px] text-muted-foreground",
						children: [
							"by ",
							o.by,
							" · ",
							/* @__PURE__ */ jsx(Views, { count: o.views || viewsFor(o.title) })
						]
					})] })]
				}) }, `${o?.title || "opinion"}-${i}`))
			}),
			/* @__PURE__ */ jsx("div", {
				className: "w-full max-w-[384px] mx-auto min-w-0",
				children: /* @__PURE__ */ jsx(Advertisement, {
					slot: "home1",
					label: "Sponsored",
					aspectRatio: "3 / 4"
				})
			}),
			/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h2", {
				className: "rule-top font-bold uppercase tracking-[0.25em]",
				style: {
					color: cfg.heroPopular.color,
					fontSize: `${cfg.heroPopular.fontSize}px`
				},
				children: cfg.heroPopular.title
			}), /* @__PURE__ */ jsx("ul", {
				className: "mt-4 space-y-4",
				children: activePopularItems.map((p, i) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsxs(Link, {
					to: "/news/$slug",
					params: { slug: p?.slug || "sample" },
					className: "group flex gap-3",
					children: [/* @__PURE__ */ jsx("img", {
						src: p.img,
						alt: "",
						loading: "lazy",
						decoding: "async",
						width: 56,
						height: 56,
						className: "h-14 w-14 shrink-0 object-cover"
					}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("p", {
						className: "font-serif text-sm font-bold leading-snug text-foreground group-hover:underline line-clamp-2",
						children: p.title
					}), /* @__PURE__ */ jsxs("p", {
						className: "mt-1 text-[11px] text-muted-foreground",
						children: [
							"by ",
							p.by,
							" · ",
							/* @__PURE__ */ jsx(Views, { count: p.views || viewsFor(p.title) })
						]
					})] })]
				}) }, `${p?.title || "popular"}-${i}`))
			})] }),
			/* @__PURE__ */ jsx(ArchiveFinder, {}),
			/* @__PURE__ */ jsxs("div", {
				className: "hidden md:block",
				children: [/* @__PURE__ */ jsx("div", {
					className: "bg-foreground py-2 text-center text-xs font-bold uppercase tracking-[0.3em] text-background",
					children: "Tags"
				}), /* @__PURE__ */ jsx("div", {
					className: "mt-4 flex flex-wrap items-baseline gap-x-3 gap-y-2",
					children: (tags.length > 0 ? tags.slice(0, 25).map((t, i) => {
						const presetSizes = [
							"text-sm",
							"text-lg font-bold",
							"text-sm",
							"text-sm",
							"text-sm",
							"text-2xl font-bold",
							"text-lg",
							"text-2xl font-bold",
							"text-lg",
							"text-xl font-bold",
							"text-sm",
							"text-lg font-bold",
							"text-sm",
							"text-base",
							"text-lg",
							"text-sm",
							"text-base font-bold",
							"text-sm",
							"text-lg",
							"text-base",
							"text-sm",
							"text-xl font-bold"
						];
						return {
							t: t.name,
							size: presetSizes[i % presetSizes.length]
						};
					}) : [
						{
							t: "Author",
							size: "text-sm"
						},
						{
							t: "Blog",
							size: "text-lg font-bold"
						},
						{
							t: "History",
							size: "text-sm"
						},
						{
							t: "Lifestyle",
							size: "text-sm"
						},
						{
							t: "Music",
							size: "text-sm"
						},
						{
							t: "Politics",
							size: "text-2xl font-bold"
						},
						{
							t: "Travel",
							size: "text-lg"
						},
						{
							t: "WordPress",
							size: "text-2xl font-bold"
						},
						{
							t: "World",
							size: "text-lg"
						},
						{
							t: "Markets",
							size: "text-xl font-bold"
						},
						{
							t: "Crypto",
							size: "text-sm"
						},
						{
							t: "Tech",
							size: "text-lg font-bold"
						},
						{
							t: "Business",
							size: "text-sm"
						},
						{
							t: "Startups",
							size: "text-base"
						},
						{
							t: "Opinion",
							size: "text-lg"
						},
						{
							t: "Sports",
							size: "text-sm"
						},
						{
							t: "Health",
							size: "text-base font-bold"
						},
						{
							t: "Science",
							size: "text-sm"
						},
						{
							t: "Climate",
							size: "text-lg"
						},
						{
							t: "Culture",
							size: "text-base"
						},
						{
							t: "Film",
							size: "text-sm"
						},
						{
							t: "Food",
							size: "text-xl font-bold"
						}
					]).map((tag) => /* @__PURE__ */ jsx("a", {
						href: `/search?q=${encodeURIComponent(tag.t)}`,
						className: `${tag.size} font-serif text-foreground hover:underline capitalize`,
						children: tag.t
					}, tag.t))
				})]
			}),
			/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
				className: "bg-foreground py-2 text-center text-xs font-bold uppercase tracking-[0.3em] text-background",
				children: "Follow"
			}), /* @__PURE__ */ jsx("div", {
				className: "mt-4 flex flex-nowrap items-center justify-center",
				children: /* @__PURE__ */ jsx(SocialIcons, {
					only: [
						"facebook",
						"twitter",
						"youtube",
						"whatsapp",
						"telegram"
					],
					size: "md"
				})
			})] })
		]
	});
}
//#endregion
export { HeroSidebarRight };

//# sourceMappingURL=HeroSidebarRight-C0ziXFMU.js.map