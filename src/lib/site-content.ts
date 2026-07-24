// Lightweight client-side content store for editable site copy.
// Persists to localStorage so admin edits survive reloads without a backend.
import { z } from "zod";

export type SiteSettings = {
  siteName: string;
  tagline: string;
  logoText: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  facebook: string;
  instagram: string;
  twitter: string;
  pinterest: string;
  tiktok: string;
  linkedin: string;
  youtube: string;
  whatsapp: string;
  telegram: string;
  googleNews: string;
  footerNote: string;
  copyright: string;
  builtByText: string;
  builtByUrl: string;
  metaDescription: string;
  // Brand identity (data URLs from File Manager / direct upload)
  logoLight: string; // header logo on day/light mode
  logoDark: string; // header logo on night/dark mode
  footerLogoLight: string;
  footerLogoDark: string;
  favicon: string;
  logoDisplayMode: "logo_only" | "text_only" | "both";
  // Integrations / analytics
  googleAnalyticsId: string; // e.g. G-XXXXXXX
  googleTagManagerId: string; // GTM-XXXXXX
  googleAdsenseId: string; // ca-pub-XXXXXX
  facebookPixelId: string;
  firebaseConfigJson: string; // raw JSON pasted from Firebase

  // AI API Keys
  geminiApiKey?: string;
  openAiApiKey?: string;
  deepseekApiKey?: string;
  kimiApiKey?: string;

  // Payment Gateways
  razorpayKeyId?: string;
  razorpayKeySecret?: string;
  stripePublicKey?: string;
  stripeSecretKey?: string;

  // Subscription Page Settings
  subscriptionTitle?: string;
  subscriptionIntro?: string;
  subscriptionPriceINRMonthly?: string;
  subscriptionPriceINRYearly?: string;
  subscriptionPriceUSDMonthly?: string;
  subscriptionPriceUSDYearly?: string;
  subscriptionFeatures?: string; // Newline separated list

  // Work With Us Page Settings
  workWithUsHeroTitle?: string;
  workWithUsHeroIntro?: string;
  workWithUsIdCardReq?: string;
  workWithUsRules?: string; // Newline separated list
  workWithUsGamification?: string;
  workWithUsBadges?: string;
  workWithUsTiers?: string;
  workWithUsFaqs?: string;

  // Site verification meta tags
  googleSiteVerification: string;
  bingSiteVerification: string;
  facebookDomainVerification: string;
  pinterestSiteVerification: string;
  yandexVerification: string;
  // OAuth provider status (informational toggles)
  authGoogleEnabled: boolean;
  authFacebookEnabled: boolean;
  authLinkedinEnabled: boolean;
  // OAuth client IDs (public; secrets must live in backend env)
  googleClientId: string;
  facebookAppId: string;
  linkedinClientId: string;
  oauthRedirectUrl: string;
  // Git / CI-CD Integration
  gitRemoteUrl: string;
  gitBranch: string;
  gitAutoDeploy: boolean;
  gitAccessToken: string;
  // Protection & Anti-Theft Settings
  protectionEnabled: boolean;
  protectionModalTitle: string;
  protectionModalMessage: string;
  // Speed Up Optimizations
  cleanUnusedCss: boolean;
  minifyJs: boolean;
  serverCacheEnabled: boolean;
  preRenderEnabled: boolean;
  optimizationScheduleEnabled: boolean;
  optimizationScheduleTime: string;
  // Top Bar Customizations
  topBarDateCustomText: string;
  topBarWeatherCustomText: string;
  topBarSwapDelay: number;
  topBarBgColor: string;
  topBarTextColor: string;
  topBarTextGradient: string;
  // Festive & Category Customizations
  festiveCategoryTitleColor: string;
  festiveCategoryTitleGradient: string;
  festiveCategoryBadgeBgColor: string;
  festiveCategoryBadgeTextColor: string;
  festiveScanMeCustomText: string;
  festiveScanMeSubtext: string;
  festiveScanMeTextColor: string;
  festiveScanMeTextGradient: string;
  festiveScanMeSubtextColor: string;
  // Custom Alert Options
  customAlertAnimationStyle: string;
  customAlertFontFamily: string;
  customAlertFontSize: number;
};

export const defaultSettings: SiteSettings = {
  siteName: "News Timeline",
  tagline: "Breaking News · Finance · Business · Markets",
  logoText: "News Timeline",
  contactEmail: "hello@newstimeline.com",
  contactPhone: "+91 99999 99999",
  address: "Agartala, Tripura (W) India · Pin: 799006",
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
  footerNote:
    "News Timeline is an independent newsroom covering breaking news, finance, business and markets across Northeast India and beyond.",
  copyright: `© ${new Date().getFullYear()} News Timeline Media Co. All rights reserved.`,
  builtByText: "Website built and digital partner: Gorilla Tech Solution",
  builtByUrl: "https://gorillatechsolution.com",
  metaDescription:
    "Independent newsroom covering breaking news, finance, business and markets across Northeast India and beyond.",
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
  
  // Payment Gateways Defaults
  razorpayKeyId: "",
  razorpayKeySecret: "",
  stripePublicKey: "",
  stripeSecretKey: "",

  // Subscription Page Defaults
  subscriptionTitle: "Go Premium",
  subscriptionIntro: "Upgrade to a Premium account for ad-free reading and exclusive stories. Your role changes to **Premium user** instantly.",
  subscriptionPriceINRMonthly: "149",
  subscriptionPriceINRYearly: "1499",
  subscriptionPriceUSDMonthly: "4.99",
  subscriptionPriceUSDYearly: "49.99",
  subscriptionFeatures: "Ad-free reading across the entire site\nExclusive premium stories & long-reads\nEarly access to breaking news alerts\nDownloadable PDF weekly digest\nSupport independent Northeast journalism",

  // Work With Us Page Defaults
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
  // Top Bar Customizations
  topBarDateCustomText: "",
  topBarWeatherCustomText: "",
  topBarSwapDelay: 5,
  topBarBgColor: "",
  topBarTextColor: "",
  topBarTextGradient: "",
  // Festive & Category Customizations
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
  customAlertFontSize: 14,
};

