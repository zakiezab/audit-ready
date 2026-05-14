"use client";
import { useEffect, useRef } from "react";
import { X, Download, Printer, ChevronLeft, ChevronRight, Shield, CheckCircle2, AlertTriangle, Clock, FileText } from "lucide-react";

type ReportId = "full-audit" | "sama-compliance" | "gap-analysis" | "evidence-inventory" | "ownership-summary";

interface ReportPreviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reportType: ReportId;
}

// ── Shared document styles (injected into preview iframe) ─────────────────────────────
const DOC_STYLES = `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: Arial, sans-serif; background: #fff; color: #1a1a2e; font-size: 11px; line-height: 1.5; }
  .page { width: 794px; min-height: 1123px; margin: 0 auto; padding: 56px 64px; position: relative; }
  .page + .page { border-top: 2px dashed #e0e0e0; }

  /* Header */
  .doc-header { display: flex; align-items: flex-start; justify-content: space-between; padding-bottom: 20px; border-bottom: 2px solid #D8242A; margin-bottom: 28px; }
  .doc-logo { font-size: 15px; font-weight: 700; color: #613BFE; letter-spacing: -.3px; }
  .doc-logo span { color: #D8242A; }
  .doc-header-meta { text-align: right; font-size: 10px; color: #666; line-height: 1.7; }
  .doc-header-meta strong { color: #1a1a2e; font-size: 11px; }

  /* Cover */
  .cover-band { background: linear-gradient(135deg, #130E23 0%, #1E1645 100%); color: #fff; padding: 40px 64px; margin: -56px -64px 36px; min-height: 220px; display: flex; flex-direction: column; justify-content: flex-end; }
  .cover-tag { font-size: 9px; font-weight: 700; letter-spacing: .15em; text-transform: uppercase; color: rgba(255,255,255,.5); margin-bottom: 10px; }
  .cover-title { font-size: 26px; font-weight: 700; line-height: 1.2; color: #fff; margin-bottom: 8px; }
  .cover-sub { font-size: 13px; color: rgba(255,255,255,.6); }
  .cover-meta { display: flex; gap: 32px; margin-top: 20px; }
  .cover-meta-item label { font-size: 9px; text-transform: uppercase; letter-spacing: .1em; color: rgba(255,255,255,.45); display: block; margin-bottom: 2px; }
  .cover-meta-item span { font-size: 12px; font-weight: 600; color: #fff; }

  /* Section headings */
  .section-label { font-size: 9px; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; color: #613BFE; margin-bottom: 6px; }
  h2 { font-size: 15px; font-weight: 700; color: #1a1a2e; margin-bottom: 14px; padding-bottom: 8px; border-bottom: 1px solid #e8e8e8; }
  h3 { font-size: 12px; font-weight: 700; color: #1a1a2e; margin-bottom: 8px; margin-top: 18px; }
  p { color: #444; margin-bottom: 10px; font-size: 11px; }

  /* Score hero */
  .score-hero { display: flex; align-items: center; gap: 28px; background: linear-gradient(135deg, #f8f6ff, #fff); border: 1px solid #e2dcff; border-radius: 8px; padding: 20px 24px; margin-bottom: 20px; }
  .score-circle { width: 80px; height: 80px; border-radius: 50%; background: conic-gradient(#613BFE 0% 72%, #e8e8e8 72% 100%); display: flex; align-items: center; justify-content: center; flex-shrink: 0; position: relative; }
  .score-inner { width: 62px; height: 62px; border-radius: 50%; background: #fff; display: flex; flex-direction: column; align-items: center; justify-content: center; }
  .score-number { font-size: 18px; font-weight: 700; color: #613BFE; line-height: 1; }
  .score-denom { font-size: 9px; color: #888; }
  .score-details h3 { margin: 0 0 4px; font-size: 14px; }
  .score-badge { display: inline-flex; align-items: center; gap: 5px; font-size: 10px; font-weight: 700; padding: 3px 10px; border-radius: 99px; background: rgba(34,197,94,.1); color: #16a34a; border: 1px solid rgba(34,197,94,.3); margin-bottom: 6px; }
  .score-badge::before { content: ""; width: 6px; height: 6px; border-radius: 50%; background: currentColor; }
  .score-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
  .score-domain { background: #f9f9f9; border: 1px solid #ececec; border-radius: 5px; padding: 8px 10px; }
  .score-domain-name { font-size: 9px; font-weight: 600; color: #555; text-transform: uppercase; letter-spacing: .06em; margin-bottom: 4px; }
  .score-domain-bar { height: 4px; background: #e8e8e8; border-radius: 2px; margin-bottom: 4px; }
  .score-domain-fill { height: 100%; border-radius: 2px; background: #613BFE; }
  .score-domain-val { font-size: 10px; font-weight: 700; color: #613BFE; }

  /* Stats row */
  .stats-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-bottom: 20px; }
  .stat-box { border: 1px solid #e8e8e8; border-radius: 6px; padding: 12px 14px; }
  .stat-box.high   { border-color: rgba(239,68,68,.3);  background: rgba(239,68,68,.04); }
  .stat-box.medium { border-color: rgba(249,169,49,.3); background: rgba(249,169,49,.04); }
  .stat-box.low    { border-color: rgba(34,197,94,.3);  background: rgba(34,197,94,.04); }
  .stat-box.blue   { border-color: rgba(97,59,254,.3);  background: rgba(97,59,254,.04); }
  .stat-label { font-size: 9px; text-transform: uppercase; letter-spacing: .08em; color: #888; margin-bottom: 4px; }
  .stat-val { font-size: 22px; font-weight: 700; color: #1a1a2e; line-height: 1; }
  .stat-val.red    { color: #D8242A; }
  .stat-val.amber  { color: #d97706; }
  .stat-val.green  { color: #16a34a; }
  .stat-val.purple { color: #613BFE; }
  .stat-sub { font-size: 10px; color: #888; margin-top: 2px; }

  /* Tables */
  table { width: 100%; border-collapse: collapse; margin-bottom: 16px; font-size: 10.5px; }
  thead tr { background: #f5f4fb; }
  th { padding: 7px 10px; text-align: left; font-size: 9px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; color: #555; border-bottom: 1px solid #ddd; }
  td { padding: 8px 10px; border-bottom: 1px solid #f0f0f0; color: #333; vertical-align: middle; }
  tr:last-child td { border-bottom: none; }
  tr:hover td { background: #fafafa; }
  .badge { display: inline-flex; align-items: center; gap: 4px; font-size: 9px; font-weight: 700; padding: 2px 7px; border-radius: 99px; }
  .badge-high   { background: rgba(239,68,68,.1);  color: #dc2626; border: 1px solid rgba(239,68,68,.25); }
  .badge-medium { background: rgba(249,169,49,.1); color: #d97706; border: 1px solid rgba(249,169,49,.25); }
  .badge-low    { background: rgba(34,197,94,.1);  color: #16a34a; border: 1px solid rgba(34,197,94,.25); }
  .badge-done   { background: rgba(97,59,254,.1);  color: #613BFE; border: 1px solid rgba(97,59,254,.25); }
  .badge-pending { background: rgba(249,169,49,.1); color: #d97706; border: 1px solid rgba(249,169,49,.25); }
  .badge-missing { background: rgba(239,68,68,.1); color: #dc2626; border: 1px solid rgba(239,68,68,.25); }

  /* SAMA mapping */
  .sama-domain { margin-bottom: 16px; }
  .sama-domain-header { display: flex; align-items: center; justify-content: space-between; background: #f5f4fb; border-radius: 5px; padding: 8px 12px; margin-bottom: 6px; }
  .sama-domain-name { font-size: 11px; font-weight: 700; color: #1a1a2e; }
  .progress-wrap { display: flex; align-items: center; gap: 8px; }
  .progress-bar { width: 100px; height: 5px; background: #e0e0e0; border-radius: 3px; overflow: hidden; }
  .progress-fill { height: 100%; border-radius: 3px; }

  /* Alert box */
  .alert-box { border-radius: 5px; padding: 10px 14px; margin-bottom: 12px; display: flex; gap: 10px; align-items: flex-start; }
  .alert-box.red    { background: rgba(239,68,68,.06);  border: 1px solid rgba(239,68,68,.2);  border-left: 3px solid #dc2626; }
  .alert-box.amber  { background: rgba(249,169,49,.06); border: 1px solid rgba(249,169,49,.2); border-left: 3px solid #d97706; }
  .alert-box.green  { background: rgba(34,197,94,.06);  border: 1px solid rgba(34,197,94,.2);  border-left: 3px solid #16a34a; }
  .alert-label { font-size: 10px; font-weight: 700; margin-bottom: 2px; }
  .alert-box.red .alert-label    { color: #dc2626; }
  .alert-box.amber .alert-label  { color: #d97706; }
  .alert-box.green .alert-label  { color: #16a34a; }
  .alert-text { font-size: 10px; color: #555; }

  /* Footer */
  .doc-footer { position: absolute; bottom: 28px; left: 64px; right: 64px; display: flex; align-items: center; justify-content: space-between; padding-top: 10px; border-top: 1px solid #e8e8e8; }
  .doc-footer span { font-size: 9px; color: #aaa; }
  .doc-footer .confidential { font-size: 9px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; color: #D8242A; }

  .divider { border: none; border-top: 1px solid #eee; margin: 20px 0; }
  .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
  .info-row { display: flex; justify-content: space-between; padding: 5px 0; border-bottom: 1px solid #f5f5f5; }
  .info-row:last-child { border-bottom: none; }
  .info-key { font-size: 10px; color: #888; }
  .info-val { font-size: 10px; font-weight: 600; color: #333; }
`;

