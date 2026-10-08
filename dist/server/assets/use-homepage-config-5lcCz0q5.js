import { n as useAdSettings } from "./AdSettingsContext-DCQLFQ5U.js";
import { a as onHomepageConfigChange, i as loadHomepageConfig, n as defaultHomepageConfig } from "./homepage-config-B3uZiMRt.js";
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

//# sourceMappingURL=use-homepage-config-5lcCz0q5.js.map