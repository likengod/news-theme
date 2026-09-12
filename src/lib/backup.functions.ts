import { createServerFn } from "@tanstack/react-start";
import { getPool } from "./db.server";
import { requireAuth } from "./auth-middleware";

export const generateBackupServer = createServerFn({ method: "GET" })
  .middleware([requireAuth])
  .handler(async () => {
    const pool = getPool();
    const conn = await pool.getConnection();
    try {
      const [tables] = await conn.query("SHOW TABLES");
      const backupData = {};

      for (const row of tables) {
        const tableName = Object.values(row)[0];
        const [tableData] = await conn.query(`SELECT * FROM ${tableName}`);
        backupData[tableName] = tableData;
      }

      return {
        timestamp: new Date().toISOString(),
        version: "1.0",
        data: backupData,
      };
    } finally {
      conn.release();
    }
  });

export const restoreBackupServer = createServerFn({ method: "POST" })
  .middleware([requireAuth])
  .validator((d) => d)
  .handler(async ({ data }) => {
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
