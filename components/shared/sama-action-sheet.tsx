"use client";
import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import type { SamaUpdate } from "@/types";
import {
  Map,
  Users,
  CheckSquare,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
} from "lucide-react";

interface SamaActionSheetProps {
  update: SamaUpdate | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStatusAdvance?: (id: string) => void;
}

const mockControlsForSama = [
  { id: "ctrl-001", name: "Access Control Review",        domain: "IT Security · IAM",      risk: "high",   owner: "IT Security Team" },
  { id: "ctrl-002", name: "Data Governance Framework",    domain: "Data Governance",         risk: "high",   owner: "Data Team" },
  { id: "ctrl-007", name: "Privileged Access Management", domain: "IT Security · PAM",       risk: "high",   owner: "IT Security Team" },
  { id: "ctrl-003", name: "Encryption Standards",         domain: "Network · Cryptography",  risk: "medium", owner: "Net Security" },
  { id: "ctrl-008", name: "Third-Party Risk Assessment",  domain: "Risk Mgmt · Vendor",      risk: "medium", owner: "Risk Management" },
  { id: "ctrl-009", name: "Network Segmentation Review",  domain: "Network · Architecture",  risk: "medium", owner: "Net Security" },
  { id: "ctrl-004", name: "Data Retention Policy",        domain: "Compliance · SAMA",       risk: "low",    owner: "Compliance Team" },
];

const ownerOptions = [
  "IT Security Team",
  "Data Team",
  "Net Security",
  "Risk Management",
  "Compliance Team",
  "Infrastructure",
  "SecOps Team",
];

const riskDot: Record<string, string> = {
  high:   "bg-risk-high",
  medium: "bg-risk-medium",
  low:    "bg-risk-low",
};

