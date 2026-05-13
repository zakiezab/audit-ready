"use client";

import { cn } from "@/lib/utils";

type DashboardEnterProps = {
  children: React.ReactNode;
  className?: string;
  /** Stagger offset in milliseconds (passed to `animation-delay`). */
  delayMs?: number;
};

export function DashboardEnter({ children, className, delayMs = 0 }: DashboardEnterProps) {
  return (
    <div
      className={cn(
        "w-full animate-in fade-in slide-in-from-bottom-3 duration-700 ease-out fill-mode-both",
        "motion-reduce:animate-none motion-reduce:opacity-100 motion-reduce:translate-y-0",
        className
      )}
      style={delayMs > 0 ? { animationDelay: `${delayMs}ms` } : undefined}
    >
      {children}
    </div>
  );
}
