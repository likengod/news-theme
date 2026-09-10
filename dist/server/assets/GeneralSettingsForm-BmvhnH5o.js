import { A as saveSettings, _ as loadSettings, t as cleanCopyright } from "./site-content-Bsi3qYPj.js";
import { a as LogoUploader } from "./SettingsHelpers-BJIYOCLZ.js";
import { useState } from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { Save } from "lucide-react";
import { toast } from "sonner";
//#region src/components/admin/settings/GeneralSettingsForm.tsx
var GROUPS = [
	{
		title: "Brand Information",
		fields: [
			{
				key: "siteName",
				label: "Site Name",
				placeholder: "News Timeline"
			},
			{
				key: "logoText",
				label: "Logo Text",
				placeholder: "News Timeline"
			},
			{
				key: "logoDisplayMode",
				label: "Brand Display Mode",
				select: true,
				options: [
					{
						value: "logo_only",
						label: "Logo Only"
					},
					{
						value: "text_only",
						label: "Text Only"
					},
					{
						value: "both",
						label: "Both (Logo + Text)"
					}
				]
			},
			{
				key: "tagline",
				label: "Tagline",
				placeholder: "Breaking News · Finance · Markets"
			},
			{
				key: "metaDescription",
				label: "SEO Meta Description",
				textarea: true,
				placeholder: "Independent newsroom..."
			}
		]
	},
	{
		title: "Contact Details",
		fields: [
			{
				key: "contactEmail",
				label: "Contact Email",
				placeholder: "hello@newstimeline.com"
			},
			{
				key: "contactPhone",
				label: "Contact Phone",
				placeholder: "+91 99999 99999"
			},
			{
				key: "address",
				label: "Office Address",
				textarea: true,
				placeholder: "Agartala, Tripura..."
			}
		]
	},
	{
		title: "Footer & Copyright",
		fields: [{
			key: "footerNote",
			label: "Footer Intro Text",
			textarea: true
		}, {
			key: "copyright",
			label: "Copyright Statement"
		}]
	}
];
function GeneralSettingsForm() {
	const [settings, setSettings] = useState(() => {
		const s = loadSettings();
		if (s.copyright) s.copyright = cleanCopyright(s.copyright);
		return s;
	});
	const [saved, setSaved] = useState(false);
	const update = (k, v) => setSettings((s) => ({
		...s,
		[k]: k === "copyright" && typeof v === "string" ? cleanCopyright(v) : v
	}));
	const handleSave = async () => {
		try {
			const cleaned = {
				...settings,
				copyright: cleanCopyright(settings.copyright)
			};
			await saveSettings(cleaned);
			setSettings(cleaned);
			setSaved(true);
			toast.success("General site settings saved to MySQL!");
			setTimeout(() => setSaved(false), 2e3);
		} catch (err) {
			console.error(err);
			toast.error(err.message || "Failed to save settings. Payload might be too large if logos are big.");
		}
	};
	return /* @__PURE__ */ jsxs("div", {
		className: "space-y-6",
		children: [
			GROUPS.map((grp) => /* @__PURE__ */ jsxs("section", {
				className: "rounded-xl border border-slate-200 bg-white p-5 shadow-sm",
				children: [
					/* @__PURE__ */ jsx("h2", {
						className: "mb-4 text-sm font-bold uppercase tracking-wider text-slate-700 border-b border-slate-100 pb-2",
						children: grp.title
					}),
					/* @__PURE__ */ jsx("div", {
						className: "grid gap-4 sm:grid-cols-2",
						children: grp.fields.map((f) => {
							const val = settings[f.key] || "";
							return /* @__PURE__ */ jsxs("div", {
								className: f.textarea ? "sm:col-span-2" : "",
								children: [
									/* @__PURE__ */ jsx("label", {
										className: "mb-1 block text-xs font-semibold text-slate-600",
										children: f.label
									}),
									f.textarea ? /* @__PURE__ */ jsx("textarea", {
										value: val,
										onChange: (e) => update(f.key, e.target.value),
										placeholder: f.placeholder,
										rows: 3,
										className: "w-full rounded-lg border border-slate-200 p-2.5 text-sm focus:border-slate-900 focus:outline-none"
									}) : f.select ? /* @__PURE__ */ jsx("select", {
										value: val,
										onChange: (e) => update(f.key, e.target.value),
										className: "h-10 w-full rounded-lg border border-slate-200 px-3 bg-white text-sm focus:border-slate-900 focus:outline-none",
										children: f.options?.map((opt) => /* @__PURE__ */ jsx("option", {
											value: opt.value,
											children: opt.label
										}, opt.value))
									}) : /* @__PURE__ */ jsx("input", {
										type: "text",
										value: val,
										onChange: (e) => update(f.key, e.target.value),
										placeholder: f.placeholder,
										className: "h-10 w-full rounded-lg border border-slate-200 px-3 text-sm focus:border-slate-900 focus:outline-none"
									}),
									f.hint && /* @__PURE__ */ jsx("p", {
										className: "mt-1 text-[11px] text-slate-400",
										children: f.hint
									})
								]
							}, f.key);
						})
					}),
					grp.title === "Brand Information" && /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsxs("div", {
						className: "mt-6 border-t border-slate-100 pt-6",
						children: [
							/* @__PURE__ */ jsxs("div", {
								className: "flex items-center justify-between mb-3",
								children: [/* @__PURE__ */ jsx("h3", {
									className: "text-xs font-bold uppercase tracking-wider text-slate-500",
									children: "Logo Text & Two-Tone Colors"
								}), /* @__PURE__ */ jsx("span", {
									className: "text-[11px] text-slate-400",
									children: "Customize each word and its color independently"
								})]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "mb-4 rounded-xl border border-slate-200 bg-slate-50/90 p-5 text-center shadow-inner",
								children: [/* @__PURE__ */ jsx("span", {
									className: "text-[10px] uppercase font-bold tracking-widest text-slate-400 block mb-2",
									children: "Live Header Preview"
								}), /* @__PURE__ */ jsxs("div", {
									className: "text-3xl sm:text-4xl md:text-5xl font-extrabold uppercase tracking-wide inline-block",
									style: {
										fontFamily: "\"Inter\", system-ui, sans-serif",
										letterSpacing: "0.05em"
									},
									children: [
										/* @__PURE__ */ jsx("span", {
											style: { color: settings.logoColorPrimary || "#000000" },
											children: settings.logoTextPrimary !== void 0 && settings.logoTextPrimary !== "" ? settings.logoTextPrimary : "NEWS"
										}),
										" ",
										/* @__PURE__ */ jsx("span", {
											style: { color: settings.logoColorSecondary || "#dc2626" },
											children: settings.logoTextSecondary !== void 0 && settings.logoTextSecondary !== "" ? settings.logoTextSecondary : "THEME"
										})
									]
								})]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "grid gap-4 sm:grid-cols-2",
								children: [/* @__PURE__ */ jsxs("div", {
									className: "rounded-lg border border-slate-200 bg-white p-3.5 space-y-2.5",
									children: [
										/* @__PURE__ */ jsxs("div", {
											className: "flex items-center justify-between",
											children: [/* @__PURE__ */ jsx("label", {
												className: "text-xs font-bold text-slate-700",
												children: "Part 1 Text (e.g. News)"
											}), /* @__PURE__ */ jsx("span", {
												className: "text-[10px] text-slate-400",
												children: "First Word"
											})]
										}),
										/* @__PURE__ */ jsx("input", {
											type: "text",
											value: settings.logoTextPrimary ?? "News",
											onChange: (e) => {
												const text = e.target.value;
												const nextSec = settings.logoTextSecondary ?? "Theme";
												update("logoTextPrimary", text);
												update("logoText", `${text} ${nextSec}`.trim());
											},
											placeholder: "News",
											className: "h-9 w-full rounded-md border border-slate-200 px-3 text-sm focus:border-slate-900 focus:outline-none"
										}),
										/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
											className: "text-[11px] font-semibold text-slate-500 block mb-1",
											children: "Part 1 Text Color"
										}), /* @__PURE__ */ jsxs("div", {
											className: "flex items-center gap-2",
											children: [
												/* @__PURE__ */ jsx("input", {
													type: "color",
													value: settings.logoColorPrimary && settings.logoColorPrimary.startsWith("#") ? settings.logoColorPrimary : "#000000",
													onChange: (e) => update("logoColorPrimary", e.target.value),
													className: "h-8 w-10 cursor-pointer rounded border border-slate-200 p-0.5"
												}),
												/* @__PURE__ */ jsx("input", {
													type: "text",
													value: settings.logoColorPrimary || "#000000",
													onChange: (e) => update("logoColorPrimary", e.target.value),
													placeholder: "#000000",
													className: "h-8 flex-1 rounded-md border border-slate-200 px-2.5 text-xs font-mono focus:border-slate-900 focus:outline-none"
												}),
												/* @__PURE__ */ jsx("button", {
													type: "button",
													onClick: () => update("logoColorPrimary", "#000000"),
													className: "px-2 py-1 text-[10px] rounded bg-slate-100 hover:bg-slate-200 text-slate-700",
													title: "Set Black",
													children: "Black"
												})
											]
										})] })
									]
								}), /* @__PURE__ */ jsxs("div", {
									className: "rounded-lg border border-slate-200 bg-white p-3.5 space-y-2.5",
									children: [
										/* @__PURE__ */ jsxs("div", {
											className: "flex items-center justify-between",
											children: [/* @__PURE__ */ jsx("label", {
												className: "text-xs font-bold text-slate-700",
												children: "Part 2 Text (e.g. Theme)"
											}), /* @__PURE__ */ jsx("span", {
												className: "text-[10px] text-slate-400",
												children: "Second Word"
											})]
										}),
										/* @__PURE__ */ jsx("input", {
											type: "text",
											value: settings.logoTextSecondary ?? "Theme",
											onChange: (e) => {
												const text = e.target.value;
												const nextPri = settings.logoTextPrimary ?? "News";
												update("logoTextSecondary", text);
												update("logoText", `${nextPri} ${text}`.trim());
											},
											placeholder: "Theme",
											className: "h-9 w-full rounded-md border border-slate-200 px-3 text-sm focus:border-slate-900 focus:outline-none"
										}),
										/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
											className: "text-[11px] font-semibold text-slate-500 block mb-1",
											children: "Part 2 Text Color"
										}), /* @__PURE__ */ jsxs("div", {
											className: "flex items-center gap-2",
											children: [
												/* @__PURE__ */ jsx("input", {
													type: "color",
													value: settings.logoColorSecondary && settings.logoColorSecondary.startsWith("#") ? settings.logoColorSecondary : "#dc2626",
													onChange: (e) => update("logoColorSecondary", e.target.value),
													className: "h-8 w-10 cursor-pointer rounded border border-slate-200 p-0.5"
												}),
												/* @__PURE__ */ jsx("input", {
													type: "text",
													value: settings.logoColorSecondary || "#dc2626",
													onChange: (e) => update("logoColorSecondary", e.target.value),
													placeholder: "#dc2626",
													className: "h-8 flex-1 rounded-md border border-slate-200 px-2.5 text-xs font-mono focus:border-slate-900 focus:outline-none"
												}),
												/* @__PURE__ */ jsx("button", {
													type: "button",
													onClick: () => update("logoColorSecondary", "#dc2626"),
													className: "px-2 py-1 text-[10px] rounded bg-red-50 hover:bg-red-100 text-red-600 font-semibold",
													title: "Set Red",
													children: "Red"
												})
											]
										})] })
									]
								})]
							})
						]
					}), /* @__PURE__ */ jsxs("div", {
						className: "mt-6 border-t border-slate-100 pt-6",
						children: [/* @__PURE__ */ jsx("h3", {
							className: "mb-4 text-xs font-bold uppercase tracking-wider text-slate-500",
							children: "Logo Images & Favicon"
						}), /* @__PURE__ */ jsxs("div", {
							className: "grid gap-3 grid-cols-2 md:grid-cols-3 lg:grid-cols-5",
							children: [
								/* @__PURE__ */ jsx(LogoUploader, {
									compact: true,
									label: "Site logo (Day)",
									value: settings.logoLight,
									usage: "site-logo",
									recommendedSize: "320×80 px",
									onChange: (v) => update("logoLight", v)
								}),
								/* @__PURE__ */ jsx(LogoUploader, {
									compact: true,
									label: "Site logo (Night)",
									value: settings.logoDark,
									usage: "site-logo",
									dark: true,
									recommendedSize: "320×80 px",
									onChange: (v) => update("logoDark", v)
								}),
								/* @__PURE__ */ jsx(LogoUploader, {
									compact: true,
									label: "Footer logo (Day)",
									value: settings.footerLogoLight,
									usage: "site-logo",
									recommendedSize: "320×80 px",
									onChange: (v) => update("footerLogoLight", v)
								}),
								/* @__PURE__ */ jsx(LogoUploader, {
									compact: true,
									label: "Footer logo (Night)",
									value: settings.footerLogoDark,
									usage: "site-logo",
									dark: true,
									recommendedSize: "320×80 px",
									onChange: (v) => update("footerLogoDark", v)
								}),
								/* @__PURE__ */ jsx(LogoUploader, {
									compact: true,
									label: "Favicon",
									value: settings.favicon,
									usage: "site-favicon",
									recommendedSize: "64×64 px",
									onChange: (v) => update("favicon", v)
								})
							]
						})]
					})] })
				]
			}, grp.title)),
			"      ",
			/* @__PURE__ */ jsx("div", {
				className: "sticky bottom-4 flex justify-end",
				children: /* @__PURE__ */ jsxs("button", {
					onClick: handleSave,
					className: `inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-semibold text-white shadow-lg transition-colors ${saved ? "bg-emerald-600" : "bg-slate-900 hover:bg-slate-800"}`,
					children: [/* @__PURE__ */ jsx(Save, { className: "h-4 w-4" }), saved ? "Saved to MySQL!" : "Save General Settings"]
				})
			})
		]
	});
}
//#endregion
export { GeneralSettingsForm };
