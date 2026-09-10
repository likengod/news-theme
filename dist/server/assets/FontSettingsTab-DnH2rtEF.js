import { a as buildGoogleFontsUrl, c as generateFontId, d as loadFontConfig, f as saveFontConfig, i as buildFontFaceCss, l as getFontById, n as FONT_SECTIONS, r as GOOGLE_FONTS_CATALOG } from "./font-config-BoC-1dGc.js";
import { useCallback, useEffect, useRef, useState } from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { AlertTriangle, Check, ChevronDown, Globe, HardDrive, Plus, Search, Star, Trash2, Type, Upload, X } from "lucide-react";
import { toast } from "sonner";
//#region src/components/admin/settings/FontSettingsTab.tsx
var MAX_UPLOAD_BYTES = 500 * 1024;
function FontSettingsTab() {
	const [config, setConfig] = useState(() => loadFontConfig());
	const [search, setSearch] = useState("");
	const [showAddModal, setShowAddModal] = useState(false);
	const [showCatalog, setShowCatalog] = useState(false);
	const [previewText, setPreviewText] = useState("The quick brown fox jumps over the lazy dog. 0123456789");
	const [dirty, setDirty] = useState(false);
	useEffect(() => {
		const sync = () => setConfig(loadFontConfig());
		window.addEventListener("nt:fonts-updated", sync);
		return () => window.removeEventListener("nt:fonts-updated", sync);
	}, []);
	const save = useCallback((next) => {
		setConfig(next);
		saveFontConfig(next);
		setDirty(false);
		toast.success("Font settings saved");
	}, []);
	const handleSetDefault = (fontId) => {
		save({
			...config,
			fonts: config.fonts.map((f) => ({
				...f,
				isDefault: f.id === fontId
			}))
		});
	};
	const handleDeleteFont = (fontId) => {
		const font = config.fonts.find((f) => f.id === fontId);
		if (!font) return;
		if (font.isSystem) {
			toast.error("System fonts cannot be deleted");
			return;
		}
		if (font.isDefault) {
			toast.error("Cannot delete the default font. Set another font as default first.");
			return;
		}
		const defaultFont = config.fonts.find((f) => f.isDefault) ?? config.fonts[0];
		const newMapping = { ...config.sectionMapping };
		for (const key of Object.keys(newMapping)) if (newMapping[key] === fontId) newMapping[key] = defaultFont?.id ?? "sys-inter";
		save({
			fonts: config.fonts.filter((f) => f.id !== fontId),
			sectionMapping: newMapping
		});
		toast.success(`"${font.name}" removed`);
	};
	const handleAddGoogleFont = (catalogEntry) => {
		if (config.fonts.some((f) => f.family === catalogEntry.family)) {
			toast.error(`"${catalogEntry.name}" is already in your font library`);
			return;
		}
		const entry = {
			id: generateFontId(),
			name: catalogEntry.name,
			family: catalogEntry.family,
			source: "google",
			weights: catalogEntry.weights,
			isDefault: false,
			isSystem: false,
			createdAt: (/* @__PURE__ */ new Date()).toISOString()
		};
		save({
			...config,
			fonts: [...config.fonts, entry]
		});
		setShowCatalog(false);
		toast.success(`"${catalogEntry.name}" added to font library`);
	};
	const handleCustomGoogleFont = (name, weights) => {
		if (!name.trim()) {
			toast.error("Please enter a font name");
			return;
		}
		if (config.fonts.some((f) => f.family.toLowerCase() === name.trim().toLowerCase())) {
			toast.error(`"${name}" is already in your font library`);
			return;
		}
		const parsedWeights = weights.split(",").map((w) => w.trim()).filter(Boolean);
		if (parsedWeights.length === 0) parsedWeights.push("400");
		const entry = {
			id: generateFontId(),
			name: name.trim(),
			family: name.trim(),
			source: "google",
			weights: parsedWeights,
			isDefault: false,
			isSystem: false,
			createdAt: (/* @__PURE__ */ new Date()).toISOString()
		};
		save({
			...config,
			fonts: [...config.fonts, entry]
		});
		setShowAddModal(false);
		toast.success(`"${name}" added to font library`);
	};
	const handleUploadFont = (file) => {
		if (file.size > MAX_UPLOAD_BYTES) {
			toast.error(`Font file too large (max ${MAX_UPLOAD_BYTES / 1024}KB). Got ${Math.round(file.size / 1024)}KB.`);
			return;
		}
		const validExts = [
			".woff2",
			".woff",
			".ttf",
			".otf"
		];
		const ext = file.name.substring(file.name.lastIndexOf(".")).toLowerCase();
		if (!validExts.includes(ext)) {
			toast.error("Invalid file type. Accepted: .woff2, .woff, .ttf, .otf");
			return;
		}
		const reader = new FileReader();
		reader.onload = () => {
			const dataUrl = reader.result;
			const fontName = file.name.replace(/\.[^.]+$/, "").replace(/[-_]/g, " ");
			if (config.fonts.some((f) => f.family.toLowerCase() === fontName.toLowerCase())) {
				toast.error(`A font named "${fontName}" already exists`);
				return;
			}
			const entry = {
				id: generateFontId(),
				name: fontName,
				family: fontName,
				source: "upload",
				fileDataUrl: dataUrl,
				weights: ["400"],
				isDefault: false,
				isSystem: false,
				createdAt: (/* @__PURE__ */ new Date()).toISOString()
			};
			save({
				...config,
				fonts: [...config.fonts, entry]
			});
			toast.success(`"${fontName}" uploaded successfully`);
		};
		reader.onerror = () => toast.error("Failed to read font file");
		reader.readAsDataURL(file);
	};
	const handleSectionChange = (section, fontId) => {
		save({
			...config,
			sectionMapping: {
				...config.sectionMapping,
				[section]: fontId
			}
		});
	};
	useEffect(() => {
		const googleFonts = config.fonts.filter((f) => f.source === "google" && !f.isSystem);
		if (googleFonts.length === 0) return;
		const url = buildGoogleFontsUrl(googleFonts);
		const existing = document.querySelector("link[data-font-preview]");
		if (existing) existing.remove();
		const link = document.createElement("link");
		link.rel = "stylesheet";
		link.href = url;
		link.setAttribute("data-font-preview", "true");
		document.head.appendChild(link);
		return () => {
			link.remove();
		};
	}, [config.fonts]);
	useEffect(() => {
		const uploadedFonts = config.fonts.filter((f) => f.source === "upload" && f.fileDataUrl);
		if (uploadedFonts.length === 0) return;
		const css = buildFontFaceCss(uploadedFonts);
		const existing = document.querySelector("style[data-font-face-preview]");
		if (existing) existing.remove();
		const style = document.createElement("style");
		style.setAttribute("data-font-face-preview", "true");
		style.textContent = css;
		document.head.appendChild(style);
		return () => {
			style.remove();
		};
	}, [config.fonts]);
	const filteredFonts = config.fonts.filter((f) => f.name.toLowerCase().includes(search.toLowerCase()) || f.family.toLowerCase().includes(search.toLowerCase()));
	const defaultFontEntry = config.fonts.find((f) => f.isDefault);
	return /* @__PURE__ */ jsxs("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ jsxs(Card, {
				title: "Font Library",
				subtitle: "Manage all fonts available on your website. System fonts cannot be deleted.",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "flex flex-wrap items-center gap-2 mb-4",
						children: [
							/* @__PURE__ */ jsxs("div", {
								className: "relative flex-1 min-w-[200px]",
								children: [/* @__PURE__ */ jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" }), /* @__PURE__ */ jsx("input", {
									type: "text",
									value: search,
									onChange: (e) => setSearch(e.target.value),
									placeholder: "Search fonts...",
									className: "w-full rounded-md border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400"
								})]
							}),
							/* @__PURE__ */ jsxs("button", {
								onClick: () => setShowCatalog(true),
								className: "inline-flex items-center gap-2 rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-800 transition",
								children: [/* @__PURE__ */ jsx(Globe, { className: "h-4 w-4" }), " Add Google Font"]
							}),
							/* @__PURE__ */ jsxs("button", {
								onClick: () => setShowAddModal(true),
								className: "inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition",
								children: [/* @__PURE__ */ jsx(Plus, { className: "h-4 w-4" }), " Custom Font Name"]
							}),
							/* @__PURE__ */ jsx(UploadButton, { onUpload: handleUploadFont })
						]
					}),
					/* @__PURE__ */ jsxs("p", {
						className: "text-xs text-slate-500 mb-3",
						children: [
							config.fonts.length,
							" font",
							config.fonts.length !== 1 ? "s" : "",
							" registered",
							defaultFontEntry && /* @__PURE__ */ jsxs(Fragment, { children: [" · Default: ", /* @__PURE__ */ jsx("strong", {
								className: "text-slate-900",
								children: defaultFontEntry.name
							})] })
						]
					}),
					/* @__PURE__ */ jsx("div", {
						className: "overflow-hidden rounded-md border border-slate-200",
						children: /* @__PURE__ */ jsxs("table", {
							className: "min-w-full divide-y divide-slate-200 text-left text-xs",
							children: [/* @__PURE__ */ jsx("thead", {
								className: "bg-slate-50 font-semibold text-slate-700",
								children: /* @__PURE__ */ jsxs("tr", { children: [
									/* @__PURE__ */ jsx("th", {
										className: "px-4 py-2.5",
										children: "Font Name"
									}),
									/* @__PURE__ */ jsx("th", {
										className: "px-4 py-2.5",
										children: "Preview"
									}),
									/* @__PURE__ */ jsx("th", {
										className: "px-4 py-2.5 text-center",
										children: "Source"
									}),
									/* @__PURE__ */ jsx("th", {
										className: "px-4 py-2.5 text-center",
										children: "Weights"
									}),
									/* @__PURE__ */ jsx("th", {
										className: "px-4 py-2.5 text-center",
										children: "Default"
									}),
									/* @__PURE__ */ jsx("th", {
										className: "px-4 py-2.5 text-right",
										children: "Actions"
									})
								] })
							}), /* @__PURE__ */ jsx("tbody", {
								className: "divide-y divide-slate-200",
								children: filteredFonts.length === 0 ? /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", {
									colSpan: 6,
									className: "px-4 py-8 text-center text-slate-400",
									children: search ? "No fonts match your search" : "No fonts registered"
								}) }) : filteredFonts.map((font) => /* @__PURE__ */ jsx(FontRow, {
									font,
									previewText,
									onSetDefault: handleSetDefault,
									onDelete: handleDeleteFont
								}, font.id))
							})]
						})
					})
				]
			}),
			/* @__PURE__ */ jsx(Card, {
				title: "Section Font Mapping",
				subtitle: "Assign different fonts to different sections of your website.",
				children: /* @__PURE__ */ jsx("div", {
					className: "grid gap-3 md:grid-cols-2 lg:grid-cols-3",
					children: FONT_SECTIONS.map((section) => {
						const currentFontId = config.sectionMapping[section.key];
						const currentFont = getFontById(currentFontId, config.fonts);
						return /* @__PURE__ */ jsxs("div", {
							className: "rounded-lg border border-slate-200 bg-white p-4 hover:border-slate-300 transition",
							children: [
								/* @__PURE__ */ jsxs("div", {
									className: "flex items-center gap-2 mb-1",
									children: [/* @__PURE__ */ jsx(Type, { className: "h-4 w-4 text-slate-500" }), /* @__PURE__ */ jsx("span", {
										className: "text-sm font-semibold text-slate-900",
										children: section.label
									})]
								}),
								/* @__PURE__ */ jsx("p", {
									className: "text-[11px] text-slate-400 mb-3",
									children: section.description
								}),
								/* @__PURE__ */ jsx(FontSelect, {
									fonts: config.fonts,
									value: currentFontId,
									onChange: (id) => handleSectionChange(section.key, id)
								}),
								currentFont && /* @__PURE__ */ jsxs("p", {
									className: "mt-2 text-sm text-slate-600 truncate",
									style: { fontFamily: `"${currentFont.family}", sans-serif` },
									children: [previewText.slice(0, 40), "..."]
								})
							]
						}, section.key);
					})
				})
			}),
			/* @__PURE__ */ jsxs(Card, {
				title: "Live Font Preview",
				subtitle: "See how your font selections look across different sections.",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "mb-4",
					children: [/* @__PURE__ */ jsx("label", {
						className: "block text-xs font-medium text-slate-600 mb-1",
						children: "Preview Text"
					}), /* @__PURE__ */ jsx("input", {
						type: "text",
						value: previewText,
						onChange: (e) => setPreviewText(e.target.value),
						className: "w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400"
					})]
				}), /* @__PURE__ */ jsx("div", {
					className: "grid gap-3 md:grid-cols-2",
					children: FONT_SECTIONS.map((section) => {
						const fontId = config.sectionMapping[section.key];
						const font = getFontById(fontId, config.fonts);
						const family = font ? `"${font.family}", sans-serif` : "sans-serif";
						const isHeadline = section.key === "headlines";
						return /* @__PURE__ */ jsxs("div", {
							className: "rounded-lg border border-slate-200 bg-slate-50 p-4",
							children: [
								/* @__PURE__ */ jsx("span", {
									className: "inline-block rounded bg-slate-900 px-2 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider mb-2",
									children: section.label
								}),
								/* @__PURE__ */ jsxs("p", {
									className: "text-xs text-slate-400 mb-1 font-mono",
									children: [
										font?.name ?? "—",
										" · ",
										font?.source === "upload" ? "Uploaded" : "Google Fonts"
									]
								}),
								/* @__PURE__ */ jsx("p", {
									className: "text-slate-900",
									style: {
										fontFamily: family,
										fontSize: isHeadline ? "1.5rem" : "1rem",
										fontWeight: isHeadline ? 800 : 400,
										lineHeight: 1.4
									},
									children: previewText
								})
							]
						}, section.key);
					})
				})]
			}),
			/* @__PURE__ */ jsx(Card, {
				title: "Font Usage Map",
				subtitle: "Where each font section applies across frontend and backend.",
				children: /* @__PURE__ */ jsx("div", {
					className: "overflow-hidden rounded-md border border-slate-200",
					children: /* @__PURE__ */ jsxs("table", {
						className: "min-w-full divide-y divide-slate-200 text-left text-xs",
						children: [/* @__PURE__ */ jsx("thead", {
							className: "bg-slate-50 font-semibold text-slate-700",
							children: /* @__PURE__ */ jsxs("tr", { children: [
								/* @__PURE__ */ jsx("th", {
									className: "px-4 py-2.5",
									children: "Section"
								}),
								/* @__PURE__ */ jsx("th", {
									className: "px-4 py-2.5",
									children: "Current Font"
								}),
								/* @__PURE__ */ jsx("th", {
									className: "px-4 py-2.5",
									children: "Frontend Usage"
								}),
								/* @__PURE__ */ jsx("th", {
									className: "px-4 py-2.5",
									children: "CSS Variable"
								})
							] })
						}), /* @__PURE__ */ jsx("tbody", {
							className: "divide-y divide-slate-200 text-slate-600",
							children: FONT_SECTIONS.map((section) => {
								const fontId = config.sectionMapping[section.key];
								const font = getFontById(fontId, config.fonts);
								return /* @__PURE__ */ jsxs("tr", {
									className: "hover:bg-slate-50/50",
									children: [
										/* @__PURE__ */ jsx("td", {
											className: "px-4 py-2.5 font-semibold text-slate-900",
											children: section.label
										}),
										/* @__PURE__ */ jsx("td", {
											className: "px-4 py-2.5",
											children: /* @__PURE__ */ jsx("span", {
												style: { fontFamily: font ? `"${font.family}", sans-serif` : "sans-serif" },
												children: font?.name ?? "—"
											})
										}),
										/* @__PURE__ */ jsx("td", {
											className: "px-4 py-2.5",
											children: section.description
										}),
										/* @__PURE__ */ jsx("td", {
											className: "px-4 py-2.5 font-mono text-[11px] text-slate-500",
											children: section.cssVar
										})
									]
								}, section.key);
							})
						})]
					})
				})
			}),
			showCatalog && /* @__PURE__ */ jsx(GoogleFontsCatalog, {
				fonts: config.fonts,
				onAdd: handleAddGoogleFont,
				onClose: () => setShowCatalog(false)
			}),
			showAddModal && /* @__PURE__ */ jsx(CustomFontModal, {
				onAdd: handleCustomGoogleFont,
				onClose: () => setShowAddModal(false)
			})
		]
	});
}
function FontRow({ font, previewText, onSetDefault, onDelete }) {
	return /* @__PURE__ */ jsxs("tr", {
		className: "hover:bg-slate-50/50 transition",
		children: [
			/* @__PURE__ */ jsxs("td", {
				className: "px-4 py-3",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ jsx("span", {
						className: "font-semibold text-slate-900",
						children: font.name
					}), font.isSystem && /* @__PURE__ */ jsx("span", {
						className: "rounded bg-slate-100 px-1.5 py-0.5 text-[9px] font-bold text-slate-500 uppercase",
						children: "System"
					})]
				}), /* @__PURE__ */ jsxs("p", {
					className: "text-[10px] text-slate-400 font-mono mt-0.5",
					children: [
						"\"",
						font.family,
						"\""
					]
				})]
			}),
			/* @__PURE__ */ jsx("td", {
				className: "px-4 py-3 max-w-[200px]",
				children: /* @__PURE__ */ jsx("p", {
					className: "text-sm text-slate-800 truncate",
					style: { fontFamily: `"${font.family}", sans-serif` },
					children: previewText.slice(0, 30)
				})
			}),
			/* @__PURE__ */ jsx("td", {
				className: "px-4 py-3 text-center",
				children: font.source === "google" ? /* @__PURE__ */ jsxs("span", {
					className: "inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-medium text-blue-700",
					children: [/* @__PURE__ */ jsx(Globe, { className: "h-3 w-3" }), " Google"]
				}) : /* @__PURE__ */ jsxs("span", {
					className: "inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-medium text-amber-700",
					children: [/* @__PURE__ */ jsx(HardDrive, { className: "h-3 w-3" }), " Upload"]
				})
			}),
			/* @__PURE__ */ jsx("td", {
				className: "px-4 py-3 text-center",
				children: /* @__PURE__ */ jsx("span", {
					className: "text-[11px] text-slate-500",
					children: font.weights.join(", ")
				})
			}),
			/* @__PURE__ */ jsx("td", {
				className: "px-4 py-3 text-center",
				children: /* @__PURE__ */ jsx("button", {
					onClick: () => onSetDefault(font.id),
					className: `rounded-full p-1.5 transition ${font.isDefault ? "bg-amber-100 text-amber-600" : "text-slate-300 hover:text-amber-500 hover:bg-amber-50"}`,
					title: font.isDefault ? "Default font" : "Set as default",
					children: /* @__PURE__ */ jsx(Star, { className: `h-4 w-4 ${font.isDefault ? "fill-current" : ""}` })
				})
			}),
			/* @__PURE__ */ jsx("td", {
				className: "px-4 py-3 text-right",
				children: font.isSystem ? /* @__PURE__ */ jsx("span", {
					className: "text-[10px] text-slate-400 italic",
					children: "Protected"
				}) : /* @__PURE__ */ jsx("button", {
					onClick: () => onDelete(font.id),
					className: "rounded p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600 transition",
					title: "Delete font",
					children: /* @__PURE__ */ jsx(Trash2, { className: "h-4 w-4" })
				})
			})
		]
	});
}
function FontSelect({ fonts, value, onChange }) {
	const [open, setOpen] = useState(false);
	const ref = useRef(null);
	const selected = fonts.find((f) => f.id === value);
	useEffect(() => {
		const handleClick = (e) => {
			if (ref.current && !ref.current.contains(e.target)) setOpen(false);
		};
		document.addEventListener("mousedown", handleClick);
		return () => document.removeEventListener("mousedown", handleClick);
	}, []);
	return /* @__PURE__ */ jsxs("div", {
		ref,
		className: "relative",
		children: [/* @__PURE__ */ jsxs("button", {
			onClick: () => setOpen(!open),
			className: "flex w-full items-center justify-between rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 hover:border-slate-300 transition",
			children: [/* @__PURE__ */ jsx("span", {
				className: "truncate",
				style: selected ? { fontFamily: `"${selected.family}", sans-serif` } : void 0,
				children: selected?.name ?? "Select a font..."
			}), /* @__PURE__ */ jsx(ChevronDown, { className: `h-4 w-4 text-slate-400 transition-transform ${open ? "rotate-180" : ""}` })]
		}), open && /* @__PURE__ */ jsx("div", {
			className: "absolute z-50 mt-1 w-full max-h-48 overflow-y-auto rounded-md border border-slate-200 bg-white shadow-lg",
			children: fonts.map((f) => /* @__PURE__ */ jsxs("button", {
				onClick: () => {
					onChange(f.id);
					setOpen(false);
				},
				className: `flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-slate-50 transition ${f.id === value ? "bg-slate-100 text-slate-900" : "text-slate-600"}`,
				children: [
					/* @__PURE__ */ jsx("span", {
						className: "flex-1 truncate text-left",
						style: { fontFamily: `"${f.family}", sans-serif` },
						children: f.name
					}),
					f.id === value && /* @__PURE__ */ jsx(Check, { className: "h-4 w-4 text-slate-900" }),
					f.isDefault && /* @__PURE__ */ jsx(Star, { className: "h-3 w-3 text-amber-500 fill-current" })
				]
			}, f.id))
		})]
	});
}
function UploadButton({ onUpload }) {
	const inputRef = useRef(null);
	return /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx("input", {
		ref: inputRef,
		type: "file",
		accept: ".woff2,.woff,.ttf,.otf",
		className: "hidden",
		onChange: (e) => {
			const file = e.target.files?.[0];
			if (file) onUpload(file);
			if (inputRef.current) inputRef.current.value = "";
		}
	}), /* @__PURE__ */ jsxs("button", {
		onClick: () => inputRef.current?.click(),
		className: "inline-flex items-center gap-2 rounded-md border border-dashed border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-600 hover:border-slate-400 hover:bg-slate-50 transition",
		children: [/* @__PURE__ */ jsx(Upload, { className: "h-4 w-4" }), " Upload Font File"]
	})] });
}
function GoogleFontsCatalog({ fonts, onAdd, onClose }) {
	const [search, setSearch] = useState("");
	const [categoryFilter, setCategoryFilter] = useState("All");
	const categories = ["All", ...new Set(GOOGLE_FONTS_CATALOG.map((f) => f.category))];
	const filtered = GOOGLE_FONTS_CATALOG.filter((f) => {
		const matchesSearch = f.name.toLowerCase().includes(search.toLowerCase());
		const matchesCategory = categoryFilter === "All" || f.category === categoryFilter;
		return matchesSearch && matchesCategory;
	});
	const alreadyAdded = new Set(fonts.map((f) => f.family.toLowerCase()));
	return /* @__PURE__ */ jsx("div", {
		className: "fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm",
		onClick: onClose,
		children: /* @__PURE__ */ jsxs("div", {
			className: "mx-4 w-full max-w-xl rounded-xl border border-slate-200 bg-white shadow-2xl",
			onClick: (e) => e.stopPropagation(),
			children: [
				/* @__PURE__ */ jsxs("div", {
					className: "flex items-center justify-between border-b border-slate-200 px-6 py-4",
					children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h3", {
						className: "text-lg font-bold text-slate-900",
						children: "Google Fonts Catalog"
					}), /* @__PURE__ */ jsx("p", {
						className: "text-xs text-slate-500",
						children: "Select from popular Google Fonts to add to your library"
					})] }), /* @__PURE__ */ jsx("button", {
						onClick: onClose,
						className: "rounded-md p-1 hover:bg-slate-100 transition",
						children: /* @__PURE__ */ jsx(X, { className: "h-5 w-5 text-slate-500" })
					})]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "px-6 py-3 space-y-3 border-b border-slate-100",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "relative",
						children: [/* @__PURE__ */ jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" }), /* @__PURE__ */ jsx("input", {
							type: "text",
							value: search,
							onChange: (e) => setSearch(e.target.value),
							placeholder: "Search fonts...",
							className: "w-full rounded-md border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400",
							autoFocus: true
						})]
					}), /* @__PURE__ */ jsx("div", {
						className: "flex flex-wrap gap-1",
						children: categories.map((cat) => /* @__PURE__ */ jsx("button", {
							onClick: () => setCategoryFilter(cat),
							className: `rounded-full px-3 py-1 text-xs font-medium transition ${categoryFilter === cat ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`,
							children: cat
						}, cat))
					})]
				}),
				/* @__PURE__ */ jsx("div", {
					className: "max-h-[340px] overflow-y-auto px-6 py-3",
					children: filtered.length === 0 ? /* @__PURE__ */ jsx("p", {
						className: "py-8 text-center text-sm text-slate-400",
						children: "No fonts match your search"
					}) : /* @__PURE__ */ jsx("div", {
						className: "space-y-2",
						children: filtered.map((f) => {
							const exists = alreadyAdded.has(f.family.toLowerCase());
							return /* @__PURE__ */ jsxs("div", {
								className: `flex items-center justify-between rounded-lg border px-4 py-3 transition ${exists ? "border-slate-100 bg-slate-50 opacity-60" : "border-slate-200 hover:border-slate-300 bg-white"}`,
								children: [/* @__PURE__ */ jsxs("div", {
									className: "flex-1 min-w-0",
									children: [/* @__PURE__ */ jsx("p", {
										className: "text-sm font-semibold text-slate-900",
										children: f.name
									}), /* @__PURE__ */ jsxs("p", {
										className: "text-[10px] text-slate-400",
										children: [
											f.category,
											" · Weights: ",
											f.weights.join(", ")
										]
									})]
								}), exists ? /* @__PURE__ */ jsxs("span", {
									className: "flex items-center gap-1 text-[10px] font-medium text-emerald-600",
									children: [/* @__PURE__ */ jsx(Check, { className: "h-3 w-3" }), " Added"]
								}) : /* @__PURE__ */ jsxs("button", {
									onClick: () => onAdd(f),
									className: "inline-flex items-center gap-1 rounded-md bg-slate-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-slate-800 transition",
									children: [/* @__PURE__ */ jsx(Plus, { className: "h-3 w-3" }), " Add"]
								})]
							}, f.family);
						})
					})
				}),
				/* @__PURE__ */ jsx("div", {
					className: "border-t border-slate-200 px-6 py-3 text-right",
					children: /* @__PURE__ */ jsx("button", {
						onClick: onClose,
						className: "rounded-md border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 transition",
						children: "Close"
					})
				})
			]
		})
	});
}
function CustomFontModal({ onAdd, onClose }) {
	const [name, setName] = useState("");
	const [weights, setWeights] = useState("400, 500, 600, 700");
	return /* @__PURE__ */ jsx("div", {
		className: "fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm",
		onClick: onClose,
		children: /* @__PURE__ */ jsxs("div", {
			className: "mx-4 w-full max-w-md rounded-xl border border-slate-200 bg-white shadow-2xl",
			onClick: (e) => e.stopPropagation(),
			children: [
				/* @__PURE__ */ jsxs("div", {
					className: "flex items-center justify-between border-b border-slate-200 px-6 py-4",
					children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h3", {
						className: "text-lg font-bold text-slate-900",
						children: "Add Custom Google Font"
					}), /* @__PURE__ */ jsx("p", {
						className: "text-xs text-slate-500",
						children: "Type the exact name from fonts.google.com"
					})] }), /* @__PURE__ */ jsx("button", {
						onClick: onClose,
						className: "rounded-md p-1 hover:bg-slate-100 transition",
						children: /* @__PURE__ */ jsx(X, { className: "h-5 w-5 text-slate-500" })
					})]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "px-6 py-4 space-y-4",
					children: [
						/* @__PURE__ */ jsxs("div", { children: [
							/* @__PURE__ */ jsx("label", {
								className: "block text-xs font-medium text-slate-700 mb-1",
								children: "Font Name"
							}),
							/* @__PURE__ */ jsx("input", {
								type: "text",
								value: name,
								onChange: (e) => setName(e.target.value),
								placeholder: "e.g. Roboto Slab",
								className: "w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400",
								autoFocus: true
							}),
							/* @__PURE__ */ jsx("p", {
								className: "mt-1 text-[10px] text-slate-400",
								children: "Must match exactly as shown on fonts.google.com"
							})
						] }),
						/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
							className: "block text-xs font-medium text-slate-700 mb-1",
							children: "Weights (comma-separated)"
						}), /* @__PURE__ */ jsx("input", {
							type: "text",
							value: weights,
							onChange: (e) => setWeights(e.target.value),
							placeholder: "400, 500, 600, 700",
							className: "w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400"
						})] }),
						/* @__PURE__ */ jsxs("div", {
							className: "flex items-start gap-2 rounded-md bg-amber-50 border border-amber-200 p-3",
							children: [/* @__PURE__ */ jsx(AlertTriangle, { className: "h-4 w-4 text-amber-600 mt-0.5 shrink-0" }), /* @__PURE__ */ jsxs("p", {
								className: "text-xs text-amber-800",
								children: [
									"If the font name is incorrect, it won't load. Verify the exact name at",
									" ",
									/* @__PURE__ */ jsx("a", {
										href: "https://fonts.google.com",
										target: "_blank",
										rel: "noopener noreferrer",
										className: "underline font-medium",
										children: "fonts.google.com"
									})
								]
							})]
						})
					]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "flex justify-end gap-2 border-t border-slate-200 px-6 py-3",
					children: [/* @__PURE__ */ jsx("button", {
						onClick: onClose,
						className: "rounded-md border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 transition",
						children: "Cancel"
					}), /* @__PURE__ */ jsxs("button", {
						onClick: () => onAdd(name, weights),
						disabled: !name.trim(),
						className: "inline-flex items-center gap-2 rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50 transition",
						children: [/* @__PURE__ */ jsx(Plus, { className: "h-4 w-4" }), " Add Font"]
					})]
				})
			]
		})
	});
}
function Card({ title, subtitle, children }) {
	return /* @__PURE__ */ jsxs("div", {
		className: "rounded-lg border border-slate-200 bg-white shadow-sm",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "border-b border-slate-100 px-6 py-4",
			children: [/* @__PURE__ */ jsx("h2", {
				className: "text-base font-bold text-slate-900",
				children: title
			}), subtitle && /* @__PURE__ */ jsx("p", {
				className: "text-xs text-slate-500 mt-0.5",
				children: subtitle
			})]
		}), /* @__PURE__ */ jsx("div", {
			className: "px-6 py-5",
			children
		})]
	});
}
//#endregion
export { FontSettingsTab };
