/**
 * Separated from homepage-config.ts to break the synchronous import chain:
 *   homepage-config.js → news-data.js
 * Components that use articlesByCategory() already import news-data anyway,
 * so this file only adds a dependency for consumers that actually call it.
 */
import { lead, top, grid, type Article } from "./news-data";

/** Pick items matching a category (kicker substring match), latest first. */
export function articlesByCategory(category?: string): Article[] {
  const pool: Article[] = [lead as Article, ...(top as Article[]), ...(grid as Article[])];
  if (!category || category === "Auto (Latest)") return pool;
  const c = category.toLowerCase();
  const matched = pool.filter((a) => (a.kicker ?? "").toLowerCase().includes(c));
  return matched.length > 0 ? matched : pool;
}
