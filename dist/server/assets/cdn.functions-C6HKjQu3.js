import { i as createServerFn } from "./server-Bw1ljS4D.js";
import { t as createSsrRpc } from "./createSsrRpc-D7LcFb2i.js";
import { t as requireAdmin } from "./auth-middleware-DCn412_Z.js";
import { t as attachAuth } from "./auth-attacher-BO8Afwex.js";
// src/lib/cdn.functions.ts
var purgeEdgeCdnServer = createServerFn({ method: "POST" }).middleware([attachAuth, requireAdmin]).validator((opts) => opts).handler(createSsrRpc("509b385316e86899d89a791a829c18940efbe7f30a57fc190b3d7737b627a870"));
export { purgeEdgeCdnServer as t };

//# sourceMappingURL=cdn.functions-C6HKjQu3.js.map