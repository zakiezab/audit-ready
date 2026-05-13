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
import { RiskBadge } from "@/components/shared/risk-badge";
import type { Task } from "@/types";
import {
  FileText,
  CheckCircle2,
  XCircle,
  ThumbsUp,
  ThumbsDown,
  Download,
  Clock,
  User,
  Shield,
  HardDrive,
} from "lucide-react";

interface ApprovalDetailSheetProps {
  item: Task | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
}

// Mock extended data for each approval item
const approvalDetails: Record<string, {
  fileName: string; fileType: string; fileSize: string;
  submittedBy: string; submittedOn: string;
  linkedControl: string; samaRef: string;
  summary: string;
}> = {
  "apq-001": {
    fileName: "Encryption_Audit_2026.pdf",
    fileType: "PDF", fileSize: "5.8 MB",
    submittedBy: "Net Security", submittedOn: "May 4, 2026",
    linkedControl: "Encryption Standards Validation",
    samaRef: "SAMA CCSF 3.5",
    summary: "Independent audit report validating AES-256 encryption at rest and TLS 1.3 in transit across all banking APIs and internal systems. Covers key management procedures and annual rotation schedule.",
  },
  "apq-002": {
    fileName: "IAM_Policy_Review_Q1_2026.pdf",
    fileType: "PDF", fileSize: "2.4 MB",
    submittedBy: "IT Security Team", submittedOn: "May 8, 2026",
    linkedControl: "Access Control Review",
    samaRef: "SAMA CCSF 4.2.1",
    summary: "Quarterly IAM policy review covering all user access rights, privilege levels, and role assignments across Azure AD and banking core systems. Includes evidence of least-privilege enforcement.",
  },
  "apq-003": {
    fileName: "Audit_Logging_Compliance_Check.json",
    fileType: "JSON", fileSize: "320 KB",
    submittedBy: "Compliance Team", submittedOn: "Apr 20, 2026",
    linkedControl: "Audit Logging Standards",
    samaRef: "SAMA CCSF 4.4",
    summary: "Automated compliance check output confirming all system events, user actions, and API calls are being logged and retained for 12 months. Validated against SAMA audit logging requirements.",
  },
};

const fileTypeColor: Record<string, string> = {
  PDF:  "bg-[rgba(239,68,68,0.15)] text-risk-high",
  JSON: "bg-[rgba(249,169,49,0.15)] text-risk-medium",
  DOCX: "bg-[rgba(24,84,232,0.15)] text-[#6B9FFF]",
  XLSX: "bg-[rgba(34,197,94,0.15)] text-risk-low",
};

const reviewTimeline = [
  { label: "Evidence submitted by owner",    meta: "See detail above",           color: "border-secondary-300 bg-secondary-300" },
  { label: "Sent to Governance for approval", meta: "Automated · Workflow rule", color: "border-[#6B9FFF] bg-[#6B9FFF]" },
  { label: "Awaiting your review",           meta: "Now",                        color: "border-secondary bg-secondary" },
];

