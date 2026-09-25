import { o as loadSettings, r as getSiteSettingsServer, s as saveSettings } from "./site-settings-TC6eL9IL.js";
import { i as savePages, n as loadPages, r as saveCustomPageServer, t as getCustomPagesServer } from "./custom-pages-Bj1aqmJT.js";
import { a as useSiteSettings } from "./AdSettingsContext-BkhFbsEU.js";
import { i as generateSectionHtmlServer, r as generatePageSeoServer } from "./ai.functions-CoeexRYF.js";
import { n as MediaField } from "./MediaField-Weur-U_g.js";
import { n as Field, t as Card } from "./SettingsHelpers-DBdVv9mu.js";
import { useEffect, useMemo, useRef, useState } from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { Bold, Code, Crown, ExternalLink, Eye, FileText, HelpCircle, Italic, Link, List, Loader2, Lock, Monitor, Save, Search, Smartphone, Sparkles, Trash2, Type } from "lucide-react";
import { toast } from "sonner";
//#region src/components/admin/pages/SectionEditorItem.tsx
function htmlToNormalText(html) {
	if (!html) return "";
	let t = html;
	t = t.replace(/<li[^>]*>(.*?)<\/li>/gi, "• $1\n");
	t = t.replace(/<\/?(ul|ol)[^>]*>/gi, "\n");
	t = t.replace(/<\/p>\s*<p[^>]*>/gi, "\n\n");
	t = t.replace(/<\/?p[^>]*>/gi, "");
	t = t.replace(/<br\s*\/?>/gi, "\n");
	t = t.replace(/<(b|strong)[^>]*>(.*?)<\/(b|strong)>/gi, "**$2**");
	t = t.replace(/<(i|em)[^>]*>(.*?)<\/(i|em)>/gi, "*$2*");
	t = t.replace(/<a[^>]*href=["']([^"']*)["'][^>]*>(.*?)<\/a>/gi, "[$2]($1)");
	t = t.replace(/\n{3,}/g, "\n\n").trim();
	return t;
}
function normalTextToHtml(text) {
	if (!text) return "";
	const trimmed = text.trim();
	if (/^<[a-z][\s\S]*>$/i.test(trimmed) && trimmed.includes("</")) return trimmed;
	return trimmed.split(/\n\s*\n/).map((block) => {
		const lines = block.split("\n").map((l) => l.trim()).filter(Boolean);
		if (lines.length === 0) return "";
		if (lines.every((l) => l.startsWith("•") || l.startsWith("-") || l.startsWith("* "))) return `<ul class="list-disc space-y-1.5 pl-5">${lines.map((l) => {
			let itemText = l.replace(/^[•\-\*]\s*/, "");
			itemText = itemText.replace(/\*\*(.*?)\*\*/g, "<b>$1</b>");
			itemText = itemText.replace(/\*(.*?)\*/g, "<i>$1</i>");
			itemText = itemText.replace(/\[(.*?)\]\((.*?)\)/g, "<a class=\"underline text-blue-600\" href=\"$2\">$1</a>");
			return `<li>${itemText}</li>`;
		}).join("")}</ul>`;
		let para = lines.join(" ");
		para = para.replace(/\*\*(.*?)\*\*/g, "<b>$1</b>");
		para = para.replace(/\*(.*?)\*/g, "<i>$1</i>");
		para = para.replace(/\[(.*?)\]\((.*?)\)/g, "<a class=\"underline text-blue-600\" href=\"$2\">$1</a>");
		return `<p>${para}</p>`;
	}).filter(Boolean).join("\n");
}
function SectionEditorItem({ sec, idx, activeSections, update }) {
	const isEnterprise = (useSiteSettings()?.licenseType || "").toLowerCase().includes("enterprise");
	const [mode, setMode] = useState("normal");
	const [normalText, setNormalText] = useState(() => htmlToNormalText(sec.body || ""));
	const [rawHtml, setRawHtml] = useState(sec.body || "");
	const textareaRef = useRef(null);
	const [prompt, setPrompt] = useState("");
	const [isGenerating, setIsGenerating] = useState(false);
	const [showModal, setShowModal] = useState(false);
	const [generatedHtml, setGeneratedHtml] = useState("");
	useEffect(() => {
		setRawHtml(sec.body || "");
		setNormalText(htmlToNormalText(sec.body || ""));
	}, [sec.body]);
	const updateBody = (newHtml) => {
		const newSections = [...activeSections];
		newSections[idx].body = newHtml;
		update("sections", newSections);
	};
	const handleNormalTextChange = (val) => {
		setNormalText(val);
		const converted = normalTextToHtml(val);
		setRawHtml(converted);
		updateBody(converted);
	};
	const handleRawHtmlChange = (val) => {
		setRawHtml(val);
		setNormalText(htmlToNormalText(val));
		updateBody(val);
	};
	const insertFormatting = (prefix, suffix = "") => {
		const textarea = textareaRef.current;
		if (!textarea) return;
		const start = textarea.selectionStart;
		const end = textarea.selectionEnd;
		const current = normalText;
		const selected = current.substring(start, end) || "text";
		const replacement = `${prefix}${selected}${suffix}`;
		handleNormalTextChange(current.substring(0, start) + replacement + current.substring(end));
		setTimeout(() => {
			textarea.focus();
			textarea.setSelectionRange(start + prefix.length, start + prefix.length + selected.length);
		}, 50);
	};
	const handleGenerate = async () => {
		if (!isEnterprise) {
			toast.error("AI Content Assistant is exclusively available for Enterprise and Enterprise+ license holders.");
			return;
		}
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
				currentBody: rawHtml
			} }));
			toast.success("Content generated! Review below.");
		} catch (err) {
			toast.error(err.message || "Failed to generate content.");
		} finally {
			setIsGenerating(false);
		}
	};
	const handleApply = () => {
		if (mode === "normal") {
			setNormalText(htmlToNormalText(generatedHtml));
			setRawHtml(generatedHtml);
			updateBody(generatedHtml);
		} else {
			setRawHtml(generatedHtml);
			setNormalText(htmlToNormalText(generatedHtml));
			updateBody(generatedHtml);
		}
		setShowModal(false);
		setGeneratedHtml("");
		setPrompt("");
		toast.success("Content applied successfully!");
	};
	return /* @__PURE__ */ jsxs("div", {
		className: "rounded-xl border border-slate-200 bg-white p-5 space-y-4 shadow-sm relative transition hover:border-slate-300",
		children: [
			/* @__PURE__ */ jsxs("button", {
				onClick: () => {
					const newSections = [...activeSections];
					newSections.splice(idx, 1);
					update("sections", newSections);
				},
				className: "absolute right-4 top-4 inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-semibold text-rose-600 transition hover:bg-rose-50",
				title: "Delete this section",
				children: [/* @__PURE__ */ jsx(Trash2, { className: "h-3.5 w-3.5" }), " Remove"]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "pr-24",
				children: [/* @__PURE__ */ jsxs("label", {
					className: "mb-1 block text-xs font-bold uppercase tracking-wider text-slate-500",
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
					placeholder: "e.g. Our Mission, Privacy Notice, Refund Timeline...",
					className: "h-10 w-full md:w-3/4 rounded-lg border border-slate-300 px-3.5 text-sm font-semibold text-slate-900 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 focus:outline-none"
				})]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "space-y-2",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-2",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-1 rounded-lg bg-slate-100 p-1",
							children: [
								/* @__PURE__ */ jsxs("button", {
									type: "button",
									onClick: () => setMode("normal"),
									className: `flex items-center gap-1.5 rounded-md px-3 py-1 text-xs font-bold transition ${mode === "normal" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600 hover:text-slate-900"}`,
									children: [/* @__PURE__ */ jsx(Type, { className: "h-3.5 w-3.5 text-indigo-600" }), /* @__PURE__ */ jsx("span", { children: "Normal Text" })]
								}),
								/* @__PURE__ */ jsxs("button", {
									type: "button",
									onClick: () => setMode("html"),
									className: `flex items-center gap-1.5 rounded-md px-3 py-1 text-xs font-bold transition ${mode === "html" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600 hover:text-slate-900"}`,
									children: [/* @__PURE__ */ jsx(Code, { className: "h-3.5 w-3.5 text-slate-500" }), /* @__PURE__ */ jsx("span", { children: "HTML Code" })]
								}),
								/* @__PURE__ */ jsxs("button", {
									type: "button",
									onClick: () => setMode("preview"),
									className: `flex items-center gap-1.5 rounded-md px-3 py-1 text-xs font-bold transition ${mode === "preview" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600 hover:text-slate-900"}`,
									children: [/* @__PURE__ */ jsx(Eye, { className: "h-3.5 w-3.5 text-emerald-600" }), /* @__PURE__ */ jsx("span", { children: "Live Preview" })]
								})
							]
						}), /* @__PURE__ */ jsx("div", {
							className: "flex items-center gap-2",
							children: /* @__PURE__ */ jsxs("button", {
								type: "button",
								onClick: () => {
									if (!isEnterprise) {
										toast.error("AI Content Assistant is exclusively available for Enterprise and Enterprise+ license holders.");
										return;
									}
									setShowModal(true);
								},
								className: `flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-lg transition-colors shadow-2xs ${isEnterprise ? "text-indigo-700 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200" : "text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-200 cursor-pointer"}`,
								title: !isEnterprise ? "Enterprise Feature Locked — Upgrade to Enterprise or Enterprise+ to use AI Assistant" : "AI Assistant",
								children: [
									isEnterprise ? /* @__PURE__ */ jsx(Sparkles, { className: "h-3.5 w-3.5 text-indigo-600" }) : /* @__PURE__ */ jsx(Lock, { className: "h-3.5 w-3.5 text-amber-600" }),
									/* @__PURE__ */ jsx("span", { children: "AI Assistant" }),
									!isEnterprise && /* @__PURE__ */ jsx("span", {
										className: "inline-flex items-center text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded ml-0.5",
										children: "Enterprise"
									})
								]
							})
						})]
					}),
					mode === "normal" && /* @__PURE__ */ jsxs("div", {
						className: "flex flex-wrap items-center gap-1 rounded-md bg-slate-50 border border-slate-200 px-2 py-1.5 text-xs",
						children: [
							/* @__PURE__ */ jsx("span", {
								className: "text-[11px] font-semibold text-slate-400 mr-1.5",
								children: "Quick Format:"
							}),
							/* @__PURE__ */ jsx("button", {
								type: "button",
								onClick: () => insertFormatting("**", "**"),
								className: "inline-flex items-center gap-1 rounded px-2 py-1 font-bold text-slate-700 hover:bg-slate-200",
								title: "Bold (**text**)",
								children: /* @__PURE__ */ jsx(Bold, { className: "h-3.5 w-3.5" })
							}),
							/* @__PURE__ */ jsx("button", {
								type: "button",
								onClick: () => insertFormatting("*", "*"),
								className: "inline-flex items-center gap-1 rounded px-2 py-1 italic text-slate-700 hover:bg-slate-200",
								title: "Italic (*text*)",
								children: /* @__PURE__ */ jsx(Italic, { className: "h-3.5 w-3.5" })
							}),
							/* @__PURE__ */ jsxs("button", {
								type: "button",
								onClick: () => insertFormatting("\n• "),
								className: "inline-flex items-center gap-1 rounded px-2 py-1 text-slate-700 hover:bg-slate-200",
								title: "Add Bullet Point (• item)",
								children: [/* @__PURE__ */ jsx(List, { className: "h-3.5 w-3.5" }), " Bullet"]
							}),
							/* @__PURE__ */ jsxs("button", {
								type: "button",
								onClick: () => insertFormatting("[Link Text](https://example.com)"),
								className: "inline-flex items-center gap-1 rounded px-2 py-1 text-slate-700 hover:bg-slate-200",
								title: "Insert Link [Text](URL)",
								children: [/* @__PURE__ */ jsx(Link, { className: "h-3.5 w-3.5" }), " Link"]
							}),
							/* @__PURE__ */ jsxs("span", {
								className: "ml-auto text-[11px] text-slate-400 flex items-center gap-1",
								children: [/* @__PURE__ */ jsx(HelpCircle, { className: "h-3 w-3" }), " Press Enter twice for new paragraphs"]
							})
						]
					}),
					mode === "normal" ? /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("textarea", {
						ref: textareaRef,
						value: normalText,
						onChange: (e) => handleNormalTextChange(e.target.value),
						rows: 7,
						placeholder: "Write your section content here in plain, natural text. You don't need any HTML tags!",
						className: "w-full rounded-lg border border-slate-300 p-3.5 text-sm text-slate-800 leading-relaxed focus:border-slate-900 focus:ring-1 focus:ring-slate-900 focus:outline-none"
					}), /* @__PURE__ */ jsxs("p", {
						className: "mt-1 text-[11px] text-slate-400",
						children: [
							"💡 ",
							/* @__PURE__ */ jsx("strong", { children: "Normal Text Mode:" }),
							" Write naturally. Paragraphs and bullet points are automatically formatted for the website."
						]
					})] }) : mode === "html" ? /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("textarea", {
						value: rawHtml,
						onChange: (e) => handleRawHtmlChange(e.target.value),
						rows: 7,
						placeholder: "<p>Raw HTML code...</p>",
						className: "w-full rounded-lg border border-slate-300 p-3.5 text-sm font-mono text-slate-800 bg-slate-50 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 focus:outline-none"
					}), /* @__PURE__ */ jsxs("p", {
						className: "mt-1 text-[11px] text-slate-400",
						children: [
							"⚡ ",
							/* @__PURE__ */ jsx("strong", { children: "HTML Mode:" }),
							" Direct raw HTML editing for advanced styling."
						]
					})] }) : /* @__PURE__ */ jsxs("div", {
						className: "rounded-lg border border-slate-200 bg-slate-50 p-5 min-h-[160px]",
						children: [/* @__PURE__ */ jsx("span", {
							className: "text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2",
							children: "Live Page Preview:"
						}), /* @__PURE__ */ jsx("div", {
							className: "prose prose-sm max-w-none text-slate-700 [&>p]:mb-3 [&>ul]:list-disc [&>ul]:pl-5 [&>ul]:space-y-1 [&_a]:text-blue-600 [&_a]:underline",
							dangerouslySetInnerHTML: { __html: rawHtml || "<p class='text-slate-400 italic'>No content to preview.</p>" }
						})]
					})
				]
			}),
			showModal && isEnterprise && /* @__PURE__ */ jsx("div", {
				className: "fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs",
				children: /* @__PURE__ */ jsxs("div", {
					className: "w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl flex flex-col max-h-[90vh]",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "flex items-center justify-between mb-4 border-b border-slate-100 pb-3",
							children: [/* @__PURE__ */ jsxs("h3", {
								className: "text-lg font-bold flex items-center gap-2 text-indigo-900",
								children: [/* @__PURE__ */ jsx(Sparkles, { className: "h-5 w-5 text-indigo-600" }), " AI Content Assistant"]
							}), /* @__PURE__ */ jsx("button", {
								onClick: () => setShowModal(false),
								className: "text-slate-400 hover:text-slate-600 text-xl font-bold p-1",
								children: "×"
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "space-y-4 overflow-y-auto flex-1 pr-1",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "bg-slate-50 p-4 rounded-xl border border-slate-100",
								children: [
									/* @__PURE__ */ jsx("label", {
										className: "mb-1 block text-sm font-bold text-slate-700",
										children: "Instructions"
									}),
									/* @__PURE__ */ jsx("p", {
										className: "mb-3 text-xs text-slate-500",
										children: "Describe what you want to say in simple words. AI will write clear, professional content."
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "flex gap-2",
										children: [/* @__PURE__ */ jsx("input", {
											type: "text",
											placeholder: "e.g. Explain our 7-day refund policy clearly with bullet points...",
											value: prompt,
											onChange: (e) => setPrompt(e.target.value),
											onKeyDown: (e) => {
												if (e.key === "Enter") {
													e.preventDefault();
													handleGenerate();
												}
											},
											className: "flex-1 h-10 rounded-lg border border-slate-300 px-3.5 text-sm focus:border-indigo-500 focus:outline-none"
										}), /* @__PURE__ */ jsx("button", {
											onClick: handleGenerate,
											disabled: isGenerating,
											className: "h-10 px-5 rounded-lg bg-indigo-600 text-white text-sm font-bold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shrink-0",
											children: isGenerating ? /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(Loader2, { className: "h-4 w-4 animate-spin" }), " Generating..."] }) : "Generate"
										})]
									})
								]
							}), generatedHtml && /* @__PURE__ */ jsxs("div", {
								className: "mt-4 pt-2 border-t border-slate-200 space-y-2",
								children: [/* @__PURE__ */ jsxs("div", {
									className: "flex items-center justify-between",
									children: [/* @__PURE__ */ jsx("label", {
										className: "block text-sm font-bold text-slate-700",
										children: "Generated Preview:"
									}), /* @__PURE__ */ jsx("span", {
										className: "text-xs text-emerald-600 font-semibold flex items-center gap-1",
										children: "Ready to apply"
									})]
								}), /* @__PURE__ */ jsx("div", {
									className: "rounded-xl border border-slate-200 p-4 text-sm text-slate-700 bg-slate-50 max-h-52 overflow-y-auto [&>p]:mb-2 [&>ul]:list-disc [&>ul]:pl-5",
									dangerouslySetInnerHTML: { __html: generatedHtml }
								})]
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
//#region src/components/admin/pages/PagesSidebar.tsx
function PagesSidebar({ pages, activeSlug, onSelectSlug }) {
	const isSubscription = activeSlug === "subscription";
	const isWorkWithUs = activeSlug === "work-with-us";
	const isEvent = activeSlug === "event";
	return /* @__PURE__ */ jsx("aside", {
		className: "rounded-xl border border-slate-200 bg-white p-2 shadow-sm",
		children: /* @__PURE__ */ jsxs("ul", {
			className: "space-y-1",
			children: [
				pages.map((p) => {
					return /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsxs("button", {
						onClick: () => onSelectSlug(p.slug),
						className: `flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-medium transition ${p.slug === activeSlug ? "bg-slate-900 text-white shadow-sm" : "text-slate-700 hover:bg-slate-100"}`,
						children: [/* @__PURE__ */ jsx(FileText, { className: "h-4 w-4 shrink-0" }), /* @__PURE__ */ jsx("span", {
							className: "truncate",
							children: p.title
						})]
					}) }, p.slug);
				}),
				/* @__PURE__ */ jsx("li", { className: "my-2 border-t border-slate-100" }),
				/* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsxs("button", {
					onClick: () => onSelectSlug("subscription"),
					className: `flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-medium transition ${isSubscription ? "bg-slate-900 text-white shadow-sm" : "text-slate-700 hover:bg-slate-100"}`,
					children: [/* @__PURE__ */ jsx(Crown, { className: "h-4 w-4 shrink-0" }), /* @__PURE__ */ jsx("span", {
						className: "truncate",
						children: "Subscription Settings"
					})]
				}) }),
				/* @__PURE__ */ jsx("li", {
					className: "mt-1",
					children: /* @__PURE__ */ jsxs("button", {
						onClick: () => onSelectSlug("work-with-us"),
						className: `flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-medium transition ${isWorkWithUs ? "bg-slate-900 text-white shadow-sm" : "text-slate-700 hover:bg-slate-100"}`,
						children: [/* @__PURE__ */ jsx(Crown, { className: "h-4 w-4 shrink-0" }), /* @__PURE__ */ jsx("span", {
							className: "truncate",
							children: "Work With Us Settings"
						})]
					})
				}),
				/* @__PURE__ */ jsx("li", {
					className: "mt-1",
					children: /* @__PURE__ */ jsxs("button", {
						onClick: () => onSelectSlug("event"),
						className: `flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-medium transition ${isEvent ? "bg-slate-900 text-white shadow-sm" : "text-slate-700 hover:bg-slate-100"}`,
						children: [/* @__PURE__ */ jsx(Sparkles, { className: "h-4 w-4 shrink-0" }), /* @__PURE__ */ jsx("span", {
							className: "truncate",
							children: "Event Page Settings"
						})]
					})
				})
			]
		})
	});
}
//#endregion
//#region src/components/admin/pages/pageFields.ts
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
var eventFields = [
	{
		key: "eventGreeting",
		label: "Top Greeting Badge (শীর্ষ সম্ভাষণ)",
		hint: "যেমন: ॥ শারদীয়া দুর্গোৎসব বিশেষ প্রতিযোগিতা ॥"
	},
	{
		key: "eventTitle",
		label: "Event Title (ইভেন্টের মূল শিরোনাম)"
	},
	{
		key: "eventSubtitle",
		label: "Event Subtitle (উপশিরোনাম)"
	},
	{
		key: "eventDescription",
		label: "Event Description (বিস্তারিত বিবরণ)",
		textarea: true
	},
	{
		key: "eventDate",
		label: "Event Schedule / Date (তারিখ ও সময়কাল)"
	},
	{
		key: "eventLocation",
		label: "Event Location (স্থান / অঞ্চল)"
	},
	{
		key: "eventImageUrl",
		label: "Event Banner / Artwork Image URL (ইভেন্ট ছবি বা ব্যানারের লিঙ্ক)",
		hint: "ইভেন্টের ব্যানার বা ছবির URL প্রদান করুন (যেমন: /durga-face.png)। এটি পেজের শীর্ষে সুন্দরভাবে প্রদর্শিত হবে।"
	},
	{
		key: "eventSection1Divider",
		label: "Highlights Section Divider Text (প্রথম ডিভাইডার লেখা)",
		hint: "যেমন: ॥ প্রতিযোগী সম্মান ও মূল্যায়ন ॥"
	},
	{
		key: "eventPrizesTitle",
		label: "Column 1: Prizes Title (পুরস্কার সেকশন শিরোনাম)",
		hint: "যেমন: পুরস্কার ও সম্মাননা"
	},
	{
		key: "eventPrizes",
		label: "Column 1: Prizes List (পুরস্কার ও সম্মাননা তালিকা)",
		textarea: true,
		hint: "Format: One prize or category per line (প্রতি লাইনে একটি করে পুরস্কার)"
	},
	{
		key: "eventCriteriaTitle",
		label: "Column 2: Criteria Title (মূল্যায়ন সেকশন শিরোনাম)",
		hint: "যেমন: মূল্যায়নের মূল ভিত্তি"
	},
	{
		key: "eventCriteria",
		label: "Column 2: Criteria List (মূল্যায়নের ভিত্তি তালিকা)",
		textarea: true,
		hint: "Format: One criterion per line (প্রতি লাইনে একটি করে মূল্যায়নের পয়েন্ট)"
	},
	{
		key: "eventGuidelinesTitle",
		label: "Column 3: Guidelines Title (নির্দেশিকা শিরোনাম)",
		hint: "যেমন: অংশগ্রহণকারী নির্দেশিকা"
	},
	{
		key: "eventGuidelinesText",
		label: "Column 3: Guidelines Text (নির্দেশিকা বিস্তারিত বিবরণ)",
		textarea: true,
		hint: "অংশগ্রহণকারী ক্লাব বা পূজা কমিটির জন্য নিয়মাবলী বা বার্তা"
	},
	{
		key: "eventGuidelinesBadge",
		label: "Column 3: Highlight Badge (বিশেষ নোট বা ব্যাজ)",
		hint: "যেমন: অংশগ্রহণ সম্পূর্ণ বিনামূল্যে"
	},
	{
		key: "eventSection2Divider",
		label: "Registration Section Divider Text (দ্বিতীয় ডিভাইডার লেখা)",
		hint: "যেমন: ॥ শারদ সম্মান আবেদন পত্র ॥"
	},
	{
		key: "eventFormTitle",
		label: "Registration Form Title (নিবন্ধন ফর্মের শিরোনাম)",
		hint: "যেমন: ইভেন্ট নিবন্ধন ফরম (Event Registration)"
	},
	{
		key: "eventFormSubtitle",
		label: "Registration Form Subtitle (ফর্মের উপশিরোনাম)",
		hint: "যেমন: শারদ সম্মানের জন্য আপনার ক্লাব বা পূজোর বিস্তারিত তথ্য প্রদান করুন"
	},
	{
		key: "eventCustomInputLabel",
		label: "Custom Registration Field Label (কাস্টম ইনপুট লেবেল)",
		hint: "ফর্মের অতিরিক্ত ইনপুট ফিল্ডের নাম (যেমন: ক্লাবের নাম / Club Name)"
	},
	{
		key: "eventButtonText",
		label: "Registration Button Text (নিবন্ধন বাটনের নাম)",
		hint: "যেমন: নিবন্ধন করুন / Join Event / Register"
	}
];
//#endregion
//#region src/components/admin/pages/EventPageSettingsCard.tsx
function EventPageSettingsCard({ settings, updateSetting }) {
	return /* @__PURE__ */ jsxs(Card, {
		title: "Event Page Setup (শারদ সম্মান)",
		subtitle: "Configure the event details, custom registration form, button names, and Durga Puja theme options.",
		children: [eventFields.map((f) => /* @__PURE__ */ jsx(Field, {
			f,
			s: settings,
			update: updateSetting
		}, f.key)), /* @__PURE__ */ jsxs("div", {
			className: "pt-4 border-t border-slate-100 space-y-4",
			children: [
				/* @__PURE__ */ jsxs("div", {
					className: "flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl border border-slate-200 bg-slate-50/80",
					children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ jsx("span", {
							className: "text-sm font-bold text-slate-800",
							children: "Event Footer Quick Link (ফুটার কুইক লিঙ্ক)"
						}), /* @__PURE__ */ jsx("span", {
							className: `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${settings.eventFooterLinkEnabled !== false ? "bg-emerald-100 text-emerald-800 border border-emerald-200" : "bg-red-100 text-red-800 border border-red-200"}`,
							children: settings.eventFooterLinkEnabled !== false ? "ON" : "OFF"
						})]
					}), /* @__PURE__ */ jsx("span", {
						className: "text-xs text-slate-500 block mt-0.5",
						children: "Show or hide the Event page link in the website footer quick links."
					})] }), /* @__PURE__ */ jsxs("div", {
						className: "inline-flex rounded-lg border border-slate-200 bg-white p-0.5 shadow-xs shrink-0",
						children: [/* @__PURE__ */ jsx("button", {
							type: "button",
							onClick: () => updateSetting("eventFooterLinkEnabled", true),
							className: `px-4 py-1.5 text-xs font-bold rounded-md transition ${settings.eventFooterLinkEnabled !== false ? "bg-emerald-600 text-white shadow-xs" : "text-slate-600 hover:text-slate-900"}`,
							children: "ON"
						}), /* @__PURE__ */ jsx("button", {
							type: "button",
							onClick: () => updateSetting("eventFooterLinkEnabled", false),
							className: `px-4 py-1.5 text-xs font-bold rounded-md transition ${settings.eventFooterLinkEnabled === false ? "bg-red-600 text-white shadow-xs" : "text-slate-600 hover:text-slate-900"}`,
							children: "OFF"
						})]
					})]
				}),
				/* @__PURE__ */ jsxs("label", {
					className: "flex items-center gap-3 cursor-pointer",
					children: [/* @__PURE__ */ jsx("input", {
						type: "checkbox",
						checked: settings.eventButtonEnabled !== false,
						onChange: (e) => updateSetting("eventButtonEnabled", e.target.checked),
						className: "h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900"
					}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("span", {
						className: "text-xs font-bold text-slate-700 block",
						children: "Show Join / Register Button"
					}), /* @__PURE__ */ jsx("span", {
						className: "text-[11px] text-slate-500 block",
						children: "When checked, the Join/Register button is visible on the event page"
					})] })]
				}),
				/* @__PURE__ */ jsxs("label", {
					className: "flex items-center gap-3 cursor-pointer",
					children: [/* @__PURE__ */ jsx("input", {
						type: "checkbox",
						checked: settings.eventFormEnabled !== false,
						onChange: (e) => updateSetting("eventFormEnabled", e.target.checked),
						className: "h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900"
					}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("span", {
						className: "text-xs font-bold text-slate-700 block",
						children: "Enable Registration Form"
					}), /* @__PURE__ */ jsx("span", {
						className: "text-[11px] text-slate-500 block",
						children: "When unchecked, the form is closed and users will see that registration is closed"
					})] })]
				})
			]
		})]
	});
}
//#endregion
//#region src/components/admin/pages/PageSeoForm.tsx
function PageSeoForm({ pageTitle, pageIntro, pageContent, pageSlug, seo, onChange, siteName = "News Theme" }) {
	const isEnterprise = (useSiteSettings()?.licenseType || "").toLowerCase().includes("enterprise");
	const [previewDevice, setPreviewDevice] = useState("desktop");
	const [isGeneratingAi, setIsGeneratingAi] = useState(false);
	const handleAiGenerateSeo = async () => {
		if (!isEnterprise) {
			toast.error("AI SEO Assistant is exclusively available for Enterprise and Enterprise+ license holders.");
			return;
		}
		setIsGeneratingAi(true);
		try {
			const res = await generatePageSeoServer({ data: {
				pageTitle,
				pageIntro,
				pageContent: pageContent || "",
				pageSlug,
				siteName
			} });
			if (res.metaTitle) onChange("metaTitle", res.metaTitle);
			if (res.metaDescription) onChange("metaDescription", res.metaDescription);
			if (res.metaKeywords) onChange("metaKeywords", res.metaKeywords);
			toast.success("AI generated SEO tags successfully!");
		} catch (err) {
			toast.error(err.message || "Failed to generate SEO tags with AI.");
		} finally {
			setIsGeneratingAi(false);
		}
	};
	const fullUrl = `${typeof window !== "undefined" && window.location?.origin ? window.location.origin : "http://localhost:3099"}${pageSlug.startsWith("/") ? pageSlug : `/${pageSlug}`}`;
	const currentTitle = seo.metaTitle?.trim() || `${pageTitle || "Page"} — ${siteName}`;
	const currentDescription = seo.metaDescription?.trim() || pageIntro?.trim() || "Read comprehensive updates, verified reporting, and official documentation on this page.";
	const titleLength = (seo.metaTitle || "").length;
	const descLength = (seo.metaDescription || "").length;
	return /* @__PURE__ */ jsxs("div", {
		className: "space-y-6",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "rounded-xl border border-slate-200 bg-white p-5 shadow-xs",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3 mb-4",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ jsx(Search, { className: "h-4 w-4 text-blue-600" }), /* @__PURE__ */ jsx("h3", {
						className: "text-xs font-bold uppercase tracking-wider text-slate-800",
						children: "Google Search Result Snippet Preview"
					})]
				}), /* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-1 rounded-lg bg-slate-100 p-1",
					children: [/* @__PURE__ */ jsxs("button", {
						type: "button",
						onClick: () => setPreviewDevice("desktop"),
						className: `flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-semibold transition ${previewDevice === "desktop" ? "bg-white text-slate-900 shadow-xs" : "text-slate-500 hover:text-slate-800"}`,
						children: [/* @__PURE__ */ jsx(Monitor, { className: "h-3.5 w-3.5" }), " Desktop"]
					}), /* @__PURE__ */ jsxs("button", {
						type: "button",
						onClick: () => setPreviewDevice("mobile"),
						className: `flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-semibold transition ${previewDevice === "mobile" ? "bg-white text-slate-900 shadow-xs" : "text-slate-500 hover:text-slate-800"}`,
						children: [/* @__PURE__ */ jsx(Smartphone, { className: "h-3.5 w-3.5" }), " Mobile"]
					})]
				})]
			}), /* @__PURE__ */ jsxs("div", {
				className: `rounded-xl border border-slate-200 bg-[#f8fafc] p-4 transition-all ${previewDevice === "mobile" ? "max-w-md mx-auto" : "max-w-2xl"}`,
				children: [/* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-2 mb-1",
					children: [/* @__PURE__ */ jsx("div", {
						className: "grid h-6 w-6 place-items-center rounded-full bg-slate-200 text-[11px] font-bold text-slate-700",
						children: siteName.charAt(0).toUpperCase()
					}), /* @__PURE__ */ jsxs("div", {
						className: "min-w-0 leading-tight",
						children: [/* @__PURE__ */ jsx("div", {
							className: "text-xs font-semibold text-slate-900 truncate",
							children: siteName
						}), /* @__PURE__ */ jsx("div", {
							className: "text-[11px] text-slate-500 truncate",
							children: fullUrl
						})]
					})]
				}), /* @__PURE__ */ jsxs("div", {
					className: "mt-1",
					children: [/* @__PURE__ */ jsx("div", {
						className: "text-base font-medium text-[#1a0dab] hover:underline cursor-pointer line-clamp-1",
						children: currentTitle
					}), /* @__PURE__ */ jsx("p", {
						className: "mt-1 text-xs text-[#4d5156] line-clamp-2 leading-relaxed",
						children: currentDescription
					})]
				})]
			})]
		}), /* @__PURE__ */ jsxs("div", {
			className: "rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-5",
			children: [
				/* @__PURE__ */ jsxs("div", {
					className: "flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3",
					children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h3", {
						className: "text-sm font-bold text-slate-900",
						children: "Page Meta Tags & Search Indexing"
					}), /* @__PURE__ */ jsx("p", {
						className: "text-xs text-slate-500",
						children: "Configure how search engines index and rank this specific page."
					})] }), /* @__PURE__ */ jsx("button", {
						type: "button",
						onClick: () => {
							if (!isEnterprise) {
								toast.error("AI SEO Assistant is exclusively available for Enterprise and Enterprise+ license holders.");
								return;
							}
							handleAiGenerateSeo();
						},
						disabled: isGeneratingAi,
						className: `inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-bold shadow-xs transition cursor-pointer disabled:cursor-not-allowed ${isEnterprise ? "bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white hover:opacity-95 active:scale-95 disabled:opacity-50" : "bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200"}`,
						title: !isEnterprise ? "Enterprise Feature Locked — Upgrade to Enterprise or Enterprise+ to use AI Assistant" : "Automatically analyze this page and generate optimal Title, Description, and Keywords using AI",
						children: isGeneratingAi ? /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(Loader2, { className: "h-3.5 w-3.5 animate-spin" }), /* @__PURE__ */ jsx("span", { children: "AI Analyzing & Generating..." })] }) : isEnterprise ? /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(Sparkles, { className: "h-3.5 w-3.5 text-amber-300" }), /* @__PURE__ */ jsx("span", { children: "AI Assistant" })] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
							/* @__PURE__ */ jsx(Lock, { className: "h-3.5 w-3.5 text-amber-600" }),
							/* @__PURE__ */ jsx("span", { children: "AI Assistant" }),
							/* @__PURE__ */ jsx("span", {
								className: "text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded ml-0.5",
								children: "Enterprise"
							})
						] })
					})]
				}),
				/* @__PURE__ */ jsxs("div", { children: [
					/* @__PURE__ */ jsxs("div", {
						className: "flex items-center justify-between mb-1.5",
						children: [/* @__PURE__ */ jsxs("label", {
							className: "text-xs font-bold text-slate-700",
							children: [
								"SEO Title Tag (",
								/* @__PURE__ */ jsx("span", {
									className: "text-slate-500 font-normal",
									children: "<title>"
								}),
								")"
							]
						}), /* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ jsx("button", {
								type: "button",
								onClick: () => onChange("metaTitle", `${pageTitle} — ${siteName}`),
								className: "text-[11px] font-medium text-blue-600 hover:text-blue-800 hover:underline",
								children: "Use page title"
							}), /* @__PURE__ */ jsxs("span", {
								className: `text-xs font-semibold ${titleLength > 60 ? "text-amber-600 font-bold" : "text-slate-400"}`,
								children: [titleLength, " / 60 chars"]
							})]
						})]
					}),
					/* @__PURE__ */ jsx("input", {
						type: "text",
						value: seo.metaTitle || "",
						onChange: (e) => onChange("metaTitle", e.target.value),
						placeholder: `${pageTitle || "Page Title"} — ${siteName}`,
						className: "h-10 w-full rounded-lg border border-slate-200 px-3 text-sm focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
					}),
					/* @__PURE__ */ jsx("p", {
						className: "mt-1 text-[11px] text-slate-500",
						children: "Recommended length: 50–60 characters. Leave blank to automatically use the page title with site name."
					})
				] }),
				/* @__PURE__ */ jsxs("div", { children: [
					/* @__PURE__ */ jsxs("div", {
						className: "flex items-center justify-between mb-1.5",
						children: [/* @__PURE__ */ jsx("label", {
							className: "text-xs font-bold text-slate-700",
							children: "SEO Meta Description"
						}), /* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-2",
							children: [pageIntro && /* @__PURE__ */ jsx("button", {
								type: "button",
								onClick: () => onChange("metaDescription", pageIntro.slice(0, 160)),
								className: "text-[11px] font-medium text-blue-600 hover:text-blue-800 hover:underline",
								children: "Use page intro"
							}), /* @__PURE__ */ jsxs("span", {
								className: `text-xs font-semibold ${descLength > 160 ? "text-amber-600 font-bold" : "text-slate-400"}`,
								children: [descLength, " / 160 chars"]
							})]
						})]
					}),
					/* @__PURE__ */ jsx("textarea", {
						rows: 3,
						value: seo.metaDescription || "",
						onChange: (e) => onChange("metaDescription", e.target.value),
						placeholder: "Write a clear, concise summary of this page for Google search results (~155 characters)...",
						className: "w-full rounded-lg border border-slate-200 p-3 text-sm focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
					}),
					/* @__PURE__ */ jsx("p", {
						className: "mt-1 text-[11px] text-slate-500",
						children: "Recommended length: 140–160 characters. Search engines use this to display the snippet under your headline."
					})
				] }),
				/* @__PURE__ */ jsxs("div", { children: [
					/* @__PURE__ */ jsx("label", {
						className: "block text-xs font-bold text-slate-700 mb-1.5",
						children: "Meta Keywords / Search Tags"
					}),
					/* @__PURE__ */ jsx("input", {
						type: "text",
						value: seo.metaKeywords || "",
						onChange: (e) => onChange("metaKeywords", e.target.value),
						placeholder: "e.g. newsroom, editorial policy, standards, northeast india",
						className: "h-10 w-full rounded-lg border border-slate-200 px-3 text-sm focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
					}),
					/* @__PURE__ */ jsx("p", {
						className: "mt-1 text-[11px] text-slate-500",
						children: "Comma-separated keywords helping search engines categorize this page topic."
					})
				] }),
				/* @__PURE__ */ jsxs("div", { children: [
					/* @__PURE__ */ jsx("label", {
						className: "block text-xs font-bold text-slate-700 mb-1.5",
						children: "Social Share Image (Open Graph / Twitter Card)"
					}),
					/* @__PURE__ */ jsx(MediaField, {
						label: "Social Share Image (1200x630 recommended)",
						value: seo.ogImage || "",
						onChange: (v) => onChange("ogImage", v)
					}),
					/* @__PURE__ */ jsx("p", {
						className: "mt-1 text-[11px] text-slate-500",
						children: "This image appears when readers share the page URL on WhatsApp, Facebook, LinkedIn, or Twitter/X."
					})
				] }),
				/* @__PURE__ */ jsxs("div", { children: [
					/* @__PURE__ */ jsx("label", {
						className: "block text-xs font-bold text-slate-700 mb-1.5",
						children: "Canonical URL Override (Optional)"
					}),
					/* @__PURE__ */ jsx("input", {
						type: "text",
						value: seo.canonicalUrl || "",
						onChange: (e) => onChange("canonicalUrl", e.target.value),
						placeholder: fullUrl,
						className: "h-10 w-full rounded-lg border border-slate-200 px-3 text-sm font-mono text-xs focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
					}),
					/* @__PURE__ */ jsxs("p", {
						className: "mt-1 text-[11px] text-slate-500",
						children: [
							"Defaults automatically to ",
							/* @__PURE__ */ jsx("code", {
								className: "font-mono bg-slate-100 px-1 py-0.5 rounded",
								children: fullUrl
							}),
							". Only override if this page content duplicates another URL."
						]
					})
				] }),
				/* @__PURE__ */ jsx("div", {
					className: "pt-3 border-t border-slate-100",
					children: /* @__PURE__ */ jsxs("label", {
						className: "flex items-center justify-between cursor-pointer",
						children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("span", {
							className: "text-xs font-bold text-slate-900 block",
							children: "Allow Search Engines to Index This Page"
						}), /* @__PURE__ */ jsx("span", {
							className: "text-[11px] text-slate-500 block",
							children: seo.noIndex ? "Page is set to 'noindex, nofollow' (Search engines will ignore this page)." : "Page is set to 'index, follow' (Recommended: Search engines will index this page in search results)."
						})] }), /* @__PURE__ */ jsx("input", {
							type: "checkbox",
							checked: !seo.noIndex,
							onChange: (e) => onChange("noIndex", !e.target.checked),
							className: "h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900"
						})]
					})
				})
			]
		})]
	});
}
//#endregion
//#region src/routes/admin.pages.tsx?tsr-split=component
function PagesPage() {
	const [pages, setPages] = useState(() => loadPages());
	const [settings, setSettings] = useState(() => loadSettings());
	const [activeSlug, setActiveSlug] = useState("about");
	const [editorTab, setEditorTab] = useState("content");
	useEffect(() => {
		getCustomPagesServer().then((p) => setPages(p)).catch(() => {});
		getSiteSettingsServer().then((s) => {
			if (s) setSettings(s);
		}).catch(() => {});
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
		if (activeSlug === "subscription" || activeSlug === "work-with-us" || activeSlug === "event") {
			await saveSettings(settings).catch(() => {});
			toast.success("Saved successfully");
		} else {
			savePages(pages);
			await saveCustomPageServer({ data: active }).catch(() => {});
			toast.success("Saved successfully");
		}
	};
	const isSubscription = activeSlug === "subscription";
	const isWorkWithUs = activeSlug === "work-with-us";
	const isEvent = activeSlug === "event";
	const isSettingsPage = isSubscription || isWorkWithUs || isEvent;
	const hasSeo = isSubscription ? Boolean(settings.subscriptionMetaTitle || settings.subscriptionMetaDescription || settings.subscriptionOgImage) : isWorkWithUs ? Boolean(settings.workWithUsMetaTitle || settings.workWithUsMetaDescription || settings.workWithUsOgImage) : isEvent ? Boolean(settings.eventMetaTitle || settings.eventMetaDescription || settings.eventOgImage) : Boolean(active?.metaTitle || active?.metaDescription || active?.ogImage);
	return /* @__PURE__ */ jsxs("div", {
		className: "space-y-6",
		children: [/* @__PURE__ */ jsx("div", {
			className: "flex flex-wrap items-center justify-between gap-3",
			children: /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h1", {
				className: "text-2xl font-bold tracking-tight",
				children: "System & Policy Pages"
			}), /* @__PURE__ */ jsx("p", {
				className: "text-sm text-slate-500",
				children: "Edit the About, Contact, Terms, and footer policy pages."
			})] })
		}), /* @__PURE__ */ jsxs("div", {
			className: "grid gap-6 lg:grid-cols-[280px_1fr]",
			children: [/* @__PURE__ */ jsx(PagesSidebar, {
				pages,
				activeSlug,
				onSelectSlug: (slug) => {
					setActiveSlug(slug);
				}
			}), /* @__PURE__ */ jsxs("main", {
				className: "space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "flex items-center justify-between border-b border-slate-100 pb-4",
						children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h2", {
							className: "text-lg font-bold text-slate-900",
							children: isSubscription ? "Subscription Settings" : isWorkWithUs ? "Work With Us Settings" : isEvent ? "Event Page Settings (শারদ সম্মান)" : active?.title
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
								children: [/* @__PURE__ */ jsx(Save, { className: "h-4 w-4" }), " Save"]
							})]
						})]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "flex border-b border-slate-200 gap-2 mb-6",
						children: [/* @__PURE__ */ jsxs("button", {
							type: "button",
							onClick: () => setEditorTab("content"),
							className: `flex items-center gap-2 border-b-2 px-4 py-2.5 text-xs font-semibold transition ${editorTab === "content" ? "border-slate-900 text-slate-900 bg-slate-50/50 rounded-t-lg" : "border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-800"}`,
							children: [/* @__PURE__ */ jsx(FileText, { className: "h-4 w-4" }), " Page Content"]
						}), /* @__PURE__ */ jsxs("button", {
							type: "button",
							onClick: () => setEditorTab("seo"),
							className: `flex items-center gap-2 border-b-2 px-4 py-2.5 text-xs font-semibold transition ${editorTab === "seo" ? "border-slate-900 text-slate-900 bg-slate-50/50 rounded-t-lg" : "border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-800"}`,
							children: [
								/* @__PURE__ */ jsx(Search, { className: "h-4 w-4" }),
								" SEO & Social Share",
								hasSeo ? /* @__PURE__ */ jsx("span", {
									className: "rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800",
									children: "Custom SEO Active"
								}) : /* @__PURE__ */ jsx("span", {
									className: "rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-500",
									children: "Default SEO"
								})
							]
						})]
					}),
					editorTab === "seo" ? isSubscription ? /* @__PURE__ */ jsx(PageSeoForm, {
						pageTitle: settings.subscriptionTitle || "Subscription",
						pageIntro: settings.subscriptionIntro || "",
						pageContent: settings.subscriptionFeatures || settings.subscriptionIntro || "",
						pageSlug: "subscription",
						seo: {
							metaTitle: settings.subscriptionMetaTitle,
							metaDescription: settings.subscriptionMetaDescription,
							ogImage: settings.subscriptionOgImage,
							metaKeywords: settings.subscriptionKeywords,
							canonicalUrl: settings.subscriptionCanonicalUrl,
							noIndex: settings.subscriptionNoIndex
						},
						onChange: (k, v) => {
							updateSetting({
								metaTitle: "subscriptionMetaTitle",
								metaDescription: "subscriptionMetaDescription",
								ogImage: "subscriptionOgImage",
								metaKeywords: "subscriptionKeywords",
								canonicalUrl: "subscriptionCanonicalUrl",
								noIndex: "subscriptionNoIndex"
							}[k], v);
						},
						siteName: settings.siteName || "News Theme"
					}) : isWorkWithUs ? /* @__PURE__ */ jsx(PageSeoForm, {
						pageTitle: settings.workWithUsHeroTitle || "Work With Us",
						pageIntro: settings.workWithUsHeroIntro || "",
						pageContent: [
							settings.workWithUsHeroIntro,
							settings.workWithUsRules,
							settings.workWithUsTiers,
							settings.workWithUsFaqs
						].filter(Boolean).join("\n\n"),
						pageSlug: "work-with-us",
						seo: {
							metaTitle: settings.workWithUsMetaTitle,
							metaDescription: settings.workWithUsMetaDescription,
							ogImage: settings.workWithUsOgImage,
							metaKeywords: settings.workWithUsKeywords,
							canonicalUrl: settings.workWithUsCanonicalUrl,
							noIndex: settings.workWithUsNoIndex
						},
						onChange: (k, v) => {
							updateSetting({
								metaTitle: "workWithUsMetaTitle",
								metaDescription: "workWithUsMetaDescription",
								ogImage: "workWithUsOgImage",
								metaKeywords: "workWithUsKeywords",
								canonicalUrl: "workWithUsCanonicalUrl",
								noIndex: "workWithUsNoIndex"
							}[k], v);
						},
						siteName: settings.siteName || "News Theme"
					}) : isEvent ? /* @__PURE__ */ jsx(PageSeoForm, {
						pageTitle: settings.eventTitle || "Sharad Samman Event",
						pageIntro: settings.eventSubtitle || settings.eventDescription || "",
						pageContent: [
							settings.eventSubtitle,
							settings.eventDescription,
							settings.eventPrizes,
							settings.eventCriteria,
							settings.eventGuidelinesText
						].filter(Boolean).join("\n\n"),
						pageSlug: "event",
						seo: {
							metaTitle: settings.eventMetaTitle,
							metaDescription: settings.eventMetaDescription,
							ogImage: settings.eventOgImage || settings.eventImageUrl,
							metaKeywords: settings.eventKeywords,
							canonicalUrl: settings.eventCanonicalUrl,
							noIndex: settings.eventNoIndex
						},
						onChange: (k, v) => {
							updateSetting({
								metaTitle: "eventMetaTitle",
								metaDescription: "eventMetaDescription",
								ogImage: "eventOgImage",
								metaKeywords: "eventKeywords",
								canonicalUrl: "eventCanonicalUrl",
								noIndex: "eventNoIndex"
							}[k], v);
						},
						siteName: settings.siteName || "News Theme"
					}) : /* @__PURE__ */ jsx(PageSeoForm, {
						pageTitle: active?.title || "Page",
						pageIntro: active?.intro || "",
						pageContent: active?.sections && active.sections.length > 0 ? active.sections.map((s) => `${s.heading}:\n${htmlToNormalText(s.body)}`).join("\n\n") : htmlToNormalText(active?.body || ""),
						pageSlug: activeSlug,
						seo: {
							metaTitle: active?.metaTitle,
							metaDescription: active?.metaDescription,
							ogImage: active?.ogImage,
							metaKeywords: active?.metaKeywords,
							canonicalUrl: active?.canonicalUrl,
							noIndex: active?.noIndex
						},
						onChange: (k, v) => update(k, v),
						siteName: settings.siteName || "News Theme"
					}) : /* @__PURE__ */ jsx(Fragment, { children: isEvent ? /* @__PURE__ */ jsx(EventPageSettingsCard, {
						settings,
						updateSetting
					}) : isSubscription ? /* @__PURE__ */ jsx(Card, {
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
					}) : null })
				]
			})]
		})]
	});
}
//#endregion
export { PagesPage as component };
