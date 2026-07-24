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

    const [users] = await conn.query("SELECT id, email, password_hash FROM users WHERE email = 'reader14_994@demo.com'");
    if (users.length === 0) {
      console.log("User reader14_994@demo.com not found!");
    } else {
      const user = users[0];
      console.log("User:", user);
      
      // Let's test checking some common passwords
      const passwords = [
        "reader14_994", 
        "Demo@Admin#2026NE", 
        "12345678", 
        "password",
        "newpassword",
        "NewTestPassword2026!",
        "TestNewPassword2026!!"
      ];
      for (const pw of passwords) {
        const hash = hashPassword(pw);
        if (user.password_hash === hash) {
          console.log(`Matched password: "${pw}"`);
        }
      }
    }

    await conn.end();
  } catch (err) {
    console.error('Error:', err);
  }
}

run();
