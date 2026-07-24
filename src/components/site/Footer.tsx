import { MapPin, Phone, Mail } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { SocialIcons } from "@/components/site/SocialIcons";
import { useSiteSettings } from "@/components/site/AdSettingsContext";
import { AttributionGuard } from "@/components/site/AttributionGuard";

export function Footer() {
  const s = useSiteSettings();
  const year = new Date().getFullYear();
  const copyright = s.copyright?.replace("{year}", String(year)) || `© ${year} News Theme Media Co. All rights reserved.`;
  const partnerHref = s.builtByUrl?.startsWith("http") ? s.builtByUrl : `https://${s.builtByUrl || "GorillaTechsolution.com"}`;

  const quickLinks: { label: string; to?: string }[][] = [
    [{ label: "About", to: "/about" }, { label: "Contact Us", to: "/contact" }, { label: "Submit News", to: "/submit-news" }],
    [{ label: "Privacy Policy", to: "/privacy-policy" }, { label: "Terms & Conditions", to: "/terms-and-conditions" }, { label: "Cookie Policy", to: "/cookie-policy" }],
    [{ label: "Refund Policy", to: "/refund-policy" }, { label: "Disclaimer", to: "/disclaimer" }, { label: "Editorial Policy", to: "/editorial-policy" }],
    [{ label: "DMCA", to: "/dmca" }, { label: "Verified Journalist", to: "/verified-journalist" }, { label: "Subscription", to: "/subscription" }],
    [{ label: "Work With Us", to: "/work-with-us" }, { label: "Archive", to: "/archive" }, { label: "Earn Points", to: "/earn-points" }],
  ];


  const footerLight = s.footerLogoLight || s.logoLight;
  const footerDark = s.footerLogoDark || s.logoDark;
  const hasLogo = !!(footerLight || footerDark);
  
  const showLogo = hasLogo;
  const showText = !hasLogo;

  return (
    <footer className="border-t border-border bg-card/40">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="grid gap-8 md:grid-cols-3">
          {/* Brand */}
          <div>
            {showLogo && footerLight && (
              <img src={footerLight} alt={s.logoText || "Logo"} className={`h-12 object-contain ${footerDark ? "dark:hidden" : ""} ${showText ? "mb-3" : ""}`} />
            )}
            {showLogo && footerDark && (
              <img src={footerDark} alt={s.logoText || "Logo"} className={`h-12 object-contain ${footerLight ? "hidden dark:block" : ""} ${showText ? "mb-3" : ""}`} />
            )}
            {showText && (
              <h4
                className="text-2xl uppercase leading-none text-foreground"
                style={{ fontFamily: '"Inter", system-ui, sans-serif', fontWeight: 800, letterSpacing: "0.05em" }}
              >
                {s.logoText || "News Theme"}
              </h4>
            )}
            <p className="mt-3 text-sm text-muted-foreground">
              {s.metaDescription || "News Theme is an independent newsroom covering breaking news, finance, business and markets across Northeast India and beyond. Trusted, verified and editorially independent journalism."}
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
            <h5 className="text-sm font-bold uppercase tracking-widest text-foreground">Quick Links</h5>
            <div className="mt-3 space-y-2 text-sm text-muted-foreground">
              {quickLinks.map((row, i) => (
                <div key={i} className="flex flex-wrap gap-x-5 gap-y-2 md:justify-center">
                  {row.map((l) =>
                    l.to ? (
                      <Link key={l.label} to={l.to} className="hover:text-foreground hover:underline">{l.label}</Link>
                    ) : (
                      <a key={l.label} href="#" className="hover:text-foreground hover:underline">{l.label}</a>
                    )
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Connect */}
          <div className="md:text-right">
            <h5 className="text-sm font-bold uppercase tracking-widest text-foreground">Connect With Us</h5>
            <ul className="mt-3 space-y-2.5 text-sm text-muted-foreground">
              <li className="flex items-start gap-2 md:justify-end">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                <span>Agartala, Tripura (W) India<br />Pin: 799006</span>
              </li>
              <li className="flex items-center gap-2 md:justify-end">
                <Phone className="h-4 w-4 shrink-0" />
                <a href="tel:+919999999999" className="hover:text-foreground hover:underline">+91 99999 99999</a>
              </li>
              <li className="flex items-center gap-2 md:justify-end">
                <Mail className="h-4 w-4 shrink-0" />
                <a href="mailto:hello@northeasttimeline.com" className="hover:text-foreground hover:underline">hello@northeasttimeline.com</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Card Container */}
        <div className="mt-6 flex flex-col items-center justify-between gap-3 rounded-xl border border-border/80 bg-muted/40 px-5 py-3 text-xs text-muted-foreground shadow-xs md:flex-row">
          <p className="font-medium">{copyright}</p>

          <p className="flex flex-wrap items-center gap-1.5">
            <span>Website built and digital partner:</span>
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
      <AttributionGuard />
    </footer>
  );
}
