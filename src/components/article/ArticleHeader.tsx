import { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { Views } from "@/components/site/Views";
import { loadSettings } from "@/lib/site-content";

const FESTIVE_GRADIENT_MAP: Record<string, string> = {
  "indian-flag": "linear-gradient(to right, #FF9933, #000080, #138808)",
  "diwali": "linear-gradient(to right, #FF8008, #FFC837, #FF007F, #7F00FF)",
  "sunset": "linear-gradient(to right, #F5576C, #F093FB)",
  "neon": "linear-gradient(to right, #FF007F, #7F00FF, #00F0FF)",
  "ocean": "linear-gradient(to right, #00c6ff, #0072ff)",
  "forest": "linear-gradient(to right, #11998e, #38ef7d)",
};

type Props = {
  title: string;
  author: string;
  date: string;
  views: number;
  category?: string;
  deck?: string;
};

export function ArticleHeader({ title, author, date, views, category = "News", deck }: Props) {
  const [settings, setSettings] = useState(() => loadSettings());
  const [showCustomText, setShowCustomText] = useState(false);

  useEffect(() => {
    const handleUpdate = () => setSettings(loadSettings());
    window.addEventListener("nt:settings-updated", handleUpdate);
    return () => window.removeEventListener("nt:settings-updated", handleUpdate);
  }, []);

  useEffect(() => {
    if (!settings.topBarWeatherCustomText) return;
    const delay = (Number(settings.topBarSwapDelay) || 5) * 1000;
    const interval = setInterval(() => {
      setShowCustomText((prev) => !prev);
    }, delay);
    return () => clearInterval(interval);
  }, [settings.topBarWeatherCustomText, settings.topBarSwapDelay]);

  const activeGradient = settings.festiveCategoryTitleGradient || settings.topBarTextGradient;

  const badgeStyle = activeGradient && FESTIVE_GRADIENT_MAP[activeGradient]
    ? {
        backgroundImage: FESTIVE_GRADIENT_MAP[activeGradient],
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
        display: "inline-block",
      }
    : {
        color: settings.festiveCategoryTitleColor || settings.topBarTextColor || "#000000",
      };

  const badgeText = showCustomText && settings.topBarWeatherCustomText
    ? settings.topBarWeatherCustomText
    : category;

  return (
    <>
      <nav className="mb-1 text-xs uppercase tracking-widest text-muted-foreground">
        <Link to="/" className="hover:text-foreground">Home</Link>
        <span className="mx-2">/</span>
        <Link
          to="/$slug"
          params={{ slug: category.toLowerCase() }}
          className="hover:text-foreground"
        >
          {category}
        </Link>
      </nav>

      <header className="border-b border-border pb-3">
        <span
          key={showCustomText ? "custom" : "default"}
          className="inline-block text-xs font-extrabold uppercase tracking-widest animate-in fade-in duration-300"
          style={badgeStyle}
        >
          {badgeText}
        </span>
        <h1 className="headline mt-3 font-serif text-3xl font-bold leading-tight text-primary md:text-5xl">
          {title}
        </h1>
        {deck && (
          <p className="mt-3 text-lg leading-relaxed text-muted-foreground md:text-xl">
            {deck}
          </p>
        )}
        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs uppercase tracking-widest text-muted-foreground">
          <div className="flex items-center gap-4 flex-1 w-full">
            <div className="flex items-center gap-4">
              <span className="font-semibold text-foreground">By {author}</span>
              <span aria-hidden>•</span>
              <time>{date}</time>
              <span aria-hidden>•</span>
              <Views count={views} />
            </div>

            {(settings.googleNews && settings.googleNews !== "#") && (
              <a
                href={settings.googleNews || "https://news.google.com/"}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-auto flex items-center gap-2 transition hover:opacity-80 normal-case tracking-normal"
              >
              <img src="https://upload.wikimedia.org/wikipedia/commons/d/da/Google_News_icon.svg" alt="Google News" className="h-7 w-7" />
              <div className="flex flex-col items-start justify-center text-left font-sans">
                <span className="text-[9px] font-medium tracking-wide text-[#3c4043] uppercase leading-none mb-[1px]">Follow on</span>
                <span className="text-[15px] font-medium leading-none tracking-tight flex items-center">
                  <span className="text-[#4285F4]">G</span>
                  <span className="text-[#EA4335]">o</span>
                  <span className="text-[#FBBC05]">o</span>
                  <span className="text-[#4285F4]">g</span>
                  <span className="text-[#34A853]">l</span>
                  <span className="text-[#EA4335]">e</span>
                  <span className="text-[#3c4043] ml-1">News</span>
                </span>
              </div>
            </a>
            )}
          </div>
        </div>
      </header>
    </>
  );
}
