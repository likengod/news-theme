import { n as useAdSettings } from "./AdSettingsContext-CMszar1p.js";
import { a as loadHomepageConfig, o as onHomepageConfigChange, r as defaultHomepageConfig } from "./homepage-config-BU50dFkM.js";
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

//# sourceMappingURL=use-homepage-config-DO9keb_T.js.map