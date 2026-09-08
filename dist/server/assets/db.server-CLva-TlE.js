import mysql from "mysql2/promise";
import crypto from "crypto";
import fs from "fs";
import path from "path";
//#region src/assets/hero-markets.jpg
var hero_markets_default = "/assets/hero-markets-DB4EwqS2.jpg";
//#endregion
//#region src/assets/news-fed.jpg
var news_fed_default = "/assets/news-fed-Cxc8tAd1.jpg";
//#endregion
//#region src/assets/news-tech.jpg
var news_tech_default = "/assets/news-tech-DSI69y4S.jpg";
//#endregion
//#region src/assets/news-oil.jpg
var news_oil_default = "/assets/news-oil-B0rQ1qKw.jpg";
//#endregion
//#region src/assets/news-crypto.jpg
var news_crypto_default = "/assets/news-crypto-BRlcotGr.jpg";
//#endregion
//#region src/assets/news-wallstreet.jpg
var news_wallstreet_default = "/assets/news-wallstreet-DLLG50Kr.jpg";
//#endregion
//#region src/assets/news-trade.jpg
var news_trade_default = "/assets/news-trade-DSkY3eE1.jpg";
//#endregion
//#region src/lib/news-data.ts
var tickers = [
	{
		sym: "NIFTY 50",
		val: "24,320.15",
		chg: "+0.52%",
		up: true
	},
	{
		sym: "SENSEX",
		val: "80,120.45",
		chg: "+0.48%",
		up: true
	},
	{
		sym: "NIFTY BANK",
		val: "52,450.80",
		chg: "+0.65%",
		up: true
	},
	{
		sym: "USD/INR",
		val: "83.54",
		chg: "-0.05%",
		up: false
	},
	{
		sym: "EUR/INR",
		val: "91.02",
		chg: "+0.12%",
		up: true
	},
	{
		sym: "GOLD (MCX)",
		val: "₹72,450",
		chg: "+0.78%",
		up: true
	},
	{
		sym: "SILVER (MCX)",
		val: "₹88,210",
		chg: "+1.05%",
		up: true
	},
	{
		sym: "CRUDE OIL (MCX)",
		val: "₹6,520",
		chg: "-1.12%",
		up: false
	},
	{
		sym: "BSE MIDCAP",
		val: "47,150.30",
		chg: "+0.35%",
		up: true
	},
	{
		sym: "BSE SMALLCAP",
		val: "53,890.90",
		chg: "+0.28%",
		up: true
	}
];
var sections = [
	"Northeast",
	"Breaking",
	"Global",
	"Politics",
	"Business",
	"Crime",
	"Tech",
	"Sports",
	"Opinion",
	"Others"
];
var lead = {
	kicker: "Breaking · Federal Reserve",
	title: "Fed Signals Pause on Cuts as Inflation Reignites in Core Services",
	dek: "Chair Powell delivered the central bank's most hawkish message of the year, warning that the path to 2% has become 'bumpier than anticipated' and that further easing is no longer a foregone conclusion for the first half.",
	author: "By Marcus Hale",
	time: "12 min ago",
	img: hero_markets_default,
	views: 184320
};
var top = [
	{
		kicker: "Wall Street",
		title: "Goldman, JPMorgan Beat as Trading Desks Rake in Record Quarter",
		time: "34 min ago",
		img: news_wallstreet_default,
		views: 42118
	},
	{
		kicker: "Energy",
		title: "Brent Slides Below $74 as OPEC+ Eyes Earlier Supply Return",
		time: "1 hr ago",
		img: news_oil_default,
		views: 28940
	},
	{
		kicker: "Crypto",
		title: "Bitcoin Tags Fresh High as Spot ETF Inflows Cross $50B Mark",
		time: "2 hr ago",
		img: news_crypto_default,
		views: 91207
	}
];
var grid = [
	{
		kicker: "Technology",
		title: "Nvidia's Blackwell Surge Pushes Hyperscaler Capex to $320B",
		excerpt: "Demand for AI accelerators is reshaping the data-center supply chain heading into 2026.",
		img: news_tech_default,
		author: "Priya Anand",
		views: 61204
	},
	{
		kicker: "Trade",
		title: "Pacific Container Rates Whipsaw on Tariff Truce Speculation",
		excerpt: "Shippers are racing to front-load Q1 orders before policy clarity arrives from Washington.",
		img: news_trade_default,
		author: "Diego Ruiz",
		views: 17880
	},
	{
		kicker: "Policy",
		title: "ECB Holds, but Lagarde Opens Door to a Spring Move",
		excerpt: "Frankfurt's dovish pivot lifted European banks while euro weakness extended a third week.",
		img: news_fed_default,
		author: "Sofia Albrecht",
		views: 23541
	}
];
function formatViews(n) {
	if (n >= 1e6) return (n / 1e6).toFixed(1).replace(/\.0$/, "") + "M";
	if (n >= 1e3) return (n / 1e3).toFixed(1).replace(/\.0$/, "") + "K";
	return String(n);
}
function viewsFor(seed) {
	let h = 0;
	for (let i = 0; i < seed.length; i++) h = h * 31 + seed.charCodeAt(i) | 0;
	return 1200 + Math.abs(h) % 48e4;
}
function slugify(input) {
	return input.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "").slice(0, 80) || "sample";
}
var LOCAL_IMAGES = [
	hero_markets_default,
	news_fed_default,
	news_tech_default,
	news_oil_default,
	news_crypto_default,
	news_wallstreet_default,
	news_trade_default
];
function getArticleImage(img, index) {
	if (!img || img === "/placeholder.svg" || img.includes("placeholder")) return LOCAL_IMAGES[(index ?? 0) % LOCAL_IMAGES.length];
	return img;
}
//#endregion
//#region src/lib/db.server.ts
function hashPassword(password, salt) {
	const activeSalt = salt || "northeast_timeline_salt_2026";
	const iterations = salt ? 1e5 : 1e3;
	return crypto.pbkdf2Sync(password, activeSalt, iterations, 64, "sha512").toString("hex");
}
var pool = null;
var dbConfig = null;
function loadDbConfig() {
	try {
		const configPath = path.resolve(process.cwd(), "db-config.json");
		if (fs.existsSync(configPath)) {
			const data = fs.readFileSync(configPath, "utf-8");
			dbConfig = JSON.parse(data);
			return dbConfig;
		}
		dbConfig = null;
		return null;
	} catch (err) {
		console.error("[MySQL] Error reading db-config.json:", err);
		dbConfig = null;
		return null;
	}
}
function getPool() {
	if (globalThis.__mysqlPool) return globalThis.__mysqlPool;
	if (pool) return pool;
	const config = loadDbConfig();
	const host = config?.host || process.env.MYSQL_HOST || "127.0.0.1";
	const port = Number(config?.port || process.env.MYSQL_PORT) || 3306;
	const user = config?.user || process.env.MYSQL_USER || "root";
	const password = config?.password !== void 0 ? config.password : process.env.MYSQL_PASSWORD || "";
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
		idleTimeout: 3e4,
		connectTimeout: 4e3,
		enableKeepAlive: true,
		queueLimit: 0
	});
	globalThis.__mysqlPool = pool;
	return pool;
}
async function closePool() {
	if (globalThis.__mysqlPool) {
		try {
			await globalThis.__mysqlPool.end();
		} catch {}
		globalThis.__mysqlPool = void 0;
	}
	if (pool) {
		try {
			await pool.end();
		} catch {}
		pool = null;
	}
	dbConfig = null;
}
async function query(sql, params = []) {
	if (!loadDbConfig()) return [];
	const [results] = await getPool().query(sql, params);
	return results;
}
async function safeCreateIndex(tableName, indexName, columnsSql) {
	try {
		if ((await query(`SHOW INDEX FROM \`${tableName}\` WHERE Key_name = ?`, [indexName])).length === 0) await query(`CREATE INDEX \`${indexName}\` ON \`${tableName}\`(${columnsSql})`);
	} catch (err) {}
}
async function testDbConnection(config) {
	let tempConn;
	try {
		tempConn = await mysql.createConnection({
			host: config.host || "127.0.0.1",
			port: Number(config.port) || 3306,
			user: config.user || "root",
			password: config.password !== void 0 ? config.password : "",
			connectTimeout: 4e3
		});
		const dbName = config.database || "today_tripura";
		try {
			await tempConn.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``);
		} catch (createErr) {
			console.warn("[MySQL] CREATE DATABASE notice:", createErr?.message);
		}
		await tempConn.query(`USE \`${dbName}\``);
		return true;
	} catch (err) {
		console.error("[MySQL] Test connection / DB verification failed:", err.message);
		throw new Error(err.message || "Failed to connect to MySQL server");
	} finally {
		if (tempConn) await tempConn.end();
	}
}
async function initializeDatabase(customAdmin) {
	console.log("[MySQL] Starting database initialization...");
	if (!loadDbConfig() && !process.env.MYSQL_HOST) {
		console.log("[MySQL] Database is not configured yet. Setup Wizard is required.");
		return;
	}
	try {
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
		await query(`
      CREATE TABLE IF NOT EXISTS categories (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) UNIQUE NOT NULL,
        slug VARCHAR(100) UNIQUE NOT NULL,
        description TEXT,
        meta_title VARCHAR(255),
        meta_description TEXT,
        show_in_header BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
		try {
			await query(`ALTER TABLE categories ADD COLUMN show_in_header BOOLEAN DEFAULT FALSE`);
		} catch (err) {
			if (!err.message.includes("Duplicate column name")) console.error("Migration error adding show_in_header:", err.message);
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
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
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
		await safeCreateIndex("articles", "idx_articles_cat_created", "category_slug, created_at DESC");
		await safeCreateIndex("articles", "idx_articles_status_created", "status, created_at DESC");
		await safeCreateIndex("articles", "idx_articles_hero_flags", "is_editors_pick, is_breaking, created_at DESC");
		await safeCreateIndex("comments", "idx_comments_article_status", "article_slug, status, created_at DESC");
		await safeCreateIndex("inbox_requests", "idx_inbox_created", "created_at DESC");
		if (customAdmin) {
			console.log("[MySQL] Ensuring custom administrator account exists...");
			const existing = await query("SELECT id FROM users WHERE email = ?", [customAdmin.email]);
			if (existing.length > 0) {
				const adminId = existing[0].id;
				await query("UPDATE users SET password_hash = ?, salt = ?, display_name = ? WHERE id = ?", [
					customAdmin.passwordHash,
					customAdmin.salt,
					customAdmin.displayName,
					adminId
				]);
				if ((await query("SELECT id FROM user_roles WHERE user_id = ? AND role = 'admin'", [adminId])).length === 0) await query("INSERT INTO user_roles (id, user_id, role) VALUES (?, ?, 'admin')", [crypto.randomUUID(), adminId]);
				await query("UPDATE profiles SET display_name = ? WHERE id = ?", [customAdmin.displayName, adminId]);
			} else {
				const adminId = crypto.randomUUID();
				await query("INSERT INTO users (id, email, password_hash, salt, display_name) VALUES (?, ?, ?, ?, ?)", [
					adminId,
					customAdmin.email,
					customAdmin.passwordHash,
					customAdmin.salt,
					customAdmin.displayName
				]);
				await query("INSERT INTO user_roles (id, user_id, role) VALUES (?, ?, 'admin')", [crypto.randomUUID(), adminId]);
				await query("INSERT INTO profiles (id, public_user_id, display_name, email, active) VALUES (?, ?, ?, ?, ?)", [
					adminId,
					String(Math.floor(1e9 + Math.random() * 9e9)),
					customAdmin.displayName,
					customAdmin.email,
					true
				]);
			}
		} else if ((await query("SELECT id FROM users LIMIT 1")).length === 0) {
			console.log("[MySQL] Seeding default administrator user...");
			const adminId = crypto.randomUUID();
			const adminEmail = "admin@demo.com";
			const adminSalt = crypto.randomBytes(16).toString("hex");
			const adminPassHash = hashPassword("Demo@Admin#2026NE", adminSalt);
			const adminName = "Demo Admin";
			await query("INSERT INTO users (id, email, password_hash, salt, display_name) VALUES (?, ?, ?, ?, ?)", [
				adminId,
				adminEmail,
				adminPassHash,
				adminSalt,
				adminName
			]);
			await query("INSERT INTO user_roles (id, user_id, role) VALUES (?, ?, 'admin')", [crypto.randomUUID(), adminId]);
			await query("INSERT INTO profiles (id, public_user_id, display_name, email, active) VALUES (?, ?, ?, ?, ?)", [
				adminId,
				"1000000000",
				adminName,
				adminEmail,
				true
			]);
		}
		if ((await query("SELECT id FROM categories LIMIT 1")).length === 0) {
			console.log("[MySQL] Seeding default categories...");
			for (const item of [
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
			]) await query("INSERT IGNORE INTO categories (name, slug, description, meta_title, meta_description) VALUES (?, ?, ?, ?, ?)", [
				item.name,
				slugify(item.name),
				`Latest ${item.name} news, analysis and updates.`,
				item.title,
				item.metaDesc
			]);
		}
		if ((await query("SELECT id FROM tags LIMIT 1")).length === 0) {
			console.log("[MySQL] Seeding default tags...");
			for (const tName of [
				"markets",
				"fed",
				"inflation",
				"startups",
				"finance",
				"cricket",
				"policy",
				"climate"
			]) await query("INSERT IGNORE INTO tags (name, slug) VALUES (?, ?)", [tName, slugify(tName)]);
		}
		if ((await query("SELECT id FROM comments LIMIT 1")).length === 0) {
			console.log("[MySQL] Seeding default comments...");
			for (const c of [
				{
					article_slug: "fed-signals-pause-on-cuts",
					article_title: "Fed Signals Pause on Cuts",
					user_name: "Aarav Sharma",
					user_email: "aarav@example.com",
					body: "Powell's tone clearly shifted this time. Markets will reprice.",
					status: "Approved"
				},
				{
					article_slug: "bitcoin-tags-fresh-high",
					article_title: "Bitcoin Tags Fresh High",
					user_name: "Lina Park",
					user_email: "lina@example.com",
					body: "ETF flows finally absorbing miner supply.",
					status: "Pending"
				},
				{
					article_slug: "goldman-jpmorgan-beat",
					article_title: "Goldman, JPMorgan Beat",
					user_name: "spammer42",
					user_email: "spam@bad.io",
					body: "Buy now cheap stock get rich quick!!!",
					status: "Spam"
				},
				{
					article_slug: "pacific-container-rates-whipsaw",
					article_title: "Pacific Container Rates Whipsaw",
					user_name: "Maya Iyer",
					user_email: "maya@example.com",
					body: "Front-loading already visible at LA ports.",
					status: "Approved"
				},
				{
					article_slug: "brent-slides-below-74",
					article_title: "Brent Slides Below $74",
					user_name: "Ben Cole",
					user_email: "ben@example.com",
					body: "OPEC+ unity is fragile this time around.",
					status: "Pending"
				}
			]) await query("INSERT INTO comments (article_slug, article_title, user_name, user_email, body, status) VALUES (?, ?, ?, ?, ?, ?)", [
				c.article_slug,
				c.article_title,
				c.user_name,
				c.user_email,
				c.body,
				c.status
			]);
		}
		if ((await query("SELECT id FROM profiles WHERE journalist_id IS NOT NULL LIMIT 1")).length === 0) {
			console.log("[MySQL] Seeding default journalists...");
			for (const j of [{
				name: "John Doe",
				email: "john@demo.com",
				jId: "JID-1001"
			}, {
				name: "Jane Smith",
				email: "jane@demo.com",
				jId: "JID-1002"
			}]) {
				const uId = crypto.randomUUID();
				const pubId = String(Math.floor(1e9 + Math.random() * 9e9));
				await query("INSERT INTO users (id, email, password_hash, display_name) VALUES (?, ?, ?, ?)", [
					uId,
					j.email,
					"demo_hash",
					j.name
				]);
				await query("INSERT INTO user_roles (id, user_id, role) VALUES (?, ?, 'journalist')", [crypto.randomUUID(), uId]);
				await query("INSERT INTO profiles (id, public_user_id, display_name, email, active, journalist_id) VALUES (?, ?, ?, ?, ?, ?)", [
					uId,
					pubId,
					j.name,
					j.email,
					true,
					j.jId
				]);
			}
		}
		if ((await query("SELECT id FROM articles LIMIT 1")).length === 0) {
			console.log("[MySQL] Seeding default articles...");
			for (const a of [
				{
					title: "Global Markets Rally As Tech Stocks Surge",
					cat: "Global",
					excerpt: "Technology stocks led a global market rally today, lifting major indexes to record highs. Investors cheered stronger-than-expected earnings reports from leading technology companies.",
					author: "John Doe"
				},
				{
					title: "New Policy Announced for Renewable Energy",
					cat: "Politics",
					excerpt: "The government has unveiled a comprehensive new policy aimed at dramatically increasing the country's reliance on renewable energy sources over the next decade.",
					author: "Jane Smith"
				},
				{
					title: "Local Team Wins Championship In Thrilling Match",
					cat: "Sports",
					excerpt: "In a stunning upset, the local underdogs secured the championship title with a last-minute goal, sending thousands of fans into wild celebrations across the city.",
					author: "John Doe"
				},
				{
					title: "Breakthrough In Artificial Intelligence Research",
					cat: "Tech",
					excerpt: "Scientists have announced a major breakthrough in AI research, demonstrating a new model capable of solving complex mathematical problems previously thought unsolvable by machines.",
					author: "Jane Smith"
				},
				{
					title: "Economy Shows Signs Of Strong Recovery",
					cat: "Business",
					excerpt: "Recent economic indicators suggest a robust recovery is underway, with consumer spending hitting an all-time high and unemployment numbers continuing their steady decline.",
					author: "John Doe"
				}
			]) await query("INSERT INTO articles (title, slug, category, author, excerpt, status, date) VALUES (?, ?, ?, ?, ?, 'Published', NOW())", [
				a.title,
				slugify(a.title),
				a.cat,
				a.author,
				a.excerpt
			]);
		}
		try {
			await query("CREATE INDEX idx_status_date ON articles (status, date)");
			console.log("[MySQL] Added index idx_status_date to articles");
		} catch (e) {
			if (!e.message.includes("Duplicate key name")) console.error(e);
		}
		try {
			await query("CREATE INDEX idx_category_status_date ON articles (category, status, date)");
			console.log("[MySQL] Added index idx_category_status_date to articles");
		} catch (e) {
			if (!e.message.includes("Duplicate key name")) console.error(e);
		}
		console.log("[MySQL] Database initialization completed successfully!");
	} catch (err) {
		console.error("[MySQL] Failed to initialize database:", err.message);
		throw err;
	}
}
if (loadDbConfig()) initializeDatabase().catch((err) => {
	console.log("[MySQL] Auto-initialization skipped or waiting for setup:", err.message);
});
//#endregion
export { hero_markets_default as C, news_fed_default as S, news_trade_default as _, loadDbConfig as a, news_oil_default as b, formatViews as c, lead as d, sections as f, viewsFor as g, top as h, initializeDatabase as i, getArticleImage as l, tickers as m, getPool as n, query as o, slugify as p, hashPassword as r, testDbConnection as s, closePool as t, grid as u, news_wallstreet_default as v, news_tech_default as x, news_crypto_default as y };
