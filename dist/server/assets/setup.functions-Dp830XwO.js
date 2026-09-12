import { i as createServerFn } from "./esm-Dova13aH.js";
import { I as createSsrRpc } from "./site-content-CKhGm4KQ.js";
//#region src/lib/setup.functions.ts
var checkSetupStatus = createServerFn({ method: "GET" }).handler(createSsrRpc("54425a5416a220839e30a32e3d0173b5b44626cb9bacd7b67d8e4fe08ad48a44"));
var testDatabaseConnection = createServerFn({ method: "POST" }).validator((data) => data).handler(createSsrRpc("7bd773403e6cf1738bce63ecdf682bbfa435a41a857b4c398d398e6df9980a14"));
var executeSetup = createServerFn({ method: "POST" }).validator((data) => data).handler(createSsrRpc("424c41ecfd6de125add850459642fbb101dfbf9443245c9923f618fb115e3edc"));
//#endregion
export { executeSetup as n, testDatabaseConnection as r, checkSetupStatus as t };

//# sourceMappingURL=setup.functions-Dp830XwO.js.map