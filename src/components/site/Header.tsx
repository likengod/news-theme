import { TopBar } from "./TopBar";
import { Masthead } from "./Masthead";
import { Ticker } from "./Ticker";
import { BreakingBar } from "./BreakingBar";
import { useHomepageConfig } from "@/hooks/use-homepage-config";
import { useSiteSettings } from "@/components/site/AdSettingsContext";

interface HeaderProps {
  showTopBar?: boolean;
  showTicker?: boolean;
  showBreakingBar?: boolean;
  breakingArticles?: any[];
}

export function Header({
  showTopBar = true,
  showTicker,
  showBreakingBar,
  breakingArticles,
}: HeaderProps) {
  const cfg = useHomepageConfig();
  const s = useSiteSettings();
  const planType = (s.licenseType || "").toLowerCase();
  const isEnterprise = planType.includes("enterprise");

  // Force ticker to be off if not Enterprise
  const isTickerVisible = isEnterprise && (showTicker !== undefined ? showTicker : (cfg.showTicker ?? false));
  const isBreakingVisible =
    showBreakingBar !== undefined ? showBreakingBar : (cfg.showBreakingBar ?? true);

  return (
    <>
      {showTopBar && <TopBar />}
      <Masthead />
      {isTickerVisible && <Ticker />}
      {isBreakingVisible && <BreakingBar articles={breakingArticles} />}
    </>
  );
}
