import { i as createServerFn } from "./server-DJvJUbMb.js";
import { t as createSsrRpc } from "./createSsrRpc-D_umZZwo.js";
import { t as requireAdmin } from "./auth-middleware-H0u-ne_b.js";
import { t as attachAuth } from "./auth-attacher-ygROKR15.js";
// src/lib/cdn.functions.ts
var purgeEdgeCdnServer = createServerFn({ method: "POST" }).middleware([attachAuth, requireAdmin]).validator((opts) => opts).handler(createSsrRpc("509b385316e86899d89a791a829c18940efbe7f30a57fc190b3d7737b627a870"));
export { purgeEdgeCdnServer as t };

//# sourceMappingURL=cdn.functions-BaiCUHfg.js.map