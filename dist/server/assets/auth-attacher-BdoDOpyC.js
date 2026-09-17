import { r as createMiddleware } from "./createStart-DwZhSttb.js";
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
export { attachAuth as t };

//# sourceMappingURL=auth-attacher-BdoDOpyC.js.map