import { i as createServerFn } from "./server-C-UuNAdL.js";
import { t as createSsrRpc } from "./createSsrRpc-CDgaRa8S.js";
import { t as requireAdmin } from "./auth-middleware-DdeX5FM8.js";
import { t as attachAuth } from "./auth-attacher-CD-aJRDM.js";
// src/lib/cdn.functions.ts
var purgeEdgeCdnServer = createServerFn({ method: "POST" }).middleware([attachAuth, requireAdmin]).validator((opts) => opts).handler(createSsrRpc("509b385316e86899d89a791a829c18940efbe7f30a57fc190b3d7737b627a870"));
export { purgeEdgeCdnServer as t };

//# sourceMappingURL=cdn.functions-8xE3p8lP.js.map