import { useTranslation } from "react-i18next";
import { Globe } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useEffect } from "react";

declare global {
  interface Window {
    googleTranslateElementInit: () => void;
    google: any;
  }
}

export function LanguageSwitcher() {
  const { i18n } = useTranslation();

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
    // Only load during initial mount if the visitor has a pre-existing translation cookie
    if (typeof document !== "undefined" && document.cookie.includes("googtrans=")) {
      loadGoogleTranslate();
    }
  }, []);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);

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
      <DropdownMenu
        onOpenChange={(open) => {
          if (open) loadGoogleTranslate();
        }}
      >
        <DropdownMenuTrigger asChild>
          <button
            className="grid h-7 w-7 place-items-center border border-border text-foreground hover:bg-muted transition-colors focus:outline-none"
            title="Select Language"
          >
            <Globe className="h-4 w-4" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-32 bg-background z-50">
          {languages.map((lng) => (
            <DropdownMenuItem
              key={lng.code}
              onClick={() => changeLanguage(lng.code)}
              className={`cursor-pointer ${i18n.language === lng.code ? "bg-muted font-bold" : ""}`}
            >
              {lng.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
