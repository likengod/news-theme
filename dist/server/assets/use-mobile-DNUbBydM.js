import * as React$1 from "react";
// src/hooks/use-mobile.tsx
function useIsMobile() {
	const [isMobile, setIsMobile] = React$1.useState(false);
	React$1.useEffect(() => {
		const mql = window.matchMedia(`(max-width: 767px)`);
		const onChange = (e) => {
			setIsMobile(e.matches);
		};
		mql.addEventListener("change", onChange);
		setIsMobile(mql.matches);
		return () => {
			mql.removeEventListener("change", onChange);
		};
	}, []);
	return !!isMobile;
}
export { useIsMobile as t };

//# sourceMappingURL=use-mobile-DNUbBydM.js.map