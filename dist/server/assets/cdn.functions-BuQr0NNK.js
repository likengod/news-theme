import { i as createServerFn } from "./server-BXSy1leT.js";
import { t as createSsrRpc } from "./createSsrRpc-Boymfnsd.js";
import { t as requireAdmin } from "./auth-middleware-Bd2mbrca.js";
import { t as attachAuth } from "./auth-attacher-CDnB-Nh0.js";
// src/lib/cdn.functions.ts
var purgeEdgeCdnServer = createServerFn({ method: "POST" }).middleware([attachAuth, requireAdmin]).validator((opts) => opts).handler(createSsrRpc("509b385316e86899d89a791a829c18940efbe7f30a57fc190b3d7737b627a870"));
export { purgeEdgeCdnServer as t };

//# sourceMappingURL=cdn.functions-BuQr0NNK.js.map