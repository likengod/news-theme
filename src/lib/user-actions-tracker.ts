// Client-side utility to track unique user actions to prevent reward gaming/cheating.
// Stored per user in localStorage.

const SHARED_KEY = "nt:unique-shares";
const READ_KEY = "nt:unique-reads";
const COMMENTED_KEY = "nt:unique-comments";

function getUniqueList(key: string, userId: string): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(`${key}:${userId}`);
    if (raw) return JSON.parse(raw) as string[];
  } catch {}
  return [];
}

function saveUniqueList(key: string, userId: string, list: string[]) {
  localStorage.setItem(`${key}:${userId}`, JSON.stringify(list));
}

export function trackShare(userId: string, slug: string): number {
  if (!userId || !slug) return 0;
  const list = getUniqueList(SHARED_KEY, userId);
  if (!list.includes(slug)) {
    list.push(slug);
    saveUniqueList(SHARED_KEY, userId, list);
    // Legacy key sync for earn-points page
    localStorage.setItem(`nt:shares:${userId}`, String(list.length));
  }
  return list.length;
}

export function trackRead(userId: string, slug: string): number {
  if (!userId || !slug) return 0;
  const list = getUniqueList(READ_KEY, userId);
  if (!list.includes(slug)) {
    list.push(slug);
    saveUniqueList(READ_KEY, userId, list);
    // Legacy key sync
    localStorage.setItem(`nt:reads:${userId}`, String(list.length));
  }
  return list.length;
}

export function trackComment(userId: string, slug: string): number {
  if (!userId || !slug) return 0;
  const list = getUniqueList(COMMENTED_KEY, userId);
  if (!list.includes(slug)) {
    list.push(slug);
    saveUniqueList(COMMENTED_KEY, userId, list);
    // Legacy key sync
    localStorage.setItem(`nt:comments:${userId}`, String(list.length));
  }
  return list.length;
}

export function getUniqueSharesCount(userId: string): number {
  return getUniqueList(SHARED_KEY, userId).length;
}

export function getUniqueReadsCount(userId: string): number {
  return getUniqueList(READ_KEY, userId).length;
}

export function getUniqueCommentsCount(userId: string): number {
  return getUniqueList(COMMENTED_KEY, userId).length;
}
