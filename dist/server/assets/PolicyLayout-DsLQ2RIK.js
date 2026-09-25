import { a as useSiteSettings } from "./AdSettingsContext-BkhFbsEU.js";
import { t as Footer } from "./Footer-CGCJ6p7l.js";
import { t as Header } from "./Header-B3gpV5PI.js";
import { useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { ChevronDown, FileText, Mail, MapPin, MessageSquare, Phone, ShieldCheck } from "lucide-react";
//#region src/components/site/PolicyLayout.tsx
var POLICIES = [
	{
		label: "Terms & Conditions",
		to: "/terms-and-conditions"
	},
	{
		label: "Privacy Policy",
		to: "/privacy-policy"
	},
	{
		label: "Cookie Policy",
		to: "/cookie-policy"
	},
	{
		label: "Refund Policy",
		to: "/refund-policy"
	},
	{
		label: "Disclaimer",
		to: "/disclaimer"
	},
	{
		label: "Editorial Policy",
		to: "/editorial-policy"
	},
	{
		label: "Fact-Checking Policy",
		to: "/fact-checking-policy"
	},
	{
		label: "Fact Check",
		to: "/fact-check"
	},
	{
		label: "DMCA",
		to: "/dmca"
	},
	{
		label: "About",
		to: "/about"
	},
	{
		label: "Submit News",
		to: "/submit-news"
	}
];
function slug(s) {
	return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}
function PolicyLayout({ eyebrow = "", title, intro, content, notice, sections, lastUpdated = "", contactEmail, hideDivider, dropCapIntro, headerAction }) {
	const s = useSiteSettings();
	const isEnterprise = (s?.licenseType || "").toLowerCase().includes("enterprise");
	const availablePolicies = POLICIES.filter((p) => isEnterprise || p.to !== "/fact-check");
	const actualEmail = contactEmail || s?.contactEmail || "legal@northeasttimeline.com";
	const actualPhone = s?.contactPhone || "+91 99999 99999";
	const actualAddress = s?.address || "Agartala, Tripura (W) India";
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	const active = availablePolicies.find((p) => p.to === pathname);
	const others = availablePolicies.filter((p) => p.to !== pathname);
	const [othersOpen, setOthersOpen] = useState(false);
	const [connectOpen, setConnectOpen] = useState(false);
	return /* @__PURE__ */ jsxs("div", {
		className: "min-h-screen bg-background text-foreground flex flex-col justify-between",
		children: [
			/* @__PURE__ */ jsx(Header, {
				showTicker: false,
				showBreakingBar: false
			}),
			/* @__PURE__ */ jsx("main", {
				className: "mx-auto max-w-7xl px-4 py-10 flex-1 w-full",
				children: /* @__PURE__ */ jsxs("div", {
					className: "grid gap-8 lg:grid-cols-[320px_1fr]",
					children: [/* @__PURE__ */ jsxs("aside", {
						className: "lg:sticky lg:top-6 lg:self-start",
						children: [
							/* @__PURE__ */ jsx("h2", {
								className: "headline mb-5 text-3xl",
								style: { WebkitLineClamp: "unset" },
								children: "Policy Centre"
							}),
							/* @__PURE__ */ jsx("div", {
								className: "overflow-hidden rounded-xl border border-border bg-foreground text-background shadow-sm",
								children: /* @__PURE__ */ jsxs("div", {
									className: "flex items-center gap-3 px-4 py-3.5",
									children: [
										/* @__PURE__ */ jsx("span", {
											className: "grid h-8 w-8 place-items-center rounded-lg bg-background/10",
											children: /* @__PURE__ */ jsx(ShieldCheck, { className: "h-4 w-4" })
										}),
										/* @__PURE__ */ jsx("span", {
											className: "flex-1 text-[15px] font-semibold",
											children: active?.label ?? title
										}),
										/* @__PURE__ */ jsx(ChevronDown, { className: "h-4 w-4 opacity-70" })
									]
								})
							}),
							/* @__PURE__ */ jsx("ul", {
								className: "mt-1 space-y-0.5 rounded-xl bg-card/40 p-2",
								children: sections.map((s) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", {
									href: `#${slug(s.heading)}`,
									className: "block rounded-lg px-3 py-2 text-sm text-foreground/80 hover:bg-muted hover:text-foreground",
									children: s.heading
								}) }, s.heading))
							}),
							/* @__PURE__ */ jsxs("button", {
								type: "button",
								onClick: () => setOthersOpen((o) => !o),
								className: "mt-4 flex w-full items-center gap-3 rounded-xl border border-border bg-card/40 px-4 py-3.5 text-left transition hover:bg-card",
								"aria-expanded": othersOpen,
								children: [
									/* @__PURE__ */ jsx("span", {
										className: "grid h-8 w-8 place-items-center rounded-lg bg-muted",
										children: /* @__PURE__ */ jsx(FileText, { className: "h-4 w-4" })
									}),
									/* @__PURE__ */ jsx("span", {
										className: "flex-1 text-[15px] font-semibold",
										children: "Other Policies"
									}),
									/* @__PURE__ */ jsx(ChevronDown, { className: `h-4 w-4 transition ${othersOpen ? "rotate-180" : ""}` })
								]
							}),
							othersOpen && /* @__PURE__ */ jsx("ul", {
								className: "mt-1 space-y-0.5 rounded-xl bg-card/40 p-2",
								children: others.map((p) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(Link, {
									to: p.to,
									className: "block rounded-lg px-3 py-2 text-sm text-foreground/80 hover:bg-muted hover:text-foreground",
									children: p.label
								}) }, p.to))
							}),
							/* @__PURE__ */ jsxs("button", {
								type: "button",
								onClick: () => setConnectOpen((o) => !o),
								className: "mt-4 flex w-full items-center gap-3 rounded-xl border border-border bg-card/40 px-4 py-3.5 text-left transition hover:bg-card",
								"aria-expanded": connectOpen,
								children: [
									/* @__PURE__ */ jsx("span", {
										className: "grid h-8 w-8 place-items-center rounded-lg bg-muted",
										children: /* @__PURE__ */ jsx(MessageSquare, { className: "h-4 w-4" })
									}),
									/* @__PURE__ */ jsx("span", {
										className: "flex-1 text-[15px] font-semibold",
										children: "Connect Us"
									}),
									/* @__PURE__ */ jsx(ChevronDown, { className: `h-4 w-4 transition ${connectOpen ? "rotate-180" : ""}` })
								]
							}),
							connectOpen && /* @__PURE__ */ jsxs("div", {
								className: "mt-1 space-y-2 rounded-xl bg-card/40 p-3 text-sm",
								children: [
									/* @__PURE__ */ jsxs("a", {
										href: `mailto:${contactEmail}`,
										className: "flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-muted",
										children: [
											/* @__PURE__ */ jsx(Mail, { className: "h-4 w-4 text-muted-foreground" }),
											" ",
											actualEmail
										]
									}),
									/* @__PURE__ */ jsxs("a", {
										href: `tel:${actualPhone.replace(/[^0-9+]/g, "")}`,
										className: "flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-muted",
										children: [
											/* @__PURE__ */ jsx(Phone, { className: "h-4 w-4 text-muted-foreground" }),
											" ",
											actualPhone
										]
									}),
									/* @__PURE__ */ jsxs("p", {
										className: "flex items-start gap-2 rounded-lg px-2 py-1.5 text-foreground/80",
										children: [
											/* @__PURE__ */ jsx(MapPin, { className: "mt-0.5 h-4 w-4 text-muted-foreground" }),
											" ",
											actualAddress
										]
									}),
									/* @__PURE__ */ jsx(Link, {
										to: "/contact",
										className: "block rounded-lg px-2 py-1.5 font-semibold underline",
										children: "Visit Contact Page →"
									})
								]
							})
						]
					}), /* @__PURE__ */ jsxs("article", {
						className: "rounded-2xl border border-border bg-card/30 p-6 shadow-sm md:p-10",
						children: [
							/* @__PURE__ */ jsxs("header", { children: [
								/* @__PURE__ */ jsxs("div", {
									className: "flex flex-wrap items-center justify-between gap-4",
									children: [/* @__PURE__ */ jsxs("div", {
										className: "flex items-center gap-4",
										children: [/* @__PURE__ */ jsx("span", {
											className: "grid h-12 w-12 place-items-center rounded-xl bg-foreground text-background",
											children: /* @__PURE__ */ jsx(ShieldCheck, { className: "h-6 w-6" })
										}), /* @__PURE__ */ jsx("h1", {
											className: "headline text-3xl md:text-4xl",
											style: { WebkitLineClamp: "unset" },
											children: title
										})]
									}), headerAction || (pathname === "/dmca" ? /* @__PURE__ */ jsxs(Link, {
										to: "/verify-image",
										className: "inline-flex items-center gap-2 rounded-xl border border-primary/30 bg-primary/10 px-3.5 py-2 text-xs sm:text-sm font-semibold text-primary hover:bg-primary hover:text-primary-foreground transition-all shadow-2xs group",
										children: [/* @__PURE__ */ jsx(ShieldCheck, { className: "h-4 w-4 text-primary group-hover:text-primary-foreground transition-colors" }), /* @__PURE__ */ jsx("span", { children: "Forensic Image" })]
									}) : null)]
								}),
								eyebrow && eyebrow !== "Narrative Sync" ? /* @__PURE__ */ jsxs("p", {
									className: "mt-3 text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground",
									children: [
										eyebrow,
										" ",
										lastUpdated ? `· ${lastUpdated}` : ""
									]
								}) : lastUpdated ? /* @__PURE__ */ jsx("p", {
									className: "mt-3 text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground",
									children: lastUpdated
								}) : null,
								intro && /* @__PURE__ */ jsx("p", {
									className: `mt-4 max-w-3xl text-[15px] sm:text-base leading-relaxed text-muted-foreground ${dropCapIntro || pathname === "/about" ? "first-letter:float-left first-letter:text-5xl sm:first-letter:text-6xl first-letter:font-bold first-letter:mr-3.5 first-letter:leading-[0.8] first-letter:font-serif first-letter:text-foreground" : ""}`,
									children: intro
								}),
								!hideDivider && pathname !== "/about" && /* @__PURE__ */ jsx("div", { className: "mt-6 h-px w-full bg-border" })
							] }),
							notice && /* @__PURE__ */ jsxs("aside", {
								className: "mt-8 rounded-xl border border-border bg-muted/40 p-5",
								children: [/* @__PURE__ */ jsx("p", {
									className: "text-[11px] font-bold uppercase tracking-[0.18em] text-foreground",
									children: "Important Notice"
								}), /* @__PURE__ */ jsx("div", {
									className: "mt-2 text-sm leading-relaxed text-foreground/90",
									children: notice
								})]
							}),
							content && /* @__PURE__ */ jsx("div", {
								className: "mt-8 text-[15px] leading-relaxed text-foreground/90",
								children: content
							}),
							sections && sections.length > 0 && /* @__PURE__ */ jsx("div", {
								className: "mt-10 space-y-10",
								children: sections.map((s) => /* @__PURE__ */ jsxs("section", {
									id: slug(s.heading),
									className: "scroll-mt-24",
									children: [/* @__PURE__ */ jsx("h2", {
										className: "headline text-2xl md:text-[28px]",
										style: { WebkitLineClamp: "unset" },
										children: s.heading
									}), /* @__PURE__ */ jsx("div", {
										className: "mt-3 space-y-3 text-[15px] leading-relaxed text-foreground/90",
										children: s.body
									})]
								}, s.heading))
							}),
							/* @__PURE__ */ jsx("div", {
								className: "mt-10 border-t border-border pt-8",
								children: /* @__PURE__ */ jsxs("section", {
									id: "contact",
									className: "scroll-mt-24",
									children: [/* @__PURE__ */ jsx("h2", {
										className: "headline text-2xl md:text-[28px]",
										style: { WebkitLineClamp: "unset" },
										children: "Contact Us"
									}), /* @__PURE__ */ jsxs("p", {
										className: "mt-3 text-[15px] leading-relaxed",
										children: [
											pathname === "/about" ? "Have questions or want to get in touch?" : "Questions about this policy?",
											" ",
											"Email",
											" ",
											/* @__PURE__ */ jsx("a", {
												href: `mailto:${actualEmail}`,
												className: "font-semibold underline",
												children: actualEmail
											}),
											" ",
											"or use our",
											" ",
											/* @__PURE__ */ jsx(Link, {
												to: "/contact",
												className: "font-semibold underline",
												children: "contact page"
											}),
											"."
										]
									})]
								})
							})
						]
					})]
				})
			}),
			/* @__PURE__ */ jsx(Footer, {})
		]
	});
}
//#endregion
export { PolicyLayout as t };
