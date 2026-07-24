const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

function hashPassword(password) {
  const salt = "northeast_timeline_salt_2026";
  return crypto.pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex");
}

async function run() {
  try {
    const configPath = path.resolve('db-config.json');
    if (!fs.existsSync(configPath)) {
      console.log('db-config.json not found');
      return;
    }
    const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    const mysql = require('c:\\Users\\gorillatech\\Music\\TodayTripura\\node_modules\\mysql2\\promise');
    const conn = await mysql.createConnection({
      host: config.host,
      port: Number(config.port) || 3306,
      user: config.user,
      password: config.password,
      database: config.database
    });

    // 1. Get first user
    const [users] = await conn.query("SELECT id, email, password_hash FROM users LIMIT 1");
    if (users.length === 0) {
      console.log("No users found");
      await conn.end();
      return;
    }
    const user = users[0];
    console.log("Found user:", user.email, "ID:", user.id);

    // Test password change simulation
    const newPassword = "NewTestPassword2026!";
    const newHash = hashPassword(newPassword);

    console.log("Updating password to:", newPassword);
    const [result] = await conn.query("UPDATE users SET password_hash = ? WHERE id = ?", [newHash, user.id]);
    console.log("Update result:", result);

    // Read back
    const [updatedUsers] = await conn.query("SELECT password_hash FROM users WHERE id = ?", [user.id]);
    const updatedUser = updatedUsers[0];
    console.log("Updated hash matches expected:", updatedUser.password_hash === newHash);

    // Verify login simulation
    const verifyHash = hashPassword(newPassword);
    console.log("Login verification success:", updatedUser.password_hash === verifyHash);

    // Restore old hash
    await conn.query("UPDATE users SET password_hash = ? WHERE id = ?", [user.password_hash, user.id]);
    console.log("Restored old hash");

    await conn.end();
  } catch (err) {
    console.error('Error during test:', err);
  }
}

run();
