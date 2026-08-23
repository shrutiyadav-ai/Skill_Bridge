"use client";

import React, { useState } from "react";
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
            className="gap-1.5 self-start md:self-auto bg-navy-800 dark:bg-blue-600 text-white"
          >
            <Download className="h-4 w-4" />
            {downloadSuccess ? "Report Exported!" : "Export Institutional Report"}
          </Button>
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
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle>Priority Curriculum & Skill Gaps</CardTitle>
                <Badge variant="danger">Action Required</Badge>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Competencies where student cohort performance lags industry hiring benchmarks
              </p>
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
                    {skillGaps.map((gap) => (
                      <tr key={gap.skill}>
                        <td className="font-semibold text-slate-900 dark:text-slate-100">{gap.skill}</td>
                        <td>
                          <div className="flex items-center gap-2">
                            <div className="w-20 bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                              <div
                                className="bg-rose-600 h-full rounded-full"
                                style={{ width: `${gap.gapPct}%` }}
                              />
                            </div>
                            <span className="font-mono text-xs text-rose-600 dark:text-rose-400 font-bold">
                              {gap.gapPct}%
                            </span>
                          </div>
                        </td>
                        <td>
                          <Badge variant={gap.impact === "High" ? "danger" : "warning"}>
                            {gap.impact}
                          </Badge>
                        </td>
                        <td className="font-mono text-xs text-slate-600 dark:text-slate-400">
                          {gap.affectedStudents}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Industry Demand vs Student Supply */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle>Market Demand vs. Student Supply</CardTitle>
                <Badge variant="secondary">Quarterly Index</Badge>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Alignment between job opening volume and student competency vectors
              </p>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Skill Area</th>
                      <th>Market Demand</th>
                      <th>Student Supply</th>
                      <th>Net Balance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {industryDemandVsSupply.map((item) => (
                      <tr key={item.skill}>
                        <td className="font-semibold text-slate-900 dark:text-slate-100">{item.skill}</td>
                        <td className="font-mono text-xs text-slate-600 dark:text-slate-400">{item.demand}%</td>
                        <td className="font-mono text-xs text-slate-600 dark:text-slate-400">{item.supply}%</td>
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

        {/* Department-wise Readiness & Placement Breakdown */}
        <Card id="readiness">
          <CardHeader>
            <CardTitle>Department-Level Assessment & Placement Metrics</CardTitle>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Comparative view of cohort size, evaluation compliance, and career readiness scores
            </p>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Department / Program</th>
                    <th>Total Students</th>
                    <th>Assessed</th>
                    <th>Avg. Readiness</th>
                    <th>Placed / Selected</th>
                  </tr>
                </thead>
                <tbody>
                  {departmentMetrics.map((dept) => (
                    <tr key={dept.dept}>
                      <td className="font-semibold text-slate-900 dark:text-slate-100">{dept.dept}</td>
                      <td className="font-mono text-xs text-slate-600 dark:text-slate-400">{dept.students}</td>
                      <td>
                        <span className="font-mono text-xs font-semibold text-slate-900 dark:text-slate-100">
                          {dept.assessed} ({Math.round((dept.assessed / dept.students) * 100)}%)
                        </span>
                      </td>
                      <td>
                        <div className="flex items-center gap-2">
                          <Progress value={dept.readiness} color="emerald" className="w-24" />
                          <span className="font-mono text-xs font-bold text-slate-800 dark:text-slate-200">
                            {dept.readiness}%
                          </span>
                        </div>
                      </td>
                      <td>
                        <span className="font-mono text-xs font-bold text-navy-800 dark:text-blue-400">
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
      </div>
    </DashboardLayout>
  );
}
