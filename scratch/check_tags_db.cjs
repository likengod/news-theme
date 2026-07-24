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

    console.log('--- Checking Tags in DB ---');
    const [tags] = await conn.query("SELECT * FROM tags");
    console.log('Tags in DB count:', tags.length);
    console.log('Tags:', tags);

    await conn.end();
  } catch (err) {
    console.error('Error running script:', err);
  }
}

run();
