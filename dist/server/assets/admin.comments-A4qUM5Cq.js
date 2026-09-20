import { t as useServerFn } from "./useServerFn-BqzygRuj.js";
import { a as useSiteSettings } from "./AdSettingsContext-DnVOjDQ9.js";
import { a as getAllCommentsFn, c as importCommentsFn, d as updateCommentStatus, f as generateDummyCommentsFn, i as getAdminComments, l as lookupArticleByUrlOrSlugFn, n as deleteComment, r as extractSlugFromUrl, s as getRecentArticlesForCommentsFn, t as deleteAllCommentsFn } from "./comments.functions-c-HlbMwg.js";
import { t as CsvImportExport } from "./CsvImportExport-cj5FA8rJ.js";
import { useEffect, useState } from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { AlertCircle, Check, CheckCircle2, ChevronLeft, ChevronRight, ExternalLink, Flame, Link, Loader2, Search, Sparkles, Trash2, X } from "lucide-react";
import { toast } from "sonner";
//#region src/components/admin/comments/CommentTable.tsx
var badge = {
	Approved: "bg-emerald-50 text-emerald-700 border-emerald-200",
	Pending: "bg-amber-50 text-amber-700 border-amber-200",
	Spam: "bg-red-50 text-red-700 border-red-200"
};
function CommentTable({ comments, onSetStatus, onDelete }) {
	return /* @__PURE__ */ jsx("div", {
		className: "overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm",
		children: /* @__PURE__ */ jsxs("table", {
			className: "w-full min-w-[650px] text-left text-sm",
			children: [/* @__PURE__ */ jsx("thead", {
				className: "border-b border-slate-200 bg-slate-50 text-xs font-bold uppercase tracking-wider text-slate-500",
				children: /* @__PURE__ */ jsxs("tr", { children: [
					/* @__PURE__ */ jsx("th", {
						className: "px-4 sm:px-5 py-3",
						children: "User"
					}),
					/* @__PURE__ */ jsx("th", {
						className: "px-4 sm:px-5 py-3",
						children: "Comment Body"
					}),
					/* @__PURE__ */ jsx("th", {
						className: "px-4 sm:px-5 py-3",
						children: "Article"
					}),
					/* @__PURE__ */ jsx("th", {
						className: "px-4 sm:px-5 py-3",
						children: "Status"
					}),
					/* @__PURE__ */ jsx("th", {
						className: "px-4 sm:px-5 py-3 text-right",
						children: "Actions"
					})
				] })
			}), /* @__PURE__ */ jsxs("tbody", {
				className: "divide-y divide-slate-100",
				children: [comments.map((c) => /* @__PURE__ */ jsxs("tr", {
					className: "hover:bg-slate-50/70 transition-colors",
					children: [
						/* @__PURE__ */ jsxs("td", {
							className: "px-5 py-3",
							children: [/* @__PURE__ */ jsx("p", {
								className: "font-semibold text-slate-900",
								children: c.user || "Anonymous"
							}), /* @__PURE__ */ jsx("p", {
								className: "text-xs text-slate-500",
								children: c.email
							})]
						}),
						/* @__PURE__ */ jsx("td", {
							className: "px-5 py-3 text-xs text-slate-700 max-w-sm",
							children: c.body
						}),
						/* @__PURE__ */ jsx("td", {
							className: "px-5 py-3 text-xs text-slate-600 font-medium max-w-xs truncate",
							children: /* @__PURE__ */ jsx("a", {
								href: `/news/${c.articleSlug}`,
								target: "_blank",
								rel: "noopener noreferrer",
								className: "hover:underline text-blue-600",
								children: c.articleTitle || c.articleSlug
							})
						}),
						/* @__PURE__ */ jsx("td", {
							className: "px-5 py-3",
							children: /* @__PURE__ */ jsx("span", {
								className: `inline-flex rounded-full border px-2.5 py-0.5 text-xs font-semibold ${badge[c.status]}`,
								children: c.status
							})
						}),
						/* @__PURE__ */ jsx("td", {
							className: "px-5 py-3 text-right",
							children: /* @__PURE__ */ jsxs("div", {
								className: "inline-flex gap-1",
								children: [
									c.status !== "Approved" && /* @__PURE__ */ jsx("button", {
										onClick: () => onSetStatus(c.id, "Approved"),
										title: "Approve Comment",
										className: "rounded-md border border-emerald-200 bg-emerald-50 p-1.5 text-emerald-700 hover:bg-emerald-100",
										children: /* @__PURE__ */ jsx(Check, { className: "h-3.5 w-3.5" })
									}),
									c.status !== "Spam" && /* @__PURE__ */ jsx("button", {
										onClick: () => onSetStatus(c.id, "Spam"),
										title: "Mark as Spam",
										className: "rounded-md border border-amber-200 bg-amber-50 p-1.5 text-amber-800 hover:bg-amber-100",
										children: /* @__PURE__ */ jsx(X, { className: "h-3.5 w-3.5" })
									}),
									/* @__PURE__ */ jsx("button", {
										onClick: () => onDelete(c.id),
										title: "Delete Comment",
										className: "rounded-md border border-red-200 bg-red-50 p-1.5 text-red-600 hover:bg-red-100",
										children: /* @__PURE__ */ jsx(Trash2, { className: "h-3.5 w-3.5" })
									})
								]
							})
						})
					]
				}, c.id)), comments.length === 0 && /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", {
					colSpan: 5,
					className: "px-5 py-8 text-center text-xs text-slate-400",
					children: "No comments found in this tab."
				}) })]
			})]
		})
	});
}
//#endregion
//#region src/components/admin/comments/CommentFilterBar.tsx
function CommentFilterBar({ tabs, currentTab, onTabChange, searchQuery, onSearchChange }) {
	return /* @__PURE__ */ jsxs("div", {
		className: "flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 sm:gap-3 rounded-xl border border-slate-200 bg-white p-2.5 sm:p-3 shadow-sm",
		children: [/* @__PURE__ */ jsx("div", {
			className: "flex flex-wrap items-center gap-1 sm:gap-1.5",
			children: tabs.map((t) => /* @__PURE__ */ jsx("button", {
				onClick: () => onTabChange(t),
				className: `rounded-lg px-2.5 sm:px-3.5 py-1 sm:py-1.5 text-xs font-semibold transition whitespace-nowrap ${currentTab === t ? "bg-slate-900 text-white shadow-sm" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`,
				children: t
			}, t))
		}), /* @__PURE__ */ jsxs("div", {
			className: "relative w-full sm:w-64",
			children: [/* @__PURE__ */ jsx(Search, { className: "absolute left-2.5 sm:left-3 top-2 sm:top-2.5 h-3.5 w-3.5 sm:h-4 sm:w-4 text-slate-400" }), /* @__PURE__ */ jsx("input", {
				type: "text",
				value: searchQuery,
				onChange: (e) => onSearchChange(e.target.value),
				placeholder: "Search comment content...",
				className: "h-8 sm:h-9 w-full rounded-md border border-slate-200 pl-8 sm:pl-9 pr-3 text-xs sm:text-sm focus:border-slate-900 focus:outline-none"
			})]
		})]
	});
}
//#endregion
//#region src/components/admin/comments/AiGenerateModal.tsx
function AiGenerateModal({ isOpen, onClose, onSuccess }) {
	const planType = (useSiteSettings()?.licenseType || "").toLowerCase();
	const isEnterprisePlus = planType.includes("enterprise plus") || planType.includes("enterprise+");
	const [aiPublicUserId, setAiPublicUserId] = useState("");
	const [aiArticleInput, setAiArticleInput] = useState("");
	const [aiArticleSlug, setAiArticleSlug] = useState("");
	const [resolvedArticle, setResolvedArticle] = useState(null);
	const [fetchingArticle, setFetchingArticle] = useState(false);
	const [fetchError, setFetchError] = useState("");
	const [aiCount, setAiCount] = useState(5);
	const [aiPositivity, setAiPositivity] = useState(80);
	const [aiLanguage, setAiLanguage] = useState("random_mix");
	const [aiCustomPrompt, setAiCustomPrompt] = useState("");
	const [aiAllowSlang, setAiAllowSlang] = useState(true);
	const [aiGenerating, setAiGenerating] = useState(false);
	const [recentArticles, setRecentArticles] = useState([]);
	const generateAiComments = useServerFn(generateDummyCommentsFn);
	const getRecentArticlesFn = useServerFn(getRecentArticlesForCommentsFn);
	const lookupArticleFn = useServerFn(lookupArticleByUrlOrSlugFn);
	const handleFetchArticle = async (rawInput) => {
		const trimmed = (rawInput || "").trim();
		if (!trimmed) {
			setResolvedArticle(null);
			setAiArticleSlug("");
			setFetchError("");
			return;
		}
		try {
			setFetchingArticle(true);
			setFetchError("");
			const res = await lookupArticleFn({ data: trimmed });
			if (res?.found && res.article) {
				setResolvedArticle(res.article);
				setAiArticleSlug(res.article.slug);
				setFetchError("");
			} else {
				setResolvedArticle(null);
				setAiArticleSlug(extractSlugFromUrl(trimmed));
				setFetchError("Article not found with this URL or slug. Please verify the link.");
			}
		} catch (err) {
			setResolvedArticle(null);
			setFetchError(err.message || "Failed to fetch article details");
		} finally {
			setFetchingArticle(false);
		}
	};
	useEffect(() => {
		if (!isOpen) return;
		if (!aiArticleInput.trim()) {
			setResolvedArticle(null);
			setAiArticleSlug("");
			setFetchError("");
			return;
		}
		const timer = setTimeout(() => {
			handleFetchArticle(aiArticleInput);
		}, 450);
		return () => clearTimeout(timer);
	}, [aiArticleInput, isOpen]);
	useEffect(() => {
		if (isOpen && recentArticles.length === 0) getRecentArticlesFn().then((res) => {
			if (res && res.length > 0) setRecentArticles(res);
		}).catch(() => {});
	}, [isOpen]);
	const resetForm = () => {
		setAiPublicUserId("");
		setAiCustomPrompt("");
		setAiArticleInput("");
		setAiArticleSlug("");
		setResolvedArticle(null);
		setFetchError("");
		setAiCount(5);
		setAiPositivity(80);
		setAiLanguage("random_mix");
	};
	const handleGenerateAi = async (e) => {
		e.preventDefault();
		if (!isEnterprisePlus) {
			toast.error("Generate AI Comments is exclusively available on Enterprise Plus licenses.");
			return;
		}
		const targetSlug = aiArticleSlug || extractSlugFromUrl(aiArticleInput);
		if (!targetSlug || aiCount < 1) {
			toast.error("Please enter or paste an article URL / slug");
			return;
		}
		try {
			setAiGenerating(true);
			const res = await generateAiComments({ data: {
				publicUserIds: aiPublicUserId,
				articleSlug: targetSlug,
				count: aiCount,
				positivity: aiPositivity,
				language: aiLanguage,
				customPrompt: aiCustomPrompt,
				allowSlang: aiAllowSlang
			} });
			toast.success(`Successfully generated ${res.count} realistic comments!`);
			resetForm();
			onClose();
			onSuccess();
		} catch (err) {
			toast.error(err.message || "Failed to generate comments");
		} finally {
			setAiGenerating(false);
		}
	};
	if (!isOpen || !isEnterprisePlus) return null;
	return /* @__PURE__ */ jsx("div", {
		className: "fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto",
		children: /* @__PURE__ */ jsxs("div", {
			className: "w-full max-w-xl rounded-2xl bg-white shadow-2xl overflow-hidden my-6",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "flex items-center justify-between border-b border-slate-100 bg-gradient-to-r from-blue-50/80 to-indigo-50/80 px-6 py-4",
				children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("h2", {
					className: "text-lg font-bold text-slate-900 flex items-center gap-2",
					children: [/* @__PURE__ */ jsx(Sparkles, { className: "h-5 w-5 text-blue-600" }), " Generate AI Comments"]
				}), /* @__PURE__ */ jsx("p", {
					className: "text-xs text-slate-500 mt-0.5",
					children: "Simulate realistic Tripura reader reactions with Bengali, Banglish & Indian English"
				})] }), /* @__PURE__ */ jsx("button", {
					onClick: onClose,
					className: "rounded-lg p-1.5 text-slate-400 hover:bg-white hover:text-slate-600 transition",
					children: /* @__PURE__ */ jsx(X, { className: "h-5 w-5" })
				})]
			}), /* @__PURE__ */ jsxs("form", {
				onSubmit: handleGenerateAi,
				className: "p-6 space-y-4 max-h-[82vh] overflow-y-auto",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "space-y-2",
						children: [
							/* @__PURE__ */ jsxs("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ jsxs("label", {
									className: "text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5",
									children: [
										/* @__PURE__ */ jsx(Link, { className: "h-3.5 w-3.5 text-blue-600" }),
										"Target Article URL or Slug ",
										/* @__PURE__ */ jsx("span", {
											className: "text-red-500",
											children: "*"
										})
									]
								}), aiArticleSlug && /* @__PURE__ */ jsxs("span", {
									className: "text-[11px] text-slate-500 font-mono",
									children: ["Slug: ", aiArticleSlug]
								})]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "relative flex items-center",
								children: [/* @__PURE__ */ jsx("input", {
									type: "text",
									required: true,
									placeholder: "Paste article URL or slug (e.g. https://.../news/... or slug)",
									value: aiArticleInput,
									onChange: (e) => setAiArticleInput(e.target.value),
									className: "w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-xs focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 pr-24 font-medium text-slate-800"
								}), /* @__PURE__ */ jsx("button", {
									type: "button",
									onClick: () => handleFetchArticle(aiArticleInput),
									disabled: fetchingArticle || !aiArticleInput.trim(),
									className: "absolute right-1.5 top-1.5 rounded-md bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 disabled:opacity-40 transition flex items-center gap-1 shadow-xs",
									children: fetchingArticle ? /* @__PURE__ */ jsx(Loader2, { className: "h-3.5 w-3.5 animate-spin" }) : "Auto Fetch"
								})]
							}),
							fetchingArticle && /* @__PURE__ */ jsxs("div", {
								className: "flex items-center gap-2 text-xs text-blue-600 py-1 font-medium",
								children: [/* @__PURE__ */ jsx(Loader2, { className: "h-3.5 w-3.5 animate-spin" }), " Fetching article details from database..."]
							}),
							resolvedArticle && /* @__PURE__ */ jsx("div", {
								className: "rounded-xl border border-emerald-200 bg-emerald-50/70 p-3 shadow-xs animate-in fade-in duration-200",
								children: /* @__PURE__ */ jsxs("div", {
									className: "flex items-start justify-between gap-3",
									children: [/* @__PURE__ */ jsxs("div", {
										className: "flex items-start gap-2.5",
										children: [/* @__PURE__ */ jsx(CheckCircle2, { className: "h-4 w-4 text-emerald-600 shrink-0 mt-0.5" }), /* @__PURE__ */ jsxs("div", { children: [
											/* @__PURE__ */ jsxs("div", {
												className: "flex items-center gap-2",
												children: [/* @__PURE__ */ jsx("span", {
													className: "text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full",
													children: "✓ Article Verified"
												}), resolvedArticle.category && /* @__PURE__ */ jsx("span", {
													className: "text-[10px] font-semibold text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200",
													children: resolvedArticle.category
												})]
											}),
											/* @__PURE__ */ jsx("h4", {
												className: "text-xs sm:text-sm font-bold text-slate-900 mt-1 leading-snug",
												children: resolvedArticle.title
											}),
											/* @__PURE__ */ jsxs("p", {
												className: "text-[11px] text-slate-500 font-mono mt-0.5",
												children: [
													"ID: #",
													resolvedArticle.id,
													" • /",
													resolvedArticle.slug
												]
											})
										] })]
									}), /* @__PURE__ */ jsxs("a", {
										href: `/news/${resolvedArticle.slug}`,
										target: "_blank",
										rel: "noopener noreferrer",
										className: "inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 shrink-0 bg-white px-2.5 py-1 rounded-md border border-slate-200 shadow-xs",
										children: ["View ", /* @__PURE__ */ jsx(ExternalLink, { className: "h-3 w-3" })]
									})]
								})
							}),
							fetchError && !fetchingArticle && aiArticleInput && /* @__PURE__ */ jsxs("div", {
								className: "flex items-center gap-2 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-2.5",
								children: [/* @__PURE__ */ jsx(AlertCircle, { className: "h-4 w-4 shrink-0 text-amber-600" }), /* @__PURE__ */ jsx("span", { children: fetchError })]
							}),
							recentArticles.length > 0 && /* @__PURE__ */ jsxs("div", {
								className: "pt-1",
								children: [/* @__PURE__ */ jsx("div", {
									className: "flex items-center justify-between text-[11px] text-slate-500 mb-1",
									children: /* @__PURE__ */ jsx("span", { children: "Or pick from recent articles:" })
								}), /* @__PURE__ */ jsxs("select", {
									value: aiArticleSlug,
									onChange: (e) => {
										const selSlug = e.target.value;
										if (selSlug) {
											setAiArticleInput(selSlug);
											handleFetchArticle(selSlug);
										} else {
											setAiArticleInput("");
											setAiArticleSlug("");
											setResolvedArticle(null);
											setFetchError("");
										}
									},
									className: "w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-700 focus:border-blue-500 focus:outline-none",
									children: [/* @__PURE__ */ jsx("option", {
										value: "",
										children: "-- Choose from recent articles (optional) --"
									}), recentArticles.map((art) => /* @__PURE__ */ jsx("option", {
										value: art.slug,
										children: art.title.length > 65 ? art.title.slice(0, 65) + "…" : art.title
									}, art.id))]
								})]
							})
						]
					}),
					/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("div", {
						className: "flex items-center justify-between mb-1.5",
						children: [/* @__PURE__ */ jsx("label", {
							htmlFor: "ai-comment-count",
							className: "text-xs font-bold uppercase tracking-wider text-slate-700",
							children: "Number of Comments"
						}), /* @__PURE__ */ jsxs("span", {
							className: "text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full",
							children: [aiCount, " Comments"]
						})]
					}), /* @__PURE__ */ jsx("input", {
						id: "ai-comment-count",
						type: "number",
						required: true,
						min: "1",
						max: "50",
						value: aiCount,
						onChange: (e) => setAiCount(Math.max(1, Math.min(50, parseInt(e.target.value) || 1))),
						className: "w-full rounded-lg border border-slate-300 px-3 py-2 text-xs focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500",
						placeholder: "Enter number of comments (1 - 50)"
					})] }),
					/* @__PURE__ */ jsxs("div", { children: [
						/* @__PURE__ */ jsx("label", {
							className: "mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-700",
							children: "Language & Dialect Mode"
						}),
						/* @__PURE__ */ jsxs("select", {
							value: aiLanguage,
							onChange: (e) => setAiLanguage(e.target.value),
							className: "w-full rounded-lg border border-slate-300 px-3 py-2 text-xs focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white font-medium text-slate-800",
							children: [
								/* @__PURE__ */ jsx("option", {
									value: "random_mix",
									children: "✨ Natural Random Mix (Tripura Bengali + Banglish + Indian English) [Recommended]"
								}),
								/* @__PURE__ */ jsx("option", {
									value: "Bengali",
									children: "বাংলা - Tripura Spoken Bengali (বাংলা হরফে স্থানীয় কথ্য টান)"
								}),
								/* @__PURE__ */ jsx("option", {
									value: "Banglish",
									children: "Banglish - Bengali in Roman English letters (e.g. 'Khub bhalo udyog')"
								}),
								/* @__PURE__ */ jsx("option", {
									value: "English",
									children: "Indian English - Local news reader tone (e.g. 'Good step by authorities')"
								}),
								/* @__PURE__ */ jsx("option", {
									value: "CodeMixed",
									children: "Code-Mixed - Bangla + English blend ('Ei decision-ta accurate')"
								})
							]
						}),
						/* @__PURE__ */ jsx("p", {
							className: "mt-1 text-[11px] text-slate-500",
							children: aiLanguage === "random_mix" ? "Randomly distributes comments: one in Bengali script, one in Banglish, one in Indian English, and one code-mixed for total realism." : "Generates all comments in this specific linguistic style."
						})
					] }),
					/* @__PURE__ */ jsxs("div", {
						className: "rounded-xl border border-blue-200 bg-blue-50/60 p-3.5 space-y-1.5",
						children: [
							/* @__PURE__ */ jsxs("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ jsxs("label", {
									className: "text-xs font-bold uppercase tracking-wider text-blue-950 flex items-center gap-1.5",
									children: [/* @__PURE__ */ jsx(Sparkles, { className: "h-3.5 w-3.5 text-blue-600" }), "Custom AI Focus / Keywords (Optional)"]
								}), /* @__PURE__ */ jsx("span", {
									className: "text-[10px] font-semibold text-blue-700 bg-blue-100/80 px-2 py-0.5 rounded-full",
									children: "Topic Guidance"
								})]
							}),
							/* @__PURE__ */ jsx("textarea", {
								rows: 2,
								value: aiCustomPrompt,
								onChange: (e) => setAiCustomPrompt(e.target.value),
								placeholder: "e.g. Focus on road conditions and mention AMC; or Praise the Chief Minister's decision; or Question when electricity issue will be resolved",
								className: "w-full rounded-lg border border-blue-200 bg-white p-2.5 text-xs text-slate-800 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
							}),
							/* @__PURE__ */ jsx("p", {
								className: "text-[11px] text-blue-800",
								children: "Enter any specific words, issues, or viewpoints you want the simulated readers to talk about."
							})
						]
					}),
					/* @__PURE__ */ jsxs("div", { children: [
						/* @__PURE__ */ jsxs("div", {
							className: "flex items-center justify-between mb-1.5",
							children: [/* @__PURE__ */ jsx("label", {
								className: "text-xs font-bold uppercase tracking-wider text-slate-700",
								children: "Sentiment Ratio"
							}), /* @__PURE__ */ jsxs("span", {
								className: "text-xs font-semibold text-slate-600",
								children: [
									/* @__PURE__ */ jsxs("span", {
										className: "text-emerald-600 font-bold",
										children: [aiPositivity, "% Supportive"]
									}),
									" /",
									" ",
									/* @__PURE__ */ jsxs("span", {
										className: "text-amber-600 font-bold",
										children: [100 - aiPositivity, "% Critical / Questioning"]
									})
								]
							})]
						}),
						/* @__PURE__ */ jsx("input", {
							type: "range",
							min: "0",
							max: "100",
							step: "5",
							value: aiPositivity,
							onChange: (e) => setAiPositivity(parseInt(e.target.value)),
							className: "w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "flex justify-between text-[10px] text-slate-400 mt-0.5",
							children: [
								/* @__PURE__ */ jsx("span", { children: "0% (All Critical)" }),
								/* @__PURE__ */ jsx("span", { children: "50% (Balanced)" }),
								/* @__PURE__ */ jsx("span", { children: "100% (All Supportive)" })
							]
						})
					] }),
					/* @__PURE__ */ jsxs("div", {
						className: "rounded-xl border border-amber-200 bg-amber-50/70 p-3.5 flex items-start justify-between gap-3",
						children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("label", {
							onClick: () => setAiAllowSlang(!aiAllowSlang),
							className: "text-xs font-bold text-amber-950 flex items-center gap-1.5 cursor-pointer",
							children: [/* @__PURE__ */ jsx(Flame, { className: "h-4 w-4 text-amber-600 shrink-0" }), "Tripura Street Slang & Sharp Dialect (আঞ্চলিক স্ল্যাং ও ক্ষোভপূর্ণ ভাষা)"]
						}), /* @__PURE__ */ jsxs("p", {
							className: "text-[11px] text-amber-800 mt-0.5 leading-relaxed",
							children: [
								"Allows authentic local expressions in critical comments:",
								" ",
								/* @__PURE__ */ jsx("span", {
									className: "font-medium",
									children: "\"বালের রাস্তা\", \"ফাইজলামি বন্ধ করুক\", \"কিতা অইতাছে\", \"আবাইল্লা\", \"ধুর ছাই\", \"খচ্চর\", \"তেঁড়ামি\""
								}),
								" ",
								"so critical reader reactions sound 100% natural, raw, and realistic."
							]
						})] }), /* @__PURE__ */ jsx("button", {
							type: "button",
							onClick: () => setAiAllowSlang(!aiAllowSlang),
							className: `relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition mt-0.5 ${aiAllowSlang ? "bg-amber-600" : "bg-slate-300"}`,
							children: /* @__PURE__ */ jsx("span", { className: `pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow transition ${aiAllowSlang ? "translate-x-4" : "translate-x-0"}` })
						})]
					}),
					/* @__PURE__ */ jsxs("div", { children: [
						/* @__PURE__ */ jsx("label", {
							className: "mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-700",
							children: "User Public IDs (Optional)"
						}),
						/* @__PURE__ */ jsx("input", {
							type: "text",
							placeholder: "Leave blank for auto-random real users, or enter: 1000000001, 1000000002",
							value: aiPublicUserId,
							onChange: (e) => setAiPublicUserId(e.target.value),
							className: "w-full rounded-lg border border-slate-300 px-3 py-2 text-xs focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
						}),
						/* @__PURE__ */ jsx("p", {
							className: "mt-1 text-[11px] text-slate-500",
							children: "Leave blank to automatically assign comments to random real registered users from your database."
						})
					] }),
					/* @__PURE__ */ jsxs("div", {
						className: "flex items-center justify-end gap-3 pt-3 border-t border-slate-100",
						children: [/* @__PURE__ */ jsx("button", {
							type: "button",
							onClick: onClose,
							className: "rounded-xl px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 transition",
							children: "Cancel"
						}), /* @__PURE__ */ jsx("button", {
							type: "submit",
							disabled: aiGenerating || !aiArticleSlug,
							className: "inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2 text-xs font-semibold text-white hover:bg-blue-700 shadow-md shadow-blue-500/20 disabled:opacity-50 transition active:scale-95",
							children: aiGenerating ? /* @__PURE__ */ jsxs(Fragment, { children: [
								/* @__PURE__ */ jsx("div", { className: "h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" }),
								"Generating ",
								aiCount,
								" Comments..."
							] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
								/* @__PURE__ */ jsx(Sparkles, { className: "h-4 w-4" }),
								" Generate ",
								aiCount,
								" Comments"
							] })
						})]
					})
				]
			})]
		})
	});
}
//#endregion
//#region src/components/admin/comments/DeleteAllModal.tsx
function DeleteAllModal({ isOpen, tab, onClose, onSuccess }) {
	const deleteAllFn = useServerFn(deleteAllCommentsFn);
	const [deletingAll, setDeletingAll] = useState(false);
	if (!isOpen) return null;
	const handleDeleteAll = async () => {
		try {
			setDeletingAll(true);
			await deleteAllFn({ data: { status: tab } });
			toast.success(`All ${tab === "All" ? "" : tab + " "}comments permanently deleted!`);
			onClose();
			onSuccess();
		} catch (err) {
			toast.error(err.message || "Failed to delete comments");
		} finally {
			setDeletingAll(false);
		}
	};
	return /* @__PURE__ */ jsx("div", {
		className: "fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4",
		children: /* @__PURE__ */ jsxs("div", {
			className: "w-full max-w-md rounded-xl bg-white shadow-2xl overflow-hidden",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "flex items-center justify-between border-b border-slate-100 px-6 py-4",
				children: [/* @__PURE__ */ jsxs("h2", {
					className: "text-lg font-bold text-slate-900 flex items-center gap-2",
					children: [/* @__PURE__ */ jsx(Trash2, { className: "h-5 w-5 text-red-600" }), " Delete All Comments"]
				}), /* @__PURE__ */ jsx("button", {
					onClick: onClose,
					className: "text-slate-400 hover:text-slate-600",
					children: /* @__PURE__ */ jsx(X, { className: "h-5 w-5" })
				})]
			}), /* @__PURE__ */ jsxs("div", {
				className: "p-6",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "rounded-lg border border-red-200 bg-red-50 p-4 mb-5",
						children: [/* @__PURE__ */ jsx("p", {
							className: "text-sm font-semibold text-red-800 mb-1",
							children: "⚠️ This action is permanent!"
						}), /* @__PURE__ */ jsx("p", {
							className: "text-sm text-red-700",
							children: tab === "All" ? "All comments will be permanently deleted from the database and cannot be recovered." : `All "${tab}" comments will be permanently deleted and cannot be recovered.`
						})]
					}),
					/* @__PURE__ */ jsxs("p", {
						className: "text-sm text-slate-600 mb-6",
						children: [
							"Currently viewing: ",
							/* @__PURE__ */ jsx("strong", { children: tab }),
							" tab.",
							tab !== "All" && " Only comments in this tab will be deleted."
						]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "flex justify-end gap-3",
						children: [/* @__PURE__ */ jsx("button", {
							onClick: onClose,
							disabled: deletingAll,
							className: "rounded-md px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 disabled:opacity-50",
							children: "Cancel"
						}), /* @__PURE__ */ jsxs("button", {
							onClick: handleDeleteAll,
							disabled: deletingAll,
							className: "inline-flex items-center gap-2 rounded-md bg-red-600 px-5 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50",
							children: [/* @__PURE__ */ jsx(Trash2, { className: "h-4 w-4" }), deletingAll ? "Deleting..." : `Yes, Delete All ${tab === "All" ? "" : tab}`]
						})]
					})
				]
			})]
		})
	});
}
//#endregion
//#region src/routes/admin.comments.tsx?tsr-split=component
var tabs = [
	"All",
	"Pending",
	"Approved",
	"Spam"
];
function CommentsPage() {
	const planType = (useSiteSettings()?.licenseType || "").toLowerCase();
	const isEnterprisePlus = planType.includes("enterprise plus") || planType.includes("enterprise+");
	const getCommentsFn = useServerFn(getAdminComments);
	const updateStatusFn = useServerFn(updateCommentStatus);
	const deleteCommentFn = useServerFn(deleteComment);
	const getAllFn = useServerFn(getAllCommentsFn);
	const importFn = useServerFn(importCommentsFn);
	const [tab, setTab] = useState("All");
	const [rows, setRows] = useState([]);
	const [loading, setLoading] = useState(true);
	const [q, setQ] = useState("");
	const [page, setPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [total, setTotal] = useState(0);
	const [showAiModal, setShowAiModal] = useState(false);
	const [showDeleteAllModal, setShowDeleteAllModal] = useState(false);
	const loadComments = async () => {
		try {
			setLoading(true);
			const res = await getCommentsFn({ data: {
				status: tab,
				q,
				page,
				limit: 20
			} });
			setRows(res.rows);
			setTotalPages(res.totalPages);
			setTotal(res.total);
		} catch (err) {
			toast.error(err.message || "Failed to load comments");
		} finally {
			setLoading(false);
		}
	};
	useEffect(() => {
		loadComments();
	}, [
		tab,
		q,
		page
	]);
	const handleImport = async (data) => {
		try {
			const res = await importFn({ data });
			toast.success(`Successfully imported ${res.inserted} comment${res.inserted !== 1 ? "s" : ""}!`);
			loadComments();
		} catch (err) {
			toast.error(err.message || "Import failed");
		}
	};
	const setStatus = async (id, status) => {
		try {
			await updateStatusFn({ data: {
				id,
				status
			} });
			toast.success(`Comment marked as ${status}`);
			loadComments();
		} catch (err) {
			toast.error(err.message || "Failed to update comment");
		}
	};
	const remove = async (id) => {
		if (!confirm("Delete this comment permanently?")) return;
		try {
			await deleteCommentFn({ data: id });
			toast.success("Comment deleted");
			loadComments();
		} catch (err) {
			toast.error(err.message || "Failed to delete comment");
		}
	};
	return /* @__PURE__ */ jsxs("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "flex items-center justify-between gap-3",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-2.5",
					children: [/* @__PURE__ */ jsx("h1", {
						className: "text-xl sm:text-2xl font-bold tracking-tight",
						children: "Moderation"
					}), /* @__PURE__ */ jsxs("span", {
						className: "inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600",
						children: [total.toLocaleString(), " Total Comments"]
					})]
				}), /* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-1.5 sm:gap-2",
					children: [
						/* @__PURE__ */ jsx(CsvImportExport, {
							data: rows,
							getData: getAllFn,
							filename: "comments",
							onImport: handleImport,
							iconOnly: true
						}),
						isEnterprisePlus && /* @__PURE__ */ jsx("button", {
							onClick: () => setShowAiModal(true),
							title: "AI Generate Comments",
							"aria-label": "AI Generate Comments",
							className: "h-9 w-9 inline-flex items-center justify-center rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition shadow-xs shrink-0",
							children: /* @__PURE__ */ jsx(Sparkles, { className: "h-4 w-4" })
						}),
						/* @__PURE__ */ jsx("button", {
							onClick: () => setShowDeleteAllModal(true),
							title: "Delete All Comments",
							"aria-label": "Delete All Comments",
							className: "h-9 w-9 inline-flex items-center justify-center rounded-lg bg-red-600 text-white hover:bg-red-700 transition shadow-xs shrink-0",
							children: /* @__PURE__ */ jsx(Trash2, { className: "h-4 w-4" })
						})
					]
				})]
			}),
			/* @__PURE__ */ jsx(CommentFilterBar, {
				tabs,
				currentTab: tab,
				onTabChange: (t) => {
					setTab(t);
					setPage(1);
				},
				searchQuery: q,
				onSearchChange: (query) => {
					setQ(query);
					setPage(1);
				}
			}),
			loading ? /* @__PURE__ */ jsx("div", {
				className: "flex justify-center py-12",
				children: /* @__PURE__ */ jsx("div", { className: "h-8 w-8 animate-spin rounded-full border-4 border-slate-900 border-t-transparent" })
			}) : /* @__PURE__ */ jsx(CommentTable, {
				comments: rows,
				onSetStatus: setStatus,
				onDelete: remove
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "flex items-center justify-between border-t border-slate-200 pt-4",
				children: [/* @__PURE__ */ jsxs("p", {
					className: "text-xs text-slate-500",
					children: [
						"Showing ",
						/* @__PURE__ */ jsx("strong", { children: rows.length }),
						" of ",
						/* @__PURE__ */ jsx("strong", { children: total.toLocaleString() }),
						" comment",
						total !== 1 ? "s" : "",
						totalPages > 1 && /* @__PURE__ */ jsxs(Fragment, { children: [
							" — Page ",
							/* @__PURE__ */ jsx("strong", { children: page }),
							" of ",
							/* @__PURE__ */ jsx("strong", { children: totalPages })
						] })
					]
				}), totalPages > 1 && /* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ jsxs("button", {
						onClick: () => setPage((p) => Math.max(1, p - 1)),
						disabled: page <= 1,
						className: "inline-flex items-center gap-1 rounded-md border border-slate-200 px-3 py-1.5 text-xs font-medium hover:bg-slate-50 disabled:opacity-40",
						children: [/* @__PURE__ */ jsx(ChevronLeft, { className: "h-3.5 w-3.5" }), " Previous"]
					}), /* @__PURE__ */ jsxs("button", {
						onClick: () => setPage((p) => Math.min(totalPages, p + 1)),
						disabled: page >= totalPages,
						className: "inline-flex items-center gap-1 rounded-md border border-slate-200 px-3 py-1.5 text-xs font-medium hover:bg-slate-50 disabled:opacity-40",
						children: ["Next ", /* @__PURE__ */ jsx(ChevronRight, { className: "h-3.5 w-3.5" })]
					})]
				})]
			}),
			isEnterprisePlus && /* @__PURE__ */ jsx(AiGenerateModal, {
				isOpen: showAiModal,
				onClose: () => setShowAiModal(false),
				onSuccess: loadComments
			}),
			/* @__PURE__ */ jsx(DeleteAllModal, {
				isOpen: showDeleteAllModal,
				tab,
				onClose: () => setShowDeleteAllModal(false),
				onSuccess: loadComments
			})
		]
	});
}
//#endregion
export { CommentsPage as component };

//# sourceMappingURL=admin.comments-A4qUM5Cq.js.map