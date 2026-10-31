import { i as createServerFn } from "./server-D0ckzJpq.js";
import { t as createSsrRpc } from "./createSsrRpc-BFdg_rbY.js";
import { t as requireAdmin } from "./auth-middleware-B5vRnsi_.js";
import { t as attachAuth } from "./auth-attacher-BY0jobDB.js";
// src/lib/cdn.functions.ts
var purgeEdgeCdnServer = createServerFn({ method: "POST" }).middleware([attachAuth, requireAdmin]).validator((opts) => opts).handler(createSsrRpc("509b385316e86899d89a791a829c18940efbe7f30a57fc190b3d7737b627a870"));
export { purgeEdgeCdnServer as t };

//# sourceMappingURL=cdn.functions-DIgOGHi7.js.map