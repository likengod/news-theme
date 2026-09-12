import { t as getRequest } from "./request-response-BEPp1C2k.js";
import { i as createServerFn } from "./esm-Dova13aH.js";
import { t as createServerRpc } from "./createServerRpc-WJgk8O8C.js";
//#region src/lib/origin.functions.ts?tss-serverfn-split
var getRequestOrigin_createServerFn_handler = createServerRpc({
	id: "5654329e34be191256640c8957e4eaed33fcb574dfccb4b513f44c828b16863f",
	name: "getRequestOrigin",
	filename: "src/lib/origin.functions.ts"
}, (opts) => getRequestOrigin.__executeServer(opts));
var getRequestOrigin = createServerFn({ method: "GET" }).handler(getRequestOrigin_createServerFn_handler, () => {
	const req = getRequest();
	return `${req.headers.get("x-forwarded-proto") ?? "https"}://${req.headers.get("host") ?? "localhost:8080"}`;
});
//#endregion
export { getRequestOrigin_createServerFn_handler };

//# sourceMappingURL=origin.functions-Bs_z3xfW.js.map