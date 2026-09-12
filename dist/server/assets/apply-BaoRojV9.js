import { t as Footer } from "./Footer-DIAsn1SR.js";
import { t as Header } from "./Header-BXQ5Ck3z.js";
import { l as submitWorkWithUs } from "./inbox.functions-Bvrvr4OA.js";
import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { toast } from "sonner";
//#region src/routes/apply.tsx?tsr-split=component
var TIERS = [
	{
		id: "volunteer",
		name: "Volunteer Journalist"
	},
	{
		id: "intern",
		name: "Intern Journalist"
	},
	{
		id: "permanent",
		name: "Permanent Employee"
	}
];
function ApplyPage() {
	const [form, setForm] = useState({
		name: "",
		email: "",
		phone: "",
		alternativePhone: "",
		city: "",
		zip: "",
		country: "",
		beat: "",
		tier: "volunteer",
		portfolio: "",
		pitch: ""
	});
	const set = (k, v) => setForm((f) => ({
		...f,
		[k]: v
	}));
	const [submitting, setSubmitting] = useState(false);
	const submit = async (e) => {
		e.preventDefault();
		if (!form.name.trim() || !form.email.trim() || !form.pitch.trim()) {
			toast.error("Name, email and short pitch are required");
			return;
		}
		setSubmitting(true);
		try {
			await submitWorkWithUs({ data: form });
			toast.success("Application received! Our editors will reply within 5 working days.");
			setForm({
				name: "",
				email: "",
				phone: "",
				alternativePhone: "",
				city: "",
				zip: "",
				country: "",
				beat: "",
				tier: "volunteer",
				portfolio: "",
				pitch: ""
			});
		} catch (err) {
			toast.error(err.message || "Failed to submit application");
		} finally {
			setSubmitting(false);
		}
	};
	return /* @__PURE__ */ jsxs("div", {
		className: "min-h-screen bg-background text-foreground flex flex-col",
		children: [
			/* @__PURE__ */ jsx(Header, {
				showTicker: false,
				showBreakingBar: false
			}),
			/* @__PURE__ */ jsx("main", {
				className: "flex-1 mx-auto w-full max-w-4xl px-4 py-16",
				children: /* @__PURE__ */ jsxs("section", {
					className: "rounded-2xl border border-border bg-card/40 p-6 md:p-12",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "mb-10 text-center",
						children: [/* @__PURE__ */ jsx("h1", {
							className: "text-3xl md:text-4xl font-bold tracking-tight",
							children: "Application Form"
						}), /* @__PURE__ */ jsx("p", {
							className: "mt-3 text-sm text-muted-foreground",
							children: "Every application is reviewed by a senior editor. We reply within 5 working days."
						})]
					}), /* @__PURE__ */ jsxs("form", {
						onSubmit: submit,
						className: "grid gap-6 md:grid-cols-2",
						children: [
							/* @__PURE__ */ jsx(Field, {
								label: "Full name",
								value: form.name,
								onChange: (v) => set("name", v),
								required: true
							}),
							/* @__PURE__ */ jsx(Field, {
								label: "Email",
								type: "email",
								value: form.email,
								onChange: (v) => set("email", v),
								required: true
							}),
							/* @__PURE__ */ jsx(Field, {
								label: "Phone",
								value: form.phone,
								onChange: (v) => set("phone", v),
								placeholder: "+91 00000 00000"
							}),
							/* @__PURE__ */ jsx(Field, {
								label: "Alternative Number",
								value: form.alternativePhone,
								onChange: (v) => set("alternativePhone", v),
								placeholder: "Optional backup contact"
							}),
							/* @__PURE__ */ jsx(Field, {
								label: "City / State",
								value: form.city,
								onChange: (v) => set("city", v)
							}),
							/* @__PURE__ */ jsx(Field, {
								label: "Zip / Postal Code",
								value: form.zip,
								onChange: (v) => set("zip", v)
							}),
							/* @__PURE__ */ jsx(Field, {
								label: "Country",
								value: form.country,
								onChange: (v) => set("country", v),
								placeholder: "e.g. India"
							}),
							/* @__PURE__ */ jsx(Field, {
								label: "Beat / Topic",
								value: form.beat,
								onChange: (v) => set("beat", v),
								placeholder: "Politics, Sports, Tech…"
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "md:col-span-2",
								children: [/* @__PURE__ */ jsx("label", {
									className: "mb-1 block text-xs font-semibold uppercase tracking-widest text-muted-foreground",
									children: "Applying for"
								}), /* @__PURE__ */ jsxs("select", {
									value: form.tier,
									onChange: (e) => set("tier", e.target.value),
									className: "w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:border-foreground focus:outline-none focus:ring-1 focus:ring-foreground",
									children: [
										TIERS.map((t) => /* @__PURE__ */ jsx("option", {
											value: t.id,
											children: t.name
										}, t.id)),
										/* @__PURE__ */ jsx("option", {
											value: "fact_checker",
											children: "Fact Checker"
										}),
										/* @__PURE__ */ jsx("option", {
											value: "proofreader",
											children: "Proofreader"
										})
									]
								})]
							}),
							/* @__PURE__ */ jsx(Field, {
								className: "md:col-span-2",
								label: "Portfolio / Clips (URL)",
								value: form.portfolio,
								onChange: (v) => set("portfolio", v),
								placeholder: "https://yourwork.com"
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "md:col-span-2",
								children: [/* @__PURE__ */ jsx("label", {
									className: "mb-1 block text-xs font-semibold uppercase tracking-widest text-muted-foreground",
									children: "Why do you want to join? *"
								}), /* @__PURE__ */ jsx("textarea", {
									value: form.pitch,
									onChange: (e) => set("pitch", e.target.value),
									rows: 6,
									required: true,
									className: "w-full rounded-md border border-border bg-background p-3 text-sm focus:border-foreground focus:outline-none focus:ring-1 focus:ring-foreground",
									placeholder: "Tell us about your experience and how you want to contribute."
								})]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "md:col-span-2 mt-4",
								children: [/* @__PURE__ */ jsxs("div", {
									className: "flex items-center gap-3 mb-6",
									children: [/* @__PURE__ */ jsx("input", {
										type: "checkbox",
										id: "terms",
										required: true,
										className: "h-5 w-5 rounded border-border text-foreground focus:ring-foreground"
									}), /* @__PURE__ */ jsxs("label", {
										htmlFor: "terms",
										className: "text-sm font-medium text-foreground cursor-pointer",
										children: [
											"I agree to the ",
											/* @__PURE__ */ jsx(Link, {
												to: "/terms-and-conditions",
												className: "underline hover:text-blue-600 transition-colors",
												children: "Terms & Conditions"
											}),
											" and ",
											/* @__PURE__ */ jsx(Link, {
												to: "/privacy-policy",
												className: "underline hover:text-blue-600 transition-colors",
												children: "Privacy Policy"
											})
										]
									})]
								}), /* @__PURE__ */ jsx("button", {
									type: "submit",
									disabled: submitting,
									className: "w-full rounded-lg bg-foreground px-8 py-4 text-sm font-bold uppercase tracking-widest text-background transition-transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:hover:scale-100",
									children: submitting ? "Submitting Application…" : "Submit Application"
								})]
							})
						]
					})]
				})
			}),
			/* @__PURE__ */ jsx(Footer, {})
		]
	});
}
function Field({ label, value, onChange, type = "text", required, placeholder, className = "" }) {
	return /* @__PURE__ */ jsxs("div", {
		className,
		children: [/* @__PURE__ */ jsxs("label", {
			className: "mb-1 block text-xs font-semibold uppercase tracking-widest text-muted-foreground",
			children: [label, required ? " *" : /* @__PURE__ */ jsx("span", {
				className: "ml-1 text-muted-foreground/60 normal-case tracking-normal",
				children: "(Optional)"
			})]
		}), /* @__PURE__ */ jsx("input", {
			type,
			value,
			required,
			placeholder,
			onChange: (e) => onChange(e.target.value),
			className: "w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
		})]
	});
}
//#endregion
export { ApplyPage as component };

//# sourceMappingURL=apply-BaoRojV9.js.map