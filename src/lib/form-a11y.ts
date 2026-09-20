/**
 * Global Form Control Accessibility & Autofill Enhancement
 * Resolves Chrome DevTools issues:
 * 1. "A form field element should have an id or name attribute"
 * 2. "No label associated with a form field"
 */

let initialized = false;

export function initFormAccessibility(): () => void {
  if (typeof window === "undefined" || initialized) {
    return () => {};
  }
  initialized = true;

  let counter = 0;

  function patchElement(el: HTMLElement) {
    const tag = el.tagName;
    if (tag !== "INPUT" && tag !== "TEXTAREA" && tag !== "SELECT") {
      return;
    }

    const input = el as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;

    // 1. Guarantee valid 'id' and 'name' attributes
    const currentId = input.getAttribute("id");
    const currentName = input.getAttribute("name");

    if (!currentId && !currentName) {
      const placeholder = input.getAttribute("placeholder") || "";
      const type = input.getAttribute("type") || tag.toLowerCase();
      const base = (placeholder || type || "field")
        .toLowerCase()
        .replace(/[^a-z0-9_-]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .slice(0, 24);
      const generated = `${base || "field"}-${++counter}`;
      input.setAttribute("id", generated);
      input.setAttribute("name", generated);
    } else if (!currentId && currentName) {
      if (document.getElementById(currentName)) {
        input.setAttribute("id", `${currentName}-${++counter}`);
      } else {
        input.setAttribute("id", currentName);
      }
    } else if (currentId && !currentName) {
      input.setAttribute("name", currentId);
    }

    // 2. Guarantee accessible label association
    const hasAriaLabel = input.getAttribute("aria-label") || input.getAttribute("aria-labelledby");
    const hasTitle = input.getAttribute("title");
    const isInsideLabel = Boolean(input.closest("label"));
    const assignedId = input.getAttribute("id");
    const hasExplicitLabel = assignedId ? Boolean(document.querySelector(`label[for="${assignedId}"]`)) : false;

    if (!hasAriaLabel && !hasTitle && !isInsideLabel && !hasExplicitLabel) {
      // Check if parent container has an unassigned <label>
      const parent = input.parentElement;
      const siblingLabel = parent ? parent.querySelector("label:not([for])") : null;
      if (siblingLabel && assignedId) {
        siblingLabel.setAttribute("for", assignedId);
      } else {
        const placeholder = input.getAttribute("placeholder");
        const fallbackText =
          placeholder ||
          (input.getAttribute("name") || "").replace(/[-_]/g, " ") ||
          input.getAttribute("type") ||
          "Form field";
        input.setAttribute("aria-label", fallbackText);
      }
    }

    // 3. Guarantee autocomplete attribute on autofill-recognized field names
    if (!input.hasAttribute("autocomplete")) {
      const nameOrId = (
        (input.getAttribute("name") || input.getAttribute("id") || "")
      ).toLowerCase();

      const autofillKeywords = [
        "country",
        "city",
        "state",
        "address",
        "zip",
        "postal",
        "phone",
        "tel",
        "mobile",
        "email",
        "author",
        "username",
        "password",
        "search",
        "q",
        "query",
        "title",
        "name",
        "first-name",
        "last-name",
      ];

      if (autofillKeywords.some((kw) => nameOrId.includes(kw))) {
        const isSearch =
          input.getAttribute("type") === "search" ||
          nameOrId.includes("search") ||
          nameOrId === "q";
        const isAdmin = typeof window !== "undefined" && window.location.pathname.startsWith("/admin");

        if (isSearch || isAdmin) {
          input.setAttribute("autocomplete", "off");
        } else if (nameOrId.includes("email")) {
          input.setAttribute("autocomplete", "email");
        } else if (nameOrId.includes("tel") || nameOrId.includes("phone")) {
          input.setAttribute("autocomplete", "tel");
        } else if (nameOrId.includes("country")) {
          input.setAttribute("autocomplete", "country-name");
        } else if (nameOrId.includes("city")) {
          input.setAttribute("autocomplete", "address-level2");
        } else if (nameOrId.includes("state")) {
          input.setAttribute("autocomplete", "address-level1");
        } else {
          input.setAttribute("autocomplete", "off");
        }
      }
    }
  }

  function patchAll() {
    try {
      const elements = document.querySelectorAll<HTMLElement>("input, textarea, select");
      elements.forEach(patchElement);
    } catch {}
  }

  // Defer DOM patching until after React hydration has fully settled
  let timer: any = null;
  let observer: MutationObserver | null = null;

  const startPatching = () => {
    patchAll();

    // MutationObserver for SPA navigation, modals, and dynamic forms
    try {
      observer = new MutationObserver((mutations) => {
        for (const m of mutations) {
          if (m.type === "childList") {
            m.addedNodes.forEach((node) => {
              if (node.nodeType === Node.ELEMENT_NODE) {
                const el = node as HTMLElement;
                patchElement(el);
                el.querySelectorAll?.<HTMLElement>("input, textarea, select").forEach(patchElement);
              }
            });
          }
        }
      });

      observer.observe(document.body, { childList: true, subtree: true });
    } catch {}
  };

  // Run asynchronously after initial hydration completes
  if (typeof window !== "undefined") {
    if ("requestIdleCallback" in window) {
      (window as any).requestIdleCallback(startPatching, { timeout: 1500 });
    } else {
      timer = setTimeout(startPatching, 800);
    }
  }

  return () => {
    if (timer) clearTimeout(timer);
    observer?.disconnect();
    initialized = false;
  };
}
