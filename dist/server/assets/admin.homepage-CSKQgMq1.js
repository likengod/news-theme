import { a as useSiteSettings, r as useCategories } from "./AdSettingsContext-BQWD_Grj.js";
import { r as getCategories } from "./taxonomy.functions-D_056n5T.js";
import { a as resolveYouTubeServer, n as getHomepageConfigServer, o as saveHomepageConfig, r as loadHomepageConfig, t as defaultHomepageConfig } from "./homepage-config-Dcb7Eyan.js";
import { t as Switch } from "./switch-C_mzcXif.js";
import { t as Label } from "./label-BPuF5-mq.js";
import { useEffect, useMemo, useState } from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { CheckCircle2, ChevronDown, Loader2, Play, RotateCcw, Save, Search, Settings2, Youtube } from "lucide-react";
import { toast } from "sonner";
//#region src/components/admin/homepage/SectionCard.tsx
function SectionCard({ label, hint, value, showCategory, showToggle, showImageFit, categoryOptions, onChange, children }) {
	const dbCats = useCategories();
	const [showStyle, setShowStyle] = useState(false);
	const [localTitle, setLocalTitle] = useState(value.title);
	const [localColor, setLocalColor] = useState(value.color);
	const [localFontSize, setLocalFontSize] = useState(value.fontSize);
	const isEnabled = value.enabled !== false;
	const options = useMemo(() => {
		let list = [];
		if (categoryOptions && categoryOptions.length > 0) list = [...categoryOptions];
		else if (Array.isArray(dbCats) && dbCats.length > 0) list = dbCats.map((c) => typeof c === "string" ? c : c.name || c.slug).filter(Boolean);
		const unique = /* @__PURE__ */ new Set();
		unique.add("Auto (Latest)");
		for (const name of list) if (name && name !== "Auto (Latest)") unique.add(name);
		if (value.category && value.category !== "Auto (Latest)") unique.add(value.category);
		return Array.from(unique);
	}, [
		categoryOptions,
		dbCats,
		value.category
	]);
	useEffect(() => {
		setLocalTitle(value.title);
		setLocalColor(value.color);
		setLocalFontSize(value.fontSize);
	}, [
		value.title,
		value.color,
		value.fontSize
	]);
	const handleTitleChange = (val) => {
		setLocalTitle(val);
		onChange({
			...value,
			title: val
		});
	};
	const handleColorChange = (val) => {
		setLocalColor(val);
		onChange({
			...value,
			color: val
		});
	};
	const handleFontSizeChange = (val) => {
		setLocalFontSize(val);
		onChange({
			...value,
			fontSize: val
		});
	};
	const handleToggle = () => {
		onChange({
			...value,
			enabled: !isEnabled
		});
	};
	return /* @__PURE__ */ jsxs("div", {
		className: `rounded-lg border border-slate-200 bg-white shadow-sm transition-all hover:border-slate-300 ${!isEnabled ? "opacity-60 bg-slate-50/50" : ""}`,
		children: [/* @__PURE__ */ jsxs("div", {
			className: "flex items-center justify-between gap-3 border-b border-slate-100 bg-slate-50/60 px-4 py-2.5",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "flex items-center gap-2.5",
				children: [showToggle && /* @__PURE__ */ jsx("button", {
					type: "button",
					role: "switch",
					"aria-checked": isEnabled,
					onClick: handleToggle,
					title: isEnabled ? "Disable section" : "Enable section",
					className: `relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none ${isEnabled ? "bg-slate-900" : "bg-slate-300"}`,
					children: /* @__PURE__ */ jsx("span", { className: `pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-xs transition duration-200 ${isEnabled ? "translate-x-4" : "translate-x-0"}` })
				}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("p", {
					className: "text-sm font-semibold text-slate-900 flex items-center gap-1.5",
					children: [label, showToggle && /* @__PURE__ */ jsx("span", {
						className: `text-[10px] px-1.5 py-0.2 rounded font-medium ${isEnabled ? "bg-emerald-100 text-emerald-800" : "bg-slate-200 text-slate-600"}`,
						children: isEnabled ? "Visible" : "Hidden"
					})]
				}), hint && /* @__PURE__ */ jsx("p", {
					className: "text-[11px] text-slate-500",
					children: hint
				})] })]
			}), /* @__PURE__ */ jsx("div", {
				className: "hidden max-w-[180px] truncate font-bold uppercase tracking-[0.15em] sm:block",
				style: {
					color: localColor,
					fontSize: `${Math.min(localFontSize, 14)}px`
				},
				title: localTitle,
				children: localTitle || "—"
			})]
		}), /* @__PURE__ */ jsxs("div", {
			className: "space-y-3 p-4",
			children: [
				/* @__PURE__ */ jsxs("div", {
					className: "grid gap-3 sm:grid-cols-2",
					children: [
						/* @__PURE__ */ jsxs("label", {
							className: "block",
							children: [/* @__PURE__ */ jsx("span", {
								className: "mb-1 block text-[11px] font-medium text-slate-500",
								children: "Heading text"
							}), /* @__PURE__ */ jsx("input", {
								type: "text",
								value: localTitle,
								onChange: (e) => handleTitleChange(e.target.value),
								placeholder: label,
								className: "h-9 w-full rounded-md border border-slate-200 px-3 text-sm focus:border-slate-900 focus:outline-none"
							})]
						}),
						showCategory && /* @__PURE__ */ jsxs("label", {
							className: "block",
							children: [/* @__PURE__ */ jsx("span", {
								className: "mb-1 block text-[11px] font-medium text-slate-500",
								children: "Show news from category"
							}), /* @__PURE__ */ jsx("select", {
								value: value.category ?? "Auto (Latest)",
								onChange: (e) => onChange({
									...value,
									category: e.target.value
								}),
								className: "h-9 w-full rounded-md border border-slate-200 bg-white px-2 text-sm focus:border-slate-900 focus:outline-none",
								children: options.map((c) => /* @__PURE__ */ jsx("option", {
									value: c,
									children: c
								}, c))
							})]
						}),
						showImageFit && /* @__PURE__ */ jsxs("label", {
							className: "block",
							children: [/* @__PURE__ */ jsx("span", {
								className: "mb-1 block text-[11px] font-medium text-slate-500",
								children: "Featured image display style"
							}), /* @__PURE__ */ jsxs("select", {
								value: value.imageFit ?? "contain",
								onChange: (e) => onChange({
									...value,
									imageFit: e.target.value
								}),
								className: "h-9 w-full rounded-md border border-slate-200 bg-white px-2 text-sm font-semibold focus:border-slate-900 focus:outline-none",
								children: [
									/* @__PURE__ */ jsx("option", {
										value: "contain",
										children: "Fit Full Image (Uncropped / Show 100% of photo & text)"
									}),
									/* @__PURE__ */ jsx("option", {
										value: "natural",
										children: "Natural Aspect Ratio (Original photo shape)"
									}),
									/* @__PURE__ */ jsx("option", {
										value: "cover",
										children: "Crop to Fill Card (Zoom & Fill)"
									})
								]
							})]
						})
					]
				}),
				children && /* @__PURE__ */ jsx("div", {
					className: "pt-2 border-t border-slate-100",
					children
				}),
				/* @__PURE__ */ jsxs("button", {
					type: "button",
					onClick: () => setShowStyle((s) => !s),
					className: "inline-flex h-8 items-center gap-1.5 rounded-md border border-slate-200 bg-white px-3 text-xs font-medium text-slate-600 hover:bg-slate-50",
					children: [
						/* @__PURE__ */ jsx(Settings2, { className: "h-3.5 w-3.5" }),
						showStyle ? "Hide" : "Change",
						" heading style",
						/* @__PURE__ */ jsx(ChevronDown, { className: `h-3.5 w-3.5 transition ${showStyle ? "rotate-180" : ""}` })
					]
				}),
				showStyle && /* @__PURE__ */ jsxs("div", {
					className: "flex flex-wrap items-end gap-3 border-t border-slate-100 pt-3",
					children: [
						/* @__PURE__ */ jsxs("label", {
							className: "w-32",
							children: [/* @__PURE__ */ jsx("span", {
								className: "mb-1 block text-[11px] font-medium text-slate-500",
								children: "Text size (px)"
							}), /* @__PURE__ */ jsx("input", {
								type: "number",
								min: 8,
								max: 64,
								value: localFontSize,
								onChange: (e) => handleFontSizeChange(Number(e.target.value) || 12),
								className: "h-9 w-full rounded-md border border-slate-200 px-2 text-sm focus:border-slate-900 focus:outline-none"
							})]
						}),
						/* @__PURE__ */ jsxs("label", {
							className: "flex items-end gap-2",
							children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("span", {
								className: "mb-1 block text-[11px] font-medium text-slate-500",
								children: "Color"
							}), /* @__PURE__ */ jsx("input", {
								type: "color",
								value: localColor,
								onChange: (e) => handleColorChange(e.target.value),
								className: "h-9 w-14 cursor-pointer rounded-md border border-slate-200 p-0.5"
							})] }), /* @__PURE__ */ jsx("input", {
								type: "text",
								value: localColor,
								onChange: (e) => handleColorChange(e.target.value),
								className: "h-9 w-28 rounded-md border border-slate-200 px-2 text-sm focus:border-slate-900 focus:outline-none font-mono"
							})]
						}),
						/* @__PURE__ */ jsx("button", {
							type: "button",
							onClick: () => {
								handleFontSizeChange(12);
								handleColorChange("#1A1110");
							},
							className: "h-9 rounded-md border border-slate-200 bg-white px-3 text-xs font-medium text-slate-600 hover:bg-slate-50",
							children: "Reset style"
						})
					]
				})
			]
		})]
	});
}
//#endregion
//#region src/components/admin/homepage/HeroSectionEditor.tsx
function HeroSectionEditor({ config, onUpdate, categoryOptions }) {
	return /* @__PURE__ */ jsxs("div", {
		className: "space-y-3",
		children: [
			/* @__PURE__ */ jsx(SectionCard, {
				label: "Featured story",
				hint: "Which category feeds the big hero lead story",
				value: config.heroFeatured,
				showCategory: true,
				categoryOptions,
				onChange: (v) => onUpdate("heroFeatured", v),
				children: /* @__PURE__ */ jsxs("div", {
					className: "mt-3 grid gap-4 sm:grid-cols-2",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "flex flex-col gap-2",
						children: [/* @__PURE__ */ jsx("span", {
							className: "text-[11px] font-medium text-slate-500",
							children: "Carousel Mode"
						}), /* @__PURE__ */ jsxs("div", {
							className: "flex items-center space-x-2",
							children: [/* @__PURE__ */ jsx(Switch, {
								id: "show-multiple",
								checked: config.heroFeatured.showMultiple !== false,
								onCheckedChange: (c) => onUpdate("heroFeatured", {
									...config.heroFeatured,
									showMultiple: c
								})
							}), /* @__PURE__ */ jsx(Label, {
								htmlFor: "show-multiple",
								className: "text-xs font-semibold text-slate-700 cursor-pointer",
								children: "Show multiple images with auto-slide"
							})]
						})]
					}), config.heroFeatured.showMultiple !== false && /* @__PURE__ */ jsxs(Fragment, { children: [
						/* @__PURE__ */ jsxs("div", {
							className: "flex flex-col gap-2",
							children: [/* @__PURE__ */ jsx("span", {
								className: "text-[11px] font-medium text-slate-500",
								children: "Auto Slide"
							}), /* @__PURE__ */ jsxs("div", {
								className: "flex items-center space-x-2",
								children: [/* @__PURE__ */ jsx(Switch, {
									id: "auto-slide",
									checked: config.heroFeatured.autoSlide !== false,
									onCheckedChange: (c) => onUpdate("heroFeatured", {
										...config.heroFeatured,
										autoSlide: c
									})
								}), /* @__PURE__ */ jsx(Label, {
									htmlFor: "auto-slide",
									className: "text-xs font-semibold text-slate-700 cursor-pointer",
									children: "Enable animation"
								})]
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "flex flex-col gap-1",
							children: [/* @__PURE__ */ jsx("label", {
								htmlFor: "slide-interval",
								className: "text-[11px] font-medium text-slate-500",
								children: "Slide Timing (seconds)"
							}), /* @__PURE__ */ jsx("input", {
								id: "slide-interval",
								type: "number",
								min: "2",
								max: "30",
								value: config.heroFeatured.slideInterval ?? 5,
								onChange: (e) => onUpdate("heroFeatured", {
									...config.heroFeatured,
									slideInterval: parseInt(e.target.value) || 5
								}),
								className: "h-8 w-24 rounded-md border border-slate-200 px-3 text-sm focus:border-slate-900 focus:outline-none"
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "flex flex-col gap-1",
							children: [/* @__PURE__ */ jsx("label", {
								htmlFor: "slide-count",
								className: "text-[11px] font-medium text-slate-500",
								children: "Slide Count (Max images)"
							}), /* @__PURE__ */ jsx("input", {
								id: "slide-count",
								type: "number",
								min: "2",
								max: "10",
								value: config.heroFeatured.slideCount ?? 3,
								onChange: (e) => onUpdate("heroFeatured", {
									...config.heroFeatured,
									slideCount: parseInt(e.target.value) || 3
								}),
								className: "h-8 w-24 rounded-md border border-slate-200 px-3 text-sm focus:border-slate-900 focus:outline-none"
							})]
						})
					] })]
				})
			}),
			/* @__PURE__ */ jsx(SectionCard, {
				label: "Top Stories",
				hint: "Header title and category for top stories column",
				value: config.heroTopStories,
				showCategory: true,
				categoryOptions,
				onChange: (v) => onUpdate("heroTopStories", v)
			}),
			/* @__PURE__ */ jsx(SectionCard, {
				label: "Culture & Music row",
				hint: "Culture section under the main hero grid",
				value: config.heroCultureMusic,
				showCategory: true,
				categoryOptions,
				onChange: (v) => onUpdate("heroCultureMusic", v)
			}),
			/* @__PURE__ */ jsx(SectionCard, {
				label: "Opinion (Right Sidebar)",
				hint: "Top section on the right sidebar",
				value: config.heroOpinion,
				showCategory: true,
				categoryOptions,
				onChange: (v) => onUpdate("heroOpinion", v)
			}),
			/* @__PURE__ */ jsx(SectionCard, {
				label: "Popular (Right Sidebar)",
				hint: "Bottom section on the right sidebar",
				value: config.heroPopular,
				showCategory: true,
				categoryOptions,
				onChange: (v) => onUpdate("heroPopular", v)
			})
		]
	});
}
//#endregion
//#region src/components/admin/homepage/NewsGridEditor.tsx
function NewsGridEditor({ columns, onUpdateColumn, categoryOptions }) {
	return /* @__PURE__ */ jsx("div", {
		className: "grid gap-3 sm:grid-cols-2 lg:grid-cols-3",
		children: columns.map((col, idx) => /* @__PURE__ */ jsx(SectionCard, {
			label: `Column ${idx + 1}`,
			hint: `News column ${idx + 1} on homepage`,
			value: col,
			showCategory: true,
			categoryOptions,
			onChange: (v) => onUpdateColumn(idx, v)
		}, idx))
	});
}
//#endregion
//#region src/components/admin/homepage/LiveVideoEditor.tsx
function LiveVideoEditor({ value, onChange, onSave, saving }) {
	const [resolving, setResolving] = useState(false);
	const [detectedInfo, setDetectedInfo] = useState(null);
	const [showPreview, setShowPreview] = useState(false);
	const handleDetect = async () => {
		const raw = (value.youtubeChannelId || "").trim();
		if (!raw) {
			toast.error("Please enter a YouTube Channel ID, Handle (@name), or Video Link");
			return;
		}
		setResolving(true);
		setDetectedInfo(null);
		try {
			const res = await resolveYouTubeServer({ data: { urlOrId: raw } });
			if (res.ok) {
				setDetectedInfo({
					channelId: res.channelId,
					videoId: res.videoId,
					title: res.title,
					thumbnailUrl: res.thumbnailUrl,
					type: res.type
				});
				const updated = {
					...value,
					youtubeChannelId: res.channelId || value.youtubeChannelId,
					youtubeVideoId: res.videoId || value.youtubeVideoId
				};
				if (res.title && !value.title) updated.title = res.title;
				if (res.thumbnailUrl && !value.thumbnailUrl) updated.thumbnailUrl = res.thumbnailUrl;
				onChange(updated);
				toast.success(res.type === "live_video" ? "Active live stream detected!" : res.type === "video" ? "YouTube video loaded successfully" : "Channel ID detected and verified!");
			} else toast.error(res.error || "Could not detect YouTube stream");
		} catch (err) {
			toast.error(err?.message || "Failed to contact YouTube resolver");
		} finally {
			setResolving(false);
		}
	};
	const previewEmbedUrl = (() => {
		if (value.provider === "youtube") {
			const vid = (value.youtubeVideoId || "").trim();
			const raw = (value.youtubeChannelId || "").trim();
			if (vid && vid.length === 11) return `https://www.youtube-nocookie.com/embed/${vid}?autoplay=0&controls=1&rel=0`;
			if (raw.includes("watch?v=")) {
				const v = raw.split("watch?v=")[1]?.split("&")[0];
				if (v) return `https://www.youtube-nocookie.com/embed/${v}?autoplay=0&controls=1&rel=0`;
			}
			if (raw.includes("youtu.be/")) {
				const v = raw.split("youtu.be/")[1]?.split("?")[0];
				if (v) return `https://www.youtube-nocookie.com/embed/${v}?autoplay=0&controls=1&rel=0`;
			}
			if (raw.includes("youtube.com/live/")) {
				const v = raw.split("youtube.com/live/")[1]?.split("?")[0]?.split("/")[0];
				if (v && !v.startsWith("@")) return `https://www.youtube-nocookie.com/embed/${v}?autoplay=0&controls=1&rel=0`;
			}
			if (raw.toLowerCase().includes("newsvanguardtripura24x7")) return `https://www.youtube-nocookie.com/embed/99tqX34EEVI?autoplay=0&controls=1&rel=0`;
			if (raw.startsWith("UC")) return `https://www.youtube-nocookie.com/embed/live_stream?channel=${raw}&autoplay=0&controls=1&rel=0`;
			return "";
		}
		const href = encodeURIComponent(value.facebookPageUrl || "");
		return href ? `https://www.facebook.com/plugins/video.php?href=${href}&show_text=false&autoplay=0` : "";
	})();
	return /* @__PURE__ */ jsxs("div", {
		className: "space-y-4 rounded-lg border border-slate-200 bg-white p-5 shadow-sm",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "flex items-center justify-between pb-3 border-b border-slate-100",
				children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("span", {
					className: "block text-sm font-semibold text-slate-800",
					children: "Show Live Stream on Homepage"
				}), /* @__PURE__ */ jsx("span", {
					className: "block text-[11px] text-slate-500",
					children: "Turn off when you are not actively broadcasting to streamline the homepage."
				})] }), /* @__PURE__ */ jsxs("label", {
					className: "relative inline-flex items-center cursor-pointer",
					children: [/* @__PURE__ */ jsx("input", {
						type: "checkbox",
						checked: value.enabled !== false,
						onChange: (e) => onChange({
							...value,
							enabled: e.target.checked
						}),
						className: "sr-only peer"
					}), /* @__PURE__ */ jsx("div", { className: "w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600" })]
				})]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "flex items-center justify-between pb-3 border-b border-slate-100",
				children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("span", {
					className: "block text-sm font-semibold text-slate-800",
					children: "Autoplay Video"
				}), /* @__PURE__ */ jsx("span", {
					className: "block text-[11px] text-slate-500",
					children: "Starts playback automatically when user clicks play or opens the stream."
				})] }), /* @__PURE__ */ jsxs("label", {
					className: "relative inline-flex items-center cursor-pointer",
					children: [/* @__PURE__ */ jsx("input", {
						type: "checkbox",
						checked: value.autoplay !== false,
						onChange: (e) => onChange({
							...value,
							autoplay: e.target.checked
						}),
						className: "sr-only peer"
					}), /* @__PURE__ */ jsx("div", { className: "w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600" })]
				})]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "grid gap-3 sm:grid-cols-2",
				children: [/* @__PURE__ */ jsxs("label", {
					className: "block",
					children: [/* @__PURE__ */ jsx("span", {
						className: "mb-1 block text-[11px] font-medium text-slate-500",
						children: "Streaming Platform"
					}), /* @__PURE__ */ jsxs("select", {
						value: value.provider,
						onChange: (e) => onChange({
							...value,
							provider: e.target.value
						}),
						className: "h-9.5 w-full rounded-md border border-slate-200 bg-white px-3 text-sm focus:border-slate-900 focus:outline-none",
						children: [/* @__PURE__ */ jsx("option", {
							value: "youtube",
							children: "YouTube (Channel / Live Video)"
						}), /* @__PURE__ */ jsx("option", {
							value: "facebook",
							children: "Facebook Video / Reel"
						})]
					})]
				}), /* @__PURE__ */ jsxs("label", {
					className: "block",
					children: [/* @__PURE__ */ jsx("span", {
						className: "mb-1 block text-[11px] font-medium text-slate-500",
						children: "Overlay Title"
					}), /* @__PURE__ */ jsx("input", {
						type: "text",
						value: value.title || "",
						onChange: (e) => onChange({
							...value,
							title: e.target.value
						}),
						placeholder: "e.g. লাইভ সংবাদ কভারেজ / LIVE News",
						className: "h-9.5 w-full rounded-md border border-slate-200 px-3 text-sm focus:border-slate-900 focus:outline-none"
					})]
				})]
			}),
			value.provider === "youtube" ? /* @__PURE__ */ jsxs("div", {
				className: "space-y-3 rounded-lg border border-red-100 bg-red-50/30 p-3.5",
				children: [
					/* @__PURE__ */ jsxs("div", { children: [
						/* @__PURE__ */ jsxs("div", {
							className: "flex items-center justify-between mb-1",
							children: [/* @__PURE__ */ jsxs("label", {
								className: "text-[12px] font-semibold text-slate-700 flex items-center gap-1.5",
								children: [/* @__PURE__ */ jsx(Youtube, { className: "h-4 w-4 text-red-600" }), "YouTube Channel ID, Handle, or Live URL"]
							}), /* @__PURE__ */ jsx("span", {
								className: "text-[10px] text-slate-400",
								children: "Accepts @Handle, Channel URL, or Video URL"
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "flex gap-2",
							children: [/* @__PURE__ */ jsx("input", {
								type: "text",
								placeholder: "e.g. @TodayTripura, or https://youtube.com/@channel, or UCxxxxxxxxxxxxxx",
								value: value.youtubeChannelId || "",
								onChange: (e) => onChange({
									...value,
									youtubeChannelId: e.target.value
								}),
								className: "h-9.5 flex-1 rounded-md border border-slate-200 bg-white px-3 text-sm focus:border-red-600 focus:outline-none"
							}), /* @__PURE__ */ jsx("button", {
								type: "button",
								onClick: handleDetect,
								disabled: resolving || !(value.youtubeChannelId || "").trim(),
								className: "inline-flex items-center gap-1.5 rounded-md bg-red-600 px-3.5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-red-700 disabled:opacity-50 cursor-pointer",
								children: resolving ? /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(Loader2, { className: "h-3.5 w-3.5 animate-spin" }), "Detecting..."] }) : /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(Search, { className: "h-3.5 w-3.5" }), "Detect & Test"] })
							})]
						}),
						/* @__PURE__ */ jsxs("p", {
							className: "mt-1 text-[11px] text-slate-500",
							children: [
								"💡 ",
								/* @__PURE__ */ jsx("b", { children: "Tip:" }),
								" You can paste your channel handle like ",
								/* @__PURE__ */ jsx("code", { children: "@TodayTripura" }),
								", your full channel URL, or an active live video link. Click ",
								/* @__PURE__ */ jsx("b", { children: "Detect & Test" }),
								" to automatically connect it!"
							]
						})
					] }),
					/* @__PURE__ */ jsxs("div", {
						className: "pt-2 border-t border-red-100/70",
						children: [/* @__PURE__ */ jsxs("label", {
							className: "block",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "flex items-center justify-between mb-1",
								children: [/* @__PURE__ */ jsx("span", {
									className: "text-[11px] font-medium text-slate-600",
									children: "Direct Live Stream or Fallback Video URL / ID (Recommended)"
								}), /* @__PURE__ */ jsx("span", {
									className: "text-[10px] text-emerald-600 font-medium",
									children: "Plays when not broadcasting live"
								})]
							}), /* @__PURE__ */ jsx("input", {
								type: "text",
								placeholder: "e.g. https://youtube.com/watch?v=VIDEO_ID or VIDEO_ID",
								value: value.youtubeVideoId || "",
								onChange: (e) => onChange({
									...value,
									youtubeVideoId: e.target.value
								}),
								className: "h-9 w-full rounded-md border border-slate-200 bg-white px-3 text-xs focus:border-slate-900 focus:outline-none"
							})]
						}), /* @__PURE__ */ jsx("p", {
							className: "mt-1 text-[10px] text-slate-400",
							children: "When your channel is offline, YouTube's channel embed will not play. Providing a direct video or bulletin URL ensures your website always displays your latest video instead of going blank."
						})]
					}),
					detectedInfo && /* @__PURE__ */ jsxs("div", {
						className: "rounded-md border border-emerald-200 bg-emerald-50 p-2.5 text-xs text-emerald-900 flex items-start gap-2",
						children: [/* @__PURE__ */ jsx(CheckCircle2, { className: "h-4 w-4 text-emerald-600 shrink-0 mt-0.5" }), /* @__PURE__ */ jsxs("div", {
							className: "space-y-1",
							children: [
								/* @__PURE__ */ jsx("div", {
									className: "font-semibold",
									children: detectedInfo.type === "live_video" ? "🔴 Live Stream Active on YouTube!" : detectedInfo.type === "video" ? "🎬 Video Connected Successfully!" : "✅ Channel Verified!"
								}),
								detectedInfo.channelId && /* @__PURE__ */ jsxs("div", { children: ["Channel ID: ", /* @__PURE__ */ jsx("code", {
									className: "bg-emerald-100/80 px-1 rounded",
									children: detectedInfo.channelId
								})] }),
								detectedInfo.videoId && /* @__PURE__ */ jsxs("div", { children: ["Video ID: ", /* @__PURE__ */ jsx("code", {
									className: "bg-emerald-100/80 px-1 rounded",
									children: detectedInfo.videoId
								})] }),
								detectedInfo.title && /* @__PURE__ */ jsxs("div", {
									className: "text-[11px] text-emerald-800 italic",
									children: [
										"\"",
										detectedInfo.title,
										"\""
									]
								})
							]
						})]
					})
				]
			}) : /* @__PURE__ */ jsxs("label", {
				className: "block",
				children: [/* @__PURE__ */ jsx("span", {
					className: "mb-1 block text-[11px] font-medium text-slate-500",
					children: "Facebook Page URL"
				}), /* @__PURE__ */ jsx("input", {
					type: "url",
					placeholder: "https://www.facebook.com/YourPage",
					value: value.facebookPageUrl || "",
					onChange: (e) => onChange({
						...value,
						facebookPageUrl: e.target.value
					}),
					className: "h-9.5 w-full rounded-md border border-slate-200 px-3 text-sm focus:border-slate-900 focus:outline-none"
				})]
			}),
			/* @__PURE__ */ jsxs("label", {
				className: "block",
				children: [
					/* @__PURE__ */ jsx("span", {
						className: "mb-1 block text-[11px] font-medium text-slate-500",
						children: "Custom Poster / Backdrop Image URL (Optional)"
					}),
					/* @__PURE__ */ jsx("input", {
						type: "url",
						placeholder: "https://... (Leave blank for sleek dark live backdrop)",
						value: value.thumbnailUrl || "",
						onChange: (e) => onChange({
							...value,
							thumbnailUrl: e.target.value
						}),
						className: "h-9 w-full rounded-md border border-slate-200 px-3 text-sm focus:border-slate-900 focus:outline-none"
					}),
					/* @__PURE__ */ jsx("span", {
						className: "mt-1 block text-[11px] text-slate-400",
						children: "Displayed as the cover image before visitors click to watch live."
					})
				]
			}),
			previewEmbedUrl && /* @__PURE__ */ jsxs("div", {
				className: "space-y-2 rounded-lg border border-slate-200 bg-slate-50 p-3",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "flex items-center justify-between",
					children: [/* @__PURE__ */ jsxs("span", {
						className: "text-xs font-semibold text-slate-700 flex items-center gap-1.5",
						children: [/* @__PURE__ */ jsx(Play, { className: "h-3.5 w-3.5 text-slate-600" }), "Stream Player Test"]
					}), /* @__PURE__ */ jsx("button", {
						type: "button",
						onClick: () => setShowPreview((p) => !p),
						className: "text-xs font-medium text-blue-600 hover:text-blue-800 cursor-pointer underline",
						children: showPreview ? "Hide Preview" : "Play & Test Preview"
					})]
				}), showPreview && /* @__PURE__ */ jsx("div", {
					className: "relative aspect-video w-full overflow-hidden rounded-md border border-slate-300 bg-black shadow-inner",
					children: /* @__PURE__ */ jsx("iframe", {
						src: previewEmbedUrl,
						title: "Admin Live Stream Preview",
						className: "h-full w-full",
						allow: "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",
						allowFullScreen: true
					})
				})]
			}),
			onSave && /* @__PURE__ */ jsx("div", {
				className: "pt-2 flex justify-end",
				children: /* @__PURE__ */ jsx("button", {
					type: "button",
					onClick: onSave,
					disabled: saving,
					className: "inline-flex items-center gap-2 rounded-md bg-slate-900 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-slate-800 disabled:opacity-50 cursor-pointer transition",
					children: saving ? /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(Loader2, { className: "h-3.5 w-3.5 animate-spin" }), "Saving Stream Settings..."] }) : /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(Save, { className: "h-3.5 w-3.5" }), "Save Live Video Stream"] })
				})
			})
		]
	});
}
//#endregion
//#region src/routes/admin.homepage.tsx?tsr-split=component
function Group({ title, description, defaultOpen = true, children }) {
	const [open, setOpen] = useState(defaultOpen);
	return /* @__PURE__ */ jsxs("section", {
		className: "rounded-xl border border-slate-200 bg-slate-50/40",
		children: [/* @__PURE__ */ jsxs("button", {
			type: "button",
			onClick: () => setOpen((o) => !o),
			className: "flex w-full items-center justify-between gap-3 px-4 py-3 text-left",
			children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h2", {
				className: "text-sm font-semibold text-slate-900",
				children: title
			}), description && /* @__PURE__ */ jsx("p", {
				className: "text-[11px] text-slate-500",
				children: description
			})] }), /* @__PURE__ */ jsx(ChevronDown, { className: `h-4 w-4 text-slate-500 transition ${open ? "rotate-180" : ""}` })]
		}), open && /* @__PURE__ */ jsx("div", {
			className: "space-y-3 px-4 pb-4",
			children
		})]
	});
}
function HomepageEditorPage() {
	const isEnterprise = (useSiteSettings().licenseType || "").toLowerCase().includes("enterprise");
	const [cfg, setCfg] = useState(defaultHomepageConfig);
	const [dirty, setDirty] = useState(false);
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const contextCats = useCategories();
	const [categories, setCategories] = useState([]);
	useEffect(() => {
		if (Array.isArray(contextCats) && contextCats.length > 0) setCategories(contextCats.map((c) => typeof c === "string" ? c : c.name || c.slug).filter(Boolean));
		getCategories().then((res) => {
			if (Array.isArray(res) && res.length > 0) setCategories(res.map((c) => typeof c === "string" ? c : c.name || c.slug).filter(Boolean));
		}).catch(() => {});
	}, [contextCats]);
	useEffect(() => {
		setCfg(loadHomepageConfig());
		getHomepageConfigServer().then((serverCfg) => {
			setCfg(serverCfg);
			setLoading(false);
		}).catch(() => setLoading(false));
	}, []);
	const update = (key, value) => {
		setCfg((p) => ({
			...p,
			[key]: value
		}));
		setDirty(true);
	};
	const updateCol = (i, value) => {
		setCfg((p) => {
			const next = [...p.newsGridColumns];
			next[i] = value;
			return {
				...p,
				newsGridColumns: next
			};
		});
		setDirty(true);
	};
	const onSave = async () => {
		setSaving(true);
		try {
			await saveHomepageConfig(cfg);
			setDirty(false);
			toast.success("Homepage configuration saved successfully");
		} catch (err) {
			console.error("Save failed:", err);
			toast.error(err?.message || "Failed to save homepage settings");
		} finally {
			setSaving(false);
		}
	};
	const onReset = () => {
		setCfg(defaultHomepageConfig);
		saveHomepageConfig(defaultHomepageConfig);
		setDirty(false);
		toast.success("Reset to defaults");
	};
	return /* @__PURE__ */ jsxs("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "flex flex-wrap items-center justify-between gap-3",
				children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h1", {
					className: "text-2xl font-bold tracking-tight",
					children: "Homepage Edit"
				}), /* @__PURE__ */ jsx("p", {
					className: "text-sm text-slate-500",
					children: "Rename each section, pick category news feeds, and customize heading styles."
				})] }), /* @__PURE__ */ jsxs("div", {
					className: "flex gap-2",
					children: [/* @__PURE__ */ jsxs("button", {
						onClick: onReset,
						className: "inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50",
						children: [/* @__PURE__ */ jsx(RotateCcw, { className: "h-4 w-4" }), "Reset"]
					}), /* @__PURE__ */ jsxs("button", {
						onClick: onSave,
						disabled: !dirty || saving,
						className: "inline-flex items-center gap-2 rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-50",
						children: [/* @__PURE__ */ jsx(Save, { className: "h-4 w-4" }), saving ? "Saving..." : dirty ? "Save" : "Saved"]
					})]
				})]
			}),
			/* @__PURE__ */ jsx(Group, {
				title: "Top Header Bars & Market Ticker",
				description: "Show or hide the financial market ticker bar and breaking news bar.",
				defaultOpen: true,
				children: /* @__PURE__ */ jsxs("div", {
					className: "grid gap-3 sm:grid-cols-2",
					children: [/* @__PURE__ */ jsxs("div", {
						className: `flex items-center justify-between rounded-lg border border-slate-200 bg-white p-4 shadow-xs ${!isEnterprise ? "opacity-60" : ""}`,
						children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("h3", {
							className: "text-sm font-semibold text-slate-800",
							children: ["Stock Market Ticker Bar", !isEnterprise && /* @__PURE__ */ jsx("span", {
								className: "ml-2 inline-flex items-center rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-800",
								children: "Enterprise"
							})]
						}), /* @__PURE__ */ jsx("p", {
							className: "text-xs text-slate-500 mt-0.5",
							children: "Displays live indices (NIFTY 50, SENSEX, GOLD, SILVER, CRUDE OIL) under the header."
						})] }), /* @__PURE__ */ jsxs("label", {
							className: `relative inline-flex items-center ml-3 shrink-0 ${isEnterprise ? "cursor-pointer" : "cursor-not-allowed opacity-50"}`,
							children: [/* @__PURE__ */ jsx("input", {
								type: "checkbox",
								checked: isEnterprise ? cfg.showTicker ?? false : false,
								onChange: (e) => isEnterprise && update("showTicker", e.target.checked),
								disabled: !isEnterprise,
								className: "peer sr-only",
								"aria-label": "Toggle Stock Market Ticker Bar"
							}), /* @__PURE__ */ jsx("div", { className: "peer h-6 w-11 rounded-full bg-slate-200 after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-focus:outline-none" })]
						})]
					}), /* @__PURE__ */ jsxs("div", {
						className: "flex items-center justify-between rounded-lg border border-slate-200 bg-white p-4 shadow-xs",
						children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h3", {
							className: "text-sm font-semibold text-slate-800",
							children: "Breaking News Bar"
						}), /* @__PURE__ */ jsx("p", {
							className: "text-xs text-slate-500 mt-0.5",
							children: "Displays latest breaking headlines scrolling ticker."
						})] }), /* @__PURE__ */ jsxs("label", {
							className: "relative inline-flex cursor-pointer items-center ml-3 shrink-0",
							children: [/* @__PURE__ */ jsx("input", {
								type: "checkbox",
								checked: cfg.showBreakingBar ?? true,
								onChange: (e) => update("showBreakingBar", e.target.checked),
								className: "peer sr-only",
								"aria-label": "Toggle Breaking News Bar"
							}), /* @__PURE__ */ jsx("div", { className: "peer h-6 w-11 rounded-full bg-slate-200 after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-focus:outline-none" })]
						})]
					})]
				})
			}),
			/* @__PURE__ */ jsx(Group, {
				title: "Hero area",
				description: "The main top section featuring lead stories, top news, and culture.",
				children: /* @__PURE__ */ jsx(HeroSectionEditor, {
					config: cfg,
					onUpdate: update,
					categoryOptions: categories
				})
			}),
			/* @__PURE__ */ jsx(Group, {
				title: "Sidebar sections",
				defaultOpen: false,
				children: /* @__PURE__ */ jsxs("div", {
					className: "space-y-3",
					children: [/* @__PURE__ */ jsx(SectionCard, {
						label: "Opinion",
						value: cfg.heroOpinion,
						showCategory: true,
						categoryOptions: categories,
						onChange: (v) => update("heroOpinion", v)
					}), /* @__PURE__ */ jsx(SectionCard, {
						label: "Popular",
						value: cfg.heroPopular,
						showCategory: true,
						categoryOptions: categories,
						onChange: (v) => update("heroPopular", v)
					})]
				})
			}),
			/* @__PURE__ */ jsx(Group, {
				title: "Live video stream",
				description: "Embed live YouTube or Facebook stream on homepage hero.",
				defaultOpen: true,
				children: /* @__PURE__ */ jsx(LiveVideoEditor, {
					value: cfg.liveVideo,
					onChange: (v) => update("liveVideo", v),
					onSave,
					saving
				})
			}),
			/* @__PURE__ */ jsx(Group, {
				title: "News grid (5 columns)",
				description: "Each column feeds news from your chosen category.",
				children: /* @__PURE__ */ jsx(NewsGridEditor, {
					columns: cfg.newsGridColumns,
					onUpdateColumn: updateCol,
					categoryOptions: categories
				})
			}),
			/* @__PURE__ */ jsx(Group, {
				title: "Other sections",
				defaultOpen: false,
				children: /* @__PURE__ */ jsxs("div", {
					className: "space-y-3",
					children: [/* @__PURE__ */ jsx(SectionCard, {
						label: "Watch",
						value: cfg.watch,
						showCategory: true,
						showToggle: true,
						categoryOptions: categories,
						onChange: (v) => update("watch", v)
					}), /* @__PURE__ */ jsx(SectionCard, {
						label: "Markets Magazine",
						hint: "Toggle to show or hide the Markets Magazine section on homepage.",
						value: cfg.marketsMagazine,
						showCategory: true,
						showToggle: true,
						showImageFit: true,
						categoryOptions: categories,
						onChange: (v) => update("marketsMagazine", v)
					})]
				})
			}),
			/* @__PURE__ */ jsx("div", {
				className: "sticky bottom-4 flex justify-end",
				children: /* @__PURE__ */ jsxs("button", {
					onClick: onSave,
					disabled: !dirty || saving,
					className: "inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-lg hover:bg-slate-800 disabled:opacity-50",
					children: [/* @__PURE__ */ jsx(Save, { className: "h-4 w-4" }), saving ? "Saving..." : dirty ? "Save" : "Saved"]
				})
			})
		]
	});
}
//#endregion
export { HomepageEditorPage as component };

//# sourceMappingURL=admin.homepage-CSKQgMq1.js.map