import { t as renderErrorPage } from "../server.js";
import { n as createCsrfMiddleware, r as createMiddleware, t as createStart } from "./createStart-DwZhSttb.js";
import { t as attachAuth } from "./auth-attacher-BdoDOpyC.js";
import { isNotFound, isRedirect } from "@tanstack/react-router";
//#region src/start.ts
var csrfMiddleware = createCsrfMiddleware({ filter: (ctx) => ctx.handlerType === "serverFn" });
var errorMiddleware = createMiddleware().server(async ({ next }) => {
	try {
		return await next();
	} catch (error) {
		if (isRedirect(error) || isNotFound(error) || error instanceof Response || error != null && typeof error === "object" && ("statusCode" in error || "status" in error || "isRedirect" in error || "isNotFound" in error || "headers" in error)) throw error;
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

//# sourceMappingURL=start-BBh8QHW8.js.map