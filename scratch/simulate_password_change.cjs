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

    const adminId = '76a3b521-089b-4afe-9e57-4aafdd40d610';
    const targetUserId = '14268221-c9e8-4d4c-9d6d-27e48d9e6477';

    // Check if admin
    const [roles] = await conn.query("SELECT role FROM user_roles WHERE user_id = ? AND role = 'admin'", [adminId]);
    console.log("Admin roles:", roles);

    // Simulate updateAdminUserPassword
    console.log("Simulating password change for other user...");
    const passHash = hashPassword("TestNewPassword2026!!");
    await conn.query("UPDATE users SET password_hash = ? WHERE id = ?", [passHash, targetUserId]);
    await conn.query("DELETE FROM sessions WHERE user_id = ?", [targetUserId]);
    console.log("Simulated successfully without errors!");

    await conn.end();
  } catch (err) {
    console.error('Simulation failed:', err);
  }
}

run();
