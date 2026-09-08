import { n as useAdSettings } from "./AdSettingsContext-Dy81m2Pl.js";
import { a as loadHomepageConfig, o as onHomepageConfigChange, r as defaultHomepageConfig } from "./homepage-config-CrSI2vlk.js";
import { useEffect, useState } from "react";
//#region src/hooks/use-homepage-config.ts
function useHomepageConfig() {
	const ctx = useAdSettings();
	const [cfg, setCfg] = useState(() => ctx?.homepageConfig ?? defaultHomepageConfig);
	useEffect(() => {
		if (ctx?.homepageConfig) setCfg(ctx.homepageConfig);
	}, [ctx?.homepageConfig]);
	useEffect(() => {
		if (!ctx) {
			setCfg(loadHomepageConfig());
			return onHomepageConfigChange(() => {
				setCfg(loadHomepageConfig());
			});
		}
	}, [ctx]);
	return cfg;
}
//#endregion
export { useHomepageConfig as t };
