import { useTranslation } from "@/lib/i18n";
import { Globe } from "lucide-react";
import { useEffect, useState, useRef } from "react";

declare global {
  interface Window {
    googleTranslateElementInit: () => void;
    google: any;
  }
}

export function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const loadGoogleTranslate = () => {
    if (typeof window === "undefined" || document.getElementById("google-translate-script")) return;
    window.googleTranslateElementInit = () => {
      if (window.google && window.google.translate) {
        try {
          new window.google.translate.TranslateElement(
            {
              pageLanguage: "en",
              includedLanguages: "hi,bn,en",
              layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
              autoDisplay: false,
            },
            "google_translate_element",
          );
        } catch {}
      }
    };
    const script = document.createElement("script");
    script.id = "google-translate-script";
    script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    script.async = true;
    document.body.appendChild(script);
  };

  useEffect(() => {
    if (typeof document !== "undefined" && document.cookie.includes("googtrans=")) {
      loadGoogleTranslate();
    }
  }, []);

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    setOpen(false);

    if (lng === "en") {
      document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      document.cookie =
        "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=" + location.hostname;
      window.location.reload();
      return;
    }

    loadGoogleTranslate();

    const applyLng = () => {
      const select = document.querySelector(".goog-te-combo") as HTMLSelectElement;
      if (select) {
        select.value = lng;
        select.dispatchEvent(new Event("change"));
      } else {
        setTimeout(applyLng, 300);
      }
    };
    applyLng();
  };

  const languages = [
    { code: "en", label: "English" },
    { code: "hi", label: "हिंदी" },
    { code: "bn", label: "বাংলা" },
  ];

  return (
    <>
      <style>
        {`
          body { top: 0 !important; }
          .goog-te-banner-frame { display: none !important; }
        `}
      </style>
      <div id="google_translate_element" style={{ display: "none" }}></div>
      <div className="relative inline-block" ref={containerRef}>
        <button
          type="button"
          onClick={() => {
            if (!open) loadGoogleTranslate();
            setOpen((v) => !v);
          }}
          aria-expanded={open}
          aria-haspopup="true"
          className="grid h-7 w-7 place-items-center border border-border text-foreground hover:bg-muted transition-colors focus:outline-none"
          title="Select Language"
        >
          <Globe className="h-4 w-4" />
        </button>

        {open && (
          <div className="absolute right-0 top-full mt-1 w-32 rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-lg z-50">
            {languages.map((lng) => (
              <button
                key={lng.code}
                type="button"
                onClick={() => changeLanguage(lng.code)}
                className={`w-full text-left px-2 py-1.5 text-xs rounded-sm hover:bg-muted transition-colors cursor-pointer ${
                  i18n.language === lng.code ? "bg-muted font-bold text-foreground" : "text-muted-foreground"
                }`}
              >
                {lng.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
