import { r as createServerFn } from "./esm-B50dUWcE.js";
import { s as query } from "./db.server-BkLt9eJ8.js";
import { t as requireAdmin } from "./auth-middleware-BNC9rUei.js";
import { t as attachAuth } from "./auth-attacher-BdoDOpyC.js";
import { i as setCached, n as clearCache, r as getCached } from "./server-cache-DPX32xRl.js";
import { t as createServerRpc } from "./createServerRpc-BbGffMfs.js";
//#region src/lib/site-content/site-settings.ts?tss-serverfn-split
function cleanCopyright(text) {
	if (!text) return "";
	return text.replace(/â€”/g, "—").replace(/â€“/g, "–").replace(/Â©/g, "©").trim();
}
function normalizeLicenseType(type) {
	if (!type) return "";
	const trimmed = type.trim();
	const lower = trimmed.toLowerCase();
	if (lower === "enterprise+" || lower === "enterprise plus" || lower === "enterprise-plus") return "Enterprise Plus";
	return trimmed;
}
var defaultSettings = {
	siteName: "Today Tripura",
	tagline: "Your daily window to the world — unfiltered, insightful, and always ahead.",
	logoText: "Today Tripura",
	contactEmail: "contact@todaytripura.com",
	contactPhone: "+1 (555) 234-5678",
	address: "Agartala, Tripura, India",
	emailNewsTips: "tips@todaytripura.com",
	emailAdvertising: "ads@todaytripura.com",
	emailCareers: "careers@todaytripura.com",
	emailCorrections: "corrections@todaytripura.com",
	facebook: "https://facebook.com",
	instagram: "https://instagram.com",
	twitter: "https://twitter.com",
	pinterest: "https://pinterest.com",
	tiktok: "https://tiktok.com",
	linkedin: "https://linkedin.com",
	youtube: "https://youtube.com",
	whatsapp: "https://whatsapp.com",
	telegram: "https://telegram.org",
	googleNews: "https://news.google.com",
	footerNote: "The premier source for global reporting, cultural commentary, and critical analysis.",
	copyright: `© ${(/* @__PURE__ */ new Date()).getFullYear()} Today Tripura. All rights reserved.`,
	builtByText: "Built with Modern Web",
	builtByUrl: "https://example.com",
	metaDescription: "Tripura and Northeast breaking news, insightful analysis, and independent reporting.",
	logoLight: "",
	logoDark: "",
	footerLogoLight: "",
	footerLogoDark: "",
	favicon: "",
	logoDisplayMode: "both",
	logoTextPrimary: "Today",
	logoColorPrimary: "#000000",
	logoTextSecondary: "Tripura",
	logoColorSecondary: "#dc2626",
	googleAnalyticsId: "",
	googleTagManagerId: "",
	googleAdsenseId: "",
	facebookPixelId: "",
	firebaseConfigJson: "",
	geminiApiKey: "",
	openAiApiKey: "",
	deepseekApiKey: "",
	kimiApiKey: "",
	razorpayKeyId: "",
	razorpayKeySecret: "",
	stripePublicKey: "",
	stripeSecretKey: "",
	subscriptionTitle: "Support Independent Journalism",
	subscriptionIntro: "Choose a plan that fits your reading habits. Cancel anytime with zero hassle.",
	subscriptionPriceINRMonthly: "199",
	subscriptionPriceINRYearly: "1999",
	subscriptionPriceUSDMonthly: "4.99",
	subscriptionPriceUSDYearly: "49.99",
	subscriptionFeatures: "Ad-free reading experience\nUnlimited access to premium articles\nExclusive weekly newsletter\nEarly access to investigative reports\nDirect Q&A with our journalists",
	workWithUsHeroTitle: "Write for Us. Shape the Narrative.",
	workWithUsHeroIntro: "Join our network of independent journalists, field reporters, and columnists across the country.",
	workWithUsIdCardReq: "Government ID proof (Aadhaar / Voter ID / Passport)\nPress credentials or proof of past published work (optional but preferred)\nActive phone number linked with WhatsApp",
	workWithUsRules: "Accuracy above speed: Always verify facts with at least two independent sources before submission.\nOriginal reporting only: Plagiarism in any form results in immediate and permanent account suspension.\nFairness & neutrality: Disclose any potential conflict of interest to the editorial desk.",
	workWithUsGamification: "Publishing News: Earn points for every verified news article you submit. High-impact stories earn bonus multipliers.\nFact Checking: Help maintain our journalistic integrity. Earn points by fact-checking claims and verifying sources for other articles.\nProofreading: Assist the editorial team by proofreading drafts. Fix grammar, formatting, and earn points for your editorial contributions.\nWithdraw Earnings: As you rank up, your per-task point yield increases. Redeem your accumulated points directly to your bank account.",
	workWithUsBadges: "Bronze Rank: Entry-level status and basic publishing rights | Standard point yields per article\nSilver Rank: Increased point yield per article | Special Seasonal Gifts (Festival bonuses) | Comment moderation rights on your posts\nGold Rank: Fixed Monthly Honorarium | Exclusive Yearly Anniversary Gift | Priority editorial review (bypass the queue)\nDiamond Rank: Full Medical Insurance Coverage | Upgraded VIP Press ID Card | Maximum point yields and premium assignments",
	workWithUsTiers: "Volunteer Journalist (Entry level): Contribute stories on your beat. Get bylines, mentorship and editorial feedback.\nIntern Journalist (150+ verified news): Volunteer journalists who cross 150 published news auto-upgrade to a paid Intern role.\nPermanent Employee (2,000+ verified news): Interns who publish 2,000 verified news items can apply for a permanent staff position.",
	workWithUsFaqs: "How do I earn points ?: Points are automatically credited to your account dashboard every time an editor approves and publishes your submitted news, fact-check, or proofread draft.\nWhen do I get paid ?: Once you reach the minimum point threshold, you can request a withdrawal from your dashboard. Funds are transferred directly to your configured bank account via NEFT/UPI.\nWhat is the difference between Fact Checker and Journalist ?: Journalists actively write and submit original stories. Fact Checkers focus on reviewing existing drafts submitted by others to ensure accuracy before publication.\nCan I lose my rank ?: Yes. Violating the Journalist Rules, such as submitting plagiarized content or fake news, can result in point deductions or account suspension.",
	eventTitle: "শারদ সম্মান ২০২৬",
	eventSubtitle: "সেরা দুর্গোৎসব মূল্যায়ন ও শারদ সম্মাননা প্রতিযোগিতা",
	eventDescription: "আসন্ন শারদোৎসবে ত্রিপুরার ঐতিহ্যবাহী ও সর্বজনীন দুর্গাপূজা কমিটি এবং ক্লাবগুলোর জন্য বিশেষ শারদ সম্মান প্রতিযোগিতা। শ্রেষ্ঠ মণ্ডপসজ্জা, প্রতিমা নির্মাণ, আলোকসজ্জা ও পরিবেশবান্ধব ভাবনার ওপর ভিত্তি করে প্রদান করা হবে বিশেষ পুরস্কার ও স্মারক সম্মাননা।",
	eventDate: "শারদীয়া দুর্গাপূজা ২০২৬ (মহা পঞ্চমী থেকে বিজয়া দশমী)",
	eventLocation: "ত্রিপুরা ও সংলগ্ন অঞ্চল",
	eventPrizes: "১ম স্থান: ৫০,০০০ টাকা ও বিশেষ শারদ স্মারক\n২য় স্থান: ৩০,০০০ টাকা ও রৌপ্য স্মারক\n৩য় স্থান: ২০,০০০ টাকা ও সম্মাননা পত্র\nবিশেষ বিভাগ: সেরা আলোকসজ্জা, সেরা প্রতিমা ও সেরা শৃঙ্খলা পুরস্কার",
	eventCustomInputLabel: "ক্লাবের নাম / Club Name",
	eventButtonText: "নিবন্ধন করুন",
	eventButtonEnabled: true,
	eventFormEnabled: true,
	eventImageUrl: "",
	eventGreeting: "॥ শারদীয়া দুর্গোৎসব বিশেষ প্রতিযোগিতা ॥",
	eventSection1Divider: "॥ প্রতিযোগী সম্মান ও মূল্যায়ন ॥",
	eventPrizesTitle: "পুরস্কার ও সম্মাননা",
	eventCriteriaTitle: "মূল্যায়নের মূল ভিত্তি",
	eventCriteria: "ঐতিহ্য ও নান্দনিক মণ্ডপসজ্জা\nস্বকীয় প্রতিমা নির্মাণ ও শৈল্পিক ভাব\nপরিবেশবান্ধব উপাদান ও পরিচ্ছন্নতা\nশৃঙ্খলা, দর্শনার্থী নিরাপত্তা ও আলোকসজ্জা",
	eventGuidelinesTitle: "অংশগ্রহণকারী নির্দেশিকা",
	eventGuidelinesText: "ত্রিপুরার যে কোনো নিবন্ধিত বা সর্বজনীন পূজা কমিটি ও ক্লাব এই শারদ সম্মান প্রতিযোগিতায় অংশগ্রহণ করতে পারবে। নিচে থাকা ফর্মটি পূরণ করে আপনার ক্লাবের অন্তর্ভুক্তি নিশ্চিত করুন।",
	eventGuidelinesBadge: "অংশগ্রহণ সম্পূর্ণ বিনামূল্যে",
	eventSection2Divider: "॥ শারদ সম্মান আবেদন পত্র ॥",
	eventFormTitle: "ইভেন্ট নিবন্ধন ফরম (Event Registration)",
	eventFormSubtitle: "শারদ সম্মানের জন্য আপনার ক্লাব বা পূজোর বিস্তারিত তথ্য প্রদান করুন",
	eventFooterLinkEnabled: true,
	googleSiteVerification: "",
	bingSiteVerification: "",
	facebookDomainVerification: "",
	pinterestSiteVerification: "",
	yandexVerification: "",
	seoTitleTemplate: "%title% | %siteName%",
	seoKeywords: "Breaking News, Tripura News, Politics, Northeast India, Current Affairs, Local Headlines",
	seoOgImage: "",
	seoTwitterHandle: "@NewsTimeline",
	seoRobotsIndex: true,
	seoRobotsFollow: true,
	seoGooglebotNews: true,
	seoCanonicalBaseUrl: "",
	seoNewsPublicationName: "News Theme",
	seoOrganizationType: "NewsMediaOrganization",
	seoEditorialContactEmail: "",
	seoEditorialPolicyUrl: "/editorial-policy",
	seoFactCheckingPolicyUrl: "/fact-checking-policy",
	seoCorrectionsPolicyUrl: "/contact",
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
var getSiteSettingsServer_createServerFn_handler = createServerRpc({
	id: "c78294774cd3e4bb1c4a1b90ba325c5a3e4378da96a7efd13255241950559fc2",
	name: "getSiteSettingsServer",
	filename: "src/lib/site-content/site-settings.ts"
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
				licenseType: normalizeLicenseType(parsed.licenseType),
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
	id: "d5830d251ab2f9747dda53ce45f1285e09274b9a75417b75378eaeb555e1b2f2",
	name: "saveSiteSettingsServer",
	filename: "src/lib/site-content/site-settings.ts"
}, (opts) => saveSiteSettingsServer.__executeServer(opts));
var saveSiteSettingsServer = createServerFn({ method: "POST" }).middleware([attachAuth, requireAdmin]).validator((settings) => settings).handler(saveSiteSettingsServer_createServerFn_handler, async ({ data }) => {
	const cleanedData = {
		...data,
		copyright: cleanCopyright(data.copyright || defaultSettings.copyright),
		licenseType: normalizeLicenseType(data.licenseType)
	};
	const json = JSON.stringify(cleanedData);
	await query(`INSERT INTO site_settings (setting_key, value) VALUES ('site_settings_data', ?)
       ON DUPLICATE KEY UPDATE value = ?`, [json, json]);
	clearCache("site_settings_data");
	return { success: true };
});
//#endregion
export { getSiteSettingsServer_createServerFn_handler, saveSiteSettingsServer_createServerFn_handler };

//# sourceMappingURL=site-settings-BtXkORbo.js.map