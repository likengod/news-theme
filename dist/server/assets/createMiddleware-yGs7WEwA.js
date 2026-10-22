// node_modules/@tanstack/start-client-core/dist/esm/createMiddleware.js
var createMiddleware = (options, __opts) => {
	const resolvedOptions = {
		type: "request",
		...__opts || options
	};
	return {
		options: resolvedOptions,
		middleware: (middleware) => {
			return createMiddleware({}, Object.assign(resolvedOptions, { middleware }));
		},
		validator: (validator) => {
			return createMiddleware({}, Object.assign(resolvedOptions, { validator }));
		},
		client: (client) => {
			return createMiddleware({}, Object.assign(resolvedOptions, { client }));
		},
		server: (server) => {
			return createMiddleware({}, Object.assign(resolvedOptions, { server }));
		}
	};
};
export { createMiddleware as t };

//# sourceMappingURL=createMiddleware-yGs7WEwA.js.map