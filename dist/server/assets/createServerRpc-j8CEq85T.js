import { a as TSS_SERVER_FUNCTION } from "./server-rotgP4LI.js";
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

//# sourceMappingURL=createServerRpc-j8CEq85T.js.map