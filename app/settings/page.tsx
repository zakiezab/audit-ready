"use client";
import { useState } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import {
  Settings,
  Building2,
  Link2,
  CalendarDays,
  Users,
  CheckCircle2,
  ChevronRight,
  ToggleLeft,
  ToggleRight,
  Shield,
  Globe,
  Mail,
  Clock,
  AlertTriangle,
} from "lucide-react";

const sectionTabs = [
  { key: "general",      label: "General",          icon: Settings },
  { key: "integrations", label: "Integrations",      icon: Link2 },
  { key: "audit",        label: "Audit Cycle",       icon: CalendarDays },
  { key: "users",        label: "User Management",   icon: Users },
];

const userRows = [
  { name: "Zakie Zabar",    email: "zakiezabar@gmail.com",       role: "IT Governance Lead", status: "Active",   initials: "ZZ", colorClass: "bg-secondary/20 text-secondary" },
  { name: "Rayan Al-Dosari", email: "rayan.dosari@bank.sa",      role: "Compliance Officer",  status: "Active",   initials: "RA", colorClass: "bg-[rgba(34,197,94,0.15)] text-risk-low" },
  { name: "Sara Al-Ghamdi",  email: "sara.alghamdi@bank.sa",     role: "Evidence Reviewer",   status: "Active",   initials: "SG", colorClass: "bg-[rgba(97,59,254,0.15)] text-[#A48DFF]" },
  { name: "Faisal Al-Otibi", email: "faisal.alotibi@bank.sa",   role: "Audit Analyst",       status: "Pending",  initials: "FA", colorClass: "bg-[rgba(255,180,0,0.15)] text-risk-medium" },
  { name: "Nora Hassan",     email: "nora.hassan@bank.sa",       role: "Viewer",              status: "Inactive", initials: "NH", colorClass: "bg-[rgba(255,255,255,0.06)] text-secondary-300" },
];

