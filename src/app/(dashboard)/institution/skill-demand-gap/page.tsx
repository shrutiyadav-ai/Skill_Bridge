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
  TrendingUp,
  AlertTriangle,
  Flame,
  CheckCircle2,
  Download,
  Search,
  Filter,
  RefreshCw,
  Sparkles,
  BookOpen,
  ArrowRight,
  GraduationCap,
  Building2,
  ChevronRight,
} from "lucide-react";

interface SkillGapItem {
  id: string;
  skillName: string;
  category: string;
  demandIndex: number;
  supplyIndex: number;
  gap: number;
  netBalance: string;
  severity: "CRITICAL" | "MODERATE" | "BALANCED";
  severityLabel: string;
  severityBadge: "danger" | "warning" | "success";
  affectedStudentsCount: number;
  recommendedAction: string;
}

interface DepartmentGap {
  department: string;
  topGaps: { skill: string; gapPct: number }[];
  overallReadiness: number;
}

export default function SkillDemandGapPage() {
  const { data: session } = useSession();
  const [skillGaps, setSkillGaps] = useState<SkillGapItem[]>([]);
  const [departmentGaps, setDepartmentGaps] = useState<DepartmentGap[]>([]);
  const [summary, setSummary] = useState<any>({
    totalSkillsAnalyzed: 0,
    criticalGapsCount: 0,
    moderateGapsCount: 0,
    topDeficitSkill: "SQL",
    topDemandSkill: "Cloud Computing",
    macroAlignmentIndex: 73,
  });
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSeverity, setSelectedSeverity] = useState("ALL");
  const [exportSuccess, setExportSuccess] = useState(false);

  const fetchSkillGaps = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedSeverity !== "ALL") params.append("severity", selectedSeverity);

      const res = await fetch(`/api/institution/skill-gaps?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setSkillGaps(data.skillGaps || []);
        setDepartmentGaps(data.departmentGapBreakdown || []);
        setSummary(data.summary || {});
      }
    } catch (err) {
      console.error("Error fetching skill demand gaps:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSkillGaps();
  }, [selectedSeverity]);

  const filteredGaps = skillGaps.filter((s) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      s.skillName.toLowerCase().includes(q) ||
      s.category.toLowerCase().includes(q) ||
      s.recommendedAction.toLowerCase().includes(q)
    );
  });

  const handleExportReport = () => {
    if (filteredGaps.length === 0) return;

    const headers = ["Skill Name", "Category", "Industry Demand Index", "Student Supply Index", "Net Deficit", "Severity", "Recommended Curriculum Action"];
    const rows = filteredGaps.map((s) => [
      `"${s.skillName}"`,
      `"${s.category}"`,
      `${s.demandIndex}%`,
      `${s.supplyIndex}%`,
      `"${s.netBalance}"`,
      s.severity,
      `"${s.recommendedAction}"`,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `curriculum_skill_gap_report_${new Date().toISOString().slice(0, 10)}.csv`);
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
                Industry Skill Demand vs. Curriculum Gaps
              </h1>
              <Badge variant="primary" className="text-[10px]">
                Labor Market Intelligence
              </Badge>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Real-time diagnostic comparing active corporate recruitment requirements against verified student cohort competencies
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={fetchSkillGaps}
              disabled={isLoading}
              className="gap-1.5 text-xs text-slate-700 dark:text-slate-300"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} />
              Refresh Analytics
            </Button>
            <Button
              size="sm"
              onClick={handleExportReport}
              disabled={filteredGaps.length === 0}
              className="gap-1.5 bg-navy-800 dark:bg-blue-600 text-white text-xs"
            >
              <Download className="h-3.5 w-3.5" />
              {exportSuccess ? "Report Exported!" : "Export Gap Diagnostics"}
            </Button>
          </div>
        </div>

        {/* 4 Summary Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Card className="border-rose-200 dark:border-rose-900/50 bg-rose-50/20 dark:bg-rose-950/10">
            <CardContent className="p-5">
              <span className="text-xs font-semibold text-rose-700 dark:text-rose-400 uppercase tracking-wider flex items-center gap-1">
                <Flame className="h-3.5 w-3.5 text-rose-500" />
                Critical Skill Deficits
              </span>
              <div className="text-3xl font-extrabold text-rose-700 dark:text-rose-400 mt-1 font-mono">
                {summary.criticalGapsCount || 0}
              </div>
              <p className="text-[11px] text-rose-600 dark:text-rose-400 mt-2 font-medium">
                Gaps &gt; 25% vs industry benchmarks
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-5">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Top Deficit Competency
              </span>
              <div className="text-xl font-bold text-slate-900 dark:text-white mt-1 truncate">
                {summary.topDeficitSkill || "SQL"}
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2">
                Highest industry requirement deficit
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-5">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Macro Alignment Index
              </span>
              <div className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1 font-mono">
                {summary.macroAlignmentIndex || 73}%
              </div>
              <Progress value={summary.macroAlignmentIndex || 73} color="blue" className="mt-2.5" />
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2">
                Curriculum to industry match score
              </p>
            </CardContent>
          </Card>

          <Card className="border-emerald-200 dark:border-emerald-900/50 bg-emerald-50/20 dark:bg-emerald-950/10">
            <CardContent className="p-5">
              <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                Skills Evaluated
              </span>
              <div className="text-3xl font-extrabold text-emerald-700 dark:text-emerald-400 mt-1 font-mono">
                {summary.totalSkillsAnalyzed || 0}
              </div>
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-2">
                Across Technical, Domain & Aptitude
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Department Breakdown Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {departmentGaps.map((dept) => (
            <Card key={dept.department} className="border-slate-200 dark:border-slate-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-bold text-slate-900 dark:text-slate-100 line-clamp-1">
                  {dept.department}
                </CardTitle>
                <div className="flex justify-between items-center text-[11px] text-slate-500 mt-1">
                  <span>Cohort Readiness</span>
                  <span className="font-bold text-slate-900 dark:text-white">{dept.overallReadiness}%</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-2 pt-0">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Top Priority Gaps:
                </span>
                <div className="space-y-1.5">
                  {dept.topGaps.map((g) => (
                    <div key={g.skill} className="flex items-center justify-between text-xs p-1.5 rounded bg-slate-50 dark:bg-slate-850">
                      <span className="font-medium text-slate-800 dark:text-slate-200">{g.skill}</span>
                      <span className="text-rose-600 dark:text-rose-400 font-bold font-mono">-{g.gapPct}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* ═══════════════════════════════════════════════════════════════════════
            DEMAND VS SUPPLY COMPARISON MATRIX
        ══════════════════════════════════════════════════════════════════════════ */}
        <Card>
          <CardHeader className="space-y-3 pb-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <CardTitle className="text-base font-bold text-slate-900 dark:text-white">
                  Competency Gap Diagnostic Matrix ({filteredGaps.length})
                </CardTitle>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Quantified skill deficit = Industry Requirement Weight - Average Student Proficiency
                </p>
              </div>

              {/* Search Bar */}
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search skill or recommended action..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input-field pl-9 py-1.5 text-xs text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 w-full"
                />
              </div>
            </div>

            {/* Severity Filter Pills */}
            <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setSelectedSeverity("ALL")}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition ${
                  selectedSeverity === "ALL"
                    ? "bg-navy-800 dark:bg-blue-600 text-white"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                All Skills ({skillGaps.length})
              </button>
              <button
                onClick={() => setSelectedSeverity("CRITICAL")}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition flex items-center gap-1 ${
                  selectedSeverity === "CRITICAL"
                    ? "bg-rose-600 text-white"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                <Flame className="h-3 w-3 text-rose-500" />
                Critical Deficits ({summary.criticalGapsCount || 0})
              </button>
              <button
                onClick={() => setSelectedSeverity("MODERATE")}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition flex items-center gap-1 ${
                  selectedSeverity === "MODERATE"
                    ? "bg-amber-600 text-white"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                <AlertTriangle className="h-3 w-3 text-amber-500" />
                Moderate Gaps ({summary.moderateGapsCount || 0})
              </button>
              <button
                onClick={() => setSelectedSeverity("BALANCED")}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition flex items-center gap-1 ${
                  selectedSeverity === "BALANCED"
                    ? "bg-emerald-600 text-white"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                Balanced / Surplus
              </button>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            {isLoading ? (
              <div className="py-16 text-center text-slate-500">
                <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2 text-navy-800 dark:text-blue-400" />
                <p className="text-xs">Computing labor market gap analytics...</p>
              </div>
            ) : filteredGaps.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Skill Competency</th>
                      <th>Category</th>
                      <th>Industry Demand</th>
                      <th>Student Supply</th>
                      <th>Net Deficit</th>
                      <th>Severity</th>
                      <th>Recommended Curriculum Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredGaps.map((s) => (
                      <tr key={s.id}>
                        <td className="font-semibold text-slate-900 dark:text-slate-100">
                          {s.skillName}
                        </td>
                        <td>
                          <Badge variant="default" className="text-[10px]">
                            {s.category}
                          </Badge>
                        </td>
                        <td>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold text-slate-900 dark:text-white">
                              {s.demandIndex}%
                            </span>
                            <div className="w-16 bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                              <div className="bg-navy-700 dark:bg-blue-500 h-full rounded-full" style={{ width: `${s.demandIndex}%` }} />
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold text-slate-900 dark:text-white">
                              {s.supplyIndex}%
                            </span>
                            <div className="w-16 bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                              <div className="bg-emerald-600 dark:bg-emerald-400 h-full rounded-full" style={{ width: `${s.supplyIndex}%` }} />
                            </div>
                          </div>
                        </td>
                        <td>
                          <span
                            className={`font-mono text-xs font-bold px-2 py-0.5 rounded ${
                              s.gap >= 25
                                ? "text-rose-700 bg-rose-50 dark:bg-rose-950/60 dark:text-rose-300"
                                : s.gap > 0
                                ? "text-amber-700 bg-amber-50 dark:bg-amber-950/60 dark:text-amber-300"
                                : "text-emerald-700 bg-emerald-50 dark:bg-emerald-950/60 dark:text-emerald-300"
                            }`}
                          >
                            {s.netBalance}
                          </span>
                        </td>
                        <td>
                          <Badge variant={s.severityBadge} className="text-[10px]">
                            {s.severity === "CRITICAL" ? "Critical Deficit" : s.severity === "MODERATE" ? "Moderate Gap" : "Balanced"}
                          </Badge>
                        </td>
                        <td className="text-xs text-slate-600 dark:text-slate-300 max-w-sm">
                          {s.recommendedAction}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <EmptyState
                icon={<TrendingUp className="h-8 w-8 text-slate-400" />}
                title="No skills found"
                description="Try clearing your search query or severity filter."
                action={
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setSelectedSeverity("ALL");
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
