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
      { name: "Global", slug: "global", desc: "International news, global conflicts, treaties, and foreign affairs reports." },
      { name: "Health", slug: "health", desc: "Latest research, medicine developments, wellness guides, and healthcare policy updates." },
      { name: "Jobs", slug: "jobs", desc: "Employment trends, career insights, hiring markets, and workplace environment analysis." },
      { name: "Education", slug: "education", desc: "Schooling policy, academic updates, university breakthroughs, and literacy drives." },
      { name: "Entertainment", slug: "entertainment", desc: "Cinematic releases, pop culture updates, musical shows, and performing arts reports." },
      { name: "Travel", slug: "travel", desc: "Tourism guides, heritage sites, coastal journeys, and eco-friendly excursions." }
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

    // 2. Prepare 60 articles (10 per category)
    const articles = [];

    // Global (10)
    const globalTitles = [
      "UN Summit Reaches Historic Agreement on Global Plastics Treaty",
      "Global Supply Chains Braced for Disruptions Amid Port Expansion Delays",
      "Central Banks Coordinate Policy to Address Cross-Border Capital Flows",
      "International Alliance Launches Joint Initiative for Space Safety Standards",
      "Global Tourism Surpasses Pre-Pandemic Levels in Historic Travel Surge",
      "Nations Unite to Combat Cyber Threats Targeting Core Public Utilities",
      "Global Trade Corridors Evolve to Leverage Modern Maritime Routes",
      "UN High Commissioner Urges Cooperation on Global Food Reserve Security",
      "Major Economies Announce Unified Standards for Smart Grid Tech",
      "Global Environmental Pact Signed by Over Eighty Nations in Geneva"
    ];
    for (let i = 0; i < 10; i++) {
      articles.push({
        title: globalTitles[i],
        category: "Global",
        excerpt: `An in-depth report on ${globalTitles[i].toLowerCase()} and its long-term impact on international policies.`,
        content: `<p>International delegates and industry leaders aligned on key milestones during the latest summit addressing ${globalTitles[i].toLowerCase()}. The resulting policy framework establishes a timeline for implementing these updates globally.</p><p>Economic advisors suggest that these measures will stabilize regional supply chains while promoting sustainable practices across both developed and emerging markets.</p>`
      });
    }

    // Health (10)
    const healthTitles = [
      "Breakthrough mRNA Treatment Enters Phase Three Trials for Heart Disease",
      "Medical Community Welcomes New Clinical Guidelines for Chronic Pain",
      "Study Links Daily Micro-Workouts with Extended Lifespan Benefits",
      "Global Health Body Warns of Rising Antibiotic Resistance in Hospitals",
      "New Brain Mapping Initiative Promises Clues to Neurological Disorders",
      "Public Health Campaign Urges Increased Focus on Sleep Hygiene Habits",
      "Research Identifies Key Cellular Pathways Linked to Immune Strength",
      "Digital Health Apps Reshaping Doctor-Patient Consultations Worldwide",
      "New Pediatric Care Standards Adopted by Medical Centers Nationwide",
      "Scientists Design Synthetic Molecule Targeting Seasonal Influenza Viruses"
    ];
    for (let i = 0; i < 10; i++) {
      articles.push({
        title: healthTitles[i],
        category: "Health",
        excerpt: `A medical news report on ${healthTitles[i].toLowerCase()} and its clinical significance for patient care.`,
        content: `<p>Healthcare researchers have released findings from their latest study on ${healthTitles[i].toLowerCase()}. The evidence points to improved clinical outcomes under the updated protocols.</p><p>Medical practitioners are encouraging patients to consult with specialists to understand how these updates might influence their personalized health plans.</p>`
      });
    }

    // Jobs (10)
    const jobsTitles = [
      "Venture Capital Funds Expand Investments in Tech Talent Incubators",
      "Tech Sector Observes Shift Toward Specialized Cloud Security Roles",
      "Corporate Training Programs Pivot to Address Critical Upskilling Needs",
      "Gig Economy Platforms Implement Expanded Healthcare Benefits Schemes",
      "Study Highlights Growing Demand for Green Energy Project Coordinators",
      "Human Resources Execs Highlight Shift in Modern Workplace Preferences",
      "Modern Apprenticeships Gain Traction Among Recent Engineering Graduates",
      "Remote Job Listings See Resurgence in Software Development Verticals",
      "Creative Industry Leaders Align on New Standards for Freelance Work",
      "Government Job Fair Registers Record Participation from Skilled Youth"
    ];
    for (let i = 0; i < 10; i++) {
      articles.push({
        title: jobsTitles[i],
        category: "Jobs",
        excerpt: `A workplace report covering ${jobsTitles[i].toLowerCase()} and what it means for job seekers and hiring teams.`,
        content: `<p>Industry analyst forecasts indicate a shifting dynamic in employment markets regarding ${jobsTitles[i].toLowerCase()}. Both startups and established corporations are adapting hiring strategies to secure top-tier talent.</p><p>Career mentors advise applicants to acquire relevant skills to stay competitive as roles become more specialized.</p>`
      });
    }

    // Education (10)
    const eduTitles = [
      "National Policy Framework Recommends Coding for Primary Classes",
      "Top Universities Launch Collaborative Open Source Learning Network",
      "Educational Institutions Pilot Interactive Virtual Reality Lab Modules",
      "Study Evaluates Long-Term Benefits of Multilingual Early Education",
      "Corporate Foundations Announce Major STEM Scholarships for Minorities",
      "Teacher Training Centers Introduce Advanced Digital Literacy Tools",
      "Research Highlights Positive Outcomes of Project-Based Learning Formats",
      "New Literacy Campaign Targets Adult Education in Rural Districts",
      "Higher Education Institutes Expand Financial Aid for First-Gen Students",
      "Innovative STEM Programs Empower Students in Underrepresented Schools"
    ];
    for (let i = 0; i < 10; i++) {
      articles.push({
        title: eduTitles[i],
        category: "Education",
        excerpt: `A detailed report about ${eduTitles[i].toLowerCase()} and its impact on modern academic curriculums.`,
        content: `<p>Educational boards and researchers have collaborated on a major rollout covering ${eduTitles[i].toLowerCase()}. Results from pilot classrooms indicate a significant boost in student engagement and retention metrics.</p><p>Administrators plan to implement these strategies across more school districts in the upcoming academic calendar.</p>`
      });
    }

    // Entertainment (10)
    const entTitles = [
      "Acclaimed Director Announces Epic Science Fiction Trilogy Adaptation",
      "Streaming Platforms Report Surge in Foreign Language Drama Viewers",
      "Independent Film Festival Showcases Voices from Emerging Directors",
      "Digital Music Platforms Redefine Artist Royalties in New Contract Models",
      "National Symphony Orchestra Schedules Tour of Historical Landmarks",
      "Performing Arts Centers Adapt Classic Plays for Modern Audiences",
      "Gaming Industry Experts Predict Surge in Open-World Strategy Titles",
      "Documentary Series Wins High Praise for Environmental Conservation Focus",
      "Renowned Museum Hosts Interactive Retrospective of Modern Sculptures",
      "Major Studios Form Consortium to Support Eco-Friendly Movie Sets"
    ];
    for (let i = 0; i < 10; i++) {
      articles.push({
        title: entTitles[i],
        category: "Entertainment",
        excerpt: `A culture feature about ${entTitles[i].toLowerCase()} and what it means for audiences worldwide.`,
        content: `<p>Critics and creators are buzzing following the major announcement of ${entTitles[i].toLowerCase()}. The project is expected to set new trends in the creative landscape.</p><p>Promoters have scheduled early previews and interactive sessions to build community engagement ahead of the global launch.</p>`
      });
    }

    // Travel (10)
    const travelTitles = [
      "Eco-Tourism Destinations Gain Popularity Among Adventure Seekers",
      "Historical Rail Journeys Experience Revival in European Corridors",
      "Tourism Boards Coordinate to Develop Off-Grid Mountain Trails",
      "Travel Experts Share Top Tips for Navigating Busy Airport Seasons",
      "Cultural Heritage Sites Introduce Enhanced Visitor Reservation Tech",
      "Coastal Towns Collaborate on Sustainable Marine Travel Initiatives",
      "Adventure Travel Outfitter Launches Polar Expedition Itineraries",
      "Local Culinary Trails Attract Gastronomy Enthusiasts Worldwide",
      "Travel Planning Apps Leverage Smart Mapping for Custom Road Trips",
      "Historic Landmark Preservation Project Welcomes First Tourist Batch"
    ];
    for (let i = 0; i < 10; i++) {
      articles.push({
        title: travelTitles[i],
        category: "Travel",
        excerpt: `A travel feature exploring ${travelTitles[i].toLowerCase()} and unique options for global travelers.`,
        content: `<p>Regional travel bureaus are reporting a surge in visitor interest focusing on ${travelTitles[i].toLowerCase()}. Enhanced infrastructure and local hospitality projects have made these destinations more accessible.</p><p>Seasoned travelers suggest booking reservations well in advance to enjoy local experiences without long delays.</p>`
      });
    }

    // 3. Insert articles into DB
    console.log(`Seeding 60 articles into DB...`);
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
