"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import {
  BookOpen,
  Briefcase,
  Users,
  Network,
  Download,
  ArrowRight,
  ChevronRight,
  Handshake,
  FileText,
  Sparkles,
  GraduationCap,
} from "lucide-react";

export default function AcademiaAnalyticsPage() {
  const { data: session } = useSession();
  const userEmail = session?.user?.email?.toLowerCase() || "";
  const isDemoFaculty = userEmail === "dr.raghavan@iitd.ac.in";
  const academicianName = isDemoFaculty
    ? "Dr. S. Raghavan"
    : session?.user?.name || "Faculty Member";

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
                Faculty & Academia Analytics Overview
              </h1>
              <Badge variant="primary">Academic Portal Hub</Badge>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Welcome, {academicianName} • Executive overview of faculty opportunities, research grants, and corporate collaborations
            </p>
          </div>

          <Button
            size="sm"
            onClick={handleExportReport}
            className="gap-1.5 self-start md:self-auto bg-navy-800 dark:bg-blue-600 text-white text-xs"
          >
            <Download className="h-4 w-4" />
            {downloadSuccess ? "Summary Exported!" : "Export Faculty Portfolio"}
          </Button>
        </div>

        {/* 3 Core Module Jump Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Card 1: Faculty Opportunities */}
          <Link href="/academia/faculty-opportunities" className="block group">
            <Card className="h-full hover:border-navy-300 dark:hover:border-blue-700 transition shadow-xs">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="h-10 w-10 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-navy-800 dark:text-blue-400 flex items-center justify-center">
                    <BookOpen className="h-5 w-5" />
                  </div>
                  <Badge variant="primary" className="text-[10px]">
                    FDP & Internships
                  </Badge>
                </div>
                <CardTitle className="text-base font-bold mt-2 text-slate-900 dark:text-white group-hover:text-navy-800 dark:group-hover:text-blue-400 transition">
                  Faculty Opportunities
                </CardTitle>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Discover sponsored FDP programs, technical workshops, and industrial faculty internships.
                </p>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center justify-between text-xs font-semibold text-navy-800 dark:text-blue-400 mt-2">
                  <span>Explore Faculty Programs</span>
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </CardContent>
            </Card>
          </Link>

          {/* Card 2: Research & Consultancy */}
          <Link href="/academia/research-consultancy" className="block group">
            <Card className="h-full hover:border-navy-300 dark:hover:border-blue-700 transition shadow-xs">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="h-10 w-10 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                    <Network className="h-5 w-5" />
                  </div>
                  <Badge variant="success" className="text-[10px]">
                    Grants & Consultancy
                  </Badge>
                </div>
                <CardTitle className="text-base font-bold mt-2 text-slate-900 dark:text-white group-hover:text-navy-800 dark:group-hover:text-blue-400 transition">
                  Research & Consultancy
                </CardTitle>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Participate in industry-sponsored research calls, funded grants, and expert corporate advisory.
                </p>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center justify-between text-xs font-semibold text-navy-800 dark:text-blue-400 mt-2">
                  <span>Explore R&D Calls</span>
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </CardContent>
            </Card>
          </Link>

          {/* Card 3: Collaboration */}
          <Link href="/academia/collaboration" className="block group">
            <Card className="h-full hover:border-navy-300 dark:hover:border-blue-700 transition shadow-xs">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="h-10 w-10 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 flex items-center justify-center">
                    <Handshake className="h-5 w-5" />
                  </div>
                  <Badge variant="warning" className="text-[10px]">
                    MoUs & Capstones
                  </Badge>
                </div>
                <CardTitle className="text-base font-bold mt-2 text-slate-900 dark:text-white group-hover:text-navy-800 dark:group-hover:text-blue-400 transition">
                  Academia–Industry Collaboration
                </CardTitle>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Join live student capstone mentoring, guest lecture series, and corporate innovation hackathons.
                </p>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center justify-between text-xs font-semibold text-navy-800 dark:text-blue-400 mt-2">
                  <span>Explore Partnerships</span>
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
                Active FDP Listings
              </span>
              <div className="text-3xl font-extrabold text-slate-900 dark:text-white mt-2 font-mono">
                12
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2">Sponsored by Infosys, TCS, Google</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-5">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Funded Research Grants
              </span>
              <div className="text-3xl font-extrabold text-navy-800 dark:text-blue-400 mt-2 font-mono">
                8 Calls
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2">AI, Cloud, and Fintech Security</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-5">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Faculty Internships
              </span>
              <div className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-2 font-mono">
                5 Openings
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2">4–8 week industrial immersion</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-5">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Active Corporate MoUs
              </span>
              <div className="text-3xl font-extrabold text-slate-900 dark:text-white mt-2 font-mono">
                14 Partners
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2">Live capstones & lecture series</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
