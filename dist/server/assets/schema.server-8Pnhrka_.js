import { c as safeCreateIndex } from "./db.server-BkLt9eJ8.js";
//#region src/lib/db/schema.server.ts
async function createTablesAndIndexes(query) {
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
      dob VARCHAR(100),
      valid_till VARCHAR(100),
      bio TEXT,
      father_name VARCHAR(255),
      mother_name VARCHAR(255),
      gender VARCHAR(50),
      marital_status VARCHAR(50),
      husband_name VARCHAR(255),
      address TEXT,
      state VARCHAR(100),
      country VARCHAR(100),
      pin_code VARCHAR(50),
      email VARCHAR(255),
      document_type VARCHAR(100) DEFAULT NULL,
      document_url LONGTEXT DEFAULT NULL,
      active BOOLEAN DEFAULT TRUE,
      articles_published INT DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);
	await query(`
    CREATE TABLE IF NOT EXISTS categories (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) UNIQUE NOT NULL,
      slug VARCHAR(100) UNIQUE NOT NULL,
      description TEXT,
      meta_title VARCHAR(255),
      meta_description TEXT,
      show_in_header BOOLEAN DEFAULT FALSE,
      sort_order INT DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
	try {
		await query(`ALTER TABLE categories ADD COLUMN show_in_header BOOLEAN DEFAULT FALSE`);
	} catch (err) {
		if (!err.message.includes("Duplicate column name")) console.error("Migration error adding show_in_header:", err.message);
	}
	try {
		await query(`ALTER TABLE categories ADD COLUMN sort_order INT DEFAULT 0`);
	} catch (err) {
		if (!err.message.includes("Duplicate column name")) console.error("Migration error adding sort_order:", err.message);
	}
	await query(`
    CREATE TABLE IF NOT EXISTS tags (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) UNIQUE NOT NULL,
      slug VARCHAR(100) UNIQUE NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
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
	if ((await query("SHOW COLUMNS FROM articles LIKE 'access_level'")).length === 0) await query("ALTER TABLE articles ADD COLUMN access_level VARCHAR(50) DEFAULT 'Free'");
	if ((await query("SHOW COLUMNS FROM profiles LIKE 'bank_name'")).length === 0) {
		await query("ALTER TABLE profiles ADD COLUMN bank_name VARCHAR(255) DEFAULT NULL");
		await query("ALTER TABLE profiles ADD COLUMN bank_account_name VARCHAR(255) DEFAULT NULL");
		await query("ALTER TABLE profiles ADD COLUMN bank_account_no VARCHAR(255) DEFAULT NULL");
		await query("ALTER TABLE profiles ADD COLUMN bank_ifsc VARCHAR(255) DEFAULT NULL");
		await query("ALTER TABLE profiles ADD COLUMN delete_requested BOOLEAN DEFAULT FALSE");
	}
	if ((await query("SHOW COLUMNS FROM profiles LIKE 'father_name'")).length === 0) for (const def of [
		"dob VARCHAR(100) DEFAULT NULL",
		"valid_till VARCHAR(100) DEFAULT NULL",
		"bio TEXT DEFAULT NULL",
		"father_name VARCHAR(255) DEFAULT NULL",
		"mother_name VARCHAR(255) DEFAULT NULL",
		"gender VARCHAR(50) DEFAULT NULL",
		"marital_status VARCHAR(50) DEFAULT NULL",
		"husband_name VARCHAR(255) DEFAULT NULL",
		"document_type VARCHAR(100) DEFAULT NULL",
		"document_url LONGTEXT DEFAULT NULL"
	]) try {
		await query(`ALTER TABLE profiles ADD COLUMN ${def}`);
	} catch (e) {
		if (!e.message.includes("Duplicate column name")) console.error("Migration error adding column to profiles:", e.message);
	}
	if ((await query("SHOW COLUMNS FROM users LIKE 'salt'")).length === 0) await query("ALTER TABLE users ADD COLUMN salt VARCHAR(64) DEFAULT NULL");
	await query(`
    CREATE TABLE IF NOT EXISTS sessions (
      id VARCHAR(255) PRIMARY KEY,
      user_id VARCHAR(255) NOT NULL,
      expires_at TIMESTAMP NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);
	await query(`
    CREATE TABLE IF NOT EXISTS comments (
      id INT AUTO_INCREMENT PRIMARY KEY,
      article_slug VARCHAR(255) NOT NULL,
      article_title VARCHAR(255) NOT NULL,
      user_name VARCHAR(255) NOT NULL,
      user_email VARCHAR(255) NOT NULL,
      body TEXT NOT NULL,
      status VARCHAR(50) DEFAULT 'Pending',
      parent_id INT DEFAULT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
	try {
		await query(`ALTER TABLE comments ADD COLUMN parent_id INT DEFAULT NULL`);
	} catch {}
	await query(`
    CREATE TABLE IF NOT EXISTS inbox_requests (
      id INT AUTO_INCREMENT PRIMARY KEY,
      type VARCHAR(50) NOT NULL,
      user_id VARCHAR(255),
      user_email VARCHAR(255),
      user_name VARCHAR(255),
      title VARCHAR(255),
      details LONGTEXT,
      status VARCHAR(50) DEFAULT 'Pending',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
	await query(`
    CREATE TABLE IF NOT EXISTS site_settings (
      setting_key VARCHAR(255) PRIMARY KEY,
      value LONGTEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);
	await query(`
    CREATE TABLE IF NOT EXISTS signup_logs (
      id INT AUTO_INCREMENT PRIMARY KEY,
      ip_address VARCHAR(45) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_ip_created (ip_address, created_at DESC)
    )
  `);
	await query(`
    CREATE TABLE IF NOT EXISTS media_library (
      id VARCHAR(100) PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      type VARCHAR(100) NOT NULL,
      size INT DEFAULT 0,
      url TEXT NOT NULL,
      usage_type VARCHAR(50) DEFAULT 'other',
      alt_text TEXT,
      description TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
	await safeCreateIndex("articles", "idx_articles_cat_created", "category, created_at DESC");
	await safeCreateIndex("articles", "idx_articles_status_created", "status, created_at DESC");
	await safeCreateIndex("articles", "idx_articles_hero_flags", "featured, status, date DESC");
	await safeCreateIndex("comments", "idx_comments_article_status", "article_slug, status, created_at DESC");
	await safeCreateIndex("inbox_requests", "idx_inbox_created", "created_at DESC");
	try {
		await query("CREATE INDEX idx_status_date ON articles (status, date)");
	} catch (e) {
		if (!e.message?.includes("Duplicate key name")) console.error(e);
	}
	try {
		await query("CREATE INDEX idx_category_status_date ON articles (category, status, date)");
	} catch (e) {
		if (!e.message?.includes("Duplicate key name")) console.error(e);
	}
	await safeCreateIndex("articles", "idx_articles_status_date_id", "status, date DESC, id DESC");
	await safeCreateIndex("articles", "idx_articles_journalist_status", "journalistId, status");
	await safeCreateIndex("profiles", "idx_profiles_phone", "phone");
	await safeCreateIndex("profiles", "idx_profiles_points", "points DESC");
	await safeCreateIndex("profiles", "idx_profiles_active_points", "active, points DESC");
	await safeCreateIndex("sessions", "idx_sessions_expires", "expires_at");
	await safeCreateIndex("sessions", "idx_sessions_user_expires", "user_id, expires_at");
	await safeCreateIndex("user_roles", "idx_user_roles_role_user", "role, user_id");
}
//#endregion
export { createTablesAndIndexes };

//# sourceMappingURL=schema.server-8Pnhrka_.js.map