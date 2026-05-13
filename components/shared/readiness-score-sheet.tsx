"use client";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription,
} from "@/components/ui/sheet";
import { TrendingUp, Shield, Lock, Network, Database, Activity, CheckCircle2, Info } from "lucide-react";

interface ReadinessScoreSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  score: number;
  delta: number;
}

const domains = [
  { name: "Identity & Access Management", abbr: "IAM", weight: 25, score: 210, icon: Shield, color: "text-secondary", bar: "bg-secondary", border: "border-[rgba(97,59,254,0.3)]", bg: "bg-[rgba(97,59,254,0.08)]" },
  { name: "Encryption & Data Protection", abbr: "ENC", weight: 20, score: 172, icon: Lock, color: "text-[#6B9FFF]", bar: "bg-[#1854E8]", border: "border-[rgba(24,84,232,0.3)]", bg: "bg-[rgba(24,84,232,0.08)]" },
  { name: "Network Security", abbr: "NET", weight: 20, score: 155, icon: Network, color: "text-risk-medium", bar: "bg-risk-medium", border: "border-[rgba(249,169,49,0.3)]", bg: "bg-[rgba(249,169,49,0.08)]" },
  { name: "Data Governance", abbr: "DG", weight: 15, score: 135, icon: Database, color: "text-[#A48DFF]", bar: "bg-[#7C5CFF]", border: "border-[rgba(164,141,255,0.3)]", bg: "bg-[rgba(164,141,255,0.08)]" },
  { name: "Business Continuity & DR", abbr: "BCP", weight: 10, score: 78, icon: Activity, color: "text-risk-low", bar: "bg-risk-low", border: "border-[rgba(34,197,94,0.3)]", bg: "bg-[rgba(34,197,94,0.08)]" },
  { name: "Compliance Monitoring", abbr: "COM", weight: 10, score: 82, icon: CheckCircle2, color: "text-risk-high", bar: "bg-risk-high", border: "border-[rgba(216,36,42,0.3)]", bg: "bg-[rgba(216,36,42,0.08)]" },
];

const bands = [
  { min: 0,   max: 499, label: "At Risk",      color: "text-risk-high",   bg: "bg-[rgba(239,68,68,0.1)]",    border: "border-[rgba(239,68,68,0.25)]",  desc: "Critical gaps present. Audit failure likely." },
  { min: 500, max: 699, label: "Developing",   color: "text-risk-medium", bg: "bg-[rgba(249,169,49,0.1)]",   border: "border-[rgba(249,169,49,0.25)]", desc: "Controls identified but evidence incomplete." },
  { min: 700, max: 849, label: "Compliant",    color: "text-[#6B9FFF]",   bg: "bg-[rgba(107,159,255,0.1)]", border: "border-[rgba(107,159,255,0.25)]", desc: "Most evidence collected. Minor gaps remain." },
  { min: 850, max: 1000,label: "Audit Ready",  color: "text-risk-low",    bg: "bg-[rgba(34,197,94,0.1)]",    border: "border-[rgba(34,197,94,0.25)]",  desc: "Full evidence trail. Ready for SAMA review." },
];

