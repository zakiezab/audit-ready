"use client";
import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import type { EvidenceItem, EvidenceStatus } from "@/types";
import {
  FileText,
  Download,
  CheckCircle2,
  Clock,
  AlertCircle,
  XCircle,
  RotateCcw,
  Eye,
  Shield,
  User,
  Calendar,
  HardDrive,
} from "lucide-react";

interface EvidencePreviewSheetProps {
  item: EvidenceItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStatusChange?: (id: string, status: EvidenceStatus) => void;
}

const fileTypeColor: Record<string, string> = {
  PDF:  "bg-[rgba(239,68,68,0.15)] text-risk-high",
  DOCX: "bg-[rgba(24,84,232,0.15)] text-[#6B9FFF]",
  XLSX: "bg-[rgba(34,197,94,0.15)] text-risk-low",
  JSON: "bg-[rgba(249,169,49,0.15)] text-risk-medium",
  PNG:  "bg-[rgba(249,169,49,0.15)] text-risk-medium",
  CSV:  "bg-[rgba(255,255,255,0.08)] text-secondary-300",
};

const statusConfig: Record<EvidenceStatus, { label: string; cls: string; icon: React.ReactNode }> = {
  approved: { label: "Approved",  cls: "text-risk-low bg-[rgba(34,197,94,0.1)] border-[rgba(34,197,94,0.25)]", icon: <CheckCircle2 size={12} /> },
  review:   { label: "In Review", cls: "text-[#6B9FFF] bg-[rgba(107,159,255,0.1)] border-[rgba(107,159,255,0.25)]", icon: <Eye size={12} /> },
  pending:  { label: "Pending",   cls: "text-risk-medium bg-[rgba(249,169,49,0.1)] border-[rgba(249,169,49,0.25)]", icon: <Clock size={12} /> },
  missing:  { label: "Missing",   cls: "text-risk-high bg-[rgba(239,68,68,0.08)] border-[rgba(239,68,68,0.2)]",   icon: <AlertCircle size={12} /> },
};

function FilePreviewPlaceholder({ fileType }: { fileType: string }) {
  const lines = fileType === "PDF"  ? [80, 100, 65, 100, 45, 90, 70, 55, 100, 80] :
                fileType === "XLSX" ? [100, 100, 100, 100, 100, 100, 100] :
                fileType === "DOCX" ? [90, 100, 75, 100, 55, 80, 100, 45] :
                [100, 60, 80, 40, 100, 70];

  return (
    <div className="relative bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] rounded-sm overflow-hidden h-40 flex items-center justify-center">
      <div className="w-full px-6 py-4 space-y-2 opacity-30">
        {fileType === "XLSX" ? (
          <div className="grid grid-cols-4 gap-1">
            {Array.from({ length: 28 }).map((_, i) => (
              <div key={i} className="h-3 bg-[rgba(255,255,255,0.15)] rounded-sm" />
            ))}
          </div>
        ) : (
          lines.map((w, i) => (
            <div key={i} className="h-1.5 bg-[rgba(255,255,255,0.2)] rounded-full" style={{ width: `${w}%` }} />
          ))
        )}
      </div>
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-[rgba(19,14,35,0.6)] backdrop-blur-[2px]">
        <FileText size={28} className="text-secondary-300 mb-2" />
        <p className="text-[11px] text-secondary-300 font-medium">Preview — {fileType}</p>
        <p className="text-[10px] text-secondary-300 opacity-60 mt-0.5">Open file to view full content</p>
      </div>
    </div>
  );
}

const timeline = [
  { label: "File uploaded by owner", meta: "May 11, 2026 · Submitter", color: "border-secondary", dot: "bg-secondary" },
  { label: "Sent for IT Governance review", meta: "May 11, 2026 · Automated", color: "border-[#6B9FFF]", dot: "bg-[#6B9FFF]" },
  { label: "Evidence request created", meta: "May 9, 2026 · Zakie Zabar", color: "border-risk-medium", dot: "bg-risk-medium" },
];

