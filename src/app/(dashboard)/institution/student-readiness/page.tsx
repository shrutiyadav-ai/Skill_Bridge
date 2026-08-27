"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Progress } from "@/components/ui/Progress";
import { EmptyState } from "@/components/ui/EmptyState";
import {
  GraduationCap,
  Users,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Download,
  Search,
  Filter,
  RefreshCw,
  ChevronRight,
  ShieldCheck,
  Award,
  ArrowUpDown,
  BookOpen,
} from "lucide-react";

interface StudentRosterItem {
  id: string;
  name: string;
  email: string;
  course: string;
  department: string;
  year: number;
  semester: number;
  cgpa: number;
  totalSkills: number;
  verifiedSkills: number;
  readinessScore: number;
  readinessTier: "READY" | "DEVELOPING" | "FOUNDATIONAL";
  hasAssessment: boolean;
  placementStatus: string;
}

interface DepartmentStat {
  department: string;
  studentsCount: number;
  assessedCount: number;
  readyCount: number;
  averageReadiness: number;
  placementReadyPercentage: number;
}

export default function StudentReadinessPage() {
  const { data: session } = useSession();
  const [roster, setRoster] = useState<StudentRosterItem[]>([]);
  const [departmentStats, setDepartmentStats] = useState<DepartmentStat[]>([]);
  const [summary, setSummary] = useState<any>({
    totalStudents: 0,
    assessedCount: 0,
    assessmentCompletionRate: 0,
    averageReadiness: 0,
    readyCount: 0,
    developingCount: 0,
    foundationalCount: 0,
    readyPercentage: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDept, setSelectedDept] = useState("ALL");
  const [selectedTier, setSelectedTier] = useState("ALL");
  const [selectedBatch, setSelectedBatch] = useState("ALL");
  const [exportSuccess, setExportSuccess] = useState(false);

  const fetchReadinessData = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedDept !== "ALL") params.append("department", selectedDept);
      if (selectedTier !== "ALL") params.append("tier", selectedTier);
      if (selectedBatch !== "ALL") params.append("batch", selectedBatch);

      const res = await fetch(`/api/institution/readiness?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setRoster(data.roster || []);
        setDepartmentStats(data.departmentStats || []);
        setSummary(data.summary || {});
      }
    } catch (err) {
      console.error("Error fetching student readiness data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReadinessData();
  }, [selectedDept, selectedTier, selectedBatch]);

  // Client-side search filtering
  const filteredRoster = roster.filter((s) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      s.name.toLowerCase().includes(q) ||
      s.email.toLowerCase().includes(q) ||
      s.department.toLowerCase().includes(q) ||
      s.course.toLowerCase().includes(q)
    );
  });

  const handleExportCSV = () => {
    if (filteredRoster.length === 0) return;

    const headers = ["Name", "Email", "Degree", "Department", "Year", "Verified Skills", "Readiness %", "Tier", "Placement Status"];
    const rows = filteredRoster.map((s) => [
      `"${s.name}"`,
      `"${s.email}"`,
      `"${s.course}"`,
      `"${s.department}"`,
      s.year,
      s.verifiedSkills,
      `${s.readinessScore}%`,
      s.readinessTier,
      s.placementStatus,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `student_readiness_report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setExportSuccess(true);
    setTimeout(() => setExportSuccess(false), 3000);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Top Header */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-lg border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors duration-150">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                Student Cohort Placement Readiness
              </h1>
              <Badge variant="primary" className="text-[10px]">
                Live Vector Analytics
              </Badge>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Detailed tracking of student competency scores, assessment completion, and placement readiness across all departments
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={fetchReadinessData}
              disabled={isLoading}
              className="gap-1.5 text-xs text-slate-700 dark:text-slate-300"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Button
              size="sm"
              onClick={handleExportCSV}
              disabled={filteredRoster.length === 0}
              className="gap-1.5 bg-navy-800 dark:bg-blue-600 text-white text-xs"
            >
              <Download className="h-3.5 w-3.5" />
              {exportSuccess ? "CSV Exported!" : "Export Readiness Sheet"}
            </Button>
          </div>
        </div>

        {/* 4 Summary Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-5">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Average Cohort Readiness
              </span>
              <div className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1 font-mono">
                {summary.averageReadiness || 0}%
              </div>
              <Progress value={summary.averageReadiness || 0} color="emerald" className="mt-2.5" />
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2">
                Industry Benchmark: 70% threshold
              </p>
            </CardContent>
          </Card>

          <Card className="border-emerald-200 dark:border-emerald-900/50 bg-emerald-50/20 dark:bg-emerald-950/10">
            <CardContent className="p-5">
              <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                Placement Ready (≥70%)
              </span>
              <div className="text-3xl font-extrabold text-emerald-700 dark:text-emerald-400 mt-1 font-mono">
                {summary.readyCount || 0}
              </div>
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-2 font-medium">
                {summary.readyPercentage || 0}% of enrolled cohort
              </p>
            </CardContent>
          </Card>

          <Card className="border-amber-200 dark:border-amber-900/50 bg-amber-50/20 dark:bg-amber-950/10">
            <CardContent className="p-5">
              <span className="text-xs font-semibold text-amber-700 dark:text-amber-400 uppercase tracking-wider flex items-center gap-1">
                <AlertCircle className="h-3.5 w-3.5 text-amber-500" />
                Developing (50–69%)
              </span>
              <div className="text-3xl font-extrabold text-amber-700 dark:text-amber-400 mt-1 font-mono">
                {summary.developingCount || 0}
              </div>
              <p className="text-[11px] text-amber-600 dark:text-amber-400 mt-2">
                Need minor targeted upskilling
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-5">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Assessment Completion
              </span>
              <div className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1 font-mono">
                {summary.assessmentCompletionRate || 0}%
              </div>
              <Progress value={summary.assessmentCompletionRate || 0} color="blue" className="mt-2.5" />
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2">
                {summary.assessedCount || 0} of {summary.totalStudents || 0} students evaluated
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Department-Wise Readiness Overview */}
        <Card>
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base font-bold text-slate-900 dark:text-white">
                Department-Wise Placement Readiness
              </CardTitle>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Comparative readiness performance across academic disciplines
              </p>
            </div>
            <Link href="/institution/skill-demand-gap">
              <Button variant="ghost" size="sm" className="text-xs text-navy-800 dark:text-blue-400 gap-1">
                View Skill Gaps
                <ChevronRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </CardHeader>

          <CardContent className="space-y-4">
            {departmentStats.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {departmentStats.map((dept) => (
                  <div
                    key={dept.department}
                    className="p-4 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850/50 space-y-2.5"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold text-xs sm:text-sm text-slate-900 dark:text-slate-100">
                          {dept.department}
                        </h4>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                          {dept.assessedCount} assessed / {dept.studentsCount} enrolled
                        </p>
                      </div>
                      <Badge
                        variant={dept.averageReadiness >= 75 ? "success" : dept.averageReadiness >= 65 ? "warning" : "danger"}
                        className="text-[10px]"
                      >
                        {dept.averageReadiness}% Avg Score
                      </Badge>
                    </div>

                    <div>
                      <div className="flex justify-between text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                        <span>Placement Ready Rate</span>
                        <span className="font-bold text-slate-900 dark:text-white">{dept.placementReadyPercentage}%</span>
                      </div>
                      <Progress value={dept.placementReadyPercentage} color="emerald" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 py-4 text-center">No department statistics available</p>
            )}
          </CardContent>
        </Card>

        {/* ═══════════════════════════════════════════════════════════════════════
            STUDENT READINESS ROSTER (SEARCHABLE & FILTERABLE)
        ══════════════════════════════════════════════════════════════════════════ */}
        <Card>
          <CardHeader className="space-y-3 pb-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <CardTitle className="text-base font-bold text-slate-900 dark:text-white">
                  Student Readiness Roster ({filteredRoster.length})
                </CardTitle>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Real-time verified skill vectors, GPA, and placement status of all enrolled students
                </p>
              </div>

              {/* Search Bar */}
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search student name, email, or department..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input-field pl-9 py-1.5 text-xs text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 w-full"
                />
              </div>
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <select
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
                className="input-field py-1 text-xs text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700"
              >
                <option value="ALL">All Departments</option>
                <option value="Computer Science & Engineering">Computer Science & Engineering</option>
                <option value="Artificial Intelligence & Machine Learning">AI & Machine Learning</option>
                <option value="Accounting & Finance">Accounting & Finance</option>
                <option value="Mechanical Engineering">Mechanical Engineering</option>
                <option value="Civil Engineering">Civil Engineering</option>
              </select>

              <select
                value={selectedTier}
                onChange={(e) => setSelectedTier(e.target.value)}
                className="input-field py-1 text-xs text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700"
              >
                <option value="ALL">All Readiness Tiers</option>
                <option value="READY">Placement Ready (≥70%)</option>
                <option value="DEVELOPING">Developing (50–69%)</option>
                <option value="FOUNDATIONAL">Foundational (&lt;50%)</option>
              </select>

              <select
                value={selectedBatch}
                onChange={(e) => setSelectedBatch(e.target.value)}
                className="input-field py-1 text-xs text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700"
              >
                <option value="ALL">All Batches / Years</option>
                <option value="1">1st Year</option>
                <option value="2">2nd Year</option>
                <option value="3">3rd Year</option>
                <option value="4">4th Year (Graduating)</option>
              </select>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            {isLoading ? (
              <div className="py-16 text-center text-slate-500">
                <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2 text-navy-800 dark:text-blue-400" />
                <p className="text-xs">Loading student cohort data...</p>
              </div>
            ) : filteredRoster.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Student Name</th>
                      <th>Degree & Dept</th>
                      <th>Year / Sem</th>
                      <th>Verified Skills</th>
                      <th>Readiness Index</th>
                      <th>Placement Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRoster.map((s) => (
                      <tr key={s.id}>
                        <td>
                          <div className="flex flex-col">
                            <span className="font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-1">
                              {s.name}
                              {s.hasAssessment && (
                                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                              )}
                            </span>
                            <span className="text-[11px] text-slate-500 dark:text-slate-400">{s.email}</span>
                          </div>
                        </td>
                        <td>
                          <div className="flex flex-col">
                            <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">{s.course}</span>
                            <span className="text-[11px] text-slate-500 dark:text-slate-400">{s.department}</span>
                          </div>
                        </td>
                        <td className="font-mono text-xs text-slate-700 dark:text-slate-300">
                          Year {s.year} • Sem {s.semester}
                        </td>
                        <td>
                          <Badge variant="outline" className="text-[10px] font-mono">
                            {s.verifiedSkills} Skills Verified
                          </Badge>
                        </td>
                        <td>
                          <div className="flex items-center gap-2">
                            <div className="w-20 bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full ${
                                  s.readinessScore >= 70
                                    ? "bg-emerald-600 dark:bg-emerald-400"
                                    : s.readinessScore >= 50
                                    ? "bg-amber-500 dark:bg-amber-400"
                                    : "bg-rose-500 dark:bg-rose-400"
                                }`}
                                style={{ width: `${s.readinessScore}%` }}
                              />
                            </div>
                            <span className="font-mono text-xs font-bold text-slate-900 dark:text-white">
                              {s.readinessScore}%
                            </span>
                            <Badge
                              variant={s.readinessTier === "READY" ? "success" : s.readinessTier === "DEVELOPING" ? "warning" : "danger"}
                              className="text-[9px] ml-1"
                            >
                              {s.readinessTier === "READY" ? "Ready" : s.readinessTier === "DEVELOPING" ? "Developing" : "Foundational"}
                            </Badge>
                          </div>
                        </td>
                        <td>
                          <span
                            className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                              s.placementStatus === "Placed"
                                ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                                : s.placementStatus === "Interviewing"
                                ? "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300"
                                : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                            }`}
                          >
                            {s.placementStatus}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <EmptyState
                icon={<Users className="h-8 w-8 text-slate-400" />}
                title="No students match the current filters"
                description="Try clearing your department or readiness tier filters."
                action={
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setSelectedDept("ALL");
                      setSelectedTier("ALL");
                      setSelectedBatch("ALL");
                      setSearchQuery("");
                    }}
                  >
                    Reset Filters
                  </Button>
                }
              />
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
