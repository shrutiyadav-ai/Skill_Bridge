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

          <Link href="/opportunities?type=RESEARCH">
            <Button size="sm" className="gap-1.5 text-xs bg-navy-800 dark:bg-blue-600 text-white">
              <Plus className="h-4 w-4" />
              Propose Research Collaboration
            </Button>
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
              <div className="text-3xl font-extrabold text-slate-900 dark:text-white mt-2 font-mono">
                {facultyOpportunities.filter((o) => o.type === "FACULTY_INTERNSHIP").length}
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2">Industry immersion programs</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-5">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                My Applications
              </span>
              <div className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-2 font-mono">
                {appliedOpps.length}
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2">Submitted proposals</p>
            </CardContent>
          </Card>
        </div>

        {/* 2-Column Section: Faculty Opportunities & Active Industry Collaborations */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Opportunities (2 cols) */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <div>
                  <CardTitle>Faculty Opportunities & Research Calls</CardTitle>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Explore enterprise sponsored FDPs, sabbaticals, and joint R&D projects
                  </p>
                </div>
                <Link href="/opportunities?type=FDP">
                  <Button variant="ghost" size="sm" className="text-xs text-navy-800 dark:text-blue-400">
                    Explore All
                  </Button>
                </Link>
              </CardHeader>
              <CardContent className="space-y-4">
                {facultyOpportunities.map((opp) => {
                  const isApplied = appliedOpps.includes(opp.id);
                  return (
                    <div
                      key={opp.id}
                      className="p-4 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="font-bold text-sm text-slate-900 dark:text-white">{opp.title}</h4>
                          <Badge variant="secondary">{opp.type}</Badge>
                          {opp.remote && <Badge variant="outline">Remote</Badge>}
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                          {opp.companyName} • {opp.location} • Deadline: {formatDate(opp.deadline)}
                        </p>
                        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-2">
                          {opp.description}
                        </p>
                      </div>

                      <div className="shrink-0 self-end sm:self-center">
                        {isApplied ? (
                          <Badge variant="success" className="gap-1">
                            <CheckCircle2 className="h-3 w-3" />
                            Applied
                          </Badge>
                        ) : (
                          <Button
                            size="sm"
                            onClick={() => handleApplyFaculty(opp.id)}
                            className="text-xs bg-navy-800 dark:bg-blue-600 text-white"
                          >
                            Apply / Register
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </div>

          {/* Active Industry Collaborations (1 col) */}
          <div className="space-y-6" id="collaborations">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Industry Partnerships</CardTitle>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Active MoUs & joint initiatives</p>
              </CardHeader>
              <CardContent className="space-y-3">
                {MOCK_COLLABORATIONS.map((collab) => (
                  <div
                    key={collab.id}
                    className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850/50 space-y-2 text-xs"
                  >
                    <div className="flex justify-between items-start">
                      <span className="font-bold text-slate-900 dark:text-white">{collab.companyName}</span>
                      <Badge variant="success">{collab.status}</Badge>
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 text-[11px] leading-snug">{collab.title}</p>
                    <div className="text-[10px] text-slate-400 font-mono">Scope: {collab.type}</div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
