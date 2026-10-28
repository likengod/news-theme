import { r as createServerFn } from "./server-DHuKcb3n.js";
import { t as createSsrRpc } from "./createSsrRpc-CESEXPMz.js";
import { t as requireAdmin } from "./auth-middleware-DG5HNdqN.js";
import { t as attachAuth } from "./auth-attacher-CDNgXTi6.js";
// src/lib/cdn.functions.ts
var purgeEdgeCdnServer = createServerFn({ method: "POST" }).middleware([attachAuth, requireAdmin]).validator((opts) => opts).handler(createSsrRpc("509b385316e86899d89a791a829c18940efbe7f30a57fc190b3d7737b627a870"));
export { purgeEdgeCdnServer as t };

//# sourceMappingURL=cdn.functions-DEimgcGh.js.map