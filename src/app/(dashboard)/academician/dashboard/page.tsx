"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { MOCK_OPPORTUNITIES, MOCK_COLLABORATIONS } from "@/lib/mock-data";
import { formatDate } from "@/lib/utils";
import {
  BookOpen,
  Briefcase,
  Users,
  Network,
  CheckCircle2,
  Calendar,
  Building2,
  ExternalLink,
  Plus,
  ArrowRight,
  ChevronRight,
  Handshake,
  FileText,
} from "lucide-react";

export default function AcademicianDashboardPage() {
  const { data: session } = useSession();
  const userEmail = session?.user?.email?.toLowerCase() || "";
  const isDemoFaculty = userEmail === "dr.raghavan@iitd.ac.in";
  const academicianName = isDemoFaculty ? "Dr. S. Raghavan" : session?.user?.name || "Faculty Member";

  const facultyOpportunities = MOCK_OPPORTUNITIES.filter(
    (o) =>
      o.type === "FDP" ||
      o.type === "FACULTY_INTERNSHIP" ||
      o.type === "RESEARCH" ||
      o.type === "CONSULTANCY"
  );

  const [appliedOpps, setAppliedOpps] = useState<string[]>(
    isDemoFaculty ? ["80000000-0000-0000-0000-000000000017"] : []
  );

  const handleApplyFaculty = (id: string) => {
    setAppliedOpps((prev) => [...prev, id]);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-lg border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors duration-150">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                Faculty & Academician Portal
              </h1>
              <Badge variant="secondary">Faculty Member</Badge>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Welcome, {academicianName} • Industrial Training, FDPs & Joint Research
            </p>
          </div>

          <Link href="/academia/research-consultancy">
            <Button size="sm" className="gap-1.5 text-xs bg-navy-800 dark:bg-blue-600 text-white">
              <Plus className="h-4 w-4" />
              Propose Research Collaboration
            </Button>
          </Link>
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
                  Faculty Opportunities Module
                </CardTitle>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Discover sponsored FDP programs, technical workshops, and industrial faculty internships.
                </p>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center justify-between text-xs font-semibold text-navy-800 dark:text-blue-400 mt-1">
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
                  Research & Consultancy Module
                </CardTitle>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Participate in industry-sponsored research calls, funded grants, and expert corporate advisory.
                </p>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center justify-between text-xs font-semibold text-navy-800 dark:text-blue-400 mt-1">
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
                  Collaboration Module
                </CardTitle>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Join live student capstone mentoring, guest lecture series, and corporate innovation hackathons.
                </p>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center justify-between text-xs font-semibold text-navy-800 dark:text-blue-400 mt-1">
                  <span>Explore Partnerships</span>
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* 4 Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-5">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Active FDP Listings
              </span>
              <div className="text-3xl font-extrabold text-slate-900 dark:text-white mt-2 font-mono">
                {facultyOpportunities.filter((o) => o.type === "FDP").length}
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2">Faculty Development Programs</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-5">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Research Grants
              </span>
              <div className="text-3xl font-extrabold text-navy-800 dark:text-blue-400 mt-2 font-mono">
                {facultyOpportunities.filter((o) => o.type === "RESEARCH").length}
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2">Industry funded calls</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-5">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Faculty Internships
              </span>
              <div className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-2 font-mono">
                {facultyOpportunities.filter((o) => o.type === "FACULTY_INTERNSHIP").length}
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2">Industrial sabbaticals</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-5">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Active MoUs
              </span>
              <div className="text-3xl font-extrabold text-slate-900 dark:text-white mt-2 font-mono">
                {MOCK_COLLABORATIONS.length}
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2">Corporate partners</p>
            </CardContent>
          </Card>
        </div>

        {/* Featured Faculty Opportunities Table */}
        <Card>
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <div>
              <CardTitle>Featured Faculty Programs & Grants</CardTitle>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Programs open for faculty application, research collaboration, and consultancy
              </p>
            </div>
            <Link href="/academia/faculty-opportunities">
              <Button variant="ghost" size="sm" className="text-xs text-navy-800 dark:text-blue-400 gap-1">
                View All Programs
                <ChevronRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Opportunity Title</th>
                    <th>Type</th>
                    <th>Host Organization</th>
                    <th>Duration</th>
                    <th>Eligibility</th>
                    <th>Deadline</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {facultyOpportunities.map((opp) => {
                    const isApplied = appliedOpps.includes(opp.id);

                    return (
                      <tr key={opp.id}>
                        <td className="font-semibold text-slate-900 dark:text-slate-100">
                          {opp.title}
                        </td>
                        <td>
                          <Badge
                            variant={
                              opp.type === "FDP"
                                ? "primary"
                                : opp.type === "RESEARCH"
                                ? "success"
                                : "secondary"
                            }
                          >
                            {opp.type.replace("_", " ")}
                          </Badge>
                        </td>
                        <td className="text-slate-600 dark:text-slate-300">{opp.companyName}</td>
                        <td className="text-slate-600 dark:text-slate-300 text-xs font-mono">
                          {opp.duration}
                        </td>
                        <td className="text-slate-500 dark:text-slate-400 text-xs max-w-xs truncate">
                          {opp.eligibility}
                        </td>
                        <td className="text-slate-500 dark:text-slate-400 text-xs font-mono">
                          {formatDate(opp.deadline)}
                        </td>
                        <td>
                          <Button
                            size="sm"
                            disabled={isApplied}
                            onClick={() => handleApplyFaculty(opp.id)}
                            className={`text-xs ${
                              isApplied
                                ? "bg-emerald-600 text-white cursor-default"
                                : "bg-navy-800 dark:bg-blue-600 text-white"
                            }`}
                          >
                            {isApplied ? (
                              <>
                                <CheckCircle2 className="h-3 w-3 mr-1 inline" /> Applied
                              </>
                            ) : (
                              "Apply"
                            )}
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Active Industry Collaborations Table */}
        <Card id="collaborations">
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <div>
              <CardTitle>Industry-Academia Collaboration Initiatives</CardTitle>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Active joint research, student capstone mentorship, and guest lecture initiatives
              </p>
            </div>
            <Link href="/academia/collaboration">
              <Button variant="ghost" size="sm" className="text-xs text-navy-800 dark:text-blue-400 gap-1">
                Collaborations Hub
                <ChevronRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Initiative Title</th>
                    <th>Partner Company</th>
                    <th>Partner Institution</th>
                    <th>Type</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {MOCK_COLLABORATIONS.map((c) => (
                    <tr key={c.id}>
                      <td className="font-semibold text-slate-900 dark:text-slate-100">{c.title}</td>
                      <td className="text-slate-600 dark:text-slate-300">{c.companyName}</td>
                      <td className="text-slate-600 dark:text-slate-300 text-xs">{c.institutionName}</td>
                      <td>
                        <Badge variant="secondary">{c.type}</Badge>
                      </td>
                      <td>
                        <Badge variant="success">Active</Badge>
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
