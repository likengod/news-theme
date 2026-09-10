import { t as Advertisement } from "./Advertisement-Da8gy5zI.js";
import { t as Views } from "./Views-DJ1173PA.js";
import { t as Footer } from "./Footer--Y08O8so.js";
import { t as Header } from "./Header-NEbRJjIK.js";
import { t as Route } from "./archive-ljUAb5D_.js";
import { t as ArchiveFinder } from "./ArchiveFinder-CRW_hGql.js";
import React from "react";
import { Link } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
//#region src/routes/archive.tsx?tsr-split=component
function fmtDate(d) {
	if (isNaN(d.getTime())) return "";
	const months = [
		"January",
		"February",
		"March",
		"April",
		"May",
		"June",
		"July",
		"August",
		"September",
		"October",
		"November",
		"December"
	];
	const day = d.getUTCDate();
	return `${months[d.getUTCMonth()]} ${day}, ${d.getUTCFullYear()}`;
}
function ArchivePage() {
	const search = Route.useSearch();
	const loaderData = Route.useLoaderData();
	const page = search.page ?? 1;
	const { items, total, totalPages } = loaderData;
	const label = [
		search.day ? Number(search.day) : null,
		search.month ? [
			"",
			"January",
			"February",
			"March",
			"April",
			"May",
			"June",
			"July",
			"August",
			"September",
			"October",
			"November",
			"December"
		][Number(search.month)] : null,
		search.year ?? null
	].filter(Boolean).join(" ");
	return /* @__PURE__ */ jsxs("div", {
		className: "min-h-screen bg-background text-foreground",
		children: [
			/* @__PURE__ */ jsx(Header, {}),
			/* @__PURE__ */ jsxs("main", {
				className: "mx-auto max-w-7xl px-4 py-10",
				children: [/* @__PURE__ */ jsxs("header", {
					className: "border-b border-border pb-6",
					children: [
						/* @__PURE__ */ jsx("p", {
							className: "text-xs font-bold uppercase tracking-[0.3em] text-muted-foreground",
							children: "Archive"
						}),
						/* @__PURE__ */ jsx("h1", {
							className: "mt-2 font-serif text-5xl font-bold text-foreground md:text-6xl",
							children: label || "All Stories"
						}),
						/* @__PURE__ */ jsxs("p", {
							className: "mt-3 text-sm text-muted-foreground",
							children: [
								total.toLocaleString(),
								" stories found",
								label ? ` for ${label}` : "",
								"."
							]
						})
					]
				}), /* @__PURE__ */ jsxs("section", {
					className: "grid grid-cols-1 gap-10 pt-8 lg:grid-cols-[1fr_300px]",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "divide-y divide-border",
						children: [
							items.length === 0 && /* @__PURE__ */ jsx("p", {
								className: "py-10 text-center text-sm text-muted-foreground",
								children: "No stories found for this date. Try a different day, month or year."
							}),
							items.map((p, i) => /* @__PURE__ */ jsxs(React.Fragment, { children: [/* @__PURE__ */ jsx("article", {
								className: "py-6 first:pt-0",
								children: /* @__PURE__ */ jsxs("div", { children: [
									/* @__PURE__ */ jsx("h3", {
										className: "headline font-serif text-lg font-bold leading-snug text-primary line-clamp-2",
										children: /* @__PURE__ */ jsx(Link, {
											to: `/news/${p.slug}`,
											className: "hover:underline",
											children: p.title
										})
									}),
									/* @__PURE__ */ jsx("p", {
										className: "mt-2 text-sm leading-relaxed text-muted-foreground line-clamp-2",
										children: p.excerpt
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] uppercase tracking-widest",
										children: [
											/* @__PURE__ */ jsx("span", {
												className: "text-muted-foreground normal-case tracking-normal",
												children: fmtDate(new Date(p.date))
											}),
											/* @__PURE__ */ jsxs("span", {
												className: "font-semibold text-foreground",
												children: ["· ", p.category]
											}),
											/* @__PURE__ */ jsx("span", {
												className: "ml-auto",
												children: /* @__PURE__ */ jsx(Views, { count: p.views })
											})
										]
									})
								] })
							}), (i + 1) % 3 === 0 && /* @__PURE__ */ jsx("div", {
								className: "py-6",
								children: /* @__PURE__ */ jsx(Advertisement, {
									slot: "leaderboard",
									aspectRatio: "728 / 90"
								})
							})] }, `${p.title}-${i}`)),
							totalPages > 1 && /* @__PURE__ */ jsxs("nav", {
								className: "flex flex-wrap items-center justify-center gap-2 py-8",
								children: [
									page > 1 && /* @__PURE__ */ jsx(Link, {
										to: "/archive",
										search: {
											...search,
											page: page - 1
										},
										className: "border border-border px-3 py-2 text-xs font-semibold uppercase tracking-widest hover:bg-foreground hover:text-background",
										children: "← Prev"
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "flex items-center px-4 text-sm font-medium text-muted-foreground",
										children: [
											"Page ",
											page,
											" of ",
											totalPages
										]
									}),
									page < totalPages && /* @__PURE__ */ jsx(Link, {
										to: "/archive",
										search: {
											...search,
											page: page + 1
										},
										className: "border border-border px-3 py-2 text-xs font-semibold uppercase tracking-widest hover:bg-foreground hover:text-background",
										children: "Next →"
									})
								]
							})
						]
					}), /* @__PURE__ */ jsx("aside", {
						className: "space-y-6",
						children: /* @__PURE__ */ jsx(ArchiveFinder, {})
					})]
				})]
			}),
			/* @__PURE__ */ jsx(Footer, {})
		]
	});
}
//#endregion
export { ArchivePage as component };
