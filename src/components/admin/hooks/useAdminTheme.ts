import { useEffect } from "react";

/**
 * Enforces light theme for the administrative dashboard,
 * and restores user's preferred theme upon exiting.
 */
export function useAdminTheme() {
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("dark");
    root.style.colorScheme = "light";

    return () => {
      // Re-apply correct theme from localStorage when leaving admin panel
      const storedTheme = localStorage.getItem("fs-theme") || "light";
      if (storedTheme === "dark") {
        root.classList.add("dark");
        root.style.colorScheme = "dark";
      } else {
        root.classList.remove("dark");
        root.style.colorScheme = "light";
      }
    };
  }, []);
}
