import { t as Footer } from "./Footer-sQ-ZYKMa.js";
import { t as Header } from "./Header-C-CN8D4n.js";
import { t as Route } from "./work-with-us-BRQCmqOl.js";
import { Link } from "@tanstack/react-router";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { ArrowRight, Award, BadgeCheck, CheckSquare, DollarSign, GraduationCap, HelpCircle, IdCard, Medal, Newspaper, Search, ShieldAlert, TrendingUp } from "lucide-react";
//#region src/routes/work-with-us.tsx?tsr-split=component
function WorkWithUsPage() {
	const { settings } = Route.useLoaderData();
	const rulesList = (settings.workWithUsRules || "").split("\n").map((line) => line.trim()).filter(Boolean);
	const gamificationList = (settings.workWithUsGamification || "").split("\n").map((line) => line.trim()).filter(Boolean);
	const gamificationIcons = [
		TrendingUp,
		Search,
		CheckSquare,
		DollarSign
	];
	const badgesList = (settings.workWithUsBadges || "").split("\n").map((line) => line.trim()).filter(Boolean);
	const badgeConfig = [
		{
			letter: "B",
			bg: "bg-orange-100",
			text: "text-orange-700",
			icon: "text-orange-400"
		},
		{
			letter: "S",
			bg: "bg-slate-200",
			text: "text-slate-700",
			icon: "text-slate-400"
		},
		{
			letter: "G",
			bg: "bg-yellow-100",
			text: "text-yellow-700",
			icon: "text-yellow-500"
		},
		{
			letter: "D",
			bg: "bg-cyan-100",
			text: "text-cyan-700",
			icon: "text-cyan-500"
		}
	];
	const tiersList = (settings.workWithUsTiers || "").split("\n").map((line) => line.trim()).filter(Boolean);
	const tierIcons = [
		Newspaper,
		GraduationCap,
		BadgeCheck
	];
	const faqsList = (settings.workWithUsFaqs || "").split("\n").map((line) => line.trim()).filter(Boolean);
	return /* @__PURE__ */ jsxs("div", {
		className: "min-h-screen bg-background text-foreground",
		children: [
			/* @__PURE__ */ jsx(Header, {
				showTicker: false,
				showBreakingBar: false
			}),
			/* @__PURE__ */ jsxs("main", {
				className: "mx-auto max-w-7xl px-4 py-10 space-y-16",
				children: [
					/* @__PURE__ */ jsxs("header", {
						className: "max-w-4xl",
						children: [
							/* @__PURE__ */ jsxs("p", {
								className: "text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2",
								children: [/* @__PURE__ */ jsxs("span", {
									className: "relative flex h-2 w-2",
									children: [/* @__PURE__ */ jsx("span", { className: "absolute inline-flex h-full w-full animate-ping rounded-full bg-foreground opacity-30" }), /* @__PURE__ */ jsx("span", { className: "relative inline-flex h-2 w-2 rounded-full bg-foreground" })]
								}), "Newsroom Careers"]
							}),
							/* @__PURE__ */ jsx("h1", {
								className: "headline mt-4 text-5xl md:text-6xl tracking-tight whitespace-pre-wrap",
								style: { WebkitLineClamp: "unset" },
								children: settings.workWithUsHeroTitle || "Write the Truth.\\nShape the Timeline."
							}),
							/* @__PURE__ */ jsx("p", {
								className: "mt-6 text-lg leading-relaxed text-muted-foreground max-w-2xl",
								children: settings.workWithUsHeroIntro || "News Theme runs a dynamic journalist growth path. Start as a Volunteer, earn points by contributing, and climb the ranks to Intern and Permanent staff."
							})
						]
					}),
					/* @__PURE__ */ jsxs("section", {
						className: "rounded-2xl border border-border bg-card/40 p-6 md:p-10",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-3 mb-8",
							children: [/* @__PURE__ */ jsx(Medal, { className: "h-6 w-6 text-foreground" }), /* @__PURE__ */ jsx("h2", {
								className: "text-2xl md:text-3xl font-bold tracking-tight",
								children: "Earn Points & Grow Your Rank"
							})]
						}), /* @__PURE__ */ jsx("div", {
							className: "grid gap-6 md:grid-cols-2 lg:grid-cols-4",
							children: gamificationList.map((item, idx) => {
								const Icon = gamificationIcons[idx % gamificationIcons.length];
								const colonIdx = item.indexOf(":");
								const title = colonIdx > -1 ? item.slice(0, colonIdx).trim() : item;
								const desc = colonIdx > -1 ? item.slice(colonIdx + 1).trim() : "";
								return /* @__PURE__ */ jsxs("div", {
									className: "rounded-xl border border-border bg-background p-6 transition-shadow hover:shadow-md",
									children: [
										/* @__PURE__ */ jsx(Icon, { className: "h-6 w-6 mb-4 text-foreground/70" }),
										/* @__PURE__ */ jsx("h3", {
											className: "font-bold text-lg",
											children: title
										}),
										/* @__PURE__ */ jsx("p", {
											className: "mt-2 text-sm text-muted-foreground leading-relaxed",
											children: desc
										})
									]
								}, idx);
							})
						})]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "grid gap-8 lg:grid-cols-2",
						children: [/* @__PURE__ */ jsxs("section", {
							className: "rounded-2xl border border-border bg-card/40 p-6 md:p-10",
							children: [
								/* @__PURE__ */ jsxs("div", {
									className: "flex items-center gap-3 mb-6",
									children: [/* @__PURE__ */ jsx(Award, { className: "h-6 w-6 text-foreground" }), /* @__PURE__ */ jsx("h2", {
										className: "text-2xl font-bold tracking-tight",
										children: "Badge Rank Benefits"
									})]
								}),
								/* @__PURE__ */ jsx("p", {
									className: "text-sm text-muted-foreground mb-6",
									children: "As you accumulate points and publish more verified stories, you will automatically unlock prestigious rank badges and exclusive perks:"
								}),
								/* @__PURE__ */ jsx("ul", {
									className: "space-y-6",
									children: badgesList.map((badge, idx) => {
										const config = badgeConfig[idx % badgeConfig.length];
										const colonIdx = badge.indexOf(":");
										const title = colonIdx > -1 ? badge.slice(0, colonIdx).trim() : badge;
										const benefits = colonIdx > -1 ? badge.slice(colonIdx + 1).split("|").map((b) => b.trim()) : [];
										return /* @__PURE__ */ jsxs("li", {
											className: "flex items-start gap-4",
											children: [/* @__PURE__ */ jsx("span", {
												className: `flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${config.bg} ${config.text} font-bold text-lg`,
												children: config.letter
											}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h4", {
												className: "font-bold text-foreground",
												children: title
											}), /* @__PURE__ */ jsx("ul", {
												className: "mt-2 space-y-1",
												children: benefits.map((benefit, bIdx) => /* @__PURE__ */ jsxs("li", {
													className: "flex items-start gap-2 text-sm text-muted-foreground",
													children: [
														/* @__PURE__ */ jsx(ArrowRight, { className: `h-4 w-4 shrink-0 ${config.icon}` }),
														" ",
														benefit
													]
												}, bIdx))
											})] })]
										}, idx);
									})
								})
							]
						}), /* @__PURE__ */ jsxs("div", {
							className: "space-y-8",
							children: [/* @__PURE__ */ jsxs("section", {
								className: "rounded-2xl border border-border bg-card/40 p-6 md:p-10",
								children: [
									/* @__PURE__ */ jsxs("div", {
										className: "flex items-center gap-3 mb-6",
										children: [/* @__PURE__ */ jsx(IdCard, { className: "h-6 w-6 text-foreground" }), /* @__PURE__ */ jsx("h2", {
											className: "text-2xl font-bold tracking-tight",
											children: "Official Press ID Cards"
										})]
									}),
									/* @__PURE__ */ jsx("p", {
										className: "text-sm text-muted-foreground leading-relaxed",
										children: "We issue physical and digital Press ID cards to verified members of our newsroom to assist them in on-the-ground reporting."
									}),
									/* @__PURE__ */ jsx("div", {
										className: "mt-4 rounded-lg bg-background border border-border p-4",
										children: /* @__PURE__ */ jsx("p", {
											className: "text-sm font-medium text-foreground whitespace-pre-wrap",
											children: settings.workWithUsIdCardReq || /* @__PURE__ */ jsxs(Fragment, { children: [
												/* @__PURE__ */ jsx("strong", { children: "Requirement:" }),
												" You must reach the ",
												/* @__PURE__ */ jsx("span", {
													className: "underline decoration-dashed underline-offset-4",
													children: "Intern Journalist Rank"
												}),
												" (150+ verified published news articles) to be eligible for an Official Press ID Card."
											] })
										})
									})
								]
							}), /* @__PURE__ */ jsxs("section", {
								className: "rounded-2xl border border-border bg-card/40 p-6 md:p-10",
								children: [
									/* @__PURE__ */ jsxs("div", {
										className: "flex items-center gap-3 mb-6",
										children: [/* @__PURE__ */ jsx(ShieldAlert, { className: "h-6 w-6 text-foreground" }), /* @__PURE__ */ jsx("h2", {
											className: "text-2xl font-bold tracking-tight",
											children: "Journalist Rules"
										})]
									}),
									/* @__PURE__ */ jsx("ul", {
										className: "list-inside list-disc space-y-3 text-sm text-muted-foreground",
										children: rulesList.length > 0 ? rulesList.map((rule, idx) => {
											const colonIdx = rule.indexOf(":");
											if (colonIdx > -1) {
												const prefix = rule.slice(0, colonIdx + 1);
												const rest = rule.slice(colonIdx + 1);
												return /* @__PURE__ */ jsxs("li", { children: [/* @__PURE__ */ jsx("strong", {
													className: "text-foreground",
													children: prefix
												}), rest] }, idx);
											}
											return /* @__PURE__ */ jsx("li", { children: rule }, idx);
										}) : /* @__PURE__ */ jsxs(Fragment, { children: [
											/* @__PURE__ */ jsxs("li", { children: [/* @__PURE__ */ jsx("strong", {
												className: "text-foreground",
												children: "Zero Plagiarism:"
											}), " All submissions are passed through advanced plagiarism checks. Copied content results in an instant ban."] }),
											/* @__PURE__ */ jsxs("li", { children: [/* @__PURE__ */ jsx("strong", {
												className: "text-foreground",
												children: "Verify Sources:"
											}), " You must provide links or contact details for your primary sources when submitting breaking news."] }),
											/* @__PURE__ */ jsxs("li", { children: [/* @__PURE__ */ jsx("strong", {
												className: "text-foreground",
												children: "Unbiased Reporting:"
											}), " Keep personal opinions strictly to the \"Opinion\" section. News reports must remain objective."] }),
											/* @__PURE__ */ jsxs("li", { children: [/* @__PURE__ */ jsx("strong", {
												className: "text-foreground",
												children: "No Fake News:"
											}), " Repeatedly submitting factually incorrect information will result in point deductions and rank demotion."] })
										] })
									}),
									/* @__PURE__ */ jsx("div", {
										className: "mt-6 pt-4 border-t border-border/50",
										children: /* @__PURE__ */ jsxs(Link, {
											to: "/terms-and-conditions",
											className: "text-sm font-semibold text-blue-600 hover:text-blue-500 hover:underline flex items-center gap-1 w-max",
											children: ["Read full Terms & Conditions ", /* @__PURE__ */ jsx(ArrowRight, { className: "h-4 w-4" })]
										})
									})
								]
							})]
						})]
					}),
					/* @__PURE__ */ jsx("section", {
						className: "grid gap-6 md:grid-cols-3",
						children: tiersList.map((tier, idx) => {
							const Icon = tierIcons[idx % tierIcons.length];
							const colonIdx = tier.indexOf(":");
							const fullTitle = colonIdx > -1 ? tier.slice(0, colonIdx).trim() : tier;
							const desc = colonIdx > -1 ? tier.slice(colonIdx + 1).trim() : "";
							const parenMatch = fullTitle.match(/(.*?)\((.*?)\)$/);
							const title = parenMatch ? parenMatch[1].trim() : fullTitle;
							const req = parenMatch ? parenMatch[2].trim() : "";
							return /* @__PURE__ */ jsxs("div", {
								className: "rounded-2xl border border-border bg-card/40 p-6 md:p-8",
								children: [
									/* @__PURE__ */ jsx("span", {
										className: "inline-grid h-12 w-12 place-items-center rounded-xl bg-foreground text-background",
										children: /* @__PURE__ */ jsx(Icon, { className: "h-6 w-6" })
									}),
									/* @__PURE__ */ jsx("h3", {
										className: "mt-6 text-xl font-bold",
										children: title
									}),
									req && /* @__PURE__ */ jsx("p", {
										className: "mt-2 text-[11px] font-bold uppercase tracking-widest text-muted-foreground bg-background inline-block px-2 py-1 rounded border border-border",
										children: req
									}),
									/* @__PURE__ */ jsx("p", {
										className: "mt-4 text-sm leading-relaxed text-foreground/80",
										children: desc
									})
								]
							}, idx);
						})
					}),
					/* @__PURE__ */ jsxs("section", {
						className: "rounded-2xl border border-border bg-card/40 p-6 md:p-10",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-3 mb-8",
							children: [/* @__PURE__ */ jsx(HelpCircle, { className: "h-6 w-6 text-foreground" }), /* @__PURE__ */ jsx("h2", {
								className: "text-2xl font-bold tracking-tight",
								children: "Frequently Asked Questions"
							})]
						}), /* @__PURE__ */ jsx("div", {
							className: "grid gap-6 md:grid-cols-2",
							children: faqsList.map((faq, idx) => {
								const colonIdx = faq.indexOf("?:");
								const question = colonIdx > -1 ? faq.slice(0, colonIdx + 1).trim() : faq;
								const answer = colonIdx > -1 ? faq.slice(colonIdx + 2).trim() : "";
								const altColonIdx = faq.indexOf("? :");
								const finalQuestion = altColonIdx > -1 ? faq.slice(0, altColonIdx + 1).trim() : question;
								const finalAnswer = altColonIdx > -1 ? faq.slice(altColonIdx + 3).trim() : answer;
								const plainColonIdx = faq.indexOf(":");
								const q = finalAnswer ? finalQuestion : plainColonIdx > -1 ? faq.slice(0, plainColonIdx).trim() : faq;
								const a = finalAnswer ? finalAnswer : plainColonIdx > -1 ? faq.slice(plainColonIdx + 1).trim() : "";
								return /* @__PURE__ */ jsxs("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ jsx("h4", {
										className: "font-bold text-foreground",
										children: q
									}), /* @__PURE__ */ jsx("p", {
										className: "text-sm text-muted-foreground",
										children: a
									})]
								}, idx);
							})
						})]
					}),
					/* @__PURE__ */ jsx("div", {
						className: "flex justify-center pb-12",
						children: /* @__PURE__ */ jsxs(Link, {
							to: "/apply",
							className: "inline-flex items-center gap-2 rounded-full bg-foreground px-8 py-4 text-sm font-bold uppercase tracking-widest text-background transition-transform hover:scale-105 active:scale-95",
							children: ["Apply Now ", /* @__PURE__ */ jsx(ArrowRight, { className: "h-4 w-4" })]
						})
					})
				]
			}),
			/* @__PURE__ */ jsx(Footer, {})
		]
	});
}
//#endregion
export { WorkWithUsPage as component };
