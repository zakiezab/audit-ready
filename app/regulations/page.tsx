"use client";
import { useState } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { getSamaStatusClass, getSamaStatusLabel } from "@/lib/utils";
import { samaUpdates as initialUpdates } from "@/lib/mock-data";
import { SamaActionSheet } from "@/components/shared/sama-action-sheet";
import type { SamaUpdate } from "@/types";
import { AlertTriangle, Map, CheckSquare, ExternalLink, Search, ChevronDown, Zap } from "lucide-react";

const statusIcon: Record<SamaUpdate["status"], React.ReactNode> = {
  detected: <AlertTriangle size={14} className="text-risk-high" />,
  mapped: <Map size={14} className="text-risk-medium" />,
  assigned: <CheckSquare size={14} className="text-risk-low" />,
};

const statusBgOverlay: Record<SamaUpdate["status"], string> = {
  detected:
    "bg-[linear-gradient(to_right,rgba(239,68,68,0.3)_0%,rgba(239,68,68,0)_100%)]",
  mapped:
    "bg-[linear-gradient(to_right,rgba(249,169,49,0.3)_0%,rgba(249,169,49,0)_100%)]",
  assigned:
    "bg-[linear-gradient(to_right,rgba(34,197,94,0.3)_0%,rgba(34,197,94,0)_100%)]",
};

const impactColor: Record<SamaUpdate["status"], string> = {
  detected: "text-risk-high",
  mapped: "text-risk-medium",
  assigned: "text-risk-low",
};

const pipelineSteps = ["Detected", "Mapped", "Assigned", "Validated"];

function PipelineBar({ status }: { status: SamaUpdate["status"] }) {
  const idx = status === "detected" ? 0 : status === "mapped" ? 1 : 2;
  return (
    <div className="flex items-center gap-0">
      {pipelineSteps.map((step, i) => (
        <div key={step} className="flex items-center">
          <div className={`flex items-center gap-1.5 px-2 py-1 rounded-sm text-[10px] font-semibold ${
            i <= idx
              ? i === 0 ? "bg-[rgba(239,68,68,0.12)] text-risk-high"
              : i === 1 ? "bg-[rgba(249,169,49,0.12)] text-risk-medium"
              : "bg-[rgba(34,197,94,0.12)] text-risk-low"
              : "bg-[rgba(255,255,255,0.04)] text-secondary-300"
          }`}>
            {i <= idx && <span className="w-1 h-1 rounded-full bg-current" />}
            {step}
          </div>
          {i < pipelineSteps.length - 1 && (
            <div className={`w-6 h-px ${i < idx ? "bg-[rgba(255,255,255,0.15)]" : "bg-[rgba(255,255,255,0.06)]"}`} />
          )}
        </div>
      ))}
    </div>
  );
}

