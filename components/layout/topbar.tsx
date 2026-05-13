"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Download, Bell } from "lucide-react";
import { notifications } from "@/lib/mock-data";

const breadcrumbMap: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/controls": "Controls & Gaps",
  "/evidence": "Evidence Hub",
  "/regulations": "SAMA Regulations",
  "/governance": "Governance",
  "/notifications": "Notifications",
  "/profile": "My Profile",
  "/settings": "Settings",
  "/reports": "Reports & Export",
};

export function Topbar() {
  const pathname = usePathname();
  const current = breadcrumbMap[pathname] ?? "Dashboard";

  return (
    <header className="h-[60px] border-b border-[rgba(255,255,255,0.08)] flex items-center px-7 gap-4 sticky top-0 z-40 bg-dark/90 backdrop-blur-md">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-secondary-300">
        <span>Audit Ready</span>
        <span className="opacity-30">›</span>
        <span className="text-secondary-100 font-medium">{current}</span>
      </div>

      <div className="ml-auto flex items-center gap-3">
        {/* Live indicator */}
        <div className="flex items-center gap-1.5 text-[10px] font-semibold tracking-[0.08em] uppercase text-risk-low">
          <span className="w-1.5 h-1.5 rounded-full bg-risk-low animate-pulse" />
          SAMA Sync Active
        </div>

        <div className="w-px h-5 bg-[rgba(255,255,255,0.08)]" />

        {/* Search */}
        <div className="flex items-center gap-2 bg-[rgba(42,30,92,0.35)] border border-[rgba(255,255,255,0.08)] rounded-sm px-3 py-1.5 text-xs text-secondary-300 w-44 hover:border-[rgba(255,255,255,0.15)] transition-all cursor-text">
          <Search size={11} />
          Search...
        </div>

        {/* Download */}
        <button className="w-8 h-8 rounded-sm flex items-center justify-center text-secondary-300 hover:text-secondary-100 hover:bg-[rgba(255,255,255,0.06)] transition-all">
          <Download size={14} />
        </button>

        {/* Bell */}
        {(() => {
          const unread = notifications.filter((n) => !n.read).length;
          return (
            <Link
              href="/notifications"
              className="w-8 h-8 rounded-sm flex items-center justify-center text-secondary-300 hover:text-secondary-100 hover:bg-[rgba(255,255,255,0.06)] transition-all relative"
            >
              <Bell size={14} />
              {unread > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[14px] h-[14px] px-[3px] bg-primary rounded-full border-[1.5px] border-dark flex items-center justify-center text-[8px] font-bold text-white leading-none">
                  {unread}
                </span>
              )}
            </Link>
          );
        })()}

        <div className="w-px h-5 bg-[rgba(255,255,255,0.08)]" />

        {/* Avatar */}
        <Link
          href="/profile"
          className="w-7 h-7 rounded-full bg-gradient-to-br from-secondary to-primary flex items-center justify-center text-[10px] font-semibold text-white hover:ring-2 hover:ring-secondary/50 transition-all"
        >
          ZZ
        </Link>
      </div>
    </header>
  );
}
