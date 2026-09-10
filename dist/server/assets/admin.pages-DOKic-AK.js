import { D as savePages, E as saveCustomPageServer, _ as loadSettings, h as loadPages, j as saveSiteSettingsServer, o as getCustomPagesServer } from "./site-content-C32CLrYw.js";
import { n as generateSectionHtmlServer } from "./ai.functions-CKgkESQz.js";
import { n as Field, t as Card } from "./SettingsHelpers-OyiB6UV8.js";
import { useEffect, useMemo, useRef, useState } from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { Bold, Code, Crown, ExternalLink, Eye, FileText, HelpCircle, Italic, Link, List, Loader2, Save, ShieldCheck, Sparkles, Trash2, Type } from "lucide-react";
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
								onClick: () => setShowModal(true),
								className: "flex items-center gap-1.5 text-xs font-bold text-indigo-700 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 px-3 py-1 rounded-lg transition-colors shadow-2xs",
								children: [/* @__PURE__ */ jsx(Sparkles, { className: "h-3.5 w-3.5 text-indigo-600" }), " AI Assistant"]
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
			showModal && /* @__PURE__ */ jsx("div", {
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
