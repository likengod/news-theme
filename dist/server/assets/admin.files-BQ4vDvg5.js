import { a as trackUpload, i as mediaLibrary, n as deriveAltText, r as formatBytes } from "./media-library-l-rYXSMP.js";
import { t as CsvImportExport } from "./CsvImportExport-cj5FA8rJ.js";
import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { AlertTriangle, Check, Copy, Edit2, FileText, Image, LayoutGrid, List, RefreshCw, ShieldCheck, Sparkles, Trash2, Upload, Video, X } from "lucide-react";
import { toast } from "sonner";
//#region src/components/admin/files/EditMediaModal.tsx
function EditMediaModal({ item, isDuplicate, duplicateCount, onClose, onSave, onReplace }) {
	const [name, setName] = useState(item.name || "");
	const [altText, setAltText] = useState(item.altText || (item.name ? deriveAltText(item.name) : ""));
	const [description, setDescription] = useState(item.description || "");
	const [replacementFile, setReplacementFile] = useState(null);
	const [replacementPreview, setReplacementPreview] = useState(null);
	const [replacing, setReplacing] = useState(false);
	const replaceInputRef = useRef(null);
	const [altManuallyEdited, setAltManuallyEdited] = useState(Boolean(item.altText && item.altText !== deriveAltText(item.name || "")));
	const handleNameChange = (val) => {
		setName(val);
		if (!altManuallyEdited || !altText.trim()) setAltText(deriveAltText(val));
	};
	const handleAutoFetchAlt = () => {
		const derived = deriveAltText(name || item.name || "");
		setAltText(derived);
		setAltManuallyEdited(false);
		toast.success(`Alt text generated: "${derived}"`);
	};
	const handleFileSelect = (e) => {
		const file = e.target.files?.[0];
		if (!file) return;
		if (file.size > 1048576) {
			toast.error(`"${file.name}" (${formatBytes(file.size)}) exceeds the 1 MB limit.`);
			return;
		}
		setReplacementFile(file);
		const reader = new FileReader();
		reader.onload = () => {
			setReplacementPreview(String(reader.result));
		};
		reader.readAsDataURL(file);
		if (!name || name === item.name) {
			const cleanNewName = file.name.split(".").slice(0, -1).join(".") || file.name;
			setName(cleanNewName);
			if (!altManuallyEdited) setAltText(deriveAltText(cleanNewName));
		}
	};
	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!name.trim()) return;
		const finalAlt = altText.trim() || deriveAltText(name.trim());
		if (replacementFile && onReplace) {
			setReplacing(true);
			try {
				await onReplace(item.id, replacementFile, name.trim(), finalAlt, description.trim());
				toast.success("File replaced and details saved!");
				onClose();
			} catch (err) {
				toast.error(err?.message || "Failed to replace file");
			} finally {
				setReplacing(false);
			}
			return;
		}
		onSave(item.id, name.trim(), finalAlt, description.trim());
		onClose();
	};
	return /* @__PURE__ */ jsx("div", {
		className: "fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs",
		children: /* @__PURE__ */ jsxs("div", {
			className: "w-full max-w-lg rounded-2xl bg-white shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-150",
			children: [
				/* @__PURE__ */ jsxs("div", {
					className: "flex items-center justify-between border-b border-slate-100 px-5 py-4 bg-slate-50/70",
					children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h2", {
						className: "text-base font-bold text-slate-900",
						children: "Edit Media Details"
					}), /* @__PURE__ */ jsx("p", {
						className: "text-xs text-slate-500",
						children: "Manage file metadata, alt text, or replace image"
					})] }), /* @__PURE__ */ jsx("button", {
						onClick: onClose,
						className: "rounded-full p-1.5 text-slate-400 hover:bg-slate-200 hover:text-slate-700 transition",
						children: /* @__PURE__ */ jsx(X, { className: "h-5 w-5" })
					})]
				}),
				isDuplicate && /* @__PURE__ */ jsxs("div", {
					className: "mx-5 mt-4 flex items-start gap-2.5 rounded-xl border border-amber-200 bg-amber-50/80 p-3 text-xs text-amber-900",
					children: [/* @__PURE__ */ jsx(AlertTriangle, { className: "h-4 w-4 text-amber-600 shrink-0 mt-0.5" }), /* @__PURE__ */ jsxs("div", { children: [
						/* @__PURE__ */ jsx("span", {
							className: "font-bold",
							children: "Duplicate Detected:"
						}),
						" This file appears to have",
						" ",
						duplicateCount ? `${duplicateCount} copies` : "duplicates",
						" in your library (sharing the same name or size). You can replace or rename it to differentiate."
					] })]
				}),
				/* @__PURE__ */ jsxs("form", {
					onSubmit: handleSubmit,
					className: "p-5 space-y-4",
					children: [
						/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
							className: "mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-700",
							children: "File Name *"
						}), /* @__PURE__ */ jsx("input", {
							type: "text",
							required: true,
							value: name,
							onChange: (e) => handleNameChange(e.target.value),
							placeholder: "e.g. upi-payment-guide",
							className: "w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
						})] }),
						/* @__PURE__ */ jsxs("div", { children: [
							/* @__PURE__ */ jsxs("div", {
								className: "mb-1.5 flex items-center justify-between",
								children: [/* @__PURE__ */ jsx("label", {
									className: "text-xs font-bold uppercase tracking-wider text-slate-700",
									children: "Alt Text (SEO & Accessibility)"
								}), /* @__PURE__ */ jsxs("button", {
									type: "button",
									onClick: handleAutoFetchAlt,
									className: "inline-flex items-center gap-1 rounded-md bg-indigo-50 px-2 py-0.5 text-[11px] font-semibold text-indigo-700 hover:bg-indigo-100 transition cursor-pointer",
									title: "Automatically generate Alt Text from file name",
									children: [/* @__PURE__ */ jsx(Sparkles, { className: "h-3 w-3 text-indigo-600" }), "Auto-fetch from Name"]
								})]
							}),
							/* @__PURE__ */ jsx("input", {
								type: "text",
								value: altText,
								onChange: (e) => {
									setAltText(e.target.value);
									setAltManuallyEdited(true);
								},
								placeholder: "Brief description for screen readers and SEO",
								className: "w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
							}),
							/* @__PURE__ */ jsx("p", {
								className: "mt-1 text-[11px] text-slate-500",
								children: "Used by Google for Image Search ranking and screen readers for accessibility."
							})
						] }),
						/* @__PURE__ */ jsxs("div", {
							className: "rounded-xl border border-slate-200 bg-slate-50/50 p-3.5 space-y-2.5",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ jsx("span", {
									className: "text-xs font-bold uppercase tracking-wider text-slate-700",
									children: "Replace File (< 1 MB)"
								}), replacementFile && /* @__PURE__ */ jsx("button", {
									type: "button",
									onClick: () => {
										setReplacementFile(null);
										setReplacementPreview(null);
									},
									className: "text-[11px] font-semibold text-red-600 hover:underline",
									children: "Clear replacement"
								})]
							}), /* @__PURE__ */ jsxs("div", {
								className: "flex items-center gap-3",
								children: [/* @__PURE__ */ jsx("div", {
									className: "h-14 w-20 shrink-0 rounded-lg border border-slate-200 bg-white overflow-hidden grid place-items-center",
									children: replacementPreview ? /* @__PURE__ */ jsx("img", {
										src: replacementPreview,
										alt: "Preview",
										className: "h-full w-full object-cover"
									}) : item.url ? /* @__PURE__ */ jsx("img", {
										src: item.url,
										alt: item.name,
										className: "h-full w-full object-cover"
									}) : /* @__PURE__ */ jsx("span", {
										className: "text-[10px] text-slate-400",
										children: "Current"
									})
								}), /* @__PURE__ */ jsxs("div", {
									className: "flex-1",
									children: [
										/* @__PURE__ */ jsx("input", {
											ref: replaceInputRef,
											type: "file",
											accept: "image/*,video/*,.pdf",
											onChange: handleFileSelect,
											className: "hidden"
										}),
										/* @__PURE__ */ jsxs("button", {
											type: "button",
											onClick: () => replaceInputRef.current?.click(),
											className: "inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition shadow-2xs",
											children: [/* @__PURE__ */ jsx(RefreshCw, { className: "h-3.5 w-3.5 text-slate-500" }), replacementFile ? "Choose Different File" : "Upload Replacement Image"]
										}),
										/* @__PURE__ */ jsx("p", {
											className: "mt-1 text-[11px] text-slate-500",
											children: replacementFile ? `Selected: ${replacementFile.name} (${formatBytes(replacementFile.size)})` : "Replaces the underlying image without breaking existing articles using this media ID."
										})
									]
								})]
							})]
						}),
						/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
							className: "mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-700",
							children: "Description / Caption"
						}), /* @__PURE__ */ jsx("textarea", {
							value: description,
							onChange: (e) => setDescription(e.target.value),
							rows: 2,
							placeholder: "Extended details, source attribution, or photographer credit",
							className: "w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
						})] }),
						/* @__PURE__ */ jsxs("div", {
							className: "pt-2 flex items-center justify-end gap-2.5 border-t border-slate-100",
							children: [/* @__PURE__ */ jsx("button", {
								type: "button",
								onClick: onClose,
								disabled: replacing,
								className: "rounded-xl px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 transition",
								children: "Cancel"
							}), /* @__PURE__ */ jsx("button", {
								type: "submit",
								disabled: replacing,
								className: "inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-5 py-2 text-xs font-bold text-white shadow-xs hover:bg-slate-800 transition active:scale-95 disabled:opacity-50",
								children: replacing ? /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(RefreshCw, { className: "h-3.5 w-3.5 animate-spin" }), " Replacing..."] }) : replacementFile ? /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(Upload, { className: "h-3.5 w-3.5" }), " Save & Replace File"] }) : /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(Check, { className: "h-3.5 w-3.5" }), " Save Details"] })
							})]
						})
					]
				})
			]
		})
	});
}
//#endregion
//#region src/components/admin/files/MediaGrid.tsx
function SafeImage({ src, alt, className, ...props }) {
	const [error, setError] = useState(false);
	if (error || !src || src.trim() === "") return /* @__PURE__ */ jsxs("div", {
		className: "flex flex-col items-center justify-center text-slate-400 h-full w-full bg-slate-100 p-2 text-center",
		children: [/* @__PURE__ */ jsx(Image, { className: "h-5 w-5 mb-1 opacity-50 text-slate-400" }), /* @__PURE__ */ jsx("span", {
			className: "text-[9px] font-semibold opacity-60",
			children: "Not Found"
		})]
	});
	return /* @__PURE__ */ jsx("img", {
		src,
		alt,
		className,
		onError: () => setError(true),
		...props
	});
}
function MediaGrid({ items, onDelete, onEdit, onReplace, onAutoFillAltTexts }) {
	const [filter, setFilter] = useState("all");
	const [q, setQ] = useState("");
	const [viewMode, setViewMode] = useState("list");
	const [editingItem, setEditingItem] = useState(null);
	const [fillingAlt, setFillingAlt] = useState(false);
	const quickReplaceInputRef = useRef(null);
	const [quickReplaceTargetId, setQuickReplaceTargetId] = useState(null);
	const duplicateInfo = useMemo(() => {
		const nameMap = /* @__PURE__ */ new Map();
		const sizeMap = /* @__PURE__ */ new Map();
		for (const it of items) {
			const normName = it.name.toLowerCase().replace(/\.[a-zA-Z0-9]+$/, "").replace(/[\(\[\{]\d+[\)\]\}]/g, "").replace(/\s+/g, " ").trim();
			if (normName) {
				const list = nameMap.get(normName) || [];
				list.push(it.id);
				nameMap.set(normName, list);
			}
			if (it.size && it.size !== "-") {
				const list = sizeMap.get(it.size) || [];
				list.push(it.id);
				sizeMap.set(it.size, list);
			}
		}
		const itemDupMap = /* @__PURE__ */ new Map();
		for (const [normName, ids] of nameMap.entries()) if (ids.length > 1) for (const id of ids) itemDupMap.set(id, {
			count: ids.length,
			reason: `Shares name "${normName}"`,
			groupKey: normName
		});
		for (const [sizeStr, ids] of sizeMap.entries()) if (ids.length > 1) {
			for (const id of ids) if (!itemDupMap.has(id)) itemDupMap.set(id, {
				count: ids.length,
				reason: `Identical file size (${sizeStr})`,
				groupKey: sizeStr
			});
		}
		return itemDupMap;
	}, [items]);
	const duplicateCount = Array.from(duplicateInfo.keys()).length;
	const missingAltCount = items.filter((it) => !it.altText || it.altText.trim() === "").length;
	const copyUrl = (url) => {
		navigator.clipboard.writeText(url);
		toast.success("URL copied to clipboard!");
	};
	const handleQuickReplaceTrigger = (id) => {
		setQuickReplaceTargetId(id);
		quickReplaceInputRef.current?.click();
	};
	const handleQuickReplaceFile = async (e) => {
		const file = e.target.files?.[0];
		const targetId = quickReplaceTargetId;
		if (!file || !targetId || !onReplace) return;
		if (file.size > 1048576) {
			toast.error(`"${file.name}" (${formatBytes(file.size)}) exceeds the 1 MB limit.`);
			return;
		}
		const targetItem = items.find((x) => x.id === targetId);
		try {
			await onReplace(targetId, file, targetItem?.name || file.name, targetItem?.altText);
			toast.success("Image replaced successfully!");
		} catch (err) {
			toast.error(err?.message || "Failed to replace image");
		} finally {
			setQuickReplaceTargetId(null);
			if (quickReplaceInputRef.current) quickReplaceInputRef.current.value = "";
		}
	};
	const handleAutoFillAllAlt = async () => {
		if (!onAutoFillAltTexts) return;
		setFillingAlt(true);
		try {
			const count = await onAutoFillAltTexts();
			if (count > 0) toast.success(`Generated Alt Text for ${count} media file${count > 1 ? "s" : ""}!`);
			else toast.info("All media files already have Alt Text!");
		} catch (err) {
			toast.error(err?.message || "Failed to auto-fill alt texts");
		} finally {
			setFillingAlt(false);
		}
	};
	const filtered = items.filter((it) => {
		if (!`${it.name}${it.url || ""}${it.altText || ""}`.toLowerCase().includes(q.toLowerCase())) return false;
		if (filter === "duplicates") return duplicateInfo.has(it.id);
		if (filter === "no-alt") return !it.altText || it.altText.trim() === "";
		if (filter === "all") return true;
		return (it.type || "image") === filter;
	});
	return /* @__PURE__ */ jsxs("div", {
		className: "space-y-4",
		children: [
			/* @__PURE__ */ jsx("input", {
				ref: quickReplaceInputRef,
				type: "file",
				accept: "image/*,video/*,.pdf",
				onChange: handleQuickReplaceFile,
				className: "hidden"
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-3.5 shadow-xs",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "flex flex-wrap items-center gap-2.5 flex-1 min-w-[280px]",
					children: [/* @__PURE__ */ jsx("input", {
						type: "text",
						value: q,
						onChange: (e) => setQ(e.target.value),
						placeholder: "Search media files by name or alt text...",
						className: "h-9 w-full sm:w-64 rounded-xl border border-slate-200 px-3 text-xs focus:border-slate-900 focus:outline-none"
					}), /* @__PURE__ */ jsxs("div", {
						className: "flex flex-wrap items-center gap-1",
						children: [
							[
								{
									key: "all",
									label: "All"
								},
								{
									key: "image",
									label: "Images"
								},
								{
									key: "video",
									label: "Videos"
								},
								{
									key: "document",
									label: "Documents"
								}
							].map((t) => /* @__PURE__ */ jsx("button", {
								onClick: () => setFilter(t.key),
								className: `rounded-lg px-2.5 py-1 text-xs font-semibold capitalize transition ${filter === t.key ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`,
								children: t.label
							}, t.key)),
							/* @__PURE__ */ jsxs("button", {
								onClick: () => setFilter(filter === "duplicates" ? "all" : "duplicates"),
								className: `inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold transition ${filter === "duplicates" ? "bg-amber-600 text-white" : duplicateCount > 0 ? "bg-amber-100 text-amber-800 hover:bg-amber-200" : "bg-slate-100 text-slate-400 opacity-60"}`,
								title: "Filter duplicate images",
								children: [
									/* @__PURE__ */ jsx(AlertTriangle, { className: "h-3.5 w-3.5" }),
									"Duplicates ",
									duplicateCount > 0 && `(${duplicateCount})`
								]
							}),
							missingAltCount > 0 && /* @__PURE__ */ jsxs("button", {
								onClick: () => setFilter(filter === "no-alt" ? "all" : "no-alt"),
								className: `inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold transition ${filter === "no-alt" ? "bg-rose-600 text-white" : "bg-rose-50 text-rose-700 hover:bg-rose-100"}`,
								title: "Filter files with no Alt Text",
								children: [
									"No Alt (",
									missingAltCount,
									")"
								]
							})
						]
					})]
				}), /* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-2",
					children: [onAutoFillAltTexts && missingAltCount > 0 && /* @__PURE__ */ jsxs("button", {
						onClick: handleAutoFillAllAlt,
						disabled: fillingAlt,
						className: "inline-flex items-center gap-1.5 rounded-xl border border-indigo-200 bg-indigo-50/80 px-3 py-1.5 text-xs font-bold text-indigo-700 hover:bg-indigo-100 transition shadow-2xs cursor-pointer disabled:opacity-50",
						title: "Automatically generate Alt Text for all items without alt text",
						children: [
							/* @__PURE__ */ jsx(Sparkles, { className: `h-3.5 w-3.5 text-indigo-600 ${fillingAlt ? "animate-spin" : ""}` }),
							"Auto-fill Alt Texts (",
							missingAltCount,
							")"
						]
					}), /* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-1 border-l border-slate-200 pl-2",
						children: [/* @__PURE__ */ jsx("button", {
							onClick: () => setViewMode("grid"),
							className: `rounded-lg p-1.5 transition ${viewMode === "grid" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`,
							title: "Grid View",
							children: /* @__PURE__ */ jsx(LayoutGrid, { className: "h-4 w-4" })
						}), /* @__PURE__ */ jsx("button", {
							onClick: () => setViewMode("list"),
							className: `rounded-lg p-1.5 transition ${viewMode === "list" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`,
							title: "List View",
							children: /* @__PURE__ */ jsx(List, { className: "h-4 w-4" })
						})]
					})]
				})]
			}),
			viewMode === "grid" ? /* @__PURE__ */ jsx("div", {
				className: "grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
				children: filtered.map((m) => {
					const isDup = duplicateInfo.has(m.id);
					const dupData = duplicateInfo.get(m.id);
					return /* @__PURE__ */ jsxs("div", {
						className: `group relative overflow-hidden rounded-2xl border bg-white shadow-2xs transition hover:shadow-md ${isDup ? "border-amber-300 ring-1 ring-amber-300/50" : "border-slate-200"}`,
						children: [
							isDup && /* @__PURE__ */ jsxs("div", {
								onClick: () => setQ(dupData?.groupKey || m.name),
								className: "absolute top-2 left-2 z-10 flex items-center gap-1 rounded-md bg-amber-500/90 text-white px-2 py-0.5 text-[10px] font-bold shadow-xs cursor-pointer hover:bg-amber-600 transition backdrop-blur-xs",
								title: `Click to filter duplicate group: ${dupData?.reason}`,
								children: [
									/* @__PURE__ */ jsx(AlertTriangle, { className: "h-3 w-3" }),
									"Duplicate (",
									dupData?.count,
									")"
								]
							}),
							/* @__PURE__ */ jsx("div", {
								className: "aspect-video w-full bg-slate-100 overflow-hidden relative grid place-items-center",
								children: m.url && m.url.match(/\.(mp4|webm)$/i) || m.type === "video" ? /* @__PURE__ */ jsxs("div", {
									className: "flex flex-col items-center justify-center text-slate-500",
									children: [/* @__PURE__ */ jsx(Video, { className: "h-8 w-8 mb-1" }), /* @__PURE__ */ jsx("span", {
										className: "text-[10px] font-semibold",
										children: "Video File"
									})]
								}) : m.url && m.url.match(/\.(pdf|doc|docx)$/i) || m.type === "document" ? /* @__PURE__ */ jsxs("div", {
									className: "flex flex-col items-center justify-center text-slate-500",
									children: [/* @__PURE__ */ jsx(FileText, { className: "h-8 w-8 mb-1" }), /* @__PURE__ */ jsx("span", {
										className: "text-[10px] font-semibold",
										children: "Document"
									})]
								}) : /* @__PURE__ */ jsx(SafeImage, {
									src: m.url || "",
									alt: m.altText || m.name,
									loading: "lazy",
									className: "h-full w-full object-cover transition duration-300 group-hover:scale-105"
								})
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "p-3",
								children: [
									/* @__PURE__ */ jsx("p", {
										className: "truncate text-xs font-semibold text-slate-900",
										title: m.name || m.url,
										children: m.name || m.url.split("/").pop()
									}),
									/* @__PURE__ */ jsx("p", {
										className: "mt-0.5 text-[11px] text-slate-500 truncate",
										title: m.altText,
										children: m.altText ? /* @__PURE__ */ jsx("span", {
											className: "text-slate-600",
											children: m.altText
										}) : /* @__PURE__ */ jsx("span", {
											className: "italic text-rose-500 font-medium",
											children: "No alt text"
										})
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "mt-2.5 flex items-center justify-between border-t border-slate-100 pt-2",
										children: [/* @__PURE__ */ jsxs("button", {
											onClick: () => copyUrl(m.url),
											className: "inline-flex items-center gap-1 text-[11px] font-semibold text-slate-600 hover:text-slate-900",
											children: [/* @__PURE__ */ jsx(Copy, { className: "h-3 w-3" }), " Copy"]
										}), /* @__PURE__ */ jsxs("div", {
											className: "flex items-center gap-1.5",
											children: [
												onReplace && /* @__PURE__ */ jsx("button", {
													onClick: () => handleQuickReplaceTrigger(m.id),
													className: "rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition",
													title: "Replace Image File (< 1 MB)",
													children: /* @__PURE__ */ jsx(RefreshCw, { className: "h-3.5 w-3.5 text-indigo-600" })
												}),
												onEdit && /* @__PURE__ */ jsx("button", {
													onClick: () => setEditingItem(m),
													className: "rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition",
													title: "Edit Details & Alt Text",
													children: /* @__PURE__ */ jsx(Edit2, { className: "h-3.5 w-3.5" })
												}),
												onDelete && /* @__PURE__ */ jsx("button", {
													onClick: () => onDelete(m.id),
													className: "rounded-md p-1 text-red-400 hover:bg-red-50 hover:text-red-600 transition",
													title: "Delete Media",
													children: /* @__PURE__ */ jsx(Trash2, { className: "h-3.5 w-3.5" })
												})
											]
										})]
									})
								]
							})
						]
					}, m.id || m.url);
				})
			}) : /* @__PURE__ */ jsx("div", {
				className: "rounded-2xl border border-slate-200 bg-white shadow-2xs overflow-hidden",
				children: /* @__PURE__ */ jsxs("table", {
					className: "w-full text-left text-sm",
					children: [/* @__PURE__ */ jsx("thead", {
						className: "bg-slate-50/80 text-slate-500 text-[11px] uppercase font-bold tracking-wider border-b border-slate-200/80",
						children: /* @__PURE__ */ jsxs("tr", { children: [
							/* @__PURE__ */ jsx("th", {
								className: "px-4 py-3",
								children: "Preview"
							}),
							/* @__PURE__ */ jsx("th", {
								className: "px-4 py-3",
								children: "File Name & Alt Text"
							}),
							/* @__PURE__ */ jsx("th", {
								className: "px-4 py-3",
								children: "Status"
							}),
							/* @__PURE__ */ jsx("th", {
								className: "px-4 py-3",
								children: "Type"
							}),
							/* @__PURE__ */ jsx("th", {
								className: "px-4 py-3",
								children: "Size"
							}),
							/* @__PURE__ */ jsx("th", {
								className: "px-4 py-3 text-right",
								children: "Actions"
							})
						] })
					}), /* @__PURE__ */ jsx("tbody", {
						className: "divide-y divide-slate-100",
						children: filtered.map((m) => {
							const isDup = duplicateInfo.has(m.id);
							const dupData = duplicateInfo.get(m.id);
							return /* @__PURE__ */ jsxs("tr", {
								className: `transition hover:bg-slate-50/60 ${isDup ? "bg-amber-50/20" : ""}`,
								children: [
									/* @__PURE__ */ jsx("td", {
										className: "px-4 py-3 w-20",
										children: /* @__PURE__ */ jsx("div", {
											className: "h-12 w-16 bg-slate-100 rounded-lg overflow-hidden grid place-items-center border border-slate-200/70",
											children: m.url && m.url.match(/\.(mp4|webm)$/i) || m.type === "video" ? /* @__PURE__ */ jsx(Video, { className: "h-5 w-5 text-slate-400" }) : m.url && m.url.match(/\.(pdf|doc|docx)$/i) || m.type === "document" ? /* @__PURE__ */ jsx(FileText, { className: "h-5 w-5 text-slate-400" }) : /* @__PURE__ */ jsx(SafeImage, {
												src: m.url || "",
												alt: m.altText || m.name,
												className: "h-full w-full object-cover"
											})
										})
									}),
									/* @__PURE__ */ jsxs("td", {
										className: "px-4 py-3",
										children: [/* @__PURE__ */ jsx("p", {
											className: "font-bold text-slate-900 max-w-xs truncate text-xs sm:text-sm",
											title: m.name || m.url,
											children: m.name || m.url.split("/").pop()
										}), /* @__PURE__ */ jsx("p", {
											className: "text-xs text-slate-500 truncate max-w-xs mt-0.5",
											title: m.altText,
											children: m.altText ? /* @__PURE__ */ jsxs("span", {
												className: "text-slate-600 font-medium",
												children: ["Alt: ", m.altText]
											}) : /* @__PURE__ */ jsx("span", {
												className: "italic text-rose-500 font-medium",
												children: "No alt text"
											})
										})]
									}),
									/* @__PURE__ */ jsx("td", {
										className: "px-4 py-3",
										children: isDup ? /* @__PURE__ */ jsxs("button", {
											type: "button",
											onClick: () => setQ(dupData?.groupKey || m.name),
											className: "inline-flex items-center gap-1 rounded-md bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800 hover:bg-amber-200 transition cursor-pointer",
											title: `${dupData?.reason} — Click to filter matching copies`,
											children: [
												/* @__PURE__ */ jsx(AlertTriangle, { className: "h-3 w-3 text-amber-600" }),
												"Duplicate (",
												dupData?.count,
												")"
											]
										}) : /* @__PURE__ */ jsx("span", {
											className: "text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md",
											children: "Unique"
										})
									}),
									/* @__PURE__ */ jsx("td", {
										className: "px-4 py-3 text-slate-500 text-xs capitalize",
										children: m.type || "image"
									}),
									/* @__PURE__ */ jsx("td", {
										className: "px-4 py-3 text-slate-500 text-xs font-mono",
										children: m.size || "-"
									}),
									/* @__PURE__ */ jsx("td", {
										className: "px-4 py-3 text-right",
										children: /* @__PURE__ */ jsxs("div", {
											className: "flex items-center justify-end gap-2",
											children: [
												/* @__PURE__ */ jsx("button", {
													onClick: () => copyUrl(m.url),
													className: "rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition",
													title: "Copy URL",
													children: /* @__PURE__ */ jsx(Copy, { className: "h-4 w-4" })
												}),
												onReplace && /* @__PURE__ */ jsx("button", {
													onClick: () => handleQuickReplaceTrigger(m.id),
													className: "rounded-lg p-1.5 text-indigo-600 hover:bg-indigo-50 hover:text-indigo-800 transition",
													title: "Replace Image File (< 1 MB)",
													children: /* @__PURE__ */ jsx(RefreshCw, { className: "h-4 w-4" })
												}),
												onEdit && /* @__PURE__ */ jsx("button", {
													onClick: () => setEditingItem(m),
													className: "rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition",
													title: "Edit Details & Alt Text",
													children: /* @__PURE__ */ jsx(Edit2, { className: "h-4 w-4" })
												}),
												onDelete && /* @__PURE__ */ jsx("button", {
													onClick: () => onDelete(m.id),
													className: "rounded-lg p-1.5 text-red-400 hover:bg-red-50 hover:text-red-600 transition",
													title: "Delete",
													children: /* @__PURE__ */ jsx(Trash2, { className: "h-4 w-4" })
												})
											]
										})
									})
								]
							}, m.id || m.url);
						})
					})]
				})
			}),
			filtered.length === 0 && /* @__PURE__ */ jsx("div", {
				className: "col-span-full py-12 text-center text-xs text-slate-400",
				children: "No media files found matching your search."
			}),
			editingItem && onEdit && /* @__PURE__ */ jsx(EditMediaModal, {
				item: editingItem,
				isDuplicate: duplicateInfo.has(editingItem.id),
				duplicateCount: duplicateInfo.get(editingItem.id)?.count,
				onClose: () => setEditingItem(null),
				onSave: onEdit,
				onReplace
			})
		]
	});
}
//#endregion
//#region src/routes/admin.files.tsx?tsr-split=component
function FileManagerPage() {
	const [items, setItems] = useState([]);
	const fileRef = useRef(null);
	const refresh = () => setItems(mediaLibrary.list());
	useEffect(() => {
		refresh();
		const h = () => refresh();
		window.addEventListener("media-library-change", h);
		return () => window.removeEventListener("media-library-change", h);
	}, []);
	const totalSize = items.reduce((s, m) => s + m.size, 0);
	const onUpload = async (files) => {
		if (!files?.length) return;
		let count = 0;
		const domain = window.location.hostname;
		const MAX_FILE_SIZE = 1 * 1024 * 1024;
		for (const f of Array.from(files)) {
			if (f.size > MAX_FILE_SIZE) {
				toast.error(`"${f.name}" (${formatBytes(f.size)}) exceeds 1 MB. File size must be less than 1 MB.`);
				continue;
			}
			try {
				const defaultName = f.name.split(".").slice(0, -1).join(".") || f.name;
				let customName = window.prompt(`Enter a custom name for ${f.name} (or leave blank to keep original):`, defaultName);
				if (customName === null) continue;
				customName = customName.trim() || f.name;
				const timestamp = (/* @__PURE__ */ new Date()).toLocaleString();
				const customDescription = `Uploaded at: ${timestamp} | Source: ${domain}`;
				let siteName = "News Theme";
				try {
					const settings = JSON.parse(localStorage.getItem("nt:site-settings") || "{}");
					if (settings.siteName) siteName = settings.siteName;
				} catch (e) {}
				const watermarkData = `Site Name: ${siteName} | Copyright: ${domain} | Timestamp: ${timestamp} | Note: Do not copy without permission.`;
				await trackUpload(f, "other", customName, customDescription, watermarkData);
				count++;
			} catch (err) {
				toast.error(err?.message || `Failed: ${f.name}`);
			}
		}
		if (fileRef.current) fileRef.current.value = "";
		if (count) toast.success(`Uploaded ${count} file${count > 1 ? "s" : ""}`);
		refresh();
	};
	const handleDelete = (id) => {
		if (!confirm("Delete this file permanently?")) return;
		mediaLibrary.remove(id);
		toast.success("File deleted");
		refresh();
	};
	const handleEdit = (id, name, altText, description) => {
		mediaLibrary.update(id, {
			name,
			altText,
			description
		});
		toast.success("File details updated");
		refresh();
	};
	const handleReplace = async (id, file, name, altText, description) => {
		try {
			await mediaLibrary.replace(id, file, name, altText);
			if (description) await mediaLibrary.update(id, { description });
			toast.success("File replaced successfully");
			refresh();
		} catch (err) {
			toast.error(err?.message || "Failed to replace file");
		}
	};
	const handleAutoFillAltTexts = async () => {
		const updatedCount = await mediaLibrary.autoFillMissingAltTexts();
		refresh();
		return updatedCount;
	};
	return /* @__PURE__ */ jsxs("div", {
		className: "space-y-6",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4",
			children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h1", {
				className: "text-xl sm:text-2xl font-bold tracking-tight",
				children: "Media & File Library"
			}), /* @__PURE__ */ jsx("p", {
				className: "text-xs sm:text-sm text-slate-500 mt-0.5",
				children: "Upload, manage, and reuse images, videos, and news assets across your site (Max 1 MB per file)."
			})] }), /* @__PURE__ */ jsxs("div", {
				className: "flex flex-wrap items-center gap-1.5 sm:gap-2.5",
				children: [
					/* @__PURE__ */ jsx(CsvImportExport, {
						data: items,
						filename: "media-library",
						onImport: (data) => {
							if (!data || data.length === 0) return;
							let imported = 0;
							for (const item of data) {
								if (!item.id || !item.name) continue;
								if (!mediaLibrary.get(item.id)) {
									mediaLibrary.add(item);
									imported++;
								}
							}
							if (imported > 0) {
								toast.success(`Imported ${imported} new media items`);
								refresh();
							} else toast.info("No new items to import");
						}
					}),
					/* @__PURE__ */ jsxs(Link, {
						to: "/verify-image",
						target: "_blank",
						title: "Scan any image for Layer 1 EXIF signature and Layer 2 pixel steganography DNA",
						className: "inline-flex items-center gap-1.5 rounded-lg border border-indigo-200 bg-indigo-50/80 px-2.5 sm:px-3 py-1.5 text-xs font-semibold text-indigo-700 hover:bg-indigo-100 transition whitespace-nowrap shadow-2xs",
						children: [/* @__PURE__ */ jsx(ShieldCheck, { className: "h-3.5 w-3.5 text-indigo-600" }), "Verify Scanner"]
					}),
					/* @__PURE__ */ jsxs("span", {
						className: "text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 sm:px-3 py-1.5 rounded-lg border border-slate-200 whitespace-nowrap",
						children: [
							items.length,
							" files (",
							formatBytes(totalSize),
							")"
						]
					}),
					/* @__PURE__ */ jsxs("button", {
						onClick: () => fileRef.current?.click(),
						title: "Upload Files (Max 1 MB per file)",
						className: "inline-flex items-center gap-1.5 sm:gap-2 rounded-lg bg-slate-900 px-2.5 sm:px-3.5 py-1.5 text-xs sm:text-sm font-semibold text-white hover:bg-slate-800 transition whitespace-nowrap shadow-xs",
						children: [/* @__PURE__ */ jsx(Upload, { className: "h-3.5 w-3.5 sm:h-4 sm:w-4" }), " Upload Files (< 1 MB)"]
					}),
					/* @__PURE__ */ jsx("input", {
						ref: fileRef,
						type: "file",
						multiple: true,
						accept: "image/*,video/*,.pdf",
						onChange: (e) => onUpload(e.target.files),
						className: "hidden"
					})
				]
			})]
		}), /* @__PURE__ */ jsx(MediaGrid, {
			items: items.map((m) => ({
				id: m.id,
				url: m.dataUrl || m.url,
				name: m.name,
				altText: m.altText,
				description: m.description,
				size: formatBytes(m.size),
				rawSize: m.size,
				uploadedAt: m.createdAt ? new Date(m.createdAt).toLocaleDateString() : void 0,
				type: m.type.startsWith("video/") ? "video" : m.type.startsWith("image/") ? "image" : "document"
			})),
			onDelete: handleDelete,
			onEdit: handleEdit,
			onReplace: handleReplace,
			onAutoFillAltTexts: handleAutoFillAltTexts
		})]
	});
}
//#endregion
export { FileManagerPage as component };

//# sourceMappingURL=admin.files-BQ4vDvg5.js.map