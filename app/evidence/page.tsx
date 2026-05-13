"use client";
import { useState } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { evidenceItems as initialItems } from "@/lib/mock-data";
import { EvidencePreviewSheet } from "@/components/shared/evidence-preview-sheet";
import type { EvidenceItem, EvidenceStatus } from "@/types";
import { Upload, Search, Download, Eye, ChevronDown, CheckCircle2, Clock, AlertCircle } from "lucide-react";

const statusIcon: Record<EvidenceStatus, React.ReactNode> = {
  approved: <CheckCircle2 size={13} className="text-risk-low" />,
  review:   <Clock size={13} className="text-[#6B9FFF]" />,
  pending:  <Clock size={13} className="text-risk-medium" />,
  missing:  <AlertCircle size={13} className="text-risk-high" />,
};

const statusLabel: Record<EvidenceStatus, string> = {
  approved: "Approved",
  review:   "In Review",
  pending:  "Pending",
  missing:  "Missing",
};

const statusClass: Record<EvidenceStatus, string> = {
  approved: "text-risk-low bg-[rgba(34,197,94,0.08)] border-[rgba(34,197,94,0.2)]",
  review:   "text-[#6B9FFF] bg-[rgba(107,159,255,0.08)] border-[rgba(107,159,255,0.2)]",
  pending:  "text-risk-medium bg-[rgba(249,169,49,0.08)] border-[rgba(249,169,49,0.2)]",
  missing:  "text-risk-high bg-[rgba(239,68,68,0.08)] border-[rgba(239,68,68,0.2)]",
};

const fileTypeEmoji: Record<string, string> = {
  PDF: "🔴",
  XLSX: "🟢",
  DOCX: "🔵",
  PNG: "🟡",
  CSV: "⚪",
  JSON: "🟤",
};

