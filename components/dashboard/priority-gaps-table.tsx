"use client";
import { useState } from "react";
import Link from "next/link";
import { RiskBadge } from "@/components/shared/risk-badge";
import { StatusPill } from "@/components/shared/status-pill";
import { GapDetailSheet } from "@/components/shared/gap-detail-sheet";
import { getDeadlineClass, cn } from "@/lib/utils";
import { controls } from "@/lib/mock-data";
import type { Control } from "@/types";
import { ArrowRight } from "lucide-react";

type FilterKey = "all" | "high" | "medium" | "pending";

const filterOptions: { key: FilterKey; label: string }[] = [
  { key: "all",     label: "All" },
  { key: "high",    label: "High Risk" },
  { key: "medium",  label: "Medium" },
  { key: "pending", label: "Pending Evidence" },
];

const topControls = controls.slice(0, 7);

export function PriorityGapsTable({ enterDelayMs }: { enterDelayMs?: number }) {
  const [filter, setFilter] = useState<FilterKey>("all");
  const [selected, setSelected] = useState<Control | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  const filtered = topControls.filter((c) => {
    if (filter === "all") return true;
    if (filter === "high") return c.risk === "high";
    if (filter === "medium") return c.risk === "medium";
    if (filter === "pending") return c.evidenceStatus === "pending" || c.evidenceStatus === "missing";
    return true;
  });

  const openDetail = (ctrl: Control) => {
    setSelected(ctrl);
    setSheetOpen(true);
  };

  return (
    <>
      <div
        className={cn(
          "audit-card overflow-hidden",
          enterDelayMs != null &&
            "animate-in fade-in slide-in-from-bottom-3 duration-700 ease-out fill-mode-both motion-reduce:animate-none motion-reduce:opacity-100 motion-reduce:translate-y-0"
        )}
        style={enterDelayMs != null ? { animationDelay: `${enterDelayMs}ms` } : undefined}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[rgba(255,255,255,0.04)]">
          <p className="text-[11px] font-semibold tracking-[0.08em] uppercase text-secondary-300">
            Top Priority Gaps
          </p>
          <Link href="/controls" className="text-[11px] text-primary font-medium hover:text-primary-300 transition-colors">
            View all 33 gaps →
          </Link>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 px-5 py-3 border-b border-[rgba(255,255,255,0.04)]">
          {filterOptions.map((opt) => (
            <button
              key={opt.key}
              onClick={() => setFilter(opt.key)}
              className={`px-3 py-1 rounded-full text-[11px] font-medium border transition-all duration-200 ${
                filter === opt.key
                  ? opt.key === "pending"
                    ? "bg-[rgba(97,59,254,0.15)] border-[rgba(97,59,254,0.35)] text-[#A48DFF]"
                    : "bg-[rgba(216,36,42,0.12)] border-[rgba(216,36,42,0.3)] text-primary-300"
                  : "border-[rgba(255,255,255,0.08)] text-secondary-300 hover:border-[rgba(255,255,255,0.15)] hover:text-secondary-100"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[rgba(255,255,255,0.06)]">
                {["Control / Domain", "Risk", "Evidence", "Owner", "Due", ""].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-2.5 text-left text-[10px] font-semibold tracking-[0.1em] uppercase text-secondary-300 whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((ctrl) => (
                <tr
                  key={ctrl.id}
                  onClick={() => openDetail(ctrl)}
                  className="border-b border-[rgba(255,255,255,0.04)] last:border-0 cursor-pointer hover:bg-[rgba(42,30,92,0.5)] transition-colors duration-150"
                >
                  <td className="px-4 py-3">
                    <p className="text-xs font-medium text-secondary-100">{ctrl.name}</p>
                    <p className="text-[10px] text-secondary-300 mt-0.5">{ctrl.domain}</p>
                  </td>
                  <td className="px-4 py-3">
                    <RiskBadge risk={ctrl.risk} />
                  </td>
                  <td className="px-4 py-3">
                    <StatusPill status={ctrl.evidenceStatus} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-semibold flex-shrink-0 ${ctrl.owner.colorClass}`}
                      >
                        {ctrl.owner.initials}
                      </div>
                      <span className="text-[11px] text-secondary-300 whitespace-nowrap">
                        {ctrl.owner.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-[11px] whitespace-nowrap ${getDeadlineClass(ctrl.deadlineStatus)}`}>
                      {ctrl.deadline}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button className="flex items-center gap-1 border border-[rgba(255,255,255,0.08)] hover:border-primary hover:text-primary text-secondary-300 text-[10px] font-medium px-2.5 py-1 rounded-sm transition-all">
                      Review <ArrowRight size={10} />
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-xs text-secondary-300">
                    No gaps match the selected filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <GapDetailSheet control={selected} open={sheetOpen} onOpenChange={setSheetOpen} />
    </>
  );
}
