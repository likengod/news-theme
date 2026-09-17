import { i as loadSettings } from "./site-settings-Dzehx1jE.js";
import { d as loadFontConfig, s as defaultFontConfig } from "./font-config-DnWJuT-1.js";
import { createContext, useContext, useEffect, useState } from "react";
import { jsx } from "react/jsx-runtime";
//#region src/components/site/AdSettingsContext.tsx
var AdSettingsContext = createContext(null);
function AdSettingsProvider({ children, value }) {
	return /* @__PURE__ */ jsx(AdSettingsContext.Provider, {
		value,
		children
	});
}
function useAdSettings() {
	return useContext(AdSettingsContext);
}
function useSiteSettings() {
	const ctx = useAdSettings();
	const [s, setS] = useState(() => ctx?.settings ?? loadSettings());
	useEffect(() => {
		if (ctx?.settings) {
			setS(ctx.settings);
			if (typeof window !== "undefined") try {
				localStorage.setItem("nt:site-settings", JSON.stringify(ctx.settings));
			} catch {}
		}
	}, [ctx?.settings]);
	useEffect(() => {
		const sync = () => {
			setS(loadSettings());
		};
		window.addEventListener("nt:settings-updated", sync);
		window.addEventListener("nt:ads-updated", sync);
		return () => {
			window.removeEventListener("nt:settings-updated", sync);
			window.removeEventListener("nt:ads-updated", sync);
		};
	}, []);
	return s;
}
function useFontConfig() {
	const ctx = useAdSettings();
	const [fc, setFc] = useState(() => ctx?.fontConfig ?? defaultFontConfig);
	useEffect(() => {
		if (ctx?.fontConfig) setFc(ctx.fontConfig);
	}, [ctx?.fontConfig]);
	useEffect(() => {
		const sync = () => setFc(loadFontConfig());
		window.addEventListener("nt:fonts-updated", sync);
		return () => window.removeEventListener("nt:fonts-updated", sync);
	}, []);
	return fc;
}
function useCategories() {
	const ctx = useAdSettings();
	const [cats, setCats] = useState(() => ctx?.categories ?? []);
	useEffect(() => {
		if (ctx?.categories) setCats(ctx.categories);
	}, [ctx?.categories]);
	return cats;
}
//#endregion
export { useSiteSettings as a, useFontConfig as i, useAdSettings as n, useCategories as r, AdSettingsProvider as t };

//# sourceMappingURL=AdSettingsContext-Dzko-urs.js.map