export default function EvidencePage() {
  const [items, setItems] = useState<EvidenceItem[]>(initialItems);
  const [search, setSearch] = useState("");
  const [stageFilter, setStageFilter] = useState<"all" | EvidenceStatus>("all");
  const [dragOver, setDragOver] = useState(false);
  const [previewItem, setPreviewItem] = useState<EvidenceItem | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  const openPreview = (ev: EvidenceItem) => { setPreviewItem(ev); setPreviewOpen(true); };
  const handleStatusChange = (id: string, status: EvidenceStatus) => {
    setItems((prev) => prev.map((ev) => ev.id === id ? { ...ev, stage: status } : ev));
  };

  const filtered = items.filter((e) => {
    const matchSearch =
      !search ||
      e.fileName.toLowerCase().includes(search.toLowerCase()) ||
      e.controlName.toLowerCase().includes(search.toLowerCase());
    const matchStage = stageFilter === "all" || e.stage === stageFilter;
    return matchSearch && matchStage;
  });

  const counts = {
    total:    items.length,
    approved: items.filter((e) => e.stage === "approved").length,
    review:   items.filter((e) => e.stage === "review").length,
    pending:  items.filter((e) => e.stage === "pending").length,
    missing:  items.filter((e) => e.stage === "missing").length,
  };

  return (
    <MainLayout>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-secondary-100">Evidence Hub</h1>
          <p className="text-xs text-secondary-300 mt-0.5">
            {counts.total} evidence items · {counts.missing} missing · {counts.pending} pending review
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn-outline-brand text-xs px-4 py-2 flex items-center gap-1.5">
            <Download size={13} /> Export All
          </button>
          <button className="btn-brand text-xs px-4 py-2 flex items-center gap-1.5">
            <Upload size={13} /> Upload Evidence
          </button>
        </div>
      </div>

      {/* Summary pills */}
      <div className="grid grid-cols-4 gap-4 mb-5">
        {[
          { label: "Approved", key: "approved" as EvidenceStatus, count: counts.approved, cls: "text-risk-low border-[rgba(34,197,94,0.2)] bg-[rgba(34,197,94,0.05)]" },
          { label: "In Review", key: "review" as EvidenceStatus, count: counts.review, cls: "text-[#6B9FFF] border-[rgba(107,159,255,0.2)] bg-[rgba(107,159,255,0.05)]" },
          { label: "Pending", key: "pending" as EvidenceStatus, count: counts.pending, cls: "text-risk-medium border-[rgba(249,169,49,0.2)] bg-[rgba(249,169,49,0.05)]" },
          { label: "Missing", key: "missing" as EvidenceStatus, count: counts.missing, cls: "text-risk-high border-[rgba(239,68,68,0.2)] bg-[rgba(239,68,68,0.05)]" },
        ].map((s) => (
          <button
            key={s.key}
            onClick={() => setStageFilter(stageFilter === s.key ? "all" : s.key)}
            className={`audit-card p-4 border flex items-center justify-between transition-all hover:brightness-110 ${s.cls} ${stageFilter === s.key ? "ring-1 ring-current" : ""}`}
          >
            <span className="text-xs font-medium">{s.label}</span>
            <span className="font-metrophobic text-2xl leading-none">{s.count}</span>
          </button>
        ))}
      </div>

      {/* Upload Drop Zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setDragOver(false); }}
        className={`audit-card border-2 border-dashed p-8 mb-5 flex flex-col items-center justify-center text-center transition-all ${
          dragOver
            ? "border-secondary bg-[rgba(97,59,254,0.08)]"
            : "border-[rgba(255,255,255,0.08)] hover:border-[rgba(255,255,255,0.15)]"
        }`}
      >
        <Upload size={28} className="text-secondary-300 mb-3" />
        <p className="text-sm font-medium text-secondary-100 mb-1">Drag & drop evidence files here</p>
        <p className="text-xs text-secondary-300 mb-3">
          Supports PDF, DOCX, XLSX, PNG, CSV — max 50MB per file
        </p>
        <button className="btn-outline-brand text-xs px-4 py-2">Browse Files</button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex items-center gap-2 flex-1 bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.07)] rounded-sm px-3 py-2">
          <Search size={14} className="text-secondary-300 flex-shrink-0" />
          <input
            type="text"
            placeholder="Search evidence items or controls..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent text-xs text-secondary-100 placeholder:text-secondary-300 outline-none flex-1"
          />
        </div>
        <div className="relative">
          <select
            value={stageFilter}
            onChange={(e) => setStageFilter(e.target.value as any)}
            className="appearance-none bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.07)] rounded-sm pl-3 pr-8 py-2 text-xs text-secondary-100 outline-none cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="approved">Approved</option>
            <option value="review">In Review</option>
            <option value="pending">Pending</option>
            <option value="missing">Missing</option>
          </select>
          <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-secondary-300 pointer-events-none" />
        </div>
        <span className="text-[11px] text-secondary-300">{filtered.length} items</span>
      </div>

      {/* Evidence List */}
      <div className="audit-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[rgba(255,255,255,0.06)]">
                {["File", "Linked Control", "Type", "Size", "Submitted By", "Date", "Status", ""].map((h) => (
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
              {filtered.map((ev) => (
                <tr
                  key={ev.id}
                  className="border-b border-[rgba(255,255,255,0.04)] last:border-0 hover:bg-[rgba(42,30,92,0.5)] transition-colors duration-150"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="text-base">{fileTypeEmoji[ev.fileType] ?? "📄"}</span>
                      <p className="text-xs font-medium text-secondary-100 max-w-[180px] truncate">{ev.fileName}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-[11px] text-secondary-300 max-w-[160px] truncate">{ev.controlName}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-[10px] font-mono text-secondary-300">{ev.fileType}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-[11px] text-secondary-300">{ev.fileSize}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-semibold flex-shrink-0 ${ev.submittedBy.colorClass}`}>
                        {ev.submittedBy.initials}
                      </div>
                      <span className="text-[11px] text-secondary-300 whitespace-nowrap">{ev.submittedBy.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-[11px] text-secondary-300 whitespace-nowrap">{ev.date}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1.5 text-[10px] font-semibold px-2 py-0.5 rounded-full border ${statusClass[ev.stage]}`}>
                      {statusIcon[ev.stage]}
                      {statusLabel[ev.stage]}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => openPreview(ev)}
                        className="w-7 h-7 flex items-center justify-center border border-[rgba(255,255,255,0.08)] rounded-sm text-secondary-300 hover:border-primary hover:text-primary transition-all"
                      >
                        <Eye size={12} />
                      </button>
                      <button className="w-7 h-7 flex items-center justify-center border border-[rgba(255,255,255,0.08)] rounded-sm text-secondary-300 hover:border-secondary hover:text-secondary transition-all">
                        <Download size={12} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-xs text-secondary-300">
                    No evidence items match the current filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <EvidencePreviewSheet
        item={previewItem}
        open={previewOpen}
        onOpenChange={setPreviewOpen}
        onStatusChange={handleStatusChange}
      />
    </MainLayout>
  );
}
