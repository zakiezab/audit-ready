"use client";
import { useEffect, useRef, useState } from "react";
import { TrendingUp, AlertTriangle, FileText, Calendar, ArrowRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import type { KpiData } from "@/types";
import { DashboardTooltip } from "@/components/shared/dashboard-tooltip";

function useCountUp(target: number, duration = 1200) {
  const [value, setValue] = useState(0);
  const done = useRef(false);
  useEffect(() => {
    if (done.current) return;
    done.current = true;
    const start = performance.now();
    const frame = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(Math.round(eased * target));
      if (p < 1) requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  }, [target, duration]);
  return value;
}

interface KpiCardProps {
  label: string;
  value: number;
  suffix?: string;
  sub: React.ReactNode;
  icon: React.ReactNode;
  accentColor?: string; // tailwind top bar color class
  iconBg: string;
  enterDelayMs?: number;
  href: string;
  tooltip: string;
}

function KpiCard({ label, value, suffix, sub, icon, accentColor, iconBg, enterDelayMs = 0, href, tooltip }: KpiCardProps) {
  const displayValue = useCountUp(value);
  return (
    <DashboardTooltip description={tooltip} position="bottom">
    <Link
      href={href}
      className={cn(
        "audit-card p-5 relative overflow-hidden flex h-full min-h-0 flex-col group",
        "transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover cursor-pointer",
        "hover:border-[rgba(97,59,254,0.3)]",
        "animate-in fade-in slide-in-from-bottom-2 duration-700 ease-out fill-mode-both",
        "motion-reduce:animate-none motion-reduce:opacity-100 motion-reduce:translate-y-0"
      )}
      style={enterDelayMs > 0 ? { animationDelay: `${enterDelayMs}ms` } : undefined}
    >
      {accentColor ? (
        <div className={cn("absolute top-0 left-0 right-0 h-0.5 rounded-t-lg", accentColor)} />
      ) : null}

      <div className="flex items-center justify-between mb-3">
        <p className="text-[10px] font-semibold tracking-[0.12em] uppercase text-secondary-300">
          {label}
        </p>
        <div className="flex items-center gap-1.5">
          <div className={cn("w-7 h-7 rounded-sm flex items-center justify-center", iconBg)}>
            {icon}
          </div>
          <div className="absolute bottom-5 right-5 w-5 h-5 rounded-sm flex items-center justify-center bg-[rgba(97,59,254,0.08)] opacity-0 group-hover:opacity-100 transition-all duration-200 -translate-x-1 group-hover:translate-x-0">
            <ArrowRight size={16} className="text-primary/80" />
          </div>
        </div>
      </div>

      <div className="min-w-0">
        <p className="font-metrophobic text-[72px] leading-none text-secondary-100">
          {displayValue}
        </p>
        {suffix ? (
          <span className="mt-1 block text-sm text-secondary-300/80 font-sans font-light">
            {suffix}
          </span>
        ) : null}
      </div>

      <div className="mt-auto pt-2 text-xs text-secondary-300 flex items-center gap-1">{sub}</div>
      <div className="absolute bottom-5 right-5 opacity-10 scale-[8] rotate-12">
        {icon}
      </div>
    </Link>
    </DashboardTooltip>
  );
}

export function KpiCards({ data }: { data: KpiData }) {
  return (
    <div className="grid h-full min-h-0 min-w-0 w-full flex-1 grid-cols-4 gap-4">
      <KpiCard
        label="Readiness Score"
        value={data.readinessScore}
        suffix="/1000"
        enterDelayMs={110}
        href="/governance"
        tooltip="Your overall SAMA compliance score based on evidenced controls. A perfect score is 1000 — track your progress in Governance."
        sub={
          <>
            <span className="text-risk-low font-semibold">↑ +{data.readinessDelta} pts</span>
            &nbsp;from last review
          </>
        }
        icon={<TrendingUp size={13} className="text-secondary" />}
        iconBg="bg-[rgba(97,59,254,0.15)]"
      />
      <KpiCard
        label="Open Gaps"
        value={data.openGaps}
        enterDelayMs={170}
        href="/controls"
        tooltip="Controls with missing or incomplete evidence. High-risk gaps require immediate action before your next SAMA audit cycle."
        sub={
          <>
            <span className="text-risk-high font-semibold">{data.highGaps} High</span>
            ,&nbsp;{data.openGaps - data.highGaps} Medium
          </>
        }
        icon={<AlertTriangle size={13} className="text-risk-high" />}
        iconBg="bg-[rgba(239,68,68,0.12)]"
      />
      <KpiCard
        label="Pending Evidence"
        value={data.pendingEvidence}
        enterDelayMs={230}
        href="/evidence"
        tooltip="Evidence files awaiting submission, in-review, or overdue. Resolving these unblocks your audit readiness score."
        sub={
          <>
            <span className="text-risk-medium font-semibold">{data.overdueEvidence} overdue</span>
            &nbsp;·&nbsp;{data.pendingEvidence - data.overdueEvidence} in review
          </>
        }
        icon={<FileText size={13} className="text-risk-medium" />}
        iconBg="bg-[rgba(249,169,49,0.12)]"
      />
      <KpiCard
        label="Next Review"
        value={data.daysToReview}
        suffix="days"
        enterDelayMs={290}
        href="/regulations"
        tooltip="Days remaining until your next SAMA external audit. Use this countdown to prioritise outstanding controls and evidence."
        sub={
          <>
            <span className="text-risk-low font-semibold">{data.reviewQuarter}</span>
            &nbsp;External Audit
          </>
        }
        icon={<Calendar size={13} className="text-risk-low" />}
        iconBg="bg-[rgba(34,197,94,0.12)]"
      />
    </div>
  );
}
