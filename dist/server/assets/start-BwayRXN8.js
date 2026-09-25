import { t as renderErrorPage } from "../server.js";
import { n as createCsrfMiddleware, r as createMiddleware, t as createStart } from "./createStart-DwZhSttb.js";
import { t as attachAuth } from "./auth-attacher-BdoDOpyC.js";
import { isNotFound, isRedirect } from "@tanstack/react-router";
//#region src/start.ts
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
//#endregion
export { startInstance };
