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
import type { Task } from "@/types";
import {
  CheckCircle2,
  Clock,
  User,
  ArrowRight,
  MessageSquare,
  AlertTriangle,
  FileText,
} from "lucide-react";

interface TaskDetailSheetProps {
  task: Task | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onComplete?: (id: string) => void;
}

const taskDescriptions: Record<string, string> = {
  "task-001": "The IAM Policy Review Q1 2026 document (PDF, 2.4 MB) has been submitted by IT Security Team. Review the document against SAMA CCSF 4.2.1 requirements and either approve it or request changes from the submitter.",
  "task-002": "Data Governance Framework v3.2 has been updated by the Data Team. This document maps all banking data assets to SAMA DGF 2.1 classification requirements. Your approval is needed to advance the control to 'Evidenced'.",
  "task-003": "SAMA Circular CCSF 2.1 was published on May 6, 2026. Map the 5 impacted controls in your register to this circular. Use the Regulations page to complete the mapping workflow.",
  "task-004": "The Q2 2026 external audit is scheduled for May 27, 2026. Confirm the scope of evidence to be exported for the auditor pack. Review with compliance team which items need inclusion.",
};

const taskChecklist: Record<string, string[]> = {
  "task-001": ["Open the attached PDF document", "Check alignment with SAMA CCSF 4.2.1", "Validate evidence completeness", "Approve or request changes"],
  "task-002": ["Review Data Gov Framework v3.2", "Cross-check data classification tiers", "Validate SAMA DGF 2.1 references", "Approve for evidencing"],
  "task-003": ["Open SAMA Regulations feed", "Identify 5 impacted controls", "Map each control to CCSF 2.1", "Assign owners to mapped controls"],
  "task-004": ["List all approved evidence items", "Confirm scope with Compliance Team", "Prepare export package", "Send to external auditor liaison"],
};

export function TaskDetailSheet({ task, open, onOpenChange, onComplete }: TaskDetailSheetProps) {
  const [checked, setChecked] = useState<Set<number>>(new Set());
  const [completed, setCompleted] = useState(false);
  const [note, setNote] = useState("");

  if (!task) return null;

  const checklist = taskChecklist[task.id] ?? ["Review task details", "Take necessary action", "Update stakeholders", "Mark complete"];
  const description = taskDescriptions[task.id] ?? "Review and action the assigned task as per governance workflow requirements.";

  const toggleCheck = (i: number) =>
    setChecked((prev) => { const n = new Set(prev); n.has(i) ? n.delete(i) : n.add(i); return n; });

  const handleComplete = () => {
    setCompleted(true);
    setTimeout(() => { onComplete?.(task.id); onOpenChange(false); setCompleted(false); setChecked(new Set()); }, 1000);
  };

  return (
    <Sheet open={open} onOpenChange={(v) => { onOpenChange(v); if (!v) { setCompleted(false); setChecked(new Set()); setNote(""); } }}>
      <SheetContent side="right" className="flex flex-col overflow-hidden p-0 w-[480px]">
        {/* Header */}
        <SheetHeader className="px-6 py-5 border-b border-[rgba(255,255,255,0.06)]">
          <div className="flex items-center gap-2 mb-2">
            <RiskBadge risk={task.priority as any} />
            <span className={`text-[10px] font-semibold ${getDeadlineClass(task.deadlineStatus)}`}>
              {task.deadlineStatus === "overdue" && <AlertTriangle size={10} className="inline mr-1" />}
              Due: {task.due}
            </span>
          </div>
          <SheetTitle className="leading-snug">{task.title}</SheetTitle>
          <SheetDescription>{task.meta}</SheetDescription>
        </SheetHeader>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-5">
          {/* Meta */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: <User size={12} />, label: "Assigned To", value: "Zakie Zabar" },
              { icon: <Clock size={12} />, label: "Due Date", value: task.due },
              { icon: <FileText size={12} />, label: "Type", value: task.meta.split("·")[0].trim() },
              { icon: <ArrowRight size={12} />, label: "Priority", value: task.priority.charAt(0).toUpperCase() + task.priority.slice(1) },
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

          {/* Description */}
          <div>
            <p className="text-[10px] font-semibold tracking-[0.12em] uppercase text-secondary-300 mb-2">Description</p>
            <p className="text-[13px] text-secondary-200 font-light leading-relaxed">{description}</p>
          </div>

          {/* Checklist */}
          <div>
            <p className="text-[10px] font-semibold tracking-[0.12em] uppercase text-secondary-300 mb-2">
              Checklist ({checked.size}/{checklist.length})
            </p>
            <div className="flex flex-col gap-2">
              {checklist.map((item, i) => (
                <button
                  key={i}
                  onClick={() => toggleCheck(i)}
                  className={`flex items-center gap-3 p-3 rounded-sm border text-left transition-all ${
                    checked.has(i)
                      ? "bg-[rgba(34,197,94,0.06)] border-[rgba(34,197,94,0.2)]"
                      : "bg-[rgba(255,255,255,0.02)] border-[rgba(255,255,255,0.07)] hover:border-[rgba(255,255,255,0.15)]"
                  }`}
                >
                  <div className={`w-4 h-4 rounded-sm border flex items-center justify-center flex-shrink-0 transition-all ${
                    checked.has(i) ? "bg-risk-low border-risk-low" : "border-[rgba(255,255,255,0.2)]"
                  }`}>
                    {checked.has(i) && <CheckCircle2 size={10} className="text-white" />}
                  </div>
                  <span className={`text-xs transition-all ${checked.has(i) ? "line-through text-secondary-300" : "text-secondary-100"}`}>
                    {item}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Note */}
          <div>
            <p className="text-[10px] font-semibold tracking-[0.12em] uppercase text-secondary-300 mb-2">Add Note</p>
            <div className="flex items-start gap-2">
              <MessageSquare size={13} className="text-secondary-300 mt-2.5 flex-shrink-0" />
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Add a note or update for this task..."
                rows={3}
                className="flex-1 bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.07)] rounded-sm text-xs text-secondary-100 placeholder:text-secondary-300 p-2.5 outline-none resize-none focus:border-secondary transition-all"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <SheetFooter className="border-t border-[rgba(255,255,255,0.06)]">
          <Button className="flex-1" disabled={completed} onClick={handleComplete}>
            {completed
              ? <><CheckCircle2 size={13} className="mr-1.5" /> Completed!</>
              : <><CheckCircle2 size={13} className="mr-1.5" /> Mark Complete</>}
          </Button>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Close</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
