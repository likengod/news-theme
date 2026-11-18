import { useEffect, useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
import { Calendar, Check, Copy, Download, ExternalLink, QrCode, ShieldCheck, Store, X } from "lucide-react";
import { toast } from "sonner";
import QRCode from "qrcode";
// src/lib/qr.ts
async function generateQrDataUrl(text) {
	if (!text) return "";
	try {
		return await QRCode.toDataURL(text, {
			width: 320,
			margin: 2,
			color: {
				dark: "#0f172a",
				light: "#ffffff"
			}
		});
	} catch (err) {
		console.error("[QR] Failed to generate QR code data URL:", err);
		return "";
	}
}
// src/components/vouchers/VoucherQrModal.tsx
function VoucherQrModal({ isOpen, onClose, voucherTitle, code, expiresAt, claimedAt, description, tag = "Reward Voucher", status = "active", usedAt, usedByStoreName }) {
	const [copied, setCopied] = useState(false);
	const [qrUrl, setQrUrl] = useState("");
	const verifyLink = `${typeof window !== "undefined" ? window.location.origin : ""}/claim-offer?code=${encodeURIComponent(code)}`;
	useEffect(() => {
		if (code) generateQrDataUrl(verifyLink).then((url) => {
			setQrUrl(url);
		});
	}, [code, verifyLink]);
	if (!isOpen || !code) return null;
	const handleCopy = () => {
		navigator.clipboard.writeText(code);
		setCopied(true);
		toast.success("Promo code copied to clipboard!");
		setTimeout(() => setCopied(false), 2e3);
	};
	const handleDownloadQr = () => {
		if (!qrUrl) return;
		const a = document.createElement("a");
		a.href = qrUrl;
		a.download = `voucher-${code}.png`;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		toast.success("QR Code downloaded!");
	};
	const isUsed = status === "used_in_store";
	const isExpired = expiresAt && /* @__PURE__ */ new Date() > new Date(expiresAt);
	return /* @__PURE__ */ jsx("div", {
		className: "fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs animate-in fade-in duration-200",
		children: /* @__PURE__ */ jsxs("div", {
			className: "w-full max-w-sm sm:max-w-md rounded-2xl bg-white shadow-2xl overflow-hidden border border-slate-100 flex flex-col max-h-[90vh]",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "flex items-center justify-between border-b border-slate-100 px-5 py-3.5 bg-slate-50/70",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ jsx(QrCode, { className: "h-5 w-5 text-rose-500" }), /* @__PURE__ */ jsx("h3", {
						className: "text-sm font-bold text-slate-900",
						children: "Voucher & QR Pass"
					})]
				}), /* @__PURE__ */ jsx("button", {
					type: "button",
					onClick: onClose,
					className: "rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition",
					children: /* @__PURE__ */ jsx(X, { className: "h-5 w-5" })
				})]
			}), /* @__PURE__ */ jsxs("div", {
				className: "p-6 overflow-y-auto space-y-4 text-center",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "flex items-center justify-center gap-2 flex-wrap",
						children: [/* @__PURE__ */ jsx("span", {
							className: "rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-600",
							children: tag
						}), isUsed ? /* @__PURE__ */ jsx("span", {
							className: "rounded-full bg-blue-100 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-blue-700",
							children: "Redeemed in Store"
						}) : isExpired ? /* @__PURE__ */ jsx("span", {
							className: "rounded-full bg-slate-200 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-600",
							children: "Expired"
						}) : /* @__PURE__ */ jsxs("span", {
							className: "rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-700 flex items-center gap-1",
							children: [/* @__PURE__ */ jsx(ShieldCheck, { className: "h-3 w-3" }), " Ready to Redeem"]
						})]
					}),
					/* @__PURE__ */ jsx("h2", {
						className: "text-lg font-bold text-slate-900 leading-snug",
						children: voucherTitle
					}),
					description && /* @__PURE__ */ jsx("p", {
						className: "text-xs text-slate-500 max-w-xs mx-auto leading-relaxed",
						children: description
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "mx-auto flex flex-col items-center justify-center p-4 bg-white rounded-2xl border-2 border-dashed border-slate-200 shadow-xs max-w-[240px]",
						children: [qrUrl ? /* @__PURE__ */ jsx("img", {
							src: qrUrl,
							alt: `QR code for ${code}`,
							className: "w-48 h-48 object-contain rounded-lg"
						}) : /* @__PURE__ */ jsx("div", {
							className: "w-48 h-48 grid place-items-center bg-slate-50 rounded-lg text-slate-400 text-xs",
							children: "Generating QR..."
						}), /* @__PURE__ */ jsx("p", {
							className: "mt-2 text-[10px] text-slate-400 font-medium",
							children: "Scan with phone camera to verify"
						})]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "rounded-xl border border-rose-200 bg-rose-50/50 p-3.5 space-y-2",
						children: [/* @__PURE__ */ jsx("p", {
							className: "text-[10px] font-bold uppercase tracking-wider text-rose-600",
							children: "Unique Promo Code"
						}), /* @__PURE__ */ jsxs("div", {
							className: "flex items-center justify-center gap-2",
							children: [/* @__PURE__ */ jsx("span", {
								className: "font-mono text-xl font-black text-rose-950 tracking-wider",
								children: code
							}), /* @__PURE__ */ jsx("button", {
								type: "button",
								onClick: handleCopy,
								title: "Copy Code",
								className: "rounded-lg bg-rose-600 p-2 text-white hover:bg-rose-700 transition shadow-xs",
								children: copied ? /* @__PURE__ */ jsx(Check, { className: "h-4 w-4" }) : /* @__PURE__ */ jsx(Copy, { className: "h-4 w-4" })
							})]
						})]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "text-xs text-slate-500 space-y-1 pt-1",
						children: [expiresAt && /* @__PURE__ */ jsxs("p", {
							className: "flex items-center justify-center gap-1.5 text-slate-600 font-medium",
							children: [
								/* @__PURE__ */ jsx(Calendar, { className: "h-3.5 w-3.5 text-slate-400" }),
								"Valid until:",
								" ",
								/* @__PURE__ */ jsx("span", {
									className: "font-bold text-slate-800",
									children: new Date(expiresAt).toLocaleDateString(void 0, {
										year: "numeric",
										month: "short",
										day: "numeric"
									})
								})
							]
						}), isUsed && usedAt && /* @__PURE__ */ jsxs("p", {
							className: "flex items-center justify-center gap-1.5 text-blue-700 font-semibold text-[11px]",
							children: [
								/* @__PURE__ */ jsx(Store, { className: "h-3.5 w-3.5 text-blue-500" }),
								"Claimed at ",
								usedByStoreName || "Store",
								" on ",
								new Date(usedAt).toLocaleDateString()
							]
						})]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "flex items-center justify-center gap-2 pt-2",
						children: [/* @__PURE__ */ jsxs("button", {
							type: "button",
							onClick: handleDownloadQr,
							disabled: !qrUrl,
							className: "inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-50 transition w-full",
							children: [/* @__PURE__ */ jsx(Download, { className: "h-4 w-4 text-slate-500" }), "Download QR"]
						}), /* @__PURE__ */ jsxs("a", {
							href: verifyLink,
							target: "_blank",
							rel: "noreferrer",
							className: "inline-flex items-center justify-center gap-1.5 rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-slate-800 transition w-full",
							children: [/* @__PURE__ */ jsx(ExternalLink, { className: "h-4 w-4" }), "Verify Link"]
						})]
					})
				]
			})]
		})
	});
}
export { VoucherQrModal as t };

//# sourceMappingURL=VoucherQrModal-D91VUFdS.js.map