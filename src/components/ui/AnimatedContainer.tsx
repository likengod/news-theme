import React from "react";
import { cn } from "@/lib/utils";

type AnimatedContainerProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
};

export function AnimatedContainer({
  children,
  className,
}: AnimatedContainerProps) {
  return (
    <div className={cn("transition-opacity duration-300", className)}>
      {children}
    </div>
  );
}

