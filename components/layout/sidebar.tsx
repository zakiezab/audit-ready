"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShieldCheck,
  FileText,
  Satellite,
  Users,
  Bell,
  Settings,
  ChevronDown,
  UserCircle,
  LogOut,
  Download,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  {
    section: "Overview",
    items: [
      { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    ],
  },
  {
    section: "Audit Management",
    items: [
      { label: "Controls & Gaps", href: "/controls", icon: ShieldCheck, badge: "12" },
      { label: "Evidence Hub", href: "/evidence", icon: FileText },
      { label: "SAMA Regulations", href: "/regulations", icon: Satellite, badge: "3" },
    ],
  },
  {
    section: "Workflow",
    items: [
      { label: "Governance", href: "/governance", icon: Users },
      { label: "Notifications", href: "/notifications", icon: Bell, badge: "5" },
    ],
  },
  {
    section: "Outputs",
    items: [
      { label: "Audit Export", href: "/reports", icon: Download },
    ],
  },
];

type SidebarProps = {
  /** When true, drawer is visible on small screens (desktop always shows sidebar). */
  isOpen?: boolean;
  /** Called after navigating (closes mobile drawer). */
  onNavigate?: () => void;
};

export function Sidebar({ isOpen = false, onNavigate }: SidebarProps) {
  const pathname = usePathname();
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-50 flex w-[min(260px,88vw)] flex-col border-r border-[rgba(255,255,255,0.08)] bg-[#181227] transition-transform duration-200 ease-out lg:w-[240px]",
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 py-5 border-b border-[rgba(255,255,255,0.08)]">
        <div className="w-[34px] h-[34px] bg-primary rounded-sm flex items-center justify-center flex-shrink-0">
          <ShieldCheck size={18} className="text-white" strokeWidth={2} />
        </div>
        <div>
          <div className="font-metrophobic text-sm tracking-[0.12em] uppercase text-secondary-100 leading-tight">
            Audit Ready
          </div>
          <div className="text-[9px] tracking-[0.1em] uppercase text-secondary-300 font-semibold mt-0.5">
            IT Governance
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 px-2.5 flex flex-col gap-0.5">
        {navItems.map((group) => (
          <div key={group.section}>
            <p className="text-[9px] font-semibold tracking-[0.15em] uppercase text-[#4A4070] px-2.5 pt-4 pb-1.5">
              {group.section}
            </p>
            {group.items.map((item) => {
              const active = pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => onNavigate?.()}
                  className={cn("nav-item", active && "active")}
                >
                  <item.icon size={15} className="flex-shrink-0 opacity-70" />
                  <span className="flex-1">{item.label}</span>
                  {item.badge && (
                    <span className="bg-primary text-white text-[9px] font-semibold px-1.5 py-px rounded-full tracking-[0.02em]">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        ))}

        <div className="flex-1" />

        {/* Settings */}
        <Link
          href="/settings"
          onClick={() => onNavigate?.()}
          className={cn("nav-item mt-2", pathname === "/settings" && "active")}
        >
          <Settings size={15} className="flex-shrink-0 opacity-70" />
          Settings
        </Link>
      </nav>

      {/* User */}
      <div className="p-3 border-t border-[rgba(255,255,255,0.08)] relative">
        {/* Dropdown menu */}
        {userMenuOpen && (
          <div className="absolute bottom-[calc(100%-8px)] left-3 right-3 bg-[#1E1535] border border-[rgba(255,255,255,0.1)] rounded-sm shadow-xl overflow-hidden z-50">
            <Link
              href="/profile"
              onClick={() => {
                setUserMenuOpen(false);
                onNavigate?.();
              }}
              className="flex items-center gap-2.5 px-3 py-2.5 text-xs text-secondary-100 hover:bg-[rgba(255,255,255,0.06)] transition-colors"
            >
              <UserCircle size={13} className="text-secondary-300 flex-shrink-0" />
              View Profile
            </Link>
            <Link
              href="/settings"
              onClick={() => {
                setUserMenuOpen(false);
                onNavigate?.();
              }}
              className="flex items-center gap-2.5 px-3 py-2.5 text-xs text-secondary-100 hover:bg-[rgba(255,255,255,0.06)] transition-colors border-t border-[rgba(255,255,255,0.04)]"
            >
              <Settings size={13} className="text-secondary-300 flex-shrink-0" />
              Settings
            </Link>
            <button
              onClick={() => setUserMenuOpen(false)}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 text-xs text-risk-high hover:bg-[rgba(216,36,42,0.08)] transition-colors border-t border-[rgba(255,255,255,0.04)]"
            >
              <LogOut size={13} className="flex-shrink-0" />
              Sign Out
            </button>
          </div>
        )}

        <button
          onClick={() => setUserMenuOpen((v) => !v)}
          className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-sm hover:bg-[rgba(255,255,255,0.04)] transition-all group"
        >
          <div className="w-[30px] h-[30px] rounded-full bg-gradient-to-br from-secondary to-primary flex items-center justify-center text-[11px] font-semibold text-white flex-shrink-0">
            ZZ
          </div>
          <div className="flex-1 min-w-0 text-left">
            <div className="text-xs font-medium text-secondary-100 truncate">Zakie Zabar</div>
            <div className="text-[10px] text-secondary-300 truncate">IT Governance Lead</div>
          </div>
          <ChevronDown
            size={12}
            className={`text-[#4A4070] flex-shrink-0 transition-transform duration-200 ${userMenuOpen ? "rotate-180" : ""}`}
          />
        </button>
      </div>
    </aside>
  );
}
