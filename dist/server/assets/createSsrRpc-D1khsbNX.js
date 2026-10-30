import { a as TSS_SERVER_FUNCTION, o as getServerFnById } from "./server-Jc36mRG6.js";
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

//# sourceMappingURL=createSsrRpc-D1khsbNX.js.map