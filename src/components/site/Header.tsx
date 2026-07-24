import { TopBar } from "./TopBar";
import { Masthead } from "./Masthead";
import { Ticker } from "./Ticker";
import { BreakingBar } from "./BreakingBar";

interface HeaderProps {
  showTopBar?: boolean;
  showTicker?: boolean;
  showBreakingBar?: boolean;
}

export function Header({
  showTopBar = true,
  showTicker = true,
  showBreakingBar = true,
}: HeaderProps) {
  return (
    <>
      {showTopBar && <TopBar />}
      <Masthead />
      {showTicker && <Ticker />}
      {showBreakingBar && <BreakingBar />}
    </>
  );
}
