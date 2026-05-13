"use client";
import { useRef, useState, useCallback } from "react";
import { Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface DashboardTooltipProps {
  description: string;
  children: React.ReactNode;
  /** Position relative to the wrapped element. Default: "bottom" */
  position?: "top" | "bottom";
  className?: string;
}

export function DashboardTooltip({
  description,
  children,
  position = "bottom",
  className,
}: DashboardTooltipProps) {
  const [visible, setVisible] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleEnter = useCallback(() => {
    timer.current = setTimeout(() => setVisible(true), 1000);
  }, []);

  const handleLeave = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    setVisible(false);
  }, []);

  const positionClass =
    position === "top"
      ? "bottom-[calc(100%+8px)] left-1/2 -translate-x-1/2"
      : "top-[calc(100%+8px)] left-1/2 -translate-x-1/2";

  const arrowClass =
    position === "top"
      ? "top-full left-1/2 -translate-x-1/2 border-t-[rgba(97,59,254,0.4)] border-x-transparent border-b-transparent"
      : "bottom-full left-1/2 -translate-x-1/2 border-b-[rgba(97,59,254,0.4)] border-x-transparent border-t-transparent";

  return (
    <div
      className={cn("relative w-full min-w-0", className)}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      {children}

      {/* Tooltip bubble */}
      <div
        role="tooltip"
        className={`
          pointer-events-none absolute z-50 w-56
          ${positionClass}
          transition-all duration-200
          ${visible ? "opacity-100 scale-100" : "opacity-0 scale-95"}
        `}
      >
        {/* Arrow */}
        <div
          className={`absolute w-0 h-0 border-4 ${arrowClass}`}
        />

        {/* Content */}
        <div className="bg-[rgba(19,14,35,0.96)] border border-[rgba(97,59,254,0.4)] rounded-md px-3 py-2.5 shadow-[0_8px_32px_rgba(0,0,0,0.5)] backdrop-blur-sm">
          <div className="flex items-start gap-2">
            <Info size={11} className="text-secondary mt-0.5 flex-shrink-0" />
            <p className="text-[11px] text-secondary-200 leading-relaxed">{description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
