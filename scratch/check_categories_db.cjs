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

    console.log('--- Checking Categories in DB ---');
    const [categories] = await conn.query("SELECT * FROM categories");
    console.log('Categories:', categories.map(c => ({ id: c.id, name: c.name, slug: c.slug })));

    console.log('--- Checking Articles Distinct Categories ---');
    const [articles] = await conn.query("SELECT DISTINCT category FROM articles");
    console.log('Articles categories:', articles.map(a => a.category));

    console.log('--- Checking Total Articles Count ---');
    const [count] = await conn.query("SELECT COUNT(*) as total FROM articles");
    console.log('Total articles:', count[0].total);

    // Insert missing otherCategories
    const targetCats = [
      { name: "Country", slug: "country", desc: "National news, political developments, and policy updates across the country." },
      { name: "Entertainment", slug: "entertainment", desc: "Latest entertainment updates, movie reviews, pop culture, and celebrity news." },
      { name: "Health", slug: "health", desc: "Wellness advice, medical research updates, healthcare policies, and fitness news." },
      { name: "Education", slug: "education", desc: "School board updates, academic achievements, policy discussions, and university news." },
      { name: "Jobs", slug: "jobs", desc: "Employment notifications, career opportunities, job alerts, and recruitment updates." },
      { name: "Travel", slug: "travel", desc: "Destination guides, travel itineraries, tourism updates, and exploration stories." },
      { name: "Lifestyle", slug: "lifestyle", desc: "Fashion trends, design, food culture, relations, and modern living updates." }
    ];

    for (const cat of targetCats) {
      const exists = categories.find(c => c.slug === cat.slug || c.name.toLowerCase() === cat.name.toLowerCase());
      if (!exists) {
        console.log(`Category "${cat.name}" is missing! Inserting...`);
        await conn.query(
          "INSERT INTO categories (name, slug, description, meta_title, meta_description) VALUES (?, ?, ?, ?, ?)",
          [
            cat.name,
            cat.slug,
            cat.desc,
            `${cat.name} News & Updates | Northeast Timeline`,
            `Read latest ${cat.name.toLowerCase()} news coverage and articles.`
          ]
        );
      } else {
        console.log(`Category "${cat.name}" already exists!`);
      }
    }

    console.log('--- Distributing some articles among categories ---');
    for (const cat of targetCats) {
      // Check count of articles in this category
      const [countRes] = await conn.query("SELECT COUNT(*) as cnt FROM articles WHERE category = ?", [cat.name]);
      const currentCount = countRes[0].cnt;
      if (currentCount < 10) {
        const needed = 10 - currentCount;
        console.log(`Updating ${needed} articles to "${cat.name}" from other categories...`);
        // Find some articles from categories that have more than 15 articles
        const [up] = await conn.query(
          "UPDATE articles SET category = ? WHERE category NOT IN (?, 'Breaking') AND id NOT IN (SELECT id FROM (SELECT id FROM articles WHERE category = ?) as x) LIMIT ?",
          [cat.name, cat.name, cat.name, needed]
        );
        console.log(`Updated ${up.affectedRows} articles to "${cat.name}".`);
      } else {
        console.log(`Category "${cat.name}" already has ${currentCount} articles.`);
      }
    }

    await conn.end();
  } catch (err) {
    console.error('Error running script:', err);
  }
}

run();
