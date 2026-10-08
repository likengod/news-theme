import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { jsx } from "react/jsx-runtime";
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
export { themeInitScript as n, useTheme as r, ThemeProvider as t };

//# sourceMappingURL=theme-3HUYOunA.js.map