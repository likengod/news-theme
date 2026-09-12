import { TopBar } from "./TopBar";
import { Masthead } from "./Masthead";
import { Ticker } from "./Ticker";
import { BreakingBar } from "./BreakingBar";
import { useHomepageConfig } from "@/hooks/use-homepage-config";

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
  const isTickerVisible = showTicker !== undefined ? showTicker : (cfg.showTicker ?? true);
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
