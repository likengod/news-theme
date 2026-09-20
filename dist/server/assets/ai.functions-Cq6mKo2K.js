import { r as createServerFn } from "./esm-B50dUWcE.js";
import { t as createSsrRpc } from "./createSsrRpc-BP1dEv6O.js";
import { t as requireAdmin } from "./auth-middleware-BNC9rUei.js";
//#region src/lib/ai.functions.ts
var generateSectionHtmlServer = createServerFn({ method: "POST" }).middleware([requireAdmin]).validator((d) => d).handler(createSsrRpc("6060beafa123a3a81700b8cc4762dc17289432a963ce287cdd68e0b4630d7931"));
var generateArticleContentServer = createServerFn({ method: "POST" }).middleware([requireAdmin]).validator((d) => d).handler(createSsrRpc("30e470d9ce75c446d32d1443078c1a42c7b9fcddbe926b6e51d4512c60207ae8"));
var generatePageSeoServer = createServerFn({ method: "POST" }).middleware([requireAdmin]).validator((d) => d).handler(createSsrRpc("3cfc9da0c530c5885b434a93a6cfd05899b6dc10d8625ddd679755011d2eaf88"));
var generateCategoryDescriptionServer = createServerFn({ method: "POST" }).middleware([requireAdmin]).validator((d) => d).handler(createSsrRpc("d40db31842ef69c32ee11b885c847a349426926025e989432dc9f235693a7f8f"));
//#endregion
export { generateSectionHtmlServer as i, generateCategoryDescriptionServer as n, generatePageSeoServer as r, generateArticleContentServer as t };

//# sourceMappingURL=ai.functions-Cq6mKo2K.js.map