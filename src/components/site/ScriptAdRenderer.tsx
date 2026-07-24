import { useEffect, useRef } from "react";

export function ScriptAdRenderer({ code, className }: { code: string; className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);

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

  return (
    <div
      ref={containerRef}
      className={className || "w-full h-full flex items-center justify-center overflow-hidden"}
    />
  );
}
