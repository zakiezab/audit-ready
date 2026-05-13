import Link from "next/link";
import { samaUpdates } from "@/lib/mock-data";
import { getSamaStatusClass, getSamaStatusLabel, cn } from "@/lib/utils";
import type { SamaUpdate } from "@/types";

const preview = samaUpdates.slice(0, 3);

const statusBgOverlay: Record<SamaUpdate["status"], string> = {
  detected:
    "bg-[linear-gradient(to_right,rgba(239,68,68,0.3)_0%,rgba(239,68,68,0)_100%)]",
  mapped:
    "bg-[linear-gradient(to_right,rgba(249,169,49,0.3)_0%,rgba(249,169,49,0)_100%)]",
  assigned:
    "bg-[linear-gradient(to_right,rgba(34,197,94,0.3)_0%,rgba(34,197,94,0)_100%)]",
};

const impactColor: Record<SamaUpdate["status"], string> = {
  detected: "text-risk-high",
  mapped:   "text-risk-medium",
  assigned: "text-risk-low",
};

const enterMotion =
  "animate-in fade-in slide-in-from-bottom-2 duration-700 ease-out fill-mode-both motion-reduce:animate-none motion-reduce:opacity-100 motion-reduce:translate-y-0";

export function SamaFeedPreview() {
  const baseDelayMs = 560;

  return (
    <div>
      <div
        className={cn("mb-3 flex items-center justify-between", enterMotion)}
        style={{ animationDelay: `${baseDelayMs}ms` }}
      >
        <p className="text-[11px] font-semibold tracking-[0.08em] uppercase text-secondary-300">
          SAMA Regulatory Feed
        </p>
        <Link href="/regulations" className="text-[11px] text-primary font-medium hover:text-primary-300 transition-colors">
          View full feed →
        </Link>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {preview.map((update, i) => (
          <Link
            key={update.id}
            href="/regulations"
            className={cn(
              "audit-card relative block overflow-hidden p-4 transition-all duration-200 hover:bg-[rgba(42,30,92,0.6)] hover:-translate-y-1",
              enterMotion
            )}
            style={{ animationDelay: `${baseDelayMs + 40 + i * 70}ms` }}
          >
            <div
              className={`pointer-events-none absolute inset-0 rounded-lg ${statusBgOverlay[update.status]}`}
              aria-hidden
            />
            <div className="relative z-10">
              <div className="flex items-start justify-between mb-2.5">
                <div>
                  <p className="text-[9px] text-secondary-300 font-light">{update.date}</p>
                  <p className="text-[9px] text-secondary-300">· {update.type}</p>
                </div>
                <span
                  className={`text-[9px] font-semibold tracking-[0.1em] uppercase px-2 py-0.5 rounded-full border ${getSamaStatusClass(update.status)}`}
                >
                  {getSamaStatusLabel(update.status)}
                </span>
              </div>

              <p className="text-xs font-medium text-secondary-100 leading-snug mb-1.5">
                {update.title}
              </p>
              <p className="text-[11px] text-secondary-300 font-light leading-relaxed line-clamp-2">
                {update.description}
              </p>

              <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-[rgba(255,255,255,0.04)]">
                <span className={`text-[10px] font-semibold ${impactColor[update.status]}`}>
                  {update.status === "detected"
                    ? `⚠ ${update.impactedControls} controls impacted`
                    : update.status === "mapped"
                    ? `◆ ${update.impactedControls} controls mapped`
                    : `✓ ${update.impactedControls} controls assigned`}
                </span>
                <span className="text-[10px] text-primary font-medium">View →</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
