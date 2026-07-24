import { useEffect } from "react";
import { loadSettings } from "@/lib/site-content";

/**
 * Client-side injector for analytics/verification tags configured in
 * Admin → Site Settings. Runs only in the browser; safe for SSR.
 */
export function AnalyticsInjector() {
  useEffect(() => {
    const s = loadSettings();
    const head = document.head;

    const addMeta = (name: string, content: string) => {
      if (!content) return;
      if (document.querySelector(`meta[name="${name}"]`)) return;
      const m = document.createElement("meta");
      m.name = name;
      m.content = content;
      head.appendChild(m);
    };

    addMeta("google-site-verification", s.googleSiteVerification);
    addMeta("msvalidate.01", s.bingSiteVerification);
    addMeta("facebook-domain-verification", s.facebookDomainVerification);
    addMeta("p:domain_verify", s.pinterestSiteVerification);
    addMeta("yandex-verification", s.yandexVerification);

    const addScript = (id: string, src?: string, inline?: string, attrs: Record<string, string> = {}) => {
      if (document.getElementById(id)) return;
      const el = document.createElement("script");
      el.id = id;
      el.async = true;
      if (src) el.src = src;
      if (inline) el.text = inline;
      Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
      head.appendChild(el);
    };

    // Google Analytics (GA4)
    if (s.googleAnalyticsId) {
      addScript("ga-src", `https://www.googletagmanager.com/gtag/js?id=${s.googleAnalyticsId}`);
      addScript(
        "ga-init",
        undefined,
        `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${s.googleAnalyticsId}');`,
      );
    }

    // Google Tag Manager
    if (s.googleTagManagerId) {
      addScript(
        "gtm-init",
        undefined,
        `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${s.googleTagManagerId}');`,
      );
    }

    // Google AdSense
    if (s.googleAdsenseId) {
      addScript(
        "adsense-src",
        `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${s.googleAdsenseId}`,
        undefined,
        { crossorigin: "anonymous" },
      );
    }

    // Facebook Pixel
    if (s.facebookPixelId) {
      addScript(
        "fb-pixel",
        undefined,
        `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${s.facebookPixelId}');fbq('track','PageView');`,
      );
    }

    // Firebase (optional)
    if (s.firebaseConfigJson) {
      try {
        const cfg = JSON.parse(s.firebaseConfigJson);
        addScript(
          "firebase-init",
          undefined,
          `window.__FIREBASE_CONFIG__=${JSON.stringify(cfg)};`,
        );
      } catch {
        // ignore invalid JSON
      }
    }
  }, []);

  return null;
}
