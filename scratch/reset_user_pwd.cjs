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

    const newPassword = "Demo@User#2026";
    const newHash = hashPassword(newPassword);

    console.log("Resetting reader14_994@demo.com password hash to match:", newPassword);
    const [result] = await conn.query("UPDATE users SET password_hash = ? WHERE email = 'reader14_994@demo.com'", [newHash]);
    console.log("Reset result:", result);

    await conn.end();
  } catch (err) {
    console.error('Error:', err);
  }
}

run();
