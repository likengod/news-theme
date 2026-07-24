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

    const tagsToSeed = [
      "Economy", "Investing", "Government", "Elections", "Stocks",
      "Bonds", "Artificial Intelligence", "Climate Change", "Renewable Energy", "Cricket",
      "Football", "Olympics", "Bollywood", "Hollywood", "Health Tips",
      "Mental Health", "Education Policy", "Student Life", "Job Market", "Remote Work",
      "Travel Destinations", "Budget Travel", "Cooking", "Recipes", "Automotive",
      "Electric Vehicles", "Real Estate", "Housing Market", "Cybersecurity", "Privacy",
      "Gadgets", "Smartphones", "Space Exploration", "Astronomy", "History Buff",
      "Ancient Civilizations", "Art Exhibitions", "Literature", "Parenting", "Family Life",
      "Fitness", "Nutrition", "Science News", "Biotechnology", "Movies",
      "Web Series", "Stock Market", "Inflation News", "Startup Funding", "Venture Capital"
    ];

    console.log(`Checking existing tags in DB...`);
    const [existingRows] = await conn.query("SELECT name FROM tags");
    const existingNames = new Set(existingRows.map(r => r.name.toLowerCase()));

    let insertedCount = 0;
    for (const tagName of tagsToSeed) {
      if (!existingNames.has(tagName.toLowerCase())) {
        const slug = tagName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        await conn.query("INSERT INTO tags (name, slug) VALUES (?, ?)", [tagName, slug]);
        insertedCount++;
      }
    }

    console.log(`Successfully seeded tags! Total inserted: ${insertedCount}`);
    
    // Print all tags
    const [finalTags] = await conn.query("SELECT * FROM tags");
    console.log(`Total tags in DB now: ${finalTags.length}`);
    
    await conn.end();
  } catch (err) {
    console.error('Error seeding tags:', err);
  }
}

run();
