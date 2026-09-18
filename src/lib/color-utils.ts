/**
 * WCAG 2.1 Compliant Color & Contrast Utility
 * Calculates luminance and ensures sufficient contrast ratios for accessibility.
 */

export type RGB = { r: number; g: number; b: number };

export function hexToRgb(hex: string): RGB | null {
  if (!hex || typeof hex !== "string") return null;
  let clean = hex.trim().replace(/^#/, "");
  if (clean.length === 3) {
    clean = clean
      .split("")
      .map((c) => c + c)
      .join("");
  }
  if (clean.length !== 6) return null;
  const num = parseInt(clean, 16);
  if (isNaN(num)) return null;
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

export function rgbToHex({ r, g, b }: RGB): string {
  const clamp = (n: number) => Math.max(0, Math.min(255, Math.round(n)));
  const toHex = (n: number) => clamp(n).toString(16).padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

export function getRelativeLuminance({ r, g, b }: RGB): number {
  const [rs, gs, bs] = [r, g, b].map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

export function getContrastRatio(hex1: string, hex2: string = "#ffffff"): number {
  const rgb1 = hexToRgb(hex1);
  const rgb2 = hexToRgb(hex2);
  if (!rgb1 || !rgb2) return 1;

  const l1 = getRelativeLuminance(rgb1);
  const l2 = getRelativeLuminance(rgb2);

  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

export function isAccessibleContrast(
  textColor: string,
  bgColor: string = "#ffffff",
  minRatio: number = 4.5,
): boolean {
  return getContrastRatio(textColor, bgColor) >= minRatio;
}

export function ensureAccessibleColor(
  textColor: string,
  bgColor: string = "#ffffff",
  minRatio: number = 4.5,
): string {
 const textRgb = hexToRgb(textColor);
 const bgRgb = hexToRgb(bgColor);
 if (!textRgb || !bgRgb) return textColor;

 const currentRatio = getContrastRatio(textColor, bgColor);
 if (currentRatio >= minRatio) {
 return textColor;
 }

 const bgLum = getRelativeLuminance(bgRgb);
 const isLightBg = bgLum >= 0.5;

 let best = { ...textRgb };

 if (isLightBg) {
 for (let factor = 0.95; factor >= 0.05; factor -= 0.02) {
 const candidate: RGB = {
 r: Math.round(textRgb.r * factor),
 g: Math.round(textRgb.g * factor),
 b: Math.round(textRgb.b * factor),
 };
 const candidateHex = rgbToHex(candidate);
 if (getContrastRatio(candidateHex, bgColor) >= minRatio) {
 return candidateHex;
 }
 best = candidate;
 }
 } else {
 for (let factor = 0.05; factor <= 1; factor += 0.02) {
 const candidate: RGB = {
 r: Math.round(textRgb.r + (255 - textRgb.r) * factor),
 g: Math.round(textRgb.g + (255 - textRgb.g) * factor),
 b: Math.round(textRgb.b + (255 - textRgb.b) * factor),
 };
 const candidateHex = rgbToHex(candidate);
 if (getContrastRatio(candidateHex, bgColor) >= minRatio) {
 return candidateHex;
 }
 best = candidate;
 }
 }

  return rgbToHex(best);
}

/**
 * Resolves a logo color that guarantees WCAG compliance against light or dark themes.
 */
export function getAccessibleLogoColor(
  color: string = "#dc2626",
  isDark: boolean = false,
  minRatio: number = 4.5,
): string {
  const bg = isDark ? "#0f172a" : "#ffffff";
  return ensureAccessibleColor(color || "#dc2626", bg, minRatio);
}
