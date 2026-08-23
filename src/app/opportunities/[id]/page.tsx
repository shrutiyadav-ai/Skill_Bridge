"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { MOCK_OPPORTUNITIES, MOCK_STUDENT_SKILLS } from "@/lib/mock-data";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  Briefcase,
  MapPin,
  Clock,
  Building2,
  Calendar,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  Share2,
  Send,
} from "lucide-react";

export default function OpportunityDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { data: session } = useSession();
  const studentEmail = session?.user?.email?.toLowerCase() || "";
  const studentName = session?.user?.name || "Applicant";

  const [applied, setApplied] = useState(false);
  const [isApplying, setIsApplying] = useState(false);

  const opp =
    MOCK_OPPORTUNITIES.find((o) => o.id === params.id) || MOCK_OPPORTUNITIES[0];

  useEffect(() => {
    if (studentEmail) {
      const stored = localStorage.getItem(`applications_${studentEmail}`);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (parsed.some((a: any) => a.opportunityId === opp.id)) {
            setApplied(true);
          }
        } catch (e) {}
      }
    }
  }, [studentEmail, opp.id]);

  const handleApply = async () => {
    setIsApplying(true);

    if (studentEmail) {
      const newApp = {
        id: `app-${Date.now()}`,
        opportunityId: opp.id,
        opportunityTitle: opp.title,
        companyName: opp.companyName,
        status: "APPLIED",
        appliedAt: new Date().toISOString(),
        studentName,
        studentEmail,
        matchScore: opp.compatibilityScore || 88,
      };

      const stored = localStorage.getItem(`applications_${studentEmail}`);
      const list = stored ? JSON.parse(stored) : [];
      localStorage.setItem(`applications_${studentEmail}`, JSON.stringify([newApp, ...list]));
    }

    try {
      await fetch("/api/student/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ opportunityId: opp.id }),
      });
    } catch (e) {
      console.log("Recorded application locally");
    }

    setTimeout(() => {
      setIsApplying(false);
      setApplied(true);
    }, 400);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-8 px-4 sm:px-8 transition-colors duration-150">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Link
            href="/opportunities"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Marketplace
          </Link>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            {session && (
              <Link href="/student/dashboard">
                <Button size="sm" variant="ghost" className="text-xs">
                  Dashboard
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Opportunity Card */}
        <Card>
          <CardHeader className="p-6 sm:p-8 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="secondary">{opp.type}</Badge>
                  {opp.remote && <Badge variant="outline">Remote Eligible</Badge>}
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  {opp.title}
                </h1>
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                  <Building2 className="h-4 w-4 text-slate-400" />
                  <span>{opp.companyName}</span>
                </div>
              </div>

              {opp.compatibilityScore && (
                <div className="p-4 bg-navy-50 dark:bg-navy-950/80 rounded-lg border border-navy-200 dark:border-blue-900/60 text-center shrink-0">
                  <span className="text-[10px] uppercase font-bold text-navy-700 dark:text-blue-400 block">
                    Your Vector Match
                  </span>
                  <div className="text-3xl font-extrabold text-navy-900 dark:text-blue-300 font-mono mt-0.5">
                    {opp.compatibilityScore}%
                  </div>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 block">High Compatibility</span>
                </div>
              )}
            </div>

            {/* Quick Metadata Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-lg bg-slate-50 dark:bg-slate-850/60 border border-slate-200 dark:border-slate-800 text-xs">
              <div>
                <span className="text-slate-400 block">Location</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5 block">{opp.location}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Stipend / Comp</span>
                <span className="font-mono font-bold text-slate-800 dark:text-slate-200 mt-0.5 block">
                  {opp.stipend ? `${formatCurrency(opp.stipend)}/mo` : "Standard Norms"}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block">Application Deadline</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5 block">
                  {formatDate(opp.deadline)}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block">Duration</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5 block">
                  {opp.duration || "Flexible"}
                </span>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-6 sm:p-8 space-y-6 pt-0">
            {/* Description */}
            <div className="space-y-2">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white uppercase tracking-wider">
                Position Overview
              </h3>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                {opp.description}
              </p>
            </div>

            {/* Required Skills Matrix */}
            <div className="space-y-3">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white uppercase tracking-wider">
                Required Skill Vector & Benchmarks
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {opp.requiredSkills.map((req) => (
                  <div
                    key={req.skillName}
                    className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850/50 flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-semibold text-slate-900 dark:text-slate-100 block">{req.skillName}</span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400">Weight: {req.weight}x</span>
                    </div>
                    <span className="font-mono font-bold text-navy-800 dark:text-blue-400 bg-white dark:bg-slate-900 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                      Req: {req.requiredLevel}%
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Apply Action CTA */}
            <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="text-xs text-slate-500 dark:text-slate-400">
                Submitting this application sends your verified skill vector and digital portfolio directly to the employer.
              </div>

              <div className="flex items-center gap-3 shrink-0">
                {applied ? (
                  <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 rounded-md text-emerald-800 dark:text-emerald-300 font-semibold text-xs">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    <span>Application Submitted</span>
                  </div>
                ) : (
                  <Button
                    size="lg"
                    disabled={isApplying}
                    onClick={handleApply}
                    className="gap-2 bg-navy-800 dark:bg-blue-600 text-white"
                  >
                    {isApplying ? "Transmitting Vector..." : "Apply with Verified Profile"}
                    <Send className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