export function EvidencePreviewSheet({ item, open, onOpenChange, onStatusChange }: EvidencePreviewSheetProps) {
  const [localStatus, setLocalStatus] = useState<EvidenceStatus | null>(null);
  const [comment, setComment] = useState("");
  const [rejecting, setRejecting] = useState(false);

  if (!item) return null;

  const currentStatus = localStatus ?? item.stage;
  const sc = statusConfig[currentStatus];

  const handleApprove = () => {
    setLocalStatus("approved");
    setRejecting(false);
    onStatusChange?.(item.id, "approved");
  };

  const handleRequestChanges = () => {
    setLocalStatus("pending");
    setRejecting(false);
    onStatusChange?.(item.id, "pending");
  };

  return (
    <Sheet open={open} onOpenChange={(v) => { onOpenChange(v); if (!v) { setLocalStatus(null); setComment(""); setRejecting(false); } }}>
      <SheetContent side="right" className="flex flex-col overflow-hidden p-0 w-[500px]">
        {/* Header */}
        <SheetHeader className="px-6 py-5 border-b border-[rgba(255,255,255,0.06)]">
          <div className="flex items-center gap-2 mb-2">
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-sm font-mono ${fileTypeColor[item.fileType] ?? "bg-[rgba(255,255,255,0.08)] text-secondary-300"}`}>
              {item.fileType}
            </span>
            <span className={`inline-flex items-center gap-1.5 text-[10px] font-semibold px-2 py-0.5 rounded-full border ${sc.cls}`}>
              {sc.icon} {sc.label}
            </span>
          </div>
          <SheetTitle className="leading-snug">{item.fileName}</SheetTitle>
          <SheetDescription>Linked to: {item.controlName}</SheetDescription>
        </SheetHeader>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-5">
          {/* File preview */}
          <FilePreviewPlaceholder fileType={item.fileType} />

          {/* Metadata grid */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: <User size={12} />, label: "Submitted By", value: item.submittedBy.name },
              { icon: <Calendar size={12} />, label: "Submitted On", value: item.date },
              { icon: <HardDrive size={12} />, label: "File Size", value: item.fileSize },
              { icon: <Shield size={12} />, label: "Linked Control", value: item.controlName },
            ].map(({ icon, label, value }) => (
              <div key={label} className="bg-[rgba(42,30,92,0.35)] border border-[rgba(255,255,255,0.06)] rounded-sm p-3">
                <div className="flex items-center gap-1.5 text-secondary-300 mb-1">
                  {icon}
                  <p className="text-[10px] font-semibold tracking-[0.08em] uppercase">{label}</p>
                </div>
                <p className="text-xs font-medium text-secondary-100">{value}</p>
              </div>
            ))}
          </div>

          {/* Rejection / comment box */}
          {currentStatus === "approved" ? (
            <div className="flex items-center gap-2.5 bg-[rgba(34,197,94,0.08)] border border-[rgba(34,197,94,0.2)] rounded-sm px-4 py-3">
              <CheckCircle2 size={16} className="text-risk-low flex-shrink-0" />
              <div>
                <p className="text-xs font-semibold text-risk-low">Evidence Approved</p>
                <p className="text-[10px] text-secondary-300 mt-0.5">Approved by Zakie Zabar · Just now</p>
              </div>
              <button onClick={() => setLocalStatus(null)} className="ml-auto text-[10px] text-secondary-300 hover:text-secondary-100 flex items-center gap-1 transition-colors">
                <RotateCcw size={10} /> Undo
              </button>
            </div>
          ) : rejecting ? (
            <div className="bg-[rgba(239,68,68,0.06)] border border-[rgba(239,68,68,0.2)] rounded-sm p-4">
              <p className="text-[11px] font-semibold text-risk-high mb-2">Request Changes</p>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Describe what changes are needed..."
                rows={3}
                className="w-full bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] rounded-sm text-xs text-secondary-100 placeholder:text-secondary-300 p-2.5 outline-none resize-none focus:border-risk-high transition-all"
              />
              <div className="flex items-center gap-2 mt-2">
                <button onClick={handleRequestChanges} className="flex-1 text-xs font-medium py-2 rounded-sm bg-[rgba(239,68,68,0.12)] border border-[rgba(239,68,68,0.25)] text-risk-high hover:bg-[rgba(239,68,68,0.2)] transition-all">
                  Send Request
                </button>
                <button onClick={() => setRejecting(false)} className="text-xs text-secondary-300 hover:text-secondary-100 px-3 transition-colors">Cancel</button>
              </div>
            </div>
          ) : null}

          {/* Activity */}
          <div>
            <p className="text-[10px] font-semibold tracking-[0.12em] uppercase text-secondary-300 mb-3">Activity</p>
            <div className="flex flex-col gap-0">
              {timeline.map((t, i) => (
                <div key={i} className="flex gap-3 pb-4 relative">
                  {i < timeline.length - 1 && (
                    <div className="absolute left-[5px] top-[14px] bottom-0 w-px bg-[rgba(255,255,255,0.06)]" />
                  )}
                  <div className={`w-2.5 h-2.5 rounded-full border-2 flex-shrink-0 mt-1 ${t.dot} ${t.color}`} />
                  <div>
                    <p className="text-xs font-medium text-secondary-100">{t.label}</p>
                    <p className="text-[10px] text-secondary-300 mt-0.5">{t.meta}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <SheetFooter className="border-t border-[rgba(255,255,255,0.06)]">
          {currentStatus !== "approved" && (
            <Button className="flex-1" onClick={handleApprove}>
              <CheckCircle2 size={13} className="mr-1.5" /> Approve Evidence
            </Button>
          )}
          {currentStatus !== "approved" && currentStatus !== "pending" && (
            <Button variant="outline" onClick={() => setRejecting(true)}>
              <XCircle size={13} className="mr-1.5" /> Request Changes
            </Button>
          )}
          <Button variant="outline">
            <Download size={13} className="mr-1.5" /> Download
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
