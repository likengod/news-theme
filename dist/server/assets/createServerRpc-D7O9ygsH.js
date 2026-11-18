import { a as TSS_SERVER_FUNCTION } from "./server-BOyiW-Kz.js";
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

//# sourceMappingURL=createServerRpc-D7O9ygsH.js.map