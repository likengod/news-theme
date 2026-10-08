export const APP_VERSION = "v1.1.78";

export function parseSemver(v?: string) {
  if (!v) return 0;
  const parts = v
    .replace(/^v/, "")
    .split(".")
    .map((n) => parseInt(n, 10) || 0);
  return (parts[0] || 0) * 1000000 + (parts[1] || 0) * 1000 + (parts[2] || 0);
}
