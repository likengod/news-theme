import fs from 'node:fs';
import mysql from 'mysql2/promise';

async function run() {
  const cfg = JSON.parse(fs.readFileSync('db-config.json', 'utf-8'));
  const conn = await mysql.createConnection({
    host: cfg.host,
    user: cfg.user,
    password: cfg.password,
    database: cfg.database,
    port: cfg.port || 3306,
  });
  const [cols] = await conn.query('SHOW COLUMNS FROM articles');
  console.log('Columns:', cols.map(c => c.Field));
  const [media] = await conn.query('SELECT id, name, url FROM media_library ORDER BY id DESC LIMIT 5');
  console.log('Media:', media);
  await conn.end();
}
run();
