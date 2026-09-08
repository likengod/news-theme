import { n as MediaField } from "./MediaField-CAywNcmk.js";
import { useState } from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { CheckCircle2, Edit2, ExternalLink, Eye, EyeOff, XCircle } from "lucide-react";
//#region src/components/admin/settings/SettingsHelpers.tsx
function Card({ title, subtitle, children }) {
	return /* @__PURE__ */ jsxs("div", {
		className: "rounded-lg border border-slate-200 bg-white p-5",
		children: [
			/* @__PURE__ */ jsx("h2", {
				className: "text-sm font-semibold uppercase tracking-wider text-slate-500",
				children: title
			}),
			subtitle && /* @__PURE__ */ jsx("p", {
				className: "mt-1 text-xs text-slate-500",
				children: subtitle
			}),
			/* @__PURE__ */ jsx("div", {
				className: "mt-4 space-y-4",
				children
			})
		]
	});
}
function Field({ f, s, update }) {
	const value = s[f.key];
	return /* @__PURE__ */ jsxs("div", { children: [
		/* @__PURE__ */ jsx("label", {
			className: "mb-1 block text-xs font-medium text-slate-700",
			children: f.label
		}),
		f.textarea ? /* @__PURE__ */ jsx("textarea", {
			value: value || "",
			placeholder: f.placeholder,
			onChange: (e) => update(f.key, e.target.value),
			rows: 4,
			className: "w-full rounded-md border border-slate-200 px-3 py-2 font-mono text-xs focus:border-slate-900 focus:outline-none"
		}) : /* @__PURE__ */ jsx("input", {
			value: value || "",
			placeholder: f.placeholder,
			onChange: (e) => update(f.key, e.target.value),
			className: "w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none"
		}),
		f.hint && /* @__PURE__ */ jsx("p", {
			className: "mt-1 text-[11px] text-slate-500",
			children: f.hint
		})
	] });
}
function IntegrationField({ f, s, update }) {
	const [isEditing, setIsEditing] = useState(false);
	const [showValue, setShowValue] = useState(false);
	const savedValue = s[f.key];
	const isConfigured = !!savedValue && savedValue.trim().length > 0 && savedValue !== "#";
	const [localValue, setLocalValue] = useState(savedValue === "#" ? "" : savedValue || "");
	const handleSave = () => {
		update(f.key, localValue);
		setIsEditing(false);
	};
	const handleCancel = () => {
		setLocalValue(savedValue || "");
		setIsEditing(false);
	};
	return /* @__PURE__ */ jsxs("div", {
		className: "rounded-md border border-slate-200 bg-white p-2.5 hover:border-slate-300 transition-colors",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "flex items-center justify-between gap-3",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "flex flex-wrap items-center gap-x-3 gap-y-1",
				children: [/* @__PURE__ */ jsx("p", {
					className: "text-[13px] font-medium text-slate-800",
					children: f.label
				}), /* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-2",
					children: [isConfigured ? /* @__PURE__ */ jsxs("span", {
						className: "flex items-center gap-1 text-[11px] font-medium text-emerald-600",
						children: [/* @__PURE__ */ jsx(CheckCircle2, { className: "h-3 w-3" }), " Configured"]
					}) : /* @__PURE__ */ jsxs("span", {
						className: "flex items-center gap-1 text-[11px] font-medium text-rose-500",
						children: [/* @__PURE__ */ jsx(XCircle, { className: "h-3 w-3" }), " Not Configured"]
					}), f.guideUrl && /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx("span", {
						className: "text-slate-300",
						children: "•"
					}), /* @__PURE__ */ jsxs("a", {
						href: f.guideUrl,
						target: "_blank",
						rel: "noreferrer",
						className: "flex items-center gap-1 text-[11px] text-blue-600 hover:underline",
						children: ["Setup Guide ", /* @__PURE__ */ jsx(ExternalLink, { className: "h-2.5 w-2.5" })]
					})] })]
				})]
			}), /* @__PURE__ */ jsx("div", {
				className: "flex items-center gap-2 shrink-0",
				children: !isEditing && /* @__PURE__ */ jsxs("button", {
					onClick: () => setIsEditing(true),
					className: "flex items-center gap-1.5 rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-200",
					children: [/* @__PURE__ */ jsx(Edit2, { className: "h-3 w-3" }), isConfigured ? "Update" : "Setup"]
				})
			})]
		}), isEditing && /* @__PURE__ */ jsxs("div", {
			className: "mt-2.5 border-t border-slate-100 pt-2.5",
			children: [
				f.hint && /* @__PURE__ */ jsx("p", {
					className: "mb-2 text-[11px] text-slate-500",
					children: f.hint
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "flex items-start gap-2",
					children: [/* @__PURE__ */ jsx("div", {
						className: "relative flex-1",
						children: f.textarea ? /* @__PURE__ */ jsx("textarea", {
							value: localValue,
							placeholder: f.placeholder,
							onChange: (e) => setLocalValue(e.target.value),
							rows: 3,
							className: "w-full rounded-md border border-slate-200 px-3 py-1.5 font-mono text-xs focus:border-slate-900 focus:outline-none"
						}) : /* @__PURE__ */ jsxs("div", {
							className: "relative",
							children: [/* @__PURE__ */ jsx("input", {
								type: showValue ? "text" : "password",
								value: localValue,
								placeholder: f.placeholder,
								onChange: (e) => setLocalValue(e.target.value),
								className: "w-full rounded-md border border-slate-200 px-3 py-1.5 pr-8 text-xs focus:border-slate-900 focus:outline-none"
							}), /* @__PURE__ */ jsx("button", {
								type: "button",
								onClick: () => setShowValue(!showValue),
								className: "absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600",
								children: showValue ? /* @__PURE__ */ jsx(EyeOff, { className: "h-3.5 w-3.5" }) : /* @__PURE__ */ jsx(Eye, { className: "h-3.5 w-3.5" })
							})]
						})
					}), /* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-1.5 shrink-0",
						children: [/* @__PURE__ */ jsx("button", {
							onClick: handleCancel,
							className: "flex h-[30px] items-center justify-center rounded-md bg-slate-100 px-2.5 text-[11px] font-medium text-slate-600 hover:bg-slate-200",
							children: "Cancel"
						}), /* @__PURE__ */ jsx("button", {
							onClick: handleSave,
							className: "flex h-[30px] items-center justify-center rounded-md bg-slate-900 px-3 text-[11px] font-medium text-white hover:bg-slate-800",
							children: "Save"
						})]
					})]
				}),
				f.toggleKey && /* @__PURE__ */ jsx("div", {
					className: "mt-3 mb-1 border-t border-slate-100 pt-3",
					children: /* @__PURE__ */ jsx(Toggle, {
						label: f.toggleLabel || `Enable ${f.label}`,
						checked: !!s[f.toggleKey],
						onChange: (v) => update(f.toggleKey, v)
					})
				})
			]
		})]
	});
}
function Toggle({ label, checked, onChange, hint }) {
	return /* @__PURE__ */ jsxs("div", {
		className: "flex items-center justify-between gap-4 rounded-md border border-slate-200 px-3 py-2",
		children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("p", {
			className: "text-[13px] font-medium text-slate-800",
			children: label
		}), hint && /* @__PURE__ */ jsx("p", {
			className: "mt-0.5 text-[11px] text-slate-500",
			children: hint
		})] }), /* @__PURE__ */ jsx("button", {
			type: "button",
			onClick: () => onChange(!checked),
			className: `relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition ${checked ? "bg-slate-900" : "bg-slate-300"}`,
			"aria-pressed": checked,
			children: /* @__PURE__ */ jsx("span", { className: `pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow transition ${checked ? "translate-x-4" : "translate-x-0"}` })
		})]
	});
}
function GuideList({ items }) {
	return /* @__PURE__ */ jsx("ul", {
		className: "space-y-2 text-sm",
		children: items.map((i) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsxs(A, {
			href: i.url,
			children: [
				i.label,
				" ",
				/* @__PURE__ */ jsx(ExternalLink, { className: "ml-1 inline h-3 w-3" })
			]
		}) }, i.url))
	});
}
function A({ href, children }) {
	return /* @__PURE__ */ jsx("a", {
		href,
		target: "_blank",
		rel: "noreferrer",
		className: "font-medium text-slate-900 underline decoration-slate-300 underline-offset-4 hover:decoration-slate-900",
		children
	});
}
function LogoUploader({ label, value, onChange, usage, dark, hint, recommendedSize, compact }) {
	return /* @__PURE__ */ jsx("div", {
		className: "rounded-md border border-slate-200 p-2",
		children: /* @__PURE__ */ jsx(MediaField, {
			label,
			value,
			onChange,
			usage,
			dark,
			hint,
			recommendedSize,
			compact
		})
	});
}
//#endregion
export { LogoUploader as a, IntegrationField as i, Field as n, Toggle as o, GuideList as r, Card as t };
