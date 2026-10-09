import { o as loadSettings, s as saveSettings } from "./site-settings-CcjkeHOs.js";
import { i as useFontConfig } from "./AdSettingsContext-DDlrElA3.js";
import { n as MediaField } from "./MediaField-DNR1UJgc.js";
import React, { useEffect, useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
import { Clock, Layers, Power, RefreshCw, Save, Sparkles } from "lucide-react";
import { toast } from "sonner";
//#region src/components/admin/settings/festive/constants.ts
var FESTIVE_GRADIENT_MAP = {
	"indian-flag": "linear-gradient(to right, #FF9933, #000080, #138808)",
	diwali: "linear-gradient(to right, #FF8008, #FFC837, #FF007F, #7F00FF)",
	sunset: "linear-gradient(to right, #F5576C, #F093FB)",
	neon: "linear-gradient(to right, #FF007F, #7F00FF, #00F0FF)",
	ocean: "linear-gradient(to right, #00c6ff, #0072ff)",
	forest: "linear-gradient(to right, #11998e, #38ef7d)"
};
var resolveFestiveGradient = (val) => {
	if (!val) return null;
	if (FESTIVE_GRADIENT_MAP[val]) return FESTIVE_GRADIENT_MAP[val];
	if (val.includes("gradient(")) return val;
	return null;
};
var ROTATION_KEYFRAMES = `
@keyframes rot-slide-up   { from { opacity:0; transform: translateY(60px);  } to { opacity:1; transform: translateY(0); } }
@keyframes rot-slide-down { from { opacity:0; transform: translateY(-60px); } to { opacity:1; transform: translateY(0); } }
@keyframes rot-slide-left { from { opacity:0; transform: translateX(80px);  } to { opacity:1; transform: translateX(0); } }
@keyframes rot-slide-right{ from { opacity:0; transform: translateX(-80px); } to { opacity:1; transform: translateX(0); } }
@keyframes rot-fade       { from { opacity:0;                                } to { opacity:1;                         } }
@keyframes rot-zoom       { from { opacity:0; transform: scale(0.6);         } to { opacity:1; transform: scale(1);   } }
@keyframes rot-flip       { from { opacity:0; transform: rotateX(90deg);     } to { opacity:1; transform: rotateX(0); } }
`;
var ROTATION_ANIMATION_STYLE = {
	"slide-up": { animation: "rot-slide-up    0.35s cubic-bezier(0.22,1,0.36,1) both" },
	"slide-down": { animation: "rot-slide-down  0.35s cubic-bezier(0.22,1,0.36,1) both" },
	"slide-left": { animation: "rot-slide-left  0.35s cubic-bezier(0.22,1,0.36,1) both" },
	"slide-right": { animation: "rot-slide-right 0.35s cubic-bezier(0.22,1,0.36,1) both" },
	fade: { animation: "rot-fade        0.35s ease both" },
	zoom: { animation: "rot-zoom        0.35s cubic-bezier(0.34,1.56,0.64,1) both" },
	flip: {
		animation: "rot-flip        0.5s  cubic-bezier(0.22,1,0.36,1) both",
		perspective: "400px"
	}
};
var PRESET_COLORS = [
	{
		name: "Default Black",
		hex: "#000000"
	},
	{
		name: "Deep Saffron",
		hex: "#E65100"
	},
	{
		name: "Festival Red",
		hex: "#D32F2F"
	},
	{
		name: "Royal Gold",
		hex: "#D4AF37"
	},
	{
		name: "Festive Purple",
		hex: "#7B1FA2"
	},
	{
		name: "Emerald Green",
		hex: "#2E7D32"
	},
	{
		name: "Electric Blue",
		hex: "#1565C0"
	},
	{
		name: "Crimson Rose",
		hex: "#C2185B"
	},
	{
		name: "Amber Orange",
		hex: "#FF6F00"
	},
	{
		name: "Teal Cyan",
		hex: "#00897B"
	},
	{
		name: "Indigo Night",
		hex: "#283593"
	},
	{
		name: "Slate Charcoal",
		hex: "#374151"
	}
];
//#endregion
//#region src/components/admin/settings/festive/FestiveControls.tsx
var GRADIENT_PRESETS = [
	{
		id: "indian-flag",
		name: "Tricolor (Indian Flag)"
	},
	{
		id: "diwali",
		name: "Festival Gold (Diwali)"
	},
	{
		id: "sunset",
		name: "Sunset (Pink & Orange)"
	},
	{
		id: "neon",
		name: "Neon (Magenta & Cyan)"
	},
	{
		id: "ocean",
		name: "Ocean (Sky & Blue)"
	},
	{
		id: "forest",
		name: "Forest (Emerald & Mint)"
	}
];
function ColorOrGradientPicker({ title, subtitle, color, gradient, defaultColor = "#000000", onChangeColor, onChangeGradient }) {
	const isGradientMode = Boolean(gradient);
	const activeColor = color || defaultColor;
	const [customColor1, setCustomColor1] = useState("#FF0844");
	const [customColor2, setCustomColor2] = useState("#FFB199");
	const [customDirection, setCustomDirection] = useState("to right");
	const currentGradientSelection = React.useMemo(() => {
		if (!gradient) return "indian-flag";
		if (FESTIVE_GRADIENT_MAP[gradient]) return gradient;
		return "custom";
	}, [gradient]);
	const activeGradientCss = resolveFestiveGradient(gradient || "indian-flag");
	const handleApplyGradient = (gradIdOrCss) => {
		if (gradIdOrCss === "custom") onChangeGradient(customDirection === "radial" ? `radial-gradient(circle at center, ${customColor1}, ${customColor2})` : `linear-gradient(${customDirection}, ${customColor1}, ${customColor2})`);
		else onChangeGradient(gradIdOrCss);
	};
	const handleUpdateCustomGradient = (c1, c2, dir) => {
		onChangeGradient(dir === "radial" ? `radial-gradient(circle at center, ${c1}, ${c2})` : `linear-gradient(${dir}, ${c1}, ${c2})`);
	};
	return /* @__PURE__ */ jsxs("div", {
		className: "rounded-xl border border-slate-200 bg-white p-4 space-y-3.5 shadow-2xs",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3",
			children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("span", {
				className: "text-xs font-bold uppercase tracking-wider text-slate-800 block",
				children: title
			}), /* @__PURE__ */ jsx("span", {
				className: "text-[11px] text-slate-400",
				children: subtitle
			})] }), /* @__PURE__ */ jsxs("div", {
				className: "inline-flex rounded-lg border border-slate-200 bg-slate-100 p-0.5 self-start sm:self-auto",
				children: [/* @__PURE__ */ jsx("button", {
					type: "button",
					onClick: () => onChangeColor(activeColor),
					className: `rounded-md px-3 py-1 text-xs font-semibold transition ${!isGradientMode ? "bg-white text-slate-900 shadow-xs" : "text-slate-600 hover:text-slate-900"}`,
					children: "Solid Color"
				}), /* @__PURE__ */ jsx("button", {
					type: "button",
					onClick: () => handleApplyGradient(currentGradientSelection || "indian-flag"),
					className: `rounded-md px-3 py-1 text-xs font-semibold transition ${isGradientMode ? "bg-white text-slate-900 shadow-xs" : "text-slate-600 hover:text-slate-900"}`,
					children: "Gradient"
				})]
			})]
		}), !isGradientMode ? /* @__PURE__ */ jsxs("div", {
			className: "space-y-2",
			children: [/* @__PURE__ */ jsx("label", {
				className: "text-xs font-semibold text-slate-700 block",
				children: "Choose Color"
			}), /* @__PURE__ */ jsxs("div", {
				className: "flex items-center gap-2.5",
				children: [/* @__PURE__ */ jsx("label", {
					className: "relative h-10 w-10 shrink-0 rounded-lg border-2 border-white shadow ring-1 ring-slate-300 cursor-pointer overflow-hidden hover:scale-105 transition",
					style: { backgroundColor: activeColor },
					title: "Click to pick custom color",
					children: /* @__PURE__ */ jsx("input", {
						type: "color",
						value: activeColor.startsWith("#") && activeColor.length === 7 ? activeColor : "#000000",
						onChange: (e) => onChangeColor(e.target.value),
						className: "absolute inset-0 opacity-0 cursor-pointer w-full h-full"
					})
				}), /* @__PURE__ */ jsxs("select", {
					value: PRESET_COLORS.some((c) => c.hex.toLowerCase() === activeColor.toLowerCase()) ? activeColor.toUpperCase() : "custom",
					onChange: (e) => {
						if (e.target.value !== "custom") onChangeColor(e.target.value);
					},
					className: "h-10 flex-1 min-w-0 rounded-lg border border-slate-200 px-3 text-sm font-medium bg-white focus:border-slate-900 focus:outline-none",
					children: [PRESET_COLORS.map((c) => /* @__PURE__ */ jsx("option", {
						value: c.hex.toUpperCase(),
						children: c.name
					}, c.hex)), /* @__PURE__ */ jsx("option", {
						value: "custom",
						children: "Custom Color (use swatch on left)"
					})]
				})]
			})]
		}) : /* @__PURE__ */ jsxs("div", {
			className: "space-y-3",
			children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
				className: "text-xs font-semibold text-slate-700 block mb-1",
				children: "Choose Gradient"
			}), /* @__PURE__ */ jsxs("div", {
				className: "flex items-center gap-2.5",
				children: [/* @__PURE__ */ jsx("div", {
					className: "h-10 w-10 shrink-0 rounded-lg border border-slate-300 shadow-inner overflow-hidden",
					style: { background: activeGradientCss || "#f1f5f9" },
					title: "Current Gradient"
				}), /* @__PURE__ */ jsxs("select", {
					value: currentGradientSelection,
					onChange: (e) => handleApplyGradient(e.target.value),
					className: "h-10 flex-1 min-w-0 rounded-lg border border-slate-200 px-3 text-sm font-medium bg-white focus:border-slate-900 focus:outline-none",
					children: [/* @__PURE__ */ jsx("optgroup", {
						label: "Presets",
						children: GRADIENT_PRESETS.map((g) => /* @__PURE__ */ jsx("option", {
							value: g.id,
							children: g.name
						}, g.id))
					}), /* @__PURE__ */ jsx("option", {
						value: "custom",
						children: "🎨 Custom 2-Color Gradient..."
					})]
				})]
			})] }), currentGradientSelection === "custom" && /* @__PURE__ */ jsxs("div", {
				className: "rounded-lg border border-slate-200 bg-slate-50 p-3 space-y-2.5 animate-in fade-in duration-150",
				children: [
					/* @__PURE__ */ jsx("span", {
						className: "text-[11px] font-bold uppercase tracking-wider text-slate-600 block",
						children: "Custom Colors & Direction"
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "grid grid-cols-2 gap-2",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-2 rounded-md border border-slate-200 bg-white p-1.5 shadow-2xs",
							children: [/* @__PURE__ */ jsx("label", {
								className: "relative h-8 w-8 shrink-0 rounded-full border-2 border-white shadow ring-1 ring-slate-200 cursor-pointer overflow-hidden",
								style: { backgroundColor: customColor1 },
								title: "Click to pick Color 1",
								children: /* @__PURE__ */ jsx("input", {
									type: "color",
									value: customColor1,
									onChange: (e) => {
										setCustomColor1(e.target.value);
										handleUpdateCustomGradient(e.target.value, customColor2, customDirection);
									},
									className: "absolute inset-0 opacity-0 cursor-pointer w-full h-full"
								})
							}), /* @__PURE__ */ jsx("span", {
								className: "text-xs font-medium text-slate-700",
								children: "Color 1"
							})]
						}), /* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-2 rounded-md border border-slate-200 bg-white p-1.5 shadow-2xs",
							children: [/* @__PURE__ */ jsx("label", {
								className: "relative h-8 w-8 shrink-0 rounded-full border-2 border-white shadow ring-1 ring-slate-200 cursor-pointer overflow-hidden",
								style: { backgroundColor: customColor2 },
								title: "Click to pick Color 2",
								children: /* @__PURE__ */ jsx("input", {
									type: "color",
									value: customColor2,
									onChange: (e) => {
										setCustomColor2(e.target.value);
										handleUpdateCustomGradient(customColor1, e.target.value, customDirection);
									},
									className: "absolute inset-0 opacity-0 cursor-pointer w-full h-full"
								})
							}), /* @__PURE__ */ jsx("span", {
								className: "text-xs font-medium text-slate-700",
								children: "Color 2"
							})]
						})]
					}),
					/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
						className: "text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1",
						children: "Direction"
					}), /* @__PURE__ */ jsxs("select", {
						value: customDirection,
						onChange: (e) => {
							setCustomDirection(e.target.value);
							handleUpdateCustomGradient(customColor1, customColor2, e.target.value);
						},
						className: "h-8 w-full rounded border border-slate-200 px-2 text-xs font-medium bg-white focus:border-slate-900 focus:outline-none",
						children: [
							/* @__PURE__ */ jsx("option", {
								value: "to right",
								children: "Left → Right"
							}),
							/* @__PURE__ */ jsx("option", {
								value: "to bottom",
								children: "Top ↓ Bottom"
							}),
							/* @__PURE__ */ jsx("option", {
								value: "135deg",
								children: "Diagonal ↘"
							}),
							/* @__PURE__ */ jsx("option", {
								value: "radial",
								children: "Radial (Center)"
							})
						]
					})] })
				]
			})]
		})]
	});
}
function FestiveControls({ settings, update, fontConfig }) {
	return /* @__PURE__ */ jsxs("div", {
		className: "lg:col-span-7 space-y-6",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "space-y-4 rounded-2xl border border-slate-200 bg-slate-50/60 p-4 sm:p-5",
			children: [
				/* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-2 border-b border-slate-200 pb-2.5",
					children: [/* @__PURE__ */ jsx(Sparkles, { className: "h-4 w-4 text-amber-500" }), /* @__PURE__ */ jsx("h3", {
						className: "text-xs font-bold uppercase tracking-wider text-slate-800",
						children: "Custom Alert / Title Message"
					})]
				}),
				/* @__PURE__ */ jsxs("div", { children: [
					/* @__PURE__ */ jsx("label", {
						className: "mb-1 block text-xs font-semibold text-slate-700",
						children: "Alert Headline Text (Optional if image is added)"
					}),
					/* @__PURE__ */ jsx("input", {
						type: "text",
						value: settings.topBarWeatherCustomText || "",
						onChange: (e) => {
							update("topBarWeatherCustomText", e.target.value);
							update("festiveScanMeCustomText", e.target.value);
						},
						placeholder: "e.g. Breaking News Alert",
						className: "h-10 w-full rounded-lg border border-slate-200 px-3 text-sm focus:border-slate-900 focus:outline-none bg-white"
					}),
					/* @__PURE__ */ jsx("p", {
						className: "mt-1 text-[11px] text-slate-400",
						children: "Shown when rotating. If an image is uploaded below, the image is displayed directly."
					})
				] }),
				/* @__PURE__ */ jsxs("div", {
					className: "rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "flex flex-wrap items-center justify-between gap-1.5 mb-1.5",
							children: [/* @__PURE__ */ jsx("span", {
								className: "text-xs font-bold text-slate-800",
								children: "Alert Badge / Icon Image (Optional)"
							}), /* @__PURE__ */ jsx("span", {
								className: "inline-flex items-center rounded-md bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-800 border border-amber-200",
								children: "Recommended: 32×32px – 48×48px (Icon) or max 120×32px (Badge)"
							})]
						}),
						/* @__PURE__ */ jsxs("p", {
							className: "text-[11px] text-slate-500 mb-2.5",
							children: ["Attach a logo, festival badge, or emblem (e.g. News Logo, Indian Flag, Festival Badge).", /* @__PURE__ */ jsxs("span", {
								className: "font-semibold text-slate-700",
								children: [" ", "When an image is added, the alert displays the image directly across category titles, top bar, and banners without needing text."]
							})]
						}),
						/* @__PURE__ */ jsx(MediaField, {
							value: settings.festiveAlertImage || "",
							onChange: (url) => update("festiveAlertImage", url),
							usage: "other",
							inline: true,
							emptyLabel: "No alert icon",
							recommendedSize: "32×32 px to 48×48 px (Square) or max 120×32 px (Badge)",
							hint: "Format: PNG with transparent background, SVG, or WebP (max 1 MB)"
						})
					]
				}),
				/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
					className: "mb-1 block text-xs font-semibold text-slate-700",
					children: "Rotate Delay (Seconds)"
				}), /* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-2",
					children: [
						/* @__PURE__ */ jsx(Clock, { className: "h-4 w-4 text-slate-400" }),
						/* @__PURE__ */ jsx("input", {
							type: "number",
							min: 2,
							max: 60,
							value: settings.topBarSwapDelay || 5,
							onChange: (e) => update("topBarSwapDelay", Number(e.target.value)),
							className: "h-9 w-24 rounded-lg border border-slate-200 px-3 text-sm focus:border-slate-900 focus:outline-none bg-white"
						}),
						/* @__PURE__ */ jsx("span", {
							className: "text-xs text-slate-500",
							children: "sec"
						})
					]
				})] }),
				/* @__PURE__ */ jsx(ColorOrGradientPicker, {
					title: "Alert Message Text Style",
					subtitle: "Controls color or gradient when alert text is displayed",
					color: settings.topBarTextColor || "#000000",
					gradient: settings.topBarTextGradient || "",
					onChangeColor: (hex) => {
						update("topBarTextColor", hex);
						update("topBarTextGradient", "");
					},
					onChangeGradient: (grad) => update("topBarTextGradient", grad)
				}),
				/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
					className: "mb-1 block text-xs font-semibold text-slate-700",
					children: "Rotation Animation Style"
				}), /* @__PURE__ */ jsxs("select", {
					value: settings.customAlertAnimationStyle || "slide-up",
					onChange: (e) => update("customAlertAnimationStyle", e.target.value),
					className: "h-10 w-full rounded-lg border border-slate-200 px-3 text-sm focus:border-slate-900 focus:outline-none bg-white font-medium",
					children: [
						/* @__PURE__ */ jsx("option", {
							value: "slide-up",
							children: "Slide Up (Bottom to Top)"
						}),
						/* @__PURE__ */ jsx("option", {
							value: "slide-down",
							children: "Slide Down (Top to Bottom)"
						}),
						/* @__PURE__ */ jsx("option", {
							value: "slide-left",
							children: "Slide Left (Right to Left)"
						}),
						/* @__PURE__ */ jsx("option", {
							value: "slide-right",
							children: "Slide Right (Left to Right)"
						}),
						/* @__PURE__ */ jsx("option", {
							value: "fade",
							children: "Gentle Fade In"
						}),
						/* @__PURE__ */ jsx("option", {
							value: "zoom",
							children: "Pop & Zoom In"
						}),
						/* @__PURE__ */ jsx("option", {
							value: "flip",
							children: "3D Flip (Perspective)"
						})
					]
				})] }),
				/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
					className: "mb-1 block text-xs font-semibold text-slate-700",
					children: "Headline Font Family"
				}), /* @__PURE__ */ jsx("select", {
					value: settings.customAlertFontFamily || "inter",
					onChange: (e) => update("customAlertFontFamily", e.target.value),
					className: "h-10 w-full rounded-lg border border-slate-200 px-3 text-sm focus:border-slate-900 focus:outline-none bg-white font-medium",
					children: fontConfig.fonts.map((f) => /* @__PURE__ */ jsxs("option", {
						value: f.id,
						children: [
							f.name,
							" ",
							f.source === "google" ? "(Google Fonts)" : f.source === "upload" ? "(Uploaded)" : ""
						]
					}, f.id))
				})] }),
				/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("div", {
					className: "flex items-center justify-between mb-1",
					children: [/* @__PURE__ */ jsx("label", {
						className: "text-xs font-semibold text-slate-700",
						children: "Alert Text Size (Top Bar)"
					}), /* @__PURE__ */ jsxs("span", {
						className: "text-xs font-mono font-bold text-slate-900",
						children: [settings.customAlertFontSize || 14, "px"]
					})]
				}), /* @__PURE__ */ jsx("input", {
					type: "range",
					min: 11,
					max: 36,
					step: 1,
					value: settings.customAlertFontSize || 14,
					onChange: (e) => update("customAlertFontSize", Number(e.target.value)),
					className: "w-full accent-slate-900 h-2 bg-slate-200 rounded-lg cursor-pointer"
				})] })
			]
		}), /* @__PURE__ */ jsxs("div", {
			className: "space-y-4 rounded-2xl border border-slate-200 bg-slate-50/60 p-4 sm:p-5",
			children: [
				/* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-2 border-b border-slate-200 pb-2.5",
					children: [/* @__PURE__ */ jsx(Layers, { className: "h-4 w-4 text-blue-500" }), /* @__PURE__ */ jsx("h3", {
						className: "text-xs font-bold uppercase tracking-wider text-slate-800",
						children: "Category Title Appearance (Default)"
					})]
				}),
				/* @__PURE__ */ jsx("p", {
					className: "text-xs text-slate-500",
					children: "Controls how regular category headings (e.g. Country, Politics, Business, Sports) look on category pages when the alert is not rotating."
				}),
				/* @__PURE__ */ jsx(ColorOrGradientPicker, {
					title: "Category Heading Color & Gradient",
					subtitle: "Independent style for category header titles",
					color: settings.festiveCategoryTitleColor || "#000000",
					gradient: settings.festiveCategoryTitleGradient || "",
					onChangeColor: (hex) => {
						update("festiveCategoryTitleColor", hex);
						update("festiveCategoryTitleGradient", "");
					},
					onChangeGradient: (grad) => update("festiveCategoryTitleGradient", grad)
				})
			]
		})]
	});
}
//#endregion
//#region src/components/admin/settings/festive/FestivePreviewCard.tsx
function FestivePreviewCard({ settings, isFestiveEnabled, showCustomText, animNonce, customAlertText, categoryTitleStyle, alertTextStyle, badgeStyle, customAlertFontFamilyCss, rotationAnimStyle, triggerTestSwap }) {
	const hasAlertImage = Boolean(settings.festiveAlertImage);
	return /* @__PURE__ */ jsxs("div", {
		className: "lg:col-span-5 flex flex-col justify-between rounded-xl border border-slate-200 bg-slate-50/70 p-5",
		children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("div", {
			className: "flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-200",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "flex items-center gap-2",
				children: [/* @__PURE__ */ jsx("span", {
					className: "text-xs font-bold uppercase tracking-wider text-slate-500 whitespace-nowrap",
					children: "Live Animated Preview"
				}), /* @__PURE__ */ jsx("button", {
					type: "button",
					onClick: triggerTestSwap,
					className: "whitespace-nowrap inline-flex items-center justify-center px-2.5 py-1 text-[11px] font-bold text-slate-700 bg-white hover:bg-slate-100 rounded-md border border-slate-300 shadow-xs transition-colors shrink-0",
					children: "Test Swap"
				})]
			}), isFestiveEnabled ? /* @__PURE__ */ jsxs("span", {
				className: "whitespace-nowrap inline-flex items-center gap-1.5 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 shrink-0",
				children: [
					/* @__PURE__ */ jsx(RefreshCw, { className: "h-3 w-3 animate-spin" }),
					"Swapping every ",
					settings.topBarSwapDelay || 5,
					"s"
				]
			}) : /* @__PURE__ */ jsx("span", {
				className: "whitespace-nowrap inline-flex items-center gap-1 text-[10px] font-semibold text-slate-500 bg-slate-200/70 px-2 py-0.5 rounded-full border border-slate-300 shrink-0",
				children: "Rotation OFF"
			})]
		}), /* @__PURE__ */ jsxs("div", {
			className: "mt-4 space-y-4",
			children: [
				/* @__PURE__ */ jsxs("div", {
					className: "rounded-lg border border-slate-200 bg-white p-3 shadow-xs overflow-hidden",
					children: [/* @__PURE__ */ jsx("span", {
						className: "text-[10px] text-slate-400 font-medium block mb-1",
						children: "Top Bar Custom Alert Message:"
					}), /* @__PURE__ */ jsx("div", {
						className: "relative h-8 overflow-hidden flex items-center",
						children: /* @__PURE__ */ jsx("span", {
							className: "absolute inset-x-0 font-bold truncate inline-flex items-center gap-1.5",
							style: {
								...showCustomText ? alertTextStyle : {},
								...showCustomText ? {
									fontFamily: customAlertFontFamilyCss,
									fontSize: `${settings.customAlertFontSize || 14}px`
								} : {},
								...rotationAnimStyle
							},
							children: showCustomText ? hasAlertImage ? /* @__PURE__ */ jsx("img", {
								src: settings.festiveAlertImage,
								alt: "Alert",
								className: "h-4.5 w-auto max-w-[80px] object-contain shrink-0"
							}) : /* @__PURE__ */ jsx("span", { children: customAlertText }) : /* @__PURE__ */ jsx("span", { children: "DEL 165 AQI | MUM 82 AQI | KOL 145 AQI" })
						}, `topbar-${showCustomText ? "custom" : "default"}-${animNonce}`)
					})]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "rounded-lg border border-slate-200 bg-white p-4 shadow-xs overflow-hidden",
					children: [/* @__PURE__ */ jsx("span", {
						className: "text-[10px] text-slate-400 font-medium block mb-1",
						children: "Category Title Swap (Preserved Size):"
					}), /* @__PURE__ */ jsx("div", {
						className: "relative h-10 overflow-hidden flex items-center",
						children: /* @__PURE__ */ jsx("h1", {
							className: "absolute inset-x-0 font-serif text-3xl font-bold truncate inline-flex items-center gap-2",
							style: {
								...showCustomText ? alertTextStyle : categoryTitleStyle,
								...showCustomText ? { fontFamily: customAlertFontFamilyCss } : {},
								...rotationAnimStyle
							},
							children: showCustomText ? hasAlertImage ? /* @__PURE__ */ jsx("img", {
								src: settings.festiveAlertImage,
								alt: "Alert",
								className: "h-8 w-auto max-w-[140px] object-contain shrink-0"
							}) : /* @__PURE__ */ jsx("span", { children: customAlertText }) : /* @__PURE__ */ jsx("span", { children: "Country" })
						}, `cat-${showCustomText ? "custom" : "default"}-${animNonce}`)
					})]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "rounded-lg border border-slate-200 bg-white p-3 shadow-xs flex items-center justify-between",
					children: [/* @__PURE__ */ jsx("span", {
						className: "text-[10px] text-slate-400 font-medium",
						children: "Section Badge:"
					}), /* @__PURE__ */ jsx("span", {
						className: "px-2.5 py-1 text-xs font-black uppercase tracking-widest font-sans rounded-xs shadow-xs inline-flex items-center gap-1.5",
						style: {
							...badgeStyle,
							...rotationAnimStyle
						},
						children: showCustomText && hasAlertImage ? /* @__PURE__ */ jsx("img", {
							src: settings.festiveAlertImage,
							alt: "Alert",
							className: "h-4 w-auto max-w-[60px] object-contain shrink-0"
						}) : /* @__PURE__ */ jsx("span", { children: showCustomText ? customAlertText : "MARKETS" })
					}, `badge-${showCustomText ? "custom" : "default"}-${animNonce}`)]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "rounded-lg border border-slate-200 bg-white p-3 shadow-xs flex items-center justify-between",
					children: [/* @__PURE__ */ jsx("span", {
						className: "text-[10px] text-slate-400 font-medium",
						children: "SCAN ME Badge:"
					}), /* @__PURE__ */ jsxs("div", {
						className: "inline-flex items-center gap-2",
						children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h4", {
							className: "text-xs font-extrabold uppercase leading-tight tracking-tight inline-flex items-center gap-1.5",
							style: {
								...showCustomText ? alertTextStyle : categoryTitleStyle,
								...rotationAnimStyle
							},
							children: showCustomText && hasAlertImage ? /* @__PURE__ */ jsx("img", {
								src: settings.festiveAlertImage,
								alt: "Alert",
								className: "h-4 w-auto max-w-[60px] object-contain shrink-0"
							}) : /* @__PURE__ */ jsx("span", { children: showCustomText ? customAlertText : "SCAN ME" })
						}, `scan-${showCustomText ? "custom" : "default"}-${animNonce}`), !showCustomText && /* @__PURE__ */ jsx("p", {
							className: "text-[9px] font-medium text-slate-400 animate-in fade-in duration-300",
							children: "to read article"
						})] }), /* @__PURE__ */ jsx("div", {
							className: "h-7 w-7 rounded border border-slate-200 bg-slate-100 flex items-center justify-center text-[8px] font-bold text-slate-400",
							children: "QR"
						})]
					})]
				})
			]
		})] }), /* @__PURE__ */ jsxs("p", {
			className: "mt-4 text-[11px] text-slate-500 italic",
			children: [
				"✨ Every ",
				settings.topBarSwapDelay || 5,
				" seconds, text automatically rotates between default headers and your custom message! Default text color is black (#000000)."
			]
		})]
	});
}
//#endregion
//#region src/components/admin/settings/FestiveSettingsForm.tsx
function FestiveSettingsForm() {
	const [settings, setSettings] = useState(() => loadSettings());
	const [saved, setSaved] = useState(false);
	const [showCustomText, setShowCustomText] = useState(false);
	const [animNonce, setAnimNonce] = useState(0);
	const fontConfig = useFontConfig();
	const isFestiveEnabled = settings.festiveThemeEnabled !== false;
	useEffect(() => {
		setSettings(loadSettings());
	}, []);
	useEffect(() => {
		if (!isFestiveEnabled) {
			setShowCustomText(false);
			return;
		}
		const delay = (Number(settings.topBarSwapDelay) || 5) * 1e3;
		const interval = setInterval(() => {
			setShowCustomText((prev) => !prev);
		}, delay);
		return () => clearInterval(interval);
	}, [settings.topBarSwapDelay, isFestiveEnabled]);
	useEffect(() => {
		setAnimNonce((n) => n + 1);
	}, [settings.customAlertFontFamily, settings.customAlertFontSize]);
	useEffect(() => {
		setAnimNonce((n) => n + 1);
		if (isFestiveEnabled) setShowCustomText((prev) => !prev);
	}, [settings.customAlertAnimationStyle, isFestiveEnabled]);
	const update = (key, val) => {
		setSettings((prev) => ({
			...prev,
			[key]: val
		}));
	};
	const handleSave = () => {
		saveSettings(settings);
		setSaved(true);
		toast.success("Saved successfully");
		setTimeout(() => setSaved(false), 2e3);
	};
	const triggerTestSwap = () => {
		setAnimNonce((n) => n + 1);
		setShowCustomText((prev) => !prev);
	};
	const customAlertText = settings.topBarWeatherCustomText?.trim() || "Breaking News Alert";
	const resolvedCategoryGrad = settings.festiveCategoryTitleGradient && (FESTIVE_GRADIENT_MAP[settings.festiveCategoryTitleGradient] || (settings.festiveCategoryTitleGradient.includes("gradient(") ? settings.festiveCategoryTitleGradient : null));
	const categoryTitleStyle = resolvedCategoryGrad ? {
		backgroundImage: resolvedCategoryGrad,
		WebkitBackgroundClip: "text",
		WebkitTextFillColor: "transparent",
		backgroundClip: "text",
		display: "inline-block"
	} : { color: settings.festiveCategoryTitleColor || "#000000" };
	const resolvedAlertGrad = settings.topBarTextGradient && (FESTIVE_GRADIENT_MAP[settings.topBarTextGradient] || (settings.topBarTextGradient.includes("gradient(") ? settings.topBarTextGradient : null));
	const alertTextStyle = resolvedAlertGrad ? {
		backgroundImage: resolvedAlertGrad,
		WebkitBackgroundClip: "text",
		WebkitTextFillColor: "transparent",
		backgroundClip: "text",
		display: "inline-block"
	} : { color: settings.topBarTextColor || "#000000" };
	const selectedFont = fontConfig.fonts.find((f) => f.id === settings.customAlertFontFamily);
	const customAlertFontFamilyCss = selectedFont ? `"${selectedFont.family}", sans-serif` : "\"Inter\", system-ui, sans-serif";
	const rotationAnimStyle = ROTATION_ANIMATION_STYLE[settings.customAlertAnimationStyle || "slide-up"] || ROTATION_ANIMATION_STYLE["slide-up"];
	const badgeStyle = {
		backgroundColor: settings.festiveCategoryBadgeBgColor || "#000000",
		color: settings.festiveCategoryBadgeTextColor || "#FFFFFF"
	};
	return /* @__PURE__ */ jsxs("div", {
		className: "space-y-6 max-w-5xl mx-auto",
		children: [
			/* @__PURE__ */ jsx("style", { dangerouslySetInnerHTML: { __html: ROTATION_KEYFRAMES } }),
			/* @__PURE__ */ jsxs("section", {
				className: "rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-100 pb-4 mb-5",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-3",
							children: [/* @__PURE__ */ jsx("div", {
								className: "flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600 border border-amber-200 shrink-0",
								children: /* @__PURE__ */ jsx(Sparkles, { className: "h-5 w-5" })
							}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h2", {
								className: "text-base font-bold text-slate-800",
								children: "Festive Theme & Custom Alert Rotation"
							}), /* @__PURE__ */ jsx("p", {
								className: "text-xs text-slate-500",
								children: "Set custom alert message, rotation delay, text color, and gradient."
							})] })]
						}), /* @__PURE__ */ jsxs("button", {
							type: "button",
							onClick: handleSave,
							className: `inline-flex items-center justify-center gap-1.5 rounded-lg px-4 py-2 text-xs font-semibold text-white shadow-sm transition-all active:scale-95 shrink-0 self-start sm:self-auto ${saved ? "bg-emerald-600" : "bg-slate-900 hover:bg-slate-800"}`,
							children: [/* @__PURE__ */ jsx(Save, { className: "h-3.5 w-3.5" }), saved ? "Saved!" : "Save"]
						})]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 rounded-xl border border-slate-200 bg-slate-50/80 mb-6 transition-colors",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "space-y-0.5",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "flex items-center gap-2",
								children: [
									/* @__PURE__ */ jsx(Power, { className: `h-4 w-4 ${isFestiveEnabled ? "text-emerald-600" : "text-slate-400"}` }),
									/* @__PURE__ */ jsx("span", {
										className: "text-sm font-bold text-slate-800",
										children: "Festive Theme & Custom Alert Rotation"
									}),
									/* @__PURE__ */ jsx("span", {
										className: `inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${isFestiveEnabled ? "bg-emerald-100 text-emerald-800 border border-emerald-200" : "bg-slate-200 text-slate-600 border border-slate-300"}`,
										children: isFestiveEnabled ? "ON (Active)" : "OFF (Disabled)"
									})
								]
							}), /* @__PURE__ */ jsx("p", {
								className: "text-xs text-slate-500",
								children: "Turn ON to rotate custom alert messages across Top Bar, category headers, section badges, and QR cards. Turn OFF to display standard category titles only."
							})]
						}), /* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-2 shrink-0",
							children: [/* @__PURE__ */ jsx("span", {
								className: "text-xs font-semibold text-slate-600",
								children: isFestiveEnabled ? "Enabled" : "Disabled"
							}), /* @__PURE__ */ jsx("button", {
								type: "button",
								role: "switch",
								"aria-checked": isFestiveEnabled,
								onClick: () => update("festiveThemeEnabled", !isFestiveEnabled),
								className: `relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 ${isFestiveEnabled ? "bg-emerald-600" : "bg-slate-300"}`,
								children: /* @__PURE__ */ jsx("span", { className: `pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${isFestiveEnabled ? "translate-x-5" : "translate-x-0"}` })
							})]
						})]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "grid gap-8 lg:grid-cols-12",
						children: [/* @__PURE__ */ jsx(FestiveControls, {
							settings,
							update,
							fontConfig
						}), /* @__PURE__ */ jsx(FestivePreviewCard, {
							settings,
							isFestiveEnabled,
							showCustomText,
							animNonce,
							customAlertText,
							categoryTitleStyle,
							alertTextStyle,
							badgeStyle,
							customAlertFontFamilyCss,
							rotationAnimStyle,
							triggerTestSwap
						})]
					})
				]
			}),
			/* @__PURE__ */ jsx("div", {
				className: "sticky bottom-4 flex justify-end z-30 pointer-events-auto",
				children: /* @__PURE__ */ jsxs("button", {
					onClick: handleSave,
					className: `inline-flex items-center gap-2 rounded-full px-7 py-3 text-sm font-bold text-white shadow-xl transition-all active:scale-95 ${saved ? "bg-emerald-600 ring-4 ring-emerald-200" : "bg-slate-900 hover:bg-slate-800 ring-4 ring-slate-300/40"}`,
					children: [/* @__PURE__ */ jsx(Save, { className: "h-4 w-4" }), saved ? "Saved!" : "Save"]
				})
			})
		]
	});
}
//#endregion
export { FestiveSettingsForm };

//# sourceMappingURL=FestiveSettingsForm-DHdm4V97.js.map