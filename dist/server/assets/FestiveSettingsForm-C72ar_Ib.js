import { A as saveSettings, _ as loadSettings } from "./site-content-Cam4-nDq.js";
import { i as useFontConfig } from "./AdSettingsContext-CI0-3vTF.js";
import { useEffect, useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
import { Clock, Power, RefreshCw, RotateCcw, Save, Sparkles } from "lucide-react";
import { toast } from "sonner";
//#region src/components/admin/settings/FestiveSettingsForm.tsx
var FESTIVE_GRADIENT_MAP = {
	"indian-flag": "linear-gradient(to right, #FF9933, #000080, #138808)",
	"diwali": "linear-gradient(to right, #FF8008, #FFC837, #FF007F, #7F00FF)",
	"sunset": "linear-gradient(to right, #F5576C, #F093FB)",
	"neon": "linear-gradient(to right, #FF007F, #7F00FF, #00F0FF)",
	"ocean": "linear-gradient(to right, #00c6ff, #0072ff)",
	"forest": "linear-gradient(to right, #11998e, #38ef7d)"
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
	"fade": { animation: "rot-fade        0.35s ease both" },
	"zoom": { animation: "rot-zoom        0.35s cubic-bezier(0.34,1.56,0.64,1) both" },
	"flip": {
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
	}
];
function FestiveSettingsForm() {
	const [settings, setSettings] = useState(() => loadSettings());
	const [saved, setSaved] = useState(false);
	const [showCustomText, setShowCustomText] = useState(false);
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
	const update = (key, val) => {
		setSettings((prev) => ({
			...prev,
			[key]: val
		}));
	};
	const handleSave = () => {
		saveSettings(settings);
		setSaved(true);
		toast.success("Festive & Custom Alert settings saved!");
		setTimeout(() => setSaved(false), 2e3);
	};
	const customAlertText = settings.topBarWeatherCustomText?.trim() || "Breaking News Alert";
	const activeGradient = settings.topBarTextGradient || settings.festiveCategoryTitleGradient;
	const activeColor = settings.festiveCategoryTitleColor || settings.topBarTextColor || "#000000";
	const selectedFont = fontConfig.fonts.find((f) => f.id === settings.customAlertFontFamily);
	const customAlertFontFamilyCss = selectedFont ? `"${selectedFont.family}", sans-serif` : "\"Inter\", system-ui, sans-serif";
	const rotationAnimStyle = ROTATION_ANIMATION_STYLE[settings.customAlertAnimationStyle || "slide-up"] || ROTATION_ANIMATION_STYLE["slide-up"];
	const textStyle = activeGradient && FESTIVE_GRADIENT_MAP[activeGradient] ? {
		backgroundImage: FESTIVE_GRADIENT_MAP[activeGradient],
		WebkitBackgroundClip: "text",
		WebkitTextFillColor: "transparent",
		backgroundClip: "text",
		display: "inline-block"
	} : { color: activeColor };
	const badgeStyle = activeGradient && FESTIVE_GRADIENT_MAP[activeGradient] ? {
		backgroundColor: settings.festiveCategoryBadgeBgColor || "#000000",
		backgroundImage: FESTIVE_GRADIENT_MAP[activeGradient],
		WebkitBackgroundClip: "text",
		WebkitTextFillColor: "transparent",
		backgroundClip: "text"
	} : {
		backgroundColor: settings.festiveCategoryBadgeBgColor || "#000000",
		color: settings.festiveCategoryBadgeTextColor || "#FFFFFF"
	};
	const [animNonce, setAnimNonce] = useState(0);
	useEffect(() => {
		setAnimNonce((n) => n + 1);
	}, [settings.customAlertFontFamily, settings.customAlertFontSize]);
	useEffect(() => {
		setAnimNonce((n) => n + 1);
		if (isFestiveEnabled) setShowCustomText((prev) => !prev);
	}, [settings.customAlertAnimationStyle, isFestiveEnabled]);
	const triggerTestSwap = () => {
		setAnimNonce((n) => n + 1);
		setShowCustomText((prev) => !prev);
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
								children: "Set custom alert message, rotation delay, text color, and gradient (Default color: #000000 Black)."
							})] })]
						}), /* @__PURE__ */ jsxs("button", {
							type: "button",
							onClick: handleSave,
							className: `inline-flex items-center justify-center gap-1.5 rounded-lg px-4 py-2 text-xs font-semibold text-white shadow-sm transition-all active:scale-95 shrink-0 self-start sm:self-auto ${saved ? "bg-emerald-600" : "bg-slate-900 hover:bg-slate-800"}`,
							children: [/* @__PURE__ */ jsx(Save, { className: "h-3.5 w-3.5" }), saved ? "Saved to MySQL!" : "Save Changes"]
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
						children: [/* @__PURE__ */ jsxs("div", {
							className: "lg:col-span-7 space-y-5",
							children: [
								/* @__PURE__ */ jsxs("div", { children: [
									/* @__PURE__ */ jsx("label", {
										className: "mb-1 block text-xs font-semibold text-slate-700",
										children: "Custom Alert / Title Message"
									}),
									/* @__PURE__ */ jsx("input", {
										type: "text",
										value: settings.topBarWeatherCustomText || "",
										onChange: (e) => {
											update("topBarWeatherCustomText", e.target.value);
											update("festiveScanMeCustomText", e.target.value);
										},
										placeholder: "e.g. ddddd or Breaking News Alert",
										className: "h-10 w-full rounded-lg border border-slate-200 px-3 text-sm focus:border-slate-900 focus:outline-none"
									}),
									/* @__PURE__ */ jsx("p", {
										className: "mt-1 text-[11px] text-slate-400",
										children: "This text rotates every few seconds with section titles & alert bars."
									})
								] }),
								/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
									className: "mb-1 block text-xs font-semibold text-slate-700",
									children: "Rotate Delay (Seconds)"
								}), /* @__PURE__ */ jsxs("div", {
									className: "flex items-center gap-2",
									children: [
										/* @__PURE__ */ jsx(Clock, { className: "h-4 w-4 text-slate-400" }),
										/* @__PURE__ */ jsx("input", {
											type: "number",
											value: settings.topBarSwapDelay || 5,
											onChange: (e) => update("topBarSwapDelay", Number(e.target.value)),
											placeholder: "5",
											className: "h-10 w-32 rounded-lg border border-slate-200 px-3 text-sm focus:border-slate-900 focus:outline-none font-mono"
										}),
										/* @__PURE__ */ jsx("span", {
											className: "text-xs text-slate-500 font-medium",
											children: "seconds"
										})
									]
								})] }),
								/* @__PURE__ */ jsxs("div", { children: [
									/* @__PURE__ */ jsx("label", {
										className: "mb-1 block text-xs font-semibold text-slate-700",
										children: "Text Color (Default: #000000 Black)"
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "flex items-center gap-2 mb-2",
										children: [
											/* @__PURE__ */ jsx("input", {
												type: "color",
												value: activeColor.startsWith("#") ? activeColor : "#000000",
												onChange: (e) => {
													update("festiveCategoryTitleColor", e.target.value);
													update("topBarTextColor", e.target.value);
												},
												className: "h-10 w-12 cursor-pointer rounded border border-slate-200 p-1"
											}),
											/* @__PURE__ */ jsx("input", {
												type: "text",
												value: settings.festiveCategoryTitleColor || settings.topBarTextColor || "",
												onChange: (e) => {
													update("festiveCategoryTitleColor", e.target.value);
													update("topBarTextColor", e.target.value);
												},
												placeholder: "#000000",
												className: "h-10 flex-1 rounded-lg border border-slate-200 px-3 text-sm focus:border-slate-900 focus:outline-none font-mono"
											}),
											(settings.festiveCategoryTitleColor || settings.topBarTextColor) && /* @__PURE__ */ jsxs("button", {
												type: "button",
												onClick: () => {
													update("festiveCategoryTitleColor", "");
													update("topBarTextColor", "");
													update("festiveCategoryTitleGradient", "");
													update("topBarTextGradient", "");
												},
												className: "h-10 rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-xs whitespace-nowrap shrink-0 inline-flex items-center gap-1.5",
												children: [/* @__PURE__ */ jsx(RotateCcw, { className: "h-3.5 w-3.5 text-slate-400" }), "Reset (Black)"]
											})
										]
									}),
									/* @__PURE__ */ jsx("div", {
										className: "flex flex-wrap gap-2",
										children: PRESET_COLORS.map((p) => {
											return /* @__PURE__ */ jsxs("button", {
												type: "button",
												onClick: () => {
													update("festiveCategoryTitleColor", p.hex);
													update("topBarTextColor", p.hex);
													update("festiveCategoryTitleGradient", "");
													update("topBarTextGradient", "");
												},
												className: `inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-all shadow-xs whitespace-nowrap ${(settings.festiveCategoryTitleColor === p.hex || settings.topBarTextColor === p.hex) && !activeGradient ? "border-2 border-slate-900 bg-slate-900 text-white shadow-sm ring-2 ring-slate-400/20" : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300"}`,
												children: [/* @__PURE__ */ jsx("span", {
													className: "h-2.5 w-2.5 rounded-full border border-black/10 shrink-0",
													style: { backgroundColor: p.hex }
												}), p.name]
											}, p.hex);
										})
									})
								] }),
								/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
									className: "mb-1 block text-xs font-semibold text-slate-700",
									children: "Prebuilt Festive Text Gradient (Optional)"
								}), /* @__PURE__ */ jsxs("select", {
									value: settings.festiveCategoryTitleGradient || settings.topBarTextGradient || "",
									onChange: (e) => {
										update("festiveCategoryTitleGradient", e.target.value);
										update("topBarTextGradient", e.target.value);
									},
									className: "h-10 w-full rounded-lg border border-slate-200 px-3 bg-white text-sm focus:border-slate-900 focus:outline-none",
									children: [
										/* @__PURE__ */ jsx("option", {
											value: "",
											children: "None (Use Standard Solid Black / Color)"
										}),
										/* @__PURE__ */ jsx("option", {
											value: "indian-flag",
											children: "🇮🇳 Indian Flag (Saffron, Navy Blue, Green)"
										}),
										/* @__PURE__ */ jsx("option", {
											value: "diwali",
											children: "🪔 Diwali Festive (Gold, Orange, Magenta)"
										}),
										/* @__PURE__ */ jsx("option", {
											value: "sunset",
											children: "🌄 Sunset (Pink to Purple)"
										}),
										/* @__PURE__ */ jsx("option", {
											value: "neon",
											children: "⚡ Neon Glow (Magenta, Purple, Cyan)"
										}),
										/* @__PURE__ */ jsx("option", {
											value: "ocean",
											children: "🌊 Ocean Breeze (Cyan to Blue)"
										}),
										/* @__PURE__ */ jsx("option", {
											value: "forest",
											children: "🌲 Forest Canopy (Teal to Emerald)"
										})
									]
								})] }),
								/* @__PURE__ */ jsxs("div", { children: [
									/* @__PURE__ */ jsx("label", {
										className: "mb-1 block text-xs font-semibold text-slate-700",
										children: "Text Rotation Style"
									}),
									/* @__PURE__ */ jsxs("select", {
										value: settings.customAlertAnimationStyle || "slide-up",
										onChange: (e) => update("customAlertAnimationStyle", e.target.value),
										className: "h-10 w-full rounded-lg border border-slate-200 px-3 bg-white text-sm focus:border-slate-900 focus:outline-none",
										children: [
											/* @__PURE__ */ jsx("option", {
												value: "slide-up",
												children: "⬆️ Slide Up (Ticker / News Style)"
											}),
											/* @__PURE__ */ jsx("option", {
												value: "slide-down",
												children: "⬇️ Slide Down (Reveal from Top)"
											}),
											/* @__PURE__ */ jsx("option", {
												value: "slide-left",
												children: "⬅️ Slide Left (Push from Right)"
											}),
											/* @__PURE__ */ jsx("option", {
												value: "slide-right",
												children: "➡️ Slide Right (Push from Left)"
											}),
											/* @__PURE__ */ jsx("option", {
												value: "fade",
												children: "✨ Smooth Fade (Cross Fade)"
											}),
											/* @__PURE__ */ jsx("option", {
												value: "zoom",
												children: "🔍 Zoom Scale In"
											}),
											/* @__PURE__ */ jsx("option", {
												value: "flip",
												children: "🔄 3D Flip Swap"
											})
										]
									}),
									/* @__PURE__ */ jsx("p", {
										className: "mt-1 text-[11px] text-slate-400",
										children: "Controls how the text ticker rotates between Category Title and Custom Alert message."
									})
								] }),
								/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
									className: "mb-1 block text-xs font-semibold text-slate-700",
									children: "Font Family (Custom Alert / Title Message ONLY)"
								}), /* @__PURE__ */ jsxs("select", {
									value: settings.customAlertFontFamily || "",
									onChange: (e) => update("customAlertFontFamily", e.target.value),
									className: "h-10 w-full rounded-lg border border-slate-200 px-3 bg-white text-sm focus:border-slate-900 focus:outline-none",
									children: [/* @__PURE__ */ jsx("option", {
										value: "",
										children: "Default System Font (Inter)"
									}), fontConfig.fonts.map((f) => /* @__PURE__ */ jsxs("option", {
										value: f.id,
										children: [
											f.name,
											" ",
											f.source === "google" ? "(Google Fonts)" : f.source === "upload" ? "(Uploaded)" : ""
										]
									}, f.id))]
								})] }),
								/* @__PURE__ */ jsxs("div", { children: [
									/* @__PURE__ */ jsxs("div", {
										className: "flex items-center justify-between mb-1",
										children: [/* @__PURE__ */ jsx("label", {
											className: "text-xs font-semibold text-slate-700",
											children: "Responsive Text Size (Custom Alert ONLY, Except Category Title)"
										}), /* @__PURE__ */ jsxs("span", {
											className: "text-xs font-mono font-bold text-slate-900",
											children: [settings.customAlertFontSize || 14, "px"]
										})]
									}),
									/* @__PURE__ */ jsx("input", {
										type: "range",
										min: 11,
										max: 36,
										step: 1,
										value: settings.customAlertFontSize || 14,
										onChange: (e) => update("customAlertFontSize", Number(e.target.value)),
										className: "w-full accent-slate-900 h-2 bg-slate-200 rounded-lg cursor-pointer"
									}),
									/* @__PURE__ */ jsx("p", {
										className: "mt-1 text-[11px] text-slate-400",
										children: "Increases or decreases text size specifically for Custom Alert / Weather Title Message (Category Title size is preserved)."
									})
								] })
							]
						}), /* @__PURE__ */ jsxs("div", {
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
												className: "absolute inset-x-0 font-bold truncate",
												style: {
													...showCustomText ? textStyle : {},
													...showCustomText ? {
														fontFamily: customAlertFontFamilyCss,
														fontSize: `${settings.customAlertFontSize || 14}px`
													} : {},
													...rotationAnimStyle
												},
												children: showCustomText ? customAlertText : "DEL 165 AQI | MUM 82 AQI | KOL 145 AQI"
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
												className: "absolute inset-x-0 font-serif text-3xl font-bold truncate",
												style: {
													...textStyle,
													...showCustomText ? { fontFamily: customAlertFontFamilyCss } : {},
													...rotationAnimStyle
												},
												children: showCustomText ? customAlertText : "Country"
											}, `cat-${showCustomText ? "custom" : "default"}-${animNonce}`)
										})]
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "rounded-lg border border-slate-200 bg-white p-3 shadow-xs flex items-center justify-between",
										children: [/* @__PURE__ */ jsx("span", {
											className: "text-[10px] text-slate-400 font-medium",
											children: "Section Badge:"
										}), /* @__PURE__ */ jsx("span", {
											className: "px-2.5 py-1 text-xs font-black uppercase tracking-widest font-sans rounded-xs shadow-xs",
											style: {
												...badgeStyle,
												...rotationAnimStyle
											},
											children: showCustomText ? customAlertText : "MARKETS"
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
												className: "text-xs font-extrabold uppercase leading-tight tracking-tight",
												style: {
													...textStyle,
													...rotationAnimStyle
												},
												children: showCustomText ? customAlertText : "SCAN ME"
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
									"âœ¨ Every ",
									settings.topBarSwapDelay || 5,
									" seconds, text automatically rotates between default headers and your custom message! Default text color is black (#000000)."
								]
							})]
						})]
					})
				]
			}),
			/* @__PURE__ */ jsx("div", {
				className: "sticky bottom-4 flex justify-end z-30 pointer-events-auto",
				children: /* @__PURE__ */ jsxs("button", {
					onClick: handleSave,
					className: `inline-flex items-center gap-2 rounded-full px-7 py-3 text-sm font-bold text-white shadow-xl transition-all active:scale-95 ${saved ? "bg-emerald-600 ring-4 ring-emerald-200" : "bg-slate-900 hover:bg-slate-800 ring-4 ring-slate-300/40"}`,
					children: [/* @__PURE__ */ jsx(Save, { className: "h-4 w-4" }), saved ? "Saved to MySQL!" : "Save Festive & Alert Settings"]
				})
			})
		]
	});
}
//#endregion
export { FestiveSettingsForm };
