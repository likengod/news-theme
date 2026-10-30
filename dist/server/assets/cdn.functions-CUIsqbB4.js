import { i as createServerFn } from "./server-Jc36mRG6.js";
import { t as createSsrRpc } from "./createSsrRpc-D1khsbNX.js";
import { t as requireAdmin } from "./auth-middleware-WJq2sxZf.js";
import { t as attachAuth } from "./auth-attacher-DoCL6QNB.js";
// src/lib/cdn.functions.ts
var purgeEdgeCdnServer = createServerFn({ method: "POST" }).middleware([attachAuth, requireAdmin]).validator((opts) => opts).handler(createSsrRpc("509b385316e86899d89a791a829c18940efbe7f30a57fc190b3d7737b627a870"));
export { purgeEdgeCdnServer as t };

//# sourceMappingURL=cdn.functions-CUIsqbB4.js.map