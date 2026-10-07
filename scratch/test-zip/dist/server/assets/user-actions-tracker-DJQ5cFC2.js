//#region src/lib/user-actions-tracker.ts
var SHARED_KEY = "nt:unique-shares";
var READ_KEY = "nt:unique-reads";
var COMMENTED_KEY = "nt:unique-comments";
function getUniqueList(key, userId) {
	if (typeof window === "undefined") return [];
	try {
		const raw = localStorage.getItem(`${key}:${userId}`);
		if (raw) return JSON.parse(raw);
	} catch {}
	return [];
}
function saveUniqueList(key, userId, list) {
	localStorage.setItem(`${key}:${userId}`, JSON.stringify(list));
}
function trackShare(userId, slug) {
	if (!userId || !slug) return 0;
	const list = getUniqueList(SHARED_KEY, userId);
	if (!list.includes(slug)) {
		list.push(slug);
		saveUniqueList(SHARED_KEY, userId, list);
		localStorage.setItem(`nt:shares:${userId}`, String(list.length));
	}
	return list.length;
}
function trackRead(userId, slug) {
	if (!userId || !slug) return 0;
	const list = getUniqueList(READ_KEY, userId);
	if (!list.includes(slug)) {
		list.push(slug);
		saveUniqueList(READ_KEY, userId, list);
		localStorage.setItem(`nt:reads:${userId}`, String(list.length));
	}
	return list.length;
}
function trackComment(userId, slug) {
	if (!userId || !slug) return 0;
	const list = getUniqueList(COMMENTED_KEY, userId);
	if (!list.includes(slug)) {
		list.push(slug);
		saveUniqueList(COMMENTED_KEY, userId, list);
		localStorage.setItem(`nt:comments:${userId}`, String(list.length));
	}
	return list.length;
}
function getUniqueSharesCount(userId) {
	return getUniqueList(SHARED_KEY, userId).length;
}
function getUniqueReadsCount(userId) {
	return getUniqueList(READ_KEY, userId).length;
}
function getUniqueCommentsCount(userId) {
	return getUniqueList(COMMENTED_KEY, userId).length;
}
//#endregion
export { trackRead as a, trackComment as i, getUniqueReadsCount as n, trackShare as o, getUniqueSharesCount as r, getUniqueCommentsCount as t };

//# sourceMappingURL=user-actions-tracker-DJQ5cFC2.js.map