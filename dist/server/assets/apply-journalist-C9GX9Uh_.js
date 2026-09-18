import { t as authClient } from "./auth-client-W0Yu51KU.js";
import { t as Footer } from "./Footer-Dw2KKTX3.js";
import { t as Header } from "./Header-D8hj9vEk.js";
import { u as submitJournalistApplication } from "./inbox.functions-R9LjLinC.js";
import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { ArrowRight, CheckCircle2, FileText, Image, Loader2, Lock, MapPin, Newspaper, ShieldCheck, Upload, User, X } from "lucide-react";
import { toast } from "sonner";
//#region src/routes/apply-journalist.tsx?tsr-split=component
function ApplyJournalistPage() {
	const [userId, setUserId] = useState(null);
	const [userEmail, setUserEmail] = useState(null);
	const [userDisplayName, setUserDisplayName] = useState(null);
	const [authLoading, setAuthLoading] = useState(true);
	const [displayName, setDisplayName] = useState("");
	const [email, setEmail] = useState("");
	const [phone, setPhone] = useState("");
	const [fatherName, setFatherName] = useState("");
	const [motherName, setMotherName] = useState("");
	const [gender, setGender] = useState("");
	const [maritalStatus, setMaritalStatus] = useState("");
	const [husbandName, setHusbandName] = useState("");
	const [bloodGroup, setBloodGroup] = useState("");
	const [documentType, setDocumentType] = useState("");
	const [documentUrl, setDocumentUrl] = useState("");
	const docFileInputRef = useRef(null);
	const [address, setAddress] = useState("");
	const [state, setState] = useState("");
	const [country, setCountry] = useState("India");
	const [pinCode, setPinCode] = useState("");
	const [avatarUrl, setAvatarUrl] = useState("");
	const fileInputRef = useRef(null);
	const [submitting, setSubmitting] = useState(false);
	const [submitted, setSubmitted] = useState(false);
	useEffect(() => {
		authClient.auth.getSession().then(({ data }) => {
			if (data.session?.user) {
				const u = data.session.user;
				setUserId(u.id);
				const userMail = u.email || "";
				setUserEmail(userMail);
				setEmail(userMail);
				const dName = u.user_metadata?.display_name || u.user_metadata?.full_name || userMail.split("@")[0] || "";
				setUserDisplayName(dName);
				setDisplayName(dName);
			}
		}).finally(() => setAuthLoading(false));
	}, []);
	const handleAvatarFile = (file) => {
		if (!file) return;
		if (!file.type.startsWith("image/")) {
			toast.error("Please select a valid image file (JPG, PNG, WEBP).");
			return;
		}
		if (file.size > 5 * 1024 * 1024) {
			toast.error("Image must be smaller than 5 MB.");
			return;
		}
		const reader = new FileReader();
		reader.onload = (e) => {
			const result = e.target?.result;
			setAvatarUrl(result);
		};
		reader.readAsDataURL(file);
	};
	const clearAvatar = () => {
		setAvatarUrl("");
		if (fileInputRef.current) fileInputRef.current.value = "";
	};
	const handleDocumentFile = (file) => {
		if (!file) return;
		if (!file.type.startsWith("image/")) {
			toast.error("Please select a valid image file (JPG, PNG, WEBP).");
			return;
		}
		if (file.size > 1 * 1024 * 1024) {
			toast.error("Document image must be less than 1 MB.");
			return;
		}
		const reader = new FileReader();
		reader.onload = (e) => {
			const result = e.target?.result;
			setDocumentUrl(result);
		};
		reader.readAsDataURL(file);
	};
	const clearDocument = () => {
		setDocumentUrl("");
		if (docFileInputRef.current) docFileInputRef.current.value = "";
	};
	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!displayName.trim()) {
			toast.error("Full name is required.");
			return;
		}
		if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email.trim())) {
			toast.error("Valid email is required.");
			return;
		}
		if (!phone.trim()) {
			toast.error("Contact phone number is required.");
			return;
		}
		if (gender === "Female" && maritalStatus === "Married" && !husbandName.trim()) {
			toast.error("Husband's name is required for married female applicants.");
			return;
		}
		if (documentType && !documentUrl) {
			toast.error(`Please upload your ${documentType} image (under 1 MB).`);
			return;
		}
		if (documentUrl && !documentType) {
			toast.error("Please select which document type you provided.");
			return;
		}
		setSubmitting(true);
		try {
			await submitJournalistApplication({ data: {
				displayName: displayName.trim(),
				email: email.trim(),
				phone: phone.trim(),
				bloodGroup: bloodGroup.trim(),
				fatherName: fatherName.trim(),
				motherName: motherName.trim(),
				gender: gender.trim(),
				maritalStatus: maritalStatus.trim(),
				husbandName: gender === "Female" && maritalStatus === "Married" ? husbandName.trim() : "",
				documentType: documentType.trim(),
				documentUrl: documentUrl.trim(),
				avatarUrl,
				address: address.trim(),
				state: state.trim(),
				country: country.trim(),
				pinCode: pinCode.trim(),
				bio: ""
			} });
			setSubmitted(true);
			toast.success("Application submitted successfully!");
			window.scrollTo({
				top: 0,
				behavior: "smooth"
			});
		} catch (err) {
			toast.error(err.message || "Failed to submit application. Please try again.");
		} finally {
			setSubmitting(false);
		}
	};
	return /* @__PURE__ */ jsxs("div", {
		className: "min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between",
		children: [
			/* @__PURE__ */ jsx(Header, {}),
			/* @__PURE__ */ jsxs("main", {
				className: "mx-auto w-full max-w-4xl px-4 py-10 sm:py-14",
				children: [/* @__PURE__ */ jsx("div", {
					className: "mb-8 text-center sm:text-left sm:flex sm:items-center sm:justify-between sm:border-b sm:border-slate-200 sm:pb-6",
					children: /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("div", {
						className: "inline-flex items-center gap-2 rounded-full bg-indigo-50 border border-indigo-200 px-3 py-1 text-xs font-semibold text-indigo-700 mb-3",
						children: [/* @__PURE__ */ jsx(Newspaper, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ jsx("span", { children: "Newsroom Accreditation" })]
					}), /* @__PURE__ */ jsx("h1", {
						className: "text-2xl sm:text-3xl font-black tracking-tight text-slate-900",
						children: "Journalist Verification & Accreditation Form"
					})] })
				}), authLoading ? /* @__PURE__ */ jsxs("div", {
					className: "flex flex-col items-center justify-center py-20",
					children: [/* @__PURE__ */ jsx(Loader2, { className: "h-8 w-8 animate-spin text-slate-400" }), /* @__PURE__ */ jsx("p", {
						className: "mt-3 text-xs text-slate-400",
						children: "Verifying session..."
					})]
				}) : submitted ? /* @__PURE__ */ jsxs("div", {
					className: "rounded-2xl border border-emerald-200 bg-white p-8 sm:p-12 text-center shadow-sm",
					children: [
						/* @__PURE__ */ jsx("div", {
							className: "mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600",
							children: /* @__PURE__ */ jsx(CheckCircle2, { className: "h-8 w-8" })
						}),
						/* @__PURE__ */ jsx("h2", {
							className: "mt-5 text-2xl font-bold text-slate-900",
							children: "Application Submitted!"
						}),
						/* @__PURE__ */ jsxs("p", {
							className: "mx-auto mt-2 max-w-lg text-sm text-slate-600 leading-relaxed",
							children: [
								"Thank you, ",
								/* @__PURE__ */ jsx("strong", { children: displayName }),
								". Your journalist verification application has been recorded and sent directly to our editorial inbox. Once approved by our administrators, your account will be granted official Journalist status and press card credentials."
							]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "mt-8 flex flex-wrap justify-center gap-4",
							children: [/* @__PURE__ */ jsx(Link, {
								to: "/",
								className: "rounded-lg bg-slate-900 px-6 py-2.5 text-xs sm:text-sm font-semibold text-white hover:bg-slate-800 transition",
								children: "Return to Homepage"
							}), /* @__PURE__ */ jsx(Link, {
								to: "/profile",
								className: "rounded-lg border border-slate-300 bg-white px-6 py-2.5 text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-50 transition",
								children: "View Your Profile"
							})]
						})
					]
				}) : !userId ? /* @__PURE__ */ jsxs("div", {
					className: "rounded-2xl border border-slate-200 bg-white p-8 sm:p-12 text-center shadow-sm",
					children: [
						/* @__PURE__ */ jsx("div", {
							className: "mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-amber-50 text-amber-600 border border-amber-200",
							children: /* @__PURE__ */ jsx(Lock, { className: "h-7 w-7" })
						}),
						/* @__PURE__ */ jsx("h2", {
							className: "mt-4 text-xl font-bold text-slate-900",
							children: "Please Sign In to Access This Form"
						}),
						/* @__PURE__ */ jsx("p", {
							className: "mx-auto mt-2 max-w-md text-sm text-slate-600 leading-relaxed",
							children: "You must be signed in with your user account so your journalist credentials and approved status can be linked directly to your profile."
						}),
						/* @__PURE__ */ jsx("div", {
							className: "mt-6",
							children: /* @__PURE__ */ jsxs(Link, {
								to: "/auth",
								search: { redirect: "/apply-journalist" },
								className: "inline-flex items-center gap-2 rounded-xl bg-slate-900 px-7 py-3 text-sm font-bold text-white shadow-md hover:bg-slate-800 transition active:scale-95",
								children: [/* @__PURE__ */ jsx("span", { children: "Sign In or Create Account" }), /* @__PURE__ */ jsx(ArrowRight, { className: "h-4 w-4" })]
							})
						})
					]
				}) : /* @__PURE__ */ jsxs("div", {
					className: "rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 bg-slate-50/70 px-6 py-3.5",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-2.5 text-xs text-slate-700",
							children: [/* @__PURE__ */ jsx(ShieldCheck, { className: "h-4 w-4 text-emerald-600" }), /* @__PURE__ */ jsxs("span", { children: [
								"Logged in as: ",
								/* @__PURE__ */ jsx("strong", { children: userDisplayName || "User" }),
								" (",
								userEmail,
								")"
							] })]
						}), /* @__PURE__ */ jsx("span", {
							className: "rounded-full bg-emerald-100 text-emerald-800 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider",
							children: "Account Active"
						})]
					}), /* @__PURE__ */ jsxs("form", {
						onSubmit: handleSubmit,
						className: "p-6 sm:p-8 space-y-6",
						children: [
							/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("h3", {
								className: "text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-1.5",
								children: [/* @__PURE__ */ jsx(User, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ jsx("span", { children: "1. Personal Information" })]
							}), /* @__PURE__ */ jsxs("div", {
								className: "grid gap-4 sm:grid-cols-2",
								children: [
									/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("label", {
										className: "block text-xs font-semibold text-slate-700 mb-1.5",
										children: ["Full Name ", /* @__PURE__ */ jsx("span", {
											className: "text-red-500",
											children: "*"
										})]
									}), /* @__PURE__ */ jsx("input", {
										type: "text",
										required: true,
										value: displayName,
										onChange: (e) => setDisplayName(e.target.value),
										placeholder: "e.g. Kiran Nath",
										className: "h-10 w-full rounded-lg border border-slate-200 px-3.5 text-sm focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
									})] }),
									/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("label", {
										className: "block text-xs font-semibold text-slate-700 mb-1.5",
										children: ["Email Address ", /* @__PURE__ */ jsx("span", {
											className: "text-red-500",
											children: "*"
										})]
									}), /* @__PURE__ */ jsx("input", {
										type: "email",
										required: true,
										value: email,
										onChange: (e) => setEmail(e.target.value),
										placeholder: "journalist@example.com",
										className: "h-10 w-full rounded-lg border border-slate-200 px-3.5 text-sm focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
									})] }),
									/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("label", {
										className: "block text-xs font-semibold text-slate-700 mb-1.5",
										children: ["Contact Phone ", /* @__PURE__ */ jsx("span", {
											className: "text-red-500",
											children: "*"
										})]
									}), /* @__PURE__ */ jsx("input", {
										type: "tel",
										required: true,
										value: phone,
										onChange: (e) => setPhone(e.target.value),
										placeholder: "+91 9436121106",
										className: "h-10 w-full rounded-lg border border-slate-200 px-3.5 text-sm focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
									})] }),
									/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
										className: "block text-xs font-semibold text-slate-700 mb-1.5",
										children: "Father's Name"
									}), /* @__PURE__ */ jsx("input", {
										type: "text",
										value: fatherName,
										onChange: (e) => setFatherName(e.target.value),
										placeholder: "Father's full name",
										className: "h-10 w-full rounded-lg border border-slate-200 px-3.5 text-sm focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
									})] }),
									/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
										className: "block text-xs font-semibold text-slate-700 mb-1.5",
										children: "Mother's Name"
									}), /* @__PURE__ */ jsx("input", {
										type: "text",
										value: motherName,
										onChange: (e) => setMotherName(e.target.value),
										placeholder: "Mother's full name",
										className: "h-10 w-full rounded-lg border border-slate-200 px-3.5 text-sm focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
									})] }),
									/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
										className: "block text-xs font-semibold text-slate-700 mb-1.5",
										children: "Gender"
									}), /* @__PURE__ */ jsxs("select", {
										value: gender,
										onChange: (e) => {
											const g = e.target.value;
											setGender(g);
											if (g !== "Female") setHusbandName("");
										},
										className: "h-10 w-full rounded-lg border border-slate-200 px-3 text-sm focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 bg-white",
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
										className: "block text-xs font-semibold text-slate-700 mb-1.5",
										children: "Marital Status"
									}), /* @__PURE__ */ jsxs("select", {
										value: maritalStatus,
										onChange: (e) => {
											const s = e.target.value;
											setMaritalStatus(s);
											if (s !== "Married") setHusbandName("");
										},
										className: "h-10 w-full rounded-lg border border-slate-200 px-3 text-sm focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 bg-white",
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
									gender === "Female" && maritalStatus === "Married" && /* @__PURE__ */ jsxs("div", {
										className: "sm:col-span-2",
										children: [/* @__PURE__ */ jsxs("label", {
											className: "block text-xs font-semibold text-slate-700 mb-1.5",
											children: ["Husband's Name ", /* @__PURE__ */ jsx("span", {
												className: "text-red-500",
												children: "*"
											})]
										}), /* @__PURE__ */ jsx("input", {
											type: "text",
											required: true,
											value: husbandName,
											onChange: (e) => setHusbandName(e.target.value),
											placeholder: "Husband's full name",
											className: "h-10 w-full rounded-lg border border-slate-200 px-3.5 text-sm focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
										})]
									}),
									/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
										className: "block text-xs font-semibold text-slate-700 mb-1.5",
										children: "Blood Group"
									}), /* @__PURE__ */ jsxs("select", {
										value: bloodGroup,
										onChange: (e) => setBloodGroup(e.target.value),
										className: "h-10 w-full rounded-lg border border-slate-200 px-3 text-sm focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 bg-white",
										children: [
											/* @__PURE__ */ jsx("option", {
												value: "",
												children: "Select Blood Group"
											}),
											/* @__PURE__ */ jsx("option", {
												value: "A+",
												children: "A+"
											}),
											/* @__PURE__ */ jsx("option", {
												value: "A-",
												children: "A-"
											}),
											/* @__PURE__ */ jsx("option", {
												value: "B+",
												children: "B+"
											}),
											/* @__PURE__ */ jsx("option", {
												value: "B-",
												children: "B-"
											}),
											/* @__PURE__ */ jsx("option", {
												value: "AB+",
												children: "AB+"
											}),
											/* @__PURE__ */ jsx("option", {
												value: "AB-",
												children: "AB-"
											}),
											/* @__PURE__ */ jsx("option", {
												value: "O+",
												children: "O+"
											}),
											/* @__PURE__ */ jsx("option", {
												value: "O-",
												children: "O-"
											})
										]
									})] })
								]
							})] }),
							/* @__PURE__ */ jsxs("div", {
								className: "pt-2 border-t border-slate-100",
								children: [
									/* @__PURE__ */ jsxs("h3", {
										className: "text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5",
										children: [/* @__PURE__ */ jsx(FileText, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ jsx("span", { children: "2. Identity Document Verification" })]
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "grid gap-4 sm:grid-cols-2",
										children: [/* @__PURE__ */ jsxs("div", { children: [
											/* @__PURE__ */ jsxs("label", {
												className: "block text-xs font-semibold text-slate-700 mb-1.5",
												children: ["Which document you can provide? ", /* @__PURE__ */ jsx("span", {
													className: "text-slate-400 font-normal",
													children: "(Select one)"
												})]
											}),
											/* @__PURE__ */ jsxs("select", {
												value: documentType,
												onChange: (e) => setDocumentType(e.target.value),
												className: "h-10 w-full rounded-lg border border-slate-200 px-3 text-sm focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 bg-white",
												children: [
													/* @__PURE__ */ jsx("option", {
														value: "",
														children: "Select Valid Document"
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
											}),
											/* @__PURE__ */ jsx("p", {
												className: "mt-1 text-[11px] text-slate-500",
												children: "Choose any valid government-issued document for official verification."
											})
										] }), /* @__PURE__ */ jsxs("div", { children: [
											/* @__PURE__ */ jsxs("label", {
												className: "block text-xs font-semibold text-slate-700 mb-1.5",
												children: ["Upload Document Image ", /* @__PURE__ */ jsx("span", {
													className: "text-slate-400 font-normal",
													children: "(< 1 MB)"
												})]
											}),
											/* @__PURE__ */ jsxs("div", {
												className: "flex items-center gap-2",
												children: [/* @__PURE__ */ jsxs("button", {
													type: "button",
													onClick: () => docFileInputRef.current?.click(),
													className: "inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer",
													children: [/* @__PURE__ */ jsx(Upload, { className: "h-3.5 w-3.5 text-slate-500" }), /* @__PURE__ */ jsx("span", { children: documentUrl ? "Change Document" : "Upload Document" })]
												}), documentUrl && /* @__PURE__ */ jsx("button", {
													type: "button",
													onClick: clearDocument,
													className: "text-xs font-medium text-red-600 hover:underline px-2 py-1 cursor-pointer",
													children: "Remove"
												})]
											}),
											/* @__PURE__ */ jsx("p", {
												className: "mt-1 text-[11px] text-slate-500",
												children: "Upload image size less than 1 MB (JPG, PNG, WEBP)."
											}),
											/* @__PURE__ */ jsx("input", {
												ref: docFileInputRef,
												type: "file",
												accept: "image/*",
												className: "hidden",
												onChange: (e) => handleDocumentFile(e.target.files?.[0])
											})
										] })]
									}),
									documentUrl && /* @__PURE__ */ jsxs("div", {
										className: "mt-3 flex items-start gap-3 rounded-xl border border-blue-200 bg-blue-50/50 p-3",
										children: [/* @__PURE__ */ jsx("img", {
											src: documentUrl,
											alt: "Document Preview",
											className: "h-20 w-32 object-contain rounded-lg border border-slate-200 bg-white shrink-0 shadow-xs"
										}), /* @__PURE__ */ jsxs("div", {
											className: "flex-1 min-w-0",
											children: [/* @__PURE__ */ jsxs("div", {
												className: "flex items-center gap-2",
												children: [/* @__PURE__ */ jsx("span", {
													className: "rounded-full bg-blue-100 text-blue-800 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider",
													children: documentType || "ID Document"
												}), /* @__PURE__ */ jsx("span", {
													className: "text-[11px] font-semibold text-emerald-600",
													children: "✓ Ready to submit (< 1 MB)"
												})]
											}), /* @__PURE__ */ jsxs("p", {
												className: "mt-1 text-xs text-slate-600",
												children: [documentType ? `${documentType} image loaded.` : "Document image loaded.", " Official accreditation proof."]
											})]
										})]
									})
								]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "pt-2 border-t border-slate-100",
								children: [/* @__PURE__ */ jsxs("h3", {
									className: "text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5",
									children: [/* @__PURE__ */ jsx(Image, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ jsx("span", { children: "3. Profile Photo / Press Avatar" })]
								}), /* @__PURE__ */ jsxs("div", {
									className: "flex flex-col sm:flex-row items-start gap-4",
									children: [/* @__PURE__ */ jsx("div", {
										className: "h-28 w-28 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-center overflow-hidden shrink-0 relative group",
										children: avatarUrl ? /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx("img", {
											src: avatarUrl,
											alt: "Avatar Preview",
											className: "h-full w-full object-cover"
										}), /* @__PURE__ */ jsx("button", {
											type: "button",
											onClick: clearAvatar,
											className: "absolute right-1 top-1 bg-red-600 text-white rounded-full p-1 opacity-90 hover:opacity-100 shadow-sm transition",
											title: "Remove photo",
											children: /* @__PURE__ */ jsx(X, { className: "h-3 w-3" })
										})] }) : /* @__PURE__ */ jsxs("div", {
											className: "text-center p-2 text-slate-400",
											children: [/* @__PURE__ */ jsx(Image, { className: "h-7 w-7 mx-auto mb-1 text-slate-300" }), /* @__PURE__ */ jsx("span", {
												className: "text-[10px]",
												children: "No Photo"
											})]
										})
									}), /* @__PURE__ */ jsxs("div", {
										className: "flex-1 space-y-2",
										children: [
											/* @__PURE__ */ jsx("p", {
												className: "text-xs text-slate-600",
												children: "Upload a clear, passport-style square photo (400×400 px recommended). This will be printed on your digital Press ID card upon accreditation."
											}),
											/* @__PURE__ */ jsxs("div", {
												className: "flex items-center gap-2",
												children: [/* @__PURE__ */ jsxs("button", {
													type: "button",
													onClick: () => fileInputRef.current?.click(),
													className: "inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer",
													children: [/* @__PURE__ */ jsx(Upload, { className: "h-3.5 w-3.5 text-slate-500" }), /* @__PURE__ */ jsx("span", { children: avatarUrl ? "Change Photo" : "Upload Photo" })]
												}), avatarUrl && /* @__PURE__ */ jsx("button", {
													type: "button",
													onClick: clearAvatar,
													className: "text-xs font-medium text-red-600 hover:underline px-2 py-1 cursor-pointer",
													children: "Remove"
												})]
											}),
											/* @__PURE__ */ jsx("input", {
												ref: fileInputRef,
												type: "file",
												accept: "image/*",
												className: "hidden",
												onChange: (e) => handleAvatarFile(e.target.files?.[0])
											})
										]
									})]
								})]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "pt-2 border-t border-slate-100",
								children: [/* @__PURE__ */ jsxs("h3", {
									className: "text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-1.5",
									children: [/* @__PURE__ */ jsx(MapPin, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ jsx("span", { children: "4. Address & Jurisdiction" })]
								}), /* @__PURE__ */ jsxs("div", {
									className: "grid gap-4 sm:grid-cols-2",
									children: [
										/* @__PURE__ */ jsxs("div", {
											className: "sm:col-span-2",
											children: [/* @__PURE__ */ jsx("label", {
												className: "block text-xs font-semibold text-slate-700 mb-1.5",
												children: "Full Address"
											}), /* @__PURE__ */ jsx("input", {
												type: "text",
												value: address,
												onChange: (e) => setAddress(e.target.value),
												placeholder: "e.g. Radhanagar Road, Agartala",
												className: "h-10 w-full rounded-lg border border-slate-200 px-3.5 text-sm focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
											})]
										}),
										/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
											className: "block text-xs font-semibold text-slate-700 mb-1.5",
											children: "State / Province"
										}), /* @__PURE__ */ jsx("input", {
											type: "text",
											value: state,
											onChange: (e) => setState(e.target.value),
											placeholder: "e.g. Tripura",
											className: "h-10 w-full rounded-lg border border-slate-200 px-3.5 text-sm focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
										})] }),
										/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
											className: "block text-xs font-semibold text-slate-700 mb-1.5",
											children: "Country"
										}), /* @__PURE__ */ jsx("input", {
											type: "text",
											value: country,
											onChange: (e) => setCountry(e.target.value),
											placeholder: "e.g. India",
											className: "h-10 w-full rounded-lg border border-slate-200 px-3.5 text-sm focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
										})] }),
										/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
											className: "block text-xs font-semibold text-slate-700 mb-1.5",
											children: "Pin / ZIP Code"
										}), /* @__PURE__ */ jsx("input", {
											type: "text",
											value: pinCode,
											onChange: (e) => setPinCode(e.target.value),
											placeholder: "e.g. 799006",
											className: "h-10 w-full rounded-lg border border-slate-200 px-3.5 text-sm focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
										})] })
									]
								})]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "pt-4 border-t border-slate-100 flex flex-col-reverse sm:flex-row sm:items-center justify-between gap-3.5",
								children: [/* @__PURE__ */ jsx("p", {
									className: "text-[11.5px] sm:text-xs text-slate-400 text-center sm:text-left",
									children: "By submitting, you certify that all information is accurate."
								}), /* @__PURE__ */ jsx("button", {
									type: "submit",
									disabled: submitting,
									className: "w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 sm:px-6 py-2.5 text-xs sm:text-sm font-bold text-white whitespace-nowrap shadow-sm hover:bg-slate-800 disabled:opacity-50 transition cursor-pointer active:scale-95 shrink-0",
									children: submitting ? /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(Loader2, { className: "h-4 w-4 animate-spin shrink-0" }), /* @__PURE__ */ jsx("span", { children: "Submitting..." })] }) : /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(CheckCircle2, { className: "h-4 w-4 shrink-0" }), /* @__PURE__ */ jsx("span", { children: "Submit Application" })] })
								})]
							})
						]
					})]
				})]
			}),
			/* @__PURE__ */ jsx(Footer, {})
		]
	});
}
//#endregion
export { ApplyJournalistPage as component };

//# sourceMappingURL=apply-journalist-C9GX9Uh_.js.map