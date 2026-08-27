"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Progress } from "@/components/ui/Progress";
import {
  GraduationCap,
  TrendingUp,
  Building2,
  Users,
  Download,
  BarChart3,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ChevronRight,
  Briefcase,
  Flame,
} from "lucide-react";

export default function InstitutionAnalyticsPage() {
  const { data: session } = useSession();
  const userEmail = session?.user?.email?.toLowerCase() || "";
  const isDemoAdmin = userEmail === "admin@iitdelhi.ac.in";
  const institutionName = isDemoAdmin
    ? "Indian Institute of Technology, Delhi"
    : session?.user?.name || "Academic Institution";

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
                Institutional Analytics Overview
              </h1>
              <Badge variant="primary">Macro Analytics Hub</Badge>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {institutionName} • Executive overview of student placement readiness, labor market skill gaps, and industry partnerships
            </p>
          </div>

          <Button
            size="sm"
            onClick={handleExportReport}
            className="gap-1.5 self-start md:self-auto bg-navy-800 dark:bg-blue-600 text-white text-xs"
          >
            <Download className="h-4 w-4" />
            {downloadSuccess ? "Report Exported!" : "Export Executive Summary"}
          </Button>
        </div>

        {/* 3 Core Module Gateway Cards */}
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
                    76% Avg Readiness
                  </Badge>
                </div>
                <CardTitle className="text-base font-bold mt-2 text-slate-900 dark:text-white group-hover:text-navy-800 dark:group-hover:text-blue-400 transition">
                  Student Readiness Module
                </CardTitle>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Track individual student vectors, assessment completions, and department placement readiness.
                </p>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center justify-between text-xs font-semibold text-navy-800 dark:text-blue-400 mt-2">
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
                    Critical Gaps
                  </Badge>
                </div>
                <CardTitle className="text-base font-bold mt-2 text-slate-900 dark:text-white group-hover:text-navy-800 dark:group-hover:text-blue-400 transition">
                  Skill Demand Gap Module
                </CardTitle>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Compare real industry hiring requirements vs. student cohort skills to target curriculum interventions.
                </p>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center justify-between text-xs font-semibold text-navy-800 dark:text-blue-400 mt-2">
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
                  Manage active recruitment partners, placement drives, institutional MoUs, and corporate relations.
                </p>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center justify-between text-xs font-semibold text-navy-800 dark:text-blue-400 mt-2">
                  <span>Open Industry Partners</span>
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* 4 Macro KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-5">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Total Enrolled Cohort
              </span>
              <div className="text-3xl font-extrabold text-slate-900 dark:text-white mt-2 font-mono">
                790
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2">Across 4 core academic departments</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-5">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Cohort Readiness Rate
              </span>
              <div className="text-3xl font-extrabold text-slate-900 dark:text-white mt-2 font-mono">
                76.4%
              </div>
              <Progress value={76.4} color="emerald" className="mt-2.5" />
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2">Placement qualification threshold: 70%</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-5">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Identified Skill Deficits
              </span>
              <div className="text-3xl font-extrabold text-rose-600 dark:text-rose-400 mt-2 font-mono">
                5 Critical
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2">Highest gap in SQL & Cloud Architecture</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-5">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Active Industry MoUs
              </span>
              <div className="text-3xl font-extrabold text-navy-800 dark:text-blue-400 mt-2 font-mono">
                12 Partners
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2">Active hiring & live project channels</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
