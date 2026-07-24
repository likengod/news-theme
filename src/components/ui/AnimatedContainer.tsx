import React from "react";
import { motion } from "framer-motion";
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
  delay = 0,
  duration = 0.5
}: AnimatedContainerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration, delay, ease: "easeOut" }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}
