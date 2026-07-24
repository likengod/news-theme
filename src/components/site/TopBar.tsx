import { useState, useEffect } from "react";
import { Home, Menu, Search } from "lucide-react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ThemeToggle } from "./ThemeToggle";
import { UserMenu } from "./UserMenu";
import { SearchBox } from "./SearchModal";
import { sections } from "@/lib/news-data";
import { loadSettings, defaultSettings } from "@/lib/site-content";

const slugify = (s: string) => s.toLowerCase().replace(/\s+/g, "-");

const FONT_FAMILY_MAP: Record<string, string> = {
  inter: '"Inter", system-ui, sans-serif',
  serif: 'Georgia, Cambria, "Times New Roman", Times, serif',
  cinzel: '"Cinzel", serif, Georgia',
  playfair: '"Playfair Display", Georgia, serif',
  roboto: '"Roboto", Arial, sans-serif',
  mono: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
};

const GRADIENT_MAP: Record<string, string> = {
  "indian-flag": "linear-gradient(to right, #FF9933, #000080, #138808)",
  "diwali": "linear-gradient(to right, #FF8008, #FFC837, #FF007F, #7F00FF)",
  "sunset": "linear-gradient(to right, #F5576C, #F093FB)",
  "neon": "linear-gradient(to right, #FF007F, #7F00FF, #00F0FF)",
  "ocean": "linear-gradient(to right, #00c6ff, #0072ff)",
  "forest": "linear-gradient(to right, #11998e, #38ef7d)",
};

export function TopBar() {
  const [open, setOpen] = useState(false);
  const [settings, setSettings] = useState(defaultSettings);
  const [mounted, setMounted] = useState(false);
  const [showCustom, setShowCustom] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setSettings(loadSettings());
    setMounted(true);
    const handleUpdate = () => {
      setSettings(loadSettings());
    };
    window.addEventListener("nt:settings-updated", handleUpdate);
    return () => window.removeEventListener("nt:settings-updated", handleUpdate);
  }, []);

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });
  const todayShort = new Date().toLocaleDateString("en-US", {
    month: "short", day: "numeric",
  });

  const hasCustomRight = mounted && !!settings.topBarWeatherCustomText;
  const delay = Number(settings.topBarSwapDelay) || 5;

  useEffect(() => {
    if (!hasCustomRight) return;
    const interval = setInterval(() => {
      setShowCustom((prev) => !prev);
    }, delay * 1000);
    return () => clearInterval(interval);
  }, [hasCustomRight, delay]);

  const gradientStyle = mounted && settings.topBarTextGradient && GRADIENT_MAP[settings.topBarTextGradient]
    ? {
        backgroundImage: GRADIENT_MAP[settings.topBarTextGradient],
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
        display: "inline-block"
      }
    : undefined;

  return (
    <div 
      className="sticky top-0 z-45 h-11 border-b border-border bg-background/90 backdrop-blur-md transition-colors duration-300"
      style={{ 
        backgroundColor: (mounted && settings.topBarBgColor) || undefined,
        borderColor: (mounted && settings.topBarBgColor) ? "transparent" : undefined
      }}
    >
      <div 
        className={`mx-auto flex h-full max-w-7xl items-center justify-between gap-2 px-4 text-[11px] uppercase tracking-widest ${
          (mounted && settings.topBarTextColor) ? "" : "text-muted-foreground"
        }`}
        style={{ color: (mounted && settings.topBarTextColor) || undefined }}
      >
        <div className="flex-1 min-w-0">
          <span className="truncate">
            <span className="hidden sm:inline">{today}</span>
            <span className="sm:hidden">{todayShort}</span>
          </span>
        </div>

        <div className="relative hidden h-4 flex-1 min-w-0 overflow-hidden md:block">
          <div className={`absolute inset-y-0 left-0 flex items-center gap-4 transition-all duration-500 ${showCustom && hasCustomRight ? "-translate-y-full opacity-0" : "translate-y-0 opacity-100"}`}>
            <span>NYC 48°F</span>
            <span>LDN 9°C</span>
            <span>HKG 22°C</span>
          </div>
          {hasCustomRight && (
            <span 
              className={`absolute inset-y-0 left-0 flex items-center font-bold transition-all duration-500 ${showCustom ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"}`}
              style={{
                ...gradientStyle,
                fontFamily: FONT_FAMILY_MAP[settings.customAlertFontFamily || "inter"] || FONT_FAMILY_MAP["inter"],
                fontSize: settings.customAlertFontSize ? `${settings.customAlertFontSize}px` : undefined,
              }}
            >
              {settings.topBarWeatherCustomText}
            </span>
          )}
        </div>
        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <Link to="/subscription" className="hidden hover:text-foreground sm:inline">Subscribe</Link>
          <span className="hidden text-border sm:inline">|</span>
          <UserMenu />
          <SearchBox className="grid h-7 w-7 place-items-center border border-border text-foreground hover:bg-muted transition-colors" />

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <button
                type="button"
                aria-label="Open navigation"
                className="grid h-7 w-7 place-items-center border border-border text-foreground md:hidden"
              >
                <Menu className="h-4 w-4" />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72 bg-background p-0 flex flex-col h-full">
              <div className="flex flex-col h-full overflow-y-auto pb-8">
                <SheetHeader className="border-b border-border px-5 py-4 text-left">
                  <SheetTitle
                    className="text-foreground text-2xl uppercase tracking-wider font-extrabold"
                    style={{ fontFamily: '"Inter", system-ui, sans-serif', fontWeight: 800, letterSpacing: "0.05em" }}
                  >
                    News Theme
                  </SheetTitle>
                  <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                    Navigation
                  </p>
                </SheetHeader>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const fd = new FormData(e.currentTarget);
                    const q = String(fd.get("q") || "").trim();
                    if (q) {
                      navigate({ to: "/search", search: { q, page: 1 } });
                      setOpen(false);
                    }
                  }}
                  className="relative border-b border-border px-5 py-3"
                >
                  <Search className="pointer-events-none absolute left-7 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    name="q"
                    type="search"
                    placeholder="Search news…"
                    className="w-full border border-border bg-background py-2 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-foreground"
                  />
                </form>
                <nav>
                  <ul className="flex flex-col divide-y divide-border">
                    <li>
                      <Link
                        to="/"
                        onClick={() => setOpen(false)}
                        className="flex items-center gap-3 px-5 py-4 text-sm font-semibold uppercase tracking-wider text-foreground hover:bg-muted/40 hover:underline"
                      >
                        <Home className="h-4 w-4" />
                        Home
                      </Link>
                    </li>
                    {sections.map((s) => (
                      <li key={s}>
                        <Link
                          to="/$slug"
                          params={{ slug: slugify(s) }}
                          onClick={() => setOpen(false)}
                          className="block px-5 py-4 text-sm font-semibold uppercase tracking-wider text-foreground hover:bg-muted/40 hover:underline"
                        >
                          {s}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>
                <div className="mt-4 flex flex-col gap-3 border-t border-border px-5 py-4 text-xs uppercase tracking-widest text-muted-foreground">
                  <div className="flex items-center justify-between">
                    <span>Night mode</span>
                    <ThemeToggle />
                  </div>
                  <UserMenu variant="mobile" />
                  <Link to="/subscription" className="hover:text-foreground" onClick={() => setOpen(false)}>Subscribe</Link>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </div>
  );
}
