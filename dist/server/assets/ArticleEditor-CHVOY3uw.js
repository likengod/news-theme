import { t as useServerFn } from "./useServerFn-BqzygRuj.js";
import { d as loadFontConfig } from "./font-config-DFYeQrx9.js";
import { a as useSiteSettings, r as useCategories } from "./AdSettingsContext-CIGhPA32.js";
import { o as slugify } from "./news-data-CiXcY3JG.js";
import { a as getTags, r as getCategories } from "./taxonomy.functions-DaFmoSYB.js";
import { t as generateArticleContentServer } from "./ai.functions-COC8zAf4.js";
import { o as searchJournalists, t as awardJournalistPoints } from "./journalist.functions-Bwo5RA4P.js";
import { n as MediaField } from "./MediaField-ac2YATYo.js";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { AlignCenter, AlignJustify, AlignLeft, AlignRight, BadgeCheck, Bold, Building2, CalendarClock, Camera, Check, ChevronDown, Clock, Code2, Coins, Edit3, Facebook, FileText, Globe, Heading2, Heading3, Heading4, Highlighter, Image, Info, Italic, Link, Link2, List, ListOrdered, Loader2, Lock, MapPin, Maximize2, Minimize2, Minus, Pipette, Plus, Quote, Redo, RemoveFormatting, Search, Send, Settings, Share2, Sparkles, Star, Strikethrough, Subscript, Superscript, Table, Tag, Underline, Undo, Unlink, Upload, UserCheck, Video, Wallet, X, Youtube } from "lucide-react";
import { toast } from "sonner";
//#region src/components/admin/articles/types.ts
var statusStyle = {
	Published: "bg-emerald-50 text-emerald-700 border-emerald-200",
	Draft: "bg-slate-100 text-slate-700 border-slate-200",
	Review: "bg-amber-50 text-amber-700 border-amber-200",
	Trash: "bg-rose-50 text-rose-700 border-rose-200",
	Scheduled: "bg-blue-50 text-blue-700 border-blue-200"
};
var getDomain = () => {
	if (typeof window !== "undefined") return window.location.host;
	return "northeasttimeline.com";
};
var fullUrl = (r) => {
	return [
		getDomain(),
		"news",
		r.slug || slugify(r.title) || "news-title"
	].filter(Boolean).join("/");
};
var formatDateTimeLocal = (dateVal) => {
	const getNowLocal = () => {
		const now = /* @__PURE__ */ new Date();
		const pad = (n) => String(n).padStart(2, "0");
		return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(now.getMinutes())}`;
	};
	if (!dateVal) return getNowLocal();
	try {
		if (typeof dateVal === "string") {
			const s = dateVal.trim();
			if (!s) return getNowLocal();
			if (/^\d{4}-\d{2}-\d{2}$/.test(s)) {
				const now = /* @__PURE__ */ new Date();
				const pad = (n) => String(n).padStart(2, "0");
				return `${s}T${pad(now.getHours())}:${pad(now.getMinutes())}`;
			}
			if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(s)) return s;
			if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}/.test(s)) return s.slice(0, 16).replace(" ", "T");
			const d = new Date(s);
			if (!isNaN(d.getTime())) {
				const pad = (n) => String(n).padStart(2, "0");
				return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
			}
			return s.slice(0, 16).replace(" ", "T");
		}
		if (dateVal instanceof Date && !isNaN(dateVal.getTime())) {
			const pad = (n) => String(n).padStart(2, "0");
			return `${dateVal.getFullYear()}-${pad(dateVal.getMonth() + 1)}-${pad(dateVal.getDate())}T${pad(dateVal.getHours())}:${pad(dateVal.getMinutes())}`;
		}
	} catch (e) {
		console.error("formatDateTimeLocal error:", e);
	}
	return getNowLocal();
};
//#endregion
//#region src/components/admin/articles/AiArticleModal.tsx
function AiArticleModal({ isOpen, onClose, onApply, isEnterprise }) {
	const [aiInstructions, setAiInstructions] = useState("");
	const [aiStyle, setAiStyle] = useState("Normal");
	const [isGeneratingAi, setIsGeneratingAi] = useState(false);
	const [generatedAiData, setGeneratedAiData] = useState(null);
	if (!isOpen) return null;
	const handleGenerateAi = async () => {
		if (!aiInstructions.trim()) {
			toast.error("Please enter news instructions.");
			return;
		}
		setIsGeneratingAi(true);
		setGeneratedAiData(null);
		try {
			const tagNames = (await getTags()).map((t) => t.name);
			setGeneratedAiData(await generateArticleContentServer({ data: {
				instructions: aiInstructions,
				style: isEnterprise ? aiStyle : "Normal",
				availableTags: tagNames
			} }));
			toast.success("Content generated! Please review.");
		} catch (err) {
			toast.error(err.message || "Failed to generate AI content.");
		} finally {
			setIsGeneratingAi(false);
		}
	};
	const handleApply = () => {
		if (!generatedAiData) return;
		onApply(generatedAiData);
	};
	return /* @__PURE__ */ jsx("div", {
		className: "fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm",
		children: /* @__PURE__ */ jsxs("div", {
			className: "w-full max-w-3xl rounded-2xl bg-white p-6 shadow-2xl flex flex-col max-h-[90vh]",
			children: [
				/* @__PURE__ */ jsxs("div", {
					className: "flex items-center justify-between mb-4 border-b border-slate-100 pb-4",
					children: [/* @__PURE__ */ jsxs("h3", {
						className: "text-xl font-bold flex items-center gap-2 text-indigo-900",
						children: [/* @__PURE__ */ jsx(Sparkles, { className: "h-5 w-5 text-indigo-600" }), " AI News Assistant"]
					}), /* @__PURE__ */ jsx("button", {
						onClick: onClose,
						className: "text-slate-400 hover:text-slate-600 text-xl font-bold p-2",
						children: "×"
					})]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "space-y-4 overflow-y-auto flex-1 pr-2",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "bg-slate-50 p-4 rounded-xl border border-slate-100",
						children: [
							/* @__PURE__ */ jsxs("div", {
								className: "grid grid-cols-1 md:grid-cols-[1fr_200px] gap-4 mb-4",
								children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
									className: "mb-1 block text-sm font-bold text-slate-700",
									children: "News Info / Instructions"
								}), /* @__PURE__ */ jsx("p", {
									className: "mb-2 text-xs text-slate-500",
									children: "Provide the facts. The AI will write the article using the 5 Ws and H rule."
								})] }), /* @__PURE__ */ jsxs("div", { children: [
									/* @__PURE__ */ jsxs("div", {
										className: "mb-1 flex items-center justify-between",
										children: [/* @__PURE__ */ jsx("label", {
											className: "text-sm font-bold text-slate-700",
											children: "Writing Style"
										}), !isEnterprise && /* @__PURE__ */ jsxs("span", {
											className: "inline-flex items-center gap-1 rounded-full bg-amber-50 border border-amber-200 px-2 py-0.5 text-[10px] font-semibold text-amber-700",
											children: [/* @__PURE__ */ jsx(Lock, { className: "h-2.5 w-2.5" }), " Enterprise"]
										})]
									}),
									/* @__PURE__ */ jsxs("select", {
										value: isEnterprise ? aiStyle : "Normal",
										onChange: (e) => isEnterprise && setAiStyle(e.target.value),
										disabled: !isEnterprise,
										className: `w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none transition-colors ${!isEnterprise ? "bg-slate-100 text-slate-500 cursor-not-allowed opacity-80" : "bg-white text-slate-800"}`,
										title: !isEnterprise ? "Enterprise or Enterprise+ license required to customize writing style" : void 0,
										children: [
											/* @__PURE__ */ jsx("option", {
												value: "Normal",
												children: "Normal"
											}),
											/* @__PURE__ */ jsx("option", {
												value: "Corporate",
												children: "Corporate"
											}),
											/* @__PURE__ */ jsx("option", {
												value: "Business",
												children: "Business"
											}),
											/* @__PURE__ */ jsx("option", {
												value: "Friendly",
												children: "Friendly"
											}),
											/* @__PURE__ */ jsx("option", {
												value: "5 ws",
												children: "5 ws"
											})
										]
									}),
									!isEnterprise && /* @__PURE__ */ jsx("p", {
										className: "mt-1 text-[11px] text-amber-600",
										children: "Enterprise or Enterprise+ license required to customize writing styles."
									})
								] })]
							}),
							/* @__PURE__ */ jsx("textarea", {
								placeholder: "e.g. A new tech park opened in Agartala today. The IT minister inaugurated it. It will create 5000 jobs...",
								value: aiInstructions,
								onChange: (e) => setAiInstructions(e.target.value),
								rows: 4,
								className: "w-full rounded-lg border border-slate-300 p-3 text-sm focus:border-indigo-500 focus:outline-none mb-3"
							}),
							/* @__PURE__ */ jsx("div", {
								className: "flex justify-end",
								children: /* @__PURE__ */ jsx("button", {
									onClick: handleGenerateAi,
									disabled: isGeneratingAi,
									className: "px-6 py-2 rounded-lg bg-indigo-600 text-white text-sm font-bold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2",
									children: isGeneratingAi ? /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(Loader2, { className: "h-4 w-4 animate-spin" }), " Generating Article..."] }) : "Generate Article"
								})
							})
						]
					}), generatedAiData && /* @__PURE__ */ jsxs("div", {
						className: "mt-4 pt-4 border-t border-slate-200",
						children: [
							/* @__PURE__ */ jsx("h4", {
								className: "font-bold text-slate-800 mb-3",
								children: "Generated Preview"
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "grid grid-cols-1 md:grid-cols-2 gap-4 mb-4",
								children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
									className: "block text-xs font-bold text-slate-500",
									children: "Meta Title"
								}), /* @__PURE__ */ jsx("div", {
									className: "text-sm bg-slate-50 p-2 rounded border border-slate-200",
									children: generatedAiData.metaTitle
								})] }), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
									className: "block text-xs font-bold text-slate-500",
									children: "Location"
								}), /* @__PURE__ */ jsx("div", {
									className: "text-sm bg-slate-50 p-2 rounded border border-slate-200",
									children: [
										generatedAiData.location?.city,
										generatedAiData.location?.state,
										generatedAiData.location?.country
									].filter(Boolean).join(", ") || "N/A"
								})] })]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "mb-4",
								children: [/* @__PURE__ */ jsx("label", {
									className: "block text-xs font-bold text-slate-500",
									children: "Excerpt"
								}), /* @__PURE__ */ jsx("div", {
									className: "text-sm bg-slate-50 p-2 rounded border border-slate-200",
									children: generatedAiData.excerpt
								})]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "mb-4",
								children: [/* @__PURE__ */ jsx("label", {
									className: "block text-xs font-bold text-slate-500",
									children: "Tags Selected"
								}), /* @__PURE__ */ jsx("div", {
									className: "flex flex-wrap gap-1 mt-1",
									children: generatedAiData.tags?.map((t) => /* @__PURE__ */ jsx("span", {
										className: "bg-slate-200 text-slate-700 px-2 py-0.5 rounded text-xs",
										children: t
									}, t))
								})]
							}),
							/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
								className: "block text-xs font-bold text-slate-500 mb-1",
								children: "Body Preview (HTML)"
							}), /* @__PURE__ */ jsx("div", {
								className: "h-40 overflow-y-auto bg-slate-50 p-3 rounded border border-slate-200 text-xs font-mono whitespace-pre-wrap",
								children: generatedAiData.body
							})] })
						]
					})]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "mt-6 flex justify-end gap-3 pt-4 border-t border-slate-100",
					children: [/* @__PURE__ */ jsx("button", {
						onClick: onClose,
						className: "rounded-lg px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-100",
						children: "Cancel"
					}), /* @__PURE__ */ jsx("button", {
						onClick: handleApply,
						disabled: !generatedAiData,
						className: "rounded-lg bg-indigo-600 px-6 py-2 text-sm font-bold text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2",
						children: "Apply to Article"
					})]
				})
			]
		})
	});
}
//#endregion
//#region src/components/admin/articles/RichEditor/ImageUpload.tsx
function ImageUpload({ imgRef, uploadImage }) {
	return /* @__PURE__ */ jsx("input", {
		ref: imgRef,
		type: "file",
		accept: "image/*",
		hidden: true,
		onChange: (e) => {
			uploadImage(e.target.files?.[0]);
			if (imgRef.current) imgRef.current.value = "";
		}
	});
}
//#endregion
//#region src/components/admin/articles/RichEditor/Toolbar.tsx
function Toolbar({ mode, setMode, exec, formatBlock, setFontFamily, setFontSize, fontOptions, currentSize, sizes, applyTextColor, applyHighlightColor, insertHTML, insertImage, imgRef, uploadImage, insertYouTube, insertFacebook, insertVideoUrl, insertLink, unlink, clearFormatting, insertDivider, insertQuote, insertTable, isFullscreen, setIsFullscreen, words, saveSelection, emit, textColorOpen, setTextColorOpen, highlightOpen, setHighlightOpen, activeTextColor, activeHighlightColor, textColorRef, highlightRef, TEXT_PALETTE_ROWS, HIGHLIGHT_PALETTE_ROWS, Btn, Sep }) {
	return /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsxs("div", {
		className: "flex flex-wrap items-center gap-0.5 border-b border-slate-200 bg-slate-50/90 px-2 py-1.5",
		onMouseDown: (e) => {
			if (e.target.tagName !== "SELECT") e.preventDefault();
			saveSelection();
		},
		children: [
			/* @__PURE__ */ jsx(Btn, {
				onClick: () => exec("undo"),
				title: "Undo (Ctrl+Z)",
				disabled: mode === "plain",
				children: /* @__PURE__ */ jsx(Undo, { className: "h-4 w-4" })
			}),
			/* @__PURE__ */ jsx(Btn, {
				onClick: () => exec("redo"),
				title: "Redo (Ctrl+Y)",
				disabled: mode === "plain",
				children: /* @__PURE__ */ jsx(Redo, { className: "h-4 w-4" })
			}),
			/* @__PURE__ */ jsx(Sep, {}),
			/* @__PURE__ */ jsx(Btn, {
				onClick: () => formatBlock("p"),
				title: "Paragraph (P) - Normal body text (14px)",
				disabled: mode === "plain",
				children: /* @__PURE__ */ jsx("span", {
					className: "font-bold text-sm leading-none text-slate-800",
					children: "P"
				})
			}),
			/* @__PURE__ */ jsx(Btn, {
				onClick: () => formatBlock("h2"),
				title: "Heading 2 (H2)",
				disabled: mode === "plain",
				children: /* @__PURE__ */ jsx(Heading2, { className: "h-4 w-4" })
			}),
			/* @__PURE__ */ jsx(Btn, {
				onClick: () => formatBlock("h3"),
				title: "Heading 3 (H3)",
				disabled: mode === "plain",
				children: /* @__PURE__ */ jsx(Heading3, { className: "h-4 w-4" })
			}),
			/* @__PURE__ */ jsx(Btn, {
				onClick: () => formatBlock("h4"),
				title: "Heading 4 (H4)",
				disabled: mode === "plain",
				children: /* @__PURE__ */ jsx(Heading4, { className: "h-4 w-4" })
			}),
			/* @__PURE__ */ jsx(Sep, {}),
			/* @__PURE__ */ jsx("select", {
				onFocus: saveSelection,
				onMouseDown: saveSelection,
				onChange: (e) => {
					setFontFamily(e.target.value);
					e.target.value = "Default";
				},
				title: "Font family",
				disabled: mode === "plain",
				className: "h-8 rounded border border-slate-200 bg-white px-2 text-xs font-medium text-slate-700 outline-none hover:border-slate-300 disabled:opacity-35 cursor-pointer",
				children: fontOptions.map((f) => /* @__PURE__ */ jsx("option", {
					value: f,
					children: f
				}, f))
			}),
			/* @__PURE__ */ jsx("select", {
				value: currentSize,
				onFocus: saveSelection,
				onMouseDown: saveSelection,
				onChange: (e) => {
					setFontSize(e.target.value);
				},
				title: "Font size (Default: 14px)",
				disabled: mode === "plain",
				className: "h-8 rounded border border-slate-200 bg-white px-2 text-xs font-medium text-slate-700 outline-none hover:border-slate-300 disabled:opacity-35 cursor-pointer",
				children: sizes.map((s) => /* @__PURE__ */ jsx("option", {
					value: s,
					children: s === "14" ? "14px (Default)" : `${s}px`
				}, s))
			}),
			/* @__PURE__ */ jsx(Sep, {}),
			/* @__PURE__ */ jsx(Btn, {
				onClick: () => exec("bold"),
				title: "Bold (Ctrl+B)",
				disabled: mode === "plain",
				children: /* @__PURE__ */ jsx(Bold, { className: "h-4 w-4" })
			}),
			/* @__PURE__ */ jsx(Btn, {
				onClick: () => exec("italic"),
				title: "Italic (Ctrl+I)",
				disabled: mode === "plain",
				children: /* @__PURE__ */ jsx(Italic, { className: "h-4 w-4" })
			}),
			/* @__PURE__ */ jsx(Btn, {
				onClick: () => exec("underline"),
				title: "Underline (Ctrl+U)",
				disabled: mode === "plain",
				children: /* @__PURE__ */ jsx(Underline, { className: "h-4 w-4" })
			}),
			/* @__PURE__ */ jsx(Btn, {
				onClick: () => exec("strikeThrough"),
				title: "Strikethrough",
				disabled: mode === "plain",
				children: /* @__PURE__ */ jsx(Strikethrough, { className: "h-4 w-4" })
			}),
			/* @__PURE__ */ jsx(Btn, {
				onClick: () => exec("subscript"),
				title: "Subscript",
				disabled: mode === "plain",
				children: /* @__PURE__ */ jsx(Subscript, { className: "h-4 w-4" })
			}),
			/* @__PURE__ */ jsx(Btn, {
				onClick: () => exec("superscript"),
				title: "Superscript",
				disabled: mode === "plain",
				children: /* @__PURE__ */ jsx(Superscript, { className: "h-4 w-4" })
			}),
			/* @__PURE__ */ jsx(Btn, {
				onClick: clearFormatting,
				title: "Clear formatting & remove links / Reset to default text (14px)",
				disabled: mode === "plain",
				children: /* @__PURE__ */ jsx(RemoveFormatting, { className: "h-4 w-4 text-rose-600" })
			}),
			/* @__PURE__ */ jsx(Btn, {
				onClick: () => insertHTML(`<code style="background:#f1f5f9;padding:2px 6px;border-radius:4px;font-family:monospace">code</code>`),
				title: "Inline code",
				disabled: mode === "plain",
				children: /* @__PURE__ */ jsx(Code2, { className: "h-4 w-4" })
			}),
			/* @__PURE__ */ jsx(Sep, {}),
			/* @__PURE__ */ jsxs("div", {
				className: "relative",
				ref: textColorRef,
				children: [/* @__PURE__ */ jsxs("button", {
					type: "button",
					disabled: mode === "plain",
					onMouseDown: (e) => {
						e.preventDefault();
						saveSelection();
						setTextColorOpen((prev) => !prev);
						setHighlightOpen(false);
					},
					title: "Text Color",
					className: `flex h-8 items-center gap-1 rounded px-1.5 text-slate-700 hover:bg-slate-200 disabled:opacity-35 transition-colors ${textColorOpen ? "bg-slate-200 ring-1 ring-slate-400" : ""}`,
					children: [/* @__PURE__ */ jsxs("div", {
						className: "flex flex-col items-center",
						children: [/* @__PURE__ */ jsx("span", {
							className: "font-serif font-black text-sm leading-none text-slate-900",
							children: "A"
						}), /* @__PURE__ */ jsx("span", {
							className: "mt-0.5 h-1 w-4 rounded-full",
							style: { backgroundColor: activeTextColor }
						})]
					}), /* @__PURE__ */ jsx(ChevronDown, { className: "h-3 w-3 text-slate-500" })]
				}), textColorOpen && /* @__PURE__ */ jsxs("div", {
					className: "absolute left-0 top-full z-50 mt-1.5 w-64 rounded-lg border border-slate-200 bg-white p-3 shadow-xl",
					onMouseDown: (e) => e.stopPropagation(),
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "mb-2 flex items-center justify-between border-b border-slate-100 pb-1.5",
							children: [/* @__PURE__ */ jsx("span", {
								className: "text-xs font-semibold text-slate-700",
								children: "Text Color"
							}), /* @__PURE__ */ jsx("button", {
								type: "button",
								onClick: () => applyTextColor("#1A1110"),
								className: "rounded px-1.5 py-0.5 text-[11px] font-medium text-slate-500 hover:bg-slate-100 hover:text-slate-900",
								children: "Reset default"
							})]
						}),
						/* @__PURE__ */ jsx("div", {
							className: "space-y-1",
							children: TEXT_PALETTE_ROWS.map((row, rIdx) => /* @__PURE__ */ jsx("div", {
								className: "flex gap-1 justify-between",
								children: row.map((c) => /* @__PURE__ */ jsx("button", {
									type: "button",
									title: c,
									onClick: () => applyTextColor(c),
									className: "h-5 w-5 rounded border border-slate-300 transition-transform hover:scale-125 hover:z-10 shadow-xs",
									style: { backgroundColor: c }
								}, c))
							}, rIdx))
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "mt-3 flex items-center justify-between border-t border-slate-100 pt-2 text-xs",
							children: [/* @__PURE__ */ jsx("span", {
								className: "font-medium text-slate-600",
								children: "Custom color"
							}), /* @__PURE__ */ jsxs("label", {
								className: "flex cursor-pointer items-center gap-1.5 rounded border border-slate-200 px-2 py-1 hover:bg-slate-50 transition-colors",
								children: [
									/* @__PURE__ */ jsx(Pipette, { className: "h-3.5 w-3.5 text-slate-500" }),
									/* @__PURE__ */ jsx("span", {
										className: "text-[11px] font-medium text-slate-600",
										children: "Pick any"
									}),
									/* @__PURE__ */ jsx("input", {
										type: "color",
										className: "sr-only",
										onChange: (e) => applyTextColor(e.target.value)
									})
								]
							})]
						})
					]
				})]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "relative",
				ref: highlightRef,
				children: [/* @__PURE__ */ jsxs("button", {
					type: "button",
					disabled: mode === "plain",
					onMouseDown: (e) => {
						e.preventDefault();
						saveSelection();
						setHighlightOpen((prev) => !prev);
						setTextColorOpen(false);
					},
					title: "Highlight / Background Color",
					className: `flex h-8 items-center gap-1 rounded px-1.5 text-slate-700 hover:bg-slate-200 disabled:opacity-35 transition-colors ${highlightOpen ? "bg-slate-200 ring-1 ring-slate-400" : ""}`,
					children: [/* @__PURE__ */ jsxs("div", {
						className: "flex flex-col items-center",
						children: [/* @__PURE__ */ jsx(Highlighter, { className: "h-4 w-4 text-amber-600" }), /* @__PURE__ */ jsx("span", {
							className: "mt-0.5 h-1 w-4 rounded-full border border-slate-300",
							style: { backgroundColor: activeHighlightColor === "transparent" ? "#ffffff" : activeHighlightColor }
						})]
					}), /* @__PURE__ */ jsx(ChevronDown, { className: "h-3 w-3 text-slate-500" })]
				}), highlightOpen && /* @__PURE__ */ jsxs("div", {
					className: "absolute left-0 top-full z-50 mt-1.5 w-60 rounded-lg border border-slate-200 bg-white p-3 shadow-xl",
					onMouseDown: (e) => e.stopPropagation(),
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "mb-2 flex items-center justify-between border-b border-slate-100 pb-1.5",
							children: [/* @__PURE__ */ jsx("span", {
								className: "text-xs font-semibold text-slate-700",
								children: "Highlight Marker"
							}), /* @__PURE__ */ jsx("button", {
								type: "button",
								onClick: () => applyHighlightColor("transparent"),
								className: "rounded px-1.5 py-0.5 text-[11px] font-medium text-rose-600 hover:bg-rose-50",
								children: "✕ Clear highlight"
							})]
						}),
						/* @__PURE__ */ jsx("div", {
							className: "space-y-1",
							children: HIGHLIGHT_PALETTE_ROWS.map((row, rIdx) => /* @__PURE__ */ jsx("div", {
								className: "flex gap-1 justify-between",
								children: row.map((c) => /* @__PURE__ */ jsx("button", {
									type: "button",
									title: c,
									onClick: () => applyHighlightColor(c),
									className: "h-5 flex-1 rounded border border-slate-300 transition-transform hover:scale-110 shadow-xs",
									style: { backgroundColor: c }
								}, c))
							}, rIdx))
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "mt-3 flex items-center justify-between border-t border-slate-100 pt-2 text-xs",
							children: [/* @__PURE__ */ jsx("span", {
								className: "font-medium text-slate-600",
								children: "Custom marker"
							}), /* @__PURE__ */ jsxs("label", {
								className: "flex cursor-pointer items-center gap-1.5 rounded border border-slate-200 px-2 py-1 hover:bg-slate-50 transition-colors",
								children: [
									/* @__PURE__ */ jsx(Pipette, { className: "h-3.5 w-3.5 text-slate-500" }),
									/* @__PURE__ */ jsx("span", {
										className: "text-[11px] font-medium text-slate-600",
										children: "Pick any"
									}),
									/* @__PURE__ */ jsx("input", {
										type: "color",
										className: "sr-only",
										onChange: (e) => applyHighlightColor(e.target.value)
									})
								]
							})]
						})
					]
				})]
			})
		]
	}), /* @__PURE__ */ jsxs("div", {
		className: "flex flex-wrap items-center gap-0.5 border-b border-slate-200 bg-slate-50/60 px-2 py-1.5",
		onMouseDown: (e) => {
			e.preventDefault();
			saveSelection();
		},
		children: [
			/* @__PURE__ */ jsx(Btn, {
				onClick: () => exec("justifyLeft"),
				title: "Align left",
				disabled: mode === "plain",
				children: /* @__PURE__ */ jsx(AlignLeft, { className: "h-4 w-4" })
			}),
			/* @__PURE__ */ jsx(Btn, {
				onClick: () => exec("justifyCenter"),
				title: "Align center",
				disabled: mode === "plain",
				children: /* @__PURE__ */ jsx(AlignCenter, { className: "h-4 w-4" })
			}),
			/* @__PURE__ */ jsx(Btn, {
				onClick: () => exec("justifyRight"),
				title: "Align right",
				disabled: mode === "plain",
				children: /* @__PURE__ */ jsx(AlignRight, { className: "h-4 w-4" })
			}),
			/* @__PURE__ */ jsx(Btn, {
				onClick: () => exec("justifyFull"),
				title: "Justify full",
				disabled: mode === "plain",
				children: /* @__PURE__ */ jsx(AlignJustify, { className: "h-4 w-4" })
			}),
			/* @__PURE__ */ jsx(Sep, {}),
			/* @__PURE__ */ jsx(Btn, {
				onClick: () => exec("insertUnorderedList"),
				title: "Bullet list",
				disabled: mode === "plain",
				children: /* @__PURE__ */ jsx(List, { className: "h-4 w-4" })
			}),
			/* @__PURE__ */ jsx(Btn, {
				onClick: () => exec("insertOrderedList"),
				title: "Numbered list",
				disabled: mode === "plain",
				children: /* @__PURE__ */ jsx(ListOrdered, { className: "h-4 w-4" })
			}),
			/* @__PURE__ */ jsx(Btn, {
				onClick: insertQuote,
				title: "Blockquote",
				disabled: mode === "plain",
				children: /* @__PURE__ */ jsx(Quote, { className: "h-4 w-4" })
			}),
			/* @__PURE__ */ jsx(Btn, {
				onClick: insertDivider,
				title: "Horizontal divider line",
				disabled: mode === "plain",
				children: /* @__PURE__ */ jsx(Minus, { className: "h-4 w-4" })
			}),
			/* @__PURE__ */ jsx(Btn, {
				onClick: insertLink,
				title: "Insert / edit link",
				disabled: mode === "plain",
				children: /* @__PURE__ */ jsx(Link2, { className: "h-4 w-4" })
			}),
			/* @__PURE__ */ jsx(Btn, {
				onClick: unlink,
				title: "Remove link / Unlink",
				disabled: mode === "plain",
				children: /* @__PURE__ */ jsx(Unlink, { className: "h-4 w-4 text-slate-600" })
			}),
			/* @__PURE__ */ jsx(Btn, {
				onClick: insertTable,
				title: "Insert Table",
				disabled: mode === "plain",
				children: /* @__PURE__ */ jsx(Table, { className: "h-4 w-4" })
			}),
			/* @__PURE__ */ jsx(Sep, {}),
			/* @__PURE__ */ jsx(Btn, {
				onClick: insertImage,
				title: "Insert image by URL",
				disabled: mode === "plain",
				children: /* @__PURE__ */ jsx(Image, { className: "h-4 w-4" })
			}),
			/* @__PURE__ */ jsx(Btn, {
				onClick: () => imgRef.current?.click(),
				title: "Upload image from computer",
				disabled: mode === "plain",
				children: /* @__PURE__ */ jsx(Upload, { className: "h-4 w-4" })
			}),
			/* @__PURE__ */ jsx(ImageUpload, {
				imgRef,
				uploadImage
			}),
			/* @__PURE__ */ jsx(Btn, {
				onClick: insertYouTube,
				title: "Embed YouTube video",
				disabled: mode === "plain",
				children: /* @__PURE__ */ jsx(Youtube, { className: "h-4 w-4 text-red-600" })
			}),
			/* @__PURE__ */ jsx(Btn, {
				onClick: insertFacebook,
				title: "Embed Facebook video",
				disabled: mode === "plain",
				children: /* @__PURE__ */ jsx(Facebook, { className: "h-4 w-4 text-blue-600" })
			}),
			/* @__PURE__ */ jsx(Btn, {
				onClick: insertVideoUrl,
				title: "Embed video file (.mp4, .webm)",
				disabled: mode === "plain",
				children: /* @__PURE__ */ jsx(Video, { className: "h-4 w-4" })
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "ml-auto flex items-center gap-2 pr-1",
				children: [
					/* @__PURE__ */ jsx(Btn, {
						onClick: () => setIsFullscreen(!isFullscreen),
						title: isFullscreen ? "Exit Fullscreen" : "Fullscreen editor",
						children: isFullscreen ? /* @__PURE__ */ jsx(Minimize2, { className: "h-4 w-4 text-blue-600" }) : /* @__PURE__ */ jsx(Maximize2, { className: "h-4 w-4" })
					}),
					/* @__PURE__ */ jsxs("span", {
						className: "text-xs font-medium text-slate-500",
						children: [words, " words"]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "inline-flex rounded-md border border-slate-300 bg-slate-100 p-0.5 text-xs font-medium",
						children: [/* @__PURE__ */ jsx("button", {
							type: "button",
							onClick: () => setMode("visual"),
							className: `rounded px-2.5 py-1 transition-colors ${mode === "visual" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"}`,
							children: "Visual"
						}), /* @__PURE__ */ jsxs("button", {
							type: "button",
							onClick: () => {
								emit();
								setMode("plain");
							},
							className: `flex items-center gap-1 rounded px-2.5 py-1 transition-colors ${mode === "plain" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"}`,
							children: [/* @__PURE__ */ jsx(FileText, { className: "h-3 w-3" }), "Plain Text"]
						})]
					})
				]
			})
		]
	})] });
}
//#endregion
//#region src/components/admin/articles/RichEditor/BubbleMenu.tsx
function BubbleMenu() {
	return null;
}
function FloatingMenu() {
	return null;
}
//#endregion
//#region src/components/admin/articles/RichEditor/editorConstants.ts
var TEXT_PALETTE_ROWS = [
	[
		"#000000",
		"#1e293b",
		"#334155",
		"#475569",
		"#64748b",
		"#94a3b8",
		"#cbd5e1",
		"#ffffff"
	],
	[
		"#450a0a",
		"#7f1d1d",
		"#991b1b",
		"#b91c1c",
		"#dc2626",
		"#ef4444",
		"#f87171",
		"#fca5a5"
	],
	[
		"#431407",
		"#7c2d12",
		"#9a3412",
		"#c2410c",
		"#ea580c",
		"#f97316",
		"#fb923c",
		"#fdba74"
	],
	[
		"#422006",
		"#713f12",
		"#854d0e",
		"#a16207",
		"#ca8a04",
		"#eab308",
		"#facc15",
		"#fef08a"
	],
	[
		"#052e16",
		"#14532d",
		"#166534",
		"#15803d",
		"#16a34a",
		"#22c55e",
		"#4ade80",
		"#86efac"
	],
	[
		"#042f2e",
		"#134e4a",
		"#115e59",
		"#0f766e",
		"#0d9488",
		"#14b8a6",
		"#2dd4bf",
		"#5eead4"
	],
	[
		"#172554",
		"#1e3a8a",
		"#1e40af",
		"#1d4ed8",
		"#2563eb",
		"#3b82f6",
		"#60a5fa",
		"#93c5fd"
	],
	[
		"#3b0764",
		"#581c87",
		"#6b21a8",
		"#7e22ce",
		"#9333ea",
		"#a855f7",
		"#c084fc",
		"#e9d5ff"
	]
];
var HIGHLIGHT_PALETTE_ROWS = [
	[
		"#fef08a",
		"#fde047",
		"#facc15",
		"#eab308"
	],
	[
		"#bbf7d0",
		"#86efac",
		"#4ade80",
		"#22c55e"
	],
	[
		"#bae6fd",
		"#7dd3fc",
		"#38bdf8",
		"#0ea5e9"
	],
	[
		"#fbcfe8",
		"#f472b6",
		"#ec4899",
		"#db2777"
	],
	[
		"#fed7aa",
		"#fdba74",
		"#fb923c",
		"#f97316"
	],
	[
		"#e9d5ff",
		"#d8b4fe",
		"#c084fc",
		"#a855f7"
	],
	[
		"#f1f5f9",
		"#e2e8f0",
		"#cbd5e1",
		"#94a3b8"
	]
];
var FONT_SIZES = [
	"12",
	"14",
	"16",
	"18",
	"20",
	"24",
	"28",
	"32",
	"36"
];
function escapeHtml(str) {
	return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}
