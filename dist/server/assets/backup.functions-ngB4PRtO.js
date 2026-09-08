import { i as createServerFn } from "./esm-Dova13aH.js";
import { n as getPool } from "./db.server-CLva-TlE.js";
import { t as requireAuth } from "./auth-middleware-DMbfTu4m.js";
import { t as createServerRpc } from "./createServerRpc-WJgk8O8C.js";
//#region src/lib/backup.functions.ts?tss-serverfn-split
var generateBackupServer_createServerFn_handler = createServerRpc({
	id: "04344fe1d3ab2fd1861f88f715beb7ef2db30b44e66ca36f7ba3e8404a815be0",
	name: "generateBackupServer",
	filename: "src/lib/backup.functions.ts"
}, (opts) => generateBackupServer.__executeServer(opts));
var generateBackupServer = createServerFn({ method: "GET" }).middleware([requireAuth]).handler(generateBackupServer_createServerFn_handler, async () => {
	const conn = await getPool().getConnection();
	try {
		const [tables] = await conn.query("SHOW TABLES");
		const backupData = {};
		for (const row of tables) {
			const tableName = Object.values(row)[0];
			const [tableData] = await conn.query(`SELECT * FROM ${tableName}`);
			backupData[tableName] = tableData;
		}
		return {
			timestamp: (/* @__PURE__ */ new Date()).toISOString(),
			version: "1.0",
			data: backupData
		};
	} finally {
		conn.release();
	}
});
var restoreBackupServer_createServerFn_handler = createServerRpc({
	id: "3a38e185b3779aeaabf8e39bee398139af011d9319629d9d39100c41c4bc0595",
	name: "restoreBackupServer",
	filename: "src/lib/backup.functions.ts"
}, (opts) => restoreBackupServer.__executeServer(opts));
var restoreBackupServer = createServerFn({ method: "POST" }).middleware([requireAuth]).validator((d) => d).handler(restoreBackupServer_createServerFn_handler, async ({ data }) => {
	const conn = await db();
	try {
		await conn.query("SET FOREIGN_KEY_CHECKS = 0");
		const tablesInBackup = Object.keys(data.backup.data);
		for (const tableName of tablesInBackup) {
			const rows = data.backup.data[tableName];
			await conn.query(`TRUNCATE TABLE ${tableName}`);
			if (rows.length > 0) {
				const columns = Object.keys(rows[0]);
				const values = rows.map((row) => columns.map((col) => row[col]));
				const sql = `INSERT INTO ${tableName} (${columns.join(", ")}) VALUES ?`;
				await conn.query(sql, [values]);
			}
		}
		await conn.query("SET FOREIGN_KEY_CHECKS = 1");
		return { success: true };
	} catch (e) {
		await conn.query("SET FOREIGN_KEY_CHECKS = 1");
		throw new Error("Restore failed: " + e.message);
	} finally {
		conn.release();
	}
});
//#endregion
export { generateBackupServer_createServerFn_handler, restoreBackupServer_createServerFn_handler };
