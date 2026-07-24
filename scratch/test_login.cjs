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

    const email = "reader14_994@demo.com";
    const password = "Demo@User#2026";

    const [users] = await conn.query(
      `SELECT u.* FROM users u
       LEFT JOIN profiles p ON u.id = p.id
       WHERE u.email = ? OR u.display_name = ? OR p.phone = ?`,
      [email, email, email]
    );
    if (users.length === 0) {
      console.error("Login test failed: user not found");
      await conn.end();
      return;
    }

    const user = users[0];
    const passHash = hashPassword(password);
    if (user.password_hash !== passHash) {
      console.error("Login test failed: password hash mismatch");
    } else {
      console.log("Login test succeeded! Password hash matches correctly.");
    }

    await conn.end();
  } catch (err) {
    console.error('Error:', err);
  }
}

run();
