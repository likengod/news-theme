import { i as createServerFn } from "./server-rotgP4LI.js";
import { t as createSsrRpc } from "./createSsrRpc-CfzAkpDR.js";
import { t as requireAdmin } from "./auth-middleware-CsBFZhSC.js";
import { t as attachAuth } from "./auth-attacher-C0J7wcn4.js";
// src/lib/cdn.functions.ts
var purgeEdgeCdnServer = createServerFn({ method: "POST" }).middleware([attachAuth, requireAdmin]).validator((opts) => opts).handler(createSsrRpc("509b385316e86899d89a791a829c18940efbe7f30a57fc190b3d7737b627a870"));
export { purgeEdgeCdnServer as t };

//# sourceMappingURL=cdn.functions-ClIyUn3J.js.map