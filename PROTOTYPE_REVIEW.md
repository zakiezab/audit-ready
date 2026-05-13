# Audit Ready — Prototype Page Breakdown & Review Questions

> Next.js 15 · Tailwind CSS · ShadCN · Mock Data Only · No Auth
> 
> Run with: `npm run dev` → `http://localhost:3000`

---

## Pages Built

### 1. Dashboard `/dashboard`
The main landing page after redirect from `/`.

**Components on this page:**
- **SAMA Notification Snackbar** — fires 1.5s after load, auto-dismisses after 8s with a countdown progress bar, links to `/regulations`. Only shows when a SAMA update has `isNew: true` and `status: "detected"`.
- **Microsoft Ecosystem Bar** — shows Azure, Microsoft Entra ID, Power Platform, Cognitive Search with "All Connected" status indicator.
- **Readiness Gauge** — SVG arc animation, score 742/1000, delta +38, gradient purple → green.
- **KPI Cards** — 4 cards: Readiness Score, Open Gaps (33), Pending Evidence (18), Next Review (Q2 2026 · 14 days).
- **Risk Bars** — animated horizontal bars: High 12, Medium 21, Low 34.
- **Workflow Status** — step counts (Evidenced 34 · Approved 8 · In Review 13 · Assigned 18 · Overdue 6) + segmented progress bar.
- **My Tasks** — 4 prioritised tasks with deadline colour coding.
- **Priority Gaps Table** — top 7 controls, filterable by All / High Risk / Medium / Pending Evidence. Clicking a row opens a slide-over detail sheet.
- **SAMA Feed Preview** — 3-column cards linking to `/regulations`.

---

### 2. Controls `/controls`
Full controls library with search and multi-filter.

**Features:**
- Search across control name, domain, SAMA reference
- Filter by Risk (All / High / Medium / Low)
- Filter by Evidence Status (All / Missing / Pending / In Review / Approved / Evidenced)
- Filter by Domain (auto-populated from data)
- Clicking any row opens the **Gap Detail Sheet** (slide-over panel with status cards, owner info, evidence list, activity timeline, Validate / Reject / Export actions)
- 10 controls in mock data

---

### 3. Evidence Hub `/evidence`
Evidence file management and upload.

**Features:**
- Summary pills (Approved 3 · In Review 2 · Pending 2 · Missing 1) — clickable to filter
- Drag-and-drop upload zone (visual only, no backend)
- Search by file name or linked control
- Filter by status
- Table columns: File, Linked Control, Type, Size, Submitted By, Date, Status, View/Download actions
- 8 evidence items in mock data

---

### 4. SAMA Regulatory Feed `/regulations`
Full view of regulatory updates from the Saudi Central Bank.

**Features:**
- Pipeline summary cards: Detected 2 · Mapped 2 · Assigned 2
- Live Feed Active indicator (pulse animation)
- Each regulation card shows a pipeline progress bar (Detected → Mapped → Assigned → Validated)
- New/unread badge on recent updates (2 marked `isNew`)
- Per-card CTA changes based on status: "Map Controls" / "Assign Owners" / "View Progress"
- Search and status filter
- 6 SAMA updates in mock data

---

### 5. Governance `/governance`
Workflow management with three tabs.

**Tabs:**
- **Workflow Board** — Kanban-style column view of all 79 controls across 5 stages (Assigned 18 / In Review 13 / Approved 8 / Evidenced 34 / Overdue 6). Placeholder cards shown (up to 3 per column with "+N more").
- **My Tasks** — Full task list with priority badges, deadline colours, detail arrow buttons. 4 tasks in mock data.
- **Approval Queue** — List of items awaiting approval with Approve / Reject / View actions. 3 items in mock data.

---

## Files & Folder Structure

