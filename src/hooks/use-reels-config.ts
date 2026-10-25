import { useEffect, useState } from "react";
import {
  loadReelsConfig,
  onReelsConfigChange,
  getReelsConfigServer,
  type ReelsConfig,
} from "@/lib/reels-config";

export function useReelsConfig(initialConfig?: ReelsConfig): ReelsConfig {
  const [cfg, setCfg] = useState<ReelsConfig>(() => initialConfig || loadReelsConfig());

  useEffect(() => {
    // 1. Sync on local events
    const unsub = onReelsConfigChange(() => setCfg(loadReelsConfig()));

    // 2. Fetch fresh config from database
    getReelsConfigServer()
      .then((serverCfg) => {
        if (serverCfg) {
          setCfg(serverCfg);
          if (typeof window !== "undefined") {
            try {
              localStorage.setItem("nt:reels-config:v2", JSON.stringify(serverCfg));
            } catch {}
          }
        }
      })
      .catch(() => {});

    return unsub;
  }, []);

  return cfg;
}
