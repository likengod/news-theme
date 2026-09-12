import { t as useServerFn } from "./useServerFn-BqzygRuj.js";
import { a as loadRoles, i as getRolesServer, o as roleBadgeClass } from "./roles-C6Q37OMM.js";
import { t as authClient } from "./auth-client-BpY5OKKw.js";
import { t as CsvImportExport } from "./CsvImportExport-DBalmz2g.js";
import { a as getAllAdminUsers, c as regeneratePublicUserId, d as toggleAdminUserBan, f as updateAdminUserDetails, i as deleteAdminUser, l as setAdminUserRole, n as bulkToggleAdminUserBan, o as importAdminUsers, p as updateAdminUserPassword, r as createAdminUser, s as listAdminUsers, t as bulkDeleteAdminUsers, u as setUserPoints } from "./admin-users.functions-I0_TzTVc.js";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { CheckSquare, ChevronLeft, ChevronRight, Copy, Eye, EyeOff, KeyRound, Plus, RefreshCw, Save, Search, ShieldCheck, ShieldOff, Trash2, UserPen, Users, Wallet, X } from "lucide-react";
import { toast } from "sonner";
import { useQuery, useQueryClient } from "@tanstack/react-query";
//#region src/components/admin/users/UserFilterBar.tsx
function UserFilterBar({ q, onSearchChange, roleFilter, onRoleFilterChange, sort, onSortChange, roles, onCreateClick }) {
	return /* @__PURE__ */ jsxs("div", {
		className: "flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "flex flex-1 flex-wrap items-center gap-3",
			children: [
				/* @__PURE__ */ jsxs("div", {
					className: "relative min-w-[220px] flex-1",
					children: [/* @__PURE__ */ jsx(Search, { className: "absolute left-3 top-2.5 h-4 w-4 text-slate-400" }), /* @__PURE__ */ jsx("input", {
						type: "text",
						value: q,
						onChange: (e) => onSearchChange(e.target.value),
						placeholder: "Search email, name or ID...",
						className: "h-9 w-full rounded-md border border-slate-200 pl-9 pr-3 text-sm focus:border-slate-900 focus:outline-none"
					})]
				}),
				/* @__PURE__ */ jsxs("select", {
					value: roleFilter,
					onChange: (e) => onRoleFilterChange(e.target.value),
					className: "h-9 rounded-md border border-slate-200 bg-white px-3 text-sm focus:border-slate-900 focus:outline-none",
					children: [/* @__PURE__ */ jsx("option", {
						value: "all",
						children: "All Roles"
					}), roles.map((r) => /* @__PURE__ */ jsx("option", {
						value: r.id,
						children: r.name
					}, r.id))]
				}),
				/* @__PURE__ */ jsxs("select", {
					value: sort,
					onChange: (e) => onSortChange(e.target.value),
					className: "h-9 rounded-md border border-slate-200 bg-white px-3 text-sm focus:border-slate-900 focus:outline-none",
					children: [
						/* @__PURE__ */ jsx("option", {
							value: "recent",
							children: "Recently Added"
						}),
						/* @__PURE__ */ jsx("option", {
							value: "points_desc",
							children: "Highest Points"
						}),
						/* @__PURE__ */ jsx("option", {
							value: "points_asc",
							children: "Lowest Points"
						}),
						/* @__PURE__ */ jsx("option", {
							value: "name",
							children: "Name / Email (A–Z)"
						})
					]
				})
			]
		}), /* @__PURE__ */ jsxs("button", {
			onClick: onCreateClick,
			className: "inline-flex items-center gap-2 rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800",
			children: [/* @__PURE__ */ jsx(Plus, { className: "h-4 w-4" }), " Create User"]
		})]
	});
}
//#endregion
//#region src/components/admin/users/UserTable.tsx
function UserTable({ users, currentUserId, roles, selectedIds, onToggleSelect, onToggleSelectAll, onBulkDelete, onBulkStatusChange, onClearSelection, onSetRole, onToggleBan, onDelete, onRegenId, onOpenModal }) {
	const copyPublicId = (pid) => {
		navigator.clipboard.writeText(pid);
		toast.success(`Copied ID ${pid} to clipboard`);
	};
	const selectableUsers = users.filter((u) => u.id !== currentUserId);
	const allSelected = selectableUsers.length > 0 && selectableUsers.every((u) => selectedIds.includes(u.id));
	return /* @__PURE__ */ jsxs("div", {
		className: "space-y-3",
		children: [selectedIds.length > 0 && /* @__PURE__ */ jsxs("div", {
			className: "flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-800 bg-slate-900 px-4 py-3 text-white shadow-lg animate-in fade-in slide-in-from-top-2",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "flex items-center gap-2 text-sm font-semibold",
				children: [/* @__PURE__ */ jsx(CheckSquare, { className: "h-4 w-4 text-emerald-400" }), /* @__PURE__ */ jsxs("span", { children: [selectedIds.length, " user(s) selected"] })]
			}), /* @__PURE__ */ jsxs("div", {
				className: "flex items-center gap-2",
				children: [
					/* @__PURE__ */ jsxs("button", {
						onClick: () => onBulkStatusChange(false),
						className: "inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/15 px-3 py-1.5 text-xs font-semibold text-emerald-300 hover:bg-emerald-500/25 transition-colors",
						children: [/* @__PURE__ */ jsx(ShieldCheck, { className: "h-3.5 w-3.5 text-emerald-400" }), " Activate Selected"]
					}),
					/* @__PURE__ */ jsxs("button", {
						onClick: () => onBulkStatusChange(true),
						className: "inline-flex items-center gap-1.5 rounded-lg border border-amber-500/30 bg-amber-500/15 px-3 py-1.5 text-xs font-semibold text-amber-300 hover:bg-amber-500/25 transition-colors",
						children: [/* @__PURE__ */ jsx(ShieldOff, { className: "h-3.5 w-3.5 text-amber-400" }), " Suspend Selected"]
					}),
					/* @__PURE__ */ jsxs("button", {
						onClick: onBulkDelete,
						className: "inline-flex items-center gap-1.5 rounded-lg border border-red-500/30 bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-700 transition-colors shadow-sm",
						children: [/* @__PURE__ */ jsx(Trash2, { className: "h-3.5 w-3.5" }), " Delete Selected"]
					}),
					/* @__PURE__ */ jsx("button", {
						onClick: onClearSelection,
						className: "ml-2 grid h-7 w-7 place-items-center rounded-lg border border-slate-700 bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white",
						title: "Clear selection",
						children: /* @__PURE__ */ jsx(X, { className: "h-4 w-4" })
					})
				]
			})]
		}), /* @__PURE__ */ jsx("div", {
			className: "overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm",
			children: /* @__PURE__ */ jsx("div", {
				className: "overflow-x-auto",
				children: /* @__PURE__ */ jsxs("table", {
					className: "w-full text-left text-sm",
					children: [/* @__PURE__ */ jsx("thead", {
						className: "border-b border-slate-200 bg-slate-50 text-xs font-bold uppercase tracking-wider text-slate-500",
						children: /* @__PURE__ */ jsxs("tr", { children: [
							/* @__PURE__ */ jsx("th", {
								className: "px-4 py-3 w-10 text-center",
								children: /* @__PURE__ */ jsx("input", {
									type: "checkbox",
									checked: allSelected,
									onChange: onToggleSelectAll,
									className: "h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900 cursor-pointer",
									title: "Select / Deselect all users on this page"
								})
							}),
							/* @__PURE__ */ jsx("th", {
								className: "px-4 py-3",
								children: "User"
							}),
							/* @__PURE__ */ jsx("th", {
								className: "px-4 py-3",
								children: "Public ID"
							}),
							/* @__PURE__ */ jsx("th", {
								className: "px-4 py-3",
								children: "Role"
							}),
							/* @__PURE__ */ jsx("th", {
								className: "px-4 py-3 text-right",
								children: "Points"
							}),
							/* @__PURE__ */ jsx("th", {
								className: "px-4 py-3",
								children: "Status"
							}),
							/* @__PURE__ */ jsx("th", {
								className: "px-4 py-3 text-right",
								children: "Actions"
							})
						] })
					}), /* @__PURE__ */ jsxs("tbody", {
						className: "divide-y divide-slate-100",
						children: [users.map((r) => {
							const isSelf = currentUserId === r.id;
							const isSelected = selectedIds.includes(r.id);
							return /* @__PURE__ */ jsxs("tr", {
								className: `transition-colors ${isSelected ? "bg-amber-50/60" : "hover:bg-slate-50/70"}`,
								children: [
									/* @__PURE__ */ jsx("td", {
										className: "px-4 py-3 text-center",
										children: /* @__PURE__ */ jsx("input", {
											type: "checkbox",
											disabled: isSelf,
											checked: isSelected,
											onChange: () => onToggleSelect(r.id),
											className: "h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900 cursor-pointer disabled:opacity-30"
										})
									}),
									/* @__PURE__ */ jsx("td", {
										className: "px-4 py-3",
										children: /* @__PURE__ */ jsxs("div", {
											className: "flex items-center gap-3",
											children: [/* @__PURE__ */ jsx("div", {
												className: "grid h-9 w-9 shrink-0 place-items-center rounded-full bg-slate-900 text-xs font-bold text-white uppercase",
												children: r.avatarUrl ? /* @__PURE__ */ jsx("img", {
													src: r.avatarUrl,
													alt: "",
													className: "h-full w-full rounded-full object-cover"
												}) : (r.displayName || r.email).slice(0, 2)
											}), /* @__PURE__ */ jsxs("div", {
												className: "min-w-0",
												children: [/* @__PURE__ */ jsxs("p", {
													className: "truncate font-semibold text-slate-900",
													children: [
														r.displayName || "Un-named",
														" ",
														isSelf && /* @__PURE__ */ jsx("span", {
															className: "ml-1 rounded bg-slate-100 px-1.5 py-0.5 text-[10px] text-slate-600 font-normal",
															children: "(You)"
														})
													]
												}), /* @__PURE__ */ jsx("p", {
													className: "truncate text-xs text-slate-500",
													children: r.email
												})]
											})]
										})
									}),
									/* @__PURE__ */ jsx("td", {
										className: "px-4 py-3 font-mono text-xs text-slate-600",
										children: /* @__PURE__ */ jsxs("div", {
											className: "flex items-center gap-1.5",
											children: [
												/* @__PURE__ */ jsx("span", { children: r.publicUserId }),
												/* @__PURE__ */ jsx("button", {
													onClick: () => copyPublicId(r.publicUserId),
													title: "Copy Public ID",
													className: "rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700",
													children: /* @__PURE__ */ jsx(Copy, { className: "h-3 w-3" })
												}),
												/* @__PURE__ */ jsx("button", {
													onClick: () => onRegenId(r),
													title: "Regenerate Public ID",
													className: "rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700",
													children: /* @__PURE__ */ jsx(RefreshCw, { className: "h-3 w-3" })
												})
											]
										})
									}),
									/* @__PURE__ */ jsx("td", {
										className: "px-4 py-3",
										children: /* @__PURE__ */ jsx("select", {
											value: r.role,
											disabled: isSelf,
											onChange: (e) => onSetRole(r.id, e.target.value),
											className: `rounded-full border px-2.5 py-1 text-xs font-semibold focus:outline-none ${roleBadgeClass(roles.find((x) => x.id === r.role)?.color ?? "slate")}`,
											children: roles.map((rl) => /* @__PURE__ */ jsx("option", {
												value: rl.id,
												children: rl.name
											}, rl.id))
										})
									}),
									/* @__PURE__ */ jsxs("td", {
										className: "px-4 py-3 text-right font-semibold text-amber-700",
										children: [r.points.toLocaleString(), " pts"]
									}),
									/* @__PURE__ */ jsx("td", {
										className: "px-4 py-3",
										children: /* @__PURE__ */ jsxs("select", {
											value: r.status === "Active" ? "Active" : "Suspended",
											disabled: isSelf,
											onChange: (e) => {
												const nextStatus = e.target.value;
												if (nextStatus === "Active" && r.status !== "Active" || nextStatus === "Suspended" && r.status === "Active") onToggleBan(r);
											},
											className: `rounded-full border px-2.5 py-1 text-xs font-bold transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-slate-900/10 disabled:cursor-not-allowed disabled:opacity-50 ${r.status === "Active" ? "border-emerald-300 bg-emerald-50 text-emerald-700 hover:bg-emerald-100" : "border-red-300 bg-red-50 text-red-700 hover:bg-red-100"}`,
											children: [/* @__PURE__ */ jsx("option", {
												value: "Active",
												className: "bg-white text-emerald-700 font-semibold",
												children: "● Active"
											}), /* @__PURE__ */ jsx("option", {
												value: "Suspended",
												className: "bg-white text-red-700 font-semibold",
												children: "● Suspended"
											})]
										})
									}),
									/* @__PURE__ */ jsx("td", {
										className: "px-4 py-3 text-right",
										children: /* @__PURE__ */ jsxs("div", {
											className: "inline-flex items-center gap-1.5",
											children: [
												/* @__PURE__ */ jsx("button", {
													onClick: () => onOpenModal("details", r),
													title: "Edit Details",
													className: "rounded-md border border-slate-200 p-1.5 text-slate-600 hover:bg-slate-100",
													children: /* @__PURE__ */ jsx(UserPen, { className: "h-4 w-4" })
												}),
												/* @__PURE__ */ jsx("button", {
													onClick: () => onOpenModal("points", r),
													title: "Manage Points",
													className: "rounded-md border border-slate-200 p-1.5 text-slate-600 hover:bg-slate-100",
													children: /* @__PURE__ */ jsx(Wallet, { className: "h-4 w-4" })
												}),
												/* @__PURE__ */ jsx("button", {
													onClick: () => onOpenModal("password", r),
													title: "Reset Password",
													className: "rounded-md border border-slate-200 p-1.5 text-slate-600 hover:bg-slate-100",
													children: /* @__PURE__ */ jsx(KeyRound, { className: "h-4 w-4" })
												}),
												/* @__PURE__ */ jsx("button", {
													onClick: () => onDelete(r),
													disabled: isSelf,
													title: "Delete User",
													className: "rounded-md border border-slate-200 p-1.5 text-red-600 hover:bg-red-50 disabled:opacity-40",
													children: /* @__PURE__ */ jsx(Trash2, { className: "h-4 w-4" })
												})
											]
										})
									})
								]
							}, r.id);
						}), users.length === 0 && /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", {
							colSpan: 7,
							className: "px-4 py-8 text-center text-sm text-slate-400",
							children: "No users found matching your filters."
						}) })]
					})]
				})
			})
		})]
	});
}
//#endregion
//#region src/components/admin/users/UserActionModal.tsx
function UserActionModal({ kind, row, onClose, onSavePoints, onSavePassword, onSaveDetails }) {
	const [points, setPoints] = useState(row.points);
	const [password, setPassword] = useState("");
	const [showPass, setShowPass] = useState(false);
	const [displayName, setDisplayName] = useState(row.displayName || "");
	const [avatarUrl, setAvatarUrl] = useState(row.avatarUrl || "");
	const submit = () => {
		if (kind === "points") onSavePoints(row.id, Number(points) || 0);
		else if (kind === "password") {
			if (!password || password.length < 6) return alert("Password must be at least 6 characters");
			onSavePassword(row.id, password);
		} else if (kind === "details") onSaveDetails(row.id, displayName, avatarUrl);
	};
	return /* @__PURE__ */ jsx("div", {
		className: "fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4",
		children: /* @__PURE__ */ jsxs("div", {
			className: "w-full max-w-md rounded-xl bg-white p-5 shadow-2xl",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "mb-4 flex items-center justify-between border-b border-slate-100 pb-3",
				children: [/* @__PURE__ */ jsxs("h2", {
					className: "text-base font-bold text-slate-900",
					children: [
						kind === "points" && `Manage Points — ${row.email}`,
						kind === "password" && `Reset Password — ${row.email}`,
						kind === "details" && `Edit Profile Details — ${row.email}`
					]
				}), /* @__PURE__ */ jsx("button", {
					onClick: onClose,
					className: "rounded p-1 text-slate-400 hover:bg-slate-100",
					children: /* @__PURE__ */ jsx(X, { className: "h-4 w-4" })
				})]
			}), /* @__PURE__ */ jsxs("div", {
				className: "space-y-4",
				children: [
					kind === "points" && /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
						className: "mb-1 block text-xs font-semibold text-slate-600",
						children: "Reward Points"
					}), /* @__PURE__ */ jsx("input", {
						type: "number",
						value: points,
						onChange: (e) => setPoints(Number(e.target.value)),
						className: "h-10 w-full rounded-lg border border-slate-200 px-3 text-sm focus:border-slate-900 focus:outline-none"
					})] }),
					kind === "password" && /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
						className: "mb-1 block text-xs font-semibold text-slate-600",
						children: "New Password"
					}), /* @__PURE__ */ jsxs("div", {
						className: "relative",
						children: [/* @__PURE__ */ jsx("input", {
							type: showPass ? "text" : "password",
							value: password,
							onChange: (e) => setPassword(e.target.value),
							placeholder: "Enter new strong password...",
							className: "h-10 w-full rounded-lg border border-slate-200 pl-3 pr-10 text-sm focus:border-slate-900 focus:outline-none"
						}), /* @__PURE__ */ jsx("button", {
							type: "button",
							onClick: () => setShowPass(!showPass),
							className: "absolute right-3 top-2.5 text-slate-400 hover:text-slate-600",
							children: showPass ? /* @__PURE__ */ jsx(EyeOff, { className: "h-4 w-4" }) : /* @__PURE__ */ jsx(Eye, { className: "h-4 w-4" })
						})]
					})] }),
					kind === "details" && /* @__PURE__ */ jsxs("div", {
						className: "space-y-3",
						children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
							className: "mb-1 block text-xs font-semibold text-slate-600",
							children: "Display Name"
						}), /* @__PURE__ */ jsx("input", {
							type: "text",
							value: displayName,
							onChange: (e) => setDisplayName(e.target.value),
							placeholder: "Full Name",
							className: "h-10 w-full rounded-lg border border-slate-200 px-3 text-sm focus:border-slate-900 focus:outline-none"
						})] }), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
							className: "mb-1 block text-xs font-semibold text-slate-600",
							children: "Avatar Image URL"
						}), /* @__PURE__ */ jsx("input", {
							type: "url",
							value: avatarUrl,
							onChange: (e) => setAvatarUrl(e.target.value),
							placeholder: "https://...",
							className: "h-10 w-full rounded-lg border border-slate-200 px-3 text-sm focus:border-slate-900 focus:outline-none"
						})] })]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "flex justify-end gap-2 pt-2",
						children: [/* @__PURE__ */ jsx("button", {
							onClick: onClose,
							className: "rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50",
							children: "Cancel"
						}), /* @__PURE__ */ jsxs("button", {
							onClick: submit,
							className: "inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800",
							children: [/* @__PURE__ */ jsx(Save, { className: "h-4 w-4" }), " Save"]
						})]
					})
				]
			})]
		})
	});
}
//#endregion
//#region src/components/admin/users/CreateUserModal.tsx
function CreateUserModal({ roles, onClose, onCreate }) {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [displayName, setDisplayName] = useState("");
	const [role, setRole] = useState("reader");
	const [showPass, setShowPass] = useState(false);
	const submit = () => {
		if (!email || !email.includes("@")) return alert("Please enter a valid email address");
		if (!password || password.length < 6) return alert("Password must be at least 6 characters");
		onCreate(email.trim(), password, displayName.trim(), role);
	};
	return /* @__PURE__ */ jsx("div", {
		className: "fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4",
		children: /* @__PURE__ */ jsxs("div", {
			className: "w-full max-w-md rounded-xl bg-white p-5 shadow-2xl",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "mb-4 flex items-center justify-between border-b border-slate-100 pb-3",
				children: [/* @__PURE__ */ jsx("h2", {
					className: "text-base font-bold text-slate-900",
					children: "Create New User"
				}), /* @__PURE__ */ jsx("button", {
					onClick: onClose,
					className: "rounded p-1 text-slate-400 hover:bg-slate-100",
					children: /* @__PURE__ */ jsx(X, { className: "h-4 w-4" })
				})]
			}), /* @__PURE__ */ jsxs("div", {
				className: "space-y-3",
				children: [
					/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
						className: "mb-1 block text-xs font-semibold text-slate-600",
						children: "Email Address *"
					}), /* @__PURE__ */ jsx("input", {
						type: "email",
						value: email,
						onChange: (e) => setEmail(e.target.value),
						placeholder: "user@example.com",
						className: "h-10 w-full rounded-lg border border-slate-200 px-3 text-sm focus:border-slate-900 focus:outline-none"
					})] }),
					/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
						className: "mb-1 block text-xs font-semibold text-slate-600",
						children: "Password *"
					}), /* @__PURE__ */ jsxs("div", {
						className: "relative",
						children: [/* @__PURE__ */ jsx("input", {
							type: showPass ? "text" : "password",
							value: password,
							onChange: (e) => setPassword(e.target.value),
							placeholder: "Initial password...",
							className: "h-10 w-full rounded-lg border border-slate-200 pl-3 pr-10 text-sm focus:border-slate-900 focus:outline-none"
						}), /* @__PURE__ */ jsx("button", {
							type: "button",
							onClick: () => setShowPass(!showPass),
							className: "absolute right-3 top-2.5 text-slate-400 hover:text-slate-600",
							children: showPass ? /* @__PURE__ */ jsx(EyeOff, { className: "h-4 w-4" }) : /* @__PURE__ */ jsx(Eye, { className: "h-4 w-4" })
						})]
					})] }),
					/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
						className: "mb-1 block text-xs font-semibold text-slate-600",
						children: "Display Name"
					}), /* @__PURE__ */ jsx("input", {
						type: "text",
						value: displayName,
						onChange: (e) => setDisplayName(e.target.value),
						placeholder: "e.g. John Doe",
						className: "h-10 w-full rounded-lg border border-slate-200 px-3 text-sm focus:border-slate-900 focus:outline-none"
					})] }),
					/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
						className: "mb-1 block text-xs font-semibold text-slate-600",
						children: "User Role"
					}), /* @__PURE__ */ jsx("select", {
						value: role,
						onChange: (e) => setRole(e.target.value),
						className: "h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm focus:border-slate-900 focus:outline-none",
						children: roles.map((r) => /* @__PURE__ */ jsx("option", {
							value: r.id,
							children: r.name
						}, r.id))
					})] }),
					/* @__PURE__ */ jsxs("div", {
						className: "flex justify-end gap-2 pt-3",
						children: [/* @__PURE__ */ jsx("button", {
							onClick: onClose,
							className: "rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50",
							children: "Cancel"
						}), /* @__PURE__ */ jsxs("button", {
							onClick: submit,
							className: "inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800",
							children: [/* @__PURE__ */ jsx(Plus, { className: "h-4 w-4" }), " Create Account"]
						})]
					})
				]
			})]
		})
	});
}
//#endregion
//#region src/routes/admin.users.tsx?tsr-split=component
function UsersPage() {
	const qc = useQueryClient();
	const listFn = useServerFn(listAdminUsers);
	const createFn = useServerFn(createAdminUser);
	const setRoleFn = useServerFn(setAdminUserRole);
	const delFn = useServerFn(deleteAdminUser);
	const banFn = useServerFn(toggleAdminUserBan);
	const bulkDelFn = useServerFn(bulkDeleteAdminUsers);
	const bulkBanFn = useServerFn(bulkToggleAdminUserBan);
	const regenFn = useServerFn(regeneratePublicUserId);
	const pointsFn = useServerFn(setUserPoints);
	const passFn = useServerFn(updateAdminUserPassword);
	const detailsFn = useServerFn(updateAdminUserDetails);
	const getAllFn = useServerFn(getAllAdminUsers);
	const importFn = useServerFn(importAdminUsers);
	const [roles, setRoles] = useState(() => loadRoles());
	useEffect(() => {
		getRolesServer().then((res) => setRoles(res)).catch(() => {});
	}, []);
	const [q, setQ] = useState("");
	const [roleFilter, setRoleFilter] = useState("all");
	const [sort, setSort] = useState("recent");
	const [page, setPage] = useState(1);
	const [selectedIds, setSelectedIds] = useState([]);
	const limit = 20;
	const navigate = useNavigate();
	const [currentUserId, setCurrentUserId] = useState(null);
	const [allUsers, setAllUsers] = useState([]);
	useEffect(() => {
		authClient.auth.getUser().then(({ data }) => setCurrentUserId(data.user?.id ?? null));
	}, []);
	const usersQuery = useQuery({
		queryKey: [
			"admin-users",
			q,
			roleFilter,
			sort,
			page
		],
		queryFn: () => listFn({ data: {
			q,
			role: roleFilter,
			sort,
			page,
			limit
		} })
	});
	const rows = useMemo(() => usersQuery.data?.rows ?? [], [usersQuery.data]);
	useEffect(() => {
		getAllFn().then((res) => setAllUsers(res)).catch(console.error);
	}, [rows]);
	const handleImport = async (data) => {
		try {
			await importFn({ data });
			toast.success("Users imported successfully");
			qc.invalidateQueries({ queryKey: ["admin-users"] });
			setAllUsers(await getAllFn());
		} catch (err) {
			toast.error(err.message || "Failed to import users");
		}
	};
	const handleToggleSelect = (userId) => {
		setSelectedIds((prev) => prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]);
	};
	const handleToggleSelectAll = () => {
		const selectableIds = rows.filter((u) => u.id !== currentUserId).map((u) => u.id);
		if (selectableIds.length > 0 && selectableIds.every((id) => selectedIds.includes(id))) setSelectedIds((prev) => prev.filter((id) => !selectableIds.includes(id)));
		else setSelectedIds((prev) => Array.from(/* @__PURE__ */ new Set([...prev, ...selectableIds])));
	};
	const handleBulkDelete = async () => {
		if (selectedIds.length === 0) return;
		if (!confirm(`Are you sure you want to permanently delete ${selectedIds.length} selected user(s)?`)) return;
		try {
			const res = await bulkDelFn({ data: { userIds: selectedIds } });
			toast.success(`Successfully deleted ${res.deletedCount} user(s)`);
			setSelectedIds([]);
			qc.invalidateQueries({ queryKey: ["admin-users"] });
		} catch (e) {
			toast.error(e.message || "Failed bulk delete");
		}
	};
	const handleBulkStatusChange = async (suspend) => {
		if (selectedIds.length === 0) return;
		const actionText = suspend ? "suspended" : "activated";
		try {
			const res = await bulkBanFn({ data: {
				userIds: selectedIds,
				suspend
			} });
			toast.success(`Successfully ${actionText} ${res.updatedCount} user(s)`);
			setSelectedIds([]);
			qc.invalidateQueries({ queryKey: ["admin-users"] });
		} catch (e) {
			toast.error(e.message || "Failed bulk status update");
		}
	};
	useEffect(() => {
		if (usersQuery.isError && usersQuery.error?.message?.includes("Unauthorized")) authClient.auth.signOut().then(() => {
			navigate({ to: "/auth" });
		});
	}, [usersQuery.isError, usersQuery.error]);
	const [showCreate, setShowCreate] = useState(false);
	const [modal, setModal] = useState({
		kind: null,
		row: null
	});
	const handleCreate = async (email, pass, name, role) => {
		try {
			await createFn({ data: {
				email,
				password: pass,
				displayName: name,
				role
			} });
			toast.success(`User ${email} created successfully`);
			setShowCreate(false);
			qc.invalidateQueries({ queryKey: ["admin-users"] });
		} catch (e) {
			toast.error(e.message || "Failed to create user");
		}
	};
	const handleSetRole = async (userId, role) => {
		try {
			await setRoleFn({ data: {
				userId,
				role
			} });
			toast.success("Role updated");
			qc.invalidateQueries({ queryKey: ["admin-users"] });
		} catch (e) {
			toast.error(e.message || "Failed to update role");
		}
	};
	const handleToggleBan = async (row) => {
		const next = row.status === "Active" ? "Suspended" : "Active";
		try {
			await banFn({ data: {
				userId: row.id,
				suspended: next === "Suspended"
			} });
			toast.success(`User is now ${next}`);
			qc.invalidateQueries({ queryKey: ["admin-users"] });
		} catch (e) {
			toast.error(e.message || "Failed to toggle user status");
		}
	};
	const handleDelete = async (row) => {
		if (!confirm(`Are you sure you want to permanently delete ${row.email}?`)) return;
		try {
			await delFn({ data: row.id });
			toast.success("User deleted");
			qc.invalidateQueries({ queryKey: ["admin-users"] });
		} catch (e) {
			toast.error(e.message || "Failed to delete user");
		}
	};
	const handleRegenId = async (row) => {
		try {
			const res = await regenFn({ data: row.id });
			toast.success(`New Public ID generated: ${res.publicUserId}`);
			qc.invalidateQueries({ queryKey: ["admin-users"] });
		} catch (e) {
			toast.error(e.message || "Failed to regenerate public ID");
		}
	};
	const handleSavePoints = async (userId, points) => {
		try {
			await pointsFn({ data: {
				userId,
				points
			} });
			toast.success("Points updated");
			setModal({
				kind: null,
				row: null
			});
			qc.invalidateQueries({ queryKey: ["admin-users"] });
		} catch (e) {
			toast.error(e.message || "Failed to update points");
		}
	};
	const handleSavePassword = async (userId, pass) => {
		try {
			await passFn({ data: {
				userId,
				password: pass
			} });
			toast.success("Password updated successfully");
			setModal({
				kind: null,
				row: null
			});
		} catch (e) {
			toast.error(e.message || "Failed to update password");
		}
	};
	const handleSaveDetails = async (userId, name, avatar) => {
		try {
			await detailsFn({ data: {
				userId,
				displayName: name,
				avatarUrl: avatar
			} });
			toast.success("Profile details updated");
			setModal({
				kind: null,
				row: null
			});
			qc.invalidateQueries({ queryKey: ["admin-users"] });
		} catch (e) {
			toast.error(e.message || "Failed to update details");
		}
	};
	const total = usersQuery.data?.total ?? 0;
	const totalPages = usersQuery.data?.totalPages ?? 1;
	return /* @__PURE__ */ jsxs("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "flex flex-wrap items-center justify-between gap-3",
				children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h1", {
					className: "text-2xl font-bold tracking-tight",
					children: "Users Management"
				}), /* @__PURE__ */ jsx("p", {
					className: "text-sm text-slate-500",
					children: "Server-paginated list of registered users, roles, public IDs, and points."
				})] }), /* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ jsx(CsvImportExport, {
						data: allUsers,
						filename: "users",
						onImport: handleImport
					}), /* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-2 rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-700",
						children: [
							/* @__PURE__ */ jsx(Users, { className: "h-4 w-4" }),
							" Total Users: ",
							total
						]
					})]
				})]
			}),
			/* @__PURE__ */ jsx(UserFilterBar, {
				q,
				onSearchChange: (val) => {
					setQ(val);
					setPage(1);
				},
				roleFilter,
				onRoleFilterChange: (val) => {
					setRoleFilter(val);
					setPage(1);
				},
				sort,
				onSortChange: (val) => {
					setSort(val);
					setPage(1);
				},
				roles,
				onCreateClick: () => setShowCreate(true)
			}),
			usersQuery.isLoading ? /* @__PURE__ */ jsx("div", {
				className: "flex justify-center py-12",
				children: /* @__PURE__ */ jsx("div", { className: "h-8 w-8 animate-spin rounded-full border-4 border-slate-900 border-t-transparent" })
			}) : /* @__PURE__ */ jsx(UserTable, {
				users: rows,
				currentUserId,
				roles,
				selectedIds,
				onToggleSelect: handleToggleSelect,
				onToggleSelectAll: handleToggleSelectAll,
				onBulkDelete: handleBulkDelete,
				onBulkStatusChange: handleBulkStatusChange,
				onClearSelection: () => setSelectedIds([]),
				onSetRole: handleSetRole,
				onToggleBan: handleToggleBan,
				onDelete: handleDelete,
				onRegenId: handleRegenId,
				onOpenModal: (kind, row) => setModal({
					kind,
					row
				})
			}),
			totalPages > 1 && /* @__PURE__ */ jsxs("div", {
				className: "flex items-center justify-between border-t border-slate-200 pt-4",
				children: [/* @__PURE__ */ jsxs("p", {
					className: "text-xs text-slate-500",
					children: [
						"Showing page ",
						/* @__PURE__ */ jsx("strong", { children: page }),
						" of ",
						/* @__PURE__ */ jsx("strong", { children: totalPages }),
						" (",
						total,
						" total users)"
					]
				}), /* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ jsxs("button", {
						onClick: () => setPage((p) => Math.max(1, p - 1)),
						disabled: page <= 1,
						className: "inline-flex items-center gap-1 rounded-md border border-slate-200 px-3 py-1.5 text-xs font-medium hover:bg-slate-50 disabled:opacity-40",
						children: [/* @__PURE__ */ jsx(ChevronLeft, { className: "h-3.5 w-3.5" }), " Previous"]
					}), /* @__PURE__ */ jsxs("button", {
						onClick: () => setPage((p) => Math.min(totalPages, p + 1)),
						disabled: page >= totalPages,
						className: "inline-flex items-center gap-1 rounded-md border border-slate-200 px-3 py-1.5 text-xs font-medium hover:bg-slate-50 disabled:opacity-40",
						children: ["Next ", /* @__PURE__ */ jsx(ChevronRight, { className: "h-3.5 w-3.5" })]
					})]
				})]
			}),
			modal.kind && modal.row && /* @__PURE__ */ jsx(UserActionModal, {
				kind: modal.kind,
				row: modal.row,
				onClose: () => setModal({
					kind: null,
					row: null
				}),
				onSavePoints: handleSavePoints,
				onSavePassword: handleSavePassword,
				onSaveDetails: handleSaveDetails
			}),
			showCreate && /* @__PURE__ */ jsx(CreateUserModal, {
				roles,
				onClose: () => setShowCreate(false),
				onCreate: handleCreate
			})
		]
	});
}
//#endregion
export { UsersPage as component };

//# sourceMappingURL=admin.users-BKnitTI0.js.map