export default function RegulationsPage() {
  const [updates, setUpdates] = useState<SamaUpdate[]>(initialUpdates);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | SamaUpdate["status"]>("all");
  const [actionUpdate, setActionUpdate] = useState<SamaUpdate | null>(null);
  const [actionOpen, setActionOpen] = useState(false);

  const openAction = (u: SamaUpdate) => { setActionUpdate(u); setActionOpen(true); };

  const handleStatusAdvance = (id: string) => {
    setUpdates((prev) => prev.map((u) => {
      if (u.id !== id) return u;
      const next: SamaUpdate["status"] = u.status === "detected" ? "mapped" : u.status === "mapped" ? "assigned" : "assigned";
      return { ...u, status: next, isNew: false };
    }));
  };

  const filtered = updates.filter((u) => {
    const matchSearch =
      !search ||
      u.title.toLowerCase().includes(search.toLowerCase()) ||
      u.description.toLowerCase().includes(search.toLowerCase()) ||
      u.type.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || u.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const counts = {
    detected: updates.filter((u) => u.status === "detected").length,
    mapped:   updates.filter((u) => u.status === "mapped").length,
    assigned: updates.filter((u) => u.status === "assigned").length,
  };

  return (
    <MainLayout>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-secondary-100">SAMA Regulatory Feed</h1>
          <p className="text-xs text-secondary-300 mt-0.5">
            {updates.length} regulatory updates · {counts.detected} requiring immediate action
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-[11px] text-risk-low font-semibold px-3 py-1.5 rounded-full border border-[rgba(34,197,94,0.25)] bg-[rgba(34,197,94,0.08)]">
            <span className="w-1.5 h-1.5 rounded-full bg-risk-low animate-pulse" />
            Live Feed Active
          </div>
          <button className="btn-outline-brand text-xs px-4 py-2">
            Subscribe to Alerts
          </button>
        </div>
      </div>

      {/* Pipeline summary */}
      <div className="grid grid-cols-3 gap-4 mb-5">
        {[
          { label: "Detected", count: counts.detected, desc: "Awaiting mapping to controls", cls: "border-[rgba(239,68,68,0.25)] bg-[rgba(239,68,68,0.05)]", textCls: "text-risk-high", Icon: AlertTriangle },
          { label: "Mapped", count: counts.mapped, desc: "Controls identified, assigning owners", cls: "border-[rgba(249,169,49,0.25)] bg-[rgba(249,169,49,0.05)]", textCls: "text-risk-medium", Icon: Map },
          { label: "Assigned", count: counts.assigned, desc: "Owners notified, evidence in progress", cls: "border-[rgba(34,197,94,0.25)] bg-[rgba(34,197,94,0.05)]", textCls: "text-risk-low", Icon: CheckSquare },
        ].map((s) => (
          <div key={s.label} className={`audit-card p-5 border ${s.cls}`}>
            <div className="flex items-center justify-between mb-2">
              <s.Icon size={16} className={s.textCls} />
              <span className={`font-metrophobic text-3xl ${s.textCls}`}>{s.count}</span>
            </div>
            <p className="text-xs font-semibold text-secondary-100">{s.label}</p>
            <p className="text-[11px] text-secondary-300 mt-0.5">{s.desc}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex items-center gap-2 flex-1 bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.07)] rounded-sm px-3 py-2">
          <Search size={14} className="text-secondary-300 flex-shrink-0" />
          <input
            type="text"
            placeholder="Search regulations, circular types..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent text-xs text-secondary-100 placeholder:text-secondary-300 outline-none flex-1"
          />
        </div>
        <div className="relative">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="appearance-none bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.07)] rounded-sm pl-3 pr-8 py-2 text-xs text-secondary-100 outline-none cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="detected">Detected</option>
            <option value="mapped">Mapped</option>
            <option value="assigned">Assigned</option>
          </select>
          <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-secondary-300 pointer-events-none" />
        </div>
        <span className="text-[11px] text-secondary-300">{filtered.length} updates</span>
      </div>

      {/* Regulatory Updates */}
      <div className="flex flex-col gap-4">
        {filtered.map((update) => (
          <div
            key={update.id}
            className={`audit-card relative overflow-hidden p-5 ${update.isNew ? "" : ""}`}
          >
            <div
              className={`pointer-events-none absolute inset-0 rounded-lg ${statusBgOverlay[update.status]}`}
              aria-hidden
            />
            <div className="relative z-10">
              {/* Top row */}
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex items-start gap-3 flex-1">
                  {statusIcon[update.status]}
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      {update.isNew && (
                        <span className="flex items-center gap-1 text-[9px] font-semibold tracking-[0.1em] uppercase text-secondary bg-[rgba(97,59,254,0.15)] border border-[rgba(97,59,254,0.3)] px-1.5 py-0.5 rounded-full">
                          <Zap size={8} /> New
                        </span>
                      )}
                      <span className="text-[10px] text-secondary-300">{update.date}</span>
                      <span className="text-[10px] text-secondary-300">·</span>
                      <span className="text-[10px] text-secondary-300">{update.type}</span>
                    </div>
                    <h3 className="text-sm font-semibold text-secondary-100 leading-snug">
                      {update.title}
                    </h3>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className={`text-[10px] font-semibold tracking-[0.08em] uppercase px-2.5 py-1 rounded-full border ${getSamaStatusClass(update.status)}`}>
                    {getSamaStatusLabel(update.status)}
                  </span>
                  <button className="flex items-center gap-1 text-[11px] text-primary font-medium hover:text-primary-300 transition-colors">
                    <ExternalLink size={11} /> SAMA Portal
                  </button>
                </div>
              </div>

              <p className="text-[12px] text-secondary-300 leading-relaxed mb-4">
                {update.description}
              </p>

              {/* Pipeline + impact */}
              <div className="flex items-center justify-between pt-4 border-t border-[rgba(255,255,255,0.04)]">
                <PipelineBar status={update.status} />
                <div className="flex items-center gap-4">
                  <span className={`text-[11px] font-semibold ${impactColor[update.status]}`}>
                    {update.status === "detected"
                      ? `⚠ ${update.impactedControls} controls impacted`
                      : update.status === "mapped"
                      ? `◆ ${update.impactedControls} controls mapped`
                      : `✓ ${update.impactedControls} controls assigned`}
                  </span>
                  <button
                    onClick={() => openAction(update)}
                    className="btn-outline-brand text-[11px] px-3 py-1"
                  >
                    {update.status === "detected" ? "Map Controls" : update.status === "mapped" ? "Assign Owners" : "View Progress"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="audit-card p-12 text-center">
            <p className="text-xs text-secondary-300">No regulatory updates match the current filters.</p>
          </div>
        )}
      </div>

      <SamaActionSheet
        update={actionUpdate}
        open={actionOpen}
        onOpenChange={setActionOpen}
        onStatusAdvance={handleStatusAdvance}
      />
    </MainLayout>
  );
}
