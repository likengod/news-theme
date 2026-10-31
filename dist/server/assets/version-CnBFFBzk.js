// src/lib/version.ts
var APP_VERSION = "v1.2.32";
function parseSemver(v) {
	if (!v) return 0;
	const parts = v.replace(/^v/, "").split(".").map((n) => parseInt(n, 10) || 0);
	return (parts[0] || 0) * 1e6 + (parts[1] || 0) * 1e3 + (parts[2] || 0);
}
export { parseSemver as n, APP_VERSION as t };

//# sourceMappingURL=version-CnBFFBzk.js.map