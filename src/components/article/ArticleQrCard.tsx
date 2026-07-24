import { useMemo, useState, useEffect } from "react";
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
  url: string;
};

export function ArticleQrCard({ url }: Props) {
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

  const qrCodeUrl = useMemo(() => {
    return `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(url)}`;
  }, [url]);

  const activeGradient = settings.festiveScanMeTextGradient || settings.topBarTextGradient || settings.festiveCategoryTitleGradient;
  const activeColor = settings.festiveScanMeTextColor || settings.festiveCategoryTitleColor || settings.topBarTextColor || "#000000";

  const scanMeStyle = activeGradient && FESTIVE_GRADIENT_MAP[activeGradient]
    ? {
        backgroundImage: FESTIVE_GRADIENT_MAP[activeGradient],
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
        display: "inline-block",
      }
    : { color: activeColor };

  const subtextStyle = settings.festiveScanMeSubtextColor
    ? { color: settings.festiveScanMeSubtextColor }
    : undefined;

  const textToDisplay = showCustomText && settings.topBarWeatherCustomText
    ? settings.topBarWeatherCustomText
    : (settings.festiveScanMeCustomText || "SCAN ME");

  return (
    <div className="inline-flex items-center gap-2.5">
      <div>
        <h4
          key={showCustomText ? "custom" : "default"}
          className="text-xs font-extrabold uppercase leading-tight tracking-tight sm:text-sm animate-in fade-in duration-300"
          style={scanMeStyle}
        >
          {textToDisplay}
        </h4>
        {!(showCustomText && settings.topBarWeatherCustomText) && (
          <p
            className="text-[10px] font-medium text-slate-500 dark:text-slate-400 animate-in fade-in duration-300"
            style={subtextStyle}
          >
            {settings.festiveScanMeSubtext || "to read article"}
          </p>
        )}
      </div>

      <div className="h-9 w-9 overflow-hidden rounded border border-slate-200 bg-white p-0.5 dark:border-slate-800">
        <img
          src={qrCodeUrl}
          alt="Scan QR code to read article on mobile"
          className="h-full w-full object-contain"
          loading="lazy"
        />
      </div>
    </div>
  );
}
