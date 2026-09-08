import { t as getServerFnById } from "./__23tanstack-start-server-fn-resolver-DvFZUU4C.js";
import { i as createServerFn, p as TSS_SERVER_FUNCTION } from "./esm-Dova13aH.js";
import { C as hero_markets_default, S as news_fed_default, b as news_oil_default, v as news_wallstreet_default, x as news_tech_default, y as news_crypto_default } from "./db.server-CLva-TlE.js";
import { t as requireAuth } from "./auth-middleware-DMbfTu4m.js";
import { z } from "zod";
//#region node_modules/@tanstack/start-server-core/dist/esm/createSsrRpc.js
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
//#endregion
//#region src/lib/site-content.ts
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
	copyright: `Ã‚Â© ${(/* @__PURE__ */ new Date()).getFullYear()} News Timeline Media Co. All rights reserved.`,
	builtByText: "Website built and digital partner: Gorilla Tech Solution",
	builtByUrl: "https://gorillatechsolution.com",
	metaDescription: "Independent newsroom covering breaking news, finance, business and markets across Northeast India and beyond.",
	logoLight: "",
	logoDark: "",
	footerLogoLight: "",
	footerLogoDark: "",
	favicon: "",
	logoDisplayMode: "logo_only",
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
	gitRemoteUrl: "",
	gitBranch: "main",
	gitAutoDeploy: false,
	gitAccessToken: "",
	protectionEnabled: true,
	protectionModalTitle: "Content Protection - News Theme",
	protectionModalMessage: "Our journalists work hard to bring you authentic news. When you share our website links directly, the ad revenue helps us pay our team and keep our servers online.\n\nWe humbly request you not to copy paste or take screenshots of our content. Your small effort to share the original link makes a big difference to our survival. Thank you for standing with us!",
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
				body: "<p>To deliver verified, contextual and accessible journalism Ã¢â‚¬â€ free from political and commercial interference Ã¢â‚¬â€ to readers across the region and the diaspora.</p>"
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
				body: "<ul className=\"list-disc space-y-1.5 pl-5\"><li><b>Essential</b> Ã¢â‚¬â€ required to sign in, keep you logged in and remember theme preferences.</li><li><b>Analytics</b> Ã¢â‚¬â€ aggregated usage statistics to improve editorial coverage.</li><li><b>Advertising</b> Ã¢â‚¬â€ limited to measurement of sponsored campaigns; we do not run third-party behavioural ad networks.</li></ul>"
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
				body: "<p>Approved refunds are processed within 5Ã¢â‚¬â€œ10 business days to the original payment method. Bank processing times may add a further 3Ã¢â‚¬â€œ5 days.</p>"
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
		intro: "Story tips, corrections, partnership and advertising enquiries Ã¢â‚¬â€ the News Theme desk reads every message. We aim to reply within one business day.",
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
var getCustomPagesServer = createServerFn({ method: "GET" }).handler(createSsrRpc("d6ad9b42e45f8051ecd77cd69dce97c8b90846d6a66560d9c2be61b21652c076"));
var saveCustomPageServer = createServerFn({ method: "POST" }).middleware([requireAuth]).validator((page) => z.object({
	slug: z.string(),
	title: z.string(),
	intro: z.string(),
	body: z.string()
}).parse(page)).handler(createSsrRpc("452bac6dbd07cd856a3354edfd651fcc48b4467e1ad9df155ef9a7db82dcd2b9"));
var getSiteSettingsServer = createServerFn({ method: "GET" }).handler(createSsrRpc("76cceb61b8cbcd67765e11a4d6fd020bc52db0b5d48e9061dbee9a6588f585db"));
var saveSiteSettingsServer = createServerFn({ method: "POST" }).middleware([requireAuth]).validator((settings) => z.object({
	siteName: z.string().min(1, "Site name is required"),
	contactEmail: z.string().email("Invalid email").optional().or(z.literal(""))
}).passthrough().parse(settings)).handler(createSsrRpc("234487bc01cd3c95f849db1e68b67b9b04631d8b59f06e8b1631b6c2045d4bec"));
var getAdConfigurationServer = createServerFn({ method: "GET" }).handler(createSsrRpc("3e3ed9c7714d66825c12d9a5804aed62c8bdcd55e8c133a588ae2d7266fb387d"));
var saveAdConfigurationServer = createServerFn({ method: "POST" }).middleware([requireAuth]).validator((config) => z.object({
	slots: z.record(z.any()),
	modes: z.record(z.any()),
	scripts: z.record(z.any()),
	rotations: z.record(z.any())
}).parse(config)).handler(createSsrRpc("d30452814ebcc1e3ebc74ab096112b5c96703aa0cd7393137855b3823d411f20"));
var getRedirectRulesServer = createServerFn({ method: "GET" }).handler(createSsrRpc("43b6b7c43b64390a39271b19c1f6c2ea02275aea86b135894e14f30bbca26f4d"));
var saveRedirectRulesServer = createServerFn({ method: "POST" }).middleware([requireAuth]).validator((rules) => z.array(z.object({
	id: z.string(),
	source: z.string(),
	destination: z.string(),
	hits: z.number(),
	createdAt: z.string()
})).parse(rules)).handler(createSsrRpc("76c6def71265e02a45c6579e0d6465b9a0c97a9cc7677a32e7b470384921ff0e"));
var incrementRedirectHitServer = createServerFn({ method: "POST" }).validator((id) => z.string().parse(id)).handler(createSsrRpc("1c685a5e9e4f2c5efff204e467aa4d140f8c1ebca87b428ef0568798e9c96d34"));
var scanBrokenLinksServer = createServerFn({ method: "GET" }).middleware([requireAuth]).handler(createSsrRpc("25680e39026fa5ae136332c4ff64db31d68520eced673670717fd7cc7a184fed"));
var fixBrokenLinkServer = createServerFn({ method: "POST" }).middleware([requireAuth]).validator((data) => z.object({
	articleId: z.number(),
	brokenUrl: z.string().min(1),
	correctedUrl: z.string().min(1)
}).parse(data)).handler(createSsrRpc("34fa117b4a32d8c1e8b89650b89702b7f09d9ba905dd40c1c69577152e1d9035"));
var defaultAdSlides = [
	{
		id: "ad-1",
		image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=800&q=80",
		href: "#",
		label: "Sponsored"
	},
	{
		id: "ad-2",
		image: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=800&q=80",
		href: "#",
		label: "Sponsored"
	},
	{
		id: "ad-3",
		image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=800&q=80",
		href: "#",
		label: "Sponsored"
	}
];
var defaultAdSlidesHome2 = [
	{
		id: "ad2-1",
		image: news_oil_default,
		href: "#",
		label: "Sponsored"
	},
	{
		id: "ad2-2",
		image: news_fed_default,
		href: "#",
		label: "Sponsored"
	},
	{
		id: "ad2-3",
		image: news_tech_default,
		href: "#",
		label: "Sponsored"
	},
	{
		id: "ad2-4",
		image: news_crypto_default,
		href: "#",
		label: "Sponsored"
	},
	{
		id: "ad2-5",
		image: news_wallstreet_default,
		href: "#",
		label: "Sponsored"
	},
	{
		id: "ad2-6",
		image: hero_markets_default,
		href: "#",
		label: "Sponsored"
	}
];
var SLOT_MODE_KEY = "nt:ad-slot-mode";
var SLOT_SCRIPT_KEY = "nt:ad-slot-script";
var DEFAULT_SLOT_MODE = {
	home1: "image",
	home2: "image",
	ad3: "image",
	popup: "image",
	leaderboard: "image",
	featured_slide: "image"
};
function loadAdSlotMode(slot) {
	if (typeof window === "undefined") return DEFAULT_SLOT_MODE[slot];
	try {
		const raw = localStorage.getItem(SLOT_MODE_KEY);
		return (raw ? JSON.parse(raw) : {})[slot] || DEFAULT_SLOT_MODE[slot];
	} catch {
		return DEFAULT_SLOT_MODE[slot];
	}
}
function saveAdSlotMode(slot, mode) {
	if (typeof window === "undefined") return;
	try {
		const raw = localStorage.getItem(SLOT_MODE_KEY);
		const map = raw ? JSON.parse(raw) : {};
		map[slot] = mode;
		localStorage.setItem(SLOT_MODE_KEY, JSON.stringify(map));
		window.dispatchEvent(new Event("nt:ads-updated"));
		syncAdConfigurationToServer();
	} catch {}
}
function loadAdSlotScript(slot) {
	if (typeof window === "undefined") return "";
	try {
		const raw = localStorage.getItem(SLOT_SCRIPT_KEY);
		return (raw ? JSON.parse(raw) : {})[slot] || "";
	} catch {
		return "";
	}
}
function saveAdSlotScript(slot, script) {
	if (typeof window === "undefined") return;
	try {
		const raw = localStorage.getItem(SLOT_SCRIPT_KEY);
		const map = raw ? JSON.parse(raw) : {};
		map[slot] = script;
		localStorage.setItem(SLOT_SCRIPT_KEY, JSON.stringify(map));
		window.dispatchEvent(new Event("nt:ads-updated"));
		syncAdConfigurationToServer();
	} catch {}
}
var ADS_KEYS = {
	home1: "nt:site-ads",
	home2: "nt:site-ads-home2",
	ad3: "nt:site-ads-ad3",
	popup: "nt:site-ads-popup",
	leaderboard: "nt:site-ads-leaderboard",
	featured_slide: "nt:site-ads-featured_slide"
};
var TRASH_KEY = "nt:site-ads-trash";
var TRASH_TTL_MS = 720 * 60 * 60 * 1e3;
var ROTATION_KEY = "nt:site-ads-rotation";
var DEFAULT_ROTATION = {
	home1: 5,
	home2: 5,
	ad3: 5,
	popup: 6,
	leaderboard: 5,
	featured_slide: 5
};
function loadAdRotation(slot) {
	if (typeof window === "undefined") return DEFAULT_ROTATION[slot];
	try {
		const raw = localStorage.getItem(ROTATION_KEY);
		const map = raw ? JSON.parse(raw) : {};
		const v = Number(map[slot]);
		return Number.isFinite(v) && v > 0 ? v : DEFAULT_ROTATION[slot];
	} catch {
		return DEFAULT_ROTATION[slot];
	}
}
function saveAdRotation(slot, seconds) {
	if (typeof window === "undefined") return;
	try {
		const raw = localStorage.getItem(ROTATION_KEY);
		const map = raw ? JSON.parse(raw) : {};
		map[slot] = Math.max(1, Math.round(seconds));
		localStorage.setItem(ROTATION_KEY, JSON.stringify(map));
		window.dispatchEvent(new Event("nt:ads-updated"));
		syncAdConfigurationToServer();
	} catch {}
}
var DEFAULTS = {
	home1: defaultAdSlides,
	home2: defaultAdSlidesHome2,
	ad3: [
		{
			id: "ad3-1",
			image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
			href: "#",
			label: "Sponsored"
		},
		{
			id: "ad3-2",
			image: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=800&q=80",
			href: "#",
			label: "Sponsored"
		},
		{
			id: "ad3-3",
			image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
			href: "#",
			label: "Sponsored"
		}
	],
	popup: [{
		id: "pop-1",
		image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=900&q=80",
		href: "#",
		label: "Sponsored",
		orientation: "portrait"
	}, {
		id: "pop-2",
		image: "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1600&q=80",
		href: "#",
		label: "Sponsored",
		orientation: "landscape"
	}],
	leaderboard: [{
		id: "lead-1",
		imageLandscape: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=1200&h=150&q=80",
		imagePortrait: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=600&h=100&q=80",
		image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=1200&h=150&q=80",
		href: "#",
		label: "Sponsored",
		orientation: "landscape"
	}],
	featured_slide: []
};
function readRaw(slot) {
	if (typeof window === "undefined") return DEFAULTS[slot];
	try {
		const raw = localStorage.getItem(ADS_KEYS[slot]);
		return raw ? JSON.parse(raw) : DEFAULTS[slot];
	} catch {
		return DEFAULTS[slot];
	}
}
function writeRaw(slot, ads) {
	localStorage.setItem(ADS_KEYS[slot], JSON.stringify(ads));
}
function loadTrash() {
	if (typeof window === "undefined") return [];
	try {
		const raw = localStorage.getItem(TRASH_KEY);
		const items = raw ? JSON.parse(raw) : [];
		const now = Date.now();
		const fresh = items.filter((i) => i.deletedAt && now - new Date(i.deletedAt).getTime() < TRASH_TTL_MS);
		if (fresh.length !== items.length) localStorage.setItem(TRASH_KEY, JSON.stringify(fresh));
		return fresh;
	} catch {
		return [];
	}
}
function saveTrash(items) {
	localStorage.setItem(TRASH_KEY, JSON.stringify(items));
	if (typeof window !== "undefined") window.dispatchEvent(new Event("nt:ads-updated"));
}
/** Move all expired (past expiresAt) ads from every slot into trash. */
function processExpiredAds() {
	if (typeof window === "undefined") return;
	const now = Date.now();
	const trash = loadTrash();
	Object.keys(ADS_KEYS).forEach((slot) => {
		const list = readRaw(slot);
		const keep = [];
		list.forEach((ad) => {
			if (ad.expiresAt && new Date(ad.expiresAt).getTime() <= now) trash.push({
				...ad,
				slot,
				deletedAt: (/* @__PURE__ */ new Date()).toISOString()
			});
			else keep.push(ad);
		});
		if (keep.length !== list.length) writeRaw(slot, keep);
	});
	saveTrash(trash);
}
function loadAds(slot = "home1") {
	return readRaw(slot);
}
function saveAds(a, slot = "home1") {
	writeRaw(slot, a);
	if (typeof window !== "undefined") window.dispatchEvent(new Event("nt:ads-updated"));
	syncAdConfigurationToServer();
}
/** Soft-delete: remove from active slot, push to trash with deletedAt. */
function trashAds(ids, slot) {
	const list = readRaw(slot);
	const moving = list.filter((a) => ids.includes(a.id));
	writeRaw(slot, list.filter((a) => !ids.includes(a.id)));
	const trash = loadTrash();
	const now = (/* @__PURE__ */ new Date()).toISOString();
	moving.forEach((m) => trash.push({
		...m,
		slot,
		deletedAt: now
	}));
	saveTrash(trash);
}
/** Restore a trashed ad back into its slot. */
function restoreFromTrash(id) {
	const trash = loadTrash();
	const item = trash.find((t) => t.id === id);
	if (!item) return;
	const slot = item.slot || "home1";
	const list = readRaw(slot);
	const { deletedAt, slot: _s, ...clean } = item;
	writeRaw(slot, [...list, clean]);
	saveTrash(trash.filter((t) => t.id !== id));
}
/** Permanently delete from trash. */
function purgeFromTrash(id) {
	saveTrash(loadTrash().filter((t) => t.id !== id));
}
var SETTINGS_KEY = "nt:site-settings";
var PAGES_KEY = "nt:site-pages";
var memorySettings = null;
function loadSettings() {
	if (memorySettings) return memorySettings;
	if (typeof window === "undefined") return defaultSettings;
	try {
		const raw = localStorage.getItem(SETTINGS_KEY);
		return raw ? {
			...defaultSettings,
			...JSON.parse(raw)
		} : defaultSettings;
	} catch {
		return defaultSettings;
	}
}
async function saveSettings(s) {
	memorySettings = s;
	if (typeof window !== "undefined") {
		try {
			localStorage.setItem(SETTINGS_KEY, JSON.stringify(s));
		} catch (e) {
			console.warn("Failed to save settings to localStorage, continuing to server save", e);
		}
		window.dispatchEvent(new Event("nt:settings-updated"));
		window.dispatchEvent(new Event("nt:ads-updated"));
	}
	return await saveSiteSettingsServer({ data: s });
}
function loadPages() {
	if (typeof window === "undefined") return defaultPages;
	try {
		const raw = localStorage.getItem(PAGES_KEY);
		if (!raw) return defaultPages;
		const parsed = JSON.parse(raw);
		const map = new Map(parsed.map((p) => [p.slug, p]));
		return defaultPages.map((d) => map.get(d.slug) ?? d);
	} catch {
		return defaultPages;
	}
}
function savePages(p) {
	localStorage.setItem(PAGES_KEY, JSON.stringify(p));
}
function syncAdConfigurationToServer() {
	saveAdConfigurationServer({ data: {
		slots: {
			home1: loadAds("home1"),
			home2: loadAds("home2"),
			ad3: loadAds("ad3"),
			popup: loadAds("popup"),
			leaderboard: loadAds("leaderboard"),
			featured_slide: loadAds("featured_slide")
		},
		modes: {
			home1: loadAdSlotMode("home1"),
			home2: loadAdSlotMode("home2"),
			ad3: loadAdSlotMode("ad3"),
			popup: loadAdSlotMode("popup"),
			leaderboard: loadAdSlotMode("leaderboard"),
			featured_slide: loadAdSlotMode("featured_slide")
		},
		scripts: {
			home1: loadAdSlotScript("home1"),
			home2: loadAdSlotScript("home2"),
			ad3: loadAdSlotScript("ad3"),
			popup: loadAdSlotScript("popup"),
			leaderboard: loadAdSlotScript("leaderboard"),
			featured_slide: loadAdSlotScript("featured_slide")
		},
		rotations: {
			home1: loadAdRotation("home1"),
			home2: loadAdRotation("home2"),
			ad3: loadAdRotation("ad3"),
			popup: loadAdRotation("popup"),
			leaderboard: loadAdRotation("leaderboard"),
			featured_slide: loadAdRotation("featured_slide")
		}
	} }).catch(() => {});
}
//#endregion
export { savePages as C, scanBrokenLinksServer as D, saveSiteSettingsServer as E, trashAds as O, saveCustomPageServer as S, saveSettings as T, restoreFromTrash as _, getRedirectRulesServer as a, saveAdSlotScript as b, loadAdRotation as c, loadAds as d, loadPages as f, purgeFromTrash as g, processExpiredAds as h, getCustomPagesServer as i, createSsrRpc as k, loadAdSlotMode as l, loadTrash as m, fixBrokenLinkServer as n, getSiteSettingsServer as o, loadSettings as p, getAdConfigurationServer as r, incrementRedirectHitServer as s, defaultSettings as t, loadAdSlotScript as u, saveAdRotation as v, saveRedirectRulesServer as w, saveAds as x, saveAdSlotMode as y };
