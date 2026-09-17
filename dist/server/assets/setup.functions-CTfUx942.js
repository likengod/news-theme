import { r as createServerFn } from "./esm-B50dUWcE.js";
import { a as initializeDatabase, i as hashPassword, l as testDbConnection, n as closePool, o as loadDbConfig, r as getPool } from "./db.server-BkLt9eJ8.js";
import { t as createServerRpc } from "./createServerRpc-BbGffMfs.js";
import crypto from "crypto";
import path from "path";
import fs from "fs/promises";
//#region src/lib/setup.functions.ts?tss-serverfn-split
var isSetupCompleteCached = false;
var checkSetupStatus_createServerFn_handler = createServerRpc({
	id: "54425a5416a220839e30a32e3d0173b5b44626cb9bacd7b67d8e4fe08ad48a44",
	name: "checkSetupStatus",
	filename: "src/lib/setup.functions.ts"
}, (opts) => checkSetupStatus.__executeServer(opts));
var checkSetupStatus = createServerFn({ method: "GET" }).handler(checkSetupStatus_createServerFn_handler, async () => {
	if (isSetupCompleteCached) return { required: false };
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
		isSetupCompleteCached = true;
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
		isSetupCompleteCached = false;
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
		try {
			const { execSync } = await import("child_process");
			const root = path.resolve(process.cwd());
			const authUrl = process.env.GIT_AUTH_URL || "https://github.com/likengod/news-theme.git";
			try {
				execSync("git config --global --add safe.directory *", {
					cwd: root,
					stdio: "ignore"
				});
			} catch {}
			try {
				execSync(`git remote set-url origin ${authUrl}`, {
					cwd: root,
					stdio: "ignore"
				});
			} catch {
				try {
					execSync(`git remote add origin ${authUrl}`, {
						cwd: root,
						stdio: "ignore"
					});
				} catch {}
			}
			try {
				execSync("git fetch origin main --tags", {
					cwd: root,
					timeout: 2e4,
					stdio: "ignore"
				});
			} catch {}
		} catch (gitErr) {
			console.warn("[Setup Execution] Auto-link git warning:", gitErr);
		}
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

//# sourceMappingURL=setup.functions-CTfUx942.js.map