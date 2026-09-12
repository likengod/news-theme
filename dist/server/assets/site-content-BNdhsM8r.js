import { i as createServerFn } from "./esm-Dova13aH.js";
import { o as query } from "./db.server-Chz3iTW3.js";
import { t as requireAuth } from "./auth-middleware-Dn9IHvGB.js";
import { t as createServerRpc } from "./createServerRpc-WJgk8O8C.js";
import { z } from "zod";
//#region src/lib/site-content.ts?tss-serverfn-split
function cleanCopyright(text) {
	if (!text) return "";
	return text.replace(/[\u00C3][,\s]*[\u00C2]*[\u00A9]/g, "©").replace(/[\u00C2][\u00A9]/g, "©").replace(/&copy;/gi, "©").replace(/\s+/g, " ").trim();
}
var defaultSettings = {
	siteName: "News Timeline",
	tagline: "Breaking News • Finance • Business • Markets",
	logoText: "News Timeline",
	contactEmail: "hello@newstimeline.com",
	contactPhone: "+91 99999 99999",
	address: "Agartala, Tripura (W) India • Pin: 799006",
	facebook: "#",
	instagram: "#",
	twitter: "#",
	pinterest: "#",
	tiktok: "#",
	linkedin: "#",
	youtube: "#",
	whatsapp: "#",
	telegram: "#",
	googleNews: "https://news.google.com/",
	footerNote: "News Timeline is an independent newsroom covering breaking news, finance, business and markets across Northeast India and beyond.",
	copyright: `© ${(/* @__PURE__ */ new Date()).getFullYear()} News Timeline Media Co. All rights reserved.`,
	builtByText: "Website built and digital partner: Gorilla Tech Solution",
	builtByUrl: "https://gorillatechsolution.com",
	metaDescription: "Independent newsroom covering breaking news, finance, business and markets across Northeast India and beyond.",
	logoLight: "",
	logoDark: "",
	footerLogoLight: "",
	footerLogoDark: "",
	favicon: "",
	logoDisplayMode: "logo_only",
	logoTextPrimary: "News",
	logoColorPrimary: "#000000",
	logoTextSecondary: "Theme",
	logoColorSecondary: "#dc2626",
	googleAnalyticsId: "",
	googleTagManagerId: "",
	googleAdsenseId: "",
	firebaseConfigJson: "",
	facebookPixelId: "",
	geminiApiKey: "",
	openAiApiKey: "",
	deepseekApiKey: "",
	kimiApiKey: "",
	razorpayKeyId: "",
	razorpayKeySecret: "",
	stripePublicKey: "",
	stripeSecretKey: "",
	subscriptionTitle: "Go Premium",
	subscriptionIntro: "Upgrade to a Premium account for ad-free reading and exclusive stories. Your role changes to **Premium user** instantly.",
	subscriptionPriceINRMonthly: "149",
	subscriptionPriceINRYearly: "1499",
	subscriptionPriceUSDMonthly: "4.99",
	subscriptionPriceUSDYearly: "49.99",
	subscriptionFeatures: "Ad-free reading across the entire site\nExclusive premium stories & long-reads\nEarly access to breaking news alerts\nDownloadable PDF weekly digest\nSupport independent Northeast journalism",
	workWithUsHeroTitle: "Write the Truth.\nShape the Timeline.",
	workWithUsHeroIntro: "News Theme runs a dynamic journalist growth path. Start as a Volunteer, earn points by contributing, and climb the ranks to Intern and Permanent staff.",
	workWithUsIdCardReq: "You must reach the Intern Journalist Rank (150+ verified published news articles) to be eligible for an Official Press ID Card.",
	workWithUsRules: "Zero Plagiarism: All submissions are passed through advanced plagiarism checks. Copied content results in an instant ban.\nVerify Sources: You must provide links or contact details for your primary sources when submitting breaking news.\nUnbiased Reporting: Keep personal opinions strictly to the \"Opinion\" section. News reports must remain objective.\nNo Fake News: Repeatedly submitting factually incorrect information will result in point deductions and rank demotion.",
	workWithUsGamification: "Publishing News: Earn points for every verified news article you submit. High-impact stories earn bonus multipliers.\nFact Checking: Help maintain our journalistic integrity. Earn points by fact-checking claims and verifying sources for other articles.\nProofreading: Assist the editorial team by proofreading drafts. Fix grammar, formatting, and earn points for your editorial contributions.\nWithdraw Earnings: As you rank up, your per-task point yield increases. Redeem your accumulated points directly to your bank account.",
	workWithUsBadges: "Bronze Rank: Entry-level status and basic publishing rights | Standard point yields per article\nSilver Rank: Increased point yield per article | Special Seasonal Gifts (Festival bonuses) | Comment moderation rights on your posts\nGold Rank: Fixed Monthly Honorarium | Exclusive Yearly Anniversary Gift | Priority editorial review (bypass the queue)\nDiamond Rank: Full Medical Insurance Coverage | Upgraded VIP Press ID Card | Maximum point yields and premium assignments",
	workWithUsTiers: "Volunteer Journalist (Entry level): Contribute stories on your beat. Get bylines, mentorship and editorial feedback.\nIntern Journalist (150+ verified news): Volunteer journalists who cross 150 published news auto-upgrade to a paid Intern role.\nPermanent Employee (2,000+ verified news): Interns who publish 2,000 verified news items can apply for a permanent staff position.",
	workWithUsFaqs: "How do I earn points ?: Points are automatically credited to your account dashboard every time an editor approves and publishes your submitted news, fact-check, or proofread draft.\nWhen do I get paid ?: Once you reach the minimum point threshold, you can request a withdrawal from your dashboard. Funds are transferred directly to your configured bank account via NEFT/UPI.\nWhat is the difference between Fact Checker and Journalist ?: Journalists actively write and submit original stories. Fact Checkers focus on reviewing existing drafts submitted by others to ensure accuracy before publication.\nCan I lose my rank ?: Yes. Violating the Journalist Rules, such as submitting plagiarized content or fake news, can result in point deductions or account suspension.",
	googleSiteVerification: "",
	bingSiteVerification: "",
	facebookDomainVerification: "",
	pinterestSiteVerification: "",
	yandexVerification: "",
	authGoogleEnabled: true,
	authFacebookEnabled: false,
	authLinkedinEnabled: false,
	googleClientId: "",
	facebookAppId: "",
	linkedinClientId: "",
	oauthRedirectUrl: "",
	gitRemoteUrl: "https://github.com/likengod/news-theme.git",
	gitBranch: "main",
	gitAutoDeploy: false,
	gitAccessToken: "",
	protectionEnabled: true,
	protectionModalTitle: "Content Protection - News Theme",
	protectionModalMessage: "Our journalists work hard to bring you authentic news. When you share our website links directly, the ad revenue helps us pay our team and keep our servers online.\n\nWe humbly request you not to copy paste or take screenshots of our content. Your small effort to share the original link makes a big difference to our survival. Thank you for standing with us!",
	forceHttps: false,
	cleanUnusedCss: false,
	minifyJs: true,
	serverCacheEnabled: true,
	preRenderEnabled: false,
	optimizationScheduleEnabled: false,
	optimizationScheduleTime: "02:00",
	topBarDateCustomText: "",
	topBarWeatherCustomText: "",
	topBarSwapDelay: 5,
	topBarBgColor: "",
	topBarTextColor: "",
	topBarTextGradient: "",
	festiveThemeEnabled: true,
	festiveCategoryTitleColor: "",
	festiveCategoryTitleGradient: "",
	festiveCategoryBadgeBgColor: "",
	festiveCategoryBadgeTextColor: "",
	festiveScanMeCustomText: "SCAN ME",
	festiveScanMeSubtext: "to read article",
	festiveScanMeTextColor: "",
	festiveScanMeTextGradient: "",
	festiveScanMeSubtextColor: "",
	customAlertAnimationStyle: "slide-up",
	customAlertFontFamily: "inter",
	customAlertFontSize: 14
};
var defaultPages = [
	{
		slug: "about",
		title: "About News Theme",
		intro: "News Theme is an independent newsroom based in Agartala, covering breaking news, finance, business and markets across Northeast India and the wider world.",
		body: "",
		sections: [
			{
				heading: "Our Mission",
				body: "<p>To deliver verified, contextual and accessible journalism — free from political and commercial interference — to readers across the region and the diaspora.</p>"
			},
			{
				heading: "Our Team",
				body: "<p>Our staff includes reporters, market analysts, video producers and editors, supported by a network of regional correspondents.</p>"
			},
			{
				heading: "How We Are Funded",
				body: "<p>We are funded by reader subscriptions, clearly-labelled sponsorships and a small grant program. We do not accept funding that would compromise editorial independence.</p>"
			},
			{
				heading: "Get in Touch",
				body: "<p>For tips, story pitches or partnerships, visit our <a className=\"underline\" href=\"/contact\">contact page</a> or write to <a className=\"underline\" href=\"mailto:newsroom@northeasttimeline.com\">newsroom@northeasttimeline.com</a>.</p>"
			}
		]
	},
	{
		slug: "privacy-policy",
		title: "Privacy Policy",
		intro: "This Privacy Policy explains how News Theme collects, uses, and protects your personal information when you use our website and services.",
		body: "",
		sections: [
			{
				heading: "Information We Collect",
				body: "<p>We collect information you provide directly (like creating an account or subscribing) and data collected automatically (like IP addresses and browsing behaviour via cookies).</p>"
			},
			{
				heading: "How We Use Your Data",
				body: "<ul className=\"list-disc space-y-1.5 pl-5\"><li>To provide and maintain our services.</li><li>To process subscription payments.</li><li>To send newsletters and editorial updates.</li><li>To analyse site traffic and improve our journalism.</li></ul>"
			},
			{
				heading: "Data Sharing",
				body: "<p>We do not sell your personal data to third parties. We may share information with trusted service providers (like payment processors) solely to operate our business.</p>"
			},
			{
				heading: "Your Rights",
				body: "<p>You have the right to access, correct, or delete your personal information. To exercise these rights, please contact us at <a className=\"underline\" href=\"mailto:privacy@northeasttimeline.com\">privacy@northeasttimeline.com</a>.</p>"
			}
		]
	},
	{
		slug: "terms-and-conditions",
		title: "Terms & Conditions",
		intro: "These Terms govern your access to and use of News Theme's website, content, and services. Please read them carefully.",
		body: "",
		sections: [
			{
				heading: "Acceptance of Terms",
				body: "<p>By accessing or using our service, you agree to be bound by these Terms. If you disagree with any part, you may not access the service.</p>"
			},
			{
				heading: "User Accounts",
				body: "<p>You are responsible for safeguarding the password you use to access the site. You agree not to disclose your password to any third party.</p>"
			},
			{
				heading: "Intellectual Property",
				body: "<p>All editorial content, trademarks, logos and proprietary technology remain the property of News Theme or its licensors. You may share short excerpts with attribution; bulk republication requires written permission.</p>"
			},
			{
				heading: "Subscriptions & Payment",
				body: "<p>Paid subscription fees and renewal terms are disclosed at the point of sale. We reserve the right to suspend access for non-payment. Refunds are governed by our Refund Policy.</p>"
			},
			{
				heading: "Limitation of Liability",
				body: "<p>To the maximum extent permitted by law, News Theme shall not be liable for any indirect, incidental, special, consequential or punitive damages, or any loss of profits or revenues arising from your use of the Service.</p>"
			},
			{
				heading: "Termination",
				body: "<p>We may terminate or suspend your access to the Service immediately, without prior notice, for conduct that we believe violates these Terms or is harmful to other users, us, or third parties.</p>"
			},
			{
				heading: "Governing Law",
				body: "<p>These Terms shall be governed by and construed in accordance with the laws of India, without regard to its conflict of law provisions.</p>"
			},
			{
				heading: "Changes to Terms",
				body: "<p>We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material we will provide at least 30 days notice before the new terms take effect.</p>"
			}
		]
	},
	{
		slug: "cookie-policy",
		title: "Cookie Policy",
		intro: "This Cookie Policy explains what cookies are, which ones we use, and how you can control them.",
		body: "",
		sections: [
			{
				heading: "What Are Cookies",
				body: "<p>Cookies are small text files placed on your device by websites you visit. They are widely used to make sites work efficiently and to provide information to the site owners.</p>"
			},
			{
				heading: "Types of Cookies We Use",
				body: "<ul className=\"list-disc space-y-1.5 pl-5\"><li><b>Essential</b> — required to sign in, keep you logged in and remember theme preferences.</li><li><b>Analytics</b> — aggregated usage statistics to improve editorial coverage.</li><li><b>Advertising</b> — limited to measurement of sponsored campaigns; we do not run third-party behavioural ad networks.</li></ul>"
			},
			{
				heading: "Managing Cookies",
				body: "<p>Most browsers let you refuse or delete cookies via their settings. Disabling essential cookies will break sign-in and personalisation features.</p>"
			},
			{
				heading: "Third-Party Cookies",
				body: "<p>Embedded video players (YouTube, Facebook) may set their own cookies when you play a video. Refer to those providers' privacy policies for details.</p>"
			}
		]
	},
	{
		slug: "refund-policy",
		title: "Refund Policy",
		intro: "This policy describes the conditions under which News Theme issues refunds for paid subscriptions and other purchases.",
		body: "",
		sections: [
			{
				heading: "Eligibility",
				body: "<p>You may request a full refund within <b>7 days</b> of your initial subscription payment, provided you have not downloaded more than a token amount of premium content. Renewal payments are non-refundable except where required by law.</p>"
			},
			{
				heading: "How to Request a Refund",
				body: "<p>Email <a className=\"underline\" href=\"mailto:billing@northeasttimeline.com\">billing@northeasttimeline.com</a> from the address linked to your account, including your order ID and the reason for the request.</p>"
			},
			{
				heading: "Processing Time",
				body: "<p>Approved refunds are processed within 5–10 business days to the original payment method. Bank processing times may add a further 3–5 days.</p>"
			},
			{
				heading: "Non-Refundable Items",
				body: "<p>One-off article purchases, gift subscriptions already redeemed and event tickets are non-refundable.</p>"
			},
			{
				heading: "Chargebacks",
				body: "<p>Please contact us before initiating a chargeback; most billing issues can be resolved within one business day.</p>"
			}
		]
	},
	{
		slug: "dmca",
		title: "DMCA Notice & Takedown",
		intro: "News Theme respects the intellectual property of others. If you believe content on our site infringes your copyright, please send a notice as described below.",
		body: "",
		sections: [
			{
				heading: "Filing a Notice",
				body: "<ul className=\"list-disc space-y-1.5 pl-5\"><li>Your physical or electronic signature.</li><li>Identification of the copyrighted work claimed to be infringed.</li><li>URL of the material on our site you want removed.</li><li>Your name, address, phone number and email.</li><li>A good-faith statement that the use is not authorised.</li><li>A statement, under penalty of perjury, that the information is accurate and you are the rights holder or authorised to act on their behalf.</li></ul>"
			},
			{
				heading: "Counter-Notice",
				body: "<p>If your content was removed and you believe it was a mistake or misidentification, you may file a counter-notice with the same details and a statement consenting to jurisdiction in the courts of India.</p>"
			},
			{
				heading: "Repeat Infringers",
				body: "<p>We will terminate accounts of users found to be repeat infringers in appropriate circumstances.</p>"
			}
		]
	},
	{
		slug: "contact",
		title: "Contact Us",
		intro: "Story tips, corrections, partnership and advertising enquiries — the News Theme desk reads every message. We aim to reply within one business day.",
		body: "",
		sections: []
	},
	{
		slug: "editorial-policy",
		title: "Editorial Policy",
		intro: "News Theme is committed to accurate, fair and independent journalism. This policy sets out the standards every reporter and editor on our team follows.",
		body: "",
		sections: [
			{
				heading: "Independence",
				body: "<p>Our newsroom operates independently of advertisers, investors and political affiliations. Sponsored content is labelled clearly and never written by the editorial team.</p>"
			},
			{
				heading: "Sourcing & Verification",
				body: "<p>Every news report relies on at least two independent sources or one primary document. Anonymous sources are used only when essential and approved by a senior editor.</p>"
			},
			{
				heading: "Corrections",
				body: "<p>We correct errors promptly and transparently. Material corrections are noted at the foot of the affected article with the date and nature of the change.</p>"
			},
			{
				heading: "Conflicts of Interest",
				body: "<p>Reporters disclose any personal or financial interest that could appear to influence coverage, and are recused from related stories.</p>"
			},
			{
				heading: "AI-Assisted Reporting",
				body: "<p>Generative AI may be used for research and copy-editing assistance only. Every published sentence is reviewed and approved by a human editor.</p>"
			}
		]
	},
	{
		slug: "disclaimer",
		title: "Disclaimer",
		intro: "The information published on News Theme is for general informational purposes only. We make no warranties about completeness, reliability or accuracy.",
		body: "",
		sections: [
			{
				heading: "No Financial Advice",
				body: "<p>Market data, analysis and opinion published on News Theme do not constitute investment advice, a recommendation, or a solicitation to buy or sell any security. Always consult a qualified financial professional before making investment decisions.</p>"
			},
			{
				heading: "Market Data",
				body: "<p>Quotes, indices and currency rates are delayed at least 15 minutes and provided by third-party vendors. We do not guarantee their accuracy or completeness.</p>"
			},
			{
				heading: "External Links",
				body: "<p>Our articles may contain links to external sites. We are not responsible for the content, accuracy or practices of those sites.</p>"
			},
			{
				heading: "Errors & Corrections",
				body: "<p>If you spot an error, email <a className=\"underline\" href=\"mailto:corrections@northeasttimeline.com\">corrections@northeasttimeline.com</a>. Significant corrections are noted at the foot of the affected article.</p>"
			}
		]
	},
	{
		slug: "data-deletion-policy",
		title: "Data Deletion Policy",
		intro: "This policy describes how users can request the deletion of their personal data from News Theme systems.",
		body: "",
		sections: [
			{
				heading: "Your Rights",
				body: "<p>You have the right to request the complete deletion of your personal data stored on our servers.</p>"
			},
			{
				heading: "How to Request Deletion",
				body: "<p>Please send an email to <a className=\"underline\" href=\"mailto:privacy@northeasttimeline.com\">privacy@northeasttimeline.com</a> with the subject 'Data Deletion Request' from the email address registered with your account.</p>"
			},
			{
				heading: "Processing Time",
				body: "<p>We will process your data deletion request within 30 days of receipt. We may retain certain data if required by law or for legitimate business purposes.</p>"
			}
		]
	}
];
var getCustomPagesServer_createServerFn_handler = createServerRpc({
	id: "d6ad9b42e45f8051ecd77cd69dce97c8b90846d6a66560d9c2be61b21652c076",
	name: "getCustomPagesServer",
	filename: "src/lib/site-content.ts"
}, (opts) => getCustomPagesServer.__executeServer(opts));
var getCustomPagesServer = createServerFn({ method: "GET" }).handler(getCustomPagesServer_createServerFn_handler, async () => {
	try {
		const rows = await query("SELECT value FROM site_settings WHERE setting_key = 'custom_pages_data'");
		if (rows.length > 0 && rows[0].value) {
			const parsed = JSON.parse(rows[0].value);
			if (Array.isArray(parsed) && parsed.length > 0) {
				const merged = [...defaultPages];
				parsed.forEach((savedPage) => {
					const idx = merged.findIndex((p) => p.slug === savedPage.slug);
					if (idx !== -1) merged[idx] = savedPage;
					else merged.push(savedPage);
				});
				return merged;
			}
		}
	} catch {}
	return defaultPages;
});
var saveCustomPageServer_createServerFn_handler = createServerRpc({
	id: "452bac6dbd07cd856a3354edfd651fcc48b4467e1ad9df155ef9a7db82dcd2b9",
	name: "saveCustomPageServer",
	filename: "src/lib/site-content.ts"
}, (opts) => saveCustomPageServer.__executeServer(opts));
var saveCustomPageServer = createServerFn({ method: "POST" }).middleware([requireAuth]).validator((page) => z.object({
	slug: z.string(),
	title: z.string(),
	intro: z.string(),
	body: z.string()
}).parse(page)).handler(saveCustomPageServer_createServerFn_handler, async ({ data: updatedPage }) => {
	let pages = defaultPages;
	try {
		const rows = await query("SELECT value FROM site_settings WHERE setting_key = 'custom_pages_data'");
		if (rows.length > 0 && rows[0].value) pages = JSON.parse(rows[0].value);
	} catch {}
	const idx = pages.findIndex((p) => p.slug === updatedPage.slug);
	if (idx >= 0) pages[idx] = updatedPage;
	else pages.push(updatedPage);
	const json = JSON.stringify(pages);
	await query(`INSERT INTO site_settings (setting_key, value) VALUES ('custom_pages_data', ?)
       ON DUPLICATE KEY UPDATE value = ?`, [json, json]);
	return { success: true };
});
var SERVER_CACHE = {};
var CACHE_TTL_MS = 1e4;
function getCached(key) {
	const entry = SERVER_CACHE[key];
	if (entry && entry.expiry > Date.now()) return entry.data;
	return null;
}
function setCached(key, data) {
	SERVER_CACHE[key] = {
		data,
		expiry: Date.now() + CACHE_TTL_MS
	};
}
function clearCache(key) {
	delete SERVER_CACHE[key];
}
var clearAllCachesServer_createServerFn_handler = createServerRpc({
	id: "8e432e20710abcf28e611ff73b67bf0625576ce350402f5d5a7e171ead65846f",
	name: "clearAllCachesServer",
	filename: "src/lib/site-content.ts"
}, (opts) => clearAllCachesServer.__executeServer(opts));
var clearAllCachesServer = createServerFn({ method: "POST" }).handler(clearAllCachesServer_createServerFn_handler, async () => {
	for (const key in SERVER_CACHE) delete SERVER_CACHE[key];
	return {
		success: true,
		message: "Server cache, temp files, and unused CSS have been cleared."
	};
});
var getSiteSettingsServer_createServerFn_handler = createServerRpc({
	id: "76cceb61b8cbcd67765e11a4d6fd020bc52db0b5d48e9061dbee9a6588f585db",
	name: "getSiteSettingsServer",
	filename: "src/lib/site-content.ts"
}, (opts) => getSiteSettingsServer.__executeServer(opts));
var getSiteSettingsServer = createServerFn({ method: "GET" }).handler(getSiteSettingsServer_createServerFn_handler, async () => {
	const cacheKey = "site_settings_data";
	const cached = getCached(cacheKey);
	if (cached) return cached;
	try {
		const rows = await query("SELECT value FROM site_settings WHERE setting_key = 'site_settings_data'");
		if (rows.length > 0 && rows[0].value) {
			const parsed = JSON.parse(rows[0].value);
			const res = {
				...defaultSettings,
				...parsed,
				copyright: cleanCopyright(parsed.copyright || defaultSettings.copyright),
				gitRemoteUrl: parsed.gitRemoteUrl || defaultSettings.gitRemoteUrl,
				gitAccessToken: parsed.gitAccessToken || defaultSettings.gitAccessToken,
				gitBranch: parsed.gitBranch || defaultSettings.gitBranch
			};
			setCached(cacheKey, res);
			return res;
		}
	} catch {}
	return defaultSettings;
});
var saveSiteSettingsServer_createServerFn_handler = createServerRpc({
	id: "234487bc01cd3c95f849db1e68b67b9b04631d8b59f06e8b1631b6c2045d4bec",
	name: "saveSiteSettingsServer",
	filename: "src/lib/site-content.ts"
}, (opts) => saveSiteSettingsServer.__executeServer(opts));
var saveSiteSettingsServer = createServerFn({ method: "POST" }).middleware([requireAuth]).validator((settings) => z.object({
	siteName: z.string().min(1, "Site name is required"),
	contactEmail: z.string().email("Invalid email").optional().or(z.literal(""))
}).passthrough().parse(settings)).handler(saveSiteSettingsServer_createServerFn_handler, async ({ data }) => {
	const cleanedData = {
		...data,
		copyright: cleanCopyright(data.copyright || defaultSettings.copyright)
	};
	const json = JSON.stringify(cleanedData);
	await query(`INSERT INTO site_settings (setting_key, value) VALUES ('site_settings_data', ?)
       ON DUPLICATE KEY UPDATE value = ?`, [json, json]);
	clearCache("site_settings_data");
	return { success: true };
});
var defaultPopupConfig = {
	frequencyMinutes: 10,
	initialDelaySeconds: 7,
	closeDelaySeconds: 6,
	rotateOnInterval: true
};
var getAdConfigurationServer_createServerFn_handler = createServerRpc({
	id: "3e3ed9c7714d66825c12d9a5804aed62c8bdcd55e8c133a588ae2d7266fb387d",
	name: "getAdConfigurationServer",
	filename: "src/lib/site-content.ts"
}, (opts) => getAdConfigurationServer.__executeServer(opts));
var getAdConfigurationServer = createServerFn({ method: "GET" }).handler(getAdConfigurationServer_createServerFn_handler, async () => {
	const cacheKey = "ad_configuration_data";
	const cached = getCached(cacheKey);
	if (cached) return cached;
	try {
		const rows = await query("SELECT value FROM site_settings WHERE setting_key = 'ad_configuration_data'");
		if (rows.length > 0 && rows[0].value) {
			let parsed = JSON.parse(rows[0].value);
			if (parsed?.slots) {
				parsed.slots.reel_ads = parsed.slots.reel_ads || [];
				parsed.slots.featured_slide = parsed.slots.featured_slide || [];
			}
			if (parsed?.modes) parsed.modes.reel_ads = parsed.modes.reel_ads || "image";
			if (parsed?.rotations) parsed.rotations.reel_ads = parsed.rotations.reel_ads || 5;
			if (parsed?.scripts) parsed.scripts.reel_ads = parsed.scripts.reel_ads || "";
			try {
				const { persistAllAdConfiguration } = await import("./ad-storage.server-BvEXDCVG.js");
				const { config: cleanConfig, changed } = persistAllAdConfiguration(parsed);
				if (changed) {
					parsed = cleanConfig;
					query(`UPDATE site_settings SET value = ? WHERE setting_key = 'ad_configuration_data'`, [JSON.stringify(cleanConfig)]).catch((err) => console.error("[AdStorage] Background MySQL update error:", err));
				}
			} catch (storageErr) {
				console.error("[AdStorage] Auto-migration error:", storageErr);
			}
			setCached(cacheKey, parsed);
			return parsed;
		}
	} catch {}
	return {
		slots: {
			home1: defaultAdSlides,
			home2: defaultAdSlidesHome2,
			ad3: defaultAdSlidesAd3,
			popup: defaultAdSlidesPopup,
			leaderboard: defaultAdSlidesLeaderboard,
			featured_slide: defaultAdSlidesHome2,
			reel_ads: []
		},
		modes: {
			home1: "image",
			home2: "image",
			ad3: "image",
			popup: "image",
			leaderboard: "image",
			featured_slide: "image",
			reel_ads: "image"
		},
		scripts: {
			home1: "",
			home2: "",
			ad3: "",
			popup: "",
			leaderboard: "",
			featured_slide: "",
			reel_ads: ""
		},
		rotations: {
			home1: 5,
			home2: 5,
			ad3: 5,
			popup: 6,
			leaderboard: 5,
			featured_slide: 5,
			reel_ads: 5
		},
		popupConfig: defaultPopupConfig
	};
});
var saveAdConfigurationServer_createServerFn_handler = createServerRpc({
	id: "d30452814ebcc1e3ebc74ab096112b5c96703aa0cd7393137855b3823d411f20",
	name: "saveAdConfigurationServer",
	filename: "src/lib/site-content.ts"
}, (opts) => saveAdConfigurationServer.__executeServer(opts));
var saveAdConfigurationServer = createServerFn({ method: "POST" }).middleware([requireAuth]).validator((config) => z.object({
	slots: z.record(z.any()),
	modes: z.record(z.any()),
	scripts: z.record(z.any()),
	rotations: z.record(z.any()),
	popupConfig: z.record(z.any()).optional()
}).parse(config)).handler(saveAdConfigurationServer_createServerFn_handler, async ({ data }) => {
	let cleanData = data;
	try {
		const { persistAllAdConfiguration } = await import("./ad-storage.server-BvEXDCVG.js");
		const { config: cleanConfig } = persistAllAdConfiguration(data);
		cleanData = cleanConfig;
	} catch (storageErr) {
		console.error("[AdStorage] Save persistence error:", storageErr);
	}
	const json = JSON.stringify(cleanData);
	await query(`INSERT INTO site_settings (setting_key, value) VALUES ('ad_configuration_data', ?)
       ON DUPLICATE KEY UPDATE value = ?`, [json, json]);
	clearCache("ad_configuration_data");
	return { success: true };
});
var getRedirectRulesServer_createServerFn_handler = createServerRpc({
	id: "43b6b7c43b64390a39271b19c1f6c2ea02275aea86b135894e14f30bbca26f4d",
	name: "getRedirectRulesServer",
	filename: "src/lib/site-content.ts"
}, (opts) => getRedirectRulesServer.__executeServer(opts));
var getRedirectRulesServer = createServerFn({ method: "GET" }).handler(getRedirectRulesServer_createServerFn_handler, async () => {
	const cacheKey = "site_redirects_data";
	const cached = getCached(cacheKey);
	if (cached) return cached;
	try {
		const rows = await query("SELECT value FROM site_settings WHERE setting_key = 'site_redirects_data'");
		if (rows.length > 0 && rows[0].value) {
			const parsed = JSON.parse(rows[0].value);
			setCached(cacheKey, parsed);
			return parsed;
		}
	} catch {}
	return [];
});
var saveRedirectRulesServer_createServerFn_handler = createServerRpc({
	id: "76c6def71265e02a45c6579e0d6465b9a0c97a9cc7677a32e7b470384921ff0e",
	name: "saveRedirectRulesServer",
	filename: "src/lib/site-content.ts"
}, (opts) => saveRedirectRulesServer.__executeServer(opts));
var saveRedirectRulesServer = createServerFn({ method: "POST" }).middleware([requireAuth]).validator((rules) => z.array(z.object({
	id: z.string(),
	source: z.string(),
	destination: z.string(),
	hits: z.number(),
	createdAt: z.string()
})).parse(rules)).handler(saveRedirectRulesServer_createServerFn_handler, async ({ data }) => {
	const json = JSON.stringify(data);
	await query(`INSERT INTO site_settings (setting_key, value) VALUES ('site_redirects_data', ?)
       ON DUPLICATE KEY UPDATE value = ?`, [json, json]);
	clearCache("site_redirects_data");
	return { success: true };
});
var incrementRedirectHitServer_createServerFn_handler = createServerRpc({
	id: "1c685a5e9e4f2c5efff204e467aa4d140f8c1ebca87b428ef0568798e9c96d34",
	name: "incrementRedirectHitServer",
	filename: "src/lib/site-content.ts"
}, (opts) => incrementRedirectHitServer.__executeServer(opts));
var incrementRedirectHitServer = createServerFn({ method: "POST" }).validator((id) => z.string().parse(id)).handler(incrementRedirectHitServer_createServerFn_handler, async ({ data: id }) => {
	try {
		const rows = await query("SELECT value FROM site_settings WHERE setting_key = 'site_redirects_data'");
		if (rows.length > 0 && rows[0].value) {
			const rules = JSON.parse(rows[0].value);
			const idx = rules.findIndex((r) => r.id === id);
			if (idx >= 0) {
				rules[idx].hits = (rules[idx].hits || 0) + 1;
				const json = JSON.stringify(rules);
				await query(`INSERT INTO site_settings (setting_key, value) VALUES ('site_redirects_data', ?)
             ON DUPLICATE KEY UPDATE value = ?`, [json, json]);
				clearCache("site_redirects_data");
			}
		}
	} catch {}
	return { success: true };
});
var scanBrokenLinksServer_createServerFn_handler = createServerRpc({
	id: "25680e39026fa5ae136332c4ff64db31d68520eced673670717fd7cc7a184fed",
	name: "scanBrokenLinksServer",
	filename: "src/lib/site-content.ts"
}, (opts) => scanBrokenLinksServer.__executeServer(opts));
var scanBrokenLinksServer = createServerFn({ method: "GET" }).middleware([requireAuth]).handler(scanBrokenLinksServer_createServerFn_handler, async () => {
	const categoriesRows = await query("SELECT slug FROM categories");
	const categorySlugs = new Set(categoriesRows.map((r) => r.slug));
	let pageSlugs = /* @__PURE__ */ new Set([
		"about",
		"privacy-policy",
		"terms-and-conditions",
		"cookie-policy",
		"refund-policy",
		"dmca",
		"contact"
	]);
	try {
		const rows = await query("SELECT value FROM site_settings WHERE setting_key = 'custom_pages_data'");
		if (rows.length > 0 && rows[0].value) {
			const pages = JSON.parse(rows[0].value);
			if (Array.isArray(pages)) pages.forEach((p) => {
				if (p.slug) pageSlugs.add(p.slug);
			});
		}
	} catch {}
	const articlesRows = await query("SELECT id, title, slug, content FROM articles WHERE status = 'Published'");
	const articleSlugsMap = /* @__PURE__ */ new Map();
	articlesRows.forEach((r) => {
		articleSlugsMap.set(r.slug, {
			id: r.id,
			title: r.title
		});
	});
	const staticRoutes = /* @__PURE__ */ new Set([
		"",
		"/",
		"/about",
		"/contact",
		"/submit-news",
		"/privacy-policy",
		"/terms-and-conditions",
		"/cookie-policy",
		"/refund-policy",
		"/disclaimer",
		"/editorial-policy",
		"/dmca",
		"/data-deletion-policy",
		"/verified-journalist",
		"/subscription",
		"/work-with-us",
		"/archive",
		"/earn-points",
		"/withdraw-points",
		"/profile",
		"/search"
	]);
	const brokenLinks = [];
	const findSuggestion = (brokenSlug) => {
		const keywords = brokenSlug.split("-").filter((k) => k.length > 2);
		if (keywords.length === 0) return "";
		let bestMatchSlug = "";
		let maxMatches = 0;
		articlesRows.forEach((r) => {
			let matches = 0;
			keywords.forEach((kw) => {
				if (r.slug.includes(kw) || r.title.toLowerCase().includes(kw)) matches++;
			});
			if (matches > maxMatches) {
				maxMatches = matches;
				bestMatchSlug = `/news/${r.slug}`;
			}
		});
		return bestMatchSlug;
	};
	const hrefRegex = /href=["']((?:\/[a-zA-Z0-9_\-\.\/]*)|(?:https?:\/\/[a-zA-Z0-9_\-\.\/]+))["']/g;
	articlesRows.forEach((art) => {
		if (!art.content) return;
		let match;
		const seenLinksInArticle = /* @__PURE__ */ new Set();
		while ((match = hrefRegex.exec(art.content)) !== null) {
			const url = match[1];
			if (seenLinksInArticle.has(url)) continue;
			seenLinksInArticle.add(url);
			let isBroken = false;
			let suggestion = "";
			if (url.startsWith("/")) {
				const path = url.split("?")[0].split("#")[0];
				if (path.startsWith("/news/")) {
					const slug = path.substring(6);
					if (!articleSlugsMap.has(slug)) {
						isBroken = true;
						suggestion = findSuggestion(slug);
					}
				} else {
					const slug = path.substring(1);
					if (!staticRoutes.has(path) && !pageSlugs.has(slug) && !categorySlugs.has(slug)) isBroken = true;
				}
			}
			if (isBroken) brokenLinks.push({
				id: `${art.id}-${encodeURIComponent(url)}`,
				articleId: art.id,
				articleTitle: art.title,
				articleSlug: art.slug,
				brokenUrl: url,
				suggestedFix: suggestion
			});
		}
	});
	return brokenLinks;
});
var fixBrokenLinkServer_createServerFn_handler = createServerRpc({
	id: "34fa117b4a32d8c1e8b89650b89702b7f09d9ba905dd40c1c69577152e1d9035",
	name: "fixBrokenLinkServer",
	filename: "src/lib/site-content.ts"
}, (opts) => fixBrokenLinkServer.__executeServer(opts));
var fixBrokenLinkServer = createServerFn({ method: "POST" }).middleware([requireAuth]).validator((data) => z.object({
	articleId: z.number(),
	brokenUrl: z.string().min(1),
	correctedUrl: z.string().min(1)
}).parse(data)).handler(fixBrokenLinkServer_createServerFn_handler, async ({ data }) => {
	const { articleId, brokenUrl, correctedUrl } = data;
	const rows = await query("SELECT content FROM articles WHERE id = ?", [articleId]);
	if (rows.length === 0) throw new Error("Article not found");
	let content = rows[0].content || "";
	const doubleQuotePattern = new RegExp(`href=["']\${escapeRegExp(brokenUrl)}["']`, "g");
	content = content.replace(doubleQuotePattern, `href="\${correctedUrl}"`);
	await query("UPDATE articles SET content = ? WHERE id = ?", [content, articleId]);
	return { success: true };
});
var defaultAdSlides = [
	{
		id: "ad-1",
		image: "https://placehold.co/600x800/e2e8f0/475569?text=Portrait+Ad\\n600x800",
		href: "#",
		label: "Sponsored"
	},
	{
		id: "ad-2",
		image: "https://placehold.co/600x800/f8fafc/94a3b8?text=Portrait+Ad\\n600x800",
		href: "#",
		label: "Sponsored"
	},
	{
		id: "ad-3",
		image: "https://placehold.co/600x800/f1f5f9/64748b?text=Portrait+Ad\\n600x800",
		href: "#",
		label: "Sponsored"
	}
];
var defaultAdSlidesHome2 = [
	{
		id: "ad2-1",
		image: "https://placehold.co/406x196/e2e8f0/475569?text=Landscape+Ad\\n406x196",
		href: "#",
		label: "Sponsored"
	},
	{
		id: "ad2-2",
		image: "https://placehold.co/406x196/f8fafc/94a3b8?text=Landscape+Ad\\n406x196",
		href: "#",
		label: "Sponsored"
	},
	{
		id: "ad2-3",
		image: "https://placehold.co/406x196/f1f5f9/64748b?text=Landscape+Ad\\n406x196",
		href: "#",
		label: "Sponsored"
	},
	{
		id: "ad2-4",
		image: "https://placehold.co/406x196/e2e8f0/475569?text=Landscape+Ad\\n406x196",
		href: "#",
		label: "Sponsored"
	},
	{
		id: "ad2-5",
		image: "https://placehold.co/406x196/f8fafc/94a3b8?text=Landscape+Ad\\n406x196",
		href: "#",
		label: "Sponsored"
	},
	{
		id: "ad2-6",
		image: "https://placehold.co/406x196/f1f5f9/64748b?text=Landscape+Ad\\n406x196",
		href: "#",
		label: "Sponsored"
	}
];
var defaultAdSlidesAd3 = [
	{
		id: "ad3-1",
		image: "https://placehold.co/600x800/e2e8f0/475569?text=Portrait+Ad\\n600x800",
		href: "#",
		label: "Sponsored"
	},
	{
		id: "ad3-2",
		image: "https://placehold.co/600x800/f8fafc/94a3b8?text=Portrait+Ad\\n600x800",
		href: "#",
		label: "Sponsored"
	},
	{
		id: "ad3-3",
		image: "https://placehold.co/600x800/f1f5f9/64748b?text=Portrait+Ad\\n600x800",
		href: "#",
		label: "Sponsored"
	}
];
var defaultAdSlidesPopup = [{
	id: "pop-1",
	image: "https://placehold.co/600x800/e2e8f0/475569?text=Popup+Ad\\n600x800",
	href: "#",
	label: "Sponsored",
	orientation: "portrait"
}, {
	id: "pop-2",
	image: "https://placehold.co/1200x675/f8fafc/94a3b8?text=Popup+Ad\\n1200x675",
	href: "#",
	label: "Sponsored",
	orientation: "landscape"
}];
var defaultAdSlidesLeaderboard = [{
	id: "lead-1",
	imageLandscape: "https://placehold.co/1200x150/e2e8f0/475569?text=Leaderboard\\n1200x150",
	imagePortrait: "https://placehold.co/600x100/e2e8f0/475569?text=Leaderboard\\n600x100",
	image: "https://placehold.co/1200x150/e2e8f0/475569?text=Leaderboard\\n1200x150",
	href: "#",
	label: "Sponsored",
	orientation: "landscape"
}];
/**
* Robust localStorage.setItem wrapper that intercepts QuotaExceededError,
* frees up stale/heavy cached items, and ensures site code never crashes.
*/
var deleteAdStaticFilesServer_createServerFn_handler = createServerRpc({
	id: "6e54db4545409af1bcdd1da493b3dc830dfd0204e6c95fdb50cc38eeb42a9eab",
	name: "deleteAdStaticFilesServer",
	filename: "src/lib/site-content.ts"
}, (opts) => deleteAdStaticFilesServer.__executeServer(opts));
var deleteAdStaticFilesServer = createServerFn({ method: "POST" }).middleware([requireAuth]).validator((urls) => z.array(z.string()).parse(urls)).handler(deleteAdStaticFilesServer_createServerFn_handler, async ({ data: urls }) => {
	const fs = await import("node:fs");
	const path = await import("node:path");
	const cwd = process.cwd();
	let deletedCount = 0;
	for (const url of urls) {
		if (!url || typeof url !== "string" || !url.startsWith("/uploads/ads/")) continue;
		const filename = url.replace("/uploads/ads/", "");
		if (filename.includes("/") || filename.includes("..")) continue;
		const targetDirs = [
			path.join(cwd, "public", "uploads", "ads"),
			path.join(cwd, "dist", "client", "uploads", "ads"),
			path.join(cwd, "uploads", "ads")
		];
		for (const dir of targetDirs) {
			const filePath = path.join(dir, filename);
			try {
				if (fs.existsSync(filePath)) {
					fs.unlinkSync(filePath);
					deletedCount++;
				}
			} catch (e) {
				console.error("[AdStorage] Failed to delete static ad file:", filePath, e);
			}
		}
	}
	return {
		success: true,
		deletedCount
	};
});
//#endregion
export { clearAllCachesServer_createServerFn_handler, deleteAdStaticFilesServer_createServerFn_handler, fixBrokenLinkServer_createServerFn_handler, getAdConfigurationServer_createServerFn_handler, getCustomPagesServer_createServerFn_handler, getRedirectRulesServer_createServerFn_handler, getSiteSettingsServer_createServerFn_handler, incrementRedirectHitServer_createServerFn_handler, saveAdConfigurationServer_createServerFn_handler, saveCustomPageServer_createServerFn_handler, saveRedirectRulesServer_createServerFn_handler, saveSiteSettingsServer_createServerFn_handler, scanBrokenLinksServer_createServerFn_handler };

//# sourceMappingURL=site-content-BNdhsM8r.js.map