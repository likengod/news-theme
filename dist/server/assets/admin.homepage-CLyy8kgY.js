import { a as loadHomepageConfig, i as getHomepageConfigServer, r as defaultHomepageConfig, s as saveHomepageConfig, t as ALL_CATEGORY_OPTIONS } from "./homepage-config-DLaVRodU.js";
import { t as Switch } from "./switch-C_mzcXif.js";
import { t as Label } from "./label-BPuF5-mq.js";
import { useEffect, useState } from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { ChevronDown, RotateCcw, Save, Settings2 } from "lucide-react";
import { toast } from "sonner";
//#region src/components/admin/homepage/SectionCard.tsx
function SectionCard({ label, hint, value, showCategory, onChange, children }) {
	const [showStyle, setShowStyle] = useState(false);
	const [localTitle, setLocalTitle] = useState(value.title);
	const [localColor, setLocalColor] = useState(value.color);
	const [localFontSize, setLocalFontSize] = useState(value.fontSize);
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
	return /* @__PURE__ */ jsxs("div", {
		className: "rounded-lg border border-slate-200 bg-white shadow-sm transition-all hover:border-slate-300",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "flex items-center justify-between gap-3 border-b border-slate-100 bg-slate-50/60 px-4 py-2.5",
			children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("p", {
				className: "text-sm font-semibold text-slate-900",
				children: label
			}), hint && /* @__PURE__ */ jsx("p", {
				className: "text-[11px] text-slate-500",
				children: hint
			})] }), /* @__PURE__ */ jsx("div", {
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
					children: [/* @__PURE__ */ jsxs("label", {
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
					}), showCategory && /* @__PURE__ */ jsxs("label", {
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
							children: ALL_CATEGORY_OPTIONS.map((c) => /* @__PURE__ */ jsx("option", {
								value: c,
								children: c
							}, c))
						})]
					})]
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
function HeroSectionEditor({ config, onUpdate }) {
	return /* @__PURE__ */ jsxs("div", {
		className: "space-y-3",
		children: [
			/* @__PURE__ */ jsx(SectionCard, {
				label: "Featured story",
				hint: "Which category feeds the big hero lead story",
				value: config.heroFeatured,
				showCategory: true,
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
				onChange: (v) => onUpdate("heroTopStories", v)
			}),
			/* @__PURE__ */ jsx(SectionCard, {
				label: "Culture & Music row",
				hint: "Culture section under the main hero grid",
				value: config.heroCultureMusic,
				showCategory: true,
				onChange: (v) => onUpdate("heroCultureMusic", v)
			}),
			/* @__PURE__ */ jsx(SectionCard, {
				label: "Opinion (Right Sidebar)",
				hint: "Top section on the right sidebar",
				value: config.heroOpinion,
				showCategory: true,
				onChange: (v) => onUpdate("heroOpinion", v)
			}),
			/* @__PURE__ */ jsx(SectionCard, {
				label: "Popular (Right Sidebar)",
				hint: "Bottom section on the right sidebar",
				value: config.heroPopular,
				showCategory: true,
				onChange: (v) => onUpdate("heroPopular", v)
			})
		]
	});
}
//#endregion
//#region src/components/admin/homepage/NewsGridEditor.tsx
function NewsGridEditor({ columns, onUpdateColumn }) {
	return /* @__PURE__ */ jsx("div", {
		className: "grid gap-3 sm:grid-cols-2 lg:grid-cols-3",
		children: columns.map((col, idx) => /* @__PURE__ */ jsx(SectionCard, {
			label: `Column ${idx + 1}`,
			hint: `News column ${idx + 1} on homepage`,
			value: col,
			showCategory: true,
			onChange: (v) => onUpdateColumn(idx, v)
		}, idx))
	});
}
//#endregion
//#region src/components/admin/homepage/LiveVideoEditor.tsx
function LiveVideoEditor({ value, onChange }) {
	return /* @__PURE__ */ jsxs("div", {
		className: "space-y-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "grid gap-3 sm:grid-cols-2",
			children: [/* @__PURE__ */ jsxs("label", {
				className: "block",
				children: [/* @__PURE__ */ jsx("span", {
					className: "mb-1 block text-[11px] font-medium text-slate-500",
					children: "Streaming platform"
				}), /* @__PURE__ */ jsxs("select", {
					value: value.provider,
					onChange: (e) => onChange({
						...value,
						provider: e.target.value
					}),
					className: "h-9 w-full rounded-md border border-slate-200 bg-white px-2 text-sm focus:border-slate-900 focus:outline-none",
					children: [/* @__PURE__ */ jsx("option", {
						value: "youtube",
						children: "YouTube"
					}), /* @__PURE__ */ jsx("option", {
						value: "facebook",
						children: "Facebook"
					})]
				})]
			}), /* @__PURE__ */ jsxs("label", {
				className: "block",
				children: [/* @__PURE__ */ jsx("span", {
					className: "mb-1 block text-[11px] font-medium text-slate-500",
					children: "Overlay title"
				}), /* @__PURE__ */ jsx("input", {
					type: "text",
					value: value.title,
					onChange: (e) => onChange({
						...value,
						title: e.target.value
					}),
					placeholder: "LIVE: News Coverage",
					className: "h-9 w-full rounded-md border border-slate-200 px-3 text-sm focus:border-slate-900 focus:outline-none"
				})]
			})]
		}), value.provider === "youtube" ? /* @__PURE__ */ jsxs("label", {
			className: "block",
			children: [
				/* @__PURE__ */ jsx("span", {
					className: "mb-1 block text-[11px] font-medium text-slate-500",
					children: "YouTube Channel ID"
				}),
				/* @__PURE__ */ jsx("input", {
					type: "text",
					placeholder: "UCxxxxxxxxxxxxxxxxxxxx",
					value: value.youtubeChannelId,
					onChange: (e) => onChange({
						...value,
						youtubeChannelId: e.target.value
					}),
					className: "h-9 w-full rounded-md border border-slate-200 px-3 text-sm focus:border-slate-900 focus:outline-none"
				}),
				/* @__PURE__ */ jsxs("span", {
					className: "mt-1 block text-[11px] text-slate-500",
					children: ["From your YouTube Channel URL: youtube.com/channel/", /* @__PURE__ */ jsx("b", { children: "UC…" })]
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
				value: value.facebookPageUrl,
				onChange: (e) => onChange({
					...value,
					facebookPageUrl: e.target.value
				}),
				className: "h-9 w-full rounded-md border border-slate-200 px-3 text-sm focus:border-slate-900 focus:outline-none"
			})]
		})]
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
	const [cfg, setCfg] = useState(defaultHomepageConfig);
	const [dirty, setDirty] = useState(false);
	const [loading, setLoading] = useState(true);
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
	const onSave = () => {
		saveHomepageConfig(cfg);
		setDirty(false);
		toast.success("Homepage updated and saved to MySQL database!");
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
						disabled: !dirty,
						className: "inline-flex items-center gap-2 rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-50",
						children: [/* @__PURE__ */ jsx(Save, { className: "h-4 w-4" }), dirty ? "Save changes" : "Saved"]
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
						className: "flex items-center justify-between rounded-lg border border-slate-200 bg-white p-4 shadow-xs",
						children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h3", {
							className: "text-sm font-semibold text-slate-800",
							children: "Stock Market Ticker Bar"
						}), /* @__PURE__ */ jsx("p", {
							className: "text-xs text-slate-500 mt-0.5",
							children: "Displays live indices (NIFTY 50, SENSEX, GOLD, SILVER, CRUDE OIL) under the header."
						})] }), /* @__PURE__ */ jsxs("label", {
							className: "relative inline-flex cursor-pointer items-center ml-3 shrink-0",
							children: [/* @__PURE__ */ jsx("input", {
								type: "checkbox",
								checked: cfg.showTicker ?? true,
								onChange: (e) => update("showTicker", e.target.checked),
								className: "peer sr-only"
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
								className: "peer sr-only"
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
					onUpdate: update
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
						onChange: (v) => update("heroOpinion", v)
					}), /* @__PURE__ */ jsx(SectionCard, {
						label: "Popular",
						value: cfg.heroPopular,
						showCategory: true,
						onChange: (v) => update("heroPopular", v)
					})]
				})
			}),
			/* @__PURE__ */ jsx(Group, {
				title: "Live video stream",
				description: "Embed live YouTube or Facebook stream on homepage hero.",
				defaultOpen: false,
				children: /* @__PURE__ */ jsx(LiveVideoEditor, {
					value: cfg.liveVideo,
					onChange: (v) => update("liveVideo", v)
				})
			}),
			/* @__PURE__ */ jsx(Group, {
				title: "News grid (5 columns)",
				description: "Each column feeds news from your chosen category.",
				children: /* @__PURE__ */ jsx(NewsGridEditor, {
					columns: cfg.newsGridColumns,
					onUpdateColumn: updateCol
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
						onChange: (v) => update("watch", v)
					}), /* @__PURE__ */ jsx(SectionCard, {
						label: "Markets Magazine",
						value: cfg.marketsMagazine,
						showCategory: true,
						onChange: (v) => update("marketsMagazine", v)
					})]
				})
			}),
			/* @__PURE__ */ jsx("div", {
				className: "sticky bottom-4 flex justify-end",
				children: /* @__PURE__ */ jsxs("button", {
					onClick: onSave,
					disabled: !dirty,
					className: "inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-lg hover:bg-slate-800 disabled:opacity-50",
					children: [/* @__PURE__ */ jsx(Save, { className: "h-4 w-4" }), dirty ? "Save changes to MySQL" : "All saved"]
				})
			})
		]
	});
}
//#endregion
export { HomepageEditorPage as component };
