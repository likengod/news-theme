import "./news-data-CiXcY3JG.js";
import { t as Views } from "./Views-BCTnPRdw.js";
import { t as Footer } from "./Footer-7yQaoJqX.js";
import { t as Header } from "./Header-DdZIwA_-.js";
import { t as Route } from "./search-wfgScUkK.js";
import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { ArrowRight, ChevronRight, FileText, Folder, Hash, Newspaper, Search, ShieldCheck, Sparkles } from "lucide-react";
//#region src/components/search/SearchFilters.tsx
function SearchFilters({ input, setInput, category, setCategory, allCategories, handleSearchSubmit, search, initialTab, totalResults, counts, isQueryActive }) {
	return /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsxs("form", {
		onSubmit: handleSearchSubmit,
		className: "mt-6 flex flex-col md:flex-row max-w-4xl items-stretch border border-border bg-card shadow-xs rounded-none transition-all focus-within:ring-2 focus-within:ring-foreground/20",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "flex flex-1 items-center min-w-[220px] px-3",
				children: [
					/* @__PURE__ */ jsx(Search, { className: "h-4 w-4 shrink-0 text-muted-foreground" }),
					/* @__PURE__ */ jsx("input", {
						autoFocus: true,
						value: input,
						onChange: (e) => setInput(e.target.value),
						type: "search",
						placeholder: "Search articles, categories, or pages (e.g. Sports, Fact Check, About Us)…",
						className: "w-full bg-transparent px-3 py-3.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
					}),
					input && /* @__PURE__ */ jsx("button", {
						type: "button",
						onClick: () => setInput(""),
						className: "text-xs text-muted-foreground hover:text-foreground px-2 py-1",
						children: "Clear"
					})
				]
			}),
			/* @__PURE__ */ jsx("div", {
				className: "flex border-t md:border-t-0 md:border-l border-border items-center bg-card pr-3",
				children: /* @__PURE__ */ jsxs("select", {
					value: category,
					onChange: (e) => setCategory(e.target.value),
					className: "bg-transparent px-4 py-3.5 text-sm text-foreground focus:outline-none cursor-pointer",
					"aria-label": "Filter by category",
					children: [/* @__PURE__ */ jsx("option", {
						value: "All",
						children: "All Categories"
					}), allCategories.map((c) => /* @__PURE__ */ jsx("option", {
						value: c.name,
						children: c.name
					}, c.slug))]
				})
			}),
			/* @__PURE__ */ jsx("button", {
				type: "submit",
				className: "bg-foreground px-8 py-3.5 text-xs font-bold uppercase tracking-widest text-background hover:opacity-85 transition-opacity shrink-0",
				children: "Search"
			})
		]
	}), isQueryActive && /* @__PURE__ */ jsxs("div", {
		className: "mt-8 flex flex-wrap items-center gap-2 border-b border-border/60 pb-3",
		children: [
			/* @__PURE__ */ jsxs(Link, {
				to: "/search",
				search: {
					...search,
					tab: "all",
					page: 1
				},
				className: `inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider rounded-full transition-colors ${initialTab === "all" ? "bg-foreground text-background shadow-xs" : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"}`,
				children: [/* @__PURE__ */ jsx("span", { children: "All Results" }), /* @__PURE__ */ jsx("span", {
					className: `text-[10px] px-1.5 py-0.5 rounded-full ${initialTab === "all" ? "bg-background/20 text-background" : "bg-border text-foreground"}`,
					children: totalResults
				})]
			}),
			/* @__PURE__ */ jsxs(Link, {
				to: "/search",
				search: {
					...search,
					tab: "articles",
					page: 1
				},
				className: `inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider rounded-full transition-colors ${initialTab === "articles" ? "bg-foreground text-background shadow-xs" : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"}`,
				children: [
					/* @__PURE__ */ jsx(Newspaper, { className: "h-3.5 w-3.5" }),
					/* @__PURE__ */ jsx("span", { children: "Stories" }),
					/* @__PURE__ */ jsx("span", {
						className: `text-[10px] px-1.5 py-0.5 rounded-full ${initialTab === "articles" ? "bg-background/20 text-background" : "bg-border text-foreground"}`,
						children: counts.articles
					})
				]
			}),
			/* @__PURE__ */ jsxs(Link, {
				to: "/search",
				search: {
					...search,
					tab: "categories",
					page: 1
				},
				className: `inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider rounded-full transition-colors ${initialTab === "categories" ? "bg-foreground text-background shadow-xs" : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"}`,
				children: [
					/* @__PURE__ */ jsx(Folder, { className: "h-3.5 w-3.5" }),
					/* @__PURE__ */ jsx("span", { children: "Categories" }),
					/* @__PURE__ */ jsx("span", {
						className: `text-[10px] px-1.5 py-0.5 rounded-full ${initialTab === "categories" ? "bg-background/20 text-background" : "bg-border text-foreground"}`,
						children: counts.categories
					})
				]
			}),
			/* @__PURE__ */ jsxs(Link, {
				to: "/search",
				search: {
					...search,
					tab: "pages",
					page: 1
				},
				className: `inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider rounded-full transition-colors ${initialTab === "pages" ? "bg-foreground text-background shadow-xs" : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"}`,
				children: [
					/* @__PURE__ */ jsx(FileText, { className: "h-3.5 w-3.5" }),
					/* @__PURE__ */ jsx("span", { children: "Pages & Desks" }),
					/* @__PURE__ */ jsx("span", {
						className: `text-[10px] px-1.5 py-0.5 rounded-full ${initialTab === "pages" ? "bg-background/20 text-background" : "bg-border text-foreground"}`,
						children: counts.pages
					})
				]
			})
		]
	})] });
}
//#endregion
//#region src/components/search/SearchPagination.tsx
function SearchPagination({ current, totalPages, search }) {
	if (totalPages <= 1) return null;
	return /* @__PURE__ */ jsxs("nav", {
		className: "flex flex-wrap items-center justify-center gap-2 py-8",
		children: [
			current > 1 && /* @__PURE__ */ jsx(Link, {
				to: "/search",
				search: {
					...search,
					page: current - 1
				},
				className: "border border-border px-3.5 py-2 text-xs font-semibold uppercase tracking-widest hover:bg-foreground hover:text-background transition-colors",
				children: "← Prev"
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "flex items-center px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground",
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
				className: "border border-border px-3.5 py-2 text-xs font-semibold uppercase tracking-widest hover:bg-foreground hover:text-background transition-colors",
				children: "Next →"
			})
		]
	});
}
//#endregion
//#region src/components/search/SearchResultsList.tsx
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
function SearchResultsList({ isQueryActive, hasResults, initialQ, allCategories, initialTab, categories, pages, items, totalArticles, search, current, totalPages }) {
	return /* @__PURE__ */ jsxs("section", {
		className: "pt-8",
		children: [
			isQueryActive && !hasResults && /* @__PURE__ */ jsxs("div", {
				className: "py-16 text-center max-w-lg mx-auto",
				children: [
					/* @__PURE__ */ jsx("div", {
						className: "mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-muted text-muted-foreground mb-4",
						children: /* @__PURE__ */ jsx(Search, { className: "h-6 w-6" })
					}),
					/* @__PURE__ */ jsx("h2", {
						className: "font-serif text-2xl font-bold text-foreground",
						children: "No matches found"
					}),
					/* @__PURE__ */ jsxs("p", {
						className: "mt-2 text-sm text-muted-foreground leading-relaxed",
						children: [
							"We couldn’t find any stories, categories, or active pages matching “",
							initialQ,
							"”. Try checking the spelling, using more general terms, or browse popular sections below."
						]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "mt-6 pt-6 border-t border-border",
						children: [/* @__PURE__ */ jsx("p", {
							className: "text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3",
							children: "Browse Popular Categories"
						}), /* @__PURE__ */ jsx("div", {
							className: "flex flex-wrap items-center justify-center gap-2",
							children: allCategories.slice(0, 8).map((c) => /* @__PURE__ */ jsxs(Link, {
								to: "/$slug",
								params: { slug: c.slug },
								className: "inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-border bg-card hover:bg-foreground hover:text-background transition-colors",
								children: [/* @__PURE__ */ jsx(Hash, { className: "h-3 w-3 opacity-60" }), /* @__PURE__ */ jsx("span", { children: c.name })]
							}, c.slug))
						})]
					})
				]
			}),
			(initialTab === "all" || initialTab === "categories") && categories.length > 0 && /* @__PURE__ */ jsxs("div", {
				className: "mb-12",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "flex items-center justify-between mb-4 pb-2 border-b border-border/50",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ jsx("span", {
							className: "flex h-6 w-6 items-center justify-center rounded-md bg-primary/10 text-primary",
							children: /* @__PURE__ */ jsx(Folder, { className: "h-3.5 w-3.5" })
						}), /* @__PURE__ */ jsxs("h2", {
							className: "font-serif text-xl font-bold text-foreground",
							children: [
								"Matching Categories (",
								categories.length,
								")"
							]
						})]
					}), initialTab === "all" && categories.length > 3 && /* @__PURE__ */ jsxs(Link, {
						to: "/search",
						search: {
							...search,
							tab: "categories",
							page: 1
						},
						className: "text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1",
						children: [
							"View all ",
							categories.length,
							" categories ",
							/* @__PURE__ */ jsx(ChevronRight, { className: "h-3 w-3" })
						]
					})]
				}), /* @__PURE__ */ jsx("div", {
					className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-3",
					children: categories.map((cat) => /* @__PURE__ */ jsxs("div", {
						className: "group relative flex flex-col justify-between rounded-xl border border-border bg-card p-4 transition-all duration-200 hover:border-foreground/40 hover:shadow-sm",
						children: [/* @__PURE__ */ jsxs("div", { children: [
							/* @__PURE__ */ jsxs("div", {
								className: "flex items-center justify-between gap-2",
								children: [/* @__PURE__ */ jsxs("span", {
									className: "inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary",
									children: [/* @__PURE__ */ jsx(Hash, { className: "h-3 w-3" }), /* @__PURE__ */ jsx("span", { children: "Category Desk" })]
								}), /* @__PURE__ */ jsxs("span", {
									className: "text-[11px] font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded-full",
									children: [
										cat.count,
										" ",
										cat.count === 1 ? "article" : "articles"
									]
								})]
							}),
							/* @__PURE__ */ jsx("h3", {
								className: "mt-2 font-serif text-lg font-bold text-foreground group-hover:text-primary transition-colors",
								children: /* @__PURE__ */ jsx(Link, {
									to: "/$slug",
									params: { slug: cat.slug },
									children: cat.name
								})
							}),
							cat.description && /* @__PURE__ */ jsx("p", {
								className: "mt-1.5 text-xs text-muted-foreground line-clamp-2 leading-relaxed",
								children: cat.description
							})
						] }), /* @__PURE__ */ jsxs("div", {
							className: "mt-4 pt-3 border-t border-border/40 flex items-center justify-between",
							children: [/* @__PURE__ */ jsxs(Link, {
								to: "/$slug",
								params: { slug: cat.slug },
								className: "inline-flex items-center gap-1 text-xs font-semibold text-foreground group-hover:text-primary transition-colors",
								children: [/* @__PURE__ */ jsx("span", { children: "Open Category Feed" }), /* @__PURE__ */ jsx(ArrowRight, { className: "h-3 w-3 group-hover:translate-x-0.5 transition-transform" })]
							}), /* @__PURE__ */ jsx(Link, {
								to: "/search",
								search: {
									q: "",
									category: cat.name,
									page: 1,
									tab: "articles"
								},
								className: "text-[11px] text-muted-foreground hover:text-foreground hover:underline",
								children: "Search stories here"
							})]
						})]
					}, cat.id))
				})]
			}),
			(initialTab === "all" || initialTab === "pages") && pages.length > 0 && /* @__PURE__ */ jsxs("div", {
				className: "mb-12",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "flex items-center justify-between mb-4 pb-2 border-b border-border/50",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ jsx("span", {
							className: "flex h-6 w-6 items-center justify-center rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400",
							children: /* @__PURE__ */ jsx(FileText, { className: "h-3.5 w-3.5" })
						}), /* @__PURE__ */ jsxs("h2", {
							className: "font-serif text-xl font-bold text-foreground",
							children: [
								"Pages & Desks (",
								pages.length,
								")"
							]
						})]
					}), initialTab === "all" && pages.length > 3 && /* @__PURE__ */ jsxs(Link, {
						to: "/search",
						search: {
							...search,
							tab: "pages",
							page: 1
						},
						className: "text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1",
						children: [
							"View all ",
							pages.length,
							" pages ",
							/* @__PURE__ */ jsx(ChevronRight, { className: "h-3 w-3" })
						]
					})]
				}), /* @__PURE__ */ jsx("div", {
					className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-3",
					children: pages.map((p) => {
						return /* @__PURE__ */ jsxs("div", {
							className: "group relative flex flex-col justify-between rounded-xl border border-border bg-card p-4 transition-all duration-200 hover:border-foreground/40 hover:shadow-sm",
							children: [/* @__PURE__ */ jsxs("div", { children: [
								/* @__PURE__ */ jsxs("div", {
									className: "flex items-center justify-between gap-2",
									children: [/* @__PURE__ */ jsxs("span", {
										className: `inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-md border ${p.sectionBadge === "Feature" ? "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-200/50" : p.sectionBadge === "Policy" ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200/50" : p.sectionBadge === "Service" ? "bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-200/50" : "bg-muted text-muted-foreground border-border"}`,
										children: [
											p.sectionBadge === "Feature" && /* @__PURE__ */ jsx(Sparkles, { className: "h-2.5 w-2.5" }),
											p.sectionBadge === "Policy" && /* @__PURE__ */ jsx(ShieldCheck, { className: "h-2.5 w-2.5" }),
											/* @__PURE__ */ jsx("span", { children: p.sectionBadge })
										]
									}), /* @__PURE__ */ jsx("span", {
										className: "text-[10px] text-muted-foreground font-mono",
										children: p.url
									})]
								}),
								/* @__PURE__ */ jsx("h3", {
									className: "mt-2.5 font-serif text-base font-bold text-foreground group-hover:text-primary transition-colors",
									children: /* @__PURE__ */ jsx(Link, {
										to: p.url,
										children: p.title
									})
								}),
								p.intro && /* @__PURE__ */ jsx("p", {
									className: "mt-1.5 text-xs text-muted-foreground line-clamp-2 leading-relaxed",
									children: p.intro
								})
							] }), /* @__PURE__ */ jsx("div", {
								className: "mt-4 pt-3 border-t border-border/40 flex items-center justify-between",
								children: /* @__PURE__ */ jsxs(Link, {
									to: p.url,
									className: "inline-flex items-center gap-1 text-xs font-semibold text-foreground group-hover:text-primary transition-colors",
									children: [/* @__PURE__ */ jsx("span", { children: "Visit Page" }), /* @__PURE__ */ jsx(ArrowRight, { className: "h-3 w-3 group-hover:translate-x-0.5 transition-transform" })]
								})
							})]
						}, p.slug);
					})
				})]
			}),
			(initialTab === "all" || initialTab === "articles") && /* @__PURE__ */ jsxs("div", { children: [(initialTab === "all" || initialTab === "articles") && /* @__PURE__ */ jsx("div", {
				className: "flex items-center justify-between mb-4 pb-2 border-b border-border/50",
				children: /* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ jsx("span", {
						className: "flex h-6 w-6 items-center justify-center rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
						children: /* @__PURE__ */ jsx(Newspaper, { className: "h-3.5 w-3.5" })
					}), /* @__PURE__ */ jsxs("h2", {
						className: "font-serif text-xl font-bold text-foreground",
						children: [
							"News Stories (",
							totalArticles.toLocaleString(),
							")"
						]
					})]
				})
			}), items.length === 0 ? initialTab === "articles" ? /* @__PURE__ */ jsx("p", {
				className: "py-10 text-center text-sm text-muted-foreground",
				children: "No articles matched your search. Try changing keywords or category filter."
			}) : null : /* @__PURE__ */ jsxs("div", {
				className: "divide-y divide-border",
				children: [items.map((p, i) => /* @__PURE__ */ jsxs("article", {
					className: "grid grid-cols-[130px_1fr] sm:grid-cols-[170px_1fr] md:grid-cols-[220px_1fr] gap-4 sm:gap-6 py-6 first:pt-0",
					children: [/* @__PURE__ */ jsx(Link, {
						to: "/news/$slug",
						params: { slug: p.slug || "sample" },
						className: "block overflow-hidden rounded-sm group aspect-[16/9] bg-muted shrink-0",
						children: /* @__PURE__ */ jsx("img", {
							src: p.featuredImage || "/assets/hero-markets-WavlqySf.webp",
							alt: p.title,
							loading: "lazy",
							decoding: "async",
							width: 220,
							height: 124,
							className: "h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
						})
					}), /* @__PURE__ */ jsxs("div", {
						className: "flex flex-col justify-between",
						children: [/* @__PURE__ */ jsxs("div", { children: [
							/* @__PURE__ */ jsxs("div", {
								className: "flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-widest text-muted-foreground mb-1.5",
								children: [
									/* @__PURE__ */ jsx("span", {
										className: "font-bold text-primary normal-case tracking-normal",
										children: p.category
									}),
									/* @__PURE__ */ jsx("span", { children: "·" }),
									/* @__PURE__ */ jsx("span", {
										className: "normal-case tracking-normal",
										children: fmtDate(new Date(p.date))
									})
								]
							}),
							/* @__PURE__ */ jsx("h3", {
								className: "headline font-serif text-base sm:text-lg md:text-xl font-bold leading-snug text-foreground hover:text-primary transition-colors line-clamp-2",
								children: /* @__PURE__ */ jsx(Link, {
									to: "/news/$slug",
									params: { slug: p.slug || "sample" },
									children: p.title
								})
							}),
							p.excerpt && /* @__PURE__ */ jsx("p", {
								className: "mt-2 text-xs sm:text-sm leading-relaxed text-muted-foreground line-clamp-2",
								children: p.excerpt
							})
						] }), /* @__PURE__ */ jsxs("div", {
							className: "mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-muted-foreground",
							children: [p.author && /* @__PURE__ */ jsxs("span", { children: ["By ", p.author] }), /* @__PURE__ */ jsx("span", {
								className: "ml-auto",
								children: /* @__PURE__ */ jsx(Views, { count: p.views })
							})]
						})]
					})]
				}, `${p.slug}-${p.id || i}`)), /* @__PURE__ */ jsx(SearchPagination, {
					current,
					totalPages,
					search
				})]
			})] })
		]
	});
}
//#endregion
//#region src/routes/search.tsx?tsr-split=component
function SearchPage() {
	const search = Route.useSearch();
	const loaderData = Route.useLoaderData();
	const initialQ = search.q ?? "";
	const initialCat = search.category ?? "All";
	const initialTab = search.tab ?? "all";
	const current = search.page ?? 1;
	const [input, setInput] = useState(initialQ);
	const [category, setCategory] = useState(initialCat);
	const { articles, categories, pages, allCategories, counts } = loaderData;
	const { items, total: totalArticles, totalPages } = articles;
	const totalResults = counts.total;
	const hasResults = totalResults > 0;
	const isQueryActive = Boolean(initialQ.trim() || initialCat !== "All");
	const buildSearchUrl = (newParams) => {
		const qParam = newParams.q !== void 0 ? newParams.q : initialQ;
		const catParam = newParams.category !== void 0 ? newParams.category : initialCat;
		const pageParam = newParams.page !== void 0 ? newParams.page : 1;
		const tabParam = newParams.tab !== void 0 ? newParams.tab : initialTab;
		const sp = new URLSearchParams();
		if (qParam) sp.set("q", qParam.trim());
		if (catParam && catParam !== "All") sp.set("category", catParam);
		if (pageParam > 1) sp.set("page", String(pageParam));
		if (tabParam && tabParam !== "all") sp.set("tab", tabParam);
		return `/search?${sp.toString()}`;
	};
	const handleSearchSubmit = (e) => {
		e.preventDefault();
		window.location.assign(buildSearchUrl({
			q: input.trim(),
			category,
			page: 1,
			tab: "all"
		}));
	};
	return /* @__PURE__ */ jsxs("div", {
		className: "min-h-screen bg-background text-foreground flex flex-col justify-between",
		children: [
			/* @__PURE__ */ jsx(Header, {}),
			/* @__PURE__ */ jsxs("main", {
				className: "mx-auto max-w-7xl px-4 py-8 md:py-12 flex-1 w-full",
				children: [/* @__PURE__ */ jsxs("header", {
					className: "border-b border-border pb-8",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-[0.25em] text-muted-foreground",
							children: [
								/* @__PURE__ */ jsx("span", { children: "Newsroom Finder" }),
								/* @__PURE__ */ jsx("span", { children: "·" }),
								/* @__PURE__ */ jsx("span", { children: "Unified Search" })
							]
						}),
						/* @__PURE__ */ jsx("h1", {
							className: "mt-2 font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-foreground",
							children: isQueryActive ? /* @__PURE__ */ jsxs(Fragment, { children: [
								"Search Results",
								initialQ && /* @__PURE__ */ jsx("span", {
									className: "font-sans font-normal text-muted-foreground",
									children: " for "
								}),
								initialQ && /* @__PURE__ */ jsxs("span", { children: [
									"“",
									initialQ,
									"”"
								] }),
								initialCat !== "All" && /* @__PURE__ */ jsxs("span", {
									className: "text-xl sm:text-2xl md:text-3xl text-muted-foreground block sm:inline sm:ml-2",
									children: ["in ", initialCat]
								})
							] }) : "Search Stories, Categories & Pages"
						}),
						/* @__PURE__ */ jsx("p", {
							className: "mt-2.5 text-sm text-muted-foreground max-w-3xl leading-relaxed",
							children: isQueryActive ? `Found ${totalResults.toLocaleString()} result${totalResults === 1 ? "" : "s"} across news archive, categories, and site pages.` : "Search all published stories, regional sections, editorial policies, and live desks with verified access."
						}),
						/* @__PURE__ */ jsx(SearchFilters, {
							input,
							setInput,
							category,
							setCategory,
							allCategories,
							handleSearchSubmit,
							search,
							initialTab,
							totalResults,
							counts,
							isQueryActive
						})
					]
				}), /* @__PURE__ */ jsx(SearchResultsList, {
					isQueryActive,
					hasResults,
					initialQ,
					allCategories,
					initialTab,
					categories,
					pages,
					items,
					totalArticles,
					search,
					current,
					totalPages
				})]
			}),
			/* @__PURE__ */ jsx(Footer, {})
		]
	});
}
//#endregion
export { SearchPage as component };

//# sourceMappingURL=search-bvv_zPhW.js.map