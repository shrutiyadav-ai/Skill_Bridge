"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  ClipboardCheck,
  TrendingUp,
  Briefcase,
  FolderKanban,
  FileUser,
  Users,
  GraduationCap,
  Building2,
  BookOpen,
  Network,
  Sparkles,
  BarChart3,
  X,
  Compass,
  Handshake,
  User,
  Award,
} from "lucide-react";

import { Logo } from "@/components/brand/Logo";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const role = (session?.user as any)?.role || "STUDENT";

  const studentNavItems = [
    { label: "Dashboard", href: "/student/dashboard", icon: LayoutDashboard },
    { label: "Skill Vector & Matrix", href: "/student/skills", icon: TrendingUp },
    { label: "Assessment Engine", href: "/student/assessment", icon: ClipboardCheck },
    { label: "Career Path & Readiness", href: "/student/career", icon: Compass },
    { label: "Online Courses", href: "/student/courses", icon: BookOpen },
    { label: "Internships", href: "/student/internships", icon: Briefcase },
    { label: "Placements & Jobs", href: "/student/placements", icon: Award },
    { label: "Verified Digital Profile", href: "/student/profile", icon: User },
    { label: "Public Portfolio", href: "/student/portfolio", icon: FileUser },
    { label: "Applications", href: "/student/applications", icon: FolderKanban },
  ];

  const industryNavItems = [
    { label: "Dashboard", href: "/industry/dashboard", icon: LayoutDashboard },
    { label: "Post Opportunities", href: "/industry/opportunities/new", icon: Briefcase },
    { label: "Candidate Match Pool", href: "/industry/candidates", icon: Users },
    { label: "Institutional Partnerships", href: "/academia/collaboration", icon: Handshake },
    { label: "Company Profile", href: "/industry/profile", icon: Building2 },
  ];

  const institutionNavItems = [
    { label: "Dashboard", href: "/institution/dashboard", icon: LayoutDashboard },
    { label: "Student Readiness Index", href: "/institution/student-readiness", icon: GraduationCap },
    { label: "Skill Demand Gap Diagnostics", href: "/institution/skill-demand-gap", icon: BarChart3 },
    { label: "Industry Partners & MoUs", href: "/institution/industry-partners", icon: Handshake },
    { label: "Institutional Analytics", href: "/institution/analytics", icon: TrendingUp },
    { label: "Institution Profile", href: "/institution/profile", icon: Building2 },
  ];

  const academicianNavItems = [
    { label: "Dashboard", href: "/academician/dashboard", icon: LayoutDashboard },
    { label: "Faculty Opportunities", href: "/academician/faculty-opportunities", icon: Sparkles },
    { label: "Research & Consultancy", href: "/academician/research-consultancy", icon: BookOpen },
    { label: "Academia-Industry Collaboration", href: "/academician/collaboration", icon: Network },
    { label: "Faculty Analytics", href: "/academia/analytics", icon: TrendingUp },
    { label: "Academician Profile", href: "/academician/profile", icon: User },
  ];

  let navItems = studentNavItems;
  if (role === "INDUSTRY") navItems = industryNavItems;
  if (role === "INSTITUTION") navItems = institutionNavItems;
  if (role === "ACADEMICIAN") navItems = academicianNavItems;

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 z-40 lg:hidden backdrop-blur-xs"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          "fixed top-0 bottom-0 left-0 z-50 w-64 bg-slate-900 text-slate-100 flex flex-col border-r border-slate-800 transition-transform duration-200 ease-in-out lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Brand Header */}
        <div className="h-16 px-5 flex items-center justify-between border-b border-slate-800">
          <Link href="/" className="flex items-center gap-2.5 group">
            <Logo size="md" className="ring-1 ring-slate-700/80 shadow-xs group-hover:scale-105 transition-transform" />
            <div className="flex flex-col">
              <span className="font-bold text-white tracking-tight leading-none text-base">
                SkillBridge
              </span>
              <span className="text-[10px] text-slate-400 font-medium tracking-wide">
                Academia–Industry Portal
              </span>
            </div>
          </Link>
          <button
            onClick={onClose}
            className="lg:hidden text-slate-400 hover:text-white p-1 rounded-md"
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Role Badge Indicator */}
        <div className="px-6 py-3 bg-slate-950/60 border-b border-slate-800/80 flex items-center justify-between">
          <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
            Portal Mode
          </span>
          <span className="text-xs px-2 py-0.5 rounded font-medium bg-navy-900 text-slate-200 border border-navy-700">
            {role}
          </span>
        </div>

        {/* Navigation items */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href) && item.href !== "/opportunities");

            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => onClose()}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors duration-150",
                  isActive
                    ? "bg-navy-800 text-white shadow-xs font-semibold"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                )}
              >
                <Icon className={cn("h-4 w-4 shrink-0", isActive ? "text-white" : "text-slate-400")} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer info */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/40 text-xs text-slate-400">
          <div className="flex items-center gap-2 mb-1 text-slate-300 font-medium">
            <Sparkles className="h-3.5 w-3.5 text-amber-400 shrink-0" />
            <span>SkillBridge Enterprise</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-tight">
            Verified Skill Pathways & Placement Engine
          </p>
        </div>
      </aside>
    </>
  );
}
