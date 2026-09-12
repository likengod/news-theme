import { t as renderErrorPage } from "../server.js";
import { n as createMiddleware, t as createStart } from "./createStart-Dt05N14y.js";
//#region src/lib/auth-attacher.ts
var SESSION_KEY = "nt:mysql_session:v1";
/**
* Middleware that attaches the MySQL session token to outgoing server function requests.
*/
var attachAuth = createMiddleware({ type: "function" }).client(async ({ next }) => {
	if (typeof window !== "undefined") try {
		const raw = localStorage.getItem(SESSION_KEY);
		if (raw) {
			const session = JSON.parse(raw);
			if (session?.access_token) return next({ headers: { Authorization: `Bearer ${session.access_token}` } });
		}
	} catch {}
	return next();
});
//#endregion
//#region src/start.ts
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
	requestMiddleware: [errorMiddleware]
}));
//#endregion
export { startInstance };

//# sourceMappingURL=start-BE5wJmrL.js.map