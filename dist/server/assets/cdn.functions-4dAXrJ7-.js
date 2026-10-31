import { i as createServerFn } from "./server-UNxmZouQ.js";
import { t as createSsrRpc } from "./createSsrRpc-6M6FtZD0.js";
import { t as requireAdmin } from "./auth-middleware-C5dgMJER.js";
import { t as attachAuth } from "./auth-attacher-CtggQuf-.js";
// src/lib/cdn.functions.ts
var purgeEdgeCdnServer = createServerFn({ method: "POST" }).middleware([attachAuth, requireAdmin]).validator((opts) => opts).handler(createSsrRpc("509b385316e86899d89a791a829c18940efbe7f30a57fc190b3d7737b627a870"));
export { purgeEdgeCdnServer as t };

//# sourceMappingURL=cdn.functions-4dAXrJ7-.js.map