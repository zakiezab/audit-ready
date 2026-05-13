"use client";
import { useState } from "react";
import Link from "next/link";
import { MainLayout } from "@/components/layout/main-layout";
import { notifications as allNotifications } from "@/lib/mock-data";
import type { Notification, NotificationType } from "@/types";
import {
  Bell,
  Satellite,
  FileText,
  ThumbsUp,
  CheckSquare,
  Settings2,
  CheckCheck,
  Trash2,
  ChevronRight,
  AlertTriangle,
  TrendingUp,
} from "lucide-react";

// ── Type config ────────────────────────────────────────────────
const typeConfig: Record<
  NotificationType,
  { label: string; Icon: React.ElementType; iconBg: string; iconColor: string }
> = {
  sama: {
    label: "SAMA Regulation",
    Icon: Satellite,
    iconBg: "bg-[rgba(239,68,68,0.12)]",
    iconColor: "text-risk-high",
  },
  evidence: {
    label: "Evidence",
    Icon: FileText,
    iconBg: "bg-[rgba(249,169,49,0.12)]",
    iconColor: "text-risk-medium",
  },
  approval: {
    label: "Approval",
    Icon: ThumbsUp,
    iconBg: "bg-[rgba(97,59,254,0.15)]",
    iconColor: "text-[#A48DFF]",
  },
  task: {
    label: "Task",
    Icon: CheckSquare,
    iconBg: "bg-[rgba(107,159,255,0.12)]",
    iconColor: "text-[#6B9FFF]",
  },
  system: {
    label: "System",
    Icon: TrendingUp,
    iconBg: "bg-[rgba(34,197,94,0.1)]",
    iconColor: "text-risk-low",
  },
};

const priorityDot: Record<string, string> = {
  high: "bg-risk-high",
  medium: "bg-risk-medium",
  low: "bg-[rgba(255,255,255,0.2)]",
};

type FilterKey = "all" | NotificationType;

const filterOptions: { key: FilterKey; label: string }[] = [
  { key: "all", label: "All" },
  { key: "sama", label: "SAMA" },
  { key: "evidence", label: "Evidence" },
  { key: "approval", label: "Approvals" },
  { key: "task", label: "Tasks" },
  { key: "system", label: "System" },
];

