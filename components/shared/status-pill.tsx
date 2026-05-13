import { cn } from "@/lib/utils";
import type { EvidenceStatus, WorkflowStatus } from "@/types";

type Status = EvidenceStatus | WorkflowStatus;

const config: Record<string, { label: string; className: string }> = {
  missing:   { label: "Missing",    className: "pill-missing" },
  pending:   { label: "Pending",    className: "pill-pending" },
  review:    { label: "In Review",  className: "pill-review" },
  in_review: { label: "In Review",  className: "pill-review" },
  approved:  { label: "Approved",   className: "pill-approved" },
  evidenced: { label: "Evidenced",  className: "pill-evidenced" },
  assigned:  { label: "Assigned",   className: "pill-assigned" },
  overdue:   { label: "Overdue",    className: "pill-overdue" },
};

export function StatusPill({ status, className }: { status: Status; className?: string }) {
  const c = config[status] ?? { label: status, className: "pill-pending" };
  return <span className={cn(c.className, className)}>{c.label}</span>;
}
