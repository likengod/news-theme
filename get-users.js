import mysql from "mysql2/promise";
import fs from "fs";
const config = JSON.parse(fs.readFileSync("db-config.json"));
mysql.createConnection(config).then(async (c) => {
  const [rows] = await c.execute(
    "SELECT u.email FROM users u JOIN user_roles r ON u.id = r.user_id WHERE r.role = 'admin' LIMIT 5",
  );
  console.log(rows);
  c.end();
});
