import { a as getReelsConfigServer, c as onReelsConfigChange, s as loadReelsConfig } from "./reels-config-B-wUolvV.js";
import { useEffect, useState } from "react";
//#region src/hooks/use-reels-config.ts
function useReelsConfig() {
	const [cfg, setCfg] = useState(() => loadReelsConfig());
	useEffect(() => {
		const unsub = onReelsConfigChange(() => setCfg(loadReelsConfig()));
		getReelsConfigServer().then((serverCfg) => {
			if (serverCfg) {
				setCfg(serverCfg);
				if (typeof window !== "undefined") try {
					localStorage.setItem("nt:reels-config:v2", JSON.stringify(serverCfg));
				} catch {}
			}
		}).catch(() => {});
		return unsub;
	}, []);
	return cfg;
}
//#endregion
export { useReelsConfig as t };

//# sourceMappingURL=use-reels-config-CsyOn5rK.js.map