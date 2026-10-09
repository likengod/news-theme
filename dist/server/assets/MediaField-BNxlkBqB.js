import { a as trackUpload, i as mediaLibrary, r as formatBytes } from "./media-library-bQo1Lh0p.js";
import { useEffect, useMemo, useRef, useState } from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { Check, ChevronDown, FolderOpen, Grid3X3, Image, LayoutGrid, List, Plus, RefreshCw, Search, Trash2, Upload, X } from "lucide-react";
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
		if (f.size > 1 * 1024 * 1024) {
			toast.error(`"${f.name}" (${formatBytes(f.size)}) exceeds 1 MB limit. File size must be less than 1 MB.`);
			if (fileRef.current) fileRef.current.value = "";
			return;
		}
		try {
			onChange((await trackUpload(f, usage)).dataUrl);
			toast.success("Uploaded to file manager");
		} catch (err) {
			toast.error(err?.message || "Upload failed");
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
			"aria-label": label ? `Upload ${label}` : "Upload media image",
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
	const [category, setCategory] = useState("all");
	const [density, setDensity] = useState(() => {
		if (typeof window !== "undefined") return localStorage.getItem("nt:media-picker-density") || "compact";
		return "compact";
	});
	const [sortBy, setSortBy] = useState("newest");
	const [isRefreshing, setIsRefreshing] = useState(false);
	const [isUploading, setIsUploading] = useState(false);
	const quickUploadRef = useRef(null);
	useEffect(() => {
		const refresh = () => setItems(mediaLibrary.list());
		window.addEventListener("media-library-change", refresh);
		window.addEventListener("storage", refresh);
		setIsRefreshing(true);
		mediaLibrary.refresh().then((latest) => {
			if (latest && Array.isArray(latest)) setItems(latest);
		}).finally(() => setIsRefreshing(false));
		return () => {
			window.removeEventListener("media-library-change", refresh);
			window.removeEventListener("storage", refresh);
		};
	}, []);
	const handleManualRefresh = async () => {
		setIsRefreshing(true);
		try {
			const latest = await mediaLibrary.refresh();
			if (latest) setItems(latest);
			toast.success("File manager refreshed");
		} catch {
			toast.error("Failed to refresh");
		} finally {
			setIsRefreshing(false);
		}
	};
	const handleQuickUpload = async (fileList) => {
		if (!fileList || fileList.length === 0) return;
		const file = fileList[0];
		if (file.size > 1 * 1024 * 1024) {
			toast.error(`"${file.name}" exceeds 1 MB limit.`);
			if (quickUploadRef.current) quickUploadRef.current.value = "";
			return;
		}
		setIsUploading(true);
		try {
			const uploaded = await trackUpload(file, "article");
			toast.success(`Uploaded and selected "${uploaded.name}"`);
			onPick(uploaded);
		} catch (err) {
			toast.error(err?.message || "Upload failed");
		} finally {
			setIsUploading(false);
			if (quickUploadRef.current) quickUploadRef.current.value = "";
		}
	};
	const handleDensityChange = (d) => {
		setDensity(d);
		if (typeof window !== "undefined") localStorage.setItem("nt:media-picker-density", d);
	};
	const isImageFile = (m) => {
		const t = (m.type || "").toLowerCase();
		if (t.startsWith("image/") || t === "image") return true;
		const url = m.dataUrl || m.url || m.name || "";
		return /\.(webp|jpe?g|png|gif|svg|avif)($|\?)/i.test(url);
	};
	const wantsImage = accept.includes("image");
	const counts = useMemo(() => {
		const valid = items.filter((m) => !wantsImage ? true : isImageFile(m));
		return {
			all: valid.length,
			article: valid.filter((m) => m.usage === "article").length,
			other: valid.filter((m) => m.usage === "other").length,
			ad: valid.filter((m) => m.usage === "advertisement").length,
			logo: valid.filter((m) => m.usage?.startsWith("site-")).length
		};
	}, [items, wantsImage]);
	const filtered = useMemo(() => {
		return items.filter((m) => {
			if (wantsImage && !isImageFile(m)) return false;
			if (category === "article" && m.usage !== "article") return false;
			if (category === "other" && m.usage !== "other") return false;
			if (category === "ad" && m.usage !== "advertisement") return false;
			if (category === "logo" && !m.usage?.startsWith("site-")) return false;
			if (q.trim()) {
				const needle = q.toLowerCase();
				const matchName = m.name?.toLowerCase().includes(needle);
				const matchAlt = m.altText?.toLowerCase().includes(needle);
				const matchDesc = m.description?.toLowerCase().includes(needle);
				if (!matchName && !matchAlt && !matchDesc) return false;
			}
			return true;
		}).sort((a, b) => {
			if (sortBy === "newest") return (b.createdAt || 0) - (a.createdAt || 0);
			if (sortBy === "oldest") return (a.createdAt || 0) - (b.createdAt || 0);
			if (sortBy === "name") return (a.name || "").localeCompare(b.name || "");
			if (sortBy === "size") return (b.size || 0) - (a.size || 0);
			return 0;
		});
	}, [
		items,
		wantsImage,
		category,
		q,
		sortBy
	]);
	return /* @__PURE__ */ jsx("div", {
		className: "fixed inset-0 z-[70] flex items-center justify-center bg-black/60 p-3 sm:p-4 backdrop-blur-xs",
		onClick: onClose,
		children: /* @__PURE__ */ jsxs("div", {
			className: "flex flex-col max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-xl bg-white shadow-2xl border border-slate-200",
			onClick: (e) => e.stopPropagation(),
			children: [
				/* @__PURE__ */ jsxs("div", {
					className: "flex items-center justify-between border-b border-slate-200 px-4 py-2.5 bg-slate-50/70",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-2.5",
						children: [/* @__PURE__ */ jsx("div", {
							className: "grid h-7 w-7 place-items-center rounded-lg bg-blue-50 text-blue-600",
							children: /* @__PURE__ */ jsx(Image, { className: "h-4 w-4" })
						}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h3", {
							className: "text-sm font-bold text-slate-800",
							children: "Select Image from File Manager"
						}), /* @__PURE__ */ jsxs("p", {
							className: "text-[11px] text-slate-500",
							children: [
								"Showing ",
								filtered.length,
								" of ",
								items.length,
								" files"
							]
						})] })]
					}), /* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-1.5 sm:gap-2",
						children: [
							/* @__PURE__ */ jsx("input", {
								ref: quickUploadRef,
								type: "file",
								accept,
								onChange: (e) => handleQuickUpload(e.target.files),
								className: "hidden"
							}),
							/* @__PURE__ */ jsxs("button", {
								type: "button",
								disabled: isUploading,
								onClick: () => quickUploadRef.current?.click(),
								title: "Upload a new image directly from your computer",
								className: "inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-2.5 py-1 text-xs font-semibold text-white hover:bg-blue-700 disabled:opacity-50 transition cursor-pointer shadow-2xs",
								children: [/* @__PURE__ */ jsx(Upload, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ jsx("span", {
									className: "hidden sm:inline",
									children: isUploading ? "Uploading..." : "Upload New"
								})]
							}),
							/* @__PURE__ */ jsx("button", {
								type: "button",
								onClick: handleManualRefresh,
								title: "Refresh and sync files from /admin/files",
								className: "grid h-7 w-7 place-items-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition cursor-pointer",
								children: /* @__PURE__ */ jsx(RefreshCw, { className: `h-3.5 w-3.5 ${isRefreshing ? "animate-spin text-blue-600" : ""}` })
							}),
							/* @__PURE__ */ jsx("button", {
								type: "button",
								onClick: onClose,
								className: "grid h-7 w-7 place-items-center rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-red-50 hover:text-red-600 transition cursor-pointer",
								"aria-label": "Close",
								children: /* @__PURE__ */ jsx(X, { className: "h-4 w-4" })
							})
						]
					})]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "border-b border-slate-200 px-4 py-2 bg-white flex flex-wrap items-center gap-2",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "relative flex-1 min-w-[200px]",
							children: [
								/* @__PURE__ */ jsx(Search, { className: "pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" }),
								/* @__PURE__ */ jsx("input", {
									autoFocus: true,
									value: q,
									onChange: (e) => setQ(e.target.value),
									placeholder: "Search by name or alt text…",
									className: "w-full rounded-md border border-slate-200 py-1.5 pl-8 pr-7 text-xs sm:text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none bg-slate-50/50"
								}),
								q && /* @__PURE__ */ jsx("button", {
									type: "button",
									onClick: () => setQ(""),
									className: "absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600",
									children: /* @__PURE__ */ jsx(X, { className: "h-3 w-3" })
								})
							]
						}),
						/* @__PURE__ */ jsx("div", {
							className: "flex items-center gap-1",
							children: /* @__PURE__ */ jsxs("select", {
								value: sortBy,
								onChange: (e) => setSortBy(e.target.value),
								className: "rounded-md border border-slate-200 bg-white py-1.5 px-2 text-xs font-medium text-slate-600 focus:border-blue-500 focus:outline-none cursor-pointer",
								title: "Sort files",
								children: [
									/* @__PURE__ */ jsx("option", {
										value: "newest",
										children: "Newest first"
									}),
									/* @__PURE__ */ jsx("option", {
										value: "oldest",
										children: "Oldest first"
									}),
									/* @__PURE__ */ jsx("option", {
										value: "name",
										children: "Name (A-Z)"
									}),
									/* @__PURE__ */ jsx("option", {
										value: "size",
										children: "Size (Largest)"
									})
								]
							})
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "flex items-center rounded-lg border border-slate-200 bg-slate-100 p-0.5",
							children: [
								/* @__PURE__ */ jsx("button", {
									type: "button",
									onClick: () => handleDensityChange("compact"),
									title: "Compact Grid (Reduced size, 5-6 columns)",
									className: `grid h-6 w-6 place-items-center rounded-md text-xs transition cursor-pointer ${density === "compact" ? "bg-white text-blue-600 font-bold shadow-2xs" : "text-slate-500 hover:text-slate-900"}`,
									children: /* @__PURE__ */ jsx(LayoutGrid, { className: "h-3.5 w-3.5" })
								}),
								/* @__PURE__ */ jsx("button", {
									type: "button",
									onClick: () => handleDensityChange("mini"),
									title: "Mini Grid (Tiny tiles, 7-8 columns)",
									className: `grid h-6 w-6 place-items-center rounded-md text-xs transition cursor-pointer ${density === "mini" ? "bg-white text-blue-600 font-bold shadow-2xs" : "text-slate-500 hover:text-slate-900"}`,
									children: /* @__PURE__ */ jsx(Grid3X3, { className: "h-3.5 w-3.5" })
								}),
								/* @__PURE__ */ jsx("button", {
									type: "button",
									onClick: () => handleDensityChange("list"),
									title: "List View (Compact row)",
									className: `grid h-6 w-6 place-items-center rounded-md text-xs transition cursor-pointer ${density === "list" ? "bg-white text-blue-600 font-bold shadow-2xs" : "text-slate-500 hover:text-slate-900"}`,
									children: /* @__PURE__ */ jsx(List, { className: "h-3.5 w-3.5" })
								})
							]
						})
					]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-1.5 px-4 py-1.5 border-b border-slate-100 bg-slate-50/40 overflow-x-auto text-xs",
					children: [
						/* @__PURE__ */ jsxs("button", {
							type: "button",
							onClick: () => setCategory("all"),
							className: `px-2.5 py-0.5 rounded-full font-medium transition whitespace-nowrap cursor-pointer ${category === "all" ? "bg-slate-900 text-white" : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-100"}`,
							children: [
								"All (",
								counts.all,
								")"
							]
						}),
						/* @__PURE__ */ jsxs("button", {
							type: "button",
							onClick: () => setCategory("article"),
							className: `px-2.5 py-0.5 rounded-full font-medium transition whitespace-nowrap cursor-pointer ${category === "article" ? "bg-blue-600 text-white" : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-100"}`,
							children: [
								"Articles (",
								counts.article,
								")"
							]
						}),
						/* @__PURE__ */ jsxs("button", {
							type: "button",
							onClick: () => setCategory("other"),
							className: `px-2.5 py-0.5 rounded-full font-medium transition whitespace-nowrap cursor-pointer ${category === "other" ? "bg-indigo-600 text-white" : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-100"}`,
							children: [
								"File Manager / Uploads (",
								counts.other,
								")"
							]
						}),
						/* @__PURE__ */ jsxs("button", {
							type: "button",
							onClick: () => setCategory("ad"),
							className: `px-2.5 py-0.5 rounded-full font-medium transition whitespace-nowrap cursor-pointer ${category === "ad" ? "bg-amber-600 text-white" : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-100"}`,
							children: [
								"Ads (",
								counts.ad,
								")"
							]
						}),
						/* @__PURE__ */ jsxs("button", {
							type: "button",
							onClick: () => setCategory("logo"),
							className: `px-2.5 py-0.5 rounded-full font-medium transition whitespace-nowrap cursor-pointer ${category === "logo" ? "bg-emerald-600 text-white" : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-100"}`,
							children: [
								"Logos (",
								counts.logo,
								")"
							]
						})
					]
				}),
				/* @__PURE__ */ jsx("div", {
					className: "flex-1 max-h-[62vh] overflow-y-auto p-3 sm:p-4 bg-slate-50/20",
					children: filtered.length === 0 ? /* @__PURE__ */ jsxs("div", {
						className: "grid place-items-center py-12 text-center text-xs sm:text-sm text-slate-500",
						children: [
							/* @__PURE__ */ jsx("div", {
								className: "grid h-12 w-12 place-items-center rounded-full bg-slate-100 mb-2",
								children: /* @__PURE__ */ jsx(Image, { className: "h-6 w-6 text-slate-400" })
							}),
							/* @__PURE__ */ jsx("p", {
								className: "font-semibold text-slate-700",
								children: "No media files found"
							}),
							/* @__PURE__ */ jsx("p", {
								className: "text-slate-400 text-xs mt-0.5 max-w-sm",
								children: q ? `No images matched "${q}". Try clearing the search or category filter.` : "Upload a new image or go to /admin/files to upload files."
							}),
							/* @__PURE__ */ jsxs("button", {
								type: "button",
								onClick: () => quickUploadRef.current?.click(),
								className: "mt-3 inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 shadow-2xs",
								children: [/* @__PURE__ */ jsx(Upload, { className: "h-3.5 w-3.5" }), " Upload Image Now"]
							})
						]
					}) : density === "list" ? /* @__PURE__ */ jsx("div", {
						className: "divide-y divide-slate-100 rounded-lg border border-slate-200 bg-white overflow-hidden shadow-2xs",
						children: filtered.map((m) => /* @__PURE__ */ jsxs("div", {
							onClick: () => onPick(m),
							className: "group flex items-center justify-between gap-3 p-2 hover:bg-blue-50/60 cursor-pointer transition",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "flex items-center gap-3 min-w-0",
								children: [/* @__PURE__ */ jsx("div", {
									className: "h-10 w-10 shrink-0 overflow-hidden rounded-md border border-slate-200 bg-slate-100 grid place-items-center",
									children: /* @__PURE__ */ jsx("img", {
										src: m.dataUrl,
										alt: m.altText || m.name,
										className: "max-h-full max-w-full object-contain",
										loading: "lazy"
									})
								}), /* @__PURE__ */ jsxs("div", {
									className: "min-w-0",
									children: [/* @__PURE__ */ jsx("div", {
										className: "truncate text-xs font-semibold text-slate-800 group-hover:text-blue-600",
										children: m.name
									}), /* @__PURE__ */ jsxs("div", {
										className: "flex items-center gap-2 text-[10px] text-slate-400 mt-0.5",
										children: [
											/* @__PURE__ */ jsx("span", { children: formatBytes(m.size) }),
											/* @__PURE__ */ jsx("span", { children: "•" }),
											/* @__PURE__ */ jsx("span", {
												className: "uppercase text-[9px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded",
												children: m.usage
											}),
											m.altText && /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx("span", { children: "•" }), /* @__PURE__ */ jsxs("span", {
												className: "truncate max-w-[150px] italic",
												children: ["Alt: ", m.altText]
											})] })
										]
									})]
								})]
							}), /* @__PURE__ */ jsx("button", {
								type: "button",
								onClick: (e) => {
									e.stopPropagation();
									onPick(m);
								},
								className: "shrink-0 rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700 group-hover:bg-blue-600 group-hover:text-white transition cursor-pointer",
								children: "Select"
							})]
						}, m.id))
					}) : density === "mini" ? /* @__PURE__ */ jsx("div", {
						className: "grid grid-cols-4 sm:grid-cols-6 md:grid-cols-7 lg:grid-cols-8 gap-1.5 sm:gap-2",
						children: filtered.map((m) => /* @__PURE__ */ jsxs("button", {
							type: "button",
							onClick: () => onPick(m),
							title: `${m.name} (${formatBytes(m.size)}) - ${m.usage}`,
							className: "group relative overflow-hidden rounded-md border border-slate-200 bg-white hover:border-blue-600 hover:ring-2 hover:ring-blue-500/25 hover:shadow-sm text-left transition cursor-pointer p-0.5",
							children: [/* @__PURE__ */ jsx("div", {
								className: "grid h-16 w-full place-items-center bg-slate-50 rounded-xs overflow-hidden",
								children: /* @__PURE__ */ jsx("img", {
									src: m.dataUrl,
									alt: m.altText || m.name,
									className: "max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-150",
									loading: "lazy"
								})
							}), /* @__PURE__ */ jsx("div", {
								className: "px-1 py-0.5",
								children: /* @__PURE__ */ jsx("div", {
									className: "truncate text-[9px] font-medium text-slate-700",
									children: m.name
								})
							})]
						}, m.id))
					}) : /* @__PURE__ */ jsx("div", {
						className: "grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 sm:gap-2.5",
						children: filtered.map((m) => /* @__PURE__ */ jsxs("button", {
							type: "button",
							onClick: () => onPick(m),
							title: `${m.name} (${formatBytes(m.size)})\nAlt: ${m.altText || "None"}\nUsage: ${m.usage}`,
							className: "group relative overflow-hidden rounded-lg border border-slate-200 bg-white text-left hover:border-blue-600 hover:ring-2 hover:ring-blue-500/25 hover:shadow-md transition cursor-pointer flex flex-col justify-between",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "relative grid h-20 sm:h-22 w-full place-items-center bg-slate-50/90 overflow-hidden border-b border-slate-100 p-1",
								children: [/* @__PURE__ */ jsx("img", {
									src: m.dataUrl,
									alt: m.altText || m.name,
									className: "max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-150",
									loading: "lazy"
								}), /* @__PURE__ */ jsx("div", {
									className: "absolute inset-0 bg-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center",
									children: /* @__PURE__ */ jsx("div", {
										className: "rounded-full bg-blue-600 p-1 text-white shadow-xs",
										children: /* @__PURE__ */ jsx(Check, { className: "h-3 w-3 stroke-[3]" })
									})
								})]
							}), /* @__PURE__ */ jsxs("div", {
								className: "px-1.5 py-1 bg-white",
								children: [/* @__PURE__ */ jsx("div", {
									className: "truncate text-[10px] sm:text-[11px] font-medium text-slate-800 group-hover:text-blue-600 leading-tight",
									children: m.name
								}), /* @__PURE__ */ jsxs("div", {
									className: "mt-0.5 flex items-center justify-between text-[9px] text-slate-400",
									children: [/* @__PURE__ */ jsx("span", { children: formatBytes(m.size) }), /* @__PURE__ */ jsx("span", {
										className: "uppercase font-semibold tracking-wider text-[8px] bg-slate-100 px-1 rounded text-slate-500",
										children: m.usage === "other" ? "file" : m.usage
									})]
								})]
							})]
						}, m.id))
					})
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "flex items-center justify-between border-t border-slate-200 px-4 py-2 bg-slate-50 text-[11px] text-slate-500",
					children: [/* @__PURE__ */ jsx("span", { children: "Click any image to select it for your article." }), /* @__PURE__ */ jsx("button", {
						type: "button",
						onClick: onClose,
						className: "rounded-md border border-slate-300 bg-white px-3 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100 cursor-pointer",
						children: "Cancel"
					})]
				})
			]
		})
	});
}
//#endregion
export { MediaField as n, LibraryPicker as t };

//# sourceMappingURL=MediaField-BNxlkBqB.js.map