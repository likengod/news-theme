import { i as createServerFn } from "./server-rotgP4LI.js";
import { i as getPool } from "./db.server-BJa33ORl.js";
import { t as requireAdmin } from "./auth-middleware-CsBFZhSC.js";
import { t as attachAuth } from "./auth-attacher-C0J7wcn4.js";
import { t as APP_VERSION } from "./version-C5ayC_A1.js";
import { t as createServerRpc } from "./createServerRpc-j8CEq85T.js";
// src/lib/backup.functions.ts?tss-serverfn-split
var generateBackupServer_createServerFn_handler = createServerRpc({
	id: "04344fe1d3ab2fd1861f88f715beb7ef2db30b44e66ca36f7ba3e8404a815be0",
	name: "generateBackupServer",
	filename: "src/lib/backup.functions.ts"
}, (opts) => generateBackupServer.__executeServer(opts));
var generateBackupServer = createServerFn({ method: "POST" }).middleware([attachAuth, requireAdmin]).handler(generateBackupServer_createServerFn_handler, async () => {
	const conn = await getPool().getConnection();
	try {
		const [tables] = await conn.query("SHOW TABLES");
		const backupData = {};
		let totalRows = 0;
		for (const row of tables) {
			const tableName = Object.values(row)[0];
			const [tableData] = await conn.query(`SELECT * FROM \`${tableName}\``);
			backupData[tableName] = tableData;
			totalRows += Array.isArray(tableData) ? tableData.length : 0;
		}
		const fs = await import("node:fs");
		const path = await import("node:path");
		const cwd = process.cwd();
		const uploadDirs = [path.join(cwd, "uploads"), path.join(cwd, "public", "uploads")];
		const files = [];
		const visited = /* @__PURE__ */ new Set();
		function scanDir(dir, baseDir) {
			if (!fs.existsSync(dir)) return;
			const entries = fs.readdirSync(dir, { withFileTypes: true });
			for (const entry of entries) {
				const fullPath = path.join(dir, entry.name);
				if (entry.isDirectory()) scanDir(fullPath, baseDir);
				else if (entry.isFile()) {
					if (entry.name === ".gitkeep") continue;
					const rel = path.relative(baseDir, fullPath).replace(/\\/g, "/");
					if (!visited.has(rel)) {
						visited.add(rel);
						try {
							const buf = fs.readFileSync(fullPath);
							files.push({
								relativePath: rel,
								base64: buf.toString("base64"),
								size: buf.length
							});
						} catch (e) {
							console.warn("Could not read upload file:", fullPath, e);
						}
					}
				}
			}
		}
		for (const uDir of uploadDirs) scanDir(uDir, uDir);
		return {
			timestamp: (/* @__PURE__ */ new Date()).toISOString(),
			version: APP_VERSION,
			data: backupData,
			files,
			stats: {
				totalTables: Object.keys(backupData).length,
				totalRows,
				totalFiles: files.length
			}
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
var restoreBackupServer = createServerFn({ method: "POST" }).middleware([attachAuth, requireAdmin]).validator((d) => d).handler(restoreBackupServer_createServerFn_handler, async ({ data }) => {
	const conn = await getPool().getConnection();
	try {
		await conn.query("SET FOREIGN_KEY_CHECKS = 0");
		const dbData = data?.backup?.data || data?.data || {};
		const tablesInBackup = Object.keys(dbData);
		for (const tableName of tablesInBackup) {
			const rows = dbData[tableName] || [];
			if (!Array.isArray(rows)) continue;
			await conn.query(`TRUNCATE TABLE \`${tableName}\``);
			if (rows.length > 0) {
				const columns = Object.keys(rows[0]);
				const placeholders = columns.map(() => "?").join(", ");
				const sql = `INSERT INTO \`${tableName}\` (${columns.map((c) => `\`${c}\``).join(", ")}) VALUES (${placeholders})`;
				for (const row of rows) {
					const vals = columns.map((col) => {
						const val = row[col];
						if (val === void 0) return null;
						return val;
					});
					await conn.query(sql, vals);
				}
			}
		}
		const files = data?.files || [];
		if (files.length > 0) {
			const fs = await import("node:fs");
			const path = await import("node:path");
			const cwd = process.cwd();
			const targetDirs = [
				path.join(cwd, "uploads"),
				path.join(cwd, "public", "uploads"),
				path.join(cwd, "dist", "client", "uploads")
			];
			for (const file of files) {
				if (!file.relativePath || !file.base64) continue;
				const safeRel = file.relativePath.replace(/\.\./g, "").replace(/^\/+/, "");
				const buf = Buffer.from(file.base64, "base64");
				for (const targetDir of targetDirs) {
					const dest = path.join(targetDir, safeRel);
					const parent = path.dirname(dest);
					if (!fs.existsSync(parent)) fs.mkdirSync(parent, { recursive: true });
					fs.writeFileSync(dest, buf);
				}
			}
		}
		await conn.query("SET FOREIGN_KEY_CHECKS = 1");
		return {
			success: true,
			restoredTables: tablesInBackup.length,
			restoredFiles: files.length
		};
	} catch (e) {
		await conn.query("SET FOREIGN_KEY_CHECKS = 1");
		throw new Error("Restore failed: " + (e?.message || String(e)));
	} finally {
		conn.release();
	}
});
var fetchCloudBackupServer_createServerFn_handler = createServerRpc({
	id: "89382b2939ddbd1aa77145d368669ee82e1eceec29261bf47fd3c8be059eb039",
	name: "fetchCloudBackupServer",
	filename: "src/lib/backup.functions.ts"
}, (opts) => fetchCloudBackupServer.__executeServer(opts));
var fetchCloudBackupServer = createServerFn({ method: "POST" }).middleware([attachAuth, requireAdmin]).validator((d) => d).handler(fetchCloudBackupServer_createServerFn_handler, async ({ data }) => {
	let targetUrl = (data?.url || "").trim();
	if (!targetUrl) throw new Error("Please enter a valid cloud link or URL");
	const gdriveMatch = targetUrl.match(/(?:id=|\/d\/)([a-zA-Z0-9_-]+)/);
	if (gdriveMatch && (targetUrl.includes("drive.google.com") || targetUrl.includes("docs.google.com"))) targetUrl = `https://drive.google.com/uc?export=download&id=${gdriveMatch[1]}`;
	const response = await fetch(targetUrl, { headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36" } });
	if (!response.ok) throw new Error(`Failed to download from cloud link (HTTP ${response.status}: ${response.statusText}). If using Google Drive, make sure the file is shared with "Anyone with the link can view".`);
	const arrayBuffer = await response.arrayBuffer();
	const buf = Buffer.from(arrayBuffer);
	if (buf.length > 209715200) throw new Error("Backup file exceeds 200MB limit");
	return {
		success: true,
		size: buf.length,
		base64Zip: buf.toString("base64")
	};
});
export { fetchCloudBackupServer_createServerFn_handler, generateBackupServer_createServerFn_handler, restoreBackupServer_createServerFn_handler };

//# sourceMappingURL=backup.functions-ws5LVhVL.js.map