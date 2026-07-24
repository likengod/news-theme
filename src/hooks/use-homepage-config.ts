import { useEffect, useState } from "react";
import {
  loadHomepageConfig,
  onHomepageConfigChange,
  defaultHomepageConfig,
  type HomepageConfig,
} from "@/lib/homepage-config";
import { useAdSettings } from "@/components/site/AdSettingsContext";

export function useHomepageConfig(): HomepageConfig {
  const ctx = useAdSettings();
  const [cfg, setCfg] = useState<HomepageConfig>(() => ctx?.homepageConfig ?? defaultHomepageConfig);

  useEffect(() => {
    if (ctx?.homepageConfig) {
      setCfg(ctx.homepageConfig);
    }
  }, [ctx?.homepageConfig]);

  useEffect(() => {
    if (!ctx) {
      setCfg(loadHomepageConfig());

      return onHomepageConfigChange(() => {
        setCfg(loadHomepageConfig());
      });
    }
  }, [ctx]);

  return cfg;
}
