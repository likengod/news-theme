import * as React from "react";

import { cn } from "@/lib/utils";

const Textarea = React.forwardRef<HTMLTextAreaElement, React.ComponentProps<"textarea">>(
  ({ className, id, name, placeholder, ...props }, ref) => {
    const autoId = React.useId();
    const resolvedId = id || (name ? `textarea-${name}` : autoId);
    const resolvedName = name || id || (placeholder ? placeholder.toLowerCase().replace(/[^a-z0-9_-]+/g, "-") : autoId);
    const ariaLabel = props["aria-label"] || (!props["aria-labelledby"] && placeholder ? placeholder : undefined);

    return (
      <textarea
        id={resolvedId}
        name={resolvedName}
        aria-label={ariaLabel}
        placeholder={placeholder}
        className={cn(
          "flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Textarea.displayName = "Textarea";

export { Textarea };
