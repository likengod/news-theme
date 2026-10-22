import { a as getServerFnById, i as TSS_SERVER_FUNCTION } from "./server-pJ7JCfY5.js";
// node_modules/@tanstack/start-server-core/dist/esm/createSsrRpc.js
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
export { createSsrRpc as t };

//# sourceMappingURL=createSsrRpc-Ew-ax4Mr.js.map