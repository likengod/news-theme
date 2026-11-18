import { i as createServerFn } from "./server-DL9zr2xn.js";
import { t as createSsrRpc } from "./createSsrRpc-MMk_7xI6.js";
import { t as requireAdmin } from "./auth-middleware-Bg4VzwAa.js";
import { t as attachAuth } from "./auth-attacher-CfkwdFwb.js";
// src/lib/cdn.functions.ts
var purgeEdgeCdnServer = createServerFn({ method: "POST" }).middleware([attachAuth, requireAdmin]).validator((opts) => opts).handler(createSsrRpc("509b385316e86899d89a791a829c18940efbe7f30a57fc190b3d7737b627a870"));
export { purgeEdgeCdnServer as t };

//# sourceMappingURL=cdn.functions-hbe12tQA.js.map