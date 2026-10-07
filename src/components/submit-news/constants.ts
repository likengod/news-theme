export const MIN_WORDS = 60;
export const IMAGE_MAX_MB = 8;
export const PDF_MAX_MB = 15;

export function countWords(text: string) {
  return text.trim().split(/\s+/).filter(Boolean).length;
}
