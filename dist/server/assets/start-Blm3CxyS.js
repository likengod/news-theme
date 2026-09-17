import { t as renderErrorPage } from "../server.js";
import { n as createCsrfMiddleware, r as createMiddleware, t as createStart } from "./createStart-DwZhSttb.js";
import { t as attachAuth } from "./auth-attacher-BdoDOpyC.js";
//#region src/start.ts
var csrfMiddleware = createCsrfMiddleware({ filter: (ctx) => ctx.handlerType === "serverFn" });
var errorMiddleware = createMiddleware().server(async ({ next }) => {
	try {
		return await next();
	} catch (error) {
		if (error != null && typeof error === "object" && "statusCode" in error) throw error;
		console.error(error);
		return new Response(renderErrorPage(), {
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

//# sourceMappingURL=start-Blm3CxyS.js.map