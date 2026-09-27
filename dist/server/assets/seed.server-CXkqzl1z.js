import { i as hashPassword } from "./db.server-BkLt9eJ8.js";
import { o as slugify } from "./news-data-CFwG4BZ_.js";
import crypto from "crypto";
//#region src/lib/db/seed.server.ts
async function seedDefaultData(query, customAdmin) {
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
}
//#endregion
export { seedDefaultData };

//# sourceMappingURL=seed.server-CXkqzl1z.js.map