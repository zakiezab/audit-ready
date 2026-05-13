"use client";
import { useState } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import {
  Download, FileText, Shield, BarChart2, Package,
  LayoutDashboard, CheckCircle2, Clock, RefreshCw, ChevronDown, Eye,
} from "lucide-react";

// ── Report type definitions ─────────────────────────────────────
type ReportFormat = "PDF" | "XLSX" | "ZIP";
type GenerateState = "idle" | "generating" | "ready";

interface ReportType {
  id: string;
  title: string;
  description: string;
  format: ReportFormat;
  estimatedTime: string;
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  accentBorder: string;
  sections: string[];
}

const reportTypes: ReportType[] = [
  {
    id: "full-audit",
    title: "Full Audit Package",
    description: "Complete export of all controls, evidence files, owner assignments, and SAMA regulatory mappings. Suitable for handing directly to SAMA inspectors.",
    format: "ZIP",
    estimatedTime: "~45 sec",
    icon: Package,
    iconBg: "bg-[rgba(97,59,254,0.15)]",
    iconColor: "text-secondary",
    accentBorder: "border-t-secondary",
    sections: ["Control Register", "All Evidence Files", "Owner Assignments", "SAMA Mappings", "Readiness Score History"],
  },
  {
    id: "sama-compliance",
    title: "SAMA Compliance Summary",
    description: "Regulatory alignment report mapped to SAMA CCSF domains. Shows coverage percentage per domain and highlights open requirements.",
    format: "PDF",
    estimatedTime: "~15 sec",
    icon: Shield,
    iconBg: "bg-[rgba(216,36,42,0.12)]",
    iconColor: "text-risk-high",
    accentBorder: "border-t-risk-high",
    sections: ["CCSF Domain Coverage", "Open Requirements", "Regulatory Timeline", "Risk Heatmap"],
  },
  {
    id: "evidence-collection",
    title: "Evidence Collection Report",
    description: "Full status of all evidence items — approved, in review, pending, and missing — with owner and deadline details.",
    format: "XLSX",
    estimatedTime: "~10 sec",
    icon: FileText,
    iconBg: "bg-[rgba(249,169,49,0.12)]",
    iconColor: "text-risk-medium",
    accentBorder: "border-t-risk-medium",
    sections: ["Evidence Status Matrix", "Owner Breakdown", "Overdue Items", "Submission Timeline"],
  },
  {
    id: "gap-analysis",
    title: "Gap Analysis Report",
    description: "Prioritised list of open control gaps ranked by risk severity. Includes recommended remediation steps and estimated effort.",
    format: "PDF",
    estimatedTime: "~20 sec",
    icon: BarChart2,
    iconBg: "bg-[rgba(107,159,255,0.12)]",
    iconColor: "text-[#6B9FFF]",
    accentBorder: "border-t-[#6B9FFF]",
    sections: ["Gap Register", "Risk Prioritisation", "Remediation Recommendations", "Effort Estimates"],
  },
  {
    id: "executive-dashboard",
    title: "Executive Dashboard",
    description: "One-page summary for leadership and board-level reporting. Shows readiness score, top risks, and audit cycle status at a glance.",
    format: "PDF",
    estimatedTime: "~8 sec",
    icon: LayoutDashboard,
    iconBg: "bg-[rgba(34,197,94,0.12)]",
    iconColor: "text-risk-low",
    accentBorder: "border-t-risk-low",
    sections: ["Readiness Score Summary", "Top 3 Risks", "Cycle Progress", "Key Metrics"],
  },
];

const formatBadge: Record<ReportFormat, string> = {
  PDF:  "bg-[rgba(239,68,68,0.15)] text-risk-high",
  XLSX: "bg-[rgba(34,197,94,0.15)] text-risk-low",
  ZIP:  "bg-[rgba(97,59,254,0.15)] text-secondary",
};

const recentExports = [
  { id: "exp-1", title: "SAMA Compliance Summary", format: "PDF" as ReportFormat, generatedBy: "Zakie Zabar", date: "May 10, 2026", size: "1.2 MB" },
  { id: "exp-2", title: "Gap Analysis Report", format: "PDF" as ReportFormat, generatedBy: "Rayan Al-Dosari", date: "May 7, 2026", size: "3.4 MB" },
  { id: "exp-3", title: "Evidence Collection Report", format: "XLSX" as ReportFormat, generatedBy: "Sara Al-Ghamdi", date: "Apr 30, 2026", size: "820 KB" },
  { id: "exp-4", title: "Full Audit Package", format: "ZIP" as ReportFormat, generatedBy: "Zakie Zabar", date: "Apr 15, 2026", size: "48.6 MB" },
];

