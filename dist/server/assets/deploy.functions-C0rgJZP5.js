import { r as createServerFn } from "./esm-B50dUWcE.js";
import { t as createServerRpc } from "./createServerRpc-BbGffMfs.js";
import { a as executeGitPullCore, i as executeGetGitStatusCore, n as executeGetDeployHistoryCore, o as executeInitializeGitRepoCore, r as executeGetDeployLogCore, t as executeBuildProjectCore } from "./deploy.server-xu27zk74.js";
//#region src/lib/deploy.functions.ts?tss-serverfn-split
var getGitStatus_createServerFn_handler = createServerRpc({
	id: "8a1c5ef143a372c0240b9c8c466dad42d616ff503a5362ba972f6f98c5b19b6e",
	name: "getGitStatus",
	filename: "src/lib/deploy.functions.ts"
}, (opts) => getGitStatus.__executeServer(opts));
var getGitStatus = createServerFn({ method: "GET" }).validator((d) => d).handler(getGitStatus_createServerFn_handler, async ({ data }) => {
	return await executeGetGitStatusCore(data?.forceRefresh);
});
var gitPull_createServerFn_handler = createServerRpc({
	id: "ce1125864efa76115c34ea2a60564fcb9d798efd40778bdc464f77843b17ea5a",
	name: "gitPull",
	filename: "src/lib/deploy.functions.ts"
}, (opts) => gitPull.__executeServer(opts));
var gitPull = createServerFn({ method: "POST" }).handler(gitPull_createServerFn_handler, async () => {
	return await executeGitPullCore();
});
var buildProject_createServerFn_handler = createServerRpc({
	id: "a747fffbbe483f1e7dd71777de6f5a0b47369156a453a555650c7cf2bb6719ef",
	name: "buildProject",
	filename: "src/lib/deploy.functions.ts"
}, (opts) => buildProject.__executeServer(opts));
var buildProject = createServerFn({ method: "POST" }).handler(buildProject_createServerFn_handler, async () => {
	return await executeBuildProjectCore();
});
var getDeployHistory_createServerFn_handler = createServerRpc({
	id: "c45cee029994ab43bbe6ad2c83b81e99d5008c5b979f02b4994e34820d8fb69d",
	name: "getDeployHistory",
	filename: "src/lib/deploy.functions.ts"
}, (opts) => getDeployHistory.__executeServer(opts));
var getDeployHistory = createServerFn({ method: "GET" }).handler(getDeployHistory_createServerFn_handler, async () => {
	return await executeGetDeployHistoryCore();
});
var getDeployLog_createServerFn_handler = createServerRpc({
	id: "a5ad24c30f372a03151c7dc3f1f8332cdb02d7e67e7bc64a72c494b6ce88400e",
	name: "getDeployLog",
	filename: "src/lib/deploy.functions.ts"
}, (opts) => getDeployLog.__executeServer(opts));
var getDeployLog = createServerFn({ method: "GET" }).validator((id) => id).handler(getDeployLog_createServerFn_handler, async ({ data: id }) => {
	return await executeGetDeployLogCore(id);
});
var initializeGitRepo_createServerFn_handler = createServerRpc({
	id: "069cbb24882dfa4dfd6a2737fc931ba8108762e6eece4c0c926b3aba2a060164",
	name: "initializeGitRepo",
	filename: "src/lib/deploy.functions.ts"
}, (opts) => initializeGitRepo.__executeServer(opts));
var initializeGitRepo = createServerFn({ method: "POST" }).handler(initializeGitRepo_createServerFn_handler, async () => {
	return await executeInitializeGitRepoCore();
});
//#endregion
export { buildProject_createServerFn_handler, getDeployHistory_createServerFn_handler, getDeployLog_createServerFn_handler, getGitStatus_createServerFn_handler, gitPull_createServerFn_handler, initializeGitRepo_createServerFn_handler };

//# sourceMappingURL=deploy.functions-C0rgJZP5.js.map