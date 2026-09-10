import { t as __exportAll } from "./rolldown-runtime-D7D4PA-g.js";
import { t as cleanCopyright } from "./site-content-Bsi3qYPj.js";
import { a as useSiteSettings } from "./AdSettingsContext-CT4DUJRS.js";
import { t as SocialIcons } from "./SocialIcons-BM2mqm99.js";
import { Link } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { Mail, MapPin, Phone } from "lucide-react";
import { useTranslation } from "react-i18next";
//#region src/components/site/Footer.tsx
var Footer_exports = /* @__PURE__ */ __exportAll({ Footer: () => Footer });
function Footer() {
	const { t } = useTranslation();
	const s = useSiteSettings();
	const year = (/* @__PURE__ */ new Date()).getFullYear();
	const copyright = cleanCopyright(s.copyright || `© ${year} News Theme Media Co. All rights reserved.`).replace("{year}", String(year));
	s.builtByUrl?.startsWith("http") ? s.builtByUrl : `${s.builtByUrl || "GorillaTechsolution.com"}`;
	const isPremium = [
		"Enterprise",
		"Enterprise+",
		"Premium"
	].includes(s.licenseType || "") || s.licenseRole === "VIP";
	const quickLinks = [
		[
			{
				label: t("footer.about"),
				to: "/about"
			},
			{
				label: t("footer.contact"),
				to: "/contact"
			},
			{
				label: t("footer.submitNews"),
				to: "/submit-news"
			}
		],
		[
			{
				label: t("footer.privacyPolicy"),
				to: "/privacy-policy"
			},
			{
				label: t("footer.terms"),
				to: "/terms-and-conditions"
			},
			{
				label: t("footer.cookiePolicy"),
				to: "/cookie-policy"
			}
		],
		[
			{
				label: t("footer.refundPolicy"),
				to: "/refund-policy"
			},
			{
				label: t("footer.disclaimer"),
				to: "/disclaimer"
			},
			{
				label: t("footer.editorialPolicy"),
				to: "/editorial-policy"
			}
		],
		[
			{
				label: t("footer.dmca"),
				to: "/dmca"
			},
			{
				label: "Data Deletion Policy",
				to: "/data-deletion-policy"
			},
			{
				label: t("footer.verifiedJournalist"),
				to: "/verified-journalist"
			}
		],
		[
			{
				label: t("footer.subscription"),
				to: "/subscription"
			},
			{
				label: t("footer.workWithUs"),
				to: "/work-with-us"
			},
			{
				label: t("footer.archive"),
				to: "/archive"
			}
		].concat(isPremium ? [{
			label: t("footer.earnPoints"),
			to: "/earn-points"
		}] : [])
	];
	const footerLight = s.footerLogoLight || s.logoLight;
	const footerDark = s.footerLogoDark || s.logoDark;
	const hasLogo = !!(footerLight || footerDark);
	const showLogo = hasLogo;
	const showText = !hasLogo;
	return /* @__PURE__ */ jsx("footer", {
		className: "border-t border-border bg-card/40",
		children: /* @__PURE__ */ jsxs("div", {
			className: "mx-auto max-w-7xl px-4 py-8",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "grid gap-8 md:grid-cols-3",
				children: [
					/* @__PURE__ */ jsxs("div", { children: [
						showLogo && footerLight && /* @__PURE__ */ jsx("img", {
							src: footerLight,
							alt: s.logoText || "Logo",
							className: `h-12 object-contain ${footerDark ? "dark:hidden" : ""} ${showText ? "mb-3" : ""}`
						}),
						showLogo && footerDark && /* @__PURE__ */ jsx("img", {
							src: footerDark,
							alt: s.logoText || "Logo",
							className: `h-12 object-contain ${footerLight ? "hidden dark:block" : ""} ${showText ? "mb-3" : ""}`
						}),
						showText && /* @__PURE__ */ jsxs("h4", {
							className: "text-2xl uppercase leading-none",
							style: {
								fontFamily: "\"Inter\", system-ui, sans-serif",
								fontWeight: 800,
								letterSpacing: "0.05em"
							},
							children: [
								/* @__PURE__ */ jsx("span", {
									style: s.logoColorPrimary ? { color: s.logoColorPrimary } : void 0,
									className: !s.logoColorPrimary || s.logoColorPrimary === "#000000" ? "text-foreground dark:text-white" : "",
									children: s.logoTextPrimary !== void 0 && s.logoTextPrimary !== "" ? s.logoTextPrimary : s.logoText ? s.logoText.split(" ")[0] : "NEWS"
								}),
								" ",
								/* @__PURE__ */ jsx("span", {
									style: { color: s.logoColorSecondary || "#dc2626" },
									children: s.logoTextSecondary !== void 0 && s.logoTextSecondary !== "" ? s.logoTextSecondary : s.logoText && s.logoText.split(" ").length > 1 ? s.logoText.split(" ").slice(1).join(" ") : "THEME"
								})
							]
						}),
						/* @__PURE__ */ jsx("p", {
							className: "mt-3 text-sm text-muted-foreground",
							children: s.metaDescription || "News Theme is an independent newsroom covering breaking news, finance, business and markets across Northeast India and beyond. Trusted, verified and editorially independent journalism."
						}),
						/* @__PURE__ */ jsx(SocialIcons, {
							className: "mt-4",
							size: "md",
							links: {
								facebook: s.facebook,
								instagram: s.instagram,
								twitter: s.twitter,
								pinterest: s.pinterest,
								tiktok: s.tiktok,
								whatsapp: s.whatsapp,
								youtube: s.youtube,
								linkedin: s.linkedin,
								telegram: s.telegram
							}
						})
					] }),
					/* @__PURE__ */ jsxs("div", {
						className: "md:text-center",
						children: [/* @__PURE__ */ jsx("h5", {
							className: "text-sm font-bold uppercase tracking-widest text-foreground",
							children: t("footer.quickLinks")
						}), /* @__PURE__ */ jsx("div", {
							className: "mt-3 space-y-2 text-sm text-muted-foreground",
							children: quickLinks.map((row, i) => /* @__PURE__ */ jsx("div", {
								className: "flex flex-wrap gap-x-5 gap-y-2 md:justify-center",
								children: row.map((l) => l.to ? /* @__PURE__ */ jsx(Link, {
									to: l.to,
									className: "hover:text-foreground hover:underline",
									children: l.label
								}, l.label) : /* @__PURE__ */ jsx("a", {
									href: "#",
									className: "hover:text-foreground hover:underline",
									children: l.label
								}, l.label))
							}, i))
						})]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "md:text-right",
						children: [/* @__PURE__ */ jsx("h5", {
							className: "text-sm font-bold uppercase tracking-widest text-foreground",
							children: t("footer.connectWithUs")
						}), /* @__PURE__ */ jsxs("ul", {
							className: "mt-3 space-y-2.5 text-sm text-muted-foreground",
							children: [
								/* @__PURE__ */ jsxs("li", {
									className: "flex items-start gap-2 md:justify-end",
									children: [/* @__PURE__ */ jsx(MapPin, { className: "mt-0.5 h-4 w-4 shrink-0" }), /* @__PURE__ */ jsxs("span", { children: [
										"Agartala, Tripura (W) India",
										/* @__PURE__ */ jsx("br", {}),
										"Pin: 799006"
									] })]
								}),
								/* @__PURE__ */ jsxs("li", {
									className: "flex items-center gap-2 md:justify-end",
									children: [/* @__PURE__ */ jsx(Phone, { className: "h-4 w-4 shrink-0" }), /* @__PURE__ */ jsx("a", {
										href: "tel:+919999999999",
										className: "hover:text-foreground hover:underline",
										children: "+91 99999 99999"
									})]
								}),
								/* @__PURE__ */ jsxs("li", {
									className: "flex items-center gap-2 md:justify-end",
									children: [/* @__PURE__ */ jsx(Mail, { className: "h-4 w-4 shrink-0" }), /* @__PURE__ */ jsx("a", {
										href: "mailto:hello@northeasttimeline.com",
										className: "hover:text-foreground hover:underline",
										children: "hello@northeasttimeline.com"
									})]
								})
							]
						})]
					})
				]
			}), /* @__PURE__ */ jsxs("div", {
				className: "mt-6 flex flex-col items-center justify-between gap-3 rounded-xl border border-border/80 bg-muted/40 px-5 py-3 text-xs text-muted-foreground shadow-xs md:flex-row",
				children: [/* @__PURE__ */ jsx("p", {
					className: "font-medium",
					children: copyright
				}), /* @__PURE__ */ jsxs("p", {
					className: "flex flex-wrap items-center gap-1.5",
					children: [/* @__PURE__ */ jsxs("span", { children: [t("footer.builtBy"), ":"] }), /* @__PURE__ */ jsx("a", {
						id: "gorilla-tech-partner-tag",
						href: "https://gorillatechsolution.com",
						target: "_blank",
						rel: "noopener noreferrer",
						className: "inline-flex items-center rounded-md bg-[#0F2042] px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-white shadow-xs transition-all hover:bg-[#1E3A8A] hover:shadow-sm",
						children: "GORILLA TECH SOLUTION"
					})]
				})]
			})]
		})
	});
}
//#endregion
export { Footer_exports as n, Footer as t };
