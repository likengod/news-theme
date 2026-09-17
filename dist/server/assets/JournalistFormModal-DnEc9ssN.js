import { a as useSiteSettings } from "./AdSettingsContext-DJiAqdeY.js";
import { n as MediaField } from "./MediaField-CKuq8wJM.js";
import { t as Field } from "./Field-DPKVWHIh.js";
import { jsx, jsxs } from "react/jsx-runtime";
import { Loader2, Save, X } from "lucide-react";
//#region src/components/admin/journalists/JournalistFormModal.tsx
function JournalistFormModal({ form, setForm, saving, submitForm }) {
	const planType = (useSiteSettings()?.licenseType || "").toLowerCase();
	const isEnterprisePlus = planType.includes("enterprise+") || planType.includes("enterprise plus");
	return /* @__PURE__ */ jsx("div", {
		className: "fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-black/40 p-4",
		children: /* @__PURE__ */ jsxs("div", {
			className: "w-full max-w-2xl rounded-lg bg-white p-6 shadow-xl",
			children: [
				/* @__PURE__ */ jsxs("div", {
					className: "mb-4 flex items-center justify-between",
					children: [/* @__PURE__ */ jsx("h2", {
						className: "text-lg font-semibold",
						children: form.userId ? "Edit journalist" : "New journalist"
					}), /* @__PURE__ */ jsx("button", {
						onClick: () => setForm(null),
						className: "grid h-7 w-7 place-items-center rounded-md hover:bg-slate-100",
						"aria-label": "Close",
						children: /* @__PURE__ */ jsx(X, { className: "h-4 w-4" })
					})]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "grid gap-3 sm:grid-cols-2",
					children: [
						/* @__PURE__ */ jsx(Field, {
							label: "Full name*",
							value: form.displayName,
							onChange: (v) => setForm({
								...form,
								displayName: v
							})
						}),
						/* @__PURE__ */ jsx(Field, {
							label: "Email*",
							type: "email",
							value: form.email,
							onChange: (v) => setForm({
								...form,
								email: v
							})
						}),
						/* @__PURE__ */ jsx(Field, {
							label: form.userId ? "New password (leave blank to keep)" : "Password*",
							type: "password",
							value: form.password,
							onChange: (v) => setForm({
								...form,
								password: v
							})
						}),
						/* @__PURE__ */ jsx(Field, {
							label: "Phone",
							value: form.phone,
							onChange: (v) => setForm({
								...form,
								phone: v
							})
						}),
						/* @__PURE__ */ jsx(Field, {
							label: "Father's name",
							value: form.fatherName,
							onChange: (v) => setForm({
								...form,
								fatherName: v
							}),
							placeholder: "Father's full name"
						}),
						/* @__PURE__ */ jsx(Field, {
							label: "Mother's name",
							value: form.motherName,
							onChange: (v) => setForm({
								...form,
								motherName: v
							}),
							placeholder: "Mother's full name"
						}),
						/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
							className: "mb-1 block text-xs font-medium text-slate-700",
							children: "Gender"
						}), /* @__PURE__ */ jsxs("select", {
							value: form.gender,
							onChange: (e) => {
								const g = e.target.value;
								setForm({
									...form,
									gender: g,
									husbandName: g === "Female" && form.maritalStatus === "Married" ? form.husbandName : ""
								});
							},
							className: "w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:border-slate-900 focus:outline-none",
							children: [
								/* @__PURE__ */ jsx("option", {
									value: "",
									children: "Select Gender"
								}),
								/* @__PURE__ */ jsx("option", {
									value: "Male",
									children: "Male"
								}),
								/* @__PURE__ */ jsx("option", {
									value: "Female",
									children: "Female"
								}),
								/* @__PURE__ */ jsx("option", {
									value: "Other",
									children: "Other"
								})
							]
						})] }),
						/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
							className: "mb-1 block text-xs font-medium text-slate-700",
							children: "Marital status"
						}), /* @__PURE__ */ jsxs("select", {
							value: form.maritalStatus,
							onChange: (e) => {
								const s = e.target.value;
								setForm({
									...form,
									maritalStatus: s,
									husbandName: form.gender === "Female" && s === "Married" ? form.husbandName : ""
								});
							},
							className: "w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:border-slate-900 focus:outline-none",
							children: [
								/* @__PURE__ */ jsx("option", {
									value: "",
									children: "Select Marital Status"
								}),
								/* @__PURE__ */ jsx("option", {
									value: "Single",
									children: "Single / Unmarried"
								}),
								/* @__PURE__ */ jsx("option", {
									value: "Married",
									children: "Married"
								}),
								/* @__PURE__ */ jsx("option", {
									value: "Other",
									children: "Other"
								})
							]
						})] }),
						form.gender === "Female" && form.maritalStatus === "Married" && /* @__PURE__ */ jsx("div", {
							className: "sm:col-span-2",
							children: /* @__PURE__ */ jsx(Field, {
								label: "Husband's name*",
								value: form.husbandName,
								onChange: (v) => setForm({
									...form,
									husbandName: v
								}),
								placeholder: "Husband's full name"
							})
						}),
						/* @__PURE__ */ jsx(Field, {
							label: "Blood group",
							value: form.bloodGroup,
							onChange: (v) => setForm({
								...form,
								bloodGroup: v
							}),
							placeholder: "O+"
						}),
						/* @__PURE__ */ jsx(Field, {
							label: "Date of Birth (DOB)",
							value: form.dob,
							onChange: (v) => setForm({
								...form,
								dob: v
							}),
							placeholder: "15 Aug 1995"
						}),
						/* @__PURE__ */ jsx(Field, {
							label: "Press Card Valid Till",
							value: form.validTill,
							onChange: (v) => setForm({
								...form,
								validTill: v
							}),
							placeholder: "18 Jul 2029"
						}),
						/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
							className: "mb-1 block text-xs font-medium text-slate-700",
							children: "Avatar"
						}), /* @__PURE__ */ jsx(MediaField, {
							value: form.avatarUrl,
							onChange: (v) => setForm({
								...form,
								avatarUrl: v
							}),
							usage: "other",
							hint: "Upload a new photo or pick one from the file manager.",
							recommendedSize: "400×400 px (square)",
							compact: true
						})] }),
						/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
							className: "mb-1 block text-xs font-medium text-slate-700",
							children: "Document Type"
						}), /* @__PURE__ */ jsxs("select", {
							value: form.documentType,
							onChange: (e) => setForm({
								...form,
								documentType: e.target.value
							}),
							className: "w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:border-slate-900 focus:outline-none",
							children: [
								/* @__PURE__ */ jsx("option", {
									value: "",
									children: "Select Document Type"
								}),
								/* @__PURE__ */ jsx("option", {
									value: "Voter ID",
									children: "Voter ID"
								}),
								/* @__PURE__ */ jsx("option", {
									value: "Aadhaar Card",
									children: "Aadhaar Card"
								}),
								/* @__PURE__ */ jsx("option", {
									value: "Passport",
									children: "Passport"
								})
							]
						})] }),
						/* @__PURE__ */ jsxs("div", {
							className: "sm:col-span-2",
							children: [/* @__PURE__ */ jsx("label", {
								className: "mb-1 block text-xs font-medium text-slate-700",
								children: "Verification Document (ID Proof)"
							}), /* @__PURE__ */ jsx(MediaField, {
								value: form.documentUrl,
								onChange: (v) => setForm({
									...form,
									documentUrl: v
								}),
								usage: "other",
								hint: "Upload document image (< 1 MB) or pick from media.",
								recommendedSize: "Voter ID / Aadhaar / Passport (< 1 MB)",
								compact: true
							})]
						}),
						/* @__PURE__ */ jsx("div", {
							className: "sm:col-span-2",
							children: /* @__PURE__ */ jsx(Field, {
								label: "Address",
								value: form.address,
								onChange: (v) => setForm({
									...form,
									address: v
								})
							})
						}),
						/* @__PURE__ */ jsx(Field, {
							label: "State",
							value: form.state,
							onChange: (v) => setForm({
								...form,
								state: v
							})
						}),
						/* @__PURE__ */ jsx(Field, {
							label: "Country",
							value: form.country,
							onChange: (v) => setForm({
								...form,
								country: v
							})
						}),
						/* @__PURE__ */ jsx(Field, {
							label: "Pin / ZIP code",
							value: form.pinCode,
							onChange: (v) => setForm({
								...form,
								pinCode: v
							})
						}),
						/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
							className: "mb-1 block text-xs font-medium text-slate-700",
							children: "Articles published"
						}), /* @__PURE__ */ jsx("input", {
							type: "number",
							min: 0,
							value: form.articlesPublished,
							onChange: (e) => setForm({
								...form,
								articlesPublished: Math.max(0, Number(e.target.value) || 0)
							}),
							className: "w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none"
						})] }),
						isEnterprisePlus && /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
							className: "mb-1 block text-xs font-medium text-slate-700",
							children: "Wallet points"
						}), /* @__PURE__ */ jsx("input", {
							type: "number",
							min: 0,
							value: form.points,
							onChange: (e) => setForm({
								...form,
								points: Math.max(0, Number(e.target.value) || 0)
							}),
							className: "w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none"
						})] }),
						/* @__PURE__ */ jsxs("label", {
							className: "inline-flex items-center gap-2 rounded-md border border-slate-200 px-3 py-2 text-sm sm:col-span-2",
							children: [
								/* @__PURE__ */ jsx("input", {
									type: "checkbox",
									checked: form.active,
									onChange: (e) => setForm({
										...form,
										active: e.target.checked
									})
								}),
								/* @__PURE__ */ jsx("span", {
									className: "font-medium",
									children: "Active"
								}),
								/* @__PURE__ */ jsx("span", {
									className: "text-xs text-slate-500",
									children: "Inactive journalists cannot sign in."
								})
							]
						})
					]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "mt-5 flex justify-end gap-2",
					children: [/* @__PURE__ */ jsx("button", {
						onClick: () => setForm(null),
						disabled: saving,
						className: "rounded-md border border-slate-200 px-4 py-2 text-sm font-medium hover:bg-slate-50",
						children: "Cancel"
					}), /* @__PURE__ */ jsxs("button", {
						onClick: submitForm,
						disabled: saving,
						className: "inline-flex items-center gap-1.5 rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-60",
						children: [
							saving ? /* @__PURE__ */ jsx(Loader2, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ jsx(Save, { className: "h-4 w-4" }),
							" ",
							"Save"
						]
					})]
				})
			]
		})
	});
}
//#endregion
export { JournalistFormModal };

//# sourceMappingURL=JournalistFormModal-DnEc9ssN.js.map