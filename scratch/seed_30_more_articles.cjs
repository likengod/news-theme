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

    // 1. Verify/Insert categories first
    const categories = [
      { name: "World", slug: "world", desc: "International news, global developments, and global affairs." },
      { name: "Politics", slug: "politics", desc: "Political updates, legislative bills, and governance news." },
      { name: "Culture", slug: "culture", desc: "Folk music, classical heritage, historical folklore, and arts." }
    ];

    console.log("Checking categories in database...");
    for (const cat of categories) {
      const [rows] = await conn.query("SELECT id FROM categories WHERE name = ? OR slug = ?", [cat.name, cat.slug]);
      if (rows.length === 0) {
        console.log(`Inserting missing category: ${cat.name}`);
        await conn.query(
          "INSERT INTO categories (name, slug, description, meta_title, meta_description) VALUES (?, ?, ?, ?, ?)",
          [
            cat.name,
            cat.slug,
            cat.desc,
            `${cat.name} News & Updates | Northeast Timeline`,
            `Get the latest reports, expert analysis and breaking news on ${cat.name.toLowerCase()} at Northeast Timeline.`
          ]
        );
      }
    }

    // 2. Prepare 30 articles (10 per category)
    const articles = [];

    // World (10)
    const worldTitles = [
      "Diplomatic Talks Resurface to Resolve Long-Standing Border Disputes",
      "Global Summit Outlines Actions to Conserve Critical Rainforest Ecosystems",
      "Major Cities Deploy Unified Public Transit Smart Cards Across Borders",
      "Historic Trade Route Reopens Supporting Regional Agriculture Exporters",
      "International Oceanographic Study Reveals Deep Sea Ecosystem Health",
      "Global Infrastructure Consortium Announces New Rural Telecom Funding",
      "Nations Collaborate on Smart Warning Systems for Natural Disasters",
      "Joint Space Mission Transmits First High-Res Images of Outer Asteroids",
      "International Treaty Targets Maritime Waste Reduction Guidelines",
      "Global Cultural Exchange Program Celebrates Indigenous Folk Music"
    ];
    for (let i = 0; i < 10; i++) {
      articles.push({
        title: worldTitles[i],
        category: "World",
        excerpt: `A global updates report analyzing the direct impacts of ${worldTitles[i].toLowerCase()}.`,
        content: `<p>Global policy experts and regional governments have collaborated to address ${worldTitles[i].toLowerCase()}. The newly aligned framework provides structural guidelines to support this transition.</p><p>Economists expect this to stimulate cross-border collaboration while ensuring regulatory compliance and environmental sustainability.</p>`
      });
    }

    // Politics (10)
    const politicsTitles = [
      "Legislature Approves Comprehensive Policy Overhaul for Public Libraries",
      "Bipartisan Committee Recommends Enhanced Cybersecurity Safeguards",
      "New Decentralization Act Empowers Local Councils with Budget Authority",
      "Parliament Schedules Special Session to Debate Green Infrastructure Bill",
      "Regional Leaders Align on Coordinated Agricultural Development Plans",
      "Supreme Judiciary Issues Critical Clarification on Regulatory Powers",
      "Municipal Councils Launch Transparency Portals for Project Expenditures",
      "National Commission Proposes Reform to Electoral Campaign Rules",
      "New Public Pension Reform Signed into Law After Months of Debate",
      "Bipartisan Alliance Introduces Bill Targeting Rural Broadband Subsidies"
    ];
    for (let i = 0; i < 10; i++) {
      articles.push({
        title: politicsTitles[i],
        category: "Politics",
        excerpt: `A political brief detailing the background and implementation schedule for ${politicsTitles[i].toLowerCase()}.`,
        content: `<p>A new bill addressing ${politicsTitles[i].toLowerCase()} was recently introduced, generating intensive debate across committees. Advocates highlight the efficiency gains, while critics urge caution regarding budgetary impacts.</p><p>Implementation is set to proceed in phases, with local councils managing the rollout under federal supervision.</p>`
      });
    }

    // Culture (10)
    const cultureTitles = [
      "Traditional Crafts Experience Revival Among Young Urban Artisans",
      "National Archives Launch Interactive Digital Portals for Historians",
      "Historical Folklore Society Documents Unsung Legends of Rural Villages",
      "Museum Curators Restore Century-Old Paintings for Public Exhibition",
      "Annual Literature Festival Welcomes Renowned Poets and Novelists",
      "Traditional Architectural Methods Adapted for Modern Eco-Housing",
      "Folk Dance Ensemble Schedules National Tour of Historic Theaters",
      "New Archaeological Discovery Sheds Light on Ancient Pottery Methods",
      "Classical Music Academy Launches Free Mentorship for Talented Youth",
      "Community Heritage Project Preserves Historic Landmarks in Agartala"
    ];
    for (let i = 0; i < 10; i++) {
      articles.push({
        title: cultureTitles[i],
        category: "Culture",
        excerpt: `A cultural feature exploring the historical relevance and community efforts behind ${cultureTitles[i].toLowerCase()}.`,
        content: `<p>Heritage preservation groups and local academies have announced resources targeting ${cultureTitles[i].toLowerCase()}. Community members are actively participating in workshops to keep these historical traditions alive.</p><p>Organizers express optimism that these initiatives will foster greater appreciation for local heritage among younger generations.</p>`
      });
    }

    // 3. Insert articles into DB
    console.log(`Seeding 30 more articles into DB...`);
    let insertedCount = 0;
    
    for (let i = 0; i < articles.length; i++) {
      const art = articles[i];
      const baseSlug = art.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      
      // Make slug unique by appending a random suffix
      const slug = `${baseSlug}-${Math.floor(1000 + Math.random() * 9000)}`;

      // Stagger dates in the past (up to 30 days) to populate the timeline naturally
      const date = new Date(Date.now() - (i % 30) * 24 * 60 * 60 * 1000);
      const formattedDate = date.toISOString().slice(0, 19).replace('T', ' ');

      const fields = [
        "title", "slug", "category", "city", "state", "country", "author", "views",
        "status", "date", "excerpt", "content", "featuredImage", "ogImage",
        "metaTitle", "metaDescription", "tags", "featured", "newsType",
        "journalistId", "journalistName", "access_level"
      ];

      const values = [
        art.title,
        slug,
        art.category,
        "Agartala",
        "Tripura",
        "India",
        "Northeast Timeline Newsroom",
        Math.floor(1200 + Math.random() * 8000), // Random views
        "Published",
        formattedDate,
        art.excerpt,
        art.content,
        "/placeholder.svg",
        "/placeholder.svg",
        `${art.title} | Northeast Timeline`,
        art.excerpt,
        `news, ${art.category.toLowerCase()}, update`,
        0, // featured
        "Standard",
        "", // journalistId
        "Newsroom Reporter",
        "Free" // access_level
      ];

      const colNames = fields.join(", ");
      const placeHolders = fields.map(() => "?").join(", ");
      await conn.query(`INSERT INTO articles (${colNames}) VALUES (${placeHolders})`, values);
      insertedCount++;
    }

    console.log(`Seeding completed successfully! Total articles inserted: ${insertedCount}`);

    // Print count in DB now
    const [countRows] = await conn.query("SELECT COUNT(*) as total FROM articles");
    console.log(`Total articles in DB now: ${countRows[0].total}`);

    await conn.end();
  } catch (err) {
    console.error("Error seeding articles:", err);
  }
}

run();
