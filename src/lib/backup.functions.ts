import { createServerFn } from "@tanstack/react-start";
import { getPool } from "./db.server";
import { requireAdmin } from "./auth-middleware";
import { attachAuth } from "./auth-attacher";
import { APP_VERSION } from "./version";

export const generateBackupServer = createServerFn({ method: "POST" })
  .middleware([attachAuth, requireAdmin])
  .handler(async () => {
    const pool = getPool();
    const conn = await pool.getConnection();
    try {
      const [tables] = (await conn.query("SHOW TABLES")) as any;
      const backupData: Record<string, any> = {};
      let totalRows = 0;

      for (const row of tables) {
        const tableName = Object.values(row)[0] as string;
        const [tableData] = (await conn.query(`SELECT * FROM \`${tableName}\``)) as any;
        backupData[tableName] = tableData;
        totalRows += Array.isArray(tableData) ? tableData.length : 0;
      }

      // Collect upload files from disk
      const fs = await import("node:fs");
      const path = await import("node:path");
      const cwd = process.cwd();
      const uploadDirs = [
        path.join(cwd, "uploads"),
        path.join(cwd, "public", "uploads"),
      ];

      const files: Array<{ relativePath: string; base64: string; size: number }> = [];
      const visited = new Set<string>();

      function scanDir(dir: string, baseDir: string) {
        if (!fs.existsSync(dir)) return;
        const entries = fs.readdirSync(dir, { withFileTypes: true });
        for (const entry of entries) {
          const fullPath = path.join(dir, entry.name);
          if (entry.isDirectory()) {
            scanDir(fullPath, baseDir);
          } else if (entry.isFile()) {
            if (entry.name === ".gitkeep") continue;
            const rel = path.relative(baseDir, fullPath).replace(/\\/g, "/");
            if (!visited.has(rel)) {
              visited.add(rel);
              try {
                const buf = fs.readFileSync(fullPath);
                files.push({
                  relativePath: rel,
                  base64: buf.toString("base64"),
                  size: buf.length,
                });
              } catch (e) {
                console.warn("Could not read upload file:", fullPath, e);
              }
            }
          }
        }
      }

      for (const uDir of uploadDirs) {
        scanDir(uDir, uDir);
      }

      return {
        timestamp: new Date().toISOString(),
        version: APP_VERSION,
        data: backupData,
        files,
        stats: {
          totalTables: Object.keys(backupData).length,
          totalRows,
          totalFiles: files.length,
        },
      };
    } finally {
      conn.release();
    }
  });

export const restoreBackupServer = createServerFn({ method: "POST" })
  .middleware([attachAuth, requireAdmin])
  .validator((d: any) => d)
  .handler(async ({ data }: { data: any }) => {
    const pool = getPool();
    const conn = await pool.getConnection();
    try {
      await conn.query("SET FOREIGN_KEY_CHECKS = 0");

      const dbData = data?.backup?.data || data?.data || {};
      const tablesInBackup = Object.keys(dbData);

      for (const tableName of tablesInBackup) {
        const rows = dbData[tableName] || [];
        if (!Array.isArray(rows)) continue;

        // Clean existing rows
        await conn.query(`TRUNCATE TABLE \`${tableName}\``);

        if (rows.length > 0) {
          const columns = Object.keys(rows[0]);
          const placeholders = columns.map(() => "?").join(", ");
          const sql = `INSERT INTO \`${tableName}\` (${columns.map((c) => `\`${c}\``).join(", ")}) VALUES (${placeholders})`;

          for (const row of rows) {
            const vals = columns.map((col) => {
              const val = row[col];
              if (val === undefined) return null;
              return val;
            });
            await conn.query(sql, vals);
          }
        }
      }

      // Restore physical files to uploads/ and public/uploads/ and dist/client/uploads/
      const files: Array<{ relativePath: string; base64: string }> = data?.files || [];
      if (files.length > 0) {
        const fs = await import("node:fs");
        const path = await import("node:path");
        const cwd = process.cwd();
        const targetDirs = [
          path.join(cwd, "uploads"),
          path.join(cwd, "public", "uploads"),
          path.join(cwd, "dist", "client", "uploads"),
        ];

        for (const file of files) {
          if (!file.relativePath || !file.base64) continue;
          const safeRel = file.relativePath.replace(/\.\./g, "").replace(/^\/+/, "");
          const buf = Buffer.from(file.base64, "base64");

          for (const targetDir of targetDirs) {
            const dest = path.join(targetDir, safeRel);
            const parent = path.dirname(dest);
            if (!fs.existsSync(parent)) {
              fs.mkdirSync(parent, { recursive: true });
            }
            fs.writeFileSync(dest, buf);
          }
        }
      }

      await conn.query("SET FOREIGN_KEY_CHECKS = 1");
      return {
        success: true,
        restoredTables: tablesInBackup.length,
        restoredFiles: files.length,
      };
    } catch (e: any) {
      await conn.query("SET FOREIGN_KEY_CHECKS = 1");
      throw new Error("Restore failed: " + (e?.message || String(e)));
    } finally {
      conn.release();
    }
  });

export const fetchCloudBackupServer = createServerFn({ method: "POST" })
  .middleware([attachAuth, requireAdmin])
  .validator((d: { url: string }) => d)
  .handler(async ({ data }: { data: { url: string } }) => {
    let targetUrl = (data?.url || "").trim();
    if (!targetUrl) {
      throw new Error("Please enter a valid cloud link or URL");
    }

    // Convert Google Drive view / share URLs to direct download
    // Examples:
    // https://drive.google.com/file/d/1XyZ.../view?usp=sharing
    // https://drive.google.com/open?id=1XyZ...
    const gdriveMatch = targetUrl.match(/(?:id=|\/d\/)([a-zA-Z0-9_-]+)/);
    if (gdriveMatch && (targetUrl.includes("drive.google.com") || targetUrl.includes("docs.google.com"))) {
      const fileId = gdriveMatch[1];
      targetUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;
    }

    const response = await fetch(targetUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
    });

    if (!response.ok) {
      throw new Error(
        `Failed to download from cloud link (HTTP ${response.status}: ${response.statusText}). If using Google Drive, make sure the file is shared with "Anyone with the link can view".`,
      );
    }

    const arrayBuffer = await response.arrayBuffer();
    const buf = Buffer.from(arrayBuffer);

    if (buf.length > 200 * 1024 * 1024) {
      throw new Error("Backup file exceeds 200MB limit");
    }

    return {
      success: true,
      size: buf.length,
      base64Zip: buf.toString("base64"),
    };
  });