// ── Notification card ──────────────────────────────────────────
function NotifCard({
  notif,
  onMarkRead,
  onDismiss,
}: {
  notif: Notification;
  onMarkRead: (id: string) => void;
  onDismiss: (id: string) => void;
}) {
  const cfg = typeConfig[notif.type];

  return (
    <div
      className={`relative flex gap-4 px-5 py-4 border-b border-[rgba(255,255,255,0.04)] last:border-0 transition-colors duration-150 group ${
        !notif.read ? "bg-[rgba(97,59,254,0.04)]" : "hover:bg-[rgba(255,255,255,0.02)]"
      }`}
    >
      {/* Unread indicator stripe */}
      {!notif.read && (
        <span className="absolute left-0 top-0 bottom-0 w-[3px] bg-secondary rounded-r-full" />
      )}

      {/* Icon */}
      <div
        className={`w-9 h-9 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5 ${cfg.iconBg}`}
      >
        <cfg.Icon size={16} className={cfg.iconColor} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            {/* Priority dot — only for unread high/medium */}
            {!notif.read && notif.priority !== "low" && (
              <span
                className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${priorityDot[notif.priority]}`}
              />
            )}
            <p
              className={`text-xs font-semibold leading-snug ${
                notif.read ? "text-secondary-200" : "text-secondary-100"
              }`}
            >
              {notif.title}
            </p>
            <span
              className={`text-[9px] font-semibold tracking-[0.08em] uppercase px-1.5 py-0.5 rounded-sm ${cfg.iconBg} ${cfg.iconColor}`}
            >
              {cfg.label}
            </span>
          </div>

          {/* Timestamp + actions */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="text-[10px] text-secondary-300 whitespace-nowrap">
              {notif.timeAgo}
            </span>
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              {!notif.read && (
                <button
                  onClick={() => onMarkRead(notif.id)}
                  title="Mark as read"
                  className="w-6 h-6 flex items-center justify-center rounded-sm text-secondary-300 hover:text-secondary hover:bg-[rgba(97,59,254,0.12)] transition-all"
                >
                  <CheckCheck size={12} />
                </button>
              )}
              <button
                onClick={() => onDismiss(notif.id)}
                title="Dismiss"
                className="w-6 h-6 flex items-center justify-center rounded-sm text-secondary-300 hover:text-risk-high hover:bg-[rgba(239,68,68,0.08)] transition-all"
              >
                <Trash2 size={12} />
              </button>
            </div>
          </div>
        </div>

        <p className="text-[11px] text-secondary-300 leading-relaxed mt-1 mb-2.5 pr-4">
          {notif.description}
        </p>

        <div className="flex items-center justify-between">
          {/* Meta tag */}
          {notif.meta && (
            <span className="text-[10px] text-secondary-300 font-medium">
              {notif.meta}
            </span>
          )}

          {/* CTA */}
          {notif.actionLabel && notif.actionHref && (
            <Link
              href={notif.actionHref}
              onClick={() => onMarkRead(notif.id)}
              className="ml-auto flex items-center gap-1 text-[11px] font-semibold text-secondary hover:text-[#A48DFF] transition-colors"
            >
              {notif.actionLabel}
              <ChevronRight size={11} />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Page ────────────────────────────────────────────────────────
export default function NotificationsPage() {
  const [items, setItems] = useState<Notification[]>(allNotifications);
  const [filter, setFilter] = useState<FilterKey>("all");
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);

  const unreadCount = items.filter((n) => !n.read).length;

  const filtered = items.filter((n) => {
    const matchType = filter === "all" || n.type === filter;
    const matchRead = !showUnreadOnly || !n.read;
    return matchType && matchRead;
  });

  const markRead = (id: string) =>
    setItems((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );

  const dismiss = (id: string) =>
    setItems((prev) => prev.filter((n) => n.id !== id));

  const markAllRead = () =>
    setItems((prev) => prev.map((n) => ({ ...n, read: true })));

  const clearAll = () =>
    setItems((prev) => prev.filter((n) => !n.read));

  // Group by date label
  const groups: { label: string; items: Notification[] }[] = [];
  const today: Notification[] = [];
  const yesterday: Notification[] = [];
  const older: Notification[] = [];

  filtered.forEach((n) => {
    const date = new Date(n.timestamp);
    const now = new Date("2026-05-13");
    const diff = Math.floor((now.getTime() - date.getTime()) / 86400000);
    if (diff === 0) today.push(n);
    else if (diff === 1) yesterday.push(n);
    else older.push(n);
  });

  if (today.length) groups.push({ label: "Today", items: today });
  if (yesterday.length) groups.push({ label: "Yesterday", items: yesterday });
  if (older.length) groups.push({ label: "Earlier", items: older });

  return (
    <MainLayout>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-semibold text-secondary-100">Notifications</h1>
          {unreadCount > 0 && (
            <span className="flex items-center gap-1.5 text-[11px] font-semibold text-secondary bg-[rgba(97,59,254,0.15)] border border-[rgba(97,59,254,0.3)] px-2.5 py-1 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
              {unreadCount} unread
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              className="flex items-center gap-1.5 btn-outline-brand text-xs px-3 py-2"
            >
              <CheckCheck size={13} /> Mark all read
            </button>
          )}
          <button
            onClick={clearAll}
            className="flex items-center gap-1.5 text-xs text-secondary-300 border border-[rgba(255,255,255,0.08)] hover:border-[rgba(255,255,255,0.15)] hover:text-secondary-100 px-3 py-2 rounded-sm transition-all"
          >
            <Trash2 size={13} /> Clear read
          </button>
          <button className="flex items-center gap-1.5 text-xs text-secondary-300 border border-[rgba(255,255,255,0.08)] hover:border-[rgba(255,255,255,0.15)] hover:text-secondary-100 px-3 py-2 rounded-sm transition-all">
            <Settings2 size={13} /> Preferences
          </button>
        </div>
      </div>

      {/* Summary tiles */}
      <div className="grid grid-cols-5 gap-3 mb-5">
        {(["sama", "evidence", "approval", "task", "system"] as NotificationType[]).map(
          (type) => {
            const cfg = typeConfig[type];
            const count = items.filter((n) => n.type === type && !n.read).length;
            const total = items.filter((n) => n.type === type).length;
            return (
              <button
                key={type}
                onClick={() => setFilter(filter === type ? "all" : type)}
                className={`audit-card p-4 text-left transition-all hover:brightness-110 ${
                  filter === type
                    ? "ring-1 ring-[rgba(97,59,254,0.4)] bg-[rgba(97,59,254,0.06)]"
                    : ""
                }`}
              >
                <div className={`w-7 h-7 rounded-md flex items-center justify-center mb-3 ${cfg.iconBg}`}>
                  <cfg.Icon size={14} className={cfg.iconColor} />
                </div>
                <p className="text-[10px] font-semibold text-secondary-300 uppercase tracking-[0.08em] mb-0.5">
                  {cfg.label}
                </p>
                <div className="flex items-baseline gap-1.5">
                  <span className={`font-metrophobic text-xl leading-none ${count > 0 ? cfg.iconColor : "text-secondary-300"}`}>
                    {count}
                  </span>
                  <span className="text-[10px] text-secondary-300">/ {total}</span>
                </div>
              </button>
            );
          }
        )}
      </div>

      {/* Filter bar */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-1.5">
          {filterOptions.map((opt) => (
            <button
              key={opt.key}
              onClick={() => setFilter(opt.key)}
              className={`px-3 py-1.5 rounded-full text-[11px] font-medium border transition-all ${
                filter === opt.key
                  ? "bg-[rgba(97,59,254,0.15)] border-[rgba(97,59,254,0.35)] text-[#A48DFF]"
                  : "border-[rgba(255,255,255,0.08)] text-secondary-300 hover:border-[rgba(255,255,255,0.15)] hover:text-secondary-100"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <button
          onClick={() => setShowUnreadOnly(!showUnreadOnly)}
          className={`flex items-center gap-2 text-[11px] font-medium px-3 py-1.5 rounded-full border transition-all ${
            showUnreadOnly
              ? "bg-[rgba(97,59,254,0.15)] border-[rgba(97,59,254,0.35)] text-[#A48DFF]"
              : "border-[rgba(255,255,255,0.08)] text-secondary-300 hover:border-[rgba(255,255,255,0.15)]"
          }`}
        >
          <Bell size={11} />
          Unread only
        </button>
      </div>

      {/* Notification groups */}
      {groups.length === 0 ? (
        <div className="audit-card py-20 flex flex-col items-center justify-center text-center">
          <div className="w-12 h-12 rounded-full bg-[rgba(255,255,255,0.04)] flex items-center justify-center mb-4">
            <Bell size={20} className="text-secondary-300" />
          </div>
          <p className="text-sm font-medium text-secondary-200 mb-1">You're all caught up</p>
          <p className="text-xs text-secondary-300">
            {showUnreadOnly ? "No unread notifications." : "No notifications match the selected filter."}
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {groups.map((group) => (
            <div key={group.label}>
              {/* Group label */}
              <div className="flex items-center gap-3 mb-2">
                <p className="text-[10px] font-semibold tracking-[0.12em] uppercase text-secondary-300">
                  {group.label}
                </p>
                <div className="flex-1 h-px bg-[rgba(255,255,255,0.04)]" />
                <span className="text-[10px] text-secondary-300">
                  {group.items.filter((n) => !n.read).length > 0
                    ? `${group.items.filter((n) => !n.read).length} unread`
                    : `${group.items.length} read`}
                </span>
              </div>

              {/* Cards */}
              <div className="audit-card overflow-hidden">
                {group.items.map((notif) => (
                  <NotifCard
                    key={notif.id}
                    notif={notif}
                    onMarkRead={markRead}
                    onDismiss={dismiss}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* SAMA alert banner — shown only when there are unread SAMA notifications */}
      {items.some((n) => n.type === "sama" && !n.read) && (
        <div className="mt-5 flex items-start gap-3 px-5 py-4 rounded-md bg-[rgba(239,68,68,0.06)] border border-[rgba(239,68,68,0.2)]">
          <AlertTriangle size={16} className="text-risk-high flex-shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-risk-high mb-0.5">
              Regulatory Action Required
            </p>
            <p className="text-[11px] text-secondary-300 leading-relaxed">
              You have {items.filter((n) => n.type === "sama" && !n.read).length} unread SAMA
              regulatory updates that may impact your control register. Review and map them before
              your next audit cycle.
            </p>
          </div>
          <Link
            href="/regulations"
            className="flex-shrink-0 btn-brand text-[11px] px-3 py-1.5"
          >
            Go to Regulations
          </Link>
        </div>
      )}
    </MainLayout>
  );
}
