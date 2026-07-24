const fs = require('fs');
const path = require('path');

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

    const [sessions] = await conn.query(`
      SELECT s.*, u.email 
      FROM sessions s 
      JOIN users u ON s.user_id = u.id
    `);
    console.log("Current active sessions:", sessions);

    await conn.end();
  } catch (err) {
    console.error('Error:', err);
  }
}

run();
