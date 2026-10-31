import { i as createServerFn } from "./server-BGF9H4Ic.js";
import { t as createSsrRpc } from "./createSsrRpc-b_3ubwAQ.js";
import { t as requireAdmin } from "./auth-middleware-B8vE5R3V.js";
import { t as attachAuth } from "./auth-attacher-B9OEZQZ8.js";
// src/lib/cdn.functions.ts
var purgeEdgeCdnServer = createServerFn({ method: "POST" }).middleware([attachAuth, requireAdmin]).validator((opts) => opts).handler(createSsrRpc("509b385316e86899d89a791a829c18940efbe7f30a57fc190b3d7737b627a870"));
export { purgeEdgeCdnServer as t };

//# sourceMappingURL=cdn.functions-CMLOzw6F.js.map