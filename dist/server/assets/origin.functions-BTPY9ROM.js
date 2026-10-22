import { o as getRequest, r as createServerFn } from "./server-C8fAb8tn.js";
import { t as createServerRpc } from "./createServerRpc-5muEW1wE.js";
// src/lib/origin.functions.ts?tss-serverfn-split
var getRequestOrigin_createServerFn_handler = createServerRpc({
	id: "5654329e34be191256640c8957e4eaed33fcb574dfccb4b513f44c828b16863f",
	name: "getRequestOrigin",
	filename: "src/lib/origin.functions.ts"
}, (opts) => getRequestOrigin.__executeServer(opts));
var getRequestOrigin = createServerFn({ method: "GET" }).handler(getRequestOrigin_createServerFn_handler, () => {
	const req = getRequest();
	return `${req.headers.get("x-forwarded-proto") ?? "https"}://${req.headers.get("host") ?? "localhost:8080"}`;
});
export { getRequestOrigin_createServerFn_handler };

//# sourceMappingURL=origin.functions-BTPY9ROM.js.map