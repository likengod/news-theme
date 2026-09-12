import { n as mediaLibrary, r as trackUpload, t as formatBytes } from "./media-library-Dpxo2VUb.js";
import { t as CsvImportExport } from "./CsvImportExport-DBalmz2g.js";
import { useEffect, useRef, useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
import { Copy, Edit2, FileText, Image, LayoutGrid, List, Trash2, Upload, Video, X } from "lucide-react";
import { toast } from "sonner";
//#region src/components/admin/files/EditMediaModal.tsx
function EditMediaModal({ item, onClose, onSave }) {
	const [name, setName] = useState(item.name || "");
	const [altText, setAltText] = useState(item.altText || "");
	const [description, setDescription] = useState(item.description || "");
	const handleSubmit = (e) => {
		e.preventDefault();
		if (!name.trim()) return;
		onSave(item.id, name.trim(), altText.trim(), description.trim());
		onClose();
	};
	return /* @__PURE__ */ jsx("div", {
		className: "fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm",
		children: /* @__PURE__ */ jsxs("div", {
			className: "w-full max-w-md rounded-xl bg-white shadow-xl",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "flex items-center justify-between border-b border-slate-100 p-4",
				children: [/* @__PURE__ */ jsx("h2", {
					className: "text-lg font-semibold text-slate-800",
					children: "Edit Media Details"
				}), /* @__PURE__ */ jsx("button", {
					onClick: onClose,
					className: "rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600",
					children: /* @__PURE__ */ jsx(X, { className: "h-5 w-5" })
				})]
			}), /* @__PURE__ */ jsxs("form", {
				onSubmit: handleSubmit,
				className: "p-4 space-y-4",
				children: [
					/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
						className: "mb-1 block text-sm font-medium text-slate-700",
						children: "File Name *"
					}), /* @__PURE__ */ jsx("input", {
						type: "text",
						required: true,
						value: name,
						onChange: (e) => setName(e.target.value),
						className: "w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none"
					})] }),
					/* @__PURE__ */ jsxs("div", { children: [
						/* @__PURE__ */ jsx("label", {
							className: "mb-1 block text-sm font-medium text-slate-700",
							children: "Alt Text"
						}),
						/* @__PURE__ */ jsx("input", {
							type: "text",
							value: altText,
							onChange: (e) => setAltText(e.target.value),
							placeholder: "Brief description for screen readers and SEO",
							className: "w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none"
						}),
						/* @__PURE__ */ jsx("p", {
							className: "mt-1 text-xs text-slate-500",
							children: "Crucial for SEO and accessibility."
						})
					] }),
					/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
						className: "mb-1 block text-sm font-medium text-slate-700",
						children: "Description"
					}), /* @__PURE__ */ jsx("textarea", {
						value: description,
						onChange: (e) => setDescription(e.target.value),
						rows: 3,
						placeholder: "Extended details or caption",
						className: "w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none"
					})] }),
					/* @__PURE__ */ jsxs("div", {
						className: "pt-2 flex items-center justify-end gap-3",
						children: [/* @__PURE__ */ jsx("button", {
							type: "button",
							onClick: onClose,
							className: "rounded-md px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100",
							children: "Cancel"
						}), /* @__PURE__ */ jsx("button", {
							type: "submit",
							className: "rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800",
							children: "Save Changes"
						})]
					})
				]
			})]
		})
	});
}
//#endregion
//#region src/components/admin/files/MediaGrid.tsx
function SafeImage({ src, alt, className, ...props }) {
	const [error, setError] = useState(false);
	if (error || !src) return /* @__PURE__ */ jsxs("div", {
		className: "flex flex-col items-center justify-center text-slate-400 h-full w-full bg-slate-100",
		children: [/* @__PURE__ */ jsx(Image, { className: "h-6 w-6 mb-1 opacity-50" }), /* @__PURE__ */ jsx("span", {
			className: "text-[9px] font-semibold opacity-50",
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
function MediaGrid({ items, onDelete, onEdit }) {
	const [filter, setFilter] = useState("all");
	const [q, setQ] = useState("");
	const [viewMode, setViewMode] = useState("list");
	const [editingItem, setEditingItem] = useState(null);
	const copyUrl = (url) => {
		navigator.clipboard.writeText(url);
		toast.success("URL copied to clipboard!");
	};
	const filtered = items.filter((it) => {
		const matchesQ = `${it.name}${it.url || ""}`.toLowerCase().includes(q.toLowerCase());
		const matchesFilter = filter === "all" || (it.type || "image") === filter;
		return matchesQ && matchesFilter;
	});
	return /* @__PURE__ */ jsxs("div", {
		className: "space-y-4",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-sm",
				children: [/* @__PURE__ */ jsx("input", {
					type: "text",
					value: q,
					onChange: (e) => setQ(e.target.value),
					placeholder: "Search media files by name...",
					className: "h-9 w-64 rounded-md border border-slate-200 px-3 text-sm focus:border-slate-900 focus:outline-none"
				}), /* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-4",
					children: [/* @__PURE__ */ jsx("div", {
						className: "flex items-center gap-1.5 border-r border-slate-200 pr-4",
						children: [
							"all",
							"image",
							"video",
							"document"
						].map((t) => /* @__PURE__ */ jsxs("button", {
							onClick: () => setFilter(t),
							className: `rounded-md px-3 py-1.5 text-xs font-semibold capitalize transition ${filter === t ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`,
							children: [t, "s"]
						}, t))
					}), /* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-1.5",
						children: [/* @__PURE__ */ jsx("button", {
							onClick: () => setViewMode("grid"),
							className: `rounded-md p-1.5 transition ${viewMode === "grid" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`,
							title: "Grid View",
							children: /* @__PURE__ */ jsx(LayoutGrid, { className: "h-4 w-4" })
						}), /* @__PURE__ */ jsx("button", {
							onClick: () => setViewMode("list"),
							className: `rounded-md p-1.5 transition ${viewMode === "list" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`,
							title: "List View",
							children: /* @__PURE__ */ jsx(List, { className: "h-4 w-4" })
						})]
					})]
				})]
			}),
			viewMode === "grid" ? /* @__PURE__ */ jsx("div", {
				className: "grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
				children: filtered.map((m) => /* @__PURE__ */ jsxs("div", {
					className: "group relative overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md",
					children: [/* @__PURE__ */ jsx("div", {
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
							alt: m.name,
							loading: "lazy",
							className: "h-full w-full object-cover transition duration-300 group-hover:scale-105"
						})
					}), /* @__PURE__ */ jsxs("div", {
						className: "p-3",
						children: [/* @__PURE__ */ jsx("p", {
							className: "truncate text-xs font-semibold text-slate-900",
							title: m.name || m.url,
							children: m.name || m.url.split("/").pop()
						}), /* @__PURE__ */ jsxs("div", {
							className: "mt-2 flex items-center justify-between",
							children: [/* @__PURE__ */ jsxs("button", {
								onClick: () => copyUrl(m.url),
								className: "inline-flex items-center gap-1 text-[11px] font-semibold text-slate-600 hover:text-slate-900",
								children: [/* @__PURE__ */ jsx(Copy, { className: "h-3 w-3" }), " Copy URL"]
							}), /* @__PURE__ */ jsxs("div", {
								className: "flex items-center gap-2",
								children: [onEdit && /* @__PURE__ */ jsx("button", {
									onClick: () => setEditingItem(m),
									className: "text-slate-400 hover:text-slate-600",
									title: "Edit Details",
									children: /* @__PURE__ */ jsx(Edit2, { className: "h-3.5 w-3.5" })
								}), onDelete && /* @__PURE__ */ jsx("button", {
									onClick: () => onDelete(m.id),
									className: "text-red-500 hover:text-red-700",
									title: "Delete Media",
									children: /* @__PURE__ */ jsx(Trash2, { className: "h-3.5 w-3.5" })
								})]
							})]
						})]
					})]
				}, m.id || m.url))
			}) : /* @__PURE__ */ jsx("div", {
				className: "rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden",
				children: /* @__PURE__ */ jsxs("table", {
					className: "w-full text-left text-sm",
					children: [/* @__PURE__ */ jsx("thead", {
						className: "bg-slate-50 text-slate-500 text-xs uppercase font-semibold",
						children: /* @__PURE__ */ jsxs("tr", { children: [
							/* @__PURE__ */ jsx("th", {
								className: "px-4 py-3",
								children: "Preview"
							}),
							/* @__PURE__ */ jsx("th", {
								className: "px-4 py-3",
								children: "File Name"
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
						children: filtered.map((m) => /* @__PURE__ */ jsxs("tr", {
							className: "hover:bg-slate-50/50",
							children: [
								/* @__PURE__ */ jsx("td", {
									className: "px-4 py-3 w-20",
									children: /* @__PURE__ */ jsx("div", {
										className: "h-12 w-16 bg-slate-100 rounded-md overflow-hidden grid place-items-center",
										children: m.url && m.url.match(/\.(mp4|webm)$/i) || m.type === "video" ? /* @__PURE__ */ jsx(Video, { className: "h-5 w-5 text-slate-400" }) : m.url && m.url.match(/\.(pdf|doc|docx)$/i) || m.type === "document" ? /* @__PURE__ */ jsx(FileText, { className: "h-5 w-5 text-slate-400" }) : /* @__PURE__ */ jsx(SafeImage, {
											src: m.url || "",
											alt: m.name,
											className: "h-full w-full object-cover"
										})
									})
								}),
								/* @__PURE__ */ jsxs("td", {
									className: "px-4 py-3",
									children: [/* @__PURE__ */ jsx("p", {
										className: "font-semibold text-slate-900 max-w-xs truncate",
										title: m.name || m.url,
										children: m.name || m.url.split("/").pop()
									}), /* @__PURE__ */ jsx("p", {
										className: "text-xs text-slate-500 truncate max-w-xs",
										title: m.altText,
										children: m.altText || /* @__PURE__ */ jsx("span", {
											className: "italic opacity-70",
											children: "No alt text"
										})
									})]
								}),
								/* @__PURE__ */ jsx("td", {
									className: "px-4 py-3 text-slate-500 capitalize",
									children: m.type || "image"
								}),
								/* @__PURE__ */ jsx("td", {
									className: "px-4 py-3 text-slate-500",
									children: m.size || "-"
								}),
								/* @__PURE__ */ jsx("td", {
									className: "px-4 py-3 text-right",
									children: /* @__PURE__ */ jsxs("div", {
										className: "flex items-center justify-end gap-3",
										children: [
											/* @__PURE__ */ jsx("button", {
												onClick: () => copyUrl(m.url),
												className: "text-slate-400 hover:text-slate-600",
												title: "Copy URL",
												children: /* @__PURE__ */ jsx(Copy, { className: "h-4 w-4" })
											}),
											onEdit && /* @__PURE__ */ jsx("button", {
												onClick: () => setEditingItem(m),
												className: "text-slate-400 hover:text-slate-600",
												title: "Edit Details",
												children: /* @__PURE__ */ jsx(Edit2, { className: "h-4 w-4" })
											}),
											onDelete && /* @__PURE__ */ jsx("button", {
												onClick: () => onDelete(m.id),
												className: "text-red-400 hover:text-red-600",
												title: "Delete",
												children: /* @__PURE__ */ jsx(Trash2, { className: "h-4 w-4" })
											})
										]
									})
								})
							]
						}, m.id || m.url))
					})]
				})
			}),
			filtered.length === 0 && /* @__PURE__ */ jsx("div", {
				className: "col-span-full py-12 text-center text-xs text-slate-400",
				children: "No media files found matching your search."
			}),
			editingItem && onEdit && /* @__PURE__ */ jsx(EditMediaModal, {
				item: editingItem,
				onClose: () => setEditingItem(null),
				onSave: onEdit
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
		for (const f of Array.from(files)) try {
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
		} catch {
			toast.error(`Failed: ${f.name}`);
		}
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
	return /* @__PURE__ */ jsxs("div", {
		className: "space-y-6",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "flex flex-wrap items-center justify-between gap-3",
			children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h1", {
				className: "text-2xl font-bold tracking-tight",
				children: "Media & File Library"
			}), /* @__PURE__ */ jsx("p", {
				className: "text-sm text-slate-500",
				children: "Upload, manage, and reuse images, videos, and news assets across your site."
			})] }), /* @__PURE__ */ jsxs("div", {
				className: "flex items-center gap-3",
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
					/* @__PURE__ */ jsxs("span", {
						className: "text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200",
						children: [
							items.length,
							" files (",
							formatBytes(totalSize),
							")"
						]
					}),
					/* @__PURE__ */ jsxs("button", {
						onClick: () => fileRef.current?.click(),
						className: "inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800",
						children: [/* @__PURE__ */ jsx(Upload, { className: "h-4 w-4" }), " Upload Files"]
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
				type: m.type.startsWith("video/") ? "video" : m.type.startsWith("image/") ? "image" : "document"
			})),
			onDelete: handleDelete,
			onEdit: handleEdit
		})]
	});
}
//#endregion
export { FileManagerPage as component };

//# sourceMappingURL=admin.files-Dmz5FRa5.js.map