export function SamaActionSheet({ update, open, onOpenChange, onStatusAdvance }: SamaActionSheetProps) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [assignedOwners, setAssignedOwners] = useState<Record<string, string>>({});
  const [done, setDone] = useState(false);

  if (!update) return null;

  const controls = mockControlsForSama.slice(0, update.impactedControls);
  const allSelected = selected.size === controls.length;

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleAction = () => {
    setDone(true);
    setTimeout(() => {
      onStatusAdvance?.(update.id);
      onOpenChange(false);
      setDone(false);
      setSelected(new Set());
      setAssignedOwners({});
    }, 1200);
  };

  // ── "detected" → Map Controls ─────────────────────────────────
  if (update.status === "detected") {
    return (
      <Sheet open={open} onOpenChange={(v) => { onOpenChange(v); if (!v) { setDone(false); setSelected(new Set()); } }}>
        <SheetContent side="right" className="flex flex-col overflow-hidden p-0 w-[500px]">
          <SheetHeader className="px-6 py-5 border-b border-[rgba(255,255,255,0.06)]">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle size={14} className="text-risk-high" />
              <span className="text-[10px] font-semibold text-risk-high tracking-[0.1em] uppercase">Action Required</span>
            </div>
            <SheetTitle className="leading-snug">Map Controls to Circular</SheetTitle>
            <SheetDescription className="line-clamp-2">{update.title}</SheetDescription>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-4">
            <p className="text-xs text-secondary-300 leading-relaxed">{update.description}</p>

            <div className="flex items-center justify-between">
              <p className="text-[10px] font-semibold tracking-[0.1em] uppercase text-secondary-300">
                Select Controls to Map ({selected.size}/{controls.length})
              </p>
              <button onClick={() => setSelected(allSelected ? new Set() : new Set(controls.map((c) => c.id)))}
                className="text-[11px] text-secondary hover:text-secondary-100 transition-colors">
                {allSelected ? "Deselect all" : "Select all"}
              </button>
            </div>

            <div className="flex flex-col gap-2">
              {controls.map((ctrl) => {
                const checked = selected.has(ctrl.id);
                return (
                  <button key={ctrl.id} onClick={() => toggleSelect(ctrl.id)}
                    className={`flex items-center gap-3 p-3 rounded-sm border text-left transition-all ${
                      checked
                        ? "bg-[rgba(97,59,254,0.1)] border-[rgba(97,59,254,0.3)]"
                        : "bg-[rgba(255,255,255,0.02)] border-[rgba(255,255,255,0.07)] hover:border-[rgba(255,255,255,0.15)]"
                    }`}>
                    <div className={`w-4 h-4 rounded-sm border flex items-center justify-center flex-shrink-0 transition-all ${
                      checked ? "bg-secondary border-secondary" : "border-[rgba(255,255,255,0.2)]"
                    }`}>
                      {checked && <CheckSquare size={10} className="text-white" />}
                    </div>
                    <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${riskDot[ctrl.risk]}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-secondary-100 truncate">{ctrl.name}</p>
                      <p className="text-[10px] text-secondary-300">{ctrl.domain}</p>
                    </div>
                    {checked && <CheckCircle2 size={13} className="text-secondary flex-shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          <SheetFooter className="border-t border-[rgba(255,255,255,0.06)]">
            <Button className="flex-1" disabled={selected.size === 0 || done} onClick={handleAction}>
              {done ? <><CheckCircle2 size={13} className="mr-1.5" /> Mapped!</> : `Map ${selected.size || ""} Controls`}
            </Button>
            <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    );
  }

  // ── "mapped" → Assign Owners ──────────────────────────────────
  if (update.status === "mapped") {
    return (
      <Sheet open={open} onOpenChange={(v) => { onOpenChange(v); if (!v) { setDone(false); setAssignedOwners({}); } }}>
        <SheetContent side="right" className="flex flex-col overflow-hidden p-0 w-[500px]">
          <SheetHeader className="px-6 py-5 border-b border-[rgba(255,255,255,0.06)]">
            <div className="flex items-center gap-2 mb-2">
              <Map size={14} className="text-risk-medium" />
              <span className="text-[10px] font-semibold text-risk-medium tracking-[0.1em] uppercase">Mapped — Assign Owners</span>
            </div>
            <SheetTitle className="leading-snug">Assign Owners to Controls</SheetTitle>
            <SheetDescription className="line-clamp-2">{update.title}</SheetDescription>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-4">
            <p className="text-xs text-secondary-300 leading-relaxed">{update.description}</p>
            <p className="text-[10px] font-semibold tracking-[0.1em] uppercase text-secondary-300">
              Assign Owners — {update.impactedControls} Controls
            </p>
            <div className="flex flex-col gap-2.5">
              {controls.map((ctrl) => (
                <div key={ctrl.id} className="flex items-center gap-3 p-3 bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.07)] rounded-sm">
                  <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${riskDot[ctrl.risk]}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-secondary-100 truncate">{ctrl.name}</p>
                    <p className="text-[10px] text-secondary-300">{ctrl.domain}</p>
                  </div>
                  <select
                    value={assignedOwners[ctrl.id] ?? ctrl.owner}
                    onChange={(e) => setAssignedOwners((prev) => ({ ...prev, [ctrl.id]: e.target.value }))}
                    className="bg-[rgba(97,59,254,0.08)] border border-[rgba(97,59,254,0.25)] text-[11px] text-secondary-100 rounded-sm px-2 py-1.5 outline-none cursor-pointer"
                  >
                    {ownerOptions.map((o) => <option key={o}>{o}</option>)}
                  </select>
                </div>
              ))}
            </div>
          </div>

          <SheetFooter className="border-t border-[rgba(255,255,255,0.06)]">
            <Button className="flex-1" disabled={done} onClick={handleAction}>
              {done ? <><CheckCircle2 size={13} className="mr-1.5" /> Assigned!</> : <><Users size={13} className="mr-1.5" /> Assign Owners</>}
            </Button>
            <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    );
  }

  // ── "assigned" → View Progress ────────────────────────────────
  const progressStatuses = ["Evidenced", "In Review", "Assigned", "In Review", "Evidenced", "Assigned", "In Review"];

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="flex flex-col overflow-hidden p-0 w-[500px]">
        <SheetHeader className="px-6 py-5 border-b border-[rgba(255,255,255,0.06)]">
          <div className="flex items-center gap-2 mb-2">
            <CheckSquare size={14} className="text-risk-low" />
            <span className="text-[10px] font-semibold text-risk-low tracking-[0.1em] uppercase">Assigned — In Progress</span>
          </div>
          <SheetTitle className="leading-snug">Control Progress</SheetTitle>
          <SheetDescription className="line-clamp-2">{update.title}</SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-4">
          <p className="text-xs text-secondary-300 leading-relaxed">{update.description}</p>

          {/* Progress summary */}
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: "Evidenced", count: 2, cls: "text-risk-low" },
              { label: "In Review", count: 3, cls: "text-[#6B9FFF]" },
              { label: "Assigned",  count: 2, cls: "text-secondary-300" },
            ].map(({ label, count, cls }) => (
              <div key={label} className="bg-[rgba(42,30,92,0.4)] border border-[rgba(255,255,255,0.06)] rounded-sm p-3 text-center">
                <p className={`font-metrophobic text-2xl leading-none ${cls}`}>{count}</p>
                <p className="text-[10px] text-secondary-300 mt-1">{label}</p>
              </div>
            ))}
          </div>

          <p className="text-[10px] font-semibold tracking-[0.1em] uppercase text-secondary-300">Control Breakdown</p>
          <div className="flex flex-col gap-2">
            {controls.map((ctrl, i) => {
              const st = progressStatuses[i] ?? "Assigned";
              const stCls = st === "Evidenced" ? "text-risk-low bg-[rgba(34,197,94,0.1)] border-[rgba(34,197,94,0.2)]"
                : st === "In Review" ? "text-[#6B9FFF] bg-[rgba(24,84,232,0.1)] border-[rgba(24,84,232,0.2)]"
                : "text-secondary-300 bg-[rgba(255,255,255,0.04)] border-[rgba(255,255,255,0.08)]";
              return (
                <div key={ctrl.id} className="flex items-center gap-3 p-3 bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] rounded-sm">
                  <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${riskDot[ctrl.risk]}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-secondary-100 truncate">{ctrl.name}</p>
                    <p className="text-[10px] text-secondary-300">{ctrl.owner}</p>
                  </div>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${stCls}`}>{st}</span>
                  <ChevronRight size={12} className="text-secondary-300 flex-shrink-0" />
                </div>
              );
            })}
          </div>
        </div>

        <SheetFooter className="border-t border-[rgba(255,255,255,0.06)]">
          <Button className="flex-1" onClick={() => onOpenChange(false)}>Close</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
