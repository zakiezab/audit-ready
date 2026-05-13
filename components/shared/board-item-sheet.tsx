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
import { getDeadlineClass } from "@/lib/utils";
import type { BoardItem, WorkflowStatus } from "@/types";
import {
  ArrowRight,
  Upload,
  CheckCircle2,
  FileText,
  Clock,
  AlertTriangle,
  User,
} from "lucide-react";

interface BoardItemSheetProps {
  item: BoardItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStatusChange?: (id: string, newStatus: WorkflowStatus) => void;
}

const workflowOrder: WorkflowStatus[] = ["overdue", "assigned", "in_review", "approved", "evidenced"];

const nextAction: Partial<Record<WorkflowStatus, { label: string; next: WorkflowStatus }>> = {
  overdue:   { label: "Submit Evidence",  next: "assigned"  },
  assigned:  { label: "Send for Review",  next: "in_review" },
  in_review: { label: "Approve Control",  next: "approved"  },
  approved:  { label: "Mark Evidenced",   next: "evidenced" },
};

const statusLabel: Record<WorkflowStatus, string> = {
  overdue:   "Overdue",
  assigned:  "Assigned",
  in_review: "In Review",
  approved:  "Approved",
  evidenced: "Evidenced",
};

const statusCls: Record<WorkflowStatus, string> = {
  overdue:   "text-risk-high bg-[rgba(239,68,68,0.1)] border-[rgba(239,68,68,0.25)]",
  assigned:  "text-secondary-200 bg-[rgba(255,255,255,0.06)] border-[rgba(255,255,255,0.15)]",
  in_review: "text-[#6B9FFF] bg-[rgba(24,84,232,0.1)] border-[rgba(24,84,232,0.25)]",
  approved:  "text-[#A48DFF] bg-[rgba(97,59,254,0.1)] border-[rgba(97,59,254,0.25)]",
  evidenced: "text-risk-low bg-[rgba(34,197,94,0.1)] border-[rgba(34,197,94,0.25)]",
};

const timeline = [
  { label: "Control added to register",  meta: "Mar 14, 2026 · Zakie Zabar",       icon: <FileText size={8} className="text-secondary-300" />, color: "border-[rgba(255,255,255,0.2)]" },
  { label: "Owner assigned",             meta: "Mar 15, 2026 · Zakie Zabar",       icon: <User size={8} className="text-risk-medium" />,      color: "border-risk-medium" },
  { label: "Evidence request sent",      meta: "Apr 1, 2026 · Automated",          icon: <AlertTriangle size={8} className="text-primary" />,  color: "border-primary" },
  { label: "Deadline passed — overdue",  meta: "May 1, 2026 · Automated trigger",  icon: <Clock size={8} className="text-risk-high" />,       color: "border-risk-high" },
];

