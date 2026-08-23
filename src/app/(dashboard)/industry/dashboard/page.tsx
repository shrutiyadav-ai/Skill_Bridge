"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { MOCK_OPPORTUNITIES, MOCK_APPLICATIONS } from "@/lib/mock-data";
import { formatCurrency, formatDate, getStatusBadge } from "@/lib/utils";
import {
  Briefcase,
  Users,
  CheckCircle2,
  Calendar,
  Plus,
  ArrowRight,
  TrendingUp,
  Building2,
  FileCheck,
  FolderPlus,
} from "lucide-react";

export default function IndustryDashboardPage() {
  const { data: session } = useSession();
  const userEmail = session?.user?.email?.toLowerCase() || "";
  const isDemoIndustry = userEmail === "hr@flipkart.com";
  const companyName = isDemoIndustry ? "Flipkart" : session?.user?.name || "Corporate Workspace";

  const defaultDemoPostings = MOCK_OPPORTUNITIES.filter(
    (o) => o.companyName.toLowerCase() === "flipkart"
  );

  const [opportunities, setOpportunities] = useState(isDemoIndustry ? defaultDemoPostings : []);
  const [applications, setApplications] = useState(isDemoIndustry ? MOCK_APPLICATIONS : []);

  useEffect(() => {
    if (!isDemoIndustry && userEmail) {
      const storedPostings = localStorage.getItem(`postings_${userEmail}`);
      if (storedPostings) {
        try {
          setOpportunities(JSON.parse(storedPostings));
        } catch (e) {}
      }
      const storedApps = localStorage.getItem(`industry_apps_${userEmail}`);
      if (storedApps) {
        try {
          setApplications(JSON.parse(storedApps));
        } catch (e) {}
      }
    }
  }, [isDemoIndustry, userEmail]);

  const handleUpdateStatus = (appId: string, newStatus: any) => {
    const updated = applications.map((a) => (a.id === appId ? { ...a, status: newStatus } : a));
    setApplications(updated);
    if (!isDemoIndustry && userEmail) {
      localStorage.setItem(`industry_apps_${userEmail}`, JSON.stringify(updated));
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome Header */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-lg border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors duration-150">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                {companyName} Industry Portal
              </h1>
              <Badge variant={isDemoIndustry ? "secondary" : "outline"}>
                {isDemoIndustry ? "Verified Enterprise Partner" : "Registered Employer"}
              </Badge>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Recruitment management, candidate matching, and university collaborative initiatives
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link href="/industry/opportunities/new">
              <Button size="sm" className="gap-1.5 bg-navy-800 dark:bg-blue-600 text-white">
                <Plus className="h-4 w-4" />
                Post Opportunity
              </Button>
            </Link>
            <Link href="/industry/candidates">
              <Button size="sm" variant="outline" className="gap-1.5">
                <Users className="h-4 w-4 text-navy-800 dark:text-blue-400" />
                Candidate Matching
              </Button>
            </Link>
          </div>
        </div>

        {/* 4 Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-5">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Active Listings
              </span>
              <div className="text-3xl font-extrabold text-slate-900 dark:text-white mt-2 font-mono">
                {opportunities.length}
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2">
                {opportunities.length > 0 ? "Internships & Full-Time" : "No active postings"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-5">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Total Applicants
              </span>
              <div className="text-3xl font-extrabold text-slate-900 dark:text-white mt-2 font-mono">
                {applications.length}
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2">Candidate submissions</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-5">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Shortlisted
              </span>
              <div className="text-3xl font-extrabold text-slate-900 dark:text-white mt-2 font-mono text-emerald-600 dark:text-emerald-400">
                {applications.filter((a) => a.status === "SHORTLISTED" || a.status === "INTERVIEW" || a.status === "SELECTED").length}
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2">Passed initial review</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-5">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Avg. Candidate Vector
              </span>
              <div className="text-3xl font-extrabold text-navy-800 dark:text-blue-400 mt-2 font-mono">
                {applications.length > 0 ? "88%" : "0%"}
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2">Compatibility with posted requirements</p>
            </CardContent>
          </Card>
        </div>

        {/* 2-Column Section: Active Postings & Applicant Review */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Active Postings (1 col) */}
          <div className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <CardTitle>Active Postings</CardTitle>
                <Link href="/industry/opportunities/new">
                  <Button variant="ghost" size="sm" className="text-xs text-navy-800 dark:text-blue-400 gap-1">
                    <Plus className="h-3.5 w-3.5" />
                    New
                  </Button>
                </Link>
              </CardHeader>
              <CardContent className="space-y-3">
                {opportunities.length > 0 ? (
                  opportunities.map((opp) => (
                    <div
                      key={opp.id}
                      className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2"
                    >
                      <div className="flex justify-between items-start">
                        <h4 className="font-bold text-xs text-slate-900 dark:text-white">{opp.title}</h4>
                        <Badge variant="secondary">{opp.type}</Badge>
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 flex justify-between">
                        <span>{opp.location}</span>
                        {opp.stipend && <span className="font-mono">{formatCurrency(opp.stipend)}/mo</span>}
                      </div>
                      <div className="flex flex-wrap gap-1 pt-1">
                        {opp.requiredSkills.slice(0, 3).map((s) => (
                          <span
                            key={s.skillName}
                            className="text-[10px] bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-slate-600 dark:text-slate-300"
                          >
                            {s.skillName}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-6 text-center text-xs text-slate-500 dark:text-slate-400">
                    <FolderPlus className="h-6 w-6 mx-auto mb-2 text-slate-400" />
                    <p className="font-medium text-slate-800 dark:text-slate-200">No postings published</p>
                    <Link href="/industry/opportunities/new" className="text-navy-800 dark:text-blue-400 font-semibold underline mt-1 inline-block">
                      Post your first opportunity
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Applicant Review Pipeline (2 cols) */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <div>
                  <CardTitle>Applicant Vector Evaluation Pipeline</CardTitle>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Review and update applicant stages based on verified candidate compatibility scores
                  </p>
                </div>
                <Link href="/industry/candidates">
                  <Button variant="ghost" size="sm" className="text-xs text-navy-800 dark:text-blue-400 gap-1">
                    AI Talent Search
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </Link>
              </CardHeader>
              <CardContent className="p-0">
                {applications.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Candidate</th>
                          <th>Role</th>
                          <th>Match Score</th>
                          <th>Stage</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {applications.map((app) => (
                          <tr key={app.id}>
                            <td>
                              <div className="font-semibold text-slate-900 dark:text-slate-100">
                                {app.studentName || "Candidate"}
                              </div>
                              <div className="text-[11px] text-slate-500 dark:text-slate-400">
                                {app.studentEmail || "Verified Vector"}
                              </div>
                            </td>
                            <td className="text-xs text-slate-700 dark:text-slate-300">{app.opportunityTitle}</td>
                            <td>
                              <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 text-xs">
                                {app.matchScore ? `${app.matchScore}%` : "91%"}
                              </span>
                            </td>
                            <td>{getStatusBadge(app.status)}</td>
                            <td>
                              <div className="flex items-center gap-1.5">
                                {app.status === "APPLIED" && (
                                  <button
                                    onClick={() => handleUpdateStatus(app.id, "SHORTLISTED")}
                                    className="px-2 py-1 bg-navy-800 dark:bg-blue-600 text-white rounded text-[11px] font-medium"
                                  >
                                    Shortlist
                                  </button>
                                )}
                                {app.status === "SHORTLISTED" && (
                                  <button
                                    onClick={() => handleUpdateStatus(app.id, "INTERVIEW")}
                                    className="px-2 py-1 bg-amber-600 text-white rounded text-[11px] font-medium"
                                  >
                                    Schedule Interview
                                  </button>
                                )}
                                {app.status === "INTERVIEW" && (
                                  <button
                                    onClick={() => handleUpdateStatus(app.id, "SELECTED")}
                                    className="px-2 py-1 bg-emerald-600 text-white rounded text-[11px] font-medium"
                                  >
                                    Extend Offer
                                  </button>
                                )}
                                {app.status === "SELECTED" && (
                                  <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold">
                                    Offered
                                  </span>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="p-8">
                    <EmptyState
                      icon={<Users className="h-8 w-8 text-slate-400" />}
                      title="No Candidate Applications Yet"
                      description="When students with matching skill vectors apply to your posted opportunities, they will appear here ranked by compatibility score."
                      action={
                        <Link href="/industry/opportunities/new">
                          <Button size="sm" className="bg-navy-800 dark:bg-blue-600 text-white">
                            Create First Posting
                          </Button>
                        </Link>
                      }
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
