import { t as authClient } from "./auth-client-BNzO1eWT.js";
import { t as Label } from "./label-BPuF5-mq.js";
import { t as Button } from "./button-CtdWWMYi.js";
import { t as Input } from "./input-BLnTGgYF.js";
import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { toast } from "sonner";
import { z } from "zod";
//#region src/routes/forgot-password.tsx?tsr-split=component
var schema = z.object({ email: z.string().trim().email("Enter a valid email").max(255) });
function ForgotPasswordPage() {
	const [loading, setLoading] = useState(false);
	const [sent, setSent] = useState(false);
	const handleSubmit = async (e) => {
		e.preventDefault();
		const fd = new FormData(e.currentTarget);
		const parsed = schema.safeParse({ email: fd.get("email") });
		if (!parsed.success) {
			toast.error(parsed.error.issues[0].message);
			return;
		}
		setLoading(true);
		const { error } = await authClient.auth.resetPasswordForEmail(parsed.data.email, { redirectTo: `${window.location.origin}/reset-password` });
		setLoading(false);
		if (error) return toast.error(error.message);
		setSent(true);
		toast.success("Reset link sent — check your inbox");
	};
	return /* @__PURE__ */ jsx("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4 py-12",
		children: /* @__PURE__ */ jsxs("div", {
			className: "w-full max-w-md",
			children: [/* @__PURE__ */ jsx("div", {
				className: "mb-8 text-center",
				children: /* @__PURE__ */ jsx(Link, {
					to: "/",
					className: "text-2xl font-extrabold uppercase tracking-tight",
					children: "News Theme"
				})
			}), /* @__PURE__ */ jsxs("div", {
				className: "rounded-lg border border-border bg-card p-6",
				children: [
					/* @__PURE__ */ jsx("h1", {
						className: "text-xl font-semibold",
						children: "Forgot your password?"
					}),
					/* @__PURE__ */ jsx("p", {
						className: "mt-1 text-sm text-muted-foreground",
						children: "Enter your email and we'll send you a link to reset it."
					}),
					sent ? /* @__PURE__ */ jsx("p", {
						className: "mt-6 rounded-md bg-muted p-4 text-sm",
						children: "If an account exists for that email, a reset link is on the way."
					}) : /* @__PURE__ */ jsxs("form", {
						onSubmit: handleSubmit,
						className: "mt-6 space-y-4",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ jsx(Label, {
								htmlFor: "email",
								children: "Email"
							}), /* @__PURE__ */ jsx(Input, {
								id: "email",
								name: "email",
								type: "email",
								autoComplete: "email",
								required: true
							})]
						}), /* @__PURE__ */ jsx(Button, {
							type: "submit",
							className: "w-full",
							disabled: loading,
							children: loading ? "Sending…" : "Send reset link"
						})]
					}),
					/* @__PURE__ */ jsx("p", {
						className: "mt-6 text-center text-xs text-muted-foreground",
						children: /* @__PURE__ */ jsx(Link, {
							to: "/auth",
							className: "hover:underline",
							children: "← Back to sign in"
						})
					})
				]
			})]
		})
	});
}
//#endregion
export { ForgotPasswordPage as component };
