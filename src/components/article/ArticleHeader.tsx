import { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { Views } from "@/components/site/Views";
import { loadSettings } from "@/lib/site-content";
import { slugify } from "@/lib/news-data";
import { Share2, Check } from "lucide-react";
import { toast } from "sonner";

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
  shareUrl?: string;
};

export function ArticleHeader({
  title,
  author,
  date,
  views,
  category = "News",
  deck,
  shareUrl,
}: Props) {
  const [settings, setSettings] = useState(() => loadSettings());
  const [showCustomText, setShowCustomText] = useState(false);
  const [copied, setCopied] = useState(false);

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

  const handleShare = async () => {
    const url =
      shareUrl || (typeof window !== "undefined" ? window.location.href : "");
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title,
          text: deck || title,
          url,
        });
        return;
      } catch (err: any) {
        if (err?.name !== "AbortError") {
          console.warn("Share failed, falling back to copy:", err);
        } else {
          return;
        }
      }
    }

    if (typeof navigator !== "undefined" && navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        toast.success("Link copied to clipboard!");
        setTimeout(() => setCopied(false), 2000);
      } catch {
        toast.error("Failed to copy link");
      }
    }
  };

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
          color: settings.festiveCategoryTitleColor || settings.topBarTextColor || "#dc2626",
        };

  const categoriesList = (category || "News")
    .split(",")
    .map((c) => c.trim())
    .filter(Boolean);
  if (categoriesList.length === 0) categoriesList.push("News");

  return (
    <header className="mb-4 w-full">
      {/* Breadcrumb / Category Row */}
      <nav className="mb-2.5 flex flex-wrap items-center text-xs tracking-wide text-muted-foreground">
        <Link to="/" className="hover:text-foreground transition-colors font-medium">
          Home
        </Link>
        {categoriesList.map((cat) => (
          <span key={cat} className="inline-flex items-center">
            <span className="mx-2 text-muted-foreground/40 font-light">/</span>
            <Link
              to="/$slug"
              params={{ slug: slugify(cat) }}
              className="hover:text-red-600 dark:hover:text-red-400 transition-colors font-semibold"
              style={badgeStyle}
            >
              {cat}
            </Link>
          </span>
        ))}

        {hasCustomAlert && showCustomText && (
          <span className="ml-3 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider animate-in fade-in duration-300">
            {settings.festiveAlertImage ? (
              <img
                src={settings.festiveAlertImage}
                alt="Alert"
                className="h-4 w-auto max-w-[70px] object-contain shrink-0 align-middle"
              />
            ) : (
              <span style={badgeStyle}>{settings.topBarWeatherCustomText}</span>
            )}
          </span>
        )}
      </nav>

      {/* Main Headline - Bold, high impact, ABP Ananda style */}
      <h1 className="text-2xl sm:text-3xl md:text-[34px] lg:text-[38px] font-bold text-slate-950 dark:text-white leading-[1.3] tracking-tight mb-3">
        {title}
      </h1>

      {/* Excerpt / Dek / Sub-headline - ABP Ananda style */}
      {deck && (
        <p className="text-base sm:text-lg text-slate-700 dark:text-slate-300 leading-relaxed font-normal mb-3">
          {deck}
        </p>
      )}

      {/* Byline & Metadata Bar */}
      <div className="border-y border-slate-200 dark:border-slate-800/80 py-2.5 my-3 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600 dark:text-slate-400">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <span>
            Written By :{" "}
            <span className="font-semibold text-red-600 dark:text-red-500">
              {author || "Newsroom"}
            </span>
          </span>
          <span className="text-slate-300 dark:text-slate-700 font-light">|</span>
          <span>
            Updated at : <time className="text-slate-700 dark:text-slate-300 font-medium">{date}</time>
          </span>
          {views > 0 && (
            <>
              <span className="text-slate-300 dark:text-slate-700 font-light">|</span>
              <Views count={views} />
            </>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Quick Share Button */}
          <button
            type="button"
            onClick={handleShare}
            aria-label="Share article"
            title="Share article"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors"
          >
            {copied ? (
              <Check className="h-4 w-4 text-green-600" />
            ) : (
              <Share2 className="h-4 w-4" />
            )}
          </button>

          {/* Google News follow badge */}
          {settings.googleNews && settings.googleNews !== "#" && (
            <a
              href={settings.googleNews || "https://news.google.com/"}
              target="_blank"
              rel="noopener noreferrer"
              title="Follow on Google News"
              className="flex shrink-0 items-center gap-1.5 transition hover:opacity-85 rounded-full border border-slate-200 dark:border-slate-800 px-2.5 py-1 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/50"
            >
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/d/da/Google_News_icon.svg"
                alt="Google News"
                className="h-4 w-4"
              />
              <span className="text-[11px] font-medium leading-none">Google News</span>
            </a>
          )}
        </div>
      </div>
    </header>
  );
}
