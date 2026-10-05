import { t as getServerFnById } from "./__23tanstack-start-server-fn-resolver-DT1F-68X.js";
import { f as TSS_SERVER_FUNCTION } from "./esm-B50dUWcE.js";
//#region node_modules/@tanstack/start-server-core/dist/esm/createSsrRpc.js
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
//#endregion
export { createSsrRpc as t };

//# sourceMappingURL=createSsrRpc-W8bE_iSH.js.map