function DomainRow({ domain, score }: { domain: typeof domains[0]; score: number }) {
  const maxScore = domain.weight * 10; // e.g. 25% × 10 = 250 pts max
  const pct = Math.round((domain.score / maxScore) * 100);
  return (
    <div className={`rounded-sm border ${domain.border} ${domain.bg} p-3`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <domain.icon size={13} className={domain.color} />
          <span className="text-xs font-semibold text-secondary-100">{domain.name}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-secondary-300">{domain.weight}% weight</span>
          <span className={`font-metrophobic text-sm ${domain.color}`}>{domain.score}<span className="text-[10px] text-secondary-300 font-sans">/{maxScore}</span></span>
        </div>
      </div>
      <div className="h-1.5 rounded-full bg-[rgba(255,255,255,0.06)] overflow-hidden">
        <div
          className={`h-full rounded-full ${domain.bar} transition-all duration-700`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="text-[10px] text-secondary-300 mt-1">{pct}% of domain max</p>
    </div>
  );
}

export function ReadinessScoreSheet({ open, onOpenChange, score, delta }: ReadinessScoreSheetProps) {
  const currentBand = bands.find(b => score >= b.min && score <= b.max) ?? bands[3];

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="flex flex-col overflow-hidden p-0 w-[540px]">
        <SheetHeader className="px-6 py-5 border-b border-[rgba(255,255,255,0.06)]">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp size={13} className="text-secondary" />
            <span className="text-[10px] font-semibold text-secondary tracking-[0.1em] uppercase">Audit Readiness Score</span>
          </div>
          <SheetTitle>How Your Score Is Calculated</SheetTitle>
          <SheetDescription>
            A SAMA-aligned composite score (0–1000) across six control domains, weighted by regulatory criticality.
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-5">

          {/* Current score hero */}
          <div className="flex items-center gap-5 bg-[rgba(42,30,92,0.4)] border border-[rgba(97,59,254,0.2)] rounded-sm p-4">
            <div className="flex flex-col items-center justify-center w-24 flex-shrink-0">
              <span className="font-metrophobic text-5xl text-secondary-100 leading-none">{score}</span>
              <span className="text-[10px] text-secondary-300 mt-1">out of 1000</span>
              <span className="text-[11px] text-risk-low font-semibold mt-1.5">↑ +{delta} pts</span>
            </div>
            <div className="flex-1 min-w-0">
              <span className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full border mb-2 ${currentBand.color} ${currentBand.bg} ${currentBand.border}`}>
                <span className="w-1.5 h-1.5 rounded-full bg-current" />
                {currentBand.label}
              </span>
              <p className="text-xs text-secondary-300 leading-relaxed">{currentBand.desc}</p>
            </div>
          </div>

          {/* Scoring algorithm */}
          <div>
            <p className="text-[10px] font-semibold tracking-[0.12em] uppercase text-secondary-300 mb-3">Scoring Algorithm</p>
            <div className="bg-[rgba(42,30,92,0.25)] border border-[rgba(255,255,255,0.06)] rounded-sm p-4 flex flex-col gap-2.5">
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-[rgba(97,59,254,0.2)] text-secondary text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">1</span>
                <div>
                  <p className="text-xs font-semibold text-secondary-100">Evidence stage scoring per control</p>
                  <p className="text-[11px] text-secondary-300 mt-0.5">Missing = 0 pts · Pending = 25% · In Review = 60% · Approved = 85% · Evidenced = 100%</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-[rgba(97,59,254,0.2)] text-secondary text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">2</span>
                <div>
                  <p className="text-xs font-semibold text-secondary-100">Risk multiplier applied</p>
                  <p className="text-[11px] text-secondary-300 mt-0.5">High risk controls = 3× weight · Medium = 2× · Low = 1×</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-[rgba(97,59,254,0.2)] text-secondary text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">3</span>
                <div>
                  <p className="text-xs font-semibold text-secondary-100">Domain weighting applied</p>
                  <p className="text-[11px] text-secondary-300 mt-0.5">Each domain contributes proportionally to the 1000-point total based on SAMA CCSF criticality</p>
                </div>
              </div>
            </div>
          </div>

          {/* Domain breakdown */}
          <div>
            <p className="text-[10px] font-semibold tracking-[0.12em] uppercase text-secondary-300 mb-3">Domain Breakdown</p>
            <div className="flex flex-col gap-2">
              {domains.map(d => <DomainRow key={d.abbr} domain={d} score={score} />)}
            </div>
          </div>

          {/* Threshold bands */}
          <div>
            <p className="text-[10px] font-semibold tracking-[0.12em] uppercase text-secondary-300 mb-3">Score Thresholds</p>
            <div className="flex flex-col gap-2">
              {bands.map(b => (
                <div key={b.label} className={`flex items-center justify-between px-3 py-2.5 rounded-sm border ${b.border} ${b.bg} ${score >= b.min && score <= b.max ? "ring-1 ring-current" : ""}`}>
                  <div className="flex items-center gap-2.5">
                    <span className={`text-[10px] font-bold w-20 ${b.color}`}>{b.min}–{b.max}</span>
                    <span className={`text-xs font-semibold ${b.color}`}>{b.label}</span>
                    {score >= b.min && score <= b.max && (
                      <span className="text-[9px] font-semibold tracking-[0.08em] uppercase text-secondary bg-[rgba(97,59,254,0.2)] px-1.5 py-0.5 rounded-full">You are here</span>
                    )}
                  </div>
                  <p className="text-[10px] text-secondary-300 text-right max-w-[180px]">{b.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Unique differentiator callout */}
          <div className="flex items-start gap-3 bg-[rgba(97,59,254,0.08)] border border-[rgba(97,59,254,0.25)] rounded-sm p-4">
            <Info size={14} className="text-secondary flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-semibold text-secondary mb-1">Unique to Audit Ready</p>
              <p className="text-[11px] text-secondary-300 leading-relaxed">
                This score is purpose-built for Saudi banks operating under SAMA's Cyber Security Framework (CCSF). Unlike generic GRC tools, domain weights and risk multipliers are calibrated to SAMA's own audit criteria — so your score directly reflects what SAMA inspectors prioritise during an on-site review.
              </p>
            </div>
          </div>

        </div>
      </SheetContent>
    </Sheet>
  );
}
