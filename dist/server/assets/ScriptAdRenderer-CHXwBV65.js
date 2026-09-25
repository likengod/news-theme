import { useEffect, useRef } from "react";
import { jsx } from "react/jsx-runtime";
//#region src/components/site/ScriptAdRenderer.tsx
function ScriptAdRenderer({ code, className }) {
	const containerRef = useRef(null);
	useEffect(() => {
		if (!containerRef.current || !code) return;
		containerRef.current.innerHTML = "";
		try {
			const range = document.createRange();
			range.selectNode(containerRef.current);
			const fragment = range.createContextualFragment(code);
			containerRef.current.appendChild(fragment);
		} catch (e) {
			console.error("ScriptAdRenderer error:", e);
		}
	}, [code]);
	return /* @__PURE__ */ jsx("div", {
		ref: containerRef,
		className: className || "w-full h-full flex items-center justify-center overflow-hidden"
	});
}
//#endregion
export { ScriptAdRenderer as t };
