import { n as mediaLibrary, r as trackUpload, t as formatBytes } from "./media-library-Dpxo2VUb.js";
import { useEffect, useRef, useState } from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { ChevronDown, FolderOpen, Image, Plus, Search, Trash2, Upload, X } from "lucide-react";
import { toast } from "sonner";
//#region src/components/admin/MediaField.tsx
/**
* Reusable field: preview + Upload + Select from library + Remove.
* Every upload is tracked in the shared media library, so the same
* image is later selectable across Articles, Ads, Site settings,
* Journalist avatars, etc.
*/
function MediaField({ label, value, onChange, usage = "other", hint, accept = "image/*", previewClassName, dark, compact, recommendedSize, hideRecommended, inline, emptyLabel, autoOpenMenu, hideRemoveBtn, hideControls }) {
	const fileRef = useRef(null);
	const [pickerOpen, setPickerOpen] = useState(false);
	const [menuOpen, setMenuOpen] = useState(false);
	const menuRef = useRef(null);
	useEffect(() => {
		if (autoOpenMenu) setMenuOpen(true);
	}, [autoOpenMenu]);
	useEffect(() => {
		if (!menuOpen) return;
		const onDoc = (e) => {
			if (!menuRef.current?.contains(e.target)) setMenuOpen(false);
		};
		document.addEventListener("mousedown", onDoc);
		return () => document.removeEventListener("mousedown", onDoc);
	}, [menuOpen]);
	const handleFile = async (f) => {
		if (!f) return;
		try {
			onChange((await trackUpload(f, usage)).dataUrl);
			toast.success("Uploaded to file manager");
		} catch {
			toast.error("Upload failed");
		}
		if (fileRef.current) fileRef.current.value = "";
	};
	const preview = /* @__PURE__ */ jsx("div", {
		className: previewClassName ?? `flex ${compact ? "h-20" : "h-28"} items-center justify-center overflow-hidden rounded-md border border-dashed ${dark ? "border-slate-700 bg-slate-900" : "border-slate-200 bg-slate-50"}`,
		children: value ? /* @__PURE__ */ jsx("img", {
			src: value,
			alt: label ?? "preview",
			className: "max-h-full max-w-full object-contain p-2"
		}) : /* @__PURE__ */ jsxs("div", {
			className: "text-center text-slate-400",
			children: [/* @__PURE__ */ jsx(Image, { className: "mx-auto h-5 w-5" }), /* @__PURE__ */ jsx("span", {
				className: "mt-1 block text-[11px] leading-tight",
				children: emptyLabel ?? "No image"
			})]
		})
	});
	const controls = /* @__PURE__ */ jsxs(Fragment, { children: [
		/* @__PURE__ */ jsx("input", {
			ref: fileRef,
			type: "file",
			accept,
			hidden: true,
			onChange: (e) => handleFile(e.target.files?.[0])
		}),
		/* @__PURE__ */ jsxs("div", {
			className: "flex flex-wrap items-center gap-2",
			children: [/* @__PURE__ */ jsxs("div", {
				ref: menuRef,
				className: "relative flex-1",
				children: [/* @__PURE__ */ jsxs("button", {
					type: "button",
					onClick: () => setMenuOpen((o) => !o),
					className: "inline-flex w-full items-center justify-center gap-1.5 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50",
					children: [
						/* @__PURE__ */ jsx(Plus, { className: "h-3.5 w-3.5" }),
						value ? "Change image" : "Add image",
						/* @__PURE__ */ jsx(ChevronDown, { className: "h-3.5 w-3.5 opacity-60" })
					]
				}), menuOpen && /* @__PURE__ */ jsxs("div", {
					className: "absolute left-0 right-0 z-20 mt-1 overflow-hidden rounded-md border border-slate-200 bg-white shadow-lg",
					children: [/* @__PURE__ */ jsxs("button", {
						type: "button",
						onClick: () => {
							setMenuOpen(false);
							fileRef.current?.click();
						},
						className: "flex w-full items-center gap-2 px-3 py-2 text-left text-xs text-slate-700 hover:bg-slate-50",
						children: [/* @__PURE__ */ jsx(Upload, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
							className: "font-medium",
							children: "Upload image"
						}), /* @__PURE__ */ jsx("div", {
							className: "text-[10px] text-slate-500",
							children: "From your device — saved to file manager"
						})] })]
					}), /* @__PURE__ */ jsxs("button", {
						type: "button",
						onClick: () => {
							setMenuOpen(false);
							setPickerOpen(true);
						},
						className: "flex w-full items-center gap-2 border-t border-slate-100 px-3 py-2 text-left text-xs text-slate-700 hover:bg-slate-50",
						children: [/* @__PURE__ */ jsx(FolderOpen, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
							className: "font-medium",
							children: "Select image"
						}), /* @__PURE__ */ jsx("div", {
							className: "text-[10px] text-slate-500",
							children: "Pick from file manager library"
						})] })]
					})]
				})]
			}), value && !label && !hideRemoveBtn && /* @__PURE__ */ jsxs("button", {
				type: "button",
				onClick: () => onChange(""),
				className: "inline-flex items-center gap-1.5 rounded-md border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-100",
				children: [/* @__PURE__ */ jsx(Trash2, { className: "h-3.5 w-3.5" }), " Remove"]
			})]
		}),
		(hint || recommendedSize) && !hideRecommended && /* @__PURE__ */ jsxs("p", {
			className: "text-[11px] text-slate-500",
			children: [
				recommendedSize && /* @__PURE__ */ jsxs("span", {
					className: "font-medium text-slate-600",
					children: [
						"Recommended: ",
						recommendedSize,
						"."
					]
				}),
				recommendedSize && hint ? " " : "",
				hint
			]
		})
	] });
	return /* @__PURE__ */ jsxs("div", {
		className: "space-y-2",
		children: [
			label && /* @__PURE__ */ jsxs("div", {
				className: "flex items-center justify-between",
				children: [/* @__PURE__ */ jsx("span", {
					className: "text-xs font-medium text-slate-700",
					children: label
				}), value && /* @__PURE__ */ jsxs("button", {
					type: "button",
					onClick: () => onChange(""),
					className: "inline-flex items-center gap-1 text-[11px] text-red-600 hover:underline",
					children: [/* @__PURE__ */ jsx(X, { className: "h-3 w-3" }), " Remove"]
				})]
			}),
			hideControls ? preview : inline ? /* @__PURE__ */ jsxs("div", {
				className: "flex items-center gap-2",
				children: [preview, /* @__PURE__ */ jsx("div", {
					className: "min-w-32 flex-1 space-y-1.5",
					children: controls
				})]
			}) : /* @__PURE__ */ jsxs(Fragment, { children: [preview, controls] }),
			pickerOpen && /* @__PURE__ */ jsx(LibraryPicker, {
				accept,
				onClose: () => setPickerOpen(false),
				onPick: (item) => {
					onChange(item.dataUrl);
					setPickerOpen(false);
					toast.success("Image selected from library");
				}
			})
		]
	});
}
function LibraryPicker({ onClose, onPick, accept }) {
	const [items, setItems] = useState(() => mediaLibrary.list());
	const [q, setQ] = useState("");
	useEffect(() => {
		const refresh = () => setItems(mediaLibrary.list());
		window.addEventListener("media-library-change", refresh);
		window.addEventListener("storage", refresh);
		return () => {
			window.removeEventListener("media-library-change", refresh);
			window.removeEventListener("storage", refresh);
		};
	}, []);
	const wantsImage = accept.includes("image");
	const filtered = items.filter((m) => {
		if (wantsImage && !m.type.startsWith("image/")) return false;
		if (q && !m.name.toLowerCase().includes(q.toLowerCase())) return false;
		return true;
	});
	return /* @__PURE__ */ jsx("div", {
		className: "fixed inset-0 z-[70] flex items-center justify-center bg-black/50 p-4",
		onClick: onClose,
		children: /* @__PURE__ */ jsxs("div", {
			className: "max-h-[85vh] w-full max-w-3xl overflow-hidden rounded-lg bg-white shadow-2xl",
			onClick: (e) => e.stopPropagation(),
			children: [
				/* @__PURE__ */ jsxs("div", {
					className: "flex items-center justify-between border-b border-slate-200 px-4 py-3",
					children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h3", {
						className: "text-sm font-semibold",
						children: "Select image from file manager"
					}), /* @__PURE__ */ jsxs("p", {
						className: "text-[11px] text-slate-500",
						children: [
							filtered.length,
							" of ",
							items.length,
							" file",
							items.length === 1 ? "" : "s"
						]
					})] }), /* @__PURE__ */ jsx("button", {
						onClick: onClose,
						className: "grid h-7 w-7 place-items-center rounded-md hover:bg-slate-100",
						"aria-label": "Close",
						children: /* @__PURE__ */ jsx(X, { className: "h-4 w-4" })
					})]
				}),
				/* @__PURE__ */ jsx("div", {
					className: "border-b border-slate-200 px-4 py-2",
					children: /* @__PURE__ */ jsxs("div", {
						className: "relative",
						children: [/* @__PURE__ */ jsx(Search, { className: "pointer-events-none absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" }), /* @__PURE__ */ jsx("input", {
							autoFocus: true,
							value: q,
							onChange: (e) => setQ(e.target.value),
							placeholder: "Search by name…",
							className: "w-full rounded-md border border-slate-200 py-1.5 pl-7 pr-3 text-sm focus:border-slate-900 focus:outline-none"
						})]
					})
				}),
				/* @__PURE__ */ jsx("div", {
					className: "max-h-[60vh] overflow-y-auto p-4",
					children: filtered.length === 0 ? /* @__PURE__ */ jsxs("div", {
						className: "grid place-items-center py-12 text-center text-sm text-slate-500",
						children: [/* @__PURE__ */ jsx(Image, { className: "mb-2 h-8 w-8 text-slate-300" }), "No images yet. Use the Upload button — it saves here automatically."]
					}) : /* @__PURE__ */ jsx("div", {
						className: "grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4",
						children: filtered.map((m) => /* @__PURE__ */ jsxs("button", {
							type: "button",
							onClick: () => onPick(m),
							className: "group overflow-hidden rounded-md border border-slate-200 bg-slate-50 text-left hover:border-slate-900 hover:shadow-sm",
							children: [/* @__PURE__ */ jsx("div", {
								className: "grid h-24 place-items-center bg-white",
								children: /* @__PURE__ */ jsx("img", {
									src: m.dataUrl,
									alt: m.name,
									className: "max-h-full max-w-full object-contain"
								})
							}), /* @__PURE__ */ jsxs("div", {
								className: "border-t border-slate-200 px-2 py-1",
								children: [/* @__PURE__ */ jsx("div", {
									className: "truncate text-[11px] font-medium text-slate-700",
									children: m.name
								}), /* @__PURE__ */ jsxs("div", {
									className: "text-[10px] text-slate-400",
									children: [
										formatBytes(m.size),
										" · ",
										m.usage
									]
								})]
							})]
						}, m.id))
					})
				})
			]
		})
	});
}
//#endregion
export { MediaField as n, LibraryPicker as t };

//# sourceMappingURL=MediaField-DRBqQJnm.js.map