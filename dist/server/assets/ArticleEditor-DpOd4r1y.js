import { f as sections, p as slugify } from "./db.server-BbeveDGb.js";
import { t as useServerFn } from "./useServerFn-BqzygRuj.js";
import { a as getTags } from "./taxonomy.functions-BEPmlMw1.js";
import { t as generateArticleContentServer } from "./ai.functions-B-Q3uMUE.js";
import { d as loadFontConfig } from "./font-config-B7UTgwBo.js";
import { a as useSiteSettings } from "./AdSettingsContext-DI_6VrNB.js";
import { a as searchJournalists, t as awardJournalistPoints } from "./journalist.functions-CMQDcqUh.js";
import { n as MediaField } from "./MediaField-BHY-29Mu.js";
import React, { useEffect, useRef, useState } from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { AlignCenter, AlignLeft, AlignRight, Bold, Code2, Coins, Facebook, FileText, Heading2, Heading3, Image, Italic, Link, Link2, List, ListOrdered, Loader2, MapPin, Minus, Palette, Pilcrow, Quote, Search, Settings, Share2, Sparkles, Type, Underline, Upload, UserCheck, Video, Wallet, X, Youtube } from "lucide-react";
import { toast } from "sonner";
//#region src/components/admin/articles/RichEditor.tsx
function RichEditor({ value, onChange }) {
	const ref = useRef(null);
	const imgRef = useRef(null);
	const lastHtml = useRef(value);
	const [fontOptions, setFontOptions] = React.useState(["Default"]);
	useEffect(() => {
		if (ref.current && value !== lastHtml.current) {
			ref.current.innerHTML = value || "";
			lastHtml.current = value || "";
		}
	}, [value]);
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
	const emit = () => {
		if (!ref.current) return;
		const html = ref.current.innerHTML;
		lastHtml.current = html;
		onChange(html);
	};
	const focus = () => ref.current?.focus();
	const exec = (cmd, val) => {
		focus();
		document.execCommand(cmd, false, val);
		emit();
	};
	const insertHTML = (html) => {
		focus();
		document.execCommand("insertHTML", false, html);
		emit();
	};
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
		const url = prompt("URL");
		if (!url) return;
		exec("createLink", url);
	};
	const insertDivider = () => insertHTML(`<hr style="border:0;border-top:1px solid #e2e8f0;margin:16px 0" />`);
	const insertQuote = () => exec("formatBlock", "blockquote");
	const sizes = [
		"12",
		"14",
		"16",
		"18",
		"20",
		"24",
		"28",
		"32"
	];
	const colors = [
		"#1A1110",
		"#E11D48",
		"#16A34A",
		"#2563EB",
		"#D97706",
		"#7C3AED",
		"#64748B",
		"#FFFFFF"
	];
	const setFontFamily = (f) => {
		if (f === "Default") return;
		const sel = window.getSelection();
		if (!sel || sel.rangeCount === 0 || sel.isCollapsed) {
			insertHTML(`<span style="font-family:'${f}',serif">text</span>`);
			return;
		}
		const range = sel.getRangeAt(0);
		const span = document.createElement("span");
		span.style.fontFamily = `'${f}', serif`;
		span.appendChild(range.extractContents());
		range.insertNode(span);
		sel.removeAllRanges();
		emit();
	};
	const setFontSize = (px) => {
		const sel = window.getSelection();
		if (!sel || sel.rangeCount === 0 || sel.isCollapsed) {
			insertHTML(`<span style="font-size:${px}px">text</span>`);
			return;
		}
		const range = sel.getRangeAt(0);
		const span = document.createElement("span");
		span.style.fontSize = `${px}px`;
		span.appendChild(range.extractContents());
		range.insertNode(span);
		sel.removeAllRanges();
		emit();
	};
	const Btn = ({ onClick, title, children }) => /* @__PURE__ */ jsx("button", {
		type: "button",
		onMouseDown: (e) => e.preventDefault(),
		onClick,
		title,
		className: "grid h-8 w-8 place-items-center rounded text-slate-700 hover:bg-slate-200",
		children
	});
	const Sep = () => /* @__PURE__ */ jsx("span", { className: "mx-1 h-5 w-px bg-slate-300" });
	const words = (ref.current?.innerText || "").trim().split(/\s+/).filter(Boolean).length;
	return /* @__PURE__ */ jsxs("div", {
		className: "overflow-hidden rounded-md border border-slate-200",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "flex flex-wrap items-center gap-0.5 border-b border-slate-200 bg-slate-50 px-2 py-1.5",
				onMouseDown: (e) => e.preventDefault(),
				children: [
					/* @__PURE__ */ jsx(Btn, {
						onClick: () => exec("formatBlock", "p"),
						title: "Paragraph",
						children: /* @__PURE__ */ jsx(Pilcrow, { className: "h-4 w-4" })
					}),
					/* @__PURE__ */ jsx(Btn, {
						onClick: () => exec("formatBlock", "h2"),
						title: "Heading 2",
						children: /* @__PURE__ */ jsx(Heading2, { className: "h-4 w-4" })
					}),
					/* @__PURE__ */ jsx(Btn, {
						onClick: () => exec("formatBlock", "h3"),
						title: "Heading 3",
						children: /* @__PURE__ */ jsx(Heading3, { className: "h-4 w-4" })
					}),
					/* @__PURE__ */ jsx(Sep, {}),
					/* @__PURE__ */ jsx("select", {
						onChange: (e) => {
							setFontFamily(e.target.value);
							e.target.value = "Default";
						},
						onMouseDown: (e) => e.stopPropagation(),
						title: "Font family",
						className: "h-8 rounded border border-slate-200 bg-white px-1.5 text-xs",
						children: fontOptions.map((f) => /* @__PURE__ */ jsx("option", {
							value: f,
							children: f
						}, f))
					}),
					/* @__PURE__ */ jsxs("select", {
						onChange: (e) => {
							if (e.target.value !== "Size") setFontSize(e.target.value);
							e.target.value = "Size";
						},
						onMouseDown: (e) => e.stopPropagation(),
						title: "Font size",
						className: "h-8 rounded border border-slate-200 bg-white px-1.5 text-xs",
						children: [/* @__PURE__ */ jsx("option", { children: "Size" }), sizes.map((s) => /* @__PURE__ */ jsx("option", { children: s }, s))]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "relative inline-flex items-center gap-0.5",
						children: [
							/* @__PURE__ */ jsx(Type, { className: "ml-1 h-3.5 w-3.5 text-slate-500" }),
							colors.map((c) => /* @__PURE__ */ jsx("button", {
								type: "button",
								title: `Text ${c}`,
								onMouseDown: (e) => e.preventDefault(),
								onClick: () => exec("foreColor", c),
								className: "h-5 w-5 rounded border border-slate-300",
								style: { background: c }
							}, c)),
							/* @__PURE__ */ jsx("button", {
								type: "button",
								title: "Custom color",
								onMouseDown: (e) => e.preventDefault(),
								onClick: () => {
									const c = prompt("Hex color, e.g. #ff0000");
									if (c) exec("foreColor", c);
								},
								className: "grid h-5 w-5 place-items-center rounded border border-slate-300 bg-white",
								children: /* @__PURE__ */ jsx(Palette, { className: "h-3 w-3" })
							})
						]
					}),
					/* @__PURE__ */ jsx(Sep, {}),
					/* @__PURE__ */ jsx(Btn, {
						onClick: () => exec("bold"),
						title: "Bold",
						children: /* @__PURE__ */ jsx(Bold, { className: "h-4 w-4" })
					}),
					/* @__PURE__ */ jsx(Btn, {
						onClick: () => exec("italic"),
						title: "Italic",
						children: /* @__PURE__ */ jsx(Italic, { className: "h-4 w-4" })
					}),
					/* @__PURE__ */ jsx(Btn, {
						onClick: () => exec("underline"),
						title: "Underline",
						children: /* @__PURE__ */ jsx(Underline, { className: "h-4 w-4" })
					}),
					/* @__PURE__ */ jsx(Btn, {
						onClick: () => insertHTML(`<code style="background:#f1f5f9;padding:2px 6px;border-radius:4px;font-family:monospace">code</code>`),
						title: "Inline code",
						children: /* @__PURE__ */ jsx(Code2, { className: "h-4 w-4" })
					}),
					/* @__PURE__ */ jsx(Sep, {}),
					/* @__PURE__ */ jsx(Btn, {
						onClick: () => exec("justifyLeft"),
						title: "Align left",
						children: /* @__PURE__ */ jsx(AlignLeft, { className: "h-4 w-4" })
					}),
					/* @__PURE__ */ jsx(Btn, {
						onClick: () => exec("justifyCenter"),
						title: "Align center",
						children: /* @__PURE__ */ jsx(AlignCenter, { className: "h-4 w-4" })
					}),
					/* @__PURE__ */ jsx(Btn, {
						onClick: () => exec("justifyRight"),
						title: "Align right",
						children: /* @__PURE__ */ jsx(AlignRight, { className: "h-4 w-4" })
					}),
					/* @__PURE__ */ jsx(Sep, {}),
					/* @__PURE__ */ jsx(Btn, {
						onClick: insertQuote,
						title: "Quote",
						children: /* @__PURE__ */ jsx(Quote, { className: "h-4 w-4" })
					}),
					/* @__PURE__ */ jsx(Btn, {
						onClick: () => exec("insertUnorderedList"),
						title: "Bullet list",
						children: /* @__PURE__ */ jsx(List, { className: "h-4 w-4" })
					}),
					/* @__PURE__ */ jsx(Btn, {
						onClick: () => exec("insertOrderedList"),
						title: "Numbered list",
						children: /* @__PURE__ */ jsx(ListOrdered, { className: "h-4 w-4" })
					}),
					/* @__PURE__ */ jsx(Btn, {
						onClick: insertDivider,
						title: "Divider",
						children: /* @__PURE__ */ jsx(Minus, { className: "h-4 w-4" })
					}),
					/* @__PURE__ */ jsx(Btn, {
						onClick: insertLink,
						title: "Link",
						children: /* @__PURE__ */ jsx(Link2, { className: "h-4 w-4" })
					}),
					/* @__PURE__ */ jsx(Sep, {}),
					/* @__PURE__ */ jsx(Btn, {
						onClick: insertImage,
						title: "Insert image by URL",
						children: /* @__PURE__ */ jsx(Image, { className: "h-4 w-4" })
					}),
					/* @__PURE__ */ jsx(Btn, {
						onClick: () => imgRef.current?.click(),
						title: "Upload image",
						children: /* @__PURE__ */ jsx(Upload, { className: "h-4 w-4" })
					}),
					/* @__PURE__ */ jsx("input", {
						ref: imgRef,
						type: "file",
						accept: "image/*",
						hidden: true,
						onChange: (e) => {
							uploadImage(e.target.files?.[0]);
							if (imgRef.current) imgRef.current.value = "";
						}
					}),
					/* @__PURE__ */ jsx(Btn, {
						onClick: insertYouTube,
						title: "Embed YouTube",
						children: /* @__PURE__ */ jsx(Youtube, { className: "h-4 w-4 text-red-600" })
					}),
					/* @__PURE__ */ jsx(Btn, {
						onClick: insertFacebook,
						title: "Embed Facebook video",
						children: /* @__PURE__ */ jsx(Facebook, { className: "h-4 w-4 text-blue-600" })
					}),
					/* @__PURE__ */ jsx(Btn, {
						onClick: insertVideoUrl,
						title: "Embed video file",
						children: /* @__PURE__ */ jsx(Video, { className: "h-4 w-4" })
					}),
					/* @__PURE__ */ jsxs("span", {
						className: "ml-auto pr-2 text-xs text-slate-500",
						children: [words, " words"]
					})
				]
			}),
			/* @__PURE__ */ jsx("div", {
				ref,
				contentEditable: true,
				suppressContentEditableWarning: true,
				onInput: emit,
				onBlur: emit,
				"data-placeholder": "Write your article here. Use the toolbar to format text, change color, insert images, and embed YouTube/Facebook videos - everything renders live as you type.",
				className: "rich-editor block min-h-[360px] w-full px-5 py-4 text-[15px] leading-relaxed text-slate-900 focus:outline-none",
				style: { fontFamily: "'Inter', system-ui, sans-serif" }
			}),
			/* @__PURE__ */ jsx("style", { children: `
        .rich-editor:empty:before { content: attr(data-placeholder); color: #94a3b8; pointer-events: none; }
        .rich-editor h2 { font-size: 1.5rem; font-weight: 700; margin: 1rem 0 .5rem; font-family: 'Playfair Display', Georgia, serif; }
        .rich-editor h3 { font-size: 1.25rem; font-weight: 700; margin: .75rem 0 .5rem; font-family: 'Playfair Display', Georgia, serif; }
        .rich-editor p { margin: .5rem 0; }
        .rich-editor ul { list-style: disc; padding-left: 1.5rem; margin: .5rem 0; }
        .rich-editor ol { list-style: decimal; padding-left: 1.5rem; margin: .5rem 0; }
        .rich-editor blockquote { border-left: 3px solid #1A1110; padding: .25rem 1rem; margin: .75rem 0; color: #475569; font-style: italic; background:#f8fafc; }
        .rich-editor a { color: #2563eb; text-decoration: underline; }
        .rich-editor img { max-width: 100%; height: auto; }
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
					className: "shrink-0 rounded-md border border-emerald-300 bg-white px-2.5 py-1 text-xs font-medium text-emerald-800 hover:bg-emerald-100",
					children: "Change"
				})]
			}), /* @__PURE__ */ jsx(AwardPointsBox, {
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
//#region src/components/admin/ArticleEditor.tsx
var statusStyle = {
	Published: "bg-emerald-50 text-emerald-700 border-emerald-200",
	Draft: "bg-slate-100 text-slate-700 border-slate-200",
	Review: "bg-amber-50 text-amber-700 border-amber-200"
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
	if (!dateVal) return "";
	try {
		const d = typeof dateVal === "string" ? new Date(dateVal) : dateVal;
		if (d instanceof Date && !isNaN(d.getTime())) {
			const pad = (n) => String(n).padStart(2, "0");
			return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
		}
		if (typeof dateVal === "string") return dateVal.slice(0, 16).replace(" ", "T");
	} catch (e) {
		console.error("formatDateTimeLocal error:", e);
	}
	return "";
};
function ArticleEditor({ initial, onClose, onSave }) {
	const s = useSiteSettings();
	const isEnterprise = ["Enterprise", "Enterprise+"].includes(s.licenseType || "") || s.licenseRole === "VIP";
	const [r, setR] = useState({
		...initial,
		title: initial.title || "",
		slug: initial.slug || "",
		category: initial.category || "Northeast",
		city: initial.city || "",
		state: initial.state || "",
		country: initial.country || "",
		author: initial.author || "",
		excerpt: initial.excerpt || "",
		content: initial.content || "",
		featuredImage: initial.featuredImage || "",
		ogImage: initial.ogImage || "",
		metaTitle: initial.metaTitle || "",
		metaDescription: initial.metaDescription || "",
		tags: initial.tags || "",
		views: initial.views || 0,
		featured: !!initial.featured,
		newsType: initial.newsType || "Standard",
		journalistId: initial.journalistId || "",
		journalistName: initial.journalistName || "",
		access_level: initial.access_level || "Free"
	});
	const [tab, setTab] = useState("content");
	const [showAiModal, setShowAiModal] = useState(false);
	const [aiInstructions, setAiInstructions] = useState("");
	const [aiStyle, setAiStyle] = useState("Normal");
	const [isGeneratingAi, setIsGeneratingAi] = useState(false);
	const [generatedAiData, setGeneratedAiData] = useState(null);
	const handleGenerateAi = async () => {
		if (!aiInstructions.trim()) {
			toast.error("Please enter news instructions.");
			return;
		}
		setIsGeneratingAi(true);
		setGeneratedAiData(null);
		try {
			setGeneratedAiData(await generateArticleContentServer({ data: {
				instructions: aiInstructions,
				style: aiStyle,
				availableTags: (await getTags()).map((t) => t.name)
			} }));
			toast.success("Content generated! Please review.");
		} catch (err) {
			toast.error(err.message || "Failed to generate AI content.");
		} finally {
			setIsGeneratingAi(false);
		}
	};
	const handleApplyAi = () => {
		if (!generatedAiData) return;
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
	const set = (k, v) => setR((p) => ({
		...p,
		[k]: v
	}));
	const handleSave = (status) => {
		if (!r.title.trim()) return toast.error("Title is required");
		if (!r.author.trim()) return toast.error("Author is required");
		onSave(status ? {
			...r,
			status
		} : r);
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
							children: [/* @__PURE__ */ jsxs("button", {
								onClick: () => setShowAiModal(true),
								className: "flex items-center gap-1.5 rounded-lg bg-indigo-50 px-3 py-1.5 text-xs font-bold text-indigo-700 hover:bg-indigo-100 hover:text-indigo-900 transition-colors border border-indigo-100 shadow-sm",
								children: [/* @__PURE__ */ jsx(Sparkles, { className: "h-3.5 w-3.5" }), " AI News Assistant"]
							}), /* @__PURE__ */ jsx("button", {
								onClick: onClose,
								className: "grid h-9 w-9 shrink-0 place-items-center rounded-md hover:bg-slate-100",
								children: /* @__PURE__ */ jsx(X, { className: "h-4 w-4" })
							})]
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
						tab === "content" && /* @__PURE__ */ jsxs("div", {
							className: "space-y-5",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "rounded-xl border border-slate-200 bg-white p-5 shadow-sm",
								children: [
									/* @__PURE__ */ jsx(Field, {
										label: "Title *",
										children: /* @__PURE__ */ jsx("input", {
											value: r.title,
											onChange: (e) => {
												set("title", e.target.value);
												if (!initial.title) set("slug", slugify(e.target.value));
											},
											placeholder: "Enter article headline...",
											className: "w-full rounded-md border border-slate-200 px-3 py-2.5 text-base font-medium focus:border-slate-900 focus:outline-none"
										})
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "mt-4 grid grid-cols-1 gap-3 md:grid-cols-2",
										children: [/* @__PURE__ */ jsx(Field, {
											label: "Category",
											children: /* @__PURE__ */ jsx("select", {
												value: r.category,
												onChange: (e) => set("category", e.target.value),
												className: "w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none",
												children: sections.map((s) => /* @__PURE__ */ jsx("option", { children: s }, s))
											})
										}), /* @__PURE__ */ jsx(Field, {
											label: "Title slug (URL last segment)",
											children: /* @__PURE__ */ jsx("input", {
												value: r.slug,
												onChange: (e) => set("slug", slugify(e.target.value)),
												placeholder: "auto from title",
												className: "w-full rounded-md border border-slate-200 px-3 py-2 font-mono text-sm focus:border-slate-900 focus:outline-none"
											})
										})]
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
													value: r.city,
													onChange: (e) => set("city", e.target.value),
													placeholder: "City",
													className: "w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none"
												}),
												/* @__PURE__ */ jsx("input", {
													value: r.state,
													onChange: (e) => set("state", e.target.value),
													placeholder: "State",
													className: "w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none"
												}),
												/* @__PURE__ */ jsx("input", {
													value: r.country,
													onChange: (e) => set("country", e.target.value),
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
												value: r.excerpt,
												onChange: (e) => set("excerpt", e.target.value),
												rows: 2,
												placeholder: "Short summary shown in news grid (1-2 lines)...",
												className: "w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none"
											}), /* @__PURE__ */ jsxs("span", {
												className: "mt-1 block text-xs text-slate-400",
												children: [r.excerpt.length, " / 200"]
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
									value: r.content,
									onChange: (v) => set("content", v)
								})]
							})]
						}),
						tab === "media" && /* @__PURE__ */ jsxs("div", {
							className: "space-y-5",
							children: [/* @__PURE__ */ jsx("div", {
								className: "rounded-xl border border-slate-200 bg-white p-5 shadow-sm",
								children: /* @__PURE__ */ jsx(Field, {
									label: "Featured Image",
									children: /* @__PURE__ */ jsx(ImageInput, {
										value: r.featuredImage,
										onChange: (v) => set("featuredImage", v),
										hint: "Used as the hero image and default Open Graph image."
									})
								})
							}), /* @__PURE__ */ jsx("div", {
								className: "rounded-xl border border-slate-200 bg-white p-5 shadow-sm",
								children: /* @__PURE__ */ jsx(Field, {
									label: `Open Graph Image ${r.ogImage ? "" : "(defaults to Featured Image)"}`,
									children: /* @__PURE__ */ jsx(ImageInput, {
										value: r.ogImage,
										onChange: (v) => set("ogImage", v),
										hint: "Override only if you want a different image when shared on social media. Recommended 1200×630."
									})
								})
							})]
						}),
						tab === "seo" && /* @__PURE__ */ jsxs("div", {
							className: "space-y-5",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-4",
								children: [
									/* @__PURE__ */ jsxs(Field, {
										label: "Meta Title",
										children: [/* @__PURE__ */ jsx("input", {
											value: r.metaTitle,
											onChange: (e) => set("metaTitle", e.target.value),
											placeholder: r.title || "Defaults to article title",
											className: "w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none"
										}), /* @__PURE__ */ jsxs("span", {
											className: "mt-1 block text-xs text-slate-400",
											children: [r.metaTitle.length, " / 60 chars recommended"]
										})]
									}),
									/* @__PURE__ */ jsxs(Field, {
										label: "Meta Description",
										children: [/* @__PURE__ */ jsx("textarea", {
											value: r.metaDescription,
											onChange: (e) => set("metaDescription", e.target.value),
											rows: 3,
											placeholder: "Search engine description (~155 chars)...",
											className: "w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none"
										}), /* @__PURE__ */ jsxs("span", {
											className: "mt-1 block text-xs text-slate-400",
											children: [r.metaDescription.length, " / 160 chars recommended"]
										})]
									}),
									/* @__PURE__ */ jsx(Field, {
										label: "Tags (comma separated)",
										children: /* @__PURE__ */ jsx("input", {
											value: r.tags,
											onChange: (e) => set("tags", e.target.value),
											placeholder: "markets, fed, inflation",
											className: "w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none"
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
										children: r.metaTitle || r.title || "Article title"
									}),
									/* @__PURE__ */ jsx("p", {
										className: "truncate text-xs text-emerald-700",
										children: url
									}),
									/* @__PURE__ */ jsx("p", {
										className: "mt-1 line-clamp-2 text-sm text-slate-600",
										children: r.metaDescription || r.excerpt || "Article description preview..."
									})
								]
							})]
						}),
						tab === "settings" && /* @__PURE__ */ jsxs("div", {
							className: "rounded-xl border border-slate-200 bg-white p-5 shadow-sm",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "grid grid-cols-1 gap-4 md:grid-cols-2",
								children: [
									/* @__PURE__ */ jsx(Field, {
										label: "News Type",
										children: /* @__PURE__ */ jsxs("select", {
											value: r.newsType,
											onChange: (e) => set("newsType", e.target.value),
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
										children: /* @__PURE__ */ jsx("input", {
											value: r.author,
											onChange: (e) => set("author", e.target.value),
											className: "w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
										})
									}),
									/* @__PURE__ */ jsx(Field, {
										label: "Status",
										children: /* @__PURE__ */ jsxs("select", {
											value: r.status,
											onChange: (e) => set("status", e.target.value),
											className: "w-full rounded-md border border-slate-200 px-3 py-2 text-sm",
											children: [
												/* @__PURE__ */ jsx("option", { children: "Published" }),
												/* @__PURE__ */ jsx("option", { children: "Draft" }),
												/* @__PURE__ */ jsx("option", { children: "Review" })
											]
										})
									}),
									/* @__PURE__ */ jsx(Field, {
										label: "Access Level",
										children: /* @__PURE__ */ jsxs("select", {
											value: r.access_level,
											onChange: (e) => set("access_level", e.target.value),
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
										children: /* @__PURE__ */ jsx("input", {
											type: "datetime-local",
											value: formatDateTimeLocal(r.date),
											onChange: (e) => set("date", e.target.value),
											className: "w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
										})
									}),
									isEnterprise && /* @__PURE__ */ jsx(Field, {
										label: "Post Views",
										children: /* @__PURE__ */ jsx("input", {
											type: "number",
											min: 0,
											value: r.views,
											onChange: (e) => set("views", Number(e.target.value) || 0),
											className: "w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
										})
									}),
									/* @__PURE__ */ jsx(Field, {
										label: "Featured on homepage",
										children: /* @__PURE__ */ jsxs("label", {
											className: "flex h-9 items-center gap-2 rounded-md border border-slate-200 px-3 text-sm",
											children: [/* @__PURE__ */ jsx("input", {
												type: "checkbox",
												checked: r.featured,
												onChange: (e) => set("featured", e.target.checked)
											}), "Pin to hero / featured slot"]
										})
									})
								]
							}), /* @__PURE__ */ jsx("div", {
								className: "mt-4 border-t border-slate-100 pt-4",
								children: /* @__PURE__ */ jsx(JournalistPicker, {
									journalistId: r.journalistId,
									journalistName: r.journalistName,
									onSelect: (j) => {
										set("journalistId", j?.publicUserId ?? "");
										set("journalistName", j?.displayName ?? "");
										if (j?.displayName) set("author", j.displayName);
									}
								})
							})]
						})
					]
				}),
				/* @__PURE__ */ jsx("div", {
					className: "flex items-center justify-between gap-2 border-t border-slate-200 bg-white px-6 py-3",
					children: (() => {
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
						return /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsxs("p", {
							className: "text-xs text-slate-500",
							children: [
								"Step ",
								idx + 1,
								" of ",
								order.length,
								" ·",
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
									children: ["Next:", nextTab === "media" ? "Media" : nextTab === "seo" ? "SEO & Social" : "Settings"]
								}),
								isLast && /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx("button", {
									onClick: () => handleSave("Draft"),
									className: "rounded-md border border-slate-200 bg-white px-4 py-2 text-sm hover:bg-slate-100",
									children: "Save as Draft"
								}), /* @__PURE__ */ jsx("button", {
									onClick: () => handleSave("Published"),
									className: "rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800",
									children: "Publish"
								})] })
							]
						})] });
					})()
				})
			]
		}), showAiModal && /* @__PURE__ */ jsx("div", {
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
							onClick: () => setShowAiModal(false),
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
									})] }), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
										className: "mb-1 block text-sm font-bold text-slate-700",
										children: "Writing Style"
									}), /* @__PURE__ */ jsxs("select", {
										value: aiStyle,
										onChange: (e) => setAiStyle(e.target.value),
										className: "w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none bg-white",
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
											isEnterprise && /* @__PURE__ */ jsx("option", {
												value: "5 ws",
												children: "5 ws"
											})
										]
									})] })]
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
							onClick: () => setShowAiModal(false),
							className: "rounded-lg px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-100",
							children: "Cancel"
						}), /* @__PURE__ */ jsx("button", {
							onClick: handleApplyAi,
							disabled: !generatedAiData,
							className: "rounded-lg bg-indigo-600 px-6 py-2 text-sm font-bold text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2",
							children: "Apply to Article"
						})]
					})
				]
			})
		})]
	});
}
//#endregion
export { ArticleEditor as default, statusStyle };

//# sourceMappingURL=ArticleEditor-DpOd4r1y.js.map