import { useEffect } from "react";
import {
  defaultFontConfig,
  buildFontFaceCss,
  buildSectionCssVars,
  buildGoogleFontsUrl,
  FONT_CONFIG_KEY,
} from "@/lib/font-config";
import { initFormAccessibility } from "@/lib/form-a11y";

export function useRootEffects(loaderData: any) {
  useEffect(() => {
    if (
      loaderData?.settings?.forceHttps &&
      window.location.protocol === "http:" &&
      window.location.hostname !== "localhost"
    ) {
      window.location.protocol = "https:";
    }
    if (typeof window === "undefined" || !loaderData) return;
    const { settings, homepageConfig, adsConfig, fontConfig } = loaderData;
    if (settings) {
      localStorage.setItem("nt:site-settings", JSON.stringify(settings));
    }
    if (fontConfig) {
      localStorage.setItem(FONT_CONFIG_KEY, JSON.stringify(fontConfig));
    }
    if (homepageConfig) {
      localStorage.setItem("nt:homepage-config:v1", JSON.stringify(homepageConfig));
    }
    if (adsConfig) {
      if (adsConfig.slots) {
        Object.keys(adsConfig.slots).forEach((slot) => {
          const slotAds = (adsConfig.slots as any)[slot];
          if (Array.isArray(slotAds) && slotAds.length > 0) {
            localStorage.setItem(`nt:ads:v2:${slot}`, JSON.stringify(slotAds));
            const legacyKey = slot === "home1" ? "nt:site-ads" : `nt:site-ads-${slot}`;
            localStorage.setItem(legacyKey, JSON.stringify(slotAds));
          }
        });
      }
      if (adsConfig.modes) {
        localStorage.setItem("nt:ad-slot-mode", JSON.stringify(adsConfig.modes));
      }
      if (adsConfig.scripts) {
        localStorage.setItem("nt:ad-slot-script", JSON.stringify(adsConfig.scripts));
      }
      if (adsConfig.rotations) {
        localStorage.setItem("nt:site-ads-rotation", JSON.stringify(adsConfig.rotations));
      }
      if (adsConfig.popupConfig) {
        localStorage.setItem("nt:popup-ad-config", JSON.stringify(adsConfig.popupConfig));
      }

      window.dispatchEvent(new Event("nt:ads-updated"));
      window.dispatchEvent(new Event("nt:homepage-updated"));
    }
  }, [loaderData]);

  // Inject dynamic font styles (uploaded @font-face + section CSS variable overrides)
  const fontConfig = loaderData?.fontConfig ?? defaultFontConfig;
  useEffect(() => {
    // @font-face for uploaded fonts
    const faceCss = buildFontFaceCss(fontConfig.fonts);
    let faceStyle = document.getElementById("nt-font-face") as HTMLStyleElement | null;
    if (!faceStyle) {
      faceStyle = document.createElement("style");
      faceStyle.id = "nt-font-face";
      document.head.appendChild(faceStyle);
    }
    faceStyle.textContent = faceCss;

    // Section CSS variable overrides
    const varsCss = buildSectionCssVars(fontConfig);
    let varsStyle = document.getElementById("nt-font-vars") as HTMLStyleElement | null;
    if (!varsStyle) {
      varsStyle = document.createElement("style");
      varsStyle.id = "nt-font-vars";
      document.head.appendChild(varsStyle);
    }
    varsStyle.textContent = varsCss;

    // Google Fonts asynchronous non-blocking stylesheet attachment
    const activeSectionFontIds = Object.values(fontConfig.sectionMapping || {});
    const googleFontsUrl = buildGoogleFontsUrl(fontConfig.fonts, activeSectionFontIds);
    let fontLink = document.getElementById("nt-google-fonts") as HTMLLinkElement | null;
    if (googleFontsUrl) {
      if (!fontLink) {
        fontLink = document.createElement("link");
        fontLink.id = "nt-google-fonts";
        fontLink.rel = "stylesheet";
        fontLink.href = googleFontsUrl;
        document.head.appendChild(fontLink);
      } else if (fontLink.href !== googleFontsUrl) {
        fontLink.href = googleFontsUrl;
      }
    }

    return () => {
      faceStyle?.remove();
      varsStyle?.remove();
    };
  }, [fontConfig]);

  // Re-apply font vars on settings update from admin
  useEffect(() => {
    const handleFontUpdate = (e: Event) => {
      try {
        const detail = (e as CustomEvent).detail;
        if (detail) {
          const fc = typeof detail === "string" ? JSON.parse(detail) : detail;
          const varsCss = buildSectionCssVars(fc);
          const varsStyle = document.getElementById("nt-font-vars");
          if (varsStyle) varsStyle.textContent = varsCss;
        }
      } catch {}
    };
    window.addEventListener("nt:fonts-updated", handleFontUpdate);
    return () => window.removeEventListener("nt:fonts-updated", handleFontUpdate);
  }, []);

  // Ensure all form controls have valid id/name and accessible labels across the entire site
  useEffect(() => {
    return initFormAccessibility();
  }, []);

  // Auto-recover if browser holds stale client JS and receives unexpected HTML / 404 on server functions
  useEffect(() => {
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const reason = event?.reason;
      const msg = String(reason?.message || reason || "");
      if (
        msg.includes("Unexpected token '<'") ||
        msg.includes("<!DOCTYPE") ||
        msg.includes("is not valid JSON")
      ) {
        console.warn(
          "[App Auto-Recovery] Stale bundle / server response mismatch detected. Reloading page...",
        );
        const lastReload = sessionStorage.getItem("app_cache_bust_reload");
        const now = Date.now();
        if (!lastReload || now - parseInt(lastReload, 10) > 8000) {
          sessionStorage.setItem("app_cache_bust_reload", now.toString());
          window.location.reload();
        }
      }
    };

    window.addEventListener("unhandledrejection", handleUnhandledRejection);
    return () => window.removeEventListener("unhandledrejection", handleUnhandledRejection);
  }, []);
}
