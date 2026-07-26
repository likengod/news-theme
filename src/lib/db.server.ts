import mysql from "mysql2/promise";
import crypto from "crypto";
import fs from "fs";
import path from "path";
import { slugify } from "./news-data";

// Hash password with native crypto pbkdf2
export function hashPassword(password: string, salt?: string): string {
  const activeSalt = salt || "northeast_timeline_salt_2026";
  const iterations = salt ? 100000 : 1000;
  return crypto.pbkdf2Sync(password, activeSalt, iterations, 64, "sha512").toString("hex");
}

let pool: mysql.Pool | null = null;
let configLoaded = false;
let dbConfig: any = null;

export function loadDbConfig() {
  if (configLoaded) return dbConfig;
  try {
    const configPath = path.resolve(process.cwd(), "db-config.json");
    if (fs.existsSync(configPath)) {
      const data = fs.readFileSync(configPath, "utf-8");
      dbConfig = JSON.parse(data);
      configLoaded = true;
      return dbConfig;
    }
  } catch (err) {
    console.error("[MySQL] Error reading db-config.json:", err);
  }
  configLoaded = true;
  return null;
}

declare global {
  var __mysqlPool: mysql.Pool | undefined;
}

export function getPool() {
  if (globalThis.__mysqlPool) return globalThis.__mysqlPool;
  if (pool) return pool;

  const config = loadDbConfig();
  const host = config?.host || process.env.MYSQL_HOST || "localhost";
  const port = Number(config?.port || process.env.MYSQL_PORT) || 3306;
  const user = config?.user || process.env.MYSQL_USER || "root";
  const password = config?.password !== undefined ? config.password : (process.env.MYSQL_PASSWORD || "");
  const database = config?.database || process.env.MYSQL_DATABASE || "today_tripura";

  pool = mysql.createPool({
    host,
    port,
    user,
    password,
    database,
    waitForConnections: true,
    connectionLimit: 10,
    maxIdle: 5,
    idleTimeout: 30000,
    enableKeepAlive: true,
    queueLimit: 0,
  });
  globalThis.__mysqlPool = pool;
  return pool;
}

export async function closePool() {
  if (globalThis.__mysqlPool) {
    try { await globalThis.__mysqlPool.end(); } catch {}
    globalThis.__mysqlPool = undefined;
  }
  if (pool) {
    try { await pool.end(); } catch {}
    pool = null;
  }
  configLoaded = false;
  dbConfig = null;
}

export async function query(sql: string, params: any[] = []): Promise<any> {
  const p = getPool();
  const [results] = await p.query(sql, params);
  return results;
}

export async function safeCreateIndex(tableName: string, indexName: string, columnsSql: string) {
  try {
    const existing = await query(`SHOW INDEX FROM \`${tableName}\` WHERE Key_name = ?`, [indexName]);
    if (existing.length === 0) {
      await query(`CREATE INDEX \`${indexName}\` ON \`${tableName}\`(${columnsSql})`);
    }
  } catch (err: any) {
    // Table or database initialization note
  }
}

// Test connection and auto-create database if missing
export async function testDbConnection(config: any): Promise<boolean> {
  let tempConn;
  try {
    // 1. Connect without selecting a database
    tempConn = await mysql.createConnection({
      host: config.host || "localhost",
      port: Number(config.port) || 3306,
      user: config.user || "root",
      password: config.password !== undefined ? config.password : "",
    });
    
    // 2. Create database if it does not exist
    const dbName = config.database || "today_tripura";
    await tempConn.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``);
    
    // 3. Select database to verify access
    await tempConn.query(`USE \`${dbName}\``);
    return true;
  } catch (err: any) {
    console.error("[MySQL] Test connection / DB creation failed:", err.message);
    throw new Error(err.message || "Failed to connect to MySQL server");
  } finally {
    if (tempConn) {
      await tempConn.end();
    }
  }
}

