"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Progress } from "@/components/ui/Progress";
import { MOCK_COLLABORATIONS } from "@/lib/mock-data";
import {
  GraduationCap,
  TrendingUp,
  Building2,
  Users,
  Download,
  BarChart3,
  CheckCircle2,
  AlertCircle,
  FileSpreadsheet,
  ArrowRight,
  ChevronRight,
  Flame,
  Briefcase,
} from "lucide-react";

export default function InstitutionDashboardPage() {
  const { data: session } = useSession();
  const userEmail = session?.user?.email?.toLowerCase() || "";
  const isDemoAdmin = userEmail === "admin@iitdelhi.ac.in";
  const institutionName = isDemoAdmin
    ? "Indian Institute of Technology, Delhi"
    : session?.user?.name || "Academic Institution";

  const skillGaps = [
    { skill: "SQL & Analytics", gapPct: 47, impact: "High", affectedStudents: 340 },
    { skill: "Cloud Architecture (AWS/Azure)", gapPct: 38, impact: "High", affectedStudents: 275 },
    { skill: "Data Structures & Algorithms", gapPct: 31, impact: "Medium", affectedStudents: 220 },
    { skill: "System Design & Microservices", gapPct: 29, impact: "Medium", affectedStudents: 210 },
    { skill: "Docker & Kubernetes (DevOps)", gapPct: 26, impact: "Medium", affectedStudents: 185 },
  ];

  const industryDemandVsSupply = [
    { skill: "Python", demand: 82, supply: 85, balance: "+3%" },
    { skill: "SQL", demand: 71, supply: 48, balance: "-23%" },
    { skill: "Cloud / AWS", demand: 64, supply: 42, balance: "-22%" },
    { skill: "Machine Learning", demand: 58, supply: 64, balance: "+6%" },
    { skill: "React / Frontend", demand: 55, supply: 72, balance: "+17%" },
  ];

  const departmentMetrics = [
    { dept: "Computer Science & Engg", students: 240, assessed: 228, readiness: 84, placedPct: 76 },
    { dept: "Information Technology", students: 180, assessed: 165, readiness: 80, placedPct: 71 },
    { dept: "Electronics & Communication", students: 210, assessed: 190, readiness: 73, placedPct: 62 },
    { dept: "Mechanical Engineering", students: 160, assessed: 135, readiness: 66, placedPct: 54 },
  ];

  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const handleExportReport = () => {
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-lg border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors duration-150">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                Institutional Analytics & Placement Readiness
              </h1>
              <Badge variant="secondary">Accredited Academic Partner</Badge>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {institutionName} • Real-time curriculum gap diagnostics & placement outcomes
            </p>
          </div>

          <Button
            size="sm"
            onClick={handleExportReport}
            className="gap-1.5 self-start md:self-auto bg-navy-800 dark:bg-blue-600 text-white text-xs"
          >
            <Download className="h-4 w-4" />
            {downloadSuccess ? "Report Exported!" : "Export Institutional Report"}
          </Button>
        </div>

        {/* 3 Core Module Jump Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Card 1: Student Readiness */}
          <Link href="/institution/student-readiness" className="block group">
            <Card className="h-full hover:border-navy-300 dark:hover:border-blue-700 transition shadow-xs">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="h-10 w-10 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                    <GraduationCap className="h-5 w-5" />
                  </div>
                  <Badge variant="success" className="text-[10px]">
                    76% Placement Ready
                  </Badge>
                </div>
                <CardTitle className="text-base font-bold mt-2 text-slate-900 dark:text-white group-hover:text-navy-800 dark:group-hover:text-blue-400 transition">
                  Student Readiness Module
                </CardTitle>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Detailed student vectors, assessment rates, and department-wise readiness metrics.
                </p>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center justify-between text-xs font-semibold text-navy-800 dark:text-blue-400 mt-1">
                  <span>Open Student Readiness</span>
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </CardContent>
            </Card>
          </Link>

          {/* Card 2: Skill Demand Gap */}
          <Link href="/institution/skill-demand-gap" className="block group">
            <Card className="h-full hover:border-navy-300 dark:hover:border-blue-700 transition shadow-xs">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="h-10 w-10 rounded-lg bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center">
                    <TrendingUp className="h-5 w-5" />
                  </div>
                  <Badge variant="danger" className="text-[10px] gap-1">
                    <Flame className="h-3 w-3" />
                    Action Required
                  </Badge>
                </div>
                <CardTitle className="text-base font-bold mt-2 text-slate-900 dark:text-white group-hover:text-navy-800 dark:group-hover:text-blue-400 transition">
                  Skill Demand Gap Module
                </CardTitle>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Compare real industry hiring requirements vs. student cohort capabilities.
                </p>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center justify-between text-xs font-semibold text-navy-800 dark:text-blue-400 mt-1">
                  <span>Open Skill Demand Gaps</span>
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </CardContent>
            </Card>
          </Link>

          {/* Card 3: Industry Partners */}
          <Link href="/institution/industry-partners" className="block group">
            <Card className="h-full hover:border-navy-300 dark:hover:border-blue-700 transition shadow-xs">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="h-10 w-10 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-navy-800 dark:text-blue-400 flex items-center justify-center">
                    <Building2 className="h-5 w-5" />
                  </div>
                  <Badge variant="primary" className="text-[10px]">
                    MoU Network
                  </Badge>
                </div>
                <CardTitle className="text-base font-bold mt-2 text-slate-900 dark:text-white group-hover:text-navy-800 dark:group-hover:text-blue-400 transition">
                  Industry Partners Module
                </CardTitle>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Manage active recruitment partners, placement drives, and institutional MoUs.
                </p>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center justify-between text-xs font-semibold text-navy-800 dark:text-blue-400 mt-1">
                  <span>Open Industry Partners</span>
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* 4 Overview Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-5">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Total Enrolled Cohort
              </span>
              <div className="text-3xl font-extrabold text-slate-900 dark:text-white mt-2 font-mono">
                790
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2">Across 4 core engineering departments</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-5">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Assessment Coverage
              </span>
              <div className="text-3xl font-extrabold text-navy-800 dark:text-blue-400 mt-2 font-mono">
                90.8%
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2">718 / 790 students vector verified</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-5">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Avg. Placement Readiness
              </span>
              <div className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-2 font-mono">
                75.8%
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2">+4.2% increase from previous semester</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-5">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Active Industry Partners
              </span>
              <div className="text-3xl font-extrabold text-slate-900 dark:text-white mt-2 font-mono">
                {MOCK_COLLABORATIONS.length}
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2">MoUs, hiring pipelines & FDPs</p>
            </CardContent>
          </Card>
        </div>

        {/* 2-Column Section: Skill Gaps vs Industry Supply/Demand */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" id="skill-gaps">
          {/* Identified Curriculum Gaps */}
          <Card>
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <div>
                <CardTitle>Priority Curriculum & Skill Gaps</CardTitle>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Competencies where student performance lags industry benchmarks
                </p>
              </div>
              <Link href="/institution/skill-demand-gap">
                <Button variant="ghost" size="sm" className="text-xs text-navy-800 dark:text-blue-400 gap-1">
                  Full Matrix
                  <ChevronRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Skill Competency</th>
                      <th>Cohort Gap</th>
                      <th>Impact</th>
                      <th>Affected Students</th>
                    </tr>
                  </thead>
                  <tbody>
                    {skillGaps.map((g) => (
                      <tr key={g.skill}>
                        <td className="font-semibold text-slate-900 dark:text-slate-100">{g.skill}</td>
                        <td>
                          <div className="flex items-center gap-2">
                            <Progress value={g.gapPct} color="rose" className="w-16" />
                            <span className="font-mono text-xs text-rose-600 dark:text-rose-400 font-bold">
                              -{g.gapPct}%
                            </span>
                          </div>
                        </td>
                        <td>
                          <Badge variant={g.impact === "High" ? "danger" : "warning"}>{g.impact}</Badge>
                        </td>
                        <td className="font-mono text-slate-700 dark:text-slate-300 text-xs">
                          {g.affectedStudents}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Industry Demand vs Cohort Supply */}
          <Card>
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <div>
                <CardTitle>Industry Demand vs. Cohort Supply</CardTitle>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Active recruitment demand vs. verified proficiency levels
                </p>
              </div>
              <Link href="/institution/skill-demand-gap">
                <Button variant="ghost" size="sm" className="text-xs text-navy-800 dark:text-blue-400 gap-1">
                  Explore Gaps
                  <ChevronRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Skill</th>
                      <th>Industry Demand</th>
                      <th>Cohort Supply</th>
                      <th>Net Balance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {industryDemandVsSupply.map((item) => (
                      <tr key={item.skill}>
                        <td className="font-semibold text-slate-900 dark:text-slate-100">{item.skill}</td>
                        <td>
                          <span className="font-mono text-xs font-bold text-slate-900 dark:text-white">
                            {item.demand}%
                          </span>
                        </td>
                        <td>
                          <span className="font-mono text-xs font-bold text-slate-900 dark:text-white">
                            {item.supply}%
                          </span>
                        </td>
                        <td>
                          <span
                            className={`font-mono text-xs font-bold ${
                              item.balance.startsWith("+")
                                ? "text-emerald-600 dark:text-emerald-400"
                                : "text-rose-600 dark:text-rose-400"
                            }`}
                          >
                            {item.balance}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Department-Wise Placement Readiness */}
        <Card id="readiness">
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <div>
              <CardTitle>Department-Wise Placement Readiness</CardTitle>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Cohort breakdown by academic department
              </p>
            </div>
            <Link href="/institution/student-readiness">
              <Button variant="ghost" size="sm" className="text-xs text-navy-800 dark:text-blue-400 gap-1">
                Student Roster
                <ChevronRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Department</th>
                    <th>Students</th>
                    <th>Assessed</th>
                    <th>Avg. Readiness</th>
                    <th>Placement Ready</th>
                  </tr>
                </thead>
                <tbody>
                  {departmentMetrics.map((dept) => (
                    <tr key={dept.dept}>
                      <td className="font-semibold text-slate-900 dark:text-slate-100">{dept.dept}</td>
                      <td className="font-mono text-xs">{dept.students}</td>
                      <td className="font-mono text-xs">{dept.assessed}</td>
                      <td>
                        <div className="flex items-center gap-2">
                          <Progress value={dept.readiness} color="emerald" className="w-20" />
                          <span className="font-mono text-xs font-bold text-slate-900 dark:text-white">
                            {dept.readiness}%
                          </span>
                        </div>
                      </td>
                      <td>
                        <span className="font-mono text-xs text-emerald-600 dark:text-emerald-400 font-bold">
                          {dept.placedPct}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Active Industry Collaborations & MoUs */}
        <Card id="collaborations">
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <div>
              <CardTitle>Active Industry Collaborations & MoUs</CardTitle>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Corporate partnerships for internships, placements, and live projects
              </p>
            </div>
            <Link href="/institution/industry-partners">
              <Button variant="ghost" size="sm" className="text-xs text-navy-800 dark:text-blue-400 gap-1">
                Partner Directory
                <ChevronRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Corporate Partner</th>
                    <th>Partnership Type</th>
                    <th>Collaboration Focus</th>
                    <th>Institution Partner</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {MOCK_COLLABORATIONS.map((c) => (
                    <tr key={c.id}>
                      <td className="font-semibold text-slate-900 dark:text-slate-100">{c.companyName}</td>
                      <td>
                        <Badge variant="secondary">{c.type}</Badge>
                      </td>
                      <td className="text-slate-600 dark:text-slate-300 text-xs">{c.title}</td>
                      <td className="text-slate-600 dark:text-slate-300 text-xs">{c.institutionName}</td>
                      <td>
                        <Badge variant="success">{c.status}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
