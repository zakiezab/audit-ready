"use client";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { X, AlertTriangle, ArrowRight } from "lucide-react";
import { samaUpdates } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export function SamaNotification() {
  const [visible, setVisible] = useState(false);
  const [exiting, setExiting] = useState(false);
  const [progress, setProgress] = useState(100);
  const router = useRouter();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const latestUpdate = samaUpdates.find((u) => u.isNew && u.status === "detected");

  useEffect(() => {
    if (!latestUpdate) return;

    // Show after 1.5s delay
    const showTimer = setTimeout(() => {
      setVisible(true);
      setProgress(100);

      // Progress bar countdown over 8s
      const start = Date.now();
      const duration = 8000;
      intervalRef.current = setInterval(() => {
        const elapsed = Date.now() - start;
        const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
        setProgress(remaining);
        if (remaining === 0) {
          clearInterval(intervalRef.current!);
          handleDismiss();
        }
      }, 50);
    }, 1500);

    return () => {
      clearTimeout(showTimer);
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDismiss = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setExiting(true);
    timerRef.current = setTimeout(() => {
      setVisible(false);
      setExiting(false);
    }, 400);
  };

  const handleViewDetails = () => {
    handleDismiss();
    router.push("/regulations");
  };

  if (!latestUpdate || !visible) return null;

  return (
    <div
      className={cn(
        "fixed top-4 right-4 z-[200] w-[380px] rounded-lg overflow-hidden shadow-[0_16px_48px_rgba(0,0,0,0.5)]",
        "border border-[rgba(239,68,68,0.3)] bg-[#1A0D1D]",
        exiting ? "animate-slide-out-right" : "animate-slide-in-right"
      )}
    >
      {/* Auto-dismiss progress bar */}
      <div className="h-0.5 bg-[rgba(239,68,68,0.15)] w-full">
        <div
          className="h-full bg-primary transition-none"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="p-4">
        {/* Header row */}
        <div className="flex items-start gap-3">
          {/* Icon */}
          <div className="w-8 h-8 rounded-sm bg-[rgba(239,68,68,0.12)] border border-[rgba(239,68,68,0.25)] flex items-center justify-center flex-shrink-0 mt-0.5">
            <AlertTriangle size={14} className="text-risk-high" />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-[9px] font-semibold tracking-[0.14em] uppercase text-risk-high">
                New SAMA Circular Detected
              </span>
              <span className="text-[9px] text-secondary-300">{latestUpdate.date}</span>
            </div>
            <p className="text-xs font-medium text-secondary-100 leading-snug mb-1">
              {latestUpdate.title}
            </p>
            <p className="text-[11px] text-secondary-300 font-light leading-relaxed line-clamp-2">
              {latestUpdate.description}
            </p>
          </div>

          {/* Close */}
          <button
            onClick={handleDismiss}
            className="w-6 h-6 flex items-center justify-center rounded-sm text-secondary-300 hover:text-secondary-100 hover:bg-[rgba(255,255,255,0.06)] transition-all flex-shrink-0"
          >
            <X size={12} />
          </button>
        </div>

        {/* Impact row */}
        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center gap-1.5 bg-[rgba(239,68,68,0.08)] border border-[rgba(239,68,68,0.2)] rounded-sm px-2.5 py-1">
            <span className="w-1.5 h-1.5 rounded-full bg-risk-high animate-pulse" />
            <span className="text-[10px] font-semibold text-risk-high">
              {latestUpdate.impactedControls} controls impacted
            </span>
          </div>

          <button
            onClick={handleViewDetails}
            className="flex items-center gap-1 text-[11px] font-semibold text-primary hover:text-primary-300 transition-colors"
          >
            View &amp; Map Controls
            <ArrowRight size={11} />
          </button>
        </div>
      </div>
    </div>
  );
}
