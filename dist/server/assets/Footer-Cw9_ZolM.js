import { a as isEnterprisePlusLicense, i as isEnterpriseLicense, t as cleanCopyright } from "./site-settings-cWSnE2Ns.js";
import { a as useSiteSettings } from "./AdSettingsContext-DL3ndTev.js";
import { n as getAccessibleLogoColor } from "./color-utils-4ZE3UgVW.js";
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { Mail, MapPin, Phone } from "lucide-react";
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaPinterestP, FaTiktok, FaTwitter, FaWhatsapp, FaYoutube } from "react-icons/fa6";
import { FaTelegramPlane } from "react-icons/fa";
//#region src/lib/theme.tsx
var ThemeContext = createContext(null);
var STORAGE_KEY = "fs-theme";
function ThemeProvider({ children }) {
	const [theme, setThemeState] = useState("light");
	useEffect(() => {
		const initial = (typeof window !== "undefined" && localStorage.getItem(STORAGE_KEY)) ?? "light";
		applyTheme(initial);
		setThemeState(initial);
	}, []);
	const setTheme = useCallback((t) => {
		applyTheme(t);
		localStorage.setItem(STORAGE_KEY, t);
		setThemeState(t);
	}, []);
	const toggle = useCallback(() => {
		setTheme(theme === "dark" ? "light" : "dark");
	}, [theme, setTheme]);
	return /* @__PURE__ */ jsx(ThemeContext.Provider, {
		value: {
			theme,
			toggle,
			setTheme
		},
		children
	});
}
function applyTheme(t) {
	if (typeof document === "undefined") return;
	const root = document.documentElement;
	root.classList.toggle("dark", t === "dark");
	root.style.colorScheme = t;
}
function useTheme() {
	const ctx = useContext(ThemeContext);
	if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
	return ctx;
}
/** Inline script to set theme before hydration to avoid FOUC. */
var themeInitScript = `(function(){try{var t=localStorage.getItem('${STORAGE_KEY}')||'light';var r=document.documentElement;if(t==='dark')r.classList.add('dark');r.style.colorScheme=t;}catch(e){}})();`;
//#endregion
//#region src/lib/i18n.ts
var resources = {
	en: {
		nav: {
			"home": "Home",
			"subscribe": "Subscribe",
			"nightMode": "Night mode",
			"search": "Search news…",
			"navigation": "Navigation"
		},
		sideNav: {
			"live": "Live",
			"reels": "Shorts / Reels",
			"results": "Results",
			"videos": "Videos",
			"photos": "Photo Gallery",
			"factCheck": "Fact Check",
			"opinion": "Opinion",
			"archive": "Archive",
			"urgent": "Utilities",
			"emiCalculator": "EMI Calculator",
			"ageCalculator": "Age Calculator"
		},
		footer: {
			"quickLinks": "Quick Links",
			"connectWithUs": "Connect With Us",
			"about": "About",
			"contact": "Contact Us",
			"submitNews": "Submit News",
			"event": "Event",
			"privacyPolicy": "Privacy Policy",
			"terms": "Terms & Conditions",
			"cookiePolicy": "Cookie Policy",
			"refundPolicy": "Refund Policy",
			"disclaimer": "Disclaimer",
			"editorialPolicy": "Editorial Policy",
			"dmca": "DMCA",
			"factCheck": "Fact Check",
			"factCheckingPolicy": "Fact-Checking Policy",
			"verifiedJournalist": "Verified Journalist",
			"subscription": "Subscription",
			"workWithUs": "Work With Us",
			"archive": "Archive",
			"earnPoints": "Earn Points",
			"builtBy": "Website built and digital partner",
			"readMore": "Read more"
		}
	},
	hi: {
		nav: {
			"home": "होम",
			"subscribe": "सब्सक्राइब",
			"nightMode": "डार्क मोड",
			"search": "समाचार खोजें…",
			"navigation": "नेविगेशन"
		},
		sideNav: {
			"live": "लाइव",
			"reels": "शॉर्ट्स / रील्स",
			"results": "परिणाम",
			"videos": "वीडियो",
			"photos": "फोटो गैलरी",
			"factCheck": "फैक्ट चेक",
			"opinion": "विचार / ओपिनियन",
			"archive": "आर्काइव",
			"urgent": "ज़रूरी",
			"emiCalculator": "ईएमआई कैलकुलेटर",
			"ageCalculator": "आयु कैलकुलेटर"
		},
		footer: {
			"quickLinks": "त्वरित लिंक",
			"connectWithUs": "हमसे जुड़ें",
			"about": "हमारे बारे में",
			"contact": "संपर्क करें",
			"submitNews": "समाचार भेजें",
			"event": "इवेंट",
			"privacyPolicy": "गोपनीयता नीति",
			"terms": "नियम और शर्तें",
			"cookiePolicy": "कुकी नीति",
			"refundPolicy": "रिफंड नीति",
			"disclaimer": "अस्वीकरण",
			"editorialPolicy": "संपादकीय नीति",
			"factCheck": "फैक्ट चेक",
			"factCheckingPolicy": "फैक्ट-चेकिंग नीति",
			"dmca": "DMCA",
			"verifiedJournalist": "सत्यापित पत्रकार",
			"subscription": "सदस्यता",
			"workWithUs": "हमारे साथ काम करें",
			"archive": "पुरालेख",
			"earnPoints": "अंक अर्जित करें",
			"builtBy": "वेबसाइट निर्माण और डिजिटल पार्टनर",
			"readMore": "और पढ़ें"
		}
	},
	bn: {
		nav: {
			"home": "হোম",
			"subscribe": "সাবস্ক্রাইব",
			"nightMode": "নাইট মোড",
			"search": "খবর খুঁজুন…",
			"navigation": "নেভিগেশন"
		},
		sideNav: {
			"live": "লাইভ",
			"reels": "শর্টস / Reels",
			"results": "Result",
			"videos": "ভিডিও",
			"photos": "ফটো গ্যালারি",
			"factCheck": "ফ্যাক্ট চেক",
			"opinion": "ওপিনিয়ন",
			"archive": "আর্কাইভ",
			"urgent": "জরুরি",
			"emiCalculator": "EMI ক্যালকুলেটর",
			"ageCalculator": "বয়সের ক্যালকুলেটর"
		},
		footer: {
			"quickLinks": "দ্রুত লিঙ্ক",
			"connectWithUs": "আমাদের সাথে যুক্ত হন",
			"about": "আমাদের সম্পর্কে",
			"contact": "যোগাযোগ করুন",
			"submitNews": "খবর পাঠান",
			"event": "ইভেন্ট",
			"privacyPolicy": "গোপনীয়তা নীতি",
			"terms": "শর্তাবলী",
			"cookiePolicy": "কুকি নীতি",
			"refundPolicy": "রিফান্ড নীতি",
			"disclaimer": "দাবিত্যাগ",
			"editorialPolicy": "সম্পাদকীয় নীতি",
			"dmca": "DMCA",
			"factCheck": "ফ্যাক্ট চেক",
			"factCheckingPolicy": "ফ্যাক্ট-চেকিং নীতি",
			"verifiedJournalist": "যাচাইকৃত সাংবাদিক",
			"subscription": "সাবস্ক্রিপশন",
			"workWithUs": "আমাদের সাথে কাজ করুন",
			"archive": "আর্কাইভ",
			"earnPoints": "পয়েন্ট অর্জন করুন",
			"builtBy": "ওয়েবসাইট নির্মাণ এবং ডিজিটাল পার্টনার",
			"readMore": "আরও পড়ুন"
		}
	}
};
var currentLanguage = "en";
var listeners = /* @__PURE__ */ new Set();
function detectInitialLanguage() {
	if (typeof window === "undefined") return "en";
	try {
		const cookie = document.cookie;
		if (cookie.includes("googtrans=/en/hi") || cookie.includes("googtrans=%2Fen%2Fhi")) return "hi";
		if (cookie.includes("googtrans=/en/bn") || cookie.includes("googtrans=%2Fen%2Fbn")) return "bn";
		const stored = localStorage.getItem("nt_i18n_lang");
		if (stored && resources[stored]) return stored;
		const navLang = navigator.language?.toLowerCase() || "";
		if (navLang.startsWith("hi")) return "hi";
		if (navLang.startsWith("bn")) return "bn";
	} catch {}
	return "en";
}
if (typeof window !== "undefined") currentLanguage = detectInitialLanguage();
var i18n = {
	get language() {
		return currentLanguage;
	},
	changeLanguage(lng) {
		if (resources[lng]) currentLanguage = lng;
		else currentLanguage = "en";
		if (typeof window !== "undefined") try {
			localStorage.setItem("nt_i18n_lang", currentLanguage);
		} catch {}
		listeners.forEach((fn) => fn());
		return Promise.resolve();
	}
};
function useTranslation() {
	const [, setTick] = useState(0);
	useEffect(() => {
		const handler = () => setTick((t) => t + 1);
		listeners.add(handler);
		return () => {
			listeners.delete(handler);
		};
	}, []);
	const t = (key, fallback) => {
		const parts = key.split(".");
		let current = resources[currentLanguage] || resources.en;
		for (const part of parts) if (current && typeof current === "object" && part in current) current = current[part];
		else {
			current = void 0;
			break;
		}
		if (typeof current === "string") return current;
		if (fallback !== void 0) return fallback;
		return parts[parts.length - 1] || key;
	};
	return {
		t,
		i18n
	};
}
//#endregion
//#region src/components/site/SocialIcons.tsx
var DEFAULT_LINKS = {
	facebook: "#",
	instagram: "#",
	twitter: "#",
	pinterest: "#",
	tiktok: "#",
	whatsapp: "#",
	youtube: "#",
	linkedin: "#",
	telegram: "#"
};
function buildItems(links, only) {
	const all = [
		{
			key: "facebook",
			label: "Facebook",
			href: links.facebook || DEFAULT_LINKS.facebook,
			Icon: FaFacebookF
		},
		{
			key: "instagram",
			label: "Instagram",
			href: links.instagram || DEFAULT_LINKS.instagram,
			Icon: FaInstagram
		},
		{
			key: "twitter",
			label: "Twitter",
			href: links.twitter || DEFAULT_LINKS.twitter,
			Icon: FaTwitter
		},
		{
			key: "pinterest",
			label: "Pinterest",
			href: links.pinterest || DEFAULT_LINKS.pinterest,
			Icon: FaPinterestP
		},
		{
			key: "tiktok",
			label: "TikTok",
			href: links.tiktok || DEFAULT_LINKS.tiktok,
			Icon: FaTiktok
		},
		{
			key: "whatsapp",
			label: "WhatsApp",
			href: links.whatsapp || DEFAULT_LINKS.whatsapp,
			Icon: FaWhatsapp
		},
		{
			key: "youtube",
			label: "YouTube",
			href: links.youtube || DEFAULT_LINKS.youtube,
			Icon: FaYoutube
		},
		{
			key: "linkedin",
			label: "LinkedIn",
			href: links.linkedin || DEFAULT_LINKS.linkedin,
			Icon: FaLinkedinIn
		},
		{
			key: "telegram",
			label: "Telegram",
			href: links.telegram || DEFAULT_LINKS.telegram,
			Icon: FaTelegramPlane
		}
	];
	return only ? all.filter((i) => only.includes(i.key)) : all;
}
var SIZE_MAP = {
	sm: {
		icon: "h-4 w-4",
		box: "h-7 w-7"
	},
	md: {
		icon: "h-5 w-5",
		box: "h-8 w-8"
	},
	lg: {
		icon: "h-6 w-6",
		box: "h-10 w-10"
	}
};
var BRAND_COLORS = {
	facebook: "#1877F2",
	instagram: "#E4405F",
	twitter: "#1DA1F2",
	pinterest: "#E60023",
	tiktok: "#000000",
	whatsapp: "#25D366",
	youtube: "#FF0000",
	linkedin: "#0A66C2",
	telegram: "#26A5E4"
};
function SocialIcons({ links = {}, only, orientation = "horizontal", size = "md", className = "" }) {
	const s = useSiteSettings();
	const items = buildItems({
		facebook: links.facebook && links.facebook !== "#" ? links.facebook : s.facebook !== "#" ? s.facebook : void 0,
		instagram: links.instagram && links.instagram !== "#" ? links.instagram : s.instagram !== "#" ? s.instagram : void 0,
		twitter: links.twitter && links.twitter !== "#" ? links.twitter : s.twitter !== "#" ? s.twitter : void 0,
		pinterest: links.pinterest && links.pinterest !== "#" ? links.pinterest : s.pinterest !== "#" ? s.pinterest : void 0,
		tiktok: links.tiktok && links.tiktok !== "#" ? links.tiktok : s.tiktok !== "#" ? s.tiktok : void 0,
		whatsapp: links.whatsapp && links.whatsapp !== "#" ? links.whatsapp : s.whatsapp !== "#" ? s.whatsapp : void 0,
		youtube: links.youtube && links.youtube !== "#" ? links.youtube : s.youtube !== "#" ? s.youtube : void 0,
		linkedin: links.linkedin && links.linkedin !== "#" ? links.linkedin : s.linkedin !== "#" ? s.linkedin : void 0,
		telegram: links.telegram && links.telegram !== "#" ? links.telegram : s.telegram !== "#" ? s.telegram : void 0
	}, only).filter((item) => item.href !== "#" && item.href !== "");
	const sClass = SIZE_MAP[size];
	if (items.length === 0) return null;
	return /* @__PURE__ */ jsx("div", {
		className: `${orientation === "vertical" ? "flex flex-col gap-3" : "flex flex-wrap items-center gap-1.5"} ${className}`,
		children: items.map(({ key, label, href, Icon }) => /* @__PURE__ */ jsx("a", {
			href,
			target: "_blank",
			rel: "noopener noreferrer",
			"aria-label": label,
			className: `inline-flex ${sClass.box} items-center justify-center transition-transform hover:scale-110`,
			style: { color: BRAND_COLORS[key] },
			children: /* @__PURE__ */ jsx(Icon, { className: sClass.icon })
		}, key))
	});
}
//#endregion
//#region src/components/site/Footer.tsx
function Footer() {
	const { t } = useTranslation();
	const { theme } = useTheme();
	const isDark = theme === "dark" || theme === "system" && typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches;
	const s = useSiteSettings();
	const safeSecondaryColor = getAccessibleLogoColor(s.logoColorSecondary || "#dc2626", isDark, 4.5);
	const year = (/* @__PURE__ */ new Date()).getFullYear();
	const copyright = cleanCopyright(s.copyright || `© ${year} News Theme Media Co. All rights reserved.`).replace("{year}", String(year));
	s.builtByUrl?.startsWith("http") ? s.builtByUrl : `${s.builtByUrl || "GorillaTechsolution.com"}`;
	const isEnterprise = isEnterpriseLicense(s);
	const isEnterprisePlus = isEnterprisePlusLicense(s);
	const showEventLink = s.eventFooterLinkEnabled !== false;
	const allAvailableLinks = [
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
		},
		{
			label: t("footer.submitNews"),
			to: "/submit-news"
		},
		...showEventLink ? [{
			label: t("footer.event", "Event"),
			to: "/event"
		}] : [],
		...isEnterprise ? [{
			label: t("footer.factCheck", "Fact Check"),
			to: "/fact-check"
		}] : [],
		...isEnterprise ? [{
			label: t("footer.verifiedJournalist"),
			to: "/verified-journalist"
		}] : [],
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
		},
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
		},
		{
			label: t("footer.factCheckingPolicy", "Fact-Checking Policy"),
			to: "/fact-checking-policy"
		},
		{
			label: "Data Deletion Policy",
			to: "/data-deletion-policy"
		},
		{
			label: t("footer.dmca"),
			to: "/dmca"
		},
		{
			label: t("footer.subscription"),
			to: "/subscription"
		},
		{
			label: t("footer.archive"),
			to: "/archive"
		},
		...isEnterprisePlus ? [{
			label: t("footer.earnPoints"),
			to: "/earn-points"
		}] : []
	];
	const quickLinks = [];
	for (let i = 0; i < allAvailableLinks.length; i += 3) quickLinks.push(allAvailableLinks.slice(i, i + 3));
	const footerLight = s.footerLogoLight || s.logoLight;
	const footerDark = s.footerLogoDark || s.logoDark;
	const hasLogo = !!(footerLight || footerDark);
	const mode = s.logoDisplayMode || (hasLogo ? "both" : "text_only");
	const showLogo = hasLogo && (mode === "logo_only" || mode === "both" || mode === "both_stacked" || mode === "logo_fit");
	const showText = !hasLogo || mode === "text_only" || mode === "both" || mode === "both_stacked";
	const isSideBySide = mode === "both" && showLogo && showText;
	allAvailableLinks.slice(0, 7);
	allAvailableLinks.slice(7);
	s.footerWidth === "full" || s.footerWidth;
	const dividerAccentColor = safeSecondaryColor || s.logoColorSecondary || "#dc2626";
	return /* @__PURE__ */ jsx("footer", {
		className: "border-t border-border bg-card/40 w-full overflow-hidden",
		children: /* @__PURE__ */ jsxs("div", {
			className: "w-full px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 py-8",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "grid gap-8 md:grid-cols-3 lg:gap-10 items-start",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "flex flex-col items-center text-center md:items-start md:text-left",
						children: [
							/* @__PURE__ */ jsxs(Link, {
								to: "/",
								"aria-label": s.siteName || "Home",
								className: `inline-flex max-w-full ${isSideBySide ? "flex-row items-center gap-3 text-left" : "flex-col items-center text-center md:items-start md:text-left"}`,
								children: [
									showLogo && footerLight && /* @__PURE__ */ jsx("img", {
										src: footerLight,
										alt: s.logoText || "Logo",
										width: 180,
										height: 48,
										loading: "lazy",
										decoding: "async",
										className: `h-11 w-auto max-w-[70px] sm:max-w-[90px] object-contain shrink-0 ${footerDark ? "dark:hidden" : ""} ${!isSideBySide && showText ? "mb-3" : ""}`
									}),
									showLogo && footerDark && /* @__PURE__ */ jsx("img", {
										src: footerDark,
										alt: s.logoText || "Logo",
										width: 180,
										height: 48,
										loading: "lazy",
										decoding: "async",
										className: `h-11 w-auto max-w-[70px] sm:max-w-[90px] object-contain shrink-0 ${footerLight ? "hidden dark:block" : ""} ${!isSideBySide && showText ? "mb-3" : ""}`
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
												style: { color: dividerAccentColor },
												children: s.logoTextSecondary !== void 0 && s.logoTextSecondary !== "" ? s.logoTextSecondary : s.logoText && s.logoText.split(" ").length > 1 ? s.logoText.split(" ").slice(1).join(" ") : "Tripura"
											})
										]
									})
								]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "my-3.5 flex items-center gap-2 w-full max-w-[220px] mx-auto md:mx-0",
								"aria-hidden": "true",
								children: [/* @__PURE__ */ jsx("span", {
									className: "h-[4px] w-12 rounded-full shrink-0 shadow-xs",
									style: { backgroundColor: dividerAccentColor }
								}), /* @__PURE__ */ jsx("span", { className: "h-[1.5px] flex-1 bg-border/90 rounded-full" })]
							}),
							/* @__PURE__ */ jsxs("p", {
								className: "text-sm text-muted-foreground leading-relaxed mt-1",
								children: [
									s.footerNote?.trim() || s.metaDescription || "News Theme is an independent newsroom covering breaking news, finance, business and markets across Northeast India and beyond. Trusted, verified and editorially independent journalism.",
									" ",
									/* @__PURE__ */ jsx(Link, {
										to: "/about",
										"aria-label": t("footer.readMoreAbout", "Read more about us"),
										className: "font-semibold text-blue-600 hover:text-blue-700 hover:underline dark:text-blue-400 dark:hover:text-blue-300 ml-1 inline-block",
										children: t("footer.readMoreAbout", "Read more about us")
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
						className: "text-center",
						children: [
							/* @__PURE__ */ jsx("p", {
								className: "text-sm font-bold uppercase tracking-widest text-foreground",
								children: t("footer.quickLinks")
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "my-3 flex items-center justify-center gap-2 w-full max-w-[160px] mx-auto",
								"aria-hidden": "true",
								children: [/* @__PURE__ */ jsx("span", {
									className: "h-[3.5px] w-10 rounded-full shrink-0 shadow-xs",
									style: { backgroundColor: dividerAccentColor }
								}), /* @__PURE__ */ jsx("span", { className: "h-[1.5px] flex-1 bg-border/90 rounded-full" })]
							}),
							/* @__PURE__ */ jsx("div", {
								className: "mt-3 space-y-2 text-xs sm:text-[13px] leading-relaxed text-muted-foreground",
								children: quickLinks.map((row, i) => /* @__PURE__ */ jsx("div", {
									className: "flex flex-wrap items-center justify-center gap-x-3.5 sm:gap-x-4 md:gap-x-5 gap-y-1",
									children: row.map((l) => l.to ? /* @__PURE__ */ jsx(Link, {
										to: l.to,
										className: "whitespace-nowrap hover:text-foreground hover:underline transition-colors py-0.5",
										children: l.label
									}, l.label) : /* @__PURE__ */ jsx("a", {
										href: "#",
										className: "whitespace-nowrap hover:text-foreground hover:underline transition-colors py-0.5",
										children: l.label
									}, l.label))
								}, i))
							})
						]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "text-center md:text-right",
						children: [
							/* @__PURE__ */ jsx("p", {
								className: "text-sm font-bold uppercase tracking-widest text-foreground",
								children: t("footer.connectWithUs")
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "my-3 flex items-center justify-center md:justify-end gap-2 w-full max-w-[180px] mx-auto md:ml-auto md:mr-0",
								"aria-hidden": "true",
								children: [
									/* @__PURE__ */ jsx("span", { className: "h-[1.5px] flex-1 bg-border/90 rounded-full hidden md:block" }),
									/* @__PURE__ */ jsx("span", {
										className: "h-[3.5px] w-10 rounded-full shrink-0 shadow-xs",
										style: { backgroundColor: dividerAccentColor }
									}),
									/* @__PURE__ */ jsx("span", { className: "h-[1.5px] flex-1 bg-border/90 rounded-full md:hidden" })
								]
							}),
							/* @__PURE__ */ jsxs("ul", {
								className: "mt-3 space-y-2.5 text-sm text-muted-foreground",
								children: [
									/* @__PURE__ */ jsxs("li", {
										className: "flex items-start justify-center gap-2 md:justify-end",
										children: [/* @__PURE__ */ jsx(MapPin, { className: "mt-0.5 h-4 w-4 shrink-0" }), /* @__PURE__ */ jsxs("span", {
											className: "text-center md:text-right",
											children: [s.address || "Agartala, Tripura, India", (s.pinCode || !s.address) && /* @__PURE__ */ jsxs(Fragment, { children: [
												/* @__PURE__ */ jsx("br", {}),
												"Pin: ",
												s.pinCode || "799006"
											] })]
										})]
									}),
									/* @__PURE__ */ jsxs("li", {
										className: "flex items-center justify-center gap-2 md:justify-end",
										children: [/* @__PURE__ */ jsx(Phone, { className: "h-4 w-4 shrink-0" }), /* @__PURE__ */ jsx("a", {
											href: `tel:${(s.contactPhone || "+91 99999 99999").replace(/\s+/g, "")}`,
											className: "hover:text-foreground hover:underline",
											children: s.contactPhone || "+91 99999 99999"
										})]
									}),
									/* @__PURE__ */ jsxs("li", {
										className: "flex items-center justify-center gap-2 md:justify-end",
										children: [/* @__PURE__ */ jsx(Mail, { className: "h-4 w-4 shrink-0" }), /* @__PURE__ */ jsx("a", {
											href: `mailto:${s.contactEmail || "contact@todaytripura.com"}`,
											className: "hover:text-foreground hover:underline",
											children: s.contactEmail || "contact@todaytripura.com"
										})]
									})
								]
							})
						]
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
export { themeInitScript as a, ThemeProvider as i, SocialIcons as n, useTheme as o, useTranslation as r, Footer as t };

//# sourceMappingURL=Footer-Cw9_ZolM.js.map