```
audit-ready/
├── app/
│   ├── layout.tsx              # Root layout, fonts, dark mode
│   ├── page.tsx                # Redirect → /dashboard
│   ├── dashboard/page.tsx
│   ├── controls/page.tsx
│   ├── evidence/page.tsx
│   ├── regulations/page.tsx
│   └── governance/page.tsx
├── components/
│   ├── layout/
│   │   ├── sidebar.tsx         # Fixed 240px nav with section groups + user avatar
│   │   ├── topbar.tsx          # Sticky topbar, breadcrumb, search, bell
│   │   └── main-layout.tsx     # Wraps sidebar + topbar + page content
│   ├── shared/
│   │   ├── risk-badge.tsx      # High / Med / Low badge
│   │   ├── status-pill.tsx     # Evidence & workflow status pill
│   │   ├── gap-detail-sheet.tsx # Slide-over control detail panel
│   │   └── sama-notification.tsx # SAMA snackbar notification
│   ├── dashboard/
│   │   ├── readiness-gauge.tsx
│   │   ├── kpi-cards.tsx
│   │   ├── risk-bars.tsx
│   │   ├── workflow-status.tsx
│   │   ├── my-tasks.tsx
│   │   ├── priority-gaps-table.tsx
│   │   ├── sama-feed-preview.tsx
│   │   └── microsoft-bar.tsx
│   └── ui/
│       ├── button.tsx          # ShadCN-style CVA Button
│       ├── sheet.tsx           # Radix Dialog slide-over
│       └── tabs.tsx            # Radix Tabs
├── lib/
│   ├── mock-data.ts            # All seed data
│   └── utils.ts                # cn(), badge/pill/deadline helpers
├── types/index.ts              # All TypeScript interfaces
├── tailwind.config.ts          # Mobiz brand tokens, fonts, animations
└── app/globals.css             # Font imports, utility classes
```

---

## Feature Verification Questions

### Dashboard
1. The **SAMA notification snackbar** appears 1.5s after the dashboard loads and auto-dismisses after 8s with a countdown bar. Is this the correct trigger behaviour, or should it only appear once per session / require a manual dismiss?
2. The **Readiness Gauge** animates from 0 to 742 on page load. Should the gauge reflect a percentage fill (74.2%) or a raw score display — or both as currently shown?
3. The **Priority Gaps Table** defaults to showing the top 7 controls. Should this be a configurable number, or is 7 the correct fixed preview count?
4. The **Risk Bars** (High 12 · Medium 21 · Low 34) animate in 300ms after load. Are these the correct control counts per risk level?
5. The **"View all 33 gaps →"** button in the Priority Gaps Table is currently a static label. Should this number update dynamically based on the active filter, or always show the total?

### Controls Page
6. The **Gap Detail Sheet** (slide-over panel) opens on any row click. Should clicking the row open the sheet, or should only the "Review →" button trigger it?
7. The controls table shows **SAMA Reference** as a text column (e.g. `SAMA CCSF 4.2.1`). Should this be a clickable link that opens the relevant regulation in the SAMA feed, or is a plain label correct?
8. One control (`ctrl-009` — Network Segmentation Review) has no `samaRef` value and shows blank in that column. Is that intentional, or should every control have a SAMA reference?

### Evidence Hub
9. The **drag-and-drop upload zone** is visual only — dropping a file does nothing. Is this acceptable for the prototype, or should it at least show the file name as a "staged" item before upload?
10. Evidence items show a **submitted date** (e.g. "May 8, 2026") rather than a due date. Should the table show when the evidence was submitted, when it's due, or both?
11. The **In Review** status in evidence uses the key `"review"` internally. In the UI it renders as "In Review". Is this label correct, or should it say something else (e.g. "Under Review", "Awaiting Approval")?

### SAMA Regulatory Feed
12. Each regulation card has a **pipeline bar** showing Detected → Mapped → Assigned → Validated. Is "Validated" the correct final stage, or should it be "Closed", "Compliant", or another term?
13. The **"Map Controls"**, **"Assign Owners"**, and **"View Progress"** CTAs on each card are currently buttons that do nothing. Should they navigate somewhere (e.g. to the Controls page filtered by that regulation), or is static correct for now?
14. Two regulations are marked **New** with a purple badge and a ring highlight. Is the visual treatment clear enough, or should there be a stronger indicator (e.g. a red dot, bold title)?

### Governance Page
15. The **Workflow Board** tab shows placeholder skeleton cards per column — not real control names. Should actual control titles be displayed in the Kanban cards, or is the count-only column view sufficient?
16. The **Approval Queue** items show a priority dot and meta text. Should the approver be able to add a **rejection reason / comment** when clicking Reject, or is a one-click reject acceptable?
17. The **My Tasks** and **Approval Queue** tabs share the same underlying `Task` data type. Should Approval Queue items be a separate data model with additional fields (e.g. the submitter's name, the evidence file name), or is the current shared structure correct?
