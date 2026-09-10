import { _ as loadSettings, r as defaultSettings } from "./site-content-BLphzo5E.js";
import { d as loadFontConfig, s as defaultFontConfig } from "./font-config-DUk6A9fC.js";
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
	const [s, setS] = useState(() => ctx?.settings ?? defaultSettings);
	useEffect(() => {
		if (ctx?.settings) setS(ctx.settings);
	}, [ctx?.settings]);
	useEffect(() => {
		if (!ctx) {
			setS(loadSettings());
			const sync = () => setS(loadSettings());
			window.addEventListener("nt:ads-updated", sync);
			return () => window.removeEventListener("nt:ads-updated", sync);
		}
	}, [ctx]);
	return s;
}
function useFontConfig() {
	const ctx = useAdSettings();
	const [fc, setFc] = useState(() => ctx?.fontConfig ?? defaultFontConfig);
	useEffect(() => {
		if (ctx?.fontConfig) setFc(ctx.fontConfig);
	}, [ctx?.fontConfig]);
	useEffect(() => {
		if (!ctx) setFc(loadFontConfig());
		const sync = () => setFc(loadFontConfig());
		window.addEventListener("nt:fonts-updated", sync);
		return () => window.removeEventListener("nt:fonts-updated", sync);
	}, [ctx]);
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