// Automatically create tables & seed them if needed
export async function initializeDatabase(customAdmin?: { email: string; passwordHash: string; salt: string; displayName: string }) {
  console.log("[MySQL] Starting database initialization...");
  
  // Check if we are configured yet (if missing and no env vars, initializeDatabase will fail silently or log)
  const config = loadDbConfig();
  if (!config && !process.env.MYSQL_HOST) {
    console.log("[MySQL] Database is not configured yet. Setup Wizard is required.");
    return;
  }

  try {
    // 1. Create users table
    await query(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(255) PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        salt VARCHAR(64),
        display_name VARCHAR(255),
        avatar_url TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 2. Create user_roles table
    await query(`
      CREATE TABLE IF NOT EXISTS user_roles (
        id VARCHAR(255) PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, role),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // 3. Create profiles table
    await query(`
      CREATE TABLE IF NOT EXISTS profiles (
        id VARCHAR(255) PRIMARY KEY,
        public_user_id VARCHAR(100) UNIQUE NOT NULL,
        display_name VARCHAR(255),
        avatar_url TEXT,
        points INT DEFAULT 0,
        journalist_id VARCHAR(100) UNIQUE,
        phone VARCHAR(50),
        blood_group VARCHAR(50),
        address TEXT,
        state VARCHAR(100),
        country VARCHAR(100),
        pin_code VARCHAR(50),
        email VARCHAR(255),
        active BOOLEAN DEFAULT TRUE,
        articles_published INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // 4. Create categories table
    await query(`
      CREATE TABLE IF NOT EXISTS categories (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) UNIQUE NOT NULL,
        slug VARCHAR(100) UNIQUE NOT NULL,
        description TEXT,
        meta_title VARCHAR(255),
        meta_description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 5. Create tags table
    await query(`
      CREATE TABLE IF NOT EXISTS tags (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) UNIQUE NOT NULL,
        slug VARCHAR(100) UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 6. Create articles table
    await query(`
      CREATE TABLE IF NOT EXISTS articles (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        slug VARCHAR(255) UNIQUE NOT NULL,
        category VARCHAR(100) NOT NULL,
        city VARCHAR(100),
        state VARCHAR(100),
        country VARCHAR(100),
        author VARCHAR(255),
        views INT DEFAULT 0,
        status VARCHAR(50) DEFAULT 'Draft',
        date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        excerpt TEXT,
        content TEXT,
        featuredImage TEXT,
        ogImage TEXT,
        metaTitle VARCHAR(255),
        metaDescription TEXT,
        tags TEXT,
        featured BOOLEAN DEFAULT FALSE,
        newsType VARCHAR(50) DEFAULT 'Standard',
        journalistId VARCHAR(100),
        journalistName VARCHAR(255),
        access_level VARCHAR(50) DEFAULT 'Free',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Ensure access_level column exists on articles table (retroactive update)
    const columns = await query("SHOW COLUMNS FROM articles LIKE 'access_level'");
    if (columns.length === 0) {
      await query("ALTER TABLE articles ADD COLUMN access_level VARCHAR(50) DEFAULT 'Free'");
    }

    // Ensure bank and delete_requested columns exist on profiles table (retroactive update)
    const bankCols = await query("SHOW COLUMNS FROM profiles LIKE 'bank_name'");
    if (bankCols.length === 0) {
      await query("ALTER TABLE profiles ADD COLUMN bank_name VARCHAR(255) DEFAULT NULL");
      await query("ALTER TABLE profiles ADD COLUMN bank_account_name VARCHAR(255) DEFAULT NULL");
      await query("ALTER TABLE profiles ADD COLUMN bank_account_no VARCHAR(255) DEFAULT NULL");
      await query("ALTER TABLE profiles ADD COLUMN bank_ifsc VARCHAR(255) DEFAULT NULL");
      await query("ALTER TABLE profiles ADD COLUMN delete_requested BOOLEAN DEFAULT FALSE");
    }

    // Ensure salt column exists on users table (retroactive update)
    const userCols = await query("SHOW COLUMNS FROM users LIKE 'salt'");
    if (userCols.length === 0) {
      await query("ALTER TABLE users ADD COLUMN salt VARCHAR(64) DEFAULT NULL");
    }

    // 7. Create sessions table
    await query(`
      CREATE TABLE IF NOT EXISTS sessions (
        id VARCHAR(255) PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        expires_at TIMESTAMP NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // 8. Create comments table
    await query(`
      CREATE TABLE IF NOT EXISTS comments (
        id INT AUTO_INCREMENT PRIMARY KEY,
        article_slug VARCHAR(255) NOT NULL,
        article_title VARCHAR(255) NOT NULL,
        user_name VARCHAR(255) NOT NULL,
        user_email VARCHAR(255) NOT NULL,
        body TEXT NOT NULL,
        status VARCHAR(50) DEFAULT 'Pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 9. Create inbox_requests table
    await query(`
      CREATE TABLE IF NOT EXISTS inbox_requests (
        id INT AUTO_INCREMENT PRIMARY KEY,
        type VARCHAR(50) NOT NULL,
        user_id VARCHAR(255),
        user_email VARCHAR(255),
        user_name VARCHAR(255),
        title VARCHAR(255),
        details TEXT,
        status VARCHAR(50) DEFAULT 'Pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 9.5 Create site_settings table
    await query(`
      CREATE TABLE IF NOT EXISTS site_settings (
        setting_key VARCHAR(255) PRIMARY KEY,
        value LONGTEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // 10. Performance Composite Indexes
    await safeCreateIndex("articles", "idx_articles_cat_created", "category_slug, created_at DESC");
    await safeCreateIndex("articles", "idx_articles_status_created", "status, created_at DESC");
    await safeCreateIndex("articles", "idx_articles_hero_flags", "is_editors_pick, is_breaking, created_at DESC");
    await safeCreateIndex("comments", "idx_comments_article_status", "article_slug, status, created_at DESC");
    await safeCreateIndex("inbox_requests", "idx_inbox_created", "created_at DESC");

    // Seed default admin or custom admin
    if (customAdmin) {
      console.log("[MySQL] Ensuring custom administrator account exists...");
      const existing = await query("SELECT id FROM users WHERE email = ?", [customAdmin.email]);
      if (existing.length > 0) {
        const adminId = existing[0].id;
        await query(
          "UPDATE users SET password_hash = ?, salt = ?, display_name = ? WHERE id = ?",
          [customAdmin.passwordHash, customAdmin.salt, customAdmin.displayName, adminId]
        );
        // Ensure role exists
        const roles = await query("SELECT id FROM user_roles WHERE user_id = ? AND role = 'admin'", [adminId]);
        if (roles.length === 0) {
          await query(
            "INSERT INTO user_roles (id, user_id, role) VALUES (?, ?, 'admin')",
            [crypto.randomUUID(), adminId]
          );
        }
        await query(
          "UPDATE profiles SET display_name = ? WHERE id = ?",
          [customAdmin.displayName, adminId]
        );
      } else {
        const adminId = crypto.randomUUID();
        await query(
          "INSERT INTO users (id, email, password_hash, salt, display_name) VALUES (?, ?, ?, ?, ?)",
          [adminId, customAdmin.email, customAdmin.passwordHash, customAdmin.salt, customAdmin.displayName]
        );
        await query(
          "INSERT INTO user_roles (id, user_id, role) VALUES (?, ?, 'admin')",
          [crypto.randomUUID(), adminId]
        );
        const publicUserId = String(Math.floor(1000000000 + Math.random() * 9000000000));
        await query(
          "INSERT INTO profiles (id, public_user_id, display_name, email, active) VALUES (?, ?, ?, ?, ?)",
          [adminId, publicUserId, customAdmin.displayName, customAdmin.email, true]
        );
      }
    } else {
      const users = await query("SELECT id FROM users LIMIT 1");
      if (users.length === 0) {
        console.log("[MySQL] Seeding default administrator user...");
        const adminId = crypto.randomUUID();
        const adminEmail = "admin@demo.com";
        const adminSalt = crypto.randomBytes(16).toString("hex");
        const adminPassHash = hashPassword("Demo@Admin#2026NE", adminSalt);
        const adminName = "Demo Admin";

        await query(
          "INSERT INTO users (id, email, password_hash, salt, display_name) VALUES (?, ?, ?, ?, ?)",
          [adminId, adminEmail, adminPassHash, adminSalt, adminName]
        );

        await query(
          "INSERT INTO user_roles (id, user_id, role) VALUES (?, ?, 'admin')",
          [crypto.randomUUID(), adminId]
        );

        const publicUserId = "1000000000";
        await query(
          "INSERT INTO profiles (id, public_user_id, display_name, email, active) VALUES (?, ?, ?, ?, ?)",
          [adminId, publicUserId, adminName, adminEmail, true]
        );
      }
    }

    // Seed default categories if empty
    const cats = await query("SELECT id FROM categories LIMIT 1");
    if (cats.length === 0) {
      console.log("[MySQL] Seeding default categories...");
      const defaultCats = [
        {
          name: "Breaking",
          title: "Breaking News & Live Updates | News Theme",
          metaDesc: "Get the latest breaking news, live event coverage, and urgent news updates first on News Theme."
        },
        {
          name: "Northeast",
          title: "Northeast India News & Regional Updates | News Theme",
          metaDesc: "Comprehensive coverage of news, politics, culture, and development across the Northeast Indian states."
        },
        {
          name: "Global",
          title: "Global News & International Affairs | News Theme",
          metaDesc: "Get international news, global market updates, and expert analysis on global affairs."
        },
        {
          name: "Politics",
          title: "Political News, Elections & Policy Analysis | News Theme",
          metaDesc: "In-depth political news coverage, election analysis, policy debates, and government updates."
        },
        {
          name: "Business",
          title: "Business News, Economy & Market Updates | News Theme",
          metaDesc: "Latest updates from the business world, economic trends, corporate news, and market insights."
        },
        {
          name: "Crime",
          title: "Crime News, Investigations & Law Updates | News Theme",
          metaDesc: "Latest crime reports, investigative stories, legal news, and law enforcement updates."
        },
        {
          name: "Tech",
          title: "Technology News, Startups & Innovation | News Theme",
          metaDesc: "Latest technology news, innovation highlights, startup stories, and gadget reviews."
        },
        {
          name: "Sports",
          title: "Sports News, Scores & Highlights | News Theme",
          metaDesc: "Live sports updates, match analysis, tournament results, and athlete profiles."
        },
        {
          name: "Opinion",
          title: "Opinions, Editorials & Columns | News Theme",
          metaDesc: "Thought-provoking essays, expert opinions, editorial commentary, and political viewpoints."
        },
        {
          name: "Others",
          title: "Miscellaneous News & Special Coverage | News Theme",
          metaDesc: "Special reports, features, human interest stories, and miscellaneous news updates."
        }
      ];
      for (const item of defaultCats) {
        await query(
          "INSERT IGNORE INTO categories (name, slug, description, meta_title, meta_description) VALUES (?, ?, ?, ?, ?)",
          [
            item.name,
            slugify(item.name),
            `Latest ${item.name} news, analysis and updates.`,
            item.title,
            item.metaDesc
          ]
        );
      }
    }

    // Seed default tags if empty
    const tagList = await query("SELECT id FROM tags LIMIT 1");
    if (tagList.length === 0) {
      console.log("[MySQL] Seeding default tags...");
      const defaultTags = ["markets", "fed", "inflation", "startups", "finance", "cricket", "policy", "climate"];
      for (const tName of defaultTags) {
        await query(
          "INSERT IGNORE INTO tags (name, slug) VALUES (?, ?)",
          [tName, slugify(tName)]
        );
      }
    }

    // Seed default comments if empty
    const commentCountResult = await query("SELECT id FROM comments LIMIT 1");
    if (commentCountResult.length === 0) {
      console.log("[MySQL] Seeding default comments...");
      const defaultComments = [
        { article_slug: "fed-signals-pause-on-cuts", article_title: "Fed Signals Pause on Cuts", user_name: "Aarav Sharma", user_email: "aarav@example.com", body: "Powell's tone clearly shifted this time. Markets will reprice.", status: "Approved" },
        { article_slug: "bitcoin-tags-fresh-high", article_title: "Bitcoin Tags Fresh High", user_name: "Lina Park", user_email: "lina@example.com", body: "ETF flows finally absorbing miner supply.", status: "Pending" },
        { article_slug: "goldman-jpmorgan-beat", article_title: "Goldman, JPMorgan Beat", user_name: "spammer42", user_email: "spam@bad.io", body: "Buy now cheap stock get rich quick!!!", status: "Spam" },
        { article_slug: "pacific-container-rates-whipsaw", article_title: "Pacific Container Rates Whipsaw", user_name: "Maya Iyer", user_email: "maya@example.com", body: "Front-loading already visible at LA ports.", status: "Approved" },
        { article_slug: "brent-slides-below-74", article_title: "Brent Slides Below $74", user_name: "Ben Cole", user_email: "ben@example.com", body: "OPEC+ unity is fragile this time around.", status: "Pending" }
      ];
      for (const c of defaultComments) {
        await query(
          "INSERT INTO comments (article_slug, article_title, user_name, user_email, body, status) VALUES (?, ?, ?, ?, ?, ?)",
          [c.article_slug, c.article_title, c.user_name, c.user_email, c.body, c.status]
        );
      }
    }

    // Seed default journalists if empty
    const journalistCountResult = await query("SELECT id FROM profiles WHERE journalist_id IS NOT NULL LIMIT 1");
    if (journalistCountResult.length === 0) {
      console.log("[MySQL] Seeding default journalists...");
      const demoJournalists = [
        { name: "John Doe", email: "john@demo.com", jId: "JID-1001" },
        { name: "Jane Smith", email: "jane@demo.com", jId: "JID-1002" }
      ];
      for (const j of demoJournalists) {
        const uId = crypto.randomUUID();
        const pubId = String(Math.floor(1000000000 + Math.random() * 9000000000));
        await query("INSERT INTO users (id, email, password_hash, display_name) VALUES (?, ?, ?, ?)", [uId, j.email, "demo_hash", j.name]);
        await query("INSERT INTO user_roles (id, user_id, role) VALUES (?, ?, 'journalist')", [crypto.randomUUID(), uId]);
        await query("INSERT INTO profiles (id, public_user_id, display_name, email, active, journalist_id) VALUES (?, ?, ?, ?, ?, ?)", [uId, pubId, j.name, j.email, true, j.jId]);
      }
    }

    // Seed default articles if empty
    const articleCountResult = await query("SELECT id FROM articles LIMIT 1");
    if (articleCountResult.length === 0) {
      console.log("[MySQL] Seeding default articles...");
      const demoArticles = [
        { title: "Global Markets Rally As Tech Stocks Surge", cat: "Global", excerpt: "Technology stocks led a global market rally today, lifting major indexes to record highs. Investors cheered stronger-than-expected earnings reports from leading technology companies.", author: "John Doe" },
        { title: "New Policy Announced for Renewable Energy", cat: "Politics", excerpt: "The government has unveiled a comprehensive new policy aimed at dramatically increasing the country's reliance on renewable energy sources over the next decade.", author: "Jane Smith" },
        { title: "Local Team Wins Championship In Thrilling Match", cat: "Sports", excerpt: "In a stunning upset, the local underdogs secured the championship title with a last-minute goal, sending thousands of fans into wild celebrations across the city.", author: "John Doe" },
        { title: "Breakthrough In Artificial Intelligence Research", cat: "Tech", excerpt: "Scientists have announced a major breakthrough in AI research, demonstrating a new model capable of solving complex mathematical problems previously thought unsolvable by machines.", author: "Jane Smith" },
        { title: "Economy Shows Signs Of Strong Recovery", cat: "Business", excerpt: "Recent economic indicators suggest a robust recovery is underway, with consumer spending hitting an all-time high and unemployment numbers continuing their steady decline.", author: "John Doe" }
      ];
      for (const a of demoArticles) {
        await query("INSERT INTO articles (title, slug, category, author, excerpt, status, date) VALUES (?, ?, ?, ?, ?, 'Published', NOW())", [a.title, slugify(a.title), a.cat, a.author, a.excerpt]);
      }
    }

    console.log("[MySQL] Database initialization completed successfully!");
  } catch (err: any) {
    console.error("[MySQL] Failed to initialize database:", err.message);
    throw err;
  }
}

// Call init automatically on startup (catches errors if unconfigured)
initializeDatabase().catch((err) => {
  console.log("[MySQL] Auto-initialization skipped or waiting for setup:", err.message);
});
