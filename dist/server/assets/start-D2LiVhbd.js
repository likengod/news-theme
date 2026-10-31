import { t as renderErrorPage } from "../server.js";
import { G as isNotFound, U as isRedirect, f as isPromise } from "./vendor-tanstack-router-Bd4EQ_Hv.js";
import { n as createCsrfMiddleware, r as createMiddleware } from "./server-BgZ4iWFx.js";
import { t as attachAuth } from "./auth-attacher-CiewOB_t.js";
// node_modules/@tanstack/start-client-core/dist/esm/createStart.js
function dedupeSerializationAdapters(deduped, serializationAdapters) {
	for (let i = 0, len = serializationAdapters.length; i < len; i++) {
		const current = serializationAdapters[i];
		if (!deduped.has(current)) {
			deduped.add(current);
			if (current.extends) dedupeSerializationAdapters(deduped, current.extends);
		}
	}
}
function dedupeOptions(options) {
	if (options.serializationAdapters) {
		const deduped = /* @__PURE__ */ new Set();
		dedupeSerializationAdapters(deduped, options.serializationAdapters);
		options.serializationAdapters = Array.from(deduped);
	}
	return options;
}
var createStart = (getOptions) => {
	return {
		getOptions: () => {
			const options = getOptions();
			return isPromise(options) ? Promise.resolve(options).then(dedupeOptions) : dedupeOptions(options);
		},
		createMiddleware
	};
};
// src/start.ts
var csrfMiddleware = createCsrfMiddleware({ filter: (ctx) => ctx.handlerType === "serverFn" });
var errorMiddleware = createMiddleware().server(async ({ next, ...rest }) => {
	try {
		return await next();
	} catch (error) {
		if (isRedirect(error) || isNotFound(error) || error instanceof Response || error != null && typeof error === "object" && ("statusCode" in error || "status" in error || "isRedirect" in error || "isNotFound" in error || "headers" in error)) throw error;
		const handlerType = rest?.handlerType;
		const request = rest?.request;
		const url = request?.url || "";
		if (handlerType === "serverFn" || url.includes("/_serverFn") || url.includes("_serverFn=") || request?.headers?.get("x-tss-server-function") != null) {
			console.error("[Start Error Middleware: serverFn error]", error);
			throw error;
		}
		console.error("[Start Error Middleware]", error);
		return new Response(renderErrorPage(error?.message), {
			status: 500,
			headers: { "content-type": "text/html; charset=utf-8" }
		});
	}
});
var startInstance = createStart(() => ({
	functionMiddleware: [attachAuth],
	requestMiddleware: [csrfMiddleware, errorMiddleware]
}));
export { startInstance };

//# sourceMappingURL=start-D2LiVhbd.js.map