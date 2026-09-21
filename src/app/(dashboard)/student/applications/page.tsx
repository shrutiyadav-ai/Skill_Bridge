"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { MOCK_APPLICATIONS } from "@/lib/mock-data";
import { ApplicationItem } from "@/types";
import { formatDate, getStatusBadge } from "@/lib/utils";
import {
  FolderKanban,
  CheckCircle2,
  Clock,
  Calendar,
  Building2,
  Search,
  Filter,
  ExternalLink,
  XCircle,
} from "lucide-react";

export default function StudentApplicationsPage() {
  const { data: session } = useSession();
  const studentEmail = session?.user?.email?.toLowerCase() || "";
  const isDemoStudent =
    studentEmail === "aditya.sharma@iitd.ac.in" ||
    studentEmail === "priya.patel@nitt.ac.in";

  const [applications, setApplications] = useState<ApplicationItem[]>(isDemoStudent ? MOCK_APPLICATIONS : []);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (!isDemoStudent && studentEmail) {
      const stored = localStorage.getItem(`applications_${studentEmail}`);
      if (stored) {
        try {
          setApplications(JSON.parse(stored));
        } catch (e) {}
      }
    }
  }, [isDemoStudent, studentEmail]);

  const handleWithdraw = (appId: string) => {
    if (confirm("Are you sure you want to withdraw this application?")) {
      const updated = applications.filter((a) => a.id !== appId);
      setApplications(updated);
      if (!isDemoStudent && studentEmail) {
        localStorage.setItem(`applications_${studentEmail}`, JSON.stringify(updated));
      }
    }
  };

  const filteredApps = applications.filter((app) => {
    const matchesStatus = statusFilter === "ALL" || app.status === statusFilter;
    const matchesSearch =
      app.opportunityTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.companyName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-lg border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors duration-150">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">Application Pipeline</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Track status, interview schedules, and recruiter feedback in real time
            </p>
          </div>

          <Link href="/opportunities">
            <Button size="sm" className="gap-1.5 bg-navy-800 dark:bg-blue-600 text-white">
              Explore More Opportunities
            </Button>
          </Link>
        </div>

        {/* Filter & Search Bar */}
        <Card>
          <CardContent className="p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by role or company..."
                className="input-field pl-9 text-xs"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Filter className="h-3.5 w-3.5 text-slate-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="input-field text-xs py-2"
              >
                <option value="ALL">All Application Stages</option>
                <option value="APPLIED">Applied</option>
                <option value="UNDER_REVIEW">Under Review</option>
                <option value="SHORTLISTED">Shortlisted</option>
                <option value="INTERVIEW">Interview Scheduled</option>
                <option value="SELECTED">Offer Extended</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Applications List */}
        {filteredApps.length > 0 ? (
          <div className="space-y-4">
            {filteredApps.map((app) => (
              <Card key={app.id}>
                <CardContent className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-bold text-base text-slate-900 dark:text-white">{app.opportunityTitle}</h3>
                      {getStatusBadge(app.status)}
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 dark:text-slate-400">
                      <span className="font-medium flex items-center gap-1 text-slate-800 dark:text-slate-200">
                        <Building2 className="h-3.5 w-3.5 text-slate-400" />
                        {app.companyName}
                      </span>
                      <span>•</span>
                      <span>Applied on {formatDate(app.appliedAt)}</span>
                    </div>

                    {app.notes && (
                      <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-md border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300">
                        <span className="font-semibold text-slate-900 dark:text-white">Recruiter Update: </span>
                        {app.notes}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                    <button
                      onClick={() => handleWithdraw(app.id)}
                      className="px-3 py-1.5 text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded border border-rose-200 dark:border-rose-800/60 font-medium transition"
                    >
                      Withdraw
                    </button>
                    <Link href={`/opportunities/${app.opportunityId}`}>
                      <Button size="sm" variant="outline" className="text-xs">
                        View Posting
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <EmptyState
            title="No Applications Found"
            description={
              searchQuery || statusFilter !== "ALL"
                ? "No applications matched your filter criteria."
                : "You have not submitted any applications yet. Explore open internships and job postings to apply with your verified skill vector."
            }
            action={
              <Link href="/opportunities">
                <Button size="sm" className="bg-navy-800 dark:bg-blue-600 text-white">
                  Browse Opportunities
                </Button>
              </Link>
            }
          />
        )}
      </div>
    </DashboardLayout>
  );
}
