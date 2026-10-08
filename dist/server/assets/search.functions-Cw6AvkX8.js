import { r as createServerFn } from "./esm-B50dUWcE.js";
import { s as query } from "./db.server-txgvnrPd.js";
import { a as isEnterprisePlusLicense, i as isEnterpriseLicense, r as getSiteSettingsServer } from "./site-settings-BaWWTfJz.js";
import { b as getCustomPagesServer, t as PUBLIC_CARD_COLUMNS } from "./articles.functions-DZqDGoT5.js";
import { t as createServerRpc } from "./createServerRpc-BbGffMfs.js";
//#region src/lib/search.functions.ts?tss-serverfn-split
var SYSTEM_FEATURE_PAGES = [
	{
		slug: "fact-check",
		title: "Live News & Claim Fact-Check Scanner",
		url: "/fact-check",
		intro: "Scan news URLs or viral claims to verify authenticity against accredited global fact-checking registries and Google Fact Check.",
		sectionBadge: "Feature",
		keywords: [
			"fact check",
			"factcheck",
			"verification",
			"claim",
			"scanner",
			"truth",
			"fake news"
		],
		isAllowed: (s) => isEnterpriseLicense(s)
	},
	{
		slug: "verified-journalist",
		title: "Verified Journalist Directory & Public Verification Desk",
		url: "/verified-journalist",
		intro: "Verify credentialed press cards, accredited reporters, and field journalists with cryptographic authenticity.",
		sectionBadge: "Feature",
		keywords: [
			"journalist",
			"reporter",
			"press card",
			"press",
			"verification",
			"accreditation"
		],
		isAllowed: (s) => isEnterpriseLicense(s)
	},
	{
		slug: "apply-journalist",
		title: "Apply for Verified Journalist Accreditation",
		url: "/apply-journalist",
		intro: "Submit press credentials, ID proof, and portfolio for editorial verified reporter badge.",
		sectionBadge: "Feature",
		keywords: [
			"apply journalist",
			"press badge",
			"journalist registration"
		],
		isAllowed: (s) => isEnterpriseLicense(s)
	},
	{
		slug: "earn-points",
		title: "Earn Points & Wallet Rewards",
		url: "/earn-points",
		intro: "Engage with news stories, follow verified channels, and complete daily tasks to earn redeemable wallet points.",
		sectionBadge: "Feature",
		keywords: [
			"earn points",
			"rewards",
			"wallet",
			"coins",
			"tasks",
			"points"
		],
		isAllowed: (s) => isEnterprisePlusLicense(s)
	},
	{
		slug: "withdraw-points",
		title: "Redeem & Withdraw Reward Points",
		url: "/withdraw-points",
		intro: "Redeem your earned wallet points for rewards, gift coupons, and payouts.",
		sectionBadge: "Feature",
		keywords: [
			"withdraw points",
			"redeem points",
			"wallet payout"
		],
		isAllowed: (s) => isEnterprisePlusLicense(s)
	},
	{
		slug: "event",
		title: "Special Events & Live Coverage Desk",
		url: "/event",
		intro: "Live and upcoming event schedules, regional summits, and exclusive live video coverage.",
		sectionBadge: "Feature",
		keywords: [
			"event",
			"events",
			"summit",
			"live event",
			"programme"
		],
		isAllowed: (s) => s?.eventFooterLinkEnabled !== false
	},
	{
		slug: "subscription",
		title: "Subscription Plans & Reader Membership",
		url: "/subscription",
		intro: "Support independent journalism, access subscriber-exclusive editions, read ad-free, and unlock premium analysis.",
		sectionBadge: "Service",
		keywords: [
			"subscription",
			"pricing",
			"membership",
			"subscribe",
			"premium",
			"plan"
		],
		isAllowed: () => true
	},
	{
		slug: "work-with-us",
		title: "Work With Us / Newsroom Careers",
		url: "/work-with-us",
		intro: "Join our award-winning editorial team. Explore opportunities for correspondents, video editors, and analysts.",
		sectionBadge: "Service",
		keywords: [
			"work with us",
			"careers",
			"jobs",
			"hiring",
			"opportunities"
		],
		isAllowed: () => true
	},
	{
		slug: "submit-news",
		title: "Submit News / Story Tips Desk",
		url: "/submit-news",
		intro: "Send breaking news tips, eyewitness photos, documents, and news leads securely to our editorial team.",
		sectionBadge: "Service",
		keywords: [
			"submit news",
			"send story",
			"tip off",
			"news tip",
			"leak"
		],
		isAllowed: () => true
	},
	{
		slug: "archive",
		title: "News Archive & Historical Editions",
		url: "/archive",
		intro: "Search through previous editions, historical reporting dates, and newspaper issues.",
		sectionBadge: "Media",
		keywords: [
			"archive",
			"old news",
			"past editions",
			"history",
			"records"
		],
		isAllowed: () => true
	},
	{
		slug: "reels",
		title: "Video Reels & Short Stories",
		url: "/reels",
		intro: "Watch fast-paced video summaries, vertical short reels, and multimedia highlights.",
		sectionBadge: "Media",
		keywords: [
			"reels",
			"shorts",
			"videos",
			"clips",
			"watch"
		],
		isAllowed: () => true
	}
];
/**
* Filter and resolve permitted pages respecting current site settings and license level.
*/
function getPermittedPages(customPages, settings) {
	const result = [];
	const handledSlugs = /* @__PURE__ */ new Set();
	for (const page of customPages) {
		if (!page.slug || handledSlugs.has(page.slug)) continue;
		const isPolicy = page.slug.includes("policy") || page.slug === "terms-and-conditions" || page.slug === "disclaimer" || page.slug === "dmca";
		let introSnippet = (page.intro || "").replace(/<[^>]+>/g, "").trim();
		if (!introSnippet && page.sections && page.sections.length > 0) introSnippet = (page.sections[0].body || "").replace(/<[^>]+>/g, "").slice(0, 160).trim();
		result.push({
			type: "page",
			slug: page.slug,
			title: page.title || page.slug,
			intro: introSnippet,
			url: `/${page.slug}`,
			sectionBadge: isPolicy ? "Policy" : "Page"
		});
		handledSlugs.add(page.slug);
	}
	for (const feat of SYSTEM_FEATURE_PAGES) {
		if (handledSlugs.has(feat.slug)) continue;
		if (!feat.isAllowed(settings)) continue;
		result.push({
			type: "page",
			slug: feat.slug,
			title: feat.title,
			intro: feat.intro,
			url: feat.url,
			sectionBadge: feat.sectionBadge
		});
		handledSlugs.add(feat.slug);
	}
	return result;
}
/**
* Unified Public Search: Queries Articles, Categories, and Pages simultaneously.
* Completely respects license and feature access rules.
*/
var searchUnifiedPublic_createServerFn_handler = createServerRpc({
	id: "d488038ced2e73b8f6cd9e5f3ea1b54a60b9ea67015257a80b813215d13ee50a",
	name: "searchUnifiedPublic",
	filename: "src/lib/search.functions.ts"
}, (opts) => searchUnifiedPublic.__executeServer(opts));
var searchUnifiedPublic = createServerFn({ method: "GET" }).validator((data) => data).handler(searchUnifiedPublic_createServerFn_handler, async ({ data }) => {
	const rawQ = (data.q || "").trim();
	const selectedCategory = data.category || "All";
	const page = Math.max(1, Number(data.page) || 1);
	const limit = Math.min(Math.max(1, Number(data.limit) || 12), 50);
	const tab = data.tab || "all";
	const offset = (page - 1) * limit;
	let settings = null;
	try {
		settings = await getSiteSettingsServer();
	} catch (err) {
		console.warn("[searchUnifiedPublic] Could not fetch site settings:", err);
	}
	let allCategoriesList = [];
	try {
		const catRows = await query("SELECT id, name, slug FROM categories ORDER BY sort_order ASC, name ASC");
		if (Array.isArray(catRows)) allCategoriesList = catRows.map((r) => ({
			id: Number(r.id),
			name: String(r.name),
			slug: String(r.slug)
		}));
	} catch (err) {
		console.warn("[searchUnifiedPublic] Could not fetch categories list:", err);
	}
	let matchedCategories = [];
	if (rawQ) try {
		const catSql = `
          SELECT c.id, c.name, c.slug, c.description, COUNT(a.id) as count
          FROM categories c
          LEFT JOIN articles a ON (
            c.name = a.category OR 
            a.category LIKE CONCAT(c.name, ',%') OR 
            a.category LIKE CONCAT('%, ', c.name) OR 
            a.category LIKE CONCAT('%, ', c.name, ',%') OR
            a.category LIKE CONCAT('%,', c.name) OR 
            a.category LIKE CONCAT('%,', c.name, ',%')
          ) AND (a.status = 'Published' OR a.status = 'Scheduled') AND a.date <= NOW()
          WHERE (c.name LIKE ? OR c.slug LIKE ? OR c.description LIKE ?)
          GROUP BY c.id
          ORDER BY (c.name LIKE ?) DESC, c.sort_order ASC, c.name ASC
          LIMIT 10
        `;
		const searchTerm = `%${rawQ}%`;
		const catRows = await query(catSql, [
			searchTerm,
			searchTerm,
			searchTerm,
			`${rawQ}%`
		]);
		if (Array.isArray(catRows)) matchedCategories = catRows.map((r) => ({
			type: "category",
			id: Number(r.id),
			name: String(r.name),
			slug: String(r.slug),
			description: String(r.description || ""),
			count: Number(r.count || 0),
			url: `/${r.slug}`
		}));
	} catch (err) {
		console.warn("[searchUnifiedPublic] Category search error:", err);
	}
	let matchedPages = [];
	try {
		const permittedPages = getPermittedPages(await getCustomPagesServer(), settings);
		if (rawQ) {
			const lowerQ = rawQ.toLowerCase();
			matchedPages = permittedPages.filter((p) => {
				const matchTitle = p.title.toLowerCase().includes(lowerQ);
				const matchSlug = p.slug.toLowerCase().includes(lowerQ);
				const matchIntro = p.intro.toLowerCase().includes(lowerQ);
				const matchKeywords = SYSTEM_FEATURE_PAGES.find((f) => f.slug === p.slug)?.keywords.some((k) => k.toLowerCase().includes(lowerQ)) ?? false;
				return matchTitle || matchSlug || matchIntro || matchKeywords;
			});
		} else matchedPages = permittedPages.slice(0, 8);
	} catch (err) {
		console.warn("[searchUnifiedPublic] Page search error:", err);
	}
	let articlesItems = [];
	let totalArticles = 0;
	try {
		let countSql = "SELECT COUNT(*) as total FROM articles WHERE status = 'Published' AND date <= NOW()";
		let selectSql = `SELECT ${PUBLIC_CARD_COLUMNS} FROM articles WHERE status = 'Published' AND date <= NOW()`;
		const params = [];
		let filterSql = "";
		if (rawQ) {
			const tokens = rawQ.split(/\s+/).map((t) => t.trim()).filter(Boolean);
			if (tokens.length === 1) {
				const term = `%${tokens[0]}%`;
				filterSql += " AND (title LIKE ? OR excerpt LIKE ? OR content LIKE ? OR tags LIKE ? OR category LIKE ? OR author LIKE ?)";
				params.push(term, term, term, term, term, term);
			} else if (tokens.length > 1) {
				const tokenClauses = [];
				for (const token of tokens) {
					const term = `%${token}%`;
					tokenClauses.push("(title LIKE ? OR excerpt LIKE ? OR content LIKE ? OR tags LIKE ? OR category LIKE ? OR author LIKE ?)");
					params.push(term, term, term, term, term, term);
				}
				filterSql += ` AND (${tokenClauses.join(" AND ")})`;
			}
		}
		if (selectedCategory && selectedCategory !== "All") {
			filterSql += " AND (LOWER(category) = LOWER(?) OR category LIKE ? OR category LIKE ? OR category LIKE ? OR category LIKE ?)";
			params.push(selectedCategory, `${selectedCategory},%`, `%, ${selectedCategory}`, `%, ${selectedCategory},%`, `%,${selectedCategory},%`);
		}
		countSql += filterSql;
		selectSql += filterSql + " ORDER BY date DESC, id DESC LIMIT ? OFFSET ?";
		const countRes = await query(countSql, params);
		totalArticles = Number(countRes[0]?.total || 0);
		const selectParams = [
			...params,
			limit,
			offset
		];
		const rows = await query(selectSql, selectParams);
		if (Array.isArray(rows)) articlesItems = rows.map((r) => ({
			type: "article",
			id: Number(r.id),
			title: String(r.title || ""),
			slug: String(r.slug || ""),
			category: String(r.category || "General"),
			excerpt: String(r.excerpt || ""),
			featuredImage: r.featuredImage || void 0,
			date: r.date ? new Date(r.date).toISOString() : (/* @__PURE__ */ new Date()).toISOString(),
			views: Number(r.views || 0),
			author: r.author || void 0,
			tags: r.tags || void 0,
			featured: Boolean(r.featured)
		}));
	} catch (err) {
		console.warn("[searchUnifiedPublic] Article search error:", err);
	}
	return {
		query: rawQ,
		selectedCategory,
		activeTab: tab,
		articles: {
			items: articlesItems,
			total: totalArticles,
			totalPages: Math.max(1, Math.ceil(totalArticles / limit))
		},
		categories: matchedCategories,
		pages: matchedPages,
		allCategories: allCategoriesList,
		counts: {
			articles: totalArticles,
			categories: matchedCategories.length,
			pages: matchedPages.length,
			total: totalArticles + matchedCategories.length + matchedPages.length
		}
	};
});
var getQuickSearchPreview_createServerFn_handler = createServerRpc({
	id: "99fd2ba85784973fe0dd16ad799222be69351f8453511656d1545a65df4b8e79",
	name: "getQuickSearchPreview",
	filename: "src/lib/search.functions.ts"
}, (opts) => getQuickSearchPreview.__executeServer(opts));
var getQuickSearchPreview = createServerFn({ method: "GET" }).validator((data) => data).handler(getQuickSearchPreview_createServerFn_handler, async ({ data }) => {
	const rawQ = (data.q || "").trim();
	if (!rawQ || rawQ.length < 2) return {
		articles: [],
		categories: [],
		pages: []
	};
	let settings = null;
	try {
		settings = await getSiteSettingsServer();
	} catch {}
	let categories = [];
	try {
		const term = `%${rawQ}%`;
		const catRows = await query(`SELECT c.name, c.slug, COUNT(a.id) as count 
         FROM categories c
         LEFT JOIN articles a ON (c.name = a.category) AND a.status = 'Published'
         WHERE c.name LIKE ? OR c.slug LIKE ?
         GROUP BY c.id ORDER BY (c.name LIKE ?) DESC LIMIT 4`, [
			term,
			term,
			`${rawQ}%`
		]);
		if (Array.isArray(catRows)) categories = catRows.map((r) => ({
			name: String(r.name),
			slug: String(r.slug),
			count: Number(r.count || 0)
		}));
	} catch {}
	let pages = [];
	try {
		const permitted = getPermittedPages(await getCustomPagesServer(), settings);
		const lower = rawQ.toLowerCase();
		pages = permitted.filter((p) => {
			const matchTitle = p.title.toLowerCase().includes(lower);
			const matchKey = SYSTEM_FEATURE_PAGES.find((f) => f.slug === p.slug)?.keywords.some((k) => k.toLowerCase().includes(lower)) ?? false;
			return matchTitle || matchKey;
		}).slice(0, 4).map((p) => ({
			title: p.title,
			url: p.url,
			badge: p.sectionBadge
		}));
	} catch {}
	let articles = [];
	try {
		const term = `%${rawQ}%`;
		const rows = await query(`SELECT id, title, slug, category, date FROM articles 
         WHERE status = 'Published' AND date <= NOW() AND (title LIKE ? OR excerpt LIKE ? OR tags LIKE ?)
         ORDER BY date DESC LIMIT 4`, [
			term,
			term,
			term
		]);
		if (Array.isArray(rows)) articles = rows.map((r) => ({
			id: Number(r.id),
			title: String(r.title),
			slug: String(r.slug),
			category: String(r.category || "General"),
			date: r.date ? new Date(r.date).toISOString() : ""
		}));
	} catch {}
	return {
		articles,
		categories,
		pages
	};
});
//#endregion
export { getQuickSearchPreview_createServerFn_handler, searchUnifiedPublic_createServerFn_handler };

//# sourceMappingURL=search.functions-Cw6AvkX8.js.map