import mysql from "mysql2/promise";
import crypto from "crypto";
import fs from "fs";
import path from "path";
//#region src/lib/db.server.ts
function hashPassword(password, salt) {
	const activeSalt = salt || "northeast_timeline_salt_2026";
	const iterations = salt ? 1e5 : 1e3;
	return crypto.pbkdf2Sync(password, activeSalt, iterations, 64, "sha512").toString("hex");
}
var pool = null;
var configLoaded = false;
var dbConfig = null;
function loadDbConfig(forceReload = false) {
	if (!forceReload && configLoaded && dbConfig !== null) return dbConfig;
	try {
		const configPath = path.resolve(process.cwd(), "db-config.json");
		if (fs.existsSync(configPath)) {
			const data = fs.readFileSync(configPath, "utf-8");
			dbConfig = JSON.parse(data);
			configLoaded = true;
			return dbConfig;
		}
		dbConfig = null;
		configLoaded = true;
		return null;
	} catch (err) {
		console.error("[MySQL] Error reading db-config.json:", err);
		dbConfig = null;
		configLoaded = true;
		return null;
	}
}
function getPool() {
	if (globalThis.__mysqlPool) return globalThis.__mysqlPool;
	if (pool) return pool;
	const config = loadDbConfig();
	const host = config?.host || process.env.MYSQL_HOST || "127.0.0.1";
	const port = Number(config?.port || process.env.MYSQL_PORT) || 3306;
	const user = config?.user || process.env.MYSQL_USER || "root";
	const password = config?.password !== void 0 ? config.password : process.env.MYSQL_PASSWORD || "";
	const database = config?.database || process.env.MYSQL_DATABASE || "today_tripura";
	const connectionLimit = Number(process.env.MYSQL_CONNECTION_LIMIT) || 25;
	pool = mysql.createPool({
		host,
		port,
		user,
		password,
		database,
		waitForConnections: true,
		connectionLimit,
		maxIdle: 10,
		idleTimeout: 6e4,
		connectTimeout: 5e3,
		enableKeepAlive: true,
		queueLimit: 0
	});
	globalThis.__mysqlPool = pool;
	return pool;
}
async function closePool() {
	if (globalThis.__mysqlPool) {
		try {
			await globalThis.__mysqlPool.end();
		} catch {}
		globalThis.__mysqlPool = void 0;
	}
	if (pool) {
		try {
			await pool.end();
		} catch {}
		pool = null;
	}
	configLoaded = false;
	dbConfig = null;
}
async function query(sql, params = []) {
	if (!loadDbConfig()) return [];
	const [results] = await getPool().query(sql, params);
	return results;
}
async function safeCreateIndex(tableName, indexName, columnsSql) {
	try {
		if ((await query(`SHOW INDEX FROM \`${tableName}\` WHERE Key_name = ?`, [indexName])).length === 0) await query(`CREATE INDEX \`${indexName}\` ON \`${tableName}\`(${columnsSql})`);
	} catch (err) {}
}
async function testDbConnection(config) {
	let tempConn;
	try {
		tempConn = await mysql.createConnection({
			host: config.host || "127.0.0.1",
			port: Number(config.port) || 3306,
			user: config.user || "root",
			password: config.password !== void 0 ? config.password : "",
			connectTimeout: 4e3
		});
		const dbName = config.database || "today_tripura";
		try {
			await tempConn.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``);
		} catch (createErr) {
			console.warn("[MySQL] CREATE DATABASE notice:", createErr?.message);
		}
		await tempConn.query(`USE \`${dbName}\``);
		return true;
	} catch (err) {
		console.error("[MySQL] Test connection / DB verification failed:", err.message);
		throw new Error(err.message || "Failed to connect to MySQL server");
	} finally {
		if (tempConn) await tempConn.end();
	}
}
var isInitialized = false;
async function initializeDatabase(customAdmin) {
	if (isInitialized && !customAdmin) return;
	if (!loadDbConfig() && !process.env.MYSQL_HOST) {
		console.log("[MySQL] Database is not configured yet. Setup Wizard is required.");
		return;
	}
	try {
		if (await query("SELECT 1 FROM articles LIMIT 1") && !customAdmin) {
			isInitialized = true;
			return;
		}
	} catch {}
	try {
		console.log("[MySQL] Starting database initialization...");
		const { createTablesAndIndexes } = await import("./schema.server-8Pnhrka_.js");
		const { seedDefaultData } = await import("./seed.server-CXkqzl1z.js");
		await createTablesAndIndexes(query);
		await seedDefaultData(query, customAdmin);
		isInitialized = true;
		console.log("[MySQL] Database initialization completed successfully!");
	} catch (err) {
		console.error("[MySQL] Failed to initialize database:", err.message);
		throw err;
	}
}
var lastSessionCleanup = 0;
async function cleanupExpiredSessions(force = false) {
	const now = Date.now();
	if (!force && now - lastSessionCleanup < 3600 * 1e3) return;
	lastSessionCleanup = now;
	try {
		const res = await query("DELETE FROM sessions WHERE expires_at < NOW()");
		if (res?.affectedRows > 0) console.log(`[MySQL] Pruned ${res.affectedRows} expired session(s) from database.`);
	} catch (err) {
		console.warn("[MySQL] Session cleanup notice:", err?.message || err);
	}
}
if (loadDbConfig()) initializeDatabase().then(() => cleanupExpiredSessions()).catch((err) => {
	console.log("[MySQL] Auto-initialization note:", err.message);
});
//#endregion
export { initializeDatabase as a, safeCreateIndex as c, hashPassword as i, testDbConnection as l, closePool as n, loadDbConfig as o, getPool as r, query as s, cleanupExpiredSessions as t };
