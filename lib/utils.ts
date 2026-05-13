import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { RiskLevel, EvidenceStatus, WorkflowStatus, SamaStatus } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getRiskBadgeClass(risk: RiskLevel): string {
  return {
    high: "badge-high",
    medium: "badge-medium",
    low: "badge-low",
  }[risk];
}

export function getRiskLabel(risk: RiskLevel): string {
  return { high: "▲ High", medium: "◆ Med", low: "● Low" }[risk];
}

export function getStatusPillClass(status: EvidenceStatus | WorkflowStatus): string {
  const map: Record<string, string> = {
    missing: "pill-missing",
    pending: "pill-pending",
    review: "pill-review",
    in_review: "pill-review",
    approved: "pill-approved",
    evidenced: "pill-evidenced",
    assigned: "pill-assigned",
    overdue: "pill-overdue",
  };
  return map[status] ?? "pill-pending";
}

export function getStatusLabel(status: EvidenceStatus | WorkflowStatus): string {
  const map: Record<string, string> = {
    missing: "Missing",
    pending: "Pending",
    review: "In Review",
    in_review: "In Review",
    approved: "Approved",
    evidenced: "Evidenced",
    assigned: "Assigned",
    overdue: "Overdue",
  };
  return map[status] ?? status;
}

export function getSamaStatusClass(status: SamaStatus): string {
  return {
    detected: "bg-[rgba(239,68,68,0.12)] text-risk-high border border-[rgba(239,68,68,0.25)]",
    mapped: "bg-[rgba(249,169,49,0.12)] text-risk-medium border border-[rgba(249,169,49,0.2)]",
    assigned: "bg-[rgba(34,197,94,0.1)] text-risk-low border border-[rgba(34,197,94,0.25)]",
  }[status];
}

export function getSamaStatusLabel(status: SamaStatus): string {
  return { detected: "Detected", mapped: "Mapped", assigned: "Assigned" }[status];
}

export function getDeadlineClass(status: "overdue" | "soon" | "ok"): string {
  return {
    overdue: "text-risk-high",
    soon: "text-risk-medium",
    ok: "text-secondary-300",
  }[status];
}
