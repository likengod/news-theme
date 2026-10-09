import { a as trackUpload, i as mediaLibrary, n as deriveAltText, r as formatBytes } from "./media-library-ww8BKrZj.js";
import { a as DropdownMenuSeparator, i as DropdownMenuLabel, n as DropdownMenuContent, o as DropdownMenuTrigger, r as DropdownMenuItem, t as DropdownMenu } from "./dropdown-menu-DXMm4jWj.js";
import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { AlertTriangle, ArrowUpDown, Check, ChevronDown, Copy, Download, Edit2, FileArchive, FileSpreadsheet, FileText, FolderArchive, Image, LayoutGrid, List, RefreshCw, Search, ShieldCheck, SlidersHorizontal, Sparkles, Trash2, Upload, Video, X } from "lucide-react";
import { toast } from "sonner";
import JSZip from "jszip";
import Papa from "papaparse";
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
//#region src/lib/media-zip.ts
/**
* Extracts and imports all media files from a .zip archive.
* Supports archives with a manifest.json / metadata.json, or plain folders of images/videos/documents.
*/
async function extractAndImportZip(zipFile, onProgress) {
	const zip = await JSZip.loadAsync(zipFile);
	const errors = [];
	let imported = 0;
	let skipped = 0;
	const manifestMap = /* @__PURE__ */ new Map();
	const manifestCandidate = zip.file("manifest.json") || zip.file("metadata.json") || zip.file("media_library.json") || zip.file("files/manifest.json");
	if (manifestCandidate) try {
		const manifestText = await manifestCandidate.async("text");
		const parsed = JSON.parse(manifestText);
		const items = Array.isArray(parsed) ? parsed : parsed.items || [];
		for (const it of items) {
			if (it.filename) {
				const base = it.filename.split("/").pop() || it.filename;
				manifestMap.set(base.toLowerCase(), it);
			}
			if (it.name) manifestMap.set(it.name.toLowerCase(), it);
		}
	} catch (e) {
		console.warn("[MediaZip] Failed to parse manifest JSON:", e);
	}
	const validEntries = Object.values(zip.files).filter((entry) => {
		if (entry.dir) return false;
		const name = entry.name;
		if (name.startsWith("__MACOSX") || name.startsWith("._")) return false;
		if (name.endsWith(".DS_Store") || name.endsWith("Thumbs.db")) return false;
		if (name.endsWith(".json")) return false;
		return /\.(jpg|jpeg|png|webp|gif|svg|avif|mp4|webm|pdf|doc|docx)$/i.test(name);
	});
	const total = validEntries.length;
	if (total === 0) throw new Error("No supported media files (images, videos, documents) found in this ZIP archive.");
	const domain = typeof window !== "undefined" ? window.location.hostname : "todaytripura.com";
	for (let i = 0; i < total; i++) {
		const entry = validEntries[i];
		const rawFilename = entry.name.split("/").pop() || entry.name;
		const cleanBasename = rawFilename.replace(/\.[a-zA-Z0-9]+$/, "");
		const ext = rawFilename.split(".").pop()?.toLowerCase() || "";
		onProgress?.(i + 1, total, `Extracting ${rawFilename} (${i + 1}/${total})...`);
		let mime = "application/octet-stream";
		if (["jpg", "jpeg"].includes(ext)) mime = "image/jpeg";
		else if (ext === "png") mime = "image/png";
		else if (ext === "webp") mime = "image/webp";
		else if (ext === "gif") mime = "image/gif";
		else if (ext === "svg") mime = "image/svg+xml";
		else if (ext === "avif") mime = "image/avif";
		else if (["mp4", "webm"].includes(ext)) mime = `video/${ext}`;
		else if (ext === "pdf") mime = "application/pdf";
		try {
			const blob = await entry.async("blob");
			if (blob.size > 1048576) {
				skipped++;
				errors.push(`"${rawFilename}" (${formatBytes(blob.size)}) exceeds the 1 MB limit.`);
				continue;
			}
			const file = new File([blob], rawFilename, { type: mime });
			const meta = manifestMap.get(rawFilename.toLowerCase()) || manifestMap.get(cleanBasename.toLowerCase());
			const effectiveName = meta?.name || cleanBasename || rawFilename;
			const effectiveAltText = meta?.altText || deriveAltText(effectiveName);
			await trackUpload(file, "other", effectiveName, meta?.description || `Imported from ZIP backup: ${zipFile.name} | Host: ${domain}`, void 0, effectiveAltText);
			imported++;
		} catch (entryErr) {
			skipped++;
			errors.push(`Failed to import "${rawFilename}": ${entryErr?.message || "Unknown error"}`);
		}
	}
	return {
		imported,
		skipped,
		errors
	};
}
/**
* Packages selected or all media files into a downloadable ZIP archive with manifest.json
*/
async function exportMediaZip(items, zipFilename = `media-backup-${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.zip`) {
	if (!items || items.length === 0) {
		toast.error("No media files to export.");
		return;
	}
	const toastId = toast.loading(`Preparing ZIP backup of ${items.length} files...`);
	try {
		const zip = new JSZip();
		const manifest = [];
		const filesFolder = zip.folder("files") || zip;
		let successCount = 0;
		for (let i = 0; i < items.length; i++) {
			const it = items[i];
			try {
				let blob = null;
				if (it.url && it.url.startsWith("data:")) blob = await (await fetch(it.url)).blob();
				else if (it.url) {
					const res = await fetch(it.url);
					if (res.ok) blob = await res.blob();
				}
				if (blob) {
					let ext = "webp";
					if (it.url) {
						const m = it.url.match(/\.([a-zA-Z0-9]+)(?:\?.*)?$/);
						if (m) ext = m[1].toLowerCase();
					}
					if (ext.length > 5) ext = "webp";
					const safeFilename = `${it.name.replace(/[^a-zA-Z0-9_\-\s]/g, "_").trim() || "media"}.${ext}`;
					filesFolder.file(safeFilename, blob);
					manifest.push({
						id: it.id,
						name: it.name,
						filename: `files/${safeFilename}`,
						altText: it.altText || "",
						description: it.description || "",
						type: it.type || "image",
						size: it.size || "",
						createdAt: it.createdAt || Date.now()
					});
					successCount++;
				}
			} catch (fileErr) {
				console.warn(`[MediaZip] Failed to include file ${it.name}:`, fileErr);
			}
		}
		if (successCount === 0) {
			toast.error("Could not download any media files to package into ZIP.", { id: toastId });
			return;
		}
		zip.file("manifest.json", JSON.stringify(manifest, null, 2));
		const zipBlob = await zip.generateAsync({ type: "blob" });
		const downloadUrl = URL.createObjectURL(zipBlob);
		const a = document.createElement("a");
		a.href = downloadUrl;
		a.download = zipFilename;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		URL.revokeObjectURL(downloadUrl);
		toast.success(`Successfully exported ${successCount} files to ${zipFilename}!`, { id: toastId });
	} catch (err) {
		toast.error(err?.message || "Failed to generate ZIP archive.", { id: toastId });
	}
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
function getItemByteSize(item) {
	if (typeof item.rawSize === "number" && !isNaN(item.rawSize) && item.rawSize > 0) return item.rawSize;
	if (!item.size || item.size === "-") return 0;
	const match = item.size.match(/([\d\.]+)\s*(MB|KB|B|bytes)/i);
	if (!match) return 0;
	const val = parseFloat(match[1]);
	const unit = match[2].toUpperCase();
	if (unit === "MB") return val * 1024 * 1024;
	if (unit === "KB") return val * 1024;
	return val;
}
function MediaGrid({ items, onDelete, onDeleteMultiple, onEdit, onReplace, onAutoFillAltTexts }) {
	const [filter, setFilter] = useState("all");
	const [sizeFilter, setSizeFilter] = useState("all");
	const [sortBy, setSortBy] = useState("size-desc");
	const [selectedIds, setSelectedIds] = useState(/* @__PURE__ */ new Set());
	const [q, setQ] = useState("");
	const [viewMode, setViewMode] = useState("list");
	const [editingItem, setEditingItem] = useState(null);
	const [fillingAlt, setFillingAlt] = useState(false);
	const [isDeletingBulk, setIsDeletingBulk] = useState(false);
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
	const typeCounts = useMemo(() => {
		let images = 0;
		let videos = 0;
		let docs = 0;
		for (const it of items) if (it.type === "video") videos++;
		else if (it.type === "document") docs++;
		else images++;
		return {
			all: items.length,
			images,
			videos,
			docs
		};
	}, [items]);
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
	const filteredAndSorted = useMemo(() => {
		let result = items.filter((it) => {
			if (!`${it.name}${it.url || ""}${it.altText || ""}`.toLowerCase().includes(q.toLowerCase())) return false;
			if (filter === "duplicates") {
				if (!duplicateInfo.has(it.id)) return false;
			} else if (filter === "no-alt") {
				if (it.altText && it.altText.trim() !== "") return false;
			} else if (filter !== "all") {
				if ((it.type || "image") !== filter) return false;
			}
			const byteSize = getItemByteSize(it);
			if (sizeFilter === "large") {
				if (byteSize < 500 * 1024) return false;
			} else if (sizeFilter === "medium") {
				if (byteSize < 100 * 1024 || byteSize >= 500 * 1024) return false;
			} else if (sizeFilter === "small") {
				if (byteSize >= 100 * 1024) return false;
			}
			return true;
		});
		result = [...result].sort((a, b) => {
			if (sortBy === "size-desc") return getItemByteSize(b) - getItemByteSize(a);
			if (sortBy === "size-asc") return getItemByteSize(a) - getItemByteSize(b);
			if (sortBy === "date-desc") return (b.createdAt || 0) - (a.createdAt || 0);
			if (sortBy === "date-asc") return (a.createdAt || 0) - (b.createdAt || 0);
			if (sortBy === "name-asc") return (a.name || "").localeCompare(b.name || "");
			if (sortBy === "name-desc") return (b.name || "").localeCompare(a.name || "");
			return 0;
		});
		return result;
	}, [
		items,
		q,
		filter,
		sizeFilter,
		sortBy,
		duplicateInfo
	]);
	const toggleSelect = (id) => {
		setSelectedIds((prev) => {
			const next = new Set(prev);
			if (next.has(id)) next.delete(id);
			else next.add(id);
			return next;
		});
	};
	const isAllVisibleSelected = filteredAndSorted.length > 0 && filteredAndSorted.every((it) => selectedIds.has(it.id));
	const toggleSelectAllVisible = () => {
		if (isAllVisibleSelected) setSelectedIds((prev) => {
			const next = new Set(prev);
			filteredAndSorted.forEach((it) => next.delete(it.id));
			return next;
		});
		else setSelectedIds((prev) => {
			const next = new Set(prev);
			filteredAndSorted.forEach((it) => next.add(it.id));
			return next;
		});
	};
	const selectAllLibrary = () => {
		setSelectedIds(new Set(items.map((it) => it.id)));
	};
	const clearSelection = () => {
		setSelectedIds(/* @__PURE__ */ new Set());
	};
	const selectedBytes = useMemo(() => {
		let total = 0;
		for (const it of items) if (selectedIds.has(it.id)) total += getItemByteSize(it);
		return total;
	}, [items, selectedIds]);
	const handleBatchDelete = async () => {
		if (selectedIds.size === 0) return;
		const ids = Array.from(selectedIds);
		if (!confirm(`Are you sure you want to permanently delete all ${ids.length} selected files?`)) return;
		setIsDeletingBulk(true);
		try {
			if (onDeleteMultiple) await onDeleteMultiple(ids);
			else if (onDelete) for (const id of ids) onDelete(id);
			setSelectedIds(/* @__PURE__ */ new Set());
		} finally {
			setIsDeletingBulk(false);
		}
	};
	const handleExportSelectedZip = async () => {
		if (selectedIds.size === 0) return;
		await exportMediaZip(items.filter((it) => selectedIds.has(it.id)), `selected-media-${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.zip`);
	};
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
			selectedIds.size > 0 && /* @__PURE__ */ jsxs("div", {
				className: "flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-rose-200 bg-rose-50/90 px-4 py-3 shadow-xs",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-2.5",
					children: [/* @__PURE__ */ jsx("span", {
						className: "flex h-5 w-5 items-center justify-center rounded-md bg-rose-600 text-white text-xs font-bold shadow-2xs",
						children: "✓"
					}), /* @__PURE__ */ jsxs("span", {
						className: "text-xs sm:text-sm font-bold text-rose-950",
						children: [
							selectedIds.size,
							" file",
							selectedIds.size > 1 ? "s" : "",
							" selected",
							/* @__PURE__ */ jsxs("span", {
								className: "ml-1.5 font-normal text-rose-700",
								children: [
									"(",
									formatBytes(selectedBytes),
									")"
								]
							})
						]
					})]
				}), /* @__PURE__ */ jsxs("div", {
					className: "flex flex-wrap items-center gap-2",
					children: [
						/* @__PURE__ */ jsx("button", {
							type: "button",
							onClick: toggleSelectAllVisible,
							className: "rounded-lg border border-rose-300 bg-white px-2.5 py-1 text-xs font-semibold text-rose-900 hover:bg-rose-100 transition shadow-2xs cursor-pointer",
							children: isAllVisibleSelected ? "Deselect Filtered" : `Select Filtered (${filteredAndSorted.length})`
						}),
						items.length > filteredAndSorted.length && /* @__PURE__ */ jsxs("button", {
							type: "button",
							onClick: selectAllLibrary,
							className: "rounded-lg border border-rose-300 bg-white px-2.5 py-1 text-xs font-semibold text-rose-900 hover:bg-rose-100 transition shadow-2xs cursor-pointer",
							children: [
								"Select All Library (",
								items.length,
								")"
							]
						}),
						/* @__PURE__ */ jsxs("button", {
							type: "button",
							onClick: handleExportSelectedZip,
							className: "inline-flex items-center gap-1.5 rounded-lg border border-amber-300 bg-white px-2.5 py-1 text-xs font-semibold text-amber-900 hover:bg-amber-50 transition shadow-2xs cursor-pointer",
							title: "Download selected files in a ZIP archive",
							children: [
								/* @__PURE__ */ jsx(FileArchive, { className: "h-3.5 w-3.5 text-amber-600" }),
								"Export ZIP (",
								selectedIds.size,
								")"
							]
						}),
						/* @__PURE__ */ jsx("button", {
							type: "button",
							onClick: clearSelection,
							className: "rounded-lg border border-slate-300 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition shadow-2xs cursor-pointer",
							children: "Clear"
						}),
						/* @__PURE__ */ jsxs("button", {
							type: "button",
							onClick: handleBatchDelete,
							disabled: isDeletingBulk,
							className: "inline-flex items-center gap-1.5 rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-rose-700 transition shadow-xs disabled:opacity-50 cursor-pointer",
							children: [/* @__PURE__ */ jsx(Trash2, { className: "h-3.5 w-3.5" }), isDeletingBulk ? "Deleting..." : `Delete Selected (${selectedIds.size})`]
						})
					]
				})]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "rounded-2xl border border-slate-200 bg-white p-3 sm:p-4 shadow-xs space-y-3",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 sm:gap-3",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "relative flex-1 min-w-[200px]",
						children: [
							/* @__PURE__ */ jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" }),
							/* @__PURE__ */ jsx("input", {
								type: "text",
								value: q,
								onChange: (e) => setQ(e.target.value),
								placeholder: "Search media files by name or alt text...",
								className: "h-9 w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-9 pr-8 text-xs focus:bg-white focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 transition"
							}),
							q && /* @__PURE__ */ jsx("button", {
								type: "button",
								onClick: () => setQ(""),
								className: "absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 p-0.5 rounded-full hover:bg-slate-100 transition cursor-pointer",
								title: "Clear search",
								children: /* @__PURE__ */ jsx(X, { className: "h-3.5 w-3.5" })
							})
						]
					}), /* @__PURE__ */ jsxs("div", {
						className: "flex flex-wrap items-center gap-2 shrink-0",
						children: [
							/* @__PURE__ */ jsxs("label", {
								className: "relative inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50/80 hover:bg-slate-100/80 px-2.5 py-1.5 text-xs font-semibold text-slate-700 transition cursor-pointer shadow-2xs",
								children: [/* @__PURE__ */ jsx(SlidersHorizontal, { className: "h-3.5 w-3.5 text-slate-500 shrink-0 pointer-events-none" }), /* @__PURE__ */ jsxs("select", {
									value: sizeFilter,
									onChange: (e) => setSizeFilter(e.target.value),
									className: "bg-transparent text-xs font-semibold text-slate-700 focus:outline-none cursor-pointer pr-1",
									title: "Filter by file size",
									children: [
										/* @__PURE__ */ jsx("option", {
											value: "all",
											children: "All Sizes"
										}),
										/* @__PURE__ */ jsx("option", {
											value: "large",
											children: "Large (> 500 KB)"
										}),
										/* @__PURE__ */ jsx("option", {
											value: "medium",
											children: "Medium (100–500 KB)"
										}),
										/* @__PURE__ */ jsx("option", {
											value: "small",
											children: "Small (< 100 KB)"
										})
									]
								})]
							}),
							/* @__PURE__ */ jsxs("label", {
								className: "relative inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50/80 hover:bg-slate-100/80 px-2.5 py-1.5 text-xs font-semibold text-slate-700 transition cursor-pointer shadow-2xs",
								children: [/* @__PURE__ */ jsx(ArrowUpDown, { className: "h-3.5 w-3.5 text-slate-500 shrink-0 pointer-events-none" }), /* @__PURE__ */ jsxs("select", {
									value: sortBy,
									onChange: (e) => setSortBy(e.target.value),
									className: "bg-transparent text-xs font-semibold text-slate-700 focus:outline-none cursor-pointer pr-1",
									title: "Sort items",
									children: [
										/* @__PURE__ */ jsx("option", {
											value: "size-desc",
											children: "Size: Largest (1 MB → 0)"
										}),
										/* @__PURE__ */ jsx("option", {
											value: "size-asc",
											children: "Size: Smallest (0 → 1 MB)"
										}),
										/* @__PURE__ */ jsx("option", {
											value: "date-desc",
											children: "Date: Newest"
										}),
										/* @__PURE__ */ jsx("option", {
											value: "date-asc",
											children: "Date: Oldest"
										}),
										/* @__PURE__ */ jsx("option", {
											value: "name-asc",
											children: "Name: A → Z"
										}),
										/* @__PURE__ */ jsx("option", {
											value: "name-desc",
											children: "Name: Z → A"
										})
									]
								})]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "inline-flex items-center rounded-xl border border-slate-200 bg-slate-100/80 p-0.5 shadow-2xs",
								children: [/* @__PURE__ */ jsxs("button", {
									type: "button",
									onClick: () => setViewMode("grid"),
									className: `inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-medium transition cursor-pointer ${viewMode === "grid" ? "bg-white text-slate-900 shadow-xs font-semibold" : "text-slate-600 hover:text-slate-900"}`,
									title: "Grid View",
									children: [/* @__PURE__ */ jsx(LayoutGrid, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ jsx("span", {
										className: "hidden sm:inline",
										children: "Grid"
									})]
								}), /* @__PURE__ */ jsxs("button", {
									type: "button",
									onClick: () => setViewMode("list"),
									className: `inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-medium transition cursor-pointer ${viewMode === "list" ? "bg-white text-slate-900 shadow-xs font-semibold" : "text-slate-600 hover:text-slate-900"}`,
									title: "List View",
									children: [/* @__PURE__ */ jsx(List, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ jsx("span", {
										className: "hidden sm:inline",
										children: "List"
									})]
								})]
							})
						]
					})]
				}), /* @__PURE__ */ jsxs("div", {
					className: "flex flex-wrap items-center justify-between gap-2.5 pt-2.5 border-t border-slate-100",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "flex flex-wrap items-center gap-1.5",
						children: [
							/* @__PURE__ */ jsxs("button", {
								type: "button",
								onClick: () => setFilter("all"),
								className: `inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold transition cursor-pointer ${filter === "all" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`,
								children: [/* @__PURE__ */ jsx("span", { children: "All" }), /* @__PURE__ */ jsx("span", {
									className: `text-[10px] px-1.5 py-0.2 rounded-full font-bold ${filter === "all" ? "bg-slate-800 text-slate-200" : "bg-slate-200/70 text-slate-600"}`,
									children: typeCounts.all
								})]
							}),
							/* @__PURE__ */ jsxs("button", {
								type: "button",
								onClick: () => setFilter("image"),
								className: `inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold transition cursor-pointer ${filter === "image" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`,
								children: [
									/* @__PURE__ */ jsx(Image, { className: "h-3 w-3" }),
									/* @__PURE__ */ jsx("span", { children: "Images" }),
									/* @__PURE__ */ jsx("span", {
										className: `text-[10px] px-1.5 py-0.2 rounded-full font-bold ${filter === "image" ? "bg-slate-800 text-slate-200" : "bg-slate-200/70 text-slate-600"}`,
										children: typeCounts.images
									})
								]
							}),
							/* @__PURE__ */ jsxs("button", {
								type: "button",
								onClick: () => setFilter("video"),
								className: `inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold transition cursor-pointer ${filter === "video" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`,
								children: [
									/* @__PURE__ */ jsx(Video, { className: "h-3 w-3" }),
									/* @__PURE__ */ jsx("span", { children: "Videos" }),
									/* @__PURE__ */ jsx("span", {
										className: `text-[10px] px-1.5 py-0.2 rounded-full font-bold ${filter === "video" ? "bg-slate-800 text-slate-200" : "bg-slate-200/70 text-slate-600"}`,
										children: typeCounts.videos
									})
								]
							}),
							/* @__PURE__ */ jsxs("button", {
								type: "button",
								onClick: () => setFilter("document"),
								className: `inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold transition cursor-pointer ${filter === "document" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`,
								children: [
									/* @__PURE__ */ jsx(FileText, { className: "h-3 w-3" }),
									/* @__PURE__ */ jsx("span", { children: "Documents" }),
									/* @__PURE__ */ jsx("span", {
										className: `text-[10px] px-1.5 py-0.2 rounded-full font-bold ${filter === "document" ? "bg-slate-800 text-slate-200" : "bg-slate-200/70 text-slate-600"}`,
										children: typeCounts.docs
									})
								]
							}),
							/* @__PURE__ */ jsxs("button", {
								type: "button",
								onClick: () => setFilter(filter === "duplicates" ? "all" : "duplicates"),
								className: `inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold transition cursor-pointer ${filter === "duplicates" ? "bg-amber-600 text-white shadow-2xs" : duplicateCount > 0 ? "bg-amber-100 text-amber-800 hover:bg-amber-200" : "bg-slate-100 text-slate-400 opacity-60"}`,
								title: "Filter duplicate images",
								children: [
									/* @__PURE__ */ jsx(AlertTriangle, { className: "h-3.5 w-3.5" }),
									/* @__PURE__ */ jsx("span", { children: "Duplicates" }),
									duplicateCount > 0 && /* @__PURE__ */ jsx("span", {
										className: `text-[10px] px-1.5 py-0.2 rounded-full font-bold ${filter === "duplicates" ? "bg-amber-700 text-amber-100" : "bg-amber-200 text-amber-900"}`,
										children: duplicateCount
									})
								]
							}),
							missingAltCount > 0 && /* @__PURE__ */ jsxs("button", {
								type: "button",
								onClick: () => setFilter(filter === "no-alt" ? "all" : "no-alt"),
								className: `inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold transition cursor-pointer ${filter === "no-alt" ? "bg-rose-600 text-white shadow-2xs" : "bg-rose-50 text-rose-700 hover:bg-rose-100"}`,
								title: "Filter files with no Alt Text",
								children: [/* @__PURE__ */ jsx("span", { children: "No Alt Text" }), /* @__PURE__ */ jsx("span", {
									className: `text-[10px] px-1.5 py-0.2 rounded-full font-bold ${filter === "no-alt" ? "bg-rose-700 text-rose-100" : "bg-rose-200 text-rose-800"}`,
									children: missingAltCount
								})]
							})
						]
					}), /* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-2 ml-auto",
						children: [onAutoFillAltTexts && missingAltCount > 0 && /* @__PURE__ */ jsxs("button", {
							type: "button",
							onClick: handleAutoFillAllAlt,
							disabled: fillingAlt,
							className: "inline-flex items-center gap-1.5 rounded-lg border border-indigo-200 bg-indigo-50/90 px-2.5 py-1 text-xs font-bold text-indigo-700 hover:bg-indigo-100 transition shadow-2xs cursor-pointer disabled:opacity-50",
							title: "Automatically generate Alt Text for all items without alt text",
							children: [/* @__PURE__ */ jsx(Sparkles, { className: `h-3.5 w-3.5 text-indigo-600 ${fillingAlt ? "animate-spin" : ""}` }), /* @__PURE__ */ jsxs("span", { children: [
								"Auto-fill Alt (",
								missingAltCount,
								")"
							] })]
						}), /* @__PURE__ */ jsxs("span", {
							className: "text-[11px] font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200 whitespace-nowrap",
							children: [
								"Showing ",
								filteredAndSorted.length,
								" of ",
								items.length,
								" files"
							]
						})]
					})]
				})]
			}),
			viewMode === "grid" ? /* @__PURE__ */ jsx("div", {
				className: "grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
				children: filteredAndSorted.map((m) => {
					const isDup = duplicateInfo.has(m.id);
					const dupData = duplicateInfo.get(m.id);
					const isSelected = selectedIds.has(m.id);
					return /* @__PURE__ */ jsxs("div", {
						className: `group relative overflow-hidden rounded-2xl border bg-white shadow-2xs transition hover:shadow-md ${isSelected ? "border-rose-400 ring-2 ring-rose-400/70 bg-rose-50/10" : isDup ? "border-amber-300 ring-1 ring-amber-300/50" : "border-slate-200"}`,
						children: [
							/* @__PURE__ */ jsxs("div", {
								className: "absolute top-2 left-2 z-20 flex items-center gap-1.5",
								children: [/* @__PURE__ */ jsx("input", {
									type: "checkbox",
									checked: isSelected,
									onChange: () => toggleSelect(m.id),
									className: "h-4 w-4 rounded border-slate-300 bg-white/95 text-rose-600 focus:ring-rose-500 shadow-xs cursor-pointer",
									title: "Select file"
								}), isDup && /* @__PURE__ */ jsxs("div", {
									onClick: (e) => {
										e.stopPropagation();
										setQ(dupData?.groupKey || m.name);
									},
									className: "flex items-center gap-1 rounded-md bg-amber-500/90 text-white px-2 py-0.5 text-[10px] font-bold shadow-xs cursor-pointer hover:bg-amber-600 transition backdrop-blur-xs",
									title: `Click to filter duplicate group: ${dupData?.reason}`,
									children: [
										/* @__PURE__ */ jsx(AlertTriangle, { className: "h-3 w-3" }),
										"Duplicate (",
										dupData?.count,
										")"
									]
								})]
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
										className: "mt-1 flex items-center justify-between text-[11px] text-slate-400",
										children: [/* @__PURE__ */ jsx("span", {
											className: "font-mono text-slate-500",
											children: m.size || "-"
										}), /* @__PURE__ */ jsx("span", { children: m.uploadedAt || "" })]
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "mt-2.5 flex items-center justify-between border-t border-slate-100 pt-2",
										children: [/* @__PURE__ */ jsxs("button", {
											onClick: () => copyUrl(m.url),
											className: "inline-flex items-center gap-1 text-[11px] font-semibold text-slate-600 hover:text-slate-900 cursor-pointer",
											children: [/* @__PURE__ */ jsx(Copy, { className: "h-3 w-3" }), " Copy"]
										}), /* @__PURE__ */ jsxs("div", {
											className: "flex items-center gap-1.5",
											children: [
												onReplace && /* @__PURE__ */ jsx("button", {
													onClick: () => handleQuickReplaceTrigger(m.id),
													className: "rounded-md p-1 text-indigo-600 hover:bg-indigo-50 hover:text-indigo-800 transition cursor-pointer",
													title: "Replace Image File (< 1 MB)",
													children: /* @__PURE__ */ jsx(RefreshCw, { className: "h-3.5 w-3.5" })
												}),
												onEdit && /* @__PURE__ */ jsx("button", {
													onClick: () => setEditingItem(m),
													className: "rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition cursor-pointer",
													title: "Edit Details & Alt Text",
													children: /* @__PURE__ */ jsx(Edit2, { className: "h-3.5 w-3.5" })
												}),
												onDelete && /* @__PURE__ */ jsx("button", {
													onClick: () => onDelete(m.id),
													className: "rounded-md p-1 text-red-400 hover:bg-red-50 hover:text-red-600 transition cursor-pointer",
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
								className: "px-3 py-3 w-10 text-center",
								children: /* @__PURE__ */ jsx("input", {
									type: "checkbox",
									checked: isAllVisibleSelected,
									onChange: toggleSelectAllVisible,
									title: "Select all visible files",
									className: "h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900 cursor-pointer"
								})
							}),
							/* @__PURE__ */ jsx("th", {
								className: "px-3 py-3 w-20",
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
						children: filteredAndSorted.map((m) => {
							const isDup = duplicateInfo.has(m.id);
							const dupData = duplicateInfo.get(m.id);
							const isSelected = selectedIds.has(m.id);
							return /* @__PURE__ */ jsxs("tr", {
								className: `transition ${isSelected ? "bg-rose-50/70 hover:bg-rose-50" : isDup ? "bg-amber-50/20 hover:bg-amber-50/40" : "hover:bg-slate-50/60"}`,
								children: [
									/* @__PURE__ */ jsx("td", {
										className: "px-3 py-3 text-center",
										children: /* @__PURE__ */ jsx("input", {
											type: "checkbox",
											checked: isSelected,
											onChange: () => toggleSelect(m.id),
											className: "h-4 w-4 rounded border-slate-300 text-rose-600 focus:ring-rose-500 cursor-pointer"
										})
									}),
									/* @__PURE__ */ jsx("td", {
										className: "px-3 py-3 w-20",
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
										className: "px-4 py-3 text-slate-500 text-xs font-mono font-medium",
										children: m.size || "-"
									}),
									/* @__PURE__ */ jsx("td", {
										className: "px-4 py-3 text-right",
										children: /* @__PURE__ */ jsxs("div", {
											className: "flex items-center justify-end gap-2",
											children: [
												/* @__PURE__ */ jsx("button", {
													onClick: () => copyUrl(m.url),
													className: "rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition cursor-pointer",
													title: "Copy URL",
													children: /* @__PURE__ */ jsx(Copy, { className: "h-4 w-4" })
												}),
												onReplace && /* @__PURE__ */ jsx("button", {
													onClick: () => handleQuickReplaceTrigger(m.id),
													className: "rounded-lg p-1.5 text-indigo-600 hover:bg-indigo-50 hover:text-indigo-800 transition cursor-pointer",
													title: "Replace Image File (< 1 MB)",
													children: /* @__PURE__ */ jsx(RefreshCw, { className: "h-4 w-4" })
												}),
												onEdit && /* @__PURE__ */ jsx("button", {
													onClick: () => setEditingItem(m),
													className: "rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition cursor-pointer",
													title: "Edit Details & Alt Text",
													children: /* @__PURE__ */ jsx(Edit2, { className: "h-4 w-4" })
												}),
												onDelete && /* @__PURE__ */ jsx("button", {
													onClick: () => onDelete(m.id),
													className: "rounded-lg p-1.5 text-red-400 hover:bg-red-50 hover:text-red-600 transition cursor-pointer",
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
			filteredAndSorted.length === 0 && /* @__PURE__ */ jsx("div", {
				className: "col-span-full py-12 text-center text-xs text-slate-400",
				children: "No media files found matching your search and filter criteria."
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
	const zipFileRef = useRef(null);
	const csvFileRef = useRef(null);
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
			if (f.name.toLowerCase().endsWith(".zip") || f.type.includes("zip")) {
				const toastId = toast.loading(`Reading & extracting archive "${f.name}"...`);
				try {
					const res = await extractAndImportZip(f, (cur, tot, msg) => {
						toast.loading(msg, { id: toastId });
					});
					if (res.imported > 0) {
						toast.success(`Successfully extracted and imported ${res.imported} file${res.imported > 1 ? "s" : ""} from "${f.name}"!`, { id: toastId });
						count += res.imported;
					} else toast.info(`No valid media files found in "${f.name}".`, { id: toastId });
					if (res.errors.length > 0) toast.error(`${res.errors.length} file(s) failed or exceeded 1 MB limit.`);
				} catch (zErr) {
					toast.error(zErr?.message || `Failed to extract "${f.name}"`, { id: toastId });
				}
				continue;
			}
			if (f.size > MAX_FILE_SIZE) {
				toast.error(`"${f.name}" (${formatBytes(f.size)}) exceeds 1 MB. File size must be less than 1 MB.`);
				continue;
			}
			try {
				const defaultName = f.name.split(".").slice(0, -1).join(".") || f.name;
				let customName = defaultName;
				if (files.length === 1) {
					const prompted = window.prompt(`Enter a custom name for ${f.name} (or leave blank to keep original):`, defaultName);
					if (prompted === null) continue;
					customName = prompted.trim() || f.name;
				}
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
		if (zipFileRef.current) zipFileRef.current.value = "";
		if (count) toast.success(`Uploaded ${count} file${count > 1 ? "s" : ""}`);
		refresh();
	};
	const handleExportZip = async () => {
		if (!items.length) {
			toast.info("No files in media library to export.");
			return;
		}
		await exportMediaZip(items.map((m) => ({
			id: m.id,
			name: m.name,
			url: m.dataUrl || m.url,
			altText: m.altText,
			description: m.description,
			size: formatBytes(m.size),
			rawSize: m.size,
			type: m.type.startsWith("video/") ? "video" : m.type.startsWith("image/") ? "image" : "document",
			createdAt: m.createdAt
		})), `media-library-backup-${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.zip`);
	};
	const handleExportCsv = () => {
		if (!items.length) {
			toast.info("No media items to export.");
			return;
		}
		const exportData = items.map((m) => ({
			id: m.id,
			name: m.name,
			url: m.dataUrl || m.url,
			altText: m.altText || "",
			description: m.description || "",
			size: m.size,
			type: m.type,
			createdAt: m.createdAt
		}));
		const csv = Papa.unparse(exportData);
		const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
		const link = document.createElement("a");
		link.href = URL.createObjectURL(blob);
		link.download = `media-library-${(/* @__PURE__ */ new Date()).toISOString().split("T")[0]}.csv`;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		toast.success("CSV export successful!");
	};
	const handleImportCsv = (file) => {
		Papa.parse(file, {
			header: true,
			skipEmptyLines: true,
			complete: (results) => {
				const rows = results.data;
				if (!rows || rows.length === 0) {
					toast.info("No rows found in CSV.");
					return;
				}
				let imported = 0;
				for (const item of rows) {
					if (!item.id || !item.name) continue;
					if (!mediaLibrary.get(item.id)) {
						mediaLibrary.add({
							name: item.name,
							type: item.type || "image/webp",
							size: Number(item.size) || 0,
							dataUrl: item.url || item.dataUrl || "",
							usage: item.usage || "other",
							altText: item.altText,
							description: item.description
						});
						imported++;
					}
				}
				if (imported > 0) {
					toast.success(`Imported ${imported} media items from CSV`);
					refresh();
				} else toast.info("No new items to import from CSV");
			},
			error: () => toast.error("Failed to parse CSV file")
		});
	};
	const handleDelete = (id) => {
		if (!confirm("Delete this file permanently?")) return;
		mediaLibrary.remove(id);
		toast.success("File deleted");
		refresh();
	};
	const handleDeleteMultiple = async (ids) => {
		if (!ids.length) return;
		if (!confirm(`Delete ${ids.length} selected file${ids.length > 1 ? "s" : ""} permanently?`)) return;
		try {
			await mediaLibrary.removeMultiple(ids);
			toast.success(`Deleted ${ids.length} file${ids.length > 1 ? "s" : ""}`);
			refresh();
		} catch (err) {
			toast.error(err?.message || "Failed to delete files");
		}
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
					/* @__PURE__ */ jsxs(Link, {
						to: "/verify-image",
						target: "_blank",
						title: "Scan any image for Layer 1 EXIF signature and Layer 2 pixel steganography DNA",
						className: "inline-flex items-center gap-1.5 rounded-lg border border-indigo-200 bg-indigo-50/80 px-2.5 sm:px-3 py-1.5 text-xs font-semibold text-indigo-700 hover:bg-indigo-100 transition whitespace-nowrap shadow-2xs",
						children: [/* @__PURE__ */ jsx(ShieldCheck, { className: "h-3.5 w-3.5 text-indigo-600" }), "Verify Scanner"]
					}),
					/* @__PURE__ */ jsxs(DropdownMenu, { children: [/* @__PURE__ */ jsx(DropdownMenuTrigger, {
						asChild: true,
						children: /* @__PURE__ */ jsxs("button", {
							type: "button",
							title: "Import / Export CSV or ZIP backups",
							className: "inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 sm:px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition whitespace-nowrap shadow-2xs cursor-pointer",
							children: [
								/* @__PURE__ */ jsx(ArrowUpDown, { className: "h-3.5 w-3.5 text-slate-600" }),
								/* @__PURE__ */ jsx("span", {
									className: "hidden sm:inline",
									children: "Import / Export"
								}),
								/* @__PURE__ */ jsx(ChevronDown, { className: "h-3 w-3 text-slate-400" })
							]
						})
					}), /* @__PURE__ */ jsxs(DropdownMenuContent, {
						align: "end",
						className: "w-56 p-1",
						children: [
							/* @__PURE__ */ jsx(DropdownMenuLabel, {
								className: "text-[10px] uppercase font-bold text-slate-400 tracking-wider px-2 py-1",
								children: "CSV Data"
							}),
							/* @__PURE__ */ jsxs(DropdownMenuItem, {
								onClick: () => csvFileRef.current?.click(),
								className: "flex items-center gap-2 px-2.5 py-1.5 text-xs font-medium cursor-pointer",
								children: [/* @__PURE__ */ jsx(FileSpreadsheet, { className: "h-4 w-4 text-emerald-600" }), "Import CSV"]
							}),
							/* @__PURE__ */ jsxs(DropdownMenuItem, {
								onClick: handleExportCsv,
								className: "flex items-center gap-2 px-2.5 py-1.5 text-xs font-medium cursor-pointer",
								children: [/* @__PURE__ */ jsx(Download, { className: "h-4 w-4 text-emerald-600" }), "Export CSV"]
							}),
							/* @__PURE__ */ jsx(DropdownMenuSeparator, { className: "my-1" }),
							/* @__PURE__ */ jsx(DropdownMenuLabel, {
								className: "text-[10px] uppercase font-bold text-slate-400 tracking-wider px-2 py-1",
								children: "ZIP Images & Backup"
							}),
							/* @__PURE__ */ jsxs(DropdownMenuItem, {
								onClick: () => zipFileRef.current?.click(),
								className: "flex items-center gap-2 px-2.5 py-1.5 text-xs font-medium cursor-pointer",
								children: [/* @__PURE__ */ jsx(FolderArchive, { className: "h-4 w-4 text-indigo-600" }), "Import ZIP Archive"]
							}),
							/* @__PURE__ */ jsxs(DropdownMenuItem, {
								onClick: handleExportZip,
								className: "flex items-center gap-2 px-2.5 py-1.5 text-xs font-medium cursor-pointer",
								children: [/* @__PURE__ */ jsx(FileArchive, { className: "h-4 w-4 text-amber-600" }), "Export ZIP Backup"]
							})
						]
					})] }),
					/* @__PURE__ */ jsx("input", {
						ref: csvFileRef,
						type: "file",
						accept: ".csv,text/csv",
						onChange: (e) => {
							const file = e.target.files?.[0];
							if (file) handleImportCsv(file);
							if (csvFileRef.current) csvFileRef.current.value = "";
						},
						className: "hidden"
					}),
					/* @__PURE__ */ jsx("input", {
						ref: zipFileRef,
						type: "file",
						accept: ".zip,application/zip,application/x-zip-compressed",
						onChange: (e) => onUpload(e.target.files),
						className: "hidden"
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
						title: "Upload Files or ZIP Archive (Max 1 MB per file)",
						className: "inline-flex items-center gap-1.5 sm:gap-2 rounded-lg bg-slate-900 px-2.5 sm:px-3.5 py-1.5 text-xs sm:text-sm font-semibold text-white hover:bg-slate-800 transition whitespace-nowrap shadow-xs cursor-pointer",
						children: [/* @__PURE__ */ jsx(Upload, { className: "h-3.5 w-3.5 sm:h-4 sm:w-4" }), " Upload Files / ZIP (< 1 MB)"]
					}),
					/* @__PURE__ */ jsx("input", {
						ref: fileRef,
						type: "file",
						multiple: true,
						accept: "image/*,video/*,.pdf,.zip,application/zip,application/x-zip-compressed",
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
				createdAt: m.createdAt,
				uploadedAt: m.createdAt ? new Date(m.createdAt).toLocaleDateString() : void 0,
				type: m.type.startsWith("video/") ? "video" : m.type.startsWith("image/") ? "image" : "document"
			})),
			onDelete: handleDelete,
			onDeleteMultiple: handleDeleteMultiple,
			onEdit: handleEdit,
			onReplace: handleReplace,
			onAutoFillAltTexts: handleAutoFillAltTexts
		})]
	});
}
//#endregion
export { FileManagerPage as component };

//# sourceMappingURL=admin.files-DxJ4qVli.js.map