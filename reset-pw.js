import mysql from "mysql2/promise";
import fs from "fs";
import crypto from "crypto";
const config = JSON.parse(fs.readFileSync("db-config.json"));
mysql.createConnection(config).then(async (c) => {
  const salt = "northeast_timeline_salt_2026";
  const hash = crypto.pbkdf2Sync("admin123", salt, 100000, 64, "sha512").toString("hex");
  await c.execute("UPDATE users SET password_hash = ?, salt = ? WHERE email = ?", [
    hash,
    salt,
    "admin@todaytripura.com",
  ]);
  console.log("Password reset to admin123");
  c.end();
});
