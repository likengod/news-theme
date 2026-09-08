import { C as savePages, E as saveSiteSettingsServer, S as saveCustomPageServer, f as loadPages, i as getCustomPagesServer, p as loadSettings } from "./site-content-C4QIhjym.js";
import { n as generateSectionHtmlServer } from "./ai.functions-CYSZd0Ns.js";
import { n as Field, t as Card } from "./SettingsHelpers-OyiB6UV8.js";
import { useEffect, useMemo, useState } from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { Crown, ExternalLink, FileText, Loader2, Save, ShieldCheck, Sparkles } from "lucide-react";
import { toast } from "sonner";
//#region src/components/admin/pages/SectionEditorItem.tsx
function SectionEditorItem({ sec, idx, activeSections, update }) {
	const [prompt, setPrompt] = useState("");
	const [isGenerating, setIsGenerating] = useState(false);
	const [showModal, setShowModal] = useState(false);
	const [generatedHtml, setGeneratedHtml] = useState("");
	const handleGenerate = async () => {
		if (!prompt.trim()) {
			toast.error("Please enter instructions for the AI.");
			return;
		}
		setIsGenerating(true);
		setGeneratedHtml("");
		try {
			setGeneratedHtml(await generateSectionHtmlServer({ data: {
				instructions: prompt,
				currentHeading: sec.heading,
				currentBody: sec.body
			} }));
			toast.success("Content generated! Please review.");
		} catch (err) {
			toast.error(err.message || "Failed to generate content.");
		} finally {
			setIsGenerating(false);
		}
	};
	const handleApply = () => {
		const newSections = [...activeSections];
		newSections[idx].body = generatedHtml;
		update("sections", newSections);
		setShowModal(false);
		setGeneratedHtml("");
		setPrompt("");
		toast.success("Content applied successfully!");
	};
	return /* @__PURE__ */ jsxs("div", {
		className: "rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-4 relative",
		children: [
			/* @__PURE__ */ jsx("button", {
				onClick: () => {
					const newSections = [...activeSections];
					newSections.splice(idx, 1);
					update("sections", newSections);
				},
				className: "absolute right-4 top-4 text-xs font-bold text-red-500 hover:text-red-700",
				children: "Remove"
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "pr-12",
				children: [/* @__PURE__ */ jsxs("label", {
					className: "mb-1 block text-xs font-bold text-slate-600",
					children: [
						"Section ",
						idx + 1,
						" Heading"
					]
				}), /* @__PURE__ */ jsx("input", {
					type: "text",
					value: sec.heading,
					onChange: (e) => {
						const newSections = [...activeSections];
						newSections[idx].heading = e.target.value;
						update("sections", newSections);
					},
					className: "h-10 w-full md:w-2/3 rounded-lg border border-slate-200 px-3 text-sm focus:border-slate-900 focus:outline-none"
				})]
			}),
			/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("div", {
				className: "flex items-center justify-between mb-1",
				children: [/* @__PURE__ */ jsxs("label", {
					className: "block text-xs font-bold text-slate-600",
					children: [
						"Section ",
						idx + 1,
						" Content (HTML allowed)"
					]
				}), /* @__PURE__ */ jsxs("button", {
					onClick: () => setShowModal(true),
					className: "flex items-center gap-1.5 text-xs font-bold text-indigo-700 hover:text-indigo-900 bg-indigo-100 hover:bg-indigo-200 px-3 py-1.5 rounded-md transition-colors",
					children: [/* @__PURE__ */ jsx(Sparkles, { className: "h-3.5 w-3.5" }), " AI Assistant"]
				})]
			}), /* @__PURE__ */ jsx("textarea", {
				value: sec.body,
				onChange: (e) => {
					const newSections = [...activeSections];
					newSections[idx].body = e.target.value;
					update("sections", newSections);
				},
				rows: 6,
				className: "w-full rounded-lg border border-slate-200 p-3 text-sm font-mono focus:border-slate-900 focus:outline-none"
			})] }),
			showModal && /* @__PURE__ */ jsx("div", {
				className: "fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm",
				children: /* @__PURE__ */ jsxs("div", {
					className: "w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl flex flex-col max-h-[90vh]",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "flex items-center justify-between mb-4",
							children: [/* @__PURE__ */ jsxs("h3", {
								className: "text-lg font-bold flex items-center gap-2 text-indigo-900",
								children: [/* @__PURE__ */ jsx(Sparkles, { className: "h-5 w-5 text-indigo-600" }), " AI Content Assistant"]
							}), /* @__PURE__ */ jsx("button", {
								onClick: () => setShowModal(false),
								className: "text-slate-400 hover:text-slate-600 text-xl font-bold p-2",
								children: "×"
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "space-y-4 overflow-y-auto flex-1 pr-2",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "bg-slate-50 p-4 rounded-xl border border-slate-100",
								children: [
									/* @__PURE__ */ jsx("label", {
										className: "mb-1 block text-sm font-bold text-slate-700",
										children: "Instructions"
									}),
									/* @__PURE__ */ jsx("p", {
										className: "mb-3 text-xs text-slate-500",
										children: "Enter plain text instructions. The AI will generate raw HTML based on your prompt."
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "flex gap-2",
										children: [/* @__PURE__ */ jsx("input", {
											type: "text",
											placeholder: "e.g. Write a strict policy about 30-day refunds...",
											value: prompt,
											onChange: (e) => setPrompt(e.target.value),
											onKeyDown: (e) => {
												if (e.key === "Enter") {
													e.preventDefault();
													handleGenerate();
												}
											},
											className: "flex-1 h-10 rounded-lg border border-slate-300 px-3 text-sm focus:border-indigo-500 focus:outline-none"
										}), /* @__PURE__ */ jsx("button", {
											onClick: handleGenerate,
											disabled: isGenerating,
											className: "h-10 px-5 rounded-lg bg-indigo-600 text-white text-sm font-bold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2",
											children: isGenerating ? /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(Loader2, { className: "h-4 w-4 animate-spin" }), " Generating..."] }) : "Generate"
										})]
									})
								]
							}), generatedHtml && /* @__PURE__ */ jsxs("div", {
								className: "mt-4 pt-4 border-t border-slate-200",
								children: [
									/* @__PURE__ */ jsx("label", {
										className: "mb-2 block text-sm font-bold text-slate-700",
										children: "Generated Preview (HTML)"
									}),
									/* @__PURE__ */ jsx("textarea", {
										readOnly: true,
										value: generatedHtml,
										onChange: (e) => setGeneratedHtml(e.target.value),
										className: "w-full h-48 rounded-xl border border-slate-200 p-4 text-sm font-mono bg-slate-50 focus:border-indigo-500 focus:outline-none"
									}),
									/* @__PURE__ */ jsx("p", {
										className: "mt-2 text-xs text-slate-500",
										children: "You can safely edit the generated HTML above before applying it."
									})
								]
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "mt-6 flex justify-end gap-3 pt-4 border-t border-slate-100",
							children: [/* @__PURE__ */ jsx("button", {
								onClick: () => setShowModal(false),
								className: "rounded-lg px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-100",
								children: "Cancel"
							}), /* @__PURE__ */ jsx("button", {
								onClick: handleApply,
								disabled: !generatedHtml,
								className: "rounded-lg bg-indigo-600 px-6 py-2 text-sm font-bold text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2",
								children: "Apply to Section"
							})]
						})
					]
				})
			})
		]
	});
}
//#endregion
//#region src/routes/admin.pages.tsx?tsr-split=component
var subscriptionFields = [
	{
		key: "subscriptionTitle",
		label: "Subscription Page Title"
	},
	{
		key: "subscriptionIntro",
		label: "Subscription Intro Text",
		textarea: true
	},
	{
		key: "subscriptionPriceINRMonthly",
		label: "INR Monthly Price (₹)"
	},
	{
		key: "subscriptionPriceINRYearly",
		label: "INR Yearly Price (₹)"
	},
	{
		key: "subscriptionPriceUSDMonthly",
		label: "USD Monthly Price ($)"
	},
	{
		key: "subscriptionPriceUSDYearly",
		label: "USD Yearly Price ($)"
	},
	{
		key: "subscriptionFeatures",
		label: "Subscription Features",
		textarea: true,
		hint: "One feature per line"
	}
];
var workWithUsFields = [
	{
		key: "workWithUsHeroTitle",
		label: "Hero Title",
		textarea: true,
		hint: "Use newlines for breaks"
	},
	{
		key: "workWithUsHeroIntro",
		label: "Hero Intro text",
		textarea: true
	},
	{
		key: "workWithUsIdCardReq",
		label: "ID Card Requirement Text",
		textarea: true
	},
	{
		key: "workWithUsRules",
		label: "Journalist Rules",
		textarea: true,
		hint: "Format: 'Bold Prefix: Description'"
	},
	{
		key: "workWithUsGamification",
		label: "Gamification Cards",
		textarea: true,
		hint: "Format: 'Title: Description' per line"
	},
	{
		key: "workWithUsBadges",
		label: "Badge Benefits",
		textarea: true,
		hint: "Format: 'Rank: Benefit 1 | Benefit 2 | Benefit 3' per line"
	},
	{
		key: "workWithUsTiers",
		label: "Career Tiers",
		textarea: true,
		hint: "Format: 'Tier Name (Requirement): Description' per line"
	},
	{
		key: "workWithUsFaqs",
		label: "FAQs",
		textarea: true,
		hint: "Format: 'Question: Answer' per line"
	}
];
function PagesPage() {
	const [pages, setPages] = useState(() => loadPages());
	const [settings, setSettings] = useState(() => loadSettings());
	const [activeSlug, setActiveSlug] = useState("about");
	useEffect(() => {
		getCustomPagesServer().then((p) => setPages(p)).catch(() => {});
	}, []);
	const active = useMemo(() => pages.find((p) => p.slug === activeSlug) ?? pages[0], [pages, activeSlug]);
	const update = (k, v) => setPages((prev) => prev.map((p) => p.slug === activeSlug ? {
		...p,
		[k]: v
	} : p));
	const updateSetting = (k, v) => setSettings((prev) => ({
		...prev,
		[k]: v
	}));
	const onSave = async () => {
		if (activeSlug === "subscription" || activeSlug === "work-with-us") {
			await saveSiteSettingsServer({ data: settings }).catch(() => {});
			toast.success(`${activeSlug === "subscription" ? "Subscription" : "Work With Us"} settings saved!`);
		} else {
			savePages(pages);
			await saveCustomPageServer({ data: active }).catch(() => {});
			toast.success(`"${active?.title || activeSlug}" saved to MySQL!`);
		}
	};
	const isSubscription = activeSlug === "subscription";
	const isWorkWithUs = activeSlug === "work-with-us";
	const isSettingsPage = isSubscription || isWorkWithUs;
	return /* @__PURE__ */ jsxs("div", {
		className: "space-y-6",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "flex flex-wrap items-center justify-between gap-3",
			children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h1", {
				className: "text-2xl font-bold tracking-tight",
				children: "System & Policy Pages"
			}), /* @__PURE__ */ jsx("p", {
				className: "text-sm text-slate-500",
				children: "Edit the About, Contact, Terms, and footer policy pages saved centrally in MySQL."
			})] }), /* @__PURE__ */ jsxs("div", {
				className: "flex items-center gap-2 rounded-lg bg-emerald-50 border border-emerald-200 px-3 py-1.5 text-xs font-bold text-emerald-800",
				children: [/* @__PURE__ */ jsx(ShieldCheck, { className: "h-4 w-4 text-emerald-600" }), " MySQL Page Storage Active"]
			})]
		}), /* @__PURE__ */ jsxs("div", {
			className: "grid gap-6 lg:grid-cols-[280px_1fr]",
			children: [/* @__PURE__ */ jsx("aside", {
				className: "rounded-xl border border-slate-200 bg-white p-2 shadow-sm",
				children: /* @__PURE__ */ jsxs("ul", {
					className: "space-y-1",
					children: [
						pages.map((p) => {
							return /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsxs("button", {
								onClick: () => setActiveSlug(p.slug),
								className: `flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-medium transition ${p.slug === activeSlug ? "bg-slate-900 text-white shadow-sm" : "text-slate-700 hover:bg-slate-100"}`,
								children: [/* @__PURE__ */ jsx(FileText, { className: "h-4 w-4 shrink-0" }), /* @__PURE__ */ jsx("span", {
									className: "truncate",
									children: p.title
								})]
							}) }, p.slug);
						}),
						/* @__PURE__ */ jsx("li", { className: "my-2 border-t border-slate-100" }),
						/* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsxs("button", {
							onClick: () => setActiveSlug("subscription"),
							className: `flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-medium transition ${isSubscription ? "bg-slate-900 text-white shadow-sm" : "text-slate-700 hover:bg-slate-100"}`,
							children: [/* @__PURE__ */ jsx(Crown, { className: "h-4 w-4 shrink-0" }), /* @__PURE__ */ jsx("span", {
								className: "truncate",
								children: "Subscription Settings"
							})]
						}) }),
						/* @__PURE__ */ jsx("li", {
							className: "mt-1",
							children: /* @__PURE__ */ jsxs("button", {
								onClick: () => setActiveSlug("work-with-us"),
								className: `flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-medium transition ${isWorkWithUs ? "bg-slate-900 text-white shadow-sm" : "text-slate-700 hover:bg-slate-100"}`,
								children: [/* @__PURE__ */ jsx(Crown, { className: "h-4 w-4 shrink-0" }), /* @__PURE__ */ jsx("span", {
									className: "truncate",
									children: "Work With Us Settings"
								})]
							})
						})
					]
				})
			}), /* @__PURE__ */ jsxs("main", {
				className: "space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "flex items-center justify-between border-b border-slate-100 pb-4",
					children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h2", {
						className: "text-lg font-bold text-slate-900",
						children: isSubscription ? "Subscription Settings" : isWorkWithUs ? "Work With Us Settings" : active?.title
					}), /* @__PURE__ */ jsxs("p", {
						className: "text-xs text-slate-400",
						children: ["Slug: /", isSettingsPage ? activeSlug : active?.slug]
					})] }), /* @__PURE__ */ jsxs("div", {
						className: "flex gap-2",
						children: [/* @__PURE__ */ jsxs("a", {
							href: `/${isSettingsPage ? activeSlug : active?.slug}`,
							target: "_blank",
							rel: "noreferrer",
							className: "inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50",
							children: ["View Live Page ", /* @__PURE__ */ jsx(ExternalLink, { className: "h-3.5 w-3.5" })]
						}), /* @__PURE__ */ jsxs("button", {
							onClick: onSave,
							className: "inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-4 py-1.5 text-xs font-semibold text-white hover:bg-slate-800",
							children: [/* @__PURE__ */ jsx(Save, { className: "h-4 w-4" }), " Save Page"]
						})]
					})]
				}), isSubscription ? /* @__PURE__ */ jsx(Card, {
					title: "Subscription Setup",
					subtitle: "Configure the /subscription page content and pricing.",
					children: subscriptionFields.map((f) => /* @__PURE__ */ jsx(Field, {
						f,
						s: settings,
						update: updateSetting
					}, f.key))
				}) : isWorkWithUs ? /* @__PURE__ */ jsx(Card, {
					title: "Work With Us Setup",
					subtitle: "Configure the content on the /work-with-us page.",
					children: workWithUsFields.map((f) => /* @__PURE__ */ jsx(Field, {
						f,
						s: settings,
						update: updateSetting
					}, f.key))
				}) : active ? /* @__PURE__ */ jsxs("div", {
					className: "space-y-8",
					children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
						className: "mb-1 block text-xs font-bold text-slate-600",
						children: "Page Subtitle / Intro"
					}), /* @__PURE__ */ jsx("input", {
						type: "text",
						value: active.intro || "",
						onChange: (e) => update("intro", e.target.value),
						className: "h-10 w-full rounded-lg border border-slate-200 px-3 text-sm focus:border-slate-900 focus:outline-none"
					})] }), activeSlug === "contact" ? /* @__PURE__ */ jsxs("div", {
						className: "rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800",
						children: [/* @__PURE__ */ jsx("strong", { children: "Note:" }), " The Contact Us page relies on a hardcoded layout with a contact form. Only the subtitle/intro above can be updated here."]
					}) : /* @__PURE__ */ jsxs("div", {
						className: "space-y-4",
						children: [
							/* @__PURE__ */ jsxs("div", {
								className: "flex items-center justify-between border-b border-slate-100 pb-2",
								children: [/* @__PURE__ */ jsx("label", {
									className: "block text-sm font-bold text-slate-800",
									children: "Page Sections"
								}), /* @__PURE__ */ jsx("button", {
									onClick: () => {
										update("sections", [...active.sections || [], {
											heading: "New Section",
											body: ""
										}]);
									},
									className: "text-xs font-bold text-blue-600 hover:text-blue-700",
									children: "+ Add Section"
								})]
							}),
							(active.sections || []).length === 0 && /* @__PURE__ */ jsx("div", {
								className: "text-sm text-slate-500 italic",
								children: "No sections added. Click \"+ Add Section\" to add content."
							}),
							(active.sections || []).map((sec, idx) => /* @__PURE__ */ jsx(SectionEditorItem, {
								sec,
								idx,
								activeSections: active.sections || [],
								update
							}, idx))
						]
					})]
				}) : null]
			})]
		})]
	});
}
//#endregion
export { PagesPage as component };
