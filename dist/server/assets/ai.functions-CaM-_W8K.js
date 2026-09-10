import { i as createServerFn } from "./esm-Dova13aH.js";
import { P as createSsrRpc } from "./site-content-CsN6nWHI.js";
import { t as requireAuth } from "./auth-middleware-Dn9IHvGB.js";
//#region src/lib/ai.functions.ts
var generateSectionHtmlServer = createServerFn({ method: "POST" }).middleware([requireAuth]).validator((d) => d).handler(createSsrRpc("6060beafa123a3a81700b8cc4762dc17289432a963ce287cdd68e0b4630d7931"));
var generateArticleContentServer = createServerFn({ method: "POST" }).middleware([requireAuth]).validator((d) => d).handler(createSsrRpc("30e470d9ce75c446d32d1443078c1a42c7b9fcddbe926b6e51d4512c60207ae8"));
//#endregion
export { generateSectionHtmlServer as n, generateArticleContentServer as t };
