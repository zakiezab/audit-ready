"use client";
import { useState } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { ReportPreviewModal } from "@/components/shared/report-preview-modal";
import {
  Download, FileText, Shield, AlertTriangle, Users, Monitor,
  Info, ChevronDown, CheckCircle2, Eye, Share2, Plus, X,
  Clock, RefreshCw,
} from "lucide-react";

// ── Types ───────────────────────────────────────────────────────
type ReportId = "full-audit" | "sama-compliance" | "gap-analysis" | "evidence-inventory" | "ownership-summary";
type Permission = "Download" | "View Only";
type GenerateState = "idle" | "generating" | "ready";

interface Recipient {
  id: string;
  initials: string;
  name: string;
  email: string;
  role: string;
  permission: Permission;
  colorClass: string;
}

// ── Report type config ──────────────────────────────────────────
const reportTypes: { id: ReportId; name: string; desc: string; icon: React.ElementType; badge?: { label: string; cls: string } }[] = [
  {
    id: "full-audit",
    name: "Full Audit Package",
    desc: "All controls, evidence, approvals, and SAMA mappings. Complete audit-ready export.",
    icon: Monitor,
    badge: { label: "Ready", cls: "bg-[rgba(34,197,94,0.12)] text-risk-low border-[rgba(34,197,94,0.25)]" },
  },
  {
    id: "sama-compliance",
    name: "SAMA Compliance Report",
    desc: "Control-to-SAMA-circular mapping with status and evidence references.",
    icon: Shield,
    badge: { label: "Ready", cls: "bg-[rgba(34,197,94,0.12)] text-risk-low border-[rgba(34,197,94,0.25)]" },
  },
  {
    id: "gap-analysis",
    name: "Gap Analysis Report",
    desc: "High and medium risk gaps with responsible owners and required actions.",
    icon: AlertTriangle,
    badge: { label: "12 Gaps", cls: "bg-[rgba(239,68,68,0.1)] text-risk-high border-[rgba(239,68,68,0.25)]" },
  },
  {
    id: "evidence-inventory",
    name: "Evidence Inventory",
    desc: "Full list of submitted evidence items with validation status and owners.",
    icon: FileText,
    badge: { label: "Ready", cls: "bg-[rgba(34,197,94,0.12)] text-risk-low border-[rgba(34,197,94,0.25)]" },
  },
  {
    id: "ownership-summary",
    name: "Ownership Summary",
    desc: "Domain ownership matrix with review status, pending approvals, and overdue items.",
    icon: Users,
  },
];

// ── Export history mock data ────────────────────────────────────
const exportHistory = [
  {
    id: "h-1",
    name: "Full Audit Package — Q4 2024",
    meta: "67 controls · 134 evidence items",
    icon: Monitor,
    by: { initials: "ZZ", name: "Zakie Zabar", colorClass: "bg-secondary/20 text-secondary" },
    date: "14 May 2026",
    size: "48.2 MB",
    recipients: 3,
  },
  {
    id: "h-2",
    name: "SAMA Compliance Report — Mar 2026",
    meta: "42 controls · SAMA mapping",
    icon: Shield,
    by: { initials: "SM", name: "Sara Mohammed", colorClass: "bg-[rgba(97,59,254,0.15)] text-[#A48DFF]" },
    date: "31 Mar 2026",
    size: "12.7 MB",
    recipients: 5,
  },
  {
    id: "h-3",
    name: "Gap Analysis — Q1 2026",
    meta: "12 high-risk · 21 medium-risk gaps",
    icon: AlertTriangle,
    by: { initials: "NA", name: "Nora Abdulaziz", colorClass: "bg-[rgba(34,197,94,0.12)] text-risk-low" },
    date: "15 Jan 2026",
    size: "3.4 MB",
    recipients: 2,
  },
  {
    id: "h-4",
    name: "Evidence Inventory — Q3 2025",
    meta: "89 evidence items · 6 missing",
    icon: FileText,
    by: { initials: "RA", name: "Rayan Al-Dosari", colorClass: "bg-[rgba(34,197,94,0.15)] text-risk-low" },
    date: "30 Sep 2025",
    size: "8.1 MB",
    recipients: 4,
  },
];

