import { i as createServerFn } from "./server-B4dRwfgz.js";
import { t as createSsrRpc } from "./createSsrRpc-DUcOL13R.js";
import { t as requireAdmin } from "./auth-middleware-bJcQkTO1.js";
import { t as attachAuth } from "./auth-attacher-BdfrkW5y.js";
// src/lib/cdn.functions.ts
var purgeEdgeCdnServer = createServerFn({ method: "POST" }).middleware([attachAuth, requireAdmin]).validator((opts) => opts).handler(createSsrRpc("509b385316e86899d89a791a829c18940efbe7f30a57fc190b3d7737b627a870"));
export { purgeEdgeCdnServer as t };

//# sourceMappingURL=cdn.functions-D3d5rTrb.js.map