import { t as getRequest } from "./request-response-BEPp1C2k.js";
import { n as createMiddleware } from "./createStart-Dt05N14y.js";
import { o as query } from "./db.server-Chz3iTW3.js";
//#region src/lib/auth-middleware.ts
/**
* Pure MySQL Session Authentication Middleware
* Validates session token in MySQL database.
*/
var requireAuth = createMiddleware({ type: "function" }).server(async ({ next }) => {
	const request = getRequest();
	if (!request?.headers) throw new Error("Unauthorized: No request headers available");
	const authHeader = request.headers.get("authorization");
	if (!authHeader) throw new Error("Unauthorized: No authorization header provided");
	if (!authHeader.startsWith("Bearer ")) throw new Error("Unauthorized: Only Bearer tokens are supported");
	const token = authHeader.replace("Bearer ", "");
	if (!token) throw new Error("Unauthorized: No token provided");
	const sessions = await query(`SELECT s.*, u.email FROM sessions s
       JOIN users u ON s.user_id = u.id
       WHERE s.id = ? AND s.expires_at > NOW()`, [token]);
	if (sessions.length === 0) throw new Error("Unauthorized: Invalid token or session expired");
	const session = sessions[0];
	const roles = (await query("SELECT role FROM user_roles WHERE user_id = ?", [session.user_id])).map((r) => r.role);
	return next({ context: {
		userId: session.user_id,
		claims: {
			sub: session.user_id,
			email: session.email,
			roles
		}
	} });
});
//#endregion
export { requireAuth as t };

//# sourceMappingURL=auth-middleware-Dn9IHvGB.js.map