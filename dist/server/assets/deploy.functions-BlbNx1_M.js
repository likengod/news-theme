import { i as createServerFn } from "./esm-Dova13aH.js";
import { P as createSsrRpc } from "./site-content-CobLzJmw.js";
process.env.GIT_REMOTE_URL;
process.env.GIT_ACCESS_TOKEN;
process.env.GIT_BRANCH;
var getGitStatus = createServerFn({ method: "GET" }).handler(createSsrRpc("8a1c5ef143a372c0240b9c8c466dad42d616ff503a5362ba972f6f98c5b19b6e"));
var gitPull = createServerFn({ method: "POST" }).handler(createSsrRpc("ce1125864efa76115c34ea2a60564fcb9d798efd40778bdc464f77843b17ea5a"));
createServerFn({ method: "POST" }).handler(createSsrRpc("a747fffbbe483f1e7dd71777de6f5a0b47369156a453a555650c7cf2bb6719ef"));
var getDeployHistory = createServerFn({ method: "GET" }).handler(createSsrRpc("c45cee029994ab43bbe6ad2c83b81e99d5008c5b979f02b4994e34820d8fb69d"));
var getDeployLog = createServerFn({ method: "GET" }).validator((id) => id).handler(createSsrRpc("a5ad24c30f372a03151c7dc3f1f8332cdb02d7e67e7bc64a72c494b6ce88400e"));
createServerFn({ method: "POST" }).handler(createSsrRpc("069cbb24882dfa4dfd6a2737fc931ba8108762e6eece4c0c926b3aba2a060164"));
//#endregion
export { gitPull as i, getDeployLog as n, getGitStatus as r, getDeployHistory as t };

//# sourceMappingURL=deploy.functions-BlbNx1_M.js.map