// ── Document content per report type ──────────────────────────────
function getDocumentHTML(reportType: ReportId): string {
  const now = "14 May 2026";
  const bank = "Al-Masraf National Bank";
  const cycle = "Q2 2026 Audit Cycle";

  const header = `
    <div class="doc-header">
      <div class="doc-logo">Audit<span>Ready</span></div>
      <div class="doc-header-meta">
        <strong>${bank}</strong><br>
        ${cycle} · Generated ${now}<br>
        SAMA CCSF Compliance · Confidential
      </div>
    </div>`;

  const footer = `
    <div class="doc-footer">
      <span class="confidential">Confidential — Internal Use Only</span>
      <span>Audit Ready Platform · ${bank} · ${now}</span>
      <span>Page 1 of 1</span>
    </div>`;

  if (reportType === "full-audit") {
    return `
      <div class="page">
        <div class="cover-band">
          <div class="cover-tag">Audit Ready · SAMA CCSF Framework</div>
          <div class="cover-title">Full Audit Package<br>Q2 2026</div>
          <div class="cover-sub">${bank} — IT Governance & Compliance Report</div>
          <div class="cover-meta">
            <div class="cover-meta-item"><label>Generated</label><span>${now}</span></div>
            <div class="cover-meta-item"><label>Audit Cycle</label><span>${cycle}</span></div>
            <div class="cover-meta-item"><label>Controls</label><span>67 Active</span></div>
            <div class="cover-meta-item"><label>Evidence Items</label><span>134 Total</span></div>
          </div>
        </div>

        ${header}

        <!-- Readiness Score -->
        <div class="section-label">Overall Readiness</div>
        <h2>Audit Readiness Score</h2>
        <div class="score-hero">
          <div class="score-circle">
            <div class="score-inner">
              <div class="score-number">720</div>
              <div class="score-denom">/1000</div>
            </div>
          </div>
          <div class="score-details">
            <div class="score-badge">Compliant</div>
            <h3>Score improved +38 pts from Q1 2026</h3>
            <p style="font-size:10px;color:#666;margin:0">Most evidence collected. 12 open gaps require remediation before the next SAMA on-site review.</p>
          </div>
        </div>
        <div class="score-grid">
          <div class="score-domain"><div class="score-domain-name">IAM</div><div class="score-domain-bar"><div class="score-domain-fill" style="width:84%;background:#613BFE"></div></div><div class="score-domain-val">210/250</div></div>
          <div class="score-domain"><div class="score-domain-name">Encryption</div><div class="score-domain-bar"><div class="score-domain-fill" style="width:86%;background:#1854E8"></div></div><div class="score-domain-val">172/200</div></div>
          <div class="score-domain"><div class="score-domain-name">Network</div><div class="score-domain-bar"><div class="score-domain-fill" style="width:78%;background:#d97706"></div></div><div class="score-domain-val">155/200</div></div>
          <div class="score-domain"><div class="score-domain-name">Data Gov</div><div class="score-domain-bar"><div class="score-domain-fill" style="width:90%;background:#7C5CFF"></div></div><div class="score-domain-val">135/150</div></div>
          <div class="score-domain"><div class="score-domain-name">BCP / DR</div><div class="score-domain-bar"><div class="score-domain-fill" style="width:78%;background:#16a34a"></div></div><div class="score-domain-val">78/100</div></div>
          <div class="score-domain"><div class="score-domain-name">Compliance</div><div class="score-domain-bar"><div class="score-domain-fill" style="width:82%;background:#D8242A"></div></div><div class="score-domain-val">82/100</div></div>
        </div>

        <hr class="divider">

        <!-- Control Summary -->
        <div class="section-label">Control Register</div>
        <h2>Control Status Summary</h2>
        <div class="stats-row">
          <div class="stat-box blue"><div class="stat-label">Total Controls</div><div class="stat-val purple">67</div><div class="stat-sub">Active this cycle</div></div>
          <div class="stat-box low"><div class="stat-label">Evidenced</div><div class="stat-val green">48</div><div class="stat-sub">Fully documented</div></div>
          <div class="stat-box medium"><div class="stat-label">In Progress</div><div class="stat-val amber">7</div><div class="stat-sub">Evidence pending</div></div>
          <div class="stat-box high"><div class="stat-label">Open Gaps</div><div class="stat-val red">12</div><div class="stat-sub">Require action</div></div>
        </div>
        <table>
          <thead><tr><th>Control ID</th><th>Control Name</th><th>Domain</th><th>Risk</th><th>Evidence Status</th><th>Owner</th><th>Deadline</th></tr></thead>
          <tbody>
            <tr><td>CTRL-001</td><td>Access Control Review</td><td>IAM</td><td><span class="badge badge-high">High</span></td><td><span class="badge badge-done">Evidenced</span></td><td>IT Security Team</td><td>30 Apr 2026</td></tr>
            <tr><td>CTRL-002</td><td>Data Governance Framework</td><td>Data Gov</td><td><span class="badge badge-high">High</span></td><td><span class="badge badge-done">Evidenced</span></td><td>Data Team</td><td>30 Apr 2026</td></tr>
            <tr><td>CTRL-003</td><td>Encryption Standards</td><td>Encryption</td><td><span class="badge badge-medium">Medium</span></td><td><span class="badge badge-pending">In Review</span></td><td>Net Security</td><td>15 May 2026</td></tr>
            <tr><td>CTRL-004</td><td>Privileged Access Mgmt</td><td>IAM</td><td><span class="badge badge-high">High</span></td><td><span class="badge badge-done">Evidenced</span></td><td>IT Security Team</td><td>30 Apr 2026</td></tr>
            <tr><td>CTRL-005</td><td>Network Segmentation</td><td>Network</td><td><span class="badge badge-medium">Medium</span></td><td><span class="badge badge-missing">Missing</span></td><td>Net Security</td><td>31 May 2026</td></tr>
            <tr><td>CTRL-006</td><td>Business Continuity Plan</td><td>BCP</td><td><span class="badge badge-medium">Medium</span></td><td><span class="badge badge-done">Evidenced</span></td><td>Infrastructure</td><td>30 Apr 2026</td></tr>
            <tr><td>CTRL-007</td><td>Third-Party Risk Assessment</td><td>Compliance</td><td><span class="badge badge-medium">Medium</span></td><td><span class="badge badge-pending">Pending</span></td><td>Risk Mgmt</td><td>31 May 2026</td></tr>
            <tr><td>CTRL-008</td><td>Audit Log Retention</td><td>Compliance</td><td><span class="badge badge-low">Low</span></td><td><span class="badge badge-done">Evidenced</span></td><td>SecOps Team</td><td>30 Apr 2026</td></tr>
          </tbody>
        </table>

        <hr class="divider">

        <!-- Evidence Summary -->
        <div class="section-label">Evidence Collection</div>
        <h2>Evidence Status</h2>
        <div class="stats-row">
          <div class="stat-box low"><div class="stat-label">Approved</div><div class="stat-val green">89</div><div class="stat-sub">Verified</div></div>
          <div class="stat-box blue"><div class="stat-label">In Review</div><div class="stat-val purple">18</div><div class="stat-sub">Awaiting sign-off</div></div>
          <div class="stat-box medium"><div class="stat-label">Pending</div><div class="stat-val amber">14</div><div class="stat-sub">Submitted, not reviewed</div></div>
          <div class="stat-box high"><div class="stat-label">Missing</div><div class="stat-val red">13</div><div class="stat-sub">No evidence uploaded</div></div>
        </div>

        <div class="alert-box red"><div><div class="alert-label">Overdue Evidence — Immediate Action Required</div><div class="alert-text">CTRL-005 (Network Segmentation), CTRL-009 (Data Retention), and CTRL-011 (PAM Policy Review) have no evidence submitted and are past their deadline. Escalate to domain owners immediately.</div></div></div>
        <div class="alert-box green"><div><div class="alert-label">Strong Performance — IAM Domain</div><div class="alert-text">All 14 IAM controls are fully evidenced and approved. This domain is ready for SAMA inspection with no outstanding items.</div></div></div>

        ${footer}
      </div>`;
  }

  if (reportType === "sama-compliance") {
    return `
      <div class="page">
        <div class="cover-band">
          <div class="cover-tag">SAMA CCSF · Regulatory Alignment</div>
          <div class="cover-title">SAMA Compliance Report<br>Q2 2026</div>
          <div class="cover-sub">${bank} — Regulatory Mapping & Coverage Analysis</div>
          <div class="cover-meta">
            <div class="cover-meta-item"><label>Generated</label><span>${now}</span></div>
            <div class="cover-meta-item"><label>Framework</label><span>SAMA CCSF v3.1</span></div>
            <div class="cover-meta-item"><label>Coverage</label><span>84%</span></div>
          </div>
        </div>
        ${header}

        <div class="section-label">Regulatory Overview</div>
        <h2>SAMA CCSF Domain Coverage</h2>
        <div class="stats-row">
          <div class="stat-box low"><div class="stat-label">Domains Covered</div><div class="stat-val green">6/6</div><div class="stat-sub">All domains active</div></div>
          <div class="stat-box blue"><div class="stat-label">Mapped Controls</div><div class="stat-val purple">67</div><div class="stat-sub">To CCSF articles</div></div>
          <div class="stat-box medium"><div class="stat-label">Open Requirements</div><div class="stat-val amber">9</div><div class="stat-sub">Unresolved gaps</div></div>
          <div class="stat-box high"><div class="stat-label">Overdue Circulars</div><div class="stat-val red">2</div><div class="stat-sub">Require action</div></div>
        </div>

        <div class="section-label">Domain Mapping</div>
        <h2>Coverage by SAMA CCSF Domain</h2>

        ${[
          { name: "Identity & Access Management", ref: "CCSF §4.2", controls: 14, done: 12, pct: 86, color: "#613BFE" },
          { name: "Encryption & Data Protection", ref: "CCSF §3.5", controls: 11, done: 10, pct: 91, color: "#1854E8" },
          { name: "Network Security",             ref: "CCSF §5.1", controls: 13, done: 9,  pct: 69, color: "#d97706" },
          { name: "Data Governance",              ref: "CCSF §6.3", controls: 10, done: 10, pct: 100, color: "#7C5CFF" },
          { name: "Business Continuity & DR",     ref: "CCSF §7.2", controls: 9,  done: 7,  pct: 78, color: "#16a34a" },
          { name: "Compliance Monitoring",        ref: "CCSF §4.4", controls: 10, done: 8,  pct: 80, color: "#D8242A" },
        ].map(d => `
          <div class="sama-domain">
            <div class="sama-domain-header">
              <div>
                <div class="sama-domain-name">${d.name}</div>
                <div style="font-size:9px;color:#888;margin-top:2px;">${d.ref} · ${d.controls} controls mapped</div>
              </div>
              <div class="progress-wrap">
                <div class="progress-bar"><div class="progress-fill" style="width:${d.pct}%;background:${d.color}"></div></div>
                <span style="font-size:11px;font-weight:700;color:${d.color};min-width:36px;text-align:right">${d.pct}%</span>
              </div>
            </div>
          </div>`).join("")}

        <hr class="divider">
        <div class="section-label">Circular Mapping</div>
        <h2>Recent SAMA Circulars & Status</h2>
        <table>
          <thead><tr><th>Circular</th><th>Title</th><th>Issued</th><th>Deadline</th><th>Controls Mapped</th><th>Status</th></tr></thead>
          <tbody>
            <tr><td>SAMA-2026-04</td><td>Cloud Security Requirements Update</td><td>Feb 2026</td><td>31 May 2026</td><td>8 controls</td><td><span class="badge badge-pending">In Progress</span></td></tr>
            <tr><td>SAMA-2026-01</td><td>Third-Party Risk Management Policy</td><td>Jan 2026</td><td>30 Apr 2026</td><td>5 controls</td><td><span class="badge badge-done">Mapped</span></td></tr>
            <tr><td>SAMA-2025-11</td><td>Cyber Incident Reporting Framework</td><td>Nov 2025</td><td>28 Feb 2026</td><td>6 controls</td><td><span class="badge badge-done">Evidenced</span></td></tr>
            <tr><td>SAMA-2025-09</td><td>Open Banking Security Controls</td><td>Sep 2025</td><td>31 Jan 2026</td><td>11 controls</td><td><span class="badge badge-done">Evidenced</span></td></tr>
            <tr><td>SAMA-2025-06</td><td>Privileged Access Management Policy</td><td>Jun 2025</td><td>30 Nov 2025</td><td>4 controls</td><td><span class="badge badge-done">Evidenced</span></td></tr>
          </tbody>
        </table>
        ${footer}
      </div>`;
  }

  if (reportType === "gap-analysis") {
    return `
      <div class="page">
        <div class="cover-band">
          <div class="cover-tag">Risk Management · Gap Analysis</div>
          <div class="cover-title">Gap Analysis Report<br>Q2 2026</div>
          <div class="cover-sub">${bank} — Open Control Gaps by Risk Priority</div>
          <div class="cover-meta">
            <div class="cover-meta-item"><label>Generated</label><span>${now}</span></div>
            <div class="cover-meta-item"><label>Total Gaps</label><span>12 High · 21 Med</span></div>
            <div class="cover-meta-item"><label>Est. Effort</label><span>~68 hours</span></div>
          </div>
        </div>
        ${header}

        <div class="section-label">Risk Summary</div>
        <h2>Open Gap Overview</h2>
        <div class="stats-row">
          <div class="stat-box high"><div class="stat-label">High Risk</div><div class="stat-val red">12</div><div class="stat-sub">Immediate action</div></div>
          <div class="stat-box medium"><div class="stat-label">Medium Risk</div><div class="stat-val amber">21</div><div class="stat-sub">Resolve this cycle</div></div>
          <div class="stat-box low"><div class="stat-label">Low Risk</div><div class="stat-val green">34</div><div class="stat-sub">Monitor</div></div>
          <div class="stat-box blue"><div class="stat-label">Overdue</div><div class="stat-val purple">7</div><div class="stat-sub">Past deadline</div></div>
        </div>

        <div class="alert-box red">
          <div><div class="alert-label">Critical — 7 gaps are past their submission deadline</div>
          <div class="alert-text">Network Segmentation Review, Third-Party Risk Assessment, and 5 other controls have exceeded their evidence deadlines. These must be resolved before the SAMA on-site review on 30 June 2026.</div></div>
        </div>

        <div class="section-label">Priority Gaps</div>
        <h2>High-Risk Gaps — Ranked by Priority</h2>
        <table>
          <thead><tr><th>Control</th><th>Domain</th><th>Risk</th><th>Gap Description</th><th>Owner</th><th>Deadline</th><th>Effort</th></tr></thead>
          <tbody>
            <tr><td>CTRL-005</td><td>Network</td><td><span class="badge badge-high">High</span></td><td>No network segmentation evidence uploaded</td><td>Net Security</td><td style="color:#dc2626;font-weight:600">Overdue</td><td>8 hrs</td></tr>
            <tr><td>CTRL-009</td><td>Compliance</td><td><span class="badge badge-high">High</span></td><td>Data retention policy not reviewed for 2026</td><td>Compliance Team</td><td style="color:#dc2626;font-weight:600">Overdue</td><td>4 hrs</td></tr>
            <tr><td>CTRL-012</td><td>IAM</td><td><span class="badge badge-high">High</span></td><td>Privileged account review not completed Q1</td><td>IT Security Team</td><td style="color:#dc2626;font-weight:600">Overdue</td><td>6 hrs</td></tr>
            <tr><td>CTRL-017</td><td>Encryption</td><td><span class="badge badge-high">High</span></td><td>TLS 1.3 migration evidence missing</td><td>Net Security</td><td>31 May 2026</td><td>12 hrs</td></tr>
            <tr><td>CTRL-023</td><td>BCP</td><td><span class="badge badge-high">High</span></td><td>DR test results not submitted for Q1 2026</td><td>Infrastructure</td><td>31 May 2026</td><td>5 hrs</td></tr>
            <tr><td>CTRL-031</td><td>Network</td><td><span class="badge badge-medium">Medium</span></td><td>Firewall ruleset review pending sign-off</td><td>SecOps Team</td><td>15 Jun 2026</td><td>3 hrs</td></tr>
            <tr><td>CTRL-038</td><td>Data Gov</td><td><span class="badge badge-medium">Medium</span></td><td>Data classification policy update needed</td><td>Data Team</td><td>15 Jun 2026</td><td>6 hrs</td></tr>
            <tr><td>CTRL-044</td><td>Compliance</td><td><span class="badge badge-medium">Medium</span></td><td>Third-party vendor audit reports outstanding</td><td>Risk Mgmt</td><td>30 Jun 2026</td><td>10 hrs</td></tr>
          </tbody>
        </table>

        <h3>Remediation Recommendations</h3>
        <div class="alert-box amber"><div><div class="alert-label">Network Domain — Immediate Priority</div><div class="alert-text">Assign a dedicated resource to CTRL-005 and CTRL-017 this week. Both require evidence from the Net Security team and are blocking the overall readiness score from reaching 800+.</div></div></div>
        <div class="alert-box green"><div><div class="alert-label">IAM Domain — On Track</div><div class="alert-text">All remaining IAM gaps are in review and expected to close by 20 May 2026. No escalation required.</div></div></div>
        ${footer}
      </div>`;
  }

  if (reportType === "evidence-inventory") {
    return `
      <div class="page">
        <div class="cover-band">
          <div class="cover-tag">Evidence Management · Inventory Report</div>
          <div class="cover-title">Evidence Inventory<br>Q2 2026</div>
          <div class="cover-sub">${bank} — Full Evidence Status & Owner Breakdown</div>
          <div class="cover-meta">
            <div class="cover-meta-item"><label>Generated</label><span>${now}</span></div>
            <div class="cover-meta-item"><label>Total Items</label><span>134</span></div>
            <div class="cover-meta-item"><label>Coverage</label><span>89%</span></div>
          </div>
        </div>
        ${header}

        <div class="section-label">Status Overview</div>
        <h2>Evidence Collection Status</h2>
        <div class="stats-row">
          <div class="stat-box low"><div class="stat-label">Approved</div><div class="stat-val green">89</div><div class="stat-sub">66% of total</div></div>
          <div class="stat-box blue"><div class="stat-label">In Review</div><div class="stat-val purple">18</div><div class="stat-sub">13% of total</div></div>
          <div class="stat-box medium"><div class="stat-label">Pending</div><div class="stat-val amber">14</div><div class="stat-sub">10% of total</div></div>
          <div class="stat-box high"><div class="stat-label">Missing</div><div class="stat-val red">13</div><div class="stat-sub">10% of total</div></div>
        </div>

        <div class="section-label">Evidence Register</div>
        <h2>Evidence Items</h2>
        <table>
          <thead><tr><th>File Name</th><th>Type</th><th>Linked Control</th><th>Submitted By</th><th>Date</th><th>Status</th></tr></thead>
          <tbody>
            <tr><td>IAM_Policy_Review_Q1_2026.pdf</td><td>PDF</td><td>Access Control Review</td><td>IT Security Team</td><td>8 May 2026</td><td><span class="badge badge-done">Approved</span></td></tr>
            <tr><td>Encryption_Audit_2026.pdf</td><td>PDF</td><td>Encryption Standards</td><td>Net Security</td><td>4 May 2026</td><td><span class="badge badge-pending">In Review</span></td></tr>
            <tr><td>Data_Classification_Matrix.xlsx</td><td>XLSX</td><td>Data Governance Framework</td><td>Data Team</td><td>2 May 2026</td><td><span class="badge badge-done">Approved</span></td></tr>
            <tr><td>PAM_Controls_Evidence_Apr26.pdf</td><td>PDF</td><td>Privileged Access Mgmt</td><td>IT Security Team</td><td>30 Apr 2026</td><td><span class="badge badge-done">Approved</span></td></tr>
            <tr><td>Network_Seg_Diagrams_2026.png</td><td>PNG</td><td>Network Segmentation</td><td>—</td><td>—</td><td><span class="badge badge-missing">Missing</span></td></tr>
            <tr><td>BCP_Test_Results_Q1_2026.docx</td><td>DOCX</td><td>Business Continuity Plan</td><td>Infrastructure</td><td>28 Apr 2026</td><td><span class="badge badge-done">Approved</span></td></tr>
            <tr><td>Vendor_Risk_Assessment_Q1.xlsx</td><td>XLSX</td><td>Third-Party Risk Assessment</td><td>Risk Mgmt</td><td>10 May 2026</td><td><span class="badge badge-pending">Pending</span></td></tr>
            <tr><td>Audit_Log_Compliance_Check.json</td><td>JSON</td><td>Audit Log Retention</td><td>Compliance Team</td><td>20 Apr 2026</td><td><span class="badge badge-done">Approved</span></td></tr>
            <tr><td>DR_Runbook_2026.pdf</td><td>PDF</td><td>DR & Recovery Procedures</td><td>Infrastructure</td><td>15 Apr 2026</td><td><span class="badge badge-done">Approved</span></td></tr>
            <tr><td>TLS_Migration_Evidence.pdf</td><td>PDF</td><td>Encryption Standards</td><td>—</td><td>—</td><td><span class="badge badge-missing">Missing</span></td></tr>
          </tbody>
        </table>

        <h3>Owner Breakdown</h3>
        <table>
          <thead><tr><th>Owner</th><th>Assigned Controls</th><th>Evidence Submitted</th><th>Approved</th><th>Missing</th><th>Completion</th></tr></thead>
          <tbody>
            <tr><td>IT Security Team</td><td>18</td><td>17</td><td>15</td><td>1</td><td><span class="badge badge-done">94%</span></td></tr>
            <tr><td>Net Security</td><td>14</td><td>11</td><td>9</td><td>3</td><td><span class="badge badge-medium">79%</span></td></tr>
            <tr><td>Data Team</td><td>12</td><td>12</td><td>12</td><td>0</td><td><span class="badge badge-done">100%</span></td></tr>
            <tr><td>Infrastructure</td><td>10</td><td>9</td><td>8</td><td>1</td><td><span class="badge badge-done">90%</span></td></tr>
            <tr><td>Compliance Team</td><td>8</td><td>7</td><td>6</td><td>1</td><td><span class="badge badge-medium">88%</span></td></tr>
            <tr><td>Risk Mgmt</td><td>5</td><td>3</td><td>2</td><td>2</td><td><span class="badge badge-high">60%</span></td></tr>
          </tbody>
        </table>
        ${footer}
      </div>`;
  }

  // ownership-summary
  return `
    <div class="page">
      <div class="cover-band">
        <div class="cover-tag">Governance · Ownership Summary</div>
        <div class="cover-title">Ownership Summary<br>Q2 2026</div>
        <div class="cover-sub">${bank} — Domain Ownership Matrix & Approval Status</div>
        <div class="cover-meta">
          <div class="cover-meta-item"><label>Generated</label><span>${now}</span></div>
          <div class="cover-meta-item"><label>Owners</label><span>7 Teams</span></div>
          <div class="cover-meta-item"><label>Pending Approvals</label><span>14</span></div>
        </div>
      </div>
      ${header}

      <div class="section-label">Ownership Matrix</div>
      <h2>Domain Ownership & Status</h2>
      <table>
        <thead><tr><th>Team</th><th>Domain</th><th>Controls</th><th>Evidenced</th><th>Pending Approval</th><th>Overdue</th><th>Status</th></tr></thead>
        <tbody>
          <tr><td>IT Security Team</td><td>IAM</td><td>18</td><td>15</td><td>2</td><td>1</td><td><span class="badge badge-done">On Track</span></td></tr>
          <tr><td>Net Security</td><td>Network</td><td>14</td><td>9</td><td>2</td><td>3</td><td><span class="badge badge-high">At Risk</span></td></tr>
          <tr><td>Data Team</td><td>Data Gov</td><td>12</td><td>12</td><td>0</td><td>0</td><td><span class="badge badge-done">Complete</span></td></tr>
          <tr><td>Infrastructure</td><td>BCP / DR</td><td>10</td><td>8</td><td>2</td><td>0</td><td><span class="badge badge-done">On Track</span></td></tr>
          <tr><td>Compliance Team</td><td>Compliance</td><td>8</td><td>6</td><td>1</td><td>1</td><td><span class="badge badge-medium">Review</span></td></tr>
          <tr><td>Risk Mgmt</td><td>Vendor Risk</td><td>5</td><td>3</td><td>2</td><td>2</td><td><span class="badge badge-high">At Risk</span></td></tr>
          <tr><td>SecOps Team</td><td>Monitoring</td><td>7</td><td>5</td><td>2</td><td>0</td><td><span class="badge badge-done">On Track</span></td></tr>
        </tbody>
      </table>

      <h2>Pending Approvals — Governance Queue</h2>
      <table>
        <thead><tr><th>Evidence File</th><th>Control</th><th>Submitted By</th><th>Submitted On</th><th>Awaiting</th><th>Priority</th></tr></thead>
        <tbody>
          <tr><td>Encryption_Audit_2026.pdf</td><td>Encryption Standards</td><td>Net Security</td><td>4 May 2026</td><td>IT Governance Lead</td><td><span class="badge badge-high">High</span></td></tr>
          <tr><td>Vendor_Risk_Assessment_Q1.xlsx</td><td>Third-Party Risk</td><td>Risk Mgmt</td><td>10 May 2026</td><td>Compliance Officer</td><td><span class="badge badge-medium">Medium</span></td></tr>
          <tr><td>Network_Policy_Review.pdf</td><td>Network Segmentation</td><td>Net Security</td><td>12 May 2026</td><td>IT Governance Lead</td><td><span class="badge badge-high">High</span></td></tr>
          <tr><td>BCP_Amendment_May26.docx</td><td>Business Continuity</td><td>Infrastructure</td><td>11 May 2026</td><td>IT Governance Lead</td><td><span class="badge badge-medium">Medium</span></td></tr>
          <tr><td>SecOps_Monitoring_Report.pdf</td><td>Audit Log Retention</td><td>SecOps Team</td><td>9 May 2026</td><td>Compliance Officer</td><td><span class="badge badge-low">Low</span></td></tr>
        </tbody>
      </table>
      ${footer}
    </div>`;
}

