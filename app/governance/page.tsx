"use client";
import { useState } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { RiskBadge } from "@/components/shared/risk-badge";
import { BoardItemSheet } from "@/components/shared/board-item-sheet";
import { TaskDetailSheet } from "@/components/shared/task-detail-sheet";
import { ApprovalDetailSheet } from "@/components/shared/approval-detail-sheet";
import { AssignOwnerModal } from "@/components/shared/assign-owner-modal";
import { getDeadlineClass } from "@/lib/utils";
import { myTasks, approvalQueue as initialQueue, workflowCounts, boardItems as initialBoardItems } from "@/lib/mock-data";
import type { WorkflowStatus, BoardItem, Task } from "@/types";
import {
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  ThumbsUp,
  ThumbsDown,
  ArrowRight,
} from "lucide-react";

// ── Column config ───────────────────────────────────────────────
type ColKey = "overdue" | "assigned" | "inReview" | "approved" | "evidenced";

const columns: {
  key: ColKey;
  workflowKey: WorkflowStatus;
  label: string;
  countKey: keyof typeof workflowCounts;
  headerCls: string;
  cardBg: string;
  cardBorder: string;
  tagCls: string;
}[] = [
  {
    key: "overdue",
    workflowKey: "overdue",
    label: "Overdue",
    countKey: "overdue",
    headerCls: "text-risk-high",
    cardBg: "bg-[rgba(239,68,68,0.05)]",
    cardBorder: "border-[rgba(239,68,68,0.18)]",
    tagCls: "bg-[rgba(239,68,68,0.12)] text-risk-high",
  },
  {
    key: "assigned",
    workflowKey: "assigned",
    label: "Assigned",
    countKey: "assigned",
    headerCls: "text-secondary-200",
    cardBg: "bg-[rgba(255,255,255,0.03)]",
    cardBorder: "border-[rgba(255,255,255,0.08)]",
    tagCls: "bg-[rgba(255,255,255,0.06)] text-secondary-300",
  },
  {
    key: "inReview",
    workflowKey: "in_review",
    label: "In Review",
    countKey: "inReview",
    headerCls: "text-[#6B9FFF]",
    cardBg: "bg-[rgba(24,84,232,0.06)]",
    cardBorder: "border-[rgba(24,84,232,0.2)]",
    tagCls: "bg-[rgba(24,84,232,0.15)] text-[#6B9FFF]",
  },
  {
    key: "approved",
    workflowKey: "approved",
    label: "Approved",
    countKey: "approved",
    headerCls: "text-secondary",
    cardBg: "bg-[rgba(97,59,254,0.06)]",
    cardBorder: "border-[rgba(97,59,254,0.2)]",
    tagCls: "bg-[rgba(97,59,254,0.15)] text-[#A48DFF]",
  },
  {
    key: "evidenced",
    workflowKey: "evidenced",
    label: "Evidenced",
    countKey: "evidenced",
    headerCls: "text-risk-low",
    cardBg: "bg-[rgba(34,197,94,0.04)]",
    cardBorder: "border-[rgba(34,197,94,0.18)]",
    tagCls: "bg-[rgba(34,197,94,0.12)] text-risk-low",
  },
];

const CARDS_PER_COL = 5;

const dotColor: Record<string, string> = {
  high: "bg-risk-high",
  medium: "bg-risk-medium",
  low: "bg-risk-low",
};

// ── Board card ──────────────────────────────────────────────────
function BoardCard({
  item, cardBg, cardBorder, tagCls, onClick,
}: {
  item: BoardItem; cardBg: string; cardBorder: string; tagCls: string;
  onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className={`p-3 rounded-md border ${cardBg} ${cardBorder} cursor-pointer hover:brightness-110 transition-all duration-150 group`}
    >
      <div className="flex items-start gap-2 mb-2">
        <span className={`mt-[3px] w-1.5 h-1.5 rounded-full flex-shrink-0 ${dotColor[item.risk]}`} />
        <p className="text-[11px] font-medium text-secondary-100 leading-snug line-clamp-2">{item.name}</p>
      </div>
      <p className="text-[10px] text-secondary-300 mb-3 pl-3.5 truncate">{item.domain}</p>
      <div className="flex items-center justify-between pl-3.5">
        <div className="flex items-center gap-1.5">
          <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-semibold flex-shrink-0 ${item.owner.colorClass}`}>
            {item.owner.initials}
          </div>
          <span className={`text-[10px] font-semibold ${getDeadlineClass(item.deadlineStatus)}`}>
            {item.deadline.split(",")[0]}
          </span>
        </div>
        <ArrowRight size={11} className="text-secondary-300 opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
      {item.samaRef && (
        <div className="mt-2 pl-3.5">
          <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-sm ${tagCls}`}>{item.samaRef}</span>
        </div>
      )}
    </div>
  );
}

