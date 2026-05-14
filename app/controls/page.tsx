"use client";
import { useState } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { RiskBadge } from "@/components/shared/risk-badge";
import { StatusPill } from "@/components/shared/status-pill";
import { GapDetailSheet } from "@/components/shared/gap-detail-sheet";
import { getDeadlineClass } from "@/lib/utils";
import { controls } from "@/lib/mock-data";
import type { Control, RiskLevel, EvidenceStatus } from "@/types";
import { Search, SlidersHorizontal, ArrowRight, ChevronDown } from "lucide-react";

type RiskFilter = "all" | RiskLevel;
type StatusFilter = "all" | EvidenceStatus;
type DomainFilter = "all" | string;

const domains = ["all", ...Array.from(new Set(controls.map((c) => c.domain)))];

export default function ControlsPage() {
  const [search, setSearch] = useState("");
  const [riskFilter, setRiskFilter] = useState<RiskFilter>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [domainFilter, setDomainFilter] = useState<DomainFilter>("all");
  const [selected, setSelected] = useState<Control | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  const filtered = controls.filter((c) => {
    const matchSearch =
      !search ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.domain.toLowerCase().includes(search.toLowerCase()) ||
      (c.samaRef ?? "").toLowerCase().includes(search.toLowerCase());
    const matchRisk = riskFilter === "all" || c.risk === riskFilter;
    const matchStatus = statusFilter === "all" || c.evidenceStatus === statusFilter;
    const matchDomain = domainFilter === "all" || c.domain === domainFilter;
    return matchSearch && matchRisk && matchStatus && matchDomain;
  });

  const openDetail = (ctrl: Control) => {
    setSelected(ctrl);
    setSheetOpen(true);
  };

  const riskOptions: { key: RiskFilter; label: string }[] = [
    { key: "all", label: "All Risk" },
    { key: "high", label: "High" },
    { key: "medium", label: "Medium" },
    { key: "low", label: "Low" },
  ];

  const statusOptions: { key: StatusFilter; label: string }[] = [
    { key: "all", label: "All Status" },
    { key: "missing", label: "Missing" },
    { key: "pending", label: "Pending" },
    { key: "review", label: "In Review" },
    { key: "approved", label: "Approved" },
  ];

  return (
    <MainLayout>
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-lg font-semibold text-secondary-100 sm:text-xl">Controls Library</h1>
          <p className="text-xs text-secondary-300 mt-0.5">
            {controls.length} controls · {controls.filter((c) => c.risk === "high").length} high risk
          </p>
        </div>
        <div className="flex flex-shrink-0 flex-wrap gap-2">
          <button className="btn-outline-brand text-xs px-4 py-2">
            Export CSV
          </button>
          <button className="btn-brand text-xs px-4 py-2">
            + Add Control
          </button>
        </div>
      </div>

      {/* Filters bar */}
      <div className="audit-card mb-5 flex flex-col gap-3 px-4 py-3 lg:flex-row lg:items-center lg:gap-3 lg:px-5">
        {/* Search */}
        <div className="flex min-w-0 flex-1 items-center gap-2 rounded-sm border border-[rgba(255,255,255,0.07)] bg-[rgba(255,255,255,0.03)] px-3 py-2">
          <Search size={14} className="text-secondary-300 flex-shrink-0" />
          <input
            type="text"
            placeholder="Search controls, domains, SAMA refs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent text-xs text-secondary-100 placeholder:text-secondary-300 outline-none flex-1"
          />
        </div>

        {/* Risk filter */}
        <div className="relative w-full min-w-0 lg:w-auto">
          <select
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value as RiskFilter)}
            className="w-full cursor-pointer appearance-none rounded-sm border border-[rgba(255,255,255,0.07)] bg-[rgba(255,255,255,0.03)] py-2 pl-3 pr-8 text-xs text-secondary-100 outline-none lg:w-auto"
          >
            {riskOptions.map((o) => (
              <option key={o.key} value={o.key}>{o.label}</option>
            ))}
          </select>
          <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-secondary-300 pointer-events-none" />
        </div>

        {/* Status filter */}
        <div className="relative w-full min-w-0 lg:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
            className="w-full cursor-pointer appearance-none rounded-sm border border-[rgba(255,255,255,0.07)] bg-[rgba(255,255,255,0.03)] py-2 pl-3 pr-8 text-xs text-secondary-100 outline-none lg:w-auto"
          >
            {statusOptions.map((o) => (
              <option key={o.key} value={o.key}>{o.label}</option>
            ))}
          </select>
          <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-secondary-300 pointer-events-none" />
        </div>

        {/* Domain filter */}
        <div className="relative w-full min-w-0 lg:w-auto">
          <select
            value={domainFilter}
            onChange={(e) => setDomainFilter(e.target.value)}
            className="w-full cursor-pointer appearance-none rounded-sm border border-[rgba(255,255,255,0.07)] bg-[rgba(255,255,255,0.03)] py-2 pl-3 pr-8 text-xs text-secondary-100 outline-none lg:w-auto"
          >
            {domains.map((d) => (
              <option key={d} value={d}>{d === "all" ? "All Domains" : d}</option>
            ))}
          </select>
          <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-secondary-300 pointer-events-none" />
        </div>

        <div className="flex flex-wrap items-center gap-1.5 text-secondary-300 lg:ml-auto">
          <SlidersHorizontal size={14} />
          <span className="text-[11px]">{filtered.length} results</span>
        </div>
      </div>

      {/* Table */}
      <div className="audit-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[rgba(255,255,255,0.06)]">
                {["Control / Domain", "SAMA Ref", "Risk", "Evidence", "Owner", "Deadline", ""].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-left text-[10px] font-semibold tracking-[0.1em] uppercase text-secondary-300 whitespace-nowrap"
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
                    <span className="text-[11px] text-secondary-300 font-mono">{ctrl.samaRef}</span>
                  </td>
                  <td className="px-4 py-3">
                    <RiskBadge risk={ctrl.risk} />
                  </td>
                  <td className="px-4 py-3">
                    <StatusPill status={ctrl.evidenceStatus} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-semibold flex-shrink-0 ${ctrl.owner.colorClass}`}>
                        {ctrl.owner.initials}
                      </div>
                      <span className="text-[11px] text-secondary-300 whitespace-nowrap">{ctrl.owner.name}</span>
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
                  <td colSpan={7} className="px-4 py-12 text-center text-xs text-secondary-300">
                    No controls match the current filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <GapDetailSheet control={selected} open={sheetOpen} onOpenChange={setSheetOpen} />
    </MainLayout>
  );
}
