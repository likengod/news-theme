import { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { Views } from "@/components/site/Views";
import { loadSettings } from "@/lib/site-content";
import { slugify } from "@/lib/news-data";

const FESTIVE_GRADIENT_MAP: Record<string, string> = {
  "indian-flag": "linear-gradient(to right, #FF9933, #000080, #138808)",
  diwali: "linear-gradient(to right, #FF8008, #FFC837, #FF007F, #7F00FF)",
  sunset: "linear-gradient(to right, #F5576C, #F093FB)",
  neon: "linear-gradient(to right, #FF007F, #7F00FF, #00F0FF)",
  ocean: "linear-gradient(to right, #00c6ff, #0072ff)",
  forest: "linear-gradient(to right, #11998e, #38ef7d)",
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

  const hasCustomAlert =
    settings.festiveThemeEnabled !== false &&
    (!!settings.topBarWeatherCustomText || !!settings.festiveAlertImage);

  useEffect(() => {
    if (!hasCustomAlert) {
      setShowCustomText(false);
      return;
    }
    const delay = (Number(settings.topBarSwapDelay) || 5) * 1000;
    const interval = setInterval(() => {
      setShowCustomText((prev) => !prev);
    }, delay);
    return () => clearInterval(interval);
  }, [hasCustomAlert, settings.topBarSwapDelay]);

  const activeGradient = settings.festiveCategoryTitleGradient || settings.topBarTextGradient;

  const resolvedGrad =
    activeGradient &&
    (FESTIVE_GRADIENT_MAP[activeGradient] ||
      (activeGradient.includes("gradient(") ? activeGradient : null));

  const badgeStyle =
    resolvedGrad
      ? {
          backgroundImage: resolvedGrad,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          display: "inline-block",
        }
      : {
          color: settings.festiveCategoryTitleColor || settings.topBarTextColor || "#000000",
        };

  const categoriesList = (category || "News")
    .split(",")
    .map((c) => c.trim())
    .filter(Boolean);
  if (categoriesList.length === 0) categoriesList.push("News");

  return (
    <>
      <nav className="mb-1 flex flex-wrap items-center text-xs uppercase tracking-widest text-muted-foreground">
        <Link to="/" className="hover:text-foreground">
          Home
        </Link>
        {categoriesList.map((cat) => (
          <span key={cat} className="inline-flex items-center">
            <span className="mx-2 text-muted-foreground/50">/</span>
            <Link
              to="/$slug"
              params={{ slug: slugify(cat) }}
              className="hover:text-foreground transition-colors"
            >
              {cat}
            </Link>
          </span>
        ))}
      </nav>

      <header className="border-b border-border pb-3">
        {hasCustomAlert && showCustomText ? (
          <span
            key="custom"
            className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-widest animate-in fade-in duration-300"
          >
            {settings.festiveAlertImage ? (
              <img
                src={settings.festiveAlertImage}
                alt="Alert"
                className="h-5 w-auto max-w-[80px] object-contain shrink-0 align-middle"
              />
            ) : (
              <span style={badgeStyle}>{settings.topBarWeatherCustomText}</span>
            )}
          </span>
        ) : (
          <div className="flex flex-wrap items-center gap-2">
            {categoriesList.map((cat, idx) => (
              <Link
                key={cat}
                to="/$slug"
                params={{ slug: slugify(cat) }}
                className={`inline-flex items-center text-xs font-extrabold uppercase tracking-widest hover:opacity-80 transition-opacity ${
                  idx > 0 ? "opacity-90" : ""
                }`}
                style={badgeStyle}
              >
                <span>{cat}</span>
                {idx < categoriesList.length - 1 && (
                  <span className="ml-2 text-muted-foreground/40 font-normal">·</span>
                )}
              </Link>
            ))}
          </div>
        )}
        <h1 className="headline mt-3 font-serif text-3xl font-bold leading-tight text-primary md:text-5xl">
          {title}
        </h1>
        {deck && (
          <p className="mt-3 text-lg leading-relaxed text-muted-foreground md:text-xl">{deck}</p>
        )}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-y-3 gap-x-2 text-[10px] sm:text-xs uppercase tracking-widest text-muted-foreground">
          <div className="flex flex-wrap items-center gap-x-2 sm:gap-x-4 gap-y-1 flex-1">
            <span className="font-semibold text-foreground">By {author}</span>
            <span aria-hidden>•</span>
            <time>
              {date.split(/ at /i)[0]}
              {date.split(/ at /i)[1] && (
                <span className="hidden sm:inline"> AT {date.split(/ at /i)[1]}</span>
              )}
            </time>
            <span aria-hidden>•</span>
            <Views count={views} />
          </div>

          {settings.googleNews && settings.googleNews !== "#" && (
            <a
              href={settings.googleNews || "https://news.google.com/"}
              target="_blank"
              rel="noopener noreferrer"
              title="Follow on Google News"
              className="flex shrink-0 items-center gap-2 transition hover:opacity-80 normal-case tracking-normal rounded hover:bg-muted p-1 sm:p-0"
            >
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/d/da/Google_News_icon.svg"
                alt="Google News"
                className="h-6 w-6 sm:h-7 sm:w-7"
              />
              <div className="flex flex-col items-start justify-center text-left font-sans">
                <span className="text-[9px] font-medium tracking-wide text-[#3c4043] uppercase leading-none mb-[1px]">
                  Follow on
                </span>
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
      </header>
    </>
  );
}