const auditCycles = [
  { label: "Q1 2025 — SAMA Compliance Review",    range: "Jan 1 – Mar 31, 2025",  status: "Completed" },
  { label: "Q2 2025 — Evidence Collection",        range: "Apr 1 – Jun 30, 2025",  status: "Completed" },
  { label: "Q3 2025 — Controls Assessment",        range: "Jul 1 – Sep 30, 2025",  status: "Completed" },
  { label: "Q4 2025 — Year-End Governance Review", range: "Oct 1 – Dec 31, 2025",  status: "Active" },
  { label: "Q1 2026 — Annual Readiness Audit",     range: "Jan 1 – Mar 31, 2026",  status: "Upcoming" },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("general");
  const [saved, setSaved] = useState(false);

  const [orgName, setOrgName]           = useState("Saudi National Bank — IT Division");
  const [samaId, setSamaId]             = useState("SNB-SAMA-2024-007");
  const [timezone, setTimezone]         = useState("Asia/Riyadh (UTC+3)");
  const [language, setLanguage]         = useState("English");
  const [autoSync, setAutoSync]         = useState(true);
  const [auditAlerts, setAuditAlerts]   = useState(true);
  const [twoFactor, setTwoFactor]       = useState(false);
  const [dataRetention, setDataRetention] = useState("2 Years");

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const Toggle = ({ on, onToggle }: { on: boolean; onToggle: () => void }) => (
    <button
      onClick={onToggle}
      className={`relative w-9 h-5 rounded-full transition-all duration-200 flex-shrink-0 ${on ? "bg-secondary" : "bg-[rgba(255,255,255,0.1)]"}`}
    >
      <span
        className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all duration-200 ${on ? "left-[18px]" : "left-0.5"}`}
      />
    </button>
  );

  return (
    <MainLayout>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-secondary-100">Settings</h1>
          <p className="text-xs text-secondary-300 mt-0.5">
            Configure platform behaviour, integrations, and team access
          </p>
        </div>
        <button
          onClick={handleSave}
          className={`flex items-center gap-2 text-xs px-4 py-2 rounded-sm font-medium transition-all ${
            saved
              ? "bg-[rgba(34,197,94,0.15)] border border-[rgba(34,197,94,0.3)] text-risk-low"
              : "btn-brand"
          }`}
        >
          {saved ? (
            <><CheckCircle2 size={13} /> Saved</>
          ) : (
            "Save Changes"
          )}
        </button>
      </div>

      <div className="grid grid-cols-12 gap-5">
        {/* Tab sidebar */}
        <div className="col-span-3 flex flex-col gap-1">
          {sectionTabs.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-sm text-xs font-medium transition-all text-left ${
                  active
                    ? "bg-[rgba(97,59,254,0.12)] border border-[rgba(97,59,254,0.25)] text-secondary-100"
                    : "text-secondary-300 hover:text-secondary-100 hover:bg-[rgba(255,255,255,0.04)]"
                }`}
              >
                <Icon size={14} className={active ? "text-secondary" : "opacity-60"} />
                {tab.label}
                {active && <ChevronRight size={12} className="ml-auto text-secondary opacity-70" />}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="col-span-9 flex flex-col gap-5">

          {/* ── GENERAL ── */}
          {activeTab === "general" && (
            <>
              {/* Organisation */}
              <div className="audit-card overflow-hidden">
                <div className="px-5 py-4 border-b border-[rgba(255,255,255,0.04)] flex items-center gap-2">
                  <Building2 size={13} className="text-secondary-300" />
                  <p className="text-[11px] font-semibold tracking-[0.08em] uppercase text-secondary-300">
                    Organisation
                  </p>
                </div>
                <div className="p-5 grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-semibold text-secondary-300 mb-1.5">Organisation Name</label>
                    <div className="flex items-center gap-2 bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)] rounded-sm px-3 py-2.5 focus-within:border-secondary transition-all">
                      <Building2 size={13} className="text-secondary-300 flex-shrink-0" />
                      <input
                        value={orgName}
                        onChange={(e) => setOrgName(e.target.value)}
                        className="bg-transparent text-xs text-secondary-100 outline-none flex-1"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-secondary-300 mb-1.5">SAMA Institution ID</label>
                    <div className="flex items-center gap-2 bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)] rounded-sm px-3 py-2.5 opacity-60 cursor-not-allowed">
                      <Shield size={13} className="text-secondary-300 flex-shrink-0" />
                      <span className="text-xs text-secondary-300">{samaId}</span>
                    </div>
                    <p className="text-[10px] text-secondary-300 mt-1">Assigned by SAMA — contact support to update</p>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-secondary-300 mb-1.5">Timezone</label>
                    <div className="flex items-center gap-2 bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)] rounded-sm px-3 py-2.5 focus-within:border-secondary transition-all">
                      <Clock size={13} className="text-secondary-300 flex-shrink-0" />
                      <select
                        value={timezone}
                        onChange={(e) => setTimezone(e.target.value)}
                        className="bg-transparent text-xs text-secondary-100 outline-none flex-1 cursor-pointer"
                      >
                        <option value="Asia/Riyadh (UTC+3)">Asia/Riyadh (UTC+3)</option>
                        <option value="UTC">UTC</option>
                        <option value="Europe/London (UTC+1)">Europe/London (UTC+1)</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-secondary-300 mb-1.5">Display Language</label>
                    <div className="flex items-center gap-2 bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)] rounded-sm px-3 py-2.5 focus-within:border-secondary transition-all">
                      <Globe size={13} className="text-secondary-300 flex-shrink-0" />
                      <select
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        className="bg-transparent text-xs text-secondary-100 outline-none flex-1 cursor-pointer"
                      >
                        <option>English</option>
                        <option>Arabic</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Platform behaviour */}
              <div className="audit-card overflow-hidden">
                <div className="px-5 py-4 border-b border-[rgba(255,255,255,0.04)]">
                  <p className="text-[11px] font-semibold tracking-[0.08em] uppercase text-secondary-300">
                    Platform Behaviour
                  </p>
                </div>
                <div className="divide-y divide-[rgba(255,255,255,0.04)]">
                  {[
                    { label: "Automatic SAMA Sync", desc: "Fetch new circulars and amendments every 24 hours", on: autoSync, toggle: () => setAutoSync((v) => !v) },
                    { label: "Audit Deadline Alerts", desc: "Send in-app alerts when evidence deadlines approach", on: auditAlerts, toggle: () => setAuditAlerts((v) => !v) },
                    { label: "Two-Factor Authentication", desc: "Require 2FA for all team members at login", on: twoFactor, toggle: () => setTwoFactor((v) => !v) },
                  ].map(({ label, desc, on, toggle }) => (
                    <div key={label} className="flex items-center justify-between px-5 py-3.5">
                      <div>
                        <p className="text-xs font-medium text-secondary-100">{label}</p>
                        <p className="text-[10px] text-secondary-300 mt-0.5">{desc}</p>
                      </div>
                      <Toggle on={on} onToggle={toggle} />
                    </div>
                  ))}
                  <div className="flex items-center justify-between px-5 py-3.5">
                    <div>
                      <p className="text-xs font-medium text-secondary-100">Data Retention Period</p>
                      <p className="text-[10px] text-secondary-300 mt-0.5">How long evidence and audit logs are kept</p>
                    </div>
                    <select
                      value={dataRetention}
                      onChange={(e) => setDataRetention(e.target.value)}
                      className="bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.1)] text-xs text-secondary-100 rounded-sm px-3 py-1.5 outline-none cursor-pointer"
                    >
                      <option>1 Year</option>
                      <option>2 Years</option>
                      <option>5 Years</option>
                      <option>7 Years</option>
                    </select>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* ── INTEGRATIONS ── */}
          {activeTab === "integrations" && (
            <div className="audit-card overflow-hidden">
              <div className="px-5 py-4 border-b border-[rgba(255,255,255,0.04)] flex items-center gap-2">
                <Link2 size={13} className="text-secondary-300" />
                <p className="text-[11px] font-semibold tracking-[0.08em] uppercase text-secondary-300">
                  Connected Integrations
                </p>
              </div>
              <div className="divide-y divide-[rgba(255,255,255,0.04)]">
                {[
                  {
                    name: "Microsoft 365",
                    desc: "SharePoint evidence sync, Teams notifications",
                    status: "Connected",
                    statusColor: "text-risk-low",
                    dotColor: "bg-risk-low",
                    detail: "Last sync: 2 hours ago · 12 files synced",
                  },
                  {
                    name: "SAMA Open API",
                    desc: "Real-time regulatory circular feed",
                    status: "Active",
                    statusColor: "text-risk-low",
                    dotColor: "bg-risk-low",
                    detail: "Polling every 24h · 3 new circulars this month",
                  },
                  {
                    name: "Azure Active Directory",
                    desc: "SSO and user provisioning",
                    status: "Connected",
                    statusColor: "text-risk-low",
                    dotColor: "bg-risk-low",
                    detail: "5 users synced · Group mapping active",
                  },
                  {
                    name: "Email (SMTP)",
                    desc: "Notification and digest email delivery",
                    status: "Connected",
                    statusColor: "text-risk-low",
                    dotColor: "bg-risk-low",
                    detail: "smtp.bank.sa · TLS enabled",
                  },
                  {
                    name: "Splunk SIEM",
                    desc: "Audit log forwarding to SIEM platform",
                    status: "Not configured",
                    statusColor: "text-secondary-300",
                    dotColor: "bg-[rgba(255,255,255,0.15)]",
                    detail: "Connect your SIEM to receive audit events",
                  },
                  {
                    name: "Power BI",
                    desc: "Export governance dashboards to Power BI",
                    status: "Not configured",
                    statusColor: "text-secondary-300",
                    dotColor: "bg-[rgba(255,255,255,0.15)]",
                    detail: "Publish live reports to your BI workspace",
                  },
                ].map((item) => (
                  <div key={item.name} className="flex items-center justify-between px-5 py-4">
                    <div className="flex items-start gap-3">
                      <div className={`mt-1 w-1.5 h-1.5 rounded-full flex-shrink-0 ${item.dotColor}`} />
                      <div>
                        <p className="text-xs font-medium text-secondary-100">{item.name}</p>
                        <p className="text-[10px] text-secondary-300 mt-0.5">{item.desc}</p>
                        <p className={`text-[10px] mt-1 font-medium ${item.statusColor}`}>{item.detail}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className={`text-[10px] font-semibold ${item.statusColor}`}>{item.status}</span>
                      <button className="text-[10px] px-2.5 py-1 border border-[rgba(255,255,255,0.1)] rounded-sm text-secondary-300 hover:border-secondary hover:text-secondary transition-all">
                        {item.status === "Not configured" ? "Configure" : "Manage"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── AUDIT CYCLE ── */}
          {activeTab === "audit" && (
            <>
              <div className="audit-card overflow-hidden">
                <div className="px-5 py-4 border-b border-[rgba(255,255,255,0.04)] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CalendarDays size={13} className="text-secondary-300" />
                    <p className="text-[11px] font-semibold tracking-[0.08em] uppercase text-secondary-300">
                      Audit Cycles
                    </p>
                  </div>
                  <button className="btn-outline-brand text-[10px] px-3 py-1.5">+ New Cycle</button>
                </div>
                <div className="divide-y divide-[rgba(255,255,255,0.04)]">
                  {auditCycles.map((cycle) => (
                    <div key={cycle.label} className="flex items-center justify-between px-5 py-3.5">
                      <div>
                        <p className="text-xs font-medium text-secondary-100">{cycle.label}</p>
                        <p className="text-[10px] text-secondary-300 mt-0.5">{cycle.range}</p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                          cycle.status === "Active"    ? "bg-[rgba(34,197,94,0.12)] text-risk-low" :
                          cycle.status === "Upcoming"  ? "bg-[rgba(97,59,254,0.12)] text-[#A48DFF]" :
                          "bg-[rgba(255,255,255,0.06)] text-secondary-300"
                        }`}>
                          {cycle.status}
                        </span>
                        {cycle.status !== "Completed" && (
                          <button className="text-[10px] px-2.5 py-1 border border-[rgba(255,255,255,0.1)] rounded-sm text-secondary-300 hover:border-secondary hover:text-secondary transition-all">
                            Edit
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Active cycle config */}
              <div className="audit-card overflow-hidden">
                <div className="px-5 py-4 border-b border-[rgba(255,255,255,0.04)]">
                  <p className="text-[11px] font-semibold tracking-[0.08em] uppercase text-secondary-300">
                    Active Cycle Settings
                  </p>
                </div>
                <div className="p-5 grid grid-cols-2 gap-4">
                  {[
                    { label: "Evidence Deadline Reminder", value: "7 days before due" },
                    { label: "Escalation Threshold (overdue)", value: "3 days" },
                    { label: "Auto-close Completed Items", value: "Enabled" },
                    { label: "Approver Sign-off Required", value: "Yes — Dual approval" },
                  ].map(({ label, value }) => (
                    <div key={label}>
                      <label className="block text-[11px] font-semibold text-secondary-300 mb-1.5">{label}</label>
                      <div className="flex items-center bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)] rounded-sm px-3 py-2.5">
                        <span className="text-xs text-secondary-100">{value}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* ── USER MANAGEMENT ── */}
          {activeTab === "users" && (
            <div className="audit-card overflow-hidden">
              <div className="px-5 py-4 border-b border-[rgba(255,255,255,0.04)] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users size={13} className="text-secondary-300" />
                  <p className="text-[11px] font-semibold tracking-[0.08em] uppercase text-secondary-300">
                    Team Members
                  </p>
                </div>
                <button className="btn-brand text-[10px] px-3 py-1.5">+ Invite User</button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[rgba(255,255,255,0.06)]">
                      {["User", "Role", "Status", "Actions"].map((h) => (
                        <th key={h} className="px-5 py-2.5 text-left text-[10px] font-semibold tracking-[0.1em] uppercase text-secondary-300 whitespace-nowrap">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {userRows.map((u) => (
                      <tr key={u.email} className="border-b border-[rgba(255,255,255,0.04)] last:border-0 hover:bg-[rgba(42,30,92,0.4)] transition-colors">
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-2.5">
                            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-semibold flex-shrink-0 ${u.colorClass}`}>
                              {u.initials}
                            </div>
                            <div>
                              <p className="text-xs font-medium text-secondary-100">{u.name}</p>
                              <p className="text-[10px] text-secondary-300">{u.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-3">
                          <span className="text-xs text-secondary-300">{u.role}</span>
                        </td>
                        <td className="px-5 py-3">
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                            u.status === "Active"   ? "bg-[rgba(34,197,94,0.12)] text-risk-low" :
                            u.status === "Pending"  ? "bg-[rgba(255,180,0,0.12)] text-risk-medium" :
                            "bg-[rgba(255,255,255,0.06)] text-secondary-300"
                          }`}>
                            {u.status}
                          </span>
                        </td>
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-1.5">
                            <button className="text-[10px] px-2 py-1 border border-[rgba(255,255,255,0.08)] rounded-sm text-secondary-300 hover:border-secondary hover:text-secondary transition-all">
                              Edit Role
                            </button>
                            {u.status !== "Inactive" && (
                              <button className="text-[10px] px-2 py-1 border border-[rgba(255,255,255,0.06)] rounded-sm text-secondary-300 hover:border-risk-high hover:text-risk-high transition-all">
                                Deactivate
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* ── Approval Chain ─────────────────────────────── */}
              <div className="px-5 py-5 border-t border-[rgba(255,255,255,0.06)]">
                <div className="flex items-center gap-2 mb-4">
                  <p className="text-[11px] font-semibold tracking-[0.08em] uppercase text-secondary-300">Evidence Approval Chain</p>
                  <span className="text-[9px] text-secondary bg-[rgba(97,59,254,0.15)] px-1.5 py-0.5 rounded-full">Who approves what</span>
                </div>
                <div className="flex items-stretch gap-0">
                  {[
                    { step: "1", action: "Submit Evidence", role: "Evidence Reviewer", roleColor: "text-[#A48DFF]", roleBg: "bg-[rgba(97,59,254,0.12)]", desc: "Owner uploads evidence file linked to a control", connectorColor: "bg-[rgba(255,255,255,0.1)]" },
                    { step: "2", action: "Review Evidence", role: "Audit Analyst", roleColor: "text-[#6B9FFF]", roleBg: "bg-[rgba(107,159,255,0.12)]", desc: "Analyst checks completeness and SAMA alignment", connectorColor: "bg-[rgba(255,255,255,0.1)]" },
                    { step: "3", action: "Approve / Reject", role: "IT Governance Lead", roleColor: "text-secondary", roleBg: "bg-[rgba(97,59,254,0.15)]", desc: "Governance lead gives final approval or sends back", connectorColor: "bg-[rgba(255,255,255,0.1)]" },
                    { step: "4", action: "Download Package", role: "Compliance Officer", roleColor: "text-risk-low", roleBg: "bg-[rgba(34,197,94,0.12)]", desc: "Compliance officer exports audit package for SAMA", connectorColor: "" },
                  ].map((s, i, arr) => (
                    <div key={s.step} className="flex items-stretch flex-1">
                      <div className="flex-1 bg-[rgba(42,30,92,0.25)] border border-[rgba(255,255,255,0.06)] rounded-sm p-3 flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-[rgba(97,59,254,0.2)] text-secondary text-[10px] font-bold flex items-center justify-center flex-shrink-0">{s.step}</span>
                          <p className="text-xs font-semibold text-secondary-100">{s.action}</p>
                        </div>
                        <span className={`self-start text-[10px] font-semibold px-2 py-0.5 rounded-full ${s.roleColor} ${s.roleBg}`}>{s.role}</span>
                        <p className="text-[10px] text-secondary-300 leading-relaxed">{s.desc}</p>
                      </div>
                      {i < arr.length - 1 && (
                        <div className="flex items-center px-1">
                          <div className="w-5 h-px bg-[rgba(255,255,255,0.15)]" />
                          <div className="w-0 h-0 border-t-4 border-b-4 border-l-4 border-t-transparent border-b-transparent border-l-[rgba(255,255,255,0.2)]" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* ── Role Permissions Matrix ─────────────────────── */}
              <div className="px-5 pb-5 border-t border-[rgba(255,255,255,0.06)] pt-5">
                <p className="text-[11px] font-semibold tracking-[0.08em] uppercase text-secondary-300 mb-4">Role Permissions Matrix</p>
                <div className="overflow-x-auto">
                  <table className="w-full text-[11px]">
                    <thead>
                      <tr className="border-b border-[rgba(255,255,255,0.06)]">
                        <th className="py-2 pr-4 text-left text-[10px] font-semibold tracking-[0.08em] uppercase text-secondary-300 w-44">Permission</th>
                        {["IT Governance Lead", "Compliance Officer", "Evidence Reviewer", "Audit Analyst", "Viewer"].map(r => (
                          <th key={r} className="py-2 px-3 text-center text-[10px] font-semibold text-secondary-300 whitespace-nowrap">{r}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { action: "Submit Evidence",    it: true,  co: false, er: true,  aa: false, vi: false },
                        { action: "Review Evidence",    it: true,  co: true,  er: false, aa: true,  vi: false },
                        { action: "Approve Evidence",   it: true,  co: false, er: false, aa: false, vi: false },
                        { action: "Reject Evidence",    it: true,  co: false, er: false, aa: false, vi: false },
                        { action: "Manage Controls",    it: true,  co: false, er: false, aa: false, vi: false },
                        { action: "Assign Owners",      it: true,  co: true,  er: false, aa: false, vi: false },
                        { action: "Export Reports",     it: true,  co: true,  er: false, aa: true,  vi: false },
                        { action: "Download Evidence",  it: true,  co: true,  er: true,  aa: true,  vi: false },
                        { action: "Manage Users",       it: true,  co: false, er: false, aa: false, vi: false },
                        { action: "View Dashboard",     it: true,  co: true,  er: true,  aa: true,  vi: true  },
                      ].map((row, i) => (
                        <tr key={row.action} className={`border-b border-[rgba(255,255,255,0.04)] last:border-0 ${i % 2 === 0 ? "" : "bg-[rgba(255,255,255,0.01)]"}`}>
                          <td className="py-2.5 pr-4 text-xs text-secondary-200 font-medium">{row.action}</td>
                          {[row.it, row.co, row.er, row.aa, row.vi].map((allowed, j) => (
                            <td key={j} className="py-2.5 px-3 text-center">
                              {allowed
                                ? <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[rgba(34,197,94,0.12)]"><span className="text-risk-low text-[11px] font-bold">✓</span></span>
                                : <span className="text-secondary-300/40 text-sm">—</span>
                              }
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </MainLayout>
  );
}
