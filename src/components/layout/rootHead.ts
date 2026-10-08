import appCss from "@/styles.css?url";
import {
  defaultFontConfig,
  buildGoogleFontsUrl,
} from "@/lib/font-config";

export function generateRootHead(loaderData: any) {
  const s = loaderData?.settings;
  const siteTitle = s?.siteName || "News Timeline";
  const tagline = s?.tagline || "Breaking News";
  const title = s?.siteName
    ? `${s.siteName} – ${tagline}`
    : "News Timeline – Breaking News | Finance | Business | Market";

  const desc =
    s?.metaDescription ||
    "News Timeline delivers breaking news, market intelligence, and sharp business analysis covering finance, technology, energy and global markets.";

  const robotsIndex = s?.seoRobotsIndex === false ? "noindex" : "index";
  const robotsFollow = s?.seoRobotsFollow === false ? "nofollow" : "follow";
  const robotsContent = `${robotsIndex}, ${robotsFollow}`;

  const canonicalBase = s?.seoCanonicalBaseUrl ? s.seoCanonicalBaseUrl.replace(/\/$/, "") : "";
  const ogImage = s?.seoOgImage || (canonicalBase ? `${canonicalBase}/og-image.jpg` : "/og-image.jpg");
  const rawTwitter = s?.twitter || "";
  let twitterHandle = "@NewsTimeline";
  if (rawTwitter) {
    const cleaned = rawTwitter.replace(/^https?:\/\/(www\.)?(twitter|x)\.com\//i, "").replace(/^@/, "").trim();
    if (cleaned) twitterHandle = `@${cleaned}`;
  }

  const metaTags: Array<Record<string, any>> = [
    { charSet: "utf-8" },
    { name: "viewport", content: "width=device-width, initial-scale=1" },
    { title: title },
    { name: "description", content: desc },
    { name: "robots", content: robotsContent },
    { name: "author", content: siteTitle },
    { property: "og:title", content: title },
    { property: "og:description", content: desc },
    { property: "og:type", content: "website" },
    { property: "og:image", content: ogImage },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:site", content: twitterHandle },
    { name: "twitter:creator", content: twitterHandle },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: desc },
    { name: "twitter:image", content: ogImage },
  ];

  if (s?.seoKeywords) {
    metaTags.push({ name: "keywords", content: s.seoKeywords });
  }

  if (s?.seoGooglebotNews ?? true) {
    metaTags.push({
      name: "googlebot-news",
      content: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
    });
    metaTags.push({
      name: "googlebot",
      content: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
    });
  }

  metaTags.push({ httpEquiv: "Content-Security-Policy", content: "upgrade-insecure-requests" });

  if (s?.googleSiteVerification) {
    metaTags.push({ name: "google-site-verification", content: s.googleSiteVerification });
  }
  if (s?.bingSiteVerification) {
    metaTags.push({ name: "msvalidate.01", content: s.bingSiteVerification });
  }
  if (s?.facebookDomainVerification) {
    metaTags.push({
      name: "facebook-domain-verification",
      content: s.facebookDomainVerification,
    });
  }
  if (s?.pinterestSiteVerification) {
    metaTags.push({ name: "p:domain_verify", content: s.pinterestSiteVerification });
  }
  if (s?.yandexVerification) {
    metaTags.push({ name: "yandex-verification", content: s.yandexVerification });
  }

  // Build Google Fonts URL dynamically from font config
  const fontConfig = loaderData?.fontConfig ?? defaultFontConfig;
  const activeSectionFontIds = Object.values(fontConfig.sectionMapping || {});
  const googleFontsUrl = buildGoogleFontsUrl(fontConfig.fonts, activeSectionFontIds);

  const links: Array<Record<string, any>> = [
    { rel: "preconnect", href: "https://fonts.googleapis.com" },
    { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
    { rel: "stylesheet", href: appCss },
    {
      rel: "alternate",
      type: "application/rss+xml",
      title: `${siteTitle} RSS Feed`,
      href: "/rss.xml",
    },
  ];

  const orgSchema: Record<string, any> = {
    "@context": "https://schema.org",
    "@type": s?.seoOrganizationType || "NewsMediaOrganization",
    name: s?.seoNewsPublicationName || siteTitle,
    url: canonicalBase || "http://localhost:3099",
    description: desc,
  };
  if (s?.logoLight || canonicalBase) {
    orgSchema.logo = s?.logoLight || `${canonicalBase}/logo.png`;
  }
  if (s?.seoEditorialContactEmail || s?.contactEmail) {
    orgSchema.contactPoint = {
      "@type": "ContactPoint",
      email: s?.seoEditorialContactEmail || s?.contactEmail,
      contactType: "editorial",
    };
  }
  orgSchema.publishingPrinciples = s?.seoEditorialPolicyUrl || "/editorial-policy";
  orgSchema.correctionsPolicy = s?.seoCorrectionsPolicyUrl || "/contact";
  orgSchema.diversityPolicy = s?.seoFactCheckingPolicyUrl || "/fact-checking-policy";

  const scripts: Array<Record<string, any>> = [
    {
      type: "application/ld+json",
      children: JSON.stringify(orgSchema),
    },
  ];

  const asyncFonts = s?.asyncFontsEnabled ?? true;

  if (googleFontsUrl && typeof googleFontsUrl === "string" && googleFontsUrl.trim()) {
    if (asyncFonts) {
      // Non-render-blocking font loading: preload the stylesheet and dynamically append it
      links.push({
        rel: "preload",
        as: "style",
        href: googleFontsUrl,
      });
      scripts.push({
        children: `(function(){var l=document.createElement('link');l.rel='stylesheet';l.href=${JSON.stringify(googleFontsUrl)};document.head.appendChild(l);})();`,
      });
    } else {
      // Standard render-blocking stylesheet
      links.push({
        rel: "stylesheet",
        href: googleFontsUrl,
      });
    }
  }

  return {
    meta: metaTags,
    links: links,
    scripts: scripts,
  };
}
