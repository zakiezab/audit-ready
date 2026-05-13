"use client";
import { useEffect, useRef, useState } from "react";
import { ReadinessScoreSheet } from "@/components/shared/readiness-score-sheet";
import { Info } from "lucide-react";

const RADIUS = 70;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

interface ReadinessGaugeProps {
  score: number;
  total?: number;
  delta?: number;
}

export function ReadinessGauge({ score, total = 1000, delta = 38 }: ReadinessGaugeProps) {
  const [displayScore, setDisplayScore] = useState(0);
  const [dashArray, setDashArray] = useState(`0 ${CIRCUMFERENCE}`);
  const [sheetOpen, setSheetOpen] = useState(false);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (hasAnimated.current) return;
    hasAnimated.current = true;

    const duration = 1800;
    const startTime = performance.now();
    const targetDash = (score / total) * CIRCUMFERENCE;

    const frame = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * score);
      const fill = eased * targetDash;

      setDisplayScore(current);
      setDashArray(`${fill} ${CIRCUMFERENCE - fill}`);

      if (progress < 1) requestAnimationFrame(frame);
    };

    requestAnimationFrame(frame);
  }, [score, total]);

  return (
    <>
    <ReadinessScoreSheet open={sheetOpen} onOpenChange={setSheetOpen} score={score} delta={delta} />
    <button
      onClick={() => setSheetOpen(true)}
      className="flex flex-col items-center py-6 px-5 w-full group cursor-pointer"
    >
      {/* Gauge */}
      <div className="relative w-[180px] h-[180px]">
        <svg
          width="180"
          height="180"
          viewBox="0 0 180 180"
          className="overflow-visible"
        >
          <defs>
            <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#613BFE" />
              <stop offset="100%" stopColor="#22C55E" />
            </linearGradient>
          </defs>
          {/* Track */}
          <circle
            cx="90" cy="90" r={RADIUS}
            fill="none"
            stroke="rgba(255,255,255,0.04)"
            strokeWidth="13"
          />
          {/* Fill */}
          <circle
            cx="90" cy="90" r={RADIUS}
            fill="none"
            stroke="url(#gaugeGradient)"
            strokeWidth="13"
            strokeDasharray={dashArray}
            strokeDashoffset={CIRCUMFERENCE * 0.25}
            strokeLinecap="round"
            transform="rotate(-90 90 90)"
          />
        </svg>

        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-metrophobic text-[38px] leading-none text-secondary-100">
            {displayScore}
          </span>
          <span className="text-[12px] text-secondary-300 font-light mt-1">out of {total}</span>
        </div>
      </div>

      {/* Label */}
      <p className="text-[10px] font-semibold tracking-[0.12em] uppercase text-secondary-300 mt-3">
        Audit Readiness Score
      </p>
      <p className="flex items-center gap-1 text-xs text-risk-low font-medium mt-1.5">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M2 8l3-3 2 2 3-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        ↑ +{delta} pts from previous cycle
      </p>
      <div className="flex items-center gap-1 mt-3 text-[10px] text-secondary-300 group-hover:text-secondary transition-colors">
        <Info size={10} />
        <span>How is this calculated?</span>
      </div>
    </button>
    </>
  );
}
