import { t as __exportAll } from "./rolldown-runtime-D7D4PA-g.js";
import { t as cleanCopyright } from "./site-settings-D521lAA0.js";
import { a as useSiteSettings } from "./AdSettingsContext-v0YhHRkC.js";
import { i as SocialIcons, r as useTheme } from "./theme-BVjjmeMv.js";
import { n as getAccessibleLogoColor } from "./color-utils-4ZE3UgVW.js";
import { Link } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { Mail, MapPin, Phone } from "lucide-react";
import { useTranslation } from "react-i18next";
//#region src/components/site/Footer.tsx
var Footer_exports = /* @__PURE__ */ __exportAll({ Footer: () => Footer });
function Footer() {
	const { t } = useTranslation();
	const { theme } = useTheme();
	const isDark = theme === "dark" || theme === "system" && typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches;
	const s = useSiteSettings();
	const safeSecondaryColor = getAccessibleLogoColor(s.logoColorSecondary || "#dc2626", isDark, 4.5);
	const year = (/* @__PURE__ */ new Date()).getFullYear();
	const copyright = cleanCopyright(s.copyright || `© ${year} News Theme Media Co. All rights reserved.`).replace("{year}", String(year));
	s.builtByUrl?.startsWith("http") ? s.builtByUrl : `${s.builtByUrl || "GorillaTechsolution.com"}`;
	const planType = (s.licenseType || "").toLowerCase();
	planType.includes("enterprise+") || planType.includes("enterprise plus");
	const showEventLink = s.eventFooterLinkEnabled !== false;
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
				label: t("footer.workWithUs"),
				to: "/work-with-us"
			}
		],
		[
			{
				label: t("footer.submitNews"),
				to: "/submit-news"
			},
			...showEventLink ? [{
				label: t("footer.event", "Event"),
				to: "/event"
			}] : [{
				label: "Reels",
				to: "/reels"
			}],
			{
				label: t("footer.verifiedJournalist"),
				to: "/verified-journalist"
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
				label: "Fact-Checking Policy",
				to: "/fact-checking-policy"
			},
			{
				label: "Data Deletion Policy",
				to: "/data-deletion-policy"
			},
			{
				label: t("footer.dmca"),
				to: "/dmca"
			}
		],
		[
			{
				label: t("footer.subscription"),
				to: "/subscription"
			},
			{
				label: t("footer.archive"),
				to: "/archive"
			},
			{
				label: t("footer.earnPoints"),
				to: "/earn-points"
			}
		]
	];
	const footerLight = s.footerLogoLight || s.logoLight;
	const footerDark = s.footerLogoDark || s.logoDark;
	const hasLogo = !!(footerLight || footerDark);
	const mode = s.logoDisplayMode || (hasLogo ? "logo_only" : "text_only");
	const showLogo = hasLogo && (mode === "logo_only" || mode === "both");
	const showText = !hasLogo || mode === "text_only" || mode === "both";
	return /* @__PURE__ */ jsx("footer", {
		className: "border-t border-border bg-card/40",
		children: /* @__PURE__ */ jsxs("div", {
			className: "mx-auto max-w-7xl px-4 py-8",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "grid gap-8 md:grid-cols-3",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "flex flex-col items-center text-center md:items-start md:text-left",
						children: [
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
							showText && /* @__PURE__ */ jsxs("div", {
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
										children: s.logoTextPrimary !== void 0 && s.logoTextPrimary !== "" ? s.logoTextPrimary : s.logoText ? s.logoText.split(" ")[0] : "Today"
									}),
									" ",
									/* @__PURE__ */ jsx("span", {
										style: { color: safeSecondaryColor },
										children: s.logoTextSecondary !== void 0 && s.logoTextSecondary !== "" ? s.logoTextSecondary : s.logoText && s.logoText.split(" ").length > 1 ? s.logoText.split(" ").slice(1).join(" ") : "Tripura"
									})
								]
							}),
							/* @__PURE__ */ jsxs("p", {
								className: "mt-3 text-sm text-muted-foreground",
								children: [
									s.footerNote?.trim() || s.metaDescription || "News Theme is an independent newsroom covering breaking news, finance, business and markets across Northeast India and beyond. Trusted, verified and editorially independent journalism.",
									" ",
									/* @__PURE__ */ jsx(Link, {
										to: "/about",
										className: "font-semibold text-blue-600 hover:text-blue-700 hover:underline dark:text-blue-400 dark:hover:text-blue-300 ml-1 inline-block",
										children: t("footer.readMore", "Read more")
									})
								]
							}),
							/* @__PURE__ */ jsx(SocialIcons, {
								className: "mt-4 justify-center md:justify-start",
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
						]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "text-center md:text-center",
						children: [/* @__PURE__ */ jsx("p", {
							className: "text-sm font-bold uppercase tracking-widest text-foreground",
							children: t("footer.quickLinks")
						}), /* @__PURE__ */ jsx("div", {
							className: "mt-3 space-y-1.5 sm:space-y-2 text-xs sm:text-[13px] leading-relaxed text-muted-foreground",
							children: quickLinks.map((row, i) => /* @__PURE__ */ jsx("div", {
								className: "flex flex-wrap items-center justify-center gap-x-3 sm:gap-x-4 md:gap-x-5 gap-y-1",
								children: row.map((l) => l.to ? /* @__PURE__ */ jsx(Link, {
									to: l.to,
									className: "whitespace-nowrap hover:text-foreground hover:underline",
									children: l.label
								}, l.label) : /* @__PURE__ */ jsx("a", {
									href: "#",
									className: "whitespace-nowrap hover:text-foreground hover:underline",
									children: l.label
								}, l.label))
							}, i))
						})]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "text-center md:text-right",
						children: [/* @__PURE__ */ jsx("p", {
							className: "text-sm font-bold uppercase tracking-widest text-foreground",
							children: t("footer.connectWithUs")
						}), /* @__PURE__ */ jsxs("ul", {
							className: "mt-3 space-y-2.5 text-sm text-muted-foreground",
							children: [
								/* @__PURE__ */ jsxs("li", {
									className: "flex items-start justify-center gap-2 md:justify-end",
									children: [/* @__PURE__ */ jsx(MapPin, { className: "mt-0.5 h-4 w-4 shrink-0" }), /* @__PURE__ */ jsxs("span", { children: [
										"Agartala, Tripura (W) India",
										/* @__PURE__ */ jsx("br", {}),
										"Pin: 799006"
									] })]
								}),
								/* @__PURE__ */ jsxs("li", {
									className: "flex items-center justify-center gap-2 md:justify-end",
									children: [/* @__PURE__ */ jsx(Phone, { className: "h-4 w-4 shrink-0" }), /* @__PURE__ */ jsx("a", {
										href: "tel:+919999999999",
										className: "hover:text-foreground hover:underline",
										children: "+91 99999 99999"
									})]
								}),
								/* @__PURE__ */ jsxs("li", {
									className: "flex items-center justify-center gap-2 md:justify-end",
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
				className: "mt-6 flex flex-col items-center justify-between gap-2.5 rounded-xl border border-border/80 bg-muted/40 px-3.5 sm:px-5 py-3 text-xs text-muted-foreground shadow-xs md:flex-row",
				children: [/* @__PURE__ */ jsx("p", {
					className: "font-medium text-center md:text-left whitespace-nowrap text-[10.5px] min-[360px]:text-[11.5px] sm:text-xs tracking-tight sm:tracking-normal overflow-hidden text-ellipsis max-w-full",
					children: copyright
				}), /* @__PURE__ */ jsxs("p", {
					className: "flex flex-wrap items-center justify-center gap-1.5 md:justify-end text-[11px] sm:text-xs",
					children: [/* @__PURE__ */ jsxs("span", { children: [t("footer.builtBy"), ":"] }), /* @__PURE__ */ jsx("a", {
						id: "gorilla-tech-partner-tag",
						href: "https://gorillatechsolution.com",
						target: "_blank",
						rel: "noopener noreferrer",
						className: "inline-flex items-center rounded-md bg-[#0F2042] px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-white shadow-xs transition-all hover:bg-[#1E3A8A] hover:shadow-sm shrink-0",
						children: "GORILLA TECH SOLUTION"
					})]
				})]
			})]
		})
	});
}
//#endregion
export { Footer_exports as n, Footer as t };

//# sourceMappingURL=Footer-rrHMPHZp.js.map