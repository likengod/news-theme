import { i as createServerFn } from "./server-D62cxwBV.js";
import { t as createSsrRpc } from "./createSsrRpc-Dlidjqs-.js";
import { t as requireAdmin } from "./auth-middleware-BBAaSqRQ.js";
import { t as attachAuth } from "./auth-attacher-sSmbm9jU.js";
// src/lib/cdn.functions.ts
var purgeEdgeCdnServer = createServerFn({ method: "POST" }).middleware([attachAuth, requireAdmin]).validator((opts) => opts).handler(createSsrRpc("509b385316e86899d89a791a829c18940efbe7f30a57fc190b3d7737b627a870"));
export { purgeEdgeCdnServer as t };

//# sourceMappingURL=cdn.functions-xivFBy1a.js.map