// ── Page ────────────────────────────────────────────────────────
export default function GovernancePage() {
  const [activeTab, setActiveTab] = useState<"board" | "tasks" | "approvals">("board");

  // Board state
  const [boardItems, setBoardItems] = useState<BoardItem[]>(initialBoardItems);
  const [selectedCard, setSelectedCard] = useState<BoardItem | null>(null);
  const [cardSheetOpen, setCardSheetOpen] = useState(false);

  // Task state
  const [tasks, setTasks] = useState(myTasks);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [taskSheetOpen, setTaskSheetOpen] = useState(false);

  // Approval state
  const [queue, setQueue] = useState<Task[]>(initialQueue);
  const [selectedApproval, setSelectedApproval] = useState<Task | null>(null);
  const [approvalSheetOpen, setApprovalSheetOpen] = useState(false);
  const [approvedIds, setApprovedIds] = useState<Set<string>>(new Set());
  const [rejectedIds, setRejectedIds] = useState<Set<string>>(new Set());

  // Assign modal
  const [assignOpen, setAssignOpen] = useState(false);

  const openCard = (item: BoardItem) => { setSelectedCard(item); setCardSheetOpen(true); };
  const openTask = (task: Task) => { setSelectedTask(task); setTaskSheetOpen(true); };
  const openApproval = (item: Task) => { setSelectedApproval(item); setApprovalSheetOpen(true); };

  const handleBoardStatusChange = (id: string, newStatus: WorkflowStatus) => {
    setBoardItems((prev) => prev.map((b) => b.id === id ? { ...b, workflowStatus: newStatus, deadlineStatus: "ok" } : b));
  };

  const handleTaskComplete = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const handleApprove = (id: string) => {
    setApprovedIds((prev) => new Set([...prev, id]));
    setQueue((prev) => prev.filter((q) => q.id !== id));
    setTimeout(() => setApprovalSheetOpen(false), 800);
  };

  const handleReject = (id: string) => {
    setRejectedIds((prev) => new Set([...prev, id]));
    setQueue((prev) => prev.filter((q) => q.id !== id));
    setTimeout(() => setApprovalSheetOpen(false), 800);
  };

  // Group board items by current workflow status
  const grouped: Record<WorkflowStatus, BoardItem[]> = {
    overdue:   boardItems.filter((b) => b.workflowStatus === "overdue"),
    assigned:  boardItems.filter((b) => b.workflowStatus === "assigned"),
    in_review: boardItems.filter((b) => b.workflowStatus === "in_review"),
    approved:  boardItems.filter((b) => b.workflowStatus === "approved"),
    evidenced: boardItems.filter((b) => b.workflowStatus === "evidenced"),
  };

  return (
    <MainLayout>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-secondary-100">Governance & Workflow</h1>
          <p className="text-xs text-secondary-300 mt-0.5">
            {workflowCounts.total} total controls · {workflowCounts.overdue} overdue ·{" "}
            {workflowCounts.evidenced} evidenced
          </p>
        </div>
        <button
          onClick={() => setAssignOpen(true)}
          className="btn-brand text-xs px-4 py-2"
        >
          + Assign Owner
        </button>
      </div>

      {/* Tab nav */}
      <div className="flex items-center gap-0 border-b border-[rgba(255,255,255,0.06)] mb-6">
        {[
          { key: "board",     label: "Workflow Board",  Icon: ClipboardList },
          { key: "tasks",     label: "My Tasks",        Icon: CheckCircle2 },
          { key: "approvals", label: "Approval Queue",  Icon: ThumbsUp },
        ].map(({ key, label, Icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key as any)}
            className={`flex items-center gap-2 px-5 py-3 text-xs font-medium border-b-2 transition-all ${
              activeTab === key
                ? "border-primary text-secondary-100"
                : "border-transparent text-secondary-300 hover:text-secondary-100"
            }`}
          >
            <Icon size={13} />
            {label}
            {key === "approvals" && queue.length > 0 && (
              <span className="w-4 h-4 rounded-full bg-primary text-[9px] font-semibold text-white flex items-center justify-center">
                {queue.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ── Workflow Board ─────────────────────────────────────── */}
      {activeTab === "board" && (
        <div className="grid grid-cols-5 gap-3">
          {columns.map((col) => {
            const items = grouped[col.workflowKey];
            const visible = items.slice(0, CARDS_PER_COL);
            const remaining = items.length - visible.length;

            return (
              <div key={col.key} className="flex flex-col gap-2">
                <div className="flex items-center justify-between px-3 py-2 rounded-sm bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)]">
                  <span className={`text-[11px] font-semibold ${col.headerCls}`}>{col.label}</span>
                  <span className={`font-metrophobic text-lg leading-none ${col.headerCls}`}>{items.length}</span>
                </div>
                {visible.map((item) => (
                  <BoardCard
                    key={item.id}
                    item={item}
                    cardBg={col.cardBg}
                    cardBorder={col.cardBorder}
                    tagCls={col.tagCls}
                    onClick={() => openCard(item)}
                  />
                ))}
                {remaining > 0 && (
                  <button className="text-[10px] text-secondary-300 hover:text-secondary-100 py-1.5 text-center border border-[rgba(255,255,255,0.06)] rounded-sm hover:border-[rgba(255,255,255,0.12)] transition-all">
                    +{remaining} more
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ── My Tasks ───────────────────────────────────────────── */}
      {activeTab === "tasks" && (
        <div className="audit-card overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-[rgba(255,255,255,0.04)]">
            <p className="text-[11px] font-semibold tracking-[0.08em] uppercase text-secondary-300">Assigned to Me</p>
            <span className="text-[11px] text-secondary-300">{tasks.length} tasks</span>
          </div>
          <div>
            {tasks.length === 0 && (
              <div className="px-5 py-12 text-center">
                <CheckCircle2 size={28} className="text-risk-low mx-auto mb-2" />
                <p className="text-xs text-secondary-300">All tasks completed — great work!</p>
              </div>
            )}
            {tasks.map((task) => (
              <div
                key={task.id}
                onClick={() => openTask(task)}
                className="flex items-center gap-3 px-5 py-4 border-b border-[rgba(255,255,255,0.04)] last:border-0 cursor-pointer hover:bg-[rgba(42,30,92,0.5)] transition-colors"
              >
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${dotColor[task.priority]}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-secondary-100 truncate">{task.title}</p>
                  <p className="text-[10px] text-secondary-300 mt-0.5">{task.meta}</p>
                </div>
                <RiskBadge risk={task.priority as any} />
                <span className={`text-[10px] font-semibold flex-shrink-0 ${getDeadlineClass(task.deadlineStatus)}`}>
                  {task.due}
                </span>
                <button className="w-7 h-7 flex items-center justify-center border border-[rgba(255,255,255,0.08)] rounded-sm text-secondary-300 hover:border-primary hover:text-primary transition-all flex-shrink-0">
                  <ChevronRight size={13} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Approval Queue ─────────────────────────────────────── */}
      {activeTab === "approvals" && (
        <div className="audit-card overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-[rgba(255,255,255,0.04)]">
            <p className="text-[11px] font-semibold tracking-[0.08em] uppercase text-secondary-300">Pending Approvals</p>
            <span className="text-[11px] text-secondary-300">{queue.length} items</span>
          </div>
          <div>
            {queue.map((item) => (
              <ApprovalRow
                key={item.id}
                item={item}
                onApprove={(id) => handleApprove(id)}
                onReject={(id) => handleReject(id)}
                onView={() => openApproval(item)}
              />
            ))}
            {queue.length === 0 && (
              <div className="px-5 py-12 text-center">
                <CheckCircle2 size={28} className="text-risk-low mx-auto mb-2" />
                <p className="text-xs text-secondary-300">All caught up! No pending approvals.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Sheets & Modals ─────────────────────────────────────── */}
      <BoardItemSheet
        item={selectedCard}
        open={cardSheetOpen}
        onOpenChange={setCardSheetOpen}
        onStatusChange={handleBoardStatusChange}
      />
      <TaskDetailSheet
        task={selectedTask}
        open={taskSheetOpen}
        onOpenChange={setTaskSheetOpen}
        onComplete={handleTaskComplete}
      />
      <ApprovalDetailSheet
        item={selectedApproval}
        open={approvalSheetOpen}
        onOpenChange={setApprovalSheetOpen}
        onApprove={handleApprove}
        onReject={handleReject}
      />
      <AssignOwnerModal
        open={assignOpen}
        onOpenChange={setAssignOpen}
      />
    </MainLayout>
  );
}

// ── Approval row component ──────────────────────────────────────
function ApprovalRow({
  item, onApprove, onReject, onView,
}: {
  item: Task;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onView: () => void;
}) {
  const [localState, setLocalState] = useState<"idle" | "approved" | "rejected">("idle");

  const handleApprove = () => {
    setLocalState("approved");
    setTimeout(() => onApprove(item.id), 600);
  };
  const handleReject = () => {
    setLocalState("rejected");
    setTimeout(() => onReject(item.id), 600);
  };

  const dotColor: Record<string, string> = {
    high: "bg-risk-high", medium: "bg-risk-medium", low: "bg-risk-low",
  };

  if (localState === "approved") {
    return (
      <div className="flex items-center gap-4 px-5 py-4 border-b border-[rgba(255,255,255,0.04)] last:border-0 bg-[rgba(34,197,94,0.04)]">
        <CheckCircle2 size={16} className="text-risk-low flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-risk-low truncate">{item.title}</p>
          <p className="text-[10px] text-secondary-300 mt-0.5">Approved · Control advancing to Evidenced</p>
        </div>
      </div>
    );
  }

  if (localState === "rejected") {
    return (
      <div className="flex items-center gap-4 px-5 py-4 border-b border-[rgba(255,255,255,0.04)] last:border-0 bg-[rgba(239,68,68,0.04)]">
        <CheckCircle2 size={16} className="text-risk-high flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-risk-high truncate">{item.title}</p>
          <p className="text-[10px] text-secondary-300 mt-0.5">Rejected · Owner has been notified</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4 px-5 py-4 border-b border-[rgba(255,255,255,0.04)] last:border-0">
      <div className={`w-2 h-2 rounded-full flex-shrink-0 ${dotColor[item.priority]}`} />
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-secondary-100 truncate">{item.title}</p>
        <p className="text-[10px] text-secondary-300 mt-0.5">{item.meta}</p>
      </div>
      <RiskBadge risk={item.priority} />
      <div className="flex items-center gap-1.5 flex-shrink-0">
        <button
          onClick={handleApprove}
          className="flex items-center gap-1 text-[11px] font-medium text-risk-low border border-[rgba(34,197,94,0.25)] bg-[rgba(34,197,94,0.08)] hover:bg-[rgba(34,197,94,0.15)] px-3 py-1.5 rounded-sm transition-all"
        >
          <ThumbsUp size={11} /> Approve
        </button>
        <button
          onClick={handleReject}
          className="flex items-center gap-1 text-[11px] font-medium text-risk-high border border-[rgba(239,68,68,0.25)] bg-[rgba(239,68,68,0.06)] hover:bg-[rgba(239,68,68,0.12)] px-3 py-1.5 rounded-sm transition-all"
        >
          <ThumbsDown size={11} /> Reject
        </button>
        <button
          onClick={onView}
          className="flex items-center gap-1 border border-[rgba(255,255,255,0.08)] hover:border-primary hover:text-primary text-secondary-300 text-[10px] font-medium px-2.5 py-1.5 rounded-sm transition-all"
        >
          View <ChevronRight size={11} />
        </button>
      </div>
    </div>
  );
}
