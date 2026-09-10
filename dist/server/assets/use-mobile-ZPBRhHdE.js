import * as React$1 from "react";
//#region src/hooks/use-mobile.tsx
var MOBILE_BREAKPOINT = 768;
function useIsMobile() {
	const [isMobile, setIsMobile] = React$1.useState(() => {
		if (typeof window !== "undefined") return window.innerWidth < MOBILE_BREAKPOINT;
		return false;
	});
	React$1.useEffect(() => {
		const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
		const onChange = () => {
			setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
		};
		mql.addEventListener("change", onChange);
		window.addEventListener("resize", onChange);
		setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
		return () => {
			mql.removeEventListener("change", onChange);
			window.removeEventListener("resize", onChange);
		};
	}, []);
	return !!isMobile;
}
//#endregion
export { useIsMobile as t };
