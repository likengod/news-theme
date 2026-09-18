import { a as useSiteSettings } from "./AdSettingsContext-v0YhHRkC.js";
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { jsx } from "react/jsx-runtime";
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaPinterestP, FaTiktok, FaTwitter, FaWhatsapp, FaYoutube } from "react-icons/fa6";
import { FaTelegramPlane } from "react-icons/fa";
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
export { SocialIcons as i, themeInitScript as n, useTheme as r, ThemeProvider as t };

//# sourceMappingURL=theme-BVjjmeMv.js.map