export function BoardItemSheet({ item, open, onOpenChange, onStatusChange }: BoardItemSheetProps) {
  const [localStatus, setLocalStatus] = useState<WorkflowStatus | null>(null);
  const [actionDone, setActionDone] = useState(false);

  if (!item) return null;

  const currentStatus: WorkflowStatus = localStatus ?? item.workflowStatus;
  const action = nextAction[currentStatus];
  const stepIndex = workflowOrder.indexOf(currentStatus);

  const handleAction = () => {
    if (!action) return;
    setActionDone(true);
    setTimeout(() => {
      setLocalStatus(action.next);
      setActionDone(false);
      onStatusChange?.(item.id, action.next);
    }, 800);
  };

  return (
    <Sheet open={open} onOpenChange={(v) => { onOpenChange(v); if (!v) { setLocalStatus(null); setActionDone(false); } }}>
      <SheetContent side="right" className="flex flex-col overflow-hidden p-0 w-[480px]">
        {/* Header */}
        <SheetHeader className="px-6 py-5 border-b border-[rgba(255,255,255,0.06)]">
          <div className="flex items-center gap-2 mb-2">
            <RiskBadge risk={item.risk} />
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${statusCls[currentStatus]}`}>
              {statusLabel[currentStatus]}
            </span>
          </div>
          <SheetTitle className="leading-snug">{item.name}</SheetTitle>
          <SheetDescription>{item.domain}</SheetDescription>
        </SheetHeader>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-5">
          {/* Workflow progress */}
          <div>
            <p className="text-[10px] font-semibold tracking-[0.1em] uppercase text-secondary-300 mb-3">Workflow Progress</p>
            <div className="flex items-center gap-0">
              {workflowOrder.filter((s) => s !== "overdue").map((s, i, arr) => {
                const orderedIdx = workflowOrder.indexOf(s);
                const isDone = stepIndex >= orderedIdx;
                const isCurrent = currentStatus === s;
                return (
                  <div key={s} className="flex items-center flex-1">
                    <div className={`flex-1 flex flex-col items-center gap-1`}>
                      <div className={`w-2.5 h-2.5 rounded-full border-2 transition-all ${
                        isCurrent ? "border-secondary bg-secondary" :
                        isDone    ? "border-risk-low bg-risk-low"   :
                        "border-[rgba(255,255,255,0.15)] bg-transparent"
                      }`} />
                      <span className={`text-[9px] font-semibold ${isCurrent ? "text-secondary-100" : isDone ? "text-risk-low" : "text-secondary-300"}`}>
                        {statusLabel[s]}
                      </span>
                    </div>
                    {i < arr.length - 1 && (
                      <div className={`h-px flex-1 mb-3 transition-all ${isDone ? "bg-risk-low/40" : "bg-[rgba(255,255,255,0.06)]"}`} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Meta grid */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Owner", value: item.owner.name },
              { label: "Deadline", value: item.deadline, cls: getDeadlineClass(item.deadlineStatus) },
              ...(item.samaRef ? [{ label: "SAMA Reference", value: item.samaRef }] : []),
            ].map(({ label, value, cls }) => (
              <div key={label} className="bg-[rgba(42,30,92,0.35)] border border-[rgba(255,255,255,0.06)] rounded-sm p-3">
                <p className="text-[10px] font-semibold tracking-[0.08em] uppercase text-secondary-300 mb-1">{label}</p>
                <p className={`text-xs font-medium ${cls ?? "text-secondary-100"}`}>{value}</p>
              </div>
            ))}
          </div>

          {/* Evidence placeholder */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-[10px] font-semibold tracking-[0.12em] uppercase text-secondary-300">Evidence</p>
              <Button variant="outline" size="sm" className="gap-1 text-[10px]">
                <Upload size={10} /> Upload
              </Button>
            </div>
            {currentStatus === "evidenced" || currentStatus === "approved" ? (
              <div className="flex items-center gap-3 bg-[rgba(34,197,94,0.06)] border border-[rgba(34,197,94,0.2)] rounded-sm p-3">
                <FileText size={14} className="text-risk-low flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-xs font-medium text-secondary-100">Evidence_Report_Final.pdf</p>
                  <p className="text-[10px] text-secondary-300 mt-0.5">Uploaded Apr 28 · 2.4 MB · Approved</p>
                </div>
                <CheckCircle2 size={14} className="text-risk-low flex-shrink-0" />
              </div>
            ) : (
              <div className="border border-dashed border-[rgba(255,255,255,0.08)] rounded-sm p-5 text-center">
                <Upload size={20} className="text-secondary-300 mx-auto mb-2" />
                <p className="text-xs text-secondary-300 mb-2">No evidence uploaded yet</p>
                <Button variant="outline" size="sm">Browse Files</Button>
              </div>
            )}
          </div>

          {/* Next action banner */}
          {action && currentStatus !== "evidenced" && (
            <div className="bg-[rgba(97,59,254,0.08)] border border-[rgba(97,59,254,0.2)] rounded-sm p-4 flex items-center gap-3">
              <ArrowRight size={16} className="text-secondary flex-shrink-0" />
              <div className="flex-1">
                <p className="text-xs font-semibold text-secondary-100">Next step: {action.label}</p>
                <p className="text-[10px] text-secondary-300 mt-0.5">Move this control to "{statusLabel[action.next]}"</p>
              </div>
            </div>
          )}

          {/* Timeline */}
          <div>
            <p className="text-[10px] font-semibold tracking-[0.12em] uppercase text-secondary-300 mb-3">Activity</p>
            <div className="flex flex-col">
              {timeline.slice(0, stepIndex + 2).map((t, i, arr) => (
                <div key={i} className="flex gap-3 pb-4 relative">
                  {i < arr.length - 1 && <div className="absolute left-[5px] top-[14px] bottom-0 w-px bg-[rgba(255,255,255,0.06)]" />}
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
          {action && (
            <Button className="flex-1" disabled={actionDone} onClick={handleAction}>
              {actionDone ? <><CheckCircle2 size={13} className="mr-1.5" /> Done!</> : <><ArrowRight size={13} className="mr-1.5" />{action.label}</>}
            </Button>
          )}
          {currentStatus === "evidenced" && (
            <Button className="flex-1" variant="outline" onClick={() => onOpenChange(false)}>
              <CheckCircle2 size={13} className="mr-1.5 text-risk-low" /> Fully Evidenced
            </Button>
          )}
          <Button variant="outline" onClick={() => onOpenChange(false)}>Close</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
