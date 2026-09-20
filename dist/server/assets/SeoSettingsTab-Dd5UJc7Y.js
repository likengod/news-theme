import { n as MediaField } from "./MediaField-DE3lx-rO.js";
import { t as Card } from "./SettingsHelpers-CAQbk9NV.js";
import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { ArrowRight, Bot, Code2, ExternalLink, Newspaper, Search, ShieldCheck } from "lucide-react";
//#region src/components/admin/settings/SeoSettingsTab.tsx
function SeoSettingsTab({ s, update }) {
	const navigate = useNavigate();
	const currentTitle = s.siteName || "News Timeline";
	const currentDesc = s.metaDescription || "Latest breaking news, politics, Northeast India coverage, current affairs, and ground reports.";
	const currentOrigin = typeof window !== "undefined" && window.location?.origin ? window.location.origin : "http://localhost:3099";
	const canonicalUrl = s.seoCanonicalBaseUrl || currentOrigin;
	useEffect(() => {
		if (!s.seoCanonicalBaseUrl || s.seoCanonicalBaseUrl.includes("domainname.com") || s.seoCanonicalBaseUrl.includes("todaytripura.com")) {
			if (typeof window !== "undefined" && window.location?.origin) update("seoCanonicalBaseUrl", window.location.origin);
		}
	}, []);
	return /* @__PURE__ */ jsxs("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "rounded-xl border border-slate-200 bg-white p-5 shadow-xs",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "flex items-center justify-between border-b border-slate-100 pb-3 mb-3",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ jsx(Search, { className: "h-4 w-4 text-blue-600" }), /* @__PURE__ */ jsx("h2", {
								className: "text-sm font-bold text-slate-800 uppercase tracking-wider",
								children: "Google Search Result Snippet Preview"
							})]
						}), /* @__PURE__ */ jsx("span", {
							className: "text-[11px] font-medium text-slate-500",
							children: "Live SERP Simulation"
						})]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "rounded-lg border border-slate-100 bg-slate-50 p-4 max-w-2xl",
						children: [
							/* @__PURE__ */ jsxs("div", {
								className: "flex items-center gap-2 text-xs text-slate-700 mb-1",
								children: [
									/* @__PURE__ */ jsx("div", {
										className: "h-4 w-4 rounded-full bg-slate-200 flex items-center justify-center text-[9px] font-bold",
										children: "G"
									}),
									/* @__PURE__ */ jsx("span", {
										className: "truncate",
										children: canonicalUrl.replace(/^https?:\/\//, "")
									}),
									/* @__PURE__ */ jsx("span", {
										className: "text-slate-400",
										children: "› news"
									})
								]
							}),
							/* @__PURE__ */ jsxs("h3", {
								className: "text-base sm:text-lg font-medium text-blue-700 hover:underline cursor-pointer truncate",
								children: [
									currentTitle,
									" ",
									s.tagline ? `– ${s.tagline}` : "– Breaking News"
								]
							}),
							/* @__PURE__ */ jsx("p", {
								className: "text-xs sm:text-sm text-slate-600 mt-1 line-clamp-2 leading-relaxed",
								children: currentDesc
							})
						]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "mt-3 flex items-center justify-between text-xs text-slate-500 border-t border-slate-100 pt-2.5",
						children: [/* @__PURE__ */ jsxs("span", { children: [
							"Search title & snippet are dynamically generated from your ",
							/* @__PURE__ */ jsx("strong", { children: "Site Name" }),
							", ",
							/* @__PURE__ */ jsx("strong", { children: "Tagline" }),
							", and ",
							/* @__PURE__ */ jsx("strong", { children: "Meta Description" }),
							"."
						] }), /* @__PURE__ */ jsxs("button", {
							type: "button",
							onClick: () => navigate({
								to: ".",
								search: { tab: "general" }
							}),
							className: "inline-flex items-center gap-1 font-semibold text-blue-600 hover:underline",
							children: ["Edit in General Settings ", /* @__PURE__ */ jsx(ArrowRight, { className: "h-3 w-3" })]
						})]
					})
				]
			}),
			/* @__PURE__ */ jsx(Card, {
				title: "1. Canonical Domain & Search Keywords",
				subtitle: "Configure your primary production canonical URL and global publication search keywords.",
				children: /* @__PURE__ */ jsxs("div", {
					className: "grid gap-4 sm:grid-cols-2",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "sm:col-span-2",
						children: [
							/* @__PURE__ */ jsxs("div", {
								className: "flex items-center justify-between mb-1",
								children: [/* @__PURE__ */ jsx("label", {
									className: "block text-xs font-bold text-slate-700",
									children: "Canonical Base URL"
								}), /* @__PURE__ */ jsxs("button", {
									type: "button",
									onClick: () => {
										if (typeof window !== "undefined" && window.location?.origin) update("seoCanonicalBaseUrl", window.location.origin);
									},
									className: "text-[11px] font-semibold text-blue-600 hover:underline",
									children: [
										"Use current domain (",
										currentOrigin,
										")"
									]
								})]
							}),
							/* @__PURE__ */ jsx("input", {
								type: "url",
								value: s.seoCanonicalBaseUrl || currentOrigin,
								onChange: (e) => update("seoCanonicalBaseUrl", e.target.value),
								placeholder: currentOrigin,
								className: "h-10 w-full rounded-lg border border-slate-200 px-3 text-sm focus:border-slate-900 focus:outline-none"
							}),
							/* @__PURE__ */ jsxs("p", {
								className: "mt-1 text-[11px] text-slate-500",
								children: [
									"Currently active domain: ",
									/* @__PURE__ */ jsx("strong", {
										className: "text-slate-700",
										children: currentOrigin
									}),
									". Automatically updates when your website is live."
								]
							})
						]
					}), /* @__PURE__ */ jsxs("div", {
						className: "sm:col-span-2",
						children: [
							/* @__PURE__ */ jsx("label", {
								className: "mb-1 block text-xs font-bold text-slate-700",
								children: "Global News Keywords (Comma Separated)"
							}),
							/* @__PURE__ */ jsx("input", {
								type: "text",
								value: s.seoKeywords || "",
								onChange: (e) => update("seoKeywords", e.target.value),
								placeholder: "Breaking News, Politics, Northeast India, Tripura News, Current Affairs",
								className: "h-10 w-full rounded-lg border border-slate-200 px-3 text-sm focus:border-slate-900 focus:outline-none"
							}),
							/* @__PURE__ */ jsx("p", {
								className: "mt-1 text-[11px] text-slate-500",
								children: "Target keywords used for search engine indexing and news topic categorization."
							})
						]
					})]
				})
			}),
			/* @__PURE__ */ jsx(Card, {
				title: "2. OpenGraph Fallback Social Banner",
				subtitle: "Default banner shown when readers share pages that do not have their own article thumbnail.",
				children: /* @__PURE__ */ jsxs("div", {
					className: "space-y-3",
					children: [/* @__PURE__ */ jsx(MediaField, {
						label: "Default Social Share Banner (og:image)",
						value: s.seoOgImage || "",
						onChange: (url) => update("seoOgImage", url),
						hint: "Recommended dimensions: 1200 × 630 px (WebP, JPG or PNG). Fallback for homepage and general pages."
					}), /* @__PURE__ */ jsxs("div", {
						className: "flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600",
						children: [/* @__PURE__ */ jsx("span", { children: "Official Twitter / X profile handle is automatically pulled from your connected profiles." }), /* @__PURE__ */ jsxs("button", {
							type: "button",
							onClick: () => navigate({
								to: ".",
								search: { tab: "integrations" }
							}),
							className: "inline-flex items-center gap-1 font-semibold text-blue-600 hover:underline shrink-0",
							children: ["Manage Social Profiles ", /* @__PURE__ */ jsx(ArrowRight, { className: "h-3 w-3" })]
						})]
					})]
				})
			}),
			/* @__PURE__ */ jsx(Card, {
				title: "3. Search Engine Indexing & Robots Directives",
				subtitle: "Manage search engine bot crawl instructions, snippet length limits, and image preview sizes.",
				children: /* @__PURE__ */ jsxs("div", {
					className: "space-y-4",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl border border-slate-200 bg-slate-50/80",
							children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("div", {
								className: "flex items-center gap-2",
								children: [
									/* @__PURE__ */ jsx(Bot, { className: "h-4 w-4 text-slate-700" }),
									/* @__PURE__ */ jsx("span", {
										className: "text-sm font-bold text-slate-800",
										children: "Search Engine Indexing"
									}),
									/* @__PURE__ */ jsx("span", {
										className: `inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold ${s.seoRobotsIndex !== false ? "bg-emerald-100 text-emerald-800 border border-emerald-200" : "bg-red-100 text-red-800 border border-red-200"}`,
										children: s.seoRobotsIndex !== false ? "INDEX" : "NOINDEX"
									})
								]
							}), /* @__PURE__ */ jsx("span", {
								className: "text-xs text-slate-500 block mt-0.5",
								children: "Allow search engines (Google, Bing, DuckDuckGo) to discover and index your news pages."
							})] }), /* @__PURE__ */ jsxs("div", {
								className: "inline-flex rounded-lg border border-slate-200 bg-white p-0.5 shadow-xs shrink-0",
								children: [/* @__PURE__ */ jsx("button", {
									type: "button",
									onClick: () => update("seoRobotsIndex", true),
									className: `px-4 py-1.5 text-xs font-bold rounded-md transition ${s.seoRobotsIndex !== false ? "bg-emerald-600 text-white shadow-xs" : "text-slate-600 hover:text-slate-900"}`,
									children: "Allow (Index)"
								}), /* @__PURE__ */ jsx("button", {
									type: "button",
									onClick: () => update("seoRobotsIndex", false),
									className: `px-4 py-1.5 text-xs font-bold rounded-md transition ${s.seoRobotsIndex === false ? "bg-red-600 text-white shadow-xs" : "text-slate-600 hover:text-slate-900"}`,
									children: "Block (Noindex)"
								})]
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "grid gap-3 sm:grid-cols-2",
							children: [/* @__PURE__ */ jsxs("label", {
								className: "flex items-center gap-3 p-3 rounded-lg border border-slate-200 bg-white cursor-pointer hover:bg-slate-50",
								children: [/* @__PURE__ */ jsx("input", {
									type: "checkbox",
									checked: s.seoRobotsFollow !== false,
									onChange: (e) => update("seoRobotsFollow", e.target.checked),
									className: "h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900"
								}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("span", {
									className: "text-xs font-bold text-slate-800 block",
									children: "Follow Internal Links"
								}), /* @__PURE__ */ jsx("span", {
									className: "text-[11px] text-slate-500 block",
									children: "Instruct crawlers to follow article and category hyperlinks (recommended: ON)."
								})] })]
							}), /* @__PURE__ */ jsxs("label", {
								className: "flex items-center gap-3 p-3 rounded-lg border border-slate-200 bg-white cursor-pointer hover:bg-slate-50",
								children: [/* @__PURE__ */ jsx("input", {
									type: "checkbox",
									checked: s.seoGooglebotNews !== false,
									onChange: (e) => update("seoGooglebotNews", e.target.checked),
									className: "h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900"
								}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("span", {
									className: "text-xs font-bold text-slate-800 block",
									children: "Googlebot-News High-Res Previews"
								}), /* @__PURE__ */ jsxs("span", {
									className: "text-[11px] text-slate-500 block",
									children: [
										"Enables ",
										/* @__PURE__ */ jsx("code", { children: "max-image-preview:large" }),
										" for rich Google Discover & News carousel cards."
									]
								})] })]
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "rounded-lg border border-slate-200 bg-slate-50 p-3",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "flex items-center justify-between text-xs font-semibold text-slate-600 mb-1.5",
								children: [/* @__PURE__ */ jsx("span", { children: "Active Output Meta Tag:" }), /* @__PURE__ */ jsxs("a", {
									href: "/robots.txt",
									target: "_blank",
									rel: "noreferrer",
									className: "inline-flex items-center gap-1 text-blue-600 hover:underline",
									children: ["View /robots.txt ", /* @__PURE__ */ jsx(ExternalLink, { className: "h-3 w-3" })]
								})]
							}), /* @__PURE__ */ jsxs("code", {
								className: "text-xs font-mono text-emerald-800 bg-white border border-slate-200 px-2.5 py-1.5 rounded block",
								children: [
									"<meta name=\"robots\" content=\"",
									s.seoRobotsIndex === false ? "noindex, nofollow" : `index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1`,
									"\" />"
								]
							})]
						})
					]
				})
			}),
			/* @__PURE__ */ jsx(Card, {
				title: "4. Google News & XML Sitemaps Hub",
				subtitle: "Submit these XML feeds to Google Publisher Center and Search Console for rapid discovery of breaking stories.",
				children: /* @__PURE__ */ jsxs("div", {
					className: "space-y-4",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "grid gap-3 sm:grid-cols-3",
							children: [
								/* @__PURE__ */ jsxs("a", {
									href: "/sitemap.xml",
									target: "_blank",
									rel: "noreferrer",
									className: "flex flex-col p-3 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 transition group",
									children: [/* @__PURE__ */ jsxs("div", {
										className: "flex items-center justify-between",
										children: [/* @__PURE__ */ jsx("span", {
											className: "text-xs font-bold text-slate-800",
											children: "XML Sitemap"
										}), /* @__PURE__ */ jsx(ExternalLink, { className: "h-3.5 w-3.5 text-slate-400 group-hover:text-slate-900" })]
									}), /* @__PURE__ */ jsx("span", {
										className: "text-[11px] text-slate-500 mt-1 font-mono",
										children: "/sitemap.xml"
									})]
								}),
								/* @__PURE__ */ jsxs("a", {
									href: "/news-sitemap.xml",
									target: "_blank",
									rel: "noreferrer",
									className: "flex flex-col p-3 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 transition group",
									children: [/* @__PURE__ */ jsxs("div", {
										className: "flex items-center justify-between",
										children: [/* @__PURE__ */ jsx("span", {
											className: "text-xs font-bold text-slate-800",
											children: "Google News Sitemap"
										}), /* @__PURE__ */ jsx(ExternalLink, { className: "h-3.5 w-3.5 text-slate-400 group-hover:text-slate-900" })]
									}), /* @__PURE__ */ jsx("span", {
										className: "text-[11px] text-slate-500 mt-1 font-mono",
										children: "/news-sitemap.xml"
									})]
								}),
								/* @__PURE__ */ jsxs("a", {
									href: "/rss.xml",
									target: "_blank",
									rel: "noreferrer",
									className: "flex flex-col p-3 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 transition group",
									children: [/* @__PURE__ */ jsxs("div", {
										className: "flex items-center justify-between",
										children: [/* @__PURE__ */ jsx("span", {
											className: "text-xs font-bold text-slate-800",
											children: "RSS News Feed"
										}), /* @__PURE__ */ jsx(ExternalLink, { className: "h-3.5 w-3.5 text-slate-400 group-hover:text-slate-900" })]
									}), /* @__PURE__ */ jsx("span", {
										className: "text-[11px] text-slate-500 mt-1 font-mono",
										children: "/rss.xml"
									})]
								})
							]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "flex flex-wrap gap-2 pt-1",
							children: [/* @__PURE__ */ jsxs("a", {
								href: "https://publishercenter.google.com/",
								target: "_blank",
								rel: "noreferrer",
								className: "inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-2xs",
								children: [
									/* @__PURE__ */ jsx(Newspaper, { className: "h-3.5 w-3.5 text-red-600" }),
									" Google Publisher Center",
									" ",
									/* @__PURE__ */ jsx(ExternalLink, { className: "h-3 w-3" })
								]
							}), /* @__PURE__ */ jsxs("a", {
								href: "https://search.google.com/search-console",
								target: "_blank",
								rel: "noreferrer",
								className: "inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-2xs",
								children: [
									/* @__PURE__ */ jsx(Search, { className: "h-3.5 w-3.5 text-blue-600" }),
									" Google Search Console",
									" ",
									/* @__PURE__ */ jsx(ExternalLink, { className: "h-3 w-3" })
								]
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50/70 p-3.5 text-xs text-emerald-950",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ jsx(ShieldCheck, { className: "h-4 w-4 text-emerald-700 shrink-0" }), /* @__PURE__ */ jsxs("span", { children: [
									"Search Console, Bing, and Yandex verification tags are configured in",
									" ",
									/* @__PURE__ */ jsx("strong", { children: "Integrations → Verification" }),
									"."
								] })]
							}), /* @__PURE__ */ jsxs("button", {
								type: "button",
								onClick: () => navigate({
									to: ".",
									search: { tab: "integrations" }
								}),
								className: "inline-flex items-center gap-1 font-bold text-emerald-800 hover:underline shrink-0",
								children: ["Go to Integrations ", /* @__PURE__ */ jsx(ArrowRight, { className: "h-3.5 w-3.5" })]
							})]
						})
					]
				})
			}),
			/* @__PURE__ */ jsx(Card, {
				title: "5. Schema.org NewsMediaOrganization Structured Data",
				subtitle: "Trust signals and editorial accountability policies required by Google News algorithms.",
				children: /* @__PURE__ */ jsxs("div", {
					className: "space-y-4",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "grid gap-4 sm:grid-cols-2",
						children: [
							/* @__PURE__ */ jsxs("div", { children: [
								/* @__PURE__ */ jsx("label", {
									className: "mb-1 block text-xs font-bold text-slate-700",
									children: "Editorial Policy URL"
								}),
								/* @__PURE__ */ jsx("input", {
									type: "text",
									value: s.seoEditorialPolicyUrl || "/editorial-policy",
									onChange: (e) => update("seoEditorialPolicyUrl", e.target.value),
									placeholder: "/editorial-policy",
									className: "h-10 w-full rounded-lg border border-slate-200 px-3 text-sm focus:border-slate-900 focus:outline-none"
								}),
								/* @__PURE__ */ jsx("p", {
									className: "mt-1 text-[11px] text-slate-500",
									children: "Link to editorial independence and guidelines page."
								})
							] }),
							/* @__PURE__ */ jsxs("div", { children: [
								/* @__PURE__ */ jsx("label", {
									className: "mb-1 block text-xs font-bold text-slate-700",
									children: "Corrections Policy URL"
								}),
								/* @__PURE__ */ jsx("input", {
									type: "text",
									value: s.seoCorrectionsPolicyUrl || "/contact",
									onChange: (e) => update("seoCorrectionsPolicyUrl", e.target.value),
									placeholder: "/contact",
									className: "h-10 w-full rounded-lg border border-slate-200 px-3 text-sm focus:border-slate-900 focus:outline-none"
								}),
								/* @__PURE__ */ jsx("p", {
									className: "mt-1 text-[11px] text-slate-500",
									children: "Required for Google News transparency guidelines."
								})
							] }),
							/* @__PURE__ */ jsxs("div", {
								className: "sm:col-span-2",
								children: [
									/* @__PURE__ */ jsx("label", {
										className: "mb-1 block text-xs font-bold text-slate-700",
										children: "Fact-Checking Policy URL"
									}),
									/* @__PURE__ */ jsx("input", {
										type: "text",
										value: s.seoFactCheckingPolicyUrl || "/fact-checking-policy",
										onChange: (e) => update("seoFactCheckingPolicyUrl", e.target.value),
										placeholder: "/fact-checking-policy",
										className: "h-10 w-full rounded-lg border border-slate-200 px-3 text-sm focus:border-slate-900 focus:outline-none"
									}),
									/* @__PURE__ */ jsx("p", {
										className: "mt-1 text-[11px] text-slate-500",
										children: "Required for Google News Trust Indicators."
									})
								]
							})
						]
					}), /* @__PURE__ */ jsxs("div", {
						className: "rounded-lg border border-slate-100 bg-slate-50 p-3 text-xs text-slate-600 flex items-center justify-between",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ jsx(Code2, { className: "h-4 w-4 text-emerald-600" }), /* @__PURE__ */ jsxs("span", { children: [
								"Organization Name (",
								/* @__PURE__ */ jsx("strong", { children: currentTitle }),
								"), Logo, and Contact Email are automatically linked from your Brand Information."
							] })]
						}), /* @__PURE__ */ jsx("button", {
							type: "button",
							onClick: () => navigate({
								to: ".",
								search: { tab: "general" }
							}),
							className: "font-semibold text-blue-600 hover:underline shrink-0",
							children: "View General →"
						})]
					})]
				})
			})
		]
	});
}
//#endregion
export { SeoSettingsTab, SeoSettingsTab as default };

//# sourceMappingURL=SeoSettingsTab-Dd5UJc7Y.js.map