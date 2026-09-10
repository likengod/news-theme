import { f as sections } from "./db.server-Chz3iTW3.js";
import { t as Views } from "./Views-MJGDQohZ.js";
import { t as Footer } from "./Footer-DyWgPaNQ.js";
import { t as Header } from "./Header-BLW_wM77.js";
import { t as Route } from "./search-Bk8F_DIV.js";
import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { Search } from "lucide-react";
//#region src/routes/search.tsx?tsr-split=component
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
function SearchPage() {
	const search = Route.useSearch();
	const loaderData = Route.useLoaderData();
	const initialQ = search.q ?? "";
	const initialCat = search.category ?? "All";
	const current = search.page ?? 1;
	const [input, setInput] = useState(initialQ);
	const [category, setCategory] = useState(initialCat);
	const { items, total, totalPages } = loaderData;
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
							children: "Search Feed"
						}),
						/* @__PURE__ */ jsx("h1", {
							className: "mt-2 font-serif text-4xl font-bold text-foreground md:text-5xl",
							children: initialQ || initialCat !== "All" ? /* @__PURE__ */ jsxs(Fragment, { children: [
								"Results",
								initialQ && /* @__PURE__ */ jsxs(Fragment, { children: [
									" for “",
									initialQ,
									"”"
								] }),
								initialCat !== "All" && /* @__PURE__ */ jsxs(Fragment, { children: [
									" in “",
									initialCat,
									"”"
								] })
							] }) : "Search the news archive"
						}),
						/* @__PURE__ */ jsx("p", {
							className: "mt-3 text-sm text-muted-foreground",
							children: initialQ || initialCat !== "All" ? `${total.toLocaleString()} stories found — latest first.` : "Type a keyword or filter by category to search across all published stories."
						}),
						/* @__PURE__ */ jsxs("form", {
							onSubmit: (e) => {
								e.preventDefault();
								window.location.assign(`/search?q=${encodeURIComponent(input.trim())}&category=${encodeURIComponent(category)}&page=1`);
							},
							className: "mt-5 flex flex-col md:flex-row max-w-3xl items-stretch md:items-center border border-border bg-background",
							children: [
								/* @__PURE__ */ jsxs("div", {
									className: "flex flex-1 items-center min-w-[200px]",
									children: [/* @__PURE__ */ jsx(Search, { className: "ml-3 h-4 w-4 text-muted-foreground" }), /* @__PURE__ */ jsx("input", {
										autoFocus: true,
										value: input,
										onChange: (e) => setInput(e.target.value),
										type: "search",
										placeholder: "Search news headline or content…",
										className: "w-full bg-transparent px-3 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
									})]
								}),
								/* @__PURE__ */ jsx("div", {
									className: "flex border-t md:border-t-0 md:border-l border-border items-center bg-background pr-4",
									children: /* @__PURE__ */ jsxs("select", {
										value: category,
										onChange: (e) => setCategory(e.target.value),
										className: "bg-transparent px-4 py-3 text-sm text-foreground focus:outline-none cursor-pointer",
										children: [/* @__PURE__ */ jsx("option", {
											value: "All",
											children: "All Categories"
										}), sections.filter((s) => s !== "Others").map((s) => /* @__PURE__ */ jsx("option", {
											value: s,
											children: s
										}, s))]
									})
								}),
								/* @__PURE__ */ jsx("button", {
									type: "submit",
									className: "bg-foreground px-6 py-3 text-xs font-bold uppercase tracking-widest text-background hover:opacity-80 transition-opacity",
									children: "Search"
								})
							]
						})
					]
				}), /* @__PURE__ */ jsx("section", {
					className: "pt-8",
					children: /* @__PURE__ */ jsxs("div", {
						className: "divide-y divide-border",
						children: [
							items.length === 0 && /* @__PURE__ */ jsx("p", {
								className: "py-10 text-center text-sm text-muted-foreground",
								children: "No stories matched your search. Try changing keywords or category."
							}),
							items.map((p, i) => /* @__PURE__ */ jsxs("article", {
								className: "grid grid-cols-[140px_1fr] gap-5 py-6 first:pt-0 md:grid-cols-[200px_1fr]",
								children: [/* @__PURE__ */ jsx(Link, {
									to: `/news/${p.slug}`,
									className: "block overflow-hidden",
									children: /* @__PURE__ */ jsx("img", {
										src: p.featuredImage || "/assets/hero-markets-WavlqySf.webp",
										alt: p.title,
										className: "aspect-[4/3] w-full object-cover rounded-sm hover:scale-105 transition-transform duration-300"
									})
								}), /* @__PURE__ */ jsxs("div", { children: [
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
								] })]
							}, `${p.title}-${i}`)),
							totalPages > 1 && /* @__PURE__ */ jsxs("nav", {
								className: "flex flex-wrap items-center justify-center gap-2 py-8",
								children: [
									current > 1 && /* @__PURE__ */ jsx(Link, {
										to: "/search",
										search: {
											...search,
											page: current - 1
										},
										className: "border border-border px-3 py-2 text-xs font-semibold uppercase tracking-widest hover:bg-foreground hover:text-background",
										children: "← Prev"
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "flex items-center px-4 text-sm font-medium text-muted-foreground",
										children: [
											"Page ",
											current,
											" of ",
											totalPages
										]
									}),
									current < totalPages && /* @__PURE__ */ jsx(Link, {
										to: "/search",
										search: {
											...search,
											page: current + 1
										},
										className: "border border-border px-3 py-2 text-xs font-semibold uppercase tracking-widest hover:bg-foreground hover:text-background",
										children: "Next →"
									})
								]
							})
						]
					})
				})]
			}),
			/* @__PURE__ */ jsx(Footer, {})
		]
	});
}
//#endregion
export { SearchPage as component };
