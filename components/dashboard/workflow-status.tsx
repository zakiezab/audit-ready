import Link from "next/link";
import type { WorkflowCounts } from "@/types";

const stepConfig = [
  { key: "evidenced" as const, label: "Evidenced", color: "text-risk-low", barColor: "bg-risk-low" },
  { key: "approved"  as const, label: "Approved",  color: "text-secondary",     barColor: "bg-secondary" },
  { key: "inReview"  as const, label: "In Review", color: "text-[#6B9FFF]", barColor: "bg-[#1854E8]" },
  { key: "assigned"  as const, label: "Assigned",  color: "text-secondary-200", barColor: "bg-[rgba(255,255,255,0.15)]" },
  { key: "overdue"   as const, label: "Overdue",   color: "text-risk-high",  barColor: "bg-risk-high" },
];

export function WorkflowStatus({ counts }: { counts: WorkflowCounts }) {
  const pct = Math.round((counts.evidenced / counts.total) * 100);

  return (
    <div className="audit-card flex h-full min-h-0 min-w-0 w-full flex-1 flex-col overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-[rgba(255,255,255,0.04)]">
        <p className="text-[11px] font-semibold tracking-[0.08em] uppercase text-secondary-300">
          Workflow Status
        </p>
        <Link href="/governance" className="text-[11px] text-primary font-medium hover:text-primary-300 transition-colors">
          Full board →
        </Link>
      </div>

      {/* Step counts */}
      <div className="flex min-h-0 flex-1 border-b border-[rgba(255,255,255,0.04)]">
        {stepConfig.map((step, i) => (
          <div
            key={step.key}
            className={`flex min-h-0 flex-1 flex-col justify-center text-center py-4 px-2 ${i < stepConfig.length - 1 ? "border-r border-[rgba(255,255,255,0.04)]" : ""}`}
          >
            <p className={`font-metrophobic text-xl leading-none mb-1 ${step.color}`}>
              {counts[step.key]}
            </p>
            <p className="text-[9px] font-semibold tracking-[0.06em] uppercase text-secondary-300">
              {step.label}
            </p>
          </div>
        ))}
      </div>

      {/* Progress bar */}
      <div className="mt-auto px-5 py-4">
        <div className="h-2 bg-[rgba(255,255,255,0.04)] rounded-full overflow-hidden flex gap-0.5">
          {stepConfig.map((step) => (
            <div
              key={step.key}
              className={`h-full ${step.barColor} transition-all duration-1000`}
              style={{ width: `${(counts[step.key] / counts.total) * 100}%` }}
            />
          ))}
        </div>
        <div className="flex items-center justify-between mt-2">
          <span className="text-[10px] text-secondary-300">0</span>
          <span className="text-[10px] text-risk-low font-semibold">{pct}% Complete</span>
          <span className="text-[10px] text-secondary-300">{counts.total} total</span>
        </div>
      </div>
    </div>
  );
}