// ── Modal component ───────────────────────────────────────────────
export function ReportPreviewModal({ open, onOpenChange, reportType }: ReportPreviewModalProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (!open || !iframeRef.current) return;
    const doc = iframeRef.current.contentDocument;
    if (!doc) return;
    doc.open();
    doc.write(`<!DOCTYPE html><html><head><meta charset="UTF-8"><style>${DOC_STYLES}</style></head><body>${getDocumentHTML(reportType)}</body></html>`);
    doc.close();
  }, [open, reportType]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={() => onOpenChange(false)}
      />

      {/* Modal */}
      <div className="relative z-10 flex flex-col w-[900px] h-[90vh] bg-[#181227] border border-[rgba(255,255,255,0.1)] rounded-lg shadow-2xl overflow-hidden">

        {/* Toolbar */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-[rgba(255,255,255,0.07)] flex-shrink-0">
          <div className="flex items-center gap-3">
            <FileText size={14} className="text-secondary" />
            <div>
              <p className="text-xs font-semibold text-secondary-100">
                {reportType === "full-audit" && "Full Audit Package — Q2 2026"}
                {reportType === "sama-compliance" && "SAMA Compliance Report — Q2 2026"}
                {reportType === "gap-analysis" && "Gap Analysis Report — Q2 2026"}
                {reportType === "evidence-inventory" && "Evidence Inventory — Q2 2026"}
                {reportType === "ownership-summary" && "Ownership Summary — Q2 2026"}
              </p>
              <p className="text-[10px] text-secondary-300">Al-Masraf National Bank · Preview Mode</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 text-[11px] text-secondary-300 border border-[rgba(255,255,255,0.08)] rounded-sm px-3 py-1.5 hover:border-secondary hover:text-secondary transition-all">
              <Printer size={12} /> Print
            </button>
            <button className="flex items-center gap-1.5 text-[11px] font-medium btn-brand px-3 py-1.5">
              <Download size={12} /> Download PDF
            </button>
            <button
              onClick={() => onOpenChange(false)}
              className="w-7 h-7 flex items-center justify-center text-secondary-300 hover:text-secondary-100 border border-[rgba(255,255,255,0.08)] rounded-sm hover:border-[rgba(255,255,255,0.2)] transition-all ml-1"
            >
              <X size={13} />
            </button>
          </div>
        </div>

        {/* Document canvas */}
        <div className="flex-1 overflow-auto bg-[#0f0c1d] p-6">
          <div className="shadow-2xl rounded-sm overflow-hidden" style={{ width: 794 + 32, margin: "0 auto" }}>
            <iframe
              ref={iframeRef}
              title="Report Preview"
              style={{ width: 794, height: 1200, border: "none", display: "block", margin: "0 auto" }}
              sandbox="allow-same-origin"
            />
          </div>
        </div>

        {/* Page nav bar */}
        <div className="flex items-center justify-center gap-4 px-5 py-2.5 border-t border-[rgba(255,255,255,0.07)] flex-shrink-0">
          <button className="w-6 h-6 flex items-center justify-center text-secondary-300 hover:text-secondary-100 disabled:opacity-30 transition-colors" disabled>
            <ChevronLeft size={14} />
          </button>
          <span className="text-[11px] text-secondary-300">Page <span className="text-secondary-100 font-semibold">1</span> of 1</span>
          <button className="w-6 h-6 flex items-center justify-center text-secondary-300 hover:text-secondary-100 disabled:opacity-30 transition-colors" disabled>
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