// ── Report card ─────────────────────────────────────────────────
function ReportCard({ report }: { report: ReportType }) {
  const [state, setState] = useState<GenerateState>("idle");
  const [progress, setProgress] = useState(0);
  const [expanded, setExpanded] = useState(false);

  const handleGenerate = () => {
    setState("generating");
    setProgress(0);
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          setState("ready");
          return 100;
        }
        return p + Math.random() * 18;
      });
    }, 200);
  };

  const handleReset = () => { setState("idle"); setProgress(0); };

  return (
    <div className={`audit-card flex flex-col border-t-2 ${report.accentBorder}`}>
      <div className="p-5 flex-1">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-md flex items-center justify-center flex-shrink-0 ${report.iconBg}`}>
              <report.icon size={16} className={report.iconColor} />
            </div>
            <div>
              <p className="text-sm font-semibold text-secondary-100">{report.title}</p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-sm ${formatBadge[report.format]}`}>
                  {report.format}
                </span>
                <span className="text-[10px] text-secondary-300">{report.estimatedTime}</span>
              </div>
            </div>
          </div>
        </div>

        <p className="text-[12px] text-secondary-300 leading-relaxed mb-3">{report.description}</p>

        {/* Sections toggle */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1 text-[10px] text-secondary-300 hover:text-secondary-100 transition-colors mb-3"
        >
          <ChevronDown size={11} className={`transition-transform ${expanded ? "rotate-180" : ""}`} />
          {expanded ? "Hide" : "Show"} included sections
        </button>

        {expanded && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {report.sections.map(s => (
              <span key={s} className="text-[10px] text-secondary-300 bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.07)] px-2 py-0.5 rounded-sm">
                {s}
              </span>
            ))}
          </div>
        )}

        {/* Progress bar */}
        {state === "generating" && (
          <div className="mb-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] text-secondary-300">Generating report…</span>
              <span className="text-[10px] text-secondary">{Math.min(Math.round(progress), 100)}%</span>
            </div>
            <div className="h-1 rounded-full bg-[rgba(255,255,255,0.06)] overflow-hidden">
              <div
                className="h-full rounded-full bg-secondary transition-all duration-200"
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>
          </div>
        )}

        {state === "ready" && (
          <div className="flex items-center gap-2 mb-3 text-[11px] text-risk-low font-medium">
            <CheckCircle2 size={13} />
            Report ready to download
          </div>
        )}
      </div>

      {/* Footer actions */}
      <div className="px-5 pb-5 flex items-center gap-2">
        {state === "idle" && (
          <button
            onClick={handleGenerate}
            className="flex-1 btn-brand text-xs px-4 py-2 flex items-center justify-center gap-1.5"
          >
            <RefreshCw size={12} /> Generate Report
          </button>
        )}
        {state === "generating" && (
          <button disabled className="flex-1 btn-brand text-xs px-4 py-2 flex items-center justify-center gap-1.5 opacity-60 cursor-not-allowed">
            <Clock size={12} className="animate-spin" /> Generating…
          </button>
        )}
        {state === "ready" && (
          <>
            <button
              onClick={handleReset}
              className="flex-1 btn-brand text-xs px-4 py-2 flex items-center justify-center gap-1.5"
            >
              <Download size={12} /> Download {report.format}
            </button>
            <button
              onClick={handleReset}
              className="w-9 h-9 flex items-center justify-center border border-[rgba(255,255,255,0.08)] rounded-sm text-secondary-300 hover:border-secondary hover:text-secondary transition-all"
              title="Regenerate"
            >
              <RefreshCw size={13} />
            </button>
          </>
        )}
      </div>
    </div>
  );
}

// ── Page ────────────────────────────────────────────────────────
export default function ReportsPage() {
  return (
    <MainLayout>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-secondary-100">Reports & Audit Export</h1>
          <p className="text-xs text-secondary-300 mt-0.5">
            Generate and download audit-ready packages for SAMA inspectors, leadership, and internal review
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-[11px] text-risk-low font-semibold px-3 py-1.5 rounded-full border border-[rgba(34,197,94,0.25)] bg-[rgba(34,197,94,0.08)]">
            <span className="w-1.5 h-1.5 rounded-full bg-risk-low" />
            Q2 2026 Cycle Active
          </div>
        </div>
      </div>

      {/* Report cards grid */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {reportTypes.map(r => <ReportCard key={r.id} report={r} />)}
      </div>

      {/* Recent exports */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="text-[10px] font-semibold tracking-[0.12em] uppercase text-secondary-300">Recent Exports</p>
          <span className="text-[11px] text-secondary-300">{recentExports.length} exports</span>
        </div>
        <div className="audit-card overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[rgba(255,255,255,0.06)]">
                {["Report", "Format", "Generated By", "Date", "Size", ""].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-[10px] font-semibold tracking-[0.1em] uppercase text-secondary-300 whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentExports.map(exp => (
                <tr key={exp.id} className="border-b border-[rgba(255,255,255,0.04)] last:border-0 hover:bg-[rgba(42,30,92,0.5)] transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <FileText size={13} className="text-secondary-300" />
                      <span className="text-xs font-medium text-secondary-100">{exp.title}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-sm ${formatBadge[exp.format]}`}>{exp.format}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-[11px] text-secondary-300">{exp.generatedBy}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-[11px] text-secondary-300">{exp.date}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-[11px] text-secondary-300">{exp.size}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <button className="w-7 h-7 flex items-center justify-center border border-[rgba(255,255,255,0.08)] rounded-sm text-secondary-300 hover:border-secondary hover:text-secondary transition-all">
                        <Eye size={12} />
                      </button>
                      <button className="w-7 h-7 flex items-center justify-center border border-[rgba(255,255,255,0.08)] rounded-sm text-secondary-300 hover:border-secondary hover:text-secondary transition-all">
                        <Download size={12} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </MainLayout>
  );
}