// ── Page ────────────────────────────────────────────────────────
export default function ReportsPage() {
  const [selected, setSelected] = useState<ReportId>("full-audit");
  const [dateRange, setDateRange] = useState("Jan 2025 – Present");
  const [domain, setDomain] = useState("All Domains");
  const [format, setFormat] = useState("PDF Report + ZIP Archive");
  const [language, setLanguage] = useState("English + Arabic");
  const [generateState, setGenerateState] = useState<GenerateState>("idle");
  const [progress, setProgress] = useState(0);

  const [includes, setIncludes] = useState({
    attachments: true,
    auditTrail: true,
    samaRefs: true,
    riskScores: false,
    comments: false,
  });

  const [recipients, setRecipients] = useState<Recipient[]>([
    { id: "r-1", initials: "KA", name: "Khalid Al-Rashid", email: "k.alrashid@bank.sa", role: "External Auditor",    permission: "Download",  colorClass: "bg-[rgba(107,159,255,0.15)] text-[#6B9FFF]" },
    { id: "r-2", initials: "SM", name: "Sara Mohammed",    email: "s.m@bank.sa",          role: "Compliance Officer", permission: "View Only", colorClass: "bg-[rgba(97,59,254,0.15)] text-[#A48DFF]" },
    { id: "r-3", initials: "NA", name: "Nora Abdulaziz",   email: "n.a@bank.sa",          role: "CISO",               permission: "Download",  colorClass: "bg-[rgba(34,197,94,0.12)] text-risk-low" },
  ]);

  const togglePermission = (id: string) =>
    setRecipients(prev => prev.map(r => r.id === id
      ? { ...r, permission: r.permission === "Download" ? "View Only" : "Download" }
      : r));
  const removeRecipient = (id: string) => setRecipients(prev => prev.filter(r => r.id !== id));

  const handleGenerate = () => {
    setGenerateState("generating");
    setProgress(0);
    const interval = setInterval(() => {
      setProgress(p => {
        const next = p + Math.random() * 15;
        if (next >= 100) { clearInterval(interval); setGenerateState("ready"); return 100; }
        return next;
      });
    }, 180);
  };

  const handleReset = () => { setGenerateState("idle"); setProgress(0); };

  const [previewOpen, setPreviewOpen] = useState(false);

  const CheckboxItem = ({ checked, onChange, label }: { checked: boolean; onChange: () => void; label: string }) => (
    <label className="flex items-center gap-2.5 cursor-pointer group">
      <div
        onClick={onChange}
        className={`w-3.5 h-3.5 rounded-sm border flex items-center justify-center flex-shrink-0 transition-all ${
          checked ? "bg-secondary border-secondary" : "border-[rgba(255,255,255,0.2)] bg-[rgba(255,255,255,0.04)]"
        }`}
      >
        {checked && <CheckCircle2 size={8} className="text-white" strokeWidth={3} />}
      </div>
      <span className="text-xs text-secondary-200 group-hover:text-secondary-100 transition-colors">{label}</span>
    </label>
  );

  const SelectField = ({ label, value, options }: { label: string; value: string; options: string[] }) => (
    <div className="flex flex-col gap-1.5">
      <label className="text-[10px] font-semibold tracking-[0.06em] uppercase text-secondary-300">{label}</label>
      <div className="relative">
        <select
          className="w-full appearance-none bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] rounded-sm px-3 pr-8 py-2 text-xs text-secondary-100 outline-none cursor-pointer"
          value={value}
        >
          {options.map(o => <option key={o}>{o}</option>)}
        </select>
        <ChevronDown size={10} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-secondary-300 pointer-events-none" />
      </div>
    </div>
  );

  return (
    <MainLayout>
      {/* Why It Matters banner */}
      <div className="flex items-start gap-3.5 bg-[rgba(97,59,254,0.08)] border border-[rgba(97,59,254,0.25)] border-l-4 border-l-secondary rounded-md px-5 py-4 mb-6">
        <Info size={15} className="text-secondary flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-[9px] font-bold tracking-[0.12em] uppercase text-secondary mb-1">Why It Matters</p>
          <p className="text-xs text-secondary-200 leading-relaxed">
            Auditors need evidence packs in hours, not weeks. Stop assembling files manually — generate a complete, structured audit package instantly and share it securely with auditors and regulators.
          </p>
        </div>
      </div>

      {/* Page header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-secondary-100">Audit Export</h1>
          <p className="text-xs text-secondary-300 mt-0.5">Generate, download, and share audit-ready evidence packages</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn-outline-brand text-xs px-4 py-2 flex items-center gap-1.5">
            <FileText size={13} /> Export History
          </button>
          <button className="btn-brand text-xs px-4 py-2 flex items-center gap-1.5">
            <Download size={13} /> Generate New Package
          </button>
        </div>
      </div>

      {/* Main grid: 300px selector + 1fr config */}
      <div className="grid gap-5 mb-8" style={{ gridTemplateColumns: "300px 1fr" }}>

        {/* Left: Report type selector */}
        <div>
          <p className="text-[11px] font-bold tracking-[0.1em] uppercase text-secondary-300 mb-3">Report Type</p>
          <div className="flex flex-col gap-2">
            {reportTypes.map(rt => {
              const isActive = selected === rt.id;
              return (
                <button
                  key={rt.id}
                  onClick={() => { setSelected(rt.id); handleReset(); }}
                  className={`w-full text-left px-4 py-3.5 rounded-sm border transition-all ${
                    isActive
                      ? "bg-[rgba(97,59,254,0.08)] border-secondary"
                      : "bg-[rgba(255,255,255,0.02)] border-[rgba(255,255,255,0.07)] hover:border-[rgba(97,59,254,0.4)]"
                  }`}
                >
                  <div className="flex items-center gap-2.5 mb-1.5">
                    <div className="w-8 h-8 rounded-md bg-[rgba(97,59,254,0.15)] flex items-center justify-center flex-shrink-0">
                      <rt.icon size={14} className="text-secondary" />
                    </div>
                    <span className="text-xs font-semibold text-secondary-100 flex-1">{rt.name}</span>
                    {rt.badge && (
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${rt.badge.cls}`}>
                        {rt.badge.label}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-secondary-300 leading-snug pl-10">{rt.desc}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Config + Generate */}
        <div className="flex flex-col gap-4">

          {/* Export Scope */}
          <div className="audit-card p-5">
            <p className="text-xs font-semibold text-secondary-200 mb-4">Export Scope</p>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <SelectField
                label="Date Range"
                value={dateRange}
                options={["Jan 2025 – Present", "Q1 2026 (Jan–Mar)", "Q2 2026 (Apr–Jun)", "Full Year 2025", "Custom Range"]}
              />
              <SelectField
                label="Control Domain"
                value={domain}
                options={["All Domains", "Identity & Access Management", "Encryption & Data Protection", "Network Security", "Data Governance", "Business Continuity"]}
              />
            </div>
            <p className="text-[10px] font-semibold tracking-[0.06em] uppercase text-secondary-300 mb-3">Include in Export</p>
            <div className="flex flex-col gap-2.5">
              <CheckboxItem checked={includes.attachments} onChange={() => setIncludes(p => ({ ...p, attachments: !p.attachments }))} label="Evidence attachments (PDF, XLSX, screenshots)" />
              <CheckboxItem checked={includes.auditTrail}  onChange={() => setIncludes(p => ({ ...p, auditTrail: !p.auditTrail }))}   label="Approval audit trail with timestamps" />
              <CheckboxItem checked={includes.samaRefs}    onChange={() => setIncludes(p => ({ ...p, samaRefs: !p.samaRefs }))}       label="SAMA circular references" />
              <CheckboxItem checked={includes.riskScores}  onChange={() => setIncludes(p => ({ ...p, riskScores: !p.riskScores }))}   label="Control risk scores & methodology" />
              <CheckboxItem checked={includes.comments}    onChange={() => setIncludes(p => ({ ...p, comments: !p.comments }))}       label="Reviewer comments & annotations" />
            </div>
          </div>

          {/* Output Format */}
          <div className="audit-card p-5">
            <p className="text-xs font-semibold text-secondary-200 mb-4">Output Format</p>
            <div className="grid grid-cols-2 gap-3">
              <SelectField
                label="Format"
                value={format}
                options={["PDF Report + ZIP Archive", "PDF Only", "XLSX Spreadsheet", "ZIP Archive Only"]}
              />
              <SelectField
                label="Language"
                value={language}
                options={["English + Arabic", "English Only", "Arabic Only"]}
              />
            </div>
          </div>

          {/* Recipients */}
          <div className="audit-card p-5">
            <p className="text-xs font-semibold text-secondary-200 mb-4">Share With</p>
            <div className="flex flex-col">
              {recipients.map(r => (
                <div key={r.id} className="flex items-center gap-3 py-2.5 border-b border-[rgba(255,255,255,0.04)] last:border-0">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-semibold flex-shrink-0 ${r.colorClass}`}>
                    {r.initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-secondary-100">{r.name}</p>
                    <p className="text-[10px] text-secondary-300">{r.email} · {r.role}</p>
                  </div>
                  <button
                    onClick={() => togglePermission(r.id)}
                    className={`text-[10px] font-semibold px-2.5 py-1 rounded-full border transition-all ${
                      r.permission === "Download"
                        ? "text-risk-low bg-[rgba(34,197,94,0.08)] border-[rgba(34,197,94,0.3)]"
                        : "text-[#6B9FFF] bg-[rgba(107,159,255,0.08)] border-[rgba(107,159,255,0.3)]"
                    }`}
                  >
                    {r.permission}
                  </button>
                  <button
                    onClick={() => removeRecipient(r.id)}
                    className="w-5 h-5 flex items-center justify-center text-secondary-300 hover:text-risk-high transition-colors"
                  >
                    <X size={11} />
                  </button>
                </div>
              ))}
            </div>
            <button className="flex items-center gap-1.5 text-[11px] text-secondary hover:text-[#A48DFF] transition-colors mt-3">
              <Plus size={12} /> Add recipient
            </button>
          </div>

          {/* Generate CTA */}
          <div className="rounded-sm border border-[rgba(97,59,254,0.25)] bg-gradient-to-br from-[rgba(97,59,254,0.12)] to-[rgba(139,92,246,0.08)] p-5 text-center">
            {generateState === "idle" && (
              <>
                <p className="text-sm font-semibold text-secondary-100 mb-1.5">Audit Package Ready to Generate</p>
                <p className="text-[11px] text-secondary-300 mb-5">
                  67 controls · 134 evidence items · Full SAMA mapping · Last synced 4 min ago
                </p>
                <div className="flex items-center justify-center gap-2.5">
                  <button onClick={() => setPreviewOpen(true)} className="btn-outline-brand px-6 py-2.5 text-sm font-semibold flex items-center gap-2">
                    <Eye size={14} /> Preview
                  </button>
                  <button onClick={handleGenerate} className="btn-brand px-6 py-2.5 text-sm font-semibold flex items-center gap-2">
                    <Download size={14} /> Generate & Send
                  </button>
                </div>
              </>
            )}

            {generateState === "generating" && (
              <>
                <p className="text-sm font-semibold text-secondary-100 mb-1.5">Building Audit Package…</p>
                <p className="text-[11px] text-secondary-300 mb-4">{Math.min(Math.round(progress), 100)}% complete · Collecting evidence files</p>
                <div className="h-1.5 rounded-full bg-[rgba(255,255,255,0.06)] overflow-hidden mx-4 mb-4">
                  <div className="h-full rounded-full bg-secondary transition-all duration-200" style={{ width: `${Math.min(progress, 100)}%` }} />
                </div>
                <button disabled className="btn-brand px-6 py-2.5 text-sm font-semibold flex items-center gap-2 mx-auto opacity-60 cursor-not-allowed">
                  <Clock size={14} className="animate-spin" /> Generating…
                </button>
              </>
            )}

            {generateState === "ready" && (
              <>
                <div className="flex items-center justify-center gap-1.5 text-risk-low font-semibold text-sm mb-1.5">
                  <CheckCircle2 size={16} /> Package Ready
                </div>
                <p className="text-[11px] text-secondary-300 mb-5">
                  Sent to {recipients.length} recipient{recipients.length !== 1 ? "s" : ""} · {new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                </p>
                <div className="flex items-center justify-center gap-2.5">
                  <button onClick={handleReset} className="btn-outline-brand px-5 py-2.5 text-sm font-semibold flex items-center gap-2">
                    <RefreshCw size={13} /> Regenerate
                  </button>
                  <button className="btn-brand px-6 py-2.5 text-sm font-semibold flex items-center gap-2">
                    <Download size={14} /> Download Package
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Export History */}
      <div>
        <p className="text-[11px] font-bold tracking-[0.1em] uppercase text-secondary-300 mb-3">Export History</p>
        <div className="audit-card overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[rgba(255,255,255,0.06)]">
                {["Package", "Generated By", "Date", "Size", "Shared With", ""].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-[10px] font-semibold tracking-[0.08em] uppercase text-secondary-300 whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {exportHistory.map(h => (
                <tr key={h.id} className="border-b border-[rgba(255,255,255,0.04)] last:border-0 hover:bg-[rgba(42,30,92,0.5)] transition-colors">
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <h.icon size={15} className="text-secondary flex-shrink-0" />
                      <div>
                        <p className="text-xs font-medium text-secondary-100">{h.name}</p>
                        <p className="text-[10px] text-secondary-300 mt-0.5">{h.meta}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-semibold flex-shrink-0 ${h.by.colorClass}`}>
                        {h.by.initials}
                      </div>
                      <span className="text-xs text-secondary-200">{h.by.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="text-xs text-secondary-200">{h.date}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="text-[11px] text-secondary-300">{h.size}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="text-[11px] text-secondary-300">{h.recipients} recipient{h.recipients !== 1 ? "s" : ""}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-1.5">
                      <button className="flex items-center gap-1 text-[11px] font-medium text-secondary bg-[rgba(97,59,254,0.08)] border border-[rgba(97,59,254,0.2)] px-2.5 py-1 rounded-sm hover:bg-[rgba(97,59,254,0.18)] transition-all">
                        <Download size={11} /> Download
                      </button>
                      <button className="flex items-center gap-1 text-[11px] font-medium text-secondary-300 border border-[rgba(255,255,255,0.08)] px-2.5 py-1 rounded-sm hover:border-secondary hover:text-secondary transition-all">
                        <Share2 size={11} /> Share
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <ReportPreviewModal open={previewOpen} onOpenChange={setPreviewOpen} reportType={selected} />
    </MainLayout>
  );
}
