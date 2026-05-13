import { cn } from "@/lib/utils";
import type { RiskLevel } from "@/types";

interface RiskBadgeProps {
  risk: RiskLevel;
  className?: string;
}

const config: Record<RiskLevel, { label: string; className: string }> = {
  high: { label: "▲ High", className: "badge-high" },
  medium: { label: "◆ Med", className: "badge-medium" },
  low: { label: "● Low", className: "badge-low" },
};

export function RiskBadge({ risk, className }: RiskBadgeProps) {
  const c = config[risk];
  return <span className={cn(c.className, className)}>{c.label}</span>;
}
