import mysql from "mysql2/promise";
import crypto from "crypto";
import fs from "fs";
import path from "path";

// Hash password with native crypto pbkdf2
export function hashPassword(password: string, salt?: string): string {
  const activeSalt = salt || "northeast_timeline_salt_2026";
  const iterations = salt ? 100000 : 1000;
  return crypto.pbkdf2Sync(password, activeSalt, iterations, 64, "sha512").toString("hex");
}

let pool: mysql.Pool | null = null;
let configLoaded = false;
let dbConfig: any = null;

export function loadDbConfig(forceReload = false) {
  if (!forceReload && configLoaded && dbConfig !== null) {
    return dbConfig;
  }
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

declare global {
  var __mysqlPool: mysql.Pool | undefined;
}

export function getPool() {
  if (globalThis.__mysqlPool) return globalThis.__mysqlPool;
  if (pool) return pool;

  const config = loadDbConfig();
  const host = config?.host || process.env.MYSQL_HOST || "127.0.0.1";
  const port = Number(config?.port || process.env.MYSQL_PORT) || 3306;
  const user = config?.user || process.env.MYSQL_USER || "root";
  const password =
    config?.password !== undefined ? config.password : process.env.MYSQL_PASSWORD || "";
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
    idleTimeout: 60000,
    connectTimeout: 5000,
    enableKeepAlive: true,
    queueLimit: 0,
  });
  globalThis.__mysqlPool = pool;
  return pool;
}

export async function closePool() {
  if (globalThis.__mysqlPool) {
    try {
      await globalThis.__mysqlPool.end();
    } catch {}
    globalThis.__mysqlPool = undefined;
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

export async function query(sql: string, params: any[] = []): Promise<any> {
  const config = loadDbConfig();
  if (!config) {
    return [];
  }
  const p = getPool();
  const [results] = await p.query(sql, params);
  return results;
}

export async function safeCreateIndex(tableName: string, indexName: string, columnsSql: string) {
  try {
    const existing = await query(`SHOW INDEX FROM \`${tableName}\` WHERE Key_name = ?`, [
      indexName,
    ]);
    if (existing.length === 0) {
      await query(`CREATE INDEX \`${indexName}\` ON \`${tableName}\`(${columnsSql})`);
    }
  } catch (err: any) {
    // Table or database initialization note
  }
}

// Test connection and auto-create database if missing
export async function testDbConnection(config: any): Promise<boolean> {
  let tempConn;
  try {
    // 1. Connect with connectTimeout
    tempConn = await mysql.createConnection({
      host: config.host || "127.0.0.1",
      port: Number(config.port) || 3306,
      user: config.user || "root",
      password: config.password !== undefined ? config.password : "",
      connectTimeout: 4000,
    });

    // 2. Try creating database if allowed, or ignore if already created by hosting panel
    const dbName = config.database || "today_tripura";
    try {
      await tempConn.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``);
    } catch (createErr: any) {
      console.warn("[MySQL] CREATE DATABASE notice:", createErr?.message);
    }

    // 3. Select database to verify access
    await tempConn.query(`USE \`${dbName}\``);
    return true;
  } catch (err: any) {
    console.error("[MySQL] Test connection / DB verification failed:", err.message);
    throw new Error(err.message || "Failed to connect to MySQL server");
  } finally {
    if (tempConn) {
      await tempConn.end();
    }
  }
}

let isInitialized = false;

// Automatically create tables & seed them if needed
export async function initializeDatabase(customAdmin?: {
  email: string;
  passwordHash: string;
  salt: string;
  displayName: string;
}) {
  // If already initialized in this process and no custom admin requested, skip immediately (0ms)
  if (isInitialized && !customAdmin) return;

  const config = loadDbConfig();
  if (!config && !process.env.MYSQL_HOST) {
    console.log("[MySQL] Database is not configured yet. Setup Wizard is required.");
    return;
  }

  // Fast-bypass check: If core tables already exist, skip running 35+ DDL and seed queries!
  try {
    const existing = await query("SELECT 1 FROM articles LIMIT 1");
    if (existing && !customAdmin) {
      isInitialized = true;
      return;
    }
  } catch {
    // Table doesn't exist yet, proceed to initial setup
  }

  try {
    console.log("[MySQL] Starting database initialization...");
    // Lazy-load heavy schema & seed modules only when needed
    const { createTablesAndIndexes } = await import("./db/schema.server");
    const { seedDefaultData } = await import("./db/seed.server");

    await createTablesAndIndexes(query);
    await seedDefaultData(query, customAdmin);

    isInitialized = true;
    console.log("[MySQL] Database initialization completed successfully!");
  } catch (err: any) {
    console.error("[MySQL] Failed to initialize database:", err.message);
    throw err;
  }
}

let lastSessionCleanup = 0;

// Low-overhead background cleanup for stale/expired sessions
export async function cleanupExpiredSessions(force = false) {
  const now = Date.now();
  // Throttle to run at most once every hour unless forced
  if (!force && now - lastSessionCleanup < 60 * 60 * 1000) return;
  lastSessionCleanup = now;

  try {
    const res = await query("DELETE FROM sessions WHERE expires_at < NOW()");
    if (res?.affectedRows > 0) {
      console.log(`[MySQL] Pruned ${res.affectedRows} expired session(s) from database.`);
    }
  } catch (err: any) {
    console.warn("[MySQL] Session cleanup notice:", err?.message || err);
  }
}

// Call init automatically on startup only if db-config exists
if (loadDbConfig()) {
  initializeDatabase()
    .then(() => cleanupExpiredSessions())
    .catch((err) => {
      console.log("[MySQL] Auto-initialization note:", err.message);
    });
}
