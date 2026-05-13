"use client";
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
import { StatusPill } from "@/components/shared/status-pill";
import { getDeadlineClass } from "@/lib/utils";
import type { Control } from "@/types";
import { Upload, Clock, AlertTriangle, CheckCircle, FileText } from "lucide-react";

interface GapDetailSheetProps {
  control: Control | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const timelineItems = [
  {
    action: "Evidence request sent to owner",
    meta: "May 9, 2026 · Zakie Zabar",
    color: "border-primary bg-[rgba(216,36,42,0.1)]",
    icon: <AlertTriangle size={8} className="text-primary" />,
  },
  {
    action: "Draft document uploaded",
    meta: "May 8, 2026 · Team member",
    color: "border-risk-medium",
    icon: <Upload size={8} className="text-risk-medium" />,
  },
  {
    action: "Gap flagged — deadline passed",
    meta: "Apr 1, 2026 · Automated · SAMA trigger",
    color: "border-risk-high",
    icon: <AlertTriangle size={8} className="text-risk-high" />,
  },
  {
    action: "Control assigned to owner team",
    meta: "Mar 14, 2026 · Zakie Zabar",
    color: "border-[rgba(255,255,255,0.15)]",
    icon: <CheckCircle size={8} className="text-secondary-300" />,
  },
];

export function GapDetailSheet({ control, open, onOpenChange }: GapDetailSheetProps) {
  if (!control) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="flex flex-col overflow-hidden p-0 w-[480px]">
        {/* Header */}
        <SheetHeader className="px-6 py-5">
          <div className="mb-2">
            <RiskBadge risk={control.risk} />
          </div>
          <SheetTitle>{control.name}</SheetTitle>
          <SheetDescription>{control.domain}</SheetDescription>
        </SheetHeader>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-5">

          {/* Status row */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Evidence", value: <StatusPill status={control.evidenceStatus} /> },
              { label: "Workflow",  value: <StatusPill status={control.workflowStatus} /> },
              {
                label: "Deadline",
                value: (
                  <span className={`text-xs font-semibold ${getDeadlineClass(control.deadlineStatus)}`}>
                    {control.deadline}
                  </span>
                ),
              },
            ].map(({ label, value }) => (
              <div
                key={label}
                className="bg-[rgba(42,30,92,0.4)] border border-[rgba(255,255,255,0.06)] rounded-sm p-3"
              >
                <p className="text-[10px] font-semibold tracking-[0.1em] uppercase text-secondary-300 mb-1.5">
                  {label}
                </p>
                {value}
              </div>
            ))}
          </div>

          {/* Description */}
          <div>
            <p className="text-[10px] font-semibold tracking-[0.12em] uppercase text-secondary-300 mb-2">
              Description
            </p>
            <p className="text-[13px] text-secondary-200 font-light leading-relaxed">
              {control.description}
            </p>
            {control.samaRef && (
              <p className="mt-2 text-[10px] text-secondary-300">
                SAMA Reference:{" "}
                <span className="text-[#A48DFF] font-medium">{control.samaRef}</span>
              </p>
            )}
          </div>

          {/* Owner */}
          <div>
            <p className="text-[10px] font-semibold tracking-[0.12em] uppercase text-secondary-300 mb-2">
              Assigned Owner
            </p>
            <div className="flex items-center gap-3 bg-[rgba(42,30,92,0.4)] border border-[rgba(255,255,255,0.06)] rounded-sm p-3">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0 ${control.owner.colorClass}`}
              >
                {control.owner.initials}
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-secondary-100">{control.owner.name}</div>
                <div className="text-[10px] text-secondary-300">Primary owner · 3 members</div>
              </div>
              <Button variant="outline" size="sm">
                Request Evidence
              </Button>
            </div>
          </div>

          {/* Evidence items */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-[10px] font-semibold tracking-[0.12em] uppercase text-secondary-300">
                Evidence Items
              </p>
              <Button variant="outline" size="sm" className="gap-1">
                <Upload size={10} />
                Upload
              </Button>
            </div>

            {/* Placeholder submitted file */}
            <div className="flex items-center gap-3 bg-[rgba(42,30,92,0.3)] border border-[rgba(255,255,255,0.06)] rounded-sm p-2.5 mb-2">
              <div className="w-7 h-7 bg-[rgba(255,255,255,0.04)] rounded-sm flex items-center justify-center flex-shrink-0">
                <FileText size={12} className="text-secondary-300" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-medium text-secondary-100 truncate">
                  Draft_Evidence_v1.pdf
                </div>
                <div className="text-[10px] text-secondary-300">Uploaded May 8 · 1.2 MB · Pending review</div>
              </div>
              <span className="pill-pending">Pending</span>
            </div>

            {/* Missing slot */}
            <div className="border border-dashed border-[rgba(255,255,255,0.08)] rounded-sm p-4 text-center">
              <p className="text-xs text-secondary-300 mb-2">Final review report missing</p>
              <Button variant="outline" size="sm">Request from owner →</Button>
            </div>
          </div>

          {/* Timeline */}
          <div>
            <p className="text-[10px] font-semibold tracking-[0.12em] uppercase text-secondary-300 mb-3">
              Activity
            </p>
            <div className="flex flex-col gap-0">
              {timelineItems.map((item, i) => (
                <div key={i} className="flex gap-3 pb-4 relative">
                  {i < timelineItems.length - 1 && (
                    <div className="absolute left-[6px] top-[18px] bottom-0 w-px bg-[rgba(255,255,255,0.06)]" />
                  )}
                  <div
                    className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${item.color} bg-[#181227]`}
                  >
                    {item.icon}
                  </div>
                  <div>
                    <p className="text-xs font-medium text-secondary-100">{item.action}</p>
                    <p className="text-[10px] text-secondary-300 mt-0.5">{item.meta}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <SheetFooter>
          <Button className="flex-1">Validate &amp; Approve</Button>
          <Button variant="outline">Reject</Button>
          <Button variant="outline">
            Export
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
