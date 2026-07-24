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
    const mysql = require('c:\\Users\\gorillatech\\Music\\TodayTripura\\node_modules\\mysql2');
    const conn = await mysql.createConnection({
      host: config.host,
      port: Number(config.port) || 3306,
      user: config.user,
      password: config.password,
      database: config.database
    });

    console.log('--- Checking Categories in DB ---');
    const [categories] = await conn.query("SELECT * FROM categories");
    console.log('Categories:', categories.map(c => ({ id: c.id, name: c.name, slug: c.slug })));

    console.log('--- Checking Articles Distinct Categories ---');
    const [articles] = await conn.query("SELECT DISTINCT category FROM articles");
    console.log('Articles categories:', articles.map(a => a.category));

    console.log('--- Checking Total Articles Count ---');
    const [count] = await conn.query("SELECT COUNT(*) as total FROM articles");
    console.log('Total articles:', count[0].total);

    // Let's insert the missing 'Country' category if it doesn't exist!
    const countryCat = categories.find(c => c.slug === 'country' || c.name.toLowerCase() === 'country');
    if (!countryCat) {
      console.log('Category "Country" is missing! Inserting it...');
      await conn.query(
        "INSERT INTO categories (name, slug, description, meta_title, meta_description) VALUES (?, ?, ?, ?, ?)",
        [
          "Country",
          "country",
          "National news, political developments, and policy updates across the country.",
          "Country News & National Updates | Northeast Timeline",
          "Read latest national news coverage, country-wide political updates, and economic reports."
        ]
      );
      console.log('Inserted "Country" category successfully!');
    } else {
      console.log('Category "Country" already exists in DB!');
    }

    await conn.end();
  } catch (err) {
    console.error('Error running script:', err);
  }
}

run();