function createTableHtml() {
	return `
    <table style="width:100%;border-collapse:collapse;margin:16px 0;border:1px solid #cbd5e1;font-size:14px">
      <thead>
        <tr style="background:#f8fafc">
          <th style="border:1px solid #cbd5e1;padding:8px 12px;text-align:left;font-weight:600">Header 1</th>
          <th style="border:1px solid #cbd5e1;padding:8px 12px;text-align:left;font-weight:600">Header 2</th>
          <th style="border:1px solid #cbd5e1;padding:8px 12px;text-align:left;font-weight:600">Header 3</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td style="border:1px solid #cbd5e1;padding:8px 12px">Row 1, Cell 1</td>
          <td style="border:1px solid #cbd5e1;padding:8px 12px">Row 1, Cell 2</td>
          <td style="border:1px solid #cbd5e1;padding:8px 12px">Row 1, Cell 3</td>
        </tr>
        <tr>
          <td style="border:1px solid #cbd5e1;padding:8px 12px">Row 2, Cell 1</td>
          <td style="border:1px solid #cbd5e1;padding:8px 12px">Row 2, Cell 2</td>
          <td style="border:1px solid #cbd5e1;padding:8px 12px">Row 2, Cell 3</td>
        </tr>
      </tbody>
    </table>
    <p><br/></p>
  `;
}
//#endregion
//#region src/components/admin/articles/RichEditor/useRichEditorSelection.ts
function useRichEditorSelection({ ref, lastHtml, onChange, setCurrentSize }) {
	const savedSelection = useRef(null);
	const emit = () => {
		if (!ref.current) return;
		const html = ref.current.innerHTML;
		lastHtml.current = html;
		onChange(html);
	};
	const focus = () => ref.current?.focus();
	const isEditorNode = (node) => {
		if (!node || !ref.current) return false;
		return ref.current === node || ref.current.contains(node);
	};
	const saveSelection = () => {
		const sel = window.getSelection();
		if (!sel || sel.rangeCount === 0 || !ref.current) return;
		try {
			const range = sel.getRangeAt(0);
			if (isEditorNode(range.commonAncestorContainer) || isEditorNode(range.startContainer) || isEditorNode(range.endContainer) || range.commonAncestorContainer && range.commonAncestorContainer.contains(ref.current)) if (!isEditorNode(range.commonAncestorContainer)) {
				const clamped = document.createRange();
				clamped.selectNodeContents(ref.current);
				savedSelection.current = clamped;
			} else savedSelection.current = range.cloneRange();
		} catch {}
	};
	const restoreSelection = () => {
		focus();
		const sel = window.getSelection();
		if (!sel || !ref.current) return;
		if (savedSelection.current) try {
			sel.removeAllRanges();
			sel.addRange(savedSelection.current);
			return;
		} catch {}
		const range = document.createRange();
		range.selectNodeContents(ref.current);
		sel.removeAllRanges();
		sel.addRange(range);
		savedSelection.current = range.cloneRange();
	};
	const exec = (cmd, val) => {
		restoreSelection();
		document.execCommand(cmd, false, val);
		emit();
		saveSelection();
	};
	const formatBlock = (tag) => {
		restoreSelection();
		try {
			if (!document.execCommand("formatBlock", false, `<${tag}>`)) document.execCommand("formatBlock", false, tag);
		} catch {
			document.execCommand("formatBlock", false, tag);
		}
		const sel = window.getSelection();
		if (sel && sel.anchorNode && ref.current) {
			let node = sel.anchorNode;
			while (node && node !== ref.current) {
				if (node.nodeType === Node.ELEMENT_NODE) {
					const el = node;
					const tagName = el.tagName.toLowerCase();
					if ([
						"h2",
						"h3",
						"h4"
					].includes(tagName)) {
						el.style.fontSize = "";
						el.querySelectorAll("*").forEach((child) => {
							if (child.style && child.style.fontSize) child.style.fontSize = "";
						});
						break;
					}
					if (tagName === "p") {
						el.style.fontSize = "14px";
						break;
					}
				}
				node = node.parentNode;
			}
		}
		emit();
		saveSelection();
	};
	const insertHTML = (html) => {
		restoreSelection();
		document.execCommand("insertHTML", false, html);
		emit();
		saveSelection();
	};
	const setFontFamily = (f) => {
		restoreSelection();
		const sel = window.getSelection();
		if (!sel || sel.rangeCount === 0 || !ref.current) return;
		const fontValue = f === "Default" ? "" : `'${f}', system-ui, sans-serif`;
		const range = sel.getRangeAt(0);
		const allBlocks = ref.current.querySelectorAll("p, div, h1, h2, h3, h4, li, blockquote, pre, td, th");
		const selectedBlocks = [];
		allBlocks.forEach((b) => {
			if (sel.containsNode(b, true)) selectedBlocks.push(b);
		});
		if (selectedBlocks.length > 0) {
			selectedBlocks.forEach((b) => {
				b.style.fontFamily = fontValue;
				b.querySelectorAll("*").forEach((child) => {
					if (child.style && child.style.fontFamily) child.style.fontFamily = "";
				});
			});
			emit();
			saveSelection();
			return;
		}
		if (!range.collapsed) {
			const fragment = range.extractContents();
			fragment.querySelectorAll("*").forEach((child) => {
				if (child.style && child.style.fontFamily) child.style.fontFamily = "";
			});
			const span = document.createElement("span");
			if (fontValue) span.style.fontFamily = fontValue;
			span.appendChild(fragment);
			range.insertNode(span);
			const newRange = document.createRange();
			newRange.selectNodeContents(span);
			sel.removeAllRanges();
			sel.addRange(newRange);
			savedSelection.current = newRange.cloneRange();
		}
		emit();
		saveSelection();
	};
	const setFontSize = (px) => {
		restoreSelection();
		setCurrentSize(px);
		const sel = window.getSelection();
		if (!sel || sel.rangeCount === 0 || !ref.current) return;
		const range = sel.getRangeAt(0);
		const targetSize = `${px}px`;
		const cleanInnerFontSizes = (el) => {
			el.querySelectorAll("*").forEach((child) => {
				if (child.style && child.style.fontSize) child.style.fontSize = "";
				if (child.tagName.toLowerCase() === "font") child.removeAttribute("size");
			});
		};
		if (range.collapsed) {
			let node = range.startContainer;
			let blockEl = null;
			while (node && node !== ref.current) {
				if (node.nodeType === Node.ELEMENT_NODE) {
					const el = node;
					const t = el.tagName.toLowerCase();
					if ([
						"p",
						"div",
						"li",
						"h2",
						"h3",
						"h4",
						"blockquote",
						"td",
						"th"
					].includes(t)) {
						blockEl = el;
						break;
					}
				}
				node = node.parentNode;
			}
			if (blockEl) {
				blockEl.style.fontSize = targetSize;
				cleanInnerFontSizes(blockEl);
			} else {
				const span = document.createElement("span");
				span.style.fontSize = targetSize;
				span.innerHTML = "&#8203;";
				range.insertNode(span);
				const newRange = document.createRange();
				newRange.setStart(span, 1);
				newRange.collapse(true);
				sel.removeAllRanges();
				sel.addRange(newRange);
			}
			emit();
			saveSelection();
			return;
		}
		const allBlocks = ref.current.querySelectorAll("p, div, h1, h2, h3, h4, li, blockquote, pre, td, th");
		const selectedBlocks = [];
		allBlocks.forEach((block) => {
			if (sel.containsNode(block, true)) selectedBlocks.push(block);
		});
		if (selectedBlocks.length > 1 || selectedBlocks.length === 1 && range.toString().trim().length > 0 && range.toString().trim() === selectedBlocks[0].innerText.trim()) {
			selectedBlocks.forEach((block) => {
				block.style.fontSize = targetSize;
				cleanInnerFontSizes(block);
			});
			emit();
			saveSelection();
			return;
		}
		try {
			const fragment = range.extractContents();
			fragment.querySelectorAll("*").forEach((child) => {
				if (child.style && child.style.fontSize) child.style.fontSize = "";
				if (child.tagName.toLowerCase() === "font") child.removeAttribute("size");
			});
			const span = document.createElement("span");
			span.style.fontSize = targetSize;
			span.appendChild(fragment);
			range.insertNode(span);
			const newRange = document.createRange();
			newRange.selectNodeContents(span);
			sel.removeAllRanges();
			sel.addRange(newRange);
			savedSelection.current = newRange.cloneRange();
		} catch {
			try {
				document.execCommand("styleWithCSS", false, "true");
				document.execCommand("fontSize", false, "7");
				ref.current.querySelectorAll("font[size='7']").forEach((f) => {
					const span = document.createElement("span");
					span.style.fontSize = targetSize;
					while (f.firstChild) span.appendChild(f.firstChild);
					f.parentNode?.replaceChild(span, f);
				});
				ref.current.querySelectorAll("span[style*='-webkit-xxx-large'], span[style*='xxx-large'], span[style*='font-size: 7']").forEach((s) => {
					s.style.fontSize = targetSize;
				});
			} catch {}
		}
		emit();
		saveSelection();
	};
	const updateSelectionState = () => {
		saveSelection();
		const sel = window.getSelection();
		if (!sel || !sel.anchorNode || !ref.current) return;
		const el = sel.anchorNode.nodeType === Node.ELEMENT_NODE ? sel.anchorNode : sel.anchorNode.parentElement;
		if (el) {
			const fs = window.getComputedStyle(el).fontSize;
			const numeric = parseInt(fs, 10);
			if (numeric && FONT_SIZES.includes(String(numeric))) setCurrentSize(String(numeric));
			else setCurrentSize("14");
		}
	};
	const unlink = () => {
		restoreSelection();
		const sel = window.getSelection();
		if (!sel || sel.rangeCount === 0 || !ref.current) return;
		try {
			document.execCommand("unlink", false);
		} catch {}
		const range = sel.getRangeAt(0);
		const editorText = (ref.current.innerText || "").trim();
		const selText = range.toString().trim();
		const isAllSelected = range.commonAncestorContainer === ref.current || range.commonAncestorContainer.contains(ref.current) || editorText.length > 0 && selText.length > 0 && selText === editorText;
		const unwrap = (node) => {
			const parent = node.parentNode;
			if (!parent) return;
			while (node.firstChild) parent.insertBefore(node.firstChild, node);
			parent.removeChild(node);
		};
		ref.current.querySelectorAll("a").forEach((a) => {
			if (isAllSelected || sel.containsNode(a, true) || a.contains(range.startContainer) || a.contains(range.endContainer)) unwrap(a);
		});
		emit();
		saveSelection();
	};
	const clearFormatting = () => {
		restoreSelection();
		const sel = window.getSelection();
		if (!sel || sel.rangeCount === 0 || !ref.current) return;
		try {
			document.execCommand("unlink", false);
		} catch {}
		try {
			document.execCommand("removeFormat", false);
		} catch {}
		const range = sel.getRangeAt(0);
		const editorText = (ref.current.innerText || "").trim();
		const selText = range.toString().trim();
		const isAllSelected = range.commonAncestorContainer === ref.current || range.commonAncestorContainer.contains(ref.current) || editorText.length > 0 && selText.length > 0 && selText === editorText;
		const unwrap = (node) => {
			const parent = node.parentNode;
			if (!parent) return;
			while (node.firstChild) parent.insertBefore(node.firstChild, node);
			parent.removeChild(node);
		};
		ref.current.querySelectorAll("a").forEach((a) => {
			if (isAllSelected || sel.containsNode(a, true) || a.contains(range.startContainer) || a.contains(range.endContainer)) unwrap(a);
		});
		ref.current.querySelectorAll("b, strong, i, em, u, s, strike, del, mark, font, small, sub, sup, code").forEach((el) => {
			if (isAllSelected || sel.containsNode(el, true) || el.contains(range.startContainer) || el.contains(range.endContainer)) unwrap(el);
		});
		ref.current.querySelectorAll("*").forEach((el) => {
			const tag = el.tagName.toLowerCase();
			if ([
				"img",
				"iframe",
				"video"
			].includes(tag)) return;
			if (isAllSelected || sel.containsNode(el, true) || el.contains(range.startContainer) || el.contains(range.endContainer)) {
				el.removeAttribute("style");
				el.removeAttribute("class");
				el.removeAttribute("color");
				el.removeAttribute("face");
				el.removeAttribute("size");
				el.removeAttribute("dir");
				el.removeAttribute("lang");
			}
		});
		ref.current.querySelectorAll("span").forEach((span) => {
			if (!span.getAttribute("style") && !span.getAttribute("class") && !span.getAttribute("id")) unwrap(span);
		});
		ref.current.querySelectorAll("h1, h2, h3, h4, h5, h6, blockquote, div").forEach((block) => {
			if (isAllSelected || sel.containsNode(block, true) || block.contains(range.startContainer) || block.contains(range.endContainer)) {
				if (!block.querySelector("p, ul, ol, table, blockquote")) {
					const p = document.createElement("p");
					p.style.fontSize = "14px";
					p.style.lineHeight = "1.75";
					p.style.margin = "0.5rem 0";
					while (block.firstChild) p.appendChild(block.firstChild);
					block.parentNode?.replaceChild(p, block);
				}
			}
		});
		ref.current.querySelectorAll("p").forEach((p) => {
			if (isAllSelected || sel.containsNode(p, true) || p.contains(range.startContainer) || p.contains(range.endContainer)) {
				p.style.fontSize = "14px";
				p.style.lineHeight = "1.75";
				p.style.margin = "0.5rem 0";
			}
		});
		setCurrentSize("14");
		emit();
		saveSelection();
	};
	const handlePaste = (e) => {
		e.preventDefault();
		const clipboardData = e.clipboardData;
		if (!clipboardData) return;
		const htmlData = clipboardData.getData("text/html");
		const textData = clipboardData.getData("text/plain");
		if (htmlData) {
			const doc = new DOMParser().parseFromString(htmlData, "text/html");
			doc.querySelectorAll("script, style, meta, link, noscript, title, xml, [class*='Mso']").forEach((el) => {
				if (el.tagName.toLowerCase() === "style" || el.tagName.toLowerCase() === "script") el.remove();
			});
			doc.querySelectorAll("font").forEach((font) => {
				const span = doc.createElement("span");
				while (font.firstChild) span.appendChild(font.firstChild);
				font.parentNode?.replaceChild(span, font);
			});
			doc.body.querySelectorAll("*").forEach((el) => {
				const tag = el.tagName.toLowerCase();
				const htmlEl = el;
				htmlEl.removeAttribute("class");
				htmlEl.removeAttribute("lang");
				htmlEl.removeAttribute("dir");
				if (htmlEl.style) {
					htmlEl.style.fontSize = "";
					htmlEl.style.fontFamily = "";
					htmlEl.style.color = "";
					htmlEl.style.backgroundColor = "";
					htmlEl.style.textDecoration = "";
					htmlEl.style.lineHeight = "";
					htmlEl.style.margin = "";
					htmlEl.style.padding = "";
				}
				if (tag === "div" && !htmlEl.querySelector("p, h1, h2, h3, h4, ul, ol, table")) {
					const p = doc.createElement("p");
					p.innerHTML = htmlEl.innerHTML;
					htmlEl.parentNode?.replaceChild(p, htmlEl);
				}
			});
			doc.querySelectorAll("p").forEach((p) => {
				p.style.fontSize = "14px";
				p.style.lineHeight = "1.75";
				p.style.margin = "0.5rem 0";
			});
			const cleanHtml = doc.body.innerHTML.trim();
			if (cleanHtml) {
				document.execCommand("insertHTML", false, cleanHtml);
				emit();
				saveSelection();
				return;
			}
		}
		if (textData) {
			const paragraphs = textData.split(/\r?\n\r?\n/).map((p) => p.trim()).filter(Boolean);
			if (paragraphs.length > 1) {
				const html = paragraphs.map((p) => `<p style="font-size:14px;line-height:1.75;margin:0.5rem 0;">${escapeHtml(p)}</p>`).join("");
				document.execCommand("insertHTML", false, html);
			} else {
				const html = `<p style="font-size:14px;line-height:1.75;margin:0.5rem 0;">${escapeHtml(textData)}</p>`;
				document.execCommand("insertHTML", false, html);
			}
			emit();
			saveSelection();
		}
	};
	return {
		emit,
		saveSelection,
		restoreSelection,
		exec,
		formatBlock,
		insertHTML,
		setFontFamily,
		setFontSize,
		updateSelectionState,
		handlePaste,
		clearFormatting,
		unlink
	};
}
//#endregion
//#region src/components/admin/articles/RichEditor.tsx
function RichEditor({ value, onChange }) {
	const ref = useRef(null);
	const imgRef = useRef(null);
	const lastHtml = useRef(value);
	const textColorRef = useRef(null);
	const highlightRef = useRef(null);
	const [fontOptions, setFontOptions] = useState(["Default"]);
	const [mode, setMode] = useState("visual");
	const [currentSize, setCurrentSize] = useState("14");
	const [isFullscreen, setIsFullscreen] = useState(false);
	const [textColorOpen, setTextColorOpen] = useState(false);
	const [highlightOpen, setHighlightOpen] = useState(false);
	const [activeTextColor, setActiveTextColor] = useState("#1A1110");
	const [activeHighlightColor, setActiveHighlightColor] = useState("transparent");
	const { emit, saveSelection, restoreSelection, exec, formatBlock, insertHTML, setFontFamily, setFontSize, updateSelectionState, handlePaste, clearFormatting, unlink } = useRichEditorSelection({
		ref,
		lastHtml,
		onChange,
		setCurrentSize
	});
	useEffect(() => {
		if (ref.current && value !== lastHtml.current) {
			ref.current.innerHTML = value || "";
			lastHtml.current = value || "";
		}
	}, [value]);
	useEffect(() => {
		if (mode === "visual" && ref.current) {
			ref.current.innerHTML = value || "";
			lastHtml.current = value || "";
		}
	}, [mode]);
	useEffect(() => {
		if (ref.current && !ref.current.innerHTML && value) ref.current.innerHTML = value;
	}, []);
	useEffect(() => {
		const config = loadFontConfig();
		if (config && config.fonts) {
			const families = config.fonts.map((f) => f.name || f.family);
			setFontOptions(["Default", ...new Set(families)]);
		}
		const handleUpdate = () => {
			const updated = loadFontConfig();
			if (updated && updated.fonts) {
				const families = updated.fonts.map((f) => f.name || f.family);
				setFontOptions(["Default", ...new Set(families)]);
			}
		};
		window.addEventListener("nt:fonts-updated", handleUpdate);
		return () => window.removeEventListener("nt:fonts-updated", handleUpdate);
	}, []);
	useEffect(() => {
		const handleOutsideClick = (e) => {
			if (textColorRef.current && !textColorRef.current.contains(e.target)) setTextColorOpen(false);
			if (highlightRef.current && !highlightRef.current.contains(e.target)) setHighlightOpen(false);
		};
		document.addEventListener("mousedown", handleOutsideClick);
		return () => document.removeEventListener("mousedown", handleOutsideClick);
	}, []);
	const insertImage = () => {
		const url = prompt("Image URL (or use Upload)");
		if (!url) return;
		insertHTML(`<img src="${url}" alt="${prompt("Alt text (optional)") || "image"}" style="max-width:100%;height:auto;border-radius:8px;margin:12px 0" />`);
	};
	const uploadImage = (f) => {
		if (!f) return;
		const reader = new FileReader();
		reader.onload = () => insertHTML(`<img src="${reader.result}" alt="image" style="max-width:100%;height:auto;border-radius:8px;margin:12px 0" />`);
		reader.readAsDataURL(f);
	};
	const insertYouTube = () => {
		const url = prompt("YouTube URL (e.g. https://youtu.be/abc123)");
		if (!url) return;
		const m = url.match(/(?:youtu\.be\/|v=|shorts\/|embed\/)([\w-]{11})/);
		insertHTML(`<div style="position:relative;width:100%;aspect-ratio:16/9;margin:12px 0"><iframe src="https://www.youtube.com/embed/${m ? m[1] : url}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen style="position:absolute;inset:0;width:100%;height:100%;border:0;border-radius:8px"></iframe></div><p><br/></p>`);
	};
	const insertFacebook = () => {
		const url = prompt("Facebook video URL");
		if (!url) return;
		insertHTML(`<div style="position:relative;width:100%;aspect-ratio:16/9;margin:12px 0"><iframe src="https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}&show_text=false" style="position:absolute;inset:0;width:100%;height:100%;border:0;border-radius:8px" scrolling="no" allowfullscreen></iframe></div><p><br/></p>`);
	};
	const insertVideoUrl = () => {
		const url = prompt("Direct video URL (.mp4, .webm)");
		if (!url) return;
		insertHTML(`<video src="${url}" controls style="max-width:100%;border-radius:8px;margin:12px 0"></video><p><br/></p>`);
	};
	const insertLink = () => {
		const url = prompt("URL (e.g. https://example.com)");
		if (!url) return;
		exec("createLink", url);
	};
	const insertDivider = () => insertHTML(`<hr style="border:0;border-top:1px solid #cbd5e1;margin:16px 0" />`);
	const insertQuote = () => exec("formatBlock", "blockquote");
	const insertTable = () => insertHTML(createTableHtml());
	const applyTextColor = (color) => {
		restoreSelection();
		exec("foreColor", color);
		setActiveTextColor(color);
		setTextColorOpen(false);
	};
	const applyHighlightColor = (color) => {
		restoreSelection();
		if (color === "transparent") document.execCommand("removeFormat", false);
		else document.execCommand("hiliteColor", false, color) || document.execCommand("backColor", false, color);
		setActiveHighlightColor(color);
		setHighlightOpen(false);
		emit();
	};
	const Btn = ({ onClick, title, children, disabled = false }) => /* @__PURE__ */ jsx("button", {
		type: "button",
		disabled,
		onMouseDown: (e) => {
			e.preventDefault();
			saveSelection();
		},
		onClick,
		title,
		className: "grid h-8 w-8 place-items-center rounded text-slate-700 hover:bg-slate-200 disabled:opacity-35 disabled:pointer-events-none transition-colors",
		children
	});
	const Sep = () => /* @__PURE__ */ jsx("span", { className: "mx-1 h-5 w-px bg-slate-200" });
	const words = (ref.current?.innerText || "").trim().split(/\s+/).filter(Boolean).length;
	return /* @__PURE__ */ jsxs("div", {
		className: `overflow-hidden rounded-md border border-slate-200 bg-white transition-all ${isFullscreen ? "fixed inset-0 z-50 flex flex-col m-0 rounded-none h-screen" : "relative"}`,
		children: [
			/* @__PURE__ */ jsx(Toolbar, {
				mode,
				setMode,
				exec,
				formatBlock,
				setFontFamily,
				setFontSize,
				fontOptions,
				currentSize,
				sizes: FONT_SIZES,
				applyTextColor,
				applyHighlightColor,
				insertHTML,
				insertImage,
				imgRef,
				uploadImage,
				insertYouTube,
				insertFacebook,
				insertVideoUrl,
				insertLink,
				unlink,
				clearFormatting,
				insertDivider,
				insertQuote,
				insertTable,
				isFullscreen,
				setIsFullscreen,
				words,
				saveSelection,
				emit,
				textColorOpen,
				setTextColorOpen,
				highlightOpen,
				setHighlightOpen,
				activeTextColor,
				activeHighlightColor,
				textColorRef,
				highlightRef,
				TEXT_PALETTE_ROWS,
				HIGHLIGHT_PALETTE_ROWS,
				Btn,
				Sep
			}),
			/* @__PURE__ */ jsx(BubbleMenu, {}),
			/* @__PURE__ */ jsx(FloatingMenu, {}),
			mode === "visual" ? /* @__PURE__ */ jsx("div", {
				ref,
				contentEditable: true,
				suppressContentEditableWarning: true,
				onInput: emit,
				onBlur: emit,
				onPaste: handlePaste,
				onSelect: saveSelection,
				onKeyUp: updateSelectionState,
				onMouseUp: updateSelectionState,
				"data-placeholder": "Write your article here. Use the toolbar to format text, change color, insert images, and embed YouTube/Facebook videos - everything renders live as you type.",
				className: `rich-editor block w-full px-5 py-4 text-[14px] leading-relaxed text-slate-900 focus:outline-none ${isFullscreen ? "flex-1 overflow-y-auto min-h-0" : "min-h-[380px]"}`,
				style: { fontFamily: "'Inter', system-ui, sans-serif" }
			}) : /* @__PURE__ */ jsx("textarea", {
				value: value || "",
				onChange: (e) => {
					lastHtml.current = e.target.value;
					onChange(e.target.value);
				},
				placeholder: "Write or paste plain text / HTML here...",
				className: `block w-full px-5 py-4 font-mono text-[14px] leading-relaxed text-slate-900 focus:outline-none bg-slate-50/50 resize-y ${isFullscreen ? "flex-1 overflow-y-auto min-h-0" : "min-h-[380px]"}`,
				rows: 16
			}),
			/* @__PURE__ */ jsx("style", { children: `
        .rich-editor:empty:before { content: attr(data-placeholder); color: #94a3b8; pointer-events: none; }
        .rich-editor, .rich-editor p, .rich-editor li, .rich-editor td { font-size: 14px; line-height: 1.75; margin: .5rem 0; }
        .rich-editor h2 { font-size: 1.5rem; font-weight: 700; margin: 1.25rem 0 .5rem; font-family: 'Playfair Display', Georgia, serif; line-height: 1.3; }
        .rich-editor h3 { font-size: 1.25rem; font-weight: 700; margin: 1rem 0 .5rem; font-family: 'Playfair Display', Georgia, serif; line-height: 1.35; }
        .rich-editor h4 { font-size: 1.1rem; font-weight: 600; margin: .75rem 0 .25rem; line-height: 1.4; }
        .rich-editor ul { list-style: disc; padding-left: 1.5rem; margin: .5rem 0; }
        .rich-editor ol { list-style: decimal; padding-left: 1.5rem; margin: .5rem 0; }
        .rich-editor blockquote { border-left: 3px solid #1A1110; padding: .5rem 1rem; margin: .75rem 0; color: #475569; font-style: italic; background:#f8fafc; font-size: 14px; }
        .rich-editor a { color: #2563eb; text-decoration: underline; }
        .rich-editor img { max-width: 100%; height: auto; }
        .rich-editor table { width: 100%; border-collapse: collapse; margin: 1rem 0; font-size: 14px; }
        .rich-editor th, .rich-editor td { border: 1px solid #cbd5e1; padding: 8px 12px; }
        .rich-editor th { background-color: #f8fafc; font-weight: 600; }
      ` })
		]
	});
}
//#endregion
//#region src/components/admin/articles/ArticleSubComponents.tsx
function ImageInput({ value, onChange, hint }) {
	return /* @__PURE__ */ jsxs("div", {
		className: "flex gap-3",
		children: [/* @__PURE__ */ jsx("div", {
			className: "grid h-32 w-48 shrink-0 place-items-center overflow-hidden rounded-md border-2 border-dashed border-slate-200 bg-slate-50",
			children: value ? /* @__PURE__ */ jsx("img", {
				src: value,
				alt: "preview",
				className: "h-full w-full object-cover"
			}) : /* @__PURE__ */ jsxs("div", {
				className: "text-center text-slate-400",
				children: [/* @__PURE__ */ jsx(Image, { className: "mx-auto h-6 w-6" }), /* @__PURE__ */ jsx("span", {
					className: "mt-1 block text-xs",
					children: "No image"
				})]
			})
		}), /* @__PURE__ */ jsxs("div", {
			className: "flex-1 space-y-2",
			children: [/* @__PURE__ */ jsx("input", {
				value,
				onChange: (e) => onChange(e.target.value),
				placeholder: "Paste image URL...",
				className: "w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none"
			}), /* @__PURE__ */ jsx(MediaField, {
				value,
				onChange,
				usage: "article",
				hint,
				previewClassName: "hidden",
				recommendedSize: "1600×900 px (16:9)"
			})]
		})]
	});
}
function Field({ label, children }) {
	return /* @__PURE__ */ jsxs("label", {
		className: "block",
		children: [/* @__PURE__ */ jsx("span", {
			className: "mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-600",
			children: label
		}), children]
	});
}
function JournalistPicker({ journalistId, journalistName, onSelect }) {
	const runSearch = useServerFn(searchJournalists);
	const planType = (useSiteSettings()?.licenseType || "").toLowerCase();
	const isEnterprisePlus = planType.includes("enterprise+") || planType.includes("enterprise plus");
	const [q, setQ] = useState("");
	const [busy, setBusy] = useState(false);
	const [results, setResults] = useState(null);
	const search = async () => {
		const query = q.trim();
		if (query.length < 2) return toast.error("Enter a name or User ID (min 2 chars)");
		setBusy(true);
		try {
			const rows = await runSearch({ data: { query } });
			setResults(rows);
			if (rows.length === 0) toast.info("No matching journalist found");
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Search failed");
		} finally {
			setBusy(false);
		}
	};
	return /* @__PURE__ */ jsxs("div", { children: [
		/* @__PURE__ */ jsxs("div", {
			className: "mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-600",
			children: [
				/* @__PURE__ */ jsx(UserCheck, { className: "h-3.5 w-3.5" }),
				" Journalist",
				/* @__PURE__ */ jsx("span", {
					className: "font-normal normal-case text-slate-400",
					children: "— assign a journalist from your users by name or User ID"
				})
			]
		}),
		journalistId ? /* @__PURE__ */ jsxs("div", {
			className: "mb-3 space-y-3 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-3",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "flex items-center justify-between gap-3",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "min-w-0",
					children: [/* @__PURE__ */ jsxs("p", {
						className: "flex items-center gap-1.5 truncate text-sm font-medium text-emerald-900",
						children: [/* @__PURE__ */ jsx(BadgeCheck, { className: "h-4 w-4 shrink-0 text-emerald-600" }), journalistName || "Journalist"]
					}), /* @__PURE__ */ jsxs("p", {
						className: "font-mono text-xs text-emerald-700",
						children: ["ID: ", journalistId]
					})]
				}), /* @__PURE__ */ jsx("button", {
					type: "button",
					onClick: () => {
						onSelect(null);
						setResults(null);
						setQ("");
					},
					className: "shrink-0 rounded-md border border-emerald-300 bg-white px-2.5 py-1 text-xs font-medium text-emerald-800 hover:bg-emerald-100 cursor-pointer",
					children: "Change"
				})]
			}), isEnterprisePlus && /* @__PURE__ */ jsx(AwardPointsBox, {
				publicUserId: journalistId,
				displayName: journalistName
			})]
		}) : /* @__PURE__ */ jsxs("div", {
			className: "flex gap-2",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "relative flex-1",
				children: [/* @__PURE__ */ jsx(Search, { className: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" }), /* @__PURE__ */ jsx("input", {
					value: q,
					onChange: (e) => setQ(e.target.value),
					onKeyDown: (e) => {
						if (e.key === "Enter") {
							e.preventDefault();
							search();
						}
					},
					placeholder: "Journalist name or 10-digit User ID...",
					className: "w-full rounded-md border border-slate-200 py-2 pl-9 pr-3 text-sm focus:border-slate-900 focus:outline-none"
				})]
			}), /* @__PURE__ */ jsxs("button", {
				type: "button",
				onClick: search,
				disabled: busy,
				className: "inline-flex items-center gap-1.5 rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-60",
				children: [busy ? /* @__PURE__ */ jsx(Loader2, { className: "h-3.5 w-3.5 animate-spin" }) : /* @__PURE__ */ jsx(Search, { className: "h-3.5 w-3.5" }), "Search"]
			})]
		}),
		!journalistId && results && results.length > 0 && /* @__PURE__ */ jsx("ul", {
			className: "mt-2 divide-y divide-slate-100 overflow-hidden rounded-md border border-slate-200",
			children: results.map((j) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsxs("button", {
				type: "button",
				onClick: () => {
					onSelect(j);
					setResults(null);
					setQ("");
				},
				className: "flex w-full items-center justify-between gap-3 px-3 py-2 text-left hover:bg-slate-50",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "min-w-0",
					children: [/* @__PURE__ */ jsxs("p", {
						className: "flex items-center gap-1.5 truncate text-sm font-medium text-slate-900",
						children: [j.displayName || "Unnamed user", j.verified && /* @__PURE__ */ jsx(BadgeCheck, { className: "h-3.5 w-3.5 shrink-0 text-emerald-600" })]
					}), /* @__PURE__ */ jsxs("p", {
						className: "font-mono text-xs text-slate-500",
						children: [
							"ID: ",
							j.publicUserId,
							" • ",
							j.role
						]
					})]
				}), /* @__PURE__ */ jsx("span", {
					className: `shrink-0 rounded-full border px-2 py-0.5 text-[11px] font-medium ${j.verified ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-slate-200 bg-slate-100 text-slate-600"}`,
					children: j.verified ? "Verified" : j.role
				})]
			}) }, j.userId))
		})
	] });
}
function AwardPointsBox({ publicUserId, displayName }) {
	const planType = (useSiteSettings()?.licenseType || "").toLowerCase();
	if (!(planType.includes("enterprise+") || planType.includes("enterprise plus"))) return null;
	const runAward = useServerFn(awardJournalistPoints);
	const [amount, setAmount] = useState("");
	const [reason, setReason] = useState("");
	const [busy, setBusy] = useState(false);
	const [balance, setBalance] = useState(null);
	const submit = async () => {
		const points = Math.floor(Number(amount));
		if (!Number.isFinite(points) || points === 0) return toast.error("Enter a non-zero point amount");
		setBusy(true);
		try {
			const res = await runAward({ data: {
				publicUserId,
				points,
				reason: reason || void 0
			} });
			setBalance(res.newBalance);
			setAmount("");
			setReason("");
			toast.success(`${points > 0 ? "Added" : "Deducted"} ${Math.abs(points)} pts · new balance ${res.newBalance}`);
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Failed to award points");
		} finally {
			setBusy(false);
		}
	};
	return /* @__PURE__ */ jsxs("div", {
		className: "rounded-md border border-emerald-200 bg-white px-3 py-2.5",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "mb-2 flex items-center justify-between gap-2",
				children: [/* @__PURE__ */ jsxs("span", {
					className: "inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-700",
					children: [
						/* @__PURE__ */ jsx(Wallet, { className: "h-3.5 w-3.5 text-emerald-600" }),
						" Award points to",
						" ",
						displayName || "journalist"
					]
				}), balance !== null && /* @__PURE__ */ jsxs("span", {
					className: "inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700",
					children: [
						/* @__PURE__ */ jsx(Coins, { className: "h-3 w-3" }),
						" Wallet: ",
						balance
					]
				})]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "flex flex-col gap-2 sm:flex-row",
				children: [
					/* @__PURE__ */ jsx("input", {
						type: "number",
						value: amount,
						onChange: (e) => setAmount(e.target.value),
						placeholder: "Points (e.g. 20)",
						className: "w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none sm:w-40"
					}),
					/* @__PURE__ */ jsx("input", {
						value: reason,
						onChange: (e) => setReason(e.target.value),
						placeholder: "Reason (optional)",
						className: "flex-1 rounded-md border border-slate-200 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none"
					}),
					/* @__PURE__ */ jsxs("button", {
						type: "button",
						onClick: submit,
						disabled: busy,
						className: "inline-flex items-center justify-center gap-1.5 rounded-md bg-emerald-600 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-60",
						children: [busy ? /* @__PURE__ */ jsx(Loader2, { className: "h-3.5 w-3.5 animate-spin" }) : /* @__PURE__ */ jsx(Coins, { className: "h-3.5 w-3.5" }), "Add to wallet"]
					})
				]
			}),
			/* @__PURE__ */ jsx("p", {
				className: "mt-1.5 text-[11px] text-slate-500",
				children: "Credits the journalist's wallet instantly. Use a negative amount to deduct."
			})
		]
	});
}
//#endregion
//#region src/components/admin/articles/MultiCategorySelector.tsx
var POPULAR_SUGGESTIONS = [
	"Tripura",
	"State",
	"National",
	"Politics",
	"Sports",
	"Entertainment",
	"Crime",
	"Business"
];
function MultiCategorySelector({ value, onChange }) {
	const contextCats = useCategories();
	const [fetchedCats, setFetchedCats] = useState([]);
	const [isOpen, setIsOpen] = useState(false);
	const [query, setQuery] = useState("");
	const [showDirectEdit, setShowDirectEdit] = useState(false);
	const popoverRef = useRef(null);
	const searchInputRef = useRef(null);
	useEffect(() => {
		let isMounted = true;
		getCategories().then((cats) => {
			if (isMounted && Array.isArray(cats)) setFetchedCats(cats);
		}).catch((err) => {
			console.warn("[MultiCategorySelector] Failed to fetch taxonomy categories:", err);
		});
		return () => {
			isMounted = false;
		};
	}, []);
	const selectedCategories = useMemo(() => {
		if (!value || !value.trim()) return ["Uncategorized"];
		const list = value.split(",").map((c) => c.trim()).filter(Boolean);
		return list.length > 0 ? list : ["Uncategorized"];
	}, [value]);
	const allAvailableCategories = useMemo(() => {
		const set = /* @__PURE__ */ new Set();
		(contextCats || []).forEach((c) => {
			if (c?.name) set.add(c.name);
		});
		(fetchedCats || []).forEach((c) => {
			if (c?.name) set.add(c.name);
		});
		set.add("Uncategorized");
		selectedCategories.forEach((s) => set.add(s));
		return Array.from(set);
	}, [
		contextCats,
		fetchedCats,
		selectedCategories
	]);
	const quickSuggestions = useMemo(() => {
		const list = [];
		(contextCats || []).forEach((c) => {
			if (c?.name && !list.includes(c.name) && c.name.toLowerCase() !== "uncategorized") list.push(c.name);
		});
		(fetchedCats || []).forEach((c) => {
			if (c?.name && !list.includes(c.name) && c.name.toLowerCase() !== "uncategorized") list.push(c.name);
		});
		if (list.length > 0) return list.slice(0, 10);
		return POPULAR_SUGGESTIONS;
	}, [contextCats, fetchedCats]);
	const filteredCategories = useMemo(() => {
		const q = query.trim().toLowerCase();
		if (!q) return allAvailableCategories;
		return allAvailableCategories.filter((c) => c.toLowerCase().includes(q));
	}, [allAvailableCategories, query]);
	useEffect(() => {
		if (!isOpen) return;
		const handleOutsideClick = (e) => {
			if (popoverRef.current && !popoverRef.current.contains(e.target)) setIsOpen(false);
		};
		document.addEventListener("mousedown", handleOutsideClick);
		return () => document.removeEventListener("mousedown", handleOutsideClick);
	}, [isOpen]);
	useEffect(() => {
		if (isOpen) setTimeout(() => searchInputRef.current?.focus(), 50);
		else setQuery("");
	}, [isOpen]);
	const addCategory = (cat) => {
		const trimmed = cat.trim();
		if (!trimmed) return;
		if (selectedCategories.includes(trimmed)) return;
		let next;
		if (selectedCategories.length === 1 && selectedCategories[0].toLowerCase() === "uncategorized" && trimmed.toLowerCase() !== "uncategorized") next = [trimmed];
		else next = [...selectedCategories, trimmed];
		onChange(next.join(", "));
	};
	const removeCategory = (cat) => {
		const next = selectedCategories.filter((c) => c !== cat);
		if (next.length === 0) onChange("Uncategorized");
		else onChange(next.join(", "));
	};
	const makePrimary = (cat) => {
		onChange([cat, ...selectedCategories.filter((c) => c !== cat)].join(", "));
	};
	const toggleCategory = (cat) => {
		if (selectedCategories.includes(cat)) removeCategory(cat);
		else addCategory(cat);
	};
	const handleCreateCustom = () => {
		const trimmed = query.trim();
		if (!trimmed) return;
		addCategory(trimmed);
		setQuery("");
	};
	const exactMatchExists = allAvailableCategories.some((c) => c.toLowerCase() === query.trim().toLowerCase());
	return /* @__PURE__ */ jsxs("div", {
		className: "space-y-2",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "flex items-center justify-between text-xs",
				children: [/* @__PURE__ */ jsxs("span", {
					className: "font-semibold uppercase tracking-wider text-slate-700",
					children: [
						"Categories",
						" ",
						selectedCategories.length > 0 && /* @__PURE__ */ jsxs("span", {
							className: "ml-1 text-slate-500 font-normal",
							children: [
								"(",
								selectedCategories.length,
								" selected)"
							]
						})
					]
				}), /* @__PURE__ */ jsxs("button", {
					type: "button",
					onClick: () => setShowDirectEdit((prev) => !prev),
					className: "inline-flex items-center gap-1 text-[11px] text-blue-600 hover:text-blue-800 transition",
					children: [/* @__PURE__ */ jsx(Edit3, { className: "h-3 w-3" }), showDirectEdit ? "Hide direct edit" : "Edit as text"]
				})]
			}),
			/* @__PURE__ */ jsxs("div", {
				ref: popoverRef,
				className: "relative",
				children: [/* @__PURE__ */ jsxs("div", {
					onClick: () => setIsOpen((prev) => !prev),
					className: "min-h-[42px] w-full rounded-md border border-slate-200 bg-white p-1.5 flex flex-wrap items-center gap-1.5 cursor-pointer hover:border-slate-300 focus-within:border-slate-900 transition",
					children: [selectedCategories.length === 0 ? /* @__PURE__ */ jsx("span", {
						className: "px-2 py-1 text-xs text-slate-400 italic",
						children: "No categories selected — click to add categories"
					}) : selectedCategories.map((cat, idx) => {
						return idx === 0 ? /* @__PURE__ */ jsxs("span", {
							className: "inline-flex items-center gap-1.5 rounded-md bg-amber-50 border border-amber-300/80 px-2.5 py-1 text-xs font-semibold text-amber-900 shadow-xs",
							onClick: (e) => e.stopPropagation(),
							children: [
								/* @__PURE__ */ jsx(Star, { className: "h-3.5 w-3.5 fill-amber-500 text-amber-500 shrink-0" }),
								/* @__PURE__ */ jsx("span", { children: cat }),
								/* @__PURE__ */ jsx("span", {
									className: "rounded bg-amber-200/60 px-1 py-0.2 text-[9px] font-bold text-amber-800 uppercase tracking-wider",
									children: "Primary"
								}),
								/* @__PURE__ */ jsx("button", {
									type: "button",
									onClick: (e) => {
										e.stopPropagation();
										removeCategory(cat);
									},
									className: "ml-0.5 rounded p-0.5 text-amber-700 hover:bg-amber-200 hover:text-amber-950 transition",
									title: "Remove category",
									children: /* @__PURE__ */ jsx(X, { className: "h-3 w-3" })
								})
							]
						}, cat) : /* @__PURE__ */ jsxs("span", {
							className: "inline-flex items-center gap-1.5 rounded-md bg-slate-100 border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-200/70 transition",
							onClick: (e) => e.stopPropagation(),
							children: [
								/* @__PURE__ */ jsx(Tag, { className: "h-3 w-3 text-slate-400 shrink-0" }),
								/* @__PURE__ */ jsx("span", { children: cat }),
								/* @__PURE__ */ jsx("button", {
									type: "button",
									onClick: (e) => {
										e.stopPropagation();
										makePrimary(cat);
									},
									className: "text-slate-400 hover:text-amber-600 transition",
									title: "Make this Primary Category (used for main links & URL)",
									children: /* @__PURE__ */ jsx(Star, { className: "h-3 w-3" })
								}),
								/* @__PURE__ */ jsx("button", {
									type: "button",
									onClick: (e) => {
										e.stopPropagation();
										removeCategory(cat);
									},
									className: "rounded p-0.5 text-slate-400 hover:bg-slate-200 hover:text-red-600 transition",
									title: "Remove category",
									children: /* @__PURE__ */ jsx(X, { className: "h-3 w-3" })
								})
							]
						}, cat);
					}), /* @__PURE__ */ jsxs("button", {
						type: "button",
						className: "ml-auto inline-flex items-center gap-1 rounded bg-slate-100 hover:bg-slate-200 px-2 py-1 text-xs font-medium text-slate-700 transition",
						children: [
							/* @__PURE__ */ jsx(Plus, { className: "h-3 w-3" }),
							/* @__PURE__ */ jsx("span", { children: "Add" }),
							/* @__PURE__ */ jsx(ChevronDown, { className: "h-3 w-3 text-slate-400" })
						]
					})]
				}), isOpen && /* @__PURE__ */ jsxs("div", {
					className: "absolute left-0 right-0 top-full z-50 mt-1.5 rounded-lg border border-slate-200 bg-white p-2.5 shadow-xl animate-in fade-in zoom-in-95 duration-150",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "relative mb-2",
							children: [/* @__PURE__ */ jsx(Search, { className: "pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" }), /* @__PURE__ */ jsx("input", {
								ref: searchInputRef,
								type: "text",
								value: query,
								onChange: (e) => setQuery(e.target.value),
								onKeyDown: (e) => {
									if (e.key === "Enter") {
										e.preventDefault();
										if (!exactMatchExists && query.trim()) handleCreateCustom();
										else if (filteredCategories.length > 0) toggleCategory(filteredCategories[0]);
									}
								},
								placeholder: "Search or enter custom category...",
								className: "w-full rounded-md border border-slate-200 py-1.5 pl-8 pr-3 text-xs focus:border-slate-900 focus:outline-none"
							})]
						}),
						query.trim() && !exactMatchExists && /* @__PURE__ */ jsxs("button", {
							type: "button",
							onClick: handleCreateCustom,
							className: "mb-2 w-full flex items-center justify-between rounded-md bg-blue-50 border border-blue-200 px-2.5 py-1.5 text-xs font-medium text-blue-700 hover:bg-blue-100 transition",
							children: [/* @__PURE__ */ jsxs("span", { children: [
								"Add \"",
								query.trim(),
								"\" as category"
							] }), /* @__PURE__ */ jsx(Plus, { className: "h-3.5 w-3.5" })]
						}),
						/* @__PURE__ */ jsx("div", {
							className: "max-h-52 overflow-y-auto space-y-0.5 pr-1",
							children: filteredCategories.length === 0 && !query.trim() ? /* @__PURE__ */ jsx("div", {
								className: "py-3 text-center text-xs text-slate-400",
								children: "No categories found"
							}) : filteredCategories.map((cat) => {
								const isSelected = selectedCategories.includes(cat);
								const isPrimary = selectedCategories[0] === cat;
								return /* @__PURE__ */ jsxs("div", {
									onClick: () => toggleCategory(cat),
									className: `flex items-center justify-between rounded-md px-2.5 py-1.5 text-xs cursor-pointer transition select-none ${isSelected ? "bg-slate-100/90 text-slate-900 font-medium" : "text-slate-700 hover:bg-slate-50"}`,
									children: [/* @__PURE__ */ jsxs("div", {
										className: "flex items-center gap-2",
										children: [/* @__PURE__ */ jsx("div", {
											className: `grid h-4 w-4 place-items-center rounded border ${isSelected ? "bg-slate-900 border-slate-900 text-white" : "border-slate-300 bg-white"}`,
											children: isSelected && /* @__PURE__ */ jsx(Check, { className: "h-3 w-3 stroke-[3]" })
										}), /* @__PURE__ */ jsx("span", { children: cat })]
									}), isSelected && /* @__PURE__ */ jsx("div", {
										className: "flex items-center gap-1",
										children: isPrimary ? /* @__PURE__ */ jsxs("span", {
											className: "inline-flex items-center gap-1 rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold text-amber-800",
											children: [/* @__PURE__ */ jsx(Star, { className: "h-2.5 w-2.5 fill-amber-600 text-amber-600" }), "Primary"]
										}) : /* @__PURE__ */ jsx("button", {
											type: "button",
											onClick: (e) => {
												e.stopPropagation();
												makePrimary(cat);
											},
											className: "text-[10px] text-slate-500 hover:text-amber-700 hover:underline px-1",
											title: "Make this category Primary",
											children: "Set Primary"
										})
									})]
								}, cat);
							})
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "mt-2.5 flex items-center justify-between border-t border-slate-100 pt-2 text-[11px] text-slate-400",
							children: [/* @__PURE__ */ jsx("span", { children: "First category is Primary (★)" }), /* @__PURE__ */ jsx("button", {
								type: "button",
								onClick: () => setIsOpen(false),
								className: "font-medium text-slate-700 hover:text-slate-900",
								children: "Done"
							})]
						})
					]
				})]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "flex flex-wrap items-center gap-1 text-xs",
				children: [/* @__PURE__ */ jsx("span", {
					className: "text-[11px] text-slate-400 mr-0.5",
					children: "Quick add:"
				}), quickSuggestions.map((cat) => {
					if (selectedCategories.includes(cat)) return null;
					return /* @__PURE__ */ jsxs("button", {
						type: "button",
						onClick: () => addCategory(cat),
						className: "inline-flex items-center gap-0.5 rounded border border-dashed border-slate-200 bg-slate-50/70 px-1.5 py-0.5 text-[11px] text-slate-600 hover:bg-slate-100 hover:border-slate-300 transition",
						children: [/* @__PURE__ */ jsx(Plus, { className: "h-2.5 w-2.5 text-slate-400" }), /* @__PURE__ */ jsx("span", { children: cat })]
					}, cat);
				})]
			}),
			showDirectEdit && /* @__PURE__ */ jsxs("div", {
				className: "mt-2 rounded-md border border-slate-200 bg-slate-50/50 p-2.5 text-xs space-y-1",
				children: [
					/* @__PURE__ */ jsx("label", {
						className: "block text-[11px] font-medium text-slate-600",
						children: "Comma-separated category list:"
					}),
					/* @__PURE__ */ jsx("input", {
						type: "text",
						value,
						onChange: (e) => onChange(e.target.value),
						placeholder: "e.g. Business, State, National, Tripura",
						className: "w-full rounded border border-slate-200 bg-white px-2 py-1.5 text-xs focus:border-slate-900 focus:outline-none"
					}),
					/* @__PURE__ */ jsx("p", {
						className: "text-[10px] text-slate-400",
						children: "Separate categories with commas. The first category will be the primary one."
					})
				]
			})
		]
	});
}
//#endregion
//#region src/components/admin/articles/ArticleContentTab.tsx
function ArticleContentTab({ row, onChange, autoSlug }) {
	return /* @__PURE__ */ jsxs("div", {
		className: "space-y-5",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "rounded-xl border border-slate-200 bg-white p-5 shadow-sm",
			children: [
				/* @__PURE__ */ jsx(Field, {
					label: "Title *",
					children: /* @__PURE__ */ jsx("input", {
						id: "article-title",
						name: "title",
						"aria-label": "Article Title",
						autoComplete: "off",
						value: row.title,
						onChange: (e) => {
							onChange("title", e.target.value);
							if (autoSlug) onChange("slug", slugify(e.target.value));
						},
						placeholder: "Enter article headline...",
						className: "w-full rounded-md border border-slate-200 px-3 py-2.5 text-base font-medium focus:border-slate-900 focus:outline-none"
					})
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 items-start",
					children: [/* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(MultiCategorySelector, {
						value: row.category,
						onChange: (val) => onChange("category", val)
					}) }), /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(Field, {
						label: "Title slug (URL last segment)",
						children: /* @__PURE__ */ jsx("input", {
							id: "article-slug",
							name: "slug",
							"aria-label": "Title slug",
							autoComplete: "off",
							value: row.slug,
							onChange: (e) => onChange("slug", slugify(e.target.value)),
							placeholder: "auto from title",
							className: "w-full rounded-md border border-slate-200 px-3 py-2 font-mono text-sm focus:border-slate-900 focus:outline-none"
						})
					}) })]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "mt-4",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-600",
						children: [
							/* @__PURE__ */ jsx(MapPin, { className: "h-3.5 w-3.5" }),
							" Location",
							/* @__PURE__ */ jsx("span", {
								className: "font-normal normal-case text-slate-400",
								children: "— builds the URL's location segment"
							})
						]
					}), /* @__PURE__ */ jsxs("div", {
						className: "grid grid-cols-1 gap-2 md:grid-cols-3",
						children: [
							/* @__PURE__ */ jsx("input", {
								id: "article-city",
								name: "city",
								"aria-label": "City",
								autoComplete: "off",
								value: row.city,
								onChange: (e) => onChange("city", e.target.value),
								placeholder: "City",
								className: "w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none"
							}),
							/* @__PURE__ */ jsx("input", {
								id: "article-state",
								name: "state",
								"aria-label": "State",
								autoComplete: "off",
								value: row.state,
								onChange: (e) => onChange("state", e.target.value),
								placeholder: "State",
								className: "w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none"
							}),
							/* @__PURE__ */ jsx("input", {
								id: "article-country",
								name: "country",
								"aria-label": "Country",
								autoComplete: "off",
								value: row.country,
								onChange: (e) => onChange("country", e.target.value),
								placeholder: "Country",
								className: "w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none"
							})
						]
					})]
				}),
				/* @__PURE__ */ jsx("div", {
					className: "mt-4",
					children: /* @__PURE__ */ jsxs(Field, {
						label: "Excerpt / Summary",
						children: [/* @__PURE__ */ jsx("textarea", {
							id: "article-excerpt",
							name: "excerpt",
							"aria-label": "Excerpt / Summary",
							autoComplete: "off",
							rows: 3,
							maxLength: 200,
							value: row.excerpt,
							onChange: (e) => onChange("excerpt", e.target.value),
							placeholder: "Short summary shown in news grid (1-2 lines)...",
							className: "w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none"
						}), /* @__PURE__ */ jsxs("span", {
							className: "mt-1 block text-xs text-slate-400",
							children: [row.excerpt.length, " / 200"]
						})]
					})
				})
			]
		}), /* @__PURE__ */ jsxs("div", {
			className: "rounded-xl border border-slate-200 bg-white p-5 shadow-sm",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "mb-3 flex items-center justify-between",
				children: [/* @__PURE__ */ jsx("span", {
					className: "text-xs font-semibold uppercase tracking-wider text-slate-600",
					children: "Article Body"
				}), /* @__PURE__ */ jsx("span", {
					className: "text-[11px] text-slate-400",
					children: "Use the toolbar to format, embed and upload"
				})]
			}), /* @__PURE__ */ jsx(RichEditor, {
				value: row.content,
				onChange: (v) => onChange("content", v)
			})]
		})]
	});
}
//#endregion
//#region src/components/admin/articles/ArticleMediaTab.tsx
function ArticleMediaTab({ row, onChange }) {
	const defaultSiteName = useSiteSettings()?.siteName || "Today Tripura";
	const activeCredit = row.imageCredit?.trim() || defaultSiteName;
	const isAutoBengali = /[\u0980-\u09FF]/.test((row.title || "") + " " + (row.content || "") + " " + (row.excerpt || ""));
	const [langOverride, setLangOverride] = useState("auto");
	const isBengali = langOverride === "auto" ? isAutoBengali : langOverride === "bn";
	const PRESET_CAPTIONS = isBengali ? [
		{
			label: "প্রতীকী ছবি",
			value: "প্রতীকী ছবি"
		},
		{
			label: "ফাইল ছবি",
			value: "ফাইল ছবি"
		},
		{
			label: "ছবি: সংগৃহীত",
			value: "ছবি: সংগৃহীত"
		},
		{
			label: "ছবি: সোশ্যাল মিডিয়া",
			value: "ছবি: সোশ্যাল মিডিয়া"
		},
		{
			label: "নিজস্ব চিত্র",
			value: "নিজস্ব চিত্র"
		},
		{
			label: "সংগৃহীত",
			value: "সংগৃহীত"
		}
	] : [
		{
			label: "Representative Image",
			value: "Representative Image"
		},
		{
			label: "File Photo",
			value: "File Photo"
		},
		{
			label: "Staff Photo",
			value: "Staff Photo"
		},
		{
			label: "Social Media Photo",
			value: "Social Media Photo"
		},
		{
			label: "Collected from Web",
			value: "Collected from Web"
		},
		{
			label: "Press Handout",
			value: "Press Handout"
		}
	];
	const PRESET_CREDITS = isBengali ? [
		{
			label: defaultSiteName,
			value: defaultSiteName,
			icon: Building2,
			desc: "ওয়েবসাইট / নিউজরুম"
		},
		{
			label: "নিউজরুম ডেস্ক",
			value: "নিউজরুম ডেস্ক",
			icon: Camera,
			desc: "নিউজরুম স্টাফ"
		},
		{
			label: "সোশ্যাল মিডিয়া",
			value: "সোশ্যাল মিডিয়া",
			icon: Share2,
			desc: "সোশ্যাল মিডিয়া থেকে প্রাপ্ত"
		},
		{
			label: "ওয়েব থেকে সংগৃহীত",
			value: "ওয়েব থেকে সংগৃহীত",
			icon: Globe,
			desc: "অনলাইন উৎস"
		},
		{
			label: "এআই নির্মিত",
			value: "এআই নির্মিত",
			icon: Sparkles,
			desc: "কৃত্রিম বুদ্ধিমত্তা দ্বারা নির্মিত"
		}
	] : [
		{
			label: defaultSiteName,
			value: defaultSiteName,
			icon: Building2,
			desc: "Website / Newsroom"
		},
		{
			label: "Newsroom Desk",
			value: "Newsroom Desk",
			icon: Camera,
			desc: "Staff Photographer"
		},
		{
			label: "Social Media",
			value: "Social Media",
			icon: Share2,
			desc: "Collected from Social Media"
		},
		{
			label: "Collected from Web",
			value: "Collected from Web",
			icon: Globe,
			desc: "Online Source"
		},
		{
			label: "AI Generated",
			value: "AI Generated",
			icon: Sparkles,
			desc: "Generated with AI"
		}
	];
	return /* @__PURE__ */ jsxs("div", {
		className: "space-y-5",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-5",
			children: [/* @__PURE__ */ jsx(Field, {
				label: "Featured Image",
				children: /* @__PURE__ */ jsx(ImageInput, {
					value: row.featuredImage,
					onChange: (v) => onChange("featuredImage", v),
					hint: "Used as the hero image at the top of the post and default Open Graph image."
				})
			}), /* @__PURE__ */ jsxs("div", {
				className: "rounded-lg border border-slate-200 bg-slate-50/70 p-4 space-y-4",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-2 border-b border-slate-200/80 pb-2.5",
						children: [
							/* @__PURE__ */ jsx(Camera, { className: "h-4 w-4 text-slate-600" }),
							/* @__PURE__ */ jsx("span", {
								className: "text-xs font-bold uppercase tracking-wider text-slate-800",
								children: "Featured Image Caption & Source Credit"
							}),
							/* @__PURE__ */ jsx("span", {
								className: "ml-auto text-[11px] text-slate-400",
								children: "Shown beneath the photo on the article page"
							})
						]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "space-y-1.5",
						children: [
							/* @__PURE__ */ jsxs("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ jsx("label", {
									htmlFor: "article-image-caption",
									className: "block text-xs font-semibold text-slate-700",
									children: "Photo Caption / Description"
								}), /* @__PURE__ */ jsxs("div", {
									className: "flex items-center gap-1 text-[11px] text-slate-500",
									children: [/* @__PURE__ */ jsx("span", {
										className: "text-[10px] uppercase font-bold text-slate-400",
										children: "Language:"
									}), /* @__PURE__ */ jsx("button", {
										type: "button",
										onClick: () => setLangOverride(langOverride === "bn" ? "en" : "bn"),
										className: "rounded border border-slate-200 bg-white px-2 py-0.5 font-medium text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer",
										title: "Toggle preset language between Bengali and English",
										children: isBengali ? "🇧🇩 বাংলা (Bengali)" : "🇬🇧 English"
									})]
								})]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "flex flex-wrap items-center gap-1.5 pb-1",
								children: [
									/* @__PURE__ */ jsx("span", {
										className: "text-[10px] uppercase font-bold text-slate-500 mr-0.5",
										children: "Quick Defaults:"
									}),
									PRESET_CAPTIONS.map((preset) => {
										const isSelected = (row.imageCaption || "").trim() === preset.value;
										return /* @__PURE__ */ jsxs("button", {
											type: "button",
											onClick: () => onChange("imageCaption", preset.value),
											className: `inline-flex items-center gap-1 rounded-md px-2.5 py-0.5 text-[11px] font-medium transition cursor-pointer border ${isSelected ? "border-slate-900 bg-slate-900 text-white shadow-xs" : "border-slate-200 bg-white text-slate-700 hover:bg-slate-100 hover:border-slate-300"}`,
											children: [/* @__PURE__ */ jsx("span", { children: preset.label }), isSelected && /* @__PURE__ */ jsx(Check, { className: "h-2.5 w-2.5 stroke-[3]" })]
										}, preset.value);
									}),
									row.imageCaption && /* @__PURE__ */ jsx("button", {
										type: "button",
										onClick: () => onChange("imageCaption", ""),
										className: "text-[11px] text-slate-400 hover:text-red-500 transition-colors ml-1 underline cursor-pointer",
										children: "Clear"
									})
								]
							}),
							/* @__PURE__ */ jsx("input", {
								id: "article-image-caption",
								name: "imageCaption",
								type: "text",
								value: row.imageCaption || "",
								onChange: (e) => onChange("imageCaption", e.target.value),
								placeholder: isBengali ? "যেমন: প্রতীকী ছবি, ফাইল ছবি, বা নিজস্ব ক্যাপশন লিখুন..." : "e.g. Representative Image, File Photo, or enter custom caption...",
								className: "w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:outline-none"
							}),
							/* @__PURE__ */ jsx("p", {
								className: "text-[11px] text-slate-400",
								children: isBengali ? "উপরের দ্রুত বিকল্প নির্বাচন করুন অথবা আপনার নিজস্ব ক্যাপশন লিখুন।" : "Select a quick preset above or type your own description."
							})
						]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "space-y-2",
						children: [
							/* @__PURE__ */ jsxs("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ jsx("label", {
									htmlFor: "article-image-credit",
									className: "block text-xs font-semibold text-slate-700",
									children: "Photo Source / Credit Name"
								}), /* @__PURE__ */ jsxs("span", {
									className: "text-[11px] text-slate-400",
									children: ["Default: ", /* @__PURE__ */ jsx("strong", {
										className: "text-slate-600 font-medium",
										children: defaultSiteName
									})]
								})]
							}),
							/* @__PURE__ */ jsx("div", {
								className: "flex flex-wrap items-center gap-1.5",
								children: PRESET_CREDITS.map((preset) => {
									const isSelected = (row.imageCredit || "").toLowerCase() === preset.value.toLowerCase() || !row.imageCredit && preset.value === defaultSiteName;
									const Icon = preset.icon;
									return /* @__PURE__ */ jsxs("button", {
										type: "button",
										onClick: () => onChange("imageCredit", preset.value),
										className: `inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[11px] font-medium transition cursor-pointer border ${isSelected ? "border-slate-900 bg-slate-900 text-white shadow-xs" : "border-slate-200 bg-white text-slate-700 hover:bg-slate-100 hover:border-slate-300"}`,
										title: preset.desc,
										children: [
											/* @__PURE__ */ jsx(Icon, { className: "h-3 w-3 shrink-0" }),
											/* @__PURE__ */ jsx("span", { children: preset.label }),
											isSelected && /* @__PURE__ */ jsx(Check, { className: "h-2.5 w-2.5 stroke-[3]" })
										]
									}, preset.value);
								})
							}),
							/* @__PURE__ */ jsx("div", {
								className: "pt-1",
								children: /* @__PURE__ */ jsx("input", {
									id: "article-image-credit",
									name: "imageCredit",
									type: "text",
									value: row.imageCredit || "",
									onChange: (e) => onChange("imageCredit", e.target.value),
									placeholder: `Custom source name (leave blank for default: ${defaultSiteName})...`,
									className: "w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:outline-none"
								})
							})
						]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "rounded-md border border-amber-200/70 bg-amber-50/60 p-3 text-xs space-y-1",
						children: [/* @__PURE__ */ jsxs("span", {
							className: "text-[10px] font-bold uppercase tracking-wider text-amber-800 flex items-center gap-1",
							children: [/* @__PURE__ */ jsx(Info, { className: "h-3 w-3 text-amber-600" }), " Post View Preview"]
						}), /* @__PURE__ */ jsxs("div", {
							className: "text-slate-600 italic",
							children: [
								row.imageCaption?.trim() ? /* @__PURE__ */ jsx("span", { children: row.imageCaption.trim() }) : /* @__PURE__ */ jsx("span", {
									className: "text-slate-400 not-italic",
									children: "(No caption entered)"
								}),
								/* @__PURE__ */ jsx("span", {
									className: "mx-2 not-italic text-slate-300",
									children: "|"
								}),
								/* @__PURE__ */ jsx("span", {
									className: "not-italic font-bold uppercase tracking-wider text-slate-800",
									children: activeCredit
								})
							]
						})]
					})
				]
			})]
		}), /* @__PURE__ */ jsx("div", {
			className: "rounded-xl border border-slate-200 bg-white p-5 shadow-sm",
			children: /* @__PURE__ */ jsx(Field, {
				label: `Open Graph Image ${row.ogImage ? "" : "(defaults to Featured Image)"}`,
				children: /* @__PURE__ */ jsx(ImageInput, {
					value: row.ogImage,
					onChange: (v) => onChange("ogImage", v),
					hint: "Override only if you want a different image when shared on social media. Recommended 1200×630."
				})
			})
		})]
	});
}
//#endregion
//#region src/components/admin/articles/ArticleSeoTab.tsx
var COMMON_TAGS = [
	"Tripura",
	"Agartala",
	"Northeast",
	"Breaking News",
	"Politics",
	"Development",
	"Technology",
	"Business",
	"Education",
	"Sports"
];
function ArticleSeoTab({ row, onChange, fullUrl }) {
	const [inputVal, setInputVal] = useState("");
	const tags = useMemo(() => {
		return (row.tags || "").split(",").map((t) => t.trim()).filter(Boolean);
	}, [row.tags]);
	const addTag = (rawTag) => {
		const cleaned = rawTag.trim().replace(/^,+|,+$/g, "");
		if (!cleaned) return;
		const incoming = cleaned.split(",").map((t) => t.trim()).filter(Boolean);
		const next = [...tags];
		for (const t of incoming) if (!next.some((existing) => existing.toLowerCase() === t.toLowerCase())) next.push(t);
		onChange("tags", next.join(", "));
		setInputVal("");
	};
	const removeTag = (tagToRemove) => {
		onChange("tags", tags.filter((t) => t.toLowerCase() !== tagToRemove.toLowerCase()).join(", "));
	};
	const handleKeyDown = (e) => {
		if (e.key === "Enter" || e.key === ",") {
			e.preventDefault();
			if (inputVal.trim()) addTag(inputVal);
		} else if (e.key === "Backspace" && !inputVal && tags.length > 0) removeTag(tags[tags.length - 1]);
	};
	const handleInputChange = (val) => {
		if (val.includes(",")) addTag(val);
		else setInputVal(val);
	};
	return /* @__PURE__ */ jsxs("div", {
		className: "space-y-5",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-4",
			children: [
				/* @__PURE__ */ jsxs(Field, {
					label: "Meta Title",
					children: [/* @__PURE__ */ jsx("input", {
						id: "article-meta-title",
						name: "metaTitle",
						"aria-label": "Meta Title",
						value: row.metaTitle,
						onChange: (e) => onChange("metaTitle", e.target.value),
						placeholder: row.title || "Defaults to article title",
						className: "w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none"
					}), /* @__PURE__ */ jsxs("span", {
						className: "mt-1 block text-xs text-slate-400",
						children: [row.metaTitle.length, " / 60 chars recommended"]
					})]
				}),
				/* @__PURE__ */ jsxs(Field, {
					label: "Meta Description",
					children: [/* @__PURE__ */ jsx("textarea", {
						id: "article-meta-description",
						name: "metaDescription",
						"aria-label": "Meta Description",
						value: row.metaDescription,
						onChange: (e) => onChange("metaDescription", e.target.value),
						rows: 3,
						placeholder: "Search engine description (~155 chars)...",
						className: "w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none"
					}), /* @__PURE__ */ jsxs("span", {
						className: "mt-1 block text-xs text-slate-400",
						children: [row.metaDescription.length, " / 160 chars recommended"]
					})]
				}),
				/* @__PURE__ */ jsx(Field, {
					label: "Tags",
					children: /* @__PURE__ */ jsxs("div", {
						className: "space-y-2.5",
						children: [
							/* @__PURE__ */ jsxs("div", {
								className: "flex flex-wrap items-center gap-1.5 min-h-[46px] w-full rounded-lg border border-slate-200 bg-white p-2 focus-within:border-slate-900 focus-within:ring-1 focus-within:ring-slate-900 transition-colors",
								children: [
									/* @__PURE__ */ jsx(Tag, { className: "h-4 w-4 text-slate-400 ml-1 shrink-0" }),
									tags.map((tag) => /* @__PURE__ */ jsxs("span", {
										className: "inline-flex items-center gap-1 rounded-md bg-indigo-50 border border-indigo-200/80 px-2.5 py-1 text-xs font-semibold text-indigo-700 shadow-xs animate-in fade-in",
										children: [/* @__PURE__ */ jsx("span", { children: tag }), /* @__PURE__ */ jsx("button", {
											type: "button",
											onClick: () => removeTag(tag),
											className: "grid h-3.5 w-3.5 place-items-center rounded hover:bg-indigo-200/60 text-indigo-500 hover:text-indigo-800 transition-colors",
											title: `Remove ${tag}`,
											children: /* @__PURE__ */ jsx(X, { className: "h-3 w-3" })
										})]
									}, tag)),
									/* @__PURE__ */ jsx("input", {
										id: "article-tags",
										name: "tags",
										"aria-label": "Add tags",
										value: inputVal,
										onChange: (e) => handleInputChange(e.target.value),
										onKeyDown: handleKeyDown,
										onBlur: () => {
											if (inputVal.trim()) addTag(inputVal);
										},
										placeholder: tags.length === 0 ? "Type tag name and press Enter (or comma)..." : "Add another tag...",
										className: "flex-1 min-w-[160px] bg-transparent text-sm focus:outline-none px-1.5 py-0.5"
									})
								]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500",
								children: [/* @__PURE__ */ jsxs("p", { children: [
									"Press ",
									/* @__PURE__ */ jsx("kbd", {
										className: "rounded bg-slate-100 border border-slate-200 px-1 py-0.5 font-mono text-[10px] text-slate-700",
										children: "Enter"
									}),
									" or type a ",
									/* @__PURE__ */ jsx("kbd", {
										className: "rounded bg-slate-100 border border-slate-200 px-1 py-0.5 font-mono text-[10px] text-slate-700",
										children: ","
									}),
									" to create a tag."
								] }), tags.length > 0 && /* @__PURE__ */ jsxs("button", {
									type: "button",
									onClick: () => onChange("tags", ""),
									className: "text-xs text-rose-600 hover:underline",
									children: [
										"Clear all (",
										tags.length,
										")"
									]
								})]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "pt-1",
								children: [/* @__PURE__ */ jsx("span", {
									className: "text-[11px] font-medium text-slate-400 mr-2",
									children: "Suggestions:"
								}), /* @__PURE__ */ jsx("div", {
									className: "inline-flex flex-wrap gap-1 mt-1",
									children: COMMON_TAGS.filter((ct) => !tags.some((t) => t.toLowerCase() === ct.toLowerCase())).slice(0, 7).map((suggested) => /* @__PURE__ */ jsxs("button", {
										type: "button",
										onClick: () => addTag(suggested),
										className: "inline-flex items-center gap-0.5 rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] text-slate-600 hover:border-slate-300 hover:bg-slate-100 transition-colors",
										children: [/* @__PURE__ */ jsx(Plus, { className: "h-2.5 w-2.5 text-slate-400" }), suggested]
									}, suggested))
								})]
							})
						]
					})
				})
			]
		}), /* @__PURE__ */ jsxs("div", {
			className: "rounded-xl border border-slate-200 bg-white p-5 shadow-sm",
			children: [
				/* @__PURE__ */ jsx("p", {
					className: "text-xs font-semibold uppercase tracking-wider text-slate-500",
					children: "Search preview"
				}),
				/* @__PURE__ */ jsx("p", {
					className: "mt-2 truncate text-base text-blue-700",
					children: row.metaTitle || row.title || "Article title"
				}),
				/* @__PURE__ */ jsx("p", {
					className: "truncate text-xs text-emerald-700",
					children: fullUrl
				}),
				/* @__PURE__ */ jsx("p", {
					className: "mt-1 line-clamp-2 text-sm text-slate-600",
					children: row.metaDescription || row.excerpt || "Article description preview..."
				})
			]
		})]
	});
}
//#endregion
//#region src/components/admin/articles/ArticleSettingsTab.tsx
function ArticleSettingsTab({ row, onChange, currentUserAuthor = "Admin User", authorOptions = [], isEnterprisePlus }) {
	const editorialDefaults = [
		currentUserAuthor,
		"Newsroom Desk",
		"Staff Reporter",
		"Editorial Desk",
		"Special Correspondent"
	].filter(Boolean);
	const allAuthorNames = Array.from(/* @__PURE__ */ new Set([
		currentUserAuthor,
		...editorialDefaults,
		...(authorOptions || []).map((a) => a.name)
	])).filter(Boolean);
	const handleSetNow = () => {
		const now = /* @__PURE__ */ new Date();
		const pad = (n) => String(n).padStart(2, "0");
		onChange("date", `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(now.getMinutes())}`);
		onChange("status", "Published");
		toast.success("Publish date set to Now · Status set to Published");
	};
	const handleSchedulePlus1Hr = () => {
		const d = new Date(Date.now() + 3600 * 1e3);
		const pad = (n) => String(n).padStart(2, "0");
		onChange("date", `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`);
		onChange("status", "Scheduled");
		toast.info("Scheduled for +1 hour");
	};
	const handleScheduleTomorrowMorning = () => {
		const d = /* @__PURE__ */ new Date();
		d.setDate(d.getDate() + 1);
		d.setHours(9, 0, 0, 0);
		const pad = (n) => String(n).padStart(2, "0");
		onChange("date", `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T09:00`);
		onChange("status", "Scheduled");
		toast.info("Scheduled for tomorrow 9:00 AM");
	};
	const handleScheduleTomorrowEvening = () => {
		const d = /* @__PURE__ */ new Date();
		d.setDate(d.getDate() + 1);
		d.setHours(18, 0, 0, 0);
		const pad = (n) => String(n).padStart(2, "0");
		onChange("date", `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T18:00`);
		onChange("status", "Scheduled");
		toast.info("Scheduled for tomorrow 6:00 PM");
	};
	const isFutureDate = Boolean(row.date && !isNaN(new Date(row.date).getTime()) && new Date(row.date).getTime() > Date.now() + 60 * 1e3);
	const isScheduled = row.status === "Scheduled" || isFutureDate;
	const [isCustomAuthor, setIsCustomAuthor] = React.useState(() => {
		if (!row.author) return false;
		return !allAuthorNames.some((n) => n.trim().toLowerCase() === row.author.trim().toLowerCase());
	});
	React.useEffect(() => {
		if (!row.author) setIsCustomAuthor(false);
		else setIsCustomAuthor(!allAuthorNames.some((n) => n.trim().toLowerCase() === row.author.trim().toLowerCase()));
	}, [row.id, row.author]);
	return /* @__PURE__ */ jsxs("div", {
		className: "rounded-xl border border-slate-200 bg-white p-5 shadow-sm",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "grid grid-cols-1 gap-4 md:grid-cols-2",
			children: [
				/* @__PURE__ */ jsx(Field, {
					label: "News Type",
					children: /* @__PURE__ */ jsxs("select", {
						id: "article-news-type",
						name: "newsType",
						"aria-label": "News Type",
						value: row.newsType,
						onChange: (e) => onChange("newsType", e.target.value),
						className: "w-full rounded-md border border-slate-200 px-3 py-2 text-sm",
						children: [
							/* @__PURE__ */ jsx("option", { children: "Standard" }),
							/* @__PURE__ */ jsx("option", { children: "Breaking" }),
							/* @__PURE__ */ jsx("option", { children: "Featured" }),
							/* @__PURE__ */ jsx("option", { children: "Exclusive" }),
							/* @__PURE__ */ jsx("option", { children: "Opinion" }),
							/* @__PURE__ */ jsx("option", { children: "Video" })
						]
					})
				}),
				/* @__PURE__ */ jsx(Field, {
					label: "Author *",
					children: /* @__PURE__ */ jsxs("div", {
						className: "space-y-2",
						children: [
							/* @__PURE__ */ jsxs("div", {
								className: "flex items-center justify-between gap-2 pb-0.5",
								children: [/* @__PURE__ */ jsxs("div", {
									className: "flex flex-wrap items-center gap-1",
									children: [/* @__PURE__ */ jsx("span", {
										className: "text-[10px] uppercase font-bold text-slate-400 mr-0.5",
										children: "Quick:"
									}), editorialDefaults.slice(0, 3).map((name) => {
										const isSelected = row.author?.trim().toLowerCase() === name.trim().toLowerCase();
										return /* @__PURE__ */ jsxs("button", {
											type: "button",
											onClick: () => {
												onChange("author", name);
												setIsCustomAuthor(false);
											},
											className: `inline-flex items-center gap-1 rounded px-2 py-0.5 text-[11px] font-medium transition cursor-pointer border ${isSelected ? "border-slate-900 bg-slate-900 text-white" : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"}`,
											children: [/* @__PURE__ */ jsx("span", { children: name === currentUserAuthor ? `🟢 ${name}` : name }), isSelected && /* @__PURE__ */ jsx(Check, { className: "h-2.5 w-2.5 stroke-[3]" })]
										}, name);
									})]
								}), /* @__PURE__ */ jsx("button", {
									type: "button",
									onClick: () => setIsCustomAuthor((prev) => !prev),
									className: "text-[11px] font-medium text-blue-600 hover:text-blue-800 transition cursor-pointer shrink-0 underline",
									children: isCustomAuthor ? "Choose from list" : "Type custom"
								})]
							}),
							!isCustomAuthor ? /* @__PURE__ */ jsxs("select", {
								id: "article-author-select",
								name: "author",
								"aria-label": "Author Profile",
								value: allAuthorNames.some((n) => n.trim().toLowerCase() === row.author?.trim().toLowerCase()) ? allAuthorNames.find((n) => n.trim().toLowerCase() === row.author?.trim().toLowerCase()) || "" : "",
								onChange: (e) => {
									if (e.target.value === "__custom__") setIsCustomAuthor(true);
									else if (e.target.value) onChange("author", e.target.value);
								},
								className: "w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:border-slate-900 focus:outline-none",
								children: [
									/* @__PURE__ */ jsx("option", {
										value: "",
										children: "⚡ Select profile or editorial desk..."
									}),
									currentUserAuthor && /* @__PURE__ */ jsxs("option", {
										value: currentUserAuthor,
										children: [
											"🟢 ",
											currentUserAuthor,
											" (Your Profile)"
										]
									}),
									authorOptions && authorOptions.length > 0 && /* @__PURE__ */ jsx("optgroup", {
										label: "Registered Authors",
										children: authorOptions.map((a) => /* @__PURE__ */ jsxs("option", {
											value: a.name,
											children: [
												"👤 ",
												a.name,
												" (",
												a.role,
												a.username ? ` • @${a.username}` : "",
												")"
											]
										}, a.id))
									}),
									/* @__PURE__ */ jsxs("optgroup", {
										label: "Editorial Desks",
										children: [
											/* @__PURE__ */ jsx("option", {
												value: "Newsroom Desk",
												children: "Newsroom Desk"
											}),
											/* @__PURE__ */ jsx("option", {
												value: "Staff Reporter",
												children: "Staff Reporter"
											}),
											/* @__PURE__ */ jsx("option", {
												value: "Editorial Desk",
												children: "Editorial Desk"
											}),
											/* @__PURE__ */ jsx("option", {
												value: "Special Correspondent",
												children: "Special Correspondent"
											})
										]
									}),
									/* @__PURE__ */ jsx("option", {
										value: "__custom__",
										children: "✏️ Custom Author Name (Type custom)..."
									})
								]
							}) : /* @__PURE__ */ jsx("div", {
								className: "relative",
								children: /* @__PURE__ */ jsx("input", {
									id: "article-custom-author",
									name: "article_custom_byline",
									"aria-label": "Author",
									type: "text",
									autoComplete: "new-password",
									"data-lpignore": "true",
									"data-form-type": "other",
									spellCheck: false,
									value: row.author,
									placeholder: "Enter author or agency name (e.g. PTI, Staff Reporter)...",
									onChange: (e) => onChange("author", e.target.value),
									className: "w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-slate-900 focus:outline-none",
									autoFocus: true
								})
							}),
							/* @__PURE__ */ jsx("p", {
								className: "text-[11px] text-slate-400",
								children: isCustomAuthor ? "Type any reporter or agency name. Click 'Choose from list' to select a profile." : `Selected author: ${row.author || "None"} — Click 'Type custom' to type any custom byline.`
							})
						]
					})
				}),
				/* @__PURE__ */ jsx(Field, {
					label: "Status",
					children: /* @__PURE__ */ jsxs("select", {
						id: "article-status",
						name: "status",
						"aria-label": "Status",
						value: row.status,
						onChange: (e) => {
							const nextStatus = e.target.value;
							onChange("status", nextStatus);
							const now = /* @__PURE__ */ new Date();
							const pad = (n) => String(n).padStart(2, "0");
							const localNow = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(now.getMinutes())}`;
							if (nextStatus === "Scheduled") {
								const currentTime = row.date ? new Date(row.date).getTime() : 0;
								if (!currentTime || currentTime <= Date.now() + 60 * 1e3) {
									const plus1Hr = new Date(Date.now() + 3600 * 1e3);
									onChange("date", `${plus1Hr.getFullYear()}-${pad(plus1Hr.getMonth() + 1)}-${pad(plus1Hr.getDate())}T${pad(plus1Hr.getHours())}:${pad(plus1Hr.getMinutes())}`);
									toast.info("Status set to Scheduled · Date set to +1 hour");
								}
							} else if (nextStatus === "Published") {
								if ((row.date ? new Date(row.date).getTime() : 0) > Date.now() + 60 * 1e3) {
									onChange("date", localNow);
									toast.info("Status set to Published · Date set to Now");
								}
							}
						},
						className: "w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none",
						children: [
							/* @__PURE__ */ jsx("option", { children: "Published" }),
							/* @__PURE__ */ jsx("option", { children: "Scheduled" }),
							/* @__PURE__ */ jsx("option", { children: "Draft" }),
							/* @__PURE__ */ jsx("option", { children: "Review" }),
							row.status === "Trash" && /* @__PURE__ */ jsx("option", { children: "Trash" })
						]
					})
				}),
				/* @__PURE__ */ jsx(Field, {
					label: "Access Level",
					children: /* @__PURE__ */ jsxs("select", {
						id: "article-access-level",
						name: "access_level",
						"aria-label": "Access Level",
						value: row.access_level,
						onChange: (e) => onChange("access_level", e.target.value),
						className: "w-full rounded-md border border-slate-200 px-3 py-2 text-sm",
						children: [/* @__PURE__ */ jsx("option", {
							value: "Free",
							children: "Free (All users)"
						}), /* @__PURE__ */ jsx("option", {
							value: "Premium",
							children: "Premium (Admin / Editor / Author only)"
						})]
					})
				}),
				/* @__PURE__ */ jsx(Field, {
					label: "Publish Date",
					children: /* @__PURE__ */ jsxs("div", {
						className: "space-y-2",
						children: [
							/* @__PURE__ */ jsxs("div", {
								className: "flex gap-2 items-center",
								children: [/* @__PURE__ */ jsx("input", {
									id: "article-publish-date",
									name: "date",
									"aria-label": "Publish Date",
									type: "datetime-local",
									value: formatDateTimeLocal(row.date),
									onChange: (e) => {
										const val = e.target.value;
										onChange("date", val);
										if (val) {
											if (new Date(val).getTime() > Date.now() + 60 * 1e3) onChange("status", "Scheduled");
											else if (row.status === "Scheduled") onChange("status", "Published");
										}
									},
									className: "flex-1 rounded-md border border-slate-200 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none"
								}), /* @__PURE__ */ jsxs("button", {
									type: "button",
									onClick: handleSetNow,
									className: "shrink-0 inline-flex items-center gap-1 rounded-md border border-slate-200 bg-slate-50 hover:bg-slate-100 px-2.5 py-2 text-xs font-semibold text-slate-700 transition cursor-pointer shadow-xs active:scale-95",
									title: "Set publish date to current local date and time and status to Published",
									children: [/* @__PURE__ */ jsx(Clock, { className: "h-3.5 w-3.5 text-slate-500" }), /* @__PURE__ */ jsx("span", { children: "Now" })]
								})]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "flex flex-wrap items-center gap-1.5 pt-0.5",
								children: [
									/* @__PURE__ */ jsx("span", {
										className: "text-[10px] uppercase font-bold text-slate-400 mr-0.5",
										children: "Schedule:"
									}),
									/* @__PURE__ */ jsxs("button", {
										type: "button",
										onClick: handleSchedulePlus1Hr,
										className: "inline-flex items-center gap-1 rounded border border-blue-200 bg-blue-50 px-2.5 py-1 text-[11px] font-medium text-blue-700 hover:bg-blue-100 transition cursor-pointer shadow-xs active:scale-95",
										children: [/* @__PURE__ */ jsx(CalendarClock, { className: "h-3 w-3" }), /* @__PURE__ */ jsx("span", { children: "+1 Hr" })]
									}),
									/* @__PURE__ */ jsx("button", {
										type: "button",
										onClick: handleScheduleTomorrowMorning,
										className: "inline-flex items-center gap-1 rounded border border-blue-200 bg-blue-50 px-2.5 py-1 text-[11px] font-medium text-blue-700 hover:bg-blue-100 transition cursor-pointer shadow-xs active:scale-95",
										children: /* @__PURE__ */ jsx("span", { children: "Tomorrow 9 AM" })
									}),
									/* @__PURE__ */ jsx("button", {
										type: "button",
										onClick: handleScheduleTomorrowEvening,
										className: "inline-flex items-center gap-1 rounded border border-blue-200 bg-blue-50 px-2.5 py-1 text-[11px] font-medium text-blue-700 hover:bg-blue-100 transition cursor-pointer shadow-xs active:scale-95",
										children: /* @__PURE__ */ jsx("span", { children: "Tomorrow 6 PM" })
									})
								]
							}),
							isScheduled && /* @__PURE__ */ jsxs("div", {
								className: "rounded-lg border border-blue-200 bg-blue-50/80 p-3 text-xs text-blue-900 flex items-center justify-between gap-3 shadow-xs",
								children: [/* @__PURE__ */ jsxs("div", {
									className: "flex items-start gap-2.5 min-w-0",
									children: [/* @__PURE__ */ jsx(CalendarClock, { className: "h-4 w-4 text-blue-600 shrink-0 mt-0.5" }), /* @__PURE__ */ jsxs("div", {
										className: "space-y-0.5 min-w-0",
										children: [/* @__PURE__ */ jsx("div", {
											className: "font-semibold text-blue-900",
											children: "Scheduled for auto-publishing:"
										}), /* @__PURE__ */ jsx("div", {
											className: "text-slate-700 font-medium truncate",
											children: new Date(row.date).toLocaleString(void 0, {
												weekday: "short",
												year: "numeric",
												month: "short",
												day: "numeric",
												hour: "2-digit",
												minute: "2-digit"
											})
										})]
									})]
								}), /* @__PURE__ */ jsx("button", {
									type: "button",
									onClick: handleSetNow,
									className: "shrink-0 rounded-md border border-blue-300 bg-white hover:bg-blue-100/70 px-2.5 py-1 text-[11px] font-semibold text-blue-800 transition cursor-pointer shadow-xs active:scale-95",
									title: "Override schedule and publish immediately",
									children: "Publish Now Instead"
								})]
							}),
							/* @__PURE__ */ jsx("p", {
								className: "text-[11px] text-slate-400",
								children: "Articles set to Now or in the past appear immediately. Future dates schedule the article to go live automatically at the selected time."
							})
						]
					})
				}),
				isEnterprisePlus && /* @__PURE__ */ jsx(Field, {
					label: "Post Views",
					children: /* @__PURE__ */ jsx("input", {
						id: "article-views",
						name: "views",
						"aria-label": "Post Views",
						type: "number",
						min: 0,
						value: row.views,
						onChange: (e) => onChange("views", Number(e.target.value) || 0),
						className: "w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
					})
				}),
				/* @__PURE__ */ jsx(Field, {
					label: "Featured on homepage",
					children: /* @__PURE__ */ jsxs("label", {
						className: "flex h-9 items-center gap-2 rounded-md border border-slate-200 px-3 text-sm",
						children: [/* @__PURE__ */ jsx("input", {
							id: "article-featured",
							name: "featured",
							"aria-label": "Pin to hero / featured slot",
							type: "checkbox",
							checked: row.featured,
							onChange: (e) => onChange("featured", e.target.checked)
						}), "Pin to hero / featured slot"]
					})
				})
			]
		}), /* @__PURE__ */ jsx("div", {
			className: "mt-4 border-t border-slate-100 pt-4",
			children: /* @__PURE__ */ jsx(JournalistPicker, {
				journalistId: row.journalistId,
				journalistName: row.journalistName,
				onSelect: (j) => {
					onChange("journalistId", j?.publicUserId ?? "");
					onChange("journalistName", j?.displayName ?? "");
					if (j?.displayName) onChange("author", j.displayName);
				}
			})
		})]
	});
}
//#endregion
//#region src/components/admin/ArticleEditor.tsx
function ArticleEditor({ initial, currentUserAuthor, authorOptions, onClose, onSave }) {
	const planType = (useSiteSettings().licenseType || "").toLowerCase();
	const isEnterprise = planType.includes("enterprise");
	const isEnterprisePlus = planType.includes("enterprise+") || planType.includes("enterprise plus");
	const normalizeRow = (raw) => ({
		...raw,
		title: raw.title || "",
		slug: raw.slug || "",
		category: raw.category || "Uncategorized",
		city: raw.city || "",
		state: raw.state || "",
		country: raw.country || "",
		author: raw.author || currentUserAuthor || "Admin User",
		excerpt: raw.excerpt || "",
		content: raw.content || "",
		featuredImage: raw.featuredImage || "",
		ogImage: raw.ogImage || "",
		imageCaption: raw.imageCaption || "",
		imageCredit: raw.imageCredit || "",
		metaTitle: raw.metaTitle || "",
		metaDescription: raw.metaDescription || "",
		tags: raw.tags || "",
		date: raw.date || (/* @__PURE__ */ new Date()).toISOString(),
		views: raw.views || 0,
		featured: !!raw.featured,
		newsType: raw.newsType || "Standard",
		journalistId: raw.journalistId || "",
		journalistName: raw.journalistName || "",
		access_level: raw.access_level || "Free"
	});
	const [r, setR] = useState(() => normalizeRow(initial));
	const [tab, setTab] = useState("content");
	const [showAiModal, setShowAiModal] = useState(false);
	useEffect(() => {
		if (initial) setR(normalizeRow(initial));
	}, [initial, currentUserAuthor]);
	const set = (k, v) => setR((p) => ({
		...p,
		[k]: v
	}));
	const handleApplyAi = (generatedAiData) => {
		setR((prev) => ({
			...prev,
			content: generatedAiData.body || prev.content,
			excerpt: generatedAiData.excerpt || prev.excerpt,
			city: generatedAiData.location?.city || prev.city,
			state: generatedAiData.location?.state || prev.state,
			country: generatedAiData.location?.country || prev.country,
			metaTitle: generatedAiData.metaTitle || prev.metaTitle,
			metaDescription: generatedAiData.metaDescription || prev.metaDescription,
			tags: Array.isArray(generatedAiData.tags) && generatedAiData.tags.length > 0 ? generatedAiData.tags.join(",") : prev.tags
		}));
		setShowAiModal(false);
		toast.success("AI Content applied successfully!");
	};
	const isScheduled = r.status === "Scheduled" || Boolean(r.date && !isNaN(new Date(r.date).getTime()) && new Date(r.date).getTime() > Date.now() + 60 * 1e3);
	const handleSave = (status, explicitDate) => {
		if (!r.title.trim()) return toast.error("Title is required");
		if (!r.author.trim()) return toast.error("Author is required");
		onSave({
			...r,
			...status ? { status } : {},
			...explicitDate ? { date: explicitDate } : {}
		});
	};
	const handlePublishNow = () => {
		const now = /* @__PURE__ */ new Date();
		const pad = (n) => String(n).padStart(2, "0");
		handleSave("Published", `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(now.getMinutes())}`);
	};
	const url = fullUrl(r);
	const getProtocol = () => typeof window !== "undefined" ? window.location.protocol : "http:";
	const copyUrl = async () => {
		try {
			const protocol = getProtocol();
			await navigator.clipboard.writeText(`${protocol}//${url}`);
			toast.success("URL copied");
		} catch {
			toast.error("Copy failed");
		}
	};
	const tabs = [
		{
			id: "content",
			label: "Content",
			icon: FileText
		},
		{
			id: "media",
			label: "Media",
			icon: Image
		},
		{
			id: "seo",
			label: "SEO & Social",
			icon: Share2
		},
		{
			id: "settings",
			label: "Settings",
			icon: Settings
		}
	];
	const order = [
		"content",
		"media",
		"seo",
		"settings"
	];
	const idx = order.indexOf(tab);
	const isLast = tab === "settings";
	const isFirst = idx === 0;
	const prevTab = order[idx - 1];
	const nextTab = order[idx + 1];
	return /* @__PURE__ */ jsxs("div", {
		className: "fixed inset-0 z-50 grid place-items-center bg-slate-950/60 p-4 backdrop-blur-sm",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "flex max-h-[94vh] w-full max-w-6xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-slate-200",
			children: [
				/* @__PURE__ */ jsxs("div", {
					className: "relative border-b border-slate-200 bg-gradient-to-br from-slate-50 to-white px-6 py-4",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "flex items-start justify-between gap-4",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "min-w-0",
							children: [
								/* @__PURE__ */ jsxs("div", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ jsxs("span", {
										className: "inline-flex h-7 items-center gap-1.5 rounded-full bg-slate-900 px-3 text-[11px] font-semibold uppercase tracking-wider text-white",
										children: [
											/* @__PURE__ */ jsx(Sparkles, { className: "h-3 w-3" }),
											" ",
											initial.title ? "Edit" : "New"
										]
									}), /* @__PURE__ */ jsx("span", {
										className: `rounded-full border px-2 py-0.5 text-[11px] font-medium ${statusStyle[r.status]}`,
										children: r.status
									})]
								}),
								/* @__PURE__ */ jsx("h2", {
									className: "mt-2 truncate text-xl font-bold text-slate-900",
									children: r.title || "Untitled article"
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "mt-2 flex items-center gap-2 text-xs",
									children: [
										/* @__PURE__ */ jsx(Link, { className: "h-3.5 w-3.5 text-slate-400" }),
										/* @__PURE__ */ jsx("a", {
											href: `${getProtocol()}//${url}`,
											target: "_blank",
											rel: "noopener noreferrer",
											className: "truncate font-mono text-emerald-700 hover:text-emerald-800 hover:underline",
											children: url
										}),
										/* @__PURE__ */ jsx("button", {
											onClick: copyUrl,
											className: "rounded border border-slate-200 bg-white px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-slate-600 hover:bg-slate-50",
											children: "Copy"
										})
									]
								})
							]
						}), /* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-2",
							children: [
								/* @__PURE__ */ jsxs("button", {
									type: "button",
									onClick: () => handleSave("Draft"),
									className: "hidden md:inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition shadow-xs cursor-pointer",
									title: "Save current progress as draft",
									children: [/* @__PURE__ */ jsx(FileText, { className: "h-3.5 w-3.5 text-slate-500" }), /* @__PURE__ */ jsx("span", { children: "Save Draft" })]
								}),
								isScheduled ? /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx("button", {
									type: "button",
									onClick: handlePublishNow,
									className: "hidden lg:inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-800 hover:bg-slate-100 transition shadow-xs cursor-pointer",
									title: "Override schedule and publish immediately",
									children: /* @__PURE__ */ jsx("span", { children: "Publish Now" })
								}), /* @__PURE__ */ jsxs("button", {
									type: "button",
									onClick: () => handleSave("Scheduled"),
									className: "inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 transition shadow-sm cursor-pointer",
									title: "Save as scheduled post",
									children: [/* @__PURE__ */ jsx(CalendarClock, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ jsx("span", { children: "Schedule Post" })]
								})] }) : /* @__PURE__ */ jsxs("button", {
									type: "button",
									onClick: () => handleSave("Published"),
									className: "inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-800 transition shadow-sm cursor-pointer",
									children: [/* @__PURE__ */ jsx(Send, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ jsx("span", { children: "Publish" })]
								}),
								/* @__PURE__ */ jsxs("button", {
									type: "button",
									onClick: () => setShowAiModal(true),
									className: "flex items-center gap-1.5 rounded-lg bg-indigo-50 px-3 py-1.5 text-xs font-bold text-indigo-700 hover:bg-indigo-100 hover:text-indigo-900 transition-colors border border-indigo-100 shadow-xs cursor-pointer",
									children: [/* @__PURE__ */ jsx(Sparkles, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ jsx("span", {
										className: "hidden sm:inline",
										children: "AI News Assistant"
									})]
								}),
								/* @__PURE__ */ jsx("button", {
									type: "button",
									onClick: onClose,
									className: "grid h-9 w-9 shrink-0 place-items-center rounded-md hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition cursor-pointer",
									"aria-label": "Close",
									children: /* @__PURE__ */ jsx(X, { className: "h-4 w-4" })
								})
							]
						})]
					}), /* @__PURE__ */ jsx("div", {
						className: "mt-4 flex flex-wrap gap-1.5",
						children: tabs.map((t) => {
							const Icon = t.icon;
							return /* @__PURE__ */ jsxs("button", {
								onClick: () => setTab(t.id),
								className: `inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium transition-all ${tab === t.id ? "bg-slate-900 text-white shadow-sm" : "border border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-900"}`,
								children: [
									/* @__PURE__ */ jsx(Icon, { className: "h-3.5 w-3.5" }),
									" ",
									t.label
								]
							}, t.id);
						})
					})]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "flex-1 overflow-y-auto bg-slate-50/50 px-6 py-6",
					children: [
						tab === "content" && /* @__PURE__ */ jsx(ArticleContentTab, {
							row: r,
							onChange: set,
							autoSlug: !initial.title
						}),
						tab === "media" && /* @__PURE__ */ jsx(ArticleMediaTab, {
							row: r,
							onChange: set
						}),
						tab === "seo" && /* @__PURE__ */ jsx(ArticleSeoTab, {
							row: r,
							onChange: set,
							fullUrl: url
						}),
						tab === "settings" && /* @__PURE__ */ jsx(ArticleSettingsTab, {
							row: r,
							onChange: set,
							currentUserAuthor,
							authorOptions,
							isEnterprisePlus
						})
					]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "flex items-center justify-between gap-2 border-t border-slate-200 bg-white px-6 py-3",
					children: [/* @__PURE__ */ jsxs("p", {
						className: "text-xs text-slate-500",
						children: [
							"Step ",
							idx + 1,
							" of ",
							order.length,
							" ·",
							" ",
							isLast ? "Review & publish" : "Complete this step, then continue"
						]
					}), /* @__PURE__ */ jsxs("div", {
						className: "flex gap-2",
						children: [
							/* @__PURE__ */ jsx("button", {
								onClick: onClose,
								className: "rounded-md border border-slate-200 bg-white px-4 py-2 text-sm hover:bg-slate-100",
								children: "Cancel"
							}),
							!isFirst && /* @__PURE__ */ jsx("button", {
								onClick: () => setTab(prevTab),
								className: "rounded-md border border-slate-200 bg-white px-4 py-2 text-sm hover:bg-slate-100",
								children: "Back"
							}),
							!isLast && /* @__PURE__ */ jsxs("button", {
								onClick: () => setTab(nextTab),
								className: "rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800",
								children: [
									"Next:",
									" ",
									nextTab === "media" ? "Media" : nextTab === "seo" ? "SEO & Social" : "Settings"
								]
							}),
							isLast && /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx("button", {
								type: "button",
								onClick: () => handleSave("Draft"),
								className: "rounded-md border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 cursor-pointer",
								children: "Save as Draft"
							}), isScheduled ? /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx("button", {
								type: "button",
								onClick: handlePublishNow,
								className: "rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-800 hover:bg-slate-100 cursor-pointer shadow-xs",
								title: "Override schedule and publish immediately",
								children: "Publish Now"
							}), /* @__PURE__ */ jsxs("button", {
								type: "button",
								onClick: () => handleSave("Scheduled"),
								className: "inline-flex items-center gap-1.5 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition shadow-sm cursor-pointer",
								children: [/* @__PURE__ */ jsx(CalendarClock, { className: "h-4 w-4" }), /* @__PURE__ */ jsx("span", { children: "Schedule Post" })]
							})] }) : /* @__PURE__ */ jsx("button", {
								type: "button",
								onClick: () => handleSave("Published"),
								className: "rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 cursor-pointer shadow-sm",
								children: "Publish"
							})] })
						]
					})]
				})
			]
		}), /* @__PURE__ */ jsx(AiArticleModal, {
			isOpen: showAiModal,
			onClose: () => setShowAiModal(false),
			onApply: handleApplyAi,
			isEnterprise
		})]
	});
}
//#endregion
export { ArticleEditor as default, statusStyle };

//# sourceMappingURL=ArticleEditor-CHVOY3uw.js.map