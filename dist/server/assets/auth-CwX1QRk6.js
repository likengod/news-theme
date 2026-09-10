import { t as authClient } from "./auth-client-k3X20UAX.js";
import { t as cn } from "./utils-C_uf36nf.js";
import { t as Label } from "./label-BPuF5-mq.js";
import { t as Button } from "./button-CtdWWMYi.js";
import { t as Input } from "./input-BLnTGgYF.js";
import * as React$1 from "react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { AtSign, Check, Eye, EyeOff, Lock, Mail, User } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { Turnstile } from "@marsidev/react-turnstile";
//#region src/components/ui/checkbox.tsx
var Checkbox = React$1.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(CheckboxPrimitive.Root, {
	ref,
	className: cn("grid place-content-center peer h-4 w-4 shrink-0 rounded-sm border border-primary shadow cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground", className),
	...props,
	children: /* @__PURE__ */ jsx(CheckboxPrimitive.Indicator, {
		className: cn("grid place-content-center text-current"),
		children: /* @__PURE__ */ jsx(Check, { className: "h-4 w-4" })
	})
}));
Checkbox.displayName = CheckboxPrimitive.Root.displayName;
//#endregion
//#region src/components/ui/tabs.tsx
var Tabs = TabsPrimitive.Root;
var TabsList = React$1.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(TabsPrimitive.List, {
	ref,
	className: cn("inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground", className),
	...props
}));
TabsList.displayName = TabsPrimitive.List.displayName;
var TabsTrigger = React$1.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(TabsPrimitive.Trigger, {
	ref,
	className: cn("inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background cursor-pointer transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow", className),
	...props
}));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;
var TabsContent = React$1.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(TabsPrimitive.Content, {
	ref,
	className: cn("mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2", className),
	...props
}));
TabsContent.displayName = TabsPrimitive.Content.displayName;
//#endregion
//#region src/routes/auth.tsx?tsr-split=component
var signInSchema = z.object({
	identifier: z.string().trim().min(3, "Enter email, username or phone").max(255),
	password: z.string().min(6, "Password must be at least 6 characters").max(72)
});
var signUpSchema = z.object({
	firstName: z.string().trim().min(1, "First name is required").max(40),
	lastName: z.string().trim().min(1, "Last name is required").max(40),
	username: z.string().trim().min(3, "Username must be at least 3 characters").max(30).regex(/^[a-zA-Z0-9_.]+$/, "Letters, numbers, _ and . only"),
	email: z.string().trim().email("Enter a valid email").max(255),
	phone: z.string().trim().min(7, "Enter a valid phone").max(20),
	password: z.string().min(6, "Password must be at least 6 characters").max(72),
	confirmPassword: z.string().min(6).max(72),
	agree: z.literal(true, { errorMap: () => ({ message: "You must agree to the terms" }) })
}).refine((d) => d.password === d.confirmPassword, {
	message: "Passwords do not match",
	path: ["confirmPassword"]
});
function GoogleIcon() {
	return /* @__PURE__ */ jsxs("svg", {
		width: "24",
		height: "24",
		viewBox: "0 0 24 24",
		"aria-hidden": "true",
		children: [
			/* @__PURE__ */ jsx("path", {
				fill: "#4285F4",
				d: "M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
			}),
			/* @__PURE__ */ jsx("path", {
				fill: "#34A853",
				d: "M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
			}),
			/* @__PURE__ */ jsx("path", {
				fill: "#FBBC05",
				d: "M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
			}),
			/* @__PURE__ */ jsx("path", {
				fill: "#EA4335",
				d: "M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
			})
		]
	});
}
function FacebookIcon() {
	return /* @__PURE__ */ jsx("svg", {
		width: "24",
		height: "24",
		viewBox: "0 0 24 24",
		"aria-hidden": "true",
		children: /* @__PURE__ */ jsx("path", {
			fill: "#1877F2",
			d: "M24 12a12 12 0 1 0-13.9 11.9v-8.4H7.1V12h3V9.4c0-3 1.8-4.6 4.5-4.6 1.3 0 2.7.2 2.7.2v3h-1.5c-1.5 0-2 .9-2 1.9V12h3.3l-.5 3.5h-2.8v8.4A12 12 0 0 0 24 12z"
		})
	});
}
function LinkedInIcon() {
	return /* @__PURE__ */ jsx("svg", {
		width: "24",
		height: "24",
		viewBox: "0 0 24 24",
		"aria-hidden": "true",
		children: /* @__PURE__ */ jsx("path", {
			fill: "#0A66C2",
			d: "M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"
		})
	});
}
function AuthPage() {
	const navigate = useNavigate();
	const [loading, setLoading] = useState(false);
	const [showPwd, setShowPwd] = useState(false);
	const [showPwd2, setShowPwd2] = useState(false);
	const [tab, setTab] = useState("signin");
	const [showConfirm, setShowConfirm] = useState(false);
	const [agree, setAgree] = useState(false);
	const [turnstileToken, setTurnstileToken] = useState("");
	useEffect(() => {
		authClient.auth.getSession().then(({ data }) => {
			if (data.session) navigate({ to: "/" });
		});
	}, [navigate]);
	const handleSignIn = async (e) => {
		e.preventDefault();
		const fd = new FormData(e.currentTarget);
		const parsed = signInSchema.safeParse({
			identifier: fd.get("identifier"),
			password: fd.get("password")
		});
		if (!parsed.success) return toast.error(parsed.error.issues[0].message);
		setLoading(true);
		const creds = {
			email: parsed.data.identifier,
			password: parsed.data.password
		};
		const { error } = await authClient.auth.signInWithPassword(creds);
		setLoading(false);
		if (error) return toast.error(error.message);
		try {
			const { data: userData } = await authClient.auth.getUser();
			const uid = userData.user?.id;
			if (uid) {
				const { data: prof } = await authClient.from("profiles").select("active").eq("id", uid).maybeSingle();
				if (prof && prof.active === false) {
					await authClient.auth.signOut();
					return toast.error("Your account is inactive. Please contact the office.");
				}
			}
		} catch {}
		toast.success("Welcome back");
		navigate({ to: "/" });
	};
	const handleSignUp = async (e) => {
		e.preventDefault();
		if (!turnstileToken) return toast.error("Please complete the captcha verification.");
		const fd = new FormData(e.currentTarget);
		const parsed = signUpSchema.safeParse({
			firstName: fd.get("firstName"),
			lastName: fd.get("lastName"),
			username: fd.get("username"),
			email: fd.get("email"),
			phone: fd.get("phone"),
			password: fd.get("password"),
			confirmPassword: fd.get("confirmPassword"),
			agree
		});
		if (!parsed.success) return toast.error(parsed.error.issues[0].message);
		setLoading(true);
		const { error } = await authClient.auth.signUp({
			email: parsed.data.email,
			password: parsed.data.password,
			phone: parsed.data.phone,
			turnstileToken,
			options: {
				emailRedirectTo: `${window.location.origin}/`,
				data: {
					display_name: `${parsed.data.firstName} ${parsed.data.lastName}`,
					first_name: parsed.data.firstName,
					last_name: parsed.data.lastName,
					username: parsed.data.username
				}
			}
		});
		setLoading(false);
		if (error) return toast.error(error.message);
		toast.success("Account created");
		navigate({ to: "/" });
	};
	const handleGoogle = async () => {
		toast.info("Google OAuth login can be configured in Admin -> Site Settings -> Login Providers");
	};
	const handleUnsupported = (name) => {
		toast.info(`${name} sign-in is coming soon`);
	};
	return /* @__PURE__ */ jsx("div", {
		className: "min-h-screen bg-white px-4 py-12",
		children: /* @__PURE__ */ jsxs("div", {
			className: "mx-auto w-full max-w-md",
			children: [
				/* @__PURE__ */ jsxs(Tabs, {
					value: tab,
					onValueChange: (v) => setTab(v),
					className: "w-full",
					children: [
						/* @__PURE__ */ jsxs(TabsList, {
							className: "grid h-11 w-full grid-cols-2 rounded-md bg-muted p-1",
							children: [/* @__PURE__ */ jsx(TabsTrigger, {
								value: "signin",
								className: "rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm",
								children: "Sign In"
							}), /* @__PURE__ */ jsx(TabsTrigger, {
								value: "signup",
								className: "rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm",
								children: "Sign Up"
							})]
						}),
						/* @__PURE__ */ jsx(TabsContent, {
							value: "signin",
							children: /* @__PURE__ */ jsxs("div", {
								className: "mt-4 pt-4",
								children: [
									/* @__PURE__ */ jsxs("div", {
										className: "mb-6 text-center",
										children: [/* @__PURE__ */ jsx("h1", {
											className: "font-serif text-3xl font-bold tracking-tight",
											children: "Welcome Back"
										}), /* @__PURE__ */ jsx("p", {
											className: "mt-1 text-sm text-muted-foreground",
											children: "Sign in to your account to continue"
										})]
									}),
									/* @__PURE__ */ jsxs("form", {
										onSubmit: handleSignIn,
										className: "space-y-4",
										children: [
											/* @__PURE__ */ jsxs("div", {
												className: "space-y-1.5",
												children: [
													/* @__PURE__ */ jsx(Label, {
														htmlFor: "identifier",
														className: "text-sm font-semibold",
														children: "Email, Username, or Phone"
													}),
													/* @__PURE__ */ jsxs("div", {
														className: "relative",
														children: [/* @__PURE__ */ jsx(User, { className: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ jsx(Input, {
															id: "identifier",
															name: "identifier",
															type: "text",
															placeholder: "Email, username, or phone number",
															className: "pl-10",
															required: true
														})]
													}),
													/* @__PURE__ */ jsx("p", {
														className: "text-xs text-muted-foreground",
														children: "You can sign in with your email, username, or phone number"
													})
												]
											}),
											/* @__PURE__ */ jsxs("div", {
												className: "space-y-1.5",
												children: [/* @__PURE__ */ jsx(Label, {
													htmlFor: "signin-password",
													className: "text-sm font-semibold",
													children: "Password"
												}), /* @__PURE__ */ jsxs("div", {
													className: "relative",
													children: [
														/* @__PURE__ */ jsx(Lock, { className: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }),
														/* @__PURE__ */ jsx(Input, {
															id: "signin-password",
															name: "password",
															type: showPwd ? "text" : "password",
															placeholder: "Enter your password",
															autoComplete: "current-password",
															className: "px-10",
															required: true
														}),
														/* @__PURE__ */ jsx("button", {
															type: "button",
															onClick: () => setShowPwd((v) => !v),
															className: "absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground",
															"aria-label": "Toggle password",
															children: showPwd ? /* @__PURE__ */ jsx(EyeOff, { className: "h-4 w-4" }) : /* @__PURE__ */ jsx(Eye, { className: "h-4 w-4" })
														})
													]
												})]
											}),
											/* @__PURE__ */ jsxs("div", {
												className: "flex items-center justify-between",
												children: [/* @__PURE__ */ jsxs("label", {
													className: "flex items-center gap-2 text-sm font-medium",
													children: [/* @__PURE__ */ jsx(Checkbox, { id: "remember" }), "Remember me"]
												}), /* @__PURE__ */ jsx(Link, {
													to: "/forgot-password",
													className: "text-sm font-medium underline-offset-2 hover:underline",
													children: "Forgot password?"
												})]
											}),
											/* @__PURE__ */ jsx(Button, {
												type: "submit",
												className: "h-11 w-full bg-slate-800 text-white hover:bg-slate-900",
												disabled: loading,
												children: loading ? "Signing in…" : "Sign In"
											})
										]
									}),
									/* @__PURE__ */ jsx(SocialDivider, {}),
									/* @__PURE__ */ jsx(SocialRow, {
										onGoogle: handleGoogle,
										onFacebook: () => handleUnsupported("Facebook"),
										onLinkedIn: () => handleUnsupported("LinkedIn")
									}),
									/* @__PURE__ */ jsxs("p", {
										className: "mt-6 text-center text-sm text-muted-foreground",
										children: [
											"Don't have an account?",
											" ",
											/* @__PURE__ */ jsx("button", {
												onClick: () => setTab("signup"),
												className: "font-semibold text-foreground hover:underline",
												children: "Sign Up"
											})
										]
									})
								]
							})
						}),
						/* @__PURE__ */ jsx(TabsContent, {
							value: "signup",
							children: /* @__PURE__ */ jsxs("div", {
								className: "mt-4 pt-4",
								children: [
									/* @__PURE__ */ jsxs("div", {
										className: "mb-6 text-center",
										children: [/* @__PURE__ */ jsx("h1", {
											className: "font-serif text-3xl font-bold tracking-tight",
											children: "Create Account"
										}), /* @__PURE__ */ jsx("p", {
											className: "mt-1 text-sm text-muted-foreground",
											children: "Join News Theme today"
										})]
									}),
									/* @__PURE__ */ jsxs("form", {
										onSubmit: handleSignUp,
										className: "space-y-4",
										children: [
											/* @__PURE__ */ jsxs("div", {
												className: "grid grid-cols-2 gap-3",
												children: [/* @__PURE__ */ jsxs("div", {
													className: "space-y-1.5",
													children: [/* @__PURE__ */ jsx(Label, {
														htmlFor: "firstName",
														className: "text-sm font-semibold",
														children: "First Name"
													}), /* @__PURE__ */ jsxs("div", {
														className: "relative",
														children: [/* @__PURE__ */ jsx(User, { className: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ jsx(Input, {
															id: "firstName",
															name: "firstName",
															type: "text",
															placeholder: "First name",
															autoComplete: "given-name",
															className: "pl-10",
															required: true
														})]
													})]
												}), /* @__PURE__ */ jsxs("div", {
													className: "space-y-1.5",
													children: [/* @__PURE__ */ jsx(Label, {
														htmlFor: "lastName",
														className: "text-sm font-semibold",
														children: "Last Name"
													}), /* @__PURE__ */ jsxs("div", {
														className: "relative",
														children: [/* @__PURE__ */ jsx(User, { className: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ jsx(Input, {
															id: "lastName",
															name: "lastName",
															type: "text",
															placeholder: "Last name",
															autoComplete: "family-name",
															className: "pl-10",
															required: true
														})]
													})]
												})]
											}),
											/* @__PURE__ */ jsxs("div", {
												className: "space-y-1.5",
												children: [/* @__PURE__ */ jsx(Label, {
													htmlFor: "username",
													className: "text-sm font-semibold",
													children: "Username"
												}), /* @__PURE__ */ jsxs("div", {
													className: "relative",
													children: [/* @__PURE__ */ jsx(AtSign, { className: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ jsx(Input, {
														id: "username",
														name: "username",
														type: "text",
														placeholder: "Choose a unique username",
														autoComplete: "username",
														className: "pl-10",
														required: true
													})]
												})]
											}),
											/* @__PURE__ */ jsxs("div", {
												className: "space-y-1.5",
												children: [/* @__PURE__ */ jsx(Label, {
													htmlFor: "signup-email",
													className: "text-sm font-semibold",
													children: "Email Address"
												}), /* @__PURE__ */ jsxs("div", {
													className: "relative",
													children: [/* @__PURE__ */ jsx(Mail, { className: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ jsx(Input, {
														id: "signup-email",
														name: "email",
														type: "email",
														placeholder: "Enter your email",
														autoComplete: "email",
														className: "pl-10",
														required: true
													})]
												})]
											}),
											/* @__PURE__ */ jsxs("div", {
												className: "space-y-1.5",
												children: [/* @__PURE__ */ jsx(Label, {
													htmlFor: "phone",
													className: "text-sm font-semibold",
													children: "Phone Number"
												}), /* @__PURE__ */ jsxs("div", {
													className: "flex overflow-hidden rounded-md border border-input bg-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
													children: [
														/* @__PURE__ */ jsxs("div", {
															className: "relative flex items-center border-r border-input bg-muted/50 px-3",
															children: [/* @__PURE__ */ jsxs("select", {
																className: "appearance-none bg-transparent pr-4 text-sm outline-none font-medium text-muted-foreground",
																children: [
																	/* @__PURE__ */ jsx("option", { children: "Mobile" }),
																	/* @__PURE__ */ jsx("option", { children: "Home" }),
																	/* @__PURE__ */ jsx("option", { children: "Work" })
																]
															}), /* @__PURE__ */ jsx("svg", {
																className: "absolute right-2 h-3 w-3 text-muted-foreground pointer-events-none",
																fill: "none",
																stroke: "currentColor",
																viewBox: "0 0 24 24",
																children: /* @__PURE__ */ jsx("path", {
																	strokeLinecap: "round",
																	strokeLinejoin: "round",
																	strokeWidth: 2,
																	d: "M19 9l-7 7-7-7"
																})
															})]
														}),
														/* @__PURE__ */ jsx("div", {
															className: "flex items-center border-r border-input bg-muted/20 px-3",
															children: /* @__PURE__ */ jsx("span", {
																className: "text-sm font-medium text-muted-foreground",
																children: "+91"
															})
														}),
														/* @__PURE__ */ jsx("input", {
															id: "phone",
															name: "phone",
															type: "tel",
															placeholder: "Phone number",
															autoComplete: "tel",
															className: "flex-1 bg-transparent px-3 py-2 text-sm outline-none",
															required: true
														})
													]
												})]
											}),
											/* @__PURE__ */ jsxs("div", {
												className: "space-y-1.5",
												children: [/* @__PURE__ */ jsx(Label, {
													htmlFor: "signup-password",
													className: "text-sm font-semibold",
													children: "Password"
												}), /* @__PURE__ */ jsxs("div", {
													className: "relative",
													children: [
														/* @__PURE__ */ jsx(Lock, { className: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }),
														/* @__PURE__ */ jsx(Input, {
															id: "signup-password",
															name: "password",
															type: showPwd2 ? "text" : "password",
															placeholder: "Create password",
															autoComplete: "new-password",
															minLength: 6,
															className: "px-10",
															required: true
														}),
														/* @__PURE__ */ jsx("button", {
															type: "button",
															onClick: () => setShowPwd2((v) => !v),
															className: "absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground",
															"aria-label": "Toggle password",
															children: showPwd2 ? /* @__PURE__ */ jsx(EyeOff, { className: "h-4 w-4" }) : /* @__PURE__ */ jsx(Eye, { className: "h-4 w-4" })
														})
													]
												})]
											}),
											/* @__PURE__ */ jsxs("div", {
												className: "space-y-1.5",
												children: [/* @__PURE__ */ jsx(Label, {
													htmlFor: "confirmPassword",
													className: "text-sm font-semibold",
													children: "Re-enter Password"
												}), /* @__PURE__ */ jsxs("div", {
													className: "relative",
													children: [
														/* @__PURE__ */ jsx(Lock, { className: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }),
														/* @__PURE__ */ jsx(Input, {
															id: "confirmPassword",
															name: "confirmPassword",
															type: showConfirm ? "text" : "password",
															placeholder: "Confirm password",
															autoComplete: "new-password",
															minLength: 6,
															className: "px-10",
															required: true
														}),
														/* @__PURE__ */ jsx("button", {
															type: "button",
															onClick: () => setShowConfirm((v) => !v),
															className: "absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground",
															"aria-label": "Toggle password",
															children: showConfirm ? /* @__PURE__ */ jsx(EyeOff, { className: "h-4 w-4" }) : /* @__PURE__ */ jsx(Eye, { className: "h-4 w-4" })
														})
													]
												})]
											}),
											/* @__PURE__ */ jsxs("label", {
												className: "flex items-start gap-3 text-sm",
												children: [/* @__PURE__ */ jsx(Checkbox, {
													id: "agree",
													checked: agree,
													onCheckedChange: (v) => setAgree(v === true),
													className: "mt-1 h-5 w-5 rounded shadow-sm border-slate-300 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
												}), /* @__PURE__ */ jsxs("span", {
													className: "leading-snug text-slate-700",
													children: [
														"I confirm that I have read, consent and agree to Gorilla Tech's",
														" ",
														/* @__PURE__ */ jsx(Link, {
															to: "/terms-and-conditions",
															className: "font-semibold text-blue-600 hover:underline",
															children: "User Agreement"
														}),
														" ",
														"and",
														" ",
														/* @__PURE__ */ jsx(Link, {
															to: "/privacy-policy",
															className: "font-semibold text-blue-600 hover:underline",
															children: "Privacy Policy"
														}),
														", and I am of legal age. I understand that I can change my communication preferences any time in my Account."
													]
												})]
											}),
											/* @__PURE__ */ jsx("div", {
												className: "flex justify-center my-4 overflow-hidden",
												children: /* @__PURE__ */ jsx(Turnstile, {
													siteKey: "1x00000000000000000000AA",
													onSuccess: setTurnstileToken
												})
											}),
											/* @__PURE__ */ jsx(Button, {
												type: "submit",
												className: "h-12 w-full rounded-md bg-blue-600 text-base font-medium text-white hover:bg-blue-700 disabled:bg-blue-400 disabled:opacity-100",
												disabled: loading || !agree,
												children: loading ? "Please wait…" : "Continue"
											})
										]
									}),
									/* @__PURE__ */ jsx(SocialDivider, {}),
									/* @__PURE__ */ jsx(SocialRow, {
										onGoogle: handleGoogle,
										onFacebook: () => handleUnsupported("Facebook"),
										onLinkedIn: () => handleUnsupported("LinkedIn")
									}),
									/* @__PURE__ */ jsxs("p", {
										className: "mt-6 text-center text-sm text-muted-foreground",
										children: [
											"Already have an account?",
											" ",
											/* @__PURE__ */ jsx("button", {
												onClick: () => setTab("signin"),
												className: "font-semibold text-foreground hover:underline",
												children: "Sign In"
											})
										]
									})
								]
							})
						})
					]
				}),
				/* @__PURE__ */ jsx("p", {
					className: "mt-6 text-center text-xs text-muted-foreground",
					children: /* @__PURE__ */ jsx(Link, {
						to: "/",
						className: "hover:underline",
						children: "← Back to home"
					})
				}),
				/* @__PURE__ */ jsxs("p", {
					className: "mt-2.5 text-center text-xs text-muted-foreground",
					children: [
						"Built by",
						" ",
						/* @__PURE__ */ jsx("a", {
							href: "https://gorillatechsolution.com",
							target: "_blank",
							rel: "noopener noreferrer",
							className: "font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 hover:underline",
							children: "Gorilla Tech Solution"
						})
					]
				})
			]
		})
	});
}
function SocialDivider() {
	return /* @__PURE__ */ jsxs("div", {
		className: "my-6 flex items-center gap-3",
		children: [
			/* @__PURE__ */ jsx("div", { className: "h-px flex-1 bg-border" }),
			/* @__PURE__ */ jsx("span", {
				className: "text-xs font-medium uppercase tracking-wider text-muted-foreground",
				children: "Or continue with"
			}),
			/* @__PURE__ */ jsx("div", { className: "h-px flex-1 bg-border" })
		]
	});
}
function SocialRow({ onGoogle, onFacebook, onLinkedIn }) {
	const base = "flex h-12 w-12 items-center justify-center rounded-full transition hover:bg-muted";
	return /* @__PURE__ */ jsxs("div", {
		className: "flex justify-center gap-6",
		children: [
			/* @__PURE__ */ jsx("button", {
				type: "button",
				onClick: onGoogle,
				"aria-label": "Continue with Google",
				className: base,
				children: /* @__PURE__ */ jsx(GoogleIcon, {})
			}),
			/* @__PURE__ */ jsx("button", {
				type: "button",
				onClick: onFacebook,
				"aria-label": "Continue with Facebook",
				className: base,
				children: /* @__PURE__ */ jsx(FacebookIcon, {})
			}),
			/* @__PURE__ */ jsx("button", {
				type: "button",
				onClick: onLinkedIn,
				"aria-label": "Continue with LinkedIn",
				className: base,
				children: /* @__PURE__ */ jsx(LinkedInIcon, {})
			})
		]
	});
}
//#endregion
export { AuthPage as component };