export function ApprovalDetailSheet({ item, open, onOpenChange, onApprove, onReject }: ApprovalDetailSheetProps) {
  const [decision, setDecision] = useState<"approved" | "rejected" | null>(null);
  const [comment, setComment] = useState("");
  const [showRejectBox, setShowRejectBox] = useState(false);
  const [processing, setProcessing] = useState(false);

  if (!item) return null;

  const detail = approvalDetails[item.id] ?? approvalDetails["apq-001"];

  const handleApprove = () => {
    setProcessing(true);
    setTimeout(() => {
      setDecision("approved");
      setProcessing(false);
      onApprove?.(item.id);
    }, 700);
  };

  const handleReject = () => {
    setProcessing(true);
    setTimeout(() => {
      setDecision("rejected");
      setProcessing(false);
      onReject?.(item.id);
    }, 700);
  };

  return (
    <Sheet open={open} onOpenChange={(v) => { onOpenChange(v); if (!v) { setDecision(null); setComment(""); setShowRejectBox(false); setProcessing(false); } }}>
      <SheetContent side="right" className="flex flex-col overflow-hidden p-0 w-[500px]">
        {/* Header */}
        <SheetHeader className="px-6 py-5 border-b border-[rgba(255,255,255,0.06)]">
          <div className="flex items-center gap-2 mb-2">
            <RiskBadge risk={item.priority} />
            {decision ? (
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                decision === "approved"
                  ? "text-risk-low bg-[rgba(34,197,94,0.1)] border-[rgba(34,197,94,0.25)]"
                  : "text-risk-high bg-[rgba(239,68,68,0.08)] border-[rgba(239,68,68,0.2)]"
              }`}>
                {decision === "approved" ? "✓ Approved" : "✗ Rejected"}
              </span>
            ) : (
              <span className="text-[10px] font-semibold text-risk-medium bg-[rgba(249,169,49,0.1)] border border-[rgba(249,169,49,0.25)] px-2 py-0.5 rounded-full">
                Pending Approval
              </span>
            )}
          </div>
          <SheetTitle className="leading-snug">{item.title}</SheetTitle>
          <SheetDescription>{item.meta}</SheetDescription>
        </SheetHeader>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-5">
          {/* File card */}
          <div className="flex items-center gap-3 bg-[rgba(42,30,92,0.4)] border border-[rgba(97,59,254,0.2)] rounded-sm p-4">
            <div className="w-10 h-10 bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] rounded-sm flex items-center justify-center flex-shrink-0">
              <FileText size={18} className="text-secondary-300" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-secondary-100 truncate">{detail.fileName}</p>
              <p className="text-[10px] text-secondary-300 mt-0.5">{detail.fileSize} · Submitted {detail.submittedOn}</p>
            </div>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-sm ${fileTypeColor[detail.fileType] ?? "bg-[rgba(255,255,255,0.06)] text-secondary-300"}`}>
              {detail.fileType}
            </span>
          </div>

          {/* Metadata */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: <User size={12} />,    label: "Submitted By",    value: detail.submittedBy },
              { icon: <Clock size={12} />,   label: "Submitted On",    value: detail.submittedOn },
              { icon: <Shield size={12} />,  label: "Linked Control",  value: detail.linkedControl },
              { icon: <HardDrive size={12} />, label: "SAMA Reference", value: detail.samaRef },
            ].map(({ icon, label, value }) => (
              <div key={label} className="bg-[rgba(42,30,92,0.25)] border border-[rgba(255,255,255,0.06)] rounded-sm p-3">
                <div className="flex items-center gap-1.5 text-secondary-300 mb-1">
                  {icon}
                  <p className="text-[10px] font-semibold tracking-[0.08em] uppercase">{label}</p>
                </div>
                <p className="text-xs font-medium text-secondary-100 leading-snug">{value}</p>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div>
            <p className="text-[10px] font-semibold tracking-[0.12em] uppercase text-secondary-300 mb-2">Evidence Summary</p>
            <p className="text-[13px] text-secondary-200 font-light leading-relaxed">{detail.summary}</p>
          </div>

          {/* Decision feedback */}
          {decision === "approved" && (
            <div className="flex items-center gap-3 bg-[rgba(34,197,94,0.08)] border border-[rgba(34,197,94,0.2)] rounded-sm px-4 py-3">
              <CheckCircle2 size={16} className="text-risk-low flex-shrink-0" />
              <div>
                <p className="text-xs font-semibold text-risk-low">Evidence Approved</p>
                <p className="text-[10px] text-secondary-300 mt-0.5">Approved by Zakie Zabar · Just now · Control will advance to Evidenced</p>
              </div>
            </div>
          )}
          {decision === "rejected" && (
            <div className="flex items-center gap-3 bg-[rgba(239,68,68,0.06)] border border-[rgba(239,68,68,0.2)] rounded-sm px-4 py-3">
              <XCircle size={16} className="text-risk-high flex-shrink-0" />
              <div>
                <p className="text-xs font-semibold text-risk-high">Evidence Rejected</p>
                <p className="text-[10px] text-secondary-300 mt-0.5">Rejected by Zakie Zabar · Owner notified to resubmit</p>
              </div>
            </div>
          )}

          {/* Rejection comment box */}
          {!decision && showRejectBox && (
            <div className="bg-[rgba(239,68,68,0.06)] border border-[rgba(239,68,68,0.2)] rounded-sm p-4">
              <p className="text-[11px] font-semibold text-risk-high mb-2">Rejection Reason</p>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Explain what changes are required before resubmission..."
                rows={3}
                className="w-full bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] rounded-sm text-xs text-secondary-100 placeholder:text-secondary-300 p-2.5 outline-none resize-none focus:border-risk-high transition-all"
              />
              <div className="flex items-center gap-2 mt-2">
                <button
                  onClick={handleReject}
                  disabled={processing}
                  className="flex-1 text-xs font-medium py-2 rounded-sm bg-[rgba(239,68,68,0.12)] border border-[rgba(239,68,68,0.25)] text-risk-high hover:bg-[rgba(239,68,68,0.2)] transition-all disabled:opacity-50"
                >
                  Confirm Rejection
                </button>
                <button onClick={() => setShowRejectBox(false)} className="text-xs text-secondary-300 hover:text-secondary-100 px-3 transition-colors">
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Timeline */}
          <div>
            <p className="text-[10px] font-semibold tracking-[0.12em] uppercase text-secondary-300 mb-3">Review Trail</p>
            <div className="flex flex-col">
              {reviewTimeline.map((t, i) => (
                <div key={i} className="flex gap-3 pb-4 relative">
                  {i < reviewTimeline.length - 1 && <div className="absolute left-[5px] top-[14px] bottom-0 w-px bg-[rgba(255,255,255,0.06)]" />}
                  <div className={`w-2.5 h-2.5 rounded-full border-2 flex-shrink-0 mt-1 bg-[#181227] ${t.color}`} />
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
          {!decision ? (
            <>
              <Button className="flex-1" disabled={processing} onClick={handleApprove}>
                {processing ? "Processing…" : <><ThumbsUp size={13} className="mr-1.5" /> Approve</>}
              </Button>
              {!showRejectBox && (
                <Button variant="outline" onClick={() => setShowRejectBox(true)}>
                  <ThumbsDown size={13} className="mr-1.5" /> Reject
                </Button>
              )}
              <Button variant="outline">
                <Download size={13} className="mr-1.5" /> Download
              </Button>
            </>
          ) : (
            <Button variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>Close</Button>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
