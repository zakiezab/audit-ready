"use client";
import { useEffect, useState } from "react";

interface RiskBar {
  label: string;
  count: number;
  color: string;
  pillClass: string;
  pillLabel: string;
}

const barDefs: Omit<RiskBar, "count">[] = [
  { label: "High",   color: "bg-risk-high",   pillClass: "badge-high",   pillLabel: "Critical" },
  { label: "Medium", color: "bg-risk-medium", pillClass: "badge-medium", pillLabel: "Review" },
  { label: "Low",    color: "bg-risk-low",    pillClass: "badge-low",    pillLabel: "On Track" },
];

interface RiskBarsProps {
  high: number;
  medium: number;
  low: number;
  /** Denominator for bar fill width (e.g. open gaps total). */
  total: number;
}

const dotColor: Record<string, string> = {
  High:   "bg-risk-high",
  Medium: "bg-risk-medium",
  Low:    "bg-risk-low",
};

export function RiskBars({ high, medium, low, total }: RiskBarsProps) {
  const [animated, setAnimated] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 300);
    return () => clearTimeout(t);
  }, []);

  const counts = [high, medium, low];
  const safeTotal = Math.max(total, 1);

  return (
    <div className="flex h-full min-h-0 min-w-0 w-full flex-1 flex-col overflow-hidden">
      <div className="flex min-h-0 flex-1 flex-col px-5 pb-5 pt-4">
        <div className="flex min-h-0 flex-1 flex-col border-t border-[rgba(255,255,255,0.04)] pt-4 pb-1">
          <p className="text-[10px] font-semibold tracking-[0.1em] uppercase text-secondary-300 mb-4">
            Controls by Risk Priority
          </p>
          <div className="flex min-h-0 flex-1 flex-col gap-6">
            {barDefs.map((bar, i) => {
              const count = counts[i];
              const pct = animated ? Math.min(100, Math.round((count / safeTotal) * 100)) : 0;
              return (
              <div key={bar.label} className="flex items-center gap-2.5">
                {/* Label */}
                <div className="flex items-center gap-1.5 w-[72px] flex-shrink-0">
                  <span className={`w-2 h-2 rounded-full flex-shrink-0 ${dotColor[bar.label]}`} />
                  <span
                    className={`text-[12px] font-medium ${
                      bar.label === "High"
                        ? "text-risk-high"
                        : bar.label === "Medium"
                        ? "text-risk-medium"
                        : "text-risk-low"
                    }`}
                  >
                    {bar.label}
                  </span>
                </div>

                {/* Bar track */}
                <div className="flex-1 h-2 bg-[rgba(255,255,255,0.04)] rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${bar.color} transition-all duration-1000 ease-out`}
                    style={{ width: `${pct}%` }}
                  />
                </div>

                {/* Count */}
                <span
                  className={`text-[12px] font-semibold w-6 text-right flex-shrink-0 ${
                    bar.label === "High"
                      ? "text-risk-high"
                      : bar.label === "Medium"
                      ? "text-risk-medium"
                      : "text-risk-low"
                  }`}
                >
                  {count}
                </span>

                {/* Pill */}
                <span className={`${bar.pillClass} w-[60px] text-center flex-shrink-0`}>
                  {bar.pillLabel}
                </span>
              </div>
            );
            })}
          </div>
        </div>
      </div>

      {/* Drill flow */}
      {/* <div className="mt-4 pt-4 border-t border-[rgba(255,255,255,0.04)] flex items-center text-[10px] text-secondary-300 font-semibold tracking-wide">
        {["Score", "Gaps", "Owners", "Evidence", "Resolved"].map((node, i, arr) => (
          <div key={node} className="flex items-center flex-1">
            <span className={`flex-1 text-center ${i === 0 ? "text-secondary" : ""}`}>{node}</span>
            {i < arr.length - 1 && <span className="text-[rgba(255,255,255,0.15)] mx-1">›</span>}
          </div>
        ))}
      </div> */}
    </div>
  );
}
