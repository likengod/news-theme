import { useEffect, useState } from "react";

/**
 * Delays updating the returned value until `delay` ms have elapsed
 * since the last change. Use this to debounce search inputs so we
 * don't fire a server request on every keystroke.
 */
export function useDebounce<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}
