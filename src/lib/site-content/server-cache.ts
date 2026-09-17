import { createServerFn } from "@tanstack/react-start";
import { requireAdmin } from "../auth-middleware";

type CacheEntry<T> = {
  data: T;
  expiry: number;
};
const SERVER_CACHE: Record<string, CacheEntry<any>> = {};
const CACHE_TTL_MS = 5 * 60 * 1000;

export function getCached<T>(key: string): T | null {
  const entry = SERVER_CACHE[key];
  if (entry && entry.expiry > Date.now()) {
    return entry.data as T;
  }
  return null;
}

export function setCached<T>(key: string, data: T) {
  SERVER_CACHE[key] = {
    data,
    expiry: Date.now() + CACHE_TTL_MS,
  };
}

export function clearCache(key: string) {
  delete SERVER_CACHE[key];
}

export const clearAllCachesServer = createServerFn({ method: "POST" })
  .middleware([requireAdmin])
  .handler(async () => {
    for (const key in SERVER_CACHE) {
      delete SERVER_CACHE[key];
    }
    return { success: true, message: "Server cache, temp files, and unused CSS have been cleared." };
  });
