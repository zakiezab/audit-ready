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
import { CheckCircle2, Users, Search } from "lucide-react";

interface AssignOwnerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const allControls = [
  { id: "ctrl-001", name: "Access Control Review",        domain: "IT Security · IAM",      risk: "high"   },
  { id: "ctrl-002", name: "Data Governance Framework",    domain: "Data Governance",         risk: "high"   },
  { id: "ctrl-007", name: "Privileged Access Management", domain: "IT Security · PAM",       risk: "high"   },
  { id: "ctrl-003", name: "Encryption Standards",         domain: "Network · Cryptography",  risk: "medium" },
  { id: "ctrl-008", name: "Third-Party Risk Assessment",  domain: "Risk Mgmt · Vendor",      risk: "medium" },
  { id: "ctrl-009", name: "Network Segmentation Review",  domain: "Network · Architecture",  risk: "medium" },
  { id: "ctrl-004", name: "Data Retention Policy",        domain: "Compliance · SAMA",       risk: "low"    },
  { id: "ctrl-005", name: "Business Continuity",          domain: "Infrastructure · DR",     risk: "medium" },
];

const owners = [
  { name: "IT Security Team",   initials: "IS", colorClass: "bg-[rgba(239,68,68,0.2)] text-risk-high" },
  { name: "Data Team",          initials: "DG", colorClass: "bg-[rgba(97,59,254,0.2)] text-[#A48DFF]" },
  { name: "Net Security",       initials: "NS", colorClass: "bg-[rgba(24,84,232,0.2)] text-[#6B9FFF]" },
  { name: "Risk Management",    initials: "RM", colorClass: "bg-[rgba(249,169,49,0.2)] text-risk-medium" },
  { name: "Compliance Team",    initials: "CO", colorClass: "bg-[rgba(34,197,94,0.2)] text-risk-low" },
  { name: "Infrastructure",     initials: "IN", colorClass: "bg-[rgba(34,197,94,0.2)] text-risk-low" },
  { name: "SecOps Team",        initials: "SO", colorClass: "bg-[rgba(34,197,94,0.2)] text-risk-low" },
];

const riskDot: Record<string, string> = {
  high: "bg-risk-high", medium: "bg-risk-medium", low: "bg-risk-low",
};

export function AssignOwnerModal({ open, onOpenChange }: AssignOwnerModalProps) {
  const [search, setSearch] = useState("");
  const [selectedControls, setSelectedControls] = useState<Set<string>>(new Set());
  const [selectedOwner, setSelectedOwner] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const filteredControls = allControls.filter(
    (c) => !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.domain.toLowerCase().includes(search.toLowerCase())
  );

  const toggleControl = (id: string) =>
    setSelectedControls((prev) => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });

  const handleAssign = () => {
    if (!selectedOwner || selectedControls.size === 0) return;
    setDone(true);
    setTimeout(() => { onOpenChange(false); setDone(false); setSelectedControls(new Set()); setSelectedOwner(null); setSearch(""); }, 1200);
  };

  const canAssign = selectedOwner !== null && selectedControls.size > 0;

  return (
    <Sheet open={open} onOpenChange={(v) => { onOpenChange(v); if (!v) { setDone(false); setSelectedControls(new Set()); setSelectedOwner(null); setSearch(""); } }}>
      <SheetContent side="right" className="flex flex-col overflow-hidden p-0 w-[520px]">
        <SheetHeader className="px-6 py-5 border-b border-[rgba(255,255,255,0.06)]">
          <div className="flex items-center gap-2 mb-2">
            <Users size={14} className="text-secondary" />
            <span className="text-[10px] font-semibold text-secondary tracking-[0.1em] uppercase">Assign Owner</span>
          </div>
          <SheetTitle>Assign Owner to Controls</SheetTitle>
          <SheetDescription>
            Select one or more controls, then pick the owner responsible for evidence collection.
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-5">
          {/* Controls picker */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-[10px] font-semibold tracking-[0.1em] uppercase text-secondary-300">
                Controls{selectedControls.size > 0 && <span className="ml-1.5 text-secondary">· {selectedControls.size} selected</span>}
              </p>
              <button
                onClick={() => setSelectedControls(selectedControls.size === allControls.length ? new Set() : new Set(allControls.map((c) => c.id)))}
                className="text-[11px] text-secondary hover:text-secondary-100 transition-colors"
              >
                {selectedControls.size === allControls.length ? "Deselect all" : "Select all"}
              </button>
            </div>
            <div className="flex items-center gap-2 bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.07)] rounded-sm px-3 py-2 mb-2">
              <Search size={12} className="text-secondary-300 flex-shrink-0" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search controls..."
                className="bg-transparent text-xs text-secondary-100 placeholder:text-secondary-300 outline-none flex-1"
              />
            </div>
            <div className="flex flex-col gap-1.5 max-h-56 overflow-y-auto pr-1">
              {filteredControls.map((ctrl) => {
                const checked = selectedControls.has(ctrl.id);
                return (
                  <button
                    key={ctrl.id}
                    onClick={() => toggleControl(ctrl.id)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-sm border text-left transition-all ${
                      checked
                        ? "bg-[rgba(97,59,254,0.1)] border-[rgba(97,59,254,0.3)]"
                        : "bg-[rgba(255,255,255,0.02)] border-[rgba(255,255,255,0.06)] hover:border-[rgba(255,255,255,0.12)]"
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-sm border flex items-center justify-center flex-shrink-0 transition-all ${
                      checked ? "bg-secondary border-secondary" : "border-[rgba(255,255,255,0.2)]"
                    }`}>
                      {checked && <CheckCircle2 size={9} className="text-white" />}
                    </div>
                    <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${riskDot[ctrl.risk]}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-secondary-100 truncate">{ctrl.name}</p>
                      <p className="text-[10px] text-secondary-300">{ctrl.domain}</p>
                    </div>
                    {checked && <CheckCircle2 size={12} className="text-secondary flex-shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Owner picker */}
          <div>
            <p className="text-[10px] font-semibold tracking-[0.1em] uppercase text-secondary-300 mb-2">Owner</p>
            <div className="grid grid-cols-2 gap-2">
              {owners.map((owner) => {
                const isSelected = selectedOwner === owner.name;
                return (
                  <button
                    key={owner.name}
                    onClick={() => setSelectedOwner(owner.name)}
                    className={`flex items-center gap-2.5 px-3 py-2.5 rounded-sm border text-left transition-all ${
                      isSelected
                        ? "bg-[rgba(97,59,254,0.1)] border-[rgba(97,59,254,0.3)]"
                        : "bg-[rgba(255,255,255,0.02)] border-[rgba(255,255,255,0.06)] hover:border-[rgba(255,255,255,0.12)]"
                    }`}
                  >
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-semibold flex-shrink-0 ${owner.colorClass}`}>
                      {owner.initials}
                    </div>
                    <span className="text-xs font-medium text-secondary-100 truncate">{owner.name}</span>
                    {isSelected && <CheckCircle2 size={12} className="text-secondary ml-auto flex-shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <SheetFooter className="border-t border-[rgba(255,255,255,0.06)]">
          <Button className="flex-1" disabled={!canAssign || done} onClick={handleAssign}>
            {done
              ? <><CheckCircle2 size={13} className="mr-1.5" /> Assigned!</>
              : <><Users size={13} className="mr-1.5" /> Assign{selectedControls.size > 1 ? ` ${selectedControls.size} Controls` : selectedControls.size === 1 ? " Control" : ""}</>}
          </Button>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
