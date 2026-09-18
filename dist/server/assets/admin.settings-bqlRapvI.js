import { a as saveSettings, i as loadSettings, t as cleanCopyright } from "./site-settings-DsincBO4.js";
import { a as useSiteSettings } from "./AdSettingsContext-BlB9C6Qc.js";
import { a as LogoUploader } from "./SettingsHelpers-BiLtbvpg.js";
import { t as Route } from "./admin.settings-DGBx_I86.js";
import { Suspense, lazy, useEffect, useState } from "react";
import { useNavigate, useRouter } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { BarChart3, DatabaseBackup, Globe, Link2, Lock, Mail, Save, ShieldCheck, Sparkles, Type, Zap } from "lucide-react";
import { toast } from "sonner";
//#region src/components/admin/settings/general/BrandInfoSection.tsx
function BrandInfoSection({ settings, update }) {
	return /* @__PURE__ */ jsxs("section", {
		className: "rounded-xl border border-slate-200 bg-white p-5 shadow-sm",
		children: [
			/* @__PURE__ */ jsx("h2", {
				className: "mb-4 text-sm font-bold uppercase tracking-wider text-slate-700 border-b border-slate-100 pb-2",
				children: "Brand Information"
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "grid gap-4 sm:grid-cols-2",
				children: [
					/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
						htmlFor: "siteName",
						className: "mb-1 block text-xs font-semibold text-slate-600",
						children: "Site Name"
					}), /* @__PURE__ */ jsx("input", {
						id: "siteName",
						name: "siteName",
						type: "text",
						value: settings.siteName || "",
						onChange: (e) => {
							const val = e.target.value;
							update("siteName", val);
							const curLogo = settings.logoText || "";
							if (!curLogo || curLogo === settings.siteName || curLogo.toLowerCase().includes("news theme") || curLogo.toLowerCase().includes("news timeline")) {
								update("logoText", val);
								const parts = val.trim().split(/\s+/);
								update("logoTextPrimary", parts[0] || "");
								update("logoTextSecondary", parts.slice(1).join(" "));
							}
						},
						placeholder: "Today Tripura",
						className: "h-10 w-full rounded-lg border border-slate-200 px-3 text-sm focus:border-slate-900 focus:outline-none"
					})] }),
					/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
						htmlFor: "logoText",
						className: "mb-1 block text-xs font-semibold text-slate-600",
						children: "Logo Text"
					}), /* @__PURE__ */ jsx("input", {
						id: "logoText",
						name: "logoText",
						type: "text",
						value: settings.logoText || "",
						onChange: (e) => {
							const val = e.target.value;
							update("logoText", val);
							const parts = val.trim().split(/\s+/);
							update("logoTextPrimary", parts[0] || "");
							update("logoTextSecondary", parts.slice(1).join(" "));
							const curName = settings.siteName || "";
							if (!curName || curName.toLowerCase().includes("news theme") || curName.toLowerCase().includes("news timeline")) update("siteName", val);
						},
						placeholder: "Today Tripura",
						className: "h-10 w-full rounded-lg border border-slate-200 px-3 text-sm focus:border-slate-900 focus:outline-none"
					})] }),
					/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
						htmlFor: "logoDisplayMode",
						className: "mb-1 block text-xs font-semibold text-slate-600",
						children: "Brand Display Mode"
					}), /* @__PURE__ */ jsxs("select", {
						id: "logoDisplayMode",
						name: "logoDisplayMode",
						value: settings.logoDisplayMode || "both",
						onChange: (e) => update("logoDisplayMode", e.target.value),
						className: "h-10 w-full rounded-lg border border-slate-200 px-3 bg-white text-sm focus:border-slate-900 focus:outline-none",
						children: [
							/* @__PURE__ */ jsx("option", {
								value: "logo_only",
								children: "Logo Only"
							}),
							/* @__PURE__ */ jsx("option", {
								value: "text_only",
								children: "Text Only"
							}),
							/* @__PURE__ */ jsx("option", {
								value: "both",
								children: "Both (Logo + Text)"
							})
						]
					})] }),
					/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
						htmlFor: "tagline",
						className: "mb-1 block text-xs font-semibold text-slate-600",
						children: "Tagline"
					}), /* @__PURE__ */ jsx("input", {
						id: "tagline",
						name: "tagline",
						type: "text",
						value: settings.tagline || "",
						onChange: (e) => update("tagline", e.target.value),
						placeholder: "Breaking News · Finance · Markets",
						className: "h-10 w-full rounded-lg border border-slate-200 px-3 text-sm focus:border-slate-900 focus:outline-none"
					})] }),
					/* @__PURE__ */ jsxs("div", {
						className: "sm:col-span-2",
						children: [/* @__PURE__ */ jsx("label", {
							htmlFor: "metaDescription",
							className: "mb-1 block text-xs font-semibold text-slate-600",
							children: "SEO Meta Description"
						}), /* @__PURE__ */ jsx("textarea", {
							id: "metaDescription",
							name: "metaDescription",
							value: settings.metaDescription || "",
							onChange: (e) => update("metaDescription", e.target.value),
							placeholder: "Independent newsroom...",
							rows: 3,
							className: "w-full rounded-lg border border-slate-200 p-2.5 text-sm focus:border-slate-900 focus:outline-none"
						})]
					})
				]
			}),
			/* @__PURE__ */ jsxs("div", {
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
										htmlFor: "logoTextPrimary",
										className: "text-xs font-bold text-slate-700",
										children: "Part 1 Text (e.g. News)"
									}), /* @__PURE__ */ jsx("span", {
										className: "text-[10px] text-slate-400",
										children: "First Word"
									})]
								}),
								/* @__PURE__ */ jsx("input", {
									id: "logoTextPrimary",
									name: "logoTextPrimary",
									type: "text",
									value: settings.logoTextPrimary !== void 0 ? settings.logoTextPrimary : settings.logoText ? settings.logoText.split(" ")[0] : "Today",
									onChange: (e) => {
										const text = e.target.value;
										const nextSec = settings.logoTextSecondary !== void 0 ? settings.logoTextSecondary : settings.logoText && settings.logoText.split(" ").length > 1 ? settings.logoText.split(" ").slice(1).join(" ") : "";
										update("logoTextPrimary", text);
										update("logoText", `${text} ${nextSec}`.trim());
									},
									placeholder: "Today",
									className: "h-9 w-full rounded-md border border-slate-200 px-3 text-sm focus:border-slate-900 focus:outline-none"
								}),
								/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
									htmlFor: "logoColorPrimary",
									className: "text-[11px] font-semibold text-slate-500 block mb-1",
									children: "Part 1 Text Color"
								}), /* @__PURE__ */ jsxs("div", {
									className: "flex items-center gap-2",
									children: [
										/* @__PURE__ */ jsx("input", {
											id: "logoColorPrimary",
											name: "logoColorPrimary",
											"aria-label": "Part 1 color picker",
											type: "color",
											value: settings.logoColorPrimary && settings.logoColorPrimary.startsWith("#") ? settings.logoColorPrimary : "#000000",
											onChange: (e) => update("logoColorPrimary", e.target.value),
											className: "h-8 w-10 cursor-pointer rounded border border-slate-200 p-0.5"
										}),
										/* @__PURE__ */ jsx("input", {
											id: "logoColorPrimaryHex",
											name: "logoColorPrimaryHex",
											"aria-label": "Part 1 color hex value",
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
										htmlFor: "logoTextSecondary",
										className: "text-xs font-bold text-slate-700",
										children: "Part 2 Text (e.g. Theme)"
									}), /* @__PURE__ */ jsx("span", {
										className: "text-[10px] text-slate-400",
										children: "Second Word"
									})]
								}),
								/* @__PURE__ */ jsx("input", {
									id: "logoTextSecondary",
									name: "logoTextSecondary",
									type: "text",
									value: settings.logoTextSecondary !== void 0 ? settings.logoTextSecondary : settings.logoText && settings.logoText.split(" ").length > 1 ? settings.logoText.split(" ").slice(1).join(" ") : "Tripura",
									onChange: (e) => {
										const text = e.target.value;
										const nextPri = settings.logoTextPrimary !== void 0 ? settings.logoTextPrimary : settings.logoText ? settings.logoText.split(" ")[0] : "Today";
										update("logoTextSecondary", text);
										update("logoText", `${nextPri} ${text}`.trim());
									},
									placeholder: "Tripura",
									className: "h-9 w-full rounded-md border border-slate-200 px-3 text-sm focus:border-slate-900 focus:outline-none"
								}),
								/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
									htmlFor: "logoColorSecondary",
									className: "text-[11px] font-semibold text-slate-500 block mb-1",
									children: "Part 2 Text Color"
								}), /* @__PURE__ */ jsxs("div", {
									className: "flex items-center gap-2",
									children: [
										/* @__PURE__ */ jsx("input", {
											id: "logoColorSecondary",
											name: "logoColorSecondary",
											"aria-label": "Part 2 color picker",
											type: "color",
											value: settings.logoColorSecondary && settings.logoColorSecondary.startsWith("#") ? settings.logoColorSecondary : "#dc2626",
											onChange: (e) => update("logoColorSecondary", e.target.value),
											className: "h-8 w-10 cursor-pointer rounded border border-slate-200 p-0.5"
										}),
										/* @__PURE__ */ jsx("input", {
											id: "logoColorSecondaryHex",
											name: "logoColorSecondaryHex",
											"aria-label": "Part 2 color hex value",
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
			})
		]
	});
}
//#endregion
//#region src/components/admin/settings/general/LogoUploadersSection.tsx
function LogoUploadersSection({ settings, update }) {
	return /* @__PURE__ */ jsxs("section", {
		className: "rounded-xl border border-slate-200 bg-white p-5 shadow-sm",
		children: [/* @__PURE__ */ jsx("h2", {
			className: "mb-4 text-sm font-bold uppercase tracking-wider text-slate-700 border-b border-slate-100 pb-2",
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
	});
}
//#endregion
//#region src/components/admin/settings/general/ContactDetailsSection.tsx
function ContactDetailsSection({ settings, update }) {
	return /* @__PURE__ */ jsxs("section", {
		className: "rounded-xl border border-slate-200 bg-white p-5 shadow-sm",
		children: [/* @__PURE__ */ jsx("h2", {
			className: "mb-4 text-sm font-bold uppercase tracking-wider text-slate-700 border-b border-slate-100 pb-2",
			children: "Contact Details"
		}), /* @__PURE__ */ jsxs("div", {
			className: "grid gap-4 sm:grid-cols-2",
			children: [
				/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
					htmlFor: "contactEmail",
					className: "mb-1 block text-xs font-semibold text-slate-600",
					children: "Contact Email"
				}), /* @__PURE__ */ jsx("input", {
					id: "contactEmail",
					name: "contactEmail",
					type: "email",
					value: settings.contactEmail || "",
					onChange: (e) => update("contactEmail", e.target.value),
					placeholder: "hello@newstimeline.com",
					className: "h-10 w-full rounded-lg border border-slate-200 px-3 text-sm focus:border-slate-900 focus:outline-none"
				})] }),
				/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
					htmlFor: "contactPhone",
					className: "mb-1 block text-xs font-semibold text-slate-600",
					children: "Contact Phone"
				}), /* @__PURE__ */ jsx("input", {
					id: "contactPhone",
					name: "contactPhone",
					type: "text",
					value: settings.contactPhone || "",
					onChange: (e) => update("contactPhone", e.target.value),
					placeholder: "+91 99999 99999",
					className: "h-10 w-full rounded-lg border border-slate-200 px-3 text-sm focus:border-slate-900 focus:outline-none"
				})] }),
				/* @__PURE__ */ jsxs("div", {
					className: "sm:col-span-2",
					children: [/* @__PURE__ */ jsx("label", {
						htmlFor: "officeAddress",
						className: "mb-1 block text-xs font-semibold text-slate-600",
						children: "Office Address"
					}), /* @__PURE__ */ jsx("textarea", {
						id: "officeAddress",
						name: "officeAddress",
						value: settings.address || "",
						onChange: (e) => update("address", e.target.value),
						placeholder: "Agartala, Tripura...",
						rows: 3,
						className: "w-full rounded-lg border border-slate-200 p-2.5 text-sm focus:border-slate-900 focus:outline-none"
					})]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "sm:col-span-2 pt-4 border-t border-slate-200/80",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "mb-3 flex items-center gap-2",
							children: [/* @__PURE__ */ jsx(Mail, { className: "h-4 w-4 text-slate-600" }), /* @__PURE__ */ jsx("h3", {
								className: "text-xs font-bold uppercase tracking-wider text-slate-700",
								children: "Desk & Department Emails (Contact Page)"
							})]
						}),
						/* @__PURE__ */ jsxs("p", {
							className: "mb-4 text-xs text-slate-500",
							children: [
								"These email addresses appear under the ",
								/* @__PURE__ */ jsx("strong", { children: "DESKS" }),
								" section on the public ",
								/* @__PURE__ */ jsx("code", { children: "/contact" }),
								" page."
							]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "grid gap-3 sm:grid-cols-2",
							children: [
								/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
									htmlFor: "emailNewsTips",
									className: "mb-1 block text-xs font-semibold text-slate-600",
									children: "News Tips Email"
								}), /* @__PURE__ */ jsx("input", {
									id: "emailNewsTips",
									name: "emailNewsTips",
									type: "email",
									value: settings.emailNewsTips || "",
									onChange: (e) => update("emailNewsTips", e.target.value),
									placeholder: "tips@northeasttimeline.com",
									className: "h-10 w-full rounded-lg border border-slate-200 px-3 text-sm focus:border-slate-900 focus:outline-none"
								})] }),
								/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
									htmlFor: "emailAdvertising",
									className: "mb-1 block text-xs font-semibold text-slate-600",
									children: "Advertising Email"
								}), /* @__PURE__ */ jsx("input", {
									id: "emailAdvertising",
									name: "emailAdvertising",
									type: "email",
									value: settings.emailAdvertising || "",
									onChange: (e) => update("emailAdvertising", e.target.value),
									placeholder: "ads@northeasttimeline.com",
									className: "h-10 w-full rounded-lg border border-slate-200 px-3 text-sm focus:border-slate-900 focus:outline-none"
								})] }),
								/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
									htmlFor: "emailCareers",
									className: "mb-1 block text-xs font-semibold text-slate-600",
									children: "Careers Email"
								}), /* @__PURE__ */ jsx("input", {
									id: "emailCareers",
									name: "emailCareers",
									type: "email",
									value: settings.emailCareers || "",
									onChange: (e) => update("emailCareers", e.target.value),
									placeholder: "careers@northeasttimeline.com",
									className: "h-10 w-full rounded-lg border border-slate-200 px-3 text-sm focus:border-slate-900 focus:outline-none"
								})] }),
								/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
									htmlFor: "emailCorrections",
									className: "mb-1 block text-xs font-semibold text-slate-600",
									children: "Corrections Email"
								}), /* @__PURE__ */ jsx("input", {
									id: "emailCorrections",
									name: "emailCorrections",
									type: "email",
									value: settings.emailCorrections || "",
									onChange: (e) => update("emailCorrections", e.target.value),
									placeholder: "corrections@northeasttimeline.com",
									className: "h-10 w-full rounded-lg border border-slate-200 px-3 text-sm focus:border-slate-900 focus:outline-none"
								})] })
							]
						})
					]
				})
			]
		})]
	});
}
//#endregion
//#region src/components/admin/settings/general/FooterCopyrightSection.tsx
function FooterCopyrightSection({ settings, update }) {
	return /* @__PURE__ */ jsxs("section", {
		className: "rounded-xl border border-slate-200 bg-white p-5 shadow-sm",
		children: [/* @__PURE__ */ jsx("h2", {
			className: "mb-4 text-sm font-bold uppercase tracking-wider text-slate-700 border-b border-slate-100 pb-2",
			children: "Footer & Copyright"
		}), /* @__PURE__ */ jsxs("div", {
			className: "grid gap-4 sm:grid-cols-2",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "sm:col-span-2",
				children: [/* @__PURE__ */ jsx("label", {
					htmlFor: "footerNote",
					className: "mb-1 block text-xs font-semibold text-slate-600",
					children: "Footer Intro Text"
				}), /* @__PURE__ */ jsx("textarea", {
					id: "footerNote",
					name: "footerNote",
					value: settings.footerNote || "",
					onChange: (e) => update("footerNote", e.target.value),
					rows: 3,
					className: "w-full rounded-lg border border-slate-200 p-2.5 text-sm focus:border-slate-900 focus:outline-none"
				})]
			}), /* @__PURE__ */ jsxs("div", {
				className: "sm:col-span-2",
				children: [/* @__PURE__ */ jsx("label", {
					htmlFor: "copyright",
					className: "mb-1 block text-xs font-semibold text-slate-600",
					children: "Copyright Statement"
				}), /* @__PURE__ */ jsx("input", {
					id: "copyright",
					name: "copyright",
					type: "text",
					value: settings.copyright || "",
					onChange: (e) => update("copyright", e.target.value),
					className: "h-10 w-full rounded-lg border border-slate-200 px-3 text-sm focus:border-slate-900 focus:outline-none"
				})]
			})]
		})]
	});
}
//#endregion
//#region src/components/admin/settings/GeneralSettingsForm.tsx
function GeneralSettingsForm({ s: propSettings, update: propUpdate, onSave: propOnSave } = {}) {
	const contextSettings = useSiteSettings();
	const [internalSettings, setInternalSettings] = useState(() => {
		const loaded = loadSettings();
		const merged = {
			...contextSettings,
			...loaded
		};
		if (merged.copyright) merged.copyright = cleanCopyright(merged.copyright);
		return merged;
	});
	const [saved, setSaved] = useState(false);
	const activeSettings = propSettings ?? internalSettings;
	const handleUpdate = (k, v) => {
		const val = k === "copyright" && typeof v === "string" ? cleanCopyright(v) : v;
		if (propUpdate) propUpdate(k, val);
		else setInternalSettings((prev) => ({
			...prev,
			[k]: val
		}));
	};
	const handleSave = async () => {
		try {
			if (propOnSave) await propOnSave();
			else await saveSettings({
				...activeSettings,
				copyright: cleanCopyright(activeSettings.copyright)
			});
			setSaved(true);
			toast.success("Saved successfully");
			setTimeout(() => setSaved(false), 2e3);
		} catch (err) {
			console.error(err);
			toast.error(err.message || "Failed to save settings. Payload might be too large if logos are big.");
		}
	};
	return /* @__PURE__ */ jsxs("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ jsx(BrandInfoSection, {
				settings: activeSettings,
				update: handleUpdate
			}),
			/* @__PURE__ */ jsx(LogoUploadersSection, {
				settings: activeSettings,
				update: handleUpdate
			}),
			/* @__PURE__ */ jsx(ContactDetailsSection, {
				settings: activeSettings,
				update: handleUpdate
			}),
			/* @__PURE__ */ jsx(FooterCopyrightSection, {
				settings: activeSettings,
				update: handleUpdate
			}),
			/* @__PURE__ */ jsx("div", {
				className: "sticky bottom-4 flex justify-end",
				children: /* @__PURE__ */ jsxs("button", {
					onClick: handleSave,
					className: `inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-semibold text-white shadow-lg transition-colors ${saved ? "bg-emerald-600" : "bg-slate-900 hover:bg-slate-800"}`,
					children: [/* @__PURE__ */ jsx(Save, { className: "h-4 w-4" }), saved ? "Saved!" : "Save"]
				})
			})
		]
	});
}
//#endregion
//#region src/routes/admin.settings.tsx?tsr-split=component
var SeoSettingsTab = lazy(() => import("./SeoSettingsTab-qKhNyzzk.js"));
var ProtectionSettingsForm = lazy(() => import("./ProtectionSettingsForm-CYUXpMRK.js").then((m) => ({ default: m.ProtectionSettingsForm })));
var FestiveSettingsForm = lazy(() => import("./FestiveSettingsForm-D6V4rEgZ.js").then((m) => ({ default: m.FestiveSettingsForm })));
var FontSettingsTab = lazy(() => import("./FontSettingsTab-ROZ59Hfl.js").then((m) => ({ default: m.FontSettingsTab })));
var RedirectsAndLinksTab = lazy(() => import("./RedirectsAndLinksTab-_sDWRzBy.js"));
var IntegrationsTab = lazy(() => import("./IntegrationsTab-CeqXj_sp.js").then((m) => ({ default: m.IntegrationsTab })));
var ActivateWebsiteTab = lazy(() => import("./ActivateWebsiteTab-Css2J1aG.js").then((m) => ({ default: m.ActivateWebsiteTab })));
var BackupRestoreTab = lazy(() => import("./BackupRestoreTab-DJhIt4U4.js").then((m) => ({ default: m.BackupRestoreTab })));
var SpeedOptimizationTab = lazy(() => import("./SpeedOptimizationTab-DFemaZ1d.js").then((m) => ({ default: m.SpeedOptimizationTab })));
function SettingsTabSkeleton() {
	return /* @__PURE__ */ jsxs("div", {
		className: "space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm animate-pulse",
		children: [/* @__PURE__ */ jsx("div", { className: "h-6 w-48 bg-slate-200 rounded mb-4" }), /* @__PURE__ */ jsxs("div", {
			className: "grid gap-4 sm:grid-cols-2",
			children: [
				/* @__PURE__ */ jsx("div", { className: "h-10 bg-slate-100 rounded" }),
				/* @__PURE__ */ jsx("div", { className: "h-10 bg-slate-100 rounded" }),
				/* @__PURE__ */ jsx("div", { className: "h-24 sm:col-span-2 bg-slate-100 rounded" })
			]
		})]
	});
}
function SettingsPage() {
	const { user } = Route.useRouteContext();
	const search = Route.useSearch();
	const navigate = useNavigate();
	const router = useRouter();
	const [s, setS] = useState(() => loadSettings());
	const [tab, setTab] = useState(search.tab || "general");
	const planType = (s.licenseType || "").toLowerCase();
	const isEnterprise = planType.includes("enterprise");
	const isPremium = isEnterprise || planType.includes("premium");
	useEffect(() => {
		if (search.tab && search.tab !== tab) {
			if (search.tab === "festive" && !isEnterprise) {
				setTab("general");
				navigate({
					to: ".",
					search: { tab: "general" },
					replace: true
				});
				return;
			}
			setTab(search.tab);
		}
	}, [
		search.tab,
		isEnterprise,
		tab,
		navigate
	]);
	useEffect(() => {
		if (tab === "festive" && !isEnterprise) {
			setTab("general");
			navigate({
				to: ".",
				search: { tab: "general" },
				replace: true
			});
		}
	}, [
		tab,
		isEnterprise,
		navigate
	]);
	const update = (k, v) => setS((p) => ({
		...p,
		[k]: v
	}));
	const onSave = async () => {
		try {
			await saveSettings(s);
			toast.success("Saved successfully");
			router.invalidate();
		} catch (err) {
			console.error(err);
			toast.error(err.message || "Failed to save settings.");
		}
	};
	const tabs = [
		{
			id: "general",
			label: "General",
			icon: Save
		},
		{
			id: "seo",
			label: "News SEO & Webmaster",
			icon: Globe
		},
		...isEnterprise ? [{
			id: "festive",
			label: "Festive",
			icon: Sparkles
		}] : [],
		{
			id: "fonts",
			label: "Fonts",
			icon: Type
		},
		{
			id: "integrations",
			label: "Integrations",
			icon: BarChart3
		},
		{
			id: "protection",
			label: "Protection & Anti-Theft",
			icon: Lock
		},
		{
			id: "speed",
			label: "Speed Up",
			icon: Zap
		},
		{
			id: "links",
			label: "Redirects & Links",
			icon: Link2
		},
		{
			id: "backup",
			label: "System Backup & Restore",
			icon: DatabaseBackup
		},
		{
			id: "activate",
			label: "Activate Website",
			icon: ShieldCheck
		}
	];
	return /* @__PURE__ */ jsxs("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4",
				children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h1", {
					className: "text-2xl font-bold tracking-tight text-slate-900",
					children: "Site Settings"
				}), /* @__PURE__ */ jsx("p", {
					className: "text-sm text-slate-500",
					children: "Brand, contact, analytics, verification and login providers."
				})] }), /* @__PURE__ */ jsxs("button", {
					onClick: onSave,
					className: "inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 transition active:scale-95 shrink-0 self-start sm:self-auto",
					children: [/* @__PURE__ */ jsx(Save, { className: "h-4 w-4" }), " Save"]
				})]
			}),
			/* @__PURE__ */ jsx("div", {
				role: "tablist",
				"aria-label": "Settings categories",
				className: "flex flex-wrap gap-1.5 rounded-xl border border-slate-200 bg-white p-1.5 shadow-xs",
				children: tabs.map((t) => {
					const Icon = t.icon;
					const active = tab === t.id;
					return /* @__PURE__ */ jsxs("button", {
						role: "tab",
						"aria-selected": active,
						onClick: () => {
							navigate({
								to: ".",
								search: { tab: t.id }
							});
						},
						className: `whitespace-nowrap inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition-all ${active ? "bg-slate-900 text-white shadow-sm" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"}`,
						children: [
							/* @__PURE__ */ jsx(Icon, { className: "h-3.5 w-3.5 shrink-0" }),
							" ",
							t.label
						]
					}, t.id);
				})
			}),
			/* @__PURE__ */ jsxs(Suspense, {
				fallback: /* @__PURE__ */ jsx(SettingsTabSkeleton, {}),
				children: [
					tab === "general" && /* @__PURE__ */ jsx(GeneralSettingsForm, {
						s,
						update,
						onSave
					}),
					tab === "seo" && /* @__PURE__ */ jsx(SeoSettingsTab, {
						s,
						update
					}),
					tab === "festive" && isEnterprise && /* @__PURE__ */ jsx(FestiveSettingsForm, {}),
					tab === "fonts" && /* @__PURE__ */ jsx(FontSettingsTab, {}),
					tab === "integrations" && /* @__PURE__ */ jsx(IntegrationsTab, {
						s,
						update
					}),
					tab === "protection" && /* @__PURE__ */ jsx(ProtectionSettingsForm, {
						s,
						update
					}),
					tab === "links" && /* @__PURE__ */ jsx(RedirectsAndLinksTab, {}),
					tab === "activate" && /* @__PURE__ */ jsx(ActivateWebsiteTab, {
						s,
						update
					}),
					tab === "backup" && /* @__PURE__ */ jsx(BackupRestoreTab, {}),
					tab === "speed" && /* @__PURE__ */ jsx(SpeedOptimizationTab, {
						s,
						update,
						isPremium,
						onNavigateActivate: () => navigate({
							to: ".",
							search: { tab: "activate" }
						})
					})
				]
			})
		]
	});
}
//#endregion
export { SettingsPage as component };

//# sourceMappingURL=admin.settings-bqlRapvI.js.map