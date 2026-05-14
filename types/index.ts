export type RiskLevel = "high" | "medium" | "low";
export type EvidenceStatus = "missing" | "pending" | "review" | "approved";
export type WorkflowStatus =
  | "assigned"
  | "in_review"
  | "approved"
  | "evidenced"
  | "overdue";
export type SamaStatus = "detected" | "mapped" | "assigned";

export interface Owner {
  initials: string;
  name: string;
  colorClass: string; // tailwind bg class
}

export interface Control {
  id: string;
  name: string;
  domain: string;
  risk: RiskLevel;
  evidenceStatus: EvidenceStatus;
  workflowStatus: WorkflowStatus;
  owner: Owner;
  deadline: string;
  deadlineStatus: "overdue" | "soon" | "ok";
  description: string;
  samaRef?: string;
}

export interface EvidenceItem {
  id: string;
  fileName: string;
  controlId: string;
  controlName: string;
  stage: EvidenceStatus;
  submittedBy: Owner;
  date: string;
  fileSize: string;
  fileType: string;
}

export interface SamaUpdate {
  id: string;
  title: string;
  description: string;
  date: string;
  type: string;
  status: SamaStatus;
  impactedControls: number;
  isNew?: boolean;
}

export interface Task {
  id: string;
  title: string;
  meta: string;
  priority: RiskLevel;
  due: string;
  deadlineStatus: "overdue" | "soon" | "ok";
}

export interface KpiData {
  readinessScore: number;
  readinessDelta: number;
  openGaps: number;
  highGaps: number;
  pendingEvidence: number;
  overdueEvidence: number;
  daysToReview: number;
  reviewQuarter: string;
}

export interface WorkflowCounts {
  assigned: number;
  inReview: number;
  approved: number;
  evidenced: number;
  overdue: number;
  total: number;
}

export type NotificationType =
  | "sama"
  | "evidence"
  | "approval"
  | "task"
  | "system";

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  description: string;
  timestamp: string;
  timeAgo: string;
  read: boolean;
  priority: "high" | "medium" | "low";
  actionLabel?: string;
  actionHref?: string;
  meta?: string;
}

export interface BoardItemDocument {
  name: string;
  type: string;
  size: string;
  date: string;
  status: "approved" | "pending" | "review" | "missing";
  uploadedBy: string;
}

export interface BoardItem {
  id: string;
  name: string;
  domain: string;
  risk: RiskLevel;
  owner: Owner;
  deadline: string;
  deadlineStatus: "overdue" | "soon" | "ok";
  workflowStatus: WorkflowStatus;
  samaRef?: string;
  description?: string;
  requirements?: string[];
  documents?: BoardItemDocument[];
}
