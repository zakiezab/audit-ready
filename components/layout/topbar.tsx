"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Download, Bell, Menu } from "lucide-react";
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

type TopbarProps = {
  onMenuClick?: () => void;
};

export function Topbar({ onMenuClick }: TopbarProps) {
  const pathname = usePathname();
  const current = breadcrumbMap[pathname] ?? "Dashboard";

  return (
    <header className="sticky top-0 z-40 flex h-[60px] items-center gap-2 border-b border-[rgba(255,255,255,0.08)] bg-dark/90 px-4 backdrop-blur-md sm:gap-4 sm:px-7">
      <button
        type="button"
        onClick={onMenuClick}
        aria-label="Open navigation menu"
        className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-sm border border-[rgba(255,255,255,0.1)] text-secondary-200 transition-colors hover:border-[rgba(255,255,255,0.2)] hover:bg-[rgba(255,255,255,0.05)] lg:hidden"
      >
        <Menu size={18} strokeWidth={2} />
      </button>

      {/* Breadcrumb */}
      <div className="min-w-0 flex-1 truncate text-xs text-secondary-300 sm:flex-initial">
        <span className="hidden sm:inline">Audit Ready</span>
        <span className="mx-1.5 opacity-30 sm:mx-2">›</span>
        <span className="font-medium text-secondary-100">{current}</span>
      </div>

      <div className="ml-auto flex min-w-0 flex-shrink-0 items-center gap-2 sm:gap-3">
        {/* Live indicator */}
        <div className="hidden items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-risk-low md:flex">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-risk-low" />
          SAMA Sync Active
        </div>

        <div className="hidden h-5 w-px bg-[rgba(255,255,255,0.08)] md:block" />

        {/* Search */}
        <div className="hidden w-44 cursor-text items-center gap-2 rounded-sm border border-[rgba(255,255,255,0.08)] bg-[rgba(42,30,92,0.35)] px-3 py-1.5 text-xs text-secondary-300 transition-all hover:border-[rgba(255,255,255,0.15)] sm:flex">
          <Search size={11} />
          Search...
        </div>

        {/* Download */}
        <button
          type="button"
          className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-sm text-secondary-300 transition-all hover:bg-[rgba(255,255,255,0.06)] hover:text-secondary-100"
          aria-label="Download"
        >
          <Download size={14} />
        </button>

        {/* Bell */}
        {(() => {
          const unread = notifications.filter((n) => !n.read).length;
          return (
            <Link
              href="/notifications"
              className="relative flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-sm text-secondary-300 transition-all hover:bg-[rgba(255,255,255,0.06)] hover:text-secondary-100"
              aria-label="Notifications"
            >
              <Bell size={14} />
              {unread > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-[14px] min-w-[14px] items-center justify-center rounded-full border-[1.5px] border-dark bg-primary px-[3px] text-[8px] font-bold leading-none text-white">
                  {unread}
                </span>
              )}
            </Link>
          );
        })()}

        <div className="hidden h-5 w-px bg-[rgba(255,255,255,0.08)] sm:block" />

        {/* Avatar */}
        <Link
          href="/profile"
          className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-secondary to-primary text-[10px] font-semibold text-white transition-all hover:ring-2 hover:ring-secondary/50"
        >
          ZZ
        </Link>
      </div>
    </header>
  );
}