export type PageContent = {
  slug: string;
  title: string;
  intro: string;
  body: string; // HTML or plain text
  sections?: { heading: string, body: string }[];
};

export const defaultPages: PageContent[] = [
  { 
    slug: "about", 
    title: "About News Theme", 
    intro: "News Theme is an independent newsroom based in Agartala, covering breaking news, finance, business and markets across Northeast India and the wider world.", 
    body: "",
    sections: [
      { heading: "Our Mission", body: "<p>To deliver verified, contextual and accessible journalism — free from political and commercial interference — to readers across the region and the diaspora.</p>" },
      { heading: "Our Team", body: "<p>Our staff includes reporters, market analysts, video producers and editors, supported by a network of regional correspondents.</p>" },
      { heading: "How We Are Funded", body: "<p>We are funded by reader subscriptions, clearly-labelled sponsorships and a small grant program. We do not accept funding that would compromise editorial independence.</p>" },
      { heading: "Get in Touch", body: '<p>For tips, story pitches or partnerships, visit our <a className="underline" href="/contact">contact page</a> or write to <a className="underline" href="mailto:newsroom@northeasttimeline.com">newsroom@northeasttimeline.com</a>.</p>' }
    ]
  },
  { 
    slug: "privacy-policy", 
    title: "Privacy Policy", 
    intro: "This Privacy Policy explains how News Theme collects, uses, and protects your personal information when you use our website and services.", 
    body: "",
    sections: [
      { heading: "Information We Collect", body: "<p>We collect information you provide directly (like creating an account or subscribing) and data collected automatically (like IP addresses and browsing behaviour via cookies).</p>" },
      { heading: "How We Use Your Data", body: "<ul className=\"list-disc space-y-1.5 pl-5\"><li>To provide and maintain our services.</li><li>To process subscription payments.</li><li>To send newsletters and editorial updates.</li><li>To analyse site traffic and improve our journalism.</li></ul>" },
      { heading: "Data Sharing", body: "<p>We do not sell your personal data to third parties. We may share information with trusted service providers (like payment processors) solely to operate our business.</p>" },
      { heading: "Your Rights", body: "<p>You have the right to access, correct, or delete your personal information. To exercise these rights, please contact us at <a className=\"underline\" href=\"mailto:privacy@northeasttimeline.com\">privacy@northeasttimeline.com</a>.</p>" }
    ]
  },
  { 
    slug: "terms-and-conditions", 
    title: "Terms & Conditions", 
    intro: "These Terms govern your access to and use of News Theme's website, content, and services. Please read them carefully.", 
    body: "",
    sections: [
      { heading: "Acceptance of Terms", body: "<p>By accessing or using our service, you agree to be bound by these Terms. If you disagree with any part, you may not access the service.</p>" },
      { heading: "User Accounts", body: "<p>You are responsible for safeguarding the password you use to access the site. You agree not to disclose your password to any third party.</p>" },
      { heading: "Intellectual Property", body: "<p>All editorial content, trademarks, logos and proprietary technology remain the property of News Theme or its licensors. You may share short excerpts with attribution; bulk republication requires written permission.</p>" },
      { heading: "Subscriptions & Payment", body: "<p>Paid subscription fees and renewal terms are disclosed at the point of sale. We reserve the right to suspend access for non-payment. Refunds are governed by our Refund Policy.</p>" },
      { heading: "Limitation of Liability", body: "<p>To the maximum extent permitted by law, News Theme shall not be liable for any indirect, incidental, special, consequential or punitive damages, or any loss of profits or revenues arising from your use of the Service.</p>" },
      { heading: "Termination", body: "<p>We may terminate or suspend your access to the Service immediately, without prior notice, for conduct that we believe violates these Terms or is harmful to other users, us, or third parties.</p>" },
      { heading: "Governing Law", body: "<p>These Terms shall be governed by and construed in accordance with the laws of India, without regard to its conflict of law provisions.</p>" },
      { heading: "Changes to Terms", body: "<p>We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material we will provide at least 30 days notice before the new terms take effect.</p>" }
    ]
  },
  { 
    slug: "cookie-policy", 
    title: "Cookie Policy", 
    intro: "This Cookie Policy explains what cookies are, which ones we use, and how you can control them.", 
    body: "",
    sections: [
      { heading: "What Are Cookies", body: "<p>Cookies are small text files placed on your device by websites you visit. They are widely used to make sites work efficiently and to provide information to the site owners.</p>" },
      { heading: "Types of Cookies We Use", body: "<ul className=\"list-disc space-y-1.5 pl-5\"><li><b>Essential</b> — required to sign in, keep you logged in and remember theme preferences.</li><li><b>Analytics</b> — aggregated usage statistics to improve editorial coverage.</li><li><b>Advertising</b> — limited to measurement of sponsored campaigns; we do not run third-party behavioural ad networks.</li></ul>" },
      { heading: "Managing Cookies", body: "<p>Most browsers let you refuse or delete cookies via their settings. Disabling essential cookies will break sign-in and personalisation features.</p>" },
      { heading: "Third-Party Cookies", body: "<p>Embedded video players (YouTube, Facebook) may set their own cookies when you play a video. Refer to those providers' privacy policies for details.</p>" }
    ]
  },
  { 
    slug: "refund-policy", 
    title: "Refund Policy", 
    intro: "This policy describes the conditions under which News Theme issues refunds for paid subscriptions and other purchases.", 
    body: "",
    sections: [
      { heading: "Eligibility", body: "<p>You may request a full refund within <b>7 days</b> of your initial subscription payment, provided you have not downloaded more than a token amount of premium content. Renewal payments are non-refundable except where required by law.</p>" },
      { heading: "How to Request a Refund", body: "<p>Email <a className=\"underline\" href=\"mailto:billing@northeasttimeline.com\">billing@northeasttimeline.com</a> from the address linked to your account, including your order ID and the reason for the request.</p>" },
      { heading: "Processing Time", body: "<p>Approved refunds are processed within 5–10 business days to the original payment method. Bank processing times may add a further 3–5 days.</p>" },
      { heading: "Non-Refundable Items", body: "<p>One-off article purchases, gift subscriptions already redeemed and event tickets are non-refundable.</p>" },
      { heading: "Chargebacks", body: "<p>Please contact us before initiating a chargeback; most billing issues can be resolved within one business day.</p>" }
    ]
  },
  { 
    slug: "dmca", 
    title: "DMCA Notice & Takedown", 
    intro: "News Theme respects the intellectual property of others. If you believe content on our site infringes your copyright, please send a notice as described below.", 
    body: "",
    sections: [
      { heading: "Filing a Notice", body: "<ul className=\"list-disc space-y-1.5 pl-5\"><li>Your physical or electronic signature.</li><li>Identification of the copyrighted work claimed to be infringed.</li><li>URL of the material on our site you want removed.</li><li>Your name, address, phone number and email.</li><li>A good-faith statement that the use is not authorised.</li><li>A statement, under penalty of perjury, that the information is accurate and you are the rights holder or authorised to act on their behalf.</li></ul>" },
      { heading: "Counter-Notice", body: "<p>If your content was removed and you believe it was a mistake or misidentification, you may file a counter-notice with the same details and a statement consenting to jurisdiction in the courts of India.</p>" },
      { heading: "Repeat Infringers", body: "<p>We will terminate accounts of users found to be repeat infringers in appropriate circumstances.</p>" }
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
      { heading: "Independence", body: "<p>Our newsroom operates independently of advertisers, investors and political affiliations. Sponsored content is labelled clearly and never written by the editorial team.</p>" },
      { heading: "Sourcing & Verification", body: "<p>Every news report relies on at least two independent sources or one primary document. Anonymous sources are used only when essential and approved by a senior editor.</p>" },
      { heading: "Corrections", body: "<p>We correct errors promptly and transparently. Material corrections are noted at the foot of the affected article with the date and nature of the change.</p>" },
      { heading: "Conflicts of Interest", body: "<p>Reporters disclose any personal or financial interest that could appear to influence coverage, and are recused from related stories.</p>" },
      { heading: "AI-Assisted Reporting", body: "<p>Generative AI may be used for research and copy-editing assistance only. Every published sentence is reviewed and approved by a human editor.</p>" }
    ]
  },
  { 
    slug: "disclaimer", 
    title: "Disclaimer", 
    intro: "The information published on News Theme is for general informational purposes only. We make no warranties about completeness, reliability or accuracy.", 
    body: "",
    sections: [
      { heading: "No Financial Advice", body: "<p>Market data, analysis and opinion published on News Theme do not constitute investment advice, a recommendation, or a solicitation to buy or sell any security. Always consult a qualified financial professional before making investment decisions.</p>" },
      { heading: "Market Data", body: "<p>Quotes, indices and currency rates are delayed at least 15 minutes and provided by third-party vendors. We do not guarantee their accuracy or completeness.</p>" },
      { heading: "External Links", body: "<p>Our articles may contain links to external sites. We are not responsible for the content, accuracy or practices of those sites.</p>" },
      { heading: "Errors & Corrections", body: "<p>If you spot an error, email <a className=\"underline\" href=\"mailto:corrections@northeasttimeline.com\">corrections@northeasttimeline.com</a>. Significant corrections are noted at the foot of the affected article.</p>" }
    ]
  }
];

