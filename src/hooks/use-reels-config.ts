import { useEffect, useState } from "react";
import { loadReelsConfig, onReelsConfigChange, type ReelsConfig } from "@/lib/reels-config";

export function useReelsConfig(): ReelsConfig {
  const [cfg, setCfg] = useState<ReelsConfig>(() => loadReelsConfig());
  useEffect(() => onReelsConfigChange(() => setCfg(loadReelsConfig())), []);
  return cfg;
}
