import { t as getRequest } from "./request-response-BEPp1C2k.js";
import { r as createMiddleware } from "./createStart-DwZhSttb.js";
import { s as query } from "./db.server-BkLt9eJ8.js";
//#region src/lib/auth-middleware.ts
/**
* Pure MySQL Session Authentication Middleware
* Validates session token in MySQL database.
*/
var requireAuth = createMiddleware({ type: "function" }).server(async ({ next }) => {
	const request = getRequest();
	if (!request?.headers) throw new Error("Unauthorized: No request headers available");
	let token = "";
	const authHeader = request.headers.get("authorization");
	if (authHeader && authHeader.startsWith("Bearer ")) token = authHeader.replace("Bearer ", "").trim();
	else {
		const match = (request.headers.get("cookie") || "").match(/(?:^|;\s*)(?:nt_session|session_token|access_token)=([^;]+)/);
		if (match) token = decodeURIComponent(match[1]);
	}
	if (!token) throw new Error("Unauthorized: Bearer token or active session required");
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
/**
* Administrator & Editor Role Verification Middleware
* Strictly verifies the user has a valid active session AND is an admin or editor.
*/
var requireAdmin = createMiddleware({ type: "function" }).server(async ({ next }) => {
	const request = getRequest();
	if (!request?.headers) throw new Error("Unauthorized: No request headers available");
	let token = "";
	const authHeader = request.headers.get("authorization");
	if (authHeader && authHeader.startsWith("Bearer ")) token = authHeader.replace("Bearer ", "").trim();
	else {
		const match = (request.headers.get("cookie") || "").match(/(?:^|;\s*)(?:nt_session|session_token|access_token)=([^;]+)/);
		if (match) token = decodeURIComponent(match[1]);
	}
	if (!token) throw new Error("Unauthorized: Bearer token or active admin session required");
	const sessions = await query(`SELECT s.*, u.email FROM sessions s
       JOIN users u ON s.user_id = u.id
       WHERE s.id = ? AND s.expires_at > NOW()`, [token]);
	if (sessions.length === 0) throw new Error("Unauthorized: Invalid token or session expired");
	const session = sessions[0];
	const rolesRows = await query(`SELECT role FROM user_roles WHERE user_id = ? AND role IN ('admin', 'editor')`, [session.user_id]);
	if (rolesRows.length === 0) throw new Error("Forbidden: Administrator privileges required");
	const roles = rolesRows.map((r) => r.role);
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
export { requireAuth as n, requireAdmin as t };

//# sourceMappingURL=auth-middleware-BNC9rUei.js.map