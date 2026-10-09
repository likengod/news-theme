import { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  Tv,
  Clapperboard,
  Video,
  Image as ImageIcon,
  MessageSquareQuote,
  GraduationCap,
  ShieldCheck,
  Calculator,
  CalendarDays,
  Newspaper,
} from "lucide-react";
import { useSiteSettings } from "@/components/site/AdSettingsContext";
import { useTranslation } from "@/lib/i18n";
import { EmiCalculatorModal } from "./EmiCalculatorModal";
import { AgeCalculatorModal } from "./AgeCalculatorModal";

export function ArticleLeftNav() {
  const [showEmiModal, setShowEmiModal] = useState(false);
  const [showAgeModal, setShowAgeModal] = useState(false);
  const { t, i18n } = useTranslation();
  const settings = useSiteSettings();
  const items = settings?.articleLeftNavItems || {};

  const showLive = items.live !== false;
  const showReels = items.reels !== false;
  const showResults = items.results !== false;
  const showVideos = items.videos !== false;
  const showPhotos = items.photos !== false;
  const showFactCheck = items.factCheck !== false;
  const showOpinion = items.opinion !== false;
  const showArchive = items.archive !== false;
  const showEmi = items.emiCalculator !== false;
  const showAge = items.ageCalculator !== false;

  const hasAnyMainLinks =
    showLive ||
    showReels ||
    showResults ||
    showVideos ||
    showPhotos ||
    showFactCheck ||
    showOpinion ||
    showArchive;

  const hasAnyUtilities = showEmi || showAge;

  if (!hasAnyMainLinks && !hasAnyUtilities) {
    return null;
  }

  return (
    <>
      <aside
        aria-label="Side Navigation"
        className="hidden xl:flex flex-col w-[140px] shrink-0 sticky top-14 self-start space-y-4 py-2 select-none border-r border-slate-200/80 dark:border-slate-800 pr-2"
      >
        {/* Main Navigation Links */}
        {hasAnyMainLinks && (
          <nav className="flex flex-col space-y-0.5 text-[12px] font-medium text-slate-700 dark:text-slate-300">
            {/* Live */}
            {showLive && (
              <Link
                to="/"
                search={{ category: "live" }}
                className="group flex items-center gap-2.5 rounded-lg px-2 py-1.5 transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30 dark:hover:text-red-400"
              >
                <div className="relative flex h-5 w-5 shrink-0 items-center justify-center">
                  <Tv className="h-4 w-4 text-slate-600 group-hover:text-red-600 dark:text-slate-400" />
                  <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-red-600"></span>
                  </span>
                </div>
                <span className="truncate">{t("sideNav.live", "Live")}</span>
              </Link>
            )}

            {/* Reels / Shorts */}
            {showReels && (
              <Link
                to="/reels"
                className="group flex items-center gap-2.5 rounded-lg px-2 py-1.5 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-white"
              >
                <Clapperboard className="h-4 w-4 shrink-0 text-slate-600 group-hover:text-red-600 dark:text-slate-400" />
                <span className="truncate font-semibold text-slate-900 dark:text-white">{t("sideNav.reels", "Shorts / Reels")}</span>
              </Link>
            )}

            {/* Result */}
            {showResults && (
              <Link
                to="/results"
                className="group flex items-center gap-2.5 rounded-lg px-2 py-1.5 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-white"
              >
                <GraduationCap className="h-4 w-4 shrink-0 text-slate-600 group-hover:text-red-600 dark:text-slate-400" />
                <span className="truncate">{t("sideNav.results", "Results")}</span>
              </Link>
            )}

            {/* Video */}
            {showVideos && (
              <Link
                to="/reels"
                className="group flex items-center gap-2.5 rounded-lg px-2 py-1.5 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-white"
              >
                <Video className="h-4 w-4 shrink-0 text-slate-600 group-hover:text-red-600 dark:text-slate-400" />
                <span className="truncate">{t("sideNav.videos", "Videos")}</span>
              </Link>
            )}

            {/* Photo Gallery */}
            {showPhotos && (
              <Link
                to="/"
                search={{ category: "photos" }}
                className="group flex items-center gap-2.5 rounded-lg px-2 py-1.5 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-white"
              >
                <ImageIcon className="h-4 w-4 shrink-0 text-slate-600 group-hover:text-red-600 dark:text-slate-400" />
                <span className="truncate">{t("sideNav.photos", "Photo Gallery")}</span>
              </Link>
            )}

            {/* Fact Check */}
            {showFactCheck && (
              <Link
                to="/fact-check"
                className="group flex items-center gap-2.5 rounded-lg px-2 py-1.5 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-white"
              >
                <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                <span className="truncate">{t("sideNav.factCheck", "Fact Check")}</span>
              </Link>
            )}

            {/* Opinion */}
            {showOpinion && (
              <Link
                to="/"
                search={{ category: "opinion" }}
                className="group flex items-center gap-2.5 rounded-lg px-2 py-1.5 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-white"
              >
                <MessageSquareQuote className="h-4 w-4 shrink-0 text-slate-600 group-hover:text-red-600 dark:text-slate-400" />
                <span className="truncate">{t("sideNav.opinion", "Opinion")}</span>
              </Link>
            )}

            {/* Archive */}
            {showArchive && (
              <Link
                to="/archive"
                className="group flex items-center gap-2.5 rounded-lg px-2 py-1.5 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-white"
              >
                <Newspaper className="h-4 w-4 shrink-0 text-slate-600 group-hover:text-red-600 dark:text-slate-400" />
                <span className="truncate">{t("sideNav.archive", "Archive")}</span>
              </Link>
            )}
          </nav>
        )}

        {/* Urgent / Utilities Section */}
        {hasAnyUtilities && (
          <div className="border-t border-slate-200 dark:border-slate-800 pt-3">
            <div className="px-2 pb-1.5 text-[11px] font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-red-600" />
              <span>{t("sideNav.urgent", "Utilities")}</span>
            </div>

            <div className="flex flex-col space-y-0.5 text-[11px] font-medium text-slate-600 dark:text-slate-400">
              {/* EMI Calculator */}
              {showEmi && (
                <button
                  type="button"
                  onClick={() => setShowEmiModal(true)}
                  className="group flex items-center gap-2.5 rounded-lg px-2 py-1.5 text-left transition-colors hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-white cursor-pointer"
                >
                  <Calculator className="h-3.5 w-3.5 shrink-0 text-slate-500 group-hover:text-red-600" />
                  <span className="truncate">{t("sideNav.emiCalculator", "EMI Calculator")}</span>
                </button>
              )}

              {/* Age Calculator */}
              {showAge && (
                <button
                  type="button"
                  onClick={() => setShowAgeModal(true)}
                  className="group flex items-start gap-2 rounded-lg px-2 py-1.5 text-left transition-colors hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-white cursor-pointer"
                >
                  <CalendarDays className="h-3.5 w-3.5 mt-0.5 shrink-0 text-slate-500 group-hover:text-blue-600" />
                  <span className="leading-tight">{t("sideNav.ageCalculator", "Age Calculator")}</span>
                </button>
              )}
            </div>
          </div>
        )}
      </aside>

      {/* Interactive Modals */}
      <EmiCalculatorModal isOpen={showEmiModal} onClose={() => setShowEmiModal(false)} />
      <AgeCalculatorModal isOpen={showAgeModal} onClose={() => setShowAgeModal(false)} />
    </>
  );
}
