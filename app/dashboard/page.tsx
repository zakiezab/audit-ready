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
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-lg font-semibold text-secondary-100 sm:text-xl">
            IT Governance Dashboard
          </h1>
          <p className="mt-0.5 text-xs text-secondary-300">
            {kpiData.reviewQuarter} Audit Cycle · {kpiData.daysToReview} days to next review
          </p>
        </div>
        <div className="flex flex-shrink-0 flex-wrap items-center gap-2">
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
      <div className="mb-5 grid grid-cols-1 items-stretch gap-5 lg:grid-cols-12">
        {/* Readiness Gauge */}
        <div className="flex min-h-[220px] lg:col-span-3 lg:min-h-0">
          <DashboardEnter delayMs={50} className="flex w-full min-h-0 flex-1 flex-col justify-center">
            <DashboardTooltip description="A visual representation of your SAMA audit readiness across all active controls, scored from 0 to 1000." position="bottom">
              <ReadinessGauge score={kpiData.readinessScore} delta={kpiData.readinessDelta} />
            </DashboardTooltip>
          </DashboardEnter>
        </div>

        {/* KPI Cards */}
        <div className="flex min-h-0 lg:col-span-9">
          <KpiCards data={kpiData} />
        </div>
      </div>

      {/* Second Row: Risk Bars + Workflow Status + My Tasks (equal column height) */}
      <div className="mb-5 grid grid-cols-1 items-stretch gap-5 md:grid-cols-2 lg:grid-cols-12">
        <div className="flex min-h-0 lg:col-span-3">
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
        <div className="flex min-h-0 lg:col-span-4">
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
        <div className="flex min-h-0 md:col-span-2 lg:col-span-5">
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
