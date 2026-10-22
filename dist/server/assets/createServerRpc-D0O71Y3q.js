import { i as TSS_SERVER_FUNCTION } from "./server-B4raRXMB.js";
// node_modules/@tanstack/start-server-core/dist/esm/createServerRpc.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
export { createServerRpc as t };

//# sourceMappingURL=createServerRpc-D0O71Y3q.js.map