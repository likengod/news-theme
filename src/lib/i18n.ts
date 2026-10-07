import { useState, useEffect } from "react";
import translationEN from "../locales/en/translation.json";
import translationHI from "../locales/hi/translation.json";
import translationBN from "../locales/bn/translation.json";

const resources: Record<string, any> = {
  en: translationEN,
  hi: translationHI,
  bn: translationBN,
};

let currentLanguage = "en";
const listeners = new Set<() => void>();

function detectInitialLanguage(): string {
  if (typeof window === "undefined") return "en";
  try {
    const cookie = document.cookie;
    if (cookie.includes("googtrans=/en/hi") || cookie.includes("googtrans=%2Fen%2Fhi")) return "hi";
    if (cookie.includes("googtrans=/en/bn") || cookie.includes("googtrans=%2Fen%2Fbn")) return "bn";
    const stored = localStorage.getItem("nt_i18n_lang");
    if (stored && resources[stored]) return stored;
    const navLang = navigator.language?.toLowerCase() || "";
    if (navLang.startsWith("hi")) return "hi";
    if (navLang.startsWith("bn")) return "bn";
  } catch {}
  return "en";
}

if (typeof window !== "undefined") {
  currentLanguage = detectInitialLanguage();
}

export const i18n = {
  get language() {
    return currentLanguage;
  },
  changeLanguage(lng: string) {
    if (resources[lng]) {
      currentLanguage = lng;
    } else {
      currentLanguage = "en";
    }
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("nt_i18n_lang", currentLanguage);
      } catch {}
    }
    listeners.forEach((fn) => fn());
    return Promise.resolve();
  },
};

export function useTranslation() {
  const [, setTick] = useState(0);

  useEffect(() => {
    const handler = () => setTick((t) => t + 1);
    listeners.add(handler);
    return () => {
      listeners.delete(handler);
    };
  }, []);

  const t = (key: string, fallback?: string): string => {
    const parts = key.split(".");
    let current: any = resources[currentLanguage] || resources.en;
    for (const part of parts) {
      if (current && typeof current === "object" && part in current) {
        current = current[part];
      } else {
        current = undefined;
        break;
      }
    }
    if (typeof current === "string") return current;
    if (fallback !== undefined) return fallback;
    return parts[parts.length - 1] || key;
  };

  return { t, i18n };
}

export default i18n;
