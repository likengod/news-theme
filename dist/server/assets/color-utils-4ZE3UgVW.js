//#region src/lib/color-utils.ts
function hexToRgb(hex) {
	if (!hex || typeof hex !== "string") return null;
	let clean = hex.trim().replace(/^#/, "");
	if (clean.length === 3) clean = clean.split("").map((c) => c + c).join("");
	if (clean.length !== 6) return null;
	const num = parseInt(clean, 16);
	if (isNaN(num)) return null;
	return {
		r: num >> 16 & 255,
		g: num >> 8 & 255,
		b: num & 255
	};
}
function rgbToHex({ r, g, b }) {
	const clamp = (n) => Math.max(0, Math.min(255, Math.round(n)));
	const toHex = (n) => clamp(n).toString(16).padStart(2, "0");
	return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}
function getRelativeLuminance({ r, g, b }) {
	const [rs, gs, bs] = [
		r,
		g,
		b
	].map((c) => {
		const s = c / 255;
		return s <= .03928 ? s / 12.92 : Math.pow((s + .055) / 1.055, 2.4);
	});
	return .2126 * rs + .7152 * gs + .0722 * bs;
}
function getContrastRatio(hex1, hex2 = "#ffffff") {
	const rgb1 = hexToRgb(hex1);
	const rgb2 = hexToRgb(hex2);
	if (!rgb1 || !rgb2) return 1;
	const l1 = getRelativeLuminance(rgb1);
	const l2 = getRelativeLuminance(rgb2);
	const lighter = Math.max(l1, l2);
	const darker = Math.min(l1, l2);
	return (lighter + .05) / (darker + .05);
}
function ensureAccessibleColor(textColor, bgColor = "#ffffff", minRatio = 4.5) {
	const textRgb = hexToRgb(textColor);
	const bgRgb = hexToRgb(bgColor);
	if (!textRgb || !bgRgb) return textColor;
	if (getContrastRatio(textColor, bgColor) >= minRatio) return textColor;
	const isLightBg = getRelativeLuminance(bgRgb) >= .5;
	let best = { ...textRgb };
	if (isLightBg) for (let factor = .95; factor >= .05; factor -= .02) {
		const candidate = {
			r: Math.round(textRgb.r * factor),
			g: Math.round(textRgb.g * factor),
			b: Math.round(textRgb.b * factor)
		};
		const candidateHex = rgbToHex(candidate);
		if (getContrastRatio(candidateHex, bgColor) >= minRatio) return candidateHex;
		best = candidate;
	}
	else for (let factor = .05; factor <= 1; factor += .02) {
		const candidate = {
			r: Math.round(textRgb.r + (255 - textRgb.r) * factor),
			g: Math.round(textRgb.g + (255 - textRgb.g) * factor),
			b: Math.round(textRgb.b + (255 - textRgb.b) * factor)
		};
		const candidateHex = rgbToHex(candidate);
		if (getContrastRatio(candidateHex, bgColor) >= minRatio) return candidateHex;
		best = candidate;
	}
	return rgbToHex(best);
}
/**
* Resolves a logo color that guarantees WCAG compliance against light or dark themes.
*/
function getAccessibleLogoColor(color = "#dc2626", isDark = false, minRatio = 4.5) {
	return ensureAccessibleColor(color || "#dc2626", isDark ? "#0f172a" : "#ffffff", minRatio);
}
//#endregion
export { getAccessibleLogoColor as n, getContrastRatio as r, ensureAccessibleColor as t };

//# sourceMappingURL=color-utils-4ZE3UgVW.js.map