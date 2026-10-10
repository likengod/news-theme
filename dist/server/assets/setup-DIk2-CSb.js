import { t as useServerFn } from "./useServerFn-BqzygRuj.js";
import { n as executeSetup, r as testDatabaseConnection } from "./setup.functions-DcUm0aR_.js";
import { useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
import { Check, Database, Eye, EyeOff, Loader2, Server, ShieldAlert, User } from "lucide-react";
import { toast } from "sonner";
//#region src/components/setup/SetupStepIndicator.tsx
function SetupStepIndicator({ step }) {
	return /* @__PURE__ */ jsx("div", {
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
	});
}
//#endregion
//#region src/components/setup/SetupDatabaseStep.tsx
function SetupDatabaseStep({ dbConfig, handleDbChange, showDbPwd, setShowDbPwd, testing, handleTestConnection }) {
	return /* @__PURE__ */ jsxs("div", {
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
						className: "col-span-6 sm:col-span-3 space-y-1",
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
						className: "col-span-6 sm:col-span-3 space-y-1",
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
								onClick: () => setShowDbPwd(!showDbPwd),
								className: "absolute right-3 top-2.5 text-slate-400 hover:text-slate-200",
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
				className: "pt-4 border-t border-slate-700 flex justify-end",
				children: /* @__PURE__ */ jsxs("button", {
					onClick: handleTestConnection,
					disabled: testing,
					className: "inline-flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-900 rounded-md font-bold text-sm transition disabled:opacity-50",
					children: [testing && /* @__PURE__ */ jsx(Loader2, { className: "h-4 w-4 animate-spin" }), "Test & Continue"]
				})
			})
		]
	});
}
//#endregion
//#region src/components/setup/SetupAdminStep.tsx
function SetupAdminStep({ adminConfig, handleAdminChange, showAdminPwd, setShowAdminPwd, showConfirmPwd, setShowConfirmPwd, onBack, onNext }) {
	return /* @__PURE__ */ jsxs("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("h3", {
				className: "text-lg font-medium text-white flex items-center gap-2",
				children: [/* @__PURE__ */ jsx(User, { className: "h-5 w-5 text-amber-500" }), " Create Super Administrator"]
			}), /* @__PURE__ */ jsx("p", {
				className: "mt-1 text-xs text-slate-400",
				children: "This account will have full access to manage content, news articles, journalists, and system settings."
			})] }),
			/* @__PURE__ */ jsxs("div", {
				className: "space-y-4",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "space-y-1",
						children: [/* @__PURE__ */ jsx("label", {
							className: "text-xs font-semibold text-slate-300",
							children: "Display Name"
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
							children: "Admin Email"
						}), /* @__PURE__ */ jsx("input", {
							type: "email",
							name: "email",
							value: adminConfig.email,
							onChange: handleAdminChange,
							className: "w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-amber-500"
						})]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "grid grid-cols-1 sm:grid-cols-2 gap-4",
						children: [/* @__PURE__ */ jsxs("div", {
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
									placeholder: "At least 8 characters",
									className: "w-full bg-slate-900 border border-slate-700 rounded-md pl-3 pr-10 py-2 text-sm text-slate-100 focus:outline-none focus:border-amber-500"
								}), /* @__PURE__ */ jsx("button", {
									type: "button",
									onClick: () => setShowAdminPwd(!showAdminPwd),
									className: "absolute right-3 top-2.5 text-slate-400 hover:text-slate-200",
									children: showAdminPwd ? /* @__PURE__ */ jsx(EyeOff, { className: "h-4 w-4" }) : /* @__PURE__ */ jsx(Eye, { className: "h-4 w-4" })
								})]
							})]
						}), /* @__PURE__ */ jsxs("div", {
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
									onClick: () => setShowConfirmPwd(!showConfirmPwd),
									className: "absolute right-3 top-2.5 text-slate-400 hover:text-slate-200",
									children: showConfirmPwd ? /* @__PURE__ */ jsx(EyeOff, { className: "h-4 w-4" }) : /* @__PURE__ */ jsx(Eye, { className: "h-4 w-4" })
								})]
							})]
						})]
					})
				]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "pt-4 border-t border-slate-700 flex justify-between",
				children: [/* @__PURE__ */ jsx("button", {
					onClick: onBack,
					className: "px-4 py-2 border border-slate-600 rounded-md text-sm font-semibold text-slate-300 hover:bg-slate-700",
					children: "Back"
				}), /* @__PURE__ */ jsx("button", {
					onClick: onNext,
					className: "px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-900 rounded-md font-bold text-sm transition",
					children: "Review & Confirm"
				})]
			})
		]
	});
}
//#endregion
//#region src/components/setup/SetupReviewStep.tsx
function SetupReviewStep({ dbConfig, adminConfig, installing, onBack, onRunSetup }) {
	return /* @__PURE__ */ jsxs("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("h3", {
				className: "text-lg font-medium text-white flex items-center gap-2",
				children: [/* @__PURE__ */ jsx(Server, { className: "h-5 w-5 text-amber-500" }), " Review & Initialize"]
			}), /* @__PURE__ */ jsx("p", {
				className: "mt-1 text-xs text-slate-400",
				children: "Everything is configured. Clicking install will create the tables, seed initial categories, and set up your administrator credentials."
			})] }),
			/* @__PURE__ */ jsx("div", {
				className: "bg-slate-900 border border-slate-700/80 rounded-lg p-4 space-y-3",
				children: /* @__PURE__ */ jsxs("div", {
					className: "text-xs space-y-1.5 text-slate-300",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "flex justify-between border-b border-slate-800 pb-1.5",
							children: [/* @__PURE__ */ jsx("span", {
								className: "text-slate-400",
								children: "Database:"
							}), /* @__PURE__ */ jsx("span", {
								className: "font-mono text-amber-400",
								children: dbConfig.database
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "flex justify-between border-b border-slate-800 pb-1.5",
							children: [/* @__PURE__ */ jsx("span", {
								className: "text-slate-400",
								children: "MySQL Host:"
							}), /* @__PURE__ */ jsxs("span", {
								className: "font-mono",
								children: [
									dbConfig.host,
									":",
									dbConfig.port
								]
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "flex justify-between border-b border-slate-800 pb-1.5",
							children: [/* @__PURE__ */ jsx("span", {
								className: "text-slate-400",
								children: "Database User:"
							}), /* @__PURE__ */ jsx("span", {
								className: "font-mono",
								children: dbConfig.user
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "flex justify-between border-b border-slate-800 pb-1.5",
							children: [/* @__PURE__ */ jsx("span", {
								className: "text-slate-400",
								children: "Super Admin Name:"
							}), /* @__PURE__ */ jsx("span", { children: adminConfig.displayName })]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "flex justify-between",
							children: [/* @__PURE__ */ jsx("span", {
								className: "text-slate-400",
								children: "Super Admin Email:"
							}), /* @__PURE__ */ jsx("span", {
								className: "font-mono text-amber-400",
								children: adminConfig.email
							})]
						})
					]
				})
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "bg-amber-500/10 border border-amber-500/20 rounded-md p-3 flex items-start gap-2.5",
				children: [/* @__PURE__ */ jsx(ShieldAlert, { className: "h-4 w-4 text-amber-400 shrink-0 mt-0.5" }), /* @__PURE__ */ jsxs("p", {
					className: "text-xs text-amber-300 leading-relaxed",
					children: [
						"The installation process will write a ",
						/* @__PURE__ */ jsx("code", { children: "db-config.json" }),
						" file to the application root. Make sure this file is not committed publicly."
					]
				})]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "pt-4 border-t border-slate-700 flex justify-between",
				children: [/* @__PURE__ */ jsx("button", {
					onClick: onBack,
					disabled: installing,
					className: "px-4 py-2 border border-slate-600 rounded-md text-sm font-semibold text-slate-300 hover:bg-slate-700 disabled:opacity-50",
					children: "Back"
				}), /* @__PURE__ */ jsxs("button", {
					onClick: onRunSetup,
					disabled: installing,
					className: "inline-flex items-center gap-2 px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-900 rounded-md font-bold text-sm transition disabled:opacity-50",
					children: [installing && /* @__PURE__ */ jsx(Loader2, { className: "h-4 w-4 animate-spin" }), installing ? "Installing System..." : "Complete Installation"]
				})]
			})
		]
	});
}
//#endregion
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
					/* @__PURE__ */ jsx(SetupStepIndicator, { step }),
					step === 1 && /* @__PURE__ */ jsx(SetupDatabaseStep, {
						dbConfig,
						handleDbChange,
						showDbPwd,
						setShowDbPwd,
						testing,
						handleTestConnection
					}),
					step === 2 && /* @__PURE__ */ jsx(SetupAdminStep, {
						adminConfig,
						handleAdminChange,
						showAdminPwd,
						setShowAdminPwd,
						showConfirmPwd,
						setShowConfirmPwd,
						onBack: () => setStep(1),
						onNext: () => {
							if (!adminConfig.displayName || !adminConfig.email || !adminConfig.password) return toast.error("All administrator fields are required");
							if (adminConfig.password.length < 8) return toast.error("Password must be at least 8 characters");
							if (adminConfig.password !== adminConfig.confirmPassword) return toast.error("Passwords do not match");
							setStep(3);
						}
					}),
					step === 3 && /* @__PURE__ */ jsx(SetupReviewStep, {
						dbConfig,
						adminConfig,
						installing,
						onBack: () => setStep(2),
						onRunSetup: handleRunSetup
					})
				]
			})
		})]
	});
}
//#endregion
export { SetupWizardPage as component };

//# sourceMappingURL=setup-DIk2-CSb.js.map