"use client";
import { useState } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import {
  User,
  Mail,
  Building2,
  Shield,
  Bell,
  Key,
  Camera,
  CheckCircle2,
} from "lucide-react";

export default function ProfilePage() {
  const [saved, setSaved] = useState(false);
  const [name, setName] = useState("Zakie Zabar");
  const [email] = useState("zakiezabar@gmail.com");
  const [role] = useState("IT Governance Lead");
  const [department, setDepartment] = useState("IT Governance & Compliance");

  const [notifPrefs, setNotifPrefs] = useState({
    samaAlerts: true,
    evidenceReminders: true,
    approvalRequests: true,
    taskAssignments: true,
    systemUpdates: false,
    weeklyDigest: true,
  });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const togglePref = (key: keyof typeof notifPrefs) =>
    setNotifPrefs((p) => ({ ...p, [key]: !p[key] }));

  return (
    <MainLayout>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-secondary-100">My Profile</h1>
          <p className="text-xs text-secondary-300 mt-0.5">
            Manage your account details and notification preferences
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
        {/* Left — Avatar + quick info */}
        <div className="col-span-3 flex flex-col gap-4">
          <div className="audit-card p-5 flex flex-col items-center text-center">
            {/* Avatar */}
            <div className="relative mb-4">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-secondary to-primary flex items-center justify-center text-2xl font-semibold text-white">
                ZZ
              </div>
              <button className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-dark border border-[rgba(255,255,255,0.12)] flex items-center justify-center text-secondary-300 hover:text-secondary-100 hover:border-secondary transition-all">
                <Camera size={12} />
              </button>
            </div>
            <p className="text-sm font-semibold text-secondary-100">{name}</p>
            <p className="text-[11px] text-secondary-300 mt-0.5">{role}</p>
            <div className="mt-3 w-full pt-3 border-t border-[rgba(255,255,255,0.06)]">
              <div className="flex items-center gap-1.5 justify-center text-[10px] font-semibold text-risk-low">
                <Shield size={10} />
                IT Governance Lead
              </div>
            </div>
          </div>

          {/* Access level */}
          <div className="audit-card p-4">
            <p className="text-[10px] font-semibold tracking-[0.1em] uppercase text-secondary-300 mb-3">
              Access Level
            </p>
            {[
              { label: "Controls & Gaps", level: "Full Access" },
              { label: "Evidence Hub", level: "Full Access" },
              { label: "SAMA Regulations", level: "Read + Map" },
              { label: "Governance", level: "Approver" },
              { label: "User Management", level: "View Only" },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between py-2 border-b border-[rgba(255,255,255,0.04)] last:border-0"
              >
                <span className="text-[11px] text-secondary-300">{item.label}</span>
                <span className={`text-[10px] font-semibold ${
                  item.level === "Full Access" ? "text-risk-low" :
                  item.level === "Approver" ? "text-[#A48DFF]" :
                  "text-secondary-300"
                }`}>
                  {item.level}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right — Details + preferences */}
        <div className="col-span-9 flex flex-col gap-5">
          {/* Account details */}
          <div className="audit-card overflow-hidden">
            <div className="px-5 py-4 border-b border-[rgba(255,255,255,0.04)]">
              <p className="text-[11px] font-semibold tracking-[0.08em] uppercase text-secondary-300">
                Account Details
              </p>
            </div>
            <div className="p-5 grid grid-cols-2 gap-4">
              {/* Full name */}
              <div>
                <label className="block text-[11px] font-semibold text-secondary-300 mb-1.5">
                  Full Name
                </label>
                <div className="flex items-center gap-2 bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)] rounded-sm px-3 py-2.5 focus-within:border-secondary transition-all">
                  <User size={13} className="text-secondary-300 flex-shrink-0" />
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-transparent text-xs text-secondary-100 outline-none flex-1 placeholder:text-secondary-300"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-[11px] font-semibold text-secondary-300 mb-1.5">
                  Email Address
                </label>
                <div className="flex items-center gap-2 bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)] rounded-sm px-3 py-2.5 opacity-60 cursor-not-allowed">
                  <Mail size={13} className="text-secondary-300 flex-shrink-0" />
                  <span className="text-xs text-secondary-300">{email}</span>
                </div>
                <p className="text-[10px] text-secondary-300 mt-1">Contact admin to change email</p>
              </div>

              {/* Role */}
              <div>
                <label className="block text-[11px] font-semibold text-secondary-300 mb-1.5">
                  Job Role
                </label>
                <div className="flex items-center gap-2 bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)] rounded-sm px-3 py-2.5 opacity-60 cursor-not-allowed">
                  <Shield size={13} className="text-secondary-300 flex-shrink-0" />
                  <span className="text-xs text-secondary-300">{role}</span>
                </div>
                <p className="text-[10px] text-secondary-300 mt-1">Assigned by system administrator</p>
              </div>

              {/* Department */}
              <div>
                <label className="block text-[11px] font-semibold text-secondary-300 mb-1.5">
                  Department
                </label>
                <div className="flex items-center gap-2 bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)] rounded-sm px-3 py-2.5 focus-within:border-secondary transition-all">
                  <Building2 size={13} className="text-secondary-300 flex-shrink-0" />
                  <input
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="bg-transparent text-xs text-secondary-100 outline-none flex-1"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Notification preferences */}
          <div className="audit-card overflow-hidden">
            <div className="px-5 py-4 border-b border-[rgba(255,255,255,0.04)] flex items-center gap-2">
              <Bell size={13} className="text-secondary-300" />
              <p className="text-[11px] font-semibold tracking-[0.08em] uppercase text-secondary-300">
                Notification Preferences
              </p>
            </div>
            <div className="divide-y divide-[rgba(255,255,255,0.04)]">
              {[
                { key: "samaAlerts", label: "SAMA Regulatory Alerts", desc: "New circulars, amendments, and policy updates" },
                { key: "evidenceReminders", label: "Evidence Reminders", desc: "Upcoming and overdue evidence deadlines" },
                { key: "approvalRequests", label: "Approval Requests", desc: "Evidence submitted for your review and approval" },
                { key: "taskAssignments", label: "Task Assignments", desc: "When a new task is assigned to you" },
                { key: "systemUpdates", label: "System Updates", desc: "Score changes and governance health reports" },
                { key: "weeklyDigest", label: "Weekly Digest", desc: "Summary of activity sent every Monday morning" },
              ].map(({ key, label, desc }) => (
                <div
                  key={key}
                  className="flex items-center justify-between px-5 py-3.5"
                >
                  <div>
                    <p className="text-xs font-medium text-secondary-100">{label}</p>
                    <p className="text-[10px] text-secondary-300 mt-0.5">{desc}</p>
                  </div>
                  <button
                    onClick={() => togglePref(key as keyof typeof notifPrefs)}
                    className={`relative w-9 h-5 rounded-full transition-all duration-200 flex-shrink-0 ${
                      notifPrefs[key as keyof typeof notifPrefs]
                        ? "bg-secondary"
                        : "bg-[rgba(255,255,255,0.1)]"
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all duration-200 ${
                        notifPrefs[key as keyof typeof notifPrefs] ? "left-[18px]" : "left-0.5"
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Security */}
          <div className="audit-card overflow-hidden">
            <div className="px-5 py-4 border-b border-[rgba(255,255,255,0.04)] flex items-center gap-2">
              <Key size={13} className="text-secondary-300" />
              <p className="text-[11px] font-semibold tracking-[0.08em] uppercase text-secondary-300">
                Security
              </p>
            </div>
            <div className="p-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-secondary-100">Password</p>
                <p className="text-[10px] text-secondary-300 mt-0.5">Last changed 45 days ago</p>
              </div>
              <button className="btn-outline-brand text-xs px-4 py-2">
                Change Password
              </button>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
