"use client";
import { MainLayout } from "@/components/layout/main-layout";
import { SamaNotification } from "@/components/shared/sama-notification";
import { ReadinessGauge } from "@/components/dashboard/readiness-gauge";
import { KpiCards } from "@/components/dashboard/kpi-cards";
import { RiskBars } from "@/components/dashboard/risk-bars";
import { WorkflowStatus } from "@/components/dashboard/workflow-status";
import { MyTasks } from "@/components/dashboard/my-tasks";
import { PriorityGapsTable } from "@/components/dashboard/priority-gaps-table";
import { SamaFeedPreview } from "@/components/dashboard/sama-feed-preview";
import { MicrosoftBar } from "@/components/dashboard/microsoft-bar";
import { DashboardEnter } from "@/components/dashboard/dashboard-enter";
import { kpiData, workflowCounts, myTasks } from "@/lib/mock-data";
import { DashboardTooltip } from "@/components/shared/dashboard-tooltip";

export default function DashboardPage() {
  return (
    <MainLayout>
      <SamaNotification />

      {/* Page Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-secondary-100">
            IT Governance Dashboard
          </h1>
          <p className="text-xs text-secondary-300 mt-0.5">
            {kpiData.reviewQuarter} Audit Cycle · {kpiData.daysToReview} days to next review
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn-outline-brand text-xs px-4 py-2">
            Export Report
          </button>
          <button className="btn-brand text-xs px-4 py-2">
            + New Evidence
          </button>
        </div>
      </div>

      {/* Microsoft Ecosystem Bar */}
      <DashboardEnter className="mb-6">
        <MicrosoftBar />
      </DashboardEnter>

      {/* Top Row: Gauge + KPI Cards (equal column height) */}
      <div className="grid grid-cols-12 gap-5 mb-5 items-stretch">
        {/* Readiness Gauge */}
        <div className="col-span-3 flex min-h-0">
          <DashboardEnter delayMs={50} className="flex w-full min-h-0 flex-1 flex-col justify-center">
            <DashboardTooltip description="A visual representation of your SAMA audit readiness across all active controls, scored from 0 to 1000." position="bottom">
              <ReadinessGauge score={kpiData.readinessScore} delta={kpiData.readinessDelta} />
            </DashboardTooltip>
          </DashboardEnter>
        </div>

        {/* KPI Cards */}
        <div className="col-span-9 flex min-h-0">
          <KpiCards data={kpiData} />
        </div>
      </div>

      {/* Second Row: Risk Bars + Workflow Status + My Tasks (equal column height) */}
      <div className="grid grid-cols-12 gap-5 mb-5 items-stretch">
        <div className="col-span-3 flex min-h-0">
          <DashboardEnter delayMs={320} className="flex h-full min-h-0 min-w-0 w-full flex-1 flex-col">
            <DashboardTooltip
              className="flex h-full min-h-0 flex-col"
              description="Distribution of open control gaps by severity — High, Medium, and Low risk — helping you prioritise remediation efforts."
              position="top"
            >
              <RiskBars
                high={kpiData.highGaps}
                medium={21}
                low={34}
                total={kpiData.openGaps}
              />
            </DashboardTooltip>
          </DashboardEnter>
        </div>
        <div className="col-span-4 flex min-h-0">
          <DashboardEnter delayMs={380} className="flex h-full min-h-0 min-w-0 w-full flex-1 flex-col">
            <DashboardTooltip
              className="flex h-full min-h-0 flex-col"
              description="Real-time progress of your controls through the evidence pipeline: from Assigned through In Review, Approved, and fully Evidenced."
              position="top"
            >
              <WorkflowStatus counts={workflowCounts} />
            </DashboardTooltip>
          </DashboardEnter>
        </div>
        <div className="col-span-5 flex min-h-0">
          <DashboardEnter delayMs={440} className="flex h-full min-h-0 min-w-0 w-full flex-1 flex-col">
            <DashboardTooltip
              className="flex h-full min-h-0 flex-col"
              description="Tasks assigned specifically to you that require action before the next SAMA review cycle. Completing these improves your readiness score."
              position="top"
            >
              <MyTasks tasks={myTasks} />
            </DashboardTooltip>
          </DashboardEnter>
        </div>
      </div>

      {/* Priority Gaps Table */}
      <div className="mb-5">
        <DashboardTooltip description="High-priority control gaps ranked by risk level and days remaining. Each row links directly to the relevant control for immediate action." position="top">
          <PriorityGapsTable enterDelayMs={500} />
        </DashboardTooltip>
      </div>

      {/* SAMA Feed Preview */}
      <DashboardTooltip description="A live preview of the latest SAMA regulatory updates. New circulars and directives appear here first — click to review and map them to controls." position="top">
        <SamaFeedPreview />
      </DashboardTooltip>
    </MainLayout>
  );
}