import { createServerFn } from "@tanstack/react-start";
import { requireAuth } from "./auth-middleware";
import { query } from "./db.server";

// ─── Server Functions (MySQL Custom Pages Persistence) ─────────────────────

export const getCustomPagesServer = createServerFn({ method: "GET" })
  .handler(async (): Promise<PageContent[]> => {
    try {
      const rows = await query("SELECT value FROM site_settings WHERE setting_key = 'custom_pages_data'");
      if (rows.length > 0 && rows[0].value) {
        const parsed = JSON.parse(rows[0].value) as PageContent[];
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return defaultPages;
  });

export const saveCustomPageServer = createServerFn({ method: "POST" })
  .middleware([requireAuth])
  .validator((page) => z.object({
    slug: z.string(),
    title: z.string(),
    intro: z.string(),
    body: z.string()
  }).parse(page) as PageContent)
  .handler(async ({ data: updatedPage }) => {
    let pages = defaultPages;
    try {
      const rows = await query("SELECT value FROM site_settings WHERE setting_key = 'custom_pages_data'");
      if (rows.length > 0 && rows[0].value) {
        pages = JSON.parse(rows[0].value);
      }
    } catch {}

    const idx = pages.findIndex((p) => p.slug === updatedPage.slug);
    if (idx >= 0) pages[idx] = updatedPage;
    else pages.push(updatedPage);

    const json = JSON.stringify(pages);
    await query(
      `INSERT INTO site_settings (setting_key, value) VALUES ('custom_pages_data', ?)
       ON DUPLICATE KEY UPDATE value = ?`,
      [json, json]
    );
    return { success: true };
  });

// Server-side cache utility for site settings and ad configurations (10s TTL)
type CacheEntry<T> = {
  data: T;
  expiry: number;
};
const SERVER_CACHE: Record<string, CacheEntry<any>> = {};
const CACHE_TTL_MS = 10000;

function getCached<T>(key: string): T | null {
  const entry = SERVER_CACHE[key];
  if (entry && entry.expiry > Date.now()) {
    return entry.data as T;
  }
  return null;
}

function setCached<T>(key: string, data: T) {
  SERVER_CACHE[key] = {
    data,
    expiry: Date.now() + CACHE_TTL_MS,
  };
}

function clearCache(key: string) {
  delete SERVER_CACHE[key];
}

export const getSiteSettingsServer = createServerFn({ method: "GET" })
  .handler(async (): Promise<SiteSettings> => {
    const cacheKey = "site_settings_data";
    const cached = getCached<SiteSettings>(cacheKey);
    if (cached) return cached;
    try {
      const rows = await query("SELECT value FROM site_settings WHERE setting_key = 'site_settings_data'");
      if (rows.length > 0 && rows[0].value) {
        const parsed = JSON.parse(rows[0].value);
        const res = { ...defaultSettings, ...parsed };
        setCached(cacheKey, res);
        return res;
      }
    } catch {}
    return defaultSettings;
  });

export const saveSiteSettingsServer = createServerFn({ method: "POST" })
  .middleware([requireAuth])
  .validator((settings) => z.object({
    siteName: z.string().min(1, "Site name is required"),
    contactEmail: z.string().email("Invalid email").optional().or(z.literal("")),
  }).passthrough().parse(settings) as SiteSettings)
  .handler(async ({ data }) => {
    const json = JSON.stringify(data);
    await query(
      `INSERT INTO site_settings (setting_key, value) VALUES ('site_settings_data', ?)
       ON DUPLICATE KEY UPDATE value = ?`,
      [json, json]
    );
    clearCache("site_settings_data");
    return { success: true };
  });

export type AdConfiguration = {
  slots: Record<AdSlot, AdSlideItem[]>;
  modes: Record<AdSlot, AdSlotMode>;
  scripts: Record<AdSlot, string>;
  rotations: Record<AdSlot, number>;
};

export const getAdConfigurationServer = createServerFn({ method: "GET" })
  .handler(async (): Promise<AdConfiguration> => {
    const cacheKey = "ad_configuration_data";
    const cached = getCached<AdConfiguration>(cacheKey);
    if (cached) return cached;
    try {
      const rows = await query("SELECT value FROM site_settings WHERE setting_key = 'ad_configuration_data'");
      if (rows.length > 0 && rows[0].value) {
        const parsed = JSON.parse(rows[0].value) as AdConfiguration;
        setCached(cacheKey, parsed);
        return parsed;
      }
    } catch {}

    const config: AdConfiguration = {
      slots: {
        home1: defaultAdSlides,
        home2: defaultAdSlidesHome2,
        ad3: defaultAdSlidesAd3,
        popup: defaultAdSlidesPopup,
        leaderboard: defaultAdSlidesLeaderboard,
      },
      modes: {
        home1: "image",
        home2: "image",
        ad3: "image",
        popup: "image",
        leaderboard: "image",
      },
      scripts: { home1: "", home2: "", ad3: "", popup: "", leaderboard: "" },
      rotations: {
        home1: 5,
        home2: 5,
        ad3: 5,
        popup: 6,
        leaderboard: 5,
      },
    };
    return config;
  });

export const saveAdConfigurationServer = createServerFn({ method: "POST" })
  .middleware([requireAuth])
  .validator((config) => z.object({
    slots: z.record(z.any()),
    modes: z.record(z.any()),
    scripts: z.record(z.any()),
    rotations: z.record(z.any()),
  }).parse(config) as AdConfiguration)
  .handler(async ({ data }) => {
    const json = JSON.stringify(data);
    await query(
      `INSERT INTO site_settings (setting_key, value) VALUES ('ad_configuration_data', ?)
       ON DUPLICATE KEY UPDATE value = ?`,
      [json, json]
    );
    clearCache("ad_configuration_data");
    return { success: true };
  });

export type RedirectRule = {
  id: string;
  source: string;
  destination: string;
  hits: number;
  createdAt: string;
};

export type BrokenLinkItem = {
  id: string;
  articleId: number;
  articleTitle: string;
  articleSlug: string;
  brokenUrl: string;
  suggestedFix: string;
};

export const getRedirectRulesServer = createServerFn({ method: "GET" })
  .handler(async (): Promise<RedirectRule[]> => {
    const cacheKey = "site_redirects_data";
    const cached = getCached<RedirectRule[]>(cacheKey);
    if (cached) return cached;
    try {
      const rows = await query("SELECT value FROM site_settings WHERE setting_key = 'site_redirects_data'");
      if (rows.length > 0 && rows[0].value) {
        const parsed = JSON.parse(rows[0].value) as RedirectRule[];
        setCached(cacheKey, parsed);
        return parsed;
      }
    } catch {}
    return [];
  });

export const saveRedirectRulesServer = createServerFn({ method: "POST" })
  .middleware([requireAuth])
  .validator((rules) => z.array(z.object({
    id: z.string(),
    source: z.string(),
    destination: z.string(),
    hits: z.number(),
    createdAt: z.string(),
  })).parse(rules) as RedirectRule[])
  .handler(async ({ data }) => {
    const json = JSON.stringify(data);
    await query(
      `INSERT INTO site_settings (setting_key, value) VALUES ('site_redirects_data', ?)
       ON DUPLICATE KEY UPDATE value = ?`,
      [json, json]
    );
    clearCache("site_redirects_data");
    return { success: true };
  });

export const incrementRedirectHitServer = createServerFn({ method: "POST" })
  .validator((id) => z.string().parse(id))
  .handler(async ({ data: id }) => {
    try {
      const rows = await query("SELECT value FROM site_settings WHERE setting_key = 'site_redirects_data'");
      if (rows.length > 0 && rows[0].value) {
        const rules = JSON.parse(rows[0].value) as RedirectRule[];
        const idx = rules.findIndex((r) => r.id === id);
        if (idx >= 0) {
          rules[idx].hits = (rules[idx].hits || 0) + 1;
          const json = JSON.stringify(rules);
          await query(
            `INSERT INTO site_settings (setting_key, value) VALUES ('site_redirects_data', ?)
             ON DUPLICATE KEY UPDATE value = ?`,
            [json, json]
          );
          clearCache("site_redirects_data");
        }
      }
    } catch {}
    return { success: true };
  });

export const scanBrokenLinksServer = createServerFn({ method: "GET" })
  .middleware([requireAuth])
  .handler(async (): Promise<BrokenLinkItem[]> => {
    // 1. Fetch categories
    const categoriesRows = await query("SELECT slug FROM categories");
    const categorySlugs = new Set<string>(categoriesRows.map((r: any) => r.slug));

    // 2. Fetch custom pages
    let pageSlugs = new Set<string>(["about", "privacy-policy", "terms-and-conditions", "cookie-policy", "refund-policy", "dmca", "contact"]);
    try {
      const rows = await query("SELECT value FROM site_settings WHERE setting_key = 'custom_pages_data'");
      if (rows.length > 0 && rows[0].value) {
        const pages = JSON.parse(rows[0].value);
        if (Array.isArray(pages)) {
          pages.forEach((p: any) => {
            if (p.slug) pageSlugs.add(p.slug);
          });
        }
      }
    } catch {}

    // 3. Fetch articles
    const articlesRows = await query("SELECT id, title, slug, content FROM articles WHERE status = 'Published'");
    const articleSlugsMap = new Map<string, { id: number; title: string }>();
    articlesRows.forEach((r: any) => {
      articleSlugsMap.set(r.slug, { id: r.id, title: r.title });
    });

    const staticRoutes = new Set([
      "", "/", "/about", "/contact", "/submit-news", "/privacy-policy", "/terms-and-conditions", 
      "/cookie-policy", "/refund-policy", "/disclaimer", "/editorial-policy", "/dmca", 
      "/verified-journalist", "/subscription", "/work-with-us", "/archive", "/earn-points", 
      "/withdraw-points", "/profile", "/search"
    ]);

    const brokenLinks: BrokenLinkItem[] = [];

    // Simple keyword-matching suggest function
    const findSuggestion = (brokenSlug: string): string => {
      const keywords = brokenSlug.split("-").filter((k) => k.length > 2);
      if (keywords.length === 0) return "";
      let bestMatchSlug = "";
      let maxMatches = 0;
      articlesRows.forEach((r: any) => {
        let matches = 0;
        keywords.forEach((kw) => {
          if (r.slug.includes(kw) || r.title.toLowerCase().includes(kw)) {
            matches++;
          }
        });
        if (matches > maxMatches) {
          maxMatches = matches;
          bestMatchSlug = `/news/${r.slug}`;
        }
      });
      return bestMatchSlug;
    };

    // Regex to find anchor tags href
    const hrefRegex = /href=["']((?:\/[a-zA-Z0-9_\-\.\/]*)|(?:https?:\/\/[a-zA-Z0-9_\-\.\/]+))["']/g;

    articlesRows.forEach((art: any) => {
      if (!art.content) return;
      let match;
      const seenLinksInArticle = new Set<string>();

      while ((match = hrefRegex.exec(art.content)) !== null) {
        const url = match[1];
        if (seenLinksInArticle.has(url)) continue;
        seenLinksInArticle.add(url);

        let isBroken = false;
        let suggestion = "";

        // Check if internal relative link
        if (url.startsWith("/")) {
          const path = url.split("?")[0].split("#")[0]; // remove query and hash
          
          if (path.startsWith("/news/")) {
            const slug = path.substring(6);
            if (!articleSlugsMap.has(slug)) {
              isBroken = true;
              suggestion = findSuggestion(slug);
            }
          } else {
            // General page, custom page, or category check
            const slug = path.substring(1);
            if (
              !staticRoutes.has(path) &&
              !pageSlugs.has(slug) &&
              !categorySlugs.has(slug)
            ) {
              isBroken = true;
            }
          }
        }

        if (isBroken) {
          brokenLinks.push({
            id: `${art.id}-${encodeURIComponent(url)}`,
            articleId: art.id,
            articleTitle: art.title,
            articleSlug: art.slug,
            brokenUrl: url,
            suggestedFix: suggestion,
          });
        }
      }
    });

    return brokenLinks;
  });

export const fixBrokenLinkServer = createServerFn({ method: "POST" })
  .middleware([requireAuth])
  .validator((data) => z.object({
    articleId: z.number(),
    brokenUrl: z.string().min(1),
    correctedUrl: z.string().min(1)
  }).parse(data))
  .handler(async ({ data }) => {
    const { articleId, brokenUrl, correctedUrl } = data;
    
    // Fetch article content
    const rows = await query("SELECT content FROM articles WHERE id = ?", [articleId]);
    if (rows.length === 0) throw new Error("Article not found");
    let content = rows[0].content || "";

    // Replace the exact href link
    const doubleQuotePattern = new RegExp(`href=["']\${escapeRegExp(brokenUrl)}["']`, 'g');
    content = content.replace(doubleQuotePattern, `href="\${correctedUrl}"`);

    await query("UPDATE articles SET content = ? WHERE id = ?", [content, articleId]);
    return { success: true };
  });

function escapeRegExp(str: string) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export type AdOrientation = "portrait" | "landscape";
export type AdType = "image" | "script";

export type AdSlideItem = {
  id: string;
  type?: AdType; // "image" (default) or "script"
  scriptCode?: string; // HTML / JS snippet for Google AdSense / 3rd party script
  image: string;
  imagePortrait?: string;
  imageLandscape?: string;
  href: string;
  label?: string;
  expiresAt?: string | null; // ISO date; auto-trash when past
  deletedAt?: string | null; // ISO timestamp; purge after 30 days
  slot?: AdSlot; // used in trash to know where to restore
  orientation?: AdOrientation; // preferred display orientation
};

import adHome2_1 from "@/assets/news-oil.jpg";
import adHome2_2 from "@/assets/news-fed.jpg";
import adHome2_3 from "@/assets/news-tech.jpg";
import adHome2_4 from "@/assets/news-crypto.jpg";
import adHome2_5 from "@/assets/news-wallstreet.jpg";
import adHome2_6 from "@/assets/hero-markets.jpg";

export const defaultAdSlides: AdSlideItem[] = [
  { id: "ad-1", image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=800&q=80", href: "#", label: "Sponsored" },
  { id: "ad-2", image: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=800&q=80", href: "#", label: "Sponsored" },
  { id: "ad-3", image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=800&q=80", href: "#", label: "Sponsored" },
];

export const defaultAdSlidesHome2: AdSlideItem[] = [
  { id: "ad2-1", image: adHome2_1, href: "#", label: "Sponsored" },
  { id: "ad2-2", image: adHome2_2, href: "#", label: "Sponsored" },
  { id: "ad2-3", image: adHome2_3, href: "#", label: "Sponsored" },
  { id: "ad2-4", image: adHome2_4, href: "#", label: "Sponsored" },
  { id: "ad2-5", image: adHome2_5, href: "#", label: "Sponsored" },
  { id: "ad2-6", image: adHome2_6, href: "#", label: "Sponsored" },
];

export type AdSlot = "home1" | "home2" | "ad3" | "popup" | "leaderboard";
export type AdSlotMode = "image" | "script";

const SLOT_MODE_KEY = "nt:ad-slot-mode";
const SLOT_SCRIPT_KEY = "nt:ad-slot-script";

const DEFAULT_SLOT_MODE: Record<AdSlot, AdSlotMode> = {
  home1: "image",
  home2: "image",
  ad3: "image",
  popup: "image",
  leaderboard: "image",
};

export function loadAdSlotMode(slot: AdSlot): AdSlotMode {
  if (typeof window === "undefined") return DEFAULT_SLOT_MODE[slot];
  try {
    const raw = localStorage.getItem(SLOT_MODE_KEY);
    const map = raw ? (JSON.parse(raw) as Record<string, AdSlotMode>) : {};
    return map[slot] || DEFAULT_SLOT_MODE[slot];
  } catch {
    return DEFAULT_SLOT_MODE[slot];
  }
}

export function saveAdSlotMode(slot: AdSlot, mode: AdSlotMode) {
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem(SLOT_MODE_KEY);
    const map = raw ? (JSON.parse(raw) as Record<string, AdSlotMode>) : {};
    map[slot] = mode;
    localStorage.setItem(SLOT_MODE_KEY, JSON.stringify(map));
    window.dispatchEvent(new Event("nt:ads-updated"));
    syncAdConfigurationToServer();
  } catch {
    /* noop */
  }
}

export function loadAdSlotScript(slot: AdSlot): string {
  if (typeof window === "undefined") return "";
  try {
    const raw = localStorage.getItem(SLOT_SCRIPT_KEY);
    const map = raw ? (JSON.parse(raw) as Record<string, string>) : {};
    return map[slot] || "";
  } catch {
    return "";
  }
}

export function saveAdSlotScript(slot: AdSlot, script: string) {
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem(SLOT_SCRIPT_KEY);
    const map = raw ? (JSON.parse(raw) as Record<string, string>) : {};
    map[slot] = script;
    localStorage.setItem(SLOT_SCRIPT_KEY, JSON.stringify(map));
    window.dispatchEvent(new Event("nt:ads-updated"));
    syncAdConfigurationToServer();
  } catch {
    /* noop */
  }
}

const ADS_KEYS: Record<AdSlot, string> = {
  home1: "nt:site-ads",
  home2: "nt:site-ads-home2",
  ad3: "nt:site-ads-ad3",
  popup: "nt:site-ads-popup",
  leaderboard: "nt:site-ads-leaderboard",
};


const TRASH_KEY = "nt:site-ads-trash";
const TRASH_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

const ROTATION_KEY = "nt:site-ads-rotation"; // { [slot]: seconds }
const DEFAULT_ROTATION: Record<AdSlot, number> = {
  home1: 5,
  home2: 5,
  ad3: 5,
  popup: 6,
  leaderboard: 5,
};

export function loadAdRotation(slot: AdSlot): number {
  if (typeof window === "undefined") return DEFAULT_ROTATION[slot];
  try {
    const raw = localStorage.getItem(ROTATION_KEY);
    const map = raw ? (JSON.parse(raw) as Record<string, number>) : {};
    const v = Number(map[slot]);
    return Number.isFinite(v) && v > 0 ? v : DEFAULT_ROTATION[slot];
  } catch {
    return DEFAULT_ROTATION[slot];
  }
}

export function saveAdRotation(slot: AdSlot, seconds: number) {
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem(ROTATION_KEY);
    const map = raw ? (JSON.parse(raw) as Record<string, number>) : {};
    map[slot] = Math.max(1, Math.round(seconds));
    localStorage.setItem(ROTATION_KEY, JSON.stringify(map));
    window.dispatchEvent(new Event("nt:ads-updated"));
    syncAdConfigurationToServer();
  } catch {
    /* noop */
  }
}

export const defaultAdSlidesAd3: AdSlideItem[] = [
  { id: "ad3-1", image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80", href: "#", label: "Sponsored" },
  { id: "ad3-2", image: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=800&q=80", href: "#", label: "Sponsored" },
  { id: "ad3-3", image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80", href: "#", label: "Sponsored" },
];

export const defaultAdSlidesPopup: AdSlideItem[] = [
  { id: "pop-1", image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=900&q=80", href: "#", label: "Sponsored", orientation: "portrait" },
  { id: "pop-2", image: "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1600&q=80", href: "#", label: "Sponsored", orientation: "landscape" },
];

export const defaultAdSlidesLeaderboard: AdSlideItem[] = [
  { 
    id: "lead-1", 
    imageLandscape: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=1200&h=150&q=80",
    imagePortrait: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=600&h=100&q=80",
    image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=1200&h=150&q=80",
    href: "#", 
    label: "Sponsored", 
    orientation: "landscape" 
  },
];

const DEFAULTS: Record<AdSlot, AdSlideItem[]> = {
  home1: defaultAdSlides,
  home2: defaultAdSlidesHome2,
  ad3: defaultAdSlidesAd3,
  popup: defaultAdSlidesPopup,
  leaderboard: defaultAdSlidesLeaderboard,
};




function readRaw(slot: AdSlot): AdSlideItem[] {
  if (typeof window === "undefined") return DEFAULTS[slot];
  try {
    const raw = localStorage.getItem(ADS_KEYS[slot]);
    return raw ? (JSON.parse(raw) as AdSlideItem[]) : DEFAULTS[slot];
  } catch {
    return DEFAULTS[slot];
  }
}

function writeRaw(slot: AdSlot, ads: AdSlideItem[]) {
  localStorage.setItem(ADS_KEYS[slot], JSON.stringify(ads));
}

export function loadTrash(): AdSlideItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(TRASH_KEY);
    const items: AdSlideItem[] = raw ? JSON.parse(raw) : [];
    const now = Date.now();
    // Auto purge anything older than 30 days
    const fresh = items.filter(
      (i) => i.deletedAt && now - new Date(i.deletedAt).getTime() < TRASH_TTL_MS
    );
    if (fresh.length !== items.length) {
      localStorage.setItem(TRASH_KEY, JSON.stringify(fresh));
    }
    return fresh;
  } catch {
    return [];
  }
}

export function saveTrash(items: AdSlideItem[]) {
  localStorage.setItem(TRASH_KEY, JSON.stringify(items));
  if (typeof window !== "undefined") window.dispatchEvent(new Event("nt:ads-updated"));
}

/** Move all expired (past expiresAt) ads from every slot into trash. */
export function processExpiredAds() {
  if (typeof window === "undefined") return;
  const now = Date.now();
  const trash = loadTrash();
  (Object.keys(ADS_KEYS) as AdSlot[]).forEach((slot) => {
    const list = readRaw(slot);
    const keep: AdSlideItem[] = [];
    list.forEach((ad) => {
      if (ad.expiresAt && new Date(ad.expiresAt).getTime() <= now) {
        trash.push({ ...ad, slot, deletedAt: new Date().toISOString() });
      } else {
        keep.push(ad);
      }
    });
    if (keep.length !== list.length) writeRaw(slot, keep);
  });
  saveTrash(trash);
}

export function loadAds(slot: AdSlot = "home1"): AdSlideItem[] {
  return readRaw(slot);
}

export function saveAds(a: AdSlideItem[], slot: AdSlot = "home1") {
  writeRaw(slot, a);
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("nt:ads-updated"));
  }
  syncAdConfigurationToServer();
}

/** Soft-delete: remove from active slot, push to trash with deletedAt. */
export function trashAds(ids: string[], slot: AdSlot) {
  const list = readRaw(slot);
  const moving = list.filter((a) => ids.includes(a.id));
  const remaining = list.filter((a) => !ids.includes(a.id));
  writeRaw(slot, remaining);
  const trash = loadTrash();
  const now = new Date().toISOString();
  moving.forEach((m) => trash.push({ ...m, slot, deletedAt: now }));
  saveTrash(trash);
}

/** Restore a trashed ad back into its slot. */
export function restoreFromTrash(id: string) {
  const trash = loadTrash();
  const item = trash.find((t) => t.id === id);
  if (!item) return;
  const slot: AdSlot = (item.slot as AdSlot) || "home1";
  const list = readRaw(slot);
  const { deletedAt, slot: _s, ...clean } = item;
  void deletedAt; void _s;
  writeRaw(slot, [...list, clean]);
  saveTrash(trash.filter((t) => t.id !== id));
}

/** Permanently delete from trash. */
export function purgeFromTrash(id: string) {
  saveTrash(loadTrash().filter((t) => t.id !== id));
}



const SETTINGS_KEY = "nt:site-settings";
const PAGES_KEY = "nt:site-pages";

let memorySettings: SiteSettings | null = null;

export function loadSettings(): SiteSettings {
  if (memorySettings) return memorySettings;
  if (typeof window === "undefined") return defaultSettings;
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    return raw ? { ...defaultSettings, ...JSON.parse(raw) } : defaultSettings;
  } catch {
    return defaultSettings;
  }
}

export async function saveSettings(s: SiteSettings) {
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

export function loadPages(): PageContent[] {
  if (typeof window === "undefined") return defaultPages;
  try {
    const raw = localStorage.getItem(PAGES_KEY);
    if (!raw) return defaultPages;
    const parsed: PageContent[] = JSON.parse(raw);
    // merge defaults so new slugs appear
    const map = new Map(parsed.map((p) => [p.slug, p]));
    return defaultPages.map((d) => map.get(d.slug) ?? d);
  } catch {
    return defaultPages;
  }
}

export function savePages(p: PageContent[]) {
  localStorage.setItem(PAGES_KEY, JSON.stringify(p));
}

export function syncAdConfigurationToServer() {
  const config: AdConfiguration = {
    slots: {
      home1: loadAds("home1"),
      home2: loadAds("home2"),
      ad3: loadAds("ad3"),
      popup: loadAds("popup"),
      leaderboard: loadAds("leaderboard"),
    },
    modes: {
      home1: loadAdSlotMode("home1"),
      home2: loadAdSlotMode("home2"),
      ad3: loadAdSlotMode("ad3"),
      popup: loadAdSlotMode("popup"),
      leaderboard: loadAdSlotMode("leaderboard"),
    },
    scripts: {
      home1: loadAdSlotScript("home1"),
      home2: loadAdSlotScript("home2"),
      ad3: loadAdSlotScript("ad3"),
      popup: loadAdSlotScript("popup"),
      leaderboard: loadAdSlotScript("leaderboard"),
    },
    rotations: {
      home1: loadAdRotation("home1"),
      home2: loadAdRotation("home2"),
      ad3: loadAdRotation("ad3"),
      popup: loadAdRotation("popup"),
      leaderboard: loadAdRotation("leaderboard"),
    },
  };
  saveAdConfigurationServer({ data: config }).catch(() => {});
}
