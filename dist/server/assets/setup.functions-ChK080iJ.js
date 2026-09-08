import { i as createServerFn } from "./esm-Dova13aH.js";
import { a as loadDbConfig, i as initializeDatabase, n as getPool, r as hashPassword, s as testDbConnection, t as closePool } from "./db.server-CLva-TlE.js";
import { t as createServerRpc } from "./createServerRpc-WJgk8O8C.js";
import crypto from "crypto";
import path from "path";
import fs from "fs/promises";
//#region src/lib/setup.functions.ts?tss-serverfn-split
var checkSetupStatus_createServerFn_handler = createServerRpc({
	id: "54425a5416a220839e30a32e3d0173b5b44626cb9bacd7b67d8e4fe08ad48a44",
	name: "checkSetupStatus",
	filename: "src/lib/setup.functions.ts"
}, (opts) => checkSetupStatus.__executeServer(opts));
var checkSetupStatus = createServerFn({ method: "GET" }).handler(checkSetupStatus_createServerFn_handler, async () => {
	try {
		if (!loadDbConfig()) return { required: true };
		const pool = getPool();
		(await pool.getConnection()).release();
		const [rows] = await pool.query(`
        SELECT u.id 
        FROM users u 
        JOIN user_roles r ON u.id = r.user_id 
        WHERE r.role = 'admin' 
        LIMIT 1
      `);
		if (!rows || rows.length === 0) return { required: true };
		return { required: false };
	} catch (err) {
		console.log("[Setup Status] Connection check warning:", err?.message || err);
		return { required: true };
	}
});
var testDatabaseConnection_createServerFn_handler = createServerRpc({
	id: "7bd773403e6cf1738bce63ecdf682bbfa435a41a857b4c398d398e6df9980a14",
	name: "testDatabaseConnection",
	filename: "src/lib/setup.functions.ts"
}, (opts) => testDatabaseConnection.__executeServer(opts));
var testDatabaseConnection = createServerFn({ method: "POST" }).validator((data) => data).handler(testDatabaseConnection_createServerFn_handler, async ({ data }) => {
	try {
		await testDbConnection(data);
		return { success: true };
	} catch (err) {
		return {
			success: false,
			error: err.message || "Failed to connect to database"
		};
	}
});
var executeSetup_createServerFn_handler = createServerRpc({
	id: "424c41ecfd6de125add850459642fbb101dfbf9443245c9923f618fb115e3edc",
	name: "executeSetup",
	filename: "src/lib/setup.functions.ts"
}, (opts) => executeSetup.__executeServer(opts));
var executeSetup = createServerFn({ method: "POST" }).validator((data) => data).handler(executeSetup_createServerFn_handler, async ({ data }) => {
	try {
		const { dbConfig, adminConfig } = data;
		await testDbConnection(dbConfig);
		await closePool();
		const configPath = path.resolve(process.cwd(), "db-config.json");
		await fs.writeFile(configPath, JSON.stringify(dbConfig, null, 2), "utf-8");
		getPool();
		const adminSalt = crypto.randomBytes(16).toString("hex");
		const adminPassHash = hashPassword(adminConfig.password, adminSalt);
		await initializeDatabase({
			email: adminConfig.email,
			passwordHash: adminPassHash,
			salt: adminSalt,
			displayName: adminConfig.displayName
		});
		return { success: true };
	} catch (err) {
		console.error("[Setup Execution] Installation failed:", err);
		return {
			success: false,
			error: err.message || "Failed to complete setup"
		};
	}
});
//#endregion
export { checkSetupStatus_createServerFn_handler, executeSetup_createServerFn_handler, testDatabaseConnection_createServerFn_handler };
