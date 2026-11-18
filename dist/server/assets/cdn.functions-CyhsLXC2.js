import { i as createServerFn } from "./server-DaD4Wmrq.js";
import { t as createSsrRpc } from "./createSsrRpc-CKyQ-NSL.js";
import { t as requireAdmin } from "./auth-middleware-C0H59Tgi.js";
import { t as attachAuth } from "./auth-attacher-iin8LQEH.js";
// src/lib/cdn.functions.ts
var purgeEdgeCdnServer = createServerFn({ method: "POST" }).middleware([attachAuth, requireAdmin]).validator((opts) => opts).handler(createSsrRpc("509b385316e86899d89a791a829c18940efbe7f30a57fc190b3d7737b627a870"));
export { purgeEdgeCdnServer as t };

//# sourceMappingURL=cdn.functions-CyhsLXC2.js.map