import { Suspense, useEffect, useRef, useState, type ReactNode } from "react";

interface LazySectionProps {
  children: ReactNode;
  minHeight?: number;
  rootMargin?: string;
  fallback?: ReactNode;
}

/**
 * Renders children only when the placeholder scrolls near the viewport.
 * Reserves vertical space via minHeight to prevent layout shift (CLS).
 */
export function LazySection({
  children,
  minHeight = 400,
  rootMargin = "300px",
  fallback,
}: LazySectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (visible) return;
    const el = ref.current;
    if (!el) return;

    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setVisible(true);
          io.disconnect();
        }
      },
      { rootMargin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [visible, rootMargin]);

  return (
    <div ref={ref} style={!visible ? { minHeight } : undefined}>
      {visible ? (
        <Suspense fallback={fallback ?? <SectionSkeleton height={minHeight} />}>
          {children}
        </Suspense>
      ) : (
        fallback ?? <SectionSkeleton height={minHeight} />
      )}
    </div>
  );
}

function SectionSkeleton({ height }: { height: number }) {
  return (
    <div
      aria-hidden="true"
      className="animate-pulse bg-muted/30"
      style={{ minHeight: height }}
    />
  );
}
