import { t as authClient } from "./auth-client-DSVOvzT1.js";
import { t as Label } from "./label-BPuF5-mq.js";
import { t as Button } from "./button-CtdWWMYi.js";
import { t as Input } from "./input-BLnTGgYF.js";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { toast } from "sonner";
import { z } from "zod";
//#region src/routes/reset-password.tsx?tsr-split=component
var schema = z.object({
	password: z.string().min(6, "Password must be at least 6 characters").max(72),
	confirm: z.string()
}).refine((d) => d.password === d.confirm, {
	message: "Passwords don't match",
	path: ["confirm"]
});
function ResetPasswordPage() {
	const navigate = useNavigate();
	const [loading, setLoading] = useState(false);
	const [ready, setReady] = useState(false);
	useEffect(() => {
		const { data: sub } = authClient.auth.onAuthStateChange((event) => {
			if (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN") setReady(true);
		});
		authClient.auth.getSession().then(({ data }) => {
			if (data.session) setReady(true);
		});
		return () => sub.subscription.unsubscribe();
	}, []);
	const handleSubmit = async (e) => {
		e.preventDefault();
		const fd = new FormData(e.currentTarget);
		const parsed = schema.safeParse({
			password: fd.get("password"),
			confirm: fd.get("confirm")
		});
		if (!parsed.success) {
			toast.error(parsed.error.issues[0].message);
			return;
		}
		setLoading(true);
		const { error } = await authClient.auth.updateUser({ password: parsed.data.password });
		setLoading(false);
		if (error) return toast.error(error.message);
		toast.success("Password updated");
		navigate({ to: "/" });
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
						children: "Choose a new password"
					}),
					/* @__PURE__ */ jsx("p", {
						className: "mt-1 text-sm text-muted-foreground",
						children: ready ? "Set a new password for your account." : "Open this page from the reset link in your email."
					}),
					/* @__PURE__ */ jsxs("form", {
						onSubmit: handleSubmit,
						className: "mt-6 space-y-4",
						children: [
							/* @__PURE__ */ jsxs("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ jsx(Label, {
									htmlFor: "password",
									children: "New password"
								}), /* @__PURE__ */ jsx(Input, {
									id: "password",
									name: "password",
									type: "password",
									autoComplete: "new-password",
									minLength: 6,
									required: true
								})]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ jsx(Label, {
									htmlFor: "confirm",
									children: "Confirm password"
								}), /* @__PURE__ */ jsx(Input, {
									id: "confirm",
									name: "confirm",
									type: "password",
									autoComplete: "new-password",
									minLength: 6,
									required: true
								})]
							}),
							/* @__PURE__ */ jsx(Button, {
								type: "submit",
								className: "w-full",
								disabled: loading || !ready,
								children: loading ? "Updating…" : "Update password"
							})
						]
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
export { ResetPasswordPage as component };
