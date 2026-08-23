"use client";

import React, { useState } from "react";
import { useSession, signOut, signIn } from "next-auth/react";
import Link from "next/link";
import { Menu, Bell, LogOut, Sparkles, ChevronDown } from "lucide-react";
import { MOCK_NOTIFICATIONS } from "@/lib/mock-data";
import { getRelativeTime } from "@/lib/utils";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

interface TopNavProps {
  onMenuClick: () => void;
}

export function TopNav({ onMenuClick }: TopNavProps) {
  const { data: session } = useSession();
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const [showRoleSwitcher, setShowRoleSwitcher] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleQuickRoleSwitch = async (email: string) => {
    const res = await signIn("credentials", {
      redirect: false,
      email,
      password: "SkillBridge@2024",
    });
    if (res?.ok) {
      const { getSession } = await import("next-auth/react");
      const { getRoleDashboardPath } = await import("@/lib/auth");
      const sess = await getSession();
      const destination = getRoleDashboardPath((sess?.user as any)?.role);
      window.location.href = destination;
    }
  };

  const user = session?.user;
  const userRole = (user as any)?.role || "STUDENT";

  return (
    <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 shadow-2xs transition-colors duration-150">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-md text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none"
          aria-label="Open navigation menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="hidden sm:flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Enterprise Portal
          </span>
          <span className="text-slate-300 dark:text-slate-700">•</span>
          <span className="text-xs font-medium text-navy-800 dark:text-blue-300 bg-navy-50 dark:bg-navy-950/80 px-2 py-0.5 rounded border border-navy-100 dark:border-blue-900/60">
            {userRole} Workspace
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        {/* Light / Dark Mode Toggle */}
        <ThemeToggle />

        {/* Demo Fast Role Switcher */}
        <div className="relative">
          <button
            onClick={() => {
              setShowRoleSwitcher(!showRoleSwitcher);
              setShowNotifications(false);
            }}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-md border border-slate-200 dark:border-slate-700 transition"
            title="Switch demo persona"
          >
            <Sparkles className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
            <span className="hidden md:inline">Switch Role</span>
            <ChevronDown className="h-3 w-3 text-slate-400" />
          </button>

          {showRoleSwitcher && (
            <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-slate-900 rounded-lg shadow-lg border border-slate-200 dark:border-slate-800 py-2 z-50 text-xs">
              <div className="px-3 py-1.5 border-b border-slate-100 dark:border-slate-800 font-semibold text-slate-700 dark:text-slate-300">
                Switch Workspace Persona
              </div>
              <button
                onClick={() => handleQuickRoleSwitch("aditya.sharma@iitd.ac.in")}
                className="w-full text-left px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 flex flex-col"
              >
                <span className="font-medium text-slate-900 dark:text-slate-100">Student: Aditya Sharma</span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">ML Track (IIT Delhi)</span>
              </button>
              <button
                onClick={() => handleQuickRoleSwitch("hr@flipkart.com")}
                className="w-full text-left px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 flex flex-col"
              >
                <span className="font-medium text-slate-900 dark:text-slate-100">Industry: Flipkart HR</span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">Postings & Candidate Matching</span>
              </button>
              <button
                onClick={() => handleQuickRoleSwitch("admin@iitdelhi.ac.in")}
                className="w-full text-left px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 flex flex-col"
              >
                <span className="font-medium text-slate-900 dark:text-slate-100">Institution: IIT Delhi Admin</span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">Readiness & Skill Gap Analytics</span>
              </button>
              <button
                onClick={() => handleQuickRoleSwitch("dr.raghavan@iitd.ac.in")}
                className="w-full text-left px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 flex flex-col"
              >
                <span className="font-medium text-slate-900 dark:text-slate-100">Academician: Dr. S. Raghavan</span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">FDPs, Research & Consultancy</span>
              </button>
            </div>
          )}
        </div>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowRoleSwitcher(false);
            }}
            className="relative p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            aria-label="View notifications"
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 h-4 w-4 bg-rose-600 text-white rounded-full text-[10px] font-bold flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-slate-900 rounded-lg shadow-xl border border-slate-200 dark:border-slate-800 py-2 z-50">
              <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div className="font-semibold text-xs text-slate-800 dark:text-slate-200">
                  Notifications ({unreadCount} unread)
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllRead}
                    className="text-[11px] text-navy-700 dark:text-blue-400 hover:text-navy-900 dark:hover:text-blue-300 font-medium"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
                {notifications.length === 0 ? (
                  <div className="p-4 text-center text-xs text-slate-400">No notifications</div>
                ) : (
                  notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={`p-3 text-xs hover:bg-slate-50 dark:hover:bg-slate-800/60 transition flex gap-2.5 ${
                        !notif.read ? "bg-slate-50/70 dark:bg-slate-850/70" : ""
                      }`}
                    >
                      <div className="h-2 w-2 rounded-full bg-navy-600 dark:bg-blue-500 mt-1.5 shrink-0" />
                      <div className="flex-1">
                        <p className="font-semibold text-slate-800 dark:text-slate-200">{notif.title}</p>
                        <p className="text-slate-600 dark:text-slate-400 text-[11px] mt-0.5 leading-snug">{notif.message}</p>
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 block">
                          {getRelativeTime(notif.createdAt)}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User profile & sign out */}
        <div className="flex items-center gap-3 pl-2 border-l border-slate-200 dark:border-slate-800">
          <Link
            href="/profile"
            className="flex items-center gap-2 hover:opacity-80 transition cursor-pointer"
            title="View & Edit Profile"
          >
            <div className="h-8 w-8 rounded-full bg-navy-100 dark:bg-navy-900 border border-navy-200 dark:border-slate-700 flex items-center justify-center text-navy-800 dark:text-blue-300 font-semibold text-xs overflow-hidden">
              {user?.name ? user.name.slice(0, 2).toUpperCase() : "SB"}
            </div>
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-xs font-semibold text-slate-900 dark:text-slate-100 leading-none hover:text-navy-600 dark:hover:text-blue-400">
                {user?.name || "Demo User"}
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-none">
                {user?.email || "aditya.sharma@iitd.ac.in"}
              </span>
            </div>
          </Link>

          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            title="Sign Out"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
