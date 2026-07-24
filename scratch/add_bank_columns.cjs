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

    console.log("Checking columns in profiles table...");
    const [columns] = await conn.query("SHOW COLUMNS FROM profiles");
    const columnNames = columns.map(c => c.Field);

    const colsToAdd = [
      { name: "bank_name", type: "VARCHAR(255) DEFAULT NULL" },
      { name: "bank_account_name", type: "VARCHAR(255) DEFAULT NULL" },
      { name: "bank_account_no", type: "VARCHAR(255) DEFAULT NULL" },
      { name: "bank_ifsc", type: "VARCHAR(255) DEFAULT NULL" },
      { name: "delete_requested", type: "BOOLEAN DEFAULT FALSE" }
    ];

    for (const col of colsToAdd) {
      if (!columnNames.includes(col.name)) {
        console.log(`Adding column ${col.name} to profiles...`);
        await conn.query(`ALTER TABLE profiles ADD COLUMN ${col.name} ${col.type}`);
        console.log(`Column ${col.name} added!`);
      } else {
        console.log(`Column ${col.name} already exists.`);
      }
    }

    await conn.end();
  } catch (err) {
    console.error('Error:', err);
  }
}

run();
