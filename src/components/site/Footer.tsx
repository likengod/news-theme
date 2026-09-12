import { MapPin, Phone, Mail } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { SocialIcons } from "@/components/site/SocialIcons";
import { useSiteSettings } from "@/components/site/AdSettingsContext";
import { AttributionGuard } from "@/components/site/AttributionGuard";
import { useTranslation } from "react-i18next";
import { cleanCopyright } from "@/lib/site-content";

export function Footer() {
  const { t } = useTranslation();
  const s = useSiteSettings();
  const year = new Date().getFullYear();
  const rawCopyright = s.copyright || `© ${year} News Theme Media Co. All rights reserved.`;
  const copyright = cleanCopyright(rawCopyright).replace("{year}", String(year));
  const partnerHref = s.builtByUrl?.startsWith("http")
    ? s.builtByUrl
    : `https://${s.builtByUrl || "GorillaTechsolution.com"}`;

  const isPremium =
    ["Enterprise", "Enterprise+", "Premium"].includes(s.licenseType || "") ||
    s.licenseRole === "VIP";

  const quickLinks: { label: string; to?: string }[][] = [
    [
      { label: t("footer.about"), to: "/about" },
      { label: t("footer.contact"), to: "/contact" },
      { label: t("footer.submitNews"), to: "/submit-news" },
    ],
    [
      { label: t("footer.privacyPolicy"), to: "/privacy-policy" },
      { label: t("footer.terms"), to: "/terms-and-conditions" },
      { label: t("footer.cookiePolicy"), to: "/cookie-policy" },
    ],
    [
      { label: t("footer.refundPolicy"), to: "/refund-policy" },
      { label: t("footer.disclaimer"), to: "/disclaimer" },
      { label: t("footer.editorialPolicy"), to: "/editorial-policy" },
    ],
    [
      { label: t("footer.dmca"), to: "/dmca" },
      { label: "Data Deletion Policy", to: "/data-deletion-policy" },
      { label: t("footer.verifiedJournalist"), to: "/verified-journalist" },
    ],
    [
      { label: t("footer.subscription"), to: "/subscription" },
      { label: t("footer.workWithUs"), to: "/work-with-us" },
      { label: t("footer.archive"), to: "/archive" },
    ].concat(isPremium ? [{ label: t("footer.earnPoints"), to: "/earn-points" }] : []),
  ];

  const footerLight = s.footerLogoLight || s.logoLight;
  const footerDark = s.footerLogoDark || s.logoDark;
  const hasLogo = !!(footerLight || footerDark);
  const mode = s.logoDisplayMode || (hasLogo ? "logo_only" : "text_only");

  const showLogo = hasLogo && (mode === "logo_only" || mode === "both");
  const showText = !hasLogo || mode === "text_only" || mode === "both";

  return (
    <footer className="border-t border-border bg-card/40">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="grid gap-8 md:grid-cols-3">
          {/* Brand */}
          <div>
            {showLogo && footerLight && (
              <img
                src={footerLight}
                alt={s.logoText || "Logo"}
                className={`h-12 object-contain ${footerDark ? "dark:hidden" : ""} ${showText ? "mb-3" : ""}`}
              />
            )}
            {showLogo && footerDark && (
              <img
                src={footerDark}
                alt={s.logoText || "Logo"}
                className={`h-12 object-contain ${footerLight ? "hidden dark:block" : ""} ${showText ? "mb-3" : ""}`}
              />
            )}
            {showText && (
              <h4
                className="text-2xl uppercase leading-none"
                style={{
                  fontFamily: '"Inter", system-ui, sans-serif',
                  fontWeight: 800,
                  letterSpacing: "0.05em",
                }}
              >
                <span
                  style={s.logoColorPrimary ? { color: s.logoColorPrimary } : undefined}
                  className={
                    !s.logoColorPrimary || s.logoColorPrimary === "#000000"
                      ? "text-foreground dark:text-white"
                      : ""
                  }
                >
                  {s.logoTextPrimary !== undefined && s.logoTextPrimary !== ""
                    ? s.logoTextPrimary
                    : s.logoText
                      ? s.logoText.split(" ")[0]
                      : "NEWS"}
                </span>{" "}
                <span style={{ color: s.logoColorSecondary || "#dc2626" }}>
                  {s.logoTextSecondary !== undefined && s.logoTextSecondary !== ""
                    ? s.logoTextSecondary
                    : s.logoText && s.logoText.split(" ").length > 1
                      ? s.logoText.split(" ").slice(1).join(" ")
                      : "THEME"}
                </span>
              </h4>
            )}
            <p className="mt-3 text-sm text-muted-foreground">
              {s.metaDescription ||
                "News Theme is an independent newsroom covering breaking news, finance, business and markets across Northeast India and beyond. Trusted, verified and editorially independent journalism."}
            </p>
            <SocialIcons
              className="mt-4"
              size="md"
              links={{
                facebook: s.facebook,
                instagram: s.instagram,
                twitter: s.twitter,
                pinterest: s.pinterest,
                tiktok: s.tiktok,
                whatsapp: s.whatsapp,
                youtube: s.youtube,
                linkedin: s.linkedin,
                telegram: s.telegram,
              }}
            />
          </div>

          {/* Quick Links */}
          <div className="md:text-center">
            <h5 className="text-sm font-bold uppercase tracking-widest text-foreground">
              {t("footer.quickLinks")}
            </h5>
            <div className="mt-3 space-y-2 text-sm text-muted-foreground">
              {quickLinks.map((row, i) => (
                <div key={i} className="flex flex-wrap gap-x-5 gap-y-2 md:justify-center">
                  {row.map((l) =>
                    l.to ? (
                      <Link
                        key={l.label}
                        to={l.to}
                        className="hover:text-foreground hover:underline"
                      >
                        {l.label}
                      </Link>
                    ) : (
                      <a key={l.label} href="#" className="hover:text-foreground hover:underline">
                        {l.label}
                      </a>
                    ),
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Connect */}
          <div className="md:text-right">
            <h5 className="text-sm font-bold uppercase tracking-widest text-foreground">
              {t("footer.connectWithUs")}
            </h5>
            <ul className="mt-3 space-y-2.5 text-sm text-muted-foreground">
              <li className="flex items-start gap-2 md:justify-end">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                <span>
                  Agartala, Tripura (W) India
                  <br />
                  Pin: 799006
                </span>
              </li>
              <li className="flex items-center gap-2 md:justify-end">
                <Phone className="h-4 w-4 shrink-0" />
                <a href="tel:+919999999999" className="hover:text-foreground hover:underline">
                  +91 99999 99999
                </a>
              </li>
              <li className="flex items-center gap-2 md:justify-end">
                <Mail className="h-4 w-4 shrink-0" />
                <a
                  href="mailto:hello@northeasttimeline.com"
                  className="hover:text-foreground hover:underline"
                >
                  hello@northeasttimeline.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Card Container */}
        <div className="mt-6 flex flex-col items-center justify-between gap-3 rounded-xl border border-border/80 bg-muted/40 px-5 py-3 text-xs text-muted-foreground shadow-xs md:flex-row">
          <p className="font-medium">{copyright}</p>

          <p className="flex flex-wrap items-center gap-1.5">
            <span>{t("footer.builtBy")}:</span>
            <a
              id="gorilla-tech-partner-tag"
              href="https://gorillatechsolution.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center rounded-md bg-[#0F2042] px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-white shadow-xs transition-all hover:bg-[#1E3A8A] hover:shadow-sm"
            >
              GORILLA TECH SOLUTION
            </a>
          </p>
        </div>
      </div>
      {/* <AttributionGuard /> */}
    </footer>
  );
}
