import { n as useAdSettings } from "./AdSettingsContext-C0MbAi1f.js";
import { a as loadHomepageConfig, o as onHomepageConfigChange, r as defaultHomepageConfig } from "./homepage-config-CSXmY2-I.js";
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
	return ctx?.homepageConfig ?? cfg;
}
//#endregion
export { useHomepageConfig as t };

//# sourceMappingURL=use-homepage-config-2ZY-hIBf.js.map