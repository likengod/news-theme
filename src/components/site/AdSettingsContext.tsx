import React, { createContext, useContext, useEffect, useState } from "react";
import {
  type SiteSettings,
  type AdConfiguration,
  loadSettings,
  defaultSettings,
} from "@/lib/site-content";
import {
  type HomepageConfig,
  defaultHomepageConfig,
  loadHomepageConfig,
} from "@/lib/homepage-config";
import { type FontConfiguration, defaultFontConfig, loadFontConfig } from "@/lib/font-config";

type AdSettingsContextType = {
  settings: SiteSettings;
  homepageConfig: HomepageConfig;
  adConfig: AdConfiguration;
  fontConfig?: FontConfiguration;
  categories?: any[];
};

const AdSettingsContext = createContext<AdSettingsContextType | null>(null);

export function AdSettingsProvider({
  children,
  value,
}: {
  children: React.ReactNode;
  value: AdSettingsContextType;
}) {
  return <AdSettingsContext.Provider value={value}>{children}</AdSettingsContext.Provider>;
}

export function useAdSettings() {
  return useContext(AdSettingsContext);
}

export function useSiteSettings(): SiteSettings {
  const ctx = useAdSettings();
  const [s, setS] = useState<SiteSettings>(() => ctx?.settings ?? loadSettings());

  useEffect(() => {
    if (ctx?.settings) {
      setS(ctx.settings);
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem("nt:site-settings", JSON.stringify(ctx.settings));
        } catch {}
      }
    }
  }, [ctx?.settings]);

  useEffect(() => {
    const sync = () => {
      setS(loadSettings());
    };
    window.addEventListener("nt:settings-updated", sync);
    window.addEventListener("nt:ads-updated", sync);
    return () => {
      window.removeEventListener("nt:settings-updated", sync);
      window.removeEventListener("nt:ads-updated", sync);
    };
  }, []);

  return s;
}

export function useFontConfig(): FontConfiguration {
  const ctx = useAdSettings();
  const [fc, setFc] = useState<FontConfiguration>(() => ctx?.fontConfig ?? defaultFontConfig);

  useEffect(() => {
    if (ctx?.fontConfig) {
      setFc(ctx.fontConfig);
    }
  }, [ctx?.fontConfig]);

  useEffect(() => {
    const sync = () => setFc(loadFontConfig());
    window.addEventListener("nt:fonts-updated", sync);
    return () => window.removeEventListener("nt:fonts-updated", sync);
  }, []);

  return fc;
}

export function useCategories(): any[] {
  const ctx = useAdSettings();
  const [cats, setCats] = useState<any[]>(() => ctx?.categories ?? []);

  useEffect(() => {
    if (ctx?.categories) {
      setCats(ctx.categories);
    }
  }, [ctx?.categories]);

  return cats;
}
