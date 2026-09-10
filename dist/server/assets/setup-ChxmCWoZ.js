import { t as useServerFn } from "./useServerFn-BqzygRuj.js";
import { n as executeSetup, r as testDatabaseConnection } from "./setup.functions-CfLdmG1f.js";
import { useState } from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { Check, Database, Eye, EyeOff, Loader2, Server, ShieldAlert, User } from "lucide-react";
import { toast } from "sonner";
//#region src/routes/setup.tsx?tsr-split=component
function SetupWizardPage() {
	const testConnFn = useServerFn(testDatabaseConnection);
	const execSetupFn = useServerFn(executeSetup);
	const [step, setStep] = useState(1);
	const [testing, setTesting] = useState(false);
	const [installing, setInstalling] = useState(false);
	const [showDbPwd, setShowDbPwd] = useState(false);
	const [showAdminPwd, setShowAdminPwd] = useState(false);
	const [showConfirmPwd, setShowConfirmPwd] = useState(false);
	const [dbConfig, setDbConfig] = useState({
		host: "127.0.0.1",
		port: "3306",
		user: "vanguardtripura",
		password: "",
		database: "vanguarddb"
	});
	const [adminConfig, setAdminConfig] = useState({
		displayName: "Admin",
		email: "admin@demo.com",
		password: "",
		confirmPassword: ""
	});
	const handleDbChange = (e) => {
		setDbConfig({
			...dbConfig,
			[e.target.name]: e.target.value
		});
	};
	const handleAdminChange = (e) => {
		setAdminConfig({
			...adminConfig,
			[e.target.name]: e.target.value
		});
	};
	const handleTestConnection = async () => {
		if (!dbConfig.host || !dbConfig.port || !dbConfig.user || !dbConfig.database) return toast.error("All database fields except password are required");
		setTesting(true);
		try {
			const res = await testConnFn({ data: dbConfig });
			if (res.success) {
				toast.success("Database connected and verified successfully!");
				setStep(2);
			} else toast.error(res.error || "Connection failed. Double check credentials.");
		} catch (err) {
			toast.error(err.message || "Failed to query database server");
		} finally {
			setTesting(false);
		}
	};
	const handleRunSetup = async () => {
		if (!adminConfig.displayName || !adminConfig.email || !adminConfig.password) return toast.error("All administrator fields are required");
		if (adminConfig.password.length < 8) return toast.error("Password must be at least 8 characters");
		if (adminConfig.password !== adminConfig.confirmPassword) return toast.error("Passwords do not match");
		setInstalling(true);
		try {
			const res = await execSetupFn({ data: {
				dbConfig,
				adminConfig
			} });
			if (res.success) {
				toast.success("System installed successfully! Please log in.");
				setTimeout(() => {
					window.location.assign("/auth");
				}, 1500);
			} else toast.error(res.error || "Setup failed. Check database server.");
		} catch (err) {
			toast.error(err.message || "Unexpected setup error");
		} finally {
			setInstalling(false);
		}
	};
	return /* @__PURE__ */ jsxs("div", {
		className: "min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "sm:mx-auto sm:w-full sm:max-w-md text-center",
			children: [/* @__PURE__ */ jsx("h1", {
				className: "font-serif text-3xl font-bold tracking-tight text-white",
				children: "News Theme"
			}), /* @__PURE__ */ jsx("p", {
				className: "mt-2 text-sm text-slate-400",
				children: "Installation & Setup Wizard"
			})]
		}), /* @__PURE__ */ jsx("div", {
			className: "mt-8 sm:mx-auto sm:w-full sm:max-w-xl",
			children: /* @__PURE__ */ jsxs("div", {
				className: "bg-slate-800 py-8 px-4 shadow-xl rounded-lg border border-slate-700 sm:px-10",
				children: [
					/* @__PURE__ */ jsx("div", {
						className: "mb-8",
						children: /* @__PURE__ */ jsxs("div", {
							className: "flex items-center justify-between",
							children: [
								/* @__PURE__ */ jsxs("div", {
									className: "flex items-center",
									children: [/* @__PURE__ */ jsx("div", {
										className: `flex items-center justify-center h-8 w-8 rounded-full border ${step >= 1 ? "bg-amber-500 border-amber-500 text-slate-900" : "border-slate-600 text-slate-400"} font-bold text-sm`,
										children: step > 1 ? /* @__PURE__ */ jsx(Check, { className: "h-4 w-4" }) : "1"
									}), /* @__PURE__ */ jsx("span", {
										className: "ml-2 text-sm font-medium text-slate-300",
										children: "Database"
									})]
								}),
								/* @__PURE__ */ jsx("div", { className: "flex-1 h-0.5 bg-slate-700 mx-4" }),
								/* @__PURE__ */ jsxs("div", {
									className: "flex items-center",
									children: [/* @__PURE__ */ jsx("div", {
										className: `flex items-center justify-center h-8 w-8 rounded-full border ${step >= 2 ? "bg-amber-500 border-amber-500 text-slate-900" : "border-slate-600 text-slate-400"} font-bold text-sm`,
										children: step > 2 ? /* @__PURE__ */ jsx(Check, { className: "h-4 w-4" }) : "2"
									}), /* @__PURE__ */ jsx("span", {
										className: "ml-2 text-sm font-medium text-slate-300",
										children: "Admin Account"
									})]
								}),
								/* @__PURE__ */ jsx("div", { className: "flex-1 h-0.5 bg-slate-700 mx-4" }),
								/* @__PURE__ */ jsxs("div", {
									className: "flex items-center",
									children: [/* @__PURE__ */ jsx("div", {
										className: `flex items-center justify-center h-8 w-8 rounded-full border ${step >= 3 ? "bg-amber-500 border-amber-500 text-slate-900" : "border-slate-600 text-slate-400"} font-bold text-sm`,
										children: "3"
									}), /* @__PURE__ */ jsx("span", {
										className: "ml-2 text-sm font-medium text-slate-300",
										children: "Install"
									})]
								})
							]
						})
					}),
					step === 1 && /* @__PURE__ */ jsxs("div", {
						className: "space-y-6",
						children: [
							/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("h3", {
								className: "text-lg font-medium text-white flex items-center gap-2",
								children: [/* @__PURE__ */ jsx(Database, { className: "h-5 w-5 text-amber-500" }), " Connect Database"]
							}), /* @__PURE__ */ jsx("p", {
								className: "mt-1 text-xs text-slate-400",
								children: "Input connection credentials for your MySQL instance. If the database does not exist, we will try to create it."
							})] }),
							/* @__PURE__ */ jsxs("div", {
								className: "grid grid-cols-6 gap-4",
								children: [
									/* @__PURE__ */ jsxs("div", {
										className: "col-span-4 space-y-1",
										children: [/* @__PURE__ */ jsx("label", {
											className: "text-xs font-semibold text-slate-300",
											children: "MySQL Host"
										}), /* @__PURE__ */ jsx("input", {
											name: "host",
											value: dbConfig.host,
											onChange: handleDbChange,
											className: "w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-amber-500"
										})]
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "col-span-2 space-y-1",
										children: [/* @__PURE__ */ jsx("label", {
											className: "text-xs font-semibold text-slate-300",
											children: "Port"
										}), /* @__PURE__ */ jsx("input", {
											name: "port",
											value: dbConfig.port,
											onChange: handleDbChange,
											className: "w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-amber-500"
										})]
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "col-span-6 space-y-1",
										children: [/* @__PURE__ */ jsx("label", {
											className: "text-xs font-semibold text-slate-300",
											children: "Database User"
										}), /* @__PURE__ */ jsx("input", {
											name: "user",
											value: dbConfig.user,
											onChange: handleDbChange,
											className: "w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-amber-500"
										})]
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "col-span-6 space-y-1",
										children: [/* @__PURE__ */ jsx("label", {
											className: "text-xs font-semibold text-slate-300",
											children: "Database Password"
										}), /* @__PURE__ */ jsxs("div", {
											className: "relative",
											children: [/* @__PURE__ */ jsx("input", {
												type: showDbPwd ? "text" : "password",
												name: "password",
												value: dbConfig.password,
												onChange: handleDbChange,
												className: "w-full bg-slate-900 border border-slate-700 rounded-md pl-3 pr-10 py-2 text-sm text-slate-100 focus:outline-none focus:border-amber-500"
											}), /* @__PURE__ */ jsx("button", {
												type: "button",
												onClick: () => setShowDbPwd((v) => !v),
												className: "absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200",
												"aria-label": "Toggle database password visibility",
												children: showDbPwd ? /* @__PURE__ */ jsx(EyeOff, { className: "h-4 w-4" }) : /* @__PURE__ */ jsx(Eye, { className: "h-4 w-4" })
											})]
										})]
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "col-span-6 space-y-1",
										children: [/* @__PURE__ */ jsx("label", {
											className: "text-xs font-semibold text-slate-300",
											children: "Database Name"
										}), /* @__PURE__ */ jsx("input", {
											name: "database",
											value: dbConfig.database,
											onChange: handleDbChange,
											className: "w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-amber-500"
										})]
									})
								]
							}),
							/* @__PURE__ */ jsx("div", {
								className: "pt-4 flex justify-end",
								children: /* @__PURE__ */ jsx("button", {
									onClick: handleTestConnection,
									disabled: testing,
									className: "w-full inline-flex justify-center items-center gap-2 rounded-md bg-amber-500 px-4 py-2.5 text-sm font-semibold text-slate-900 hover:bg-amber-400 disabled:opacity-50",
									children: testing ? /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(Loader2, { className: "h-4 w-4 animate-spin" }), " Verifying Connection & Database..."] }) : /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(Server, { className: "h-4 w-4" }), " Next: Test Connection & Proceed"] })
								})
							})
						]
					}),
					step === 2 && /* @__PURE__ */ jsxs("div", {
						className: "space-y-6",
						children: [
							/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("h3", {
								className: "text-lg font-medium text-white flex items-center gap-2",
								children: [/* @__PURE__ */ jsx(User, { className: "h-5 w-5 text-amber-500" }), " Administrator Account"]
							}), /* @__PURE__ */ jsx("p", {
								className: "mt-1 text-xs text-slate-400",
								children: "Configure details for the master administrator login account."
							})] }),
							/* @__PURE__ */ jsxs("div", {
								className: "space-y-4",
								children: [
									/* @__PURE__ */ jsxs("div", {
										className: "space-y-1",
										children: [/* @__PURE__ */ jsx("label", {
											className: "text-xs font-semibold text-slate-300",
											children: "Full Name / Display Name"
										}), /* @__PURE__ */ jsx("input", {
											name: "displayName",
											value: adminConfig.displayName,
											onChange: handleAdminChange,
											className: "w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-amber-500"
										})]
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "space-y-1",
										children: [/* @__PURE__ */ jsx("label", {
											className: "text-xs font-semibold text-slate-300",
											children: "Email Address"
										}), /* @__PURE__ */ jsx("input", {
											type: "email",
											name: "email",
											value: adminConfig.email,
											onChange: handleAdminChange,
											className: "w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-amber-500"
										})]
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "space-y-1",
										children: [/* @__PURE__ */ jsx("label", {
											className: "text-xs font-semibold text-slate-300",
											children: "Password"
										}), /* @__PURE__ */ jsxs("div", {
											className: "relative",
											children: [/* @__PURE__ */ jsx("input", {
												type: showAdminPwd ? "text" : "password",
												name: "password",
												value: adminConfig.password,
												onChange: handleAdminChange,
												placeholder: "Min. 8 characters",
												className: "w-full bg-slate-900 border border-slate-700 rounded-md pl-3 pr-10 py-2 text-sm text-slate-100 focus:outline-none focus:border-amber-500"
											}), /* @__PURE__ */ jsx("button", {
												type: "button",
												onClick: () => setShowAdminPwd((v) => !v),
												className: "absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200",
												"aria-label": "Toggle administrator password visibility",
												children: showAdminPwd ? /* @__PURE__ */ jsx(EyeOff, { className: "h-4 w-4" }) : /* @__PURE__ */ jsx(Eye, { className: "h-4 w-4" })
											})]
										})]
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "space-y-1",
										children: [/* @__PURE__ */ jsx("label", {
											className: "text-xs font-semibold text-slate-300",
											children: "Confirm Password"
										}), /* @__PURE__ */ jsxs("div", {
											className: "relative",
											children: [/* @__PURE__ */ jsx("input", {
												type: showConfirmPwd ? "text" : "password",
												name: "confirmPassword",
												value: adminConfig.confirmPassword,
												onChange: handleAdminChange,
												className: "w-full bg-slate-900 border border-slate-700 rounded-md pl-3 pr-10 py-2 text-sm text-slate-100 focus:outline-none focus:border-amber-500"
											}), /* @__PURE__ */ jsx("button", {
												type: "button",
												onClick: () => setShowConfirmPwd((v) => !v),
												className: "absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200",
												"aria-label": "Toggle administrator confirm password visibility",
												children: showConfirmPwd ? /* @__PURE__ */ jsx(EyeOff, { className: "h-4 w-4" }) : /* @__PURE__ */ jsx(Eye, { className: "h-4 w-4" })
											})]
										})]
									})
								]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "pt-4 flex justify-between gap-4",
								children: [/* @__PURE__ */ jsx("button", {
									onClick: () => setStep(1),
									className: "w-1/3 rounded-md border border-slate-600 bg-transparent px-4 py-2.5 text-sm font-semibold text-slate-300 hover:bg-slate-700",
									children: "Back"
								}), /* @__PURE__ */ jsx("button", {
									onClick: () => {
										if (!adminConfig.displayName || !adminConfig.email || !adminConfig.password) return toast.error("All administrator fields are required");
										if (adminConfig.password.length < 8) return toast.error("Password must be at least 8 characters");
										if (adminConfig.password !== adminConfig.confirmPassword) return toast.error("Passwords do not match");
										setStep(3);
									},
									className: "w-2/3 rounded-md bg-amber-500 px-4 py-2.5 text-sm font-semibold text-slate-900 hover:bg-amber-400",
									children: "Next: Review Setup"
								})]
							})
						]
					}),
					step === 3 && /* @__PURE__ */ jsxs("div", {
						className: "space-y-6",
						children: [
							/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("h3", {
								className: "text-lg font-medium text-white flex items-center gap-2",
								children: [/* @__PURE__ */ jsx(ShieldAlert, { className: "h-5 w-5 text-amber-500" }), " Review & Install"]
							}), /* @__PURE__ */ jsx("p", {
								className: "mt-1 text-xs text-slate-400",
								children: "Ready to apply settings, generate database tables, and insert user credentials."
							})] }),
							/* @__PURE__ */ jsxs("div", {
								className: "bg-slate-900/60 p-4 rounded-md border border-slate-700 text-xs space-y-3",
								children: [
									/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("span", {
										className: "font-bold block text-slate-400",
										children: "MySQL Connection:"
									}), /* @__PURE__ */ jsxs("span", {
										className: "font-mono",
										children: [
											dbConfig.user,
											"@",
											dbConfig.host,
											":",
											dbConfig.port,
											"/",
											dbConfig.database
										]
									})] }),
									/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("span", {
										className: "font-bold block text-slate-400",
										children: "Admin Email:"
									}), /* @__PURE__ */ jsx("span", {
										className: "font-mono",
										children: adminConfig.email
									})] }),
									/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("span", {
										className: "font-bold block text-slate-400",
										children: "Admin Name:"
									}), /* @__PURE__ */ jsx("span", { children: adminConfig.displayName })] })
								]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "pt-4 flex justify-between gap-4",
								children: [/* @__PURE__ */ jsx("button", {
									onClick: () => setStep(2),
									disabled: installing,
									className: "w-1/3 rounded-md border border-slate-600 bg-transparent px-4 py-2.5 text-sm font-semibold text-slate-300 hover:bg-slate-700 disabled:opacity-50",
									children: "Back"
								}), /* @__PURE__ */ jsx("button", {
									onClick: handleRunSetup,
									disabled: installing,
									className: "w-2/3 inline-flex justify-center items-center gap-2 rounded-md bg-amber-500 px-4 py-2.5 text-sm font-semibold text-slate-900 hover:bg-amber-400 disabled:opacity-50",
									children: installing ? /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(Loader2, { className: "h-4 w-4 animate-spin" }), " Installing..."] }) : "Execute & Complete Installation"
								})]
							})
						]
					})
				]
			})
		})]
	});
}
//#endregion
export { SetupWizardPage as component };
