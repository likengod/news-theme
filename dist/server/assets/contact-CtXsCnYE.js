import { t as SocialIcons } from "./SocialIcons-Ct5CJien.js";
import { t as Footer } from "./Footer-BygX9xto.js";
import { t as Header } from "./Header-0Pk6z82h.js";
import { o as submitContactMessage } from "./inbox.functions-DCjsB2wJ.js";
import { useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { toast } from "sonner";
//#region src/routes/contact.tsx?tsr-split=component
function ContactPage() {
	const [sent, setSent] = useState(false);
	const [submitting, setSubmitting] = useState(false);
	const [form, setForm] = useState({
		name: "",
		email: "",
		subject: "News tip",
		message: ""
	});
	const set = (k, v) => setForm((f) => ({
		...f,
		[k]: v
	}));
	return /* @__PURE__ */ jsxs("div", {
		className: "min-h-screen bg-background text-foreground",
		children: [
			/* @__PURE__ */ jsx(Header, {}),
			/* @__PURE__ */ jsxs("main", {
				className: "mx-auto max-w-7xl px-4 py-10",
				children: [/* @__PURE__ */ jsxs("header", {
					className: "border-b border-border pb-6",
					children: [/* @__PURE__ */ jsx("h1", {
						className: "font-serif text-5xl font-bold text-foreground md:text-6xl",
						children: "Contact Us"
					}), /* @__PURE__ */ jsx("p", {
						className: "mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground",
						children: "Story tips, corrections, partnership and advertising enquiries — the News Theme desk reads every message. We aim to reply within one business day."
					})]
				}), /* @__PURE__ */ jsxs("section", {
					className: "grid grid-cols-1 gap-10 py-10 lg:grid-cols-[1fr_360px]",
					children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h2", {
						className: "headline font-serif text-2xl font-bold text-primary",
						children: "Send us a message"
					}), sent ? /* @__PURE__ */ jsx("div", {
						className: "mt-6 border border-border bg-card/40 p-6 text-sm text-foreground",
						children: "Thanks — your message has been received. Our team will get back to you shortly."
					}) : /* @__PURE__ */ jsxs("form", {
						className: "mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2",
						onSubmit: async (e) => {
							e.preventDefault();
							setSubmitting(true);
							try {
								await submitContactMessage({ data: form });
								setSent(true);
								toast.success("Message sent — we'll reply within one business day.");
							} catch (err) {
								toast.error(err.message || "Failed to send message");
							} finally {
								setSubmitting(false);
							}
						},
						children: [
							/* @__PURE__ */ jsxs("label", {
								className: "block text-sm",
								children: [/* @__PURE__ */ jsx("span", {
									className: "mb-1 block text-xs font-semibold uppercase tracking-widest text-muted-foreground",
									children: "Full name"
								}), /* @__PURE__ */ jsx("input", {
									required: true,
									type: "text",
									value: form.name,
									onChange: (e) => set("name", e.target.value),
									className: "w-full border border-border bg-background px-3 py-2 text-sm outline-none focus:border-foreground"
								})]
							}),
							/* @__PURE__ */ jsxs("label", {
								className: "block text-sm",
								children: [/* @__PURE__ */ jsx("span", {
									className: "mb-1 block text-xs font-semibold uppercase tracking-widest text-muted-foreground",
									children: "Email"
								}), /* @__PURE__ */ jsx("input", {
									required: true,
									type: "email",
									value: form.email,
									onChange: (e) => set("email", e.target.value),
									className: "w-full border border-border bg-background px-3 py-2 text-sm outline-none focus:border-foreground"
								})]
							}),
							/* @__PURE__ */ jsxs("label", {
								className: "block text-sm sm:col-span-2",
								children: [/* @__PURE__ */ jsx("span", {
									className: "mb-1 block text-xs font-semibold uppercase tracking-widest text-muted-foreground",
									children: "Subject"
								}), /* @__PURE__ */ jsxs("select", {
									value: form.subject,
									onChange: (e) => set("subject", e.target.value),
									className: "w-full border border-border bg-background px-3 py-2 text-sm outline-none focus:border-foreground",
									children: [
										/* @__PURE__ */ jsx("option", { children: "News tip" }),
										/* @__PURE__ */ jsx("option", { children: "Correction" }),
										/* @__PURE__ */ jsx("option", { children: "Advertising" }),
										/* @__PURE__ */ jsx("option", { children: "Partnership" }),
										/* @__PURE__ */ jsx("option", { children: "Careers" }),
										/* @__PURE__ */ jsx("option", { children: "Other" })
									]
								})]
							}),
							/* @__PURE__ */ jsxs("label", {
								className: "block text-sm sm:col-span-2",
								children: [/* @__PURE__ */ jsx("span", {
									className: "mb-1 block text-xs font-semibold uppercase tracking-widest text-muted-foreground",
									children: "Message"
								}), /* @__PURE__ */ jsx("textarea", {
									required: true,
									rows: 6,
									value: form.message,
									onChange: (e) => set("message", e.target.value),
									className: "w-full border border-border bg-background px-3 py-2 text-sm outline-none focus:border-foreground"
								})]
							}),
							/* @__PURE__ */ jsx("div", {
								className: "sm:col-span-2",
								children: /* @__PURE__ */ jsx("button", {
									type: "submit",
									disabled: submitting,
									className: "inline-flex items-center gap-2 bg-foreground px-6 py-3 text-xs font-bold uppercase tracking-widest text-background hover:opacity-90 disabled:opacity-60",
									children: submitting ? "Sending…" : "Send Message"
								})
							})
						]
					})] }), /* @__PURE__ */ jsxs("aside", {
						className: "space-y-8",
						children: [
							/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h3", {
								className: "mb-4 border-b-2 border-foreground pb-2 text-xs font-bold uppercase tracking-widest text-foreground",
								children: "Newsroom"
							}), /* @__PURE__ */ jsxs("ul", {
								className: "space-y-4 text-sm text-muted-foreground",
								children: [
									/* @__PURE__ */ jsxs("li", {
										className: "flex items-start gap-3",
										children: [/* @__PURE__ */ jsx(MapPin, { className: "mt-0.5 h-4 w-4 shrink-0 text-foreground" }), /* @__PURE__ */ jsxs("span", { children: [
											"Agartala, Tripura (W)",
											/* @__PURE__ */ jsx("br", {}),
											"India — Pin: 799006"
										] })]
									}),
									/* @__PURE__ */ jsxs("li", {
										className: "flex items-center gap-3",
										children: [/* @__PURE__ */ jsx(Phone, { className: "h-4 w-4 shrink-0 text-foreground" }), /* @__PURE__ */ jsx("a", {
											href: "tel:+919999999999",
											className: "hover:text-foreground hover:underline",
											children: "+91 99999 99999"
										})]
									}),
									/* @__PURE__ */ jsxs("li", {
										className: "flex items-center gap-3",
										children: [/* @__PURE__ */ jsx(Mail, { className: "h-4 w-4 shrink-0 text-foreground" }), /* @__PURE__ */ jsx("a", {
											href: "mailto:hello@northeasttimeline.com",
											className: "hover:text-foreground hover:underline",
											children: "hello@northeasttimeline.com"
										})]
									}),
									/* @__PURE__ */ jsxs("li", {
										className: "flex items-start gap-3",
										children: [/* @__PURE__ */ jsx(Clock, { className: "mt-0.5 h-4 w-4 shrink-0 text-foreground" }), /* @__PURE__ */ jsx("span", { children: "Mon – Sat · 9:00 AM – 7:00 PM IST" })]
									})
								]
							})] }),
							/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h3", {
								className: "mb-4 border-b-2 border-foreground pb-2 text-xs font-bold uppercase tracking-widest text-foreground",
								children: "Desks"
							}), /* @__PURE__ */ jsxs("ul", {
								className: "space-y-2 text-sm text-muted-foreground",
								children: [
									/* @__PURE__ */ jsxs("li", { children: [/* @__PURE__ */ jsx("span", {
										className: "font-semibold text-foreground",
										children: "News tips:"
									}), " tips@northeasttimeline.com"] }),
									/* @__PURE__ */ jsxs("li", { children: [/* @__PURE__ */ jsx("span", {
										className: "font-semibold text-foreground",
										children: "Advertising:"
									}), " ads@northeasttimeline.com"] }),
									/* @__PURE__ */ jsxs("li", { children: [/* @__PURE__ */ jsx("span", {
										className: "font-semibold text-foreground",
										children: "Careers:"
									}), " careers@northeasttimeline.com"] }),
									/* @__PURE__ */ jsxs("li", { children: [/* @__PURE__ */ jsx("span", {
										className: "font-semibold text-foreground",
										children: "Corrections:"
									}), " corrections@northeasttimeline.com"] })
								]
							})] }),
							/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h3", {
								className: "mb-4 border-b-2 border-foreground pb-2 text-xs font-bold uppercase tracking-widest text-foreground",
								children: "Follow"
							}), /* @__PURE__ */ jsx(SocialIcons, { size: "md" })] })
						]
					})]
				})]
			}),
			/* @__PURE__ */ jsx(Footer, {})
		]
	});
}
//#endregion
export { ContactPage as component };
