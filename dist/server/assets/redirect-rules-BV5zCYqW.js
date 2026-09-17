import { r as createServerFn } from "./esm-B50dUWcE.js";
import { t as createSsrRpc } from "./createSsrRpc-CbCBE447.js";
import { t as requireAdmin } from "./auth-middleware-CzbwKkqR.js";
import { z } from "zod";
//#region src/lib/site-content/redirect-rules.ts
var getRedirectRulesServer = createServerFn({ method: "GET" }).handler(createSsrRpc("7cbf675c7bd7c9ee224e699588bfa7a4d7b38ac86b77a40ade5d857819ebe6a7"));
var saveRedirectRulesServer = createServerFn({ method: "POST" }).middleware([requireAdmin]).validator((rules) => z.array(z.object({
	id: z.string(),
	source: z.string(),
	destination: z.string(),
	hits: z.number(),
	createdAt: z.string()
})).parse(rules)).handler(createSsrRpc("2b528109ae68caadb520b78d8504c061898b4465ebb34cde90c52d157753bde0"));
var incrementRedirectHitServer = createServerFn({ method: "POST" }).validator((id) => z.string().parse(id)).handler(createSsrRpc("fc9dae9aa403f9bc644d51588c7c5f5b486d759eecd1cfd041e553d794565167"));
var scanBrokenLinksServer = createServerFn({ method: "GET" }).middleware([requireAdmin]).handler(createSsrRpc("64074aae210bf06c1f6dd880c1ceb389e454c17f09dc8077502ecd8f6d3d97f2"));
var fixBrokenLinkServer = createServerFn({ method: "POST" }).middleware([requireAdmin]).validator((data) => z.object({
	articleId: z.number(),
	brokenUrl: z.string().min(1),
	correctedUrl: z.string().min(1)
}).parse(data)).handler(createSsrRpc("1f78d7f578a6afa4f03a2d2bc26fcf60e865cac4f78ccc0a2b5d02cfe41e0c1c"));
//#endregion
export { scanBrokenLinksServer as a, saveRedirectRulesServer as i, getRedirectRulesServer as n, incrementRedirectHitServer as r, fixBrokenLinkServer as t };

//# sourceMappingURL=redirect-rules-BV5zCYqW.js.map