import { T as saveSettings, p as loadSettings } from "./site-content-BzPQwjRN.js";
import { a as LogoUploader } from "./SettingsHelpers-OyiB6UV8.js";
import { useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
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
	const [settings, setSettings] = useState(() => loadSettings());
	const [saved, setSaved] = useState(false);
	const update = (k, v) => setSettings((s) => ({
		...s,
		[k]: v
	}));
	const handleSave = async () => {
		try {
			await saveSettings(settings);
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
					grp.title === "Brand Information" && /* @__PURE__ */ jsxs("div", {
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
					})
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
