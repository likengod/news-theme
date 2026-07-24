import { createServerFn } from "@tanstack/react-start";
import { 
  loadDbConfig, 
  getPool, 
  closePool, 
  testDbConnection, 
  initializeDatabase,
  hashPassword
} from "./db.server";
import fs from "fs/promises";
import path from "path";
import crypto from "crypto";

// 1. Check if setup wizard is required
export const checkSetupStatus = createServerFn({ method: "GET" })
  .handler(async (): Promise<{ required: boolean }> => {
    try {
      const config = loadDbConfig();
      if (!config) {
        return { required: true };
      }

      // Check if we can get a working connection
      const pool = getPool();
      const conn = await pool.getConnection();
      conn.release();

      // Check if at least one admin exists in the database
      const [rows]: any = await pool.query(`
        SELECT u.id 
        FROM users u 
        JOIN user_roles r ON u.id = r.user_id 
        WHERE r.role = 'admin' 
        LIMIT 1
      `);

      if (!rows || rows.length === 0) {
        return { required: true };
      }

      return { required: false };
    } catch (err: any) {
      console.log("[Setup Status] Connection check warning:", err?.message || err);
      const config = loadDbConfig();
      if (config) {
        // DB config already exists; do not send user to setup wizard on transient connection errors
        return { required: false };
      }
      return { required: true };
    }
  });

// 2. Test database credentials and auto-create DB if missing
export const testDatabaseConnection = createServerFn({ method: "POST" })
  .validator((data: any) => data)
  .handler(async ({ data }) => {
    try {
      await testDbConnection(data);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || "Failed to connect to database" };
    }
  });

// 3. Save database credentials and configure administrator account
export const executeSetup = createServerFn({ method: "POST" })
  .validator((data: any) => data)
  .handler(async ({ data }) => {
    try {
      const { dbConfig, adminConfig } = data;

      // 1. Create DB and test connection
      await testDbConnection(dbConfig);

      // 2. Close existing pool
      await closePool();

      // 3. Write db-config.json
      const configPath = path.resolve(process.cwd(), "db-config.json");
      await fs.writeFile(configPath, JSON.stringify(dbConfig, null, 2), "utf-8");

      // 4. Reset & get new pool
      getPool();

      // 5. Initialize tables and seed custom admin
      const adminSalt = crypto.randomBytes(16).toString("hex");
      const adminPassHash = hashPassword(adminConfig.password, adminSalt);
      await initializeDatabase({
        email: adminConfig.email,
        passwordHash: adminPassHash,
        salt: adminSalt,
        displayName: adminConfig.displayName,
      });

      return { success: true };
    } catch (err: any) {
      console.error("[Setup Execution] Installation failed:", err);
      return { success: false, error: err.message || "Failed to complete setup" };
    }
  });
